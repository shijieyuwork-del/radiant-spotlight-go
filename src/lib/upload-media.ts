import { supabase } from "@/integrations/supabase/client";

export type MediaBucket = "doctor-photos" | "short-videos";

export interface UploadOptions {
  /** Called with 0-100 as the request body streams to the server. */
  onProgress?: (percent: number) => void;
  /** Called before each automatic retry (attempt is 1-based: 1 = first retry). */
  onRetry?: (attempt: number, maxRetries: number) => void;
  /** Number of automatic retries on network/5xx failures. Default 2 (3 attempts total). */
  maxRetries?: number;
}

interface UploadResult {
  path: string;
  replaced: string | null;
}

class UploadError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-media`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * XHR-based upload (fetch cannot report upload progress). Resolves with the
 * stored path; rejects with UploadError carrying the HTTP status.
 */
const sendWithProgress = async (form: FormData, onProgress?: (percent: number) => void): Promise<UploadResult> => {
  const { data: { session } } = await supabase.auth.getSession();
  return new Promise<UploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", FUNCTION_URL);
    xhr.setRequestHeader("apikey", ANON_KEY);
    xhr.setRequestHeader("Authorization", `Bearer ${session?.access_token ?? ANON_KEY}`);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        onProgress?.(Math.min(99, Math.round((event.loaded / event.total) * 100)));
      }
    };
    xhr.onload = () => {
      let body: { path?: string; replaced?: string | null; error?: string } = {};
      try {
        body = JSON.parse(xhr.responseText || "{}");
      } catch {
        /* non-JSON error body */
      }
      if (xhr.status >= 200 && xhr.status < 300 && body.path) {
        onProgress?.(100);
        resolve({ path: body.path, replaced: body.replaced ?? null });
      } else if (xhr.status === 429) {
        // Rate limit / storage quota — never retried automatically
        reject(new UploadError(`已触发上传限制：${body.error || "请稍后再试"}`, 429));
      } else {
        reject(new UploadError(body.error || `上传失败（HTTP ${xhr.status}）`, xhr.status));
      }
    };
    xhr.onerror = () => reject(new UploadError("网络错误，请检查连接", 0));
    xhr.ontimeout = () => reject(new UploadError("上传超时", 0));
    xhr.timeout = 10 * 60 * 1000; // 10 min for large videos
    xhr.send(form);
  });
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Retries network errors and 5xx responses with exponential backoff; 4xx fails immediately. */
const invokeUpload = async (form: FormData, options: UploadOptions = {}): Promise<UploadResult> => {
  const { onProgress, onRetry, maxRetries = 2 } = options;
  let attempt = 0;
  for (;;) {
    try {
      return await sendWithProgress(form, onProgress);
    } catch (error) {
      const status = error instanceof UploadError ? error.status : 0;
      const retryable = status === 0 || status >= 500;
      if (!retryable || attempt >= maxRetries) throw error;
      attempt += 1;
      onRetry?.(attempt, maxRetries);
      onProgress?.(0);
      await sleep(1000 * 2 ** (attempt - 1)); // 1s, 2s, 4s…
    }
  }
};

/**
 * Uploads a doctor photo / short video through the upload-media edge function.
 * The function enforces server-side permission checks (admin only), file
 * type/size validation, and writes an audit log entry for every attempt.
 * Returns the storage path of the uploaded object.
 */
export const uploadMedia = async (bucket: MediaBucket, file: File, options: UploadOptions = {}): Promise<string> => {
  const form = new FormData();
  form.append("bucket", bucket);
  form.append("file", file);
  const { path } = await invokeUpload(form, options);
  return path;
};

/**
 * Replaces the media of an existing doctor/video record. The edge function
 * uploads the new file, updates the record's photo_path/storage_path, deletes
 * the old object, and audits the whole operation. Returns the new path.
 */
export const replaceMedia = async (bucket: MediaBucket, recordId: string, file: File, options: UploadOptions = {}): Promise<string> => {
  const form = new FormData();
  form.append("bucket", bucket);
  form.append("file", file);
  form.append("mode", "replace");
  form.append("recordId", recordId);
  const { path } = await invokeUpload(form, options);
  return path;
};

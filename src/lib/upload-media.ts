import { supabase } from "@/integrations/supabase/client";

export type MediaBucket = "doctor-photos" | "short-videos";

const invokeUpload = async (form: FormData): Promise<{ path: string; replaced: string | null }> => {
  const { data, error } = await supabase.functions.invoke("upload-media", { body: form });
  if (error) throw new Error(error.message || "上传失败");
  const result = data as { path?: string; replaced?: string | null; error?: string } | null;
  if (!result?.path) throw new Error(result?.error || "上传失败");
  return { path: result.path, replaced: result.replaced ?? null };
};

/**
 * Uploads a doctor photo / short video through the upload-media edge function.
 * The function enforces server-side permission checks (admin only), file
 * type/size validation, and writes an audit log entry for every attempt.
 * Returns the storage path of the uploaded object.
 */
export const uploadMedia = async (bucket: MediaBucket, file: File): Promise<string> => {
  const form = new FormData();
  form.append("bucket", bucket);
  form.append("file", file);
  const { path } = await invokeUpload(form);
  return path;
};

/**
 * Replaces the media of an existing doctor/video record. The edge function
 * uploads the new file, updates the record's photo_path/storage_path, deletes
 * the old object, and audits the whole operation. Returns the new path.
 */
export const replaceMedia = async (bucket: MediaBucket, recordId: string, file: File): Promise<string> => {
  const form = new FormData();
  form.append("bucket", bucket);
  form.append("file", file);
  form.append("mode", "replace");
  form.append("recordId", recordId);
  const { path } = await invokeUpload(form);
  return path;
};

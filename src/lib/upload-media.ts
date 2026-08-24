import { supabase } from "@/integrations/supabase/client";

export type MediaBucket = "doctor-photos" | "short-videos";

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
  const { data, error } = await supabase.functions.invoke("upload-media", { body: form });
  if (error) throw new Error(error.message || "上传失败");
  const path = (data as { path?: string } | null)?.path;
  if (!path) throw new Error((data as { error?: string } | null)?.error || "上传失败");
  return path;
};

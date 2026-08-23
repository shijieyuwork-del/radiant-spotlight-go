import { supabase } from "@/integrations/supabase/client";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

/** Create a signed URL for a private-bucket file. Returns "" on failure. */
export const signedUrl = async (bucket: string, path: string | null | undefined): Promise<string> => {
  if (!path) return "";
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, SEVEN_DAYS);
  return error || !data ? "" : data.signedUrl;
};

/** Batch-sign paths, returning a URL (or "") aligned with the input array. */
export const signedUrls = async (bucket: string, paths: (string | null | undefined)[]): Promise<string[]> => {
  const valid = paths.filter((p): p is string => Boolean(p));
  if (valid.length === 0) return paths.map(() => "");
  const { data, error } = await supabase.storage.from(bucket).createSignedUrls(valid, SEVEN_DAYS);
  if (error || !data) return paths.map(() => "");
  const byPath = new Map(data.map((d) => [d.path, d.signedUrl]));
  return paths.map((p) => (p ? byPath.get(p) ?? "" : ""));
};

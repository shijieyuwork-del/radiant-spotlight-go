import { supabase } from "@/integrations/supabase/client";

/**
 * All storage file access goes through the request-file-access edge function,
 * which enforces published-only access for non-admins and writes an audit log
 * entry for every request (including denied attempts).
 */
export const signedUrls = async (bucket: string, paths: (string | null | undefined)[]): Promise<string[]> => {
  const valid = paths.filter((p): p is string => Boolean(p));
  if (valid.length === 0) return paths.map(() => "");
  const { data, error } = await supabase.functions.invoke("request-file-access", {
    body: { bucket, paths: valid },
  });
  const urls = (data as { urls?: Record<string, string> } | null)?.urls;
  if (error || !urls) return paths.map(() => "");
  return paths.map((p) => (p ? urls[p] ?? "" : ""));
};

/** Create a signed URL for a private-bucket file. Returns "" on failure. */
export const signedUrl = async (bucket: string, path: string | null | undefined): Promise<string> => {
  if (!path) return "";
  return (await signedUrls(bucket, [path]))[0];
};

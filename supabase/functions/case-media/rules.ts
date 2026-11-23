export type MediaRow = { status: string; storage_path: string | null; cover_path: string | null };
export const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
export function mediaTarget(row: MediaRow | null, kind: string) {
  if (!row || row.status !== "published" || (kind !== "video" && kind !== "thumb")) return null;
  const path = kind === "video" ? row.storage_path : row.cover_path;
  if (!path || path.startsWith("/") || path.includes("\\") || path.includes("%") || path.includes(":") || path.split("/").some((part) => !part || part === "." || part === "..")) return null;
  return { bucket: kind === "video" ? "short-videos" : "video-covers", path };
}
export async function handleCaseMedia(req: Request, deps: {
  lookup: (id: string) => Promise<MediaRow | null>;
  sign: (bucket: string, path: string, seconds: number) => Promise<string | null>;
}, cors: Record<string, string> = {}) {
  const headers = { ...cors, "Cache-Control": "no-store" };
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "GET" && req.method !== "HEAD") return new Response("Method not allowed", { status: 405, headers: { ...headers, Allow: "GET, HEAD, OPTIONS" } });
  const match = new URL(req.url).pathname.match(/\/case-media\/([^/]+)\/(video|thumb)$/);
  if (!match || !UUID.test(match[1])) return new Response("Not found", { status: 404, headers });
  try {
    const target = mediaTarget(await deps.lookup(match[1]), match[2]);
    if (!target) return new Response("Not found", { status: 404, headers });
    const signed = await deps.sign(target.bucket, target.path, 3600);
    if (!signed) return new Response("Not found", { status: 404, headers });
    return new Response(null, { status: 302, headers: { ...cors, Location: signed, "Cache-Control": "public, max-age=1800" } });
  } catch { return new Response("Media temporarily unavailable", { status: 503, headers }); }
}

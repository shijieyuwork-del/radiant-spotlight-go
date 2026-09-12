/** Stored references, never temporary signed URLs or browser object URLs. */
export type ClinicGalleryItem = { kind: "original" } | { kind: "upload"; path: string };
export type ResolvedClinicGalleryItem = ClinicGalleryItem & { url?: string };
export const MAX_CLINIC_PHOTOS = 6;

/** null inherits the legacy photograph; [] intentionally displays no photographs. */
export function parseClinicGallery(value: unknown): ClinicGalleryItem[] | null {
  if (!Array.isArray(value)) return null;
  return value.filter((item): item is ClinicGalleryItem => item && (
    item.kind === "original" || (item.kind === "upload" && typeof item.path === "string" && Boolean(item.path))
  )).slice(0, MAX_CLINIC_PHOTOS);
}

export function clinicGalleryPaths(gallery: unknown, legacyPath?: string | null): string[] {
  const parsed = parseClinicGallery(gallery);
  return parsed === null ? (legacyPath ? [legacyPath] : [])
    : parsed.flatMap((item) => item.kind === "upload" ? [item.path] : []);
}

export function resolveClinicGallery(gallery: unknown, urls: Map<string, string>): ResolvedClinicGalleryItem[] | null {
  return parseClinicGallery(gallery)?.map((item) => item.kind === "upload"
    ? { ...item, url: urls.get(item.path) ?? "" } : item) ?? null;
}

import type { TikTokItem } from "@/components/TikTokWall";
import { RETIRED_PREVIEW_CASES, TIKTOK_CASES } from "./tiktokCases";
import { GALLERY_CASES, RETIRED_GALLERY_CASES } from "./galleryCases";

/** One catalog for diary listings, video details and saved cases. First source wins. */
export function mergePatientDiaryCases(...sources: TikTokItem[][]): TikTokItem[] {
  const seen = new Set<string>();
  return sources.flat().filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export const PATIENT_DIARY_CASES = mergePatientDiaryCases(TIKTOK_CASES, GALLERY_CASES);

/** IDs of retired preview clips; their old links redirect to /cases. */
export const RETIRED_PREVIEW_CASE_IDS = new Set(
  mergePatientDiaryCases(RETIRED_PREVIEW_CASES, RETIRED_GALLERY_CASES).map((item) => item.id),
);

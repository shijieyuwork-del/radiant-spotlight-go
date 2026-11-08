import type { TikTokItem } from "@/components/TikTokWall";
import { TIKTOK_CASES } from "./tiktokCases";
import { GALLERY_CASES } from "./galleryCases";

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

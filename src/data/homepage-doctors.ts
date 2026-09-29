import type { PublishedDoctor } from "@/hooks/use-published-doctors";

// The six published profiles selected for the homepage, in the displayed order.
// IDs, not translated names, keep the selection stable across locales and tied dates.
export const HOMEPAGE_DOCTOR_IDS = [
  "78b0fec5-0a51-4b54-88bf-a5de66e0c67e", // Wu Hao
  "64a2b418-ea5a-4ef5-9655-37bfac12b42d", // Li Bing
  "313fb63c-2904-44d7-b12d-2447c0ea1ce1", // Yuan
  "c4188a03-c11e-4543-8deb-ea91c6dd5e85", // Bai Jianshe
  "e1be754d-aa22-4ca6-913e-ed1ceab3cd8b", // Zhou Hongqing
  "3676bf83-40ed-4503-bca2-e9184062384e", // Wang Peisheng
] as const;

// Keep each face at the same horizontal and vertical position in the photo area.
// Offsets are relative to the fixed 250px square portrait, not the card width.
export const HOMEPAGE_DOCTOR_PORTRAIT_FRAMING: Record<string, { x: number; y: number; scale?: number }> = {
  "78b0fec5-0a51-4b54-88bf-a5de66e0c67e": { x: -6, y: 0 },
  "64a2b418-ea5a-4ef5-9655-37bfac12b42d": { x: 1, y: 6 },
  "313fb63c-2904-44d7-b12d-2447c0ea1ce1": { x: 6, y: 5 },
  "c4188a03-c11e-4543-8deb-ea91c6dd5e85": { x: 1, y: 9 },
  "e1be754d-aa22-4ca6-913e-ed1ceab3cd8b": { x: 5, y: 4 },
  "3676bf83-40ed-4503-bca2-e9184062384e": { x: 27, y: 2, scale: 1.12 },
};

export function selectHomepageDoctors<T extends Pick<PublishedDoctor, "id">>(published: T[]): T[] {
  // Only render records returned by the published-only API; never resurrect a withdrawn profile.
  return HOMEPAGE_DOCTOR_IDS.flatMap((id) => {
    const doctor = published.find((item) => item.id === id);
    return doctor ? [doctor] : [];
  });
}

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

// Optical centering of the existing square portraits. Offsets are percentages
// of the image width, so the same framing works on desktop and the mobile rail.
export const HOMEPAGE_DOCTOR_PORTRAIT_OFFSETS: Record<string, number> = {
  "78b0fec5-0a51-4b54-88bf-a5de66e0c67e": -6,
  "64a2b418-ea5a-4ef5-9655-37bfac12b42d": 1,
  "313fb63c-2904-44d7-b12d-2447c0ea1ce1": 12,
  "c4188a03-c11e-4543-8deb-ea91c6dd5e85": 6,
  "e1be754d-aa22-4ca6-913e-ed1ceab3cd8b": 1,
  "3676bf83-40ed-4503-bca2-e9184062384e": 23,
};

export function selectHomepageDoctors<T extends Pick<PublishedDoctor, "id">>(published: T[]): T[] {
  // Only render records returned by the published-only API; never resurrect a withdrawn profile.
  return HOMEPAGE_DOCTOR_IDS.flatMap((id) => {
    const doctor = published.find((item) => item.id === id);
    return doctor ? [doctor] : [];
  });
}

import { REMAINING_DOCTOR_PORTRAIT_RETOUCHES } from "./remaining-doctor-portrait-retouches";

/** Non-destructive photo refinements for 107 published doctors; three are excluded. */
export const DIRECTORY_DOCTOR_PORTRAIT_RETOUCHES: Record<string, { sourcePath: string; photo: string }> = {
  "13582f96-51c6-432d-ae88-6a8d468ec76d": { sourcePath: "imports/fu-018.webp", photo: "/images/doctors/directory-canon-v2/yuan-ju.webp" },
  "13df49f7-b9d0-4414-b676-a722b4f71724": { sourcePath: "imports/fu-013.webp", photo: "/images/doctors/directory-canon-v2/liu-yafei.webp" },
  "19f901b0-9cf4-4d4e-b1f2-74d339dc2215": { sourcePath: "imports/fu-014.webp", photo: "/images/doctors/directory-canon-v2/qian-feng.webp" },
  "313fb63c-2904-44d7-b12d-2447c0ea1ce1": { sourcePath: "imports/fu-003.webp", photo: "/images/doctors/directory-canon-v2/yuan.webp" },
  "3676bf83-40ed-4503-bca2-e9184062384e": { sourcePath: "imports/fu-008.webp", photo: "/images/doctors/directory-canon-v2/wang-peisheng.webp" },
  "56978e79-1ed6-4c20-b196-aa6fdf7a4cb7": { sourcePath: "imports/guimeishi-013.webp", photo: "/images/doctors/directory-canon-v2/wang-shuangping.webp" },
  "5ea7356c-f60d-40a2-8bb5-eb592897b2ad": { sourcePath: "imports/fu-016.webp", photo: "/images/doctors/directory-canon-v2/wang-mingming.webp" },
  "64a2b418-ea5a-4ef5-9655-37bfac12b42d": { sourcePath: "imports/fu-004.webp", photo: "/images/doctors/directory-canon-v2/li-bing.webp" },
  "742762a5-cc01-4ce3-a362-9f6e584a1510": { sourcePath: "imports/fu-006.webp", photo: "/images/doctors/directory-canon-v2/zhao.webp" },
  ...REMAINING_DOCTOR_PORTRAIT_RETOUCHES,
};

export function getDirectoryDoctorPortraitRetouch(doctor: { id: string; photo_path?: string | null; demo?: boolean }) {
  const retouch = DIRECTORY_DOCTOR_PORTRAIT_RETOUCHES[doctor.id];
  // A replacement or removal made in admin always takes precedence.
  return !doctor.demo && retouch?.sourcePath === doctor.photo_path ? retouch : undefined;
}

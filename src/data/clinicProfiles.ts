import type { DirectoryClinic } from "./clinicDirectory";

export type ClinicService = "eyes" | "nose" | "breast" | "body" | "facial" | "fat" | "scars" | "laser" | "injections" | "hair" | "dental" | "surgery" | "dermatology";

export type ClinicPublicProfile = {
  /** Complete directory identity; never attach facts by a shared brand substring. */
  identity: Pick<DirectoryClinic, "citySlug" | "nameEn" | "nameZh">;
  services: ClinicService[];
  serviceSourceUrl?: string;
  doctorDirectoryUrl?: string;
  campus?: {
    addressEn: string;
    addressZh: string;
    areaEn: string;
    areaZh: string;
    sourceUrl: string;
  };
  /** Review of public pages only, not medical, licence, or partnership verification. */
  sourcesReviewedOn: string;
  sourceUrls: string[];
  languageSupport: "not-confirmed";
};

export const CLINIC_PUBLIC_PROFILES: ClinicPublicProfile[] = [
  {
    identity: { citySlug: "shanghai", nameEn: "Shanghai Huamei Plastic Surgery Hospital", nameZh: "上海华美医疗美容医院" },
    services: [],
    campus: {
      addressEn: "Yuanshen Road: odd-numbered Nos. 125–135 (2nd–3rd floors), Nos. 139–147 and No. 155; Pudong New Area, Shanghai, China",
      addressZh: "上海市浦东新区源深路125–135号（单）2–3层、139–147号、155号",
      areaEn: "Pudong New Area", areaZh: "浦东新区",
      sourceUrl: "https://www.pudong.gov.cn/zwgk/14470.gkml_zhzw_ghjh/2026/41/350996/d9310ad7f81945cb8bc2c8c899a29cfb.pdf",
    },
    sourcesReviewedOn: "2026-09-08",
    sourceUrls: ["https://www.pudong.gov.cn/zwgk/14470.gkml_zhzw_ghjh/2026/41/350996/d9310ad7f81945cb8bc2c8c899a29cfb.pdf"],
    languageSupport: "not-confirmed",
  },
  {
    identity: { citySlug: "guangzhou", nameEn: "Guangzhou Huamei Aesthetic Hospital", nameZh: "广州华美医疗美容医院" },
    services: ["surgery", "dermatology", "dental"],
    serviceSourceUrl: "https://sthjj.gz.gov.cn/attachment/7/7708/7708339/9566270.pdf",
    campus: {
      addressEn: "493 Huangpu Avenue West, Tianhe District, Guangzhou, Guangdong, China",
      addressZh: "广州市天河区黄埔大道西493号",
      areaEn: "Tianhe District", areaZh: "天河区",
      sourceUrl: "https://www.ubeauty.cn/",
    },
    sourcesReviewedOn: "2026-09-08",
    sourceUrls: ["https://www.ubeauty.cn/", "https://sthjj.gz.gov.cn/attachment/7/7708/7708339/9566270.pdf"],
    languageSupport: "not-confirmed",
  },
];

export function findClinicPublicProfile(clinic: DirectoryClinic): ClinicPublicProfile | undefined {
  if (clinic.origin !== "directory") return undefined;
  const matches = CLINIC_PUBLIC_PROFILES.filter(({ identity }) =>
    clinic.citySlug === identity.citySlug && clinic.nameEn === identity.nameEn && clinic.nameZh === identity.nameZh,
  );
  return matches.length === 1 ? matches[0] : undefined;
}

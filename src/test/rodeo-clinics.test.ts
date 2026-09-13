import { describe, expect, it } from "vitest";
import { findCity } from "@/data/cities";
import { applyClinicRecords, STATIC_CLINICS, getClinicPath } from "@/data/clinicDirectory";
import { clinicPageMeta } from "@/lib/clinic-seo";

describe("RODEO branch onboarding", () => {
  const branches = STATIC_CLINICS.filter((clinic) => clinic.nameEn.startsWith("RODEO "));

  it("lists only the requested Shanghai flagship with a stable path", () => {
    expect(branches).toHaveLength(1);
    expect(branches.map((clinic) => clinic.citySlug)).toEqual(["shanghai"]);
    expect(branches.every((clinic) => !clinic.isPublic)).toBe(true);
    expect(branches.map(getClinicPath)).toEqual([
      "/clinics/shanghai-rodeo-rejuvenation-center-shanghai-flagship-n1yx3arfqnjp",
    ]);
    expect(branches[0].areaEn).toContain("Maoming South Road");
    expect(branches[0].descriptionEn).toContain("## Medical team");
    expect(branches[0].websiteUrl).toBe("https://rodeomed.com/");
    expect(branches[0].descriptionZh).toContain("## 品牌起源与发展");
  });

  it("does not add Suzhou and gives the flagship Shanghai metadata", () => {
    expect(findCity("suzhou")).toBeUndefined();
    expect(clinicPageMeta(branches[0]).structuredData.about).toMatchObject({ address: { addressLocality: "Shanghai" } });
  });

  it("keeps branch photos and descriptions editable through existing admin records", () => {
    const source = branches[0];
    const record = {
      id: "rodeo-shanghai", staticSlug: source.slug, citySlug: source.citySlug,
      nameEn: source.nameEn, nameZh: source.nameZh, areaEn: source.areaEn, areaZh: source.areaZh,
      descriptionEn: "Edited introduction", descriptionZh: "修改后的简介", photoUrl: "/saved-photo.png",
      photoGallery: [{ kind: "upload" as const, path: "rodeo-shanghai.png", url: "/saved-photo.png" }],
      websiteUrl: "https://rodeomed.com/", isPublic: false, hidden: false,
    };
    const merged = applyClinicRecords(STATIC_CLINICS, [record]);
    expect(merged.filter((clinic) => clinic.slug === source.slug)).toHaveLength(1);
    expect(merged.find((clinic) => clinic.slug === source.slug)).toMatchObject({ descriptionEn: "Edited introduction", photoGallery: record.photoGallery });
    expect(applyClinicRecords(STATIC_CLINICS, [{ ...record, hidden: true }]).find((clinic) => clinic.slug === source.slug)).toBeUndefined();
  });
});

import { afterEach, describe, expect, it } from "vitest";
import { createElement } from "react";
import { cleanup, render } from "@testing-library/react";
import PageMeta from "@/components/PageMeta";
import { STATIC_CLINICS, getClinicPath, type DirectoryClinic } from "@/data/clinicDirectory";
import { CLINIC_DIRECTORY_META, clinicPageMeta } from "@/lib/clinic-seo";
import { SITE_URL } from "@/lib/seo-config";

const facility: DirectoryClinic = {
  slug: "shanghai-test-hospital",
  citySlug: "shanghai",
  nameEn: "Test Hospital",
  nameZh: "测试医院",
  areaEn: "Xuhui District",
  areaZh: "徐汇区",
  aliases: [],
  doctorIds: [],
  origin: "directory",
};

afterEach(cleanup);

describe("clinic metadata shared by the browser and prerender", () => {
  it("uses only the listed names and location", () => {
    const meta = clinicPageMeta(facility);
    expect(meta.title).toBe("Test Hospital | Shanghai, China");
    expect(meta.path).toBe(getClinicPath(facility));
    expect(meta.description).toContain("Test Hospital (测试医院)");
    expect(meta.description).toContain("Xuhui District, Shanghai, China");
    expect(meta.structuredData.url).toBe(`${SITE_URL}${meta.path}`);
    expect(meta.structuredData.about).toEqual({
      "@type": "MedicalOrganization",
      "@id": `${SITE_URL}${meta.path}#facility`,
      name: "Test Hospital",
      alternateName: "测试医院",
      address: { "@type": "PostalAddress", addressCountry: "CN", addressLocality: "Shanghai" },
    });
  });

  it("does not label the province of Hainan as a city", () => {
    const meta = clinicPageMeta({ ...facility, citySlug: "hainan", areaEn: "Haikou" });
    expect(meta.description).toContain("Haikou, Hainan, China");
    expect(meta.structuredData.about).toMatchObject({
      address: { addressRegion: "Hainan", addressLocality: "Haikou", addressCountry: "CN" },
    });
    expect(clinicPageMeta({ ...facility, citySlug: "hainan", areaEn: "Hainan" }).structuredData.about).toMatchObject({
      address: { addressRegion: "Hainan", addressCountry: "CN" },
    });
    expect(JSON.stringify(clinicPageMeta({ ...facility, citySlug: "hainan", areaEn: "Hainan" }).structuredData)).not.toContain('"addressLocality":"Hainan"');
  });

  it("deduplicates an area equal to its destination and tolerates empty area text", () => {
    expect(clinicPageMeta({ ...facility, areaEn: "Shanghai" }).description).not.toContain("Shanghai, Shanghai");
    expect(clinicPageMeta({ ...facility, areaEn: "" }).description).toContain("— Shanghai, China.");
  });

  it("does not pretend that a medical-tourism zone is a hospital", () => {
    const meta = clinicPageMeta({
      ...facility,
      nameEn: "Bo'ao Lecheng International Medical Tourism Pilot Zone",
      nameZh: "博鳌乐城国际医疗旅游先行区",
      citySlug: "hainan",
      areaEn: "Bo'ao",
    });
    expect(meta.structuredData.about).toMatchObject({ "@type": "Place" });
  });

  it("does not infer credentials, outcomes, reviews, or medical services from a listing", () => {
    const text = JSON.stringify(clinicPageMeta({ ...facility, doctorIds: ["published-profile"] }).structuredData);
    for (const property of ["aggregateRating", "review", "award", "hasCredential", "hasCertification", "medicalSpecialty", "makesOffer", "isAcceptingNewPatients", "employee"]) {
      expect(text).not.toContain(`"${property}"`);
    }
  });

  it("gives every static directory entry a unique indexable path and title", () => {
    const metadata = STATIC_CLINICS.map(clinicPageMeta);
    expect(metadata).toHaveLength(STATIC_CLINICS.length);
    expect(new Set(metadata.map((meta) => meta.path)).size).toBe(metadata.length);
    expect(new Set(metadata.map((meta) => meta.title)).size).toBe(metadata.length);
    for (const meta of metadata) {
      expect(meta.path).toMatch(/^\/clinics\/[a-z0-9-]+$/);
      expect(meta.description).toContain("China");
      expect(meta.structuredData.url).toBe(`${SITE_URL}${meta.path}`);
    }
  });

  it("keeps the unfiltered directory canonical independent of client filters", () => {
    expect(CLINIC_DIRECTORY_META.path).toBe("/clinics");
    expect(CLINIC_DIRECTORY_META.title).toBe("Clinics & Hospitals in China");
    expect(CLINIC_DIRECTORY_META.structuredData.url).toBe(`${SITE_URL}/clinics`);
    expect(CLINIC_DIRECTORY_META.structuredData["@type"]).toBe("CollectionPage");
  });

  it("applies the shared metadata and readable clinic breadcrumb to the client head", () => {
    const meta = clinicPageMeta(facility);
    render(createElement(PageMeta, meta));
    expect(document.title).toBe(`${meta.title} | CeladonChina`);
    expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute("content", meta.description);
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute("href", `${SITE_URL}${meta.path}`);
    const schemas = JSON.parse(document.getElementById("page-meta-jsonld")!.textContent!);
    expect(schemas[0]).toEqual(meta.structuredData);
    expect(schemas[1].itemListElement.map((item: { name: string }) => item.name)).toEqual([
      "Home", "Clinics & Hospitals", meta.title,
    ]);
    expect(document.querySelectorAll("#page-meta-jsonld")).toHaveLength(1);
  });
});

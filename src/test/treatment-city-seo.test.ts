import { describe, expect, it } from "vitest";
import { buildTreatmentCities, matchesProcedure, newestRowTimestamp, procedureExperts, treatmentCityMeta } from "@/lib/treatment-city-seo";
import { ORGANIZATION_ENTITY, WEBSITE_ENTITY } from "@/lib/seo-config";
import { asiaLangLabel } from "@/lib/asia-i18n";
import type { CaseExpert, PublishedCase } from "@/lib/case-seo";

const video = (id: string, overrides: Partial<PublishedCase> = {}): PublishedCase => ({ id, title: "Case", procedure: "鼻综合", city: "上海", caption: null, doctor_id: null, storage_path: `medora/${id}.mp4`, cover_path: `medora/${id}.webp`, created_at: "2026-11-01T00:00:00Z", status: "published", i18n: {}, ...overrides });
const expert = (id: string, overrides: Partial<CaseExpert> = {}): CaseExpert => ({ id, name: "Expert", title: "Expert", hospital: "Clinic", city: "上海", specialties: ["鼻综合"], bio: "", credentials: null, languages: null, photo_path: null, created_at: "2026-11-02T00:00:00Z", status: "published", i18n: {}, ...overrides });
const page = (videos: PublishedCase[], doctors: CaseExpert[] = []) => buildTreatmentCities({ videos, doctors }).find((p) => p.procedureSlug === "rhinoplasty" && p.citySlug === "shanghai");
describe("data-backed treatment-city eligibility", () => {
  it("qualifies with exactly three covered published cases", () => {
    expect(page([video("a"), video("b"), video("c")])).toMatchObject({ caseCount: 3, doctorCount: 0 });
  });
  it("qualifies with exactly two published matching experts", () => {
    expect(page([], [expert("a"), expert("b")])).toMatchObject({ caseCount: 0, doctorCount: 2 });
  });
  it("omits a combination below both thresholds", () => {
    expect(page([video("a"), video("b")], [expert("a")])).toBeUndefined();
  });
  it("excludes cases without covers from the three-case threshold", () => {
    expect(page([video("a"), video("b"), video("c", { cover_path: null })])).toBeUndefined();
  });
  it("excludes unpublished records from either threshold", () => {
    expect(page([video("a"), video("b"), video("c", { status: "draft" })], [expert("a"), expert("b", { status: "draft" })])).toBeUndefined();
  });
  it("does not count an expert from another city", () => {
    expect(page([], [expert("a"), expert("b", { city: "广州" })])).toBeUndefined();
  });
  it("can qualify experts through their published procedure cases without covers", () => {
    expect(page([video("a", { doctor_id: "a", cover_path: null }), video("b", { doctor_id: "b", cover_path: null })], [expert("a", { specialties: [] }), expert("b", { specialties: [] })])).toMatchObject({ caseCount: 0, doctorCount: 2 });
  });
  it("ranks related experts by published case count, including uncovered cases", () => {
    expect(procedureExperts({ videos: [video("a", { doctor_id: "b", cover_path: null }), video("b", { doctor_id: "b", cover_path: null }), video("c", { doctor_id: "a" })], doctors: [expert("a"), expert("b")] }, "rhinoplasty").map((d) => d.id)).toEqual(["b", "a"]);
  });
  it("does not silently broaden procedures to different techniques", () => {
    expect(matchesProcedure("Revision Rhinoplasty", "rhinoplasty")).toBe(false);
    expect(matchesProcedure("鼻修复", "revision-rhinoplasty")).toBe(true);
  });
  it("uses the newest relevant row timestamp, not today's build date", () => {
    expect(page([video("a"), video("b"), video("c", { updated_at: "2026-11-15T08:00:00Z" })], [expert("a")])?.lastmod).toBe("2026-11-15T08:00:00.000Z");
    expect(newestRowTimestamp([])).toBeUndefined();
  });
  it("uses the existing China-wide rhinoplasty reference of 22800", () => {
    const qualified = page([video("a"), video("b"), video("c")]);
    if (!qualified) throw new Error("Expected qualified page");
    expect(treatmentCityMeta(qualified).description).toContain("China-wide reference: approximately ¥22,800, not a Shanghai-specific quote");
  });
});
describe("site-level organization schema", () => {
  it("sets the requested customer-service WhatsApp number", () => {
    expect(ORGANIZATION_ENTITY.contactPoint).toMatchObject({ telephone: "+8618267830823", contactType: "customer service" });
  });
  it("matches all fourteen supported site languages", () => {
    expect(ORGANIZATION_ENTITY.contactPoint.availableLanguage).toEqual(Object.keys(asiaLangLabel));
    expect(ORGANIZATION_ENTITY.contactPoint.availableLanguage).toHaveLength(14);
  });
  it("identifies a coordination organization, not a clinic, without inventing a search endpoint", () => {
    expect(ORGANIZATION_ENTITY["@type"]).toBe("Organization");
    expect(WEBSITE_ENTITY).not.toHaveProperty("potentialAction");
  });
});

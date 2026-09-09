import { describe, expect, it } from "vitest";
import { CITIES } from "@/data/cities";
import {
  STATIC_CLINICS,
  findClinicBySlug,
  getClinicPath,
  mergeClinicDirectory,
  type PublishedClinicDoctor,
} from "@/data/clinicDirectory";

const doctor = (id: string, overrides: Partial<PublishedClinicDoctor> = {}): PublishedClinicDoctor => ({
  id, name: `Doctor ${id}`, title: "Doctor", city: "Shanghai", hospital: "Example Clinic", i18n: {}, ...overrides,
});
const added = (rows: PublishedClinicDoctor[]) => mergeClinicDirectory(rows).filter((clinic) => clinic.origin === "published");

const PRIVATE_HOSPITALS = CITIES.flatMap((city) =>
  city.hospitals.filter((hospital) => !hospital.isPublic).map((hospital) => ({
    citySlug: city.slug, nameEn: hospital.en, nameZh: hospital.zh, areaEn: hospital.areaEn, areaZh: hospital.areaZh,
  })),
);

const FIRST_PRIVATE_CLINIC = STATIC_CLINICS.find((entry) => entry.nameZh === "上海华美医疗美容医院")!;
const SECOND_PRIVATE_CLINIC = STATIC_CLINICS.find((entry) => entry.nameZh === "上海薇琳医疗美容医院")!;

describe("clinic directory data", () => {
  it("preserves only private static records with unique, stable ASCII city-prefixed paths", () => {
    expect(STATIC_CLINICS).toHaveLength(PRIVATE_HOSPITALS.length);
    expect(new Set(STATIC_CLINICS.map(getClinicPath)).size).toBe(PRIVATE_HOSPITALS.length);
    expect(STATIC_CLINICS.map(({ citySlug, nameEn, nameZh, areaEn, areaZh }) => ({ citySlug, nameEn, nameZh, areaEn, areaZh }))).toEqual(PRIVATE_HOSPITALS);
    for (const clinic of STATIC_CLINICS) {
      expect(clinic.slug).toMatch(new RegExp(`^${clinic.citySlug}-[a-z0-9-]+$`));
      expect(getClinicPath(clinic)).toBe(getClinicPath(clinic.slug));
      expect(findClinicBySlug(clinic.slug)).toBe(clinic);
    }
    expect(findClinicBySlug("missing-clinic")).toBeUndefined();
  });

  it("associates multiple doctors with the same new clinic without mutating static data", () => {
    const result = added([doctor("second"), doctor("first"), doctor("first")]);
    expect(result).toHaveLength(1);
    expect(result[0].doctorIds).toEqual(["first", "second"]);
    expect(result[0]).toMatchObject({ citySlug: "shanghai", nameEn: "Example Clinic", origin: "published" });
    expect(STATIC_CLINICS.every((clinic) => clinic.doctorIds.length === 0)).toBe(true);
  });

  it("uses supplied complete bilingual names to attach doctors to an existing static clinic", () => {
    const result = mergeClinicDirectory([
      doctor("en", { hospital: FIRST_PRIVATE_CLINIC.nameEn.toUpperCase(), city: "上海" }),
      doctor("zh", { hospital: FIRST_PRIVATE_CLINIC.nameZh, city: " shanghai " }),
      doctor("bundle", { hospital: "华美（上海）", i18n: { en: { hospital: FIRST_PRIVATE_CLINIC.nameEn }, zh: { hospital: FIRST_PRIVATE_CLINIC.nameZh } } }),
    ]);
    expect(result).toHaveLength(PRIVATE_HOSPITALS.length);
    expect(findClinicBySlug(FIRST_PRIVATE_CLINIC.slug, result)).toMatchObject({ doctorIds: ["bundle", "en", "zh"], origin: "directory" });
    expect(findClinicBySlug(FIRST_PRIVATE_CLINIC.slug, result)?.aliases).toContain("华美（上海）");
  });

  it("merges a new bilingual clinic regardless of row order or primary language", () => {
    const rows = [
      doctor("zh", { hospital: "示例诊所", city: "上海", i18n: { en: { hospital: "Example Clinic", city: "Shanghai" } } }),
      doctor("en", { hospital: "Example Clinic", i18n: { zh: { hospital: "示例诊所" } } }),
    ];
    expect(mergeClinicDirectory(rows)).toEqual(mergeClinicDirectory([...rows].reverse()));
    expect(added(rows)).toHaveLength(1);
    expect(added(rows)[0]).toMatchObject({ nameEn: "Example Clinic", nameZh: "示例诊所", doctorIds: ["en", "zh"] });
    expect(added([rows[0]])[0].slug).toBe(added([rows[1]])[0].slug);
  });

  it("keeps same-name hospitals in different cities separate", () => {
    const result = added([doctor("shanghai"), doctor("beijing", { city: "北京" })]);
    expect(result).toHaveLength(2);
    expect(new Set(result.map((entry) => entry.slug)).size).toBe(2);
    expect(result.map((entry) => entry.citySlug).sort()).toEqual(["beijing", "shanghai"]);
  });

  it("does not match city substrings, unknown cities, malformed rows, or conflicting city translations", () => {
    const rows = [
      doctor("substring", { city: "Shanghai Pudong" }),
      doctor("unknown", { city: "Seoul" }),
      doctor("unknown-translated", { city: "Seoul", i18n: { en: { city: "Shanghai" } } }),
      doctor("city-conflict", { city: "Shanghai", i18n: { zh: { city: "北京" } } }),
      doctor("empty", { hospital: "   " }),
      { ...doctor("bad"), hospital: null },
      { ...doctor("name"), name: null },
      null,
    ] as unknown as PublishedClinicDoctor[];
    expect(mergeClinicDirectory(rows)).toEqual(STATIC_CLINICS);
  });

  it("ignores contradictory IDs and bilingual bridges between different static hospitals", () => {
    const rows = [
      doctor("conflict", { hospital: FIRST_PRIVATE_CLINIC.nameEn, i18n: { zh: { hospital: SECOND_PRIVATE_CLINIC.nameZh } } }),
      doctor("duplicate", { hospital: "Clinic One" }),
      doctor("duplicate", { hospital: "Clinic Two" }),
    ];
    expect(mergeClinicDirectory(rows)).toEqual(STATIC_CLINICS);
    expect(mergeClinicDirectory([...rows].reverse())).toEqual(STATIC_CLINICS);
  });

  it("does not let a bad bilingual row erase valid doctors at either static hospital", () => {
    const rows = [
      doctor("valid-a", { hospital: FIRST_PRIVATE_CLINIC.nameEn }),
      doctor("valid-b", { hospital: SECOND_PRIVATE_CLINIC.nameZh }),
      doctor("bad-translation", { hospital: FIRST_PRIVATE_CLINIC.nameEn, i18n: { zh: { hospital: SECOND_PRIVATE_CLINIC.nameZh } } }),
    ];
    const result = mergeClinicDirectory(rows);
    expect(result).toHaveLength(PRIVATE_HOSPITALS.length);
    expect(findClinicBySlug(FIRST_PRIVATE_CLINIC.slug, result)?.doctorIds).toEqual(["valid-a"]);
    expect(findClinicBySlug(SECOND_PRIVATE_CLINIC.slug, result)?.doctorIds).toEqual(["valid-b"]);
    expect(mergeClinicDirectory([...rows].reverse())).toEqual(result);
  });

  it("keeps direct static matches when an indirect alias bridge connects two hospitals", () => {
    const rows = [
      doctor("valid-a", { hospital: FIRST_PRIVATE_CLINIC.nameZh, i18n: { en: { hospital: "First Exact Alias" } } }),
      doctor("valid-b", { hospital: SECOND_PRIVATE_CLINIC.nameZh, i18n: { en: { hospital: "Second Exact Alias" } } }),
      doctor("indirect-bridge", { hospital: "First Exact Alias", i18n: { en: { hospital: "Second Exact Alias" } } }),
    ];
    const result = mergeClinicDirectory(rows);
    expect(result).toHaveLength(PRIVATE_HOSPITALS.length);
    expect(findClinicBySlug(FIRST_PRIVATE_CLINIC.slug, result)?.doctorIds).toEqual(["valid-a"]);
    expect(findClinicBySlug(SECOND_PRIVATE_CLINIC.slug, result)?.doctorIds).toEqual(["valid-b"]);
    expect(result.flatMap((entry) => entry.doctorIds)).not.toContain("indirect-bridge");
    expect(mergeClinicDirectory([...rows].reverse())).toEqual(result);
  });

  it("does not infer that similarly named hospitals or departments are the same facility", () => {
    const result = added([doctor("a", { hospital: "New Hospital" }), doctor("b", { hospital: "New Hospital · Plastic Surgery" })]);
    expect(result).toHaveLength(2);
  });

  it("fails closed on unanchored conflicting translations", () => {
    const rows = [
      doctor("a", { hospital: "Clinic One", i18n: { zh: { hospital: "重复中文名称" } } }),
      doctor("b", { hospital: "Clinic Two", i18n: { zh: { hospital: "重复中文名称" } } }),
    ];
    expect(added(rows)).toHaveLength(0);
  });

  it("provides safe distinct non-Latin and punctuation-collision slugs", () => {
    const rows = [
      doctor("a", { hospital: "甲医院" }), doctor("b", { hospital: "乙医院" }),
      doctor("c", { hospital: "Clinic A+B" }), doctor("d", { hospital: "Clinic A B" }),
    ];
    const result = added(rows);
    expect(result).toHaveLength(4);
    expect(new Set(result.map((entry) => entry.slug)).size).toBe(4);
    expect(result.every((entry) => /^[a-z0-9-]+$/.test(entry.slug))).toBe(true);
    expect(result).toEqual(added([...rows].reverse()));
    expect(getClinicPath("../outside")).toBe("/clinics/..%2Foutside");
  });

  it("resolves the earlier Chinese-only URL after a doctor adds the clinic's English translation", () => {
    const originalDoctor = doctor("original", { hospital: "新增示例诊所", city: "上海" });
    const originalClinic = added([originalDoctor])[0];
    const updated = mergeClinicDirectory([
      originalDoctor,
      doctor("translated", { hospital: "新增示例诊所", i18n: { en: { hospital: "New Example Clinic" } } }),
    ]);
    const currentClinic = updated.find((clinic) => clinic.doctorIds.includes("translated"))!;
    expect(currentClinic.slug).not.toBe(originalClinic.slug);
    expect(findClinicBySlug(originalClinic.slug, updated)).toBe(currentClinic);
    expect(findClinicBySlug(currentClinic.slug, updated)).toBe(currentClinic);
    expect(getClinicPath(currentClinic)).not.toBe(getClinicPath(originalClinic));
  });

  it("rejects ambiguous alias URLs, scopes aliases by city, and prefers an exact canonical URL", () => {
    const shared = added([doctor("shared", { hospital: "Shared Alias Clinic" })])[0];
    const clinics = added([
      doctor("one", { hospital: "First New Clinic" }),
      doctor("two", { hospital: "Second New Clinic" }),
      doctor("beijing", { hospital: "Beijing New Clinic", city: "Beijing" }),
    ]).map((clinic) => ({ ...clinic, aliases: [...clinic.aliases, "Shared Alias Clinic"] }));
    const shanghai = clinics.filter((clinic) => clinic.citySlug === "shanghai");
    const beijing = clinics.find((clinic) => clinic.citySlug === "beijing")!;
    expect(findClinicBySlug(shared.slug, clinics)).toBeUndefined();
    expect(findClinicBySlug(shared.slug, [shanghai[0], beijing])).toBe(shanghai[0]);
    const canonicalOwner = shanghai[0];
    const aliasClaimant = { ...shanghai[1], aliases: [...shanghai[1].aliases, canonicalOwner.nameEn] };
    expect(findClinicBySlug(canonicalOwner.slug, [aliasClaimant, canonicalOwner])).toBe(canonicalOwner);
    expect(findClinicBySlug(canonicalOwner.slug, [canonicalOwner, { ...canonicalOwner }])).toBeUndefined();
  });
});

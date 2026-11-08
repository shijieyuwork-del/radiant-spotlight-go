import { describe, expect, it, vi } from "vitest";
import { GALLERY_CASES } from "@/data/galleryCases";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { PATIENT_DIARY_CASES, mergePatientDiaryCases } from "@/data/patientDiaryCases";
import { resolveSavedCases } from "@/lib/saved-case-catalog";

vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));

describe("unified patient diary catalog", () => {
  it("keeps every existing diary and gallery video with its original URL", () => {
    expect(GALLERY_CASES.length).toBeGreaterThan(0);
    for (const item of [...TIKTOK_CASES, ...GALLERY_CASES]) {
      expect(PATIENT_DIARY_CASES.find((entry) => entry.id === item.id)?.src).toBe(item.src);
    }
    expect(new Set(PATIENT_DIARY_CASES.map((item) => item.id)).size).toBe(PATIENT_DIARY_CASES.length);
  });

  it("deduplicates published/static overlaps without changing the preferred source", () => {
    const published = { ...GALLERY_CASES[0], src: "/updated-video.mp4" };
    const merged = mergePatientDiaryCases([published], PATIENT_DIARY_CASES);
    expect(merged.filter((item) => item.id === published.id)).toEqual([published]);
  });

  it("resolves every moved video in saved cases rather than marking it unavailable", () => {
    const entries = resolveSavedCases(GALLERY_CASES.map((item) => item.id), "en", []);
    expect(entries).toHaveLength(GALLERY_CASES.length);
    expect(entries.every((entry) => entry.kind === "published" && entry.title && entry.caption)).toBe(true);
  });
});

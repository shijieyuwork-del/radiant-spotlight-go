import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import CaseCategoryNavigation, { CASE_AREAS, caseCategoryLabel, caseProcedureType, matchesCaseCategory } from "./CaseCategoryNavigation";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import type { AsiaLang } from "@/lib/asia-i18n";
vi.mock("@/lib/asia-i18n", () => ({ useAsia: () => ({ lang: "en" }) }));
afterEach(cleanup);
const sample = (en: string, zh = "") => ({ treatment: { en, zh } });
describe("case project classification", () => {
  it("provides the reference's five areas and thirteen procedure groups", () => {
    expect(CASE_AREAS).toHaveLength(5);
    expect(CASE_AREAS.flatMap(area => [...area.types])).toHaveLength(13);
    const langs: AsiaLang[] = ["en", "zh", "ru", "es", "th", "ms", "vi", "ko", "ja", "ar", "pt-BR", "id", "fr", "de"];
    for (const lang of langs) for (const area of CASE_AREAS) {
      expect(caseCategoryLabel(`area:${area.id}`, lang)).toBeTruthy();
      for (const type of area.types) expect(caseCategoryLabel(`type:${type}`, lang)).toBeTruthy();
    }
  });
  it.each([["Rhinoplasty", "nose"], ["Eyelid surgery", "eyes"], ["Facelift", "contour"], ["Neck Lift", "contour"], ["Facial Injectables", "injectables"], ["Facial Fat Grafting", "contour"], ["Breast Augmentation", "breast"], ["BBL", "body"], ["Hairline consultation & recovery", "hair"], ["Porcelain Veneers", "veneers"], ["Teeth Whitening", "whitening"], ["Clear Aligners", "smile"], ["IPL Photofacial", "laser"], ["Ultrasound Skin Tightening", "tightening"], ["PRP Skin Rejuvenation", "aging"]])("classifies %s by the published procedure", (name, type) => {
    expect(caseProcedureType(sample(name))).toBe(type);
  });
  it("preserves exact procedure filtering and never guesses unknown procedures", () => {
    expect(matchesCaseCategory(sample("Facelift"), "area:face")).toBe(true);
    expect(matchesCaseCategory(sample("Facelift"), "type:eyes")).toBe(false);
    expect(matchesCaseCategory(sample("Facelift"), "Facelift")).toBe(true);
    expect(caseProcedureType(sample("Unspecified procedure"))).toBeNull();
    expect(matchesCaseCategory(sample("Unspecified procedure"), "area:skin")).toBe(false);
    expect(TIKTOK_CASES.every(item => caseProcedureType(item))).toBe(true);
  });
  it("links home entries to persistent case filters", () => {
    render(<MemoryRouter><CaseCategoryNavigation /></MemoryRouter>);
    expect(screen.getByRole("link", { name: "Hair Transplant" })).toHaveAttribute("href", "/cases?treatment=type%3Ahair");
    expect(screen.getByRole("link", { name: "Face" })).toHaveAttribute("href", "/cases?treatment=area%3Aface");
  });
  it("shows real zero counts and calls the category selection handler", () => {
    const select = vi.fn();
    render(<MemoryRouter><CaseCategoryNavigation items={TIKTOK_CASES} value="area:face" onSelect={select} /></MemoryRouter>);
    expect(screen.getByRole("button", { name: /^Face / })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Teeth Whitening 0" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /^Hair Transplant / }));
    expect(select).toHaveBeenCalledWith("type:hair");
  });
});

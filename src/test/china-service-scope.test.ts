import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CITIES } from "@/data/cities";
import { DOCTORS, findDoctor } from "@/data/doctors";
import { LANDING_PAGES } from "@/data/landingPages";
import { translatedUiText } from "@/lib/locale-text";
import { getPlanningMarketingCopy } from "@/lib/planning-marketing-copy";

const read = (path: string) => readFileSync(join(__dirname, "..", path), "utf8");

describe("China-only public service scope", () => {
  it("exposes legacy expert profiles only inside the published China service area", () => {
    const cities = new Set(CITIES.map((city) => city.en));
    expect(DOCTORS.length).toBeGreaterThan(0);
    for (const doctor of DOCTORS) expect(cities.has(doctor.cityEn)).toBe(true);
    for (const id of ["kim-minsoo", "park-sooyoung", "somchai-viriya", "tanaka-yuki", "lim-weijie"]) {
      expect(findDoctor(id)).toBeUndefined();
    }
  });

  it("preserves the China-only city landing page boundary", () => {
    const cities = new Set(CITIES.map((city) => city.slug));
    for (const page of LANDING_PAGES) expect(cities.has(page.citySlug)).toBe(true);
  });

  it("removes stale multi-country service and old brand wording from routed public surfaces", () => {
    const files = [
      "pages/AsiaIndex.tsx", "pages/BeforeAfterGallery.tsx", "pages/Doctors.tsx",
      "pages/Cases.tsx", "pages/Treatments.tsx", "pages/ProcedureCityLandingPage.tsx",
      "pages/About.tsx", "components/Footer.tsx", "lib/generated-translations.ts",
    ];
    for (const file of files) {
      expect(read(file), file).not.toMatch(/Cosmetics Asia|across Asia|three countries|China · Korea · Japan|Find partner clinics in China, South Korea and Japan/);
    }
    expect(read("pages/WhyChina.tsx")).toContain('title="Why Choose China for Cosmetic Medical Travel"');
    const prerender = readFileSync(join(__dirname, "..", "..", "prerender.mjs"), "utf8");
    expect(prerender).not.toMatch(/Destinations in Asia|Profiles in Asia|across Asia|medical travel in Asia|Explore Seoul/);
  });

  it("keeps new homepage scope copy available in Thai and Malay", () => {
    for (const lang of ["th", "ms"] as const) {
      for (const english of [
        "China-only coordination",
        "Plan your care in China",
        "Explore clinics in China and get help coordinating consultations and travel within China.",
        "Deposit returned on surgery day",
      ]) {
        expect(translatedUiText(lang, english)).not.toBe(english);
      }
      const photoDescription = getPlanningMarketingCopy(lang).photoDescription;
      expect(photoDescription.length).toBeGreaterThan(0);
      expect(photoDescription).not.toBe(getPlanningMarketingCopy("en").photoDescription);
    }
  });
});

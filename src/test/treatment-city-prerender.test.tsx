import { describe, expect, it } from "vitest";
import { render } from "@/entry-server";
import * as cases from "@/lib/case-seo";
import * as treatments from "@/lib/treatment-city-seo";
import * as directory from "@/data/clinicDirectory";
import { SITE_URL } from "@/lib/seo-config";
import { loadPublicCaseSnapshot, scopePublicCaseData, generateVideoSitemap } from "../../scripts/public-case-snapshot.mjs";
import { internationalMeta, INTERNATIONAL_GUIDES } from "@/data/internationalPatients";
import { mkdir, writeFile } from "node:fs/promises";
import nodePath from "node:path";

// Explicit opt-in: local unit tests remain deterministic without live network access.
describe.skipIf(process.env.SA_LIVE_SEO_TEST !== "1")("live published treatment-city static HTML", () => {
  it("renders the qualifying page and its links from the real public snapshot", async () => {
    const helpers = { ...cases, ...treatments, ...directory, SITE_URL };
    const data = await loadPublicCaseSnapshot(helpers);
    // Optional browser-verification artifacts contain public records only, never signed access URLs.
    const checkDir = process.env.SA_SSG_CHECK_DIR;
    if (checkDir) {
      await mkdir(checkDir, { recursive: true });
      const caseRow = data.videos.find((v) => v.cover_url);
      if (!caseRow) throw new Error("No mirrored published cover to verify");
      const casePath = cases.casePath(caseRow, data.doctors.find((d) => d.id === caseRow.doctor_id));
      const pages = [["cases", "/cases"], ["home", "/"], ["case", casePath]];
      for (const [name, route] of pages) {
        const scoped = scopePublicCaseData(route, data, helpers);
        // Expert photo URLs are temporary access grants; omit them from saved artifacts.
        scoped.doctors.forEach((doc) => { doc.photo = ""; });
        await writeFile(nodePath.join(checkDir, `${name}.html`), render(route, scoped));
        await writeFile(nodePath.join(checkDir, `${name}.json`), JSON.stringify(scoped));
      }
      await writeFile(nodePath.join(checkDir, "case-path.txt"), casePath);
      await writeFile(nodePath.join(checkDir, "covers.json"), JSON.stringify(data.coverManifest));
    }
    console.log(`Published snapshot: ${data.videos.length} videos, ${data.doctors.length} experts, ${data.treatmentCities.length} qualifying treatment-city pages`);
    console.log("Qualifying routes:", data.treatmentCities.map(treatments.treatmentCityPath).join(", "));
    console.log("Qualification counts:", data.treatmentCities.map((p) => `${treatments.treatmentCityPath(p)}: ${p.doctorCount} experts, ${p.caseCount} indexable cases`).join("; "));
    const page = data.treatmentCities.find((p) => p.caseCount >= 3 && p.doctorCount > 0) ?? data.treatmentCities[0];
    if (!page) throw new Error("No qualified treatment-city page");
    const path = treatments.treatmentCityPath(page);
    const html = render(path, scopePublicCaseData(path, data, helpers));
    expect(html).toContain("<h1");
    expect(html).toContain(treatments.treatmentCityMeta(page).title);
    if (page.caseCount) {
      expect(html).toContain("/cases/");
      expect(html).toContain("case-media/");
    }
    if (page.doctorCount) expect(html).toContain("/doctors/profile/");
    expect(html).not.toContain("Loading expert profiles");
    for (const qualified of data.treatmentCities) {
      const qualifiedPath = treatments.treatmentCityPath(qualified);
      expect(render(qualifiedPath, scopePublicCaseData(qualifiedPath, data, helpers))).toContain(treatments.treatmentCityMeta(qualified).title);
    }
    const parent = `/treatments/${page.procedureSlug}`;
    expect(render(parent, scopePublicCaseData(parent, data, helpers))).toContain(path);
    const cityPath = `/cities/${page.citySlug}`;
    expect(render(cityPath, scopePublicCaseData(cityPath, data, helpers))).toContain(path);
    const sitemap = generateVideoSitemap(data.videos, data.doctors, helpers);
    expect((sitemap.match(/<video:video>/g) ?? []).length).toBe(data.videos.filter((v) => v.cover_path).length);
    const languageGuides = INTERNATIONAL_GUIDES.map((g) => internationalMeta(g, SITE_URL)).filter((g) => g.alternates.length);
    expect(languageGuides).toHaveLength(2);
    for (const guide of languageGuides) {
      const localized = render(guide.path, scopePublicCaseData(guide.path, data, helpers));
      expect(localized).toContain("<h1");
      expect(guide.alternates.map((a) => a.language)).toEqual(["en", "vi-VN", "x-default"]);
    }
  }, 120000);
});

describe("covered-case treatment-city static rendering", () => {
  it("includes the three covered videos and canonical case links without browser JavaScript", () => {
    const videos: cases.PublishedCase[] = ["abcdef12", "abcdef13", "abcdef14"].map((prefix) => ({
      id: `${prefix}-1234-4567-8901-123456789012`, title: "Case", procedure: "鼻综合", city: "上海", caption: null,
      doctor_id: null, storage_path: `medora/${prefix}.mp4`, cover_path: `medora/${prefix}.webp`,
      created_at: "2026-11-01T00:00:00Z", status: "published", i18n: {},
    }));
    const data = { videos, doctors: [], clinics: [], treatmentCities: treatments.buildTreatmentCities({ videos, doctors: [] }), scopePath: "/treatments/rhinoplasty/shanghai" };
    const html = render(data.scopePath, data);
    expect((html.match(/<video /g) ?? []).length).toBe(3);
    for (const row of videos) {
      expect(html).toContain(`href="${cases.casePath(row)}"`);
      expect(html).toContain(`/case-media/${row.id}/thumb`);
      expect(html).toContain(`/case-media/${row.id}/video`);
    }
  });
});

import { describe, expect, it } from "vitest";

import { patientStories } from "@/data/patientStories";

describe("patient story data", () => {
  it("keeps nine patients with unique names", () => {
    expect(patientStories).toHaveLength(9);
    expect(new Set(patientStories.map(({ name }) => name)).size).toBe(9);
  });

  it("includes nonempty full stories in both languages", () => {
    for (const patient of patientStories) {
      for (const paragraphs of [patient.story, patient.storyZh]) {
        expect(paragraphs.length, patient.name).toBeGreaterThan(0);
        for (const paragraph of paragraphs) {
          expect(paragraph.trim().length, patient.name).toBeGreaterThan(0);
        }
      }
    }
  });

  it("uses compact, verbatim English excerpts from each patient's own story", () => {
    for (const patient of patientStories) {
      expect(patient.excerpt.trim().length, patient.name).toBeGreaterThan(0);
      expect(patient.story.join(" "), patient.name).toContain(patient.excerpt);
      expect(patient.excerpt.split(/\s+/).length, patient.name).toBeLessThanOrEqual(35);
    }
  });

  it("uses compact, verbatim Chinese excerpts from each patient's own story", () => {
    for (const patient of patientStories) {
      expect(patient.excerptZh.trim().length, patient.name).toBeGreaterThan(0);
      expect(patient.storyZh.join(""), patient.name).toContain(patient.excerptZh);
      expect(patient.excerptZh.length, patient.name).toBeLessThanOrEqual(60);
    }
  });
});

import { describe, expect, it } from "vitest";
import { asciiSlug, caseIdPrefix, casePageMeta, casePath, caseCoverUrl, expertName, resolveCase, type PublishedCase, type CaseExpert } from "@/lib/case-seo";

const row: PublishedCase = { id: "abcdef12-1234-4567-8901-123456789012", title: "Published case", procedure: "鼻综合", city: "上海", caption: null, doctor_id: "expert", storage_path: "medora/abc.mp4", cover_path: "medora/abc.webp", created_at: "2026-11-23T00:00:00Z", status: "published", i18n: { en: { procedure: "Rhinoplasty", city: "Shanghai" } } };
const expert: CaseExpert = { id: "expert", name: "廖柏臣", title: "Expert", hospital: "Listed clinic", city: "上海", specialties: [], bio: "", credentials: null, languages: null, photo_path: null, created_at: row.created_at, status: "published", i18n: { en: { name: "Liao Bochen" } } };
describe("canonical published case identities", () => {
  it("uses build-mirrored covers in metadata while keeping playback on case-media", () => {
    const cover_url = `/case-covers/${row.id}.webp?v=1234567890abcdef`;
    const meta = casePageMeta({ ...row, cover_url }, expert);
    expect(caseCoverUrl({ ...row, cover_url })).toBe(cover_url);
    expect(meta.image).toBe(`https://sinoaesthetics.com${cover_url}`);
    expect(meta.structuredData[0]).toMatchObject({ thumbnailUrl: meta.image, contentUrl: expect.stringContaining(`/case-media/${row.id}/video`) });
  });
  it("does not reuse a mirrored cover after the source path changes", () => {
    const script = document.createElement("script");
    script.id = "case-cover-data";
    script.type = "application/json";
    script.textContent = JSON.stringify({ [row.id]: { path: row.cover_path, url: `/case-covers/${row.id}.webp` } });
    document.body.appendChild(script);
    try {
      expect(caseCoverUrl(row)).toBe(`/case-covers/${row.id}.webp`);
      expect(caseCoverUrl({ ...row, cover_path: "changed.webp" })).toContain(`/case-media/${row.id}/thumb`);
    } finally { script.remove(); }
  });
  it("builds the specified procedure-city-pinyin-eight-character URL", () => {
    expect(casePath(row, expert)).toBe("/cases/rhinoplasty-shanghai-liao-bochen-abcdef12");
  });
  it("uses case when there is no linked expert", () => {
    expect(casePath(row)).toBe("/cases/rhinoplasty-shanghai-case-abcdef12");
  });
  it("romanizes a Chinese name when no English name is available", () => {
    expect(expertName({ name: "王林", i18n: {} })).toBe("wang lin");
    expect(casePath(row, { name: "王林", i18n: {} })).toBe("/cases/rhinoplasty-shanghai-wang-lin-abcdef12");
  });
  it("resolves old descriptive slugs by the stable trailing ID", () => {
    expect(resolveCase("old-procedure-old-city-case-abcdef12", [row])?.id).toBe(row.id);
    expect(caseIdPrefix("old-ABCDEF12")).toBe("abcdef12");
  });
  it("keeps existing UUID links resolvable", () => {
    expect(resolveCase(row.id, [row])?.id).toBe(row.id);
  });
  it("never resolves unpublished cases", () => {
    expect(resolveCase("anything-abcdef12", [{ ...row, status: "draft" }])).toBeUndefined();
    expect(resolveCase(row.id, [{ ...row, status: "draft" }])).toBeUndefined();
  });
  it("fails closed on ambiguous eight-character IDs", () => {
    expect(resolveCase("anything-abcdef12", [row, { ...row, id: "abcdef12-ffff-ffff-ffff-ffffffffffff" }])).toBeUndefined();
  });
  it("uses lowercase ASCII only", () => {
    expect(asciiSlug("Shànghái / A&B")).toBe("shanghai-a-b");
    expect(casePath(row, expert)).toMatch(/^\/cases\/[a-z0-9-]+$/);
  });
  it("excludes cases without covers from indexing and VideoObject markup", () => {
    const meta = casePageMeta({ ...row, cover_path: null }, expert);
    expect(meta.robots).toBe("noindex, follow");
    expect(meta.structuredData.some((schema) => schema["@type"] === "VideoObject")).toBe(false);
  });
  it("uses permanent media entrypoints rather than expiring signed URLs in schema", () => {
    const meta = casePageMeta(row, expert);
    expect(meta.robots).toBe("index, follow, max-image-preview:large");
    expect(meta.structuredData[0]).toMatchObject({ "@type": "VideoObject", thumbnailUrl: expect.stringContaining(`/case-media/${row.id}/thumb`), contentUrl: expect.stringContaining(`/case-media/${row.id}/video`), uploadDate: "2026-11-23T00:00:00.000Z" });
    expect(meta.structuredData[0]).not.toHaveProperty("aggregateRating");
    expect(meta.structuredData[0]).not.toHaveProperty("review");
  });
});

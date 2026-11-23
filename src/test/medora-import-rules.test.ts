import { describe, expect, it } from "vitest";
import { caseCreatedAt, caseLabels, caseStoragePath, decodeCover, isAdminEmail, linkedDoctorName, MAX_COVER_BYTES, uniqueDoctor, validateVideoSize, VIDEO_PREFIX } from "../../supabase/functions/import-medora-cases/rules";

const id = "1ea9684e238096a0fef8d8c564719b26";
describe("Medora import rules", () => {
  it("authorizes only the existing administrator email", () => {
    expect(isAdminEmail("shijieyuwork@gmail.com")).toBe(true);
    expect(isAdminEmail("visitor@example.com")).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
  });
  it("accepts only 32-hex IDs and the owned video prefix with mp4 or mov extensions", () => {
    expect(caseStoragePath(id, `${VIDEO_PREFIX}a/video.mp4`)).toBe(`medora/${id}.mp4`);
    expect(caseStoragePath(id, `${VIDEO_PREFIX}a/video.mov`)).toBe(`medora/${id}.mov`);
    expect(caseStoragePath("bad", `${VIDEO_PREFIX}video.mp4`)).toBeNull();
    expect(caseStoragePath(id, "https://example.com/video.mp4")).toBeNull();
    expect(caseStoragePath(id, `${VIDEO_PREFIX}../video.mp4`)).toBeNull();
    expect(caseStoragePath(id, `${VIDEO_PREFIX}video.webm`)).toBeNull();
  });
  it.each([
    ["nose-surgery", "Rhinoplasty", "鼻整形"],
    ["eye-surgery", "Eyelid surgery", "眼整形"],
    ["facial-contouring", "Facial contouring", "面部轮廓"],
    ["hair-transplant", "Hair Transplant", "植发"],
    ["injectables", "Injectables", "注射美容"],
    ["body-contouring", "Body contouring", "身体塑形"],
    ["breast", "Breast surgery", "胸部整形"],
    ["clinic-introduction", "Clinic introduction", "机构介绍"],
    ["uncategorized", "Cosmetic surgery", "整形案例"],
    ["unknown", "Cosmetic surgery", "整形案例"],
  ])("maps %s to the supplied procedures without names", (key, en, zh) => {
    const labels = caseLabels(key);
    expect(labels.en.procedure).toBe(en);
    expect(labels.zh.procedure).toBe(zh);
  });
  it("uses the fixed September timestamp plus the original manifest index in seconds", () => {
    expect(caseCreatedAt(0)).toBe("2026-09-01T00:00:00.000Z");
    expect(caseCreatedAt(527)).toBe("2026-09-01T00:08:47.000Z");
  });
  it("strips only a trailing 院长 for exact expert matching", () => {
    expect(linkedDoctorName("张三院长")).toBe("张三");
    expect(linkedDoctorName("院长张三")).toBe("院长张三");
  });
  it("refuses videos above 60 MB, including a misleading streamed size", () => {
    expect(() => validateVideoSize(60 * 1024 * 1024)).not.toThrow();
    expect(() => validateVideoSize(60 * 1024 * 1024 + 1)).toThrow("60 MB");
  });
  it("links an expert only when exactly one published exact-name match exists", () => {
    const expert = { id: "expert", city: "Shanghai" };
    expect(uniqueDoctor([expert])).toBe(expert);
    expect(uniqueDoctor([])).toBeNull();
    expect(uniqueDoctor([expert, { id: "another", city: "Beijing" }])).toBeNull();
  });
  it("enforces the 300 KB WebP cover ceiling", () => {
    expect(MAX_COVER_BYTES).toBe(300 * 1024);
    expect(() => decodeCover(btoa("not a webp"))).toThrow();
    expect(() => decodeCover("A".repeat(409604))).toThrow("300 KB");
  });
  it("accepts WebP bytes but not an image merely labeled WebP", () => {
    const bytes = new Uint8Array(20);
    bytes.set(new TextEncoder().encode("RIFF"), 0);
    new DataView(bytes.buffer).setUint32(4, 12, true);
    bytes.set(new TextEncoder().encode("WEBPVP8 "), 8);
    const raw = btoa(String.fromCharCode(...bytes));
    expect(decodeCover(`data:image/webp;base64,${raw}`)).toEqual(bytes);
    expect(() => decodeCover(`data:image/png;base64,${raw}`)).toThrow();
  });
});
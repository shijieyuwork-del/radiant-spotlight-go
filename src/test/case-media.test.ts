import { describe, expect, it, vi } from "vitest";
import { handleCaseMedia, mediaTarget } from "../../supabase/functions/case-media/rules";
const id = "abcdef12-1234-4567-8901-123456789012";
const published = { status: "published", storage_path: "medora/project/expert/final-result.mp4", cover_path: "medora/project/expert/final-result.webp" };
const request = (kind = "video", method = "GET") => new Request(`https://example.com/functions/v1/case-media/${id}/${kind}`, { method });
describe("public case media published-only access", () => {
  it.each(["draft", "hidden", "archived", "unpublished"])("never signs a %s case", async (status) => {
    const sign = vi.fn();
    const response = await handleCaseMedia(request(), { lookup: async () => ({ ...published, status }), sign });
    expect(response.status).toBe(404);
    expect(sign).not.toHaveBeenCalled();
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });
  it("returns 404 for missing records", async () => {
    const sign = vi.fn();
    expect((await handleCaseMedia(request(), { lookup: async () => null, sign })).status).toBe(404);
    expect(sign).not.toHaveBeenCalled();
  });
  it.each([["video", "short-videos", published.storage_path], ["thumb", "video-covers", published.cover_path]])("redirects %s only to its fixed bucket for one hour", async (kind, bucket, path) => {
    const sign = vi.fn(async () => "https://example.com/signed-object");
    const response = await handleCaseMedia(request(kind), { lookup: async () => published, sign });
    expect(response.status).toBe(302);
    expect(sign).toHaveBeenCalledExactlyOnceWith(bucket, path, 3600);
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=1800");
    expect(response.headers.get("Location")).toBe("https://example.com/signed-object");
  });
  it("never signs a missing thumbnail", async () => {
    const sign = vi.fn();
    expect((await handleCaseMedia(request("thumb"), { lookup: async () => ({ ...published, cover_path: null }), sign })).status).toBe(404);
    expect(sign).not.toHaveBeenCalled();
  });
  it.each(["../secret", "/other-bucket/file.mp4", "https://example.com/file", "medora/%2e%2e/secret", "medora/../secret", "medora\\secret"])("rejects unsafe stored paths: %s", (path) => {
    expect(mediaTarget({ ...published, storage_path: path }, "video")).toBeNull();
  });
  it("rejects other media kinds and malformed IDs before any lookup", async () => {
    const lookup = vi.fn(); const sign = vi.fn();
    expect((await handleCaseMedia(request("doctor-photos"), { lookup, sign })).status).toBe(404);
    expect((await handleCaseMedia(new Request("https://example.com/case-media/not-an-id/video"), { lookup, sign })).status).toBe(404);
    expect(lookup).not.toHaveBeenCalled();
  });
  it("is read-only", async () => {
    const lookup = vi.fn(); const sign = vi.fn();
    expect((await handleCaseMedia(request("video", "POST"), { lookup, sign })).status).toBe(405);
    expect(lookup).not.toHaveBeenCalled();
  });
});

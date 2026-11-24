import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

// jsdom does not implement the Node build-time timeout signal.
beforeEach(() => vi.stubGlobal("AbortSignal", { timeout: () => undefined }));
afterEach(() => vi.unstubAllGlobals());
import { downloadPublishedCaseCovers } from "../../scripts/public-case-snapshot.mjs";

const base = "https://storage.example.test";
const id = "abcdef12-1234-4567-8901-123456789012";
const row = { id, status: "published", cover_path: "published/cover.webp" };
const webp = Buffer.from("RIFF0000WEBPcompressed-cover");
async function withDirectory(run) {
  const directory = await mkdtemp(path.join(tmpdir(), "case-covers-test-"));
  try { return await run(directory); } finally { await rm(directory, { recursive: true, force: true }); }
}
describe("build-time published cover mirroring", () => {
  it("downloads only published rows with covers and records exact added bytes", () => withDirectory(async (directory) => {
    const videos = [{ ...row }, { ...row, id: "bbbbbbbb-1234-4567-8901-123456789012", status: "draft" }, { ...row, cover_path: null }];
    const requests = [];
    const report = await downloadPublishedCaseCovers(videos, { directory, base, headers: {}, fetchImpl: async (url, options) => {
      requests.push(url);
      if (options.method === "POST") {
        expect(JSON.parse(options.body)).toEqual({ bucket: "video-covers", paths: [row.cover_path] });
        return Response.json({ urls: { [row.cover_path]: `${base}/signed/cover` } });
      }
      return new Response(webp);
    } });
    expect(report.downloaded).toBe(1);
    expect(report.bytes).toBe(webp.length);
    expect(requests).toHaveLength(2);
    expect(await readFile(path.join(directory, `${id}.webp`))).toEqual(webp);
    expect(videos[0].cover_url).toMatch(new RegExp(`^/case-covers/${id}\\.webp\\?v=[a-f0-9]{16}$`));
    expect(report.manifest[id].path).toBe(row.cover_path);
  }));
  it("keeps missing or invalid covers on the existing endpoint fallback", () => withDirectory(async (directory) => {
    const video = { ...row };
    const report = await downloadPublishedCaseCovers([video], { directory, base, headers: {}, fetchImpl: async (_url, options) => options.method === "POST" ? Response.json({ urls: { [row.cover_path]: `${base}/missing` } }) : new Response("not webp") });
    expect(report.downloaded).toBe(0);
    expect(report.missing).toBe(1);
    expect(video.cover_url).toBeUndefined();
  }));
  it("never downloads a signed response pointing at an unrelated host", () => withDirectory(async (directory) => {
    let calls = 0;
    const report = await downloadPublishedCaseCovers([{ ...row }], { directory, base, headers: {}, fetchImpl: async () => {
      calls++;
      return Response.json({ urls: { [row.cover_path]: "https://untrusted.example.test/cover" } });
    } });
    expect(calls).toBe(1);
    expect(report.missing).toBe(1);
  }));
  it("caps each signing request at 50 paths", () => withDirectory(async (directory) => {
    const videos = Array.from({ length: 51 }, (_, i) => ({ ...row, id: `${String(i).padStart(8, "0")}-1234-4567-8901-123456789012`, cover_path: `published/${i}.webp` }));
    const batches = [];
    await downloadPublishedCaseCovers(videos, { directory, base, headers: {}, fetchImpl: async (_url, options) => {
      batches.push(JSON.parse(options.body).paths.length);
      return Response.json({ urls: {} });
    } });
    expect(batches).toEqual([50, 1]);
  }));
});
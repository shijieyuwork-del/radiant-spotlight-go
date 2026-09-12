import { beforeEach, describe, expect, it, vi } from "vitest";
import { signedUrls } from "@/lib/storage-urls";
const { invoke } = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { functions: { invoke } } }));
beforeEach(() => { invoke.mockReset(); });
describe("gallery storage access", () => {
  it("deduplicates, batches at 50, and preserves the input order and blanks", async () => {
    invoke.mockImplementation(async (_name, { body }) => ({ data: { urls: Object.fromEntries(body.paths.map((path: string) => [path, `signed:${path}`])) }, error: null }));
    const paths = Array.from({ length: 123 }, (_, i) => `photo-${i}`);
    const result = await signedUrls("clinic-photos", [null, ...paths, paths[0]]);
    expect(invoke.mock.calls.map((call) => call[1].body.paths.length)).toEqual([50, 50, 23]);
    expect(result).toEqual(["", ...paths.map((path) => `signed:${path}`), "signed:photo-0"]);
  });
  it("does not invent URLs after a denied request", async () => {
    invoke.mockResolvedValue({ error: new Error("denied"), data: null });
    expect(await signedUrls("clinic-photos", ["unpublished.jpg", null])).toEqual(["", ""]);
  });
});

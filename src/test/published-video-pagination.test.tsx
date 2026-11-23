import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetCaseMediaProbe, usePublishedVideosState } from "@/hooks/use-published-videos";

const db = vi.hoisted(() => ({ mediaOk: true, range: vi.fn(), signed: vi.fn(), refresh: undefined as undefined | (() => void), rows: [] as Record<string, unknown>[] }));
vi.mock("@/lib/browser-client", () => ({ getBrowserClient: async () => ({ from: () => {
  const query = {
    select: () => query, eq: () => query, order: () => query,
    range: (start: number, end: number) => {
      db.range(start, end);
      return Promise.resolve({ data: db.rows.slice(start, end + 1), count: db.rows.length });
    },
  };
  return query;
} }) }));
vi.mock("@/lib/storage-urls", () => ({ signedUrls: (bucket: string, paths: string[]) => { db.signed(bucket, paths); return Promise.resolve(paths.map((p) => `signed:${p}`)); } }));
class FakeImage { onload: (() => void) | null = null; onerror: (() => void) | null = null; set src(_v: string) { queueMicrotask(() => (db.mediaOk ? this.onload : this.onerror)?.()); } }
vi.stubGlobal("Image", FakeImage);
beforeEach(() => {
  vi.clearAllMocks();
  db.mediaOk = true;
  resetCaseMediaProbe();
  db.rows = Array.from({ length: 57 }, (_, i) => ({ id: `video-${i}`, title: "Case", caption: null, city: null, procedure: "Rhinoplasty", storage_path: `medora/${i}.mp4`, cover_path: `medora/${i}.webp`, created_at: "2026-09-01T00:00:00Z", doctor_id: null, i18n: {} }));
});
afterEach(cleanup);

describe("published-video pagination", () => {
  it("defaults previews to 24 rows using stable case-media URLs without signing", async () => {
    const { result } = renderHook(() => usePublishedVideosState("en", "all"));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.items).toHaveLength(24);
    expect(db.range).toHaveBeenCalledWith(0, 23);
    expect(db.signed).not.toHaveBeenCalled();
    expect(result.current.items[0].poster).toMatch(/case-media\/video-0\/thumb$/);
    expect(result.current.items[0].src).toMatch(/case-media\/video-0\/video$/);
    expect(result.current.hasMore).toBe(false);
  });
  it("falls back to signing only the shown rows when case-media fails", async () => {
    db.mediaOk = false;
    const { result } = renderHook(() => usePublishedVideosState("en", "all"));
    await waitFor(() => expect(result.current.items).toHaveLength(24));
    expect(db.signed.mock.calls[0][1]).toHaveLength(24);
    expect(result.current.items[0].poster).toBe("signed:medora/0.webp");
  });
  it("appends 24 at a time, signing only newly shown rows on fallback, then stops at the total", async () => {
    db.mediaOk = false;
    const { result } = renderHook(() => usePublishedVideosState("en", "all", { paginate: true }));
    await waitFor(() => expect(result.current.items).toHaveLength(24));
    db.signed.mockClear();
    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.items).toHaveLength(48));
    expect(db.range).toHaveBeenLastCalledWith(24, 47);
    expect(db.signed.mock.calls[0][1]).toEqual(db.rows.slice(24, 48).map((r) => r.storage_path));
    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.items).toHaveLength(57));
    expect(db.range).toHaveBeenLastCalledWith(48, 71);
    expect(result.current.hasMore).toBe(false);
  });
  it("keeps the empty state and optional smaller preview limit", async () => {
    const { result, rerender } = renderHook(({ lang }: { lang: "en" | "zh" }) => usePublishedVideosState(lang, "diary", { limit: 6 }), { initialProps: { lang: "en" } });
    await waitFor(() => expect(result.current.items).toHaveLength(6));
    expect(db.range).toHaveBeenLastCalledWith(0, 5);
    db.rows = [];
    rerender({ lang: "zh" });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.items).toEqual([]);
  });
});
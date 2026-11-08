import { describe, expect, it, vi } from "vitest";

const mock = vi.hoisted(() => ({ evaluated: vi.fn(), client: { from: vi.fn() } }));
vi.mock("@/integrations/supabase/client", () => { mock.evaluated(); return { supabase: mock.client }; });

describe("deferred browser client", () => {
  it("evaluates no SDK until requested and caches one initialization", async () => {
    const { getBrowserClient } = await import("@/lib/browser-client");
    expect(mock.evaluated).not.toHaveBeenCalled();
    const first = getBrowserClient();
    expect(getBrowserClient()).toBe(first);
    expect(await first).toBe(mock.client);
    expect(mock.evaluated).toHaveBeenCalledTimes(1);
  });
});
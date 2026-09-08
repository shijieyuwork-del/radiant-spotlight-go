import { beforeEach, describe, expect, it, vi } from "vitest";
import { changeSavedCase, mergeGuestSavedCases, readSavedCaseIds, savedCasesStorageKey as key, type SavedStorage } from "@/lib/saved-cases-storage";

const put = (user: string | null, ids: string[]) => localStorage.setItem(key(user), JSON.stringify(ids));
beforeEach(() => { localStorage.clear(); });

describe("on-device saved case storage", () => {
  it("saves a guest immediately and preserves the existing account key and legacy IDs", () => {
    put("account-a", ["rhinoplasty-beijing", "old-legacy-id"]);
    expect(changeSavedCase(localStorage, null, "new-guest-case", true)).toEqual({ ids: ["new-guest-case"], error: null });
    expect(key("account-a")).toBe("cosmetics-asia:saved-cases:account-a");
    expect(readSavedCaseIds(localStorage, "account-a").ids).toEqual(["rhinoplasty-beijing", "old-legacy-id"]);
  });

  it("merges only guest choices into the signing-in account, deduplicates and never copies another account", () => {
    put(null, ["guest", "shared"]);
    put("a", ["private-a", "shared"]);
    put("b", ["private-b"]);
    expect(mergeGuestSavedCases(localStorage, "a")).toEqual({ ids: ["private-a", "shared", "guest"], error: null });
    expect(readSavedCaseIds(localStorage, null).ids).toEqual([]);
    expect(mergeGuestSavedCases(localStorage, "a").ids).toEqual(["private-a", "shared", "guest"]);
    expect(mergeGuestSavedCases(localStorage, "b").ids).toEqual(["private-b"]);
    expect(readSavedCaseIds(localStorage, "a").ids).toEqual(["private-a", "shared", "guest"]);
  });

  it("retains both lists when the migration write fails", () => {
    put(null, ["guest"]); put("a", ["old"]);
    const blocked: SavedStorage = { ...localStorage, setItem: () => { throw new Error("quota"); } };
    expect(mergeGuestSavedCases(blocked, "a").error).toBe("unavailable");
    expect(readSavedCaseIds(localStorage, "a").ids).toEqual(["old"]);
    expect(readSavedCaseIds(localStorage, null).ids).toEqual(["guest"]);
  });

  it("keeps a recoverable guest source when cleanup fails and retries without losing IDs", () => {
    put(null, ["guest"]); put("a", ["old"]);
    const blocked: SavedStorage = { ...localStorage, removeItem: () => { throw new Error("blocked"); } };
    expect(mergeGuestSavedCases(blocked, "a").error).toBe("unavailable");
    expect(readSavedCaseIds(localStorage, null).ids).toEqual(["guest"]);
    expect(mergeGuestSavedCases(localStorage, "a")).toEqual({ ids: ["old", "guest"], error: null });
  });

  it.each(["{bad-json", '{"ids":["old"]}', '["old",42]', '[""]'])("does not overwrite corrupt saved data: %s", (raw) => {
    localStorage.setItem(key(null), raw);
    const setItem = vi.fn(localStorage.setItem);
    const storage = { ...localStorage, setItem };
    expect(changeSavedCase(storage, null, "new", true).error).toBe("corrupt");
    expect(setItem).not.toHaveBeenCalled();
    expect(localStorage.getItem(key(null))).toBe(raw);
  });

  it("does not replace a malformed account when guests log in", () => {
    localStorage.setItem(key("a"), "invalid"); put(null, ["guest"]);
    expect(mergeGuestSavedCases(localStorage, "a").error).toBe("corrupt");
    expect(localStorage.getItem(key("a"))).toBe("invalid");
    expect(readSavedCaseIds(localStorage, null).ids).toEqual(["guest"]);
  });

  it("reports denied reads and writes without claiming the requested item was saved", () => {
    const deniedRead: SavedStorage = { ...localStorage, getItem: () => { throw new Error("denied"); } };
    expect(changeSavedCase(deniedRead, null, "new", true)).toEqual({ ids: [], error: "unavailable" });
    put(null, ["old"]);
    const deniedWrite: SavedStorage = { ...localStorage, setItem: () => { throw new Error("quota"); } };
    expect(changeSavedCase(deniedWrite, null, "new", true)).toEqual({ ids: ["old"], error: "unavailable" });
  });

  it("removes just one item and can restore it without removing the others", () => {
    put(null, ["one", "two"]);
    expect(changeSavedCase(localStorage, null, "one", false).ids).toEqual(["two"]);
    expect(changeSavedCase(localStorage, null, "one", true).ids).toEqual(["two", "one"]);
  });
});

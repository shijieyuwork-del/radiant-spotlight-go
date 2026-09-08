export type SavedStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type SavedStorageError = "unavailable" | "corrupt" | null;
export type SavedResult = { ids: string[]; error: SavedStorageError };
export const savedCasesStorageKey = (userId: string | null) => `cosmetics-asia:saved-cases:${userId ?? "guest"}`;

/** Retains the original signed-in array format and every legacy case identifier. */
export function readSavedCaseIds(storage: SavedStorage, userId: string | null): SavedResult {
  let raw: string | null;
  try { raw = storage.getItem(savedCasesStorageKey(userId)); }
  catch { return { ids: [], error: "unavailable" }; }
  if (raw === null) return { ids: [], error: null };
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value) || value.some((id) => typeof id !== "string" || !id.trim())) return { ids: [], error: "corrupt" };
    return { ids: [...new Set(value as string[])], error: null };
  } catch { return { ids: [], error: "corrupt" }; }
}

/** Copy before clearing: a failed migration never deletes the guest source. */
export function mergeGuestSavedCases(storage: SavedStorage, userId: string): SavedResult {
  const account = readSavedCaseIds(storage, userId);
  if (account.error) return account;
  const guest = readSavedCaseIds(storage, null);
  if (guest.error) return { ...account, error: guest.error };
  if (!guest.ids.length) return account;
  const ids = [...new Set([...account.ids, ...guest.ids])];
  try {
    storage.setItem(savedCasesStorageKey(userId), JSON.stringify(ids));
    storage.removeItem(savedCasesStorageKey(null));
    return { ids, error: null };
  } catch { return { ...readSavedCaseIds(storage, userId), error: "unavailable" }; }
}

export function changeSavedCase(storage: SavedStorage, userId: string | null, caseId: string, save: boolean): SavedResult {
  const current = userId ? mergeGuestSavedCases(storage, userId) : readSavedCaseIds(storage, null);
  if (current.error) return current;
  if (!caseId.trim()) return { ...current, error: "corrupt" };
  const ids = save ? [...new Set([...current.ids, caseId])] : current.ids.filter((id) => id !== caseId);
  try {
    storage.setItem(savedCasesStorageKey(userId), JSON.stringify(ids));
    return { ids, error: null };
  } catch { return { ...current, error: "unavailable" }; }
}

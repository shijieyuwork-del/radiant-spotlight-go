import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useAsia } from "@/lib/asia-i18n";
import { getSavedCasesCopy } from "@/lib/saved-cases-copy";
import { changeSavedCase, mergeGuestSavedCases, readSavedCaseIds, type SavedResult } from "@/lib/saved-cases-storage";

const eventName = "cosmetics-asia:saved-cases-changed";
const accessSaved = (scope: string | null): SavedResult => {
  try { return scope ? mergeGuestSavedCases(window.localStorage, scope) : readSavedCaseIds(window.localStorage, null); }
  catch { return { ids: [], error: "unavailable" }; }
};

export const useSavedCases = () => {
  const { user } = useAuth();
  const { lang } = useAsia();
  const copy = getSavedCasesCopy(lang);
  const scope = user?.id ?? null;
  const currentScope = useRef(scope);
  const mounted = useRef(true);
  currentScope.current = scope;
  const [state, setState] = useState<SavedResult & { scope: string | null }>({ scope, ids: [], error: null });
  const retry = useCallback(() => setState({ scope, ...accessSaved(scope) }), [scope]);

  useEffect(() => {
    mounted.current = true;
    retry();
    window.addEventListener(eventName, retry);
    window.addEventListener("storage", retry);
    return () => {
      mounted.current = false;
      window.removeEventListener(eventName, retry);
      window.removeEventListener("storage", retry);
    };
  }, [retry]);

  const setCaseSaved = useCallback((caseId: string, save: boolean) => {
    // An undo from a previous account must never modify the next account.
    if (!mounted.current || currentScope.current !== scope) return false;
    let result: SavedResult;
    try { result = changeSavedCase(window.localStorage, scope, caseId, save); }
    catch { result = { ids: [], error: "unavailable" }; }
    setState({ scope, ...result });
    if (result.error) {
      toast.error(result.error === "corrupt" ? copy.corruptError : copy.storageError);
      return false;
    }
    window.dispatchEvent(new Event(eventName));
    return true;
  }, [scope, copy]);

  // Do not expose the previous account's IDs during an auth transition.
  const current = state.scope === scope ? state : { ids: [], error: null };
  return { ...current, scope, signedIn: Boolean(user), retry, setCaseSaved };
};

/** Combines local lists after login even outside a case page. */
export const SavedCasesSync = () => { useSavedCases(); return null; };

export const useSavedCase = (caseId: string) => {
  const { lang } = useAsia();
  const copy = getSavedCasesCopy(lang);
  const { ids, scope, signedIn, setCaseSaved } = useSavedCases();
  const saved = ids.includes(caseId);
  const toggleSaved = useCallback(() => {
    const willSave = !accessSaved(scope).ids.includes(caseId);
    if (!setCaseSaved(caseId, willSave)) return;
    toast.success(willSave ? copy.saved : copy.removed, willSave ? undefined : {
      action: { label: copy.undo, onClick: () => { setCaseSaved(caseId, true); } },
    });
  }, [caseId, scope, setCaseSaved, copy]);
  return { saved, toggleSaved, signedIn, saveLabel: saved ? copy.remove : copy.save };
};

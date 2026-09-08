import { useEffect, useState } from "react";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { supabase } from "@/integrations/supabase/client";
import { localizeVideoRow } from "@/lib/i18n-content";
import { translatedUiText } from "@/lib/locale-text";
import type { AsiaLang } from "@/lib/asia-i18n";

export type SavedCaseEntry = { id: string; kind: "demo" | "published" | "unavailable"; title?: string; caption?: string; city?: string };
export type SavedPublishedRow = { id: string; title: string; caption?: string | null; city?: string | null; i18n?: unknown };
const isPublishedId = (id: string) => /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id);
export const savedPublishedIds = (ids: string[]) => ids.filter((id) => isPublishedId(id) && !TIKTOK_CASES.some((item) => item.id === id));

export function resolveSavedCases(ids: string[], lang: AsiaLang, published: SavedPublishedRow[]): SavedCaseEntry[] {
  return ids.map((id) => {
    const demo = TIKTOK_CASES.find((item) => item.id === id);
    if (demo) return {
      id, kind: "demo", title: lang === "zh" ? demo.treatment.zh : translatedUiText(lang, demo.treatment.en),
      caption: lang === "zh" ? demo.caption.zh : demo.caption.en,
      city: lang === "zh" ? demo.city?.zh : demo.city?.en,
    };
    const row = published.find((item) => item.id === id);
    if (!row) return { id, kind: "unavailable" };
    const localized = localizeVideoRow(row as unknown as Record<string, unknown>, lang) as unknown as SavedPublishedRow;
    return { id, kind: "published", title: localized.title, caption: localized.caption ?? undefined, city: localized.city ?? undefined };
  });
}

export function useSavedCaseCatalog(ids: string[], lang: AsiaLang) {
  const idKey = JSON.stringify(savedPublishedIds(ids));
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{ key: string; rows: SavedPublishedRow[]; loading: boolean; error: boolean }>({ key: "", rows: [], loading: false, error: false });
  useEffect(() => {
    let cancelled = false;
    const publishedIds = JSON.parse(idKey) as string[];
    if (!publishedIds.length) {
      setState({ key: idKey, rows: [], loading: false, error: false });
      return;
    }
    setState({ key: idKey, rows: [], loading: true, error: false });
    void (async () => {
      try {
        const { data, error } = await supabase.from("videos")
          .select("id,title,caption,city,i18n").eq("status", "published").in("id", publishedIds);
        if (cancelled) return;
        setState({ key: idKey, rows: (data ?? []) as SavedPublishedRow[], loading: false, error: Boolean(error) });
      } catch {
        if (!cancelled) setState({ key: idKey, rows: [], loading: false, error: true });
      }
    })();
    return () => { cancelled = true; };
  }, [idKey, attempt]);
  const current = state.key === idKey ? state : { rows: [], loading: idKey !== "[]", error: false };
  return { entries: resolveSavedCases(ids, lang, current.rows), loading: current.loading, error: current.error, retry: () => setAttempt((value) => value + 1) };
}

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { signedUrls } from "@/lib/storage-urls";
import { localizedField, type Lang } from "@/lib/i18n-content";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";

export type BeforeAfterRow = {
  id: string;
  created_at: string;
  doctor_id: string | null;
  title: string;
  caption: string | null;
  procedure: string | null;
  city: string | null;
  before_path: string;
  after_path: string;
  months_after: number | null;
  status: string;
  i18n: unknown;
  beforeUrl?: string;
  afterUrl?: string;
  doctorName?: string;
};

/** 已发布的术前术后对比案例（带签名图片链接、专家姓名，内容变更实时刷新）。 */
export const usePublishedBeforeAfter = (lang: Lang, doctorId?: string) => {
  const [items, setItems] = useState<BeforeAfterRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    let query = supabase
      .from("before_after_cases")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });
    if (doctorId) query = query.eq("doctor_id", doctorId);
    const { data } = await query;
    const rows = (data ?? []) as BeforeAfterRow[];

    const doctorIds = [...new Set(rows.map((r) => r.doctor_id).filter((v): v is string => Boolean(v)))];
    const names = new Map<string, string>();
    if (doctorIds.length > 0) {
      const { data: docs } = await supabase.from("doctors").select("id,name,i18n").in("id", doctorIds);
      for (const d of (docs ?? []) as { id: string; name: string; i18n: unknown }[]) {
        names.set(d.id, localizedField(d.i18n, "name", lang, d.name));
      }
    }

    const [beforeUrls, afterUrls] = await Promise.all([
      signedUrls("before-after", rows.map((r) => r.before_path)),
      signedUrls("before-after", rows.map((r) => r.after_path)),
    ]);

    setItems(
      rows.map((r, i) => ({
        ...r,
        title: localizedField(r.i18n, "title", lang, r.title),
        caption: localizedField(r.i18n, "caption", lang, r.caption) || null,
        procedure: localizedField(r.i18n, "procedure", lang, r.procedure) || null,
        city: localizedField(r.i18n, "city", lang, r.city) || null,
        beforeUrl: beforeUrls[i],
        afterUrl: afterUrls[i],
        doctorName: r.doctor_id ? names.get(r.doctor_id) ?? "" : "",
      }))
    );
    setLoading(false);
  }, [lang, doctorId]);

  useEffect(() => {
    void load();
  }, [load]);

  useRealtimeRefresh(["before_after_cases"], () => {
    void load();
  });

  return { items, loading };
};

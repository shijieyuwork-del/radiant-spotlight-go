import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAsia } from "@/lib/asia-i18n";
import { getBrowserClient } from "@/lib/browser-client";
import { caseFacts, casePath, type PublishedCase } from "@/lib/case-seo";
import { usePublicCaseData } from "@/lib/public-case-data";

/** All known links render in static HTML; browser fetches stay at 24 records per page. */
export default function LinkedCaseLinks({ doctorIds }: { doctorIds: string[] }) {
  const { lang } = useAsia();
  const initial = usePublicCaseData();
  const key = [...doctorIds].sort().join(",");
  const [rows, setRows] = useState<PublishedCase[]>(() => initial?.videos.filter((v) => Boolean(v.doctor_id && doctorIds.includes(v.doctor_id))) ?? []);
  const [shown, setShown] = useState(24);
  const [hasMore, setHasMore] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    setShown(24);
    if (!key) { setRows([]); return; }
    setError(false);
    void (async () => {
      const client = await getBrowserClient();
      const { data, count, error } = await client.from("videos").select("*,doctors(name,i18n,status)", { count: "exact" }).eq("status", "published").in("doctor_id", key.split(",")).order("created_at", { ascending: false }).order("id").range(0, 23);
      if (active && !error) { setRows((data ?? []) as PublishedCase[]); setHasMore((count ?? 0) > 24); }
    })().catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [key]);
  async function loadMore() {
    if (busy) return;
    setBusy(true);
    try {
      const client = await getBrowserClient();
      const { data, count, error: queryError } = await client.from("videos").select("*,doctors(name,i18n,status)", { count: "exact" }).eq("status", "published").in("doctor_id", key.split(",")).order("created_at", { ascending: false }).order("id").range(rows.length, rows.length + 23);
      if (queryError) throw queryError;
      setRows([...rows, ...(data ?? []) as PublishedCase[]]); setShown(shown + 24); setHasMore(rows.length + (data?.length ?? 0) < (count ?? 0));
    } catch { setError(true); } finally { setBusy(false); }
  }
  const visible = typeof window === "undefined" ? rows : rows.slice(0, shown);
  return <><ul className="mt-4 space-y-3">{visible.map((v) => <li key={v.id}><Link className="text-brand underline" to={casePath(v, initial?.doctors.find((d) => d.id === v.doctor_id) || (v.doctors?.status === "published" ? v.doctors : undefined))}>{caseFacts(v, lang).procedure} · {caseFacts(v, lang).city}</Link></li>)}</ul>{hasMore && <Button className="mt-4" variant="outline" disabled={busy} onClick={() => void loadMore()}>{lang === "zh" ? "加载更多" : "Load more"}</Button>}{error && <p role="alert" className="mt-3 text-sm text-muted-foreground">{lang === "zh" ? "案例暂时无法加载。" : "Cases are temporarily unavailable."}</p>}</>;
}

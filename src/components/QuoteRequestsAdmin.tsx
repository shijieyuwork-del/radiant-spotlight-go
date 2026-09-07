import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Mail, Phone, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";
import { Input } from "@/components/ui/input";

type QuoteRow = {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  phone_prefix: string | null;
  phone: string;
  country: string;
  procedure: string;
  contact_method: string;
  expert_name: string | null;
  city: string | null;
  preferred_slot: string | null;
  notes: string | null;
  source: string | null;
};

const Field = ({ label, value }: { label: string; value: string | null }) =>
  value ? (
    <div className="text-sm">
      <span className="text-muted-foreground">{label}：</span>
      <span className="font-medium">{value}</span>
    </div>
  ) : null;

export default function QuoteRequestsAdmin() {
  const [rows, setRows] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("quote_requests load failed:", error);
    setRows((data as QuoteRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);
  useRealtimeRefresh(["quote_requests"], load);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.name, r.email, r.phone, r.country, r.procedure, r.expert_name, r.city, r.notes, r.source]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [rows, query]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-10 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> 加载中…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索姓名、邮箱、电话、项目…"
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-sm text-muted-foreground">暂无咨询记录。</p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {filtered.map((r) => {
            const fullPhone = `${r.phone_prefix ?? ""} ${r.phone}`.trim();
            return (
              <article key={r.id} className="rounded-xl border border-border bg-card p-4">
                <header className="mb-2 flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold">{r.name}</h3>
                  <time className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()}
                  </time>
                </header>
                <div className="space-y-1">
                  <Field label="项目" value={r.procedure} />
                  <Field label="国家 / 地区" value={r.country} />
                  <Field label="联系方式偏好" value={r.contact_method} />
                  <Field label="专家" value={r.expert_name} />
                  <Field label="城市" value={r.city} />
                  <Field label="期望时间" value={r.preferred_slot} />
                  <Field label="备注" value={r.notes} />
                  <Field label="来源" value={r.source} />
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  {r.email && (
                    <a className="inline-flex items-center gap-1.5 text-primary underline" href={`mailto:${r.email}`}>
                      <Mail className="size-4" />
                      {r.email}
                    </a>
                  )}
                  <a
                    className="inline-flex items-center gap-1.5 text-primary underline"
                    href={`tel:${fullPhone.replace(/\s+/g, "")}`}
                  >
                    <Phone className="size-4" />
                    {fullPhone}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

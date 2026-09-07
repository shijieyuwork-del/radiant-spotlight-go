import { useMemo, useState } from "react";
import { CalendarClock, Mail, MapPin, MessageCircle, Phone, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export type QuoteRequestRow = {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  phone_prefix: string | null;
  phone: string;
  country: string;
  procedure: string;
  notes: string | null;
  contact_method: string;
  expert_name: string | null;
  city: string | null;
  preferred_slot: string | null;
  source: string | null;
};

const formatDate = (value: string) => new Intl.DateTimeFormat("zh-CN", {
  dateStyle: "medium",
  timeStyle: "short",
}).format(new Date(value));

export default function QuoteRequestsAdmin({ requests }: { requests: QuoteRequestRow[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return requests;
    return requests.filter((request) => [
      request.name,
      request.email,
      request.phone,
      request.country,
      request.procedure,
      request.expert_name,
      request.notes,
    ].filter(Boolean).join(" ").toLowerCase().includes(needle));
  }, [query, requests]);

  return (
    <section className="space-y-4" aria-labelledby="quote-requests-title">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 id="quote-requests-title" className="font-display text-2xl font-semibold">客户咨询请求</h2>
          <p className="mt-1 text-sm text-muted-foreground">每次客户提交都会保存到这里，最新请求排在最前。</p>
        </div>
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索姓名、邮箱、电话或项目…"
            className="rounded-full pl-9"
            aria-label="搜索客户咨询请求"
          />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {filtered.map((request) => {
          const fullPhone = `${request.phone_prefix ?? ""} ${request.phone}`.trim();
          return (
            <article key={request.id} className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold">{request.name}</h3>
                  <p className="mt-1 font-medium text-primary">{request.procedure}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {request.contact_method === "whatsapp" ? <MessageCircle className="size-3" /> : <Mail className="size-3" />}
                  {request.contact_method === "whatsapp" ? "WhatsApp" : "邮箱"}
                </span>
              </div>

              <dl className="mt-4 grid gap-2 text-sm text-foreground/80">
                <div className="flex items-center gap-2"><CalendarClock className="size-4 shrink-0 text-muted-foreground" /><dt className="sr-only">提交时间</dt><dd>{formatDate(request.created_at)}</dd></div>
                <div className="flex items-center gap-2"><MapPin className="size-4 shrink-0 text-muted-foreground" /><dt className="sr-only">出发国家</dt><dd>{request.country}{request.city ? ` · 意向城市：${request.city}` : ""}</dd></div>
                <div className="flex items-center gap-2"><Phone className="size-4 shrink-0 text-muted-foreground" /><dt className="sr-only">电话</dt><dd><a className="underline decoration-primary/40 underline-offset-4 hover:text-primary" href={`tel:${fullPhone.replace(/\s/g, "")}`}>{fullPhone}</a></dd></div>
                {request.email && <div className="flex items-center gap-2"><Mail className="size-4 shrink-0 text-muted-foreground" /><dt className="sr-only">邮箱</dt><dd className="truncate"><a className="underline decoration-primary/40 underline-offset-4 hover:text-primary" href={`mailto:${request.email}`}>{request.email}</a></dd></div>}
              </dl>

              {(request.expert_name || request.preferred_slot || request.notes) && (
                <div className="mt-4 space-y-2 rounded-xl bg-muted/50 p-3 text-sm leading-relaxed">
                  {request.expert_name && <p><span className="font-semibold">意向专家：</span>{request.expert_name}</p>}
                  {request.preferred_slot && <p><span className="font-semibold">希望时间：</span>{request.preferred_slot}</p>}
                  {request.notes && <p className="whitespace-pre-wrap"><span className="font-semibold">客户留言：</span>{request.notes}</p>}
                </div>
              )}
              <p className="mt-3 text-xs text-muted-foreground">来源：{request.source || "site_cta"}</p>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
          {requests.length === 0 ? "目前还没有客户咨询请求。" : "没有符合搜索条件的咨询请求。"}
        </div>
      )}
    </section>
  );
}

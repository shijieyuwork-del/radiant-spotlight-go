import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

export type SortOption = { key: string; label: string };

/** 排序 chips：推荐 / 热度 / 最新 / 距离 */
export const SortChips = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: SortOption[];
  value: string;
  onChange: (key: string) => void;
}) => (
  <div className="flex flex-wrap items-center justify-center gap-2">
    <span className="mr-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
      <ArrowUpDown className="size-3" />
      {label}
    </span>
    {options.map((o) => (
      <button
        key={o.key}
        type="button"
        onClick={() => onChange(o.key)}
        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
          value === o.key
            ? "bg-primary text-primary-foreground shadow-soft"
            : "border border-border bg-card text-foreground hover:border-primary/50 hover:text-primary"
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

/** 数字分页：页数 ≤1 时不渲染 */
export const Pagination = ({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  // 页码窗口：总数 ≤7 全显，否则保留首尾并围绕当前页
  const pages: (number | "…")[] = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const set = new Set<number>([1, totalPages, page - 1, page, page + 1]);
    const sorted = Array.from(set).filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
    const out: (number | "…")[] = [];
    let prev = 0;
    for (const n of sorted) {
      if (prev && n - prev > 1) out.push("…");
      out.push(n);
      prev = n;
    }
    return out;
  })();

  const btn = "grid size-10 place-items-center rounded-full border border-border bg-card text-sm font-semibold transition hover:border-primary/50 hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground";

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button type="button" className={btn} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeft className="size-4" />
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-sm text-muted-foreground">…</span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={p === page ? "grid size-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-soft" : btn}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" className={btn} disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
};

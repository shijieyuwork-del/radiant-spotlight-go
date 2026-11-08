import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type Option = { key: string; label: string };

type Group = {
  id: string;
  title: string;
  allLabel: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  variant?: "chips" | "checks";
  includeAll?: boolean;
};

const FilterGroup = ({ group }: { group: Group }) => {
  const [open, setOpen] = useState(true);
  const options = group.includeAll === false ? group.options : [{ key: "", label: group.allLabel }, ...group.options];
  return (
    <div className="border-t border-border py-5">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center justify-between text-left">
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-foreground">{group.title}</span>
        <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && (
        group.variant === "chips" ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {options.map((o) => {
              const active = group.value === o.key;
              return (
                <button key={o.key || "all"} type="button" aria-pressed={active} onClick={() => group.onChange(o.key)}
                  className={`min-h-10 rounded-full border px-4 text-sm font-semibold transition ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>
                  {o.label}
                </button>
              );
            })}
          </div>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {options.map((o) => {
              const active = group.value === o.key;
              return (
                <li key={o.key || "all"}>
                  <button type="button" role="checkbox" aria-checked={active} onClick={() => group.onChange(active && o.key ? "" : o.key)}
                    className="flex w-full items-center gap-3 text-left text-sm">
                    <span className={`grid size-5 shrink-0 place-items-center rounded-md border transition ${active ? "border-primary bg-primary" : "border-border bg-card"}`}>
                      {active && <span className="size-2 rounded-[2px] bg-primary-foreground" />}
                    </span>
                    <span className={active ? "font-semibold text-foreground" : "text-muted-foreground"}>{o.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )
      )}
    </div>
  );
};

const CasesFilterSidebar = ({ title, clearLabel, onClear, groups, footer }: { title: string; clearLabel: string; onClear: () => void; groups: Group[]; footer?: ReactNode }) => (
  <aside aria-label={title} className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-border/70 bg-card px-6 pb-2 pt-6 shadow-soft">
    <div className="flex items-center justify-between pb-5">
      <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-foreground">{title}</h2>
      <button type="button" onClick={onClear} className="text-sm font-semibold text-brand hover:underline">{clearLabel}</button>
    </div>
    {groups.map((g) => <FilterGroup key={g.id} group={g} />)}
    {footer}
  </aside>
);

export default CasesFilterSidebar;

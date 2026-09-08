import { useId, useRef, type ReactNode } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";

/** Keeps procedure selection visible while secondary controls collapse on small screens. */
export default function CasesFilterDisclosure({ primary, selectedCount, expanded, onExpandedChange, children }: {
  primary: ReactNode;
  selectedCount: number;
  expanded: boolean;
  onExpandedChange: (value: boolean) => void;
  children: ReactNode;
}) {
  const { lang } = useAsia();
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const label = asiaCopy(lang, { en: "Filters", zh: "筛选", ru: "Фильтры", es: "Filtros", th: "ตัวกรอง", ms: "Penapis" });
  const countLabel = asiaCopy(lang, {
    en: `${selectedCount} selected`, zh: `已选 ${selectedCount} 项`, ru: `Выбрано: ${selectedCount}`,
    es: `${selectedCount} seleccionados`, th: `เลือกแล้ว ${selectedCount} รายการ`, ms: `${selectedCount} dipilih`,
  });

  return (
    <div className="mx-auto mb-3 max-w-3xl">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 md:grid-cols-1">
        {primary}
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-label={`${label}: ${countLabel}`}
          onClick={() => onExpandedChange(!expanded)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border/70 bg-card px-3 text-sm font-semibold text-foreground shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:hidden"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          {label}
          {selectedCount > 0 && <span className="grid min-w-5 place-items-center rounded-full bg-secondary px-1 text-xs">{selectedCount}</span>}
          <ChevronDown className={`size-4 transition-transform duration-150 ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      </div>
      <div
        id={panelId}
        hidden={!expanded}
        role="region"
        aria-label={label}
        onKeyDown={(event) => {
          if (event.key === "Escape" && expanded) {
            onExpandedChange(false);
            triggerRef.current?.focus();
          }
        }}
        className="mt-3 rounded-2xl border border-border/70 bg-muted/30 p-3 md:block md:border-0 md:bg-transparent md:p-0"
      >
        {children}
      </div>
    </div>
  );
}

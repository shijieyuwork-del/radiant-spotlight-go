import { useEffect, useState, type RefObject } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AsiaLang } from "@/lib/asia-i18n";

const labels: Record<AsiaLang, { previous: string; next: string; position: string }> = {
  en: { previous: "Previous items", next: "Next items", position: "Visible items" },
  zh: { previous: "上一组", next: "下一组", position: "当前显示" },
  ru: { previous: "Предыдущие", next: "Следующие", position: "Показаны" },
  es: { previous: "Anteriores", next: "Siguientes", position: "Elementos visibles" },
  th: { previous: "รายการก่อนหน้า", next: "รายการถัดไป", position: "รายการที่แสดง" },
  ms: { previous: "Item sebelumnya", next: "Item seterusnya", position: "Item yang kelihatan" },
};

/** Navigation does not own a clock: the rail moves only on a visitor's action. */
export function ManualRailControls({ railRef, railId, count, lang }: { railRef: RefObject<HTMLDivElement>; railId: string; count: number; lang: AsiaLang }) {
  const [position, setPosition] = useState({ first: 1, last: count, atStart: true, atEnd: true });
  const t = labels[lang];
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const update = () => {
      const bounds = rail.getBoundingClientRect();
      const visible = Array.from(rail.children).flatMap((child, index) => {
        const rect = child.getBoundingClientRect();
        return rect.right > bounds.left + 4 && rect.left < bounds.right - 4 ? [index + 1] : [];
      });
      setPosition({ first: visible[0] ?? (count ? 1 : 0), last: visible.at(-1) ?? count, atStart: rail.scrollLeft <= 2, atEnd: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2 });
    };
    update();
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(rail);
    return () => { rail.removeEventListener("scroll", update); window.removeEventListener("resize", update); observer?.disconnect(); };
  }, [count, railRef]);

  const move = (direction: -1 | 1, keyboard: boolean) => {
    const rail = railRef.current;
    if (!rail) return;
    const bounds = rail.getBoundingClientRect();
    const offsets = Array.from(rail.children).map((child) => child.getBoundingClientRect().left - bounds.left + rail.scrollLeft);
    const target = direction === 1
      ? offsets.find((left) => left > rail.scrollLeft + 4) ?? rail.scrollWidth - rail.clientWidth
      : offsets.filter((left) => left < rail.scrollLeft - 4).at(-1) ?? 0;
    rail.scrollTo({ left: Math.max(0, Math.min(target, rail.scrollWidth - rail.clientWidth)), behavior: keyboard || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return (
    <div className="mt-4 flex items-center justify-end gap-3">
      <span className="text-xs font-medium tabular-nums text-foreground" role="status" aria-label={`${t.position}: ${position.first}–${position.last} / ${count}`}>{position.first === position.last ? position.first : `${position.first}–${position.last}`} / {count}</span>
      <Button type="button" variant="outline" size="icon" className="size-11 rounded-full" aria-label={t.previous} aria-controls={railId} disabled={position.atStart || count < 2} onClick={(event) => move(-1, event.detail === 0)}><ChevronLeft className="size-4" /></Button>
      <Button type="button" variant="outline" size="icon" className="size-11 rounded-full" aria-label={t.next} aria-controls={railId} disabled={position.atEnd || count < 2} onClick={(event) => move(1, event.detail === 0)}><ChevronRight className="size-4" /></Button>
    </div>
  );
}

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Pause, Play } from "lucide-react";
import { TikTokCard, type TikTokItem } from "@/components/TikTokWall";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { DEFAULT_VIDEO_POSTER } from "@/lib/cover-fallback";
import type { AsiaLang } from "@/lib/asia-i18n";
import { videoControlsCopy } from "@/lib/video-controls-copy";
import "./patient-video-wall.css";

const copy: Record<AsiaLang, { wall: string; pause: string; resume: string; view: string }> = {
  en: { wall: "Patient video wall", pause: "Pause motion", resume: "Resume motion", view: "View case" },
  zh: { wall: "患者视频墙", pause: "暂停滚动", resume: "继续滚动", view: "查看案例" },
  ru: { wall: "Видеостена пациентов", pause: "Остановить движение", resume: "Продолжить движение", view: "Смотреть случай" },
  es: { wall: "Muro de videos de pacientes", pause: "Pausar movimiento", resume: "Reanudar movimiento", view: "Ver caso" },
  th: { wall: "วิดีโอของผู้ป่วย", pause: "หยุดการเลื่อน", resume: "เลื่อนต่อ", view: "ดูกรณีนี้" },
  ms: { wall: "Dinding video pesakit", pause: "Jeda pergerakan", resume: "Sambung pergerakan", view: "Lihat kes" },
  vi: { wall: "Tường video bệnh nhân", pause: "Dừng chuyển động", resume: "Tiếp tục chuyển động", view: "Xem ca này" },
  ko: { wall: "환자 동영상 모음", pause: "움직임 일시정지", resume: "움직임 재개", view: "사례 보기" },
  ja: { wall: "患者動画ウォール", pause: "動きを一時停止", resume: "動きを再開", view: "事例を見る" },
};

type Props = { items: TikTokItem[]; lang: AsiaLang; fmtPrice: (amount: number) => string };

/** Three lightweight poster tracks. Only the selected diary mounts a video player. */
export default function PatientVideoWall({ items, lang, fmtPrice }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [selected, setSelected] = useState<TikTokItem | null>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [keyboardBrowsing, setKeyboardBrowsing] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const t = copy[lang];
  const controls = videoControlsCopy[lang];
  const text = (value: TikTokItem["caption"]) => value[lang] || value.en;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updatePreference();
    updateVisibility();
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") { setOnScreen(true); return; }
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [items.length]);

  if (!items.length) return null;

  const staticLayout = reducedMotion || keyboardBrowsing;
  const running = onScreen && pageVisible && !paused && !hovered && !selected && !staticLayout;
  const columns = Array.from({ length: Math.min(3, items.length) }, (_, column) =>
    items.filter((_, index) => index % Math.min(3, items.length) === column));

  const card = (item: TikTokItem, duplicate: boolean, key: string) => (
    <button
      key={key}
      type="button"
      className="patient-video-wall__card"
      data-case-id={item.id}
      data-duplicate={duplicate || undefined}
      tabIndex={duplicate ? -1 : 0}
      aria-hidden={duplicate || undefined}
      aria-label={`${controls.play}: ${text(item.treatment)} — ${text(item.caption)}`}
      aria-haspopup="dialog"
      onClick={(event) => { opener.current = event.currentTarget; setSelected(item); }}
    >
      <img src={item.poster || DEFAULT_VIDEO_POSTER} alt="" loading="lazy" decoding="async" />
      <span className="patient-video-wall__shade" aria-hidden="true" />
      <span className="patient-video-wall__tag">{text(item.treatment)}</span>
      <span className="patient-video-wall__play" aria-hidden="true"><Play className="size-5 fill-current" /></span>
      <span className="patient-video-wall__caption">
        <span>{text(item.caption)}</span>
        {item.city && <small>{text(item.city)}</small>}
      </span>
    </button>
  );

  return (
    <div ref={root} className="patient-video-wall" data-running={running} data-static={staticLayout}>
      <div
        className="patient-video-wall__viewport"
        role="region"
        aria-label={t.wall}
        onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
        onPointerLeave={() => setHovered(false)}
        onFocusCapture={(event) => {
          // Keyboard navigation reveals all originals in a stable, scrollable grid.
          if (event.target instanceof HTMLElement && event.target.matches(":focus-visible")) setKeyboardBrowsing(true);
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setKeyboardBrowsing(false);
        }}
      >
        <div className="patient-video-wall__columns" style={{ "--wall-columns": columns.length } as CSSProperties}>
          {columns.map((column, columnIndex) => {
            // Each loop is taller than the viewport, even with only one source in a column.
            const loop = Array.from({ length: Math.max(3, column.length) }, (_, index) => column[index % column.length]);
            return (
              <div className="patient-video-wall__column" key={columnIndex}>
                <div className="patient-video-wall__track" data-direction={columnIndex === 1 ? "down" : "up"}>
                  {[0, 1].map((group) => (
                    <div key={group} className="patient-video-wall__group" aria-hidden={group === 1 || undefined} data-copy={group === 1 || undefined}>
                      {loop.map((item, index) => card(item, group === 1 || index >= column.length, `${group}-${index}-${item.id}`))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {!reducedMotion && (
        <div className="patient-video-wall__toolbar">
          <button type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
            {paused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
            {paused ? t.resume : t.pause}
          </button>
        </div>
      )}
      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        {selected && (
          <DialogContent
            className="patient-video-wall__dialog"
            closeLabel={controls.close}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              const original = Array.from(root.current?.querySelectorAll<HTMLButtonElement>("button[data-case-id]:not([data-duplicate])") ?? [])
                .find((button) => button.dataset.caseId === selected.id);
              (opener.current?.dataset.duplicate ? original : opener.current)?.focus({ preventScroll: true });
            }}
          >
            <DialogTitle className="sr-only">{text(selected.treatment)}</DialogTitle>
            <DialogDescription className="sr-only">{text(selected.caption)}</DialogDescription>
            <TikTokCard item={selected} lang={lang} fmtPrice={fmtPrice} focusPresentation autoPlayFocused eager />
            <Link to={`/cases/${selected.id}`} className="patient-video-wall__case-link">{t.view}<ArrowRight className="size-4" /></Link>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

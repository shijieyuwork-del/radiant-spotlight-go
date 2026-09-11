import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Volume2, VolumeX, Play, Pause, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSavedCase } from "@/lib/saved-cases";
import { Highlight } from "@/components/HighlightText";
import { DEFAULT_VIDEO_POSTER } from "@/lib/cover-fallback";
import type { AsiaLang } from "@/lib/asia-i18n";
import { useQuietVideo } from "@/hooks/use-quiet-video";
import { videoControlsCopy } from "@/lib/video-controls-copy";
import { CaseShareButton } from "@/components/CaseShareButton";

type DiaryText = { en: string; zh: string } & Partial<Record<Exclude<AsiaLang, "en" | "zh">, string>>;
const diaryText = (text: DiaryText, lang: AsiaLang) => text[lang] || text.en;

export type TikTokItem = {
  id: string;                 // for case detail route
  src: string;                // mp4 url
  poster?: string;
  /** Published translations are optional; keep English visible when unavailable. */
  user: DiaryText;
  caption: DiaryText;
  treatment: DiaryText;
  clinic: DiaryText;
  city?: DiaryText;
  likes: string;
  comments: string;
  priceCny: number;
  /** 日记发布日期（ISO），用于「最新」排序 */
  postedAt?: string;
};

export type TikTokWallProps = {
  items: TikTokItem[];
  lang: AsiaLang;
  fmtPrice: (cny: number) => string;
  /** 'preview' = small grid, 'wall' = larger immersive wall */
  variant?: "preview" | "wall" | "cases";
  caseHrefBase?: string;       // default "/cases/"
  /** 搜索关键词，命中片段在卡片文字里高亮 */
  highlight?: string;
  onBeforeNavigate?: (caseId: string) => void;
};

const labels: Record<AsiaLang, { play: string; verified: string }> = {
  en: { play: "Tap to play", verified: "Diary preview" },
  zh: { play: "点击播放", verified: "日记预览" },
  ru: { play: "Нажмите для просмотра", verified: "Предпросмотр дневника" },
  es: { play: "Toca para reproducir", verified: "Vista previa del diario" },
  th: { play: "แตะเพื่อเล่น", verified: "ตัวอย่างบันทึก" },
  ms: { play: "Ketik untuk main", verified: "Pratonton diari" },
  vi: { play: "Chạm để phát", verified: "Xem trước nhật ký" },
  ko: { play: "탭하여 재생", verified: "회복 일지 미리보기" },
  ja: { play: "タップして再生", verified: "回復日記プレビュー" },
};

const MARK_CLASS = "rounded bg-primary/70 px-0.5 text-primary-foreground";

const TikTokCard = ({
  item, lang, fmtPrice, caseHrefBase = "/cases/", playbackEnabled = true, discovery = false, eager = false, beforeNavigate, onBeforeNavigate, highlight,
}: { item: TikTokItem; lang: AsiaLang; fmtPrice: (n: number) => string; caseHrefBase?: string; playbackEnabled?: boolean; discovery?: boolean; eager?: boolean; beforeNavigate?: () => boolean; onBeforeNavigate?: (caseId: string) => void; highlight?: string }) => {
  const { attachRef, playing, playbackFailed, toggle } = useQuietVideo(item.src, playbackEnabled);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [near, setNear] = useState(eager);
  const caseUrl = `${caseHrefBase}${item.id}`;
  const { saved, toggleSaved, saveLabel } = useSavedCase(item.id);
  const controls = videoControlsCopy[lang];
  const recoveryStage = (() => {
    const text = item.caption.en;
    const match = text.match(/(\d+)[- ]?(day|week|month)/i);
    if (!match) return lang === "zh" ? "恢复日记" : lang === "ru" ? "Дневник восстановления" : lang === "es" ? "Diario de recuperación" : "Recovery diary";
    const value = match[1];
    const unit = match[2].toLowerCase();
    if (lang === "zh") return `${value}${unit === "day" ? "天" : unit === "week" ? "周" : "个月"}`;
    if (lang === "ru") return `${value} ${unit === "day" ? "дн." : unit === "week" ? "нед." : "мес."}`;
    if (lang === "es") return `${unit === "day" ? "Día" : unit === "week" ? "Semana" : "Mes"} ${value}`;
    return `${unit[0].toUpperCase()}${unit.slice(1)} ${value}`;
  })();

  // Start fetching the video slightly before it scrolls into view
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setMuted((m) => !m);
  };

  return (
    <div
      ref={wrapRef}
      data-directory-item={item.id}
      data-case-id={item.id}
      className="group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-3xl bg-card shadow-pop [backface-visibility:hidden] [transform:translateZ(0)]"
    >
      <video
        ref={attachRef}
        src={item.src}
        poster={item.poster || DEFAULT_VIDEO_POSTER}
        muted={muted}
        playsInline
        preload={near ? "metadata" : "none"}
        className="absolute inset-0 size-full object-cover [backface-visibility:hidden] [transform:translateZ(0)]"
      />
      <Link to={caseUrl} tabIndex={playbackEnabled ? 0 : -1} aria-label={diaryText(item.caption, lang)} className="absolute inset-0 rounded-3xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-primary" onClick={(event) => {
        if (beforeNavigate && !beforeNavigate()) { event.preventDefault(); return; }
        if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) onBeforeNavigate?.(item.id);
      }} />

      {/* gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

      {/* top: treatment chip + verified */}
      <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
        <span className="pill bg-white/90 backdrop-blur text-foreground text-label font-semibold">
          <Highlight text={diaryText(item.treatment, lang)} query={highlight} className={MARK_CLASS} />
        </span>
        <span className="pill bg-primary/90 text-primary-foreground text-label font-semibold">
          {discovery ? recoveryStage : labels[lang].verified}
        </span>
      </div>

      {/* The pause control stays available while the visitor watches. */}
        <button
          type="button"
          disabled={!playbackEnabled}
          onClick={(e) => { e.stopPropagation(); if (!beforeNavigate || beforeNavigate()) toggle(); }}
          className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-foreground shadow-pop focus-visible:outline focus-visible:outline-4 focus-visible:outline-primary disabled:pointer-events-none"
          aria-label={`${playing ? controls.pause : controls.play}: ${diaryText(item.treatment, lang)}`}
        >
          {playing ? <Pause className="size-6 fill-current" aria-hidden="true" /> : <Play className="size-6 translate-x-0.5 fill-current" aria-hidden="true" />}
        </button>
      {playbackFailed && <p role="status" className="absolute inset-x-3 top-[59%] z-30 rounded-lg bg-card p-2 text-xs leading-relaxed text-foreground">{controls.failed}</p>}

      {/* right action rail */}
      <div className={`absolute right-2 flex flex-col items-center gap-3 ${discovery ? "top-14" : "bottom-24"}`}>
        <button
          type="button"
          disabled={!playbackEnabled}
          onClick={(e) => { e.stopPropagation(); toggleSaved(); }}
          className="grid size-12 place-items-center rounded-full bg-black/60 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          aria-label={saveLabel}
          aria-pressed={saved}
        >
          <Heart className={`size-5 ${saved ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
        {playbackEnabled && <CaseShareButton href={caseUrl} title={diaryText(item.caption, lang)} lang={lang} className="grid size-12 place-items-center rounded-full bg-black/60 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white" />}

        <button
          type="button"
          disabled={!playbackEnabled}
          onClick={toggleMute}
          className="grid size-12 place-items-center rounded-full bg-black/60 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          aria-label={muted ? controls.unmute : controls.mute}
        >
          {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
        </button>
      </div>

      {/* bottom info */}
      <div className="pointer-events-none absolute left-3 right-16 bottom-3 text-white">
        <p className="text-xs font-semibold opacity-95"><Highlight text={diaryText(item.user, lang)} query={highlight} className={MARK_CLASS} /></p>
        <p className="text-[12px] mt-1 leading-snug line-clamp-2"><Highlight text={diaryText(item.caption, lang)} query={highlight} className={MARK_CLASS} /></p>
        {item.city && (
          <p className="mt-1 flex items-center gap-1 text-label font-medium text-white/90">
            <MapPin className="size-3" /> <Highlight text={diaryText(item.city, lang)} query={highlight} className={MARK_CLASS} />
          </p>
        )}
        {item.priceCny > 0 && <p className="mt-2 text-sm font-semibold">{fmtPrice(item.priceCny)}</p>}
      </div>
    </div>
  );
};

const TikTokWall = ({ items, lang, fmtPrice, variant = "preview", caseHrefBase, highlight, onBeforeNavigate }: TikTokWallProps) => {
  const [active, setActive] = useState(0);
  const [previewAnimation, setPreviewAnimation] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swipeMoved = useRef(false);
  const suppressClick = useRef(false);
  useEffect(() => { if (active >= items.length) setActive(0); }, [active, items.length]);

  if (variant === "preview") {
    const move = (direction: number, animate = false) => {
      if (!items.length) return;
      setPreviewAnimation(animate);
      setActive((current) => (current + direction + items.length) % items.length);
    };
    const distanceFromActive = (index: number) => {
      let distance = index - active;
      if (distance > items.length / 2) distance -= items.length;
      if (distance < -items.length / 2) distance += items.length;
      return distance;
    };

    const allowClick = () => !suppressClick.current;

    return (
      <div
        className="relative touch-pan-y select-none overflow-hidden overscroll-x-contain rounded-[1.75rem] border border-primary/15 bg-[radial-gradient(ellipse_at_50%_100%,hsl(var(--primary)/.22),transparent_62%)] px-2 pb-5 pt-3 shadow-pop sm:rounded-[2.25rem] sm:px-6 sm:pb-6 sm:pt-4 md:pt-6"
        onTouchStart={(e) => {
          touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          swipeMoved.current = false;
        }}
        onTouchMove={(e) => {
          const start = touchStart.current;
          if (!start || swipeMoved.current) return;
          const dx = e.touches[0].clientX - start.x;
          const dy = e.touches[0].clientY - start.y;
          if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) swipeMoved.current = true;
        }}
        onTouchEnd={(e) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start || !swipeMoved.current) return;
          const dx = e.changedTouches[0].clientX - start.x;
          if (Math.abs(dx) > 40) {
            suppressClick.current = true;
            move(dx < 0 ? 1 : -1, true);
            window.setTimeout(() => { suppressClick.current = false; }, 400);
          }
        }}
      >
        <div className="relative mx-auto h-[500px] max-w-[90rem] sm:h-[540px] md:h-[590px]">
          {items.map((it, index) => {
            const distance = distanceFromActive(index);
            const depth = Math.abs(distance);
            const visible = depth <= 3;
            if (!visible) return null;
            const direction = distance < 0 ? "-" : "+";
            const offset = distance === 0
              ? "-50%"
              : `calc(-50% ${direction} clamp(${depth * 155}px, ${depth * 22}vw, ${depth * 340}px))`;

            return (
              <div
                key={it.id}
                className={`absolute left-1/2 top-3 w-[74vw] max-w-[280px] transition-[transform,opacity] ${previewAnimation ? "duration-200" : "duration-0"} ease-out motion-reduce:transition-none [backface-visibility:hidden] sm:w-[270px] sm:max-w-[270px] md:w-[300px] md:max-w-[300px] lg:w-[320px] lg:max-w-[320px]`}
                style={{
                  opacity: visible ? 1 - depth * 0.18 : 0,
                  pointerEvents: visible ? "auto" : "none",
                  zIndex: 10 - depth,
                  transform: `translate3d(${offset}, 0, 0)`,
                }}
              >
                <TikTokCard item={it} lang={lang} fmtPrice={fmtPrice} caseHrefBase={caseHrefBase} playbackEnabled={distance === 0} eager={index === 0} beforeNavigate={allowClick} onBeforeNavigate={onBeforeNavigate} highlight={highlight} />
                {distance !== 0 && (
                  <button
                    type="button"
                    className="absolute inset-0 z-50 rounded-3xl"
                    onClick={(event) => { if (!allowClick()) return; setPreviewAnimation(event.detail > 0); setActive(index); }}
                    aria-label={diaryText(it.caption, lang)}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="relative z-20 mt-1 flex items-center justify-center gap-4">
          <Button type="button" variant="outline" size="icon" className="size-12 rounded-full bg-card shadow-soft sm:size-11" onClick={(event) => move(-1, event.detail > 0)} disabled={items.length < 2} aria-label={videoControlsCopy[lang].previous}>
            <ChevronLeft className="size-5" />
          </Button>
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {items.map((item, index) => (
              <span key={item.id} className={`h-1.5 rounded-full ${index === active ? "w-6 bg-primary" : "w-1.5 bg-border"}`} />
            ))}
          </div>
          <span className="sr-only" aria-live="polite">{items.length ? active + 1 : 0} / {items.length}</span>
          <Button type="button" variant="outline" size="icon" className="size-12 rounded-full bg-card shadow-soft sm:size-11" onClick={(event) => move(1, event.detail > 0)} disabled={items.length < 2} aria-label={videoControlsCopy[lang].next}>
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>
    );
  }

  if (variant === "cases") {
    return (
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth overscroll-x-contain px-4 pb-4 scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
        {items.map((it, index) => (
          <div key={it.id} className="w-[82vw] max-w-[22rem] shrink-0 snap-center sm:mx-auto sm:w-full sm:max-w-[25rem]">
            <TikTokCard item={it} lang={lang} fmtPrice={fmtPrice} caseHrefBase={caseHrefBase} discovery eager={index < 3} onBeforeNavigate={onBeforeNavigate} highlight={highlight} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto scroll-smooth overscroll-x-contain snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((it, index) => (
        <div key={it.id} className="min-w-[78vw] sm:min-w-0 snap-center">
          <TikTokCard item={it} lang={lang} fmtPrice={fmtPrice} caseHrefBase={caseHrefBase} eager={index < 4} onBeforeNavigate={onBeforeNavigate} highlight={highlight} />
        </div>
      ))}
    </div>
  );
};

export default TikTokWall;

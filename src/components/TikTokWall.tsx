import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Play, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSavedCase } from "@/lib/saved-cases";
import { Highlight } from "@/components/HighlightText";
import { DEFAULT_VIDEO_POSTER } from "@/lib/cover-fallback";

export type TikTokItem = {
  id: string;                 // for case detail route
  src: string;                // mp4 url
  poster?: string;
  /** Bilingual fields */
  user: { en: string; zh: string };
  caption: { en: string; zh: string };
  treatment: { en: string; zh: string };
  clinic: { en: string; zh: string };
  city?: { en: string; zh: string };
  likes: string;
  comments: string;
  priceCny: number;
  /** 日记发布日期（ISO），用于「最新」排序 */
  postedAt?: string;
};

export type TikTokWallProps = {
  items: TikTokItem[];
  lang: "en" | "zh" | "ru";
  fmtPrice: (cny: number) => string;
  /** 'preview' = small grid, 'wall' = larger immersive wall */
  variant?: "preview" | "wall" | "cases";
  caseHrefBase?: string;       // default "/cases/"
  /** 搜索关键词，命中片段在卡片文字里高亮 */
  highlight?: string;
};

const labels = {
  en: { play: "Tap to play", verified: "Diary preview" },
  zh: { play: "点击播放", verified: "日记预览" },
  ru: { play: "Нажмите для просмотра", verified: "Предпросмотр дневника" },
};

const MARK_CLASS = "rounded bg-primary/70 px-0.5 text-primary-foreground";

const TikTokCard = ({
  item, lang, fmtPrice, caseHrefBase = "/cases/", autoPlayEligible = true, discovery = false, eager = false, beforeNavigate, highlight,
}: { item: TikTokItem; lang: "en" | "zh" | "ru"; fmtPrice: (n: number) => string; caseHrefBase?: string; autoPlayEligible?: boolean; discovery?: boolean; eager?: boolean; beforeNavigate?: () => boolean; highlight?: string }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [near, setNear] = useState(eager);
  const navigate = useNavigate();
  const caseUrl = `${caseHrefBase}${item.id}`;
  const { saved, toggleSaved, signedIn } = useSavedCase(item.id);
  const recoveryStage = (() => {
    const text = item.caption.en;
    const match = text.match(/(\d+)[- ]?(day|week|month)/i);
    if (!match) return lang === "zh" ? "恢复日记" : lang === "ru" ? "Дневник восстановления" : "Recovery diary";
    const value = match[1];
    const unit = match[2].toLowerCase();
    if (lang === "zh") return `${value}${unit === "day" ? "天" : unit === "week" ? "周" : "个月"}`;
    if (lang === "ru") return `${value} ${unit === "day" ? "дн." : unit === "week" ? "нед." : "мес."}`;
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

  // Autoplay when visible; pause when off-screen
  useEffect(() => {
    const el = wrapRef.current;
    const v = ref.current;
    if (!el || !v) return;
    if (!autoPlayEligible) {
      v.pause();
      setPlaying(false);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
          v.play().then(() => setPlaying(true)).catch(() => {});
        } else {
          v.pause();
          setPlaying(false);
        }
      },
      { threshold: [0, 0.55, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [autoPlayEligible]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setMuted((m) => !m);
  };

  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <div
      ref={wrapRef}
      className="group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-3xl bg-card shadow-pop [backface-visibility:hidden] [transform:translateZ(0)]"
      onClick={() => { if (beforeNavigate && !beforeNavigate()) return; navigate(caseUrl); }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") navigate(caseUrl);
      }}
      role="link"
      tabIndex={0}
      aria-label={item.caption[lang]}
    >
      <video
        ref={ref}
        src={item.src}
        poster={item.poster || DEFAULT_VIDEO_POSTER}
        muted={muted}
        loop
        playsInline
        preload={eager ? "auto" : near ? "metadata" : "none"}
        className="absolute inset-0 size-full object-cover [backface-visibility:hidden] [transform:translateZ(0)]"
      />

      {/* gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

      {/* top: treatment chip + verified */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
        <span className="pill bg-white/90 backdrop-blur text-foreground text-[10px] font-semibold">
          <Highlight text={item.treatment[lang]} query={highlight} className={MARK_CLASS} />
        </span>
        <span className="pill bg-primary/90 text-primary-foreground text-[10px] font-semibold">
          {discovery ? recoveryStage : labels[lang].verified}
        </span>
      </div>

      {/* center play hint when paused */}
      {!playing && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          className="absolute inset-0 grid place-items-center"
          aria-label={labels[lang].play}
        >
          <div className="size-14 rounded-full bg-white/85 backdrop-blur grid place-items-center shadow-pop transition-transform hover:scale-105">
            <Play className="size-6 text-foreground fill-foreground translate-x-0.5" />
          </div>
        </button>
      )}

      {/* right action rail */}
      <div className={`absolute right-2 flex flex-col items-center gap-3 ${discovery ? "top-14" : "bottom-24"}`}>
        <button
          onClick={(e) => { e.stopPropagation(); toggleSaved(); }}
          className="size-10 rounded-full bg-black/40 backdrop-blur grid place-items-center text-white hover:scale-110 transition-transform"
          aria-label={signedIn
            ? saved ? "Remove from saved cases" : "Save this case"
            : "Sign up to save this case"}
        >
          <Heart className={`size-5 ${saved ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
        {!discovery && item.likes && <span className="text-[10px] text-white font-semibold -mt-2">{item.likes}</span>}

        {!discovery && <button
          onClick={(e) => e.stopPropagation()}
          className="size-10 rounded-full bg-black/40 backdrop-blur grid place-items-center text-white hover:scale-110 transition-transform"
          aria-label="comments"
        >
          <MessageCircle className="size-5" />
        </button>}
        {!discovery && item.comments && <span className="text-[10px] text-white font-semibold -mt-2">{item.comments}</span>}

        {!discovery && <button
          onClick={(e) => e.stopPropagation()}
          className="size-10 rounded-full bg-black/40 backdrop-blur grid place-items-center text-white hover:scale-110 transition-transform"
          aria-label="share"
        >
          <Share2 className="size-5" />
        </button>}

        {!discovery && <button
          onClick={toggleMute}
          className="size-10 rounded-full bg-black/40 backdrop-blur grid place-items-center text-white hover:scale-110 transition-transform"
          aria-label="mute"
        >
          {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
        </button>}
      </div>

      {/* bottom info */}
      <div className="absolute left-3 right-16 bottom-3 text-white">
        <p className="text-xs font-semibold opacity-95"><Highlight text={item.user[lang]} query={highlight} className={MARK_CLASS} /></p>
        <p className="text-[12px] mt-1 leading-snug line-clamp-2"><Highlight text={item.caption[lang]} query={highlight} className={MARK_CLASS} /></p>
        {!discovery && <p className="text-[11px] opacity-80 mt-1"><Highlight text={item.clinic[lang]} query={highlight} className={MARK_CLASS} /></p>}
        {item.city && (
          <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-white/90">
            <MapPin className="size-3" /> <Highlight text={item.city[lang]} query={highlight} className={MARK_CLASS} />
          </p>
        )}
        {item.priceCny > 0 && <p className="mt-2 text-sm font-semibold">{fmtPrice(item.priceCny)}</p>}
      </div>
    </div>
  );
};

const TikTokWall = ({ items, lang, fmtPrice, variant = "preview", caseHrefBase, highlight }: TikTokWallProps) => {
  const [active, setActive] = useState(0);
  const [settledActive, setSettledActive] = useState<number | null>(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swipeMoved = useRef(false);
  const suppressClick = useRef(false);

  useEffect(() => {
    if (variant !== "preview") return;
    setSettledActive(null);
    const timer = window.setTimeout(() => setSettledActive(active), 620);
    return () => window.clearTimeout(timer);
  }, [active, variant]);

  if (variant === "preview") {
    const move = (direction: number) => setActive((current) => (current + direction + items.length) % items.length);
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
            move(dx < 0 ? 1 : -1);
            window.setTimeout(() => { suppressClick.current = false; }, 400);
          }
        }}
      >
        <div className="relative mx-auto h-[500px] max-w-[90rem] sm:h-[540px] md:h-[590px]">
          {items.map((it, index) => {
            const distance = distanceFromActive(index);
            const depth = Math.abs(distance);
            const visible = depth <= 3;
            const direction = distance < 0 ? "-" : "+";
            const offset = distance === 0
              ? "-50%"
              : `calc(-50% ${direction} clamp(${depth * 155}px, ${depth * 22}vw, ${depth * 340}px))`;

            return (
              <div
                key={it.id}
                className="absolute left-1/2 top-3 w-[74vw] max-w-[280px] transition-[transform,opacity] duration-500 ease-out [backface-visibility:hidden] [will-change:transform,opacity] sm:w-[270px] sm:max-w-[270px] md:w-[300px] md:max-w-[300px] lg:w-[320px] lg:max-w-[320px]"
                style={{
                  opacity: visible ? 1 - depth * 0.18 : 0,
                  pointerEvents: visible ? "auto" : "none",
                  zIndex: 10 - depth,
                  transform: `translate3d(${offset}, 0, 0)`,
                }}
              >
                <TikTokCard item={it} lang={lang} fmtPrice={fmtPrice} caseHrefBase={caseHrefBase} autoPlayEligible={distance === 0 && settledActive === active} eager={index === 0} beforeNavigate={allowClick} highlight={highlight} />
                {distance !== 0 && (
                  <button
                    type="button"
                    className="absolute inset-0 z-50 rounded-3xl"
                    onClick={() => { if (!allowClick()) return; setActive(index); }}
                    aria-label={it.caption[lang]}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="relative z-20 mt-1 flex items-center justify-center gap-4">
          <Button type="button" variant="outline" size="icon" className="size-12 rounded-full bg-card shadow-soft sm:size-11" onClick={() => move(-1)} aria-label="Previous video">
            <ChevronLeft className="size-5" />
          </Button>
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {items.map((item, index) => (
              <span key={item.id} className={`h-1.5 rounded-full transition-all ${index === active ? "w-6 bg-primary" : "w-1.5 bg-border"}`} />
            ))}
          </div>
          <Button type="button" variant="outline" size="icon" className="size-12 rounded-full bg-card shadow-soft sm:size-11" onClick={() => move(1)} aria-label="Next video">
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
            <TikTokCard item={it} lang={lang} fmtPrice={fmtPrice} caseHrefBase={caseHrefBase} discovery eager={index < 3} highlight={highlight} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto scroll-smooth overscroll-x-contain snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((it, index) => (
        <div key={it.id} className="min-w-[78vw] sm:min-w-0 snap-center">
          <TikTokCard item={it} lang={lang} fmtPrice={fmtPrice} caseHrefBase={caseHrefBase} eager={index < 4} highlight={highlight} />
        </div>
      ))}
    </div>
  );
};

export default TikTokWall;

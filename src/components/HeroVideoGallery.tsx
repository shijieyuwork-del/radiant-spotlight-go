import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Maximize2, Play, Volume2, VolumeX, X, ArrowRight } from "lucide-react";
import type { TikTokItem } from "@/components/TikTokWall";
import { DEFAULT_VIDEO_POSTER } from "@/lib/cover-fallback";

type Lang = "en" | "zh" | "ru";

type HeroVideoGalleryProps = {
  items: TikTokItem[];
  lang: Lang;
  fmtPrice: (cny: number) => string;
};

const ui = {
  en: { all: "All", fullscreen: "Play fullscreen", viewCase: "View case", more: "More videos" },
  zh: { all: "全部", fullscreen: "全屏播放", viewCase: "查看案例", more: "更多短视频" },
  ru: { all: "Все", fullscreen: "На весь экран", viewCase: "Смотреть случай", more: "Больше видео" },
} as const;

const GalleryCard = ({
  item,
  lang,
  fmtPrice,
  onPlay,
}: {
  item: TikTokItem;
  lang: Lang;
  fmtPrice: (n: number) => string;
  onPlay: (item: TikTokItem) => void;
}) => {
  const t = item.treatment[lang === "zh" ? "zh" : "en"];
  return (
    <button
      type="button"
      onClick={() => onPlay(item)}
      className="group relative aspect-[9/16] w-32 shrink-0 snap-start overflow-hidden rounded-2xl border border-white/50 bg-foreground/90 text-left shadow-soft transition-transform duration-300 hover:-translate-y-1 sm:w-36"
      aria-label={`${ui[lang].fullscreen}: ${t}`}
    >
      <video
        src={item.src}
        poster={item.poster ?? DEFAULT_VIDEO_POSTER}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 size-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/25" />
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid size-11 place-items-center rounded-full border border-white/60 bg-white/20 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
          <Play className="size-4 fill-current" />
        </span>
      </span>
      <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm">
        <Maximize2 className="size-3.5" />
      </span>
      <span className="absolute inset-x-2 bottom-2">
        <span className="block truncate text-[11px] font-bold text-white">{t}</span>
        <span className="mt-0.5 block truncate text-[10px] font-medium text-white/75">
          {item.city?.[lang === "zh" ? "zh" : "en"]} · {fmtPrice(item.priceCny)}
        </span>
      </span>
    </button>
  );
};

const HeroVideoGallery = ({ items, lang, fmtPrice }: HeroVideoGalleryProps) => {
  const [tag, setTag] = useState<string>("all");
  const [active, setActive] = useState<TikTokItem | null>(null);
  const [muted, setMuted] = useState(false);
  const playerRef = useRef<HTMLVideoElement>(null);
  const t = ui[lang];

  const tags = useMemo(() => {
    const seen = new Map<string, string>();
    for (const item of items) {
      const key = item.treatment.en;
      if (!seen.has(key)) seen.set(key, item.treatment[lang === "zh" ? "zh" : "en"]);
    }
    return [...seen.entries()].map(([key, label]) => ({ key, label }));
  }, [items, lang]);

  const filtered = tag === "all" ? items : items.filter((i) => i.treatment.en === tag);

  const openPlayer = (item: TikTokItem) => {
    setActive(item);
    setMuted(false);
    const el = playerRef.current;
    if (el) {
      // requestFullscreen must run inside the tap handler; the video mounts with the modal,
      // so retry on the next frame when the element exists.
      requestAnimationFrame(() => {
        playerRef.current?.play().catch(() => undefined);
        const wrap = document.getElementById("hero-gallery-player");
        wrap?.requestFullscreen?.().catch(() => undefined);
      });
    }
  };

  const closePlayer = () => {
    playerRef.current?.pause();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
    setActive(null);
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setTag("all")}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all ${
            tag === "all"
              ? "border-foreground bg-foreground text-background shadow-pop"
              : "border-primary/20 bg-white/60 text-foreground/80 backdrop-blur hover:border-primary/40"
          }`}
        >
          {t.all}
        </button>
        {tags.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTag(key)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all ${
              tag === key
                ? "border-foreground bg-foreground text-background shadow-pop"
                : "border-primary/20 bg-white/60 text-foreground/80 backdrop-blur hover:border-primary/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide sm:mx-0 sm:justify-center sm:px-0">
        {filtered.map((item) => (
          <GalleryCard key={item.id} item={item} lang={lang} fmtPrice={fmtPrice} onPlay={openPlayer} />
        ))}
      </div>

      <p className="mt-3 text-center text-xs font-semibold text-muted-foreground">
        <Link to="/cases" className="inline-flex items-center gap-1 text-primary transition-colors hover:text-foreground">
          {t.more} <ArrowRight className="size-3" />
        </Link>
      </p>

      {active && (
        <div
          id="hero-gallery-player"
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={closePlayer}
        >
          <div
            className="relative aspect-[9/16] h-[86dvh] max-w-[92vw] overflow-hidden rounded-2xl bg-black shadow-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={playerRef}
              src={active.src}
              poster={active.poster ?? DEFAULT_VIDEO_POSTER}
              autoPlay
              loop
              playsInline
              muted={muted}
              controls
              className="size-full object-contain"
            />
            <div className="absolute inset-x-3 top-3 flex items-center justify-between">
              <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                {active.treatment[lang === "zh" ? "zh" : "en"]} · {fmtPrice(active.priceCny)}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  className="grid size-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                </button>
                <button
                  type="button"
                  onClick={closePlayer}
                  className="grid size-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
              <p className="min-w-0 flex-1 truncate text-xs font-medium text-white/85">
                {active.caption[lang === "zh" ? "zh" : "en"]}
              </p>
              <Link
                to={`/cases/${active.id}`}
                className="cta-primary inline-flex shrink-0 items-center gap-1 rounded-full px-4 py-2 text-xs font-bold"
              >
                {t.viewCase} <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroVideoGallery;

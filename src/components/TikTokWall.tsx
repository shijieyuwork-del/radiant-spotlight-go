import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Play, ArrowRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export type TikTokItem = {
  id: string;                 // for case detail route
  src: string;                // mp4 url
  poster?: string;
  /** Bilingual fields */
  user: { en: string; zh: string };
  caption: { en: string; zh: string };
  treatment: { en: string; zh: string };
  clinic: { en: string; zh: string };
  likes: string;
  comments: string;
  priceCny: number;
};

export type TikTokWallProps = {
  items: TikTokItem[];
  lang: "en" | "zh" | "ru";
  fmtPrice: (cny: number) => string;
  /** 'preview' = small grid, 'wall' = larger immersive wall */
  variant?: "preview" | "wall";
  caseHrefBase?: string;       // default "/cases/"
};

const labels = {
  en: { play: "Tap to play", view: "View case", verified: "Verified" },
  zh: { play: "点击播放", view: "查看案例", verified: "已认证" },
};

const TikTokCard = ({
  item, lang, fmtPrice, caseHrefBase = "/cases/",
}: { item: TikTokItem; lang: "en" | "zh" | "ru"; fmtPrice: (n: number) => string; caseHrefBase?: string }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);

  // Autoplay when visible; pause when off-screen
  useEffect(() => {
    const el = wrapRef.current;
    const v = ref.current;
    if (!el || !v) return;
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
  }, []);

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
      className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-card shadow-pop group cursor-pointer hover:-translate-y-1 transition-transform"
      onClick={togglePlay}
    >
      <video
        ref={ref}
        src={item.src}
        poster={item.poster}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 size-full object-cover"
      />

      {/* gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

      {/* top: treatment chip + verified */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
        <span className="pill bg-white/90 backdrop-blur text-foreground text-[10px] font-semibold">
          {item.treatment[lang]}
        </span>
        <span className="pill bg-primary/90 text-primary-foreground text-[10px] font-semibold">
          <BadgeCheck className="size-3" /> {labels[lang].verified}
        </span>
      </div>

      {/* center play hint when paused */}
      {!playing && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="size-14 rounded-full bg-white/85 backdrop-blur grid place-items-center shadow-pop">
            <Play className="size-6 text-foreground fill-foreground translate-x-0.5" />
          </div>
        </div>
      )}

      {/* right action rail */}
      <div className="absolute right-2 bottom-24 flex flex-col items-center gap-3">
        <button
          onClick={(e) => { e.stopPropagation(); setLiked((l) => !l); }}
          className="size-10 rounded-full bg-black/40 backdrop-blur grid place-items-center text-white hover:scale-110 transition-transform"
          aria-label="like"
        >
          <Heart className={`size-5 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
        <span className="text-[10px] text-white font-semibold -mt-2">{item.likes}</span>

        <button
          onClick={(e) => e.stopPropagation()}
          className="size-10 rounded-full bg-black/40 backdrop-blur grid place-items-center text-white hover:scale-110 transition-transform"
          aria-label="comments"
        >
          <MessageCircle className="size-5" />
        </button>
        <span className="text-[10px] text-white font-semibold -mt-2">{item.comments}</span>

        <button
          onClick={(e) => e.stopPropagation()}
          className="size-10 rounded-full bg-black/40 backdrop-blur grid place-items-center text-white hover:scale-110 transition-transform"
          aria-label="share"
        >
          <Share2 className="size-5" />
        </button>

        <button
          onClick={toggleMute}
          className="size-10 rounded-full bg-black/40 backdrop-blur grid place-items-center text-white hover:scale-110 transition-transform"
          aria-label="mute"
        >
          {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
        </button>
      </div>

      {/* bottom info */}
      <div className="absolute left-3 right-16 bottom-3 text-white">
        <p className="text-xs font-semibold opacity-95">{item.user[lang]}</p>
        <p className="text-[12px] mt-1 leading-snug line-clamp-2">{item.caption[lang]}</p>
        <p className="text-[11px] opacity-80 mt-1">{item.clinic[lang]}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">{fmtPrice(item.priceCny)}</span>
          <Link
            to={`${caseHrefBase}${item.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-[11px] font-semibold pill bg-white text-foreground hover:bg-white/90"
          >
            {labels[lang].view} <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const TikTokWall = ({ items, lang, fmtPrice, variant = "preview", caseHrefBase }: TikTokWallProps) => {
  const cols =
    variant === "wall"
      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      : "grid-cols-2 md:grid-cols-3 lg:grid-cols-6";
  return (
    <div className={`grid ${cols} gap-4`}>
      {items.map((it) => (
        <TikTokCard key={it.id} item={it} lang={lang} fmtPrice={fmtPrice} caseHrefBase={caseHrefBase} />
      ))}
    </div>
  );
};

export default TikTokWall;

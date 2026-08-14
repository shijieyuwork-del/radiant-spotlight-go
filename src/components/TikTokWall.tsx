import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Play, ArrowRight, BadgeCheck, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
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
  city?: { en: string; zh: string };
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
  item, lang, fmtPrice, caseHrefBase = "/cases/", autoPlayEligible = true,
}: { item: TikTokItem; lang: "en" | "zh" | "ru"; fmtPrice: (n: number) => string; caseHrefBase?: string; autoPlayEligible?: boolean }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  const caseUrl = `${caseHrefBase}${item.id}`;

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
      className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-card shadow-pop group cursor-pointer hover:-translate-y-1 transition-transform"
      onClick={() => navigate(caseUrl)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") navigate(caseUrl);
      }}
      role="link"
      tabIndex={0}
      aria-label={`${labels[lang].view}: ${item.caption[lang]}`}
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
        {item.city && (
          <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-white/90">
            <MapPin className="size-3" /> {item.city[lang]}
          </p>
        )}
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">{fmtPrice(item.priceCny)}</span>
          <Link
            to={caseUrl}
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
  const [active, setActive] = useState(0);

  if (variant === "preview") {
    const move = (direction: number) => setActive((current) => (current + direction + items.length) % items.length);
    const distanceFromActive = (index: number) => {
      let distance = index - active;
      if (distance > items.length / 2) distance -= items.length;
      if (distance < -items.length / 2) distance += items.length;
      return distance;
    };

    return (
      <div className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-[radial-gradient(ellipse_at_50%_100%,hsl(var(--primary)/.16),transparent_58%)] px-2 pb-5 pt-2 shadow-soft sm:px-6">
        <div className="relative mx-auto h-[390px] max-w-6xl [perspective:1400px] sm:h-[430px]">
          {items.map((it, index) => {
            const distance = distanceFromActive(index);
            const depth = Math.abs(distance);
            const visible = depth <= 3;
            const direction = distance < 0 ? "-" : "+";
            const offset = distance === 0
              ? "-50%"
              : `calc(-50% ${direction} clamp(${depth * 135}px, ${depth * 23}vw, ${depth * 290}px))`;

            return (
              <div
                key={it.id}
                className="absolute left-1/2 top-3 w-[58vw] max-w-[230px] transition-all duration-700 ease-out sm:w-[210px] lg:w-[230px]"
                style={{
                  opacity: visible ? 1 - depth * 0.18 : 0,
                  pointerEvents: visible ? "auto" : "none",
                  zIndex: 10 - depth,
                  transform: `translateX(${offset}) translateY(${depth * 26}px) translateZ(${-depth * 110}px) rotateY(${distance * -13}deg) rotateZ(${distance * 1.8}deg) scale(${1 - depth * 0.08})`,
                  transformStyle: "preserve-3d",
                }}
              >
                <TikTokCard item={it} lang={lang} fmtPrice={fmtPrice} caseHrefBase={caseHrefBase} autoPlayEligible={distance === 0} />
                {distance !== 0 && (
                  <button
                    type="button"
                    className="absolute inset-0 z-50 rounded-3xl"
                    onClick={() => setActive(index)}
                    aria-label={`${labels[lang].view}: ${it.caption[lang]}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="relative z-20 mt-1 flex items-center justify-center gap-4">
          <Button type="button" variant="outline" size="icon" className="size-11 rounded-full bg-card shadow-soft" onClick={() => move(-1)} aria-label="Previous video">
            <ChevronLeft className="size-5" />
          </Button>
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {items.map((item, index) => (
              <span key={item.id} className={`h-1.5 rounded-full transition-all ${index === active ? "w-6 bg-primary" : "w-1.5 bg-border"}`} />
            ))}
          </div>
          <Button type="button" variant="outline" size="icon" className="size-11 rounded-full bg-card shadow-soft" onClick={() => move(1)} aria-label="Next video">
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((it) => (
        <div key={it.id} className="min-w-[78vw] sm:min-w-0 snap-center">
          <TikTokCard item={it} lang={lang} fmtPrice={fmtPrice} caseHrefBase={caseHrefBase} />
        </div>
      ))}
    </div>
  );
};

export default TikTokWall;

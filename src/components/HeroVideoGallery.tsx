import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Maximize2, Play, Volume2, VolumeX, X, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { TikTokItem } from "@/components/TikTokWall";
import { DEFAULT_VIDEO_POSTER } from "@/lib/cover-fallback";

type Lang = "en" | "zh" | "ru";

type HeroVideoGalleryProps = {
  items: TikTokItem[];
  lang: Lang;
  fmtPrice: (cny: number) => string;
  size?: "default" | "large";
};

const ui = {
  en: { fullscreen: "Play fullscreen", viewCase: "View case", more: "More patient diaries", previous: "Previous explainer video", next: "Next explainer video", show: "Show explainer video", guide: "Video guide", playGuide: "Play guide fullscreen", learnMore: "Explore support", patientDiaries: "Patient diaries", patientSubtitle: "Real recovery stories, shared step by step." },
  zh: { fullscreen: "全屏播放", viewCase: "查看案例", more: "更多患者日记", previous: "上一个讲解视频", next: "下一个讲解视频", show: "显示讲解视频", guide: "讲解视频", playGuide: "全屏播放讲解", learnMore: "了解支持服务", patientDiaries: "患者日记", patientSubtitle: "真实恢复经历，按阶段记录。" },
  ru: { fullscreen: "На весь экран", viewCase: "Смотреть случай", more: "Больше историй пациентов", previous: "Предыдущее видео", next: "Следующее видео", show: "Показать видео", guide: "Видеообзор", playGuide: "Смотреть на весь экран", learnMore: "Подробнее о поддержке", patientDiaries: "Истории пациентов", patientSubtitle: "Реальный опыт восстановления по этапам." },
} as const;

const GalleryCard = ({
  item,
  lang,
  onPlay,
  size,
  actionLabel,
}: {
  item: TikTokItem;
  lang: Lang;
  onPlay: (item: TikTokItem) => void;
  size: "default" | "large";
  actionLabel?: string;
}) => {
  const t = item.treatment[lang === "zh" ? "zh" : "en"];
  return (
    <button
      type="button"
      onClick={() => onPlay(item)}
      className={`group relative aspect-[9/16] shrink-0 snap-start overflow-hidden rounded-[1.35rem] border border-white/55 bg-foreground/90 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-pop ${size === "large" ? "w-[48vw] min-w-[48vw] sm:w-44 sm:min-w-44 md:w-[15.5rem] md:min-w-[15.5rem] lg:w-[17rem] lg:min-w-[17rem]" : "w-[42vw] min-w-[42vw] sm:w-36 sm:min-w-36 lg:w-[9.25rem] lg:min-w-[9.25rem]"}`}
      aria-label={`${actionLabel ?? ui[lang].fullscreen}: ${t}`}
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
      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid size-11 place-items-center rounded-full border border-white/60 bg-white/20 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
          <Play className="size-4 fill-current" />
        </span>
      </span>
      <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm">
        <Maximize2 className="size-3.5" />
      </span>
      <span className="absolute inset-x-3.5 bottom-3.5">
        <span className="mb-1 block text-[9px] font-bold uppercase tracking-[0.16em] text-white/65">{lang === "zh" ? "患者日记" : lang === "ru" ? "История пациента" : "Patient diary"}</span>
        <span className="block font-display text-lg font-medium leading-tight text-white">{t}</span>
        <span className="mt-1.5 block truncate text-xs font-medium text-white/75">
          {item.city?.[lang === "zh" ? "zh" : "en"]}
        </span>
      </span>
    </button>
  );
};

const HeroVideoGallery = ({ items, lang, size = "default" }: HeroVideoGalleryProps) => {
  const [active, setActive] = useState<TikTokItem | null>(null);
  const [activeExplainerIndex, setActiveExplainerIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const playerRef = useRef<HTMLVideoElement>(null);
  const explainerRef = useRef<HTMLVideoElement>(null);
  const t = ui[lang];
  const visibleItems = items.slice(0, 7);
  const explainers = [
    {
      id: "care-coordination-overview",
      src: "/video/cosmetics-asia-home-motion.mp4?v=1",
      poster: "/video/source/shanghai-consultation.webp",
      title: lang === "zh" ? "跨境医疗协调如何进行" : lang === "ru" ? "Как проходит координация лечения" : "How care coordination works",
      description: lang === "zh" ? "了解从首次沟通、专家匹配到行程与术后支持的主要环节。" : lang === "ru" ? "Основные этапы: от первого разговора и подбора эксперта до поездки и наблюдения." : "A clear overview of consultation, expert matching, travel planning and aftercare support.",
    },
    {
      id: "planning-your-visit",
      src: "/video/cosmetics-asia-hero-stabilized.mp4",
      poster: "/video/source/shanghai-consultation.webp",
      title: lang === "zh" ? "出发前需要准备什么" : lang === "ru" ? "Как подготовиться к поездке" : "Preparing for your visit",
      description: lang === "zh" ? "出发前确认咨询、文件、接机和院内沟通安排。" : lang === "ru" ? "Что подтвердить до поездки: консультацию, документы, трансфер и перевод." : "What to confirm before travel, including consultation, documents, pickup and translation.",
    },
  ];
  const activeExplainer = explainers[activeExplainerIndex] ?? explainers[0];
  const showPrevious = () => setActiveExplainerIndex((current) => (current - 1 + explainers.length) % explainers.length);
  const showNext = () => setActiveExplainerIndex((current) => (current + 1) % explainers.length);

  const playExplainerFullscreen = () => {
    const video = explainerRef.current;
    if (!video) return;
    video.muted = false;
    video.controls = true;
    video.play().catch(() => undefined);
    video.requestFullscreen?.().catch(() => undefined);
  };

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
      {size === "large" ? (
        <>
          <div className="overflow-hidden rounded-[1.5rem] border border-primary/15 bg-foreground p-2 text-white shadow-pop md:hidden">
            <video key={`mobile-${activeExplainer.id}`} src={activeExplainer.src} poster={activeExplainer.poster} controls playsInline preload="metadata" className="aspect-video w-full rounded-[1.1rem] bg-black object-cover" />
            <div className="p-4">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-primary">{t.guide}</span>
              <h3 className="mt-1 font-display text-2xl font-semibold leading-tight">{activeExplainer.title}</h3>
              <p className="mt-2 text-xs leading-5 text-white/65">{activeExplainer.description}</p>
              <div className="mt-4 flex gap-2">
                {explainers.map((item, index) => (
                  <button key={item.id} type="button" onClick={() => setActiveExplainerIndex(index)} className={`min-h-10 flex-1 rounded-xl px-3 text-xs font-semibold transition ${activeExplainerIndex === index ? "bg-primary text-primary-foreground" : "bg-white/10 text-white/75"}`} aria-current={activeExplainerIndex === index ? "true" : undefined}>
                    {index + 1}. {item.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative hidden overflow-hidden rounded-[2rem] border border-primary/15 bg-foreground p-3 shadow-[0_28px_80px_rgba(17,54,45,.18)] md:block" role="region" aria-roledescription="carousel" aria-label={lang === "zh" ? "项目讲解视频" : lang === "ru" ? "Видеообзоры" : "Procedure explainer videos"}>
            <div className="relative h-[560px] overflow-hidden rounded-[1.45rem] bg-foreground lg:h-[610px]">
              {activeExplainer && (
                <>
                  <video ref={explainerRef} key={activeExplainer.id} src={activeExplainer.src} poster={activeExplainer.poster} autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 size-full object-cover opacity-75" />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,28,23,.88)_0%,rgba(5,28,23,.52)_42%,rgba(5,28,23,.16)_72%,rgba(5,28,23,.42)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 h-[44%] bg-gradient-to-t from-black/95 via-black/60 to-transparent" />

                  <div className="absolute left-8 top-10 z-20 max-w-md text-white lg:left-12 lg:top-14">
                    <span className="inline-flex rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
                      {t.guide}
                    </span>
                    <h3 className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-tight lg:text-5xl">{activeExplainer.title}</h3>
                    <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">{activeExplainer.description}</p>
                    <button type="button" onClick={playExplainerFullscreen} className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-pop transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-foreground">
                      <span className="grid size-7 place-items-center rounded-full bg-white/20"><Play className="size-3.5 fill-current" /></span>
                      {t.playGuide}
                    </button>
                  </div>

                  <Link to="/travel-packages" className="absolute right-7 top-7 z-20 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 bg-black/25 px-5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    {t.learnMore}<ArrowRight className="size-4" />
                  </Link>
                </>
              )}

              <div className="absolute inset-x-5 bottom-5 z-30 flex items-center gap-3 lg:inset-x-7 lg:bottom-7">
                <button type="button" onClick={showPrevious} className="grid size-11 shrink-0 place-items-center rounded-full border border-white/25 bg-black/45 text-white shadow-soft backdrop-blur-md transition hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label={t.previous}>
                  <ChevronLeft className="size-5" />
                </button>
                <div className="flex min-w-0 flex-1 justify-center gap-3 overflow-x-auto scrollbar-hide" aria-label={`${activeExplainerIndex + 1} / ${explainers.length}`}>
                  {explainers.map((item, index) => (
                    <button key={item.id} type="button" onClick={() => setActiveExplainerIndex(index)} className={`group relative aspect-[16/10] w-[14rem] min-w-[14rem] overflow-hidden rounded-xl border-2 text-left shadow-soft transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${activeExplainerIndex === index ? "-translate-y-1 border-primary shadow-pop" : "border-white/20 opacity-75 hover:opacity-100"}`} aria-label={`${t.show} ${index + 1}`} aria-current={activeExplainerIndex === index ? "true" : undefined}>
                      <video src={item.src} poster={item.poster} muted playsInline preload="none" className="absolute inset-0 size-full object-cover" />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
                      <span className="absolute inset-x-3 bottom-2.5 truncate font-display text-sm font-semibold text-white">{item.title}</span>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={showNext} className="grid size-11 shrink-0 place-items-center rounded-full border border-white/25 bg-black/45 text-white shadow-soft backdrop-blur-md transition hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label={t.next}>
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">{t.patientDiaries}</span>
              <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">{t.patientSubtitle}</h3>
            </div>
          </div>
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide sm:-mx-6 sm:px-6 md:mx-0 md:mt-6 md:px-0">
            {visibleItems.map((item) => (
              <GalleryCard key={item.id} item={item} lang={lang} onPlay={openPlayer} size="default" />
            ))}
          </div>
        </>
      ) : (
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide sm:-mx-6 sm:px-6">
          {visibleItems.map((item) => (
            <GalleryCard key={item.id} item={item} lang={lang} onPlay={openPlayer} size={size} />
          ))}
        </div>
      )}

      <p className="mt-3 text-center text-xs font-semibold text-muted-foreground sm:text-right">
        <Link to="/cases" className="inline-flex items-center gap-1.5 text-primary transition-colors hover:text-foreground">
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
                {active.treatment[lang === "zh" ? "zh" : "en"]}
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

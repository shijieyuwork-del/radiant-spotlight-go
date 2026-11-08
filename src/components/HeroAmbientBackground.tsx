import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { AsiaLang } from "@/lib/asia-i18n";
import { afterPageLoad } from "@/lib/deferred-work";
import { Button } from "@/components/ui/button";

const motionLabelsEnglishFallback = { pause: "Pause background animation", play: "Play background animation" };

const motionLabels: Record<AsiaLang, { pause: string; play: string }> = {
  en: { pause: "Pause background animation", play: "Play background animation" },
  zh: { pause: "暂停背景动画", play: "播放背景动画" },
  ru: { pause: "Приостановить анимацию фона", play: "Включить анимацию фона" },
  es: { pause: "Pausar la animación de fondo", play: "Reproducir la animación de fondo" },
  th: { pause: "หยุดภาพเคลื่อนไหวพื้นหลังชั่วคราว", play: "เล่นภาพเคลื่อนไหวพื้นหลัง" },
  ms: { pause: "Jeda animasi latar belakang", play: "Mainkan animasi latar belakang" },
  vi: { pause: "Tạm dừng hoạt ảnh nền", play: "Phát hoạt ảnh nền" },
  ko: { pause: "배경 애니메이션 일시정지", play: "배경 애니메이션 재생" },
  ja: { pause: "背景アニメーションを一時停止", play: "背景アニメーションを再生" },
  ar: motionLabelsEnglishFallback,
  "pt-BR": motionLabelsEnglishFallback,
  id: motionLabelsEnglishFallback,
  fr: motionLabelsEnglishFallback,
  de: motionLabelsEnglishFallback,
};

/** Silent video stays inside the first homepage section; motion can be paused. */
export default function HeroAmbientBackground({ lang }: { lang: AsiaLang }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [videoAllowed, setVideoAllowed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; addEventListener?: (name: string, fn: () => void) => void; removeEventListener?: (name: string, fn: () => void) => void } }).connection;
    let cancel: (() => void) | undefined;
    const updatePreference = () => {
      setReducedMotion(preference.matches);
      cancel?.();
      if (preference.matches || mobile.matches || connection?.saveData) setVideoAllowed(false);
      else cancel = afterPageLoad(() => setVideoAllowed(true));
    };
    const updateVisibility = () => setPageVisible(document.visibilityState === "visible");
    updatePreference();
    updateVisibility();
    preference.addEventListener("change", updatePreference);
    mobile.addEventListener("change", updatePreference);
    connection?.addEventListener?.("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);

    // If visibility observation is unavailable, keep the decorative fallback still.
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    );
    observer?.observe(root);

    return () => {
      observer?.disconnect();
      cancel?.();
      preference.removeEventListener("change", updatePreference);
      mobile.removeEventListener("change", updatePreference);
      connection?.removeEventListener?.("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  const running = videoAllowed && inView && pageVisible && !reducedMotion && !userPaused;
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (running && !videoFailed) {
      video.muted = true;
      void video.play().catch(() => setUserPaused(true));
    } else {
      video.pause();
    }
  }, [running, videoFailed, videoAllowed]);

  const label = userPaused ? motionLabels[lang].play : motionLabels[lang].pause;

  return (
    <>
      <div ref={rootRef} className="hero-ambient" style={{ position: "absolute" }} data-testid="hero-ambient-background" data-motion={running ? "running" : "paused"}>
        <div id="hero-ambient-field" className="hero-ambient__field" aria-hidden="true">
          <img src="/videos/homepage-background-poster.jpg" alt="" decoding="async" fetchPriority="high" className="hero-ambient__video" style={{ opacity: 0.35 }} />
          {videoAllowed && <video
            ref={videoRef}
            className="hero-ambient__video"
            src="/videos/homepage-background-loop.mp4"
            poster="/videos/homepage-background-poster.jpg"
            autoPlay={running}
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
            onError={() => setVideoFailed(true)}
            onLoadedData={() => setLoaded(true)}
            style={{ opacity: videoFailed || !loaded ? 0 : 0.35 }}
          />}
          <div className="hero-ambient__veil" />
        </div>
      </div>
      {videoAllowed && !reducedMotion && (
        <Button variant="ghost" size="icon" type="button" className="hero-ambient__toggle" style={{ position: "absolute" }} onClick={() => setUserPaused((paused) => !paused)} aria-label={label} title={label} aria-controls="hero-ambient-field">
          {userPaused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
        </Button>
      )}
    </>
  );
}

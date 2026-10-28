import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { AsiaLang } from "@/lib/asia-i18n";

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

/** User-supplied silent video loops behind the homepage; motion can be paused. */
export default function HeroAmbientBackground({ lang }: { lang: AsiaLang }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setPageVisible(document.visibilityState === "visible");
    updatePreference();
    updateVisibility();
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);

    // If visibility observation is unavailable, keep the decorative fallback still.
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    );
    observer?.observe(root);

    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  const running = inView && pageVisible && !reducedMotion && !userPaused;
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (running && !videoFailed) {
      video.muted = true;
      void video.play().catch(() => setUserPaused(true));
    } else {
      video.pause();
    }
  }, [running, videoFailed]);

  const label = userPaused ? motionLabels[lang].play : motionLabels[lang].pause;

  return (
    <>
      <div ref={rootRef} className="hero-ambient" data-testid="hero-ambient-background" data-motion={running ? "running" : "paused"}>
        <div id="hero-ambient-field" className="hero-ambient__field" aria-hidden="true">
          <video
            ref={videoRef}
            className="hero-ambient__video"
            src="/videos/homepage-background-loop.mp4"
            poster="/videos/homepage-background-poster.jpg"
            autoPlay={running}
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
            onError={() => setVideoFailed(true)}
            style={{ opacity: videoFailed ? 0 : 1 }}
          />
          <div className="hero-ambient__veil" />
        </div>
      </div>
      {!reducedMotion && (
        <button type="button" className="hero-ambient__toggle" onClick={() => setUserPaused((paused) => !paused)} aria-label={label} title={label} aria-controls="hero-ambient-field">
          {userPaused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
        </button>
      )}
    </>
  );
}

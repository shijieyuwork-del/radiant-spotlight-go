import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { AsiaLang } from "@/lib/asia-i18n";

const motionLabels: Record<AsiaLang, { pause: string; play: string }> = {
  en: { pause: "Pause background animation", play: "Play background animation" },
  zh: { pause: "暂停背景动画", play: "播放背景动画" },
  ru: { pause: "Приостановить анимацию фона", play: "Включить анимацию фона" },
  es: { pause: "Pausar la animación de fondo", play: "Reproducir la animación de fondo" },
  th: { pause: "หยุดภาพเคลื่อนไหวพื้นหลังชั่วคราว", play: "เล่นภาพเคลื่อนไหวพื้นหลัง" },
  ms: { pause: "Jeda animasi latar belakang", play: "Mainkan animasi latar belakang" },
  vi: { pause: "Tạm dừng hoạt ảnh nền", play: "Phát hoạt ảnh nền" },
};

// Long, irregular wave bands suggest reflections on a calm surface without
// creating the concentric circles that read like a target or ripple icon.
const waveBands = [
  "M -120 128 C 120 46 252 218 492 132 S 874 44 1320 154",
  "M -160 206 C 88 128 286 288 530 212 S 910 124 1360 238",
  "M -140 292 C 104 214 270 364 520 292 S 930 218 1340 330",
  "M -180 382 C 78 302 286 458 548 380 S 956 302 1380 424",
  "M -140 474 C 114 400 304 548 560 468 S 968 400 1340 510",
  "M -180 566 C 86 490 286 642 552 560 S 948 490 1380 604",
  "M -120 654 C 132 584 318 714 574 644 S 970 582 1340 700",
];

function WaterRippleTexture() {
  return (
    <svg viewBox="0 0 1200 700" fill="none" focusable="false" aria-hidden="true" preserveAspectRatio="none">
      <g className="hero-ambient__ripple-shadow" transform="translate(0 3)">
        {waveBands.map((d, index) => <path key={index} d={d} />)}
      </g>
      <g className="hero-ambient__ripple-light">
        {waveBands.map((d, index) => <path key={index} d={d} />)}
      </g>
    </svg>
  );
}

/** A viewport-sized water surface stays behind the entire homepage while scrolling. */
export default function HeroAmbientBackground({ lang }: { lang: AsiaLang }) {
  const rootRef = useRef<HTMLDivElement>(null);
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
  const label = userPaused ? motionLabels[lang].play : motionLabels[lang].pause;

  return (
    <>
      <div ref={rootRef} className="hero-ambient" data-testid="hero-ambient-background" data-motion={running ? "running" : "paused"}>
        <div id="hero-ambient-field" className="hero-ambient__field" aria-hidden="true">
          <div className="hero-ambient__ripples hero-ambient__ripples--near"><WaterRippleTexture /></div>
          <div className="hero-ambient__ripples hero-ambient__ripples--far"><WaterRippleTexture /></div>
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

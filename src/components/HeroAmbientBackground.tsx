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
};

// Slightly irregular, elliptical contours suggest reflected ripples rather than
// perfect target rings. Geometry is built once; only the two CSS layers move.
const rippleContours = Array.from({ length: 9 }, (_, ring) => {
  const radius = 150 + ring * 66;
  const points = Array.from({ length: 64 }, (_, step) => {
    const angle = step / 64 * Math.PI * 2;
    const ripple = radius * (1 + 0.035 * Math.sin(angle * 3 + ring * 0.32) + 0.016 * Math.cos(angle * 7));
    return [500 + Math.cos(angle) * ripple, 500 + Math.sin(angle) * ripple * 0.62];
  });
  const midpoint = (a: number[], b: number[]) => `${((a[0] + b[0]) / 2).toFixed(1)} ${((a[1] + b[1]) / 2).toFixed(1)}`;
  return `M ${midpoint(points[63], points[0])} ${points.map((point, i) => `Q ${point[0].toFixed(1)} ${point[1].toFixed(1)} ${midpoint(point, points[(i + 1) % 64])}`).join(" ")} Z`;
});

function WaterRippleTexture() {
  return (
    <svg viewBox="0 0 1000 1000" fill="none" focusable="false" aria-hidden="true">
      <g className="hero-ambient__ripple-shadow" transform="translate(0 3)">
        {rippleContours.map((d, index) => <path key={index} d={d} />)}
      </g>
      <g className="hero-ambient__ripple-light">
        {rippleContours.map((d, index) => <path key={index} d={d} />)}
      </g>
    </svg>
  );
}

/** CSS owns the motion; React only gates it for visibility and user preferences. */
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
    <div ref={rootRef} className="hero-ambient" data-testid="hero-ambient-background" data-motion={running ? "running" : "paused"}>
      <div id="hero-ambient-field" className="hero-ambient__field" aria-hidden="true">
        <div className="hero-ambient__wash hero-ambient__wash--jade" />
        <div className="hero-ambient__wash hero-ambient__wash--mint" />
        <div className="hero-ambient__ripples hero-ambient__ripples--near"><WaterRippleTexture /></div>
        <div className="hero-ambient__ripples hero-ambient__ripples--far"><WaterRippleTexture /></div>
        <div className="hero-ambient__veil" />
      </div>
      {!reducedMotion && (
        <button type="button" className="hero-ambient__toggle" onClick={() => setUserPaused((paused) => !paused)} aria-label={label} title={label} aria-controls="hero-ambient-field">
          {userPaused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}

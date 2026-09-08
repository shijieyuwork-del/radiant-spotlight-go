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
        <div className="hero-ambient__form hero-ambient__form--jade">
          <div className="hero-ambient__sheen"><span className="hero-ambient__glint" /></div>
        </div>
        <div className="hero-ambient__form hero-ambient__form--pearl">
          <div className="hero-ambient__sheen"><span className="hero-ambient__glint" /></div>
        </div>
        <div className="hero-ambient__veil" />
        <div className="hero-ambient__texture" />
      </div>
      {!reducedMotion && (
        <button type="button" className="hero-ambient__toggle" onClick={() => setUserPaused((paused) => !paused)} aria-label={label} title={label} aria-controls="hero-ambient-field">
          {userPaused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}

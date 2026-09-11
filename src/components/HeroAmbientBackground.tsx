import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { AsiaLang } from "@/lib/asia-i18n";
import oceanReference from "@/assets/home-light-mist.webp";

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
  "M -160 96 C 22 18 154 194 354 112 S 626 26 824 122 S 1090 228 1360 112",
  "M -180 172 C 54 88 186 258 420 178 S 704 84 922 182 S 1160 266 1380 172",
  "M -140 252 C 88 164 236 340 468 258 S 744 170 966 266 S 1178 352 1348 250",
  "M -190 338 C 54 248 214 434 452 344 S 756 250 1004 352 S 1194 424 1390 332",
  "M -150 426 C 90 336 256 520 500 430 S 790 344 1028 446 S 1194 516 1360 420",
  "M -200 514 C 58 420 214 616 462 516 S 758 426 1006 536 S 1196 604 1400 510",
  "M -150 604 C 96 520 258 698 514 598 S 812 518 1042 620 S 1206 674 1370 596",
];

const waveSurfaces = [
  "M -180 96 C 22 18 154 194 354 112 S 626 26 824 122 S 1090 228 1360 112 L 1360 178 C 1160 266 922 182 704 84 S 420 178 186 258 S 54 88 -180 172 Z",
  "M -140 252 C 88 164 236 340 468 258 S 744 170 966 266 S 1178 352 1348 250 L 1348 332 C 1194 424 1004 352 756 250 S 452 344 214 434 S 54 248 -190 338 Z",
  "M -150 426 C 90 336 256 520 500 430 S 790 344 1028 446 S 1194 516 1360 420 L 1360 510 C 1196 604 1006 536 758 426 S 462 516 214 616 S 58 420 -200 514 Z",
];

const lightSpots = [
  { x: 12, y: 18, size: 8, delay: -2, duration: 11 },
  { x: 34, y: 31, size: 5, delay: -8, duration: 14 },
  { x: 58, y: 16, size: 7, delay: -5, duration: 13 },
  { x: 83, y: 27, size: 10, delay: -11, duration: 16 },
  { x: 22, y: 57, size: 6, delay: -14, duration: 12 },
  { x: 48, y: 69, size: 9, delay: -7, duration: 15 },
  { x: 74, y: 54, size: 5, delay: -17, duration: 10 },
  { x: 91, y: 78, size: 8, delay: -4, duration: 14 },
  { x: 61, y: 88, size: 4, delay: -10, duration: 11 },
];

function WaterRippleTexture() {
  return (
    <svg viewBox="0 0 1200 700" fill="none" focusable="false" aria-hidden="true" preserveAspectRatio="none">
      <g className="hero-ambient__wave-surfaces">
        {waveSurfaces.map((d, index) => <path key={index} d={d} />)}
      </g>
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
          <div className="hero-ambient__photo" style={{ backgroundImage: `url(${oceanReference})` }} />
          <div className="hero-ambient__light-sheen" />
          <div className="hero-ambient__light-sweep" />
          <div className="hero-ambient__light-spots" aria-hidden="true">
            {lightSpots.map((spot, index) => (
              <span
                key={index}
                className="hero-ambient__light-spot"
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  width: `${spot.size}rem`,
                  animationDelay: `${spot.delay}s`,
                  animationDuration: `${spot.duration}s`,
                }}
              />
            ))}
          </div>
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

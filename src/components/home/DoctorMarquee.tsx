import { useEffect, useRef, useState, type ReactNode } from "react";
import type { DoctorFlipCardData } from "./DoctorFlipCard";
import "./doctor-marquee.css";

type Props = {
  doctors: DoctorFlipCardData[];
  lang: string;
  renderDoctor: (doctor: DoctorFlipCardData, duplicate: boolean) => ReactNode;
};

/** Two identical groups, including their trailing gap, form one seamless loop. */
export default function DoctorMarquee({ doctors, lang, renderDoctor }: Props) {
  const viewport = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [keyboardBrowsing, setKeyboardBrowsing] = useState(false);
  const canLoop = doctors.length > 3;
  const hasDoctors = doctors.length > 0;
  const zh = lang === "zh";

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting), { threshold: 0 },
    );
    observer?.observe(element);
    if (!observer) setInView(true);
    const onVisibility = () => setPageVisible(!document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [hasDoctors]);

  useEffect(() => {
    // Keyboard users browse a single, stationary native scroller. Reveal the
    // focused control after removing the marquee transform, without animation.
    const active = document.activeElement;
    if (keyboardBrowsing && active instanceof HTMLElement && viewport.current?.contains(active)) {
      active.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: "instant" });
    }
  }, [keyboardBrowsing]);

  if (!doctors.length) return null;

  return (
    <div className="doctor-marquee" data-static={!canLoop || keyboardBrowsing}>
      <div
        ref={viewport}
        id="home-doctors-rail"
        className="doctor-marquee__viewport scrollbar-hide"
        role="region"
        aria-label={zh ? "循环展示的精选专家" : "Featured experts, continuously scrolling"}
        onFocusCapture={(event) => {
          if (event.target.matches(":focus-visible")) setKeyboardBrowsing(true);
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            event.currentTarget.scrollLeft = 0;
            setKeyboardBrowsing(false);
          }
        }}
      >
        <div className="doctor-marquee__track" data-running={canLoop && inView && pageVisible}>
          {[false, ...(canLoop ? [true] : [])].map((duplicate) => (
            <div key={String(duplicate)} className="doctor-marquee__group" aria-hidden={duplicate || undefined}>
              {doctors.map((doctor) => (
                <div key={doctor.id} className="doctor-marquee__item">
                  {renderDoctor(doctor, duplicate)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

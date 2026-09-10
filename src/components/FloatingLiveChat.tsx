import { useEffect, useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useAsia } from "@/lib/asia-i18n";
import { useLocation } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";
import { useQuote } from "@/components/QuoteRequest";

const FloatingLiveChat = () => {
  const { t } = useAsia();
  const { pathname } = useLocation();
  const { open } = useQuote();
  const [isPastHero, setIsPastHero] = useState(false);
  const [isFooterCtaVisible, setIsFooterCtaVisible] = useState(false);
  const label = t("hero.cta");

  useEffect(() => {
    const updateVisibility = () => setIsPastHero(window.scrollY > 720);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, [pathname]);

  useEffect(() => {
    setIsFooterCtaVisible(false);
    const footerCta = document.querySelector<HTMLElement>("[data-consultation-cta]");
    if (!footerCta || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setIsFooterCtaVisible(entry.isIntersecting), { threshold: 0.12 });
    observer.observe(footerCta);
    return () => observer.disconnect();
  }, [pathname]);

  // The homepage already has persistent consultation actions in the hero and
  // footer; a second floating control would cover the content rails on small
  // screens. Keep the floating shortcut for deeper pages where it is useful.
  if (pathname === "/" || pathname.startsWith("/lp/") || pathname === "/privacy" || !isPastHero || isFooterCtaVisible) return null;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => { trackEvent("select_cta", { source: "floating_consultation" }); open({ source: "floating_consultation" }); }}
      className="consult-blink group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 flex min-h-14 max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-full border border-background/20 bg-foreground p-2 text-background shadow-pop transition-all hover:-translate-y-0.5 hover:border-background/30 hover:bg-foreground/95 sm:bottom-6 sm:right-6 sm:min-h-[3.75rem] sm:max-w-md sm:pl-2 sm:pr-5"
    >
      <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground sm:size-11">
        <MessageCircle className="size-[18px]" />
        <span aria-hidden className="consult-blink-ring absolute inset-0 rounded-full bg-primary" />
      </span>
      <span className="hidden min-w-0 whitespace-normal text-left text-[15px] font-semibold leading-snug sm:inline">{label}</span>
      <ArrowRight aria-hidden="true" className="hidden size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 sm:block" />
    </button>
  );
};

export default FloatingLiveChat;

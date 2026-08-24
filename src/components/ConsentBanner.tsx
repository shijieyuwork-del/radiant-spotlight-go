import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, ShieldCheck, X } from "lucide-react";
import {
  analyticsConfigured,
  getAnalyticsConsent,
  setAnalyticsConsent,
  trackPageView,
  type AnalyticsConsent,
} from "@/lib/analytics";

const ConsentBanner = () => {
  const { pathname } = useLocation();
  const [choice, setChoice] = useState<AnalyticsConsent>(() => getAnalyticsConsent());
  const [open, setOpen] = useState(() => analyticsConfigured() && getAnalyticsConsent() === "unset");

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("ca:open-privacy-choices", show);
    return () => window.removeEventListener("ca:open-privacy-choices", show);
  }, []);

  if (!analyticsConfigured() || !open) return null;

  const choose = (next: Exclude<AnalyticsConsent, "unset">) => {
    setAnalyticsConsent(next);
    setChoice(next);
    setOpen(false);
    if (next === "granted") window.setTimeout(() => trackPageView(pathname), 0);
  };

  return (
    <aside
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-3xl border border-primary/25 bg-card/98 p-4 shadow-[0_24px_80px_-30px_rgba(16,44,36,0.65)] backdrop-blur-xl sm:bottom-5 sm:p-5"
      aria-label="Analytics privacy choices"
    >
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Close privacy choices"
        className="absolute right-3 top-3 grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <X className="size-4" />
      </button>
      <div className="grid gap-4 pr-8 sm:grid-cols-[auto_1fr] sm:items-start">
        <span className="grid size-11 place-items-center rounded-2xl bg-gradient-mint text-foreground">
          <ShieldCheck className="size-5" />
        </span>
        <div>
          <h2 className="font-sans text-base font-bold tracking-tight">Your privacy, your choice</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Optional analytics help us improve the site. We do not send your form answers, contact details, or selected procedure to Google. Essential features work without analytics.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => choose("granted")}
              className="cta-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold"
            >
              <BarChart3 className="size-4" /> Allow analytics
            </button>
            <button
              type="button"
              onClick={() => choose("denied")}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-foreground/25 bg-card px-5 text-sm font-semibold hover:border-foreground hover:bg-muted"
            >
              Essential only
            </button>
            {choice !== "unset" && (
              <span className="text-xs text-muted-foreground">Current choice: {choice === "granted" ? "Analytics allowed" : "Essential only"}</span>
            )}
            <Link to="/privacy" className="px-2 text-center text-sm font-semibold text-foreground underline decoration-primary/50 underline-offset-4">
              Read privacy notice
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ConsentBanner;

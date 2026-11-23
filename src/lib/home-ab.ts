import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Homepage A/B test. A = the current homepage, B = the platform homepage.
 * Each visitor is assigned once at random (50/50) and keeps that version.
 * The inline script in index.html assigns on first load of "/"; this module
 * repeats the same rule for visitors who reach "/" by in-app navigation.
 * Force a version for checking with ?ab=a or ?ab=b.
 */
export type HomeVariant = "a" | "b";
const KEY = "sa_home_ab";
let cached: HomeVariant | null = null;

const isVariant = (v: unknown): v is HomeVariant => v === "a" || v === "b";

export const getHomeVariant = (): HomeVariant => {
  if (typeof window === "undefined" || import.meta.env.MODE === "test") return "a";
  if (cached) return cached;
  if (navigator.webdriver) return (cached = "a");
  let v: string | null = document.documentElement.getAttribute("data-home-ab");
  if (!isVariant(v)) {
    try { v = window.localStorage.getItem(KEY); } catch { v = null; }
    if (!isVariant(v)) {
      v = Math.random() < 0.5 ? "a" : "b";
      try { window.localStorage.setItem(KEY, v); } catch { /* storage unavailable: assignment lasts this visit */ }
    }
  }
  cached = v as HomeVariant;
  return cached;
};

/** Shows the page again once the B homepage has rendered (index.html hides it to avoid a flash of A). */
export const releaseHomeAbCloak = () => document.documentElement.classList.remove("home-ab-pending");

/** One view event per homepage render, so quote starts can be compared per version. */
export const useHomeVariantView = (variant: HomeVariant) => {
  useEffect(() => {
    if (variant === "b") releaseHomeAbCloak();
    trackEvent("view_landing_page", { page_group: "home", source: `home_variant_${variant}` });
  }, [variant]);
};
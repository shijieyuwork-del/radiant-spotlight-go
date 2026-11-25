import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * The platform homepage (HomeV2, "b") is the homepage for every visitor and is
 * the version the build prerenders. The earlier homepage ("a") stays reachable
 * with ?ab=a for comparison, and unit tests keep rendering it.
 */
export type HomeVariant = "a" | "b";

export const getHomeVariant = (): HomeVariant => {
  if (import.meta.env.MODE === "test") return "a";
  if (typeof window !== "undefined") {
    try {
      if (new URLSearchParams(window.location.search).get("ab") === "a") return "a";
    } catch {
      /* an unreadable query string falls through to the homepage */
    }
  }
  return "b";
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

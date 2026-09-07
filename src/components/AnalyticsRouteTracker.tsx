import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

const AnalyticsRouteTracker = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    const onConsent = (event: Event) => {
      if ((event as CustomEvent<string>).detail === "granted") trackPageView(pathname);
    };
    window.addEventListener("ca:analytics-consent", onConsent);
    return () => window.removeEventListener("ca:analytics-consent", onConsent);
  }, [pathname]);

  return null;
};

export default AnalyticsRouteTracker;

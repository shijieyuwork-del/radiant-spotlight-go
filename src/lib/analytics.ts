export type AnalyticsConsent = "granted" | "denied" | "unset";
export type AnalyticsRegion = "pending" | "consent-required" | "analytics-default";

export type AnalyticsEventName =
  | "page_view"
  | "view_landing_page"
  | "select_cta"
  | "start_quote"
  | "quote_option_selected"
  | "quote_contact_method_selected"
  | "quote_step_completed"
  | "generate_lead"
  | "email_handoff"
  | "whatsapp_handoff"
  | "view_pricing"
  | "expand_faq";

type SafeEventParams = {
  page_group?: string;
  source?: string;
  position?: string;
  option?: string;
  step?: number;
  section?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

const CONSENT_KEY = "ca_analytics_consent_v1";
const GTM_SCRIPT_ID = "ca-google-tag-manager";
const GA4_SCRIPT_ID = "ca-google-analytics";
const GTM_ID = (import.meta.env.VITE_GTM_ID || "").trim();
const GA4_ID = (import.meta.env.VITE_GA4_MEASUREMENT_ID || "").trim();
const hasGtm = /^GTM-[A-Z0-9]+$/i.test(GTM_ID);
const hasGa4 = /^G-[A-Z0-9]+$/i.test(GA4_ID);
let runtimeConsent: AnalyticsConsent = "unset";
let analyticsRegion: AnalyticsRegion = "pending";

// EEA (EU + Iceland, Liechtenstein and Norway), United Kingdom and Switzerland.
// If Cloudflare cannot resolve a country, the visitor stays consent-required.
const CONSENT_REQUIRED_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR",
  "GR", "HU", "IE", "IS", "IT", "LI", "LT", "LU", "LV", "MT", "NL", "NO",
  "PL", "PT", "RO", "SE", "SI", "SK", "GB", "CH",
]);

const gtag = (...args: unknown[]) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
};

const cleanValue = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9_-]+/g, "_").slice(0, 48);

const pageGroup = (pathname: string) => {
  if (pathname.startsWith("/lp/")) return "treatment_landing";
  if (/^\/treatments\/[^/]+/.test(pathname)) return "treatment_education";
  if (/^\/doctors\/[^/]+/.test(pathname)) return "provider_profile";
  if (/^\/cases\/[^/]+/.test(pathname)) return "recovery_diary";
  if (pathname === "/privacy") return "privacy";
  if (pathname === "/") return "home";
  return cleanValue(pathname.split("/").filter(Boolean)[0] || "home");
};

/**
 * Never send a treatment, provider, case, query string, form value or contact
 * detail to Google. Sensitive routes are grouped before page_view is emitted.
 */
export const analyticsPagePath = (pathname: string) => {
  if (pathname.startsWith("/lp/")) return "/lp/treatment-consultation";
  if (/^\/treatments\/[^/]+/.test(pathname)) return "/treatments/procedure-guide";
  if (/^\/doctors\/[^/]+/.test(pathname)) return "/doctors/provider-profile";
  if (/^\/cases\/[^/]+/.test(pathname)) return "/cases/recovery-diary";
  return pathname || "/";
};

export const analyticsPageTitle = (pathname: string) => {
  const group = pageGroup(pathname);
  const titles: Record<string, string> = {
    treatment_landing: "Treatment consultation | CeladonChina",
    treatment_education: "Procedure guide | CeladonChina",
    provider_profile: "Provider profile | CeladonChina",
    recovery_diary: "Recovery diary | CeladonChina",
    privacy: "Privacy notice | CeladonChina",
    home: "CeladonChina",
  };
  return titles[group] || "CeladonChina";
};

export const analyticsConfigured = () => hasGtm || hasGa4;

export const getAnalyticsConsent = (): AnalyticsConsent => {
  if (typeof window === "undefined") return "unset";
  const value = window.localStorage.getItem(CONSENT_KEY);
  if (value === "granted" || value === "denied") return value;
  return runtimeConsent;
};

export const getAnalyticsRegion = (): AnalyticsRegion => analyticsRegion;

export const countryRequiresAnalyticsConsent = (countryCode: string | null | undefined) =>
  !countryCode || CONSENT_REQUIRED_COUNTRIES.has(countryCode.trim().toUpperCase());

const setDefaultConsent = () => {
  if (typeof window === "undefined") return;
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });
  gtag("set", "ads_data_redaction", true);
  gtag("set", "url_passthrough", false);
};

const loadGtm = () => {
  if (!hasGtm || document.getElementById(GTM_SCRIPT_ID)) return;
  const script = document.createElement("script");
  script.id = GTM_SCRIPT_ID;
  script.async = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
  document.head.appendChild(script);
};

const loadGa4 = () => {
  if (!hasGa4 || document.getElementById(GA4_SCRIPT_ID)) return;
  const script = document.createElement("script");
  script.id = GA4_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
  gtag("js", new Date());
  gtag("config", GA4_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  document.head.appendChild(script);
};

const loadGoogleTags = () => {
  if (!analyticsConfigured()) return;
  loadGtm();
  loadGa4();
};

const resolveCountryCode = async (): Promise<string | null> => {
  try {
    const response = await fetch("/cdn-cgi/trace", {
      cache: "no-store",
      credentials: "omit",
      headers: { Accept: "text/plain" },
    });
    if (!response.ok) return null;
    const match = (await response.text()).match(/^loc=([A-Z]{2})$/m);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
};

const setRegion = (region: AnalyticsRegion) => {
  analyticsRegion = region;
  window.dispatchEvent(new CustomEvent("ca:analytics-region", { detail: region }));
};

export const bootstrapAnalytics = () => {
  if (typeof window === "undefined") return;
  setDefaultConsent();
  const savedConsent = getAnalyticsConsent();
  if (savedConsent === "granted") {
    runtimeConsent = "granted";
    gtag("consent", "update", { analytics_storage: "granted" });
    loadGoogleTags();
  }

  void resolveCountryCode().then((countryCode) => {
    if (countryRequiresAnalyticsConsent(countryCode)) {
      setRegion("consent-required");
      return;
    }

    setRegion("analytics-default");
    if (savedConsent !== "unset") return;
    runtimeConsent = "granted";
    gtag("consent", "update", { analytics_storage: "granted" });
    loadGoogleTags();
    window.dispatchEvent(new CustomEvent("ca:analytics-consent", { detail: "granted" }));
  });
};

export const setAnalyticsConsent = (consent: Exclude<AnalyticsConsent, "unset">) => {
  window.localStorage.setItem(CONSENT_KEY, consent);
  runtimeConsent = consent;
  gtag("consent", "update", {
    analytics_storage: consent,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  if (consent === "granted") loadGoogleTags();
  window.dispatchEvent(new CustomEvent("ca:analytics-consent", { detail: consent }));
};

const safeParams = (params: SafeEventParams) => {
  const result: Record<string, string | number> = {};
  if (params.page_group) result.page_group = cleanValue(params.page_group);
  if (params.source) result.source = cleanValue(params.source);
  if (params.position) result.position = cleanValue(params.position);
  if (params.option) result.option = cleanValue(params.option);
  if (typeof params.step === "number") result.step = Math.max(1, Math.min(9, params.step));
  if (params.section) result.section = cleanValue(params.section);
  return result;
};

export const trackEvent = (event: AnalyticsEventName, params: SafeEventParams = {}) => {
  if (!analyticsConfigured() || getAnalyticsConsent() !== "granted") return false;
  const payload = safeParams(params);
  if (hasGtm) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...payload });
  }
  if (hasGa4) {
    gtag("event", event, payload);
  }
  return true;
};

export const trackPageView = (pathname: string) => {
  if (!analyticsConfigured() || getAnalyticsConsent() !== "granted") return false;
  const safePath = analyticsPagePath(pathname);
  const payload = {
    page_location: `${window.location.origin}${safePath}`,
    page_path: safePath,
    page_title: analyticsPageTitle(pathname),
    page_group: pageGroup(pathname),
  };
  if (hasGtm) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "page_view", ...payload });
  }
  if (hasGa4) {
    gtag("event", "page_view", payload);
  }
  return true;
};

export const openPrivacyChoices = () => {
  window.dispatchEvent(new Event("ca:open-privacy-choices"));
};

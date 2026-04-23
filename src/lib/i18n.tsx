import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { translations, type TranslationKey } from "./translations";

// ---------------- Currency ----------------
export type CurrencyCode = "USD" | "GBP" | "EUR" | "AED" | "KRW" | "THB" | "CNY";

export const currencies: Record<CurrencyCode, { symbol: string; name: string; flag: string; rate: number }> = {
  // rates relative to 1 USD — would be fetched live in prod
  USD: { symbol: "$", name: "US Dollar", flag: "🇺🇸", rate: 1 },
  GBP: { symbol: "£", name: "British Pound", flag: "🇬🇧", rate: 0.79 },
  EUR: { symbol: "€", name: "Euro", flag: "🇪🇺", rate: 0.92 },
  AED: { symbol: "د.إ", name: "UAE Dirham", flag: "🇦🇪", rate: 3.67 },
  KRW: { symbol: "₩", name: "Korean Won", flag: "🇰🇷", rate: 1380 },
  THB: { symbol: "฿", name: "Thai Baht", flag: "🇹🇭", rate: 36 },
  CNY: { symbol: "¥", name: "Chinese Yuan", flag: "🇨🇳", rate: 7.25 },
};

// ---------------- Languages ----------------
export type LanguageCode = "en" | "ko" | "th" | "ar" | "zh";
export const languages: Record<LanguageCode, { label: string; native: string; flag: string; dir: "ltr" | "rtl" }> = {
  en: { label: "English", native: "English", flag: "🇬🇧", dir: "ltr" },
  ko: { label: "Korean", native: "한국어", flag: "🇰🇷", dir: "ltr" },
  th: { label: "Thai", native: "ไทย", flag: "🇹🇭", dir: "ltr" },
  ar: { label: "Arabic", native: "العربية", flag: "🇦🇪", dir: "rtl" },
  zh: { label: "Chinese", native: "中文", flag: "🇨🇳", dir: "ltr" },
};

// ---------------- Region detection (mock) ----------------
export type RegionCode = "US" | "GB" | "AE" | "KR" | "TH" | "CN" | "FR";
const regionDefaults: Record<RegionCode, { currency: CurrencyCode; language: LanguageCode; name: string; flag: string }> = {
  US: { currency: "USD", language: "en", name: "United States", flag: "🇺🇸" },
  GB: { currency: "GBP", language: "en", name: "United Kingdom", flag: "🇬🇧" },
  AE: { currency: "AED", language: "ar", name: "United Arab Emirates", flag: "🇦🇪" },
  KR: { currency: "KRW", language: "ko", name: "South Korea", flag: "🇰🇷" },
  TH: { currency: "THB", language: "th", name: "Thailand", flag: "🇹🇭" },
  CN: { currency: "CNY", language: "zh", name: "China", flag: "🇨🇳" },
  FR: { currency: "EUR", language: "en", name: "France", flag: "🇫🇷" },
};

const detectRegion = (): RegionCode => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("Dubai") || tz.includes("Riyadh")) return "AE";
    if (tz.includes("Seoul")) return "KR";
    if (tz.includes("Bangkok")) return "TH";
    if (tz.includes("Shanghai") || tz.includes("Hong_Kong")) return "CN";
    if (tz.includes("London")) return "GB";
    if (tz.includes("Paris") || tz.includes("Berlin") || tz.includes("Madrid")) return "FR";
  } catch {}
  return "US";
};

// ---------------- Context ----------------
interface I18nState {
  region: RegionCode;
  regionMeta: typeof regionDefaults[RegionCode];
  currency: CurrencyCode;
  language: LanguageCode;
  privacyMode: boolean;
  setCurrency: (c: CurrencyCode) => void;
  setLanguage: (l: LanguageCode) => void;
  setRegion: (r: RegionCode) => void;
  setPrivacyMode: (b: boolean) => void;
  formatPrice: (usd: number) => string;
  convert: (usd: number) => number;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nState | null>(null);

const STORE_KEY = "glowy.i18n.v1";

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const detected = useMemo(detectRegion, []);
  const stored = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "null"); } catch { return null; }
  }, []);

  const [region, setRegion] = useState<RegionCode>(stored?.region ?? detected);
  const [currency, setCurrency] = useState<CurrencyCode>(stored?.currency ?? regionDefaults[detected].currency);
  const [language, setLanguage] = useState<LanguageCode>(stored?.language ?? regionDefaults[detected].language);
  const [privacyMode, setPrivacyMode] = useState<boolean>(
    stored?.privacyMode ?? (detected === "AE")
  );

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify({ region, currency, language, privacyMode }));
    document.documentElement.lang = language;
    document.documentElement.dir = languages[language].dir;
  }, [region, currency, language, privacyMode]);

  const convert = (usd: number) => Math.round(usd * currencies[currency].rate);
  const formatPrice = (usd: number) => {
    const v = convert(usd);
    const sym = currencies[currency].symbol;
    const formatted = new Intl.NumberFormat("en-US").format(v);
    return ["AED"].includes(currency) ? `${formatted} ${sym}` : `${sym}${formatted}`;
  };

  return (
    <I18nContext.Provider
      value={{
        region, regionMeta: regionDefaults[region],
        currency, language, privacyMode,
        setRegion: (r) => {
          setRegion(r);
          setCurrency(regionDefaults[r].currency);
          setLanguage(regionDefaults[r].language);
        },
        setCurrency, setLanguage, setPrivacyMode,
        formatPrice, convert,
        t: (key) => translations[language]?.[key] ?? translations.en[key] ?? key,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
};

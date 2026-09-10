import type { AsiaLang } from "@/lib/asia-i18n";
import { translatedUiText } from "@/lib/locale-text";

/** Language copy selector with safe fallbacks. */
export const asiaCopy = <T,>(lang: AsiaLang, values: { en: T; zh: T; ru: T; es?: T; th?: T; ms?: T; vi?: T }): T => {
  if (lang === "zh") return values.zh;
  if (lang === "ru") return values.ru;
  if (lang === "es") return values.es ?? values.en;
  if (lang === "th") return values.th ?? (typeof values.en === "string" ? translatedUiText("th", values.en) as T : values.en);
  if (lang === "ms") return values.ms ?? (typeof values.en === "string" ? translatedUiText("ms", values.en) as T : values.en);
  if (lang === "vi") return values.vi ?? (typeof values.en === "string" ? translatedUiText("vi", values.en) as T : values.en);
  return values.en;
};

/** Fill the Vietnamese slot of a per-language copy map from English until it is translated. */
export const withVietnameseFallback = <T,>(copy: Record<Exclude<AsiaLang, "vi">, T> & { vi?: T }): Record<AsiaLang, T> => ({ ...copy, vi: copy.vi ?? copy.en });

import type { AsiaLang } from "@/lib/asia-i18n";
import { translatedUiText } from "@/lib/locale-text";

/** Language copy selector with safe fallbacks. */
export const asiaCopy = <T,>(lang: AsiaLang, values: { en: T; zh: T; ru: T; es?: T; th?: T; ms?: T; vi?: T; ko?: T; ja?: T }): T => {
  if (lang === "zh") return values.zh;
  if (lang === "ru") return values.ru;
  if (lang === "es") return values.es ?? values.en;
  if (lang === "th") return values.th ?? (typeof values.en === "string" ? translatedUiText("th", values.en) as T : values.en);
  if (lang === "ms") return values.ms ?? (typeof values.en === "string" ? translatedUiText("ms", values.en) as T : values.en);
  if (lang === "vi") return values.vi ?? (typeof values.en === "string" ? translatedUiText("vi", values.en) as T : values.en);
  if (lang === "ko") return values.ko ?? (typeof values.en === "string" ? translatedUiText("ko", values.en) as T : values.en);
  if (lang === "ja") return values.ja ?? (typeof values.en === "string" ? translatedUiText("ja", values.en) as T : values.en);
  return values.en;
};

/** Fill newly added locale slots from English until reviewed translations are available. */
export const withVietnameseFallback = <T,>(copy: { en: T; zh: T; ru: T; es?: T; th?: T; ms?: T; vi?: T; ko?: T; ja?: T }): Record<AsiaLang, T> => ({
  ...copy,
  es: copy.es ?? copy.en,
  th: copy.th ?? copy.en,
  ms: copy.ms ?? copy.en,
  vi: copy.vi ?? copy.en,
  ko: copy.ko ?? copy.en,
  ja: copy.ja ?? copy.en,
});

import type { AsiaLang } from "@/lib/asia-i18n";
import { translatedUiText } from "@/lib/locale-text";

/** Language copy selector. Generated Thai and Malay copy falls back to English safely. */
export const asiaCopy = <T,>(lang: AsiaLang, values: { en: T; zh: T; ru: T; es?: T; th?: T; ms?: T }): T => {
  if (lang === "zh") return values.zh;
  if (lang === "ru") return values.ru;
  if (lang === "es") return values.es ?? values.en;
  if (lang === "th") return values.th ?? (typeof values.en === "string" ? translatedUiText("th", values.en) as T : values.en);
  if (lang === "ms") return values.ms ?? (typeof values.en === "string" ? translatedUiText("ms", values.en) as T : values.en);
  return values.en;
};

import type { AsiaLang } from "@/lib/asia-i18n";
import { translatedUiText } from "@/lib/locale-text";

/** Language copy selector with safe fallbacks. */
export const asiaCopy = <T,>(lang: AsiaLang, values: { en: T; zh: T; ru: T; es?: T; th?: T; ms?: T; vi?: T; ko?: T; ja?: T; ar?: T; "pt-BR"?: T; id?: T; fr?: T; de?: T }): T => {
  if (lang === "zh") return values.zh;
  if (lang === "ru") return values.ru;
  if (lang === "es") return values.es ?? values.en;
  if (lang === "th") return values.th ?? (typeof values.en === "string" ? translatedUiText("th", values.en) as T : values.en);
  if (lang === "ms") return values.ms ?? (typeof values.en === "string" ? translatedUiText("ms", values.en) as T : values.en);
  if (lang === "vi") return values.vi ?? (typeof values.en === "string" ? translatedUiText("vi", values.en) as T : values.en);
  if (lang === "ko") return values.ko ?? (typeof values.en === "string" ? translatedUiText("ko", values.en) as T : values.en);
  if (lang === "ja") return values.ja ?? (typeof values.en === "string" ? translatedUiText("ja", values.en) as T : values.en);
  if (lang === "ar") return values.ar ?? (typeof values.en === "string" ? translatedUiText("ar", values.en) as T : values.en);
  if (lang === "pt-BR") return values["pt-BR"] ?? (typeof values.en === "string" ? translatedUiText("pt-BR", values.en) as T : values.en);
  if (lang === "id") return values.id ?? (typeof values.en === "string" ? translatedUiText("id", values.en) as T : values.en);
  if (lang === "fr") return values.fr ?? (typeof values.en === "string" ? translatedUiText("fr", values.en) as T : values.en);
  if (lang === "de") return values.de ?? (typeof values.en === "string" ? translatedUiText("de", values.en) as T : values.en);
  return values.en;
};

/** Fill newly added locale slots from English until reviewed translations are available. */
export const withVietnameseFallback = <T,>(copy: { en: T; zh: T; ru: T; es?: T; th?: T; ms?: T; vi?: T; ko?: T; ja?: T; ar?: T; "pt-BR"?: T; id?: T; fr?: T; de?: T }): Record<AsiaLang, T> => ({
  ...copy,
  es: copy.es ?? copy.en,
  th: copy.th ?? copy.en,
  ms: copy.ms ?? copy.en,
  vi: copy.vi ?? copy.en,
  ko: copy.ko ?? copy.en,
  ja: copy.ja ?? copy.en,
  ar: copy.ar ?? copy.en,
  "pt-BR": copy["pt-BR"] ?? copy.en,
  id: copy.id ?? copy.en,
  fr: copy.fr ?? copy.en,
  de: copy.de ?? copy.en,
});

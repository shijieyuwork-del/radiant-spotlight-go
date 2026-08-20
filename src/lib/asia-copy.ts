import type { AsiaLang } from "@/lib/asia-i18n";

export const asiaCopy = <T,>(lang: AsiaLang, values: { en: T; zh: T; ru: T }): T =>
  lang === "zh" ? values.zh : lang === "ru" ? values.ru : values.en;

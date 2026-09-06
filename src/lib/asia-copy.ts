import type { AsiaLang } from "@/lib/asia-i18n";

/** 语言文案选择器；未提供西班牙语时回落到英文。 */
export const asiaCopy = <T,>(lang: AsiaLang, values: { en: T; zh: T; ru: T; es?: T }): T =>
  lang === "zh" ? values.zh : lang === "ru" ? values.ru : lang === "es" ? (values.es ?? values.en) : values.en;

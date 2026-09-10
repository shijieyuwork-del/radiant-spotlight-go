import type { AsiaLang } from "@/lib/asia-i18n";

/** 语言文案选择器；缺少越南语或西班牙语时回落到英文。 */
export const asiaCopy = <T,>(lang: AsiaLang, values: { en: T; zh: T; ru: T; es?: T; vi?: T }): T =>
  lang === "zh" ? values.zh : lang === "ru" ? values.ru : lang === "es" ? (values.es ?? values.en) : lang === "vi" ? (values.vi ?? values.en) : values.en;

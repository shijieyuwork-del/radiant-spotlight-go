import type { AsiaLang } from "@/lib/asia-i18n";
import { generatedTranslations } from "@/lib/generated-translations";
import { vietnameseTranslations } from "@/lib/vietnamese-translations";

type GeneratedLang = "th" | "ms";

/** Catalog lookup for languages whose UI copy is keyed by the English source string; English when a string is not translated yet. */
export const translatedUiText = (lang: AsiaLang, english: string): string => {
  if (lang === "vi") return vietnameseTranslations[english] ?? english;
  if (lang !== "th" && lang !== "ms") return english;
  const catalog = generatedTranslations[lang as GeneratedLang] as Record<string, string>;
  return catalog[english] ?? english;
};

import type { AsiaLang } from "@/lib/asia-i18n";
import { generatedTranslations } from "@/lib/generated-translations";

type GeneratedLang = "th" | "ms";

export const translatedUiText = (lang: AsiaLang, english: string): string => {
  if (lang !== "th" && lang !== "ms") return english;
  const catalog = generatedTranslations[lang as GeneratedLang] as Record<string, string>;
  return catalog[english] ?? english;
};

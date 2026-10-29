import type { AsiaLang } from "@/lib/asia-i18n";
import locales from "./home-hero-locales.json";

export type HomeHeroCopy = {
  title: string; subtitle: string; audience: string; explore: string;
  how: string; ask: string; scopeTitle: string; scope: string;
  metaTitle: string; metaDescription: string; badge: string;
  services: string[]; servicesLabel: string;
  paymentHeadline: string; paymentDetail: string;
};
const COPY: Record<AsiaLang, HomeHeroCopy> = locales;
export const getHomeHeroCopy = (lang: AsiaLang): HomeHeroCopy => COPY[lang] ?? COPY.en;

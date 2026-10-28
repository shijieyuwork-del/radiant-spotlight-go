import { describe, expect, it } from "vitest";
import { asiaCopy } from "@/lib/asia-copy";
import { asiaLangLabel } from "@/lib/asia-i18n";
import { translatedUiText } from "@/lib/locale-text";

describe("shared language localization", () => {
  it("lists both languages in the shared language menu source", () => {
    expect(asiaLangLabel.th).toEqual({ label: "ไทย", flag: "🇹🇭" });
    expect(asiaLangLabel.ms).toEqual({ label: "Bahasa Melayu", flag: "🇲🇾" });
  });

  it("translates shared interface copy", () => {
    expect(asiaCopy("th", { en: "Start a consultation", zh: "开始咨询", ru: "", es: "" })).toBe("เริ่มการให้คำปรึกษา");
    expect(asiaCopy("ms", { en: "Start a consultation", zh: "开始咨询", ru: "", es: "" })).toBe("Mulakan perundingan");
  });

  it("falls back to English when generated copy is unavailable", () => {
    expect(translatedUiText("th", "Uncatalogued dynamic copy")).toBe("Uncatalogued dynamic copy");
    expect(translatedUiText("ms", "Uncatalogued dynamic copy")).toBe("Uncatalogued dynamic copy");
  });

  it("lists and localizes Korean and Japanese in the shared language menu source", () => {
    expect(asiaLangLabel.ko).toEqual({ label: "한국어", flag: "🇰🇷" });
    expect(asiaLangLabel.ja).toEqual({ label: "日本語", flag: "🇯🇵" });
    expect(asiaCopy("ko", { en: "Start a consultation", zh: "开始咨询", ru: "", es: "" })).toBe("상담 시작하기");
    expect(asiaCopy("ja", { en: "Start a consultation", zh: "开始咨询", ru: "", es: "" })).toBe("相談を始める");
  });

  it("lists the expanded international languages in the shared menu source", () => {
    expect(asiaLangLabel.ar).toEqual({ label: "العربية", flag: "🇸🇦" });
    expect(asiaLangLabel["pt-BR"]).toEqual({ label: "Português (Brasil)", flag: "🇧🇷" });
    expect(asiaLangLabel.id).toEqual({ label: "Bahasa Indonesia", flag: "🇮🇩" });
    expect(asiaLangLabel.fr).toEqual({ label: "Français", flag: "🇫🇷" });
    expect(asiaLangLabel.de).toEqual({ label: "Deutsch", flag: "🇩🇪" });
  });

  it("localizes the main consultation action in the expanded languages", () => {
    const copy = { en: "Start a consultation", zh: "开始咨询", ru: "", es: "" };
    expect(asiaCopy("ar", copy)).toBe("ابدأ محادثة مجانية");
    expect(asiaCopy("pt-BR", copy)).toBe("Começar conversa gratuita");
    expect(asiaCopy("id", copy)).toBe("Mulai percakapan gratis");
    expect(asiaCopy("fr", copy)).toBe("Commencer un échange gratuit");
    expect(asiaCopy("de", copy)).toBe("Kostenloses Gespräch starten");
  });
});

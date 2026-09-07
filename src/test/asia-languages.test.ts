import { describe, expect, it } from "vitest";
import { asiaCopy } from "@/lib/asia-copy";
import { asiaLangLabel } from "@/lib/asia-i18n";
import { translatedUiText } from "@/lib/locale-text";

describe("Thai and Malay localization", () => {
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
});

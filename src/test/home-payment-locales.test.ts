import { describe, expect, it } from "vitest";
import { getHomeHeroCopy } from "@/lib/home-hero-copy";
import { videoControlsCopy } from "@/lib/video-controls-copy";
import { asiaLangLabel, type AsiaLang } from "@/lib/asia-i18n";

describe("homepage payment and language coverage", () => {
  it("keeps medical fees separate from the coordination deposit", () => {
    expect(getHomeHeroCopy("zh").paymentHeadline).toBe("无隐形收费，医疗费用直接支付给医院。");
    expect(getHomeHeroCopy("en").paymentHeadline).toMatch(/medical fees directly to the hospital/);
    for (const lang of Object.keys(asiaLangLabel) as AsiaLang[]) {
      const c = getHomeHeroCopy(lang);
      expect(c.paymentDetail, lang).toContain("200");
      expect(c.services, lang).toHaveLength(4);
    }
  });
  it("provides localized first-section copy and video controls in all fourteen languages", () => {
    for (const lang of Object.keys(asiaLangLabel) as AsiaLang[]) {
      if (lang === "en") continue;
      const copy = getHomeHeroCopy(lang), english = getHomeHeroCopy("en");
      for (const key of ["title", "subtitle", "audience", "scope", "paymentHeadline", "paymentDetail", "badge", "servicesLabel"] as const) {
        expect(copy[key], `${lang}.${key}`).not.toBe(english[key]);
        expect(copy[key].trim(), `${lang}.${key}`).not.toBe("");
      }
      expect(videoControlsCopy[lang].play, lang).not.toBe(videoControlsCopy.en.play);
      expect(videoControlsCopy[lang].failed, lang).not.toBe(videoControlsCopy.en.failed);
    }
  });
});

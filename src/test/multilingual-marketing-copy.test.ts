import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getCoordinationPolicy } from "@/data/coordination-policy";
import { getPlanningMarketingCopy } from "@/lib/planning-marketing-copy";
import type { AsiaLang } from "@/lib/asia-i18n";

const nonEnglishLanguages: AsiaLang[] = ["zh", "ru", "es", "th", "ms", "vi", "ko", "ja"];

describe("multilingual marketing copy", () => {
  it("provides reviewed planning copy for every non-English locale", () => {
    const english = getPlanningMarketingCopy("en");

    for (const lang of nonEnglishLanguages) {
      const localized = getPlanningMarketingCopy(lang);
      expect(localized.title, `${lang} title`).not.toBe(english.title);
      expect(localized.subtitle, `${lang} subtitle`).not.toBe(english.subtitle);
      expect(localized.tripDetail, `${lang} trip detail`).not.toBe(english.tripDetail);
    }
  });

  it("localizes the deposit and direct-payment explanation in every locale", () => {
    const english = getCoordinationPolicy("en");

    for (const lang of nonEnglishLanguages) {
      const localized = getCoordinationPolicy(lang);
      expect(localized.depositSummary, `${lang} deposit`).not.toBe(english.depositSummary);
      expect(localized.medical, `${lang} medical payment`).not.toBe(english.medical);
      expect(localized.depositTitle).toMatch(/200/);
    }
  });

  it("keeps outdated scale and payment claims out of localized source copy", () => {
    const files = ["lib/asia-i18n.tsx", "lib/translations.ts", "lib/planning-marketing-copy.ts"];
    const source = files
      .map((file) => readFileSync(resolve(process.cwd(), "src", file), "utf8"))
      .join("\n");

    for (const outdatedClaim of [
      "100 000+",
      "6000+",
      "50개국 이상",
      "회복 일기 200만+",
      "50+ ประเทศ",
      "บันทึกฟื้นตัว 2 ล้าน+",
      "أكثر من 4,200",
      "أكثر من 50 دولة",
      "أكثر من 2 مليون",
      "상담 후 결제",
      "相談後に支払い",
      "Thanh toán sau tư vấn",
    ]) {
      expect(source).not.toContain(outdatedClaim);
    }
  });
});

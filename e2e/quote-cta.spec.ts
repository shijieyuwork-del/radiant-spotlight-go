import { test, expect, type Page } from "@playwright/test";

/**
 * “Get a free quote” 按钮文案 + 截图回归（首页 / 专家页 / 套餐页）。
 *
 * 防回滚目标：
 * - 三语按钮文案必须为字典 canonical 值：Get a free quote / 获取免费报价 / Получить бесплатную оценку
 * - 旧变体一律不得复活：Get free quote、Book your free consultation、Start your free consultation 等
 * - 按钮外观（深林绿 dark / 薄荷 primary 两变体）以基线截图锁定，任何样式/文案改动都会使比对失败
 *
 * 基线更新：bunx playwright test e2e/quote-cta.spec.ts --update-snapshots
 * 基线位置：e2e/quote-cta.spec.ts-snapshots/
 */

type Lang = "en" | "zh" | "ru";

const CTA: Record<Lang, string> = {
  en: "Get a free quote",
  zh: "获取免费报价",
  ru: "Получить бесплатную оценку",
};

/** 已废弃的旧文案变体（子串匹配即失败；注意大小写敏感，"Get a free quote" 不含大写 "Free quote"） */
const FORBIDDEN = [
  "Get free quote",
  "Free quote",
  "Book your free consultation",
  "Book a Free Video Consultation",
  "Start your free consultation",
  "免费预约面诊",
];

const LANGS: Lang[] = ["en", "zh", "ru"];

/** 进入页面并写入目标语言（与 asia-i18n 的 STORE 键一致），等待字体就绪保证截图稳定 */
const gotoWithLang = async (page: Page, path: string, lang: Lang) => {
  await page.goto(path);
  await page.evaluate(
    ([store, l]) => localStorage.setItem(store, JSON.stringify({ lang: l, currency: l === "zh" ? "CNY" : "USD" })),
    ["glowy.asia.v1", lang],
  );
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
};

/** 旧文案负向断言 */
const expectNoLegacyCopy = async (page: Page) => {
  const body = await page.locator("body").innerText();
  for (const legacy of FORBIDDEN) {
    expect(body, `页面不得出现旧文案「${legacy}」`).not.toContain(legacy);
  }
};

test.describe("首页 / CTA 回归", () => {
  for (const lang of LANGS) {
    test(`hero 与 HowItWorks 按钮为「${CTA[lang]}」（${lang}），外观匹配基线`, async ({ page }) => {
      await gotoWithLang(page, "/", lang);

      const heroCta = page.getByRole("link", { name: CTA[lang], exact: true }).first();
      await expect(heroCta, "hero 区必须存在 canonical CTA 链接").toBeVisible();
      await expect(heroCta).toHaveCSS("white-space", "nowrap"); // 防长文案换行回退
      await expect(heroCta).toHaveScreenshot(`home-hero-cta-${lang}.png`, { maxDiffPixelRatio: 0.02 });

      // HowItWorks 区块的 <Button>（role=button，与 hero 的 <a> 区分）
      const howItWorksCta = page.getByRole("button", { name: CTA[lang], exact: true });
      await expect(howItWorksCta, "HowItWorks 区块必须使用同一文案").toBeVisible();
      await expect(howItWorksCta).toHaveScreenshot(`home-howitworks-cta-${lang}.png`, { maxDiffPixelRatio: 0.02 });

      await expectNoLegacyCopy(page);
    });
  }
});

test.describe("专家页 /doctors CTA 回归", () => {
  for (const lang of LANGS) {
    test(`专家卡片按钮为「${CTA[lang]}」（${lang}），dark 变体匹配基线`, async ({ page }) => {
      await gotoWithLang(page, "/doctors", lang);
      await expect(page.getByText(lang === "zh" ? "精选专家" : lang === "ru" ? "Рекомендуемые эксперты" : "Featured experts")).toBeVisible();

      const cardCta = page.getByRole("link", { name: CTA[lang], exact: true }).first();
      await expect(cardCta, "每张专家卡片必须提供 canonical CTA").toBeVisible();
      await expect(cardCta).toHaveScreenshot(`doctors-card-cta-${lang}.png`, { maxDiffPixelRatio: 0.02 });

      await expectNoLegacyCopy(page);
    });
  }
});

test.describe("套餐页 /packages CTA 回归", () => {
  for (const lang of LANGS) {
    test(`三个套餐按钮均为「${CTA[lang]}」（${lang}），primary 变体匹配基线`, async ({ page }) => {
      await gotoWithLang(page, "/packages", lang);
      await expect(
        page.getByText(lang === "zh" ? "选择您的管家服务级别" : lang === "ru" ? "Выберите уровень консьерж-сервиса" : "Choose Your Concierge Level"),
      ).toBeVisible();

      const ctas = page.getByRole("link", { name: CTA[lang], exact: true });
      await expect(ctas, "Basic / Gold / Diamond 三档各一个 CTA").toHaveCount(3);

      // Gold 档（primary 薄荷绿变体）居中，锁定其外观
      await expect(ctas.nth(1)).toHaveScreenshot(`packages-gold-cta-${lang}.png`, { maxDiffPixelRatio: 0.02 });

      await expectNoLegacyCopy(page);
    });
  }
});

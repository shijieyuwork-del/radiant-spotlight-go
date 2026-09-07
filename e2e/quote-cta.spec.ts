import { test, expect, type Page } from "@playwright/test";

/**
 * “Start a consultation” 按钮文案 + 截图回归（首页 / 专家页 / 套餐页）。
 *
 * 防回滚目标：
 * - 四语按钮文案必须为字典 canonical 值：Start a consultation / 开始咨询 / Начать консультацию / Solicita una consulta
 * - 旧变体一律不得复活：Get a free quote、Free quote、Book your free consultation、Start your free consultation 等
 * - 按钮外观（深林绿 dark / 薄荷 primary 两变体）以基线截图锁定，任何样式/文案改动都会使比对失败
 *
 * 基线更新：bunx playwright test e2e/quote-cta.spec.ts --update-snapshots
 * 基线位置：e2e/quote-cta.spec.ts-snapshots/
 */

type Lang = "en" | "zh" | "ru" | "es";

const CTA: Record<Lang, string> = {
  en: "Start a consultation",
  zh: "开始咨询",
  ru: "Начать консультацию",
  es: "Solicita una consulta",
};

/** 已废弃的旧文案变体（子串匹配即失败；注意大小写敏感，"Start a consultation" 不含大写 "Consultation" 单独出现） */
const FORBIDDEN = [
  "Get a free quote",
  "Free quote",
  "Book your free consultation",
  "Book a Free Video Consultation",
  "Start your free consultation",
  "免费预约面诊",
];

const LANGS: Lang[] = ["en", "zh", "ru", "es"];

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
    test(`hero 按钮为「${CTA[lang]}」（${lang}），外观匹配基线`, async ({ page }) => {
      await gotoWithLang(page, "/", lang);

      const heroCta = page.locator('[data-testid="home-hero-cta"]').first();
      await expect(heroCta, "hero 区必须存在 canonical CTA 按钮").toBeVisible();
      await expect(heroCta).toHaveCSS("white-space", "nowrap"); // 防长文案换行回退
      await expect(heroCta).toHaveScreenshot(`home-hero-cta-${lang}.png`, { maxDiffPixelRatio: 0.02 });

      await expectNoLegacyCopy(page);
    });
  }
});

test.describe("专家页 /doctors CTA 回归", () => {
  for (const lang of LANGS) {
    test(`专家卡片按钮为「${CTA[lang]}」（${lang}），dark 变体匹配基线`, async ({ page }) => {
      await gotoWithLang(page, "/doctors", lang);

      // 卡片 CTA 带 quoteCtx → 渲染为 <button>（打开咨询弹窗）；卡片数量随数据变化，只锁定至少 1 个
      const cardCtas = page.getByRole("button", { name: CTA[lang], exact: true });
      await expect(cardCtas.first(), "每张专家卡片必须提供 canonical CTA").toBeVisible();
      await expect(cardCtas.first()).toHaveCSS("white-space", "nowrap");
      await expect(cardCtas.first()).toHaveScreenshot(`doctors-card-cta-${lang}.png`, { maxDiffPixelRatio: 0.02 });

      await expectNoLegacyCopy(page);
    });
  }
});

test.describe("套餐页 /packages CTA 回归", () => {
  for (const lang of LANGS) {
    test(`hero 与底部按钮均为「${CTA[lang]}」（${lang}），两变体匹配基线`, async ({ page }) => {
      await gotoWithLang(page, "/packages", lang);

      // hero（dark 深绿）+ 底部转化区（primary 薄荷绿），均无 quoteCtx → 渲染为 <a>
      const ctas = page.getByRole("link", { name: CTA[lang], exact: true });
      await expect(ctas, "套餐页 hero 与底部各一个 CTA").toHaveCount(2);

      await expect(ctas.first()).toBeVisible();
      await expect(ctas.first()).toHaveScreenshot(`packages-hero-cta-${lang}.png`, { maxDiffPixelRatio: 0.02 });
      await ctas.nth(1).scrollIntoViewIfNeeded();
      await expect(ctas.nth(1)).toHaveScreenshot(`packages-bottom-cta-${lang}.png`, { maxDiffPixelRatio: 0.02 });

      await expectNoLegacyCopy(page);
    });
  }
});

/**
 * "Get a free quote" 按钮 i18n 回归测试。
 *
 * 架构约定（防止再次出现多位置文案 drift）：
 *   - 按钮组件唯一实现：components/QuoteCtaButton.tsx
 *   - 文案唯一来源：lib/asia-i18n.tsx 字典键 hero.cta（en/zh/ru）
 *   - 各页面/组件一律渲染 <QuoteCtaButton>，不得内联维护三语文案；
 *     悬浮咨询入口 FloatingQuoteCTA 的标签同样取自 hero.cta。
 *
 * 这些用例确保：
 *   - 三个语言都不会漏改（字典值与规范文案逐字一致、键集合齐全）；
 *   - 英文语法不会回退（必须是 "Get a free quote"，带冠词 a；
 *     "Get free quote" 语法错误，全站禁止）；
 *   - 字典键受 AsiaDictKey = keyof typeof dict.en 类型约束，
 *     缺键会在构建/typecheck 阶段直接失败。
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const SRC = join(__dirname, "..");
const read = (rel: string) => readFileSync(join(SRC, rel), "utf-8");

/** 用户确认的唯一规范文案（"Get a free quote" 为正确语法，必须带冠词 a） */
const CANONICAL = {
  en: "Get a free quote",
  zh: "获取免费报价",
  ru: "Получить бесплатную оценку",
} as const;

/** 渲染该按钮的页面/组件（必须走 QuoteCtaButton，不得内联文案） */
const BUTTON_CONSUMERS = [
  "pages/AsiaIndex.tsx",
  "pages/Packages.tsx",
  "pages/Doctors.tsx",
  "components/DoctorProfile.tsx",
];

/* ---------------- 源码遍历辅助 ---------------- */
const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? walk(join(dir, e.name))
      : /\.tsx?$/.test(e.name) && !e.name.includes(".test.")
        ? [join(dir, e.name)]
        : [],
  );
const sourceFiles = ["pages", "components", "lib", "data"].flatMap((d) => walk(join(SRC, d)));

/* ---------------- 字典解析辅助 ---------------- */
const dictSrc = read("lib/asia-i18n.tsx");

/** 取出某个语言块（`  en: {` 独占一行开始，到下一个语言块或文件尾） */
const langBlock = (lang: "en" | "zh" | "ru"): string => {
  const start = dictSrc.indexOf(`\n  ${lang}: {\n`);
  if (start === -1) return "";
  const rest = dictSrc.slice(start + 1);
  const next = rest.search(/\n  (en|zh|ru): \{\n/);
  return next === -1 ? rest : rest.slice(0, next + 1);
};

const dictValue = (block: string, key: string): string | null =>
  block.match(new RegExp(`"${key.replace(/\./g, "\\.")}":\\s*"([^"]*)"`))?.[1] ?? null;

const dictKeys = (block: string): string[] =>
  [...block.matchAll(/^\s*"([^"]+)":\s*"/gm)].map((m) => m[1]).sort();

/* ---------------- 1. 字典键 hero.cta（唯一文案来源） ---------------- */
describe("quote CTA i18n — 字典键 hero.cta（唯一文案来源）", () => {
  it("en/zh/ru 三个语言块都存在 hero.cta（不漏翻译）", () => {
    for (const lang of ["en", "zh", "ru"] as const) {
      expect(dictValue(langBlock(lang), "hero.cta"), `hero.cta 缺少 ${lang} 翻译`).not.toBeNull();
    }
  });

  it("英文为正确语法：Get a free quote（带冠词 a）", () => {
    expect(dictValue(langBlock("en"), "hero.cta")).toBe(CANONICAL.en);
  });

  it("中文与规范文案逐字一致且包含“免费报价”语义", () => {
    const zh = dictValue(langBlock("zh"), "hero.cta") ?? "";
    expect(zh).toBe(CANONICAL.zh);
    expect(zh).toContain("免费");
    expect(zh).toContain("报价");
  });

  it("俄文与规范文案逐字一致且包含“免费”与“报价/估算”语义", () => {
    const ru = dictValue(langBlock("ru"), "hero.cta") ?? "";
    expect(ru).toBe(CANONICAL.ru);
    expect(ru).toMatch(/бесплатн/);
    expect(ru).toMatch(/оценк|расчёт|смет/i);
  });

  it("zh/ru 字典键集合与 en 完全一致（任何语言都不漏键）", () => {
    const enKeys = dictKeys(langBlock("en"));
    expect(enKeys.length).toBeGreaterThan(0);
    expect(dictKeys(langBlock("zh"))).toEqual(enKeys);
    expect(dictKeys(langBlock("ru"))).toEqual(enKeys);
  });
});

/* ---------------- 2. 统一组件 QuoteCtaButton ---------------- */
describe("quote CTA — 统一组件 QuoteCtaButton", () => {
  it("组件存在且文案取自字典 hero.cta（不内联三语文案）", () => {
    const src = read("components/QuoteCtaButton.tsx");
    expect(src).toContain('t("hero.cta")');
    expect(src).not.toMatch(/获取免费报价|Получить бесплатную/);
  });

  it("各页面/组件通过 QuoteCtaButton 渲染该按钮", () => {
    for (const f of BUTTON_CONSUMERS) {
      expect(read(f), `${f} 未使用 QuoteCtaButton`).toContain("<QuoteCtaButton");
    }
  });

  it("全站不再残留内联的 quote 三语文案（c('...free quote...') 形式）", () => {
    const offenders: string[] = [];
    for (const file of sourceFiles) {
      const content = readFileSync(file, "utf-8");
      for (const m of content.matchAll(/\bc\(\s*"[^"]*free quote[^"]*"/gi)) {
        offenders.push(`${relative(SRC, file)}: ${m[0].slice(0, 80)}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("悬浮咨询入口 FloatingQuoteCTA 的标签同样来自字典 hero.cta", () => {
    const src = read("components/QuoteRequest.tsx");
    expect(src).toContain('t("hero.cta")');
    expect(src).not.toContain("Get a Free Quote");
  });
});

/* ---------------- 3. 首页 How-it-works 步骤标题 ---------------- */
describe("quote CTA i18n — 首页 How-it-works 步骤", () => {
  it("第一步标题三语同步（en 为 quote 时 zh/ru 不得仍是“咨询”旧文案）", () => {
    const asia = read("pages/AsiaIndex.tsx");
    const m = asia.match(
      /en:\s*\["Get a free quote"[\s\S]{0,400}?zh:\s*\["([^"]+)"[\s\S]{0,400}?ru:\s*\["([^"]+)"/,
    );
    expect(m, "未找到第一步的 en/zh/ru 三语标题").not.toBeNull();
    expect(m![1]).toBe(CANONICAL.zh);
    expect(m![2]).toBe(CANONICAL.ru);
  });
});

/* ---------------- 4. 英文语法守卫（全站扫描） ---------------- */
describe("quote CTA i18n — 英文语法守卫", () => {
  it("全站不得出现缺少冠词的 “Get free quote”（语法错误）", () => {
    const bad: string[] = [];
    for (const file of sourceFiles) {
      readFileSync(file, "utf-8")
        .split("\n")
        .forEach((line, i) => {
          if (/\bget free quote\b/i.test(line)) {
            bad.push(`${relative(SRC, file)}:${i + 1} ${line.trim().slice(0, 100)}`);
          }
        });
    }
    expect(bad).toEqual([]);
  });

  it("所有英文 quote 按钮文案都带限定词（a / your）", () => {
    const bad: string[] = [];
    for (const file of sourceFiles) {
      for (const m of readFileSync(file, "utf-8").matchAll(/["']([^"']*get[^"']*free quote[^"']*)["']/gi)) {
        if (!/\bget (a|your) free quote\b/i.test(m[1])) {
          bad.push(`${relative(SRC, file)}: "${m[1]}"`);
        }
      }
    }
    expect(bad).toEqual([]);
  });
});

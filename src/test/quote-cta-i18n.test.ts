/**
 * "Get a free quote" 按钮 i18n 回归测试。
 *
 * 该按钮是首页 Hero、/packages、/doctors 的核心转化 CTA，同一文案维护在多个位置：
 *   1. lib/asia-i18n.tsx 字典键 hero.cta（en/zh/ru 三个语言块）
 *   2. pages/AsiaIndex.tsx Hero copy.contact 的三个语言分支
 *   3. pages/Packages.tsx / pages/Doctors.tsx 的内联 c(en, zh, ru) 调用
 *   4. pages/AsiaIndex.tsx "How it works" 第一步标题（en/zh/ru 数组）
 *
 * 这些用例确保：
 *   - 三个语言都不会漏改（所有位置的 zh/ru 与规范文案逐字一致）；
 *   - 英文语法不会回退（必须是 "Get a free quote"，带冠词 a；
 *     "Get free quote" 语法错误，全站禁止）；
 *   - 字典键在 en/zh/ru 三个语言块中齐全（配合 AsiaDictKey = keyof typeof dict.en
 *     的类型约束，缺键会在构建/typecheck 阶段直接失败）。
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SRC = join(__dirname, "..");
const read = (rel: string) => readFileSync(join(SRC, rel), "utf-8");

/** 用户确认的唯一规范文案（"Get a free quote" 为正确语法，必须带冠词 a） */
const CANONICAL = {
  en: "Get a free quote",
  zh: "获取免费报价",
  ru: "Получить бесплатную оценку",
} as const;

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

/* ---------------- 内联 c(en, zh, ru) 解析 ---------------- */
interface Triple {
  file: string;
  en: string;
  zh: string;
  ru: string;
}
const quoteTriples = (file: string): Triple[] =>
  [...read(file).matchAll(/\bc\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\)/g)]
    .map((m) => ({ file, en: m[1], zh: m[2], ru: m[3] }))
    .filter((t) => /free quote/i.test(t.en));

/* ---------------- 1. 字典键 hero.cta ---------------- */
describe("quote CTA i18n — 字典键 hero.cta", () => {
  it("en/zh/ru 三个语言块都存在 hero.cta（不漏翻译）", () => {
    for (const lang of ["en", "zh", "ru"] as const) {
      expect(dictValue(langBlock(lang), "hero.cta"), `hero.cta 缺少 ${lang} 翻译`).not.toBeNull();
    }
  });

  it("英文为正确语法：Get a free quote（带冠词 a）", () => {
    expect(dictValue(langBlock("en"), "hero.cta")).toBe(CANONICAL.en);
  });

  it("中文包含“免费报价”语义", () => {
    const zh = dictValue(langBlock("zh"), "hero.cta") ?? "";
    expect(zh).toContain("免费");
    expect(zh).toContain("报价");
  });

  it("俄文包含“免费”与“报价/估算”语义（бесплатн + оценка/расчёт/смета）", () => {
    const ru = dictValue(langBlock("ru"), "hero.cta") ?? "";
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

/* ---------------- 2. 内联 c() 调用（Packages / Doctors） ---------------- */
describe("quote CTA i18n — 内联 c(en, zh, ru) 调用", () => {
  const files = ["pages/Packages.tsx", "pages/Doctors.tsx"];
  const triples = files.flatMap(quoteTriples);

  it("每个按钮位置都提供完整的三语文案", () => {
    expect(triples.length).toBeGreaterThanOrEqual(3); // Packages ×2 + Doctors ×1
    for (const t of triples) {
      expect(t.zh.trim(), `${t.file} 的 quote 按钮缺少中文`).not.toBe("");
      expect(t.ru.trim(), `${t.file} 的 quote 按钮缺少俄文`).not.toBe("");
    }
  });

  it("所有内联文案与规范文案逐字一致（防漏改 / 防 drift）", () => {
    for (const t of triples) {
      expect(t.en, `${t.file} 英文应为 "${CANONICAL.en}"`).toBe(CANONICAL.en);
      expect(t.zh, `${t.file} 中文应为 "${CANONICAL.zh}"`).toBe(CANONICAL.zh);
      expect(t.ru, `${t.file} 俄文应为 "${CANONICAL.ru}"`).toBe(CANONICAL.ru);
    }
  });
});

/* ---------------- 3. 首页 Hero 与流程步骤 ---------------- */
describe("quote CTA i18n — 首页 Hero 与 How-it-works 步骤", () => {
  const asia = read("pages/AsiaIndex.tsx");

  it("Hero contact 按钮三个语言分支齐全且与规范文案一致", () => {
    const contacts = [...asia.matchAll(/contact:\s*"([^"]+)"/g)].map((m) => m[1]);
    expect(contacts.length).toBe(3);
    expect(contacts).toContain(CANONICAL.en);
    expect(contacts).toContain(CANONICAL.zh);
    expect(contacts).toContain(CANONICAL.ru);
  });

  it("“How it works” 第一步标题三语同步（en 为 quote 时 zh/ru 不得仍是“咨询”旧文案）", () => {
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
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory()
        ? walk(join(dir, e.name))
        : /\.tsx?$/.test(e.name) && !e.name.includes(".test.")
          ? [join(dir, e.name)]
          : [],
    );
  const sourceFiles = ["pages", "components", "lib", "data"].flatMap((d) => walk(join(SRC, d)));

  it("全站不得出现缺少冠词的 “Get free quote”（语法错误）", () => {
    const bad: string[] = [];
    for (const file of sourceFiles) {
      readFileSync(file, "utf-8")
        .split("\n")
        .forEach((line, i) => {
          if (/\bget free quote\b/i.test(line)) {
            bad.push(`${file}:${i + 1} ${line.trim().slice(0, 100)}`);
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
          bad.push(`${file}: "${m[1]}"`);
        }
      }
    }
    expect(bad).toEqual([]);
  });
});

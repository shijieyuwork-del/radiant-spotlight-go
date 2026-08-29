/**
 * 全站“未定义 React 组件”静态检查（lint 式守卫）。
 *
 * 背景：AsiaIndex 曾出现 `TreatmentsSection is not defined` 白屏 ——
 * JSX 里引用了未 import/未声明的组件，TypeScript 对 <Foo /> 不一定报错
 * （取决于配置），但运行时直接 ReferenceError。
 *
 * 本测试在构建前拦截：扫描 src/pages 与 src/components 下所有 .tsx，
 * 对每个以 <Foo 形式出现的大写标识符，要求它满足以下任一条件：
 *   1. 被 import（具名 / 默认 / namespace 均可）；
 *   2. 本文件内声明（const Foo / function Foo / class Foo）；
 *   3. 命中内置白名单（React  fragments、第三方全局组件等）。
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const SRC = join(__dirname, "..");

const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? walk(join(dir, e.name))
      : /\.tsx$/.test(e.name) && !e.name.includes(".test.")
        ? [join(dir, e.name)]
        : [],
  );

/** 已知安全的全局/内置标识符 */
const WHITELIST = new Set([
  "Fragment",
  "Suspense",
  "StrictMode",
]);

/** 收集文件中可用的标识符 */
const collectAvailable = (src: string): Set<string> => {
  const available = new Set<string>(WHITELIST);

  // import ... from '...'（具名 { A, B as C } / 默认 D / namespace * as E）
  for (const m of src.matchAll(/import\s+(?:type\s+)?([^'"]*?)\s+from\s*["'][^"']+["']/g)) {
    const clause = m[1];
    const named = clause.match(/\{([^}]*)\}/);
    if (named) {
      for (const part of named[1].split(",")) {
        const name = part.trim().replace(/^type\s+/, "").split(/\s+as\s+/).pop()?.trim();
        if (name) available.add(name);
      }
    }
    const withoutNamed = clause.replace(/\{[^}]*\}/, "").replace(/\*\s+as\s+([A-Za-z0-9_]+)/, (_, ns) => {
      available.add(ns);
      return "";
    });
    const def = withoutNamed.replace(/,/g, "").trim();
    if (def) available.add(def);
  }
  // 整行默认导入（上面正则可能漏掉无空格变体），兜底：import X from
  for (const m of src.matchAll(/import\s+([A-Z][A-Za-z0-9]*)\s+from/g)) available.add(m[1]);

  // 本地声明
  for (const m of src.matchAll(/(?:const|let|var|function|class)\s+([A-Z][A-Za-z0-9]*)/g)) {
    available.add(m[1]);
  }
  // 函数参数/解构中的大写组件（如 ({ Icon }) ），兜底放行
  for (const m of src.matchAll(/[({,:]\s*(?:\.\.\.)?([A-Z][A-Za-z0-9]*)[,}):]/g)) {
    available.add(m[1]);
  }
  // 解构重命名：icon: Icon
  for (const m of src.matchAll(/[a-zA-Z0-9_]+\s*:\s*([A-Z][A-Za-z0-9]*)[,}\s]/g)) {
    available.add(m[1]);
  }
  return available;
};

describe("静态守卫 — 页面/组件中不得引用未定义的 React 组件", () => {
  const files = ["pages", "components"].flatMap((d) => walk(join(SRC, d)));

  it("每个 JSX 大写标识符都有 import 或本地声明", () => {
    const offenders: string[] = [];

    for (const file of files) {
      const src = readFileSync(file, "utf-8");
      const available = collectAvailable(src);

      const used = new Set<string>();
      // 前一个字符是字母/数字/点/下划线则是 TS 泛型（useRef<HTMLDivElement>），排除
      for (const m of src.matchAll(/(^|[^A-Za-z0-9_.$])<([A-Z][A-Za-z0-9]*)[\s/>]/gm)) {
        used.add(m[2]);
      }

      for (const name of used) {
        if (!available.has(name)) {
          offenders.push(`${relative(SRC, file)}: <${name}> 未 import 且未声明`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});

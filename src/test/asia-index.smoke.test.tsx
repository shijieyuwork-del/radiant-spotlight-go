/**
 * 首页 AsiaIndex 渲染冒烟测试。
 *
 * 目标：防止再次出现 “XxxSection is not defined” 导致的白屏 ——
 * 1. 源码级守卫：AsiaIndex 中以 <Xxx /> 形式引用的组件必须都有对应的 import；
 * 2. 渲染级守卫：在真实 Provider 树中挂载 AsiaIndex，任何未定义的组件引用
 *    都会在 render 阶段抛错，使测试失败（即回归保护）。
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AsiaI18nProvider } from "@/lib/asia-i18n";
import { I18nProvider } from "@/lib/i18n";
import { QuoteProvider } from "@/components/QuoteRequest";
import AsiaIndex from "@/pages/AsiaIndex";

const SRC = join(__dirname, "..");

describe("AsiaIndex 冒烟 — 源码级：JSX 引用都有 import", () => {
  it("AsiaIndex.tsx 中使用的每个大写组件都能解析到 import 或本地定义", () => {
    const src = readFileSync(join(SRC, "pages/AsiaIndex.tsx"), "utf-8");

    // 文件中实际渲染的组件（<Foo 或 <Foo.Bar 形式，排除小写 HTML 标签）
    const used = new Set<string>();
    for (const m of src.matchAll(/<([A-Z][A-Za-z0-9]*)/g)) used.add(m[1]);

    // import 进来的标识符
    const imported = new Set<string>();
    for (const m of src.matchAll(/import\s+(?:type\s+)?(?:\{([^}]*)\}|([A-Za-z0-9_]+))[^"']*from/g)) {
      if (m[2]) imported.add(m[2]);
      if (m[1]) {
        for (const part of m[1].split(",")) {
          const name = part.trim().split(/\s+as\s+/).pop()?.trim();
          if (name) imported.add(name);
        }
      }
    }

    // 本地声明（const X = / function X / const X:）
    for (const m of src.matchAll(/(?:const|function)\s+([A-Z][A-Za-z0-9]*)/g)) {
      imported.add(m[1]);
    }

    const missing = [...used].filter((name) => !imported.has(name));
    expect(missing, `AsiaIndex 引用了未定义的组件: ${missing.join(", ")}`).toEqual([]);
  });
});

describe("AsiaIndex 冒烟 — 渲染级：挂载不抛错", () => {
  it("在完整 Provider 树中渲染 AsiaIndex，无未定义组件错误", () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <I18nProvider>
            <AsiaI18nProvider>
              <QuoteProvider>
                <TooltipProvider>
                  <AsiaIndex />
                </TooltipProvider>
              </QuoteProvider>
            </AsiaI18nProvider>
          </I18nProvider>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // 页面主体确实渲染出了内容（不是空壳/白屏）
    expect(container.innerHTML.length).toBeGreaterThan(500);
    // 首页标题（hero H1）存在
    expect(screen.getAllByRole("heading", { level: 1 }).length).toBeGreaterThan(0);
  });
});

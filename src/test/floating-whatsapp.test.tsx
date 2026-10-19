/**
 * 浮动 WhatsApp 入口回归测试。
 *
 * 用户要求：站点已有 +1 470 861 3825，需要浮动 WhatsApp 按钮，并在移动端固定显示。
 * 这里锁住三件事：
 *   1. 号码来自 consultationHandoffUrl（wa.me/14708613825），不得内联第二个号码；
 *   2. 入口是固定在视口右下角的常驻控件（移动端不靠滚动才出现、也不隐藏）；
 *   3. 隐私提示展开时让位，内容管理页不显示。
 */
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { AsiaI18nProvider } from "@/lib/asia-i18n";
import { consultationHandoffUrl } from "@/lib/consultation-handoff";

const at = (path: string) =>
  render(
    <AsiaI18nProvider>
      <MemoryRouter initialEntries={[path]}>
        <FloatingWhatsApp />
      </MemoryRouter>
    </AsiaI18nProvider>,
  );

const bubble = () => screen.getByTestId("floating-whatsapp");

afterEach(cleanup);

describe("floating WhatsApp bubble", () => {
  it("links to the site's existing coordinator number (+1 470 861 3825)", () => {
    at("/");
    const link = bubble();
    expect(link.getAttribute("href")).toContain("wa.me/14708613825");
    expect(link.getAttribute("href")).toBe(consultationHandoffUrl("whatsapp", {}));
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("is named as a WhatsApp chat entry", () => {
    at("/");
    expect(screen.getByRole("link", { name: /WhatsApp/i })).toBeInTheDocument();
  });

  it("stays pinned to the viewport corner instead of hiding on mobile", () => {
    at("/");
    const cls = bubble().className;
    expect(cls).toContain("fixed");
    expect(cls).toContain("right-4");
    expect(cls).toMatch(/bottom-\[max\(1rem,env\(safe-area-inset-bottom\)\)\]/);
    expect(cls).not.toMatch(/\bhidden\b/);
    expect(cls).not.toMatch(/\bsm:block\b/);
    expect(cls).not.toMatch(/\bopacity-0\b/);
  });

  it("shows on the homepage and on deeper pages without any scroll gate", () => {
    for (const path of ["/", "/before-after", "/clinics", "/privacy"]) {
      at(path);
      expect(bubble()).toBeInTheDocument();
    }
  });

  it("steps aside while the privacy prompt is open and returns after it closes", () => {
    at("/");
    expect(bubble()).toBeInTheDocument();
    act(() => {
      window.dispatchEvent(new CustomEvent("ca:consent-banner", { detail: true }));
    });
    expect(screen.queryByTestId("floating-whatsapp")).not.toBeInTheDocument();
    act(() => {
      window.dispatchEvent(new CustomEvent("ca:consent-banner", { detail: false }));
    });
    expect(bubble()).toBeInTheDocument();
  });

  it("does not appear inside the content manager", () => {
    at("/admin/content");
    expect(screen.queryByTestId("floating-whatsapp")).not.toBeInTheDocument();
  });
});

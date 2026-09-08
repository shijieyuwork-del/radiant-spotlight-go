import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ConsentBanner from "@/components/ConsentBanner";
import { AsiaI18nProvider } from "@/lib/asia-i18n";

const choose = vi.hoisted(() => vi.fn());
vi.mock("@/lib/analytics", () => ({
  analyticsConfigured: () => true, getAnalyticsConsent: () => "unset",
  getAnalyticsRegion: () => "consent-required", setAnalyticsConsent: choose,
}));
beforeEach(() => { vi.useFakeTimers(); localStorage.clear(); sessionStorage.clear(); choose.mockReset(); });
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("readable privacy choices", () => {
  it("uses an opaque semantic card surface and keeps essential-only available", () => {
    render(<AsiaI18nProvider><MemoryRouter><ConsentBanner /></MemoryRouter></AsiaI18nProvider>);
    act(() => { vi.advanceTimersByTime(1200); });
    const panel = screen.getByRole("complementary", { name: "Analytics privacy choices" });
    expect(panel).toHaveClass("bg-card", "text-foreground");
    expect(panel).not.toHaveClass("bg-card/98", "backdrop-blur");
    fireEvent.click(screen.getByRole("button", { name: "Essential only" }));
    expect(choose).toHaveBeenCalledWith("denied");
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
  });
});

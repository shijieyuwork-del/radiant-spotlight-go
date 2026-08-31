import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("@/lib/analytics", () => ({
  analyticsConfigured: () => true,
  getAnalyticsConsent: () => "unset",
  setAnalyticsConsent: vi.fn(),
  trackPageView: vi.fn(),
}));

import ConsentBanner from "@/components/ConsentBanner";

const renderBanner = () =>
  render(
    <MemoryRouter>
      <ConsentBanner />
    </MemoryRouter>,
  );

describe("ConsentBanner slim bar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.sessionStorage.clear();
  });
  afterEach(() => vi.useRealTimers());

  it("does not render on first paint, appears after 1200ms", () => {
    renderBanner();
    expect(screen.queryByLabelText("Analytics privacy choices")).toBeNull();
    act(() => void vi.advanceTimersByTime(1199));
    expect(screen.queryByLabelText("Analytics privacy choices")).toBeNull();
    act(() => void vi.advanceTimersByTime(2));
    expect(screen.getByLabelText("Analytics privacy choices")).toBeTruthy();
  });

  it("opens immediately via ca:open-privacy-choices event", () => {
    renderBanner();
    act(() => void window.dispatchEvent(new Event("ca:open-privacy-choices")));
    expect(screen.getByLabelText("Analytics privacy choices")).toBeTruthy();
  });

  it("X closes and remembers dismissal for the session", () => {
    const { unmount } = renderBanner();
    act(() => void vi.advanceTimersByTime(1200));
    fireEvent.click(screen.getByLabelText("Close privacy choices"));
    expect(screen.queryByLabelText("Analytics privacy choices")).toBeNull();
    expect(window.sessionStorage.getItem("ca-consent-dismissed")).toBe("1");
    unmount();
    renderBanner();
    act(() => void vi.advanceTimersByTime(5000));
    expect(screen.queryByLabelText("Analytics privacy choices")).toBeNull();
  });

  it("Escape closes like the X", () => {
    renderBanner();
    act(() => void vi.advanceTimersByTime(1200));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByLabelText("Analytics privacy choices")).toBeNull();
    expect(window.sessionStorage.getItem("ca-consent-dismissed")).toBe("1");
  });

  it("shows trilingual copy (zh/ru strings exist via asiaCopy default en)", () => {
    renderBanner();
    act(() => void vi.advanceTimersByTime(1200));
    expect(screen.getByText(/Optional analytics help us improve the site/)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Read privacy notice" })).toBeTruthy();
  });
});

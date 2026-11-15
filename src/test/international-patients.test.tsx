import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import InternationalPatients from "@/pages/InternationalPatients";
import { INTERNATIONAL_GUIDES, INTERNATIONAL_HUB, VIETNAM_GUIDE, internationalLanguage } from "@/data/internationalPatients";
import { AsiaI18nProvider, useAsia } from "@/lib/asia-i18n";

afterEach(() => { cleanup(); localStorage.clear(); });

describe("international visitor guides", () => {
  it.each(INTERNATIONAL_GUIDES)("renders the intended guide at $path", async guide => {
    render(<MemoryRouter initialEntries={[guide.path]}><InternationalPatients /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(guide.title);
    expect(screen.getByText(guide.budget)).toBeVisible();
    await waitFor(() => expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", `https://sinoaesthetics.com${guide.path}`));
    expect(document.querySelectorAll('link[hreflang]')).toHaveLength(guide.country === "Vietnam" || guide.language === "vi" ? 3 : 0);
    expect(document.querySelector('script[type="application/ld+json"]')?.textContent).not.toContain('"reviewedBy"');
  });

  it("makes the Vietnamese entry directly discoverable from the hub", () => {
    render(<MemoryRouter initialEntries={[INTERNATIONAL_HUB]}><InternationalPatients /></MemoryRouter>);
    expect(screen.getAllByRole("link").some(a => a.getAttribute("href") === VIETNAM_GUIDE)).toBe(true);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
  });

  it("does not keep Vietnam alternate links on an unrelated page", () => {
    const view = render(<MemoryRouter initialEntries={[VIETNAM_GUIDE]}><InternationalPatients /></MemoryRouter>);
    expect(document.querySelectorAll('link[hreflang]')).toHaveLength(3);
    view.unmount();
    render(<MemoryRouter initialEntries={[`${INTERNATIONAL_HUB}/canada`]}><InternationalPatients /></MemoryRouter>);
    expect(document.querySelectorAll('link[hreflang]')).toHaveLength(0);
  });

  it("uses the URL language without overwriting the visitor's saved preference", () => {
    localStorage.setItem("glowy.asia.v1", JSON.stringify({ lang: "zh", currency: "CNY" }));
    const Probe = () => <p data-testid="language">{useAsia().lang}</p>;
    const view = render(<AsiaI18nProvider languageOverride="vi"><Probe /></AsiaI18nProvider>);
    expect(screen.getByTestId("language")).toHaveTextContent("vi");
    expect(document.documentElement.lang).toBe("vi");
    expect(JSON.parse(localStorage.getItem("glowy.asia.v1")!).lang).toBe("zh");
    view.rerender(<AsiaI18nProvider><Probe /></AsiaI18nProvider>);
    expect(screen.getByTestId("language")).toHaveTextContent("zh");
  });

  it("does not force a language on ordinary or unknown routes", () => {
    expect(internationalLanguage(VIETNAM_GUIDE + "/")).toBe("vi");
    expect(internationalLanguage(INTERNATIONAL_HUB + "/australia")).toBe("en");
    expect(internationalLanguage("/treatments/rhinoplasty")).toBeUndefined();
    expect(internationalLanguage("/international-patients/unknown")).toBeUndefined();
  });
});

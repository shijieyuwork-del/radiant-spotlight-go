import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Treatments from "@/pages/Treatments";
import type { AsiaLang } from "@/lib/asia-i18n";
import { getPlanningMarketingCopy } from "@/lib/planning-marketing-copy";

const mocks = vi.hoisted(() => ({ lang: "en" as AsiaLang, open: vi.fn() }));

vi.mock("@/lib/asia-i18n", () => ({
  useAsia: () => ({ lang: mocks.lang, t: (key: string) => key, fmt: (value: number) => String(value) }),
}));
vi.mock("@/components/QuoteRequest", () => ({ useQuote: () => ({ open: mocks.open }) }));
vi.mock("@/components/AsiaNavbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/PageMeta", () => ({ default: () => null }));
vi.mock("@/components/TikTokWall", () => ({ default: () => null }));
vi.mock("@/data/tiktokCases", () => ({ TIKTOK_CASES: [] }));

beforeEach(() => { mocks.lang = "en"; mocks.open.mockClear(); });
afterEach(cleanup);

const showTreatments = () => render(
  <MemoryRouter initialEntries={["/treatments"]}><Treatments /></MemoryRouter>,
);

describe("treatment entry paths", () => {
  it.each(["en", "zh", "ru", "es", "th", "ms"] as AsiaLang[])("connects all three localized entry paths in %s", (lang) => {
    mocks.lang = lang;
    showTreatments();
    const copy = getPlanningMarketingCopy(lang);
    const entryPaths = within(screen.getByRole("navigation", { name: copy.choosePath }));
    const procedureEntry = entryPaths.getByRole("button", { name: `${copy.procedure} ${copy.procedureDetail}` });
    const providerEntry = entryPaths.getByRole("link", { name: `${copy.providers} ${copy.providersDetail}` });
    const tripEntry = entryPaths.getByRole("button", { name: `${copy.trip} ${copy.tripDetail}` });
    const search = screen.getByRole("searchbox");
    const scrollIntoView = vi.fn();
    Object.defineProperty(search, "scrollIntoView", { configurable: true, value: scrollIntoView });

    expect(providerEntry).toHaveAttribute("href", "/clinics");
    fireEvent.click(procedureEntry);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: "center" });
    expect(search).toHaveFocus();
    expect(mocks.open).not.toHaveBeenCalled();

    fireEvent.click(tripEntry);
    expect(mocks.open).toHaveBeenCalledExactlyOnceWith({ intent: "care_plan", source: "treatments_trip_planning" });
  });

  it("filters procedure guides across categories and restores them after an empty search", () => {
    showTreatments();
    const search = screen.getByRole("searchbox", { name: "Search a procedure, concern or body area" });
    expect(screen.getByRole("heading", { name: "Rhinoplasty", level: 3 })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Upper Blepharoplasty", level: 3 })).not.toBeInTheDocument();

    fireEvent.change(search, { target: { value: "blepharoplasty" } });
    expect(screen.getByRole("heading", { name: "Upper Blepharoplasty", level: 3 }).closest("a"))
      .toHaveAttribute("href", "/treatments/upper-blepharoplasty");
    expect(screen.getByRole("heading", { name: "Lower Blepharoplasty", level: 3 })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Rhinoplasty", level: 3 })).not.toBeInTheDocument();

    fireEvent.change(search, { target: { value: "no matching procedure" } });
    expect(screen.getByRole("heading", { name: "No procedures found" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Upper Blepharoplasty", level: 3 })).not.toBeInTheDocument();

    fireEvent.change(search, { target: { value: "" } });
    expect(screen.getByRole("heading", { name: "Rhinoplasty", level: 3 })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "No procedures found" })).not.toBeInTheDocument();
  });
});

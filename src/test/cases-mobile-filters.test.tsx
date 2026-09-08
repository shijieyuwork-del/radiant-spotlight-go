import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { AsiaLang } from "@/lib/asia-i18n";
import type { TikTokItem } from "@/components/TikTokWall";
import Cases from "@/pages/Cases";

const mocks = vi.hoisted(() => ({
  lang: "en" as AsiaLang,
  uploaded: [] as TikTokItem[],
  requestLocation: vi.fn(),
  cases: [
    { id: "nose", src: "", user: { en: "Anna", zh: "安娜" }, caption: { en: "Day 7 recovery", zh: "第七天" }, treatment: { en: "Rhinoplasty", zh: "鼻综合" }, clinic: { en: "Clinic", zh: "诊所" }, city: { en: "Shanghai", zh: "上海" }, likes: "10k", comments: "1", priceCny: 20000, postedAt: "2026-01-01" },
    { id: "face", src: "", user: { en: "Beth", zh: "贝丝" }, caption: { en: "6-month reveal", zh: "六个月" }, treatment: { en: "Facelift", zh: "拉皮" }, clinic: { en: "Clinic", zh: "诊所" }, city: { en: "Beijing", zh: "北京" }, likes: "20k", comments: "2", priceCny: 30000, postedAt: "2026-02-01" },
  ] as TikTokItem[],
}));

vi.mock("@/lib/asia-i18n", () => ({ useAsia: () => ({ lang: mocks.lang, t: () => "Patient diaries", fmt: (value: number) => String(value) }) }));
vi.mock("@/hooks/use-published-videos", () => ({ usePublishedVideos: () => mocks.uploaded }));
vi.mock("@/data/tiktokCases", () => ({ TIKTOK_CASES: mocks.cases }));
vi.mock("@/data/doctors", () => ({ DOCTORS: [] }));
vi.mock("@/components/AsiaNavbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/PageMeta", () => ({ default: () => null }));
vi.mock("@/components/TikTokWall", () => ({ default: ({ items }: { items: TikTokItem[] }) => <ul aria-label="Case results">{items.map((item) => <li key={item.id}>{item.id}</li>)}</ul> }));
vi.mock("@/lib/geo", () => ({
  cityCoordsOf: () => null,
  haversineKm: () => 0,
  useUserLocation: () => ({ coords: null, status: "idle", request: mocks.requestLocation }),
}));

beforeEach(() => { mocks.lang = "en"; mocks.uploaded = []; mocks.requestLocation.mockClear(); });
afterEach(cleanup);
const showCases = (path = "/cases") => render(<MemoryRouter initialEntries={[path]}><Cases /></MemoryRouter>);

describe("Cases mobile filtering", () => {
  it("keeps procedure search available while secondary controls are collapsed", () => {
    showCases();
    expect(screen.getByRole("searchbox", { name: "Search patient journeys" })).toBeVisible();
    expect(screen.getByRole("combobox", { name: "All procedures" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Filters: 0 selected" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("combobox", { name: "All cities" })).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox", { name: "All procedures" }), { target: { value: "Facelift" } });
    expect(screen.getByRole("list", { name: "Case results" })).toHaveTextContent("face");
    expect(screen.getByRole("list", { name: "Case results" })).not.toHaveTextContent("nose");
  });

  it("preserves linked city/stage filters, counts changed sorting, and resets all controls", () => {
    showCases("/cases?city=Shanghai&stage=Week%201");
    fireEvent.click(screen.getByRole("button", { name: "Filters: 2 selected" }));
    expect(screen.getByRole("combobox", { name: "All cities" })).toHaveValue("Shanghai");
    expect(screen.getByRole("combobox", { name: "All recovery stages" })).toHaveValue("Week 1");
    fireEvent.change(screen.getByRole("combobox", { name: "Sort" }), { target: { value: "latest" } });
    expect(screen.getByRole("button", { name: "Filters: 3 selected" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("list", { name: "Case results" })).toHaveTextContent("nose");
    fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
    expect(screen.getByRole("searchbox", { name: "Search patient journeys" })).toHaveFocus();
    expect(screen.getByRole("button", { name: "Filters: 0 selected" })).toHaveAttribute("aria-expanded", "false");
    expect(within(screen.getByRole("list", { name: "Case results" })).getAllByRole("listitem").map((item) => item.textContent)).toEqual(["nose", "face"]);
    fireEvent.click(screen.getByRole("button", { name: "Filters: 0 selected" }));
    expect(screen.getByRole("combobox", { name: "Sort" })).toHaveValue("recommended");
    expect(screen.getByRole("combobox", { name: "All cities" })).toHaveValue("");
  });

  it("retains selection and restores trigger focus when Escape closes the panel", () => {
    showCases();
    const trigger = screen.getByRole("button", { name: "Filters: 0 selected" });
    fireEvent.click(trigger);
    const city = screen.getByRole("combobox", { name: "All cities" });
    fireEvent.change(city, { target: { value: "Beijing" } });
    city.focus();
    fireEvent.keyDown(city, { key: "Escape" });
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(screen.getByRole("combobox", { name: "All cities" })).toHaveValue("Beijing");
  });

  it("keeps an unmatched URL city available and requests location only for nearest sorting", () => {
    showCases("/cases?city=Seoul");
    expect(screen.getByText("No matching cases — try a different filter.")).toBeVisible();
    expect(mocks.requestLocation).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Filters: 1 selected" }));
    expect(screen.getByRole("combobox", { name: "All cities" })).toHaveValue("Seoul");
    fireEvent.change(screen.getByRole("combobox", { name: "Sort" }), { target: { value: "distance" } });
    expect(mocks.requestLocation).toHaveBeenCalledOnce();
  });

  it("refreshes filter choices when published cases arrive", () => {
    const view = showCases();
    mocks.uploaded = [{ ...mocks.cases[0], id: "new", city: { en: "Hangzhou", zh: "杭州" }, treatment: { en: "Hair transplant", zh: "植发" } }];
    view.rerender(<MemoryRouter><Cases /></MemoryRouter>);
    expect(within(screen.getByRole("combobox", { name: "All procedures" })).getByRole("option", { name: "Hair transplant" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Filters: 0 selected" }));
    expect(within(screen.getByRole("combobox", { name: "All cities" })).getByRole("option", { name: "Hangzhou" })).toBeInTheDocument();
  });

  it.each([
    ["en", "Patient journeys", "Filters"], ["zh", "患者恢复历程", "筛选"],
    ["ru", "Истории пациентов", "Фильтры"], ["es", "Historias de pacientes", "Filtros"],
    ["th", "เรื่องราวของผู้รับบริการ", "ตัวกรอง"], ["ms", "Kisah pesakit", "Penapis"],
  ] as const)("provides the new title and filter control in %s", (lang, title, filters) => {
    mocks.lang = lang;
    showCases();
    expect(screen.getByRole("heading", { level: 1, name: title })).toBeVisible();
    const trigger = screen.getByRole("button", { name: new RegExp(`^${filters}:`) });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    const procedure = screen.getByRole("combobox");
    expect(within(procedure).getAllByRole("option").every((option) => Boolean(option.textContent?.trim()))).toBe(true);
    fireEvent.click(trigger);
    expect(screen.getByRole("region", { name: filters })).toBeVisible();
  });
});

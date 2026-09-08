import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import type { TikTokItem } from "@/components/TikTokWall";
import Cases from "@/pages/Cases";
import Doctors from "@/pages/Doctors";

type DoctorRow = { id: string; name: string; title: string; hospital: string; city: string; specialties: string[]; bio: string; photo_path: null; created_at: string };
type DoctorResponse = { data: DoctorRow[]; error: null };
const mocks = vi.hoisted(() => ({ uploaded: [] as TikTokItem[], requestLocation: vi.fn(), doctorRequest: undefined as (() => Promise<DoctorResponse>) | undefined }));
const cases = vi.hoisted(() => [{ id: "bundled", src: "", user: { en: "Anna", zh: "安娜" }, caption: { en: "Day 7 recovery", zh: "第七天" }, treatment: { en: "Rhinoplasty", zh: "鼻综合" }, clinic: { en: "Clinic", zh: "诊所" }, city: { en: "Shanghai", zh: "上海" }, likes: "10", comments: "", priceCny: 1000 }] as TikTokItem[]);

vi.mock("@/lib/asia-i18n", () => ({ useAsia: () => ({ lang: "en", t: (key: string) => key, fmt: String }) }));
vi.mock("@/hooks/use-published-videos", () => ({ usePublishedVideos: () => mocks.uploaded }));
vi.mock("@/data/tiktokCases", () => ({ TIKTOK_CASES: cases }));
vi.mock("@/data/doctors", () => ({ DOCTORS: [] }));
vi.mock("@/components/AsiaNavbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/PageMeta", () => ({ default: () => null }));
vi.mock("@/components/QuoteCtaButton", () => ({ default: () => <button>Ask for quote</button> }));
vi.mock("@/components/TikTokWall", () => ({ default: ({ items, onBeforeNavigate }: { items: TikTokItem[]; onBeforeNavigate?: (id: string) => void }) => <ul aria-label="Case results">{items.map((item) => <li key={item.id}><Link data-directory-item={item.id} to={`/cases/${item.id}`} onClick={() => onBeforeNavigate?.(item.id)}>{item.id}</Link></li>)}</ul> }));
vi.mock("@/lib/geo", () => ({ cityCoordsOf: () => null, haversineKm: () => 0, useUserLocation: () => ({ coords: null, status: "idle", request: mocks.requestLocation }) }));
vi.mock("@/hooks/use-realtime-refresh", () => ({ useRealtimeRefresh: () => undefined }));
vi.mock("@/lib/storage-urls", () => ({ signedUrls: async (_bucket: string, paths: unknown[]) => paths.map(() => "") }));
vi.mock("@/lib/i18n-content", () => ({ localizeDoctorRow: (row: DoctorRow) => row }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: () => ({ select: () => ({ eq: () => ({ order: () => mocks.doctorRequest?.() ?? Promise.resolve({ data: [], error: null }) }) }) }) } }));

const doctors: DoctorRow[] = Array.from({ length: 12 }, (_, index) => ({ id: `doctor-${index}`, name: `Doctor ${index}`, title: "Surgeon", hospital: "Hospital", city: "Shanghai", specialties: ["Rhinoplasty"], bio: "Profile", photo_path: null, created_at: `2026-01-${String(index + 1).padStart(2, "0")}` }));
function Probe() {
  const location = useLocation();
  const navigate = useNavigate();
  return <><output data-testid="path">{location.pathname}{location.search}</output><button onClick={() => navigate(-1)}>Browser back</button></>;
}
function Tree({ path }: { path: string }) {
  return <MemoryRouter initialEntries={[path]}><Probe /><Routes>
    <Route path="/cases" element={<Cases />} /><Route path="/cases/:id" element={<p>Case detail</p>} />
    <Route path="/doctors" element={<Doctors />} /><Route path="/doctors/profile/:id" element={<p>Doctor detail</p>} />
  </Routes></MemoryRouter>;
}
const params = () => new URL(screen.getByTestId("path").textContent ?? "", "https://example.test").searchParams;
beforeEach(() => {
  sessionStorage.clear();
  mocks.uploaded = [];
  mocks.requestLocation.mockReset();
  mocks.doctorRequest = async () => ({ data: doctors, error: null });
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("Cases persisted page controls", () => {
  it("retains a requested page and unpublished filter option until async records arrive", () => {
    const path = "/cases?q=Anna&treatment=New+procedure&city=Shanghai&stage=Week+1&sort=latest&page=2&utm=x";
    const view = render(<Tree path={path} />);
    expect(params().get("page")).toBe("2");
    expect(screen.getByRole("combobox", { name: "All procedures" })).toHaveValue("New procedure");
    mocks.uploaded = Array.from({ length: 12 }, (_, index) => ({ ...cases[0], id: `published-${index}`, treatment: { en: "New procedure", zh: "新项目" } }));
    view.rerender(<Tree path={path} />);
    expect(screen.getByRole("button", { name: "2", current: "page" })).toBeVisible();
    expect(screen.getByRole("list", { name: "Case results" })).toHaveTextContent("published-9");
    expect(params().get("page")).toBe("2");
    expect(screen.getByRole("searchbox", { name: "Search patient journeys" })).toHaveValue("Anna");
    fireEvent.click(screen.getByRole("button", { name: "Filters: 3 selected" }));
    expect(screen.getByRole("combobox", { name: "All cities" })).toHaveValue("Shanghai");
    expect(screen.getByRole("combobox", { name: "All recovery stages" })).toHaveValue("Week 1");
    expect(screen.getByRole("combobox", { name: "Sort" })).toHaveValue("latest");
  });

  it("restores controls after a card detail and retains reset focus/collapse behavior", () => {
    render(<Tree path="/cases?q=Anna&city=Shanghai&stage=Week+1&sort=latest&utm=x" />);
    fireEvent.click(screen.getByRole("link", { name: "bundled" }));
    expect(screen.getByText("Case detail")).toBeVisible();
    fireEvent.click(screen.getByText("Browser back"));
    expect(screen.getByRole("searchbox", { name: "Search patient journeys" })).toHaveValue("Anna");
    fireEvent.click(screen.getByRole("button", { name: "Filters: 3 selected" }));
    expect(screen.getByRole("combobox", { name: "Sort" })).toHaveValue("latest");
    fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
    expect(params().toString()).toBe("utm=x");
    expect(screen.getByRole("button", { name: "Filters: 0 selected" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("searchbox", { name: "Search patient journeys" })).toHaveFocus();
  });

  it("never asks for geolocation when restoring nearest, but offers an explicit action", () => {
    render(<Tree path="/cases?sort=distance" />);
    expect(mocks.requestLocation).not.toHaveBeenCalled();
    expect(screen.getByText("Location is off — showing default order.")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Use my location" }));
    expect(mocks.requestLocation).toHaveBeenCalledOnce();
  });
});

describe("Doctors persisted page controls", () => {
  it("preserves page while the directory loads, then restores the selected page", async () => {
    let resolve!: (response: DoctorResponse) => void;
    mocks.doctorRequest = () => new Promise((done) => { resolve = done; });
    render(<Tree path="/doctors?q=Doctor&city=Shanghai&sort=latest&page=2&utm=x" />);
    expect(params().get("page")).toBe("2");
    expect(screen.getByRole("searchbox", { name: "Search expert profiles" })).toHaveValue("Doctor");
    await act(async () => { resolve({ data: doctors, error: null }); });
    expect(screen.getByRole("button", { name: "2", current: "page" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Doctor 2" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Doctor 11" })).not.toBeInTheDocument();
    expect(params().toString()).toBe("q=Doctor&city=Shanghai&sort=latest&page=2&utm=x");
    expect(screen.getByRole("button", { name: "Newest", pressed: true })).toHaveClass("min-h-11");
    expect(screen.getByRole("button", { name: "Recommended", pressed: false })).toHaveClass("min-h-11");
  });

  it("retains URL state after a profile visit and supports a changed filter after return", async () => {
    render(<Tree path="/doctors?q=Doctor&city=Shanghai&sort=latest&page=2&utm=x" />);
    const links = await screen.findAllByRole("link", { name: "Expert & cases" });
    fireEvent.click(links[0]);
    expect(screen.getByText("Doctor detail")).toBeVisible();
    fireEvent.click(screen.getByText("Browser back"));
    await screen.findByRole("heading", { name: "Doctor 2" });
    expect(screen.getByRole("searchbox", { name: "Search expert profiles" })).toHaveValue("Doctor");
    expect(screen.getByRole("button", { name: "2", current: "page" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Newest", pressed: true })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Recommended", pressed: false }));
    expect(screen.getByRole("button", { name: "Recommended", pressed: true })).toBeVisible();
    expect(screen.getByRole("button", { name: "Newest", pressed: false })).toBeVisible();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search expert profiles" }), { target: { value: "Doctor 1" } });
    expect(params().has("page")).toBe(false);
    expect(params().get("utm")).toBe("x");
  });

  it("does not prompt for restored nearest or again on a later data render", async () => {
    const view = render(<Tree path="/doctors?sort=distance" />);
    await screen.findByRole("button", { name: "Use my location" });
    view.rerender(<Tree path="/doctors?sort=distance" />);
    await waitFor(() => expect(within(screen.getByTestId("doctor-directory-results")).getAllByRole("article")).toHaveLength(9));
    expect(mocks.requestLocation).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Use my location" }));
    expect(mocks.requestLocation).toHaveBeenCalledOnce();
  });
});

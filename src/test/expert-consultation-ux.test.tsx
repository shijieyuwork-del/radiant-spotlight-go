import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import Doctors from "@/pages/Doctors";
import ManagedDoctorDetail from "@/pages/ManagedDoctorDetail";
import { QuoteProvider, useQuote, type QuoteContext } from "@/components/QuoteRequest";
import { AsiaI18nProvider, type AsiaLang } from "@/lib/asia-i18n";
import { consultationPickerCopy } from "@/lib/consultation-picker-copy";

const mocks = vi.hoisted(() => ({ list: vi.fn(), detail: vi.fn(), from: vi.fn(), invoke: vi.fn(), track: vi.fn() }));
vi.mock("@/components/AsiaNavbar", () => ({ default: () => <nav aria-label="Site" /> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer /> }));
vi.mock("@/components/PageMeta", () => ({ default: () => null }));
vi.mock("@/components/CoverVideo", () => ({ default: () => <video controls /> }));
vi.mock("@/lib/auth", () => ({ useAuth: () => ({ user: null }) }));
vi.mock("@/lib/analytics", () => ({ trackEvent: mocks.track }));
vi.mock("@/lib/storage-urls", () => ({ signedUrl: async () => "", signedUrls: async (_bucket: string, paths: unknown[]) => paths.map(() => "") }));
vi.mock("@/hooks/use-realtime-refresh", () => ({ useRealtimeRefresh: () => {} }));
vi.mock("@/hooks/use-before-after", () => ({ usePublishedBeforeAfter: () => ({ items: [], loading: false }) }));
vi.mock("@/lib/geo", () => ({
  useUserLocation: () => ({ coords: null, status: "idle", request: vi.fn() }),
  cityCoordsOf: () => null,
  haversineKm: () => 0,
}));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: mocks.from, functions: { invoke: mocks.invoke } } }));

const expert = {
  id: "published-expert", name: "Published Expert", title: "Published specialty title",
  hospital: "Listed Clinic", city: "Shanghai", specialties: ["Specialty A", "Specialty B", "Specialty C", "Specialty D"],
  bio: "The complete supplied biography.\nA second original paragraph.", credentials: "Supplied credentials",
  languages: "English, Chinese", photo_path: null, created_at: "2026-09-01", i18n: {},
};
const originalLocation = window.location;

const renderPage = (children: ReactNode, path = "/") => render(
  <AsiaI18nProvider><MemoryRouter initialEntries={[path]}><QuoteProvider>{children}</QuoteProvider></MemoryRouter></AsiaI18nProvider>,
);
const OpenContact = ({ context }: { context?: QuoteContext }) => {
  const { open } = useQuote();
  return <button onClick={() => open(context)}>Open contact</button>;
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  mocks.list.mockImplementation((table: string) => Promise.resolve({ data: table === "doctors" ? [expert] : [], error: null }));
  mocks.detail.mockResolvedValue({ data: expert, error: null });
  mocks.from.mockImplementation((table: string) => {
    const query = {
      select: () => query,
      eq: () => query,
      order: () => mocks.list(table),
      maybeSingle: () => mocks.detail(table),
    };
    return query;
  });
  vi.spyOn(window, "open").mockReturnValue({} as Window);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  Object.defineProperty(window, "location", { configurable: true, value: originalLocation });
});

describe("expert directory states", () => {
  it("shows loading without an empty message or sample profiles", () => {
    mocks.list.mockReturnValue(new Promise(() => {}));
    renderPage(<Doctors />, "/doctors");
    const results = within(screen.getByTestId("doctor-directory-results"));
    expect(results.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(results.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByText(/under review/i)).not.toBeInTheDocument();
  });

  it("offers retry on failure without showing samples, then shows published profiles", async () => {
    mocks.list.mockResolvedValueOnce({ data: null, error: new Error("Offline") })
      .mockResolvedValueOnce({ data: [expert], error: null });
    renderPage(<Doctors />, "/doctors");
    expect(await screen.findByRole("alert")).toHaveTextContent("Expert profiles are unavailable");
    expect(screen.queryByText("Sample doctor profiles")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByRole("heading", { name: "Published Expert" })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByText(/under review/i)).not.toBeInTheDocument();
    expect(screen.getByText("Listed Clinic")).toBeInTheDocument();
  });

  it("shows a recoverable empty search and restores the published results", async () => {
    renderPage(<Doctors />, "/doctors");
    await screen.findByRole("heading", { name: "Published Expert" });
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "no matching person" } });
    expect(screen.getByRole("heading", { name: "No matching expert profiles" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Published doctors" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Published Expert" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByRole("heading", { name: "Published Expert" })).toBeInTheDocument();
  });

  it("keeps successful empty-directory demo profiles explicitly distinguished", async () => {
    mocks.list.mockResolvedValue({ data: [], error: null });
    renderPage(<Doctors />, "/doctors");
    expect(await screen.findByRole("heading", { name: "Sample doctor profiles" })).toBeInTheDocument();
    expect(screen.getAllByText("Sample profile")).toHaveLength(5);
    expect(screen.queryByRole("heading", { name: "Published doctors" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Expert & cases" })[0]).toHaveAttribute("href", "/doctors/demo/demo-lin");
  });
});

describe("published profile consultation", () => {
  it("returns keyboard focus to the consultation opener when closed", async () => {
    renderPage(<OpenContact />);
    const opener = screen.getByRole("button", { name: "Open contact" });
    opener.focus();
    fireEvent.click(opener);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it("clears the previous profile while switching and ignores a superseded response", async () => {
    const olderExpert = { ...expert, id: "older-expert", name: "Older Expert" };
    const currentExpert = { ...expert, id: "current-expert", name: "Current Expert", city: "Beijing" };
    let resolveOlder!: (value: { data: typeof expert; error: null }) => void;
    const olderResponse = new Promise<{ data: typeof expert; error: null }>((resolve) => {
      resolveOlder = resolve;
    });
    mocks.detail.mockResolvedValueOnce({ data: expert, error: null })
      .mockReturnValueOnce(olderResponse)
      .mockResolvedValueOnce({ data: currentExpert, error: null });
    renderPage(<>
      <Link to="/doctors/profile/older-expert">Load older expert</Link>
      <Link to="/doctors/profile/current-expert">Load current expert</Link>
      <Routes><Route path="/doctors/profile/:id" element={<ManagedDoctorDetail />} /></Routes>
    </>, "/doctors/profile/published-expert");
    await screen.findByRole("heading", { name: "Published Expert" });

    fireEvent.click(screen.getByRole("link", { name: "Load older expert" }));
    expect(screen.queryByRole("heading", { name: "Published Expert" })).not.toBeInTheDocument();
    expect(screen.queryByTestId("expert-profile-consultation")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: "Load current expert" }));
    await screen.findByRole("heading", { name: "Current Expert" });

    await act(async () => {
      resolveOlder({ data: olderExpert, error: null });
      await olderResponse;
    });
    expect(screen.getByRole("heading", { name: "Current Expert" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Older Expert" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("expert-profile-consultation"));
    const dialog = within(screen.getByRole("dialog"));
    expect(dialog.getByRole("heading", { name: "Ask about Current Expert" })).toBeInTheDocument();
    expect(dialog.getByText("Beijing")).toBeInTheDocument();
    expect(dialog.queryByText("Shanghai")).not.toBeInTheDocument();
  });

  it("preserves supplied details in disclosures and carries the selected expert and city", async () => {
    renderPage(<Routes><Route path="/doctors/profile/:id" element={<ManagedDoctorDetail />} /></Routes>, "/doctors/profile/published-expert");
    await screen.findByRole("heading", { name: "Published Expert" });
    expect(screen.getByText("Listed Clinic")).toBeInTheDocument();
    expect(screen.getByText("Specialty A")).toBeVisible();
    const moreSpecialties = screen.getByText("View all specialties (4)").closest("details")!;
    expect(moreSpecialties).not.toHaveAttribute("open");
    expect(within(moreSpecialties).getByText("Specialty D")).toBeInTheDocument();
    const about = screen.getByRole("heading", { name: "About this expert" }).closest("details")!;
    expect(about).toHaveClass("max-w-[65ch]");
    expect(about).toHaveAttribute("open");
    expect(about.textContent).toContain(expert.bio);
    expect(within(about).getByText("Supplied credentials")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View cases (0)" })).toHaveAttribute("href", "#expert-cases");
    fireEvent.click(screen.getByTestId("expert-profile-consultation"));
    const dialog = within(screen.getByRole("dialog"));
    expect(dialog.getByRole("heading", { name: "Ask about Published Expert" })).toBeInTheDocument();
    expect(dialog.getByText("Shanghai")).toBeInTheDocument();
    fireEvent.click(dialog.getByRole("button", { name: /Ask a question/ }));
    fireEvent.click(dialog.getByRole("radio", { name: "WhatsApp" }));
    fireEvent.change(dialog.getByLabelText("WhatsApp number"), { target: { value: "+44 7700 900123" } });
    fireEvent.change(dialog.getByLabelText("Your question"), { target: { value: "Which clinic does this expert work at?" } });
    fireEvent.click(dialog.getByRole("button", { name: "Continue on WhatsApp" }));
    const handoff = new URL(vi.mocked(window.open).mock.calls[0][0] as string);
    expect(handoff.origin + handoff.pathname).toBe("https://wa.me/14708613825");
    expect(handoff.searchParams.get("text")).toContain("Expert: Published Expert");
    expect(handoff.searchParams.get("text")).toContain("City in China: Shanghai");
    expect(mocks.from).not.toHaveBeenCalledWith("quote_requests");
    expect(mocks.invoke).not.toHaveBeenCalled();
  });
});

describe("consultation contact picker", () => {
  it.each(["en", "zh", "ru", "es", "th", "ms"] as AsiaLang[])("localizes the visible picker and close control in %s", (lang) => {
    localStorage.setItem("glowy.asia.v1", JSON.stringify({ lang, currency: "USD" }));
    renderPage(<OpenContact />);
    fireEvent.click(screen.getByRole("button", { name: "Open contact" }));
    const dialog = within(screen.getByRole("dialog"));
    const copy = consultationPickerCopy[lang];
    expect(dialog.getByRole("heading", { name: copy.headline })).toBeInTheDocument();
    for (const text of [copy.intro, copy.questionTitle, copy.questionDescription, copy.carePlanTitle, copy.carePlanDescription]) {
      expect(dialog.getByText(text)).toBeInTheDocument();
    }
    expect(dialog.getAllByText(copy.free).length).toBeGreaterThan(0);
    expect(dialog.queryByRole("textbox")).not.toBeInTheDocument();
    fireEvent.click(dialog.getByRole("button", { name: copy.close }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("shows Chinese expert and location context while preserving the email handoff", () => {
    localStorage.setItem("glowy.asia.v1", JSON.stringify({ lang: "zh", currency: "USD" }));
    const location = { href: "" };
    Object.defineProperty(window, "location", { configurable: true, value: location });
    renderPage(<OpenContact context={{ doctorName: "林医生", hospitalName: "已列出的医院", city: "上海", procedure: "鼻整形" }} />);
    fireEvent.click(screen.getByRole("button", { name: "Open contact" }));
    const dialog = within(screen.getByRole("dialog"));
    expect(dialog.getByRole("heading", { name: "咨询林医生" })).toBeInTheDocument();
    for (const text of ["专家:", "诊所或医院:", "项目:", "中国意向城市:", "上海", "鼻整形", "已列出的医院"]) expect(dialog.getByText(text)).toBeInTheDocument();
    fireEvent.click(dialog.getByRole("button", { name: /问一个问题/ }));
    fireEvent.change(dialog.getByLabelText("邮箱地址"), { target: { value: "question@example.com" } });
    fireEvent.change(dialog.getByLabelText("你的问题"), { target: { value: "这位专家在哪所医院？" } });
    fireEvent.click(dialog.getByRole("button", { name: "继续使用电子邮件" }));
    expect(location.href).toMatch(/^mailto:contact@celadonchina.com\?/);
    expect(decodeURIComponent(location.href)).toContain("专家: 林医生");
    expect(decodeURIComponent(location.href)).toContain("中国意向城市: 上海");
    expect(dialog.getByRole("heading", { name: "消息草稿已准备好" })).toBeInTheDocument();
    expect(mocks.from).not.toHaveBeenCalled();
    expect(mocks.invoke).not.toHaveBeenCalled();
  });
});

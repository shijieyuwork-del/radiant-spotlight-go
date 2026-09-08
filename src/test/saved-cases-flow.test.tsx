import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSavedCase, useSavedCases } from "@/lib/saved-cases";
import { savedCasesStorageKey as key } from "@/lib/saved-cases-storage";
import { savedCasesCopy } from "@/lib/saved-cases-copy";
import { resolveSavedCases } from "@/lib/saved-case-catalog";
import SavedCases from "@/pages/SavedCases";
import type { AsiaLang } from "@/lib/asia-i18n";

const mocks = vi.hoisted(() => ({ user: null as { id: string } | null, lang: "en" as AsiaLang, query: vi.fn(), eq: vi.fn(), from: vi.fn(), success: vi.fn(), error: vi.fn() }));
vi.mock("@/lib/auth", () => ({ useAuth: () => ({ user: mocks.user }) }));
vi.mock("@/lib/asia-i18n", () => ({ useAsia: () => ({ lang: mocks.lang }) }));
vi.mock("sonner", () => ({ toast: { success: mocks.success, error: mocks.error } }));
vi.mock("@/components/AsiaNavbar", () => ({ default: () => <nav /> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer /> }));
vi.mock("@/components/PageMeta", () => ({ default: ({ robots }: { robots: string }) => <span data-testid="robots">{robots}</span> }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: mocks.from } }));
const publishedId = "11111111-1111-4111-8111-111111111111";
const missingId = "22222222-2222-4222-8222-222222222222";
const demoId = "rhinoplasty-beijing";
const put = (scope: string | null, ids: string[]) => localStorage.setItem(key(scope), JSON.stringify(ids));
const Probe = () => {
  const { saved, toggleSaved, saveLabel } = useSavedCase(demoId);
  const { ids } = useSavedCases();
  return <><button aria-pressed={saved} onClick={toggleSaved}>{saveLabel}</button><output data-testid="ids">{ids.join(",")}</output></>;
};
const showPage = () => render(<MemoryRouter><SavedCases /></MemoryRouter>);
beforeEach(() => {
  vi.clearAllMocks(); localStorage.clear(); mocks.user = null; mocks.lang = "en";
  mocks.query.mockResolvedValue({ data: [], error: null });
  mocks.eq.mockReturnValue({ in: mocks.query });
  mocks.from.mockReturnValue({ select: () => ({ eq: mocks.eq }) });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("guest saving and auth continuity", () => {
  it("saves as a guest without a router or signup and persists across remount", () => {
    const view = render(<Probe />);
    fireEvent.click(screen.getByRole("button", { name: "Save this case" }));
    expect(screen.getByRole("button", { name: "Remove from saved cases" })).toHaveAttribute("aria-pressed", "true");
    expect(mocks.success).toHaveBeenCalledWith(savedCasesCopy.en.saved, undefined);
    view.unmount(); render(<Probe />);
    expect(screen.getByTestId("ids")).toHaveTextContent(demoId);
  });

  it("combines guests on login, keeps legacy entries, and isolates signout/account switching", () => {
    put(null, [demoId]); put("a", ["private-a"]); put("b", ["private-b"]);
    const view = render(<Probe />);
    mocks.user = { id: "a" }; view.rerender(<Probe />);
    expect(screen.getByTestId("ids")).toHaveTextContent(`private-a,${demoId}`);
    mocks.user = null; view.rerender(<Probe />);
    expect(screen.getByTestId("ids")).toBeEmptyDOMElement();
    mocks.user = { id: "b" }; view.rerender(<Probe />);
    expect(screen.getByTestId("ids")).toHaveTextContent("private-b");
    expect(screen.getByTestId("ids")).not.toHaveTextContent("private-a");
    expect(JSON.parse(localStorage.getItem(key("a"))!)).toEqual(["private-a", demoId]);
  });

  it("does not show saved success when browser storage is blocked", () => {
    render(<Probe />);
    vi.spyOn(localStorage, "setItem").mockImplementation(() => { throw new Error("quota"); });
    fireEvent.click(screen.getByRole("button", { name: "Save this case" }));
    expect(screen.getByRole("button", { name: "Save this case" })).toHaveAttribute("aria-pressed", "false");
    expect(mocks.success).not.toHaveBeenCalled(); expect(mocks.error).toHaveBeenCalled();
  });

  it("does not let an old removal toast change a new account", () => {
    mocks.user = { id: "a" }; put("a", [demoId]); put("b", ["private-b"]);
    const view = render(<Probe />);
    fireEvent.click(screen.getByRole("button", { name: "Remove from saved cases" }));
    const undo = mocks.success.mock.calls[0][1].action.onClick;
    mocks.user = { id: "b" }; view.rerender(<Probe />);
    act(() => undo());
    expect(JSON.parse(localStorage.getItem(key("a"))!)).toEqual([]);
    expect(JSON.parse(localStorage.getItem(key("b"))!)).toEqual(["private-b"]);
  });

  it("refreshes from storage events and disables undo after its originating view unmounts", () => {
    const view = render(<Probe />);
    act(() => { put(null, [demoId]); window.dispatchEvent(new Event("storage")); });
    fireEvent.click(screen.getByRole("button", { name: "Remove from saved cases" }));
    const undo = mocks.success.mock.calls[0][1].action.onClick;
    view.unmount();
    act(() => undo());
    expect(JSON.parse(localStorage.getItem(key(null))!)).toEqual([]);
  });
});

describe("central saved list", () => {
  it.each(["en", "zh", "ru", "es", "th", "ms"] as AsiaLang[])("has local-only copy and an actionable empty state in %s", (lang) => {
    mocks.lang = lang; showPage(); const copy = savedCasesCopy[lang];
    expect(screen.getByRole("heading", { name: copy.title })).toBeInTheDocument();
    expect(screen.getByText(copy.localOnly)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: copy.empty })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: copy.browse })).toHaveAttribute("href", "/cases");
    expect(screen.getByTestId("robots")).toHaveTextContent("noindex");
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("resolves demos, published IDs, and legacy/missing IDs without silently deleting any", async () => {
    put(null, [demoId, publishedId, "old-legacy-id", missingId]);
    mocks.query.mockResolvedValue({ data: [{ id: publishedId, title: "Published diary", caption: "Supplied caption", city: "Shanghai" }], error: null });
    showPage();
    expect(await screen.findByRole("heading", { name: "Published diary" })).toBeInTheDocument();
    expect(screen.getByText("Demo preview")).toBeInTheDocument();
    expect(screen.getByText("Published case")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: "Case unavailable" })).toHaveLength(2);
    expect(mocks.eq).toHaveBeenCalledWith("status", "published");
    expect(mocks.query).toHaveBeenCalledWith("id", [publishedId, missingId]);
    expect(screen.getByRole("link", { name: "Open case: Published diary" })).toHaveAttribute("href", `/cases/${publishedId}`);
    expect(JSON.parse(localStorage.getItem(key(null))!)).toHaveLength(4);
  });

  it("removes one unavailable item with an in-place undo", () => {
    put(null, [demoId, "old-legacy-id"]); showPage();
    fireEvent.click(screen.getByRole("button", { name: "Remove from saved cases: old-legacy-id" }));
    expect(screen.queryByRole("heading", { name: "Case unavailable" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Undo removal" }));
    expect(screen.getByRole("heading", { name: "Case unavailable" })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(key(null))!)).toEqual([demoId, "old-legacy-id"]);
  });

  it("distinguishes network failure from unavailable content and retries", async () => {
    put(null, [publishedId]);
    mocks.query.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce({ data: [{ id: publishedId, title: "Recovered diary" }], error: null });
    showPage();
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(savedCasesCopy.en.loadError);
    expect(screen.queryByRole("heading", { name: "Case unavailable" })).not.toBeInTheDocument();
    fireEvent.click(within(alert).getByRole("button", { name: "Try again" }));
    expect(await screen.findByRole("heading", { name: "Recovered diary" })).toBeInTheDocument();
  });

  it("shows storage corruption rather than a false empty list and preserves raw data", () => {
    localStorage.setItem(key(null), "{damaged"); showPage();
    expect(screen.getByRole("alert")).toHaveTextContent(savedCasesCopy.en.corruptError);
    expect(screen.queryByRole("heading", { name: savedCasesCopy.en.empty })).not.toBeInTheDocument();
    expect(localStorage.getItem(key(null))).toBe("{damaged");
  });

  it("keeps unknown legacy IDs as unavailable references", () => {
    expect(resolveSavedCases(["legacy-id"], "en", [])).toEqual([{ id: "legacy-id", kind: "unavailable" }]);
  });

  it("ignores an old account's catalog response after switching accounts", async () => {
    let resolveOld!: (value: unknown) => void;
    const pending = new Promise((resolve) => { resolveOld = resolve; });
    mocks.user = { id: "a" }; put("a", [publishedId]); put("b", [missingId]);
    mocks.query.mockReturnValueOnce(pending).mockResolvedValueOnce({ data: [{ id: missingId, title: "Account B diary" }], error: null });
    const view = showPage();
    mocks.user = { id: "b" }; view.rerender(<MemoryRouter><SavedCases /></MemoryRouter>);
    expect(await screen.findByRole("heading", { name: "Account B diary" })).toBeInTheDocument();
    await act(async () => { resolveOld({ data: [{ id: publishedId, title: "Account A diary" }], error: null }); await pending; });
    expect(screen.queryByRole("heading", { name: "Account A diary" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Account B diary" })).toBeInTheDocument();
  });
});

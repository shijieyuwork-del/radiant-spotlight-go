import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useDirectoryReturnPosition, useDirectoryState, normalizeDirectoryParams, readDirectoryState } from "@/hooks/use-directory-state";

function StateHarness({ directory = "cases" }: { directory?: "cases" | "doctors" }) {
  const state = useDirectoryState(directory);
  const location = useLocation();
  const navigate = useNavigate();
  return <>
    <output data-testid="state">{JSON.stringify(state)}</output>
    <output data-testid="url">{location.search}</output>
    <input aria-label="Query" value={state.q} onChange={(event) => state.setFilter("q", event.target.value)} />
    <button onClick={() => state.setFilter("city", "Shanghai")}>Shanghai</button>
    <button onClick={() => state.setFilter("city", "Beijing")}>Beijing</button>
    <button onClick={() => state.setPage(3)}>Page 3</button>
    <button onClick={state.reset}>Reset</button>
    <button onClick={() => navigate(-1)}>Back</button>
    <button onClick={() => navigate(1)}>Forward</button>
  </>;
}
const stateValue = () => JSON.parse(screen.getByTestId("state").textContent ?? "{}");
const urlParams = () => new URLSearchParams(screen.getByTestId("url").textContent ?? "");
const initial = "/cases?q=Anna&treatment=Rhinoplasty&city=Shanghai&stage=Week+1&sort=latest&page=3&utm_source=mail";

beforeEach(() => {
  sessionStorage.clear();
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("directory URL state", () => {
  it("normalizes malformed owned values without deleting unrelated or dynamic filters", () => {
    const params = normalizeDirectoryParams(new URLSearchParams("q=a%00b&city=New+city&treatment=New+procedure&stage=bad&sort=bad&page=1e3&utm=x&utm=y"), "cases");
    expect(params.get("q")).toBe("ab");
    expect(params.get("city")).toBe("New city");
    expect(params.get("treatment")).toBe("New procedure");
    expect(params.has("stage")).toBe(false);
    expect(params.has("sort")).toBe(false);
    expect(params.has("page")).toBe(false);
    expect(params.getAll("utm")).toEqual(["x", "y"]);
    expect(readDirectoryState(new URLSearchParams("page=9007199254740992"), "cases").page).toBe(1);
    expect(readDirectoryState(new URLSearchParams("page=-2"), "cases").page).toBe(1);
    expect(readDirectoryState(new URLSearchParams("page=0"), "cases").page).toBe(1);
  });

  it("reads all controls and page from the URL again on remount", () => {
    const view = render(<MemoryRouter initialEntries={[initial]}><StateHarness /></MemoryRouter>);
    expect(stateValue()).toMatchObject({ q: "Anna", treatment: "Rhinoplasty", city: "Shanghai", stage: "Week 1", sort: "latest", page: 3 });
    const restoredPath = `/cases${screen.getByTestId("url").textContent}`;
    view.unmount();
    render(<MemoryRouter initialEntries={[restoredPath]}><StateHarness /></MemoryRouter>);
    expect(stateValue()).toMatchObject({ q: "Anna", treatment: "Rhinoplasty", city: "Shanghai", stage: "Week 1", sort: "latest", page: 3 });
  });

  it("restores filters and pagination with browser back and forward", () => {
    render(<MemoryRouter initialEntries={["/cases?utm=x"]}><StateHarness /></MemoryRouter>);
    fireEvent.click(screen.getByText("Shanghai"));
    fireEvent.click(screen.getByText("Page 3"));
    fireEvent.click(screen.getByText("Beijing"));
    expect(stateValue()).toMatchObject({ city: "Beijing", page: 1 });
    fireEvent.click(screen.getByText("Back"));
    expect(stateValue()).toMatchObject({ city: "Shanghai", page: 3 });
    fireEvent.click(screen.getByText("Forward"));
    expect(stateValue()).toMatchObject({ city: "Beijing", page: 1 });
    expect(urlParams().get("utm")).toBe("x");
  });

  it("resets page only for an explicit filter edit and preserves unrelated parameters on reset", () => {
    const view = render(<MemoryRouter initialEntries={[initial]}><StateHarness /></MemoryRouter>);
    view.rerender(<MemoryRouter initialEntries={[initial]}><StateHarness /></MemoryRouter>);
    expect(stateValue().page).toBe(3);
    fireEvent.change(screen.getByLabelText("Query"), { target: { value: "Beth" } });
    expect(stateValue()).toMatchObject({ q: "Beth", page: 1 });
    fireEvent.click(screen.getByText("Reset"));
    expect(urlParams().toString()).toBe("utm_source=mail");
  });

  it("does not treat another directory's parameters as owned", () => {
    render(<MemoryRouter initialEntries={["/doctors?q=Anna&city=Shanghai&sort=hot&page=2&treatment=keep&stage=keep&utm=x"]}><StateHarness directory="doctors" /></MemoryRouter>);
    fireEvent.click(screen.getByText("Reset"));
    expect(stateValue()).toMatchObject({ city: "all", q: "", sort: "recommended", page: 1 });
    expect(urlParams().toString()).toBe("treatment=keep&stage=keep&utm=x");
  });
});

function PositionHarness({ ready = true, showCard = true, nested = false }: { ready?: boolean; showCard?: boolean; nested?: boolean }) {
  const { rootRef, remember } = useDirectoryReturnPosition(ready, showCard ? "card" : "");
  const navigate = useNavigate();
  return <div ref={rootRef}>
    <div data-testid="rail">{showCard && (nested
      ? <div data-directory-item="card"><button onClick={() => { remember("card"); navigate("/detail"); }}>Open card</button></div>
      : <button data-directory-item="card" onClick={() => { remember("card"); navigate("/detail"); }}>Open card</button>)}</div>
  </div>;
}
function Detail() {
  const navigate = useNavigate();
  return <button onClick={() => navigate(-1)}>Return</button>;
}
const positionTree = (ready = true, showCard = true, nested = false) => <MemoryRouter initialEntries={["/cases?page=3"]}><Routes><Route path="/cases" element={<PositionHarness ready={ready} showCard={showCard} nested={nested} />} /><Route path="/detail" element={<Detail />} /></Routes></MemoryRouter>;

describe("directory return position", () => {
  it("restores the clicked card, horizontal rail and vertical anchor on back", async () => {
    const rectSpy = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top: 80, bottom: 380, left: 20, right: 320 } as DOMRect);
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(1200);
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(390);
    render(positionTree());
    screen.getByTestId("rail").scrollLeft = 640;
    fireEvent.click(screen.getByText("Open card"));
    rectSpy.mockReturnValue({ top: 580, bottom: 880, left: 20, right: 320 } as DOMRect);
    fireEvent.click(screen.getByText("Return"));
    await waitFor(() => expect(screen.getByText("Open card")).toHaveFocus());
    expect(screen.getByTestId("rail").scrollLeft).toBe(640);
    expect(window.scrollTo).toHaveBeenLastCalledWith({ left: 0, top: 500, behavior: "instant" });
  });

  it("waits for the saved async card instead of restoring a provisional result", async () => {
    sessionStorage.setItem("celadon:directory-return:v1", JSON.stringify({ "/cases?page=3": { itemId: "card", top: 0, x: 0, y: 600, railLeft: 0, savedAt: Date.now() } }));
    const view = render(positionTree(false, false));
    expect(window.scrollTo).not.toHaveBeenCalled();
    view.rerender(positionTree(true, false));
    expect(window.scrollTo).not.toHaveBeenCalled();
    view.rerender(positionTree(true, true));
    await waitFor(() => expect(screen.getByText("Open card")).toHaveFocus());
  });

  it("focuses the actionable child when the saved card is a nonfocusable wrapper", async () => {
    render(positionTree(true, true, true));
    fireEvent.click(screen.getByText("Open card"));
    fireEvent.click(screen.getByText("Return"));
    await waitFor(() => expect(screen.getByText("Open card")).toHaveFocus());
  });

  it("does not pull users back after they already resumed interacting", async () => {
    sessionStorage.setItem("celadon:directory-return:v1", JSON.stringify({ "/cases?page=3": { itemId: "card", top: 0, x: 0, y: 600, railLeft: 0, savedAt: Date.now() } }));
    const view = render(positionTree(false, false));
    fireEvent.wheel(window);
    view.rerender(positionTree(true, true));
    await act(async () => { await new Promise((resolve) => requestAnimationFrame(resolve)); });
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("tolerates unavailable session storage", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    render(positionTree());
    expect(() => fireEvent.click(screen.getByText("Open card"))).not.toThrow();
    expect(screen.getByText("Return")).toBeVisible();
  });
});

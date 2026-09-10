import { useRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ManualRailControls } from "@/components/ManualRailControls";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
function Harness() {
  const ref = useRef<HTMLDivElement>(null);
  return <><div ref={ref} id="test-rail" data-testid="rail">{[1, 2, 3].map((number) => <a key={number} href={`/clinics/${number}`}>Clinic {number}</a>)}</div><ManualRailControls railRef={ref} railId="test-rail" count={3} lang="en" /></>;
}
function setup(width = 120) {
  render(<Harness />);
  const rail = screen.getByTestId("rail");
  Object.defineProperty(rail, "clientWidth", { configurable: true, value: width });
  Object.defineProperty(rail, "scrollWidth", { configurable: true, value: 360 });
  rail.getBoundingClientRect = () => ({ left: 0, right: width, width } as DOMRect);
  Array.from(rail.children).forEach((child, index) => {
    child.getBoundingClientRect = () => ({ left: index * 120 - rail.scrollLeft, right: (index + 1) * 120 - rail.scrollLeft, width: 120 } as DOMRect);
  });
  rail.scrollTo = vi.fn((options: ScrollToOptions) => { rail.scrollLeft = Number(options.left); fireEvent.scroll(rail); }) as typeof rail.scrollTo;
  fireEvent(window, new Event("resize"));
  return rail;
}
describe("manual hospital and expert rails", () => {
  it("shows position and boundary states, moves only when requested", () => {
    const interval = vi.spyOn(window, "setInterval");
    const rail = setup();
    expect(interval).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("1 / 3");
    expect(screen.getByRole("button", { name: "Previous items" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Next items" }), { detail: 1 });
    expect(rail.scrollTo).toHaveBeenCalledWith({ left: 120, behavior: "smooth" });
    expect(screen.getByRole("status")).toHaveTextContent("2 / 3");
    expect(screen.getByRole("button", { name: "Previous items" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Next items" }), { detail: 1 });
    expect(screen.getByRole("status")).toHaveTextContent("3 / 3");
    expect(screen.getByRole("button", { name: "Next items" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Previous items" }), { detail: 1 });
    expect(rail.scrollLeft).toBe(120);
  });
  it("uses instant movement for keyboard and reduced-motion requests", () => {
    const rail = setup();
    fireEvent.click(screen.getByRole("button", { name: "Next items" }), { detail: 0 });
    expect(rail.scrollTo).toHaveBeenLastCalledWith({ left: 120, behavior: "auto" });
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({ matches: true, media: query } as MediaQueryList));
    fireEvent.click(screen.getByRole("button", { name: "Next items" }), { detail: 1 });
    expect(rail.scrollTo).toHaveBeenLastCalledWith({ left: 240, behavior: "auto" });
  });
  it("hides controls when the whole list fits on desktop", () => {
    setup(360);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Previous items" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next items" })).not.toBeInTheDocument();
  });
});

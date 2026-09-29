import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import DoctorMarquee from "@/components/home/DoctorMarquee";
import DoctorFlipCard, { type DoctorFlipCardData } from "@/components/home/DoctorFlipCard";

const doctors: DoctorFlipCardData[] = Array.from({ length: 6 }, (_, index) => ({
  id: `doctor-${index}`, name: `Expert ${index + 1}`, title: "Surgeon", city: "Shanghai", specialties: [],
}));
let onIntersection: IntersectionObserverCallback;
const disconnect = vi.fn();
const observe = vi.fn();
const originalObserver = window.IntersectionObserver;
beforeEach(() => {
  window.IntersectionObserver = class {
    constructor(callback: IntersectionObserverCallback) { onIntersection = callback; }
    observe = observe;
    disconnect = disconnect;
  } as unknown as typeof IntersectionObserver;
});
afterEach(() => { cleanup(); window.IntersectionObserver = originalObserver; vi.restoreAllMocks(); vi.clearAllMocks(); });

const view = (items = doctors) => (
  <MemoryRouter>
    <DoctorMarquee doctors={items} lang="en" renderDoctor={(doctor, duplicate) => (
      <DoctorFlipCard doctor={doctor} duplicate={duplicate} viewProfileLabel="View expert profile"
        detailsLabel="Meet this expert" backLabel="Back to card" profileLabel="Expert profile" />
    )} />
  </MemoryRouter>
);
const intersect = (visible: boolean) => act(() => onIntersection(
  [{ isIntersecting: visible } as IntersectionObserverEntry], {} as IntersectionObserver,
));

describe("homepage doctor marquee", () => {
  it("repeats the same six profiles in order without duplicate screen-reader or tab stops", () => {
    const { container } = render(view());
    const groups = container.querySelectorAll(".doctor-marquee__group");
    expect(groups).toHaveLength(2);
    expect(groups[0].textContent).toBe(groups[1].textContent);
    expect(groups[0].children).toHaveLength(6);
    expect(groups[1]).toHaveAttribute("aria-hidden", "true");
    expect(screen.getAllByRole("heading")).toHaveLength(6);
    expect(screen.getAllByRole("link")).toHaveLength(6);
    groups[1].querySelectorAll("a,button").forEach((control) => expect(control).toHaveAttribute("tabindex", "-1"));
    const duplicateToggle = within(groups[1] as HTMLElement).getAllByText("Meet this expert")[0];
    fireEvent.click(duplicateToggle);
    expect(groups[1].querySelector("article")).toHaveAttribute("data-flipped", "true");
    expect(groups[1].contains(document.activeElement)).toBe(false);
  });

  it("observes the rail when the published profiles arrive after the initial empty render", () => {
    const { container, rerender, unmount } = render(view([]));
    expect(observe).not.toHaveBeenCalled();
    rerender(view());
    expect(observe).toHaveBeenCalledTimes(1);
    const track = container.querySelector(".doctor-marquee__track");
    expect(track).toHaveAttribute("data-running", "false");
    intersect(true);
    expect(track).toHaveAttribute("data-running", "true");
    intersect(false);
    expect(track).toHaveAttribute("data-running", "false");
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it("lets the visitor pause and resume the continuous loop", () => {
    const { container } = render(view());
    intersect(true);
    fireEvent.click(screen.getByRole("button", { name: "Pause scrolling" }));
    expect(container.querySelector(".doctor-marquee__track")).toHaveAttribute("data-running", "false");
    expect(screen.getByRole("button", { name: "Resume scrolling" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Resume scrolling" }));
    expect(container.querySelector(".doctor-marquee__track")).toHaveAttribute("data-running", "true");
  });

  it("provides a stationary native scroller for keyboard browsing", () => {
    const { container } = render(view());
    const firstProfile = screen.getAllByRole("link")[0];
    vi.spyOn(firstProfile, "matches").mockReturnValue(true);
    fireEvent.focus(firstProfile);
    expect(container.querySelector(".doctor-marquee")).toHaveAttribute("data-static", "true");
    fireEvent.blur(firstProfile, { relatedTarget: document.body });
    expect(container.querySelector(".doctor-marquee")).toHaveAttribute("data-static", "false");
  });

  it("does not create a looping empty space when fewer profiles are published", () => {
    const { container } = render(view(doctors.slice(0, 2)));
    expect(container.querySelectorAll(".doctor-marquee__group")).toHaveLength(1);
    expect(container.querySelector(".doctor-marquee")).toHaveAttribute("data-static", "true");
    expect(screen.queryByRole("button", { name: "Pause scrolling" })).not.toBeInTheDocument();
  });
});

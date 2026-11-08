import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import HeroAmbientBackground from "@/components/HeroAmbientBackground";
import { LoadOnApproach } from "@/components/home/LoadOnApproach";

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function preferences(mobile: boolean, reduced = false) {
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("767px") ? mobile : reduced, addEventListener() {}, removeEventListener() {} }));
}

describe("homepage media loading policy", () => {
  it("never mounts the background video at widths up to 767px", () => {
    preferences(true);
    const { container } = render(<HeroAmbientBackground lang="en" />);
    expect(container.querySelector("video")).toBeNull();
  });
  it("never mounts the background video for reduced motion", () => {
    preferences(false, true);
    const { container } = render(<HeroAmbientBackground lang="en" />);
    expect(container.querySelector("video")).toBeNull();
  });
  it("never mounts the background video with Save-Data", () => {
    preferences(false);
    Object.defineProperty(navigator, "connection", { configurable: true, value: { saveData: true } });
    const { container } = render(<HeroAmbientBackground lang="en" />);
    expect(container.querySelector("video")).toBeNull();
    Object.defineProperty(navigator, "connection", { configurable: true, value: undefined });
  });
  it("waits for window load before allowing desktop video", async () => {
    preferences(false);
    vi.spyOn(document, "readyState", "get").mockReturnValue("loading");
    const { container } = render(<HeroAmbientBackground lang="en" />);
    expect(container.querySelector("video")).toBeNull();
    act(() => window.dispatchEvent(new Event("load")));
    await waitFor(() => expect(container.querySelector("video")?.preload).toBe("none"));
  });
  it("mounts a deferred section only within the 300px approach boundary", () => {
    let notify: IntersectionObserverCallback | undefined;
    const observe = vi.fn();
    vi.stubGlobal("IntersectionObserver", class {
      constructor(callback: IntersectionObserverCallback, options: IntersectionObserverInit) { notify = callback; expect(options.rootMargin).toBe("300px"); }
      observe = observe;
      disconnect() {}
    });
    const mount = vi.fn();
    function Content() { mount(); return null; }
    render(<LoadOnApproach server={null} fallback={null}><Content /></LoadOnApproach>);
    expect(mount).not.toHaveBeenCalled();
    act(() => notify?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(mount).toHaveBeenCalledTimes(1);
  });
});
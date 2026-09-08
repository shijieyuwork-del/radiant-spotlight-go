import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TikTokWall, { type TikTokItem } from "@/components/TikTokWall";
import HeroVideoGallery from "@/components/HeroVideoGallery";
import CoverVideo from "@/components/CoverVideo";

vi.mock("@/lib/saved-cases", () => ({ useSavedCase: () => ({ saved: false, toggleSaved: vi.fn(), saveLabel: "Save this case" }) }));

const items: TikTokItem[] = ["Rhinoplasty", "Facelift"].map((treatment, index) => ({
  id: `diary-${index}`, src: `/diary-${index}.mp4`, poster: `/diary-${index}.jpg`,
  user: { en: "Patient", zh: "患者" }, caption: { en: `Recovery ${index}`, zh: `恢复 ${index}` },
  treatment: { en: treatment, zh: treatment }, clinic: { en: "Clinic", zh: "机构" }, likes: "10", comments: "5", priceCny: 0,
}));
let paused: WeakMap<HTMLMediaElement, boolean>;
let observed: Array<{ callback: IntersectionObserverCallback; element: Element }>;
const originalObserver = globalThis.IntersectionObserver;

beforeEach(() => {
  paused = new WeakMap();
  observed = [];
  vi.spyOn(HTMLMediaElement.prototype, "paused", "get").mockImplementation(function (this: HTMLMediaElement) { return paused.get(this) ?? true; });
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (this: HTMLMediaElement) {
    paused.set(this, false);
    this.dispatchEvent(new Event("play"));
    return Promise.resolve();
  });
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(function (this: HTMLMediaElement) {
    if (paused.get(this) === false) { paused.set(this, true); this.dispatchEvent(new Event("pause")); }
  });
  vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  globalThis.IntersectionObserver = class {
    constructor(private callback: IntersectionObserverCallback) {}
    observe(element: Element) { observed.push({ callback: this.callback, element }); }
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); globalThis.IntersectionObserver = originalObserver; });

const intersect = (element: Element, visible: boolean) => act(() => {
  observed.filter((entry) => entry.element === element).forEach(({ callback }) => callback([{ isIntersecting: visible, intersectionRatio: visible ? 1 : 0, target: element } as IntersectionObserverEntry], {} as IntersectionObserver));
});

describe("visitor-controlled video", () => {
  it("never starts on mount or scroll, including reduced motion, and always exposes pause", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({ matches: true, media: query } as MediaQueryList));
    const { container } = render(<MemoryRouter><TikTokWall items={items} lang="en" fmtPrice={String} variant="cases" /></MemoryRouter>);
    const video = container.querySelector("video")!;
    intersect(video, true);
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    expect(container.querySelector("video[autoplay],video[loop]")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Play video: Rhinoplasty" }));
    await waitFor(() => expect(video.paused).toBe(false));
    fireEvent.click(screen.getByRole("button", { name: "Pause video: Rhinoplasty" }));
    expect(video.paused).toBe(true);
    intersect(video, false);
    intersect(video, true);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Play video: Rhinoplasty" })).toBeInTheDocument();
  });

  it("only plays the chosen video and pauses on leaving the screen or browser tab without resuming", async () => {
    const { container } = render(<MemoryRouter><TikTokWall items={items} lang="en" fmtPrice={String} variant="wall" /></MemoryRouter>);
    const [first, second] = container.querySelectorAll("video");
    fireEvent.click(screen.getByRole("button", { name: "Play video: Rhinoplasty" }));
    fireEvent.click(screen.getByRole("button", { name: "Play video: Facelift" }));
    await waitFor(() => expect(second.paused).toBe(false));
    expect(first.paused).toBe(true);
    intersect(second, false);
    expect(second.paused).toBe(true);
    intersect(second, true);
    expect(second.paused).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Play video: Facelift" }));
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(second.paused).toBe(true);
    vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(second.paused).toBe(true);
  });

  it("also yields to a player using native video controls", async () => {
    const { container } = render(<MemoryRouter><TikTokWall items={[items[0]]} lang="en" fmtPrice={String} variant="cases" /><video data-testid="native-video" controls /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Play video: Rhinoplasty" }));
    const first = container.querySelector("video")!;
    await act(async () => { await (screen.getByTestId("native-video") as HTMLVideoElement).play(); });
    expect(first.paused).toBe(true);
  });

  it("keeps doctor-page native-control players single-active and preserves their cover fallback", async () => {
    const { container } = render(<><CoverVideo src="/one.mp4" coverPath={null} coverUrl={null} /><CoverVideo src="/two.mp4" coverPath={null} coverUrl={null} /></>);
    const [first, second] = container.querySelectorAll("video");
    expect(first.poster).toContain("video-cover-fallback");
    expect(first.controls).toBe(true);
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    await act(async () => { await first.play(); await second.play(); });
    expect(first.paused).toBe(true);
    expect(second.paused).toBe(false);
    intersect(second, false);
    expect(second.paused).toBe(true);
  });

  it("reports a play rejection, keeps retry available and does not expose inactive comments", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockRejectedValue(new Error("Unavailable"));
    render(<MemoryRouter><TikTokWall items={[items[0]]} lang="en" fmtPrice={String} variant="wall" /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Play video: Rhinoplasty" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Video could not play");
    expect(screen.getByRole("button", { name: "Play video: Rhinoplasty" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /comment/i })).not.toBeInTheDocument();
    expect(screen.queryByText("5")).not.toBeInTheDocument();
  });

  it("retains a native case link and only records navigation for that link", () => {
    const onBeforeNavigate = vi.fn();
    render(<MemoryRouter><TikTokWall items={[items[0]]} lang="en" fmtPrice={String} variant="wall" onBeforeNavigate={onBeforeNavigate} /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Save this case" }));
    expect(onBeforeNavigate).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("link", { name: "Recovery 0" }));
    expect(onBeforeNavigate).toHaveBeenCalledWith("diary-0");
  });

  it("opens only the chosen homepage diary, stops on close and restores the exact initiating button", async () => {
    const { container } = render(<MemoryRouter><HeroVideoGallery items={items} lang="en" fmtPrice={String} /></MemoryRouter>);
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    expect(container.querySelector("video[autoplay]")).toBeNull();
    const opener = screen.getByRole("button", { name: "Play fullscreen: Rhinoplasty" });
    fireEvent.click(opener);
    const dialog = screen.getByRole("dialog");
    await waitFor(() => expect(within(dialog).getByRole("button", { name: "Pause video" })).toBeInTheDocument());
    const video = dialog.querySelector("video")!;
    fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(video.paused).toBe(true);
    await waitFor(() => expect(opener).toHaveFocus());

    const secondOpener = screen.getByRole("button", { name: "Play fullscreen: Facelift" });
    fireEvent.click(secondOpener);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await waitFor(() => expect(secondOpener).toHaveFocus());
  });
});

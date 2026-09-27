import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PatientVideoWall from "@/components/home/PatientVideoWall";
import type { TikTokItem } from "@/components/TikTokWall";

vi.mock("@/lib/saved-cases", () => ({
  useSavedCase: () => ({ saved: false, toggleSaved: vi.fn(), saveLabel: "Save this case" }),
}));

const originalObserver = globalThis.IntersectionObserver;
afterEach(() => { cleanup(); vi.restoreAllMocks(); globalThis.IntersectionObserver = originalObserver; });

const items: TikTokItem[] = Array.from({ length: 8 }, (_, index) => ({
  id: `diary-${index}`, src: `/diary-${index}.mp4`, poster: `/poster-${index}.jpg`,
  user: { en: `Patient ${index}`, zh: `患者 ${index}` },
  caption: { en: `Recovery diary ${index}`, zh: `恢复日记 ${index}` },
  treatment: { en: `Treatment ${index}`, zh: `项目 ${index}` },
  clinic: { en: "Clinic", zh: "诊所" }, city: { en: "Shanghai", zh: "上海" },
  likes: "", comments: "", priceCny: 0,
}));
const wall = (data = items, lang: "en" | "zh" = "en") => render(
  <MemoryRouter><PatientVideoWall items={data} lang={lang} fmtPrice={String} /></MemoryRouter>,
);

describe("three-column patient video wall", () => {
  it("uses three alternating tracks, with exactly one accessible control per diary and no mounted videos", () => {
    const { container } = wall();
    expect(container.querySelectorAll(".patient-video-wall__column")).toHaveLength(3);
    expect(Array.from(container.querySelectorAll(".patient-video-wall__track")).map((node) => node.getAttribute("data-direction"))).toEqual(["up", "down", "up"]);
    const region = screen.getByRole("region", { name: "Patient video wall" });
    expect(within(region).getAllByRole("button")).toHaveLength(8);
    expect(container.querySelectorAll("video")).toHaveLength(0);
    for (const clone of container.querySelectorAll('[data-duplicate="true"]')) expect(clone).toHaveAttribute("tabindex", "-1");
  });

  it("opens the selected real video with save, share, sound and case controls, then unmounts it on close", () => {
    wall();
    fireEvent.click(screen.getByRole("button", { name: "Play video: Treatment 2 — Recovery diary 2" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog.querySelector("video")).toHaveAttribute("src", "/diary-2.mp4");
    expect(within(dialog).getByRole("button", { name: "Save this case" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Share this case" })).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", { name: "Unmute video" }));
    expect(within(dialog).getByRole("button", { name: "Mute video" })).toHaveAttribute("aria-pressed", "true");
    expect(within(dialog).getByRole("link", { name: "View case" })).toHaveAttribute("href", "/cases/diary-2");
    fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.querySelectorAll("video")).toHaveLength(0);
  });

  it("pauses offscreen, by user request, and when the page is hidden", () => {
    let intersect: IntersectionObserverCallback = () => {};
    const disconnect = vi.fn();
    globalThis.IntersectionObserver = class {
      constructor(callback: IntersectionObserverCallback) { intersect = callback; }
      observe() {} disconnect = disconnect;
    } as unknown as typeof IntersectionObserver;
    const { container, unmount } = wall();
    const root = container.querySelector(".patient-video-wall")!;
    expect(root).toHaveAttribute("data-running", "false");
    act(() => intersect([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(root).toHaveAttribute("data-running", "true");
    fireEvent.click(screen.getByRole("button", { name: "Pause motion" }));
    expect(root).toHaveAttribute("data-running", "false");
    expect(screen.getByRole("button", { name: "Resume motion" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Resume motion" }));
    expect(root).toHaveAttribute("data-running", "true");
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    fireEvent(document, new Event("visibilitychange"));
    expect(root).toHaveAttribute("data-running", "false");
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it("uses a stable layout when reduced motion is requested", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList);
    const { container } = wall();
    expect(container.querySelector(".patient-video-wall")).toHaveAttribute("data-static", "true");
    expect(container.querySelector(".patient-video-wall")).toHaveAttribute("data-running", "false");
    expect(screen.queryByRole("button", { name: "Pause motion" })).not.toBeInTheDocument();
  });

  it("keeps Chinese labels, and handles sparse and empty collections", () => {
    const { container, unmount } = wall(items.slice(0, 1), "zh");
    expect(screen.getByRole("region", { name: "患者视频墙" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "播放视频: 项目 0 — 恢复日记 0" })).toBeInTheDocument();
    expect(container.querySelectorAll(".patient-video-wall__column")).toHaveLength(1);
    unmount();
    wall([]);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });
});

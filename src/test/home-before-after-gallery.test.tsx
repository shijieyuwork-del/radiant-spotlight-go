import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomeBeforeAfterGallery from "@/components/home/HomeBeforeAfterGallery";
import type { BeforeAfterRow } from "@/hooks/use-before-after";

const state = vi.hoisted(() => ({ items: [] as BeforeAfterRow[], loading: false, lang: "en" }));
vi.mock("@/hooks/use-before-after", () => ({ usePublishedBeforeAfter: () => state }));
vi.mock("@/lib/asia-i18n", () => ({ useAsia: () => ({ lang: state.lang }) }));
const photos = (): BeforeAfterRow[] => Array.from({ length: 8 }, (_, index) => ({
  id: `photo-${index}`, title: `Photo set ${index}`, before_path: `${index}.jpg`, after_path: `${index}.jpg`,
  beforeUrl: `/photo-${index}.jpg`, afterUrl: `/photo-${index}.jpg`, created_at: "2026-09-29",
  status: "published", city: "Shanghai", procedure: "Rhinoplasty", caption: null,
  doctor_id: null, months_after: 3, i18n: {},
}));
const gallery = () => render(<MemoryRouter><HomeBeforeAfterGallery /></MemoryRouter>);
beforeEach(() => { state.items = photos(); state.loading = false; state.lang = "en"; });
afterEach(cleanup);

describe("homepage before and after photos", () => {
  it("shows six published photo sets in one continuously moving row without white letterboxing", () => {
    const { container } = gallery();
    const marquee = screen.getByTestId("home-before-after-marquee");
    const row = screen.getByTestId("home-before-after-row");
    expect(marquee).toHaveClass("overflow-hidden");
    expect(row).toHaveClass("flex");
    expect(within(row).getAllByRole("article")).toHaveLength(6);
    expect(within(row).getAllByRole("img")).toHaveLength(6);
    expect(within(row).queryByText("Photo set 6")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Before & After" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all photos" })).toHaveAttribute("href", "/before-after");
    expect(screen.queryByRole("button", { name: /play/i })).not.toBeInTheDocument();
    expect(container.querySelector("video")).toBeNull();
    within(row).getAllByRole("img").forEach((img) => {
      expect(img).toHaveClass("w-full", "h-auto");
      expect(img).not.toHaveClass("object-cover");
    });
    within(row).getAllByRole("button").forEach((button) => {
      expect(button).toHaveClass("bg-transparent");
      expect(button).not.toHaveClass("bg-white", "aspect-[16/10]");
    });
  });

  it("opens the actual comparison image and returns focus to its thumbnail after close", async () => {
    gallery();
    const opener = screen.getByRole("button", { name: "Enlarge photos: Photo set 2" });
    fireEvent.click(opener);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("img")).toHaveAttribute("src", "/photo-2.jpg");
    expect(within(dialog).getByRole("img")).toHaveClass("object-contain");
    fireEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it("shows separate before / after images without inventing or duplicating a comparison", () => {
    state.items = [{ ...photos()[0], after_path: "after.jpg", afterUrl: "/after.jpg" }];
    gallery();
    expect(screen.getByRole("img", { name: "Photo set 0 — Before" })).toHaveAttribute("src", "/photo-0.jpg");
    expect(screen.getByRole("img", { name: "Photo set 0 — After" })).toHaveAttribute("src", "/after.jpg");
  });

  it("uses neutral loading placeholders and never substitutes video covers or broken photos", () => {
    state.loading = true;
    const { unmount } = gallery();
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    unmount();
    state.loading = false;
    state.items = [{ ...photos()[0], beforeUrl: "" }];
    gallery();
    expect(screen.getByRole("status")).toHaveTextContent("No photo sets available yet.");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("localizes the title and image controls for Chinese", () => {
    state.lang = "zh";
    gallery();
    expect(screen.getByRole("heading", { name: "术前术后对比" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "查看全部照片" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "放大照片: Photo set 0" })).toBeInTheDocument();
  });
});

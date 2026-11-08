import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import type { TikTokItem } from "@/components/TikTokWall";
import BeforeAfterGallery from "@/pages/BeforeAfterGallery";
import Cases from "@/pages/Cases";

const state = vi.hoisted(() => {
  const video = (id: string, treatment: string): TikTokItem => ({ id, src: `/${id}.mp4`, user: { en: "", zh: "" }, caption: { en: id, zh: id }, treatment: { en: treatment, zh: treatment }, clinic: { en: "", zh: "" }, likes: "", comments: "", priceCny: 0 });
  return {
    videoHook: vi.fn(),
    diaries: [video("existing-diary", "Rhinoplasty")],
    gallery: Array.from({ length: 10 }, (_, i) => video(`gallery-${i}`, "Injectables")),
    uploaded: [video("uploaded-gallery", "Injectables")],
    photos: [{ id: "photo", title: "Photo result", procedure: "Rhinoplasty", before_path: "before.jpg", after_path: "after.jpg", beforeUrl: "/before.jpg", afterUrl: "/after.jpg", doctor_id: null, caption: "Photo caption" }],
  };
});
vi.mock("@/lib/asia-i18n", () => ({ useAsia: () => ({ lang: "en", t: (key: string) => key, fmt: String }) }));
vi.mock("@/hooks/use-published-videos", () => ({ usePublishedVideos: (...args: unknown[]) => { state.videoHook(...args); return state.uploaded; } }));
vi.mock("@/hooks/use-before-after", () => ({ usePublishedBeforeAfter: () => ({ items: state.photos, loading: false }) }));
vi.mock("@/data/tiktokCases", () => ({ TIKTOK_CASES: state.diaries }));
vi.mock("@/data/galleryCases", () => ({ GALLERY_CASES: state.gallery }));
vi.mock("@/data/doctors", () => ({ DOCTORS: [] }));
vi.mock("@/components/AsiaNavbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/PageMeta", () => ({ default: () => null }));
vi.mock("@/components/MedicalDisclaimer", () => ({ MedicalDisclaimer: () => null }));
vi.mock("@/components/BeforeAfterCard", () => ({ default: ({ before, after }: { before: string; after: string }) => <div><img src={before} alt="Before" /><img src={after} alt="After" /></div> }));
vi.mock("@/components/TikTokWall", () => ({ default: ({ items }: { items: TikTokItem[] }) => <ul aria-label="Diary results">{items.map((item) => <li key={item.id}><Link to={`/cases/${item.id}`}>{item.caption.en}</Link></li>)}</ul> }));
vi.mock("@/lib/geo", () => ({ cityCoordsOf: () => null, haversineKm: () => 0, useUserLocation: () => ({ coords: null, status: "idle", request: vi.fn() }) }));

const Location = () => <output data-testid="location">{useLocation().pathname}</output>;
const show = (path: string) => render(<MemoryRouter initialEntries={[path]}><Location /><Routes><Route path="/before-after" element={<BeforeAfterGallery />} /><Route path="/cases" element={<Cases />} /><Route path="/cases/:id" element={<p>Video detail</p>} /></Routes></MemoryRouter>);
beforeEach(() => { state.videoHook.mockClear(); sessionStorage.clear(); });
afterEach(cleanup);

describe("photo and video destinations", () => {
  it("keeps Before & After image-only and excludes video procedures from filters", () => {
    const { container } = show("/before-after");
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(container.querySelector("video")).toBeNull();
    expect(screen.queryByTestId("before-after-videos")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Injectables" })).not.toBeInTheDocument();
    expect(state.videoHook).not.toHaveBeenCalled();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Photo result" } });
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  it("preserves old gallery video links by redirecting to the diary detail", async () => {
    show("/before-after?video=gallery-9");
    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/cases/gallery-9"));
    expect(screen.getByText("Video detail")).toBeVisible();
  });

  it("combines both video collections, requests all published uploads and paginates", () => {
    show("/cases");
    expect(state.videoHook).toHaveBeenCalledWith("en", "all");
    expect(screen.getByRole("link", { name: "existing-diary" })).toHaveAttribute("href", "/cases/existing-diary");
    expect(screen.getByRole("link", { name: "uploaded-gallery" })).toBeVisible();
    expect(screen.getByRole("link", { name: "gallery-0" })).toHaveAttribute("href", "/cases/gallery-0");
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    expect(screen.getByRole("link", { name: "gallery-9" })).toBeVisible();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "gallery-9" } });
    expect(screen.getByRole("link", { name: "gallery-9" })).toBeVisible();
    expect(screen.queryByRole("link", { name: "existing-diary" })).not.toBeInTheDocument();
  });
});

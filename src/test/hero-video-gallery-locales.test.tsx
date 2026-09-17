import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HeroVideoGallery from "@/components/HeroVideoGallery";
import type { TikTokItem } from "@/components/TikTokWall";

afterEach(cleanup);

const item: TikTokItem = {
  id: "test-diary",
  src: "/test-diary.mp4",
  user: { en: "Test patient", zh: "测试用户" },
  caption: { en: "My recovery update", zh: "我的恢复记录" },
  treatment: { en: "Rhinoplasty", zh: "鼻整形" },
  clinic: { en: "Test clinic", zh: "测试机构" },
  city: { en: "Shanghai", zh: "上海" },
  likes: "",
  comments: "",
  priceCny: 0,
};

describe("Thai and Malay homepage video gallery", () => {
  for (const [lang, fullscreen, more, viewCase] of [
    ["th", "เล่นแบบเต็มหน้าจอ", "บันทึกของผู้ป่วยเพิ่มเติม", "ดูกรณีนี้"],
    ["ms", "Mainkan skrin penuh", "Lebih banyak diari pesakit", "Lihat kes"],
  ] as const) {
    for (const size of ["default", "large"] as const) {
      it(`${lang} ${size} renders the diary link and play action without missing labels`, () => {
        render(<MemoryRouter><HeroVideoGallery items={[item]} lang={lang} size={size} fmtPrice={String} /></MemoryRouter>);
        expect(screen.getByRole("link", { name: more })).toHaveAttribute("href", "/cases");
        expect(screen.getByRole("button", { name: `${fullscreen}: Rhinoplasty` })).toBeInTheDocument();
      });
    }

    it(`${lang} can open a diary and follow its case link`, () => {
      render(<MemoryRouter><HeroVideoGallery items={[item]} lang={lang} fmtPrice={String} /></MemoryRouter>);
      fireEvent.click(screen.getByRole("button", { name: `${fullscreen}: Rhinoplasty` }));
      const dialog = screen.getByRole("dialog");
      expect(within(dialog).getByText("My recovery update")).toBeInTheDocument();
      expect(within(dialog).getByRole("link", { name: viewCase })).toHaveAttribute("href", "/cases/test-diary");
    });
  }
});

describe("cinematic homepage gallery", () => {
  it("lays out nine real diary controls in three counter-moving columns, with no video downloads", () => {
    const items = Array.from({ length: 9 }, (_, index) => ({ ...item, id: `diary-${index}` }));
    const { container } = render(<MemoryRouter><HeroVideoGallery items={items} lang="en" fmtPrice={String} layout="arc" /></MemoryRouter>);
    const gallery = screen.getByRole("group", { name: "Patient diaries" });
    expect(within(gallery).getAllByRole("button")).toHaveLength(9);
    expect(gallery.querySelectorAll(".hero-film-wall__column")).toHaveLength(3);
    expect(gallery.querySelectorAll(".hero-film-wall__track--down")).toHaveLength(1);
    expect(container.querySelectorAll("video")).toHaveLength(0);
    expect(screen.getByRole("link", { name: "More patient diaries" })).toHaveAttribute("href", "/cases");
  });

  it("retains the localized player and case link in the arc layout", () => {
    render(<MemoryRouter><HeroVideoGallery items={[item]} lang="zh" fmtPrice={String} layout="arc" /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "全屏播放: 鼻整形" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("我的恢复记录")).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: "查看案例" })).toHaveAttribute("href", "/cases/test-diary");
  });

  it("keeps a single available diary and the directory reachable when empty", () => {
    const { rerender } = render(<MemoryRouter><HeroVideoGallery items={[item]} lang="en" fmtPrice={String} layout="arc" /></MemoryRouter>);
    expect(within(screen.getByRole("group", { name: "Patient diaries" })).getAllByRole("button")).toHaveLength(1);
    rerender(<MemoryRouter><HeroVideoGallery items={[]} lang="en" fmtPrice={String} layout="arc" /></MemoryRouter>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "More patient diaries" })).toHaveAttribute("href", "/cases");
  });
});

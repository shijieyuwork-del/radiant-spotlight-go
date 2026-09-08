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

import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TikTokWall, { type TikTokItem } from "@/components/TikTokWall";

vi.mock("@/lib/saved-cases", () => ({
  useSavedCase: () => ({ saved: false, toggleSaved: vi.fn(), signedIn: false, saveLabel: "Save this case" }),
}));

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

describe("Thai and Malay diary card rendering", () => {
  for (const [lang, play, preview] of [
    ["th", "เล่นวิดีโอ: Rhinoplasty", "ตัวอย่างบันทึก"],
    ["ms", "Mainkan video: Rhinoplasty", "Pratonton diari"],
  ] as const) {
    for (const variant of ["preview", "wall", "cases"] as const) {
      it(`${lang} ${variant} renders labels and English content when a translation is missing`, () => {
        render(<MemoryRouter><TikTokWall items={[item]} lang={lang} variant={variant} fmtPrice={String} /></MemoryRouter>);
        expect(screen.getByRole("button", { name: play })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "My recovery update" })).toBeInTheDocument();
        for (const text of ["Test patient", "My recovery update", "Rhinoplasty", "Shanghai"]) {
          expect(screen.getByText(text)).toBeInTheDocument();
        }
        if (variant !== "cases") expect(screen.getByText(preview)).toBeInTheDocument();
      });
    }
  }

  it("uses a published translation when available", () => {
    const translated = { ...item, caption: { ...item.caption, ms: "Perkembangan pemulihan saya" } };
    render(<MemoryRouter><TikTokWall items={[translated]} lang="ms" variant="wall" fmtPrice={String} /></MemoryRouter>);
    expect(screen.getByRole("link", { name: "Perkembangan pemulihan saya" })).toBeInTheDocument();
    expect(screen.getByText("Perkembangan pemulihan saya")).toBeInTheDocument();
  });
});

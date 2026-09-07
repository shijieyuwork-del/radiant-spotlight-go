import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { HospitalDirectoryPhoto } from "@/components/HospitalDirectoryPhoto";
import type { RealHospitalPhoto } from "@/data/realHospitalPhotos";

vi.mock("@/lib/asia-i18n", () => ({ useAsia: () => ({ lang: "en" }) }));
afterEach(cleanup);

const photo: RealHospitalPhoto = {
  hospitalZh: "测试医院",
  imgPath: "src/assets/real-photos/test.webp",
  src: "/assets/test.webp",
  author: "Test photographer",
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:Test.jpg",
  description: "Verified hospital exterior, photographed in 2024.",
  modifications: "Converted to WebP; responsive crop.",
};

describe("Hospital photographs", () => {
  it("does not substitute a generic photograph when the hospital has no verified image", () => {
    render(<HospitalDirectoryPhoto name="Test hospital" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("Photo not available")).toBeInTheDocument();
    expect(screen.queryByText("Photo credit")).not.toBeInTheDocument();
  });

  it("renders the exact image with meaningful alt text and deferred loading", () => {
    render(<HospitalDirectoryPhoto photo={photo} name="Test hospital" />);
    const img = screen.getByRole("img", { name: "Test hospital" });
    expect(img).toHaveAttribute("src", photo.src);
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("decoding", "async");
  });

  it("preserves source, author, license, and modification information", () => {
    render(<HospitalDirectoryPhoto photo={photo} name="Test hospital" />);
    expect(screen.getByText(photo.author).closest("a")).toHaveAttribute("href", photo.sourceUrl);
    expect(screen.getByText(photo.license).closest("a")).toHaveAttribute("href", photo.licenseUrl);
    expect(screen.getByText(photo.description)).toBeInTheDocument();
    expect(screen.getByText(photo.modifications)).toBeInTheDocument();
    expect(screen.getByText("Photo credit").tagName).toBe("SUMMARY");
  });

  it("uses an honest placeholder if a real photograph fails to load", () => {
    render(<HospitalDirectoryPhoto photo={photo} name="Test hospital" />);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("Photo not available")).toBeInTheDocument();
    expect(screen.queryByText("Photo credit")).not.toBeInTheDocument();
  });

  it("preserves full framing for portrait photographs", () => {
    render(<HospitalDirectoryPhoto photo={{ ...photo, originalWidth: 900, originalHeight: 1200 }} name="Test hospital" />);
    expect(screen.getByRole("img")).toHaveStyle({ objectFit: "contain" });
  });
});

import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ClinicGalleryEditor, { type DraftClinicPhoto } from "@/components/ClinicGalleryEditor";
import { ClinicPhotoGallery } from "@/components/clinics/ClinicPhotoGallery";
import { STATIC_CLINICS } from "@/data/clinicDirectory";
import { clinicPhoto, clinicPhotos } from "@/lib/clinic-photo";
import { clinicGalleryPaths, parseClinicGallery, resolveClinicGallery } from "@/lib/clinic-gallery";

vi.mock("@/lib/asia-i18n", () => ({ useAsia: () => ({ lang: "en" }) }));
beforeEach(() => {
  Object.defineProperty(URL, "createObjectURL", { configurable: true, value: vi.fn(() => "blob:test") });
  Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
  Object.defineProperty(crypto, "randomUUID", { configurable: true, value: vi.fn(() => String(Math.random())) });
});
afterEach(cleanup);

const photo = (index: number): DraftClinicPhoto => ({ key: String(index), item: { kind: "upload", path: `${index}.jpg` }, url: `/photo-${index}.jpg` });
function Editor({ initial = [] }: { initial?: DraftClinicPhoto[] }) {
  const [photos, setPhotos] = useState(initial);
  return <ClinicGalleryEditor photos={photos} onChange={setPhotos} />;
}
function upload(container: HTMLElement, files: File[]) {
  fireEvent.change(container.querySelector('input[type="file"]')!, { target: { files } });
}
const file = () => new File(["photo"], "hospital.jpg", { type: "image/jpeg" });

describe("clinic gallery references", () => {
  const clinic = STATIC_CLINICS.find((item) => item.nameZh === "复旦大学附属华山医院")!;
  it("inherits existing photos, but never resurrects a deliberately emptied gallery", () => {
    expect(clinicPhoto(clinic)?.src).toBeTruthy();
    expect(clinicPhoto({ ...clinic, photoGallery: [], photoUrl: "/legacy.jpg" })).toBeUndefined();
    expect(clinicPhoto({ ...clinic, photoUrl: "/legacy.jpg" })?.src).toBe("/legacy.jpg");
  });
  it("uses the ordered first image as cover and preserves original attribution", () => {
    const photos = clinicPhotos({ ...clinic, photoGallery: [{ kind: "upload", path: "new.jpg", url: "/new.jpg" }, { kind: "original" }] });
    expect(photos[0].src).toBe("/new.jpg");
    expect(photos[0].sourceUrl).toBe("");
    expect(photos[1].sourceUrl).toBeTruthy();
  });
  it("collects only stored upload paths and distinguishes null from []", () => {
    expect(clinicGalleryPaths(null, "old.jpg")).toEqual(["old.jpg"]);
    expect(clinicGalleryPaths([], "old.jpg")).toEqual([]);
    expect(clinicGalleryPaths([{ kind: "original" }, { kind: "upload", path: "new.jpg" }], "old.jpg")).toEqual(["new.jpg"]);
    expect(resolveClinicGallery([{ kind: "upload", path: "new.jpg" }], new Map([["new.jpg", "/signed.jpg"]]))).toEqual([{ kind: "upload", path: "new.jpg", url: "/signed.jpg" }]);
    expect(parseClinicGallery(Array.from({ length: 7 }, () => ({ kind: "original" })))).toHaveLength(6);
  });
});

describe("clinic gallery editing", () => {
  it("adds multiple images, disables add at six, and allows adding after removal", () => {
    const { container } = render(<Editor initial={[photo(0)]} />);
    fireEvent.click(screen.getByRole("button", { name: "添加照片" }));
    upload(container, Array.from({ length: 5 }, file));
    expect(screen.getAllByRole("img")).toHaveLength(6);
    expect(screen.getByRole("button", { name: "添加照片" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "删除照片 6" }));
    expect(screen.getByRole("button", { name: "添加照片" })).toBeEnabled();
  });
  it("rejects an oversized batch without losing existing images", () => {
    const { container } = render(<Editor initial={[photo(0)]} />);
    upload(container, Array.from({ length: 6 }, file));
    expect(screen.getByRole("alert")).toHaveTextContent("最多 6 张");
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });
  it("rejects non-image and oversize files", () => {
    const { container } = render(<Editor />);
    upload(container, [new File(["pdf"], "test.pdf", { type: "application/pdf" })]);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    const huge = file();
    Object.defineProperty(huge, "size", { value: 11 * 1024 * 1024 });
    upload(container, [huge]);
    expect(screen.getByRole("alert")).toHaveTextContent("10");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
  it("replaces an image at the six-photo limit and revokes temporary previews", () => {
    const { container, unmount } = render(<Editor initial={Array.from({ length: 6 }, (_, i) => photo(i))} />);
    fireEvent.click(screen.getByRole("button", { name: "替换照片 2" }));
    upload(container, [file()]);
    expect(screen.getAllByRole("img")).toHaveLength(6);
    expect(screen.getAllByRole("img")[1]).toHaveAttribute("src", "blob:test");
    unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:test");
  });
  it("sets a different cover and can remove every photo including the default", () => {
    render(<Editor initial={[{ key: "original", item: { kind: "original" }, url: "/original.jpg" }, photo(1)]} />);
    fireEvent.click(screen.getByRole("button", { name: "将照片 2 设为封面" }));
    expect(screen.getAllByRole("img")[0]).toHaveAttribute("src", "/photo-1.jpg");
    fireEvent.click(screen.getByRole("button", { name: "删除照片 1" }));
    fireEvent.click(screen.getByRole("button", { name: "删除照片 1" }));
    expect(screen.getByText(/暂无照片/)).toBeInTheDocument();
  });
  it("lets visitors select a photo without changing its cover or losing credits", () => {
    const clinic = STATIC_CLINICS.find((item) => item.nameZh === "复旦大学附属华山医院")!;
    const photos = clinicPhotos({ ...clinic, photoGallery: [{ kind: "original" }, { kind: "upload", path: "new.jpg", url: "/new.jpg" }] });
    render(<MemoryRouter><ClinicPhotoGallery photos={photos} name="Hospital" /></MemoryRouter>);
    expect(screen.getByText("Photo credit")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "View photo 2 of 2" }));
    expect(screen.getByRole("img", { name: "Hospital" })).toHaveAttribute("src", "/new.jpg");
    expect(screen.queryByText("Photo credit")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View photo 2 of 2" })).toHaveAttribute("aria-pressed", "true");
  });
});

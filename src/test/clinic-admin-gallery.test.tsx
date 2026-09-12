import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import ClinicAdmin from "@/components/ClinicAdmin";
import { STATIC_CLINICS } from "@/data/clinicDirectory";

const mock = vi.hoisted(() => ({ rows: [] as Record<string, unknown>[], save: vi.fn(), upload: vi.fn(), remove: vi.fn(), error: vi.fn() }));
vi.mock("@/components/ClinicPdfExtractor", () => ({ default: () => null }));
vi.mock("@/hooks/use-realtime-refresh", () => ({ useRealtimeRefresh: () => {} }));
vi.mock("@/lib/storage-urls", () => ({ signedUrls: async (_bucket: string, paths: string[]) => paths.map((path) => `/signed/${path}`) }));
vi.mock("@/lib/upload-media", () => ({ uploadMedia: mock.upload }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: mock.error } }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: {
  from: (table: string) => ({
    select: () => ({ order: async () => ({ data: mock.rows, error: null }), eq: async () => ({ data: [], error: null }) }),
    update: (payload: unknown) => ({ eq: () => mock.save(payload) }),
    insert: (payload: unknown) => mock.save(payload),
  }),
  storage: { from: () => ({ remove: mock.remove }) },
} }));

const clinic = STATIC_CLINICS.find((item) => item.nameZh === "复旦大学附属华山医院")!;
async function edit() {
  render(<ClinicAdmin />);
  await waitFor(() => expect(screen.getByText(clinic.nameZh)).toBeInTheDocument());
  const card = screen.getByText(clinic.nameZh).closest("article")!;
  await waitFor(() => expect(within(card).getByRole("img")).toHaveAttribute("src", "/signed/old.jpg"));
  fireEvent.click(within(card).getByRole("button", { name: "编辑", exact: true }));
  return screen.getByRole("dialog");
}
beforeEach(() => {
  vi.clearAllMocks();
  mock.rows = [{ id: "clinic-1", static_slug: clinic.slug, city_slug: clinic.citySlug,
    name_en: clinic.nameEn, name_zh: clinic.nameZh, photo_path: "old.jpg", photo_gallery: null,
    hidden: false, status: "published", is_public: true }];
  mock.save.mockResolvedValue({ error: null });
  mock.upload.mockResolvedValue("new.jpg");
  Object.defineProperty(URL, "createObjectURL", { configurable: true, value: vi.fn(() => "blob:test") });
  Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
});
afterEach(cleanup);

describe("clinic gallery persistence", () => {
  it("cancelling a removal leaves the record and stored files untouched", async () => {
    const dialog = await edit();
    fireEvent.click(within(dialog).getByRole("button", { name: "删除照片 1" }));
    fireEvent.click(within(dialog).getByRole("button", { name: "取消" }));
    expect(mock.save).not.toHaveBeenCalled();
    expect(mock.remove).not.toHaveBeenCalled();
    expect(mock.upload).not.toHaveBeenCalled();
  });
  it("persists an explicitly empty gallery, rather than restoring the default photo", async () => {
    const dialog = await edit();
    fireEvent.click(within(dialog).getByRole("button", { name: "删除照片 1" }));
    fireEvent.click(within(dialog).getByRole("button", { name: "保存" }));
    await waitFor(() => expect(mock.save).toHaveBeenCalledWith(expect.objectContaining({ photo_gallery: [], photo_path: null })));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(mock.remove).not.toHaveBeenCalled();
  });
  it("retains a failed save and reuses the successful upload on retry", async () => {
    mock.save.mockResolvedValueOnce({ error: { message: "temporary database error" } }).mockResolvedValue({ error: null });
    const dialog = await edit();
    fireEvent.click(within(dialog).getByRole("button", { name: "替换照片 1" }));
    fireEvent.change(dialog.querySelector('input[type="file"]')!, { target: { files: [new File(["photo"], "new.jpg", { type: "image/jpeg" })] } });
    fireEvent.click(within(dialog).getByRole("button", { name: "保存" }));
    await waitFor(() => expect(mock.error).toHaveBeenCalledWith("temporary database error"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", { name: "保存" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(mock.upload).toHaveBeenCalledTimes(1);
    expect(mock.save).toHaveBeenLastCalledWith(expect.objectContaining({ photo_path: "new.jpg", photo_gallery: [{ kind: "upload", path: "new.jpg" }] }));
    expect(mock.remove).not.toHaveBeenCalled();
  });
});

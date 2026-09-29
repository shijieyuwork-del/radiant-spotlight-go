import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePublishedDoctors, type PublishedDoctor } from "@/hooks/use-published-doctors";
import { HOMEPAGE_DOCTOR_IDS, HOMEPAGE_DOCTOR_LIMIT, selectHomepageDoctors } from "@/data/homepage-doctors";
import type { AsiaLang } from "@/lib/asia-i18n";

const mock = vi.hoisted(() => ({ fetch: vi.fn(), photos: vi.fn(), filter: vi.fn(), order: vi.fn() }));
vi.mock("@/lib/storage-urls", () => ({ signedUrls: mock.photos }));
vi.mock("@/hooks/use-realtime-refresh", () => ({ useRealtimeRefresh: () => {} }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: () => {
  const builder = {
    select: () => builder,
    eq: (...args: unknown[]) => { mock.filter(...args); return builder; },
    order: (...args: unknown[]) => { mock.order(...args); return builder; },
    abortSignal: () => mock.fetch(),
  };
  return builder;
} } }));

const doctor: PublishedDoctor = { id: HOMEPAGE_DOCTOR_IDS[0], name: "吴浩", title: "医生", city: "上海", specialties: ["鼻整形"], bio: "介绍", photo_path: "wu/photo.jpg", i18n: { en: { name: "Dr. Wu Hao", title: "Attending Plastic Surgeon", city: "Shanghai" }, zh: { name: "吴浩" } } };
const clients: QueryClient[] = [];
const createWrapper = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  clients.push(client);
  return ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
beforeEach(() => { vi.clearAllMocks(); mock.fetch.mockResolvedValue({ data: [doctor], error: null }); mock.photos.mockResolvedValue(["/signed-wu.jpg"]); });
afterEach(() => { cleanup(); clients.splice(0).forEach((client) => client.clear()); });

describe("published-only first doctor render", () => {
  it("never displays other people while the real API is pending", () => {
    mock.fetch.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => usePublishedDoctors("en"), { wrapper: createWrapper() });
    expect(result.current.status).toBe("loading");
    expect(result.current.doctors).toEqual([]);
    expect(mock.filter).toHaveBeenCalledWith("status", "published");
  });

  it("renders the correct names before slow photo signing finishes", async () => {
    let finishPhotos!: (urls: string[]) => void;
    mock.photos.mockReturnValue(new Promise<string[]>((resolve) => { finishPhotos = resolve; }));
    const { result } = renderHook(() => usePublishedDoctors("en"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.doctors[0]).toMatchObject({ name: "Dr. Wu Hao", photo: "", demo: false });
    act(() => finishPhotos(["/signed-wu.jpg"]));
    await waitFor(() => expect(result.current.doctors[0].photo).toBe("/signed-wu.jpg"));
    expect(result.current.doctors.map((item) => item.id)).toEqual([doctor.id]);
  });

  it("reuses already-loaded public profiles between routes and localizes without refetching", async () => {
    const wrapper = createWrapper();
    const first = renderHook(({ lang }: { lang: AsiaLang }) => usePublishedDoctors(lang), { wrapper, initialProps: { lang: "en" } });
    await waitFor(() => expect(first.result.current.doctors[0]?.photo).toBe("/signed-wu.jpg"));
    first.rerender({ lang: "zh" });
    expect(first.result.current.doctors[0].name).toBe("吴浩");
    first.unmount();
    const second = renderHook(() => usePublishedDoctors("en"), { wrapper });
    expect(second.result.current.status).toBe("ready");
    expect(second.result.current.doctors[0].name).toBe("Dr. Wu Hao");
    expect(mock.fetch).toHaveBeenCalledTimes(1);
    expect(mock.photos).toHaveBeenCalledTimes(1);
  });

  it("never substitutes sample people on empty results or network errors", async () => {
    mock.fetch.mockResolvedValueOnce({ data: [], error: null });
    const { result } = renderHook(() => usePublishedDoctors("en"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.doctors).toEqual([]);
    mock.fetch.mockResolvedValue({ data: null, error: new Error("offline") });
    const failed = renderHook(() => usePublishedDoctors("en"), { wrapper: createWrapper() });
    await waitFor(() => expect(failed.result.current.status).toBe("error"));
    expect(failed.result.current.doctors).toEqual([]);
  });

  it("keeps existing profiles visible throughout background refresh", async () => {
    const { result } = renderHook(() => usePublishedDoctors("en"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.status).toBe("ready"));
    mock.fetch.mockReturnValue(new Promise(() => {}));
    act(() => result.current.refresh());
    expect(result.current.status).toBe("ready");
    expect(result.current.doctors[0].name).toBe("Dr. Wu Hao");
  });

  it("shows the final six published profiles in the same order as the doctor directory", () => {
    const directory = Array.from({ length: 10 }, (_, index) => ({ ...doctor, id: `doctor-${index}` }));
    expect(selectHomepageDoctors(directory).map((item) => item.id)).toEqual(
      directory.slice(-HOMEPAGE_DOCTOR_LIMIT).map((item) => item.id),
    );
    expect(selectHomepageDoctors(directory.slice(0, 4)).map((item) => item.id)).toEqual(
      directory.slice(0, 4).map((item) => item.id),
    );
    expect(selectHomepageDoctors([])).toEqual([]);
  });
});

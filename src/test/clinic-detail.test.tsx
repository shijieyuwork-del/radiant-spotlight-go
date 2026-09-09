import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ClinicDetail from "@/pages/ClinicDetail";
import { STATIC_CLINICS, getClinicPath, mergeClinicDirectory, type PublishedClinicDoctor } from "@/data/clinicDirectory";
import { CITIES } from "@/data/cities";
import { ClinicCard } from "@/components/clinics/ClinicCard";
import { findRealHospitalPhoto } from "@/data/realHospitalPhotos";
import type { RealHospitalPhoto } from "@/data/realHospitalPhotos";

const mocks = vi.hoisted(() => ({ open: vi.fn(), refetch: vi.fn(), directory: vi.fn(), lang: "en" }));
vi.mock("@/components/AsiaNavbar", () => ({ default: () => <nav aria-label="Site" /> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer /> }));
vi.mock("@/components/QuoteRequest", () => ({ useQuote: () => ({ open: mocks.open }) }));
vi.mock("@/hooks/use-clinic-directory", () => ({ useClinicDirectory: () => mocks.directory() }));
vi.mock("@/lib/asia-i18n", () => ({ useAsia: () => ({ lang: mocks.lang }) }));
vi.mock("@/data/realHospitalPhotos", () => ({ findRealHospitalPhoto: vi.fn() }));

const linkedDoctor: PublishedClinicDoctor = { id: "published-expert", name: "Published Expert", title: "Published title", city: "Shanghai", hospital: "Example Published Clinic", i18n: {} };
const snapshot = { clinics: STATIC_CLINICS, doctors: [] as PublishedClinicDoctor[], isLoading: false, isError: false, refetch: mocks.refetch };
const openPage = (slug: string) => render(<MemoryRouter initialEntries={[getClinicPath(slug)]}><Routes><Route path="/clinics/:slug" element={<ClinicDetail />} /></Routes></MemoryRouter>);

beforeEach(() => { vi.clearAllMocks(); vi.spyOn(window, "scrollTo").mockImplementation(() => {}); mocks.lang = "en"; mocks.directory.mockReturnValue(snapshot); });
afterEach(cleanup);

describe("hospital detail pages", () => {
  it.each(STATIC_CLINICS)("renders $nameEn at its own URL", (clinic) => {
    openPage(clinic.slug);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(clinic.nameEn);
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", `https://celadonchina.com${getClinicPath(clinic)}`);
  });

  it("shows sourced featured-clinic details and keeps its inquiry context", () => {
    const clinic = STATIC_CLINICS.find((item) => item.nameEn === "Shanghai Huamei Plastic Surgery Hospital")!;
    openPage(clinic.slug);
    expect(screen.getByRole("region", { name: "Compare this institution" })).toBeInTheDocument();
    expect(screen.getByText(/Yuanshen Road: odd-numbered/)).toBeInTheDocument();
    expect(screen.queryByText("Xuhui District")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Ask about these details" }));
    expect(mocks.open).toHaveBeenCalledWith({ hospitalName: clinic.nameEn, city: "Shanghai", source: "clinic_detail" });
  });

  it("passes the actual hospital and city to the consultation without pretending it is a doctor", () => {
    const clinic = STATIC_CLINICS[0];
    openPage(clinic.slug);
    fireEvent.click(screen.getByRole("button", { name: "Ask about this hospital" }));
    expect(mocks.open).toHaveBeenCalledWith({ hospitalName: clinic.nameEn, city: "Shanghai", source: "clinic_detail" });
    expect(mocks.open.mock.calls[0][0]).not.toHaveProperty("doctorName");
  });

  it("supports a directly opened dynamic hospital URL and links only its matching published experts", () => {
    const clinics = mergeClinicDirectory([linkedDoctor]);
    const clinic = clinics.find((item) => item.origin === "published")!;
    mocks.directory.mockReturnValue({ ...snapshot, clinics, doctors: [linkedDoctor, { ...linkedDoctor, id: "unrelated", name: "Unrelated expert" }] });
    openPage(clinic.slug);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(linkedDoctor.hospital);
    expect(screen.getByRole("link", { name: /Published Expert/ })).toHaveAttribute("href", "/doctors/profile/published-expert");
    expect(screen.queryByText("Unrelated expert")).not.toBeInTheDocument();
  });

  it("does not turn missing data or a failed request into fabricated hospital content", () => {
    openPage("not-a-hospital");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Hospital not found");
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
    expect(screen.queryByRole("button", { name: "Ask about this hospital" })).not.toBeInTheDocument();
  });

  it("offers retry after a dynamic lookup failure and does not show a false not-found", () => {
    mocks.directory.mockReturnValue({ ...snapshot, isError: true });
    openPage("unknown-dynamic");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("temporarily unavailable");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(mocks.refetch).toHaveBeenCalledOnce();
  });

  it("shows a loading state for direct dynamic links while keeping static pages available", () => {
    mocks.directory.mockReturnValue({ ...snapshot, isLoading: true });
    openPage("pending-dynamic");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Loading hospital details");
    cleanup();
    openPage(STATIC_CLINICS[0].slug);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(STATIC_CLINICS[0].nameEn);
  });

  it("changes the hospital display language without changing its canonical URL", () => {
    mocks.lang = "zh";
    const clinic = STATIC_CLINICS[0];
    openPage(clinic.slug);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(clinic.nameZh);
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", `https://celadonchina.com${getClinicPath(clinic)}`);
  });

  it("keeps photo source links outside hospital navigation links", () => {
    const clinic = STATIC_CLINICS.find((item) => item.nameZh === "上海华美医疗美容医院")!;
    const photo: RealHospitalPhoto = {
      hospitalZh: clinic.nameZh,
      src: "/private-clinic.webp",
      imgPath: "private-clinic.webp",
      author: "Original photographer",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceUrl: "https://example.com/source",
      description: "A private clinic exterior.",
      modifications: "Converted to WebP.",
    };
    vi.mocked(findRealHospitalPhoto).mockReturnValue(photo);
    render(<MemoryRouter><ul><ClinicCard clinic={clinic} city={CITIES.find((city) => city.slug === clinic.citySlug)!} /></ul></MemoryRouter>);
    expect(screen.getByRole("heading", { name: clinic.nameEn }).closest("a")).toHaveAttribute("href", getClinicPath(clinic));
    expect(screen.getByText("Photo credit").closest("a")).toBeNull();
    expect(document.querySelector("a a")).toBeNull();
  });
});

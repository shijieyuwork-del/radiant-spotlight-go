import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Doctors from "@/pages/Doctors";
import { DIRECTORY_DOCTOR_PORTRAIT_RETOUCHES, getDirectoryDoctorPortraitRetouch } from "@/data/directory-doctor-portrait-retouches";
import type { PublishedDoctor } from "@/hooks/use-published-doctors";

const mock = vi.hoisted(() => ({ doctors: [] as PublishedDoctor[] }));
vi.mock("@/hooks/use-published-doctors", () => ({ usePublishedDoctors: () => ({ doctors: mock.doctors, status: "ready", refresh: vi.fn() }) }));
vi.mock("@/lib/asia-i18n", () => ({ useAsia: () => ({ lang: "en", t: (key: string) => key }) }));
vi.mock("@/components/AsiaNavbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/PageMeta", () => ({ default: () => null }));
vi.mock("@/components/QuoteCtaButton", () => ({ default: () => <button>Start a consultation</button> }));
vi.mock("@/lib/geo", () => ({ cityCoordsOf: () => null, haversineKm: () => 0, useUserLocation: () => ({ coords: null, status: "idle", request: vi.fn() }) }));

afterEach(() => { cleanup(); sessionStorage.clear(); });
const rows = (): PublishedDoctor[] => Object.entries(DIRECTORY_DOCTOR_PORTRAIT_RETOUCHES).map(([id, entry], index) => ({
  id, name: `Expert ${index + 1}`, title: "Surgeon", city: "Shanghai", specialties: [], bio: "Published profile", photo_path: entry.sourcePath, photo: "",
}));
const renderDirectory = () => render(<MemoryRouter initialEntries={["/doctors"]}><Doctors /></MemoryRouter>);

describe("requested directory portrait refinements", () => {
  it("covers exactly the nine screenshot doctors with independent versioned assets", () => {
    expect(Object.keys(DIRECTORY_DOCTOR_PORTRAIT_RETOUCHES)).toHaveLength(9);
    expect(new Set(Object.values(DIRECTORY_DOCTOR_PORTRAIT_RETOUCHES).map(({ photo }) => photo)).size).toBe(9);
    expect(DIRECTORY_DOCTOR_PORTRAIT_RETOUCHES["13582f96-51c6-432d-ae88-6a8d468ec76d"].photo).toContain("yuan-ju.webp");
    expect(DIRECTORY_DOCTOR_PORTRAIT_RETOUCHES["64a2b418-ea5a-4ef5-9655-37bfac12b42d"].photo).toContain("li-bing.webp");
  });

  it.each(Object.entries(DIRECTORY_DOCTOR_PORTRAIT_RETOUCHES))("only refines the matching original for %s", (id, entry) => {
    expect(getDirectoryDoctorPortraitRetouch({ id, photo_path: entry.sourcePath })).toEqual(entry);
    expect(getDirectoryDoctorPortraitRetouch({ id, photo_path: "admin/replacement.webp" })).toBeUndefined();
    expect(getDirectoryDoctorPortraitRetouch({ id, photo_path: null })).toBeUndefined();
    expect(getDirectoryDoctorPortraitRetouch({ id, photo_path: entry.sourcePath, demo: true })).toBeUndefined();
  });

  it("renders all nine refined directory portraits before photo signing completes", () => {
    mock.doctors = rows();
    renderDirectory();
    expect(screen.getAllByRole("img")).toHaveLength(9);
    mock.doctors.forEach((doctor) => {
      const portrait = screen.getByRole("img", { name: doctor.name });
      expect(portrait).toHaveAttribute("src", DIRECTORY_DOCTOR_PORTRAIT_RETOUCHES[doctor.id].photo);
      expect(portrait.parentElement).toHaveClass("bg-[#e7e7e7]");
    });
  });

  it("immediately honors an admin replacement or removal", () => {
    const doctor = rows()[0];
    mock.doctors = [{ ...doctor, photo_path: "admin/replacement.webp", photo: "/replacement.webp" }];
    renderDirectory();
    expect(screen.getByRole("img", { name: doctor.name })).toHaveAttribute("src", "/replacement.webp");
    cleanup();
    mock.doctors = [{ ...doctor, photo_path: null, photo: "" }];
    renderDirectory();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

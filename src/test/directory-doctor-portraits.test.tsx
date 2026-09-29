import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Doctors from "@/pages/Doctors";
import { DIRECTORY_DOCTOR_PORTRAIT_RETOUCHES, getDirectoryDoctorPortraitRetouch } from "@/data/directory-doctor-portrait-retouches";
import { REMAINING_DOCTOR_PORTRAIT_RETOUCHES } from "@/data/remaining-doctor-portrait-retouches";
import { DOCTOR_PORTRAIT_RETOUCHES } from "@/data/doctor-portrait-retouches";
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
const rows = (offset = 0): PublishedDoctor[] => Object.entries(DIRECTORY_DOCTOR_PORTRAIT_RETOUCHES).slice(offset, offset + 9).map(([id, entry], index) => ({
  id, name: `Expert ${index + 1}`, title: "Surgeon", city: "Shanghai", specialties: [], bio: "Published profile", photo_path: entry.sourcePath, photo: "",
}));
const renderDirectory = () => render(<MemoryRouter initialEntries={["/doctors"]}><Doctors /></MemoryRouter>);

describe("requested directory portrait refinements", () => {
  it("covers the original nine and 98 remaining doctors with independent versioned assets", () => {
    expect(Object.keys(REMAINING_DOCTOR_PORTRAIT_RETOUCHES)).toHaveLength(98);
    expect(Object.keys(DIRECTORY_DOCTOR_PORTRAIT_RETOUCHES)).toHaveLength(107);
    expect(new Set(Object.values(DIRECTORY_DOCTOR_PORTRAIT_RETOUCHES).map(({ photo }) => photo)).size).toBe(107);
    expect(DIRECTORY_DOCTOR_PORTRAIT_RETOUCHES["13582f96-51c6-432d-ae88-6a8d468ec76d"].photo).toContain("yuan-ju.webp");
    expect(DIRECTORY_DOCTOR_PORTRAIT_RETOUCHES["64a2b418-ea5a-4ef5-9655-37bfac12b42d"].photo).toContain("li-bing.webp");
  });

  it("keeps the three exempt portraits untouched and shares other homepage portraits", () => {
    const excluded = ["6c64e796-bbc8-4500-8d28-53e191d3d1aa", "19cfa4fc-8608-4d98-b20e-beaebff32bc4", "65658e20-07d8-40d3-b366-edc0cf016542"];
    Object.entries(DOCTOR_PORTRAIT_RETOUCHES).forEach(([id, portrait]) => {
      if (excluded.includes(id)) {
        expect(DIRECTORY_DOCTOR_PORTRAIT_RETOUCHES[id]).toBeUndefined();
        expect(portrait.photo).toContain("/light-gray-v1/");
      } else {
        expect(DIRECTORY_DOCTOR_PORTRAIT_RETOUCHES[id]).toEqual(portrait);
      }
    });
  });

  it.each(Object.entries(DIRECTORY_DOCTOR_PORTRAIT_RETOUCHES))("only refines the matching original for %s", (id, entry) => {
    expect(getDirectoryDoctorPortraitRetouch({ id, photo_path: entry.sourcePath })).toEqual(entry);
    expect(getDirectoryDoctorPortraitRetouch({ id, photo_path: "admin/replacement.webp" })).toBeUndefined();
    expect(getDirectoryDoctorPortraitRetouch({ id, photo_path: null })).toBeUndefined();
    expect(getDirectoryDoctorPortraitRetouch({ id, photo_path: entry.sourcePath, demo: true })).toBeUndefined();
  });

  it.each([0, 9, 98])("renders refined directory portraits before photo signing completes, offset %i", (offset) => {
    mock.doctors = rows(offset);
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

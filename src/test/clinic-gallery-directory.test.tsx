import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Clinics from "@/pages/Clinics";
import { STATIC_CLINICS, getClinicPath } from "@/data/clinicDirectory";
const { directory } = vi.hoisted(() => ({ directory: vi.fn() }));
vi.mock("@/hooks/use-clinic-directory", () => ({ useClinicDirectory: directory }));
vi.mock("@/components/AsiaNavbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/lib/asia-i18n", () => ({ useAsia: () => ({ lang: "en" }) }));
afterEach(cleanup);
describe("public directory uses managed gallery data", () => {
  it("displays the saved cover and links to the complete hospital gallery", () => {
    const clinic = { ...STATIC_CLINICS[0], photoGallery: [{ kind: "upload" as const, path: "cover.jpg", url: "/saved-cover.jpg" }] };
    directory.mockReturnValue({ clinics: [clinic], isError: false });
    render(<MemoryRouter><Clinics /></MemoryRouter>);
    expect(screen.getByRole("img", { name: clinic.nameEn })).toHaveAttribute("src", "/saved-cover.jpg");
    expect(screen.getByRole("link", { name: `View ${clinic.nameEn}` })).toHaveAttribute("href", getClinicPath(clinic));
  });
  it("does not replace an empty gallery with a generic or original hospital photo", () => {
    const clinic = { ...STATIC_CLINICS[0], photoGallery: [] };
    directory.mockReturnValue({ clinics: [clinic], isError: false });
    render(<MemoryRouter><Clinics /></MemoryRouter>);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("Photo not available")).toBeInTheDocument();
  });
});

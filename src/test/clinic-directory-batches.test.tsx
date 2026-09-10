import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ComponentProps } from "react";
import { Link, MemoryRouter, useLocation } from "react-router-dom";
import Clinics from "@/pages/Clinics";
import { ClinicCard } from "@/components/clinics/ClinicCard";
import { STATIC_CLINICS, getClinicPath } from "@/data/clinicDirectory";
import { CITIES } from "@/data/cities";
import type { AsiaLang } from "@/lib/asia-i18n";
import type { RealHospitalPhoto } from "@/data/realHospitalPhotos";

const mocks = vi.hoisted(() => ({
  lang: "en" as AsiaLang,
  loading: false,
  error: false,
  refetch: vi.fn(),
  photo: undefined as RealHospitalPhoto | undefined,
  realCard: false,
}));
vi.mock("@/components/AsiaNavbar", () => ({ default: () => <nav aria-label="Site" /> }));
vi.mock("@/components/Footer", () => ({ default: () => <footer /> }));
vi.mock("@/components/PageMeta", () => ({ default: () => null }));
vi.mock("@/lib/asia-i18n", () => ({ useAsia: () => ({ lang: mocks.lang }) }));
vi.mock("@/data/realHospitalPhotos", () => ({ findRealHospitalPhoto: () => mocks.photo }));
vi.mock("@/components/clinics/ClinicCard", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/clinics/ClinicCard")>();
  return {
    ClinicCard: (props: ComponentProps<typeof actual.ClinicCard>) => mocks.realCard
      ? <actual.ClinicCard {...props} />
      : <li><Link data-clinic-primary-link to={getClinicPath(props.clinic)}><h2>{props.clinic.nameEn}</h2></Link></li>,
  };
});
vi.mock("@/hooks/use-clinic-directory", () => ({
  useClinicDirectory: () => ({ clinics: STATIC_CLINICS, isLoading: mocks.loading, isError: mocks.error, refetch: mocks.refetch }),
}));

const Location = () => <output data-testid="location">{useLocation().search}</output>;
const openDirectory = (path = "/clinics") => render(<MemoryRouter initialEntries={[path]}><Clinics /><Location /></MemoryRouter>);
const results = () => screen.getByRole("list", { name: "All hospitals and clinics" });
const cards = () => Array.from(document.querySelectorAll<HTMLLIElement>("#clinic-directory-results > li"));

beforeEach(() => {
  mocks.lang = "en";
  mocks.loading = false;
  mocks.error = false;
  mocks.photo = undefined;
  mocks.realCard = false;
  vi.clearAllMocks();
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(cleanup);

describe("clinic directory batches", () => {
  it("starts with 24 and reveals every nationwide facility without duplicates", async () => {
    openDirectory();
    expect(STATIC_CLINICS).toHaveLength(101);
    expect(cards()).toHaveLength(24);
    expect(screen.getByText("Showing 24 of 101 facilities")).toHaveAttribute("role", "status");

    for (const count of [48, 72, 96, 101]) {
      const firstNewIndex = cards().length;
      fireEvent.click(screen.getByRole("button", { name: /Show \d+ more facilities/ }));
      expect(cards()).toHaveLength(count);
      expect(screen.getByText(`Showing ${count} of 101 facilities`)).toBeVisible();
      await waitFor(() => expect(cards()[firstNewIndex].querySelector("[data-clinic-primary-link]")).toHaveFocus());
    }
    expect(screen.queryByRole("button", { name: /Show \d+ more facilities/ })).not.toBeInTheDocument();
    const paths = cards().map((card) => card.querySelector("[data-clinic-primary-link]")?.getAttribute("href"));
    expect(new Set(paths).size).toBe(101);
    expect(paths.sort()).toEqual(STATIC_CLINICS.map(getClinicPath).sort());
  });

  it("resets batches when a city or search changes and clears filters back to 24", () => {
    openDirectory("/clinics?page=3");
    expect(cards()).toHaveLength(72);
    const city = CITIES[1];
    fireEvent.click(screen.getByRole("button", { name: city.en }));
    const cityFacilities = STATIC_CLINICS.filter((clinic) => clinic.citySlug === city.slug);
    expect(cards()).toHaveLength(Math.min(24, cityFacilities.length));
    expect(screen.getByTestId("location")).toHaveTextContent(`?city=${city.slug}`);
    expect(screen.getByRole("button", { name: city.en })).toHaveAttribute("aria-pressed", "true");
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: cityFacilities[0].nameEn } });
    expect(cards()).toHaveLength(1);
    expect(within(results()).getByRole("heading", { name: cityFacilities[0].nameEn })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(cards()).toHaveLength(24);
    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(screen.getByTestId("location")).toBeEmptyDOMElement();
  });

  it("keeps the current batch in the URL and restores it on a direct revisit", () => {
    openDirectory("/clinics?q=Hospital");
    fireEvent.click(screen.getByRole("button", { name: "Show 24 more facilities" }));
    expect(screen.getByTestId("location")).toHaveTextContent("?q=Hospital&page=2");
    cleanup();
    openDirectory("/clinics?q=Hospital&page=2");
    expect(cards()).toHaveLength(48);
    expect(screen.getByRole("searchbox")).toHaveValue("Hospital");
  });

  it.each(["-1", "1.5", "invalid"])("defaults invalid batch %s to the first 24", (page) => {
    openDirectory(`/clinics?page=${page}`);
    expect(cards()).toHaveLength(24);
  });

  it("bounds an oversized batch to the real count and offers recovery from no results", () => {
    openDirectory("/clinics?page=999");
    expect(cards()).toHaveLength(101);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "not-a-matching-facility" } });
    expect(screen.getByText("Showing 0 of 0 facilities")).toBeVisible();
    expect(screen.queryByRole("list", { name: "All hospitals and clinics" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show all clinics" }));
    expect(cards()).toHaveLength(24);
  });

  it("keeps static facilities usable while additional profiles load or fail", () => {
    mocks.loading = true;
    openDirectory();
    expect(cards()).toHaveLength(24);
    expect(screen.getByText("Checking for additional published profiles…")).toHaveAttribute("role", "status");
    cleanup();
    mocks.loading = false;
    mocks.error = true;
    openDirectory();
    expect(cards()).toHaveLength(24);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(mocks.refetch).toHaveBeenCalledOnce();
  });

  it.each([
    ["en", "Showing 24 of 101 facilities", "Show 24 more facilities"],
    ["zh", "已显示 24 家，共 101 家机构", "再显示 24 家机构"],
    ["ru", "Показано 24 из 101 учреждений", "Показать ещё 24 учреждений"],
    ["es", "Mostrando 24 de 101 centros", "Mostrar 24 centros más"],
    ["th", "แสดง 24 จาก 101 สถานพยาบาล", "แสดงสถานพยาบาลอีก 24 แห่ง"],
    ["ms", "Memaparkan 24 daripada 101 pusat perubatan", "Lihat 24 lagi pusat perubatan"],
  ])("labels the count and reveal action in %s", (lang, count, action) => {
    mocks.lang = lang as AsiaLang;
    openDirectory();
    expect(screen.getByText(count)).toBeVisible();
    expect(screen.getByRole("button", { name: action })).toHaveAttribute("aria-controls", "clinic-directory-results");
  });
});

describe("clinic card content and credit alignment", () => {
  const clinic = STATIC_CLINICS[0];
  const city = CITIES.find((item) => item.slug === clinic.citySlug)!;
  const photo: RealHospitalPhoto = {
    hospitalZh: clinic.nameZh, src: "/verified-portrait.webp", imgPath: "verified-portrait.webp",
    author: "Original photographer", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Verified.jpg", description: "Original hospital portrait.",
    modifications: "Converted to WebP; full framing retained.", originalWidth: 900, originalHeight: 1200,
  };
  const openCard = () => {
    mocks.realCard = true;
    return render(<MemoryRouter><ul><ClinicCard clinic={clinic} city={city} /></ul></MemoryRouter>);
  };

  it("puts full identifying content before credits and keeps every source link independent", () => {
    mocks.photo = photo;
    const { container } = openCard();
    const heading = screen.getByRole("heading", { name: clinic.nameEn });
    const credit = screen.getByText("Photo credit");
    expect(heading.compareDocumentPosition(credit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(heading.closest("a")).toHaveAttribute("href", getClinicPath(clinic));
    expect(credit.closest("a")).toBeNull();
    expect(container.querySelector("a a")).toBeNull();
    expect(screen.getByRole("img")).toHaveStyle({ objectFit: "contain" });
    fireEvent.click(credit);
    expect(screen.getByText(photo.author).closest("a")).toHaveAttribute("href", photo.sourceUrl);
    expect(screen.getByText(photo.license).closest("a")).toHaveAttribute("href", photo.licenseUrl);
    expect(screen.getByText(photo.description)).toBeVisible();
    expect(screen.getByText(photo.modifications)).toBeVisible();
  });

  it("retains honest missing-media content and credit-row space when a photo fails", () => {
    mocks.photo = photo;
    const { container } = openCard();
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByText("Photo not available")).toBeVisible();
    expect(screen.getByRole("heading", { name: clinic.nameEn })).toBeVisible();
    expect(screen.queryByText("Photo credit")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelector("li")?.lastElementChild).toHaveAttribute("aria-hidden", "true");
  });
});

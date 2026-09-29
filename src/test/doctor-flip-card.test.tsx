import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DoctorFlipCard, type DoctorFlipCardData } from "@/components/home/DoctorFlipCard";
import { DOCTOR_PORTRAIT_RETOUCHES } from "@/data/doctor-portrait-retouches";

const doctor: DoctorFlipCardData = {
  id: "published-expert",
  name: "Published Expert",
  title: "Plastic Surgery Specialist",
  city: "Shanghai",
  specialties: ["Specialty one", "Specialty two", "Specialty three"],
  bio: "The expert's complete published introduction.",
  photo: "/expert.jpg",
};
const marketingLine = "Explore this expert's documented patient cases.";

function renderCard(overrides: Partial<DoctorFlipCardData> = {}) {
  return render(
    <MemoryRouter>
      <DoctorFlipCard
        doctor={{ ...doctor, ...overrides }}
        marketingLine={marketingLine}
        viewProfileLabel="View expert profile"
        detailsLabel="Meet this expert"
        backLabel="Back to card"
        profileLabel="Expert profile"
        bioFallback="Visit the full profile for details."
      />
    </MemoryRouter>,
  );
}

afterEach(cleanup);

describe("concise homepage doctor cards", () => {
  it("fits the complete portrait high in the frame so overlay text stays below the eyes", () => {
    renderCard();
    const portrait = screen.getByRole("img", { name: doctor.name });
    expect(portrait).toHaveClass("object-contain", "object-top", "h-full", "w-auto");
    expect(portrait).not.toHaveClass("object-cover", "object-center");
    expect(portrait.parentElement).toHaveClass("absolute", "inset-0", "items-center", "justify-center");
    expect(portrait.parentElement).toHaveClass("bg-card");
    expect(portrait.parentElement).not.toHaveClass("bg-[#e7e7e7]");
    expect(portrait).toHaveStyle({ transform: "translateX(0%)" });
  });

  it.each(Object.entries(DOCTOR_PORTRAIT_RETOUCHES))("uses the gray portrait for %s without waiting for a signed URL", (id, retouch) => {
    renderCard({ id, photo_path: retouch.sourcePath, photo: "" });
    const portrait = screen.getByRole("img", { name: doctor.name });
    expect(portrait).toHaveAttribute("src", retouch.photo);
    expect(portrait).toHaveClass("w-full", "h-full", "object-contain", "object-top");
    expect(portrait.parentElement).toHaveClass("bg-card");
  });

  it("respects replacement and removal of a doctor's original photo in admin", () => {
    const id = Object.keys(DOCTOR_PORTRAIT_RETOUCHES)[0];
    renderCard({ id, photo_path: "admin/new-portrait.webp", photo: "/new-portrait.webp" });
    expect(screen.getByRole("img", { name: doctor.name })).toHaveAttribute("src", "/new-portrait.webp");
    cleanup();
    renderCard({ id, photo_path: null, photo: "" });
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("keeps the three excluded doctors on their unchanged background-only portraits", () => {
    expect(DOCTOR_PORTRAIT_RETOUCHES["6c64e796-bbc8-4500-8d28-53e191d3d1aa"].photo).toBe("/images/doctors/light-gray-v1/ning-jin.webp");
    expect(DOCTOR_PORTRAIT_RETOUCHES["19cfa4fc-8608-4d98-b20e-beaebff32bc4"].photo).toBe("/images/doctors/light-gray-v1/li-lin.webp");
    expect(DOCTOR_PORTRAIT_RETOUCHES["65658e20-07d8-40d3-b366-edc0cf016542"].photo).toBe("/images/doctors/light-gray-v1/xun-wang.webp");
  });

  it.each([
    ["78b0fec5-0a51-4b54-88bf-a5de66e0c67e", -6],
    ["64a2b418-ea5a-4ef5-9655-37bfac12b42d", 1],
    ["313fb63c-2904-44d7-b12d-2447c0ea1ce1", 12],
    ["c4188a03-c11e-4543-8deb-ea91c6dd5e85", 6],
    ["e1be754d-aa22-4ca6-913e-ed1ceab3cd8b", 1],
    ["3676bf83-40ed-4503-bca2-e9184062384e", 23],
  ])("optically centers the original portrait for %s", (id, offset) => {
    renderCard({ id: String(id) });
    expect(screen.getByRole("img", { name: doctor.name })).toHaveStyle({ transform: `translateX(${offset}%)` });
  });

  it("shows title, focus areas and a concise quote over the portrait", () => {
    const { container } = renderCard();
    expect(screen.getByRole("heading", { name: doctor.name })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: doctor.name })).toBeInTheDocument();
    expect(screen.getAllByText(doctor.title)).toHaveLength(2);
    expect(screen.getAllByText(`“${marketingLine}”`)).toHaveLength(1);
    expect(screen.getByText(marketingLine)).toBeInTheDocument();
    expect(screen.getByText(doctor.bio!)).toBeInTheDocument();
    expect(screen.getByText(doctor.specialties[0])).toBeInTheDocument();
    expect(screen.getByText(doctor.specialties[1])).toBeInTheDocument();
    expect(screen.queryByText(doctor.specialties[2])).not.toBeInTheDocument();
    expect(screen.getByLabelText("Areas of focus")).toBeInTheDocument();
    expect(container.querySelector(".bg-accent")).toBeNull();
    expect(screen.getAllByRole("link", { hidden: true })).toHaveLength(2);
    screen.getAllByRole("link", { hidden: true }).forEach((link) => {
      expect(link).toHaveAttribute("href", "/doctors/profile/published-expert");
    });
  });

  it("keeps readable type and the full biography on the compact card's back", () => {
    const { container } = renderCard();
    const front = container.querySelector(".doctor-flip-card__face--front")!;
    const back = container.querySelector(".doctor-flip-card__face--back")!;
    expect(screen.getByRole("article")).toHaveClass("min-h-[410px]");
    expect(screen.getByRole("heading", { name: doctor.name })).toHaveClass("text-[22px]");
    expect(screen.getByRole("img").parentElement).toHaveClass("absolute", "inset-0");
    expect(front).toHaveTextContent(marketingLine);
    expect(back).toHaveTextContent(marketingLine);
    expect(screen.getByRole("button", { name: "Meet this expert" })).toHaveClass("size-10");
    fireEvent.click(screen.getByRole("button", { name: "Meet this expert" }));
    expect(screen.getByText(marketingLine)).toBeVisible();
    expect(screen.getByText(doctor.bio!)).toBeVisible();
  });

  it("preserves manual flipping, focus transfer and a single accessible face", () => {
    renderCard();
    const article = screen.getByRole("article");
    const opener = screen.getByRole("button", { name: "Meet this expert" });
    const focus = vi.spyOn(HTMLElement.prototype, "focus");
    fireEvent.click(opener);
    expect(article).toHaveAttribute("data-flipped", "true");
    expect(screen.getByRole("button", { name: "Back to card" })).toHaveFocus();
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: true });
    expect(opener).toHaveAttribute("tabindex", "-1");
    expect(screen.getAllByRole("link")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Back to card" }));
    expect(article).toHaveAttribute("data-flipped", "false");
    expect(opener).toHaveFocus();
    expect(screen.getAllByRole("link")).toHaveLength(1);
    focus.mockRestore();
  });

  it("preserves mouse hover flipping without treating touch as hover", () => {
    renderCard();
    const article = screen.getByRole("article");
    const pointer = (type: string, pointerType: string) => {
      const event = new MouseEvent(type, { bubbles: true });
      Object.defineProperty(event, "pointerType", { value: pointerType });
      fireEvent(article, event);
    };
    pointer("pointerover", "touch");
    expect(article).toHaveAttribute("data-flipped", "false");
    pointer("pointerover", "mouse");
    expect(article).toHaveAttribute("data-flipped", "true");
    pointer("pointerout", "mouse");
    expect(article).toHaveAttribute("data-flipped", "false");
  });

  it("keeps the biography fallback and demo profile route", () => {
    renderCard({ bio: " ", demo: true });
    expect(screen.getByText("Visit the full profile for details.")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/doctors/demo/published-expert");
  });
});

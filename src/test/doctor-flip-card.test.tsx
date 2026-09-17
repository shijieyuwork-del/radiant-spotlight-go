import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DoctorFlipCard, type DoctorFlipCardData } from "@/components/home/DoctorFlipCard";

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
  it("keeps the key introduction without rendering specialty chips on either face", () => {
    const { container } = renderCard();
    expect(screen.getByRole("heading", { name: doctor.name })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: doctor.name })).toBeInTheDocument();
    expect(screen.getByText(doctor.title)).toBeInTheDocument();
    expect(screen.getByText(marketingLine)).toBeInTheDocument();
    expect(screen.getByText(doctor.bio!)).toBeInTheDocument();
    doctor.specialties.forEach((specialty) => expect(screen.queryByText(specialty)).not.toBeInTheDocument());
    expect(screen.queryByText("Areas of focus")).not.toBeInTheDocument();
    expect(container.querySelector(".bg-accent")).toBeNull();
    expect(screen.getAllByRole("link", { hidden: true })).toHaveLength(2);
    screen.getAllByRole("link", { hidden: true }).forEach((link) => {
      expect(link).toHaveAttribute("href", "/doctors/profile/published-expert");
    });
  });

  it("preserves manual flipping, focus transfer and a single accessible face", () => {
    renderCard();
    const article = screen.getByRole("article");
    const opener = screen.getByRole("button", { name: "Meet this expert" });
    fireEvent.click(opener);
    expect(article).toHaveAttribute("data-flipped", "true");
    expect(screen.getByRole("button", { name: "Back to card" })).toHaveFocus();
    expect(opener).toHaveAttribute("tabindex", "-1");
    expect(screen.getAllByRole("link")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Back to card" }));
    expect(article).toHaveAttribute("data-flipped", "false");
    expect(opener).toHaveFocus();
    expect(screen.getAllByRole("link")).toHaveLength(1);
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

import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ClinicConciergeIntro } from "@/components/clinics/ClinicConciergeIntro";

vi.mock("@/lib/asia-i18n", () => ({ useAsia: () => ({ lang: "en" }) }));

afterEach(cleanup);

describe("clinic concierge introduction", () => {
  it("keeps the English summary short without losing comparison, support or direct payment", () => {
    render(<MemoryRouter><ClinicConciergeIntro /></MemoryRouter>);

    const summary = screen.getByText(/^Compare hospitals and clinics with CeladonChina\./).textContent!;
    expect(summary.split(/\s+/).length).toBeLessThanOrEqual(26);
    expect(summary).toContain("One team for appointments and support in China.");
    expect(summary).toContain("Pay medical fees directly to your provider.");
    expect(screen.queryByText(/Tell us what you are considering/)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See $200 deposit terms" })).toHaveAttribute("href", "/travel-packages#payment-terms");
  });
});

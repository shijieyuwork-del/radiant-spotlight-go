import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { CoordinationPaymentInfo } from "@/components/CoordinationPaymentInfo";
import { COORDINATION_DEPOSIT_USD, COORDINATION_POLICY } from "@/data/coordination-policy";
import type { AsiaLang } from "@/lib/asia-i18n";

const mocks = vi.hoisted(() => ({ lang: "en" as AsiaLang, open: vi.fn() }));
vi.mock("@/lib/asia-i18n", () => ({ useAsia: () => ({ lang: mocks.lang }) }));
vi.mock("@/components/QuoteRequest", () => ({ useQuote: () => ({ open: mocks.open }) }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe("coordination payment information", () => {
  it.each(Object.keys(COORDINATION_POLICY) as AsiaLang[])("keeps support, deposit, refund and cancellation together in %s", (lang) => {
    mocks.lang = lang;
    const copy = COORDINATION_POLICY[lang];
    render(<CoordinationPaymentInfo />);
    const section = screen.getByRole("region", { name: copy.heading });
    expect(within(section).getByText(copy.freeText)).toBeVisible();
    expect(within(section).getByText(copy.depositTitle)).toBeVisible();
    expect(within(section).getByText(copy.refund)).toBeVisible();
    expect(within(section).getByText(copy.collection)).toBeVisible();
    expect(within(section).getByText(copy.cancellation)).toBeVisible();
    expect(copy.depositTitle).toContain(String(COORDINATION_DEPOSIT_USD));
    expect(copy.refund).toContain(String(COORDINATION_DEPOSIT_USD));
    for (const value of Object.values(copy)) expect(value.trim()).not.toBe("");
  });

  it("opens a terms inquiry without taking payment or silently promising cancellation refunds", () => {
    mocks.lang = "en";
    render(<CoordinationPaymentInfo />);
    fireEvent.click(screen.getByRole("button", { name: "Confirm payment terms" }));
    expect(mocks.open).toHaveBeenCalledWith({ source: "coordination_payment_terms" });
    expect(COORDINATION_POLICY.en.refund).toBe("Your $200 coordination deposit is returned on the day of your surgery.");
    expect(COORDINATION_POLICY.en.cancellation).toContain("terms in writing");
    expect(document.body).not.toHaveTextContent(/12 months|refunded when you pay the clinic|non-refundable|cancel anytime/i);
  });
});

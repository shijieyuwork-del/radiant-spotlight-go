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
  it.each(Object.keys(COORDINATION_POLICY) as AsiaLang[])("separates the free conversation from the deposit while keeping payment terms together in %s", (lang) => {
    mocks.lang = lang;
    const copy = COORDINATION_POLICY[lang];
    render(<CoordinationPaymentInfo />);
    const section = screen.getByRole("region", { name: copy.heading });
    const conversationCard = within(section).getByRole("heading", { name: copy.initialTitle }).closest("article")!;
    const depositCard = within(section).getByRole("heading", { name: copy.depositTitle }).closest("article")!;
    expect(conversationCard).not.toBe(depositCard);
    expect(within(conversationCard).getByText(copy.initialText)).toBeVisible();
    expect(within(conversationCard).getByText(copy.freeText)).toBeVisible();
    expect(within(depositCard).getByText(copy.depositSummary)).toBeVisible();
    expect(within(depositCard).getByText(copy.cancellation)).toBeVisible();
    expect(within(section).getByText(copy.medical)).toBeVisible();
    expect(within(section).getByText(copy.separateCosts)).toBeVisible();
    expect(copy.depositTitle).toContain(String(COORDINATION_DEPOSIT_USD));
    expect(copy.collection).toContain(String(COORDINATION_DEPOSIT_USD));
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
    expect(COORDINATION_POLICY.en.depositSummary).toBe("Collected before departure for China. Returned on surgery day. If you cancel, it can be held for one year. Other circumstances are confirmed in writing.");
    expect(document.body).not.toHaveTextContent(/refunded when you pay the clinic|non-refundable|cancel anytime|forfeit/i);
  });

  it("states the confirmed collection time and cancellation hold in every language", () => {
    const expected: Record<AsiaLang, [string, string]> = {
      en: ["before you depart for China", "If you cancel, your deposit can be held for one year."],
      zh: ["赴中国前收取", "取消后，押金可以保留一年。"],
      ru: ["до выезда в Китай", "При отмене депозит можно сохранить на один год."],
      es: ["antes de tu salida hacia China", "Si cancelas, tu depósito puede mantenerse durante un año."],
      th: ["ก่อนที่คุณจะออกเดินทางไปจีน", "หากยกเลิก สามารถเก็บเงินมัดจำไว้ได้หนึ่งปี"],
      ms: ["sebelum anda berlepas ke China", "Jika anda membatalkan, deposit boleh disimpan selama satu tahun."],
      // Vietnamese policy copy falls back to English until it is translated.
      vi: ["before you depart for China", "If you cancel, your deposit can be held for one year."],
    };
    for (const lang of Object.keys(expected) as AsiaLang[]) {
      const [collection, cancellation] = expected[lang];
      expect(COORDINATION_POLICY[lang].collection).toContain(collection);
      expect(COORDINATION_POLICY[lang].cancellation).toContain(cancellation);
    }
    expect(COORDINATION_POLICY.en.collection).not.toContain("confirm when");
    expect(COORDINATION_POLICY.en.cancellation).toContain("end of the one-year hold");
  });
});

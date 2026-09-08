import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ConsultationHandoff from "@/components/ConsultationHandoff";
import { AsiaI18nProvider, type AsiaLang } from "@/lib/asia-i18n";
import { consultationHandoffCopy, consultationHandoffUrl, consultationMessage } from "@/lib/consultation-handoff";

const context = { doctorName: "Expert & partner", hospitalName: "Clinic A", procedure: "Nose / face", city: "上海" };
const copyText = vi.fn();
const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");

beforeEach(() => {
  localStorage.clear();
  copyText.mockReset().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: copyText } });
});
afterEach(() => {
  cleanup();
  if (originalClipboard) Object.defineProperty(navigator, "clipboard", originalClipboard);
  else Reflect.deleteProperty(navigator, "clipboard");
});

const renderHandoff = (lang: AsiaLang = "en") => {
  localStorage.setItem("glowy.asia.v1", JSON.stringify({ lang, currency: "USD" }));
  return render(<AsiaI18nProvider><ConsultationHandoff method="email" context={context} onBack={() => {}} onOpenApp={() => {}} /></AsiaI18nProvider>);
};

describe("consultation handoff recovery", () => {
  it("encodes the same complete context for email and WhatsApp", () => {
    for (const method of ["email", "whatsapp"] as const) {
      const url = new URL(consultationHandoffUrl(method, context));
      expect(url.searchParams.get(method === "email" ? "body" : "text")).toBe(consultationMessage(context));
      expect(url.searchParams.get(method === "email" ? "body" : "text")).toContain("Hospital: Clinic A");
    }
  });
  it.each(["en", "zh", "ru", "es", "th", "ms"] as AsiaLang[])("has localized recovery controls in %s", (lang) => {
    renderHandoff(lang);
    const copy = consultationHandoffCopy[lang];
    expect(screen.getByRole("heading", { name: copy.emailHeading })).toHaveFocus();
    expect(screen.getByText(copy.notSent)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: copy.copyMessage })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: copy.copyContact })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: copy.message })).toHaveValue(consultationMessage(context));
    expect(screen.getByRole("link", { name: copy.openEmail })).toHaveAttribute("href", consultationHandoffUrl("email", context));
  });
  it("copies the draft and contact details, confirming each action in place", async () => {
    renderHandoff();
    fireEvent.click(screen.getByRole("button", { name: "Copy message" }));
    await screen.findByRole("button", { name: "Message copied" });
    expect(copyText).toHaveBeenLastCalledWith(consultationMessage(context));
    expect(screen.getByRole("status")).toHaveTextContent("Message copied");
    fireEvent.click(screen.getByRole("button", { name: "Copy contact details" }));
    await screen.findByRole("button", { name: "Contact details copied" });
    expect(copyText).toHaveBeenLastCalledWith("contact@celadonchina.com");
  });
  it("keeps a visitor's typed question and care-plan details in the draft, retry link and copied message", async () => {
    const message = "Procedure: Rhinoplasty\nBudget: $2,000–$5,000\nMy question: Can you coordinate translation?";
    const url = `mailto:contact@celadonchina.com?body=${encodeURIComponent(message)}`;
    const onBack = vi.fn();
    render(<AsiaI18nProvider><ConsultationHandoff method="email" context={context}
      draft={{ message, url }} labels={{ back: "Edit my details", openApp: "Open email draft", message: "Review your message" }}
      onBack={onBack} onOpenApp={() => {}} /></AsiaI18nProvider>);
    expect(screen.getByRole("textbox", { name: "Review your message" })).toHaveValue(message);
    expect(screen.getByRole("link", { name: "Open email draft" })).toHaveAttribute("href", url);
    fireEvent.click(screen.getByRole("button", { name: "Copy message" }));
    await screen.findByRole("button", { name: "Message copied" });
    expect(copyText).toHaveBeenLastCalledWith(message);
    fireEvent.click(screen.getByRole("button", { name: "Edit my details" }));
    expect(onBack).toHaveBeenCalledOnce();
  });
  it.each(["Copy message", "Copy contact details"])("preserves selectable text when %s is denied", async (name) => {
    copyText.mockRejectedValue(new Error("Permission denied"));
    renderHandoff();
    fireEvent.click(screen.getByRole("button", { name }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Couldn’t copy automatically"));
    const text = screen.getByRole("textbox", { name: name === "Copy message" ? "Message draft" : "Contact details" });
    expect(text).toHaveFocus();
    expect(text).toHaveAttribute("readonly");
    expect(screen.queryByRole("button", { name: /copied$/ })).not.toBeInTheDocument();
  });
  it("offers manual recovery without the Clipboard API", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
    renderHandoff();
    fireEvent.click(screen.getByRole("button", { name: "Copy message" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Select the message or contact details"));
  });
});

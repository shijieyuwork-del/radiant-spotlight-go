import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QuoteProvider, useQuote, type QuoteContext } from "@/components/QuoteRequest";
import { AsiaI18nProvider, type AsiaLang } from "@/lib/asia-i18n";
import { consultationPickerCopy } from "@/lib/consultation-picker-copy";

const mocks = vi.hoisted(() => ({ from: vi.fn(), invoke: vi.fn(), track: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: mocks.from, functions: { invoke: mocks.invoke } } }));
vi.mock("@/lib/analytics", () => ({ trackEvent: mocks.track }));
const originalLocation = window.location;
let location: { href: string };
const Open = ({ context }: { context?: QuoteContext }) => {
  const { open } = useQuote();
  return <button onClick={() => open(context)}>Open planning</button>;
};
const openDialog = (context?: QuoteContext, lang: AsiaLang = "en") => {
  localStorage.setItem("glowy.asia.v1", JSON.stringify({ lang, currency: "USD" }));
  render(<AsiaI18nProvider><QuoteProvider><Open context={context} /></QuoteProvider></AsiaI18nProvider>);
  const opener = screen.getByRole("button", { name: "Open planning" });
  opener.focus();
  fireEvent.click(opener);
  return within(screen.getByRole("dialog"));
};
const submit = () => fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);
const emailBody = () => new URL(location.href).searchParams.get("body")!;

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  location = { href: "" };
  Object.defineProperty(window, "location", { configurable: true, value: location });
  vi.spyOn(window, "open").mockReturnValue({} as Window);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  Object.defineProperty(window, "location", { configurable: true, value: originalLocation });
});

describe("two consultation paths", () => {
  it("lets question visitors give only an email and question, validates them, and accurately describes the handoff", async () => {
    const dialog = openDialog({ intent: "question" });
    expect(dialog.getAllByRole("textbox")).toHaveLength(2);
    expect(dialog.queryByRole("combobox")).not.toBeInTheDocument();
    expect(dialog.queryByLabelText(/name|country|procedure/i)).not.toBeInTheDocument();
    submit();
    expect(dialog.getByText(consultationPickerCopy.en.emailError)).toBeInTheDocument();
    expect(dialog.getByText(consultationPickerCopy.en.questionError)).toBeInTheDocument();
    await waitFor(() => expect(dialog.getByLabelText("Email address")).toHaveFocus());
    expect(location.href).toBe("");
    fireEvent.change(dialog.getByLabelText("Email address"), { target: { value: "visitor@example.com" } });
    fireEvent.change(dialog.getByLabelText("Your question"), { target: { value: "Is initial planning free?" } });
    submit();
    expect(emailBody()).toContain("Your question: Is initial planning free?");
    expect(emailBody()).not.toMatch(/Name:|Traveling from:|Procedure:/);
    expect(dialog.getByRole("heading", { name: "Your message is ready" })).toHaveFocus();
    expect(dialog.getByText(consultationPickerCopy.en.readyDescription)).toBeInTheDocument();
    expect(dialog.getByRole("link", { name: "Open email draft" })).toHaveAttribute("href", location.href);
    expect(mocks.from).not.toHaveBeenCalled();
    expect(mocks.invoke).not.toHaveBeenCalled();
    expect(mocks.track.mock.calls.map(([name]) => name)).not.toContain("generate_lead");
    expect(JSON.stringify(mocks.track.mock.calls)).not.toContain("visitor@example.com");
    expect(JSON.stringify(mocks.track.mock.calls)).not.toContain("Is initial planning free?");
  });

  it("requires only the chosen WhatsApp contact and preserves context and a recoverable message when a popup handle is unavailable", () => {
    vi.mocked(window.open).mockReturnValue(null);
    const dialog = openDialog({ intent: "question", doctorName: "Dr Lin", hospitalName: "Listed Clinic", procedure: "Rhinoplasty", city: "Shanghai" });
    fireEvent.click(dialog.getByRole("radio", { name: "WhatsApp" }));
    expect(dialog.queryByLabelText("Email address")).not.toBeInTheDocument();
    fireEvent.change(dialog.getByLabelText("WhatsApp number"), { target: { value: "1234" } });
    fireEvent.change(dialog.getByLabelText("Your question"), { target: { value: "How do I arrange a consultation?" } });
    submit();
    expect(dialog.getByRole("alert")).toHaveTextContent(consultationPickerCopy.en.phoneError);
    expect(window.open).not.toHaveBeenCalled();
    fireEvent.change(dialog.getByLabelText("WhatsApp number"), { target: { value: "+44 7700 900123" } });
    submit();
    const url = new URL(vi.mocked(window.open).mock.calls[0][0] as string);
    expect(url.origin + url.pathname).toBe("https://wa.me/14708613825");
    const message = url.searchParams.get("text")!;
    for (const text of ["Expert: Dr Lin", "Clinic or hospital: Listed Clinic", "Procedure: Rhinoplasty", "City in China: Shanghai", "WhatsApp number: +44 7700 900123"]) expect(message).toContain(text);
    expect(dialog.getByRole("link", { name: "Open WhatsApp message" })).toHaveAttribute("href", url.href);
    expect(location.href).toBe("");
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("prepares a care plan with the supplied provider and selected planning details", () => {
    const dialog = openDialog({ intent: "care_plan", doctorName: "Dr Lin", hospitalName: "Listed Clinic", procedure: "Rhinoplasty", city: "Beijing" });
    expect(dialog.getByLabelText("Procedure")).toHaveValue("Rhinoplasty");
    expect(dialog.getByLabelText("City in China")).toHaveValue("Beijing");
    fireEvent.change(dialog.getByLabelText("Email address"), { target: { value: "planner@example.com" } });
    fireEvent.change(dialog.getByLabelText("Procedure budget (USD)"), { target: { value: "1" } });
    fireEvent.change(dialog.getByLabelText("Travel timing"), { target: { value: "2" } });
    fireEvent.change(dialog.getByLabelText("Questions or goals (optional)"), { target: { value: "I need translation during my visit." } });
    submit();
    for (const text of ["Expert: Dr Lin", "Clinic or hospital: Listed Clinic", "Procedure: Rhinoplasty", "City in China: Beijing", "Procedure budget (USD): $2,000–$5,000", "Travel timing: In 6–12 months", "I need translation during my visit."]) expect(emailBody()).toContain(text);
    expect(emailBody()).not.toContain("Your question:");
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("accepts uncertainty for every care-plan detail and limits locations to current China service areas", () => {
    const dialog = openDialog({ intent: "care_plan", city: "Seoul" });
    expect(dialog.getByLabelText("City in China")).toHaveValue("");
    expect(dialog.queryByRole("option", { name: "Seoul" })).not.toBeInTheDocument();
    fireEvent.change(dialog.getByLabelText("Email address"), { target: { value: "planner@example.com" } });
    submit();
    expect(dialog.getByRole("alert")).toHaveTextContent(consultationPickerCopy.en.procedureError);
    fireEvent.click(dialog.getByRole("button", { name: "Not sure yet" }));
    submit();
    for (const label of ["Procedure", "Procedure budget (USD)", "City in China", "Travel timing"]) expect(emailBody()).toContain(`${label}: Not sure yet`);
    expect(emailBody()).not.toContain("Seoul");
  });

  it("preserves edits between paths, excludes unrelated answers, and clears private drafts for a new opening", async () => {
    const dialog = openDialog();
    fireEvent.click(dialog.getByRole("button", { name: /Ask a question/ }));
    fireEvent.change(dialog.getByLabelText("Email address"), { target: { value: "visitor@example.com" } });
    fireEvent.change(dialog.getByLabelText("Your question"), { target: { value: "Only for the question path" } });
    fireEvent.click(dialog.getByRole("button", { name: "Change request type" }));
    fireEvent.click(dialog.getByRole("button", { name: /Get a care plan/ }));
    expect(dialog.getByLabelText("Email address")).toHaveValue("visitor@example.com");
    fireEvent.click(dialog.getByRole("button", { name: "Not sure yet" }));
    submit();
    expect(emailBody()).not.toContain("Only for the question path");
    fireEvent.click(dialog.getByRole("button", { name: "Edit my details" }));
    expect(dialog.getByLabelText("Email address")).toHaveValue("visitor@example.com");
    fireEvent.click(dialog.getByRole("button", { name: "Close" }));
    const opener = screen.getByRole("button", { name: "Open planning" });
    await waitFor(() => expect(opener).toHaveFocus());
    fireEvent.click(opener);
    fireEvent.click(screen.getByRole("button", { name: /Ask a question/ }));
    expect(screen.getByLabelText("Email address")).toHaveValue("");
    expect(screen.getByLabelText("Your question")).toHaveValue("");
  });

  it("keeps an editable draft and a manual handoff link if the app cannot open", () => {
    vi.mocked(window.open).mockImplementation(() => { throw new Error("Blocked"); });
    const dialog = openDialog({ intent: "question" });
    fireEvent.click(dialog.getByRole("radio", { name: "WhatsApp" }));
    fireEvent.change(dialog.getByLabelText("WhatsApp number"), { target: { value: "+44 7700 900123" } });
    fireEvent.change(dialog.getByLabelText("Your question"), { target: { value: "Please explain the next step." } });
    submit();
    expect(dialog.getByRole("alert")).toHaveTextContent(consultationPickerCopy.en.openError);
    expect((dialog.getByLabelText("Review your message") as HTMLTextAreaElement).value).toContain("Please explain the next step.");
    expect(dialog.getByRole("link", { name: "Open WhatsApp message" })).toBeInTheDocument();
    fireEvent.click(dialog.getByRole("button", { name: "Edit my details" }));
    expect(dialog.getByLabelText("Your question")).toHaveValue("Please explain the next step.");
    expect(dialog.queryByRole("alert")).not.toBeInTheDocument();
  });

  it.each(["en", "zh", "ru", "es", "th", "ms"] as AsiaLang[])("localizes both paths, validation and the prepared message in %s", (lang) => {
    const copy = consultationPickerCopy[lang];
    const dialog = openDialog(undefined, lang);
    fireEvent.click(dialog.getByRole("button", { name: new RegExp(copy.questionTitle) }));
    expect(dialog.getByRole("heading", { name: copy.questionTitle })).toBeInTheDocument();
    submit();
    expect(dialog.getByText(copy.questionError)).toBeInTheDocument();
    fireEvent.change(dialog.getByLabelText(copy.emailAddress), { target: { value: "visitor@example.com" } });
    fireEvent.change(dialog.getByLabelText(copy.questionLabel), { target: { value: "A question" } });
    submit();
    expect(emailBody()).toContain(copy.questionMessage);
    expect(dialog.getByRole("heading", { name: copy.ready })).toBeInTheDocument();
    fireEvent.click(dialog.getByRole("button", { name: copy.edit }));
    fireEvent.click(dialog.getByRole("button", { name: copy.back }));
    fireEvent.click(dialog.getByRole("button", { name: new RegExp(copy.carePlanTitle) }));
    for (const label of [copy.procedure, copy.budget, copy.city, copy.timing, copy.notes]) expect(dialog.getByLabelText(label)).toBeInTheDocument();
    fireEvent.click(dialog.getByRole("button", { name: copy.notSure }));
    submit();
    expect(emailBody()).toContain(copy.carePlanMessage);
    expect(emailBody()).toContain(`${copy.procedure}: ${copy.notSure}`);
  });
});

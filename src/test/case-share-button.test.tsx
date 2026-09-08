import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CaseShareButton } from "@/components/CaseShareButton";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const renderShare = () => render(<CaseShareButton href="/cases/diary-1" title="Recovery diary" lang="en" />);
describe("case sharing", () => {
  it("uses native share with the public canonical case URL", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", { configurable: true, value: share });
    renderShare();
    fireEvent.click(screen.getByRole("button", { name: "Share this case" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Share completed");
    expect(share).toHaveBeenCalledWith({ title: "Recovery diary", url: "https://celadonchina.com/cases/diary-1" });
  });
  it("copies the public link when native sharing is unavailable", async () => {
    Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    renderShare();
    fireEvent.click(screen.getByRole("button", { name: "Share this case" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Link copied");
    expect(writeText).toHaveBeenCalledWith("https://celadonchina.com/cases/diary-1");
  });
  it("provides a selectable link if both native sharing and clipboard fail", async () => {
    Object.defineProperty(navigator, "share", { configurable: true, value: vi.fn().mockRejectedValue(new Error("Unavailable")) });
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) } });
    renderShare();
    fireEvent.click(screen.getByRole("button", { name: "Share this case" }));
    const input = await screen.findByRole("textbox", { name: "Case link" });
    expect(input).toHaveValue("https://celadonchina.com/cases/diary-1");
    fireEvent.focus(input);
    expect((input as HTMLInputElement).selectionStart).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.getByRole("button", { name: "Share this case" })).toHaveFocus();
  });
  it("treats native share cancellation as cancellation, not an error or copy", async () => {
    Object.defineProperty(navigator, "share", { configurable: true, value: vi.fn().mockRejectedValue(new DOMException("Cancelled", "AbortError")) });
    const writeText = vi.fn();
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    renderShare();
    fireEvent.click(screen.getByRole("button", { name: "Share this case" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Share this case" })).not.toBeDisabled());
    expect(writeText).not.toHaveBeenCalled();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});

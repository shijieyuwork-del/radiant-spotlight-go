import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MedoraImportCard from "@/components/MedoraImportCard";

const state = vi.hoisted(() => ({ invoke: vi.fn(), cover: vi.fn(), imported: 0 }));
vi.mock("@/lib/browser-client", () => ({ getBrowserClient: async () => ({ functions: { invoke: state.invoke } }) }));
vi.mock("@/lib/medora-cover", () => ({ createMedoraCover: state.cover }));
beforeEach(() => {
  vi.clearAllMocks();
  state.imported = 0;
  state.cover.mockResolvedValue("data:image/webp;base64,d2VicA==");
  state.invoke.mockImplementation(async (_name: string, { body }: { body: Record<string, unknown> }) => {
    if (body.action === "status") return { data: { total: 6, imported: state.imported } };
    if (body.action === "set-cover") return { data: { ok: true } };
    const offset = Number(body.offset);
    const limit = Number(body.limit);
    state.imported = Math.max(state.imported, offset + limit);
    return { data: { items: Array.from({ length: limit }, (_, i) => ({ caseId: `case-${offset + i}`, videoId: `video-${offset + i}`, storagePath: `medora/${offset + i}.mp4`, ok: true })), nextOffset: offset + limit, total: 6 } };
  });
});
afterEach(cleanup);

describe("Medora import controls", () => {
  it("runs sequential batches of 3 and generates a cover for each new video", async () => {
    render(<MedoraImportCard />);
    await screen.findByText("imported 0 of 6");
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    await screen.findByText("imported 6 of 6");
    await waitFor(() => expect(screen.getByRole("button", { name: "Resume" })).toBeDisabled());
    const batches = state.invoke.mock.calls.map((call) => call[1].body).filter((body) => body.action === "import");
    expect(batches).toEqual([{ action: "import", offset: 0, limit: 3 }, { action: "import", offset: 3, limit: 3 }]);
    expect(state.cover).toHaveBeenCalledTimes(6);
    expect(state.invoke.mock.calls.filter((call) => call[1].body.action === "set-cover")).toHaveLength(6);
  });
  it("continues after cover failure and retries only that cover", async () => {
    state.cover.mockRejectedValueOnce(new Error("Frame unavailable"));
    render(<MedoraImportCard />);
    await screen.findByText("imported 0 of 6");
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    await screen.findByText("imported 6 of 6");
    const retry = await screen.findByRole("button", { name: "Retry failed" });
    await waitFor(() => expect(retry).toBeEnabled());
    expect(state.cover).toHaveBeenCalledTimes(6);
    fireEvent.click(retry);
    await waitFor(() => expect(screen.queryByRole("button", { name: "Retry failed" })).not.toBeInTheDocument());
    expect(state.cover).toHaveBeenLastCalledWith("medora/0.mp4");
    expect(state.invoke.mock.calls.filter((call) => call[1].body.action === "import")).toHaveLength(2);
  });
  it("finishes the active batch then pauses and resumes at the next offset", async () => {
    let release: (() => void) | undefined;
    state.cover.mockImplementationOnce(() => new Promise<string>((resolve) => { release = () => resolve("data:image/webp;base64,d2VicA=="); }));
    render(<MedoraImportCard />);
    await screen.findByText("imported 0 of 6");
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    await waitFor(() => expect(state.cover).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    release?.();
    await screen.findByText("imported 3 of 6");
    await waitFor(() => expect(screen.getByRole("button", { name: "Resume" })).toBeEnabled());
    expect(state.invoke.mock.calls.filter((call) => call[1].body.action === "import")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Resume" }));
    await screen.findByText("imported 6 of 6");
    expect(state.invoke.mock.calls.filter((call) => call[1].body.action === "import")[1][1].body.offset).toBe(3);
  });
});
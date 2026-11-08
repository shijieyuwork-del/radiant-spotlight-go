import { describe, expect, it } from "vitest";
import { isBeforeAfterCaseVisible } from "@/hooks/use-before-after";

describe("hidden before-and-after cases", () => {
  it.each([
    "ef30ef01-8645-40a7-a030-eca9ba9ce109",
    "22a618c3-69bc-46ca-8574-de1d57c55592",
  ])("removes %s from every public surface", (id) => {
    expect(isBeforeAfterCaseVisible(id)).toBe(false);
  });

  it("keeps unrelated cases visible", () => {
    expect(isBeforeAfterCaseVisible("22dbdb69-65bb-44a5-91fc-d58c2e610a70")).toBe(true);
  });
});

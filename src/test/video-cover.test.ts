import { describe, expect, it } from "vitest";
import { formatDuration } from "@/lib/video-cover";

describe("formatDuration", () => {
  it("formats whole minutes and seconds", () => {
    expect(formatDuration(65)).toBe("1:05");
    expect(formatDuration(600)).toBe("10:00");
  });

  it("pads single-digit seconds", () => {
    expect(formatDuration(9.4)).toBe("0:09");
  });

  it("rounds fractional seconds", () => {
    expect(formatDuration(59.6)).toBe("1:00");
    expect(formatDuration(30.4)).toBe("0:30");
  });

  it("handles zero", () => {
    expect(formatDuration(0)).toBe("0:00");
  });
});

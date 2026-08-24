import { describe, expect, it } from "vitest";
import { formatDuration, scoreLumaPlane } from "@/lib/video-cover";

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

describe("scoreLumaPlane", () => {
  const makePlane = (w: number, h: number, fn: (x: number, y: number) => number) => {
    const plane = new Float32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) plane[y * w + x] = fn(x, y);
    return plane;
  };

  it("prefers sharp, well-lit frames over flat dark ones", () => {
    const sharp = makePlane(16, 16, (x, y) => ((x + y) % 2 === 0 ? 150 : 90));
    const flatDark = makePlane(16, 16, () => 10);
    expect(scoreLumaPlane(sharp, 16, 16)).toBeGreaterThan(scoreLumaPlane(flatDark, 16, 16));
  });

  it("penalizes overexposed frames", () => {
    const wellLit = makePlane(16, 16, (x) => 120 + (x % 3) * 5);
    const blownOut = makePlane(16, 16, (x) => 250 + (x % 3));
    expect(scoreLumaPlane(wellLit, 16, 16)).toBeGreaterThan(scoreLumaPlane(blownOut, 16, 16));
  });

  it("returns 0 for a completely flat black frame", () => {
    expect(scoreLumaPlane(makePlane(8, 8, () => 0), 8, 8)).toBe(0);
  });

  it("returns 0 for an empty plane", () => {
    expect(scoreLumaPlane(new Float32Array(0), 0, 0)).toBe(0);
  });
});

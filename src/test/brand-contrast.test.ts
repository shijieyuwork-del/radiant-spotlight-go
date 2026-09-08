import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/index.css", "utf8");
const root = css.slice(css.indexOf(":root {"), css.indexOf(".home-content-flow"));

function token(name: string): string {
  const value = root.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1];
  if (!value) throw new Error(`Missing color token ${name}`);
  const reference = value.match(/^var\(--([\w-]+)\)$/);
  return reference ? token(reference[1]) : value;
}

function luminance(hsl: string) {
  const [h, s, l] = hsl.split(/\s+/).map(Number.parseFloat);
  const light = l / 100;
  const amplitude = (s / 100) * Math.min(light, 1 - light);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    const v = light - amplitude * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(8) + 0.0722 * channel(4);
}

describe("brand text contrast", () => {
  it("retains the existing mint and emerald backgrounds", () => {
    expect(token("primary")).toBe("158 45% 55%");
    expect(token("brand-emerald")).toBe("155 48% 62%");
  });

  it("uses forest ink on mint controls at normal-text contrast", () => {
    expect(token("primary-foreground")).toBe(token("foreground"));
    const background = luminance(token("primary"));
    const foreground = luminance(token("primary-foreground"));
    expect((background + 0.05) / (foreground + 0.05)).toBeGreaterThanOrEqual(4.5);
  });
});

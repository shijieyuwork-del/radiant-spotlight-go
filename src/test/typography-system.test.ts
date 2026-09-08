import { readFileSync } from "node:fs";
import { createElement } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import postcss, { type Root } from "postcss";
import tailwindcss from "tailwindcss";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import tailwindConfig from "../../tailwind.config";
import MedicalTourismArticle from "@/pages/MedicalTourismArticle";
import Packages from "@/pages/Packages";
import { findMedicalTourismGuide } from "@/data/medicalTourismGuides";

vi.mock("@/components/AsiaNavbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/PageMeta", () => ({ default: () => null }));
vi.mock("@/components/MedicalDisclaimer", () => ({ MedicalDisclaimer: () => null }));
vi.mock("@/components/QuoteRequest", () => ({ useQuote: () => ({ open: vi.fn() }) }));
vi.mock("@/components/QuoteCtaButton", () => ({ default: () => null, QUOTE_WHATSAPP_URL: "https://wa.me/14708613825" }));
vi.mock("@/lib/asia-i18n", () => ({ useAsia: () => ({ lang: "en", t: (key: string) => key }) }));
vi.mock("@/data/medicalTourismGuides", () => ({
  findMedicalTourismGuide: () => ({
    slug: "costs",
    title: "Cost planning guide",
    description: "Plan a clear travel budget.",
    kicker: "Cost planning",
    heading: "Plan the whole trip, not one price.",
    intro: "Compare written estimates and include travel costs in your budget.",
    answer: "Ask for an itemized estimate and a separate travel budget.",
    updated: "September 7, 2026",
    readingTime: "8-minute guide",
    takeaways: ["Compare like-for-like written estimates."],
    sections: [{
      title: "Build a separate travel budget",
      paragraphs: ["Flights, local transport, accommodation and meals belong in the travel budget."],
      table: {
        caption: "Budget worksheet",
        headers: ["Budget group", "Include", "Confirm with"],
        rows: [["Travel", "Flights, transfers, hotel", "Official sources and suppliers"]],
      },
    }],
    faqs: [["What should the budget include?", "Request written estimates before making travel arrangements."]],
    sources: [{ title: "Source details", publisher: "Official source", url: "https://example.com/guide" }],
    related: [],
  }),
  medicalTourismGuidePath: (slug: string) => `/medical-tourism-china/${slug}`,
}));

const cssSource = readFileSync("src/index.css", "utf8");
const authoredCss = postcss.parse(cssSource);
let generatedCss: Root;

beforeAll(async () => {
  const result = await postcss([
    tailwindcss({
      ...tailwindConfig,
      content: [{ raw: '<p class="text-xs text-sm leading-7 text-label text-caption text-nav text-body md:text-body-lg text-brand"></p>' }],
    }),
  ]).process(cssSource, { from: "src/index.css" });
  generatedCss = result.root;
}, 30_000);

afterEach(cleanup);

function declaration(root: Root, selector: string, property: string) {
  let value: string | undefined;
  root.walkRules(selector, (rule) => {
    rule.walkDecls(property, (decl) => { value = decl.value; });
  });
  return value;
}

function luminance(hsl: string) {
  const [hue, saturation, lightness] = hsl.split(/\s+/).map(Number.parseFloat);
  const light = lightness / 100;
  const amplitude = (saturation / 100) * Math.min(light, 1 - light);
  const channel = (n: number) => {
    const k = (n + hue / 30) % 12;
    const value = light - amplitude * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(8) + 0.0722 * channel(4);
}

describe("typography tokens and CSS cascade", () => {
  it.each([
    ["label", "0.75rem", "1.5"],
    ["caption", "0.8125rem", "1.5"],
    ["nav", "0.875rem", "1.5"],
    ["body", "1rem", "1.6"],
    ["body-lg", "1.125rem", "1.6"],
  ])("defines %s with a semantic size and unitless line height", (token, size, lineHeight) => {
    const sizes = tailwindConfig.theme.extend.fontSize;
    expect(sizes[token as keyof typeof sizes]).toEqual([size, { lineHeight }]);
  });

  it("generates responsive body sizes and the readable brand-text role", () => {
    expect(declaration(generatedCss, ".text-body", "font-size")).toBe("1rem");
    expect(declaration(generatedCss, ".text-body", "line-height")).toBe("1.6");
    expect(declaration(generatedCss, ".md\\:text-body-lg", "font-size")).toBe("1.125rem");
    expect(declaration(generatedCss, ".md\\:text-body-lg", "line-height")).toBe("1.6");
    expect(declaration(generatedCss, ".text-brand", "color")).toBe("hsl(var(--brand-text))");
  });

  it("does not reintroduce handwritten font-size utility overrides", () => {
    const conflictingSelectors: string[] = [];
    authoredCss.walkRules((rule) => {
      if (/\.text-(?:xs|sm|base|lg)(?=[\s,:{.]|$)/.test(rule.selector)) {
        rule.walkDecls(/^(font-size|line-height)$/, () => { conflictingSelectors.push(rule.selector); });
      }
    });
    expect(conflictingSelectors).toEqual([]);

    const cascade: string[] = [];
    generatedCss.walkRules((rule) => {
      if (rule.selector === ".text-sm" || rule.selector === ".leading-7") cascade.push(rule.selector);
    });
    expect(declaration(generatedCss, ".text-sm", "font-size")).toBe("0.9375rem");
    expect(declaration(generatedCss, ".text-sm", "line-height")).toBe("1.6");
    expect(declaration(generatedCss, ".leading-7", "line-height")).toBe("1.75rem");
    expect(cascade.indexOf(".leading-7")).toBeGreaterThan(cascade.lastIndexOf(".text-sm"));
  });

  it("uses normal body tracking without removing display-specific tracking", () => {
    expect(declaration(authoredCss, "body", "letter-spacing")).toBe("normal");
    expect(declaration(authoredCss, "h1, h2", "letter-spacing")).toBeDefined();
  });

  it.each([":root", ".dark"])("keeps brand and supporting text readable on %s reading surfaces", (theme) => {
    for (const textToken of ["brand-text", "muted-foreground"]) {
      const foreground = luminance(declaration(authoredCss, theme, `--${textToken}`)!);
      for (const surface of ["background", "card", "muted"]) {
        const background = luminance(declaration(authoredCss, theme, `--${surface}`)!);
        const contrast = (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
        expect(contrast, `${theme}: ${textToken} on ${surface}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});

describe("readable page-template regression guards", () => {
  it("keeps wide guide tables inside a labelled, keyboard-accessible local scroll region", () => {
    render(createElement(MemoryRouter, null, createElement(MedicalTourismArticle, { guideSlug: "costs" })));
    const article = screen.getByRole("article", { hidden: true });
    expect(article).toHaveClass("w-full", "min-w-0");
    expect(article.parentElement).toHaveClass("grid-cols-[minmax(0,1fr)]");

    const table = screen.getByRole("table", { name: "Budget worksheet", hidden: true });
    const scroller = screen.getByRole("region", { name: "Budget worksheet", hidden: true });
    expect(scroller).toContainElement(table);
    expect(table).toHaveClass("min-w-[620px]");
    expect(scroller).toHaveClass("w-full", "min-w-0", "max-w-full", "overflow-x-auto");
    expect(scroller).toHaveAttribute("tabindex", "0");
    expect(scroller).toHaveAccessibleDescription(/Scroll horizontally/);
    expect(scroller.parentElement).toHaveClass("w-full", "min-w-0", "max-w-full");

    // jsdom cannot measure layout: these guard the intrinsic-width fixes;
    // real viewport overflow and touch/keyboard scrolling need browser QA.
    const contentColumn = scroller.parentElement?.parentElement;
    expect(contentColumn).toHaveClass("min-w-0");
    expect(contentColumn?.parentElement).toHaveClass("grid-cols-[minmax(0,1fr)]", "sm:grid-cols-[3rem_minmax(0,1fr)]");
  }, 20_000);

  it("keeps article paragraphs and FAQ answers on the same bounded reading scale", () => {
    const guide = findMedicalTourismGuide("costs")!;
    render(createElement(MemoryRouter, null, createElement(MedicalTourismArticle, { guideSlug: guide.slug })));
    expect(screen.getByText(guide.sections[0].paragraphs[0]).parentElement).toHaveClass("max-w-[65ch]", "text-body", "md:text-body-lg");
    expect(screen.getByText(guide.faqs[0][1])).toHaveClass("max-w-[65ch]", "text-body", "md:text-body-lg");
    expect(screen.getAllByRole("heading", { level: 1, hidden: true })).toHaveLength(1);
  }, 20_000);

  it("gives the travel-support page one primary heading without changing its copy", () => {
    render(createElement(Packages));
    expect(screen.getAllByRole("heading", { level: 1, hidden: true })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, hidden: true })).toHaveTextContent("Six steps. No guessing what comes next.");
    expect(screen.getByRole("heading", { level: 2, name: "Your journey. Our support.", hidden: true })).toBeInTheDocument();
  }, 20_000);
});

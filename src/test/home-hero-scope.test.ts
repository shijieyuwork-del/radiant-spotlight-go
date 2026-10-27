import { describe, expect, it } from "vitest";
import { getHomeHeroCopy } from "@/lib/home-hero-copy";
import { homeStructuredData } from "@/lib/home-structured-data";

describe("homepage scope and audience", () => {
  it("states the audience: international visitors, women and men", () => {
    expect(getHomeHeroCopy("en").audience).toMatch(/international visitors.*women and men/i);
  });

  it("offers the three entry points", () => {
    const c = getHomeHeroCopy("en");
    expect([c.explore, c.how, c.ask]).toEqual(["Explore Providers", "How It Works", "Ask a Question"]);
  });

  it("says the platform is not a clinic, does not diagnose or guarantee results", () => {
    const s = getHomeHeroCopy("en").scope;
    expect(s).toMatch(/not a clinic/);
    expect(s).toMatch(/do not diagnose/);
    expect(s).toMatch(/guarantee results/);
    expect(s).toMatch(/informed consent/);
  });

  it("ships FAQ structured data in the visitor's language", () => {
    const graph = homeStructuredData("zh")["@graph"] as Array<Record<string, unknown>>;
    const faq = graph.find((n) => n["@type"] === "FAQPage")!;
    expect(faq.inLanguage).toBe("zh");
  });
});

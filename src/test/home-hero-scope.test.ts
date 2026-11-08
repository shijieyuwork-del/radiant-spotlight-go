import { describe, expect, it } from "vitest";
import { getHomeHeroCopy } from "@/lib/home-hero-copy";
import { homeStructuredData } from "@/lib/home-structured-data";

describe("homepage scope and audience", () => {
  it("states the audience: international visitors", () => {
    expect(getHomeHeroCopy("en").audience).toMatch(/international visitors/i);
  });

  it("uses the approved case-comparison headline and consultation copy", () => {
    const c = getHomeHeroCopy("en");
    expect(c.title).toBe("Compare hundreds of cases.\nFind the right expert for you.");
    expect(c.subtitle).toBe("Explore case photos and recovery videos from specialists across China. We’ll help you compare your options and arrange your consultation.");
  });

  it("offers the three entry points", () => {
    const c = getHomeHeroCopy("en");
    expect([c.explore, c.how, c.ask]).toEqual(["Explore Experts", "How It Works", "Start a Consultation"]);
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

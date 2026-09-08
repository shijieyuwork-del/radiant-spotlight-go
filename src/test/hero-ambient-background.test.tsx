import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import HeroAmbientBackground from "@/components/HeroAmbientBackground";
import type { AsiaLang } from "@/lib/asia-i18n";

const ambientStyles = readFileSync(join(__dirname, "..", "index.css"), "utf8");
const homeSource = readFileSync(join(__dirname, "..", "pages", "AsiaIndex.tsx"), "utf8");

type ObservedField = {
  callback: IntersectionObserverCallback;
  elements: Set<Element>;
  disconnect: ReturnType<typeof vi.fn>;
};

const originalObserver = globalThis.IntersectionObserver;
let observers: ObservedField[];
let reducedMotion: boolean;
let documentHidden: boolean;
let mediaListeners: Set<EventListenerOrEventListenerObject>;
let mediaQuery: MediaQueryList;
let addMediaListener: ReturnType<typeof vi.fn>;
let removeMediaListener: ReturnType<typeof vi.fn>;

beforeEach(() => {
  observers = [];
  reducedMotion = false;
  documentHidden = false;
  mediaListeners = new Set();
  addMediaListener = vi.fn((type: string, listener: EventListenerOrEventListenerObject) => {
    if (type === "change") mediaListeners.add(listener);
  });
  removeMediaListener = vi.fn((type: string, listener: EventListenerOrEventListenerObject) => {
    if (type === "change") mediaListeners.delete(listener);
  });
  mediaQuery = {
    get matches() { return reducedMotion; },
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addEventListener: addMediaListener,
    removeEventListener: removeMediaListener,
  } as unknown as MediaQueryList;
  vi.spyOn(window, "matchMedia").mockReturnValue(mediaQuery);
  vi.spyOn(document, "hidden", "get").mockImplementation(() => documentHidden);
  vi.spyOn(document, "visibilityState", "get").mockImplementation(() => documentHidden ? "hidden" : "visible");
  globalThis.IntersectionObserver = class {
    field: ObservedField;
    constructor(callback: IntersectionObserverCallback) {
      this.field = { callback, elements: new Set(), disconnect: vi.fn() };
      observers.push(this.field);
    }
    observe(element: Element) { this.field.elements.add(element); }
    unobserve(element: Element) { this.field.elements.delete(element); }
    disconnect() { this.field.disconnect(); this.field.elements.clear(); }
  } as unknown as typeof IntersectionObserver;
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  globalThis.IntersectionObserver = originalObserver;
});

function intersect(visible: boolean) {
  act(() => {
    observers.forEach(({ callback, elements }) => {
      callback(Array.from(elements, (target) => ({
        target,
        isIntersecting: visible,
        intersectionRatio: visible ? 1 : 0,
      } as IntersectionObserverEntry)), {} as IntersectionObserver);
    });
  });
}

function setDocumentHidden(hidden: boolean) {
  documentHidden = hidden;
  act(() => document.dispatchEvent(new Event("visibilitychange")));
}

function setReducedMotion(reduced: boolean) {
  reducedMotion = reduced;
  act(() => {
    const event = Object.assign(new Event("change"), { matches: reduced, media: mediaQuery.media });
    mediaListeners.forEach((listener) => {
      if (typeof listener === "function") listener.call(mediaQuery, event);
      else listener.handleEvent(event);
    });
  });
}

const background = () => screen.getByTestId("hero-ambient-background");

describe("homepage ambient background", () => {
  it("keeps decorative layers out of the accessibility tree and its control outside the hidden field", () => {
    const { container } = render(<HeroAmbientBackground lang="en" />);
    const field = container.querySelector("#hero-ambient-field");
    expect(field).toHaveAttribute("aria-hidden", "true");
    const ripples = field?.querySelectorAll<HTMLDivElement>(".hero-ambient__ripples");
    expect(ripples).toHaveLength(2);
    expect(field?.querySelector(".hero-ambient__ripples--near")).toBeInTheDocument();
    expect(field?.querySelector(".hero-ambient__ripples--far")).toBeInTheDocument();
    ripples?.forEach((ripple) => {
      expect(field).toContainElement(ripple);
      expect(ripple).not.toHaveAttribute("tabindex");
      expect(ripple.querySelector("svg")).toHaveAttribute("focusable", "false");
      expect(ripple.querySelector("path, ellipse, circle")).not.toBeNull();
    });
    expect(field?.querySelector("img, video, canvas, button, a, input, [tabindex] ")).toBeNull();
    expect(field?.querySelector(".hero-ambient__organza, .hero-ambient__form, .hero-ambient__glint, .hero-ambient__form--champagne")).toBeNull();
    const toggle = screen.getByRole("button");
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(toggle).toHaveAttribute("aria-controls", "hero-ambient-field");
    expect(toggle.closest('[aria-hidden="true"]')).toBeNull();
    expect(container.querySelector("img, video, canvas")).toBeNull();
  });

  it("gates both water-ripple layers with shared paused, running and reduced-motion rules", () => {
    const rules = Array.from(ambientStyles.matchAll(/([^{}]+)\{([^{}]*)\}/g), ([, selector, declarations]) => ({
      selectors: selector.split(",").map((part) => part.trim()),
      declarations,
    }));
    const reducedBlocks = Array.from(ambientStyles.matchAll(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)\n\}/g), ([, block]) => block);
    for (const layer of [".hero-ambient__ripples"]) {
      expect(rules.some(({ selectors, declarations }) => selectors.includes(layer) && /animation-play-state:\s*paused\s*;/.test(declarations))).toBe(true);
      expect(rules.some(({ selectors, declarations }) => selectors.includes(`.hero-ambient[data-motion="running"] ${layer}`) && /animation-play-state:\s*running\s*;/.test(declarations))).toBe(true);
      expect(reducedBlocks.some((block) => Array.from(block.matchAll(/([^{}]+)\{([^{}]*)\}/g)).some(([, selectors, declarations]) => selectors.includes(layer) && /animation:\s*none\s*;/.test(declarations)))).toBe(true);
    }
    expect(ambientStyles).not.toMatch(/hero-ambient__(?:organza|form--champagne)|hero-organza-drift|hero-silk-champagne/);
  });

  it("renders scalable water shapes without bitmap, video or canvas assets", () => {
    const { container } = render(<HeroAmbientBackground lang="en" />);
    expect(container.querySelector("img, video, canvas, svg image, svg animate, svg animateTransform")).toBeNull();
    const componentSource = readFileSync(join(__dirname, "..", "components", "HeroAmbientBackground.tsx"), "utf8");
    expect(componentSource).not.toMatch(/hero-ribbons|hero-luminous-silk|requestAnimationFrame|setInterval/);
    expect(ambientStyles).not.toContain("hero-ribbons.png");
    expect(ambientStyles).not.toContain("hero-luminous-silk.webp");
  });

  it("keeps the water loops on transforms instead of repainting filters or page layout", () => {
    const loops = Array.from(ambientStyles.matchAll(/@keyframes\s+(home-water-[\w-]+)\s*\{([\s\S]*?)\n\}/g));
    expect(loops).toHaveLength(2);
    for (const [, , body] of loops) {
      const properties = new Set(Array.from(body.matchAll(/([a-z-]+)\s*:/g), ([, property]) => property));
      expect([...properties]).toEqual(["transform"]);
    }
  });

  it("mounts one fixed background at the homepage root rather than within the hero", () => {
    const source = ts.createSourceFile("AsiaIndex.tsx", homeSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const waterPages: ts.JsxElement[] = [];
    const mounts: ts.JsxSelfClosingElement[] = [];
    const visit = (node: ts.Node) => {
      if (ts.isJsxElement(node)) {
        const className = node.openingElement.attributes.properties.find((attribute): attribute is ts.JsxAttribute => ts.isJsxAttribute(attribute) && attribute.name.getText(source) === "className");
        if (className?.initializer && ts.isStringLiteral(className.initializer) && className.initializer.text.split(/\s+/).includes("home-water-page")) waterPages.push(node);
      }
      if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(source) === "HeroAmbientBackground") mounts.push(node);
      ts.forEachChild(node, visit);
    };
    visit(source);
    expect(waterPages).toHaveLength(1);
    expect(mounts).toHaveLength(1);
    expect(mounts[0].parent).toBe(waterPages[0]);
    expect(waterPages[0].getText(source)).toContain('<main className="home-content-flow">');
    expect(waterPages[0].getText(source)).toContain("<PatientStoriesSection ambient");
    expect(ambientStyles).toMatch(/\.home-water-page\s+\.home-content-flow\s*\{[^}]*background:\s*transparent\s*;/);
    expect(ambientStyles).toMatch(/\.hero-ambient\s*\{[^}]*position:\s*fixed\s*;[^}]*inset:\s*0\s*;/);
    expect(ambientStyles).toMatch(/\.hero-ambient__toggle\s*\{[^}]*position:\s*fixed\s*;/);
  });

  it("starts paused and only runs while the homepage background and document are visible", () => {
    render(<HeroAmbientBackground lang="en" />);
    expect(background()).toHaveAttribute("data-motion", "paused");
    expect(observers.some(({ elements }) => elements.size > 0)).toBe(true);
    intersect(true);
    expect(background()).toHaveAttribute("data-motion", "running");
    expect(screen.getByRole("button", { name: "Pause background animation" })).toBeInTheDocument();
    intersect(false);
    expect(background()).toHaveAttribute("data-motion", "paused");
    intersect(true);
    expect(background()).toHaveAttribute("data-motion", "running");
    setDocumentHidden(true);
    expect(background()).toHaveAttribute("data-motion", "paused");
    setDocumentHidden(false);
    expect(background()).toHaveAttribute("data-motion", "running");
    intersect(false);
    setDocumentHidden(true);
    setDocumentHidden(false);
    expect(background()).toHaveAttribute("data-motion", "paused");
  });

  it("does not start in a background tab even when intersection is reported", () => {
    documentHidden = true;
    render(<HeroAmbientBackground lang="en" />);
    intersect(true);
    expect(background()).toHaveAttribute("data-motion", "paused");
    setDocumentHidden(false);
    expect(background()).toHaveAttribute("data-motion", "running");
  });

  it("preserves a visitor's pause across scrolling and browser-tab changes until they choose play", () => {
    render(<HeroAmbientBackground lang="en" />);
    intersect(true);
    fireEvent.click(screen.getByRole("button", { name: "Pause background animation" }));
    expect(background()).toHaveAttribute("data-motion", "paused");
    expect(screen.getByRole("button", { name: "Play background animation" })).toBeInTheDocument();
    intersect(false);
    setDocumentHidden(true);
    intersect(true);
    setDocumentHidden(false);
    expect(background()).toHaveAttribute("data-motion", "paused");
    fireEvent.click(screen.getByRole("button", { name: "Play background animation" }));
    expect(background()).toHaveAttribute("data-motion", "running");
  });

  it("honors reduced motion at mount and when the system preference changes", () => {
    reducedMotion = true;
    const { container } = render(<HeroAmbientBackground lang="en" />);
    expect(window.matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
    intersect(true);
    expect(background()).toHaveAttribute("data-motion", "paused");
    const toggle = container.querySelector("button");
    if (toggle) {
      const hiddenByMarkup = toggle.hidden || toggle.getAttribute("aria-hidden") === "true";
      const hiddenByStyle = toggle.classList.contains("motion-reduce:hidden") || toggle.classList.contains("hidden");
      expect(hiddenByMarkup || hiddenByStyle).toBe(true);
    }
    setReducedMotion(false);
    expect(background()).toHaveAttribute("data-motion", "running");
    setReducedMotion(true);
    expect(background()).toHaveAttribute("data-motion", "paused");
  });

  it("does not forget a visitor's pause when reduced motion is toggled", () => {
    render(<HeroAmbientBackground lang="en" />);
    intersect(true);
    fireEvent.click(screen.getByRole("button", { name: "Pause background animation" }));
    setReducedMotion(true);
    setReducedMotion(false);
    expect(background()).toHaveAttribute("data-motion", "paused");
    expect(screen.getByRole("button", { name: "Play background animation" })).toBeInTheDocument();
  });

  it.each<AsiaLang>(["zh", "ru", "es", "th", "ms"])("provides localized pause and play names in %s", (lang) => {
    render(<HeroAmbientBackground lang={lang} />);
    intersect(true);
    const pause = screen.getByRole("button");
    const pauseLabel = pause.getAttribute("aria-label") || pause.textContent;
    expect(pauseLabel?.trim()).toBeTruthy();
    expect(pauseLabel).not.toBe("Pause background animation");
    fireEvent.click(pause);
    const play = screen.getByRole("button");
    const playLabel = play.getAttribute("aria-label") || play.textContent;
    expect(playLabel?.trim()).toBeTruthy();
    expect(playLabel).not.toBe("Play background animation");
    expect(playLabel).not.toBe(pauseLabel);
  });

  it("removes media/visibility listeners and disconnects intersection observation on unmount", () => {
    const addDocumentListener = vi.spyOn(document, "addEventListener");
    const removeDocumentListener = vi.spyOn(document, "removeEventListener");
    const { unmount } = render(<HeroAmbientBackground lang="en" />);
    const visibilityRegistration = addDocumentListener.mock.calls.find(([event]) => event === "visibilitychange");
    const mediaRegistration = addMediaListener.mock.calls.find(([event]) => event === "change");
    expect(visibilityRegistration).toBeDefined();
    expect(mediaRegistration).toBeDefined();
    unmount();
    expect(observers.every(({ disconnect }) => disconnect.mock.calls.length > 0)).toBe(true);
    expect(removeDocumentListener.mock.calls.some(([event, listener]) => event === "visibilitychange" && listener === visibilityRegistration?.[1])).toBe(true);
    expect(removeMediaListener.mock.calls.some(([event, listener]) => event === "change" && listener === mediaRegistration?.[1])).toBe(true);
    expect(mediaListeners.size).toBe(0);
  });
});

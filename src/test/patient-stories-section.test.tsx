import type { ButtonHTMLAttributes, HTMLAttributes, PropsWithChildren } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import PatientStoriesSection from "@/components/PatientStoriesSection";
import { patientStories } from "@/data/patientStories";

const mocks = vi.hoisted(() => ({ lang: "en" }));
vi.mock("@/lib/asia-i18n", () => ({ useAsia: () => ({ lang: mocks.lang }) }));

// Keep the real dialog and its focus behavior; Embla's layout is covered in the browser.
vi.mock("@/components/ui/carousel", () => ({
  Carousel: ({ children }: PropsWithChildren) => <div>{children}</div>,
  CarouselContent: (props: HTMLAttributes<HTMLDivElement>) => <div {...props} />,
  CarouselItem: (props: HTMLAttributes<HTMLDivElement>) => <div {...props} />,
  CarouselNext: (props: ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />,
  CarouselPrevious: (props: ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />,
}));

const patientNames = [
  "Angela M.", "Rob C.", "Valerie C.", "Sofia R.", "Daniel K.",
  "Mina L.", "Claire B.", "Marcus T.", "Noor A.",
];

beforeEach(() => { mocks.lang = "en"; });
afterEach(cleanup);

describe("patient story previews and full stories", () => {
  it("retains the original heading and gives every patient a named full-story action", () => {
    render(<PatientStoriesSection />);

    expect(screen.getByRole("heading", { level: 2, name: "400+ patients trust CeladonChina." })).toBeVisible();
    expect(screen.getAllByRole("button", { name: /^Read full story:/ })).toHaveLength(9);
    expect(patientStories.map((story) => story.name)).toEqual(patientNames);
    for (const name of patientNames) {
      expect(screen.getByRole("heading", { name })).toBeVisible();
      expect(screen.getByRole("button", { name: `Read full story: ${name}` })).toHaveTextContent("Read full story");
    }
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it.each(["en", "zh"])("shows only original excerpts in the %s previews", (lang) => {
    mocks.lang = lang;
    const { container } = render(<PatientStoriesSection />);

    for (const story of patientStories) {
      const excerpt = lang === "zh" ? story.excerptZh : story.excerpt;
      const paragraphs = lang === "zh" ? story.storyZh : story.story;
      expect(paragraphs.join(" ")).toContain(excerpt);
      expect(excerpt.length).toBeLessThan(paragraphs.join(" ").length);
      expect(container).toHaveTextContent(excerpt);
      for (const paragraph of paragraphs) {
        if (paragraph !== excerpt) {
          expect(screen.queryByText(paragraph, { exact: true })).not.toBeInTheDocument();
        }
      }
    }
  });

  it.each(["en", "zh"])("opens every complete %s story with matching patient details", async (lang) => {
    mocks.lang = lang;
    render(<PatientStoriesSection />);

    if (lang === "zh") {
      expect(screen.getByRole("heading", { level: 2, name: "400+ 位患者信任 CeladonChina。" })).toBeVisible();
      expect(screen.getAllByRole("button", { name: /^阅读全文：/ })).toHaveLength(9);
    }

    for (const story of patientStories) {
      const label = lang === "zh" ? `阅读全文：${story.name}` : `Read full story: ${story.name}`;
      fireEvent.click(screen.getByRole("button", { name: label }));
      const dialog = await screen.findByRole("dialog", { name: story.name });

      expect(within(dialog).getByRole("heading", { name: story.name })).toBeVisible();
      expect(dialog).toHaveTextContent(lang === "zh" ? `${story.age} 岁 · ${story.countryZh}` : `Age ${story.age} · ${story.country}`);
      for (const paragraph of lang === "zh" ? story.storyZh : story.story) {
        expect(within(dialog).getByText(paragraph, { exact: true })).toBeVisible();
      }
      if (story.procedure) {
        expect(dialog).toHaveTextContent(lang === "zh" ? story.procedureZh! : story.procedure);
      }

      fireEvent.click(within(dialog).getByRole("button", { name: lang === "zh" ? "关闭" : "Close" }));
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    }
  });

  it("closes with Escape and restores keyboard focus to the selected story", async () => {
    render(<PatientStoriesSection />);
    const trigger = screen.getByRole("button", { name: "Read full story: Noor A." });
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = await screen.findByRole("dialog", { name: "Noor A." });
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    fireEvent.keyDown(document.activeElement!, { key: "Escape", code: "Escape" });

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});

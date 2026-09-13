import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { ClinicDescription } from "@/components/clinics/ClinicDescription";
import { RODEO_SHANGHAI_PROFILE } from "@/data/rodeoShanghaiProfile";
import { getClinicReadingGuide, parseClinicDescription } from "@/lib/clinic-reading-guide";

afterEach(cleanup);

describe("admin-editable clinic descriptions", () => {
  it("keeps existing paragraphs and line breaks without requiring formatting", () => {
    const { container } = render(<ClinicDescription description={"First line\nSecond line\n\nAnother paragraph"} />);
    expect(container.querySelectorAll("p")).toHaveLength(2);
    expect(screen.getByText(/First line/)).toHaveTextContent("Second line");
    expect(container.querySelector("h3")).toBeNull();
  });

  it("offers six short topic groups with all eleven English chapters retained", () => {
    const { container } = render(<ClinicDescription description={RODEO_SHANGHAI_PROFILE.descriptionEn} />);
    expect(container.querySelectorAll("details")).toHaveLength(6);
    expect(container.querySelectorAll("details[open]")).toHaveLength(0);
    expect(screen.getByRole("heading", { name: "At a glance" })).toBeVisible();
    expect(screen.getAllByRole("heading", { level: 4, hidden: true })).toHaveLength(11);
    expect(container.querySelector("summary")).toHaveTextContent("Treatments & approach");
    expect(screen.getByRole("heading", { name: "Brand story and development", hidden: true })).not.toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Expand all" }));
    expect(container.querySelectorAll("details[open]")).toHaveLength(6);
    expect(screen.getByRole("heading", { name: "Medical team" })).toBeVisible();
    expect(screen.getByText(/Dr Chen Sikai/)).toBeInTheDocument();
    expect(screen.getByText(/Dr Hu Lingling/)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Dr\. Dan, official RODEO photograph/ })).toBeVisible();
    expect(screen.getByRole("img", { name: /Dr Chen Sikai, official RODEO photograph/ })).toBeVisible();
    expect(screen.getByRole("img", { name: /Dr Hu Lingling, official RODEO photograph/ })).toBeVisible();
    expect(screen.getByRole("link", { name: /View the medical team on RODEO/ })).toHaveAttribute("href", "https://rodeomed.com/doctors");
    expect(screen.getAllByRole("listitem")).toHaveLength(7);
    expect(screen.getByRole("link", { name: "RODEO official website" })).toHaveAttribute("href", "https://rodeomed.com/");
    screen.getByRole("button", { name: "Collapse all" }).focus();
    fireEvent.click(screen.getByRole("button", { name: "Collapse all" }));
    expect(container.querySelectorAll("details[open]")).toHaveLength(0);
    expect(screen.getByRole("button", { name: "Expand all" })).toHaveFocus();
  });

  it("preserves the equivalent Chinese chapters", () => {
    render(<ClinicDescription description={RODEO_SHANGHAI_PROFILE.descriptionZh} language="zh" />);
    expect(screen.getByRole("heading", { name: "先看重点" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "展开全部" }));
    expect(screen.getAllByRole("heading", { level: 4 })).toHaveLength(11);
    expect(screen.getByRole("heading", { name: "BIOLAB 听研合作与居家护肤" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /陈思凯 院长，柔缇欧官网照片/ })).toBeVisible();
    expect(screen.getByRole("link", { name: "RODEO 品牌官网" })).toHaveAttribute("rel", "noopener noreferrer nofollow");
  });

  it("keeps every source paragraph exactly once across the reordered groups", () => {
    for (const [language, description] of [["en", RODEO_SHANGHAI_PROFILE.descriptionEn], ["zh", RODEO_SHANGHAI_PROFILE.descriptionZh]]) {
      const parsed = parseClinicDescription(description);
      const guide = getClinicReadingGuide(description, parsed.chapters, language);
      const retained = guide.groups.flatMap((group) => group.chapters);
      expect(retained).toHaveLength(11);
      expect(new Set(retained.map((chapter) => chapter.title)).size).toBe(11);
      expect(retained.flatMap((chapter) => chapter.blocks).sort()).toEqual(parsed.chapters.flatMap((chapter) => chapter.blocks).sort());
    }
  });

  it("uses new admin text without stale summaries or losing extra chapters", () => {
    const description = "Updated introduction\n\n## New equipment\n\nConfirm availability.\n\n## Extra information\n\nNew branch details.";
    const { container } = render(<ClinicDescription description={description} />);
    expect(container.querySelectorAll("details")).toHaveLength(2);
    expect(container.querySelector("dl")).toBeNull();
    expect(container).not.toHaveTextContent("Huangpu, Shanghai");
    expect(container).toHaveTextContent("New branch details.");
  });

  it("resets disclosure state when the language changes", () => {
    const { container, rerender } = render(<ClinicDescription description={RODEO_SHANGHAI_PROFILE.descriptionEn} />);
    fireEvent.click(screen.getByRole("button", { name: "Expand all" }));
    rerender(<ClinicDescription description={RODEO_SHANGHAI_PROFILE.descriptionZh} language="zh" />);
    expect(container.querySelectorAll("details[open]")).toHaveLength(0);
    expect(screen.getByRole("button", { name: "展开全部" })).toBeVisible();
  });

  it("includes collapsed details in server HTML, with no JavaScript needed to open a topic", () => {
    const html = renderToStaticMarkup(<ClinicDescription description={RODEO_SHANGHAI_PROFILE.descriptionEn} />);
    expect(html).toContain("<details");
    expect(html).toContain("<summary");
    expect(html).toContain("Dr Chen Sikai");
    expect(html).toContain("https://rodeomed.com/");
    expect(html).not.toContain("display:none");
  });

  it("never executes stored HTML or unsafe links", () => {
    const { container } = render(<ClinicDescription description={'<script>alert(1)</script>\n\n[unsafe](javascript:alert)\n\n<img src=x onerror=alert(1)>'} />);
    expect(container.querySelector("script,img,a")).toBeNull();
    expect(container).toHaveTextContent("<script>alert(1)</script>");
  });

  it("does not create an empty content container", () => {
    const { container } = render(<ClinicDescription description="  " />);
    expect(container).toBeEmptyDOMElement();
  });

  it("uses customer-facing copy without hospital phone or email in either language", () => {
    for (const [language, description] of [["en", RODEO_SHANGHAI_PROFILE.descriptionEn], ["zh", RODEO_SHANGHAI_PROFILE.descriptionZh]]) {
      const html = renderToStaticMarkup(<ClinicDescription description={description} language={language} />);
      expect(html).not.toMatch(/brochure|宣传册|资料列为|资料中|5265|hello@|mailto:|tel:/i);
      expect(html).toContain("https://rodeomed.com/");
      expect(html).toContain("CeladonChina");
      expect(html).toContain(language === "zh" ? "茂名南路7号202室" : "Room 202, 7 Maoming South Road");
    }
  });
});

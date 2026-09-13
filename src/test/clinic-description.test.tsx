import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ClinicDescription } from "@/components/clinics/ClinicDescription";
import { RODEO_SHANGHAI_PROFILE } from "@/data/rodeoShanghaiProfile";

afterEach(cleanup);

describe("admin-editable clinic descriptions", () => {
  it("keeps existing paragraphs and line breaks without requiring formatting", () => {
    const { container } = render(<ClinicDescription description={"First line\nSecond line\n\nAnother paragraph"} />);
    expect(container.querySelectorAll("p")).toHaveLength(2);
    expect(screen.getByText(/First line/)).toHaveTextContent("Second line");
    expect(container.querySelector("h3")).toBeNull();
  });

  it("renders all eleven sections and team details in English", () => {
    render(<ClinicDescription description={RODEO_SHANGHAI_PROFILE.descriptionEn} />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(11);
    expect(screen.getByRole("heading", { name: "Brand story and development" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Medical team introduced in the brochure" })).toBeInTheDocument();
    expect(screen.getByText(/Dr Chen Sikai/)).toBeInTheDocument();
    expect(screen.getByText(/Dr Hu Lingling/)).toBeInTheDocument();
    expect(screen.getByText(/Dr Liu Lunfei/)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(7);
    expect(screen.getByRole("link", { name: "RODEO official brand page" })).toHaveAttribute("href", "https://rodeomed.com/about");
  });

  it("preserves the equivalent Chinese chapters", () => {
    render(<ClinicDescription description={RODEO_SHANGHAI_PROFILE.descriptionZh} />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(11);
    expect(screen.getByRole("heading", { name: "BIOLAB 听研合作与居家护肤" })).toBeInTheDocument();
    expect(screen.getByText(/陈思凯医生/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "RODEO 品牌官网" })).toHaveAttribute("rel", "noopener noreferrer nofollow");
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
});

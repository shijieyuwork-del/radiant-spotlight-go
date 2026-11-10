import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { COMPANY } from "@/components/CompanyDetails";
import { ORGANIZATION_ENTITY } from "@/lib/seo-config";
import { CONSULTATION_PHONE, CONSULTATION_PHONE_E164, consultationHandoffUrl, whatsappUrl } from "@/lib/consultation-handoff";

describe("sitewide WhatsApp contact", () => {
  it("uses the approved international number for display and links", () => {
    expect(CONSULTATION_PHONE).toBe("+86 182 6783 0823");
    expect(CONSULTATION_PHONE_E164).toBe("+8618267830823");
    expect(whatsappUrl()).toBe("https://wa.me/8618267830823");
    expect(COMPANY.telephone).toBe(CONSULTATION_PHONE);
    expect(COMPANY.telephoneHref).toBe(CONSULTATION_PHONE_E164);
    expect(ORGANIZATION_ENTITY.telephone).toBe(CONSULTATION_PHONE_E164);
    expect(ORGANIZATION_ENTITY.contactPoint.telephone).toBe(CONSULTATION_PHONE_E164);
  });

  it("preserves contextual messages without double encoding", () => {
    const message = "医生 & clinic / questions?\nhttps://sinoaesthetics.com/cases/example";
    const url = new URL(whatsappUrl(message));
    expect(url.pathname).toBe("/8618267830823");
    expect(url.searchParams.get("text")).toBe(message);
    expect(new URL(consultationHandoffUrl("whatsapp", { doctorName: "Expert A" })).pathname).toBe(url.pathname);
  });

  it("keeps phone numbers out of individual pages and components", () => {
    const sourceRoot = join(process.cwd(), "src");
    const scan = (directory: string) => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (entry.name === "test") continue;
        const path = join(directory, entry.name);
        if (entry.isDirectory()) scan(path);
        else if (/\.(ts|tsx|json)$/.test(entry.name)) {
          const source = readFileSync(path, "utf8");
          expect(source, path).not.toMatch(/14708613825|470[ -]861[ -]3825/);
          expect(source, path).not.toMatch(/https:\/\/wa\.me\/\d/);
        }
      }
    };
    scan(sourceRoot);
  });
});

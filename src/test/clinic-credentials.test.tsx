import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { STATIC_CLINICS, getClinicPath } from "@/data/clinicDirectory";
import { findClinicCredentials, MEDICAL_REGISTRY_URL } from "@/data/clinicCredentials";
import { ClinicCredentials } from "@/components/clinics/ClinicCredentials";
import records from "@/data/clinic-credentials.json";

vi.mock("@/lib/asia-i18n", () => ({ useAsia: () => ({ lang: "en" }) }));

describe("official clinic credentials", () => {
  it("keeps every sourced record associated with a real directory identity", () => {
    const keys = new Set<string>();
    for (const record of records) {
      expect(STATIC_CLINICS.some((clinic) => clinic.citySlug === record.citySlug && record.namesZh.includes(clinic.nameZh))).toBe(true);
      for (const name of record.namesZh) {
        const key = `${record.citySlug}:${name}`;
        expect(keys.has(key)).toBe(false);
        keys.add(key);
      }
      expect(record.facts.length).toBeGreaterThan(0);
      for (const fact of record.facts) expect(new URL(fact.sourceUrl).protocol).toMatch(/^https?:$/);
    }
  });

  it("does not transfer a hospital's qualifications to a different city or a newly published clinic", () => {
    const clinic = STATIC_CLINICS.find((clinic) => clinic.nameZh.includes("八大处"))!;
    expect(findClinicCredentials(clinic)).toBeDefined();
    expect(findClinicCredentials({ ...clinic, citySlug: "shanghai" })).toBeUndefined();
    expect(findClinicCredentials({ ...clinic, origin: "published" })).toBeUndefined();
  });

  it("corrects Jiajianmei's institution category and location without breaking its existing English URL identity", () => {
    const clinic = STATIC_CLINICS.find((clinic) => clinic.nameEn === "Beijing Jiajianmei Medical Aesthetic Clinic")!;
    expect(clinic.nameZh).toBe("北京加减美医疗美容门诊部");
    expect(clinic.areaEn).toBe("Xicheng District");
    expect(getClinicPath(clinic)).toContain("beijing-beijing-jiajianmei-aesthetic-hospital-");
    expect(clinic.aliases).toContain("Beijing Jiajianmei Aesthetic Hospital");
    expect(findClinicCredentials(clinic)?.facts[0].valueEn).toContain("Outpatient Clinic");
  });

  it("keeps the privately operated Shulan hospital out of the public hospital category", () => {
    const clinic = STATIC_CLINICS.find((clinic) => clinic.nameZh === "树兰（杭州）医院")!;
    expect(clinic.isPublic).toBe(false);
  });

  it("shows a specific official source and the government registry instead of implying live licence verification", () => {
    const clinic = STATIC_CLINICS.find((clinic) => clinic.nameZh.includes("八大处"))!;
    render(<ClinicCredentials clinic={clinic} />);
    expect(screen.getByRole("link", { name: "Official source" })).toHaveAttribute("href", "https://www.zhengxing.com.cn/page/yiyuanjianjie");
    expect(screen.getByRole("link", { name: /National Health Commission/ })).toHaveAttribute("href", MEDICAL_REGISTRY_URL);
    expect(screen.getByText(clinic.nameZh)).toBeInTheDocument();
  });

  it("does not invent a grade when an institution has no reviewed credentials", () => {
    const clinic = STATIC_CLINICS.find((clinic) => !findClinicCredentials(clinic))!;
    render(<ClinicCredentials clinic={clinic} />);
    expect(screen.getByText(/have not yet been confirmed/)).toBeInTheDocument();
  });
});

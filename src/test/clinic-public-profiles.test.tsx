import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { CLINIC_PUBLIC_PROFILES, findClinicPublicProfile } from "@/data/clinicProfiles";
import { STATIC_CLINICS } from "@/data/clinicDirectory";
import { ClinicComparisonInfo } from "@/components/clinics/ClinicComparisonInfo";
import { clinicProfileCopy, clinicServiceNames } from "@/components/clinics/clinicProfileCopy";
import type { AsiaLang } from "@/lib/asia-i18n";

const state = vi.hoisted(() => ({ lang: "en" }));
vi.mock("@/lib/asia-i18n", () => ({ useAsia: () => ({ lang: state.lang }) }));
afterEach(() => { cleanup(); state.lang = "en"; });

describe("source-backed clinic comparison details", () => {
  it("matches each curated profile to one complete static institution identity", () => {
    expect(CLINIC_PUBLIC_PROFILES).toHaveLength(3);
    for (const profile of CLINIC_PUBLIC_PROFILES) {
      const matches = STATIC_CLINICS.filter((clinic) => findClinicPublicProfile(clinic) === profile);
      expect(matches).toHaveLength(1);
      const clinic = matches[0];
      expect(findClinicPublicProfile({ ...clinic, citySlug: "other-city" })).toBeUndefined();
      expect(findClinicPublicProfile({ ...clinic, nameEn: `${clinic.nameEn} · Branch` })).toBeUndefined();
      expect(findClinicPublicProfile({ ...clinic, nameZh: "不同机构" })).toBeUndefined();
      expect(findClinicPublicProfile({ ...clinic, origin: "published" })).toBeUndefined();
    }
  });

  it("requires a reviewed source for every supplied service, doctor link and campus", () => {
    for (const profile of CLINIC_PUBLIC_PROFILES) {
      expect(profile.sourceUrls.length).toBeGreaterThan(0);
      expect(profile.sourcesReviewedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (profile.services.length) expect(profile.sourceUrls).toContain(profile.serviceSourceUrl);
      if (profile.doctorDirectoryUrl) expect(profile.sourceUrls).toContain(profile.doctorDirectoryUrl);
      if (profile.campus) expect(profile.sourceUrls).toContain(profile.campus.sourceUrl);
      expect(profile.languageSupport).toBe("not-confirmed");
      profile.sourceUrls.forEach((source) => expect(new URL(source).protocol).toBe("https:"));
    }
  });

  it("separates the hospital's official directory from CeladonChina's own profiles", () => {
    const profile = CLINIC_PUBLIC_PROFILES.find((item) => item.identity.citySlug === "beijing")!;
    const onAsk = vi.fn();
    render(<ClinicComparisonInfo profile={profile} onAsk={onAsk} />);
    expect(screen.getByText(/This external directory is separate/)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /View the official doctor directory/ });
    expect(link).toHaveAttribute("href", "https://www.zhengxing.com.cn/page/chuzhenanpai");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByText(/33 Badachu Road/)).toBeInTheDocument();
    expect(screen.queryByText(/Xiaozhuang|East campus/)).not.toBeInTheDocument();
    expect(screen.getByText(/not a licence audit/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Ask about these details" }));
    expect(onAsk).toHaveBeenCalledOnce();
  });

  it("keeps missing facts explicit instead of inventing services, doctors or translation", () => {
    const profile = { ...CLINIC_PUBLIC_PROFILES[0], services: [], serviceSourceUrl: undefined, doctorDirectoryUrl: undefined, campus: undefined };
    render(<ClinicComparisonInfo profile={profile} onAsk={() => {}} />);
    expect(screen.getByText(clinicProfileCopy.servicesMissing.en)).toBeInTheDocument();
    expect(screen.getByText(clinicProfileCopy.doctorsMissing.en)).toBeInTheDocument();
    expect(screen.getByText(clinicProfileCopy.campusMissing.en)).toBeInTheDocument();
    expect(screen.getByText(clinicProfileCopy.languageMissing.en)).toBeInTheDocument();
    expect(screen.getByText("Institution language support")).toBeInTheDocument();
    expect(screen.getByText(clinicProfileCopy.celadonLanguage.en)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View CeladonChina support" })).toHaveAttribute("href", "/travel-packages#support");
    expect(screen.queryByRole("link", { name: /official doctor/ })).not.toBeInTheDocument();
  });

  it("has complete six-language copy and renders every service and field in those languages", () => {
    const langs: AsiaLang[] = ["en", "zh", "ru", "es", "th", "ms"];
    for (const value of [...Object.values(clinicProfileCopy), ...Object.values(clinicServiceNames)]) {
      langs.forEach((lang) => expect(value[lang].trim().length).toBeGreaterThan(0));
    }
    for (const lang of langs) {
      state.lang = lang;
      render(<ClinicComparisonInfo profile={CLINIC_PUBLIC_PROFILES.find((item) => item.identity.citySlug === "beijing")!} onAsk={() => {}} />);
      const region = screen.getByRole("region", { name: clinicProfileCopy.title[lang] });
      expect(within(region).getByText(clinicProfileCopy.languageMissing[lang])).toBeInTheDocument();
      expect(within(region).getByText(clinicProfileCopy.language[lang])).toBeInTheDocument();
      expect(within(region).getByText(clinicProfileCopy.celadonLanguage[lang])).toBeInTheDocument();
      expect(within(region).getByRole("link", { name: clinicProfileCopy.celadonLanguageLink[lang] })).toHaveAttribute("href", "/travel-packages#support");
      expect(within(region).getByText(clinicServiceNames.nose[lang])).toBeInTheDocument();
      expect(within(region).getByRole("button", { name: clinicProfileCopy.inquiry[lang] })).toBeInTheDocument();
      cleanup();
    }
  });
});

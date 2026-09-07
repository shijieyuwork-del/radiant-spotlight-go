import { describe, expect, it } from "vitest";
import { analyticsPagePath, analyticsPageTitle, countryRequiresAnalyticsConsent } from "@/lib/analytics";

describe("privacy-safe analytics page grouping", () => {
  it("groups treatment landing pages instead of sending the procedure slug", () => {
    expect(analyticsPagePath("/lp/rhinoplasty-china")).toBe("/lp/treatment-consultation");
    expect(analyticsPagePath("/lp/blepharoplasty-china")).toBe("/lp/treatment-consultation");
    expect(analyticsPageTitle("/lp/facelift-china")).toBe("Treatment consultation | CeladonChina");
  });

  it("groups other sensitive public paths", () => {
    expect(analyticsPagePath("/treatments/facelift")).toBe("/treatments/procedure-guide");
    expect(analyticsPagePath("/doctors/demo/sample-doctor")).toBe("/doctors/provider-profile");
    expect(analyticsPagePath("/cases/case-123")).toBe("/cases/recovery-diary");
  });

  it("leaves non-sensitive public paths intact", () => {
    expect(analyticsPagePath("/")).toBe("/");
    expect(analyticsPagePath("/privacy")).toBe("/privacy");
    expect(analyticsPagePath("/travel-packages")).toBe("/travel-packages");
  });
});

describe("regional analytics consent", () => {
  it("requires consent in the EEA, UK and Switzerland", () => {
    expect(countryRequiresAnalyticsConsent("DE")).toBe(true);
    expect(countryRequiresAnalyticsConsent("GB")).toBe(true);
    expect(countryRequiresAnalyticsConsent("CH")).toBe(true);
  });

  it("defaults analytics on outside restricted regions", () => {
    expect(countryRequiresAnalyticsConsent("US")).toBe(false);
    expect(countryRequiresAnalyticsConsent("CN")).toBe(false);
    expect(countryRequiresAnalyticsConsent("SG")).toBe(false);
  });

  it("fails closed when Cloudflare country detection is unavailable", () => {
    expect(countryRequiresAnalyticsConsent(null)).toBe(true);
    expect(countryRequiresAnalyticsConsent("")).toBe(true);
  });
});

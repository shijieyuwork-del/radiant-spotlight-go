import { describe, expect, it } from "vitest";
import { analyticsPagePath, analyticsPageTitle } from "@/lib/analytics";

describe("privacy-safe analytics page grouping", () => {
  it("groups treatment landing pages instead of sending the procedure slug", () => {
    expect(analyticsPagePath("/lp/rhinoplasty-china")).toBe("/lp/treatment-consultation");
    expect(analyticsPagePath("/lp/blepharoplasty-china")).toBe("/lp/treatment-consultation");
    expect(analyticsPageTitle("/lp/facelift-china")).toBe("Treatment consultation | Cosmetics Asia");
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

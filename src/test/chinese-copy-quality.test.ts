import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getPlanningMarketingCopy } from "@/lib/planning-marketing-copy";
import { getCoordinationPolicy } from "@/data/coordination-policy";

const source = (path: string) => readFileSync(resolve(process.cwd(), "src", path), "utf8");

describe("Chinese reader-facing copy", () => {
  it("uses clear provider, doctor and travel-planning terminology", () => {
    const copy = getPlanningMarketingCopy("zh");
    expect(copy.title).toBe("比较医院、诊所与医生。");
    expect(copy.subtitle).toContain("咨询、翻译与赴华行程协调支持");
    expect(copy.providers).toBe("我正在比较机构与医生");
  });

  it("keeps free support, the deposit and medical payments distinct", () => {
    const policy = getCoordinationPolicy("zh");
    expect(policy.initialTitle).toBe("免费初步沟通");
    expect(policy.depositTitle).toBe("200 美元协调押金");
    expect(policy.medical).toContain("直接支付给接诊的诊所或医院");
    expect(policy.medical).toContain("不代收医疗费用");
  });

  it("does not reintroduce outdated global-scale or financing claims", () => {
    const chineseCatalogs = `${source("lib/asia-i18n.tsx")}\n${source("lib/translations.ts")}`;
    for (const claim of ["10万+ 真实案例", "6000+ 持证专家", "200万+ 恢复日记", "支持分期 · 先美后付"]) {
      expect(chineseCatalogs).not.toContain(claim);
    }
  });
});

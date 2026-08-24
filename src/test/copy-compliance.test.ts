/**
 * Copy-compliance regression tests.
 *
 * 站点定位：平台只提供信息与协调服务，不提供医疗建议。
 * 这些测试自动检查关键页面/组件中不再出现 "doctor" 医疗建议相关表述，
 * 并验证三种语言（en/zh/ru）都包含免责声明文案与组件挂载。
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SRC = join(__dirname, "..");
const read = (rel: string) => readFileSync(join(SRC, rel), "utf-8");

/* ---------- 允许出现的非文案场景（标识符 / 路由 / 数据表 / 专有名词 / 用户引用） ---------- */
const ALLOWLIST = [
  /import\s/, /from\s+"@?\/?/, /require\(/,
  /\/doctors/, /\.from\("doctors"\)/, /t\("doctors\./, /t\("doc\./,
  /doctor_id|doctorId|doctorName|caseDoctor|doctorRail/,
  /DoctorContactButton|DoctorProfile|VerifiedDoctorBadge|DoctorsSection|DoctorDetail|DoctorAdmin/,
  /publishedDoctors|managedDoctors|demoChinaDoctors|DEMO_CHINA_DOCTORS|\bDOCTORS\b|setPublishedDoctors/,
  /doctor\.[a-z]|\bdoctor\s*[=:,)}\]]|const doctor|!doctor|\(doctor\)|doctor\?:/,
  /doctor-photos/, // 存储桶名
  /Dr\.\s*(Fournier|Coleman)/, // 认证课程专有名词
  /sat with me/, // 患者评价原文引用（UGC）
];

/** 面向用户的禁用表述 */
const BANNED = [
  { re: /\bDoctors?\b/, label: "Doctor/Doctors" },
  { re: /\bDr\.\s/, label: "Dr. honorific" },
  { re: /医生|医师/, label: "医生/医师" },
  { re: /[Вв]рач/, label: "врач" },
];

/** 关键页面与组件（用户可见文案所在） */
const KEY_FILES = [
  "pages/AsiaIndex.tsx",
  "pages/Cases.tsx",
  "pages/CaseDetail.tsx",
  "pages/Doctors.tsx",
  "pages/DoctorDetail.tsx",
  "pages/ManagedDoctorDetail.tsx",
  "pages/Packages.tsx",
  "pages/Cities.tsx",
  "pages/CityDetail.tsx",
  "pages/Treatments.tsx",
  "pages/TreatmentDetail.tsx",
  "pages/WhyChina.tsx",
  "components/QuoteRequest.tsx",
  "components/Footer.tsx",
  "components/SmartSearch.tsx",
  "components/CitySearch.tsx",
  "components/PopularInRegion.tsx",
  "components/TrendingByCountry.tsx",
  "components/WhyTrustGlowy.tsx",
  "components/AppPromoSection.tsx",
  "components/BeforeAfterCard.tsx",
  "components/MedicalDisclaimer.tsx",
  "data/doctors.ts",
  "data/demoChinaDoctors.ts",
  "data/tiktokCases.ts",
  "data/cities.ts",
  "data/treatments.ts",
  "lib/destinations.ts",
];

const violations = (file: string): string[] => {
  const out: string[] = [];
  read(file)
    .split("\n")
    .forEach((line, i) => {
      if (ALLOWLIST.some((a) => a.test(line))) return;
      for (const b of BANNED) {
        if (b.re.test(line)) out.push(`${file}:${i + 1} [${b.label}] ${line.trim().slice(0, 120)}`);
      }
    });
  return out;
};

describe("copy compliance — 不再出现 doctor 医疗建议相关表述", () => {
  for (const file of KEY_FILES) {
    it(`${file} 无禁用表述`, () => {
      expect(violations(file)).toEqual([]);
    });
  }

  it("i18n 字典的文案值中无禁用表述", () => {
    const EXTRA_BANNED = [
      ...BANNED,
      { re: /의사/, label: "의사" },
      { re: /หมอ/, label: "หมอ" },
      { re: /الطبيب/, label: "الطبيب" },
    ];
    for (const dictFile of ["lib/asia-i18n.tsx", "lib/translations.ts"]) {
      const bad: string[] = [];
      read(dictFile)
        .split("\n")
        .forEach((line, i) => {
          // 只检查字典值（"key": "value" 形式），键名是内部标识符
          const m = line.match(/^\s*"[^"]+":\s*"(.*)"\s*,?\s*$/);
          if (!m) return;
          for (const b of EXTRA_BANNED) {
            if (b.re.test(m[1])) bad.push(`${dictFile}:${i + 1} [${b.label}] ${m[1].slice(0, 80)}`);
          }
        });
      expect(bad).toEqual([]);
    }
  });
});

describe("copy compliance — 多语言免责声明", () => {
  const dict = read("lib/asia-i18n.tsx");

  it("disclaimer.text / disclaimer.short 在 en/zh/ru 三个语言块中都存在", () => {
    // 每个语言块以 `en: {` / `zh: {` / `ru: {` 开始
    for (const lang of ["en", "zh", "ru"]) {
      // 字典块以 `en: {` 独占一行开始（区别于顶部 LANGUAGES 元信息的单行定义）
      const blockStart = dict.indexOf(`\n  ${lang}: {\n`);
      expect(blockStart, `缺少 ${lang} 语言块`).toBeGreaterThan(-1);
      const nextBlock = dict.slice(blockStart + 1).search(/\n  (en|zh|ru): \{\n/);
      const block = nextBlock === -1 ? dict.slice(blockStart) : dict.slice(blockStart, blockStart + 1 + nextBlock);
      expect(block, `${lang} 缺少 disclaimer.text`).toContain('"disclaimer.text"');
      expect(block, `${lang} 缺少 disclaimer.short`).toContain('"disclaimer.short"');
    }
  });

  it("三种语言的免责声明都明确“不提供医疗建议”", () => {
    const values = [...dict.matchAll(/"disclaimer\.text":\s*"([^"]+)"/g)].map((m) => m[1]);
    expect(values.length).toBeGreaterThanOrEqual(3);
    const [en, zh, ru] = values;
    expect(en.toLowerCase()).toMatch(/do not (offer|provide) medical advice/);
    expect(zh).toContain("不提供任何医疗建议");
    expect(ru).toMatch(/не предоставляем медицинских советов/);
  });

  it("关键页面与咨询入口挂载了 MedicalDisclaimer 组件", () => {
    const mustMount = [
      "pages/AsiaIndex.tsx", // 首页
      "components/QuoteRequest.tsx", // 咨询入口
      "pages/CaseDetail.tsx", // 转化页
      "pages/DoctorDetail.tsx",
      "pages/Packages.tsx",
      "components/Footer.tsx", // 全站页脚
    ];
    for (const file of mustMount) {
      const src = read(file);
      expect(src, `${file} 未引入 MedicalDisclaimer`).toContain('from "@/components/MedicalDisclaimer"');
      expect(src, `${file} 未渲染 MedicalDisclaimer`).toMatch(/<MedicalDisclaimer/);
    }
  });

  it("MedicalDisclaimer 组件带有可测试标记且使用字典文案", () => {
    const src = read("components/MedicalDisclaimer.tsx");
    expect(src).toContain('data-testid="medical-disclaimer"');
    expect(src).toContain('t("disclaimer.text")');
    expect(src).toContain('t("disclaimer.short")');
  });
});

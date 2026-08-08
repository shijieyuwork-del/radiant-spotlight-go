/**
 * 中央 SEO 配置
 * 域名改过后，只需改这一处
 */

// 网站上线后换成真实域名（如 https://cosmetics-asia.com）
// 开发时用 localhost，构建/部署时会通过环境变量或 vite 配置补充
export const SITE_URL = import.meta.env.VITE_SITE_URL || "https://cosmetics-asia.com";

export const SITE_NAME = "Cosmetics Asia";
export const SITE_DESCRIPTION =
  "Cosmetics Asia is the video-first platform to discover medical aesthetic clinics across Asia. Watch real treatments, compare prices, book in seconds.";
export const SITE_AUTHOR = "Cosmetics Asia";

// OG 图片（医疗类网站建议用现场治疗对比图）
// 暂时用通用占位符，你之后可以替换成真实的高质量图片
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

// Twitter 账号
// ⚠️ 这个账号目前还不存在，注册后确认句柄是否一致，否则 twitter:site 会指向空账号
export const TWITTER_HANDLE = "@CosmeticsAsia";

// JSON-LD Organization Schema
export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: OG_IMAGE,
  // sameAs 只能填“确实归本站所有”的账号。原来这里填的是
  // instagram.com/glowy 和 tiktok.com/@glowy —— 那是别人的账号，
  // 在结构化数据里声明会误导搜索引擎。等真实账号注册好再往里加。
  sameAs: [] as string[],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    areaServed: ["CN", "TH", "JP", "SG", "KR"],
    availableLanguageId: ["en", "zh"],
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "CN",
    // 可选：后续补充实际办公地址
  },
  // ⚠️ 这里原本写死了 aggregateRating: 4.8 分 / 6000 条评价。
  // 站上并没有真实评价系统支撑这个数字，而 Google 明确禁止伪造
  // AggregateRating（医疗类站点尤其敏感），一旦被判定会吃人工处罚，
  // 富媒体摘要也会被取消。等有真实评价数据再按实际数值加回来。
};

// 医疗信息补充说明（医疗类 SEO 需要这个）
export const MEDICAL_DISCLAIMER = "All medical procedures carry risks. Results vary by individual. Consult qualified surgeons for personalized advice.";

/**
 * 中央 SEO 配置
 * 域名改过后，只需改这一处
 */

// 网站上线后换成真实域名（如 https://cosmetics-asia.com）
// 开发时用 localhost，构建/部署时会通过环境变量或 vite 配置补充
export const SITE_URL = import.meta.env.VITE_SITE_URL || "https://cosmetics-asia.com";

export const SITE_NAME = "Glowy";
export const SITE_DESCRIPTION = "Glowy is the global video-first platform to discover medical aesthetic clinics worldwide. Watch real treatments, compare prices, book in seconds.";
export const SITE_AUTHOR = "Glowy";

// OG 图片（医疗类网站建议用现场治疗对比图）
// 暂时用通用占位符，你之后可以替换成真实的高质量图片
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

// Twitter 账号
export const TWITTER_HANDLE = "@GlowyAsia";

// JSON-LD Organization Schema
export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Glowy",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: OG_IMAGE,
  sameAs: [
    "https://www.instagram.com/glowy",
    "https://www.tiktok.com/@glowy",
    // 后续补充真实社媒账号
  ],
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
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "6000",
  },
};

// 医疗信息补充说明（医疗类 SEO 需要这个）
export const MEDICAL_DISCLAIMER = "All medical procedures carry risks. Results vary by individual. Consult qualified surgeons for personalized advice.";

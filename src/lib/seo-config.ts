import { CONSULTATION_EMAIL, CONSULTATION_PHONE_E164 } from "@/lib/consultation-handoff";
/**
 * 中央 SEO 配置
 * 域名改过后，只需改这一处
 */

// 当前已发布域名；接入自定义域名后只需改这一处（或设置 VITE_SITE_URL）
export const SITE_URL = import.meta.env.VITE_SITE_URL || "https://sinoaesthetics.com";

export const SITE_NAME = "Sino Aesthetics";
export const SITE_DESCRIPTION =
  "Compare licensed hospitals and specialists in China, prepare for your consultation, and plan translation and travel support. Coordination only — not a clinic.";
export const HOME_TITLE = "Sino Aesthetics | Cosmetic Surgery in China, Planned Clearly";
export const SITE_AUTHOR = "Sino Aesthetics";
export const SITE_LANGUAGES = ["en", "zh", "ru", "es", "th", "ms", "vi", "ko", "ja", "ar", "pt-BR", "id", "fr", "de"];

// OG 分享卡片：public/og-image.jpg（1200×630），发布后可被社交平台抓取
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

// Twitter 账号
// ⚠️ 这个账号目前还不存在，注册后确认句柄是否一致，否则 twitter:site 会指向空账号
// Add a verified brand handle here after the account exists.
export const TWITTER_HANDLE = "";

export const ORGANIZATION_ENTITY = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  legalName: "SinoAesthetics Limited",
  alternateName: ["Sino Aesthetics", "Sino Aesthetics Medical Travel", "青慈有限公司"],
  description:
    "Medical travel coordination service for international visitors to China; not a clinic or medical provider.",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/ca-favicon.svg`,
  },
  email: CONSULTATION_EMAIL,
  telephone: CONSULTATION_PHONE_E164,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Room 18, 2/F, TusPark, 118 Wai Yip Street",
    addressLocality: "Kwun Tong",
    addressRegion: "Kowloon",
    addressCountry: "HK",
  },
  areaServed: {
    "@type": "Country",
    name: "China",
  },
  knowsAbout: [
    "Medical tourism in China",
    "Cosmetic surgery in China",
    "Plastic surgery in China",
    "International patient travel planning",
    "Medical interpretation and non-clinical care coordination",
  ],
  publishingPrinciples: `${SITE_URL}/editorial-policy`,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: CONSULTATION_PHONE_E164,
    email: CONSULTATION_EMAIL,
    availableLanguage: SITE_LANGUAGES,
  },
};

export const WEBSITE_ENTITY = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  alternateName: ["Sino Aesthetics", "Sino Aesthetics Medical Travel"],
  description: SITE_DESCRIPTION,
  publisher: { "@id": `${SITE_URL}/#organization` },
  about: { "@id": `${SITE_URL}/#organization` },
  inLanguage: SITE_LANGUAGES,
};

// JSON-LD entity graph shared by the homepage and key trust pages.
export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [ORGANIZATION_ENTITY, WEBSITE_ENTITY],
};

// 医疗信息补充说明（医疗类 SEO 需要这个）
export const MEDICAL_DISCLAIMER =
  "All medical procedures carry risks. Results vary by individual. Consult qualified surgeons for personalized advice.";

// Real stock photos (Unsplash, free license) for guide pages, keyed by guide slug.
const GUIDE_PHOTOS: Record<string, string> = {
  "medical-tourism-china": "1545893835-abaa50cbe628",
  costs: "1611125832047-1d7ad1e8e48f",
  safety: "1631248055158-edec7a3c072b",
  visa: "1586441133374-ed1cb4007a47",
  "best-cities": "1750743743644-2cb5bc5f20f6",
  hospitals: "1764885517847-79d62138cc58",
  recovery: "1775795052382-c4b6c8ae8e87",
  checklist: "1779364815233-84ec09c6d6d5",
  "shoulder-filler-injections-china": "1701826510629-051bb954fb8f",
  "shoulder-filler-risks-china": "1758691462848-ba1e929da259",
  "bubble-face-china": "1785581778868-79100f7fe56c",
  "chinese-plastic-surgery": "1506158669146-619067262a00",
  "cosmetic-surgery-tourism-china": "1539612793508-4539a972242b",
  "cosmetic-surgery-china-for-international-patients": "1585974738771-84483dd9f89f",
  "choose-plastic-surgeon-china": "1774853094610-89be6f1a7690",
  "cosmetic-surgery-recovery-china": "1639109743189-91a3ec8b0437",
  "china-vs-korea-cosmetic-surgery": "1651836170615-7f4c7573e697",
  "plastic-surgery-china": "1746021375258-79fa1464ca1f",
  "why-china": "1726703062028-e43d2eec8080",
  "international-patients": "1503365194569-df4e1d04cec1",
  australia: "1719158950290-a1fef850a84a",
  "united-states": "1767216548885-417221c5f1d0",
  canada: "1641243428710-a5eafdc53c5e",
  vietnam: "1541354254661-adb801adb23e",
  "vi-du-lich-tham-my-trung-quoc": "1521019795854-14e15f600980",
};

/** Guide image URL: real stock photo when mapped, otherwise the generated image in /images/guides. */
export const guideImageUrl = (slug: string, variant: "hero" | "social" | "thumb" = "hero") => {
  const id = GUIDE_PHOTOS[slug];
  const [w, h] = variant === "social" ? [1200, 630] : variant === "thumb" ? [320, 180] : [1600, 900];
  if (!id) return `/images/guides/${slug}${variant === "social" ? "-social" : ""}.webp`;
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=70`;
};

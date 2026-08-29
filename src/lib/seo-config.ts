/**
 * 中央 SEO 配置
 * 域名改过后，只需改这一处
 */

// 当前已发布域名；接入自定义域名后只需改这一处（或设置 VITE_SITE_URL）
export const SITE_URL = import.meta.env.VITE_SITE_URL || "https://cosmetics-asia.com";

export const SITE_NAME = "Cosmetics Asia";
export const SITE_DESCRIPTION =
  "Cosmetics Asia helps international patients explore published cosmetic expert profiles, patient journey previews, procedure guides, and practical travel and aftercare support in China.";
export const SITE_AUTHOR = "Cosmetics Asia";

// OG 分享卡片：public/og-image.jpg（1200×630），发布后可被社交平台抓取
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

// Twitter 账号
// ⚠️ 这个账号目前还不存在，注册后确认句柄是否一致，否则 twitter:site 会指向空账号
// Add a verified brand handle here after the account exists.
export const TWITTER_HANDLE = "";

// JSON-LD Organization Schema
export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      logo: `${SITE_URL}/ca-favicon.svg`,
      email: "hello@cosmetics-asia.com",
      telephone: "+1-470-861-3825",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Service",
        telephone: "+1-470-861-3825",
        email: "hello@cosmetics-asia.com",
        availableLanguage: ["English", "Chinese", "Russian"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: "Cosmetics Asia China Medical Travel",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: ["en", "zh", "ru"],
    },
  ],
};

// 医疗信息补充说明（医疗类 SEO 需要这个）
export const MEDICAL_DISCLAIMER = "All medical procedures carry risks. Results vary by individual. Consult qualified surgeons for personalized advice.";

import { useEffect } from "react";
import { SITE_URL, SITE_NAME, OG_IMAGE, TWITTER_HANDLE } from "@/lib/seo-config";

interface PageMetaProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  structuredData?: Record<string, unknown>;
}

const JSONLD_ID = "page-meta-jsonld";

/** Update an existing <meta> in <head>, or create it if absent. */
function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Update an existing <link rel=...>, or create it if absent. */
function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * 为每个页面动态设置 meta 标签
 * 包括：title、description、og:*、twitter:*、canonical、structured data
 *
 * 直接操作 document.head，不依赖 react-helmet-async —— 该库在本项目的
 * React 18 + Vite 组合下不产生任何输出（详见 index.html 注释）。
 * 注意：这些标签只有会执行 JS 的爬虫（如 Googlebot）才能看到；
 * 不执行 JS 的爬虫（Bing、各社交平台预览）看到的是 index.html 里的默认值。
 */
export const PageMeta = ({
  title,
  description,
  path = "/",
  image = OG_IMAGE,
  type = "website",
  structuredData,
}: PageMetaProps) => {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const ld = structuredData ? JSON.stringify(structuredData) : null;

  useEffect(() => {
    document.title = fullTitle;

    setMeta("name", "description", description);
    setLink("canonical", url);

    // Open Graph 必须用 property，用 name 的话 Facebook/LinkedIn 会忽略
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", image);
    setMeta("property", "og:site_name", SITE_NAME);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:site", TWITTER_HANDLE);
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);

    // 结构化数据：每页只保留一个，换页时替换或移除
    const existing = document.getElementById(JSONLD_ID);
    if (existing) existing.remove();
    if (ld) {
      const script = document.createElement("script");
      script.id = JSONLD_ID;
      script.type = "application/ld+json";
      script.textContent = ld;
      document.head.appendChild(script);
    }
  }, [fullTitle, description, url, image, type, ld]);

  return null;
};

export default PageMeta;

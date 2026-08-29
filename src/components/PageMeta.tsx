import { useEffect } from "react";
import { SITE_URL, SITE_NAME, OG_IMAGE, TWITTER_HANDLE } from "@/lib/seo-config";

interface PageMetaProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
  robots?: string;
}

const JSONLD_ID = "page-meta-jsonld";

const SECTION_LABELS: Record<string, string> = {
  cases: "Patient Diaries",
  cities: "Destinations",
  doctors: "Experts",
  treatments: "Procedures",
  "travel-packages": "Travel Support",
  "why-china": "Why China",
};

function createBreadcrumbSchema(path: string, pageTitle: string) {
  const pathname = path.split("?")[0];
  const segments = pathname.split("/").filter(Boolean);
  if (!segments.length) return null;

  const items = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
  ];
  let current = "";
  segments.forEach((segment, index) => {
    current += `/${segment}`;
    items.push({
      "@type": "ListItem",
      position: index + 2,
      name: index === segments.length - 1
        ? pageTitle.replace(` | ${SITE_NAME}`, "")
        : SECTION_LABELS[segment] || segment.replace(/-/g, " "),
      item: `${SITE_URL}${current}`,
    });
  });

  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
}

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
  robots = "index, follow, max-image-preview:large",
}: PageMetaProps) => {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const breadcrumb = createBreadcrumbSchema(path, fullTitle);
  const schemas = [
    ...(Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : []),
    ...(breadcrumb ? [breadcrumb] : []),
  ];
  const ld = schemas.length ? JSON.stringify(schemas) : null;
  // og:image 必须是绝对 URL，相对路径（如城市图 /assets/xx.jpg）补全域名
  const imageAbs = image.startsWith("/") ? `${SITE_URL}${image}` : image;

  useEffect(() => {
    document.title = fullTitle;

    setMeta("name", "description", description);
    setMeta("name", "robots", robots);
    setLink("canonical", url);

    // Open Graph 必须用 property，用 name 的话 Facebook/LinkedIn 会忽略
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", imageAbs);
    setMeta("property", "og:site_name", SITE_NAME);

    setMeta("name", "twitter:card", "summary_large_image");
    if (TWITTER_HANDLE) setMeta("name", "twitter:site", TWITTER_HANDLE);
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", imageAbs);

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
  }, [fullTitle, description, url, imageAbs, type, ld, robots]);

  return null;
};

export default PageMeta;

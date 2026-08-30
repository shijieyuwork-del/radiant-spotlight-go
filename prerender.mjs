#!/usr/bin/env node
/**
 * 构建后预渲染：为每条路由生成一个独立的 index.html，
 * 把该页专属的 title / description / canonical / og / twitter / JSON-LD
 * 直接写进静态 HTML。
 *
 * 为什么需要：本站是纯客户端渲染的 SPA。PageMeta.tsx 只在浏览器执行 JS 之后
 * 才设置这些标签，所以不跑 JS 的爬虫（Bing、Twitter、Facebook、LinkedIn、
 * WhatsApp）永远只能看到 index.html 里的那一份默认值 —— 27 个页面在它们眼里
 * 标题描述完全相同，canonical 还全部指向首页。
 *
 * 这个脚本不做 React SSR（body 仍由客户端渲染），只解决 <head>。
 * 这是投入产出比最高的一刀：搜索引擎和社交预览读的就是 head。
 */
import { build } from "esbuild";
import { readFile, writeFile, mkdir, rm } from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "dist");
const TMP = path.join(__dirname, "node_modules", ".prerender-data.mjs");

/** 把 TS 数据文件打成 Node 能直接 import 的 ESM。图片等资源用 empty loader 掏空。 */
async function loadAppData() {
  await build({
    stdin: {
      contents: `
        export { CITIES, countryOf } from "@/data/cities";
        export { DOCTORS } from "@/data/doctors";
        export { TIKTOK_CASES } from "@/data/tiktokCases";
        export { TREATMENTS } from "@/data/treatments";
        export { PROCEDURE_CATALOG } from "@/data/procedureCatalog";
        export { SITE_URL, SITE_NAME, OG_IMAGE, TWITTER_HANDLE, ORGANIZATION_SCHEMA } from "@/lib/seo-config";
      `,
      resolveDir: __dirname,
      loader: "ts",
    },
    bundle: true,
    format: "esm",
    platform: "node",
    outfile: TMP,
    alias: { "@": path.join(__dirname, "src") },
    loader: {
      ".jpg": "empty", ".jpeg": "empty", ".png": "empty",
      ".webp": "empty", ".svg": "empty", ".gif": "empty",
      ".mp4": "empty", ".css": "empty",
    },
    // seo-config 读 import.meta.env，Node 下没有，喂一个等价值进去
    define: { "import.meta.env.VITE_SITE_URL": JSON.stringify(process.env.VITE_SITE_URL || "https://cosmetics-asia.com") },
    logLevel: "silent",
  });
  return import(pathToFileURL(TMP).href + "?t=" + Date.now());
}

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** 生成一条路由的 <head> 片段。逻辑必须与 PageMeta.tsx 保持一致。 */
function createBreadcrumbSchema(p, pageTitle, siteUrl) {
  const sectionLabels = {
    cases: "Patient Diaries", cities: "Destinations", doctors: "Experts",
    treatments: "Procedures", "travel-packages": "Travel Support", "why-china": "Why China",
    about: "About Cosmetics Asia", "provider-verification": "Provider Verification Standards",
    "medical-review-policy": "Medical Review Policy", "editorial-policy": "Editorial Policy",
  };
  const segments = p.split("?")[0].split("/").filter(Boolean);
  if (!segments.length) return null;
  let current = "";
  const itemListElement = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
  ];
  segments.forEach((segment, index) => {
    current += `/${segment}`;
    itemListElement.push({
      "@type": "ListItem",
      position: index + 2,
      name: index === segments.length - 1 ? pageTitle : sectionLabels[segment] || segment.replace(/-/g, " "),
      item: `${siteUrl}${current}`,
    });
  });
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement };
}

function renderMeta({ title, description, path: p, image, type = "website", schema, robots = "index, follow, max-image-preview:large" }, cfg) {
  const { SITE_URL, SITE_NAME, OG_IMAGE, TWITTER_HANDLE } = cfg;
  const url = `${SITE_URL}${p}`;
  const full = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const img = image && !image.startsWith("data:") && !image.startsWith("/src/") ? image : OG_IMAGE;

  const tags = [
    `<title>${esc(full)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta name="author" content="${esc(SITE_NAME)}" />`,
    `<meta name="robots" content="${esc(robots)}" />`,
    `<meta property="og:type" content="${esc(type)}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(full)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:image" content="${esc(img)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(full)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(img)}" />`,
  ];
  if (TWITTER_HANDLE) tags.push(`<meta name="twitter:site" content="${esc(TWITTER_HANDLE)}" />`);
  const breadcrumb = createBreadcrumbSchema(p, title, SITE_URL);
  const schemas = [...(Array.isArray(schema) ? schema : schema ? [schema] : []), ...(breadcrumb ? [breadcrumb] : [])];
  if (schemas.length) {
    // </script> 会提前闭合标签，必须转义
    const json = JSON.stringify(schemas).replace(/</g, "\\u003c");
    // id 必须与 PageMeta.tsx 的 JSONLD_ID 一致：应用挂载后会按这个 id 找到并
    // 替换掉这份静态的，否则页面上会出现两份 JSON-LD。
    tags.push(`<script type="application/ld+json" id="page-meta-jsonld">${json}</script>`);
  }
  return tags.map((t) => "    " + t).join("\n");
}

/** 枚举全部路由及其 meta。与各页面 PageMeta 调用一一对应。 */
function buildRoutes(d) {
  const routes = [
    {
      path: "/",
      title: "Cosmetic Surgery in Asia | Patient Diaries",
      description:
        "Explore published cosmetic expert profiles, patient journey previews, procedure guides, and practical travel and aftercare support for cosmetic care in China.",
      schema: d.ORGANIZATION_SCHEMA,
    },
    {
      path: "/cities",
      title: "Top Surgery Destinations in Asia",
      description:
        "Explore Seoul, Shanghai, Bangkok, Tokyo, Singapore and more — Asia's cosmetic surgery hubs with specialties, USD pricing, visa info and travel planning.",
    },
    {
      path: "/doctors",
      title: "Cosmetic Expert Profiles in Asia",
      description:
        "Explore published cosmetic expert profiles across Asia, compare listed specialties and credentials, and ask about English-language coordination.",
    },
    {
      path: "/cases",
      title: "Patient Recovery Journey Previews",
      description:
        "Explore cosmetic care journey previews by procedure and city across Asia, with recovery-stage information where available.",
    },
    {
      path: "/travel-packages",
      title: "China Medical Travel Support",
      description: "Plan cosmetic care in China with clear payment terms, airport pickup, in-clinic translation, accommodation guidance and coordinated follow-up.",
    },
    {
      path: "/why-china",
      title: "Why Choose Asia for Surgery",
      description: "Evidence-based reasons to consider cosmetic medical travel in Asia, plus a practical safety checklist and original sources.",
    },
    {
      path: "/privacy",
      title: "Privacy Notice",
      description: "How Cosmetics Asia uses essential storage, optional analytics, and the information you choose to share.",
    },
    {
      path: "/about",
      title: "About Cosmetics Asia",
      description: "Learn how Cosmetics Asia supports cosmetic medical travel research and coordination, what we check, and where our role ends.",
      schema: { "@context": "https://schema.org", "@type": "AboutPage", name: "About Cosmetics Asia" },
    },
    {
      path: "/provider-verification",
      title: "Provider Verification Standards",
      description: "The checks, labels, evidence, and limits behind provider profiles published by Cosmetics Asia.",
    },
    {
      path: "/medical-review-policy",
      title: "Medical Review Policy",
      description: "How Cosmetics Asia labels, sources, reviews, and updates medical information, including when content is not medically reviewed.",
      schema: { "@context": "https://schema.org", "@type": "MedicalWebPage", name: "Medical Review Policy" },
    },
    {
      path: "/editorial-policy",
      title: "Editorial Policy",
      description: "The sourcing, labeling, correction, translation, and commercial disclosure standards used by Cosmetics Asia.",
    },
    {
      path: "/lp/rhinoplasty-china",
      title: "Rhinoplasty in China | Cost, Recovery & Free Consultation",
      description: "Considering rhinoplasty in China? Review realistic cost and recovery ranges, understand travel support, and start with a free, no-obligation consultation.",
    },
    {
      path: "/lp/blepharoplasty-china",
      title: "Blepharoplasty in China | Cost, Recovery & Free Consultation",
      description: "Explore blepharoplasty in China with realistic pricing, recovery guidance, travel coordination, and a free, no-obligation initial consultation.",
    },
    {
      path: "/lp/facelift-china",
      title: "Facelift in China | Cost, Recovery & Free Consultation",
      description: "Considering a facelift in China? Compare realistic cost and recovery ranges, understand travel planning, and begin with a free consultation.",
    },
  ];

  routes.push({
    path: "/treatments",
    title: "Cosmetic Procedures in China | Surgery Types & Guides",
    description:
      "Explore cosmetic procedures in China, including plastic surgery, hair restoration, cosmetic dentistry, skin and non-surgical treatments, with detailed recovery and risk guides.",
  });

  const richTreatments = new Map(d.TREATMENTS.map((t) => [t.slug, t]));
  for (const procedure of d.PROCEDURE_CATALOG) {
    const t = richTreatments.get(procedure.slug);
    const description = t?.summaryEn ??
      `Learn what to discuss when considering ${procedure.en} in China, including planning, provider checks, risks and next steps.`;
    routes.push({
      path: `/treatments/${procedure.slug}`,
      title: `${procedure.en} in China | Procedure Overview`,
      description,
      schema: {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        name: `${procedure.en} in China | Procedure Overview`,
        description,
        about: {
          "@type": "MedicalProcedure",
          name: procedure.en,
        },
        audience: { "@type": "Patient" },
        dateModified: "2026-08-30",
        publisher: { "@id": `${d.SITE_URL}/#organization` },
      },
    });
  }

  for (const c of d.CITIES) {
    routes.push({
      path: `/cities/${c.slug}`,
      title: `${c.en} | Medical Aesthetics, Cosmetic Surgeons & Prices`,
      description: `Plan cosmetic medical travel in ${c.en}. Explore local logistics, commonly requested procedures and published expert profiles.`,
      schema: {
        "@context": "https://schema.org",
        "@type": "City",
        name: c.en,
        description: c.taglineEn,
        address: { "@type": "PostalAddress", addressCountry: d.countryOf(c.slug) },
      },
    });
  }

  for (const doc of d.DOCTORS) {
    routes.push({
      path: `/doctors/${doc.id}`,
      includeInSitemap: false,
      robots: "noindex, follow",
      title: `${doc.en} - ${doc.titleEn} in ${doc.cityEn}`,
      description: `View a published profile for ${doc.en} in ${doc.cityEn}, including listed specialties, languages and clinic information. Confirm current credentials directly before treatment.`,
      schema: {
        "@context": "https://schema.org",
        "@type": "Physician",
        name: doc.en,
        jobTitle: doc.titleEn,
        workLocation: {
          "@type": "Place",
          name: doc.clinicEn,
          address: { "@type": "PostalAddress", addressCountry: d.countryOf(doc.cityEn), addressLocality: doc.cityEn },
        },
        ...(doc.languages ? { knowsLanguage: doc.languages } : {}),
      },
    });
  }

  for (const item of d.TIKTOK_CASES) {
    const treatment = item.treatment.en;
    routes.push({
      path: `/cases/${item.id}`,
      includeInSitemap: false,
      robots: "noindex, follow",
      title: `${treatment} | Patient Journey Preview`,
      description: `View a ${treatment} journey preview with available procedure, location and recovery-stage information. Provider details may still be pending review.`,
      type: "article",
      schema: {
        "@context": "https://schema.org",
        "@type": "MedicalCase",
        name: treatment,
        description: item.caption.en,
      },
    });
  }

  return routes;
}

async function main() {
  const d = await loadAppData();
  const template = await readFile(path.join(DIST, "index.html"), "utf8");

  const MARKER = /<!--SEO-->[\s\S]*?<!--\/SEO-->/;
  if (!MARKER.test(template)) {
    console.error("prerender: index.html 里找不到 <!--SEO--> 标记，中止");
    process.exit(1);
  }

  const routes = buildRoutes(d);
  const cfg = d;

  for (const r of routes) {
    const html = template.replace(
      MARKER,
      `<!--SEO-->\n${renderMeta(r, cfg)}\n    <!--/SEO-->`
    );
    if (r.path === "/") {
      await writeFile(path.join(DIST, "index.html"), html, "utf8");
      continue;
    }

    // Emit both forms because hosting platforms differ: some resolve clean URLs
    // through /path.html, while Lovable resolves them through /path/index.html.
    const flatFile = path.join(DIST, `${r.path}.html`);
    const directoryFile = path.join(DIST, r.path, "index.html");
    await mkdir(path.dirname(flatFile), { recursive: true });
    await mkdir(path.dirname(directoryFile), { recursive: true });
    await Promise.all([
      writeFile(flatFile, html, "utf8"),
      writeFile(directoryFile, html, "utf8"),
    ]);
  }

  const sitemapUrls = routes
    .filter((route) => route.includeInSitemap !== false)
    .map((route) => `  <url>\n    <loc>${esc(`${cfg.SITE_URL}${route.path}`)}</loc>\n  </url>`)
    .join("\n");
  await writeFile(
    path.join(DIST, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`,
    "utf8",
  );

  await rm(TMP, { force: true });
  console.log(`prerender: 已生成 ${routes.length} 个静态页面`);
}

main().catch((e) => {
  console.error("prerender failed:", e);
  process.exit(1);
});

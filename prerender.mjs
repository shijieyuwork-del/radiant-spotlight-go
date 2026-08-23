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
function renderMeta({ title, description, path: p, image, type = "website", schema }, cfg) {
  const { SITE_URL, SITE_NAME, OG_IMAGE, TWITTER_HANDLE } = cfg;
  const url = `${SITE_URL}${p}`;
  const full = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const img = image && !image.startsWith("data:") && !image.startsWith("/src/") ? image : OG_IMAGE;

  const tags = [
    `<title>${esc(full)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta name="author" content="${esc(SITE_NAME)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<meta property="og:type" content="${esc(type)}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(full)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:image" content="${esc(img)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="${esc(TWITTER_HANDLE)}" />`,
    `<meta name="twitter:title" content="${esc(full)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(img)}" />`,
  ];
  if (schema) {
    // </script> 会提前闭合标签，必须转义
    const json = JSON.stringify(schema).replace(/</g, "\\u003c");
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
        "Compare verified cosmetic surgeons across Asia, watch real patient recovery diaries, get transparent prices, and plan travel and aftercare in English with Cosmetics Asia.",
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
      title: "Verified Cosmetic Surgeons in Asia",
      description:
        "Review verified surgeon profiles across Asia, compare specialties and credentials, and book a free consultation with English-language coordination.",
    },
    {
      path: "/cases",
      title: "Real Patient Recovery Diaries",
      description:
        "Watch real before-and-after recovery diaries by procedure and city across Asia — timelines, prices, surgeon info and verified results.",
    },
    {
      path: "/travel-packages",
      title: "Medical Travel Packages",
      description: "Compare concierge packages for your Asia surgery trip — airport pickup, in-clinic translation, hotel help, and coordinated aftercare.",
    },
    {
      path: "/why-china",
      title: "Why Choose Asia for Surgery",
      description: "Evidence-based reasons to consider cosmetic medical travel in Asia, plus a practical safety checklist and original sources.",
    },
  ];

  routes.push({
    path: "/treatments",
    title: "Cosmetic Surgery Procedures Explained | Recovery, Risks & Costs",
    description:
      "Plain-language guides to rhinoplasty, blepharoplasty, facelift, liposuction, breast augmentation and tummy tuck: how each procedure works, who it suits, real recovery timelines, honest risks, and what to ask your surgeon.",
  });

  for (const t of d.TREATMENTS) {
    routes.push({
      path: `/treatments/${t.slug}`,
      title: `${t.en} — What It Involves, Recovery, Risks & Cost`,
      description: t.summaryEn,
      schema: {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        name: `${t.en} — Procedure Guide`,
        description: t.summaryEn,
        about: {
          "@type": "MedicalProcedure",
          name: t.en,
          procedureType: "https://schema.org/SurgicalProcedure",
        },
        audience: { "@type": "Patient" },
        lastReviewed: "2026-08-07",
      },
    });
  }

  for (const c of d.CITIES) {
    routes.push({
      path: `/cities/${c.slug}`,
      title: `${c.en} | Medical Aesthetics, Cosmetic Surgeons & Prices`,
      description: `Discover the best cosmetic surgeons and clinics in ${c.en}. ${c.doctorsCount}+ verified doctors, real patient cases, compare prices. ${c.savings} less than US clinics.`,
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
      title: `${doc.en} - ${doc.titleEn} in ${doc.cityEn}`,
      description: `Consult ${doc.en}, a board-certified surgeon in ${doc.cityEn} with ${doc.years}+ years experience and ${doc.reviews}+ verified patient reviews. Specializes in ${doc.specEn.slice(0, 2).join(", ")}.`,
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
      title: `${treatment} - Real Patient Case | Before & After`,
      description: `Watch a real before-and-after ${treatment} procedure performed in Asia. Patient recovery timeline, price, surgeon info, and verified results.`,
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
    // 扁平输出：/cities/seoul -> dist/cities/seoul.html
    // 若写成 dist/cities/seoul/index.html，Cloudflare Pages 会 308 跳到带斜杠的
    // URL，而我们的 canonical 和 sitemap 都是不带斜杠的形式，白白多一跳。
    const outFile =
      r.path === "/" ? path.join(DIST, "index.html") : path.join(DIST, `${r.path}.html`);
    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, html, "utf8");
  }

  const lastmod = new Date().toISOString().slice(0, 10);
  const sitemapUrls = routes
    .filter((route) => route.includeInSitemap !== false)
    .map((route) => `  <url>\n    <loc>${esc(`${cfg.SITE_URL}${route.path}`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
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

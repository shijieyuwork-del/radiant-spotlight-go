import { pinyin } from "pinyin-pro";
import { CITIES } from "@/data/cities";
import { PROCEDURE_CATALOG } from "@/data/procedureCatalog";
import { SITE_URL } from "@/lib/seo-config";
import { localizedField } from "@/lib/i18n-content";
import type { DirectoryClinic } from "@/data/clinicDirectory";
import type { AsiaLang } from "@/lib/asia-i18n";

export type CaseExpert = {
  id: string;
  name: string;
  title: string;
  hospital: string;
  city: string;
  specialties: string[];
  bio: string;
  credentials: string | null;
  languages: string | null;
  photo_path: string | null;
  created_at: string;
  status: string;
  i18n: unknown;
  name_en?: string;
  name_pinyin?: string;
  photo?: string;
};
export type PublishedCase = {
  id: string;
  title: string;
  caption: string | null;
  procedure: string | null;
  city: string | null;
  doctor_id: string | null;
  storage_path: string;
  cover_path: string | null;
  created_at: string;
  updated_at?: string;
  status: string;
  i18n: unknown;
  placement?: string;
  duration?: number;
  cover_url?: string;
  doctors?: Pick<CaseExpert, "name" | "i18n" | "status"> | null;
};
export const asciiSlug = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const expertName = (expert: Pick<CaseExpert, "name" | "i18n"> & Partial<CaseExpert>, lang: AsiaLang = "en") => {
  if (lang !== "en") return localizedField(expert.i18n, "name", lang, expert.name);
  const name = expert.name_en || expert.name_pinyin || localizedField(expert.i18n, "name", "en", expert.name);
  return /\p{Script=Han}/u.test(name)
    ? pinyin(name.replace(/院长|专家|医师|医生/g, ""), { toneType: "none" })
    : name.replace(/^(?:Dr\.?|Expert)\s+/i, "");
};
export function caseFacts(row: Pick<PublishedCase, "procedure" | "city" | "i18n">, lang: AsiaLang = "en") {
  let procedure = localizedField(row.i18n, "procedure", lang, row.procedure);
  let city = localizedField(row.i18n, "city", lang, row.city);
  if (lang === "en") {
    procedure = PROCEDURE_CATALOG.find((item) => item.zh === procedure)?.en || procedure;
    city = CITIES.find((item) => item.zh === city || item.slug === city.toLowerCase())?.en || city;
  }
  if (/^(未提供|unknown|not provided)$/i.test(city)) city = "";
  return { procedure: procedure || (lang === "zh" ? "医美" : "Aesthetic care"), city };
}
export function casePath(
  row: Pick<PublishedCase, "id" | "procedure" | "city" | "i18n">,
  expert?: Pick<CaseExpert, "name" | "i18n"> | null,
) {
  const { procedure, city } = caseFacts(row);
  return `/cases/${asciiSlug(procedure) || "aesthetic-care"}-${asciiSlug(city) || "china"}-${expert ? asciiSlug(expertName(expert)) || "case" : "case"}-${row.id.slice(0, 8).toLowerCase()}`;
}
export const caseIdPrefix = (slug: string) => slug.match(/(?:^|-)([a-f0-9]{8})$/i)?.[1].toLowerCase() ?? null;
export function resolveCase(slug: string, rows: PublishedCase[]) {
  const exact = rows.find((row) => row.id === slug && row.status === "published");
  if (exact) return exact;
  const prefix = caseIdPrefix(slug);
  const matches = prefix
    ? rows.filter((row) => row.status === "published" && row.id.toLowerCase().startsWith(prefix))
    : [];
  return matches.length === 1 ? matches[0] : undefined;
}
export const expertPath = (id: string) => `/doctors/profile/${id}`;
export const caseMediaUrl = (id: string, kind: "video" | "thumb") =>
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/case-media/${encodeURIComponent(id)}/${kind}`;
let coverManifestText = "";
let coverManifest: Record<string, { path: string; url: string }> = {};
export function caseCoverUrl(row: Pick<PublishedCase, "id" | "cover_path" | "cover_url">, absolute = false) {
  if (!row.cover_path) return "";
  if (typeof document !== "undefined") {
    const text = document.getElementById("case-cover-data")?.textContent ?? "";
    if (text !== coverManifestText) {
      coverManifestText = text;
      try {
        coverManifest = JSON.parse(text || "{}");
      } catch {
        coverManifest = {};
      }
    }
  }
  const entry = typeof document !== "undefined" ? coverManifest[row.id] : undefined;
  const url = row.cover_url || (entry?.path === row.cover_path ? entry.url : "") || caseMediaUrl(row.id, "thumb");
  return absolute ? new URL(url, SITE_URL).href : url;
}
export function casePageMeta(row: PublishedCase, expert?: CaseExpert | null, lang: AsiaLang = "en") {
  const { procedure, city } = caseFacts(row, lang);
  const name = expert ? expertName(expert, lang) : "";
  const title =
    lang === "zh"
      ? `${city} ${procedure} 案例${name ? ` · ${name}专家` : ""}`.trim()
      : `${procedure} case${city ? ` in ${city}` : " in China"}${name ? ` with ${name}` : ""}`;
  const description =
    lang === "zh"
      ? `${title}。查看已发布的视频及项目、地点${name ? "和专家" : ""}资料。具体评估及医疗服务由接诊机构负责，结果因人而异。`
      : `${title}. View the published video and listed procedure, location${name ? " and expert" : ""} information. Individual assessment and clinical care remain with the treating facility.`;
  const path = casePath(row, expert);
  const canonical = `${SITE_URL}${path}`;
  const indexable = row.status === "published" && Boolean(row.cover_path);
  const video: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: title,
    description,
    thumbnailUrl: caseCoverUrl(row, true),
    contentUrl: caseMediaUrl(row.id, "video"),
    uploadDate: new Date(row.created_at).toISOString(),
    embedUrl: canonical,
    ...(row.duration && row.duration > 0 ? { duration: `PT${row.duration}S` } : {}),
    ...(expert
      ? { about: { "@type": "Physician", name: expertName(expert), url: `${SITE_URL}${expertPath(expert.id)}` } }
      : {}),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      ["Home", "/"],
      ["Cases", "/cases"],
      [caseFacts(row).procedure, `/cases?treatment=${encodeURIComponent(caseFacts(row).procedure)}`],
      [title, path],
    ].map(([name, item], index) => ({ "@type": "ListItem", position: index + 1, name, item: `${SITE_URL}${item}` })),
  };
  return {
    title,
    absoluteTitle: true,
    description,
    path,
    image: indexable ? caseCoverUrl(row, true) : undefined,
    robots: indexable ? "index, follow, max-image-preview:large" : "noindex, follow",
    includeBreadcrumb: false,
    structuredData: indexable ? [video, breadcrumb] : [breadcrumb],
  };
}
export function expertPageMeta(
  expert: CaseExpert,
  clinic?: DirectoryClinic,
  cases: Pick<PublishedCase, "procedure" | "city" | "i18n">[] = [],
) {
  const name = expertName(expert);
  const city = localizedField(expert.i18n, "city", "en", expert.city);
  const hospital = localizedField(expert.i18n, "hospital", "en", expert.hospital);
  const url = `${SITE_URL}${expertPath(expert.id)}`;
  // The procedure with the most published case videos becomes the profile’s stated focus.
  const tally = new Map<string, number>();
  for (const row of cases) {
    const procedure = caseFacts(row).procedure;
    tally.set(procedure, (tally.get(procedure) ?? 0) + 1);
  }
  const focus =
    [...tally.entries()]
      .filter(([procedure]) => !/^(aesthetic care|cosmetic surgery|clinic introduction)$/i.test(procedure))
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? "";
  const focusTitle = focus.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
  return {
    title: focus ? `${name}: ${focusTitle} Expert in ${city}` : `${name} | Expert in ${city}`,
    description: focus
      ? `${name} at ${hospital}, ${city}. Watch published ${focus.toLowerCase()} case videos, review listed specialties and credentials, and ask about a consultation.`
      : `${name} at ${hospital}, ${city}. Explore listed specialties and published case videos.`,
    path: expertPath(expert.id),
    image: expert.photo || undefined,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Physician",
      name,
      url,
      ...(expert.photo ? { image: expert.photo } : {}),
      ...(expert.specialties.length
        ? {
            medicalSpecialty: localizedField(expert.i18n, "specialties", "en", expert.specialties.join(", "))
              .split(/[,，、]/)
              .map((s) => s.trim()),
          }
        : {}),
      ...(hospital
        ? {
            worksFor: {
              "@type": "MedicalOrganization",
              name: hospital,
              ...(clinic ? { url: `${SITE_URL}/clinics/${clinic.slug}` } : {}),
            },
          }
        : {}),
      address: { "@type": "PostalAddress", addressLocality: city, addressCountry: "CN" },
    },
  };
}

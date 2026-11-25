import { CITIES } from "@/data/cities";
import { PROCEDURE_CATALOG } from "@/data/procedureCatalog";
import { CITY_PRICE_PROCEDURES } from "@/data/cityPriceRefs";
import { caseFacts, type CaseExpert, type PublishedCase } from "@/lib/case-seo";
import { localizedField } from "@/lib/i18n-content";
import { SITE_URL } from "@/lib/seo-config";
import { treatmentFaqs } from "@/lib/treatment-faqs";

export type TreatmentCity = {
  procedureSlug: string;
  citySlug: string;
  caseCount: number;
  doctorCount: number;
  lastmod?: string;
};
export type TreatmentRecords = { videos: PublishedCase[]; doctors: CaseExpert[] };
const normalized = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[–—_-]+/g, " ")
    .replace(/\s+/g, " ");
const aliases: Record<string, string[]> = {
  rhinoplasty: ["鼻整形"],
  facelift: ["拉皮", "Facelift (SMAS)"],
  "double-eyelid-surgery": ["Double eyelid", "双眼皮手术"],
  blepharoplasty: ["Eyelid surgery", "眼整形", "眼部整形"],
};
export function matchesProcedure(value: string, slug: string) {
  const procedure = PROCEDURE_CATALOG.find((p) => p.slug === slug);
  if (!procedure) return false;
  return [procedure.en, procedure.zh, slug, ...(aliases[slug] ?? [])].some(
    (name) => normalized(name) === normalized(value),
  );
}
export function matchesCity(value: string, slug: string) {
  const city = CITIES.find((c) => c.slug === slug);
  return Boolean(city && [city.en, city.zh, slug].some((name) => normalized(name) === normalized(value)));
}
export function procedureCases(data: TreatmentRecords, slug: string, citySlug?: string) {
  return data.videos.filter(
    (v) =>
      v.status === "published" &&
      Boolean(v.cover_path) &&
      matchesProcedure(caseFacts(v).procedure, slug) &&
      (!citySlug || matchesCity(caseFacts(v).city, citySlug)),
  );
}
export function procedureExperts(data: TreatmentRecords, slug: string, citySlug?: string) {
  const publishedCases = data.videos.filter(
    (v) => v.status === "published" && matchesProcedure(caseFacts(v).procedure, slug),
  );
  const caseIds = new Set(publishedCases.map((v) => v.doctor_id));
  return data.doctors
    .filter(
      (doc) =>
        doc.status === "published" &&
        (!citySlug || matchesCity(localizedField(doc.i18n, "city", "en", doc.city), citySlug)) &&
        (caseIds.has(doc.id) ||
          [...(doc.specialties ?? []), ...localizedField(doc.i18n, "specialties", "en", "").split(/[,，、;；]/)].some(
            (s) => matchesProcedure(s, slug),
          )),
    )
    .sort(
      (a, b) =>
        publishedCases.filter((v) => v.doctor_id === b.id).length -
          publishedCases.filter((v) => v.doctor_id === a.id).length || a.id.localeCompare(b.id),
    );
}
export function newestRowTimestamp(rows: { created_at?: string; updated_at?: string }[]) {
  const times = rows
    .flatMap((r) => [r.updated_at, r.created_at])
    .filter((t): t is string => Boolean(t) && Number.isFinite(Date.parse(t ?? "")));
  return times.length ? new Date(Math.max(...times.map((t) => Date.parse(t)))).toISOString() : undefined;
}
export const treatmentCityPath = (page: Pick<TreatmentCity, "procedureSlug" | "citySlug">) =>
  `/treatments/${page.procedureSlug}/${page.citySlug}`;
export function buildTreatmentCities(data: TreatmentRecords): TreatmentCity[] {
  const result: TreatmentCity[] = [];
  for (const procedure of PROCEDURE_CATALOG) {
    for (const city of CITIES) {
      const videos = procedureCases(data, procedure.slug, city.slug);
      const doctors = procedureExperts(data, procedure.slug, city.slug);
      if (videos.length < 3 && doctors.length < 2) continue;
      const evidence = data.videos.filter(
        (v) =>
          v.status === "published" &&
          doctors.some((d) => d.id === v.doctor_id) &&
          matchesProcedure(caseFacts(v).procedure, procedure.slug),
      );
      result.push({
        procedureSlug: procedure.slug,
        citySlug: city.slug,
        caseCount: videos.length,
        doctorCount: doctors.length,
        lastmod: newestRowTimestamp([...videos, ...doctors, ...evidence]),
      });
    }
  }
  return result;
}
export function treatmentCityMeta(page: TreatmentCity, zh = false) {
  const procedure = PROCEDURE_CATALOG.find((p) => p.slug === page.procedureSlug);
  const city = CITIES.find((c) => c.slug === page.citySlug);
  const name = (zh ? procedure?.zh : procedure?.en) ?? page.procedureSlug;
  const place = (zh ? city?.zh : city?.en) ?? page.citySlug;
  const title = zh
    ? `${place}${name}：专家、真实案例与价格（2026）`
    : `${name} in ${place}: experts, real cases and cost (2026)`;
  const price = CITY_PRICE_PROCEDURES.find(
    (p) => p.slug === page.procedureSlug || (!p.slug && normalized(p.en) === normalized(procedure?.en ?? "")),
  );
  const description = zh
    ? `${place}有 ${page.doctorCount} 位已发布的相关合作专家，${page.caseCount} 个带封面的真实案例视频。${price ? `中国全国参考价格约 ¥${price.cny.toLocaleString("en-US")}，不是${place}当地报价。` : "比较已发布的专家与案例资料，具体价格由接诊机构确认。"}`
    : `${page.doctorCount} published partner experts and ${page.caseCount} real case videos with covers for ${name} in ${place}. ${price ? `China-wide reference: approximately ¥${price.cny.toLocaleString("en-US")}, not a ${place}-specific quote.` : "Compare published expert and case information; the treating facility confirms individual costs."}`;
  const path = treatmentCityPath(page);
  const faqs = treatmentFaqs(page.procedureSlug, zh).slice(0, 3);
  return {
    title,
    absoluteTitle: true,
    description,
    path,
    includeBreadcrumb: false,
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          ["Home", "/"],
          ["Treatments", "/treatments"],
          [name, `/treatments/${page.procedureSlug}`],
          [place, path],
        ].map(([label, url], index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: label,
          item: `${SITE_URL}${url}`,
        })),
      },
      ...(faqs.length
        ? [
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map(([question, answer]) => ({
                "@type": "Question",
                name: question,
                acceptedAnswer: { "@type": "Answer", text: answer },
              })),
            },
          ]
        : []),
    ],
  };
}

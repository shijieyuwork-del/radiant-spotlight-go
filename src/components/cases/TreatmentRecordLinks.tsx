import { Link } from "react-router-dom";
import { CITIES } from "@/data/cities";
import { PROCEDURE_CATALOG } from "@/data/procedureCatalog";
import { caseFacts, caseMediaUrl, casePath, expertName, expertPath } from "@/lib/case-seo";
import { useAsia } from "@/lib/asia-i18n";
import { localizedField } from "@/lib/i18n-content";
import { useTreatmentRecords } from "@/hooks/use-treatment-records";
import { procedureCases, procedureExperts, treatmentCityPath, type TreatmentRecords } from "@/lib/treatment-city-seo";

export function ProcedureRecords({ data, slug, citySlug, limit = 6 }: { data: TreatmentRecords; slug: string; citySlug?: string; limit?: number }) {
  const { lang } = useAsia();
  const zh = lang === "zh";
  const doctors = procedureExperts(data, slug, citySlug).slice(0, citySlug ? undefined : 6);
  const videos = procedureCases(data, slug, citySlug).slice(0, limit);
  return <>
    {doctors.length > 0 && <section className="mt-10 border-t border-border pt-8"><h2 className="font-display text-2xl">{zh ? "相关合作专家" : "Related partner experts"}</h2><ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{doctors.map((doc) => <li key={doc.id}><Link to={expertPath(doc.id)} className="block rounded-lg border border-border bg-card p-5 hover:border-primary"><h3 className="font-display text-xl">{expertName(doc, lang)}</h3><p className="mt-2 text-sm text-muted-foreground">{localizedField(doc.i18n, "hospital", lang, doc.hospital)}</p><p className="mt-2 text-sm text-muted-foreground">{localizedField(doc.i18n, "city", lang, doc.city)}</p></Link></li>)}</ul></section>}
    {videos.length > 0 && <section className="mt-10 border-t border-border pt-8"><h2 className="font-display text-2xl">{zh ? "真实案例视频" : "Real case videos"}</h2><ul className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-3">{videos.map((v) => {
      const doc = data.doctors.find((d) => d.id === v.doctor_id);
      const facts = caseFacts(v, lang);
      return <li key={v.id} className="overflow-hidden rounded-lg border border-border bg-card"><video controls playsInline preload="none" src={caseMediaUrl(v.id, "video")} poster={caseMediaUrl(v.id, "thumb")} className="aspect-[9/16] max-h-[28rem] w-full bg-muted object-contain" /><Link to={casePath(v, doc)} className="block p-4 text-sm font-medium underline underline-offset-4">{facts.procedure} · {facts.city}{doc ? ` · ${expertName(doc, lang)}` : ""}</Link></li>;
    })}</ul></section>}
  </>;
}
export default function TreatmentRecordLinks({ procedureSlug, citySlug }: { procedureSlug?: string; citySlug?: string }) {
  const { data } = useTreatmentRecords();
  const { lang } = useAsia();
  const pages = (data?.treatmentCities ?? []).filter((p) => (!procedureSlug || p.procedureSlug === procedureSlug) && (!citySlug || p.citySlug === citySlug));
  if (!data) return null;
  return <>
    {pages.length > 0 && <section className="mt-10 border-t border-border pt-8"><h2 className="font-display text-2xl">{procedureSlug ? lang === "zh" ? "可选城市" : "Available in" : lang === "zh" ? "本城市项目与真实案例" : "Procedures and real cases in this city"}</h2><ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">{pages.map((p) => <li key={treatmentCityPath(p)}><Link className="text-brand underline underline-offset-4" to={treatmentCityPath(p)}>{procedureSlug ? CITIES.find((c) => c.slug === p.citySlug)?.[lang === "zh" ? "zh" : "en"] : PROCEDURE_CATALOG.find((t) => t.slug === p.procedureSlug)?.[lang === "zh" ? "zh" : "en"]}</Link></li>)}</ul></section>}
    {procedureSlug && <ProcedureRecords data={data} slug={procedureSlug} />}
  </>;
}

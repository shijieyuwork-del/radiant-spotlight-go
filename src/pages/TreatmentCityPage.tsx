import { Link, useParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import QuoteCtaButton from "@/components/QuoteCtaButton";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { Button } from "@/components/ui/button";
import { ProcedureRecords } from "@/components/cases/TreatmentRecordLinks";
import { CITIES } from "@/data/cities";
import { PROCEDURE_CATALOG } from "@/data/procedureCatalog";
import { useTreatmentRecords } from "@/hooks/use-treatment-records";
import { useAsia } from "@/lib/asia-i18n";
import { treatmentCityMeta, treatmentCityPath } from "@/lib/treatment-city-seo";
import { treatmentFaqs } from "@/lib/treatment-faqs";
import { consultationHandoffUrl } from "@/lib/consultation-handoff";
import NotFound from "@/pages/NotFound";

export default function TreatmentCityPage() {
  const { procedureSlug = "", citySlug = "" } = useParams();
  const { data, isLoading, error } = useTreatmentRecords();
  const { lang } = useAsia();
  const zh = lang === "zh";
  const page = data?.treatmentCities?.find((p) => p.procedureSlug === procedureSlug && p.citySlug === citySlug);
  if (!page || !data) {
    if (isLoading || error) return <><PageMeta title="Procedure and city" description="Published procedure and city information" path={`/treatments/${procedureSlug}/${citySlug}`} robots="noindex, follow" /><main className="container min-h-[55vh] py-16" aria-busy={isLoading}>{error ? "Published information is temporarily unavailable." : null}</main></>;
    return <NotFound />;
  }
  const procedure = PROCEDURE_CATALOG.find((p) => p.slug === procedureSlug);
  const city = CITIES.find((c) => c.slug === citySlug);
  const meta = treatmentCityMeta(page, zh);
  const faqs = treatmentFaqs(procedureSlug, zh).slice(0, 3);
  const ctx = { procedure: procedure?.en, city: city?.en, source: "treatment_city_page" };
  const sameProcedure = data.treatmentCities?.filter((p) => p.procedureSlug === procedureSlug && p.citySlug !== citySlug) ?? [];
  const sameCity = data.treatmentCities?.filter((p) => p.citySlug === citySlug && p.procedureSlug !== procedureSlug) ?? [];
  return <div className="min-h-screen bg-background">
    <PageMeta {...meta} /><AsiaNavbar />
    <main className="container max-w-6xl py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="flex flex-wrap gap-x-3 gap-y-2 text-sm text-brand"><Link to="/treatments">{zh ? "项目" : "Treatments"}</Link><span>/</span><Link to={`/treatments/${procedureSlug}`}>{zh ? procedure?.zh : procedure?.en}</Link><span>/</span>{city && <Link to={`/cities/${citySlug}`}>{zh ? city.zh : city.en}</Link>}</nav>
      <h1 className="mt-6 font-display text-3xl leading-tight md:text-4xl">{meta.title}</h1>
      <p className="mt-5 max-w-4xl leading-relaxed text-muted-foreground">{meta.description}</p>
      <div className="mt-6"><MedicalDisclaimer /></div>
      <div className="mt-6 flex flex-wrap gap-3"><QuoteCtaButton quoteCtx={ctx} /><Button asChild variant="outline"><a href={consultationHandoffUrl("whatsapp", ctx)} target="_blank" rel="noreferrer"><MessageCircle className="mr-2 size-4" />WhatsApp</a></Button></div>
      <ProcedureRecords data={data} slug={procedureSlug} citySlug={citySlug} limit={12} />
      <Link to={`/cases?treatment=${encodeURIComponent(procedure?.en ?? procedureSlug)}&city=${encodeURIComponent(city?.en ?? citySlug)}`} className="mt-6 inline-block text-brand underline underline-offset-4">{zh ? "查看本项目在本城市的全部案例" : `All ${procedure?.en} cases in ${city?.en}`}</Link>
      {faqs.length > 0 && <section className="mt-10 border-t border-border pt-8"><h2 className="font-display text-2xl">{zh ? "常见问题" : "Frequently asked questions"}</h2>{faqs.map(([question, answer]) => <details key={question} className="border-b border-border py-4"><summary className="cursor-pointer font-medium">{question}</summary><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{answer}</p></details>)}</section>}
      <section className="mt-10 border-t border-border pt-8"><h2 className="font-display text-2xl">{zh ? "相关城市与项目" : "Related cities and procedures"}</h2><ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">{[...sameProcedure, ...sameCity].map((p) => <li key={treatmentCityPath(p)}><Link to={treatmentCityPath(p)} className="text-brand underline underline-offset-4">{PROCEDURE_CATALOG.find((t) => t.slug === p.procedureSlug)?.[zh ? "zh" : "en"]} · {CITIES.find((c) => c.slug === p.citySlug)?.[zh ? "zh" : "en"]}</Link></li>)}</ul></section>
    </main><Footer />
  </div>;
}

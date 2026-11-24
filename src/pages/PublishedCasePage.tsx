import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import QuoteCtaButton from "@/components/QuoteCtaButton";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { Button } from "@/components/ui/button";
import { useAsia } from "@/lib/asia-i18n";
import { getBrowserClient } from "@/lib/browser-client";
import { consultationHandoffUrl } from "@/lib/consultation-handoff";
import { caseFacts, caseIdPrefix, caseMediaUrl, caseCoverUrl, casePageMeta, casePath, expertName, expertPath, resolveCase, type PublishedCase, type CaseExpert } from "@/lib/case-seo";
import { usePublicCaseData } from "@/lib/public-case-data";
import { useClinicDirectory } from "@/hooks/use-clinic-directory";
import NotFound from "@/pages/NotFound";

export default function PublishedCasePage() {
  const { id: slug = "" } = useParams();
  const { lang } = useAsia();
  const initial = usePublicCaseData();
  const { clinics } = useClinicDirectory();
  const [state, setState] = useState<{ slug: string; row?: PublishedCase; expert?: CaseExpert; related: PublishedCase[]; loading: boolean }>(() => {
    const row = resolveCase(slug, initial?.videos ?? []);
    return { slug, row, expert: initial?.doctors.find((d) => d.id === row?.doctor_id), related: initial?.videos ?? [], loading: !row };
  });
  useEffect(() => {
    let active = true;
    const seeded = resolveCase(slug, initial?.videos ?? []);
    setState({ slug, row: seeded, expert: initial?.doctors.find((d) => d.id === seeded?.doctor_id), related: initial?.videos ?? [], loading: !seeded });
    void (async () => {
      try {
        const client = await getBrowserClient();
        let query = client.from("videos").select("*").eq("status", "published");
        const prefix = caseIdPrefix(slug);
        if (/^[a-f0-9-]{36}$/i.test(slug)) query = query.eq("id", slug);
        else if (prefix) query = query.gte("id", `${prefix}-0000-0000-0000-000000000000`).lte("id", `${prefix}-ffff-ffff-ffff-ffffffffffff`);
        else { if (active) setState({ slug, related: [], loading: false }); return; }
        const { data, error } = await query.limit(2);
        if (error) throw error;
        const row = resolveCase(slug, (data ?? []) as PublishedCase[]);
        if (!row) { if (active) setState({ slug, related: [], loading: false }); return; }
        const { data: expert } = row.doctor_id ? await client.from("doctors").select("*").eq("id", row.doctor_id).eq("status", "published").maybeSingle() : { data: null };
        const neighbors = client.from("videos").select("*,doctors(name,i18n,status)").eq("status", "published").neq("id", row.id).order("created_at", { ascending: false }).order("id");
        const [byExpert, byFacts] = await Promise.all([
          row.doctor_id ? neighbors.eq("doctor_id", row.doctor_id).limit(6) : Promise.resolve({ data: [] }),
          client.from("videos").select("*,doctors(name,i18n,status)").eq("status", "published").neq("id", row.id).eq("procedure", row.procedure ?? "").eq("city", row.city ?? "").order("created_at", { ascending: false }).order("id").limit(6),
        ]);
        if (active) {
          setState({ slug, row, expert: expert as CaseExpert | undefined, related: [...(byExpert.data ?? []), ...(byFacts.data ?? [])] as PublishedCase[], loading: false });
        }
      } catch { if (active && !seeded) setState({ slug, related: [], loading: false }); }
    })();
    return () => { active = false; };
  }, [slug, initial]);
  const row = state.slug === slug ? state.row : undefined;
  if (!row) return state.loading ? <><PageMeta title="Case" description="Published case video" path={`/cases/${slug}`} robots="noindex, follow" /><main className="container min-h-[55vh] py-16" aria-busy="true" /></> : <NotFound />;
  const expert = state.expert?.status === "published" ? state.expert : undefined;
  const meta = casePageMeta(row, expert, lang);
  if (`/cases/${slug}` !== meta.path) return <Navigate to={meta.path} replace />;
  const facts = caseFacts(row, lang);
  const clinic = clinics.find((c) => Boolean(expert && c.doctorIds.includes(expert.id)));
  const ctx = { procedure: facts.procedure, city: facts.city, doctorName: expert ? expertName(expert, lang) : undefined, source: "case_page" };
  const unique = state.related.filter((v, i, all) => v.id !== row.id && all.findIndex((other) => other.id === v.id) === i);
  const byExpert = expert ? unique.filter((v) => v.doctor_id === expert.id).slice(0, 6) : [];
  const byFacts = unique.filter((v) => caseFacts(v).procedure === caseFacts(row).procedure && caseFacts(v).city === caseFacts(row).city).slice(0, 6);
  const c = (en: string, zh: string) => lang === "zh" ? zh : en;
  const relatedLinks = (videos: PublishedCase[]) => <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{videos.map((v) => {
    const linked = initial?.doctors.find((d) => d.id === v.doctor_id) || (v.doctor_id === expert?.id ? expert : v.doctors?.status === "published" ? v.doctors : undefined);
    return <li key={v.id}><Link to={casePath(v, linked)} className="block rounded-lg border border-border p-4 hover:border-primary"><span className="font-medium">{caseFacts(v, lang).procedure}</span><span className="mt-2 block text-sm text-muted-foreground">{caseFacts(v, lang).city}</span></Link></li>;
  })}</ul>;
  return <div className="min-h-screen bg-background">
    <PageMeta {...meta} />
    <AsiaNavbar />
    <main className="container max-w-6xl py-10">
      <Link to="/cases" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" />{c("All cases", "全部案例")}</Link>
      <h1 className="mt-6 break-words font-display text-3xl leading-tight sm:text-4xl">{meta.title}</h1>
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-2">
        <video controls playsInline preload="none" src={caseMediaUrl(row.id, "video")} poster={caseCoverUrl(row) || undefined} className="aspect-[9/16] max-h-[75vh] w-full rounded-lg bg-muted object-contain" />
        <section className="min-w-0">
          <dl className="space-y-4 border-y border-border py-6 text-sm">
            <div><dt className="text-muted-foreground">{c("Procedure", "项目")}</dt><dd className="mt-1">{facts.procedure}</dd></div>
            {facts.city && <div><dt className="text-muted-foreground">{c("City", "城市")}</dt><dd className="mt-1">{facts.city}</dd></div>}
            {expert && <div><dt className="text-muted-foreground">{c("Expert", "专家")}</dt><dd className="mt-1"><Link className="text-brand underline" to={expertPath(expert.id)}>{expertName(expert, lang)}</Link></dd></div>}
            {expert?.hospital && <div><dt className="text-muted-foreground">{c("Hospital / clinic", "医院 / 诊所")}</dt><dd className="mt-1">{clinic ? <Link className="text-brand underline" to={`/clinics/${clinic.slug}`}>{lang === "zh" ? clinic.nameZh : clinic.nameEn}</Link> : expert.hospital}</dd></div>}
            <div><dt className="text-muted-foreground">{c("Date added", "添加日期")}</dt><dd className="mt-1"><time dateTime={row.created_at}>{new Date(row.created_at).toISOString().slice(0, 10)}</time></dd></div>
          </dl>
          <p className="mt-6 leading-7 text-muted-foreground">{meta.description}</p>
          <div className="mt-6"><MedicalDisclaimer /></div>
          <div className="mt-8 flex flex-wrap gap-3"><QuoteCtaButton quoteCtx={ctx} /><Button asChild variant="outline"><a href={consultationHandoffUrl("whatsapp", ctx)} target="_blank" rel="noreferrer"><MessageCircle className="mr-2 size-4" />WhatsApp</a></Button></div>
        </section>
      </div>
      {byExpert.length > 0 && <section className="mt-12 border-t border-border pt-8"><h2 className="font-display text-2xl">{c("More cases by this expert", "这位专家的更多案例")}</h2>{relatedLinks(byExpert)}</section>}
      {byFacts.length > 0 && <section className="mt-12 border-t border-border pt-8"><h2 className="font-display text-2xl">{c(`More ${facts.procedure} cases${facts.city ? ` in ${facts.city}` : ""}`, `${facts.city}的更多${facts.procedure}案例`)}</h2>{relatedLinks(byFacts)}</section>}
    </main>
    <Footer />
  </div>;
}

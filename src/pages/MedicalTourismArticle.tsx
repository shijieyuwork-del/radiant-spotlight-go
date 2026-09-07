import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, ExternalLink, FileCheck2, ShieldCheck } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { useQuote } from "@/components/QuoteRequest";
import { findMedicalTourismGuide, medicalTourismGuidePath } from "@/data/medicalTourismGuides";
import { SITE_URL } from "@/lib/seo-config";

const MedicalTourismArticle = ({ guideSlug }: { guideSlug?: string }) => {
  const params = useParams<{ slug: string }>();
  const slug = guideSlug ?? params.slug;
  const guide = findMedicalTourismGuide(slug);
  const { open } = useQuote();

  if (!guide) return <Navigate to="/medical-tourism-china" replace />;

  const path = medicalTourismGuidePath(guide.slug);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: guide.title,
    description: guide.description,
    url: `${SITE_URL}${path}`,
    datePublished: "2026-09-07",
    dateModified: "2026-09-07",
    author: { "@type": "Organization", name: "CeladonChina Editorial Team", url: `${SITE_URL}/editorial-policy` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    audience: { "@type": "Patient" },
    citation: guide.sources.map((source) => source.url),
  };

  return (
    <div className="min-h-screen bg-background">
      <PageMeta title={guide.title} description={guide.description} path={path} type="article" structuredData={[articleSchema, faqSchema]} />
      <AsiaNavbar />
      <main>
        <header className="border-b border-border/60 bg-muted/30">
          <div className="container py-10 md:py-16">
            <Link to="/medical-tourism-china" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground">
              <ArrowLeft className="size-4" /> Medical tourism in China guide
            </Link>
            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
              <div>
                <span className="pill mb-4 bg-accent text-accent-foreground"><FileCheck2 className="size-3.5 text-primary" />{guide.kicker}</span>
                <h1 className="max-w-5xl font-display text-4xl font-medium leading-[1.06] tracking-tight md:text-6xl">{guide.heading}</h1>
                <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">{guide.intro}</p>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <span>Updated {guide.updated}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" />{guide.readingTime}</span>
                  <span>General information</span>
                </div>
              </div>
              <aside className="border-l-2 border-primary pl-5" aria-label="Direct answer">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Direct answer</p>
                <p className="mt-3 text-sm leading-7 text-foreground/85">{guide.answer}</p>
              </aside>
            </div>
          </div>
        </header>

        <div className="container grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:py-20">
          <article className="mx-auto min-w-0 max-w-4xl lg:mx-0">
            <section aria-labelledby="key-takeaways" className="border-y border-border py-7">
              <h2 id="key-takeaways" className="font-display text-2xl font-medium">What to know first</h2>
              <ul className="mt-5 grid gap-4 md:grid-cols-3">
                {guide.takeaways.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" /><span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-12 space-y-14">
              {guide.sections.map((section, index) => (
                <section key={section.title} id={`section-${index + 1}`} className="scroll-mt-28">
                  <div className="grid gap-3 sm:grid-cols-[3rem_1fr]">
                    <span className="font-display text-2xl text-primary/65">0{index + 1}</span>
                    <div>
                      <h2 className="font-display text-3xl font-medium leading-tight">{section.title}</h2>
                      <div className="mt-5 space-y-4 text-[15px] leading-7 text-muted-foreground md:text-base md:leading-8">
                        {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                      </div>
                      {section.bullets && (
                        <ul className="mt-6 space-y-3 border-l border-primary/40 pl-5 text-sm leading-6 text-foreground/80">
                          {section.bullets.map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /><span>{item}</span></li>)}
                        </ul>
                      )}
                      {section.table && (
                        <div className="mt-7 overflow-hidden border border-border">
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[620px] text-left text-sm">
                              <caption className="border-b border-border bg-muted/50 px-4 py-3 text-left font-semibold text-foreground">{section.table.caption}</caption>
                              <thead className="bg-muted/30 text-xs uppercase tracking-[0.1em] text-muted-foreground">
                                <tr>{section.table.headers.map((header) => <th key={header} scope="col" className="px-4 py-3">{header}</th>)}</tr>
                              </thead>
                              <tbody>
                                {section.table.rows.map((row) => <tr key={row.join("|")} className="border-t border-border">{row.map((cell, cellIndex) => <td key={cell} className={`px-4 py-4 align-top leading-6 ${cellIndex === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{cell}</td>)}</tr>)}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            <section className="mt-16 border-y border-border py-10" aria-labelledby="guide-faq">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Questions patients ask</p>
              <h2 id="guide-faq" className="mt-3 font-display text-3xl font-medium">Frequently asked questions</h2>
              <div className="mt-7 divide-y divide-border">
                {guide.faqs.map(([question, answer]) => (
                  <div key={question} className="py-6 first:pt-0 last:pb-0">
                    <h3 className="font-display text-xl font-medium">{question}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12" aria-labelledby="guide-sources">
              <h2 id="guide-sources" className="font-display text-2xl font-medium">Sources and review notes</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">This page uses official and public-health sources for general planning information. Requirements and clinical guidance can change; verify current details with the responsible authority and your treating professionals.</p>
              <ul className="mt-5 space-y-3">
                {guide.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-2 text-sm font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:text-foreground">
                      <span>{source.title} · {source.publisher}</span><ExternalLink className="mt-0.5 size-3.5 shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                <Link to="/editorial-policy" className="underline decoration-primary/40 underline-offset-4">Editorial policy</Link>
                <Link to="/medical-review-policy" className="underline decoration-primary/40 underline-offset-4">Medical review policy</Link>
                <Link to="/provider-verification" className="underline decoration-primary/40 underline-offset-4">Provider verification</Link>
              </div>
            </section>
          </article>

          <aside className="space-y-8 lg:sticky lg:top-28">
            <nav aria-label="On this page">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">On this page</p>
              <ol className="mt-4 space-y-3 border-l border-border pl-4 text-sm text-muted-foreground">
                {guide.sections.map((section, index) => <li key={section.title}><a href={`#section-${index + 1}`} className="transition hover:text-foreground">{section.title}</a></li>)}
                <li><a href="#guide-faq" className="transition hover:text-foreground">Frequently asked questions</a></li>
                <li><a href="#guide-sources" className="transition hover:text-foreground">Sources</a></li>
              </ol>
            </nav>
            <div className="border-t border-border pt-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Related guides</p>
              <ul className="mt-4 space-y-3">
                {guide.related.map((item) => <li key={item.href}><Link to={item.href} className="group flex items-start justify-between gap-3 text-sm font-semibold leading-5"><span>{item.label}</span><ArrowRight className="mt-0.5 size-4 shrink-0 transition group-hover:translate-x-0.5" /></Link></li>)}
              </ul>
            </div>
            <div className="border-t border-border pt-7">
              <ShieldCheck className="size-6 text-primary" />
              <p className="mt-3 text-sm leading-6 text-muted-foreground">CeladonChina provides information and coordination, not diagnosis or treatment recommendations.</p>
              <Button onClick={() => open({ source: `medical_tourism_${guide.slug}` })} className="mt-5 w-full rounded-full">Ask a planning question<ArrowRight className="ml-2 size-4" /></Button>
            </div>
          </aside>
        </div>

        <section className="border-y border-border bg-foreground text-background">
          <div className="container flex flex-col gap-5 py-10 md:flex-row md:items-center md:justify-between md:py-12">
            <div><h2 className="font-display text-3xl font-medium">Plan the questions before the trip.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-background/70">We can help organize provider information, appointments and practical travel details. Medical decisions remain with licensed professionals.</p></div>
            <Button onClick={() => open({ source: `medical_tourism_${guide.slug}_bottom` })} className="shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">Start a planning consultation<ArrowRight className="ml-2 size-4" /></Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MedicalTourismArticle;

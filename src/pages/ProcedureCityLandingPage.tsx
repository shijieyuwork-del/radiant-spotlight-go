import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeDollarSign,
  CalendarClock,
  Check,
  ChevronDown,
  CircleAlert,
  FileQuestion,
  Languages,
  MapPin,
  MessageCircle,
  Plane,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import PageMeta from "@/components/PageMeta";
import { useQuote } from "@/components/QuoteRequest";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { MEDICAL_DISCLAIMER } from "@/lib/seo-config";
import { trackEvent } from "@/lib/analytics";
import {
  findLanding,
  relatedLandings,
  expertsForLanding,
  videosForLanding,
} from "@/data/landingPages";
import { findCity } from "@/data/cities";
import type { LandingProcedureKey } from "@/data/landingPages";
import rhinoplastyImage from "@/assets/treatment-rhinoplasty.jpg";
import eyelidImage from "@/assets/treatment-eyelid.jpg";
import faceliftImage from "@/assets/treatment-facelift.jpg";
import breastImage from "@/assets/treatment-breast-augmentation.jpg";
import lipoImage from "@/assets/treatment-liposuction.jpg";
import tummyImage from "@/assets/treatment-tummy-tuck.jpg";
import bblImage from "@/assets/treatment-bbl.jpg";
import mommyImage from "@/assets/treatment-body-contouring.jpg";

const PROCEDURE_IMAGE: Record<LandingProcedureKey, string> = {
  rhinoplasty: rhinoplastyImage,
  "double-eyelid-surgery": eyelidImage,
  facelift: faceliftImage,
  "breast-augmentation": breastImage,
  liposuction: lipoImage,
  "tummy-tuck": tummyImage,
  bbl: bblImage,
  "mommy-makeover": mommyImage,
};

const usd = (value: number) => `$${Math.round(value).toLocaleString("en-US")}`;

const LandingHeader = ({ onQuote }: { onQuote: (position: string) => void }) => (
  <header className="border-b border-primary/15 bg-background/95 backdrop-blur-xl">
    <div className="container flex min-h-[4.75rem] items-center justify-between gap-4">
      <Link to="/" aria-label="Cosmetics Asia home"><BrandLogo /></Link>
      <button type="button" onClick={() => onQuote("header")} className="cta-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold sm:px-6">
        <span className="hidden sm:inline">Get a free quote</span><span className="sm:hidden">Free quote</span><ArrowRight className="size-4" />
      </button>
    </div>
  </header>
);

const Metric = ({ icon: Icon, label, value }: { icon: typeof BadgeDollarSign; label: string; value: string }) => (
  <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"><Icon className="size-4 text-primary" />{label}</div>
    <p className="mt-2 font-display text-2xl font-semibold text-foreground">{value}</p>
  </div>
);

const QuoteButton = ({ onClick, position, full = false, label = "Start my free consultation" }: { onClick: (position: string) => void; position: string; full?: boolean; label?: string }) => (
  <button type="button" onClick={() => onClick(position)} className={`cta-primary inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-7 text-base font-semibold ${full ? "w-full" : ""}`}>
    {label} <ArrowRight className="size-4" />
  </button>
);

const ProcedureCityLandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const lp = useMemo(() => (slug ? findLanding(slug) : undefined), [slug]);
  const { open } = useQuote();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const city = lp ? findCity(lp.citySlug) : undefined;
  const experts = lp ? expertsForLanding(lp) : [];
  const videos = lp ? videosForLanding(lp) : [];
  const related = lp ? relatedLandings(lp) : [];

  useEffect(() => {
    if (!lp) return;
const sendInitialEvents = () => {
      trackEvent("view_landing_page", { page_group: "procedure_city_landing" });
      trackEvent("view_pricing", { source: "procedure_city_landing", section: "published_range" });
    };
    sendInitialEvents();
    window.addEventListener("ca:analytics-consent", onConsent);
    return () => window.removeEventListener("ca:analytics-consent", onConsent);

    function onConsent(event: Event) {
      if ((event as CustomEvent).detail === "granted") sendInitialEvents();
    }
  }, [lp]);

  if (!lp || !city) return <Navigate to="/" replace />;

const onQuote = (position: string) => {
    trackEvent("select_cta", { source: "procedure_city_landing", position });
    open({ procedure: `${lp.procedureLabel} in ${city.en}`, source: "procedure_city_landing" });
  };

  const onFaq = (index: number) => {
    const next = openFaq === index ? null : index;
    setOpenFaq(next);
    if (next !== null) trackEvent("expand_faq", { source: "procedure_city_landing", section: `faq_${index + 1}` });
  };

  const priceRange = lp.priceHigh ? `${usd(lp.priceLow)}–${usd(lp.priceHigh)}` : `From ~${usd(lp.priceLow)}`;
  const heroImage = PROCEDURE_IMAGE[lp.procedureKey];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: lp.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <PageMeta
        title={lp.keywordTitle}
        description={lp.description}
        path={`/lp/${lp.slug}`}
        image={heroImage}
        structuredData={faqSchema}
      />
      <div className="min-h-screen overflow-hidden bg-background">
        <LandingHeader onQuote={onQuote} />
        <main>
          {/* Hero */}
          <section className="relative border-b border-primary/15 bg-gradient-hero">
            <div className="absolute -left-28 top-20 size-80 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
            <div className="container relative grid gap-10 py-10 md:min-h-[720px] md:grid-cols-[1.08fr_0.92fr] md:items-center md:py-16 lg:gap-16">
              <div>
                <span className="pill border border-primary/15 bg-card/85 text-foreground"><Sparkles className="size-3.5 text-primary" />{lp.eyebrow}</span>
                <h1 className="mt-5 max-w-3xl font-display text-[2.75rem] font-medium leading-[0.94] tracking-[-0.045em] md:text-6xl lg:text-7xl">
                  {lp.headline}<span className="mt-1 block text-primary">{lp.headlineAccent}</span>
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{lp.intro}</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <QuoteButton onClick={onQuote} position="hero" />
                  <span className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground"><ShieldCheck className="size-4 text-primary" />Free · No obligation</span>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <Metric icon={BadgeDollarSign} label="Market reference" value={priceRange} />
                  <Metric icon={CalendarClock} label="Visible recovery" value={lp.visibleRecovery} />
                  <Metric icon={Sparkles} label="Result settles" value={lp.finalResult} />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">General education only. The clinic confirms your personal plan, final fee, and travel clearance.</p>
              </div>

              <figure className="relative mx-auto w-full max-w-xl md:justify-self-end">
                <div className="absolute -inset-4 rotate-2 rounded-[2.5rem] border border-primary/20 bg-primary/10" aria-hidden="true" />
                <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-foreground shadow-[0_30px_90px_-34px_rgba(16,44,36,0.55)]">
                  <img src={heroImage} alt={`Editorial portrait for the ${lp.procedureLabel.toLowerCase()} planning guide in ${city.en}`} className="aspect-[4/5] w-full object-cover opacity-95" />
                  <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-foreground/88 px-4 py-3 text-xs leading-relaxed text-white backdrop-blur">Editorial image only—not a patient result.</figcaption>
                </div>
              </figure>
            </div>
          </section>

          {/* What to know (BBL / Mommy Makeover 无 treatments 词条时) */}
          {lp.inlineWhat && (
            <section className="container py-14 md:py-20">
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">What this procedure involves</span>
                <h2 className="mt-3 font-display text-4xl font-medium md:text-5xl">Start with the facts, including the hard ones.</h2>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">{lp.inlineWhat}</p>
                {lp.inlineRisks && (
                  <ul className="mt-6 grid gap-3 text-left sm:grid-cols-2">
                    {lp.inlineRisks.map((risk) => (
                      <li key={risk} className="flex items-start gap-3 rounded-2xl border border-warning-border bg-warning-soft p-4 text-sm leading-relaxed text-warning-foreground">
                        <CircleAlert className="mt-0.5 size-4 shrink-0" />{risk}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          )}

          {/* Price factors */}
          <section className="container py-14 md:py-24">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">What changes the estimate</span>
                <h2 className="mt-3 font-display text-4xl font-medium md:text-5xl">One procedure name can cover very different plans.</h2>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">A useful quote starts with the details that materially change scope, safety, and recovery.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {lp.priceFactors.map((factor, index) => (
                  <div key={factor} className="flex min-h-28 items-start gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/15 font-display text-lg font-semibold text-foreground">0{index + 1}</span>
                    <p className="pt-1 text-sm font-semibold leading-relaxed">{factor}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why this city */}
          <section className="border-y border-primary/15 bg-primary/[0.06]">
            <div className="container grid gap-10 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 md:py-20">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary"><MapPin className="size-4" />Why {city.en}</span>
                <h2 className="mt-4 max-w-xl font-display text-4xl font-medium md:text-5xl">{city.taglineEn}</h2>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{city.introEn}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="pill border border-primary/15 bg-card text-foreground"><BadgeDollarSign className="size-3.5 text-primary" />Typical savings vs US: {city.savings}</span>
                  <span className="pill border border-primary/15 bg-card text-foreground"><ShieldCheck className="size-3.5 text-primary" />{city.doctorsCount} verified experts listed</span>
                </div>
                <Link to={`/cities/${city.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold underline decoration-primary/60 underline-offset-4">Explore {city.en} travel &amp; logistics <ArrowRight className="size-4" /></Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {city.whyEn.map((reason) => (
                  <div key={reason} className="flex min-h-24 items-start gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-primary/15"><Check className="size-4 text-primary" /></span>
                    <p className="pt-1 text-sm font-semibold leading-relaxed">{reason}</p>
                  </div>
                ))}
                <div className="rounded-3xl border border-primary/15 bg-foreground p-5 text-background sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Planning essentials</p>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div><dt className="text-background/60">Airport</dt><dd className="mt-0.5 font-semibold">{city.travelEn.airport}</dd></div>
                    <div><dt className="text-background/60">Visa</dt><dd className="mt-0.5 font-semibold">{city.travelEn.visa}</dd></div>
                    <div><dt className="text-background/60">Recovery stay</dt><dd className="mt-0.5 font-semibold">{city.travelEn.hotel}</dd></div>
                    <div><dt className="text-background/60">Languages</dt><dd className="mt-0.5 font-semibold">{city.travelEn.lang}</dd></div>
                  </dl>
                </div>
              </div>
            </div>
          </section>

          {/* Verified experts in the city */}
          {experts.length > 0 && (
            <section className="container py-14 md:py-24">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Verified experts</span>
                  <h2 className="mt-3 font-display text-4xl font-medium md:text-5xl">Experts in {city.en}</h2>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">Licensed specialists published on Cosmetics Asia. Ask them directly about technique, quotes, and follow-up.</p>
                </div>
                <Link to={`/doctors?city=${city.en}`} className="inline-flex items-center gap-2 text-sm font-semibold underline decoration-primary/60 underline-offset-4">All experts in {city.en} <ArrowRight className="size-4" /></Link>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {experts.map((doctor) => (
                  <Link key={doctor.id} to={`/doctors/${doctor.id}`} className="group rounded-3xl border border-border bg-card p-5 shadow-soft transition hover:border-primary/40">
                    <div className="flex items-center gap-4">
                      <img src={doctor.img} alt={`Portrait of ${doctor.en}`} loading="lazy" className="size-14 rounded-2xl object-cover" />
                      <div className="min-w-0">
                        <p className="truncate font-display text-lg font-semibold">{doctor.en}</p>
                        <p className="truncate text-xs text-muted-foreground">{doctor.titleEn}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-primary"><Star className="size-3 fill-primary" />{doctor.rating} · {doctor.reviews.toLocaleString()} reviews</p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground">{doctor.clinicEn}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {doctor.specEn.slice(0, 3).map((spec) => (
                        <span key={spec} className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">{spec}</span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Patient diaries */}
          {videos.length > 0 && (
            <section className="border-y border-primary/15 bg-card/50 py-14 md:py-20">
              <div className="container">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Patient diaries</span>
                    <h2 className="mt-3 font-display text-4xl font-medium md:text-5xl">Watch real {lp.procedureLabel.toLowerCase()} journeys.</h2>
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                      Short first-person videos from patients. {videos.some((v) => v.clinic.en.toLowerCase().includes(city.en.toLowerCase())) ? `Diaries below were performed by experts in ${city.en}.` : "Diaries below are from across Asia — filter by city on the cases page."}
                    </p>
                  </div>
                  <Link to="/cases" className="inline-flex items-center gap-2 text-sm font-semibold underline decoration-primary/60 underline-offset-4">View all cases <ArrowRight className="size-4" /></Link>
                </div>
                <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {videos.slice(0, 6).map((video) => (
                    <Link key={video.id} to={`/cases/${video.id}`} className="group relative aspect-[9/16] w-40 shrink-0 snap-start overflow-hidden rounded-3xl bg-foreground sm:w-48">
                      <img src={video.poster ?? "/videos/video-cover-fallback.jpg"} alt={video.caption.en} loading="lazy" className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                      <span className="absolute left-2.5 top-2.5 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-bold text-foreground backdrop-blur">#{video.treatment.en}</span>
                      <div className="absolute inset-x-3 bottom-3">
                        <p className="line-clamp-2 text-xs font-semibold leading-snug text-white">{video.caption.en}</p>
                        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-white/70">{video.user.en}{video.likes ? <span className="ml-auto">{video.likes} ❤</span> : null}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Consultation */}
          <section className="border-y border-primary/15 bg-foreground text-background">
            <div className="container grid gap-10 py-14 md:grid-cols-2 md:items-center md:py-20">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary"><MessageCircle className="size-4" />Free initial conversation</span>
                <h2 className="mt-4 max-w-xl font-display text-4xl font-medium md:text-5xl">Leave with better questions—even if you are not ready to book.</h2>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-background/70">We help organize the decision. A licensed clinician must assess you and recommend treatment.</p>
              </div>
              <div className="rounded-[2rem] border border-white/15 bg-white/[0.07] p-6 md:p-8">
                <p className="text-sm font-bold">Use the conversation to clarify:</p>
                <ul className="mt-5 space-y-4">
                  {lp.consultationQuestions.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-background/80"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary text-foreground"><Check className="size-3" /></span>{item}</li>)}
                </ul>
                <QuoteButton onClick={onQuote} position="consultation_section" full />
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="container py-14 md:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">From first question to clinic visit</span>
              <h2 className="mt-3 font-display text-4xl font-medium md:text-5xl">Cross-border care has more moving parts. We make them visible.</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {[
                { icon: FileQuestion, title: "Clarify your request", text: "Tell us what you are considering and what you still need to understand." },
                { icon: Stethoscope, title: "Review provider information", text: "Compare published details and prepare questions for a licensed clinician." },
                { icon: Plane, title: "Coordinate practical steps", text: "After a booking is confirmed, coordinate pickup, translation, and itinerary details." },
                { icon: Languages, title: "Support communication", text: "Use English-language coordination for scheduled clinic communication and follow-up." },
              ].map(({ icon: Icon, title, text }, index) => (
                <article key={title} className="rounded-3xl border border-border bg-card p-5 shadow-soft">
                  <div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-2xl bg-gradient-mint"><Icon className="size-5" /></span><span className="font-display text-3xl text-primary/20">0{index + 1}</span></div>
                  <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-warning-border bg-warning-soft p-4 text-sm leading-relaxed text-warning-foreground">
              <CircleAlert className="mt-0.5 size-5 shrink-0" />{lp.localStay}
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-primary/[0.06] py-14 md:py-24">
            <div className="container grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Common questions</span>
                <h2 className="mt-3 font-display text-4xl font-medium">The honest short answers.</h2>
                <Link to={`/treatments/${lp.procedureKey === "double-eyelid-surgery" ? "blepharoplasty" : lp.procedureKey}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold underline decoration-primary/60 underline-offset-4">Read the full procedure guide <ArrowRight className="size-4" /></Link>
              </div>
              <div className="overflow-hidden rounded-[2rem] border border-primary/15 bg-card">
                {lp.faq.map((item, index) => {
                  const isOpen = openFaq === index;
                  return <div key={item.question} className="border-b border-border last:border-b-0"><button type="button" onClick={() => onFaq(index)} aria-expanded={isOpen} className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-lg font-semibold"><span>{item.question}</span><ChevronDown className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} /></button>{isOpen && <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>}</div>;
                })}
              </div>
            </div>
          </section>

          {/* Related guides */}
          {related.length > 0 && (
            <section className="container py-14 md:py-20">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">More planning guides</span>
              <div className="mt-5 flex flex-wrap gap-3">
                {related.map((r) => (
                  <Link key={r.slug} to={`/lp/${r.slug}`} className="pill border border-primary/15 bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/40">{r.procedureLabel} in {findCity(r.citySlug)?.en ?? r.citySlug}</Link>
                ))}
              </div>
            </section>
          )}

          {/* Final CTA */}
          <section className="container py-14 md:py-24">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-hero p-6 shadow-pop md:p-12">
              <div className="absolute -right-16 -top-20 size-64 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
              <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                <div><span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary"><MapPin className="size-4" />Your next step</span><h2 className="mt-3 max-w-2xl font-display text-4xl font-medium md:text-5xl">Ready to make the options easier to compare?</h2><p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">Start with your questions. You do not need to know the exact technique, clinic, city, or travel date.</p></div>
                <QuoteButton onClick={onQuote} position="final" label="Get a free quote" />
              </div>
            </div>
            <div className="mt-6"><MedicalDisclaimer variant="banner" /></div>
            <p className="mx-auto mt-4 max-w-4xl text-center text-xs leading-relaxed text-muted-foreground">{MEDICAL_DISCLAIMER} Published cost and recovery ranges are general education, not a personal quote or travel clearance.</p>
          </section>
        </main>

        <footer className="border-t border-border bg-card/60">
          <div className="container flex flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div><BrandLogo /><p className="mt-2">Questions before you decide. Coordination when you are ready.</p></div>
            <div className="flex flex-wrap gap-4">
              <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link to={`/cities/${city.slug}`} className="hover:text-foreground">{city.en} guide</Link>
              <Link to="/doctors" className="hover:text-foreground">Experts</Link>
              <a href="mailto:hello@cosmetics-asia.com" className="hover:text-foreground">hello@cosmetics-asia.com</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ProcedureCityLandingPage;
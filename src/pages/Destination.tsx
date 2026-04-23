import { useParams, Link } from "react-router-dom";
import {
  ShieldCheck, Star, MapPin, Plane, Stethoscope, Hotel, HeartPulse, Languages as LanguagesIcon,
  ArrowRight, Sparkles, ChevronRight, Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import NotFound from "./NotFound";
import { getDestination } from "@/lib/destinations";
import { useI18n, useLangPath } from "@/lib/i18n";

const stageIcons = [Stethoscope, Plane, Sparkles, Hotel, HeartPulse];

const Destination = () => {
  const { slug = "" } = useParams();
  const d = getDestination(slug);
  const { formatPrice, regionMeta } = useI18n();
  if (!d) return <NotFound />;

  const home = d.costs.find((c) => c.isHome) ?? d.costs[d.costs.length - 1];
  const local = d.costs[0];
  const savingsPct = Math.round(100 - ((local.low + local.high) / 2 / ((home.low + home.high) / 2)) * 100);
  const maxHigh = Math.max(...d.costs.map((c) => c.high));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="container pt-6">
        <nav className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Link to="/" className="hover:text-foreground">Discover</Link>
          <ChevronRight className="size-3" />
          <span>{d.procedure}</span>
          <ChevronRight className="size-3" />
          <span className="text-foreground font-semibold">{d.country}</span>
        </nav>
      </div>

      {/* HERO */}
      <section className="container py-12 md:py-16">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="pill bg-card shadow-soft">
              <span className="text-base leading-none">{d.flag}</span> {d.city}, {d.country}
            </span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium leading-[0.95] tracking-tight">
              {d.procedure} in {d.country} — <em className="text-primary not-italic">everything you need to know.</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">{d.intro}</p>
            <div className="flex flex-wrap gap-2">
              {d.inclusions.map((i) => (
                <span key={i} className="pill bg-muted">
                  <Check className="size-3 text-primary" /> {i}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" className="rounded-full">Find verified doctors <ArrowRight className="ml-1 size-4" /></Button>
              <Button size="lg" variant="outline" className="rounded-full">Free consultation</Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-[2rem] bg-gradient-mint p-7 shadow-soft">
              <p className="text-xs uppercase tracking-wider font-semibold text-foreground/70">From</p>
              <p className="font-display text-5xl font-semibold mt-1">{formatPrice(local.low)}</p>
              <p className="text-sm text-foreground/70 mt-1">to {formatPrice(local.high)} · all-inclusive</p>
              <div className="mt-5 pt-5 border-t border-foreground/10">
                <p className="text-sm font-semibold flex items-center gap-1.5">
                  <Sparkles className="size-4 text-primary" /> Save up to {savingsPct}% vs {home.flag} {home.country}
                </p>
                <p className="text-xs text-foreground/70 mt-1">Prices shown in {regionMeta.flag} your local currency.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COST COMPARISON */}
      <section className="container py-16">
        <div className="mb-10">
          <span className="pill bg-secondary text-secondary-foreground mb-3">Cost comparison</span>
          <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight max-w-2xl">
            {d.procedure} cost — <em className="text-primary not-italic">{d.country} vs the world.</em>
          </h2>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-4">
          {d.costs.map((c) => {
            const mid = (c.low + c.high) / 2;
            const widthPct = (mid / maxHigh) * 100;
            const isLocal = c.country === d.country;
            return (
              <div key={c.country} className="grid grid-cols-12 items-center gap-3">
                <div className="col-span-12 md:col-span-3 flex items-center gap-2">
                  <span className="text-lg">{c.flag}</span>
                  <span className={`text-sm ${isLocal ? "font-semibold" : ""}`}>{c.country}</span>
                  {c.isHome && <span className="pill bg-muted text-[10px] py-0 px-1.5">Your country</span>}
                </div>
                <div className="col-span-12 md:col-span-6">
                  <div className="h-8 bg-muted rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full ${isLocal ? "bg-primary" : c.isHome ? "bg-foreground/30" : "bg-muted-foreground/30"}`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
                <div className="col-span-12 md:col-span-3 text-right">
                  <span className={`font-display font-semibold ${isLocal ? "text-primary" : ""}`}>
                    {formatPrice(c.low)} – {formatPrice(c.high)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TOP DOCTORS */}
      <section className="container py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="pill bg-primary-soft text-foreground mb-3" style={{ background: "hsl(var(--primary-soft))" }}>
              <ShieldCheck className="size-3.5 text-primary" /> Verified
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight max-w-2xl">
              Top 5 {d.procedure.toLowerCase()} doctors in <em className="text-primary not-italic">{d.city}</em>
            </h2>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {d.doctors.map((doc, i) => (
            <div key={doc.name} className="rounded-3xl border border-border bg-card p-5 flex gap-4">
              <div className="font-display text-3xl font-semibold text-primary/40 w-8 leading-none pt-1">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="size-14 rounded-2xl bg-gradient-mint grid place-items-center font-display text-lg font-semibold shrink-0">
                {doc.name.split(" ")[1]?.[0] ?? doc.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold leading-tight flex items-center gap-1.5">
                  {doc.name} <ShieldCheck className="size-3.5 text-primary shrink-0" />
                </p>
                <p className="text-xs text-muted-foreground truncate">{doc.clinic}</p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="flex items-center gap-1"><Star className="size-3 fill-primary text-primary" /> {doc.rating}</span>
                  <span className="text-muted-foreground">{doc.reviews} reviews</span>
                  <span className="text-muted-foreground">· {doc.cases} cases</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <LanguagesIcon className="size-3 text-muted-foreground" />
                  {doc.languages.map((l) => (
                    <span key={l} className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-muted">{l}</span>
                  ))}
                  <span className="text-[10px] text-muted-foreground ml-1">· {doc.license}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PATIENT JOURNEY */}
      <section className="container py-16">
        <div className="mb-10">
          <span className="pill bg-accent text-accent-foreground mb-3">Patient journey</span>
          <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight max-w-2xl">
            From consult to recovery, <em className="text-primary not-italic">step by step.</em>
          </h2>
        </div>
        <div className="relative">
          <div className="absolute left-5 top-2 bottom-2 w-px bg-border md:hidden" />
          <div className="hidden md:block absolute left-0 right-0 top-7 h-px bg-border" />
          <div className="grid md:grid-cols-5 gap-6">
            {d.timeline.map((t, i) => {
              const Icon = stageIcons[i % stageIcons.length];
              return (
                <div key={t.stage} className="relative pl-14 md:pl-0">
                  <div className="absolute left-0 top-0 md:relative md:left-auto md:top-auto size-12 rounded-2xl bg-card border border-border shadow-soft grid place-items-center mb-3">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{t.days}</p>
                  <p className="font-display text-lg font-semibold leading-tight mt-1">{t.stage}</p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{t.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-16">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <span className="pill bg-secondary text-secondary-foreground mb-3">FAQ</span>
            <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight">
              Cross-border <em className="text-primary not-italic">questions</em>, answered.
            </h2>
            <p className="text-sm text-muted-foreground mt-4">
              Built from real patient questions about flying abroad for {d.procedure.toLowerCase()}.
            </p>
          </div>
          <div className="md:col-span-8">
            <Accordion type="single" collapsible className="space-y-2">
              {d.faq.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="rounded-2xl border border-border bg-card px-5">
                  <AccordionTrigger className="text-left font-display font-semibold">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16">
        <div className="rounded-[2.5rem] bg-foreground text-background p-10 md:p-16 relative overflow-hidden">
          <div className="absolute -bottom-20 -right-20 size-80 bg-primary blur-3xl opacity-40 animate-blob" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-5xl font-medium leading-tight">
                Ready to plan your <em className="text-primary not-italic">{d.procedure.toLowerCase()}</em> in {d.city}?
              </h2>
              <p className="text-background/70 mt-4 max-w-md">Free 30-min video consult with a verified surgeon. No commitment.</p>
            </div>
            <div className="flex flex-col gap-3">
              <Button size="lg" className="rounded-2xl bg-primary text-foreground hover:bg-primary/90 h-14">
                Book free consult <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-2xl bg-transparent border-background/30 text-background hover:bg-background/10 h-14">
                <MapPin className="mr-2 size-4" /> View {d.country} clinics
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Destination;

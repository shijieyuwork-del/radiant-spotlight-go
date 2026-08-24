import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  Stethoscope,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import PageMeta from "@/components/PageMeta";
import { useQuote } from "@/components/QuoteRequest";
import { findTreatment } from "@/data/treatments";
import { MEDICAL_DISCLAIMER } from "@/lib/seo-config";
import { trackEvent } from "@/lib/analytics";
import rhinoplastyImage from "@/assets/treatment-rhinoplasty.jpg";
import blepharoplastyImage from "@/assets/treatment-eyelid.jpg";
import faceliftImage from "@/assets/treatment-facelift.jpg";

export type TreatmentLandingKind = "rhinoplasty" | "blepharoplasty" | "facelift";

type LandingCopy = {
  slug: string;
  name: string;
  keywordTitle: string;
  description: string;
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  intro: string;
  image: string;
  price: string;
  visibleRecovery: string;
  finalResult: string;
  priceFactors: string[];
  consultationQuestions: string[];
  localStay: string;
  faq: { question: string; answer: string }[];
};

const LANDINGS: Record<TreatmentLandingKind, LandingCopy> = {
  rhinoplasty: {
    slug: "rhinoplasty-china",
    name: "Rhinoplasty",
    keywordTitle: "Rhinoplasty in China | Cost, Recovery & Free Consultation",
    description: "Considering rhinoplasty in China? Review realistic cost and recovery ranges, understand travel support, and start with a free, no-obligation consultation.",
    eyebrow: "Rhinoplasty planning in China",
    headline: "Considering rhinoplasty in China?",
    headlineAccent: "Start with clarity, not pressure.",
    intro: "Understand likely costs, recovery, procedure options, and travel logistics before you choose a clinic or make a booking.",
    image: rhinoplastyImage,
    price: "$3,000–$9,000",
    visibleRecovery: "About 1–2 weeks",
    finalResult: "6–12+ months",
    localStay: "Your clinic must confirm how long you should remain nearby before flying.",
    priceFactors: ["Primary or revision surgery", "Open or closed approach", "Septal, ear, or rib cartilage grafting", "Anaesthesia, facility, and follow-up needs"],
    consultationQuestions: ["Which approach may fit your goals and anatomy", "What the estimate includes—and what it excludes", "How long you may need to stay in China", "What to ask about revision policy and follow-up"],
    faq: [
      { question: "What does the published price range include?", answer: "The range is a general market reference for primary surgery and may include the surgeon, anaesthesia, and facility. Revision work, cartilage grafting, tests, travel, accommodation, and later procedures can change the total. A clinic must provide the final quote." },
      { question: "When can I fly after rhinoplasty?", answer: "There is no universal flight date. Your treating clinician must assess swelling, bleeding risk, breathing, and your flight length before clearing travel." },
      { question: "Can Cosmetics Asia recommend a specific surgical plan?", answer: "No. We can help you organize questions, compare published provider information, and coordinate communication. Only a licensed clinician who evaluates you can recommend a plan." },
    ],
  },
  blepharoplasty: {
    slug: "blepharoplasty-china",
    name: "Blepharoplasty",
    keywordTitle: "Blepharoplasty in China | Cost, Recovery & Free Consultation",
    description: "Explore blepharoplasty in China with realistic pricing, recovery guidance, travel coordination, and a free, no-obligation initial consultation.",
    eyebrow: "Eyelid surgery planning in China",
    headline: "Considering blepharoplasty in China?",
    headlineAccent: "Know which questions matter first.",
    intro: "Upper lid, lower lid, and double-eyelid procedures solve different concerns. Clarify the likely approach, costs, and recovery before you choose.",
    image: blepharoplastyImage,
    price: "$1,500–$5,000",
    visibleRecovery: "About 7–14 days",
    finalResult: "3–6 months",
    localStay: "Ask the clinic when sutures are removed and when your eyes should be checked before travel.",
    priceFactors: ["Upper, lower, or both eyelids", "Incisional or buried-suture technique", "Ptosis correction or fat repositioning", "Anaesthesia, facility, and follow-up needs"],
    consultationQuestions: ["Which eyelid concern the procedure is meant to address", "Whether dry-eye assessment is needed first", "What the estimate includes—and what it excludes", "When follow-up and travel may be appropriate"],
    faq: [
      { question: "Is double-eyelid surgery the same as blepharoplasty?", answer: "It is one type of upper-eyelid surgery. Blepharoplasty can also remove excess upper-lid skin or address lower-lid bags. The correct approach depends on anatomy and the actual concern." },
      { question: "What can increase the price?", answer: "Combining upper and lower lids, ptosis correction, fat repositioning, anaesthesia needs, and facility fees can move the total above a basic single-area procedure." },
      { question: "Can photos confirm the right technique?", answer: "Photos can help start a discussion but cannot replace an eye examination. Dry eye, eyelid position, muscle function, and other factors may need in-person assessment." },
    ],
  },
  facelift: {
    slug: "facelift-china",
    name: "Facelift",
    keywordTitle: "Facelift in China | Cost, Recovery & Free Consultation",
    description: "Considering a facelift in China? Compare realistic cost and recovery ranges, understand travel planning, and begin with a free consultation.",
    eyebrow: "Facelift planning in China",
    headline: "Considering a facelift in China?",
    headlineAccent: "Plan the whole journey, not just surgery day.",
    intro: "Facelift techniques vary in depth, recovery, and what they can address. Start by clarifying the procedure, local stay, costs, and follow-up.",
    image: faceliftImage,
    price: "$6,000–$18,000",
    visibleRecovery: "About 2–4 weeks",
    finalResult: "6–12 months",
    localStay: "This procedure may require a longer local stay. Your treating clinician must confirm when travel is safe.",
    priceFactors: ["Mini, SMAS, or deep-plane technique", "Whether neck work is included", "Combined fat grafting or skin treatment", "Anaesthesia, facility, drains, and follow-up"],
    consultationQuestions: ["Which technique may fit the degree of laxity", "Where incisions and scars are likely to sit", "How neck work or added procedures affect the quote", "How complications and follow-up are handled after travel"],
    faq: [
      { question: "Why is the price range so wide?", answer: "The term facelift covers short-scar procedures through more extensive SMAS or deep-plane surgery, sometimes with neck work or other treatments. The final plan determines the fee." },
      { question: "How long should I stay in China?", answer: "A facelift often requires more local follow-up than smaller procedures. Your clinician must decide based on the technique, drains or sutures, healing, and travel distance." },
      { question: "Does a facelift improve every sign of ageing?", answer: "No. It primarily addresses tissue descent and laxity. Skin texture, sun damage, fine lines, and volume loss may need different treatment, which should be discussed with a qualified clinician." },
    ],
  },
};

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

const QuoteButton = ({ onClick, position, full = false }: { onClick: (position: string) => void; position: string; full?: boolean }) => (
  <button type="button" onClick={() => onClick(position)} className={`cta-primary inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-7 text-base font-semibold ${full ? "w-full" : ""}`}>
    Start my free consultation <ArrowRight className="size-4" />
  </button>
);

const TreatmentLandingPage = ({ kind }: { kind: TreatmentLandingKind }) => {
  const copy = LANDINGS[kind];
  const treatment = findTreatment(kind);
  const { open } = useQuote();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const sendInitialEvents = () => {
      trackEvent("view_landing_page", { page_group: "treatment_landing" });
      trackEvent("view_pricing", { source: "treatment_landing", section: "published_range" });
    };
    const onConsent = (event: Event) => {
      if ((event as CustomEvent).detail === "granted") sendInitialEvents();
    };
    sendInitialEvents();
    window.addEventListener("ca:analytics-consent", onConsent);
    return () => window.removeEventListener("ca:analytics-consent", onConsent);
  }, []);

  const onQuote = (position: string) => {
    trackEvent("select_cta", { source: "treatment_landing", position });
    open({ procedure: copy.name, source: "treatment_landing" });
  };

  const onFaq = (index: number) => {
    const next = openFaq === index ? null : index;
    setOpenFaq(next);
    if (next !== null) trackEvent("expand_faq", { source: "treatment_landing", section: `faq_${index + 1}` });
  };

  if (!treatment) return null;

  return (
    <>
      <PageMeta title={copy.keywordTitle} description={copy.description} path={`/lp/${copy.slug}`} image={copy.image} />
      <div className="min-h-screen overflow-hidden bg-background">
        <LandingHeader onQuote={onQuote} />
        <main>
          <section className="relative border-b border-primary/15 bg-gradient-hero">
            <div className="absolute -left-28 top-20 size-80 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
            <div className="container relative grid gap-10 py-10 md:min-h-[720px] md:grid-cols-[1.08fr_0.92fr] md:items-center md:py-16 lg:gap-16">
              <div>
                <span className="pill border border-primary/15 bg-card/85 text-foreground"><Sparkles className="size-3.5 text-primary" />{copy.eyebrow}</span>
                <h1 className="mt-5 max-w-3xl font-display text-[2.75rem] font-medium leading-[0.94] tracking-[-0.045em] md:text-6xl lg:text-7xl">
                  {copy.headline}<span className="mt-1 block text-primary">{copy.headlineAccent}</span>
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{copy.intro}</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <QuoteButton onClick={onQuote} position="hero" />
                  <span className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground"><ShieldCheck className="size-4 text-primary" />Free · No obligation</span>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <Metric icon={BadgeDollarSign} label="Published range" value={copy.price} />
                  <Metric icon={CalendarClock} label="Visible recovery" value={copy.visibleRecovery} />
                  <Metric icon={Sparkles} label="Result settles" value={copy.finalResult} />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">General education only. The clinic confirms your personal plan, final fee, and travel clearance.</p>
              </div>

              <figure className="relative mx-auto w-full max-w-xl md:justify-self-end">
                <div className="absolute -inset-4 rotate-2 rounded-[2.5rem] border border-primary/20 bg-primary/10" aria-hidden="true" />
                <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-foreground shadow-[0_30px_90px_-34px_rgba(16,44,36,0.55)]">
                  <img src={copy.image} alt={`Editorial portrait for the ${copy.name.toLowerCase()} planning guide`} className="aspect-[4/5] w-full object-cover opacity-95" />
                  <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-foreground/88 px-4 py-3 text-xs leading-relaxed text-white backdrop-blur">Editorial image only—not a patient result.</figcaption>
                </div>
              </figure>
            </div>
          </section>

          <section className="container py-14 md:py-24">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">What changes the estimate</span>
                <h2 className="mt-3 font-display text-4xl font-medium md:text-5xl">One procedure name can cover very different plans.</h2>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">A useful quote starts with the details that materially change scope, safety, and recovery.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {copy.priceFactors.map((factor, index) => (
                  <div key={factor} className="flex min-h-28 items-start gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/15 font-display text-lg font-semibold text-foreground">0{index + 1}</span>
                    <p className="pt-1 text-sm font-semibold leading-relaxed">{factor}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

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
                  {copy.consultationQuestions.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-background/80"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary text-foreground"><Check className="size-3" /></span>{item}</li>)}
                </ul>
                <QuoteButton onClick={onQuote} position="consultation_section" full />
              </div>
            </div>
          </section>

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
              <CircleAlert className="mt-0.5 size-5 shrink-0" />{copy.localStay}
            </div>
          </section>

          <section className="bg-primary/[0.06] py-14 md:py-24">
            <div className="container grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Common questions</span>
                <h2 className="mt-3 font-display text-4xl font-medium">The honest short answers.</h2>
                <Link to={`/treatments/${kind}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold underline decoration-primary/60 underline-offset-4">Read the full procedure guide <ArrowRight className="size-4" /></Link>
              </div>
              <div className="overflow-hidden rounded-[2rem] border border-primary/15 bg-card">
                {copy.faq.map((item, index) => {
                  const isOpen = openFaq === index;
                  return <div key={item.question} className="border-b border-border last:border-b-0"><button type="button" onClick={() => onFaq(index)} aria-expanded={isOpen} className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-lg font-semibold"><span>{item.question}</span><ChevronDown className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} /></button>{isOpen && <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>}</div>;
                })}
              </div>
            </div>
          </section>

          <section className="container py-14 md:py-24">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-hero p-6 shadow-pop md:p-12">
              <div className="absolute -right-16 -top-20 size-64 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
              <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                <div><span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary"><MapPin className="size-4" />Your next step</span><h2 className="mt-3 max-w-2xl font-display text-4xl font-medium md:text-5xl">Ready to make the options easier to compare?</h2><p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">Start with your questions. You do not need to know the exact technique, clinic, city, or travel date.</p></div>
                <QuoteButton onClick={onQuote} position="final" />
              </div>
            </div>
            <p className="mx-auto mt-6 max-w-4xl text-center text-xs leading-relaxed text-muted-foreground">{MEDICAL_DISCLAIMER} Published cost and recovery ranges are general education, not a personal quote or travel clearance.</p>
          </section>
        </main>

        <footer className="border-t border-border bg-card/60">
          <div className="container flex flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><div><BrandLogo /><p className="mt-2">Questions before you decide. Coordination when you are ready.</p></div><div className="flex flex-wrap gap-4"><Link to="/privacy" className="hover:text-foreground">Privacy</Link><Link to={`/treatments/${kind}`} className="hover:text-foreground">Full procedure guide</Link><a href="mailto:hello@cosmetics-asia.com" className="hover:text-foreground">hello@cosmetics-asia.com</a></div></div>
        </footer>
      </div>
    </>
  );
};

export default TreatmentLandingPage;

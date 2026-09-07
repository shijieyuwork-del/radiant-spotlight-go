import { ArrowRight, CheckCircle2, FileCheck2, Plane, ShieldCheck, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { useQuote } from "@/components/QuoteRequest";
import { SITE_URL } from "@/lib/seo-config";
import { MEDICAL_TOURISM_GUIDES, medicalTourismGuidePath } from "@/data/medicalTourismGuides";

type GuideKind = "medical-tourism" | "plastic-surgery";

const guideCopy = {
  "medical-tourism": {
    path: "/medical-tourism-china",
    title: "Medical Tourism in China: 2026 Patient Planning Guide",
    description: "Plan medical tourism in China with a practical guide to provider checks, records, travel, translation, costs, recovery and follow-up for international patients.",
    kicker: "China medical travel guide",
    heading: "Medical tourism in China, planned around the care you actually need.",
    intro: "A safe medical trip starts before you book a flight. Use this guide to organize records, verify the treating provider, understand what is and is not included, and plan enough time for assessment, treatment and recovery.",
    cta: "Start a consultation",
    sections: [
      { title: "Start with a medical review, not a travel package", body: "Send relevant records and your questions before choosing dates. The treating clinician or hospital should decide whether an in-person consultation is appropriate, what tests are needed and whether travel is reasonable. A coordinator can organize information and logistics, but cannot diagnose you or choose treatment for you." },
      { title: "Verify the clinician and the facility separately", body: "Confirm the clinician's current license, specialty, experience with the procedure and right to practise at the named facility. Then confirm the facility's legal name, address, operating scope, anesthesia arrangements and emergency transfer plan. A polished profile or social account is not evidence of clinical authorization." },
      { title: "Ask for a written cost breakdown", body: "Request separate figures for consultation, tests, treatment, anesthesia, facility fees, medication, garments, translation, accommodation and follow-up. Prices can change after an in-person assessment. Do not assume a quoted package covers complications, extra nights or changes to the treatment plan." },
      { title: "Plan entry, language and payments before departure", body: "Entry rules depend on nationality, route and purpose of travel, and they can change. Check official Chinese government and airline guidance before booking. Confirm how the clinic communicates in your language, which payment methods it accepts and who will be reachable outside clinic hours." },
      { title: "Leave enough time for recovery and follow-up", body: "Do not plan sightseeing or a return flight around a marketing timeline. Ask the treating clinician when you may travel, what warning signs require urgent care and who owns follow-up after you return home. Keep copies of discharge notes, prescriptions, implant or device records and emergency contacts." },
    ],
    faqs: [
      ["Is medical tourism in China safe?", "Safety depends on the individual clinician, facility, procedure, anesthesia plan and follow-up arrangements. Verify each provider and discuss your personal risks with a qualified clinician before travel."],
      ["Do I need a special visa for medical treatment in China?", "Entry requirements vary by nationality, itinerary, length of stay and purpose. Check the latest official Chinese government guidance and confirm documentation with the treating institution before booking."],
      ["Can CeladonChina recommend a treatment?", "No. CeladonChina provides information and coordination. Diagnosis, treatment selection, consent and medical decisions remain between the patient and licensed medical professionals."],
      ["What documents should I bring?", "Ask the provider which records are relevant. Common items include medical history, medication and allergy lists, recent reports, imaging, prescriptions, passport details and the clinic's written appointment confirmation."],
    ],
  },
  "plastic-surgery": {
    path: "/plastic-surgery-china",
    title: "Plastic Surgery in China: Costs, Safety, Surgeons & Travel Guide",
    description: "Plan plastic surgery in China with practical 2026 guidance on costs, surgeon and hospital checks, procedures, recovery, travel and follow-up.",
    kicker: "Plastic surgery in China",
    heading: "Plastic surgery in China: plan around safety, not a headline price.",
    intro: "Use this independent planning guide to compare cost components, verify a surgeon and facility, prepare for recovery and understand the practical steps of travelling to China for cosmetic surgery.",
    cta: "Discuss my procedure and trip",
    sections: [
      { title: "Choose the procedure only after consultation", body: "A search term such as rhinoplasty, facelift or liposuction describes a category, not your treatment plan. Anatomy, health history, goals, previous surgery and recovery constraints can change what is appropriate. Ask what alternatives exist, what the procedure cannot achieve and why the clinician recommends one approach." },
      { title: "Check the surgeon's exact credentials", body: "Confirm the surgeon's legal name, current medical registration, relevant specialty training, facility privileges and experience with the procedure you are considering. Ask who will perform each part of the operation and who will manage postoperative review. Do not rely on follower counts, awards without an issuer or unlabeled before-and-after images." },
      { title: "Confirm anesthesia and emergency arrangements", body: "Ask where surgery will take place, who administers anesthesia, what monitoring is used and how emergencies are handled. Confirm whether the facility is licensed for the planned procedure and whether an overnight stay or hospital transfer might be needed." },
      { title: "Compare the full cost, not the headline price", body: "A meaningful estimate separates surgeon, facility, anesthesia, tests, medication, garments, translation, hotel and follow-up costs. Ask what happens financially if the plan changes after examination, if you need extra nights or if a complication requires additional care." },
      { title: "Treat recovery as part of the procedure", body: "Swelling, mobility limits and travel restrictions vary by operation and patient. Get written instructions for wound care, medication, activity, warning signs and flying. Arrange a named contact in China and a realistic follow-up route after you return home." },
    ],
    faqs: [
      ["How much does plastic surgery in China cost?", "Cost depends on the procedure, surgeon, facility, anesthesia, tests and recovery needs. Obtain an individualized written estimate after clinical review rather than relying on a headline package price."],
      ["How do I find a plastic surgeon in China?", "Start with published profiles, then independently confirm identity, license, specialty, facility privileges and the evidence behind experience claims. CeladonChina explains its profile checks in its Provider Verification Standards."],
      ["Can I fly home immediately after surgery?", "Not necessarily. Flying and long-distance travel can add risk after some procedures. The treating surgeon should set the timing based on your operation, recovery and health."],
      ["Are results guaranteed?", "No. Cosmetic surgery has risks and outcomes vary. A responsible provider should discuss limitations, alternatives, likely recovery and possible complications before consent."],
    ],
  },
} as const;

const plasticSurgeryCosts = [
  { procedure: "Double eyelid surgery", range: "$800–$5,000", recovery: "7–14 days", href: "/treatments/double-eyelid-surgery" },
  { procedure: "Rhinoplasty", range: "$2,200–$9,000", recovery: "1–2 weeks", href: "/treatments/rhinoplasty" },
  { procedure: "Facelift", range: "$2,500–$15,000", recovery: "2–4 weeks", href: "/treatments/facelift" },
  { procedure: "Liposuction", range: "$2,500–$18,000", recovery: "2–6 weeks", href: "/treatments/liposuction" },
] as const;

const chinaDestinations = [
  { city: "Shanghai", note: "Large specialist market with broad international transport links.", href: "/cities/shanghai" },
  { city: "Beijing", note: "Major hospital systems and access to multidisciplinary care.", href: "/cities/beijing" },
  { city: "Guangzhou", note: "Strong southern-China access and a substantial aesthetic-care market.", href: "/cities/guangzhou" },
  { city: "Hangzhou", note: "A quieter destination within reach of the Yangtze River Delta.", href: "/cities/hangzhou" },
] as const;

const cosmeticTourismGuideSlugs = new Set([
  "cosmetic-surgery-tourism-china",
  "cosmetic-surgery-china-for-international-patients",
  "choose-plastic-surgeon-china",
  "cosmetic-surgery-recovery-china",
  "china-vs-korea-cosmetic-surgery",
]);

const cosmeticTourismGuides = MEDICAL_TOURISM_GUIDES.filter((guide) =>
  cosmeticTourismGuideSlugs.has(guide.slug),
);

const ChinaSeoGuide = ({ kind }: { kind: GuideKind }) => {
  const copy = guideCopy[kind];
  const { open } = useQuote();
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: copy.title,
    description: copy.description,
    url: `${SITE_URL}${copy.path}`,
    dateModified: "2026-09-07",
    datePublished: "2026-08-31",
    author: { "@type": "Organization", name: "CeladonChina Editorial Team", url: `${SITE_URL}/editorial-policy` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    audience: { "@type": "Patient" },
  };

  return (
    <div className="min-h-screen bg-background">
      <PageMeta title={copy.title} description={copy.description} path={copy.path} type="article" structuredData={[articleSchema, faqSchema]} />
      <AsiaNavbar />
      <main>
        <section className="border-b border-border/60 bg-gradient-hero/60">
          <div className="container grid gap-8 py-12 md:py-20 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div>
              <span className="pill mb-4 bg-accent text-accent-foreground"><FileCheck2 className="size-3.5 text-primary" />{copy.kicker}</span>
              <h1 className="max-w-4xl font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl">{copy.heading}</h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">{copy.intro}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Updated September 7, 2026 · Editorially reviewed · General information, not medical advice</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={() => open({ source: `${kind}_guide` })} className="rounded-full px-7">{copy.cta}<ArrowRight className="ml-2 size-4" /></Button>
                <Button size="lg" variant="outline" asChild className="rounded-full bg-background px-7"><Link to="/provider-verification">Read our verification standards</Link></Button>
              </div>
            </div>
            <aside className="rounded-3xl border border-primary/20 bg-card p-6 shadow-soft md:p-8" aria-label="Planning checklist">
              <ShieldCheck className="size-8 text-primary" />
              <h2 className="mt-5 font-display text-2xl font-medium">Before you pay or book a flight</h2>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
                {["Confirm the treating clinician and facility", "Get the proposed plan and fees in writing", "Discuss risks, alternatives and recovery time", "Confirm translation, emergency and follow-up contacts"].map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" /><span>{item}</span></li>)}
              </ul>
            </aside>
          </div>
        </section>

        <section className="container py-12 md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-4 sm:grid-cols-3">
              {[{ icon: Stethoscope, label: "Clinical review first" }, { icon: ShieldCheck, label: "Provider checks" }, { icon: Plane, label: "Recovery-led travel" }].map(({ icon: Icon, label }) => <div key={label} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-sm font-semibold"><Icon className="size-5 text-primary" />{label}</div>)}
            </div>
            {kind === "medical-tourism" && (
              <section className="mt-12 border-y border-border py-10" aria-labelledby="planning-guides-heading">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Detailed planning guides</span>
                    <h2 id="planning-guides-heading" className="mt-3 font-display text-3xl font-medium md:text-4xl">Plan one decision at a time.</h2>
                  </div>
                  <p className="max-w-md text-sm leading-6 text-muted-foreground">Use focused guides for costs, safety, entry, provider selection and recovery, then return to this page for the complete journey.</p>
                </div>
                <div className="mt-8 grid gap-x-8 gap-y-0 md:grid-cols-2">
                  {MEDICAL_TOURISM_GUIDES.map((guide, index) => (
                    <Link key={guide.slug} to={medicalTourismGuidePath(guide.slug)} className="group flex min-h-28 items-start gap-4 border-t border-border py-5 first:border-t-0 md:[&:nth-child(2)]:border-t-0">
                      <span className="font-display text-xl text-primary/65">0{index + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-xl font-medium leading-tight group-hover:text-primary">{guide.title.replace(/:.*$/, "")}</span>
                        <span className="mt-2 line-clamp-2 block text-sm leading-6 text-muted-foreground">{guide.description}</span>
                      </span>
                      <ArrowRight className="mt-1 size-4 shrink-0 transition group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
            {kind === "plastic-surgery" && (
              <nav aria-label="On this page" className="mt-8 rounded-3xl border border-border bg-card p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">On this page</p>
                <div className="mt-4 grid gap-3 text-sm font-semibold sm:grid-cols-2 lg:grid-cols-3">
                  <a href="#costs" className="hover:text-primary">Costs and recovery</a>
                  <a href="#planning-details" className="hover:text-primary">Safety and provider checks</a>
                  <a href="#destinations" className="hover:text-primary">China destinations</a>
                  <a href="#questions" className="hover:text-primary">Frequently asked questions</a>
                  <a href="#sources" className="hover:text-primary">Sources and methodology</a>
                </div>
              </nav>
            )}
            {kind === "plastic-surgery" && (
              <section className="mt-12 border-y border-border py-10" aria-labelledby="cosmetic-tourism-guides-heading">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)] md:items-end">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Cosmetic surgery travel guides</span>
                    <h2 id="cosmetic-tourism-guides-heading" className="mt-3 font-display text-3xl font-medium md:text-4xl">Plan the procedure and the journey together.</h2>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">Start with the complete tourism guide, then check international-patient access, surgeon evidence, recovery travel and the China–Korea comparison.</p>
                </div>
                <div className="mt-8 divide-y divide-border border-y border-border">
                  {cosmeticTourismGuides.map((guide, index) => (
                    <Link key={guide.slug} to={medicalTourismGuidePath(guide.slug)} className="group grid gap-3 py-5 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-start">
                      <span className="font-display text-xl text-primary/65">0{index + 1}</span>
                      <span>
                        <span className="block font-display text-xl font-medium leading-tight group-hover:text-primary">{guide.title}</span>
                        <span className="mt-2 line-clamp-2 block text-sm leading-6 text-muted-foreground">{guide.description}</span>
                      </span>
                      <ArrowRight className="mt-1 hidden size-4 shrink-0 transition group-hover:translate-x-0.5 sm:block" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
            {kind === "plastic-surgery" && (
              <section id="costs" className="mt-12 scroll-mt-32">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Planning ranges</span>
                <h2 className="mt-3 font-display text-3xl font-medium md:text-4xl">Plastic surgery costs in China</h2>
                <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">These broad USD ranges are for early planning, not quotes. Surgeon experience, city, facility, anesthesia, tests, implants, hospital stay and revision complexity can materially change the final amount.</p>
                <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="p-4">Procedure</th><th className="p-4">Planning range</th><th className="p-4">Early recovery range</th><th className="p-4">Guide</th></tr></thead>
                      <tbody>{plasticSurgeryCosts.map((row) => <tr key={row.procedure} className="border-t border-border"><td className="p-4 font-semibold">{row.procedure}</td><td className="p-4">{row.range}</td><td className="p-4 text-muted-foreground">{row.recovery}</td><td className="p-4"><Link className="font-semibold text-primary underline underline-offset-4" to={row.href}>View procedure</Link></td></tr>)}</tbody>
                    </table>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-6 text-muted-foreground">Recovery ranges describe common early recovery windows, not clearance to fly or return to work. Obtain a written, individualized plan and fee breakdown from the treating provider.</p>
              </section>
            )}
            <div id="planning-details" className="mt-12 scroll-mt-32 space-y-10">
              {copy.sections.map((section, index) => <article key={section.title} className="grid gap-4 border-t border-border pt-8 md:grid-cols-[7rem_1fr]"><span className="font-display text-3xl text-primary/60">0{index + 1}</span><div><h2 className="font-display text-2xl font-medium md:text-3xl">{section.title}</h2><p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{section.body}</p></div></article>)}
            </div>
            {kind === "plastic-surgery" && (
              <section id="destinations" className="mt-16 scroll-mt-32">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Where to start</span>
                <h2 className="mt-3 font-display text-3xl font-medium md:text-4xl">Compare plastic surgery destinations in China</h2>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  {chinaDestinations.map((item) => <Link key={item.city} to={item.href} className="group rounded-3xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"><h3 className="font-display text-2xl font-medium group-hover:text-primary">{item.city}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.note}</p><span className="mt-4 inline-flex items-center text-sm font-semibold">Explore {item.city}<ArrowRight className="ml-2 size-4" /></span></Link>)}
                </div>
              </section>
            )}
          </div>
        </section>

        <section id="questions" className="scroll-mt-32 border-y border-border/60 bg-muted/35">
          <div className="container py-12 md:py-16">
            <div className="mx-auto max-w-5xl">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Questions international patients ask</span>
              <h2 className="mt-3 font-display text-3xl font-medium md:text-4xl">Frequently asked questions</h2>
              <div className="mt-7 divide-y divide-border rounded-3xl border border-border bg-card px-5 md:px-8">
                {copy.faqs.map(([question, answer]) => <article key={question} className="py-6"><h3 className="font-display text-xl font-medium">{question}</h3><p className="mt-2 max-w-4xl text-sm leading-7 text-muted-foreground">{answer}</p></article>)}
              </div>
            </div>
          </div>
        </section>

        {kind === "plastic-surgery" && (
          <section id="sources" className="container scroll-mt-32 py-12">
            <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card p-6 md:p-8">
              <h2 className="font-display text-2xl font-medium">Sources and methodology</h2>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-muted-foreground">CeladonChina separates general planning information from individualized medical advice. Price and recovery ranges are broad editorial planning ranges compiled from the procedure information published on this site; they are not promises of price, candidacy or outcome. Provider information should be verified with the named clinician, facility and relevant regulator before payment or travel.</p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
                <Link className="text-primary underline underline-offset-4" to="/editorial-policy">Editorial policy</Link>
                <Link className="text-primary underline underline-offset-4" to="/medical-review-policy">Medical review policy</Link>
                <Link className="text-primary underline underline-offset-4" to="/provider-verification">Provider verification standards</Link>
              </div>
            </div>
          </section>
        )}

        <section className="container py-12 md:py-16">
          <div className="mx-auto flex max-w-5xl flex-col gap-5 rounded-3xl bg-foreground p-7 text-background md:flex-row md:items-center md:justify-between md:p-10">
            <div><h2 className="font-display text-3xl font-medium">Bring your questions before you bring your suitcase.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-background/70">Tell us what you are considering. We can help organize the practical next steps; medical decisions remain with licensed providers.</p></div>
            <Button size="lg" onClick={() => open({ source: `${kind}_guide_bottom` })} className="shrink-0 rounded-full px-7">{copy.cta}<ArrowRight className="ml-2 size-4" /></Button>
          </div>
          <p className="mx-auto mt-6 max-w-5xl text-xs leading-6 text-muted-foreground">Medical disclaimer: All procedures carry risks and results vary. This page provides general planning information, not diagnosis, treatment recommendations or a guarantee of provider quality. Confirm current entry rules with official sources and obtain personalized medical advice from qualified professionals.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ChinaSeoGuide;

import { ArrowRight, Building2, HeartHandshake, Plane, Languages, Hotel, Headphones, Wallet } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import PageMeta from "@/components/PageMeta";
import TrustPageLayout, { TrustList, TrustSection } from "@/components/TrustPageLayout";
import { ORGANIZATION_ENTITY, SITE_URL, WEBSITE_ENTITY } from "@/lib/seo-config";

const About = () => {
  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    if (!targetId) return;
    const frame = window.requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView({ block: "start" }));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const questions = [
    {
      question: "What is CeladonChina?",
      answer: "CeladonChina is a China-focused cosmetic medical travel information and non-clinical coordination platform for international patients considering cosmetic care in China.",
    },
    {
      question: "Does CeladonChina provide medical treatment or medical advice?",
      answer: "No. CeladonChina is not a hospital, clinic or medical practice. It does not diagnose, prescribe, select a procedure for a patient, control clinical care or guarantee an outcome.",
    },
    {
      question: "How can CeladonChina help an international patient?",
      answer: "CeladonChina can help people compare published provider and procedure information, prepare consultation questions, organize records, and coordinate appointments, translation and practical travel support when confirmed.",
    },
    {
      question: "Who is responsible for the medical care?",
      answer: "The treating clinician and licensed medical facility are responsible for medical assessment, informed consent, treatment, anesthesia and clinical aftercare. Patients should independently verify current credentials and facility licensing before payment or travel.",
    },
    {
      question: "Why do clinics work with CeladonChina?",
      answer: "CeladonChina helps partner clinics communicate with international patients and coordinates non-clinical details such as introductions, consultations, appointments, interpretation, airport pickup and accommodation. The clinic remains responsible for medical care and receives medical payments directly from the patient.",
    },
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "@id": `${SITE_URL}/about#page`,
      url: `${SITE_URL}/about`,
      name: "About CeladonChina",
      description: "How CeladonChina helps people research and coordinate cosmetic medical travel in China, including the limits of our role.",
      mainEntity: { "@id": `${SITE_URL}/#organization` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      dateModified: "2026-09-13",
    },
    {
      "@context": "https://schema.org",
      "@graph": [ORGANIZATION_ENTITY, WEBSITE_ENTITY],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: questions.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ];

  return (
    <>
      <PageMeta
        title="About CeladonChina"
        description="Learn how CeladonChina supports cosmetic medical travel research and coordination exclusively in China, what we check, and where our role ends."
        path="/about"
        structuredData={schema}
      />
      <TrustPageLayout
        effectiveDate="September 13, 2026"
        eyebrow="About CeladonChina"
        icon={HeartHandshake}
        title="A clearer way to prepare for cosmetic care in China."
        intro="CeladonChina brings provider information, practical questions, and travel coordination into one place, so you can prepare before making a medical decision."
      >
        <TrustSection id="clinic-partnerships" title="Why clinics work with CeladonChina">
          <p className="text-lg font-medium leading-8 text-foreground">International patients need more than an appointment. They need clear communication before arrival and practical support throughout their stay in China.</p>
          <p>CeladonChina works with partner hospitals and clinics as an international-patient concierge. We coordinate introductions, consultations and appointments, then help with the non-clinical details around the care journey. This gives each patient one team to contact while the clinic stays focused on medical care.</p>

          <div className="grid gap-4 pt-2 lg:grid-cols-2">
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.06] p-5">
              <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground"><Building2 aria-hidden="true" className="size-5 text-primary" />One team around your care</h3>
              <p className="mt-3">Tell us what you are considering. We help you compare suitable hospitals and clinics, coordinate introductions, consultations and appointments, and support your journey in China from start to finish.</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2" aria-label="Included concierge support">
                {([
                  [Plane, "Airport pickup"],
                  [Languages, "In-clinic interpretation"],
                  [Hotel, "Two hotel nights"],
                  [Headphones, "Dedicated concierge support"],
                ] as const).map(([Icon, label]) => (
                  <li key={label} className="flex items-center gap-2 font-semibold text-foreground">
                    <Icon aria-hidden="true" className="size-4 shrink-0 text-primary" />{label}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-5">Included at no additional service fee for eligible confirmed journeys. Dates, visits and services are confirmed in writing before travel.</p>
            </div>

            <div className="rounded-2xl border border-border bg-muted/35 p-5">
              <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground"><Wallet aria-hidden="true" className="size-5 text-primary" />A direct payment relationship</h3>
              <p className="mt-3">You choose the provider and pay all consultation, examination, surgery, anesthesia and other medical fees directly to that hospital or clinic. CeladonChina does not collect medical payments or control clinical decisions.</p>
              <p className="mt-4 font-semibold text-foreground">We coordinate your care journey. You pay your chosen provider directly.</p>
              <Link to="/travel-packages#payment-terms" className="group mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/25 bg-background px-4 font-semibold text-foreground transition-colors hover:border-primary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                See $200 deposit terms<ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
              </Link>
            </div>
          </div>
        </TrustSection>

        <TrustSection title="CeladonChina at a glance">
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              ["What it is", "An information and non-clinical coordination platform for international patients. Our service area is China only."],
              ["What it covers", "Cosmetic surgery in China, provider research, consultation preparation, travel logistics, translation and follow-up coordination."],
              ["Who delivers care", "Independent treating clinicians and licensed medical facilities—not CeladonChina."],
              ["How to contact us", "Email contact@celadonchina.com or use WhatsApp at +1 470 861 3825."],
            ].map(([term, detail]) => (
              <div key={term} className="rounded-2xl border border-border bg-muted/35 p-4">
                <dt className="font-semibold text-foreground">{term}</dt>
                <dd className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</dd>
              </div>
            ))}
          </dl>
        </TrustSection>

        <TrustSection title="What we do">
          <p>We help international patients organize the non-clinical parts of exploring cosmetic care in China. That can include finding published provider information, preparing consultation questions, organizing records, and planning translation or travel support.</p>
          <TrustList items={[
            "Present provider and procedure information in a format that is easier to compare.",
            "Help you prepare questions for a licensed clinician and keep your records organized.",
            "Coordinate practical support such as appointments, translation, airport pickup, and accommodation guidance when confirmed.",
          ]} />
        </TrustSection>

        <TrustSection title="Where our role ends">
          <p>CeladonChina is not a hospital, clinic, medical practice, or emergency service. We do not diagnose, prescribe, select a procedure for you, control clinical care, or guarantee an outcome.</p>
          <p>Your treating clinician and licensed medical facility are responsible for medical assessment, informed consent, treatment, anesthesia, and aftercare. You should independently confirm their credentials and decide whether the proposed care is right for you.</p>
        </TrustSection>

        <TrustSection title="How we approach trust">
          <p>A polished profile is not proof of clinical quality. We separate published information, independently checked facts, sample content, and medical review status so readers can see what each label means.</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Provider standards", "/provider-verification"],
              ["Medical review", "/medical-review-policy"],
              ["Editorial policy", "/editorial-policy"],
            ].map(([label, to]) => (
              <Link key={to} to={to} className="group flex min-h-20 items-center justify-between rounded-2xl border border-border bg-muted/35 p-4 font-semibold text-foreground transition hover:border-primary/35">
                {label}<ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </TrustSection>

        <TrustSection title="Questions people ask">
          <div className="divide-y divide-border">
            {questions.map(({ question, answer }) => (
              <div key={question} className="py-5 first:pt-0 last:pb-0">
                <h3 className="font-semibold text-foreground">{question}</h3>
                <p className="mt-2">{answer}</p>
              </div>
            ))}
          </div>
        </TrustSection>

        <TrustSection title="Contact and accountability">
          <p>Questions about a profile, a policy, or a correction can be sent to <a className="font-semibold text-foreground underline decoration-primary/50 underline-offset-4" href="mailto:contact@celadonchina.com">contact@celadonchina.com</a>. For travel coordination, you can also contact us on WhatsApp at <a className="font-semibold text-foreground underline decoration-primary/50 underline-offset-4" href="https://wa.me/14708613825">+1 470 861 3825</a>.</p>
        </TrustSection>
      </TrustPageLayout>
    </>
  );
};

export default About;

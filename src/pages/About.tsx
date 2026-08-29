import { ArrowRight, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";
import PageMeta from "@/components/PageMeta";
import TrustPageLayout, { TrustList, TrustSection } from "@/components/TrustPageLayout";

const About = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Cosmetics Asia",
    description: "How Cosmetics Asia helps people research and coordinate cosmetic medical travel in China, including the limits of our role.",
  };

  return (
    <>
      <PageMeta
        title="About Cosmetics Asia"
        description="Learn how Cosmetics Asia supports cosmetic medical travel research and coordination, what we check, and where our role ends."
        path="/about"
        structuredData={schema}
      />
      <TrustPageLayout
        eyebrow="About Cosmetics Asia"
        icon={HeartHandshake}
        title="A clearer way to prepare for cosmetic care in China."
        intro="Cosmetics Asia brings provider information, practical questions, and travel coordination into one place, so you can prepare before making a medical decision."
      >
        <TrustSection title="What we do">
          <p>We help international patients organize the non-clinical parts of exploring cosmetic care in China. That can include finding published provider information, preparing consultation questions, organizing records, and planning translation or travel support.</p>
          <TrustList items={[
            "Present provider and procedure information in a format that is easier to compare.",
            "Help you prepare questions for a licensed clinician and keep your records organized.",
            "Coordinate practical support such as appointments, translation, airport pickup, and accommodation guidance when confirmed.",
          ]} />
        </TrustSection>

        <TrustSection title="Where our role ends">
          <p>Cosmetics Asia is not a hospital, clinic, medical practice, or emergency service. We do not diagnose, prescribe, select a procedure for you, control clinical care, or guarantee an outcome.</p>
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

        <TrustSection title="Contact and accountability">
          <p>Questions about a profile, a policy, or a correction can be sent to <a className="font-semibold text-foreground underline decoration-primary/50 underline-offset-4" href="mailto:hello@cosmetics-asia.com">hello@cosmetics-asia.com</a>. For travel coordination, you can also contact us on WhatsApp at <a className="font-semibold text-foreground underline decoration-primary/50 underline-offset-4" href="https://wa.me/14708613825">+1 470 861 3825</a>.</p>
        </TrustSection>
      </TrustPageLayout>
    </>
  );
};

export default About;

import { Stethoscope } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import TrustPageLayout, { TrustList, TrustSection } from "@/components/TrustPageLayout";

const MedicalReviewPolicy = () => (
  <>
    <PageMeta
      title="Medical Review Policy"
      description="How Cosmetics Asia labels, sources, reviews, and updates medical information, including when content is not medically reviewed."
      path="/medical-review-policy"
      structuredData={{ "@context": "https://schema.org", "@type": "MedicalWebPage", name: "Medical Review Policy", audience: { "@type": "Patient" } }}
    />
    <TrustPageLayout
      eyebrow="Medical review policy"
      icon={Stethoscope}
      title="Medical claims need evidence and a visible review trail."
      intro="This policy explains when content can be called medically reviewed, which sources we prefer, and how readers can distinguish clinical review from editorial research."
    >
      <TrustSection title="When we use the words medically reviewed">
        <p>A page may be labeled medically reviewed only when a qualified clinician has reviewed the relevant medical claims and the page displays that person's name, professional credentials, review date, and scope of review.</p>
        <p>If those details are absent, the page should be treated as editorially researched information, not medically reviewed content. Cosmetics Asia does not use a general disclaimer as a substitute for named clinical review.</p>
      </TrustSection>

      <TrustSection title="Content that requires medical review">
        <TrustList items={[
          "Claims about candidacy, contraindications, complications, expected outcomes, or comparative safety.",
          "Procedure descriptions, anesthesia information, recovery milestones, and aftercare instructions.",
          "Statements that could reasonably influence whether a reader seeks, delays, or refuses medical care.",
        ]} />
      </TrustSection>

      <TrustSection title="Sources and evidence">
        <p>We prioritize government health authorities, recognized professional and specialty societies, peer-reviewed literature, and current clinical guidance. Hospitals and clinics may be used for their own services, team, or logistical details, but promotional material is not treated as independent clinical evidence.</p>
        <p>Where evidence varies by patient, technique, or study quality, the copy should describe that uncertainty rather than present one number as universal.</p>
      </TrustSection>

      <TrustSection title="Review, updates, and conflicts">
        <TrustList items={[
          "Medical reviewers assess factual accuracy and clinical context; editors remain responsible for readability, sourcing, and disclosures.",
          "A reviewer must disclose financial or professional relationships relevant to the content. A material conflict may require another reviewer.",
          "Content should be reviewed again after a material guideline change, credible correction, new safety warning, or substantial rewrite.",
          "The latest review or update date should appear on the page when the information is time-sensitive.",
        ]} />
      </TrustSection>

      <TrustSection title="Not personal medical advice">
        <p>Website content cannot account for your medical history, examination, medications, or treatment setting. It is general education and does not replace advice from a licensed clinician who has assessed you.</p>
        <p>If you may be experiencing a medical emergency or a serious complication, contact local emergency services or the treating facility immediately. Do not wait for a reply from Cosmetics Asia.</p>
      </TrustSection>
    </TrustPageLayout>
  </>
);

export default MedicalReviewPolicy;

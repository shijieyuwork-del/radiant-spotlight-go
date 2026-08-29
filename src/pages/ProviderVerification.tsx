import { BadgeCheck } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import TrustPageLayout, { TrustList, TrustSection } from "@/components/TrustPageLayout";

const ProviderVerification = () => (
  <>
    <PageMeta
      title="Provider Verification Standards"
      description="The checks, labels, evidence, and limits behind provider profiles published by Cosmetics Asia."
      path="/provider-verification"
      structuredData={{ "@context": "https://schema.org", "@type": "WebPage", name: "Provider Verification Standards" }}
    />
    <TrustPageLayout
      eyebrow="Provider verification standards"
      icon={BadgeCheck}
      title="What we check, what we label, and what remains yours to confirm."
      intro="A provider profile should make its evidence visible. These standards explain the checks required before Cosmetics Asia describes a provider as verified."
    >
      <TrustSection title="Our profile labels">
        <TrustList items={[
          "Sample profile means the person and details are demonstration content. Sample pages must not be treated as real provider recommendations and are excluded from search indexing.",
          "Published profile means information is displayed on Cosmetics Asia. Publication alone does not mean every claim has been independently verified.",
          "Verified facts are individual details checked against acceptable evidence. A profile may only use a broader verified label when the required checks below are complete and dated.",
        ]} />
      </TrustSection>

      <TrustSection title="Checks required for a verified provider profile">
        <TrustList items={[
          "Identity: legal or commonly used professional name matches the supplied evidence.",
          "Professional registration: a current license or registration is confirmed through an issuing authority, official registry, or valid primary document.",
          "Specialty and training: claimed specialty, qualifications, and professional memberships are supported by the issuing body or traceable documentation.",
          "Facility affiliation: the provider's relationship with the named clinic or hospital is confirmed through the facility or another primary source.",
          "Evidence record: the source, date checked, and reviewer are recorded internally so a claim can be revisited.",
        ]} />
      </TrustSection>

      <TrustSection title="Acceptable evidence">
        <p>We prefer primary sources: government or professional registries, issuing institutions, current license documents, and direct confirmation from a licensed facility. Provider websites, social accounts, media coverage, and marketing materials may help locate a claim, but they do not independently prove it.</p>
        <p>Documents that are expired, cropped so the issuer cannot be identified, or inconsistent with another source are not sufficient until the discrepancy is resolved.</p>
      </TrustSection>

      <TrustSection title="What verification does not mean">
        <TrustList items={[
          "It is not an endorsement, ranking, safety guarantee, or prediction of your result.",
          "It does not confirm every patient review, before-and-after image, price, appointment slot, or marketing statement.",
          "It does not replace a consultation, informed consent, or your own check with the relevant licensing authority and facility.",
        ]} />
      </TrustSection>

      <TrustSection title="Ongoing review and corrections">
        <p>Material profile facts should be rechecked when a license expires, a provider changes facilities, a credible correction is received, or a source becomes unavailable. We may remove a label or unpublish a profile while evidence is incomplete.</p>
        <p>To question a claim, email <a className="font-semibold text-foreground underline decoration-primary/50 underline-offset-4" href="mailto:hello@cosmetics-asia.com?subject=Provider%20profile%20correction">hello@cosmetics-asia.com</a> with the profile URL and supporting source. We will acknowledge the request and review material corrections before updating the page.</p>
      </TrustSection>
    </TrustPageLayout>
  </>
);

export default ProviderVerification;

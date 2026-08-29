import { BookOpenCheck } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import TrustPageLayout, { TrustList, TrustSection } from "@/components/TrustPageLayout";

const EditorialPolicy = () => (
  <>
    <PageMeta
      title="Editorial Policy"
      description="The sourcing, labeling, correction, translation, and commercial disclosure standards used by Cosmetics Asia."
      path="/editorial-policy"
      structuredData={{ "@context": "https://schema.org", "@type": "WebPage", name: "Cosmetics Asia Editorial Policy" }}
    />
    <TrustPageLayout
      eyebrow="Editorial policy"
      icon={BookOpenCheck}
      title="Useful information should show where it came from."
      intro="Our editorial standards are designed to help readers separate sourced facts, provider-supplied details, sample content, and promotional claims."
    >
      <TrustSection title="Core standards">
        <TrustList items={[
          "Accuracy: factual claims must be supported by a traceable source or clearly attributed to the person or organization making the claim.",
          "Clarity: medical uncertainty, eligibility limits, and material costs should not be hidden behind promotional language.",
          "Independence: payment, referral, or coordination relationships must not turn an unsupported claim into a verified fact.",
          "Respect: patient information and images require appropriate permission, context, and privacy protection.",
        ]} />
      </TrustSection>

      <TrustSection title="How we source information">
        <p>For health and safety information, we prefer primary and authoritative sources. For provider facts, we look for registries, issuing bodies, facilities, and original documents. News reports and provider materials are attributed when used.</p>
        <p>Statistics should name the publisher and period they describe. Quotes should preserve their original meaning. Images, profiles, and stories that are demonstrations must be labeled as samples rather than presented as real patient or provider evidence.</p>
      </TrustSection>

      <TrustSection title="Commercial relationships and rankings">
        <p>Any paid placement, sponsorship, referral arrangement, or provider-supplied content should be disclosed where it could affect a reader's interpretation. A commercial relationship is not evidence of medical quality.</p>
        <p>Provider order, badges, and comparison language must not imply a clinical ranking unless the methodology, evidence, and limitations are published alongside it.</p>
      </TrustSection>

      <TrustSection title="Drafting tools, translation, and human responsibility">
        <p>Editing, translation, and software tools may assist with drafts or presentation. They do not replace source checking or clinical review. The person responsible for publication remains accountable for the final claims, labels, links, and corrections.</p>
        <p>Translated content should preserve clinical cautions and uncertainty. When a translation could change a treatment decision, readers should confirm the meaning with a qualified medical interpreter and treating clinician.</p>
      </TrustSection>

      <TrustSection title="Corrections and updates">
        <p>We correct material errors when credible evidence is provided. Minor spelling or formatting fixes may be made without a notice; a change to a medical claim, provider credential, commercial disclosure, or patient account should update the page date and, when useful, include a correction note.</p>
        <p>Email <a className="font-semibold text-foreground underline decoration-primary/50 underline-offset-4" href="mailto:hello@cosmetics-asia.com?subject=Editorial%20correction">hello@cosmetics-asia.com</a> with the page URL, the statement in question, and a supporting source. Correction requests are assessed on evidence, not on whether the requester agrees with the conclusion.</p>
      </TrustSection>
    </TrustPageLayout>
  </>
);

export default EditorialPolicy;

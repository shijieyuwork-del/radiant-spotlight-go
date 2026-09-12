import { Scale } from "lucide-react";
import CompanyDetails from "@/components/CompanyDetails";
import CompanyPageLayout from "@/components/CompanyPageLayout";

const LegalNotice = () => (
  <CompanyPageLayout
    title="Legal Notice"
    description="Legal operator and registered-office information for the CeladonChina website."
    path="/legal-notice"
    eyebrow="Legal information"
    icon={Scale}
  >
    <CompanyDetails showContacts />
    <section className="rounded-[2rem] border border-border bg-card p-6 shadow-soft md:p-9">
      <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">Role of the website</h2>
      <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">CeladonChina publishes general information and coordinates non-clinical support. It does not operate the independent clinics and hospitals listed on this website and does not replace an assessment by a licensed medical professional.</p>
    </section>
  </CompanyPageLayout>
);

export default LegalNotice;

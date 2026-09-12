import { FileText } from "lucide-react";
import CompanyDetails from "@/components/CompanyDetails";
import CompanyPageLayout from "@/components/CompanyPageLayout";

const Terms = () => (
  <CompanyPageLayout title="Terms of Use" description="The terms that apply when you use CeladonChina information, consultation and travel-coordination services." path="/terms" eyebrow="Terms" icon={FileText}>
    <section className="rounded-[2rem] border border-border bg-card p-6 shadow-soft md:p-9">
      <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">Using CeladonChina</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground md:text-base">
        <p>CeladonChina provides general information and non-clinical coordination support. It is not a hospital, clinic, medical practice, or emergency service and does not provide diagnosis, prescriptions, or medical treatment.</p>
        <p>Provider, procedure, price, travel, and recovery information may change and should be independently confirmed before you make a decision. Medical decisions remain between you and the licensed clinician and medical institution you choose.</p>
        <p>You may use this website for personal, lawful purposes. You must not misuse the website, attempt unauthorized access, submit false information, or reproduce substantial parts of its content without permission.</p>
      </div>
    </section>
    <CompanyDetails showContacts />
  </CompanyPageLayout>
);
export default Terms;

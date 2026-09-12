import { MessageCircle } from "lucide-react";
import CompanyDetails, { COMPANY } from "@/components/CompanyDetails";
import CompanyPageLayout from "@/components/CompanyPageLayout";

const Contact = () => (
  <CompanyPageLayout title="Contact CeladonChina" description="Contact our coordination team about consultations, travel support, provider information, privacy, or corrections." path="/contact" eyebrow="Contact" icon={MessageCircle}>
    <CompanyDetails showContacts />
    <section className="rounded-[2rem] border border-border bg-card p-6 shadow-soft md:p-9">
      <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">How to reach us</h2>
      <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">For general enquiries, email <a className="font-semibold text-foreground underline decoration-primary/50 underline-offset-4" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>. For consultation and travel-coordination questions, message us on WhatsApp at <a className="font-semibold text-foreground underline decoration-primary/50 underline-offset-4" href={`https://wa.me/${COMPANY.telephoneHref.replace("+", "")}`}>{COMPANY.telephone}</a>.</p>
      <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">The registered office is provided for company identification and statutory correspondence. It is not a clinic, hospital, or walk-in patient service location.</p>
    </section>
  </CompanyPageLayout>
);
export default Contact;

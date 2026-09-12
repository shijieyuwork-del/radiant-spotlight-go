import { Building2, Mail, MapPin, Phone } from "lucide-react";

export const COMPANY = {
  brandName: "CeladonChina",
  legalName: "Celadon Limited",
  legalNameZh: "青慈有限公司",
  email: "contact@celadonchina.com",
  telephone: "+1 470 861 3825",
  telephoneHref: "+14708613825",
  address: "Room 18, 2/F, TusPark, 118 Wai Yip Street, Kwun Tong, Kowloon, Hong Kong",
} as const;

const CompanyDetails = ({ showContacts = false }: { showContacts?: boolean }) => (
  <section aria-labelledby="company-details-title" className="rounded-[2rem] border border-border bg-card p-6 shadow-soft md:p-9">
    <div className="flex items-start gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary" aria-hidden="true">
        <Building2 className="size-5" />
      </span>
      <div className="min-w-0">
        <h2 id="company-details-title" className="font-display text-2xl font-semibold tracking-tight md:text-3xl">Company details</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
          <strong className="font-semibold text-foreground">CeladonChina is operated by Celadon Limited (青慈有限公司), a company incorporated in Hong Kong.</strong>
        </p>
      </div>
    </div>
    <dl className="mt-6 grid gap-4 border-t border-border pt-6 text-sm md:text-base">
      <div className="grid gap-1 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
        <dt className="font-semibold text-foreground">Registered office</dt>
        <dd className="flex gap-2 leading-7 text-muted-foreground"><MapPin className="mt-1.5 size-4 shrink-0 text-primary" aria-hidden="true" />{COMPANY.address}</dd>
      </div>
      {showContacts && <>
        <div className="grid gap-1 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
          <dt className="font-semibold text-foreground">Email</dt>
          <dd><a className="inline-flex items-center gap-2 text-muted-foreground underline decoration-primary/50 underline-offset-4 hover:text-foreground" href={`mailto:${COMPANY.email}`}><Mail className="size-4 text-primary" aria-hidden="true" />{COMPANY.email}</a></dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
          <dt className="font-semibold text-foreground">Telephone / WhatsApp</dt>
          <dd><a className="inline-flex items-center gap-2 text-muted-foreground underline decoration-primary/50 underline-offset-4 hover:text-foreground" href={`https://wa.me/${COMPANY.telephoneHref.replace("+", "")}`}><Phone className="size-4 text-primary" aria-hidden="true" />{COMPANY.telephone}</a></dd>
        </div>
      </>}
    </dl>
  </section>
);

export default CompanyDetails;

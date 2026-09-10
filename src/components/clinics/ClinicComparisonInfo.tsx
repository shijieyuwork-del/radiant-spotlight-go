import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ClinicPublicProfile } from "@/data/clinicProfiles";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";
import { clinicProfileCopy, clinicServiceNames, type ClinicCopy } from "./clinicProfileCopy";

export function ClinicComparisonInfo({ profile, onAsk }: { profile: ClinicPublicProfile; onAsk: () => void }) {
  const { lang } = useAsia();
  const text = (copy: ClinicCopy) => asiaCopy(lang, copy);
  const sourceLink = (href: string, label: ClinicCopy) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-start gap-1.5 rounded-sm text-sm font-medium underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
      {text(label)}<ArrowUpRight className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span className="sr-only"> ({text(clinicProfileCopy.sourceLanguage)})</span>
    </a>
  );

  return (
    <section aria-labelledby="clinic-comparison-title" className="mb-10 rounded-2xl border border-border/70 bg-card p-5 sm:p-7">
      <h2 id="clinic-comparison-title" className="font-display text-2xl font-medium">{text(clinicProfileCopy.title)}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{text(clinicProfileCopy.introduction)}</p>
      <dl className="mt-6 grid gap-x-8 md:grid-cols-2">
        <div className="min-w-0 border-t border-border/70 py-5">
          <dt className="font-semibold">{text(clinicProfileCopy.services)}</dt>
          <dd className="mt-3 text-sm leading-6">
            {profile.services.length ? <ul className="flex flex-wrap gap-2">
              {profile.services.map((service) => <li key={service} className="rounded-full bg-primary/10 px-3 py-1 text-foreground">{text(clinicServiceNames[service])}</li>)}
            </ul> : <p className="text-muted-foreground">{text(clinicProfileCopy.servicesMissing)}</p>}
            {profile.services.length > 0 && <p className="mt-3 text-muted-foreground">{text(clinicProfileCopy.servicesNote)}</p>}
            {profile.serviceSourceUrl && sourceLink(profile.serviceSourceUrl, clinicProfileCopy.servicesLink)}
          </dd>
        </div>
        <div className="min-w-0 border-t border-border/70 py-5">
          <dt className="font-semibold">{text(clinicProfileCopy.doctors)}</dt>
          <dd className="mt-3 text-sm leading-6 text-muted-foreground">
            <p>{text(profile.doctorDirectoryUrl ? clinicProfileCopy.doctorsNote : clinicProfileCopy.doctorsMissing)}</p>
            {profile.doctorDirectoryUrl && sourceLink(profile.doctorDirectoryUrl, clinicProfileCopy.doctorsLink)}
          </dd>
        </div>
        <div className="min-w-0 border-t border-border/70 py-5">
          <dt className="font-semibold">{text(clinicProfileCopy.campus)}</dt>
          <dd className="mt-3 text-sm leading-6">
            {profile.campus ? <>
              <p>{lang === "zh" ? profile.campus.addressZh : profile.campus.addressEn}</p>
              {lang !== "zh" && <p lang="zh" className="mt-1 text-muted-foreground">{profile.campus.addressZh}</p>}
              <p className="mt-3 text-muted-foreground">{text(clinicProfileCopy.campusNote)}</p>
              {sourceLink(profile.campus.sourceUrl, clinicProfileCopy.campusLink)}
            </> : <p className="text-muted-foreground">{text(clinicProfileCopy.campusMissing)}</p>}
          </dd>
        </div>
        <div className="min-w-0 border-t border-border/70 py-5">
          <dt className="font-semibold">{text(clinicProfileCopy.language)}</dt>
          <dd className="mt-3 text-sm leading-6 text-muted-foreground">
            <p>{text(clinicProfileCopy.languageMissing)}</p>
            <p className="mt-3">{text(clinicProfileCopy.celadonLanguage)}</p>
            <a href="/travel-packages#support" className="mt-3 inline-flex items-start gap-1.5 rounded-sm font-medium underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
              {text(clinicProfileCopy.celadonLanguageLink)}<ArrowRight className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            </a>
          </dd>
        </div>
      </dl>
      <div className="flex flex-col gap-4 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-3xl text-xs leading-5 text-muted-foreground">
          <p className="font-medium text-foreground">{text(clinicProfileCopy.reviewDate)}: <time dateTime={profile.sourcesReviewedOn}>{profile.sourcesReviewedOn}</time></p>
          <p className="mt-1">{text(clinicProfileCopy.reviewNote)}</p>
        </div>
        <Button variant="outline" className="h-auto min-h-11 max-w-full shrink-0 whitespace-normal rounded-full px-5 py-3" onClick={onAsk}>
          {text(clinicProfileCopy.inquiry)}<ArrowRight className="ml-2 size-4 shrink-0" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}

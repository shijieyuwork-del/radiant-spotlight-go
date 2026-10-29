import { ArrowUpRight } from "lucide-react";
import type { DirectoryClinic } from "@/data/clinicDirectory";
import { findClinicCredentials, MEDICAL_REGISTRY_URL } from "@/data/clinicCredentials";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";

export function ClinicCredentials({ clinic }: { clinic: DirectoryClinic }) {
  const { lang } = useAsia();
  const record = findClinicCredentials(clinic);
  const c = (en: string, zh: string) => asiaCopy(lang, { en, zh, ru: en });
  return (
    <section aria-labelledby="clinic-credentials-title" className="mb-10 rounded-2xl border border-border/70 bg-card p-5 sm:p-7">
      <h2 id="clinic-credentials-title" className="font-display text-2xl font-medium">{c("Hospital credentials", "医院资质")}</h2>
      {record ? <>
        <dl className="mt-5 grid gap-5 md:grid-cols-2">
          {record.facts.map((fact) => <div key={fact.labelEn + fact.sourceUrl} className="min-w-0 border-t border-border/70 pt-4">
            <dt className="font-semibold">{lang === "zh" ? fact.labelZh : fact.labelEn}</dt>
            <dd className="mt-2 text-sm leading-6">
              <p>{lang === "zh" ? fact.valueZh : fact.valueEn}</p>
              <a href={fact.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center gap-1.5 underline underline-offset-4">
                {c("Official source", "官方资料来源")}<ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
              </a>
            </dd>
          </div>)}
        </dl>
        <p className="mt-4 text-xs text-muted-foreground">{c("Public sources reviewed", "公开资料核对日期")}: <time dateTime={record.reviewedOn}>{record.reviewedOn}</time></p>
      </> : <p className="mt-4 text-sm leading-6 text-muted-foreground">{c("Current institution-specific credentials have not yet been confirmed from official public sources.", "尚未从官方公开资料确认此机构的当前具体资质。")}</p>}
      <div className="mt-5 border-t border-border/70 pt-4 text-sm leading-6">
        <p className="text-muted-foreground">{c("For current licensing, use the registered institution name in the national medical institution register. Hospital grade and industry awards do not establish permission for an individual procedure.", "查询当前执业信息时，请使用机构登记全称。医院等级、行业评价与具体手术项目的准入资质分别核实。")}</p>
        <p className="mt-2 text-xs text-muted-foreground">{c("Directory name", "目录名称")}</p>
        <p lang="zh" className="mt-1 break-words font-medium">{clinic.nameZh}</p>
        <a href={MEDICAL_REGISTRY_URL} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-11 items-center gap-1.5 font-medium underline underline-offset-4">
          {c("National Health Commission — institution register", "国家卫生健康委 · 医院执业登记查询")}<ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import { ArrowUpRight, BadgeCheck, MapPin } from "lucide-react";
import type { City } from "@/data/cities";
import { getClinicPath, type DirectoryClinic } from "@/data/clinicDirectory";
import { findRealHospitalPhoto } from "@/data/realHospitalPhotos";
import { HospitalDirectoryPhoto } from "@/components/HospitalDirectoryPhoto";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";

export function ClinicCard({ clinic, city }: { clinic: DirectoryClinic; city: City }) {
  const { lang } = useAsia();
  const c = <T,>(en: T, zh: T, ru: T, es: T) => asiaCopy(lang, { en, zh, ru, es });
  const name = lang === "zh" ? clinic.nameZh : clinic.nameEn;
  const secondary = lang === "zh" ? clinic.nameEn : clinic.nameZh;
  const cityName = lang === "zh" ? city.zh : city.en;
  const area = lang === "zh" ? clinic.areaZh : clinic.areaEn;
  const photo = findRealHospitalPhoto(clinic.nameZh, clinic.nameEn, ...clinic.aliases);

  return (
    <li className="flex min-h-36 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-colors hover:border-primary/50">
      <HospitalDirectoryPhoto key={photo?.src ?? "no-photo"} photo={photo} name={name} href={getClinicPath(clinic)} />
      <Link to={getClinicPath(clinic)} className="group flex flex-1 flex-col p-5 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-primary">
        <h2 className="font-display text-xl font-medium leading-snug text-foreground group-hover:underline group-hover:underline-offset-4">{name}</h2>
        {secondary && secondary !== name && <p className="mt-1 text-xs leading-5 text-muted-foreground">{secondary}</p>}
        {clinic.doctorIds.length > 0 && (
          <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-foreground">
            <BadgeCheck className="size-3.5" aria-hidden="true" />
            {c("Published expert profile", "关联已发布专家资料", "Есть профиль специалиста", "Perfil de experto publicado")}
          </span>
        )}
        <p className="mt-auto flex items-center gap-2 pt-5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          {[cityName, area !== cityName ? area : ""].filter(Boolean).join(" · ")}
        </p>
        <span className="mt-4 flex items-center justify-between border-t border-border/60 pt-4 text-sm font-medium text-foreground">
          {c("View hospital", "查看医院详情", "Об учреждении", "Ver centro")}
          <ArrowUpRight className="size-4 text-foreground" aria-hidden="true" />
        </span>
      </Link>
    </li>
  );
}

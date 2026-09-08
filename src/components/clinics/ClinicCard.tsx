import { Link } from "react-router-dom";
import { ArrowUpRight, BadgeCheck, MapPin } from "lucide-react";
import type { City } from "@/data/cities";
import { getClinicPath, type DirectoryClinic } from "@/data/clinicDirectory";
import { findClinicPublicProfile } from "@/data/clinicProfiles";
import { findRealHospitalPhoto } from "@/data/realHospitalPhotos";
import { HospitalDirectoryPhoto } from "@/components/HospitalDirectoryPhoto";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";

export function ClinicCard({ clinic, city }: { clinic: DirectoryClinic; city: City }) {
  const { lang } = useAsia();
  const c = <T,>(en: T, zh: T, ru: T, es: T, th: T, ms: T) => asiaCopy(lang, { en, zh, ru, es, th, ms });
  const name = lang === "zh" ? clinic.nameZh : clinic.nameEn;
  const secondary = lang === "zh" ? clinic.nameEn : clinic.nameZh;
  const cityName = lang === "zh" ? city.zh : city.en;
  const profile = findClinicPublicProfile(clinic);
  const area = lang === "zh" ? profile?.campus?.areaZh ?? clinic.areaZh : profile?.campus?.areaEn ?? clinic.areaEn;
  const photo = findRealHospitalPhoto(clinic.nameZh, clinic.nameEn, ...clinic.aliases);

  return (
    <li className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-colors hover:border-primary/50 motion-reduce:transition-none">
      <HospitalDirectoryPhoto key={photo?.src ?? "no-photo"} photo={photo} name={name} href={getClinicPath(clinic)} reserveCreditSpace>
        <Link data-clinic-primary-link to={getClinicPath(clinic)} className="group flex flex-1 scroll-mt-64 flex-col p-5 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-foreground">
          <h2 className="min-h-[3.5rem] break-words font-display text-xl font-medium leading-snug text-foreground group-hover:underline group-hover:underline-offset-4">{name}</h2>
          {secondary && secondary !== name && <p className="mt-2 min-h-10 break-words text-xs leading-5 text-foreground">{secondary}</p>}
          {clinic.doctorIds.length > 0 && (
            <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-foreground">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              {c("Published expert profile", "关联已发布专家资料", "Есть профиль специалиста", "Perfil de experto publicado", "มีโปรไฟล์ผู้เชี่ยวชาญที่เผยแพร่แล้ว", "Profil pakar diterbitkan")}
            </span>
          )}
          <p className="mt-auto flex items-start gap-2 pt-5 text-sm leading-6 text-foreground">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            {[cityName, area !== cityName ? area : ""].filter(Boolean).join(" · ")}
          </p>
          <span className="mt-4 flex items-center justify-between border-t border-border/60 pt-4 text-sm font-medium text-foreground">
            {c("View hospital", "查看医院详情", "Об учреждении", "Ver centro", "ดูสถานพยาบาล", "Lihat pusat perubatan")}
            <ArrowUpRight className="size-4 shrink-0 text-foreground" aria-hidden="true" />
          </span>
        </Link>
      </HospitalDirectoryPhoto>
    </li>
  );
}

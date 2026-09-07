import { Link } from "react-router-dom";
import { ArrowUpRight, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublishedClinicDoctor } from "@/data/clinicDirectory";
import { localizedField } from "@/lib/i18n-content";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";

export function ClinicExperts({ doctors, isLoading, isError, retry }: {
  doctors: PublishedClinicDoctor[]; isLoading: boolean; isError: boolean; retry: () => void;
}) {
  const { lang } = useAsia();
  const c = <T,>(en: T, zh: T, ru: T, es: T) => asiaCopy(lang, { en, zh, ru, es });
  return (
    <section aria-labelledby="clinic-experts-title" className="border-t border-border/70 pt-8">
      <h2 id="clinic-experts-title" className="font-display text-2xl font-medium">{c("Published expert profiles", "已发布的专家资料", "Профили специалистов", "Perfiles de especialistas")}</h2>
      {isLoading ? (
        <div role="status" className="mt-5 space-y-3" aria-busy="true">
          <p className="text-sm text-muted-foreground">{c("Loading expert profiles…", "正在加载专家资料…", "Загрузка профилей…", "Cargando perfiles…")}</p>
          <div className="h-20 rounded-xl bg-muted motion-safe:animate-pulse" />
        </div>
      ) : isError ? (
        <div role="status" className="mt-4">
          <p className="text-sm text-muted-foreground">{c("Expert profiles could not be loaded.", "专家资料暂时无法加载。", "Не удалось загрузить профили.", "No se pudieron cargar los perfiles.")}</p>
          <Button variant="outline" className="mt-3" onClick={retry}>{c("Try again", "重试", "Повторить", "Reintentar")}</Button>
        </div>
      ) : doctors.length ? (
        <>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{c("These published profiles list this institution. Confirm the current practice location before arranging an appointment.", "这些已发布的专家资料关联此机构，预约前请确认当前执业地点。", "В этих профилях указано данное учреждение. Уточните текущее место приёма перед записью.", "Estos perfiles indican este centro. Confirma el lugar de consulta actual antes de concertar una cita.")}</p>
          <ul className="mt-5 divide-y divide-border/60">
            {doctors.map((doctor) => (
              <li key={doctor.id}>
                <Link to={`/doctors/profile/${doctor.id}`} className="group flex items-center gap-4 rounded-sm py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/10"><Stethoscope className="size-5" aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium group-hover:underline">{localizedField(doctor.i18n, "name", lang, doctor.name)}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{localizedField(doctor.i18n, "title", lang, doctor.title)}</p>
                  </div>
                  <ArrowUpRight className="size-5 shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">{c("No expert profiles have been published for this institution on CeladonChina yet.", "CeladonChina 暂未发布与此机构关联的专家资料。", "На CeladonChina пока нет опубликованных профилей специалистов этого учреждения.", "Todavía no hay perfiles de especialistas de este centro publicados en CeladonChina.")}</p>
      )}
    </section>
  );
}

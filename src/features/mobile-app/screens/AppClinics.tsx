import { useMemo, useState } from "react";
import { ArrowRight, Building2, MapPin, Search } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { CITIES, COUNTRY_BY_CITY, COUNTRY_META } from "@/data/cities";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";

const AppClinics = () => {
  const { lang } = useAsia();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(() => params.get("q") ?? "");
  const c = <T,>(en: T, zh: T, ru: T, es?: T) => asiaCopy(lang, { en, zh, ru, es });

  const entries = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return CITIES.map((city) => {
      const country = COUNTRY_META[COUNTRY_BY_CITY[city.slug]];
      const hospitals = city.hospitals.filter((hospital) => {
        const haystack = `${city.en} ${city.zh} ${country?.en ?? ""} ${hospital.en} ${hospital.zh} ${hospital.areaEn} ${hospital.areaZh}`.toLocaleLowerCase();
        return !term || haystack.includes(term);
      });
      return hospitals.length ? { city, country, hospitals } : null;
    }).filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  }, [query]);

  const total = entries.reduce((count, entry) => count + entry.hospitals.length, 0);

  return (
    <div className="px-4 pb-8 pt-2">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">{c("Clinic directory", "诊所目录", "Каталог клиник", "Directorio de clínicas")}</p>
        <h1 className="mt-2 font-display text-[2.45rem] leading-[.96]">{c("Every listed facility, in one place.", "所有收录机构，集中查看。", "Все учреждения в одном месте.", "Todos los centros en un solo lugar.")}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{c("Browse by city or district. Inclusion is not a ranking or medical recommendation.", "按城市或地区浏览。收录不代表排名或医疗推荐。", "Ищите по городу или району. Список не является рейтингом.", "Busca por ciudad o distrito. La inclusión no es una recomendación médica.")}</p>
      </header>

      <label className="relative mt-5 block"><span className="sr-only">{c("Search clinics", "搜索诊所", "Поиск клиник", "Buscar clínicas")}</span><Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder={c("Clinic, city or district", "诊所、城市或地区", "Клиника, город или район", "Clínica, ciudad o distrito")} className="min-h-12 w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>

      <div className="mt-5 flex items-center justify-between"><p className="text-xs font-semibold text-muted-foreground">{c(`${total} listed facilities`, `${total} 家收录机构`, `${total} учреждений`, `${total} centros`)}</p><Link to="/clinics" className="inline-flex min-h-11 items-center gap-1 py-3 text-xs font-bold text-primary">{c("Full directory", "完整目录", "Весь каталог", "Directorio completo")}<ArrowRight className="size-3.5" /></Link></div>

      <div className="mt-2 space-y-4" aria-live="polite">
        {entries.length === 0 && <div className="rounded-[1.35rem] border border-border bg-card p-7 text-center"><Building2 className="mx-auto size-6 text-primary" /><h2 className="mt-3 font-display text-2xl">{c("No matching facilities", "没有匹配的机构", "Ничего не найдено", "No hay resultados")}</h2><button type="button" onClick={() => setQuery("")} className="mt-3 min-h-11 rounded-full border border-foreground/20 px-5 text-sm font-semibold">{c("Clear search", "清除搜索", "Очистить", "Borrar búsqueda")}</button></div>}
        {entries.map(({ city, country, hospitals }) => (
          <article key={city.slug} className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-card">
            <div className="relative h-32 overflow-hidden"><img src={city.img} alt="" className="size-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/15 to-transparent" /><div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white"><div><p className="text-[9px] font-bold uppercase tracking-[.14em] text-white/70">{country?.flag} {lang === "zh" ? country?.zh : country?.en}</p><h2 className="mt-1 font-display text-2xl">{lang === "zh" ? city.zh : city.en}</h2></div><span className="text-[10px] font-semibold text-white/70">{hospitals.length} {c("listed", "家", "в списке", "centros")}</span></div></div>
            <ul className="divide-y divide-border/60">
              {hospitals.map((hospital) => (
                <li key={hospital.en} className="flex min-h-[5.5rem] items-start gap-3 px-4 py-3">
                  <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-xl bg-secondary"><Building2 className="size-4 text-foreground" /></span>
                  <div className="min-w-0"><h3 className="text-sm font-semibold leading-5">{lang === "zh" ? hospital.zh : hospital.en}</h3><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3 shrink-0 text-primary" />{lang === "zh" ? hospital.areaZh : hospital.areaEn}</p></div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="mt-5 rounded-[1.25rem] bg-secondary px-4 py-3 text-[10px] leading-4 text-muted-foreground">{c("Confirm current licensing, accreditation, facility privileges and treatment responsibility directly before booking.", "预约前请直接确认当前执业许可、认证、机构权限及治疗责任。", "Перед записью проверьте лицензии, аккредитацию и ответственность.", "Antes de reservar, confirma licencias, acreditación y responsabilidad del tratamiento.")}</p>
    </div>
  );
};

export default AppClinics;

import { useMemo, useRef, useState } from "react";
import { ArrowRight, MapPin, MessageCircle, Search, Stethoscope, X } from "lucide-react";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";
import { useAppDoctors } from "../useAppDoctors";
import type { AppDoctor } from "../types";

const WHATSAPP_URL = "https://wa.me/14708613825?text=Hi%20Cosmetics%20Asia%2C%20I%20would%20like%20help%20comparing%20published%20expert%20profiles.";

const AppExperts = () => {
  const { lang } = useAsia();
  const c = <T,>(en: T, zh: T, ru: T, es?: T) => asiaCopy(lang, { en, zh, ru, es });
  const { doctors, error, loading, retry } = useAppDoctors(lang);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AppDoctor | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return doctors;
    return doctors.filter((doctor) => `${doctor.name} ${doctor.title} ${doctor.city} ${doctor.specialties.join(" ")}`.toLocaleLowerCase().includes(term));
  }, [doctors, query]);

  const openProfile = (doctor: AppDoctor) => {
    setSelected(doctor);
    window.setTimeout(() => closeRef.current?.focus(), 0);
  };

  return (
    <div className="px-4 pb-8 pt-2">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">{c("Published experts", "已发布专家", "Опубликованные эксперты", "Expertos publicados")}</p>
        <h1 className="mt-2 font-display text-[2.45rem] leading-[.96]">{c("Compare the person, not just the procedure.", "不只看项目，更要了解专家。", "Сравнивайте специалистов.", "Compara al profesional, no solo el procedimiento.")}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{c("Review current published information, then ask your coordinator what still needs confirmation.", "查看已发布信息，再让协调员帮助确认尚待核实的内容。", "Изучите опубликованные данные и уточните остальное у координатора.", "Revisa la información publicada y confirma lo pendiente con tu coordinador.")}</p>
      </header>

      <label className="relative mt-5 block"><span className="sr-only">{c("Search experts", "搜索专家", "Поиск экспертов", "Buscar expertos")}</span><Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder={c("Name, specialty or city", "姓名、项目或城市", "Имя, специализация или город", "Nombre, especialidad o ciudad")} className="min-h-12 w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>

      <div className="mt-5 space-y-3" aria-live="polite">
        {loading && Array.from({ length: 3 }).map((_, index) => <div key={index} className="flex min-h-32 animate-pulse gap-3 rounded-[1.35rem] border border-border/60 bg-card p-3"><div className="w-24 rounded-2xl bg-muted" /><div className="flex-1 space-y-3 py-2"><div className="h-4 w-2/3 rounded bg-muted" /><div className="h-3 w-1/2 rounded bg-muted" /><div className="h-7 w-full rounded bg-muted" /></div></div>)}
        {error && <div role="alert" className="rounded-[1.35rem] border border-border bg-card p-5 text-center"><p className="text-sm text-muted-foreground">{c("Expert profiles could not be loaded.", "暂时无法加载专家资料。", "Не удалось загрузить профили.", "No se pudieron cargar los perfiles.")}</p><button type="button" onClick={retry} className="mt-3 min-h-11 rounded-full bg-foreground px-5 text-sm font-semibold text-background">{c("Try again", "重试", "Повторить", "Reintentar")}</button></div>}
        {!loading && !error && filtered.length === 0 && <div className="rounded-[1.35rem] border border-border bg-card p-6 text-center"><Stethoscope className="mx-auto size-6 text-primary" /><h2 className="mt-3 font-display text-2xl">{c("No matching profiles", "没有匹配的专家", "Нет совпадений", "Sin coincidencias")}</h2><p className="mt-2 text-sm text-muted-foreground">{c("Try a broader specialty or city.", "试试更宽泛的项目或城市。", "Попробуйте другой запрос.", "Prueba otra especialidad o ciudad.")}</p></div>}
        {filtered.map((doctor) => (
          <button key={doctor.id} type="button" onClick={() => openProfile(doctor)} className="flex min-h-36 w-full items-stretch gap-3 rounded-[1.35rem] border border-border/70 bg-card p-3 text-left active:scale-[.99]">
            <span className="relative w-[30%] shrink-0 overflow-hidden rounded-2xl bg-secondary">{doctor.photo ? <img src={doctor.photo} alt="" className="size-full object-cover" /> : <span className="grid size-full place-items-center font-display text-3xl">{doctor.name.slice(0, 1)}</span>}</span>
            <span className="flex min-w-0 flex-1 flex-col py-1"><span className="text-[9px] font-bold uppercase tracking-[.14em] text-primary">{c("Published profile", "已发布资料", "Профиль", "Perfil publicado")}</span><strong className="mt-1 font-display text-2xl leading-none">{doctor.name}</strong><span className="mt-1.5 text-xs text-muted-foreground">{doctor.title}</span><span className="mt-auto flex items-center gap-1 text-xs font-semibold"><MapPin className="size-3 text-primary" />{doctor.city}<ArrowRight className="ml-auto size-4 text-primary" /></span></span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[110] grid place-items-end bg-foreground/50 sm:place-items-center sm:p-4" onMouseDown={() => setSelected(null)} role="presentation">
          <section role="dialog" aria-modal="true" aria-labelledby="app-expert-name" className="max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-t-[2rem] bg-card p-5 shadow-pop sm:rounded-[2rem]" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[.14em] text-primary">{c("Published expert information", "已发布专家信息", "Данные специалиста", "Información publicada")}</span><button ref={closeRef} type="button" onClick={() => setSelected(null)} className="-mr-2 -mt-2 grid min-h-12 min-w-12 place-items-center rounded-full hover:bg-muted" aria-label={c("Close profile", "关闭资料", "Закрыть", "Cerrar perfil")}><X className="size-5" /></button></div>
            <div className="mt-2 flex items-center gap-4">{selected.photo ? <img src={selected.photo} alt="" className="size-20 rounded-2xl object-cover" /> : <span className="grid size-20 place-items-center rounded-2xl bg-secondary font-display text-3xl">{selected.name.slice(0, 1)}</span>}<div><h2 id="app-expert-name" className="font-display text-3xl">{selected.name}</h2><p className="mt-1 text-sm text-muted-foreground">{selected.title} · {selected.city}</p></div></div>
            <div className="mt-5 flex flex-wrap gap-2">{selected.specialties.map((specialty) => <span key={specialty} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold">{specialty}</span>)}</div>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">{selected.bio}</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background"><MessageCircle className="size-4" />{c("Ask a coordinator", "咨询协调员", "Связаться с координатором", "Consultar al coordinador")}</a>
            <p className="mt-3 text-center text-[10px] leading-4 text-muted-foreground">{c("Confirm current credentials and facility privileges directly before treatment.", "治疗前请直接确认当前资质及机构执业权限。", "Проверьте актуальные документы перед лечением.", "Confirma las credenciales vigentes antes del tratamiento.")}</p>
          </section>
        </div>
      )}
    </div>
  );
};

export default AppExperts;

import { ArrowRight, Building2, MapPin, PlayCircle, ShieldCheck, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import conciergeImage from "@/assets/journey-premium-concierge-v6.webp";
import { CITIES } from "@/data/cities";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";
import { useCarePlan } from "../CarePlanContext";

const FEATURED_CITIES = ["shanghai", "hangzhou", "hainan"];

const AppHome = () => {
  const { lang } = useAsia();
  const { plan, progress } = useCarePlan();
  const c = <T,>(en: T, zh: T, ru: T, es?: T) => asiaCopy(lang, { en, zh, ru, es });
  const cities = CITIES.filter((city) => FEATURED_CITIES.includes(city.slug));

  const explore = [
    { icon: Stethoscope, label: c("Experts", "专家", "Эксперты", "Expertos"), note: c("Published profiles", "已发布资料", "Профили", "Perfiles"), to: "/app/experts" },
    { icon: Building2, label: c("Clinics", "诊所", "Клиники", "Clínicas"), note: c("28 directory entries", "28 家机构", "28 учреждений", "28 centros"), to: "/app/clinics" },
    { icon: PlayCircle, label: c("Diaries", "日记", "Истории", "Diarios"), note: c("Recovery previews", "恢复记录", "Восстановление", "Recuperación"), to: "/app/diaries" },
  ];

  return (
    <div className="px-4 pb-8 pt-2">
      <section className="relative overflow-hidden rounded-[1.75rem] bg-foreground text-background shadow-[0_24px_60px_-30px_rgba(16,44,36,.8)]">
        <img src={conciergeImage} alt="" className="absolute inset-0 size-full object-cover opacity-45" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-foreground/50 to-foreground" />
        <div className="relative flex min-h-[375px] flex-col justify-between p-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/85">
            <span className="size-2 rounded-full bg-primary shadow-[0_0_0_5px_hsl(var(--primary)/.16)]" />
            {c("Private care coordination", "私人医美协调", "Персональная координация", "Coordinación privada")}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/65">{c("Your care, clearly planned", "让医美之旅清晰可控", "Ваш план лечения", "Tu atención, bien planificada")}</p>
            <h1 className="mt-3 max-w-[19rem] font-display text-[2.65rem] leading-[0.92] tracking-[-0.045em] text-white">
              {c("Choose with confidence.", "安心比较，", "Выбирайте уверенно.", "Elige con confianza.")}
              <em className="mt-1 block not-italic text-[hsl(155,62%,70%)]">{c("Travel with a plan.", "从容出发。", "Путешествуйте по плану.", "Viaja con un plan.")}</em>
            </h1>
            <Link to="/app/plan" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-foreground shadow-soft active:scale-[.98]">
              {c("Build my care plan", "创建我的行程", "Создать план", "Crear mi plan")} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-[1.5rem] border border-border/70 bg-card p-4" aria-label={c("Current care plan", "当前行程", "Текущий план", "Plan actual")}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">{c("My care journey", "我的医美行程", "Мой путь", "Mi recorrido")}</p>
            <h2 className="mt-1 font-display text-xl leading-tight min-[360px]:text-2xl">{plan.procedure} · {plan.destination}</h2>
          </div>
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold">{progress}%</span>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${Math.max(progress, 4)}%` }} /></div>
        <Link to="/app/plan" className="mt-3 flex min-h-11 items-center justify-between text-sm font-semibold">{c("Continue planning", "继续完善", "Продолжить", "Continuar")}<ArrowRight className="size-4 text-primary" /></Link>
      </section>

      <section className="mt-7">
        <div className="flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">{c("Explore", "探索", "Обзор", "Explorar")}</p><h2 className="mt-1 font-display text-3xl">{c("Start with what matters", "从你在意的开始", "Начните с главного", "Empieza por lo importante")}</h2></div></div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {explore.map(({ icon: Icon, label, note, to }) => (
            <Link key={to} to={to} className="flex min-h-32 flex-col justify-between rounded-[1.25rem] border border-border/70 bg-card p-3 active:scale-[.98]">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary"><Icon className="size-[18px]" /></span>
              <span><strong className="block text-sm">{label}</strong><span className="mt-1 block text-[10px] leading-4 text-muted-foreground">{note}</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-7">
        <div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">{c("China destinations", "中国目的地", "Направления в Китае", "Destinos en China")}</p><h2 className="mt-1 font-display text-3xl">{c("Where care meets comfort", "医美与舒适相遇", "Комфорт и забота", "Atención y comodidad")}</h2></div><Link to="/app/clinics" className="min-h-11 shrink-0 py-3 text-xs font-bold text-primary">{c("See all", "查看全部", "Все", "Ver todo")}</Link></div>
        <div className="-mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
          {cities.map((city) => (
            <Link key={city.slug} to={`/app/clinics?q=${city.en}`} className="relative min-h-48 w-[72%] shrink-0 snap-start overflow-hidden rounded-[1.5rem] text-white sm:w-[65%]">
              <img src={city.img} alt={city.en} className="absolute inset-0 size-full object-cover" />
              <span className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-4"><span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70"><MapPin className="size-3" />China</span><strong className="mt-1 block font-display text-2xl">{lang === "zh" ? city.zh : city.en}</strong><span className="mt-1 block text-xs text-white/75">{lang === "zh" ? city.taglineZh : city.taglineEn}</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 flex items-center gap-3 rounded-[1.4rem] bg-secondary p-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-card"><ShieldCheck className="size-5 text-primary" /></span>
        <p className="text-xs leading-5 text-muted-foreground"><strong className="block text-sm text-foreground">{c("Independent decisions, clearer support", "独立决策，更清晰的支持", "Независимый выбор", "Decisiones independientes")}</strong>{c("Medical decisions stay between you and the licensed provider.", "所有医疗决策由你与持证医疗机构共同作出。", "Медицинские решения принимаете вы и лицензированная клиника.", "Las decisiones médicas se toman entre tú y el centro autorizado.")}</p>
      </section>
    </div>
  );
};

export default AppHome;

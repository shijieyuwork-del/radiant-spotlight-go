import { useState } from "react";
import { Check, ChevronRight, Circle, FileText, MessageCircle, Plane, Share2, ShieldCheck, Stethoscope, UserRoundSearch } from "lucide-react";
import { CITIES } from "@/data/cities";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";
import { useCarePlan } from "../CarePlanContext";
import InstallAppButton from "../InstallAppButton";
import { shareCarePlan, tapFeedback } from "../native";

const PROCEDURES = ["Rhinoplasty", "Blepharoplasty", "Facelift", "Liposuction", "Breast augmentation", "Hair restoration", "Dental implants", "Skin treatment"];

const AppPlan = () => {
  const { lang } = useAsia();
  const { plan, progress, setDestination, setProcedure, toggleTask } = useCarePlan();
  const [shareUnavailable, setShareUnavailable] = useState(false);
  const c = <T,>(en: T, zh: T, ru: T, es?: T) => asiaCopy(lang, { en, zh, ru, es });

  const tasks = [
    { id: "goals", icon: Stethoscope, title: c("Describe your goals", "描述你的需求", "Опишите цели", "Describe tus objetivos"), note: c("What you want to change and what you want to keep natural.", "你想改善什么，以及希望保留哪些自然特点。", "Что вы хотите изменить и сохранить естественным.", "Qué quieres cambiar y qué deseas mantener natural.") },
    { id: "records", icon: FileText, title: c("Organize your records", "整理资料", "Соберите документы", "Organiza tus documentos"), note: c("Photos, prior procedures, medications and relevant history.", "照片、既往项目、用药及相关病史。", "Фото, прошлые процедуры, лекарства и история.", "Fotos, procedimientos previos, medicación e historial.") },
    { id: "shortlist", icon: UserRoundSearch, title: c("Build a shortlist", "建立候选清单", "Составьте список", "Crea una lista"), note: c("Compare published information before choosing who to contact.", "联系前先比较已发布的专家与机构信息。", "Сравните опубликованные данные специалистов.", "Compara la información publicada antes de contactar.") },
    { id: "consultation", icon: MessageCircle, title: c("Book a consultation", "预约咨询", "Запишитесь на консультацию", "Reserva una consulta"), note: c("Confirm candidacy, risks, recovery and the itemized quote.", "确认适应性、风险、恢复期和明细报价。", "Уточните показания, риски, восстановление и цену.", "Confirma idoneidad, riesgos, recuperación y presupuesto.") },
  ];

  const whatsapp = `https://wa.me/14708613825?text=${encodeURIComponent(`Hi CeladonChina, I am considering ${plan.procedure} in ${plan.destination}. I would like help reviewing my options.`)}`;

  const sharePlan = async () => {
    setShareUnavailable(false);
    await tapFeedback();
    try {
      const shared = await shareCarePlan(plan.procedure, plan.destination);
      setShareUnavailable(!shared);
    } catch {
      /* Closing the native share sheet is not an error for the user. */
    }
  };

  return (
    <div className="px-4 pb-8 pt-2">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">{c("My care journey", "我的医美行程", "Мой путь", "Mi recorrido")}</p>
        <h1 className="mt-2 font-display text-[2.45rem] leading-[.96]">{c("A calmer way to prepare.", "更从容地做好准备。", "Спокойная подготовка.", "Una forma más tranquila de prepararte.")}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{c("Keep your research and next steps together. Your checklist stays on this device.", "把资料和下一步集中管理；清单仅保存在当前设备。", "Исследования и шаги хранятся на этом устройстве.", "Guarda tu investigación y próximos pasos en este dispositivo.")}</p>
      </header>

      <section className="mt-5 overflow-hidden rounded-[1.6rem] bg-foreground p-5 text-background shadow-[0_24px_55px_-30px_rgba(16,44,36,.85)]">
        <div className="flex items-start justify-between gap-4"><div><p className="text-[9px] font-bold uppercase tracking-[.15em] text-white/55">{c("Planning progress", "准备进度", "Прогресс", "Progreso")}</p><p className="mt-1 font-display text-3xl text-white">{progress}% {c("ready", "已完成", "готово", "listo")}</p></div><span className="grid size-12 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10"><Plane className="size-5 text-primary" /></span></div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${Math.max(progress, 3)}%` }} /></div>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3" aria-label={c("Care plan choices", "行程选择", "Выбор плана", "Opciones del plan")}>
        <label className="rounded-[1.25rem] border border-border/70 bg-card p-3"><span className="text-[9px] font-bold uppercase tracking-[.13em] text-primary">{c("Procedure", "项目", "Процедура", "Procedimiento")}</span><select value={plan.procedure} onChange={(event) => setProcedure(event.target.value)} className="mt-2 min-h-12 w-full appearance-none bg-transparent pr-2 text-sm font-semibold outline-none">{PROCEDURES.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="rounded-[1.25rem] border border-border/70 bg-card p-3"><span className="text-[9px] font-bold uppercase tracking-[.13em] text-primary">{c("Destination", "目的地", "Город", "Destino")}</span><select value={plan.destination} onChange={(event) => setDestination(event.target.value)} className="mt-2 min-h-12 w-full appearance-none bg-transparent pr-2 text-sm font-semibold outline-none">{CITIES.map((city) => <option key={city.slug} value={city.en}>{lang === "zh" ? city.zh : city.en}</option>)}</select></label>
      </section>

      <section className="mt-7">
        <div className="flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-primary">{c("Preparation", "准备事项", "Подготовка", "Preparación")}</p><h2 className="mt-1 font-display text-3xl">{c("Your next best steps", "最重要的下一步", "Следующие шаги", "Tus próximos pasos")}</h2></div><span className="text-xs font-semibold text-muted-foreground">{Object.values(plan.tasks).filter(Boolean).length}/{tasks.length}</span></div>
        <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-border/70 bg-card">
          {tasks.map(({ id, icon: Icon, title, note }, index) => {
            const done = Boolean(plan.tasks[id]);
            return (
              <button key={id} type="button" onClick={() => toggleTask(id)} aria-pressed={done} className={`flex min-h-[6.5rem] w-full items-start gap-3 p-4 text-left ${index ? "border-t border-border/60" : ""}`}>
                <span className={`mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl ${done ? "bg-primary text-primary-foreground" : "bg-secondary"}`}><Icon className="size-[18px]" /></span>
                <span className="min-w-0 flex-1"><strong className={`block text-sm ${done ? "line-through opacity-60" : ""}`}>{title}</strong><span className="mt-1 block text-xs leading-5 text-muted-foreground">{note}</span></span>
                <span className="grid min-h-11 min-w-11 place-items-center" aria-hidden="true">{done ? <Check className="size-5 text-primary" /> : <Circle className="size-5 text-border" />}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-5 rounded-[1.5rem] bg-secondary p-4"><div className="flex gap-3"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" /><div><h2 className="text-sm font-semibold">{c("What to confirm before you decide", "决定前需要确认", "Что проверить", "Qué confirmar")}</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">{c("Current credentials, facility privileges, treatment responsibility, risks, recovery and the final itemized price.", "当前资质、机构权限、治疗责任、风险、恢复期和最终明细价格。", "Документы, права, ответственность, риски, восстановление и итоговую цену.", "Credenciales, privilegios, responsabilidad, riesgos, recuperación y precio final.")}</p></div></div></section>

      <a href={whatsapp} target="_blank" rel="noreferrer" className="mt-5 flex min-h-14 items-center justify-between rounded-full bg-foreground px-5 text-sm font-semibold text-background shadow-soft"><span className="flex items-center gap-2"><MessageCircle className="size-5 text-primary" />{c("Review my plan with a coordinator", "和协调员一起检查行程", "Обсудить план", "Revisar mi plan")}</span><ChevronRight className="size-4" /></a>
      <button type="button" onClick={sharePlan} className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-foreground/20 bg-card px-5 text-sm font-semibold text-foreground"><Share2 className="size-4 text-primary" />{c("Share my plan", "分享我的行程", "Поделиться планом", "Compartir mi plan")}</button>
      {shareUnavailable && <p role="status" className="mt-2 text-center text-xs text-muted-foreground">{c("Sharing is not available on this device.", "当前设备暂不支持分享。", "Функция недоступна на этом устройстве.", "Compartir no está disponible en este dispositivo.")}</p>}
      <InstallAppButton className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-foreground/20 bg-card px-5 text-sm font-semibold text-foreground" />
      <p className="mt-3 text-center text-[10px] leading-4 text-muted-foreground">{c("Information and coordination only — not medical advice.", "仅提供信息与协调服务，不构成医疗建议。", "Только информация и координация — не медицинская консультация.", "Solo información y coordinación; no es consejo médico.")} <a href="https://celadonchina.com/privacy" target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">{c("Privacy", "隐私", "Конфиденциальность", "Privacidad")}</a></p>
    </div>
  );
};

export default AppPlan;

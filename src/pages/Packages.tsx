import {
  ArrowRight,
  Building2,
  Check,
  ChevronRight,
  CircleDollarSign,
  Files,
  Headphones,
  HeartPulse,
  Hotel,
  Languages,
  Map,
  MapPin,
  MessageCircle,
  Plane,
  Route,
  ShieldCheck,
  Video,
  Wallet,
} from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";
import QuoteCtaButton, { QUOTE_WHATSAPP_URL } from "@/components/QuoteCtaButton";
import journeyConsultation from "@/assets/journey-premium-natural-consultation-v5.jpg";
import journeyArrival from "@/assets/journey-premium-natural-arrival-v5.jpg";
import journeyGroundSupport from "@/assets/journey-premium-natural-concierge-v5.jpg";
import journeyTreatment from "@/assets/journey-premium-clinic-v6.jpg";
import journeyRecovery from "@/assets/journey-premium-natural-recovery-v5.jpg";
import journeyFollowUp from "@/assets/journey-premium-natural-followup-v5.jpg";
import supportAirport from "@/assets/packages-bh-support-airport-v1.jpg";
import supportTranslation from "@/assets/packages-bh-support-translation-v1.jpg";
import supportAccommodation from "@/assets/packages-bh-support-accommodation-v1.jpg";
import supportRecords from "@/assets/packages-bh-support-records-v1.jpg";
import supportConcierge from "@/assets/packages-bh-support-concierge-v1.jpg";
import travelSupportCareTeam from "@/assets/travel-support-asian-care-team-v2.jpg";




const JOURNEY_STEPS = [
  {
    icon: Video,
    image: journeyConsultation,
    eyebrow: ["Getting started", "开始咨询", "Начало"],
    title: ["Get a free quote", "获取免费报价", "Получить бесплатную оценку"],
    text: [
      "Tell us your goals and questions so we can help identify suitable specialists.",
      "告诉我们你的目标和疑问，我们会协助匹配合适的专家。",
      "Расскажите о целях и вопросах, чтобы мы помогли подобрать специалистов.",
    ],
  },
  {
    icon: Plane,
    image: journeyArrival,
    eyebrow: ["Travel planning", "行程规划", "Планирование поездки"],
    title: ["Arrange your travel & visa", "安排行程与签证", "Организуйте поездку и визу"],
    text: [
      "Confirm appointments, flights, travel documents and arrival details.",
      "确认预约、航班、旅行文件和抵达信息。",
      "Подтвердите запись, перелёт, документы и детали прибытия.",
    ],
  },
  {
    icon: MapPin,
    image: journeyGroundSupport,
    eyebrow: ["On-ground support", "落地支持", "Поддержка на месте"],
    title: ["Choose your on-ground support", "选择落地支持服务", "Выберите поддержку на месте"],
    text: [
      "Select pickup, accommodation guidance, translation and coordination.",
      "按需选择接机、住宿建议、翻译与行程协调。",
      "Выберите трансфер, помощь с проживанием, перевод и координацию.",
    ],
  },
  {
    icon: HeartPulse,
    image: journeyTreatment,
    eyebrow: ["Treatment support", "治疗支持", "Поддержка лечения"],
    title: ["Receive coordinated treatment support", "获得治疗协调支持", "Получите поддержку во время лечения"],
    text: [
      "Get practical communication and scheduling help during clinic visits.",
      "就诊期间获得沟通、翻译与日程协调协助。",
      "Получайте помощь с общением и расписанием во время визитов.",
    ],
  },
  {
    icon: Map,
    image: journeyRecovery,
    eyebrow: ["Recovery", "恢复期", "Восстановление"],
    title: ["Recover—and explore when ready", "安心恢复，适合时再探索", "Восстанавливайтесь и путешествуйте, когда будете готовы"],
    text: [
      "Follow your expert’s advice, with optional travel when you are cleared.",
      "遵循专家的恢复建议，获得许可后可自愿安排旅行。",
      "Следуйте рекомендациям эксперта и путешествуйте только после разрешения.",
    ],
  },
  {
    icon: MessageCircle,
    image: journeyFollowUp,
    eyebrow: ["Follow-up", "后续随访", "Наблюдение"],
    title: ["Stay connected after you return", "回国后保持联系", "Оставайтесь на связи после возвращения"],
    text: [
      "Coordinate remote follow-up and translation when your expert recommends it.",
      "专家建议复诊时，我们协助协调远程随访与翻译。",
      "Мы поможем организовать онлайн-наблюдение и перевод по рекомендации эксперта.",
    ],
  },
] as const;

const SUPPORT_SERVICES = [
  {
    icon: Plane,
    image: supportAirport,
    title: ["Airport pickup & drop-off", "机场接送", "Трансфер из аэропорта"],
    text: [
      "Direct transfer between the airport and your confirmed hotel or clinic, coordinated around your arrival details.",
      "根据抵达信息，协调机场与已确认酒店或诊所之间的点对点接送。",
      "Прямой трансфер между аэропортом и подтверждённым отелем или клиникой с учётом деталей прибытия.",
    ],
  },
  {
    icon: Languages,
    image: supportTranslation,
    title: ["In-clinic translation", "院内翻译", "Перевод в клинике"],
    text: [
      "Bilingual communication support for questions, care instructions and practical next steps during included visits.",
      "在包含的诊所行程中，协助问题沟通、护理说明和实际后续安排。",
      "Двуязычная помощь при вопросах, инструкциях по уходу и дальнейших шагах во время включённых визитов.",
    ],
  },
  {
    icon: Hotel,
    image: supportAccommodation,
    title: ["Accommodation guidance", "住宿建议", "Помощь с проживанием"],
    text: [
      "Hotel options shortlisted around your clinic, dates, budget and recovery needs. Hotel charges are paid separately.",
      "根据诊所位置、日期、预算和恢复需求筛选酒店；住宿费用需另行支付。",
      "Подбор отелей рядом с клиникой с учётом дат, бюджета и восстановления. Проживание оплачивается отдельно.",
    ],
  },
  {
    icon: Files,
    image: supportRecords,
    title: ["Records organization", "病历整理", "Подготовка документов"],
    text: [
      "The records you provide are organized into a clearer review file; relevant information can be translated for care coordination.",
      "将你提供的病历整理成便于审核的文件，并可为就医协调翻译相关信息。",
      "Предоставленные документы систематизируются в понятный файл; важная информация может быть переведена для координации лечения.",
    ],
  },
  {
    icon: Headphones,
    image: supportConcierge,
    title: ["Online concierge support", "在线管家支持", "Онлайн-поддержка"],
    text: [
      "Message your coordinator for itinerary, booking and service questions during the confirmed support period.",
      "在已确认的支持时段内，可联系协调员咨询行程、预订和服务问题。",
      "Связывайтесь с координатором по вопросам маршрута, бронирования и услуг в подтверждённый период поддержки.",
    ],
  },
] as const;

const Packages = () => {
  const { lang } = useAsia();
  const c = <T,>(en: T, zh: T, ru: T) => asiaCopy(lang, { en, zh, ru });
  const pick = (values: readonly [string, string, string]) => c(values[0], values[1], values[2]);

  return (
    <>
      <PageMeta
        title="China Medical Travel Support | Cosmetics Asia"
        description="Plan cosmetic care in China with clear payment terms, airport pickup, in-clinic translation, accommodation guidance and coordinated follow-up."
        path="/travel-packages"
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />
        <main>
          <section className="relative overflow-hidden border-b border-primary/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,hsl(158_58%_88%/.85),transparent_34%),radial-gradient(circle_at_88%_18%,hsl(48_80%_89%/.8),transparent_32%),linear-gradient(135deg,hsl(45_30%_98%),hsl(150_28%_97%))]" />
            <div className="container relative grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.02fr_.98fr] lg:gap-14 lg:py-20">
              <div>
                <span className="pill bg-white/85 text-foreground shadow-soft backdrop-blur">
                  <ShieldCheck className="size-3.5 text-primary" />
                  {c("Complete care journey", "全程协调支持", "Полная координация")}
                </span>
                <h1 className="mt-5 max-w-2xl font-display text-4xl font-medium leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
                  {c("Seamless care", "中国就医，", "Лечение в Китае —")}
                  <br />
                  <em className="not-italic text-primary">
                    {c("in China", "全程协调无忧", "под ключ")}
                  </em>
                </h1>
                <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/70 sm:text-lg">
                  {c(
                    "Professional coordination for your medical trip, from arrival to recovery.",
                    "从抵达到恢复，专业团队全程协调你的就医行程。",
                    "Профессиональная координация поездки — от прибытия до восстановления."
                  )}
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <QuoteCtaButton className="min-h-14 sm:text-base" />
                  <a href="#journey" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-primary/25 bg-white/75 px-7 text-sm font-semibold text-foreground shadow-soft backdrop-blur transition hover:-translate-y-1 hover:border-primary sm:text-base">
                    {c("See how the journey works", "查看六步流程", "Посмотреть этапы")}
                    <ChevronRight className="size-4" />
                  </a>
                </div>

              </div>

              <div className="relative mx-auto w-full max-w-2xl pb-5 lg:max-w-none">
                <div className="overflow-hidden rounded-[2.25rem] border-4 border-white/80 bg-card shadow-pop">
                  <img src={travelSupportCareTeam} alt={c("Asian medical and guest-services care team", "亚洲医疗与服务协调团队", "Азиатская медицинская и сервисная команда")} className="aspect-[4/3] w-full object-cover" />
                </div>
                <div className="absolute -bottom-1 left-4 right-4 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-pop backdrop-blur-md sm:left-6 sm:right-auto sm:p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[.16em] text-foreground/40">{c("Coordinated support", "协调支持", "Координация")}</p>
                  <div className="mt-2 flex gap-2">
                    {[
                      [Plane, c("Pickup", "接送", "Трансфер")],
                      [Languages, c("Translate", "翻译", "Перевод")],
                      [MessageCircle, c("Follow-up", "随访", "Наблюдение")],
                    ].map(([Icon, label]) => {
                      const SupportIcon = Icon as typeof Plane;
                      return (
                        <span key={String(label)} className="flex min-w-14 flex-col items-center gap-1 rounded-xl bg-secondary/60 px-2 py-2 text-[9px] font-bold text-foreground/75">
                          <SupportIcon className="size-4 text-primary" />
                          {label as string}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="container py-8 md:py-10">
            <div className="flex flex-col gap-4 md:flex-row md:gap-6">
              <div className="flex flex-1 items-center gap-4 rounded-2xl border border-primary/10 bg-card p-5 shadow-soft">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><Wallet className="size-5" /></span>
                <div>
                  <h2 className="font-display text-sm font-semibold tracking-tight">{c("$400 coordination deposit", "400 美元协调押金", "Депозит $400")}</h2>
                  <p className="mt-1 text-xs uppercase tracking-tight text-foreground/50">{c("Reserves your date & support package", "保留预约与协调服务", "Бронирует дату и поддержку")}</p>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-4 rounded-2xl bg-foreground p-5 text-background shadow-soft">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary text-foreground"><Building2 className="size-5" /></span>
                <div>
                  <h2 className="font-display text-sm font-semibold tracking-tight">{c("Pay the clinic directly", "直接支付给诊所", "Оплата напрямую клинике")}</h2>
                  <p className="mt-1 text-xs uppercase tracking-tight text-background/50">{c("Medical fees go straight to the facility", "医疗费用由诊所直接收取", "Медицинские сборы — напрямую в клинику")}</p>
                </div>
              </div>
            </div>
          </section>

          <section id="journey" className="container scroll-mt-24 py-10 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <span className="pill bg-accent text-accent-foreground"><Route className="size-3.5" />{c("A clear path from home to follow-up", "从家中咨询到术后随访", "Понятный путь от дома до наблюдения")}</span>
              <h2 className="mt-4 font-display text-[2.25rem] font-medium leading-[1.06] tracking-tight sm:text-5xl md:text-6xl">
                {c("Six steps. ", "六个步骤，", "Шесть этапов. ")}<em className="not-italic text-primary">{c("No guessing what comes next.", "每一步都清楚。", "Вы всегда знаете, что дальше.")}</em>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-foreground/65 md:text-lg">{c("Each stage answers the question patients ask most: what happens next, who helps and what should I prepare?", "每个阶段都会回答患者最关心的问题：下一步是什么、谁来协助、需要准备什么？", "Каждый этап отвечает на главные вопросы: что дальше, кто поможет и что подготовить?")}</p>
            </div>

            <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 scrollbar-hide sm:-mx-6 sm:px-6 md:mx-0 md:mt-10 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
              {JOURNEY_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article key={step.eyebrow[0]} className={`group min-w-[84vw] snap-center overflow-hidden rounded-[1.5rem] border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-pop sm:min-w-[68vw] md:min-w-0 md:rounded-[1.75rem] ${index === 0 ? "border-primary/45 ring-4 ring-primary/5" : "border-border/70"}`}>
                    <div className="relative aspect-[16/9] overflow-hidden bg-muted md:aspect-[16/8]">
                      <img src={step.image} alt={pick(step.title)} loading={index === 0 ? "eager" : "lazy"} decoding="async" className="size-full object-cover transition duration-700 group-hover:scale-[1.035]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-foreground shadow-soft backdrop-blur">{c(`Step ${index + 1}`, `第 ${index + 1} 步`, `Этап ${index + 1}`)}</span>
                    </div>
                    <div className="p-4 sm:p-5 md:p-6">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-4" /></span>
                        <p className="text-[10px] font-bold uppercase tracking-[.15em] text-primary">{pick(step.eyebrow)}</p>
                      </div>
                      <h3 className="mt-3 font-display text-[1.35rem] font-semibold leading-tight tracking-tight sm:text-2xl md:mt-4">{pick(step.title)}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-foreground/65">{pick(step.text)}</p>
                      {index === 0 && (
                        <a href={QUOTE_WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
                          {c("Start here", "从这里开始", "Начать здесь")}<ArrowRight className="size-4" />
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section id="support" className="container scroll-mt-24 py-10 md:py-20">
            <div className="overflow-hidden rounded-[2.5rem] border border-primary/15 bg-gradient-to-br from-[hsl(158,58%,90%)] via-[hsl(145,48%,92%)] to-[hsl(50,80%,91%)] shadow-pop">
              <div className="grid gap-5 px-5 py-7 sm:px-9 sm:py-9 md:px-12 md:py-12 lg:grid-cols-[.85fr_1.15fr] lg:items-end lg:gap-8">
                <div>
                  <span className="pill bg-white/80 text-foreground shadow-soft"><ShieldCheck className="size-3.5 text-primary" />{c("Free coordination support", "免费协调支持", "Бесплатная координационная поддержка")}</span>
                  <h2 className="mt-4 font-display text-[2.2rem] font-medium leading-[1.08] tracking-tight sm:text-4xl md:text-5xl">{c("Practical details, handled with you.", "实际细节，有人和你一起处理。", "Практические детали решаются вместе с вами.")}</h2>
                </div>
                <p className="max-w-2xl text-base leading-relaxed text-foreground/65 md:text-lg">{c("Support is confirmed around your actual appointment and itinerary. Before you travel, you receive a clear summary of what is included, optional or paid separately.", "支持内容会根据实际预约和行程确认。出发前，你会收到清晰说明，了解哪些已包含、哪些可选、哪些需另行支付。", "Поддержка подтверждается с учётом вашей записи и маршрута. До поездки вы получите ясное описание включённых, дополнительных и отдельно оплачиваемых услуг.")}</p>
              </div>
              <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto bg-white/60 p-4 scrollbar-hide sm:p-6 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-6 lg:p-8">
                {SUPPORT_SERVICES.map((service, index) => {
                  const Icon = service.icon;
                  const wide = index < 2 ? "lg:col-span-3" : "lg:col-span-2";
                  return (
                    <article key={service.title[0]} className={`group min-w-[82vw] snap-center overflow-hidden rounded-3xl border border-white/90 bg-card shadow-soft sm:min-w-[68vw] md:min-w-0 ${wide}`}>
                      <div className="grid min-h-full md:grid-cols-[9rem_1fr] lg:grid-cols-[10rem_1fr]">
                        <div className="relative aspect-[16/9] overflow-hidden bg-muted md:aspect-auto md:min-h-full">
                          <img src={service.image} alt={pick(service.title)} loading={index < 2 ? "eager" : "lazy"} decoding="async" className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105" />
                          <span className="absolute left-3 top-3 grid size-9 place-items-center rounded-xl bg-white/90 text-primary shadow-soft backdrop-blur"><Icon className="size-4" /></span>
                        </div>
                        <div className="p-4 sm:p-5">
                          <h3 className="font-display text-[1.2rem] font-semibold leading-tight tracking-tight sm:text-xl">{pick(service.title)}</h3>
                          <p className="mt-3 text-sm leading-relaxed text-foreground/65">{pick(service.text)}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="container py-12 md:py-20">
            <div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:gap-14">
              <div>
                <span className="pill bg-accent text-accent-foreground"><CircleDollarSign className="size-3.5" />{c("Clarity before commitment", "确认前先讲清楚", "Ясность до обязательств")}</span>
                <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight md:text-5xl">{c("Know what is included and what is not.", "清楚知道哪些包含，哪些不包含。", "Знайте, что включено, а что нет.")}</h2>
                <p className="mt-4 text-base leading-relaxed text-foreground/65">{c("We confirm the scope in writing before travel so you can make decisions with fewer surprises.", "出发前，我们会以书面形式确认服务范围，帮助你减少意外情况。", "До поездки мы письменно подтверждаем объём услуг, чтобы уменьшить неожиданности.")}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-3xl border border-primary/20 bg-primary/[.06] p-6">
                  <p className="text-xs font-bold uppercase tracking-[.15em] text-primary">{c("Coordination support", "协调支持", "Координационная поддержка")}</p>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/75">
                    {[
                      c("Airport pickup coordination", "机场接送协调", "Организация трансфера"),
                      c("In-clinic translation for included visits", "包含行程中的院内翻译", "Перевод во время включённых визитов"),
                      c("Records organization and practical planning", "病历整理与实际行程规划", "Подготовка документов и планирование"),
                    ].map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{item}</li>)}
                  </ul>
                </article>
                <article className="rounded-3xl border border-amber-200/80 bg-amber-50/70 p-6">
                  <p className="text-xs font-bold uppercase tracking-[.15em] text-amber-800">{c("Paid separately", "需另行支付", "Оплачивается отдельно")}</p>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/75">
                    {[
                      c("All clinic and hospital medical fees", "全部诊所和医院医疗费用", "Все медицинские услуги клиники"),
                      c("Hotel charges unless specifically included", "未明确包含的酒店费用", "Проживание, если оно не включено"),
                      c("Optional touring and personal expenses", "自愿旅行及个人费用", "Дополнительные поездки и личные расходы"),
                    ].map((item) => <li key={item} className="flex gap-2"><ChevronRight className="mt-0.5 size-4 shrink-0 text-amber-700" />{item}</li>)}
                  </ul>
                </article>
              </div>
            </div>
          </section>

          <section className="container pb-16 pt-12 md:pb-24 md:pt-16">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-foreground px-6 py-10 text-background shadow-pop sm:px-9 md:px-12 md:py-14">
              <div className="absolute -right-24 -top-24 size-72 rounded-full bg-primary/25 blur-2xl" />
              <div className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-amber-200/10 blur-3xl" />
              <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                <div className="max-w-3xl">
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">{c("Start with one conversation", "从一次沟通开始", "Начните с одного разговора")}</p>
                  <h2 className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight md:text-6xl">{c("You do not need every answer before you begin.", "开始之前，你不需要先知道所有答案。", "Необязательно знать все ответы, чтобы начать.")}</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-background/65 sm:text-base">{c("Tell us what you are considering. We will help you turn your questions into a clear next step. It is free and carries no obligation.", "告诉我们你正在考虑什么。我们会帮你把疑问变成清晰的下一步，免费且无需承诺。", "Расскажите, что вы рассматриваете. Мы поможем превратить вопросы в понятный следующий шаг. Это бесплатно и без обязательств.")}</p>
                </div>
                <div className="w-full shrink-0 lg:w-auto">
                  <QuoteCtaButton variant="primary" className="min-h-14 w-full px-8 sm:text-base lg:w-auto" />
                  
                </div>
              </div>
            </div>
          </section>
        </main>
        <div className="pb-10">
          <MedicalDisclaimer variant="banner" />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Packages;

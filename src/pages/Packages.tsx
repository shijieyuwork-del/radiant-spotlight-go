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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";
import QuoteCtaButton, { QUOTE_WHATSAPP_URL } from "@/components/QuoteCtaButton";
import serviceAirportPickup from "@/assets/service-airport-pickup.jpg";
import serviceHotelBooking from "@/assets/service-hotel-booking.jpg";
import serviceClinicTranslation from "@/assets/service-clinic-translation.jpg";
import serviceMedicalRecords from "@/assets/service-medical-records.jpg";
import serviceOnlineConcierge from "@/assets/service-online-concierge.jpg";
import cityHangzhou from "@/assets/city-hangzhou.jpg";




const JOURNEY_STEPS = [
  {
    icon: Video,
    image: serviceMedicalRecords,
    eyebrow: ["Free consultation", "免费咨询", "Бесплатная консультация"],
    title: ["Tell us what you are considering", "告诉我们你正在考虑什么", "Расскажите, что вы рассматриваете"],
    text: [
      "Share the procedure, city, timing and questions you have. We help you organize the next steps and identify suitable specialists.",
      "告诉我们关注的项目、城市、时间和疑问。我们会协助梳理下一步，并匹配合适的专家。",
      "Расскажите о процедуре, городе, сроках и вопросах. Мы поможем определить следующие шаги и подходящих специалистов.",
    ],
  },
  {
    icon: Plane,
    image: serviceAirportPickup,
    eyebrow: ["Appointment & documents", "预约与文件", "Запись и документы"],
    title: ["Confirm your care and travel plan", "确认就医与出行计划", "Подтвердите план лечения и поездки"],
    text: [
      "Once your appointment is confirmed, we help organize arrival details, travel documents and any required medical invitation letter.",
      "预约确认后，我们协助整理抵达信息、旅行文件及需要的医疗邀请函。",
      "После подтверждения записи мы поможем подготовить детали прибытия, документы и медицинское приглашение при необходимости.",
    ],
  },
  {
    icon: Route,
    image: serviceHotelBooking,
    eyebrow: ["Before departure", "出发前", "До вылета"],
    title: ["Know the details before you fly", "出发前掌握所有细节", "Знайте все детали до вылета"],
    text: [
      "Receive your confirmed appointment, pickup details, accommodation guidance and a clear list of included and optional support.",
      "获得已确认的预约、接机信息、住宿建议，以及包含和可选服务的清晰说明。",
      "Получите подтверждение записи, детали трансфера, рекомендации по проживанию и ясный список включённых и дополнительных услуг.",
    ],
  },
  {
    icon: HeartPulse,
    image: serviceClinicTranslation,
    eyebrow: ["Clinic visits", "院内就诊", "Визиты в клинику"],
    title: ["Communicate with confidence", "更安心地完成院内沟通", "Общайтесь уверенно"],
    text: [
      "A bilingual coordinator supports practical communication and scheduling during included clinic visits. Medical decisions stay with your treating expert.",
      "在包含的诊所行程中，双语协调员协助实际沟通与安排；医疗决定由接诊专家负责。",
      "Двуязычный координатор помогает с общением и расписанием во время включённых визитов. Медицинские решения принимает лечащий эксперт.",
    ],
  },
  {
    icon: Map,
    image: cityHangzhou,
    eyebrow: ["Recovery", "恢复期", "Восстановление"],
    title: ["Recover first, explore when ready", "安心恢复，适合时再探索", "Сначала восстановитесь, затем путешествуйте"],
    text: [
      "Follow your expert’s recovery advice. If you are cleared to travel, we can help shape an optional itinerary around your needs.",
      "始终遵循专家的恢复建议；获得许可后，我们可按你的需求协助规划自愿行程。",
      "Следуйте рекомендациям эксперта. После разрешения на поездки мы можем помочь составить дополнительный маршрут.",
    ],
  },
  {
    icon: MessageCircle,
    image: serviceOnlineConcierge,
    eyebrow: ["After you return", "回国后", "После возвращения"],
    title: ["Stay connected after you go home", "回国后继续保持联系", "Оставайтесь на связи дома"],
    text: [
      "When your expert recommends follow-up, we help coordinate the remote appointment, communication and translation.",
      "专家建议复诊时，我们协助协调远程预约、沟通与翻译。",
      "Если эксперт рекомендует наблюдение, мы поможем организовать дистанционный приём, общение и перевод.",
    ],
  },
] as const;

const SUPPORT_SERVICES = [
  {
    icon: Plane,
    image: serviceAirportPickup,
    title: ["Airport pickup & drop-off", "机场接送", "Трансфер из аэропорта"],
    text: [
      "Direct transfer between the airport and your confirmed hotel or clinic, coordinated around your arrival details.",
      "根据抵达信息，协调机场与已确认酒店或诊所之间的点对点接送。",
      "Прямой трансфер между аэропортом и подтверждённым отелем или клиникой с учётом деталей прибытия.",
    ],
  },
  {
    icon: Languages,
    image: serviceClinicTranslation,
    title: ["In-clinic translation", "院内翻译", "Перевод в клинике"],
    text: [
      "Bilingual communication support for questions, care instructions and practical next steps during included visits.",
      "在包含的诊所行程中，协助问题沟通、护理说明和实际后续安排。",
      "Двуязычная помощь при вопросах, инструкциях по уходу и дальнейших шагах во время включённых визитов.",
    ],
  },
  {
    icon: Hotel,
    image: serviceHotelBooking,
    title: ["Accommodation guidance", "住宿建议", "Помощь с проживанием"],
    text: [
      "Hotel options shortlisted around your clinic, dates, budget and recovery needs. Hotel charges are paid separately.",
      "根据诊所位置、日期、预算和恢复需求筛选酒店；住宿费用需另行支付。",
      "Подбор отелей рядом с клиникой с учётом дат, бюджета и восстановления. Проживание оплачивается отдельно.",
    ],
  },
  {
    icon: Files,
    image: serviceMedicalRecords,
    title: ["Records organization", "病历整理", "Подготовка документов"],
    text: [
      "The records you provide are organized into a clearer review file; relevant information can be translated for care coordination.",
      "将你提供的病历整理成便于审核的文件，并可为就医协调翻译相关信息。",
      "Предоставленные документы систематизируются в понятный файл; важная информация может быть переведена для координации лечения.",
    ],
  },
  {
    icon: Headphones,
    image: serviceOnlineConcierge,
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

  const faqs = [
    {
      q: c("What does the $400 deposit cover?", "400 美元押金用于什么？", "Для чего нужен депозит $400?"),
      a: c(
        "It reserves your procedure appointment and lets us coordinate airport pickup and in-clinic translation. It remains valid for 12 months and is refunded when you pay the clinic for treatment.",
        "用于保留手术预约，并让我们协调机场接送和院内翻译。押金在 12 个月内有效，并在你向诊所支付治疗费用时退还。",
        "Он закрепляет время процедуры и позволяет организовать трансфер и перевод в клинике. Депозит действует 12 месяцев и возвращается после оплаты лечения в клинике."
      ),
    },
    {
      q: c("Who receives my medical payment?", "医疗费用支付给谁？", "Кому оплачиваются медицинские услуги?"),
      a: c(
        "All surgery, examination, anesthesia and other medical fees are charged directly by the clinic or hospital. Cosmetics Asia does not collect your medical payment.",
        "手术、检查、麻醉和其他医疗费用均由诊所或医院直接收取，Cosmetics Asia 不代收医疗费用。",
        "Операция, обследования, анестезия и другие медицинские услуги оплачиваются напрямую клинике или больнице."
      ),
    },
    {
      q: c("Is the consultation really free?", "咨询真的免费吗？", "Консультация действительно бесплатная?"),
      a: c(
        "Your initial conversation with our coordination team is free and carries no obligation. If a expert or hospital charges for a medical consultation, we confirm that cost before you book.",
        "与我们协调团队的首次沟通免费且无需承诺。如专家或医院收取医疗咨询费，我们会在预约前确认。",
        "Первичная беседа с нашей командой бесплатна и ни к чему не обязывает. Если эксперт или клиника взимает плату за медицинскую консультацию, мы сообщим об этом до записи."
      ),
    },
    {
      q: c("What if my travel date changes?", "如果行程日期改变怎么办？", "Что делать, если дата поездки изменится?"),
      a: c(
        "Tell your coordinator as early as possible. Your $400 deposit remains valid for 12 months, and we will help update eligible appointment and support arrangements.",
        "请尽早告知协调员。400 美元押金在 12 个月内有效，我们会协助更新符合条件的预约和支持安排。",
        "Сообщите координатору как можно раньше. Депозит $400 действует 12 месяцев, и мы поможем обновить доступные записи и услуги."
      ),
    },
  ];

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
                  {c("Clear support before, during and after your trip", "从出发前到回国后的清晰支持", "Понятная поддержка до, во время и после поездки")}
                </span>
                <h1 className="mt-5 max-w-3xl font-display text-[2.7rem] font-medium leading-[.98] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.6rem]">
                  {c("Your care in China, ", "你的中国就医之旅，", "Ваша поездка на лечение в Китай — ")}
                  <em className="not-italic text-primary">
                    {c("coordinated from first question to follow-up", "从第一次咨询到术后随访都有人协调", "с координацией от первого вопроса до наблюдения")}
                  </em>
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/70 sm:text-lg">
                  {c(
                    "Understand your options, reserve your appointment and get practical help with arrival, communication and follow-up—without guessing what happens next.",
                    "了解选择、保留预约，并获得抵达、沟通和随访方面的实际协助，无需猜测下一步会发生什么。",
                    "Разберитесь в вариантах, закрепите запись и получите практическую помощь с прибытием, общением и наблюдением — без неопределённости."
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
                  <img src={serviceClinicTranslation} alt={c("International patient receiving bilingual support in a clinic", "国际患者在诊所接受双语沟通协助", "Международный пациент получает языковую поддержку в клинике")} className="aspect-[4/3] w-full object-cover" />
                </div>
                <div className="absolute -bottom-1 left-4 right-4 rounded-3xl border border-white/80 bg-white/90 p-4 shadow-pop backdrop-blur-md sm:left-8 sm:right-auto sm:w-[22rem] sm:p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[.16em] text-primary">{c("Your coordinated support", "你的协调支持", "Ваша координационная поддержка")}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold text-foreground/75 sm:text-xs">
                    {[
                      [Plane, c("Airport pickup", "机场接送", "Трансфер")],
                      [Languages, c("Translation", "院内翻译", "Перевод")],
                      [MessageCircle, c("Follow-up", "随访协调", "Наблюдение")],
                    ].map(([Icon, label]) => {
                      const SupportIcon = Icon as typeof Plane;
                      return <span key={String(label)} className="flex flex-col items-center gap-1.5 rounded-2xl bg-secondary/60 px-2 py-3"><SupportIcon className="size-4 text-primary" />{label as string}</span>;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="container py-12 md:py-16">
            <div className="grid overflow-hidden rounded-[2rem] border border-primary/15 bg-card shadow-pop lg:grid-cols-2">
              <article className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft"><Wallet className="size-5" /></span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-primary">{c("Before departure", "出发前", "До вылета")}</p>
                    <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight">{c("$400 coordination deposit", "400 美元协调押金", "Координационный депозит $400")}</h2>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-foreground/70 sm:text-base">
                  {c(
                    "Reserves your procedure appointment and lets us coordinate airport pickup and in-clinic translation. It remains valid for 12 months and is refunded when you pay the clinic for treatment.",
                    "用于保留手术预约，并让我们协调机场接送和院内翻译。押金在 12 个月内有效，并在你向诊所支付治疗费用时退还。",
                    "Закрепляет время процедуры и позволяет организовать трансфер и перевод в клинике. Действует 12 месяцев и возвращается после оплаты лечения в клинике."
                  )}
                </p>
              </article>
              <article className="border-t border-primary/10 bg-gradient-to-br from-[hsl(158,58%,92%)] to-[hsl(50,80%,93%)] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                <div className="flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-foreground text-background shadow-soft"><Building2 className="size-5" /></span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-foreground/60">{c("Medical treatment", "医疗费用", "Медицинские услуги")}</p>
                    <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight">{c("Pay the clinic directly", "直接支付给诊所", "Оплачивайте напрямую клинике")}</h2>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-foreground/70 sm:text-base">
                  {c(
                    "Surgery, examination, anesthesia and other medical fees are charged by the treating clinic or hospital. Cosmetics Asia does not collect your medical payment.",
                    "手术、检查、麻醉和其他医疗费用由接诊诊所或医院直接收取，Cosmetics Asia 不代收医疗费用。",
                    "Операция, обследования, анестезия и другие медицинские услуги оплачиваются лечащей клинике или больнице напрямую."
                  )}
                </p>
              </article>
            </div>
          </section>

          <section id="journey" className="container scroll-mt-24 py-12 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <span className="pill bg-accent text-accent-foreground"><Route className="size-3.5" />{c("A clear path from home to follow-up", "从家中咨询到术后随访", "Понятный путь от дома до наблюдения")}</span>
              <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight md:text-6xl">
                {c("Six steps. ", "六个步骤，", "Шесть этапов. ")}<em className="not-italic text-primary">{c("No guessing what comes next.", "每一步都清楚。", "Вы всегда знаете, что дальше.")}</em>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-foreground/65 md:text-lg">{c("Each stage answers the question patients ask most: what happens next, who helps and what should I prepare?", "每个阶段都会回答患者最关心的问题：下一步是什么、谁来协助、需要准备什么？", "Каждый этап отвечает на главные вопросы: что дальше, кто поможет и что подготовить?")}</p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {JOURNEY_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article key={step.eyebrow[0]} className={`group overflow-hidden rounded-[1.75rem] border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-pop ${index === 0 ? "border-primary/45 ring-4 ring-primary/5" : "border-border/70"}`}>
                    <div className="relative aspect-[16/8] overflow-hidden bg-muted">
                      <img src={step.image} alt={pick(step.title)} loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-[1.035]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-foreground shadow-soft backdrop-blur">{c(`Step ${index + 1}`, `第 ${index + 1} 步`, `Этап ${index + 1}`)}</span>
                    </div>
                    <div className="p-5 sm:p-6">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-4" /></span>
                        <p className="text-[10px] font-bold uppercase tracking-[.15em] text-primary">{pick(step.eyebrow)}</p>
                      </div>
                      <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-tight">{pick(step.title)}</h3>
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

          <section id="support" className="container scroll-mt-24 py-12 md:py-20">
            <div className="overflow-hidden rounded-[2.5rem] border border-primary/15 bg-gradient-to-br from-[hsl(158,58%,90%)] via-[hsl(145,48%,92%)] to-[hsl(50,80%,91%)] shadow-pop">
              <div className="grid gap-8 px-6 py-9 sm:px-9 md:px-12 md:py-12 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
                <div>
                  <span className="pill bg-white/80 text-foreground shadow-soft"><ShieldCheck className="size-3.5 text-primary" />{c("Free coordination support", "免费协调支持", "Бесплатная координационная поддержка")}</span>
                  <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight md:text-5xl">{c("The practical details are handled with you—not left to you.", "实际细节有人和你一起处理，而不是让你独自面对。", "Практические детали решаются вместе с вами — не остаются только на вас.")}</h2>
                </div>
                <p className="max-w-2xl text-base leading-relaxed text-foreground/65 md:text-lg">{c("Support is confirmed around your actual appointment and itinerary. Before you travel, you receive a clear summary of what is included, optional or paid separately.", "支持内容会根据实际预约和行程确认。出发前，你会收到清晰说明，了解哪些已包含、哪些可选、哪些需另行支付。", "Поддержка подтверждается с учётом вашей записи и маршрута. До поездки вы получите ясное описание включённых, дополнительных и отдельно оплачиваемых услуг.")}</p>
              </div>
              <div className="grid gap-4 bg-white/60 p-4 sm:p-6 md:grid-cols-2 lg:grid-cols-6 lg:p-8">
                {SUPPORT_SERVICES.map((service, index) => {
                  const Icon = service.icon;
                  const wide = index < 2 ? "lg:col-span-3" : "lg:col-span-2";
                  return (
                    <article key={service.title[0]} className={`group overflow-hidden rounded-3xl border border-white/90 bg-card shadow-soft ${wide}`}>
                      <div className="grid min-h-full sm:grid-cols-[10rem_1fr]">
                        <div className="relative min-h-40 overflow-hidden bg-muted sm:min-h-full">
                          <img src={service.image} alt={pick(service.title)} loading="lazy" className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105" />
                          <span className="absolute left-3 top-3 grid size-9 place-items-center rounded-xl bg-white/90 text-primary shadow-soft backdrop-blur"><Icon className="size-4" /></span>
                        </div>
                        <div className="p-5">
                          <h3 className="font-display text-xl font-semibold leading-tight tracking-tight">{pick(service.title)}</h3>
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
                <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight md:text-5xl">{c("Know what is included—and what is not.", "清楚知道哪些包含，哪些不包含。", "Знайте, что включено, а что нет.")}</h2>
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

          <section className="container py-12 md:py-20">
            <div className="rounded-[2.25rem] border border-primary/15 bg-card p-6 shadow-soft sm:p-8 md:p-10">
              <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-14">
                <div>
                  <span className="pill bg-accent text-accent-foreground"><MessageCircle className="size-3.5" />{c("Questions patients ask first", "患者最先问的问题", "Первые вопросы пациентов")}</span>
                  <h2 className="mt-4 font-display text-4xl font-medium tracking-tight md:text-5xl">{c("Clear answers before you decide.", "决定前，先获得清晰答案。", "Ясные ответы до решения.")}</h2>
                </div>
                <Accordion type="single" collapsible className="overflow-hidden rounded-2xl border border-border/70 bg-background/70 px-4 sm:px-5">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={faq.q} value={`faq-${index}`} className="border-border/70">
                      <AccordionTrigger className="gap-4 py-5 text-left text-sm font-semibold hover:no-underline sm:text-base">
                        <span className="flex items-start gap-3"><span className="mt-0.5 font-mono text-[10px] text-primary">0{index + 1}</span>{faq.q}</span>
                      </AccordionTrigger>
                      <AccordionContent className="pl-8 pr-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">{faq.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
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
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-background/65 sm:text-base">{c("Tell us what you are considering. We will help you turn questions into a clear next step—free and with no obligation.", "告诉我们你正在考虑什么。我们会帮你把疑问变成清晰的下一步，免费且无需承诺。", "Расскажите, что вы рассматриваете. Мы поможем превратить вопросы в понятный следующий шаг — бесплатно и без обязательств.")}</p>
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

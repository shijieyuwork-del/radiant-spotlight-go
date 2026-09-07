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
import journeyConsultation from "@/assets/journey-premium-natural-consultation-v5.webp";
import journeyArrival from "@/assets/journey-premium-natural-arrival-v5.webp";
import journeyGroundSupport from "@/assets/journey-premium-natural-concierge-v5.webp";
import journeyTreatment from "@/assets/journey-premium-clinic-v6.webp";
import journeyRecovery from "@/assets/journey-premium-natural-recovery-v5.webp";
import journeyFollowUp from "@/assets/journey-premium-natural-followup-v5.webp";




const JOURNEY_STEPS = [
  {
    icon: Video,
    image: journeyConsultation,
    eyebrow: ["Getting started", "开始咨询", "Начало", "Primeros pasos"],
    title: ["Get a free quote", "获取免费报价", "Получить бесплатную оценку", "Solicita un presupuesto gratis"],
    text: [
      "Tell us your goals and questions so we can help identify suitable specialists.",
      "告诉我们你的目标和疑问，我们会协助匹配合适的专家。",
      "Расскажите о целях и вопросах, чтобы мы помогли подобрать специалистов.",
      "Cuéntanos tus objetivos y dudas para ayudarte a identificar a los expertos adecuados.",
    ],
  },
  {
    icon: Plane,
    image: journeyArrival,
    eyebrow: ["Travel planning", "行程规划", "Планирование поездки", "Planificación del viaje"],
    title: ["Arrange your travel & visa", "安排行程与签证", "Организуйте поездку и визу", "Organiza tu viaje y visado"],
    text: [
      "Confirm appointments, flights, travel documents and arrival details.",
      "确认预约、航班、旅行文件和抵达信息。",
      "Подтвердите запись, перелёт, документы и детали прибытия.",
      "Confirma citas, vuelos, documentos de viaje y detalles de llegada.",
    ],
  },
  {
    icon: MapPin,
    image: journeyGroundSupport,
    eyebrow: ["On-ground support", "落地支持", "Поддержка на месте", "Apoyo en destino"],
    title: ["Choose your on-ground support", "选择落地支持服务", "Выберите поддержку на месте", "Elige tu apoyo en destino"],
    text: [
      "Select pickup, accommodation guidance, translation and coordination.",
      "按需选择接机、住宿建议、翻译与行程协调。",
      "Выберите трансфер, помощь с проживанием, перевод и координацию.",
      "Elige recogida, orientación de alojamiento, traducción y coordinación.",
    ],
  },
  {
    icon: HeartPulse,
    image: journeyTreatment,
    eyebrow: ["Treatment support", "治疗支持", "Поддержка лечения", "Apoyo durante el tratamiento"],
    title: ["Receive coordinated treatment support", "获得治疗协调支持", "Получите поддержку во время лечения", "Recibe apoyo coordinado durante el tratamiento"],
    text: [
      "Get practical communication and scheduling help during clinic visits.",
      "就诊期间获得沟通、翻译与日程协调协助。",
      "Получайте помощь с общением и расписанием во время визитов.",
      "Recibe ayuda práctica de comunicación y agenda durante las visitas a la clínica.",
    ],
  },
  {
    icon: Map,
    image: journeyRecovery,
    eyebrow: ["Recovery", "恢复期", "Восстановление", "Recuperación"],
    title: ["Recover—and explore when ready", "安心恢复，适合时再探索", "Восстанавливайтесь и путешествуйте, когда будете готовы", "Recupérate y explora cuando estés listo"],
    text: [
      "Follow your expert’s advice, with optional travel when you are cleared.",
      "遵循专家的恢复建议，获得许可后可自愿安排旅行。",
      "Следуйте рекомендациям эксперта и путешествуйте только после разрешения.",
      "Sigue el consejo de tu experto, con viajes opcionales cuando recibas el visto bueno.",
    ],
  },
  {
    icon: MessageCircle,
    image: journeyFollowUp,
    eyebrow: ["Follow-up", "后续随访", "Наблюдение", "Seguimiento"],
    title: ["Stay connected after you return", "回国后保持联系", "Оставайтесь на связи после возвращения", "Mantente en contacto tras tu regreso"],
    text: [
      "Coordinate remote follow-up and translation when your expert recommends it.",
      "专家建议复诊时，我们协助协调远程随访与翻译。",
      "Мы поможем организовать онлайн-наблюдение и перевод по рекомендации эксперта.",
      "Coordinamos el seguimiento remoto y la traducción cuando tu experto lo recomiende.",
    ],
  },
] as const;

const SUPPORT_SERVICES = [
  {
    icon: Plane,
    title: ["Airport pickup & drop-off", "机场接送", "Трансфер из аэропорта", "Recogida y traslado al aeropuerto"],
    text: [
      "Direct transfer between the airport and your confirmed hotel or clinic, coordinated around your arrival details.",
      "根据抵达信息，协调机场与已确认酒店或诊所之间的点对点接送。",
      "Прямой трансфер между аэропортом и подтверждённым отелем или клиникой с учётом деталей прибытия.",
      "Traslado directo entre el aeropuerto y tu hotel o clínica confirmados, coordinado según tus datos de llegada.",
    ],
  },
  {
    icon: Languages,
    title: ["In-clinic translation", "院内翻译", "Перевод в клинике", "Traducción en la clínica"],
    text: [
      "Bilingual communication support for questions, care instructions and practical next steps during included visits.",
      "在包含的诊所行程中，协助问题沟通、护理说明和实际后续安排。",
      "Двуязычная помощь при вопросах, инструкциях по уходу и дальнейших шагах во время включённых визитов.",
      "Apoyo de comunicación bilingüe para preguntas, instrucciones de cuidado y próximos pasos durante las visitas incluidas.",
    ],
  },
  {
    icon: Hotel,
    title: ["Accommodation guidance", "住宿建议", "Помощь с проживанием", "Orientación de alojamiento"],
    text: [
      "Hotel options shortlisted around your clinic, dates, budget and recovery needs. Hotel charges are paid separately.",
      "根据诊所位置、日期、预算和恢复需求筛选酒店；住宿费用需另行支付。",
      "Подбор отелей рядом с клиникой с учётом дат, бюджета и восстановления. Проживание оплачивается отдельно.",
      "Opciones de hotel preseleccionadas según tu clínica, fechas, presupuesto y necesidades de recuperación. Los gastos de hotel se pagan por separado.",
    ],
  },
  {
    icon: Files,
    title: ["Records organization", "病历整理", "Подготовка документов", "Organización de historial médico"],
    text: [
      "The records you provide are organized into a clearer review file; relevant information can be translated for care coordination.",
      "将你提供的病历整理成便于审核的文件，并可为就医协调翻译相关信息。",
      "Предоставленные документы систематизируются в понятный файл; важная информация может быть переведена для координации лечения.",
      "Los documentos que proporcionas se organizan en un expediente más claro; la información relevante puede traducirse para coordinar la atención.",
    ],
  },
  {
    icon: Headphones,
    title: ["Online concierge support", "在线管家支持", "Онлайн-поддержка", "Asistencia de conserjería en línea"],
    text: [
      "Message your coordinator for itinerary, booking and service questions during the confirmed support period.",
      "在已确认的支持时段内，可联系协调员咨询行程、预订和服务问题。",
      "Связывайтесь с координатором по вопросам маршрута, бронирования и услуг в подтверждённый период поддержки.",
      "Escribe a tu coordinador por dudas de itinerario, reservas y servicios durante el periodo de apoyo confirmado.",
    ],
  },
] as const;

const HOTEL_TIERS = [
  {
    icon: Wallet,
    tier: ["Budget", "经济型", "Эконом", "Económico"],
    range: "$40 – $80",
    examples: [
      "Clean 3-star hotels and serviced apartments near metro lines.",
      "干净的三星级酒店和服务式公寓，通常靠近地铁。",
      "Чистые отели 3* и апартаменты с обслуживанием рядом с метро.",
      "Hoteles limpios de 3 estrellas y apartamentos con servicios cerca de líneas de metro.",
    ],
    note: [
      "Good for shorter stays and tighter budgets.",
      "适合预算有限或停留时间较短的行程。",
      "Подходит для коротких поездок и ограниченного бюджета.",
      "Ideal para estancias cortas y presupuestos ajustados.",
    ],
  },
  {
    icon: Building2,
    tier: ["Mid-range", "舒适型", "Средний класс", "Gama media"],
    range: "$80 – $180",
    examples: [
      "International 4-star hotels close to major clinic areas.",
      "靠近主要诊疗区域的国际四星级酒店。",
      "Международные отели 4* рядом с основными клиниками.",
      "Hoteles internacionales de 4 estrellas cerca de las principales zonas de clínicas.",
    ],
    note: [
      "The most common choice for recovery stays.",
      "最常见的术后恢复住宿选择。",
      "Самый частый выбор для периода восстановления.",
      "La opción más común para estancias de recuperación.",
    ],
  },
  {
    icon: Hotel,
    tier: ["Premium", "高档型", "Премиум", "Premium"],
    range: "$180 – $400+",
    examples: [
      "5-star hotels with quiet rooms, room service and space to rest.",
      "五星级酒店，安静客房、客房服务与充足休息空间。",
      "Отели 5* с тихими номерами, обслуживанием и пространством для отдыха.",
      "Hoteles de 5 estrellas con habitaciones tranquilas, servicio de habitaciones y espacio para descansar.",
    ],
    note: [
      "Suited to longer recovery or added privacy.",
      "适合较长恢复期或需要更多私密性的行程。",
      "Подходит для длительного восстановления и большей приватности.",
      "Adecuado para recuperaciones más largas o mayor privacidad.",
    ],
  },
] as const;

const Packages = () => {
  const { lang } = useAsia();
  const c = <T,>(en: T, zh: T, ru: T, es?: T) => asiaCopy(lang, { en, zh, ru, es });
  const pick = (values: readonly [string, string, string, string?]) => c(values[0], values[1], values[2], values[3]);

  return (
    <>
      <PageMeta
        title="China Medical Travel Support | CeladonChina"
        description="Plan cosmetic care in China with clear payment terms, airport pickup, in-clinic translation, accommodation guidance and coordinated follow-up."
        path="/travel-packages"
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />
        <main>
          <section id="journey" className="container scroll-mt-24 py-10 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <span className="pill bg-accent text-accent-foreground"><Route className="size-3.5" />{c("A clear path from home to follow-up", "从家中咨询到术后随访", "Понятный путь от дома до наблюдения", "Un camino claro desde casa hasta el seguimiento")}</span>
              <h2 className="mt-4 font-display text-[2.25rem] font-medium leading-[1.06] tracking-tight sm:text-5xl md:text-6xl">
                {c("Six steps. ", "六个步骤，", "Шесть этапов. ", "Seis pasos. ")}<em className="not-italic text-primary">{c("No guessing what comes next.", "每一步都清楚。", "Вы всегда знаете, что дальше.", "Sin dudas sobre qué sigue.")}</em>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-foreground/65 md:text-lg">{c("Each stage answers the question patients ask most: what happens next, who helps and what should I prepare?", "每个阶段都会回答患者最关心的问题：下一步是什么、谁来协助、需要准备什么？", "Каждый этап отвечает на главные вопросы: что дальше, кто поможет и что подготовить?", "Cada etapa responde a la pregunta que más hacen los pacientes: ¿qué sigue, quién ayuda y qué debo preparar?")}</p>
            </div>

            <div className="mt-8 flex flex-col gap-4 md:flex-row md:gap-6">
              <div className="flex flex-1 items-center gap-4 rounded-2xl border border-primary/15 bg-gradient-to-r from-[hsl(156_58%_93%)] to-[hsl(146_48%_86%)] p-5 text-foreground shadow-soft">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/65 text-primary"><Wallet className="size-5" /></span>
                <div>
                  <h3 className="font-display text-sm font-semibold tracking-tight">{c("$200 coordination deposit", "200 美元协调押金", "Депозит $200", "Depósito de coordinación de 200 $")}</h3>
                  <p className="mt-1 text-xs uppercase tracking-tight text-foreground/55">{c("Reserves your date & support package", "保留预约与协调服务", "Бронирует дату и поддержку", "Reserva tu fecha y paquete de apoyo")}</p>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-4 rounded-2xl border border-primary/15 bg-gradient-to-r from-[hsl(156_58%_93%)] to-[hsl(146_48%_86%)] p-5 text-foreground shadow-soft">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/65 text-primary"><Building2 className="size-5" /></span>
                <div>
                  <h3 className="font-display text-sm font-semibold tracking-tight">{c("Pay the clinic directly", "直接支付给诊所", "Оплата напрямую клинике", "Paga directamente a la clínica")}</h3>
                  <p className="mt-1 text-xs uppercase tracking-tight text-foreground/55">{c("Medical fees go straight to the facility", "医疗费用由诊所直接收取", "Медицинские сборы — напрямую в клинику", "Los honorarios médicos van directamente al centro")}</p>
                </div>
              </div>
            </div>

            <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 scrollbar-hide sm:-mx-6 sm:px-6 md:mx-0 md:mt-10 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
              {JOURNEY_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article key={step.eyebrow[0]} className={`group min-w-[84vw] snap-center overflow-hidden rounded-[1.5rem] border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-pop sm:min-w-[68vw] md:min-w-0 md:rounded-[1.75rem] ${index === 0 ? "border-primary/45 ring-4 ring-primary/5" : "border-border/70"}`}>
                    <div className="relative aspect-[16/9] overflow-hidden bg-muted md:aspect-[16/8]">
                      <img src={step.image} alt={pick(step.title)} loading={index === 0 ? "eager" : "lazy"} decoding="async" className="size-full object-cover transition duration-700 group-hover:scale-[1.035]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-foreground shadow-soft backdrop-blur">{c(`Step ${index + 1}`, `第 ${index + 1} 步`, `Этап ${index + 1}`, `Paso ${index + 1}`)}</span>
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
                          {c("Start here", "从这里开始", "Начать здесь", "Empieza aquí")}<ArrowRight className="size-4" />
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
                  <span className="pill bg-white/80 text-foreground shadow-soft"><ShieldCheck className="size-3.5 text-primary" />{c("Free coordination support", "免费协调支持", "Бесплатная координационная поддержка", "Apoyo de coordinación gratuito")}</span>
                  <h2 className="mt-4 font-display text-[2.2rem] font-medium leading-[1.08] tracking-tight sm:text-4xl md:text-5xl">{c("What services does Celadon provide for free?", "Celadon 免费提供哪些服务？", "Какие услуги Celadon предоставляет бесплатно?", "¿Qué servicios ofrece Celadon gratis?")}</h2>
                </div>
                <p className="max-w-2xl text-base leading-relaxed text-foreground/65 md:text-lg">{c("Support is confirmed around your actual appointment and itinerary. Before you travel, you receive a clear summary of what is included, optional or paid separately.", "支持内容会根据实际预约和行程确认。出发前，你会收到清晰说明，了解哪些已包含、哪些可选、哪些需另行支付。", "Поддержка подтверждается с учётом вашей записи и маршрута. До поездки вы получите ясное описание включённых, дополнительных и отдельно оплачиваемых услуг.", "El apoyo se confirma según tu cita e itinerario reales. Antes de viajar, recibirás un resumen claro de lo incluido, lo opcional y lo que se paga aparte.")}</p>
              </div>
              <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto bg-white/60 p-4 scrollbar-hide sm:p-6 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-6 lg:p-8">
                {SUPPORT_SERVICES.map((service, index) => {
                  const Icon = service.icon;
                  const wide = index < 2 ? "lg:col-span-3" : "lg:col-span-2";
                  return (
                    <article key={service.title[0]} className={`group min-w-[82vw] snap-center rounded-3xl border border-white/90 bg-card p-5 shadow-soft sm:min-w-[68vw] sm:p-6 md:min-w-0 ${wide}`}>
                      <span className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-4" /></span>
                      <h3 className="mt-5 font-display text-[1.2rem] font-semibold leading-tight tracking-tight sm:text-xl">{pick(service.title)}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-foreground/65">{pick(service.text)}</p>
                    </article>
                  );
                 })}
              </div>

              {/* Hotel price tiers */}
              <div className="border-t border-white/70 bg-white/45 px-5 py-7 sm:px-9 md:px-12 md:py-10">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <span className="pill bg-white/80 text-foreground shadow-soft"><Hotel className="size-3.5 text-primary" />{c("Hotel price guide", "酒店价格分区", "Ценовые категории отелей", "Guía de precios de hoteles")}</span>
                    <h3 className="mt-3 font-display text-2xl font-medium tracking-tight sm:text-3xl">{c("Pick a hotel tier that fits your trip.", "按预算选择住宿档次。", "Выберите категорию отеля под ваш бюджет.", "Elige la categoría de hotel que se ajuste a tu viaje.")}</h3>
                  </div>
                  <p className="max-w-md text-sm leading-relaxed text-foreground/60">{c("Typical nightly rates in major cities, shown in USD as a planning reference. Final prices vary by city, season and room type; hotel charges are paid separately to the hotel.", "以下为主要城市的每晚参考价格（美元）。实际价格因城市、季节和房型而异；酒店费用另行支付给酒店。", "Ориентировочные цены за ночь в крупных городах (в USD). Итоговая стоимость зависит от города, сезона и типа номера; проживание оплачивается отдельно отелю.", "Tarifas nocturnas habituales en las principales ciudades, en USD como referencia de planificación. Los precios finales varían según ciudad, temporada y tipo de habitación; los gastos de hotel se pagan por separado.")}</p>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {HOTEL_TIERS.map((tier) => {
                    const TierIcon = tier.icon;
                    return (
                      <article key={tier.tier[0]} className="rounded-3xl border border-white/90 bg-card p-5 shadow-soft sm:p-6">
                        <div className="flex items-center justify-between gap-3">
                          <span className="grid size-10 place-items-center rounded-2xl bg-primary-soft text-primary" style={{ background: "hsl(var(--primary-soft))" }}><TierIcon className="size-4" /></span>
                          <span className="font-display text-lg font-semibold text-primary">{tier.range}<span className="text-xs font-medium text-muted-foreground"> /{c("night", "晚", "ночь", "noche")}</span></span>
                        </div>
                        <h4 className="mt-4 font-display text-lg font-semibold tracking-tight">{pick(tier.tier)}</h4>
                        <p className="mt-2 text-sm leading-relaxed text-foreground/65">{pick(tier.examples)}</p>
                        <p className="mt-3 flex gap-2 text-xs leading-relaxed text-muted-foreground"><Check className="mt-0.5 size-3.5 shrink-0 text-primary" />{pick(tier.note)}</p>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="container py-12 md:py-20">
            <div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:gap-14">
              <div>
                <span className="pill bg-accent text-accent-foreground"><CircleDollarSign className="size-3.5" />{c("Clarity before commitment", "确认前先讲清楚", "Ясность до обязательств", "Claridad antes de comprometerte")}</span>
                <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight md:text-5xl">{c("Know what is included and what is not.", "清楚知道哪些包含，哪些不包含。", "Знайте, что включено, а что нет.", "Sabe qué está incluido y qué no.")}</h2>
                <p className="mt-4 text-base leading-relaxed text-foreground/65">{c("We confirm the scope in writing before travel so you can make decisions with fewer surprises.", "出发前，我们会以书面形式确认服务范围，帮助你减少意外情况。", "До поездки мы письменно подтверждаем объём услуг, чтобы уменьшить неожиданности.", "Confirmamos el alcance por escrito antes de viajar para que puedas decidir con menos sorpresas.")}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-3xl border border-primary/20 bg-primary/[.06] p-6">
                  <p className="text-xs font-bold uppercase tracking-[.15em] text-primary">{c("Coordination support", "协调支持", "Координационная поддержка", "Apoyo de coordinación")}</p>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/75">
                    {[
                      c("Airport pickup coordination", "机场接送协调", "Организация трансфера", "Coordinación de recogida en el aeropuerto"),
                      c("In-clinic translation for included visits", "包含行程中的院内翻译", "Перевод во время включённых визитов", "Traducción en clínica durante las visitas incluidas"),
                      c("Records organization and practical planning", "病历整理与实际行程规划", "Подготовка документов и планирование", "Organización de historial médico y planificación práctica"),
                    ].map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{item}</li>)}
                  </ul>
                </article>
                <article className="rounded-3xl border border-amber-200/80 bg-amber-50/70 p-6">
                  <p className="text-xs font-bold uppercase tracking-[.15em] text-amber-800">{c("Paid separately", "需另行支付", "Оплачивается отдельно", "Se paga por separado")}</p>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/75">
                    {[
                      c("All clinic and hospital medical fees", "全部诊所和医院医疗费用", "Все медицинские услуги клиники", "Todos los honorarios médicos de clínicas y hospitales"),
                      c("Hotel charges unless specifically included", "未明确包含的酒店费用", "Проживание, если оно не включено", "Gastos de hotel salvo que estén específicamente incluidos"),
                      c("Optional touring and personal expenses", "自愿旅行及个人费用", "Дополнительные поездки и личные расходы", "Excursiones opcionales y gastos personales"),
                    ].map((item) => <li key={item} className="flex gap-2"><ChevronRight className="mt-0.5 size-4 shrink-0 text-amber-700" />{item}</li>)}
                  </ul>
                </article>
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

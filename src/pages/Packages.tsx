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
    title: ["Start a consultation", "开始咨询", "Начать консультацию", "Solicita una consulta"],
    text: [
      "Connect with us by message or video call. We’ll walk you through every detail, answer your questions and help you plan your next step. We’ll also help book your in-person consultation and surgery.",
      "通过文字或视频与我们线上沟通。我们为你讲解每个细节、解答疑问，陪你规划下一步，并协助预约面诊和手术。",
      "Расскажите о целях и вопросах, чтобы мы помогли подобрать специалистов.",
      "Cuéntanos tus objetivos y dudas para ayudarte a identificar a los expertos adecuados.",
    ],
  },
  {
    icon: Plane,
    image: journeyArrival,
    eyebrow: ["Travel planning", "行程规划", "Планирование поездки", "Planificación del viaje"],
    title: ["Your China journey is taking shape", "你的中国之旅，即将启程", "Организуйте поездку и визу", "Organiza tu viaje y visado"],
    text: [
      "From appointments to arrival, we help you put the details in place. Get ready with your flights, visa and travel documents, knowing what comes next.",
      "从预约到抵达，我们陪你理清每个细节。准备好航班、签证与旅行文件，让接下来的行程心中有数。",
      "Подтвердите запись, перелёт, документы и детали прибытия.",
      "Confirma citas, vuelos, documentos de viaje y detalles de llegada.",
    ],
  },
  {
    icon: MapPin,
    image: journeyGroundSupport,
    eyebrow: ["Arrival & airport pickup", "抵达与接机", "Прибытие и встреча в аэропорту", "Llegada y recogida en el aeropuerto"],
    title: ["A warm welcome, from the moment you land", "落地的第一刻，就有人迎接你", "Прибудьте в Китай и встретьтесь с нашей командой", "Llega a China y reúnete con nuestro equipo"],
    text: [
      "A new country, a friendly face waiting for you. Our team meets you at the airport and takes you to your hotel or straight to the clinic. Haven’t booked a hotel yet? No worries. Bring your passport, and we’ll help you find a place to stay and get checked in.",
      "初到中国，迎接你的是我们熟悉行程的接机团队。与我们会合后，前往酒店休息，或直接前往诊所。还没订酒店？没关系。带好护照，我们会帮你寻找住宿并协助办理入住。",
      "Наша команда встретит вас в аэропорту и отвезёт в отель или прямо в клинику.",
      "Nuestro equipo te recibirá en el aeropuerto y te llevará al hotel o directamente a la clínica.",
    ],
  },
  {
    icon: HeartPulse,
    image: journeyTreatment,
    eyebrow: ["Treatment support", "治疗支持", "Поддержка лечения", "Apoyo durante el tratamiento"],
    title: ["Your transformation, with us by your side", "你的变美时刻，我们陪你", "Ваше преображение — мы рядом", "Tu transformación, con nosotros a tu lado"],
    text: [
      "On surgery day, we accompany you to the clinic, help you communicate and stay close when you need us. If your doctor doesn’t feel like the right fit, let us know. We can accompany you to meet another doctor or visit another clinic.",
      "手术当天，我们陪同你前往诊所，协助沟通，在你需要时陪伴左右。如果你觉得医生不合适，请告诉我们，我们可以陪同你面诊其他医生或前往其他诊所。",
      "В день операции мы сопровождаем вас в клинику, помогаем с общением и остаёмся рядом, когда нужны вам.",
      "El día de la cirugía te acompañamos a la clínica, te ayudamos a comunicarte y estamos cerca cuando nos necesitas.",
    ],
  },
  {
    icon: Map,
    image: journeyRecovery,
    eyebrow: ["Recovery", "恢复期", "Восстановление", "Recuperación"],
    title: ["A little exploring, at your pace", "按你的节奏，感受中国", "Восстанавливайтесь и путешествуйте, когда будете готовы", "Recupérate y explora cuando estés listo"],
    text: [
      "If your doctor clears you for outings, we can help plan a gentle itinerary and connect you with travel services, or keep it as relaxed as a stroll in the beautiful park.",
      "如果医生确认你的恢复情况适合外出，我们可以协助规划轻松的行程、对接旅行服务，或只是安排去公园走走。",
      "Следуйте рекомендациям эксперта и путешествуйте только после разрешения.",
      "Sigue el consejo de tu experto, con viajes opcionales cuando recibas el visto bueno.",
    ],
  },
  {
    icon: MessageCircle,
    image: journeyFollowUp,
    eyebrow: ["Follow-up", "后续随访", "Наблюдение", "Seguimiento"],
    title: ["Back home, still by your side", "回到家，陪伴仍在", "Оставайтесь на связи после возвращения", "Mantente en contacto tras tu regreso"],
    text: [
      "Your journey with us doesn’t end at the airport. We help you stay connected with your clinic for recommended follow-ups, with translation support along the way.",
      "旅程结束，关怀继续。我们协助你与诊所保持联系，安排建议的远程复诊，并提供翻译支持。",
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
      "A friendly face at arrivals. A ride to your hotel or clinic, and back to the airport.",
      "落地有人迎接，往返机场与酒店或诊所，有我们接送。",
      "Прямой трансфер между аэропортом и подтверждённым отелем или клиникой с учётом деталей прибытия.",
      "Traslado directo entre el aeropuerto y tu hotel o clínica confirmados, coordinado según tus datos de llegada.",
    ],
  },
  {
    icon: Languages,
    title: ["Your voice, understood", "让你的想法被听懂", "Перевод в клинике", "Traducción en la clínica"],
    text: [
      "Ask your questions. Understand your care. We translate during included clinic visits.",
      "问清疑惑，听懂护理建议。约定就诊期间，我们为你翻译。",
      "Двуязычная помощь при вопросах, инструкциях по уходу и дальнейших шагах во время включённых визитов.",
      "Apoyo de comunicación bilingüe para preguntas, instrucciones de cuidado y próximos pasos durante las visitas incluidas.",
    ],
  },
  {
    icon: Hotel,
    title: ["Find your place to rest", "找到安心休息的住处", "Помощь с проживанием", "Orientación de alojamiento"],
    text: [
      "Hotel options that fit your stay, budget and recovery needs. Hotel costs paid separately.",
      "按行程、预算与恢复需求，帮你挑选酒店。住宿费用另付。",
      "Подбор отелей рядом с клиникой с учётом дат, бюджета и восстановления. Проживание оплачивается отдельно.",
      "Opciones de hotel preseleccionadas según tu clínica, fechas, presupuesto y necesidades de recuperación. Los gastos de hotel se pagan por separado.",
    ],
  },
  {
    icon: Files,
    title: ["Your records, ready to share", "病历备好，沟通更清楚", "Подготовка документов", "Organización de historial médico"],
    text: [
      "We organize the records you provide and help translate key details for your clinic.",
      "整理你提供的病历，协助翻译关键信息，方便与诊所沟通。",
      "Предоставленные документы систематизируются в понятный файл; важная информация может быть переведена для координации лечения.",
      "Los documentos que proporcionas se organizan en un expediente más claro; la información relevante puede traducirse para coordinar la atención.",
    ],
  },
  {
    icon: Headphones,
    title: ["Your coordinator, a message away", "你的管家，发条消息就能联系", "Онлайн-поддержка", "Asistencia de conserjería en línea"],
    text: [
      "Travel or booking questions? Message us during your agreed support period.",
      "行程、预订有疑问？约定服务期间，随时给我们留言。",
      "Связывайтесь с координатором по вопросам маршрута, бронирования и услуг в подтверждённый период поддержки.",
      "Escribe a tu coordinador por dudas de itinerario, reservas y servicios durante el periodo de apoyo confirmado.",
    ],
  },
] as const;

const Packages = () => {
  const { lang, t } = useAsia();
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
              <h1 className="mt-4 font-display text-[2.25rem] font-medium leading-[1.06] tracking-tight sm:text-5xl md:text-6xl">
                {c("Six steps. ", "六个步骤，", "Шесть этапов. ", "Seis pasos. ")}<em className="not-italic text-brand">{c("No guessing what comes next.", "每一步都清楚。", "Вы всегда знаете, что дальше.", "Sin dudas sobre qué sigue.")}</em>
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{c("Each stage answers the question patients ask most: what happens next, who helps and what should I prepare?", "每个阶段都会回答患者最关心的问题：下一步是什么、谁来协助、需要准备什么？", "Каждый этап отвечает на главные вопросы: что дальше, кто поможет и что подготовить?", "Cada etapa responde a la pregunta que más hacen los pacientes: ¿qué sigue, quién ayuda y qué debo preparar?")}</p>
            </div>

            <div className="mt-8 flex flex-col gap-4 md:flex-row md:gap-6">
              <div className="flex flex-1 items-center gap-4 rounded-2xl border border-primary/15 bg-gradient-to-r from-[hsl(156_58%_93%)] to-[hsl(146_48%_86%)] p-5 text-foreground shadow-soft">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/65 text-primary"><Wallet className="size-5" /></span>
                <div>
                  <h3 className="font-display text-sm font-semibold tracking-tight">{c("$200 coordination deposit", "200 美元协调押金", "Депозит $200", "Depósito de coordinación de 200 $")}</h3>
                  <p className="mt-1 text-xs uppercase tracking-tight text-muted-foreground">{c("Reserves your date & support package", "保留预约与协调服务", "Бронирует дату и поддержку", "Reserva tu fecha y paquete de apoyo")}</p>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-4 rounded-2xl border border-primary/15 bg-gradient-to-r from-[hsl(156_58%_93%)] to-[hsl(146_48%_86%)] p-5 text-foreground shadow-soft">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/65 text-primary"><Building2 className="size-5" /></span>
                <div>
                  <h3 className="font-display text-sm font-semibold tracking-tight">{c("Pay the clinic directly", "直接支付给诊所", "Оплата напрямую клинике", "Paga directamente a la clínica")}</h3>
                  <p className="mt-1 text-xs uppercase tracking-tight text-muted-foreground">{c("Medical fees go straight to the facility", "医疗费用由诊所直接收取", "Медицинские сборы — напрямую в клинику", "Los honorarios médicos van directamente al centro")}</p>
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
                      <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-label font-bold uppercase tracking-[.14em] text-foreground shadow-soft backdrop-blur">{c(`Step ${index + 1}`, `第 ${index + 1} 步`, `Этап ${index + 1}`, `Paso ${index + 1}`)}</span>
                    </div>
                    <div className="p-4 sm:p-5 md:p-6">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-4" /></span>
                        <p className="text-label font-bold uppercase tracking-[.15em] text-brand">{pick(step.eyebrow)}</p>
                      </div>
                      <h3 className="mt-3 font-display text-[1.35rem] font-semibold leading-tight tracking-tight sm:text-2xl md:mt-4">{pick(step.title)}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pick(step.text)}</p>
                      {index === 0 && (
                        <a href={QUOTE_WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-brand underline-offset-4 hover:underline">
                          {t("hero.cta")}<ArrowRight className="size-4" />
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section id="support" className="container scroll-mt-24 py-10 md:py-20">
            <div>
              <div className="mb-7 md:mb-9">
                <div>
                  <span className="pill bg-primary/10 text-foreground"><ShieldCheck className="size-3.5 text-primary" />{c("Free coordination support", "免费协调支持", "Бесплатная координационная поддержка", "Apoyo de coordinación gratuito")}</span>
                  <h2 className="mt-4 max-w-3xl font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">{c("Your journey. Our support.", "你的旅程，我们相伴。", "Бесплатные услуги Celadon", "Servicios gratuitos de Celadon")}</h2>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
                {SUPPORT_SERVICES.map((service, index) => {
                  const Icon = service.icon;
                  const wide = index < 2 ? "lg:col-span-3" : "lg:col-span-2";
                  return (
                    <article key={service.title[0]} className={`min-w-0 rounded-3xl border border-primary/20 bg-white p-5 shadow-[0_4px_20px_-12px_hsl(var(--primary)/0.12)] sm:p-6 ${wide}`}>
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon aria-hidden="true" className="size-4" /></span>
                        <h3 className="font-display text-lg font-semibold leading-tight tracking-tight sm:text-xl">{pick(service.title)}</h3>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pick(service.text)}</p>
                    </article>
                  );
                 })}
              </div>
            </div>
          </section>

          <section className="container py-12 md:py-20">
            <div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:gap-14">
              <div>
                <span className="pill bg-accent text-accent-foreground"><CircleDollarSign className="size-3.5" />{c("Clarity before commitment", "确认前先讲清楚", "Ясность до обязательств", "Claridad antes de comprometerte")}</span>
                <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight md:text-5xl">{c("Know what is included and what is not.", "清楚知道哪些包含，哪些不包含。", "Знайте, что включено, а что нет.", "Sabe qué está incluido y qué no.")}</h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">{c("We confirm the scope in writing before travel so you can make decisions with fewer surprises.", "出发前，我们会以书面形式确认服务范围，帮助你减少意外情况。", "До поездки мы письменно подтверждаем объём услуг, чтобы уменьшить неожиданности.", "Confirmamos el alcance por escrito antes de viajar para que puedas decidir con menos sorpresas.")}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-3xl border border-primary/20 bg-primary/[.06] p-6">
                  <p className="text-xs font-bold uppercase tracking-[.15em] text-brand">{c("Coordination support", "协调支持", "Координационная поддержка", "Apoyo de coordinación")}</p>
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
        <div className="container pb-10">
          <MedicalDisclaimer variant="banner" className="mx-auto max-w-5xl" />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Packages;

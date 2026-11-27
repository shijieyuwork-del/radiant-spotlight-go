import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleDollarSign,
  Files,
  Headphones,
  Hotel,
  Languages,
  Plane,
  Route,
  ShieldCheck,
  Stethoscope,
  Video,
} from "lucide-react";
import { Link } from "react-router-dom";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { getCoordinationPolicy } from "@/data/coordination-policy";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";
import QuoteCtaButton, { QUOTE_WHATSAPP_URL } from "@/components/QuoteCtaButton";
import journeyGroundSupport from "@/assets/journey-premium-natural-concierge-v5.webp";

const JOURNEY_STEPS = [
  {
    icon: Stethoscope,
    image: "https://images.unsplash.com/photo-1790597037883-98cd19d3be11?w=1200&h=675&fit=crop&auto=format&q=70",
    eyebrow: ["Choose your surgeon", "确定医生", "Выбор хирурга", "Elige a tu cirujano"],
    title: [
      "Find the surgeon who fits you",
      "找到适合你的医生",
      "Найдите подходящего хирурга",
      "Encuentra al cirujano adecuado",
    ],
    text: [
      "Tell us the procedure you want. Compare surgeons by hospital and real case videos, or name any hospital or surgeon you already have in mind. We work with most private plastic surgery hospitals in China.",
      "告诉我们你想做的项目。按医院和真实案例视频对比医生，或直接告诉我们你想去的医院、想看的医生。我们与中国大部分私立整形医院都有合作。",
      "Расскажите, какая процедура вас интересует. Сравните хирургов по клинике и реальным видео случаев или назовите клинику или хирурга, которых вы уже выбрали. Мы сотрудничаем с большинством частных клиник пластической хирургии в Китае.",
      "Dinos qué procedimiento quieres. Compara cirujanos por hospital y vídeos de casos reales, o dinos el hospital o cirujano que ya tienes en mente. Trabajamos con la mayoría de los hospitales privados de cirugía plástica de China.",
    ],
    points: [],
  },
  {
    icon: Video,
    image: "https://images.unsplash.com/photo-1758691462743-f9fc9e430d39?w=1200&h=675&fit=crop&auto=format&q=70",
    eyebrow: ["Online consultation", "线上问诊", "Онлайн-консультация", "Consulta en línea"],
    title: [
      "Meet your surgeon online before you fly",
      "出发前，先线上面诊",
      "Познакомьтесь с хирургом онлайн до поездки",
      "Conoce a tu cirujano en línea antes de viajar",
    ],
    text: [
      "Talk with your surgeon by video, with an interpreter on the call. Ask every question, get a written quote, and decide only when you feel ready. We then help book your surgery date.",
      "通过视频与医生面诊，全程有翻译。问清所有问题，拿到书面报价，觉得准备好了再决定。确认后我们协助预约手术日期。",
      "Поговорите с хирургом по видео с переводчиком. Задайте все вопросы, получите письменное предложение и решайте, когда будете готовы. Затем мы поможем забронировать дату операции.",
      "Habla con tu cirujano por videollamada con intérprete. Haz todas tus preguntas, recibe un presupuesto por escrito y decide cuando te sientas listo. Después te ayudamos a reservar la fecha de la cirugía.",
    ],
    points: [],
  },
  {
    icon: Plane,
    image: journeyGroundSupport,
    eyebrow: ["Surgery in China", "来中国做手术", "Операция в Китае", "Cirugía en China"],
    title: [
      "Fly in, we handle the rest",
      "来中国手术，其余交给我们",
      "Прилетайте, остальное мы возьмём на себя",
      "Vuela a China, nosotros nos encargamos del resto",
    ],
    text: [
      "Fly to China for your surgery. A coordinator looks after the details:",
      "来中国做手术，协调员帮你安排好这些：",
      "Прилетайте в Китай на операцию. Координатор возьмёт на себя детали:",
      "Viaja a China para tu cirugía. Un coordinador se ocupa de los detalles:",
    ],
    points: [
      [
        "Airport pickup and drop-off. We hold a $100 deposit before you travel and return it to you on surgery day.",
        "接送机。出发前收取 100 美元押金，手术当天退还给你。",
        "Встреча и проводы в аэропорту. До поездки мы берём депозит $100 и возвращаем его в день операции.",
        "Recogida y traslado al aeropuerto. Antes del viaje cobramos un depósito de 100 USD que te devolvemos el día de la cirugía.",
      ],
      [
        "Your first two hotel nights free for eligible confirmed journeys (standard room at a selected three-star hotel; extra nights and upgrades paid separately).",
        "符合条件并已确认的行程，前两晚酒店免费（指定三星级酒店标准间，额外住宿和升级另付）。",
        "Первые две ночи в отеле бесплатно для подходящих подтверждённых поездок (стандартный номер в выбранном трёхзвёздочном отеле; дополнительные ночи и улучшения оплачиваются отдельно).",
        "Las dos primeras noches de hotel gratis en viajes elegibles y confirmados (habitación estándar en un hotel de tres estrellas seleccionado; noches extra y mejoras aparte).",
      ],
      [
        "Optional: light sightseeing once your surgeon clears you.",
        "可选：医生确认可以外出后，帮你安排轻松的旅行。",
        "По желанию: лёгкие прогулки после разрешения хирурга.",
        "Opcional: turismo tranquilo cuando tu cirujano lo autorice.",
      ],
    ],
  },
] as const;

const SUPPORT_SERVICES = [
  {
    icon: Plane,
    title: ["Airport pickup on us", "已包含机场接送", "Трансфер — за наш счёт", "Traslados incluidos"],
    text: [
      "Airport pickup and drop-off are included for your confirmed itinerary.",
      "按确认的行程提供机场接送。",
      "Трансфер из аэропорта и обратно входит в подтверждённый маршрут.",
      "La recogida y el traslado de vuelta están incluidos en tu itinerario confirmado.",
    ],
  },
  {
    icon: Languages,
    title: [
      "In-clinic translation on us",
      "已包含院内翻译",
      "Перевод в клинике — за наш счёт",
      "Traducción en clínica incluida",
    ],
    text: [
      "In-clinic translation is included during the visits listed in your support plan.",
      "在服务方案列明的就诊期间，提供院内翻译。",
      "Перевод в клинике входит в визиты, указанные в вашем плане поддержки.",
      "La traducción en clínica está incluida durante las visitas indicadas en tu plan de apoyo.",
    ],
  },
  {
    icon: Hotel,
    title: [
      "Two hotel nights on us",
      "符合条件的行程包含两晚酒店",
      "Две ночи в отеле — за наш счёт",
      "Dos noches de hotel incluidas",
    ],
    text: [
      "Two hotel nights are included for eligible journeys. Extra nights and upgrades are paid separately.",
      "符合条件的行程包含两晚酒店。额外晚数与房型升级需另行支付。",
      "Для подходящих поездок включены две ночи в отеле. Дополнительные ночи и улучшения оплачиваются отдельно.",
      "En los viajes elegibles se incluyen dos noches de hotel. Las noches adicionales y mejoras se pagan aparte.",
    ],
  },
  {
    icon: Files,
    title: [
      "Records prep on us",
      "已包含病历整理",
      "Подготовка документов — за наш счёт",
      "Organización de documentos incluida",
    ],
    text: [
      "We organize the records you provide and help translate key details for your clinic.",
      "整理你提供的病历，协助翻译关键信息，方便与诊所沟通。",
      "Предоставленные документы систематизируются в понятный файл; важная информация может быть переведена для координации лечения.",
      "Los documentos que proporcionas se organizan en un expediente más claro; la información relevante puede traducirse para coordinar la atención.",
    ],
  },
  {
    icon: Headphones,
    title: ["24/7 support on us", "已包含全天协调支持", "Поддержка 24/7 — за наш счёт", "Apoyo 24/7 incluido"],
    text: [
      "A coordinator is available 24/7 during your confirmed support period.",
      "在确认的支持期间，协调员提供 24 小时服务。",
      "Координатор доступен 24/7 в подтверждённый период поддержки.",
      "Un coordinador está disponible 24/7 durante el periodo de apoyo confirmado.",
    ],
  },
] as const;

const Packages = () => {
  const { lang, t } = useAsia();
  const policy = getCoordinationPolicy(lang);
  const c = <T,>(en: T, zh: T, ru: T, es?: T) => asiaCopy(lang, { en, zh, ru, es });
  const pick = (values: readonly [string, string, string, string?]) => c(values[0], values[1], values[2], values[3]);

  return (
    <>
      <PageMeta
        title="China Medical Travel Support | Sino Aesthetics"
        description="Plan cosmetic care in China with clear payment terms, airport pickup, in-clinic translation, accommodation guidance and coordinated follow-up."
        path="/travel-packages"
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />
        <main>
          <section id="journey" className="container scroll-mt-24 py-10 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <span className="pill bg-accent text-accent-foreground">
                <Route className="size-3.5" />
                {c(
                  "A clear path from home to follow-up",
                  "从家中咨询到术后随访",
                  "Понятный путь от дома до наблюдения",
                  "Un camino claro desde casa hasta el seguimiento",
                )}
              </span>
              <h1 className="mt-4 font-display text-[2.25rem] font-medium leading-[1.06] tracking-tight sm:text-5xl md:text-6xl">
                {c("Three steps. ", "三个步骤，", "Три этапа. ", "Tres pasos. ")}
                <em className="not-italic text-brand">
                  {c(
                    "No guessing what comes next.",
                    "每一步都清楚。",
                    "Вы всегда знаете, что дальше.",
                    "Sin dudas sobre qué sigue.",
                  )}
                </em>
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                {c(
                  "Our service is free for patients. Partner hospitals pay us a small referral fee after a completed surgery.",
                  "我们的服务对患者免费。手术完成后，由合作医院向我们支付少量转介费。",
                  "Для пациентов наши услуги бесплатны. Клиники-партнёры платят нам небольшую комиссию после проведённой операции.",
                  "Nuestro servicio es gratuito para los pacientes. Los hospitales asociados nos pagan una pequeña comisión por cada cirugía realizada.",
                )}
              </p>
            </div>

            <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 scrollbar-hide sm:-mx-6 sm:px-6 md:mx-0 md:mt-10 md:grid md:grid-cols-1 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
              {JOURNEY_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article
                    key={step.eyebrow[0]}
                    className={`group min-w-[84vw] snap-center overflow-hidden rounded-[1.5rem] border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-pop sm:min-w-[68vw] md:min-w-0 md:rounded-[1.75rem] ${index === 0 ? "border-primary/45 ring-4 ring-primary/5" : "border-border/70"}`}
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-muted md:aspect-[16/8]">
                      <img
                        src={step.image}
                        alt={pick(step.title)}
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                        className="size-full object-cover transition duration-700 group-hover:scale-[1.035]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-label font-bold uppercase tracking-[.14em] text-foreground shadow-soft backdrop-blur">
                        {c(`Step ${index + 1}`, `第 ${index + 1} 步`, `Этап ${index + 1}`, `Paso ${index + 1}`)}
                      </span>
                    </div>
                    <div className="p-4 sm:p-5 md:p-6">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                          <Icon className="size-4" />
                        </span>
                        <p className="text-label font-bold uppercase tracking-[.15em] text-brand">
                          {pick(step.eyebrow)}
                        </p>
                      </div>
                      <h3 className="mt-3 font-display text-[1.35rem] font-semibold leading-tight tracking-tight sm:text-2xl md:mt-4">
                        {pick(step.title)}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pick(step.text)}</p>
                      {step.points.length > 0 && (
                        <ul className="mt-4 space-y-2.5">
                          {(step.points as readonly (readonly [string, string, string, string])[]).map((point) => (
                            <li key={point[0]} className="flex gap-2 text-sm leading-relaxed text-foreground/80">
                              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                              <span>{pick(point)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {index === 0 && (
                        <Link
                          to="/doctors"
                          className="mt-5 inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-brand underline-offset-4 hover:underline"
                        >
                          {c("Compare surgeons", "对比医生", "Сравнить хирургов", "Comparar cirujanos")}
                          <ArrowRight className="size-4" />
                        </Link>
                      )}
                      {index === 1 && (
                        <a
                          href={QUOTE_WHATSAPP_URL}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-5 inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-brand underline-offset-4 hover:underline"
                        >
                          {t("hero.cta")}
                          <ArrowRight className="size-4" />
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
                  <span className="pill bg-primary/10 text-foreground">
                    <ShieldCheck className="size-3.5 text-primary" />
                    {policy.freeTitle}
                  </span>
                  <h2 className="mt-4 max-w-3xl font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
                    {c(
                      "Your journey. Our support. On us.",
                      "你的中国行程，由我们协助安排。",
                      "Ваш путь. Наша поддержка.",
                      "Tu viaje. Nuestro apoyo.",
                    )}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-foreground/75">
                    {c(
                      "Airport pickup on us. Two hotel nights on us. In-clinic translation on us. 24/7 coordinator support on us. All included for eligible journeys.",
                      "符合条件且已确认的行程可包含机场接送、两晚酒店、院内翻译和全天协调支持；具体日期、次数与范围以书面服务方案为准。",
                      "Трансфер из аэропорта за наш счёт. Две ночи в отеле за наш счёт. Перевод в клинике за наш счёт. Координационная поддержка 24/7 за наш счёт. Всё включено для подходящих поездок.",
                      "Traslados incluidos. Dos noches de hotel incluidas. Traducción en clínica incluida. Apoyo de coordinación 24/7 incluido. Todo forma parte de los viajes elegibles.",
                    )}
                  </p>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/75">
                    <span className="font-medium text-foreground">{policy.depositTitle}. </span>
                    {policy.depositSummary}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
                {SUPPORT_SERVICES.map((service, index) => {
                  const Icon = service.icon;
                  const wide = index < 2 ? "lg:col-span-3" : "lg:col-span-2";
                  return (
                    <article
                      key={service.title[0]}
                      className={`min-w-0 rounded-3xl border border-primary/20 bg-white p-5 shadow-[0_4px_20px_-12px_hsl(var(--primary)/0.12)] sm:p-6 ${wide}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                          <Icon aria-hidden="true" className="size-4" />
                        </span>
                        <h3 className="font-display text-lg font-semibold leading-tight tracking-tight sm:text-xl">
                          {pick(service.title)}
                        </h3>
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
                <span className="pill bg-accent text-accent-foreground">
                  <CircleDollarSign className="size-3.5" />
                  {c(
                    "Clarity before commitment",
                    "确认前先讲清楚",
                    "Ясность до обязательств",
                    "Claridad antes de comprometerte",
                  )}
                </span>
                <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight md:text-5xl">
                  {c(
                    "Know what is included and what is not.",
                    "清楚知道哪些包含，哪些不包含。",
                    "Знайте, что включено, а что нет.",
                    "Sabe qué está incluido y qué no.",
                  )}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {c(
                    "We confirm the scope in writing before travel so you can make decisions with fewer surprises.",
                    "出发前，我们会以书面形式确认服务范围，帮助你减少意外情况。",
                    "До поездки мы письменно подтверждаем объём услуг, чтобы уменьшить неожиданности.",
                    "Confirmamos el alcance por escrito antes de viajar para que puedas decidir con menos sorpresas.",
                  )}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-3xl border border-primary/20 bg-primary/[.06] p-6">
                  <p className="text-xs font-bold uppercase tracking-[.15em] text-brand">
                    {c("Coordination support", "协调支持", "Координационная поддержка", "Apoyo de coordinación")}
                  </p>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/75">
                    {[
                      c(
                        "Airport pickup coordination",
                        "机场接送协调",
                        "Организация трансфера",
                        "Coordinación de recogida en el aeropuerto",
                      ),
                      c(
                        "In-clinic translation for included visits",
                        "包含行程中的院内翻译",
                        "Перевод во время включённых визитов",
                        "Traducción en clínica durante las visitas incluidas",
                      ),
                      c(
                        "Records organization and practical planning",
                        "病历整理与实际行程规划",
                        "Подготовка документов и планирование",
                        "Organización de historial médico y planificación práctica",
                      ),
                    ].map((item) => (
                      <li key={item} className="flex gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
                <article className="rounded-3xl border border-amber-200/80 bg-amber-50/70 p-6">
                  <p className="text-xs font-bold uppercase tracking-[.15em] text-amber-800">
                    {c("Paid separately", "需另行支付", "Оплачивается отдельно", "Se paga por separado")}
                  </p>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/75">
                    {[
                      c(
                        "All clinic and hospital medical fees",
                        "全部诊所和医院医疗费用",
                        "Все медицинские услуги клиники",
                        "Todos los honorarios médicos de clínicas y hospitales",
                      ),
                      c(
                        "Hotel charges after the two included nights",
                        "两晚免费酒店后的住宿费用",
                        "Проживание после двух включённых ночей",
                        "Gastos de hotel después de las dos noches incluidas",
                      ),
                      c(
                        "Optional touring and personal expenses",
                        "自愿旅行及个人费用",
                        "Дополнительные поездки и личные расходы",
                        "Excursiones opcionales y gastos personales",
                      ),
                    ].map((item) => (
                      <li key={item} className="flex gap-2">
                        <ChevronRight className="mt-0.5 size-4 shrink-0 text-amber-700" />
                        {item}
                      </li>
                    ))}
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

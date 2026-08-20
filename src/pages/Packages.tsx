import { Link } from "react-router-dom";
import { Check, Sparkles, Crown, Gem, ArrowRight, ShieldCheck, Plane, Hotel, Languages, Files, Headphones, FileText, Video, Route, HeartPulse, Map, MessageCircle } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";
import serviceAirportPickup from "@/assets/service-airport-pickup.jpg";
import serviceHotelBooking from "@/assets/service-hotel-booking.jpg";
import serviceClinicTranslation from "@/assets/service-clinic-translation.jpg";
import serviceMedicalRecords from "@/assets/service-medical-records.jpg";
import serviceOnlineConcierge from "@/assets/service-online-concierge.jpg";
import cityHangzhou from "@/assets/city-hangzhou.jpg";

type Pkg = {
  id: string;
  nameEn: string; nameZh: string;
  price: number;
  originalPrice?: number;
  taglineEn: string; taglineZh: string;
  icon: React.ComponentType<{ className?: string }>;
  grad: string;
  highlight?: boolean;
  includesEn?: string;
  includesZh?: string;
  features: { en: string; zh: string; noteEn?: string; noteZh?: string; bold?: boolean }[];
};

const PACKAGES: Pkg[] = [
  {
    id: "basic",
    nameEn: "Free Package", nameZh: "免费套餐",
    price: 0,
    taglineEn: "Essential travel support at no service fee",
    taglineZh: "基础旅行协助 · 免服务费",
    icon: Sparkles,
    grad: "from-[hsl(158,34%,93%)] to-[hsl(48,45%,97%)]",
    features: [
      { en: "$400 Coordination Deposit — Refunded After You Arrive at the Clinic", zh: "400 美元协调押金 — 抵达诊所后退还", bold: true },
      { en: "1-on-1 In-Hospital Accompaniment (1 Day)", zh: "1 对 1 院内陪同（1 天）", bold: true },
      { en: "Airport Pickup & Drop-off", zh: "机场接送" },
      { en: "Hotel Near the Clinic", zh: "诊所附近酒店" },
      { en: "In-Clinic Translation Service", zh: "诊所内翻译服务" },
      { en: "Professional Medical Records Translation & Organization", zh: "专业病历翻译与整理" },
      { en: "Daily Online Concierge Support (10:00 AM – 10:00 PM Beijing Time, 7 Days · WeChat / WhatsApp / Message)", zh: "每日在线管家支持（北京时间 10:00–22:00 · 7 天 · 微信 / WhatsApp / 短信）" },
    ],
  },
  {
    id: "gold",
    nameEn: "Gold Package", nameZh: "金牌套餐",
    price: 699,
    originalPrice: 1099,
    taglineEn: "Most popular · stay + accompaniment included",
    taglineZh: "人气之选 · 含住宿与陪同",
    icon: Crown,
    grad: "from-[hsl(340,48%,94%)] to-[hsl(48,45%,97%)]",
    highlight: true,
    includesEn: "Everything in the Free Package, plus:",
    includesZh: "包含免费套餐的全部服务，另加：",
    features: [
      { en: "1-on-1 In-Hospital Accompaniment (4 Days)", zh: "1 对 1 院内陪同（4 天）", bold: true },
      { en: "7-Night Stay in a Comfortable 3-Star Hotel — Included", zh: "舒适三星级酒店 7 晚住宿 — 已含", bold: true },
      { en: "Extra Nights Available (+$50 / night · Up to 20 Days Total)", zh: "可额外加住（+50 美元/晚 · 最长 20 天）" },
    ],
  },
  {
    id: "diamond",
    nameEn: "Diamond VIP Package", nameZh: "钻石尊享套餐",
    price: 1999,
    originalPrice: 2799,
    taglineEn: "End-to-end VIP · 5-star stay & private guide",
    taglineZh: "尊享一站式 · 五星酒店 + 私人导游",
    icon: Gem,
    grad: "from-[hsl(158,30%,94%)] to-[hsl(340,45%,95%)]",
    includesEn: "Everything in Gold, with the following services upgraded:",
    includesZh: "包含金牌套餐的全部服务，以下项目升级为：",
    features: [
      { en: "Unlimited 1-on-1 In-Hospital Accompaniment — Replaces the 4-Day Limit", zh: "不限天数的 1 对 1 院内陪同 — 替代原 4 天限制", bold: true },
      { en: "1-on-1 Private Tour Guide in China with a Customized Itinerary (Up to 5 Days)", zh: "中国境内 1 对 1 私人导游及定制行程（最多 5 天）", bold: true },
      { en: "7-Night 5-Star Hotel Stay — Upgrade from the 3-Star Hotel", zh: "五星级酒店 7 晚住宿 — 由三星级酒店升级", bold: true },
      { en: "Additional Nights: $100 / Night (Up to 20 Days Total)", zh: "额外住宿：100 美元/晚（总行程最长 20 天）" },
    ],
  },
];

const PACKAGE_SNAPSHOTS = [
  {
    en: "1 day of in-hospital accompaniment",
    zh: "1 天院内陪同",
    detailEn: "Core travel support · no service fee",
    detailZh: "基础旅行支持 · 免服务费",
  },
  {
    en: "4 days of accompaniment + hotel",
    zh: "4 天院内陪同 + 酒店",
    detailEn: "Best for a standard recovery trip",
    detailZh: "适合常规恢复行程",
  },
  {
    en: "Unlimited accompaniment + VIP stay",
    zh: "不限天数陪同 + 尊享住宿",
    detailEn: "5-star hotel and private tour guide",
    detailZh: "五星酒店及私人导游",
  },
] as const;

const SERVICE_DETAILS = [
  {
    titleEn: "Airport Pickup & Drop-off",
    titleZh: "机场接送",
    descriptionEn: "We coordinate your arrival details in advance and arrange a direct transfer between the airport and your confirmed hotel or clinic. If your flight time changes, message your coordinator so the pickup can be adjusted.",
    descriptionZh: "我们会提前确认抵达信息，并安排机场与已确认酒店或诊所之间的点对点接送。如航班时间发生变化，可联系协调员调整接机安排。",
    noteEn: "Arrival details confirmed before travel",
    noteZh: "出发前确认抵达信息",
    image: serviceAirportPickup,
    icon: Plane,
  },
  {
    titleEn: "Hotel Near the Clinic",
    titleZh: "酒店预订协助",
    descriptionEn: "Tell us your dates, budget and recovery needs. We help shortlist suitable hotels, check practical details and coordinate the reservation. Hotel charges are separate unless your selected package specifically includes accommodation.",
    descriptionZh: "告知我们日期、预算和恢复需求，我们会协助筛选合适酒店、确认实用细节并协调预订。除非所选套餐明确包含住宿，酒店费用需另行支付。",
    noteEn: "Options matched to your itinerary and budget",
    noteZh: "根据行程和预算匹配选项",
    image: serviceHotelBooking,
    icon: Hotel,
  },
  {
    titleEn: "In-Clinic Translation Service",
    titleZh: "诊所内翻译服务",
    descriptionEn: "A bilingual coordinator helps you communicate during scheduled clinic visits, including consultation questions, care instructions and practical next steps. Medical decisions and advice remain the responsibility of the treating clinician.",
    descriptionZh: "双语协调员会在预约的诊所行程中协助沟通，包括面诊问题、护理说明及后续安排。医疗决定与建议仍由接诊医生负责。",
    noteEn: "Clearer communication during clinic visits",
    noteZh: "让诊所内沟通更清楚",
    image: serviceClinicTranslation,
    icon: Languages,
  },
  {
    titleEn: "Professional Medical Records Translation & Organization",
    titleZh: "专业病历翻译与整理",
    descriptionEn: "We organize the records you provide and translate relevant information into a clear review file for the clinic. Personal documents are handled only for care coordination; certified or legal translation is not included unless separately agreed.",
    descriptionZh: "我们会整理你提供的病历，并将相关信息翻译成便于诊所审核的文件。个人资料仅用于医疗协调；认证或法律用途翻译需另行确认。",
    noteEn: "Structured files prepared for clinical review",
    noteZh: "为诊所审核准备结构化文件",
    image: serviceMedicalRecords,
    icon: Files,
  },
  {
    titleEn: "Daily Online Concierge Support",
    titleZh: "每日在线管家支持",
    descriptionEn: "For seven days, contact your coordinator by WeChat, WhatsApp or message from 10:00 AM to 10:00 PM Beijing Time for itinerary, booking and service questions. This is not an emergency or 24-hour medical line.",
    descriptionZh: "连续 7 天可在北京时间 10:00–22:00 通过微信、WhatsApp 或短信联系协调员，咨询行程、预订及服务问题。本服务不是急救或 24 小时医疗热线。",
    noteEn: "10:00 AM–10:00 PM Beijing Time · 7 days",
    noteZh: "北京时间 10:00–22:00 · 7 天",
    image: serviceOnlineConcierge,
    icon: Headphones,
  },
] as const;

const JOURNEY_STEPS = [
  {
    number: "01",
    eyebrowEn: "Consultation · $99–$699",
    eyebrowZh: "在线咨询",
    titleEn: "Book your medical consultation",
    titleZh: "预约医疗咨询",
    descriptionEn: "Choose a doctor or hospital in China, or let us recommend suitable specialists after reviewing the records you provide. Your consultation plan may include a pre-meeting, a recorded 40-minute one-on-one video consultation, professional translation and a written summary.",
    descriptionZh: "选择你心仪的中国医生或医院，也可以提交病历，由我们协助匹配合适的专家。咨询方案可包含会前病历梳理、40 分钟一对一视频面诊、专业翻译及书面总结。",
    noteEn: "Dental and cosmetic consultations may start at $99; complex multidisciplinary cases may range from $399–$699. The final fee is confirmed before booking.",
    noteZh: "",
    icon: Video,
    image: serviceMedicalRecords,
  },
  {
    number: "02",
    eyebrowEn: "Flights & documents",
    eyebrowZh: "航班与签证材料",
    titleEn: "Arrange your travel & visa",
    titleZh: "安排行程与签证",
    descriptionEn: "Once your appointment is confirmed, we help organize arrival details and the documents needed for your trip. Eligible partner-hospital bookings may include airport pickup and assistance getting connected after arrival.",
    descriptionZh: "面诊确认后，我们协助梳理抵达信息和行程所需文件。符合条件的合作医院预约可包含机场接送，以及抵达后的通信设置协助。",
    noteEn: "If a visa is required, we can help arrange a Medical Invitation Letter. Share confirmed flight details at least five days before arrival.",
    noteZh: "如需签证，我们可协助准备医疗邀请函。请至少提前 5 天提供已确认的航班信息。",
    icon: Plane,
    image: serviceAirportPickup,
  },
  {
    number: "03",
    eyebrowEn: "Before departure",
    eyebrowZh: "出发前准备",
    titleEn: "Choose your on-ground support",
    titleZh: "选择落地支持方案",
    descriptionEn: "Confirm the support services that match your needs. Before departure, receive your itinerary, pickup details, accommodation information and practical arrival guidance in one place.",
    descriptionZh: "根据需求确认所需的协助服务。出发前，你会收到行程、接机安排、住宿信息及实用抵达指南。",
    noteEn: "Your coordinator confirms what is included, what is optional and any separately payable costs before you travel.",
    noteZh: "出发前，协调员会说明包含服务、可选服务及需要另行支付的费用。",
    icon: Route,
    image: serviceHotelBooking,
  },
  {
    number: "04",
    eyebrowEn: "Clinic & recovery",
    eyebrowZh: "就诊与恢复",
    titleEn: "Treatment with coordinated support",
    titleZh: "就诊及恢复期协调",
    descriptionEn: "For included clinic visits, a bilingual coordinator can support communication between you and the treating team. We also help coordinate practical next steps during your scheduled support period.",
    descriptionZh: "在套餐包含的诊所行程中，双语协调员可协助你与医疗团队沟通，并在约定的服务时段内协调实际后续安排。",
    noteEn: "Medical decisions remain with your licensed treating clinician. Concierge support is available during the hours shown in your selected package.",
    noteZh: "医疗决定由持证接诊医生负责；在线管家支持时间以所选套餐说明为准。",
    icon: HeartPulse,
    image: serviceClinicTranslation,
  },
  {
    number: "05",
    eyebrowEn: "Optional China itinerary",
    eyebrowZh: "可选中国行程",
    titleEn: "Recover—and explore when ready",
    titleZh: "安心恢复，状态允许时探索中国",
    descriptionEn: "If your clinician agrees that you are ready to travel, we can connect you with trusted travel providers or help shape a personalized itinerary around your recovery needs.",
    descriptionZh: "如医生确认身体状态适合出行，我们可以为你对接可信赖的旅行服务商，或根据恢复需求协助规划个性化行程。",
    noteEn: "Touring is optional and should never replace clinical recovery instructions.",
    noteZh: "旅游完全自愿，并应始终以医生的恢复指导为优先。",
    icon: Map,
    image: cityHangzhou,
  },
  {
    number: "06",
    eyebrowEn: "After you return home",
    eyebrowZh: "回国后的联系",
    titleEn: "Post-treatment follow-up",
    titleZh: "术后随访协调",
    descriptionEn: "Stay connected through WhatsApp, WeChat or email after returning home. When your doctor recommends a follow-up, we help coordinate the remote appointment and translation.",
    descriptionZh: "回国后可继续通过 WhatsApp、微信或电子邮件保持联系。如医生建议复诊，我们会协助协调远程随访及翻译。",
    noteEn: "Know someone planning care in China? Ask our team whether a current referral benefit is available.",
    noteZh: "身边有人计划来中国就医？可以联系我们了解当前是否有推荐奖励。",
    icon: MessageCircle,
    image: serviceOnlineConcierge,
  },
] as const;

// Keep the sales section easy to restore after the temporary pause.
const SHOW_PACKAGE_SALES = false;

const JOURNEY_RU = [
  ["Онлайн-консультация", "Запишитесь на медицинскую консультацию", "Выберите врача или клинику в Китае либо отправьте медицинские документы, чтобы мы помогли подобрать подходящего специалиста. План может включать предварительный разбор документов, 40-минутную видеоконсультацию, перевод и письменное резюме.", ""],
  ["Перелёт и документы", "Организуйте поездку и визу", "После подтверждения приёма мы поможем подготовить детали прибытия и необходимые документы. Для подходящих записей в партнёрские клиники может быть доступен трансфер из аэропорта и помощь после прилёта.", "Если требуется виза, мы можем помочь оформить медицинское приглашение. Сообщите подтверждённые данные рейса минимум за пять дней до прибытия."],
  ["До вылета", "Выберите поддержку на месте", "Выберите объём сопровождения в соответствии с вашими потребностями. До вылета вы получите подтверждённый маршрут, данные трансфера, информацию об отеле и практические инструкции.", "Координатор заранее подтвердит, что включено, что доступно дополнительно и какие расходы оплачиваются отдельно."],
  ["Клиника и восстановление", "Лечение с координационной поддержкой", "Во время включённых визитов двуязычный координатор помогает общаться с лечащей командой и организовать практические следующие шаги.", "Медицинские решения принимает лицензированный лечащий врач. Поддержка доступна в часы, указанные в выбранном плане."],
  ["Дополнительная поездка", "Восстанавливайтесь и путешествуйте, когда будете готовы", "Если врач разрешит поездки, мы можем познакомить вас с проверенными туристическими партнёрами или помочь составить маршрут с учётом восстановления.", "Экскурсии необязательны и не заменяют рекомендации врача по восстановлению."],
  ["После возвращения", "Последующее сопровождение", "После возвращения домой оставайтесь на связи через WhatsApp, WeChat или электронную почту. При необходимости мы поможем организовать дистанционную консультацию и перевод.", "Знаете человека, который планирует лечение в Китае? Спросите нашу команду о действующей реферальной программе."],
] as const;

const SERVICES_RU = [
  ["Трансфер из аэропорта", "Мы заранее уточняем данные прибытия и организуем прямой трансфер между аэропортом и подтверждённым отелем или клиникой.", "Данные прибытия подтверждаются до поездки"],
  ["Отель рядом с клиникой", "Сообщите даты, бюджет и требования к восстановлению. Мы предложим подходящие варианты и поможем согласовать бронирование.", "Варианты подбираются под маршрут и бюджет"],
  ["Перевод в клинике", "Двуязычный координатор помогает общаться во время запланированных визитов, включая вопросы врачу, инструкции по уходу и следующие шаги.", "Понятное общение во время визитов"],
  ["Перевод и подготовка медицинских документов", "Мы систематизируем предоставленные документы и переводим важную информацию в удобный для клиники файл.", "Документы подготовлены для медицинского рассмотрения"],
  ["Ежедневная онлайн-поддержка", "В течение семи дней можно связаться с координатором через WeChat, WhatsApp или сообщения с 10:00 до 22:00 по пекинскому времени.", "10:00–22:00 по пекинскому времени · 7 дней"],
] as const;

const Packages = () => {
  const { lang } = useAsia();
  const c = <T,>(en: T, zh: T, ru: T) => asiaCopy(lang, { en, zh, ru });
  return (
    <>
      <PageMeta
        title="China Medical Travel Support | Cosmetics Asia"
        description="Plan care in China with coordinated airport pickup, clinic translation, accommodation guidance and recovery support for international patients."
        path="/travel-packages"
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />

      {/* Hero */}
      <section className="container py-9 text-center md:py-16">
        <span className="pill bg-accent text-accent-foreground mb-3">
          <Sparkles className="size-3.5" />
          {c("Medical travel support", "中国医疗行程支持", "Поддержка медицинской поездки")}
        </span>
        <h1 className="mx-auto max-w-3xl font-display text-[2.15rem] font-medium leading-[1.04] tracking-tight sm:text-4xl md:text-5xl">
          {lang === "zh" ? (
            <>安心安排你的<em className="text-primary not-italic">中国就医之旅</em></>
          ) : lang === "ru" ? (
            <>Поддержка вашей <em className="text-primary not-italic">поездки на лечение в Китай</em></>
          ) : (
            <>Support for your <em className="text-primary not-italic">care journey in China</em></>
          )}
        </h1>
      </section>

      {/* Packages grid */}
      <section className="container pb-16 md:pb-20">
        {SHOW_PACKAGE_SALES && (
          <>
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">{lang === "zh" ? "三档套餐，一眼看懂区别" : "Compare the three options at a glance"}</p>
          <span className="hidden text-xs text-muted-foreground sm:inline">{lang === "zh" ? "点击可跳转到套餐" : "Select to jump to details"}</span>
        </div>
        <nav className="-mx-4 mb-7 flex snap-x gap-3 overflow-x-auto px-4 pb-3 scrollbar-hide md:mx-0 md:grid md:grid-cols-3 md:px-0" aria-label={lang === "zh" ? "套餐快捷入口" : "Package shortcuts"}>
          {PACKAGES.map((p, index) => (
            <a key={p.id} href={`#package-${p.id}`} className={`min-w-[82vw] snap-start rounded-2xl bg-gradient-to-br ${p.grad} p-[1px] shadow-soft transition hover:-translate-y-1 hover:shadow-pop sm:min-w-[17rem] md:min-w-0`}>
              <span className="flex h-full min-h-[7.5rem] flex-col rounded-[15px] bg-card/90 px-5 py-4 backdrop-blur">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{lang === "zh" ? p.nameZh : p.nameEn}</span>
                  <span className="font-display text-2xl font-semibold text-primary">${p.price.toLocaleString()}</span>
                </span>
                <strong className="mt-3 text-base leading-snug text-foreground">{lang === "zh" ? PACKAGE_SNAPSHOTS[index].zh : PACKAGE_SNAPSHOTS[index].en}</strong>
                <span className="mt-1 text-xs text-muted-foreground">{lang === "zh" ? PACKAGE_SNAPSHOTS[index].detailZh : PACKAGE_SNAPSHOTS[index].detailEn}</span>
              </span>
            </a>
          ))}
        </nav>
        <div className="mx-auto mb-10 flex max-w-4xl items-start gap-3 rounded-2xl border border-border/70 bg-secondary/45 px-5 py-4 shadow-soft">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-card text-primary shadow-soft"><FileText className="size-4" /></div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {lang === "zh" ? "需要签证函？我们可以协助办理" : "Need a visa letter? We can help"}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {lang === "zh"
              ? "医疗邀请函为可选服务；如你的签证申请需要，我们可以协助准备。"
              : "A Medical Invitation Letter is optional. If your visa application requires one, we can help arrange it."}
            </p>
          </div>
        </div>
        <div className="grid items-stretch gap-4 md:grid-cols-3 md:gap-6">
          {PACKAGES.map((p) => {
            const Icon = p.icon;
            return (
              <div
                id={`package-${p.id}`}
                key={p.id}
                className={`relative scroll-mt-20 rounded-3xl bg-gradient-to-br ${p.grad} p-1 ${
                  p.highlight ? "shadow-pop md:-translate-y-3" : "shadow-soft"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 text-[11px] px-3 py-1 rounded-full bg-foreground text-background font-semibold uppercase tracking-wider whitespace-nowrap">
                    {lang === "zh" ? "最受欢迎" : "Most popular"}
                  </span>
                )}
                <div className="flex h-full flex-col rounded-[22px] bg-card p-5 md:p-7">
                  <div className="-mx-2 -mt-2 rounded-2xl border border-border/40 bg-secondary/45 p-4">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-2xl bg-accent grid place-items-center">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-display text-xl font-medium leading-tight tracking-tight">
                        {lang === "zh" ? p.nameZh : p.nameEn}
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground mt-0.5">
                        {lang === "zh" ? p.taglineZh : p.taglineEn}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    {p.originalPrice && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-muted-foreground line-through">
                          ${p.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                          {lang === "zh" ? `立省 $${(p.originalPrice - p.price).toLocaleString()}` : `Save $${(p.originalPrice - p.price).toLocaleString()}`}
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-5xl font-medium tracking-tight">
                        ${p.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {lang === "zh" ? "/ 次行程 · 美元" : "/ trip · USD"}
                      </span>
                    </div>
                  </div>
                  </div>

                  <div className="mt-6 flex-1">
                    {p.includesEn && (
                      <p className="mb-4 rounded-2xl border border-border/40 bg-accent/55 px-4 py-3 text-sm font-semibold text-foreground">
                        {lang === "zh" ? p.includesZh : p.includesEn}
                      </p>
                    )}
                    <ul className="space-y-3">
                    {p.features.map((f) => (
                      <li key={f.en} className="flex items-start gap-2.5 text-sm leading-relaxed md:text-[15px]">
                        <span
                          className={`mt-0.5 size-4 rounded-full grid place-items-center shrink-0 ${
                            f.bold ? "bg-primary text-primary-foreground" : "bg-accent text-primary"
                          }`}
                        >
                          <Check className="size-2.5" strokeWidth={3} />
                        </span>
                        <span>
                          <span className={f.bold ? "font-semibold text-foreground" : "text-foreground/80"}>
                            {lang === "zh" ? f.zh : f.en}
                          </span>
                          {(lang === "zh" ? f.noteZh : f.noteEn) && (
                            <span className="mt-1 block text-[13px] leading-relaxed text-muted-foreground">
                              {lang === "zh" ? f.noteZh : f.noteEn}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                    </ul>
                  </div>

                  <Link
                    to="/doctors"
                    className={`mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-center text-sm font-semibold transition sm:rounded-full ${
                      p.highlight
                        ? "bg-foreground text-background hover:bg-foreground/90"
                        : "bg-accent text-foreground hover:bg-accent/80"
                    }`}
                  >
                    {p.price === 0
                      ? (lang === "zh" ? "选择免费支持套餐" : "Choose the Free Support Package")
                      : (lang === "zh" ? "联系行程支持" : "Request travel support")}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notes */}
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {[
            {
              titleEn: "Clear hospital pricing",
              titleZh: "医院收费透明",
              en: "Surgery fees not included — paid directly to the hospital with full price transparency.",
              zh: "手术费另计，直接支付给医院，价格全透明。",
            },
            {
              titleEn: "Plans can be customized",
              titleZh: "套餐支持定制",
              en: "Custom packages available — extend stay, add family travel, or upgrade hotel anytime.",
              zh: "支持自定义套餐：延长住宿 / 家属同行 / 升级酒店均可定制。",
            },
            {
              titleEn: "Flexible cancellation",
              titleZh: "灵活取消与延期",
              en: "Free cancellation when requested at least 20 days before your scheduled arrival. If your trip is postponed, your package and deposit remain valid for 18 months. The deposit is refunded after you arrive at the clinic.",
              zh: "在计划抵达日前至少 20 天提出申请可免费取消。如行程延期，已购买的套餐和押金均可保留 18 个月；抵达诊所后退还押金。",
            },
          ].map((n) => (
            <div key={n.en} className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary shrink-0" />
                <p className="text-sm font-semibold text-foreground">{lang === "zh" ? n.titleZh : n.titleEn}</p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{lang === "zh" ? n.zh : n.en}</p>
            </div>
          ))}
        </div>
          </>
        )}

        <section className="mt-16 md:mt-24" aria-labelledby="medical-journey-title">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="pill mb-3 bg-accent text-accent-foreground">
                <Route className="size-3.5" />
                {c("Your journey, step by step", "从咨询到回国随访", "Ваш путь — шаг за шагом")}
              </span>
              <h2 id="medical-journey-title" className="max-w-3xl font-display text-3xl font-medium leading-tight tracking-tight md:text-5xl">
                {lang === "zh" ? (
                  <>六个步骤，<em className="not-italic text-primary">安心完成中国医疗行程</em></>
                ) : lang === "ru" ? (
                  <>Шесть понятных этапов, <em className="not-italic text-primary">одна согласованная поездка</em></>
                ) : (
                  <>Six clear steps, <em className="not-italic text-primary">one coordinated journey</em></>
                )}
              </h2>
            </div>
            <a href="https://wa.me/14708613825?text=Hi%20Cosmetics%20Asia%2C%20I%20would%20like%20help%20planning%20my%20medical%20journey%20to%20China." target="_blank" rel="noreferrer" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:bg-primary/90">
              {c("Start planning your journey", "开始规划行程", "Начать планирование")}
              <ArrowRight className="size-4" />
            </a>
          </div>

          <div className="relative mt-9 grid gap-4 md:grid-cols-2 md:gap-6">
            <div className="absolute bottom-10 left-1/2 top-10 hidden w-px -translate-x-1/2 bg-primary/15 md:block" aria-hidden="true" />
            {JOURNEY_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.number} className="group relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-pop sm:p-6 md:p-7">
                  <div className="relative -mx-5 -mt-5 mb-5 aspect-[16/6] overflow-hidden bg-muted sm:-mx-6 sm:-mt-6 md:-mx-7 md:-mt-7">
                    <img
                      src={step.image}
                      alt={lang === "zh" ? step.titleZh : lang === "ru" ? JOURNEY_RU[index][1] : step.titleEn}
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-4 rounded-full border border-white/50 bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-foreground shadow-soft backdrop-blur-md sm:left-5">
                      {c(`Step ${index + 1}`, `第 ${index + 1} 步`, `Этап ${index + 1}`)}
                    </span>
                  </div>
                  <div className="pointer-events-none absolute -right-5 -top-8 font-display text-[7rem] font-semibold leading-none text-primary/[0.055] transition group-hover:text-primary/[0.09]" aria-hidden="true">
                    {step.number}
                  </div>
                  <div className="relative flex items-start gap-4">
                    <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,hsl(158_55%_91%),hsl(340_65%_94%))] text-primary shadow-soft">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                          {c(`Step ${index + 1}`, `第 ${index + 1} 步`, `Этап ${index + 1}`)}
                        </span>
                        <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-foreground/75">
                          {lang === "zh" ? step.eyebrowZh : lang === "ru" ? JOURNEY_RU[index][0] : step.eyebrowEn}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
                        {lang === "zh" ? step.titleZh : lang === "ru" ? JOURNEY_RU[index][1] : step.titleEn}
                      </h3>
                    </div>
                  </div>
                  <p className="relative mt-4 text-sm leading-7 text-foreground/75">
                    {lang === "zh" ? step.descriptionZh : lang === "ru" ? JOURNEY_RU[index][2] : step.descriptionEn}
                  </p>
                  {(lang === "zh" ? step.noteZh : lang === "ru" ? JOURNEY_RU[index][3] : step.noteEn) && (
                    <div className="relative mt-4 flex items-start gap-2 rounded-2xl bg-secondary/55 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      <span>{lang === "zh" ? step.noteZh : lang === "ru" ? JOURNEY_RU[index][3] : step.noteEn}</span>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-16 overflow-hidden rounded-[2rem] border border-primary/15 bg-card shadow-pop md:mt-20" aria-labelledby="included-services-title">
          <div className="bg-[linear-gradient(120deg,hsl(190_75%_91%),hsl(155_52%_89%)_55%,hsl(48_85%_92%))] px-6 pb-20 pt-8 md:px-10 md:pb-24 md:pt-10">
            <span className="pill mb-3 bg-white/80 text-foreground shadow-soft backdrop-blur">
              <ShieldCheck className="size-3.5 text-primary" />
              {c("Our support services", "我们的协助服务", "Наша помощь")}
            </span>
            <h2 id="included-services-title" className="max-w-2xl font-display text-3xl font-medium tracking-tight md:text-4xl">
              {c("Practical support for", "抵达中国以后，", "Практическая поддержка")}{" "}
              <em className="not-italic text-primary">{c("your time in China", "我们提供这些协助服务", "во время поездки в Китай")}</em>
            </h2>
          </div>

          <div className="relative -mt-12 grid gap-x-8 gap-y-1 rounded-t-[2rem] bg-card px-4 pb-5 pt-4 sm:px-6 md:mx-8 md:grid-cols-2 md:px-5 md:pb-7 md:pt-5">
            {SERVICE_DETAILS.map((service, index) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.titleEn}
                    className={`group grid grid-cols-1 gap-3 border-b border-border/70 py-5 min-[430px]:grid-cols-[8rem_minmax(0,1fr)] min-[430px]:gap-4 sm:grid-cols-[9rem_minmax(0,1fr)] ${index === SERVICE_DETAILS.length - 1 ? "md:col-span-2 md:mx-auto md:w-[calc(50%-1rem)]" : ""}`}
                >
                  <div className="relative aspect-[16/8] overflow-hidden rounded-2xl bg-muted min-[430px]:aspect-[4/3]">
                    <img
                      src={service.image}
                      alt={lang === "zh" ? service.titleZh : lang === "ru" ? SERVICES_RU[index][0] : service.titleEn}
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <span className="absolute left-2 top-2 grid size-8 place-items-center rounded-xl bg-white/90 text-primary shadow-soft backdrop-blur">
                      <Icon className="size-4" />
                    </span>
                  </div>
                  <div className="min-w-0 py-0.5">
                    <h3 className="font-display text-lg font-semibold leading-tight tracking-tight md:text-xl">
                      {lang === "zh" ? service.titleZh : lang === "ru" ? SERVICES_RU[index][0] : service.titleEn}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground md:text-[13px]">
                      {lang === "zh" ? service.descriptionZh : lang === "ru" ? SERVICES_RU[index][1] : service.descriptionEn}
                    </p>
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold leading-snug text-foreground/75">
                      <Check className="size-3.5 shrink-0 text-primary" />
                      {lang === "zh" ? service.noteZh : lang === "ru" ? SERVICES_RU[index][2] : service.noteEn}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </section>

        <Footer />
      </div>
    </>
  );
};

export default Packages;

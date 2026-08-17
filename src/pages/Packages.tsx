import { Link } from "react-router-dom";
import { Check, Sparkles, Crown, Gem, ArrowRight, ShieldCheck, Plane, Hotel, Languages, Files, Headphones, FileText } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { useAsia } from "@/lib/asia-i18n";
import serviceAirportPickup from "@/assets/service-airport-pickup.jpg";
import serviceHotelBooking from "@/assets/service-hotel-booking.jpg";
import serviceClinicTranslation from "@/assets/service-clinic-translation.jpg";
import serviceMedicalRecords from "@/assets/service-medical-records.jpg";
import serviceOnlineConcierge from "@/assets/service-online-concierge.jpg";

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

const Packages = () => {
  const { lang } = useAsia();
  return (
    <>
      <PageMeta
        title="China Medical Travel Packages | Cosmetics Asia"
        description="Choose a China medical travel package with visa support, airport transfers, translation, accommodation, and recovery assistance for international patients."
        path="/travel-packages"
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />

      {/* Hero */}
      <section className="container py-9 text-center md:py-16">
        <span className="pill bg-accent text-accent-foreground mb-3">
          <Sparkles className="size-3.5" />
          {lang === "zh" ? "全程旅行支持" : "Travel care, simplified"}
        </span>
        <h1 className="mx-auto max-w-3xl font-display text-[2.15rem] font-medium leading-[1.04] tracking-tight sm:text-4xl md:text-5xl">
          {lang === "zh" ? (
            <>选择适合你的<em className="text-primary not-italic">旅行套餐</em></>
          ) : (
            <>Choose your <em className="text-primary not-italic">travel package</em></>
          )}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          {lang === "zh" ? "签证函 / 机场接送 / 中英文翻译 / 酒店住宿 / 术后陪同，打包成三档旅行套餐，让你专注恢复。" : "Visa support, airport transfers, translation, accommodation and recovery assistance — three travel tiers designed so you can focus on healing."}
        </p>
      </section>

      {/* Packages grid */}
      <section className="container pb-16 md:pb-20">
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
                      : (lang === "zh" ? "预订旅行套餐" : "Book this travel package")}
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

        <section className="mt-16 overflow-hidden rounded-[2rem] border border-primary/15 bg-card shadow-pop md:mt-20" aria-labelledby="included-services-title">
          <div className="bg-[linear-gradient(120deg,hsl(190_75%_91%),hsl(155_52%_89%)_55%,hsl(48_85%_92%))] px-6 pb-20 pt-8 md:px-10 md:pb-24 md:pt-10">
            <span className="pill mb-3 bg-white/80 text-foreground shadow-soft backdrop-blur">
              <ShieldCheck className="size-3.5 text-primary" />
              {lang === "zh" ? "基础服务说明" : "What’s included"}
            </span>
            <h2 id="included-services-title" className="max-w-2xl font-display text-3xl font-medium tracking-tight md:text-4xl">
              {lang === "zh" ? "抵达中国以后，" : "Travel support that stays"}{" "}
              <em className="not-italic text-primary">{lang === "zh" ? "每一步都有人协助" : "with you at every step"}</em>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/65 md:text-base">
              {lang === "zh"
                ? "从机场接送到诊所沟通，我们提前说明服务内容、使用方式和边界，让你安心安排中国医疗行程。"
                : "From airport arrival to clinic communication, each service is coordinated around your confirmed itinerary—with clear scope and no hidden assumptions."}
            </p>
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
                      alt={lang === "zh" ? service.titleZh : service.titleEn}
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <span className="absolute left-2 top-2 grid size-8 place-items-center rounded-xl bg-white/90 text-primary shadow-soft backdrop-blur">
                      <Icon className="size-4" />
                    </span>
                  </div>
                  <div className="min-w-0 py-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-0.5 font-display text-lg font-semibold leading-tight tracking-tight md:text-xl">
                      {lang === "zh" ? service.titleZh : service.titleEn}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground md:text-[13px]">
                      {lang === "zh" ? service.descriptionZh : service.descriptionEn}
                    </p>
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold leading-snug text-foreground/75">
                      <Check className="size-3.5 shrink-0 text-primary" />
                      {lang === "zh" ? service.noteZh : service.noteEn}
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

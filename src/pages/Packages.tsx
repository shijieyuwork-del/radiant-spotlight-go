import { Link } from "react-router-dom";
import { Check, Sparkles, Crown, Gem, ArrowRight, ShieldCheck } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { useAsia } from "@/lib/asia-i18n";

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
    grad: "from-[hsl(190,70%,92%)] to-[hsl(155,60%,90%)]",
    features: [
      { en: "Airport Pickup & Drop-off", zh: "机场接送" },
      { en: "Hotel Booking Assistance", zh: "酒店预订协助" },
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
    grad: "from-[hsl(50,90%,90%)] to-[hsl(18,90%,88%)]",
    highlight: true,
    includesEn: "Everything in the Free Package, plus:",
    includesZh: "包含免费套餐的全部服务，另加：",
    features: [
      { en: "1-on-1 In-Hospital Accompaniment (3 Days)", zh: "1 对 1 院内陪同（3 天）", bold: true },
      { en: "7-Night Stay in a Comfortable 3-Star Hotel — Included", zh: "舒适三星级酒店 7 晚住宿 — 已含", bold: true },
      { en: "Extra Nights Available (+$45 / night · Up to 20 Days Total)", zh: "可额外加住（+45 美元/晚 · 最长 20 天）" },
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
    grad: "from-[hsl(280,60%,90%)] to-[hsl(340,85%,90%)]",
    includesEn: "Everything in Gold, with the following services upgraded:",
    includesZh: "包含金牌套餐的全部服务，以下项目升级为：",
    features: [
      { en: "Unlimited 1-on-1 In-Hospital Accompaniment — Replaces the 3-Day Limit", zh: "不限天数的 1 对 1 院内陪同 — 替代原 3 天限制", bold: true },
      { en: "1-on-1 Private Tour Guide in China with a Customized Itinerary (Up to 5 Days)", zh: "中国境内 1 对 1 私人导游及定制行程（最多 5 天）", bold: true },
      { en: "7-Night 5-Star Hotel Stay — Upgrade from the 3-Star Hotel", zh: "五星级酒店 7 晚住宿 — 由三星级酒店升级", bold: true },
      { en: "Additional Nights: $100 / Night (Up to 20 Days Total)", zh: "额外住宿：100 美元/晚（总行程最长 20 天）" },
    ],
  },
];

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
      <section className="container py-12 md:py-16 text-center">
        <span className="pill bg-accent text-accent-foreground mb-3">
          <Sparkles className="size-3.5" />
          {lang === "zh" ? "全程旅行支持" : "Travel care, simplified"}
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight max-w-3xl mx-auto">
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
        <div className="mx-auto mb-8 max-w-3xl rounded-2xl border border-border bg-card px-5 py-4 shadow-soft">
          <p className="text-sm font-semibold text-foreground">
            {lang === "zh" ? "可选签证支持：医疗邀请函" : "Optional Visa Support: Medical Invitation Letter"}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {lang === "zh"
              ? "仅在客户需要并申请医疗邀请函时收取 400 美元押金；抵达诊所后退还。"
              : "A $400 deposit is required only if you request a Medical Invitation Letter. The deposit is refunded when you arrive at the clinic."}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PACKAGES.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className={`relative rounded-3xl bg-gradient-to-br ${p.grad} p-1 ${
                  p.highlight ? "shadow-pop md:-translate-y-3" : "shadow-soft"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 text-[11px] px-3 py-1 rounded-full bg-foreground text-background font-semibold uppercase tracking-wider whitespace-nowrap">
                    {lang === "zh" ? "最受欢迎" : "Most popular"}
                  </span>
                )}
                <div className="rounded-[22px] bg-card h-full p-6 md:p-7 flex flex-col">
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

                  <div className="mt-6">
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

                  <div className="mt-6 flex-1">
                    {p.includesEn && (
                      <p className="mb-4 rounded-2xl bg-accent/70 px-4 py-3 text-sm font-semibold text-foreground">
                        {lang === "zh" ? p.includesZh : p.includesEn}
                      </p>
                    )}
                    <ul className="space-y-3">
                    {p.features.map((f) => (
                      <li key={f.en} className="flex gap-2.5 items-start text-[15px] leading-relaxed">
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
                    className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                      p.highlight
                        ? "bg-foreground text-background hover:bg-foreground/90"
                        : "bg-accent text-foreground hover:bg-accent/80"
                    }`}
                  >
                    {p.price === 0
                      ? (lang === "zh" ? "免费获取套餐" : "Get the free package")
                      : (lang === "zh" ? "预订旅行套餐" : "Book this travel package")}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notes */}
        <div className="mt-10 rounded-3xl bg-card shadow-soft p-6 md:p-7 grid md:grid-cols-3 gap-5 text-[15px] leading-relaxed">
          {[
            {
              en: "Surgery fees not included — paid directly to the hospital with full price transparency.",
              zh: "手术费另计，直接支付给医院，价格全透明。",
            },
            {
              en: "Custom packages available — extend stay, add family travel, or upgrade hotel anytime.",
              zh: "支持自定义套餐：延长住宿 / 家属同行 / 升级酒店均可定制。",
            },
            {
              en: "Free cancellation when requested at least 20 days before your scheduled arrival. If your trip is postponed, your package and invitation-letter deposit remain valid for 18 months. The deposit will be refunded when you arrive at the clinic.",
              zh: "在计划抵达日前至少 20 天提出申请可免费取消。如行程延期，已购买的套餐和邀请函押金均可保留 18 个月；抵达诊所后退还押金。",
            },
          ].map((n) => (
            <div key={n.en} className="flex gap-2 items-start">
              <ShieldCheck className="size-4 text-primary mt-0.5 shrink-0" />
              <p className="text-foreground/80">{lang === "zh" ? n.zh : n.en}</p>
            </div>
          ))}
        </div>
      </section>

        <Footer />
      </div>
    </>
  );
};

export default Packages;

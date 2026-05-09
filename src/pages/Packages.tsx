import { Link } from "react-router-dom";
import { Check, Sparkles, Crown, Gem, ArrowRight, ShieldCheck } from "lucide-react";
import CnNavbar from "@/components/CnNavbar";
import Footer from "@/components/Footer";
import { useCn } from "@/lib/cn-i18n";

type Pkg = {
  id: string;
  nameEn: string; nameZh: string;
  price: number;
  taglineEn: string; taglineZh: string;
  icon: React.ComponentType<{ className?: string }>;
  grad: string;
  highlight?: boolean;
  features: { en: string; zh: string; bold?: boolean }[];
};

const PACKAGES: Pkg[] = [
  {
    id: "basic",
    nameEn: "Basic Package", nameZh: "基础套餐",
    price: 399,
    taglineEn: "Essentials for a smooth medical trip",
    taglineZh: "出行必备 · 全程基础保障",
    icon: Sparkles,
    grad: "from-[hsl(190,70%,92%)] to-[hsl(155,60%,90%)]",
    features: [
      { en: "Medical Invitation Letter (For Visa Use)", zh: "医疗邀请函（用于签证）" },
      { en: "Priority Hospital Appointment Scheduling", zh: "医院优先排期预约" },
      { en: "Airport Pickup & Drop-off", zh: "机场接送" },
      { en: "Daily Online Concierge Support (10:00 AM – 6:00 PM, 7 Days · WeChat / WhatsApp / Message)", zh: "每日在线管家支持（10:00–18:00 · 7 天 · 微信 / WhatsApp / 短信）" },
      { en: "Professional Medical Records Translation & Organization", zh: "专业病历翻译与整理" },
      { en: "In-Hospital Medical Interpretation", zh: "院内医疗翻译陪同" },
      { en: "Hotel Booking Assistance", zh: "酒店预订协助" },
    ],
  },
  {
    id: "gold",
    nameEn: "Gold Package", nameZh: "金牌套餐",
    price: 599,
    taglineEn: "Most popular · stay + accompaniment included",
    taglineZh: "人气之选 · 含住宿与陪同",
    icon: Crown,
    grad: "from-[hsl(50,90%,90%)] to-[hsl(18,90%,88%)]",
    highlight: true,
    features: [
      { en: "Medical Invitation Letter (For Visa Use)", zh: "医疗邀请函（用于签证）" },
      { en: "Priority Hospital Appointment Scheduling", zh: "医院优先排期预约" },
      { en: "Airport Pickup & Drop-off", zh: "机场接送" },
      { en: "Daily Online Concierge Support (10:00 AM – 6:00 PM, 7 Days · WeChat / WhatsApp / Message)", zh: "每日在线管家支持（10:00–18:00 · 7 天 · 微信 / WhatsApp / 短信）" },
      { en: "Professional Medical Records Translation & Organization", zh: "专业病历翻译与整理" },
      { en: "In-Hospital Medical Interpretation", zh: "院内医疗翻译陪同" },
      { en: "Hotel Booking Assistance", zh: "酒店预订协助" },
      { en: "7-Night Stay in a Comfortable Hotel Near the Hospital — Included", zh: "医院附近舒适酒店 7 晚住宿 — 已含", bold: true },
      { en: "Extra Nights Available (+$30 / night · Up to 20 Days Total)", zh: "可额外加住（+30 美元/晚 · 最长 20 天）" },
      { en: "1-on-1 In-Hospital Accompaniment (3 Days)", zh: "1 对 1 院内陪同（3 天）", bold: true },
    ],
  },
  {
    id: "diamond",
    nameEn: "Diamond VIP Package", nameZh: "钻石尊享套餐",
    price: 2499,
    taglineEn: "End-to-end VIP · 5-star stay & doctor on call",
    taglineZh: "尊享一站式 · 五星酒店 + 在线医生随叫随到",
    icon: Gem,
    grad: "from-[hsl(280,60%,90%)] to-[hsl(340,85%,90%)]",
    features: [
      { en: "Medical Invitation Letter (For Visa Use)", zh: "医疗邀请函（用于签证）" },
      { en: "Priority Hospital Appointment Scheduling", zh: "医院优先排期预约" },
      { en: "Airport Pickup & Drop-off", zh: "机场接送" },
      { en: "Daily Online Concierge Support (10:00 AM – 6:00 PM, 7 Days · WeChat / WhatsApp / Message)", zh: "每日在线管家支持（10:00–18:00 · 7 天 · 微信 / WhatsApp / 短信）" },
      { en: "Professional Medical Records Translation & Organization", zh: "专业病历翻译与整理" },
      { en: "In-Hospital Medical Interpretation", zh: "院内医疗翻译陪同" },
      { en: "Hotel Booking Assistance", zh: "酒店预订协助" },
      { en: "7-Night Stay in a 5-Star Hotel Near the Hospital — Included", zh: "医院附近五星酒店 7 晚住宿 — 已含", bold: true },
      { en: "Extra Nights Available (+$100 / night · Up to 20 Days Total)", zh: "可额外加住（+100 美元/晚 · 最长 20 天）" },
      { en: "1-on-1 In-Hospital Accompaniment (Unlimited Days)", zh: "1 对 1 院内陪同（不限天数）", bold: true },
      { en: "1-on-1 Personal Assistance Outside the Hospital (Up to 3 Days)", zh: "1 对 1 院外私人助理（最多 3 天）", bold: true },
      { en: "1-on-1 Online Doctor Consultation (Daily 10:00 AM – 6:00 PM, Up to 7 Days · Response Within 30 Min)", zh: "1 对 1 在线医生咨询（每日 10:00–18:00 · 最多 7 天 · 30 分钟内回复）", bold: true },
    ],
  },
];

const Packages = () => {
  const { lang } = useCn();
  return (
    <div className="min-h-screen bg-background">
      <CnNavbar />

      {/* Hero */}
      <section className="container py-12 md:py-16 text-center">
        <span className="pill bg-accent text-accent-foreground mb-3">
          <ShieldCheck className="size-3.5" />
          {lang === "en" ? "Concierge packages" : "服务套餐"}
        </span>
        <h1 className="font-display text-4xl md:text-6xl font-medium tracking-tight max-w-3xl mx-auto">
          {lang === "en" ? (
            <>Choose your <em className="text-primary not-italic">care package</em></>
          ) : (
            <>选择适合你的<em className="text-primary not-italic">专属套餐</em></>
          )}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          {lang === "en"
            ? "Visa letter, airport pickup, hospital coordination, translation and recovery — packaged into three tiers so you can focus on healing."
            : "签证函 / 机场接送 / 医院对接 / 中英文翻译 / 术后陪同，打包成三档套餐，让你专注恢复。"}
        </p>
      </section>

      {/* Packages grid */}
      <section className="container pb-16 md:pb-20">
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
                    {lang === "en" ? "Most popular" : "最受欢迎"}
                  </span>
                )}
                <div className="rounded-[22px] bg-card h-full p-6 md:p-7 flex flex-col">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-2xl bg-accent grid place-items-center">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-display text-xl font-semibold leading-tight">
                        {lang === "en" ? p.nameEn : p.nameZh}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {lang === "en" ? p.taglineEn : p.taglineZh}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-display text-5xl font-semibold">
                      ${p.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {lang === "en" ? "/ trip · USD" : "/ 次行程 · 美元"}
                    </span>
                  </div>

                  <ul className="mt-6 space-y-3 flex-1">
                    {p.features.map((f) => (
                      <li key={f.en} className="flex gap-2.5 items-start text-sm leading-snug">
                        <span
                          className={`mt-0.5 size-4 rounded-full grid place-items-center shrink-0 ${
                            f.bold ? "bg-primary text-primary-foreground" : "bg-accent text-primary"
                          }`}
                        >
                          <Check className="size-2.5" strokeWidth={3} />
                        </span>
                        <span className={f.bold ? "font-semibold text-foreground" : "text-foreground/80"}>
                          {lang === "en" ? f.en : f.zh}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/doctors"
                    className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                      p.highlight
                        ? "bg-foreground text-background hover:bg-foreground/90"
                        : "bg-accent text-foreground hover:bg-accent/80"
                    }`}
                  >
                    {lang === "en" ? "Book this package" : "预订该套餐"}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notes */}
        <div className="mt-10 rounded-3xl bg-card shadow-soft p-6 md:p-7 grid md:grid-cols-3 gap-5 text-sm">
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
              en: "Free cancellation up to 14 days before arrival. Visa letter refundable within 7 days of issuance.",
              zh: "抵达前 14 天可免费取消，签证函开具后 7 天内可退。",
            },
          ].map((n) => (
            <div key={n.en} className="flex gap-2 items-start">
              <ShieldCheck className="size-4 text-primary mt-0.5 shrink-0" />
              <p className="text-foreground/80">{lang === "en" ? n.en : n.zh}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Packages;

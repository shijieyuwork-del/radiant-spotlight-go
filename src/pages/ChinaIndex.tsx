import { Link } from "react-router-dom";
import {
  Sparkles, ArrowRight, Star, MapPin, ShieldCheck, BadgeCheck,
  Search, Heart, MessageCircle, Stethoscope, FileCheck2, Building2,
  Flame, Gift, Wallet, Users, Plane,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import CnNavbar from "@/components/CnNavbar";
import TikTokWall from "@/components/TikTokWall";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { DOCTORS } from "@/data/doctors";
import { useCn } from "@/lib/cn-i18n";
import heroBg from "@/assets/hero-bg.jpg";
import v2 from "@/assets/video2.jpg";
import v3 from "@/assets/video3.jpg";
import v4 from "@/assets/video4.jpg";

// ============== Data (bilingual) ==============
const cities = [
  { zh: "上海", en: "Shanghai", clinics: 128, hot: { en: ["Facelift", "BBL", "Blepharoplasty"], zh: ["面部拉皮", "巴西提臀", "双眼皮/眼袋"] } },
  { zh: "北京", en: "Beijing", clinics: 142, hot: { en: ["Rhinoplasty", "Breast Lift", "Facelift"], zh: ["鼻综合", "提胸", "面部拉皮"] } },
  { zh: "成都", en: "Chengdu", clinics: 96, hot: { en: ["Body Contouring", "Facelift", "Blepharoplasty"], zh: ["全身体形雕塑", "面部拉皮", "双眼皮/眼袋"] } },
  { zh: "杭州", en: "Hangzhou", clinics: 71, hot: { en: ["Facial Fat Grafting", "Neck Lift", "Rhinoplasty"], zh: ["面部脂肪填充", "颈部提升", "鼻综合"] } },
  { zh: "广州", en: "Guangzhou", clinics: 88, hot: { en: ["Liposuction", "Breast Augmentation", "Tummy Tuck"], zh: ["吸脂塑形", "隆胸", "腹壁整形"] } },
  { zh: "深圳", en: "Shenzhen", clinics: 79, hot: { en: ["Tummy Tuck", "Facelift", "Rhinoplasty"], zh: ["腹壁整形", "面部拉皮", "鼻综合"] } },
];

type Treatment = {
  zh: string; en: string; emoji: string; from: number; orig?: number;
  groupPrice?: number; tag?: { en: string; zh: string }; grad: string;
};
const treatments: Treatment[] = [
  { zh: "鼻综合", en: "Rhinoplasty", emoji: "👃", from: 18800, orig: 28000, groupPrice: 15800, tag: { en: "TOP 1", zh: "热度TOP1" }, grad: "from-[hsl(340,85%,88%)] to-[hsl(18,90%,88%)]" },
  { zh: "面部拉皮 (SMAS)", en: "Facelift (SMAS)", emoji: "✨", from: 88000, orig: 128000, groupPrice: 78000, tag: { en: "Signature", zh: "招牌项目" }, grad: "from-[hsl(190,70%,88%)] to-[hsl(155,70%,88%)]" },
  { zh: "颈部提升", en: "Neck Lift", emoji: "🦢", from: 68000, orig: 88000, tag: { en: "Pairs with facelift", zh: "搭配拉皮" }, grad: "from-[hsl(155,60%,80%)] to-[hsl(190,70%,88%)]" },
  { zh: "双眼皮 / 眼袋", en: "Blepharoplasty (upper + lower)", emoji: "👁️", from: 12800, orig: 19800, groupPrice: 11800, tag: { en: "New patient", zh: "新人专享" }, grad: "from-[hsl(50,80%,90%)] to-[hsl(340,85%,90%)]" },
  { zh: "面部脂肪填充", en: "Facial Fat Grafting", emoji: "🪞", from: 26800, orig: 38000, groupPrice: 24800, tag: { en: "Recommended", zh: "推荐" }, grad: "from-[hsl(340,85%,90%)] to-[hsl(155,60%,85%)]" },
  { zh: "吸脂塑形", en: "Liposuction", emoji: "⚡", from: 32000, orig: 48000, groupPrice: 28000, tag: { en: "Sculpt", zh: "塑形" }, grad: "from-[hsl(155,60%,85%)] to-[hsl(190,70%,88%)]" },
  { zh: "腹壁整形 (Tummy Tuck)", en: "Tummy Tuck / Mommy Makeover", emoji: "🤰", from: 78000, orig: 108000, tag: { en: "Mommy makeover", zh: "产后修复" }, grad: "from-[hsl(18,90%,88%)] to-[hsl(50,80%,90%)]" },
  { zh: "巴西提臀 (BBL)", en: "Brazilian Butt Lift (BBL)", emoji: "🍑", from: 96000, orig: 138000, tag: { en: "Hot", zh: "热门" }, grad: "from-[hsl(340,85%,88%)] to-[hsl(18,90%,88%)]" },
  { zh: "隆胸 (Motiva)", en: "Breast Augmentation (Motiva)", emoji: "💗", from: 88000, orig: 128000, groupPrice: 82000, tag: { en: "Authentic implants", zh: "正品假体" }, grad: "from-[hsl(340,85%,90%)] to-[hsl(190,70%,88%)]" },
  { zh: "提胸 (Mastopexy)", en: "Breast Lift (Mastopexy)", emoji: "🌷", from: 72000, orig: 98000, grad: "from-[hsl(155,70%,88%)] to-[hsl(50,80%,90%)]" },
  { zh: "全身体形雕塑", en: "Full Body Contouring", emoji: "🧬", from: 128000, orig: 168000, tag: { en: "Premier", zh: "高端" }, grad: "from-[hsl(190,70%,88%)] to-[hsl(340,85%,90%)]" },
];

// Clinics data removed — patients select by doctor, not by clinic.

// Doctors data lives in src/data/doctors.ts (used by both home + /doctors detail).
// TikTok cases live in src/data/tiktokCases.ts.

// ============== Sections ==============
const Hero = () => {
  const { t, lang, fmt } = useCn();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <img src={heroBg} alt="" className="absolute inset-0 size-full object-cover opacity-40 mix-blend-multiply" />
      <div className="absolute -top-20 -left-10 size-72 bg-gradient-mint blur-3xl opacity-60 animate-blob" />
      <div className="absolute top-40 right-0 size-80 bg-gradient-peach blur-3xl opacity-50 animate-blob" style={{ animationDelay: "2s" }} />

      <div className="container relative py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="pill bg-card/80 backdrop-blur shadow-soft">
              <ShieldCheck className="size-3.5 text-primary" />
              {t("hero.badge")}
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-medium leading-[0.95] tracking-tight">
              {t("hero.title1")}<br />
              <em className="text-primary not-italic">{t("hero.titleEm")}</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">{t("hero.subtitle")}</p>

            <div className="bg-card rounded-3xl p-2 shadow-pop flex flex-col sm:flex-row gap-2 max-w-2xl">
              <div className="flex-1 px-5 py-3 flex items-center gap-3">
                <Search className="size-4 text-muted-foreground shrink-0" />
                <input className="w-full bg-transparent outline-none text-sm font-medium" placeholder={t("hero.searchPh")} />
              </div>
              <Button size="lg" className="rounded-2xl bg-foreground text-background hover:bg-foreground/90 h-auto px-6">
                {t("hero.cta")} <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mr-1">{t("hero.hot")}</span>
              {(lang === "zh" ? ["鼻综合", "面部拉皮", "双眼皮/眼袋", "吸脂", "腹壁整形", "巴西提臀", "隆胸", "脂肪填充"] : ["Rhinoplasty", "Facelift", "Blepharoplasty", "Liposuction", "Tummy Tuck", "BBL", "Breast Aug", "Fat Grafting"]).map((p) => (
                <span key={p} className="pill bg-card/80 backdrop-blur shadow-soft text-foreground">
                  <Flame className="size-3 text-primary" /> {p}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><FileCheck2 className="size-4 text-primary" /> {t("hero.feat1")}</span>
              <span className="flex items-center gap-1.5"><Building2 className="size-4 text-primary" /> {t("hero.feat2")}</span>
              <span className="flex items-center gap-1.5"><Wallet className="size-4 text-primary" /> {t("hero.feat3")}</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[560px] hidden lg:block">
            {[
              { src: "/videos/v4.mp4", poster: v4, cls: "top-0 left-2 w-44 h-72", delay: "0s",   tagEn: "Double eyelid",  tagZh: "双眼皮", who: "@MinShanghai" },
              { src: "/videos/v2.mp4", poster: v2, cls: "top-10 right-0 w-52 h-80", delay: "1s", tagEn: "Rhinoplasty",     tagZh: "鼻综合",  who: "@Rosie" },
              { src: "/videos/v3.mp4", poster: v3, cls: "bottom-16 left-24 w-48 h-72", delay: "2s", tagEn: "SMAS Facelift", tagZh: "拉皮提升", who: "@JiaChengdu" },
            ].map((v) => (
              <Link
                key={v.src}
                to="/cases"
                className={`absolute ${v.cls} animate-float rounded-3xl overflow-hidden shadow-pop group block`}
                style={{ animationDelay: v.delay }}
              >
                <video
                  src={v.src}
                  poster={v.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-[11px] font-semibold text-white">{v.who}</p>
                  <p className="text-[10px] text-white/80">{lang === "zh" ? v.tagZh : v.tagEn}</p>
                </div>
              </Link>
            ))}

            <Link
              to="/cases"
              className="absolute -bottom-2 right-0 bg-card rounded-2xl shadow-pop p-3 pr-4 flex items-center gap-2 hover:shadow-glow transition group"
            >
              <div className="size-9 rounded-xl bg-primary grid place-items-center shrink-0">
                <ArrowRight className="size-4 text-primary-foreground group-hover:translate-x-0.5 transition" />
              </div>
              <div>
                <p className="text-xs font-display font-semibold leading-tight">
                  {lang === "zh" ? "查看更多真实案例视频" : "More real-case videos"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {lang === "zh" ? "点击进入案例视频墙" : "Tap to open the case wall"}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const ComplianceBar = () => {
  const { t } = useCn();
  const items = [
    { icon: FileCheck2, t: t("compliance.t1"), d: t("compliance.d1") },
    { icon: Stethoscope, t: t("compliance.t2"), d: t("compliance.d2") },
    { icon: ShieldCheck, t: t("compliance.t3"), d: t("compliance.d3") },
    { icon: Wallet, t: t("compliance.t4"), d: t("compliance.d4") },
  ];
  return (
    <section className="container -mt-2 md:-mt-4 relative z-10">
      <div className="rounded-3xl bg-card shadow-pop border border-border p-5 md:p-6 grid md:grid-cols-4 gap-4">
        {items.map((x) => (
          <div key={x.t} className="flex gap-3 items-start">
            <div className="size-10 rounded-2xl bg-accent grid place-items-center shrink-0">
              <x.icon className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-display font-semibold text-sm">{x.t}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{x.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const TravelBar = () => {
  const { lang } = useCn();
  if (lang !== "en") return null;
  return (
    <section className="container py-6">
      <div className="rounded-3xl bg-gradient-to-r from-[hsl(190,70%,92%)] via-[hsl(155,60%,90%)] to-[hsl(50,80%,92%)] p-6 md:p-7 grid md:grid-cols-4 gap-4 items-center shadow-soft">
        {[
          { icon: Plane, t: "Medical visa support", d: "Invitation letter & visa filing assistance" },
          { icon: Users, t: "English coordinator", d: "From landing to follow-up · WhatsApp 24/7" },
          { icon: MapPin, t: "Airport pickup & hotel", d: "Recovery hotels next to top clinics" },
          { icon: ShieldCheck, t: "Up to 70% savings", d: "vs. comparable US clinics · same authentic products" },
        ].map((x) => (
          <div key={x.t} className="flex gap-3 items-start">
            <div className="size-10 rounded-2xl bg-card grid place-items-center shrink-0">
              <x.icon className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-display font-semibold text-sm">{x.t}</p>
              <p className="text-xs text-foreground/70 mt-0.5">{x.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const CitiesSection = () => {
  const { t, lang } = useCn();
  return (
    <section id="cities" className="container py-16 md:py-20">
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          <span className="pill bg-accent text-accent-foreground mb-3"><MapPin className="size-3.5" /> {t("cities.kicker")}</span>
          <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            {t("cities.title1")} <em className="text-primary not-italic">{t("cities.titleEm")}</em>
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cities.map((c) => (
          <Link key={c.en} to={`/cities/${c.en.toLowerCase()}`} className="rounded-3xl bg-card shadow-soft hover:shadow-pop transition-all hover:-translate-y-1 p-5 group">
            <p className="font-display text-2xl font-semibold">{lang === "zh" ? c.zh : c.en}</p>
            <p className="text-xs text-muted-foreground">{lang === "zh" ? c.en : c.zh}</p>
            <p className="text-xs text-muted-foreground mt-3">
              {lang === "zh" ? "热门手术" : "Trending procedures"}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {(lang === "zh" ? c.hot.zh : c.hot.en).map((h) => (
                <span key={h} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{h}</span>
              ))}
            </div>
            <p className="text-[11px] text-primary font-semibold mt-3 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition">
              {lang === "zh" ? "查看城市" : "Explore city"} <ArrowRight className="size-3" />
            </p>
          </Link>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <Link to="/cities" className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition">
          {lang === "zh" ? "查看全部城市" : "All cities"} <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
};

const TreatmentsSection = () => {
  const { t, lang, fmt } = useCn();
  return (
    <section id="projects" className="container py-16 md:py-20">
      <div className="mb-8">
        <span className="pill bg-accent text-accent-foreground mb-3"><Flame className="size-3.5" /> {t("tx.kicker")}</span>
        <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
          {t("tx.title1")} <em className="text-primary not-italic">{t("tx.titleEm")}</em>
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">{t("tx.note")}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {treatments.map((tx) => (
          <div key={tx.en} className={`rounded-3xl p-5 bg-gradient-to-br ${tx.grad} hover:-translate-y-1 transition-transform shadow-soft relative overflow-hidden`}>
            {tx.tag && (
              <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-foreground text-background font-semibold">
                {lang === "zh" ? tx.tag.zh : tx.tag.en}
              </span>
            )}
            <div className="text-3xl">{tx.emoji}</div>
            <p className="font-display text-lg font-semibold mt-3 leading-tight">{lang === "zh" ? tx.zh : tx.en}</p>
            <div className="mt-3 flex items-baseline gap-2 flex-wrap">
              <span className="font-display text-2xl font-semibold">{fmt(tx.from)}</span>
              {tx.orig && <span className="text-xs line-through text-muted-foreground">{fmt(tx.orig)}</span>}
            </div>
            {tx.groupPrice && (
              <p className="text-xs mt-1 flex items-center gap-1 text-foreground/80">
                <Users className="size-3" /> {t("tx.group")} {fmt(tx.groupPrice)}
              </p>
            )}
            <Button variant="outline" size="sm" className="mt-4 rounded-full bg-card/70 backdrop-blur border-0 w-full">
              {t("tx.book")} <ArrowRight className="ml-1 size-3" />
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};

// ClinicsSection removed — patients only browse doctors.

const DoctorsSection = () => {
  const { t, lang } = useCn();
  const featured = DOCTORS.slice(0, 3);
  return (
    <section id="compliance" className="container py-16 md:py-20">
      <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
        <div>
          <span className="pill bg-accent text-accent-foreground mb-3"><Stethoscope className="size-3.5" /> {t("doctors.kicker")}</span>
          <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            {t("doctors.title1")} <em className="text-primary not-italic">{t("doctors.titleEm")}</em>
          </h2>
        </div>
        <Link
          to="/doctors"
          className="text-sm font-semibold pill bg-foreground text-background hover:bg-foreground/90 px-5 py-2"
        >
          {lang === "zh" ? "查看全部医师" : "Browse all surgeons"} <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {featured.map((d) => (
          <Link
            key={d.id}
            to={`/doctors/${d.id}`}
            className="rounded-3xl bg-card shadow-pop p-6 hover:shadow-glow transition group block"
          >
            <div className="flex items-center gap-4">
              <img src={d.img} alt={lang === "zh" ? d.zh : d.en} className="size-16 rounded-2xl object-cover" />
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold leading-tight truncate">{lang === "zh" ? d.zh : d.en}</p>
                <p className="text-xs text-muted-foreground mt-1 truncate">{lang === "zh" ? d.titleZh : d.titleEn} · {lang === "zh" ? d.cityZh : d.cityEn}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 flex items-center gap-1">
              <Building2 className="size-3.5 shrink-0" />
              <span className="truncate">{lang === "zh" ? d.clinicZh : d.clinicEn}</span>
            </p>

            <div className="mt-4 rounded-2xl bg-muted/40 p-3 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <FileCheck2 className="size-3 text-primary" />
                <span>{t("doctors.lic")}</span>
                <span className="font-mono text-foreground truncate">{d.license}</span>
              </div>
              <p className="text-muted-foreground flex items-start gap-1.5">
                <BadgeCheck className="size-3 text-primary mt-0.5 shrink-0" />
                <span className="line-clamp-2">{lang === "zh" ? d.qualZh : d.qualEn}</span>
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-secondary py-2">
                <p className="font-display text-base font-semibold">{d.years}{lang === "zh" ? "年" : ""}</p>
                <p className="text-[10px] text-muted-foreground">{t("doctors.exp")}</p>
              </div>
              <div className="rounded-xl bg-secondary py-2">
                <p className="font-display text-base font-semibold">{d.surgeries}</p>
                <p className="text-[10px] text-muted-foreground">{t("doctors.cases")}</p>
              </div>
              <div className="rounded-xl bg-secondary py-2">
                <p className="font-display text-base font-semibold inline-flex items-center gap-0.5">
                  <Star className="size-3.5 fill-primary text-primary" /> {d.rating}
                </p>
                <p className="text-[10px] text-muted-foreground">{d.reviews.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1">
              {(lang === "zh" ? d.specZh : d.specEn).map((s) => (
                <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{s}</span>
              ))}
            </div>

            <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
              {t("doctors.cta")} <ArrowRight className="size-4" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

const CasesSection = () => {
  const { t, lang, fmt } = useCn();
  return (
    <section id="cases" className="container py-16 md:py-20">
      <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
        <div>
          <span className="pill bg-accent text-accent-foreground mb-3"><Heart className="size-3.5" /> {t("cases.kicker")}</span>
          <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            {t("cases.title1")} <em className="text-primary not-italic">{t("cases.titleEm")}</em>
          </h2>
          <p className="text-sm text-muted-foreground mt-2">{t("cases.wallSub")}</p>
        </div>
        <Link
          to="/cases"
          className="text-sm font-semibold pill bg-foreground text-background hover:bg-foreground/90 px-5 py-2"
        >
          {t("cases.viewAll")} <ArrowRight className="size-4" />
        </Link>
      </div>
      <TikTokWall items={TIKTOK_CASES} lang={lang} fmtPrice={fmt} variant="preview" />
    </section>
  );
};

const PromoBar = () => {
  const { t } = useCn();
  return (
    <section className="container py-10">
      <div className="rounded-3xl bg-gradient-to-r from-[hsl(340,85%,90%)] via-[hsl(50,80%,90%)] to-[hsl(155,60%,85%)] p-8 md:p-10 grid md:grid-cols-3 gap-6 items-center shadow-pop">
        <div className="md:col-span-2">
          <span className="pill bg-card/80 backdrop-blur shadow-soft mb-3"><Gift className="size-3.5 text-primary" /> {t("promo.kicker")}</span>
          <h3 className="font-display text-3xl md:text-4xl font-medium tracking-tight">{t("promo.title")}</h3>
          <p className="text-sm text-foreground/70 mt-2">{t("promo.note")}</p>
        </div>
        <Button size="lg" className="rounded-2xl bg-foreground text-background hover:bg-foreground/90 h-auto px-6 justify-self-start md:justify-self-end">
          {t("promo.cta")} <ArrowRight className="ml-1 size-4" />
        </Button>
      </div>
    </section>
  );
};

// ============== Page ==============
const ChinaIndex = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <CnNavbar />
    <Hero />
    <ComplianceBar />
    <TravelBar />
    <CitiesSection />
    <TreatmentsSection />
    <DoctorsSection />
    <CasesSection />
    <PromoBar />
    <Footer />
  </div>
);

export default ChinaIndex;

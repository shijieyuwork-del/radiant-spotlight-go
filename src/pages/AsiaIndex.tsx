import { Link } from "react-router-dom";
import {
  Sparkles, ArrowRight, Star, MapPin, ShieldCheck, BadgeCheck,
  Search, Stethoscope, FileCheck2, Building2,
  Flame, Gift, Wallet, Users, Plane,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import AsiaNavbar from "@/components/AsiaNavbar";
import TikTokWall from "@/components/TikTokWall";
import PageMeta from "@/components/PageMeta";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { DOCTORS } from "@/data/doctors";
import { CITIES } from "@/data/cities";
import { useAsia } from "@/lib/asia-i18n";
import { ORGANIZATION_SCHEMA } from "@/lib/seo-config";
import { useQuote } from "@/components/QuoteRequest";
import heroBg from "@/assets/hero-bg.jpg";
import treatmentRhinoplasty from "@/assets/treatment-rhinoplasty.jpg";
import treatmentFacelift from "@/assets/treatment-facelift.jpg";
import treatmentNeckLift from "@/assets/treatment-neck-lift.jpg";
import treatmentEyelid from "@/assets/treatment-eyelid.jpg";
import treatmentFatGrafting from "@/assets/treatment-fat-grafting.jpg";
import treatmentLiposuction from "@/assets/treatment-liposuction.jpg";
import treatmentTummyTuck from "@/assets/treatment-tummy-tuck.jpg";
import treatmentBbl from "@/assets/treatment-bbl.jpg";
import treatmentBreastAugmentation from "@/assets/treatment-breast-augmentation.jpg";
import treatmentBreastLift from "@/assets/treatment-breast-lift.jpg";
import treatmentBodyContouring from "@/assets/treatment-body-contouring.jpg";

// ============== Data (bilingual) ==============
const cities = CITIES;

type Treatment = {
  zh: string; en: string; emoji: string; from: number; orig?: number;
  groupPrice?: number; tag?: { en: string; zh: string }; grad: string;
  image: string;
};
const treatments: Treatment[] = [
  { zh: "鼻综合", en: "Rhinoplasty", emoji: "👃", from: 18800, orig: 28000, groupPrice: 15800, tag: { en: "TOP 1", zh: "热度TOP1" }, grad: "", image: treatmentRhinoplasty },
  { zh: "面部拉皮 (SMAS)", en: "Facelift (SMAS)", emoji: "✨", from: 88000, orig: 128000, groupPrice: 78000, tag: { en: "Signature", zh: "招牌项目" }, grad: "", image: treatmentFacelift },
  { zh: "颈部提升", en: "Neck Lift", emoji: "🦢", from: 68000, orig: 88000, tag: { en: "Pairs with facelift", zh: "搭配拉皮" }, grad: "", image: treatmentNeckLift },
  { zh: "双眼皮 / 眼袋", en: "Blepharoplasty (upper + lower)", emoji: "👁️", from: 12800, orig: 19800, groupPrice: 11800, tag: { en: "New patient", zh: "新人专享" }, grad: "", image: treatmentEyelid },
  { zh: "面部脂肪填充", en: "Facial Fat Grafting", emoji: "🪞", from: 26800, orig: 38000, groupPrice: 24800, tag: { en: "Recommended", zh: "推荐" }, grad: "", image: treatmentFatGrafting },
  { zh: "吸脂塑形", en: "Liposuction", emoji: "⚡", from: 32000, orig: 48000, groupPrice: 28000, tag: { en: "Sculpt", zh: "塑形" }, grad: "", image: treatmentLiposuction },
  { zh: "腹壁整形 (Tummy Tuck)", en: "Tummy Tuck / Mommy Makeover", emoji: "🤰", from: 78000, orig: 108000, tag: { en: "Mommy makeover", zh: "产后修复" }, grad: "", image: treatmentTummyTuck },
  { zh: "巴西提臀 (BBL)", en: "Brazilian Butt Lift (BBL)", emoji: "🍑", from: 96000, orig: 138000, tag: { en: "Hot", zh: "热门" }, grad: "", image: treatmentBbl },
  { zh: "隆胸 (Motiva)", en: "Breast Augmentation (Motiva)", emoji: "💗", from: 88000, orig: 128000, groupPrice: 82000, tag: { en: "Authentic implants", zh: "正品假体" }, grad: "", image: treatmentBreastAugmentation },
  { zh: "提胸 (Mastopexy)", en: "Breast Lift (Mastopexy)", emoji: "🌷", from: 72000, orig: 98000, grad: "", image: treatmentBreastLift },
  { zh: "全身体形雕塑", en: "Full Body Contouring", emoji: "🧬", from: 128000, orig: 168000, tag: { en: "Premier", zh: "高端" }, grad: "", image: treatmentBodyContouring },
];

// Clinics data removed — patients select by doctor, not by clinic.

// Doctors data lives in src/data/doctors.ts (used by both home + /doctors detail).
// TikTok cases live in src/data/tiktokCases.ts.

// ============== Sections ==============
const Hero = () => {
  const { t, lang, fmt } = useAsia();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <img src={heroBg} alt="" className="absolute inset-0 size-full object-cover opacity-40 mix-blend-multiply" />
      <div className="absolute -top-20 -left-10 size-72 bg-gradient-mint blur-3xl opacity-60 animate-blob" />
      <div className="absolute top-40 right-0 size-80 bg-gradient-peach blur-3xl opacity-50 animate-blob" style={{ animationDelay: "2s" }} />

      <div className="container relative py-10 sm:py-14 md:py-24">
        <div className="flex flex-col gap-8 md:gap-10">
          <div className="space-y-4 md:space-y-6 text-center max-w-4xl mx-auto w-full">
            <span className="pill bg-card/80 backdrop-blur shadow-soft max-w-full leading-relaxed">
              <ShieldCheck className="size-3.5 text-primary" />
              {t("hero.badge")}
            </span>
            <h1 className="font-display text-[2.65rem] sm:text-5xl md:text-7xl font-medium leading-[0.98] tracking-tight">
              {t("hero.title1")}<br />
              <em className="text-primary not-italic">{t("hero.titleEm")}</em>
            </h1>
            <p className="text-[15px] md:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">{t("hero.subtitle")}</p>

            <div className="bg-card rounded-full p-2 shadow-pop flex gap-2 max-w-2xl mx-auto border border-border/60">
              <div className="flex-1 px-3 md:px-5 py-2.5 md:py-3 flex items-center gap-3 min-w-0">
                <Search className="size-4 text-muted-foreground shrink-0" />
                <input className="w-full bg-transparent outline-none text-sm font-medium" placeholder={t("hero.searchPh")} />
              </div>
              <Button size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 h-12 px-5 md:px-7 shrink-0">
                <span className="hidden sm:inline">{t("hero.cta")}</span><Search className="sm:hidden size-4" /><ArrowRight className="ml-1 size-4 hidden sm:block" />
              </Button>
            </div>

            <div className="flex gap-2 pt-1 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1 sm:flex-wrap sm:justify-center">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mr-1">{t("hero.hot")}</span>
              {(lang === "zh" ? ["鼻综合", "面部拉皮", "双眼皮/眼袋", "吸脂", "腹壁整形", "巴西提臀", "隆胸", "脂肪填充"] : ["Rhinoplasty", "Facelift", "Blepharoplasty", "Liposuction", "Tummy Tuck", "BBL", "Breast Aug", "Fat Grafting"]).map((p) => (
                <span key={p} className="pill bg-card/80 backdrop-blur shadow-soft text-foreground shrink-0">
                  <Flame className="size-3 text-primary" /> {p}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-x-6 pt-2 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><FileCheck2 className="size-4 text-primary" /> {t("hero.feat1")}</span>
              <span className="flex items-center gap-1.5"><Building2 className="size-4 text-primary" /> {t("hero.feat2")}</span>
              <span className="flex items-center gap-1.5"><Wallet className="size-4 text-primary" /> {t("hero.feat3")}</span>
            </div>
          </div>

          <div className="w-full">
            <div className="mb-4 flex items-center justify-between gap-3 px-1">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                  <Sparkles className="size-3" /> {lang === "zh" ? "热门内容" : "Trending now"}
                </span>
                <p className="font-display text-xl md:text-2xl font-semibold mt-1">
                  {lang === "zh" ? "真实案例短视频" : "Real patient video diaries"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "zh" ? "滑动查看真实恢复过程" : "Swipe through real recovery journeys"}
                </p>
              </div>
              <Link
                to="/cases"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2.5 text-xs font-bold shadow-soft hover:shadow-pop hover:-translate-y-0.5 transition-all"
              >
                {lang === "zh" ? "全部视频" : "Watch all"} <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <TikTokWall items={TIKTOK_CASES.slice(0, 7)} lang={lang} fmtPrice={fmt} variant="preview" />
          </div>
        </div>
      </div>
    </section>
  );
};

const TravelBar = () => {
  const { lang } = useAsia();
  if (lang === "zh") return null;
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
  const { t, lang } = useAsia();
  return (
    <section id="cities" className="container py-12 md:py-20">
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          <span className="pill bg-accent text-accent-foreground mb-3"><MapPin className="size-3.5" /> {t("cities.kicker")}</span>
          <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            {t("cities.title1")} <em className="text-primary not-italic">{t("cities.titleEm")}</em>
          </h2>
        </div>
      </div>
      <div className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 pb-3">
        {cities.map((c) => (
          <Link key={c.slug} to={`/cities/${c.slug}`} className="group relative flex min-h-[390px] min-w-[78vw] snap-center flex-col justify-end overflow-hidden rounded-[2rem] p-5 text-white shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-pop sm:min-w-[46vw] md:min-w-0">
            <img src={c.img} alt={`${c.en} city`} className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
            <div className="relative z-10">
            <p className="font-display text-3xl font-semibold">{lang === "zh" ? c.zh : c.en}</p>
            <p className="text-sm text-white/75">{lang === "zh" ? c.en : c.zh}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
              {lang === "zh" ? "热门手术" : "Trending procedures"}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {(lang === "zh" ? c.hotZh : c.hotEn).map((h) => (
                <span key={h} className="rounded-full border border-white/20 bg-white/20 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">{h}</span>
              ))}
            </div>
            <p className="mt-4 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-foreground transition group-hover:gap-2">
              {lang === "zh" ? "查看城市" : "Explore city"} <ArrowRight className="size-3" />
            </p>
            </div>
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
  const { t, lang, fmt } = useAsia();
  const editorialSizes = [
    "md:col-span-6 md:row-span-2",
    "md:col-span-3",
    "md:col-span-3",
    "md:col-span-3",
    "md:col-span-3",
    "md:col-span-4",
    "md:col-span-4",
    "md:col-span-4",
    "md:col-span-5",
    "md:col-span-3",
    "md:col-span-4",
  ];
  return (
    <section id="projects" className="container py-12 md:py-20">
      <div className="mb-8">
        <span className="pill bg-accent text-accent-foreground mb-3"><Flame className="size-3.5" /> {t("tx.kicker")}</span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
          {t("tx.title1")} <em className="text-primary not-italic">{t("tx.titleEm")}</em>
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">{t("tx.note")}</p>
      </div>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-3 md:mx-0 md:grid md:auto-rows-[250px] md:grid-cols-12 md:gap-5 md:overflow-visible md:px-0">
        {treatments.map((tx, index) => (
          <Link
            to={`/treatments/${tx.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
            key={tx.en}
            className={`group relative flex min-h-[360px] min-w-[78vw] snap-center flex-col justify-end overflow-hidden rounded-[2rem] p-5 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-pop sm:min-w-[44vw] md:min-h-0 md:min-w-0 ${editorialSizes[index] ?? "md:col-span-4"}`}
          >
            <img src={tx.image} alt="" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10 transition-colors duration-500 group-hover:via-black/20" />
            <span className="absolute left-5 top-4 z-10 font-display text-4xl font-medium text-white/25" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            {tx.tag && (
              <span className="absolute top-3 right-3 z-10 text-[10px] px-2.5 py-1 rounded-full bg-black/65 backdrop-blur text-white font-semibold">
                {lang === "zh" ? tx.tag.zh : tx.tag.en}
              </span>
            )}
            <div className="relative z-10 text-white">
            <p className={`font-display font-medium leading-tight tracking-tight ${index === 0 ? "text-3xl md:max-w-md md:text-4xl" : "text-xl"}`}>{lang === "zh" ? tx.zh : tx.en}</p>
            <div className="mt-3 flex items-baseline gap-2 flex-wrap">
              <span className={`font-display font-semibold ${index === 0 ? "text-3xl" : "text-2xl"}`}>{fmt(tx.from)}</span>
              {tx.orig && <span className="text-xs line-through text-white/60">{fmt(tx.orig)}</span>}
            </div>
            {tx.groupPrice && (
              <p className="text-xs mt-1 flex items-center gap-1 text-white/80">
                <Users className="size-3" /> {t("tx.group")} {fmt(tx.groupPrice)}
              </p>
            )}
            <Button variant="outline" size="sm" className={`mt-4 rounded-full border-0 bg-white/90 text-foreground backdrop-blur hover:bg-white ${index === 0 ? "w-full md:w-auto md:px-8" : "w-full"}`}>
              {t("tx.book")} <ArrowRight className="ml-1 size-3" />
            </Button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

// ClinicsSection removed — patients only browse doctors.

const DoctorsSection = () => {
  const { t, lang } = useAsia();
  const featured = DOCTORS.slice(0, 3);
  return (
    <section id="compliance" className="container py-12 md:py-20">
      <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
        <div>
          <span className="pill bg-accent text-accent-foreground mb-3"><Stethoscope className="size-3.5" /> {t("doctors.kicker")}</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
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

const HowItWorks = () => {
  const { lang } = useAsia();
  const { open } = useQuote();
  const zh = lang === "zh";
  const steps = [
    {
      icon: Search,
      title: zh ? "告诉我们你的需求" : "Tell us what you want",
      text: zh ? "分享项目、预算和希望前往的城市。" : "Share the procedure, budget and city you have in mind.",
    },
    {
      icon: BadgeCheck,
      title: zh ? "比较适合的医生" : "Compare verified doctors",
      text: zh ? "查看医生背景、相关案例和清晰费用。" : "Review credentials, relevant cases and itemized pricing.",
    },
    {
      icon: Plane,
      title: zh ? "安心前往中国" : "Travel with full support",
      text: zh ? "我们协调行程、翻译、接送和术后支持。" : "We coordinate travel, translation, transfers and aftercare.",
    },
  ];

  return (
    <section className="container py-12 md:py-20">
      <div className="rounded-[2rem] border border-primary/15 bg-card p-6 shadow-soft md:p-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="pill mb-3 bg-accent text-accent-foreground"><Sparkles className="size-3.5" /> {zh ? "简单三步" : "A simple three-step process"}</span>
            <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
              {zh ? "从想法到中国，" : "From first question to China, "}<em className="text-primary not-italic">{zh ? "全程有人协助" : "we coordinate the details"}</em>
            </h2>
          </div>
          <Button size="lg" onClick={() => open()} className="shrink-0 rounded-full bg-foreground px-7 text-background hover:bg-foreground/90">
            {zh ? "开始免费咨询" : "Start your free consultation"}<ArrowRight className="ml-2 size-4" />
          </Button>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="relative rounded-3xl bg-muted/45 p-6">
              <span className="absolute right-5 top-4 font-display text-4xl text-primary/20">0{index + 1}</span>
              <span className="grid size-11 place-items-center rounded-2xl bg-primary/15 text-primary"><step.icon className="size-5" /></span>
              <h3 className="mt-5 font-display text-xl font-medium tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const PromoBar = () => {
  const { t } = useAsia();
  return (
    <section className="container py-8 md:py-10">
      <div className="rounded-3xl bg-gradient-to-r from-[hsl(340,85%,90%)] via-[hsl(50,80%,90%)] to-[hsl(155,60%,85%)] p-6 md:p-10 grid md:grid-cols-3 gap-6 items-center shadow-pop">
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

const PatientReviewsSection = () => {
  const { lang } = useAsia();
  const zh = lang === "zh";
  const standards = [
    {
      title: zh ? "核验就诊记录" : "Booking or visit verified",
      text: zh ? "仅在确认预约或到院记录后添加 Verified 标识。" : "The Verified label appears only after booking or clinic attendance is confirmed.",
    },
    {
      title: zh ? "保留真实感受" : "Opinions stay in the patient's words",
      text: zh ? "我们不会为了营销而改写患者对沟通、恢复或服务的评价。" : "We do not rewrite opinions about communication, recovery or service for marketing.",
    },
    {
      title: zh ? "医疗结果因人而异" : "Outcomes vary by patient",
      text: zh ? "评价代表个人经历，不构成疗效保证或医疗建议。" : "A review reflects one person's experience—not a promise of results or medical advice.",
    },
  ];

  return (
    <section className="container py-12 md:py-20">
      <div className="relative overflow-hidden rounded-[2.25rem] bg-foreground px-6 py-9 text-background shadow-pop md:px-10 md:py-12">
        <div className="absolute -right-24 -top-28 size-80 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 size-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="pill mb-3 bg-accent text-accent-foreground"><Star className="size-3.5 fill-primary text-primary" /> {zh ? "已核验患者评价" : "Verified patient reviews"}</span>
              <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
                {zh ? "真实经历，" : "Real experiences, "}<em className="not-italic text-primary">{zh ? "不制造完美故事" : "without the polished sales script"}</em>
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-background/70 md:text-base">
                {zh
                  ? "我们正在收集首批通过 Cosmetics Asia 预约的患者评价。评价会在核验后公开展示；在此之前，我们不会使用虚构姓名、星级或手术结果填充页面。"
                  : "We are collecting the first reviews from patients booked through Cosmetics Asia. Reviews will appear after verification; until then, we will not fill this space with invented names, ratings or outcomes."}
              </p>
            </div>
            <Button asChild size="lg" className="w-fit shrink-0 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90">
              <a href="https://wa.me/14708613825?text=I%27d%20like%20to%20share%20my%20Cosmetics%20Asia%20experience" target="_blank" rel="noreferrer">
                {zh ? "提交我的评价" : "Share your experience"}<ArrowRight className="ml-2 size-4" />
              </a>
            </Button>
          </div>

          <div className="mt-9 grid gap-3 md:grid-cols-3">
            {standards.map((item, index) => (
              <article key={item.title} className="rounded-3xl border border-background/10 bg-background/[0.06] p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3">
                  <ShieldCheck className="size-5 text-primary" />
                  <span className="font-display text-2xl text-background/20">0{index + 1}</span>
                </div>
                <h3 className="mt-4 font-display text-lg font-medium">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-background/65">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============== Page ==============
const AsiaIndex = () => (
  <>
    <PageMeta
      title="Beauty in China, Made Simple | Cosmetic Medical Travel"
      description="Cosmetics Asia connects international patients with licensed cosmetic surgeons across China. Watch real before-after videos, compare prices, and plan your medical trip."
      path="/"
      structuredData={ORGANIZATION_SCHEMA}
    />
    <div className="min-h-screen bg-background overflow-x-hidden">
      <AsiaNavbar />
      <Hero />
      <TravelBar />
      <CitiesSection />
      <TreatmentsSection />
      <DoctorsSection />
      <HowItWorks />
      <PromoBar />
      <PatientReviewsSection />
      <Footer />
    </div>
  </>
);

export default AsiaIndex;

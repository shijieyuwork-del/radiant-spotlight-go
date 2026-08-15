import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, ArrowRight, Star, MapPin, ShieldCheck, BadgeCheck,
  Search, Stethoscope, FileCheck2, Building2,
  Flame, Gift, Wallet, Users, Plane,
  ChevronLeft, ChevronRight, ScanFace, Eye, HeartPulse, Activity,
  Scissors, Smile, Heart, Scale, UserRound,
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
import AppPromoSection from "@/components/AppPromoSection";

// ============== Data (bilingual) ==============
const cities = CITIES;

type Treatment = {
  zh: string; en: string; emoji: string; from: number; orig?: number;
  groupPrice?: number; tag?: { en: string; zh: string }; grad: string;
};
const treatments: Treatment[] = [
  { zh: "鼻综合", en: "Rhinoplasty", emoji: "👃", from: 18800, orig: 28000, groupPrice: 15800, tag: { en: "Most requested", zh: "咨询较多" }, grad: "" },
  { zh: "面部拉皮 (SMAS)", en: "Facelift (SMAS)", emoji: "✨", from: 88000, orig: 128000, groupPrice: 78000, tag: { en: "Facial rejuvenation", zh: "面部年轻化" }, grad: "" },
  { zh: "颈部提升", en: "Neck Lift", emoji: "🦢", from: 68000, orig: 88000, tag: { en: "Pairs with facelift", zh: "搭配拉皮" }, grad: "" },
  { zh: "双眼皮 / 眼袋", en: "Blepharoplasty (upper + lower)", emoji: "👁️", from: 12800, orig: 19800, groupPrice: 11800, tag: { en: "Eye procedures", zh: "眼部项目" }, grad: "" },
  { zh: "面部脂肪填充", en: "Facial Fat Grafting", emoji: "🪞", from: 26800, orig: 38000, groupPrice: 24800, tag: { en: "Volume restoration", zh: "容量改善" }, grad: "" },
  { zh: "吸脂塑形", en: "Liposuction", emoji: "⚡", from: 32000, orig: 48000, groupPrice: 28000, tag: { en: "Body contouring", zh: "身体塑形" }, grad: "" },
  { zh: "腹壁整形 (Tummy Tuck)", en: "Tummy Tuck / Mommy Makeover", emoji: "🤰", from: 78000, orig: 108000, tag: { en: "Mommy makeover", zh: "产后修复" }, grad: "" },
  { zh: "巴西提臀 (BBL)", en: "Brazilian Butt Lift (BBL)", emoji: "🍑", from: 96000, orig: 138000, tag: { en: "Fat transfer", zh: "脂肪移植" }, grad: "" },
  { zh: "隆胸 (Motiva)", en: "Breast Augmentation (Motiva)", emoji: "💗", from: 88000, orig: 128000, groupPrice: 82000, tag: { en: "Authentic implants", zh: "正品假体" }, grad: "" },
  { zh: "提胸 (Mastopexy)", en: "Breast Lift (Mastopexy)", emoji: "🌷", from: 72000, orig: 98000, grad: "" },
  { zh: "全身体形雕塑", en: "Full Body Contouring", emoji: "🧬", from: 128000, orig: 168000, tag: { en: "Combined planning", zh: "联合方案" }, grad: "" },
];

// Clinics data removed — patients select by doctor, not by clinic.

// Doctors data lives in src/data/doctors.ts (used by both home + /doctors detail).
// TikTok cases live in src/data/tiktokCases.ts.

// ============== Sections ==============
const Hero = () => {
  const { t, lang, fmt } = useAsia();
  const copy = lang === "zh"
    ? {
        badge: "专为国际患者打造的中国医美平台",
        title: "中国头部医美医生，",
        emphasis: "一个平台轻松比较",
        subtitle: "先看真实案例、医生资质与明细报价，再决定是否出发。翻译、行程和术后支持由我们协调。",
        procedures: "比较医生与项目",
        cases: "观看真实案例",
        licensed: "300+ 中国头部医生",
        english: "10,000+ 真实案例日记",
        aftercare: "5 大医美目的地",
      }
    : lang === "ru"
      ? {
          badge: "Китайская платформа для международных пациентов",
          title: "Лучшие эстетические хирурги Китая —",
          emphasis: "на одной платформе",
          subtitle: "Сравните реальные случаи, квалификацию врачей и прозрачные цены до поездки. Мы организуем перевод, поездку и последующий уход.",
          procedures: "Сравнить врачей",
          cases: "Реальные случаи",
          licensed: "300+ ведущих врачей",
          english: "10 000+ историй пациентов",
          aftercare: "5 направлений в Китае",
        }
      : {
          badge: "China's cosmetic care platform for international patients",
          title: "China’s top cosmetic surgeons,",
          emphasis: "all in one place",
          subtitle: "Compare real cases, doctor credentials and itemized quotes before you travel. We coordinate translation, your trip and aftercare.",
          procedures: "Compare doctors & procedures",
          cases: "Watch real cases",
          licensed: "300+ top-tier surgeons",
          english: "10,000+ real case diaries",
          aftercare: "5 China destinations",
        };
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <img src={heroBg} alt="" className="absolute inset-0 size-full object-cover opacity-40 mix-blend-multiply" />
      <div className="absolute -top-20 -left-10 size-72 bg-gradient-mint blur-3xl opacity-60 animate-blob" />
      <div className="absolute top-40 right-0 size-80 bg-gradient-peach blur-3xl opacity-50 animate-blob" style={{ animationDelay: "2s" }} />

      <div className="container relative py-10 sm:py-14 md:py-20">
        <div className="flex flex-col gap-10 md:gap-14">
          <div className="text-center max-w-3xl mx-auto w-full">
            <span className="pill bg-card/80 backdrop-blur shadow-soft max-w-full leading-relaxed">
              <ShieldCheck className="size-3.5 text-primary" />
              {copy.badge}
            </span>
            <h1 className="mt-5 font-display text-[2.55rem] sm:text-5xl md:text-6xl font-medium leading-[1.02] tracking-tight">
              {copy.title}<br />
              <em className="text-primary not-italic">{copy.emphasis}</em>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground md:text-lg">{copy.subtitle}</p>

            <div className="mx-auto mt-7 flex max-w-lg flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-full px-7 text-sm font-semibold shadow-soft">
                <Link to="/treatments">{copy.procedures}<ArrowRight className="ml-1.5 size-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-full border-border/80 bg-card/75 px-7 text-sm font-semibold backdrop-blur hover:bg-card">
                <Link to="/cases">{copy.cases}<ArrowRight className="ml-1.5 size-4" /></Link>
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
              <span className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-primary/10 bg-card/70 px-3 text-xs font-semibold text-foreground shadow-soft backdrop-blur sm:text-sm"><FileCheck2 className="size-4 shrink-0 text-primary" /> {copy.licensed}</span>
              <span className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-primary/10 bg-card/70 px-3 text-xs font-semibold text-foreground shadow-soft backdrop-blur sm:text-sm"><Users className="size-4 shrink-0 text-primary" /> {copy.english}</span>
              <span className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-primary/10 bg-card/70 px-3 text-xs font-semibold text-foreground shadow-soft backdrop-blur sm:text-sm"><MapPin className="size-4 shrink-0 text-primary" /> {copy.aftercare}</span>
            </div>
          </div>

          <div className="w-full border-t border-primary/10 pt-10 md:pt-14">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 px-1 sm:flex-row sm:items-end md:mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                  <Sparkles className="size-3.5" /> {lang === "zh" ? "我们的核心优势" : "Our biggest difference"}
                </span>
                <h2 className="mt-2 max-w-4xl font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl">
                  {lang === "zh" ? "10,000+ 真实患者日记，" : "10,000+ real patient diaries, "}
                  <em className="not-italic text-primary">{lang === "zh" ? "选择医生前先看结果" : "before you choose"}</em>
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  {lang === "zh" ? "查看咨询、手术到恢复的完整过程，再决定哪位医生和方案更适合你。" : "See the consultation, procedure and recovery journey—not just a polished after photo—before choosing your doctor."}
                </p>
              </div>
              <Link
                to="/cases"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2.5 text-xs font-bold shadow-soft hover:shadow-pop hover:-translate-y-0.5 transition-all"
              >
                {lang === "zh" ? "浏览全部日记" : "Explore all diaries"} <ArrowRight className="size-3.5" />
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
      <div className="rounded-3xl bg-gradient-to-r from-[hsl(340,82%,92%)] via-[hsl(var(--primary)/.20)] to-[hsl(50,80%,92%)] p-6 md:p-7 grid md:grid-cols-4 gap-4 items-center shadow-soft">
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
  const cityRailRef = useRef<HTMLDivElement>(null);
  const cityRailPausedRef = useRef(false);
  const moveCities = (direction: -1 | 1) => {
    const rail = cityRailRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.min(rail.clientWidth * 0.86, 1080), behavior: "smooth" });
  };
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      const rail = cityRailRef.current;
      if (!rail || cityRailPausedRef.current || document.hidden) return;
      const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 24;
      rail.scrollTo({ left: atEnd ? 0 : rail.scrollLeft + Math.min(rail.clientWidth * 0.86, 1080), behavior: "smooth" });
    }, 4800);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <section id="cities" className="container py-12 md:py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="pill bg-accent text-accent-foreground mb-3"><MapPin className="size-3.5" /> {t("cities.kicker")}</span>
          <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            {t("cities.title1")} <em className="text-primary not-italic">{t("cities.titleEm")}</em>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => moveCities(-1)} className="grid size-10 place-items-center rounded-full border border-border bg-card text-foreground shadow-soft transition hover:border-primary hover:text-primary" aria-label={lang === "zh" ? "上一组城市" : "Previous cities"}><ChevronLeft className="size-5" /></button>
          <button type="button" onClick={() => moveCities(1)} className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft transition hover:bg-primary/90" aria-label={lang === "zh" ? "下一组城市" : "More cities"}><ChevronRight className="size-5" /></button>
          <Link to="/cities" className="pill ml-1 hidden bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:inline-flex">{lang === "zh" ? "全部城市" : "All cities"}<ArrowRight className="size-4" /></Link>
        </div>
      </div>
      <div
        ref={cityRailRef}
        onMouseEnter={() => { cityRailPausedRef.current = true; }}
        onMouseLeave={() => { cityRailPausedRef.current = false; }}
        onFocusCapture={() => { cityRailPausedRef.current = true; }}
        onBlurCapture={() => { cityRailPausedRef.current = false; }}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-4 scrollbar-hide md:-mx-6 md:gap-6 md:px-6"
      >
        {cities.map((c) => (
          <Link key={c.slug} to={`/cities/${c.slug}`} className="group block min-w-[88vw] snap-start sm:min-w-[62vw] md:min-w-[calc((100%_-_3rem)/3)] md:max-w-[calc((100%_-_3rem)/3)]">
            <article className="flex h-[410px] flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition duration-300 group-hover:-translate-y-1 group-hover:border-primary/35 group-hover:shadow-pop md:p-6">
              <div className="flex min-w-0 items-center gap-4">
                <img src={c.img} alt={`${c.en} city`} className="size-24 shrink-0 rounded-full border-2 border-primary/15 object-cover transition-transform duration-500 group-hover:scale-105 md:size-28" />
                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-semibold leading-tight text-foreground md:text-3xl">{lang === "zh" ? c.zh : c.en}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{lang === "zh" ? c.en : c.zh}</p>
                  <p className="mt-2 line-clamp-2 text-sm font-medium text-primary">{lang === "zh" ? c.taglineZh : c.taglineEn}</p>
                </div>
              </div>
              <p className="mt-5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{lang === "zh" ? c.introZh : c.introEn}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-xl bg-secondary py-2.5"><p className="font-display text-xl font-semibold">{c.doctorsCount}+</p><p className="text-[10px] text-muted-foreground">{lang === "zh" ? "平台医生" : "listed surgeons"}</p></div>
                <div className="rounded-xl bg-secondary py-2.5"><p className="font-display text-xl font-semibold text-primary">{c.savings}</p><p className="text-[10px] text-muted-foreground">{lang === "zh" ? "参考节省" : "indicative savings"}</p></div>
              </div>
              <div className="mt-4 flex max-h-[50px] flex-wrap gap-1.5 overflow-hidden">
                {(lang === "zh" ? c.hotZh : c.hotEn).slice(0, 3).map((h) => <span key={h} className="rounded-full bg-accent px-2.5 py-1 text-[10px] text-accent-foreground">{h}</span>)}
              </div>
              <div className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground transition group-hover:bg-primary/90">
                {lang === "zh" ? "查看城市与医生" : "Explore city & doctors"}<ArrowRight className="size-4" />
              </div>
            </article>
          </Link>
        ))}
      </div>
      <div className="mt-2 flex justify-center sm:hidden">
        <Link to="/cities" className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
          {lang === "zh" ? "查看全部城市" : "All cities"} <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
};

const TreatmentsSection = () => {
  const { t, lang } = useAsia();
  const procedureClouds = [
    { en: "Nose", zh: "鼻部整形", icon: ScanFace, items: [["Rhinoplasty", "鼻综合"], ["Revision Rhinoplasty", "鼻修复"], ["Septorhinoplasty", "功能性鼻整形"], ["Alar Base Reduction", "鼻翼缩小"], ["Nasal Tip Surgery", "鼻尖塑形"]] },
    { en: "Facial Rejuvenation", zh: "面部年轻化", icon: Sparkles, items: [["Facelift", "面部拉皮"], ["Neck Lift", "颈部提升"], ["Deep-Plane Facelift", "深层平面拉皮"], ["Mini Facelift", "小切口拉皮"], ["Brow Lift", "眉提升"], ["Facial Fat Grafting", "面部脂肪填充"]] },
    { en: "Eyes", zh: "眼部整形", icon: Eye, items: [["Double Eyelid Surgery", "双眼皮"], ["Upper Blepharoplasty", "上睑成形"], ["Lower Blepharoplasty", "下睑成形"], ["Ptosis Correction", "上睑下垂矫正"], ["Epicanthoplasty", "内眼角成形"]] },
    { en: "Face & Contour", zh: "面部轮廓", icon: UserRound, items: [["Jaw Contouring", "下颌角整形"], ["Chin Augmentation", "下巴塑形"], ["Zygoma Reduction", "颧骨降低"], ["Genioplasty", "颏成形"], ["Otoplasty", "耳廓整形"]] },
    { en: "Breast", zh: "胸部整形", icon: HeartPulse, items: [["Breast Augmentation", "隆胸"], ["Breast Lift", "乳房提升"], ["Breast Reduction", "乳房缩小"], ["Implant Revision", "假体修复"], ["Implant Removal", "假体取出"]] },
    { en: "Body Contouring", zh: "身体塑形", icon: Activity, items: [["Liposuction", "吸脂"], ["Tummy Tuck", "腹壁成形"], ["Mommy Makeover", "产后综合塑形"], ["Body Lift", "环形身体提升"], ["Fat Transfer", "自体脂肪移植"], ["Arm Lift", "上臂提升"]] },
    { en: "Hair Restoration", zh: "植发", icon: Scissors, items: [["FUE Hair Transplant", "FUE 植发"], ["Hairline Restoration", "发际线种植"], ["Crown Restoration", "头顶加密"], ["Eyebrow Transplant", "眉毛种植"], ["Beard Transplant", "胡须种植"]] },
    { en: "Cosmetic Dentistry", zh: "牙齿美容", icon: Smile, items: [["Dental Implants", "种植牙"], ["Porcelain Veneers", "瓷贴面"], ["Teeth Whitening", "牙齿美白"], ["Clear Aligners", "隐形矫正"], ["All-Ceramic Crowns", "全瓷牙冠"]] },
    { en: "Skin & Non-Surgical", zh: "皮肤与非手术", icon: Sparkles, items: [["Laser Skin Resurfacing", "激光皮肤重塑"], ["Pigmentation Treatment", "色斑治疗"], ["RF Microneedling", "射频微针"], ["Ultrasound Skin Tightening", "超声紧肤"], ["Botulinum Toxin", "肉毒素"], ["Dermal Fillers", "皮肤填充剂"]] },
    { en: "Lips & Smile", zh: "唇部与微笑", icon: Heart, items: [["Lip Lift", "唇提升"], ["Lip Reduction", "厚唇改薄"], ["Lip Contouring", "唇形塑造"], ["Gummy Smile Correction", "露龈笑改善"], ["Lip Fillers", "唇部填充"]] },
    { en: "Post-Weight-Loss", zh: "减重后塑形", icon: Scale, items: [["Lower Body Lift", "下半身提升"], ["Arm Lift", "上臂提升"], ["Thigh Lift", "大腿提升"], ["Back Lift", "背部提升"], ["Skin Removal", "多余皮肤切除"]] },
    { en: "Men's Procedures", zh: "男性医美", icon: UserRound, items: [["Male Breast Reduction", "男性乳房缩小"], ["Male Liposuction", "男性吸脂"], ["Jawline Contouring", "下颌线塑形"], ["Hair Transplant", "男性植发"], ["Eyelid Surgery", "男性眼部整形"]] },
  ];
  const itemStyles = ["text-3xl text-primary", "text-2xl text-foreground", "text-lg text-rose-400", "text-xl text-foreground/65", "text-base text-primary", "text-lg text-amber-500"];
  const treatmentCloudRailRef = useRef<HTMLDivElement>(null);
  const treatmentCloudPausedRef = useRef(false);
  const moveTreatmentClouds = (direction: -1 | 1) => {
    const rail = treatmentCloudRailRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.min(rail.clientWidth * 0.88, 1050), behavior: "smooth" });
  };
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let previousTime = 0;
    const animate = (time: number) => {
      const rail = treatmentCloudRailRef.current;
      if (rail && !treatmentCloudPausedRef.current && !document.hidden) {
        const elapsed = previousTime ? time - previousTime : 0;
        rail.scrollLeft += elapsed * 0.045;
        const loopPoint = rail.scrollWidth / 2;
        if (rail.scrollLeft >= loopPoint) rail.scrollLeft -= loopPoint;
      }
      previousTime = time;
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, []);
  return (
    <section id="projects" className="container py-12 md:py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="pill bg-accent text-accent-foreground mb-3"><Flame className="size-3.5" /> {t("tx.kicker")}</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
            {t("tx.title1")} <em className="text-primary not-italic">{t("tx.titleEm")}</em>
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">{t("tx.note")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => moveTreatmentClouds(-1)} className="grid size-10 place-items-center rounded-full border border-border bg-card text-foreground shadow-soft transition hover:border-primary hover:text-primary" aria-label={lang === "zh" ? "上一组手术类型" : "Previous procedure groups"}>
            <ChevronLeft className="size-5" />
          </button>
          <button type="button" onClick={() => moveTreatmentClouds(1)} className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft transition hover:bg-primary/90" aria-label={lang === "zh" ? "下一组手术类型" : "Next procedure groups"}>
            <ChevronRight className="size-5" />
          </button>
          <Link to="/treatments" className="pill bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            {lang === "zh" ? "全部项目" : "All procedures"}<ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
      <div
        ref={treatmentCloudRailRef}
        onFocusCapture={() => { treatmentCloudPausedRef.current = true; }}
        onBlurCapture={() => { treatmentCloudPausedRef.current = false; }}
        className="-mx-4 flex items-center gap-10 overflow-x-auto px-4 py-6 scrollbar-hide md:-mx-6 md:gap-12 md:px-6"
      >
        {[...procedureClouds, ...procedureClouds].map((cloud, repeatedIndex) => {
          const cloudIndex = repeatedIndex % procedureClouds.length;
          const duplicate = repeatedIndex >= procedureClouds.length;
          const CloudIcon = cloud.icon;
          return (
          <article key={`${cloud.en}-${duplicate ? "loop" : "primary"}`} aria-hidden={duplicate || undefined} className="group relative flex min-h-[340px] w-full min-w-[84vw] shrink-0 flex-col justify-center px-1 py-5 transition duration-500 hover:-translate-y-1 sm:w-[calc((100%_-_2.5rem)/2)] sm:min-w-[calc((100%_-_2.5rem)/2)] md:w-[calc((100%_-_6rem)/3)] md:min-w-[calc((100%_-_6rem)/3)] lg:w-[calc((100%_-_12rem)/5)] lg:min-w-[calc((100%_-_12rem)/5)] xl:w-[calc((100%_-_15rem)/6)] xl:min-w-[calc((100%_-_15rem)/6)]">
            <span className="absolute right-0 top-2 font-display text-6xl font-semibold leading-none text-foreground/[0.04]">0{cloudIndex + 1}</span>
            <div className="mb-5 flex justify-center" aria-hidden="true">
              <CloudIcon strokeWidth={1.35} className="size-16 text-primary transition duration-500 group-hover:scale-110 group-hover:text-rose-400" />
            </div>
            <div className="relative flex items-center justify-between gap-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{lang === "zh" ? cloud.zh : cloud.en}</h3>
              <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
            </div>
            <div className="relative mt-7 flex flex-wrap content-center items-baseline justify-center gap-x-3 gap-y-1.5 text-center">
              {cloud.items.map(([en, zh], itemIndex) => (
                <Link
                  key={en}
                  to={`/treatments/${en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
                  tabIndex={duplicate ? -1 : undefined}
                  className={`px-0.5 font-display font-semibold leading-[0.95] tracking-[-0.035em] transition hover:scale-105 hover:text-primary ${itemStyles[itemIndex % itemStyles.length]}`}
                >
                  {lang === "zh" ? zh : en}
                </Link>
              ))}
            </div>
          </article>
        );})}
      </div>
    </section>
  );
};

// ClinicsSection removed — patients only browse doctors.

const DoctorsSection = () => {
  const { t, lang } = useAsia();
  const { open } = useQuote();
  const doctorRailRef = useRef<HTMLDivElement>(null);
  const doctorRailPausedRef = useRef(false);
  const moveDoctors = (direction: -1 | 1) => {
    const rail = doctorRailRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.min(rail.clientWidth * 0.86, 1080), behavior: "smooth" });
  };
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      const rail = doctorRailRef.current;
      if (!rail || doctorRailPausedRef.current || document.hidden) return;
      const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 24;
      rail.scrollTo({ left: atEnd ? 0 : rail.scrollLeft + Math.min(rail.clientWidth * 0.86, 1080), behavior: "smooth" });
    }, 4800);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <section id="compliance" className="container py-12 md:py-16">
      <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
        <div>
          <span className="pill bg-accent text-accent-foreground mb-3"><Stethoscope className="size-3.5" /> {t("doctors.kicker")}</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
            {t("doctors.title1")} <em className="text-primary not-italic">{t("doctors.titleEm")}</em>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => moveDoctors(-1)}
            className="grid size-10 place-items-center rounded-full border border-border bg-card text-foreground shadow-soft transition hover:border-primary hover:text-primary"
            aria-label={lang === "zh" ? "查看上一组医生" : "Previous surgeons"}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => moveDoctors(1)}
            className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft transition hover:bg-primary/90"
            aria-label={lang === "zh" ? "查看更多医生" : "More surgeons"}
          >
            <ChevronRight className="size-5" />
          </button>
          <Link
            to="/doctors"
            className="pill ml-1 hidden bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:inline-flex"
          >
            {lang === "zh" ? "全部医师" : "All surgeons"} <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
      <div
        ref={doctorRailRef}
        onMouseEnter={() => { doctorRailPausedRef.current = true; }}
        onMouseLeave={() => { doctorRailPausedRef.current = false; }}
        onFocusCapture={() => { doctorRailPausedRef.current = true; }}
        onBlurCapture={() => { doctorRailPausedRef.current = false; }}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-4 scrollbar-hide md:-mx-6 md:gap-6 md:px-6"
      >
        {DOCTORS.map((d) => (
          <article
            key={d.id}
            className="group block min-w-[88vw] snap-start sm:min-w-[62vw] md:min-w-[calc((100%_-_3rem)/3)] md:max-w-[calc((100%_-_3rem)/3)]"
          >
            <div className="flex h-[410px] flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition duration-300 group-hover:-translate-y-1 group-hover:border-primary/35 group-hover:shadow-pop md:p-6">
              <div className="flex min-w-0 items-center gap-4">
                <img
                  src={d.img}
                  alt={lang === "zh" ? d.zh : d.en}
                  className="size-24 shrink-0 rounded-full border-2 border-primary/15 object-cover transition-transform duration-500 group-hover:scale-105 md:size-28"
                />
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-semibold leading-tight text-foreground md:text-2xl">{lang === "zh" ? d.zh : d.en}</h3>
                  <p className="mt-1 line-clamp-1 text-sm font-medium text-muted-foreground">{lang === "zh" ? d.titleZh : d.titleEn}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    <strong>{d.rating.toFixed(2)}</strong>
                    <span className="text-muted-foreground">· {d.reviews.toLocaleString()} {lang === "zh" ? "条评价" : "reviews"}</span>
                  </p>
                </div>
              </div>

              <p className="mt-5 flex items-center gap-2 text-sm text-foreground/80"><MapPin className="size-4 text-primary" />{lang === "zh" ? d.cityZh : d.cityEn} · {lang === "zh" ? d.clinicZh : d.clinicEn}</p>
              <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {lang === "zh"
                  ? `${d.years} 年经验 · ${d.surgeries} 例手术 · 接受国际患者`
                  : `${d.years} years' experience · ${d.surgeries} procedures · International patients welcome`}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 overflow-hidden max-h-[54px]">
                {(lang === "zh" ? d.specZh : d.specEn).slice(0, 3).map((s) => (
                  <span key={s} className="rounded-full bg-accent px-2.5 py-1 text-[11px] text-accent-foreground">{s}</span>
                ))}
              </div>

              <div className="mt-auto grid grid-cols-[0.9fr_1.1fr] gap-2">
                <Link
                  to={`/doctors/${d.id}`}
                  className="flex items-center justify-center rounded-xl border border-primary/30 bg-card px-3 py-3 text-center text-xs font-semibold text-primary transition hover:bg-primary/10"
                >
                  {lang === "zh" ? "医生与案例" : "Doctor & cases"}
                </Link>
                <button
                  type="button"
                  onClick={() => open({ doctorName: lang === "zh" ? d.zh : d.en, city: lang === "zh" ? d.cityZh : d.cityEn })}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  {lang === "zh" ? "在线预约" : "Book online"}<ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-2 flex justify-center sm:hidden">
        <Link to="/doctors" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          {lang === "zh" ? "查看全部医师" : "Browse all surgeons"}<ArrowRight className="size-4" />
        </Link>
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
      title: zh ? "预约线上咨询" : "Book online consultation",
      text: zh ? "选择适合的医生，并预约线上咨询时间。" : "Choose your doctor and schedule a convenient online consultation.",
    },
    {
      icon: Plane,
      title: zh ? "安心前往中国" : "Travel with full support",
      text: zh ? "我们协调行程、翻译、接送和术后支持。" : "We coordinate travel, translation, transfers and aftercare.",
    },
  ];

  return (
    <section className="container py-12 md:py-16">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[hsl(190,70%,92%)] via-[hsl(var(--primary)/.20)] to-[hsl(50,80%,92%)] p-5 text-foreground shadow-pop md:p-10">
        <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-white/25" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full bg-primary/10" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="pill mb-3 bg-white/85 text-foreground"><Sparkles className="size-3.5 text-primary" /> {zh ? "简单三步" : "A simple three-step process"}</span>
            <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
              {zh ? "从想法到中国，" : "From first question to China, "}<em className="text-primary not-italic">{zh ? "全程有人协助" : "we coordinate the details"}</em>
            </h2>
          </div>
          <Button size="lg" onClick={() => open()} className="w-full shrink-0 rounded-full bg-primary px-7 text-primary-foreground shadow-pop hover:bg-primary/90 md:w-fit">
            {zh ? "开始免费咨询" : "Start your free consultation"}<ArrowRight className="ml-2 size-4" />
          </Button>
        </div>

        <div className="relative -mx-5 mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0">
          {steps.map((step, index) => (
            <article key={step.title} className="relative min-w-[78vw] snap-center rounded-3xl border border-white/55 bg-white/78 p-5 text-foreground shadow-soft backdrop-blur sm:min-w-[56vw] md:min-w-0 md:p-6">
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
    <section className="container py-6 md:py-10">
      <div className="grid items-center gap-5 rounded-3xl bg-gradient-to-r from-[hsl(340,85%,90%)] via-[hsl(50,80%,90%)] to-[hsl(var(--primary)/.28)] p-5 shadow-pop md:grid-cols-3 md:gap-6 md:p-10">
        <div className="md:col-span-2">
          <span className="pill bg-card/80 backdrop-blur shadow-soft mb-3"><Gift className="size-3.5 text-primary" /> {t("promo.kicker")}</span>
          <h3 className="font-display text-3xl md:text-4xl font-medium tracking-tight">{t("promo.title")}</h3>
          <p className="text-sm text-foreground/70 mt-2">{t("promo.note")}</p>
        </div>
        <Button size="lg" className="h-12 w-full justify-self-start rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90 md:w-auto md:justify-self-end">
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
    <section className="container py-10 md:py-20">
      <div className="relative overflow-hidden rounded-[2.25rem] bg-foreground px-5 py-8 text-background shadow-pop md:px-10 md:py-12">
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
            <Button asChild size="lg" className="w-full shrink-0 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90 lg:w-fit">
              <a href="https://wa.me/14708613825?text=I%27d%20like%20to%20share%20my%20Cosmetics%20Asia%20experience" target="_blank" rel="noreferrer">
                {zh ? "提交我的评价" : "Share your experience"}<ArrowRight className="ml-2 size-4" />
              </a>
            </Button>
          </div>

          <div className="-mx-5 mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {standards.map((item, index) => (
              <article key={item.title} className="min-w-[78vw] snap-center rounded-3xl border border-background/10 bg-background/[0.06] p-5 backdrop-blur-sm sm:min-w-[56vw] md:min-w-0">
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
      <main className="home-content-flow">
        <TravelBar />
        <TreatmentsSection />
        <DoctorsSection />
        <CitiesSection />
        <HowItWorks />
        <AppPromoSection />
      </main>
      <Footer />
    </div>
  </>
);

export default AsiaIndex;

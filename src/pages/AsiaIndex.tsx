import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, ArrowRight, Star, MapPin, ShieldCheck, BadgeCheck,
  Search, Stethoscope, Building2,
  Flame, Gift, Wallet, Users, Plane,
  ChevronLeft, ChevronRight, Eye,
  Scale, HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Footer from "@/components/Footer";
import AsiaNavbar from "@/components/AsiaNavbar";
import TikTokWall from "@/components/TikTokWall";
import PageMeta from "@/components/PageMeta";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { CITIES } from "@/data/cities";
import { useAsia } from "@/lib/asia-i18n";
import { ORGANIZATION_SCHEMA } from "@/lib/seo-config";
import { useQuote } from "@/components/QuoteRequest";
import heroBg from "@/assets/hero-bg.jpg";
import AppPromoSection from "@/components/AppPromoSection";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_CHINA_DOCTORS } from "@/data/demoChinaDoctors";

type ProcedureIconProps = { className?: string; strokeWidth?: number };

const NoseLineIcon = ({ className, strokeWidth = 1.5 }: ProcedureIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M14 3c-2.2 2.6-2.8 6.1-3.4 8.8-.3 1.4-1.8 2.4-2.6 3.5-.8 1.1 0 2.5 1.4 2.5h3.4" />
    <path d="M12.8 17.8c1.2 0 2.1.5 2.8 1.4M9.8 21c1.7.5 3.7.3 5.2-.7" />
  </svg>
);

const BodyContourLineIcon = ({ className, strokeWidth = 1.5 }: ProcedureIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M8 3c.8 3.2.3 5.4-1.3 7.5C5.3 12.3 5.4 16.8 8 21" />
    <path d="M16 3c-.8 3.2-.3 5.4 1.3 7.5 1.4 1.8 1.3 6.3-1.3 10.5" />
    <path d="M7 11.5c2.9 1.6 7.1 1.6 10 0M8 21c2.5-1.3 5.5-1.3 8 0" />
  </svg>
);

const HairLineIcon = ({ className, strokeWidth = 1.5 }: ProcedureIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M5 11a7 7 0 0 1 14 0v3c0 4.2-3.1 7-7 7s-7-2.8-7-7v-3Z" />
    <path d="M5.5 10.2c2.2-.5 3.7-1.8 4.5-4 .7 1.8 2.1 3 4.2 3.5.2-1.4.8-2.5 1.8-3.4.6 1.5 1.7 2.7 3 3.5" />
    <path d="M9.5 16.5c1.6.8 3.4.8 5 0" />
  </svg>
);

const ToothLineIcon = ({ className, strokeWidth = 1.5 }: ProcedureIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M7.2 3.5C4.7 4.4 3.5 7 4.1 9.8c.5 2.3 1.8 3.5 2.2 6.7.3 2.4 1 4.5 2.4 4.5 1.8 0 1.6-5.3 3.3-5.3s1.5 5.3 3.3 5.3c1.4 0 2.1-2.1 2.4-4.5.4-3.2 1.7-4.4 2.2-6.7.6-2.8-.6-5.4-3.1-6.3-1.7-.6-3.1.3-4.8.3s-3.1-.9-4.8-.3Z" />
    <path d="M9 5.8c1.8.7 4.2.7 6 0" />
  </svg>
);

const LipsLineIcon = ({ className, strokeWidth = 1.5 }: ProcedureIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M3 12c2.8-1.4 4.8-4.1 7.1-3.2L12 10l1.9-1.2c2.3-.9 4.3 1.8 7.1 3.2-2.7 1.2-4.7 4.1-9 4.1S5.7 13.2 3 12Z" />
    <path d="M3 12c3 .3 5.9.1 9-.1 3.1.2 6 .4 9 .1" />
  </svg>
);

const JawContourLineIcon = ({ className, strokeWidth = 1.5 }: ProcedureIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M8 3.5c-1.8 1.8-2.7 4.2-2.7 7 0 5.5 3 9.1 6.7 10.5 3.7-1.4 6.7-5 6.7-10.5 0-2.8-.9-5.2-2.7-7" />
    <path d="M5.5 12.5c2.2.2 3.7 1 4.7 2.4.7.9 1.1 1.4 1.8 1.4s1.1-.5 1.8-1.4c1-1.4 2.5-2.2 4.7-2.4" />
    <path d="M9.5 18.4c1.6.7 3.4.7 5 0" />
  </svg>
);

const BreastLineIcon = ({ className, strokeWidth = 1.5 }: ProcedureIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M8.2 3.5c.2 2.5-.8 4.1-2.1 5.7C4.8 10.8 4 13.2 4 16v4.5M15.8 3.5c-.2 2.5.8 4.1 2.1 5.7 1.3 1.6 2.1 4 2.1 6.8v4.5" />
    <path d="M6.2 13.1c1.4-1.5 4.3-1.3 5.8.9 1.5-2.2 4.4-2.4 5.8-.9M6 17.2c1.9.8 4 .6 6-.8 2 1.4 4.1 1.6 6 .8" />
    <path d="M12 7.7v8.7M8.3 6.3h3M9.8 4.8v3" />
  </svg>
);

const MaleChestLineIcon = ({ className, strokeWidth = 1.5 }: ProcedureIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M8 3.5 5.2 5.2C3.8 6 3 7.5 3 9.1V20M16 3.5l2.8 1.7C20.2 6 21 7.5 21 9.1V20" />
    <path d="M8 3.5c.7 1.2 2.1 1.9 4 1.9s3.3-.7 4-1.9M12 5.4V20" />
    <path d="M5.2 11.5c1.8-1.5 4.7-1.2 6.8.7 2.1-1.9 5-2.2 6.8-.7M7 15.2c1.7.7 3.3.6 5-.3 1.7.9 3.3 1 5 .3" />
  </svg>
);

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
        title: "比较中国医美医生，",
        emphasis: "找到适合你的方案",
        subtitle: "先了解项目、查看已发布的医生资料与患者恢复日记，再决定是否出发。翻译、行程和术后支持由我们协调。",
        cases: "观看患者短视频",
        english: "英文协调员",
        englishDetail: "从抵达到随访 · WhatsApp 24/7",
        travel: "机场接送与酒店",
        travelDetail: "根据行程匹配酒店方案",
        pricing: "明细报价",
        pricingDetail: "出发前了解预计费用",
      }
    : lang === "ru"
      ? {
          badge: "Китайская платформа для международных пациентов",
          title: "Лучшие эстетические хирурги Китая —",
          emphasis: "на одной платформе",
          subtitle: "Сравните реальные случаи, квалификацию врачей и прозрачные цены до поездки. Мы организуем перевод, поездку и последующий уход.",
          cases: "Смотреть видео пациентов",
          english: "Координатор на английском",
          englishDetail: "От прилёта до наблюдения · WhatsApp 24/7",
          travel: "Трансфер и отель",
          travelDetail: "Отель подбирается под ваш маршрут",
          pricing: "Подробная смета",
          pricingDetail: "Ориентировочные расходы до поездки",
        }
      : {
          badge: "China's cosmetic care platform for international patients",
          title: "Compare cosmetic surgeons across China,",
          emphasis: "then choose with confidence",
          subtitle: "Understand procedures, review published doctor profiles and explore patient recovery diaries before you travel. We coordinate translation, travel and aftercare.",
          cases: "Watch patient recovery videos",
          english: "English coordinator",
          englishDetail: "From landing to follow-up · WhatsApp 24/7",
          travel: "Airport pickup & hotel",
          travelDetail: "Hotel options matched to your itinerary",
          pricing: "Itemized pricing",
          pricingDetail: "Understand estimated costs before you travel",
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

            <div className="mx-auto mt-7 flex max-w-lg justify-center">
              <Button asChild size="lg" className="h-12 w-full rounded-full px-8 text-sm font-semibold shadow-soft sm:w-auto sm:min-w-72">
                <Link to="/cases">{copy.cases}<ArrowRight className="ml-1.5 size-4" /></Link>
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
              {[
                { icon: Users, title: copy.english, detail: copy.englishDetail },
                { icon: MapPin, title: copy.travel, detail: copy.travelDetail },
                { icon: ShieldCheck, title: copy.pricing, detail: copy.pricingDetail },
              ].map((item) => (
                <span key={item.title} className="flex min-h-16 items-center gap-3 rounded-2xl border border-primary/10 bg-card/70 px-4 py-3 text-left shadow-soft backdrop-blur">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-card"><item.icon className="size-4 text-primary" /></span>
                  <span className="min-w-0">
                    <strong className="block font-display text-sm font-semibold leading-tight">{item.title}</strong>
                    <small className="mt-1 block text-[11px] leading-snug text-muted-foreground">{item.detail}</small>
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="w-full border-t border-primary/10 pt-10 md:pt-14">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 px-1 sm:flex-row sm:items-end md:mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                  <Sparkles className="size-3.5" /> {lang === "zh" ? "我们的核心优势" : "Our biggest difference"}
                </span>
                <h2 className="mt-2 max-w-4xl font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl">
                  {lang === "zh" ? "患者恢复日记，" : "Patient recovery diaries, "}
                  <em className="not-italic text-primary">{lang === "zh" ? "帮助你做功课" : "before you choose"}</em>
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  {lang === "zh" ? "了解咨询、治疗和恢复过程。只有完成核验的患者内容才会标记为已核验。" : "Explore consultation, treatment and recovery journeys. Only patient content that completes verification is labeled verified."}
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
      <div className="grid items-center gap-4 rounded-3xl bg-gradient-to-r from-[hsl(340,82%,92%)] via-[hsl(var(--primary)/.20)] to-[hsl(50,80%,92%)] p-4 shadow-soft sm:grid-cols-2 sm:p-6 md:grid-cols-4 md:p-7">
        {[
          { icon: Users, t: "1. Book your consultation", d: "Contact us by email or WhatsApp to choose a time" },
          { icon: Stethoscope, t: "2. Meet your doctor online", d: "Understand your options, expected results, risks and recovery" },
          { icon: Plane, t: "3. Travel to China for treatment", d: "We coordinate your arrival, clinic visit and translation" },
          { icon: MapPin, t: "4. Recover & explore China", d: "Recover with our support and enjoy a personalized itinerary" },
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
          <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
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
        onPointerDown={() => { cityRailPausedRef.current = true; }}
        onPointerUp={() => { cityRailPausedRef.current = false; }}
        onFocusCapture={() => { cityRailPausedRef.current = true; }}
        onBlurCapture={() => { cityRailPausedRef.current = false; }}
        className="-mx-4 flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-4 pb-4 scrollbar-hide md:-mx-6 md:gap-6 md:px-6"
      >
        {cities.map((c) => (
          <Link key={c.slug} to={`/cities/${c.slug}`} className="group block min-w-[84vw] snap-start sm:min-w-[62vw] md:min-w-[calc((100%_-_3rem)/3)] md:max-w-[calc((100%_-_3rem)/3)]">
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
                <div className="rounded-xl bg-secondary px-2 py-2.5"><p className="font-display text-base font-semibold">{lang === "zh" ? "医生资料" : "Doctor profiles"}</p><p className="text-[10px] text-muted-foreground">{lang === "zh" ? "审核后发布" : "published after review"}</p></div>
                <div className="rounded-xl bg-secondary px-2 py-2.5"><p className="font-display text-base font-semibold text-primary">{lang === "zh" ? "行程指南" : "Travel guide"}</p><p className="text-[10px] text-muted-foreground">{lang === "zh" ? "交通与住宿" : "logistics & stays"}</p></div>
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
    { en: "Nose", zh: "鼻部整形", icon: NoseLineIcon, items: [["Rhinoplasty", "鼻综合"], ["Revision Rhinoplasty", "鼻修复"], ["Septorhinoplasty", "功能性鼻整形"], ["Alar Base Reduction", "鼻翼缩小"], ["Nasal Tip Surgery", "鼻尖塑形"]] },
    { en: "Facial Rejuvenation", zh: "面部年轻化", icon: Sparkles, items: [["Facelift", "面部拉皮"], ["Neck Lift", "颈部提升"], ["Deep-Plane Facelift", "深层平面拉皮"], ["Mini Facelift", "小切口拉皮"], ["Brow Lift", "眉提升"], ["Facial Fat Grafting", "面部脂肪填充"]] },
    { en: "Eyes", zh: "眼部整形", icon: Eye, items: [["Double Eyelid Surgery", "双眼皮"], ["Upper Blepharoplasty", "上睑成形"], ["Lower Blepharoplasty", "下睑成形"], ["Ptosis Correction", "上睑下垂矫正"], ["Epicanthoplasty", "内眼角成形"]] },
    { en: "Face & Contour", zh: "面部轮廓", icon: JawContourLineIcon, items: [["Jaw Contouring", "下颌角整形"], ["Chin Augmentation", "下巴塑形"], ["Zygoma Reduction", "颧骨降低"], ["Genioplasty", "颏成形"], ["Otoplasty", "耳廓整形"]] },
    { en: "Breast", zh: "胸部整形", icon: BreastLineIcon, items: [["Breast Augmentation", "隆胸"], ["Breast Lift", "乳房提升"], ["Breast Reduction", "乳房缩小"], ["Implant Revision", "假体修复"], ["Implant Removal", "假体取出"]] },
    { en: "Body Contouring", zh: "身体塑形", icon: BodyContourLineIcon, items: [["Liposuction", "吸脂"], ["Tummy Tuck", "腹壁成形"], ["Mommy Makeover", "产后综合塑形"], ["Body Lift", "环形身体提升"], ["Fat Transfer", "自体脂肪移植"], ["Arm Lift", "上臂提升"]] },
    { en: "Hair Restoration", zh: "植发", icon: HairLineIcon, items: [["FUE Hair Transplant", "FUE 植发"], ["Hairline Restoration", "发际线种植"], ["Crown Restoration", "头顶加密"], ["Eyebrow Transplant", "眉毛种植"], ["Beard Transplant", "胡须种植"]] },
    { en: "Cosmetic Dentistry", zh: "牙齿美容", icon: ToothLineIcon, items: [["Dental Implants", "种植牙"], ["Porcelain Veneers", "瓷贴面"], ["Teeth Whitening", "牙齿美白"], ["Clear Aligners", "隐形矫正"], ["All-Ceramic Crowns", "全瓷牙冠"]] },
    { en: "Skin & Non-Surgical", zh: "皮肤与非手术", icon: Sparkles, items: [["Laser Skin Resurfacing", "激光皮肤重塑"], ["Pigmentation Treatment", "色斑治疗"], ["RF Microneedling", "射频微针"], ["Ultrasound Skin Tightening", "超声紧肤"], ["Botulinum Toxin", "肉毒素"], ["Dermal Fillers", "皮肤填充剂"]] },
    { en: "Lips & Smile", zh: "唇部与微笑", icon: LipsLineIcon, items: [["Lip Lift", "唇提升"], ["Lip Reduction", "厚唇改薄"], ["Lip Contouring", "唇形塑造"], ["Gummy Smile Correction", "露龈笑改善"], ["Lip Fillers", "唇部填充"]] },
    { en: "Post-Weight-Loss", zh: "减重后塑形", icon: Scale, items: [["Lower Body Lift", "下半身提升"], ["Arm Lift", "上臂提升"], ["Thigh Lift", "大腿提升"], ["Back Lift", "背部提升"], ["Skin Removal", "多余皮肤切除"]] },
    { en: "Men's Procedures", zh: "男性医美", icon: MaleChestLineIcon, items: [["Male Breast Reduction", "男性乳房缩小"], ["Male Liposuction", "男性吸脂"], ["Jawline Contouring", "下颌线塑形"], ["Hair Transplant", "男性植发"], ["Eyelid Surgery", "男性眼部整形"]] },
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
        className="-mx-4 flex touch-pan-x items-center gap-10 overflow-x-auto overscroll-x-contain px-4 py-6 scrollbar-hide md:-mx-6 md:gap-12 md:px-6"
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
  const [publishedDoctors, setPublishedDoctors] = useState<Array<{
    id: string; name: string; title: string; hospital: string; city: string;
    specialties: string[]; bio: string; photo_path: string | null;
  }>>([]);
  const doctorRailRef = useRef<HTMLDivElement>(null);
  const doctorRailPausedRef = useRef(false);
  const displayedDoctors = publishedDoctors.length > 0
    ? publishedDoctors.map((doctor) => ({ ...doctor, photo: doctor.photo_path ? supabase.storage.from("doctor-photos").getPublicUrl(doctor.photo_path).data.publicUrl : "", demo: false as const }))
    : DEMO_CHINA_DOCTORS.map((doctor) => ({ ...doctor, photo_path: null }));
  useEffect(() => {
    const chinaCities = ["Shanghai", "Beijing", "Guangzhou", "Hangzhou", "Hainan", "上海", "北京", "广州", "杭州", "海南"];
    supabase
      .from("doctors")
      .select("id,name,title,hospital,city,specialties,bio,photo_path")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const rows = (data ?? []).filter((doctor) => chinaCities.some((city) => doctor.city?.toLowerCase().includes(city.toLowerCase())));
        setPublishedDoctors(rows as typeof publishedDoctors);
      });
  }, []);
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
        onPointerDown={() => { doctorRailPausedRef.current = true; }}
        onPointerUp={() => { doctorRailPausedRef.current = false; }}
        onFocusCapture={() => { doctorRailPausedRef.current = true; }}
        onBlurCapture={() => { doctorRailPausedRef.current = false; }}
        className="-mx-4 flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-4 pb-4 scrollbar-hide md:-mx-6 md:gap-6 md:px-6"
      >
        {displayedDoctors.map((d) => {
          const photo = d.photo;
          return (
          <article
            key={d.id}
            className="group block min-w-[84vw] snap-start sm:min-w-[62vw] md:min-w-[calc((100%_-_3rem)/3)] md:max-w-[calc((100%_-_3rem)/3)]"
          >
            <div className="flex h-[410px] flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition duration-300 group-hover:-translate-y-1 group-hover:border-primary/35 group-hover:shadow-pop md:p-6">
              <div className="flex min-w-0 items-center gap-4">
                {photo ? <img src={photo} alt={d.name} className="size-24 shrink-0 rounded-full border-2 border-primary/15 object-cover transition-transform duration-500 group-hover:scale-105 md:size-28" /> : <div className="grid size-24 shrink-0 place-items-center rounded-full bg-primary/10 text-primary md:size-28"><Stethoscope className="size-10" /></div>}
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-semibold leading-tight text-foreground md:text-2xl">{d.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm font-medium text-muted-foreground">{d.title}</p>
                  {d.demo && <span className="mt-2 inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-accent-foreground">Sample profile</span>}
                </div>
              </div>

              <p className="mt-5 flex items-center gap-2 text-sm text-foreground/80"><MapPin className="size-4 text-primary" />{d.city} · {d.hospital}</p>
              <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{d.bio}</p>
              <div className="mt-4 flex flex-wrap gap-1.5 overflow-hidden max-h-[54px]">
                {d.specialties.slice(0, 3).map((s) => (
                  <span key={s} className="rounded-full bg-accent px-2.5 py-1 text-[11px] text-accent-foreground">{s}</span>
                ))}
              </div>

              <div className="mt-auto grid grid-cols-[0.9fr_1.1fr] gap-2">
                <Link
                  to={d.demo ? "/doctors" : `/doctors/profile/${d.id}`}
                  className="flex items-center justify-center rounded-xl border border-primary/30 bg-card px-3 py-3 text-center text-xs font-semibold text-primary transition hover:bg-primary/10"
                >
                  {lang === "zh" ? "医生与案例" : "Doctor & cases"}
                </Link>
                <button
                  type="button"
                  onClick={() => open({ doctorName: d.name, city: d.city })}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  {lang === "zh" ? "预约免费视频咨询" : "Book a Free Video Consultation"}<ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </article>
        )})}
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
      title: zh ? "预约免费视频咨询" : "Book a Free Video Consultation",
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

        <div className="relative -mx-5 mt-7 flex touch-pan-x snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-5 pb-2 scrollbar-hide md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0">
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

const HomeFaq = () => {
  const { lang } = useAsia();
  const zh = lang === "zh";
  const questions = [
    {
      q: zh ? "我需要向 Cosmetics Asia 支付费用吗？" : "Do I need to pay Cosmetics Asia?",
      a: zh
        ? "你可以选择我们的三档旅行支持套餐。免费套餐不收取服务费，但需要支付 400 美元协调押金，以便我们提前安排接送、翻译、酒店及院内陪同。你抵达诊所后，押金会退还。"
        : "You can choose from three travel-support packages. Our Free Package has no service fee, but it requires a $400 coordination deposit so we can prepare transfers, translation, hotel support and in-hospital accompaniment. The deposit is refunded after you arrive at the clinic.",
    },
    {
      q: zh ? "400 美元押金是做什么用的？" : "What is the $400 deposit for?",
      a: zh
        ? "押金用于确认你的行程，并让协调团队在你抵达前开始准备相关服务。它不是平台服务费，也不是额外的医疗费用。"
        : "The deposit confirms your trip and allows our coordination team to begin preparing services before you arrive. It is not a platform service fee or an additional medical charge.",
    },
    {
      q: zh ? "手术和治疗费用支付给谁？" : "Who receives my medical payment?",
      a: zh
        ? "全部手术、检查、麻醉及其他医疗费用均由诊所或医院直接收取。Cosmetics Asia 不代收医疗费用。"
        : "All surgery, examination, anesthesia and other medical fees are charged directly by the clinic or hospital. Cosmetics Asia does not collect your medical payment.",
    },
    {
      q: zh ? "必须购买付费旅行套餐吗？" : "Do I have to buy a paid travel package?",
      a: zh
        ? "不需要。你可以选择免费套餐，也可以根据住宿、陪同时间及私人行程需求升级到金牌或钻石套餐。"
        : "No. You may choose the Free Package, or upgrade to Gold or Diamond if you want additional accommodation, longer accompaniment or a private itinerary.",
    },
    {
      q: zh ? "你们如何审核医生资料？" : "How do you review surgeon credentials?",
      a: zh ? "我们要求医生或机构提交执业、任职与专业资料，并在公开展示前进行资料审核。未完成审核的资料不会标记为已核验。最终请同时向接诊机构和当地主管部门确认。" : "We request licensing, hospital affiliation and specialty information from the doctor or clinic and review it before publication. Incomplete profiles are not labeled verified. You should also confirm credentials with the treating facility and relevant local authority.",
    },
    {
      q: zh ? "回国后出现问题怎么办？" : "What if I have a concern after returning home?",
      a: zh ? "我们可以协助你整理情况并联系原诊所，但不能替代急诊或本地医生。出现紧急症状时，应立即联系当地急救服务或持证医生。" : "We can help organize your information and contact the treating clinic, but we do not replace emergency or local medical care. Seek urgent help from local emergency services or a licensed clinician if symptoms are concerning.",
    },
    {
      q: zh ? "线上咨询可以使用英语吗？" : "Can my consultation be conducted in English?",
      a: zh ? "可以。我们会根据已确认的预约安排英语沟通支持；具体形式可能是英语医生或双语协调员陪同。" : "Yes. We arrange confirmed English-language support for the appointment, either with an English-speaking clinician or a bilingual coordinator, depending on availability.",
    },
    {
      q: zh ? "我的医疗资料如何使用？" : "How is my medical information handled?",
      a: zh ? "资料仅用于你授权的咨询和行程协调，并只向相关服务方提供必要信息。请勿通过公开评论或社交媒体发送敏感病历。" : "Information is used for the consultation and coordination you authorize, and only necessary details are shared with relevant service providers. Do not send sensitive records through public comments or social media.",
    },
  ];

  return (
    <section className="container py-12 md:py-16" aria-labelledby="home-faq-title">
      <div className="grid gap-7 rounded-[2rem] border border-primary/15 bg-card p-5 shadow-soft md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] md:p-10">
        <div className="md:pr-8">
          <span className="pill mb-3 bg-accent text-accent-foreground"><HelpCircle className="size-3.5" /> {zh ? "费用常见问题" : "Payment FAQ"}</span>
          <h2 id="home-faq-title" className="font-display text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
            {zh ? "费用由谁收取，" : "Who gets paid, "}<em className="not-italic text-primary">{zh ? "出发前先说清楚" : "made clear before you travel"}</em>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            {zh ? "旅行支持费用与医疗费用分开处理，避免隐藏收费和付款混淆。" : "Travel-support costs and medical payments are handled separately, so you know exactly who receives each payment."}
          </p>
          <Link to="/travel-packages" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
            {zh ? "查看三档旅行套餐" : "Compare all travel packages"}<ArrowRight className="size-4" />
          </Link>
        </div>

        <Accordion type="single" collapsible defaultValue="payment" className="overflow-hidden rounded-2xl border border-border/80 bg-background/60 px-4 sm:px-5">
          {questions.map((item, index) => (
            <AccordionItem key={item.q} value={index === 0 ? "payment" : `faq-${index}`} className="border-border/70">
              <AccordionTrigger className="gap-4 py-5 text-left text-sm font-semibold hover:no-underline sm:text-base">
                <span className="flex items-start gap-3"><span className="mt-0.5 font-mono text-[10px] text-primary">0{index + 1}</span>{item.q}</span>
              </AccordionTrigger>
              <AccordionContent className="pl-8 pr-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
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
        <DoctorsSection />
        <TreatmentsSection />
        <HowItWorks />
        <HomeFaq />
        <CitiesSection />
        <AppPromoSection />
      </main>
      <Footer />
    </div>
  </>
);

export default AsiaIndex;

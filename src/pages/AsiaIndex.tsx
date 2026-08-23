import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, ArrowRight, Star, MapPin, ShieldCheck,
  Stethoscope, Building2,
  Flame, Gift, Wallet, Users, Plane,
  ChevronLeft, ChevronRight, Eye,
  Scale, HelpCircle, HeartPulse, MessageCircle, Video,
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
import journeyConsultation from "@/assets/journey-real-consultation.webp";
import journeyOnline from "@/assets/journey-real-online.webp";
import journeyArrival from "@/assets/journey-real-arrival.webp";
import journeySupport from "@/assets/journey-real-support.webp";
import journeyRecovery from "@/assets/journey-real-recovery.webp";
import journeyFollowUp from "@/assets/journey-real-follow-up.webp";
import AppPromoSection from "@/components/AppPromoSection";
import { supabase } from "@/integrations/supabase/client";
import { signedUrls } from "@/lib/storage-urls";
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
        consultation: "在线面诊",
        consultationDetail: "出发前与医生进行一对一线上沟通",
        english: "英文院内翻译",
        englishDetail: "协助就诊期间的现场沟通",
        travel: "机场接送",
        travelDetail: "机场与目的地之间的专车接送",
        pricing: "术后支持",
        pricingDetail: "恢复期间提供持续协调",
      }
    : lang === "ru"
      ? {
          badge: "Китайская платформа для международных пациентов",
          title: "Лучшие эстетические хирурги Китая —",
          emphasis: "на одной платформе",
          subtitle: "Сравните реальные случаи, квалификацию врачей и прозрачные цены до поездки. Мы организуем перевод, поездку и последующий уход.",
          cases: "Смотреть видео пациентов",
          consultation: "Онлайн-консультация",
          consultationDetail: "Встреча с врачом онлайн до поездки",
          english: "Переводчик в клинике",
          englishDetail: "Помощь в общении во время визита",
          travel: "Трансфер из аэропорта",
          travelDetail: "Индивидуальный трансфер до места назначения",
          pricing: "Поддержка после лечения",
          pricingDetail: "Координация во время восстановления",
        }
      : {
          badge: "China's cosmetic care platform for international patients",
          title: "Compare cosmetic surgeons across China,",
          emphasis: "then choose with confidence",
          subtitle: "Understand procedures, review published doctor profiles and explore patient recovery diaries before you travel.",
          cases: "Watch patient recovery videos",
          consultation: "Online consultation",
          consultationDetail: "Meet your doctor online before you travel",
          english: "English in-clinic translation",
          englishDetail: "Communication support during clinic visits",
          travel: "Airport pickup & drop-off",
          travelDetail: "Private transfer to and from your destination",
          pricing: "Aftercare support",
          pricingDetail: "Coordinated support throughout recovery",
        };
  return (
    <section className="hero-motion relative overflow-hidden">
      <div className="hero-motion__background absolute inset-x-0 top-0 h-[720px] sm:h-[780px]" aria-hidden="true">
        <img src={heroBg} alt="" className="hero-motion__image absolute inset-0 size-full object-cover" />
        <video
          className="hero-motion__video absolute inset-0 size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/source/shanghai-consultation.webp"
        >
          <source src="/video/cosmetics-asia-hero-stabilized.mp4?v=1" type="video/mp4" />
        </video>
        <div className="hero-motion__veil absolute inset-0" />
      </div>

      <div className="container relative pb-9 pt-8 sm:py-14 md:py-20">
        <div className="flex flex-col gap-8 md:gap-14">
          <div className="text-center max-w-3xl mx-auto w-full">
            <span className="pill max-w-full justify-center bg-card/80 text-center leading-relaxed shadow-soft backdrop-blur">
              <ShieldCheck className="size-3.5 text-primary" />
              {copy.badge}
            </span>
            <h1 className="mt-4 font-display text-[2.35rem] font-medium leading-[1.01] tracking-tight min-[390px]:text-[2.55rem] sm:mt-5 sm:text-5xl md:text-6xl">
              {copy.title}<br />
              <em className="text-primary not-italic">{copy.emphasis}</em>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-[15px] md:text-lg">{copy.subtitle}</p>

            <div className="mx-auto mt-6 flex max-w-lg justify-center sm:mt-7">
              <Button asChild size="lg" className="h-[3.25rem] w-full rounded-2xl px-8 text-[15px] font-semibold shadow-pop sm:h-12 sm:w-auto sm:min-w-72 sm:rounded-full">
                <Link to="/cases">{copy.cases}<ArrowRight className="ml-1.5 size-4" /></Link>
              </Button>
            </div>

            <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide sm:mx-0 sm:mt-8 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
              {[
                { icon: Video, title: copy.consultation, detail: copy.consultationDetail },
                { icon: MapPin, title: copy.travel, detail: copy.travelDetail },
                { icon: Users, title: copy.english, detail: copy.englishDetail },
                { icon: ShieldCheck, title: copy.pricing, detail: copy.pricingDetail },
              ].map((item) => (
                <span key={item.title} className="flex min-h-[4.5rem] min-w-[76vw] snap-center items-center gap-3 rounded-2xl border border-white/60 bg-white/45 px-4 py-3 text-left shadow-[0_12px_32px_rgba(18,55,45,0.09)] backdrop-blur-xl sm:min-h-16 sm:min-w-0">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/60 bg-white/55 backdrop-blur-md"><item.icon className="size-4 text-primary" /></span>
                  <span className="min-w-0">
                    <strong className="block font-display text-sm font-semibold leading-tight">{item.title}</strong>
                    <small className="mt-1 block text-[11px] leading-snug text-muted-foreground">{item.detail}</small>
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="w-full border-t border-primary/10 pt-8 md:pt-14">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 px-1 sm:flex-row sm:items-end md:mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                  <Sparkles className="size-3.5" /> {lang === "zh" ? "我们的核心优势" : lang === "ru" ? "Наше главное отличие" : "Our biggest difference"}
                </span>
                <h2 className="mt-2 max-w-4xl font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl">
                  {lang === "zh" ? "患者恢复日记，" : lang === "ru" ? "Дневники восстановления пациентов — " : "Patient recovery diaries, "}
                  <em className="not-italic text-primary">{lang === "zh" ? "帮助你做功课" : lang === "ru" ? "изучите до выбора" : "before you choose"}</em>
                </h2>
              </div>
              <Link
                to="/cases"
                className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-pop sm:w-auto sm:text-xs"
              >
                {lang === "zh" ? "浏览全部日记" : lang === "ru" ? "Все дневники" : "Explore all diaries"} <ArrowRight className="size-3.5" />
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
  const [activeStep, setActiveStep] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const journeyCopy = lang === "zh"
    ? { eyebrow: "服务流程", title: "你的中国", emphasis: "医疗之旅", cta: "查看完整流程", step: "步骤", previous: "上一步", next: "下一步" }
    : lang === "ru"
      ? { eyebrow: "Как это работает", title: "Ваш путь к", emphasis: "лечению в Китае", cta: "Посмотреть весь путь", step: "Шаг", previous: "Предыдущий шаг", next: "Следующий шаг" }
      : { eyebrow: "How it works", title: "Your journey to", emphasis: "care in China", cta: "See full journey", step: "Step", previous: "Previous step", next: "Next step" };
  const localizedSteps = [
    {
      icon: Users,
      image: journeyConsultation,
      en: ["Book your consultation", "Choose a doctor—or let us recommend suitable specialists"],
      zh: ["预约咨询", "选择心仪医生，或让我们为你推荐合适的专家"],
      ru: ["Запишитесь на консультацию", "Выберите врача или позвольте нам подобрать подходящего специалиста"],
    },
    {
      icon: Stethoscope,
      image: journeyOnline,
      en: ["Meet your doctor online", "Review options, expected results, risks and recovery"],
      zh: ["线上会见医生", "了解治疗选择、预期效果、风险与恢复过程"],
      ru: ["Встретьтесь с врачом онлайн", "Обсудите варианты, ожидаемые результаты, риски и восстановление"],
    },
    {
      icon: Plane,
      image: journeyArrival,
      en: ["Arrange travel & visa", "Confirm flights, documents, pickup and accommodation"],
      zh: ["安排行程与签证", "确认航班、文件、接机与住宿安排"],
      ru: ["Организуйте поездку и визу", "Подтвердите перелёт, документы, трансфер и проживание"],
    },
    {
      icon: MapPin,
      image: journeySupport,
      en: ["Receive on-ground support", "Get coordinated arrival, translation and clinic assistance"],
      zh: ["获得落地支持", "协调抵达、院内翻译与就诊协助"],
      ru: ["Получите поддержку на месте", "Помощь по прибытии, перевод и сопровождение в клинике"],
    },
    {
      icon: HeartPulse,
      image: journeyRecovery,
      en: ["Treatment & recovery", "Recover with practical support around your care plan"],
      zh: ["治疗与恢复", "根据你的治疗计划获得实用的恢复支持"],
      ru: ["Лечение и восстановление", "Получайте практическую поддержку по вашему плану лечения"],
    },
    {
      icon: MessageCircle,
      image: journeyFollowUp,
      en: ["Follow up from home", "Stay connected and coordinate remote follow-up when needed"],
      zh: ["回国后随访", "保持联系，并在需要时协调远程复诊"],
      ru: ["Наблюдение после возвращения", "Оставайтесь на связи и при необходимости организуйте онлайн-приём"],
    },
  ];
  const steps = localizedSteps.map((item) => {
    const [t, d] = item[lang === "zh" ? "zh" : lang === "ru" ? "ru" : "en"];
    return { icon: item.icon, image: item.image, t, d };
  });

  const showStep = (next: number) => {
    const normalized = (next + steps.length) % steps.length;
    setActiveStep(normalized);
    const rail = railRef.current;
    const card = rail?.children[normalized] as HTMLElement | undefined;
    if (!rail || !card) return;
    const left = card.offsetLeft - rail.offsetLeft - Math.max(0, (rail.clientWidth - card.clientWidth) / 2);
    rail.scrollTo({ left, behavior: "smooth" });
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (!pausedRef.current && !document.hidden) {
        setActiveStep((current) => {
          const next = (current + 1) % steps.length;
          const rail = railRef.current;
          const card = rail?.children[next] as HTMLElement | undefined;
          if (rail && card) {
            const left = card.offsetLeft - rail.offsetLeft - Math.max(0, (rail.clientWidth - card.clientWidth) / 2);
            rail.scrollTo({ left, behavior: "smooth" });
          }
          return next;
        });
      }
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="container py-7 md:py-10" aria-labelledby="home-journey-title">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 px-1 sm:flex-row sm:items-end md:mb-8">
        <div>
          <span className="pill mb-3 bg-accent text-accent-foreground">
            <Plane className="size-3.5" /> {journeyCopy.eyebrow}
          </span>
          <h2 id="home-journey-title" className="font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {journeyCopy.title} <em className="not-italic text-primary">{journeyCopy.emphasis}</em>
          </h2>
        </div>
        <Link to="/travel-packages" className="hidden min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-pop sm:inline-flex">
          {journeyCopy.cta} <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[hsl(158,58%,90%)] via-[hsl(145,48%,91%)] to-[hsl(50,80%,91%)] py-5 shadow-pop md:py-7">
        <div className="pointer-events-none absolute left-[8%] right-[8%] top-[7.65rem] hidden h-px bg-primary/30 md:block" aria-hidden="true" />
        <div
          ref={railRef}
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
          onPointerDown={() => { pausedRef.current = true; }}
          onPointerUp={() => { pausedRef.current = false; }}
          onFocusCapture={() => { pausedRef.current = true; }}
          onBlurCapture={() => { pausedRef.current = false; }}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-3 scrollbar-hide md:gap-5 md:px-6"
        >
          {steps.map((x, index) => (
            <article
              key={x.t}
              onClick={() => showStep(index)}
              className={`group relative min-w-[82vw] cursor-pointer snap-center overflow-hidden rounded-[1.6rem] border bg-card shadow-soft transition-all duration-500 sm:min-w-[55vw] md:min-w-[calc((100%_-_2.5rem)/3)] ${activeStep === index ? "border-primary/60 shadow-pop md:-translate-y-1" : "border-white/70 opacity-80 hover:opacity-100"}`}
            >
              <div className="relative h-40 overflow-hidden md:h-44">
                <img
                  src={x.image}
                  alt=""
                  loading={index < 3 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover saturate-[0.88] transition-transform duration-700 group-hover:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/45 via-transparent to-white/5" />
                <span className="absolute right-4 top-3 font-display text-5xl font-semibold text-white/70" aria-hidden="true">0{index + 1}</span>
                <div className="absolute bottom-4 left-4 grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-pop">
                  <x.icon className="size-5" />
                </div>
              </div>
              <div className="min-h-[9.25rem] p-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-primary">{journeyCopy.step} {index + 1}</span>
                <h3 className="mt-1 font-display text-xl font-semibold leading-tight text-foreground">{x.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/68">{x.d}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-1 flex items-center justify-center gap-3 px-5">
          <button type="button" onClick={() => showStep(activeStep - 1)} className="grid size-10 place-items-center rounded-full border border-primary/20 bg-card/80 text-foreground backdrop-blur-md transition hover:border-primary hover:text-primary" aria-label={journeyCopy.previous}><ChevronLeft className="size-5" /></button>
          <div className="flex items-center gap-1.5" aria-label={`Step ${activeStep + 1} of ${steps.length}`}>
            {steps.map((step, index) => (
              <button key={step.t} type="button" onClick={() => showStep(index)} className={`h-2 rounded-full transition-all ${activeStep === index ? "w-8 bg-primary" : "w-2 bg-card/80 hover:bg-primary/40"}`} aria-label={`Show step ${index + 1}`} />
            ))}
          </div>
          <button type="button" onClick={() => showStep(activeStep + 1)} className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft transition hover:bg-primary/90" aria-label={journeyCopy.next}><ChevronRight className="size-5" /></button>
        </div>
      </div>
      <Link to="/travel-packages" className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground sm:hidden">
        {journeyCopy.cta} <ArrowRight className="size-4" />
      </Link>
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
    <section id="cities" className="container py-10 md:py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8">
        <div>
          <span className="pill bg-accent text-accent-foreground mb-3"><MapPin className="size-3.5" /> {t("cities.kicker")}</span>
          <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
            {t("cities.title1")} <em className="text-primary not-italic">{t("cities.titleEm")}</em>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => moveCities(-1)} className="grid size-10 place-items-center rounded-full border border-border bg-card text-foreground shadow-soft transition hover:border-primary hover:text-primary" aria-label={lang === "zh" ? "上一组城市" : lang === "ru" ? "Предыдущие города" : "Previous cities"}><ChevronLeft className="size-5" /></button>
          <button type="button" onClick={() => moveCities(1)} className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft transition hover:bg-primary/90" aria-label={lang === "zh" ? "下一组城市" : lang === "ru" ? "Следующие города" : "More cities"}><ChevronRight className="size-5" /></button>
          <Link to="/cities" className="pill ml-1 hidden bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:inline-flex">{lang === "zh" ? "全部城市" : lang === "ru" ? "Все города" : "All cities"}<ArrowRight className="size-4" /></Link>
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
          <Link key={c.slug} to={`/cities/${c.slug}`} className="group block min-w-[82vw] snap-center sm:min-w-[62vw] md:min-w-[calc((100%_-_3rem)/3)] md:max-w-[calc((100%_-_3rem)/3)]">
            <article className="flex h-[390px] flex-col rounded-3xl border border-border bg-card p-5 shadow-soft transition duration-300 group-hover:-translate-y-1 group-hover:border-primary/35 group-hover:shadow-pop md:h-[410px] md:p-6">
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
                <div className="rounded-xl bg-secondary px-2 py-2.5"><p className="font-display text-base font-semibold">{lang === "zh" ? "医生资料" : lang === "ru" ? "Профили врачей" : "Doctor profiles"}</p><p className="text-[10px] text-muted-foreground">{lang === "zh" ? "审核后发布" : lang === "ru" ? "после проверки" : "published after review"}</p></div>
                <div className="rounded-xl bg-secondary px-2 py-2.5"><p className="font-display text-base font-semibold text-primary">{lang === "zh" ? "行程指南" : lang === "ru" ? "Гид по поездке" : "Travel guide"}</p><p className="text-[10px] text-muted-foreground">{lang === "zh" ? "交通与住宿" : lang === "ru" ? "транспорт и проживание" : "logistics & stays"}</p></div>
              </div>
              <div className="mt-4 flex max-h-[50px] flex-wrap gap-1.5 overflow-hidden">
                {(lang === "zh" ? c.hotZh : c.hotEn).slice(0, 3).map((h) => <span key={h} className="rounded-full bg-accent px-2.5 py-1 text-[10px] text-accent-foreground">{h}</span>)}
              </div>
              <div className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground transition group-hover:bg-primary/90">
                {lang === "zh" ? "查看城市与医生" : lang === "ru" ? "Город и врачи" : "Explore city & doctors"}<ArrowRight className="size-4" />
              </div>
            </article>
          </Link>
        ))}
      </div>
      <div className="mt-2 flex justify-center sm:hidden">
        <Link to="/cities" className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
          {lang === "zh" ? "查看全部城市" : lang === "ru" ? "Все города" : "All cities"} <ArrowRight className="size-4" />
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
  const itemStyles = [
    "text-[1.7rem] text-primary md:text-3xl",
    "text-xl text-foreground md:text-2xl",
    "text-base text-foreground/72 md:text-lg",
    "text-base text-foreground/60 md:text-lg",
    "text-sm text-primary md:text-base",
    "text-sm text-foreground/65 md:text-base",
  ];
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
    <section id="projects" className="container py-10 md:py-16">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 md:mb-8">
        <div>
          <span className="pill bg-accent text-accent-foreground mb-3"><Flame className="size-3.5" /> {t("tx.kicker")}</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
            {t("tx.title1")} <em className="text-primary not-italic">{t("tx.titleEm")}</em>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => moveTreatmentClouds(-1)} className="grid size-10 place-items-center rounded-full border border-border bg-card text-foreground shadow-soft transition hover:border-primary hover:text-primary" aria-label={lang === "zh" ? "上一组手术类型" : lang === "ru" ? "Предыдущие группы процедур" : "Previous procedure groups"}>
            <ChevronLeft className="size-5" />
          </button>
          <button type="button" onClick={() => moveTreatmentClouds(1)} className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft transition hover:bg-primary/90" aria-label={lang === "zh" ? "下一组手术类型" : lang === "ru" ? "Следующие группы процедур" : "Next procedure groups"}>
            <ChevronRight className="size-5" />
          </button>
          <Link to="/treatments" className="pill hidden bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:inline-flex">
            {lang === "zh" ? "全部项目" : lang === "ru" ? "Все процедуры" : "All procedures"}<ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
      <div
        ref={treatmentCloudRailRef}
        onMouseEnter={() => { treatmentCloudPausedRef.current = true; }}
        onMouseLeave={() => { treatmentCloudPausedRef.current = false; }}
        onTouchStart={() => { treatmentCloudPausedRef.current = true; }}
        onTouchEnd={() => { treatmentCloudPausedRef.current = false; }}
        onFocusCapture={() => { treatmentCloudPausedRef.current = true; }}
        onBlurCapture={() => { treatmentCloudPausedRef.current = false; }}
        className="-mx-4 flex touch-pan-x items-stretch gap-8 overflow-x-auto overscroll-x-contain px-4 py-6 scrollbar-hide sm:gap-9 md:-mx-6 md:gap-10 md:px-6 lg:[mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]"
      >
        {[...procedureClouds, ...procedureClouds].map((cloud, repeatedIndex) => {
          const cloudIndex = repeatedIndex % procedureClouds.length;
          const duplicate = repeatedIndex >= procedureClouds.length;
          const CloudIcon = cloud.icon;
          return (
          <article key={`${cloud.en}-${duplicate ? "loop" : "primary"}`} aria-hidden={duplicate || undefined} className="group relative flex min-h-[310px] w-[82vw] min-w-[82vw] shrink-0 flex-col justify-center px-3 py-5 transition duration-500 hover:-translate-y-1 sm:w-[56vw] sm:min-w-[56vw] md:w-[calc((100%_-_5rem)/3)] md:min-w-[calc((100%_-_5rem)/3)] lg:w-[calc((100%_-_7.5rem)/4)] lg:min-w-[calc((100%_-_7.5rem)/4)]">
            <span className="absolute right-0 top-2 font-display text-6xl font-semibold leading-none text-foreground/[0.04]">0{cloudIndex + 1}</span>
            <div className="mb-5 flex justify-center" aria-hidden="true">
              <CloudIcon strokeWidth={1.35} className="size-14 text-primary transition duration-500 group-hover:scale-110 md:size-16" />
            </div>
            <div className="relative flex items-center justify-between gap-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{lang === "zh" ? cloud.zh : cloud.en}</h3>
              <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
            </div>
            <div className="relative mt-7 flex flex-wrap content-center items-baseline justify-center gap-x-3.5 gap-y-2 text-center">
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
    specialties: string[]; bio: string; photo_path: string | null; photo?: string;
  }>>([]);
  const doctorRailRef = useRef<HTMLDivElement>(null);
  const doctorRailPausedRef = useRef(false);
  const displayedDoctors = publishedDoctors.length > 0
    ? publishedDoctors.map((doctor) => ({ ...doctor, photo: doctor.photo ?? "", demo: false as const }))
    : DEMO_CHINA_DOCTORS.map((doctor) => ({ ...doctor, photo_path: null }));
  useEffect(() => {
    const chinaCities = ["Shanghai", "Beijing", "Guangzhou", "Hangzhou", "Hainan", "上海", "北京", "广州", "杭州", "海南"];
    supabase
      .from("doctors")
      .select("id,name,title,hospital,city,specialties,bio,photo_path")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .then(async ({ data }) => {
        const rows = (data ?? []).filter((doctor) => chinaCities.some((city) => doctor.city?.toLowerCase().includes(city.toLowerCase())));
        const photos = await signedUrls("doctor-photos", rows.map((doctor) => doctor.photo_path));
        setPublishedDoctors(rows.map((doctor, index) => ({ ...doctor, photo: photos[index] })) as typeof publishedDoctors);
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
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <section id="compliance" className="container py-10 md:py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8">
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
            aria-label={lang === "zh" ? "查看上一组医生" : lang === "ru" ? "Предыдущие врачи" : "Previous surgeons"}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => moveDoctors(1)}
            className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft transition hover:bg-primary/90"
            aria-label={lang === "zh" ? "查看更多医生" : lang === "ru" ? "Следующие врачи" : "More surgeons"}
          >
            <ChevronRight className="size-5" />
          </button>
          <Link
            to="/doctors"
            className="pill ml-1 hidden bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:inline-flex"
          >
            {lang === "zh" ? "全部医师" : lang === "ru" ? "Все врачи" : "All surgeons"} <ArrowRight className="size-4" />
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
            className="group block min-w-[82vw] snap-center sm:min-w-[62vw] md:min-w-[calc((100%_-_3rem)/3)] md:max-w-[calc((100%_-_3rem)/3)]"
          >
            <div className="flex h-[395px] flex-col rounded-3xl border border-border bg-card p-5 shadow-soft transition duration-300 group-hover:-translate-y-1 group-hover:border-primary/35 group-hover:shadow-pop md:h-[410px] md:p-6">
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
                  className="flex min-h-12 items-center justify-center rounded-xl border border-primary/30 bg-card px-3 py-3 text-center text-xs font-semibold text-primary transition hover:bg-primary/10"
                >
                  {lang === "zh" ? "医生与案例" : lang === "ru" ? "Врач и случаи" : "Doctor & cases"}
                </Link>
                <button
                  type="button"
                  onClick={() => open({ doctorName: d.name, city: d.city })}
                  className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-3 text-center text-[13px] font-semibold leading-tight text-primary-foreground transition hover:bg-primary/90"
                >
                  {lang === "zh" ? "预约免费视频咨询" : lang === "ru" ? "Бесплатная видеоконсультация" : "Book a Free Video Consultation"}<ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </article>
        )})}
      </div>
      <div className="mt-2 flex justify-center sm:hidden">
        <Link to="/doctors" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          {lang === "zh" ? "查看全部医师" : lang === "ru" ? "Все врачи" : "Browse all surgeons"}<ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const { lang } = useAsia();
  const { open } = useQuote();
  const copy = lang === "zh"
    ? {
        eyebrow: "免费线上咨询",
        title: "不知道从哪里开始？",
        emphasis: "先和我们在线聊聊",
        text: "告诉我们你关注的项目、预算和希望前往的城市。我们会帮你梳理需求，并协助你找到合适的中国医生。",
        cta: "预约免费线上咨询",
      }
    : lang === "ru"
      ? {
          eyebrow: "Бесплатная онлайн-консультация",
          title: "Не знаете, с чего начать?",
          emphasis: "Поговорите с нами онлайн",
          text: "Расскажите о процедуре, бюджете и желаемом городе. Мы поможем уточнить ваши потребности и подобрать подходящего врача в Китае.",
          cta: "Записаться бесплатно",
        }
      : {
          eyebrow: "Free online consultation",
          title: "Not sure where to start?",
          emphasis: "Meet with us online",
          text: "Tell us the procedure, budget and city you have in mind. We’ll help clarify your needs and connect you with a suitable doctor in China.",
          cta: "Book a free online consultation",
        };

  return (
    <section className="container py-12 md:py-16">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[hsl(190,70%,92%)] via-[hsl(var(--primary)/.20)] to-[hsl(50,80%,92%)] px-5 py-9 text-foreground shadow-pop md:px-10 md:py-12">
        <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-white/25" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full bg-primary/10" />
        <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="max-w-3xl">
            <span className="pill mb-3 bg-white/85 text-foreground"><MessageCircle className="size-3.5 text-primary" /> {copy.eyebrow}</span>
            <h2 className="font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {copy.title} <em className="text-primary not-italic">{copy.emphasis}</em>
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/70 md:text-lg">{copy.text}</p>
          </div>
          <Button size="lg" onClick={() => open()} className="min-h-12 w-full shrink-0 rounded-full bg-primary px-7 text-primary-foreground shadow-pop hover:bg-primary/90 md:w-fit">
            {copy.cta}<ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

const HomeFaq = () => {
  const { lang } = useAsia();
  const zh = lang === "zh";
  const ru = lang === "ru";
  const c = (en: string, cn: string, Russian: string) => zh ? cn : ru ? Russian : en;
  const questions = [
    {
      q: c("Do I need to pay Cosmetics Asia?", "我需要向 Cosmetics Asia 支付费用吗？", "Нужно ли платить Cosmetics Asia?"),
      a: c("Medical fees are paid directly to the treating clinic or hospital; Cosmetics Asia does not collect them. Before you depart, we collect a $400 coordination deposit to confirm and coordinate your airport pickup and secure your procedure appointment slot. The $400 deposit is refunded when you pay the clinic for your procedure.", "医疗费用全部由诊所或医院直接收取，Cosmetics Asia 不代收。在你出发前，我们会收取 400 美元协调押金，用于确认并协调机场接送，以及确认并保留你的手术预约名额。当你在诊所支付手术费用时，这笔 400 美元押金将退还给你。", "Медицинские услуги оплачиваются напрямую клинике или больнице; Cosmetics Asia их не принимает. До вашего вылета мы взимаем координационный депозит в размере 400 долларов, чтобы подтвердить и организовать трансфер из аэропорта, а также закрепить за вами время проведения процедуры. Депозит возвращается, когда вы оплачиваете процедуру в клинике."),
    },
    {
      q: c("What is the $400 deposit for?", "400 美元押金是做什么用的？", "Для чего нужен депозит $400?"),
      a: c("The $400 deposit is collected before departure so our team can confirm and coordinate your airport pickup and secure your procedure appointment slot. It is not an additional medical charge. We refund it when you pay the clinic for your procedure.", "这笔 400 美元押金会在你出发前收取，用于确认并协调机场接送，以及确认并保留你的手术预约名额。它不是额外的医疗费用；当你在诊所支付手术费用时，我们会将押金退还给你。", "Депозит в размере 400 долларов взимается до вылета, чтобы наша команда могла подтвердить и организовать трансфер из аэропорта, а также закрепить за вами время проведения процедуры. Это не дополнительная медицинская плата. Мы возвращаем депозит, когда вы оплачиваете процедуру в клинике."),
    },
    {
      q: c("Who receives my medical payment?", "手术和治疗费用支付给谁？", "Кому оплачиваются медицинские услуги?"),
      a: c("All surgery, examination, anesthesia and other medical fees are charged directly by the clinic or hospital. Cosmetics Asia does not collect your medical payment.", "全部手术、检查、麻醉及其他医疗费用均由诊所或医院直接收取。Cosmetics Asia 不代收医疗费用。", "Операция, обследования, анестезия и другие медицинские услуги оплачиваются напрямую клинике или больнице. Cosmetics Asia не принимает медицинские платежи."),
    },
    {
      q: c("What travel-support services can I request?", "可以选择哪些行程协助服务？", "Какую помощь в поездке можно заказать?"),
      a: c("We can help coordinate airport pickup, clinic translation, accommodation guidance and recovery support around your confirmed care plan. The exact scope is confirmed with you before travel.", "我们可以根据已确认的就医计划，协助安排机场接送、诊所翻译、住宿建议与恢复期支持。实际包含内容会在出发前与你逐项确认。", "Мы можем помочь с трансфером из аэропорта, переводом в клинике, подбором проживания и поддержкой во время восстановления. Точный объём согласуется до поездки."),
    },
    {
      q: c("How do you review surgeon credentials?", "你们如何审核医生资料？", "Как проверяются данные врачей?"),
      a: c("We request licensing, hospital affiliation and specialty information from the doctor or clinic and review it before publication. Incomplete profiles are not labeled verified. You should also confirm credentials with the treating facility and relevant local authority.", "我们要求医生或机构提交执业、任职与专业资料，并在公开展示前进行资料审核。未完成审核的资料不会标记为已核验。最终请同时向接诊机构和当地主管部门确认。", "Мы запрашиваем сведения о лицензии, месте работы и специализации и проверяем их до публикации. Неполные профили не получают отметку о проверке. Также подтвердите данные в клинике и у местного регулятора."),
    },
    {
      q: c("What if I have a concern after returning home?", "回国后出现问题怎么办？", "Что делать, если после возвращения возникли вопросы?"),
      a: c("We can help organize your information and contact the treating clinic, but we do not replace emergency or local medical care. Seek urgent help from local emergency services or a licensed clinician if symptoms are concerning.", "我们可以协助你整理情况并联系原诊所，但不能替代急诊或本地医生。出现紧急症状时，应立即联系当地急救服务或持证医生。", "Мы поможем собрать информацию и связаться с клиникой, но не заменяем экстренную или местную медицинскую помощь. При тревожных симптомах немедленно обратитесь в местную экстренную службу или к лицензированному врачу."),
    },
    {
      q: c("Can my consultation be conducted in English?", "线上咨询可以使用英语吗？", "Можно ли провести консультацию на английском?"),
      a: c("Yes. We arrange confirmed English-language support for the appointment, either with an English-speaking clinician or a bilingual coordinator, depending on availability.", "可以。我们会根据已确认的预约安排英语沟通支持；具体形式可能是英语医生或双语协调员陪同。", "Да. Для подтверждённой записи мы организуем поддержку на английском: англоговорящего врача или двуязычного координатора, в зависимости от доступности."),
    },
    {
      q: c("How is my medical information handled?", "我的医疗资料如何使用？", "Как используются мои медицинские данные?"),
      a: c("Information is used for the consultation and coordination you authorize, and only necessary details are shared with relevant service providers. Do not send sensitive records through public comments or social media.", "资料仅用于你授权的咨询和行程协调，并只向相关服务方提供必要信息。请勿通过公开评论或社交媒体发送敏感病历。", "Данные используются только для разрешённой вами консультации и координации; партнёрам передаётся лишь необходимая информация. Не отправляйте конфиденциальные документы в открытых комментариях или соцсетях."),
    },
  ];

  return (
    <section className="container py-12 md:py-16" aria-labelledby="home-faq-title">
      <div className="grid gap-7 rounded-[2rem] border border-primary/15 bg-card p-5 shadow-soft md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] md:p-10">
        <div className="md:pr-8">
          <span className="pill mb-3 bg-accent text-accent-foreground"><HelpCircle className="size-3.5" /> {c("Payment FAQ", "费用常见问题", "Вопросы об оплате")}</span>
          <h2 id="home-faq-title" className="font-display text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
            {c("Who gets paid, ", "费用由谁收取，", "Кто получает оплату — ")}<em className="not-italic text-primary">{c("made clear before you travel", "出发前先说清楚", "разберитесь до поездки")}</em>
          </h2>
          <Link to="/travel-packages" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
            {zh ? "查看行程支持" : "Explore travel support"}<ArrowRight className="size-4" />
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
      title="Cosmetic Surgery in China | Doctors & Patient Diaries"
      description="Compare cosmetic surgeons in China, watch patient recovery diaries, understand procedures, and plan translation, travel and aftercare with Cosmetics Asia."
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

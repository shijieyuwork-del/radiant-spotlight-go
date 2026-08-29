import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, ArrowRight, Star, MapPin, ShieldCheck,
  Stethoscope, Building2,
  Flame, Gift, Wallet, Users, Plane,
  Eye,
  Scale, HelpCircle, HeartPulse, MessageCircle, Video, Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Footer from "@/components/Footer";
import AsiaNavbar from "@/components/AsiaNavbar";
import TikTokWall from "@/components/TikTokWall";
import PageMeta from "@/components/PageMeta";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { CITIES } from "@/data/cities";
import { CitySearchBar, CityQuickResults, useCityFilter } from "@/components/CitySearch";
import { useAsia } from "@/lib/asia-i18n";
import QuoteCtaButton from "@/components/QuoteCtaButton";
import { ORGANIZATION_SCHEMA } from "@/lib/seo-config";
import { useQuote } from "@/components/QuoteRequest";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import heroBg from "@/assets/hero-bg.jpg";
import journeyConsultation from "@/assets/journey-premium-video-consultation.jpg";
import journeyArrival from "@/assets/journey-premium-china-arrival.jpg";
import journeySupport from "@/assets/journey-premium-coordination-support.jpg";
import journeyRecovery from "@/assets/journey-premium-ground-support.jpg";
import journeyFollowUp from "@/assets/journey-premium-remote-follow-up.jpg";
import journeyExploration from "@/assets/journey-premium-recovery-hangzhou.jpg";
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
        title: "1000+ 位患者的医美历程，",
        emphasis: "让选择更清晰",
        subtitle: "先了解项目、查看已发布的专家资料与患者恢复日记，再决定是否出发。翻译、行程和术后支持由我们协调。",
        cases: "观看患者短视频",
        consultation: "在线面诊",
        consultationDetail: "出发前与专家进行一对一线上沟通",
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
          title: "Более 1 000 историй пациентов.",
          emphasis: "Больше ясности при выборе.",
          subtitle: "Сравните реальные случаи, квалификацию экспертов и прозрачные цены до поездки. Мы организуем перевод, поездку и последующий уход.",
          cases: "Смотреть видео пациентов",
          consultation: "Онлайн-консультация",
          consultationDetail: "Встреча с экспертом онлайн до поездки",
          english: "Переводчик в клинике",
          englishDetail: "Помощь в общении во время визита",
          travel: "Трансфер из аэропорта",
          travelDetail: "Индивидуальный трансфер до места назначения",
          pricing: "Поддержка после лечения",
          pricingDetail: "Координация во время восстановления",
        }
      : {
          badge: "China's cosmetic care platform for international patients",
          title: "1,000+ patient journeys.",
          emphasis: "A clearer way to choose.",
          subtitle: "Understand procedures, review published expert profiles and explore patient recovery diaries before you travel.",
          cases: "Watch patient recovery videos",
          consultation: "Online consultation",
          consultationDetail: "Meet your expert online before you travel (not providing medical advice)",
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
        >
          <source src="/video/cosmetics-asia-home-motion.mp4?v=1" type="video/mp4" />
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
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-[15px] md:hidden">{copy.subtitle}</p>

            <div className="mx-auto mt-6 flex max-w-lg flex-col justify-center gap-3 sm:mt-7 sm:flex-row">
              <Button asChild size="lg" className="h-[3.25rem] w-full rounded-2xl px-8 text-[15px] font-semibold shadow-pop sm:h-12 sm:w-auto sm:min-w-72 sm:rounded-full">
                <Link to="/cases">{copy.cases}<ArrowRight className="ml-1.5 size-4" /></Link>
              </Button>
              <QuoteCtaButton className="order-first h-[3.25rem] w-full rounded-2xl border border-foreground px-7 text-[15px] sm:order-none sm:h-12 sm:w-auto sm:rounded-full" />
            </div>

            <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide sm:mx-0 sm:mt-8 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
              {[
                { icon: Video, title: copy.consultation },
                { icon: MapPin, title: copy.travel },
                { icon: Users, title: copy.english },
                { icon: ShieldCheck, title: copy.pricing },
              ].map((item) => (
                <span key={item.title} className="flex min-h-[4.5rem] min-w-[76vw] snap-center items-center gap-3 rounded-2xl border border-white/60 bg-white/45 px-4 py-3 text-left shadow-[0_12px_32px_rgba(18,55,45,0.09)] backdrop-blur-xl sm:min-h-16 sm:min-w-0">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/60 bg-white/55 backdrop-blur-md"><item.icon className="size-4 text-primary" /></span>
                  <strong className="min-w-0 font-display text-sm font-semibold leading-tight">{item.title}</strong>
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
                className="cta-primary inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold shadow-soft transition-all sm:w-auto sm:text-xs"
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
    ? { eyebrow: "服务流程", title: "六步开启你的", emphasis: "中国医疗之旅", step: "步骤" }
    : lang === "ru"
      ? { eyebrow: "Как это работает", title: "6 шагов к", emphasis: "лечению в Китае", step: "Шаг" }
      : { eyebrow: "How it works", title: "6 steps to your", emphasis: "care in China", step: "Step" };
  const localizedSteps = [
    {
      icon: Video,
      image: journeyConsultation,
      en: ["Get a free quote", "Tell us your goals and questions so we can help identify suitable specialists"],
      zh: ["获取免费报价", "告诉我们你的目标和疑问，我们会协助匹配合适的专家"],
      ru: ["Получить бесплатную оценку", "Расскажите о целях и вопросах, чтобы мы помогли подобрать специалистов"],
    },
    {
      icon: Plane,
      image: journeyArrival,
      en: ["Arrange your travel & visa", "Confirm appointments, flights, travel documents and arrival details"],
      zh: ["安排行程与签证", "确认预约、航班、旅行文件和抵达信息"],
      ru: ["Организуйте поездку и визу", "Подтвердите запись, перелёт, документы и детали прибытия"],
    },
    {
      icon: MapPin,
      image: journeyRecovery,
      en: ["Choose your on-ground support", "Select pickup, accommodation guidance, translation and coordination"],
      zh: ["选择落地支持服务", "按需选择接机、住宿建议、翻译与行程协调"],
      ru: ["Выберите поддержку на месте", "Выберите трансфер, помощь с проживанием, перевод и координацию"],
    },
    {
      icon: HeartPulse,
      image: journeySupport,
      en: ["Receive coordinated treatment support", "Get practical communication and scheduling help during clinic visits"],
      zh: ["获得治疗协调支持", "就诊期间获得沟通、翻译与日程协调协助"],
      ru: ["Получите поддержку во время лечения", "Получайте помощь с общением и расписанием во время визитов"],
    },
    {
      icon: Map,
      image: journeyExploration,
      en: ["Recover—and explore when ready", "Follow your expert’s advice, with optional travel when you are cleared"],
      zh: ["安心恢复，适合时再探索", "遵循专家的恢复建议，获得许可后可自愿安排旅行"],
      ru: ["Восстанавливайтесь и путешествуйте, когда будете готовы", "Следуйте рекомендациям эксперта и путешествуйте только после разрешения"],
    },
    {
      icon: MessageCircle,
      image: journeyFollowUp,
      en: ["Stay connected after you return", "Coordinate remote follow-up and translation when your expert recommends it"],
      zh: ["回国后保持联系", "专家建议复诊时，我们协助协调远程随访与翻译"],
      ru: ["Оставайтесь на связи после возвращения", "Мы поможем организовать онлайн-наблюдение и перевод по рекомендации эксперта"],
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
    }, 4800);
    return () => window.clearInterval(timer);
  }, [steps.length]);

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
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  showStep(index);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`${journeyCopy.step} ${index + 1}: ${x.t}`}
              aria-current={activeStep === index ? "step" : undefined}
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
          <div className="flex items-center" aria-label={`Step ${activeStep + 1} of ${steps.length}`}>
            {steps.map((step, index) => (
              <button
                key={step.t}
                type="button"
                onClick={() => showStep(index)}
                className="grid size-12 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={`Show step ${index + 1}`}
                aria-current={activeStep === index ? "step" : undefined}
              >
                <span className={`h-2 rounded-full transition-all ${activeStep === index ? "w-8 bg-primary" : "w-2 bg-card/80"}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CitiesSection = () => {
  const { t, lang } = useAsia();
  const cityFilter = useCityFilter();
  const cityRailRef = useRef<HTMLDivElement>(null);
  const cityRailPausedRef = useRef(false);
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
        <Link to="/cities" className="pill hidden bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:inline-flex">{lang === "zh" ? "全部城市" : lang === "ru" ? "Все города" : "All cities"}<ArrowRight className="size-4" /></Link>
      </div>
      <div className="mb-6 md:mb-8">
        <CitySearchBar filter={cityFilter} />
        {cityFilter.active && <CityQuickResults results={cityFilter.results} query={cityFilter.query} />}
      </div>
      <div
        ref={cityRailRef}
        onMouseEnter={() => { cityRailPausedRef.current = true; }}
        onMouseLeave={() => { cityRailPausedRef.current = false; }}
        onPointerDown={() => { cityRailPausedRef.current = true; }}
        onPointerUp={() => { cityRailPausedRef.current = false; }}
        onFocusCapture={() => { cityRailPausedRef.current = true; }}
        onBlurCapture={() => { cityRailPausedRef.current = false; }}
        className="flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth rounded-[2rem] bg-gradient-to-r from-[hsl(158,58%,90%)] via-[hsl(145,48%,91%)] to-[hsl(50,80%,91%)] px-4 py-5 shadow-pop scrollbar-hide md:gap-6 md:px-6 md:py-7"
      >
        {cities.map((c) => (
          <Link key={c.slug} to={`/cities/${c.slug}`} className="group block min-w-[82vw] snap-center sm:min-w-[62vw] md:min-w-[calc((100%_-_3rem)/3)] md:max-w-[calc((100%_-_3rem)/3)]">
            <article className="flex min-h-[270px] flex-col rounded-3xl border border-border bg-card p-5 shadow-soft transition duration-300 group-hover:-translate-y-1 group-hover:border-primary/35 group-hover:shadow-pop md:min-h-[290px] md:p-6">
              <div className="flex min-w-0 items-center gap-4">
                <img src={c.img} alt={`${c.en} city`} className="size-24 shrink-0 rounded-full border-2 border-primary/15 object-cover transition-transform duration-500 group-hover:scale-105 md:size-28" />
                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-semibold leading-tight text-foreground md:text-3xl">{lang === "zh" ? c.zh : c.en}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{lang === "zh" ? c.en : c.zh}</p>
                  <p className="mt-2 line-clamp-2 text-sm font-medium text-primary">{lang === "zh" ? c.taglineZh : c.taglineEn}</p>
                </div>
              </div>
              <p className="mt-5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{lang === "zh" ? c.introZh : c.introEn}</p>
              <div className="mt-4 flex max-h-[50px] flex-wrap gap-1.5 overflow-hidden">
                {(lang === "zh" ? c.hotZh : c.hotEn).slice(0, 3).map((h) => <span key={h} className="rounded-full bg-accent px-2.5 py-1 text-[10px] text-accent-foreground">{h}</span>)}
              </div>
            </article>
          </Link>
        ))}
      </div>
      <div className="mt-2 flex justify-center sm:hidden">
        <Link to="/cities" className="inline-flex min-h-12 items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
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
  const treatmentCloudIndexRef = useRef(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let resetTimer = 0;
    const timer = window.setInterval(() => {
      const rail = treatmentCloudRailRef.current;
      if (!rail || treatmentCloudPausedRef.current || document.hidden) return;
      const nextIndex = treatmentCloudIndexRef.current + 1;
      const card = rail.children[nextIndex] as HTMLElement | undefined;
      if (!card) return;
      const left = card.offsetLeft - rail.offsetLeft - Math.max(0, (rail.clientWidth - card.clientWidth) / 2);
      rail.scrollTo({ left, behavior: "smooth" });
      treatmentCloudIndexRef.current = nextIndex;
      if (nextIndex === procedureClouds.length) {
        resetTimer = window.setTimeout(() => {
          const firstCard = rail.children[0] as HTMLElement | undefined;
          if (!firstCard) return;
          rail.scrollTo({ left: firstCard.offsetLeft - rail.offsetLeft, behavior: "auto" });
          treatmentCloudIndexRef.current = 0;
        }, 750);
      }
    }, 4800);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(resetTimer);
    };
  }, [procedureClouds.length]);
  return (
    <section id="projects" className="container py-10 md:py-16">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 md:mb-8">
        <div>
          <span className="pill bg-accent text-accent-foreground mb-3"><Flame className="size-3.5" /> {t("tx.kicker")}</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
            {t("tx.title1")} <em className="text-primary not-italic">{t("tx.titleEm")}</em>
          </h2>
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
        className="flex touch-pan-x snap-x snap-mandatory items-stretch gap-8 overflow-x-auto overscroll-x-contain scroll-smooth rounded-[2rem] bg-gradient-to-r from-[hsl(158,58%,90%)] via-[hsl(145,48%,91%)] to-[hsl(50,80%,91%)] px-4 py-4 shadow-pop scrollbar-hide sm:gap-9 md:gap-10 md:px-6 md:py-5"
      >
        {[...procedureClouds, ...procedureClouds].map((cloud, repeatedIndex) => {
          const cloudIndex = repeatedIndex % procedureClouds.length;
          const duplicate = repeatedIndex >= procedureClouds.length;
          const CloudIcon = cloud.icon;
          return (
          <article key={`${cloud.en}-${duplicate ? "loop" : "primary"}`} aria-hidden={duplicate || undefined} className="group relative flex min-h-[250px] w-[82vw] min-w-[82vw] shrink-0 snap-center flex-col justify-center px-3 py-3 transition duration-500 hover:-translate-y-1 sm:w-[56vw] sm:min-w-[56vw] md:min-h-[235px] md:w-[calc((100%_-_5rem)/3)] md:min-w-[calc((100%_-_5rem)/3)] lg:w-[calc((100%_-_7.5rem)/4)] lg:min-w-[calc((100%_-_7.5rem)/4)]">
            <span className="absolute right-0 top-2 font-display text-6xl font-semibold leading-none text-foreground/[0.04]">0{cloudIndex + 1}</span>
            <div className="mb-2 flex justify-center" aria-hidden="true">
              <CloudIcon strokeWidth={1.35} className="size-12 text-primary transition duration-500 group-hover:scale-110 md:size-14" />
            </div>
            <div className="relative flex items-center justify-between gap-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{lang === "zh" ? cloud.zh : cloud.en}</h3>
              <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
            </div>
            <div className="relative mt-4 flex flex-wrap content-center items-baseline justify-center gap-x-3.5 gap-y-1.5 text-center">
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

// ClinicsSection removed — patients only browse experts.

const DoctorsSection = () => {
  const { t, lang } = useAsia();
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
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      const rail = doctorRailRef.current;
      if (!rail || doctorRailPausedRef.current || document.hidden) return;
      const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 24;
      rail.scrollTo({ left: atEnd ? 0 : rail.scrollLeft + Math.min(rail.clientWidth * 0.86, 1080), behavior: "smooth" });
    }, 5200);
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
      </div>
      <div
        ref={doctorRailRef}
        onMouseEnter={() => { doctorRailPausedRef.current = true; }}
        onMouseLeave={() => { doctorRailPausedRef.current = false; }}
        onPointerDown={() => { doctorRailPausedRef.current = true; }}
        onPointerUp={() => { doctorRailPausedRef.current = false; }}
        onFocusCapture={() => { doctorRailPausedRef.current = true; }}
        onBlurCapture={() => { doctorRailPausedRef.current = false; }}
        className="flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth rounded-[2rem] bg-gradient-to-r from-[hsl(158,58%,90%)] via-[hsl(145,48%,91%)] to-[hsl(50,80%,91%)] px-4 py-5 shadow-pop scrollbar-hide md:gap-6 md:px-6 md:py-7"
      >
        {displayedDoctors.map((d) => {
          const photo = d.photo;
          return (
          <Link
            key={d.id}
            to={d.demo ? `/doctors/demo/${d.id}` : `/doctors/profile/${d.id}`}
            aria-label={`${lang === "zh" ? "查看专家资料" : lang === "ru" ? "Профиль эксперта" : "View expert profile"}: ${d.name}`}
            className="group block min-w-[82vw] snap-center rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 sm:min-w-[62vw] md:min-w-[calc((100%_-_3rem)/3)] md:max-w-[calc((100%_-_3rem)/3)]"
          >
            <article className="flex min-h-[370px] flex-col rounded-3xl border border-border bg-card p-5 shadow-soft transition duration-300 group-hover:-translate-y-1 group-hover:border-primary/35 group-hover:shadow-pop md:min-h-[390px] md:p-6">
              <div className="flex min-w-0 items-center gap-4">
                {photo ? <img src={photo} alt={d.name} className="size-24 shrink-0 rounded-full border-2 border-primary/15 object-cover transition-transform duration-500 group-hover:scale-105 md:size-28" /> : <div className="grid size-24 shrink-0 place-items-center rounded-full bg-primary/10 text-primary md:size-28"><Stethoscope className="size-10" /></div>}
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-semibold leading-tight text-foreground md:text-2xl">{d.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm font-medium text-muted-foreground">{d.title}</p>
                  {d.demo && <span className="mt-2 inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-accent-foreground">Sample profile</span>}
                </div>
              </div>

              <p className="mt-5 flex items-start gap-2 text-sm text-foreground/80"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" /><span className="line-clamp-2">{d.city} · {d.hospital}</span></p>
              <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{d.bio}</p>
              <div className="mt-4 flex flex-wrap gap-1.5 overflow-hidden max-h-[54px]">
                {d.specialties.slice(0, 3).map((s) => (
                  <span key={s} className="rounded-full bg-accent px-2.5 py-1 text-[11px] text-accent-foreground">{s}</span>
                ))}
              </div>
              <span className="mt-auto flex min-h-12 items-center justify-between border-t border-border/70 pt-4 text-sm font-semibold text-foreground">
                {lang === "zh" ? "查看专家资料" : lang === "ru" ? "Профиль эксперта" : "View expert profile"}
                <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
              </span>
            </article>
          </Link>
        )})}
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const { lang, t } = useAsia();
  const { open } = useQuote();
  const copy = lang === "zh"
    ? {
        eyebrow: "免费线上咨询",
        title: "准备好开始了吗？",
        emphasis: "今天迈出第一步",
        text: "告诉我们你关注的项目、预算和希望前往的城市。我们会帮你梳理需求，并协助你找到合适的中国专家。",
      }
    : lang === "ru"
      ? {
          eyebrow: "Бесплатная онлайн-консультация",
          title: "Готовы начать?",
          emphasis: "Сделайте первый шаг сегодня",
          text: "Расскажите о процедуре, бюджете и желаемом городе. Мы поможем уточнить ваши потребности и подобрать подходящего эксперта в Китае.",
        }
      : {
          eyebrow: "Free online consultation",
          title: "Ready to get started?",
          emphasis: "Take the first step today",
          text: "Tell us the procedure, budget and city you have in mind. We’ll help clarify your needs and connect you with a suitable expert in China.",
        };

  return (
    <section className="container py-12 md:py-16">
      <div className="relative overflow-hidden rounded-[2rem] border-2 border-primary/35 bg-card px-5 py-10 text-foreground shadow-glow ring-1 ring-primary/10 md:min-h-[340px] md:px-14 md:py-16">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-emerald-300 to-amber-200" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-white/25" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full bg-primary/10" />
        <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="max-w-4xl">
            <span className="pill mb-3 bg-primary px-4 py-2 font-bold text-primary-foreground shadow-soft"><MessageCircle className="size-3.5" /> {copy.eyebrow}</span>
            <h2 className="font-display text-4xl font-medium leading-[1.02] tracking-tight sm:text-5xl md:text-6xl">
              {copy.title}{" "}<em className="box-decoration-clone rounded-[0.28em] bg-primary/10 px-[0.12em] py-[0.04em] text-primary not-italic">{copy.emphasis}</em>
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/70 md:text-lg">
              {lang === "en" ? (
                <>
                  Don’t want to talk? That’s okay — email us at <strong className="font-semibold text-foreground">hello@cosmetics-asia.com</strong> or WhatsApp us at{" "}
                  <a href="https://wa.me/14708613825" target="_blank" rel="noreferrer" className="font-semibold text-foreground underline decoration-primary/45 underline-offset-2 transition hover:text-primary">+1 470 861 3825</a>.
                </>
              ) : copy.text}
            </p>
          </div>
          <div className="w-full shrink-0 text-center md:w-auto">
            <Button size="lg" onClick={() => open()} className="cta-primary min-h-14 w-full rounded-full px-9 text-base shadow-glow ring-4 ring-primary/15 transition hover:-translate-y-1 md:w-fit">
              {t("hero.cta")}<ArrowRight className="ml-2 size-4" />
            </Button>
            
          </div>
        </div>
        <MedicalDisclaimer variant="banner" className="relative mt-6 bg-background/60" />
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
      a: c("Medical fees are paid directly to the treating clinic or hospital; Cosmetics Asia does not collect them. We collect a $400 coordination deposit to reserve your procedure appointment and coordinate airport pickup and in-clinic translation. It remains valid for 12 months and is refunded when you pay the clinic for treatment.", "医疗费用全部由诊所或医院直接收取，Cosmetics Asia 不代收。我们收取 400 美元协调押金，用于保留手术预约，并协调机场接送和院内翻译。押金在 12 个月内有效，并在你向诊所支付治疗费用时退还。", "Медицинские услуги оплачиваются напрямую клинике или больнице; Cosmetics Asia их не принимает. Мы взимаем координационный депозит $400, чтобы закрепить время процедуры и организовать трансфер и перевод в клинике. Он действует 12 месяцев и возвращается после оплаты лечения в клинике."),
    },
    {
      q: c("What is the $400 deposit for?", "400 美元押金是做什么用的？", "Для чего нужен депозит $400?"),
      a: c("The $400 deposit reserves your procedure appointment and helps us coordinate airport pickup and in-clinic translation. It is not an additional medical charge, remains valid for 12 months and is refunded when you pay the clinic for treatment.", "这笔 400 美元押金用于保留手术预约，并帮助我们协调机场接送和院内翻译。它不是额外的医疗费用，可保留 12 个月，并在你向诊所支付治疗费用时退还。", "Депозит $400 закрепляет время процедуры и помогает организовать трансфер и перевод в клинике. Это не дополнительная медицинская плата; депозит действует 12 месяцев и возвращается после оплаты лечения в клинике."),
    },
    {
      q: c("Who receives my medical payment?", "手术和治疗费用支付给谁？", "Кому оплачиваются медицинские услуги?"),
      a: c("All surgery, examination, anesthesia and other medical fees are charged directly by the clinic or hospital. Cosmetics Asia does not collect your medical payment.", "全部手术、检查、麻醉及其他医疗费用均由诊所或医院直接收取。Cosmetics Asia 不代收医疗费用。", "Операция, обследования, анестезия и другие медицинские услуги оплачиваются напрямую клинике или больнице. Cosmetics Asia не принимает медицинские платежи."),
    },
    {
      q: c("Can my consultation be conducted in English?", "线上咨询可以使用英语吗？", "Можно ли провести консультацию на английском?"),
      a: c("Yes. We arrange confirmed English-language support for the appointment, either with an English-speaking expert or a bilingual coordinator, depending on availability.", "可以。我们会根据已确认的预约安排英语沟通支持；具体形式可能是英语专家或双语协调员陪同。", "Да. Для подтверждённой записи мы организуем поддержку на английском: англоговорящего эксперта или двуязычного координатора, в зависимости от доступности."),
    },
    {
      q: c("How is my medical information handled?", "我的医疗资料如何使用？", "Как используются мои медицинские данные?"),
      a: c("Information is used for the consultation and coordination you authorize, and only necessary details are shared with relevant service providers. Do not send sensitive records through public comments or social media.", "资料仅用于你授权的咨询和行程协调，并只向相关服务方提供必要信息。请勿通过公开评论或社交媒体发送敏感病历。", "Данные используются только для разрешённой вами консультации и координации; партнёрам передаётся лишь необходимая информация. Не отправляйте конфиденциальные документы в открытых комментариях или соцсетях."),
    },
  ];

  return (
    <section className="container py-12 md:py-16" aria-labelledby="home-faq-title">
      <div className="rounded-[2rem] border border-primary/15 bg-gradient-to-r from-[hsl(158,58%,90%)] via-[hsl(145,48%,91%)] to-[hsl(50,80%,91%)] p-5 shadow-soft md:p-10">
        <div className="max-w-3xl">
          <span className="pill mb-3 bg-accent text-accent-foreground"><HelpCircle className="size-3.5" /> {c("Payment, made simple", "付款方式，一眼看懂", "Оплата — всё просто")}</span>
          <h2 id="home-faq-title" className="font-display text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
            {c("Simple, transparent payments. ", "付款简单透明，", "Простая и прозрачная оплата. ")}<em className="not-italic text-primary">{c("Know exactly where your money goes.", "每一笔都清楚去向。", "Вы точно знаете, куда идут ваши деньги.")}</em>
          </h2>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <article className="rounded-[1.5rem] border border-primary/15 bg-primary/[0.06] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><Building2 className="size-5" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{c("Medical treatment", "手术与医疗费用", "Медицинские услуги")}</p>
                <h3 className="mt-1 font-display text-2xl font-medium text-foreground">{c("Pay the clinic directly", "直接支付给诊所或医院", "Оплачивайте напрямую клинике")}</h3>
              </div>
            </div>
            <p className="mt-4 text-base leading-relaxed text-foreground/75">{c("Your clinic or hospital collects all surgery, examination and anesthesia fees. Cosmetics Asia does not collect your medical payment.", "手术、检查和麻醉等医疗费用均由诊所或医院直接收取，Cosmetics Asia 不代收。", "Операция, обследования и анестезия оплачиваются напрямую клинике или больнице. Cosmetics Asia не принимает медицинские платежи.")}</p>
          </article>

          <article className="rounded-[1.5rem] border border-amber-200/80 bg-amber-50/70 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-800"><Wallet className="size-5" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-800">{c("Before departure", "出发前", "До вылета")}</p>
                <h3 className="mt-1 font-display text-2xl font-medium text-foreground">{c("$400 coordination deposit", "支付 $400 协调押金", "Координационный депозит $400")}</h3>
              </div>
            </div>
            <p className="mt-4 text-base leading-relaxed text-foreground/75">{c("It reserves your procedure appointment and coordinates airport pickup and in-clinic translation. It remains valid for 12 months and is refunded when you pay the clinic for treatment.", "用于保留手术预约，并协调机场接送和院内翻译。押金在 12 个月内有效，并在你向诊所支付治疗费用时退还。", "Он закрепляет время процедуры и помогает организовать трансфер и перевод в клинике. Депозит действует 12 месяцев и возвращается после оплаты лечения в клинике.")}</p>
          </article>
        </div>

        <div className="mt-6 grid gap-5 border-t border-border/70 pt-6 md:grid-cols-[0.56fr_1.44fr] md:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{c("Need more detail?", "还想了解更多？", "Нужны подробности?")}</p>
            <h3 className="mt-2 font-display text-2xl font-medium">{c("Common questions", "常见问题", "Частые вопросы")}</h3>
            <Link to="/travel-packages" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
              {c("Explore travel support", "查看行程支持", "Подробнее о поддержке в поездке")}<ArrowRight className="size-4" />
            </Link>
          </div>

          <Accordion type="single" collapsible className="overflow-hidden rounded-2xl border border-border/80 bg-background/60 px-4 sm:px-5">
            {questions.slice(2).map((item, index) => (
              <AccordionItem key={item.q} value={`faq-${index + 2}`} className="border-border/70">
                <AccordionTrigger className="gap-4 py-4 text-left text-sm font-semibold hover:no-underline sm:text-base">
                  <span className="flex items-start gap-3"><span className="mt-0.5 font-mono text-[10px] text-primary">0{index + 1}</span>{item.q}</span>
                </AccordionTrigger>
                <AccordionContent className="pl-8 pr-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

const PromoBar = () => {
  const { t } = useAsia();
  return (
    <section className="container py-6 md:py-10">
      <div className="grid items-center gap-5 rounded-3xl bg-gradient-to-r from-[hsl(155,55%,91%)] via-[hsl(50,78%,93%)] to-[hsl(var(--primary)/.24)] p-5 shadow-pop md:grid-cols-3 md:gap-6 md:p-10">
        <div className="md:col-span-2">
          <span className="pill bg-card/80 backdrop-blur shadow-soft mb-3"><Gift className="size-3.5 text-primary" /> {t("promo.kicker")}</span>
          <h3 className="font-display text-3xl md:text-4xl font-medium tracking-tight">{t("promo.title")}</h3>
          <p className="text-sm text-foreground/70 mt-2">{t("promo.note")}</p>
        </div>
        <Button size="lg" className="cta-primary h-12 w-full justify-self-start rounded-full px-6 md:w-auto md:justify-self-end">
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
      title="Cosmetic Surgery in Asia | Patient Diaries"
      description="Compare verified cosmetic surgeons across Asia, watch real patient recovery diaries, get transparent prices, and plan travel and aftercare in English with Cosmetics Asia."
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

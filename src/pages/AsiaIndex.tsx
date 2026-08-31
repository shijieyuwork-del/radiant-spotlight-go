import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, ArrowRight, MapPin, ShieldCheck,
  Stethoscope, Building2,
  Flame, Gift, Wallet, Users, Plane,
  Eye,
  Scale, HelpCircle, HeartPulse, MessageCircle, Video, Map, Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Footer from "@/components/Footer";
import AsiaNavbar from "@/components/AsiaNavbar";
import TikTokWall from "@/components/TikTokWall";
import HeroVideoGallery from "@/components/HeroVideoGallery";
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
import journeyConsultation from "@/assets/journey-premium-natural-consultation-v5.jpg";
import journeyArrival from "@/assets/journey-premium-natural-arrival-v5.jpg";
import journeyGroundSupport from "@/assets/journey-premium-natural-concierge-v5.jpg";
import journeyTreatment from "@/assets/journey-premium-clinic-v6.jpg";
import journeyRecovery from "@/assets/journey-premium-natural-recovery-v5.jpg";
import journeyFollowUp from "@/assets/journey-premium-natural-followup-v5.jpg";
import procedureRhinoplasty from "@/assets/procedures/rhinoplasty.jpg";
import procedureEyes from "@/assets/procedures/double-eyelid-natural-v4.jpg";
import procedureFacelift from "@/assets/procedures/facelift.jpg";
import procedureBody from "@/assets/procedures/body-contouring-natural-v2.jpg";
import procedureBreast from "@/assets/procedures/breast-augmentation.jpg";
import procedureHair from "@/assets/procedures/fue-hair-transplant.jpg";
import procedureJaw from "@/assets/procedures/jaw-contouring.jpg";
import procedureDental from "@/assets/procedures/dental-implants.jpg";
import procedureSkin from "@/assets/procedures/laser-skin-resurfacing.jpg";
import procedureLips from "@/assets/procedures/lip-lift.jpg";
import procedureWeightLoss from "@/assets/procedures/body-lift.jpg";
import procedureMen from "@/assets/procedures/male-breast-reduction.jpg";
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
type NavigatorConnection = {
  saveData?: boolean;
  effectiveType?: string;
};

const Hero = () => {
  const { t, lang, fmt } = useAsia();
  const [showHeroVideo, setShowHeroVideo] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && /(^|-)2g$/.test(connection.effectiveType)) return;
    const cb = () => setShowHeroVideo(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(cb, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(cb, 1500);
    return () => window.clearTimeout(id);
  }, []);

  const copy = lang === "zh"
    ? {
        badge: "更清晰地了解中国医美",
        title: "选择之前，先看真实恢复过程。",
        emphasis: "找到适合你的中国医美方案。",
        subtitle: "查看患者恢复日记与公开专家资料，并获得咨询、行程和回国后随访的实际协调支持。",
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
          badge: "Косметическая помощь в Китае — понятнее",
          title: "Увидьте реальное восстановление до выбора.",
          emphasis: "Найдите подходящий вариант в Китае.",
          subtitle: "Изучайте истории пациентов и опубликованные профили экспертов, получая практическую поддержку для консультации, поездки и наблюдения.",
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
          badge: "Cosmetic care in China, made clearer",
          title: "See real recovery before you choose.",
          emphasis: "Find the right cosmetic care in China.",
          subtitle: "Explore patient journeys, published expert information and practical support for consultation, travel and follow-up.",
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
      <div className="hero-motion__background absolute inset-x-0 top-0 h-[900px] sm:h-[940px]" aria-hidden="true">
        <img src={heroBg} alt="" className="hero-motion__image absolute inset-0 size-full object-cover" />
        {showHeroVideo && (
          <video
            className="hero-motion__video absolute inset-0 size-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={heroBg}
          >
            <source src="/video/cosmetics-asia-home-motion.mp4?v=1" type="video/mp4" />
          </video>
        )}
        <div className="hero-motion__veil absolute inset-0" />
      </div>

      <div className="container relative pb-9 pt-5 sm:py-14 md:py-20">
        <div className="flex flex-col gap-8 md:gap-14">
          <div className="mx-auto w-full max-w-5xl text-center">
            <span className="pill max-w-full justify-center bg-card/80 text-center leading-relaxed shadow-soft backdrop-blur">
              <ShieldCheck className="size-3.5 text-primary" />
              {copy.badge}
            </span>
            <h1 className="mx-auto mt-4 max-w-4xl font-display text-[1.95rem] font-medium leading-[1.01] tracking-tight min-[390px]:text-[2.15rem] sm:mt-5 sm:text-5xl md:text-[3.75rem]">
              {copy.title}
              <span className="hidden sm:inline"><br />
              <em className="text-primary not-italic">{copy.emphasis}</em></span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]"><em className="text-primary not-italic sm:hidden">{copy.emphasis} </em>{copy.subtitle}</p>

            <div className="mx-auto mt-5 flex max-w-lg flex-col justify-center gap-3 sm:mt-7 sm:flex-row">
              <QuoteCtaButton className="h-[3.25rem] w-full rounded-2xl border border-foreground px-8 text-[15px] shadow-pop sm:h-12 sm:w-auto sm:rounded-full" />
              <Button asChild size="lg" variant="outline" className="h-[3.25rem] w-full rounded-2xl border-primary/25 bg-card/70 px-8 text-[15px] font-semibold backdrop-blur sm:h-12 sm:w-auto sm:rounded-full">
                <Link to="/cases">{copy.cases}<ArrowRight className="ml-1.5 size-4" /></Link>
              </Button>
            </div>

            <div className="mx-auto mt-7 max-w-4xl sm:mt-9">
              <HeroVideoGallery items={TIKTOK_CASES.slice(0, 10)} lang={lang} fmtPrice={fmt} />
            </div>

            <div
              className="mx-auto mt-6 max-w-4xl rounded-full border border-primary/10 bg-card/80 px-4 py-3 shadow-[0_14px_40px_rgba(18,55,45,0.06)] backdrop-blur-xl sm:mt-7 sm:px-6"
              role="list"
              aria-label={lang === "zh" ? "协调服务" : lang === "ru" ? "Координационные услуги" : "Coordination services"}
            >
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:gap-x-8">
              {[
                { icon: Video, title: copy.consultation },
                { icon: MapPin, title: copy.travel },
                { icon: Users, title: copy.english },
                { icon: ShieldCheck, title: copy.pricing },
              ].map((item) => (
                <div
                  key={item.title}
                  role="listitem"
                  className="group flex items-center gap-2 text-left"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/[0.09] text-primary ring-1 ring-inset ring-primary/10">
                    <item.icon className="size-3.5" strokeWidth={1.8} />
                  </span>
                  <strong className="text-xs font-semibold leading-snug text-foreground/80">{item.title}</strong>
                </div>
              ))}
              </div>
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
      image: journeyGroundSupport,
      en: ["Choose your on-ground support", "Select pickup, accommodation guidance, translation and coordination"],
      zh: ["选择落地支持服务", "按需选择接机、住宿建议、翻译与行程协调"],
      ru: ["Выберите поддержку на месте", "Выберите трансфер, помощь с проживанием, перевод и координацию"],
    },
    {
      icon: HeartPulse,
      image: journeyTreatment,
      en: ["Receive coordinated treatment support", "Get practical communication and scheduling help during clinic visits"],
      zh: ["获得治疗协调支持", "就诊期间获得沟通、翻译与日程协调协助"],
      ru: ["Получите поддержку во время лечения", "Получайте помощь с общением и расписанием во время визитов"],
    },
    {
      icon: Map,
      image: journeyRecovery,
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

const TreatmentsSectionLegacy = () => {
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
    "text-[1.65rem] text-primary md:text-[1.85rem]",
    "text-xl text-foreground md:text-[1.35rem]",
    "text-base text-foreground/72",
    "text-base text-foreground/60",
    "text-sm text-primary",
    "text-sm text-foreground/65",
  ];
  const treatmentCloudRailRef = useRef<HTMLDivElement>(null);
  const treatmentCloudPausedRef = useRef(false);
  const treatmentCloudIndexRef = useRef(0);
  const [activeTreatmentCloud, setActiveTreatmentCloud] = useState(0);
  const showTreatmentCloud = (index: number) => {
    const rail = treatmentCloudRailRef.current;
    const card = rail?.children[index] as HTMLElement | undefined;
    if (!rail || !card) return;
    const left = card.offsetLeft - rail.offsetLeft - Math.max(0, (rail.clientWidth - card.clientWidth) / 2);
    rail.scrollTo({ left, behavior: "smooth" });
    treatmentCloudIndexRef.current = index;
    setActiveTreatmentCloud(index);
  };
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
      setActiveTreatmentCloud(nextIndex % procedureClouds.length);
      if (nextIndex === procedureClouds.length) {
        resetTimer = window.setTimeout(() => {
          const firstCard = rail.children[0] as HTMLElement | undefined;
          if (!firstCard) return;
          rail.scrollTo({ left: firstCard.offsetLeft - rail.offsetLeft, behavior: "auto" });
          treatmentCloudIndexRef.current = 0;
          setActiveTreatmentCloud(0);
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
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[hsl(158,58%,90%)] via-[hsl(145,48%,92%)] to-[hsl(50,78%,91%)] shadow-pop md:rounded-[2.5rem]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" aria-hidden="true" />
        <div
          ref={treatmentCloudRailRef}
          onMouseEnter={() => { treatmentCloudPausedRef.current = true; }}
          onMouseLeave={() => { treatmentCloudPausedRef.current = false; }}
          onTouchStart={() => { treatmentCloudPausedRef.current = true; }}
          onTouchEnd={() => { treatmentCloudPausedRef.current = false; }}
          onFocusCapture={() => { treatmentCloudPausedRef.current = true; }}
          onBlurCapture={() => { treatmentCloudPausedRef.current = false; }}
          className="relative flex touch-pan-x snap-x snap-mandatory items-stretch overflow-x-auto overscroll-x-contain scroll-smooth px-5 pb-2 pt-5 scrollbar-hide sm:px-7 md:px-9 md:pb-4 md:pt-7"
        >
          {[...procedureClouds, ...procedureClouds].map((cloud, repeatedIndex) => {
          const cloudIndex = repeatedIndex % procedureClouds.length;
          const duplicate = repeatedIndex >= procedureClouds.length;
          const CloudIcon = cloud.icon;
          return (
          <article key={`${cloud.en}-${duplicate ? "loop" : "primary"}`} aria-hidden={duplicate || undefined} className="group relative flex min-h-[285px] w-[78vw] min-w-[78vw] shrink-0 snap-center flex-col justify-center border-r border-primary/12 px-6 py-5 transition-colors duration-200 hover:bg-white/20 focus-within:bg-white/25 sm:w-[48vw] sm:min-w-[48vw] md:min-h-[300px] md:w-[calc(100%/3)] md:min-w-[calc(100%/3)] xl:w-1/4 xl:min-w-[25%]">
            <span className="absolute right-5 top-2 font-display text-6xl font-medium leading-none text-foreground/[0.045] transition-colors duration-200 group-hover:text-primary/[0.09]">{String(cloudIndex + 1).padStart(2, "0")}</span>
            <div className="mb-3 flex justify-center" aria-hidden="true">
              <span className="flex size-12 items-center justify-center text-primary transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
                <CloudIcon strokeWidth={1.3} className="size-10" />
              </span>
            </div>
            <div className="relative flex items-center justify-center gap-2 text-center">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">{lang === "zh" ? cloud.zh : cloud.en}</h3>
            </div>
            <div className="relative mt-4 flex flex-wrap content-center items-baseline justify-center gap-x-3.5 gap-y-2 text-center">
              {cloud.items.map(([en, zh], itemIndex) => (
                <Link
                  key={en}
                  to={`/treatments/${en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
                  tabIndex={duplicate ? -1 : undefined}
                  className={`rounded-sm px-0.5 font-display font-semibold leading-[0.98] tracking-[-0.035em] transition duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${itemStyles[itemIndex % itemStyles.length]}`}
                >
                  {lang === "zh" ? zh : en}
                </Link>
              ))}
            </div>
          </article>
          );})}
        </div>
        <div className="relative flex flex-col items-center justify-between gap-3 border-t border-white/55 bg-white/22 px-5 py-3.5 backdrop-blur-sm sm:flex-row sm:px-7 md:px-9">
          <div className="flex items-center gap-4">
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/55 lg:inline">
              {lang === "zh" ? "探索全部 12 类项目" : lang === "ru" ? "12 направлений" : "Explore all 12 specialties"}
            </span>
            <div className="flex items-center gap-1.5" aria-label={lang === "zh" ? "选择项目分类" : "Choose a specialty"}>
              {procedureClouds.map((cloud, index) => (
                <button
                  key={cloud.en}
                  type="button"
                  aria-label={lang === "zh" ? cloud.zh : cloud.en}
                  aria-pressed={activeTreatmentCloud === index}
                  onClick={() => showTreatmentCloud(index)}
                  className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${activeTreatmentCloud === index ? "w-7 bg-primary" : "w-1.5 bg-primary/25 hover:bg-primary/50"}`}
                />
              ))}
            </div>
          </div>
          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
            <p className="text-sm text-foreground/65">
              {lang === "zh" ? "还不确定适合哪一项？" : lang === "ru" ? "Не знаете, с чего начать?" : "Not sure where to begin?"}
            </p>
            <QuoteCtaButton quoteCtx={{ source: "procedure_specialties" }} className="min-h-10 px-5 text-xs hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </section>
  );
};

const TreatmentsSection = () => {
  const { t, lang } = useAsia();
  const procedureGoals = [
    {
      key: "nose",
      image: procedureRhinoplasty,
      en: "Refine your profile",
      zh: "改善面部侧颜",
      ru: "Гармоничный профиль",
      descriptionEn: "Explore nose procedures with published expert information and practical planning support.",
      descriptionZh: "了解鼻部项目、公开专家信息与实际行程协调支持。",
      descriptionRu: "Изучите операции на носу, информацию об экспертах и поддержку в планировании.",
      treatments: [["Rhinoplasty", "鼻综合"], ["Revision Rhinoplasty", "鼻修复"], ["Nasal Tip Surgery", "鼻尖塑形"]],
      href: "/treatments/rhinoplasty",
    },
    {
      key: "eyes",
      image: procedureEyes,
      en: "Refresh your eyes",
      zh: "改善眼部状态",
      ru: "Освежить взгляд",
      treatments: [["Double Eyelid", "双眼皮"], ["Blepharoplasty", "眼睑成形"], ["Ptosis Correction", "上睑下垂矫正"]],
      href: "/treatments/double-eyelid-surgery",
    },
    {
      key: "face",
      image: procedureFacelift,
      en: "Restore facial definition",
      zh: "重塑面部轮廓",
      ru: "Чёткие контуры лица",
      treatments: [["Facelift", "面部拉皮"], ["Neck Lift", "颈部提升"], ["Fat Grafting", "脂肪填充"]],
      href: "/treatments/facelift",
    },
    {
      key: "body",
      image: procedureBody,
      en: "Shape body contours",
      zh: "改善身体线条",
      ru: "Контуры тела",
      treatments: [["Liposuction", "吸脂"], ["Tummy Tuck", "腹壁成形"], ["Body Lift", "身体提升"]],
      href: "/treatments/liposuction",
    },
    {
      key: "breast",
      image: procedureBreast,
      en: "Explore breast options",
      zh: "了解胸部项目",
      ru: "Операции на груди",
      treatments: [["Augmentation", "隆胸"], ["Breast Lift", "乳房提升"], ["Revision", "假体修复"]],
      href: "/treatments/breast-augmentation",
    },
    {
      key: "hair",
      image: procedureHair,
      en: "Restore hair naturally",
      zh: "自然改善发量",
      ru: "Восстановление волос",
      treatments: [["FUE Transplant", "FUE 植发"], ["Hairline", "发际线种植"], ["Crown", "头顶加密"]],
      href: "/treatments/fue-hair-transplant",
    },
    {
      key: "contour",
      image: procedureJaw,
      en: "Define facial contours",
      zh: "精塑面部轮廓",
      ru: "Скорректировать овал лица",
      treatments: [["Jaw Contouring", "下颌角整形"], ["Chin Augmentation", "下巴塑形"], ["Genioplasty", "颏成形术"]],
      href: "/treatments/jaw-contouring",
    },
    {
      key: "dentistry",
      image: procedureDental,
      en: "Restore your smile",
      zh: "焕新自然笑容",
      ru: "Восстановить улыбку",
      treatments: [["Dental Implants", "种植牙"], ["Porcelain Veneers", "瓷贴面"], ["Teeth Whitening", "牙齿美白"]],
      href: "/treatments/dental-implants",
    },
    {
      key: "skin",
      image: procedureSkin,
      en: "Renew your skin",
      zh: "改善肌肤质感",
      ru: "Обновить кожу",
      treatments: [["Laser Resurfacing", "激光焕肤"], ["RF Microneedling", "射频微针"], ["Skin Tightening", "皮肤紧致"]],
      href: "/treatments/laser-skin-resurfacing",
    },
    {
      key: "lips",
      image: procedureLips,
      en: "Refine lips & smile",
      zh: "精致唇形与笑容",
      ru: "Подчеркнуть губы и улыбку",
      treatments: [["Lip Lift", "唇部提升"], ["Lip Contouring", "唇形塑造"], ["Gummy Smile", "露龈笑改善"]],
      href: "/treatments/lip-lift",
    },
    {
      key: "transformation",
      image: procedureWeightLoss,
      en: "Complete your transformation",
      zh: "完善整体身形",
      ru: "Завершить преображение",
      treatments: [["Body Lift", "身体提升"], ["Arm Lift", "手臂提升"], ["Thigh Lift", "大腿提升"]],
      href: "/treatments/body-lift",
    },
    {
      key: "men",
      image: procedureMen,
      en: "Care designed for men",
      zh: "男士专属改善方案",
      ru: "Процедуры для мужчин",
      treatments: [["Male Breast Reduction", "男性乳房缩小"], ["Male Liposuction", "男士吸脂"], ["Hair Transplant", "植发"]],
      href: "/treatments/male-breast-reduction",
    },
  ];
  const labelFor = (goal: typeof procedureGoals[number]) => lang === "zh" ? goal.zh : lang === "ru" ? goal.ru : goal.en;
  return (
    <section id="projects" className="container py-10 md:py-16" aria-labelledby="procedure-goals-title">
      <div className="mb-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.46fr)] lg:items-end md:mb-10">
        <div>
          <span className="pill mb-3 bg-accent text-accent-foreground"><Flame className="size-3.5" /> {t("tx.kicker")}</span>
          <h2 id="procedure-goals-title" className="max-w-3xl font-display text-3xl font-medium leading-[0.98] tracking-tight sm:text-4xl md:text-5xl">
            {lang === "zh" ? <>从你的目标出发，<em className="not-italic text-primary">了解适合的项目</em></> : lang === "ru" ? <>Начните с вашей цели — <em className="not-italic text-primary">изучите варианты</em></> : <>Start with your goals. <em className="not-italic text-primary">Explore your options.</em></>}
          </h2>
        </div>
        <div className="lg:pb-1">
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {lang === "zh" ? "不需要提前知道具体术式。先选择你想改善的方向，再查看相关项目与公开专家信息。" : lang === "ru" ? "Не обязательно заранее знать название процедуры. Выберите цель и изучите подходящие варианты и опубликованную информацию об экспертах." : "You do not need to know the procedure name yet. Choose what you want to improve, then review relevant options and published expert information."}
          </p>
          <Link to="/treatments" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground underline decoration-primary/40 underline-offset-4 transition-colors duration-150 hover:text-primary">
            {lang === "zh" ? "查看全部项目" : lang === "ru" ? "Все процедуры" : "View all procedures"}<ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      <div className="flex touch-pan-x snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 scrollbar-hide md:gap-4" aria-label={lang === "zh" ? "12 个项目方向，可横向滑动浏览" : "12 procedure goals, scroll horizontally to explore"}>
        {procedureGoals.map((goal, index) => (
          <Link key={goal.key} to={goal.href} className="group relative min-h-[300px] w-[76vw] min-w-[76vw] shrink-0 snap-center overflow-hidden rounded-[1.6rem] bg-foreground shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-[44vw] sm:min-w-[44vw] lg:min-h-[340px] lg:w-[calc((100%_-_5rem)/6)] lg:min-w-[calc((100%_-_5rem)/6)] lg:snap-start">
            <img src={goal.image} alt={labelFor(goal)} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-400 ease-out group-hover:scale-[1.035]" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/20 to-transparent" />
            <div className="relative flex min-h-[300px] flex-col justify-end p-5 text-background lg:min-h-[340px]">
              <span className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-background/60">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-2xl font-medium leading-[0.95] lg:text-[1.7rem]">{labelFor(goal)}</h3>
              <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-background/70">{goal.treatments.map(([en, zh]) => lang === "zh" ? zh : en).join(" · ")}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-background/90">{lang === "zh" ? "查看项目" : lang === "ru" ? "Смотреть" : "Explore"}<ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" /></span>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-end gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <span>{lang === "zh" ? "12 个方向 · 横向滑动浏览" : lang === "ru" ? "12 направлений · листайте вправо" : "12 specialties · scroll to explore"}</span>
        <ArrowRight className="size-3.5 text-primary" />
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
<section id="compliance" className="container py-8 md:py-12">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 md:mb-6">
        <div>
          <span className="pill bg-accent text-accent-foreground mb-3"><Stethoscope className="size-3.5" /> {t("doctors.kicker")}</span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight">
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
className="flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth rounded-[2rem] bg-gradient-to-r from-[hsl(158,58%,90%)] via-[hsl(145,48%,91%)] to-[hsl(50,80%,91%)] px-4 py-4 shadow-pop scrollbar-hide md:gap-5 md:px-6 md:py-5"
      >
        {displayedDoctors.map((d) => {
          const photo = d.photo;
          return (
          <Link
            key={d.id}
            to={d.demo ? `/doctors/demo/${d.id}` : `/doctors/profile/${d.id}`}
            aria-label={`${lang === "zh" ? "查看专家资料" : lang === "ru" ? "Профиль эксперта" : "View expert profile"}: ${d.name}`}
            className="group flex min-w-[82vw] snap-center rounded-3xl [perspective:1200px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 sm:min-w-[62vw] md:min-w-[calc((100%_-_3rem)/3)] md:max-w-[calc((100%_-_3rem)/3)]"
          >
            <article className="relative min-h-[400px] w-full rounded-3xl transition-transform [transform-style:preserve-3d] [transition-duration:380ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:min-h-[420px] md:group-hover:[transform:rotateY(180deg)] md:group-focus-visible:[transform:rotateY(180deg)]">
              <div className="absolute inset-0 flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft [backface-visibility:hidden]">
                <div className="relative flex-1 overflow-hidden bg-primary/10">
                  {photo ? <img src={photo} alt={d.name} className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transition-none" /> : <div className="grid size-full place-items-center text-primary"><Stethoscope className="size-16" /></div>}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  {d.demo && <span className="absolute left-4 top-4 inline-flex rounded-full border border-white/55 bg-white/88 px-3 py-1.5 text-[10px] font-semibold text-foreground shadow-sm backdrop-blur-sm">Sample profile · {d.photoKind === "stock" ? "stock photo" : "AI image"}</span>}
<div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <span className="mb-2 inline-flex rounded-full border border-white/25 bg-black/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-white/90 backdrop-blur-sm">{d.roleLabel}</span>
                    <h3 className="font-display text-2xl font-semibold leading-tight md:text-[1.65rem]">{d.name}</h3>
                    <p className="mt-1 text-sm font-medium text-white/80">{d.title}</p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-white/85"><MapPin className="size-4 text-primary" />{d.city}</p>
                  </div>
                </div>
                <div className="flex min-h-16 items-center justify-between px-6 text-sm font-semibold text-foreground md:hidden">
                  {lang === "zh" ? "查看专家资料" : lang === "ru" ? "Профиль эксперта" : "View expert profile"}
                  <ArrowRight className="size-4 text-primary" />
                </div>
              </div>

<div className="absolute inset-0 hidden flex-col overflow-hidden rounded-3xl border border-primary/25 bg-card p-6 shadow-pop [backface-visibility:hidden] [transform:rotateY(180deg)] md:flex">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">{d.roleLabel}</span>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-foreground md:text-[1.65rem]">{d.name}</h3>
                <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-foreground/75"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" />{d.city} · {d.hospital}</p>
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">{d.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {d.specialties.slice(0, 3).map((s) => <span key={s} className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">{s}</span>)}
                </div>
                <span className="mt-auto flex min-h-10 items-center justify-between border-t border-border/70 pt-4 text-sm font-semibold text-foreground">
                  {lang === "zh" ? "查看专家资料" : lang === "ru" ? "Профиль эксперта" : "View expert profile"}
                  <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </article>
          </Link>
        )})}
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
    <section id="consultation" className="container py-12 md:py-16" aria-labelledby="consultation-title">
      <div className="overflow-hidden rounded-[2rem] border border-primary/15 bg-card text-foreground shadow-[0_24px_65px_rgba(22,63,52,0.11),0_3px_10px_rgba(22,63,52,0.05)]">
        <div className="grid md:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
          <div className="px-5 py-8 sm:px-8 md:px-10 md:py-11 lg:px-12">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              <MessageCircle className="size-3.5" /> {copy.eyebrow}
            </span>
            <h2 id="consultation-title" className="max-w-3xl font-display text-4xl font-medium leading-[1.02] tracking-tight sm:text-5xl md:text-[3.5rem]">
              {copy.title}<br className="hidden sm:block" />{" "}<em className="text-primary not-italic">{copy.emphasis}</em>
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{copy.text}</p>
          </div>

          <div className="m-4 rounded-[1.5rem] border border-primary/25 bg-[hsl(156_48%_89%)] p-5 shadow-[0_16px_38px_rgba(22,63,52,0.12),0_2px_6px_rgba(22,63,52,0.06)] sm:m-5 sm:p-6 md:flex md:flex-col md:justify-center lg:m-6 lg:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
              {lang === "zh" ? "选择联系方式" : lang === "ru" ? "Выберите способ связи" : "Choose how to connect"}
            </p>
            <h3 className="mt-2 font-display text-2xl font-medium leading-tight">
              {lang === "zh" ? "邮件或 WhatsApp，由你决定。" : lang === "ru" ? "Email или WhatsApp — на ваш выбор." : "Email or WhatsApp—your choice."}
            </h3>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <span className="flex min-h-12 items-center gap-2 rounded-xl border border-border/80 bg-card px-3 text-xs font-semibold shadow-[0_4px_12px_rgba(22,63,52,0.05)]"><Mail className="size-4 text-primary" />Email</span>
              <span className="flex min-h-12 items-center gap-2 rounded-xl border border-border/80 bg-card px-3 text-xs font-semibold shadow-[0_4px_12px_rgba(22,63,52,0.05)]"><MessageCircle className="size-4 text-primary" />WhatsApp</span>
            </div>
            <Button size="lg" onClick={() => open()} className="cta-primary mt-3 min-h-[52px] w-full rounded-xl px-7 text-sm shadow-[0_12px_24px_rgba(13,54,44,0.18)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(13,54,44,0.22)]">
              {lang === "zh" ? "开始免费咨询" : lang === "ru" ? "Начать консультацию" : "Start a consultation"}<ArrowRight className="ml-2 size-4" />
            </Button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              {lang === "zh" ? "免费 · 无义务 · 由协调团队回复" : lang === "ru" ? "Бесплатно · без обязательств" : "Free · No obligation · Coordinator reply"}
            </p>
          </div>
        </div>
        <div className="border-t border-border/70 px-5 py-4 sm:px-8 md:px-10 lg:px-12">
          <MedicalDisclaimer variant="inline" className="text-muted-foreground/90" />
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
      <div className="relative overflow-hidden rounded-[2.25rem] border border-primary/20 bg-card p-5 shadow-pop sm:p-7 md:p-10 lg:p-12">
        <div className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full bg-[hsl(var(--primary)/.12)] blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 size-64 rounded-full bg-[hsl(48_86%_82%/.2)] blur-3xl" aria-hidden="true" />

        <div className="relative max-w-4xl">
          <span className="pill mb-4 border border-primary/15 bg-primary/10 text-foreground"><Wallet className="size-3.5 text-primary" /> {c("Payment, made simple", "付款方式，一眼看懂", "Оплата — всё просто")}</span>
          <h2 id="home-faq-title" className="font-display text-3xl font-medium leading-[1.04] tracking-tight sm:text-4xl md:text-5xl">
            {c("Simple, transparent payments. ", "付款简单透明，", "Простая и прозрачная оплата. ")}<em className="not-italic text-primary">{c("Know exactly where your money goes.", "每一笔都清楚去向。", "Вы точно знаете, куда идут ваши деньги.")}</em>
          </h2>
        </div>

        <div className="relative mt-8 grid gap-4 lg:grid-cols-2 lg:gap-5">
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-card bg-foreground text-background shadow-soft lg:grid" aria-hidden="true">
            <ArrowRight className="size-4" strokeWidth={2} />
          </div>

          <article className="group relative overflow-hidden rounded-[1.75rem] border border-primary/20 bg-[hsl(var(--primary)/.075)] p-5 shadow-soft transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-pop sm:p-7">
            <span className="absolute right-5 top-4 font-display text-5xl font-medium text-primary/10" aria-hidden="true">01</span>
            <div className="relative flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_8px_22px_hsl(var(--primary)/.22)]"><Building2 className="size-5" strokeWidth={2} /></span>
              <div className="min-w-0 pt-0.5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{c("Medical treatment", "手术与医疗费用", "Медицинские услуги")}</p>
                <h3 className="mt-1 font-display text-xl font-medium leading-tight text-foreground sm:text-2xl">{c("Pay the clinic directly", "直接支付给诊所或医院", "Оплачивайте напрямую клинике")}</h3>
              </div>
            </div>
            <p className="relative mt-5 max-w-xl text-[15px] leading-7 text-foreground/70 sm:text-base">{c("Your clinic or hospital collects all surgery, examination and anesthesia fees. Cosmetics Asia does not collect your medical payment.", "手术、检查和麻醉等医疗费用均由诊所或医院直接收取，Cosmetics Asia 不代收。", "Операция, обследования и анестезия оплачиваются напрямую клинике или больнице. Cosmetics Asia не принимает медицинские платежи.")}</p>
          </article>

          <article className="group relative overflow-hidden rounded-[1.75rem] border border-[hsl(43_70%_72%/.65)] bg-[hsl(48_82%_94%)] p-5 shadow-soft transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:border-[hsl(43_70%_62%/.8)] hover:shadow-pop sm:p-7">
            <span className="absolute right-5 top-4 font-display text-5xl font-medium text-[hsl(33_78%_38%/.09)]" aria-hidden="true">02</span>
            <div className="relative flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[hsl(42_88%_86%)] text-[hsl(33_78%_33%)] shadow-[0_8px_22px_hsl(42_70%_55%/.16)]"><Wallet className="size-5" strokeWidth={2} /></span>
              <div className="min-w-0 pt-0.5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[hsl(33_72%_35%)]">{c("Before departure", "出发前", "До вылета")}</p>
                <h3 className="mt-1 font-display text-xl font-medium leading-tight text-foreground sm:text-2xl">{c("$400 coordination deposit", "支付 $400 协调押金", "Координационный депозит $400")}</h3>
              </div>
            </div>
            <p className="relative mt-5 max-w-xl text-[15px] leading-7 text-foreground/70 sm:text-base">{c("It reserves your procedure appointment and coordinates airport pickup and in-clinic translation. It remains valid for 12 months and is refunded when you pay the clinic for treatment.", "用于保留手术预约，并协调机场接送和院内翻译。押金在 12 个月内有效，并在你向诊所支付治疗费用时退还。", "Он закрепляет время процедуры и помогает организовать трансфер и перевод в клинике. Депозит действует 12 месяцев и возвращается после оплаты лечения в клинике.")}</p>
          </article>
        </div>

        <div className="relative mt-5 grid gap-6 rounded-[1.75rem] border border-border/80 bg-background/65 p-5 sm:p-7 lg:grid-cols-[0.52fr_1.48fr] lg:items-start lg:gap-8">
          <div className="lg:py-1">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{c("Need more detail?", "还想了解更多？", "Нужны подробности?")}</p>
            <h3 className="mt-2 font-display text-2xl font-medium leading-tight sm:text-3xl">{c("Common questions", "常见问题", "Частые вопросы")}</h3>
            <Link to="/travel-packages" className="group/link mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/20 bg-card px-4 text-sm font-semibold text-foreground shadow-soft transition-[color,border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary">
              {c("Explore travel support", "查看行程支持", "Подробнее о поддержке в поездке")}<ArrowRight className="size-4 text-primary transition-transform duration-150 group-hover/link:translate-x-1" />
            </Link>
          </div>

          <Accordion type="single" collapsible className="overflow-hidden rounded-2xl border border-border/80 bg-card px-4 shadow-soft sm:px-5">
            {questions.slice(2).map((item, index) => (
              <AccordionItem key={item.q} value={`faq-${index + 2}`} className="border-border/65 last:border-0">
                <AccordionTrigger className="group gap-4 rounded-xl px-1 py-4 text-left text-sm font-semibold transition-colors duration-150 hover:bg-primary/[0.045] hover:no-underline sm:text-base">
                  <span className="flex items-start gap-3"><span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 font-mono text-[10px] text-primary">0{index + 1}</span><span className="pt-0.5">{item.q}</span></span>
                </AccordionTrigger>
                <AccordionContent className="pl-10 pr-3 text-sm leading-relaxed text-muted-foreground sm:pl-11 sm:text-[15px]">
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


// ============== Page ==============
const AsiaIndex = () => (
  <>
    <PageMeta
      title="Cosmetic Surgery in Asia | Patient Diaries"
      description="Explore published cosmetic expert profiles, patient journey previews, procedure guides, and practical travel and aftercare support for cosmetic care in China."
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
        <CitiesSection />
        <AppPromoSection />
      </main>
      <Footer />
    </div>
  </>
);

export default AsiaIndex;

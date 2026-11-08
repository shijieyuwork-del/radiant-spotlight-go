import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Building2, ShieldCheck, Wallet, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAsia, type AsiaLang } from "@/lib/asia-i18n";
import { translatedUiText } from "@/lib/locale-text";
import { getClinicPath, STATIC_CLINICS } from "@/data/clinicDirectory";
import QuoteCtaButton from "@/components/QuoteCtaButton";
import { usePublishedDoctors } from "@/hooks/use-published-doctors";
import { selectHomepageDoctors } from "@/data/homepage-doctors";
import { HomeSection } from "@/components/home/HomeSection";
import { SectionActionLink, SectionHeader } from "@/components/home/SectionHeader";
import DoctorFlipCard, { type DoctorFlipCardData } from "@/components/home/DoctorFlipCard";
import DoctorMarquee from "@/components/home/DoctorMarquee";
import { responsiveImageProps } from "@/lib/responsive-images";
import journeyConsultation from "@/assets/journey-premium-natural-consultation-v5.webp";
import journeyArrival from "@/assets/journey-premium-natural-arrival-v5.webp";
import journeyGroundSupport from "@/assets/journey-premium-natural-concierge-v5.webp";
import journeyTreatment from "@/assets/journey-premium-clinic-v6.webp";
import journeyRecovery from "@/assets/journey-premium-natural-recovery-v5.webp";
import journeyFollowUp from "@/assets/journey-premium-natural-followup-v5.webp";
import procedureRhinoplasty from "@/assets/procedures/rhinoplasty.jpg";
import procedureEyes from "@/assets/procedures/double-eyelid-natural-v4.webp";
import procedureFacelift from "@/assets/procedures/facelift.jpg";
import procedureBody from "@/assets/procedures/body-contouring-natural-v2.webp";
import procedureBreast from "@/assets/procedures/breast-augmentation.jpg";
import procedureHair from "@/assets/procedures/fue-hair-transplant.jpg";
import procedureJaw from "@/assets/procedures/jaw-contouring.jpg";
import procedureDental from "@/assets/procedures/dental-implants.jpg";
import procedureSkin from "@/assets/procedures/laser-skin-resurfacing.jpg";
import procedureLips from "@/assets/procedures/lip-lift.jpg";
import procedureWeightLoss from "@/assets/procedures/body-lift.jpg";
import procedureMen from "@/assets/procedures/male-breast-reduction.jpg";
import chineseDoctorTeam from "@/assets/chinese-doctor-team-candid-v1.webp";
import shanghaiHuameiClinic from "@/assets/clinics/shanghai-huamei.jpg";
import beijingBadachuClinic from "@/assets/clinics/beijing-badachu.jpg";
import guangzhouHuameiClinic from "@/assets/clinics/guangzhou-huamei.jpg";
import shanghaiNinthClinic from "@/assets/clinics/shanghai-ninth.jpg";
import shanghaiWeilinClinic from "@/assets/clinics/shanghai-weilin.jpg";
import beijingYestarClinic from "@/assets/clinics/beijing-yestar.jpg";
import guangzhouNanfangClinic from "@/assets/clinics/guangzhou-nanfang.jpg";
import hangzhouZju2Clinic from "@/assets/clinics/hangzhou-zju2.jpg";
import hangzhouPlasticClinic from "@/assets/clinics/hangzhou-plastic.jpg";
import hainanGeneralClinic from "@/assets/clinics/hainan-general.jpg";
export const ClinicsSection = () => {
  const { t, lang } = useAsia();
  const clinicText = (en: string, zh: string) => lang === "zh" ? zh : translatedUiText(lang, en);
  const [clinicMotionPaused, setClinicMotionPaused] = useState(false);
  const clinics = [
    {
      en: "Shanghai Huamei Plastic Surgery Hospital",
      zh: "上海华美医疗美容医院",
      cityEn: "Shanghai · Pudong New Area",
      cityZh: "上海 · 浦东新区",
      image: shanghaiHuameiClinic,
      descriptionEn: "View the published Pudong address and confirm current services, specialists and appointment details before booking.",
      descriptionZh: "查看浦东院区公开地址，并在预约前确认现有项目、专家与就诊安排。",
      tagsEn: ["Campus details", "Confirm available services"],
      tagsZh: ["院区资料", "项目需确认"],
    },
    {
      en: "Plastic Surgery Hospital, CAMS (Badachu)",
      zh: "中国医学科学院整形外科医院（八大处）",
      cityEn: "Beijing · Shijingshan District",
      cityZh: "北京 · 石景山区",
      image: beijingBadachuClinic,
      descriptionEn: "A specialist plastic-surgery hospital affiliated with the Chinese Academy of Medical Sciences.",
      descriptionZh: "隶属于中国医学科学院的整形外科专科医院，覆盖多个整形与修复方向。",
      tagsEn: ["Reconstructive", "Revision", "Facial surgery"],
      tagsZh: ["整形修复", "修复手术", "面部整形"],
    },
    {
      en: "Guangzhou Huamei Aesthetic Hospital",
      zh: "广州华美医疗美容医院",
      cityEn: "Guangzhou · Tianhe District",
      cityZh: "广州 · 天河区",
      image: guangzhouHuameiClinic,
      descriptionEn: "Public filings list cosmetic surgery, dermatology and dental departments. Check the Tianhe address and confirm your appointment.",
      descriptionZh: "公开文件列有美容外科、美容皮肤科和美容牙科。查看天河院区地址，并确认具体就诊安排。",
      tagsEn: ["Cosmetic surgery", "Dermatology", "Dental"],
      tagsZh: ["美容外科", "美容皮肤科", "美容牙科"],
    },
    {
      en: "Shanghai Ninth People's Hospital · Plastic Surgery",
      zh: "上海九院 整形外科",
      cityEn: "Shanghai · Huangpu District",
      cityZh: "上海 · 黄浦区",
      image: shanghaiNinthClinic,
      descriptionEn: "A major public teaching hospital with an established plastic and reconstructive surgery department.",
      descriptionZh: "大型公立教学医院，设有成熟的整复外科与修复重建诊疗体系。",
      tagsEn: ["Public hospital", "Reconstructive", "Academic center"],
      tagsZh: ["公立医院", "整形修复", "学术中心"],
    },
    {
      en: "Shanghai Weilin Aesthetic Hospital",
      zh: "上海薇琳医疗美容医院",
      cityEn: "Shanghai · Jing'an District",
      cityZh: "上海 · 静安区",
      image: shanghaiWeilinClinic,
      descriptionEn: "A centrally located aesthetic hospital offering surgical and non-surgical consultations in Shanghai.",
      descriptionZh: "位于上海市中心，提供手术与非手术医美项目咨询。",
      tagsEn: ["Aesthetic surgery", "Skin treatments", "Central Shanghai"],
      tagsZh: ["美容外科", "皮肤管理", "上海市中心"],
    },
    {
      en: "Beijing Yestar Aesthetic Hospital",
      zh: "北京艺星医疗美容医院",
      cityEn: "Beijing · Chaoyang District",
      cityZh: "北京 · 朝阳区",
      image: beijingYestarClinic,
      descriptionEn: "A private aesthetic hospital in Chaoyang with surgical, dermatology and consultation services.",
      descriptionZh: "位于朝阳区的医美机构，提供美容外科、皮肤与面诊服务。",
      tagsEn: ["Cosmetic surgery", "Dermatology", "Private hospital"],
      tagsZh: ["美容外科", "美容皮肤科", "私立医院"],
    },
    {
      en: "Nanfang Hospital · Plastic Surgery",
      zh: "南方医科大学南方医院 整形美容外科",
      cityEn: "Guangzhou · Baiyun District",
      cityZh: "广州 · 白云区",
      image: guangzhouNanfangClinic,
      descriptionEn: "A university-affiliated public hospital with specialist plastic and aesthetic surgery services.",
      descriptionZh: "大学附属公立医院，设有专业的整形美容外科诊疗服务。",
      tagsEn: ["Public hospital", "University affiliated", "Plastic surgery"],
      tagsZh: ["公立医院", "大学附属", "整形外科"],
    },
    {
      en: "Second Affiliated Hospital of Zhejiang University · Plastic Surgery",
      zh: "浙江大学医学院附属第二医院 整形科",
      cityEn: "Hangzhou · Shangcheng District",
      cityZh: "杭州 · 上城区",
      image: hangzhouZju2Clinic,
      descriptionEn: "A Zhejiang University teaching hospital providing specialist plastic and reconstructive care.",
      descriptionZh: "浙江大学附属教学医院，提供专业整形与修复重建诊疗。",
      tagsEn: ["Public hospital", "Teaching hospital", "Reconstructive"],
      tagsZh: ["公立医院", "教学医院", "整形修复"],
    },
    {
      en: "Hangzhou Plastic Surgery Hospital",
      zh: "杭州整形医院",
      cityEn: "Hangzhou · Shangcheng District",
      cityZh: "杭州 · 上城区",
      image: hangzhouPlasticClinic,
      descriptionEn: "A specialist hospital focused on plastic surgery, aesthetic procedures and coordinated consultations.",
      descriptionZh: "专注整形外科、美容项目与就诊咨询的专科医院。",
      tagsEn: ["Specialist hospital", "Aesthetic surgery", "Consultations"],
      tagsZh: ["专科医院", "美容外科", "就诊咨询"],
    },
    {
      en: "Hainan General Hospital · Plastic Surgery",
      zh: "海南省人民医院 整形美容外科",
      cityEn: "Hainan · Haikou",
      cityZh: "海南 · 海口",
      image: hainanGeneralClinic,
      descriptionEn: "A major public hospital in Haikou with plastic surgery and multidisciplinary medical support.",
      descriptionZh: "海口大型公立医院，设有整形美容外科及多学科医疗支持。",
      tagsEn: ["Public hospital", "Plastic surgery", "Haikou"],
      tagsZh: ["公立医院", "整形外科", "海口"],
    },
  ];
  const clinicCard = (clinic: (typeof clinics)[number], duplicate = false) => {
    const listing = STATIC_CLINICS.find((item) => item.nameEn === clinic.en);
    const destination = listing ? getClinicPath(listing) : `/clinics?q=${encodeURIComponent(clinic.en)}`;

    return (
      <Link
        key={`${duplicate ? "copy" : "clinic"}-${clinic.en}`}
        to={destination}
        tabIndex={duplicate ? -1 : 0}
        aria-hidden={duplicate || undefined}
        className="group flex w-[80vw] max-w-[25rem] shrink-0 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 sm:w-[24rem]"
      >
        <article className="home-clinic-card flex min-h-[252px] w-full flex-col rounded-3xl border border-border bg-card p-5 shadow-soft transition duration-300 group-hover:-translate-y-1 group-hover:border-primary/35 group-hover:shadow-pop motion-reduce:transform-none motion-reduce:transition-none sm:p-5">
          <div className="flex min-w-0 items-center gap-3.5">
            <img src={clinic.image} {...responsiveImageProps(clinic.image, "64px")} alt="" loading="lazy" decoding="async" className="size-16 shrink-0 rounded-full border-2 border-primary/15 object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none" />
            <div className="min-w-0">
              <h3 className="line-clamp-2 min-h-[3rem] font-display text-lg font-semibold leading-tight text-foreground">{clinicText(clinic.en, clinic.zh)}</h3>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-foreground"><MapPin className="size-3.5 text-primary" />{clinicText(clinic.cityEn, clinic.cityZh)}</p>
            </div>
          </div>
          <p className="mt-4 line-clamp-3 min-h-[4rem] text-sm leading-relaxed text-muted-foreground">{clinicText(clinic.descriptionEn, clinic.descriptionZh)}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {clinic.tagsEn.map((tag, index) => <span key={tag} className="rounded-full bg-accent px-2.5 py-1 text-label text-accent-foreground">{clinicText(tag, clinic.tagsZh[index])}</span>)}
          </div>
        </article>
      </Link>
    );
  };
  return (
    <HomeSection id="clinics" tone="sage" ariaLabelledBy="home-clinics-title">
      <SectionHeader
        icon={Building2}
        eyebrow={t("cities.kicker")}
        titleId="home-clinics-title"
        title={<>{t("cities.title1")} <em className="not-italic text-brand">{t("cities.titleEm")}</em></>}
        action={<SectionActionLink to="/clinics" className="hidden sm:inline-flex">{clinicText("All clinics", "全部机构")}</SectionActionLink>}
      />
      <div
        id="home-clinics-rail"
        className="review-motion-viewport edge-fade-x relative mx-auto w-full overflow-hidden py-2"
        role="region"
        aria-label={clinicText("Automatically scrolling featured clinics", "自动滚动的精选医院")}
        onMouseEnter={() => setClinicMotionPaused(true)}
        onMouseLeave={() => setClinicMotionPaused(false)}
        onFocusCapture={() => setClinicMotionPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setClinicMotionPaused(false);
        }}
        onPointerDown={() => setClinicMotionPaused(true)}
        onPointerUp={() => setClinicMotionPaused(false)}
        onPointerCancel={() => setClinicMotionPaused(false)}
      >
        <div className={`review-motion-track clinic-motion-track flex w-max gap-4 sm:gap-5 ${clinicMotionPaused ? "is-paused" : ""}`}>
          <div className="flex gap-4 pl-4 sm:gap-5 sm:pl-6">
            {clinics.map((clinic) => clinicCard(clinic))}
          </div>
          <div className="flex gap-4 pl-4 sm:gap-5 sm:pl-6" aria-hidden="true">
            {clinics.map((clinic) => clinicCard(clinic, true))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center sm:hidden">
        <Link to="/clinics" className="inline-flex min-h-12 items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
          {clinicText("All clinics", "查看全部机构")} <ArrowRight className="size-4" />
        </Link>
      </div>
    </HomeSection>
  );
};


const SAMPLE_PRICES = [
  { en: "Double Eyelid Surgery", zh: "双眼皮手术", ru: "Двойное веко", es: "Doble párpado", from: 8000, usReference: "$3,000–$5,500", href: "/treatments/double-eyelid-surgery" },
  { en: "Rhinoplasty", zh: "鼻综合", ru: "Ринопластика", es: "Rinoplastia", from: 22800, usReference: "$7,500–$12,500", href: "/treatments/rhinoplasty" },
  { en: "Liposuction", zh: "吸脂塑形", ru: "Липосакция", es: "Liposucción", from: 20000, usReference: "$4,300–$7,500", href: "/treatments/liposuction" },
  { en: "Breast Augmentation", zh: "隆胸", ru: "Увеличение груди", es: "Aumento de senos", from: 45000, usReference: "$4,575–$8,000", href: "/treatments/breast-augmentation" },
  { en: "Facelift (SMAS)", zh: "面部拉皮", ru: "Подтяжка лица", es: "Lifting facial", from: 58000, usReference: "$12,000–$19,000", href: "/treatments/facelift" },
  { en: "FUE Hair Transplant", zh: "FUE 植发", ru: "Пересадка волос FUE", es: "Trasplante capilar FUE", from: 18000, usReference: "$6,000–$12,000", href: "/treatments/fue-hair-transplant" },
  { en: "Full-Mouth Reconstruction", zh: "全口重建", ru: "Полная реконструкция зубов", es: "Reconstrucción bucal completa", from: 80000, usReference: "$15,000–$80,000+", href: "/treatments/full-mouth-reconstruction" },
  { en: "Porcelain Veneers", zh: "牙贴片", ru: "Керамические виниры", es: "Carillas de porcelana", from: 3000, usReference: "$1,000–$2,000 / tooth", href: "/treatments/porcelain-veneers" },
];

export const PricingPreviewSection = () => {
  const { lang, fmt } = useAsia();
  const c = (en: string, zh: string, ru: string, es: string) => lang === "zh" ? zh : lang === "ru" ? ru : lang === "es" ? es : translatedUiText(lang, en);
  return (
    <HomeSection tone="sage" ariaLabelledBy="sample-pricing-title">
      <SectionHeader
        icon={Wallet}
        eyebrow={c("Sample pricing", "价格示范", "Примеры цен", "Precios de referencia")}
        titleId="sample-pricing-title"
        title={
          <>
            {c("Transparent starting prices", "透明公开的", "Прозрачные стартовые цены", "Precios iniciales transparentes")}{" "}
            <em className="not-italic text-brand">{c("in China", "中国起步价", "в Китае", "en China")}</em>
          </>
        }
        subtitle={c(
          "Reference starting prices for popular procedures. Your final quote is confirmed in writing after an expert consultation.",
          "热门项目的参考起步价。最终报价会在专家面诊后以书面形式确认。",
          "Ориентировочные стартовые цены на популярные процедуры. Итоговая стоимость подтверждается письменно после консультации эксперта.",
          "Precios iniciales de referencia para procedimientos populares. El presupuesto final se confirma por escrito tras una consulta con un experto.",
        )}
        action={<QuoteCtaButton variant="primary" className="min-h-11 shrink-0 whitespace-nowrap px-6" quoteCtx={{ source: "home_sample_pricing" }} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {SAMPLE_PRICES.map((item) => (
          <Link
            key={item.en}
            to={item.href}
            className="group flex min-h-[116px] items-center justify-between gap-4 rounded-3xl border border-border bg-card px-6 py-5 shadow-soft transition-[border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-primary/40"
          >
            <div className="min-w-0">
              <p className="truncate text-base font-semibold leading-snug text-foreground">{c(item.en, item.zh, item.ru, item.es)}</p>
              <p className="mt-1 text-[13px] leading-snug text-muted-foreground">
                {c("from", "起步价", "от", "desde")} <span className="font-display text-[22px] font-semibold tabular-nums text-brand">{fmt(item.from)}</span>
              </p>
              <p className="mt-1.5 text-[12px] leading-snug text-muted-foreground">
                <span className="font-medium text-foreground/60">{c("vs. U.S.", "对比美国", "в США", "vs. EE. UU.")}</span>{" "}
                <span className="font-semibold tabular-nums text-foreground/75">{item.usReference}</span>
                <sup className="ml-0.5">*</sup>
              </p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-primary transition-transform duration-150 group-hover:translate-x-1" />
          </Link>
        ))}
      </div>

      <p className="mt-5 text-[13px] leading-relaxed text-muted-foreground">
        {c(
          "Prices vary by expert, facility and treatment plan. *U.S. surgical comparisons are 2024 ASPS projected surgeon-fee ranges only; facility, anesthesia and other costs are additional. Hair and dental figures are broad U.S. planning references and may use different inclusions. Travel and accommodation are quoted separately.",
          "价格因专家、机构与治疗方案而异。*美国整形项目对比采用 ASPS 2024 年预计医生费区间，不含医院、麻醉及其他费用；植发与牙科为美国市场的大致规划参考，所含项目可能不同。差旅与住宿费用单独报价。",
          "Цены зависят от эксперта, клиники и плана лечения. *Сравнения по хирургии в США основаны только на прогнозируемых гонорарах хирургов ASPS за 2024 год; клиника, анестезия и другие расходы оплачиваются дополнительно. Данные по волосам и стоматологии являются общими ориентирами и могут включать разные услуги. Поездка и проживание рассчитываются отдельно.",
          "Los precios varían según el experto, la clínica y el plan de tratamiento. *Las comparaciones quirúrgicas de EE. UU. corresponden solo a los honorarios proyectados por ASPS para 2024; hospital, anestesia y otros costes son adicionales. Las cifras capilares y dentales son referencias generales y pueden incluir conceptos distintos. El viaje y el alojamiento se presupuestan por separado.",
        )}
      </p>
    </HomeSection>
  );
};

export const TreatmentsSection = () => {
  const { lang } = useAsia();
  const c = (en: string, zh: string, ru: string, es: string) => lang === "zh" ? zh : lang === "ru" ? ru : lang === "es" ? es : translatedUiText(lang, en);
  const procedureGoals = [
    {
      key: "nose",
      image: chineseDoctorTeam,
      en: "Refine your profile",
      zh: "改善面部侧颜",
      ru: "Гармоничный профиль",
      es: "Perfecciona tu perfil",
      descriptionEn: "Explore nose procedures with published expert information and practical planning support.",
      descriptionZh: "了解鼻部项目、公开专家信息与实际行程协调支持。",
      descriptionRu: "Изучите операции на носу, информацию об экспертах и поддержку в планировании.",
      descriptionEs: "Explora los procedimientos de nariz con información publicada de expertos y apoyo práctico de planificación.",
      treatments: [["Rhinoplasty", "鼻综合"], ["Revision Rhinoplasty", "鼻修复"], ["Nasal Tip Surgery", "鼻尖塑形"]],
      href: "/treatments/rhinoplasty",
    },
    {
      key: "eyes",
      image: procedureEyes,
      en: "Refresh your eyes",
      zh: "改善眼部状态",
      ru: "Освежить взгляд",
      es: "Renueva tu mirada",
      treatments: [["Double Eyelid", "双眼皮"], ["Blepharoplasty", "眼睑成形"], ["Ptosis Correction", "上睑下垂矫正"]],
      href: "/treatments/double-eyelid-surgery",
    },
    {
      key: "face",
      image: procedureFacelift,
      en: "Restore facial definition",
      zh: "重塑面部轮廓",
      ru: "Чёткие контуры лица",
      es: "Restaura la definición facial",
      treatments: [["Facelift", "面部拉皮"], ["Neck Lift", "颈部提升"], ["Fat Grafting", "脂肪填充"]],
      href: "/treatments/facelift",
    },
    {
      key: "body",
      image: procedureBody,
      en: "Shape body contours",
      zh: "改善身体线条",
      ru: "Контуры тела",
      es: "Define los contornos del cuerpo",
      treatments: [["Liposuction", "吸脂"], ["Tummy Tuck", "腹壁成形"], ["Body Lift", "身体提升"]],
      href: "/treatments/liposuction",
    },
    {
      key: "breast",
      image: procedureBreast,
      en: "Explore breast options",
      zh: "了解胸部项目",
      ru: "Операции на груди",
      es: "Explora opciones de senos",
      treatments: [["Augmentation", "隆胸"], ["Breast Lift", "乳房提升"], ["Revision", "假体修复"]],
      href: "/treatments/breast-augmentation",
    },
    {
      key: "hair",
      image: procedureHair,
      en: "Restore hair naturally",
      zh: "自然改善发量",
      ru: "Восстановление волос",
      es: "Restaura el cabello de forma natural",
      treatments: [["FUE Transplant", "FUE 植发"], ["Hairline", "发际线种植"], ["Crown", "头顶加密"]],
      href: "/treatments/fue-hair-transplant",
    },
    {
      key: "contour",
      image: procedureJaw,
      en: "Define facial contours",
      zh: "精塑面部轮廓",
      ru: "Скорректировать овал лица",
      es: "Define los contornos faciales",
      treatments: [["Jaw Contouring", "下颌角整形"], ["Chin Augmentation", "下巴塑形"], ["Genioplasty", "颏成形术"]],
      href: "/treatments/jaw-contouring",
    },
    {
      key: "dentistry",
      image: procedureDental,
      en: "Restore your smile",
      zh: "焕新自然笑容",
      ru: "Восстановить улыбку",
      es: "Restaura tu sonrisa",
      treatments: [["Dental Implants", "种植牙"], ["Porcelain Veneers", "瓷贴面"], ["Teeth Whitening", "牙齿美白"]],
      href: "/treatments/dental-implants",
    },
    {
      key: "skin",
      image: procedureSkin,
      en: "Renew your skin",
      zh: "改善肌肤质感",
      ru: "Обновить кожу",
      es: "Renueva tu piel",
      treatments: [["Laser Resurfacing", "激光焕肤"], ["RF Microneedling", "射频微针"], ["Skin Tightening", "皮肤紧致"]],
      href: "/treatments/laser-skin-resurfacing",
    },
    {
      key: "lips",
      image: procedureLips,
      en: "Refine lips & smile",
      zh: "精致唇形与笑容",
      ru: "Подчеркнуть губы и улыбку",
      es: "Perfecciona labios y sonrisa",
      treatments: [["Lip Lift", "唇部提升"], ["Lip Contouring", "唇形塑造"], ["Gummy Smile", "露龈笑改善"]],
      href: "/treatments/lip-lift",
    },
    {
      key: "transformation",
      image: procedureWeightLoss,
      en: "Complete your transformation",
      zh: "完善整体身形",
      ru: "Завершить преображение",
      es: "Completa tu transformación",
      treatments: [["Body Lift", "身体提升"], ["Arm Lift", "手臂提升"], ["Thigh Lift", "大腿提升"]],
      href: "/treatments/body-lift",
    },
    {
      key: "men",
      image: procedureMen,
      en: "Care designed for men",
      zh: "男士专属改善方案",
      ru: "Процедуры для мужчин",
      es: "Cuidado diseñado para hombres",
      treatments: [["Male Breast Reduction", "男性乳房缩小"], ["Male Liposuction", "男士吸脂"], ["Hair Transplant", "植发"]],
      href: "/treatments/male-breast-reduction",
    },
  ];
  const whyReasons = [
    {
      key: "experts",
      image: procedureRhinoplasty,
      eyebrow: c("300+ specialists across China", "覆盖中国的 300+ 位专家", "Более 300 специалистов по всему Китаю", "Más de 300 especialistas en China"),
      title: c("We find your expert.", "我们帮你找对专家。", "Мы найдём вашего специалиста.", "Encontramos a tu especialista."),
      detail: c(
        "Tell us your goal. We shortlist the specialists who fit and make the introduction.",
        "说出你的目标，我们筛出合适的专家，并安排面诊。",
        "Опишите свою цель. Мы подберём подходящих специалистов и организуем знакомство.",
        "Cuéntanos tu objetivo. Seleccionamos a los especialistas que encajan y hacemos la presentación.",
      ),
    },
    {
      key: "network",
      image: "/generated/clinic-network-asia-v2.webp",
      eyebrow: c("From online consultation to admission", "从线上问诊到入院", "От онлайн-консультации до госпитализации", "De la consulta en línea al ingreso"),
      title: c("Every step, already coordinated", "每一步，都有人提前协调", "Каждый шаг уже скоординирован", "Cada paso, ya coordinado"),
      detail: c(
        "Online consultation, airport pickup, hospital admission and in-clinic interpretation, with a clear next step throughout.",
        "线上问诊、接送机、入院和院内翻译，全程清楚下一步该做什么。",
        "Онлайн-консультация, трансфер из аэропорта, госпитализация и перевод в клинике — с понятным следующим шагом на всём пути.",
        "Consulta en línea, recogida en el aeropuerto, ingreso e interpretación en la clínica, siempre con un siguiente paso claro.",
      ),
    },
    {
      key: "service",
      image: journeyGroundSupport,
      eyebrow: c("One team through follow-up", "一支团队跟进到底", "Одна команда до завершения наблюдения", "Un equipo hasta el seguimiento"),
      title: c("Never guess what comes next", "每一步，都不必再猜", "Всегда знайте, что будет дальше", "Nunca tendrás que adivinar qué sigue"),
      detail: c(
        "A dedicated team supports your journey in China and keeps follow-up communication moving after your appointment.",
        "专属团队支持你的赴华行程，并在就诊后继续协调后续沟通。",
        "Выделенная команда сопровождает вашу поездку в Китай и помогает поддерживать связь после приёма.",
        "Un equipo dedicado te acompaña durante tu viaje a China y mantiene la comunicación de seguimiento tras la cita.",
      ),
    },
  ];
  return (
    <HomeSection id="projects" tone="white" ariaLabelledBy="why-celadonchina-title">
      <SectionHeader
        icon={ShieldCheck}
        eyebrow={c("Why choose us", "为什么选择我们", "Почему выбирают нас", "Por qué elegirnos")}
        titleId="why-celadonchina-title"
        title={<>{c("Make your aesthetic journey in China", "让赴华变美", "Сделайте эстетическое путешествие в Китай", "Haz que tu viaje estético a China sea")} <em className="not-italic text-brand">{c("simpler than you imagined.", "比想象中更简单。", "проще, чем вы думали.", "más sencillo de lo que imaginabas.")}</em></>}
        subtitle={c(
          "From online consultation and airport pickup to hospital admission, interpretation and follow-up, every step is coordinated. Access a China-wide network of 300+ specialists and meet the one who fits you.",
          "从线上问诊、接送机，到入院、翻译和后续跟进，每一步都有人协调，不必再靠猜。连接覆盖中国的 300+ 医美专家网络，帮你找到最适合你的那一位。",
          "От онлайн-консультации и встречи в аэропорту до госпитализации, перевода и последующего наблюдения — каждый шаг скоординирован. Получите доступ к сети из более чем 300 специалистов по всему Китаю и найдите своего специалиста.",
          "Desde la consulta en línea y la recogida en el aeropuerto hasta el ingreso, la interpretación y el seguimiento, cada paso está coordinado. Accede a una red de más de 300 especialistas en China y conoce al que mejor encaja contigo.",
        )}
      />

      <div className="grid gap-4 md:grid-cols-3 md:gap-6" aria-label={c("Three reasons to choose Sino Aesthetics", "选择 Sino Aesthetics 的三个理由", "Три причины выбрать Sino Aesthetics", "Tres razones para elegir Sino Aesthetics")}>
        {whyReasons.map((reason, index) => (
          <article key={reason.key} className="home-proof-card group relative min-h-[340px] overflow-hidden rounded-3xl bg-foreground shadow-soft md:min-h-[420px]">
            <img src={reason.image} {...responsiveImageProps(reason.image)} alt="" loading="lazy" decoding="async" className="absolute inset-0 z-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]" />
            <div className="absolute inset-0 z-[1] bg-gradient-to-t from-foreground/95 via-foreground/45 to-transparent" />
            <div className="relative z-10 flex min-h-[340px] flex-col justify-between p-6 text-background sm:p-7 md:min-h-[420px]">
              <span className="inline-flex size-10 items-center justify-center rounded-full border border-background/30 bg-foreground/20 text-sm font-semibold backdrop-blur">0{index + 1}</span>
              <div>
                <p className="mb-2 text-label font-semibold uppercase tracking-[0.16em] text-background/65">{reason.eyebrow}</p>
                <h3 className="max-w-sm font-display text-2xl font-medium leading-[1.08] sm:text-[1.65rem]">{reason.title}</h3>
                {/* Three reserved lines so the eyebrow and title sit at the same height in all three cards. */}
                <p className="mt-3 min-h-[4.5rem] max-w-md text-sm leading-relaxed text-background/78">{reason.detail}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </HomeSection>
  );
};

// ClinicsSection removed — patients only browse experts.

const getDoctorMarketingLine = (doctor: DoctorFlipCardData, lang: AsiaLang) => {
  const name = doctor.name.toLowerCase();
  const homepageQuotes = [
    {
      matches: ["zhang wenkai", "张文凯"],
      en: "I listen first. The treatment plan follows.",
      zh: "我会先倾听，再制定治疗方案。",
    },
    {
      matches: ["huang xingguo", "黄兴国"],
      en: "Natural results begin with understanding what suits you.",
      zh: "自然的效果，始于了解什么真正适合你。",
    },
    {
      matches: ["huang liewen", "黄列文"],
      en: "A good plan should feel clear before treatment begins.",
      zh: "好的治疗方案，应当在治疗开始前就让你清楚明白。",
    },
    {
      matches: ["ning jin", "靳宁"],
      en: "My goal is to refine, not redefine, what makes you unique.",
      zh: "我的目标是精细改善，而不是改变你的独特之处。",
    },
    {
      matches: ["li lin", "李林"],
      en: "We will discuss what is possible, what is appropriate, and what is not.",
      zh: "我们会坦诚讨论什么可以做、什么适合你，以及什么不应该做。",
    },
    {
      matches: ["xun wang", "王洵"],
      en: "Every detail matters, but your safety always comes first.",
      zh: "每个细节都很重要，但你的安全永远优先。",
    },
  ];
  const homepageQuote = homepageQuotes.find(({ matches }) => matches.some((candidate) => name.includes(candidate)));
  if (homepageQuote) return lang === "zh" ? homepageQuote.zh : translatedUiText(lang, homepageQuote.en);

  const key = name.includes("ning jin") || name.includes("靳宁")
    ? "ning"
    : name.includes("li lin") || name.includes("李林")
      ? "lin"
      : name.includes("xun wang") || name.includes("王洵")
        ? "wang"
        : "fallback";
  const specialty = doctor.specialties[0] || doctor.title;

  const copy = {
    en: {
      ning: "Focused on complex and revision rhinoplasty; documented patient cases are coming soon.",
      lin: "Follow rhinoplasty recovery through patient cases documented at two and three months.",
      wang: "Explore double-eyelid recovery at one and two months, including a patient video diary.",
      fallback: `Personalized guidance for patients exploring ${specialty.toLowerCase()}.`,
    },
    zh: {
      ning: "聚焦复杂鼻整形与鼻修复，相关患者案例正在整理上线。",
      lin: "通过术后两至三个月的患者记录，了解鼻整形恢复过程。",
      wang: "通过术后一个月、两个月对比及患者视频，了解双眼皮恢复过程。",
      fallback: `为关注${specialty}的患者提供个性化方案参考。`,
    },
    ja: {
      ning: "複雑な鼻整形と修正手術を中心に、症例記録は近日公開予定です。",
      lin: "術後2〜3か月に記録された症例から、鼻整形の回復経過をご覧いただけます。",
      wang: "術後1〜2か月の比較と患者動画から、二重整形の回復経過をご覧いただけます。",
      fallback: `${specialty}を検討する方へ、一人ひとりに合わせた選択肢をご案内します。`,
    },
    ko: {
      ning: "복잡한 코 성형과 재수술에 집중하며, 환자 사례는 곧 공개될 예정입니다.",
      lin: "수술 후 2~3개월에 기록된 환자 사례로 코 성형 회복 과정을 확인하세요.",
      wang: "수술 후 1~2개월 비교와 환자 영상으로 쌍꺼풀 회복 과정을 확인하세요.",
      fallback: `${specialty}을(를) 고려하는 환자를 위한 개인 맞춤형 안내.`,
    },
    ru: {
      ning: "Специализация на сложной и повторной ринопластике; истории пациентов скоро появятся.",
      lin: "Проследите восстановление после ринопластики по случаям, снятым через два и три месяца.",
      wang: "Посмотрите восстановление после пластики век через один и два месяца, включая видеодневник.",
      fallback: `Индивидуальная навигация для пациентов, рассматривающих ${specialty.toLowerCase()}.`,
    },
    es: {
      ning: "Especializado en rinoplastia compleja y de revisión; próximamente publicaremos casos documentados.",
      lin: "Sigue la recuperación de rinoplastia mediante casos documentados a los dos y tres meses.",
      wang: "Explora la recuperación de doble párpado al mes y a los dos meses, incluido un videodiario.",
      fallback: `Orientación personalizada para pacientes que consideran ${specialty.toLowerCase()}.`,
    },
  } as const;

  const languageCopy = copy[lang as keyof typeof copy] || copy.en;
  return languageCopy[key];
};

export const DoctorsSection = () => {
  const { t, lang } = useAsia();
  const { doctors: publishedDoctors, status, refresh } = usePublishedDoctors(lang);
  const viewProfileLabel = lang === "zh" ? "查看专家资料" : lang === "ru" ? "Профиль эксперта" : lang === "es" ? "Ver perfil del experto" : translatedUiText(lang, "View expert profile");
  const allExpertsLabel = lang === "zh" ? "全部专家" : lang === "ru" ? "Все специалисты" : lang === "es" ? "Todos los especialistas" : translatedUiText(lang, "All experts");
  // "Expert" rather than "doctor": the platform coordinates, it does not give medical advice (see copy-compliance.test.ts).
  const detailsLabel = lang === "zh" ? "查看专家介绍" : lang === "ru" ? "Об эксперте" : lang === "es" ? "Conoce al experto" : translatedUiText(lang, "Meet this expert");
  const backLabel = lang === "zh" ? "返回卡片" : lang === "ru" ? "Назад" : lang === "es" ? "Volver" : translatedUiText(lang, "Back to card");
  const profileLabel = lang === "zh" ? "专家简介" : lang === "ru" ? "Профиль эксперта" : lang === "es" ? "Perfil del experto" : translatedUiText(lang, "Expert profile");
  const bioFallback = lang === "zh"
    ? "完整介绍请见专家详情页。"
    : lang === "ru"
      ? "Подробности опубликованы в полном профиле эксперта."
      : lang === "es"
        ? "Los detalles publicados están disponibles en el perfil completo del experto."
        : translatedUiText(lang, "Published profile details are available from this expert's full profile.");
  // Loop the same six published profiles in one row; the full directory stays on /doctors.
  const homepageDoctors = selectHomepageDoctors(publishedDoctors);
  return (
    <HomeSection id="compliance" tone="white" ariaLabelledBy="home-doctors-title" className="py-12 md:py-16">
      <SectionHeader
        icon={Stethoscope}
        eyebrow={t("doctors.kicker")}
        titleId="home-doctors-title"
        title={<>{t("doctors.title1")} <em className="not-italic text-brand">{t("doctors.titleEm")}</em></>}
        action={<SectionActionLink to="/doctors" className="hidden sm:inline-flex">{allExpertsLabel}</SectionActionLink>}
      />
      {status === "loading" && (
        <div className="flex gap-4 overflow-hidden" role="status" aria-busy="true">
          <span className="sr-only">{lang === "zh" ? "正在加载专家资料…" : translatedUiText(lang, "Loading expert profiles…")}</span>
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} aria-hidden="true" className="min-h-[410px] w-[min(17.5rem,84vw)] shrink-0 overflow-hidden rounded-3xl border border-border bg-card">
              <div className="h-[160px] bg-primary/5" />
              <div className="space-y-3 p-4"><div className="h-6 w-2/3 rounded bg-primary/10" /><div className="h-3 w-1/2 rounded bg-primary/10" /><div className="h-3 w-1/3 rounded bg-primary/5" /></div>
            </div>
          ))}
        </div>
      )}
      {status === "error" && (
        <div role="status" className="rounded-3xl border border-border bg-card p-6 text-muted-foreground">
          <p>{lang === "zh" ? "专家资料暂时无法加载。" : translatedUiText(lang, "Expert profiles could not be loaded.")}</p>
          <Button variant="outline" className="mt-3" onClick={refresh}>{lang === "zh" ? "重试" : translatedUiText(lang, "Try again")}</Button>
        </div>
      )}
      <DoctorMarquee
        doctors={homepageDoctors}
        lang={lang}
        renderDoctor={(d, duplicate) => (
          <DoctorFlipCard
            doctor={d}
            duplicate={duplicate}
            marketingLine={getDoctorMarketingLine(d, lang)}
            viewProfileLabel={viewProfileLabel}
            detailsLabel={detailsLabel}
            backLabel={backLabel}
            profileLabel={profileLabel}
            bioFallback={bioFallback}
          />
        )}
      />
      <div className="mt-4 flex justify-center sm:hidden">
        <Link to="/doctors" className="inline-flex min-h-12 items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
          {allExpertsLabel} <ArrowRight className="size-4" />
        </Link>
      </div>
    </HomeSection>
  );
};


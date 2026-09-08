import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowRight, BookOpen, CheckCircle2, Clock3, Eye, FileText, HeartPulse, MessageCircle, PlayCircle, ScanFace, Scissors, Search, ShieldAlert, Smile, Sparkles, UserRound, WalletCards, WandSparkles } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { useQuote } from "@/components/QuoteRequest";
import TikTokWall from "@/components/TikTokWall";
import { Button } from "@/components/ui/button";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";
import { PROCEDURE_CATEGORIES, procedureSlug } from "@/data/procedureCatalog";

const PROCEDURE_IMAGES = import.meta.glob("../assets/procedures/*.jpg", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const procedureImage = (categoryIndex: number, itemIndex: number) => {
  const procedureName = PROCEDURE_CATEGORIES[categoryIndex]?.items[itemIndex]?.[0];
  if (!procedureName) return "";
  return PROCEDURE_IMAGES[`../assets/procedures/${procedureSlug(procedureName)}.jpg`] ?? "";
};

const CATEGORY_DESCRIPTIONS = [
  ["Procedures that alter nasal structure, proportion or breathing function.", "改善鼻部结构、比例或呼吸功能的相关术式。"],
  ["Eyelid and periocular procedures addressing crease, skin, fat and muscle position.", "围绕眼睑褶皱、皮肤、脂肪及肌肉位置的眼周术式。"],
  ["Skeletal and soft-tissue approaches to facial balance and profile.", "通过骨骼与软组织调整改善面部比例和侧貌。"],
  ["Surgical approaches to age-related changes of the face and neck.", "针对面颈部年龄相关变化的外科改善方式。"],
  ["Procedures involving breast volume, position, shape and implants.", "涉及乳房容量、位置、形态及假体管理的术式。"],
  ["Procedures that reshape body contours by removing, tightening or transferring tissue.", "通过去除、收紧或移植组织改善身体轮廓。"],
  ["Surgical transplantation methods for scalp, eyebrow and facial hair.", "用于头皮、眉毛及面部毛发恢复的移植方法。"],
  ["Restorative and aesthetic procedures for teeth, alignment and smile design.", "围绕牙齿修复、排列与微笑设计的美学口腔项目。"],
  ["Device-based, injectable and skin-focused treatments that do not require major surgery.", "无需大型手术的仪器、注射及皮肤治疗项目。"],
] as const;

const ES_CATEGORY_DESCRIPTIONS = [
  "Procedimientos que modifican la estructura nasal, la proporción o la función respiratoria.",
  "Procedimientos del párpado y la zona periocular relacionados con el pliegue, la piel, la grasa y la posición muscular.",
  "Métodos óseos y de tejidos blandos para equilibrar el rostro y el perfil.",
  "Métodos quirúrgicos para los cambios relacionados con la edad en el rostro y el cuello.",
  "Procedimientos relacionados con el volumen, la posición, la forma y los implantes mamarios.",
  "Procedimientos que remodelan el contorno corporal al eliminar, tensar o transferir tejido.",
  "Métodos quirúrgicos de trasplante para el cuero cabelludo, las cejas y el vello facial.",
  "Procedimientos restauradores y estéticos para los dientes, la alineación y el diseño de la sonrisa.",
  "Tratamientos con dispositivos, inyectables y enfocados en la piel que no requieren cirugía mayor.",
] as const;

const CATEGORY_STYLES = [
  { panel: "bg-primary/[0.055]", marker: "bg-primary/15 text-primary", title: "text-foreground", link: "hover:bg-primary/10 hover:text-foreground", dot: "bg-primary" },
  { panel: "bg-accent/25", marker: "bg-accent text-accent-foreground", title: "text-foreground", link: "hover:bg-accent/55 hover:text-foreground", dot: "bg-accent-foreground/55" },
  { panel: "bg-secondary/35", marker: "bg-secondary text-secondary-foreground", title: "text-foreground", link: "hover:bg-secondary/75 hover:text-foreground", dot: "bg-secondary-foreground/45" },
  { panel: "bg-primary/[0.045]", marker: "bg-primary/15 text-primary", title: "text-foreground", link: "hover:bg-primary/10 hover:text-foreground", dot: "bg-primary" },
  { panel: "bg-accent/25", marker: "bg-accent text-accent-foreground", title: "text-foreground", link: "hover:bg-accent/55 hover:text-foreground", dot: "bg-accent-foreground/55" },
  { panel: "bg-secondary/35", marker: "bg-secondary text-secondary-foreground", title: "text-foreground", link: "hover:bg-secondary/75 hover:text-foreground", dot: "bg-secondary-foreground/45" },
  { panel: "bg-primary/[0.055]", marker: "bg-primary/15 text-primary", title: "text-foreground", link: "hover:bg-primary/10 hover:text-foreground", dot: "bg-primary" },
  { panel: "bg-accent/25", marker: "bg-accent text-accent-foreground", title: "text-foreground", link: "hover:bg-accent/55 hover:text-foreground", dot: "bg-accent-foreground/55" },
  { panel: "bg-secondary/35", marker: "bg-secondary text-secondary-foreground", title: "text-foreground", link: "hover:bg-secondary/75 hover:text-foreground", dot: "bg-secondary-foreground/45" },
] as const;

/**
 * Broad category ranges in CNY for licensed private aesthetic providers in
 * major Chinese cities. These are non-promotional planning references, not
 * hospital quotations; expert-led, revision and imported-material cases can
 * sit above the range.
 * Sources checked 2026-09-07:
 * - https://www.nhsa.gov.cn/art/2025/6/18/art_14_16876.html
 * - https://www.mjktrip.com/zh/services/plastic-surgery
 * - https://www.triphr.com/article/en7f9oou498s07qo3e478ebb.html
 * - https://www.signdo.com/hospital/4403/
 */
const CATEGORY_META = [
  { priceLowCny: 10_000, priceHighCny: 100_000, recovery: "1–2 weeks", recoveryZh: "1–2 周", type: "Surgical", typeZh: "手术类", icon: ScanFace },
  { priceLowCny: 3_000, priceHighCny: 30_000, recovery: "7–14 days", recoveryZh: "7–14 天", type: "Surgical", typeZh: "手术类", icon: Eye },
  { priceLowCny: 10_000, priceHighCny: 100_000, recovery: "2–4 weeks", recoveryZh: "2–4 周", type: "Surgical", typeZh: "手术类", icon: UserRound },
  { priceLowCny: 10_000, priceHighCny: 200_000, recovery: "2–4 weeks", recoveryZh: "2–4 周", type: "Surgical", typeZh: "手术类", icon: Sparkles },
  { priceLowCny: 25_000, priceHighCny: 150_000, recovery: "2–6 weeks", recoveryZh: "2–6 周", type: "Surgical", typeZh: "手术类", icon: HeartPulse },
  { priceLowCny: 12_000, priceHighCny: 120_000, recovery: "2–6 weeks", recoveryZh: "2–6 周", type: "Surgical", typeZh: "手术类", icon: Activity },
  { priceLowCny: 10_000, priceHighCny: 80_000, recovery: "7–14 days", recoveryZh: "7–14 天", type: "Surgical", typeZh: "手术类", icon: Scissors },
  { priceLowCny: 1_000, priceHighCny: 150_000, recovery: "Same day–2 weeks", recoveryZh: "当天–2 周", type: "Mixed care", typeZh: "综合治疗", icon: Smile },
  { priceLowCny: 500, priceHighCny: 30_000, recovery: "Hours–2 weeks", recoveryZh: "数小时–2 周", type: "Non-surgical", typeZh: "非手术类", icon: WandSparkles },
] as const;

const PROCEDURE_PRICE_CNY: Record<string, readonly [number, number]> = {
  Rhinoplasty: [18_000, 60_000],
  "Revision Rhinoplasty": [35_000, 100_000],
  Septorhinoplasty: [25_000, 70_000],
  "Alar Base Reduction": [6_000, 18_000],
  "Nasal Tip Surgery": [10_000, 30_000],
  "Double Eyelid Surgery": [4_000, 16_000],
  "Upper Blepharoplasty": [6_000, 20_000],
  "Lower Blepharoplasty": [8_000, 25_000],
  "Ptosis Correction": [12_000, 30_000],
  Epicanthoplasty: [3_000, 10_000],
  "Under-Eye Fat Repositioning": [9_000, 28_000],
  "Chin Augmentation": [10_000, 35_000],
  Genioplasty: [25_000, 60_000],
  "Jaw Contouring": [35_000, 90_000],
  "Zygoma Reduction": [40_000, 100_000],
  "Facial Fat Grafting": [15_000, 45_000],
  Otoplasty: [8_000, 30_000],
  Facelift: [50_000, 150_000],
  "Neck Lift": [36_000, 105_000],
  "Brow Lift": [18_000, 62_000],
  "Deep-Plane Facelift": [80_000, 200_000],
  "Mini Facelift": [25_000, 80_000],
  "Lip Lift": [12_000, 36_000],
  "Breast Augmentation": [35_000, 120_000],
  "Breast Lift": [40_000, 110_000],
  "Breast Reduction": [45_000, 115_000],
  "Implant Revision": [55_000, 160_000],
  "Implant Removal": [20_000, 65_000],
  "Male Breast Reduction": [18_000, 50_000],
  Liposuction: [18_000, 80_000],
  "Tummy Tuck": [45_000, 120_000],
  "Arm Lift": [30_000, 70_000],
  "Thigh Lift": [35_000, 85_000],
  "Body Lift": [70_000, 180_000],
  "Fat Transfer": [20_000, 70_000],
  "Mommy Makeover": [90_000, 220_000],
  "FUE Hair Transplant": [15_000, 60_000],
  "FUT Hair Transplant": [12_000, 45_000],
  "Hairline Restoration": [10_000, 40_000],
  "Crown Restoration": [18_000, 65_000],
  "Eyebrow Transplant": [8_000, 26_000],
  "Beard Transplant": [12_000, 35_000],
  "Dental Implants": [6_000, 22_000],
  "Porcelain Veneers": [3_000, 80_000],
  "All-Ceramic Crowns": [2_500, 12_000],
  "Teeth Whitening": [1_000, 6_000],
  "Clear Aligners": [18_000, 55_000],
  "Full-Mouth Reconstruction": [80_000, 150_000],
  "Laser Skin Resurfacing": [1_500, 15_000],
  "Pigmentation Treatment": [1_000, 12_000],
  "Acne Scar Treatment": [1_500, 18_000],
  "RF Microneedling": [3_000, 20_000],
  "Ultrasound Skin Tightening": [6_000, 30_000],
  "Botulinum Toxin": [800, 8_000],
  "Dermal Fillers": [2_000, 25_000],
  "Regenerative Skin Treatments": [3_000, 30_000],
};

const CONCERN_LINKS = [
  ["Improve my nose", "改善鼻型", 0],
  ["Look less tired", "改善疲惫感", 1],
  ["Define my profile", "改善面部轮廓", 2],
  ["Look more refreshed", "面部年轻化", 3],
  ["Restore hair", "改善脱发", 6],
  ["Improve my smile", "改善笑容", 7],
  ["Improve skin texture", "改善肤质", 8],
] as const;

const RU_LABELS: Record<string, string> = {
  Nose: "Нос",
  Eyes: "Глаза",
  "Face & Contour": "Лицо и контуры",
  "Facial Rejuvenation": "Омоложение лица",
  Breast: "Грудь",
  "Body Contouring": "Контурирование тела",
  "Hair Restoration": "Восстановление волос",
  "Cosmetic Dentistry": "Эстетическая стоматология",
  "Skin & Non-Surgical": "Кожа и безоперационные процедуры",
  Rhinoplasty: "Ринопластика",
  "Revision Rhinoplasty": "Повторная ринопластика",
  Septorhinoplasty: "Септоринопластика",
  "Alar Base Reduction": "Сужение крыльев носа",
  "Nasal Tip Surgery": "Пластика кончика носа",
  "Double Eyelid Surgery": "Операция двойного века",
  "Upper Blepharoplasty": "Верхняя блефаропластика",
  "Lower Blepharoplasty": "Нижняя блефаропластика",
  "Ptosis Correction": "Коррекция птоза",
  Epicanthoplasty: "Эпикантопластика",
  "Under-Eye Fat Repositioning": "Перераспределение жира под глазами",
  "Chin Augmentation": "Увеличение подбородка",
  Genioplasty: "Гениопластика",
  "Jaw Contouring": "Контурирование нижней челюсти",
  "Zygoma Reduction": "Уменьшение скул",
  "Facial Fat Grafting": "Липофилинг лица",
  Otoplasty: "Отопластика",
  Facelift: "Подтяжка лица",
  "Neck Lift": "Подтяжка шеи",
  "Brow Lift": "Подтяжка бровей",
  "Deep-Plane Facelift": "Глубокая подтяжка лица",
  "Mini Facelift": "Мини-подтяжка лица",
  "Lip Lift": "Подтяжка губы",
  "Breast Augmentation": "Увеличение груди",
  "Breast Lift": "Подтяжка груди",
  "Breast Reduction": "Уменьшение груди",
  "Implant Revision": "Замена грудных имплантов",
  "Implant Removal": "Удаление грудных имплантов",
  "Male Breast Reduction": "Уменьшение груди у мужчин",
  Liposuction: "Липосакция",
  "Tummy Tuck": "Абдоминопластика",
  "Arm Lift": "Подтяжка рук",
  "Thigh Lift": "Подтяжка бёдер",
  "Body Lift": "Подтяжка тела",
  "Fat Transfer": "Липофилинг",
  "Mommy Makeover": "Послеродовое восстановление фигуры",
  "FUE Hair Transplant": "Пересадка волос FUE",
  "FUT Hair Transplant": "Пересадка волос FUT",
  "Hairline Restoration": "Восстановление линии роста волос",
  "Crown Restoration": "Восстановление волос на макушке",
  "Eyebrow Transplant": "Пересадка бровей",
  "Beard Transplant": "Пересадка бороды",
  "Dental Implants": "Зубные импланты",
  "Porcelain Veneers": "Керамические виниры",
  "All-Ceramic Crowns": "Безметалловые коронки",
  "Teeth Whitening": "Отбеливание зубов",
  "Clear Aligners": "Прозрачные элайнеры",
  "Full-Mouth Reconstruction": "Полная реконструкция зубов",
  "Laser Skin Resurfacing": "Лазерная шлифовка кожи",
  "Pigmentation Treatment": "Лечение пигментации",
  "Acne Scar Treatment": "Лечение постакне",
  "RF Microneedling": "RF-микроигольчатая терапия",
  "Ultrasound Skin Tightening": "Ультразвуковой лифтинг",
  "Botulinum Toxin": "Ботулинотерапия",
  "Dermal Fillers": "Дермальные филлеры",
  "Regenerative Skin Treatments": "Регенеративные процедуры для кожи",
  "Improve my nose": "Изменить форму носа",
  "Look less tired": "Выглядеть менее уставшим",
  "Define my profile": "Улучшить профиль лица",
  "Look more refreshed": "Выглядеть моложе и свежее",
  "Restore hair": "Восстановить волосы",
  "Improve my smile": "Улучшить улыбку",
  "Improve skin texture": "Улучшить текстуру кожи",
};

const ES_LABELS: Record<string, string> = {
  Nose: "Nariz",
  Eyes: "Ojos",
  "Face & Contour": "Rostro y contorno",
  "Facial Rejuvenation": "Rejuvenecimiento facial",
  Breast: "Mama",
  "Body Contouring": "Contorno corporal",
  "Hair Restoration": "Restauración capilar",
  "Cosmetic Dentistry": "Odontología estética",
  "Skin & Non-Surgical": "Piel y no quirúrgico",
  Rhinoplasty: "Rinoplastia",
  "Revision Rhinoplasty": "Rinoplastia de revisión",
  Septorhinoplasty: "Septorrinoplastia",
  "Alar Base Reduction": "Reducción de la base alar",
  "Nasal Tip Surgery": "Cirugía de la punta nasal",
  "Double Eyelid Surgery": "Cirugía de párpado doble",
  "Upper Blepharoplasty": "Blefaroplastia superior",
  "Lower Blepharoplasty": "Blefaroplastia inferior",
  "Ptosis Correction": "Corrección de ptosis",
  Epicanthoplasty: "Epicantoplastia",
  "Under-Eye Fat Repositioning": "Reposición de grasa bajo los ojos",
  "Chin Augmentation": "Aumento de mentón",
  Genioplasty: "Genioplastia",
  "Jaw Contouring": "Contorno mandibular",
  "Zygoma Reduction": "Reducción de pómulos",
  "Facial Fat Grafting": "Injerto de grasa facial",
  Otoplasty: "Otoplastia",
  Facelift: "Ritidectomía facial",
  "Neck Lift": "Lifting de cuello",
  "Brow Lift": "Lifting de cejas",
  "Deep-Plane Facelift": "Lifting facial de plano profundo",
  "Mini Facelift": "Mini lifting facial",
  "Lip Lift": "Lifting de labios",
  "Breast Augmentation": "Aumento de mamas",
  "Breast Lift": "Lifting de mamas",
  "Breast Reduction": "Reducción de mamas",
  "Implant Revision": "Revisión de implantes mamarios",
  "Implant Removal": "Retiro de implantes mamarios",
  "Male Breast Reduction": "Reducción de mamas en hombres",
  Liposuction: "Liposucción",
  "Tummy Tuck": "Abdominoplastia",
  "Arm Lift": "Lifting de brazos",
  "Thigh Lift": "Lifting de muslos",
  "Body Lift": "Lifting corporal",
  "Fat Transfer": "Transferencia de grasa",
  "Mommy Makeover": "Renovación posparto",
  "FUE Hair Transplant": "Trasplante capilar FUE",
  "FUT Hair Transplant": "Trasplante capilar FUT",
  "Hairline Restoration": "Restauración de la línea de implantación",
  "Crown Restoration": "Restauración de la coronilla",
  "Eyebrow Transplant": "Trasplante de cejas",
  "Beard Transplant": "Trasplante de barba",
  "Dental Implants": "Implantes dentales",
  "Porcelain Veneers": "Carillas de porcelana",
  "All-Ceramic Crowns": "Coronas totalmente cerámicas",
  "Teeth Whitening": "Blanqueamiento dental",
  "Clear Aligners": "Alineadores transparentes",
  "Full-Mouth Reconstruction": "Reconstrucción bucal completa",
  "Laser Skin Resurfacing": "Resurfacing láser de la piel",
  "Pigmentation Treatment": "Tratamiento de la pigmentación",
  "Acne Scar Treatment": "Tratamiento de cicatrices de acné",
  "RF Microneedling": "Microagujas con radiofrecuencia",
  "Ultrasound Skin Tightening": "Tensado de piel por ultrasonido",
  "Botulinum Toxin": "Toxina botulínica",
  "Dermal Fillers": "Rellenos dérmicos",
  "Regenerative Skin Treatments": "Tratamientos regenerativos para la piel",
  "Improve my nose": "Mejorar mi nariz",
  "Look less tired": "Verme menos cansado",
  "Define my profile": "Definir mi perfil",
  "Look more refreshed": "Verme más rejuvenecido",
  "Restore hair": "Recuperar el cabello",
  "Improve my smile": "Mejorar mi sonrisa",
  "Improve skin texture": "Mejorar la textura de la piel",
};

const RU_CATEGORY_DESCRIPTIONS = [
  "Процедуры, изменяющие строение и пропорции носа или улучшающие дыхание.",
  "Процедуры век и области вокруг глаз: складка, кожа, жировая ткань и положение мышц.",
  "Костные и мягкотканные методы для гармонизации лица и профиля.",
  "Хирургические методы коррекции возрастных изменений лица и шеи.",
  "Процедуры для изменения объёма, положения и формы груди, а также работы с имплантами.",
  "Процедуры для коррекции контуров тела путём удаления, подтяжки или переноса тканей.",
  "Методы пересадки волос на голове, бровях и лице.",
  "Восстановительные и эстетические процедуры для зубов, прикуса и дизайна улыбки.",
  "Аппаратные, инъекционные и кожные процедуры без большой операции.",
] as const;

const Treatments = () => {
  const { lang, fmt, t } = useAsia();
  const { open } = useQuote();
  const zh = lang === "zh";
  const ru = lang === "ru";
  const es = lang === "es";
  const copy = (en: string, cn: string, russian: string, spanish?: string) => zh ? cn : ru ? russian : es ? (spanish ?? en) : en;
  const label = (en: string, cn: string, spanish?: string) => zh ? cn : ru ? (RU_LABELS[en] ?? en) : es ? (ES_LABELS[en] ?? spanish ?? en) : en;
  const [activeCategory, setActiveCategory] = useState(0);
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const formatCategoryPrice = (index: number) => {
    const category = CATEGORY_META[index];
    return `${fmt(category.priceLowCny)}–${fmt(category.priceHighCny)}`;
  };
  const formatProcedurePrice = (procedure: string) => {
    const [low, high] = PROCEDURE_PRICE_CNY[procedure];
    return `${fmt(low)}–${fmt(high)}`;
  };
  const visibleCategories = useMemo(() => {
    if (!normalizedQuery) return [{ category: PROCEDURE_CATEGORIES[activeCategory], index: activeCategory }];
    return PROCEDURE_CATEGORIES.map((category, index) => ({
      category: { ...category, items: category.items.filter(([en, cn]) => `${en} ${cn} ${RU_LABELS[en] ?? ""} ${ES_LABELS[en] ?? ""} ${category.en} ${category.zh} ${RU_LABELS[category.en] ?? ""} ${ES_LABELS[category.en] ?? ""}`.toLowerCase().includes(normalizedQuery)) },
      index,
    })).filter(({ category }) => category.items.length > 0);
  }, [activeCategory, normalizedQuery]);

  return (
    <>
      <PageMeta
        title={copy("Cosmetic Procedures in China | Surgery Types & Guides", "中国医美项目与科普指南", "Косметические процедуры в Китае | Справочник")}
        description={copy("Explore cosmetic procedures in China, including plastic surgery, hair restoration, cosmetic dentistry, skin and non-surgical treatments, with detailed recovery and risk guides.", "了解中国整形、植发、牙齿美容、皮肤及非手术项目的恢复与风险指南。", "Изучите пластическую хирургию, пересадку волос, эстетическую стоматологию и безоперационные процедуры в Китае.")}
        path="/treatments"
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />

        <section className="container py-9 md:py-16">
          <div className="mx-auto mb-7 max-w-2xl text-center md:mb-10">
            <span className="pill bg-accent text-accent-foreground mb-3">
              <BookOpen className="size-3.5" /> {copy("Procedure guides", "项目科普", "Справочник процедур")}
            </span>
            <h1 className="font-display text-[2.15rem] font-medium leading-[1.04] tracking-tight sm:text-4xl md:text-5xl">
              {copy("Understand it first,", "先了解清楚", "Сначала разберитесь,")}{" "}
              <em className="text-primary not-italic">{copy("then decide.", "再做决定", "затем решайте.")}</em>
            </h1>
          </div>

          <div className="mx-auto mb-7 max-w-4xl">
            <label className="relative block">
              <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-primary" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy("Search a procedure, concern or body area", "搜索项目、部位或关注的问题", "Поиск процедуры, зоны или проблемы")}
                className="h-14 w-full rounded-full border border-border/80 bg-card pl-14 pr-5 text-base shadow-soft outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10 md:h-16"
              />
            </label>
            <div className="mt-4 flex snap-x gap-2 overflow-x-auto pb-2 scrollbar-hide" aria-label={copy("Browse by concern", "按需求查找", "Поиск по цели")}>
              {CONCERN_LINKS.map(([en, cn, index]) => (
                <button key={en} type="button" onClick={() => { setQuery(""); setActiveCategory(index); }} className="min-h-10 shrink-0 snap-start rounded-full border border-border/70 bg-card px-4 text-sm font-semibold transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary">
                  {label(en, cn)}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-border/80 bg-card shadow-soft">
            <div className="border-b border-border/80 bg-muted/35 px-5 py-4 md:px-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="size-4 text-primary" />
                  {asiaCopy(lang, {
                    en: "CeladonChina procedure guides",
                    zh: "CeladonChina 项目指南",
                    ru: "Руководства по процедурам CeladonChina",
                    es: "Guías de procedimientos de CeladonChina",
                    th: "คู่มือหัตถการของ CeladonChina",
                    ms: "Panduan prosedur CeladonChina",
                  })}
                </div>
                <span className="text-xs text-muted-foreground">
                  {copy("9 clinical categories · 56 procedures", "9 个医学分类 · 56 项术式", "9 медицинских категорий · 56 процедур")}
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-[16rem_minmax(0,1fr)]">
              <aside className="border-b border-border/80 bg-muted/20 p-4 lg:border-b-0 lg:border-r lg:p-5">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  {copy("Browse by area", "按部位浏览", "Поиск по зоне")}
                </p>
                <nav className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2 scrollbar-hide lg:sticky lg:top-24 lg:mx-0 lg:grid lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0" aria-label={copy("Procedure categories", "项目分类", "Категории процедур")}>
                  {PROCEDURE_CATEGORIES.map((category, index) => (
                    <button key={category.en} type="button" onClick={() => { setQuery(""); setActiveCategory(index); }} className={`group flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold transition lg:w-full ${activeCategory === index && !normalizedQuery ? "bg-primary text-primary-foreground shadow-soft" : "bg-card/70 text-muted-foreground hover:bg-card hover:text-foreground"}`}>
                      <span className={`grid size-7 shrink-0 place-items-center rounded-lg ${activeCategory === index && !normalizedQuery ? "bg-white/15" : CATEGORY_STYLES[index].marker}`}>
                        {(() => { const Icon = CATEGORY_META[index].icon; return <Icon className="size-3.5" />; })()}
                      </span>
                      <span>{label(category.en, category.zh)}</span>
                    </button>
                  ))}
                </nav>
              </aside>

              <div className="min-h-[34rem] px-4 py-5 sm:px-5 sm:py-6 md:px-8 md:py-8">
                {visibleCategories.length === 0 && (
                  <div className="grid min-h-[24rem] place-items-center text-center">
                    <div><Search className="mx-auto size-7 text-primary" /><h2 className="mt-3 font-display text-2xl">{copy("No procedures found", "没有找到相关项目", "Процедуры не найдены")}</h2><p className="mt-2 text-sm text-muted-foreground">{copy("Try another procedure name or body area.", "换一个项目名称或身体部位试试。", "Попробуйте другое название процедуры или зоны тела.")}</p></div>
                  </div>
                )}
                {visibleCategories.map(({ category, index: categoryIndex }) => (
                  <section
                    key={category.en}
                    className={visibleCategories.length > 1 ? "border-b border-border/70 py-7 first:pt-0 last:border-b-0 last:pb-0" : ""}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${CATEGORY_STYLES[categoryIndex].marker}`}>{(() => { const Icon = CATEGORY_META[categoryIndex].icon; return <Icon className="size-5" />; })()}</span>
                      <div><span className="font-mono text-[11px] font-bold text-primary">{String(categoryIndex + 1).padStart(2, "0")}</span><h2 className="font-display text-[1.7rem] font-medium leading-tight tracking-tight sm:text-3xl">{label(category.en, category.zh)}</h2><p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">{ru ? RU_CATEGORY_DESCRIPTIONS[categoryIndex] : es ? ES_CATEGORY_DESCRIPTIONS[categoryIndex] : CATEGORY_DESCRIPTIONS[categoryIndex][zh ? 1 : 0]}</p></div>
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {category.items.map(([en, cn], itemIndex) => (
                          <Link
                            to={`/treatments/${procedureSlug(en)}`}
                            key={en}
                            className="group grid min-h-[9.5rem] grid-cols-[6.5rem_minmax(0,1fr)] overflow-hidden rounded-2xl border border-border/70 bg-background/75 transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card hover:shadow-soft sm:grid-cols-[7.5rem_minmax(0,1fr)]"
                          >
                            <div className="relative min-h-full overflow-hidden bg-muted">
                              <img
                                src={procedureImage(categoryIndex, itemIndex)}
                                alt=""
                                loading="lazy"
                                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
                            </div>
                            <div className="min-w-0 p-4">
                              <div className="flex items-start justify-between gap-3"><h3 className="font-semibold text-foreground">{label(en, cn)}</h3><ArrowRight className="mt-0.5 size-4 shrink-0 text-primary transition group-hover:translate-x-1" /></div>
                              <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-medium text-muted-foreground"><span className="rounded-full bg-secondary px-2 py-1">{formatProcedurePrice(en)}</span><span className="rounded-full bg-primary/10 px-2 py-1 text-primary">{zh ? CATEGORY_META[categoryIndex].recoveryZh : CATEGORY_META[categoryIndex].recovery}</span><span className="rounded-full bg-accent/60 px-2 py-1">{zh ? CATEGORY_META[categoryIndex].typeZh : ru ? (CATEGORY_META[categoryIndex].type === "Surgical" ? "Хирургия" : CATEGORY_META[categoryIndex].type === "Non-surgical" ? "Без операции" : "Комплексное лечение") : CATEGORY_META[categoryIndex].type}</span></div>
                              <p className="mt-3 text-xs font-semibold text-primary">{copy("Read the full guide", "阅读完整指南", "Читать полное руководство")} <span aria-hidden="true">→</span></p>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>

          <section className="mx-auto mt-16 max-w-6xl rounded-[2rem] bg-gradient-to-r from-[hsl(155,55%,92%)] via-[hsl(150,48%,91%)] to-[hsl(48,78%,92%)] p-5 shadow-soft sm:p-8 md:mt-24 md:p-10">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <span className="pill bg-card/80"><Clock3 className="size-3.5 text-primary" /> {copy("Recovery at a glance", "恢复时间速览", "Восстановление: краткий обзор")}</span>
                <h2 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-4xl">{copy("Plan around the", "提前规划你的", "Планируйте с учётом")} <em className="not-italic text-primary">{copy("recovery window", "恢复期", "периода восстановления")}</em></h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy("Recovery ranges are for trip planning. Prices use public 2025–2026 reference information for Beijing Badachu; they are not hospital quotations. The actual plan, surgeon, materials and facility fees determine the final amount.", "恢复时间仅用于行程规划。价格根据北京八大处 2025–2026 年公开资料整理，不是医院报价；最终费用取决于面诊方案、专家、材料及院方收费。", "Сроки даны для планирования поездки. Цены основаны на открытых справочных данных Beijing Badachu за 2025–2026 годы и не являются ценовым предложением больницы.")}</p>
              </div>
              <Link to="/cases" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft">{copy("Watch recovery diaries", "观看真实恢复日记", "Смотреть дневники восстановления")}<ArrowRight className="size-4" /></Link>
            </div>
            <div className="mt-7 overflow-x-auto rounded-3xl border border-white/70 bg-card/80 shadow-soft">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b border-border/70 text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="p-4">{copy("Procedure group", "项目类别", "Категория")}</th><th className="p-4">{copy("General recovery range", "常见恢复范围", "Обычно восстановление")}</th><th className="p-4">{copy("Badachu reference range", "八大处公开资料参考", "Ориентир Badachu")}</th><th className="p-4">{copy("Type", "类型", "Тип")}</th></tr></thead>
                <tbody>{PROCEDURE_CATEGORIES.slice(0, 6).map((category, index) => <tr key={category.en} className="border-b border-border/60 last:border-0"><td className="p-4 font-semibold">{label(category.en, category.zh)}</td><td className="p-4 text-muted-foreground">{zh ? CATEGORY_META[index].recoveryZh : CATEGORY_META[index].recovery}</td><td className="p-4 font-semibold text-foreground">{formatCategoryPrice(index)}</td><td className="p-4"><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{zh ? CATEGORY_META[index].typeZh : ru ? "Хирургия" : CATEGORY_META[index].type}</span></td></tr>)}</tbody>
              </table>
            </div>
          </section>

          <section className="mx-auto mt-16 grid max-w-6xl gap-5 md:mt-24 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-border/70 bg-card p-6 shadow-soft sm:p-8">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary"><ShieldAlert className="size-5" /></span>
              <h2 className="mt-5 font-display text-3xl font-medium">{zh ? "治疗前需要主动沟通的情况" : "What to discuss before treatment"}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{zh ? "这些信息可能影响治疗选择、麻醉与恢复计划。请向执业专家完整说明。" : "These details may affect treatment, anesthesia and recovery planning. Discuss them fully with a licensed expert."}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {(zh ? ["正在服用的药物与补充剂", "既往手术或麻醉反应", "糖尿病或血压问题", "出血或凝血相关疾病", "吸烟及尼古丁使用", "妊娠、哺乳与过敏史"] : ["Current medications and supplements", "Previous surgery or anesthesia reactions", "Diabetes or blood-pressure conditions", "Bleeding or clotting disorders", "Smoking and nicotine use", "Pregnancy, breastfeeding and allergies"]).map((item) => <li key={item} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /><span>{item}</span></li>)}
              </ul>
            </article>

            <article className="rounded-[2rem] border border-border/70 bg-secondary/35 p-6 shadow-soft sm:p-8">
              <span className="grid size-11 place-items-center rounded-2xl bg-card text-primary"><WalletCards className="size-5" /></span>
              <h2 className="mt-5 font-display text-3xl font-medium">{zh ? "最终价格由什么决定？" : "What affects the final price?"}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{zh ? "网站价格只能用于初步规划；完整报价应清楚列出以下组成。" : "Website ranges are for early planning. A complete quote should clearly identify the following components."}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {(zh ? ["专家经验与手术复杂度", "医院与麻醉费用", "假体或医疗材料", "检查、药物与住院时间", "联合项目与修复手术", "术后复查与支持范围"] : ["Surgeon experience and complexity", "Hospital and anesthesia fees", "Implants or medical materials", "Tests, medication and hospital stay", "Combined or revision procedures", "Follow-up and aftercare scope"]).map((item) => <li key={item} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /><span>{item}</span></li>)}
              </ul>
            </article>
          </section>

          <section className="mx-auto mt-16 max-w-6xl md:mt-24">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div className="max-w-3xl">
                <span className="pill bg-accent text-accent-foreground"><PlayCircle className="size-3.5" /> {zh ? "患者恢复日记" : "Patient recovery diaries"}</span>
                <h2 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-4xl">{zh ? "不要只看精修后的对比照" : "Go beyond the polished after photo"}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{zh ? "通过短视频了解咨询、治疗与恢复过程，再决定下一步。只有完成核验的内容才会标记为已核验。" : "Explore consultation, treatment and recovery journeys before deciding what to do next. Only content that completes verification is labeled verified."}</p>
              </div>
              <Link to="/cases" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground">{zh ? "浏览全部日记" : "Explore all diaries"}<ArrowRight className="size-4" /></Link>
            </div>
            <div className="mt-7"><TikTokWall items={TIKTOK_CASES.slice(0, 7)} lang={lang} fmtPrice={fmt} variant="preview" /></div>
          </section>

        </section>

        <Footer />
      </div>
    </>
  );
};

export default Treatments;

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowRight, BookOpen, CheckCircle2, ClipboardCheck, Clock3, Eye, FileText, HeartPulse, MessageCircle, PlayCircle, ScanFace, Scissors, Search, ShieldAlert, Smile, Sparkles, UserRound, WalletCards, WandSparkles } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { useQuote } from "@/components/QuoteRequest";
import TikTokWall from "@/components/TikTokWall";
import { Button } from "@/components/ui/button";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { useAsia } from "@/lib/asia-i18n";
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

const CATEGORY_META = [
  { price: "$2,200–$9,000", recovery: "1–2 weeks", recoveryZh: "1–2 周", type: "Surgical", typeZh: "手术类", icon: ScanFace },
  { price: "$800–$5,000", recovery: "7–14 days", recoveryZh: "7–14 天", type: "Surgical", typeZh: "手术类", icon: Eye },
  { price: "$2,500–$15,000", recovery: "2–4 weeks", recoveryZh: "2–4 周", type: "Surgical", typeZh: "手术类", icon: UserRound },
  { price: "$2,000–$18,000", recovery: "2–4 weeks", recoveryZh: "2–4 周", type: "Surgical", typeZh: "手术类", icon: Sparkles },
  { price: "$3,500–$14,000", recovery: "2–6 weeks", recoveryZh: "2–6 周", type: "Surgical", typeZh: "手术类", icon: HeartPulse },
  { price: "$2,500–$18,000", recovery: "2–6 weeks", recoveryZh: "2–6 周", type: "Surgical", typeZh: "手术类", icon: Activity },
  { price: "$1,500–$7,000", recovery: "7–14 days", recoveryZh: "7–14 天", type: "Surgical", typeZh: "手术类", icon: Scissors },
  { price: "$300–$15,000", recovery: "Same day–2 weeks", recoveryZh: "当天–2 周", type: "Mixed care", typeZh: "综合治疗", icon: Smile },
  { price: "$100–$4,000", recovery: "Hours–2 weeks", recoveryZh: "数小时–2 周", type: "Non-surgical", typeZh: "非手术类", icon: WandSparkles },
] as const;

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
  const copy = (en: string, cn: string, russian: string) => zh ? cn : ru ? russian : en;
  const label = (en: string, cn: string) => zh ? cn : ru ? (RU_LABELS[en] ?? en) : en;
  const [activeCategory, setActiveCategory] = useState(0);
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const visibleCategories = useMemo(() => {
    if (!normalizedQuery) return [{ category: PROCEDURE_CATEGORIES[activeCategory], index: activeCategory }];
    return PROCEDURE_CATEGORIES.map((category, index) => ({
      category: { ...category, items: category.items.filter(([en, cn]) => `${en} ${cn} ${RU_LABELS[en] ?? ""} ${category.en} ${category.zh} ${RU_LABELS[category.en] ?? ""}`.toLowerCase().includes(normalizedQuery)) },
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
                  {copy("Cosmetics Asia Academy", "Cosmetics Asia 医美百科", "Академия Cosmetics Asia")}
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
                      <div><span className="font-mono text-[11px] font-bold text-primary">{String(categoryIndex + 1).padStart(2, "0")}</span><h2 className="font-display text-[1.7rem] font-medium leading-tight tracking-tight sm:text-3xl">{label(category.en, category.zh)}</h2><p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">{ru ? RU_CATEGORY_DESCRIPTIONS[categoryIndex] : CATEGORY_DESCRIPTIONS[categoryIndex][zh ? 1 : 0]}</p></div>
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
                              <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-medium text-muted-foreground"><span className="rounded-full bg-secondary px-2 py-1">{CATEGORY_META[categoryIndex].price}</span><span className="rounded-full bg-primary/10 px-2 py-1 text-primary">{zh ? CATEGORY_META[categoryIndex].recoveryZh : CATEGORY_META[categoryIndex].recovery}</span><span className="rounded-full bg-accent/60 px-2 py-1">{zh ? CATEGORY_META[categoryIndex].typeZh : ru ? (CATEGORY_META[categoryIndex].type === "Surgical" ? "Хирургия" : CATEGORY_META[categoryIndex].type === "Non-surgical" ? "Без операции" : "Комплексное лечение") : CATEGORY_META[categoryIndex].type}</span></div>
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
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy("These broad ranges are for trip planning only. Your procedure, health and expert's advice determine your actual recovery.", "以下为大类项目的一般计划参考。具体恢复进度取决于术式、个人健康状况和专家建议。", "Эти сроки предназначены только для планирования поездки. Реальное восстановление зависит от процедуры, вашего здоровья и рекомендаций эксперта.")}</p>
              </div>
              <Link to="/cases" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft">{copy("Watch recovery diaries", "观看真实恢复日记", "Смотреть дневники восстановления")}<ArrowRight className="size-4" /></Link>
            </div>
            <div className="mt-7 overflow-x-auto rounded-3xl border border-white/70 bg-card/80 shadow-soft">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b border-border/70 text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="p-4">{copy("Procedure group", "项目类别", "Категория")}</th><th className="p-4">{copy("General recovery range", "常见恢复范围", "Обычно восстановление")}</th><th className="p-4">{copy("Planning price range", "参考价格", "Диапазон цен")}</th><th className="p-4">{copy("Type", "类型", "Тип")}</th></tr></thead>
                <tbody>{PROCEDURE_CATEGORIES.slice(0, 6).map((category, index) => <tr key={category.en} className="border-b border-border/60 last:border-0"><td className="p-4 font-semibold">{label(category.en, category.zh)}</td><td className="p-4 text-muted-foreground">{zh ? CATEGORY_META[index].recoveryZh : CATEGORY_META[index].recovery}</td><td className="p-4 text-muted-foreground">{CATEGORY_META[index].price}</td><td className="p-4"><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{zh ? CATEGORY_META[index].typeZh : ru ? "Хирургия" : CATEGORY_META[index].type}</span></td></tr>)}</tbody>
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

          <section className="mx-auto mb-4 mt-16 max-w-6xl rounded-[2rem] border border-primary/15 bg-primary/[0.055] p-6 sm:p-8 md:mt-24 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <span className="pill bg-card"><ClipboardCheck className="size-3.5 text-primary" /> {zh ? "面诊问题清单" : "Consultation checklist"}</span>
                <h2 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-4xl">{zh ? "值得向专家确认的问题" : "Questions worth asking your surgeon"}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{zh ? "好的面诊不仅讨论你想要的结果，也会解释技术选择、风险、恢复和紧急联系安排。" : "A useful consultation should cover technique, risks, recovery and contact arrangements—not only the result you hope to achieve."}</p>
              </div>
              <ol className="grid gap-3 sm:grid-cols-2">
                {(zh ? ["您多久做一次这项手术？", "为什么为我推荐这种技术？", "手术在哪里进行，由谁麻醉？", "最常见的并发症有哪些？", "总报价包含和不包含什么？", "回国后出现问题联系谁？"] : ["How often do you perform this procedure?", "Which technique do you recommend, and why?", "Where is treatment performed, and who provides anesthesia?", "Which complications do you see most often?", "What is included—and excluded—from the quote?", "Who should I contact after returning home?"]).map((item, index) => <li key={item} className="flex min-h-20 gap-3 rounded-2xl border border-border/70 bg-card p-4 text-sm font-semibold"><span className="font-mono text-xs font-bold text-primary">0{index + 1}</span><span>{item}</span></li>)}
              </ol>
            </div>
            <p className="mt-7 border-t border-primary/10 pt-5 text-xs leading-relaxed text-muted-foreground">{zh ? "本页内容仅用于一般科普和行程规划，不构成医疗建议、诊断或个体化治疗方案。请由具备资质的专家完成评估。" : "This page provides general education and planning information only. It is not medical advice, diagnosis or a personalized treatment recommendation. A licensed expert must evaluate your individual circumstances."}</p>
          </section>

          <section className="mx-auto mt-16 max-w-6xl md:mt-24">
            <div className="relative overflow-hidden rounded-[2rem] border-2 border-primary/35 bg-card px-5 py-10 text-foreground shadow-glow ring-1 ring-primary/10 md:min-h-[340px] md:px-14 md:py-16">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-emerald-300 to-amber-200" aria-hidden="true" />
              <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-white/25" />
              <div className="pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full bg-primary/10" />
              <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
                <div className="max-w-4xl">
                  <span className="pill mb-3 bg-primary px-4 py-2 font-bold text-primary-foreground shadow-soft">
                    <MessageCircle className="size-3.5" /> {copy("Free online consultation", "免费线上咨询", "Бесплатная онлайн-консультация")}
                  </span>
                  <h2 className="font-display text-4xl font-medium leading-[1.02] tracking-tight sm:text-5xl md:text-6xl">
                    {copy("Ready to get started?", "准备好开始了吗？", "Готовы начать?")}{" "}
                    <em className="box-decoration-clone rounded-[0.28em] bg-primary/10 px-[0.12em] py-[0.04em] text-primary not-italic">
                      {copy("Take the first step today", "今天迈出第一步", "Сделайте первый шаг сегодня")}
                    </em>
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/70 md:text-lg">
                    {lang === "en" ? (
                      <>
                        Don’t want to talk? That’s okay — email us at <strong className="font-semibold text-foreground">hello@cosmetics-asia.com</strong> or WhatsApp us at{" "}
                        <a href="https://wa.me/14708613825" target="_blank" rel="noreferrer" className="font-semibold text-foreground underline decoration-primary/45 underline-offset-2 transition hover:text-primary">+1 470 861 3825</a>.
                      </>
                    ) : copy(
                      "Tell us the procedure, budget and city you have in mind.",
                      "告诉我们你关注的项目、预算和希望前往的城市。我们会帮你梳理需求，并协助你找到合适的中国专家。",
                      "Расскажите о процедуре, бюджете и желаемом городе. Мы поможем уточнить ваши потребности и подобрать подходящего эксперта в Китае."
                    )}
                  </p>
                </div>
                <div className="w-full shrink-0 text-center md:w-auto">
                  <Button size="lg" onClick={() => open()} className="cta-primary min-h-14 w-full rounded-full px-9 text-base shadow-glow ring-4 ring-primary/15 transition hover:-translate-y-1 md:w-fit">
                    {t("hero.cta")}<ArrowRight className="ml-2 size-4" />
                  </Button>
                  <p className="mt-3 text-xs font-semibold text-foreground/55">
                    {copy("Free · No obligation", "免费 · 无需承诺", "Бесплатно · Без обязательств")}
                  </p>
                </div>
              </div>
            </div>
          </section>

        </section>

        <Footer />
      </div>
    </>
  );
};

export default Treatments;

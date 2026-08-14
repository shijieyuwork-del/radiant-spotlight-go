import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BadgeCheck, CircleHelp, CircleSlash, Clock, DollarSign, FileCheck2, ShieldAlert, Sparkles, Stethoscope } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { findTreatment } from "@/data/treatments";
import { useAsia } from "@/lib/asia-i18n";
import { MEDICAL_DISCLAIMER } from "@/lib/seo-config";
import { PROCEDURE_CATEGORIES, procedureSlug } from "@/pages/Treatments";
import { Button } from "@/components/ui/button";
import TikTokWall from "@/components/TikTokWall";
import { TIKTOK_CASES } from "@/data/tiktokCases";

/** 小节容器，保持各段视觉一致 */
const Section = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mt-10">
    <h2 className="flex items-center gap-2 font-display text-2xl font-medium tracking-tight">
      <span className="text-primary">{icon}</span>
      {title}
    </h2>
    <div className="mt-4">{children}</div>
  </section>
);

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="space-y-2">
    {items.map((s, i) => (
      <li key={i} className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed">
        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60" />
        <span>{s}</span>
      </li>
    ))}
  </ul>
);

const TreatmentDetail = () => {
  const { slug = "" } = useParams();
  const { lang, fmt } = useAsia();
  const zh = lang === "zh";
  const t = findTreatment(slug);
  const catalogMatch = PROCEDURE_CATEGORIES.flatMap((category) =>
    category.items.map(([en, cn]) => ({ en, zh: cn, categoryEn: category.en, categoryZh: category.zh }))
  ).find((item) => procedureSlug(item.en) === slug);

  if (!t) {
    if (catalogMatch) return <CatalogProcedureDetail procedure={catalogMatch} zh={zh} />;
    return (
      <>
        <PageMeta
          title="Procedure Not Found"
          description="The procedure guide you're looking for doesn't exist."
          path={`/treatments/${slug}`}
        />
        <div className="min-h-screen bg-background">
          <AsiaNavbar />
          <div className="container py-24 text-center">
            <h1 className="font-display text-3xl">{zh ? "未找到该项目" : "Procedure not found"}</h1>
            <Link to="/treatments" className="mt-4 inline-block text-primary hover:underline">
              {zh ? "查看全部项目" : "See all procedures"}
            </Link>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  const name = zh ? t.zh : t.en;

  // MedicalWebPage + FAQPage 组合：前者标明这是医学科普内容，
  // 后者让"面诊该问什么"有机会拿到 FAQ 富媒体摘要。
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: `${t.en} — Procedure Guide`,
    description: t.summaryEn,
    about: { "@type": "MedicalProcedure", name: t.en, procedureType: "https://schema.org/SurgicalProcedure" },
    audience: { "@type": "Patient" },
    lastReviewed: "2026-08-07",
  };

  return (
    <>
      <PageMeta
        title={`${t.en} — What It Involves, Recovery, Risks & Cost`}
        description={t.summaryEn}
        path={`/treatments/${t.slug}`}
        structuredData={schema}
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />

        <article className="container max-w-3xl py-10 md:py-14">
          <Link
            to="/treatments"
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="size-4" /> {zh ? "全部项目" : "All procedures"}
          </Link>

          <span className="pill bg-accent text-accent-foreground mb-3">
            <Stethoscope className="size-3.5" />
            {zh ? "项目指南" : "Procedure guide"}
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight">{name}</h1>
          <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
            {zh ? t.summaryZh : t.summaryEn}
          </p>

          <Section icon={<Sparkles className="size-5" />} title={zh ? "这是什么" : "What it is"}>
            <p className="text-sm text-muted-foreground leading-relaxed">{zh ? t.whatZh : t.whatEn}</p>
          </Section>

          <Section icon={<Stethoscope className="size-5" />} title={zh ? "常见术式" : "Common techniques"}>
            <Bullets items={zh ? t.techniquesZh : t.techniquesEn} />
          </Section>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <h3 className="font-medium">{zh ? "通常适合" : "Usually a good fit"}</h3>
              <div className="mt-3">
                <Bullets items={zh ? t.goodFitZh : t.goodFitEn} />
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <h3 className="flex items-center gap-1.5 font-medium">
                <CircleSlash className="size-4 text-muted-foreground" />
                {zh ? "通常不适合" : "Usually not a fit"}
              </h3>
              <div className="mt-3">
                <Bullets items={zh ? t.notFitZh : t.notFitEn} />
              </div>
            </div>
          </div>

          <Section icon={<Clock className="size-5" />} title={zh ? "恢复时间线" : "Recovery timeline"}>
            <ol className="space-y-4">
              {t.recovery.map((r, i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 w-28 pt-0.5 text-sm font-medium">{zh ? r.whenZh : r.whenEn}</span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{zh ? r.whatZh : r.whatEn}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section icon={<ShieldAlert className="size-5" />} title={zh ? "风险与并发症" : "Risks & complications"}>
            <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-5">
              <Bullets items={zh ? t.risksZh : t.risksEn} />
            </div>
          </Section>

          <Section icon={<CircleHelp className="size-5" />} title={zh ? "面诊时该问什么" : "What to ask at consultation"}>
            <Bullets items={zh ? t.askZh : t.askEn} />
          </Section>

          <Section icon={<DollarSign className="size-5" />} title={zh ? "费用参考" : "What it costs"}>
            <p className="font-display text-3xl font-medium tracking-tight">
              ${t.priceUsdLow.toLocaleString()} – ${t.priceUsdHigh.toLocaleString()}
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {zh ? t.priceNoteZh : t.priceNoteEn}
            </p>
          </Section>

          <ProcedureVideoRow procedure={t.en} zh={zh} fmt={fmt} />

          <p className="mt-12 rounded-2xl bg-muted/50 p-5 text-xs text-muted-foreground leading-relaxed">
            {zh
              ? "以上为一般性医学科普，不构成针对个人的诊疗建议。每个人的解剖条件、既往病史与用药情况不同，实际方案与风险应以面诊后执业医师的评估为准。"
              : MEDICAL_DISCLAIMER}
          </p>
        </article>

        <Footer />
      </div>
    </>
  );
};

const categoryCopy: Record<string, { en: string; zh: string }> = {
  "Nose": {
    en: "Nasal procedures reshape or restore specific bone, cartilage or soft-tissue structures. The appropriate approach depends on facial proportions, breathing function, skin thickness and any previous surgery.",
    zh: "鼻部项目针对骨骼、软骨或软组织进行塑形与修复。适合的方案取决于面部比例、呼吸功能、皮肤厚度以及既往手术情况。",
  },
  "Eyes": {
    en: "Eyelid and eye-area procedures address crease shape, excess skin, fat position or muscle function. Small anatomical differences can materially change the recommended technique.",
    zh: "眼部项目可处理褶皱形态、松弛皮肤、脂肪位置或肌肉功能。细微的解剖差异可能明显影响术式选择。",
  },
  "Face & Contour": {
    en: "Facial contour procedures adjust projection, width, symmetry or volume. Planning should consider the whole face rather than treating one feature in isolation.",
    zh: "面部轮廓项目可调整突出度、宽度、对称性或容量。规划时应考虑整体面部比例，而不是孤立处理某一个部位。",
  },
  "Facial Rejuvenation": {
    en: "Facial rejuvenation procedures address tissue descent, skin excess or volume change. Different techniques work at different anatomical layers and have different recovery profiles.",
    zh: "面部年轻化项目处理组织下垂、皮肤松弛或容量变化。不同术式作用于不同解剖层次，恢复过程也不同。",
  },
  "Breast": {
    en: "Breast procedures may change size, shape, position or symmetry. Implant choice, existing tissue, scars, future pregnancy and long-term follow-up should all be discussed.",
    zh: "胸部项目可能改变大小、形态、位置或对称性。应讨论假体选择、自身组织条件、疤痕、未来生育及长期随访。",
  },
  "Body Contouring": {
    en: "Body-contouring procedures remove fat, tighten skin or reshape tissue. They are not substitutes for weight management, and safe treatment extent must be individualized.",
    zh: "身体塑形项目可去除脂肪、收紧皮肤或重塑组织，但不能代替体重管理；安全治疗范围必须个体化评估。",
  },
  "Hair Restoration": {
    en: "Hair-restoration planning considers the cause of hair loss, donor density, hairline design and the number of grafts that can be safely harvested.",
    zh: "毛发移植规划需要评估脱发原因、供区密度、发际线设计以及可安全提取的毛囊数量。",
  },
  "Cosmetic Dentistry": {
    en: "Cosmetic dental care should protect bite function and healthy tooth structure while improving appearance. Imaging, gum health and long-term maintenance matter as much as color and shape.",
    zh: "牙齿美容应在改善外观的同时保护咬合功能和健康牙体。影像检查、牙龈健康与长期维护和颜色、形态同样重要。",
  },
  "Skin & Non-Surgical": {
    en: "Skin and non-surgical treatments vary by device, product, depth and indication. A qualified clinician should confirm the diagnosis, product authenticity and realistic treatment limits.",
    zh: "皮肤与非手术项目会因设备、产品、作用深度和适应症而不同。应由合格医生确认诊断、产品真伪及合理治疗边界。",
  },
};

const CatalogProcedureDetail = ({ procedure, zh }: { procedure: { en: string; zh: string; categoryEn: string; categoryZh: string }; zh: boolean }) => {
  const { fmt } = useAsia();
  const name = zh ? procedure.zh : procedure.en;
  const intro = categoryCopy[procedure.categoryEn];
  const path = `/treatments/${procedureSlug(procedure.en)}`;

  return (
    <>
      <PageMeta
        title={`${procedure.en} in China | Procedure Overview`}
        description={`Learn what to discuss when considering ${procedure.en} in China, including planning, provider checks, risks and next steps.`}
        path={path}
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />
        <main className="container max-w-4xl py-10 md:py-14">
          <Link to="/treatments" className="mb-7 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90">
            <ArrowLeft className="size-4" /> {zh ? "全部项目" : "All procedures"}
          </Link>

          <section className="rounded-[2rem] border border-border/60 bg-card p-6 shadow-soft md:p-9">
            <span className="pill mb-3 bg-accent text-accent-foreground"><Stethoscope className="size-3.5" /> {zh ? procedure.categoryZh : procedure.categoryEn}</span>
            <h1 className="font-display text-4xl font-medium tracking-tight md:text-5xl">{name}</h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">{zh ? intro.zh : intro.en}</p>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            <InfoCard icon={<FileCheck2 />} title={zh ? "先确认目标" : "Clarify your goal"} text={zh ? "说明希望改善的问题、既往治疗、病史和用药情况。" : "Describe the concern, previous treatment, medical history and current medication."} />
            <InfoCard icon={<BadgeCheck />} title={zh ? "核验医生经验" : "Verify experience"} text={zh ? "查看执业信息，并要求与自身情况相近的真实案例。" : "Check licensing and request genuine cases relevant to your anatomy and goals."} />
            <InfoCard icon={<ShieldAlert />} title={zh ? "了解风险与恢复" : "Discuss risk & recovery"} text={zh ? "确认术式、麻醉、恢复安排、并发症处理及完整费用。" : "Confirm technique, anesthesia, recovery, complication management and total cost."} />
          </section>

          <ProcedureVideoRow procedure={`${procedure.en} ${procedure.categoryEn}`} zh={zh} fmt={fmt} />

          <section className="mt-8 rounded-3xl bg-muted/45 p-6 md:p-8">
            <h2 className="font-display text-2xl font-medium tracking-tight">{zh ? "下一步：获取适合你的方案" : "Next: get a plan built around you"}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {zh ? "这是一份一般性项目介绍，不构成医疗建议。具体方案、价格与恢复期只能在医生评估后确定。" : "This is a general overview, not medical advice. Technique, price and recovery can only be confirmed after a clinician evaluates you."}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="rounded-full px-6"><Link to="/doctors">{zh ? "查看医生" : "Explore doctors"}<ArrowRight className="ml-2 size-4" /></Link></Button>
              <Button asChild variant="outline" className="rounded-full px-6"><Link to="/travel-packages">{zh ? "查看旅行套餐" : "View travel packages"}</Link></Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

const relatedCaseTerms: Record<string, string[]> = {
  nose: ["rhinoplasty"],
  eye: ["blepharoplasty"],
  face: ["facelift", "neck lift", "facial fat grafting"],
  breast: ["breast"],
  body: ["liposuction", "tummy tuck", "bbl", "body contouring"],
};

const getRelatedCases = (procedure: string) => {
  const query = procedure.toLowerCase();
  const group = query.match(/nose|rhino|nasal|sept|alar/) ? "nose"
    : query.match(/eye|eyelid|bleph|ptosis|epican|brow/) ? "eye"
      : query.match(/breast|implant/) ? "breast"
        : query.match(/body|lipo|tummy|arm lift|thigh|mommy|fat transfer/) ? "body"
          : query.match(/face|facial|jaw|chin|neck|lift|contour|zygoma|genio/) ? "face"
            : "";
  const terms = group ? relatedCaseTerms[group] : [];
  const exact = TIKTOK_CASES.filter((item) => query.includes(item.treatment.en.toLowerCase()) || item.treatment.en.toLowerCase().includes(query));
  const grouped = TIKTOK_CASES.filter((item) => terms.some((term) => item.treatment.en.toLowerCase().includes(term)));
  return [...exact, ...grouped, ...TIKTOK_CASES]
    .filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index)
    .slice(0, 4);
};

const ProcedureVideoRow = ({ procedure, zh, fmt }: { procedure: string; zh: boolean; fmt: (cny: number) => string }) => {
  const items = getRelatedCases(procedure);
  return (
    <section className="mt-10 border-t border-border/60 pt-9">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="pill bg-accent text-accent-foreground">{zh ? "真实案例" : "Real case videos"}</span>
          <h2 className="mt-3 font-display text-2xl font-medium tracking-tight md:text-3xl">
            {zh ? "观看相关恢复短视频" : "Watch related recovery diaries"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{zh ? "左右滑动查看更多案例与恢复过程。" : "Swipe to explore patient journeys and recovery updates."}</p>
        </div>
        <Button asChild variant="outline" className="w-fit rounded-full">
          <Link to="/cases">{zh ? "查看全部案例" : "View all cases"}<ArrowRight className="ml-2 size-4" /></Link>
        </Button>
      </div>
      <TikTokWall items={items} lang={zh ? "zh" : "en"} fmtPrice={fmt} variant="wall" />
    </section>
  );
};

const InfoCard = ({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) => (
  <article className="rounded-3xl border border-border/60 bg-card p-5">
    <span className="text-primary">{icon}</span>
    <h2 className="mt-4 font-display text-xl font-medium tracking-tight">{title}</h2>
    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
  </article>
);

export default TreatmentDetail;

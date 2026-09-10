import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BadgeCheck, ChevronDown, CircleHelp, CircleSlash, Clock, DollarSign, FileCheck2, HeartPulse, Pill, ShieldAlert, Sparkles, Stethoscope } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { findTreatment } from "@/data/treatments";
import { useAsia, type AsiaLang } from "@/lib/asia-i18n";
import { MEDICAL_DISCLAIMER } from "@/lib/seo-config";
import { PROCEDURE_CATEGORIES, procedureSlug } from "@/data/procedureCatalog";
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
  const ru = lang === "ru";
  const es = lang === "es";
  const c = (en: string, cn: string, russian: string, spanish?: string) => zh ? cn : ru ? russian : es ? (spanish ?? en) : en;
  const t = findTreatment(slug);
  const catalogMatch = PROCEDURE_CATEGORIES.flatMap((category) =>
    category.items.map(([en, cn]) => ({ en, zh: cn, categoryEn: category.en, categoryZh: category.zh }))
  ).find((item) => procedureSlug(item.en) === slug);

  if (t) {
    const procedure = catalogMatch ?? {
      en: t.en,
      zh: t.zh,
      categoryEn: "Skin & Non-Surgical",
      categoryZh: "皮肤与非手术",
    };
    return <CatalogProcedureDetail procedure={procedure} lang={lang} treatment={t} />;
  }

  if (!t) {
    if (catalogMatch) return <CatalogProcedureDetail procedure={catalogMatch} lang={lang} />;
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
            <h1 className="font-display text-3xl">{c("Procedure not found", "未找到该项目", "Процедура не найдена", "Procedimiento no encontrado")}</h1>
            <Link to="/treatments" className="mt-4 inline-block text-brand hover:underline">
              {c("See all procedures", "查看全部项目", "Все процедуры", "Ver todos los procedimientos")}
            </Link>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  const name = zh ? t.zh : t.en;
  const fullGuideEducation = catalogEducation[catalogMatch?.categoryEn || "Skin & Non-Surgical"];

  // MedicalWebPage + FAQPage 组合：前者标明这是医学科普内容，
  // 后者让"面诊该问什么"有机会拿到 FAQ 富媒体摘要。
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: `${t.en} — Procedure Guide`,
    description: t.summaryEn,
    about: { "@type": "MedicalProcedure", name: t.en, procedureType: "https://schema.org/SurgicalProcedure" },
    audience: { "@type": "Patient" },
    dateModified: "2026-08-30",
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
            <ArrowLeft className="size-4" /> {c("All procedures", "全部项目", "Все процедуры", "Todos los procedimientos")}
          </Link>

          <span className="pill bg-accent text-accent-foreground mb-3">
            <Stethoscope className="size-3.5" />
            {c("Procedure guide", "项目指南", "Справочник по процедуре", "Guía del procedimiento")}
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight">{name}</h1>
          <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
            {zh ? t.summaryZh : t.summaryEn}
          </p>

          <Section icon={<Sparkles className="size-5" />} title={c("What it is", "这是什么", "Что это такое", "Qué es")}>
            <p className="text-sm text-muted-foreground leading-relaxed">{zh ? t.whatZh : t.whatEn}</p>
          </Section>

          <Section icon={<Stethoscope className="size-5" />} title={c("Common techniques", "常见术式", "Распространённые методики", "Técnicas comunes")}>
            <Bullets items={zh ? t.techniquesZh : t.techniquesEn} />
          </Section>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <h3 className="font-medium">{c("Usually a good fit", "通常适合", "Кому обычно подходит", "Suele ser adecuado")}</h3>
              <div className="mt-3">
                <Bullets items={zh ? t.goodFitZh : t.goodFitEn} />
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <h3 className="flex items-center gap-1.5 font-medium">
                <CircleSlash className="size-4 text-muted-foreground" />
                {c("Usually not a fit", "通常不适合", "Кому обычно не подходит", "Suele no ser adecuado")}
              </h3>
              <div className="mt-3">
                <Bullets items={zh ? t.notFitZh : t.notFitEn} />
              </div>
            </div>
          </div>

          <Section icon={<Clock className="size-5" />} title={c("Recovery timeline", "恢复时间线", "Этапы восстановления", "Cronología de recuperación")}>
            <ol className="space-y-4">
              {t.recovery.map((r, i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 w-28 pt-0.5 text-sm font-medium">{zh ? r.whenZh : r.whenEn}</span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{zh ? r.whatZh : r.whatEn}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section icon={<ShieldAlert className="size-5" />} title={c("Risks & complications", "风险与并发症", "Риски и осложнения", "Riesgos y complicaciones")}>
            <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-5">
              <Bullets items={zh ? t.risksZh : t.risksEn} />
            </div>
          </Section>

          <Section icon={<HeartPulse className="size-5" />} title={c("Tell the expert before surgery", "术前必须告知专家", "Что сообщить эксперту до операции", "Informar al experto antes de la cirugía")}>
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.045] p-5">
              <Bullets items={zh ? fullGuideEducation.discloseZh : fullGuideEducation.discloseEn} />
              <p className="mt-4 flex gap-2 text-xs font-medium leading-relaxed text-foreground">
                <Pill className="mt-0.5 size-4 shrink-0 text-primary" />
                {c("Do not stop medication on your own. Any change must be directed by the prescribing expert, surgeon or anesthesiologist.", "不要自行停药。是否暂停或调整药物，必须由开药专家、手术专家或麻醉专家决定。", "Не прекращайте приём лекарств самостоятельно. Любые изменения должен назначить лечащий эксперт, хирург или анестезиолог.", "No suspendas la medicación por tu cuenta. Cualquier cambio debe ser indicado por el experto que la prescribió, el cirujano o el anestesiólogo.")}
              </p>
            </div>
          </Section>

          <Section icon={<CircleHelp className="size-5" />} title={c("What to ask at consultation", "面诊时该问什么", "Что спросить на консультации", "Qué preguntar en la consulta")}>
            <Bullets items={zh ? t.askZh : t.askEn} />
          </Section>

          <Section icon={<DollarSign className="size-5" />} title={c("What it costs", "费用参考", "Ориентировочная стоимость", "Qué cuesta")}>
            <p className="font-display text-3xl font-medium tracking-tight">
              ${t.priceUsdLow.toLocaleString()} – ${t.priceUsdHigh.toLocaleString()}
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {zh ? t.priceNoteZh : t.priceNoteEn}
            </p>
          </Section>

          <ProcedureVideoRow procedure={t.en} lang={lang} fmt={fmt} />

          <p className="mt-12 rounded-2xl bg-muted/50 p-5 text-xs text-muted-foreground leading-relaxed">
            {zh
              ? "以上为一般性医学科普，不构成针对个人的诊疗建议。每个人的解剖条件、既往病史与用药情况不同，实际方案与风险应以面诊后执业专家的评估为准。"
              : ru ? "Эта информация носит общий образовательный характер и не заменяет персональную медицинскую консультацию. План лечения и риски определяет лицензированный эксперт после оценки вашего состояния." : MEDICAL_DISCLAIMER}
          </p>
        </article>

        <Footer />
      </div>
    </>
  );
};

const categoryCopy: Record<string, { en: string; zh: string; es: string }> = {
  "Nose": {
    en: "Nasal procedures reshape or restore specific bone, cartilage or soft-tissue structures. The appropriate approach depends on facial proportions, breathing function, skin thickness and any previous surgery.",
    zh: "鼻部项目针对骨骼、软骨或软组织进行塑形与修复。适合的方案取决于面部比例、呼吸功能、皮肤厚度以及既往手术情况。",
    es: "Los procedimientos nasales remodelan o restauran estructuras óseas, cartilaginosas o de tejido blando específicas. El enfoque adecuado depende de las proporciones faciales, la función respiratoria, el grosor de la piel y cualquier cirugía previa.",
  },
  "Eyes": {
    en: "Eyelid and eye-area procedures address crease shape, excess skin, fat position or muscle function. Small anatomical differences can materially change the recommended technique.",
    zh: "眼部项目可处理褶皱形态、松弛皮肤、脂肪位置或肌肉功能。细微的解剖差异可能明显影响术式选择。",
    es: "Los procedimientos del párpado y la zona ocular abordan la forma del pliegue, el exceso de piel, la posición de la grasa o la función muscular. Pequeñas diferencias anatómicas pueden cambiar de forma importante la técnica recomendada.",
  },
  "Face & Contour": {
    en: "Facial contour procedures adjust projection, width, symmetry or volume. Planning should consider the whole face rather than treating one feature in isolation.",
    zh: "面部轮廓项目可调整突出度、宽度、对称性或容量。规划时应考虑整体面部比例，而不是孤立处理某一个部位。",
    es: "Los procedimientos de contorno facial ajustan la proyección, el ancho, la simetría o el volumen. La planificación debe considerar el rostro en su conjunto en lugar de tratar una sola zona de forma aislada.",
  },
  "Facial Rejuvenation": {
    en: "Facial rejuvenation procedures address tissue descent, skin excess or volume change. Different techniques work at different anatomical layers and have different recovery profiles.",
    zh: "面部年轻化项目处理组织下垂、皮肤松弛或容量变化。不同术式作用于不同解剖层次，恢复过程也不同。",
    es: "Los procedimientos de rejuvenecimiento facial abordan la caída de tejidos, el exceso de piel o el cambio de volumen. Distintas técnicas actúan en diferentes capas anatómicas y tienen perfiles de recuperación diferentes.",
  },
  "Breast": {
    en: "Breast procedures may change size, shape, position or symmetry. Implant choice, existing tissue, scars, future pregnancy and long-term follow-up should all be discussed.",
    zh: "胸部项目可能改变大小、形态、位置或对称性。应讨论假体选择、自身组织条件、疤痕、未来生育及长期随访。",
    es: "Los procedimientos mamarios pueden cambiar el tamaño, la forma, la posición o la simetría. Deben discutirse la elección del implante, el tejido existente, las cicatrices, un futuro embarazo y el seguimiento a largo plazo.",
  },
  "Body Contouring": {
    en: "Body-contouring procedures remove fat, tighten skin or reshape tissue. They are not substitutes for weight management, and safe treatment extent must be individualized.",
    zh: "身体塑形项目可去除脂肪、收紧皮肤或重塑组织，但不能代替体重管理；安全治疗范围必须个体化评估。",
    es: "Los procedimientos de contorno corporal eliminan grasa, tensan la piel o remodelan el tejido. No sustituyen el control del peso, y el alcance seguro del tratamiento debe individualizarse.",
  },
  "Hair Restoration": {
    en: "Hair-restoration planning considers the cause of hair loss, donor density, hairline design and the number of grafts that can be safely harvested.",
    zh: "毛发移植规划需要评估脱发原因、供区密度、发际线设计以及可安全提取的毛囊数量。",
    es: "La planificación de la restauración capilar considera la causa de la caída del cabello, la densidad de la zona donante, el diseño de la línea de implantación y el número de injertos que se pueden extraer con seguridad.",
  },
  "Cosmetic Dentistry": {
    en: "Cosmetic dental care should protect bite function and healthy tooth structure while improving appearance. Imaging, gum health and long-term maintenance matter as much as color and shape.",
    zh: "牙齿美容应在改善外观的同时保护咬合功能和健康牙体。影像检查、牙龈健康与长期维护和颜色、形态同样重要。",
    es: "La odontología estética debe proteger la función de la mordida y la estructura dental sana a la vez que mejora la apariencia. Las imágenes diagnósticas, la salud de las encías y el mantenimiento a largo plazo importan tanto como el color y la forma.",
  },
  "Skin & Non-Surgical": {
    en: "Skin and non-surgical treatments vary by device, product, depth and indication. A qualified expert should confirm the diagnosis, product authenticity and realistic treatment limits.",
    zh: "皮肤与非手术项目会因设备、产品、作用深度和适应症而不同。应由合格专家确认诊断、产品真伪及合理治疗边界。",
    es: "Los tratamientos de piel y no quirúrgicos varían según el dispositivo, el producto, la profundidad y la indicación. Un experto calificado debe confirmar el diagnóstico, la autenticidad del producto y los límites realistas del tratamiento.",
  },
};

type CatalogEducation = {
  price: string;
  downtimeEn: string;
  downtimeZh: string;
  downtimeEs: string;
  finalEn: string;
  finalZh: string;
  finalEs: string;
  anesthesiaEn: string;
  anesthesiaZh: string;
  anesthesiaEs: string;
  risksEn: string[];
  risksZh: string[];
  risksEs: string[];
  discloseEn: string[];
  discloseZh: string[];
  discloseEs: string[];
};

const sharedDisclosure = {
  en: [
    "Heart disease, high blood pressure, asthma, sleep apnea or other lung conditions",
    "Diabetes, liver or kidney disease, immune disorders, bleeding or clotting problems",
    "Pregnancy, breastfeeding, active infection, severe allergies or a history of difficult scarring",
    "Any previous reaction to anesthesia, surgery or an implanted medical product",
    "All prescriptions, over-the-counter medicines, blood thinners, vitamins, herbal supplements, nicotine, alcohol and recreational drugs",
  ],
  zh: [
    "心脏病、高血压、哮喘、睡眠呼吸暂停或其他肺部疾病",
    "糖尿病、肝肾疾病、免疫系统疾病、出血或凝血问题",
    "妊娠、哺乳、活动性感染、严重过敏或增生性瘢痕史",
    "既往麻醉、手术或植入类医疗产品的不良反应",
    "全部处方药、非处方药、抗凝药、维生素、草药补充剂，以及尼古丁、酒精和其他药物使用情况",
  ],
  es: [
    "Enfermedad cardíaca, presión arterial alta, asma, apnea del sueño u otras afecciones pulmonares",
    "Diabetes, enfermedad hepática o renal, trastornos del sistema inmunitario, problemas de sangrado o coagulación",
    "Embarazo, lactancia, infección activa, alergias graves o antecedentes de cicatrización difícil",
    "Cualquier reacción previa a la anestesia, a una cirugía o a un producto médico implantado",
    "Todos los medicamentos con receta, de venta libre, anticoagulantes, vitaminas, suplementos herbales, nicotina, alcohol y drogas recreativas",
  ],
};

const catalogEducation: Record<string, CatalogEducation> = {
  Nose: {
    price: "$2,200–$9,000", downtimeEn: "About 1–2 weeks", downtimeZh: "约 1–2 周", downtimeEs: "Aproximadamente 1–2 semanas", finalEn: "6–12 months", finalZh: "6–12 个月", finalEs: "6–12 meses", anesthesiaEn: "Usually general anesthesia", anesthesiaZh: "通常为全身麻醉", anesthesiaEs: "Generalmente anestesia general",
    risksEn: ["Bleeding, infection and anesthesia-related complications", "Persistent swelling, asymmetry, contour irregularity or visible scarring", "Breathing difficulty, numbness or need for revision surgery"],
    risksZh: ["出血、感染及麻醉相关并发症", "持续肿胀、不对称、轮廓不规则或明显瘢痕", "呼吸困难、麻木或需要修复手术"],
    risksEs: ["Sangrado, infección y complicaciones relacionadas con la anestesia", "Hinchazón persistente, asimetría, irregularidad del contorno o cicatrices visibles", "Dificultad para respirar, entumecimiento o necesidad de cirugía de revisión"],
    discloseEn: [...sharedDisclosure.en, "Previous nasal surgery, trauma, chronic sinus disease or breathing obstruction"], discloseZh: [...sharedDisclosure.zh, "既往鼻部手术、外伤、慢性鼻窦疾病或通气障碍"], discloseEs: [...sharedDisclosure.es, "Cirugía nasal previa, traumatismo, enfermedad sinusal crónica u obstrucción respiratoria"],
  },
  Eyes: {
    price: "$800–$5,000", downtimeEn: "About 7–14 days", downtimeZh: "约 7–14 天", downtimeEs: "Aproximadamente 7–14 días", finalEn: "1–3 months", finalZh: "1–3 个月", finalEs: "1–3 meses", anesthesiaEn: "Local anesthesia or sedation", anesthesiaZh: "局部麻醉或镇静", anesthesiaEs: "Anestesia local o sedación",
    risksEn: ["Bleeding, infection, dry eye and temporary blurred vision", "Asymmetry, visible scarring, difficulty closing the eyes or lid-position change", "Rare injury to eye structures or need for revision"],
    risksZh: ["出血、感染、干眼及暂时性视物模糊", "不对称、明显瘢痕、闭眼困难或眼睑位置改变", "罕见眼部结构损伤或需要修复"],
    risksEs: ["Sangrado, infección, ojo seco y visión borrosa temporal", "Asimetría, cicatrices visibles, dificultad para cerrar los ojos o cambio en la posición del párpado", "Lesión poco frecuente de las estructuras oculares o necesidad de revisión"],
    discloseEn: [...sharedDisclosure.en, "Dry eye, glaucoma, thyroid eye disease, contact-lens problems or previous eye surgery"], discloseZh: [...sharedDisclosure.zh, "干眼、青光眼、甲状腺相关眼病、隐形眼镜问题或既往眼部手术"], discloseEs: [...sharedDisclosure.es, "Ojo seco, glaucoma, orbitopatía tiroidea, problemas con lentes de contacto o cirugía ocular previa"],
  },
  "Face & Contour": {
    price: "$2,500–$15,000", downtimeEn: "About 2–4 weeks", downtimeZh: "约 2–4 周", downtimeEs: "Aproximadamente 2–4 semanas", finalEn: "3–12 months", finalZh: "3–12 个月", finalEs: "3–12 meses", anesthesiaEn: "Sedation or general anesthesia", anesthesiaZh: "镇静或全身麻醉", anesthesiaEs: "Sedación o anestesia general",
    risksEn: ["Bleeding, infection, swelling and anesthesia-related complications", "Asymmetry, contour irregularity, numbness or unfavorable scarring", "Nerve, tooth or bone-healing complications depending on the procedure"],
    risksZh: ["出血、感染、肿胀及麻醉相关并发症", "不对称、轮廓不规则、麻木或瘢痕不理想", "根据术式可能出现神经、牙齿或骨愈合问题"],
    risksEs: ["Sangrado, infección, hinchazón y complicaciones relacionadas con la anestesia", "Asimetría, irregularidad del contorno, entumecimiento o cicatrización desfavorable", "Complicaciones nerviosas, dentales o de consolidación ósea según el procedimiento"],
    discloseEn: [...sharedDisclosure.en, "Jaw-joint symptoms, dental disease, facial nerve problems, previous fillers or facial implants"], discloseZh: [...sharedDisclosure.zh, "颞下颌关节症状、牙科疾病、面神经问题、既往填充剂或面部植入物"], discloseEs: [...sharedDisclosure.es, "Síntomas de la articulación mandibular, enfermedad dental, problemas del nervio facial, rellenos previos o implantes faciales"],
  },
  "Facial Rejuvenation": {
    price: "$2,000–$18,000", downtimeEn: "About 2–4 weeks", downtimeZh: "约 2–4 周", downtimeEs: "Aproximadamente 2–4 semanas", finalEn: "3–6 months", finalZh: "3–6 个月", finalEs: "3–6 meses", anesthesiaEn: "Sedation or general anesthesia", anesthesiaZh: "镇静或全身麻醉", anesthesiaEs: "Sedación o anestesia general",
    risksEn: ["Bleeding, infection, fluid collection and anesthesia-related complications", "Facial-nerve injury, altered sensation, hairline change or skin loss", "Asymmetry, visible scarring or need for revision"],
    risksZh: ["出血、感染、积液及麻醉相关并发症", "面神经损伤、感觉变化、发际线改变或皮肤坏死", "不对称、明显瘢痕或需要修复"],
    risksEs: ["Sangrado, infección, acumulación de líquido y complicaciones relacionadas con la anestesia", "Lesión del nervio facial, alteración de la sensibilidad, cambio en la línea de implantación o pérdida de piel", "Asimetría, cicatrices visibles o necesidad de revisión"],
    discloseEn: [...sharedDisclosure.en, "Previous facelift, threads, energy-device treatment, fillers or facial nerve weakness"], discloseZh: [...sharedDisclosure.zh, "既往拉皮、线雕、能量类治疗、填充剂或面神经无力"], discloseEs: [...sharedDisclosure.es, "Lifting facial previo, hilos, tratamientos con dispositivos de energía, rellenos o debilidad del nervio facial"],
  },
  Breast: {
    price: "$3,500–$14,000", downtimeEn: "About 2–6 weeks", downtimeZh: "约 2–6 周", downtimeEs: "Aproximadamente 2–6 semanas", finalEn: "3–6 months", finalZh: "3–6 个月", finalEs: "3–6 meses", anesthesiaEn: "Usually general anesthesia", anesthesiaZh: "通常为全身麻醉", anesthesiaEs: "Generalmente anestesia general",
    risksEn: ["Bleeding, infection, fluid collection and anesthesia-related complications", "Changes in nipple sensation, asymmetry, scarring or wound-healing problems", "Implant rupture, displacement or capsular contracture when implants are used"],
    risksZh: ["出血、感染、积液及麻醉相关并发症", "乳头感觉变化、不对称、瘢痕或伤口愈合问题", "使用假体时可能发生破裂、移位或包膜挛缩"],
    risksEs: ["Sangrado, infección, acumulación de líquido y complicaciones relacionadas con la anestesia", "Cambios en la sensibilidad del pezón, asimetría, cicatrices o problemas de cicatrización", "Rotura, desplazamiento o contractura capsular del implante cuando se usan implantes"],
    discloseEn: [...sharedDisclosure.en, "Breast symptoms, abnormal imaging, family cancer history, prior breast surgery, pregnancy or breastfeeding plans"], discloseZh: [...sharedDisclosure.zh, "乳房症状、异常影像、肿瘤家族史、既往乳房手术以及妊娠或哺乳计划"], discloseEs: [...sharedDisclosure.es, "Síntomas mamarios, imágenes anómalas, antecedentes familiares de cáncer, cirugía mamaria previa, embarazo o planes de lactancia"],
  },
  "Body Contouring": {
    price: "$2,500–$18,000", downtimeEn: "About 2–6 weeks", downtimeZh: "约 2–6 周", downtimeEs: "Aproximadamente 2–6 semanas", finalEn: "3–12 months", finalZh: "3–12 个月", finalEs: "3–12 meses", anesthesiaEn: "Sedation or general anesthesia", anesthesiaZh: "镇静或全身麻醉", anesthesiaEs: "Sedación o anestesia general",
    risksEn: ["Bleeding, infection, fluid collection, blood clots and anesthesia-related complications", "Contour irregularity, asymmetry, numbness, skin loss or poor scarring", "Fluid shifts and cardiopulmonary complications when large areas are treated"],
    risksZh: ["出血、感染、积液、血栓及麻醉相关并发症", "轮廓不规则、不对称、麻木、皮肤坏死或瘢痕不理想", "大范围治疗时可能发生体液变化及心肺并发症"],
    risksEs: ["Sangrado, infección, acumulación de líquido, coágulos sanguíneos y complicaciones relacionadas con la anestesia", "Irregularidad del contorno, asimetría, entumecimiento, pérdida de piel o cicatrización deficiente", "Cambios de fluidos y complicaciones cardiopulmonares cuando se tratan zonas extensas"],
    discloseEn: [...sharedDisclosure.en, "History of blood clots, significant weight change, bariatric surgery, hernia or future pregnancy plans"], discloseZh: [...sharedDisclosure.zh, "血栓史、明显体重变化、减重手术史、疝气或未来妊娠计划"], discloseEs: [...sharedDisclosure.es, "Antecedentes de coágulos sanguíneos, cambio de peso significativo, cirugía bariátrica, hernia o planes futuros de embarazo"],
  },
  "Hair Restoration": {
    price: "$1,500–$7,000", downtimeEn: "About 7–14 days", downtimeZh: "约 7–14 天", downtimeEs: "Aproximadamente 7–14 días", finalEn: "6–12 months", finalZh: "6–12 个月", finalEs: "6–12 meses", anesthesiaEn: "Usually local anesthesia", anesthesiaZh: "通常为局部麻醉", anesthesiaEs: "Generalmente anestesia local",
    risksEn: ["Bleeding, infection, swelling, folliculitis and scarring", "Temporary shock loss, poor graft growth or unnatural hairline", "Donor-area thinning, numbness or need for additional sessions"],
    risksZh: ["出血、感染、肿胀、毛囊炎及瘢痕", "暂时性休止期脱发、移植物生长不佳或发际线不自然", "供区变薄、麻木或需要追加治疗"],
    risksEs: ["Sangrado, infección, hinchazón, foliculitis y cicatrices", "Pérdida de cabello por efluvio telógeno temporal, mal crecimiento del injerto o línea de implantación antinatural", "Adelgazamiento de la zona donante, entumecimiento o necesidad de sesiones adicionales"],
    discloseEn: [...sharedDisclosure.en, "Sudden or patchy hair loss, scalp disease, autoimmune disease, anemia, thyroid disease or hormonal symptoms"], discloseZh: [...sharedDisclosure.zh, "突发或斑片状脱发、头皮疾病、自身免疫病、贫血、甲状腺疾病或激素相关症状"], discloseEs: [...sharedDisclosure.es, "Caída de cabello súbita o en parches, enfermedad del cuero cabelludo, enfermedad autoinmune, anemia, enfermedad tiroidea o síntomas hormonales"],
  },
  "Cosmetic Dentistry": {
    price: "$300–$15,000", downtimeEn: "Same day to 2 weeks", downtimeZh: "当天至 2 周", downtimeEs: "El mismo día hasta 2 semanas", finalEn: "Varies by treatment", finalZh: "依治疗项目而定", finalEs: "Varía según el tratamiento", anesthesiaEn: "None, local anesthesia or sedation", anesthesiaZh: "无需麻醉、局麻或镇静", anesthesiaEs: "Sin anestesia, anestesia local o sedación",
    risksEn: ["Pain, sensitivity, gum irritation, infection or bite changes", "Damage to tooth structure, nerve injury or restoration failure", "Implant failure, bone loss or need for retreatment in complex cases"],
    risksZh: ["疼痛、敏感、牙龈刺激、感染或咬合改变", "牙体损伤、神经损伤或修复体失败", "复杂病例可能发生种植失败、骨丧失或需要再次治疗"],
    risksEs: ["Dolor, sensibilidad, irritación de encías, infección o cambios en la mordida", "Daño a la estructura dental, lesión nerviosa o falla de la restauración", "Falla del implante, pérdida ósea o necesidad de retratamiento en casos complejos"],
    discloseEn: [...sharedDisclosure.en, "Gum disease, loose teeth, jaw-joint pain, osteoporosis medication, prior radiation or poorly controlled diabetes"], discloseZh: [...sharedDisclosure.zh, "牙周病、牙齿松动、颞下颌关节疼痛、骨质疏松用药、既往放疗或控制不佳的糖尿病"], discloseEs: [...sharedDisclosure.es, "Enfermedad de encías, dientes flojos, dolor de la articulación mandibular, medicación para osteoporosis, radioterapia previa o diabetes mal controlada"],
  },
  "Skin & Non-Surgical": {
    price: "$100–$4,000", downtimeEn: "Hours to 2 weeks", downtimeZh: "数小时至 2 周", downtimeEs: "De horas a 2 semanas", finalEn: "Days to several months", finalZh: "数日至数月", finalEs: "De días a varios meses", anesthesiaEn: "None or topical/local anesthesia", anesthesiaZh: "无需麻醉或表面/局部麻醉", anesthesiaEs: "Sin anestesia o anestesia tópica/local",
    risksEn: ["Redness, swelling, bruising, burns, pigment change, infection or scarring", "Allergic reaction, nodules, asymmetry or unintended tissue injury", "Fillers can rarely block a blood vessel, causing skin loss, vision injury or stroke"],
    risksZh: ["红肿、淤青、灼伤、色素改变、感染或瘢痕", "过敏反应、结节、不对称或非预期组织损伤", "填充剂极少数情况下可阻塞血管，导致皮肤坏死、视力损伤或卒中"],
    risksEs: ["Enrojecimiento, hinchazón, moretones, quemaduras, cambio de pigmentación, infección o cicatrices", "Reacción alérgica, nódulos, asimetría o lesión tisular no intencionada", "En raras ocasiones, los rellenos pueden obstruir un vaso sanguíneo, causando pérdida de piel, daño visual o accidente cerebrovascular"],
    discloseEn: [...sharedDisclosure.en, "Active rash, acne or herpes, recent dental work, previous fillers, isotretinoin use or pigment/scarring disorders"], discloseZh: [...sharedDisclosure.zh, "活动性皮疹、痤疮或疱疹、近期牙科治疗、既往填充剂、异维 A 酸使用史或色素/瘢痕问题"], discloseEs: [...sharedDisclosure.es, "Erupción cutánea activa, acné o herpes, trabajo dental reciente, rellenos previos, uso de isotretinoína o trastornos de pigmentación/cicatrización"],
  },
};

type RichTreatment = NonNullable<ReturnType<typeof findTreatment>>;

const CatalogProcedureDetail = ({
  procedure,
  lang,
  treatment,
}: {
  procedure: { en: string; zh: string; categoryEn: string; categoryZh: string };
  lang: AsiaLang;
  treatment?: RichTreatment;
}) => {
  const { fmt } = useAsia();
  const zh = lang === "zh";
  const ru = lang === "ru";
  const es = lang === "es";
  const c = (en: string, cn: string, russian: string, spanish?: string) => zh ? cn : ru ? russian : es ? (spanish ?? en) : en;
  const name = zh ? procedure.zh : procedure.en;
  const intro = categoryCopy[procedure.categoryEn];
  const education = catalogEducation[procedure.categoryEn];
  const path = `/treatments/${procedureSlug(procedure.en)}`;
  const description = treatment
    ? (zh ? treatment.summaryZh : treatment.summaryEn)
    : (zh ? intro.zh : es ? (intro.es ?? intro.en) : intro.en);
  const planningRange = treatment
    ? `$${treatment.priceUsdLow.toLocaleString()}–$${treatment.priceUsdHigh.toLocaleString()}`
    : education.price;
  const risks = treatment
    ? (zh ? treatment.risksZh : treatment.risksEn)
    : (zh ? education.risksZh : es ? education.risksEs : education.risksEn);
  const consultationQuestions = treatment
    ? (zh ? treatment.askZh : treatment.askEn)
    : null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: `${procedure.en} in China | Procedure Overview`,
    description: treatment?.summaryEn ?? `Learn what to discuss when considering ${procedure.en} in China, including planning, provider checks, risks and next steps.`,
    about: { "@type": "MedicalProcedure", name: procedure.en },
    audience: { "@type": "Patient" },
    dateModified: "2026-08-30",
    publisher: { "@id": "https://celadonchina.com/#organization" },
  };

  return (
    <>
      <PageMeta
        title={`${procedure.en} in China | Procedure Overview`}
        description={treatment?.summaryEn ?? `Learn what to discuss when considering ${procedure.en} in China, including planning, provider checks, risks and next steps.`}
        path={path}
        structuredData={schema}
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />
        <main className="container max-w-4xl py-10 md:py-14">
          <Link to="/treatments" className="mb-7 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90">
            <ArrowLeft className="size-4" /> {c("All procedures", "全部项目", "Все процедуры", "Todos los procedimientos")}
          </Link>

          <section className="rounded-[2rem] border border-border/60 bg-card p-6 shadow-soft md:p-9">
            <span className="pill mb-3 bg-accent text-accent-foreground"><Stethoscope className="size-3.5" /> {zh ? procedure.categoryZh : procedure.categoryEn}</span>
            <h1 className="font-display text-4xl font-medium tracking-tight md:text-5xl">{name}</h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">{description}</p>
          </section>

          <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-primary/15 bg-primary/[0.045] px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p><span className="font-semibold text-foreground">Editorially researched, not medically reviewed.</span> Updated August 30, 2026.</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-semibold text-brand">
              <Link to="/medical-review-policy" className="hover:underline">Medical review policy</Link>
              <Link to="/editorial-policy" className="hover:underline">Editorial policy</Link>
            </div>
          </div>

          <section className="mt-8 rounded-[2rem] border border-border/70 bg-card p-5 shadow-soft md:p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="pill bg-accent text-accent-foreground"><Sparkles className="size-3.5" />{c("At a glance", "快速了解", "Кратко", "De un vistazo")}</span>
                <h2 className="mt-3 font-display text-3xl font-medium tracking-tight">{c("Start with the essentials", "先看关键数字", "Основные сведения", "Empieza por lo esencial")}</h2>
              </div>
              <p className="max-w-md text-xs leading-relaxed text-muted-foreground">{c("General planning ranges for China—not a hospital quote or a personal recovery promise.", "以下为中国市场的一般规划参考，不是医院报价或个人恢复承诺。", "Это общие ориентиры для Китая, а не предложение клиники или гарантия восстановления.", "Rangos generales de planificación para China, no una cotización hospitalaria ni una promesa personal de recuperación.")}</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              <QuickFact icon={<DollarSign />} label={c("Planning range", "参考价格", "Диапазон цен", "Rango de planificación")} value={planningRange} />
              <QuickFact icon={<Clock />} label={c("Typical downtime", "初步恢复", "Первичное восстановление", "Baja habitual")} value={zh ? education.downtimeZh : es ? education.downtimeEs : education.downtimeEn} />
              <QuickFact icon={<Sparkles />} label={c("Result settles", "结果逐步稳定", "Окончательный результат", "El resultado se estabiliza")} value={zh ? education.finalZh : es ? education.finalEs : education.finalEn} />
              <QuickFact icon={<Stethoscope />} label={c("Common anesthesia", "常见麻醉", "Обычная анестезия", "Anestesia habitual")} value={zh ? education.anesthesiaZh : es ? education.anesthesiaEs : education.anesthesiaEn} />
            </div>
            <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-primary/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-foreground">{c("Not sure what applies to you? Review it with a coordinator online.", "不确定哪些信息适合你？可以先和协调员在线聊一聊。", "Не уверены, что относится к вам? Обсудите это с координатором онлайн.", "¿No sabes qué aplica en tu caso? Revísalo con un coordinador en línea.")}</p>
              <Button asChild className="shrink-0 rounded-full px-5"><a href="https://wa.me/14708613825" target="_blank" rel="noreferrer">{c("Free online consultation", "免费在线咨询", "Бесплатная онлайн-консультация", "Consulta en línea gratuita")}<ArrowRight className="ml-2 size-4" /></a></Button>
            </div>
          </section>

          <section className="mt-8 overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-soft">
            <div className="border-b border-border/60 px-5 py-5 md:px-7">
              <span className="pill bg-accent text-accent-foreground"><FileCheck2 className="size-3.5" />{c("Only open what you need", "按需查看", "Откройте нужный раздел", "Abre solo lo que necesitas")}</span>
              <h2 className="mt-3 font-display text-2xl font-medium tracking-tight md:text-3xl">{c("What to review before you decide", "决定前，重点看这三项", "Что проверить перед решением", "Qué revisar antes de decidir")}</h2>
            </div>

            {treatment && (
              <ExpandablePanel
                icon={<Sparkles className="size-5 text-primary" />}
                title={c("Procedure details & recovery", "项目方式与恢复过程", "Процедура и восстановление", "Detalles del procedimiento y recuperación")}
                summary={c("Understand what it involves, common approaches and the usual recovery stages.", "了解项目内容、常见方式和通常的恢复阶段。", "Что включает процедура, основные методы и этапы восстановления.", "Entiende en qué consiste, los enfoques comunes y las etapas habituales de recuperación.")}
              >
                <div className="space-y-6 pt-1">
                  <p className="text-sm leading-relaxed text-muted-foreground">{zh ? treatment.whatZh : treatment.whatEn}</p>
                  <div>
                    <h3 className="mb-3 font-display text-lg font-medium">{c("Common techniques", "常见方式", "Основные методы", "Técnicas comunes")}</h3>
                    <Bullets items={zh ? treatment.techniquesZh : treatment.techniquesEn} />
                  </div>
                  <div>
                    <h3 className="mb-3 font-display text-lg font-medium">{c("Typical recovery", "通常恢复过程", "Типичное восстановление", "Recuperación habitual")}</h3>
                    <ol className="grid gap-3 sm:grid-cols-2">
                      {treatment.recovery.map((item, index) => (
                        <li key={index} className="rounded-2xl bg-secondary/45 p-4">
                          <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand">{zh ? item.whenZh : item.whenEn}</p>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{zh ? item.whatZh : item.whatEn}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </ExpandablePanel>
            )}

            <ExpandablePanel icon={<ShieldAlert className="size-5 text-destructive/75" />} title={c("Risks to understand", "可能有哪些风险？", "Важные риски", "Riesgos que debes entender")} summary={c("See the main complications to discuss with your surgeon.", "查看需要与专家重点确认的主要并发症。", "Основные осложнения, которые стоит обсудить с хирургом.", "Consulta las principales complicaciones a comentar con tu cirujano.")}>
              <div className="mt-4"><Bullets items={risks} /></div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{zh ? "这不是完整风险清单。风险会随具体术式、麻醉方式、治疗范围和个人健康状况改变。" : "This is not a complete risk list. Risk changes with technique, anesthesia, treatment extent and your health."}</p>
            </ExpandablePanel>

            <ExpandablePanel icon={<HeartPulse className="size-5 text-primary" />} title={c("What should I tell the expert?", "哪些情况必须提前告诉专家？", "Что сообщить эксперту заранее?", "¿Qué debo decirle al experto?")} summary={c("Medical conditions, medication and previous treatment can change your plan.", "疾病、用药和既往治疗都可能影响方案。", "Заболевания, лекарства и прошлое лечение могут изменить план.", "Las condiciones médicas, la medicación y tratamientos previos pueden cambiar tu plan.")}>
              <div className="mt-4"><Bullets items={zh ? education.discloseZh : es ? education.discloseEs : education.discloseEn} /></div>
              <p className="mt-4 flex gap-2 text-xs font-medium leading-relaxed text-foreground"><Pill className="mt-0.5 size-4 shrink-0 text-primary" />{zh ? "不要自行停药。是否暂停或调整药物，必须由开药专家、手术专家或麻醉专家决定。" : "Do not stop medication on your own. Any change must be directed by the prescribing expert, surgeon or anesthesiologist."}</p>
            </ExpandablePanel>

            <ExpandablePanel icon={<CircleHelp className="size-5 text-primary" />} title={c("Questions for your consultation", "面诊时问什么？", "Вопросы для консультации", "Preguntas para tu consulta")} summary={c("Save six practical questions for your expert.", "准备好 6 个实用问题，避免面诊时遗漏。", "Сохраните шесть практических вопросов эксперту.", "Guarda seis preguntas prácticas para tu experto.")}>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {(consultationQuestions ?? (zh ? [
                `您做过多少例与我的情况相似的 ${procedure.zh}？`,
                "推荐的具体术式是什么？为什么适合我？是否有替代方案？",
                "完整费用包含什么？麻醉、检查、复诊和并发症处理是否另收费？",
                "我应在中国停留多久？出现哪些症状需要立即就医？",
                "谁负责麻醉和术后随访？回国后出现问题如何联系？",
                "能否查看未经滤镜、与我情况相近且已获授权的真实案例？",
              ] : [
                `How many ${procedure.en} cases similar to mine have you performed?`,
                "Which exact technique do you recommend, why, and what are the alternatives?",
                "What does the total fee include—anesthesia, tests, follow-ups and complication care?",
                "How long should I stay in China, and which symptoms require urgent care?",
                "Who provides anesthesia and follow-up care, including after I return home?",
                "May I review unfiltered, consented cases with anatomy similar to mine?",
              ])).map((question, index) => (
                <div key={question} className="flex gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 text-sm leading-relaxed">
                  <span className="font-mono text-xs font-bold text-primary">{String(index + 1).padStart(2, "0")}</span><span>{question}</span>
                </div>
              ))}
            </div>
            </ExpandablePanel>
          </section>

          <ProcedureVideoRow procedure={`${procedure.en} ${procedure.categoryEn}`} lang={lang} fmt={fmt} />

          <section className="mt-8 rounded-3xl bg-muted/45 p-6 md:p-8">
            <h2 className="font-display text-2xl font-medium tracking-tight">{c("Next: get a plan built around you", "下一步：获取适合你的方案", "Следующий шаг: персональный план", "Siguiente paso: un plan hecho para ti")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {zh ? "这是一份一般性项目介绍，不构成医疗建议。具体方案、价格与恢复期只能在专家评估后确定。" : "This is a general overview, not medical advice. Technique, price and recovery can only be confirmed after a expert evaluates you."}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="rounded-full px-6"><Link to="/doctors">{c("Explore doctors", "查看专家", "Смотреть экспертов", "Explorar expertos")}<ArrowRight className="ml-2 size-4" /></Link></Button>
              <Button asChild variant="outline" className="rounded-full px-6"><Link to="/travel-packages">{c("View travel support", "查看行程支持", "Поддержка поездки", "Ver apoyo de viaje")}</Link></Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

const QuickFact = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-2xl bg-secondary/55 p-4 md:p-5">
    <span className="text-primary [&>svg]:size-4">{icon}</span>
    <p className="mt-3 text-label font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
    <p className="mt-1 text-sm font-semibold leading-snug text-foreground md:text-base">{value}</p>
  </div>
);

const ExpandablePanel = ({
  icon,
  title,
  summary,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  summary: string;
  children: React.ReactNode;
}) => (
  <details className="group border-b border-border/60 last:border-b-0">
    <summary className="flex cursor-pointer list-none items-start gap-4 px-5 py-5 transition-colors hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:items-center md:px-7 [&::-webkit-details-marker]:hidden">
      <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/[0.08] md:mt-0">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-xl font-medium tracking-tight">{title}</span>
        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{summary}</span>
      </span>
      <ChevronDown className="mt-2 size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180 md:mt-0" />
    </summary>
    <div className="px-5 pb-6 md:px-7 md:pl-[5.5rem]">{children}</div>
  </details>
);

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

const ProcedureVideoRow = ({ procedure, lang, fmt }: { procedure: string; lang: AsiaLang; fmt: (cny: number) => string }) => {
  const zh = lang === "zh";
  const ru = lang === "ru";
  const es = lang === "es";
  const c = (en: string, cn: string, russian: string, spanish?: string) => zh ? cn : ru ? russian : es ? (spanish ?? en) : en;
  const items = getRelatedCases(procedure);
  return (
    <section className="mt-10 border-t border-border/60 pt-9">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="pill bg-accent text-accent-foreground">{c("Real case videos", "真实案例", "Видео реальных случаев", "Videos de casos reales")}</span>
          <h2 className="mt-3 font-display text-2xl font-medium tracking-tight md:text-3xl">
            {c("Watch related recovery diaries", "观看相关恢复短视频", "Смотрите дневники восстановления", "Ver diarios de recuperación relacionados")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{c("Swipe to explore patient journeys and recovery updates.", "左右滑动查看更多案例与恢复过程。", "Листайте, чтобы увидеть больше историй пациентов.", "Desliza para ver más historias de pacientes y actualizaciones de recuperación.")}</p>
        </div>
        <Button asChild variant="outline" className="w-fit rounded-full">
          <Link to="/cases">{c("View all cases", "查看全部案例", "Все случаи", "Ver todos los casos")}<ArrowRight className="ml-2 size-4" /></Link>
        </Button>
      </div>
      <TikTokWall items={items} lang={lang} fmtPrice={fmt} variant="wall" />
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

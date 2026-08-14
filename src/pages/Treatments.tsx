import { Link } from "react-router-dom";
import { BookOpen, Clock, ShieldAlert, Sparkles } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { TREATMENTS } from "@/data/treatments";
import { useAsia } from "@/lib/asia-i18n";
import { MEDICAL_DISCLAIMER } from "@/lib/seo-config";
import procedureRhinoplasty from "@/assets/treatment-rhinoplasty.jpg";
import procedureFacelift from "@/assets/treatment-facelift.jpg";
import procedureNeckLift from "@/assets/treatment-neck-lift.jpg";
import procedureEyelid from "@/assets/treatment-eyelid.jpg";
import procedureFatGrafting from "@/assets/treatment-fat-grafting.jpg";
import procedureLiposuction from "@/assets/treatment-liposuction.jpg";
import procedureTummyTuck from "@/assets/treatment-tummy-tuck.jpg";
import procedureBbl from "@/assets/treatment-bbl.jpg";
import procedureBreastAugmentation from "@/assets/treatment-breast-augmentation.jpg";
import procedureBreastLift from "@/assets/treatment-breast-lift.jpg";
import procedureBodyContouring from "@/assets/treatment-body-contouring.jpg";

export const PROCEDURE_CATEGORIES = [
  {
    en: "Nose",
    zh: "鼻部整形",
    items: [
      ["Rhinoplasty", "鼻综合"],
      ["Revision Rhinoplasty", "鼻修复"],
      ["Septorhinoplasty", "功能性鼻整形"],
      ["Alar Base Reduction", "鼻翼缩小"],
      ["Nasal Tip Surgery", "鼻尖塑形"],
    ],
  },
  {
    en: "Eyes",
    zh: "眼部整形",
    items: [
      ["Double Eyelid Surgery", "双眼皮"],
      ["Upper Blepharoplasty", "上睑成形"],
      ["Lower Blepharoplasty", "下睑成形"],
      ["Ptosis Correction", "上睑下垂矫正"],
      ["Epicanthoplasty", "内眼角成形"],
      ["Under-Eye Fat Repositioning", "眶隔脂肪重置"],
    ],
  },
  {
    en: "Face & Contour",
    zh: "面部轮廓",
    items: [
      ["Chin Augmentation", "下巴塑形"],
      ["Genioplasty", "颏成形"],
      ["Jaw Contouring", "下颌角整形"],
      ["Zygoma Reduction", "颧骨降低"],
      ["Facial Fat Grafting", "面部脂肪填充"],
      ["Otoplasty", "耳廓整形"],
    ],
  },
  {
    en: "Facial Rejuvenation",
    zh: "面部年轻化",
    items: [
      ["Facelift", "面部拉皮"],
      ["Neck Lift", "颈部提升"],
      ["Brow Lift", "眉提升"],
      ["Deep-Plane Facelift", "深层平面拉皮"],
      ["Mini Facelift", "小切口拉皮"],
      ["Lip Lift", "唇提升"],
    ],
  },
  {
    en: "Breast",
    zh: "胸部整形",
    items: [
      ["Breast Augmentation", "隆胸"],
      ["Breast Lift", "乳房提升"],
      ["Breast Reduction", "乳房缩小"],
      ["Implant Revision", "假体修复与更换"],
      ["Implant Removal", "假体取出"],
      ["Male Breast Reduction", "男性乳房缩小"],
    ],
  },
  {
    en: "Body Contouring",
    zh: "身体塑形",
    items: [
      ["Liposuction", "吸脂"],
      ["Tummy Tuck", "腹壁成形"],
      ["Arm Lift", "上臂提升"],
      ["Thigh Lift", "大腿提升"],
      ["Body Lift", "环形身体提升"],
      ["Fat Transfer", "自体脂肪移植"],
      ["Mommy Makeover", "产后综合塑形"],
    ],
  },
  {
    en: "Hair Restoration",
    zh: "植发与毛发管理",
    items: [
      ["FUE Hair Transplant", "FUE 毛囊单位提取植发"],
      ["FUT Hair Transplant", "FUT 毛囊单位移植"],
      ["Hairline Restoration", "发际线种植"],
      ["Crown Restoration", "头顶加密"],
      ["Eyebrow Transplant", "眉毛种植"],
      ["Beard Transplant", "胡须种植"],
    ],
  },
  {
    en: "Cosmetic Dentistry",
    zh: "口腔与牙齿美容",
    items: [
      ["Dental Implants", "种植牙"],
      ["Porcelain Veneers", "瓷贴面"],
      ["All-Ceramic Crowns", "全瓷牙冠"],
      ["Teeth Whitening", "牙齿美白"],
      ["Clear Aligners", "隐形矫正"],
      ["Full-Mouth Reconstruction", "全口重建"],
    ],
  },
  {
    en: "Skin & Non-Surgical",
    zh: "皮肤与非手术项目",
    items: [
      ["Laser Skin Resurfacing", "激光皮肤重塑"],
      ["Pigmentation Treatment", "色斑治疗"],
      ["Acne Scar Treatment", "痘疤治疗"],
      ["RF Microneedling", "射频微针"],
      ["Ultrasound Skin Tightening", "超声紧肤"],
      ["Botulinum Toxin", "肉毒素治疗"],
      ["Dermal Fillers", "皮肤填充剂"],
      ["Regenerative Skin Treatments", "再生类皮肤治疗"],
    ],
  },
] as const;

export const procedureSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const CATEGORY_IMAGES = [
  [procedureRhinoplasty, procedureNeckLift, procedureFacelift, procedureEyelid, procedureFatGrafting],
  [procedureEyelid, procedureFatGrafting, procedureRhinoplasty, procedureFacelift, procedureNeckLift],
  [procedureFatGrafting, procedureNeckLift, procedureRhinoplasty, procedureFacelift, procedureEyelid],
  [procedureFacelift, procedureNeckLift, procedureFatGrafting, procedureRhinoplasty, procedureEyelid],
  [procedureBreastAugmentation, procedureBreastLift, procedureBodyContouring, procedureFatGrafting],
  [procedureLiposuction, procedureTummyTuck, procedureBbl, procedureBodyContouring],
  [procedureRhinoplasty, procedureFacelift, procedureNeckLift, procedureEyelid],
  [procedureNeckLift, procedureFacelift, procedureEyelid, procedureFatGrafting],
  [procedureEyelid, procedureFatGrafting, procedureFacelift, procedureRhinoplasty],
] as const;

const Treatments = () => {
  const { lang } = useAsia();
  const zh = lang === "zh";

  return (
    <>
      <PageMeta
        title="Cosmetic Procedures in China | Surgery Types & Guides"
        description="Explore cosmetic procedures in China, including plastic surgery, hair restoration, cosmetic dentistry, skin and non-surgical treatments, with detailed recovery and risk guides."
        path="/treatments"
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />

        <section className="container py-12 md:py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="pill bg-accent text-accent-foreground mb-3">
              <BookOpen className="size-3.5" /> {zh ? "项目科普" : "Procedure guides"}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
              {zh ? "中国医美手术" : "Cosmetic procedures"}{" "}
              <em className="text-primary not-italic">{zh ? "项目大全" : "in China"}</em>
            </h1>
            <p className="mt-4 text-muted-foreground">
              {zh
                ? "查看整形手术、植发、牙齿美容、皮肤及非手术项目。已完成的深度指南会写清恢复时间、真实风险和面诊问题。"
                : "Explore surgery, hair restoration, cosmetic dentistry, skin and non-surgical care—then open our completed guides for recovery timelines, candid risks and consultation questions."}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PROCEDURE_CATEGORIES.map((category, categoryIndex) => (
              <section key={category.en} className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
                <div className="flex items-center gap-2">
                  <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary"><Sparkles className="size-4" /></span>
                  <h2 className="font-display text-xl font-medium tracking-tight">{zh ? category.zh : category.en}</h2>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  {category.items.map(([en, cn], itemIndex) => (
                    <Link to={`/treatments/${procedureSlug(en)}`} key={en} className="group relative min-h-20 overflow-hidden rounded-2xl border border-white/10 bg-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      <img
                        src={CATEGORY_IMAGES[categoryIndex][itemIndex % CATEGORY_IMAGES[categoryIndex].length]}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                      <p className="absolute inset-x-0 bottom-0 p-3 text-xs font-semibold leading-snug text-white">
                        {zh ? cn : en}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mb-6 mt-14 text-center">
            <span className="pill mb-3 bg-accent text-accent-foreground"><BookOpen className="size-3.5" /> {zh ? "深度项目指南" : "In-depth procedure guides"}</span>
            <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
              {zh ? "先看懂，" : "Understand it first, "}<em className="text-primary not-italic">{zh ? "再决定" : "then decide"}</em>
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TREATMENTS.map((t) => (
              <Link
                key={t.slug}
                to={`/treatments/${t.slug}`}
                className="group rounded-2xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/50"
              >
                <h2 className="font-display text-xl font-medium tracking-tight group-hover:text-primary transition-colors">
                  {zh ? t.zh : t.en}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {zh ? t.summaryZh : t.summaryEn}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3" />
                    {t.recovery.length} {zh ? "个恢复阶段" : "recovery stages"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ShieldAlert className="size-3" />
                    {t.risksEn.length} {zh ? "项风险说明" : "risks listed"}
                  </span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {zh ? "参考区间" : "Typical range"} ${t.priceUsdLow.toLocaleString()}–$
                  {t.priceUsdHigh.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>

          <p className="mt-10 mx-auto max-w-3xl text-center text-xs text-muted-foreground leading-relaxed">
            {zh
              ? "以上内容为一般性医学科普，不构成诊疗建议。每个人的解剖条件、既往病史与用药情况不同，任何决定都应以面诊后执业医师的意见为准。"
              : MEDICAL_DISCLAIMER}
          </p>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Treatments;

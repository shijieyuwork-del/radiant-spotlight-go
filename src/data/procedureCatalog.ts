export const PROCEDURE_CATEGORIES = [
  {
    en: "Nose", zh: "鼻部整形", items: [
      ["Rhinoplasty", "鼻综合"], ["Revision Rhinoplasty", "鼻修复"],
      ["Septorhinoplasty", "功能性鼻整形"], ["Alar Base Reduction", "鼻翼缩小"],
      ["Nasal Tip Surgery", "鼻尖塑形"],
    ],
  },
  {
    en: "Eyes", zh: "眼部整形", items: [
      ["Double Eyelid Surgery", "双眼皮"], ["Upper Blepharoplasty", "上睑成形"],
      ["Lower Blepharoplasty", "下睑成形"], ["Ptosis Correction", "上睑下垂矫正"],
      ["Epicanthoplasty", "内眼角成形"], ["Under-Eye Fat Repositioning", "眶隔脂肪重置"],
    ],
  },
  {
    en: "Face & Contour", zh: "面部轮廓", items: [
      ["Chin Augmentation", "下巴塑形"], ["Genioplasty", "颏成形"],
      ["Jaw Contouring", "下颌角整形"], ["Zygoma Reduction", "颧骨降低"],
      ["Facial Fat Grafting", "面部脂肪填充"], ["Otoplasty", "耳廓整形"],
    ],
  },
  {
    en: "Facial Rejuvenation", zh: "面部年轻化", items: [
      ["Facelift", "面部拉皮"], ["Neck Lift", "颈部提升"], ["Brow Lift", "眉提升"],
      ["Deep-Plane Facelift", "深层平面拉皮"], ["Mini Facelift", "小切口拉皮"], ["Lip Lift", "唇提升"],
    ],
  },
  {
    en: "Breast", zh: "胸部整形", items: [
      ["Breast Augmentation", "隆胸"], ["Breast Lift", "乳房提升"],
      ["Breast Reduction", "乳房缩小"], ["Implant Revision", "假体修复与更换"],
      ["Implant Removal", "假体取出"], ["Male Breast Reduction", "男性乳房缩小"],
    ],
  },
  {
    en: "Body Contouring", zh: "身体塑形", items: [
      ["Liposuction", "吸脂"], ["Tummy Tuck", "腹壁成形"], ["Arm Lift", "上臂提升"],
      ["Thigh Lift", "大腿提升"], ["Body Lift", "环形身体提升"], ["Fat Transfer", "自体脂肪移植"],
      ["Mommy Makeover", "产后综合塑形"],
    ],
  },
  {
    en: "Hair Restoration", zh: "植发与毛发管理", items: [
      ["FUE Hair Transplant", "FUE 毛囊单位提取植发"], ["FUT Hair Transplant", "FUT 毛囊单位移植"],
      ["Hairline Restoration", "发际线种植"], ["Crown Restoration", "头顶加密"],
      ["Eyebrow Transplant", "眉毛种植"], ["Beard Transplant", "胡须种植"],
    ],
  },
  {
    en: "Cosmetic Dentistry", zh: "口腔与牙齿美容", items: [
      ["Dental Implants", "种植牙"], ["Porcelain Veneers", "瓷贴面"],
      ["All-Ceramic Crowns", "全瓷牙冠"], ["Teeth Whitening", "牙齿美白"],
      ["Clear Aligners", "隐形矫正"], ["Full-Mouth Reconstruction", "全口重建"],
    ],
  },
  {
    en: "Skin & Non-Surgical", zh: "皮肤与非手术项目", items: [
      ["Laser Skin Resurfacing", "激光皮肤重塑"], ["Pigmentation Treatment", "色斑治疗"],
      ["Acne Scar Treatment", "痘疤治疗"], ["RF Microneedling", "射频微针"],
      ["Ultrasound Skin Tightening", "超声紧肤"], ["Botulinum Toxin", "肉毒素治疗"],
      ["Dermal Fillers", "皮肤填充剂"], ["Regenerative Skin Treatments", "再生类皮肤治疗"],
    ],
  },
] as const;

export const procedureSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const PROCEDURE_CATALOG = PROCEDURE_CATEGORIES.flatMap((category) =>
  category.items.map(([en, zh]) => ({
    en,
    zh,
    categoryEn: category.en,
    categoryZh: category.zh,
    slug: procedureSlug(en),
  })),
);

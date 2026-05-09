import v2 from "@/assets/video2.jpg";
import v3 from "@/assets/video3.jpg";
import v4 from "@/assets/video4.jpg";
import v5 from "@/assets/video5.jpg";
import v6 from "@/assets/video6.jpg";

export type Doctor = {
  id: string;
  zh: string; en: string;
  titleZh: string; titleEn: string;
  clinicZh: string; clinicEn: string;
  cityZh: string; cityEn: string;
  img: string;
  license: string;
  qualZh: string; qualEn: string;
  years: number;
  surgeries: string;
  rating: number;
  reviews: number;
  specZh: string[]; specEn: string[];
  /** Bilingual rich biography */
  bioZh: string; bioEn: string;
  /** Education / fellowship lines */
  eduZh: string[]; eduEn: string[];
  /** Awards / recognitions */
  awardsZh: string[]; awardsEn: string[];
  /** Languages spoken */
  languages: string[];
  /** Reference prices (CNY) keyed by treatment EN name from TIKTOK_CASES */
  priceList: { en: string; zh: string; from: number }[];
  /** TIKTOK_CASES.id this surgeon performed */
  caseIds: string[];
};

export const DOCTORS: Doctor[] = [
  {
    id: "li-wenzhi",
    zh: "李文志 主任医师", en: "Dr. Li Wenzhi · Chief Surgeon",
    titleZh: "整形外科 副主任", titleEn: "Deputy Director, Plastic Surgery",
    clinicZh: "上海华美医疗美容医院", clinicEn: "Shanghai Huamei Plastic Surgery Hospital",
    cityZh: "上海", cityEn: "Shanghai",
    img: v4, license: "1413010320180123456",
    qualZh: "卫健委主诊医师 · 中华医学会整形外科学分会会员",
    qualEn: "NHC Attending Surgeon · Member, Chinese Society of Plastic Surgery",
    years: 22, surgeries: "8,200+", rating: 4.96, reviews: 1842,
    specZh: ["双眼皮 / 眼袋", "鼻综合", "颈部提升"],
    specEn: ["Blepharoplasty", "Rhinoplasty", "Neck Lift"],
    bioZh:
      "李文志主任专注眼周与鼻部整形 22 年，主刀超过 8,200 台手术。师从中国医学科学院整形外科医院归来教授，长期为高净值与海外回国客户提供个性化方案，强调「以解剖为依据、以审美为目标」。",
    bioEn:
      "Dr. Li specializes in periorbital and nasal surgery with 22 years of experience and 8,200+ procedures. Trained under Prof. Gui Lai at PUMC Plastic Surgery Hospital, he is sought after by international and returning clients for naturalistic results that respect deep-tissue anatomy.",
    eduZh: ["上海交通大学医学院 临床医学硕士", "美国 Mayo Clinic 颅颌面整形访问学者 (2016)"],
    eduEn: ["MD, Shanghai Jiao Tong University School of Medicine", "Visiting Scholar, Mayo Clinic Craniomaxillofacial Surgery (2016)"],
    awardsZh: ["新氧 2023 年度鼻综合金奖", "上海市整形外科优秀中青年医师"],
    awardsEn: ["SoYoung 2023 Rhinoplasty Gold Award", "Shanghai Outstanding Young Plastic Surgeon"],
    languages: ["中文 / Chinese", "English"],
    priceList: [
      { en: "Blepharoplasty (upper + lower)", zh: "双眼皮 / 眼袋", from: 12800 },
      { en: "Rhinoplasty", zh: "鼻综合", from: 22800 },
      { en: "Neck Lift", zh: "颈部提升", from: 68000 },
    ],
    caseIds: ["blepharoplasty-shanghai", "necklift-shanghai", "bbl-shanghai"],
  },
  {
    id: "wang-xiaolin",
    zh: "王晓琳 主任医师", en: "Dr. Wang Xiaolin · Chief Surgeon",
    titleZh: "整形外科 主任", titleEn: "Director, Plastic Surgery",
    clinicZh: "北京艺星医疗美容医院", clinicEn: "Beijing Yestar Aesthetic Hospital",
    cityZh: "北京", cityEn: "Beijing",
    img: v2, license: "1411010520190234567",
    qualZh: "卫健委主诊医师 · 美国整形外科学会(ASPS)国际会员",
    qualEn: "NHC Attending · ASPS International Member (USA)",
    years: 16, surgeries: "6,400+", rating: 4.94, reviews: 1521,
    specZh: ["鼻综合", "鼻修复", "提胸"],
    specEn: ["Rhinoplasty", "Rhino Revision", "Breast Lift"],
    bioZh:
      "王晓琳主任为北京艺星整形外科主任，专注亚洲鼻部美学与女性形体重塑。曾于美国 Manhattan Eye, Ear & Throat Hospital 进修鼻整形修复，主导制定艺星「三段式肋软骨鼻综合」标准术式。",
    bioEn:
      "Dr. Wang heads plastic surgery at Beijing Yestar, focusing on Asian nasal aesthetics and female body restoration. She completed a revision rhinoplasty fellowship at Manhattan Eye, Ear & Throat Hospital (NYC) and authored Yestar's three-stage costal-cartilage rhinoplasty protocol.",
    eduZh: ["北京协和医学院 整形外科博士", "纽约 MEETH 鼻整形修复研修 (2019)"],
    eduEn: ["PhD, Plastic Surgery, Peking Union Medical College", "Revision Rhinoplasty Fellowship, MEETH New York (2019)"],
    awardsZh: ["ASPS 国际会员", "北京市整形美容协会 鼻整形分会副主委"],
    awardsEn: ["ASPS International Member", "Vice Chair, Rhinoplasty Branch, Beijing PSA"],
    languages: ["中文 / Chinese", "English", "한국어"],
    priceList: [
      { en: "Rhinoplasty", zh: "鼻综合", from: 22800 },
      { en: "Breast Lift", zh: "提胸", from: 72000 },
    ],
    caseIds: ["rhinoplasty-beijing", "breast-lift-beijing"],
  },
  {
    id: "chen-jiahao",
    zh: "陈嘉豪 副主任医师", en: "Dr. Chen Jiahao · Associate Chief",
    titleZh: "整形外科 主任", titleEn: "Director, Plastic Surgery",
    clinicZh: "成都美莱医学美容医院", clinicEn: "Chengdu Meilai Medical Aesthetic Hospital",
    cityZh: "成都", cityEn: "Chengdu",
    img: v3, license: "1415103200170345678",
    qualZh: "卫健委主诊医师 · 韩国 BK 医院研修",
    qualEn: "NHC Attending · Trained at BK Hospital, Korea",
    years: 18, surgeries: "5,400+", rating: 4.92, reviews: 1287,
    specZh: ["面部拉皮 (SMAS)", "全身体形雕塑", "脂肪填充"],
    specEn: ["Facelift (SMAS)", "Body Contouring", "Facial Fat Grafting"],
    bioZh:
      "陈嘉豪医生擅长 SMAS 与深层除皱拉皮、360° 体形雕塑，曾长期在韩国 BK 整形医院担任主刀医师，回国后为成都美莱建立「面颈一体化年轻化中心」。",
    bioEn:
      "Dr. Chen is a specialist in SMAS / deep-plane facelift and 360° body contouring. After serving as a senior surgeon at BK Plastic Surgery (Seoul), he founded Chengdu Meilai's Face & Neck Rejuvenation Center.",
    eduZh: ["四川大学华西临床医学院 硕士", "韩国 BK 整形医院 主刀研修 (2014–2017)"],
    eduEn: ["MMed, West China School of Medicine, Sichuan University", "Senior Surgeon Fellowship, BK Plastic Surgery, Seoul (2014–2017)"],
    awardsZh: ["新氧 2022 年度抗衰金奖", "四川省整形美容协会理事"],
    awardsEn: ["SoYoung 2022 Anti-aging Gold Award", "Director, Sichuan Aesthetic Plastic Surgery Association"],
    languages: ["中文 / Chinese", "English", "한국어"],
    priceList: [
      { en: "Facelift (SMAS)", zh: "面部拉皮 (SMAS)", from: 88000 },
      { en: "Body Contouring", zh: "全身体形雕塑", from: 128000 },
      { en: "Facial Fat Grafting", zh: "面部脂肪填充", from: 26800 },
    ],
    caseIds: ["facelift-chengdu", "body-contouring-chengdu", "fat-grafting-90d"],
  },
  {
    id: "zhao-mei",
    zh: "赵梅 主任医师", en: "Dr. Zhao Mei · Chief Surgeon",
    titleZh: "胸部整形中心 主任", titleEn: "Director, Breast Surgery Center",
    clinicZh: "广州曙光医疗美容门诊部", clinicEn: "Guangzhou Shuguang Aesthetic Clinic",
    cityZh: "广州", cityEn: "Guangzhou",
    img: v5, license: "1414401050190567890",
    qualZh: "卫健委主诊医师 · Motiva 全球认证医师",
    qualEn: "NHC Attending · Motiva Global Certified Surgeon",
    years: 19, surgeries: "4,800+", rating: 4.93, reviews: 1106,
    specZh: ["隆胸 (Motiva)", "吸脂塑形", "巴西提臀 (BBL)"],
    specEn: ["Breast Augmentation (Motiva)", "Liposuction", "BBL"],
    bioZh:
      "赵梅主任为华南最早一批 Motiva 全球认证医师之一，主导曙光胸部整形中心，累计完成隆胸 / 巴西提臀超 4,800 例，主推「双平面 + 内窥镜」精准入路。",
    bioEn:
      "Dr. Zhao is among the earliest Motiva Global Certified surgeons in southern China. She runs Shuguang's Breast Surgery Center with 4,800+ augmentation/BBL cases, championing the dual-plane endoscopic approach for natural feel and minimal scarring.",
    eduZh: ["中山大学医学院 整形外科硕士", "巴西 Dr. Praga 体形雕塑工作坊认证"],
    eduEn: ["MMed, Sun Yat-sen University School of Medicine", "Certified, Dr. Praga Body Sculpting Workshop, Brazil"],
    awardsZh: ["Motiva Round Table 中国区讲师", "广东省美容外科分会常委"],
    awardsEn: ["Motiva Round Table China Faculty", "Standing Committee, Guangdong Aesthetic Surgery Society"],
    languages: ["中文 / Chinese", "English", "Português (basic)"],
    priceList: [
      { en: "Breast Augmentation (Motiva)", zh: "隆胸 (Motiva)", from: 88000 },
      { en: "Liposuction", zh: "吸脂塑形", from: 32000 },
      { en: "BBL", zh: "巴西提臀", from: 96000 },
    ],
    caseIds: ["breast-aug-guangzhou", "liposuction-guangzhou"],
  },
  {
    id: "lin-haoran",
    zh: "林浩然 副主任医师", en: "Dr. Lin Haoran · Associate Chief",
    titleZh: "形体整形中心 主任", titleEn: "Director, Body Contouring Center",
    clinicZh: "深圳鹏程医疗美容医院", clinicEn: "Shenzhen Pengcheng Aesthetic Hospital",
    cityZh: "深圳", cityEn: "Shenzhen",
    img: v6, license: "1414403040180678912",
    qualZh: "卫健委主诊医师 · 美国 ASAPS 国际会员",
    qualEn: "NHC Attending · ASAPS International Member (USA)",
    years: 14, surgeries: "3,600+", rating: 4.9, reviews: 942,
    specZh: ["腹壁整形 (Tummy Tuck)", "巴西提臀 (BBL)", "吸脂塑形"],
    specEn: ["Tummy Tuck", "BBL", "Liposuction"],
    bioZh:
      "林浩然医生为深圳鹏程形体整形中心主任，专注产后修复（Mommy Makeover）与 BBL，提供从腹壁整形到 360° 吸脂的一站式方案，帮助每年逾 400 位海外华人妈妈完成形体重塑。",
    bioEn:
      "Dr. Lin leads Shenzhen Pengcheng's Body Contouring Center, specializing in mommy makeover and BBL. He delivers an end-to-end pathway from abdominoplasty to 360° lipo, supporting 400+ overseas Chinese mothers per year.",
    eduZh: ["南方医科大学 整形外科硕士", "美国 Miami Aesthetic 形体雕塑研修 (2018)"],
    eduEn: ["MMed, Plastic Surgery, Southern Medical University", "Body Sculpting Fellowship, Miami Aesthetic Surgery Institute (2018)"],
    awardsZh: ["ASAPS 国际会员", "深圳市医学会美容外科分会委员"],
    awardsEn: ["ASAPS International Member", "Committee Member, Shenzhen Aesthetic Surgery Society"],
    languages: ["中文 / Chinese", "English"],
    priceList: [
      { en: "Tummy Tuck", zh: "腹壁整形 (Tummy Tuck)", from: 78000 },
      { en: "BBL", zh: "巴西提臀 (BBL)", from: 96000 },
      { en: "Liposuction", zh: "吸脂塑形", from: 32000 },
    ],
    caseIds: ["tummy-tuck-shenzhen"],
  },
  {
    id: "xu-jingyi",
    zh: "徐婧怡 主治医师", en: "Dr. Xu Jingyi · Attending",
    titleZh: "面部年轻化中心 副主任", titleEn: "Deputy Director, Facial Rejuvenation Center",
    clinicZh: "杭州时光医疗美容医院", clinicEn: "Hangzhou Shiguang Aesthetic Hospital",
    cityZh: "杭州", cityEn: "Hangzhou",
    img: v3, license: "1413301060200789013",
    qualZh: "卫健委主诊医师 · 中华整形外科学分会青年委员",
    qualEn: "NHC Attending · Young Committee Member, CSPS",
    years: 11, surgeries: "2,800+", rating: 4.89, reviews: 612,
    specZh: ["面部脂肪填充", "颈部提升", "面部拉皮 (SMAS)"],
    specEn: ["Facial Fat Grafting", "Neck Lift", "Facelift (SMAS)"],
    bioZh:
      "徐婧怡医生致力于面部脂肪移植与颈部年轻化，提倡「自体脂肪 + SMAS 提升」组合方案，避免过度填充导致的「馒化」效果。",
    bioEn:
      "Dr. Xu focuses on autologous fat grafting and neck rejuvenation. She combines fat transfer with SMAS lifting to avoid the over-filled \"pillow face\" common in single-modality approaches.",
    eduZh: ["浙江大学医学院 临床医学硕士", "巴黎 Dr. Coleman 脂肪移植工作坊认证"],
    eduEn: ["MMed, Zhejiang University School of Medicine", "Certified, Dr. Coleman Fat Grafting Workshop, Paris"],
    awardsZh: ["CSPS 青年委员", "新氧 2024 年度脂肪移植潜力奖"],
    awardsEn: ["CSPS Young Committee Member", "SoYoung 2024 Fat Grafting Rising Talent"],
    languages: ["中文 / Chinese", "English", "Français (basic)"],
    priceList: [
      { en: "Facial Fat Grafting", zh: "面部脂肪填充", from: 26800 },
      { en: "Neck Lift", zh: "颈部提升", from: 68000 },
    ],
    caseIds: ["fat-grafting-90d"],
  },
];

export const findDoctor = (id: string) => DOCTORS.find((d) => d.id === id);

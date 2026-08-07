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
    id: "kim-minsoo",
    zh: "金珉秀 院长", en: "Dr. Kim Min-soo · Director",
    titleZh: "整形外科 院长", titleEn: "Director, Plastic Surgery",
    clinicZh: "ID 整形医院", clinicEn: "ID Hospital",
    cityZh: "首尔", cityEn: "Seoul",
    img: v4, license: "KR-PS-04129",
    qualZh: "韩国整形外科医师会 (KAPS) 正式会员 · 大韩美容整形外科学会 (KSPRS) 会员",
    qualEn: "Member, Korean Association of Plastic Surgeons (KAPS) · KSPRS",
    years: 18, surgeries: "6,800+", rating: 4.95, reviews: 1624,
    specZh: ["双眼皮 / 眼袋", "鼻综合", "面部轮廓"],
    specEn: ["Blepharoplasty", "Rhinoplasty", "Facial Contouring"],
    bioZh:
      "金珉秀院长在首尔江南区执业 18 年，专攻亚洲人眼鼻整形与面部轮廓优化。曾为多国演艺人士与海外求美者主刀，强调「自然、耐看、可逆」的亚洲美学。",
    bioEn:
      "Dr. Kim has practiced in Gangnam, Seoul for 18 years, specializing in Asian blepharoplasty, rhinoplasty and facial contouring. He has operated on performers and international patients, favoring natural, ageless and reversible outcomes.",
    eduZh: ["首尔大学医学院 医学博士", "美国 UT Southwestern 面部整形访问学者 (2012)"],
    eduEn: ["MD, Seoul National University College of Medicine", "Visiting Scholar, UT Southwestern Facial Plastic Surgery (2012)"],
    awardsZh: ["2019 韩国消费者大奖 眼整形部门", "ID Hospital 首席眼鼻专家"],
    awardsEn: ["2019 Korea Consumer Award · Eye Surgery Category", "Chief Eye & Nose Specialist, ID Hospital"],
    languages: ["한국어 / Korean", "English", "中文 / Chinese"],
    priceList: [
      { en: "Blepharoplasty (upper + lower)", zh: "双眼皮 / 眼袋", from: 12800 },
      { en: "Rhinoplasty", zh: "鼻综合", from: 22800 },
    ],
    caseIds: ["blepharoplasty-shanghai", "rhinoplasty-beijing"],
  },
  {
    id: "park-sooyoung",
    zh: "朴秀荣 院长", en: "Dr. Park Soo-young · Director",
    titleZh: "面部年轻化中心 院长", titleEn: "Director, Facial Rejuvenation Center",
    clinicZh: "BK 整形医院", clinicEn: "BK Plastic Surgery",
    cityZh: "首尔", cityEn: "Seoul",
    img: v3, license: "KR-PS-03871",
    qualZh: "大韩整形外科学会 (KSPRS) 会员 · 面部拉皮专科认证",
    qualEn: "Member, KSPRS · Certified Facial Rejuvenation Specialist",
    years: 22, surgeries: "5,400+", rating: 4.93, reviews: 1387,
    specZh: ["面部拉皮 (SMAS)", "颈部提升", "面部脂肪填充"],
    specEn: ["Facelift (SMAS)", "Neck Lift", "Facial Fat Grafting"],
    bioZh:
      "朴秀荣院长深耕 SMAS 深层拉皮与颈部年轻化 22 年，擅长通过最小切口实现持久自然的提升效果，是韩国首批将脂肪填充与拉皮联合应用的专家之一。",
    bioEn:
      "Dr. Park has spent 22 years on SMAS facelift and neck rejuvenation. She is known for durable, natural lifts through minimal incisions and was among the first Korean surgeons to combine fat grafting with facelift.",
    eduZh: ["延世大学医学院 医学博士", "法国 Dr. Fournier 脂肪移植研修认证"],
    eduEn: ["MD, Yonsei University College of Medicine", "Certified, Dr. Fournier Fat Grafting Workshop, France"],
    awardsZh: ["2021 韩国整形外科优秀医师奖", "BK 面部年轻化中心 主任"],
    awardsEn: ["2021 Korean Plastic Surgery Excellence Award", "Director, BK Facial Rejuvenation Center"],
    languages: ["한국어 / Korean", "English", "中文 / Chinese"],
    priceList: [
      { en: "Facelift (SMAS)", zh: "面部拉皮 (SMAS)", from: 88000 },
      { en: "Neck Lift", zh: "颈部提升", from: 68000 },
      { en: "Facial Fat Grafting", zh: "面部脂肪填充", from: 26800 },
    ],
    caseIds: ["facelift-chengdu", "necklift-shanghai", "fat-grafting-90d"],
  },
  {
    id: "somchai-viriya",
    zh: "宋猜 维里亚 主任医师", en: "Dr. Somchai Viriya · Chief Surgeon",
    titleZh: "形体整形中心 主任", titleEn: "Director, Body Contouring Center",
    clinicZh: "康民国际医院", clinicEn: "Bumrungrad International Hospital",
    cityZh: "曼谷", cityEn: "Bangkok",
    img: v6, license: "TH-PS-11208",
    qualZh: "泰国医学委员会整形外科专科认证 · 美国 ASAPS 国际会员",
    qualEn: "Board Certified Plastic Surgeon, Medical Council of Thailand · ASAPS International Member",
    years: 19, surgeries: "7,200+", rating: 4.94, reviews: 1511,
    specZh: ["隆胸 (Motiva)", "吸脂塑形", "巴西提臀 (BBL)", "腹壁整形"],
    specEn: ["Breast Augmentation (Motiva)", "Liposuction", "BBL", "Tummy Tuck"],
    bioZh:
      "宋猜医生在曼谷康民国际医院执业 19 年，是泰国最早获得 Motiva 全球认证的医师之一，擅长隆胸、吸脂与 BBL 的组合塑形，服务大量欧美与亚洲国际患者。",
    bioEn:
      "Dr. Somchai has practiced at Bumrungrad International Hospital for 19 years. He was among Thailand's first Motiva Global Certified surgeons and specializes in combined breast, liposuction and BBL body makeovers for international patients.",
    eduZh: ["玛希隆大学医学院 医学博士", "美国 Miami Aesthetic 体形雕塑研修 (2015)"],
    eduEn: ["MD, Mahidol University Faculty of Medicine", "Body Sculpting Fellowship, Miami Aesthetic Surgery Institute (2015)"],
    awardsZh: ["Motiva 全球认证医师", "泰国美容整形外科学会 理事"],
    awardsEn: ["Motiva Global Certified Surgeon", "Director, Thai Society of Aesthetic Plastic Surgery"],
    languages: ["ไทย / Thai", "English", "中文 / Chinese (basic)"],
    priceList: [
      { en: "Breast Augmentation (Motiva)", zh: "隆胸 (Motiva)", from: 88000 },
      { en: "Liposuction", zh: "吸脂塑形", from: 32000 },
      { en: "BBL", zh: "巴西提臀 (BBL)", from: 96000 },
      { en: "Tummy Tuck", zh: "腹壁整形 (Tummy Tuck)", from: 78000 },
    ],
    caseIds: ["breast-aug-guangzhou", "liposuction-guangzhou", "tummy-tuck-shenzhen", "bbl-shanghai"],
  },
  {
    id: "tanaka-yuki",
    zh: "田中 由纪 院长", en: "Dr. Tanaka Yuki · Director",
    titleZh: "美容外科 院长", titleEn: "Director, Aesthetic Surgery",
    clinicZh: "高须诊所", clinicEn: "Takasu Clinic",
    cityZh: "东京", cityEn: "Tokyo",
    img: v2, license: "JP-PS-08463",
    qualZh: "日本美容外科学会 (JSAPS) 专门医 · 日本整形外科学会 会员",
    qualEn: "JSAPS Certified Specialist · Member, Japanese Society of Plastic Surgery",
    years: 16, surgeries: "4,100+", rating: 4.91, reviews: 987,
    specZh: ["双眼皮 / 眼袋", "面部脂肪填充", "鼻综合"],
    specEn: ["Blepharoplasty", "Facial Fat Grafting", "Rhinoplasty"],
    bioZh:
      "田中由纪院长专注日式自然美学 16 年，擅长微创双眼皮、脂肪填充与鼻部微调，主张「看不出整过」的术后效果，深受亚洲与欧美自然派求美者信赖。",
    bioEn:
      "Dr. Tanaka has focused on Japanese natural aesthetics for 16 years. She excels in minimally invasive blepharoplasty, fat grafting and subtle nasal refinement, favoring results that don't look operated on.",
    eduZh: ["东京大学医学部 医学博士", "巴黎 Dr. Coleman 脂肪移植认证"],
    eduEn: ["MD, University of Tokyo Faculty of Medicine", "Certified, Dr. Coleman Fat Grafting Workshop, Paris"],
    awardsZh: ["JSAPS 优秀医师奖 2020", "高须诊所 银座院 院长"],
    awardsEn: ["JSAPS Excellence Award 2020", "Director, Takasu Clinic Ginza"],
    languages: ["日本語 / Japanese", "English", "中文 / Chinese"],
    priceList: [
      { en: "Blepharoplasty (upper + lower)", zh: "双眼皮 / 眼袋", from: 12800 },
      { en: "Facial Fat Grafting", zh: "面部脂肪填充", from: 26800 },
      { en: "Rhinoplasty", zh: "鼻综合", from: 22800 },
    ],
    caseIds: ["blepharoplasty-shanghai", "fat-grafting-90d", "rhinoplasty-beijing"],
  },
  {
    id: "lim-weijie",
    zh: "林伟杰 顾问医师", en: "Dr. Lim Wei Jie · Consultant Surgeon",
    titleZh: "整形外科 顾问医师", titleEn: "Consultant Plastic Surgeon",
    clinicZh: "伊丽莎白乌节医院", clinicEn: "Mount Elizabeth Orchard Hospital",
    cityZh: "新加坡", cityEn: "Singapore",
    img: v5, license: "SG-PS-05721",
    qualZh: "新加坡医学专科学院 (FAMS) 整形外科院士 · 英国皇家外科医学院 会员",
    qualEn: "Fellow, Academy of Medicine Singapore (Plastic Surgery) · MRCS (UK)",
    years: 20, surgeries: "5,800+", rating: 4.96, reviews: 1124,
    specZh: ["面部拉皮", "隆胸", "腹壁整形", "吸脂塑形"],
    specEn: ["Facelift", "Breast Augmentation", "Tummy Tuck", "Liposuction"],
    bioZh:
      "林伟杰医生是新加坡私立医院资深整形外科顾问，擅长高安全标准的面部拉皮、隆胸与产后腹壁修复，服务大量东南亚与国际医疗旅客。",
    bioEn:
      "Dr. Lim is a senior consultant plastic surgeon in Singapore's private hospital sector. He specializes in high-safety facelift, breast augmentation and post-pregnancy tummy repair for regional and international medical travelers.",
    eduZh: ["新加坡国立大学医学院 医学学士", "英国伦敦皇家自由医院 整形外科研修"],
    eduEn: ["MBBS, National University of Singapore", "Plastic Surgery Fellowship, Royal Free Hospital, London"],
    awardsZh: ["新加坡卫生部 医疗品质奖", "伊丽莎白医院 首席整形顾问"],
    awardsEn: ["Singapore Ministry of Health Quality Award", "Lead Plastic Surgery Consultant, Mount Elizabeth"],
    languages: ["English", "中文 / Chinese", "Bahasa Melayu"],
    priceList: [
      { en: "Facelift (SMAS)", zh: "面部拉皮 (SMAS)", from: 88000 },
      { en: "Breast Augmentation (Motiva)", zh: "隆胸 (Motiva)", from: 88000 },
      { en: "Tummy Tuck", zh: "腹壁整形 (Tummy Tuck)", from: 78000 },
      { en: "Liposuction", zh: "吸脂塑形", from: 32000 },
    ],
    caseIds: ["facelift-chengdu", "breast-aug-guangzhou", "tummy-tuck-shenzhen", "liposuction-guangzhou"],
  },
  {
    id: "li-wenzhi",
    zh: "李文志 主任医师", en: "Dr. Li Wenzhi · Chief Surgeon",
    titleZh: "整形外科 副主任", titleEn: "Deputy Director, Plastic Surgery",
    clinicZh: "上海华美医疗美容医院", clinicEn: "Shanghai Huamei Plastic Surgery Hospital",
    cityZh: "上海", cityEn: "Shanghai",
    img: v4, license: "CN-PS-20180123456",
    qualZh: "中国卫健委主诊医师 · 中华医学会整形外科学分会会员",
    qualEn: "Shanghai NHC Attending Surgeon · Member, Chinese Society of Plastic Surgery",
    years: 22, surgeries: "8,200+", rating: 4.96, reviews: 1842,
    specZh: ["双眼皮 / 眼袋", "鼻综合", "颈部提升"],
    specEn: ["Blepharoplasty", "Rhinoplasty", "Neck Lift"],
    bioZh:
      "李文志主任专注眼周与鼻部整形 22 年，主刀超过 8,200 台手术。师从中国医学科学院整形外科医院归来教授，长期为海外华人客户提供个性化方案。",
    bioEn:
      "Dr. Li specializes in periorbital and nasal surgery with 22 years of experience and 8,200+ procedures. He is sought after by international and returning clients for naturalistic results that respect deep-tissue anatomy.",
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
];

export const findDoctor = (id: string) => DOCTORS.find((d) => d.id === id);

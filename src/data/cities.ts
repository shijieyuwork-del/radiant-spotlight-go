import heroBg from "@/assets/hero-bg.jpg";
import c1 from "@/assets/clinic1.jpg";
import c2 from "@/assets/clinic2.jpg";
import c3 from "@/assets/clinic3.jpg";

export type City = {
  /** URL slug (lowercase English city name) */
  slug: string;
  zh: string;
  en: string;
  /** Short tagline */
  taglineZh: string;
  taglineEn: string;
  /** Long-form bilingual intro */
  introZh: string;
  introEn: string;
  /** Hero image */
  img: string;
  /** Verified hospital count */
  clinics: number;
  /** Listed surgeons on glowy in this city */
  doctorsCount: number;
  /** Avg savings vs US comparable */
  savings: string;
  /** Trending procedures */
  hotZh: string[];
  hotEn: string[];
  /** Why come here — bullets */
  whyZh: string[];
  whyEn: string[];
  /** Top hospitals (display only) */
  hospitals: { zh: string; en: string; areaZh: string; areaEn: string }[];
  /** Travel essentials */
  travelZh: { airport: string; visa: string; hotel: string; lang: string };
  travelEn: { airport: string; visa: string; hotel: string; lang: string };
};

export const CITIES: City[] = [
  {
    slug: "seoul",
    zh: "首尔", en: "Seoul",
    taglineZh: "亚洲整形之都 · 眼鼻面综合",
    taglineEn: "Asia's plastic-surgery capital · eyes, nose & face",
    introZh:
      "首尔是亚洲最具国际知名度的整形目的地，拥有大量专攻双眼皮、鼻综合与面部轮廓的资深医师，诊所普遍配备中文、英文、俄文协调员，术后管理细致。",
    introEn:
      "Seoul is Asia's best-known aesthetic surgery destination, with deep expertise in double-eyelid, rhinoplasty and facial contouring. Most clinics provide Chinese, English and Russian coordinators and detailed post-op care.",
    img: heroBg,
    clinics: 156, doctorsCount: 98, savings: "55–70%",
    hotZh: ["双眼皮 / 眼袋", "鼻综合", "面部轮廓", "面部拉皮", "脂肪填充"],
    hotEn: ["Blepharoplasty", "Rhinoplasty", "Facial Contouring", "Facelift", "Facial Fat Grafting"],
    whyZh: [
      "仁川 ICN 机场直飞北美 / 欧洲 / 东南亚",
      "江南 / 清潭洞诊所密集，多语种服务成熟",
      "术后 7–14 天留韩管理，拆线、消肿一体化",
    ],
    whyEn: [
      "Incheon (ICN) direct flights to North America, Europe and SE Asia",
      "Dense clinic cluster in Gangnam / Cheongdam with multilingual staff",
      "7–14 day post-op stay management: stitch removal, swelling care in one place",
    ],
    hospitals: [
      { zh: "ID 整形医院", en: "ID Hospital", areaZh: "江南区", areaEn: "Gangnam-gu" },
      { zh: "BK 整形医院", en: "BK Plastic Surgery", areaZh: "江南区", areaEn: "Gangnam-gu" },
      { zh: "原辰整形医院", en: "Wonjin Plastic Surgery", areaZh: "江南区", areaEn: "Gangnam-gu" },
    ],
    travelZh: {
      airport: "ICN · 全球直飞航线密集",
      visa: "K-ETA / 短期医疗签证",
      hotel: "江南 · 清潭洞 恢复酒店",
      lang: "韩文 / 英文 / 中文 / 俄文",
    },
    travelEn: {
      airport: "ICN · dense global direct network",
      visa: "K-ETA or short-term medical visa",
      hotel: "Recovery hotels in Gangnam / Cheongdam",
      lang: "Korean · English · Chinese · Russian",
    },
  },
  {
    slug: "bangkok",
    zh: "曼谷", en: "Bangkok",
    taglineZh: "性价比之选 · 隆胸 / 体形雕塑",
    taglineEn: "Best value in Asia · breast & body contouring",
    introZh:
      "曼谷以高性价比和国际化服务著称，隆胸、吸脂、腹壁整形价格优势明显，私立医院 JCI 认证比例高，适合希望用欧美 1/3 预算完成手术的客户。",
    introEn:
      "Bangkok is known for competitive pricing and international service. Breast augmentation, liposuction and tummy tuck costs are roughly one-third of US rates, and many private hospitals hold JCI accreditation.",
    img: c2,
    clinics: 132, doctorsCount: 76, savings: "65–75%",
    hotZh: ["隆胸", "吸脂塑形", "腹壁整形", "巴西提臀", "面部拉皮"],
    hotEn: ["Breast Augmentation", "Liposuction", "Tummy Tuck", "BBL", "Facelift"],
    whyZh: [
      "BKK / DMK 机场连接全球，医疗签落地便捷",
      "多家医院通过 JCI 认证，麻醉与 ICU 配套完善",
      "英语普及度高，术后可衔接普吉 / 清迈休养",
    ],
    whyEn: [
      "BKK / DMK airports connect globally; medical visas are straightforward",
      "Multiple JCI-accredited hospitals with full anesthesia and ICU support",
      "High English proficiency; easy recovery extension in Phuket / Chiang Mai",
    ],
    hospitals: [
      { zh: "曼谷医院", en: "Bangkok Hospital", areaZh: "巴吞哇区", areaEn: "Pathum Wan" },
      { zh: "康民国际医院", en: "Bumrungrad International Hospital", areaZh: "瓦塔纳区", areaEn: "Watthana" },
      { zh: "帕亚泰 2 国际医院", en: "Phyathai 2 International Hospital", areaZh: "汇权区", areaEn: "Huai Khwang" },
    ],
    travelZh: {
      airport: "BKK / DMK · 全球航线",
      visa: "落地医疗签 / 旅游签",
      hotel: "素坤逸 · 沙吞 恢复酒店",
      lang: "泰文 / 英文 / 中文",
    },
    travelEn: {
      airport: "BKK / DMK · worldwide routes",
      visa: "Medical visa on arrival or tourist visa",
      hotel: "Recovery hotels in Sukhumvit / Sathorn",
      lang: "Thai · English · Chinese",
    },
  },
  {
    slug: "tokyo",
    zh: "东京", en: "Tokyo",
    taglineZh: "精密自然派 · 眼鼻 / 脂肪填充",
    taglineEn: "Precision natural aesthetics · eyes, nose & fat grafting",
    introZh:
      "东京整形以精细化、自然风格见长，双眼皮与脂肪填充技术成熟，医生普遍注重长期安全与低侵入性方案，适合追求低调、持久效果的客户。",
    introEn:
      "Tokyo surgeons are known for refined, natural-looking results. Blepharoplasty and facial fat grafting are especially mature, with a strong focus on long-term safety and minimally invasive approaches.",
    img: c3,
    clinics: 98, doctorsCount: 64, savings: "40–55%",
    hotZh: ["双眼皮 / 眼袋", "面部脂肪填充", "鼻综合", "颈部提升", "面部拉皮"],
    hotEn: ["Blepharoplasty", "Facial Fat Grafting", "Rhinoplasty", "Neck Lift", "Facelift"],
    whyZh: [
      "成田 NRT / 羽田 HND 直飞欧美 / 澳洲",
      "医生资质由日本厚生劳动省严格监管",
      "术后可在箱根 / 轻井泽等温泉地静养",
    ],
    whyEn: [
      "Narita (NRT) and Haneda (HND) direct flights to US, EU and Australia",
      "Surgeon credentials are strictly regulated by Japan's Ministry of Health",
      "Recovery options in Hakone / Karuizawa hot-spring resorts",
    ],
    hospitals: [
      { zh: "东京美容外科", en: "Tokyo Beauty Clinic", areaZh: "涩谷区", areaEn: "Shibuya" },
      { zh: "高须诊所", en: "Takasu Clinic", areaZh: "银座", areaEn: "Ginza" },
      { zh: "圣路加国际医院 美容外科", en: "St. Luke's International Hospital · Aesthetic Surgery", areaZh: "中央区", areaEn: "Chuo" },
    ],
    travelZh: {
      airport: "NRT / HND · 直飞全球",
      visa: "日本医疗签证",
      hotel: "涩谷 · 银座 · 新宿 恢复酒店",
      lang: "日文 / 英文 / 中文",
    },
    travelEn: {
      airport: "NRT / HND · global direct flights",
      visa: "Japan medical visa",
      hotel: "Recovery hotels in Shibuya / Ginza / Shinjuku",
      lang: "Japanese · English · Chinese",
    },
  },
  {
    slug: "singapore",
    zh: "新加坡", en: "Singapore",
    taglineZh: "高端安全港 · 拉皮 / 隆胸",
    taglineEn: "Premium safety hub · facelift & breast surgery",
    introZh:
      "新加坡以严苛的医疗监管和高端服务闻名，适合追求高安全标准、英语无障碍沟通的客户。拉皮、隆胸与体形雕塑由委员会认证整形外科医师主刀。",
    introEn:
      "Singapore is known for strict medical regulation and premium service. It suits patients who prioritize safety and seamless English communication. Facelift, breast surgery and body contouring are performed by board-certified plastic surgeons.",
    img: c1,
    clinics: 54, doctorsCount: 38, savings: "35–50%",
    hotZh: ["面部拉皮", "隆胸", "吸脂塑形", "腹壁整形", "鼻综合"],
    hotEn: ["Facelift", "Breast Augmentation", "Liposuction", "Tummy Tuck", "Rhinoplasty"],
    whyZh: [
      "樟宜 SIN 全球最佳机场之一，转机便利",
      "医疗监管亚洲最严，医师均需专科认证",
      "全英文环境，术后护理标准高",
    ],
    whyEn: [
      "Changi (SIN) is one of the world's best-connected airports",
      "Asia's strictest medical regulation; all surgeons are specialist-certified",
      "Full English-speaking environment with high post-op care standards",
    ],
    hospitals: [
      { zh: "伊丽莎白乌节医院", en: "Mount Elizabeth Orchard Hospital", areaZh: "乌节路", areaEn: "Orchard" },
      { zh: "莱佛士医院", en: "Raffles Hospital", areaZh: "美芝路", areaEn: "Beach Road" },
      { zh: "新加坡中央医院", en: "Singapore General Hospital", areaZh: "红山", areaEn: "Outram" },
    ],
    travelZh: {
      airport: "SIN · 全球枢纽",
      visa: "新加坡医疗签证 / 免签国落地",
      hotel: "乌节路 · 滨海湾 恢复酒店",
      lang: "英文 / 中文 / 马来文",
    },
    travelEn: {
      airport: "SIN · global hub",
      visa: "Singapore medical visa or visa-free arrival",
      hotel: "Recovery hotels in Orchard / Marina Bay",
      lang: "English · Chinese · Malay",
    },
  },
  {
    slug: "shanghai",
    zh: "上海", en: "Shanghai",
    taglineZh: "亚洲医美门户 · 眼鼻面综合",
    taglineEn: "Asia aesthetic gateway · eyes, nose & face",
    introZh:
      "上海是亚洲规模最大的医美市场之一，拥有大量卫健委许可的三级整形机构与英文协调团队，是海外求美者进入亚洲手术市场最便利的入口。",
    introEn:
      "Shanghai is one of Asia's largest aesthetic surgery markets, with many licensed Class-III hospitals and English-speaking coordinators. It is the most convenient entry point for international patients coming to Asia for surgery.",
    img: heroBg,
    clinics: 128, doctorsCount: 86, savings: "60–70%",
    hotZh: ["双眼皮 / 眼袋", "鼻综合", "面部拉皮", "巴西提臀", "颈部提升"],
    hotEn: ["Blepharoplasty", "Rhinoplasty", "Facelift", "BBL", "Neck Lift"],
    whyZh: [
      "浦东 / 虹桥两座国际机场，直飞北美 12 小时内可达",
      "三级整形医院与英文协调员配套成熟",
      "外滩 / 静安一带 5 星级恢复酒店密集",
    ],
    whyEn: [
      "Two international airports (Pudong / Hongqiao) — direct from LA, SF, NYC, YYZ in <12h",
      "Class-III aesthetic hospitals with bilingual staff",
      "Dense cluster of 5-star recovery hotels in the Bund / Jing'an area",
    ],
    hospitals: [
      { zh: "上海华美医疗美容医院", en: "Shanghai Huamei Plastic Surgery Hospital", areaZh: "徐汇区", areaEn: "Xuhui District" },
      { zh: "上海九院 整形外科", en: "Shanghai Ninth People's Hospital · Plastic Surgery", areaZh: "黄浦区", areaEn: "Huangpu District" },
      { zh: "上海薇琳医疗美容医院", en: "Shanghai Weilin Aesthetic Hospital", areaZh: "静安区", areaEn: "Jing'an District" },
    ],
    travelZh: {
      airport: "PVG / SHA · 直飞欧美 / 东南亚",
      visa: "M 字医疗签 / 144 小时过境免签",
      hotel: "外滩 · 静安 · 浦东陆家嘴 恢复酒店",
      lang: "普通话 / 英文 / 粤语",
    },
    travelEn: {
      airport: "PVG / SHA · direct routes from US, Canada, EU, SEA",
      visa: "M visa or 144-hour transit visa-free",
      hotel: "Recovery hotels around the Bund / Jing'an / Lujiazui",
      lang: "Mandarin · English · Cantonese on-site",
    },
  },
  {
    slug: "beijing",
    zh: "北京", en: "Beijing",
    taglineZh: "学术派整形重镇 · 鼻修复 / 提胸",
    taglineEn: "Academic surgical hub · revision rhinoplasty & breast lift",
    introZh:
      "北京汇集了协和、八大处等国家级整形外科教学中心，主刀医师学术背景深厚，特别适合鼻修复、二次手术与高难度乳房整形。",
    introEn:
      "Beijing hosts flagship academic plastic-surgery centers. Choose Beijing for revision rhinoplasty, secondary procedures, and complex breast lift work led by faculty surgeons.",
    img: c2,
    clinics: 142, doctorsCount: 94, savings: "55–70%",
    hotZh: ["鼻综合", "鼻修复", "提胸", "面部拉皮", "双眼皮 / 眼袋"],
    hotEn: ["Rhinoplasty", "Rhino Revision", "Breast Lift", "Facelift", "Blepharoplasty"],
    whyZh: [
      "中国整形外科教学中心，鼻修复经验丰富",
      "首都国际机场 PEK / 大兴 PKX 直飞 30+ 国",
      "三里屯 / 国贸 五星酒店与术后护理一体化",
    ],
    whyEn: [
      "Flagship academic plastic-surgery centers — deep revision-rhino experience",
      "PEK & PKX airports with direct flights to 30+ countries",
      "Sanlitun / CBD luxury hotels integrated with post-op nursing",
    ],
    hospitals: [
      { zh: "北京艺星医疗美容医院", en: "Beijing Yestar Aesthetic Hospital", areaZh: "朝阳区", areaEn: "Chaoyang District" },
      { zh: "中国医学科学院整形外科医院 (八大处)", en: "Plastic Surgery Hospital, CAMS (Badachu)", areaZh: "石景山区", areaEn: "Shijingshan District" },
      { zh: "北京加减美医疗美容医院", en: "Beijing Jiajianmei Aesthetic Hospital", areaZh: "朝阳区", areaEn: "Chaoyang District" },
    ],
    travelZh: {
      airport: "PEK / PKX · 直飞欧美 / 中东",
      visa: "M 字医疗签 / 240 小时过境免签 (京津冀)",
      hotel: "三里屯 · 国贸 · 望京 恢复酒店",
      lang: "普通话 / 英文 / 韩文",
    },
    travelEn: {
      airport: "PEK / PKX · direct flights worldwide",
      visa: "M visa or 240-hour transit visa-free",
      hotel: "Sanlitun · CBD · Wangjing recovery hotels",
      lang: "Mandarin · English · Korean",
    },
  },
];

export const findCity = (slug: string) =>
  CITIES.find((c) => c.slug === slug.toLowerCase());

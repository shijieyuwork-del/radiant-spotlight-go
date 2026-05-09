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
    slug: "shanghai",
    zh: "上海", en: "Shanghai",
    taglineZh: "国际化医美之都 · 眼鼻面综合",
    taglineEn: "International beauty capital · eyes, nose & face",
    introZh:
      "上海拥有全国数量最多的卫健委三级整形机构，集中了 SMAS 拉皮、眼鼻综合、Motiva 隆胸的顶级主刀，配套国际化的护士团队与英文协调员，最适合海外华人短期回国手术。",
    introEn:
      "Shanghai concentrates the highest number of NHC-licensed Class-III aesthetic hospitals in China — strongest for SMAS facelift, eye/nose work and Motiva breast surgery. International nursing teams and English coordinators make it the easiest entry point for overseas Chinese patients.",
    img: heroBg,
    clinics: 128, doctorsCount: 86, savings: "60–70%",
    hotZh: ["双眼皮 / 眼袋", "鼻综合", "面部拉皮", "巴西提臀", "颈部提升"],
    hotEn: ["Blepharoplasty", "Rhinoplasty", "Facelift", "BBL", "Neck Lift"],
    whyZh: [
      "浦东 / 虹桥两座国际机场，直飞北美 12 小时内可达",
      "全市三级整形医院 18 家，可中英双语服务",
      "外滩 / 静安一带 5 星级恢复酒店密集，配套上门护士",
    ],
    whyEn: [
      "Two international airports (Pudong / Hongqiao) — direct from LA, SF, NYC, YYZ in <12h",
      "18 NHC Class-III aesthetic hospitals in-city, all with bilingual staff",
      "Dense cluster of 5-star recovery hotels in the Bund / Jing'an area with in-room nursing",
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
      lang: "诊所提供普通话 / 英文 / 粤语",
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
      "Beijing hosts China's flagship academic plastic-surgery centers (PUMC, Plastic Surgery Hospital of CAMS). Choose Beijing for revision rhinoplasty, secondary procedures, and complex breast lift work led by faculty surgeons.",
    img: c2,
    clinics: 142, doctorsCount: 94, savings: "55–70%",
    hotZh: ["鼻综合", "鼻修复", "提胸", "面部拉皮", "双眼皮 / 眼袋"],
    hotEn: ["Rhinoplasty", "Rhino Revision", "Breast Lift", "Facelift", "Blepharoplasty"],
    whyZh: [
      "中国整形外科教学中心，鼻修复经验全国领先",
      "首都国际机场 PEK / 大兴 PKX 直飞 30+ 国",
      "三里屯 / 国贸 五星酒店与术后护理一体化",
    ],
    whyEn: [
      "Home of China's plastic-surgery teaching hospitals — deepest revision-rhino experience",
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
      visa: "M visa or 240-hour transit visa-free (BJ-TJ-HE)",
      hotel: "Sanlitun · CBD · Wangjing recovery hotels",
      lang: "Mandarin · English · Korean",
    },
  },
  {
    slug: "chengdu",
    zh: "成都", en: "Chengdu",
    taglineZh: "性价比之王 · 全身雕塑 / 拉皮",
    taglineEn: "Best value · body contouring & facelift",
    introZh:
      "成都是国内医美单价最低的一线城市之一，韩系拉皮、360° 体形雕塑、脂肪填充技术成熟，适合预算敏感却追求高完成度的客户。",
    introEn:
      "Chengdu offers the most competitive pricing among China's tier-1 aesthetic markets, with mature Korean-style facelift, 360° body contouring and fat grafting — ideal for budget-conscious patients without compromising on credentialed surgeons.",
    img: c3,
    clinics: 96, doctorsCount: 58, savings: "65–75%",
    hotZh: ["全身体形雕塑", "面部拉皮", "脂肪填充", "双眼皮 / 眼袋", "吸脂塑形"],
    hotEn: ["Body Contouring", "Facelift", "Facial Fat Grafting", "Blepharoplasty", "Liposuction"],
    whyZh: [
      "比北上广再低 15–25%，同等医师资质",
      "天府机场 TFU 直飞 LA / SFO / SYD",
      "成都恢复期生活舒适，适合 2–4 周深度恢复",
    ],
    whyEn: [
      "15–25% lower pricing than Beijing/Shanghai for equivalent surgeon credentials",
      "Tianfu (TFU) direct flights to LA / SFO / SYD",
      "Slow-paced recovery lifestyle — ideal for 2–4 week stays",
    ],
    hospitals: [
      { zh: "成都美莱医学美容医院", en: "Chengdu Meilai Medical Aesthetic Hospital", areaZh: "锦江区", areaEn: "Jinjiang District" },
      { zh: "四川华美紫馨医学美容医院", en: "Sichuan Huamei Zixin Aesthetic Hospital", areaZh: "武侯区", areaEn: "Wuhou District" },
      { zh: "成都八大处医疗美容医院", en: "Chengdu Badachu Plastic Surgery Hospital", areaZh: "锦江区", areaEn: "Jinjiang District" },
    ],
    travelZh: {
      airport: "TFU / CTU · 直飞 LA / SFO / SYD",
      visa: "M 字医疗签",
      hotel: "春熙路 · 锦江 恢复酒店",
      lang: "普通话 / 四川话 / 英文",
    },
    travelEn: {
      airport: "TFU / CTU · direct LA / SFO / SYD",
      visa: "M visa",
      hotel: "Chunxi Rd · Jinjiang recovery hotels",
      lang: "Mandarin · Sichuanese · English",
    },
  },
  {
    slug: "hangzhou",
    zh: "杭州", en: "Hangzhou",
    taglineZh: "面部年轻化高地 · 脂肪填充 / 颈部提升",
    taglineEn: "Facial rejuvenation hub · fat grafting & neck lift",
    introZh:
      "杭州整形医生专长「自体脂肪 + 微创年轻化」，西湖与运河旁的恢复环境安静，适合追求轻盈自然术后效果的女性客户。",
    introEn:
      "Hangzhou surgeons specialize in autologous fat grafting combined with minimally invasive rejuvenation. The quiet West Lake / Grand Canal recovery setting suits patients seeking soft, natural-looking results.",
    img: c1,
    clinics: 71, doctorsCount: 42, savings: "60–70%",
    hotZh: ["面部脂肪填充", "颈部提升", "鼻综合", "面部拉皮", "双眼皮"],
    hotEn: ["Facial Fat Grafting", "Neck Lift", "Rhinoplasty", "Facelift", "Blepharoplasty"],
    whyZh: [
      "脂肪移植存活率全国领先，主打「无馒化」效果",
      "萧山 HGH 机场，1 小时高铁直达上海",
      "西湖 / 运河沿线恢复环境安静空气优良",
    ],
    whyEn: [
      "Top-in-China fat-graft retention rates · no \"pillow face\" look",
      "HGH airport · 1-hour bullet train to Shanghai",
      "Quiet West Lake / Grand Canal recovery settings with clean air",
    ],
    hospitals: [
      { zh: "杭州时光医疗美容医院", en: "Hangzhou Shiguang Aesthetic Hospital", areaZh: "西湖区", areaEn: "Xihu District" },
      { zh: "浙江省人民医院 整形外科", en: "Zhejiang Provincial People's Hospital · Plastic Surgery", areaZh: "下城区", areaEn: "Xiacheng District" },
      { zh: "杭州维多利亚医疗美容医院", en: "Hangzhou Victoria Aesthetic Hospital", areaZh: "拱墅区", areaEn: "Gongshu District" },
    ],
    travelZh: {
      airport: "HGH · 1h 高铁达上海 PVG",
      visa: "M 字医疗签",
      hotel: "西湖 · 运河 恢复酒店",
      lang: "普通话 / 英文",
    },
    travelEn: {
      airport: "HGH · 1h bullet train to Shanghai PVG",
      visa: "M visa",
      hotel: "West Lake · Canal recovery hotels",
      lang: "Mandarin · English",
    },
  },
  {
    slug: "guangzhou",
    zh: "广州", en: "Guangzhou",
    taglineZh: "胸部 / 体形整形中心 · Motiva 认证医生最多",
    taglineEn: "Breast & body contouring hub · most Motiva-certified surgeons",
    introZh:
      "广州拥有全国最多 Motiva 全球认证主刀，胸部整形与吸脂塑形价格透明、品牌正品有据可查，适合海外华人女性回国整形。",
    introEn:
      "Guangzhou hosts the largest concentration of Motiva Global Certified surgeons in China. Pricing on breast augmentation and liposuction is transparent and implant authenticity is fully traceable — a top pick for overseas Chinese women.",
    img: c2,
    clinics: 88, doctorsCount: 51, savings: "60–70%",
    hotZh: ["隆胸 (Motiva)", "吸脂塑形", "腹壁整形", "巴西提臀", "提胸"],
    hotEn: ["Breast Augmentation (Motiva)", "Liposuction", "Tummy Tuck", "BBL", "Breast Lift"],
    whyZh: [
      "Motiva 全球认证医生密度全国第一",
      "白云机场 CAN 直飞东南亚 / 北美",
      "粤语 / 英文 / 普通话三语接待",
    ],
    whyEn: [
      "Highest density of Motiva Global Certified surgeons in China",
      "CAN airport · direct flights to SEA, US, Canada",
      "Trilingual reception (Cantonese · English · Mandarin)",
    ],
    hospitals: [
      { zh: "广州曙光医疗美容门诊部", en: "Guangzhou Shuguang Aesthetic Clinic", areaZh: "天河区", areaEn: "Tianhe District" },
      { zh: "广州海峡医疗美容医院", en: "Guangzhou Haixia Aesthetic Hospital", areaZh: "越秀区", areaEn: "Yuexiu District" },
      { zh: "广州韩妃医学美容医院", en: "Guangzhou Hanfei Aesthetic Hospital", areaZh: "天河区", areaEn: "Tianhe District" },
    ],
    travelZh: {
      airport: "CAN · 直飞东南亚 / 北美",
      visa: "M 字医疗签 / 144 小时过境免签 (粤港澳)",
      hotel: "天河 · 珠江新城 恢复酒店",
      lang: "粤语 / 普通话 / 英文",
    },
    travelEn: {
      airport: "CAN · direct flights to SEA, US, Canada",
      visa: "M visa or 144-hour transit visa-free (GBA)",
      hotel: "Tianhe · Zhujiang New Town recovery hotels",
      lang: "Cantonese · Mandarin · English",
    },
  },
  {
    slug: "shenzhen",
    zh: "深圳", en: "Shenzhen",
    taglineZh: "Mommy Makeover 首选 · 腹壁 / BBL",
    taglineEn: "Top pick for Mommy Makeover · tummy tuck & BBL",
    introZh:
      "深圳形体整形中心专攻产后修复，腹壁整形 + 360° 吸脂 + BBL 一站式打包，毗邻香港，方便从北美 / 东南亚转机入境。",
    introEn:
      "Shenzhen's body-contouring centers specialize in mommy makeover packages — tummy tuck + 360° lipo + BBL in one stay. Proximity to Hong Kong simplifies arrival from North America and Southeast Asia.",
    img: c3,
    clinics: 79, doctorsCount: 47, savings: "55–70%",
    hotZh: ["腹壁整形", "巴西提臀", "吸脂塑形", "面部拉皮", "鼻综合"],
    hotEn: ["Tummy Tuck", "BBL", "Liposuction", "Facelift", "Rhinoplasty"],
    whyZh: [
      "Mommy Makeover 一站式 · 平均 14 天住院 + 恢复",
      "深圳 SZX / 香港 HKG 双枢纽，转机方便",
      "海归医师密集，年轻化的服务体验",
    ],
    whyEn: [
      "One-stop Mommy Makeover · ~14 days inpatient + recovery",
      "SZX + HKG twin hubs · easy connections worldwide",
      "Many US/EU-trained surgeons · modern service experience",
    ],
    hospitals: [
      { zh: "深圳鹏程医疗美容医院", en: "Shenzhen Pengcheng Aesthetic Hospital", areaZh: "罗湖区", areaEn: "Luohu District" },
      { zh: "深圳非凡医疗美容医院", en: "Shenzhen Feifan Aesthetic Hospital", areaZh: "福田区", areaEn: "Futian District" },
      { zh: "深圳广和整形医院", en: "Shenzhen Guanghe Plastic Surgery Hospital", areaZh: "南山区", areaEn: "Nanshan District" },
    ],
    travelZh: {
      airport: "SZX / 转机 HKG",
      visa: "M 字医疗签 / 港澳通行证转入",
      hotel: "福田 · 南山 · 罗湖 恢复酒店",
      lang: "普通话 / 粤语 / 英文",
    },
    travelEn: {
      airport: "SZX or via HKG",
      visa: "M visa or via HK transit",
      hotel: "Futian · Nanshan · Luohu recovery hotels",
      lang: "Mandarin · Cantonese · English",
    },
  },
];

export const findCity = (slug: string) =>
  CITIES.find((c) => c.slug === slug.toLowerCase());

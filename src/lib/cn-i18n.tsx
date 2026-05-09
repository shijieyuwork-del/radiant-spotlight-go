import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CnLang = "en" | "zh";
export type CnCurrency = "USD" | "CNY";
const RATE = 7.2;

export const cnLangLabel: Record<CnLang, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇺🇸" },
  zh: { label: "中文", flag: "🇨🇳" },
};

type Dict = Record<string, string>;
const dict: Record<CnLang, Dict> = {
  en: {
    "brand.suffix": "China",
    "nav.cities": "Cities",
    "nav.projects": "Treatments",
    "nav.clinics": "Verified clinics",
    "nav.cases": "Real cases",
    "nav.compliance": "Doctors",
    "nav.signin": "Sign in",
    "hero.badge": "Licensed by China NHC · Built for international patients",
    "hero.title1": "Beauty in China,",
    "hero.titleEm": "made simple",
    "hero.subtitle": "100k+ verified before-after diaries · 6,000+ board-certified doctors · English-speaking coordinators, airport pickup & medical visa support included.",
    "hero.searchPh": "Search treatment, doctor or clinic (e.g. rhinoplasty, Thermage)",
    "hero.cta": "Get a free quote",
    "hero.hot": "Trending",
    "hero.feat1": "Doctor license verified",
    "hero.feat2": "Clinic permit on file",
    "hero.feat3": "Pay after consultation",
    "doc.cert": "Verified surgeon",
    "doc.years": "yrs experience",
    "doc.cases": "procedures",
    "doc.lic": "License No.",
    "compliance.t1": "NHC clinic permit",
    "compliance.d1": "Verify each clinic's national license",
    "compliance.t2": "Doctor license",
    "compliance.d2": "Every attending surgeon is searchable",
    "compliance.t3": "Authentic supply",
    "compliance.d3": "Per-syringe traceability for fillers/toxin",
    "compliance.t4": "Escrow payment",
    "compliance.d4": "Pay after in-person consult · refundable",
    "cities.kicker": "Top destinations",
    "cities.title1": "Find a clinic in",
    "cities.titleEm": "China's top beauty cities",
    "cities.clinics": "verified clinics",
    "tx.kicker": "Hot treatments",
    "tx.title1": "This month's",
    "tx.titleEm": "best sellers",
    "tx.note": "Includes anesthesia & aftercare · 0% installment available",
    "tx.from": "from",
    "tx.group": "Group price",
    "tx.book": "Book now",
    "cl.kicker": "Verified clinics",
    "cl.title1": "Licensed & legitimate ·",
    "cl.titleEm": "every clinic on record",
    "cl.note": "All clinics hold a national Medical Institution Practice License",
    "cl.exp": "in business",
    "cl.years": "yrs",
    "cl.lic": "License:",
    "cl.beian": "NHC filing:",
    "cl.spec": "Specialty",
    "cl.reviews": "reviews",
    "cl.cta": "Free consultation",
    "doctors.kicker": "Attending surgeons",
    "doctors.title1": "Every surgeon ·",
    "doctors.titleEm": "license on file",
    "doctors.lic": "Medical license:",
    "doctors.exp": "yrs experience",
    "doctors.cases": "procedures",
    "doctors.cta": "View profile",
    "cases.kicker": "Real diaries",
    "cases.title1": "Real before-after stories ·",
    "cases.titleEm": "no filters",
    "cases.tabAll": "All",
    "cases.viewAll": "Explore the full wall",
    "cases.wallTitle": "Real cases · TikTok-style wall",
    "cases.wallSub": "Tap any card to play with sound · click View case for the full diary",
    "promo.kicker": "Welcome offer",
    "promo.title": "Sign up & get $70 toward your first treatment",
    "promo.note": "HA filler from $135 · Skin booster from $80 · Double eyelid from $550 · 100% authentic · Money-back guarantee",
    "promo.cta": "Claim offer",
    "case.back": "Back",
    "case.related": "Related cases",
    "case.book": "Book this treatment",
  },
  zh: {
    "brand.suffix": "医美",
    "nav.cities": "城市",
    "nav.projects": "热门项目",
    "nav.clinics": "正规机构",
    "nav.cases": "真实案例",
    "nav.compliance": "资质查询",
    "nav.signin": "登录",
    "hero.badge": "国家卫健委备案 · 正规医美一站式平台",
    "hero.title1": "放心变美",
    "hero.titleEm": "从查证开始",
    "hero.subtitle": "10万+ 真实案例 · 6000+ 持证医师 · 全部机构均可一键查询《医疗机构执业许可证》与医师执业证。",
    "hero.searchPh": "搜索项目、医生、机构（如：双眼皮、热玛吉）",
    "hero.cta": "立即查询",
    "hero.hot": "热门搜索",
    "hero.feat1": "医师执业证可查",
    "hero.feat2": "机构资质实时核验",
    "hero.feat3": "支持分期 · 先美后付",
    "doc.cert": "主诊医师认证",
    "doc.years": "年经验",
    "doc.cases": "台手术",
    "doc.lic": "证书编号",
    "compliance.t1": "卫健委备案查询",
    "compliance.d1": "扫码核验《医疗机构执业许可证》",
    "compliance.t2": "医师执业证",
    "compliance.d2": "全部主诊医师证书可查",
    "compliance.t3": "正品溯源",
    "compliance.d3": "玻尿酸/肉毒素一物一码",
    "compliance.t4": "资金托管",
    "compliance.d4": "面诊后付款 · 不满意可退",
    "cities.kicker": "国内城市",
    "cities.title1": "在你的城市",
    "cities.titleEm": "找正规机构",
    "cities.clinics": "家正规机构",
    "tx.kicker": "热门项目",
    "tx.title1": "本月",
    "tx.titleEm": "热度榜单",
    "tx.note": "价格已含麻醉、术后护理 · 支持 12 期免息分期",
    "tx.from": "起",
    "tx.group": "团购价",
    "tx.book": "立即抢购",
    "cl.kicker": "正规机构",
    "cl.title1": "持证经营 ·",
    "cl.titleEm": "每家都可查",
    "cl.note": "所有机构均持有国家卫健委颁发的《医疗机构执业许可证》",
    "cl.exp": "经营",
    "cl.years": "年",
    "cl.lic": "执业许可证：",
    "cl.beian": "卫健委备案：",
    "cl.spec": "擅长",
    "cl.reviews": "评价",
    "cl.cta": "在线咨询 · 免费面诊",
    "doctors.kicker": "主诊医师",
    "doctors.title1": "每位医师 ·",
    "doctors.titleEm": "执业证可查",
    "doctors.lic": "执业证书：",
    "doctors.exp": "年从业经验",
    "doctors.cases": "手术案例",
    "doctors.cta": "查看医师档案",
    "cases.kicker": "真实案例",
    "cases.title1": "真实变美日记 ·",
    "cases.titleEm": "无滤镜",
    "cases.tabAll": "全部",
    "cases.viewAll": "查看完整案例墙",
    "cases.wallTitle": "真实案例 · TikTok 视频墙",
    "cases.wallSub": "点击卡片即可有声播放 · 点击「查看案例」浏览完整变美日记",
    "promo.kicker": "新人专享",
    "promo.title": "注册立得 ¥500 美丽基金",
    "promo.note": "玻尿酸 ¥980 · 水光针 ¥580 · 双眼皮 ¥3980 起 · 全部正品溯源 · 不满意全额退",
    "promo.cta": "领取优惠",
    "case.back": "返回",
    "case.related": "相关案例",
    "case.book": "预约此项目",
  },
};

export type CnDictKey = keyof typeof dict.en;

interface CnI18nState {
  lang: CnLang; setLang: (l: CnLang) => void;
  currency: CnCurrency; setCurrency: (c: CnCurrency) => void;
  t: (k: CnDictKey) => string;
  fmt: (cny: number) => string;
}
const CnI18nCtx = createContext<CnI18nState | null>(null);
export const useCn = () => {
  const c = useContext(CnI18nCtx);
  if (!c) throw new Error("useCn must be inside CnI18nProvider");
  return c;
};

const STORE = "glowy.cn.v1";
export const CnI18nProvider = ({ children }: { children: ReactNode }) => {
  const initial = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(STORE) || "null"); } catch { return null; }
  }, []);
  const [lang, setLang] = useState<CnLang>(initial?.lang ?? "en");
  const [currency, setCurrency] = useState<CnCurrency>(initial?.currency ?? "USD");

  useEffect(() => {
    localStorage.setItem(STORE, JSON.stringify({ lang, currency }));
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang, currency]);

  const t: CnI18nState["t"] = (k) => dict[lang][k] ?? dict.en[k] ?? (k as string);
  const fmt = (cny: number) => {
    if (currency === "CNY") return `¥${cny.toLocaleString("en-US")}`;
    const usd = Math.round(cny / RATE);
    return `$${usd.toLocaleString("en-US")}`;
  };

  return (
    <CnI18nCtx.Provider value={{ lang, setLang, currency, setCurrency, t, fmt }}>
      {children}
    </CnI18nCtx.Provider>
  );
};

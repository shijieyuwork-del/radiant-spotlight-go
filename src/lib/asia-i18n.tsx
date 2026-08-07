import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AsiaLang = "en" | "zh" | "ru";
export type AsiaCurrency = "USD" | "CNY";
const RATE = 7.2;

export const asiaLangLabel: Record<AsiaLang, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇺🇸" },
  zh: { label: "中文", flag: "🇨🇳" },
  ru: { label: "Русский", flag: "🇷🇺" },
};

type Dict = Record<string, string>;
const dict: Record<AsiaLang, Dict> = {
  en: {
    "brand.suffix": "Asia",
    "nav.cities": "Cities",
    "nav.projects": "Treatments",
    "nav.clinics": "Verified clinics",
    "nav.cases": "Real cases",
    "nav.compliance": "Doctors",
    "nav.signin": "Sign in",
    "hero.badge": "Licensed across Asia · Verified by local medical boards · Built for international patients",
    "hero.title1": "Beauty in Asia,",
    "hero.titleEm": "made simple",
    "hero.subtitle": "100k+ verified before-after diaries · 6,000+ board-certified surgeons across Asia · English-speaking coordinators, airport pickup & medical visa support included.",
    "hero.searchPh": "Search treatment, doctor or city (e.g. rhinoplasty, facelift, Seoul, Bangkok)",
    "hero.cta": "Get a free quote",
    "hero.hot": "Trending",
    "hero.feat1": "Surgeon license verified",
    "hero.feat2": "Clinic permit on file",
    "hero.feat3": "Pay after consultation",
    "doc.cert": "Verified surgeon",
    "doc.years": "yrs experience",
    "doc.cases": "procedures",
    "doc.lic": "License No.",
    "compliance.t1": "Medical board permit",
    "compliance.d1": "Verify each clinic's national license",
    "compliance.t2": "Surgeon license",
    "compliance.d2": "Every attending surgeon is searchable",
    "compliance.t3": "Authentic supply",
    "compliance.d3": "Implant lot tracking · in-house anesthesiologist on every case",
    "compliance.t4": "Escrow payment",
    "compliance.d4": "Pay after in-person consult · refundable",
    "cities.kicker": "Top destinations",
    "cities.title1": "Find a clinic in",
    "cities.titleEm": "Asia's top beauty cities",
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
    "cl.beian": "Medical board filing:",
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
    "promo.note": "Double eyelid from $550 · Rhinoplasty from $2,200 · SMAS facelift from $10,800 · Board-certified surgeons · Money-back guarantee",
    "promo.cta": "Claim offer",
    "case.back": "Back",
    "case.related": "Related cases",
    "case.book": "Book this treatment",
  },
  zh: {
    "brand.suffix": "亚洲医美",
    "nav.cities": "城市",
    "nav.projects": "热门项目",
    "nav.clinics": "正规机构",
    "nav.cases": "真实案例",
    "nav.compliance": "资质查询",
    "nav.signin": "登录",
    "hero.badge": "亚洲多国医疗资质核验 · 服务国际求美者的一站式平台",
    "hero.title1": "亚洲变美",
    "hero.titleEm": "从查证开始",
    "hero.subtitle": "10万+ 真实案例 · 亚洲 6000+ 持证医师 · 首尔、曼谷、东京、新加坡等热门城市机构资质与医师执业证一键可查。",
    "hero.searchPh": "搜索项目、医生、城市（如：鼻综合、拉皮提升、首尔、曼谷）",
    "hero.cta": "立即查询",
    "hero.hot": "热门搜索",
    "hero.feat1": "医师执业证可查",
    "hero.feat2": "机构资质实时核验",
    "hero.feat3": "支持分期 · 先美后付",
    "doc.cert": "主诊医师认证",
    "doc.years": "年经验",
    "doc.cases": "台手术",
    "doc.lic": "证书编号",
    "compliance.t1": "医疗资质核验",
    "compliance.d1": "核验各国医疗机构执业许可",
    "compliance.t2": "医师执业证",
    "compliance.d2": "全部主诊医师证书可查",
    "compliance.t3": "正品溯源",
    "compliance.d3": "假体批号可追溯 · 全程麻醉医师在场",
    "compliance.t4": "资金托管",
    "compliance.d4": "面诊后付款 · 不满意可退",
    "cities.kicker": "亚洲热门城市",
    "cities.title1": "在亚洲城市",
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
    "cl.note": "所有机构均持有当地卫生部门颁发的医疗机构执业许可",
    "cl.exp": "经营",
    "cl.years": "年",
    "cl.lic": "执业许可证：",
    "cl.beian": "医疗资质备案：",
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
    "promo.note": "双眼皮 ¥3980 起 · 鼻综合 ¥15800 起 · SMAS 拉皮 ¥78000 起 · 主诊医师亲诊 · 不满意可退",
    "promo.cta": "领取优惠",
    "case.back": "返回",
    "case.related": "相关案例",
    "case.book": "预约此项目",
  },
  ru: {
    "brand.suffix": "Китай",
    "nav.cities": "Города",
    "nav.projects": "Процедуры",
    "nav.clinics": "Проверенные клиники",
    "nav.cases": "Реальные кейсы",
    "nav.compliance": "Врачи",
    "nav.signin": "Войти",
    "hero.badge": "Лицензировано NHC Китая · Для иностранных пациентов",
    "hero.title1": "Красота в Китае,",
    "hero.titleEm": "это просто",
    "hero.subtitle": "100 000+ проверенных историй до/после · 6000+ сертифицированных врачей · Координаторы со знанием английского, встреча в аэропорту и медицинская виза включены.",
    "hero.searchPh": "Поиск процедуры, врача или клиники (например: ринопластика, лифтинг, липосакция)",
    "hero.cta": "Получить бесплатный расчёт",
    "hero.hot": "Популярное",
    "hero.feat1": "Лицензия врача проверена",
    "hero.feat2": "Разрешение клиники подтверждено",
    "hero.feat3": "Оплата после консультации",
    "doc.cert": "Проверенный хирург",
    "doc.years": "лет опыта",
    "doc.cases": "процедур",
    "doc.lic": "№ лицензии",
    "compliance.t1": "Разрешение клиники NHC",
    "compliance.d1": "Проверка национальной лицензии каждой клиники",
    "compliance.t2": "Лицензия врача",
    "compliance.d2": "Каждый оперирующий хирург проверяется",
    "compliance.t3": "Оригинальные материалы",
    "compliance.d3": "Отслеживание партий имплантов · штатный анестезиолог на каждой операции",
    "compliance.t4": "Эскроу-оплата",
    "compliance.d4": "Оплата после очной консультации · возможен возврат",
    "cities.kicker": "Топ направления",
    "cities.title1": "Найдите клинику в",
    "cities.titleEm": "лучших городах Китая",
    "cities.clinics": "проверенных клиник",
    "tx.kicker": "Популярные процедуры",
    "tx.title1": "Хиты этого",
    "tx.titleEm": "месяца",
    "tx.note": "Включает анестезию и реабилитацию · доступна рассрочка 0%",
    "tx.from": "от",
    "tx.group": "Групповая цена",
    "tx.book": "Записаться",
    "cl.kicker": "Проверенные клиники",
    "cl.title1": "Лицензия и легальность ·",
    "cl.titleEm": "каждая клиника в реестре",
    "cl.note": "Все клиники имеют национальную лицензию на медицинскую деятельность",
    "cl.exp": "в работе",
    "cl.years": "лет",
    "cl.lic": "Лицензия:",
    "cl.beian": "Регистрация NHC:",
    "cl.spec": "Специализация",
    "cl.reviews": "отзывов",
    "cl.cta": "Бесплатная консультация",
    "doctors.kicker": "Оперирующие хирурги",
    "doctors.title1": "Каждый хирург ·",
    "doctors.titleEm": "лицензия на руках",
    "doctors.lic": "Медицинская лицензия:",
    "doctors.exp": "лет опыта",
    "doctors.cases": "процедур",
    "doctors.cta": "Открыть профиль",
    "cases.kicker": "Реальные дневники",
    "cases.title1": "Реальные истории до/после ·",
    "cases.titleEm": "без фильтров",
    "cases.tabAll": "Все",
    "cases.viewAll": "Открыть всю стену",
    "cases.wallTitle": "Реальные кейсы · стена в стиле TikTok",
    "cases.wallSub": "Нажмите карточку, чтобы воспроизвести со звуком · «Открыть кейс» — полный дневник",
    "promo.kicker": "Приветственное предложение",
    "promo.title": "Зарегистрируйтесь и получите $70 на первую процедуру",
    "promo.note": "Двойное веко от $550 · Ринопластика от $2200 · SMAS-лифтинг от $10 800 · Сертифицированные хирурги · Гарантия возврата",
    "promo.cta": "Получить",
    "case.back": "Назад",
    "case.related": "Похожие кейсы",
    "case.book": "Записаться на эту процедуру",
  },
};

export type AsiaDictKey = keyof typeof dict.en;

interface AsiaI18nState {
  lang: AsiaLang; setLang: (l: AsiaLang) => void;
  currency: AsiaCurrency; setCurrency: (c: AsiaCurrency) => void;
  t: (k: AsiaDictKey) => string;
  fmt: (cny: number) => string;
}
const AsiaI18nCtx = createContext<AsiaI18nState | null>(null);
export const useAsia = () => {
  const c = useContext(AsiaI18nCtx);
  if (!c) throw new Error("useAsia must be inside AsiaI18nProvider");
  return c;
};

const STORE = "glowy.asia.v1";
export const AsiaI18nProvider = ({ children }: { children: ReactNode }) => {
  const initial = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(STORE) || "null"); } catch { return null; }
  }, []);
  const [lang, setLang] = useState<AsiaLang>(initial?.lang ?? "en");
  const [currency, setCurrency] = useState<AsiaCurrency>(initial?.currency ?? "USD");

  useEffect(() => {
    localStorage.setItem(STORE, JSON.stringify({ lang, currency }));
    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang === "ru" ? "ru" : "en";
  }, [lang, currency]);

  const t: AsiaI18nState["t"] = (k) => dict[lang][k] ?? dict.en[k] ?? (k as string);
  const fmt = (cny: number) => {
    if (currency === "CNY") return `¥${cny.toLocaleString("en-US")}`;
    const usd = Math.round(cny / RATE);
    return `$${usd.toLocaleString("en-US")}`;
  };

  return (
    <AsiaI18nCtx.Provider value={{ lang, setLang, currency, setCurrency, t, fmt }}>
      {children}
    </AsiaI18nCtx.Provider>
  );
};

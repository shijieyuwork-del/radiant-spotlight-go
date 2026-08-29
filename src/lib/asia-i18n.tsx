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
    "nav.projects": "Procedures",
    "nav.clinics": "Verified clinics",
    "nav.cases": "Patient diaries",
    "nav.compliance": "Experts",
    "nav.signin": "Sign in",
    "hero.badge": "Licensed in China · Verified by local medical authorities · Built for international patients",
    "hero.title1": "Beauty in China,",
    "hero.titleEm": "made simple",
    "hero.subtitle": "China-focused expert profiles · patient recovery diaries · English-language coordination, airport pickup and visa support.",
    "hero.searchPh": "Search treatment, expert or city (e.g. rhinoplasty, facelift, Shanghai, Beijing)",
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
    "cities.titleEm": "China's top beauty cities",
    "cities.clinics": "verified clinics",
    "tx.kicker": "Procedure specialties",
    "tx.title1": "Explore procedures",
    "tx.titleEm": "by specialty",
    "tx.note": "Indicative pricing for planning · your final treatment plan and itemized quote are confirmed after clinical review",
    "tx.from": "Indicative from",
    "tx.group": "Coordinated price",
    
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
    
    "doctors.kicker": "Attending surgeons",
    "doctors.title1": "Internationally recognized",
    "doctors.titleEm": "surgeons",
    "doctors.lic": "Medical license:",
    "doctors.exp": "yrs experience",
    "doctors.cases": "procedures",
    "doctors.cta": "View profile",
    "cases.kicker": "Patient diaries",
    "cases.title1": "Patient recovery diaries ·",
    "cases.titleEm": "one journey at a time",
    "cases.tabAll": "All",
    "cases.viewAll": "Explore the full wall",
    "cases.wallTitle": "Patient recovery diaries",
    "cases.wallTitleMain": "Patient recovery ",
    "cases.wallTitleEm": "diaries",
    "cases.wallSub": "Explore diary previews by procedure and China destination. Verified labels appear only after review.",
    "promo.kicker": "Welcome offer",
    "promo.title": "Sign up & get $150 toward your first treatment",
    "promo.note": "Double eyelid from $550 · Rhinoplasty from $2,200 · SMAS facelift from $10,800 · Board-certified surgeons · Money-back guarantee",
    "promo.cta": "Claim offer",
    "case.back": "Back",
    "case.related": "Related cases",
    "case.book": "Book this treatment",
    "disclaimer.text": "Cosmetics Asia is an information and travel-coordination platform, not a medical provider. We do not offer medical advice, diagnosis, or treatment. All medical decisions are made directly between you and licensed medical institutions.",
    "disclaimer.short": "Not medical advice — Cosmetics Asia provides information and coordination only. All medical decisions are made between you and licensed medical institutions.",
  },
  zh: {
    "brand.suffix": "亚洲医美",
    "nav.cities": "城市",
    "nav.projects": "热门项目",
    "nav.clinics": "正规机构",
    "nav.cases": "真实案例",
    "nav.compliance": "资质查询",
    "nav.signin": "登录",
    "hero.badge": "中国医疗资质核验 · 服务国际求美者的一站式平台",
    "hero.title1": "中国医美之旅",
    "hero.titleEm": "从查证开始",
    "hero.subtitle": "10万+ 真实案例 · 中国 6000+ 持证专家 · 上海、北京、广州、杭州、海南等热门目的地机构资质与执业资质证一键可查。",
    "hero.searchPh": "搜索项目、专家、城市（如：鼻综合、拉皮提升、上海、北京）",
    "hero.cta": "获取免费报价",
    "hero.hot": "热门搜索",
    "hero.feat1": "执业资质证可查",
    "hero.feat2": "机构资质实时核验",
    "hero.feat3": "支持分期 · 先美后付",
    "doc.cert": "主诊专家认证",
    "doc.years": "年经验",
    "doc.cases": "台手术",
    "doc.lic": "证书编号",
    "compliance.t1": "医疗资质核验",
    "compliance.d1": "核验各国医疗机构执业许可",
    "compliance.t2": "执业资质证",
    "compliance.d2": "全部主诊专家证书可查",
    "compliance.t3": "正品溯源",
    "compliance.d3": "假体批号可追溯 · 全程麻醉专家在场",
    "compliance.t4": "资金托管",
    "compliance.d4": "面诊后付款 · 不满意可退",
    "cities.kicker": "中国热门城市",
    "cities.title1": "在中国城市",
    "cities.titleEm": "找正规机构",
    "cities.clinics": "家正规机构",
    "tx.kicker": "项目分类",
    "tx.title1": "按专业方向",
    "tx.titleEm": "探索医美项目",
    "tx.note": "价格仅供行程规划参考 · 最终治疗方案与明细报价将在专家评估后确认",
    "tx.from": "参考起价",
    "tx.group": "协调服务价",
    
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
    
    "doctors.kicker": "主诊专家",
    "doctors.title1": "选择专家前，",
    "doctors.titleEm": "先了解资质",
    "doctors.lic": "执业证书：",
    "doctors.exp": "年从业经验",
    "doctors.cases": "手术案例",
    "doctors.cta": "查看专家档案",
    "cases.kicker": "患者日记",
    "cases.title1": "患者恢复日记 ·",
    "cases.titleEm": "逐步了解过程",
    "cases.tabAll": "全部",
    "cases.viewAll": "查看完整案例墙",
    "cases.wallTitle": "患者恢复日记",
    "cases.wallTitleMain": "患者恢复",
    "cases.wallTitleEm": "日记",
    "cases.wallSub": "按项目和中国城市浏览日记预览；只有完成审核的内容才会标记为已核验。",
    "promo.kicker": "新人专享",
    "promo.title": "注册立得 ¥500 美丽基金",
    "promo.note": "双眼皮 ¥3980 起 · 鼻综合 ¥15800 起 · SMAS 拉皮 ¥78000 起 · 主诊专家亲诊 · 不满意可退",
    "promo.cta": "领取优惠",
    "case.back": "返回",
    "case.related": "相关案例",
    "case.book": "预约此项目",
    "disclaimer.text": "本平台仅提供信息展示与行程协调服务，不是医疗机构，不提供任何医疗建议、诊断或治疗方案。所有医疗决策均由您与持证医疗机构直接作出。",
    "disclaimer.short": "本平台不提供医疗建议，仅提供信息与协调服务。所有医疗决策均由您与持证医疗机构直接作出。",
  },
  ru: {
    "brand.suffix": "Азия",
    "nav.cities": "Города",
    "nav.projects": "Процедуры",
    "nav.clinics": "Проверенные клиники",
    "nav.cases": "Реальные кейсы",
    "nav.compliance": "Эксперты",
    "nav.signin": "Войти",
    "hero.badge": "Лицензировано в Китае · Для иностранных пациентов",
    "hero.title1": "Красота в Китае,",
    "hero.titleEm": "это просто",
    "hero.subtitle": "100 000+ проверенных историй до/после · 6000+ лицензированных хирургов по всему Китаю · Англоязычные координаторы, встреча в аэропорту и визовая поддержка включены.",
    "hero.searchPh": "Поиск процедуры, эксперта или города (например: ринопластика, лифтинг, Шанхай, Пекин)",
    "hero.cta": "Получить бесплатную оценку",
    "hero.hot": "Популярное",
    "hero.feat1": "Лицензия эксперта проверена",
    "hero.feat2": "Разрешение клиники подтверждено",
    "hero.feat3": "Оплата после консультации",
    "doc.cert": "Проверенный хирург",
    "doc.years": "лет опыта",
    "doc.cases": "процедур",
    "doc.lic": "№ лицензии",
    "compliance.t1": "Разрешение медицинского совета",
    "compliance.d1": "Проверка национальной лицензии каждой клиники",
    "compliance.t2": "Лицензия эксперта",
    "compliance.d2": "Каждый оперирующий хирург проверяется",
    "compliance.t3": "Оригинальные материалы",
    "compliance.d3": "Отслеживание партий имплантов · штатный анестезиолог на каждой операции",
    "compliance.t4": "Эскроу-оплата",
    "compliance.d4": "Оплата после очной консультации · возможен возврат",
    "cities.kicker": "Лучшие направления Китая",
    "cities.title1": "Найдите клинику в",
    "cities.titleEm": "лучших городах Китая",
    "cities.clinics": "проверенных клиник",
    "tx.kicker": "Направления процедур",
    "tx.title1": "Процедуры",
    "tx.titleEm": "по направлениям",
    "tx.note": "Ориентировочные цены для планирования · окончательный план и смета подтверждаются после консультации эксперта",
    "tx.from": "Ориентировочно от",
    "tx.group": "Координированная цена",
    
    "cl.kicker": "Проверенные клиники",
    "cl.title1": "Лицензия и легальность ·",
    "cl.titleEm": "каждая клиника в реестре",
    "cl.note": "Все клиники имеют национальную лицензию на медицинскую деятельность",
    "cl.exp": "в работе",
    "cl.years": "лет",
    "cl.lic": "Лицензия:",
    "cl.beian": "Регистрация медицинского совета:",
    "cl.spec": "Специализация",
    "cl.reviews": "отзывов",
    
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
    "cases.wallTitleMain": "Реальные кейсы · ",
    "cases.wallTitleEm": "стена в стиле TikTok",
    "cases.wallSub": "Нажмите карточку, чтобы воспроизвести со звуком · «Открыть кейс» — полный дневник",
    "promo.kicker": "Приветственное предложение",
    "promo.title": "Зарегистрируйтесь и получите $150 на первую процедуру",
    "promo.note": "Двойное веко от $550 · Ринопластика от $2200 · SMAS-лифтинг от $10 800 · Сертифицированные хирурги · Гарантия возврата",
    "promo.cta": "Получить",
    "case.back": "Назад",
    "case.related": "Похожие кейсы",
    "case.book": "Записаться на эту процедуру",
    "disclaimer.text": "Cosmetics Asia — информационная и координационная платформа, а не медицинское учреждение. Мы не предоставляем медицинских советов, диагностики или лечения. Все медицинские решения принимаются напрямую между вами и лицензированными медицинскими учреждениями.",
    "disclaimer.short": "Не является медицинской консультацией — Cosmetics Asia предоставляет только информацию и координацию. Все медицинские решения принимаются между вами и лицензированными медицинскими учреждениями.",
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

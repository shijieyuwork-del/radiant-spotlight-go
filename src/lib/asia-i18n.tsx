import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { translatedUiText } from "@/lib/locale-text";

export type AsiaLang = "en" | "zh" | "ru" | "es" | "th" | "ms" | "vi";
export type AsiaCurrency = "USD" | "CNY";
const RATE = 7.2;

export const asiaLangLabel: Record<AsiaLang, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇺🇸" },
  zh: { label: "中文", flag: "🇨🇳" },
  ru: { label: "Русский", flag: "🇷🇺" },
  es: { label: "Español", flag: "🇪🇸" },
  th: { label: "ไทย", flag: "🇹🇭" },
  ms: { label: "Bahasa Melayu", flag: "🇲🇾" },
  vi: { label: "Tiếng Việt", flag: "🇻🇳" },
};

type Dict = Record<string, string>;
const dict: Record<Exclude<AsiaLang, "th" | "ms" | "vi">, Dict> & { vi?: Dict } = {
  en: {
    "brand.suffix": "China",
    "nav.cities": "Cities",
    "nav.projects": "Procedures",
    "nav.clinics": "Verified clinics",
    "nav.cases": "Patient diaries",
    "nav.compliance": "Experts",
    "nav.signin": "Sign in",
    "nav.signup": "Sign up",
    "hero.badge": "Licensed in China · Verified by local medical authorities · Built for international patients",
    "hero.title1": "Beauty in China,",
    "hero.titleEm": "made simple",
    "hero.subtitle": "China-focused expert profiles · patient recovery diaries · English-language coordination, airport pickup and visa support.",
    "hero.searchPh": "Search treatment, expert or city (e.g. rhinoplasty, facelift, Shanghai, Beijing)",
    "hero.cta": "Start a consultation",
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
    "compliance.d4": "Deposit returned on surgery day",
    "cities.kicker": "Top tier clinics",
    "cities.title1": "Explore leading clinics",
    "cities.titleEm": "across China",
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
    "case.back": "Back",
    "case.related": "Related cases",
    "case.book": "Book this treatment",
    "ba.expert": "Treating expert",
    "disclaimer.text": "CeladonChina is an information and travel-coordination platform, not a medical provider. We do not offer medical advice, diagnosis, or treatment. All medical decisions are made directly between you and licensed medical institutions.",
    "disclaimer.short": "Not medical advice — CeladonChina provides information and coordination only. All medical decisions are made between you and licensed medical institutions.",
  },
  zh: {
    "brand.suffix": "中国医美",
    "nav.cities": "城市",
    "nav.projects": "热门项目",
    "nav.clinics": "正规机构",
    "nav.cases": "真实案例",
    "nav.compliance": "资质查询",
    "nav.signin": "登录",
    "nav.signup": "注册",
    "hero.badge": "中国医疗资质核验 · 服务国际求美者的一站式平台",
    "hero.title1": "中国医美之旅",
    "hero.titleEm": "从查证开始",
    "hero.subtitle": "10万+ 真实案例 · 中国 6000+ 持证专家 · 上海、北京、广州、杭州、海南等热门目的地机构资质与执业资质证一键可查。",
    "hero.searchPh": "搜索项目、专家、城市（如：鼻综合、拉皮提升、上海、北京）",
    "hero.cta": "开始咨询",
    "hero.hot": "热门搜索",
    "hero.feat1": "执业资质证可查",
    "hero.feat2": "机构资质实时核验",
    "hero.feat3": "支持分期 · 先美后付",
    "doc.cert": "主诊专家认证",
    "doc.years": "年经验",
    "doc.cases": "台手术",
    "doc.lic": "证书编号",
    "compliance.t1": "医疗资质核验",
    "compliance.d1": "核验中国医疗机构执业许可",
    "compliance.t2": "执业资质证",
    "compliance.d2": "全部主诊专家证书可查",
    "compliance.t3": "正品溯源",
    "compliance.d3": "假体批号可追溯 · 全程麻醉专家在场",
    "compliance.t4": "资金托管",
    "compliance.d4": "押金于手术当天退还",
    "cities.kicker": "优质医疗机构",
    "cities.title1": "探索中国",
    "cities.titleEm": "优质医美机构",
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
    "case.back": "返回",
    "case.related": "相关案例",
    "case.book": "预约此项目",
    "ba.expert": "主诊专家",
    "disclaimer.text": "本平台仅提供信息展示与行程协调服务，不是医疗机构，不提供任何医疗建议、诊断或治疗方案。所有医疗决策均由您与持证医疗机构直接作出。",
    "disclaimer.short": "本平台不提供医疗建议，仅提供信息与协调服务。所有医疗决策均由您与持证医疗机构直接作出。",
  },
  ru: {
    "brand.suffix": "Китай",
    "nav.cities": "Города",
    "nav.projects": "Процедуры",
    "nav.clinics": "Проверенные клиники",
    "nav.cases": "Реальные кейсы",
    "nav.compliance": "Эксперты",
    "nav.signin": "Войти",
    "nav.signup": "Регистрация",
    "hero.badge": "Лицензировано в Китае · Для иностранных пациентов",
    "hero.title1": "Красота в Китае,",
    "hero.titleEm": "это просто",
    "hero.subtitle": "100 000+ проверенных историй до/после · 6000+ лицензированных хирургов по всему Китаю · Англоязычные координаторы, встреча в аэропорту и визовая поддержка включены.",
    "hero.searchPh": "Поиск процедуры, эксперта или города (например: ринопластика, лифтинг, Шанхай, Пекин)",
    "hero.cta": "Начать консультацию",
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
    "compliance.d4": "Возврат депозита в день операции",
    "cities.kicker": "Ведущие клиники",
    "cities.title1": "Изучите ведущие клиники",
    "cities.titleEm": "по всему Китаю",
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
    "case.back": "Назад",
    "case.related": "Похожие кейсы",
    "case.book": "Записаться на эту процедуру",
    "ba.expert": "Лечащий эксперт",
    "disclaimer.text": "CeladonChina — информационная и координационная платформа, а не медицинское учреждение. Мы не предоставляем медицинских советов, диагностики или лечения. Все медицинские решения принимаются напрямую между вами и лицензированными медицинскими учреждениями.",
    "disclaimer.short": "Не является медицинской консультацией — CeladonChina предоставляет только информацию и координацию. Все медицинские решения принимаются между вами и лицензированными медицинскими учреждениями.",
  },
  es: {
    "brand.suffix": "China",
    "nav.cities": "Ciudades",
    "nav.projects": "Procedimientos",
    "nav.clinics": "Clínicas verificadas",
    "nav.cases": "Diarios de pacientes",
    "nav.compliance": "Expertos",
    "nav.signin": "Iniciar sesión",
    "nav.signup": "Registrarse",
    "hero.badge": "Con licencia en China · Verificado por autoridades médicas locales · Pensado para pacientes internacionales",
    "hero.title1": "Belleza en China,",
    "hero.titleEm": "sin complicaciones",
    "hero.subtitle": "Perfiles de expertos en China · diarios de recuperación de pacientes · coordinación en inglés, recogida en el aeropuerto y apoyo con el visado.",
    "hero.searchPh": "Busca un procedimiento, experto o ciudad (p. ej. rinoplastia, lifting, Shanghái, Pekín)",
    "hero.cta": "Iniciar una consulta",
    "hero.hot": "Tendencias",
    "hero.feat1": "Licencia del cirujano verificada",
    "hero.feat2": "Permiso de la clínica registrado",
    "hero.feat3": "Paga después de la consulta",
    "doc.cert": "Cirujano verificado",
    "doc.years": "años de experiencia",
    "doc.cases": "procedimientos",
    "doc.lic": "N.º de licencia",
    "compliance.t1": "Permiso del consejo médico",
    "compliance.d1": "Verificamos la licencia nacional de cada clínica",
    "compliance.t2": "Licencia del experto",
    "compliance.d2": "Cada cirujano responsable se puede consultar",
    "compliance.t3": "Suministros originales",
    "compliance.d3": "Trazabilidad de lotes de implantes · anestesiólogo propio en cada caso",
    "compliance.t4": "Pago en depósito",
    "compliance.d4": "Depósito devuelto el día de la cirugía",
    "cities.kicker": "Clínicas destacadas",
    "cities.title1": "Explora clínicas destacadas",
    "cities.titleEm": "en toda China",
    "cities.clinics": "clínicas verificadas",
    "tx.kicker": "Especialidades",
    "tx.title1": "Explora procedimientos",
    "tx.titleEm": "por especialidad",
    "tx.note": "Precios orientativos para planificar · el plan definitivo y el presupuesto detallado se confirman tras la valoración clínica",
    "tx.from": "Orientativo desde",
    "tx.group": "Precio coordinado",

    "cl.kicker": "Clínicas verificadas",
    "cl.title1": "Con licencia y en regla ·",
    "cl.titleEm": "cada clínica registrada",
    "cl.note": "Todas las clínicas cuentan con licencia nacional de actividad médica",
    "cl.exp": "en activo",
    "cl.years": "años",
    "cl.lic": "Licencia:",
    "cl.beian": "Registro del consejo médico:",
    "cl.spec": "Especialidad",
    "cl.reviews": "opiniones",

    "doctors.kicker": "Cirujanos responsables",
    "doctors.title1": "Cirujanos reconocidos",
    "doctors.titleEm": "internacionalmente",
    "doctors.lic": "Licencia médica:",
    "doctors.exp": "años de experiencia",
    "doctors.cases": "procedimientos",
    "doctors.cta": "Ver perfil",
    "cases.kicker": "Diarios de pacientes",
    "cases.title1": "Diarios de recuperación ·",
    "cases.titleEm": "un caso a la vez",
    "cases.tabAll": "Todos",
    "cases.viewAll": "Ver todos los diarios",
    "cases.wallTitle": "Diarios de recuperación de pacientes",
    "cases.wallTitleMain": "Diarios de recuperación ",
    "cases.wallTitleEm": "de pacientes",
    "cases.wallSub": "Explora vistas previas por procedimiento y destino en China. Las etiquetas verificadas aparecen solo tras la revisión.",
    "case.back": "Volver",
    "case.related": "Casos relacionados",
    "case.book": "Reservar este tratamiento",
    "ba.expert": "Especialista tratante",
    "disclaimer.text": "CeladonChina es una plataforma de información y coordinación de viajes, no un proveedor médico. No ofrecemos consejo médico, diagnóstico ni tratamiento. Todas las decisiones médicas se toman directamente entre usted y las instituciones médicas autorizadas.",
    "disclaimer.short": "No es consejo médico: CeladonChina solo ofrece información y coordinación. Todas las decisiones médicas se toman entre usted y las instituciones médicas autorizadas.",
  },
};

const viDict: Dict = {
  ...dict.en,
  "nav.cities": "Các thành phố", "nav.projects": "Quy trình", "nav.clinics": "Phòng khám đã xác minh",
  "nav.cases": "Nhật ký bệnh nhân", "nav.compliance": "Chuyên gia", "nav.signin": "Đăng nhập", "nav.signup": "Đăng ký",
  "hero.badge": "Được cấp phép tại Trung Quốc · Được cơ quan y tế địa phương xác minh · Dành cho bệnh nhân quốc tế",
  "hero.title1": "Vẻ đẹp tại Trung Quốc,", "hero.titleEm": "đơn giản hơn",
  "hero.subtitle": "Hồ sơ chuyên gia tại Trung Quốc · nhật ký hồi phục của bệnh nhân · hỗ trợ tiếng Anh, đón sân bay và visa.",
  "hero.cta": "Nhận tư vấn miễn phí", "hero.hot": "Xu hướng", "hero.feat1": "Đã xác minh giấy phép bác sĩ",
  "hero.feat2": "Giấy phép cơ sở đã đăng ký", "hero.feat3": "Thanh toán sau tư vấn", "doc.cert": "Bác sĩ đã xác minh",
  "doc.years": "năm kinh nghiệm", "doc.cases": "quy trình", "doc.lic": "Số giấy phép",
  "doctors.kicker": "Bác sĩ phẫu thuật", "doctors.title1": "Bác sĩ được công nhận", "doctors.titleEm": "trên toàn cầu",
  "doctors.lic": "Giấy phép y tế:", "doctors.exp": "năm kinh nghiệm", "doctors.cases": "quy trình", "doctors.cta": "Xem hồ sơ",
  "cases.kicker": "Nhật ký bệnh nhân", "cases.title1": "Nhật ký hồi phục ·", "cases.titleEm": "từng hành trình",
  "cases.tabAll": "Tất cả", "cases.viewAll": "Xem toàn bộ nhật ký", "cases.wallTitle": "Nhật ký hồi phục của bệnh nhân",
  "cases.wallTitleMain": "Nhật ký hồi phục ", "cases.wallTitleEm": "của bệnh nhân", "cases.wallSub": "Khám phá theo quy trình và điểm đến tại Trung Quốc. Nhãn xác minh chỉ xuất hiện sau khi kiểm duyệt.",
  "case.back": "Quay lại", "case.related": "Ca liên quan", "case.book": "Đặt quy trình này",
  "disclaimer.text": "Cosmetics Asia là nền tảng thông tin và điều phối du lịch, không phải cơ sở y tế. Chúng tôi không cung cấp tư vấn, chẩn đoán hay điều trị y khoa. Mọi quyết định y tế được đưa ra trực tiếp giữa bạn và cơ sở y tế được cấp phép.",
  "cities.kicker": "Phòng khám hàng đầu", "cities.title1": "Khám phá các phòng khám hàng đầu", "cities.titleEm": "trên khắp Trung Quốc",
  "cities.clinics": "phòng khám đã xác minh",
  "disclaimer.short": "Không phải tư vấn y tế — Cosmetics Asia chỉ cung cấp thông tin và điều phối.",
};

// Vietnamese is seeded from English for any long-tail copy that has not been translated yet;
// the core navigation and conversion copy is localized in viDict above.
dict.vi = viDict;

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
    if (typeof window === "undefined") return null;
    try { return JSON.parse(localStorage.getItem(STORE) || "null"); } catch { return null; }
  }, []);
  const [lang, setLang] = useState<AsiaLang>(initial?.lang ?? "en");
  const [currency, setCurrency] = useState<AsiaCurrency>(initial?.currency ?? "USD");

  useEffect(() => {
    localStorage.setItem(STORE, JSON.stringify({ lang, currency }));
    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang === "ru" ? "ru" : lang;
  }, [lang, currency]);

  const t: AsiaI18nState["t"] = (k) => {
    const english = dict.en[k] ?? (k as string);
    if (lang === "th" || lang === "ms") return translatedUiText(lang, english);
    if (lang === "vi") return viDict[k] ?? english;
    return dict[lang][k] ?? english;
  };
  const fmt = (cny: number) => {
    if (currency === "CNY") return `¥${cny.toLocaleString("en-US")}`;
    const usd = Math.round(cny / RATE / 100) * 100;
    return `$${usd.toLocaleString("en-US")}`;
  };

  return (
    <AsiaI18nCtx.Provider value={{ lang, setLang, currency, setCurrency, t, fmt }}>
      {children}
    </AsiaI18nCtx.Provider>
  );
};

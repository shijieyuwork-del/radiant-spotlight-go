import type { AsiaLang } from "@/lib/asia-i18n";

/**
 * 首页首屏文案：说明服务对象（国际访客，男女均可）、三个行动入口，
 * 以及平台边界（不是诊所、不诊断、不保证效果，临床责任由持牌机构与专家承担）。
 * 同时作为首页搜索标题与描述的来源。
 */
export type HomeHeroCopy = {
  title: string;
  subtitle: string;
  audience: string;
  explore: string;
  how: string;
  ask: string;
  scopeTitle: string;
  scope: string;
  metaTitle: string;
  metaDescription: string;
};

const en: HomeHeroCopy = {
  title: "Considering cosmetic care in China?",
  subtitle:
    "Compare provider information, prepare for a consultation, and plan translation and travel support. Medical care is provided by independent licensed hospitals and clinicians.",
  audience: "For international visitors — women and men",
  explore: "Explore Providers",
  how: "How It Works",
  ask: "Ask a Question",
  scopeTitle: "What we are — and are not",
  scope:
    "Sino Aesthetics is an information and travel coordination service, not a clinic. We do not diagnose, give medical advice or guarantee results. Licensed hospitals and clinicians are responsible for assessment, treatment, informed consent and clinical follow-up.",
  metaTitle: "Cosmetic Care in China for International Visitors | Sino Aesthetics",
  metaDescription:
    "Compare licensed hospitals and specialists in China, prepare for your consultation, and plan translation and travel support. Coordination only — not a clinic.",
};

const COPY: Partial<Record<AsiaLang, HomeHeroCopy>> = {
  en,
  zh: {
    title: "考虑来中国做医美？",
    subtitle: "比较机构与专家信息，做好面诊准备，并安排翻译与行程支持。医疗服务由独立的持牌医院和临床专家提供。",
    audience: "面向国际访客 —— 女性与男性均可",
    explore: "浏览机构与专家",
    how: "服务流程",
    ask: "提个问题",
    scopeTitle: "我们是什么，不是什么",
    scope:
      "Sino Aesthetics 是信息与行程协调平台，不是诊所。我们不做诊断、不提供医疗建议、不保证效果。评估、治疗、知情同意与临床随访均由持牌医疗机构及其专家负责。",
    metaTitle: "国际访客赴华医美协调 | Sino Aesthetics",
    metaDescription: "比较中国持牌医院与专家，准备面诊，安排翻译与行程。仅提供协调服务，不是诊所。",
  },
  ru: {
    title: "Думаете об эстетической медицине в Китае?",
    subtitle:
      "Сравните сведения о клиниках, подготовьтесь к консультации и спланируйте перевод и поездку. Медицинскую помощь оказывают независимые лицензированные больницы и специалисты.",
    audience: "Для иностранных гостей — женщин и мужчин",
    explore: "Клиники и специалисты",
    how: "Как это работает",
    ask: "Задать вопрос",
    scopeTitle: "Кто мы и кем не являемся",
    scope:
      "Sino Aesthetics — информационный и координационный сервис, а не клиника. Мы не ставим диагнозы, не даём медицинских советов и не гарантируем результат. Оценку, лечение, информированное согласие и наблюдение обеспечивают лицензированные клиники и специалисты.",
    metaTitle: "Эстетическая медицина в Китае для иностранцев | Sino Aesthetics",
    metaDescription:
      "Сравните лицензированные клиники и специалистов в Китае, подготовьтесь к консультации, спланируйте перевод и поездку. Только координация — не клиника.",
  },
  es: {
    title: "¿Estás pensando en un tratamiento estético en China?",
    subtitle:
      "Compara información de proveedores, prepara tu consulta y planifica traducción y apoyo de viaje. La atención médica la prestan hospitales y especialistas independientes con licencia.",
    audience: "Para visitantes internacionales — mujeres y hombres",
    explore: "Explorar proveedores",
    how: "Cómo funciona",
    ask: "Hacer una pregunta",
    scopeTitle: "Qué somos y qué no",
    scope:
      "Sino Aesthetics es un servicio de información y coordinación de viajes, no una clínica. No diagnosticamos, no damos consejo médico ni garantizamos resultados. La evaluación, el tratamiento, el consentimiento informado y el seguimiento clínico son responsabilidad de hospitales y especialistas con licencia.",
    metaTitle: "Estética en China para visitantes internacionales | Sino Aesthetics",
    metaDescription:
      "Compara hospitales y especialistas con licencia en China, prepara tu consulta y planifica traducción y viaje. Solo coordinación, no una clínica.",
  },
};

export const getHomeHeroCopy = (lang: AsiaLang): HomeHeroCopy => COPY[lang] ?? en;

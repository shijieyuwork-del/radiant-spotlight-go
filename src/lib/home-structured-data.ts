import { SITE_URL, SITE_DESCRIPTION, ORGANIZATION_ENTITY, WEBSITE_ENTITY } from "@/lib/seo-config";

type HomeFaq = { q: string; a: string };
const HOME_FAQ: Record<"en" | "zh" | "ru" | "es", HomeFaq[]> = {
  en: [
    { q: "Is Sino Aesthetics a clinic?", a: "No. Sino Aesthetics is an information and travel coordination service. Medical care is provided by independent licensed hospitals and clinicians." },
    { q: "Who is responsible for my treatment?", a: "The licensed hospital and clinician you choose are responsible for assessment, treatment, informed consent and clinical follow-up. We do not diagnose or guarantee results." },
    { q: "Who is the service for?", a: "International visitors — women and men — who want to compare providers in China and plan translation and travel support." },
  ],
  zh: [
    { q: "Sino Aesthetics 是诊所吗？", a: "不是。我们是信息与行程协调平台，医疗服务由独立的持牌医院和临床专家提供。" },
    { q: "谁对我的治疗负责？", a: "你选择的持牌医疗机构及其专家负责评估、治疗、知情同意与临床随访。我们不做诊断，也不保证效果。" },
    { q: "服务面向哪些人？", a: "希望比较中国机构与专家、并需要翻译与行程支持的国际访客，女性与男性均可。" },
  ],
  ru: [
    { q: "Sino Aesthetics — это клиника?", a: "Нет. Это информационный и координационный сервис. Медицинскую помощь оказывают независимые лицензированные больницы и специалисты." },
    { q: "Кто отвечает за лечение?", a: "Выбранная лицензированная клиника и специалист отвечают за оценку, лечение, информированное согласие и наблюдение. Мы не ставим диагнозы и не гарантируем результат." },
    { q: "Для кого этот сервис?", a: "Для иностранных гостей — женщин и мужчин, — которые сравнивают клиники в Китае и планируют перевод и поездку." },
  ],
  es: [
    { q: "¿Sino Aesthetics es una clínica?", a: "No. Es un servicio de información y coordinación de viajes. La atención médica la prestan hospitales y especialistas independientes con licencia." },
    { q: "¿Quién es responsable de mi tratamiento?", a: "El hospital y el especialista con licencia que elijas son responsables de la evaluación, el tratamiento, el consentimiento informado y el seguimiento. No diagnosticamos ni garantizamos resultados." },
    { q: "¿Para quién es el servicio?", a: "Para visitantes internacionales, mujeres y hombres, que quieren comparar proveedores en China y planificar traducción y viaje." },
  ],
};

/** Homepage JSON-LD: organization + website + coordination service + FAQ, in the visitor's language. */
export const homeStructuredData = (lang: string = "en") => {
  const key = (lang in HOME_FAQ ? lang : "en") as keyof typeof HOME_FAQ;
  return {
    "@context": "https://schema.org",
    "@graph": [
      ORGANIZATION_ENTITY,
      WEBSITE_ENTITY,
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#coordination-service`,
        name: "Cosmetic care travel coordination in China",
        serviceType: "Medical travel coordination (non-clinical)",
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "China" },
        audience: { "@type": "Audience", audienceType: "International visitors (women and men)" },
        description: SITE_DESCRIPTION,
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        inLanguage: key,
        mainEntity: HOME_FAQ[key].map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };
};

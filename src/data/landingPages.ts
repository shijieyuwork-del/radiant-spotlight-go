/**
 * Procedure × City 落地页注册表（SEO 路线图 Tier 1）。
 *
 * 每条记录 = 一个 /lp/<slug> 页面：
 * - keywordTitle / description：SEO 关键（手写，面向 Semrush 路线图中的关键词）
 * - 价格：treatments.ts 已发布区间 × 城市系数（市场参考，非报价）
 * - 医生与视频：从 DOCTORS / TIKTOK_CASES 实时过滤，绝不虚构
 * - BBL / Mommy Makeover 无 treatments.ts 词条，education 内容内联在此
 *
 * 文案合规：面向用户的表述一律 expert（不出现 doctor 医疗建议措辞）。
 */
import { DOCTORS } from "@/data/doctors";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { findCity, CITIES } from "@/data/cities";

export type LandingProcedureKey =
  | "rhinoplasty"
  | "double-eyelid-surgery"
  | "facelift"
  | "breast-augmentation"
  | "liposuction"
  | "tummy-tuck"
  | "bbl"
  | "mommy-makeover";

export type ProcedureCityLanding = {
  slug: string;
  procedureKey: LandingProcedureKey;
  /** 页面内展示的手术名 */
  procedureLabel: string;
  citySlug: string;
  /** SEO <title>（含关键词） */
  keywordTitle: string;
  /** meta description */
  description: string;
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  intro: string;
  /** 市场参考区间（USD）。high 缺省时按 "From ~$X" 展示 */
  priceLow: number;
  priceHigh?: number;
  visibleRecovery: string;
  finalResult: string;
  priceFactors: string[];
  consultationQuestions: string[];
  localStay: string;
  faq: { question: string; answer: string }[];
  /** 匹配 Doctor.specEn */
  doctorKeywords: string[];
  /** 匹配 TikTokItem.treatment.en */
  videoTreatments: string[];
  /** BBL / Mommy Makeover 等无 treatments.ts 词条时内联的科普 */
  inlineWhat?: string;
  inlineRisks?: string[];
};

/** 城市价格系数（相对 treatments.ts 亚洲市场区间的量级调整） */
export const CITY_PRICE_FACTOR: Record<string, number> = {
  seoul: 1.05,
  bangkok: 0.8,
  shanghai: 0.9,
  beijing: 0.95,
  guangzhou: 0.85,
  hangzhou: 0.9,
  hainan: 0.95,
  tokyo: 1.3,
  singapore: 1.25,
};

const cityFactor = (citySlug: string) => CITY_PRICE_FACTOR[citySlug] ?? 1;

/** 各城市通用 FAQ（visa / 本地停留 / 价格对比），按城市名生成 */
const cityFaqs = (citySlug: string): { question: string; answer: string }[] => {
  const city = findCity(citySlug);
  const name = city?.en ?? citySlug;
  const savings = city?.savings ?? "50–70%";
  const visa = city?.travelEn.visa ?? "Confirm current entry requirements for your nationality.";
  const hotel = city?.travelEn.hotel ?? "Recovery hotels near your clinic";
  const airport = city?.travelEn.airport ?? "International airport with direct connections";
  return [
    {
      question: `How much does surgery cost in ${name} compared with the US?`,
      answer: `Published pricing in ${name} commonly lands ${savings} below comparable US rates for many procedures. The range shown on this page is a general market reference — your final quote depends on technique, facility, anaesthesia and follow-up.`,
    },
    {
      question: `Do I need a visa for treatment in ${name}?`,
      answer: `${visa}. Confirm the current entry rules for your nationality with the embassy or your coordinator before booking flights.`,
    },
    {
      question: `Where should I stay during recovery in ${name}?`,
      answer: `${hotel}. Choose a place close to your clinic with easy access for suture removal and follow-up visits.`,
    },
    {
      question: `How long should I plan to stay in ${name}?`,
      answer: `Your treating expert must confirm when travel is safe based on the procedure, healing, and flight length. Budget for the local stay shown on this page plus buffer, and note that ${airport}.`,
    },
  ];
};

export const LANDING_PAGES: ProcedureCityLanding[] = [
  /* ------------------------------ Seoul ------------------------------ */
  {
    slug: "rhinoplasty-seoul",
    procedureKey: "rhinoplasty",
    procedureLabel: "Rhinoplasty",
    citySlug: "seoul",
    keywordTitle: "Rhinoplasty in Seoul, Korea | Cost, Recovery & Experts",
    description:
      "Considering rhinoplasty in Seoul? Review realistic cost and recovery ranges for nose surgery in Korea, see verified experts, and start with a free consultation.",
    eyebrow: "Rhinoplasty planning in Seoul",
    headline: "Considering rhinoplasty in Seoul?",
    headlineAccent: "Korea's most-requested facial procedure, planned without pressure.",
    intro:
      "Seoul has one of the densest concentrations of rhinoplasty specialists in Asia. Understand realistic costs, recovery, and how to compare experts before you travel.",
    priceLow: 3100,
    priceHigh: 9500,
    visibleRecovery: "About 1–2 weeks",
    finalResult: "6–12+ months",
    priceFactors: [
      "Open vs closed approach",
      "Septal, ear, or rib cartilage grafting",
      "Primary vs revision surgery",
      "Anaesthesia, facility, and follow-up needs",
    ],
    consultationQuestions: [
      "How many rhinoplasties the expert performs per year, and what share are revisions",
      "Whether grafts are needed and where the cartilage comes from",
      "Before/after photos of patients with similar skin thickness, at 12 months",
      "Revision policy and cost if one is needed",
    ],
    localStay:
      "Most experts want to review you around day 7 for splint removal. Plan a minimum stay of 7–14 days in Seoul and confirm timing with your chosen expert.",
    faq: [
      {
        question: "What is the revision rate for rhinoplasty?",
        answer:
          "Rhinoplasty has the highest revision rate of any facial procedure — roughly 5–15% of cases. Ask any expert you consult about their revision policy before committing.",
      },
      {
        question: "When will I see the final result?",
        answer:
          "Swelling hides the result for months, and the tip settles last — especially in thicker skin. Judge the outcome at 12 months, not 12 weeks.",
      },
      ...cityFaqs("seoul"),
    ],
    doctorKeywords: ["Rhinoplasty"],
    videoTreatments: ["Rhinoplasty"],
  },
  {
    slug: "double-eyelid-surgery-seoul",
    procedureKey: "double-eyelid-surgery",
    procedureLabel: "Double Eyelid Surgery",
    citySlug: "seoul",
    keywordTitle: "Double Eyelid Surgery in Seoul | Cost, Recovery & Experts",
    description:
      "Double eyelid surgery in Seoul — review realistic cost and recovery for Korean blepharoplasty, compare verified experts, and start with a free consultation.",
    eyebrow: "Eyelid surgery planning in Seoul",
    headline: "Considering double eyelid surgery in Seoul?",
    headlineAccent: "The signature procedure of Korea's aesthetic capital.",
    intro:
      "Double eyelid surgery is Seoul's most-requested procedure. Understand incisional versus buried-suture techniques, realistic costs, and recovery before you decide.",
    priceLow: 1600,
    priceHigh: 5300,
    visibleRecovery: "About 7–14 days",
    finalResult: "3–6 months",
    priceFactors: [
      "Incisional or buried-suture technique",
      "Upper, lower, or both eyelids",
      "Ptosis correction or fat repositioning",
      "Anaesthesia, facility, and follow-up needs",
    ],
    consultationQuestions: [
      "Which technique fits your eyelid anatomy",
      "Whether a dry-eye assessment is needed first",
      "Before/after photos of similar eye shapes",
      "When sutures are removed and travel is safe",
    ],
    localStay:
      "Ask your expert when sutures are removed and when your eyes should be checked before flying — typically within the first week in Seoul.",
    faq: [
      {
        question: "Incisional or suture technique — which is better?",
        answer:
          "Suture methods create a fold without cutting and recover faster, but suit thinner eyelids and can fade. Incisional methods give a more permanent fold and can address excess skin. An in-person assessment decides what fits.",
      },
      {
        question: "How long is the swelling visible?",
        answer:
          "Swelling and bruising peak around day 3. Most people are presentable within 7–14 days, and the fold settles over 3–6 months.",
      },
      ...cityFaqs("seoul"),
    ],
    doctorKeywords: ["Blepharoplasty"],
    videoTreatments: ["Blepharoplasty"],
  },
  {
    slug: "facelift-seoul",
    procedureKey: "facelift",
    procedureLabel: "Facelift",
    citySlug: "seoul",
    keywordTitle: "Facelift in Seoul, Korea | Cost, Recovery & Experts",
    description:
      "Considering a facelift in Seoul? Compare realistic cost and recovery ranges for facial rejuvenation in Korea, see verified experts, and start a free consultation.",
    eyebrow: "Facelift planning in Seoul",
    headline: "Considering a facelift in Seoul?",
    headlineAccent: "Deep-plane expertise with a focus on natural results.",
    intro:
      "Seoul's facial rejuvenation specialists are known for SMAS and deep-plane techniques. Understand the options, local stay, costs, and follow-up before you travel.",
    priceLow: 6300,
    priceHigh: 18900,
    visibleRecovery: "About 2–4 weeks",
    finalResult: "6–12 months",
    priceFactors: [
      "Mini, SMAS, or deep-plane technique",
      "Whether neck work is included",
      "Combined fat grafting or skin treatment",
      "Anaesthesia, facility, drains, and follow-up",
    ],
    consultationQuestions: [
      "Which technique fits the degree of laxity",
      "Where incisions and scars will sit",
      "How neck work or added procedures affect the quote",
      "How complications and follow-up are handled after you return home",
    ],
    localStay:
      "A facelift usually requires a longer local stay — expect at least 2–3 weeks in Seoul. Your treating expert must confirm when travel is safe.",
    faq: [
      {
        question: "Why is the price range so wide?",
        answer:
          "The term facelift covers short-scar procedures through extensive SMAS or deep-plane surgery, sometimes with neck work or other treatments. The final plan determines the fee.",
      },
      {
        question: "Does a facelift fix every sign of ageing?",
        answer:
          "No. It primarily addresses tissue descent and laxity. Skin texture, sun damage, fine lines, and volume loss may need different treatment — discuss this with a qualified clinician.",
      },
      ...cityFaqs("seoul"),
    ],
    doctorKeywords: ["Facelift", "Neck Lift"],
    videoTreatments: ["Facelift", "Neck Lift"],
  },
  {
    slug: "breast-augmentation-seoul",
    procedureKey: "breast-augmentation",
    procedureLabel: "Breast Augmentation",
    citySlug: "seoul",
    keywordTitle: "Breast Augmentation in Seoul | Cost, Recovery & Experts",
    description:
      "Exploring breast augmentation in Seoul? Review realistic cost and recovery ranges, compare verified experts in Korea, and start with a free consultation.",
    eyebrow: "Breast augmentation planning in Seoul",
    headline: "Considering breast augmentation in Seoul?",
    headlineAccent: "Implant options, honest pricing, and long-term planning.",
    intro:
      "Breast augmentation decisions come down to implant type, placement, and long-term planning. Here is what to clarify before choosing an expert in Seoul.",
    priceLow: 3700,
    priceHigh: 10500,
    visibleRecovery: "About 1–2 weeks",
    finalResult: "3–6 months",
    priceFactors: [
      "Implant type and profile",
      "Submuscular or subglandular placement",
      "Facility, anaesthesia, and follow-up",
      "Long-term imaging and eventual revision",
    ],
    consultationQuestions: [
      "Implant type and why it fits your frame",
      "Placement and incision options",
      "What follow-up and imaging are recommended",
      "Revision expectations over the implant's lifetime",
    ],
    localStay:
      "Confirm when sutures are removed and when your expert wants to review you before you fly home — usually within the first week or two.",
    faq: [
      {
        question: "How long do implants last?",
        answer:
          "Implants are not lifetime devices. Silicone implants need periodic imaging, and most patients plan for eventual revision. Ask about the expert's revision policy before committing.",
      },
      {
        question: "When can I fly after augmentation?",
        answer:
          "There is no universal date — your treating expert must assess healing, support garments, and flight length. Chest exercise and heavy lifting are usually restricted for weeks.",
      },
      ...cityFaqs("seoul"),
    ],
    doctorKeywords: ["Breast Augmentation", "Breast Lift"],
    videoTreatments: ["Breast Augmentation", "Breast Lift"],
  },

  /* ----------------------------- Bangkok ----------------------------- */
  {
    slug: "rhinoplasty-bangkok",
    procedureKey: "rhinoplasty",
    procedureLabel: "Rhinoplasty",
    citySlug: "bangkok",
    keywordTitle: "Rhinoplasty in Bangkok, Thailand | Cost, Recovery & Experts",
    description:
      "Considering rhinoplasty in Bangkok? Compare realistic nose surgery costs and recovery in Thailand, see verified experts, and start a free consultation.",
    eyebrow: "Rhinoplasty planning in Bangkok",
    headline: "Considering rhinoplasty in Bangkok?",
    headlineAccent: "Accredited hospitals at roughly one-third of US rates.",
    intro:
      "Bangkok combines accredited private hospitals with strong value. Understand realistic costs, techniques, and travel planning before you decide.",
    priceLow: 2400,
    priceHigh: 7200,
    visibleRecovery: "About 1–2 weeks",
    finalResult: "6–12+ months",
    priceFactors: [
      "Open vs closed approach",
      "Cartilage grafting needs",
      "Primary vs revision surgery",
      "Hospital, anaesthesia, and follow-up",
    ],
    consultationQuestions: [
      "How many rhinoplasties the expert performs per year",
      "Whether grafts are needed and where the cartilage comes from",
      "Before/after photos of similar skin thickness, at 12 months",
      "Revision policy and cost if one is needed",
    ],
    localStay:
      "Plan a minimum stay of 7–14 days in Bangkok for splint removal and review. Your treating expert confirms the exact timing.",
    faq: [
      {
        question: "Is it safe to have surgery in Bangkok?",
        answer:
          "Many Bangkok private hospitals hold JCI accreditation with full anaesthesia and ICU support. Choose a board-certified plastic expert and confirm the hospital's accreditation yourself.",
      },
      {
        question: "What is the revision rate for rhinoplasty?",
        answer:
          "Rhinoplasty has the highest revision rate of any facial procedure — roughly 5–15% of cases. Ask about revision policy before committing.",
      },
      ...cityFaqs("bangkok"),
    ],
    doctorKeywords: ["Rhinoplasty"],
    videoTreatments: ["Rhinoplasty"],
  },
  {
    slug: "breast-augmentation-bangkok",
    procedureKey: "breast-augmentation",
    procedureLabel: "Breast Augmentation",
    citySlug: "bangkok",
    keywordTitle: "Breast Augmentation in Bangkok, Thailand | Cost, Recovery & Experts",
    description:
      "Breast augmentation in Bangkok — realistic cost and recovery ranges for Thailand, verified experts at accredited hospitals, and a free consultation.",
    eyebrow: "Breast augmentation planning in Bangkok",
    headline: "Considering breast augmentation in Bangkok?",
    headlineAccent: "Motiva-certified experts at accredited international hospitals.",
    intro:
      "Bangkok is one of Asia's most popular destinations for breast augmentation, with internationally accredited hospitals and strong value. Understand the options before you travel.",
    priceLow: 2800,
    priceHigh: 8000,
    visibleRecovery: "About 1–2 weeks",
    finalResult: "3–6 months",
    priceFactors: [
      "Implant type and profile",
      "Submuscular or subglandular placement",
      "Hospital, anaesthesia, and follow-up",
      "Long-term imaging and eventual revision",
    ],
    consultationQuestions: [
      "Implant type and why it fits your frame",
      "Placement and incision options",
      "What follow-up and imaging are recommended",
      "Revision expectations over the implant's lifetime",
    ],
    localStay:
      "Confirm when sutures are removed and when your expert wants to review you before you fly home — usually within the first week or two.",
    faq: [
      {
        question: "How long do implants last?",
        answer:
          "Implants are not lifetime devices. Silicone implants need periodic imaging, and most patients plan for eventual revision. Ask about the expert's revision policy before committing.",
      },
      {
        question: "Is Bangkok safe for this procedure?",
        answer:
          "Bangkok has several JCI-accredited private hospitals with full anaesthesia and ICU support. Verify the hospital's accreditation and the expert's board certification yourself.",
      },
      ...cityFaqs("bangkok"),
    ],
    doctorKeywords: ["Breast Augmentation", "Breast Lift"],
    videoTreatments: ["Breast Augmentation", "Breast Lift"],
  },
  {
    slug: "liposuction-bangkok",
    procedureKey: "liposuction",
    procedureLabel: "Liposuction",
    citySlug: "bangkok",
    keywordTitle: "Liposuction in Bangkok, Thailand | Cost, Recovery & Experts",
    description:
      "Liposuction in Bangkok — realistic cost, recovery and body-contouring guidance for Thailand, verified experts, and a free no-obligation consultation.",
    eyebrow: "Liposuction planning in Bangkok",
    headline: "Considering liposuction in Bangkok?",
    headlineAccent: "Body-contouring value with accredited hospital care.",
    intro:
      "Bangkok is a leading destination for liposuction and body contouring. Understand what the procedure can and cannot do, realistic costs, and recovery before you decide.",
    priceLow: 1600,
    priceHigh: 6400,
    visibleRecovery: "Garment worn 2–6 weeks",
    finalResult: "3–6 months",
    priceFactors: [
      "Number of areas treated",
      "Volume removed and technique used",
      "Whether combined with other contouring",
      "Hospital, anaesthesia, garment, and follow-up",
    ],
    consultationQuestions: [
      "Which areas are realistic to treat in one session",
      "How much fat can safely be removed",
      "Whether skin laxity may leave looseness",
      "Garment duration and when exercise can resume",
    ],
    localStay:
      "You will leave with a compression garment and follow-up checks. Confirm how long your expert wants you in Bangkok before flying — typically 7–14 days.",
    faq: [
      {
        question: "Is liposuction a weight-loss tool?",
        answer:
          "No. Liposuction removes localised fat deposits and reshapes contours; it is not a treatment for obesity. Stable weight and good skin elasticity give the best results.",
      },
      {
        question: "When can I exercise again?",
        answer:
          "Compression garments continue for weeks, and the area swells before it settles. Most experts clear exercise around the 6–8 week mark. The contour only becomes reliable at 3–6 months.",
      },
      ...cityFaqs("bangkok"),
    ],
    doctorKeywords: ["Liposuction"],
    videoTreatments: ["Liposuction", "Body Contouring"],
  },
  {
    slug: "tummy-tuck-bangkok",
    procedureKey: "tummy-tuck",
    procedureLabel: "Tummy Tuck",
    citySlug: "bangkok",
    keywordTitle: "Tummy Tuck in Bangkok, Thailand | Cost, Recovery & Experts",
    description:
      "Considering a tummy tuck in Bangkok? Compare realistic abdominoplasty costs and recovery in Thailand, see verified experts, and start a free consultation.",
    eyebrow: "Abdominoplasty planning in Bangkok",
    headline: "Considering a tummy tuck in Bangkok?",
    headlineAccent: "A permanent scar — and a longer recovery. Plan for both.",
    intro:
      "A tummy tuck removes excess skin and tightens the abdominal wall. It is major surgery with a permanent scar, so realistic planning matters before choosing Bangkok.",
    priceLow: 3200,
    priceHigh: 9600,
    visibleRecovery: "About 2–4 weeks",
    finalResult: "6–18 months (scar)",
    priceFactors: [
      "Full or mini abdominoplasty",
      "Muscle repair (diastasis) included or not",
      "Whether combined with liposuction",
      "Hospital stay, drains, garment, and follow-up",
    ],
    consultationQuestions: [
      "Full vs mini procedure and expected scar",
      "Whether muscle repair is included",
      "Drains, hospital stay, and garment details",
      "When travel home and exercise are realistic",
    ],
    localStay:
      "A tummy tuck needs more local follow-up than smaller procedures — drains, garment checks, and wound review. Expect to stay in Bangkok for at least 2 weeks.",
    faq: [
      {
        question: "Will the scar fade completely?",
        answer:
          "The scar matures from red and raised toward flat and pale over 6–18 months, but it never disappears. Position and length depend on the technique and your anatomy.",
      },
      {
        question: "What is recovery actually like?",
        answer:
          "Expect drains in the first days and walking bent forward initially. Desk work is often possible late in week 2–4, and most exercise resumes around week 6–8. You will need help at home.",
      },
      ...cityFaqs("bangkok"),
    ],
    doctorKeywords: ["Tummy Tuck"],
    videoTreatments: ["Tummy Tuck"],
  },
  {
    slug: "bbl-bangkok",
    procedureKey: "bbl",
    procedureLabel: "BBL (Brazilian Butt Lift)",
    citySlug: "bangkok",
    keywordTitle: "BBL in Bangkok, Thailand | Cost, Safety & Experts",
    description:
      "Considering a Brazilian Butt Lift in Bangkok? Understand realistic costs, fat-transfer safety and recovery in Thailand, see verified experts, and start free.",
    eyebrow: "BBL planning in Bangkok",
    headline: "Considering a BBL in Bangkok?",
    headlineAccent: "Understand the safety profile before the price tag.",
    intro:
      "A Brazilian Butt Lift combines liposuction with fat transfer. It carries a rare but serious risk profile, so expert choice and hospital standards matter more than price.",
    priceLow: 13000,
    visibleRecovery: "About 2–3 weeks off work",
    finalResult: "3–6 months",
    priceFactors: [
      "Volume of fat transferred",
      "Liposuction donor areas treated",
      "Surgeon experience and hospital standards",
      "Anaesthesia, compression garments, and follow-up",
    ],
    consultationQuestions: [
      "Where fat will be taken from and how much is realistic",
      "The expert's BBL volume and complication history",
      "Hospital accreditation and anaesthesia protocol",
      "How much fat typically survives long-term",
    ],
    localStay:
      "Recovery involves compression garments and follow-up checks. Your expert must confirm when flying is safe — BBLs usually need a longer local stay.",
    faq: [
      {
        question: "Is BBL safe?",
        answer:
          "BBL carries a rare but serious risk of fat embolism — a risk profile higher than most cosmetic procedures. Only consider it with an experienced, board-certified expert and strict hospital safety protocols.",
      },
      {
        question: "How much of the transferred fat survives?",
        answer:
          "A portion of the transferred fat is reabsorbed over the first months, so some volume loss is expected. The expert's technique and your healing influence how much remains.",
      },
      ...cityFaqs("bangkok"),
    ],
    doctorKeywords: ["BBL"],
    videoTreatments: ["BBL"],
    inlineWhat:
      "A Brazilian Butt Lift (BBL) uses liposuction to remove fat from areas such as the abdomen, flanks or thighs, processes it, and re-injects it into the buttocks to change shape and projection.",
    inlineRisks: [
      "Rare but serious: fat embolism — the reason expert choice and hospital protocols matter",
      "Partial fat resorption over the first months (volume loss is expected)",
      "Asymmetry or contour irregularities at donor or recipient sites",
      "Time off work and restricted sitting for weeks",
    ],
  },
  {
    slug: "facelift-bangkok",
    procedureKey: "facelift",
    procedureLabel: "Facelift",
    citySlug: "bangkok",
    keywordTitle: "Facelift in Bangkok, Thailand | Cost, Recovery & Experts",
    description:
      "Considering a facelift in Bangkok? Review realistic cost and recovery for facial rejuvenation in Thailand, see verified experts, and start a free consultation.",
    eyebrow: "Facelift planning in Bangkok",
    headline: "Considering a facelift in Bangkok?",
    headlineAccent: "Compare techniques, local stay, and follow-up honestly.",
    intro:
      "Facelift techniques vary in depth, recovery, and what they can address. Bangkok offers accredited hospital care and strong value — start by clarifying the procedure.",
    priceLow: 4800,
    priceHigh: 14400,
    visibleRecovery: "About 2–4 weeks",
    finalResult: "6–12 months",
    priceFactors: [
      "Mini, SMAS, or deep-plane technique",
      "Whether neck work is included",
      "Combined fat grafting or skin treatment",
      "Hospital, anaesthesia, drains, and follow-up",
    ],
    consultationQuestions: [
      "Which technique fits the degree of laxity",
      "Where incisions and scars will sit",
      "How neck work or added procedures affect the quote",
      "How complications and follow-up are handled after you return home",
    ],
    localStay:
      "A facelift usually requires a longer local stay — expect at least 2–3 weeks in Bangkok. Your treating expert must confirm when travel is safe.",
    faq: [
      {
        question: "Why is the price range so wide?",
        answer:
          "The term facelift covers short-scar procedures through more extensive SMAS or deep-plane surgery, sometimes with neck work or other treatments. The final plan determines the fee.",
      },
      {
        question: "Does a facelift fix every sign of ageing?",
        answer:
          "No. It primarily addresses tissue descent and laxity. Skin texture, sun damage, fine lines, and volume loss may need different treatment — discuss this with a qualified clinician.",
      },
      ...cityFaqs("bangkok"),
    ],
    doctorKeywords: ["Facelift", "Neck Lift"],
    videoTreatments: ["Facelift", "Neck Lift"],
  },
  {
    slug: "mommy-makeover-bangkok",
    procedureKey: "mommy-makeover",
    procedureLabel: "Mommy Makeover",
    citySlug: "bangkok",
    keywordTitle: "Mommy Makeover in Bangkok, Thailand | Cost & Recovery",
    description:
      "Exploring a mommy makeover in Bangkok? Understand combined tummy tuck and breast procedure costs and recovery in Thailand, see verified experts, and start free.",
    eyebrow: "Mommy makeover planning in Bangkok",
    headline: "Considering a mommy makeover in Bangkok?",
    headlineAccent: "Combined procedures need combined planning.",
    intro:
      "A mommy makeover usually combines a tummy tuck with breast augmentation and/or lift, sometimes with liposuction. Understand the combined scope, recovery, and costs before you travel.",
    priceLow: 11000,
    visibleRecovery: "About 2–4 weeks",
    finalResult: "6–12 months",
    priceFactors: [
      "Combination scope — tummy tuck + breast ± liposuction",
      "One surgery or staged into two",
      "Implant choice if augmentation is included",
      "Hospital stay, drains, garments, and follow-up",
    ],
    consultationQuestions: [
      "Which combination fits your post-pregnancy changes",
      "Whether one surgery or staged procedures is safer",
      "Scar positions for each component",
      "Recovery support at home and travel timing",
    ],
    localStay:
      "A combined makeover needs more local follow-up than any single procedure. Expect a longer stay in Bangkok — your expert confirms when flying is safe.",
    faq: [
      {
        question: "One surgery or two?",
        answer:
          "Longer combined surgery carries higher anaesthesia risk. Some experts recommend staging procedures into two operations weeks apart. Discuss which approach fits your health and goals.",
      },
      {
        question: "How much does a mommy makeover cost in Bangkok?",
        answer:
          "The range shown here anchors on the tummy-tuck component alone. Adding breast augmentation and/or liposuction moves the total well above it. Get an itemised quote for the exact combination.",
      },
      ...cityFaqs("bangkok"),
    ],
    doctorKeywords: ["Tummy Tuck", "Liposuction", "BBL", "Breast Augmentation"],
    videoTreatments: ["Tummy Tuck", "Breast Augmentation", "Liposuction", "Body Contouring"],
    inlineWhat:
      "A mommy makeover combines procedures that typically address post-pregnancy changes — most commonly a tummy tuck (abdominoplasty) with breast augmentation and/or lift, sometimes with liposuction.",
    inlineRisks: [
      "Longer combined surgery carries higher anaesthesia risk than single procedures",
      "Recovery is longer and usually requires help at home",
      "Tummy tuck scars are permanent",
      "Some experts recommend staging procedures into two operations",
    ],
  },
];

export const findLanding = (slug: string) => LANDING_PAGES.find((lp) => lp.slug === slug);

/** 同城市或同手术的其它落地页（站内互链） */
export const relatedLandings = (lp: ProcedureCityLanding, limit = 4) =>
  LANDING_PAGES.filter((other) => other.slug !== lp.slug && (other.citySlug === lp.citySlug || other.procedureKey === lp.procedureKey)).slice(0, limit);

/** 该城市下已认证的专家（按专科匹配度优先排序） */
export const expertsForLanding = (lp: ProcedureCityLanding) => {
  const city = findCity(lp.citySlug);
  if (!city) return [];
  const inCity = DOCTORS.filter((d) => d.cityEn === city.en);
  const matched = inCity.filter((d) => lp.doctorKeywords.some((kw) => d.specEn.includes(kw)));
  const rest = inCity.filter((d) => !matched.includes(d));
  return [...matched, ...rest];
};

/** 该手术的患者日记视频：优先同城（按诊所名），否则全亚洲同手术 */
export const videosForLanding = (lp: ProcedureCityLanding) => {
  const city = findCity(lp.citySlug);
  const byTreatment = TIKTOK_CASES.filter((c) => lp.videoTreatments.includes(c.treatment.en));
  if (!city) return byTreatment;
  const exact = byTreatment.filter((c) => c.clinic.en.toLowerCase().includes(city.en.toLowerCase()));
  return exact.length ? exact : byTreatment;
};

export const citiesForLanding = () => CITIES.filter((c) => LANDING_PAGES.some((lp) => lp.citySlug === c.slug));
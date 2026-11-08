import type { MedicalTourismGuide } from "./medicalTourismGuides";

/**
 * Educational guides on aesthetic trends that international readers search for.
 * They are appended to MEDICAL_TOURISM_GUIDES, so each one gets a route at
 * /medical-tourism-china/<slug>, static HTML at build time and a sitemap entry.
 */

const SHOULDER_HA_NEUROMODULATOR = "https://doi.org/10.1007/s00266-025-04701-6";
const SHOULDER_ADM_IMCAS = "https://www.imcas.com/en/academy/library/videos/video/20209";
const STANDARD_SQUARE_SHOULDERS = "https://www.thestandard.com.hk/wellness/article/322849/Experts-warn-of-risks-with-shoulder-slimming-injections-as-BLACKPINKs-Jennie-trends-for-her-shoulders";
const TRAP_TOX_EVIDENCE = "https://acibademinternational.com/blog/trap-tox-botox-in-the-trapezius-for-neck-slimming-and-tension-evidence-and-risks/";
const CHINA_BRIEFING_MEDICAL_BEAUTY = "https://www.china-briefing.com/news/chinas-medical-beauty-industry-challenges-trends-and-opportunities/";
const VASCULAR_OCCLUSION_CASE = "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5965121/";
const CRITICAL_ISCHEMIA_CASE = "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11818802/";
const DELORENZI_VASCULAR = "https://academic.oup.com/asj/article/34/4/584/219402";
const BJNEWS_GROWTH_FACTOR = "https://www.bjnews.com.cn/detail/1764030458169456.html";
const STDAILY_GROWTH_FACTOR = "https://www.chinanews.com.cn/gn/2021/10-14/9585848.shtml";
const HK01_GROWTH_FACTOR = "https://global.hk01.com/大国小事/60281541/湖北女过度医美脸部馒化成面具人-医生-国家禁止注射生长因子";
const KPMG_CHINA_AESTHETICS = "https://kpmg.com/cn/en/insights/2025/11/china-medical-aesthetics-industry.html";
const SCMP_YOUNG_PATIENTS = "https://www.scmp.com/lifestyle/fashion-beauty/article/3146169/common-skincare-china-double-eyelid-surgery-and-filler";
const ISAPS_GLOBAL_SURVEY = "https://www.isaps.org/discover/about-isaps/global-statistics/global-survey-2024-full-report-and-press-releases/";
const CHINA_COSMETIC_RULES = "https://www.nhc.gov.cn/wjw/c100221/202201/d7e8fa33a26b425da98d69fb04191699.shtml";
const CHINA_COSMETIC_OVERSIGHT = "https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/ggjgs/art/2023/art_ab97d5643ddc45ae861e7f351842f512.html";
const HA_CONSENSUS_CHINESE = "https://pmc.ncbi.nlm.nih.gov/articles/PMC7647603";

export const AESTHETIC_TREND_GUIDES: MedicalTourismGuide[] = [
  {
    slug: "shoulder-filler-injections-china",
    title: "Shoulder Filler Injections in China: Why the Trend Is Growing",
    description: "Why right-angle shoulder injections are popular in China, how hyaluronic acid filler and trapezius botulinum toxin differ, and what to ask first.",
    kicker: "Aesthetic trend explained",
    heading: "Shoulder injections in China: what the right-angle shoulder trend actually involves.",
    intro: "Social media in China and wider East Asia has made a sharp, squared shoulder line a popular aesthetic goal. Clinics now market injections for it, but the term covers two very different treatments with different effects and risks.",
    answer: "Shoulder injections usually mean one of two things: botulinum toxin injected into the upper trapezius muscle to slim a raised, rounded shoulder line, or hyaluronic acid filler placed near the outer shoulder to build up a flatter, more angular contour. Some clinics combine both. Neither is a standard medical treatment, the evidence base is still small, and results depend heavily on anatomy and injector skill.",
    updated: "November 9, 2026",
    readingTime: "8-minute guide",
    takeaways: [
      "Shoulder injection can mean muscle relaxing toxin, volume adding filler or both.",
      "A natural neck to shoulder angle slopes; a true 90-degree line is not a health norm.",
      "Ask what is causing your shoulder shape before choosing any injection.",
    ],
    sections: [
      {
        title: "Why the right-angle shoulder look became popular",
        paragraphs: [
          "The look is often called a right-angle shoulder (直角肩) or a beautiful shoulder line (美人肩). Researchers presenting shoulder contouring techniques describe a well-defined right-angled shoulder as an increasingly valued part of upper body aesthetics in East Asia, and celebrity images have amplified the trend on platforms such as Douyin and Xiaohongshu.",
          "The wider context is China's large injectables market. Industry analysis reports that hyaluronic acid and botulinum toxin account for most of the country's cosmetic filler market, and that a majority of surveyed aesthetic consumers have had filling or anti-wrinkle injections. Shoulder treatments extend those familiar products to a body area.",
        ],
      },
      {
        title: "The two main techniques",
        paragraphs: [
          "The approaches work in opposite directions. Toxin reduces muscle bulk; filler adds volume. Which one, if any, could suit a person depends on whether the shoulder looks rounded because of a large trapezius muscle, a sloping or narrow bony frame, posture or soft tissue.",
        ],
        table: {
          caption: "Shoulder injection approaches compared",
          headers: ["Factor", "Trapezius botulinum toxin", "Shoulder hyaluronic acid filler"],
          rows: [
            ["Aim", "Relax and slim the upper trapezius so the neck looks longer", "Add volume near the outer shoulder for a flatter, angular line"],
            ["How it works", "Blocks nerve signals to the muscle; it may shrink over time", "A gel adds structure under the skin"],
            ["Typical duration", "Often reported as about three to six months", "Varies by product and volume; it gradually breaks down"],
            ["Main concerns", "Weakness, shoulder or neck discomfort, imbalance", "Swelling, lumps, migration, infection and rare vascular events"],
            ["Reversible?", "Wears off; no antidote", "Hyaluronidase can dissolve hyaluronic acid filler"],
          ],
        },
      },
      {
        title: "How much filler and why that matters",
        paragraphs: [
          "Body areas use far larger filler volumes than the face. A 2025 case letter in Aesthetic Plastic Surgery described 15 ml of hyaluronic acid filler in each shoulder combined with targeted toxin injections. Larger volumes raise the cost and make product quality, placement depth and sterile technique more important.",
          "Some clinicians are also experimenting with other injectable materials for shoulder contouring. These are emerging techniques presented at conferences with short follow-up, so treat them as unproven rather than as established options.",
        ],
      },
      {
        title: "Is a 90-degree shoulder realistic or healthy?",
        paragraphs: [
          "Specialists quoted by Hong Kong media point out that a relaxed, healthy neck to shoulder angle usually sits roughly between 30 and 60 degrees. A visual 90-degree line is a styling ideal, often enhanced by posture and photography, not a measure of health.",
          "Trying to force the look by over-relaxing the trapezius can weaken support for the shoulder blade. A good consultation should explain what change is realistic for your frame instead of promising a fixed angle.",
        ],
      },
      {
        title: "Questions to ask before booking",
        paragraphs: [
          "Use the consultation to understand the cause of your shoulder shape and the plan's limits, not just the price per millilitre.",
        ],
        bullets: [
          "What is making my shoulders look this way: muscle, bone structure, posture or fat?",
          "Which exact product will be used, and is its registered indication in China for this body area?",
          "How much product per side, at what depth, and who performs the injection?",
          "What are the expected side effects, and which symptoms need an urgent call?",
          "Is hyaluronidase available on site, and what is the plan if a complication occurs after I fly home?",
        ],
      },
    ],
    faqs: [
      ["What is a right-angle shoulder injection?", "It is a marketing term for injections that aim to create a squarer neck to shoulder line, usually botulinum toxin in the trapezius muscle, hyaluronic acid filler near the outer shoulder, or a combination."],
      ["How long do shoulder filler results last?", "It depends on the product, volume and individual metabolism. Hyaluronic acid filler gradually breaks down, while trapezius toxin effects are commonly reported to last about three to six months."],
      ["Is shoulder filler approved in China?", "Hyaluronic acid fillers in China are regulated medical devices registered for specific indications. Ask to see the product registration and check whether shoulder use falls within it before treatment."],
      ["Can the result be reversed?", "Hyaluronic acid filler can usually be dissolved with hyaluronidase. Toxin cannot be reversed and simply wears off over months."],
    ],
    sources: [
      { title: "Shoulder Aesthetics: A Novel Synergy of Hyaluronic Acid Fillers and Neuromodulators", publisher: "Aesthetic Plastic Surgery (2025)", url: SHOULDER_HA_NEUROMODULATOR },
      { title: "Shoulder contour sculpting with injectable acellular dermal matrix", publisher: "IMCAS Academy", url: SHOULDER_ADM_IMCAS },
      { title: "Experts warn of risks with shoulder slimming injections", publisher: "The Standard (Hong Kong)", url: STANDARD_SQUARE_SHOULDERS },
      { title: "Trap Tox: Botox in the Trapezius, Evidence and Risks", publisher: "Acibadem International", url: TRAP_TOX_EVIDENCE },
      { title: "China's Medical Beauty Industry: Challenges, Trends and Opportunities", publisher: "China Briefing", url: CHINA_BRIEFING_MEDICAL_BEAUTY },
    ],
    related: [
      { label: "Shoulder filler risks and complications", href: "/medical-tourism-china/shoulder-filler-risks-china" },
      { label: "Dermal fillers in China", href: "/treatments/dermal-fillers" },
      { label: "Botulinum toxin in China", href: "/treatments/botulinum-toxin" },
    ],
  },
  {
    slug: "shoulder-filler-risks-china",
    title: "Shoulder Filler Risks and Complications: What to Check in China",
    description: "Side effects and rare serious complications of shoulder filler and trapezius toxin injections, warning signs, and the safety checks to make in China.",
    kicker: "Safety guide",
    heading: "Shoulder filler risks: what can go wrong and how to lower the odds.",
    intro: "Shoulder injections are often sold as quick and low-downtime, but they still place a medical product or drug into the body. Knowing the realistic risks helps you judge whether a clinic is taking them seriously.",
    answer: "Most side effects after shoulder filler are temporary: swelling, bruising, tenderness and mild asymmetry. Less common problems include lumps, filler migration and infection. The most serious, though rare, filler complication is vascular occlusion, where filler blocks or compresses a blood vessel and can damage tissue if not treated quickly. Trapezius toxin can cause weakness and neck or shoulder discomfort. Product authenticity, injector training and an emergency plan matter more than the price.",
    updated: "November 9, 2026",
    readingTime: "8-minute guide",
    takeaways: [
      "Expect some swelling and tenderness; know which symptoms are not normal.",
      "Sudden severe pain or skin colour change after filler needs same-day medical review.",
      "Verify the product, the injector and the complication plan before treatment.",
    ],
    sections: [
      {
        title: "Common, usually temporary side effects",
        paragraphs: [
          "Clinics offering shoulder filler commonly list swelling, redness, warmth, bruising and tenderness, with swelling sometimes lasting one to two weeks. Mild unevenness between the two sides can appear while swelling settles.",
          "After trapezius toxin, some people report shoulder or neck discomfort and tiring more easily in the first weeks. These effects usually ease, but they should be discussed before treatment if your work or exercise depends on shoulder strength.",
        ],
      },
      {
        title: "Less common filler complications",
        paragraphs: [
          "Large-volume body filler can form palpable lumps or nodules, shift from where it was placed, or provoke inflammation. Infection is possible with any injection, particularly when sterile technique or product handling is poor.",
          "Because body treatments use much more product than facial treatments, counterfeit or unregistered fillers are a particular concern. Ask to see the sealed packaging and product label, and keep the batch number in your records.",
        ],
      },
      {
        title: "Vascular occlusion: rare but serious",
        paragraphs: [
          "Vascular occlusion happens when filler enters an artery or compresses one from outside. Medical literature describes it as a rare but rapidly progressive complication of hyaluronic acid filler that can lead to skin necrosis if not recognised and treated quickly. Most published cases involve the face, and data specific to the shoulder are limited, so no one can give you a precise shoulder risk figure.",
          "The main emergency treatment for hyaluronic acid filler occlusion is hyaluronidase, an enzyme that dissolves the gel. Outcomes are better when treatment starts early, which is why the injector should have hyaluronidase on hand and a clear protocol.",
        ],
        bullets: [
          "Severe or worsening pain at or beyond the injection area",
          "Skin that turns pale, white, blue, purple or blotchy",
          "Coldness, blistering or dark patches in the days after treatment",
        ],
      },
      {
        title: "Toxin risks in the trapezius",
        paragraphs: [
          "The trapezius helps lift the shoulders, steady the neck and control the shoulder blade. Specialists warn that excessive or repeated toxin can over-relax it, weakening support for the scapula and potentially triggering shoulder and neck pain. Rarely, toxin effects can spread beyond the intended muscle.",
          "Evidence for the cosmetic effect comes mostly from small observational studies, and the treatment is off-label in most markets. Dosing should be conservative and symmetrical, and you should be told how strength may be affected.",
        ],
      },
      {
        title: "Safety checks before treatment in China",
        paragraphs: [
          "China regulates medical aesthetic services and the institutions that provide them. Injectable fillers are registered medical devices, and injections should be performed by licensed medical staff in a licensed medical institution, not in a beauty salon or hotel room.",
        ],
        bullets: [
          "Confirm the facility holds a medical institution licence that covers medical aesthetics.",
          "Confirm the injector is a licensed doctor with relevant training, not only a consultant.",
          "Check the filler's registration and indication, and keep the batch label.",
          "Ask whether hyaluronidase is stocked and who you contact at night or after you fly home.",
          "Avoid stacking multiple new treatments in one visit if you are travelling soon after.",
        ],
      },
    ],
    faqs: [
      ["What are the side effects of shoulder filler?", "Most are temporary: swelling, bruising, tenderness, warmth and mild asymmetry. Less often there may be lumps, migration or infection. Rarely, filler can block a blood vessel."],
      ["Is shoulder filler dangerous?", "It carries real but mostly manageable risks when a licensed clinician uses a registered product with sterile technique and an emergency plan. Risk rises sharply with unlicensed injectors or unverified products."],
      ["What should I do if my skin changes colour after filler?", "Treat sudden severe pain or pale, blue or mottled skin as urgent. Contact the treating clinic immediately and seek emergency care if you cannot reach them quickly."],
      ["Can trapezius botox weaken my shoulders?", "Yes, that is its mechanism. Appropriate doses usually cause mild weakness, but excessive doses can reduce shoulder blade support and cause discomfort."],
    ],
    sources: [
      { title: "Vascular Occlusion after Hyaluronic Acid Filler Injection", publisher: "Clinical Practice and Cases in Emergency Medicine (PMC)", url: VASCULAR_OCCLUSION_CASE },
      { title: "Critical Ischemia Following Hyaluronic Acid Filler Injection: A Case Report", publisher: "Journal of Clinical Medicine (PMC)", url: CRITICAL_ISCHEMIA_CASE },
      { title: "Complications of Injectable Fillers, Part 2: Vascular Complications", publisher: "Aesthetic Surgery Journal", url: DELORENZI_VASCULAR },
      { title: "Experts warn of risks with shoulder slimming injections", publisher: "The Standard (Hong Kong)", url: STANDARD_SQUARE_SHOULDERS },
      { title: "Trap Tox: Botox in the Trapezius, Evidence and Risks", publisher: "Acibadem International", url: TRAP_TOX_EVIDENCE },
      { title: "Medical Aesthetic Services Management Measures", publisher: "National Health Commission of the PRC", url: CHINA_COSMETIC_RULES },
    ],
    related: [
      { label: "Shoulder filler injections in China explained", href: "/medical-tourism-china/shoulder-filler-injections-china" },
      { label: "Safety checks for medical travel in China", href: "/medical-tourism-china/safety" },
      { label: "How we verify providers", href: "/provider-verification" },
    ],
  },
  {
    slug: "bubble-face-china",
    title: "China's 'Bubble Face' Trend: Growth Factor Injection Risks",
    description: "What 'bubble face' (泡泡脸, 馒化脸) means in China, why illegal growth factor injections cause it, and how to tell it apart from overfilled hyaluronic acid.",
    kicker: "Aesthetic trend explained",
    heading: "China's 'bubble face': why growth factor injections can make a face keep swelling.",
    intro: "Videos of puffy, distorted faces labelled 'bubble face' have spread from Chinese social media to TikTok and YouTube. Behind most of them is not ordinary filler but an illegal injection marketed as a permanent youth treatment.",
    answer: "'Bubble face' describes a face that becomes puffy, lumpy or progressively distorted after cosmetic injections. In China it is most closely linked to injected growth factors, such as epidermal growth factor, sold as 'baby face' or 'self-collagen' treatments. China's drug regulator does not permit growth factors for injection in aesthetic procedures, and doctors warn they can trigger uncontrolled tissue growth that is hard or impossible to fully remove.",
    updated: "November 9, 2026",
    readingTime: "7-minute guide",
    takeaways: [
      "Bubble face is mainly linked to illegal growth factor injections, not to registered fillers.",
      "Growth factors are permitted for topical medical use only, not for cosmetic injection in China.",
      "Avoid any injection described as permanent, self-regenerating or sold outside a licensed clinic.",
    ],
    sections: [
      {
        title: "What people mean by bubble face",
        paragraphs: [
          "Chinese users describe the problem as 泡泡脸 (bubble face) or 馒化脸 (steamed bun face). Affected faces look swollen and shapeless, sometimes with hard lumps around the temples, cheeks, forehead or chin, and the change may continue months after treatment.",
          "The term is also used loosely online for any overfilled face. That broader meaning matters, because an overfilled hyaluronic acid face and a growth factor reaction have very different causes and treatment options.",
        ],
      },
      {
        title: "Why growth factor injections cause it",
        paragraphs: [
          "Growth factors are proteins that signal cells to grow and multiply. In medicine, topical growth factors are used to help wounds heal. Injected into facial soft tissue, especially in uncontrolled doses or impure forms, they can trigger ongoing proliferation, so the initial plumping does not stop where intended.",
          "Doctors interviewed by Chinese media list the main risks as uncontrolled tissue growth and deformity, chronic inflammation or persistent redness, infection and lumps. Because the tissue the body has grown is not a gel that can be dissolved, correction often requires surgery and may still be incomplete.",
        ],
      },
      {
        title: "What Chinese regulators and doctors say",
        paragraphs: [
          "In January 2019 China's National Medical Products Administration stated that human oligopeptide-1, the cosmetic name for epidermal growth factor, may not be used as a cosmetic ingredient and must not be used in injectable aesthetic procedures. Plastic surgeons quoted in state media have repeated that growth factors are for external use only and that injecting them is illegal.",
          "Despite this, a 2025 Beijing News investigation found growth factor powders sold cheaply online and repackaged by unlicensed operators under names such as 活性细胞液 (active cell fluid), 生长肽 (growth peptide) and 细胞激活素 (cell activator), then sold through acquaintances and social platforms for thousands of yuan.",
        ],
      },
      {
        title: "Bubble face versus overfilled hyaluronic acid",
        paragraphs: [
          "Knowing which product was injected changes what can be done, so keep records of every product name and batch.",
        ],
        table: {
          caption: "Two causes of a puffy, overfilled face",
          headers: ["Factor", "Growth factor reaction", "Overfilled hyaluronic acid"],
          rows: [
            ["Product status in China", "Not permitted for cosmetic injection", "Registered medical devices for specific indications"],
            ["What happens", "Tissue keeps growing and may harden", "Too much gel, or gel that has migrated or attracted water"],
            ["Timing", "May worsen months after injection", "Usually visible soon after treatment"],
            ["Correction", "Often surgical, and may be incomplete", "Usually dissolvable with hyaluronidase"],
          ],
        },
      },
      {
        title: "How to avoid it",
        paragraphs: [
          "The safest protection is to refuse any injection you cannot verify. Red flags appear in the marketing long before anything goes wrong.",
        ],
        bullets: [
          "Claims of permanent results, 'self-collagen growth' or a 'baby face package'.",
          "Treatment offered in a salon, private home, hotel room or by an unlicensed injector.",
          "Unlabelled vials, powders mixed on the spot, or refusal to show packaging.",
          "Prices far below those of registered fillers at licensed hospitals.",
          "Pressure to decide quickly or to pay before seeing a doctor.",
        ],
      },
    ],
    faqs: [
      ["What is bubble face in China?", "It is a nickname for faces that become swollen, lumpy and distorted after cosmetic injections, most often linked to illegal growth factor injections marketed as youth or 'baby face' treatments."],
      ["Are growth factor injections legal in China?", "No. China's drug regulator does not allow epidermal growth factor in injectable aesthetic procedures, and doctors stress that growth factors are approved for topical use only."],
      ["Can bubble face be reversed?", "Growth factor tissue overgrowth cannot be dissolved like hyaluronic acid. Treatment may involve anti-inflammatory care and surgery, and full correction is not always possible."],
      ["Does hyaluronic acid filler cause bubble face?", "Overfilling with hyaluronic acid can make a face look puffy, but it is a different problem and can usually be corrected with hyaluronidase."],
    ],
    sources: [
      { title: "Investigation into illegal growth factor injections (Chinese)", publisher: "The Beijing News", url: BJNEWS_GROWTH_FACTOR },
      { title: "Growth factors are for external use only; injection may disfigure (Chinese)", publisher: "Science and Technology Daily via China News", url: STDAILY_GROWTH_FACTOR },
      { title: "Hubei woman's face deformed after growth factor injection (Chinese)", publisher: "HK01", url: HK01_GROWTH_FACTOR },
      { title: "Guidance on Strengthening Medical Aesthetic Industry Oversight", publisher: "State Administration for Market Regulation", url: CHINA_COSMETIC_OVERSIGHT },
    ],
    related: [
      { label: "Dermal fillers in China", href: "/treatments/dermal-fillers" },
      { label: "Choose a plastic surgeon in China", href: "/choose-plastic-surgeon-china" },
      { label: "How we verify providers", href: "/provider-verification" },
    ],
  },
  {
    slug: "chinese-plastic-surgery",
    title: "Chinese Plastic Surgery: Popular Procedures and Beauty Ideals",
    description: "The procedures most requested in Chinese plastic surgery, the beauty ideals behind them, how the industry is regulated and what to check first.",
    kicker: "Industry overview",
    heading: "Chinese plastic surgery: what is popular, why, and how to choose carefully.",
    intro: "China has one of the world's largest medical aesthetics markets, with a young patient base and strong influence from social media. Understanding the popular procedures and the ideals behind them helps international patients ask better questions.",
    answer: "Chinese plastic surgery is dominated by facial procedures, especially double eyelid surgery, nose augmentation and jaw or facial contouring, alongside very high use of injectables such as hyaluronic acid filler and botulinum toxin. Patients skew young. Quality varies widely between licensed hospitals and unlicensed operators, so verifying the surgeon and facility matters more than following a trend.",
    updated: "November 9, 2026",
    readingTime: "8-minute guide",
    takeaways: [
      "Eyelid, nose and facial contouring procedures lead surgical demand in China.",
      "Injectables are the most common entry point, especially for younger patients.",
      "Choose by verified surgeon and facility, not by a trending face shape.",
    ],
    sections: [
      {
        title: "The most requested procedures",
        paragraphs: [
          "Chinese aesthetic surgery associations have long reported double eyelid surgery as the most popular procedure, followed by nose bridge augmentation and procedures that narrow or refine the jawline. Media reporting in recent years still describes double eyelid surgery and under-eye bag removal as among the most sought-after treatments for young patients.",
          "This mirrors global data: the International Society of Aesthetic Plastic Surgery reported eyelid surgery as the most common surgical cosmetic procedure worldwide in 2024. What differs in China is the technique, because Asian eyelid and nasal anatomy call for specific surgical approaches.",
        ],
        table: {
          caption: "Common procedures and typical goals",
          headers: ["Procedure", "Common goal", "Type"],
          rows: [
            ["Double eyelid surgery", "Create or refine an upper eyelid crease", "Surgical"],
            ["Rhinoplasty and nose augmentation", "Raise the bridge or refine the tip", "Surgical"],
            ["Jaw contouring and zygoma reduction", "Soften a wide or square lower face", "Surgical"],
            ["Fillers and botulinum toxin", "Contour, smooth or slim without surgery", "Non-surgical"],
          ],
        },
      },
      {
        title: "The beauty ideals behind the trends",
        paragraphs: [
          "Popular aesthetic references in China often emphasise larger-looking eyes, a higher nose bridge, a smaller V-shaped lower face and smooth, youthful skin. Social media filters and influencer culture have reinforced a narrow 'internet celebrity face' look, and many surgeons now warn patients against copying it wholesale.",
          "Expert consensus on hyaluronic acid filler for Chinese patients notes features such as a lower nasal bridge, flatter midface and smaller chin, and recommends treatment plans based on each person's anatomy rather than a single template. That principle applies equally to surgery.",
        ],
      },
      {
        title: "A young and fast-growing market",
        paragraphs: [
          "KPMG's 2025 industry report describes China's medical aesthetics sector as one of the largest in the world and notes that China had around 5,000 plastic surgeons in 2024, about 8.5 percent of the global total. Surveys cited by industry analysts consistently find that consumers under 30 make up a large share of patients.",
          "Summer holidays after school and university exams are a peak season for procedures such as double eyelid surgery, according to Chinese hospital staff interviewed by the South China Morning Post.",
        ],
      },
      {
        title: "How the industry is regulated",
        paragraphs: [
          "China's National Health Commission sets rules for medical aesthetic services and the institutions that may provide them, and market regulators have run repeated campaigns against illegal practitioners, unregistered products and misleading advertising. Surgery and injections must be performed by licensed medical professionals in licensed medical institutions.",
          "Problems most often arise outside that system: in beauty salons, unregistered studios or through social media sellers. Cases such as the 'bubble face' growth factor injections show how illegal products can circulate despite clear bans.",
        ],
      },
      {
        title: "What international patients should check",
        paragraphs: [
          "Treat a trend as a conversation starter, not a plan. A suitable surgeon will explain what is realistic for your anatomy and what they would not recommend.",
        ],
        bullets: [
          "The surgeon's licence, specialty and experience with your specific procedure.",
          "The facility's medical institution licence and its anesthesia and emergency arrangements.",
          "A written plan with the exact procedure, products or implants, total cost and follow-up.",
          "Clinical interpretation during consultation, consent and discharge.",
          "A recovery period in China long enough for early reviews before you fly.",
        ],
      },
    ],
    faqs: [
      ["What is the most popular plastic surgery in China?", "Double eyelid surgery is consistently reported as the most popular procedure, followed by nose augmentation and facial contouring such as jaw reduction."],
      ["Why is plastic surgery so popular in China?", "Rising incomes, social media influence, wider acceptance of minimally invasive treatments and a large, competitive provider market have all contributed, with young adults forming a large share of patients."],
      ["Is plastic surgery in China safe?", "Safety depends on the individual surgeon, facility and product. Licensed hospitals and specialist clinics can provide high-quality care, while unlicensed operators and unregistered products carry serious risks."],
      ["Can foreigners have plastic surgery in China?", "Yes. International patients can be treated at licensed hospitals and clinics, but should verify credentials, arrange clinical interpretation and plan for recovery and follow-up."],
    ],
    sources: [
      { title: "Redefining Beauty: Navigating China's Medical Aesthetics Upheaval", publisher: "KPMG China (2025)", url: KPMG_CHINA_AESTHETICS },
      { title: "Global Survey 2024", publisher: "International Society of Aesthetic Plastic Surgery", url: ISAPS_GLOBAL_SURVEY },
      { title: "In China, double-eyelid surgery and filler injections grow in popularity among graduates", publisher: "South China Morning Post", url: SCMP_YOUNG_PATIENTS },
      { title: "Expert Consensus on Hyaluronic Acid Filler Facial Injection for Chinese Patients", publisher: "Plastic and Reconstructive Surgery Global Open (PMC)", url: HA_CONSENSUS_CHINESE },
      { title: "Medical Aesthetic Services Management Measures", publisher: "National Health Commission of the PRC", url: CHINA_COSMETIC_RULES },
    ],
    related: [
      { label: "Plastic surgery in China: complete guide", href: "/plastic-surgery-china" },
      { label: "Choose a plastic surgeon in China", href: "/choose-plastic-surgeon-china" },
      { label: "China vs Korea for cosmetic surgery", href: "/china-vs-korea-cosmetic-surgery" },
    ],
  },
];

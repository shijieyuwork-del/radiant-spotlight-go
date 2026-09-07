export type GuideSource = {
  title: string;
  publisher: string;
  url: string;
};

export type GuideTable = {
  caption: string;
  headers: string[];
  rows: string[][];
};

export type GuideSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  table?: GuideTable;
};

export type MedicalTourismGuide = {
  slug: string;
  title: string;
  description: string;
  kicker: string;
  heading: string;
  intro: string;
  answer: string;
  updated: string;
  readingTime: string;
  takeaways: string[];
  sections: GuideSection[];
  faqs: Array<[string, string]>;
  sources: GuideSource[];
  related: Array<{ label: string; href: string }>;
};

const CDC_MEDICAL_TOURISM = "https://www.cdc.gov/yellow-book/hcp/health-care-abroad/medical-tourism.html";
const CHINA_VISA_CATEGORIES = "https://www.visaforchina.cn/TNR4_EN/qianzhengyewu/jichuzhishi/banliliucheng";
const CHINA_HOSPITALS = "https://en.nhc.gov.cn/2019-03/19/c_75863.htm";
const CHINA_OUTPATIENT = "https://en.nhc.gov.cn/2025-12/12/c_86551.htm";
const SHANGHAI_MEDICAL = "https://english.shanghai.gov.cn/en-IntlMedicalServices/index.html";
const BEIJING_PUMCH = "https://english.beijing.gov.cn/quickguideservices/medicalguide/majormedicalinstitutions/202312/t20231220_3505728.html";
const KOREA_REGISTRATION = "https://www.medicalkorea.or.kr/en/registeredsystem";
const KOREA_VISA = "https://www.medicalkorea.or.kr/en/medicalvisa";
const CHINA_COSMETIC_RULES = "https://www.nhc.gov.cn/wjw/c100221/202201/d7e8fa33a26b425da98d69fb04191699.shtml";
const CHINA_COSMETIC_OVERSIGHT = "https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/ggjgs/art/2023/art_ab97d5643ddc45ae861e7f351842f512.html";
const ASPS_TRAVELING_FOR_SURGERY = "https://www.plasticsurgery.org/documents/health-policy/resources/2024-appropriate-care-of-patients-traveling-for-surgery.pdf";

export const MEDICAL_TOURISM_GUIDES: MedicalTourismGuide[] = [
  {
    slug: "costs",
    title: "Medical Tourism in China Costs: A Complete Budget Guide",
    description: "Build a realistic medical tourism budget for China, including treatment, hospital, travel, accommodation, translation, recovery and follow-up costs.",
    kicker: "Cost planning",
    heading: "Medical tourism in China costs: plan the whole trip, not one price.",
    intro: "A procedure quote is only one part of the budget. This guide shows international patients how to compare written estimates, separate medical charges from travel costs and reserve money for changes to the plan.",
    answer: "The cost of medical tourism in China depends on the procedure, clinician, facility, anesthesia, tests, length of stay and recovery needs. The safest comparison is a written, itemized estimate from the treating institution plus a separate travel and contingency budget.",
    updated: "September 7, 2026",
    readingTime: "8-minute guide",
    takeaways: [
      "Compare like-for-like written estimates, not headline package prices.",
      "Keep medical, travel and contingency costs in separate budget columns.",
      "Ask who pays if the plan changes or additional follow-up is needed.",
    ],
    sections: [
      {
        title: "Start with an itemized medical estimate",
        paragraphs: [
          "Ask the treating hospital or clinic to identify the proposed procedure, treating clinician and facility before discussing a final budget. An early online estimate can help with planning, but examination, tests or a change in clinical plan may alter it.",
          "The document should separate professional fees, facility or operating-room charges, anesthesia, preoperative tests, medication, devices or implants, hospital stay and scheduled follow-up. Ask whether taxes, deposits and payment processing fees are included and which parts are refundable if treatment does not proceed.",
        ],
        bullets: [
          "Name of the clinician and legal name of the treating facility",
          "What is included, optional and explicitly excluded",
          "Deposit, cancellation and rescheduling terms",
          "Currency, accepted payment methods and refund timing",
        ],
      },
      {
        title: "Build a separate travel budget",
        paragraphs: [
          "Flights, visas, local transport, accommodation and meals are easier to underestimate than to forget. Flexible fares and accommodation near the treating facility can cost more, but they may reduce disruption if an appointment changes. A companion may also need flights, meals and a larger room.",
          "Do not schedule an early return flight simply to reduce hotel nights. The treating clinician should decide when travel is appropriate. If recovery takes longer than expected, the relevant cost is not only another hotel night; it may include a changed flight, additional review and a companion's extended stay.",
        ],
        table: {
          caption: "Budget worksheet",
          headers: ["Budget group", "Include", "Confirm with"],
          rows: [
            ["Medical", "Consultation, tests, treatment, anesthesia, medication", "Treating institution"],
            ["Recovery", "Garments, wound care, review visits, extra nights", "Clinical team"],
            ["Travel", "Visa, flights, transfers, hotel, companion", "Official sources and suppliers"],
            ["Contingency", "Plan changes, delayed flight, additional care", "Provider and insurer"],
          ],
        },
      },
      {
        title: "Understand coordination and translation charges",
        paragraphs: [
          "Ask whether interpretation is provided by the hospital, by an independent interpreter or by a travel coordinator. Confirm the language, hours and settings covered. Interpretation during consent and discharge is different from general travel translation.",
          "CeladonChina currently provides initial coordination, airport pickup, interpretation assistance and hotel-booking support without a separate service charge when confirmed for an eligible care journey. Medical treatment, travel, accommodation and third-party services remain separate. The written journey summary should show the distinction before you book.",
        ],
      },
      {
        title: "Price should not replace provider checks",
        paragraphs: [
          "A lower estimate does not show whether a facility is authorized for the proposed procedure, who will administer anesthesia or how complications are handled. Compare the clinician and facility first, then compare the full scope of care.",
          "China includes public hospitals, private hospitals, international departments and smaller clinics with different service models. The National Health Commission notes that international-oriented institutions may have higher charges and that overseas insurance is not routinely accepted by many public hospitals. Confirm coverage and direct billing with both the institution and your insurer.",
        ],
      },
      {
        title: "Questions to ask before paying",
        paragraphs: [
          "A responsible estimate should be understandable without a sales call. If a charge is conditional, ask what triggers it and who authorizes it. Keep the version you accepted, proof of payment and the institution's cancellation terms.",
        ],
        bullets: [
          "Can the price change after examination, and under what circumstances?",
          "Does the estimate cover complications, revision treatment or extra nights?",
          "Which follow-up visits are included, including after I return home?",
          "Will I receive an invoice and medical record in a language I can use at home?",
        ],
      },
    ],
    faqs: [
      ["Is medical treatment in China always cheaper?", "No. Cost varies by institution, clinician, procedure and service level. International departments and private facilities can cost substantially more than local public-hospital services."],
      ["Does CeladonChina set medical prices?", "No. Treating institutions set their own charges. CeladonChina can help organize estimates so patients can compare what is included."],
      ["Should I pay the full amount before traveling?", "Payment terms vary. Before paying, confirm the recipient, refund conditions, proposed clinician and facility, and obtain the terms in writing."],
    ],
    sources: [
      { title: "Hospitals in China", publisher: "National Health Commission of the PRC", url: CHINA_HOSPITALS },
      { title: "Medical Tourism", publisher: "CDC Yellow Book", url: CDC_MEDICAL_TOURISM },
    ],
    related: [
      { label: "Plastic surgery costs in China", href: "/plastic-surgery-china#costs" },
      { label: "China medical tourism safety", href: "/medical-tourism-china/safety" },
      { label: "Browse procedure guides", href: "/treatments" },
    ],
  },
  {
    slug: "safety",
    title: "Is Medical Tourism in China Safe? A Patient Checklist",
    description: "Assess medical tourism safety in China by checking the clinician, facility, anesthesia, infection controls, consent, recovery and follow-up plan.",
    kicker: "Safety planning",
    heading: "Is medical tourism in China safe? Check the care, not the country label.",
    intro: "No destination, hospital category or accreditation can guarantee a safe outcome. Risk depends on the patient, procedure, clinician, facility, anesthesia plan and continuity of care.",
    answer: "Medical tourism in China can be planned more safely, but no procedure is risk-free. Verify the individual clinician and facility, discuss personal risks with a qualified professional, understand the consent and emergency plan, and arrange follow-up before traveling.",
    updated: "September 7, 2026",
    readingTime: "9-minute guide",
    takeaways: [
      "Verify the clinician and the treating facility separately.",
      "Ask about anesthesia, infection control and emergency transfer before paying.",
      "Plan local and home-country follow-up before treatment.",
    ],
    sections: [
      {
        title: "Begin with your own medical suitability",
        paragraphs: [
          "A popular procedure or impressive result online does not establish that treatment is appropriate for you. Share an accurate medical history, medication and allergy list, previous procedures and relevant records with the treating clinician. Ask whether an in-person examination or additional tests are required before a final decision.",
          "Consider a pretravel consultation with your usual clinician or a travel-medicine professional. The CDC recommends discussing destination-specific and individual health risks before medical travel and emphasizes that complications can occur in any country.",
        ],
      },
      {
        title: "Verify the clinician",
        paragraphs: [
          "Confirm the clinician's legal name, current registration, specialty training, experience with the proposed procedure and permission to practise at the named facility. Ask who performs each important part of the treatment and who reviews you afterward.",
          "Social media followers, awards without an issuing body and unlabeled before-and-after photographs are not substitutes for verifiable credentials. If a coordinator supplies information, independently confirm it with the treating institution wherever possible.",
        ],
        bullets: [
          "Current professional registration and specialty",
          "Named facility and admitting or operating privileges",
          "Relevant procedure experience and realistic limitations",
          "Named clinician responsible for postoperative care",
        ],
      },
      {
        title: "Verify the facility and anesthesia plan",
        paragraphs: [
          "Confirm the facility's legal name, address and authority to perform the proposed treatment. For surgery, ask who administers anesthesia, how the patient is monitored, where recovery takes place and whether overnight observation may be required.",
          "Ask how the facility prevents infection, manages medicines and implants, responds to an emergency and transfers patients who need a higher level of care. Accreditation or a hospital grade can be useful context, but it does not guarantee an individual result.",
        ],
      },
      {
        title: "Make consent understandable",
        paragraphs: [
          "Consent should cover the proposed treatment, material risks, alternatives, expected recovery, limitations and the possibility of no treatment. You should know which language will be used and whether a qualified interpreter will be present for the clinical discussion, not only for reception and transport.",
          "Do not sign a form you cannot understand. Ask for time to read it, obtain a copy and confirm how last-minute changes to the plan will be explained and documented.",
        ],
      },
      {
        title: "Treat travel and follow-up as safety issues",
        paragraphs: [
          "Long travel soon after surgery can add risk, including blood clots. Recovery timelines vary, so the treating clinician should advise when you may fly, exercise, swim or resume other activities. Marketing recovery times are not travel clearance.",
          "Before treatment, identify a contact in China, warning signs that require urgent care, the nearest appropriate emergency facility and a clinician at home who can review your records if necessary. Request discharge information, prescriptions, implant or device details and procedure notes in a usable language.",
        ],
      },
    ],
    faqs: [
      ["Does hospital accreditation guarantee safety?", "No. Accreditation can be one useful signal, but outcomes also depend on the clinician, procedure, patient, anesthesia, infection control and follow-up."],
      ["Can a coordinator decide which procedure is safest?", "No. A coordinator may organize information and appointments, but only qualified treating professionals can assess candidacy, risks and treatment options."],
      ["What should I do if I feel pressured to book?", "Pause. Ask for the proposed plan, clinician, facility, costs, risks and cancellation terms in writing, and seek an independent clinical opinion if needed."],
    ],
    sources: [
      { title: "Medical Tourism", publisher: "CDC Yellow Book", url: CDC_MEDICAL_TOURISM },
      { title: "Hospitals in China", publisher: "National Health Commission of the PRC", url: CHINA_HOSPITALS },
    ],
    related: [
      { label: "Provider verification standards", href: "/provider-verification" },
      { label: "Recovery and aftercare", href: "/medical-tourism-china/recovery" },
      { label: "Medical review policy", href: "/medical-review-policy" },
    ],
  },
  {
    slug: "visa",
    title: "China Medical Visa and Entry Requirements for Patients",
    description: "Plan entry to China for medical treatment: check the correct visa route, hospital documents, passport rules and current official requirements before booking.",
    kicker: "Entry planning",
    heading: "China medical visa and entry requirements: verify before you book.",
    intro: "China entry rules depend on nationality, location of application, length of stay and purpose of travel. Requirements can change, so this page explains the planning process rather than promising one visa route.",
    answer: "There is no single visa answer for every international patient. China's official visa guidance includes medical treatment under certain private-matters applications, but the correct route and required documents depend on the applicant and consular jurisdiction. Confirm directly with the responsible Chinese embassy, consulate or official visa center.",
    updated: "September 7, 2026",
    readingTime: "7-minute guide",
    takeaways: [
      "Do not assume a tourist entry route is appropriate for planned treatment.",
      "Use the official visa center serving your place of legal residence.",
      "Keep treatment dates flexible until entry permission is confirmed.",
    ],
    sections: [
      {
        title: "Identify the correct authority",
        paragraphs: [
          "Start with the Chinese embassy, consulate or official Chinese Visa Application Service Center responsible for the place where you legally reside. Advice from an airline, clinic, travel agent or social media post may not reflect the rules that apply to your passport and application location.",
          "Official visa-category guidance lists medical treatment among examples of short-term private matters, but this does not mean every medical traveler automatically qualifies for the same category. Visa-free transit or visa-exemption policies may also have limits on purpose, route and duration.",
        ],
      },
      {
        title: "Ask the treating institution for documentation",
        paragraphs: [
          "If the relevant authority requires evidence of medical purpose, ask the treating institution what it can issue. The document may need the institution's legal name and contact details, the patient's name, appointment or proposed treatment dates and an authorized signature or seal.",
          "Make sure the institution and dates match the information in your application. Do not use altered, fabricated or generic invitation documents. If a third party assists, review every field before submission and keep copies of the complete application.",
        ],
        bullets: [
          "Passport name exactly as shown on the travel document",
          "Treating institution's legal name and address",
          "Appointment or anticipated treatment period",
          "Contact person who can confirm the document",
        ],
      },
      {
        title: "Keep bookings flexible",
        paragraphs: [
          "A treatment appointment is not permission to enter China, and a visa does not confirm medical suitability. Avoid non-refundable flights, hotels or treatment deposits until you understand both the entry decision and the provider's cancellation terms.",
          "Allow time for requests for additional documents, passport return and possible schedule changes. Check that your planned stay includes assessment and recovery rather than only the treatment date.",
        ],
      },
      {
        title: "Prepare for arrival and registration",
        paragraphs: [
          "Carry the contact details and address of your first accommodation and treating institution. Confirm whether the hotel registers foreign guests automatically and ask what local registration steps apply if you stay in a private residence.",
          "Keep essential medical records, prescriptions and appointment confirmation accessible during travel, but protect sensitive information. Store an encrypted copy separately from the originals and share records only with people who need them for care or entry processing.",
        ],
      },
      {
        title: "Recheck immediately before departure",
        paragraphs: [
          "Visa and entry policies can change after an article is published. Recheck the official authority, airline and destination requirements shortly before departure. Confirm passport validity, permitted stay, number of entries and any conditions attached to the visa or exemption.",
          "CeladonChina can help organize appointment and itinerary information, but cannot issue a visa, guarantee approval or replace advice from a Chinese consular authority.",
        ],
      },
    ],
    faqs: [
      ["Do I always need a special medical visa for China?", "Not necessarily. The correct entry route depends on nationality, residence, purpose, itinerary and length of stay. Confirm with the responsible official Chinese authority."],
      ["Can CeladonChina guarantee visa approval?", "No. Visas and entry decisions are made by the relevant authorities. CeladonChina can only help organize available appointment and itinerary information."],
      ["Should I book treatment before applying?", "You may need appointment documentation, but avoid assuming approval. Confirm document requirements and understand all cancellation terms before making non-refundable payments."],
    ],
    sources: [
      { title: "Visa Category", publisher: "Chinese Visa Application Service Center", url: CHINA_VISA_CATEGORIES },
    ],
    related: [
      { label: "Medical tourism planning guide", href: "/medical-tourism-china" },
      { label: "Travel support", href: "/travel-packages" },
      { label: "Medical travel checklist", href: "/medical-tourism-china/checklist" },
    ],
  },
  {
    slug: "best-cities",
    title: "Best Cities in China for Medical Tourism: How to Choose",
    description: "Compare Beijing, Shanghai, Guangzhou, Hangzhou and Hainan for medical travel using provider fit, international access, recovery and follow-up needs.",
    kicker: "Destination comparison",
    heading: "The best city in China for medical tourism is the one that fits your care plan.",
    intro: "Choose the clinician and appropriate facility before choosing a skyline. The practical difference between cities is often access to the right specialty, international services, flight routes and a workable recovery environment.",
    answer: "There is no single best city for every medical traveler. Beijing and Shanghai offer large hospital systems and established international services; Guangzhou and Hangzhou can suit patients with specific provider or regional access needs; Hainan has a distinct medical-tourism policy environment. The treating team and follow-up plan matter more than city popularity.",
    updated: "September 7, 2026",
    readingTime: "8-minute guide",
    takeaways: [
      "Choose a verified clinician and facility before optimizing the destination.",
      "Compare flight access, nearby accommodation and emergency care.",
      "Avoid changing cities during early postoperative recovery unless cleared.",
    ],
    sections: [
      {
        title: "Compare cities using care criteria",
        paragraphs: [
          "A city becomes relevant only after it offers an appropriate clinician and facility. Compare the specialty required, availability of anesthesia and inpatient care, international-patient support, appointment lead time and the ability to provide follow-up.",
          "Then consider direct flights, travel time from the airport, accommodation near the facility, accessibility during recovery and whether a companion can manage daily needs. A lower hotel rate is not useful if every review requires a long journey.",
        ],
      },
      {
        title: "Beijing and Shanghai",
        paragraphs: [
          "Beijing has major national hospital systems and specialist centers. Some institutions offer dedicated international medical services; official Beijing guidance, for example, describes an English-language appointment route for the International Medical Services department at Peking Union Medical College Hospital.",
          "Shanghai combines broad international transport links with public-hospital international departments, private facilities and services aimed at expatriates. The municipal international medical-services directory is a useful starting point, but patients should still verify the individual department, clinician and proposed facility directly.",
        ],
        table: {
          caption: "High-level destination comparison",
          headers: ["Destination", "May suit", "Check carefully"],
          rows: [
            ["Beijing", "Complex specialist or major-hospital access", "Appointment route and language support"],
            ["Shanghai", "International access and broad provider choice", "Service level, pricing and exact facility"],
            ["Guangzhou", "Southern China access and selected specialties", "Flight route and postoperative location"],
            ["Hangzhou", "A named provider in the Yangtze River Delta", "Transfer time and emergency plan"],
            ["Hainan", "Services operating within its medical-tourism environment", "Exact treatment authorization and follow-up"],
          ],
        },
      },
      {
        title: "Guangzhou and Hangzhou",
        paragraphs: [
          "Guangzhou can be convenient for patients traveling through southern China and the Greater Bay Area. Its suitability depends on the named provider and whether the planned facility has the required scope, language support and follow-up capacity.",
          "Hangzhou offers access within the Yangtze River Delta and may appeal to patients who prefer a smaller-city recovery setting than Shanghai. Do not choose it for atmosphere alone; confirm how urgent care, postoperative review and any transfer to a higher-level hospital would work.",
        ],
      },
      {
        title: "Hainan and medical-tourism programs",
        paragraphs: [
          "Hainan's Boao Lecheng International Medical Tourism Pilot Zone has policies and services that differ from ordinary city healthcare markets. That can be relevant for certain approved institutions or therapies, but the existence of a pilot zone does not establish that a particular treatment is appropriate or that every advertised service is available to every patient.",
          "Verify the institution, regulatory status, evidence for the treatment, total cost and continuity of care. Experimental, newly introduced or unavailable-at-home treatment requires particularly careful independent medical review.",
        ],
      },
      {
        title: "Stay near the treating team",
        paragraphs: [
          "Medical travel is not a multi-city holiday during early recovery. Ask when you may use trains or flights, how often reviews occur and where to seek help after hours. If you want to add tourism, place it before treatment or after formal clearance rather than building it into the immediate postoperative period.",
          "The final city decision should survive one test: if the plan changes, can you remain close enough to the treating team without creating a financial or travel crisis?",
        ],
      },
    ],
    faqs: [
      ["Is Shanghai the best city for cosmetic surgery in China?", "Shanghai offers broad provider choice and international access, but the best location depends on the individual clinician, facility, procedure and follow-up plan."],
      ["Should I combine several Chinese cities in one medical trip?", "Not during early recovery unless the treating clinician agrees. Multiple transfers can complicate reviews, rest and access to urgent care."],
      ["Does a city guide verify every provider there?", "No. A destination overview cannot replace checks on the named clinician, department and facility."],
    ],
    sources: [
      { title: "International Medical Services in Shanghai", publisher: "Shanghai Municipal Government", url: SHANGHAI_MEDICAL },
      { title: "PUMCH International Medical Services", publisher: "Beijing Municipal Government", url: BEIJING_PUMCH },
      { title: "Hospitals in China", publisher: "National Health Commission of the PRC", url: CHINA_HOSPITALS },
    ],
    related: [
      { label: "Explore China destinations", href: "/cities" },
      { label: "Shanghai guide", href: "/cities/shanghai" },
      { label: "Beijing guide", href: "/cities/beijing" },
    ],
  },
  {
    slug: "hospitals",
    title: "Hospitals in China for International Patients: How to Choose",
    description: "Understand public hospitals, international departments, private hospitals and clinics in China, and learn how to verify a facility before treatment.",
    kicker: "Provider selection",
    heading: "Choosing a hospital in China: match the facility to the care you need.",
    intro: "A famous hospital name is not enough. International patients need to confirm the exact campus, department, clinician, service route and follow-up arrangements attached to their appointment.",
    answer: "International patients in China may use public hospitals, international or VIP departments, private hospitals and specialty clinics. The right choice depends on clinical needs, facility authorization, the named treating professional, language support, emergency capability, payment and continuity of care.",
    updated: "September 7, 2026",
    readingTime: "9-minute guide",
    takeaways: [
      "Verify the exact hospital, campus and department, not only a brand name.",
      "Confirm whether the facility is appropriate for the proposed procedure and anesthesia.",
      "Ask about deposits, insurance, records, interpretation and after-hours care.",
    ],
    sections: [
      {
        title: "Understand the main care settings",
        paragraphs: [
          "China's healthcare system includes large public hospitals, public-hospital international or VIP departments, private hospitals, joint-venture institutions and smaller specialist clinics. They differ in appointment process, language support, room type, payment and the range of care available.",
          "A public hospital may offer deep specialty resources but a busier local workflow. An international department may provide a more accessible appointment and billing experience at a higher cost. A private hospital or clinic may offer convenience, but patients must still verify the scope of practice and emergency arrangements.",
        ],
      },
      {
        title: "Confirm the exact legal and clinical identity",
        paragraphs: [
          "Hospital groups can operate several campuses or partner sites. Ask for the legal name, address and department where assessment and treatment will occur. Confirm that the clinician is scheduled there and authorized to provide the proposed care.",
          "For surgery or sedation, ask whether the site provides the appropriate operating environment, anesthesia team, recovery monitoring and access to emergency escalation. Do not infer these capabilities from the lobby, website or group brand.",
        ],
        bullets: [
          "Legal institution name, campus and department",
          "Named treating clinician and role of each team member",
          "Facility scope for the proposed procedure",
          "Emergency, transfer and after-hours contact plan",
        ],
      },
      {
        title: "Check the international-patient pathway",
        paragraphs: [
          "Ask how overseas patients register, send records, book an appointment and receive results. The National Health Commission publishes general information about hospitals and an outpatient process for international patients, while some municipal governments provide institution-specific directories.",
          "Confirm whether interpretation is available during the clinical consultation and consent process, which documents can be provided in English, and how questions will be handled after discharge. A concierge desk is not necessarily a clinical interpretation service.",
        ],
      },
      {
        title: "Clarify payment and insurance",
        paragraphs: [
          "Many institutions require self-payment or a deposit. Overseas insurance acceptance and direct billing vary by hospital, department and policy. Ask the hospital and insurer separately; a logo on a webpage does not confirm coverage for your procedure.",
          "Obtain the estimate, deposit requirement, accepted payment methods, invoice process and refund terms in writing. If a coordinator collects any payment, identify which entity receives it and whether it is a medical charge or a separate service.",
        ],
      },
      {
        title: "Compare evidence, not convenience alone",
        paragraphs: [
          "A hospital with an English website may be easier to contact, but convenience does not establish clinical quality for a particular procedure. Evaluate the treating clinician, relevant department, facility capability and follow-up plan together.",
          "CeladonChina can organize publicly available and provider-supplied information, but patients should independently confirm material claims with the named institution and seek personalized advice from qualified medical professionals.",
        ],
      },
    ],
    faqs: [
      ["Can foreigners use public hospitals in China?", "Yes, many public hospitals treat international patients, but registration, language support, payment and international-department availability vary by institution."],
      ["Are private hospitals safer than public hospitals?", "Not as a general rule. Safety depends on the specific clinician, facility capability, procedure, patient and follow-up arrangements."],
      ["Will my international insurance be accepted?", "Do not assume so. Confirm coverage, exclusions and direct billing with both the insurer and the exact hospital department before treatment."],
    ],
    sources: [
      { title: "Hospitals in China", publisher: "National Health Commission of the PRC", url: CHINA_HOSPITALS },
      { title: "Outpatient visiting process for international patients", publisher: "National Health Commission of the PRC", url: CHINA_OUTPATIENT },
      { title: "International Medical Services in Shanghai", publisher: "Shanghai Municipal Government", url: SHANGHAI_MEDICAL },
    ],
    related: [
      { label: "Browse clinics and hospitals", href: "/clinics" },
      { label: "Provider verification standards", href: "/provider-verification" },
      { label: "Compare China destinations", href: "/medical-tourism-china/best-cities" },
    ],
  },
  {
    slug: "recovery",
    title: "Recovery After Medical Treatment in China: Travel and Aftercare",
    description: "Plan recovery after surgery or treatment in China, including accommodation, review visits, warning signs, records, flying and follow-up at home.",
    kicker: "Recovery planning",
    heading: "Recovery in China is part of the treatment plan, not extra travel time.",
    intro: "The procedure date is only one point in the journey. A safer plan defines where you will recover, who will review you, when travel is appropriate and how care continues after you return home.",
    answer: "Plan to remain near the treating team for the period they recommend, choose suitable accommodation, arrange a companion when needed, obtain written warning signs and emergency contacts, and confirm follow-up at home before treatment. Only the treating clinician can clear an individual patient to travel.",
    updated: "September 7, 2026",
    readingTime: "8-minute guide",
    takeaways: [
      "Let the clinical plan determine the return date, not the cheapest flight.",
      "Stay close enough for scheduled and urgent review.",
      "Leave China with complete records and a named follow-up route.",
    ],
    sections: [
      {
        title: "Ask for a recovery schedule before treatment",
        paragraphs: [
          "Request a written outline of expected reviews, wound or medication instructions, mobility limits and warning signs. Recovery varies by procedure and patient, and an uncomplicated timeline is not a promise.",
          "Ask which symptoms are expected, which require a same-day call and which require emergency care. Confirm who answers after hours and whether the coordinator, clinic or hospital is responsible for each type of question.",
        ],
      },
      {
        title: "Choose accommodation for recovery",
        paragraphs: [
          "Prioritize distance from the treating facility, quiet, lift access, bathroom safety, food options, laundry and space for a companion over sightseeing value. Confirm whether the property can accommodate a flexible checkout date.",
          "A hotel is not a medical facility. Staff may not be able to provide wound care, medication management or emergency observation. If clinical support is needed, arrange it explicitly with qualified providers.",
        ],
        bullets: [
          "Short, simple route to the treating facility",
          "Accessible entry and lift if mobility may be limited",
          "Reliable phone and internet access",
          "Nearby pharmacy, food and appropriate emergency care",
        ],
      },
      {
        title: "Do not turn early recovery into tourism",
        paragraphs: [
          "Long tours, strenuous activity, swimming, alcohol and sun exposure can conflict with recovery instructions. The CDC advises medical travelers to recognize that typical vacation activities may delay or impede healing.",
          "If travel experiences are important, schedule them before treatment or after the treating clinician has cleared the relevant activity. Build rest days into the itinerary instead of treating them as unused time.",
        ],
      },
      {
        title: "Plan flying and long-distance travel individually",
        paragraphs: [
          "Surgery and prolonged sitting can both contribute to blood-clot risk. The appropriate waiting period depends on the procedure, anesthesia, complications, mobility and personal risk factors. General online timelines cannot replace individual clearance.",
          "Ask the treating clinician when you may fly and what precautions are appropriate. Check airline medical-clearance rules separately. A fit-to-fly letter, when required, is not the same as a guarantee that travel will be uncomplicated.",
        ],
      },
      {
        title: "Create a handover for home",
        paragraphs: [
          "Before leaving, request the procedure or treatment summary, discharge notes, medicines, test results, implant or device information, imaging where relevant and contact details for the treating team. Ask whether records can be supplied in English or professionally translated.",
          "Identify a clinician at home who is willing to provide follow-up, and confirm how the China-based team will respond to questions. Understand that overseas follow-up or treatment of complications may not be covered by insurance.",
        ],
      },
    ],
    faqs: [
      ["How soon can I fly after surgery in China?", "It depends on the operation, anesthesia, recovery and personal risk factors. Obtain individual clearance from the treating clinician and check the airline's rules."],
      ["Can I travel around China while recovering?", "Only if the treating clinician agrees. Early recovery usually benefits from remaining near the team responsible for review and urgent questions."],
      ["What records should I take home?", "Ask for discharge notes, treatment details, prescriptions, test results, implant or device records where relevant, follow-up instructions and emergency contacts."],
    ],
    sources: [
      { title: "Medical Tourism", publisher: "CDC Yellow Book", url: CDC_MEDICAL_TOURISM },
      { title: "What To Do When Sick Abroad", publisher: "CDC Yellow Book", url: "https://www.cdc.gov/yellow-book/hcp/health-care-abroad/what-to-do-when-sick-abroad.html" },
    ],
    related: [
      { label: "Medical travel checklist", href: "/medical-tourism-china/checklist" },
      { label: "China medical tourism safety", href: "/medical-tourism-china/safety" },
      { label: "Travel coordination support", href: "/travel-packages" },
    ],
  },
  {
    slug: "checklist",
    title: "China Medical Tourism Checklist: Before, During and After Care",
    description: "Use this practical China medical tourism checklist to organize provider checks, records, costs, entry, recovery, emergency contacts and follow-up.",
    kicker: "Planning checklist",
    heading: "A China medical tourism checklist for every stage of the journey.",
    intro: "Use this list to organize questions and documents. It does not determine whether treatment is suitable; that decision belongs between you and qualified medical professionals.",
    answer: "A complete medical tourism checklist covers six areas: clinical suitability, clinician and facility verification, written costs, entry and travel, recovery and emergency planning, and continuity of care after returning home.",
    updated: "September 7, 2026",
    readingTime: "6-minute checklist",
    takeaways: [
      "Do not pay until the clinician, facility, scope and terms are clear.",
      "Carry essential records and emergency contacts in an accessible format.",
      "Plan the return journey only after discussing recovery requirements.",
    ],
    sections: [
      {
        title: "Before choosing a provider",
        paragraphs: ["Start with the medical question, not a package. Record what you want to improve, your relevant history and the questions a clinician must answer."],
        bullets: [
          "Prepare medical history, medication, allergy and previous-procedure information",
          "Confirm whether records, imaging or tests are required before consultation",
          "Verify clinician identity, registration, specialty and facility relationship",
          "Confirm the facility's legal name, address and scope for the proposed care",
          "Ask about alternatives, limitations, material risks and no-treatment options",
        ],
      },
      {
        title: "Before paying",
        paragraphs: ["Keep clinical, financial and travel decisions separate enough to review each one. Pressure to pay quickly is a reason to pause, not evidence that an appointment is valuable."],
        bullets: [
          "Obtain the proposed plan and itemized estimate in writing",
          "Read deposit, refund, cancellation and rescheduling terms",
          "Identify the legal recipient of each payment",
          "Confirm what happens if examination changes the plan",
          "Check insurance coverage and exclusions directly with the insurer",
        ],
      },
      {
        title: "Before traveling",
        paragraphs: ["Recheck current entry rules with the official Chinese authority serving your place of residence. Keep bookings flexible until permission and appointment details are confirmed."],
        bullets: [
          "Passport, visa or applicable entry authorization",
          "Appointment confirmation and treating institution contact",
          "Medication in original packaging and relevant prescriptions",
          "Flexible flight and accommodation plan",
          "Travel insurance details and companion plan where appropriate",
        ],
      },
      {
        title: "Before treatment",
        paragraphs: ["Confirm that the in-person discussion matches what you understood remotely. Do not proceed if the clinician, facility or procedure changes without adequate explanation and consent."],
        bullets: [
          "Final treating clinician and procedure confirmed",
          "Consent understood in a language you can use",
          "Anesthesia, monitoring and emergency arrangements explained",
          "Recovery location, review schedule and after-hours contact confirmed",
          "Final price changes documented before payment",
        ],
      },
      {
        title: "Before returning home",
        paragraphs: ["Ask the treating clinician for individualized travel clearance. Make sure the person reviewing you at home has enough information to understand what was done."],
        bullets: [
          "Discharge and treatment summary",
          "Test results, prescriptions and medication schedule",
          "Implant, device or product details where relevant",
          "Written warning signs and emergency instructions",
          "Named contacts in China and at home for follow-up",
        ],
      },
    ],
    faqs: [
      ["Can I use this checklist instead of medical advice?", "No. It organizes planning questions but cannot assess your health, candidacy or treatment risks."],
      ["Should I send my full medical record to a coordinator?", "Share only what is necessary through an agreed secure method. Confirm who receives it, why it is needed and how it will be protected."],
      ["What is the most important item?", "Knowing the exact treating clinician and facility, understanding the proposed care and risks, and having a workable follow-up plan are all essential."],
    ],
    sources: [
      { title: "Medical Tourism", publisher: "CDC Yellow Book", url: CDC_MEDICAL_TOURISM },
      { title: "Visa Category", publisher: "Chinese Visa Application Service Center", url: CHINA_VISA_CATEGORIES },
    ],
    related: [
      { label: "Provider verification standards", href: "/provider-verification" },
      { label: "China medical visa guide", href: "/medical-tourism-china/visa" },
      { label: "Recovery and aftercare", href: "/medical-tourism-china/recovery" },
    ],
  },
  {
    slug: "cosmetic-surgery-tourism-china",
    title: "Cosmetic Surgery Tourism in China: Patient Guide",
    description: "Plan cosmetic surgery tourism in China with guidance on procedures, surgeon and facility checks, costs, travel, interpretation, recovery and follow-up.",
    kicker: "Cosmetic surgery travel",
    heading: "Cosmetic surgery tourism in China, planned around your care.",
    intro: "Travelling for cosmetic surgery combines two decisions that should never be confused: whether a procedure is appropriate and whether the trip can support it safely. This guide connects provider research, written costs, travel logistics and recovery without treating surgery like a holiday package.",
    answer: "Cosmetic surgery tourism in China means travelling to China for an elective aesthetic procedure while arranging the clinical and travel pathway together. Start with a named surgeon and licensed facility, obtain an individualized plan and complete estimate, then build interpretation, accommodation, recovery time and follow-up around the treating team's instructions.",
    updated: "September 7, 2026",
    readingTime: "10-minute guide",
    takeaways: [
      "Choose the surgeon and treating facility before choosing a travel package.",
      "Compare the complete care pathway, not a procedure price or destination image.",
      "Plan local recovery and home-country follow-up before paying or flying.",
    ],
    sections: [
      {
        title: "Separate the medical decision from the destination",
        paragraphs: [
          "China may be attractive because of specialist choice, major-city transport and a broad cosmetic-medicine market. None of those factors establishes that a procedure is suitable for an individual patient. Begin with your goals, health history, previous procedures, medicines, allergies and recovery constraints. A qualified treating clinician should explain the available options, likely limitations and the option of no treatment.",
          "Do not allow a flight deal, hotel package or limited appointment window to set the clinical plan. The procedure, anesthesia, facility and duration of stay should follow the assessment. Travel arrangements come afterward and should remain flexible until the treating team confirms the expected pathway.",
        ],
      },
      {
        title: "Know how cosmetic medical care is regulated in China",
        paragraphs: [
          "China's national rules treat invasive cosmetic techniques as medical services. They require cosmetic medical institutions to be registered and licensed, and they distinguish cosmetic surgery, dentistry, dermatology and traditional Chinese medicine as clinical categories. National guidance also calls for stronger checks on institutional qualifications, practitioner credentials, advertising and the permitted scope of treatment.",
          "For an international patient, the practical task is to verify the exact legal name of the institution, its address, the department responsible for care and the named clinician. A brand name, social account or English-language sales representative is not a substitute for the treating entity and its authorization.",
        ],
        bullets: [
          "Legal name and address of the treating facility",
          "Named surgeon and role in each important part of the procedure",
          "Facility scope for the proposed operation and anesthesia",
          "Postoperative contact and emergency-transfer arrangement",
        ],
      },
      {
        title: "Compare procedures through a consultation",
        paragraphs: [
          "Rhinoplasty, eyelid surgery, facelift, fat grafting and liposuction are categories rather than complete plans. Technique, extent, anesthesia and recovery can differ materially between patients. Use procedure guides to prepare questions, then ask the surgeon why a particular approach fits your anatomy and goals.",
          "Before-and-after images can help communicate preferences, but they should show comparable cases, consistent angles and a meaningful follow-up point. They cannot predict your outcome. Ask what the procedure cannot change, how asymmetry is discussed and which complications or revisions may require additional treatment.",
        ],
      },
      {
        title: "Build one complete written budget",
        paragraphs: [
          "Request separate figures for consultation, tests, surgeon, facility, anesthesia, medicines, implants or devices, garments and scheduled reviews. Record what could change after examination and what happens to a deposit if treatment does not proceed. Then add flights, entry documents, local transport, accommodation, meals, a companion and contingency funds.",
          "A lower procedure figure is not automatically the lower-cost journey. A longer recovery stay, changed flight or additional review can outweigh an apparent saving. Compare written estimates using the same categories and currency on the same date.",
        ],
        table: {
          caption: "Cosmetic surgery tourism budget",
          headers: ["Budget layer", "Include", "Confirm before"],
          rows: [
            ["Clinical", "Consultation, tests, surgery, anesthesia, medication", "Deposit"],
            ["Recovery", "Reviews, garments, wound care, extra nights", "Treatment"],
            ["Travel", "Entry, flights, transfers, hotel, companion", "Non-refundable booking"],
            ["Contingency", "Plan change, delayed return, additional care", "Departure"],
          ],
        },
      },
      {
        title: "Design the trip around recovery",
        paragraphs: [
          "Stay close enough to the treating facility for scheduled reviews and urgent questions. Confirm who interprets during consultation, consent and discharge, not only during airport pickup. Keep early recovery free from fixed tours and long transfers unless the treating clinician has approved them.",
          "Surgery and prolonged travel can both contribute to blood-clot risk. Flying advice must be individualized to the operation, anesthesia, mobility, complications and personal risk factors. Obtain written warning signs, an after-hours contact and a clear decision about when you may travel.",
        ],
      },
      {
        title: "Take a usable care record home",
        paragraphs: [
          "Before leaving China, request the procedure and discharge summary, test results, prescriptions, implant or device details where relevant, wound-care instructions and the treating team's contact information. Ask which documents can be provided in English or translated for a clinician at home.",
          "Arrange home-country follow-up before surgery when possible. Confirm how the China-based team will review photos or answer questions and what requires an in-person assessment. Cosmetic surgery tourism is only a complete pathway when responsibility after the flight home is clear.",
        ],
      },
    ],
    faqs: [
      ["Why do international patients consider cosmetic surgery in China?", "Patients may consider China for specialist choice, procedure availability, cost or because they already travel there. Those advantages should be assessed alongside provider verification, communication, recovery and follow-up."],
      ["Is cosmetic surgery tourism in China safe?", "No destination can guarantee safety. Risk depends on the patient, procedure, surgeon, facility, anesthesia and continuity of care. Verify each part and obtain individualized medical advice."],
      ["Can CeladonChina choose a surgeon or procedure for me?", "No. CeladonChina can organize published information, questions, appointments and practical travel support. Medical recommendations and consent remain with licensed treating professionals."],
      ["Should tourism be scheduled before or after surgery?", "Keep postoperative plans flexible and follow the treating clinician's restrictions. More demanding tourism is generally easier to plan before treatment, but the final itinerary must reflect the individual care plan."],
    ],
    sources: [
      { title: "Medical Aesthetic Services Management Measures", publisher: "National Health Commission of the PRC", url: CHINA_COSMETIC_RULES },
      { title: "Guidance on Strengthening Medical Aesthetic Industry Oversight", publisher: "State Administration for Market Regulation", url: CHINA_COSMETIC_OVERSIGHT },
      { title: "Medical Tourism", publisher: "CDC Yellow Book", url: CDC_MEDICAL_TOURISM },
      { title: "Appropriate Care of Patients Traveling for Surgery", publisher: "American Society of Plastic Surgeons", url: ASPS_TRAVELING_FOR_SURGERY },
    ],
    related: [
      { label: "Plastic surgery in China: procedures and costs", href: "/plastic-surgery-china" },
      { label: "China cosmetic surgery guide for international patients", href: "/cosmetic-surgery-china-for-international-patients" },
      { label: "China vs Korea for cosmetic surgery", href: "/china-vs-korea-cosmetic-surgery" },
    ],
  },
  {
    slug: "cosmetic-surgery-china-for-international-patients",
    title: "Cosmetic Surgery in China for International Patients",
    description: "A practical guide to cosmetic surgery in China for foreigners, covering consultations, language support, payment, travel documents, recovery and records.",
    kicker: "International patient guide",
    heading: "Cosmetic surgery in China for international patients: what changes when care crosses borders.",
    intro: "The operation is only one part of an international care journey. Foreign patients also need a workable route for records, consultation, interpretation, payment, local recovery and follow-up after returning home.",
    answer: "International patients can explore cosmetic surgery in China, but access, language, payment and documentation vary by clinician and facility. Confirm that the named provider accepts international self-pay patients, can support informed consent in a language you understand and will supply records and follow-up instructions you can use at home.",
    updated: "September 7, 2026",
    readingTime: "8-minute guide",
    takeaways: [
      "Confirm international-patient access with the exact department and facility.",
      "Arrange clinical interpretation for consent and discharge, not just travel help.",
      "Keep payment terms, medical records and follow-up in writing.",
    ],
    sections: [
      {
        title: "Prepare a concise consultation file",
        paragraphs: [
          "Start with your main concern, relevant medical history, medicines, allergies, previous surgery and the dates you could realistically remain in China. Add clear, unfiltered photographs only when requested through an agreed channel. Ask which reports or tests are needed before a useful remote discussion.",
          "An online consultation may help define questions and whether an in-person assessment is worthwhile, but it may not establish final candidacy, technique or price. Expect the plan to remain provisional until examination and any required testing are complete.",
        ],
      },
      {
        title: "Confirm the international-patient pathway",
        paragraphs: [
          "Ask whether you will use an international department, private hospital, specialist hospital or licensed clinic. Confirm the legal name and address, who schedules the appointment, which identification documents are required and whether the named surgeon will be available on the proposed dates.",
          "Do not rely on a coordinator's description alone. Ask the treating institution to confirm the appointment and payment recipient. If a visiting clinician is involved, verify the date, facility and authorization for that specific visit.",
        ],
      },
      {
        title: "Make the clinical conversation understandable",
        paragraphs: [
          "Travel translation and clinical interpretation are different jobs. Confirm who will interpret the consultation, consent, anesthesia discussion, medication instructions and discharge. The interpreter should communicate your questions accurately rather than make medical recommendations.",
          "Ask for enough time to review consent documents. If the final plan differs from the remote discussion, request a fresh explanation of the procedure, risks, alternatives, recovery and price before deciding whether to proceed.",
        ],
        bullets: [
          "Language used for consultation and consent",
          "Interpreter present for anesthesia and discharge",
          "Written instructions available in a usable language",
          "After-hours contact who can communicate with you",
        ],
      },
      {
        title: "Confirm entry, payment and communications",
        paragraphs: [
          "Entry requirements depend on nationality, route, duration and purpose, and they can change. Use the Chinese embassy, consulate or official visa center responsible for your place of residence. Do not make non-refundable bookings until the appointment and entry pathway are sufficiently clear.",
          "Ask which cards, bank transfers or mobile-payment methods the institution accepts, whether a deposit is refundable and who issues the invoice. Arrange a working phone and internet connection for appointment updates and urgent contact after arrival.",
        ],
      },
      {
        title: "Leave China with a follow-up package",
        paragraphs: [
          "Request a treatment summary, discharge note, medication list, test results, implant or device information where relevant and written warning signs. Ask how routine questions will be handled after departure and which symptoms require local urgent care rather than a remote message.",
          "A clinician at home may need these records to provide follow-up. Check insurance exclusions and identify appropriate local care before treatment instead of assuming the overseas provider can manage every issue remotely.",
        ],
      },
    ],
    faqs: [
      ["Do cosmetic surgery clinics in China accept foreign patients?", "Some do, but access and services vary. Confirm with the exact facility and department that it accepts international self-pay patients and can support the required procedure and language."],
      ["Will the surgeon speak English?", "Language ability varies. Even when a surgeon speaks some English, confirm whether qualified interpretation is available for consent, anesthesia and discharge."],
      ["Can the final price be confirmed online?", "An early estimate may be possible, but examination, tests or a changed clinical plan can affect the final amount. Ask for all changes in writing before treatment."],
    ],
    sources: [
      { title: "Medical Aesthetic Services Management Measures", publisher: "National Health Commission of the PRC", url: CHINA_COSMETIC_RULES },
      { title: "Visa Category", publisher: "Chinese Visa Application Service Center", url: CHINA_VISA_CATEGORIES },
      { title: "Medical Tourism", publisher: "CDC Yellow Book", url: CDC_MEDICAL_TOURISM },
    ],
    related: [
      { label: "Cosmetic surgery tourism in China", href: "/cosmetic-surgery-tourism-china" },
      { label: "China medical visa and entry guide", href: "/medical-tourism-china/visa" },
      { label: "Travel and interpretation support", href: "/travel-packages" },
    ],
  },
  {
    slug: "choose-plastic-surgeon-china",
    title: "How to Choose a Plastic Surgeon in China",
    description: "Compare plastic surgeons in China by identity, registration, specialty, facility privileges, consultation quality and follow-up.",
    kicker: "Surgeon verification",
    heading: "How to choose a plastic surgeon in China: verify the person, place and plan.",
    intro: "A surgeon profile is a starting point, not a decision. International patients need to connect the clinician's identity and experience to the exact facility, procedure, anesthesia and postoperative pathway.",
    answer: "Choose a plastic surgeon in China by confirming the surgeon's legal identity, current registration, relevant training and experience, then verifying the facility and operating privileges separately. Use the consultation to assess whether the proposed plan, risks, alternatives and follow-up are explained clearly without pressure.",
    updated: "September 7, 2026",
    readingTime: "8-minute checklist",
    takeaways: [
      "Verify identity and current credentials with primary sources where possible.",
      "Match experience to the procedure and patient concern, not a general reputation.",
      "Reject any pathway that hides the facility, anesthesia team or follow-up responsibility.",
    ],
    sections: [
      {
        title: "Confirm the surgeon's legal identity",
        paragraphs: [
          "Record the clinician's full legal name in Chinese and English where available, current registration, professional title, specialty and the institution connected to the proposed care. Similar names, translated names and social-media handles can create confusion, so use primary documents and institution confirmation wherever possible.",
          "China's rules for medical aesthetic services require relevant institutions and practitioners to meet defined authorization and experience requirements. Ask which regulator or public source can confirm the current record and when it was last checked.",
        ],
      },
      {
        title: "Match experience to your procedure",
        paragraphs: [
          "A broad title such as cosmetic surgeon does not show experience with your anatomy, revision status or intended operation. Ask how often the clinician manages comparable cases, which technique is being considered and why, and which parts of the procedure another clinician may perform.",
          "Look for consistently documented cases with comparable starting concerns and adequate follow-up. Photographs should inform the consultation, not replace credential checks or a discussion of risks and limitations.",
        ],
      },
      {
        title: "Verify the facility separately",
        paragraphs: [
          "Confirm where the operation will occur and whether the facility is authorized for the proposed scope. Ask who administers anesthesia, how the patient is monitored, whether overnight observation is available and how an emergency transfer is handled.",
          "A qualified surgeon working at one hospital does not prove that every clinic using the surgeon's name has the same privileges or resources. Connect the individual appointment to a specific date, facility and clinical team.",
        ],
        bullets: [
          "Treating facility's legal name and address",
          "Procedure scope and surgeon's privileges at that site",
          "Named anesthesia professional and monitoring plan",
          "Postoperative review and emergency-transfer pathway",
        ],
      },
      {
        title: "Use the consultation as a quality check",
        paragraphs: [
          "A useful consultation should address your goals, health information, alternatives, limitations, material risks and recovery. The surgeon should explain why the proposed plan fits rather than simply agree with the procedure name you requested.",
          "Pause if questions are redirected only to sales staff, if a deposit is used to rush the decision or if the named surgeon changes without a new consultation. Informed consent requires enough information and time to decide freely.",
        ],
      },
      {
        title: "Compare shortlists with the same evidence",
        paragraphs: [
          "Create one comparison sheet for every option. Record verified credentials, relevant cases, facility, anesthesia, proposed plan, complete cost, recovery, language support and follow-up. Leave a field blank rather than filling it with an assumption.",
          "The strongest option is not necessarily the most famous or cheapest. It is the one whose evidence, plan and communication remain clear when checked at clinician, facility and journey level.",
        ],
        table: {
          caption: "Surgeon comparison sheet",
          headers: ["Check", "Evidence to request", "Red flag"],
          rows: [
            ["Identity", "Legal name and current registration", "Only a nickname or social handle"],
            ["Experience", "Comparable procedure history", "Unlabeled portfolio only"],
            ["Facility", "Named licensed site and privileges", "Location disclosed after deposit"],
            ["Plan", "Risks, alternatives and recovery", "Guaranteed result"],
            ["Follow-up", "Named contacts and review schedule", "No plan after departure"],
          ],
        },
      },
    ],
    faqs: [
      ["What credentials should a plastic surgeon in China have?", "Confirm current physician registration, relevant specialty or training, experience for the proposed procedure and authorization to practise at the named facility. Requirements can vary by role and procedure."],
      ["Is a large social-media following evidence of quality?", "No. Popularity does not verify registration, facility privileges, procedure experience or outcomes. Treat social content as marketing unless its claims can be independently checked."],
      ["Should I choose the cheapest surgeon?", "Price alone cannot show provider fit or safety. Compare complete written estimates only after checking the surgeon, facility, plan, anesthesia and follow-up."],
    ],
    sources: [
      { title: "Medical Aesthetic Services Management Measures", publisher: "National Health Commission of the PRC", url: CHINA_COSMETIC_RULES },
      { title: "Guidance on Strengthening Medical Aesthetic Industry Oversight", publisher: "State Administration for Market Regulation", url: CHINA_COSMETIC_OVERSIGHT },
      { title: "Appropriate Care of Patients Traveling for Surgery", publisher: "American Society of Plastic Surgeons", url: ASPS_TRAVELING_FOR_SURGERY },
    ],
    related: [
      { label: "Browse published expert profiles", href: "/doctors" },
      { label: "CeladonChina provider verification standards", href: "/provider-verification" },
      { label: "Cosmetic surgery tourism in China", href: "/cosmetic-surgery-tourism-china" },
    ],
  },
  {
    slug: "cosmetic-surgery-recovery-china",
    title: "Cosmetic Surgery Recovery in China: Travel Guide",
    description: "Plan recovery after cosmetic surgery in China, including local reviews, accommodation, activity, warning signs, travel clearance and follow-up at home.",
    kicker: "Recovery travel guide",
    heading: "Cosmetic surgery recovery in China: protect the time after treatment.",
    intro: "Recovery affects the city, hotel, companion plan and return flight. The safest itinerary leaves room for individual healing and keeps the patient close to the team responsible for early review.",
    answer: "Plan cosmetic surgery recovery in China by staying near the treating facility for the clinician's required review period, using suitable accommodation, keeping activities flexible and arranging individualized clearance before flying. Take complete records and a defined follow-up plan home.",
    updated: "September 7, 2026",
    readingTime: "8-minute guide",
    takeaways: [
      "Let the treating clinician set review and travel timing.",
      "Choose recovery accommodation for access and function, not sightseeing value.",
      "Prepare for urgent questions in China and follow-up after returning home.",
    ],
    sections: [
      {
        title: "Ask for a procedure-specific recovery plan",
        paragraphs: [
          "Recovery differs by procedure, technique, anesthesia, patient and complication. Ask what is expected during the first day, first week and later stages; when dressings or sutures are reviewed; and which symptoms require urgent assessment. A general website timeline is not personal travel clearance.",
          "Confirm medicines, wound care, compression garments, sleep position, bathing, activity and food instructions in writing. Know which supplies the facility provides and what must be purchased locally.",
        ],
      },
      {
        title: "Stay within practical reach of the facility",
        paragraphs: [
          "Early reviews are easier when the hotel or serviced apartment has a short, reliable route to the treating facility. Consider step-free access, lifts, a quiet room, food delivery, laundry, climate control and space for a companion if one is recommended.",
          "Changing hotels or cities during early recovery can create unnecessary transport and communication problems. Keep the first part of the stay stable and confirm where to go outside normal clinic hours.",
        ],
        bullets: [
          "Short route to scheduled reviews",
          "Lift and accessible entry if mobility may be limited",
          "Reliable internet and phone connection",
          "Nearby pharmacy, food and appropriate urgent care",
        ],
      },
      {
        title: "Keep tourism secondary to healing",
        paragraphs: [
          "A free afternoon is not automatically a sightseeing window. Walking distance, crowds, sun, heat, swimming, alcohol and long vehicle journeys may conflict with instructions. Ask before adding any fixed activity after treatment.",
          "If experiencing China is an important part of the trip, schedule more demanding plans before surgery or after clearance. During recovery, use optional low-effort activities that can be cancelled without cost or disappointment.",
        ],
      },
      {
        title: "Treat the return flight as a clinical decision",
        paragraphs: [
          "The CDC notes that surgery and air travel independently increase blood-clot risk and that travel after surgery can add risk through prolonged sitting. The relevant timing and precautions depend on the procedure, mobility, anesthesia, complications and personal history.",
          "Ask the treating clinician when you may fly, whether an airline clearance document is needed and what to do during the journey. Flexible tickets and contingency funds matter because recovery does not follow a guaranteed date.",
        ],
      },
      {
        title: "Build continuity of care before departure",
        paragraphs: [
          "Request the operation and discharge summary, prescriptions, test results, implant or device records where relevant, photographs used for follow-up and written warning signs. Confirm the responsible China contact and expected response channel after you leave.",
          "Identify a clinician or appropriate service at home that can assess you in person. Remote photographs cannot evaluate every problem, and overseas complications or revision care may not be covered by insurance.",
        ],
      },
    ],
    faqs: [
      ["How long should I stay in China after cosmetic surgery?", "There is no universal stay length. The treating clinician should set it from the procedure, review schedule, recovery, complications and your individual travel risks."],
      ["Can I visit another Chinese city after surgery?", "Only when the treating clinician agrees. Early recovery is usually easier near the responsible facility, and intercity travel can complicate review or urgent care."],
      ["What should I take home after surgery?", "Request the procedure and discharge summary, medicines, test results, implant or device details where relevant, follow-up instructions, warning signs and named contacts."],
    ],
    sources: [
      { title: "Medical Tourism", publisher: "CDC Yellow Book", url: CDC_MEDICAL_TOURISM },
      { title: "Appropriate Care of Patients Traveling for Surgery", publisher: "American Society of Plastic Surgeons", url: ASPS_TRAVELING_FOR_SURGERY },
    ],
    related: [
      { label: "Cosmetic surgery tourism in China", href: "/cosmetic-surgery-tourism-china" },
      { label: "General recovery and aftercare guide", href: "/medical-tourism-china/recovery" },
      { label: "Patient recovery diaries", href: "/cases" },
    ],
  },
  {
    slug: "china-vs-korea-cosmetic-surgery",
    title: "China vs Korea for Cosmetic Surgery: A Patient Comparison",
    description: "Compare cosmetic surgery in China and South Korea across surgeon fit, regulation checks, cost, language, travel, recovery and follow-up.",
    kicker: "Destination comparison",
    heading: "China vs Korea for cosmetic surgery: compare the care pathway, not stereotypes.",
    intro: "Neither country is automatically better for every patient or procedure. A useful comparison starts with the named surgeon and facility, then considers communication, travel, cost and continuity of care.",
    answer: "Choose between China and South Korea based on the individual surgeon's relevant experience, the exact treating facility, informed-consent process, complete cost, recovery plan and access to follow-up. National reputation and social-media aesthetics should not decide treatment on their own.",
    updated: "September 7, 2026",
    readingTime: "9-minute guide",
    takeaways: [
      "Compare individual clinicians and facilities, not country reputations.",
      "Use the same written checklist and cost categories for both destinations.",
      "Choose the pathway that gives you clearer communication and follow-up.",
    ],
    sections: [
      {
        title: "Start with the result you want to discuss",
        paragraphs: [
          "Terms such as natural, dramatic, Korean style or Chinese style are too broad for informed treatment planning. Use specific concerns, reference images and examples of results you do not want, then ask the surgeon what is anatomically realistic.",
          "A surgeon's portfolio may help start a conversation, but it should include comparable cases, consistent labeling and enough follow-up time to understand the result. Do not assume nationality predicts one aesthetic approach.",
        ],
      },
      {
        title: "Compare the provider-verification pathway",
        paragraphs: [
          "In either country, verify the clinician's identity, registration, specialty, facility relationship and role in the operation. Confirm the facility separately, including anesthesia and emergency arrangements.",
          "South Korea operates a registration and accreditation framework for institutions serving foreign patients through Medical Korea. In China, international patients may encounter public-hospital international departments, private hospitals and specialty clinics. The relevant registry, facility and documentation process differs, so use country-specific official sources rather than applying one country's labels to the other.",
        ],
      },
      {
        title: "Compare the full cost in one format",
        paragraphs: [
          "Request the same categories from both providers: consultation, tests, surgeon, anesthesia, facility, medication, implants or devices, recovery, follow-up and possible changes. Convert estimates on the same date and record whether taxes and payment fees are included.",
          "Then add visa, flights, local transfers, accommodation, companion costs and a contingency allowance. A lower treatment price can become the higher total if it requires a longer stay or offers less included follow-up.",
        ],
        table: {
          caption: "A fair comparison framework",
          headers: ["Decision factor", "China", "South Korea"],
          rows: [
            ["Provider", "Verify clinician, facility and department", "Verify clinician and registered foreign-patient institution"],
            ["Entry", "Check current Chinese rules for your passport and purpose", "Check Korea's current visa or exemption route"],
            ["Language", "Confirm clinical interpretation at the named facility", "Confirm clinical interpretation at the named facility"],
            ["Cost", "Request complete written estimate", "Request complete written estimate, including applicable tax"],
            ["Follow-up", "Define reviews in China and at home", "Define reviews in Korea and at home"],
          ],
        },
      },
      {
        title: "Compare communication and logistics",
        paragraphs: [
          "Ask who interprets during consultation, consent and discharge; how questions are recorded; and whether translated medical documents are available. The presence of English-speaking sales staff does not establish that the clinical conversation will be interpreted accurately.",
          "Compare direct flights, appointment lead time, accommodation close to the facility and the ability to remain longer if needed. If you already travel regularly to one country or speak the language, that familiarity may materially improve the practical pathway.",
        ],
      },
      {
        title: "Make the decision at provider level",
        paragraphs: [
          "Shortlist clinicians in both countries using the same questions. Eliminate any option that will not identify the treating surgeon, explain material risks, provide written terms or define follow-up. Then compare the remaining options based on relevant experience and how well the plan fits you.",
          "CeladonChina is China-focused but may coordinate selected visiting international clinicians where their identity, schedule and treating facility can be confirmed. Any medical recommendation and consent must still come from the licensed treating team.",
        ],
      },
    ],
    faqs: [
      ["Is Korea always better for facial cosmetic surgery?", "No. Country reputation cannot determine whether an individual surgeon and plan are right for you. Compare relevant experience, facility, communication, risks and follow-up."],
      ["Is cosmetic surgery always cheaper in China?", "No. Prices vary widely by clinician, facility, city and procedure. Compare complete written estimates and total travel costs."],
      ["Can I choose based on before-and-after photos?", "Photos can support discussion but should not be the only evidence. Verify credentials, comparable cases, consent, facility and continuity of care."],
    ],
    sources: [
      { title: "Registration System for Foreign-Patient Institutions", publisher: "Medical Korea", url: KOREA_REGISTRATION },
      { title: "Medical Visa", publisher: "Medical Korea", url: KOREA_VISA },
      { title: "Hospitals in China", publisher: "National Health Commission of the PRC", url: CHINA_HOSPITALS },
      { title: "Medical Tourism", publisher: "CDC Yellow Book", url: CDC_MEDICAL_TOURISM },
    ],
    related: [
      { label: "Plastic surgery in China guide", href: "/plastic-surgery-china" },
      { label: "Browse experts in China", href: "/doctors" },
      { label: "Compare procedures", href: "/treatments" },
    ],
  },
];

export const findMedicalTourismGuide = (slug?: string) =>
  MEDICAL_TOURISM_GUIDES.find((guide) => guide.slug === slug);

const TOP_LEVEL_GUIDE_PATHS: Record<string, string> = {
  "china-vs-korea-cosmetic-surgery": "/china-vs-korea-cosmetic-surgery",
  "cosmetic-surgery-tourism-china": "/cosmetic-surgery-tourism-china",
  "cosmetic-surgery-china-for-international-patients": "/cosmetic-surgery-china-for-international-patients",
  "choose-plastic-surgeon-china": "/choose-plastic-surgeon-china",
  "cosmetic-surgery-recovery-china": "/cosmetic-surgery-recovery-china",
};

export const medicalTourismGuidePath = (slug: string) =>
  TOP_LEVEL_GUIDE_PATHS[slug] ?? `/medical-tourism-china/${slug}`;

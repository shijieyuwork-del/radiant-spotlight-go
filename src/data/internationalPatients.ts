export const INTERNATIONAL_HUB = "/international-patients";
export const VIETNAM_GUIDE = "/vi/du-lich-tham-my-trung-quoc";
export const GUIDE_UPDATED = "2026-11-15";

type Section = { title: string; body: string; source?: number };
export type InternationalGuide = {
  path: string; country: string; language: "en" | "vi"; locale: string;
  title: string; description: string; intro: string; budget: string;
  sections: Section[]; faqs: [string, string][];
  sources: { label: string; url: string }[];
};

const cdc = { label: "CDC Yellow Book: Medical Tourism", url: "https://www.cdc.gov/yellow-book/hcp/health-care-abroad/medical-tourism.html" };
const canada = { label: "Government of Canada: Medical care outside Canada", url: "https://travel.gc.ca/travelling/health-safety/medical-care-outside-canada" };
const australia = { label: "Smartraveller: Medical tourism", url: "https://www.smartraveller.gov.au/travel-essentials/travel-health/medical-tourism" };

export const INTERNATIONAL_GUIDES: InternationalGuide[] = [
  {
    path: `${INTERNATIONAL_HUB}/australia`, country: "Australia", language: "en", locale: "en-AU",
    title: "Cosmetic Surgery in China for Visitors from Australia",
    description: "Planning cosmetic surgery in China from Australia: provider checks, itemised costs, insurance questions, English records and follow-up before you travel.",
    intro: "Considering cosmetic care in China from Australia? Start with the questions that will still matter after you return: who treats you, what the written quote covers and how your care will be handed over.",
    budget: "Build your budget in AUD, but keep the hospital's original quote and settlement currency. If you convert a CNY or USD estimate, record the exchange-rate source and date, card or transfer fees and a contingency. This page does not provide live exchange rates or an individual quote.",
    sections: [
      { title: "Check the team before planning the trip", body: "Ask for the treating surgeon's legal name, current Chinese medical registration, relevant specialty and the named facility where the procedure will take place. Verify the facility's licence and permitted scope separately. Chinese credentials should not be presented as Australian registration or accreditation." },
      { title: "Read the Australian guidance before booking", body: "Smartraveller advises researching the destination, doctor, hospital and procedure and discussing your plans with your doctor in Australia. Ask your insurer specifically about planned elective treatment, complications, changes to travel and medical evacuation; obtain its answer in writing. A standard travel policy should not be assumed to cover the trip's medical purpose.", source: 0 },
      { title: "Allow for review before a long flight", body: "Ask the treating team what examinations and postoperative reviews must happen in China, who can assess you outside normal hours and what would delay your return. Agree communication times using a named Australian city and local date, accounting for daylight saving. Flight readiness is an individual medical decision, not a package inclusion." },
      { title: "Arrange the handover to Australia", body: "Before leaving, request an English treatment summary, discharge instructions, medication names and doses, relevant implant or device details and treating-team contacts. Ask a suitable clinician in Australia about follow-up availability before travel; do not assume a local clinic has agreed to take over. Clarify who pays for additional care and keep urgent-care instructions separate from routine coordinator messages." },
    ],
    faqs: [
      ["Does Sino Aesthetics provide medical treatment in Australia?", "No. Sino Aesthetics provides China-focused information and non-clinical coordination. This guide does not advertise an Australian clinic or an Australian treating team."],
      ["Can I compare an Australian quote with a Chinese quote?", "Compare the same procedure and scope, including anaesthesia, facility, tests, follow-up, travel, accommodation and exclusions. A currency conversion alone does not make two quotes comparable."],
      ["Will my insurance cover a complication?", "Coverage depends on the policy and circumstances. Confirm directly with the insurer before paying or travelling; this website cannot confirm coverage."],
    ], sources: [australia, cdc],
  },
  {
    path: `${INTERNATIONAL_HUB}/united-states`, country: "United States", language: "en", locale: "en-US",
    title: "Planning Cosmetic Surgery in China from the United States",
    description: "A practical guide for US visitors considering cosmetic surgery in China: credentials, USD cost planning, English medical records and care after returning home.",
    intro: "If you are researching cosmetic surgery in China from the United States, compare the whole care plan rather than a headline price. Confirm the provider, the financial terms and how information will reach a clinician back home.",
    budget: "If you plan in USD, ask whether the hospital's quote is actually payable in USD or converted from CNY. Keep the original quote, validity period, payment recipient and any bank or currency-conversion charges. Do not infer a percentage saving from prices that cover different services.",
    sections: [
      { title: "Understand which credentials you are checking", body: "Verify the surgeon's current Chinese registration, relevant training and authorisation to practise at the named institution. If a profile claims a US board certification or affiliation, verify the exact organisation and current status separately. A title such as 'international expert' is not evidence of American board certification." },
      { title: "Get both teams' follow-up expectations in writing", body: "CDC recommends discussing plans for treatment-related complications with the healthcare professional at home and the treating professional abroad. Ask who will perform postoperative reviews, how records will be transferred and what to do if symptoms require urgent assessment. Remote messages do not replace an examination when one is needed.", source: 0 },
      { title: "Check coverage and financial responsibility", body: "Ask your insurer what, if anything, is covered outside the United States, including care for complications after return. Obtain the provider's terms for plan changes, additional treatment and cancellation. Do not treat a coordinator's explanation as an insurance coverage determination.", source: 0 },
      { title: "Bring usable records home", body: "Request the operative or treatment summary, discharge notes, medication details, test results, implant or device records where relevant and a contact for the treating team. CDC advises obtaining medical records in English for subsequent care. Confirm file format, delivery date and any translation charge before leaving China.", source: 0 },
    ],
    faqs: [
      ["Is a Chinese medical licence the same as US board certification?", "No. These are different credentials in different systems. Verify each specific claim with its issuing body and confirm the clinician is authorised for your procedure at the actual treatment location."],
      ["Can I book a flight home based on an online recovery estimate?", "No. Ask the treating clinician to assess the timing for your procedure and recovery. Allow for reviews, unexpected changes and the possibility that travel must be delayed."],
      ["Can the coordinator choose my operation?", "No. Medical assessment, treatment selection and informed consent are the responsibility of you and the treating medical professionals."],
    ], sources: [cdc],
  },
  {
    path: `${INTERNATIONAL_HUB}/canada`, country: "Canada", language: "en", locale: "en-CA",
    title: "Cosmetic Surgery in China: A Guide for Canadian Visitors",
    description: "Plan cosmetic surgery in China from Canada: CAD budget questions, provider verification, insurance checks, medical records and arrangements for returning home.",
    intro: "For visitors from Canada, planning should connect the consultation in China with the care you may need after returning home. Establish the scope of treatment, a complete written quote and a realistic handover before booking.",
    budget: "Use CAD for your personal budget while retaining the provider's original CNY or USD quote. Record the rate source and date, transaction fees, excluded services and contingency costs. A converted figure is a planning aid, not a guaranteed settlement amount or an insurance benefit.",
    sections: [
      { title: "Discuss the plan before leaving Canada", body: "The Government of Canada advises discussing medical travel with a travel health clinic or your healthcare provider and researching the treating facility. Prepare a medication and allergy list and ask what records the receiving team needs. These checks do not amount to approval of a particular overseas provider.", source: 0 },
      { title: "Check the named surgeon and institution", body: "Ask for legal names, current Chinese registration and licensing information, the procedure location and the people responsible for anaesthesia and clinical follow-up. Confirm whether interpretation is provided by an interpreter or by the clinician, and how consent questions will be addressed." },
      { title: "Do not assume coverage or reimbursement", body: "Ask the relevant provincial or territorial plan and any private insurer directly about planned overseas care, complications and return travel. Request written confirmation of any applicable coverage. This guide makes no reimbursement promise and does not determine eligibility.", source: 0 },
      { title: "Prepare for the return to Canada", body: "The Government of Canada recommends obtaining copies of procedure-related medical records, including imaging, before departure. Ask for a summary that a clinician at home can use, including the procedure, medications, follow-up needs and provider contacts. Discuss language needs in advance; do not assume French-language records or care are available. Arrange local follow-up separately and clarify emergency instructions.", source: 0 },
    ],
    faqs: [
      ["Will a Canadian health plan reimburse cosmetic treatment in China?", "Do not assume reimbursement. Ask your plan and insurer directly about your circumstances and obtain written answers before making financial commitments."],
      ["Are prices on this website Canadian dollars?", "Check each label. Existing site estimates may be in USD or CNY. This guide discusses CAD budgeting but does not convert those prices or provide a hospital quote."],
      ["Is French-language support included?", "Availability must be confirmed for the named provider, interpreter and dates. Do not assume a translated webpage means the medical team speaks that language."],
    ], sources: [canada, cdc],
  },
  {
    path: `${INTERNATIONAL_HUB}/vietnam`, country: "Vietnam", language: "en", locale: "en",
    title: "Cosmetic Surgery in China for Visitors from Vietnam",
    description: "Plan cosmetic care in China from Vietnam: provider checks, Vietnamese interpretation questions, VND budgeting, treatment records and follow-up.",
    intro: "Considering cosmetic treatment in China from Vietnam? Confirm what can be coordinated in Vietnamese, who will provide medical care and how you will understand the quote, consent and follow-up instructions before committing to travel.",
    budget: "For a VND budget, keep the original hospital quote in CNY or USD and document any reference conversion's date and source. Ask about payment methods, bank charges, interpretation, repeat visits and services outside the quote. No live VND conversion or individual treatment price is provided here.",
    sections: [
      { title: "Check the doctor and treatment location", body: "Request the doctor's legal name, current Chinese medical registration, relevant specialty and the legal name and address of the institution. Check that the institution's licence covers the planned procedure. A social-media account or comparison photo alone cannot verify these facts." },
      { title: "Confirm Vietnamese communication at every stage", body: "Ask whether a Vietnamese interpreter is available for your dates, who provides the interpretation, what it costs and whether it covers consultation, informed consent, discharge and follow-up. A Vietnamese webpage does not mean the surgeon speaks Vietnamese or that interpretation is included. Ask for written confirmation." },
      { title: "Separate travel arrangements from medical decisions", body: "Confirm entry requirements through official Chinese consular information for your nationality and travel purpose. Do not assume short distance or a convenient flight makes immediate return appropriate. The treating clinician should decide the review schedule and assess readiness to travel." },
      { title: "Take a clear care plan back to Vietnam", body: "Request your treatment summary, prescriptions, relevant device details, test results and treating-team contacts. Agree how these will be translated for your clinician in Vietnam. Arrange follow-up availability before departure and clarify what requires urgent local care rather than waiting for an online reply.", source: 0 },
    ],
    faqs: [
      ["Is Vietnamese interpretation automatically included?", "No. Confirm availability, provider, dates, coverage and charges in writing. Clinical decisions and consent remain with you and the treating professionals."],
      ["Can I plan the trip around a fixed number of recovery days?", "A general timeline cannot determine your readiness to return. Ask the treating clinician about your procedure, reviews, health and travel arrangements."],
      ["What should I confirm before paying?", "Confirm the legal payment recipient, itemised scope, currency, deposit terms, cancellation conditions and responsibility for additional care. Ask for written confirmation."],
    ], sources: [cdc],
  },
  {
    path: VIETNAM_GUIDE, country: "Việt Nam", language: "vi", locale: "vi-VN",
    title: "Phẫu thuật thẩm mỹ tại Trung Quốc: Hướng dẫn cho khách Việt Nam",
    description: "Hướng dẫn cho khách Việt Nam: kiểm tra bác sĩ và cơ sở y tế tại Trung Quốc, báo giá, phiên dịch, hồ sơ điều trị và kế hoạch tái khám khi về nước.",
    intro: "Bạn đang cân nhắc phẫu thuật thẩm mỹ tại Trung Quốc? Trước khi đặt vé hoặc thanh toán, hãy xác nhận ai trực tiếp điều trị, cách trao đổi bằng tiếng Việt, nội dung báo giá và kế hoạch theo dõi sau khi về Việt Nam.",
    budget: "Nếu lập ngân sách bằng VND, hãy giữ báo giá gốc bằng CNY hoặc USD của cơ sở y tế. Ghi rõ nguồn và ngày của tỷ giá tham khảo, phí ngân hàng và các khoản chưa bao gồm. Số tiền quy đổi chỉ dùng để lập kế hoạch. Trang này không cung cấp tỷ giá trực tiếp hoặc báo giá điều trị cá nhân.",
    sections: [
      { title: "Kiểm tra bác sĩ và địa điểm điều trị", body: "Yêu cầu họ tên pháp lý của bác sĩ, thông tin đăng ký hành nghề hiện hành tại Trung Quốc, chuyên môn liên quan, tên pháp lý và địa chỉ của cơ sở y tế. Kiểm tra riêng giấy phép và phạm vi hoạt động của cơ sở có phù hợp với thủ thuật dự kiến hay không. Tài khoản mạng xã hội hoặc ảnh trước và sau không đủ để xác minh những thông tin này." },
      { title: "Xác nhận phiên dịch tiếng Việt ở từng giai đoạn", body: "Hỏi trước có phiên dịch tiếng Việt vào ngày bạn cần hay không, ai cung cấp, chi phí bao nhiêu và có bao gồm tư vấn, giải thích để đồng ý điều trị, xuất viện và tái khám hay không. Trang web bằng tiếng Việt không có nghĩa bác sĩ nói tiếng Việt hoặc phí phiên dịch đã được bao gồm. Yêu cầu xác nhận bằng văn bản." },
      { title: "Tách kế hoạch đi lại khỏi quyết định điều trị", body: "Kiểm tra yêu cầu nhập cảnh trên nguồn chính thức của cơ quan lãnh sự Trung Quốc theo quốc tịch và mục đích chuyến đi. Không mặc định chuyến bay ngắn đồng nghĩa có thể về ngay sau điều trị. Bác sĩ điều trị cần đánh giá lịch tái khám và thời điểm phù hợp để di chuyển theo tình trạng của bạn." },
      { title: "Mang hồ sơ và kế hoạch theo dõi về Việt Nam", body: "Yêu cầu bản tóm tắt điều trị, đơn thuốc, thông tin vật liệu hoặc thiết bị liên quan, kết quả xét nghiệm và thông tin liên hệ của nhóm điều trị. Thống nhất cách dịch tài liệu để bác sĩ tại Việt Nam có thể sử dụng. Tìm hiểu khả năng tái khám tại Việt Nam trước khi đi; làm rõ trường hợp nào cần khám khẩn cấp tại địa phương thay vì chờ phản hồi trực tuyến.", source: 0 },
    ],
    faqs: [
      ["Phiên dịch tiếng Việt có được tự động bao gồm không?", "Không. Hãy xác nhận bằng văn bản về tình trạng sẵn có, người cung cấp, ngày, phạm vi và chi phí. Quyết định y khoa và việc đồng ý điều trị thuộc về bạn và nhân viên y tế điều trị."],
      ["Có thể đặt lịch về nước theo số ngày hồi phục cố định không?", "Không thể dùng thời gian chung để xác định khi nào bạn phù hợp để về nước. Hỏi bác sĩ điều trị về thủ thuật, lịch tái khám, sức khỏe và phương tiện đi lại của bạn."],
      ["Cần xác nhận gì trước khi thanh toán?", "Xác nhận bên nhận tiền hợp pháp, từng khoản trong báo giá, loại tiền thanh toán, điều kiện đặt cọc và hủy dịch vụ, cùng trách nhiệm đối với chi phí phát sinh. Yêu cầu thông tin bằng văn bản."],
    ], sources: [{ ...cdc, label: "CDC: Hướng dẫn về du lịch y tế (tiếng Anh)" }],
  },
];

export function internationalLanguage(path: string): "en" | "vi" | undefined {
  const clean = path.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  if (clean === VIETNAM_GUIDE || clean === "/vi") return "vi";
  if (clean === INTERNATIONAL_HUB || INTERNATIONAL_GUIDES.some(g => g.path === clean)) return "en";
  return undefined;
}

export function internationalMeta(guide: InternationalGuide | undefined, siteUrl: string) {
  const path = guide?.path ?? INTERNATIONAL_HUB;
  const language = guide?.language ?? "en";
  const title = guide?.title ?? "Planning Cosmetic Care in China | International Visitor Guides";
  const description = guide?.description ?? "Planning guides for visitors from Australia, the United States, Canada and Vietnam considering cosmetic care in China: providers, costs, records and follow-up.";
  const alternates = guide && (guide.path === VIETNAM_GUIDE || guide.path === `${INTERNATIONAL_HUB}/vietnam`)
    ? [{ language: "en", path: `${INTERNATIONAL_HUB}/vietnam` }, { language: "vi-VN", path: VIETNAM_GUIDE }, { language: "x-default", path: `${INTERNATIONAL_HUB}/vietnam` }]
    : [];
  const schema = [
    { "@context": "https://schema.org", "@type": guide ? "Article" : "CollectionPage", name: title, headline: title,
      description, url: `${siteUrl}${path}`, inLanguage: guide?.locale ?? "en", dateModified: GUIDE_UPDATED,
      author: { "@type": "Organization", name: "Sino Aesthetics Editorial Team", url: `${siteUrl}/editorial-policy` },
      publisher: { "@id": `${siteUrl}/#organization` }, ...(guide ? { citation: guide.sources.map(s => s.url) } : {}),
    },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: language === "vi" ? "Trang chủ" : "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "International visitor guides", item: `${siteUrl}${INTERNATIONAL_HUB}` },
      ...(guide ? [{ "@type": "ListItem", position: 3, name: guide.country, item: `${siteUrl}${path}` }] : []),
    ] },
  ];
  return { path, title, description, language, alternates, schema };
}

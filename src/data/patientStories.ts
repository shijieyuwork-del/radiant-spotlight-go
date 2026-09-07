export type PatientStory = {
  name: string;
  age: number;
  country: string;
  countryZh: string;
  procedure?: string;
  procedureZh?: string;
  excerpt: string;
  excerptZh: string;
  story: string[];
  storyZh: string[];
};

export const patientStories: PatientStory[] = [
  {
    name: "Angela M.",
    age: 31,
    country: "United States",
    countryZh: "美国",
    excerpt: "A coordinator met me at the airport with a sign bearing my name and flowers, then supported me through the consultation, interpretation and recovery.",
    excerptZh: "落地时，协调员举着写有我名字的接机牌和鲜花迎接我，之后陪我完成面诊、翻译和恢复安排。",
    story: [
      "I had always wanted to visit China, and CeladonChina helped me combine that trip with rhinoplasty, double-eyelid surgery and lip enhancement.",
      "A coordinator met me at the airport with a sign bearing my name and flowers, then supported me through the consultation, interpretation and recovery. I felt safe and cared for while still getting to enjoy Shanghai.",
    ],
    storyZh: [
      "我一直想去中国旅行，CeladonChina 帮我把这趟旅程与隆鼻、双眼皮和丰唇项目安排在一起。",
      "落地时，协调员举着写有我名字的接机牌和鲜花迎接我，之后陪我完成面诊、翻译和恢复安排。整个过程安心又温暖，我也能在休养中感受上海。",
    ],
  },
  {
    name: "Rob C.",
    age: 38,
    country: "Canada",
    countryZh: "加拿大",
    excerpt: "CeladonChina introduced me to several established clinic groups, so I could compare options by budget and priorities.",
    excerptZh: "CeladonChina 推荐了几家成熟的连锁植发机构，让我可以按预算和需求比较。",
    story: [
      "A friend had a great hair transplant result in China, but his travel and language difficulties made me hesitate. CeladonChina introduced me to several established clinic groups, so I could compare options by budget and priorities.",
      "They arranged airport transfers, interpretation and hotel booking at no charge. I am still recovering, but I can already see the difference. Their support made the decision and the journey much easier.",
    ],
    storyZh: [
      "朋友在中国做植发的效果很好，但他遇到的出行和语言问题让我一直犹豫。CeladonChina 推荐了几家成熟的连锁植发机构，让我可以按预算和需求比较。",
      "他们还免费安排接送、翻译和酒店预订。我仍在恢复期，但已经能看到变化。有了这些支持，做决定和完成旅程都轻松了许多。",
    ],
  },
  {
    name: "Valerie C.",
    age: 27,
    country: "Malaysia",
    countryZh: "马来西亚",
    excerpt: "They matched me with a Korean doctor whose aesthetic approach felt right and booked him two months ahead during his China visit.",
    excerptZh: "他们根据我的审美匹配了一位韩国医生，并提前两个月预约了医生来中国出诊的时间。",
    story: [
      "I love the natural, refined look of Korean cosmetic medicine, but I assumed CeladonChina only worked with doctors in China. They matched me with a Korean doctor whose aesthetic approach felt right and booked him two months ahead during his China visit.",
      "Two months after double-eyelid surgery, the shape looks natural and has nearly settled. Friends say I look brighter and more refreshed. I love the result and feel much more confident.",
    ],
    storyZh: [
      "我喜欢韩式医美自然精致的风格，但原以为 CeladonChina 只对接中国医生。他们根据我的审美匹配了一位韩国医生，并提前两个月预约了医生来中国出诊的时间。",
      "双眼皮术后两个月，形态已经基本稳定，看起来很自然。朋友们都说我更漂亮、更有精神，这次改变也让我找回了更多自信。",
    ],
  },
  {
    name: "Sofia R.",
    age: 34,
    country: "Spain",
    countryZh: "西班牙",
    procedure: "Rhinoplasty",
    procedureZh: "鼻整形",
    excerpt: "A coordinator met me at Pudong Airport, and an interpreter stayed through the consultation. When swelling worried me, the team arranged an extra check.",
    excerptZh: "协调员在浦东机场接我，翻译全程陪同面诊。眼周肿胀让我担心时，团队又安排了复诊。",
    story: [
      "I had considered rhinoplasty for nearly five years but worried about choosing a surgeon and recovering abroad. After reviewing my photos, CeladonChina provided two Shanghai options with costs, dates and similar cases within four days.",
      "A coordinator met me at Pudong Airport, and an interpreter stayed through the consultation. When swelling worried me, the team arranged an extra check. Six months later, my profile looks more balanced, but I still look like myself.",
    ],
    storyZh: [
      "我考虑鼻整形近五年，却一直担心在国外选择医生和恢复。CeladonChina 根据我的照片，在四天内提供了两位上海医生的费用、档期和相似案例。",
      "协调员在浦东机场接我，翻译全程陪同面诊。眼周肿胀让我担心时，团队又安排了复诊。六个月后，侧面轮廓更协调，但我看起来仍然是自己。",
    ],
  },
  {
    name: "Daniel K.",
    age: 42,
    country: "Australia",
    countryZh: "澳大利亚",
    procedure: "Hair transplant",
    procedureZh: "植发",
    excerpt: "An interpreter supported the hairline design and aftercare instructions, and a coordinator recorded my first-wash demonstration.",
    excerptZh: "翻译陪同发际线设计并确认术后说明，协调员还录下第一次清洗示范。",
    story: [
      "Comparing hair transplant clinics in Australia and Turkey was confusing. CeladonChina arranged three online assessments and helped me choose a Beijing clinic that proposed 3,050 grafts using FUE.",
      "An interpreter supported the hairline design and aftercare instructions, and a coordinator recorded my first-wash demonstration. The team continued monthly photo checks after I returned to Melbourne. At nine months, my hairline looks fuller and suits my face.",
    ],
    storyZh: [
      "不同诊所的技术、毛囊数量和价格很难比较。CeladonChina 安排了三次线上评估，最终帮我选择北京一家建议采用 FUE 移植 3,050 个毛囊单位的诊所。",
      "翻译陪同发际线设计并确认术后说明，协调员还录下第一次清洗示范。回到墨尔本后，团队每月查看恢复照片。九个月后，前额更浓密，新发际线也很适合我的脸型。",
    ],
  },
  {
    name: "Mina L.",
    age: 29,
    country: "Singapore",
    countryZh: "新加坡",
    procedure: "Double-eyelid surgery",
    procedureZh: "双眼皮手术",
    excerpt: "When one eye was more swollen after surgery, the coordinator checked my daily photos with the nurse.",
    excerptZh: "术后一侧较肿时，协调员每天把我的照片交给护士确认。",
    story: [
      "I wanted a small, natural crease. CeladonChina arranged a video consultation with a Korean surgeon visiting Hangzhou, and I used photos to explain exactly how subtle I wanted the result.",
      "The appointment was booked six weeks ahead. When one eye was more swollen after surgery, the coordinator checked my daily photos with the nurse. Four months later, the crease looks soft and natural, and friends simply say I look more rested.",
    ],
    storyZh: [
      "我想要窄而自然的双眼皮。CeladonChina 安排了与一位定期到杭州出诊的韩国医生视频面诊，我用照片清楚说明了理想效果。",
      "手术提前六周预约。术后一侧较肿时，协调员每天把我的照片交给护士确认。四个月后，褶皱柔和自然，朋友们只是觉得我看起来更有精神。",
    ],
  },
  {
    name: "Claire B.",
    age: 37,
    country: "United Kingdom",
    countryZh: "英国",
    procedure: "Dental veneers",
    procedureZh: "牙齿贴面",
    excerpt: "CeladonChina planned my 12-day Shanghai trip around the full veneer process, from examination to final fitting.",
    excerptZh: "CeladonChina 按十二天的上海行程，安排了从初诊到最终试戴的完整贴面流程。",
    story: [
      "After an old cycling injury, one front tooth had become darker and I stopped smiling widely in photos. CeladonChina planned my 12-day Shanghai trip around the full veneer process, from examination to final fitting.",
      "The dentist recommended four ceramic veneers and showed me two digital shades. I chose the warmer, more natural option. After nine days and several small fit adjustments, my smile looks like mine again, and the repaired tooth no longer stands out.",
    ],
    storyZh: [
      "骑行事故后，一颗门牙逐渐变暗，我开始避免在照片里大笑。CeladonChina 按十二天的上海行程，安排了从初诊到最终试戴的完整贴面流程。",
      "牙医建议做四颗全瓷贴面，并提供两种色调预览。我选择了更温暖自然的方案。经过九天和几次细节调整，修复过的牙齿不再突兀，我也找回了自己的笑容。",
    ],
  },
  {
    name: "Marcus T.",
    age: 46,
    country: "United States",
    countryZh: "美国",
    procedure: "Lower-eyelid treatment",
    procedureZh: "下眼睑治疗",
    excerpt: "The coordinator translated my questions, and the clinic checked me twice before I flew home.",
    excerptZh: "协调员翻译了我的问题，诊所在返程前做了两次检查。",
    story: [
      "Years of poor sleep and business travel left me with under-eye bags, but I worried that surgery would change my expression. CeladonChina arranged two Guangzhou consultations and helped me understand why lower blepharoplasty with limited fat repositioning suited me better than filler.",
      "The coordinator translated my questions, and the clinic checked me twice before I flew home. Five months later, the area looks smoother without changing my expression. Colleagues just say I look healthier.",
    ],
    storyZh: [
      "长期睡眠不规律和频繁出差让我眼袋明显，但我担心手术改变表情。CeladonChina 安排了广州两位医生面诊，帮助我理解为什么下眼睑手术加少量脂肪调整比填充更适合。",
      "协调员翻译了我的问题，诊所在返程前做了两次检查。五个月后，眼下更平整，表情没有改变，同事们只是觉得我看起来更健康。",
    ],
  },
  {
    name: "Noor A.",
    age: 32,
    country: "United Arab Emirates",
    countryZh: "阿联酋",
    procedure: "Skin treatment program",
    procedureZh: "皮肤治疗方案",
    excerpt: "The coordinator translated every label, and the doctor adjusted one product after reviewing my photos.",
    excerptZh: "协调员翻译了产品标签，医生也根据恢复照片调整了使用频率。",
    story: [
      "I contacted CeladonChina about pigmentation that had darkened after pregnancy. Instead of the laser I expected, the dermatologist recommended a gentler three-month plan with one clinic treatment, sunscreen and a prescription routine for home.",
      "The coordinator translated every label, and the doctor adjusted one product after reviewing my photos. I noticed a change after six weeks; by three months, my skin looked more even. I valued the realistic advice and the absence of pressure to book unnecessary treatments.",
    ],
    storyZh: [
      "怀孕后脸颊色素加深，我原本想做激光。皮肤科医生担心刺激后色沉，改为三个月的温和治疗、防晒和处方护肤方案。",
      "协调员翻译了产品标签，医生也根据恢复照片调整了使用频率。六周后我开始看到变化，三个月时肤色更均匀。我最满意的是医生给出真实建议，没有推荐不必要的项目。",
    ],
  },
];

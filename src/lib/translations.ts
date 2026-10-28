import type { LanguageCode } from "./i18n";

export type TranslationKey =
  | "nav.discover" | "nav.treatments" | "nav.reviews" | "nav.forClinics" | "nav.signIn" | "nav.signUp"
  | "hero.badge" | "hero.title1" | "hero.titleEm" | "hero.title2"
  | "hero.subtitle" | "hero.procedure" | "hero.procedurePlaceholder"
  | "hero.country" | "hero.findDoctorsIn" | "hero.featuredIn"
  | "hero.boardCertified" | "hero.countries" | "hero.diaries"
  | "social.verifiedDoctors" | "social.countriesCovered" | "social.patientVideos" | "social.surgeriesBooked"
  | "social.featuredIn"
  | "search.pill" | "search.titlePre" | "search.titleEm" | "search.titlePost"
  | "privacy.title" | "privacy.desc"
  | "feed.pill" | "feed.titlePre" | "feed.titleEm" | "feed.seeAll"
  | "trending.pill" | "trending.titlePre" | "trending.titleEm"
  | "byCountry.pill" | "byCountry.titlePre" | "byCountry.titleEm" | "byCountry.desc"
  | "stories.pill" | "stories.titlePre" | "stories.titleEm" | "stories.titleEnd" | "stories.readAll"
  | "ba.pill" | "ba.titlePre" | "ba.titleEm" | "ba.desc"
  | "clinics.pill" | "clinics.titlePre" | "clinics.titleEm" | "clinics.viewClinic"
  | "doctor.pill" | "doctor.titlePre" | "doctor.titleEm" | "doctor.desc"
  | "reviews.pill" | "reviews.titlePre" | "reviews.titleEm"
  | "how.watch" | "how.watchDesc" | "how.consult" | "how.consultDesc" | "how.fly" | "how.flyDesc"
  | "cta.pill" | "cta.titlePre" | "cta.titleEm" | "cta.desc" | "cta.apply";

const en: Record<TranslationKey, string> = {
  "nav.discover": "Discover", "nav.treatments": "Treatments", "nav.reviews": "Reviews", "nav.forClinics": "For Clinics", "nav.signIn": "Sign in", "nav.signUp": "Sign up",
  "hero.badge": "Published provider information · International coordination",
  "hero.title1": "Find the world's", "hero.titleEm": "best", "hero.title2": "aesthetic experts.",
  "hero.subtitle": "Review published provider information, procedure guides and patient journey previews before planning cosmetic care abroad.",
  "hero.procedure": "Procedure", "hero.procedurePlaceholder": "Rhinoplasty, double eyelid...",
  "hero.country": "Country", "hero.findDoctorsIn": "Find experts in", "hero.featuredIn": "Featured in",
  "hero.boardCertified": "Board-certified only", "hero.countries": "50+ countries", "hero.diaries": "2M+ recovery diaries",
  "social.verifiedDoctors": "Verified experts", "social.countriesCovered": "Countries covered",
  "social.patientVideos": "Patient videos", "social.surgeriesBooked": "Surgeries booked",
  "social.featuredIn": "As featured in",
  "search.pill": "Smart search", "search.titlePre": "Find your", "search.titleEm": "exact", "search.titlePost": "procedure, fast.",
  "privacy.title": "Privacy mode", "privacy.desc": "Blur faces in patient videos. On by default in select regions for cultural sensitivity.",
  "feed.pill": "Watch now", "feed.titlePre": "Real surgeries,", "feed.titleEm": "real recoveries.", "feed.seeAll": "See all videos",
  "trending.pill": "Trending this week", "trending.titlePre": "What everyone's", "trending.titleEm": "obsessed with",
  "byCountry.pill": "By destination", "byCountry.titlePre": "Trending procedures,", "byCountry.titleEm": "by country.",
  "byCountry.desc": "Where patients fly for the best results — and how much they actually pay.",
  "stories.pill": "Patient stories", "stories.titlePre": "Their", "stories.titleEm": "transformation", "stories.titleEnd": ", told by them.",
  "stories.readAll": "Read all stories",
  "ba.pill": "Before / After", "ba.titlePre": "Real results,", "ba.titleEm": "side by side.",
  "ba.desc": "Drag to reveal. Privacy mode is on by default — toggle off if you want the full picture.",
  "clinics.pill": "Verified", "clinics.titlePre": "Surgeons girls actually", "clinics.titleEm": "trust.", "clinics.viewClinic": "View clinic",
  "doctor.pill": "Expert profile", "doctor.titlePre": "Every credential,", "doctor.titleEm": "on the record.",
  "doctor.desc": "License, board certs, case volume, languages, hospital affiliations — verified before any expert goes live.",
  "reviews.pill": "Verified reviews", "reviews.titlePre": "Reviews from patients who", "reviews.titleEm": "actually flew.",
  "how.watch": "Watch", "how.watchDesc": "Scroll real recovery diaries from verified surgical patients worldwide.",
  "how.consult": "Consult", "how.consultDesc": "Prepare questions for a virtual consultation and compare written quotes.",
  "how.fly": "Fly & operate", "how.flyDesc": "Travel packages, aftercare hotels, English-speaking coordinators included.",
  "cta.pill": "For surgeons", "cta.titlePre": "Bring your practice to", "cta.titleEm": "millions.",
  "cta.desc": "Publish accurate provider information and help international patients prepare for consultations.",
  "cta.apply": "Apply to join",
};

const ko: Record<TranslationKey, string> = {
  "nav.discover": "둘러보기", "nav.treatments": "시술", "nav.reviews": "후기", "nav.forClinics": "병원 입점", "nav.signIn": "로그인", "nav.signUp": "회원가입",
  "hero.badge": "중국 의료기관·전문의 정보 · 해외 환자 일정 지원",
  "hero.title1": "중국의", "hero.titleEm": "병원과 전문의", "hero.title2": "정보를 비교하세요.",
  "hero.subtitle": "공개된 의료기관과 전문의 정보, 환자 회복 일지, 예상 비용을 살펴보고 중국에서의 상담과 방문을 준비하세요.",
  "hero.procedure": "시술", "hero.procedurePlaceholder": "코, 쌍꺼풀...",
  "hero.country": "도시", "hero.findDoctorsIn": "전문의 찾기:", "hero.featuredIn": "인기 시술:",
  "hero.boardCertified": "전문의 면허 정보 확인", "hero.countries": "중국 내 서비스", "hero.diaries": "환자 회복 일지",
  "social.verifiedDoctors": "공개된 전문의 정보", "social.countriesCovered": "중국 내 목적지",
  "social.patientVideos": "환자 영상", "social.surgeriesBooked": "예약된 수술",
  "social.featuredIn": "소개된 매체",
  "search.pill": "스마트 검색", "search.titlePre": "원하는", "search.titleEm": "정확한", "search.titlePost": "시술을 빠르게.",
  "privacy.title": "프라이버시 모드", "privacy.desc": "환자 영상의 얼굴을 흐리게 처리합니다. 일부 지역에서는 기본적으로 활성화됩니다.",
  "feed.pill": "지금 보기", "feed.titlePre": "진짜 수술,", "feed.titleEm": "진짜 회복.", "feed.seeAll": "모든 영상 보기",
  "trending.pill": "이번 주 인기", "trending.titlePre": "모두가", "trending.titleEm": "주목하는 시술",
  "byCountry.pill": "국가별", "byCountry.titlePre": "인기 시술,", "byCountry.titleEm": "국가별로.",
  "byCountry.desc": "도시별 의료기관, 전문의 정보와 예상 비용을 비교하세요.",
  "stories.pill": "환자 후기", "stories.titlePre": "그들의", "stories.titleEm": "변화", "stories.titleEnd": ", 직접 이야기합니다.",
  "stories.readAll": "모든 후기 보기",
  "ba.pill": "비포 / 애프터", "ba.titlePre": "실제 결과,", "ba.titleEm": "한눈에.",
  "ba.desc": "드래그하여 비교하세요. 프라이버시 모드는 기본 활성화입니다.",
  "clinics.pill": "의료기관 정보", "clinics.titlePre": "중국의", "clinics.titleEm": "병원과 클리닉을 비교하세요.", "clinics.viewClinic": "의료기관 보기",
  "doctor.pill": "전문가 프로필", "doctor.titlePre": "모든 자격을", "doctor.titleEm": "투명하게.",
  "doctor.desc": "전문의 면허, 진료 분야, 사용 언어와 소속 기관을 확인하세요. 예약 전 현재 진료 장소를 다시 확인해야 합니다.",
  "reviews.pill": "검증된 후기", "reviews.titlePre": "실제로", "reviews.titleEm": "방문한 환자들의 후기.",
  "how.watch": "살펴보기", "how.watchDesc": "공개된 환자 회복 일지를 확인하세요.",
  "how.consult": "상담 준비", "how.consultDesc": "질문을 정리하고 온라인 상담을 예약한 뒤 서면 견적을 비교하세요.",
  "how.fly": "중국 방문", "how.flyDesc": "서면 확인된 일정에 따라 통역, 이동, 숙박 및 후속 연락 지원을 받으세요.",
  "cta.pill": "의료기관 제휴", "cta.titlePre": "해외 환자에게", "cta.titleEm": "정확한 정보를 전달하세요.",
  "cta.desc": "확인 가능한 기관 및 전문의 정보를 공개해 해외 환자가 상담 전 선택지를 이해하도록 도와주세요.",
  "cta.apply": "입점 신청",
};

const zh: Record<TranslationKey, string> = {
  "nav.discover": "浏览", "nav.treatments": "医美项目", "nav.reviews": "患者评价", "nav.forClinics": "机构合作", "nav.signIn": "登录", "nav.signUp": "注册",
  "hero.badge": "中国境内机构与医生资料 · 国际患者协调支持",
  "hero.title1": "比较中国的", "hero.titleEm": "医院、诊所与医生", "hero.title2": "。",
  "hero.subtitle": "查看已发布的机构与医生资料、患者恢复日记和参考费用，再规划在中国的医美咨询与行程。",
  "hero.procedure": "项目", "hero.procedurePlaceholder": "鼻整形、双眼皮...",
  "hero.country": "城市", "hero.findDoctorsIn": "查找医生：", "hero.featuredIn": "热门项目：",
  "hero.boardCertified": "查看医生执业信息", "hero.countries": "仅限中国境内", "hero.diaries": "患者恢复日记",
  "social.verifiedDoctors": "已发布医生资料", "social.countriesCovered": "中国目的地",
  "social.patientVideos": "患者视频", "social.surgeriesBooked": "已预约手术",
  "social.featuredIn": "媒体报道",
  "search.pill": "智能搜索", "search.titlePre": "快速找到您", "search.titleEm": "需要的", "search.titlePost": "项目。",
  "privacy.title": "隐私模式", "privacy.desc": "模糊患者视频中的面部；部分地区默认开启。",
  "feed.pill": "立即观看", "feed.titlePre": "真实就诊经历，", "feed.titleEm": "真实恢复过程。", "feed.seeAll": "查看所有视频",
  "trending.pill": "本周热门", "trending.titlePre": "大家都在", "trending.titleEm": "热议的项目",
  "byCountry.pill": "按目的地", "byCountry.titlePre": "热门项目，", "byCountry.titleEm": "按中国城市查看。",
  "byCountry.desc": "按城市查看相关机构、医生资料和参考费用。",
  "stories.pill": "患者故事", "stories.titlePre": "他们的", "stories.titleEm": "恢复经历", "stories.titleEnd": "，由本人讲述。",
  "stories.readAll": "查看所有故事",
  "ba.pill": "术前 / 术后", "ba.titlePre": "术前术后照片，", "ba.titleEm": "并排对比。",
  "ba.desc": "拖动滑块进行对比；如已开启隐私模式，部分面部会被模糊处理。",
  "clinics.pill": "机构资料", "clinics.titlePre": "浏览中国的", "clinics.titleEm": "医院与诊所。", "clinics.viewClinic": "查看机构",
  "doctor.pill": "医生资料", "doctor.titlePre": "公开信息，", "doctor.titleEm": "集中查看。",
  "doctor.desc": "查看医生执业信息、专业方向、语言及关联机构；预约前请再次确认当前执业地点。",
  "reviews.pill": "患者评价", "reviews.titlePre": "查看曾赴华就诊患者的", "reviews.titleEm": "公开评价。",
  "how.watch": "查看", "how.watchDesc": "浏览已发布的患者恢复日记。",
  "how.consult": "咨询", "how.consultDesc": "整理问题、预约线上咨询，并比较书面方案与报价。",
  "how.fly": "赴华就诊", "how.flyDesc": "按书面确认的方案获得翻译、接送、住宿和随访协调支持。",
  "cta.pill": "机构合作", "cta.titlePre": "向国际患者发布", "cta.titleEm": "准确的机构与医生资料。",
  "cta.desc": "发布可核实的信息，帮助国际患者在咨询前了解机构、医生和就诊安排。",
  "cta.apply": "申请加入",
};

const th: Record<TranslationKey, string> = {
  "nav.discover": "ค้นพบ", "nav.treatments": "หัตถการ", "nav.reviews": "รีวิว", "nav.forClinics": "สำหรับคลินิก", "nav.signIn": "เข้าสู่ระบบ", "nav.signUp": "สมัครสมาชิก",
  "hero.badge": "ข้อมูลผู้ให้บริการที่เผยแพร่ · การประสานงานระหว่างประเทศ",
  "hero.title1": "เปรียบเทียบ", "hero.titleEm": "คลินิกและผู้เชี่ยวชาญ", "hero.title2": "ในประเทศจีน",
  "hero.subtitle": "ดูข้อมูลสถานพยาบาลและผู้เชี่ยวชาญที่เผยแพร่ บันทึกการฟื้นตัว และค่าใช้จ่ายโดยประมาณ ก่อนวางแผนการปรึกษาและเดินทางไปจีน",
  "hero.procedure": "หัตถการ", "hero.procedurePlaceholder": "เสริมจมูก, ตาสองชั้น...",
  "hero.country": "เมือง", "hero.findDoctorsIn": "ค้นหาผู้เชี่ยวชาญใน", "hero.featuredIn": "หัตถการยอดนิยม",
  "hero.boardCertified": "ดูข้อมูลใบอนุญาตผู้เชี่ยวชาญ", "hero.countries": "บริการเฉพาะในจีน", "hero.diaries": "บันทึกการฟื้นตัวของผู้ป่วย",
  "social.verifiedDoctors": "ข้อมูลผู้เชี่ยวชาญที่เผยแพร่", "social.countriesCovered": "จุดหมายในจีน",
  "social.patientVideos": "วิดีโอผู้ป่วย", "social.surgeriesBooked": "การผ่าตัดที่จอง",
  "social.featuredIn": "นำเสนอใน",
  "search.pill": "ค้นหาอัจฉริยะ", "search.titlePre": "ค้นหาหัตถการ", "search.titleEm": "ที่ใช่", "search.titlePost": "อย่างรวดเร็ว",
  "privacy.title": "โหมดความเป็นส่วนตัว", "privacy.desc": "เบลอใบหน้าในวิดีโอผู้ป่วย เปิดใช้งานเริ่มต้นในบางภูมิภาค",
  "feed.pill": "ดูตอนนี้", "feed.titlePre": "ผ่าตัดจริง,", "feed.titleEm": "ฟื้นตัวจริง", "feed.seeAll": "ดูวิดีโอทั้งหมด",
  "trending.pill": "ยอดนิยมสัปดาห์นี้", "trending.titlePre": "หัตถการที่ผู้ป่วย", "trending.titleEm": "ค้นหามากที่สุด",
  "byCountry.pill": "ตามจุดหมาย", "byCountry.titlePre": "หัตถการยอดนิยม", "byCountry.titleEm": "แยกตามเมืองในจีน",
  "byCountry.desc": "เปรียบเทียบสถานพยาบาล ผู้เชี่ยวชาญ และค่าใช้จ่ายโดยประมาณในแต่ละเมือง",
  "stories.pill": "เรื่องราวผู้ป่วย", "stories.titlePre": "การ", "stories.titleEm": "เปลี่ยนแปลง", "stories.titleEnd": "ของพวกเธอ",
  "stories.readAll": "อ่านเรื่องทั้งหมด",
  "ba.pill": "ก่อน / หลัง", "ba.titlePre": "ผลลัพธ์จริง,", "ba.titleEm": "เทียบกัน",
  "ba.desc": "ลากเพื่อเปรียบเทียบ โหมดความเป็นส่วนตัวเปิดใช้งานเริ่มต้น",
  "clinics.pill": "ข้อมูลสถานพยาบาล", "clinics.titlePre": "เปรียบเทียบ", "clinics.titleEm": "โรงพยาบาลและคลินิกในจีน", "clinics.viewClinic": "ดูสถานพยาบาล",
  "doctor.pill": "โปรไฟล์ผู้เชี่ยวชาญ", "doctor.titlePre": "ทุกคุณวุฒิ,", "doctor.titleEm": "เปิดเผย",
  "doctor.desc": "ดูข้อมูลใบอนุญาต ความเชี่ยวชาญ ภาษา และสถานพยาบาลที่เกี่ยวข้อง และยืนยันสถานที่ปฏิบัติงานอีกครั้งก่อนนัดหมาย",
  "reviews.pill": "รีวิวที่ตรวจสอบ", "reviews.titlePre": "รีวิวจากผู้ป่วยที่", "reviews.titleEm": "บินไปจริง",
  "how.watch": "ดูข้อมูล", "how.watchDesc": "สำรวจบันทึกการฟื้นตัวของผู้ป่วยที่เผยแพร่แล้ว",
  "how.consult": "เตรียมปรึกษา", "how.consultDesc": "เตรียมคำถาม นัดหมายออนไลน์ และเปรียบเทียบแผนกับใบเสนอราคาเป็นลายลักษณ์อักษร",
  "how.fly": "เดินทางไปจีน", "how.flyDesc": "รับบริการล่าม การเดินทาง ที่พัก และการติดตามตามแผนที่ยืนยันเป็นลายลักษณ์อักษร",
  "cta.pill": "สำหรับสถานพยาบาล", "cta.titlePre": "นำเสนอข้อมูลที่ถูกต้อง", "cta.titleEm": "แก่ผู้ป่วยต่างชาติ",
  "cta.desc": "เผยแพร่ข้อมูลผู้ให้บริการที่ถูกต้องและช่วยผู้ป่วยต่างชาติเตรียมตัวก่อนปรึกษาแพทย์",
  "cta.apply": "สมัครเข้าร่วม",
};

const ar: Record<TranslationKey, string> = {
  "nav.discover": "اكتشف", "nav.treatments": "الإجراءات", "nav.reviews": "التقييمات", "nav.forClinics": "للعيادات", "nav.signIn": "تسجيل الدخول", "nav.signUp": "إنشاء حساب",
  "hero.badge": "معلومات منشورة عن المؤسسات والمتخصصين في الصين · تنسيق للزوار الدوليين",
  "hero.title1": "قارن", "hero.titleEm": "المستشفيات والمتخصصين", "hero.title2": "في الصين.",
  "hero.subtitle": "راجع معلومات المؤسسات والمتخصصين المنشورة ويوميات التعافي والتكاليف التقريبية قبل التخطيط للاستشارة والسفر إلى الصين.",
  "hero.procedure": "الإجراء", "hero.procedurePlaceholder": "تجميل الأنف، الجفن المزدوج...",
  "hero.country": "المدينة", "hero.findDoctorsIn": "ابحث عن متخصصين في", "hero.featuredIn": "إجراءات شائعة",
  "hero.boardCertified": "اطّلع على بيانات ترخيص المتخصص", "hero.countries": "الخدمة داخل الصين فقط", "hero.diaries": "يوميات تعافي المرضى",
  "social.verifiedDoctors": "معلومات المتخصصين المنشورة", "social.countriesCovered": "وجهات داخل الصين",
  "social.patientVideos": "فيديوهات المرضى", "social.surgeriesBooked": "عمليات محجوزة",
  "social.featuredIn": "ظهر في",
  "search.pill": "بحث ذكي", "search.titlePre": "اعثر على", "search.titleEm": "إجرائك الدقيق", "search.titlePost": "بسرعة.",
  "privacy.title": "وضع الخصوصية", "privacy.desc": "تمويه الوجوه في فيديوهات المرضى. مُفعّل افتراضياً في مناطق مختارة.",
  "feed.pill": "شاهد الآن", "feed.titlePre": "عمليات حقيقية,", "feed.titleEm": "تعافي حقيقي.", "feed.seeAll": "كل الفيديوهات",
  "trending.pill": "الأكثر رواجاً هذا الأسبوع", "trending.titlePre": "الإجراءات", "trending.titleEm": "الأكثر بحثاً",
  "byCountry.pill": "حسب الوجهة", "byCountry.titlePre": "الإجراءات الرائجة,", "byCountry.titleEm": "حسب الدولة.",
  "byCountry.desc": "قارن المؤسسات والمتخصصين والتكاليف التقريبية حسب المدينة.",
  "stories.pill": "قصص المرضى", "stories.titlePre": "رحلات التعافي", "stories.titleEm": "كما يرويها المرضى", "stories.titleEnd": ".",
  "stories.readAll": "كل القصص",
  "ba.pill": "قبل / بعد", "ba.titlePre": "نتائج حقيقية,", "ba.titleEm": "جنباً إلى جنب.",
  "ba.desc": "اسحب للكشف. وضع الخصوصية مفعّل افتراضياً.",
  "clinics.pill": "معلومات المؤسسات", "clinics.titlePre": "قارن", "clinics.titleEm": "المستشفيات والعيادات في الصين.", "clinics.viewClinic": "عرض المؤسسة",
  "doctor.pill": "ملف المتخصص", "doctor.titlePre": "المعلومات المهنية", "doctor.titleEm": "منشورة بوضوح.",
  "doctor.desc": "راجع بيانات الترخيص والتخصص واللغات والمؤسسات المرتبطة، وأكّد مكان الممارسة الحالي قبل الحجز.",
  "reviews.pill": "مراجعات موثقة", "reviews.titlePre": "مراجعات من مرضى", "reviews.titleEm": "سافروا فعلاً.",
  "how.watch": "استكشف", "how.watchDesc": "تصفح يوميات تعافي المرضى المنشورة.",
  "how.consult": "حضّر الاستشارة", "how.consultDesc": "رتّب أسئلتك واحجز استشارة عبر الإنترنت وقارن الخطط والأسعار المكتوبة.",
  "how.fly": "سافر إلى الصين", "how.flyDesc": "احصل على دعم الترجمة والتنقل والإقامة والمتابعة وفق الخطة المؤكدة كتابياً.",
  "cta.pill": "للمؤسسات الطبية", "cta.titlePre": "قدّم للمرضى الدوليين", "cta.titleEm": "معلومات دقيقة.",
  "cta.desc": "انشر معلومات قابلة للتحقق عن المؤسسة والمتخصصين لمساعدة المرضى الدوليين على فهم خياراتهم قبل الاستشارة.",
  "cta.apply": "قدّم للانضمام",
};

export const translations: Record<LanguageCode, Record<TranslationKey, string>> = { en, ko, th, ar, zh };

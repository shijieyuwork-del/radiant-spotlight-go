import type { LanguageCode } from "./i18n";

export type TranslationKey =
  | "nav.discover" | "nav.treatments" | "nav.reviews" | "nav.forClinics" | "nav.signIn"
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
  "nav.discover": "Discover", "nav.treatments": "Treatments", "nav.reviews": "Reviews", "nav.forClinics": "For Clinics", "nav.signIn": "Sign in",
  "hero.badge": "4,200+ verified surgeons · 50+ countries",
  "hero.title1": "Find the world's", "hero.titleEm": "best", "hero.title2": "aesthetic doctors.",
  "hero.subtitle": "Verified doctors. Real results. 50+ countries. The trusted cross-border platform for cosmetic surgery — board-certified credentials, real recovery diaries, transparent pricing.",
  "hero.procedure": "Procedure", "hero.procedurePlaceholder": "Rhinoplasty, double eyelid...",
  "hero.country": "Country", "hero.findDoctorsIn": "Find doctors in", "hero.featuredIn": "Featured in",
  "hero.boardCertified": "Board-certified only", "hero.countries": "50+ countries", "hero.diaries": "2M+ recovery diaries",
  "social.verifiedDoctors": "Verified doctors", "social.countriesCovered": "Countries covered",
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
  "doctor.pill": "Doctor profile", "doctor.titlePre": "Every credential,", "doctor.titleEm": "on the record.",
  "doctor.desc": "License, board certs, case volume, languages, hospital affiliations — verified before any doctor goes live.",
  "reviews.pill": "Verified reviews", "reviews.titlePre": "Reviews from patients who", "reviews.titleEm": "actually flew.",
  "how.watch": "Watch", "how.watchDesc": "Scroll real recovery diaries from verified surgical patients worldwide.",
  "how.consult": "Consult", "how.consultDesc": "Book free virtual consults with board-certified surgeons. Compare quotes.",
  "how.fly": "Fly & operate", "how.flyDesc": "Travel packages, aftercare hotels, English-speaking coordinators included.",
  "cta.pill": "For surgeons", "cta.titlePre": "Bring your practice to", "cta.titleEm": "millions.",
  "cta.desc": "Join 4,200+ board-certified plastic surgery clinics. Showcase your work through patient diaries, attract international patients, fill your OR.",
  "cta.apply": "Apply to join",
};

const ko: Record<TranslationKey, string> = {
  "nav.discover": "둘러보기", "nav.treatments": "시술", "nav.reviews": "후기", "nav.forClinics": "병원 입점", "nav.signIn": "로그인",
  "hero.badge": "검증된 외과의 4,200명 이상 · 50개국 이상",
  "hero.title1": "전 세계", "hero.titleEm": "최고의", "hero.title2": "성형외과 의사를 만나세요.",
  "hero.subtitle": "검증된 의사. 진짜 결과. 50개국 이상. 신뢰할 수 있는 글로벌 성형 플랫폼 — 보드 인증 자격, 실제 회복 일기, 투명한 가격.",
  "hero.procedure": "시술", "hero.procedurePlaceholder": "코, 쌍꺼풀...",
  "hero.country": "국가", "hero.findDoctorsIn": "의사 찾기:", "hero.featuredIn": "추천 시술:",
  "hero.boardCertified": "보드 인증 의사만", "hero.countries": "50개국 이상", "hero.diaries": "회복 일기 200만+",
  "social.verifiedDoctors": "검증된 의사", "social.countriesCovered": "지원 국가",
  "social.patientVideos": "환자 영상", "social.surgeriesBooked": "예약된 수술",
  "social.featuredIn": "소개된 매체",
  "search.pill": "스마트 검색", "search.titlePre": "원하는", "search.titleEm": "정확한", "search.titlePost": "시술을 빠르게.",
  "privacy.title": "프라이버시 모드", "privacy.desc": "환자 영상의 얼굴을 흐리게 처리합니다. 일부 지역에서는 기본적으로 활성화됩니다.",
  "feed.pill": "지금 보기", "feed.titlePre": "진짜 수술,", "feed.titleEm": "진짜 회복.", "feed.seeAll": "모든 영상 보기",
  "trending.pill": "이번 주 인기", "trending.titlePre": "모두가", "trending.titleEm": "주목하는 시술",
  "byCountry.pill": "국가별", "byCountry.titlePre": "인기 시술,", "byCountry.titleEm": "국가별로.",
  "byCountry.desc": "환자들이 최고의 결과를 위해 떠나는 곳 — 그리고 실제 지불 금액.",
  "stories.pill": "환자 후기", "stories.titlePre": "그들의", "stories.titleEm": "변화", "stories.titleEnd": ", 직접 이야기합니다.",
  "stories.readAll": "모든 후기 보기",
  "ba.pill": "비포 / 애프터", "ba.titlePre": "실제 결과,", "ba.titleEm": "한눈에.",
  "ba.desc": "드래그하여 비교하세요. 프라이버시 모드는 기본 활성화입니다.",
  "clinics.pill": "인증됨", "clinics.titlePre": "여성들이 진짜로", "clinics.titleEm": "신뢰하는 의사.", "clinics.viewClinic": "병원 보기",
  "doctor.pill": "의사 프로필", "doctor.titlePre": "모든 자격을", "doctor.titleEm": "투명하게.",
  "doctor.desc": "면허, 보드 인증, 수술 건수, 언어, 병원 제휴 — 모든 의사가 사전 검증됩니다.",
  "reviews.pill": "검증된 후기", "reviews.titlePre": "실제로", "reviews.titleEm": "방문한 환자들의 후기.",
  "how.watch": "시청", "how.watchDesc": "전 세계 검증된 환자들의 실제 회복 일기를 둘러보세요.",
  "how.consult": "상담", "how.consultDesc": "보드 인증 의사와 무료 화상 상담. 견적 비교.",
  "how.fly": "방문 & 수술", "how.flyDesc": "여행 패키지, 회복 호텔, 한국어 코디네이터 포함.",
  "cta.pill": "의사용", "cta.titlePre": "당신의 진료를", "cta.titleEm": "수백만 명에게.",
  "cta.desc": "4,200곳 이상의 보드 인증 성형 클리닉에 합류하세요. 환자 일기로 작품을 보여주고, 국제 환자를 유치하세요.",
  "cta.apply": "입점 신청",
};

const zh: Record<TranslationKey, string> = {
  "nav.discover": "发现", "nav.treatments": "项目", "nav.reviews": "评价", "nav.forClinics": "诊所入驻", "nav.signIn": "登录",
  "hero.badge": "4,200+ 认证医生 · 覆盖 50+ 国家",
  "hero.title1": "找到全球", "hero.titleEm": "最好的", "hero.title2": "医美医生。",
  "hero.subtitle": "认证医生。真实效果。50+ 国家。值得信赖的跨境医美平台 — 资质认证、真实恢复日记、透明价格。",
  "hero.procedure": "项目", "hero.procedurePlaceholder": "鼻整形、双眼皮...",
  "hero.country": "国家", "hero.findDoctorsIn": "查找医生:", "hero.featuredIn": "热门推荐:",
  "hero.boardCertified": "仅限认证医生", "hero.countries": "50+ 国家", "hero.diaries": "200万+ 恢复日记",
  "social.verifiedDoctors": "认证医生", "social.countriesCovered": "覆盖国家",
  "social.patientVideos": "患者视频", "social.surgeriesBooked": "已预约手术",
  "social.featuredIn": "媒体报道",
  "search.pill": "智能搜索", "search.titlePre": "快速找到您", "search.titleEm": "需要的", "search.titlePost": "项目。",
  "privacy.title": "隐私模式", "privacy.desc": "模糊患者视频中的面部。在部分地区默认开启以尊重文化。",
  "feed.pill": "立即观看", "feed.titlePre": "真实手术,", "feed.titleEm": "真实恢复。", "feed.seeAll": "查看所有视频",
  "trending.pill": "本周热门", "trending.titlePre": "大家都在", "trending.titleEm": "热议的项目",
  "byCountry.pill": "按目的地", "byCountry.titlePre": "热门项目,", "byCountry.titleEm": "按国家。",
  "byCountry.desc": "患者为最佳效果飞往何处 — 以及实际花费。",
  "stories.pill": "患者故事", "stories.titlePre": "她们的", "stories.titleEm": "蜕变", "stories.titleEnd": ",由本人讲述。",
  "stories.readAll": "查看所有故事",
  "ba.pill": "术前 / 术后", "ba.titlePre": "真实效果,", "ba.titleEm": "并排对比。",
  "ba.desc": "拖动查看。隐私模式默认开启 — 关闭可查看完整画面。",
  "clinics.pill": "认证", "clinics.titlePre": "女生们真正", "clinics.titleEm": "信赖的医生。", "clinics.viewClinic": "查看诊所",
  "doctor.pill": "医生档案", "doctor.titlePre": "每项资质,", "doctor.titleEm": "公开透明。",
  "doctor.desc": "执照、专科认证、手术量、语言、医院隶属 — 所有医生上线前均经过验证。",
  "reviews.pill": "认证评价", "reviews.titlePre": "真实", "reviews.titleEm": "出行患者的评价。",
  "how.watch": "观看", "how.watchDesc": "浏览全球认证患者的真实恢复日记。",
  "how.consult": "咨询", "how.consultDesc": "与认证医生免费视频咨询。比较报价。",
  "how.fly": "出行 & 手术", "how.flyDesc": "包含出行套餐、康复酒店、中文协调员。",
  "cta.pill": "医生入驻", "cta.titlePre": "让您的诊所触达", "cta.titleEm": "数百万人。",
  "cta.desc": "加入 4,200+ 认证整形诊所。通过患者日记展示作品,吸引国际患者,填满您的手术日程。",
  "cta.apply": "申请加入",
};

const th: Record<TranslationKey, string> = {
  "nav.discover": "ค้นพบ", "nav.treatments": "หัตถการ", "nav.reviews": "รีวิว", "nav.forClinics": "สำหรับคลินิก", "nav.signIn": "เข้าสู่ระบบ",
  "hero.badge": "ศัลยแพทย์ผ่านการรับรอง 4,200+ คน · 50+ ประเทศ",
  "hero.title1": "ค้นหา", "hero.titleEm": "ดีที่สุด", "hero.title2": "หมอเสริมความงามทั่วโลก",
  "hero.subtitle": "หมอที่ผ่านการรับรอง ผลลัพธ์จริง 50+ ประเทศ แพลตฟอร์มศัลยกรรมข้ามพรมแดนที่น่าเชื่อถือ",
  "hero.procedure": "หัตถการ", "hero.procedurePlaceholder": "เสริมจมูก, ตาสองชั้น...",
  "hero.country": "ประเทศ", "hero.findDoctorsIn": "หาหมอใน", "hero.featuredIn": "แนะนำใน",
  "hero.boardCertified": "เฉพาะที่ผ่านการรับรอง", "hero.countries": "50+ ประเทศ", "hero.diaries": "บันทึกฟื้นตัว 2 ล้าน+",
  "social.verifiedDoctors": "หมอที่ตรวจสอบแล้ว", "social.countriesCovered": "ประเทศที่ครอบคลุม",
  "social.patientVideos": "วิดีโอผู้ป่วย", "social.surgeriesBooked": "การผ่าตัดที่จอง",
  "social.featuredIn": "นำเสนอใน",
  "search.pill": "ค้นหาอัจฉริยะ", "search.titlePre": "ค้นหาหัตถการ", "search.titleEm": "ที่ใช่", "search.titlePost": "อย่างรวดเร็ว",
  "privacy.title": "โหมดความเป็นส่วนตัว", "privacy.desc": "เบลอใบหน้าในวิดีโอผู้ป่วย เปิดใช้งานเริ่มต้นในบางภูมิภาค",
  "feed.pill": "ดูตอนนี้", "feed.titlePre": "ผ่าตัดจริง,", "feed.titleEm": "ฟื้นตัวจริง", "feed.seeAll": "ดูวิดีโอทั้งหมด",
  "trending.pill": "ยอดนิยมสัปดาห์นี้", "trending.titlePre": "สิ่งที่ทุกคน", "trending.titleEm": "หลงใหล",
  "byCountry.pill": "ตามจุดหมาย", "byCountry.titlePre": "หัตถการยอดนิยม,", "byCountry.titleEm": "แยกตามประเทศ",
  "byCountry.desc": "ที่ที่ผู้ป่วยบินไปเพื่อผลลัพธ์ที่ดีที่สุด — และราคาจริง",
  "stories.pill": "เรื่องราวผู้ป่วย", "stories.titlePre": "การ", "stories.titleEm": "เปลี่ยนแปลง", "stories.titleEnd": "ของพวกเธอ",
  "stories.readAll": "อ่านเรื่องทั้งหมด",
  "ba.pill": "ก่อน / หลัง", "ba.titlePre": "ผลลัพธ์จริง,", "ba.titleEm": "เทียบกัน",
  "ba.desc": "ลากเพื่อเปรียบเทียบ โหมดความเป็นส่วนตัวเปิดใช้งานเริ่มต้น",
  "clinics.pill": "ตรวจสอบแล้ว", "clinics.titlePre": "ศัลยแพทย์ที่สาวๆ", "clinics.titleEm": "ไว้วางใจ", "clinics.viewClinic": "ดูคลินิก",
  "doctor.pill": "โปรไฟล์หมอ", "doctor.titlePre": "ทุกคุณวุฒิ,", "doctor.titleEm": "เปิดเผย",
  "doctor.desc": "ใบอนุญาต, การรับรอง, จำนวนเคส, ภาษา, โรงพยาบาลในเครือ — ตรวจสอบทุกคน",
  "reviews.pill": "รีวิวที่ตรวจสอบ", "reviews.titlePre": "รีวิวจากผู้ป่วยที่", "reviews.titleEm": "บินไปจริง",
  "how.watch": "ดู", "how.watchDesc": "ชมบันทึกการฟื้นตัวจริงจากผู้ป่วยทั่วโลก",
  "how.consult": "ปรึกษา", "how.consultDesc": "จองปรึกษาออนไลน์ฟรีกับหมอที่ผ่านการรับรอง",
  "how.fly": "บิน & ผ่าตัด", "how.flyDesc": "แพ็กเกจเดินทาง โรงแรมพักฟื้น ผู้ประสานงานภาษาไทย",
  "cta.pill": "สำหรับศัลยแพทย์", "cta.titlePre": "นำคลินิกของคุณสู่", "cta.titleEm": "ผู้คนนับล้าน",
  "cta.desc": "เข้าร่วมกับคลินิกศัลยกรรม 4,200+ แห่ง จัดแสดงผลงานผ่านบันทึกผู้ป่วย",
  "cta.apply": "สมัครเข้าร่วม",
};

const ar: Record<TranslationKey, string> = {
  "nav.discover": "اكتشف", "nav.treatments": "الإجراءات", "nav.reviews": "التقييمات", "nav.forClinics": "للعيادات", "nav.signIn": "تسجيل الدخول",
  "hero.badge": "أكثر من 4,200 جراح موثق · أكثر من 50 دولة",
  "hero.title1": "اعثر على", "hero.titleEm": "أفضل", "hero.title2": "أطباء التجميل في العالم.",
  "hero.subtitle": "أطباء موثقون. نتائج حقيقية. أكثر من 50 دولة. المنصة الموثوقة للجراحة التجميلية عبر الحدود.",
  "hero.procedure": "الإجراء", "hero.procedurePlaceholder": "تجميل الأنف، الجفن المزدوج...",
  "hero.country": "الدولة", "hero.findDoctorsIn": "ابحث عن أطباء في", "hero.featuredIn": "مميز في",
  "hero.boardCertified": "معتمدون فقط", "hero.countries": "أكثر من 50 دولة", "hero.diaries": "أكثر من 2 مليون يوميات",
  "social.verifiedDoctors": "أطباء موثقون", "social.countriesCovered": "الدول المشمولة",
  "social.patientVideos": "فيديوهات المرضى", "social.surgeriesBooked": "عمليات محجوزة",
  "social.featuredIn": "ظهر في",
  "search.pill": "بحث ذكي", "search.titlePre": "اعثر على", "search.titleEm": "إجرائك الدقيق", "search.titlePost": "بسرعة.",
  "privacy.title": "وضع الخصوصية", "privacy.desc": "تمويه الوجوه في فيديوهات المرضى. مُفعّل افتراضياً في مناطق مختارة.",
  "feed.pill": "شاهد الآن", "feed.titlePre": "عمليات حقيقية,", "feed.titleEm": "تعافي حقيقي.", "feed.seeAll": "كل الفيديوهات",
  "trending.pill": "الأكثر رواجاً هذا الأسبوع", "trending.titlePre": "ما الذي", "trending.titleEm": "يهوس به الجميع",
  "byCountry.pill": "حسب الوجهة", "byCountry.titlePre": "الإجراءات الرائجة,", "byCountry.titleEm": "حسب الدولة.",
  "byCountry.desc": "حيث يسافر المرضى لأفضل النتائج — والأسعار الفعلية.",
  "stories.pill": "قصص المرضى", "stories.titlePre": "تحوّلهن,", "stories.titleEm": "بكلماتهن", "stories.titleEnd": ".",
  "stories.readAll": "كل القصص",
  "ba.pill": "قبل / بعد", "ba.titlePre": "نتائج حقيقية,", "ba.titleEm": "جنباً إلى جنب.",
  "ba.desc": "اسحب للكشف. وضع الخصوصية مفعّل افتراضياً.",
  "clinics.pill": "موثق", "clinics.titlePre": "جراحون", "clinics.titleEm": "نثق بهم فعلاً.", "clinics.viewClinic": "عرض العيادة",
  "doctor.pill": "ملف الطبيب", "doctor.titlePre": "كل المؤهلات,", "doctor.titleEm": "موثقة وعلنية.",
  "doctor.desc": "الترخيص، الشهادات، عدد العمليات، اللغات، المستشفيات — يتم التحقق قبل ظهور أي طبيب.",
  "reviews.pill": "مراجعات موثقة", "reviews.titlePre": "مراجعات من مرضى", "reviews.titleEm": "سافروا فعلاً.",
  "how.watch": "شاهد", "how.watchDesc": "تصفح يوميات تعافي حقيقية من مرضى موثقين عالمياً.",
  "how.consult": "استشر", "how.consultDesc": "احجز استشارات افتراضية مجانية مع جراحين معتمدين.",
  "how.fly": "سافر وأجرِ العملية", "how.flyDesc": "باقات سفر وفنادق نقاهة ومنسقون يتحدثون العربية.",
  "cta.pill": "للجراحين", "cta.titlePre": "أوصل عيادتك إلى", "cta.titleEm": "الملايين.",
  "cta.desc": "انضم إلى أكثر من 4,200 عيادة جراحة تجميلية معتمدة. اعرض أعمالك واجذب مرضى دوليين.",
  "cta.apply": "قدّم للانضمام",
};

export const translations: Record<LanguageCode, Record<TranslationKey, string>> = { en, ko, th, ar, zh };

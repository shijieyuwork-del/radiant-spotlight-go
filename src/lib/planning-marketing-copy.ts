import { withVietnameseFallback } from "@/lib/asia-copy";
import type { AsiaLang } from "@/lib/asia-i18n";

type PlanningMarketingCopy = {
  title: string;
  emphasis: string;
  subtitle: string;
  diaries: string;
  photoDescription: string;
  choosePath: string;
  procedure: string;
  procedureDetail: string;
  providers: string;
  providersDetail: string;
  trip: string;
  tripDetail: string;
};

const copy: Record<AsiaLang, PlanningMarketingCopy> = withVietnameseFallback({
  en: {
    title: "Compare providers.",
    emphasis: "Plan your care in China.",
    subtitle: "Review published clinic and expert information, understand indicative costs, and get practical support for consultations and travel.",
    diaries: "See patient recovery diaries",
    photoDescription: "Published before-and-after photo sets from listed experts in China.",
    choosePath: "Where would you like to start?",
    procedure: "I know the procedure",
    procedureDetail: "Search procedure guides and indicative costs.",
    providers: "I’m comparing providers",
    providersDetail: "Explore clinics and their published expert information.",
    trip: "I need help planning the trip",
    tripDetail: "Share your preferences with a coordinator.",
  },
  zh: {
    title: "比较医院、诊所与医生。",
    emphasis: "规划你的中国医美行程。",
    subtitle: "查看已发布的机构与医生资料，了解大致费用，并获得咨询、翻译与赴华行程协调支持。",
    diaries: "查看患者恢复日记",
    photoDescription: "查看平台收录医生发布的术前术后对比照片。",
    choosePath: "你希望从哪里开始？",
    procedure: "我已经知道想了解的项目",
    procedureDetail: "搜索项目指南与参考费用。",
    providers: "我正在比较机构与医生",
    providersDetail: "查看医院、诊所及其已发布的医生资料。",
    trip: "我需要协助规划行程",
    tripDetail: "告诉协调员你的需求、时间和意向城市。",
  },
  ru: {
    title: "Сравните варианты.",
    emphasis: "Приезжайте в Китай с ясным планом.",
    subtitle: "Клиники, специалисты и ориентировочная стоимость в одном месте. Мы поможем подготовить консультацию и организовать поездку.",
    diaries: "Смотреть дневники восстановления",
    photoDescription: "Опубликованные фото до и после от специалистов в Китае, представленных в каталоге.",
    choosePath: "С чего вы хотите начать?",
    procedure: "Я знаю, какая процедура меня интересует",
    procedureDetail: "Найдите руководства и ориентировочную стоимость.",
    providers: "Я сравниваю клиники и специалистов",
    providersDetail: "Изучите клиники и опубликованные сведения об их специалистах.",
    trip: "Мне нужна помощь с планированием поездки",
    tripDetail: "Расскажите координатору о целях, сроках и предпочтениях.",
  },
  es: {
    title: "Compara con claridad.",
    emphasis: "Llega a China con un plan.",
    subtitle: "Clínicas, especialistas y precios orientativos en un solo lugar. Te ayudamos a preparar la consulta y coordinar el viaje.",
    diaries: "Ver diarios de recuperación de pacientes",
    photoDescription: "Conjuntos publicados de fotos de antes y después de especialistas en China incluidos en el directorio.",
    choosePath: "¿Por dónde quieres empezar?",
    procedure: "Ya sé qué procedimiento me interesa",
    procedureDetail: "Busca guías de procedimientos y costes orientativos.",
    providers: "Estoy comparando clínicas y especialistas",
    providersDetail: "Explora clínicas e información publicada sobre sus especialistas.",
    trip: "Necesito ayuda para planificar el viaje",
    tripDetail: "Cuéntale al coordinador tus objetivos, fechas y preferencias.",
  },
  th: {
    title: "เปรียบเทียบอย่างมั่นใจ",
    emphasis: "เดินทางไปจีนพร้อมแผนที่ชัดเจน",
    subtitle: "ดูข้อมูลคลินิก ผู้เชี่ยวชาญ และค่าใช้จ่ายโดยประมาณในที่เดียว พร้อมผู้ช่วยเตรียมการปรึกษาและประสานงานการเดินทาง",
    diaries: "ดูบันทึกการฟื้นตัวของผู้ป่วย",
    photoDescription: "ชุดภาพก่อนและหลังที่เผยแพร่โดยผู้เชี่ยวชาญในจีนที่อยู่ในรายชื่อ",
    choosePath: "คุณต้องการเริ่มต้นจากตรงไหน?",
    procedure: "ฉันทราบหัตถการที่สนใจแล้ว",
    procedureDetail: "ค้นหาคู่มือหัตถการและค่าใช้จ่ายโดยประมาณ",
    providers: "ฉันกำลังเปรียบเทียบสถานพยาบาล",
    providersDetail: "สำรวจคลินิกและข้อมูลผู้เชี่ยวชาญที่เผยแพร่",
    trip: "ฉันต้องการความช่วยเหลือในการวางแผนเดินทาง",
    tripDetail: "แจ้งเป้าหมาย ช่วงเวลา และความต้องการของคุณกับผู้ประสานงาน",
  },
  ms: {
    title: "Bandingkan dengan yakin.",
    emphasis: "Tiba di China dengan rancangan yang jelas.",
    subtitle: "Maklumat klinik, pakar dan anggaran kos di satu tempat. Kami membantu anda menyediakan konsultasi dan menyelaras perjalanan.",
    diaries: "Lihat diari pemulihan pesakit",
    photoDescription: "Set foto sebelum dan selepas yang diterbitkan oleh pakar di China yang disenaraikan dalam direktori.",
    choosePath: "Di manakah anda ingin bermula?",
    procedure: "Saya tahu prosedur yang saya minati",
    procedureDetail: "Cari panduan prosedur dan anggaran kos.",
    providers: "Saya sedang membandingkan penyedia rawatan",
    providersDetail: "Terokai klinik dan maklumat pakar yang diterbitkan.",
    trip: "Saya perlukan bantuan merancang perjalanan",
    tripDetail: "Kongsi matlamat, tarikh dan pilihan anda dengan penyelaras.",
  },
  vi: {
    title: "So sánh rõ ràng.",
    emphasis: "Đến Trung Quốc với một kế hoạch cụ thể.",
    subtitle: "Thông tin cơ sở, chuyên gia và chi phí tham khảo trong một nơi. Chúng tôi hỗ trợ bạn chuẩn bị tư vấn và điều phối hành trình.",
    diaries: "Xem nhật ký hồi phục của bệnh nhân",
    photoDescription: "Bộ ảnh trước và sau đã công bố của các chuyên gia tại Trung Quốc có trong danh mục.",
    choosePath: "Bạn muốn bắt đầu từ đâu?",
    procedure: "Tôi đã biết quy trình mình quan tâm",
    procedureDetail: "Tìm hướng dẫn quy trình và chi phí tham khảo.",
    providers: "Tôi đang so sánh các cơ sở",
    providersDetail: "Khám phá các phòng khám và thông tin chuyên gia đã công bố.",
    trip: "Tôi cần hỗ trợ lên kế hoạch chuyến đi",
    tripDetail: "Chia sẻ mục tiêu, thời gian và mong muốn với điều phối viên.",
  },
  ko: {
    title: "정보를 비교하고,",
    emphasis: "중국 방문을 명확하게 준비하세요.",
    subtitle: "병원·전문의 정보와 예상 비용을 한곳에서 확인하세요. 상담 준비부터 중국 방문 일정까지 함께 조율합니다.",
    diaries: "환자 회복 일지 보기",
    photoDescription: "중국 등록 전문의가 공개한 시술 전후 사진입니다.",
    choosePath: "어디서부터 시작할까요?",
    procedure: "관심 시술을 알고 있어요",
    procedureDetail: "시술 안내와 예상 비용을 확인하세요.",
    providers: "병원과 전문의를 비교하고 있어요",
    providersDetail: "의료기관과 공개된 전문의 정보를 살펴보세요.",
    trip: "중국 방문 계획에 도움이 필요해요",
    tripDetail: "목표, 일정, 선호 사항을 코디네이터에게 알려주세요.",
  },
  ja: {
    title: "情報を比較して、",
    emphasis: "中国渡航を明確にプランニング。",
    subtitle: "病院・専門医情報と目安料金を一か所で確認。相談準備から中国での滞在までコーディネートします。",
    diaries: "患者の回復日記を見る",
    photoDescription: "中国の掲載専門医が公開した施術前後の写真です。",
    choosePath: "どこから始めますか？",
    procedure: "検討中の施術が決まっている",
    procedureDetail: "施術ガイドと目安料金を確認できます。",
    providers: "医療機関や専門医を比較したい",
    providersDetail: "病院・クリニックと公開済みの専門医情報を確認できます。",
    trip: "中国渡航の計画を相談したい",
    tripDetail: "目的、時期、希望をコーディネーターにお知らせください。",
  },
});

export const getPlanningMarketingCopy = (lang: AsiaLang) => copy[lang];

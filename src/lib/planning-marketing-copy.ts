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
    title: "比较医疗机构与专家。",
    emphasis: "规划你的中国医美行程。",
    subtitle: "查看已发布的机构与专家资料，了解参考费用，并获得咨询和行程安排方面的实际支持。",
    diaries: "查看患者恢复日记",
    photoDescription: "查看平台收录的中国专家已发布的术前术后对比图集。",
    choosePath: "你希望从哪里开始？",
    procedure: "我已经知道想了解的项目",
    procedureDetail: "搜索项目指南与参考费用。",
    providers: "我正在比较医疗机构",
    providersDetail: "了解机构及其公开的专家资料。",
    trip: "我需要协助规划行程",
    tripDetail: "向协调员说明你的偏好与安排。",
  },
  ru: {
    title: "Сравните клиники и специалистов.",
    emphasis: "Спланируйте поездку в Китай.",
    subtitle: "Изучите опубликованные сведения о клиниках и специалистах, ориентировочные расходы и получите практическую помощь с консультациями и поездкой.",
    diaries: "Смотреть дневники восстановления",
    photoDescription: "Опубликованные фото до и после от специалистов в Китае, представленных в каталоге.",
    choosePath: "С чего вы хотите начать?",
    procedure: "Я знаю, какая процедура меня интересует",
    procedureDetail: "Найдите руководства и ориентировочную стоимость.",
    providers: "Я сравниваю клиники и специалистов",
    providersDetail: "Изучите клиники и опубликованные сведения об их специалистах.",
    trip: "Мне нужна помощь с планированием поездки",
    tripDetail: "Расскажите координатору о ваших предпочтениях.",
  },
  es: {
    title: "Compara clínicas y especialistas.",
    emphasis: "Planifica tu atención en China.",
    subtitle: "Consulta información publicada sobre clínicas y especialistas, conoce los costes orientativos y recibe apoyo práctico para consultas y viajes.",
    diaries: "Ver diarios de recuperación de pacientes",
    photoDescription: "Conjuntos publicados de fotos de antes y después de especialistas en China incluidos en el directorio.",
    choosePath: "¿Por dónde quieres empezar?",
    procedure: "Ya sé qué procedimiento me interesa",
    procedureDetail: "Busca guías de procedimientos y costes orientativos.",
    providers: "Estoy comparando clínicas y especialistas",
    providersDetail: "Explora clínicas e información publicada sobre sus especialistas.",
    trip: "Necesito ayuda para planificar el viaje",
    tripDetail: "Comparte tus preferencias con un coordinador.",
  },
  th: {
    title: "เปรียบเทียบคลินิกและผู้เชี่ยวชาญ",
    emphasis: "วางแผนการดูแลของคุณในจีน",
    subtitle: "อ่านข้อมูลคลินิกและผู้เชี่ยวชาญที่เผยแพร่ ทำความเข้าใจค่าใช้จ่ายโดยประมาณ และรับความช่วยเหลือด้านการปรึกษาและการเดินทาง",
    diaries: "ดูบันทึกการฟื้นตัวของผู้ป่วย",
    photoDescription: "ชุดภาพก่อนและหลังที่เผยแพร่โดยผู้เชี่ยวชาญในจีนที่อยู่ในรายชื่อ",
    choosePath: "คุณต้องการเริ่มต้นจากตรงไหน?",
    procedure: "ฉันทราบหัตถการที่สนใจแล้ว",
    procedureDetail: "ค้นหาคู่มือหัตถการและค่าใช้จ่ายโดยประมาณ",
    providers: "ฉันกำลังเปรียบเทียบสถานพยาบาล",
    providersDetail: "สำรวจคลินิกและข้อมูลผู้เชี่ยวชาญที่เผยแพร่",
    trip: "ฉันต้องการความช่วยเหลือในการวางแผนเดินทาง",
    tripDetail: "แจ้งความต้องการของคุณกับผู้ประสานงาน",
  },
  ms: {
    title: "Bandingkan klinik dan pakar.",
    emphasis: "Rancang penjagaan anda di China.",
    subtitle: "Semak maklumat klinik dan pakar yang diterbitkan, fahami anggaran kos, dan dapatkan sokongan praktikal untuk konsultasi dan perjalanan.",
    diaries: "Lihat diari pemulihan pesakit",
    photoDescription: "Set foto sebelum dan selepas yang diterbitkan oleh pakar di China yang disenaraikan dalam direktori.",
    choosePath: "Di manakah anda ingin bermula?",
    procedure: "Saya tahu prosedur yang saya minati",
    procedureDetail: "Cari panduan prosedur dan anggaran kos.",
    providers: "Saya sedang membandingkan penyedia rawatan",
    providersDetail: "Terokai klinik dan maklumat pakar yang diterbitkan.",
    trip: "Saya perlukan bantuan merancang perjalanan",
    tripDetail: "Kongsi pilihan anda dengan penyelaras.",
  },
});

export const getPlanningMarketingCopy = (lang: AsiaLang) => copy[lang];

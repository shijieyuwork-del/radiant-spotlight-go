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
    title: "先比较，再决定。",
    emphasis: "清晰规划你的中国医美之旅。",
    subtitle: "集中查看已发布的医院、诊所与医生资料，了解参考费用，并获得咨询、翻译和赴华行程协调支持。",
    diaries: "查看患者恢复日记",
    photoDescription: "查看平台收录医生发布的术前术后对比照片集。",
    choosePath: "你希望从哪里开始？",
    procedure: "我已经知道想了解的项目",
    procedureDetail: "查看项目指南和参考费用。",
    providers: "我正在比较机构与医生",
    providersDetail: "查看医院、诊所及其已发布的医生资料。",
    trip: "我需要协助规划行程",
    tripDetail: "告诉协调员你的需求、计划时间和意向城市。",
  },
  ru: {
    title: "Сравните клиники и специалистов.",
    emphasis: "Спланируйте лечение в Китае заранее.",
    subtitle: "Изучите опубликованные сведения о клиниках и специалистах, узнайте ориентировочную стоимость и получите помощь с консультацией, переводом и поездкой.",
    diaries: "Смотреть дневники восстановления",
    photoDescription: "Опубликованные фотографии до и после от специалистов из нашего каталога в Китае.",
    choosePath: "С чего вы хотите начать?",
    procedure: "Я знаю, какая процедура меня интересует",
    procedureDetail: "Изучите описание процедуры и ориентировочную стоимость.",
    providers: "Я сравниваю клиники и специалистов",
    providersDetail: "Изучите клиники и опубликованные сведения об их специалистах.",
    trip: "Мне нужна помощь с планированием поездки",
    tripDetail: "Расскажите координатору о целях, сроках и предпочтениях.",
  },
  es: {
    title: "Compara clínicas y especialistas.",
    emphasis: "Planifica tu atención en China.",
    subtitle: "Consulta información publicada sobre clínicas y especialistas, conoce los costes orientativos y recibe apoyo para la consulta, la interpretación y el viaje.",
    diaries: "Ver diarios de recuperación de pacientes",
    photoDescription: "Fotos de antes y después publicadas por especialistas incluidos en nuestro directorio de China.",
    choosePath: "¿Por dónde quieres empezar?",
    procedure: "Ya sé qué procedimiento me interesa",
    procedureDetail: "Busca guías de procedimientos y costes orientativos.",
    providers: "Estoy comparando clínicas y especialistas",
    providersDetail: "Explora clínicas e información publicada sobre sus especialistas.",
    trip: "Necesito ayuda para planificar el viaje",
    tripDetail: "Cuéntale al coordinador tus objetivos, fechas y preferencias.",
  },
  th: {
    title: "เปรียบเทียบสถานพยาบาลและผู้เชี่ยวชาญ",
    emphasis: "วางแผนการรักษาในจีนอย่างชัดเจน",
    subtitle: "ดูข้อมูลสถานพยาบาลและผู้เชี่ยวชาญที่เผยแพร่ ตรวจสอบค่าใช้จ่ายโดยประมาณ และรับความช่วยเหลือด้านการปรึกษา ล่าม และการเดินทาง",
    diaries: "ดูบันทึกการฟื้นตัวของผู้ป่วย",
    photoDescription: "ภาพก่อนและหลังที่เผยแพร่โดยผู้เชี่ยวชาญในจีนซึ่งอยู่ในรายชื่อของเรา",
    choosePath: "คุณต้องการเริ่มต้นจากตรงไหน?",
    procedure: "ฉันทราบหัตถการที่สนใจแล้ว",
    procedureDetail: "ค้นหาคู่มือหัตถการและค่าใช้จ่ายโดยประมาณ",
    providers: "ฉันกำลังเปรียบเทียบสถานพยาบาล",
    providersDetail: "สำรวจคลินิกและข้อมูลผู้เชี่ยวชาญที่เผยแพร่",
    trip: "ฉันต้องการความช่วยเหลือในการวางแผนเดินทาง",
    tripDetail: "แจ้งเป้าหมาย ช่วงเวลา และความต้องการของคุณกับผู้ประสานงาน",
  },
  ms: {
    title: "Bandingkan klinik dan pakar.",
    emphasis: "Rancang rawatan anda di China dengan jelas.",
    subtitle: "Semak maklumat klinik dan pakar yang diterbitkan, fahami anggaran kos serta dapatkan bantuan untuk konsultasi, jurubahasa dan perjalanan.",
    diaries: "Lihat diari pemulihan pesakit",
    photoDescription: "Foto sebelum dan selepas yang diterbitkan oleh pakar dalam direktori kami di China.",
    choosePath: "Di manakah anda ingin bermula?",
    procedure: "Saya tahu prosedur yang saya minati",
    procedureDetail: "Cari panduan prosedur dan anggaran kos.",
    providers: "Saya sedang membandingkan penyedia rawatan",
    providersDetail: "Terokai klinik dan maklumat pakar yang diterbitkan.",
    trip: "Saya perlukan bantuan merancang perjalanan",
    tripDetail: "Kongsi matlamat, tarikh dan pilihan anda dengan penyelaras.",
  },
  vi: {
    title: "So sánh cơ sở và bác sĩ.",
    emphasis: "Lên kế hoạch điều trị tại Trung Quốc rõ ràng hơn.",
    subtitle: "Xem thông tin đã công bố về cơ sở và bác sĩ, tham khảo chi phí, đồng thời nhận hỗ trợ cho buổi tư vấn, phiên dịch và hành trình.",
    diaries: "Xem nhật ký hồi phục của bệnh nhân",
    photoDescription: "Ảnh trước và sau do các bác sĩ trong danh mục tại Trung Quốc công bố.",
    choosePath: "Bạn muốn bắt đầu từ đâu?",
    procedure: "Tôi đã biết thủ thuật mình quan tâm",
    procedureDetail: "Xem hướng dẫn thủ thuật và chi phí tham khảo.",
    providers: "Tôi đang so sánh các cơ sở",
    providersDetail: "Khám phá các phòng khám và thông tin chuyên gia đã công bố.",
    trip: "Tôi cần hỗ trợ lên kế hoạch chuyến đi",
    tripDetail: "Chia sẻ mục tiêu, thời gian và mong muốn với điều phối viên.",
  },
  ko: {
    title: "병원과 전문의를 비교하고,",
    emphasis: "중국 진료 계획을 더 명확하게 세워보세요.",
    subtitle: "공개된 병원·전문의 정보와 예상 비용을 확인하고, 상담 준비부터 통역과 중국 방문 일정까지 지원받으세요.",
    diaries: "환자 회복 일지 보기",
    photoDescription: "중국 내 등록 전문의가 공개한 시술 전후 사진입니다.",
    choosePath: "어디서부터 시작할까요?",
    procedure: "관심 시술을 알고 있어요",
    procedureDetail: "시술 안내와 예상 비용을 확인하세요.",
    providers: "병원과 전문의를 비교하고 있어요",
    providersDetail: "의료기관과 공개된 전문의 정보를 살펴보세요.",
    trip: "중국 방문 계획에 도움이 필요해요",
    tripDetail: "목표, 일정, 선호 사항을 코디네이터에게 알려주세요.",
  },
  ja: {
    title: "医療機関と専門医を比較して、",
    emphasis: "中国での治療計画を明確に。",
    subtitle: "公開済みの医療機関・専門医情報と目安料金を確認し、相談準備から通訳、中国渡航までサポートを受けられます。",
    diaries: "患者の回復日記を見る",
    photoDescription: "中国で掲載中の専門医が公開した施術前後の写真です。",
    choosePath: "どこから始めますか？",
    procedure: "検討中の施術が決まっている",
    procedureDetail: "施術ガイドと目安料金を確認できます。",
    providers: "医療機関や専門医を比較したい",
    providersDetail: "病院・クリニックと公開済みの専門医情報を確認できます。",
    trip: "中国渡航の計画を相談したい",
    tripDetail: "目的、時期、希望をコーディネーターにお知らせください。",
  },
  ar: {
    title: "قارن بين المؤسسات والمتخصصين.", emphasis: "خطط لرعايتك في الصين بوضوح.", subtitle: "راجع المعلومات المنشورة عن المؤسسات والمتخصصين والتكاليف التقديرية، واحصل على دعم للاستشارة والترجمة وترتيبات السفر.", diaries: "عرض يوميات تعافي المرضى", photoDescription: "صور قبل وبعد نشرها متخصصون مدرجون في دليلنا داخل الصين.", choosePath: "من أين تود أن تبدأ؟", procedure: "أعرف الإجراء الذي أفكر فيه", procedureDetail: "اطّلع على دليل الإجراء والتكلفة التقديرية.", providers: "أقارن بين المؤسسات والمتخصصين", providersDetail: "راجع المؤسسات والمعلومات المنشورة عن المتخصصين.", trip: "أحتاج إلى مساعدة في تخطيط الرحلة", tripDetail: "شارك أهدافك ومواعيدك وتفضيلاتك مع المنسق.",
  },
  "pt-BR": {
    title: "Compare clínicas e especialistas.", emphasis: "Planeje seu tratamento na China.", subtitle: "Consulte informações publicadas sobre clínicas e especialistas, entenda os custos estimados e receba apoio para a consulta, interpretação e viagem.", diaries: "Ver diários de recuperação", photoDescription: "Fotos de antes e depois publicadas por especialistas do nosso diretório na China.", choosePath: "Por onde você quer começar?", procedure: "Já sei qual procedimento estou considerando", procedureDetail: "Consulte guias de procedimentos e custos estimados.", providers: "Estou comparando clínicas e especialistas", providersDetail: "Conheça as instituições e as informações publicadas sobre seus especialistas.", trip: "Preciso de ajuda para planejar a viagem", tripDetail: "Compartilhe seus objetivos, datas e preferências com o coordenador.",
  },
  id: {
    title: "Bandingkan fasilitas dan spesialis.", emphasis: "Rencanakan perawatan Anda di Tiongkok.", subtitle: "Tinjau informasi fasilitas dan spesialis yang dipublikasikan, pahami perkiraan biaya, serta dapatkan dukungan untuk konsultasi, penerjemahan, dan perjalanan.", diaries: "Lihat jurnal pemulihan pasien", photoDescription: "Foto sebelum dan sesudah yang dipublikasikan oleh spesialis dalam direktori kami di Tiongkok.", choosePath: "Anda ingin mulai dari mana?", procedure: "Saya sudah tahu prosedur yang sedang dipertimbangkan", procedureDetail: "Lihat panduan prosedur dan perkiraan biaya.", providers: "Saya sedang membandingkan fasilitas dan spesialis", providersDetail: "Tinjau fasilitas dan informasi spesialis yang dipublikasikan.", trip: "Saya perlu bantuan merencanakan perjalanan", tripDetail: "Sampaikan tujuan, jadwal, dan preferensi Anda kepada koordinator.",
  },
  fr: {
    title: "Comparez les établissements et les spécialistes.", emphasis: "Planifiez vos soins en Chine.", subtitle: "Consultez les informations publiées sur les établissements et les spécialistes, découvrez les coûts indicatifs et bénéficiez d’un accompagnement pour la consultation, l’interprétation et le voyage.", diaries: "Voir les journaux de récupération", photoDescription: "Photos avant-après publiées par les spécialistes de notre annuaire en Chine.", choosePath: "Par où souhaitez-vous commencer ?", procedure: "Je connais l’intervention que j’envisage", procedureDetail: "Consultez les guides d’intervention et les coûts indicatifs.", providers: "Je compare les établissements et les spécialistes", providersDetail: "Découvrez les établissements et les informations publiées sur leurs spécialistes.", trip: "J’ai besoin d’aide pour organiser mon voyage", tripDetail: "Partagez vos objectifs, vos dates et vos préférences avec le coordinateur.",
  },
  de: {
    title: "Vergleichen Sie Kliniken und Fachärzte.", emphasis: "Planen Sie Ihre Behandlung in China.", subtitle: "Prüfen Sie veröffentlichte Informationen zu Kliniken und Fachärzten, informieren Sie sich über Richtpreise und erhalten Sie Unterstützung bei Beratung, Dolmetschen und Reiseplanung.", diaries: "Genesungstagebücher ansehen", photoDescription: "Veröffentlichte Vorher-Nachher-Fotos von Fachärzten aus unserem Verzeichnis in China.", choosePath: "Wo möchten Sie beginnen?", procedure: "Ich weiß, welche Behandlung ich erwäge", procedureDetail: "Behandlungsinformationen und Richtpreise ansehen.", providers: "Ich vergleiche Kliniken und Fachärzte", providersDetail: "Kliniken und veröffentlichte Informationen zu ihren Fachärzten ansehen.", trip: "Ich brauche Hilfe bei der Reiseplanung", tripDetail: "Teilen Sie Ihre Ziele, Termine und Wünsche mit dem Koordinator.",
  },
});

export const getPlanningMarketingCopy = (lang: AsiaLang) => copy[lang];

import type { AsiaLang } from "@/lib/asia-i18n";

export const COORDINATION_DEPOSIT_USD = 200;

type CoordinationPolicyCopy = {
  heading: string;
  scope: string;
  freeTitle: string;
  freeText: string;
  depositTitle: string;
  depositPurpose: string;
  collectionTitle: string;
  collection: string;
  refundTitle: string;
  refund: string;
  cancellationTitle: string;
  cancellation: string;
  medicalTitle: string;
  medical: string;
  separateCosts: string;
  confirm: string;
};

/**
 * Business-confirmed: China only, $200 deposit, returned on surgery day.
 * Collection, cancellation and rescheduling rules have not been supplied.
 * Do not invent deadlines, deductions or an unconditional cancellation refund.
 */
export const COORDINATION_POLICY: Record<AsiaLang, CoordinationPolicyCopy> = {
  en: {
    heading: "Free support and your $200 deposit",
    scope: "CeladonChina coordinates cosmetic-care visits in China only.",
    freeTitle: "What free coordination includes",
    freeText: "Consultation and appointment coordination, airport transfers, interpretation during agreed clinic visits, records organization, hotel booking guidance and follow-up coordination. Your written support plan sets out the included visits and services.",
    depositTitle: "$200 coordination deposit",
    depositPurpose: "The deposit reserves your procedure appointment and agreed coordination support. It is separate from your medical fees.",
    collectionTitle: "Before paying",
    collection: "Ask your coordinator to confirm when the deposit is due and the support included in your booking.",
    refundTitle: "Returned on surgery day",
    refund: "Your $200 coordination deposit is returned on the day of your surgery.",
    cancellationTitle: "Cancellation, rescheduling or no surgery",
    cancellation: "Before paying, ask for the applicable terms in writing, including what happens to your deposit if you cancel, change dates or cannot proceed with surgery.",
    medicalTitle: "Pay the clinic directly",
    medical: "Pay all consultation, examination, surgery, anesthesia and other medical fees directly to the treating clinic or hospital. CeladonChina does not collect medical payments.",
    separateCosts: "Flights, visas, hotel accommodation, optional outings and personal expenses are paid separately unless your written plan expressly includes them.",
    confirm: "Confirm payment terms",
  },
  zh: {
    heading: "免费协调服务与 200 美元押金",
    scope: "CeladonChina 仅协调中国境内的医美就诊与行程。",
    freeTitle: "免费协调包含什么",
    freeText: "咨询与预约协调、机场接送、约定就诊期间的翻译、病历整理、酒店预订协助及随访协调。包含的就诊次数与具体服务以书面服务方案为准。",
    depositTitle: "200 美元协调押金",
    depositPurpose: "押金用于保留手术预约及约定的协调支持，与医疗费用分开。",
    collectionTitle: "付款前确认",
    collection: "请先向协调员确认押金的收取时间，以及本次预约包含的支持服务。",
    refundTitle: "手术当天退还",
    refund: "200 美元协调押金在你的手术当天退还。",
    cancellationTitle: "取消、改期或无法手术",
    cancellation: "付款前，请取得适用条款的书面说明，包括取消、改期或无法进行手术时押金如何处理。",
    medicalTitle: "医疗费用直接支付给机构",
    medical: "面诊、检查、手术、麻醉及其他医疗费用均直接支付给接诊的诊所或医院。CeladonChina 不代收医疗费用。",
    separateCosts: "机票、签证、酒店住宿、自选出游及个人开支另行支付，除非书面服务方案明确包含。",
    confirm: "确认付款条款",
  },
  ru: {
    heading: "Бесплатная поддержка и депозит $200",
    scope: "CeladonChina координирует поездки для эстетической медицины только в Китай.",
    freeTitle: "Что входит в бесплатную координацию",
    freeText: "Согласование консультаций и записи, трансфер из аэропорта и обратно, перевод на согласованных приёмах, подготовка документов, помощь с бронированием отеля и последующим наблюдением. Включённые визиты и услуги указаны в письменном плане поддержки.",
    depositTitle: "Координационный депозит $200",
    depositPurpose: "Депозит резервирует запись на процедуру и согласованную поддержку. Он оплачивается отдельно от медицинских услуг.",
    collectionTitle: "До оплаты",
    collection: "Уточните у координатора срок внесения депозита и услуги, включённые в вашу запись.",
    refundTitle: "Возврат в день операции",
    refund: "Координационный депозит $200 возвращается в день вашей операции.",
    cancellationTitle: "Отмена, перенос или невозможность операции",
    cancellation: "До оплаты получите условия письменно, включая порядок обращения с депозитом при отмене, переносе даты или невозможности проведения операции.",
    medicalTitle: "Оплачивайте клинике напрямую",
    medical: "Консультации, обследования, операция, анестезия и другие медицинские услуги оплачиваются непосредственно лечащей клинике или больнице. CeladonChina не принимает медицинские платежи.",
    separateCosts: "Перелёт, виза, отель, необязательные поездки и личные расходы оплачиваются отдельно, если письменный план прямо не включает их.",
    confirm: "Уточнить условия оплаты",
  },
  es: {
    heading: "Apoyo gratuito y tu depósito de 200 USD",
    scope: "CeladonChina coordina visitas de medicina estética únicamente en China.",
    freeTitle: "Qué incluye la coordinación gratuita",
    freeText: "Coordinación de consultas y citas, traslados al aeropuerto, interpretación durante las visitas acordadas, organización del historial, ayuda para reservar hotel y coordinación del seguimiento. Tu plan escrito detalla las visitas y los servicios incluidos.",
    depositTitle: "Depósito de coordinación de 200 USD",
    depositPurpose: "El depósito reserva tu cita para el procedimiento y el apoyo acordado. Es independiente de los gastos médicos.",
    collectionTitle: "Antes de pagar",
    collection: "Confirma con tu coordinador cuándo debes pagar el depósito y qué apoyo incluye tu reserva.",
    refundTitle: "Reembolso el día de la cirugía",
    refund: "Tu depósito de coordinación de 200 USD se devuelve el día de tu cirugía.",
    cancellationTitle: "Cancelación, cambio de fecha o cirugía no realizada",
    cancellation: "Antes de pagar, solicita las condiciones por escrito, incluido qué ocurre con el depósito si cancelas, cambias la fecha o no puedes someterte a la cirugía.",
    medicalTitle: "Paga directamente a la clínica",
    medical: "Paga las consultas, pruebas, cirugía, anestesia y demás gastos médicos directamente a la clínica u hospital que te atienda. CeladonChina no cobra pagos médicos.",
    separateCosts: "Los vuelos, visados, alojamiento, excursiones opcionales y gastos personales se pagan aparte, salvo que el plan escrito los incluya expresamente.",
    confirm: "Confirmar condiciones de pago",
  },
  th: {
    heading: "บริการประสานงานฟรีและเงินมัดจำ 200 ดอลลาร์สหรัฐ",
    scope: "CeladonChina ประสานงานการเข้ารับบริการด้านความงามในประเทศจีนเท่านั้น",
    freeTitle: "บริการประสานงานฟรีครอบคลุมอะไรบ้าง",
    freeText: "การประสานงานปรึกษาและนัดหมาย รถรับส่งสนามบิน ล่ามระหว่างการพบแพทย์ที่ตกลงไว้ การจัดเตรียมเวชระเบียน ความช่วยเหลือในการจองโรงแรม และการประสานงานติดตามผล จำนวนครั้งและบริการที่รวมอยู่ระบุในแผนบริการเป็นลายลักษณ์อักษร",
    depositTitle: "เงินมัดจำประสานงาน 200 ดอลลาร์สหรัฐ",
    depositPurpose: "เงินมัดจำใช้สำรองนัดหมายและบริการประสานงานที่ตกลงไว้ โดยแยกจากค่ารักษาพยาบาล",
    collectionTitle: "ก่อนชำระเงิน",
    collection: "โปรดยืนยันกับผู้ประสานงานว่าต้องชำระเงินมัดจำเมื่อใด และการจองของคุณรวมบริการใดบ้าง",
    refundTitle: "คืนเงินในวันผ่าตัด",
    refund: "เงินมัดจำประสานงาน 200 ดอลลาร์สหรัฐจะคืนให้ในวันผ่าตัดของคุณ",
    cancellationTitle: "การยกเลิก เลื่อนนัด หรือไม่สามารถผ่าตัดได้",
    cancellation: "ก่อนชำระเงิน โปรดขอเงื่อนไขเป็นลายลักษณ์อักษร รวมถึงการจัดการเงินมัดจำหากคุณยกเลิก เปลี่ยนวัน หรือไม่สามารถเข้ารับการผ่าตัดได้",
    medicalTitle: "ชำระค่ารักษาให้คลินิกโดยตรง",
    medical: "ชำระค่าปรึกษา ตรวจ ผ่าตัด วิสัญญี และค่ารักษาอื่น ๆ ให้คลินิกหรือโรงพยาบาลที่รักษาโดยตรง CeladonChina ไม่รับชำระค่ารักษาพยาบาล",
    separateCosts: "ค่าตั๋วเครื่องบิน วีซ่า ที่พัก ท่องเที่ยวเพิ่มเติม และค่าใช้จ่ายส่วนตัวชำระแยกต่างหาก เว้นแต่ระบุว่ารวมอยู่ในแผนบริการเป็นลายลักษณ์อักษร",
    confirm: "ยืนยันเงื่อนไขการชำระเงิน",
  },
  ms: {
    heading: "Sokongan percuma dan deposit USD200 anda",
    scope: "CeladonChina menyelaras lawatan rawatan estetik di China sahaja.",
    freeTitle: "Skop penyelarasan percuma",
    freeText: "Penyelarasan konsultasi dan janji temu, pengangkutan lapangan terbang, jurubahasa semasa lawatan klinik yang dipersetujui, penyusunan rekod, bantuan tempahan hotel dan penyelarasan susulan. Pelan sokongan bertulis menyatakan lawatan dan perkhidmatan yang disertakan.",
    depositTitle: "Deposit penyelarasan USD200",
    depositPurpose: "Deposit menempah janji temu prosedur dan sokongan yang dipersetujui. Ia berasingan daripada yuran perubatan.",
    collectionTitle: "Sebelum membayar",
    collection: "Sahkan dengan penyelaras bila deposit perlu dibayar dan sokongan yang termasuk dalam tempahan anda.",
    refundTitle: "Dipulangkan pada hari pembedahan",
    refund: "Deposit penyelarasan USD200 anda dipulangkan pada hari pembedahan anda.",
    cancellationTitle: "Pembatalan, perubahan tarikh atau tiada pembedahan",
    cancellation: "Sebelum membayar, minta syarat bertulis termasuk cara deposit diurus jika anda membatalkan, menukar tarikh atau tidak dapat meneruskan pembedahan.",
    medicalTitle: "Bayar terus kepada klinik",
    medical: "Bayar semua yuran konsultasi, pemeriksaan, pembedahan, anestesia dan perubatan lain terus kepada klinik atau hospital yang merawat. CeladonChina tidak menerima bayaran perubatan.",
    separateCosts: "Penerbangan, visa, penginapan hotel, lawatan pilihan dan perbelanjaan peribadi dibayar berasingan kecuali dinyatakan termasuk dalam pelan bertulis.",
    confirm: "Sahkan syarat pembayaran",
  },
};

export const getCoordinationPolicy = (lang: AsiaLang) => COORDINATION_POLICY[lang];

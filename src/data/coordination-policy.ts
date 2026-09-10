import { withVietnameseFallback } from "@/lib/asia-copy";
import type { AsiaLang } from "@/lib/asia-i18n";

export const COORDINATION_DEPOSIT_USD = 200;

type CoordinationPolicyCopy = {
  heading: string;
  scope: string;
  initialTitle: string;
  initialText: string;
  freeTitle: string;
  freeText: string;
  depositTitle: string;
  depositSummary: string;
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
 * Business-confirmed: China only, $200 collected before departure for China,
 * returned on surgery day; after cancellation, the deposit can be held for one year.
 * Rescheduling, no-surgery and end-of-hold outcomes have not been supplied.
 * Do not invent deductions, forfeiture or an unconditional cancellation refund.
 */
export const COORDINATION_POLICY: Record<AsiaLang, CoordinationPolicyCopy> = withVietnameseFallback({
  en: {
    heading: "Planning, support and payments",
    scope: "CeladonChina coordinates cosmetic-care visits in China only.",
    initialTitle: "Free initial conversation",
    initialText: "Start with questions at no cost and no obligation.",
    freeTitle: "What's on us",
    freeText: "Airport pickup and drop-off, two hotel nights, in-clinic translation, records organization and 24/7 coordination support are included for eligible journeys. Your written support plan confirms the dates, visits and services.",
    depositTitle: "$200 coordination deposit",
    depositSummary: "Collected before departure for China. Returned on surgery day. If you cancel, it can be held for one year. Other circumstances are confirmed in writing.",
    depositPurpose: "The deposit reserves your procedure appointment and agreed coordination support. It is separate from your medical fees.",
    collectionTitle: "Before departure for China",
    collection: "The $200 coordination deposit is collected before you depart for China. Confirm the support included in your booking before paying.",
    refundTitle: "Returned on surgery day",
    refund: "Your $200 coordination deposit is returned on the day of your surgery.",
    cancellationTitle: "Cancellation, rescheduling or no surgery",
    cancellation: "If you cancel, your deposit can be held for one year. Confirm the terms in writing for rescheduling, being unable to have surgery, or the end of the one-year hold.",
    medicalTitle: "Pay the clinic directly",
    medical: "Pay all consultation, examination, surgery, anesthesia and other medical fees directly to the treating clinic or hospital. CeladonChina does not collect medical payments.",
    separateCosts: "Flights, visas, hotel nights after the two included nights, optional outings and personal expenses are paid separately unless your written plan expressly includes them.",
    confirm: "Confirm payment terms",
  },
  zh: {
    heading: "行程规划、协调支持与付款",
    scope: "CeladonChina 仅协调中国境内的医美就诊与行程。",
    initialTitle: "免费初步沟通",
    initialText: "先说出你的问题，无需付费，也无需承诺预约。",
    freeTitle: "我们承担哪些服务",
    freeText: "符合条件的行程可包含机场接送、两晚酒店、院内翻译、病历整理和 24 小时协调支持。具体日期、就诊次数与服务内容以书面服务方案为准。",
    depositTitle: "200 美元协调押金",
    depositSummary: "赴中国前收取，手术当天退还。取消后，押金可以保留一年。其他情况以书面确认的条款为准。",
    depositPurpose: "押金用于保留手术预约及约定的协调支持，与医疗费用分开。",
    collectionTitle: "出发前收取",
    collection: "200 美元协调押金在赴中国前收取。付款前，请确认本次预约包含的支持服务。",
    refundTitle: "手术当天退还",
    refund: "200 美元协调押金在你的手术当天退还。",
    cancellationTitle: "取消、改期或无法手术",
    cancellation: "取消后，押金可以保留一年。改期、无法手术或保留期届满时如何处理，请事先取得书面说明。",
    medicalTitle: "医疗费用直接支付给机构",
    medical: "面诊、检查、手术、麻醉及其他医疗费用均直接支付给接诊的诊所或医院。CeladonChina 不代收医疗费用。",
    separateCosts: "机票、签证、两晚免费酒店之外的住宿、自选出游及个人开支另行支付，除非书面服务方案明确包含。",
    confirm: "确认付款条款",
  },
  ru: {
    heading: "Планирование, поддержка и оплата",
    scope: "CeladonChina координирует поездки для эстетической медицины только в Китай.",
    initialTitle: "Бесплатная первая беседа",
    initialText: "Начните с вопросов: бесплатно и без обязательств.",
    freeTitle: "Что за наш счёт",
    freeText: "Трансфер из аэропорта и обратно, две ночи в отеле, перевод в клинике, подготовка документов и координационная поддержка 24/7 входят в план для подходящих поездок. Даты, визиты и услуги подтверждаются письменно.",
    depositTitle: "Координационный депозит $200",
    depositSummary: "Вносится до выезда в Китай. Возвращается в день операции. При отмене депозит можно сохранить на один год. Условия для других обстоятельств подтверждаются письменно.",
    depositPurpose: "Депозит резервирует запись на процедуру и согласованную поддержку. Он оплачивается отдельно от медицинских услуг.",
    collectionTitle: "До выезда в Китай",
    collection: "Координационный депозит $200 вносится до выезда в Китай. До оплаты уточните, какие услуги включены в вашу запись.",
    refundTitle: "Возврат в день операции",
    refund: "Координационный депозит $200 возвращается в день вашей операции.",
    cancellationTitle: "Отмена, перенос или невозможность операции",
    cancellation: "При отмене депозит можно сохранить на один год. Заранее получите письменные условия для переноса даты, невозможности операции и окончания годового срока хранения депозита.",
    medicalTitle: "Оплачивайте клинике напрямую",
    medical: "Консультации, обследования, операция, анестезия и другие медицинские услуги оплачиваются непосредственно лечащей клинике или больнице. CeladonChina не принимает медицинские платежи.",
    separateCosts: "Перелёт, виза, проживание после двух включённых ночей, необязательные поездки и личные расходы оплачиваются отдельно, если письменный план прямо не включает их.",
    confirm: "Уточнить условия оплаты",
  },
  es: {
    heading: "Planificación, apoyo y pagos",
    scope: "CeladonChina coordina visitas de medicina estética únicamente en China.",
    initialTitle: "Primera conversación gratuita",
    initialText: "Empieza con tus preguntas, sin coste y sin compromiso.",
    freeTitle: "Lo que cubrimos",
    freeText: "La recogida y el traslado de vuelta, dos noches de hotel, la traducción en clínica, la organización de documentos y el apoyo de coordinación 24/7 se incluyen en los viajes elegibles. Tu plan escrito confirma fechas, visitas y servicios.",
    depositTitle: "Depósito de coordinación de 200 USD",
    depositSummary: "Se cobra antes de viajar a China. Se devuelve el día de la cirugía. Si cancelas, puede mantenerse durante un año. Las condiciones para otras circunstancias se confirman por escrito.",
    depositPurpose: "El depósito reserva tu cita para el procedimiento y el apoyo acordado. Es independiente de los gastos médicos.",
    collectionTitle: "Antes de viajar a China",
    collection: "El depósito de coordinación de 200 USD se cobra antes de tu salida hacia China. Confirma qué apoyo incluye tu reserva antes de pagar.",
    refundTitle: "Reembolso el día de la cirugía",
    refund: "Tu depósito de coordinación de 200 USD se devuelve el día de tu cirugía.",
    cancellationTitle: "Cancelación, cambio de fecha o cirugía no realizada",
    cancellation: "Si cancelas, tu depósito puede mantenerse durante un año. Confirma por escrito las condiciones para cambios de fecha, la imposibilidad de operarte y el final de ese año.",
    medicalTitle: "Paga directamente a la clínica",
    medical: "Paga las consultas, pruebas, cirugía, anestesia y demás gastos médicos directamente a la clínica u hospital que te atienda. CeladonChina no cobra pagos médicos.",
    separateCosts: "Los vuelos, visados, las noches de hotel posteriores a las dos incluidas, excursiones opcionales y gastos personales se pagan aparte, salvo que el plan escrito los incluya expresamente.",
    confirm: "Confirmar condiciones de pago",
  },
  th: {
    heading: "การวางแผน บริการประสานงาน และการชำระเงิน",
    scope: "CeladonChina ประสานงานการเข้ารับบริการด้านความงามในประเทศจีนเท่านั้น",
    initialTitle: "พูดคุยเบื้องต้นฟรี",
    initialText: "เริ่มต้นด้วยคำถามของคุณ โดยไม่มีค่าใช้จ่ายและไม่มีข้อผูกมัด",
    freeTitle: "บริการที่เราดูแลให้",
    freeText: "รวมบริการรับส่งสนามบิน 2 คืนโรงแรม ล่ามในคลินิก การจัดเอกสาร และการประสานงานตลอด 24 ชั่วโมงสำหรับทริปที่เข้าเกณฑ์ รายละเอียดวันและบริการยืนยันในแผนเป็นลายลักษณ์อักษร",
    depositTitle: "เงินมัดจำประสานงาน 200 ดอลลาร์สหรัฐ",
    depositSummary: "เรียกเก็บก่อนออกเดินทางไปจีน คืนให้ในวันผ่าตัด หากยกเลิก สามารถเก็บเงินมัดจำไว้ได้หนึ่งปี เงื่อนไขสำหรับกรณีอื่นจะยืนยันเป็นลายลักษณ์อักษร",
    depositPurpose: "เงินมัดจำใช้สำรองนัดหมายและบริการประสานงานที่ตกลงไว้ โดยแยกจากค่ารักษาพยาบาล",
    collectionTitle: "ก่อนออกเดินทางไปจีน",
    collection: "เงินมัดจำประสานงาน 200 ดอลลาร์สหรัฐจะเรียกเก็บก่อนที่คุณจะออกเดินทางไปจีน โปรดยืนยันบริการที่รวมอยู่ในการจองก่อนชำระเงิน",
    refundTitle: "คืนเงินในวันผ่าตัด",
    refund: "เงินมัดจำประสานงาน 200 ดอลลาร์สหรัฐจะคืนให้ในวันผ่าตัดของคุณ",
    cancellationTitle: "การยกเลิก เลื่อนนัด หรือไม่สามารถผ่าตัดได้",
    cancellation: "หากยกเลิก สามารถเก็บเงินมัดจำไว้ได้หนึ่งปี โปรดยืนยันเงื่อนไขเป็นลายลักษณ์อักษรล่วงหน้าสำหรับการเลื่อนวัน การไม่สามารถผ่าตัดได้ และการจัดการเงินมัดจำเมื่อครบหนึ่งปี",
    medicalTitle: "ชำระค่ารักษาให้คลินิกโดยตรง",
    medical: "ชำระค่าปรึกษา ตรวจ ผ่าตัด วิสัญญี และค่ารักษาอื่น ๆ ให้คลินิกหรือโรงพยาบาลที่รักษาโดยตรง CeladonChina ไม่รับชำระค่ารักษาพยาบาล",
    separateCosts: "ค่าตั๋วเครื่องบิน วีซ่า ค่าที่พักหลังจาก 2 คืนที่รวมไว้ การท่องเที่ยวเพิ่มเติม และค่าใช้จ่ายส่วนตัวชำระแยกต่างหาก เว้นแต่ระบุว่ารวมอยู่ในแผนบริการเป็นลายลักษณ์อักษร",
    confirm: "ยืนยันเงื่อนไขการชำระเงิน",
  },
  ms: {
    heading: "Perancangan, sokongan dan bayaran",
    scope: "CeladonChina menyelaras lawatan rawatan estetik di China sahaja.",
    initialTitle: "Perbualan awal percuma",
    initialText: "Mulakan dengan soalan anda, tanpa kos dan tanpa kewajipan.",
    freeTitle: "Yang kami tanggung",
    freeText: "Pemindahan lapangan terbang, dua malam hotel, terjemahan di klinik, penyusunan rekod dan sokongan penyelarasan 24/7 disertakan untuk perjalanan yang layak. Pelan bertulis mengesahkan tarikh, lawatan dan perkhidmatan.",
    depositTitle: "Deposit penyelarasan USD200",
    depositSummary: "Dikutip sebelum berlepas ke China. Dipulangkan pada hari pembedahan. Jika anda membatalkan, deposit boleh disimpan selama satu tahun. Syarat bagi keadaan lain disahkan secara bertulis.",
    depositPurpose: "Deposit menempah janji temu prosedur dan sokongan yang dipersetujui. Ia berasingan daripada yuran perubatan.",
    collectionTitle: "Sebelum berlepas ke China",
    collection: "Deposit penyelarasan USD200 dikutip sebelum anda berlepas ke China. Sahkan sokongan yang termasuk dalam tempahan sebelum membayar.",
    refundTitle: "Dipulangkan pada hari pembedahan",
    refund: "Deposit penyelarasan USD200 anda dipulangkan pada hari pembedahan anda.",
    cancellationTitle: "Pembatalan, perubahan tarikh atau tiada pembedahan",
    cancellation: "Jika anda membatalkan, deposit boleh disimpan selama satu tahun. Sahkan syarat bertulis terlebih dahulu untuk perubahan tarikh, keadaan yang menghalang pembedahan dan pengurusan deposit selepas tempoh satu tahun itu.",
    medicalTitle: "Bayar terus kepada klinik",
    medical: "Bayar semua yuran konsultasi, pemeriksaan, pembedahan, anestesia dan perubatan lain terus kepada klinik atau hospital yang merawat. CeladonChina tidak menerima bayaran perubatan.",
    separateCosts: "Penerbangan, visa, penginapan selepas dua malam hotel yang termasuk, lawatan pilihan dan perbelanjaan peribadi dibayar berasingan kecuali dinyatakan termasuk dalam pelan bertulis.",
    confirm: "Sahkan syarat pembayaran",
  },
});

export const getCoordinationPolicy = (lang: AsiaLang) => COORDINATION_POLICY[lang];

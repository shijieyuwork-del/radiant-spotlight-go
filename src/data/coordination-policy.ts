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
    scope: "Sino Aesthetics coordinates cosmetic-care visits in China only.",
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
    medical: "Pay all consultation, examination, surgery, anesthesia and other medical fees directly to the treating clinic or hospital. Sino Aesthetics does not collect medical payments.",
    separateCosts: "Flights, visas, hotel nights after the two included nights, optional outings and personal expenses are paid separately unless your written plan expressly includes them.",
    confirm: "Confirm payment terms",
  },
  zh: {
    heading: "行程规划、协调支持与付款",
    scope: "Sino Aesthetics 仅协调中国境内的医美就诊与行程。",
    initialTitle: "免费初步沟通",
    initialText: "先从提问开始，免费且无须承担预约义务。",
    freeTitle: "免费协调支持",
    freeText: "符合条件的行程可包含机场接送、两晚酒店、院内翻译、病历整理和 24 小时协调支持。具体日期、就诊次数与服务内容以书面服务方案为准。",
    depositTitle: "200 美元协调押金",
    depositSummary: "出发赴华前收取，手术当天退还。如取消，押金可保留一年。其他情况以书面确认的条款为准。",
    depositPurpose: "押金用于保留手术预约及约定的协调支持，与医疗费用分开。",
    collectionTitle: "出发前收取",
    collection: "200 美元协调押金在赴中国前收取。付款前，请确认本次预约包含的支持服务。",
    refundTitle: "手术当天退还",
    refund: "200 美元协调押金在你的手术当天退还。",
    cancellationTitle: "取消、改期或无法手术",
    cancellation: "如取消，押金可保留一年。改期、无法手术或保留期届满时如何处理，请事先取得书面说明。",
    medicalTitle: "医疗费用直接支付给院方",
    medical: "面诊、检查、手术、麻醉及其他医疗费用均直接支付给接诊的诊所或医院。Sino Aesthetics 不代收医疗费用。",
    separateCosts: "机票、签证、已包含的两晚酒店住宿之外的住宿、自选出游及个人开支另行支付，除非书面服务方案明确包含。",
    confirm: "确认付款条款",
  },
  ru: {
    heading: "Планирование, поддержка и оплата",
    scope: "Sino Aesthetics координирует поездки для эстетической медицины только в Китай.",
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
    medical: "Консультации, обследования, операция, анестезия и другие медицинские услуги оплачиваются непосредственно лечащей клинике или больнице. Sino Aesthetics не принимает медицинские платежи.",
    separateCosts: "Перелёт, виза, проживание после двух включённых ночей, необязательные поездки и личные расходы оплачиваются отдельно, если письменный план прямо не включает их.",
    confirm: "Уточнить условия оплаты",
  },
  es: {
    heading: "Planificación, apoyo y pagos",
    scope: "Sino Aesthetics coordina visitas de medicina estética únicamente en China.",
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
    medical: "Paga las consultas, pruebas, cirugía, anestesia y demás gastos médicos directamente a la clínica u hospital que te atienda. Sino Aesthetics no cobra pagos médicos.",
    separateCosts: "Los vuelos, visados, las noches de hotel posteriores a las dos incluidas, excursiones opcionales y gastos personales se pagan aparte, salvo que el plan escrito los incluya expresamente.",
    confirm: "Confirmar condiciones de pago",
  },
  th: {
    heading: "การวางแผน บริการประสานงาน และการชำระเงิน",
    scope: "Sino Aesthetics ประสานงานการเข้ารับบริการด้านความงามในประเทศจีนเท่านั้น",
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
    medical: "ชำระค่าปรึกษา ตรวจ ผ่าตัด วิสัญญี และค่ารักษาอื่น ๆ ให้คลินิกหรือโรงพยาบาลที่รักษาโดยตรง Sino Aesthetics ไม่รับชำระค่ารักษาพยาบาล",
    separateCosts: "ค่าตั๋วเครื่องบิน วีซ่า ค่าที่พักหลังจาก 2 คืนที่รวมไว้ การท่องเที่ยวเพิ่มเติม และค่าใช้จ่ายส่วนตัวชำระแยกต่างหาก เว้นแต่ระบุว่ารวมอยู่ในแผนบริการเป็นลายลักษณ์อักษร",
    confirm: "ยืนยันเงื่อนไขการชำระเงิน",
  },
  ms: {
    heading: "Perancangan, sokongan dan bayaran",
    scope: "Sino Aesthetics menyelaras lawatan rawatan estetik di China sahaja.",
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
    medical: "Bayar semua yuran konsultasi, pemeriksaan, pembedahan, anestesia dan perubatan lain terus kepada klinik atau hospital yang merawat. Sino Aesthetics tidak menerima bayaran perubatan.",
    separateCosts: "Penerbangan, visa, penginapan selepas dua malam hotel yang termasuk, lawatan pilihan dan perbelanjaan peribadi dibayar berasingan kecuali dinyatakan termasuk dalam pelan bertulis.",
    confirm: "Sahkan syarat pembayaran",
  },
  vi: {
    heading: "Lên kế hoạch, hỗ trợ và thanh toán",
    scope: "Sino Aesthetics chỉ điều phối các chuyến chăm sóc thẩm mỹ tại Trung Quốc.",
    initialTitle: "Trao đổi ban đầu miễn phí",
    initialText: "Bắt đầu bằng những câu hỏi của bạn, không mất phí và không ràng buộc.",
    freeTitle: "Những gì chúng tôi lo cho bạn",
    freeText: "Đưa đón sân bay, hai đêm khách sạn, phiên dịch tại phòng khám, sắp xếp hồ sơ và hỗ trợ điều phối 24/7 được bao gồm cho các hành trình đủ điều kiện. Kế hoạch hỗ trợ bằng văn bản của bạn xác nhận ngày, các lần khám và dịch vụ.",
    depositTitle: "Tiền cọc điều phối 200 USD",
    depositSummary: "Thu trước khi khởi hành đi Trung Quốc. Hoàn lại vào ngày phẫu thuật. Nếu bạn hủy, khoản cọc có thể được giữ trong một năm. Các trường hợp khác được xác nhận bằng văn bản.",
    depositPurpose: "Khoản cọc dùng để giữ lịch hẹn thực hiện quy trình và hỗ trợ điều phối đã thỏa thuận. Khoản này tách biệt với chi phí y tế của bạn.",
    collectionTitle: "Trước khi khởi hành đi Trung Quốc",
    collection: "Tiền cọc điều phối 200 USD được thu trước khi bạn khởi hành đi Trung Quốc. Hãy xác nhận các hỗ trợ được bao gồm trong đặt chỗ của bạn trước khi thanh toán.",
    refundTitle: "Hoàn lại vào ngày phẫu thuật",
    refund: "Tiền cọc điều phối 200 USD của bạn được hoàn lại vào ngày phẫu thuật.",
    cancellationTitle: "Hủy, đổi lịch hoặc không phẫu thuật",
    cancellation: "Nếu bạn hủy, khoản cọc có thể được giữ trong một năm. Hãy xác nhận bằng văn bản các điều khoản về đổi lịch, không thể phẫu thuật, hoặc khi hết thời hạn giữ một năm.",
    medicalTitle: "Thanh toán trực tiếp cho phòng khám",
    medical: "Thanh toán mọi chi phí tư vấn, thăm khám, phẫu thuật, gây mê và chi phí y tế khác trực tiếp cho phòng khám hoặc bệnh viện điều trị. Sino Aesthetics không thu các khoản thanh toán y tế.",
    separateCosts: "Vé máy bay, visa, các đêm khách sạn sau hai đêm đã bao gồm, các chuyến tham quan tùy chọn và chi phí cá nhân được thanh toán riêng, trừ khi kế hoạch bằng văn bản của bạn ghi rõ là bao gồm.",
    confirm: "Xác nhận điều khoản thanh toán",
  },
  ko: {
    heading: "일정 준비, 지원 및 결제",
    scope: "Sino Aesthetics는 중국 내 미용의료 방문만 조율합니다.",
    initialTitle: "무료 사전 상담",
    initialText: "비용이나 예약 의무 없이 궁금한 점부터 상담하세요.",
    freeTitle: "포함되는 지원",
    freeText: "조건에 맞는 일정에는 공항 왕복 이동, 호텔 2박, 병원 내 통역, 진료 기록 정리, 24시간 일정 지원이 포함됩니다. 날짜, 방문 횟수, 서비스 범위는 서면 지원 계획으로 확정됩니다.",
    depositTitle: "미화 200달러 일정 조정 보증금",
    depositSummary: "중국 출발 전에 납부하며 수술 당일 반환됩니다. 취소 시 보증금은 1년간 보관할 수 있습니다. 그 밖의 상황은 서면으로 확인합니다.",
    depositPurpose: "보증금은 시술 일정과 합의된 지원을 확보하기 위한 금액이며 진료비와 별도입니다.",
    collectionTitle: "중국 출발 전 납부",
    collection: "미화 200달러 일정 조정 보증금은 중국 출발 전에 납부합니다. 결제 전 예약에 포함된 지원 범위를 확인하세요.",
    refundTitle: "수술 당일 반환",
    refund: "미화 200달러 일정 조정 보증금은 수술 당일 반환됩니다.",
    cancellationTitle: "취소, 일정 변경 또는 수술 불가",
    cancellation: "취소 시 보증금은 1년간 보관할 수 있습니다. 일정 변경, 수술 불가, 1년 보관 기간 종료 시 처리 방식은 사전에 서면으로 확인하세요.",
    medicalTitle: "진료비는 의료기관에 직접 결제",
    medical: "상담, 검사, 수술, 마취 및 기타 진료비는 진료를 제공하는 병원이나 클리닉에 직접 결제합니다. Sino Aesthetics는 진료비를 대신 받지 않습니다.",
    separateCosts: "항공권, 비자, 포함된 2박 이후의 숙박, 선택 관광, 개인 비용은 서면 계획에 포함된 경우를 제외하고 별도로 결제합니다.",
    confirm: "결제 조건 확인",
  },
  ja: {
    heading: "渡航準備、サポート、お支払い",
    scope: "Sino Aestheticsがコーディネートするのは、中国国内での美容医療渡航のみです。",
    initialTitle: "無料の事前相談",
    initialText: "費用も予約義務もなく、気になることから相談できます。",
    freeTitle: "サポートに含まれる内容",
    freeText: "対象となる渡航には、空港送迎、ホテル2泊、院内通訳、診療記録の整理、24時間のコーディネーションサポートが含まれます。日程、受診回数、サービス範囲は書面のサポートプランで確定します。",
    depositTitle: "200米ドルのコーディネーション・デポジット",
    depositSummary: "中国への出発前にお預かりし、手術当日に返金します。キャンセル時は1年間保留できます。その他の状況は書面で確認します。",
    depositPurpose: "デポジットは施術予約と合意済みのサポート枠を確保するためのもので、医療費とは別です。",
    collectionTitle: "中国への出発前にお支払い",
    collection: "200米ドルのデポジットは中国への出発前にお支払いいただきます。支払い前に、予約に含まれるサポート内容をご確認ください。",
    refundTitle: "手術当日に返金",
    refund: "200米ドルのデポジットは手術当日に返金します。",
    cancellationTitle: "キャンセル、日程変更、手術を受けられない場合",
    cancellation: "キャンセル時はデポジットを1年間保留できます。日程変更、手術を受けられない場合、1年間の保留期間終了時の取り扱いは、事前に書面でご確認ください。",
    medicalTitle: "医療費は医療機関へ直接お支払い",
    medical: "診察、検査、手術、麻酔、その他の医療費は、診療を行う病院またはクリニックへ直接お支払いください。Sino Aestheticsが医療費を受け取ることはありません。",
    separateCosts: "航空券、ビザ、含まれる2泊以降の宿泊、任意の観光、個人費用は、書面のプランに含まれる場合を除き別途お支払いとなります。",
    confirm: "支払い条件を確認",
  },
  ar: {
    heading: "التخطيط والدعم والدفع", scope: "تنسق Sino Aesthetics زيارات التجميل داخل الصين فقط.", initialTitle: "محادثة أولية مجانية", initialText: "ابدأ بأسئلتك من دون تكلفة أو التزام.", freeTitle: "الدعم المشمول", freeText: "تشمل الرحلات المؤهلة الاستقبال والتوصيل من المطار، وليلتين في الفندق، والترجمة داخل المؤسسة، وتنظيم السجلات، ودعم التنسيق على مدار الساعة. تُؤكد المواعيد والزيارات والخدمات كتابياً.", depositTitle: "وديعة تنسيق بقيمة 200 دولار", depositSummary: "تُحصّل قبل السفر إلى الصين وتُعاد يوم الجراحة. عند الإلغاء، يمكن الاحتفاظ بها لمدة سنة. تُؤكد الحالات الأخرى كتابياً.", depositPurpose: "تحجز الوديعة موعد الإجراء والدعم المتفق عليه، وهي منفصلة عن الرسوم الطبية.", collectionTitle: "قبل السفر إلى الصين", collection: "تُحصّل وديعة التنسيق البالغة 200 دولار قبل السفر إلى الصين. تأكد من الدعم المشمول قبل الدفع.", refundTitle: "تُعاد يوم الجراحة", refund: "تُعاد وديعة التنسيق البالغة 200 دولار يوم الجراحة.", cancellationTitle: "الإلغاء أو تغيير الموعد أو تعذر الجراحة", cancellation: "عند الإلغاء، يمكن الاحتفاظ بالوديعة لمدة سنة. احصل على شروط مكتوبة لتغيير الموعد أو تعذر الجراحة أو انتهاء مدة السنة.", medicalTitle: "ادفع للمؤسسة مباشرة", medical: "ادفع رسوم الاستشارة والفحوصات والجراحة والتخدير وغيرها مباشرة للمستشفى أو العيادة. لا تتلقى Sino Aesthetics المدفوعات الطبية.", separateCosts: "تُدفع تذاكر الطيران والتأشيرة والإقامة بعد الليلتين المشمولتين والمصروفات الشخصية بشكل منفصل، ما لم يشملها الاتفاق المكتوب.", confirm: "تأكيد شروط الدفع",
  },
  "pt-BR": {
    heading: "Planejamento, apoio e pagamentos", scope: "A Sino Aesthetics coordena viagens de cuidados estéticos somente na China.", initialTitle: "Conversa inicial gratuita", initialText: "Comece com suas perguntas, sem custo e sem compromisso.", freeTitle: "Apoio incluído", freeText: "Para viagens elegíveis, estão incluídos traslado de ida e volta ao aeroporto, duas noites de hotel, interpretação na instituição, organização de documentos e apoio de coordenação 24 horas. Datas, visitas e serviços são confirmados por escrito.", depositTitle: "Depósito de coordenação de US$ 200", depositSummary: "Cobrado antes da viagem à China e devolvido no dia da cirurgia. Em caso de cancelamento, pode ficar retido por um ano. Outras situações são confirmadas por escrito.", depositPurpose: "O depósito reserva o procedimento e o apoio combinado. Ele é separado das despesas médicas.", collectionTitle: "Antes da viagem à China", collection: "O depósito de US$ 200 é cobrado antes da viagem. Confirme o apoio incluído antes de pagar.", refundTitle: "Devolvido no dia da cirurgia", refund: "O depósito de US$ 200 é devolvido no dia da cirurgia.", cancellationTitle: "Cancelamento, remarcação ou cirurgia não realizada", cancellation: "Em caso de cancelamento, o depósito pode ficar retido por um ano. Confirme por escrito as condições de remarcação, impossibilidade de cirurgia e fim desse período.", medicalTitle: "Pague diretamente à instituição", medical: "Pague consultas, exames, cirurgia, anestesia e outras despesas médicas diretamente à clínica ou hospital. A Sino Aesthetics não recebe pagamentos médicos.", separateCosts: "Passagens, visto, hospedagem após as duas noites incluídas e despesas pessoais são pagos separadamente, salvo inclusão expressa no plano escrito.", confirm: "Confirmar condições de pagamento",
  },
  id: {
    heading: "Perencanaan, dukungan, dan pembayaran", scope: "Sino Aesthetics hanya mengoordinasikan perjalanan perawatan estetika di Tiongkok.", initialTitle: "Percakapan awal gratis", initialText: "Mulai dengan pertanyaan Anda, tanpa biaya dan tanpa kewajiban.", freeTitle: "Dukungan yang termasuk", freeText: "Untuk perjalanan yang memenuhi syarat, layanan mencakup antar-jemput bandara, dua malam hotel, penerjemahan di fasilitas, penataan rekam medis, dan dukungan koordinasi 24 jam. Tanggal, kunjungan, dan layanan dikonfirmasi secara tertulis.", depositTitle: "Deposit koordinasi US$200", depositSummary: "Dibayarkan sebelum berangkat ke Tiongkok dan dikembalikan pada hari operasi. Jika membatalkan, deposit dapat disimpan selama satu tahun. Kondisi lain dikonfirmasi secara tertulis.", depositPurpose: "Deposit mengamankan jadwal prosedur dan dukungan yang disepakati. Deposit terpisah dari biaya medis.", collectionTitle: "Sebelum berangkat ke Tiongkok", collection: "Deposit US$200 dibayarkan sebelum keberangkatan. Pastikan dukungan yang termasuk sebelum membayar.", refundTitle: "Dikembalikan pada hari operasi", refund: "Deposit US$200 dikembalikan pada hari operasi.", cancellationTitle: "Pembatalan, penjadwalan ulang, atau tidak dapat menjalani operasi", cancellation: "Jika membatalkan, deposit dapat disimpan selama satu tahun. Konfirmasikan secara tertulis ketentuan penjadwalan ulang, kondisi tidak dapat operasi, dan akhir masa satu tahun.", medicalTitle: "Bayar langsung ke fasilitas", medical: "Bayar konsultasi, pemeriksaan, operasi, anestesi, dan biaya medis lain langsung ke klinik atau rumah sakit. Sino Aesthetics tidak menerima pembayaran medis.", separateCosts: "Tiket pesawat, visa, hotel setelah dua malam yang termasuk, dan pengeluaran pribadi dibayar terpisah kecuali dinyatakan dalam rencana tertulis.", confirm: "Konfirmasi ketentuan pembayaran",
  },
  fr: {
    heading: "Planification, accompagnement et paiements", scope: "Sino Aesthetics coordonne uniquement les séjours de soins esthétiques en Chine.", initialTitle: "Premier échange gratuit", initialText: "Commencez par vos questions, sans frais ni engagement.", freeTitle: "Accompagnement inclus", freeText: "Pour les séjours éligibles, sont inclus les transferts aéroport, deux nuits d’hôtel, l’interprétation dans l’établissement, l’organisation des dossiers et une coordination 24 h/24. Les dates, visites et services sont confirmés par écrit.", depositTitle: "Dépôt de coordination de 200 USD", depositSummary: "Perçu avant le départ pour la Chine et restitué le jour de l’intervention. En cas d’annulation, il peut être conservé pendant un an. Les autres situations sont confirmées par écrit.", depositPurpose: "Le dépôt réserve l’intervention et l’accompagnement convenu. Il est distinct des frais médicaux.", collectionTitle: "Avant le départ pour la Chine", collection: "Le dépôt de 200 USD est perçu avant votre départ. Confirmez l’accompagnement inclus avant de payer.", refundTitle: "Restitué le jour de l’intervention", refund: "Le dépôt de 200 USD est restitué le jour de l’intervention.", cancellationTitle: "Annulation, report ou intervention impossible", cancellation: "En cas d’annulation, le dépôt peut être conservé pendant un an. Confirmez par écrit les conditions de report, d’impossibilité d’intervention et de fin de cette période.", medicalTitle: "Payez directement l’établissement", medical: "Réglez les consultations, examens, intervention, anesthésie et autres frais médicaux directement à la clinique ou à l’hôpital. Sino Aesthetics n’encaisse aucun paiement médical.", separateCosts: "Les vols, visas, nuits après les deux nuits incluses et dépenses personnelles sont payés séparément, sauf mention expresse dans le plan écrit.", confirm: "Confirmer les conditions de paiement",
  },
  de: {
    heading: "Planung, Unterstützung und Zahlungen", scope: "Sino Aesthetics koordiniert ausschließlich Reisen für ästhetische Behandlungen in China.", initialTitle: "Kostenloses Erstgespräch", initialText: "Beginnen Sie mit Ihren Fragen, kostenlos und unverbindlich.", freeTitle: "Enthaltene Unterstützung", freeText: "Bei geeigneten Reisen sind Flughafentransfer, zwei Hotelnächte, Dolmetschen in der Einrichtung, Organisation der Unterlagen und Koordination rund um die Uhr enthalten. Termine, Besuche und Leistungen werden schriftlich bestätigt.", depositTitle: "Koordinationskaution von 200 USD", depositSummary: "Vor der Abreise nach China fällig und am Operationstag zurückgezahlt. Bei Stornierung kann sie ein Jahr lang hinterlegt bleiben. Andere Fälle werden schriftlich bestätigt.", depositPurpose: "Die Kaution reserviert den Eingriffstermin und die vereinbarte Unterstützung. Sie ist von den Medizinkosten getrennt.", collectionTitle: "Vor der Abreise nach China", collection: "Die Kaution von 200 USD wird vor der Abreise fällig. Bestätigen Sie vor der Zahlung die enthaltene Unterstützung.", refundTitle: "Rückzahlung am Operationstag", refund: "Die Kaution von 200 USD wird am Operationstag zurückgezahlt.", cancellationTitle: "Stornierung, Terminänderung oder keine Operation", cancellation: "Bei Stornierung kann die Kaution ein Jahr lang hinterlegt bleiben. Lassen Sie Regelungen für Terminänderungen, eine nicht mögliche Operation und das Ende der Jahresfrist schriftlich bestätigen.", medicalTitle: "Direkt an die Einrichtung zahlen", medical: "Zahlen Sie Beratung, Untersuchungen, Operation, Anästhesie und weitere Medizinkosten direkt an die Klinik oder das Krankenhaus. Sino Aesthetics nimmt keine medizinischen Zahlungen entgegen.", separateCosts: "Flüge, Visa, Hotelnächte nach den zwei enthaltenen Nächten und persönliche Ausgaben werden separat bezahlt, sofern sie nicht ausdrücklich im schriftlichen Plan enthalten sind.", confirm: "Zahlungsbedingungen bestätigen",
  },
});

export const getCoordinationPolicy = (lang: AsiaLang) => COORDINATION_POLICY[lang];

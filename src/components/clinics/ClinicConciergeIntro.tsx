import { ArrowRight, Building2, Headphones, Hotel, Languages, Plane, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useAsia, type AsiaLang } from "@/lib/asia-i18n";

type ConciergeCopy = {
  eyebrow: string;
  title: string;
  body: string;
  directPay: string;
  benefits: [string, string, string, string];
  note: string;
  terms: string;
  partnershipLink: string;
};

const COPY: Record<AsiaLang, ConciergeCopy> = {
  en: {
    eyebrow: "Why Sino Aesthetics",
    title: "One conversation. The right clinic. Support from start to finish.",
    body: "Compare hospitals and clinics with Sino Aesthetics. One team for appointments and support in China. Pay medical fees directly to your provider.",
    directPay: "We coordinate your care journey. You pay your chosen provider directly.",
    benefits: ["Airport pickup", "In-clinic interpretation", "Two hotel nights", "Dedicated concierge support"],
    note: "Included at no additional service fee for eligible confirmed journeys. Dates, visits and services are confirmed in writing before travel.",
    terms: "See $200 deposit terms",
    partnershipLink: "Why clinics work with Sino Aesthetics",
  },
  zh: {
    eyebrow: "为什么选择 Sino Aesthetics",
    title: "一次沟通，对接合适的医院，全程都有专人协助。",
    body: "告诉我们你正在考虑的项目。Sino Aesthetics 将协助你比较合适的医院和诊所，并协调机构对接、术前问诊、预约及赴华行程。整个过程由同一支专属团队跟进，所有医疗费用由你直接支付给最终选择的医疗机构。",
    directPay: "我们协调你的医疗行程，你直接向选定的医疗机构付款",
    benefits: ["免费机场接送", "免费院内翻译", "免费两晚酒店", "专属客服支持"],
    note: "符合条件并已确认的行程可免费包含以上服务。具体日期、就诊安排和服务内容将在出发前以书面形式确认。",
    terms: "查看 200 美元押金条款",
    partnershipLink: "为什么医院选择与 Sino Aesthetics 合作？",
  },
  ru: {
    eyebrow: "Почему Sino Aesthetics",
    title: "Один разговор. Подходящая клиника. Поддержка от начала до конца.",
    body: "Расскажите, что вы рассматриваете. Sino Aesthetics поможет сравнить подходящие больницы и клиники, организует знакомство, консультации и запись, а также поддержит вас во время поездки в Китай. Всё это ведёт одна выделенная команда. Медицинские услуги вы оплачиваете напрямую выбранному учреждению.",
    directPay: "Мы координируем ваш путь лечения. Вы платите выбранному учреждению напрямую.",
    benefits: ["Трансфер из аэропорта", "Перевод в клинике", "Две ночи в отеле", "Персональная поддержка"],
    note: "Для подходящих подтверждённых поездок эти услуги предоставляются без дополнительной платы. Состав услуг подтверждается письменно до поездки.",
    terms: "Условия депозита $200",
    partnershipLink: "Почему клиники работают с Sino Aesthetics",
  },
  es: {
    eyebrow: "Por qué Sino Aesthetics",
    title: "Una conversación. La clínica adecuada. Apoyo de principio a fin.",
    body: "Cuéntanos qué tratamiento estás considerando. Sino Aesthetics te ayuda a comparar hospitales y clínicas adecuados, coordina las presentaciones, las consultas y las citas, y te acompaña durante tu viaje a China con un único equipo dedicado. Todos los gastos médicos se pagan directamente al proveedor que elijas.",
    directPay: "Coordinamos tu atención. Tú pagas directamente al proveedor que elijas.",
    benefits: ["Recogida en el aeropuerto", "Interpretación en clínica", "Dos noches de hotel", "Apoyo personal de conserjería"],
    note: "Incluido sin coste de servicio adicional en viajes elegibles y confirmados. Las fechas, visitas y servicios se confirman por escrito antes del viaje.",
    terms: "Ver condiciones del depósito de 200 USD",
    partnershipLink: "Por qué las clínicas colaboran con Sino Aesthetics",
  },
  th: {
    eyebrow: "ทำไมต้อง Sino Aesthetics",
    title: "พูดคุยครั้งเดียว พบคลินิกที่เหมาะสม พร้อมดูแลตั้งแต่ต้นจนจบ",
    body: "บอกเราว่าคุณกำลังพิจารณาการรักษาแบบใด Sino Aesthetics ช่วยคุณเปรียบเทียบโรงพยาบาลและคลินิกที่เหมาะสม ประสานการแนะนำ การปรึกษา และการนัดหมาย พร้อมดูแลการเดินทางในจีนผ่านทีมเฉพาะทีมเดียว คุณชำระค่ารักษาพยาบาลทั้งหมดโดยตรงให้ผู้ให้บริการที่เลือก",
    directPay: "เราประสานเส้นทางการรักษา คุณชำระตรงให้ผู้ให้บริการที่เลือก",
    benefits: ["รับจากสนามบิน", "ล่ามในคลินิก", "โรงแรมสองคืน", "คอนเซียร์จส่วนตัว"],
    note: "รวมโดยไม่มีค่าบริการเพิ่มเติมสำหรับทริปที่เข้าเกณฑ์และยืนยันแล้ว รายละเอียดจะยืนยันเป็นลายลักษณ์อักษรก่อนเดินทาง",
    terms: "ดูเงื่อนไขเงินมัดจำ 200 ดอลลาร์",
    partnershipLink: "ทำไมคลินิกจึงร่วมงานกับ Sino Aesthetics",
  },
  ms: {
    eyebrow: "Mengapa Sino Aesthetics",
    title: "Satu perbualan. Klinik yang sesuai. Sokongan dari awal hingga akhir.",
    body: "Beritahu kami rawatan yang sedang anda pertimbangkan. Sino Aesthetics membantu anda membandingkan hospital dan klinik yang sesuai, menyelaras pengenalan, konsultasi dan janji temu, serta menyokong perjalanan anda di China melalui satu pasukan khusus. Semua yuran perubatan dibayar terus kepada penyedia pilihan anda.",
    directPay: "Kami menyelaras perjalanan rawatan anda. Anda membayar terus kepada penyedia pilihan anda.",
    benefits: ["Pengambilan di lapangan terbang", "Jurubahasa di klinik", "Dua malam hotel", "Sokongan concierge khusus"],
    note: "Disertakan tanpa caj perkhidmatan tambahan bagi perjalanan layak yang telah disahkan. Butiran disahkan secara bertulis sebelum perjalanan.",
    terms: "Lihat terma deposit USD200",
    partnershipLink: "Mengapa klinik bekerjasama dengan Sino Aesthetics",
  },
  vi: {
    eyebrow: "Vì sao chọn Sino Aesthetics",
    title: "Một cuộc trò chuyện. Cơ sở phù hợp. Hỗ trợ từ đầu đến cuối.",
    body: "Hãy cho chúng tôi biết phương án điều trị bạn đang cân nhắc. Sino Aesthetics giúp bạn so sánh các bệnh viện và phòng khám phù hợp, điều phối giới thiệu, tư vấn và lịch hẹn, đồng thời hỗ trợ hành trình của bạn tại Trung Quốc thông qua một đội ngũ chuyên trách. Bạn thanh toán toàn bộ chi phí y tế trực tiếp cho cơ sở đã chọn.",
    directPay: "Chúng tôi điều phối hành trình chăm sóc. Bạn thanh toán trực tiếp cho cơ sở đã chọn.",
    benefits: ["Đón tại sân bay", "Phiên dịch tại phòng khám", "Hai đêm khách sạn", "Hỗ trợ chuyên trách"],
    note: "Được bao gồm mà không tính thêm phí dịch vụ cho các hành trình đủ điều kiện đã xác nhận. Chi tiết được xác nhận bằng văn bản trước chuyến đi.",
    terms: "Xem điều khoản tiền cọc 200 USD",
    partnershipLink: "Vì sao các phòng khám hợp tác với Sino Aesthetics",
  },
  ko: {
    eyebrow: "Sino Aesthetics를 선택하는 이유",
    title: "한 번의 상담. 나에게 맞는 병원. 처음부터 끝까지 이어지는 지원.",
    body: "고려 중인 진료를 알려 주세요. Sino Aesthetics가 적합한 병원과 클리닉을 비교할 수 있도록 돕고, 기관 연결과 상담, 예약을 조율하며 전담팀 하나가 중국에서의 여정을 지원합니다. 모든 의료비는 선택한 의료기관에 직접 결제합니다.",
    directPay: "진료 여정은 저희가 조율하고, 의료비는 선택한 기관에 직접 결제합니다.",
    benefits: ["공항 픽업", "병원 통역", "호텔 2박", "전담 컨시어지 지원"],
    note: "조건을 충족하고 확정된 일정에는 추가 서비스 비용 없이 포함됩니다. 세부 내용은 출발 전 서면으로 확인합니다.",
    terms: "200달러 보증금 조건 보기",
    partnershipLink: "병원이 Sino Aesthetics와 협력하는 이유",
  },
  ja: {
    eyebrow: "Sino Aestheticsを選ぶ理由",
    title: "一度のご相談で、適した医療機関へ。最初から最後までサポートします。",
    body: "検討中の施術をお聞かせください。Sino Aestheticsが適した病院やクリニックの比較をお手伝いし、医療機関のご紹介、相談、予約を調整します。中国でのご滞在も一つの専任チームがサポートします。医療費はすべて、選択した医療機関へ直接お支払いいただきます。",
    directPay: "ケアの行程は私たちが調整し、医療費は選択した医療機関へ直接お支払いください。",
    benefits: ["空港送迎", "院内通訳", "ホテル2泊", "専任コンシェルジュサポート"],
    note: "条件を満たす確定済みの渡航には追加サービス料なしで含まれます。内容は渡航前に書面で確認します。",
    terms: "200ドルのデポジット条件を見る",
    partnershipLink: "医療機関がSino Aestheticsと提携する理由",
  },
};

const BENEFIT_ICONS = [Plane, Languages, Hotel, Headphones] as const;

export function ClinicConciergeIntro() {
  const { lang } = useAsia();
  const copy = COPY[lang];

  return (
    <section aria-labelledby="clinic-concierge-title" className="rounded-3xl border border-primary/20 bg-primary/[0.06] p-5 sm:p-7 lg:p-8">
      <div className="grid gap-7 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:gap-10">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
            <Building2 aria-hidden="true" className="size-4" />
            {copy.eyebrow}
          </p>
          <h2 id="clinic-concierge-title" className="mt-3 max-w-3xl font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-foreground/75 sm:text-base sm:leading-7">{copy.body}</p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-4 py-2 text-sm font-semibold text-foreground">
            <Wallet aria-hidden="true" className="size-4 shrink-0 text-primary" />
            {copy.directPay}
          </p>
          <Link to="/about#clinic-partnerships" className="group mt-4 flex w-fit min-h-11 items-center gap-2 rounded-full px-1 text-sm font-semibold text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            {copy.partnershipLink}
            <ArrowRight aria-hidden="true" className="size-4 shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
          </Link>
        </div>

        <div>
          <ul className="grid gap-3 sm:grid-cols-2" aria-label={copy.eyebrow}>
            {copy.benefits.map((benefit, index) => {
              const Icon = BENEFIT_ICONS[index];
              return (
                <li key={benefit} className="flex min-h-20 items-center gap-3 rounded-2xl border border-primary/15 bg-background/85 p-4 text-sm font-semibold leading-snug shadow-[0_10px_30px_-26px_hsl(var(--foreground))]">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                  {benefit}
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs leading-5 text-foreground/65">
            {copy.note}{" "}
            <Link to="/travel-packages#payment-terms" className="font-semibold text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
              {copy.terms}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

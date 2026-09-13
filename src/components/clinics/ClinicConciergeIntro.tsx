import { Building2, Headphones, Hotel, Languages, Plane, Wallet } from "lucide-react";
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
};

const COPY: Record<AsiaLang, ConciergeCopy> = {
  en: {
    eyebrow: "Why CeladonChina",
    title: "We connect you with the clinic. You keep one local team.",
    body: "Tell us what you need. CeladonChina coordinates clinic introductions, consultations, appointments and travel, so you do not have to navigate hospitals in China alone. Medical fees are always paid directly to the clinic.",
    directPay: "We coordinate. You pay the clinic directly.",
    benefits: ["Airport pickup", "In-clinic interpretation", "Two hotel nights", "Dedicated concierge support"],
    note: "Included at no additional service fee for eligible confirmed journeys. Dates, visits and services are confirmed in writing before travel.",
    terms: "See $200 deposit terms",
  },
  zh: {
    eyebrow: "为什么选择 CeladonChina",
    title: "我们帮你对接医院，全程只有一个本地团队。",
    body: "告诉我们你的需求，CeladonChina 会为你协调医院匹配、问诊、预约和赴华行程，让你不必独自联系和比较中国医院。所有医疗费用均由你直接支付给医院。",
    directPay: "我们负责协调，你直接向医院支付医疗费",
    benefits: ["免费机场接送", "免费院内翻译", "免费两晚酒店", "专属客服支持"],
    note: "符合条件并已确认的行程可免费包含以上服务。具体日期、就诊安排和服务内容将在出发前以书面形式确认。",
    terms: "查看 200 美元押金条款",
  },
  ru: {
    eyebrow: "Почему CeladonChina",
    title: "Мы связываем вас с клиникой и остаёмся вашей местной командой.",
    body: "Расскажите нам о своих потребностях. CeladonChina организует знакомство с клиникой, консультации, запись и поездку, чтобы вам не пришлось самостоятельно разбираться в больницах Китая. Медицинские услуги оплачиваются напрямую клинике.",
    directPay: "Мы координируем, вы платите клинике напрямую",
    benefits: ["Трансфер из аэропорта", "Перевод в клинике", "Две ночи в отеле", "Персональная поддержка"],
    note: "Для подходящих подтверждённых поездок эти услуги предоставляются без дополнительной платы. Состав услуг подтверждается письменно до поездки.",
    terms: "Условия депозита $200",
  },
  es: {
    eyebrow: "Por qué CeladonChina",
    title: "Te conectamos con la clínica y somos tu equipo local.",
    body: "Cuéntanos qué necesitas. CeladonChina coordina la presentación con la clínica, las consultas, las citas y el viaje, para que no tengas que gestionar hospitales en China por tu cuenta. Los gastos médicos se pagan siempre directamente a la clínica.",
    directPay: "Nosotros coordinamos; tú pagas directamente a la clínica",
    benefits: ["Recogida en el aeropuerto", "Interpretación en clínica", "Dos noches de hotel", "Apoyo personal de conserjería"],
    note: "Incluido sin coste de servicio adicional en viajes elegibles y confirmados. Las fechas, visitas y servicios se confirman por escrito antes del viaje.",
    terms: "Ver condiciones del depósito de 200 USD",
  },
  th: {
    eyebrow: "ทำไมต้อง CeladonChina",
    title: "เราเชื่อมคุณกับคลินิกและเป็นทีมท้องถิ่นของคุณ",
    body: "บอกเราว่าคุณต้องการอะไร CeladonChina จะประสานการแนะนำคลินิก การปรึกษา การนัดหมาย และการเดินทาง เพื่อให้คุณไม่ต้องติดต่อโรงพยาบาลในจีนด้วยตนเอง ค่ารักษาพยาบาลชำระตรงให้คลินิกเสมอ",
    directPay: "เราดูแลการประสานงาน คุณชำระตรงให้คลินิก",
    benefits: ["รับจากสนามบิน", "ล่ามในคลินิก", "โรงแรมสองคืน", "คอนเซียร์จส่วนตัว"],
    note: "รวมโดยไม่มีค่าบริการเพิ่มเติมสำหรับทริปที่เข้าเกณฑ์และยืนยันแล้ว รายละเอียดจะยืนยันเป็นลายลักษณ์อักษรก่อนเดินทาง",
    terms: "ดูเงื่อนไขเงินมัดจำ 200 ดอลลาร์",
  },
  ms: {
    eyebrow: "Mengapa CeladonChina",
    title: "Kami hubungkan anda dengan klinik dan menjadi pasukan tempatan anda.",
    body: "Beritahu kami keperluan anda. CeladonChina menyelaras pengenalan klinik, konsultasi, janji temu dan perjalanan supaya anda tidak perlu mengurus hospital di China sendirian. Yuran perubatan sentiasa dibayar terus kepada klinik.",
    directPay: "Kami menyelaras, anda membayar terus kepada klinik",
    benefits: ["Pengambilan di lapangan terbang", "Jurubahasa di klinik", "Dua malam hotel", "Sokongan concierge khusus"],
    note: "Disertakan tanpa caj perkhidmatan tambahan bagi perjalanan layak yang telah disahkan. Butiran disahkan secara bertulis sebelum perjalanan.",
    terms: "Lihat terma deposit USD200",
  },
  vi: {
    eyebrow: "Vì sao chọn CeladonChina",
    title: "Chúng tôi kết nối bạn với phòng khám và đồng hành tại địa phương.",
    body: "Hãy cho chúng tôi biết nhu cầu của bạn. CeladonChina điều phối việc giới thiệu phòng khám, tư vấn, lịch hẹn và hành trình để bạn không phải tự mình làm việc với các bệnh viện tại Trung Quốc. Chi phí y tế luôn được thanh toán trực tiếp cho phòng khám.",
    directPay: "Chúng tôi điều phối, bạn thanh toán trực tiếp cho phòng khám",
    benefits: ["Đón tại sân bay", "Phiên dịch tại phòng khám", "Hai đêm khách sạn", "Hỗ trợ chuyên trách"],
    note: "Được bao gồm mà không tính thêm phí dịch vụ cho các hành trình đủ điều kiện đã xác nhận. Chi tiết được xác nhận bằng văn bản trước chuyến đi.",
    terms: "Xem điều khoản tiền cọc 200 USD",
  },
  ko: {
    eyebrow: "CeladonChina를 선택하는 이유",
    title: "병원 연결부터 현지 지원까지 한 팀이 함께합니다.",
    body: "원하는 진료를 알려 주세요. CeladonChina가 병원 연결, 상담, 예약과 중국 여행을 조율해 드리므로 고객이 직접 여러 병원에 연락할 필요가 없습니다. 의료비는 항상 병원에 직접 결제합니다.",
    directPay: "저희가 조율하고, 의료비는 병원에 직접 결제합니다",
    benefits: ["공항 픽업", "병원 통역", "호텔 2박", "전담 컨시어지 지원"],
    note: "조건을 충족하고 확정된 일정에는 추가 서비스 비용 없이 포함됩니다. 세부 내용은 출발 전 서면으로 확인합니다.",
    terms: "200달러 보증금 조건 보기",
  },
  ja: {
    eyebrow: "CeladonChinaを選ぶ理由",
    title: "病院との橋渡しから現地サポートまで、ひとつのチームで。",
    body: "ご希望をお聞かせください。CeladonChinaが病院のご紹介、相談、予約、中国への渡航を調整するため、お客様がご自身で複数の病院に連絡する必要はありません。医療費は常に病院へ直接お支払いいただきます。",
    directPay: "私たちが調整し、医療費は病院へ直接お支払い",
    benefits: ["空港送迎", "院内通訳", "ホテル2泊", "専任コンシェルジュサポート"],
    note: "条件を満たす確定済みの渡航には追加サービス料なしで含まれます。内容は渡航前に書面で確認します。",
    terms: "200ドルのデポジット条件を見る",
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

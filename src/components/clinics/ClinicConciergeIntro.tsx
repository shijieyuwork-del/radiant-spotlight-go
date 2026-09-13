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
    title: "Contact the clinic directly. Keep local support.",
    body: "You still pay every medical fee directly to the clinic. CeladonChina works with partner clinics as an international-patient concierge, coordinating the practical parts of your journey around your care.",
    directPay: "Medical fees go directly to your clinic",
    benefits: ["Airport pickup", "In-clinic interpretation", "Two hotel nights", "Dedicated concierge support"],
    note: "Included at no additional service fee for eligible confirmed journeys. Dates, visits and services are confirmed in writing before travel.",
    terms: "See $200 deposit terms",
  },
  zh: {
    eyebrow: "为什么选择 CeladonChina",
    title: "直接支付医院，也能拥有本地支持。",
    body: "所有医疗费用仍由你直接支付给医院。CeladonChina 与合作医院协作，作为海外客户礼宾团队，帮助你安排治疗之外的沟通与行程。",
    directPay: "医疗费用直接支付给医院",
    benefits: ["免费机场接送", "免费院内翻译", "免费两晚酒店", "专属客服支持"],
    note: "符合条件并已确认的行程可免费包含以上服务。具体日期、就诊安排和服务内容将在出发前以书面形式确认。",
    terms: "查看 200 美元押金条款",
  },
  ru: {
    eyebrow: "Почему CeladonChina",
    title: "Платите клинике напрямую. Получайте поддержку на месте.",
    body: "Все медицинские услуги вы по-прежнему оплачиваете непосредственно клинике. CeladonChina работает с клиниками-партнёрами как консьерж для иностранных пациентов и координирует практические вопросы поездки.",
    directPay: "Медицинские услуги оплачиваются клинике напрямую",
    benefits: ["Трансфер из аэропорта", "Перевод в клинике", "Две ночи в отеле", "Персональная поддержка"],
    note: "Для подходящих подтверждённых поездок эти услуги предоставляются без дополнительной платы. Состав услуг подтверждается письменно до поездки.",
    terms: "Условия депозита $200",
  },
  es: {
    eyebrow: "Por qué CeladonChina",
    title: "Paga a la clínica directamente. Mantén el apoyo local.",
    body: "Sigues pagando todos los gastos médicos directamente a la clínica. CeladonChina colabora con clínicas asociadas como servicio de conserjería para pacientes internacionales y coordina los aspectos prácticos del viaje.",
    directPay: "Los gastos médicos se pagan directamente a la clínica",
    benefits: ["Recogida en el aeropuerto", "Interpretación en clínica", "Dos noches de hotel", "Apoyo personal de conserjería"],
    note: "Incluido sin coste de servicio adicional en viajes elegibles y confirmados. Las fechas, visitas y servicios se confirman por escrito antes del viaje.",
    terms: "Ver condiciones del depósito de 200 USD",
  },
  th: {
    eyebrow: "ทำไมต้อง CeladonChina",
    title: "ชำระให้คลินิกโดยตรง พร้อมรับการดูแลในพื้นที่",
    body: "คุณยังคงชำระค่ารักษาพยาบาลทั้งหมดให้คลินิกโดยตรง CeladonChina ทำงานร่วมกับคลินิกพันธมิตรในฐานะทีมคอนเซียร์จสำหรับผู้ป่วยต่างชาติ เพื่อประสานงานเรื่องการเดินทางและการสื่อสารรอบการรักษา",
    directPay: "ชำระค่ารักษาพยาบาลให้คลินิกโดยตรง",
    benefits: ["รับจากสนามบิน", "ล่ามในคลินิก", "โรงแรมสองคืน", "คอนเซียร์จส่วนตัว"],
    note: "รวมโดยไม่มีค่าบริการเพิ่มเติมสำหรับทริปที่เข้าเกณฑ์และยืนยันแล้ว รายละเอียดจะยืนยันเป็นลายลักษณ์อักษรก่อนเดินทาง",
    terms: "ดูเงื่อนไขเงินมัดจำ 200 ดอลลาร์",
  },
  ms: {
    eyebrow: "Mengapa CeladonChina",
    title: "Bayar klinik secara terus. Kekalkan sokongan tempatan.",
    body: "Anda tetap membayar semua yuran perubatan terus kepada klinik. CeladonChina bekerjasama dengan klinik rakan kongsi sebagai khidmat concierge pesakit antarabangsa untuk menyelaras urusan praktikal perjalanan anda.",
    directPay: "Yuran perubatan dibayar terus kepada klinik",
    benefits: ["Pengambilan di lapangan terbang", "Jurubahasa di klinik", "Dua malam hotel", "Sokongan concierge khusus"],
    note: "Disertakan tanpa caj perkhidmatan tambahan bagi perjalanan layak yang telah disahkan. Butiran disahkan secara bertulis sebelum perjalanan.",
    terms: "Lihat terma deposit USD200",
  },
  vi: {
    eyebrow: "Vì sao chọn CeladonChina",
    title: "Thanh toán trực tiếp cho phòng khám. Vẫn có hỗ trợ tại chỗ.",
    body: "Bạn vẫn thanh toán mọi chi phí y tế trực tiếp cho phòng khám. CeladonChina hợp tác với các phòng khám đối tác với vai trò đội ngũ hỗ trợ khách hàng quốc tế, điều phối những phần thực tế trong hành trình của bạn.",
    directPay: "Chi phí y tế được thanh toán trực tiếp cho phòng khám",
    benefits: ["Đón tại sân bay", "Phiên dịch tại phòng khám", "Hai đêm khách sạn", "Hỗ trợ chuyên trách"],
    note: "Được bao gồm mà không tính thêm phí dịch vụ cho các hành trình đủ điều kiện đã xác nhận. Chi tiết được xác nhận bằng văn bản trước chuyến đi.",
    terms: "Xem điều khoản tiền cọc 200 USD",
  },
  ko: {
    eyebrow: "CeladonChina를 선택하는 이유",
    title: "병원에는 직접 결제하고, 현지 지원은 그대로 받으세요.",
    body: "모든 의료비는 병원에 직접 결제합니다. CeladonChina는 제휴 병원의 해외 환자 컨시어지 파트너로서 치료 전후의 이동과 의사소통을 조율합니다.",
    directPay: "의료비는 병원에 직접 결제",
    benefits: ["공항 픽업", "병원 통역", "호텔 2박", "전담 컨시어지 지원"],
    note: "조건을 충족하고 확정된 일정에는 추가 서비스 비용 없이 포함됩니다. 세부 내용은 출발 전 서면으로 확인합니다.",
    terms: "200달러 보증금 조건 보기",
  },
  ja: {
    eyebrow: "CeladonChinaを選ぶ理由",
    title: "医療費は病院へ直接払い、現地サポートも利用できます。",
    body: "すべての医療費は病院へ直接お支払いいただきます。CeladonChinaは提携病院の海外患者向けコンシェルジュとして、治療前後の移動やコミュニケーションを調整します。",
    directPay: "医療費は病院へ直接お支払い",
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

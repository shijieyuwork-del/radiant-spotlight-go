import { ArrowRight, ArrowUpRight, Check, Globe2, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { whatsappUrl, consultationHandoffUrl } from "@/lib/consultation-handoff";
import { useAsia } from "@/lib/asia-i18n";
import { SITE_URL, guideImageUrl } from "@/lib/seo-config";
import {
  GUIDE_UPDATED,
  INTERNATIONAL_GUIDES,
  INTERNATIONAL_HUB,
  VIETNAM_GUIDE,
  internationalMeta,
} from "@/data/internationalPatients";

const procedures = [
  { en: "Rhinoplasty", vi: "Nâng mũi", path: "/treatments/rhinoplasty" },
  { en: "Upper eyelid surgery", vi: "Phẫu thuật mí mắt trên", path: "/treatments/upper-blepharoplasty" },
  { en: "Facelift", vi: "Căng da mặt", path: "/treatments/facelift" },
  { en: "Hair transplant", vi: "Cấy tóc", path: "/treatments/fue-hair-transplant" },
];

const costRows = [
  [
    "Clinical care",
    "Consultation, tests, surgeon, anaesthesia, facility, medicines and follow-up",
    "Điều trị y khoa",
    "Tư vấn, xét nghiệm, bác sĩ phẫu thuật, gây mê, cơ sở y tế, thuốc và tái khám",
  ],
  [
    "Coordination and travel",
    "Interpretation, coordination fees, accommodation, transport and changes to travel",
    "Điều phối và đi lại",
    "Phiên dịch, phí điều phối, lưu trú, di chuyển và thay đổi lịch trình",
  ],
  [
    "Additional care",
    "Extra reviews, longer stays, complications, revision terms and exclusions",
    "Chăm sóc bổ sung",
    "Khám thêm, kéo dài lưu trú, biến chứng, điều kiện sửa lại và các khoản loại trừ",
  ],
];

export default function InternationalPatients() {
  const { pathname } = useLocation();
  const { setLang } = useAsia();
  const openEnglishResource = () => {
    if (vi) setLang("en");
  };
  const guide = INTERNATIONAL_GUIDES.find((g) => g.path === pathname.replace(/\/$/, ""));
  const vi = guide?.language === "vi";
  const copy = (en: string, vn: string) => (vi ? vn : en);
  const meta = internationalMeta(guide, SITE_URL);
  const guideImage = (() => {
    const parts = (guide?.path ?? INTERNATIONAL_HUB).split("/").filter(Boolean);
    return parts[0] === "international-patients" ? parts[parts.length - 1] : parts.join("-");
  })();
  const scope = copy(
    "Sino Aesthetics provides information and non-clinical consultation and travel coordination in China. Medical assessment, consent, treatment and clinical follow-up are provided by the receiving medical institution. Availability and service scope must be confirmed for your dates.",
    "Sino Aesthetics cung cấp thông tin và hỗ trợ điều phối tư vấn, đi lại tại Trung Quốc, không cung cấp dịch vụ điều trị. Cơ sở y tế tiếp nhận chịu trách nhiệm đánh giá y khoa, giải thích và lấy sự đồng ý điều trị, điều trị và theo dõi lâm sàng. Cần xác nhận tình trạng sẵn có và phạm vi dịch vụ theo ngày của bạn.",
  );
  const enquiry = copy(
    `Hi Sino Aesthetics, I live in ${guide?.country ?? "another country"} and would like information about planning cosmetic care in China. Please confirm available coordination services and fees.`,
    "Xin chào Sino Aesthetics, tôi sống ở Việt Nam và muốn tìm hiểu kế hoạch điều trị thẩm mỹ tại Trung Quốc. Vui lòng xác nhận dịch vụ điều phối có thể cung cấp và chi phí.",
  );

  return (
    <div className="min-h-screen bg-background" lang={meta.language}>
      <PageMeta
        title={meta.title}
        description={meta.description}
        path={meta.path}
        image={guideImageUrl(guideImage, "social")}
        type={guide ? "article" : "website"}
        language={meta.language}
        alternates={meta.alternates}
        structuredData={meta.schema}
        includeBreadcrumb={false}
      />
      <a href="#visitor-guide" className="sr-only focus:not-sr-only focus:block focus:p-4">
        {copy("Skip to guide", "Đến nội dung hướng dẫn")}
      </a>
      <header className="border-b border-border/60 bg-background">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-5">
          <Link to="/" aria-label={copy("Sino Aesthetics home", "Trang chủ Sino Aesthetics")}>
            <BrandLogo />
          </Link>
          <nav
            aria-label={copy("Visitor guide navigation", "Điều hướng hướng dẫn")}
            className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm"
          >
            <Link to={INTERNATIONAL_HUB} className="hover:underline">
              {copy("Visitor guides", "Hướng dẫn quốc tế (tiếng Anh)")}
            </Link>
            <a href="#planning" className="hover:underline">
              {copy("Planning checklist", "Danh sách chuẩn bị")}
            </a>
            <a href="#contact" className="font-semibold text-primary hover:underline">
              {copy("Ask a question", "Gửi câu hỏi")}
            </a>
          </nav>
        </div>
      </header>
      <main id="visitor-guide">
        <section className="border-b border-border/60 bg-gradient-hero/50">
          <div className="container max-w-6xl py-12 md:py-20">
            <div className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
              <Globe2 aria-hidden="true" className="size-4" />
              {copy("Your journey to China", "Hành trình đến Trung Quốc")}
            </div>
            <h1 className="max-w-4xl text-balance font-display text-4xl font-medium leading-tight tracking-tight md:text-6xl">
              {meta.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              {guide?.intro ??
                "A clearer plan starts with your questions. Explore practical guides for Australia, the United States, Canada and Vietnam, then connect the provider, cost and follow-up information before you book."}
            </p>
            <p className="mt-5 text-sm text-muted-foreground">
              {copy("Updated", "Cập nhật")} <time dateTime={GUIDE_UPDATED}>{GUIDE_UPDATED}</time> ·{" "}
              {copy("Sino Aesthetics Editorial Team", "Ban biên tập Sino Aesthetics")}
            </p>
            {meta.alternates.length > 0 && (
              <nav
                className="mt-6 flex gap-4 text-sm underline underline-offset-4"
                aria-label={copy("Guide language", "Ngôn ngữ hướng dẫn")}
              >
                <Link to={`${INTERNATIONAL_HUB}/vietnam`} lang="en" aria-current={!vi ? "page" : undefined}>
                  English
                </Link>
                <Link to={VIETNAM_GUIDE} lang="vi" aria-current={vi ? "page" : undefined}>
                  Tiếng Việt
                </Link>
              </nav>
            )}
          </div>
        </section>

        <div className="container grid max-w-6xl gap-10 py-10 md:py-16 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-14">
          <div className="min-w-0 space-y-12">
            <img
              src={guideImageUrl(guideImage)}
              alt={meta.title}
              width={1600}
              height={900}
              decoding="async"
              className="aspect-[16/9] w-full rounded-3xl object-cover"
            />
            <section className="rounded-3xl border border-border bg-card p-6 md:p-8" aria-labelledby="scope-title">
              <h2 id="scope-title" className="font-display text-2xl">
                {copy("How we can help", "Chúng tôi hỗ trợ như thế nào")}
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">{scope}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {copy(
                  "General planning information, not individual medical advice. This guide has not been individually reviewed by a clinician. Official sources are provided for context; they do not endorse Sino Aesthetics.",
                  "Thông tin lập kế hoạch chung, không phải tư vấn y khoa cá nhân. Hướng dẫn này chưa được bác sĩ thẩm định riêng. Nguồn chính thức được dẫn để tham khảo, không có nghĩa các cơ quan đó chứng thực Sino Aesthetics.",
                )}
              </p>
            </section>

            {!guide && (
              <section id="countries" aria-labelledby="countries-title">
                <h2 id="countries-title" className="font-display text-3xl">
                  Start with where you live
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {INTERNATIONAL_GUIDES.filter((g) => g.language === "en").map((g) => (
                    <Link
                      key={g.path}
                      to={g.country === "Vietnam" ? VIETNAM_GUIDE : g.path}
                      className="group rounded-3xl border border-border bg-card p-6 transition hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <h3 className="flex items-center justify-between gap-3 font-display text-2xl">
                        {g.country}
                        <ArrowRight className="size-5 shrink-0 text-primary" aria-hidden="true" />
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {g.country === "Vietnam"
                          ? "Hướng dẫn bằng tiếng Việt · Báo giá, phiên dịch và kế hoạch tái khám."
                          : g.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section id="planning" aria-labelledby="planning-title">
              <h2 id="planning-title" className="font-display text-3xl">
                {copy("Before you commit to travel", "Trước khi quyết định chuyến đi")}
              </h2>
              <ol className="mt-6 space-y-4">
                {(vi
                  ? [
                      "Xác minh bác sĩ và cơ sở y tế",
                      "Xác nhận ngôn ngữ và nội dung buổi tư vấn",
                      "Nhận báo giá chi tiết và điều kiện bằng văn bản",
                      "Thống nhất lịch tái khám, hồ sơ và kế hoạch về nước",
                    ]
                  : [
                      "Verify the clinician and the actual treatment facility",
                      "Confirm consultation language and interpretation arrangements",
                      "Obtain an itemised written quote and payment terms",
                      "Agree reviews, records and the plan for returning home",
                    ]
                ).map((s, i) => (
                  <li key={s} className="flex items-start gap-4 leading-7">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </section>

            {guide?.sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-2xl md:text-3xl">{section.title}</h2>
                <p className="mt-4 leading-8 text-muted-foreground">{section.body}</p>
                {section.source !== undefined && (
                  <a
                    className="mt-3 inline-flex items-center gap-1 text-sm text-primary underline underline-offset-4"
                    href={guide.sources[section.source].url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {guide.sources[section.source].label}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                )}
              </section>
            ))}

            <section id="costs" aria-labelledby="costs-title">
              <h2 id="costs-title" className="font-display text-3xl">
                {copy("Compare the full written quote", "So sánh báo giá đầy đủ bằng văn bản")}
              </h2>
              <p className="mt-4 leading-8 text-muted-foreground">
                {guide?.budget ??
                  "Keep the hospital's original quote and currency. Separate medical care, coordination and travel costs. Ask what changes after assessment, what is excluded and who is responsible for additional care. Local-currency conversions are planning references, not guaranteed hospital prices."}
              </p>
              <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">
                    {copy("Items to confirm in a written estimate", "Các khoản cần xác nhận trong báo giá")}
                  </caption>
                  <thead className="bg-muted/60">
                    <tr>
                      <th scope="col" className="p-4">
                        {copy("Cost category", "Nhóm chi phí")}
                      </th>
                      <th scope="col" className="p-4">
                        {copy("Ask what is included", "Hỏi rõ khoản đã bao gồm")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {costRows.map((row) => (
                      <tr key={row[0]} className="border-t border-border">
                        <th scope="row" className="p-4 align-top font-medium">
                          {vi ? row[2] : row[0]}
                        </th>
                        <td className="p-4 leading-6 text-muted-foreground">{vi ? row[3] : row[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {copy(
                  "Confirm the legal recipient for each payment. Obtain written terms for any coordination deposit or fee, including purpose, refund conditions and cancellation. Medical charges and non-clinical services should be clearly separated.",
                  "Xác nhận bên nhận tiền hợp pháp của từng khoản. Nhận điều kiện bằng văn bản cho khoản đặt cọc hoặc phí điều phối, gồm mục đích, điều kiện hoàn tiền và hủy dịch vụ. Tách rõ chi phí y tế và dịch vụ điều phối.",
                )}
              </p>
            </section>

            {guide && (
              <section aria-labelledby="faq-title">
                <h2 id="faq-title" className="font-display text-3xl">
                  {copy("Questions before booking", "Câu hỏi trước khi đặt lịch")}
                </h2>
                <div className="mt-5 divide-y divide-border">
                  {guide.faqs.map(([q, a]) => (
                    <details key={q} className="py-5">
                      <summary className="cursor-pointer pr-2 font-semibold leading-7">{q}</summary>
                      <p className="mt-3 leading-7 text-muted-foreground">{a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            <section id="procedures" aria-labelledby="procedures-title">
              <h2 id="procedures-title" className="font-display text-3xl">
                {copy("Explore procedure guides", "Tìm hiểu các nhóm thủ thuật")}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {copy(
                  "These are general categories, not a personal treatment recommendation. Discuss alternatives, limitations and risks with the treating clinician.",
                  "Đây là các nhóm thủ thuật chung, không phải khuyến nghị điều trị cá nhân. Thảo luận lựa chọn thay thế, giới hạn và rủi ro với bác sĩ. Các liên kết dưới đây mở tài liệu tiếng Anh; không có nghĩa đã có bản dịch đầy đủ.",
                )}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {procedures.map((p) => (
                  <Link
                    key={p.path}
                    to={p.path}
                    onClick={openEnglishResource}
                    className="flex items-center justify-between rounded-2xl border border-border p-4 hover:bg-accent"
                  >
                    {vi ? `${p.vi} (tiếng Anh)` : p.en}
                    <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </section>

            {guide && (
              <section aria-labelledby="sources-title">
                <h2 id="sources-title" className="font-display text-2xl">
                  {copy("Sources and editorial notes", "Nguồn tham khảo và biên tập")}
                </h2>
                <ul className="mt-4 space-y-3">
                  {guide.sources.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary underline underline-offset-4"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {copy(
                    "Reviewed for general planning information on the date shown. Coverage, entry rules, provider credentials and availability must be checked directly before booking. No individual treatment result or return-flight date is promised.",
                    "Thông tin lập kế hoạch được đối chiếu vào ngày ghi trên trang. Cần kiểm tra trực tiếp phạm vi bảo hiểm, nhập cảnh, giấy phép và tình trạng sẵn có trước khi đặt lịch. Không cam kết kết quả điều trị hoặc ngày có thể bay về.",
                  )}
                </p>
              </section>
            )}
          </div>

          <aside className="min-w-0 lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-3xl border border-border bg-muted/30 p-6">
              <FileText className="size-5 text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-display text-xl">{copy("Keep these together", "Chuẩn bị cùng một bộ hồ sơ")}</h2>
              <ul className="mt-4 space-y-4 text-sm leading-6">
                {(vi
                  ? [
                      "Thông tin bác sĩ và cơ sở",
                      "Báo giá và điều kiện thanh toán",
                      "Lịch tái khám và thông tin liên hệ",
                      "Tóm tắt điều trị và đơn thuốc",
                    ]
                  : [
                      "Provider identities and location",
                      "Quote and payment terms",
                      "Review plan and contact details",
                      "Treatment summary and prescriptions",
                    ]
                ).map((s) => (
                  <li key={s} className="flex gap-2">
                    <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <nav
              className="mt-6 space-y-3 text-sm"
              aria-label={copy("Related planning resources", "Tài liệu liên quan")}
            >
              <Link
                className="block underline underline-offset-4"
                to="/provider-verification"
                onClick={openEnglishResource}
              >
                {copy("Provider verification standards", "Tiêu chuẩn kiểm tra thông tin (tiếng Anh)")}
              </Link>
              <Link
                className="block underline underline-offset-4"
                to="/cosmetic-surgery-recovery-china"
                onClick={openEnglishResource}
              >
                {copy("Recovery and follow-up planning", "Lập kế hoạch hồi phục (tiếng Anh)")}
              </Link>
              <Link className="block underline underline-offset-4" to="/travel-packages" onClick={openEnglishResource}>
                {copy("Coordination and travel support", "Điều phối và hỗ trợ đi lại (tiếng Anh)")}
              </Link>
            </nav>
          </aside>
        </div>

        <section id="contact" className="border-y border-border bg-accent/40">
          <div className="container max-w-6xl py-12 md:py-16">
            <h2 className="max-w-2xl font-display text-3xl md:text-4xl">
              {copy("Start with the questions you have.", "Bắt đầu từ những điều bạn muốn hỏi.")}
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              {copy(
                "Ask about the available coordination services before making a commitment. Initial questions do not require a booking. Confirm any paid service, deposit and language support separately in writing.",
                "Bạn có thể hỏi về dịch vụ điều phối trước khi cam kết. Câu hỏi ban đầu không yêu cầu đặt lịch. Xác nhận riêng bằng văn bản các dịch vụ tính phí, khoản đặt cọc và hỗ trợ ngôn ngữ.",
              )}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="rounded-full">
                <a href={whatsappUrl(enquiry)} target="_blank" rel="noopener noreferrer">
                  {copy("Ask via WhatsApp", "Hỏi qua WhatsApp")}
                  <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <a href={consultationHandoffUrl("email", { source: `international_${guide?.locale ?? "hub"}` })}>
                  {copy("Open an email draft", "Mở bản nháp email")}
                </a>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {copy(
                "These links open another app. Review the message before sending; do not include medical records in an initial enquiry.",
                "Liên kết mở ứng dụng khác. Kiểm tra nội dung trước khi gửi; không đính kèm hồ sơ y tế trong câu hỏi ban đầu.",
              )}
            </p>
          </div>
        </section>
      </main>
      <footer className="container max-w-6xl pb-28 pt-8 text-sm text-muted-foreground">
        <p>{scope}</p>
        <nav
          className="mt-5 flex flex-wrap gap-x-5 gap-y-3"
          aria-label={copy("Policies and guides", "Chính sách và hướng dẫn")}
        >
          <Link to={INTERNATIONAL_HUB}>{copy("All visitor guides", "Hướng dẫn quốc tế (tiếng Anh)")}</Link>
          <Link to="/editorial-policy" onClick={openEnglishResource}>
            {copy("Editorial policy", "Chính sách biên tập (tiếng Anh)")}
          </Link>
          <Link to="/medical-review-policy" onClick={openEnglishResource}>
            {copy("Medical review policy", "Chính sách thẩm định y khoa (tiếng Anh)")}
          </Link>
          <Link to="/privacy" onClick={openEnglishResource}>
            {copy("Privacy notice", "Thông báo quyền riêng tư (tiếng Anh)")}
          </Link>
          <Link to="/terms" onClick={openEnglishResource}>
            {copy("Terms", "Điều khoản (tiếng Anh)")}
          </Link>
        </nav>
        <p className="mt-6">© {new Date().getFullYear()} Sino Aesthetics</p>
      </footer>
    </div>
  );
}

import LazyVideo from "@/components/media/LazyVideo";
import TreatmentRecordLinks from "@/components/cases/TreatmentRecordLinks";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Plane,
  Hotel,
  Languages,
  FileCheck2,
  Stethoscope,
  Building2,
  Wallet,
  Star,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { countryOf, findCity } from "@/data/cities";
import { getClinicPath, STATIC_CLINICS } from "@/data/clinicDirectory";
import { useTreatmentRecords } from "@/hooks/use-treatment-records";
import { matchesCity } from "@/lib/treatment-city-seo";
import { expertName, expertPath, type CaseExpert } from "@/lib/case-seo";
import { localizedField } from "@/lib/i18n-content";
import { getDirectoryDoctorPortraitRetouch } from "@/data/directory-doctor-portrait-retouches";
import QuoteCtaButton from "@/components/QuoteCtaButton";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { useAsia } from "@/lib/asia-i18n";

const CityDetail = () => {
  const { slug = "" } = useParams();
  const city = findCity(slug);
  const { lang, fmt } = useAsia();
  const { data: records } = useTreatmentRecords();
  const c = (en: string, zh: string, ru: string, es?: string) =>
    lang === "zh" ? zh : lang === "ru" ? ru : lang === "es" ? (es ?? en) : en;

  if (!city) return <Navigate to="/cities" replace />;

  // Real published profiles only, ranked by their number of published case videos.
  const caseCount = (doc: CaseExpert) =>
    (records?.videos ?? []).filter((video) => video.doctor_id === doc.id).length ||
    (doc as CaseExpert & { case_count?: number }).case_count ||
    0;
  const cityExperts = (records?.doctors ?? [])
    .filter(
      (doc) =>
        doc.status === "published" &&
        (matchesCity(doc.city || "", city.slug) ||
          matchesCity(localizedField(doc.i18n, "city", "en", doc.city) || "", city.slug)),
    )
    .sort((a, b) => caseCount(b) - caseCount(a) || a.id.localeCompare(b.id))
    .slice(0, 6);
  // Static preview clips are no longer listed; real published cases appear below.
  const cityCases: typeof TIKTOK_CASES = [];
  const travel = lang === "zh" ? city.travelZh : city.travelEn;

  const cityTitle = lang === "zh" ? city.zh : city.en;
  const cityDescription = lang === "zh" ? city.taglineZh : city.taglineEn;

  const citySchema = {
    "@context": "https://schema.org",
    "@type": "City",
    name: cityTitle,
    description: cityDescription,
    address: {
      "@type": "PostalAddress",
      addressCountry: countryOf(city.slug),
    },
  };

  return (
    <>
      <PageMeta
        title={`Plastic Surgery in ${cityTitle}: Hospitals, Surgeons & Travel Guide`}
        description={`Plastic surgery in ${cityTitle}, China: listed hospitals and experts, commonly requested procedures, pricing guidance and practical travel logistics.`}
        path={`/cities/${slug}`}
        structuredData={citySchema}
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />

        {/* Back */}
        <div className="container pt-6">
          <Link
            to="/cities"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="size-4" />
            {c("All cities", "返回城市列表", "Все города", "Todas las ciudades")}
          </Link>
        </div>

        {/* Hero */}
        <section className="container py-8 md:py-10">
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7 space-y-5">
              <span className="pill bg-accent text-accent-foreground">
                <MapPin className="size-3.5" />
                {c("City guide", "城市指南", "Гид по городу", "Guía de la ciudad")}
              </span>
              <h1 className="font-display text-4xl md:text-6xl font-medium tracking-tight leading-[1]">
                {c(
                  `Plastic surgery in ${city.en}`,
                  `${city.zh}整形`,
                  `Пластическая хирургия: ${city.en}`,
                  `Cirugía plástica en ${city.en}`,
                )}
                <span className="block text-brand text-2xl md:text-3xl mt-2 font-normal italic">
                  {lang === "zh" ? city.taglineZh : city.taglineEn}
                </span>
              </h1>
              <p className="text-foreground/80 leading-relaxed max-w-2xl">
                {lang === "zh" ? city.introZh : city.introEn}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <QuoteCtaButton quoteCtx={{ city: city.en, source: "city_hero" }} />
                <a
                  href="#city-surgeons"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-foreground/25 px-5 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  {c(
                    `See surgeons in ${city.en}`,
                    `查看${city.zh}专家`,
                    `Эксперты в городе ${city.en}`,
                    `Ver expertos en ${city.en}`,
                  )}
                  <ArrowRight className="size-4" />
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl pt-2">
                <HeroStat
                  icon={<Building2 className="size-4" />}
                  value={c("Local", "当地", "Местные", "Local")}
                  label={c("provider information", "机构信息", "данные клиник", "información del proveedor")}
                />
                <HeroStat
                  icon={<Stethoscope className="size-4" />}
                  value={c("Review", "审核", "Проверка", "Revisión")}
                  label={c("expert profiles", "专家资料", "профилей экспертов", "perfiles de expertos")}
                />
                <HeroStat
                  icon={<Sparkles className="size-4" />}
                  value={c("Care", "项目", "Услуги", "Cuidado")}
                  label={c("popular procedures", "热门项目", "популярные процедуры", "procedimientos populares")}
                />
                <HeroStat
                  icon={<Wallet className="size-4" />}
                  value={c("Itemized", "明细", "Подробно", "Detallado")}
                  label={c("pricing guidance", "报价说明", "ориентиры по ценам", "orientación de precios")}
                />
              </div>
            </div>

            <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-pop min-h-[280px]">
              <img src={city.img} alt={city.en} className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-background">
                <p className="text-xs uppercase tracking-wider opacity-80 mb-2">
                  {c("Trending procedures", "热门项目", "Популярные процедуры", "Procedimientos en tendencia")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(lang === "zh" ? city.hotZh : city.hotEn).map((h) => (
                    <span
                      key={h}
                      className="text-label px-2.5 py-1 rounded-full bg-background/95 text-foreground font-medium"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why this city */}
        <section className="container py-10">
          <div className="rounded-3xl bg-card shadow-soft p-6 md:p-8">
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-5">
              {c(`Why ${city.en}?`, `为什么选 ${city.zh}？`, `Почему ${city.en}?`, `¿Por qué ${city.en}?`)}
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {(lang === "zh" ? city.whyZh : city.whyEn).map((w) => (
                <div key={w} className="flex gap-3 items-start">
                  <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80 leading-relaxed">{w}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hospital directory entries for this city */}
        {city.hospitals.length > 0 && (
          <section className="container py-10" aria-labelledby="city-hospitals-heading">
            <h2 id="city-hospitals-heading" className="font-display text-3xl md:text-4xl font-semibold mb-6">
              {c(
                `Hospitals in ${city.en}`,
                `${city.zh}医院`,
                `Больницы в городе ${city.en}`,
                `Hospitales en ${city.en}`,
              )}
            </h2>
            <ul className="grid gap-4 md:grid-cols-3">
              {city.hospitals.slice(0, 4).map((hospital) => {
                const clinic = STATIC_CLINICS.find(
                  (entry) =>
                    entry.citySlug === city.slug && (entry.nameZh === hospital.zh || entry.nameEn === hospital.en),
                );
                const hospitalName = lang === "zh" ? hospital.zh : hospital.en;

                return (
                  <li key={hospital.zh} className="rounded-2xl border border-border/70 bg-card p-5">
                    <h3 className="font-display text-xl font-medium leading-snug">
                      {clinic ? (
                        <Link
                          to={getClinicPath(clinic)}
                          className="inline-flex min-h-11 items-start gap-2 rounded-md py-1 text-foreground underline-offset-4 transition-colors hover:text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                        >
                          {hospitalName}
                          <ArrowRight className="mt-1 size-4 shrink-0" aria-hidden="true" />
                        </Link>
                      ) : (
                        hospitalName
                      )}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {lang === "zh" ? hospital.areaZh : hospital.areaEn}
                    </p>
                  </li>
                );
              })}
            </ul>
            <Link
              to={`/clinics?city=${encodeURIComponent(city.slug)}`}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
            >
              {c(
                `View all hospitals in ${city.en}`,
                `查看${city.zh}全部医院`,
                `Все больницы в городе ${city.en}`,
                `Ver todos los hospitales en ${city.en}`,
              )}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </section>
        )}

        {/* Surgeons in this city */}
        <section id="city-surgeons" className="container scroll-mt-28 py-10">
          <div className="flex items-end justify-between mb-6 gap-4">
            <div>
              <span className="pill bg-accent text-accent-foreground mb-2">
                <Stethoscope className="size-3.5" />
                {c("Expert profiles", "专家资料", "Профили экспертов", "Perfiles de expertos")}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold">
                {c(
                  `Surgeons in ${city.en}`,
                  `${city.zh}专家资料`,
                  `Эксперты в городе ${city.en}`,
                  `Expertos en ${city.en}`,
                )}
              </h2>
            </div>
            <Link
              to={`/doctors?city=${encodeURIComponent(city.en)}`}
              className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-brand hover:translate-x-0.5 transition"
            >
              {c("All surgeons", "全部专家", "Все эксперты", "Todos los expertos")} <ArrowRight className="size-4" />
            </Link>
          </div>

          {cityExperts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {c(
                "No Sino Aesthetics-listed surgeons yet for this city — request a match below.",
                "本城市暂无平台主推专家，可在下方提交匹配申请。",
                "В этом городе пока нет опубликованных экспертов Sino Aesthetics — отправьте запрос на подбор ниже.",
                "Aún no hay expertos listados por Sino Aesthetics en esta ciudad — solicita una recomendación abajo.",
              )}
            </p>
          ) : (
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {cityExperts.map((doc) => {
                const published = caseCount(doc);
                const photo = getDirectoryDoctorPortraitRetouch(doc)?.photo || doc.photo;
                return (
                  <li key={doc.id}>
                    <Link
                      to={expertPath(doc.id)}
                      className="group flex h-full items-start gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-soft transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-pop"
                    >
                      {photo ? (
                        <img
                          src={photo}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="size-20 shrink-0 rounded-2xl object-cover"
                        />
                      ) : (
                        <span className="grid size-20 shrink-0 place-items-center rounded-2xl bg-muted">
                          <Stethoscope className="size-6" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-display text-xl font-semibold leading-tight">{expertName(doc, lang)}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {localizedField(doc.i18n, "title", lang, doc.title)}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {localizedField(doc.i18n, "hospital", lang, doc.hospital)}
                        </p>
                        {published > 0 && (
                          <p className="mt-2 text-sm font-semibold text-brand">
                            {c(
                              `${published} published case video${published === 1 ? "" : "s"}`,
                              `${published} 个已发布案例视频`,
                              `Опубликованных видео: ${published}`,
                              `${published} vídeos de casos publicados`,
                            )}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Recovery diary previews from this city */}
        {cityCases.length > 0 && (
          <section className="container py-10">
            <div className="flex items-end justify-between mb-5 gap-4">
              <h2 className="font-display text-3xl md:text-4xl font-semibold">
                {c(
                  `Recovery diary previews from ${city.en}`,
                  `${city.zh}恢复日记预览`,
                  `Дневники восстановления из города ${city.en}`,
                  `Vistas previas del diario de recuperación de ${city.en}`,
                )}
              </h2>
              <Link
                to={`/cases?city=${encodeURIComponent(city.en)}`}
                className="text-sm font-semibold text-brand hover:translate-x-0.5 transition inline-flex items-center gap-1"
              >
                {c("All cases", "全部案例", "Все случаи", "Todos los casos")} <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cityCases.slice(0, 8).map((c) => (
                <Link
                  key={c.id}
                  to={`/cases/${c.id}`}
                  className="group rounded-2xl overflow-hidden shadow-soft hover:shadow-pop transition-all hover:-translate-y-1 bg-card"
                >
                  <div className="aspect-[3/4] relative bg-muted">
                    <LazyVideo
                      previewLoop
                      src={c.src}
                      poster={c.poster}
                      alt={lang === "zh" ? c.treatment.zh : c.treatment.en}
                      className="absolute inset-0 size-full"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-label text-background font-semibold leading-tight">
                        {lang === "zh" ? c.treatment.zh : c.treatment.en}
                      </p>
                      {c.priceCny > 0 && <p className="text-label text-background/80 mt-0.5">{fmt(c.priceCny)}</p>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="container pb-10">
          <TreatmentRecordLinks citySlug={city.slug} />
        </div>

        {/* Travel essentials */}
        <section className="container py-10">
          <div className="rounded-3xl bg-gradient-to-r from-[hsl(155,55%,92%)] via-[hsl(150,48%,91%)] to-[hsl(50,78%,92%)] p-6 md:p-8 shadow-soft">
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-5">
              {c("Travel essentials", "出行配套", "Всё необходимое для поездки", "Esenciales de viaje")}
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              <TravelCard
                icon={<Plane className="size-5 text-primary" />}
                title={c("Airports", "机场", "Аэропорты", "Aeropuertos")}
                body={travel.airport}
              />
              <TravelCard
                icon={<FileCheck2 className="size-5 text-primary" />}
                title={c("Visa", "签证", "Виза", "Visa")}
                body={travel.visa}
              />
              <TravelCard
                icon={<Hotel className="size-5 text-primary" />}
                title={c("Recovery hotels", "恢复酒店", "Отели для восстановления", "Hoteles de recuperación")}
                body={travel.hotel}
              />
              <TravelCard
                icon={<Languages className="size-5 text-primary" />}
                title={c("Languages", "语言", "Языки", "Idiomas")}
                body={travel.lang}
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container pb-20 pt-4">
          <div className="rounded-3xl bg-foreground text-background p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold">
                {c(
                  `Plan your ${city.en} trip with Sino Aesthetics`,
                  `让 Sino Aesthetics 为你规划 ${city.zh} 行程`,
                  `Спланируйте поездку в ${city.en} с Sino Aesthetics`,
                  `Planifica tu viaje a ${city.en} con Sino Aesthetics`,
                )}
              </h2>
              <p className="text-sm text-background/80 mt-2 max-w-xl">
                {c(
                  "Surgeon shortlist, price quote, hospital booking and recovery hotel — handled by an English-speaking coordinator.",
                  "主刀候选 / 报价 / 机构预约 / 恢复酒店，全程中英文专属顾问对接。",
                  "Подбор экспертов, смета, запись в клинику и отель для восстановления — с поддержкой англоязычного координатора.",
                  "Preselección de expertos, cotización, reserva de hospital y hotel de recuperación — gestionado por un coordinador de habla inglesa.",
                )}
              </p>
            </div>
            <QuoteCtaButton
              variant="primary"
              quoteCtx={{ city: city.en, source: "city_footer" }}
              className="shrink-0"
            />
            <Link
              to={`/doctors?city=${encodeURIComponent(city.en)}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-background/40 px-6 py-3 text-sm font-semibold text-background transition hover:bg-background/10"
            >
              {c("Browse surgeons", "查看专家", "Смотреть экспертов", "Ver expertos")} <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

const HeroStat = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="rounded-2xl bg-card shadow-soft p-3">
    <div className="flex items-center gap-1.5 text-primary">
      {icon}
      <span className="font-display text-xl font-semibold text-brand">{value}</span>
    </div>
    <p className="text-label text-muted-foreground mt-1 uppercase tracking-wider">{label}</p>
  </div>
);

const TravelCard = ({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) => (
  <div className="rounded-2xl bg-card p-4">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <p className="font-display font-semibold text-sm">{title}</p>
    </div>
    <p className="text-xs text-foreground/70 leading-relaxed">{body}</p>
  </div>
);

export default CityDetail;

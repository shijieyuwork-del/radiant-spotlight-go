import { Link, useParams, Navigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, MapPin, Plane, Hotel, Languages, FileCheck2,
  Stethoscope, Building2, Wallet, Star, CheckCircle2, Sparkles,
} from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { countryOf, findCity } from "@/data/cities";
import { DOCTORS } from "@/data/doctors";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { useAsia } from "@/lib/asia-i18n";

const CityDetail = () => {
  const { slug = "" } = useParams();
  const city = findCity(slug);
  const { lang, fmt } = useAsia();
  const c = (en: string, zh: string, ru: string) => lang === "zh" ? zh : lang === "ru" ? ru : en;

  if (!city) return <Navigate to="/cities" replace />;

  const cityDoctors = DOCTORS.filter(() => false);
  const cityCaseIds = new Set(cityDoctors.flatMap((d) => d.caseIds));
  const cityCases = TIKTOK_CASES.filter((c) => cityCaseIds.has(c.id));
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
        title={`${cityTitle} | Medical Aesthetics, Cosmetic Surgeons & Prices`}
        description={`Plan cosmetic medical travel in ${cityTitle}, China. Explore local logistics, commonly requested procedures and published expert profiles.`}
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
          {c("All cities", "返回城市列表", "Все города")}
        </Link>
      </div>

      {/* Hero */}
      <section className="container py-8 md:py-10">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 space-y-5">
            <span className="pill bg-accent text-accent-foreground">
              <MapPin className="size-3.5" />
              {c("City guide", "城市指南", "Гид по городу")}
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-medium tracking-tight leading-[0.95]">
              {lang === "zh" ? city.zh : city.en}
              <span className="block text-primary text-2xl md:text-3xl mt-2 font-normal italic">
                {lang === "zh" ? city.taglineZh : city.taglineEn}
              </span>
            </h1>
            <p className="text-foreground/80 leading-relaxed max-w-2xl">
              {lang === "zh" ? city.introZh : city.introEn}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl pt-2">
              <HeroStat icon={<Building2 className="size-4" />} value={c("Local", "当地", "Местные")} label={c("provider information", "机构信息", "данные клиник")} />
              <HeroStat icon={<Stethoscope className="size-4" />} value={c("Review", "审核", "Проверка")} label={c("expert profiles", "专家资料", "профилей экспертов")} />
              <HeroStat icon={<Sparkles className="size-4" />} value={c("Care", "项目", "Услуги")} label={c("popular procedures", "热门项目", "популярные процедуры")} />
              <HeroStat icon={<Wallet className="size-4" />} value={c("Itemized", "明细", "Подробно")} label={c("pricing guidance", "报价说明", "ориентиры по ценам")} />
            </div>
          </div>

          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-pop min-h-[280px]">
            <img src={city.img} alt={city.en} className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-background">
              <p className="text-xs uppercase tracking-wider opacity-80 mb-2">
                {c("Trending procedures", "热门项目", "Популярные процедуры")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(lang === "zh" ? city.hotZh : city.hotEn).map((h) => (
                  <span key={h} className="text-[11px] px-2.5 py-1 rounded-full bg-background/95 text-foreground font-medium">
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
            {c(`Why ${city.en}?`, `为什么选 ${city.zh}？`, `Почему ${city.en}?`)}
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

      {/* Surgeons in this city */}
      <section className="container py-10">
        <div className="flex items-end justify-between mb-6 gap-4">
          <div>
            <span className="pill bg-accent text-accent-foreground mb-2">
              <Stethoscope className="size-3.5" />
              {c("Expert profiles", "专家资料", "Профили экспертов")}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              {c(`Surgeons in ${city.en}`, `${city.zh}专家资料`, `Эксперты в городе ${city.en}`)}
            </h2>
          </div>
          <Link
            to="/doctors"
            className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:translate-x-0.5 transition"
          >
            {c("All surgeons", "全部专家", "Все эксперты")} <ArrowRight className="size-4" />
          </Link>
        </div>

        {cityDoctors.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {c("No Cosmetics Asia-listed surgeons yet for this city — request a match below.", "本城市暂无平台主推专家，可在下方提交匹配申请。", "В этом городе пока нет опубликованных экспертов Cosmetics Asia — отправьте запрос на подбор ниже.")}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cityDoctors.map((d) => (
              <Link
                key={d.id}
                to={`/doctors/${d.id}`}
                className="group rounded-3xl bg-card shadow-soft hover:shadow-pop transition-all hover:-translate-y-1 overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src={d.img} alt={d.en} className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 space-y-2">
                  <p className="font-display text-lg font-semibold leading-tight">
                    {lang === "zh" ? d.zh : d.en}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {lang === "zh" ? d.titleZh : d.titleEn}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {lang === "zh" ? d.clinicZh : d.clinicEn}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-foreground/70 pt-1">
                    <span className="flex items-center gap-1">
                      <Star className="size-3 text-primary fill-primary" />
                      {d.rating} · {d.reviews}
                    </span>
                    <span>{d.years}{lang === "zh" ? "年" : "y"}</span>
                    <span>{d.surgeries}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-2">
                    {(lang === "zh" ? d.specZh : d.specEn).slice(0, 3).map((s) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>


      {/* Recovery diary previews from this city */}
      {cityCases.length > 0 && (
        <section className="container py-10">
          <div className="flex items-end justify-between mb-5 gap-4">
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              {c(`Recovery diary previews from ${city.en}`, `${city.zh}恢复日记预览`, `Дневники восстановления из города ${city.en}`)}
            </h2>
            <Link to="/cases" className="text-sm font-semibold text-primary hover:translate-x-0.5 transition inline-flex items-center gap-1">
              {c("All cases", "全部案例", "Все случаи")} <ArrowRight className="size-4" />
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
                  <video src={c.src} muted loop playsInline className="absolute inset-0 size-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-[11px] text-background font-semibold leading-tight">
                      {lang === "zh" ? c.treatment.zh : c.treatment.en}
                    </p>
                    <p className="text-[10px] text-background/80 mt-0.5">
                      {fmt(c.priceCny)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Travel essentials */}
      <section className="container py-10">
        <div className="rounded-3xl bg-gradient-to-r from-[hsl(155,55%,92%)] via-[hsl(150,48%,91%)] to-[hsl(50,78%,92%)] p-6 md:p-8 shadow-soft">
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-5">
            {c("Travel essentials", "出行配套", "Всё необходимое для поездки")}
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <TravelCard icon={<Plane className="size-5 text-primary" />} title={c("Airports", "机场", "Аэропорты")} body={travel.airport} />
            <TravelCard icon={<FileCheck2 className="size-5 text-primary" />} title={c("Visa", "签证", "Виза")} body={travel.visa} />
            <TravelCard icon={<Hotel className="size-5 text-primary" />} title={c("Recovery hotels", "恢复酒店", "Отели для восстановления")} body={travel.hotel} />
            <TravelCard icon={<Languages className="size-5 text-primary" />} title={c("Languages", "语言", "Языки")} body={travel.lang} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20 pt-4">
        <div className="rounded-3xl bg-foreground text-background p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold">
              {c(`Plan your ${city.en} trip with Cosmetics Asia`, `让 Cosmetics Asia 为你规划 ${city.zh} 行程`, `Спланируйте поездку в ${city.en} с Cosmetics Asia`)}
            </h2>
            <p className="text-sm text-background/80 mt-2 max-w-xl">
              {c("Surgeon shortlist, price quote, hospital booking and recovery hotel — handled by an English-speaking coordinator.", "主刀候选 / 报价 / 机构预约 / 恢复酒店，全程中英文专属顾问对接。", "Подбор экспертов, смета, запись в клинику и отель для восстановления — с поддержкой англоязычного координатора.")}
            </p>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition shrink-0"
          >
            {c("Get matched", "立即匹配主刀", "Подобрать эксперта")} <ArrowRight className="size-4" />
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
    <div className="flex items-center gap-1.5 text-primary">{icon}<span className="font-display text-xl font-semibold">{value}</span></div>
    <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{label}</p>
  </div>
);

const TravelCard = ({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) => (
  <div className="rounded-2xl bg-card p-4">
    <div className="flex items-center gap-2 mb-2">{icon}<p className="font-display font-semibold text-sm">{title}</p></div>
    <p className="text-xs text-foreground/70 leading-relaxed">{body}</p>
  </div>
);

export default CityDetail;

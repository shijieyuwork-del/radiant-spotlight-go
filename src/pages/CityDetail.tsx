import { Link, useParams, Navigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, MapPin, Plane, Hotel, Languages, FileCheck2,
  Stethoscope, Building2, Wallet, Star, CheckCircle2, Sparkles,
} from "lucide-react";
import CnNavbar from "@/components/CnNavbar";
import Footer from "@/components/Footer";
import { findCity } from "@/data/cities";
import { DOCTORS } from "@/data/doctors";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { useCn } from "@/lib/cn-i18n";

const CityDetail = () => {
  const { slug = "" } = useParams();
  const city = findCity(slug);
  const { lang, fmt } = useCn();

  if (!city) return <Navigate to="/cities" replace />;

  const cityDoctors = DOCTORS.filter((d) => d.cityEn === city.en);
  const cityCaseIds = new Set(cityDoctors.flatMap((d) => d.caseIds));
  const cityCases = TIKTOK_CASES.filter((c) => cityCaseIds.has(c.id));
  const travel = lang === "zh" ? city.travelZh; : city.travelEn

  return (
    <div className="min-h-screen bg-background">
      <CnNavbar />

      {/* Back */}
      <div className="container pt-6">
        <Link
          to="/cities"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="size-4" />
          {lang === "zh" ? "返回城市列表" : "All cities"}
        </Link>
      </div>

      {/* Hero */}
      <section className="container py-8 md:py-10">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 space-y-5">
            <span className="pill bg-accent text-accent-foreground">
              <MapPin className="size-3.5" />
              {lang === "zh" ? "城市指南" : "City guide"}
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
              <HeroStat icon={<Building2 className="size-4" />} value={`${city.clinics}`} label={lang === "zh" ? "正规机构" : "Hospitals"} />
              <HeroStat icon={<Stethoscope className="size-4" />} value={`${city.doctorsCount}`} label={lang === "zh" ? "主刀医生" : "Surgeons"} />
              <HeroStat icon={<Sparkles className="size-4" />} value={`${cityDoctors.length}`} label={lang === "zh" ? "平台医师" : "On glowy"} />
              <HeroStat icon={<Wallet className="size-4" />} value={city.savings} label={lang === "zh" ? "对比美国" : "vs US clinics"} />
            </div>
          </div>

          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-pop min-h-[280px]">
            <img src={city.img} alt={city.en} className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-background">
              <p className="text-xs uppercase tracking-wider opacity-80 mb-2">
                {lang === "zh" ? "热门项目" : "Trending procedures"}
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
            {lang === "zh" ? `为什么选 ${city.zh}？` : `Why ${city.en}?`}
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
              {lang === "zh" ? "认证主刀" : "Verified surgeons"}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              {lang === "zh" ? `${city.zh}主刀医生推荐` : `Top surgeons in ${city.en}`}
            </h2>
          </div>
          <Link
            to="/doctors"
            className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:translate-x-0.5 transition"
          >
            {lang === "zh" ? "全部医生" : "All surgeons"} <ArrowRight className="size-4" />
          </Link>
        </div>

        {cityDoctors.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {lang === "zh" ? "本城市暂无平台主推医师，可在下方提交匹配申请。" : "No glowy-listed surgeons yet for this city — request a match below."}
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


      {/* Real cases from this city */}
      {cityCases.length > 0 && (
        <section className="container py-10">
          <div className="flex items-end justify-between mb-5 gap-4">
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              {lang === "zh" ? `${city.zh}真实案例` : `Real cases from ${city.en}`}
            </h2>
            <Link to="/cases" className="text-sm font-semibold text-primary hover:translate-x-0.5 transition inline-flex items-center gap-1">
              {lang === "zh" ? "全部案例" : "All cases"} <ArrowRight className="size-4" />
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
        <div className="rounded-3xl bg-gradient-to-r from-[hsl(190,70%,92%)] via-[hsl(155,60%,90%)] to-[hsl(50,80%,92%)] p-6 md:p-8 shadow-soft">
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-5">
            {lang === "zh" ? "出行配套" : "Travel essentials"}
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <TravelCard icon={<Plane className="size-5 text-primary" />} title={lang === "zh" ? "机场" : "Airports"} body={travel.airport} />
            <TravelCard icon={<FileCheck2 className="size-5 text-primary" />} title={lang === "zh" ? "签证" : "Visa"} body={travel.visa} />
            <TravelCard icon={<Hotel className="size-5 text-primary" />} title={lang === "zh" ? "恢复酒店" : "Recovery hotels"} body={travel.hotel} />
            <TravelCard icon={<Languages className="size-5 text-primary" />} title={lang === "zh" ? "语言" : "Languages"} body={travel.lang} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20 pt-4">
        <div className="rounded-3xl bg-foreground text-background p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold">
              {lang === "zh" ? `让 glowy 为你规划 ${city.zh} 行程` : `Plan your ${city.en} trip with glowy`}
            </h2>
            <p className="text-sm text-background/80 mt-2 max-w-xl">
              {lang === "zh" ? "主刀候选 / 报价 / 机构预约 / 恢复酒店，全程中英文专属顾问对接。" : "Surgeon shortlist, price quote, hospital booking and recovery hotel — handled by an English-speaking coordinator."}
            </p>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition shrink-0"
          >
            {lang === "zh" ? "立即匹配主刀" : "Get matched"} <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
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

import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Clock, MapPin, MessageCircle, Stethoscope } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import TikTokWall from "@/components/TikTokWall";
import { DEMO_CHINA_DOCTORS } from "@/data/demoChinaDoctors";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { useAsia } from "@/lib/asia-i18n";
import { getCityTimezone, useCityTime } from "@/lib/timezones";

const DemoDoctorDetail = () => {
  const { id } = useParams();
  const { lang, fmt } = useAsia();
  const doctor = useMemo(() => DEMO_CHINA_DOCTORS.find((item) => item.id === id), [id]);
  const tz = getCityTimezone(doctor?.city);
  const cityNow = useCityTime(tz, lang);
  const cases = useMemo(() => {
    if (!doctor) return [];
    const specialties = doctor.specialties.map((item) => item.toLowerCase());
    return TIKTOK_CASES.filter((item) => {
      const treatment = item.treatment.en.toLowerCase();
      return specialties.some((specialty) =>
        treatment.includes(specialty) || specialty.includes(treatment) ||
        (specialty.includes("facelift") && /facelift|neck lift|fat graft/.test(treatment)) ||
        (specialty.includes("body") && /liposuction|tummy|bbl|body/.test(treatment)) ||
        (specialty.includes("breast") && treatment.includes("breast"))
      );
    }).slice(0, 6);
  }, [doctor]);

  if (!doctor) {
    return <div className="min-h-screen bg-background"><AsiaNavbar homeLinks={false} /><main className="container py-24 text-center"><p>{lang === "zh" ? "专家资料不存在。" : lang === "ru" ? "Профиль эксперта не найден." : "Doctor profile not found."}</p><Link to="/doctors" className="mt-4 inline-block text-primary underline">{lang === "zh" ? "返回专家列表" : lang === "ru" ? "Вернуться к экспертам" : "Back to doctors"}</Link></main></div>;
  }

  const whatsapp = `https://wa.me/14708613825?text=${encodeURIComponent(`Hi Cosmetics Asia, I’d like to ask about ${doctor.name} and available consultation options.`)}`;
  return (
    <>
      <PageMeta title={`${doctor.name} | Sample Doctor Profile`} description={`${doctor.name}, a sample ${doctor.title} profile in ${doctor.city}.`} path={`/doctors/demo/${doctor.id}`} />
      <div className="min-h-screen bg-background">
        <AsiaNavbar homeLinks={false} />
        <main className="container py-8 md:py-12">
          <Link to="/doctors" className="mb-5 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />{lang === "zh" ? "全部专家" : lang === "ru" ? "Все эксперты" : "All doctors"}</Link>
          <section className="grid gap-7 rounded-[2rem] border border-border/70 bg-card p-5 shadow-pop md:grid-cols-[240px_1fr] md:p-8">
            <img src={doctor.photo} alt={doctor.name} className="aspect-square w-full rounded-3xl object-cover" />
            <div>
              <span className="pill bg-accent text-accent-foreground"><Stethoscope className="size-3.5 text-primary" />{lang === "zh" ? "虚构示例资料" : lang === "ru" ? "Демо-профиль" : "Fictional sample profile"}</span>
              <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-5xl">{doctor.name}</h1>
              <p className="mt-2 text-lg text-muted-foreground">{doctor.title}</p>
              <p className="mt-5 flex items-center gap-2 text-sm"><Building2 className="size-4 text-primary" />{doctor.hospital}</p>
              <p className="mt-2 flex items-center gap-2 text-sm"><MapPin className="size-4 text-primary" />{doctor.city}, China</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Clock className="size-4 text-primary" />{lang === "zh" ? `${doctor.city}当地时间 ${tz.offset}（${tz.label.zh}）· 现在约 ${cityNow}，咨询预约以此时区为准` : lang === "ru" ? `Местное время в г. ${doctor.city}: ${cityNow} (${tz.offset} · ${tz.label.ru}) — консультации назначаются по этому времени` : `Local time in ${doctor.city}: ${cityNow} (${tz.offset} · ${tz.label.en}) — consultations are booked in this timezone`}</p>
              <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">{doctor.bio}</p>
              <div className="mt-5 flex flex-wrap gap-2">{doctor.specialties.map((specialty) => <span key={specialty} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold">{specialty}</span>)}</div>
              <a href={whatsapp} target="_blank" rel="noreferrer" className="cta-primary mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-6 text-sm font-bold sm:w-auto sm:rounded-full"><MessageCircle className="size-4" />{lang === "zh" ? "咨询这位专家" : lang === "ru" ? "Связаться по поводу эксперта" : "Contact us about this expert"}</a>
            </div>
          </section>

          <section className="mt-12 md:mt-16">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{lang === "zh" ? "相关案例" : lang === "ru" ? "Похожие случаи" : "Related patient diaries"}</span>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight md:text-4xl">{lang === "zh" ? "查看该专科的其他案例" : lang === "ru" ? "Другие случаи по этой специализации" : "Explore more cases in this specialty"}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{lang === "zh" ? "这些案例按专科匹配，并不代表由该虚构示例专家完成。真实专家发布后，其本人案例将在这里单独展示。" : lang === "ru" ? "Эти дневники подобраны по специализации и не относятся к вымышленному эксперту. Случаи конкретных экспертов появятся после публикации реальных профилей." : "These diaries are matched by specialty and are not attributed to this fictional sample doctor. Expert-linked cases will appear here after real profiles are published."}</p>
            {cases.length > 0 && <div className="mt-7"><TikTokWall items={cases} lang={lang} fmtPrice={fmt} variant="preview" /></div>}
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default DemoDoctorDetail;

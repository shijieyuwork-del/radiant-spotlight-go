import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, BadgeCheck, Building2, FileCheck2, GraduationCap,
  Languages, MapPin, ShieldCheck, Star, Stethoscope, Trophy, MessageCircle,
} from "lucide-react";
import CnNavbar from "@/components/CnNavbar";
import Footer from "@/components/Footer";
import TikTokWall from "@/components/TikTokWall";
import { Button } from "@/components/ui/button";
import { DOCTORS, findDoctor } from "@/data/doctors";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { useCn } from "@/lib/cn-i18n";

const DoctorDetail = () => {
  const { id } = useParams();
  const { t, lang, fmt } = useCn();
  const doctor = useMemo(() => (id ? findDoctor(id) : undefined), [id]);

  const cases = useMemo(
    () => (doctor ? TIKTOK_CASES.filter((c) => doctor.caseIds.includes(c.id)) : []),
    [doctor],
  );
  const otherDoctors = useMemo(
    () => DOCTORS.filter((d) => d.id !== id).slice(0, 3),
    [id],
  );

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background">
        <CnNavbar homeLinks={false} />
        <div className="container py-24 text-center">
          <p className="text-muted-foreground">
            {lang === "zh" ? "医师档案不存在。" : "Doctor profile not found."}
          </p>
          <Link to="/doctors" className="text-primary underline mt-4 inline-block">
            {lang === "zh" ? "返回医师列表" : "Back to all doctors"}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CnNavbar homeLinks={false} />

      <section className="container py-8 md:py-12">
        <Link to="/doctors" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="size-4" /> {lang === "zh" ? "全部医师" : "All doctors"}
        </Link>

        {/* Header card */}
        <div className="rounded-3xl bg-card shadow-pop p-6 md:p-8 grid md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-3">
            <img
              src={doctor.img}
              alt={lang === "zh" ? doctor.zh : doctor.en}
              className="w-full aspect-square rounded-3xl object-cover shadow-soft"
            />
          </div>
          <div className="md:col-span-6 space-y-3">
            <span className="pill bg-accent text-accent-foreground">
              <BadgeCheck className="size-3.5 text-primary" /> {t("doc.cert")}
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-medium tracking-tight leading-tight">
              {lang === "zh" ? doctor.zh : doctor.en}
            </h1>
            <p className="text-sm text-muted-foreground">
              {lang === "zh" ? doctor.titleZh : doctor.titleEn}
            </p>
            <p className="text-sm flex items-center gap-1.5">
              <Building2 className="size-4 text-primary" />
              {lang === "zh" ? doctor.clinicZh : doctor.clinicEn}
            </p>
            <p className="text-sm flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="size-4 text-primary" />
              {lang === "zh" ? doctor.cityZh : doctor.cityEn}
            </p>

            <div className="flex flex-wrap gap-1 pt-1">
              {(lang === "zh" ? doctor.specZh : doctor.specEn).map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-accent text-accent-foreground">{s}</span>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 grid grid-cols-3 md:grid-cols-1 gap-2">
            <div className="rounded-2xl bg-secondary p-3 text-center">
              <p className="font-display text-xl font-semibold">{doctor.years}{lang === "zh" ? "年" : ""}</p>
              <p className="text-[10px] text-muted-foreground">{t("doctors.exp")}</p>
            </div>
            <div className="rounded-2xl bg-secondary p-3 text-center">
              <p className="font-display text-xl font-semibold">{doctor.surgeries}</p>
              <p className="text-[10px] text-muted-foreground">{t("doctors.cases")}</p>
            </div>
            <div className="rounded-2xl bg-secondary p-3 text-center">
              <p className="font-display text-xl font-semibold inline-flex items-center gap-0.5">
                <Star className="size-4 fill-primary text-primary" /> {doctor.rating}
              </p>
              <p className="text-[10px] text-muted-foreground">{doctor.reviews.toLocaleString()} {t("cl.reviews")}</p>
            </div>
          </div>
        </div>

        {/* Compliance row */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-muted/40 p-4 flex items-start gap-3">
            <FileCheck2 className="size-4 text-primary mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">{t("doctors.lic")}</p>
              <p className="font-mono text-foreground/80 text-xs mt-0.5 break-all">{doctor.license}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-muted/40 p-4 flex items-start gap-3">
            <ShieldCheck className="size-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm">{lang === "zh" ? doctor.qualZh : doctor.qualEn}</p>
          </div>
        </div>

        {/* Body grid */}
        <div className="mt-10 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Bio */}
            <div>
              <h2 className="font-display text-2xl font-medium tracking-tight flex items-center gap-2 mb-3">
                <Stethoscope className="size-5 text-primary" />
                {lang === "zh" ? "医师简介" : "About the surgeon"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {lang === "zh" ? doctor.bioZh : doctor.bioEn}
              </p>
            </div>

            {/* Education + Awards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-card shadow-soft p-5">
                <h3 className="font-display text-base font-semibold flex items-center gap-2 mb-3">
                  <GraduationCap className="size-4 text-primary" />
                  {lang === "zh" ? "教育与研修" : "Education & training"}
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {(lang === "zh" ? doctor.eduZh : doctor.eduEn).map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-card shadow-soft p-5">
                <h3 className="font-display text-base font-semibold flex items-center gap-2 mb-3">
                  <Trophy className="size-4 text-primary" />
                  {lang === "zh" ? "荣誉与学会" : "Awards & memberships"}
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {(lang === "zh" ? doctor.awardsZh : doctor.awardsEn).map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Cases */}
            <div>
              <h2 className="font-display text-2xl font-medium tracking-tight mb-4">
                {lang === "zh" ? `本医师真实案例（${cases.length}）` : `Verified cases by this surgeon (${cases.length})`}
              </h2>
              {cases.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {lang === "zh" ? "暂无公开案例 · 预约面诊可查看私密相册。" : "No public cases yet — book a consult to view private galleries."}
                </p>
              ) : (
                <TikTokWall items={cases} lang={lang} fmtPrice={fmt} variant="wall" />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl bg-gradient-to-br from-[hsl(155,60%,90%)] to-[hsl(50,80%,92%)] p-5 shadow-soft">
              <p className="text-xs text-foreground/60">{lang === "zh" ? "预约本医师" : "Book with this surgeon"}</p>
              <p className="font-display text-xl font-semibold mt-1 leading-tight">
                {lang === "zh" ? "免费 1 对 1 面诊" : "Free 1-on-1 consult"}
              </p>
              <p className="text-xs text-foreground/70 mt-2">
                {lang === "zh" ? "全程中英双语助理 · 含医疗签证与机场接送。" : "English-speaking coordinator · medical visa & airport pickup included."}
              </p>
              <Button className="mt-4 w-full rounded-2xl bg-foreground text-background hover:bg-foreground/90">
                <MessageCircle className="size-4" /> {t("cl.cta")}
              </Button>
            </div>

            <div className="rounded-3xl bg-card shadow-soft p-5">
              <h3 className="font-display text-base font-semibold mb-3">
                {lang === "zh" ? "参考价目表" : "Reference price list"}
              </h3>
              <ul className="divide-y divide-border">
                {doctor.priceList.map((p) => (
                  <li key={p.en} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                    <span className="truncate">{lang === "zh" ? p.zh : p.en}</span>
                    <span className="font-semibold shrink-0">{lang === "zh" ? "" : "from "}{fmt(p.from)}{lang === "zh" ? " 起" : ""}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-card shadow-soft p-5">
              <h3 className="font-display text-base font-semibold flex items-center gap-2 mb-3">
                <Languages className="size-4 text-primary" />
                {lang === "zh" ? "可用语言" : "Languages spoken"}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {doctor.languages.map((l) => (
                  <span key={l} className="text-xs px-2.5 py-1 rounded-full bg-accent text-accent-foreground">{l}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Other doctors */}
        <div className="mt-16">
          <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight mb-6">
            {lang === "zh" ? "其他持证医师" : "Other verified surgeons"}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {otherDoctors.map((d) => (
              <Link key={d.id} to={`/doctors/${d.id}`} className="rounded-3xl bg-card shadow-pop p-5 hover:shadow-glow transition flex items-center gap-4 group">
                <img src={d.img} alt="" className="size-14 rounded-2xl object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-display font-semibold leading-tight truncate">{lang === "zh" ? d.zh : d.en}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{lang === "zh" ? d.cityZh : d.cityEn} · {(lang === "zh" ? d.specZh : d.specEn)[0]}</p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DoctorDetail;

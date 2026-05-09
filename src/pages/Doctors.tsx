import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search, Filter, Stethoscope, BadgeCheck, Building2, FileCheck2, Star, ArrowRight, MapPin,
} from "lucide-react";
import CnNavbar from "@/components/CnNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { DOCTORS } from "@/data/doctors";
import { useCn } from "@/lib/cn-i18n";

const Doctors = () => {
  const { t, lang } = useCn();
  const [q, setQ] = useState("");
  const [city, setCity] = useState<string>("all");
  const [spec, setSpec] = useState<string>("all");

  const cities = useMemo(() => {
    const set = new Map<string, string>();
    DOCTORS.forEach((d) => set.set(d.cityEn, d[lang === "zh" ? "cityZh" : "cityEn"]));
    return Array.from(set, ([key, label]) => ({ key, label }));
  }, [lang]);

  const specialties = useMemo(() => {
    const set = new Map<string, string>();
    DOCTORS.forEach((d) =>
      d.specEn.forEach((s, i) => set.set(s, lang === "zh" ? d.specZh[i] ?? s : s)),
    );
    return Array.from(set, ([key, label]) => ({ key, label }));
  }, [lang]);

  const items = useMemo(() => {
    return DOCTORS.filter((d) => {
      if (city !== "all" && d.cityEn !== city) return false;
      if (spec !== "all" && !d.specEn.includes(spec)) return false;
      if (!q.trim()) return true;
      const hay = `${d.en} ${d.zh} ${d.clinicEn} ${d.clinicZh} ${d.specEn.join(" ")} ${d.specZh.join(" ")}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [q, city, spec]);

  return (
    <div className="min-h-screen bg-background">
      <CnNavbar />

      <section className="container py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="pill bg-accent text-accent-foreground mb-3">
            <Stethoscope className="size-3.5" /> {t("doctors.kicker")}
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            {t("doctors.title1")} <em className="text-primary not-italic">{t("doctors.titleEm")}</em>
          </h1>
          <p className="text-muted-foreground mt-3">
            {lang === "zh" ? "每位医师均持有国家卫健委颁发的《医师执业证》。可按手术类型与城市筛选，点击档案查看完整介绍与真实手术案例。" : "Every surgeon below is licensed by the China NHC. Filter by procedure or city, then click any profile to read their bio and verified case diaries."}
          </p>
        </div>

        <div className="bg-card rounded-3xl p-2 shadow-pop flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto mb-6">
          <div className="flex-1 px-5 py-3 flex items-center gap-3">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full bg-transparent outline-none text-sm font-medium"
              placeholder={lang === "zh" ? "搜索医生、机构或擅长项目…" : "Search by name, clinic or specialty…"}
            />
          </div>
        </div>

        {/* Procedure filter */}
        <div className="mb-3">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold text-center mb-2">
            {lang === "zh" ? "手术类型" : "Procedure"}
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Button variant={spec === "all" ? "default" : "outline"} size="sm" className="rounded-full" onClick={() => setSpec("all")}>
              {t("cases.tabAll")}
            </Button>
            {specialties.map((s) => (
              <Button key={s.key} variant={spec === s.key ? "default" : "outline"} size="sm" className="rounded-full" onClick={() => setSpec(s.key)}>
                {s.label}
              </Button>
            ))}
          </div>
        </div>

        {/* City filter */}
        <div className="mb-10">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold text-center mb-2">
            {lang === "zh" ? "城市" : "City"}
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1 mr-1"><Filter className="size-3" /></span>
            <Button variant={city === "all" ? "default" : "outline"} size="sm" className="rounded-full" onClick={() => setCity("all")}>
              {t("cases.tabAll")}
            </Button>
            {cities.map((c) => (
              <Button key={c.key} variant={city === c.key ? "default" : "outline"} size="sm" className="rounded-full" onClick={() => setCity(c.key)}>
                {c.label}
              </Button>
            ))}
          </div>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-12 text-sm">
            {lang === "zh" ? "没有匹配的医师，换个筛选试试。" : "No surgeons match this filter."}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((d) => (
              <Link
                key={d.id}
                to={`/doctors/${d.id}`}
                className="rounded-3xl bg-card shadow-pop p-6 hover:shadow-glow transition group block"
              >
                <div className="flex items-center gap-4">
                  <img src={d.img} alt={lang === "zh" ? d.zh : d.en} className="size-16 rounded-2xl object-cover" />
                  <div className="min-w-0">
                    <p className="font-display text-lg font-semibold leading-tight truncate">{lang === "zh" ? d.zh : d.en}</p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {lang === "zh" ? d.titleZh : d.titleEn}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 inline-flex items-center gap-1">
                      <MapPin className="size-3" /> {lang === "zh" ? d.cityZh : d.cityEn}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-4 flex items-center gap-1">
                  <Building2 className="size-3.5 shrink-0" />
                  <span className="truncate">{lang === "zh" ? d.clinicZh : d.clinicEn}</span>
                </p>

                <div className="mt-4 rounded-2xl bg-muted/40 p-3 space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <FileCheck2 className="size-3 text-primary" />
                    <span>{t("doctors.lic")}</span>
                    <span className="font-mono text-foreground truncate">{d.license}</span>
                  </div>
                  <p className="text-muted-foreground flex items-start gap-1.5">
                    <BadgeCheck className="size-3 text-primary mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{lang === "zh" ? d.qualZh : d.qualEn}</span>
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-secondary py-2">
                    <p className="font-display text-base font-semibold">{d.years}{lang === "zh" ? "年" : ""}</p>
                    <p className="text-[10px] text-muted-foreground">{t("doctors.exp")}</p>
                  </div>
                  <div className="rounded-xl bg-secondary py-2">
                    <p className="font-display text-base font-semibold">{d.surgeries}</p>
                    <p className="text-[10px] text-muted-foreground">{t("doctors.cases")}</p>
                  </div>
                  <div className="rounded-xl bg-secondary py-2">
                    <p className="font-display text-base font-semibold inline-flex items-center gap-0.5">
                      <Star className="size-3.5 fill-primary text-primary" /> {d.rating}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{d.reviews.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
                    {lang === "zh" ? "手术类型" : "Procedures"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {d.specEn.map((sEn, i) => {
                      const label = lang === "zh" ? (d.specZh[i] ?? sEn) : sEn;
                      const matched = spec !== "all" && sEn === spec;
                      return (
                        <span
                          key={sEn}
                          className={
                            matched
                              ? "inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow ring-2 ring-primary/30"
                              : "inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-accent text-accent-foreground"
                          }
                        >
                          {matched && <Stethoscope className="size-3" />}
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                  {t("doctors.cta")} <ArrowRight className="size-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Doctors;

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search, Filter, Stethoscope, BadgeCheck, Building2, FileCheck2, Star, ArrowRight, MapPin, MessageCircle,
} from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { DOCTORS } from "@/data/doctors";
import { useAsia } from "@/lib/asia-i18n";
import { supabase } from "@/integrations/supabase/client";
import { useQuote } from "@/components/QuoteRequest";
import { DEMO_CHINA_DOCTORS } from "@/data/demoChinaDoctors";

type ManagedDoctor = { id:string; name:string; title:string; hospital:string; city:string; specialties:string[]; bio:string; photo_path:string|null };

const Doctors = () => {
  const { t, lang } = useAsia();
  const [q, setQ] = useState("");
  const [city, setCity] = useState<string>("all");
  const [spec, setSpec] = useState<string>("all");
  const [managedDoctors, setManagedDoctors] = useState<ManagedDoctor[]>([]);
  const { open } = useQuote();
  useEffect(()=>{supabase.from("doctors").select("id,name,title,hospital,city,specialties,bio,photo_path").eq("status","published").order("created_at",{ascending:false}).then(({data})=>{
    const chinaCities = ["shanghai", "beijing", "guangzhou", "hangzhou", "hainan", "上海", "北京", "广州", "杭州", "海南"];
    setManagedDoctors(((data??[]) as ManagedDoctor[]).filter((doctor)=>chinaCities.some((cityName)=>doctor.city?.toLowerCase().includes(cityName))));
  })},[]);

  const publicDoctors = useMemo(() => DOCTORS.filter(() => false), []);
  const directoryDoctors = managedDoctors.length > 0
    ? managedDoctors.map((doctor) => ({ ...doctor, demo: false as const, photo: doctor.photo_path ? supabase.storage.from("doctor-photos").getPublicUrl(doctor.photo_path).data.publicUrl : "" }))
    : DEMO_CHINA_DOCTORS.map((doctor) => ({ ...doctor, photo_path: null, credentials: null }));
  const cities = useMemo(() => {
    const set = new Map<string, string>();
    publicDoctors.forEach((d) => set.set(d.cityEn, d[lang === "zh" ? "cityZh" : "cityEn"]));
    return Array.from(set, ([key, label]) => ({ key, label }));
  }, [lang, publicDoctors]);

  const specialties = useMemo(() => {
    const set = new Map<string, string>();
    publicDoctors.forEach((d) =>
      d.specEn.forEach((s, i) => set.set(s, lang === "zh" ? d.specZh[i] ?? s : s)),
    );
    return Array.from(set, ([key, label]) => ({ key, label }));
  }, [lang, publicDoctors]);

  const items = useMemo(() => {
    return publicDoctors.filter((d) => {
      if (city !== "all" && d.cityEn !== city) return false;
      if (spec !== "all" && !d.specEn.includes(spec)) return false;
      if (!q.trim()) return true;
      const hay = `${d.en} ${d.zh} ${d.clinicEn} ${d.clinicZh} ${d.specEn.join(" ")} ${d.specZh.join(" ")}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [q, city, spec, publicDoctors]);

  return (
    <>
      <PageMeta
        title="Cosmetic Surgeons in China | Review Doctor Profiles"
        description="Review published cosmetic surgeon profiles in China, explore specialties, and book a free video consultation with English-language coordination support."
        path="/doctors"
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />

      <section className="container py-9 md:py-16">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="pill bg-accent text-accent-foreground mb-3">
            <Stethoscope className="size-3.5" /> {t("doctors.kicker")}
          </span>
          <h1 className="font-display text-[2.15rem] font-medium leading-[1.04] tracking-tight sm:text-4xl md:text-5xl">
            {t("doctors.title1")} <em className="text-primary not-italic">{t("doctors.titleEm")}</em>
          </h1>
          <p className="text-muted-foreground mt-3">
            {lang === "zh" ? "查看已发布的医生资料、擅长项目与任职机构。只有完成资料审核的内容才会标记为已核验。" : "Review published doctor profiles, specialties and hospital affiliations. Only information that completes our review is labeled verified."}
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
        {specialties.length > 0 && <div className="mb-3">
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
        </div>}

        {/* City filter */}
        {cities.length > 0 && <div className="mb-10">
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
        </div>}

        {directoryDoctors.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-5 font-display text-2xl">{managedDoctors.length > 0 ? (lang === "zh" ? "已发布的中国医生" : "Published doctors in China") : (lang === "zh" ? "中国医生展示样例" : "Sample China doctor profiles")}</h2>
            <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {directoryDoctors.map((d) => {
                const photo = d.photo;
                return (
                  <article key={d.id} className="flex min-h-0 flex-col rounded-3xl bg-card p-5 shadow-pop transition hover:shadow-glow md:min-h-[25rem] md:p-6">
                    <div className="flex gap-4">
                      {photo
                        ? <img src={photo} alt={d.name} className="size-28 shrink-0 rounded-full border-2 border-primary/15 object-cover md:size-24" />
                        : <div className="grid size-28 shrink-0 place-items-center rounded-full bg-muted md:size-24"><Stethoscope /></div>}
                      <div className="min-w-0">
                        <h3 className="font-display text-xl font-semibold leading-tight">{d.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{d.title}</p>
                        <p className="mt-2 text-xs text-muted-foreground"><MapPin className="mr-1 inline size-3" />{d.city}</p>
                        {d.demo && <span className="mt-2 inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-accent-foreground">Sample profile</span>}
                      </div>
                    </div>
                    <p className="mt-5 text-sm text-muted-foreground"><Building2 className="mr-1 inline size-4 text-primary" />{d.hospital}</p>
                    {d.bio && <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{d.bio}</p>}
                    <div className="mt-4 flex flex-wrap gap-1.5">{d.specialties.map((s) => <span key={s} className="rounded-full bg-accent px-2.5 py-1 text-[11px]">{s}</span>)}</div>
                    <div className="mt-auto grid gap-2 pt-6 min-[430px]:grid-cols-[0.9fr_1.1fr]">
                      <Link to={d.demo ? "/doctors" : `/doctors/profile/${d.id}`} className="flex min-h-12 items-center justify-center rounded-xl border border-primary/30 px-3 py-3 text-center text-xs font-semibold text-primary hover:bg-primary/10">
                        {lang === "zh" ? "医生与案例" : "Doctor & cases"}
                      </Link>
                      <button type="button" onClick={() => open({ doctorName: d.name, city: d.city })} className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-3 text-center text-[13px] font-semibold leading-tight text-primary-foreground hover:bg-primary/90">
                        {lang === "zh" ? "预约免费视频咨询" : "Book free consultation"}<ArrowRight className="size-4" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-12 text-sm">
            {lang === "zh" ? "医生资料正在审核中。你仍可预约免费视频咨询，我们会根据需求协助匹配。" : "Doctor profiles are currently under review. You can still book a free video consultation and we will help identify suitable options."}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((d) => (
              <article
                key={d.id}
                className="group flex min-h-[34rem] flex-col rounded-3xl bg-card p-5 shadow-pop transition hover:shadow-glow sm:p-6 md:min-h-[37rem]"
              >
                <div className="flex items-center gap-4">
                  <img src={d.img} alt={lang === "zh" ? d.zh : d.en} className="size-24 shrink-0 rounded-full border-2 border-primary/15 object-cover transition-transform duration-500 group-hover:scale-105" />
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

                <div className="mt-auto grid gap-2 pt-6 min-[430px]:grid-cols-[0.9fr_1.1fr]">
                  <Link to={`/doctors/${d.id}`} className="flex min-h-12 items-center justify-center rounded-xl border border-primary/30 bg-card px-3 py-3 text-center text-xs font-semibold text-primary transition hover:bg-primary/10">
                    {lang === "zh" ? "医生与案例" : "Doctor & cases"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => open({ doctorName: lang === "zh" ? d.zh : d.en, city: lang === "zh" ? d.cityZh : d.cityEn })}
                    className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-3 text-center text-[13px] font-semibold leading-tight text-primary-foreground transition hover:bg-primary/90"
                  >
                    {lang === "zh" ? "预约免费视频咨询" : "Book a Free Video Consultation"}<ArrowRight className="size-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <aside className="mt-10 overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-r from-[hsl(158,58%,90%)] via-[hsl(145,48%,91%)] to-[hsl(50,80%,91%)] px-5 py-7 shadow-soft sm:mt-14 sm:px-8 sm:py-9 md:flex md:items-center md:justify-between md:gap-8">
          <div className="max-w-2xl">
            <span className="pill bg-card/80 text-accent-foreground shadow-soft">
              <MessageCircle className="size-3.5 text-primary" />
              {lang === "zh" ? "免费匹配建议" : lang === "ru" ? "Бесплатная помощь с выбором" : "Free matching guidance"}
            </span>
            <h2 className="mt-4 font-display text-[1.9rem] font-medium leading-[1.05] tracking-tight sm:text-4xl">
              {lang === "zh" ? "不确定哪位医生更适合你？" : lang === "ru" ? "Не уверены, какой врач вам подходит?" : "Not sure which doctor is right for you?"}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {lang === "zh"
                ? "告诉我们你在考虑的项目、预算和城市，我们会帮助你缩小选择范围。"
                : lang === "ru"
                  ? "Расскажите нам о желаемой процедуре, бюджете и городе — мы поможем сузить выбор."
                  : "Tell us what you’re considering, your budget and preferred city, and we’ll help you narrow down suitable options."}
            </p>
          </div>
          <a
            href="https://wa.me/14708613825?text=Hi%20Cosmetics%20Asia%2C%20I%20would%20like%20help%20choosing%20a%20doctor."
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-pop transition hover:-translate-y-0.5 hover:bg-primary/90 md:mt-0 md:w-auto md:min-w-44 md:rounded-full"
          >
            {lang === "zh" ? "联系我们" : lang === "ru" ? "Связаться с нами" : "Contact us"}
            <ArrowRight className="size-4" />
          </a>
        </aside>
      </section>

      <Footer />
      </div>
    </>
  );
};

export default Doctors;

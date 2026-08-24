import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search, Filter, Stethoscope, BadgeCheck, Building2, FileCheck2, Star, ArrowRight, MapPin, MessageCircle, Navigation,
} from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { DOCTORS } from "@/data/doctors";
import { useAsia } from "@/lib/asia-i18n";
import { supabase } from "@/integrations/supabase/client";
import { signedUrls } from "@/lib/storage-urls";

import { DEMO_CHINA_DOCTORS } from "@/data/demoChinaDoctors";
import { CITIES } from "@/data/cities";
import { asiaCopy } from "@/lib/asia-copy";
import QuoteCtaButton from "@/components/QuoteCtaButton";
import { Highlight } from "@/components/HighlightText";
import { Pagination, SortChips } from "@/components/ListControls";
import { cityCoordsOf, haversineKm, useUserLocation } from "@/lib/geo";

const PAGE_SIZE = 9;

type ManagedDoctor = { id:string; name:string; title:string; hospital:string; city:string; specialties:string[]; bio:string; photo_path:string|null; photo?:string; created_at?:string };
type DirectoryDoctor = ManagedDoctor & { demo?: boolean };

const Experts = () => {
  const { t, lang } = useAsia();
  const c = <T,>(en: T, zh: T, ru: T) => asiaCopy(lang, { en, zh, ru });
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState("");
  // 支持从城市搜索跳转进来时预选城市（/doctors?city=Seoul）
  const [city, setCity] = useState<string>(() => searchParams.get("city") || "all");
  const [spec, setSpec] = useState<string>("all");
  const [managedDoctors, setManagedDoctors] = useState<ManagedDoctor[]>([]);
  
  useEffect(()=>{supabase.from("doctors").select("id,name,title,hospital,city,specialties,bio,photo_path,created_at").eq("status","published").order("created_at",{ascending:false}).then(async ({data})=>{
    const chinaCities = ["shanghai", "beijing", "guangzhou", "hangzhou", "hainan", "上海", "北京", "广州", "杭州", "海南"];
    const rows = ((data??[]) as ManagedDoctor[]).filter((doctor)=>chinaCities.some((cityName)=>doctor.city?.toLowerCase().includes(cityName)));
    const photos = await signedUrls("doctor-photos", rows.map((doctor)=>doctor.photo_path));
    setManagedDoctors(rows.map((doctor, index)=>({ ...doctor, photo: photos[index] })));
  })},[]);

  const publicDoctors = useMemo(() => DOCTORS.filter(() => false), []);
  const directoryDoctors: DirectoryDoctor[] = managedDoctors.length > 0
    ? managedDoctors.map((doctor) => ({ ...doctor, demo: false, photo: doctor.photo ?? "" }))
    : DEMO_CHINA_DOCTORS.map((doctor) => ({ ...doctor, photo_path: null, credentials: null }) as DirectoryDoctor);
  const cities = useMemo(() => {
    const set = new Map<string, string>();
    publicDoctors.forEach((d) => set.set(d.cityEn, d[lang === "zh" ? "cityZh" : "cityEn"]));
    directoryDoctors.forEach((d) => { if (d.city) set.set(d.city, d.city); });
    return Array.from(set, ([key, label]) => ({ key, label }));
  }, [lang, publicDoctors, directoryDoctors]);

  /** 专家资料里的城市是自由文本，匹配时同时认英文名与中文名 */
  const matchesCity = (docCity: string | undefined, filter: string) => {
    if (!docCity) return false;
    const f = filter.trim().toLowerCase();
    const dc = docCity.trim().toLowerCase();
    if (dc === f || dc.includes(f) || f.includes(dc)) return true;
    const known = CITIES.find((x) => x.en.toLowerCase() === f || x.zh === filter.trim());
    return Boolean(known && (docCity.trim() === known.zh || dc === known.en.toLowerCase()));
  };

  const visibleDirectoryDoctors = useMemo(() => {
    const query = q.trim().toLowerCase();
    return directoryDoctors.filter((d) => {
      if (city !== "all" && !matchesCity(d.city, city)) return false;
      if (!query) return true;
      const hay = `${d.name} ${d.title} ${d.hospital} ${d.city} ${d.specialties.join(" ")} ${d.bio ?? ""}`.toLowerCase();
      return hay.includes(query);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [directoryDoctors, city, q]);

  // —— 排序：推荐 / 热度 / 最新入驻 / 距离 ——
  const [sort, setSort] = useState("recommended");
  const { coords, status: locStatus, request: requestLocation } = useUserLocation();

  // 选中「距离」时才请求浏览器定位
  useEffect(() => {
    if (sort === "distance" && locStatus === "idle") requestLocation();
  }, [sort, locStatus, requestLocation]);

  const sortedDoctors = useMemo(() => {
    const arr = [...visibleDirectoryDoctors];
    if (sort === "hot") {
      // 已发布的真实专家排在示例资料前
      arr.sort((a, b) => Number(!b.demo) - Number(!a.demo));
    } else if (sort === "latest") {
      arr.sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));
    } else if (sort === "distance" && coords) {
      const dist = (d: DirectoryDoctor) => {
        const cc = cityCoordsOf(d.city);
        return cc ? haversineKm(coords, cc) : Number.POSITIVE_INFINITY;
      };
      arr.sort((a, b) => dist(a) - dist(b));
    }
    return arr;
  }, [visibleDirectoryDoctors, sort, coords]);

  // —— 分页 ——
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [q, city, spec, sort]);
  const totalPages = Math.max(1, Math.ceil(sortedDoctors.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedDoctors = useMemo(
    () => sortedDoctors.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [sortedDoctors, safePage],
  );

  // —— 按城市动态生成 SEO meta（?city=Seoul 分享时标题/摘要/图都对应该城市）——
  const activeCityMeta = useMemo(
    () => (city === "all" ? undefined : CITIES.find((x) => x.en.toLowerCase() === city.toLowerCase() || x.zh === city)),
    [city],
  );
  const cityLabel = activeCityMeta ? (lang === "zh" ? activeCityMeta.zh : activeCityMeta.en) : city;

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
        title={city !== "all" ? `${cityLabel} Cosmetic Surgeons — Verified Profiles` : "Verified Cosmetic Surgeons in Asia"}
        description={city !== "all"
          ? `Review verified cosmetic surgeons in ${cityLabel}: compare specialties, credentials and patient reviews, and book a free consultation with English-language coordination.`
          : "Review verified surgeon profiles across Asia, compare specialties and credentials, and book a free consultation with English-language coordination."}
        path={city !== "all" ? `/doctors?city=${encodeURIComponent(city)}` : "/doctors"}
        image={activeCityMeta?.img}
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
        </div>

        <div className="bg-card rounded-3xl p-2 shadow-pop flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto mb-6">
          <div className="flex-1 px-5 py-3 flex items-center gap-3">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full bg-transparent outline-none text-sm font-medium"
              placeholder={c("Search by name, clinic or specialty…", "搜索专家、机构或擅长项目…", "Поиск по имени, клинике или специализации…")}
            />
          </div>
        </div>

        {/* Procedure filter */}
        {specialties.length > 0 && <div className="mb-3">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold text-center mb-2">
            {c("Procedure", "手术类型", "Процедура")}
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
            {c("City", "城市", "Город")}
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
            <h2 className="mb-4 font-display text-2xl">{managedDoctors.length > 0 ? c("Published doctors", "已发布专家", "Опубликованные эксперты") : c("Sample doctor profiles", "专家展示样例", "Примеры профилей экспертов")}</h2>
            <div className="mb-5">
              <SortChips
                label={c("Sort", "排序", "Сортировка")}
                value={sort}
                onChange={setSort}
                options={[
                  { key: "recommended", label: c("Recommended", "推荐", "Рекомендуемые") },
                  { key: "hot", label: c("Most popular", "热度最高", "Популярные") },
                  { key: "latest", label: c("Newest", "最新入驻", "Новые") },
                  { key: "distance", label: c("Nearest", "距离最近", "Ближайшие") },
                ]}
              />
              {sort === "distance" && (
                <p className="mt-2 flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
                  <Navigation className="size-3" />
                  {locStatus === "locating"
                    ? c("Locating…", "正在获取定位…", "Определяем местоположение…")
                    : locStatus === "denied"
                      ? c("Location unavailable — showing default order.", "无法获取定位，已按默认顺序展示。", "Геолокация недоступна — показан обычный порядок.")
                      : c("Sorted by distance from you.", "已按与你的距离排序。", "Отсортировано по расстоянию от вас.")}
                </p>
              )}
            </div>
            {visibleDirectoryDoctors.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-border bg-card/60 px-6 py-8 text-center text-sm text-muted-foreground">
                {c("No experts in this city yet — try another city or ask us for a match.", "该城市暂无专家资料 —— 换个城市试试，或让我们帮你匹配。", "В этом городе пока нет экспертов — попробуйте другой город или напишите нам.")}
              </p>
            ) : (
            <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {pagedDoctors.map((d) => {
                const photo = d.photo;
                return (
                  <article key={d.id} className="flex min-h-0 flex-col rounded-3xl bg-card p-5 shadow-pop transition hover:shadow-glow md:min-h-[25rem] md:p-6">
                    <div className="flex gap-4">
                      {photo
                        ? <img src={photo} alt={d.name} className="size-28 shrink-0 rounded-full border-2 border-primary/15 object-cover md:size-24" />
                        : <div className="grid size-28 shrink-0 place-items-center rounded-full bg-muted md:size-24"><Stethoscope /></div>}
                      <div className="min-w-0">
                        <h3 className="font-display text-xl font-semibold leading-tight"><Highlight text={d.name} query={q} /></h3>
                        <p className="mt-1 text-xs text-muted-foreground"><Highlight text={d.title} query={q} /></p>
                        <p className="mt-2 text-xs text-muted-foreground"><MapPin className="mr-1 inline size-3" /><Highlight text={d.city} query={q} /></p>
                        {d.demo && <span className="mt-2 inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-accent-foreground">{c("Sample profile", "示例资料", "Демо-профиль")}</span>}
                      </div>
                    </div>
                    <p className="mt-5 text-sm text-muted-foreground"><Building2 className="mr-1 inline size-4 text-primary" /><Highlight text={d.hospital} query={q} /></p>
                    {d.bio && <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground"><Highlight text={d.bio} query={q} /></p>}
                    <div className="mt-4 flex flex-wrap gap-1.5">{d.specialties.map((s) => <span key={s} className="rounded-full bg-accent px-2.5 py-1 text-[11px]"><Highlight text={s} query={q} /></span>)}</div>
                    <div className="mt-auto grid gap-2 pt-6 min-[430px]:grid-cols-[0.9fr_1.1fr]">
                      <Link to={d.demo ? "/doctors" : `/doctors/profile/${d.id}`} className="flex min-h-12 items-center justify-center rounded-xl border border-primary/30 px-3 py-3 text-center text-xs font-semibold text-primary hover:bg-primary/10">
                        {c("Expert & cases", "专家与案例", "Эксперт и истории пациентов")}
                      </Link>
                      <QuoteCtaButton quoteCtx={{ doctorName: d.name, city: d.city }} className="min-h-12 rounded-xl px-3 py-3 text-center text-[13px] leading-tight" />
                    </div>
                  </article>
                );
              })}
            </div>
            )}
            {visibleDirectoryDoctors.length > 0 && (
              <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
            )}
          </div>
        )}

        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-12 text-sm">
            {c("Expert profiles are currently under review. You can still book a free video consultation and we will help identify suitable options.", "专家资料正在审核中。你仍可预约免费视频咨询，我们会根据需求协助匹配。", "Профили экспертов проходят проверку. Вы можете записаться на бесплатную видеоконсультацию, а мы поможем подобрать подходящие варианты.")}
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
                    {c("Procedures", "手术类型", "Процедуры")}
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
                    {c("Expert & cases", "专家与案例", "Эксперт и истории пациентов")}
                  </Link>
                  <QuoteCtaButton
                    quoteCtx={{ doctorName: lang === "zh" ? d.zh : d.en, city: lang === "zh" ? d.cityZh : d.cityEn }}
                    className="min-h-12 w-full rounded-xl px-3 py-3 text-[13px] leading-tight"
                  />
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
              {lang === "zh" ? "不确定哪位专家更适合你？" : lang === "ru" ? "Не уверены, какой эксперт вам подходит?" : "Not sure which expert is right for you?"}
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
            className="cta-primary mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition md:mt-0 md:w-auto md:min-w-44 md:rounded-full"
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

export default Experts;

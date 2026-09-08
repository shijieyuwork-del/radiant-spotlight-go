import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search, Filter, Stethoscope, ArrowRight, MapPin, MessageCircle, Navigation,
} from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { useAsia } from "@/lib/asia-i18n";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";
import { localizeDoctorRow } from "@/lib/i18n-content";
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
  const c = <T,>(en: T, zh: T, ru: T, es?: T) => asiaCopy(lang, { en, zh, ru, es });
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState(() => searchParams.get("q") ?? "");
  // 支持从城市搜索跳转进来时预选城市（/doctors?city=Seoul）
  const [city, setCity] = useState<string>(() => searchParams.get("city") || "all");
  const [managedDoctors, setManagedDoctors] = useState<ManagedDoctor[]>([]);
  const [directoryStatus, setDirectoryStatus] = useState<"loading" | "ready" | "error">("loading");
  const requestId = useRef(0);

  const loadManagedDoctors = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setDirectoryStatus("loading");
    try {
      const { data, error } = await supabase.from("doctors")
        .select("id,name,title,hospital,city,specialties,bio,photo_path,created_at,i18n")
        .eq("status", "published").order("created_at", { ascending: false });
      if (error) throw error;
      const chinaCities = ["shanghai", "beijing", "guangzhou", "hangzhou", "hainan", "上海", "北京", "广州", "杭州", "海南"];
      const rows = ((data ?? []) as unknown as ManagedDoctor[])
        .filter((doctor) => chinaCities.some((cityName) => doctor.city?.toLowerCase().includes(cityName)));
      const photos = await signedUrls("doctor-photos", rows.map((doctor) => doctor.photo_path));
      if (currentRequest !== requestId.current) return;
      setManagedDoctors(rows.map((doctor, index) => localizeDoctorRow({ ...doctor, photo: photos[index] }, lang)));
      setDirectoryStatus("ready");
    } catch {
      if (currentRequest === requestId.current) setDirectoryStatus("error");
    }
  }, [lang]);
  useEffect(() => {
    void loadManagedDoctors();
    return () => { requestId.current += 1; };
  }, [loadManagedDoctors]);
  useRealtimeRefresh(["doctors"], loadManagedDoctors);

  const directoryDoctors = useMemo<DirectoryDoctor[]>(() => {
    if (directoryStatus !== "ready") return [];
    return managedDoctors.length > 0
      ? managedDoctors.map((doctor) => ({ ...doctor, demo: false, photo: doctor.photo ?? "" }))
      : DEMO_CHINA_DOCTORS.map((doctor) => ({ ...doctor, photo_path: null }));
  }, [managedDoctors, directoryStatus]);
  const cities = useMemo(() => {
    const set = new Map<string, string>();
    directoryDoctors.forEach((d) => { if (d.city) set.set(d.city, d.city); });
    return Array.from(set, ([key, label]) => ({ key, label }));
  }, [directoryDoctors]);

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
      const hay = `${d.name} ${d.title} ${d.city} ${d.specialties.join(" ")} ${d.bio ?? ""}`.toLowerCase();
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
  }, [q, city, sort]);
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



  return (
    <>
      <PageMeta
        title={city !== "all" ? `${cityLabel} Cosmetic Experts — Published Profiles` : "Cosmetic Expert Profiles in Asia"}
        description={city !== "all"
          ? `Explore published cosmetic expert profiles in ${cityLabel}, compare listed specialties and credentials, and ask about English-language coordination.`
          : "Explore published cosmetic expert profiles across Asia, compare listed specialties and credentials, and ask about English-language coordination."}
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
            {t("doctors.title1")} <em className="text-brand not-italic">{t("doctors.titleEm")}</em>
          </h1>
        </div>

        <div className="bg-card rounded-3xl p-2 shadow-pop flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto mb-6">
          <div className="flex-1 px-5 py-3 flex items-center gap-3">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full bg-transparent text-base font-medium outline-none sm:text-sm"
              placeholder={c("Search by name or specialty…", "搜索专家或擅长项目…", "Поиск по имени или специализации…", "Buscar por nombre o especialidad…")}
            />
          </div>
        </div>

        {/* City filter */}
        {cities.length > 0 && <div className="mb-10">
          <p className="text-label uppercase tracking-wider text-muted-foreground font-semibold text-center mb-2">
            {c("City", "城市", "Город", "Ciudad")}
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

        <div className="mb-10" data-testid="doctor-directory-results">
            {directoryStatus === "ready" && visibleDirectoryDoctors.length > 0 && <h2 className="mb-4 font-display text-2xl">{managedDoctors.length > 0 ? c("Published doctors", "已发布专家", "Опубликованные эксперты", "Expertos publicados") : c("Sample doctor profiles", "专家展示样例", "Примеры профилей экспертов", "Perfiles de expertos de muestra")}</h2>}
            {directoryStatus === "ready" && visibleDirectoryDoctors.length > 0 && <div className="mb-5">
              <SortChips
                label={c("Sort", "排序", "Сортировка", "Ordenar")}
                value={sort}
                onChange={setSort}
                options={[
                  { key: "recommended", label: c("Recommended", "推荐", "Рекомендуемые", "Recomendado") },
                  { key: "hot", label: c("Most popular", "热度最高", "Популярные", "Más popular") },
                  { key: "latest", label: c("Newest", "最新入驻", "Новые", "Más reciente") },
                  { key: "distance", label: c("Nearest", "距离最近", "Ближайшие", "Más cercano") },
                ]}
              />
              {sort === "distance" && (
                <p className="mt-2 flex items-center justify-center gap-1 text-label text-muted-foreground">
                  <Navigation className="size-3" />
                  {locStatus === "locating"
                    ? c("Locating…", "正在获取定位…", "Определяем местоположение…", "Localizando…")
                    : locStatus === "denied"
                      ? c("Location unavailable — showing default order.", "无法获取定位，已按默认顺序展示。", "Геолокация недоступна — показан обычный порядок.", "Ubicación no disponible — mostrando el orden predeterminado.")
                      : c("Sorted by distance from you.", "已按与你的距离排序。", "Отсортировано по расстоянию от вас.", "Ordenado por distancia desde tu ubicación.")}
                </p>
              )}
            </div>}
            {directoryStatus === "loading" ? (
              <div role="status" className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3" aria-busy="true">
                <span className="sr-only">{c("Loading expert profiles…", "正在加载专家资料…", "Загрузка профилей экспертов…", "Cargando perfiles de expertos…")}</span>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="min-h-[20rem] animate-pulse rounded-3xl bg-card p-6 shadow-pop md:min-h-[25rem]">
                    <div className="flex gap-4">
                      <div className="size-24 shrink-0 rounded-full bg-muted" />
                      <div className="flex-1 space-y-2 pt-2">
                        <div className="h-4 w-2/3 rounded bg-muted" />
                        <div className="h-3 w-1/2 rounded bg-muted" />
                      </div>
                    </div>
                    <div className="mt-6 space-y-2">
                      <div className="h-3 w-full rounded bg-muted" />
                      <div className="h-3 w-4/5 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : directoryStatus === "error" ? (
              <div role="alert" className="rounded-3xl border border-border bg-card px-6 py-8 text-center text-foreground">
                <h2 className="font-display text-2xl">{c("Expert profiles are unavailable", "暂时无法加载专家资料", "Профили экспертов недоступны", "Los perfiles de expertos no están disponibles")}</h2>
                <p className="mt-2 text-sm">{c("We couldn't load the directory. Please try again.", "专家列表加载失败，请重试。", "Не удалось загрузить список. Попробуйте ещё раз.", "No pudimos cargar el directorio. Inténtalo de nuevo.")}</p>
                <Button className="mt-4" onClick={() => void loadManagedDoctors()}>{c("Try again", "重试", "Попробовать снова", "Reintentar")}</Button>
              </div>
            ) : visibleDirectoryDoctors.length === 0 ? (
              <div role="status" className="rounded-3xl border border-dashed border-border bg-card/60 px-6 py-8 text-center text-foreground">
                <h2 className="font-display text-2xl">{c("No matching expert profiles", "没有匹配的专家资料", "Подходящие профили не найдены", "No hay perfiles que coincidan")}</h2>
                <p className="mt-2 text-sm">{c("Try a different name, specialty or city.", "试试其他姓名、擅长项目或城市。", "Попробуйте другое имя, специализацию или город.", "Prueba otro nombre, especialidad o ciudad.")}</p>
                <Button variant="outline" className="mt-4" onClick={() => { setQ(""); setCity("all"); }}>{c("Clear filters", "清除筛选", "Сбросить фильтры", "Borrar filtros")}</Button>
              </div>
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
                        {d.demo && <span className="mt-2 inline-flex rounded-full bg-accent px-2.5 py-1 text-label font-semibold text-accent-foreground">{c("Sample profile", "示例资料", "Демо-профиль", "Perfil de muestra")}</span>}
                      </div>
                    </div>
                    {d.hospital && <p className="mt-3 text-sm font-medium text-foreground">{d.hospital}</p>}
                    {d.bio && <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground"><Highlight text={d.bio} query={q} /></p>}
                    <div className="mt-4 flex flex-wrap gap-1.5">{d.specialties.map((s) => <span key={s} className="rounded-full bg-accent px-2.5 py-1 text-label"><Highlight text={s} query={q} /></span>)}</div>
                    <div className="mt-auto grid gap-2 pt-6 min-[430px]:grid-cols-[0.9fr_1.1fr]">
                      <Link to={d.demo ? `/doctors/demo/${d.id}` : `/doctors/profile/${d.id}`} className="flex min-h-12 items-center justify-center rounded-xl border border-primary/30 px-3 py-3 text-center text-xs font-semibold text-brand hover:bg-primary/10">
                        {c("Expert & cases", "专家与案例", "Эксперт и истории пациентов", "Experto y casos")}
                      </Link>
                      <QuoteCtaButton quoteCtx={{ doctorName: d.name, city: d.city }} className="min-h-12 rounded-xl px-3 py-3 text-center text-[13px] leading-tight" data-testid="doctor-card-cta" />
                    </div>
                  </article>
                );
              })}
            </div>
            )}
            {directoryStatus === "ready" && visibleDirectoryDoctors.length > 0 && (
              <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
            )}
        </div>

        <aside className="mt-10 overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-r from-[hsl(158,58%,90%)] via-[hsl(145,48%,91%)] to-[hsl(50,80%,91%)] px-5 py-7 shadow-soft sm:mt-14 sm:px-8 sm:py-9 md:flex md:items-center md:justify-between md:gap-8">
          <div className="max-w-2xl">
            <span className="pill bg-card/80 text-accent-foreground shadow-soft">
              <MessageCircle className="size-3.5 text-primary" />
              {lang === "zh" ? "免费匹配建议" : lang === "ru" ? "Бесплатная помощь с выбором" : lang === "es" ? "Orientación gratuita para elegir" : "Free matching guidance"}
            </span>
            <h2 className="mt-4 font-display text-[1.9rem] font-medium leading-[1.05] tracking-tight sm:text-4xl">
              {lang === "zh" ? "不确定哪位专家更适合你？" : lang === "ru" ? "Не уверены, какой эксперт вам подходит?" : lang === "es" ? "¿No sabes qué experto es el adecuado para ti?" : "Not sure which expert is right for you?"}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {lang === "zh"
                ? "告诉我们你在考虑的项目、预算和城市，我们会帮助你缩小选择范围。"
                : lang === "ru"
                  ? "Расскажите нам о желаемой процедуре, бюджете и городе — мы поможем сузить выбор."
                  : lang === "es"
                    ? "Cuéntanos qué procedimiento, presupuesto y ciudad tienes en mente, y te ayudaremos a reducir las opciones."
                    : "Tell us what you’re considering, your budget and preferred city, and we’ll help you narrow down suitable options."}
            </p>
          </div>
          <a
            href="https://wa.me/14708613825?text=Hi%20CeladonChina%2C%20I%20would%20like%20help%20choosing%20a%20doctor."
            target="_blank"
            rel="noreferrer"
            className="cta-primary mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition md:mt-0 md:w-auto md:min-w-44 md:rounded-full"
          >
            {lang === "zh" ? "获取免费匹配建议" : lang === "ru" ? "Получить бесплатную помощь" : lang === "es" ? "Obtener orientación gratuita" : "Get free matching guidance"}
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

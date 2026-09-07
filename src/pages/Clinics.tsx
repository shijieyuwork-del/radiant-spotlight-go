import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, BadgeCheck, Building2, MapPin, Search, ShieldCheck, X } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { CITIES, COUNTRY_BY_CITY, COUNTRY_META } from "@/data/cities";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";
import { localizedField } from "@/lib/i18n-content";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";

const normalize = (value: string) => value.trim().toLocaleLowerCase();

type PublishedClinicRow = {
  city: string;
  hospital: string;
  i18n: unknown;
};

type DirectoryFacility = {
  area: string;
  key: string;
  primary: string;
  published: boolean;
  secondary: string;
};

const Clinics = () => {
  const { lang } = useAsia();
  const c = <T,>(en: T, zh: T, ru: T, es?: T) => asiaCopy(lang, { en, zh, ru, es });
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const country = searchParams.get("country") ?? "all";
  const [publishedClinics, setPublishedClinics] = useState<PublishedClinicRow[]>([]);

  const loadPublishedClinics = useCallback(() => {
    void supabase
      .from("doctors")
      .select("hospital,city,i18n")
      .eq("status", "published")
      .then(({ data }) => {
        const unique = new Map<string, PublishedClinicRow>();
        for (const row of data ?? []) {
          if (!row.hospital?.trim() || !row.city?.trim()) continue;
          unique.set(`${normalize(row.hospital)}:${normalize(row.city)}`, row as PublishedClinicRow);
        }
        setPublishedClinics(Array.from(unique.values()));
      });
  }, []);

  useEffect(() => {
    loadPublishedClinics();
  }, [loadPublishedClinics]);
  useRealtimeRefresh(["doctors"], loadPublishedClinics);

  const countryOptions = useMemo(() => {
    const codes = Array.from(new Set(CITIES.map((city) => COUNTRY_BY_CITY[city.slug]).filter(Boolean)));
    return codes.map((code) => ({ code, ...COUNTRY_META[code] }));
  }, []);

  const directory = useMemo(() => CITIES.map((city) => {
    const hospitals: DirectoryFacility[] = city.hospitals.map((hospital) => ({
      area: lang === "zh" ? hospital.areaZh : hospital.areaEn,
      key: `guide:${city.slug}:${hospital.en}`,
      primary: lang === "zh" ? hospital.zh : hospital.en,
      published: false,
      secondary: lang === "zh" ? hospital.en : hospital.zh,
    }));

    for (const row of publishedClinics) {
      const rowCity = normalize(row.city);
      if (![normalize(city.en), normalize(city.zh)].some((name) => rowCity.includes(name) || name.includes(rowCity))) continue;
      const primary = localizedField(row.i18n, "hospital", lang, row.hospital);
      const secondaryLanguage = lang === "zh" ? "en" : "zh";
      const secondary = localizedField(row.i18n, "hospital", secondaryLanguage, row.hospital);
      const alreadyListed = hospitals.some((hospital) =>
        [hospital.primary, hospital.secondary].some((name) => normalize(name) === normalize(primary) || normalize(name) === normalize(row.hospital)),
      );
      if (!alreadyListed) {
        hospitals.unshift({
          area: lang === "zh" ? city.zh : city.en,
          key: `published:${city.slug}:${row.hospital}`,
          primary,
          published: true,
          secondary: secondary === primary ? "" : secondary,
        });
      }
    }

    return { city, hospitals };
  }), [lang, publishedClinics]);

  const filteredCities = useMemo(() => {
    const term = normalize(query);
    return directory.map(({ city, hospitals: cityHospitals }) => {
      const countryCode = COUNTRY_BY_CITY[city.slug];
      const countryMeta = COUNTRY_META[countryCode];
      if (country !== "all" && countryCode !== country) return null;

      const hospitals = cityHospitals.filter((hospital) => {
        if (!term) return true;
        const searchable = [
          hospital.primary,
          hospital.secondary,
          hospital.area,
          city.en,
          city.zh,
          countryMeta?.en,
          countryMeta?.zh,
        ].join(" ").toLocaleLowerCase();
        return searchable.includes(term);
      });

      return hospitals.length > 0 ? { city, hospitals, countryCode, countryMeta } : null;
    }).filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  }, [country, directory, query]);

  const visibleCount = filteredCities.reduce((total, entry) => total + entry.hospitals.length, 0);
  const updateFilter = (key: "q" | "country", value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => setSearchParams({}, { replace: true });

  return (
    <>
      <PageMeta
        title="Clinic & Hospital Directory in Asia"
        description="Browse clinics and hospitals currently included in CeladonChina destination guides, organized by city and country."
        path="/clinics"
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />
        <main>
          <section className="container pb-20 pt-6 md:pt-10" aria-labelledby="clinic-directory-title">
            <div className="sticky top-[6.25rem] z-30 rounded-3xl border border-border/70 bg-background/95 p-3 shadow-soft backdrop-blur-xl md:top-[6.1rem] md:p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <label className="relative block min-w-0 flex-1">
                  <span className="sr-only">
                    {c("Search clinics, cities or districts", "搜索诊所、城市或地区", "Поиск клиник, городов или районов", "Buscar clínicas, ciudades o distritos")}
                  </span>
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => updateFilter("q", event.target.value)}
                    placeholder={c("Search a clinic, city or district…", "搜索诊所、城市或地区…", "Клиника, город или район…", "Clínica, ciudad o distrito…")}
                    className="min-h-12 w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0" aria-label={c("Filter by country", "按国家筛选", "Фильтр по стране", "Filtrar por país")}>
                  <Button
                    type="button"
                    size="sm"
                    variant={country === "all" ? "default" : "outline"}
                    className="min-h-10 shrink-0 rounded-full px-4"
                    onClick={() => updateFilter("country", "all")}
                  >
                    {c("All", "全部", "Все", "Todos")}
                  </Button>
                  {countryOptions.map((option) => (
                    <Button
                      key={option.code}
                      type="button"
                      size="sm"
                      variant={country === option.code ? "default" : "outline"}
                      className="min-h-10 shrink-0 rounded-full px-4"
                      onClick={() => updateFilter("country", option.code)}
                    >
                      <span aria-hidden="true">{option.flag}</span>
                      {c(option.en, option.zh, option.ru, option.es)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                  {c("All listed facilities", "全部收录机构", "Все учреждения", "Todos los centros")}
                </p>
                <h2 id="clinic-directory-title" className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">
                  {c(
                    `${visibleCount} ${visibleCount === 1 ? "facility" : "facilities"} across ${filteredCities.length} ${filteredCities.length === 1 ? "destination" : "destinations"}`,
                    `${visibleCount} 家机构，覆盖 ${filteredCities.length} 个目的地`,
                    `${visibleCount} учреждений в ${filteredCities.length} направлениях`,
                    `${visibleCount} centros en ${filteredCities.length} destinos`,
                  )}
                </h2>
              </div>
              {(query || country !== "all") && (
                <Button type="button" variant="ghost" className="w-fit rounded-full" onClick={clearFilters}>
                  <X className="mr-2 size-4" />
                  {c("Clear filters", "清除筛选", "Сбросить фильтры", "Borrar filtros")}
                </Button>
              )}
            </div>

            {filteredCities.length === 0 ? (
              <div role="status" className="mt-8 rounded-3xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
                <Building2 className="mx-auto size-9 text-primary" />
                <h3 className="mt-4 font-display text-2xl">
                  {c("No matching facility", "没有找到匹配的机构", "Учреждения не найдены", "No se encontraron centros")}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  {c("Try another clinic name, city or country.", "请尝试其他诊所名称、城市或国家。", "Попробуйте другое название, город или страну.", "Prueba con otro nombre, ciudad o país.")}
                </p>
                <Button type="button" className="mt-5 rounded-full" onClick={clearFilters}>
                  {c("Show all clinics", "显示全部诊所", "Показать все клиники", "Ver todas las clínicas")}
                </Button>
              </div>
            ) : (
              <div className="mt-8 divide-y divide-border/80 border-y border-border/80">
                {filteredCities.map(({ city, hospitals, countryMeta }) => (
                  <article key={city.slug} className="grid gap-6 py-8 lg:grid-cols-[17rem_1fr] lg:gap-10 lg:py-10">
                    <div>
                      <Link to={`/cities/${city.slug}`} className="group block overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                        <div className="relative aspect-[16/9] overflow-hidden bg-muted lg:aspect-[4/3]">
                          <img
                            src={city.img}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-transparent to-transparent" />
                          <div className="absolute inset-x-4 bottom-4 text-white">
                            <span className="text-xs font-semibold text-white/75">
                              {countryMeta ? `${countryMeta.flag} ${c(countryMeta.en, countryMeta.zh, countryMeta.ru, countryMeta.es)}` : ""}
                            </span>
                            <h3 className="mt-1 font-display text-3xl font-medium">{lang === "zh" ? city.zh : city.en}</h3>
                          </div>
                        </div>
                      </Link>
                      <Link to={`/cities/${city.slug}`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline">
                        {c("View destination guide", "查看城市指南", "Открыть путеводитель", "Ver guía del destino")}
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>

                    <ul className="grid gap-3 md:grid-cols-2" aria-label={c(`Facilities in ${city.en}`, `${city.zh}的机构`, `Учреждения в ${city.en}`, `Centros en ${city.en}`)}>
                      {hospitals.map((hospital) => (
                        <li key={hospital.key} className="flex min-h-36 flex-col rounded-2xl border border-border/70 bg-card p-5 transition-colors hover:border-primary/30">
                          <div className="flex items-start gap-3">
                            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                              <Building2 className="size-4" />
                            </span>
                            <div className="min-w-0">
                              <h4 className="font-display text-xl font-medium leading-snug text-foreground">
                                {hospital.primary}
                              </h4>
                              {hospital.secondary && <p className="mt-1 text-xs leading-5 text-muted-foreground">{hospital.secondary}</p>}
                              {hospital.published && (
                                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
                                  <BadgeCheck className="size-3" />
                                  {c("Published expert profile", "关联已发布专家资料", "Есть профиль специалиста", "Perfil de experto publicado")}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="mt-auto flex items-center gap-2 pt-4 text-sm text-muted-foreground">
                            <MapPin className="size-4 shrink-0 text-primary" />
                            {hospital.area}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            )}

            <div className="mt-10 flex items-start gap-3 rounded-2xl border border-primary/15 bg-primary/[0.05] p-5 text-sm leading-6 text-muted-foreground md:p-6">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
              <p>
                {c(
                  "Directory inclusion is not a clinical ranking, recommendation or guarantee. Confirm current licensing, facility privileges, accreditation and treatment responsibility directly before booking.",
                  "目录收录不代表临床排名、推荐或效果保证。预约前请直接确认机构当前执照、专家执业权限、认证情况及医疗责任主体。",
                  "Включение в каталог не является рейтингом, рекомендацией или гарантией. Перед записью самостоятельно проверьте лицензии, полномочия специалиста, аккредитацию и ответственность за лечение.",
                  "La inclusión en el directorio no constituye una clasificación, recomendación ni garantía. Antes de reservar, confirma directamente licencias, privilegios profesionales, acreditación y responsabilidad clínica.",
                )}
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Clinics;

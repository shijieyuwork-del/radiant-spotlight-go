import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Building2, Search, ShieldCheck, X } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { CITIES } from "@/data/cities";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";
import { findRealHospitalPhoto } from "@/data/realHospitalPhotos";
import { useClinicDirectory } from "@/hooks/use-clinic-directory";
import { ClinicCard } from "@/components/clinics/ClinicCard";
import { CLINIC_DIRECTORY_META } from "@/lib/clinic-seo";

const normalize = (value: string) => value.trim().toLocaleLowerCase();
const BATCH_SIZE = 24;

const Clinics = () => {
  const { lang } = useAsia();
  const c = <T,>(en: T, zh: T, ru: T, es?: T, th?: T, ms?: T) => asiaCopy(lang, { en, zh, ru, es, th, ms });
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const cityFilter = searchParams.get("city") ?? "all";
  const { clinics, isLoading, isError, refetch } = useClinicDirectory();
  const listRef = useRef<HTMLDivElement>(null);
  const revealFocusIndex = useRef<number | null>(null);

  const filteredFacilities = useMemo(() => {
    const term = normalize(query);
    return CITIES.flatMap((city) => {
      if (cityFilter !== "all" && city.slug !== cityFilter) return [];
      return clinics.filter((hospital) => {
        if (hospital.citySlug !== city.slug) return false;
        if (!term) return true;
        const searchable = [
          hospital.nameEn,
          hospital.nameZh,
          hospital.areaEn,
          hospital.areaZh,
          ...hospital.aliases,
          city.en,
          city.zh,
        ].join(" ").toLocaleLowerCase();
        return searchable.includes(term);
      }).sort((a, b) => {
        const score = (hospital: typeof a) => hospital.origin === "published" ? 2 : Number(Boolean(findRealHospitalPhoto(hospital.nameZh, hospital.nameEn, ...hospital.aliases)));
        return Number(a.isPublic) - Number(b.isPublic) || score(b) - score(a);
      }).map((hospital) => ({ city, hospital }));
    });
  }, [cityFilter, clinics, query]);

  const visibleCount = filteredFacilities.length;
  const requestedPage = Number(searchParams.get("page") ?? 1);
  const page = Math.min(
    Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
    Math.max(1, Math.ceil(visibleCount / BATCH_SIZE)),
  );
  const shownCount = Math.min(page * BATCH_SIZE, visibleCount);
  const displayedFacilities = filteredFacilities.slice(0, shownCount);
  const nextBatchCount = Math.min(BATCH_SIZE, visibleCount - shownCount);
  const sections = useMemo(() => {
    const labels = {
      private: c("Private clinics", "私立机构", "Частные клиники", "Clínicas privadas", "คลินิกเอกชน", "Klinik swasta"),
      public: c("Public hospitals", "公立医院", "Государственные больницы", "Hospitales públicos", "โรงพยาบาลรัฐ", "Hospital kerajaan"),
    };
    const groups: { isPublic: boolean; label: string; total: number; items: typeof displayedFacilities }[] = [];
    for (const entry of displayedFacilities) {
      const last = groups[groups.length - 1];
      if (last && last.isPublic === entry.hospital.isPublic) {
        last.items.push(entry);
      } else {
        groups.push({
          isPublic: entry.hospital.isPublic,
          label: entry.hospital.isPublic ? labels.public : labels.private,
          total: filteredFacilities.filter((item) => item.hospital.isPublic === entry.hospital.isPublic).length,
          items: [entry],
        });
      }
    }
    return groups;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedFacilities, filteredFacilities, lang]);
  const countLabel = c(
    `Showing ${shownCount} of ${visibleCount} facilities`,
    `已显示 ${shownCount} 家，共 ${visibleCount} 家机构`,
    `Показано ${shownCount} из ${visibleCount} учреждений`,
    `Mostrando ${shownCount} de ${visibleCount} centros`,
    `แสดง ${shownCount} จาก ${visibleCount} สถานพยาบาล`,
    `Memaparkan ${shownCount} daripada ${visibleCount} pusat perubatan`,
  );
  useEffect(() => {
    const index = revealFocusIndex.current;
    if (index === null) return;
    revealFocusIndex.current = null;
    const link = listRef.current?.querySelectorAll<HTMLAnchorElement>("[data-clinic-primary-link]")[index];
    link?.focus({ preventScroll: true });
    link?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [shownCount]);
  const selectedCity = CITIES.find((city) => city.slug === cityFilter);
  const locationName = selectedCity ? (lang === "zh" ? selectedCity.zh : selectedCity.en) : c("China", "中国", "Китае", "China", "จีน", "China");
  const updateFilter = (key: "q" | "city", value: string) => {
    revealFocusIndex.current = null;
    const next = new URLSearchParams(searchParams);
    next.delete("page");
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    revealFocusIndex.current = null;
    setSearchParams({}, { replace: true });
  };
  const showMore = () => {
    revealFocusIndex.current = shownCount;
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page + 1));
    setSearchParams(next, { replace: true });
  };

  return (
    <>
      <PageMeta {...CLINIC_DIRECTORY_META} />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />
        <main>
          <section className="container pb-20 pt-6 md:pt-10" aria-labelledby="clinic-directory-title">
            <div className="sticky top-[6.25rem] z-30 rounded-3xl border border-border/70 bg-background/95 p-3 shadow-soft backdrop-blur-xl md:top-[6.1rem] md:p-4 xl:top-36">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <label className="relative block min-w-0 flex-1">
                  <span className="sr-only">
                    {c("Search clinics, cities or districts", "搜索诊所、城市或地区", "Поиск клиник, городов или районов", "Buscar clínicas, ciudades o distritos", "ค้นหาคลินิก เมือง หรือเขต", "Cari klinik, bandar atau daerah")}
                  </span>
                  <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-foreground" aria-hidden="true" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => updateFilter("q", event.target.value)}
                    placeholder={c("Search a clinic, city or district…", "搜索诊所、城市或地区…", "Клиника, город или район…", "Clínica, ciudad o distrito…", "คลินิก เมือง หรือเขต…", "Klinik, bandar atau daerah…")}
                    className="min-h-12 w-full rounded-full border border-border bg-card py-3 ps-11 pe-4 text-base outline-none transition-colors focus:border-foreground focus:ring-2 focus:ring-foreground/20 sm:text-sm motion-reduce:transition-none"
                  />
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0" aria-label={c("Filter by city", "按城市筛选", "Фильтр по городу", "Filtrar por ciudad", "กรองตามเมือง", "Tapis mengikut bandar")}>
                  <Button
                    type="button"
                    size="sm"
                    variant={cityFilter === "all" ? "default" : "outline"}
                    aria-pressed={cityFilter === "all"}
                    className="min-h-11 shrink-0 rounded-full px-4 text-foreground"
                    onClick={() => updateFilter("city", "all")}
                  >
                    {c("All", "全部", "Все", "Todos", "ทั้งหมด", "Semua")}
                  </Button>
                  {CITIES.map((city) => (
                    <Button
                      key={city.slug}
                      type="button"
                      size="sm"
                      variant={cityFilter === city.slug ? "default" : "outline"}
                      aria-pressed={cityFilter === city.slug}
                      className="min-h-11 shrink-0 rounded-full px-4 text-foreground"
                      onClick={() => updateFilter("city", city.slug)}
                    >
                      {lang === "zh" ? city.zh : city.en}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {c("All listed facilities", "全部收录机构", "Все учреждения", "Todos los centros", "สถานพยาบาลทั้งหมดในรายการ", "Semua pusat perubatan tersenarai")}
                </p>
                <h1 id="clinic-directory-title" className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">
                  {c(
                    `${visibleCount} ${visibleCount === 1 ? "facility" : "facilities"} in ${locationName}`,
                    `${visibleCount} 家医院及诊所，位于${locationName}`,
                    `${visibleCount} учреждений в ${locationName}`,
                    `${visibleCount} centros en ${locationName}`,
                    `สถานพยาบาล ${visibleCount} แห่งใน${locationName}`,
                    `${visibleCount} pusat perubatan di ${locationName}`,
                  )}
                </h1>
              </div>
              {(query || cityFilter !== "all") && (
                <Button type="button" variant="ghost" className="w-fit rounded-full" onClick={clearFilters}>
                  <X className="me-2 size-4" aria-hidden="true" />
                  {c("Clear filters", "清除筛选", "Сбросить фильтры", "Borrar filtros", "ล้างตัวกรอง", "Kosongkan penapis")}
                </Button>
              )}
            </div>

            {isError && (
              <p role="status" className="mt-5 text-sm text-foreground">
                {c("Showing the directory. Additional published profiles could not be loaded.", "目录已显示，后台关联的专家资料暂时无法加载。", "Каталог доступен. Дополнительные профили не загрузились.", "El directorio está disponible. No se pudieron cargar los perfiles adicionales.", "แสดงรายชื่อสถานพยาบาลแล้ว แต่ไม่สามารถโหลดโปรไฟล์ที่เผยแพร่เพิ่มเติมได้", "Direktori dipaparkan. Profil tambahan yang diterbitkan tidak dapat dimuatkan.")}
                {" "}<button type="button" onClick={() => void refetch()} className="rounded-sm underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                  {c("Try again", "重试", "Повторить", "Reintentar", "ลองอีกครั้ง", "Cuba lagi")}
                </button>
              </p>
            )}
            {isLoading && (
              <p role="status" className="mt-5 text-sm text-foreground">
                {c("Checking for additional published profiles…", "正在查看更多已发布的专家资料…", "Проверяем дополнительные опубликованные профили…", "Buscando perfiles publicados adicionales…", "กำลังตรวจสอบโปรไฟล์ที่เผยแพร่เพิ่มเติม…", "Menyemak profil tambahan yang diterbitkan…")}
              </p>
            )}

            {filteredFacilities.length === 0 ? (
              <div role="status" className="mt-8 rounded-3xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
                <Building2 className="mx-auto size-9 text-primary" />
                <h3 className="mt-4 font-display text-2xl">
                  {c("No matching facility", "没有找到匹配的机构", "Учреждения не найдены", "No se encontraron centros", "ไม่พบสถานพยาบาลที่ตรงกัน", "Tiada pusat perubatan yang sepadan")}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground">
                  {c("Try another clinic name, city or district.", "请尝试其他诊所名称、城市或地区。", "Попробуйте другое название, город или район.", "Prueba con otro nombre, ciudad o distrito.", "ลองชื่อคลินิก เมือง หรือเขตอื่น", "Cuba nama klinik, bandar atau daerah lain.")}
                </p>
                <Button type="button" className="mt-5 rounded-full text-foreground" onClick={clearFilters}>
                  {c("Show all clinics", "显示全部诊所", "Показать все клиники", "Ver todas las clínicas", "แสดงคลินิกทั้งหมด", "Lihat semua klinik")}
                </Button>
              </div>
            ) : (
              <div ref={listRef} id="clinic-directory-results" aria-describedby="clinic-directory-count" className="mt-8 space-y-12" aria-label={c("All hospitals and clinics", "全部医院及诊所", "Все больницы и клиники", "Todos los hospitales y clínicas", "โรงพยาบาลและคลินิกทั้งหมด", "Semua hospital dan klinik")}>
                {sections.map((section) => (
                  <section key={section.isPublic ? "public" : "private"} aria-label={section.label}>
                    <h2 className="flex items-baseline gap-3 border-b border-border/60 pb-3 font-display text-2xl font-medium tracking-tight">
                      {section.label}
                      <span className="text-sm font-normal tabular-nums text-foreground">{section.total}</span>
                    </h2>
                    <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {section.items.map(({ city, hospital }) => (
                        <ClinicCard key={hospital.slug} clinic={hospital} city={city} />
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
            <div className="mt-8 flex flex-col items-center gap-4">
              <p id="clinic-directory-count" role="status" aria-atomic="true" className="text-center text-sm tabular-nums text-foreground">{countLabel}</p>
              {nextBatchCount > 0 && (
                <Button type="button" variant="outline" className="h-auto min-h-12 max-w-full whitespace-normal rounded-full px-6 py-3 text-foreground" aria-controls="clinic-directory-results" onClick={showMore}>
                  {c(`Show ${nextBatchCount} more facilities`, `再显示 ${nextBatchCount} 家机构`, `Показать ещё ${nextBatchCount} учреждений`, `Mostrar ${nextBatchCount} centros más`, `แสดงสถานพยาบาลอีก ${nextBatchCount} แห่ง`, `Lihat ${nextBatchCount} lagi pusat perubatan`)}
                </Button>
              )}
            </div>

            <div className="mt-10 flex items-start gap-3 rounded-2xl border border-primary/15 bg-primary/[0.05] p-5 text-sm leading-6 text-foreground md:p-6">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
              <p>
                {c(
                  "Directory inclusion is not a clinical ranking, recommendation or guarantee. Confirm current licensing, facility privileges, accreditation and treatment responsibility directly before booking.",
                  "目录收录不代表临床排名、推荐或效果保证。预约前请直接确认机构当前执照、专家执业权限、认证情况及医疗责任主体。",
                  "Включение в каталог не является рейтингом, рекомендацией или гарантией. Перед записью самостоятельно проверьте лицензии, полномочия специалиста, аккредитацию и ответственность за лечение.",
                  "La inclusión en el directorio no constituye una clasificación, recomendación ni garantía. Antes de reservar, confirma directamente licencias, privilegios profesionales, acreditación y responsabilidad clínica.",
                  "การอยู่ในรายชื่อไม่ใช่การจัดอันดับ คำแนะนำ หรือการรับประกันทางการแพทย์ โปรดยืนยันใบอนุญาต สิทธิในการปฏิบัติงาน การรับรอง และผู้รับผิดชอบการรักษากับสถานพยาบาลโดยตรงก่อนจอง",
                  "Penyenaraian dalam direktori bukan penarafan klinikal, cadangan atau jaminan. Sahkan lesen semasa, kelayakan bertugas, akreditasi dan tanggungjawab rawatan secara langsung sebelum membuat tempahan.",
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

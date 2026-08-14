import { useMemo, useState } from "react";
import { Heart, Search, Filter, MapPin, Stethoscope, X } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import TikTokWall from "@/components/TikTokWall";
import { Button } from "@/components/ui/button";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { DOCTORS } from "@/data/doctors";
import { useAsia } from "@/lib/asia-i18n";

const Cases = () => {
  const { t, lang, fmt } = useAsia();
  const [q, setQ] = useState("");
  const [activeTreatments, setActiveTreatments] = useState<string[]>([]);
  const [activeCities, setActiveCities] = useState<string[]>([]);

  // Use the case's own China destination; fall back to doctor data for legacy entries.
  const caseCity = useMemo(() => {
    const map = new Map<string, { en: string; zh: string }>();
    TIKTOK_CASES.forEach((c) => {
      if (c.city) map.set(c.id, c.city);
    });
    DOCTORS.forEach((d) =>
      d.caseIds.forEach((id) => {
        if (!map.has(id)) map.set(id, { en: d.cityEn, zh: d.cityZh });
      })
    );
    return map;
  }, []);

  const treatments = useMemo(() => {
    const set = new Map<string, string>();
    TIKTOK_CASES.forEach((c) => set.set(c.treatment.en, c.treatment[lang]));
    return Array.from(set, ([key, label]) => ({ key, label }));
  }, [lang]);

  const cities = useMemo(() => {
    const set = new Map<string, string>();
    TIKTOK_CASES.forEach((c) => {
      const city = caseCity.get(c.id);
      if (city) set.set(city.en, lang === "zh" ? city.zh : city.en);
    });
    return Array.from(set, ([key, label]) => ({ key, label }));
  }, [caseCity, lang]);

  const toggle = (arr: string[], setArr: (v: string[]) => void, v: string) =>
    setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const items = useMemo(() => {
    return TIKTOK_CASES.filter((c) => {
      if (activeTreatments.length && !activeTreatments.includes(c.treatment.en)) return false;
      if (activeCities.length) {
        const city = caseCity.get(c.id);
        if (!city || !activeCities.includes(city.en)) return false;
      }
      if (!q.trim()) return true;
      const hay = `${c.user.en} ${c.user.zh} ${c.caption.en} ${c.caption.zh} ${c.clinic.en} ${c.clinic.zh} ${c.treatment.en} ${c.treatment.zh}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [q, activeTreatments, activeCities, caseCity]);

  const hasFilters = activeTreatments.length > 0 || activeCities.length > 0;

  return (
    <>
      <PageMeta
        title="Real Patient Cases & Before-After Videos | Medical Aesthetics"
        description="Browse real patient cosmetic surgery cases across China. Watch before-and-after videos, recovery timelines, pricing, doctors, and cases from Shanghai, Beijing, Guangzhou, Hangzhou, and Hainan."
        path="/cases"
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />

      <section className="container py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="pill bg-accent text-accent-foreground mb-3"><Heart className="size-3.5" /> {t("cases.kicker")}</span>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            {t("cases.wallTitleMain")}<em className="text-primary not-italic">{t("cases.wallTitleEm")}</em>
          </h1>
          <p className="text-muted-foreground mt-3">{t("cases.wallSub")}</p>
        </div>

        <div className="bg-card rounded-3xl p-2 shadow-pop flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto mb-6">
          <div className="flex-1 px-5 py-3 flex items-center gap-3">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full bg-transparent outline-none text-sm font-medium"
              placeholder={lang === "zh" ? "搜索项目、机构或博主…" : "Search by treatment, clinic or user…"}
            />
          </div>
        </div>

        {/* Treatment filter */}
        <div className="max-w-4xl mx-auto mb-4">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1 mr-1">
              <Stethoscope className="size-3" />
              {lang === "zh" ? "手术类型" : "Procedure"}
            </span>
            {treatments.map((tr) => {
              const on = activeTreatments.includes(tr.key);
              return (
                <Button
                  key={tr.key}
                  variant={on ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => toggle(activeTreatments, setActiveTreatments, tr.key)}
                >
                  {tr.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* City filter */}
        <div className="max-w-4xl mx-auto mb-4">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1 mr-1">
              <MapPin className="size-3" />
              {lang === "zh" ? "城市" : "City"}
            </span>
            {cities.map((ci) => {
              const on = activeCities.includes(ci.key);
              return (
                <Button
                  key={ci.key}
                  variant={on ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => toggle(activeCities, setActiveCities, ci.key)}
                >
                  {ci.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center mb-8 gap-3 text-xs text-muted-foreground">
          <Filter className="size-3" />
          <span>
            {lang === "zh" ? `共 ${items.length} 个案例` : `${items.length} case${items.length === 1 ? "" : "s"}`}
            {hasFilters &&
              ` · ${activeTreatments.length + activeCities.length} ${lang === "zh" ? "项筛选" : "filter(s)"}`}
          </span>
          {hasFilters && (
            <button
              onClick={() => {
                setActiveTreatments([]);
                setActiveCities([]);
              }}
              className="inline-flex items-center gap-1 text-foreground hover:text-primary transition"
            >
              <X className="size-3" />
              {lang === "zh" ? "清空筛选" : "Clear"}
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-12 text-sm">
            {lang === "zh" ? "没有匹配的案例，换个筛选试试。" : "No matching cases — try a different filter."}
          </p>
        ) : (
          <TikTokWall items={items} lang={lang} fmtPrice={fmt} variant="wall" />
        )}
      </section>

      <Footer />
      </div>
    </>
  );
};

export default Cases;

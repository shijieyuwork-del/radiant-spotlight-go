import { useMemo, useState } from "react";
import { ArrowRight, Heart, Search, SlidersHorizontal } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import TikTokWall from "@/components/TikTokWall";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { DOCTORS } from "@/data/doctors";
import { useAsia } from "@/lib/asia-i18n";

const Cases = () => {
  const { t, lang, fmt } = useAsia();
  const [q, setQ] = useState("");
  const [activeTreatment, setActiveTreatment] = useState("");
  const [activeCity, setActiveCity] = useState("");
  const [activeStage, setActiveStage] = useState("");

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

  const stageFor = (caption: string) => {
    const text = caption.toLowerCase();
    if (text.includes("consult")) return "Consultation";
    if (/\b(day|3-day|7-day)/.test(text)) return "Week 1";
    if (text.match(/\b(6|8|10|12|14)[- ]?week/)) return "Month 3+";
    if (text.match(/\b(2|3|4)[- ]?week/) || text.includes("30-day")) return "Month 1";
    if (text.includes("month") || text.includes("reveal")) return "Final result";
    return "Recovery update";
  };

  const items = useMemo(() => {
    return TIKTOK_CASES.filter((c) => {
      if (activeTreatment && activeTreatment !== c.treatment.en) return false;
      if (activeCity) {
        const city = caseCity.get(c.id);
        if (!city || activeCity !== city.en) return false;
      }
      if (activeStage && stageFor(c.caption.en) !== activeStage) return false;
      if (!q.trim()) return true;
      const city = caseCity.get(c.id);
      const hay = `${c.user.en} ${c.user.zh} ${c.caption.en} ${c.caption.zh} ${c.clinic.en} ${c.clinic.zh} ${c.treatment.en} ${c.treatment.zh} ${city?.en || ""} ${city?.zh || ""} ${stageFor(c.caption.en)}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [q, activeTreatment, activeCity, activeStage, caseCity]);

  const hasFilters = Boolean(activeTreatment || activeCity || activeStage || q);

  return (
    <>
      <PageMeta
        title="Patient Recovery Diaries in China | Cosmetics Asia"
        description="Explore cosmetic procedure recovery diary previews for China. Verified labels appear only after booking or clinic attendance has been confirmed."
        path="/cases"
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />

      <section className="container py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="pill bg-accent text-accent-foreground mb-3"><Heart className="size-3.5" /> {t("cases.kicker")}</span>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            {lang === "zh" ? "真实恢复历程，" : "Real recovery journeys, "}<em className="text-primary not-italic">{lang === "zh" ? "从面诊到最终效果" : "from consultation to final results."}</em>
          </h1>
          <p className="text-muted-foreground mt-3">{lang === "zh" ? "按项目、恢复阶段或中国城市筛选，看看整个过程真实是什么样。" : "Filter by procedure, recovery stage or China destination—and see what the process actually looks like."}</p>
        </div>

        <div className="bg-card rounded-full border border-border/70 p-2 shadow-soft flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto mb-5">
          <div className="flex-1 px-5 py-3 flex items-center gap-3">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full bg-transparent outline-none text-sm font-medium"
              placeholder={lang === "zh" ? "搜索项目、恢复阶段或城市…" : "Search procedures, recovery stages or cities…"}
            />
          </div>
        </div>

        <div className="mx-auto mb-5 grid max-w-3xl gap-2 sm:grid-cols-3">
          <FilterSelect value={activeTreatment} onChange={setActiveTreatment} label={lang === "zh" ? "全部项目" : "All procedures"} options={treatments} />
          <FilterSelect value={activeStage} onChange={setActiveStage} label={lang === "zh" ? "全部恢复阶段" : "All recovery stages"} options={["Consultation", "Week 1", "Month 1", "Month 3+", "Final result", "Recovery update"].map((key) => ({ key, label: lang === "zh" ? ({ Consultation: "面诊", "Week 1": "术后第 1 周", "Month 1": "术后第 1 月", "Month 3+": "术后 3 个月以上", "Final result": "最终效果", "Recovery update": "恢复更新" } as Record<string,string>)[key] : key }))} />
          <FilterSelect value={activeCity} onChange={setActiveCity} label={lang === "zh" ? "全部城市" : "All cities"} options={cities} />
        </div>

        <div className="flex items-center justify-center mb-10 gap-3 text-xs text-muted-foreground">
          <SlidersHorizontal className="size-3" />
          <span>
            {lang === "zh" ? `共 ${items.length} 个案例` : `${items.length} case${items.length === 1 ? "" : "s"}`}
          </span>
          {hasFilters && (
            <button
              onClick={() => {
                setQ(""); setActiveTreatment(""); setActiveCity(""); setActiveStage("");
              }}
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              {lang === "zh" ? "清空筛选" : "Clear"}
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-12 text-sm">
            {lang === "zh" ? "没有匹配的案例，换个筛选试试。" : "No matching cases — try a different filter."}
          </p>
        ) : (
          <div>
            <div className="mb-5 flex items-end justify-between gap-4"><div><span className="pill bg-accent text-accent-foreground">{lang === "zh" ? "最新更新" : "Latest recovery updates"}</span><h2 className="mt-3 font-display text-3xl font-medium">{lang === "zh" ? "选择一个历程继续观看" : "Choose a journey to continue"}</h2></div><span className="hidden items-center gap-1 text-sm font-semibold text-primary sm:inline-flex">{lang === "zh" ? "点击卡片查看完整时间线" : "Open a card for the full timeline"}<ArrowRight className="size-4" /></span></div>
            <TikTokWall items={items} lang={lang} fmtPrice={fmt} variant="cases" />
          </div>
        )}
      </section>

      <Footer />
      </div>
    </>
  );
};

const FilterSelect = ({ value, onChange, label, options }: { value: string; onChange: (value: string) => void; label: string; options: { key: string; label: string }[] }) => (
  <select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-11 rounded-full border border-border/70 bg-card px-4 text-sm font-semibold text-foreground shadow-soft outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10">
    <option value="">{label}</option>
    {options.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}
  </select>
);

export default Cases;

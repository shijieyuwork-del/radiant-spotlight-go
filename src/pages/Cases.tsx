import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, Heart, MessageCircle, Navigation, Search, SlidersHorizontal } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import TikTokWall, { type TikTokItem } from "@/components/TikTokWall";
import { Pagination, SortChips } from "@/components/ListControls";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { DOCTORS } from "@/data/doctors";
import { CITIES } from "@/data/cities";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";
import { cityCoordsOf, haversineKm, useUserLocation } from "@/lib/geo";

const PAGE_SIZE = 9;

/** "56k" -> 56000；"1.2k" -> 1200；空串 -> 0 */
const parseLikes = (s: string) => {
  const m = String(s ?? "").trim().toLowerCase().match(/^([\d.]+)k?$/);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  return s.toLowerCase().includes("k") ? Math.round(n * 1000) : Math.round(n);
};

const Cases = () => {
  const { t, lang, fmt } = useAsia();
  const c = (en: string, zh: string, ru: string) => asiaCopy(lang, { en, zh, ru });
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState("");
  const [activeTreatment, setActiveTreatment] = useState("");
  // 支持从城市搜索跳转进来时预选城市（/cases?city=Seoul）
  const [activeCity, setActiveCity] = useState(() => searchParams.get("city") ?? "");
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

  // URL 带进来的城市若暂时没有案例（如 Seoul），保留筛选并把它显示在下拉框里，
  // 让空态如实呈现「该城市暂无案例」，而不是静默清除后展示全部。
  const cityOptions = useMemo(() => {
    if (activeCity && !cities.some((o) => o.key === activeCity)) {
      return [...cities, { key: activeCity, label: activeCity }];
    }
    return cities;
  }, [cities, activeCity]);

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

  // —— 排序：推荐 / 热度 / 最新 / 距离 ——
  const [sort, setSort] = useState("recommended");
  const { coords, status: locStatus, request: requestLocation } = useUserLocation();

  // 选中「距离」时才请求浏览器定位
  useEffect(() => {
    if (sort === "distance" && locStatus === "idle") requestLocation();
  }, [sort, locStatus, requestLocation]);

  const sortedItems = useMemo(() => {
    const arr = [...items];
    if (sort === "hot") {
      arr.sort((a, b) => parseLikes(b.likes) - parseLikes(a.likes));
    } else if (sort === "latest") {
      arr.sort((a, b) => (b.postedAt ?? "").localeCompare(a.postedAt ?? ""));
    } else if (sort === "distance" && coords) {
      const dist = (item: TikTokItem) => {
        const city = caseCity.get(item.id);
        const cc = cityCoordsOf(city?.en) ?? cityCoordsOf(city?.zh);
        return cc ? haversineKm(coords, cc) : Number.POSITIVE_INFINITY;
      };
      arr.sort((a, b) => dist(a) - dist(b));
    }
    return arr;
  }, [items, sort, coords, caseCity]);

  // —— 分页 ——
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [q, activeTreatment, activeCity, activeStage, sort]);
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedItems = useMemo(
    () => sortedItems.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [sortedItems, safePage],
  );

  const hasFilters = Boolean(activeTreatment || activeCity || activeStage || q);

  // —— 按城市动态生成 SEO meta（?city=Seoul 分享时标题/摘要/图都对应该城市）——
  const activeCityMeta = useMemo(
    () => CITIES.find((x) => x.en.toLowerCase() === activeCity.toLowerCase() || x.zh === activeCity),
    [activeCity],
  );
  const cityLabel = activeCityMeta ? (lang === "zh" ? activeCityMeta.zh : activeCityMeta.en) : activeCity;

  return (
    <>
      <PageMeta
        title="Real Patient Recovery Diaries"
        description="Watch real before-and-after recovery diaries by procedure and city across Asia — timelines, prices, surgeon info and verified results."
        path="/cases"
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />

      <section className="container py-9 md:py-16">
        <div className="mx-auto mb-6 max-w-2xl text-center md:mb-8">
          <span className="pill bg-accent text-accent-foreground mb-3"><Heart className="size-3.5" /> {t("cases.kicker")}</span>
          <h1 className="font-display text-[2.15rem] font-medium leading-[1.04] tracking-tight sm:text-4xl md:text-5xl">
            {c("Real recovery journeys, ", "真实恢复历程，", "Реальные истории восстановления: ")}<em className="text-primary not-italic">{c("from consultation to final results.", "从面诊到最终效果", "от консультации до результата.")}</em>
          </h1>
        </div>

        <div className="mx-auto mb-4 flex max-w-3xl flex-col gap-2 rounded-2xl border border-border/70 bg-card p-1.5 shadow-soft sm:flex-row sm:rounded-full">
          <div className="flex-1 px-5 py-3 flex items-center gap-3">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full bg-transparent outline-none text-sm font-medium"
              placeholder={c("Search procedures, recovery stages or cities…", "搜索项目、恢复阶段或城市…", "Поиск по процедуре, этапу или городу…")}
            />
          </div>
        </div>

        <div className="mx-auto mb-4 grid max-w-3xl grid-cols-1 gap-2 min-[430px]:grid-cols-3">
          <FilterSelect value={activeTreatment} onChange={setActiveTreatment} label={c("All procedures", "全部项目", "Все процедуры")} options={treatments} />
          <FilterSelect value={activeStage} onChange={setActiveStage} label={lang === "zh" ? "全部恢复阶段" : lang === "ru" ? "Все этапы восстановления" : "All recovery stages"} options={["Consultation", "Week 1", "Month 1", "Month 3+", "Final result", "Recovery update"].map((key) => ({ key, label: lang === "zh" ? ({ Consultation: "面诊", "Week 1": "术后第 1 周", "Month 1": "术后第 1 月", "Month 3+": "术后 3 个月以上", "Final result": "最终效果", "Recovery update": "恢复更新" } as Record<string,string>)[key] : lang === "ru" ? ({ Consultation: "Консультация", "Week 1": "1-я неделя", "Month 1": "1-й месяц", "Month 3+": "3+ месяца", "Final result": "Итоговый результат", "Recovery update": "Ход восстановления" } as Record<string,string>)[key] : key }))} />
          <FilterSelect value={activeCity} onChange={setActiveCity} label={c("All cities", "全部城市", "Все города")} options={cityOptions} />
        </div>

        <div className="mb-7 flex items-center justify-center gap-3 text-xs text-muted-foreground md:mb-10">
          <SlidersHorizontal className="size-3" />
          <span>
            {lang === "zh" ? `共 ${items.length} 个案例` : lang === "ru" ? `${items.length} историй` : `${items.length} case${items.length === 1 ? "" : "s"}`}
          </span>
          {hasFilters && (
            <button
              onClick={() => {
                setQ(""); setActiveTreatment(""); setActiveCity(""); setActiveStage("");
              }}
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              {c("Clear", "清空筛选", "Сбросить")}
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-12 text-sm">
            {c("No matching cases — try a different filter.", "没有匹配的案例，换个筛选试试。", "Подходящих историй не найдено — измените фильтры.")}
          </p>
        ) : (
          <div>
            <div className="mb-4 flex items-end justify-between gap-4 md:mb-5"><div><span className="pill bg-accent text-accent-foreground">{c("Latest recovery updates", "最新更新", "Последние обновления")}</span><h2 className="mt-3 font-display text-[1.75rem] font-medium leading-tight md:text-3xl">{c("Choose a journey to continue", "选择一个历程继续观看", "Выберите историю и продолжайте просмотр")}</h2></div><span className="hidden items-center gap-1 text-sm font-semibold text-primary sm:inline-flex">{c("Open a card for the full timeline", "点击卡片查看完整时间线", "Откройте карточку, чтобы увидеть весь путь")}<ArrowRight className="size-4" /></span></div>
            <TikTokWall items={items} lang={lang} fmtPrice={fmt} variant="cases" />
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

const FilterSelect = ({ value, onChange, label, options }: { value: string; onChange: (value: string) => void; label: string; options: { key: string; label: string }[] }) => (
  <select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 w-full rounded-xl border border-border/70 bg-card px-3 text-[13px] font-semibold text-foreground shadow-soft outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10 sm:rounded-full sm:px-4 sm:text-sm">
    <option value="">{label}</option>
    {options.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}
  </select>
);

export default Cases;

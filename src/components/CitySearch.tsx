import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, MapPin, MessageCircle } from "lucide-react";
import { CITIES, COUNTRY_BY_CITY, COUNTRY_META, type City } from "@/data/cities";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";
import { Highlight } from "@/components/HighlightText";

export interface CityFilter {
  query: string;
  setQuery: (v: string) => void;
  country: string;
  setCountry: (v: string) => void;
  results: City[];
  countries: string[];
  /** 用户是否正在使用搜索或国家筛选 */
  active: boolean;
  clear: () => void;
}

/** 城市搜索 + 国家筛选的状态逻辑，首页与城市页共用 */
export const useCityFilter = (): CityFilter => {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("all");

  const countries = useMemo(
    () => Array.from(new Set(CITIES.map((city) => COUNTRY_BY_CITY[city.slug] ?? "CN"))),
    [],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CITIES.filter((city) => {
      if (country !== "all" && (COUNTRY_BY_CITY[city.slug] ?? "CN") !== country) return false;
      if (!q) return true;
      const countryMeta = COUNTRY_META[COUNTRY_BY_CITY[city.slug] ?? "CN"];
      const hay = [
        city.en, city.zh, city.slug,
        city.taglineEn, city.taglineZh,
        countryMeta?.en, countryMeta?.zh,
        ...city.hotEn, ...city.hotZh,
      ].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [query, country]);

  return {
    query, setQuery, country, setCountry, results, countries,
    active: query.trim() !== "" || country !== "all",
    clear: () => { setQuery(""); setCountry("all"); },
  };
};

const Chip = ({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) => (
  <button
    type="button"
    onClick={onClick}
    className={`min-h-12 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
      active
        ? "bg-primary text-primary-foreground shadow-soft"
        : "border border-border bg-background text-foreground hover:border-primary/50 hover:text-primary"
    }`}
  >
    {label}
  </button>
);

/** 搜索框 + 国家筛选 chips */
export const CitySearchBar = ({ filter }: { filter: CityFilter }) => {
  const { lang } = useAsia();
  const c = <T,>(en: T, zh: T, ru: T) => asiaCopy(lang, { en, zh, ru });
  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-soft md:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filter.query}
            onChange={(e) => filter.setQuery(e.target.value)}
            placeholder={c(
              "Search a city, country or procedure — e.g. Seoul, Korea, nose…",
              "搜索城市、国家或项目 —— 如首尔、韩国、隆鼻…",
              "Поиск по городу, стране или процедуре — Сеул, Корея, нос…",
            )}
            className="h-12 w-full rounded-full border border-border/70 bg-background pl-11 pr-12 text-base outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10 sm:text-sm"
          />
          {filter.query && (
            <button
              type="button"
              onClick={() => filter.setQuery("")}
              aria-label={c("Clear search", "清除搜索", "Очистить поиск")}
              className="absolute right-0 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip
            active={filter.country === "all"}
            onClick={() => filter.setCountry("all")}
            label={c("All countries", "全部国家", "Все страны")}
          />
          {filter.countries.map((code) => {
            const meta = COUNTRY_META[code];
            return (
              <Chip
                key={code}
                active={filter.country === code}
                onClick={() => filter.setCountry(code)}
                label={`${meta?.flag ?? ""} ${c(meta?.en ?? code, meta?.zh ?? code, meta?.ru ?? code)}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

/** 搜索结果：紧凑城市卡，附「城市详情 / 案例 / 专家」快捷入口；query 用于高亮命中词 */
export const CityQuickResults = ({ results, query }: { results: City[]; query?: string }) => {
  const { lang } = useAsia();
  const c = <T,>(en: T, zh: T, ru: T) => asiaCopy(lang, { en, zh, ru });

  if (results.length === 0) {
    return (
      <div className="mt-4 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card/60 px-6 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          {c(
            "No matching city yet — tell us where you want to go and we'll help.",
            "暂时没有匹配的城市 —— 告诉我们你想去的城市，我们来帮你对接。",
            "Подходящий город не найден — напишите нам, и мы поможем.",
          )}
        </p>
        <a
          href="https://wa.me/14708613825"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          <MessageCircle className="size-4" />
          {c("Ask us", "咨询客服", "Спросить нас")}
        </a>
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((city) => {
        const meta = COUNTRY_META[COUNTRY_BY_CITY[city.slug] ?? "CN"];
        return (
          <div key={city.slug} className="rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:border-primary/35 hover:shadow-pop">
            <div className="flex items-center gap-3">
              <img
                src={city.img}
                alt={`${city.en} city`}
                loading="lazy"
                className="size-12 shrink-0 rounded-full border border-primary/15 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-semibold leading-tight truncate">
                  <Highlight text={lang === "zh" ? city.zh : city.en} query={query} />
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground truncate">
                  <MapPin className="size-3 shrink-0" />
                  {meta ? `${meta.flag} ${c(meta.en, meta.zh, meta.ru)}` : ""}
                  {" · "}
                  <Highlight text={lang === "zh" ? city.en : city.zh} query={query} />
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[11px] font-semibold">
              <Link
                to={`/cities/${city.slug}`}
                className="flex min-h-12 items-center justify-center rounded-xl bg-secondary px-2 py-2 text-foreground transition hover:bg-accent"
              >
                {c("Guide", "城市详情", "Гид")}
              </Link>
              <Link
                to={`/cases?city=${encodeURIComponent(city.en)}`}
                className="flex min-h-12 items-center justify-center rounded-xl bg-accent px-2 py-2 text-accent-foreground transition hover:opacity-80"
              >
                {c("Cases", "真实案例", "Кейсы")}
              </Link>
              <Link
                to={`/doctors?city=${encodeURIComponent(city.en)}`}
                className="flex min-h-12 items-center justify-center rounded-xl bg-primary px-2 py-2 text-primary-foreground transition hover:bg-primary/90"
              >
                {c("Experts", "专家", "Эксперты")}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CitySearchBar;

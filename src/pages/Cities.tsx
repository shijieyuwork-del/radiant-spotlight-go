import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight, Stethoscope, Wallet, MessageCircle, Building2, Video } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { COUNTRY_BY_CITY, COUNTRY_META } from "@/data/cities";
import { CitySearchBar, useCityFilter } from "@/components/CitySearch";
import { Highlight } from "@/components/HighlightText";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";

const Cities = () => {
  const { lang } = useAsia();
  const c = <T,>(en: T, zh: T, ru: T) => asiaCopy(lang, { en, zh, ru });
  const navigate = useNavigate();
  const filter = useCityFilter();
  return (
    <>
      <PageMeta
        title="Top Surgery Destinations in Asia"
        description="Explore Seoul, Shanghai, Bangkok, Tokyo, Singapore and more — Asia's cosmetic surgery hubs with specialties, USD pricing, visa info and travel planning."
        path="/cities"
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />

      {/* Hero */}
      <section className="container py-12 md:py-16">
        <span className="pill bg-accent text-accent-foreground mb-3">
          <MapPin className="size-3.5" />
          {c("Asia destinations", "亚洲城市", "Города Азии")}
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight max-w-3xl">
          {lang === "zh" ? (
            <>
              选择城市，<em className="text-primary not-italic">找到主刀医生</em>
            </>
          ) : lang === "ru" ? (
            <>
              Выберите город — <em className="text-primary not-italic">найдите своего врача</em>
            </>
          ) : (
            <>
              Choose a city,{" "}
              <em className="text-primary not-italic">find your surgeon</em>
            </>
          )}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          {c(
            "Asia's leading medical-aesthetic destinations — from Seoul and Bangkok to Shanghai and Tokyo — each with its own specialties, price level and travel logistics.",
            "从首尔、曼谷到上海、东京，亚洲热门医美目的地各有强势项目、价格区间与出行配套。",
            "Ведущие направления медицинской эстетики Азии — от Сеула и Бангкока до Шанхая и Токио — со своими специализациями, ценами и логистикой.",
          )}
        </p>

        {/* 城市搜索 + 国家筛选 */}
        <div className="mt-8">
          <CitySearchBar filter={filter} />
          {filter.active && (
            <p className="mt-3 text-xs text-muted-foreground">
              {c(
                `${filter.results.length} ${filter.results.length === 1 ? "city" : "cities"} found`,
                `找到 ${filter.results.length} 个城市`,
                `Найдено городов: ${filter.results.length}`,
              )}
              {" · "}
              <button type="button" onClick={filter.clear} className="font-semibold text-primary hover:underline">
                {c("Reset", "重置", "Сбросить")}
              </button>
            </p>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="container pb-16 md:pb-20">
        {filter.results.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
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
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <MessageCircle className="size-4" />
              {c("Ask us", "咨询客服", "Спросить нас")}
            </a>
          </div>
        ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filter.results.map((city) => {
            const meta = COUNTRY_META[COUNTRY_BY_CITY[city.slug] ?? "CN"];
            return (
              <article
                key={city.slug}
                onClick={() => navigate(`/cities/${city.slug}`)}
                className="group cursor-pointer rounded-3xl bg-card shadow-soft hover:shadow-pop transition-all hover:-translate-y-1 overflow-hidden flex flex-col"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={city.img}
                    alt={city.en}
                    loading="lazy"
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-background">
                    <div>
                      <p className="font-display text-3xl font-semibold leading-none">
                        <Highlight text={lang === "zh" ? city.zh : city.en} query={filter.query} className="rounded bg-primary/80 px-0.5 text-primary-foreground" />
                      </p>
                      <p className="text-xs opacity-80 mt-1">
                        {meta ? `${meta.flag} ${c(meta.en, meta.zh, meta.ru)} · ` : ""}
                        <Highlight text={lang === "zh" ? city.en : city.zh} query={filter.query} className="rounded bg-primary/80 px-0.5 text-primary-foreground" />
                      </p>
                    </div>
                    <span className="pill bg-background/95 text-foreground text-[10px]"><Wallet className="size-3 text-primary" />{c("Travel guide", "行程指南", "Путеводитель")}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col gap-3">
                  <p className="text-sm text-foreground/80 leading-snug">
                    <Highlight text={lang === "zh" ? city.taglineZh : city.taglineEn} query={filter.query} />
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <Stat
                      icon={<Building2 className="size-3.5" />}
                      label={c("Provider info", "机构资料", "Информация о клинике")}
                      value={c("Local", "当地", "Местные")}
                    />
                    <Stat
                      icon={<Stethoscope className="size-3.5" />}
                      label={c("Doctor profiles", "医生资料", "Профили врачей")}
                      value={c("Reviewed", "审核后发布", "Проверено")}
                    />
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {(lang === "zh" ? city.hotZh : city.hotEn).slice(0, 4).map((h) => (
                      <span
                        key={h}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                      >
                        <Highlight text={h} query={filter.query} />
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      {c("Explore the city", "查看城市详情", "Узнать о городе")}
                      <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); navigate(`/cases?city=${encodeURIComponent(city.en)}`); }}
                        className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-[11px] font-semibold text-accent-foreground transition hover:opacity-80"
                      >
                        <Video className="size-3" />
                        {c("Cases", "案例", "Кейсы")}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); navigate(`/doctors?city=${encodeURIComponent(city.en)}`); }}
                        className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground transition hover:bg-primary/90"
                      >
                        <Stethoscope className="size-3" />
                        {c("Doctors", "医生", "Врачи")}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        )}
      </section>

      {/* City request callout */}
      <section className="container pb-20">
        <div className="rounded-3xl border border-primary/15 bg-gradient-to-r from-[hsl(190,70%,92%)] via-[hsl(155,60%,90%)] to-[hsl(50,80%,92%)] p-6 md:p-9 grid md:grid-cols-3 gap-5 items-center shadow-soft">
          <div className="md:col-span-2">
            <span className="pill mb-3 bg-background/80 text-foreground">
              <MapPin className="size-3.5 text-primary" />
              {lang === "zh" ? "更多城市" : lang === "ru" ? "Другие города" : "More destinations"}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-[#26483f]">
              {lang === "zh"
                ? "你的城市不在这里？告诉我们"
                : lang === "ru"
                  ? "Не нашли нужный город? Расскажите нам"
                  : "Don’t see your preferred city? Tell us"}
            </h2>
            <p className="text-base text-foreground/75 mt-3 max-w-2xl leading-relaxed">
              {lang === "zh"
                ? "告诉我们你希望前往的城市和想咨询的项目，我们会协助查找合适的医生与诊所选择。"
                : lang === "ru"
                  ? "Сообщите желаемый город и интересующую процедуру — мы поможем найти подходящих врачей и клиники."
                  : "Share the city and procedure you’re considering, and we’ll help explore suitable doctor and clinic options."}
            </p>
          </div>
          <div className="flex md:justify-end">
            <a
              href={`https://wa.me/14708613825?text=${encodeURIComponent(
                lang === "zh"
                  ? "你好 Cosmetics Asia，我想咨询一个目前城市列表中没有的城市。"
                  : lang === "ru"
                    ? "Здравствуйте, Cosmetics Asia. Я хочу узнать о городе, которого пока нет в списке."
                    : "Hi Cosmetics Asia, I’d like to ask about a city that is not currently listed."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 w-full md:w-auto items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              <MessageCircle className="size-4" />
              {lang === "zh" ? "告诉我们" : lang === "ru" ? "Написать нам" : "Tell us"}
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </>
  );
};

const Stat = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="rounded-2xl bg-accent/60 py-2">
    <p className="font-display text-base font-semibold flex items-center justify-center gap-1">
      {value}
    </p>
    <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
      {icon}
      {label}
    </p>
  </div>
);

export default Cities;

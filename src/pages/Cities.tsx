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
  const c = <T,>(en: T, zh: T, ru: T, es?: T) => asiaCopy(lang, { en, zh, ru, es });
  const navigate = useNavigate();
  const filter = useCityFilter();
  return (
    <>
      <PageMeta
        title="Cosmetic Surgery Destinations in China"
        description="Explore Shanghai, Guangzhou, Beijing, Hainan and Hangzhou, with procedure information, indicative pricing and practical travel planning in China."
        path="/cities"
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />

      {/* Hero */}
      <section className="container py-12 md:py-16">
        <span className="pill bg-accent text-accent-foreground mb-3">
          <MapPin className="size-3.5" />
          {c("China destinations", "中国城市", "Города Китая", "Destinos en China")}
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight max-w-3xl">
          {lang === "zh" ? (
            <>
              选择城市，<em className="text-primary not-italic">找到主刀专家</em>
            </>
          ) : lang === "ru" ? (
            <>
              Выберите город — <em className="text-primary not-italic">найдите своего эксперта</em>
            </>
          ) : lang === "es" ? (
            <>
              Elige una ciudad, <em className="text-primary not-italic">encuentra a tu cirujano</em>
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
            "China's leading medical-aesthetic destinations — from Shanghai and Beijing to Guangzhou and Hainan — each with its own specialties, price level and travel logistics.",
            "从上海、北京到广州、海南，中国热门医美目的地各有强势项目、价格区间与出行配套。",
            "Ведущие направления медицинской эстетики Китая — от Шанхая и Пекина до Гуанчжоу и Хайнаня — со своими специализациями, ценами и логистикой.",
            "Los principales destinos de estética médica en China — de Shanghái y Pekín a Cantón y Hainan — cada uno con sus especialidades, nivel de precios y logística de viaje.",
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
                `${filter.results.length} ${filter.results.length === 1 ? "ciudad encontrada" : "ciudades encontradas"}`,
              )}
              {" · "}
              <button type="button" onClick={filter.clear} className="font-semibold text-primary hover:underline">
                {c("Reset", "重置", "Сбросить", "Restablecer")}
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
                "Todavía no hay una ciudad que coincida — cuéntanos a dónde quieres ir y te ayudaremos.",
              )}
            </p>
            <a
              href="https://wa.me/14708613825"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <MessageCircle className="size-4" />
              {c("Ask us", "咨询客服", "Спросить нас", "Contáctanos")}
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
                        {meta ? `${meta.flag} ${c(meta.en, meta.zh, meta.ru, meta.es)} · ` : ""}
                        <Highlight text={lang === "zh" ? city.en : city.zh} query={filter.query} className="rounded bg-primary/80 px-0.5 text-primary-foreground" />
                      </p>
                    </div>
                    <span className="pill bg-background/95 text-foreground text-[10px]"><Wallet className="size-3 text-primary" />{c("Travel guide", "行程指南", "Путеводитель", "Guía de viaje")}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col gap-3">
                  <p className="text-sm text-foreground/80 leading-snug">
                    <Highlight text={lang === "zh" ? city.taglineZh : city.taglineEn} query={filter.query} />
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <Stat
                      icon={<Building2 className="size-3.5" />}
                      label={c("Provider info", "机构资料", "Информация о клинике", "Información del proveedor")}
                      value={c("Local", "当地", "Местные", "Local")}
                    />
                    <Stat
                      icon={<Stethoscope className="size-3.5" />}
                      label={c("Expert profiles", "专家资料", "Профили экспертов", "Perfiles de expertos")}
                      value={c("Reviewed", "审核后发布", "Проверено", "Revisado")}
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
                      {c("Explore the city", "查看城市详情", "Узнать о городе", "Explorar la ciudad")}
                      <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); navigate(`/cases?city=${encodeURIComponent(city.en)}`); }}
                        className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-[11px] font-semibold text-accent-foreground transition hover:opacity-80"
                      >
                        <Video className="size-3" />
                        {c("Cases", "案例", "Кейсы", "Casos")}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); navigate(`/doctors?city=${encodeURIComponent(city.en)}`); }}
                        className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground transition hover:bg-primary/90"
                      >
                        <Stethoscope className="size-3" />
                        {c("Experts", "专家", "Эксперты", "Expertos")}
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
        <div className="rounded-3xl border border-primary/15 bg-gradient-to-r from-[hsl(155,55%,92%)] via-[hsl(150,48%,91%)] to-[hsl(50,78%,92%)] p-6 md:p-9 grid md:grid-cols-3 gap-5 items-center shadow-soft">
          <div className="md:col-span-2">
            <span className="pill mb-3 bg-background/80 text-foreground">
              <MapPin className="size-3.5 text-primary" />
              {lang === "zh" ? "更多城市" : lang === "ru" ? "Другие города" : lang === "es" ? "Más destinos" : "More destinations"}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-[#26483f]">
              {lang === "zh"
                ? "你的城市不在这里？告诉我们"
                : lang === "ru"
                  ? "Не нашли нужный город? Расскажите нам"
                  : lang === "es"
                    ? "¿No ves tu ciudad preferida? Cuéntanos"
                    : "Don’t see your preferred city? Tell us"}
            </h2>
            <p className="text-base text-foreground/75 mt-3 max-w-2xl leading-relaxed">
              {lang === "zh"
                ? "告诉我们你希望前往的城市和想咨询的项目，我们会协助查找合适的专家与诊所选择。"
                : lang === "ru"
                  ? "Сообщите желаемый город и интересующую процедуру — мы поможем найти подходящих экспертов и клиники."
                  : lang === "es"
                    ? "Cuéntanos la ciudad y el procedimiento que te interesa, y te ayudaremos a explorar expertos y clínicas adecuados."
                    : "Share the city and procedure you’re considering, and we’ll help explore suitable expert and clinic options."}
            </p>
          </div>
          <div className="flex md:justify-end">
            <a
              href={`https://wa.me/14708613825?text=${encodeURIComponent(
                lang === "zh"
                  ? "你好 CeladonChina，我想咨询一个目前城市列表中没有的城市。"
                  : lang === "ru"
                    ? "Здравствуйте, CeladonChina. Я хочу узнать о городе, которого пока нет в списке."
                    : lang === "es"
                      ? "Hola CeladonChina, me gustaría preguntar por una ciudad que no está en la lista actual."
                      : "Hi CeladonChina, I’d like to ask about a city that is not currently listed."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="cta-primary inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition md:w-auto"
            >
              <MessageCircle className="size-4" />
              {lang === "zh" ? "告诉我们" : lang === "ru" ? "Написать нам" : lang === "es" ? "Cuéntanos" : "Tell us"}
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

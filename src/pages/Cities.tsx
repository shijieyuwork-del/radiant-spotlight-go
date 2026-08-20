import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Stethoscope, Wallet, MessageCircle, Building2 } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { CITIES } from "@/data/cities";
import { DOCTORS } from "@/data/doctors";
import { useAsia } from "@/lib/asia-i18n";

const Cities = () => {
  const { lang } = useAsia();
  return (
    <>
      <PageMeta
        title="Medical Aesthetics in China | Shanghai, Guangzhou, Beijing, Hainan, Hangzhou"
        description="Explore medical-aesthetic destinations in Shanghai, Guangzhou, Beijing, Hainan, and Hangzhou with clinics, specialties, pricing, and travel information."
        path="/cities"
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />

      {/* Hero */}
      <section className="container py-12 md:py-16">
        <span className="pill bg-accent text-accent-foreground mb-3">
          <MapPin className="size-3.5" />
          {lang === "zh" ? "中国城市" : "China destinations"}
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight max-w-3xl">
          {lang === "zh" ? (
            <>
              选择城市，<em className="text-primary not-italic">找到主刀医生</em>
            </>
          ) : (
            <>
              Choose a city,{" "}
              <em className="text-primary not-italic">find your surgeon</em>
            </>
          )}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          {lang === "zh" ? "上海、广州、北京、海南、杭州五大中国医美目的地，各有强势项目、价格区间与出行配套。" : "Five medical-aesthetic destinations in China — Shanghai, Guangzhou, Beijing, Hainan and Hangzhou — each with its own specialties, price level and travel logistics."}
        </p>
      </section>

      {/* Grid */}
      <section className="container pb-16 md:pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CITIES.map((c) => {
            return (
              <Link
                key={c.slug}
                to={`/cities/${c.slug}`}
                className="group rounded-3xl bg-card shadow-soft hover:shadow-pop transition-all hover:-translate-y-1 overflow-hidden flex flex-col"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.en}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-background">
                    <div>
                      <p className="font-display text-3xl font-semibold leading-none">
                        {lang === "zh" ? c.zh : c.en}
                      </p>
                      <p className="text-xs opacity-80 mt-1">
                        {lang === "zh" ? c.en : c.zh}
                      </p>
                    </div>
                    <span className="pill bg-background/95 text-foreground text-[10px]"><Wallet className="size-3 text-primary" />{lang === "zh" ? "行程指南" : "Travel guide"}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col gap-3">
                  <p className="text-sm text-foreground/80 leading-snug">
                    {lang === "zh" ? c.taglineZh : c.taglineEn}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <Stat
                      icon={<Building2 className="size-3.5" />}
                      label={lang === "zh" ? "机构资料" : "Provider info"}
                      value={lang === "zh" ? "当地" : "Local"}
                    />
                    <Stat
                      icon={<Stethoscope className="size-3.5" />}
                      label={lang === "zh" ? "医生资料" : "Doctor profiles"}
                      value={lang === "zh" ? "审核后发布" : "Reviewed"}
                    />
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {(lang === "zh" ? c.hotZh : c.hotEn).slice(0, 4).map((h) => (
                      <span
                        key={h}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-3 flex items-center justify-between text-sm font-semibold text-primary">
                    {lang === "zh" ? "查看城市详情" : "Explore the city"}
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
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

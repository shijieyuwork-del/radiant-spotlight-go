import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Users, Stethoscope, Wallet, Plane, Building2 } from "lucide-react";
import CnNavbar from "@/components/CnNavbar";
import Footer from "@/components/Footer";
import { CITIES } from "@/data/cities";
import { DOCTORS } from "@/data/doctors";
import { useCn } from "@/lib/cn-i18n";

const Cities = () => {
  const { lang } = useCn();
  return (
    <div className="min-h-screen bg-background">
      <CnNavbar />

      {/* Hero */}
      <section className="container py-12 md:py-16">
        <span className="pill bg-accent text-accent-foreground mb-3">
          <MapPin className="size-3.5" />
          {lang === "en" ? "Top destinations" : "国内城市"}
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight max-w-3xl">
          {lang === "en" ? (
            <>
              Choose a city,{" "}
              <em className="text-primary not-italic">find your surgeon</em>
            </>
          ) : (
            <>
              选择城市，<em className="text-primary not-italic">找到主刀医生</em>
            </>
          )}
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          {lang === "en"
            ? "Six top medical-aesthetic cities in China — each with its own specialty, price level, and travel logistics for overseas Chinese patients."
            : "国内六大医美核心城市，各有强势项目、价格区间与适合海外华人的出行配套。"}
        </p>
      </section>

      {/* Grid */}
      <section className="container pb-16 md:pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CITIES.map((c) => {
            const cityDoctors = DOCTORS.filter(
              (d) => d.cityEn === c.en
            );
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
                        {lang === "en" ? c.en : c.zh}
                      </p>
                      <p className="text-xs opacity-80 mt-1">
                        {lang === "en" ? c.zh : c.en}
                      </p>
                    </div>
                    <span className="pill bg-background/95 text-foreground text-[10px]">
                      <Wallet className="size-3 text-primary" />
                      {lang === "en" ? `Save ${c.savings}` : `省 ${c.savings}`}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col gap-3">
                  <p className="text-sm text-foreground/80 leading-snug">
                    {lang === "en" ? c.taglineEn : c.taglineZh}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <Stat
                      icon={<Building2 className="size-3.5" />}
                      label={lang === "en" ? "Hospitals" : "正规机构"}
                      value={`${c.clinics}`}
                    />
                    <Stat
                      icon={<Stethoscope className="size-3.5" />}
                      label={lang === "en" ? "Surgeons" : "主刀医生"}
                      value={`${c.doctorsCount}`}
                    />
                    <Stat
                      icon={<Users className="size-3.5" />}
                      label={lang === "en" ? "On glowy" : "平台医师"}
                      value={`${cityDoctors.length}`}
                    />
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {(lang === "en" ? c.hotEn : c.hotZh).slice(0, 4).map((h) => (
                      <span
                        key={h}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-3 flex items-center justify-between text-sm font-semibold text-primary">
                    {lang === "en" ? "Explore the city" : "查看城市详情"}
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Travel callout */}
      <section className="container pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-[hsl(190,70%,92%)] via-[hsl(155,60%,90%)] to-[hsl(50,80%,92%)] p-6 md:p-8 grid md:grid-cols-3 gap-5 items-center shadow-soft">
          <div className="md:col-span-2">
            <h2 className="font-display text-2xl md:text-3xl font-semibold">
              {lang === "en"
                ? "Not sure which city fits you?"
                : "不确定选哪个城市？"}
            </h2>
            <p className="text-sm text-foreground/70 mt-2 max-w-xl">
              {lang === "en"
                ? "Tell us your procedure and travel window — we'll match a surgeon, hospital, and recovery hotel in the right city within 24 hours."
                : "告诉我们手术项目与回国时间，24 小时内为你匹配城市 / 主刀 / 恢复酒店一站式方案。"}
            </p>
          </div>
          <div className="flex md:justify-end">
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-semibold hover:bg-foreground/90 transition"
            >
              <Plane className="size-4" />
              {lang === "en" ? "Get matched" : "立即匹配主刀"}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
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

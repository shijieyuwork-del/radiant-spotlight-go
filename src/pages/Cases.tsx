import { useMemo, useState } from "react";
import { Heart, Search, Filter } from "lucide-react";
import CnNavbar from "@/components/CnNavbar";
import Footer from "@/components/Footer";
import TikTokWall from "@/components/TikTokWall";
import { Button } from "@/components/ui/button";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { useCn } from "@/lib/cn-i18n";

const Cases = () => {
  const { t, lang, fmt } = useCn();
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string>("all");

  const treatments = useMemo(() => {
    const set = new Map<string, string>();
    TIKTOK_CASES.forEach((c) => set.set(c.treatment.en, c.treatment[lang]));
    return Array.from(set, ([key, label]) => ({ key, label }));
  }, [lang]);

  const items = useMemo(() => {
    return TIKTOK_CASES.filter((c) => {
      if (active !== "all" && c.treatment.en !== active) return false;
      if (!q.trim()) return true;
      const hay = `${c.user.en} ${c.user.zh} ${c.caption.en} ${c.caption.zh} ${c.clinic.en} ${c.clinic.zh} ${c.treatment.en} ${c.treatment.zh}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [q, active]);

  return (
    <div className="min-h-screen bg-background">
      <CnNavbar />

      <section className="container py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="pill bg-accent text-accent-foreground mb-3"><Heart className="size-3.5" /> {t("cases.kicker")}</span>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            {t("cases.wallTitle")}
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
              placeholder={lang === "en" ? "Search by treatment, clinic or user…" : "搜索项目、机构或博主…"}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center mb-8">
          <span className="text-xs text-muted-foreground inline-flex items-center gap-1 mr-1"><Filter className="size-3" /></span>
          <Button
            variant={active === "all" ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setActive("all")}
          >
            {t("cases.tabAll")}
          </Button>
          {treatments.map((tr) => (
            <Button
              key={tr.key}
              variant={active === tr.key ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setActive(tr.key)}
            >
              {tr.label}
            </Button>
          ))}
        </div>

        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-12 text-sm">
            {lang === "en" ? "No matching cases — try a different filter." : "没有匹配的案例，换个筛选试试。"}
          </p>
        ) : (
          <TikTokWall items={items} lang={lang} fmtPrice={fmt} variant="wall" />
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Cases;

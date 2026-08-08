import { Link } from "react-router-dom";
import { BookOpen, Clock, ShieldAlert } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { TREATMENTS } from "@/data/treatments";
import { useAsia } from "@/lib/asia-i18n";
import { MEDICAL_DISCLAIMER } from "@/lib/seo-config";

const Treatments = () => {
  const { lang } = useAsia();
  const zh = lang === "zh";

  return (
    <>
      <PageMeta
        title="Cosmetic Surgery Procedures Explained | Recovery, Risks & Costs"
        description="Plain-language guides to rhinoplasty, blepharoplasty, facelift, liposuction, breast augmentation and tummy tuck: how each procedure works, who it suits, real recovery timelines, honest risks, and what to ask your surgeon."
        path="/treatments"
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />

        <section className="container py-12 md:py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="pill bg-accent text-accent-foreground mb-3">
              <BookOpen className="size-3.5" /> {zh ? "项目科普" : "Procedure guides"}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
              {zh ? "先看懂，再决定" : "Understand it first,"}{" "}
              <em className="text-primary not-italic">{zh ? "" : "then decide"}</em>
            </h1>
            <p className="mt-4 text-muted-foreground">
              {zh
                ? "每篇都写清楚：这是什么手术、通常适合谁、恢复真正要多久、有哪些风险，以及面诊时该问医生什么。包含不好听的部分。"
                : "Each guide covers what the procedure actually involves, who it tends to suit, how long recovery really takes, what can go wrong, and the questions worth asking at consultation. Including the unflattering parts."}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TREATMENTS.map((t) => (
              <Link
                key={t.slug}
                to={`/treatments/${t.slug}`}
                className="group rounded-2xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/50"
              >
                <h2 className="font-display text-xl font-medium tracking-tight group-hover:text-primary transition-colors">
                  {zh ? t.zh : t.en}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {zh ? t.summaryZh : t.summaryEn}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3" />
                    {t.recovery.length} {zh ? "个恢复阶段" : "recovery stages"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ShieldAlert className="size-3" />
                    {t.risksEn.length} {zh ? "项风险说明" : "risks listed"}
                  </span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {zh ? "参考区间" : "Typical range"} ${t.priceUsdLow.toLocaleString()}–$
                  {t.priceUsdHigh.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>

          <p className="mt-10 mx-auto max-w-3xl text-center text-xs text-muted-foreground leading-relaxed">
            {zh
              ? "以上内容为一般性医学科普，不构成诊疗建议。每个人的解剖条件、既往病史与用药情况不同，任何决定都应以面诊后执业医师的意见为准。"
              : MEDICAL_DISCLAIMER}
          </p>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Treatments;

import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CircleHelp, CircleSlash, Clock, DollarSign, ShieldAlert, Sparkles, Stethoscope } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { findTreatment } from "@/data/treatments";
import { useAsia } from "@/lib/asia-i18n";
import { MEDICAL_DISCLAIMER } from "@/lib/seo-config";

/** 小节容器，保持各段视觉一致 */
const Section = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mt-10">
    <h2 className="flex items-center gap-2 font-display text-2xl font-medium tracking-tight">
      <span className="text-primary">{icon}</span>
      {title}
    </h2>
    <div className="mt-4">{children}</div>
  </section>
);

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="space-y-2">
    {items.map((s, i) => (
      <li key={i} className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed">
        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60" />
        <span>{s}</span>
      </li>
    ))}
  </ul>
);

const TreatmentDetail = () => {
  const { slug = "" } = useParams();
  const { lang } = useAsia();
  const zh = lang === "zh";
  const t = findTreatment(slug);

  if (!t) {
    return (
      <>
        <PageMeta
          title="Procedure Not Found"
          description="The procedure guide you're looking for doesn't exist."
          path={`/treatments/${slug}`}
        />
        <div className="min-h-screen bg-background">
          <AsiaNavbar homeLinks={false} />
          <div className="container py-24 text-center">
            <h1 className="font-display text-3xl">{zh ? "未找到该项目" : "Procedure not found"}</h1>
            <Link to="/treatments" className="mt-4 inline-block text-primary hover:underline">
              {zh ? "查看全部项目" : "See all procedures"}
            </Link>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  const name = zh ? t.zh : t.en;

  // MedicalWebPage + FAQPage 组合：前者标明这是医学科普内容，
  // 后者让"面诊该问什么"有机会拿到 FAQ 富媒体摘要。
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: `${t.en} — Procedure Guide`,
    description: t.summaryEn,
    about: { "@type": "MedicalProcedure", name: t.en, procedureType: "https://schema.org/SurgicalProcedure" },
    audience: { "@type": "Patient" },
    lastReviewed: "2026-08-07",
  };

  return (
    <>
      <PageMeta
        title={`${t.en} — What It Involves, Recovery, Risks & Cost`}
        description={t.summaryEn}
        path={`/treatments/${t.slug}`}
        structuredData={schema}
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar homeLinks={false} />

        <article className="container max-w-3xl py-10 md:py-14">
          <Link
            to="/treatments"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="size-4" /> {zh ? "全部项目" : "All procedures"}
          </Link>

          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight">{name}</h1>
          <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
            {zh ? t.summaryZh : t.summaryEn}
          </p>

          <Section icon={<Sparkles className="size-5" />} title={zh ? "这是什么" : "What it is"}>
            <p className="text-sm text-muted-foreground leading-relaxed">{zh ? t.whatZh : t.whatEn}</p>
          </Section>

          <Section icon={<Stethoscope className="size-5" />} title={zh ? "常见术式" : "Common techniques"}>
            <Bullets items={zh ? t.techniquesZh : t.techniquesEn} />
          </Section>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <h3 className="font-medium">{zh ? "通常适合" : "Usually a good fit"}</h3>
              <div className="mt-3">
                <Bullets items={zh ? t.goodFitZh : t.goodFitEn} />
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <h3 className="flex items-center gap-1.5 font-medium">
                <CircleSlash className="size-4 text-muted-foreground" />
                {zh ? "通常不适合" : "Usually not a fit"}
              </h3>
              <div className="mt-3">
                <Bullets items={zh ? t.notFitZh : t.notFitEn} />
              </div>
            </div>
          </div>

          <Section icon={<Clock className="size-5" />} title={zh ? "恢复时间线" : "Recovery timeline"}>
            <ol className="space-y-4">
              {t.recovery.map((r, i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 w-28 pt-0.5 text-sm font-medium">{zh ? r.whenZh : r.whenEn}</span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{zh ? r.whatZh : r.whatEn}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section icon={<ShieldAlert className="size-5" />} title={zh ? "风险与并发症" : "Risks & complications"}>
            <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-5">
              <Bullets items={zh ? t.risksZh : t.risksEn} />
            </div>
          </Section>

          <Section icon={<CircleHelp className="size-5" />} title={zh ? "面诊时该问什么" : "What to ask at consultation"}>
            <Bullets items={zh ? t.askZh : t.askEn} />
          </Section>

          <Section icon={<DollarSign className="size-5" />} title={zh ? "费用参考" : "What it costs"}>
            <p className="font-display text-3xl font-medium tracking-tight">
              ${t.priceUsdLow.toLocaleString()} – ${t.priceUsdHigh.toLocaleString()}
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {zh ? t.priceNoteZh : t.priceNoteEn}
            </p>
          </Section>

          <p className="mt-12 rounded-2xl bg-muted/50 p-5 text-xs text-muted-foreground leading-relaxed">
            {zh
              ? "以上为一般性医学科普，不构成针对个人的诊疗建议。每个人的解剖条件、既往病史与用药情况不同，实际方案与风险应以面诊后执业医师的评估为准。"
              : MEDICAL_DISCLAIMER}
          </p>
        </article>

        <Footer />
      </div>
    </>
  );
};

export default TreatmentDetail;

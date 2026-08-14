import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  ExternalLink,
  FileCheck2,
  Newspaper,
  PlayCircle,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { useQuote } from "@/components/QuoteRequest";
import { useAsia } from "@/lib/asia-i18n";

const SOURCES = {
  isaps: "https://www.isaps.org/discover/about-isaps/global-statistics/global-survey-2024-full-report-and-press-releases/",
  isapsPdf: "https://www.isaps.org/media/razfvmsk/isaps-global-survey-2024.pdf",
  cna: "https://www.channelnewsasia.com/east-asia/china-medical-aesthetics-foreigners-beauty-tourism-industry-6272866",
  visa: "https://english.www.gov.cn/news/202511/04/content_WS69094ae0c6d00ca5f9a07472.html",
  patients: "https://www.isaps.org/discover/patients-home/",
  video: "https://www.youtube.com/watch?v=VIMTz4shW_U",
  videoEmbed: "https://www.youtube-nocookie.com/embed/VIMTz4shW_U?rel=0",
};

const WhyChina = () => {
  const { lang } = useAsia();
  const { open } = useQuote();
  const zh = lang === "zh";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Why China for Cosmetic Medical Travel",
    description: "A concise, source-led guide to cosmetic medical travel in China.",
    citation: [SOURCES.isaps, SOURCES.cna, SOURCES.visa, SOURCES.patients],
  };

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Why China for Cosmetic Surgery | Facts & Safety"
        description="Three evidence-based reasons to consider cosmetic medical travel in China, plus a practical safety checklist and original sources."
        path="/why-china"
        type="article"
        structuredData={schema}
      />
      <AsiaNavbar />

      <main>
        <section className="border-b border-border/60 bg-gradient-hero/60">
          <div className="container py-12 text-center md:py-16">
            <span className="pill mb-3 bg-accent text-accent-foreground">
              <FileCheck2 className="size-3.5 text-primary" />
              {zh ? "有来源，才值得相信" : "Source-led, not sales-led"}
            </span>
            <h1 className="mx-auto max-w-4xl font-display text-4xl font-medium leading-tight tracking-tight md:text-5xl">
              {zh ? (
                <>为什么选择中国？<em className="text-primary not-italic">30 秒看懂。</em></>
              ) : (
                <>Why China? <em className="text-primary not-italic">The 30-second answer.</em></>
              )}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {zh
                ? "不堆宣传词。这里只讲三个有来源的理由，以及你必须核验的安全事项。"
                : "No information overload. Just three sourced reasons—and the safety checks that still matter."}
            </p>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-xs font-semibold text-primary">{zh ? "三个重点" : "THREE THINGS TO KNOW"}</p>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <ReasonCard
                number="01"
                icon={<Stethoscope />}
                title={zh ? "医生人才池大" : "A large surgeon pool"}
                text={zh ? "ISAPS 估算中国有约 5,000 名整形外科医生，全球排名第三。" : "ISAPS estimates 5,000 plastic surgeons in China—the world's third-largest national pool."}
                source="ISAPS 2024"
                href={SOURCES.isapsPdf}
              />
              <ReasonCard
                number="02"
                icon={<Newspaper />}
                title={zh ? "海外关注正在增加" : "International interest is growing"}
                text={zh ? "CNA 报道指出，中国正凭借自然化审美、经验丰富的医生和具有竞争力的价格获得国际关注，为海外患者提供一个值得考虑的新选择。" : "China is gaining international attention for natural-looking aesthetics, experienced practitioners and competitive pricing—giving patients a compelling new option in Asia."}
                source="CNA"
                href={SOURCES.cna}
              />
              <ReasonCard
                number="03"
                icon={<FileCheck2 />}
                title={zh ? "行程选择更灵活" : "More flexible trip planning"}
                text={zh ? "符合条件的第三国过境旅客可使用 240 小时（10 天）过境免签；国籍、口岸及后续行程条件适用。" : "Eligible third-country transit travelers may use China's 240-hour (10-day) visa-free transit policy; nationality, port and onward-travel rules apply."}
                source={zh ? "中国官方政策" : "Official policy"}
                href={SOURCES.visa}
              />
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/35">
          <div className="container py-12 md:py-16">
            <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
              <div>
                <span className="pill mb-3 bg-accent text-accent-foreground">
                  <ShieldCheck className="size-3.5" /> {zh ? "安全核验" : "Safety first"}
                </span>
                <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
                  {zh ? "国家只是起点。医生才是决定。" : "Choose the surgeon—not just the country."}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {zh ? "国家数据不能证明某位医生安全。付款前，只确认下面四件事。" : "Country-level data cannot prove an individual surgeon is safe. Confirm these four items before paying."}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <CheckItem title={zh ? "医生执照与专科背景" : "Surgeon license & specialty"} />
                <CheckItem title={zh ? "实际手术机构许可" : "Operating facility license"} />
                <CheckItem title={zh ? "麻醉与紧急转诊方案" : "Anesthesia & emergency plan"} />
                <CheckItem title={zh ? "术后联系人与回国随访" : "Aftercare & follow-up owner"} />
              </div>
            </div>
            <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => open()} className="rounded-full px-7">
                {zh ? "帮我核验方案" : "Help me verify a plan"}<ArrowRight className="ml-2 size-4" />
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full bg-background px-7">
                <Link to="/doctors">{zh ? "查看医生" : "Explore doctors"}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="mx-auto grid max-w-5xl gap-7 lg:grid-cols-2 lg:items-center">
            <div className="aspect-video overflow-hidden rounded-3xl bg-foreground shadow-pop">
              <iframe
                className="size-full"
                src={SOURCES.videoEmbed}
                title="Shanghai Tourism Festival video on YouTube"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div>
              <span className="pill mb-3 bg-accent text-accent-foreground"><PlayCircle className="size-3.5" /> {zh ? "了解目的地" : "See the destination"}</span>
              <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
                {zh ? "先了解城市，再规划恢复行程。" : "See the city. Then plan the recovery stay."}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {zh ? "视频通过 YouTube 官方播放器嵌入，版权归原作者。文化活动只能在医生允许后安排。" : "Embedded through YouTube's official player; rights remain with the creator. Only plan activities after clinical clearance."}
              </p>
              <a href={SOURCES.video} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                {zh ? "在 YouTube 查看原视频" : "Watch on YouTube"}<ExternalLink className="size-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="border-t border-border/60">
          <div className="container py-10">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-sm font-semibold">{zh ? "原始来源" : "Original sources"}</h2>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm">
                <SourceLink label="ISAPS Global Survey 2024" href={SOURCES.isaps} />
                <SourceLink label="CNA independent report" href={SOURCES.cna} />
                <SourceLink label="China entry policy" href={SOURCES.visa} />
                <SourceLink label="ISAPS patient guidance" href={SOURCES.patients} />
              </div>
              <p className="mt-5 max-w-3xl text-xs leading-relaxed text-muted-foreground">
                {zh ? "重要提示：医美手术存在风险，效果因人而异。媒体报道和国家数据不能代替对具体医生、机构及治疗方案的独立核验。" : "Important: Cosmetic surgery involves risk and outcomes vary. Media coverage and national data do not replace individual verification of a surgeon, facility or treatment plan."}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const ReasonCard = ({ number, icon, title, text, source, href }: { number: string; icon: React.ReactNode; title: string; text: string; source: string; href: string }) => (
  <article className="rounded-3xl border bg-card p-6 shadow-soft">
    <div className="flex items-center justify-between">
      <span className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">{icon}</span>
      <span className="font-display text-2xl text-muted-foreground/40">{number}</span>
    </div>
    <h2 className="mt-5 font-display text-2xl font-medium tracking-tight">{title}</h2>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
    <a href={href} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
      {source}<ExternalLink className="size-3.5" />
    </a>
  </article>
);

const CheckItem = ({ title }: { title: string }) => (
  <div className="flex items-center gap-3 rounded-2xl border bg-card p-4">
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/15 text-primary"><BadgeCheck className="size-4" /></span>
    <p className="text-sm font-semibold">{title}</p>
  </div>
);

const SourceLink = ({ label, href }: { label: string; href: string }) => (
  <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary">
    {label}<ExternalLink className="size-3.5" />
  </a>
);

export default WhyChina;

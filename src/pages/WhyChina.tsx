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
  const ru = lang === "ru";
  const c = (en: string, cn: string, Russian: string) => zh ? cn : ru ? Russian : en;

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
              {c("Source-led, not sales-led", "有来源，才值得相信", "Факты, а не рекламные обещания")}
            </span>
            <h1 className="mx-auto max-w-4xl font-display text-4xl font-medium leading-tight tracking-tight md:text-5xl">
              {zh ? (
                <>为什么选择中国？<em className="text-primary not-italic">30 秒看懂。</em></>
              ) : ru ? (
                <>Почему Китай? <em className="text-primary not-italic">Ответ за 30 секунд.</em></>
              ) : (
                <>Why China? <em className="text-primary not-italic">The 30-second answer.</em></>
              )}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {c("No information overload. Just three sourced reasons—and the safety checks that still matter.", "不堆宣传词。这里只讲三个有来源的理由，以及你必须核验的安全事项。", "Без перегруженной рекламы: три подтверждённых аргумента и важные проверки безопасности.")}
            </p>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-xs font-semibold text-primary">{c("THREE THINGS TO KNOW", "三个重点", "ТРИ ВАЖНЫХ ФАКТА")}</p>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <ReasonCard
                number="01"
                icon={<Stethoscope />}
                title={c("A large surgeon pool", "医生人才池大", "Большой выбор хирургов")}
                text={c("ISAPS estimates 5,000 plastic surgeons in China—the world's third-largest national pool.", "ISAPS 估算中国有约 5,000 名整形外科医生，全球排名第三。", "По оценке ISAPS, в Китае около 5 000 пластических хирургов — третий по величине национальный пул в мире.")}
                source="ISAPS 2024"
                href={SOURCES.isapsPdf}
              />
              <ReasonCard
                number="02"
                icon={<Newspaper />}
                title={c("International interest is growing", "海外关注正在增加", "Международный интерес растёт")}
                text={c("China is gaining international attention for natural-looking aesthetics, experienced practitioners and competitive pricing—giving patients a compelling new option in Asia.", "CNA 报道指出，中国正凭借自然化审美、经验丰富的医生和具有竞争力的价格获得国际关注，为海外患者提供一个值得考虑的新选择。", "Китай привлекает международное внимание естественной эстетикой, опытом специалистов и конкурентными ценами, становясь заметным вариантом в Азии.")}
                source="CNA"
                href={SOURCES.cna}
              />
              <ReasonCard
                number="03"
                icon={<FileCheck2 />}
                title={c("More flexible trip planning", "行程选择更灵活", "Более гибкое планирование поездки")}
                text={c("Eligible third-country transit travelers may use China's 240-hour (10-day) visa-free transit policy; nationality, port and onward-travel rules apply.", "符合条件的第三国过境旅客可使用 240 小时（10 天）过境免签；国籍、口岸及后续行程条件适用。", "Путешественники, соответствующие условиям транзита через третью страну, могут воспользоваться 240-часовым безвизовым транзитом; действуют ограничения по гражданству, порту и дальнейшему маршруту.")}
                source={c("Official policy", "中国官方政策", "Официальная политика")}
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
                  <ShieldCheck className="size-3.5" /> {c("Safety first", "安全核验", "Безопасность прежде всего")}
                </span>
                <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
                  {c("Choose the surgeon—not just the country.", "国家只是起点。医生才是决定。", "Выбирайте хирурга, а не только страну.")}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {c("Country-level data cannot prove an individual surgeon is safe. Confirm these four items before paying.", "国家数据不能证明某位医生安全。付款前，只确认下面四件事。", "Статистика страны не подтверждает безопасность конкретного хирурга. Проверьте эти четыре пункта до оплаты.")}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <CheckItem title={c("Surgeon license & specialty", "医生执照与专科背景", "Лицензия и специализация хирурга")} />
                <CheckItem title={c("Operating facility license", "实际手术机构许可", "Лицензия медицинского учреждения")} />
                <CheckItem title={c("Anesthesia & emergency plan", "麻醉与紧急转诊方案", "План анестезии и экстренной помощи")} />
                <CheckItem title={c("Aftercare & follow-up owner", "术后联系人与回国随访", "Ответственный за послеоперационное наблюдение")} />
              </div>
            </div>
            <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => open()} className="rounded-full px-7">
                {c("Help me verify a plan", "帮我核验方案", "Помогите проверить план")}<ArrowRight className="ml-2 size-4" />
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full bg-background px-7">
                <Link to="/doctors">{c("Explore doctors", "查看医生", "Смотреть врачей")}</Link>
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
              <span className="pill mb-3 bg-accent text-accent-foreground"><PlayCircle className="size-3.5" /> {c("See the destination", "了解目的地", "Познакомьтесь с направлением")}</span>
              <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
                {c("See the city. Then plan the recovery stay.", "先了解城市，再规划恢复行程。", "Познакомьтесь с городом и спланируйте восстановление.")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {c("Embedded through YouTube's official player; rights remain with the creator. Only plan activities after clinical clearance.", "视频通过 YouTube 官方播放器嵌入，版权归原作者。文化活动只能在医生允许后安排。", "Видео встроено через официальный плеер YouTube; права принадлежат автору. Планируйте активности только после разрешения врача.")}
              </p>
              <a href={SOURCES.video} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                {c("Watch on YouTube", "在 YouTube 查看原视频", "Смотреть на YouTube")}<ExternalLink className="size-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="border-t border-border/60">
          <div className="container py-10">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-sm font-semibold">{c("Original sources", "原始来源", "Первоисточники")}</h2>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm">
                <SourceLink label="ISAPS Global Survey 2024" href={SOURCES.isaps} />
                <SourceLink label="CNA independent report" href={SOURCES.cna} />
                <SourceLink label="China entry policy" href={SOURCES.visa} />
                <SourceLink label="ISAPS patient guidance" href={SOURCES.patients} />
              </div>
              <p className="mt-5 max-w-3xl text-xs leading-relaxed text-muted-foreground">
                {c("Important: Cosmetic surgery involves risk and outcomes vary. Media coverage and national data do not replace individual verification of a surgeon, facility or treatment plan.", "重要提示：医美手术存在风险，效果因人而异。媒体报道和国家数据不能代替对具体医生、机构及治疗方案的独立核验。", "Важно: косметическая хирургия связана с рисками, а результаты индивидуальны. Публикации СМИ и национальная статистика не заменяют проверку конкретного хирурга, учреждения и плана лечения.")}
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

import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Play, Plus, Minus } from "lucide-react";
import { useAsia, type AsiaLang } from "@/lib/asia-i18n";
import { translatedUiText } from "@/lib/locale-text";
import { useQuote } from "@/components/QuoteRequest";
import { usePublishedVideos } from "@/hooks/use-published-videos";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { PROCEDURE_CATEGORIES } from "@/data/procedureCatalog";
import { ADDITIONAL_CLINICS } from "@/data/additionalClinics";
import { MEDICAL_TOURISM_GUIDES, medicalTourismGuidePath } from "@/data/medicalTourismGuides";
import { CITY_PRICE_PROCEDURES, CITY_PRICE_REFS } from "@/data/cityPriceRefs";
import { DEFAULT_VIDEO_POSTER } from "@/lib/cover-fallback";
import { cn } from "@/lib/utils";
import { consultationHandoffUrl } from "@/lib/consultation-handoff";
import "./platform-home.css";

const whatsappUrl = () => consultationHandoffUrl("whatsapp", { source: "home_price_strip" });

const tx = (lang: AsiaLang, en: string, zh?: string) => (lang === "zh" && zh ? zh : translatedUiText(lang, en));

/** Brand ring from the Sino Aesthetics mark, used as a small section glyph. */
export const BrandRing = ({ size = 14, light = false }: { size?: number; light?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true" className="shrink-0 overflow-visible">
    <path d="M88 19A45 45 0 1 0 88 101" stroke={light ? "#CEF3E3" : "#1C5A49"} strokeWidth="12" strokeLinecap="round" />
    <path d="M80 32A31 31 0 1 0 80 88" stroke="#55BE98" strokeWidth="10" strokeLinecap="round" />
    <circle cx="93" cy="64" r="9" fill="#55BE98" />
  </svg>
);

export const SectionHead = ({ eyebrow, title, link, linkText }: { eyebrow: string; title: ReactNode; link?: string; linkText?: string }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div className="flex flex-col gap-2">
      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-brand"><BrandRing />{eyebrow}</span>
      <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-[1.15] tracking-[-0.015em] text-foreground">{title}</h2>
    </div>
    {link && linkText && (
      <Link to={link} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        {linkText}<ArrowRight className="size-4" />
      </Link>
    )}
  </div>
);

const card = "rounded-2xl border border-[#E5E6EB] bg-white";

// ===================== Hero =====================
/** Hero content; the section shell and ambient video live in AsiaIndex. */
export const PlatformHeroContent = () => {
  const { lang } = useAsia();
  const { open: openQuote } = useQuote();
  const uploaded = usePublishedVideos(lang, "all");
  const tiles = useMemo(() => {
    const items = [...uploaded, ...TIKTOK_CASES].filter((item) => item.poster).slice(0, 24);
    const cols: typeof items[] = [[], [], []];
    items.forEach((item, i) => cols[i % 3].push(item));
    return cols;
  }, [uploaded]);
  const popular = [
    { en: "Double eyelid", zh: "双眼皮", to: "/treatments/blepharoplasty" },
    { en: "Rhinoplasty", zh: "鼻综合", to: "/treatments/rhinoplasty" },
    { en: "Facelift", zh: "拉皮", to: "/treatments/facelift" },
    { en: "Liposuction", zh: "吸脂", to: "/treatments/liposuction" },
  ];
  return (
        <div className="relative flex flex-wrap items-center justify-between gap-10 px-6 py-12 md:px-14 md:py-16">
          <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-6">
            <span className="inline-flex self-start items-center gap-2.5 rounded-full border border-white/25 bg-white/10 py-1.5 pl-1.5 pr-3.5 text-sm">
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-foreground">{tx(lang, "Offer", "优惠")}</span>
              {tx(lang, "Your first 2 hotel nights in China are on us*", "首两晚酒店由我们承担*")}
            </span>
            <h1 className="max-w-[720px] text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.025em]">
              {tx(lang, "Compare 100+ plastic surgeons in China.", "对比 100+ 位中国整形专家，")}{" "}
              <span className="text-primary">{tx(lang, "Find the one who fits you.", "找到最适合你的那一位。")}</span>
            </h1>
            <p className="max-w-[560px] text-lg leading-relaxed text-white/85">
              {tx(lang, "See each surgeon's hospital, focus and real prices side by side, meet them online before you fly, and let one coordinator handle the rest.", "并排比较每位专家的医院、擅长和真实价格，出发前先线上面诊，其余交给一位协调员。")}{" "}
              <Link to="/cases" className="font-semibold text-primary underline underline-offset-4">{tx(lang, "Or watch real patients’ diaries before you decide.", "或者先看看真实患者的日记。")}</Link>
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" data-testid="home-hero-cta" onClick={() => openQuote({ source: "home_hero" })} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-7 text-base font-semibold text-foreground">
                {tx(lang, "Get my quote", "获取报价")}<ArrowRight className="size-4" />
              </button>
              <Link to="/cases" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/50 px-6 text-base font-medium text-white">
                <Play className="size-4 fill-current" />{tx(lang, "Watch patient videos", "观看患者视频")}
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs text-white/60">{tx(lang, "Popular:", "热门：")}</span>
              {popular.map((p) => (
                <Link key={p.to} to={p.to} className="inline-flex min-h-9 items-center rounded-full border border-white/20 bg-white/10 px-3.5 text-sm text-white">{tx(lang, p.en, p.zh)}</Link>
              ))}
            </div>
          </div>
          <div aria-label={tx(lang, "Patient videos and results", "患者视频与案例")} className="ph-wall hidden h-[540px] min-w-0 flex-[0_1_460px] grid-cols-3 gap-2.5 overflow-hidden md:grid">
            {tiles.map((col, c) => (
              <div key={c} className="min-w-0">
                <div className="ph-wall-col flex flex-col gap-2.5" style={{ ["--ph-speed" as string]: `${[46, 58, 52][c]}s` }}>
                  {[...col, ...col].map((item, i) => (
                    <Link key={`${item.id}-${i}`} to={`/cases/${item.id}`} tabIndex={i >= col.length ? -1 : 0} aria-hidden={i >= col.length} className="relative block aspect-[9/16] overflow-hidden rounded-xl bg-[#0E2A22]">
                      <img src={item.poster ?? DEFAULT_VIDEO_POSTER} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
                      <span className="absolute left-1.5 top-1.5 max-w-[90%] truncate rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-foreground">{item.treatment[lang === "zh" ? "zh" : "en"]}</span>
                      <span aria-hidden="true" className="absolute bottom-1.5 right-1.5 grid size-6 place-items-center rounded-full bg-black/40"><Play className="size-2.5 fill-white text-white" /></span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
  );
};

// ===================== Stats =====================
export const PlatformStats = () => {
  const { lang } = useAsia();
  const stats = [
    { n: "100+", en: "partner surgeons", zh: "合作专家", to: "/doctors" },
    { n: "56", en: "procedures in 9 categories", zh: "个项目，9 大分类", to: "/treatments" },
    { n: "60+", en: "partner hospitals", zh: "家合作医院", to: "/clinics" },
    { n: "5", en: "cities across China", zh: "座城市", to: "/cities" },
    { n: "9", en: "languages supported", zh: "种语言", to: "/contact" },
  ];
  return (
    <section aria-label={tx(lang, "At a glance", "平台概况")} className="container pt-4">
      <div className={cn(card, "grid grid-cols-2 md:grid-cols-5")}>
        {stats.map((s, i) => (
          <Link key={s.n + s.en} to={s.to} className={cn("flex flex-col gap-1 px-6 py-5", i > 0 && "md:border-l md:border-[#F2F3F5]")}>
            <span className="text-[2.25rem] font-semibold leading-none tracking-[-0.015em] text-brand tabular-nums">{s.n}</span>
            <span className="text-sm text-muted-foreground">{tx(lang, s.en, s.zh)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

// ===================== Category browser =====================
const PRICE_BY_NAME: Record<string, string> = {
  "Double Eyelid Surgery": "¥8,000", Rhinoplasty: "¥22,800", Liposuction: "¥20,000", "Breast Augmentation": "¥45,000",
  Facelift: "¥58,000", "FUE Hair Transplant": "¥18,000", "Porcelain Veneers": "¥3,000", "Full-Mouth Reconstruction": "¥80,000",
};
export const PlatformCategoryBrowser = () => {
  const { lang } = useAsia();
  const [active, setActive] = useState(1);
  const cat = PROCEDURE_CATEGORIES[active];
  return (
    <section className="container pt-16">
      <SectionHead eyebrow={tx(lang, "Browse by category", "按分类浏览")} title={tx(lang, "Every procedure, one directory", "所有项目，一站查询")} link="/treatments" linkText={tx(lang, "All 56 procedures", "全部 56 个项目")} />
      <div className={cn(card, "flex min-h-[420px] flex-wrap overflow-hidden")}>
        <div role="tablist" aria-orientation="vertical" className="flex flex-[0_0_248px] flex-col border-r border-[#E5E6EB] bg-[#F7F8FA] py-2 max-md:flex-[1_1_100%] max-md:flex-row max-md:overflow-x-auto max-md:border-b max-md:border-r-0">
          {PROCEDURE_CATEGORIES.map((c, i) => (
            <button key={c.en} type="button" role="tab" aria-selected={i === active} onClick={() => setActive(i)}
              className={cn("flex min-h-[46px] shrink-0 items-center justify-between gap-2 px-5 py-3 text-left text-sm", i === active ? "bg-white font-semibold shadow-[inset_3px_0_0_#55BE98]" : "font-medium")}>
              <span className="flex flex-col leading-tight"><span>{c.en}</span><span className="text-xs font-normal text-[#6B7785]">{c.zh}</span></span>
              <span className="text-xs text-[#6B7785] tabular-nums">{c.items.length}</span>
            </button>
          ))}
        </div>
        <div role="tabpanel" className="flex min-w-0 flex-[1_1_520px] flex-col gap-4 p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <span className="flex items-baseline gap-2.5"><strong className="text-[1.375rem] font-semibold">{cat.en}</strong><span className="text-sm text-[#6B7785]">{cat.zh} · {cat.items.length} {tx(lang, "procedures", "个项目")}</span></span>
            <Link to="/treatments" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand">{tx(lang, "View category", "查看分类")}<ArrowRight className="size-4" /></Link>
          </div>
          <ul className="grid grid-cols-1 border-t border-[#F2F3F5] sm:grid-cols-2">
            {cat.items.map(([en, zh]) => (
              <li key={en} className="border-b border-[#F2F3F5]">
                <Link to="/treatments" className="flex min-h-11 items-center justify-between gap-3 py-3.5 pr-3">
                  <span className="flex min-w-0 flex-col"><span className="text-sm font-medium">{en}</span><span className="text-xs text-[#6B7785]">{zh}</span></span>
                  <span className={cn("shrink-0 text-sm font-semibold tabular-nums", PRICE_BY_NAME[en] ? "text-brand" : "text-[#6B7785]")}>{PRICE_BY_NAME[en] ? `${tx(lang, "from", "起")} ${PRICE_BY_NAME[en]}` : tx(lang, "Get quote", "获取报价")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

// ===================== Price board + hospitals =====================
const CITY_TABS = [["shanghai", "Shanghai", "上海"], ["beijing", "Beijing", "北京"], ["guangzhou", "Guangzhou", "广州"], ["hangzhou", "Hangzhou", "杭州"], ["hainan", "Hainan", "海南"]] as const;
export const PlatformPriceAndHospitals = () => {
  const { lang } = useAsia();
  const [cityRef, setCityRef] = useState(0);
  const [hospCity, setHospCity] = useState<string>("shanghai");
  const ref = CITY_PRICE_REFS[cityRef];
  const hospitals = (ADDITIONAL_CLINICS[hospCity] ?? []).slice(0, 6);
  const fmt = (cny: number) => `≈ ${ref.currency}${(Math.round(cny / ref.cnyPerUnit / 10) * 10).toLocaleString("en-US")}`;
  return (
    <section className="container flex flex-wrap items-stretch gap-4 pt-16">
      <div className={cn(card, "min-w-0 flex-[1.3_1_560px] p-7")}>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div className="flex flex-col gap-1.5"><span className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">{tx(lang, "Price board", "价格对比")}</span><h2 className="text-[1.375rem] font-semibold">{tx(lang, `China vs ${ref.label}, starting prices`, `中国对比${ref.label}起步价`)}</h2></div>
          <Link to="/treatments" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand">{tx(lang, "All prices", "全部价格")}<ArrowRight className="size-4" /></Link>
        </div>
        <div role="group" aria-label={tx(lang, "Compare with", "对比城市")} className="mb-2 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-[#6B7785]">{tx(lang, "Compare with", "对比")}</span>
          {CITY_PRICE_REFS.map((c, i) => (
            <button key={c.id} type="button" aria-pressed={i === cityRef} onClick={() => setCityRef(i)} className={cn("min-h-8 rounded-full border px-3 text-xs font-semibold", i === cityRef ? "border-foreground bg-foreground text-white" : "border-[#E5E6EB] bg-white")}>{c.label}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead><tr>
              <th scope="col" className="border-b border-[#E5E6EB] py-2.5 text-left text-xs font-semibold text-[#6B7785]">{tx(lang, "Procedure", "项目")}</th>
              <th scope="col" className="border-b border-[#E5E6EB] py-2.5 text-right text-xs font-semibold text-[#6B7785]">{tx(lang, "China, from", "中国起价")}</th>
              <th scope="col" className="border-b border-[#E5E6EB] py-2.5 text-right text-xs font-semibold text-[#6B7785]">{tx(lang, `${ref.label} typical*`, `${ref.label}参考价*`)}</th>
            </tr></thead>
            <tbody>
              {CITY_PRICE_PROCEDURES.map((p, i) => (
                <tr key={p.en}>
                  <th scope="row" className="border-b border-[#F2F3F5] py-3.5 text-left font-medium">{p.slug ? <Link to={`/treatments/${p.slug}`}>{p.en}</Link> : p.en} <span className="font-normal text-[#6B7785]">{p.zh}</span></th>
                  <td className="border-b border-[#F2F3F5] py-3.5 text-right font-semibold text-brand tabular-nums">{fmt(p.cny)} <span className="font-normal text-[#6B7785]">¥{p.cny.toLocaleString("en-US")}</span></td>
                  <td className="border-b border-[#F2F3F5] py-3.5 text-right text-[#6A7C75] tabular-nums">{ref.refs[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3.5 text-xs leading-relaxed text-[#6B7785]">*{ref.note} {tx(lang, "Your price is confirmed in writing after consultation.", "最终价格在面诊后以书面确认。")}</p>
      </div>
      <div className={cn(card, "flex min-w-0 flex-[1_1_400px] flex-col p-7")}>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div className="flex flex-col gap-1.5"><span className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">{tx(lang, "Hospital directory", "医院目录")}</span><h2 className="text-[1.375rem] font-semibold">{tx(lang, "60+ partner hospitals, 5 cities", "60+ 家合作医院，5 座城市")}</h2></div>
          <Link to="/clinics" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand">{tx(lang, "Browse all", "查看全部")}<ArrowRight className="size-4" /></Link>
        </div>
        <div role="group" className="mb-2 flex gap-1 overflow-x-auto rounded-xl bg-[#F7F8FA] p-1">
          {CITY_TABS.map(([id, en, zh]) => (
            <button key={id} type="button" aria-pressed={id === hospCity} onClick={() => setHospCity(id)} className={cn("min-h-10 flex-1 rounded-[9px] px-2.5 text-sm font-medium", id === hospCity && "bg-white shadow-[0_1px_3px_rgba(23,59,48,0.12)]")}>{tx(lang, en, zh)}</button>
          ))}
        </div>
        <ul>
          {hospitals.map((h) => (
            <li key={h.zh} className="flex justify-between gap-3 border-b border-[#F2F3F5] py-3">
              <span className="flex min-w-0 flex-col"><Link to="/clinics" className="truncate text-sm font-medium">{lang === "zh" ? h.zh : h.en}</Link><span className="text-xs text-[#6B7785]">{lang === "zh" ? h.en : h.zh}</span></span>
              <span className="shrink-0 text-xs text-[#6B7785]">{lang === "zh" ? h.areaZh : h.areaEn}</span>
            </li>
          ))}
        </ul>
        <Link to="/clinics" className="mt-3.5 inline-flex min-h-11 items-center text-sm font-semibold text-brand">{tx(lang, "View all hospitals", "查看全部医院")}</Link>
      </div>
    </section>
  );
};

// ===================== CTA strip, trust, steps, guides, FAQ, final CTA =====================
export const PlatformCtaStrip = () => {
  const { lang } = useAsia();
  const { open: openQuote } = useQuote();
  return (
    <section className="container pt-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#173B30] px-7 py-5 text-white">
        <span className="flex flex-col gap-0.5"><strong className="text-lg font-semibold">{tx(lang, "Seen a price you like?", "看到合适的价格了吗？")}</strong><span className="text-sm text-white/75">{tx(lang, "Get your exact quote from licensed hospitals in 2 minutes.", "2 分钟获取有资质医院的准确报价。")}</span></span>
        <span className="flex flex-wrap gap-2.5">
          <button type="button" onClick={() => openQuote({ source: "home_price_strip" })} className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 font-semibold text-foreground">{tx(lang, "Get my quote", "获取报价")}</button>
          <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-white/40 px-5 font-medium">WhatsApp</a>
        </span>
      </div>
    </section>
  );
};

export const PlatformTrust = () => {
  const { lang } = useAsia();
  const items = [
    ["Licensed hospitals", "Licence checked before listing", "持证医院", "上线前核查资质"],
    ["Written quote", "Confirmed before you fly", "书面报价", "出发前确认"],
    ["Airport pickup", "Met when you land", "机场接机", "落地即有人接"],
    ["2 hotel nights*", "On eligible journeys", "两晚酒店*", "符合条件的行程"],
    ["Interpreter", "At your clinic visits", "全程翻译", "陪同就诊"],
    ["Aftercare", "Follow ups from home", "术后随访", "回国后持续跟进"],
  ];
  return (
    <section aria-label={tx(lang, "What we take care of", "我们负责的事")} className="container pt-4">
      <div className={cn(card, "flex flex-wrap")}>
        {items.map(([en, enSub, zh, zhSub], i) => (
          <div key={en} className={cn("flex flex-[1_1_170px] items-start gap-3 px-6 py-5", i > 0 && "border-l border-[#F2F3F5]")}>
            <Check className="mt-0.5 size-[18px] shrink-0 text-brand" />
            <span className="flex flex-col"><strong className="text-sm font-semibold">{tx(lang, en, zh)}</strong><span className="text-xs text-[#6B7785]">{tx(lang, enSub, zhSub)}</span></span>
          </div>
        ))}
      </div>
    </section>
  );
};

export const PlatformSteps = () => {
  const { lang } = useAsia();
  const steps = [
    ["Tell us your goals", "Two minute form, any language", "告诉我们你的需求", "2 分钟表单，任何语言"],
    ["Get matched and quoted", "Licensed hospitals that fit", "匹配医院并报价", "匹配合适的持证医院"],
    ["Meet the surgeon online", "Video call with interpreter", "线上面诊专家", "视频通话，全程翻译"],
    ["Fly in, we handle the rest", "Pickup, hotel, surgery, follow up", "抵达后交给我们", "接机、酒店、手术、随访"],
  ];
  return (
    <section className="container pt-16">
      <SectionHead eyebrow={tx(lang, "How it works", "流程")} title={tx(lang, "Four steps, one coordinator", "四步完成，一位协调员全程负责")} link="/travel-packages" linkText={tx(lang, "See the full journey", "查看完整流程")} />
      <ol className={cn(card, "flex flex-wrap gap-6 p-8")}>
        {steps.map(([en, enSub, zh, zhSub], i) => (
          <li key={en} className="flex flex-[1_1_220px] flex-col gap-3">
            <span className="flex items-center gap-3">
              <span className={cn("grid size-10 shrink-0 place-items-center rounded-full border-[1.5px] border-primary text-sm font-semibold tabular-nums", i === 3 ? "bg-primary" : "bg-white")}>{i + 1}</span>
              <span aria-hidden="true" className={cn("h-[1.5px] flex-1", i < 3 ? "bg-[#E5E6EB]" : "bg-transparent")} />
            </span>
            <strong className="text-lg font-semibold">{tx(lang, en, zh)}</strong>
            <span className="text-sm text-muted-foreground">{tx(lang, enSub, zhSub)}</span>
          </li>
        ))}
      </ol>
    </section>
  );
};

export const PlatformGuides = () => {
  const { lang } = useAsia();
  const picks = ["costs", "safety", "choose-plastic-surgeon-china", "china-vs-korea-cosmetic-surgery"];
  const tones = ["bg-[#E7F3ED]", "bg-[#F5DBE3]", "bg-[#F4F3EB]", "bg-[#CEF3E3]"];
  const guides = picks.map((slug) => MEDICAL_TOURISM_GUIDES.find((g) => g.slug === slug)).filter(Boolean) as typeof MEDICAL_TOURISM_GUIDES;
  return (
    <section className="container pt-16">
      <SectionHead eyebrow={tx(lang, "Guides", "指南")} title={tx(lang, "Know before you go", "出发前必读")} link="/medical-tourism-china" linkText={tx(lang, "All guides", "全部指南")} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {guides.map((g, i) => (
          <Link key={g.slug} to={medicalTourismGuidePath(g.slug)} className={cn(card, "flex flex-col overflow-hidden")}>
            <span className={cn("flex h-28 items-end px-5 pb-4 text-xs font-semibold uppercase tracking-[0.08em] text-brand", tones[i])}>{g.kicker}</span>
            <span className="flex flex-1 flex-col gap-3 p-5"><strong className="text-base font-semibold leading-snug">{g.title}</strong><span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand">{tx(lang, "Read guide", "阅读指南")}<ArrowRight className="size-4" /></span></span>
          </Link>
        ))}
      </div>
    </section>
  );
};

const FAQ = [
  ["Is it safe to have surgery in China?", "We work with licensed hospitals and show each surgeon's hospital and focus. You meet the surgeon by video and decide only when you are comfortable.", "在中国做手术安全吗？", "我们只与持证医院合作，并展示每位专家所在医院与擅长方向。你会先通过视频面诊，觉得放心再决定。"],
  ["How much will it cost in total?", "The hospital confirms your price and what it includes in writing, before you book a flight. Flights and extra hotel nights are separate.", "总共要花多少钱？", "医院会在你订机票前书面确认价格和包含项目。机票和额外酒店另计。"],
  ["Do I pay you anything?", "The first conversation is free. Before you depart we collect a $200 coordination deposit, returned to you on surgery day. Medical fees are paid directly to the hospital.", "需要付费给你们吗？", "首次沟通免费。出发前收取 200 美元协调押金，手术当天退还。医疗费用直接支付给医院。"],
  ["What if I do not like the surgeon?", "Tell us. We will take you to meet another surgeon or visit another clinic.", "如果对专家不满意怎么办？", "告诉我们，我们会陪你另约专家或换一家机构。"],
  ["I do not speak Chinese. Is that a problem?", "No. Your coordinator writes in your language, and we go with you to clinic visits and on surgery day.", "不会中文有影响吗？", "没有。协调员用你的语言沟通，就诊和手术当天都会陪同。"],
  ["Are you the clinic?", "No. Sino Aesthetics coordinates your journey. Treatment is provided and billed by licensed hospitals.", "你们是医院吗？", "不是。Sino Aesthetics 负责协调行程，治疗由持证医院提供并收费。"],
];
export const PlatformFaq = () => {
  const { lang } = useAsia();
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section id="faq" className="container pt-16">
      <SectionHead eyebrow="FAQ" title={tx(lang, "The questions everyone asks first", "大家最常问的问题")} />
      <div className={cn(card, "grid grid-cols-1 gap-x-12 px-7 py-2 lg:grid-cols-2")}>
        {FAQ.map(([q, a, qz, az], i) => (
          <div key={q} className="border-b border-[#F2F3F5]">
            <button type="button" aria-expanded={openIdx === i} onClick={() => setOpenIdx(openIdx === i ? -1 : i)} className="flex min-h-11 w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold">
              <span>{tx(lang, q, qz)}</span>{openIdx === i ? <Minus className="size-4 shrink-0 text-brand" /> : <Plus className="size-4 shrink-0 text-brand" />}
            </button>
            {openIdx === i && <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{tx(lang, a, az)}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

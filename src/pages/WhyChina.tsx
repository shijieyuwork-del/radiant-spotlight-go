import { Link } from "react-router-dom";
import {
  ArrowRight, BadgeCheck, Building2, Check, CircleDollarSign, FileSearch,
  HeartPulse, Landmark, Leaf, MapPin, Plane, Scale, ShieldCheck, Sparkles,
  Stethoscope, Users, X,
} from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { useQuote } from "@/components/QuoteRequest";
import { useAsia } from "@/lib/asia-i18n";
import clinic1 from "@/assets/clinic1.jpg";
import clinic2 from "@/assets/clinic2.jpg";
import clinic3 from "@/assets/clinic3.jpg";

const SOURCE_ISAPS = "https://www.isaps.org/media/razfvmsk/isaps-global-survey-2024.pdf";
const SOURCE_HOSPITALS = "https://english.www.gov.cn/news/202402/07/content_WS65c37774c6d0868f4e8e3e01.html";
const SOURCE_WHO_TCM = "https://www.who.int/publications/i/item/9789240042322";
const SOURCE_FDA = "https://www.fda.gov/vaccines-blood-biologics/consumers-biologics/important-patient-and-consumer-information-about-regenerative-medicine-therapies";

const priceRows = [
  { en: "Rhinoplasty", zh: "鼻综合", china: "$2,600–$4,800", korea: "$3,500–$7,000", japan: "$5,500–$9,000" },
  { en: "Upper + lower eyelids", zh: "上下眼睑", china: "$900–$2,200", korea: "$1,500–$3,500", japan: "$2,100–$4,500" },
  { en: "SMAS facelift", zh: "SMAS 拉皮", china: "$6,800–$12,000", korea: "$8,500–$16,000", japan: "$12,000–$22,000" },
];

const cities = [
  { en: "Shanghai", zh: "上海", noteEn: "International hospitals, facial surgery and premium recovery", noteZh: "国际化医院、面部手术与高端恢复", image: clinic1 },
  { en: "Beijing", zh: "北京", noteEn: "Tertiary-hospital depth and complex-case consultation", noteZh: "三级医院资源与复杂病例会诊", image: clinic2 },
  { en: "Guangzhou", zh: "广州", noteEn: "High-volume aesthetic care and warm-weather recovery", noteZh: "高频医美项目与温暖气候恢复", image: clinic3 },
];

const WhyChina = () => {
  const { lang } = useAsia();
  const { open } = useQuote();
  const zh = lang === "zh";

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Why China for Medical Aesthetics | Compare China, Korea and Japan"
        description="Compare indicative prices, specialist depth, hospital standards and recovery support in China, South Korea and Japan."
        path="/why-china"
        type="article"
      />
      <AsiaNavbar />

      <main>
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--primary)/.16),transparent_34%),radial-gradient(circle_at_15%_85%,hsl(var(--accent)/.8),transparent_35%)]" />
          <div className="container relative py-14 md:py-24 grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
            <div>
              <span className="pill bg-primary/10 text-primary mb-5"><Landmark className="size-3.5" />{zh ? "为什么选择中国" : "WHY CHINA"}</span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-medium tracking-tight leading-[.98] max-w-4xl">
                {zh ? <>不只是价格更低，<em className="text-primary not-italic">而是一套更完整的恢复体验。</em></> : <>Not simply lower cost. <em className="text-primary not-italic">A more complete recovery experience.</em></>}
              </h1>
              <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {zh
                  ? "中国的优势来自庞大的专科医生体系、三级医院基础设施、可选择的中西医结合恢复支持，以及把术后休养与低强度文化体验结合起来的能力。"
                  : "China combines a large specialist base, deep tertiary-hospital infrastructure, optional integrative recovery support, and a travel model built around a clinically appropriate recovery schedule."}
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Button size="lg" onClick={() => open()} className="rounded-full px-7">{zh ? "获取个性化对比方案" : "Get my personalized comparison"}<ArrowRight className="size-4 ml-2" /></Button>
                <Button size="lg" variant="outline" asChild className="rounded-full px-7"><Link to="/cases">{zh ? "查看真实恢复日记" : "Watch real recovery diaries"}</Link></Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[2rem] overflow-hidden h-72 md:h-[420px] shadow-pop"><img src={clinic1} alt="Hospital in China" className="size-full object-cover" /></div>
              <div className="space-y-3 pt-10">
                <div className="rounded-[2rem] overflow-hidden h-40 md:h-52 shadow-soft"><img src={clinic2} alt="Medical consultation" className="size-full object-cover" /></div>
                <div className="rounded-3xl bg-foreground text-background p-5">
                  <p className="font-display text-3xl">5,000</p>
                  <p className="text-xs opacity-75 mt-1">{zh ? "ISAPS 估算的中国整形外科医师" : "estimated plastic surgeons in China"}</p>
                  <a href={SOURCE_ISAPS} target="_blank" rel="noreferrer" className="text-[10px] underline opacity-70 mt-3 inline-block">ISAPS Global Survey 2024</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="pill bg-accent text-accent-foreground mb-4"><Scale className="size-3.5" />{zh ? "数据对比" : "THE DATA, SIDE BY SIDE"}</span>
            <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight">{zh ? "韩国、日本很强。中国也值得认真比较。" : "Korea and Japan are strong. China belongs in the comparison."}</h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">{zh ? "我们不做“哪个国家绝对最好”的空洞宣传。真正重要的是具体医生、具体项目、具体机构与具体恢复计划。" : "There is no honest universal winner. The right decision depends on the named surgeon, procedure, facility, product and recovery plan—not a country stereotype."}</p>
          </div>

          <div className="mt-10 overflow-x-auto rounded-3xl border bg-card shadow-soft">
            <table className="w-full min-w-[760px] text-sm">
              <thead><tr className="border-b bg-muted/40"><th className="text-left p-5">{zh ? "比较维度" : "Comparison"}</th><th className="text-left p-5 bg-primary/5">🇨🇳 {zh ? "中国" : "China"}</th><th className="text-left p-5">🇰🇷 {zh ? "韩国" : "South Korea"}</th><th className="text-left p-5">🇯🇵 {zh ? "日本" : "Japan"}</th></tr></thead>
              <tbody>
                <CompareRow label={zh ? "估算整形外科医师" : "Estimated plastic surgeons"} china="5,000" korea="2,808" japan="4,000" highlight />
                <CompareRow label={zh ? "三级公立医院基础" : "Tertiary public-hospital base"} china={zh ? "2,817 家纳入官方评估" : "2,817 assessed nationally"} korea={zh ? "不同分级系统" : "Different national system"} japan={zh ? "不同分级系统" : "Different national system"} highlight />
                <CompareRow label={zh ? "中西医结合恢复" : "Optional integrative recovery"} china={zh ? "部分持证医院可提供" : "Available at selected licensed hospitals"} korea={zh ? "通常不是核心产品" : "Not typically central"} japan={zh ? "通常不是核心产品" : "Not typically central"} highlight />
                <CompareRow label={zh ? "适合的旅行模式" : "Typical travel model"} china={zh ? "城市休养 + 低强度文化体验" : "Urban recovery + gentle cultural stays"} korea={zh ? "高密度诊所行程" : "Clinic-dense city trip"} japan={zh ? "高服务标准、成本较高" : "High-service, higher-cost trip"} highlight />
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            {zh ? "医师数量来自 ISAPS 2024 全球调查，统计对象为通过专科认证或各国同等资质的整形外科医师；中国三级公立医院数据来自国家卫健委等部门的官方评估。国家间医院分级不可直接等同。" : "Surgeon counts are ISAPS 2024 estimates for board-certified or national-equivalent plastic surgeons. China's tertiary-hospital figure comes from an official national assessment. Hospital grading systems are not directly equivalent across countries."} {" "}
            <a href={SOURCE_ISAPS} target="_blank" rel="noreferrer" className="underline">ISAPS</a> · <a href={SOURCE_HOSPITALS} target="_blank" rel="noreferrer" className="underline">{zh ? "中国官方医院数据" : "China hospital data"}</a>
          </p>
        </section>

        <section className="bg-muted/35 border-y border-border/60">
          <div className="container py-16 md:py-24">
            <div className="grid lg:grid-cols-[.82fr_1.18fr] gap-10 items-start">
              <div className="lg:sticky lg:top-24">
                <span className="pill bg-primary/10 text-primary mb-4"><CircleDollarSign className="size-3.5" />{zh ? "价格快照" : "PRICE SNAPSHOT"}</span>
                <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight">{zh ? "把同一项目放在同一张表里。" : "Put like-for-like procedures on one page."}</h2>
                <p className="text-muted-foreground mt-4 leading-relaxed">{zh ? "以下不是官方全国均价，而是 Cosmetics Asia 于 2026 年 8 月收集的国际患者常见诊所询价区间，用于初步预算。最终价格必须以医生面诊后的书面明细为准。" : "These are not official national averages. They are indicative international-patient clinic quotes collected by Cosmetics Asia in August 2026 for early budgeting. A written, itemized post-consultation quote must control."}</p>
              </div>
              <div className="space-y-4">
                {priceRows.map((row) => <div key={row.en} className="rounded-3xl bg-card border shadow-soft p-5 md:p-6"><div className="flex items-center justify-between gap-3 mb-4"><h3 className="font-display text-xl font-semibold">{zh ? row.zh : row.en}</h3><span className="text-[10px] uppercase tracking-wider text-muted-foreground">USD · {zh ? "参考" : "indicative"}</span></div><div className="grid grid-cols-3 gap-2"><PriceCell country="🇨🇳 China" value={row.china} active /><PriceCell country="🇰🇷 Korea" value={row.korea} /><PriceCell country="🇯🇵 Japan" value={row.japan} /></div></div>)}
                <div className="rounded-2xl bg-amber-500/10 border border-amber-500/25 p-4 text-sm text-foreground/80"><strong>{zh ? "比较前先确认：" : "Before comparing:"}</strong> {zh ? "麻醉、植入材料、住院、翻译、药品与复诊是否包含。最低价不等于总成本。" : "Confirm anesthesia, implants, hospital stay, interpretation, medication and follow-up. The lowest headline price is not necessarily the lowest total cost."}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative"><img src={clinic3} alt="Integrative recovery support in China" className="w-full h-[430px] object-cover rounded-[2rem] shadow-pop" /><div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-background/90 backdrop-blur p-4 flex gap-3"><Leaf className="size-5 text-primary shrink-0" /><p className="text-sm"><strong>{zh ? "可选，不是替代。" : "Optional, never a substitute."}</strong><br/><span className="text-muted-foreground">{zh ? "所有调理项目必须由持证专业人员评估，并服从主刀医生的术后方案。" : "Any integrative service must be cleared by the operating team and delivered by licensed professionals."}</span></p></div></div>
            <div>
              <span className="pill bg-accent text-accent-foreground mb-4"><Leaf className="size-3.5" />{zh ? "中国式恢复" : "CHINA'S RECOVERY DIFFERENCE"}</span>
              <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight">{zh ? "现代外科之后，增加一层有边界的恢复支持。" : "After modern surgery, an optional layer of integrative support."}</h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">{zh ? "中国的独特性不应被包装成“中医治愈一切”，而是有机会在正规医院体系内，把营养、睡眠、活动指导与经过医生同意的传统调理纳入一个恢复计划。" : "The credible proposition is not that traditional medicine cures everything. It is the ability, at selected licensed hospitals, to coordinate nutrition, sleep, mobility guidance and surgeon-cleared traditional practices within one recovery plan."}</p>
              <div className="grid sm:grid-cols-2 gap-3 mt-6">
                <Feature icon={<HeartPulse />} title={zh ? "术后症状监测" : "Post-op monitoring"} text={zh ? "红旗症状、伤口与疼痛升级机制" : "Wound, pain and red-flag escalation protocols"} />
                <Feature icon={<Leaf />} title={zh ? "可选传统调理" : "Optional traditional care"} text={zh ? "须经主刀同意，避免药物相互作用" : "Surgeon-cleared with interaction screening"} />
                <Feature icon={<Stethoscope />} title={zh ? "现代康复优先" : "Modern rehab first"} text={zh ? "活动、营养、睡眠和规范复诊" : "Mobility, nutrition, sleep and scheduled reviews"} />
                <Feature icon={<FileSearch />} title={zh ? "书面恢复计划" : "Written recovery plan"} text={zh ? "回国后仍能继续随访" : "Structured follow-up after returning home"} />
              </div>
              <p className="text-xs text-muted-foreground mt-5">{zh ? "WHO 已发布中医药国际标准术语，用于规范专业沟通；这不等同于对任何具体美容术后疗效的背书。" : "WHO publishes international standard terminology for TCM to support consistent professional communication; this is not an endorsement of any specific cosmetic post-operative claim."} <a href={SOURCE_WHO_TCM} target="_blank" rel="noreferrer" className="underline">WHO</a></p>
            </div>
          </div>
        </section>

        <section className="bg-foreground text-background">
          <div className="container py-16 md:py-20 grid lg:grid-cols-[.95fr_1.05fr] gap-10 items-center">
            <div>
              <span className="pill bg-background/10 text-background mb-4"><ShieldCheck className="size-3.5" />{zh ? "创新，但必须可验证" : "INNOVATION, WITH GUARDRAILS"}</span>
              <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight">{zh ? "新材料与再生医学：只看批准状态，不听营销话术。" : "New materials and regenerative medicine: verify approval, not hype."}</h2>
              <p className="mt-4 text-background/70 leading-relaxed">{zh ? "部分中国医院在新型医用材料、组织工程与细胞研究方面有强大科研能力，但“研究领先”不等于某项产品已经获批用于美容治疗。" : "Some Chinese hospitals have strong research capability in biomaterials, tissue engineering and cell science. Research leadership does not mean a product is approved for routine cosmetic treatment."}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Guardrail ok title={zh ? "可以进入候选方案" : "Can enter consideration"} items={zh ? ["产品可在中国药监系统查询", "适应症与实际用途一致", "医院伦理与知情同意文件完整", "批号、生产商与不良事件路径明确"] : ["Product traceable in China's regulator database", "Approved indication matches proposed use", "Hospital ethics and consent documents available", "Lot, manufacturer and adverse-event pathway documented"]} />
              <Guardrail title={zh ? "不能作为卖点" : "Not acceptable as a sales claim"} items={zh ? ["“干细胞抗衰”但无法提供批准文件", "用临床试验登记冒充上市许可", "外泌体或细胞产品承诺确定疗效", "拒绝提供产品名称和批号"] : ["“Stem-cell anti-aging” without approval evidence", "Trial registration presented as market approval", "Guaranteed outcomes from cells or exosomes", "Refusal to disclose product and lot details"]} />
            </div>
            <p className="lg:col-span-2 text-xs text-background/60">{zh ? "面向美国患者的额外提醒：FDA 表示，美国目前获批的干细胞产品仅限来源于脐带血、用于造血系统疾病的造血祖细胞产品；赴海外接受相关治疗不受 FDA 监管。" : "Additional note for US patients: FDA states that currently approved US stem-cell products are limited to blood-forming stem cells derived from cord blood for disorders affecting blood production; FDA does not oversee treatments performed abroad."} <a href={SOURCE_FDA} target="_blank" rel="noreferrer" className="underline">FDA consumer information</a></p>
          </div>
        </section>

        <section className="container py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto"><span className="pill bg-primary/10 text-primary mb-4"><Plane className="size-3.5" />{zh ? "深度游 + 医美" : "RECOVER + DISCOVER"}</span><h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight">{zh ? "文化体验围绕恢复安排，而不是拿恢复冒险。" : "Culture planned around recovery—not recovery risked for tourism."}</h2><p className="text-muted-foreground mt-4">{zh ? "真正专业的行程会把活动强度交给医生决定：手术前体验城市，早期恢复以安静休养为主，获得许可后再安排短途、低强度活动。" : "A responsible itinerary lets the clinical team set the pace: explore before surgery, rest during early recovery, and add short low-intensity experiences only after clearance."}</p></div>
          <div className="grid md:grid-cols-3 gap-5 mt-10">
            {cities.map((city, index) => <article key={city.en} className="rounded-3xl overflow-hidden bg-card border shadow-soft"><div className="h-48 relative"><img src={city.image} alt={city.en} className="size-full object-cover"/><span className="absolute top-3 left-3 pill bg-background/90 text-foreground"><MapPin className="size-3"/>{zh ? city.zh : city.en}</span></div><div className="p-5"><p className="text-xs text-primary font-semibold">{zh ? `恢复阶段 ${index + 1}` : `RECOVERY-FRIENDLY OPTION`}</p><h3 className="font-display text-2xl font-semibold mt-1">{zh ? city.zh : city.en}</h3><p className="text-sm text-muted-foreground mt-2">{zh ? city.noteZh : city.noteEn}</p></div></article>)}
          </div>
          <div className="mt-6 rounded-3xl bg-gradient-mint p-6 md:p-8 grid md:grid-cols-[1fr_auto] gap-6 items-center"><div><h3 className="font-display text-2xl md:text-3xl font-semibold">{zh ? "让医生先定恢复窗口，再由我们设计行程。" : "Let the surgeon set the recovery window. We design the trip around it."}</h3><p className="text-sm text-foreground/70 mt-2">{zh ? "城市匹配、签证邀请函、接机、翻译、恢复酒店与术后复诊统一协调。" : "City matching, visa letter, airport pickup, interpretation, recovery hotel and follow-up—coordinated in one plan."}</p></div><Button size="lg" onClick={() => open()} className="rounded-full px-7">{zh ? "设计我的中国医美行程" : "Design my China care trip"}<ArrowRight className="size-4 ml-2"/></Button></div>
        </section>

        <section className="border-t bg-muted/35"><div className="container py-14"><div className="grid md:grid-cols-[1fr_auto] gap-6 items-center"><div><h2 className="font-display text-3xl font-semibold">{zh ? "比较国家，更要比较具体方案。" : "Compare countries. Then compare the actual plan."}</h2><p className="text-muted-foreground mt-2 max-w-2xl">{zh ? "我们会给你医生资质、机构许可、材料信息、完整报价和恢复安排，而不是只发一张最低价海报。" : "We provide named credentials, facility licensing, product details, an itemized quote and a recovery schedule—not just a lowest-price graphic."}</p></div><Button onClick={() => open()} size="lg" className="rounded-full">{zh ? "免费获取方案" : "Request a free comparison"}</Button></div></div></section>
      </main>
      <Footer />
    </div>
  );
};

const CompareRow = ({ label, china, korea, japan, highlight = false }: { label: string; china: string; korea: string; japan: string; highlight?: boolean }) => <tr className="border-b last:border-0"><th className="text-left font-medium p-5">{label}</th><td className={`p-5 font-semibold ${highlight ? "bg-primary/5 text-foreground" : ""}`}>{china}</td><td className="p-5 text-muted-foreground">{korea}</td><td className="p-5 text-muted-foreground">{japan}</td></tr>;

const PriceCell = ({ country, value, active = false }: { country: string; value: string; active?: boolean }) => <div className={`rounded-2xl p-3 ${active ? "bg-primary/10 ring-1 ring-primary/25" : "bg-muted/55"}`}><p className="text-[10px] text-muted-foreground">{country}</p><p className="font-display text-base md:text-xl font-semibold mt-1">{value}</p>{active && <p className="text-[10px] text-primary mt-1 flex items-center gap-1"><Check className="size-3"/>Lowest range</p>}</div>;

const Feature = ({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) => <div className="rounded-2xl border bg-card p-4 flex gap-3"><div className="size-9 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0 [&>svg]:size-4">{icon}</div><div><p className="font-semibold text-sm">{title}</p><p className="text-xs text-muted-foreground mt-1">{text}</p></div></div>;

const Guardrail = ({ ok = false, title, items }: { ok?: boolean; title: string; items: string[] }) => <div className={`rounded-3xl p-5 ${ok ? "bg-emerald-400/10 border border-emerald-300/20" : "bg-background/10 border border-background/15"}`}><div className="flex items-center gap-2 font-semibold">{ok ? <BadgeCheck className="size-5 text-emerald-300"/> : <X className="size-5 text-rose-300"/>}{title}</div><ul className="mt-4 space-y-3">{items.map(item => <li key={item} className="text-sm text-background/75 flex gap-2"><span className="mt-1 size-1.5 rounded-full bg-background/45 shrink-0"/>{item}</li>)}</ul></div>;

export default WhyChina;

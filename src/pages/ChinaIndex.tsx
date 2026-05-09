import { Link } from "react-router-dom";
import {
  Sparkles, ArrowRight, Star, MapPin, ShieldCheck, BadgeCheck,
  Search, Heart, MessageCircle, Stethoscope, FileCheck2, Building2,
  Flame, Gift, Wallet, Users, Plane, Languages, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Footer from "@/components/Footer";
import TikTokWall from "@/components/TikTokWall";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { useCn, cnLangLabel as langLabel, type CnLang as Lang } from "@/lib/cn-i18n";
import heroBg from "@/assets/hero-bg.jpg";
import v1 from "@/assets/video1.jpg";
import v2 from "@/assets/video2.jpg";
import v3 from "@/assets/video3.jpg";
import v4 from "@/assets/video4.jpg";
import v5 from "@/assets/video5.jpg";
import v6 from "@/assets/video6.jpg";
import c1 from "@/assets/clinic1.jpg";
import c2 from "@/assets/clinic2.jpg";
import c3 from "@/assets/clinic3.jpg";

// ============== Navbar (extracted to components/CnNavbar) ==============
import CnNavbar from "@/components/CnNavbar";

// ============== Data (bilingual) ==============
const cities = [
  { zh: "上海", en: "Shanghai", clinics: 128, hot: { en: ["HA Filler", "Thermage", "Double Eyelid"], zh: ["玻尿酸", "热玛吉", "双眼皮"] } },
  { zh: "北京", en: "Beijing", clinics: 142, hot: { en: ["Rhinoplasty", "Thermage", "Fat Transfer"], zh: ["鼻综合", "热玛吉", "脂肪填充"] } },
  { zh: "成都", en: "Chengdu", clinics: 96, hot: { en: ["Double Eyelid", "Botox", "Skin Booster"], zh: ["双眼皮", "瘦脸针", "水光针"] } },
  { zh: "杭州", en: "Hangzhou", clinics: 71, hot: { en: ["HA Filler", "IPL", "Thread Lift"], zh: ["玻尿酸", "光子嫩肤", "线雕"] } },
  { zh: "广州", en: "Guangzhou", clinics: 88, hot: { en: ["Rhinoplasty", "Liposuction", "Botox"], zh: ["鼻综合", "吸脂", "瘦脸针"] } },
  { zh: "深圳", en: "Shenzhen", clinics: 79, hot: { en: ["Thermage", "HA Filler", "Double Eyelid"], zh: ["热玛吉", "玻尿酸", "双眼皮"] } },
];

type Treatment = {
  zh: string; en: string; emoji: string; from: number; orig?: number;
  groupPrice?: number; tag?: { en: string; zh: string }; grad: string;
};
const treatments: Treatment[] = [
  { zh: "双眼皮全切", en: "Double Eyelid (incisional)", emoji: "👀", from: 4800, orig: 7800, groupPrice: 3980, tag: { en: "New patient", zh: "新人专享" }, grad: "from-[hsl(155,60%,80%)] to-[hsl(50,80%,90%)]" },
  { zh: "鼻综合", en: "Rhinoplasty (full)", emoji: "👃", from: 18800, orig: 28000, groupPrice: 15800, tag: { en: "Group of 3", zh: "团购3人成团" }, grad: "from-[hsl(340,85%,88%)] to-[hsl(18,90%,88%)]" },
  { zh: "玻尿酸 1ml", en: "HA Filler 1ml", emoji: "💧", from: 980, orig: 1980, tag: { en: "TOP 1", zh: "热度TOP1" }, grad: "from-[hsl(190,70%,88%)] to-[hsl(155,70%,88%)]" },
  { zh: "热玛吉 第五代", en: "Thermage FLX (Gen 5)", emoji: "🔥", from: 12800, orig: 19800, groupPrice: 11800, tag: { en: "Sale", zh: "618特价" }, grad: "from-[hsl(18,90%,88%)] to-[hsl(50,80%,90%)]" },
  { zh: "瘦脸针 100u", en: "Botox 100u", emoji: "💎", from: 680, orig: 1280, tag: { en: "Authentic", zh: "正品溯源" }, grad: "from-[hsl(158,60%,82%)] to-[hsl(155,70%,90%)]" },
  { zh: "水光针 嗨体", en: "Skin Booster (Hi-Body)", emoji: "✨", from: 880, orig: 1680, grad: "from-[hsl(50,80%,90%)] to-[hsl(340,85%,90%)]" },
  { zh: "脂肪填充 全面部", en: "Full-face Fat Transfer", emoji: "🪞", from: 9800, orig: 15800, groupPrice: 8800, tag: { en: "Recommended", zh: "推荐" }, grad: "from-[hsl(340,85%,90%)] to-[hsl(155,60%,85%)]" },
  { zh: "光子嫩肤 DPL", en: "DPL Photofacial", emoji: "🌟", from: 580, orig: 980, grad: "from-[hsl(155,60%,85%)] to-[hsl(190,70%,88%)]" },
];

type Clinic = {
  zh: string; en: string;
  cityZh: string; cityEn: string;
  img: string; rating: number; reviews: number;
  levelZh: string; levelEn: string;
  license: string; beian: string; years: number;
  topZh: string; topEn: string;
};
const clinics: Clinic[] = [
  { zh: "上海华美医疗美容医院", en: "Shanghai Huamei Plastic Surgery Hospital", cityZh: "上海·徐汇", cityEn: "Shanghai · Xuhui", img: c1, rating: 4.9, reviews: 12480, levelZh: "三级整形外科医院", levelEn: "Tier-3 Plastic Surgery Hospital", license: "PDY12-31010520210034", beian: "沪卫医字(2021)第0034号", years: 18, topZh: "鼻综合 / 双眼皮", topEn: "Rhinoplasty / Double Eyelid" },
  { zh: "北京艺星医疗美容医院", en: "Beijing Yestar Aesthetic Hospital", cityZh: "北京·朝阳", cityEn: "Beijing · Chaoyang", img: c2, rating: 4.88, reviews: 9821, levelZh: "二级专科医院", levelEn: "Tier-2 Specialty Hospital", license: "PDY12-11010520180108", beian: "京卫医字(2018)第0108号", years: 12, topZh: "热玛吉 / 玻尿酸", topEn: "Thermage / HA Filler" },
  { zh: "成都美莱医学美容医院", en: "Chengdu Meilai Medical Aesthetic Hospital", cityZh: "成都·锦江", cityEn: "Chengdu · Jinjiang", img: c3, rating: 4.85, reviews: 8210, levelZh: "二级整形外科医院", levelEn: "Tier-2 Plastic Surgery Hospital", license: "PDY12-51010320190212", beian: "蓉卫医字(2019)第0212号", years: 15, topZh: "双眼皮 / 瘦脸针", topEn: "Double Eyelid / Botox" },
  { zh: "杭州时光医疗美容医院", en: "Hangzhou Shiguang Aesthetic Hospital", cityZh: "杭州·西湖", cityEn: "Hangzhou · West Lake", img: c1, rating: 4.86, reviews: 5642, levelZh: "二级整形外科医院", levelEn: "Tier-2 Plastic Surgery Hospital", license: "PDY12-33010620200417", beian: "浙卫医字(2020)第0417号", years: 10, topZh: "光子嫩肤 / 玻尿酸", topEn: "Photofacial / HA Filler" },
  { zh: "广州曙光医疗美容门诊部", en: "Guangzhou Shuguang Aesthetic Clinic", cityZh: "广州·天河", cityEn: "Guangzhou · Tianhe", img: c2, rating: 4.78, reviews: 4920, levelZh: "医疗美容门诊部", levelEn: "Aesthetic Outpatient Clinic", license: "PDY12-44010620190308", beian: "粤卫医字(2019)第0308号", years: 8, topZh: "吸脂 / 瘦脸针", topEn: "Liposuction / Botox" },
  { zh: "深圳鹏程医疗美容医院", en: "Shenzhen Pengcheng Aesthetic Hospital", cityZh: "深圳·福田", cityEn: "Shenzhen · Futian", img: c3, rating: 4.82, reviews: 6310, levelZh: "二级专科医院", levelEn: "Tier-2 Specialty Hospital", license: "PDY12-44030420180521", beian: "深卫医字(2018)第0521号", years: 11, topZh: "热玛吉 / 双眼皮", topEn: "Thermage / Double Eyelid" },
];

type Doctor = {
  zh: string; en: string;
  titleZh: string; titleEn: string;
  clinicZh: string; clinicEn: string;
  cityZh: string; cityEn: string;
  img: string; license: string;
  qualZh: string; qualEn: string;
  years: number; surgeries: string;
  specZh: string[]; specEn: string[];
};
const doctors: Doctor[] = [
  { zh: "李文志 主任医师", en: "Dr. Li Wenzhi · Chief Surgeon", titleZh: "整形外科 副主任", titleEn: "Deputy Director, Plastic Surgery", clinicZh: "上海华美医疗美容医院", clinicEn: "Shanghai Huamei Plastic Surgery Hospital", cityZh: "上海", cityEn: "Shanghai", img: v4, license: "1413010320180123456", qualZh: "卫健委主诊医师 · 中华医学会整形外科学分会会员", qualEn: "NHC Attending Surgeon · Member, Chinese Society of Plastic Surgery", years: 22, surgeries: "8,200+", specZh: ["鼻综合", "全切双眼皮", "面部轮廓"], specEn: ["Rhinoplasty", "Double Eyelid", "Facial Contouring"] },
  { zh: "王晓琳 主治医师", en: "Dr. Wang Xiaolin · Attending", titleZh: "皮肤美容科", titleEn: "Aesthetic Dermatology", clinicZh: "北京艺星医疗美容医院", clinicEn: "Beijing Yestar Aesthetic Hospital", cityZh: "北京", cityEn: "Beijing", img: v2, license: "1411010520190234567", qualZh: "卫健委主诊医师 · 美国 Solta 热玛吉认证医师", qualEn: "NHC Attending · Solta Thermage Certified (USA)", years: 14, surgeries: "12,000+", specZh: ["热玛吉", "玻尿酸", "肉毒素"], specEn: ["Thermage", "HA Filler", "Botox"] },
  { zh: "陈嘉豪 副主任医师", en: "Dr. Chen Jiahao · Associate Chief", titleZh: "整形外科 主任", titleEn: "Director, Plastic Surgery", clinicZh: "成都美莱医学美容医院", clinicEn: "Chengdu Meilai Medical Aesthetic Hospital", cityZh: "成都", cityEn: "Chengdu", img: v3, license: "1415103200170345678", qualZh: "卫健委主诊医师 · 韩国 BK 医院研修", qualEn: "NHC Attending · Trained at BK Hospital, Korea", years: 18, surgeries: "5,400+", specZh: ["双眼皮", "脂肪填充", "鼻修复"], specEn: ["Double Eyelid", "Fat Transfer", "Rhino Revision"] },
];

const cases = [
  { src: v4, zhUser: "@小敏_上海", enUser: "@MinShanghai", zhCap: "全切双眼皮第30天｜华美 李文志主任", enCap: "Day 30 — Double eyelid · Huamei Shanghai", likes: "24k", comments: "812", priceCny: 6800 },
  { src: v2, zhUser: "@Rosie", enUser: "@Rosie", zhCap: "鼻综合术后6个月对比｜北京艺星", enCap: "Rhinoplasty · 6-month reveal · Beijing Yestar", likes: "56k", comments: "1.2k", priceCny: 22800 },
  { src: v3, zhUser: "@嘉嘉_Cd", enUser: "@JiaChengdu", zhCap: "热玛吉第五代真实体验｜成都美莱", enCap: "Thermage FLX honest review · Chengdu Meilai", likes: "18k", comments: "624", priceCny: 12800 },
  { src: v6, zhUser: "@甜甜圈", enUser: "@Donutgirl", zhCap: "脂肪填充全面部 90天 vlog", enCap: "Full-face fat transfer · 90-day vlog", likes: "9.8k", comments: "412", priceCny: 9800 },
  { src: v1, zhUser: "@momo", enUser: "@momo", zhCap: "玻尿酸下巴 即刻效果对比", enCap: "Chin filler · before & after on the spot", likes: "32k", comments: "904", priceCny: 1980 },
  { src: v5, zhUser: "@Lulu", enUser: "@Lulu", zhCap: "水光针嗨体熬夜脸救星", enCap: "Skin booster — late-night face savior", likes: "11k", comments: "388", priceCny: 980 },
];

// ============== Sections ==============
const Hero = () => {
  const { t, lang, fmt } = useCn();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <img src={heroBg} alt="" className="absolute inset-0 size-full object-cover opacity-40 mix-blend-multiply" />
      <div className="absolute -top-20 -left-10 size-72 bg-gradient-mint blur-3xl opacity-60 animate-blob" />
      <div className="absolute top-40 right-0 size-80 bg-gradient-peach blur-3xl opacity-50 animate-blob" style={{ animationDelay: "2s" }} />

      <div className="container relative py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="pill bg-card/80 backdrop-blur shadow-soft">
              <ShieldCheck className="size-3.5 text-primary" />
              {t("hero.badge")}
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-medium leading-[0.95] tracking-tight">
              {t("hero.title1")}<br />
              <em className="text-primary not-italic">{t("hero.titleEm")}</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">{t("hero.subtitle")}</p>

            <div className="bg-card rounded-3xl p-2 shadow-pop flex flex-col sm:flex-row gap-2 max-w-2xl">
              <div className="flex-1 px-5 py-3 flex items-center gap-3">
                <Search className="size-4 text-muted-foreground shrink-0" />
                <input className="w-full bg-transparent outline-none text-sm font-medium" placeholder={t("hero.searchPh")} />
              </div>
              <Button size="lg" className="rounded-2xl bg-foreground text-background hover:bg-foreground/90 h-auto px-6">
                {t("hero.cta")} <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mr-1">{t("hero.hot")}</span>
              {(lang === "en"
                ? ["HA Filler", "Thermage", "Double Eyelid", "Rhinoplasty", "Botox", "Skin Booster"]
                : ["玻尿酸", "热玛吉", "双眼皮", "鼻综合", "瘦脸针", "水光针"]
              ).map((p) => (
                <span key={p} className="pill bg-card/80 backdrop-blur shadow-soft text-foreground">
                  <Flame className="size-3 text-primary" /> {p}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><FileCheck2 className="size-4 text-primary" /> {t("hero.feat1")}</span>
              <span className="flex items-center gap-1.5"><Building2 className="size-4 text-primary" /> {t("hero.feat2")}</span>
              <span className="flex items-center gap-1.5"><Wallet className="size-4 text-primary" /> {t("hero.feat3")}</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[520px] hidden lg:block">
            <div className="absolute top-0 left-4 w-48 animate-float rounded-3xl overflow-hidden shadow-pop">
              <img src={v4} className="w-full h-64 object-cover" alt="case" />
            </div>
            <div className="absolute top-16 right-0 w-56 animate-float rounded-3xl overflow-hidden shadow-pop" style={{ animationDelay: "1s" }}>
              <img src={v2} className="w-full h-72 object-cover" alt="case" />
            </div>
            <div className="absolute bottom-0 left-20 w-52 animate-float rounded-3xl overflow-hidden shadow-pop" style={{ animationDelay: "2s" }}>
              <img src={v3} className="w-full h-64 object-cover" alt="case" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-64 animate-float bg-card rounded-3xl shadow-pop p-4" style={{ animationDelay: "1.5s" }}>
              <div className="flex items-center gap-2 mb-2">
                <BadgeCheck className="size-4 text-primary" />
                <p className="text-xs font-semibold">{t("doc.cert")}</p>
              </div>
              <p className="font-display text-base">{lang === "en" ? "Dr. Li Wenzhi" : "李文志 主任医师"}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("doc.lic")} 1413010320180123456</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {lang === "en" ? "22 yrs · 8,200+ procedures" : "22年经验 · 8,200+台手术"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {lang === "en" ? "Approx. " : "约 "}{fmt(18800)}{lang === "en" ? " for full rhinoplasty" : " · 鼻综合"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ComplianceBar = () => {
  const { t } = useCn();
  const items = [
    { icon: FileCheck2, t: t("compliance.t1"), d: t("compliance.d1") },
    { icon: Stethoscope, t: t("compliance.t2"), d: t("compliance.d2") },
    { icon: ShieldCheck, t: t("compliance.t3"), d: t("compliance.d3") },
    { icon: Wallet, t: t("compliance.t4"), d: t("compliance.d4") },
  ];
  return (
    <section className="container -mt-2 md:-mt-4 relative z-10">
      <div className="rounded-3xl bg-card shadow-pop border border-border p-5 md:p-6 grid md:grid-cols-4 gap-4">
        {items.map((x) => (
          <div key={x.t} className="flex gap-3 items-start">
            <div className="size-10 rounded-2xl bg-accent grid place-items-center shrink-0">
              <x.icon className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-display font-semibold text-sm">{x.t}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{x.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const TravelBar = () => {
  const { lang } = useCn();
  if (lang !== "en") return null;
  return (
    <section className="container py-6">
      <div className="rounded-3xl bg-gradient-to-r from-[hsl(190,70%,92%)] via-[hsl(155,60%,90%)] to-[hsl(50,80%,92%)] p-6 md:p-7 grid md:grid-cols-4 gap-4 items-center shadow-soft">
        {[
          { icon: Plane, t: "Medical visa support", d: "Invitation letter & visa filing assistance" },
          { icon: Users, t: "English coordinator", d: "From landing to follow-up · WhatsApp 24/7" },
          { icon: MapPin, t: "Airport pickup & hotel", d: "Recovery hotels next to top clinics" },
          { icon: ShieldCheck, t: "Up to 70% savings", d: "vs. comparable US clinics · same authentic products" },
        ].map((x) => (
          <div key={x.t} className="flex gap-3 items-start">
            <div className="size-10 rounded-2xl bg-card grid place-items-center shrink-0">
              <x.icon className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-display font-semibold text-sm">{x.t}</p>
              <p className="text-xs text-foreground/70 mt-0.5">{x.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const CitiesSection = () => {
  const { t, lang } = useCn();
  return (
    <section id="cities" className="container py-16 md:py-20">
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          <span className="pill bg-accent text-accent-foreground mb-3"><MapPin className="size-3.5" /> {t("cities.kicker")}</span>
          <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            {t("cities.title1")} <em className="text-primary not-italic">{t("cities.titleEm")}</em>
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cities.map((c) => (
          <a key={c.en} href="#clinics" className="rounded-3xl bg-card shadow-soft hover:shadow-pop transition-all hover:-translate-y-1 p-5 group">
            <p className="font-display text-2xl font-semibold">{lang === "en" ? c.en : c.zh}</p>
            <p className="text-xs text-muted-foreground">{lang === "en" ? c.zh : c.en}</p>
            <p className="text-xs text-muted-foreground mt-3">
              {lang === "en" ? `${c.clinics} ${t("cities.clinics")}` : `${c.clinics} ${t("cities.clinics")}`}
            </p>
            <div className="flex flex-wrap gap-1 mt-3">
              {(lang === "en" ? c.hot.en : c.hot.zh).map((h) => (
                <span key={h} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{h}</span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

const TreatmentsSection = () => {
  const { t, lang, fmt } = useCn();
  return (
    <section id="projects" className="container py-16 md:py-20">
      <div className="mb-8">
        <span className="pill bg-accent text-accent-foreground mb-3"><Flame className="size-3.5" /> {t("tx.kicker")}</span>
        <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
          {t("tx.title1")} <em className="text-primary not-italic">{t("tx.titleEm")}</em>
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">{t("tx.note")}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {treatments.map((tx) => (
          <div key={tx.en} className={`rounded-3xl p-5 bg-gradient-to-br ${tx.grad} hover:-translate-y-1 transition-transform shadow-soft relative overflow-hidden`}>
            {tx.tag && (
              <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-foreground text-background font-semibold">
                {lang === "en" ? tx.tag.en : tx.tag.zh}
              </span>
            )}
            <div className="text-3xl">{tx.emoji}</div>
            <p className="font-display text-lg font-semibold mt-3 leading-tight">{lang === "en" ? tx.en : tx.zh}</p>
            <div className="mt-3 flex items-baseline gap-2 flex-wrap">
              <span className="font-display text-2xl font-semibold">{fmt(tx.from)}</span>
              {tx.orig && <span className="text-xs line-through text-muted-foreground">{fmt(tx.orig)}</span>}
            </div>
            {tx.groupPrice && (
              <p className="text-xs mt-1 flex items-center gap-1 text-foreground/80">
                <Users className="size-3" /> {t("tx.group")} {fmt(tx.groupPrice)}
              </p>
            )}
            <Button variant="outline" size="sm" className="mt-4 rounded-full bg-card/70 backdrop-blur border-0 w-full">
              {t("tx.book")} <ArrowRight className="ml-1 size-3" />
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};

const ClinicsSection = () => {
  const { t, lang } = useCn();
  return (
    <section id="clinics" className="container py-16 md:py-20">
      <div className="mb-8">
        <span className="pill bg-accent text-accent-foreground mb-3"><Building2 className="size-3.5" /> {t("cl.kicker")}</span>
        <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
          {t("cl.title1")} <em className="text-primary not-italic">{t("cl.titleEm")}</em>
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">{t("cl.note")}</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clinics.map((c) => (
          <div key={c.en} className="rounded-3xl bg-card shadow-pop overflow-hidden hover:-translate-y-1 transition-transform">
            <div className="aspect-[4/3] overflow-hidden relative">
              <img src={c.img} alt={lang === "en" ? c.en : c.zh} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 pill bg-card/90 backdrop-blur shadow-soft text-xs">
                <BadgeCheck className="size-3 text-primary" /> {lang === "en" ? c.levelEn : c.levelZh}
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-lg font-semibold leading-tight">{lang === "en" ? c.en : c.zh}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="size-3.5" /> {lang === "en" ? c.cityEn : c.cityZh} ·{" "}
                    {lang === "en" ? `${c.years} ${t("cl.years")} ${t("cl.exp")}` : `${t("cl.exp")} ${c.years} ${t("cl.years")}`}
                  </p>
                </div>
                <span className="pill bg-secondary text-secondary-foreground text-xs">
                  <Star className="size-3 fill-primary text-primary" /> {c.rating}
                </span>
              </div>

              <div className="mt-4 rounded-2xl bg-muted/40 p-3 space-y-1.5 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <FileCheck2 className="size-3 text-primary shrink-0" />
                  <span>{t("cl.lic")}</span>
                  <span className="font-mono text-foreground/80 truncate">{c.license}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3 text-primary shrink-0" />
                  <span>{t("cl.beian")}</span>
                  <span className="font-mono text-foreground/80 truncate">{c.beian}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("cl.spec")} · {lang === "en" ? c.topEn : c.topZh}</span>
                <span className="text-xs text-muted-foreground">{c.reviews.toLocaleString()} {t("cl.reviews")}</span>
              </div>
              <Button className="mt-4 w-full rounded-2xl">
                <MessageCircle className="size-4" /> {t("cl.cta")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const DoctorsSection = () => {
  const { t, lang } = useCn();
  return (
    <section id="compliance" className="container py-16 md:py-20">
      <div className="mb-8">
        <span className="pill bg-accent text-accent-foreground mb-3"><Stethoscope className="size-3.5" /> {t("doctors.kicker")}</span>
        <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
          {t("doctors.title1")} <em className="text-primary not-italic">{t("doctors.titleEm")}</em>
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {doctors.map((d) => (
          <div key={d.en} className="rounded-3xl bg-card shadow-pop p-6">
            <div className="flex items-center gap-4">
              <img src={d.img} alt={lang === "en" ? d.en : d.zh} className="size-16 rounded-2xl object-cover" />
              <div>
                <p className="font-display text-lg font-semibold leading-tight">{lang === "en" ? d.en : d.zh}</p>
                <p className="text-xs text-muted-foreground mt-1">{lang === "en" ? d.titleEn : d.titleZh} · {lang === "en" ? d.cityEn : d.cityZh}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 flex items-center gap-1">
              <Building2 className="size-3.5" /> {lang === "en" ? d.clinicEn : d.clinicZh}
            </p>

            <div className="mt-4 rounded-2xl bg-muted/40 p-3 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <FileCheck2 className="size-3 text-primary" />
                <span>{t("doctors.lic")}</span>
                <span className="font-mono text-foreground">{d.license}</span>
              </div>
              <p className="text-muted-foreground flex items-start gap-1.5">
                <BadgeCheck className="size-3 text-primary mt-0.5 shrink-0" />
                <span>{lang === "en" ? d.qualEn : d.qualZh}</span>
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-secondary py-2">
                <p className="font-display text-base font-semibold">{d.years}{lang === "en" ? "" : "年"}</p>
                <p className="text-[10px] text-muted-foreground">{t("doctors.exp")}</p>
              </div>
              <div className="rounded-xl bg-secondary py-2">
                <p className="font-display text-base font-semibold">{d.surgeries}</p>
                <p className="text-[10px] text-muted-foreground">{t("doctors.cases")}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1">
              {(lang === "en" ? d.specEn : d.specZh).map((s) => (
                <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{s}</span>
              ))}
            </div>

            <Button variant="outline" className="mt-4 w-full rounded-2xl">{t("doctors.cta")}</Button>
          </div>
        ))}
      </div>
    </section>
  );
};

const CasesSection = () => {
  const { t, lang, fmt } = useCn();
  return (
    <section id="cases" className="container py-16 md:py-20">
      <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
        <div>
          <span className="pill bg-accent text-accent-foreground mb-3"><Heart className="size-3.5" /> {t("cases.kicker")}</span>
          <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            {t("cases.title1")} <em className="text-primary not-italic">{t("cases.titleEm")}</em>
          </h2>
          <p className="text-sm text-muted-foreground mt-2">{t("cases.wallSub")}</p>
        </div>
        <Link
          to="/cases"
          className="text-sm font-semibold pill bg-foreground text-background hover:bg-foreground/90 px-5 py-2"
        >
          {t("cases.viewAll")} <ArrowRight className="size-4" />
        </Link>
      </div>
      <TikTokWall items={TIKTOK_CASES} lang={lang} fmtPrice={fmt} variant="preview" />
    </section>
  );
};

const PromoBar = () => {
  const { t } = useCn();
  return (
    <section className="container py-10">
      <div className="rounded-3xl bg-gradient-to-r from-[hsl(340,85%,90%)] via-[hsl(50,80%,90%)] to-[hsl(155,60%,85%)] p-8 md:p-10 grid md:grid-cols-3 gap-6 items-center shadow-pop">
        <div className="md:col-span-2">
          <span className="pill bg-card/80 backdrop-blur shadow-soft mb-3"><Gift className="size-3.5 text-primary" /> {t("promo.kicker")}</span>
          <h3 className="font-display text-3xl md:text-4xl font-medium tracking-tight">{t("promo.title")}</h3>
          <p className="text-sm text-foreground/70 mt-2">{t("promo.note")}</p>
        </div>
        <Button size="lg" className="rounded-2xl bg-foreground text-background hover:bg-foreground/90 h-auto px-6 justify-self-start md:justify-self-end">
          {t("promo.cta")} <ArrowRight className="ml-1 size-4" />
        </Button>
      </div>
    </section>
  );
};

// ============== Page ==============
const ChinaIndex = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <CnNavbar />
    <Hero />
    <ComplianceBar />
    <TravelBar />
    <CitiesSection />
    <TreatmentsSection />
    <ClinicsSection />
    <DoctorsSection />
    <CasesSection />
    <PromoBar />
    <Footer />
  </div>
);

export default ChinaIndex;

import { Link } from "react-router-dom";
import {
  Sparkles, ArrowRight, Star, MapPin, ShieldCheck, BadgeCheck,
  Search, Heart, MessageCircle, Stethoscope, FileCheck2, Building2,
  Flame, Gift, Wallet, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Footer from "@/components/Footer";
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

// ---------- Mini navbar (中国版独立) ----------
const CnNavbar = () => (
  <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
    <nav className="container flex h-16 items-center justify-between gap-3">
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <div className="grid place-items-center size-9 rounded-2xl bg-gradient-mint shadow-glow">
          <Sparkles className="size-4 text-foreground" />
        </div>
        <span className="font-display text-xl font-semibold tracking-tight">
          glowy<span className="text-primary">·医美</span>
        </span>
      </Link>
      <div className="hidden md:flex items-center gap-1 rounded-full bg-muted/60 p-1">
        {[
          { to: "#cities", label: "城市" },
          { to: "#projects", label: "热门项目" },
          { to: "#clinics", label: "正规机构" },
          { to: "#cases", label: "真实案例" },
          { to: "#compliance", label: "资质查询" },
        ].map((l) => (
          <a key={l.to} href={l.to} className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {l.label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-5">登录</Button>
      </div>
    </nav>
  </header>
);

// ---------- Data ----------
const cities = [
  { name: "上海", en: "Shanghai", clinics: 128, hot: ["玻尿酸", "热玛吉", "双眼皮"] },
  { name: "北京", en: "Beijing", clinics: 142, hot: ["鼻综合", "热玛吉", "脂肪填充"] },
  { name: "成都", en: "Chengdu", clinics: 96, hot: ["双眼皮", "瘦脸针", "水光针"] },
  { name: "杭州", en: "Hangzhou", clinics: 71, hot: ["玻尿酸", "光子嫩肤", "线雕"] },
  { name: "广州", en: "Guangzhou", clinics: 88, hot: ["鼻综合", "吸脂", "瘦脸针"] },
  { name: "深圳", en: "Shenzhen", clinics: 79, hot: ["热玛吉", "玻尿酸", "双眼皮"] },
];

type Treatment = {
  name: string; emoji: string; from: number; orig?: number;
  groupPrice?: number; tag?: string; grad: string;
};

const treatments: Treatment[] = [
  { name: "双眼皮全切", emoji: "👀", from: 4800, orig: 7800, groupPrice: 3980, tag: "新人专享", grad: "from-[hsl(155,60%,80%)] to-[hsl(50,80%,90%)]" },
  { name: "鼻综合", emoji: "👃", from: 18800, orig: 28000, groupPrice: 15800, tag: "团购3人成团", grad: "from-[hsl(340,85%,88%)] to-[hsl(18,90%,88%)]" },
  { name: "玻尿酸 1ml", emoji: "💧", from: 980, orig: 1980, tag: "热度TOP1", grad: "from-[hsl(190,70%,88%)] to-[hsl(155,70%,88%)]" },
  { name: "热玛吉 第五代", emoji: "🔥", from: 12800, orig: 19800, groupPrice: 11800, tag: "618特价", grad: "from-[hsl(18,90%,88%)] to-[hsl(50,80%,90%)]" },
  { name: "瘦脸针 100u", emoji: "💎", from: 680, orig: 1280, tag: "正品溯源", grad: "from-[hsl(158,60%,82%)] to-[hsl(155,70%,90%)]" },
  { name: "水光针 嗨体", emoji: "✨", from: 880, orig: 1680, grad: "from-[hsl(50,80%,90%)] to-[hsl(340,85%,90%)]" },
  { name: "脂肪填充 全面部", emoji: "🪞", from: 9800, orig: 15800, groupPrice: 8800, tag: "推荐", grad: "from-[hsl(340,85%,90%)] to-[hsl(155,60%,85%)]" },
  { name: "光子嫩肤 DPL", emoji: "🌟", from: 580, orig: 980, grad: "from-[hsl(155,60%,85%)] to-[hsl(190,70%,88%)]" },
];

type Clinic = {
  name: string; city: string; img: string; rating: number; reviews: number;
  level: string;        // 机构等级
  license: string;      // 卫健委许可证号
  beian: string;        // 备案号
  years: number;
  topProcedure: string;
};

const clinics: Clinic[] = [
  { name: "上海华美医疗美容医院", city: "上海·徐汇", img: c1, rating: 4.9, reviews: 12480, level: "三级整形外科医院", license: "PDY12-31010520210034", beian: "沪卫医字(2021)第0034号", years: 18, topProcedure: "鼻综合 / 双眼皮" },
  { name: "北京艺星医疗美容医院", city: "北京·朝阳", img: c2, rating: 4.88, reviews: 9821, level: "二级专科医院", license: "PDY12-11010520180108", beian: "京卫医字(2018)第0108号", years: 12, topProcedure: "热玛吉 / 玻尿酸" },
  { name: "成都美莱医学美容医院", city: "成都·锦江", img: c3, rating: 4.85, reviews: 8210, level: "二级整形外科医院", license: "PDY12-51010320190212", beian: "蓉卫医字(2019)第0212号", years: 15, topProcedure: "双眼皮 / 瘦脸针" },
  { name: "杭州时光医疗美容医院", city: "杭州·西湖", img: c1, rating: 4.86, reviews: 5642, level: "二级整形外科医院", license: "PDY12-33010620200417", beian: "浙卫医字(2020)第0417号", years: 10, topProcedure: "光子嫩肤 / 玻尿酸" },
  { name: "广州曙光医疗美容门诊部", city: "广州·天河", img: c2, rating: 4.78, reviews: 4920, level: "医疗美容门诊部", license: "PDY12-44010620190308", beian: "粤卫医字(2019)第0308号", years: 8, topProcedure: "吸脂 / 瘦脸针" },
  { name: "深圳鹏程医疗美容医院", city: "深圳·福田", img: c3, rating: 4.82, reviews: 6310, level: "二级专科医院", license: "PDY12-44030420180521", beian: "深卫医字(2018)第0521号", years: 11, topProcedure: "热玛吉 / 双眼皮" },
];

type Doctor = {
  name: string; title: string; clinic: string; city: string; img: string;
  license: string;     // 医师执业证书编号
  qualification: string; // 主诊医师资质
  years: number; surgeries: string;
  specialties: string[];
};

const doctors: Doctor[] = [
  { name: "李文志 主任医师", title: "整形外科 副主任", clinic: "上海华美医疗美容医院", city: "上海", img: v4,
    license: "1413010320180123456", qualification: "卫健委主诊医师 · 中华医学会整形外科学分会会员",
    years: 22, surgeries: "8,200+", specialties: ["鼻综合", "全切双眼皮", "面部轮廓"] },
  { name: "王晓琳 主治医师", title: "皮肤美容科", clinic: "北京艺星医疗美容医院", city: "北京", img: v2,
    license: "1411010520190234567", qualification: "卫健委主诊医师 · 美国 Solta 热玛吉认证医师",
    years: 14, surgeries: "12,000+", specialties: ["热玛吉", "玻尿酸", "肉毒素"] },
  { name: "陈嘉豪 副主任医师", title: "整形外科 主任", clinic: "成都美莱医学美容医院", city: "成都", img: v3,
    license: "1415103200170345678", qualification: "卫健委主诊医师 · 韩国 BK 医院研修",
    years: 18, surgeries: "5,400+", specialties: ["双眼皮", "脂肪填充", "鼻修复"] },
];

const cases = [
  { src: v4, user: "@小敏_上海", caption: "全切双眼皮第30天｜华美 李文志主任", likes: "2.4w", comments: "812", price: "¥6,800" },
  { src: v2, user: "@Rosie", caption: "鼻综合术后6个月对比｜北京艺星", likes: "5.6w", comments: "1.2k", price: "¥22,800" },
  { src: v3, user: "@嘉嘉_Cd", caption: "热玛吉第五代真实体验｜成都美莱", likes: "1.8w", comments: "624", price: "¥12,800" },
  { src: v6, user: "@甜甜圈", caption: "脂肪填充全面部 90天 vlog", likes: "9821", comments: "412", price: "¥9,800" },
  { src: v1, user: "@momo", caption: "玻尿酸下巴 即刻效果对比", likes: "3.2w", comments: "904", price: "¥1,980" },
  { src: v5, user: "@Lulu", caption: "水光针嗨体熬夜脸救星", likes: "1.1w", comments: "388", price: "¥980" },
];

// ---------- Sections ----------
const Hero = () => (
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
            国家卫健委备案 · 正规医美一站式平台
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-medium leading-[0.95] tracking-tight">
            放心变美<br />
            <em className="text-primary not-italic">从查证开始</em>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            10万+ 真实案例 · 6000+ 持证医师 · 全部机构均可一键查询《医疗机构执业许可证》与医师执业证。
          </p>

          {/* 搜索框 */}
          <div className="bg-card rounded-3xl p-2 shadow-pop flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="flex-1 px-5 py-3 flex items-center gap-3">
              <Search className="size-4 text-muted-foreground shrink-0" />
              <input className="w-full bg-transparent outline-none text-sm font-medium" placeholder="搜索项目、医生、机构（如：双眼皮、热玛吉）" />
            </div>
            <Button size="lg" className="rounded-2xl bg-foreground text-background hover:bg-foreground/90 h-auto px-6">
              立即查询 <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mr-1">热门搜索</span>
            {["玻尿酸", "热玛吉", "双眼皮", "鼻综合", "瘦脸针", "水光针"].map((p) => (
              <span key={p} className="pill bg-card/80 backdrop-blur shadow-soft text-foreground">
                <Flame className="size-3 text-primary" /> {p}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><FileCheck2 className="size-4 text-primary" /> 医师执业证可查</span>
            <span className="flex items-center gap-1.5"><Building2 className="size-4 text-primary" /> 机构资质实时核验</span>
            <span className="flex items-center gap-1.5"><Wallet className="size-4 text-primary" /> 支持分期 · 先美后付</span>
          </div>
        </div>

        <div className="lg:col-span-5 relative h-[520px] hidden lg:block">
          <div className="absolute top-0 left-4 w-48 animate-float rounded-3xl overflow-hidden shadow-pop">
            <img src={v4} className="w-full h-64 object-cover" alt="案例" />
          </div>
          <div className="absolute top-16 right-0 w-56 animate-float rounded-3xl overflow-hidden shadow-pop" style={{ animationDelay: "1s" }}>
            <img src={v2} className="w-full h-72 object-cover" alt="案例" />
          </div>
          <div className="absolute bottom-0 left-20 w-52 animate-float rounded-3xl overflow-hidden shadow-pop" style={{ animationDelay: "2s" }}>
            <img src={v3} className="w-full h-64 object-cover" alt="案例" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-64 animate-float bg-card rounded-3xl shadow-pop p-4" style={{ animationDelay: "1.5s" }}>
            <div className="flex items-center gap-2 mb-2">
              <BadgeCheck className="size-4 text-primary" />
              <p className="text-xs font-semibold">主诊医师认证</p>
            </div>
            <p className="font-display text-base">李文志 主任医师</p>
            <p className="text-xs text-muted-foreground mt-1">证书编号 1413010320180123456</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">22年经验 · 8,200+台手术</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ComplianceBar = () => (
  <section className="container -mt-2 md:-mt-4 relative z-10">
    <div className="rounded-3xl bg-card shadow-pop border border-border p-5 md:p-6 grid md:grid-cols-4 gap-4">
      {[
        { icon: FileCheck2, t: "卫健委备案查询", d: "扫码核验《医疗机构执业许可证》" },
        { icon: Stethoscope, t: "医师执业证", d: "全部主诊医师证书可查" },
        { icon: ShieldCheck, t: "正品溯源", d: "玻尿酸/肉毒素一物一码" },
        { icon: Wallet, t: "资金托管", d: "面诊后付款 · 不满意可退" },
      ].map((x) => (
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

const CitiesSection = () => (
  <section id="cities" className="container py-16 md:py-20">
    <div className="flex items-end justify-between mb-8 gap-4">
      <div>
        <span className="pill bg-accent text-accent-foreground mb-3"><MapPin className="size-3.5" /> 国内城市</span>
        <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">在你的城市 <em className="text-primary not-italic">找正规机构</em></h2>
      </div>
      <Link to="#clinics" className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline">查看全部 →</Link>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cities.map((c) => (
        <a key={c.name} href="#clinics" className="rounded-3xl bg-card shadow-soft hover:shadow-pop transition-all hover:-translate-y-1 p-5 group">
          <p className="font-display text-2xl font-semibold">{c.name}</p>
          <p className="text-xs text-muted-foreground">{c.en}</p>
          <p className="text-xs text-muted-foreground mt-3">{c.clinics} 家正规机构</p>
          <div className="flex flex-wrap gap-1 mt-3">
            {c.hot.map((h) => (
              <span key={h} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{h}</span>
            ))}
          </div>
        </a>
      ))}
    </div>
  </section>
);

const TreatmentsSection = () => (
  <section id="projects" className="container py-16 md:py-20">
    <div className="flex items-end justify-between mb-8 gap-4">
      <div>
        <span className="pill bg-accent text-accent-foreground mb-3"><Flame className="size-3.5" /> 热门项目</span>
        <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">本月 <em className="text-primary not-italic">热度榜单</em></h2>
        <p className="text-muted-foreground mt-2 text-sm">价格已含麻醉、术后护理 · 支持 12 期免息分期</p>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {treatments.map((t) => (
        <div key={t.name} className={`rounded-3xl p-5 bg-gradient-to-br ${t.grad} hover:-translate-y-1 transition-transform shadow-soft relative overflow-hidden`}>
          {t.tag && (
            <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-foreground text-background font-semibold">
              {t.tag}
            </span>
          )}
          <div className="text-3xl">{t.emoji}</div>
          <p className="font-display text-lg font-semibold mt-3">{t.name}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold">¥{t.from.toLocaleString()}</span>
            {t.orig && <span className="text-xs line-through text-muted-foreground">¥{t.orig.toLocaleString()}</span>}
          </div>
          {t.groupPrice && (
            <p className="text-xs mt-1 flex items-center gap-1 text-foreground/80">
              <Users className="size-3" /> 团购价 ¥{t.groupPrice.toLocaleString()}
            </p>
          )}
          <Button variant="outline" size="sm" className="mt-4 rounded-full bg-card/70 backdrop-blur border-0 w-full">
            立即抢购 <ArrowRight className="ml-1 size-3" />
          </Button>
        </div>
      ))}
    </div>
  </section>
);

const ClinicsSection = () => (
  <section id="clinics" className="container py-16 md:py-20">
    <div className="mb-8">
      <span className="pill bg-accent text-accent-foreground mb-3"><Building2 className="size-3.5" /> 正规机构</span>
      <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">持证经营 · <em className="text-primary not-italic">每家都可查</em></h2>
      <p className="text-muted-foreground mt-2 text-sm">所有机构均持有国家卫健委颁发的《医疗机构执业许可证》</p>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clinics.map((c) => (
        <div key={c.name} className="rounded-3xl bg-card shadow-pop overflow-hidden hover:-translate-y-1 transition-transform">
          <div className="aspect-[4/3] overflow-hidden relative">
            <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
            <span className="absolute top-3 left-3 pill bg-card/90 backdrop-blur shadow-soft text-xs">
              <BadgeCheck className="size-3 text-primary" /> {c.level}
            </span>
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-display text-lg font-semibold leading-tight">{c.name}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="size-3.5" /> {c.city} · 经营 {c.years} 年
                </p>
              </div>
              <span className="pill bg-secondary text-secondary-foreground text-xs">
                <Star className="size-3 fill-primary text-primary" /> {c.rating}
              </span>
            </div>

            <div className="mt-4 rounded-2xl bg-muted/40 p-3 space-y-1.5 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <FileCheck2 className="size-3 text-primary shrink-0" />
                <span>执业许可证：</span>
                <span className="font-mono text-foreground/80 truncate">{c.license}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-3 text-primary shrink-0" />
                <span>卫健委备案：</span>
                <span className="font-mono text-foreground/80 truncate">{c.beian}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">擅长 · {c.topProcedure}</span>
              <span className="text-xs text-muted-foreground">{c.reviews.toLocaleString()} 评价</span>
            </div>
            <Button className="mt-4 w-full rounded-2xl">
              <MessageCircle className="size-4" /> 在线咨询 · 免费面诊
            </Button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const DoctorsSection = () => (
  <section id="compliance" className="container py-16 md:py-20">
    <div className="mb-8">
      <span className="pill bg-accent text-accent-foreground mb-3"><Stethoscope className="size-3.5" /> 主诊医师</span>
      <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">每位医师 · <em className="text-primary not-italic">执业证可查</em></h2>
    </div>
    <div className="grid md:grid-cols-3 gap-6">
      {doctors.map((d) => (
        <div key={d.name} className="rounded-3xl bg-card shadow-pop p-6">
          <div className="flex items-center gap-4">
            <img src={d.img} alt={d.name} className="size-16 rounded-2xl object-cover" />
            <div>
              <p className="font-display text-lg font-semibold">{d.name}</p>
              <p className="text-xs text-muted-foreground">{d.title} · {d.city}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 flex items-center gap-1">
            <Building2 className="size-3.5" /> {d.clinic}
          </p>

          <div className="mt-4 rounded-2xl bg-muted/40 p-3 space-y-1.5 text-[11px]">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <FileCheck2 className="size-3 text-primary" />
              <span>执业证书：</span>
              <span className="font-mono text-foreground">{d.license}</span>
            </div>
            <p className="text-muted-foreground flex items-start gap-1.5">
              <BadgeCheck className="size-3 text-primary mt-0.5 shrink-0" />
              <span>{d.qualification}</span>
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl bg-secondary py-2">
              <p className="font-display text-base font-semibold">{d.years}年</p>
              <p className="text-[10px] text-muted-foreground">从业经验</p>
            </div>
            <div className="rounded-xl bg-secondary py-2">
              <p className="font-display text-base font-semibold">{d.surgeries}</p>
              <p className="text-[10px] text-muted-foreground">手术案例</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1">
            {d.specialties.map((s) => (
              <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{s}</span>
            ))}
          </div>

          <Button variant="outline" className="mt-4 w-full rounded-2xl">查看医师档案</Button>
        </div>
      ))}
    </div>
  </section>
);

const CasesSection = () => (
  <section id="cases" className="container py-16 md:py-20">
    <div className="mb-8">
      <span className="pill bg-accent text-accent-foreground mb-3"><Heart className="size-3.5" /> 真实案例</span>
      <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">真实变美日记 · <em className="text-primary not-italic">无滤镜</em></h2>
    </div>
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="rounded-full bg-muted/60 p-1 h-auto">
        {["全部", "双眼皮", "鼻综合", "热玛吉", "玻尿酸"].map((t, i) => (
          <TabsTrigger key={t} value={i === 0 ? "all" : t} className="rounded-full px-4 py-1.5 text-sm">
            {t}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="all" className="mt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cases.map((c, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-card shadow-soft hover:-translate-y-1 transition-transform">
              <div className="aspect-[3/4] overflow-hidden">
                <img src={c.src} alt={c.caption} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-[11px] text-muted-foreground">{c.user}</p>
                <p className="text-xs font-medium leading-snug mt-1 line-clamp-2">{c.caption}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5"><Heart className="size-3" />{c.likes}</span>
                    <span className="flex items-center gap-0.5"><MessageCircle className="size-3" />{c.comments}</span>
                  </span>
                  <span className="text-primary font-semibold">{c.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  </section>
);

const PromoBar = () => (
  <section className="container py-10">
    <div className="rounded-3xl bg-gradient-to-r from-[hsl(340,85%,90%)] via-[hsl(50,80%,90%)] to-[hsl(155,60%,85%)] p-8 md:p-10 grid md:grid-cols-3 gap-6 items-center shadow-pop">
      <div className="md:col-span-2">
        <span className="pill bg-card/80 backdrop-blur shadow-soft mb-3"><Gift className="size-3.5 text-primary" /> 新人专享</span>
        <h3 className="font-display text-3xl md:text-4xl font-medium tracking-tight">注册立得 ¥500 美丽基金</h3>
        <p className="text-sm text-foreground/70 mt-2">玻尿酸 ¥980 · 水光针 ¥580 · 双眼皮 ¥3980 起 · 全部正品溯源 · 不满意全额退</p>
      </div>
      <Button size="lg" className="rounded-2xl bg-foreground text-background hover:bg-foreground/90 h-auto px-6 justify-self-start md:justify-self-end">
        领取优惠 <ArrowRight className="ml-1 size-4" />
      </Button>
    </div>
  </section>
);

// ---------- Page ----------
const ChinaIndex = () => (
  <div className="min-h-screen bg-background overflow-x-hidden" lang="zh-CN">
    <CnNavbar />
    <Hero />
    <ComplianceBar />
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

import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Star, MapPin, ShieldCheck, TrendingUp, Globe2, Heart, Scissors, ChevronDown, PlayCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import VerifiedDoctorBadge from "@/components/VerifiedDoctorBadge";
import SmartSearch from "@/components/SmartSearch";
import TrendingByCountry from "@/components/TrendingByCountry";
import BeforeAfterCard from "@/components/BeforeAfterCard";
import PriceCompare from "@/components/PriceCompare";
import SafetyIndicator, { type SafetyLevel } from "@/components/SafetyIndicator";
import WhyTrustGlowy from "@/components/WhyTrustGlowy";
import DoctorProfile, { type DoctorProfileData } from "@/components/DoctorProfile";
import PatientReview, { type PatientReviewData } from "@/components/PatientReview";
import PopularInRegion from "@/components/PopularInRegion";
import { useI18n, useLangPath } from "@/lib/i18n";
import { FloatingQuoteCTA, DoctorContactButton } from "@/components/QuoteRequest";
import PriceBadge from "@/components/PriceBadge";
import PriceTrustBadge from "@/components/PriceTrustBadge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const videos = [
  { src: v4, user: "minji_surgery", caption: "Day 30 after double eyelid 👀", likes: "1.2M", comments: "18K", treatment: "doubleeyelid", tilt: -2, priceFrom: 1500, priceTo: 2800 },
  { src: v2, user: "rosie.bloom", caption: "Rhinoplasty reveal — 6 months post-op", likes: "2.4M", comments: "32K", treatment: "rhinoplasty", tilt: 1.5, priceFrom: 2400, priceTo: 4200 },
  { src: v3, user: "jaw.journey", caption: "V-line surgery vlog ep.4", likes: "892K", comments: "11K", treatment: "vlinesurgery", tilt: -1, priceFrom: 6800, priceTo: 9400 },
  { src: v6, user: "newme.era", caption: "My breast augmentation diary 🩷", likes: "640K", comments: "9.2K", treatment: "breastaug", tilt: 2, priceFrom: 3200, priceTo: 5400 },
  { src: v5, user: "seoulclinictour", caption: "Inside Gangnam's top surgery clinic", likes: "421K", comments: "3.2K", treatment: "clinictour", tilt: -1.5 },
  { src: v1, user: "softgirl.era", caption: "Pre-op consultation, what to ask", likes: "276K", comments: "4.1K", treatment: "consultation", tilt: 1 },
];

const clinics: { name: string; city: string; rating: number; reviews: number; img: string; tag: string; safety: SafetyLevel; safetyScore: number; priceFrom: number; priceTo: number; topProcedure: string }[] = [
  { name: "Maison Lumière Chirurgie", city: "Paris, France", rating: 4.9, reviews: 1284, img: c2, tag: "Board Certified", safety: "green", safetyScore: 98, priceFrom: 5800, priceTo: 8400, topProcedure: "Rhinoplasty" },
  { name: "Aoba Plastic Surgery", city: "Tokyo, Japan", rating: 4.95, reviews: 2103, img: c3, tag: "Trending", safety: "green", safetyScore: 96, priceFrom: 2100, priceTo: 3400, topProcedure: "Double Eyelid" },
  { name: "Verde Surgical Center", city: "Seoul, Korea", rating: 4.88, reviews: 3402, img: c1, tag: "Top Rated", safety: "amber", safetyScore: 82, priceFrom: 1500, priceTo: 2800, topProcedure: "Double Eyelid" },
];

const featuredDoctor: DoctorProfileData = {
  name: "Dr. Park Min-jun",
  title: "Plastic & Reconstructive Surgeon · 14 yrs",
  city: "Seoul, Korea",
  flag: "🇰🇷",
  license: { country: "South Korea", number: "KSPRS-4821", board: "Korean Medical Association" },
  certifications: [
    { label: "KSPRS Board Certified", org: "Korean Society of Plastic & Reconstructive Surgeons" },
    { label: "ISAPS Member", org: "International Society of Aesthetic Plastic Surgery" },
    { label: "IMCAS Faculty", org: "International Master Course on Aging Science" },
    { label: "Fellowship — UCLA", org: "Craniofacial reconstruction, 2014" },
  ],
  proceduresPerformed: "3,240+",
  responseRate: 98,
  avgResponseTime: "2h",
  languages: ["Korean", "English", "Mandarin", "Japanese"],
  hospitals: ["Verde Surgical Center", "Gangnam Severance Hospital", "Seoul National University Hospital"],
  safety: { level: "green", score: 98 },
};

const reviews: PatientReviewData[] = [
  {
    patient: "Yuna K.", initial: "Y", procedure: "Double Eyelid Surgery",
    traveledFrom: { flag: "🇸🇬", place: "Singapore" }, treatedIn: { flag: "🇰🇷", place: "Seoul" },
    date: "Oct 2024", verified: true,
    ratings: { overall: 5, recovery: 4.5, communication: 5 },
    text: "Dr. Park sat with me for 90 minutes mapping every fold. Day 14 swelling was real but the result is exactly the simulation. English-speaking coordinator made the trip stress-free.",
    media: [{ type: "photo", src: v4 }, { type: "video", src: v3 }],
  },
  {
    patient: "Camille R.", initial: "C", procedure: "Rhinoplasty",
    traveledFrom: { flag: "🇫🇷", place: "Paris" }, treatedIn: { flag: "🇹🇷", place: "Istanbul" },
    date: "Jun 2024", verified: true,
    ratings: { overall: 5, recovery: 4, communication: 5 },
    text: "Cross-border was scary but the escrow + revision policy convinced me. 6 months in, profile is exactly what I wanted. Surgeon replied to every WhatsApp within an hour.",
    media: [{ type: "photo", src: v2 }],
  },
  {
    patient: "Mei L.", initial: "M", procedure: "V-Line Surgery",
    traveledFrom: { flag: "🇨🇳", place: "Shanghai" }, treatedIn: { flag: "🇹🇭", place: "Bangkok" },
    date: "Apr 2024", verified: true,
    ratings: { overall: 4.5, recovery: 4, communication: 5 },
    text: "Recovery was hard — won't sugarcoat. But aftercare hotel + Mandarin-speaking nurse made it doable. Jawline is exactly what I asked for.",
  },
];

const treatments = [
  { name: "Double Eyelid", from: "$1,800", emoji: "👀", grad: "from-[hsl(155,60%,80%)] to-[hsl(50,80%,90%)]" },
  { name: "Rhinoplasty", from: "$4,200", emoji: "👃", grad: "from-[hsl(340,85%,88%)] to-[hsl(18,90%,88%)]" },
  { name: "V-Line Surgery", from: "$6,800", emoji: "💎", grad: "from-[hsl(158,60%,82%)] to-[hsl(155,70%,90%)]" },
  { name: "Breast Aug", from: "$5,400", emoji: "🩷", grad: "from-[hsl(50,80%,90%)] to-[hsl(340,85%,90%)]" },
  { name: "Liposuction", from: "$3,500", emoji: "✨", grad: "from-[hsl(340,85%,90%)] to-[hsl(155,60%,85%)]" },
  { name: "Facelift", from: "$8,900", emoji: "🪞", grad: "from-[hsl(190,70%,88%)] to-[hsl(155,70%,88%)]" },
];

const countries = [
  {
    flag: "🇰🇷", name: "Korea", city: "Seoul",
    featured: ["Double Eyelid", "V-Line Surgery", "Rhinoplasty"],
    videos: [
      { src: v4, user: "minji_seoul", caption: "Day 30 — Gangnam double eyelid 👀", likes: "1.2M", comments: "18K", treatment: "doubleeyelid", tilt: -2 },
      { src: v3, user: "jaw.journey", caption: "V-line surgery in Seoul · ep.4", likes: "892K", comments: "11K", treatment: "vlinesurgery", tilt: 1.5 },
      { src: v5, user: "seoulclinictour", caption: "Inside a Gangnam surgery clinic", likes: "421K", comments: "3.2K", treatment: "clinictour", tilt: -1 },
    ],
    badge: { flag: "🇰🇷", country: "Korea", license: "KSPRS-4821", years: 14, procedures: "3.2K" },
  },
  {
    flag: "🇹🇭", name: "Thailand", city: "Bangkok",
    featured: ["Breast Aug", "Liposuction", "Rhinoplasty"],
    videos: [
      { src: v6, user: "bkk.newme", caption: "Bangkok breast aug diary 🩷", likes: "640K", comments: "9.2K", treatment: "breastaug", tilt: -2 },
      { src: v2, user: "siam.rosie", caption: "Rhino reveal — Bangkok edition", likes: "2.4M", comments: "32K", treatment: "rhinoplasty", tilt: 1.5 },
      { src: v1, user: "thaicare.era", caption: "Aftercare hotel tour, Sukhumvit", likes: "276K", comments: "4.1K", treatment: "aftercare", tilt: -1 },
    ],
    badge: { flag: "🇹🇭", country: "Thailand", license: "TPRS-2207", years: 16, procedures: "4.4K" },
  },
  {
    flag: "🇹🇷", name: "Turkey", city: "Istanbul",
    featured: ["Rhinoplasty", "Liposuction", "Facelift"],
    videos: [
      { src: v2, user: "istanbul.rosie", caption: "Istanbul rhinoplasty — 6 mo post-op", likes: "2.4M", comments: "32K", treatment: "rhinoplasty", tilt: -2 },
      { src: v1, user: "bosphorus.era", caption: "Pre-op consult in Istanbul", likes: "276K", comments: "4.1K", treatment: "consultation", tilt: 1.5 },
      { src: v5, user: "tr.cliniclife", caption: "Inside a Şişli surgery suite", likes: "421K", comments: "3.2K", treatment: "clinictour", tilt: -1 },
    ],
    badge: { flag: "🇹🇷", country: "Turkey", license: "ISAPS-9210", years: 18, procedures: "5.1K" },
  },
  {
    flag: "🇯🇵", name: "Japan", city: "Tokyo",
    featured: ["Double Eyelid", "Rhinoplasty", "Facelift"],
    videos: [
      { src: v4, user: "tokyo.minji", caption: "Tokyo double eyelid · day 30", likes: "1.2M", comments: "18K", treatment: "doubleeyelid", tilt: -2 },
      { src: v2, user: "aoba.rosie", caption: "Aoba rhinoplasty reveal", likes: "2.4M", comments: "32K", treatment: "rhinoplasty", tilt: 1.5 },
      { src: v1, user: "ginza.softgirl", caption: "Ginza pre-op consult vlog", likes: "276K", comments: "4.1K", treatment: "consultation", tilt: -1 },
    ],
    badge: { flag: "🇯🇵", country: "Japan", license: "JSAPS-1144", years: 11, procedures: "2.4K" },
  },
  {
    flag: "🇫🇷", name: "France", city: "Paris",
    featured: ["Rhinoplasty", "Facelift", "Liposuction"],
    videos: [
      { src: v2, user: "paris.rosie", caption: "Paris rhinoplasty diary", likes: "2.4M", comments: "32K", treatment: "rhinoplasty", tilt: -2 },
      { src: v1, user: "lumiere.era", caption: "Consult at Maison Lumière", likes: "276K", comments: "4.1K", treatment: "consultation", tilt: 1.5 },
      { src: v5, user: "paris.cliniclife", caption: "Inside a 16e arrondissement clinic", likes: "421K", comments: "3.2K", treatment: "clinictour", tilt: -1 },
    ],
    badge: { flag: "🇫🇷", country: "France", license: "SOFCPRE-3380", years: 20, procedures: "2.9K" },
  },
  {
    flag: "🇲🇽", name: "Mexico", city: "Mexico City",
    featured: ["Liposuction", "Breast Aug", "Facelift"],
    videos: [
      { src: v6, user: "cdmx.newme", caption: "CDMX breast aug · 3 months 🩷", likes: "640K", comments: "9.2K", treatment: "breastaug", tilt: -2 },
      { src: v3, user: "polanco.jaw", caption: "Lipo + contouring in Polanco", likes: "892K", comments: "11K", treatment: "liposuction", tilt: 1.5 },
      { src: v5, user: "mx.cliniclife", caption: "Tour of a Polanco surgery suite", likes: "421K", comments: "3.2K", treatment: "clinictour", tilt: -1 },
    ],
    badge: { flag: "🇲🇽", country: "Mexico", license: "AMCPER-7714", years: 13, procedures: "3.6K" },
  },
];

const doctorBadges = countries.slice(0, 3).map((c) => c.badge);

const PrivacyModeBar = () => {
  const { privacyMode, setPrivacyMode, regionMeta, t } = useI18n();
  return (
    <section className="container py-4">
      <div className="rounded-2xl border border-border bg-card px-5 py-3 flex items-center gap-4 flex-wrap">
        <div className="size-9 rounded-xl bg-accent grid place-items-center shrink-0">
          <EyeOff className="size-4" />
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="text-sm font-display font-semibold leading-tight">{t("privacy.title")}</p>
          <p className="text-xs text-muted-foreground">
            {regionMeta.flag} {t("privacy.desc")}
          </p>
        </div>
        <Switch checked={privacyMode} onCheckedChange={setPrivacyMode} />
      </div>
    </section>
  );
};

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const { t } = useI18n();
  const lp = useLangPath();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <img src={heroBg} alt="" className="absolute inset-0 size-full object-cover opacity-50 mix-blend-multiply" />

        {/* Floating blobs */}
        <div className="absolute -top-20 -left-10 size-72 bg-gradient-mint blur-3xl opacity-60 animate-blob" />
        <div className="absolute top-40 right-0 size-80 bg-gradient-peach blur-3xl opacity-50 animate-blob" style={{ animationDelay: "2s" }} />

        <div className="container relative py-20 md:py-28">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-7">
              <span className="pill bg-card/80 backdrop-blur shadow-soft">
                <ShieldCheck className="size-3.5 text-primary" />
                {t("hero.badge")}
              </span>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] tracking-tight">
                {t("hero.title1")} <em className="text-primary not-italic">{t("hero.titleEm")}</em><br />
                {t("hero.title2")}
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                {t("hero.subtitle")}
              </p>

              {/* Search + country selector */}
              <div className="bg-card rounded-3xl p-2 shadow-pop flex flex-col sm:flex-row gap-2 max-w-2xl">
                <div className="flex-1 px-5 py-3">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{t("hero.procedure")}</p>
                  <input className="w-full bg-transparent outline-none text-sm font-medium" placeholder={t("hero.procedurePlaceholder")} />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="flex-1 px-5 py-3 sm:border-l border-border text-left hover:bg-muted/40 rounded-2xl transition-colors">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{t("hero.country")}</p>
                      <p className="text-sm font-medium flex items-center gap-1.5 mt-0.5">
                        <span>{selectedCountry.flag}</span> {selectedCountry.name}
                        <ChevronDown className="size-3.5 ml-auto text-muted-foreground" />
                      </p>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 rounded-2xl">
                    {countries.map((c) => (
                      <DropdownMenuItem key={c.name} onClick={() => setSelectedCountry(c)} className="rounded-xl cursor-pointer">
                        <span className="mr-2">{c.flag}</span> {c.name}
                        <span className="ml-auto text-xs text-muted-foreground">{c.city}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="lg" className="rounded-2xl bg-foreground text-background hover:bg-foreground/90 h-auto px-6">
                  {t("hero.findDoctorsIn")} {selectedCountry.name} <ArrowRight className="ml-1 size-4" />
                </Button>
              </div>

              <a
                href="#video-feed"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-foreground story-link group"
              >
                <PlayCircle className="size-4 text-primary" />
                Browse recovery videos
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mr-1">
                  {t("hero.featuredIn")} {selectedCountry.city}
                </span>
                {selectedCountry.featured.map((p) => (
                  <span key={p} className="pill bg-card/80 backdrop-blur shadow-soft text-foreground">
                    <Sparkles className="size-3 text-primary" /> {p}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-primary" /> {t("hero.boardCertified")}</span>
                <span className="flex items-center gap-1.5"><Globe2 className="size-4 text-primary" /> {t("hero.countries")}</span>
                <span className="flex items-center gap-1.5"><Heart className="size-4 text-primary" /> {t("hero.diaries")}</span>
              </div>
            </div>

            {/* Hero video collage — driven by selected country */}
            <div key={selectedCountry.name} className="lg:col-span-5 relative h-[560px] hidden lg:block">
              <div className="absolute top-0 left-4 w-48 animate-float">
                <VideoCard {...selectedCountry.videos[0]} />
              </div>
              <div className="absolute top-16 right-0 w-56 animate-float" style={{ animationDelay: "1s" }}>
                <VideoCard {...selectedCountry.videos[1]} />
              </div>
              <div className="absolute bottom-0 left-20 w-52 animate-float" style={{ animationDelay: "2s" }}>
                <VideoCard {...selectedCountry.videos[2]} />
              </div>
              <div className="absolute -bottom-2 -right-2 w-64 animate-float" style={{ animationDelay: "1.5s" }}>
                <VerifiedDoctorBadge {...selectedCountry.badge} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      <section className="border-y border-border/60 bg-card">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { v: "4,200+", l: t("social.verifiedDoctors"), icon: ShieldCheck },
              { v: "50+", l: t("social.countriesCovered"), icon: Globe2 },
              { v: "2M+", l: t("social.patientVideos"), icon: PlayCircle },
              { v: "180K", l: t("social.surgeriesBooked"), icon: Scissors },
            ].map((s) => (
              <div key={s.l} className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-gradient-mint grid place-items-center shrink-0">
                  <s.icon className="size-5" />
                </div>
                <div>
                  <p className="font-display text-2xl md:text-3xl font-semibold leading-none">{s.v}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.l}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border/60 pt-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold shrink-0">{t("social.featuredIn")}</p>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
              {["VOGUE", "FORBES", "ELLE", "HARPER'S BAZAAR", "WIRED"].map((m) => (
                <span key={m} className="font-display text-xl md:text-2xl tracking-[0.15em] text-muted-foreground/70 hover:text-foreground transition-colors">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="py-8 border-y border-border/60 bg-card overflow-hidden">
        <p className="container text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-4">
          Browse by destination
        </p>
        <div className="flex marquee-track gap-12 whitespace-nowrap">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex gap-12 items-center">
              {["SEOUL", "TOKYO", "PARIS", "DUBAI", "BANGKOK", "LOS ANGELES", "MILAN", "NEW YORK", "ISTANBUL", "SINGAPORE"].map((c) => (
                <span key={c} className="font-display text-2xl tracking-widest text-muted-foreground">
                  {c} <span className="text-primary mx-2">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* SMART SEARCH */}
      <section className="container py-16 -mt-4">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="pill bg-accent text-accent-foreground mb-3">{t("search.pill")}</span>
          <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight">
            {t("search.titlePre")} <em className="text-primary not-italic">{t("search.titleEm")}</em> {t("search.titlePost")}
          </h2>
        </div>
        <SmartSearch />
      </section>

      {/* POPULAR IN REGION */}
      <PopularInRegion />

      {/* PRIVACY MODE TOGGLE */}
      <PrivacyModeBar />

      {/* TIKTOK FEED */}
      <section id="video-feed" className="container py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="pill bg-secondary text-secondary-foreground mb-3"><TrendingUp className="size-3.5" /> {t("feed.pill")}</span>
            <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight max-w-2xl">
              {t("feed.titlePre")} <em className="text-primary not-italic">{t("feed.titleEm")}</em>
            </h2>
          </div>
          <Button variant="ghost" className="rounded-full self-start md:self-end">
            {t("feed.seeAll")} <ArrowRight className="ml-1 size-4" />
          </Button>
        </div>

        <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-warning-border bg-warning-soft px-4 py-3 text-sm text-warning-foreground">
          <EyeOff className="size-4 shrink-0" />
          <span>Some videos contain surgical content. Toggle privacy mode anytime.</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {videos.map((v, i) => <VideoCard key={i} {...v} tilt={0} />)}
        </div>
      </section>

      {/* TRENDING TREATMENTS */}
      <section className="container py-16">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="pill bg-accent text-accent-foreground mb-3">{t("trending.pill")}</span>
          <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            {t("trending.titlePre")} <em className="text-primary not-italic">{t("trending.titleEm")}</em>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {treatments.map((t) => (
            <Link
              key={t.name}
              to={lp("/treatment/glow-facial")}
              className={`group rounded-3xl p-6 aspect-square flex flex-col justify-between bg-gradient-to-br ${t.grad} hover:shadow-pop transition-all hover:-translate-y-1`}
            >
              <span className="text-4xl">{t.emoji}</span>
              <div>
                <p className="font-display text-xl font-semibold">{t.name}</p>
                <p className="text-sm text-foreground/70 mt-1">from {t.from}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRENDING BY COUNTRY */}
      <section className="container py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="pill bg-secondary text-secondary-foreground mb-3">
              <Globe2 className="size-3.5" /> {t("byCountry.pill")}
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight max-w-2xl">
              {t("byCountry.titlePre")} <em className="text-primary not-italic">{t("byCountry.titleEm")}</em>
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            {t("byCountry.desc")}
          </p>
        </div>
        <TrendingByCountry />
      </section>

      {/* PATIENT STORIES */}
      <section className="container py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="pill bg-secondary text-secondary-foreground mb-3">
              <Heart className="size-3.5" /> {t("stories.pill")}
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight max-w-2xl">
              {t("stories.titlePre")} <em className="text-primary not-italic">{t("stories.titleEm")}</em>{t("stories.titleEnd")}
            </h2>
          </div>
          <Button variant="ghost" className="rounded-full self-start md:self-end">
            {t("stories.readAll")} <ArrowRight className="ml-1 size-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Yuna, 23",
              procedure: "Double Eyelid Surgery",
              city: "Seoul, Korea",
              clinic: "Verde Surgical Center",
              gradient: "bg-gradient-mint",
              quote: "I researched for two years before flying to Seoul. Watched 200+ recovery diaries on Glowy. Day 14 my eyes finally looked like the version of me I'd always pictured. I cried in the mirror — happy tears.",
              timeline: ["Consult: Aug 2024", "Surgery: Oct 2024", "Healed: Jan 2025"],
            },
            {
              name: "Camille, 25",
              procedure: "Rhinoplasty",
              city: "Istanbul, Turkey",
              clinic: "Bosphorus Aesthetic",
              gradient: "bg-gradient-peach",
              quote: "I always hated profile pics. Now I take selfies from every angle. The surgeon spent 2 hours with me on the simulation — every millimeter intentional. Worth every cent.",
              timeline: ["Consult: Mar 2024", "Surgery: Jun 2024", "Healed: Dec 2024"],
            },
            {
              name: "Mei, 22",
              procedure: "V-Line Surgery",
              city: "Bangkok, Thailand",
              clinic: "Siam Plastic Surgery",
              gradient: "bg-gradient-mint",
              quote: "Recovery was real — won't sugarcoat it. But the aftercare hotel + 24/7 nurse made it doable. 6 months later my jawline is exactly what I asked for. Confidence unlocked.",
              timeline: ["Consult: Jan 2024", "Surgery: Apr 2024", "Healed: Oct 2024"],
            },
          ].map((s) => (
            <article key={s.name} className="glow-card rounded-[2rem] p-7 flex flex-col">
              <div className="flex items-center gap-4">
                <div className={`size-14 rounded-2xl ${s.gradient} grid place-items-center font-display text-xl font-semibold shrink-0`}>
                  {s.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold leading-tight">{s.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="size-3" /> {s.city}
                  </p>
                </div>
              </div>

              <span className="pill bg-muted self-start mt-5">
                <Sparkles className="size-3 text-primary" /> {s.procedure}
              </span>

              <p className="text-foreground/85 leading-relaxed mt-4 flex-1">"{s.quote}"</p>

              <div className="mt-6 pt-5 border-t border-border space-y-2">
                {s.timeline.map((t, i) => (
                  <div key={t} className="flex items-center gap-3 text-xs">
                    <div className={`size-1.5 rounded-full ${i === s.timeline.length - 1 ? "bg-primary" : "bg-muted-foreground/40"}`} />
                    <span className={i === s.timeline.length - 1 ? "font-semibold" : "text-muted-foreground"}>{t}</span>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pt-2 flex items-center gap-1">
                  <ShieldCheck className="size-3 text-primary" /> Verified at {s.clinic}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* BEFORE / AFTER GALLERY */}
      <section className="container py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="pill bg-accent text-accent-foreground mb-3">
              <Sparkles className="size-3.5" /> {t("ba.pill")}
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight max-w-2xl">
              {t("ba.titlePre")} <em className="text-primary not-italic">{t("ba.titleEm")}</em>
            </h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-md">
              {t("ba.desc")}
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BeforeAfterCard before={v1} after={v4} doctor="Park Min-jun" city="Seoul, Korea" procedure="Double Eyelid" />
          <BeforeAfterCard before={v3} after={v2} doctor="Elif Demir" city="Istanbul, Turkey" procedure="Rhinoplasty" />
          <BeforeAfterCard before={v5} after={v6} doctor="Suchada Pong" city="Bangkok, Thailand" procedure="Breast Aug" defaultBlur={false} />
        </div>
      </section>

      {/* PRICE COMPARE */}
      <section className="container py-16 space-y-6">
        <div className="flex justify-end">
          <PriceTrustBadge />
        </div>
        <PriceCompare />
      </section>

      {/* FEATURED CLINICS */}
      <section className="container py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="pill bg-primary-soft text-foreground mb-3" style={{ background: "hsl(var(--primary-soft))" }}>
              <ShieldCheck className="size-3.5" /> {t("clinics.pill")}
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight max-w-2xl">
              {t("clinics.titlePre")} <em className="text-primary not-italic">{t("clinics.titleEm")}</em>
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {clinics.map((c, i) => (
            <div key={c.name} className="glow-card rounded-[2rem] overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={c.img} alt={c.name} loading="lazy" className="size-full object-cover transition-transform duration-700 hover:scale-105" />
                <span className="absolute top-4 left-4 pill bg-background/90 backdrop-blur shadow-soft">{c.tag}</span>
                <div className="absolute top-4 right-4">
                  <VerifiedDoctorBadge {...doctorBadges[i % doctorBadges.length]} compact />
                </div>
                <div className="absolute bottom-4 left-4">
                  <SafetyIndicator level={c.safety} compact />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl font-semibold leading-tight">{c.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="size-3.5" /> {c.city}
                    </p>
                    <div className="mt-2">
                      <PriceBadge from={c.priceFrom} to={c.priceTo} />
                      <span className="text-[11px] text-muted-foreground ml-1.5">{c.topProcedure}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold flex items-center gap-1"><Star className="size-4 fill-primary text-primary" /> {c.rating}</p>
                    <p className="text-xs text-muted-foreground">{c.reviews} reviews</p>
                  </div>
                </div>
                <SafetyIndicator level={c.safety} score={c.safetyScore} />
                <VerifiedDoctorBadge {...doctorBadges[i % doctorBadges.length]} />
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="flex-1 rounded-full">{t("clinics.viewClinic")}</Button>
                  <DoctorContactButton doctorName={c.name} city={c.city} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DOCTOR PROFILE — Trust deep-dive */}
      <section className="container py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="pill bg-secondary text-secondary-foreground mb-3">
              <ShieldCheck className="size-3.5" /> {t("doctor.pill")}
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight max-w-2xl">
              {t("doctor.titlePre")} <em className="text-primary not-italic">{t("doctor.titleEm")}</em>
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            {t("doctor.desc")}
          </p>
        </div>
        <DoctorProfile d={featuredDoctor} />
      </section>

      {/* PATIENT REVIEWS */}
      <section className="container py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="pill bg-accent text-accent-foreground mb-3">
              <Star className="size-3.5" /> {t("reviews.pill")}
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight max-w-2xl">
              {t("reviews.titlePre")} <em className="text-primary not-italic">{t("reviews.titleEm")}</em>
            </h2>
          </div>
        </div>

        <Tabs defaultValue="written" className="w-full">
          <TabsList className="h-auto p-1 rounded-full bg-muted mb-8">
            <TabsTrigger value="written" className="rounded-full px-5 py-2 data-[state=active]:bg-background">
              <Star className="size-3.5 mr-1.5" /> Written Reviews
            </TabsTrigger>
            <TabsTrigger value="beforeafter" className="rounded-full px-5 py-2 data-[state=active]:bg-background">
              <Sparkles className="size-3.5 mr-1.5" /> Before / After
            </TabsTrigger>
          </TabsList>

          <TabsContent value="written" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map((r) => <PatientReview key={r.patient} r={r} />)}
            </div>
          </TabsContent>

          <TabsContent value="beforeafter" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <BeforeAfterCard before={v1} after={v4} doctor="Park Min-jun" city="Yuna K. · Singapore → Seoul" procedure="Double Eyelid" />
              <BeforeAfterCard before={v3} after={v2} doctor="Elif Demir" city="Camille R. · Paris → Istanbul" procedure="Rhinoplasty" />
              <BeforeAfterCard before={v5} after={v6} doctor="Suchada Pong" city="Mei L. · Shanghai → Bangkok" procedure="V-Line Surgery" defaultBlur={false} />
              <BeforeAfterCard before={v2} after={v4} doctor="Aoba Tanaka" city="Hana S. · Tokyo → Seoul" procedure="Rhinoplasty" />
              <BeforeAfterCard before={v6} after={v3} doctor="Lumière Dubois" city="Sofia G. · Madrid → Paris" procedure="Facelift" />
              <BeforeAfterCard before={v4} after={v1} doctor="Park Min-jun" city="Aisha M. · Dubai → Seoul" procedure="Eyelid Revision" defaultBlur={false} />
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* WHY TRUST GLOWY */}
      <WhyTrustGlowy />

      {/* HOW IT WORKS */}
      <section className="container py-24">
        <div className="bg-gradient-hero rounded-[3rem] p-10 md:p-16 relative overflow-hidden">
          <div className="absolute top-10 right-10 size-40 bg-primary/30 blur-3xl rounded-full" />
          <div className="relative grid md:grid-cols-3 gap-10">
            {[
              { n: "01", t: t("how.watch"), d: t("how.watchDesc") },
              { n: "02", t: t("how.consult"), d: t("how.consultDesc") },
              { n: "03", t: t("how.fly"), d: t("how.flyDesc") },
            ].map((s) => (
              <div key={s.n}>
                <p className="font-display text-7xl text-primary/50 font-medium">{s.n}</p>
                <h3 className="font-display text-3xl font-semibold mt-2">{s.t}</h3>
                <p className="text-muted-foreground mt-2">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Clinic onboarding */}
      <section className="container py-24">
        <div className="relative rounded-[3rem] bg-foreground text-background p-10 md:p-20 overflow-hidden">
          <div className="absolute -bottom-20 -right-20 size-80 bg-primary blur-3xl opacity-40 animate-blob" />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="pill bg-background/10 text-background mb-4">{t("cta.pill")}</span>
              <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight leading-[1]">
                {t("cta.titlePre")} <em className="text-primary not-italic">{t("cta.titleEm")}</em>
              </h2>
              <p className="text-background/70 mt-5 max-w-md">{t("cta.desc")}</p>
            </div>
            <div className="space-y-3">
              {["Free surgeon profile + consult booking", "Video-first recovery diaries", "Global Gen-Z patient base", "Pay only when surgeries convert"].map((p) => (
                <div key={p} className="flex items-center gap-3 bg-background/5 rounded-2xl px-5 py-4">
                  <div className="size-2 rounded-full bg-primary" />
                  <p className="text-sm">{p}</p>
                </div>
              ))}
              <Link to={lp("/onboarding")}>
                <Button size="lg" className="w-full rounded-2xl bg-primary text-foreground hover:bg-primary/90 h-14 text-base mt-2">
                  {t("cta.apply")} <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES — short-video feed only */}
      <section id="success-stories" className="container py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-6">
          {[
            { src: v4, user: "hana_seoul", caption: "Day 30 — double eyelid heals 🤍", likes: "892K", comments: "12K", treatment: "doubleeyelid", priceFrom: 1500, priceTo: 2800 },
            { src: v2, user: "olivia.glow", caption: "6 months post rhino — Istanbul ✨", likes: "1.4M", comments: "21K", treatment: "rhinoplasty", priceFrom: 2400, priceTo: 4200 },
            { src: v3, user: "leila.era", caption: "V-line vlog · week 4 in Bangkok", likes: "640K", comments: "8.4K", treatment: "vlinesurgery", priceFrom: 6800, priceTo: 9400 },
            { src: v6, user: "newme.camille", caption: "Breast aug recovery diary 🩷", likes: "2.1M", comments: "33K", treatment: "breastaug", priceFrom: 3200, priceTo: 5400 },
            { src: v1, user: "yuna.softgirl", caption: "Pre-op consult vlog · Gangnam", likes: "412K", comments: "5.1K", treatment: "consultation", priceFrom: 1500, priceTo: 2800 },
            { src: v5, user: "mei.bkk", caption: "Aftercare hotel tour 🌴", likes: "276K", comments: "3.8K", treatment: "aftercare", priceFrom: 5400, priceTo: 7200 },
          ].map((s, i) => (
            <VideoCard key={i} {...s} tilt={0} />
          ))}
        </div>
      </section>

      <Footer />
      <FloatingQuoteCTA />
    </div>
  );
};

export default Index;

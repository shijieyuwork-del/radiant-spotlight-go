import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Star, MapPin, ShieldCheck, TrendingUp, Globe2, Heart, Scissors } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
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
  { src: v4, user: "minji_surgery", caption: "Day 30 after double eyelid 👀", likes: "1.2M", comments: "18K", treatment: "doubleeyelid", tilt: -2 },
  { src: v2, user: "rosie.bloom", caption: "Rhinoplasty reveal — 6 months post-op", likes: "2.4M", comments: "32K", treatment: "rhinoplasty", tilt: 1.5 },
  { src: v3, user: "jaw.journey", caption: "V-line surgery vlog ep.4", likes: "892K", comments: "11K", treatment: "vlinesurgery", tilt: -1 },
  { src: v6, user: "newme.era", caption: "My breast augmentation diary 🩷", likes: "640K", comments: "9.2K", treatment: "breastaug", tilt: 2 },
  { src: v5, user: "seoulclinictour", caption: "Inside Gangnam's top surgery clinic", likes: "421K", comments: "3.2K", treatment: "clinictour", tilt: -1.5 },
  { src: v1, user: "softgirl.era", caption: "Pre-op consultation, what to ask", likes: "276K", comments: "4.1K", treatment: "consultation", tilt: 1 },
];

const clinics = [
  { name: "Maison Lumière Chirurgie", city: "Paris, France", rating: 4.9, reviews: 1284, img: c2, tag: "Board Certified" },
  { name: "Aoba Plastic Surgery", city: "Tokyo, Japan", rating: 4.95, reviews: 2103, img: c3, tag: "Trending" },
  { name: "Verde Surgical Center", city: "Seoul, Korea", rating: 4.88, reviews: 3402, img: c1, tag: "Top Rated" },
];

const treatments = [
  { name: "Double Eyelid", from: "$1,800", emoji: "👀", grad: "from-[hsl(155,60%,80%)] to-[hsl(50,80%,90%)]" },
  { name: "Rhinoplasty", from: "$4,200", emoji: "👃", grad: "from-[hsl(340,85%,88%)] to-[hsl(18,90%,88%)]" },
  { name: "V-Line Surgery", from: "$6,800", emoji: "💎", grad: "from-[hsl(158,60%,82%)] to-[hsl(155,70%,90%)]" },
  { name: "Breast Aug", from: "$5,400", emoji: "🩷", grad: "from-[hsl(50,80%,90%)] to-[hsl(340,85%,90%)]" },
  { name: "Liposuction", from: "$3,500", emoji: "✨", grad: "from-[hsl(340,85%,90%)] to-[hsl(155,60%,85%)]" },
  { name: "Facelift", from: "$8,900", emoji: "🪞", grad: "from-[hsl(190,70%,88%)] to-[hsl(155,70%,88%)]" },
];

const Index = () => {
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
                <Scissors className="size-3.5 text-primary" />
                4,200+ board-certified surgeons worldwide
              </span>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] tracking-tight">
                Your new <em className="text-primary not-italic">era</em>,<br />
                surgically yours.
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                The video-first discovery platform for cosmetic surgery. Real recovery diaries, board-certified surgeons, transparent pricing — the only place to plan your transformation.
              </p>

              {/* Search */}
              <div className="bg-card rounded-3xl p-2 shadow-pop flex flex-col sm:flex-row gap-2 max-w-2xl">
                <div className="flex-1 px-5 py-3">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Procedure</p>
                  <input className="w-full bg-transparent outline-none text-sm font-medium" placeholder="Rhinoplasty, double eyelid..." />
                </div>
                <div className="flex-1 px-5 py-3 sm:border-l border-border">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">City</p>
                  <input className="w-full bg-transparent outline-none text-sm font-medium" placeholder="Seoul, Istanbul, Bangkok..." />
                </div>
                <Button size="lg" className="rounded-2xl bg-foreground text-background hover:bg-foreground/90 h-auto px-6">
                  Search <ArrowRight className="ml-1 size-4" />
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-primary" /> Board-certified only</span>
                <span className="flex items-center gap-1.5"><Globe2 className="size-4 text-primary" /> 47 countries</span>
                <span className="flex items-center gap-1.5"><Heart className="size-4 text-primary" /> 2M+ recovery diaries</span>
              </div>
            </div>

            {/* Hero video collage */}
            <div className="lg:col-span-5 relative h-[520px] hidden lg:block">
              <div className="absolute top-0 left-4 w-48 animate-float">
                <VideoCard {...videos[0]} />
              </div>
              <div className="absolute top-16 right-0 w-56 animate-float" style={{ animationDelay: "1s" }}>
                <VideoCard {...videos[1]} />
              </div>
              <div className="absolute bottom-0 left-20 w-52 animate-float" style={{ animationDelay: "2s" }}>
                <VideoCard {...videos[2]} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="py-8 border-y border-border/60 bg-card overflow-hidden">
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

      {/* TIKTOK FEED */}
      <section className="container py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="pill bg-secondary text-secondary-foreground mb-3"><TrendingUp className="size-3.5" /> Watch now</span>
            <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight max-w-2xl">
              Real surgeries, <em className="text-primary not-italic">real recoveries.</em>
            </h2>
          </div>
          <Button variant="ghost" className="rounded-full self-start md:self-end">
            See all videos <ArrowRight className="ml-1 size-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {videos.map((v, i) => <VideoCard key={i} {...v} tilt={0} />)}
        </div>
      </section>

      {/* TRENDING TREATMENTS */}
      <section className="container py-16">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="pill bg-accent text-accent-foreground mb-3">Trending this week</span>
          <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            What everyone's <em className="text-primary not-italic">obsessed</em> with
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {treatments.map((t) => (
            <Link
              key={t.name}
              to="/treatment/glow-facial"
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

      {/* PATIENT STORIES */}
      <section className="container py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="pill bg-secondary text-secondary-foreground mb-3">
              <Heart className="size-3.5" /> Patient stories
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight max-w-2xl">
              Their <em className="text-primary not-italic">transformation</em>, told by them.
            </h2>
          </div>
          <Button variant="ghost" className="rounded-full self-start md:self-end">
            Read all stories <ArrowRight className="ml-1 size-4" />
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

      {/* FEATURED CLINICS */}
      <section className="container py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="pill bg-primary-soft text-foreground mb-3" style={{ background: "hsl(var(--primary-soft))" }}>
              <ShieldCheck className="size-3.5" /> Verified
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight max-w-2xl">
              Surgeons girls actually <em className="text-primary not-italic">trust.</em>
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {clinics.map((c) => (
            <div key={c.name} className="glow-card rounded-[2rem] overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={c.img} alt={c.name} loading="lazy" className="size-full object-cover transition-transform duration-700 hover:scale-105" />
                <span className="absolute top-4 left-4 pill bg-background/90 backdrop-blur shadow-soft">{c.tag}</span>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl font-semibold leading-tight">{c.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="size-3.5" /> {c.city}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold flex items-center gap-1"><Star className="size-4 fill-primary text-primary" /> {c.rating}</p>
                    <p className="text-xs text-muted-foreground">{c.reviews} reviews</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full rounded-full">View clinic</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container py-24">
        <div className="bg-gradient-hero rounded-[3rem] p-10 md:p-16 relative overflow-hidden">
          <div className="absolute top-10 right-10 size-40 bg-primary/30 blur-3xl rounded-full" />
          <div className="relative grid md:grid-cols-3 gap-10">
            {[
              { n: "01", t: "Watch", d: "Scroll real recovery diaries from verified surgical patients worldwide." },
              { n: "02", t: "Consult", d: "Book free virtual consults with board-certified surgeons. Compare quotes." },
              { n: "03", t: "Fly & operate", d: "Travel packages, aftercare hotels, English-speaking coordinators included." },
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
              <span className="pill bg-background/10 text-background mb-4">For surgeons</span>
              <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight leading-[1]">
                Bring your practice to <em className="text-primary not-italic">millions.</em>
              </h2>
              <p className="text-background/70 mt-5 max-w-md">Join 4,200+ board-certified plastic surgery clinics. Showcase your work through patient diaries, attract international patients, fill your OR.</p>
            </div>
            <div className="space-y-3">
              {["Free surgeon profile + consult booking", "Video-first recovery diaries", "Global Gen-Z patient base", "Pay only when surgeries convert"].map((p) => (
                <div key={p} className="flex items-center gap-3 bg-background/5 rounded-2xl px-5 py-4">
                  <div className="size-2 rounded-full bg-primary" />
                  <p className="text-sm">{p}</p>
                </div>
              ))}
              <Link to="/onboarding">
                <Button size="lg" className="w-full rounded-2xl bg-primary text-foreground hover:bg-primary/90 h-14 text-base mt-2">
                  Apply to join <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

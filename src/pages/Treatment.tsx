import { Link, useParams } from "react-router-dom";
import { Star, MapPin, Clock, Shield, Heart, Share2, ArrowRight, Check, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import v2 from "@/assets/video2.jpg";
import v4 from "@/assets/video4.jpg";
import v6 from "@/assets/video6.jpg";
import c1 from "@/assets/clinic1.jpg";
import c2 from "@/assets/clinic2.jpg";
import c3 from "@/assets/clinic3.jpg";

const Treatment = () => {
  useParams();

  const offers = [
    { clinic: "Verde Med Spa", city: "Seoul", price: "$140", original: "$220", rating: 4.95, img: c1 },
    { clinic: "Aoba Skin Atelier", city: "Tokyo", price: "$180", original: "$260", rating: 4.92, img: c3 },
    { clinic: "Maison Lumière", city: "Paris", price: "$240", original: "$310", rating: 4.88, img: c2 },
  ];

  const reviews = [
    { name: "Hana K.", age: 22, text: "Honestly the best my skin has ever looked. Booked through Glowy and the clinic was so kind 🥺", rating: 5 },
    { name: "Mei L.", age: 24, text: "Watched the videos before going and it was exactly as shown — zero surprises. Glowy literally changed how I find clinics.", rating: 5 },
    { name: "Sofia R.", age: 21, text: "Glow facial in Seoul → glass skin for weeks. The booking was instant!", rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="container pt-10 pb-6">
        <nav className="text-sm text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-foreground">Discover</Link>
          <span>/</span>
          <span>Treatments</span>
          <span>/</span>
          <span className="text-foreground">Glow Facial</span>
        </nav>
      </section>

      {/* Hero */}
      <section className="container grid lg:grid-cols-12 gap-10 pb-16">
        <div className="lg:col-span-7 space-y-6">
          <span className="pill bg-secondary text-secondary-foreground">
            <Sparkles className="size-3.5" /> Trending #1 in Asia
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-medium tracking-tight leading-[0.95]">
            Glow <em className="text-primary not-italic">Facial</em>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            The signature multi-step facial that gives you that glass-skin glow. Hydration, light exfoliation, LED therapy & a custom serum mask.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <span className="pill bg-muted"><Clock className="size-3.5" /> 60 min</span>
            <span className="pill bg-muted"><Shield className="size-3.5" /> Non-invasive</span>
            <span className="pill bg-muted">No downtime</span>
            <span className="pill bg-muted"><Star className="size-3.5 fill-primary text-primary" /> 4.93 avg</span>
          </div>

          <div className="flex gap-3 pt-4">
            <Button size="lg" className="rounded-2xl bg-foreground text-background hover:bg-foreground/90 h-14 px-8">
              Book now <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-2xl h-14 px-5">
              <Heart className="size-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-2xl h-14 px-5">
              <Share2 className="size-4" />
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5 relative h-[480px]">
          <div className="absolute top-0 right-0 w-56 animate-float">
            <VideoCard src={v2} user="rosie.bloom" caption="Glass skin facial reveal" likes="512K" comments="8.9K" treatment="glowfacial" />
          </div>
          <div className="absolute bottom-0 left-0 w-48 animate-float" style={{ animationDelay: "1.5s" }}>
            <VideoCard src={v4} user="minji_glow" caption="Before & after 1 week" likes="284K" comments="2.1K" treatment="results" />
          </div>
        </div>
      </section>

      {/* Compare offers */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            Compare <em className="text-primary not-italic">offers</em>
          </h2>
          <p className="text-sm text-muted-foreground">{offers.length} verified clinics</p>
        </div>

        <div className="grid gap-4">
          {offers.map((o) => (
            <div key={o.clinic} className="glow-card rounded-3xl p-4 flex flex-col sm:flex-row gap-5 items-center">
              <img src={o.img} alt={o.clinic} loading="lazy" className="size-28 rounded-2xl object-cover" />
              <div className="flex-1">
                <h3 className="font-display text-xl font-semibold">{o.clinic}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="size-3.5" /> {o.city}
                </p>
                <p className="text-sm flex items-center gap-1 mt-1">
                  <Star className="size-3.5 fill-primary text-primary" /> {o.rating} · Verified
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl font-semibold text-primary">{o.price}</p>
                <p className="text-xs text-muted-foreground line-through">{o.original}</p>
              </div>
              <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90">Book</Button>
            </div>
          ))}
        </div>
      </section>

      {/* What's included */}
      <section className="container py-16 grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            What's <em className="text-primary not-italic">included</em>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md">A complete glow ritual designed for that lit-from-within finish.</p>
        </div>
        <div className="space-y-3">
          {["Skin diagnostic with AI scan", "Deep cleanse & enzyme exfoliation", "Hydra-infusion serum boost", "LED light therapy (red + blue)", "Custom sheet mask & cooling cryo", "Aftercare kit to take home"].map((i) => (
            <div key={i} className="flex items-center gap-3 bg-card rounded-2xl px-5 py-4 shadow-soft">
              <div className="size-8 rounded-full bg-gradient-mint grid place-items-center shrink-0">
                <Check className="size-4" />
              </div>
              <p className="text-sm font-medium">{i}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="pill bg-accent text-accent-foreground mb-3">Real reviews</span>
            <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
              From girls who <em className="text-primary not-italic">glowed up.</em>
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <div key={r.name} className="glow-card rounded-3xl p-6">
              <div className="flex gap-0.5 mb-3">
                {[...Array(r.rating)].map((_, i) => <Star key={i} className="size-4 fill-primary text-primary" />)}
              </div>
              <p className="text-foreground/90 leading-relaxed">"{r.text}"</p>
              <div className="mt-5 pt-5 border-t border-border flex items-center gap-3">
                <div className="size-10 rounded-full bg-gradient-peach grid place-items-center font-display font-semibold">
                  {r.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.age} years · Verified booking</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* More videos */}
      <section className="container py-16">
        <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight mb-8">
          More <em className="text-primary not-italic">#glowfacial</em> moments
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <VideoCard src={v2} user="rosie.bloom" caption="Glass skin reveal" likes="512K" comments="8.9K" treatment="glowfacial" />
          <VideoCard src={v6} user="creamydream" caption="My aftercare routine" likes="98K" comments="1.4K" treatment="aftercare" />
          <VideoCard src={v4} user="minji_glow" caption="6 month progress" likes="284K" comments="2.1K" treatment="results" />
          <VideoCard src={v2} user="hanaglows" caption="First time at the clinic" likes="201K" comments="3.0K" treatment="firsttime" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Treatment;

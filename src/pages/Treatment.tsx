import { Link, useParams } from "react-router-dom";
import { Star, MapPin, Clock, Shield, Heart, Share2, ArrowRight, Check, Scissors } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { FloatingQuoteCTA } from "@/components/QuoteRequest";
import GlobalPriceCompare from "@/components/GlobalPriceCompare";
import PriceBadge from "@/components/PriceBadge";
import PriceTrustBadge from "@/components/PriceTrustBadge";
import { useLangPath } from "@/lib/i18n";
import v2 from "@/assets/video2.jpg";
import v4 from "@/assets/video4.jpg";
import v6 from "@/assets/video6.jpg";
import c1 from "@/assets/clinic1.jpg";
import c2 from "@/assets/clinic2.jpg";
import c3 from "@/assets/clinic3.jpg";

const Treatment = () => {
  useParams();
  const lp = useLangPath();
  const offers = [
    { clinic: "Verde Surgical Center", city: "Seoul", price: "$1,800", original: "$2,400", rating: 4.95, img: c1 },
    { clinic: "Aoba Plastic Surgery", city: "Tokyo", price: "$2,200", original: "$2,900", rating: 4.92, img: c3 },
    { clinic: "Maison Lumière Chirurgie", city: "Paris", price: "$3,400", original: "$4,100", rating: 4.88, img: c2 },
  ];

  const reviews = [
    { name: "Hana K.", age: 22, text: "Day 60 post-op and I literally cry happy tears every morning. The surgeon was insanely precise — natural crease, exactly what I asked for 🥺", rating: 5 },
    { name: "Mei L.", age: 24, text: "Watched her recovery diary on Cosmetics Asia before flying to Seoul. Everything matched — same results, same surgeon, same kindness. No surprises.", rating: 5 },
    { name: "Sofia R.", age: 21, text: "Got my double eyelid in Gangnam, recovered in their aftercare hotel. Felt safe the whole time. Best decision I've made.", rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="container pt-10 pb-6">
        <nav className="text-sm text-muted-foreground flex items-center gap-2">
          <Link to={lp("/")} className="hover:text-foreground">Discover</Link>
          <span>/</span>
          <span>Procedures</span>
          <span>/</span>
          <span className="text-foreground">Double Eyelid Surgery</span>
        </nav>
      </section>

      {/* Hero */}
      <section className="container grid lg:grid-cols-12 gap-10 pb-16">
        <div className="lg:col-span-7 space-y-6">
          <span className="pill bg-secondary text-secondary-foreground">
            <Scissors className="size-3.5" /> #1 surgical procedure in Asia
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-medium tracking-tight leading-[0.95]">
            Double Eyelid <em className="text-primary not-italic">Surgery</em>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            The signature surgical procedure to create a natural, defined upper eyelid crease. Incisional or partial-incision technique, performed under local anesthesia by board-certified surgeons.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <span className="pill bg-muted"><Clock className="size-3.5" /> 1–2 hr surgery</span>
            <span className="pill bg-muted"><Shield className="size-3.5" /> Local anesthesia</span>
            <span className="pill bg-muted">7–10 day downtime</span>
            <span className="pill bg-muted"><Star className="size-3.5 fill-primary text-primary" /> 4.93 avg</span>
            <PriceBadge from={1500} to={2800} size="md" />
            <PriceTrustBadge variant="subtle" />
          </div>

          <div className="flex gap-3 pt-4">
            <Button size="lg" className="rounded-2xl bg-foreground text-background hover:bg-foreground/90 h-14 px-8">
              Book consult <ArrowRight className="ml-2 size-4" />
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
            <VideoCard src={v2} user="rosie.bloom" caption="Day 14 reveal — natural crease" likes="1.2M" comments="18K" treatment="doubleeyelid" priceFrom={1800} />
          </div>
          <div className="absolute bottom-0 left-0 w-48 animate-float" style={{ animationDelay: "1.5s" }}>
            <VideoCard src={v4} user="minji_surgery" caption="6 month healing update" likes="640K" comments="9.2K" treatment="recovery" priceFrom={1500} priceTo={2800} />
          </div>
        </div>
      </section>

      {/* Compare offers */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            Compare <em className="text-primary not-italic">offers</em>
          </h2>
          <p className="text-sm text-muted-foreground">{offers.length} board-certified surgeons</p>
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
              <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90">Consult</Button>
            </div>
          ))}
        </div>
      </section>

      {/* GLOBAL PRICE COMPARE */}
      <section className="container py-16">
        <GlobalPriceCompare
          procedure="Double Eyelid Surgery"
          featured="Korea"
          prices={[
            { country: "USA", flag: "🇺🇸", low: 4000, high: 7500 },
            { country: "UK", flag: "🇬🇧", low: 3200, high: 5400 },
            { country: "Korea", flag: "🇰🇷", low: 1500, high: 2800 },
            { country: "Thailand", flag: "🇹🇭", low: 900, high: 1600 },
            { country: "Turkey", flag: "🇹🇷", low: 1700, high: 2600 },
          ]}
        />
      </section>

      {/* What's included */}
      <section className="container py-16 grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            What's <em className="text-primary not-italic">included</em>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md">A complete surgical package — from first consult to full recovery, handled end-to-end.</p>
        </div>
        <div className="space-y-3">
          {["Free virtual consult with board-certified surgeon", "3D simulation & personalized eyelid design", "Surgery in fully accredited operating room", "1 night recovery suite + overnight nurse", "Stitch removal + 3 follow-up visits", "Aftercare hotel package & airport transfer"].map((i) => (
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
              From girls who <em className="text-primary not-italic">transformed.</em>
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
          More <em className="text-primary not-italic">#doubleeyelid</em> diaries
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <VideoCard src={v2} user="rosie.bloom" caption="Day 14 reveal" likes="1.2M" comments="18K" treatment="doubleeyelid" priceFrom={1800} />
          <VideoCard src={v6} user="newme.era" caption="My aftercare routine" likes="98K" comments="1.4K" treatment="aftercare" />
          <VideoCard src={v4} user="minji_surgery" caption="6 month healing" likes="640K" comments="9.2K" treatment="recovery" priceFrom={1500} priceTo={2800} />
          <VideoCard src={v2} user="hanaglows" caption="Before surgery vlog" likes="201K" comments="3.0K" treatment="preop" priceFrom={1500} />
        </div>
      </section>

      <Footer />
      <FloatingQuoteCTA ctx={{ procedure: "Double Eyelid Surgery" }} />
    </div>
  );
};

export default Treatment;

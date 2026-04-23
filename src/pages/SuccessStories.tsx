import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, Search, Sparkles, TrendingUp, X } from "lucide-react";
import v1 from "@/assets/video1.jpg";
import v2 from "@/assets/video2.jpg";
import v3 from "@/assets/video3.jpg";
import v4 from "@/assets/video4.jpg";
import v5 from "@/assets/video5.jpg";
import v6 from "@/assets/video6.jpg";

const sources = [v1, v2, v3, v4, v5, v6];
const treatments = ["doubleeyelid", "rhinoplasty", "vlinesurgery", "breastaug", "liposuction", "facelift", "hairtransplant", "consultation"] as const;
const captions = [
  "Day 30 — double eyelid heals 🤍",
  "6 months post rhino — Istanbul ✨",
  "V-line vlog · week 4 in Bangkok",
  "Breast aug recovery diary 🩷",
  "Pre-op consult · Gangnam",
  "Aftercare hotel tour 🌴",
  "Hair transplant · 8 month update",
  "Lip lift reveal · Seoul",
  "Lipo + contouring vlog 💎",
  "Day 1 vs day 60 — rhinoplasty",
  "Recovery essentials haul 🛍️",
  "Inside a Gangnam clinic tour",
  "Mommy makeover · 3 months in",
  "Brow lift unboxing 👀",
  "Facelift week 6 reveal",
  "Honest thoughts · 1 year later",
];
const users = [
  "minji_seoul", "rosie.bloom", "jaw.journey", "newme.era", "softgirl.era",
  "seoulclinictour", "hana_tokyo", "leila.era", "olivia.glow", "camille.fr",
  "mei.bkk", "yuna.sg", "aisha.dxb", "sofia.mx", "chloe.par", "amy.nyc",
];
const filters = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "rhinoplasty", label: "Rhinoplasty", icon: Sparkles },
  { id: "doubleeyelid", label: "Double Eyelid", icon: Sparkles },
  { id: "vlinesurgery", label: "V-Line", icon: Sparkles },
  { id: "breastaug", label: "Breast Aug", icon: Sparkles },
  { id: "hairtransplant", label: "Hair Transplant", icon: Sparkles },
  { id: "facelift", label: "Facelift", icon: Sparkles },
];

const random = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const buildVideos = (count: number) =>
  Array.from({ length: count }).map((_, i) => {
    const r = random(i + 1);
    const treatment = treatments[i % treatments.length];
    const from = 1500 + Math.floor(random(i + 7) * 60) * 100;
    const to = from + 1200 + Math.floor(random(i + 13) * 30) * 100;
    return {
      id: i,
      src: sources[i % sources.length],
      user: users[i % users.length],
      caption: captions[i % captions.length],
      likes: `${(100 + Math.floor(r * 2400))}K`,
      comments: `${(2 + Math.floor(r * 40))}K`,
      treatment,
      priceFrom: from,
      priceTo: to,
    };
  });

const SuccessStories = () => {
  const [filter, setFilter] = useState<string>("all");
  const [visible, setVisible] = useState(24);
  const all = useMemo(() => buildVideos(48), []);
  const filtered = filter === "all" || filter === "trending"
    ? all
    : all.filter((v) => v.treatment === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="container pt-12 pb-8">
        <div className="max-w-3xl">
          <span className="pill bg-accent text-accent-foreground mb-4">
            <Heart className="size-3.5" /> Success Stories
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-medium tracking-tight leading-[0.95]">
            Real recovery diaries, <em className="text-primary not-italic">on repeat.</em>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mt-5 max-w-xl">
            Endless short videos from real patients, day-by-day. Filter by procedure, scroll forever.
          </p>
        </div>

        {/* Filter chips */}
        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => { setFilter(f.id); setVisible(24); }}
              className={`pill transition-colors ${
                filter === f.id
                  ? "bg-foreground text-background"
                  : "bg-card hover:bg-accent text-foreground border border-border"
              }`}
            >
              <f.icon className="size-3.5" /> {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Video grid */}
      <section className="container pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6">
          {filtered.slice(0, visible).map((v) => (
            <VideoCard key={v.id} {...v} tilt={0} />
          ))}
        </div>

        {visible < filtered.length && (
          <div className="mt-12 flex justify-center">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8"
              onClick={() => setVisible((n) => n + 16)}
            >
              Load more videos
            </Button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default SuccessStories;

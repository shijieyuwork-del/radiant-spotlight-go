import { Link } from "react-router-dom";
import { TrendingUp, MapPin, Star, ShieldCheck, ArrowRight } from "lucide-react";
import { useI18n, type RegionCode } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

interface RegionContent {
  intro: string;
  procedures: { name: string; slug: string; usd: number; emoji: string; tag: string }[];
  doctors: { name: string; city: string; flag: string; rating: number; cases: string }[];
}

const data: Record<RegionCode, RegionContent> = {
  US: {
    intro: "What patients flying from the US are booking right now",
    procedures: [
      { name: "Rhinoplasty in Korea", slug: "rhinoplasty-korea", usd: 4200, emoji: "👃", tag: "60% less than US" },
      { name: "Hair Transplant in Turkey", slug: "hair-transplant-turkey", usd: 2400, emoji: "💇", tag: "Top destination" },
      { name: "Dental Veneers in Mexico", slug: "veneers-mexico", usd: 3500, emoji: "🦷", tag: "Border-friendly" },
    ],
    doctors: [
      { name: "Dr. Park Min-jun", city: "Seoul", flag: "🇰🇷", rating: 4.9, cases: "3.2K" },
      { name: "Dr. Elif Demir", city: "Istanbul", flag: "🇹🇷", rating: 4.95, cases: "5.1K" },
    ],
  },
  GB: {
    intro: "Trending among UK patients this month",
    procedures: [
      { name: "Rhinoplasty in Turkey", slug: "rhinoplasty-turkey", usd: 3100, emoji: "👃", tag: "70% less than UK" },
      { name: "Breast Aug in Czech Republic", slug: "breast-aug-czech", usd: 4800, emoji: "🩷", tag: "EU-trusted" },
      { name: "Liposuction in Korea", slug: "liposuction-korea", usd: 3500, emoji: "✨", tag: "Top rated" },
    ],
    doctors: [
      { name: "Dr. Elif Demir", city: "Istanbul", flag: "🇹🇷", rating: 4.95, cases: "5.1K" },
      { name: "Dr. Park Min-jun", city: "Seoul", flag: "🇰🇷", rating: 4.9, cases: "3.2K" },
    ],
  },
  AE: {
    intro: "Trending among patients in the UAE — privacy mode on by default",
    procedures: [
      { name: "Rhinoplasty in Korea", slug: "rhinoplasty-korea", usd: 4200, emoji: "👃", tag: "Discreet travel" },
      { name: "Hair Transplant in Turkey", slug: "hair-transplant-turkey", usd: 2400, emoji: "💇", tag: "Short flight" },
      { name: "Facelift in Thailand", slug: "facelift-thailand", usd: 5800, emoji: "🪞", tag: "Recovery resort" },
    ],
    doctors: [
      { name: "Dr. Suchada Pong", city: "Bangkok", flag: "🇹🇭", rating: 4.92, cases: "4.4K" },
      { name: "Dr. Elif Demir", city: "Istanbul", flag: "🇹🇷", rating: 4.95, cases: "5.1K" },
    ],
  },
  KR: {
    intro: "Most-booked by patients near you in Korea",
    procedures: [
      { name: "Double Eyelid in Seoul", slug: "double-eyelid-korea", usd: 1800, emoji: "👀", tag: "Local #1" },
      { name: "V-Line Surgery in Seoul", slug: "v-line-korea", usd: 6800, emoji: "💎", tag: "Gangnam favorite" },
      { name: "Rhinoplasty in Seoul", slug: "rhinoplasty-korea", usd: 4200, emoji: "👃", tag: "Top rated" },
    ],
    doctors: [
      { name: "Dr. Park Min-jun", city: "Seoul", flag: "🇰🇷", rating: 4.9, cases: "3.2K" },
      { name: "Dr. Aoba Saito", city: "Tokyo", flag: "🇯🇵", rating: 4.93, cases: "2.4K" },
    ],
  },
  TH: {
    intro: "Trending in Thailand this week",
    procedures: [
      { name: "Breast Aug in Bangkok", slug: "breast-aug-thailand", usd: 5400, emoji: "🩷", tag: "Local favorite" },
      { name: "Facelift in Bangkok", slug: "facelift-thailand", usd: 5800, emoji: "🪞", tag: "Top rated" },
      { name: "Rhinoplasty in Bangkok", slug: "rhinoplasty-thailand", usd: 3200, emoji: "👃", tag: "Trending" },
    ],
    doctors: [
      { name: "Dr. Suchada Pong", city: "Bangkok", flag: "🇹🇭", rating: 4.92, cases: "4.4K" },
      { name: "Dr. Park Min-jun", city: "Seoul", flag: "🇰🇷", rating: 4.9, cases: "3.2K" },
    ],
  },
  CN: {
    intro: "Trending among patients in China",
    procedures: [
      { name: "Double Eyelid in Korea", slug: "double-eyelid-korea", usd: 1800, emoji: "👀", tag: "Short flight" },
      { name: "Rhinoplasty in Korea", slug: "rhinoplasty-korea", usd: 4200, emoji: "👃", tag: "Mandarin care" },
      { name: "V-Line in Korea", slug: "v-line-korea", usd: 6800, emoji: "💎", tag: "Gangnam clinics" },
    ],
    doctors: [
      { name: "Dr. Park Min-jun", city: "Seoul", flag: "🇰🇷", rating: 4.9, cases: "3.2K" },
      { name: "Dr. Aoba Saito", city: "Tokyo", flag: "🇯🇵", rating: 4.93, cases: "2.4K" },
    ],
  },
  FR: {
    intro: "Trending among patients in France",
    procedures: [
      { name: "Rhinoplasty in Turkey", slug: "rhinoplasty-turkey", usd: 3100, emoji: "👃", tag: "EU travel" },
      { name: "Facelift in Paris", slug: "facelift-france", usd: 8900, emoji: "🪞", tag: "Local prestige" },
      { name: "Liposuction in Spain", slug: "liposuction-spain", usd: 3700, emoji: "✨", tag: "Mediterranean" },
    ],
    doctors: [
      { name: "Dr. Camille Laurent", city: "Paris", flag: "🇫🇷", rating: 4.91, cases: "2.9K" },
      { name: "Dr. Elif Demir", city: "Istanbul", flag: "🇹🇷", rating: 4.95, cases: "5.1K" },
    ],
  },
};

const PopularInRegion = () => {
  const { region, regionMeta, formatPrice } = useI18n();
  const content = data[region];

  return (
    <section className="container py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="pill bg-secondary text-secondary-foreground mb-3">
            <TrendingUp className="size-3.5" /> {regionMeta.flag} Popular in {regionMeta.name}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight max-w-2xl">
            What patients near you <em className="text-primary not-italic">are booking.</em>
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-md">{content.intro}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {content.procedures.map((p) => (
          <Link
            key={p.slug}
            to={`/destination/${p.slug}`}
            className="group glow-card rounded-3xl p-6 bg-card flex flex-col"
          >
            <div className="flex items-start justify-between">
              <span className="text-4xl">{p.emoji}</span>
              <span className="pill bg-primary-soft text-foreground" style={{ background: "hsl(var(--primary-soft))" }}>
                {p.tag}
              </span>
            </div>
            <h3 className="font-display text-xl font-semibold mt-6 leading-tight">{p.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">from <span className="text-foreground font-semibold">{formatPrice(p.usd)}</span></p>
            <div className="flex items-center text-sm text-primary font-semibold mt-5 group-hover:gap-2 transition-all">
              View guide <ArrowRight className="size-3.5 ml-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid md:grid-cols-2 gap-4">
        {content.doctors.map((d) => (
          <div key={d.name} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
            <div className="size-12 rounded-2xl bg-gradient-mint grid place-items-center font-display font-semibold shrink-0">
              {d.name.split(" ")[1]?.[0] ?? d.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold leading-tight flex items-center gap-1.5">
                {d.name} <ShieldCheck className="size-3.5 text-primary" />
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="size-3" /> {d.flag} {d.city} · {d.cases} cases
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold flex items-center gap-1"><Star className="size-3.5 fill-primary text-primary" /> {d.rating}</p>
              <Button variant="ghost" size="sm" className="rounded-full text-xs h-7 px-2">View</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularInRegion;

import { useMemo, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search as SearchIcon, Star, MapPin, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmartSearch, { type SmartSearchFilters } from "@/components/SmartSearch";
import VideoCard from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { useLangPath } from "@/lib/i18n";
import v1 from "@/assets/video1.jpg";
import v2 from "@/assets/video2.jpg";
import v3 from "@/assets/video3.jpg";
import v4 from "@/assets/video4.jpg";
import v5 from "@/assets/video5.jpg";
import v6 from "@/assets/video6.jpg";
import c1 from "@/assets/clinic1.jpg";
import c2 from "@/assets/clinic2.jpg";
import c3 from "@/assets/clinic3.jpg";

// Normalize procedure label → simple key
const norm = (s?: string | null) =>
  (s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

type VideoItem = {
  src: string;
  user: string;
  caption: string;
  likes: string;
  comments: string;
  treatment: string;
  procedure: string; // canonical label
  city: string;
  country: string;
  rating: number;
  priceFrom: number;
  priceTo: number;
  hasBeforeAfter: boolean;
};

const VIDEOS: VideoItem[] = [
  { src: v4, user: "minji_seoul", caption: "Day 30 — Gangnam double eyelid 👀", likes: "1.2M", comments: "18K", treatment: "doubleeyelid", procedure: "Double Eyelid", city: "Seoul", country: "Korea", rating: 4.9, priceFrom: 1500, priceTo: 2800, hasBeforeAfter: true },
  { src: v2, user: "rosie.bloom", caption: "Rhinoplasty reveal — 6 months post-op", likes: "2.4M", comments: "32K", treatment: "rhinoplasty", procedure: "Rhinoplasty", city: "Seoul", country: "Korea", rating: 4.8, priceFrom: 2400, priceTo: 4200, hasBeforeAfter: true },
  { src: v3, user: "jaw.journey", caption: "V-line surgery vlog ep.4", likes: "892K", comments: "11K", treatment: "vlinesurgery", procedure: "V-Line Surgery", city: "Seoul", country: "Korea", rating: 4.7, priceFrom: 6800, priceTo: 9400, hasBeforeAfter: true },
  { src: v6, user: "newme.era", caption: "My breast augmentation diary 🩷", likes: "640K", comments: "9.2K", treatment: "breastaug", procedure: "Breast Aug", city: "Bangkok", country: "Thailand", rating: 4.6, priceFrom: 3200, priceTo: 5400, hasBeforeAfter: true },
  { src: v2, user: "istanbul.rosie", caption: "Istanbul rhinoplasty — 6 mo post-op", likes: "1.8M", comments: "21K", treatment: "rhinoplasty", procedure: "Rhinoplasty", city: "Istanbul", country: "Turkey", rating: 4.7, priceFrom: 2200, priceTo: 3900, hasBeforeAfter: true },
  { src: v3, user: "polanco.jaw", caption: "Lipo + contouring in Polanco", likes: "740K", comments: "8.1K", treatment: "liposuction", procedure: "Liposuction", city: "Mexico City", country: "Mexico", rating: 4.5, priceFrom: 2800, priceTo: 4600, hasBeforeAfter: true },
  { src: v4, user: "tokyo.minji", caption: "Tokyo double eyelid · day 30", likes: "980K", comments: "12K", treatment: "doubleeyelid", procedure: "Double Eyelid", city: "Tokyo", country: "Japan", rating: 4.9, priceFrom: 2100, priceTo: 3400, hasBeforeAfter: true },
  { src: v2, user: "paris.rosie", caption: "Paris rhinoplasty diary", likes: "1.1M", comments: "14K", treatment: "rhinoplasty", procedure: "Rhinoplasty", city: "Paris", country: "France", rating: 4.85, priceFrom: 5800, priceTo: 8400, hasBeforeAfter: false },
  { src: v6, user: "bkk.facelift", caption: "Bangkok facelift — 8 weeks", likes: "320K", comments: "4.4K", treatment: "facelift", procedure: "Facelift", city: "Bangkok", country: "Thailand", rating: 4.6, priceFrom: 4200, priceTo: 6800, hasBeforeAfter: true },
  { src: v1, user: "softgirl.era", caption: "Pre-op consultation, what to ask", likes: "276K", comments: "4.1K", treatment: "consultation", procedure: "Rhinoplasty", city: "Seoul", country: "Korea", rating: 4.4, priceFrom: 0, priceTo: 0, hasBeforeAfter: false },
  { src: v5, user: "seoulclinictour", caption: "Inside Gangnam's top surgery clinic", likes: "421K", comments: "3.2K", treatment: "clinictour", procedure: "Double Eyelid", city: "Seoul", country: "Korea", rating: 4.8, priceFrom: 1500, priceTo: 2800, hasBeforeAfter: true },
  { src: v3, user: "vline.tokyo", caption: "V-line revision Q&A", likes: "210K", comments: "2.9K", treatment: "vlinesurgery", procedure: "V-Line Surgery", city: "Tokyo", country: "Japan", rating: 4.7, priceFrom: 7400, priceTo: 9800, hasBeforeAfter: true },
];

type ClinicItem = {
  name: string; city: string; country: string; rating: number;
  reviews: number; img: string; topProcedure: string;
  priceFrom: number; priceTo: number;
};

const CLINICS: ClinicItem[] = [
  { name: "Verde Surgical Center", city: "Seoul", country: "Korea", rating: 4.88, reviews: 3402, img: c1, topProcedure: "Double Eyelid", priceFrom: 1500, priceTo: 2800 },
  { name: "Maison Lumière Chirurgie", city: "Paris", country: "France", rating: 4.9, reviews: 1284, img: c2, topProcedure: "Rhinoplasty", priceFrom: 5800, priceTo: 8400 },
  { name: "Aoba Plastic Surgery", city: "Tokyo", country: "Japan", rating: 4.95, reviews: 2103, img: c3, topProcedure: "Double Eyelid", priceFrom: 2100, priceTo: 3400 },
  { name: "Bosphorus Aesthetic Clinic", city: "Istanbul", country: "Turkey", rating: 4.78, reviews: 2641, img: c2, topProcedure: "Rhinoplasty", priceFrom: 2200, priceTo: 3900 },
  { name: "Sukhumvit Beauty Center", city: "Bangkok", country: "Thailand", rating: 4.72, reviews: 1882, img: c1, topProcedure: "Breast Aug", priceFrom: 3200, priceTo: 5400 },
  { name: "Polanco Estética", city: "Mexico City", country: "Mexico", rating: 4.65, reviews: 1421, img: c3, topProcedure: "Liposuction", priceFrom: 2800, priceTo: 4600 },
];

const SearchPage = () => {
  const [params] = useSearchParams();
  const lp = useLangPath();
  const initialProcedure = params.get("procedure");
  const initialPlace = params.get("place");

  const [filters, setFilters] = useState<SmartSearchFilters>({
    query: "",
    procedure: initialProcedure,
    place: initialPlace,
    price: [1500, 9000],
    minRating: 4.5,
    beforeAfter: true,
  });

  const onFiltersChange = useCallback((f: SmartSearchFilters) => setFilters(f), []);

  const matches = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const procKey = norm(filters.procedure);
    const placeKey = norm(filters.place);

    const videos = VIDEOS.filter((v) => {
      if (procKey && norm(v.procedure) !== procKey) return false;
      if (placeKey && norm(v.city) !== placeKey && norm(v.country) !== placeKey) return false;
      if (v.rating < filters.minRating) return false;
      if (filters.beforeAfter && !v.hasBeforeAfter) return false;
      const priceMid = (v.priceFrom + v.priceTo) / 2;
      if (priceMid > 0 && (priceMid < filters.price[0] || priceMid > filters.price[1])) return false;
      if (q) {
        const hay = `${v.user} ${v.caption} ${v.procedure} ${v.city} ${v.country}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const clinics = CLINICS.filter((c) => {
      if (procKey && norm(c.topProcedure) !== procKey) return false;
      if (placeKey && norm(c.city) !== placeKey && norm(c.country) !== placeKey) return false;
      if (c.rating < filters.minRating) return false;
      const priceMid = (c.priceFrom + c.priceTo) / 2;
      if (priceMid < filters.price[0] || priceMid > filters.price[1]) return false;
      if (q) {
        const hay = `${c.name} ${c.city} ${c.country} ${c.topProcedure}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return { videos, clinics };
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="container py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="pill bg-accent text-accent-foreground mb-3">
            <SearchIcon className="size-3.5" /> Smart search
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
            Find your <em className="text-primary not-italic">perfect match</em>
          </h1>
          <p className="text-muted-foreground mt-3">
            Filter by procedure, city, price and rating — see real videos and clinics.
          </p>
        </div>

        <SmartSearch
          initialProcedure={initialProcedure}
          initialPlace={initialPlace}
          onFiltersChange={onFiltersChange}
        />

        {/* Active summary */}
        <div className="mt-8 flex items-baseline justify-between">
          <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight">
            {matches.videos.length + matches.clinics.length} results
            {filters.procedure ? <span className="text-muted-foreground"> · {filters.procedure}</span> : null}
            {filters.place ? <span className="text-muted-foreground"> · {filters.place}</span> : null}
          </h2>
        </div>

        {/* Videos */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Videos · {matches.videos.length}
          </h3>
          {matches.videos.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8">No videos match your filters yet — try widening the price range or lowering the rating.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {matches.videos.map((v, i) => (
                <VideoCard
                  key={i}
                  src={v.src}
                  user={v.user}
                  caption={v.caption}
                  likes={v.likes}
                  comments={v.comments}
                  treatment={v.treatment}
                  tilt={0}
                  priceFrom={v.priceFrom || undefined}
                  priceTo={v.priceTo || undefined}
                />
              ))}
            </div>
          )}
        </div>

        {/* Clinics */}
        <div className="mt-12">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Clinics · {matches.clinics.length}
          </h3>
          {matches.clinics.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8">No clinics match — adjust filters to see more.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.clinics.map((c) => (
                <div key={c.name} className="rounded-3xl bg-card shadow-pop overflow-hidden hover:-translate-y-1 transition-transform">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-lg font-semibold">{c.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="size-3.5" /> {c.city}, {c.country}
                        </p>
                      </div>
                      <span className="pill bg-secondary text-secondary-foreground text-xs">
                        <Star className="size-3 fill-primary text-primary" /> {c.rating}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{c.topProcedure}</span>
                      <span className="font-semibold">${c.priceFrom.toLocaleString()}–${c.priceTo.toLocaleString()}</span>
                    </div>
                    <Button asChild className="mt-4 w-full rounded-2xl">
                      <Link to={lp("/treatment/glow-facial")}>
                        <ShieldCheck className="size-4" /> View clinic
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SearchPage;

import { useMemo, useState } from "react";
import { Star, Sparkles, ShieldCheck, Search, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PatientReview, { type PatientReviewData } from "@/components/PatientReview";
import BeforeAfterCard from "@/components/BeforeAfterCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import v1 from "@/assets/video1.jpg";
import v2 from "@/assets/video2.jpg";
import v3 from "@/assets/video3.jpg";
import v4 from "@/assets/video4.jpg";
import v5 from "@/assets/video5.jpg";
import v6 from "@/assets/video6.jpg";

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
  {
    patient: "Hana S.", initial: "H", procedure: "Rhinoplasty",
    traveledFrom: { flag: "🇯🇵", place: "Tokyo" }, treatedIn: { flag: "🇰🇷", place: "Seoul" },
    date: "Feb 2025", verified: true,
    ratings: { overall: 5, recovery: 5, communication: 4.5 },
    text: "Compared 4 clinics in Gangnam. Final pick had the most natural portfolio. 3 months post-op, my parents only noticed I 'looked rested.' That's the result I wanted.",
    media: [{ type: "photo", src: v2 }, { type: "photo", src: v4 }],
  },
  {
    patient: "Sofia G.", initial: "S", procedure: "Facelift",
    traveledFrom: { flag: "🇪🇸", place: "Madrid" }, treatedIn: { flag: "🇫🇷", place: "Paris" },
    date: "Nov 2024", verified: true,
    ratings: { overall: 5, recovery: 4, communication: 5 },
    text: "At 52, I wanted refreshed not redone. The surgeon understood immediately. Aftercare in a Marais boutique recovery hotel — felt like a spa, not a hospital.",
  },
  {
    patient: "Aisha M.", initial: "A", procedure: "Eyelid Revision",
    traveledFrom: { flag: "🇦🇪", place: "Dubai" }, treatedIn: { flag: "🇰🇷", place: "Seoul" },
    date: "Jan 2025", verified: true,
    ratings: { overall: 4.5, recovery: 4.5, communication: 5 },
    text: "Revision after a botched surgery in another country. They were honest about what was fixable. Result is symmetric and finally feels like mine.",
    media: [{ type: "photo", src: v1 }],
  },
];

const beforeAfter = [
  { before: v1, after: v4, doctor: "Park Min-jun", city: "Yuna K. · Singapore → Seoul", procedure: "Double Eyelid", defaultBlur: true },
  { before: v3, after: v2, doctor: "Elif Demir", city: "Camille R. · Paris → Istanbul", procedure: "Rhinoplasty", defaultBlur: true },
  { before: v5, after: v6, doctor: "Suchada Pong", city: "Mei L. · Shanghai → Bangkok", procedure: "V-Line Surgery", defaultBlur: false },
  { before: v2, after: v4, doctor: "Aoba Tanaka", city: "Hana S. · Tokyo → Seoul", procedure: "Rhinoplasty", defaultBlur: true },
  { before: v6, after: v3, doctor: "Lumière Dubois", city: "Sofia G. · Madrid → Paris", procedure: "Facelift", defaultBlur: true },
  { before: v4, after: v1, doctor: "Park Min-jun", city: "Aisha M. · Dubai → Seoul", procedure: "Eyelid Revision", defaultBlur: false },
];

const procedureFilters = ["All", "Rhinoplasty", "Double Eyelid", "V-Line Surgery", "Facelift", "Eyelid Revision"];

const Reviews = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesProc = filter === "All" || r.procedure.toLowerCase().includes(filter.toLowerCase());
      const q = query.trim().toLowerCase();
      const matchesQ = !q || [r.patient, r.procedure, r.text, r.treatedIn.place, r.traveledFrom.place]
        .some((s) => s.toLowerCase().includes(q));
      return matchesProc && matchesQ;
    });
  }, [query, filter]);

  const filteredBA = useMemo(() => {
    return beforeAfter.filter((b) => {
      const matchesProc = filter === "All" || b.procedure.toLowerCase().includes(filter.toLowerCase());
      const q = query.trim().toLowerCase();
      const matchesQ = !q || [b.doctor, b.city, b.procedure].some((s) => s.toLowerCase().includes(q));
      return matchesProc && matchesQ;
    });
  }, [query, filter]);

  const avg = (
    reviews.reduce((acc, r) => acc + r.ratings.overall, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative border-b border-border/60">
        <div className="absolute inset-0 bg-gradient-hero opacity-60" />
        <div className="absolute -top-10 right-10 size-72 bg-gradient-mint blur-3xl opacity-50 animate-blob" />
        <div className="container relative py-16 md:py-24">
          <div className="max-w-3xl space-y-5">
            <span className="pill bg-card/80 backdrop-blur shadow-soft">
              <ShieldCheck className="size-3.5 text-primary" /> Verified procedure reviews
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-medium leading-[0.95] tracking-tight">
              Reviews from patients who <em className="text-primary not-italic">actually flew.</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Every review is tied to a real, verified procedure booked through Cosmetics Asia — with cross-border travel details, recovery scores, and before/after photos uploaded by patients themselves.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-3">
              <div className="flex items-center gap-2">
                <Star className="size-5 fill-primary text-primary" />
                <span className="font-display text-2xl font-semibold">{avg}</span>
                <span className="text-sm text-muted-foreground">avg overall</span>
              </div>
              <div className="h-6 w-px bg-border" />
              <div>
                <p className="font-display text-2xl font-semibold leading-none">12,400+</p>
                <p className="text-xs text-muted-foreground mt-1">verified reviews</p>
              </div>
              <div className="h-6 w-px bg-border" />
              <div>
                <p className="font-display text-2xl font-semibold leading-none">98%</p>
                <p className="text-xs text-muted-foreground mt-1">would book again</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH + FILTERS */}
      <section className="container py-10">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by patient, procedure, city..."
              className="pl-11 h-12 rounded-2xl bg-card border-border"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <Filter className="size-4 text-muted-foreground shrink-0" />
            {procedureFilters.map((p) => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`pill whitespace-nowrap transition-colors ${
                  filter === p ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TABS */}
      <section className="container pb-24">
        <Tabs defaultValue="written" className="w-full">
          <TabsList className="h-auto p-1 rounded-full bg-muted mb-8">
            <TabsTrigger value="written" className="rounded-full px-5 py-2 data-[state=active]:bg-background">
              <Star className="size-3.5 mr-1.5" /> Written Reviews
              <span className="ml-2 text-xs text-muted-foreground">{filteredReviews.length}</span>
            </TabsTrigger>
            <TabsTrigger value="beforeafter" className="rounded-full px-5 py-2 data-[state=active]:bg-background">
              <Sparkles className="size-3.5 mr-1.5" /> Before / After
              <span className="ml-2 text-xs text-muted-foreground">{filteredBA.length}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="written" className="mt-0">
            {filteredReviews.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredReviews.map((r) => <PatientReview key={r.patient} r={r} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="beforeafter" className="mt-0">
            {filteredBA.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBA.map((b, i) => (
                  <BeforeAfterCard key={i} {...b} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <Button variant="outline" className="rounded-full px-8">Load more reviews</Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const EmptyState = () => (
  <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
    <p className="font-display text-xl font-semibold">No reviews match your filters</p>
    <p className="text-sm text-muted-foreground mt-2">Try clearing the search or selecting a different procedure.</p>
  </div>
);

export default Reviews;

import { useEffect, useState } from "react";

export type SmartSearchFilters = {
  query: string;
  procedure: string | null;
  place: string | null;
  price: [number, number];
  minRating: number;
  beforeAfter: boolean;
};

export type SmartSearchProps = {
  initialProcedure?: string | null;
  initialPlace?: string | null;
  onFiltersChange?: (f: SmartSearchFilters) => void;
};
import { Search, Filter, Star, ToggleLeft, ToggleRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const PLACEHOLDER_EXAMPLES = [
  "rhinoplasty in Seoul under $5,000",
  "hair transplant in Istanbul 4.5+ rating",
  "breast augmentation with before/after videos",
];

const useTypewriter = (phrases: string[], typeSpeed = 55, pause = 1800) => {
  const [text, setText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    let timeout: number;
    if (!deleting && text === current) {
      timeout = window.setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === "") {
      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % phrases.length);
    } else {
      timeout = window.setTimeout(() => {
        setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
      }, deleting ? typeSpeed / 2 : typeSpeed);
    }
    return () => window.clearTimeout(timeout);
  }, [text, deleting, phraseIdx, phrases, typeSpeed, pause]);

  return text;
};

const procedures = [
  "Rhinoplasty", "Double Eyelid", "Facelift", "Hair Transplant",
  "V-Line Surgery", "Breast Aug", "Liposuction", "Brow Lift",
];
const places = ["Seoul", "Bangkok", "Istanbul", "Tokyo", "Paris", "Mexico City", "Dubai", "Los Angeles"];

const SmartSearch = ({ initialProcedure = null, initialPlace = null, onFiltersChange }: SmartSearchProps = {}) => {
  const [query, setQuery] = useState("");
  const [procedure, setProcedure] = useState<string | null>(initialProcedure);
  const [place, setPlace] = useState<string | null>(initialPlace);
  const [price, setPrice] = useState<number[]>([1500, 9000]);
  const [minRating, setMinRating] = useState(4.5);
  const [beforeAfter, setBeforeAfter] = useState(true);
  const [open, setOpen] = useState(true);

  useEffect(() => { setProcedure(initialProcedure); }, [initialProcedure]);
  useEffect(() => { setPlace(initialPlace); }, [initialPlace]);
  useEffect(() => {
    onFiltersChange?.({
      query, procedure, place,
      price: [price[0], price[1]],
      minRating, beforeAfter,
    });
  }, [query, procedure, place, price, minRating, beforeAfter, onFiltersChange]);

  const activeFilters = [
    procedure && { label: procedure, clear: () => setProcedure(null) },
    place && { label: place, clear: () => setPlace(null) },
    `$${price[0].toLocaleString()}–$${price[1].toLocaleString()}`,
    `${minRating.toFixed(1)}★+`,
    beforeAfter && "Before/After only",
  ].filter(Boolean);

  const animatedPlaceholder = useTypewriter(PLACEHOLDER_EXAMPLES);

  return (
    <div className="rounded-[2rem] bg-card shadow-pop overflow-hidden">
      {/* Bar */}
      <div className="flex items-center gap-2 p-2">
        <div className="flex-1 flex items-center gap-3 px-4">
          <Search className="size-4 text-foreground/70 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={query ? "" : `Try "${animatedPlaceholder}|"`}
            className="w-full bg-transparent py-3 text-base font-medium outline-none placeholder:text-foreground/60 sm:text-sm"
          />
        </div>
        <Button
          variant="ghost"
          onClick={() => setOpen((o) => !o)}
          className="rounded-2xl gap-2"
          aria-expanded={open}
        >
          <Filter className="size-4" /> Filters
          <span className="pill bg-primary-soft text-foreground" style={{ background: "hsl(var(--primary-soft))" }}>
            {activeFilters.length}
          </span>
        </Button>
        <Button size="lg" className="rounded-2xl bg-foreground text-background hover:bg-foreground/90 px-6">
          Search
        </Button>
      </div>

      {/* Active chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-3 border-t border-border pt-3">
          {activeFilters.map((f, i) =>
            typeof f === "string" ? (
              <span key={i} className="pill bg-muted text-foreground">{f}</span>
            ) : (
              <button
                key={i}
                onClick={(f as { clear: () => void }).clear}
                className="pill bg-muted text-foreground hover:bg-accent transition-colors"
              >
                {(f as { label: string }).label} <X className="size-3" />
              </button>
            )
          )}
        </div>
      )}

      {/* Filter panel */}
      {open && (
        <div className="border-t border-border bg-muted/30 p-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Procedure */}
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Procedure</p>
            <div className="flex flex-wrap gap-1.5">
              {procedures.map((p) => (
                <button
                  key={p}
                  onClick={() => setProcedure(procedure === p ? null : p)}
                  className={`pill transition-colors ${procedure === p ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Country/City */}
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Country / City</p>
            <div className="flex flex-wrap gap-1.5">
              {places.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlace(place === p ? null : p)}
                  className={`pill transition-colors ${place === p ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Price (USD)</p>
              <p className="text-xs font-semibold">${price[0].toLocaleString()} – ${price[1].toLocaleString()}</p>
            </div>
            <Slider
              value={price}
              onValueChange={setPrice}
              min={500}
              max={15000}
              step={100}
              minStepsBetweenThumbs={1}
              className="mt-4"
            />
          </div>

          {/* Rating + B/A toggle */}
          <div className="space-y-4">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Min expert rating</p>
                <p className="text-xs font-semibold flex items-center gap-1">
                  <Star className="size-3 fill-primary text-primary" /> {minRating.toFixed(1)}+
                </p>
              </div>
              <Slider value={[minRating]} onValueChange={(v) => setMinRating(v[0])} min={3} max={5} step={0.1} className="mt-4" />
            </div>
            <button
              onClick={() => setBeforeAfter((b) => !b)}
              className="flex items-center gap-2 text-sm font-medium w-full justify-between rounded-xl bg-card px-3 py-2 hover:bg-accent transition-colors"
            >
              <span>Before/After video available</span>
              {beforeAfter ? (
                <ToggleRight className="size-6 text-primary" />
              ) : (
                <ToggleLeft className="size-6 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;

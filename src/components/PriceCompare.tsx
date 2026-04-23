import { useMemo, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

type ProcedureKey = "Rhinoplasty" | "Double Eyelid" | "Facelift" | "Hair Transplant" | "Breast Aug" | "Liposuction";

const dataset: Record<ProcedureKey, { country: string; flag: string; min: number; max: number }[]> = {
  "Rhinoplasty": [
    { country: "Turkey", flag: "🇹🇷", min: 2400, max: 3800 },
    { country: "Thailand", flag: "🇹🇭", min: 2600, max: 4200 },
    { country: "Mexico", flag: "🇲🇽", min: 3200, max: 5000 },
    { country: "Korea", flag: "🇰🇷", min: 3800, max: 6800 },
    { country: "France", flag: "🇫🇷", min: 5800, max: 8400 },
    { country: "USA", flag: "🇺🇸", min: 8000, max: 15000 },
  ],
  "Double Eyelid": [
    { country: "Thailand", flag: "🇹🇭", min: 900, max: 1600 },
    { country: "Korea", flag: "🇰🇷", min: 1500, max: 2800 },
    { country: "Turkey", flag: "🇹🇷", min: 1700, max: 2600 },
    { country: "Japan", flag: "🇯🇵", min: 2100, max: 3400 },
    { country: "France", flag: "🇫🇷", min: 3200, max: 4800 },
    { country: "USA", flag: "🇺🇸", min: 4000, max: 7500 },
  ],
  "Facelift": [
    { country: "Turkey", flag: "🇹🇷", min: 4200, max: 6800 },
    { country: "Thailand", flag: "🇹🇭", min: 4800, max: 7200 },
    { country: "Mexico", flag: "🇲🇽", min: 5200, max: 7800 },
    { country: "Korea", flag: "🇰🇷", min: 7800, max: 12000 },
    { country: "France", flag: "🇫🇷", min: 8400, max: 14000 },
    { country: "USA", flag: "🇺🇸", min: 12000, max: 25000 },
  ],
  "Hair Transplant": [
    { country: "Turkey", flag: "🇹🇷", min: 1800, max: 3200 },
    { country: "Mexico", flag: "🇲🇽", min: 2400, max: 4400 },
    { country: "Thailand", flag: "🇹🇭", min: 2800, max: 4600 },
    { country: "Korea", flag: "🇰🇷", min: 3400, max: 6800 },
    { country: "France", flag: "🇫🇷", min: 5200, max: 9000 },
    { country: "USA", flag: "🇺🇸", min: 6000, max: 16000 },
  ],
  "Breast Aug": [
    { country: "Thailand", flag: "🇹🇭", min: 3200, max: 4800 },
    { country: "Mexico", flag: "🇲🇽", min: 3800, max: 5400 },
    { country: "Turkey", flag: "🇹🇷", min: 4000, max: 5800 },
    { country: "Korea", flag: "🇰🇷", min: 5200, max: 7800 },
    { country: "France", flag: "🇫🇷", min: 6400, max: 9400 },
    { country: "USA", flag: "🇺🇸", min: 8400, max: 14000 },
  ],
  "Liposuction": [
    { country: "Thailand", flag: "🇹🇭", min: 2400, max: 3800 },
    { country: "Turkey", flag: "🇹🇷", min: 2800, max: 4200 },
    { country: "Mexico", flag: "🇲🇽", min: 3000, max: 4400 },
    { country: "Korea", flag: "🇰🇷", min: 3600, max: 6200 },
    { country: "France", flag: "🇫🇷", min: 4800, max: 8400 },
    { country: "USA", flag: "🇺🇸", min: 6000, max: 12000 },
  ],
};

const PriceCompare = () => {
  const procedures = Object.keys(dataset) as ProcedureKey[];
  const [proc, setProc] = useState<ProcedureKey>("Rhinoplasty");
  const rows = dataset[proc];

  const { globalMax, cheapest, priciest } = useMemo(() => {
    const sorted = [...rows].sort((a, b) => a.min - b.min);
    return {
      globalMax: Math.max(...rows.map((r) => r.max)),
      cheapest: sorted[0],
      priciest: sorted[sorted.length - 1],
    };
  }, [rows]);

  const savings = Math.round((1 - cheapest.min / priciest.max) * 100);

  return (
    <div className="rounded-[2.5rem] bg-card shadow-pop p-7 md:p-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <span className="pill bg-secondary text-secondary-foreground mb-2">Cost compare</span>
          <h3 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
            <em className="text-primary not-italic">{proc}</em> cost · country by country
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Save up to <span className="font-semibold text-foreground">{savings}%</span> traveling from {priciest.country} to {cheapest.country}.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 max-w-md">
          {procedures.map((p) => (
            <button
              key={p}
              onClick={() => setProc(p)}
              className={`pill transition-colors ${proc === p ? "bg-foreground text-background" : "bg-muted hover:bg-accent"}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((r) => {
          const left = (r.min / globalMax) * 100;
          const width = ((r.max - r.min) / globalMax) * 100;
          const isCheap = r.country === cheapest.country;
          const isPricey = r.country === priciest.country;
          return (
            <div key={r.country} className="grid grid-cols-[120px_1fr_140px] items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">{r.flag}</span>
                <span className="text-sm font-semibold">{r.country}</span>
              </div>
              <div className="relative h-7 rounded-full bg-muted overflow-hidden">
                <div
                  className={`absolute top-0 bottom-0 rounded-full transition-all ${
                    isCheap ? "bg-primary" : isPricey ? "bg-secondary" : "bg-gradient-mint"
                  }`}
                  style={{ left: `${left}%`, width: `${Math.max(width, 4)}%` }}
                />
              </div>
              <div className="flex items-center justify-end gap-1.5 text-sm font-semibold">
                ${r.min.toLocaleString()}–${r.max.toLocaleString()}
                {isCheap && <TrendingDown className="size-3.5 text-primary" />}
                {isPricey && <TrendingUp className="size-3.5 text-destructive" />}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        Avg surgeon fees from verified Glowy clinics (2024–25). Excludes flights, accommodation, aftercare.
      </p>
    </div>
  );
};

export default PriceCompare;

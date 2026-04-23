import { useMemo } from "react";
import { Globe2, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import PriceTrustBadge from "./PriceTrustBadge";

export interface CountryPrice {
  country: "USA" | "UK" | "Korea" | "Thailand" | "Turkey" | string;
  flag: string;
  low: number;
  high: number;
}

interface GlobalPriceCompareProps {
  procedure: string;
  prices: CountryPrice[];
  /** Country name to highlight (e.g. "Korea") */
  featured: string;
}

const GlobalPriceCompare = ({ procedure, prices, featured }: GlobalPriceCompareProps) => {
  const { formatPrice } = useI18n();

  const { maxHigh, savings, mostExpensive, featuredPrice } = useMemo(() => {
    const max = Math.max(...prices.map((p) => p.high));
    const sortedByMid = [...prices].sort(
      (a, b) => (b.low + b.high) / 2 - (a.low + a.high) / 2,
    );
    const mostExp = sortedByMid[0];
    const feat = prices.find((p) => p.country === featured) ?? prices[0];
    const featMid = (feat.low + feat.high) / 2;
    const expMid = (mostExp.low + mostExp.high) / 2;
    return {
      maxHigh: max,
      mostExpensive: mostExp,
      featuredPrice: feat,
      savings: Math.max(0, Math.round(expMid - featMid)),
    };
  }, [prices, featured]);

  return (
    <div className="rounded-[2rem] border border-border bg-card p-6 md:p-9 shadow-soft">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
        <div>
          <span className="pill bg-secondary text-secondary-foreground mb-2">
            <Globe2 className="size-3.5" /> Global pricing
          </span>
          <h3 className="font-display text-2xl md:text-4xl font-medium tracking-tight">
            How does this compare <em className="text-primary not-italic">globally?</em>
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Average {procedure.toLowerCase()} cost across 5 leading destinations.
          </p>
        </div>
        <PriceTrustBadge />
      </div>

      <div className="space-y-3">
        {prices.map((p) => {
          const isFeatured = p.country === featured;
          const widthPct = (p.high / maxHigh) * 100;
          return (
            <div key={p.country} className="grid grid-cols-12 items-center gap-3">
              <div className="col-span-12 md:col-span-3 flex items-center gap-2">
                <span className="text-lg">{p.flag}</span>
                <span className={`text-sm ${isFeatured ? "font-semibold" : ""}`}>{p.country}</span>
                {isFeatured && (
                  <span className="pill bg-primary-soft text-[10px] py-0 px-1.5" style={{ background: "hsl(var(--primary-soft))" }}>
                    Featured
                  </span>
                )}
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="h-8 bg-muted rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isFeatured ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-3 text-right">
                <span className={`font-display font-semibold text-sm ${isFeatured ? "text-primary" : ""}`}>
                  {formatPrice(p.low)} – {formatPrice(p.high)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-5 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-2">
        <p className="text-sm flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          Patients save an average of{" "}
          <span className="font-semibold text-foreground">{formatPrice(savings)}</span>{" "}
          by traveling to <span className="font-semibold">{featuredPrice.flag} {featuredPrice.country}</span>
          {" "}vs {mostExpensive.flag} {mostExpensive.country}.
        </p>
        <p className="text-[11px] text-muted-foreground italic">Based on Glowy platform data</p>
      </div>
    </div>
  );
};

export default GlobalPriceCompare;

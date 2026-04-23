import { ArrowRight, Info } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useQuote } from "./QuoteRequest";
import PriceTrustBadge from "./PriceTrustBadge";

export interface PricingRow {
  procedure: string;
  low: number;
  high: number;
  includes: string;
}

interface TypicalPricingProps {
  rows: PricingRow[];
  doctorName?: string;
  city?: string;
}

const TypicalPricing = ({ rows, doctorName, city }: TypicalPricingProps) => {
  const { formatPrice } = useI18n();
  const { open } = useQuote();

  return (
    <section className="rounded-[2rem] border border-border bg-card overflow-hidden shadow-soft">
      <header className="p-6 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Transparent pricing
          </p>
          <h3 className="font-display text-2xl md:text-3xl font-semibold mt-1">Typical Pricing</h3>
        </div>
        <PriceTrustBadge />
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-semibold px-5 py-3">Procedure</th>
              <th className="text-left font-semibold px-5 py-3">Price Range</th>
              <th className="text-left font-semibold px-5 py-3">Includes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.procedure}
                className={i !== rows.length - 1 ? "border-b border-border" : ""}
              >
                <td className="px-5 py-4 font-display font-semibold">{r.procedure}</td>
                <td className="px-5 py-4">
                  <span className="font-semibold text-foreground">
                    {formatPrice(r.low)} – {formatPrice(r.high)}
                  </span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{r.includes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-muted/30 border-t border-border">
        <p className="text-xs text-muted-foreground flex items-start gap-1.5 max-w-md">
          <Info className="size-3.5 mt-0.5 shrink-0 text-muted-foreground" />
          Prices are estimates. Final quote provided after consultation.
        </p>
        <button
          onClick={() => open({ doctorName, city })}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
        >
          Get exact pricing <ArrowRight className="size-3.5" />
        </button>
      </footer>
    </section>
  );
};

export default TypicalPricing;

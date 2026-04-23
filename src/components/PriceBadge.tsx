import { Tag } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface PriceBadgeProps {
  /** Lower bound in USD. If only `from` is provided, renders "From $X". */
  from: number;
  /** Optional upper bound in USD for a range. */
  to?: number;
  size?: "sm" | "md";
  tone?: "teal" | "gray";
  className?: string;
}

const PriceBadge = ({ from, to, size = "sm", tone = "teal", className = "" }: PriceBadgeProps) => {
  const { formatPrice } = useI18n();
  const tones =
    tone === "teal"
      ? "bg-primary-soft text-foreground"
      : "bg-muted text-foreground";
  const sizes = size === "md" ? "text-sm px-3 py-1" : "text-[11px] px-2.5 py-0.5";
  const label = to ? `${formatPrice(from)} – ${formatPrice(to)}` : `From ${formatPrice(from)}`;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${tones} ${sizes} ${className}`}
      style={tone === "teal" ? { background: "hsl(var(--primary-soft))" } : undefined}
    >
      <Tag className="size-3 text-primary" />
      {label}
    </span>
  );
};

export default PriceBadge;

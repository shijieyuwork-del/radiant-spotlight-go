import { ShieldCheck } from "lucide-react";

interface PriceTrustBadgeProps {
  className?: string;
  variant?: "default" | "subtle";
}

const PriceTrustBadge = ({ className = "", variant = "default" }: PriceTrustBadgeProps) => {
  const base =
    variant === "subtle"
      ? "bg-muted text-muted-foreground"
      : "bg-accent text-accent-foreground";
  return (
    <span
      className={`pill ${base} text-[11px] ${className}`}
      title="Pricing verified by Cosmetics Asia and refreshed monthly from clinic submissions."
    >
      <ShieldCheck className="size-3 text-primary" />
      Verified pricing · Updated monthly
    </span>
  );
};

export default PriceTrustBadge;

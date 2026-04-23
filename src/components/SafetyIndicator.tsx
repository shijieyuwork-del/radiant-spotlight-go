import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export type SafetyLevel = "green" | "amber" | "red";

interface SafetyIndicatorProps {
  level: SafetyLevel;
  score?: number; // 0–100 verification completeness
  compact?: boolean;
}

const config: Record<SafetyLevel, { label: string; tone: string; dot: string; Icon: typeof ShieldCheck }> = {
  green: {
    label: "Fully verified",
    tone: "bg-[hsl(155,55%,92%)] text-[hsl(155,55%,22%)] border-[hsl(155,45%,75%)]",
    dot: "bg-[hsl(155,60%,40%)]",
    Icon: ShieldCheck,
  },
  amber: {
    label: "Partially verified",
    tone: "bg-[hsl(40,90%,92%)] text-[hsl(30,70%,28%)] border-[hsl(38,80%,75%)]",
    dot: "bg-[hsl(36,90%,50%)]",
    Icon: Shield,
  },
  red: {
    label: "Unverified",
    tone: "bg-[hsl(0,75%,94%)] text-[hsl(0,65%,32%)] border-[hsl(0,70%,80%)]",
    dot: "bg-[hsl(0,70%,50%)]",
    Icon: ShieldAlert,
  },
};

const SafetyIndicator = ({ level, score, compact = false }: SafetyIndicatorProps) => {
  const c = config[level];
  if (compact) {
    return (
      <span className={cn("pill border", c.tone)}>
        <span className={cn("size-1.5 rounded-full", c.dot)} />
        <c.Icon className="size-3" />
        {c.label}
      </span>
    );
  }
  return (
    <div className={cn("rounded-2xl border p-3 flex items-center gap-3", c.tone)}>
      <c.Icon className="size-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider">Safety status</p>
        <p className="text-sm font-display font-semibold leading-tight">{c.label}</p>
      </div>
      {typeof score === "number" && (
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider opacity-70">Score</p>
          <p className="font-display text-base font-semibold">{score}<span className="text-xs opacity-70">/100</span></p>
        </div>
      )}
    </div>
  );
};

export default SafetyIndicator;

import { ShieldCheck, Award, Scissors } from "lucide-react";

interface VerifiedDoctorBadgeProps {
  flag: string;
  country: string;
  license: string;
  years: number;
  procedures: string;
  compact?: boolean;
}

const VerifiedDoctorBadge = ({
  flag,
  country,
  license,
  years,
  procedures,
  compact = false,
}: VerifiedDoctorBadgeProps) => {
  if (compact) {
    return (
      <span className="pill bg-card/90 backdrop-blur shadow-soft text-foreground">
        <span className="text-base leading-none">{flag}</span>
        <ShieldCheck className="size-3.5 text-primary" />
        {license}
      </span>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl leading-none">{flag}</span>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {country}
        </span>
        <span className="ml-auto pill bg-primary-soft text-foreground" style={{ background: "hsl(var(--primary-soft))" }}>
          <ShieldCheck className="size-3 text-primary" /> Verified
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">License</p>
          <p className="font-display text-sm font-semibold mt-0.5 truncate">{license}</p>
        </div>
        <div className="border-x border-border">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center justify-center gap-1">
            <Award className="size-2.5" /> Years
          </p>
          <p className="font-display text-sm font-semibold mt-0.5">{years}+</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center justify-center gap-1">
            <Scissors className="size-2.5" /> Cases
          </p>
          <p className="font-display text-sm font-semibold mt-0.5">{procedures}</p>
        </div>
      </div>
    </div>
  );
};

export default VerifiedDoctorBadge;

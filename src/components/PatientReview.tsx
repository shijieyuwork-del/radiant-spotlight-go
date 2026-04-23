import { Star, ShieldCheck, MapPin, MessageCircle, HeartPulse, Camera, Video } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PatientReviewData {
  patient: string;
  initial: string;
  procedure: string;
  traveledFrom: { flag: string; place: string };
  treatedIn: { flag: string; place: string };
  date: string;
  ratings: { overall: number; recovery: number; communication: number };
  text: string;
  media?: { type: "photo" | "video"; src: string }[];
  verified?: boolean;
}

const Stars = ({ value }: { value: number }) => (
  <span className="inline-flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={cn("size-3.5", i < Math.round(value) ? "fill-primary text-primary" : "text-muted-foreground/40")} />
    ))}
  </span>
);

const RatingRow = ({ label, value, Icon }: { label: string; value: number; Icon: typeof Star }) => (
  <div className="flex items-center justify-between gap-3 text-xs">
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <Icon className="size-3" /> {label}
    </span>
    <span className="flex items-center gap-1.5">
      <Stars value={value} />
      <span className="font-semibold tabular-nums">{value.toFixed(1)}</span>
    </span>
  </div>
);

const PatientReview = ({ r }: { r: PatientReviewData }) => {
  return (
    <article className="rounded-3xl border border-border bg-card p-6 flex flex-col">
      <header className="flex items-start gap-3">
        <div className="size-11 rounded-2xl bg-gradient-peach grid place-items-center font-display text-lg font-semibold shrink-0">
          {r.initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-display font-semibold leading-tight">{r.patient}</p>
            {r.verified && (
              <span className="pill bg-[hsl(155,55%,92%)] text-[hsl(155,55%,22%)] border border-[hsl(155,45%,75%)]">
                <ShieldCheck className="size-3" /> Verified procedure
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 flex-wrap">
            <MapPin className="size-3" />
            <span>{r.traveledFrom.flag} {r.traveledFrom.place}</span>
            <span className="opacity-50">→</span>
            <span>{r.treatedIn.flag} {r.treatedIn.place}</span>
            <span className="opacity-50">·</span>
            <span>{r.date}</span>
          </p>
        </div>
      </header>

      <span className="pill bg-muted self-start mt-4">{r.procedure}</span>

      <p className="text-sm text-foreground/85 leading-relaxed mt-3 flex-1">"{r.text}"</p>

      {r.media && r.media.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {r.media.map((m, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
              <img src={m.src} alt="patient upload" className="size-full object-cover" loading="lazy" />
              <span className="absolute bottom-1.5 left-1.5 pill bg-background/90 backdrop-blur text-[10px] py-0.5 px-1.5">
                {m.type === "video" ? <Video className="size-2.5" /> : <Camera className="size-2.5" />}
                {m.type}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-border space-y-2">
        <RatingRow label="Overall" value={r.ratings.overall} Icon={Star} />
        <RatingRow label="Recovery experience" value={r.ratings.recovery} Icon={HeartPulse} />
        <RatingRow label="Communication" value={r.ratings.communication} Icon={MessageCircle} />
      </div>
    </article>
  );
};

export default PatientReview;

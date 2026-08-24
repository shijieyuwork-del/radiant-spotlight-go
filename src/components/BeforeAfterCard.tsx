import { useRef, useState } from "react";
import { ShieldCheck, MapPin, EyeOff, Eye, Sparkles } from "lucide-react";

interface BeforeAfterCardProps {
  before: string;
  after: string;
  doctor: string;
  city: string;
  procedure: string;
  defaultBlur?: boolean;
}

const BeforeAfterCard = ({
  before,
  after,
  doctor,
  city,
  procedure,
  defaultBlur = true,
}: BeforeAfterCardProps) => {
  const [pos, setPos] = useState(50);
  const [blur, setBlur] = useState(defaultBlur);
  const ref = useRef<HTMLDivElement>(null);

  const move = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const next = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
    setPos(next);
  };

  return (
    <div className="rounded-[2rem] overflow-hidden glow-card bg-card">
      {/* Swipe reveal area */}
      <div
        ref={ref}
        className="relative aspect-[4/5] select-none cursor-ew-resize touch-none"
        onMouseMove={(e) => e.buttons === 1 && move(e.clientX)}
        onMouseDown={(e) => move(e.clientX)}
        onTouchMove={(e) => move(e.touches[0].clientX)}
      >
        {/* After (full) */}
        <img src={after} alt={`${procedure} after`} className={`absolute inset-0 size-full object-cover ${blur ? "blur-[14px] scale-110" : ""}`} />
        {/* Before (clipped) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <img
            src={before}
            alt={`${procedure} before`}
            className={`absolute inset-0 h-full w-[100vw] max-w-none object-cover ${blur ? "blur-[14px] scale-110" : ""}`}
            style={{ width: ref.current?.offsetWidth ?? "100%" }}
          />
        </div>

        {/* Labels */}
        <span className="absolute top-3 left-3 pill bg-background/90 backdrop-blur shadow-soft text-foreground">Before</span>
        <span className="absolute top-3 right-3 pill bg-foreground/90 backdrop-blur text-background">After</span>

        {/* Verified badge */}
        <span className="absolute bottom-3 left-3 pill bg-primary text-primary-foreground shadow-pop">
          <ShieldCheck className="size-3.5" /> Verified Patient
        </span>

        {/* Privacy toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); setBlur((b) => !b); }}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          className="absolute bottom-3 right-3 pill bg-background/90 backdrop-blur text-foreground hover:bg-background transition-colors"
          aria-pressed={blur}
        >
          {blur ? <><EyeOff className="size-3.5" /> Privacy on</> : <><Eye className="size-3.5" /> Privacy off</>}
        </button>

        {/* Slider handle */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-background shadow-pop pointer-events-none" style={{ left: `${pos}%` }}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-10 rounded-full bg-background shadow-pop grid place-items-center">
            <span className="font-display text-xs font-semibold">↔</span>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="p-5 space-y-2">
        <span className="pill bg-primary-soft text-foreground" style={{ background: "hsl(var(--primary-soft))" }}>
          <Sparkles className="size-3 text-primary" /> {procedure}
        </span>
        <h4 className="font-display text-lg font-semibold leading-tight">{doctor}</h4>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="size-3" /> {city}
        </p>
      </div>
    </div>
  );
};

export default BeforeAfterCard;

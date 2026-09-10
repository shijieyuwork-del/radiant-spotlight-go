import { useRef, useState } from "react";
import { ShieldCheck, MapPin, EyeOff, Eye, Sparkles } from "lucide-react";
import { useAsia } from "@/lib/asia-i18n";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

interface BeforeAfterCardProps {
  before: string;
  after: string;
  doctor: string;
  city: string;
  procedure: string;
  defaultBlur?: boolean;
  /** 单张拼好的对比图：不显示滑块，直接整图展示 */
  single?: boolean;
}

const BeforeAfterCard = ({
  before,
  after,
  doctor,
  city,
  procedure,
  defaultBlur = true,
  single = false,
}: BeforeAfterCardProps) => {
  const { t } = useAsia();
  const [pos, setPos] = useState(50);
  const [blur, setBlur] = useState(defaultBlur);
  const [lightboxOpen, setLightboxOpen] = useState(false);
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
      {single ? (
        <div className="relative aspect-[4/5] cursor-zoom-in select-none" onClick={() => setLightboxOpen(true)}>
          <img src={before} alt={`${procedure} before and after`} className={`absolute inset-0 size-full object-cover ${blur ? "blur-[14px] scale-110" : ""}`} />
          <span className="absolute top-3 left-3 pill bg-background/90 backdrop-blur shadow-soft text-foreground">Before · After</span>
          <span className="absolute bottom-3 left-3 pill bg-primary text-primary-foreground shadow-pop">
            <ShieldCheck className="size-3.5" /> Verified Patient
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); setBlur((b) => !b); }}
            className="absolute bottom-3 right-3 pill bg-background/90 backdrop-blur text-foreground hover:bg-background transition-colors"
            aria-pressed={blur}
          >
            {blur ? <><EyeOff className="size-3.5" /> Privacy on</> : <><Eye className="size-3.5" /> Privacy off</>}
          </button>
        </div>
      ) : (
      <div
        ref={ref}
        className="relative aspect-[4/5] select-none cursor-ew-resize touch-none"
        onMouseMove={(e) => e.buttons === 1 && move(e.clientX)}
        onMouseDown={(e) => move(e.clientX)}
        onTouchMove={(e) => move(e.touches[0].clientX)}
      >
        {/* After (full) */}
        <img src={after} alt={`${procedure} after`} className={`absolute inset-0 size-full object-cover ${blur ? "blur-[14px] scale-110" : ""}`} />
        {/* Before (clipped via clip-path so both images stay full-size) */}
        <img
          src={before}
          alt={`${procedure} before`}
          className={`absolute inset-0 size-full object-cover ${blur ? "blur-[14px] scale-110" : ""}`}
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />

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
      )}

      {/* Meta */}
      <div className="p-5 space-y-2">
        <span className="pill bg-primary-soft text-foreground" style={{ background: "hsl(var(--primary-soft))" }}>
          <Sparkles className="size-3 text-primary" /> {procedure}
        </span>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("ba.expert")}</p>
          <h4 className="font-display text-lg font-semibold leading-tight">{doctor}</h4>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="size-3" /> {city}
        </p>
      </div>
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-5xl overflow-hidden border-white/15 bg-[#102f28] p-0 text-white sm:rounded-[2rem]">
          <DialogTitle className="sr-only">{procedure} before and after photo</DialogTitle>
          <DialogDescription className="sr-only">Enlarged verified patient before and after photo.</DialogDescription>
          <div className="relative h-[82vh] bg-black/20">
            <img src={before} alt={`${procedure} before and after, enlarged`} className={`size-full object-contain ${blur ? "blur-[18px] scale-105" : ""}`} />
            <span className="absolute left-4 top-4 pill bg-background/90 text-foreground shadow-soft">Before · After</span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BeforeAfterCard;

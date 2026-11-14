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
  /** Wider presentation for the multi-column gallery page. */
  layout?: "portrait" | "wide";
}

const BeforeAfterCard = ({
  before,
  after,
  doctor,
  city,
  procedure,
  defaultBlur = true,
  single = false,
  layout = "portrait",
}: BeforeAfterCardProps) => {
  const { t, lang } = useAsia();
  const labels: Record<string, [string, string, string, string, string, string]> = {
    en: ["Before", "After", "Case photo", "Image blurred", "Image visible", "Enlarged comparison photo"],
    zh: ["术前", "术后", "案例照片", "图片已模糊", "图片已显示", "放大的术前术后对比照片"],
    ru: ["До", "После", "Фото случая", "Изображение размыто", "Изображение видно", "Увеличенное фото до и после"],
    es: ["Antes", "Después", "Foto del caso", "Imagen difuminada", "Imagen visible", "Foto comparativa ampliada"],
    th: ["ก่อน", "หลัง", "ภาพกรณีตัวอย่าง", "ภาพถูกเบลอ", "แสดงภาพแล้ว", "ภาพเปรียบเทียบแบบขยาย"],
    ms: ["Sebelum", "Selepas", "Foto kes", "Imej dikaburkan", "Imej dipaparkan", "Foto perbandingan diperbesar"],
    vi: ["Trước", "Sau", "Ảnh trường hợp", "Ảnh đã làm mờ", "Ảnh đang hiển thị", "Ảnh so sánh phóng to"],
    ko: ["시술 전", "시술 후", "사례 사진", "사진 흐림 처리됨", "사진 표시됨", "확대된 전후 비교 사진"],
    ja: ["施術前", "施術後", "症例写真", "ぼかし表示", "写真を表示中", "拡大した施術前後の比較写真"],
    ar: ["قبل", "بعد", "صورة الحالة", "الصورة مموهة", "الصورة ظاهرة", "صورة مقارنة مكبرة"],
    "pt-BR": ["Antes", "Depois", "Foto do caso", "Imagem desfocada", "Imagem visível", "Foto comparativa ampliada"],
    id: ["Sebelum", "Sesudah", "Foto kasus", "Gambar diburamkan", "Gambar ditampilkan", "Foto perbandingan diperbesar"],
    fr: ["Avant", "Après", "Photo du cas", "Image floutée", "Image visible", "Photo comparative agrandie"],
    de: ["Vorher", "Nachher", "Fallfoto", "Bild unscharf", "Bild sichtbar", "Vergrößertes Vergleichsfoto"],
  };
  const [beforeLabel, afterLabel, caseLabel, blurredLabel, visibleLabel, enlargedLabel] = labels[lang] ?? labels.en;
  const comparisonLabel = beforeLabel + " · " + afterLabel;
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
        <div className={`relative cursor-zoom-in select-none ${layout === "wide" ? "aspect-[16/10]" : "aspect-[4/5]"}`} onClick={() => setLightboxOpen(true)}>
          <img src={before} alt={`${procedure} — ${comparisonLabel}`} className={`absolute inset-0 size-full object-cover ${blur ? "blur-[14px] scale-110" : ""}`} />
          <span className="absolute top-3 left-3 pill bg-background/90 backdrop-blur shadow-soft text-foreground">{comparisonLabel}</span>
          <span className="absolute bottom-3 left-3 pill bg-primary text-primary-foreground shadow-pop">
            <ShieldCheck className="size-3.5" /> {caseLabel}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); setBlur((b) => !b); }}
            className="absolute bottom-3 right-3 pill bg-background/90 backdrop-blur text-foreground hover:bg-background transition-colors"
            aria-pressed={blur}
          >
            {blur ? <><EyeOff className="size-3.5" /> {blurredLabel}</> : <><Eye className="size-3.5" /> {visibleLabel}</>}
          </button>
        </div>
      ) : (
      <div
        ref={ref}
        className={`relative select-none cursor-ew-resize touch-none ${layout === "wide" ? "aspect-[16/10]" : "aspect-[4/5]"}`}
        onMouseMove={(e) => e.buttons === 1 && move(e.clientX)}
        onMouseDown={(e) => move(e.clientX)}
        onTouchMove={(e) => move(e.touches[0].clientX)}
      >
        {/* After (full) */}
        <img src={after} alt={`${procedure} — ${afterLabel}`} className={`absolute inset-0 size-full object-cover ${blur ? "blur-[14px] scale-110" : ""}`} />
        {/* Before (clipped via clip-path so both images stay full-size) */}
        <img
          src={before}
          alt={`${procedure} — ${beforeLabel}`}
          className={`absolute inset-0 size-full object-cover ${blur ? "blur-[14px] scale-110" : ""}`}
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />

        {/* Labels */}
        <span className="absolute top-3 left-3 pill bg-background/90 backdrop-blur shadow-soft text-foreground">{beforeLabel}</span>
        <span className="absolute top-3 right-3 pill bg-foreground/90 backdrop-blur text-background">{afterLabel}</span>

        {/* Verified badge */}
        <span className="absolute bottom-3 left-3 pill bg-primary text-primary-foreground shadow-pop">
          <ShieldCheck className="size-3.5" /> {caseLabel}
        </span>

        {/* Privacy toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); setBlur((b) => !b); }}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          className="absolute bottom-3 right-3 pill bg-background/90 backdrop-blur text-foreground hover:bg-background transition-colors"
          aria-pressed={blur}
        >
          {blur ? <><EyeOff className="size-3.5" /> {blurredLabel}</> : <><Eye className="size-3.5" /> {visibleLabel}</>}
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
          <DialogTitle className="sr-only">{procedure} — {comparisonLabel}</DialogTitle>
          <DialogDescription className="sr-only">{enlargedLabel}</DialogDescription>
          <div className="relative h-[82vh] bg-black/20">
            <img src={before} alt={`${procedure} — ${enlargedLabel}`} className={`size-full object-contain ${blur ? "blur-[18px] scale-105" : ""}`} />
            <span className="absolute left-4 top-4 pill bg-background/90 text-foreground shadow-soft">{comparisonLabel}</span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BeforeAfterCard;

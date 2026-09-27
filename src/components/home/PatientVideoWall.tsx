import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Play } from "lucide-react";
import { TikTokCard, type TikTokItem } from "@/components/TikTokWall";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { DEFAULT_VIDEO_POSTER } from "@/lib/cover-fallback";
import type { AsiaLang } from "@/lib/asia-i18n";
import { videoControlsCopy } from "@/lib/video-controls-copy";
import "./patient-video-wall.css";

const copy: Record<AsiaLang, { wall: string; view: string }> = {
  en: { wall: "Patient video wall", view: "View case" },
  zh: { wall: "患者视频墙", view: "查看案例" },
  ru: { wall: "Видео восстановления пациентов", view: "Смотреть случай" },
  es: { wall: "Videos de recuperación de pacientes", view: "Ver caso" },
  th: { wall: "วิดีโอการฟื้นตัวของผู้ป่วย", view: "ดูกรณีนี้" },
  ms: { wall: "Video pemulihan pesakit", view: "Lihat kes" },
  vi: { wall: "Video hồi phục của bệnh nhân", view: "Xem ca này" },
  ko: { wall: "환자 회복 동영상", view: "사례 보기" },
  ja: { wall: "患者の回復動画", view: "事例を見る" },
};

type Props = { items: TikTokItem[]; lang: AsiaLang; fmtPrice: (amount: number) => string };

/** YouTube-style two-column library. Video is mounted only after a diary is selected. */
export default function PatientVideoWall({ items, lang, fmtPrice }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [selected, setSelected] = useState<TikTokItem | null>(null);
  const t = copy[lang];
  const controls = videoControlsCopy[lang];
  const text = (value: TikTokItem["caption"]) => value[lang] || value.en;

  if (!items.length) return null;

  return (
    <div ref={root} className="patient-video-wall">
      <div className="patient-video-wall__grid" role="region" aria-label={t.wall}>
        {items.map((item) => (
          <article key={item.id} className="patient-video-wall__item">
            <button
              type="button"
              className="patient-video-wall__card patient-video-wall__poster"
              data-case-id={item.id}
              aria-label={`${controls.play}: ${text(item.treatment)} — ${text(item.caption)}`}
              aria-haspopup="dialog"
              onClick={(event) => { opener.current = event.currentTarget; setSelected(item); }}
            >
              <img src={item.poster || DEFAULT_VIDEO_POSTER} alt="" loading="lazy" decoding="async" />
              <span className="patient-video-wall__shade" aria-hidden="true" />
              <span className="patient-video-wall__tag">{text(item.treatment)}</span>
              <span className="patient-video-wall__play" aria-hidden="true"><Play className="size-5 fill-current" /></span>
            </button>
            <div className="patient-video-wall__meta">
              <h3>{text(item.caption)}</h3>
              {item.city && <p><MapPin className="size-3.5" aria-hidden="true" />{text(item.city)} · {text(item.treatment)}</p>}
            </div>
          </article>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        {selected && (
          <DialogContent
            className="patient-video-wall__dialog"
            closeLabel={controls.close}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              opener.current?.focus({ preventScroll: true });
            }}
          >
            <DialogTitle className="sr-only">{text(selected.treatment)}</DialogTitle>
            <DialogDescription className="sr-only">{text(selected.caption)}</DialogDescription>
            <TikTokCard item={selected} lang={lang} fmtPrice={fmtPrice} focusPresentation autoPlayFocused eager />
            <Link to={`/cases/${selected.id}`} className="patient-video-wall__case-link">{t.view}<ArrowRight className="size-4" /></Link>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

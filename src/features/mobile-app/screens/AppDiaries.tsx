import { useRef, useState } from "react";
import { MapPin, Play, X } from "lucide-react";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";
import type { TikTokItem } from "@/components/TikTokWall";

const AppDiaries = () => {
  const { lang } = useAsia();
  const c = <T,>(en: T, zh: T, ru: T, es?: T) => asiaCopy(lang, { en, zh, ru, es });
  const [selected, setSelected] = useState<TikTokItem | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const openDiary = (item: TikTokItem) => {
    setSelected(item);
    window.setTimeout(() => closeRef.current?.focus(), 0);
  };

  return (
    <div className="px-4 pb-8 pt-2">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">{c("Patient diaries", "患者日记", "Истории пациентов", "Diarios de pacientes")}</p>
        <h1 className="mt-2 font-display text-[2.45rem] leading-[.96]">{c("Recovery is a process. See it step by step.", "恢复是一个过程，逐步了解它。", "Восстановление — это процесс.", "La recuperación es un proceso.")}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{c("Explore journey previews by procedure and destination. Reviewed labels appear only when verification is complete.", "按项目和目的地查看恢复过程；仅完成审核的内容才会显示核验标记。", "Смотрите этапы восстановления по процедурам и городам.", "Explora la recuperación por procedimiento y destino.")}</p>
      </header>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {TIKTOK_CASES.slice(0, 8).map((item, index) => {
          const treatment = lang === "zh" ? item.treatment.zh : item.treatment.en;
          const city = lang === "zh" ? item.city.zh : item.city.en;
          return (
            <button key={item.id} type="button" onClick={() => openDiary(item)} className={`group relative overflow-hidden rounded-[1.4rem] bg-foreground text-left text-white active:scale-[.985] ${index % 3 === 0 ? "col-span-2 min-h-72" : "min-h-60"}`} aria-label={c(`Play diary: ${treatment}`, `播放日记：${treatment}`, `Открыть: ${treatment}`, `Reproducir diario: ${treatment}`)}>
              <img src={item.poster} alt="" className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-[1.03]" />
              <span className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/5 to-transparent" />
              <span className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-white/90 text-foreground shadow-soft"><Play className="ml-0.5 size-4 fill-current" /></span>
              <span className="absolute inset-x-0 bottom-0 p-4"><span className="text-[9px] font-bold uppercase tracking-[.14em] text-white/65">{c("Journey preview", "恢复预览", "История", "Vista previa")}</span><strong className="mt-1 block font-display text-xl leading-none">{treatment}</strong><span className="mt-2 flex items-center gap-1 text-[10px] text-white/75"><MapPin className="size-3" />{city}</span></span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[120] flex flex-col bg-[#071b16] text-white" role="dialog" aria-modal="true" aria-label={c("Patient diary player", "患者日记播放", "История пациента", "Reproductor de diario")}>
          <div className="flex items-center justify-between p-3 pt-[max(.75rem,env(safe-area-inset-top))]"><p className="pl-2 text-xs font-semibold uppercase tracking-[.14em] text-white/60">Cosmetics Asia · {c("Diary", "日记", "История", "Diario")}</p><button ref={closeRef} type="button" onClick={() => setSelected(null)} className="grid min-h-12 min-w-12 place-items-center rounded-full bg-white/10 hover:bg-white/15" aria-label={c("Close video", "关闭视频", "Закрыть видео", "Cerrar vídeo")}><X className="size-5" /></button></div>
          <div className="flex min-h-0 flex-1 items-center justify-center px-3"><video key={selected.id} src={selected.src} poster={selected.poster} controls autoPlay playsInline className="max-h-full w-full rounded-[1.5rem] bg-black object-contain" /></div>
          <div className="p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-primary">{c("Journey preview", "恢复预览", "История", "Vista previa")}</p><h2 className="mt-2 font-display text-3xl">{lang === "zh" ? selected.treatment.zh : selected.treatment.en}</h2><p className="mt-2 text-sm text-white/65">{lang === "zh" ? selected.caption.zh : selected.caption.en}</p></div>
        </div>
      )}
    </div>
  );
};

export default AppDiaries;

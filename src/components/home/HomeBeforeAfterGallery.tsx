import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Images, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { usePublishedBeforeAfter, type BeforeAfterRow } from "@/hooks/use-before-after";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";

/** Six published photo sets in one continuously moving row, with edge-to-edge original photos. */
export default function HomeBeforeAfterGallery() {
  const { lang } = useAsia();
  const { items, loading } = usePublishedBeforeAfter(lang);
  const [selected, setSelected] = useState<BeforeAfterRow | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const photos = items.filter((item) => item.beforeUrl && item.afterUrl).slice(0, 6);
  const c = (en: string, zh: string, ru: string, es?: string) => asiaCopy(lang, { en, zh, ru, es });
  const title = c("Before & After", "术前术后对比", "До и после", "Antes y después");
  const enlarge = c("Enlarge photos", "放大照片", "Увеличить фотографии", "Ampliar fotos");

  const imageSet = (item: BeforeAfterRow, expanded = false) => {
    const single = item.before_path === item.after_path;
    return (
      <div className={`grid ${expanded ? "size-full" : "w-full items-start"} ${single ? "grid-cols-1" : "grid-cols-2"}`}>
        {(single ? [item.beforeUrl] : [item.beforeUrl, item.afterUrl]).map((src, index) => (
          <div key={index} className="relative min-h-0 min-w-0">
            <img
              src={src}
              alt={`${item.title} — ${single ? title : index === 0 ? c("Before", "术前", "До", "Antes") : c("After", "术后", "После", "Después")}`}
              loading={expanded ? "eager" : "lazy"}
              decoding="async"
              className={expanded ? "size-full object-contain" : "block h-auto w-full"}
            />
            {!single && <span className="absolute bottom-2 left-2 rounded-full bg-white/95 px-2 py-1 text-xs font-semibold text-foreground">
              {index === 0 ? c("Before", "术前", "До", "Antes") : c("After", "术后", "После", "Después")}
            </span>}
          </div>
        ))}
      </div>
    );
  };

  const photoCard = (item: BeforeAfterRow, duplicate = false) => (
    <article
      key={`${duplicate ? "copy" : "photo"}-${item.id}`}
      className="w-[48vw] max-w-[13rem] shrink-0 sm:w-[12rem] lg:w-[12.5rem] lg:max-w-none"
    >
      <button
        type="button"
        tabIndex={duplicate ? -1 : 0}
        aria-hidden={duplicate || undefined}
        aria-label={duplicate ? undefined : `${enlarge}: ${item.title}`}
        aria-haspopup={duplicate ? undefined : "dialog"}
        className="group relative block w-full overflow-hidden rounded-2xl bg-transparent shadow-soft outline outline-1 -outline-offset-1 outline-black/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand sm:rounded-3xl"
        onClick={(event) => { opener.current = event.currentTarget; setSelected(item); }}
      >
        {imageSet(item)}
        <span className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/90 text-foreground sm:right-3 sm:top-3" aria-hidden="true"><Maximize2 className="size-4" /></span>
      </button>
      <h3 className="mt-2.5 text-sm font-semibold leading-snug text-foreground sm:text-base">{item.title}</h3>
      {(item.city || item.procedure) && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{[item.city, item.procedure].filter(Boolean).join(" · ")}</p>}
    </article>
  );

  return (
    <section className="patient-diaries-band relative py-12 sm:py-16 md:py-20" aria-labelledby="home-before-after-title">
      <div className="container">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 px-1 sm:flex-row sm:items-end md:mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-label font-bold uppercase tracking-[0.16em] text-[hsl(var(--brand-text))]">
              <Images className="size-3.5" aria-hidden="true" />{c("Photo results", "图片对比", "Фотографии", "Fotos")}
            </span>
            <h2 id="home-before-after-title" className="mt-2 font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl">{title}</h2>
          </div>
          <Link to="/before-after" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background transition-colors hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
            {c("View all photos", "查看全部照片", "Все фотографии", "Ver todas las fotos")}<ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <div role="status" aria-busy="true">
            <span className="sr-only">{c("Loading photos…", "正在加载照片…", "Загрузка фотографий…", "Cargando fotos…")}</span>
            <div className="flex gap-4 overflow-hidden sm:gap-6" aria-hidden="true">
              {Array.from({ length: 5 }, (_, index) => <div key={index} className="aspect-[2/3] w-[48vw] max-w-[13rem] shrink-0 rounded-2xl bg-primary/10 sm:w-[12rem] lg:w-[12.5rem] lg:max-w-none" />)}
            </div>
          </div>
        ) : photos.length === 0 ? (
          <p role="status" className="py-8 text-muted-foreground">{c("No photo sets available yet.", "暂时没有可展示的对比照片。", "Фотографии пока недоступны.", "Aún no hay fotos disponibles.")}</p>
        ) : (
          <div
            className="review-motion-viewport edge-fade-x relative overflow-hidden py-2"
            data-testid="home-before-after-marquee"
            role="region"
            aria-label={c("Automatically scrolling before and after photos", "自动向左滚动的术前术后照片", "Автоматически прокручиваемые фотографии до и после", "Fotos de antes y después con desplazamiento automático")}
          >
            <div className="review-motion-track home-before-after-track flex w-max items-start gap-4 sm:gap-6">
              <div className="flex items-start gap-4 pl-4 sm:gap-6 sm:pl-6" data-testid="home-before-after-row">
                {photos.map((item) => photoCard(item))}
              </div>
              <div className="flex items-start gap-4 pl-4 sm:gap-6 sm:pl-6" aria-hidden="true">
                {photos.map((item) => photoCard(item, true))}
              </div>
            </div>
          </div>
        )}

        {!loading && photos.length > 0 && <p className="sr-only">{c("The photos move continuously to the left and pause while you hover or focus a photo.", "照片会持续向左移动，并在鼠标悬停或键盘聚焦时暂停。", "Фотографии непрерывно движутся влево и останавливаются при наведении или фокусе.", "Las fotos se mueven continuamente hacia la izquierda y se detienen al pasar el cursor o enfocarlas.")}</p>}

        <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
          {selected && <DialogContent
            className="w-[calc(100vw-1.5rem)] max-w-5xl gap-3 rounded-2xl bg-white p-4 pt-14 sm:p-6 sm:pt-14"
            closeLabel={c("Close", "关闭", "Закрыть", "Cerrar")}
            onCloseAutoFocus={(event) => { event.preventDefault(); opener.current?.focus({ preventScroll: true }); }}
          >
            <DialogTitle>{selected.title}</DialogTitle>
            <DialogDescription>{c("Before and after photos. Individual results vary.", "术前术后对比照片，效果因人而异。", "Фото до и после. Результаты индивидуальны.", "Fotos de antes y después. Los resultados varían.")}</DialogDescription>
            <div className="h-[min(65svh,40rem)] min-h-0">{imageSet(selected, true)}</div>
          </DialogContent>}
        </Dialog>
      </div>
    </section>
  );
}

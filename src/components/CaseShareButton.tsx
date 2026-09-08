import { useRef, useState } from "react";
import { Share2, X } from "lucide-react";
import type { AsiaLang } from "@/lib/asia-i18n";
import { videoControlsCopy } from "@/lib/video-controls-copy";

export function CaseShareButton({ href, title, lang, className }: { href: string; title: string; lang: AsiaLang; className?: string }) {
  const [status, setStatus] = useState<"copied" | "shared" | "manualCopy" | null>(null);
  const [busy, setBusy] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const t = videoControlsCopy[lang];
  const url = new URL(href, "https://celadonchina.com").href;
  const share = async () => {
    setBusy(true);
    setStatus(null);
    try {
      if (typeof navigator.share === "function") {
        try {
          await navigator.share({ title, url });
          setStatus("shared");
          return;
        } catch (error) {
          if (error && typeof error === "object" && "name" in error && error.name === "AbortError") return;
          // Native sharing can be unavailable even when the method exists.
        }
      }
      try {
        if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(url);
        setStatus("copied");
      } catch {
        setStatus("manualCopy");
      }
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="relative">
      <button ref={buttonRef} type="button" onClick={(event) => { event.stopPropagation(); void share(); }} className={className} aria-label={t.share} aria-busy={busy} disabled={busy}>
        <Share2 className="size-5" aria-hidden="true" />
      </button>
      {status && (
        <div className="absolute bottom-0 right-14 z-50 w-[min(13rem,52vw)] rounded-xl border border-border bg-card p-3 text-left text-sm text-foreground shadow-pop" onClick={(event) => event.stopPropagation()}>
          <button type="button" aria-label={t.close} className="float-right ml-1 grid size-8 place-items-center rounded-full hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring" onClick={() => { setStatus(null); buttonRef.current?.focus(); }}><X className="size-4" /></button>
          <p role="status" className="leading-relaxed">{t[status]}</p>
          {status === "manualCopy" && <input aria-label={t.copyLink} readOnly value={url} onFocus={(event) => event.currentTarget.select()} className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-2 text-xs text-foreground" />}
        </div>
      )}
    </div>
  );
}

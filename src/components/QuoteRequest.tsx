import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useAsia } from "@/lib/asia-i18n";
import { trackEvent } from "@/lib/analytics";
import { ConsultationDialog } from "@/components/ConsultationDialog";
import { getConsultationPickerCopy } from "@/lib/consultation-picker-copy";

export interface QuoteContext {
  /** Pre-selected consultation flow. */
  intent?: "question" | "care_plan";
  doctorName?: string;
  hospitalName?: string;
  procedure?: string;
  city?: string;
  /** Open one path directly, or omit to let the visitor choose. */
  intent?: "question" | "care_plan";
  /** Non-sensitive placement label for aggregate funnel measurement. */
  source?: string;
}

interface QuoteCtxValue { open: (ctx?: QuoteContext) => void; close: () => void }
const QuoteCtx = createContext<QuoteCtxValue | null>(null);

export const QuoteProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ctx, setCtx] = useState<QuoteContext>({});
  const [session, setSession] = useState(0);
  const openerRef = useRef<HTMLElement | null>(null);
  const open = useCallback((context?: QuoteContext) => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setCtx(context ?? {});
    setSession((value) => value + 1);
    setIsOpen(true);
    trackEvent("start_quote", { source: context?.source || "site_cta" });
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const restoreFocus = useCallback((event: Event) => {
    if (openerRef.current?.isConnected) {
      event.preventDefault();
      openerRef.current.focus({ preventScroll: true });
    }
  }, []);
  return (
    <QuoteCtx.Provider value={{ open, close }}>
      {children}
      <ConsultationDialog key={session} isOpen={isOpen} onOpenChange={setIsOpen} ctx={ctx} onCloseAutoFocus={restoreFocus} />
    </QuoteCtx.Provider>
  );
};

export const useQuote = () => {
  const value = useContext(QuoteCtx);
  if (!value) throw new Error("useQuote must be used inside QuoteProvider");
  return value;
};

export const FloatingQuoteCTA = ({ ctx }: { ctx?: QuoteContext }) => {
  const { open } = useQuote();
  const { t } = useAsia();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <div className={`hidden sm:block fixed bottom-6 right-6 z-40 transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
        <button onClick={() => open(ctx)} className="group flex max-w-sm items-center gap-3 rounded-full bg-foreground text-background pl-2 pr-6 py-2 shadow-pop hover:shadow-glow transition-all hover:-translate-y-0.5">
          <span className="size-10 shrink-0 rounded-full bg-primary grid place-items-center text-foreground"><MessageCircle className="size-5" /></span>
          <span className="text-sm font-semibold">{t("hero.cta")}</span>
          <ArrowRight className="size-4 shrink-0 -ml-1 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-gradient-to-t from-background via-background/95 to-background/0 pt-8">
        <button onClick={() => open(ctx)} className="w-full flex items-center justify-center gap-2 rounded-2xl bg-foreground text-background px-5 py-4 shadow-pop active:scale-[0.98] transition-transform">
          <MessageCircle className="size-5 shrink-0" /><span className="text-sm font-semibold">{t("hero.cta")}</span><ArrowRight className="size-4 shrink-0" />
        </button>
      </div>
    </>
  );
};

export const DoctorContactButton = (ctx: QuoteContext) => {
  const { open } = useQuote();
  const { lang } = useAsia();
  const copy = getConsultationPickerCopy(lang);
  return (
    <button onClick={(event) => { event.preventDefault(); event.stopPropagation(); open({ ...ctx, intent: "question" }); }} className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-2 text-xs font-semibold hover:bg-foreground hover:text-background hover:border-foreground transition-colors">
      <MessageCircle className="size-3.5 shrink-0" />{copy.askExpert}
    </button>
  );
};

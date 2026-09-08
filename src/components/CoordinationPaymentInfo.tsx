import { ArrowRight, Building2, MessageCircle, Wallet } from "lucide-react";
import { useAsia } from "@/lib/asia-i18n";
import { getCoordinationPolicy } from "@/data/coordination-policy";
import { useQuote } from "@/components/QuoteRequest";
import { Button } from "@/components/ui/button";

export function CoordinationPaymentInfo() {
  const { lang } = useAsia();
  const { open } = useQuote();
  const copy = getCoordinationPolicy(lang);

  return (
    <section id="payment-terms" aria-labelledby="payment-terms-title" className="mt-8 scroll-mt-28 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-5 sm:p-7 md:p-8">
      <h2 id="payment-terms-title" className="font-display text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">{copy.heading}</h2>
      <p className="mt-2 text-sm leading-6 text-foreground/75">{copy.scope}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="min-w-0 rounded-2xl border border-primary/15 bg-background/75 p-5 sm:p-6">
          <h3 className="flex items-start gap-3 font-display text-xl font-semibold leading-snug"><MessageCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />{copy.initialTitle}</h3>
          <p className="mt-3 text-base leading-7">{copy.initialText}</p>
          <div className="mt-5 border-t border-primary/15 pt-5">
            <h4 className="text-sm font-semibold">{copy.freeTitle}</h4>
            <p className="mt-2 text-sm leading-6 text-foreground/75">{copy.freeText}</p>
          </div>
        </article>
        <article className="min-w-0 rounded-2xl border border-primary/15 bg-background/75 p-5 sm:p-6">
          <h3 className="flex items-start gap-3 font-display text-xl font-semibold leading-snug"><Wallet aria-hidden="true" className="mt-0.5 size-5 shrink-0" />{copy.depositTitle}</h3>
          <p className="mt-3 text-base leading-7">{copy.depositSummary}</p>
          <p className="mt-3 text-sm leading-6 text-foreground/75">{copy.depositPurpose}</p>
          <div className="mt-5 border-t border-primary/15 pt-5">
            <h4 className="text-sm font-semibold">{copy.cancellationTitle}</h4>
            <p className="mt-2 text-sm leading-6 text-foreground/75">{copy.cancellation}</p>
          </div>
          <Button variant="outline" className="mt-5 h-auto min-h-11 max-w-full whitespace-normal rounded-full border-primary/30 bg-background px-5 py-3 text-left" onClick={() => open({ source: "coordination_payment_terms" })}>{copy.confirm}<ArrowRight aria-hidden="true" className="ml-2 size-4 shrink-0" /></Button>
        </article>
      </div>

      <div className="mt-5 border-t border-primary/20 pt-5">
        <h3 className="flex items-start gap-3 text-base font-semibold leading-snug"><Building2 aria-hidden="true" className="size-5 shrink-0" />{copy.medicalTitle}</h3>
        <p className="mt-2 text-sm leading-6 text-foreground/75">{copy.medical}</p>
        <p className="mt-2 text-sm leading-6 text-foreground/75">{copy.separateCosts}</p>
      </div>
    </section>
  );
}

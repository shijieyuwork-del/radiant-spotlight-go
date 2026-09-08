import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, Copy } from "lucide-react";
import { useAsia } from "@/lib/asia-i18n";
import type { QuoteContext } from "@/components/QuoteRequest";
import {
  CONSULTATION_EMAIL, CONSULTATION_PHONE, consultationHandoffCopy,
  consultationHandoffUrl, consultationMessage, type ContactMethod,
} from "@/lib/consultation-handoff";

type Props = {
  method: ContactMethod;
  context: QuoteContext;
  /** A visitor-authored question or plan takes precedence over context-only copy. */
  draft?: { message: string; url: string };
  labels?: { back?: string; openApp?: string; message?: string };
  autoFocus?: boolean;
  onBack: () => void;
  onOpenApp: () => void;
};

/** Keeps the consultation context available while a separate app handles sending. */
export default function ConsultationHandoff({ method, context, draft, labels, autoFocus = true, onBack, onOpenApp }: Props) {
  const { lang } = useAsia();
  const copy = consultationHandoffCopy[lang];
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const [copied, setCopied] = useState<"message" | "contact" | "error" | null>(null);
  const requestRef = useRef(0);
  const contact = method === "email" ? CONSULTATION_EMAIL : CONSULTATION_PHONE;
  const message = draft?.message ?? consultationMessage(context);
  const url = draft?.url ?? consultationHandoffUrl(method, context);

  useEffect(() => {
    if (autoFocus) headingRef.current?.focus({ preventScroll: true });
    return () => { requestRef.current += 1; };
  }, [autoFocus]);

  const copyText = async (kind: "message" | "contact") => {
    const request = ++requestRef.current;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(kind === "message" ? message : contact);
      if (request === requestRef.current) setCopied(kind);
    } catch {
      if (request !== requestRef.current) return;
      setCopied("error");
      if (kind === "message") {
        textRef.current?.focus();
        textRef.current?.select();
      } else {
        contactRef.current?.focus();
        contactRef.current?.select();
      }
    }
  };

  return (
    <section aria-labelledby={`${id}-title`} className="space-y-4 p-4 sm:p-6">
      <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <ArrowLeft className="size-4" aria-hidden="true" />{labels?.back ?? copy.back}
      </button>
      <div className="space-y-2">
        <h3 id={`${id}-title`} ref={headingRef} tabIndex={-1} className="text-lg font-semibold leading-snug text-foreground focus:outline-none">
          {method === "email" ? copy.emailHeading : copy.whatsappHeading}
        </h3>
        <p className="text-sm font-medium text-foreground">{copy.notSent}</p>
        <p className="text-sm text-muted-foreground">{copy.help}</p>
      </div>

      <a href={url} target={method === "whatsapp" ? "_blank" : undefined} rel={method === "whatsapp" ? "noopener noreferrer" : undefined}
        onClick={onOpenApp} className="cta-primary flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-center text-sm font-semibold focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        {labels?.openApp ?? (method === "email" ? copy.openEmail : copy.openWhatsapp)}<ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
      </a>

      <div className="rounded-2xl border border-border bg-card p-3">
        <label htmlFor={`${id}-contact`} className="text-label font-semibold text-foreground">{copy.contact}</label>
        <input id={`${id}-contact`} ref={contactRef} readOnly value={contact} className="mt-1 min-h-11 w-full min-w-0 rounded-md bg-card px-1 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </div>
      <div className="space-y-2">
        <label htmlFor={`${id}-message`} className="text-sm font-semibold text-foreground">{labels?.message ?? copy.message}</label>
        <textarea ref={textRef} id={`${id}-message`} readOnly value={message} rows={4}
          className="w-full resize-y rounded-xl border border-input bg-background p-3 text-base leading-relaxed text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {(["message", "contact"] as const).map((kind) => {
          const active = copied === kind;
          return <button key={kind} type="button" onClick={() => void copyText(kind)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {active ? <Check className="size-4 shrink-0" aria-hidden="true" /> : <Copy className="size-4 shrink-0" aria-hidden="true" />}
            {kind === "message" ? active ? copy.copiedMessage : copy.copyMessage : active ? copy.copiedContact : copy.copyContact}
          </button>;
        })}
      </div>
      <p role="status" aria-live="polite" className="min-h-5 text-sm text-foreground">
        {copied === "error" ? copy.copyFailed : copied === "message" ? copy.copiedMessage : copied === "contact" ? copy.copiedContact : ""}
      </p>
    </section>
  );
}

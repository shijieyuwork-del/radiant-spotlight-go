import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ClipboardList, MessageCircle, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import ConsultationHandoff from "@/components/ConsultationHandoff";
import { CITIES } from "@/data/cities";
import { getCoordinationPolicy } from "@/data/coordination-policy";
import type { QuoteContext } from "@/components/QuoteRequest";
import { useAsia } from "@/lib/asia-i18n";
import { trackEvent } from "@/lib/analytics";
import { getConsultationPickerCopy, withConsultationSubject } from "@/lib/consultation-picker-copy";
import { supabase } from "@/integrations/supabase/client";

type Intent = NonNullable<QuoteContext["intent"]>;
type ContactMethod = "email" | "whatsapp";
type FieldErrors = Partial<Record<"contact" | "question" | "procedure", string>>;
const CITY_TRANSLATION_ORDER = ["Shanghai", "Beijing", "Guangzhou", "Hangzhou", "Hainan"];
const chinaCity = (value?: string) => CITIES.find((city) => [city.en, city.zh, city.slug].some((name) => name.toLowerCase() === value?.trim().toLowerCase()));
const SELECT_CLASS = "min-h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm";

export const ConsultationDialog = ({ isOpen, onOpenChange, ctx, onCloseAutoFocus }: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ctx: QuoteContext;
  onCloseAutoFocus: (event: Event) => void;
}) => {
  const { lang } = useAsia();
  const copy = getConsultationPickerCopy(lang);
  const policy = getCoordinationPolicy(lang);
  const [intent, setIntent] = useState<Intent | null>(ctx.intent ?? null);
  const [contactMethod, setContactMethod] = useState<ContactMethod>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [procedure, setProcedure] = useState(ctx.procedure ?? "");
  const [budget, setBudget] = useState("");
  const [city, setCity] = useState(chinaCity(ctx.city)?.en ?? "");
  const [timing, setTiming] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [draft, setDraft] = useState<{ message: string; url: string; method: ContactMethod } | null>(null);
  const [openError, setOpenError] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const returnToContactRef = useRef(false);
  const subject = ctx.doctorName || ctx.hospitalName || ctx.procedure;
  const contextRows = [
    { label: copy.expert, value: ctx.doctorName },
    { label: copy.hospital, value: ctx.hospitalName },
    { label: copy.procedure, value: ctx.procedure },
    { label: copy.city, value: chinaCity(ctx.city) ? ctx.city : undefined },
  ].filter(({ value }) => Boolean(value));
  const headline = draft ? copy.ready : intent === "question" ? copy.questionTitle : intent === "care_plan" ? copy.carePlanTitle : subject ? withConsultationSubject(copy.aboutHeadline, subject) : copy.headline;
  const description = draft ? copy.readyDescription : intent === "question" ? copy.questionIntro : intent === "care_plan" ? copy.carePlanIntro : copy.intro;

  useEffect(() => {
    if (!isOpen) return;
    if (!draft && returnToContactRef.current) {
      formRef.current?.querySelector<HTMLElement>('input[name="consultation-contact-method"]:checked')?.focus({ preventScroll: true });
      returnToContactRef.current = false;
    } else titleRef.current?.focus({ preventScroll: true });
  }, [intent, draft, isOpen]);

  useEffect(() => {
    if (Object.keys(errors).length) formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [errors]);

  const chooseIntent = (value: Intent) => {
    setIntent(value);
    setErrors({});
    trackEvent("quote_option_selected", { source: ctx.source || "site_cta", option: value });
  };
  const changeContact = (method: ContactMethod) => {
    setContactMethod(method);
    setErrors({});
    trackEvent("quote_contact_method_selected", { source: ctx.source || "site_cta", option: method });
  };
  const recordHandoff = (method: ContactMethod) => trackEvent(method === "email" ? "email_handoff" : "whatsapp_handoff", { source: ctx.source || "site_cta", option: intent || "question" });

  /** The handoff stays the primary path; saving the lead and notifying admin runs alongside it. */
  const saveRequest = async (message: string) => {
    try {
      const trimmedEmail = email.trim();
      const trimmedPhone = phone.trim();
      const { data, error } = await supabase.from("quote_requests").insert({
        name: (trimmedEmail.split("@")[0] || trimmedPhone || "Website visitor").slice(0, 120),
        email: contactMethod === "email" ? trimmedEmail : null,
        phone: contactMethod === "whatsapp" ? trimmedPhone : "",
        country: "",
        procedure: intent === "question" ? question.trim().slice(0, 500) : (procedure.trim() === "__not_sure__" ? "" : procedure.trim()),
        notes: message,
        contact_method: contactMethod,
        expert_name: ctx.doctorName ?? null,
        city: city || ctx.city || null,
        preferred_slot: timing === "" ? null : copy.timingOptions[Number(timing)],
        source: ctx.source || "site_cta",
      }).select("id").maybeSingle();
      if (error || !data?.id) return;
      await supabase.functions.invoke("quote-notification", { body: { requestId: data.id } });
    } catch {
      // A failed save never blocks the visitor's email or WhatsApp handoff.
    }
  };

  const prepareMessage = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: FieldErrors = {};
    if (contactMethod === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.contact = copy.emailError;
    if (contactMethod === "whatsapp" && !/^\+[1-9]\d{6,14}$/.test(phone.replace(/[\s().-]/g, ""))) nextErrors.contact = copy.phoneError;
    if (intent === "question" && !question.trim()) nextErrors.question = copy.questionError;
    if (intent === "care_plan" && !procedure.trim()) nextErrors.procedure = copy.procedureError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const message = [
      intent === "question" ? copy.questionMessage : copy.carePlanMessage,
      ...contextRows.map(({ label, value }) => `${label}: ${value}`),
      `${copy.contactMethod}: ${contactMethod === "email" ? copy.email : copy.whatsapp}`,
      `${contactMethod === "email" ? copy.emailAddress : copy.phone}: ${contactMethod === "email" ? email.trim() : phone.trim()}`,
      ...(intent === "question" ? [`${copy.questionLabel}: ${question.trim()}`] : [
        `${copy.procedure}: ${procedure.trim() === "__not_sure__" ? copy.notSure : procedure.trim()}`,
        `${copy.budget}: ${budget === "" ? copy.notSure : copy.budgetOptions[Number(budget)]}`,
        `${copy.city}: ${city || copy.notSure}`,
        `${copy.timing}: ${timing === "" ? copy.notSure : copy.timingOptions[Number(timing)]}`,
        notes.trim() ? `${copy.notes}: ${notes.trim()}` : "",
      ]),
    ].filter(Boolean).join("\n");
    const emailSubject = `${intent === "question" ? copy.questionTitle : copy.carePlanTitle}${subject ? ` — ${subject}` : ""}`;
    const url = contactMethod === "email"
      ? `mailto:contact@celadonchina.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(message)}`
      : `https://wa.me/14708613825?text=${encodeURIComponent(message)}`;
    setDraft({ message, url, method: contactMethod });
    void saveRequest(message);
    setOpenError(false);
    trackEvent("quote_step_completed", { source: ctx.source || "site_cta", step: 2, option: intent || "question" });
    try {
      if (contactMethod === "email") window.location.href = url;
      else window.open(url, "_blank", "noopener,noreferrer");
      // Opening another app is a handoff, not a delivered lead. No generate_lead event.
      recordHandoff(contactMethod);
    } catch {
      setOpenError(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={copy.close} onCloseAutoFocus={onCloseAutoFocus} className="quote-dialog-mobile max-w-lg gap-0 overflow-y-auto rounded-3xl border-border p-0 sm:max-h-[92vh]">
        <div className="bg-gradient-mint p-5 pr-16 sm:p-6 sm:pr-16">
          <span className="pill bg-background/80"><Sparkles className="size-3 shrink-0" />{copy.free}</span>
          <DialogTitle ref={titleRef} tabIndex={-1} className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight focus:outline-none">{headline}</DialogTitle>
          <DialogDescription className="mt-2 text-sm text-foreground">{description}</DialogDescription>
          {!draft && contextRows.length > 0 && <dl className="mt-4 space-y-1 text-sm">
            {contextRows.map(({ label, value }) => <div key={label} className="flex flex-wrap gap-x-2"><dt className="font-semibold">{label}:</dt><dd className="min-w-0 break-words">{value}</dd></div>)}
          </dl>}
        </div>

        {draft ? <>
          {openError && <p role="alert" className="mx-5 mt-5 rounded-xl border border-destructive/30 p-3 text-sm sm:mx-6">{copy.openError}</p>}
          <ConsultationHandoff method={draft.method} context={ctx} draft={draft} autoFocus={false}
            labels={{ back: copy.edit, openApp: draft.method === "email" ? copy.reopenEmail : copy.reopenWhatsapp, message: copy.draft }}
            onBack={() => { returnToContactRef.current = true; setDraft(null); setOpenError(false); }}
            onOpenApp={() => recordHandoff(draft.method)} />
        </> : !intent ? <div className="space-y-3 p-5 sm:p-6">
          {([
            { intent: "question", title: copy.questionTitle, description: copy.questionDescription, icon: MessageCircle },
            { intent: "care_plan", title: copy.carePlanTitle, description: copy.carePlanDescription, icon: ClipboardList },
          ] as const).map((option) => <button type="button" key={option.intent} onClick={() => chooseIntent(option.intent)} className="flex w-full items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option.icon className="mt-1 size-5 shrink-0" />
            <span className="min-w-0 flex-1"><span className="block font-semibold">{option.title}</span><span className="mt-1 block text-sm text-muted-foreground">{option.description}</span></span>
            <ArrowRight className="mt-1 size-4 shrink-0" />
          </button>)}
        </div> : <form ref={formRef} onSubmit={prepareMessage} noValidate className="space-y-4 p-5 sm:p-6">
          <button type="button" onClick={() => { setIntent(null); setErrors({}); }} className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4 shrink-0" />{copy.back}</button>
          <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-semibold">{copy.contactMethod}</legend>
            <div className="grid grid-cols-2 gap-2">
              {(["email", "whatsapp"] as const).map((method) => <label key={method} className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm ${contactMethod === method ? "border-primary bg-primary/10" : "border-input"}`}>
                <input type="radio" name="consultation-contact-method" value={method} checked={contactMethod === method} onChange={() => changeContact(method)} className="size-4 shrink-0 accent-primary" />{method === "email" ? copy.email : copy.whatsapp}
              </label>)}
            </div>
          </fieldset>
          <Field id="consultation-contact" label={contactMethod === "email" ? copy.emailAddress : copy.phone} error={errors.contact}>
            <Input id="consultation-contact" type={contactMethod === "email" ? "email" : "tel"} autoComplete={contactMethod === "email" ? "email" : "tel"} required maxLength={254} value={contactMethod === "email" ? email : phone} onChange={(event) => contactMethod === "email" ? setEmail(event.target.value) : setPhone(event.target.value)} aria-invalid={!!errors.contact} aria-describedby={errors.contact ? "consultation-contact-error" : contactMethod === "whatsapp" ? "consultation-phone-hint" : undefined} className="h-12 rounded-xl" />
            {contactMethod === "whatsapp" && <p id="consultation-phone-hint" className="text-xs text-muted-foreground">{copy.phoneHint}</p>}
          </Field>
          {intent === "question" ? <Field id="consultation-question" label={copy.questionLabel} error={errors.question}>
            <Textarea id="consultation-question" value={question} onChange={(event) => setQuestion(event.target.value)} required maxLength={2000} placeholder={copy.questionPlaceholder} aria-invalid={!!errors.question} aria-describedby={errors.question ? "consultation-question-error" : undefined} className="min-h-28 rounded-xl" />
          </Field> : <>
            <Field id="consultation-procedure" label={copy.procedure} error={errors.procedure}>
              <Input id="consultation-procedure" required maxLength={150} value={procedure === "__not_sure__" ? copy.notSure : procedure} onChange={(event) => setProcedure(event.target.value)} aria-invalid={!!errors.procedure} aria-describedby={errors.procedure ? "consultation-procedure-error" : "consultation-procedure-hint"} className="h-12 rounded-xl" />
              <div className="flex flex-wrap items-center justify-between gap-2"><p id="consultation-procedure-hint" className="text-xs text-muted-foreground">{copy.procedureHint}</p><button type="button" className="min-h-11 rounded-lg text-sm font-semibold underline underline-offset-4" onClick={() => setProcedure("__not_sure__")}>{copy.notSure}</button></div>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="consultation-budget" label={copy.budget}><select id="consultation-budget" value={budget} onChange={(event) => setBudget(event.target.value)} className={SELECT_CLASS}><option value="">{copy.notSure}</option>{copy.budgetOptions.map((label, index) => <option key={index} value={index}>{label}</option>)}</select></Field>
              <Field id="consultation-city" label={copy.city}><select id="consultation-city" value={city} onChange={(event) => setCity(event.target.value)} className={SELECT_CLASS}><option value="">{copy.notSure}</option>{CITIES.map((place) => <option key={place.slug} value={place.en}>{copy.cities[CITY_TRANSLATION_ORDER.indexOf(place.en)] ?? place.en}</option>)}</select></Field>
            </div>
            <Field id="consultation-timing" label={copy.timing}><select id="consultation-timing" value={timing} onChange={(event) => setTiming(event.target.value)} className={SELECT_CLASS}><option value="">{copy.notSure}</option>{copy.timingOptions.map((label, index) => <option key={index} value={index}>{label}</option>)}</select></Field>
            <Field id="consultation-notes" label={copy.notes}><Textarea id="consultation-notes" value={notes} maxLength={2000} onChange={(event) => setNotes(event.target.value)} className="min-h-20 rounded-xl" /></Field>
          </>}
          <p className="text-sm text-muted-foreground">{copy.handoffNote}</p>
          <Button type="submit" className="h-auto min-h-12 w-full whitespace-normal rounded-xl bg-foreground px-4 py-3 text-background hover:bg-foreground/90">{contactMethod === "email" ? copy.continueEmail : copy.continueWhatsapp}<ArrowRight className="ml-2 size-4 shrink-0" /></Button>
          <p className="text-xs text-muted-foreground">{copy.privacy}</p>
        </form>}
        <div className="space-y-4 border-t border-border px-5 py-5 sm:px-6">
          <dl className="space-y-3 text-xs leading-relaxed">
            <div><dt className="font-semibold">{policy.initialTitle}</dt><dd className="mt-1 text-muted-foreground">{policy.initialText}</dd></div>
            <div><dt className="font-semibold">{policy.depositTitle}</dt><dd className="mt-1 text-muted-foreground">{policy.depositSummary}</dd></div>
          </dl>
          <MedicalDisclaimer variant="inline" className="rounded-xl bg-muted/50 px-3 py-2" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Field = ({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) => (
  <div className="space-y-1.5"><Label htmlFor={id} className="text-sm font-semibold">{label}</Label>{children}{error && <p role="alert" id={`${id}-error`} className="text-sm text-destructive">{error}</p>}</div>
);

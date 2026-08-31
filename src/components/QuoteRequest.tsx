import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { MessageCircle, Mail, Lock, ArrowRight, ArrowLeft, CheckCircle2, X, Sparkles, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getCityTimezone, useCityTime } from "@/lib/timezones";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { useAuth } from "@/lib/auth";
import { useAsia } from "@/lib/asia-i18n";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

export interface QuoteContext {
  doctorName?: string;
  procedure?: string;
  city?: string;
  /** Non-sensitive placement label for aggregate funnel measurement. */
  source?: string;
}

interface QuoteCtxValue {
  open: (ctx?: QuoteContext) => void;
  close: () => void;
}

const QuoteCtx = createContext<QuoteCtxValue | null>(null);

const COUNTRIES = [
  "United States 🇺🇸", "Canada 🇨🇦", "United Kingdom 🇬🇧", "Australia 🇦🇺",
  "Russia 🇷🇺", "Kazakhstan 🇰🇿", "Ukraine 🇺🇦", "Germany 🇩🇪", "France 🇫🇷",
  "Singapore 🇸🇬", "United Arab Emirates 🇦🇪", "Saudi Arabia 🇸🇦", "South Korea 🇰🇷",
  "Japan 🇯🇵", "China 🇨🇳", "Thailand 🇹🇭", "Malaysia 🇲🇾", "Other",
];

const PHONE_CODES = [
  { code: "+1", label: "US / CA +1" },
  { code: "+44", label: "UK +44" },
  { code: "+61", label: "AU +61" },
  { code: "+7", label: "RU / KZ +7" },
  { code: "+380", label: "UA +380" },
  { code: "+49", label: "DE +49" },
  { code: "+33", label: "FR +33" },
  { code: "+65", label: "SG +65" },
  { code: "+971", label: "UAE +971" },
  { code: "+966", label: "SA +966" },
  { code: "+82", label: "KR +82" },
  { code: "+81", label: "JP +81" },
  { code: "+86", label: "CN +86" },
  { code: "+66", label: "TH +66" },
  { code: "+60", label: "MY +60" },
];

const PROCEDURES = [
  "Rhinoplasty", "Facelift", "Neck Lift", "Blepharoplasty",
  "Facial Fat Grafting", "Liposuction", "Tummy Tuck / Mommy Makeover",
  "Brazilian Butt Lift (BBL)", "Breast Augmentation", "Breast Lift",
  "Full Body Contouring", "Other / Not sure yet",
];

export const QuoteProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ctx, setCtx] = useState<QuoteContext>({});
  const [submitted, setSubmitted] = useState(false);

  const open = useCallback((c?: QuoteContext) => {
    setCtx(c ?? {});
    setSubmitted(false);
    setIsOpen(true);
    trackEvent("start_quote", { source: c?.source || "site_cta" });
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <QuoteCtx.Provider value={{ open, close }}>
      {children}
      <QuoteDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        ctx={ctx}
        submitted={submitted}
        onSubmitted={() => setSubmitted(true)}
      />
    </QuoteCtx.Provider>
  );
};

export const useQuote = () => {
  const v = useContext(QuoteCtx);
  if (!v) throw new Error("useQuote must be used inside QuoteProvider");
  return v;
};

/* ---------- Floating CTA (sticky bottom-right / bottom bar on mobile) ---------- */

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
      {/* Desktop / tablet — pill in bottom-right */}
      <div
        className={`hidden sm:block fixed bottom-6 right-6 z-40 transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <button
          onClick={() => open(ctx)}
          className="group flex items-center gap-3 rounded-full bg-foreground text-background pl-2 pr-6 py-2 shadow-pop hover:shadow-glow transition-all hover:-translate-y-0.5"
        >
          <span className="size-10 rounded-full bg-primary grid place-items-center text-foreground">
            <MessageCircle className="size-5" />
          </span>
          <span className="text-sm font-semibold">{t("hero.cta")}</span>
          <ArrowRight className="size-4 -ml-1 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Mobile — full-width sticky bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-gradient-to-t from-background via-background/95 to-background/0 pt-8">
        <button
          onClick={() => open(ctx)}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-foreground text-background px-5 py-4 shadow-pop active:scale-[0.98] transition-transform"
        >
          <MessageCircle className="size-5" />
          <span className="text-sm font-semibold">{t("hero.cta")}</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </>
  );
};

/* ---------- Dialog ---------- */

type Intent = "pricing" | "consultation";
type ContactMethod = "email" | "whatsapp";

const QuoteDialog = ({
  isOpen, onOpenChange, ctx, submitted, onSubmitted,
}: {
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
  ctx: QuoteContext;
  submitted: boolean;
  onSubmitted: () => void;
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [intent, setIntent] = useState<Intent | null>(null);
  const [contactMethod, setContactMethod] = useState<ContactMethod | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+1");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [procedure, setProcedure] = useState(ctx.procedure ?? "");
  const [notes, setNotes] = useState("");
  const [slot, setSlot] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // 登录用户打开表单时预填姓名/邮箱（profiles 的 RLS 只允许本人读取自己的记录）
  useEffect(() => {
    if (!isOpen || !user) return;
    void supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.display_name) setName((n) => n || data.display_name!);
      });
    if (user.email) setEmail((e) => e || user.email!);
  }, [isOpen, user]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIntent(null);
      setContactMethod(null);
      setSlot("");
      setProcedure(ctx.procedure ?? "");
    }
  }, [isOpen, ctx.procedure]);

  const pickContactMethod = (method: ContactMethod) => {
    setContactMethod(method);
    setIntent("consultation");
    setStep(2);
    trackEvent("quote_contact_method_selected", { source: ctx.source || "site_cta", option: method });
    trackEvent("quote_step_completed", { source: ctx.source || "site_cta", step: 1 });
  };

  const expertLabel = ctx.doctorName ?? "";
  const headline = expertLabel
    ? `Ask about ${expertLabel}`
    : ctx.procedure
    ? `Ask about ${ctx.procedure}`
    : "Choose how to contact us";

  const subline = "Choose email or WhatsApp. We’ll prepare your message in the next step.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return void toast.error("Enter your name so we know how to address you.");
    if (!contactMethod) return void toast.error("Choose whether you prefer Email or WhatsApp.");
    if (contactMethod === "email" && !email) return void toast.error("Enter the email address where you would like us to reply.");
    if (!phone) return void toast.error("Enter a phone number where we can reach you.");
    if (!country) return void toast.error("Select the country you will travel from.");
    if (!procedure) return void toast.error("Select a procedure, or choose ‘Other / Not sure yet.’");
    setLoading(true);

    // Persist the lead before any handoff so no request is lost.
    const { error: saveError } = await supabase.from("quote_requests").insert({
      user_id: user?.id ?? null,
      name,
      email: email || null,
      phone_prefix: phonePrefix,
      phone,
      country,
      procedure,
      notes: notes || null,
      contact_method: contactMethod,
      expert_name: expertLabel || null,
      city: ctx.city ?? null,
      preferred_slot: slot || null,
      source: ctx.source || "site_cta",
    });
    if (saveError) {
      console.error("quote_requests insert failed:", saveError);
      setLoading(false);
      toast.error("Could not send your request. Please check your connection and try again.");
      return;
    }
    const message = [
      "Hi Cosmetics Asia, I would like to start a consultation.",
      expertLabel ? `Expert: ${expertLabel}` : "",
      "Request: Consultation",
      `Name: ${name}`,
      `Preferred contact: ${contactMethod === "email" ? "Email" : "WhatsApp"}`,
      email ? `Email: ${email}` : "",
      `Phone: ${phonePrefix} ${phone}`,
      `Traveling from: ${country}`,
      `Procedure: ${procedure}`,
      slot ? `Preferred time: ${slot} (${ctx.city ?? "Shanghai"} local time)` : "",
      notes ? `Questions or goals: ${notes}` : "",
    ].filter(Boolean).join("\n");
    trackEvent("generate_lead", { source: ctx.source || "site_cta", option: intent || "unknown" });
    trackEvent("quote_contact_method_selected", { source: ctx.source || "site_cta", option: contactMethod });

    if (contactMethod === "email") {
      const subject = `Free quote request${procedure ? ` — ${procedure}` : ""}`;
      const emailUrl = `mailto:hello@cosmetics-asia.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      trackEvent("email_handoff", { source: ctx.source || "site_cta", option: intent || "unknown" });
      setLoading(false);
      onSubmitted();
      window.location.href = emailUrl;
      return;
    }

    const whatsappUrl = `https://wa.me/14708613825?text=${encodeURIComponent(message)}`;
    trackEvent("whatsapp_handoff", { source: ctx.source || "site_cta", option: intent || "unknown" });
    const opened = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setLoading(false);
    if (!opened) {
      window.location.href = whatsappUrl;
      return;
    }
    onSubmitted();
  };

  const ctaLabel = contactMethod === "email" ? "Continue by email" : "Continue on WhatsApp";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="quote-dialog-mobile max-w-lg gap-0 overflow-y-auto rounded-3xl border-border p-0 sm:max-h-[92vh]">
        {submitted ? (
          <SuccessState
            onClose={() => onOpenChange(false)}
            doctorName={ctx.doctorName}
            intent={intent}
            slot={slot}
            city={ctx.city}
            contactMethod={contactMethod}
            email={email}
          />
        ) : (
          <>
            <div className="relative bg-gradient-mint p-5 pb-5 pr-16 sm:p-6 sm:pb-5 sm:pr-16">
              <div className="flex items-center justify-between">
                <span className="pill bg-background/80 backdrop-blur shadow-soft">
                  <Sparkles className="size-3 text-primary" /> Free · No obligation
                </span>
                <span className="text-[11px] font-semibold text-foreground/60 uppercase tracking-wider">
                  <span className="hidden min-[360px]:inline">Step {step} of 2</span>
                  <span className="min-[360px]:hidden">{step} / 2</span>
                </span>
              </div>
              <DialogTitle className="font-display text-2xl md:text-[26px] font-semibold tracking-tight mt-3 leading-tight">
                {step === 1 ? headline : "Tell us a little about you"}
              </DialogTitle>
              <DialogDescription className="text-sm text-foreground/70 mt-1.5">
                {step === 1
                  ? subline
                  : contactMethod === "email"
                  ? "Share a few details and we’ll prepare an email for you to send."
                  : "Share a few details and we’ll prepare a WhatsApp message for you to send."}
              </DialogDescription>
              <div className="flex items-center gap-1.5 mt-4">
                <span className="h-1.5 rounded-full w-8 bg-foreground" />
                <span className={`h-1.5 rounded-full transition-all ${step === 2 ? "w-8 bg-foreground" : "w-6 bg-foreground/20"}`} />
              </div>
            </div>

            {step === 1 ? (
              <ContactChannelStep onPick={pickContactMethod} doctorName={ctx.doctorName} />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="-ml-3 -mt-1 mb-1 inline-flex min-h-12 items-center gap-1 rounded-xl px-3 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <ArrowLeft className="size-3" /> Change contact method
                </button>

                <div className={`grid gap-3 ${contactMethod === "email" ? "sm:grid-cols-2" : ""}`}>
                  <Field label="Your name" required>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane" className="h-12 rounded-xl" />
                  </Field>
                  {contactMethod === "email" && (
                    <Field label="Email address" required>
                      <Input aria-label="Email address" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@email.com" className="h-12 rounded-xl" />
                    </Field>
                  )}
                  <div className={contactMethod === "email" ? "sm:col-span-2" : ""}>
                    <Field label="Phone number" required>
                      <div className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-2">
                        <select
                          aria-label="Country calling code"
                          value={phonePrefix}
                          onChange={(e) => setPhonePrefix(e.target.value)}
                          className="h-12 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          {PHONE_CODES.map((item) => <option key={`${item.code}-${item.label}`} value={item.code}>{item.label}</option>)}
                        </select>
                        <Input aria-label="Phone number" type="tel" inputMode="tel" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="470 555 0123" className="h-12 rounded-xl" />
                      </div>
                    </Field>
                  </div>
                </div>

                <Field label="Traveling from" required>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="h-12 w-full rounded-xl border border-input bg-background px-3 text-base focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm"
                  >
                    <option value="">Select your country</option>
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>

                <Field label="Procedure of interest" required>
                  <select
                    value={procedure}
                    onChange={(e) => setProcedure(e.target.value)}
                    className="h-12 w-full rounded-xl border border-input bg-background px-3 text-base focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm"
                  >
                    <option value="">Select a procedure</option>
                    {PROCEDURES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>

                <Field label="What would you like to discuss?">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Share your goals, questions, timeline, or anything you are unsure about."
                    className="rounded-xl min-h-[88px] resize-none"
                  />
                </Field>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-2xl bg-foreground text-background hover:bg-foreground/90 text-base font-semibold"
                >
                  {loading ? (contactMethod === "email" ? "Preparing email..." : "Opening WhatsApp...") : (<>{ctaLabel} <ArrowRight className="ml-1.5 size-4" /></>)}
                </Button>

                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5 pt-1">
                  <Lock className="size-3 text-primary" />
                  Used only for your quote and care coordination. No spam.
                </p>

                <MedicalDisclaimer variant="inline" className="rounded-xl bg-muted/50 px-3 py-2" />
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

/* ---------- Step 1: Contact channel picker ---------- */

const ContactChannelStep = ({ onPick, doctorName }: { onPick: (method: ContactMethod) => void; doctorName?: string }) => {
  const options: { id: ContactMethod; icon: typeof Mail; title: string; desc: string; meta: string }[] = [
    {
      id: "email",
      icon: Mail,
      title: "Contact by email",
      desc: doctorName
        ? `Send your questions about ${doctorName} by email.`
        : "Send your questions and receive a reply by email.",
      meta: "hello@cosmetics-asia.com",
    },
    {
      id: "whatsapp",
      icon: MessageCircle,
      title: "Contact on WhatsApp",
      desc: doctorName
        ? `Continue the conversation about ${doctorName} on WhatsApp.`
        : "Send your questions and continue the conversation on WhatsApp.",
      meta: "+1 470 861 3825",
    },
  ];

  return (
    <div className="space-y-3 p-4 pt-5 sm:p-6 sm:pt-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        How would you like to contact us?
      </p>
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onPick(o.id)}
          className="group w-full text-left rounded-2xl border border-border bg-card p-4 hover:border-foreground hover:shadow-pop transition-all flex items-start gap-4"
        >
          <div className="size-12 rounded-2xl bg-gradient-mint grid place-items-center shrink-0 group-hover:scale-105 transition-transform">
            <o.icon className="size-5 text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display text-base font-semibold leading-tight">{o.title}</p>
            <p className="text-sm text-muted-foreground mt-1 leading-snug">{o.desc}</p>
            <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-primary">
              <o.icon className="size-3" />
              {o.meta}
            </span>
          </div>
          <ArrowRight className="size-4 text-muted-foreground self-center shrink-0 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
        </button>
      ))}

      <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5 pt-2">
        <Lock className="size-3 text-primary" />
        Used only for your quote and care coordination. No spam.
      </p>

      <MedicalDisclaimer variant="inline" className="rounded-xl bg-muted/50 px-3 py-2" />
    </div>
  );
};

/* ---------- Slot picker ---------- */

const buildSlots = () => {
  const days: { key: string; label: string; sub: string; times: string[] }[] = [];
  const now = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 1; i <= 5; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push({
      key: d.toISOString().slice(0, 10),
      label: dayNames[d.getDay()],
      sub: `${d.getDate()}/${d.getMonth() + 1}`,
      times: ["09:00", "11:30", "14:00", "16:30"],
    });
  }
  return days;
};

const SlotPicker = ({ value, onChange, city }: { value: string; onChange: (v: string) => void; city?: string }) => {
  const days = buildSlots();
  const [activeDay, setActiveDay] = useState(days[0].key);
  const day = days.find((d) => d.key === activeDay) ?? days[0];
  const cityName = city ?? "Shanghai";
  const tz = getCityTimezone(city);
  const cityNow = useCityTime(tz);

  return (
    <div className="rounded-2xl border border-border bg-card p-3 space-y-3">
      <p className="flex items-center gap-1.5 rounded-xl bg-accent/70 px-3 py-2 text-[11px] font-medium leading-snug text-foreground/80">
        <Clock className="size-3.5 shrink-0 text-primary" />
        <span>
          All times are <b>{cityName}</b> local time ({tz.offset} · {tz.label.en}) — it&apos;s <b>{cityNow}</b> there now.
        </span>
      </p>
      <div className="grid grid-cols-5 gap-1.5">
        {days.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => setActiveDay(d.key)}
            className={`min-h-12 rounded-xl py-2 text-center transition-colors ${
              activeDay === d.key ? "bg-foreground text-background" : "bg-muted/60 hover:bg-muted text-foreground"
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider opacity-70">{d.label}</p>
            <p className="text-sm font-display font-semibold mt-0.5">{d.sub}</p>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {day.times.map((t) => {
          const slotKey = `${day.key} ${t}`;
          const active = value === slotKey;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange(slotKey)}
              className={`min-h-12 rounded-xl py-2 text-sm font-semibold transition-colors ${
                active ? "bg-primary text-foreground ring-2 ring-foreground" : "bg-muted/60 hover:bg-muted text-foreground"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Field = ({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-semibold text-foreground/80">
      {label} {required && <span className="text-primary">*</span>}
    </Label>
    {children}
  </div>
);

const SuccessState = ({
  onClose, doctorName, intent, slot, city, contactMethod, email,
}: {
  onClose: () => void;
  doctorName?: string;
  intent: Intent | null;
  slot?: string;
  city?: string;
  contactMethod: ContactMethod | null;
  email?: string;
}) => {
  const isConsult = intent === "consultation";
  const byEmail = contactMethod === "email";
  const tz = getCityTimezone(city);
  const prettySlot = slot ? `${slot.replace(" ", " · ")} (${city ?? "Shanghai"} time, ${tz.offset})` : "";
  return (
    <div className="p-8 text-center">
      <div className="size-16 rounded-3xl bg-gradient-mint grid place-items-center mx-auto shadow-soft">
        <CheckCircle2 className="size-8 text-foreground" />
      </div>
      <h3 className="font-display text-2xl font-semibold mt-5">
        {byEmail ? "Your email request is ready" : "Your WhatsApp message is ready"}
      </h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
        {byEmail
          ? `Your email app opened with the request details. Send the prepared message so our coordinator can reply${email ? ` to ${email}` : ""}.`
          : `WhatsApp opened with your details. Send the prepared message there to complete your ${isConsult ? "consultation request" : "quote request"}${prettySlot ? ` for your preferred time, ${prettySlot}` : ""}${doctorName ? ` about ${doctorName}` : ""}.`}
      </p>
      <Button onClick={onClose} className="mt-6 rounded-full px-8 bg-foreground text-background hover:bg-foreground/90">
        Close
      </Button>
    </div>
  );
};

/* ---------- Compact Contact button for expert cards ---------- */

export const DoctorContactButton = ({ doctorName, city, procedure }: QuoteContext) => {
  const { open } = useQuote();
  return (
    <div className="relative group">
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); open({ doctorName, city, procedure }); }}
        className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1.5 text-xs font-semibold hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
      >
        <MessageCircle className="size-3.5" /> Ask about this expert
      </button>
      <div className="hidden md:block absolute bottom-full right-0 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="rounded-2xl bg-foreground text-background text-[11px] py-2 px-3 shadow-pop whitespace-nowrap">
          Ask a question · Discuss pricing · Get a free quote
        </div>
      </div>
    </div>
  );
};

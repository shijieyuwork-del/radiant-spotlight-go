import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { MessageCircle, Lock, ArrowRight, ArrowLeft, CheckCircle2, X, Sparkles, DollarSign, CalendarDays, Video } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export interface QuoteContext {
  doctorName?: string;
  procedure?: string;
  city?: string;
}

interface QuoteCtxValue {
  open: (ctx?: QuoteContext) => void;
  close: () => void;
}

const QuoteCtx = createContext<QuoteCtxValue | null>(null);

const COUNTRIES = [
  "🇺🇸 United States", "🇬🇧 United Kingdom", "🇨🇦 Canada", "🇦🇺 Australia",
  "🇸🇬 Singapore", "🇦🇪 United Arab Emirates", "🇸🇦 Saudi Arabia", "🇰🇷 South Korea",
  "🇯🇵 Japan", "🇨🇳 China", "🇹🇭 Thailand", "🇮🇳 India", "🇲🇾 Malaysia",
  "🇫🇷 France", "🇩🇪 Germany", "🇮🇹 Italy", "🇪🇸 Spain", "🇳🇱 Netherlands",
  "🇧🇷 Brazil", "🇲🇽 Mexico", "🇹🇷 Turkey", "Other",
];

const PROCEDURES = [
  "Rhinoplasty", "Double Eyelid", "V-Line Surgery", "Facelift",
  "Breast Augmentation", "Liposuction", "Hair Transplant", "Eyelid Revision",
  "Other / Not sure yet",
];

export const QuoteProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ctx, setCtx] = useState<QuoteContext>({});
  const [submitted, setSubmitted] = useState(false);

  const open = useCallback((c?: QuoteContext) => {
    setCtx(c ?? {});
    setSubmitted(false);
    setIsOpen(true);
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
          <span className="text-sm font-semibold">Get a Free Quote</span>
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
          <span className="text-sm font-semibold">Get a Free Quote</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </>
  );
};

/* ---------- Dialog ---------- */

type Intent = "pricing" | "consultation";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [procedure, setProcedure] = useState(ctx.procedure ?? "");
  const [notes, setNotes] = useState("");
  const [slot, setSlot] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIntent(null);
      setSlot("");
      setProcedure(ctx.procedure ?? "");
    }
  }, [isOpen, ctx.procedure]);

  const pickIntent = (v: Intent) => {
    setIntent(v);
    setStep(2);
  };

  const headline = ctx.doctorName
    ? `Connect with Dr. ${ctx.doctorName}`
    : ctx.procedure
    ? `Get pricing for ${ctx.procedure}`
    : "Get a free, personalized quote";

  const subline = ctx.doctorName
    ? `${ctx.city ?? "Verified surgeon"} · usually replies within 24h`
    : "Verified doctors will send you tailored pricing — no obligation.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !country || !procedure) {
      toast.error("Please complete the required fields.");
      return;
    }
    if (intent === "consultation" && !slot) {
      toast.error("Please pick a consultation time that works for you.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    onSubmitted();
  };

  const ctaLabel = intent === "consultation" ? "Book Consultation" : "Send My Request";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 rounded-3xl border-border overflow-hidden gap-0 max-h-[92vh] overflow-y-auto">
        {submitted ? (
          <SuccessState
            onClose={() => onOpenChange(false)}
            doctorName={ctx.doctorName}
            intent={intent}
            slot={slot}
          />
        ) : (
          <>
            <div className="bg-gradient-mint p-6 pb-5 relative">
              <div className="flex items-center justify-between">
                <span className="pill bg-background/80 backdrop-blur shadow-soft">
                  <Sparkles className="size-3 text-primary" /> Free · No obligation
                </span>
                <span className="text-[11px] font-semibold text-foreground/60 uppercase tracking-wider">
                  Step {step} of 2
                </span>
              </div>
              <DialogTitle className="font-display text-2xl md:text-[26px] font-semibold tracking-tight mt-3 leading-tight">
                {step === 1 ? headline : intent === "consultation" ? "Book your consultation" : "Get your free quote"}
              </DialogTitle>
              <DialogDescription className="text-sm text-foreground/70 mt-1.5">
                {step === 1
                  ? subline
                  : intent === "consultation"
                  ? "Pick a time that works — confirmed within 24h."
                  : "A few details and verified doctors will reply with tailored pricing."}
              </DialogDescription>
              <div className="flex items-center gap-1.5 mt-4">
                <span className="h-1.5 rounded-full w-8 bg-foreground" />
                <span className={`h-1.5 rounded-full transition-all ${step === 2 ? "w-8 bg-foreground" : "w-6 bg-foreground/20"}`} />
              </div>
            </div>

            {step === 1 ? (
              <IntentStep onPick={pickIntent} doctorName={ctx.doctorName} />
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground -mt-1 mb-1"
                >
                  <ArrowLeft className="size-3" /> Change option
                </button>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Your name" required>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane" className="rounded-xl h-11" />
                  </Field>
                  <Field label="Email" required>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@email.com" className="rounded-xl h-11" />
                  </Field>
                </div>

                <Field label="Traveling from" required>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select your country</option>
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>

                <Field label="Procedure of interest" required>
                  <select
                    value={procedure}
                    onChange={(e) => setProcedure(e.target.value)}
                    className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select a procedure</option>
                    {PROCEDURES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>

                {intent === "consultation" && (
                  <Field label="Pick a consultation time" required>
                    <SlotPicker value={slot} onChange={setSlot} />
                  </Field>
                )}

                <Field label={intent === "consultation" ? "Anything you'd like the doctor to know?" : "Any questions or specific concerns?"}>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell the doctor about your goals, timeline, or anything you'd like them to know..."
                    className="rounded-xl min-h-[88px] resize-none"
                  />
                </Field>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-2xl bg-foreground text-background hover:bg-foreground/90 text-base font-semibold"
                >
                  {loading ? "Sending..." : (<>{ctaLabel} <ArrowRight className="ml-1.5 size-4" /></>)}
                </Button>

                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5 pt-1">
                  <Lock className="size-3 text-primary" />
                  Your info is only shared with this doctor. No spam.
                </p>
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

/* ---------- Step 1: Intent picker ---------- */

const IntentStep = ({ onPick, doctorName }: { onPick: (i: Intent) => void; doctorName?: string }) => {
  const options: { id: Intent; icon: typeof DollarSign; title: string; desc: string; meta: string }[] = [
    {
      id: "pricing",
      icon: DollarSign,
      title: "Get a price quote",
      desc: doctorName
        ? `Receive tailored pricing from Dr. ${doctorName} by email.`
        : "Receive tailored pricing from verified doctors by email.",
      meta: "Reply within 24h",
    },
    {
      id: "consultation",
      icon: CalendarDays,
      title: "Book a consultation",
      desc: "Pick a time for a free 1:1 video consult — confirmed within 24h.",
      meta: "Free · 20 min · Video call",
    },
  ];

  return (
    <div className="p-6 pt-5 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        What would you like to do?
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
              {o.id === "consultation" ? <Video className="size-3" /> : <MessageCircle className="size-3" />}
              {o.meta}
            </span>
          </div>
          <ArrowRight className="size-4 text-muted-foreground self-center shrink-0 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
        </button>
      ))}

      <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5 pt-2">
        <Lock className="size-3 text-primary" />
        Your info is only shared with this doctor. No spam.
      </p>
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

const SlotPicker = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const days = buildSlots();
  const [activeDay, setActiveDay] = useState(days[0].key);
  const day = days.find((d) => d.key === activeDay) ?? days[0];

  return (
    <div className="rounded-2xl border border-border bg-card p-3 space-y-3">
      <div className="grid grid-cols-5 gap-1.5">
        {days.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => setActiveDay(d.key)}
            className={`rounded-xl py-2 text-center transition-colors ${
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
              className={`rounded-xl py-2 text-sm font-semibold transition-colors ${
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
  onClose, doctorName, intent, slot,
}: {
  onClose: () => void;
  doctorName?: string;
  intent: Intent | null;
  slot?: string;
}) => {
  const isConsult = intent === "consultation";
  const prettySlot = slot ? slot.replace(" ", " · ") : "";
  return (
    <div className="p-8 text-center">
      <div className="size-16 rounded-3xl bg-gradient-mint grid place-items-center mx-auto shadow-soft">
        <CheckCircle2 className="size-8 text-foreground" />
      </div>
      <h3 className="font-display text-2xl font-semibold mt-5">
        {isConsult ? "Consultation requested! 🎉" : "Request sent! 🎉"}
      </h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
        {isConsult
          ? `${doctorName ? `Dr. ${doctorName}` : "The doctor"} will confirm your consultation${prettySlot ? ` for ${prettySlot}` : ""} within 24 hours by email.`
          : doctorName
          ? `Dr. ${doctorName} usually replies within 24 hours. We'll email you as soon as they do.`
          : "Most doctors reply within 24 hours. We'll email you as soon as quotes start arriving."}
      </p>
      <Button onClick={onClose} className="mt-6 rounded-full px-8 bg-foreground text-background hover:bg-foreground/90">
        Got it
      </Button>
    </div>
  );
};

/* ---------- Compact Contact button for doctor cards ---------- */

export const DoctorContactButton = ({ doctorName, city, procedure }: QuoteContext) => {
  const { open } = useQuote();
  return (
    <div className="relative group">
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); open({ doctorName, city, procedure }); }}
        className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1.5 text-xs font-semibold hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
      >
        <MessageCircle className="size-3.5" /> Contact
      </button>
      <div className="hidden md:block absolute bottom-full right-0 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="rounded-2xl bg-foreground text-background text-[11px] py-2 px-3 shadow-pop whitespace-nowrap">
          Get pricing · Ask a question · Book consultation
        </div>
      </div>
    </div>
  );
};

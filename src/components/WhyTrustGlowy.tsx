import { FileCheck2, Stethoscope, ShieldCheck, Handshake, Lock, RefreshCcw } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: FileCheck2,
    title: "License check",
    desc: "We verify every surgeon's medical license directly with the issuing national medical board.",
  },
  {
    n: "02",
    icon: Stethoscope,
    title: "Board credentials",
    desc: "Plastic surgery board certification (KSPRS, ISAPS, ABPS, etc.) confirmed via primary source.",
  },
  {
    n: "03",
    icon: ShieldCheck,
    title: "Case audit",
    desc: "Real surgical case volume & malpractice history reviewed before the doctor goes live.",
  },
];

const protections = [
  { icon: Lock, title: "Patient escrow", desc: "Deposits held until your in-person consult is complete." },
  { icon: RefreshCcw, title: "Revision policy", desc: "Mediated revision support if outcomes don't match what was agreed." },
  { icon: Handshake, title: "Tourism boards", desc: "Official partnerships with KTO, TGA, TÜRSAB & TAT for cross-border care." },
];

const WhyTrustGlowy = () => {
  return (
    <section className="container py-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="pill bg-primary-soft text-foreground mb-3" style={{ background: "hsl(var(--primary-soft))" }}>
          <ShieldCheck className="size-3.5 text-primary" /> Why trust Glowy
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
          Verified, end-to-end. <em className="text-primary not-italic">No exceptions.</em>
        </h2>
        <p className="text-muted-foreground mt-4">
          Every doctor on Glowy passes a 3-step verification. Every patient is protected by policy — not promises.
        </p>
      </div>

      {/* 3-step verification */}
      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {steps.map((s, i) => (
          <div key={s.n} className="relative glow-card rounded-3xl p-7 bg-card">
            <div className="flex items-center justify-between">
              <div className="size-12 rounded-2xl bg-gradient-mint grid place-items-center">
                <s.icon className="size-5" />
              </div>
              <span className="font-display text-5xl text-primary/40 font-medium leading-none">{s.n}</span>
            </div>
            <h3 className="font-display text-2xl font-semibold mt-5">{s.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-3 size-6 rounded-full bg-card border border-border grid place-items-center text-primary text-xs">
                →
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Patient protection */}
      <div className="grid md:grid-cols-3 gap-4">
        {protections.map((p) => (
          <div key={p.title} className="rounded-2xl border border-border bg-card p-5 flex gap-4">
            <div className="size-10 rounded-xl bg-accent grid place-items-center shrink-0">
              <p.icon className="size-4" />
            </div>
            <div>
              <p className="font-display font-semibold">{p.title}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyTrustGlowy;

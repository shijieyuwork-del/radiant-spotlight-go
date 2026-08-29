import type { LucideIcon } from "lucide-react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";

export const trustLinks = [
  { label: "About Cosmetics Asia", to: "/about" },
  { label: "Provider verification", to: "/provider-verification" },
  { label: "Medical review policy", to: "/medical-review-policy" },
  { label: "Editorial policy", to: "/editorial-policy" },
];

type TrustPageLayoutProps = {
  children: React.ReactNode;
  eyebrow: string;
  icon: LucideIcon;
  intro: string;
  title: string;
};

const TrustPageLayout = ({ children, eyebrow, icon: Icon, intro, title }: TrustPageLayoutProps) => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <AsiaNavbar />
      <main>
        <section className="border-b border-border/60 bg-gradient-hero/70">
          <div className="container py-10 md:py-16">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="size-4" /> Back to home
            </Link>
            <div className="mt-7 max-w-4xl">
              <span className="pill bg-card/85"><Icon className="size-3.5 text-primary" /> {eyebrow}</span>
              <h1 className="mt-5 max-w-3xl font-display text-4xl font-medium leading-[1.04] tracking-tight md:text-6xl">{title}</h1>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">{intro}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Effective August 29, 2026</p>
            </div>
          </div>
        </section>

        <div className="container grid gap-8 py-10 md:py-16 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
          <aside className="rounded-3xl border border-border bg-card p-4 shadow-soft lg:sticky lg:top-28">
            <p className="px-3 pb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">Trust & standards</p>
            <nav aria-label="Trust and standards pages" className="space-y-1">
              {trustLinks.map((link) => {
                const active = pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center justify-between gap-3 rounded-2xl px-3 text-sm font-semibold transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                  >
                    {link.label}<ArrowRight className="size-3.5 shrink-0" />
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 rounded-2xl bg-muted/70 p-4">
              <p className="text-xs font-semibold text-foreground">See something that needs correcting?</p>
              <a href="mailto:hello@cosmetics-asia.com?subject=Correction%20request" className="mt-2 inline-flex min-h-8 items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                Send a correction request<ArrowRight className="size-3" />
              </a>
            </div>
          </aside>

          <article className="min-w-0 space-y-6">{children}</article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const TrustSection = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <section className="rounded-[2rem] border border-border bg-card p-6 shadow-soft md:p-9">
    <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
    <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground md:text-base">{children}</div>
  </section>
);

export const TrustList = ({ items }: { items: string[] }) => (
  <ul className="grid gap-3">
    {items.map((item) => (
      <li key={item} className="flex gap-3">
        <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export default TrustPageLayout;

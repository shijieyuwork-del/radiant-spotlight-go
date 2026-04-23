import { useState } from "react";
import { ArrowRight, Check, Globe2, TrendingUp, Users, Sparkles, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Onboarding = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Application received! Our team will reach out within 48h.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        <div className="absolute -top-10 right-10 size-72 bg-primary/30 blur-3xl animate-blob" />

        <div className="container relative py-20 md:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-7">
            <span className="pill bg-card/80 backdrop-blur shadow-soft">
              <Building2 className="size-3.5 text-primary" /> For clinic owners
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-medium leading-[0.95] tracking-tight">
              Grow your clinic, <em className="text-primary not-italic">globally.</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Join the platform where Gen-Z discovers their next treatment. Showcase your work through short videos, attract international patients, and book out your calendar.
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-lg pt-4">
              {[
                { v: "12.4K+", l: "Clinics" },
                { v: "47", l: "Countries" },
                { v: "8M", l: "Monthly views" },
              ].map((s) => (
                <div key={s.l} className="bg-card rounded-2xl p-4 shadow-soft">
                  <p className="font-display text-3xl font-semibold text-primary">{s.v}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="relative">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="bg-card rounded-[2rem] p-8 shadow-pop space-y-5">
                <div>
                  <h3 className="font-display text-2xl font-semibold">Apply to join</h3>
                  <p className="text-sm text-muted-foreground mt-1">Free to apply. We respond within 48 hours.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="clinic">Clinic name</Label>
                    <Input id="clinic" required placeholder="Maison Lumière" className="rounded-xl mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required placeholder="Paris" className="rounded-xl mt-1.5" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Contact email</Label>
                  <Input id="email" type="email" required placeholder="hello@clinic.com" className="rounded-xl mt-1.5" />
                </div>

                <div>
                  <Label htmlFor="treatments">Top treatments offered</Label>
                  <Input id="treatments" placeholder="Glow facial, lip filler, botox..." className="rounded-xl mt-1.5" />
                </div>

                <div>
                  <Label htmlFor="about">About your clinic</Label>
                  <Textarea id="about" rows={3} placeholder="Tell us what makes your clinic special..." className="rounded-xl mt-1.5" />
                </div>

                <Button type="submit" size="lg" className="w-full rounded-2xl bg-foreground text-background hover:bg-foreground/90 h-14">
                  Submit application <ArrowRight className="ml-2 size-4" />
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By applying, you agree to our verification process.
                </p>
              </form>
            ) : (
              <div className="bg-card rounded-[2rem] p-12 shadow-pop text-center space-y-4">
                <div className="mx-auto size-16 rounded-full bg-gradient-mint grid place-items-center">
                  <Check className="size-8" />
                </div>
                <h3 className="font-display text-3xl font-semibold">You're in the queue ✨</h3>
                <p className="text-muted-foreground">We'll reach out within 48h to verify your clinic and onboard you.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="container py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="pill bg-secondary text-secondary-foreground mb-3">Why Glowy</span>
          <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight">
            Built for the <em className="text-primary not-italic">video era.</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: TrendingUp, t: "Video-first discovery", d: "Your treatments shown the way Gen-Z actually browses — short, real, scroll-friendly." },
            { icon: Globe2, t: "Global patient flow", d: "Reach beauty travellers from 47 countries searching for treatments in your city." },
            { icon: Users, t: "Verified, qualified leads", d: "Patients arrive informed, with realistic expectations and clear preferences." },
          ].map((f) => (
            <div key={f.t} className="glow-card rounded-3xl p-8">
              <div className="size-12 rounded-2xl bg-gradient-mint grid place-items-center mb-5">
                <f.icon className="size-5" />
              </div>
              <h3 className="font-display text-2xl font-semibold">{f.t}</h3>
              <p className="text-muted-foreground mt-2">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="container py-16">
        <div className="bg-foreground text-background rounded-[3rem] p-10 md:p-16 relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 size-80 bg-primary blur-3xl opacity-40 animate-blob" />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="pill bg-background/10 text-background mb-4">Pricing</span>
              <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight leading-[1]">
                Pay only when you <em className="text-primary not-italic">grow.</em>
              </h2>
              <p className="text-background/70 mt-5 max-w-md">No upfront fees. No subscription. We take a small commission only when bookings convert.</p>
            </div>
            <div className="space-y-3">
              {["Free clinic profile + video uploads", "Free verification & quality badge", "Only 8% per completed booking", "Cancel anytime, no contracts"].map((p) => (
                <div key={p} className="flex items-center gap-3 bg-background/5 rounded-2xl px-5 py-4">
                  <Check className="size-4 text-primary shrink-0" />
                  <p className="text-sm">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="container py-24 text-center">
        <Sparkles className="size-8 text-primary mx-auto mb-4" />
        <h2 className="font-display text-3xl md:text-4xl font-medium">Questions? We've got you.</h2>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto">Our partnerships team is here every step of the way.</p>
        <Button variant="outline" className="rounded-full mt-6">Talk to a human</Button>
      </section>

      <Footer />
    </div>
  );
};

export default Onboarding;

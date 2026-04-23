import { Sparkles, Instagram, Youtube } from "lucide-react";

const Footer = () => (
  <footer className="mt-32 border-t border-border/60 bg-muted/30">
    <div className="container py-16 grid gap-10 md:grid-cols-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="grid place-items-center size-9 rounded-2xl bg-gradient-mint">
            <Sparkles className="size-4" />
          </div>
          <span className="font-display text-xl font-semibold">glowy.</span>
        </div>
        <p className="text-sm text-muted-foreground max-w-xs">The global discovery platform for medical aesthetics. Real videos. Real clinics. Real glow.</p>
      </div>
      {[
        { title: "Discover", items: ["Trending", "By Treatment", "By City", "Watch"] },
        { title: "For You", items: ["Reviews", "Pricing Guide", "Safety", "Blog"] },
        { title: "Clinics", items: ["Apply to join", "Pricing", "Success stories", "Resources"] },
      ].map((c) => (
        <div key={c.title}>
          <h4 className="font-display text-base mb-3">{c.title}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {c.items.map((i) => <li key={i} className="hover:text-foreground cursor-pointer">{i}</li>)}
          </ul>
        </div>
      ))}
    </div>
    <div className="container pb-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
      <p>© {new Date().getFullYear()} Glowy. Curated worldwide.</p>
      <div className="flex gap-3">
        <Instagram className="size-4 hover:text-foreground cursor-pointer" />
        <Youtube className="size-4 hover:text-foreground cursor-pointer" />
      </div>
    </div>
  </footer>
);

export default Footer;

import { Link, useLocation } from "react-router-dom";
import { Sparkles, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CurrencyPicker, LanguagePicker, RegionAutoDetectBanner } from "@/components/CurrencyLanguagePicker";

const Navbar = () => {
  const { pathname } = useLocation();
  const links = [
    { to: "/", label: "Discover" },
    { to: "/treatment/glow-facial", label: "Treatments" },
    { to: "/onboarding", label: "For Clinics" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <nav className="container flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="grid place-items-center size-9 rounded-2xl bg-gradient-mint shadow-glow">
            <Sparkles className="size-4 text-foreground" />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">glowy.</span>
        </Link>

        <div className="hidden md:flex items-center gap-1 rounded-full bg-muted/60 p-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                pathname === l.to ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <RegionAutoDetectBanner />
          <CurrencyPicker />
          <LanguagePicker />
          <Button variant="ghost" size="icon" className="rounded-full hidden sm:inline-flex"><Search className="size-4" /></Button>
          <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-5">Sign in</Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

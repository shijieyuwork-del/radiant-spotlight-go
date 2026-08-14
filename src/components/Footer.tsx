import { Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { useLangPath } from "@/lib/i18n";
import BrandLogo from "@/components/BrandLogo";

const Footer = () => {
  const lp = useLangPath();
  return (
    <footer className="mt-16 md:mt-32 border-t border-border/60 bg-muted/30">
      <div className="container py-10 md:py-16 grid grid-cols-2 gap-8 md:grid-cols-4">
        <div className="space-y-4 col-span-2 md:col-span-1">
          <BrandLogo />
          <p className="text-sm text-muted-foreground max-w-xs">China's trusted cosmetic medical travel platform. Verified doctors. Coordinated care. Travel made simple.</p>
        </div>
        {[
          { title: "Discover", items: [{ label: "Trending" }, { label: "By Treatment" }, { label: "By City" }, { label: "Watch" }] },
          { title: "For You", items: [{ label: "Reviews" }, { label: "Pricing Guide" }, { label: "Safety" }, { label: "Blog" }] },
          { title: "For Clinics", items: [{ label: "Apply to join", to: lp("/onboarding") }, { label: "For Clinics", to: lp("/onboarding") }, { label: "Pricing" }, { label: "Success stories" }, { label: "Resources" }] },
        ].map((c) => (
          <div key={c.title}>
            <h4 className="font-display text-base mb-3">{c.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {c.items.map((i) => (
                <li key={i.label} className="hover:text-foreground cursor-pointer">
                  {i.to ? <Link to={i.to}>{i.label}</Link> : i.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container pb-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Cosmetics Asia. Focused on medical travel in China.</p>
        <div className="flex gap-3">
          <Instagram className="size-4 hover:text-foreground cursor-pointer" />
          <Youtube className="size-4 hover:text-foreground cursor-pointer" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;

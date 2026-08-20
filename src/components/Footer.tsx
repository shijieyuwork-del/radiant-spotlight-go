import { Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";

const Footer = () => {
  return (
    <footer className="mt-16 md:mt-32 border-t border-border/60 bg-muted/30">
      <div className="container py-10 md:py-16 grid grid-cols-2 gap-8 md:grid-cols-4">
        <div className="space-y-4 col-span-2 md:col-span-1">
          <BrandLogo />
          <p className="text-sm text-muted-foreground max-w-xs">China's trusted cosmetic medical travel platform. Verified doctors. Coordinated care. Travel made simple.</p>
        </div>
        {[
          { title: "Explore", items: [{ label: "Patient Diaries", to: "/cases" }, { label: "Doctors in China", to: "/doctors" }, { label: "Procedure Academy", to: "/treatments" }, { label: "China Destinations", to: "/cities" }] },
          { title: "Plan Your Trip", items: [{ label: "Travel Support", to: "/travel-packages" }, { label: "Why China", to: "/why-china" }, { label: "Shanghai", to: "/cities/shanghai" }, { label: "Beijing", to: "/cities/beijing" }] },
          { title: "Popular Guides", items: [{ label: "Rhinoplasty", to: "/treatments/rhinoplasty" }, { label: "Eyelid Surgery", to: "/treatments/blepharoplasty" }, { label: "Facelift", to: "/treatments/facelift" }, { label: "Liposuction", to: "/treatments/liposuction" }] },
        ].map((c) => (
          <div key={c.title}>
            <h4 className="font-display text-base mb-3">{c.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {c.items.map((i) => (
                <li key={i.label} className="hover:text-foreground cursor-pointer">
                  <Link to={i.to}>{i.label}</Link>
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

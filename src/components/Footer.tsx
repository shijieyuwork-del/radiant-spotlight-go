import { Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";
import ConsultationCta from "@/components/ConsultationCta";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { analyticsConfigured, openPrivacyChoices } from "@/lib/analytics";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";

const Footer = () => {
  const { lang } = useAsia();
  return (
    <>
      <ConsultationCta />
      <footer className="border-t border-border/60 bg-muted/30">
      <div className="container py-10 md:py-16 grid grid-cols-2 gap-8 md:grid-cols-4 xl:grid-cols-5">
        <div className="space-y-4 col-span-2 md:col-span-4 xl:col-span-1">
          <BrandLogo showTagline />
          <p className="text-sm text-muted-foreground max-w-xs">{asiaCopy(lang, {
            en: "CeladonChina provides information, consultation coordination and travel support for cosmetic care in China only.",
            zh: "CeladonChina 仅提供中国医美相关的信息、咨询协调与行程支持。",
            ru: "CeladonChina предоставляет информацию, координацию консультаций и поездок для эстетической медицины только в Китае.",
            es: "CeladonChina ofrece información, coordinación de consultas y apoyo de viaje para atención estética exclusivamente en China.",
            th: "CeladonChina ให้ข้อมูล ประสานงานการปรึกษา และสนับสนุนการเดินทางเพื่อรับบริการด้านความงามในประเทศจีนเท่านั้น",
            ms: "CeladonChina menyediakan maklumat, penyelarasan perundingan dan sokongan perjalanan untuk rawatan estetik di China sahaja.",
          })}</p>
        </div>
        {[
          { title: "Explore", items: [{ label: "Patient Diaries", to: "/cases" }, { label: "Experts in China", to: "/doctors" }, { label: "Clinics & Hospitals", to: "/clinics" }, { label: "Procedure Academy", to: "/treatments" }, { label: "China Destinations", to: "/cities" }] },
          { title: "Plan Your Trip", items: [{ label: "Medical Tourism China", to: "/medical-tourism-china" }, { label: "Travel Support", to: "/travel-packages" }, { label: "Why China", to: "/why-china" }, { label: "Shanghai", to: "/cities/shanghai" }] },
          { title: "Popular Guides", items: [{ label: "Plastic Surgery China", to: "/plastic-surgery-china" }, { label: "Cosmetic Surgery Tourism", to: "/cosmetic-surgery-tourism-china" }, { label: "Rhinoplasty", to: "/treatments/rhinoplasty" }, { label: "Eyelid Surgery", to: "/treatments/blepharoplasty" }] },
          { title: "Trust & Policies", items: [{ label: "About Us", to: "/about" }, { label: "Contact", to: "/contact" }, { label: "Provider Verification", to: "/provider-verification" }, { label: "Medical Review Policy", to: "/medical-review-policy" }, { label: "Editorial Policy", to: "/editorial-policy" }] },
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
      <div className="container pb-6">
        <MedicalDisclaimer variant="inline" className="max-w-3xl" />
      </div>
      <div className="container pb-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Celadon Limited · Hong Kong</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/privacy" className="hover:text-foreground">Privacy notice</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/legal-notice" className="hover:text-foreground">Legal notice</Link>
          {analyticsConfigured() && <button type="button" onClick={openPrivacyChoices} className="hover:text-foreground">Privacy choices</button>}
          <Instagram className="size-4 hover:text-foreground cursor-pointer" />
          <Youtube className="size-4 hover:text-foreground cursor-pointer" />
        </div>
      </div>
      </footer>
    </>
  );
};

export default Footer;

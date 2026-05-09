import { Link } from "react-router-dom";
import { Sparkles, DollarSign, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCn, cnLangLabel as langLabel, type CnLang as Lang } from "@/lib/cn-i18n";

type Props = { homeLinks?: boolean };

const CnNavbar = ({ homeLinks = true }: Props) => {
  const { t, lang, setLang, currency, setCurrency } = useCn();
  const links = homeLinks
    ? [
        { to: "/#cities", label: t("nav.cities") },
        { to: "/#projects", label: t("nav.projects") },
        { to: "/doctors", label: t("nav.compliance") },
        { to: "/cases", label: t("nav.cases") },
        { to: "/doctors", label: t("nav.compliance") },
      ]
    : [
        { to: "/", label: t("brand.suffix") === "China" ? "Home" : "首页" },
        { to: "/cases", label: t("nav.cases") },
      ];
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
      <nav className="container flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="grid place-items-center size-9 rounded-2xl bg-gradient-mint shadow-glow">
            <Sparkles className="size-4 text-foreground" />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">
            glowy<span className="text-primary">·{t("brand.suffix")}</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-1 rounded-full bg-muted/60 p-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full gap-1.5">
                <DollarSign className="size-3.5" /> {currency}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl">
              <DropdownMenuItem onClick={() => setCurrency("USD")} className="rounded-xl">🇺🇸 USD ($)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrency("CNY")} className="rounded-xl">🇨🇳 CNY (¥)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full gap-1.5">
                <Languages className="size-3.5" /> {langLabel[lang].flag} {langLabel[lang].label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl">
              {(Object.keys(langLabel) as Lang[]).map((l) => (
                <DropdownMenuItem key={l} onClick={() => setLang(l)} className="rounded-xl">
                  {langLabel[l].flag} {langLabel[l].label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-5">{t("nav.signin")}</Button>
        </div>
      </nav>
    </header>
  );
};

export default CnNavbar;

import { Link } from "react-router-dom";
import { DollarSign, Languages, Menu, ChevronRight, ChevronDown, Phone, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAsia, asiaLangLabel as langLabel, type AsiaLang as Lang } from "@/lib/asia-i18n";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import BrandLogo from "@/components/BrandLogo";

type Props = { homeLinks?: boolean };

const AsiaNavbar = ({ homeLinks = true }: Props) => {
  const { t, lang, setLang, currency, setCurrency } = useAsia();
  const links = homeLinks
    ? [
        { to: "/", label: lang === "zh" ? "首页" : "Home" },
        { to: "/cities", label: t("nav.cities") },
        { to: "/cases", label: t("nav.cases") },
        { to: "/doctors", label: t("nav.compliance") },
        { to: "/treatments", label: t("nav.projects") },
        { to: "/travel-packages", label: lang === "zh" ? "旅行套餐" : "Travel Packages" },
        { to: "/why-china", label: lang === "zh" ? "为什么选中国" : "Why China" },
      ]
    : [
        { to: "/", label: lang === "zh" ? "首页" : "Home" },
        { to: "/cases", label: t("nav.cases") },
      ];
  const desktopLinks = homeLinks
    ? links.filter((link) => ["/", "/treatments", "/cases", "/doctors", "/travel-packages"].includes(link.to))
    : links;
  const moreLinks = homeLinks
    ? links.filter((link) => ["/cities", "/why-china"].includes(link.to))
    : [];
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
      <div className="border-b border-primary bg-primary text-primary-foreground">
        <div className="container flex min-h-9 items-center justify-between gap-3 py-1 text-[11px] sm:text-xs">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-5">
            <a
              href="https://wa.me/14708613825?text=Hi%20Cosmetics%20Asia%2C%20I%20would%20like%20to%20ask%20about%20your%20services."
              target="_blank"
              rel="noreferrer"
              aria-label="Contact Cosmetics Asia on WhatsApp"
              className="inline-flex shrink-0 items-center gap-1.5 font-medium text-primary-foreground/90 transition hover:text-primary-foreground"
            >
              <Phone className="size-3.5" />
              <span className="hidden sm:inline">+1 470 861 3825</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
            <a href="mailto:hello@cosmetics-asia.com" className="hidden min-w-0 items-center gap-1.5 font-medium text-primary-foreground/90 transition hover:text-primary-foreground min-[390px]:inline-flex">
              <Mail className="size-3.5 shrink-0" />
              <span className="hidden truncate sm:inline">hello@cosmetics-asia.com</span>
            </a>
          </div>
          <Link
            to="/auth?next=/cases"
            aria-label={lang === "zh" ? "登录或注册并保存喜欢的案例" : "Sign in or sign up to save favorite cases"}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-card px-3 py-1 font-semibold text-foreground shadow-soft transition hover:bg-card/90"
          >
            <UserRound className="size-3.5" />
            <span className="hidden min-[360px]:inline">{lang === "zh" ? "登录 / 注册" : "Sign in / Sign up"}</span>
            <span className="min-[360px]:hidden">{lang === "zh" ? "账户" : "Account"}</span>
            <span className="hidden text-[10px] font-medium text-muted-foreground lg:inline">
              · {lang === "zh" ? "保存案例" : "Save cases"}
            </span>
          </Link>
        </div>
      </div>
      <nav className="container flex h-14 md:h-16 items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <BrandLogo markClassName="size-8 md:size-9" textClassName="text-lg md:text-xl" />
        </Link>
        <div className="hidden md:flex items-center gap-0.5 rounded-full bg-muted/60 p-1">
          {desktopLinks.map((l) => (
            <Link key={l.to} to={l.to} className="whitespace-nowrap px-2.5 xl:px-4 py-1.5 rounded-full text-[13px] xl:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
          {moreLinks.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground xl:px-4 xl:text-sm">
                  {lang === "zh" ? "更多" : "More"}<ChevronDown className="size-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44 rounded-2xl p-1.5">
                {moreLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild className="rounded-xl">
                    <Link to={link.to}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="hidden md:flex items-center gap-1.5">
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
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden size-10 rounded-full bg-card shadow-soft" aria-label={lang === "zh" ? "打开菜单" : "Open menu"}>
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[88vw] max-w-sm p-0">
            <SheetHeader className="p-5 border-b text-left">
              <SheetTitle><BrandLogo /></SheetTitle>
            </SheetHeader>
            <div className="flex h-[calc(100%-73px)] flex-col overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="space-y-1">
                {links.map((l) => (
                  <Link key={l.to} to={l.to} className="flex items-center justify-between min-h-12 px-4 rounded-2xl text-base font-semibold hover:bg-muted">
                    {l.label}<ChevronRight className="size-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-5 pt-5 border-t">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="outline" className="rounded-2xl h-11"><DollarSign className="size-4 mr-1" />{currency}</Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl"><DropdownMenuItem onClick={() => setCurrency("USD")}>🇺🇸 USD ($)</DropdownMenuItem><DropdownMenuItem onClick={() => setCurrency("CNY")}>🇨🇳 CNY (¥)</DropdownMenuItem></DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="outline" className="rounded-2xl h-11"><Languages className="size-4 mr-1" />{langLabel[lang].flag} {langLabel[lang].label}</Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl">{(Object.keys(langLabel) as Lang[]).map((l) => <DropdownMenuItem key={l} onClick={() => setLang(l)}>{langLabel[l].flag} {langLabel[l].label}</DropdownMenuItem>)}</DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Link to="/auth?next=/cases" className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
                <UserRound className="size-4" />
                {lang === "zh" ? "登录或注册 · 保存案例" : "Sign in or sign up · Save cases"}
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default AsiaNavbar;

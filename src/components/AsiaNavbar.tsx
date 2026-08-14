import { Link, useNavigate } from "react-router-dom";
import { DollarSign, Languages, MessageCircle, LogOut, User as UserIcon, Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useAsia, asiaLangLabel as langLabel, type AsiaLang as Lang } from "@/lib/asia-i18n";
import { useQuote } from "@/components/QuoteRequest";
import { useAuth } from "@/lib/auth";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import BrandLogo from "@/components/BrandLogo";

type Props = { homeLinks?: boolean };

const AsiaNavbar = ({ homeLinks = true }: Props) => {
  const { t, lang, setLang, currency, setCurrency } = useAsia();
  const { open } = useQuote();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const links = homeLinks
    ? [
        { to: "/", label: lang === "zh" ? "首页" : "Home" },
        { to: "/cities", label: t("nav.cities") },
        { to: "/treatments", label: t("nav.projects") },
        { to: "/cases", label: t("nav.cases") },
        { to: "/doctors", label: t("nav.compliance") },
        { to: "/travel-packages", label: lang === "zh" ? "旅行套餐" : "Travel Packages" },
        { to: "/why-china", label: lang === "zh" ? "为什么选中国" : "Why China" },
      ]
    : [
        { to: "/", label: lang === "zh" ? "首页" : "Home" },
        { to: "/cases", label: t("nav.cases") },
      ];
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
      <nav className="container flex h-14 md:h-16 items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <BrandLogo markClassName="size-8 md:size-9" textClassName="text-lg md:text-xl" />
        </Link>
        <div className="hidden md:flex items-center gap-0.5 rounded-full bg-muted/60 p-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="whitespace-nowrap px-2.5 xl:px-4 py-1.5 rounded-full text-[13px] xl:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
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
          <Button onClick={() => open()} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-5 gap-1.5">
            <MessageCircle className="size-4" />
            {lang === "zh" ? "人工咨询" : "Consult"}
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full size-9 p-0 bg-accent">
                  <span className="text-sm font-semibold">
                    {(user.email?.[0] ?? "U").toUpperCase()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl w-56">
                <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-xl gap-2" disabled>
                  <UserIcon className="size-4" /> {lang === "zh" ? "个人中心" : "Profile"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-xl gap-2 text-destructive focus:text-destructive"
                  onClick={async () => { await signOut(); navigate("/"); }}
                >
                  <LogOut className="size-4" /> {lang === "zh" ? "退出登录" : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-5">
              <Link to="/auth">{t("nav.signin")}</Link>
            </Button>
          )}
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
            <div className="p-4 flex flex-col h-[calc(100%-73px)]">
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
              <div className="mt-auto space-y-2 pt-6">
                <Button onClick={() => open()} className="w-full h-12 rounded-2xl gap-2"><MessageCircle className="size-4" />{lang === "zh" ? "人工咨询" : "Consult"}</Button>
                {user ? <Button variant="outline" className="w-full h-12 rounded-2xl" onClick={async () => { await signOut(); navigate("/"); }}><LogOut className="size-4 mr-2" />{lang === "zh" ? "退出登录" : "Sign out"}</Button> : <Button asChild variant="outline" className="w-full h-12 rounded-2xl"><Link to="/auth">{t("nav.signin")}</Link></Button>}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default AsiaNavbar;

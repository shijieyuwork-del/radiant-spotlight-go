import { Link, useLocation } from "react-router-dom";
import { DollarSign, Languages, Menu, ChevronRight, ChevronDown, Phone, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAsia, asiaLangLabel as langLabel, type AsiaLang as Lang } from "@/lib/asia-i18n";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import BrandLogo from "@/components/BrandLogo";
import { asiaCopy } from "@/lib/asia-copy";

type Props = { homeLinks?: boolean };

const AsiaNavbar = ({ homeLinks = true }: Props) => {
  const { t, lang, setLang, currency, setCurrency } = useAsia();
  const { pathname } = useLocation();
  const c = (en: string, zh: string, ru: string) => asiaCopy(lang, { en, zh, ru });
  const isActive = (to: string) => to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);
  const links = homeLinks
      ? [
        { to: "/", label: c("Home", "首页", "Главная") },
        { to: "/cases", label: t("nav.cases") },
        { to: "/doctors", label: t("nav.compliance") },
        { to: "/treatments", label: t("nav.projects") },
        { to: "/travel-packages", label: c("Travel Support", "行程支持", "Поддержка поездки") },
        { to: "/cities", label: t("nav.cities") },
        { to: "/why-china", label: c("Why China", "为什么选中国", "Почему Китай") },
      ]
    : [
        { to: "/", label: c("Home", "首页", "Главная") },
        { to: "/cases", label: t("nav.cases") },
      ];
  const desktopLinks = homeLinks
    ? links.filter((link) => ["/", "/treatments", "/cases", "/doctors", "/travel-packages"].includes(link.to))
    : links;
  const moreLinks = homeLinks
    ? links.filter((link) => ["/cities", "/why-china"].includes(link.to))
    : [];
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[70]">
      <div className="h-12 border-b border-primary bg-primary text-primary-foreground shadow-sm md:h-9">
        <div className="container flex h-full items-center justify-between gap-3 text-xs">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-5">
            <a
              href="https://wa.me/14708613825?text=Hi%20Cosmetics%20Asia%2C%20I%20would%20like%20to%20ask%20about%20your%20services."
              target="_blank"
              rel="noreferrer"
              aria-label="Contact Cosmetics Asia on WhatsApp"
              className="inline-flex min-h-12 shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-2.5 font-bold tracking-[0.01em] text-white transition hover:bg-white/20 md:min-h-9"
            >
              <Phone className="size-3.5" />
              <span className="hidden sm:inline">+1 470 861 3825</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
            <a href="mailto:hello@cosmetics-asia.com" className="hidden min-h-12 min-w-0 items-center gap-1.5 rounded-full px-2 font-semibold tracking-[0.01em] text-white/95 transition hover:bg-white/10 hover:text-white sm:inline-flex md:min-h-9">
              <Mail className="size-3.5 shrink-0" />
              <span className="hidden truncate sm:inline">hello@cosmetics-asia.com</span>
            </a>
          </div>
          <Link
            to="/auth?next=/cases"
            aria-label={c("Sign in or sign up to save favorite cases", "登录或注册并保存喜欢的案例", "Войдите или зарегистрируйтесь, чтобы сохранять понравившиеся истории")}
            className="inline-flex min-h-12 shrink-0 items-center gap-1.5 rounded-full border border-white/30 bg-foreground/10 px-3 font-semibold text-white transition hover:bg-foreground/20 md:min-h-9"
          >
            <UserRound className="size-3.5" />
            <span className="hidden min-[360px]:inline">{c("Sign in / Sign up", "登录 / 注册", "Войти / Регистрация")}</span>
            <span className="min-[360px]:hidden">{c("Account", "账户", "Аккаунт")}</span>
            <span className="hidden text-[10px] font-medium text-white/65 lg:inline">
              · {c("Save cases", "保存案例", "Сохранять истории")}
            </span>
          </Link>
        </div>
      </div>
      <header className="border-b border-border/60 bg-background/95 shadow-[0_4px_18px_rgba(16,42,36,0.04)] backdrop-blur-xl">
      <nav className="container flex h-[3.75rem] md:h-16 items-center justify-between gap-3">
        <Link to="/" className="flex min-h-12 shrink-0 items-center gap-2">
          <BrandLogo markClassName="size-8 md:size-9" textClassName="text-lg md:text-xl" />
        </Link>
        <div className="hidden md:flex items-center gap-0.5 rounded-full bg-muted/60 p-1">
          {desktopLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              aria-current={isActive(l.to) ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] font-medium transition-all xl:px-4 xl:text-sm ${
                isActive(l.to)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {moreLinks.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] font-medium transition-all xl:px-4 xl:text-sm ${
                  moreLinks.some((link) => isActive(link.to))
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                }`}>
                  {c("More", "更多", "Ещё")}<ChevronDown className="size-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44 rounded-2xl p-1.5">
                {moreLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild className={`rounded-xl ${isActive(link.to) ? "bg-primary/12 font-semibold text-primary" : ""}`}>
                    <Link to={link.to} aria-current={isActive(link.to) ? "page" : undefined}>{link.label}</Link>
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
            <Button variant="ghost" size="icon" className="size-12 rounded-full border border-primary/10 bg-card shadow-soft md:hidden" aria-label={c("Open menu", "打开菜单", "Открыть меню")}>
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[88vw] max-w-sm p-0">
            <SheetHeader className="border-b p-5 pr-16 text-left">
              <SheetTitle><BrandLogo /></SheetTitle>
              <SheetDescription className="sr-only">
                {c("Site navigation and account settings", "网站导航与账户设置", "Навигация и настройки аккаунта")}
              </SheetDescription>
            </SheetHeader>
            <div className="flex h-[calc(100%-73px)] flex-col overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="space-y-1">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    aria-current={isActive(l.to) ? "page" : undefined}
                    className={`flex min-h-12 items-center justify-between rounded-2xl px-4 text-base font-semibold transition-colors ${
                      isActive(l.to) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    {l.label}<ChevronRight className="size-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-5 pt-5 border-t">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="outline" className="h-12 rounded-2xl"><DollarSign className="size-4 mr-1" />{currency}</Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl"><DropdownMenuItem onClick={() => setCurrency("USD")}>🇺🇸 USD ($)</DropdownMenuItem><DropdownMenuItem onClick={() => setCurrency("CNY")}>🇨🇳 CNY (¥)</DropdownMenuItem></DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="outline" className="h-12 rounded-2xl"><Languages className="size-4 mr-1" />{langLabel[lang].flag} {langLabel[lang].label}</Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl">{(Object.keys(langLabel) as Lang[]).map((l) => <DropdownMenuItem key={l} onClick={() => setLang(l)}>{langLabel[l].flag} {langLabel[l].label}</DropdownMenuItem>)}</DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Link to="/auth?next=/cases" className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
                <UserRound className="size-4" />
                {c("Sign in or sign up · Save cases", "登录或注册 · 保存案例", "Войти или зарегистрироваться · Сохранять истории")}
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
      </header>
      </div>
      <div className="h-[6.75rem] md:h-[6.25rem]" aria-hidden="true" />
    </>
  );
};

export default AsiaNavbar;

import { Link, useLocation } from "react-router-dom";
import { DollarSign, Languages, Menu, ChevronRight, Phone, Mail, MessageCircle, ArrowRight, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAsia, asiaLangLabel as langLabel, type AsiaLang as Lang } from "@/lib/asia-i18n";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import BrandLogo from "@/components/BrandLogo";
import { asiaCopy } from "@/lib/asia-copy";
import { useQuote } from "@/components/QuoteRequest";
import { useAuth } from "@/lib/auth";
import { useIsAdmin } from "@/hooks/use-is-admin";

type Props = { homeLinks?: boolean };

const AccountMenu = ({ lang, onClose }: { lang: Lang; onClose?: () => void }) => {
  const { user, signOut } = useAuth();
  const c = (en: string, zh: string, ru: string, es?: string) => asiaCopy(lang, { en, zh, ru, es });
  const { isAdmin } = useIsAdmin();
  const initial = user?.email?.[0]?.toUpperCase() ?? user?.user_metadata?.display_name?.[0]?.toUpperCase() ?? "?";
  const label = user?.user_metadata?.display_name || user?.email || "";

  if (!user) return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" className="rounded-full px-4 h-9 text-sm font-medium hover:bg-muted/60">
        <Link to="/auth?tab=signin" onClick={onClose}>{c("Sign in", "登录", "Войти", "Iniciar sesión")}</Link>
      </Button>
      <Button asChild className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-4 h-9 text-sm font-medium shadow-soft">
        <Link to="/auth?tab=signup" onClick={onClose}>{c("Sign up", "注册", "Регистрация", "Registrarse")}</Link>
      </Button>
    </div>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full h-9 px-1.5 gap-2 hover:bg-muted/60" aria-label={c("Account menu", "账户菜单", "Меню аккаунта", "Menú de la cuenta")}>
          <Avatar className="size-7 bg-gradient-mint">
            <AvatarFallback className="text-xs font-semibold bg-gradient-mint text-foreground">{initial}</AvatarFallback>
          </Avatar>
          <span className="hidden lg:inline text-sm font-medium max-w-[120px] truncate">{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link to="/profile" onClick={onClose} className="cursor-pointer flex items-center gap-2">
            <User className="size-4" /> {c("Profile", "个人资料", "Профиль", "Perfil")}
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin/content" onClick={onClose} className="cursor-pointer flex items-center gap-2">
                <User className="size-4" /> {c("Content manager", "内容管理", "Управление контентом", "Gestor de contenido")}
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => { signOut(); onClose?.(); }} className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive">
          <LogOut className="size-4" /> {c("Sign out", "退出登录", "Выйти", "Cerrar sesión")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AsiaNavbar = ({ homeLinks = true }: Props) => {
  const { t, lang, setLang, currency, setCurrency } = useAsia();
  const { open } = useQuote();
  const { pathname } = useLocation();
  const c = (en: string, zh: string, ru: string, es?: string) => asiaCopy(lang, { en, zh, ru, es });
  const isActive = (to: string) => to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);
  const links = homeLinks
      ? [
        { to: "/", label: c("Home", "首页", "Главная", "Inicio") },
        { to: "/cases", label: t("nav.cases") },
        { to: "/before-after", label: c("Before & after", "术前术后", "До и после", "Antes y después") },
        { to: "/doctors", label: t("nav.compliance") },
        { to: "/treatments", label: t("nav.projects") },
        { to: "/travel-packages", label: c("Travel Support", "行程支持", "Поддержка поездки", "Apoyo de viaje") },
        { to: "/clinics", label: c("Clinics", "诊所", "Клиники", "Clínicas") },
        { to: "/cities", label: t("nav.cities") },
        { to: "/why-china", label: c("Why China", "为什么选中国", "Почему Китай", "Por qué China") },
        { to: "/about", label: c("About", "关于我们", "О нас", "Acerca de") },
        { to: "/provider-verification", label: c("Standards", "审核标准", "Стандарты", "Estándares") },
      ]
    : [
        { to: "/", label: c("Home", "首页", "Главная", "Inicio") },
        { to: "/cases", label: t("nav.cases") },
      ];
  const desktopLinks = links;
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[70]">
      <div className="h-12 border-b border-primary bg-primary text-primary-foreground shadow-sm md:h-9">
        <div className="container flex h-full items-center justify-between gap-3 text-xs">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-5">
            <a
              href="https://wa.me/14708613825?text=Hi%20CeladonChina%2C%20I%20would%20like%20to%20ask%20about%20your%20services."
              target="_blank"
              rel="noreferrer"
              aria-label="Contact CeladonChina on WhatsApp"
              className="inline-flex min-h-12 shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-2.5 font-bold tracking-[0.01em] text-white transition hover:bg-white/20 md:min-h-9"
            >
              <Phone className="size-3.5" />
              <span className="hidden sm:inline">+1 470 861 3825</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
            <a href="mailto:contact@celadonchina.com" className="hidden min-h-12 min-w-0 items-center gap-1.5 rounded-full px-2 font-semibold tracking-[0.01em] text-white/95 transition hover:bg-white/10 hover:text-white sm:inline-flex md:min-h-9">
              <Mail className="size-3.5 shrink-0" />
              <span className="hidden truncate sm:inline">contact@celadonchina.com</span>
            </a>
          </div>
          <button
            type="button"
            onClick={() => open({ source: "navbar_top" })}
            aria-label={c("Start a consultation", "开始咨询", "Начать консультацию", "Iniciar una consulta")}
            className="inline-flex min-h-12 shrink-0 items-center gap-1.5 rounded-full border border-white/35 bg-foreground/15 px-3 font-semibold text-white transition hover:bg-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-primary md:min-h-9"
          >
            <MessageCircle className="size-3.5" />
            <span>{c("Start a consultation", "开始咨询", "Начать консультацию", "Iniciar una consulta")}</span>
            <ArrowRight className="hidden size-3.5 sm:block" />
          </button>
        </div>
      </div>
      <header className="border-b border-border/60 bg-background/95 shadow-[0_4px_18px_rgba(16,42,36,0.04)] backdrop-blur-xl">
      <nav className="container flex h-[3.75rem] md:h-16 items-center justify-between gap-3">
        <Link to="/" className="flex min-h-12 shrink-0 items-center gap-2">
          <BrandLogo showTagline markClassName="size-8 md:size-9" textClassName="text-lg md:text-xl" />
        </Link>
        <div className="hidden 2xl:flex items-center gap-0.5 rounded-full bg-muted/60 p-1">
          {desktopLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              aria-current={isActive(l.to) ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-2 py-1.5 text-[12px] font-medium transition-all xl:px-3 xl:text-[13px] ${isActive(l.to) ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"}`}
            >{l.label}</Link>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="hidden 2xl:flex items-center gap-1.5">
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
          <div className="hidden 2xl:block">
            <AccountMenu lang={lang} />
          </div>
          <Button asChild variant="ghost" className="2xl:hidden rounded-full px-3 h-9 text-sm font-medium">
            <Link to="/auth?tab=signin">{c("Sign in", "登录", "Войти", "Iniciar sesión")}</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="size-12 rounded-full border border-primary/10 bg-card shadow-soft 2xl:hidden" aria-label={c("Open menu", "打开菜单", "Открыть меню", "Abrir menú")}>
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[88vw] max-w-sm p-0">
            <SheetHeader className="border-b p-5 pr-16 text-left">
              <SheetTitle><BrandLogo /></SheetTitle>
              <SheetDescription className="sr-only">
                {c("Site navigation and account settings", "网站导航与账户设置", "Навигация и настройки аккаунта", "Navegación del sitio y ajustes de la cuenta")}
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
              <div className="mt-3 grid grid-cols-2 gap-2">
                <AccountMenu lang={lang} />
              </div>
              <button
                type="button"
                onClick={() => open({ source: "mobile_navigation" })}
                className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <MessageCircle className="size-4" />
                {c("Start a consultation", "开始咨询", "Начать консультацию", "Iniciar una consulta")}
                <ArrowRight className="size-4" />
              </button>
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

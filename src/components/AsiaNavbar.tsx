import { Link, useLocation } from "react-router-dom";
import { DollarSign, Languages, Menu, ChevronRight, MessageCircle, ArrowRight, User, LogOut, Phone, Mail, CalendarDays } from "lucide-react";
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

const AsiaNavbar = () => {
  const { t, lang, setLang, currency, setCurrency } = useAsia();
  const { open } = useQuote();
  const { pathname } = useLocation();
  const c = (en: string, zh: string, ru: string, es?: string) => asiaCopy(lang, { en, zh, ru, es });
  const isActive = (to: string) => to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);
  const links = [
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
  ];
  const desktopLinks = links;
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[70]">
        <div className="hidden h-11 bg-gradient-to-r from-primary via-primary to-sky-700 text-primary-foreground xl:block">
          <div className="container flex h-full items-center justify-between gap-8 text-sm font-medium">
            <div className="flex items-center gap-6">
              <a href="https://wa.me/14708613825" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-white/95 transition hover:text-white">
                <Phone className="size-4" aria-hidden="true" />
                <span>+1 470 861 3825</span>
              </a>
              <span className="h-5 w-px bg-white/30" aria-hidden="true" />
              <a href="mailto:contact@celadonchina.com" className="inline-flex min-h-11 items-center gap-2 text-white/95 transition hover:text-white">
                <Mail className="size-4" aria-hidden="true" />
                <span>contact@celadonchina.com</span>
              </a>
            </div>
            <div className="flex items-center gap-1 text-white">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-white hover:bg-white/10 hover:text-white">
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
                <Button variant="ghost" size="sm" className="gap-1.5 text-white hover:bg-white/10 hover:text-white">
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
              <span className="mx-3 h-5 w-px bg-white/30" aria-hidden="true" />
              <AccountMenu lang={lang} />
            </div>
          </div>
        </div>
        <header className="border-b border-border/70 bg-background/95 shadow-[0_5px_18px_rgba(16,42,36,0.07)] backdrop-blur-xl">
          <nav className="container flex h-16 items-center gap-4 xl:h-[5.25rem]" aria-label={c("Primary navigation", "主导航", "Основная навигация", "Navegación principal")}>
            <Link to="/" className="flex min-h-12 shrink-0 items-center">
              <BrandLogo showTagline markClassName="size-8 xl:size-10" textClassName="text-lg xl:text-xl" />
            </Link>
            <div className="hidden min-w-0 flex-1 items-stretch justify-center self-stretch min-[1440px]:flex">
              {desktopLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  aria-current={isActive(l.to) ? "page" : undefined}
                  className={`relative flex items-center whitespace-nowrap px-2 text-[11px] font-semibold uppercase tracking-[0.025em] transition-colors 2xl:px-3 2xl:text-xs ${isActive(l.to) ? "text-primary" : "text-foreground/70 hover:text-primary"}`}
                >
                  {l.label}
                  {isActive(l.to) && <span className="absolute inset-x-2 bottom-0 h-1 rounded-t-full bg-primary 2xl:inset-x-3" aria-hidden="true" />}
                </Link>
              ))}
            </div>
            <button
              type="button"
              onClick={() => open({ source: "navbar_desktop" })}
              className="hidden min-h-12 shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-primary to-sky-700 px-5 text-sm font-semibold text-white shadow-[0_7px_16px_rgba(18,121,113,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_9px_20px_rgba(18,121,113,0.26)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-[1440px]:inline-flex 2xl:px-6"
            >
              <CalendarDays className="size-4" aria-hidden="true" />
              {c("Start a consultation", "开始咨询", "Начать консультацию", "Iniciar una consulta")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            <div className="ml-auto flex items-center gap-1.5 min-[1440px]:hidden">
          <Button asChild variant="ghost" className="rounded-full px-3 h-9 text-sm font-medium xl:hidden">
            <Link to="/auth?tab=signin">{c("Sign in", "登录", "Войти", "Iniciar sesión")}</Link>
          </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="size-12 rounded-full border border-primary/10 bg-card shadow-soft min-[1440px]:hidden" aria-label={c("Open menu", "打开菜单", "Открыть меню", "Abrir menú")}>
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
            </div>
          </nav>
        </header>
      </div>
      <div className="h-16 xl:h-32" aria-hidden="true" />
    </>
  );
};

export default AsiaNavbar;

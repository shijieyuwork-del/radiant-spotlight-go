import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DollarSign,
  Languages,
  Menu,
  ChevronRight,
  MessageCircle,
  ArrowRight,
  User,
  LogOut,
  CalendarDays,
  Heart,
  Search,
} from "lucide-react";
import { PROCEDURE_CATALOG, PROCEDURE_CATEGORIES, procedureSlug } from "@/data/procedureCatalog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAsia, asiaLangLabel as langLabel, type AsiaLang as Lang } from "@/lib/asia-i18n";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import BrandLogo from "@/components/BrandLogo";
import { asiaCopy } from "@/lib/asia-copy";
import { useQuote } from "@/components/QuoteRequest";
import { useAuth } from "@/lib/auth";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { getSavedCasesCopy } from "@/lib/saved-cases-copy";

const AccountMenu = ({ lang, onClose, dark = false }: { lang: Lang; onClose?: () => void; dark?: boolean }) => {
  const { user, signOut } = useAuth();
  const c = (en: string, zh: string, ru: string, es?: string) => asiaCopy(lang, { en, zh, ru, es });
  const { isAdmin } = useIsAdmin();
  const initial = user?.email?.[0]?.toUpperCase() ?? user?.user_metadata?.display_name?.[0]?.toUpperCase() ?? "?";
  const label = user?.user_metadata?.display_name || user?.email || "";

  if (!user)
    return (
      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="ghost"
          className={
            dark
              ? "h-8 rounded-full px-3 text-xs font-medium text-[#DCE9E3] hover:bg-white/10 hover:text-white"
              : "rounded-full px-4 h-9 text-sm font-medium hover:bg-muted/60"
          }
        >
          <Link to="/auth?tab=signin" onClick={onClose}>
            {c("Sign in", "登录", "Войти", "Iniciar sesión")}
          </Link>
        </Button>
        <Button
          asChild
          className={
            dark
              ? "h-8 rounded-full bg-white/15 px-3 text-xs font-medium text-white hover:bg-white/25"
              : "rounded-full bg-foreground text-background hover:bg-foreground/90 px-4 h-9 text-sm font-medium shadow-soft"
          }
        >
          <Link to="/auth?tab=signup" onClick={onClose}>
            {c("Sign up", "注册", "Регистрация", "Registrarse")}
          </Link>
        </Button>
      </div>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={
            dark
              ? "h-8 gap-2 rounded-full px-1.5 text-[#DCE9E3] hover:bg-white/10 hover:text-white"
              : "rounded-full h-9 px-1.5 gap-2 hover:bg-muted/60"
          }
          aria-label={c("Account menu", "账户菜单", "Меню аккаунта", "Menú de la cuenta")}
        >
          <Avatar className="size-7 bg-gradient-mint">
            <AvatarFallback className="text-xs font-semibold bg-gradient-mint text-foreground">
              {initial}
            </AvatarFallback>
          </Avatar>
          <span className="hidden lg:inline text-sm font-medium max-w-[120px] truncate">{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link to="/saved" onClick={onClose} className="cursor-pointer flex items-center gap-2">
            <Heart className="size-4" /> {getSavedCasesCopy(lang).title}
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin/content" onClick={onClose} className="cursor-pointer flex items-center gap-2">
                <User className="size-4" />{" "}
                {c("Content manager", "内容管理", "Управление контентом", "Gestor de contenido")}
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut();
            onClose?.();
          }}
          className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" /> {c("Sign out", "退出登录", "Выйти", "Cerrar sesión")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AsiaNavbar = ({ floating = false }: { floating?: boolean }) => {
  const { t, lang, setLang, currency, setCurrency } = useAsia();
  const { open } = useQuote();
  const { pathname } = useLocation();
  const c = (en: string, zh: string, ru: string, es?: string) => asiaCopy(lang, { en, zh, ru, es });
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`));
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;
    const n = q.toLowerCase();
    const procedure =
      PROCEDURE_CATALOG.find((p) => p.en.toLowerCase() === n || p.zh === q || p.slug === n) ??
      (n.length >= 4 ? PROCEDURE_CATALOG.find((p) => p.en.toLowerCase().includes(n)) : undefined);
    if (procedure) navigate(`/treatments/${procedure.slug}`);
    else if (/hospital|clinic|医院|诊所/i.test(q)) navigate(`/clinics?q=${encodeURIComponent(q)}`);
    else navigate(`/doctors?q=${encodeURIComponent(q)}`);
    setQuery("");
    setMenuOpen(false);
  };
  const categoryLabels: Record<string, [string, string, string, string]> = {
    Nose: ["Nose", "鼻部", "Нос", "Nariz"],
    Eyes: ["Eyes", "眼部", "Глаза", "Ojos"],
    "Face & Contour": ["Face & contour", "面部轮廓", "Контур лица", "Rostro"],
    "Facial Rejuvenation": ["Rejuvenation", "年轻化", "Омоложение", "Rejuvenecimiento"],
    Breast: ["Breast", "胸部", "Грудь", "Pecho"],
    "Body Contouring": ["Body", "身体", "Тело", "Cuerpo"],
    "Hair Restoration": ["Hair", "植发", "Волосы", "Cabello"],
    "Cosmetic Dentistry": ["Dental", "牙齿", "Зубы", "Dental"],
    "Skin & Non-Surgical": ["Skin", "皮肤", "Кожа", "Piel"],
  };
  const categoryTabs = PROCEDURE_CATEGORIES.map((category) => {
    const [en, zh, ru, es] = categoryLabels[category.en] ?? [category.en, category.zh, category.en, category.en];
    const items = category.items.map(([itemEn, itemZh]) => ({
      to: `/treatments/${procedureSlug(itemEn)}`,
      label: lang === "zh" ? itemZh : itemEn,
    }));
    return {
      key: category.en,
      label: c(en, zh, ru, es),
      to: items[0].to,
      items,
      active: items.some((item) => pathname === item.to || pathname.startsWith(`${item.to}/`)),
    };
  });
  const sectionTabs = [
    { to: "/doctors", label: c("Surgeons", "专家", "Эксперты", "Cirujanos") },
    { to: "/clinics", label: c("Hospitals", "医院", "Клиники", "Hospitales") },
    { to: "/before-after", label: c("Before & after", "术前术后", "До и после", "Antes y después") },
    { to: "/cases", label: c("Patient diaries", "患者日记", "Дневники пациентов", "Diarios de pacientes") },
    { to: "/travel-packages", label: c("Your journey", "行程支持", "Ваша поездка", "Tu viaje") },
  ];
  const stripLinks = [
    { to: "/contact", label: c("For hospitals", "医院合作", "Клиникам", "Para hospitales") },
    { to: "/international-patients", label: lang === "vi" ? "Hướng dẫn" : c("Guides", "指南", "Гиды", "Guías") },
    { to: "/cities", label: t("nav.cities") },
    { to: "/why-china", label: c("Why China", "为什么选中国", "Почему Китай", "Por qué China") },
    { to: "/about", label: c("About", "关于我们", "О нас", "Acerca de") },
  ];
  const tabClass = (active: boolean) =>
    `relative inline-flex h-11 shrink-0 items-center whitespace-nowrap border-b-2 text-sm font-medium transition-colors ${active ? "border-primary text-brand" : "border-transparent text-[#4A645B] hover:text-brand"}`;
  const links = [
    { to: "/", label: c("Home", "首页", "Главная", "Inicio") },
    { to: "/doctors", label: c("Surgeons", "专家", "Эксперты", "Cirujanos") },
    { to: "/clinics", label: c("Hospitals", "医院", "Клиники", "Hospitales") },
    { to: "/treatments", label: t("nav.projects") },
    { to: "/before-after", label: c("Before & after", "术前术后", "До и после", "Antes y después") },
    { to: "/cases", label: t("nav.cases") },
    {
      to: "/travel-packages",
      label: asiaCopy(lang, {
        en: "Travel support",
        zh: "行程支持",
        ru: "Поддержка поездки",
        es: "Apoyo de viaje",
        th: "สนับสนุนการเดินทาง",
        ms: "Sokongan Perjalanan",
      }),
    },
    {
      to: "/international-patients",
      label:
        lang === "vi"
          ? "Hướng dẫn quốc tế"
          : c("Visitor guides", "国际访客指南", "Иностранным посетителям", "Guías para visitantes"),
    },
    { to: "/cities", label: t("nav.cities") },
    { to: "/why-china", label: c("Why China", "为什么选中国", "Почему Китай", "Por qué China") },
    { to: "/about", label: c("About", "关于我们", "О нас", "Acerca de") },
    { to: "/provider-verification", label: c("Standards", "审核标准", "Стандарты", "Estándares") },
  ];
  return (
    <>
      <div className={`fixed inset-x-0 top-0 z-[70] ${floating ? "home-floating-nav" : ""}`}>
        <div className="nav-contact-strip hidden h-10 bg-[#173B30] text-xs text-[#DCE9E3] xl:block">
          <div className="container flex h-full items-center justify-between gap-6">
            <p className="min-w-0 truncate">
              <strong className="font-semibold text-white">
                {c(
                  "Free: your first 2 hotel nights in China*",
                  "符合条件的行程：首两晚酒店由我们承担*",
                  "Бесплатно: первые 2 ночи в отеле в Китае*",
                  "Gratis: tus 2 primeras noches de hotel en China*",
                )}
              </strong>
              <span>
                {" "}
                · {c("Airport pickup", "机场接送", "Трансфер из аэропорта", "Recogida en el aeropuerto")} ·{" "}
                {c(
                  "Free initial conversation",
                  "免费初步沟通",
                  "Бесплатная первая беседа",
                  "Primera conversación gratuita",
                )}
              </span>
            </p>
            <div className="flex shrink-0 items-center gap-1">
              <div className="mr-2 flex items-center gap-5">
                {stripLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    aria-current={isActive(l.to) ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className="whitespace-nowrap text-[#DCE9E3] transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 px-2 text-xs text-[#DCE9E3] hover:bg-white/10 hover:text-white"
                  >
                    <DollarSign className="size-3.5" /> {currency}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl">
                  <DropdownMenuItem onClick={() => setCurrency("USD")} className="rounded-xl">
                    🇺🇸 USD ($)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrency("CNY")} className="rounded-xl">
                    🇨🇳 CNY (¥)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 px-2 text-xs text-[#DCE9E3] hover:bg-white/10 hover:text-white"
                  >
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
              <span className="mx-2 h-4 w-px bg-white/20" aria-hidden="true" />
              <Link
                to="/saved"
                aria-current={pathname === "/saved" ? "page" : undefined}
                className="inline-flex h-8 items-center gap-1.5 px-2 font-medium text-[#DCE9E3] transition-colors hover:text-white"
              >
                <Heart className="size-3.5" aria-hidden="true" />
                {getSavedCasesCopy(lang).title}
              </Link>
              <AccountMenu lang={lang} dark />
            </div>
          </div>
        </div>
        <header className="border-b border-border/70 bg-background/95 shadow-[0_5px_18px_rgba(16,42,36,0.07)] backdrop-blur-xl">
          <nav
            className="container flex h-16 items-center gap-4 xl:h-[4.75rem] xl:gap-7"
            aria-label={c("Primary navigation", "主导航", "Основная навигация", "Navegación principal")}
          >
            <Link to="/" className="flex min-h-12 shrink-0 items-center">
              <BrandLogo markClassName="size-8 xl:size-10" textClassName="text-lg xl:text-xl" />
            </Link>
            <form
              role="search"
              onSubmit={submitSearch}
              className="hidden h-12 min-w-0 flex-1 items-center overflow-hidden rounded-full border-[1.5px] border-primary bg-background xl:flex"
            >
              <label className="flex min-w-0 flex-1 items-center gap-2.5 px-[1.125rem] text-muted-foreground">
                <Search className="size-[1.125rem] shrink-0" aria-hidden="true" />
                <span className="sr-only">{c("Search", "搜索", "Поиск", "Buscar")}</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={c(
                    `Search 100+ surgeons, 60+ hospitals, ${PROCEDURE_CATALOG.length} procedures`,
                    `搜索 100+ 位专家、60+ 家医院、${PROCEDURE_CATALOG.length} 个项目`,
                    `Поиск: 100+ экспертов, 60+ клиник, ${PROCEDURE_CATALOG.length} процедур`,
                    `Busca entre 100+ cirujanos, 60+ hospitales y ${PROCEDURE_CATALOG.length} procedimientos`,
                  )}
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </label>
              <button
                type="submit"
                className="h-full shrink-0 bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {c("Search", "搜索", "Найти", "Buscar")}
              </button>
            </form>
            <button
              type="button"
              onClick={() => open({ source: "navbar_desktop" })}
              className="cta-primary hidden min-h-12 max-w-60 shrink-0 items-center justify-center gap-2 whitespace-normal rounded-full px-5 py-2 text-center text-sm font-semibold leading-snug text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 xl:inline-flex 2xl:px-6"
            >
              <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
              <span>{t("hero.cta")}</span>
              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </button>
            <div className="ml-auto flex shrink-0 items-center gap-1.5 xl:hidden">
              <button
                type="button"
                onClick={() => open({ source: "navbar_mobile" })}
                className="cta-primary inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-full px-3.5 text-[13px] font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 max-[359px]:hidden sm:hidden"
              >
                {c("Get quote", "获取报价", "Расчёт", "Cotizar")}
              </button>
              <Button
                asChild
                variant="ghost"
                className="hidden min-h-11 min-w-11 rounded-full px-3 text-sm font-medium sm:inline-flex xl:hidden"
              >
                <Link
                  to="/saved"
                  aria-label={getSavedCasesCopy(lang).title}
                  aria-current={pathname === "/saved" ? "page" : undefined}
                >
                  <Heart className="size-5" aria-hidden="true" />
                  <span className="sr-only sm:not-sr-only sm:ml-2">{getSavedCasesCopy(lang).title}</span>
                </Link>
              </Button>

              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-12 rounded-full border border-primary/10 bg-card shadow-soft xl:hidden"
                    aria-label={c("Open menu", "打开菜单", "Открыть меню", "Abrir menú")}
                  >
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[88vw] max-w-sm p-0"
                  onOpenAutoFocus={(event) => event.preventDefault()}
                >
                  <SheetHeader className="border-b p-5 pr-16 text-left">
                    <SheetTitle>
                      <BrandLogo />
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                      {c(
                        "Site navigation and account settings",
                        "网站导航与账户设置",
                        "Навигация и настройки аккаунта",
                        "Navegación del sitio y ajustes de la cuenta",
                      )}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex h-[calc(100%-73px)] flex-col overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                    <form
                      role="search"
                      onSubmit={submitSearch}
                      className="mb-4 flex h-12 shrink-0 items-center gap-2 rounded-full border-[1.5px] border-primary bg-background pl-4 pr-1.5"
                    >
                      <Search className="size-[1.125rem] shrink-0 text-muted-foreground" aria-hidden="true" />
                      <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        aria-label={c("Search", "搜索", "Поиск", "Buscar")}
                        placeholder={c(
                          "Surgeon or procedure",
                          "搜索专家、医院或项目",
                          "Эксперт, клиника или процедура",
                          "Cirujano, hospital o procedimiento",
                        )}
                        className="min-w-0 flex-1 border-0 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                      />
                      <button
                        type="submit"
                        className="h-9 shrink-0 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
                      >
                        {c("Search", "搜索", "Найти", "Buscar")}
                      </button>
                    </form>
                    <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {c("Browse by area", "按部位浏览", "По зонам", "Por zona")}
                    </p>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {categoryTabs.map((tab) => (
                        <Link
                          key={tab.key}
                          to={tab.to}
                          onClick={() => setMenuOpen(false)}
                          className="inline-flex min-h-10 items-center rounded-full border border-border bg-card px-3.5 text-sm font-medium"
                        >
                          {tab.label}
                        </Link>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <SheetClose asChild>
                        <Link
                          to="/saved"
                          aria-current={pathname === "/saved" ? "page" : undefined}
                          className="flex min-h-12 items-center gap-2 rounded-2xl px-4 text-base font-semibold hover:bg-muted"
                        >
                          <Heart className="size-4" aria-hidden="true" />
                          {getSavedCasesCopy(lang).title}
                        </Link>
                      </SheetClose>
                      {links.map((l) => (
                        <Link
                          key={l.to}
                          to={l.to}
                          aria-current={isActive(l.to) ? "page" : undefined}
                          onClick={() => setMenuOpen(false)}
                          className={`flex min-h-12 items-center justify-between rounded-2xl px-4 text-base font-semibold transition-colors ${
                            isActive(l.to) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                          }`}
                        >
                          {l.label}
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-5 pt-5 border-t">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="h-12 rounded-2xl">
                            <DollarSign className="size-4 mr-1" />
                            {currency}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl">
                          <DropdownMenuItem onClick={() => setCurrency("USD")}>🇺🇸 USD ($)</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setCurrency("CNY")}>🇨🇳 CNY (¥)</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="h-12 rounded-2xl">
                            <Languages className="size-4 mr-1" />
                            {langLabel[lang].flag} {langLabel[lang].label}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl">
                          {(Object.keys(langLabel) as Lang[]).map((l) => (
                            <DropdownMenuItem key={l} onClick={() => setLang(l)}>
                              {langLabel[l].flag} {langLabel[l].label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <AccountMenu lang={lang} />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        open({ source: "mobile_navigation" });
                      }}
                      className="cta-primary mt-3 flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-center text-sm font-semibold leading-snug text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
                      <span>{t("hero.cta")}</span>
                      <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
          <nav
            className="container hidden h-11 items-center gap-4 xl:flex 2xl:gap-6"
            aria-label={c("Categories", "项目分类", "Категории", "Categorías")}
          >
            <Link to="/" aria-current={pathname === "/" ? "page" : undefined} className={tabClass(pathname === "/")}>
              {c("Home", "首页", "Главная", "Inicio")}
            </Link>
            {categoryTabs.map((tab) => (
              <div key={tab.key} className="group relative flex h-11 shrink-0 items-center">
                <Link to={tab.to} className={tabClass(tab.active)}>
                  {tab.label}
                </Link>
                <div className="invisible absolute left-0 top-full z-10 w-64 translate-y-1 rounded-2xl border border-border bg-card p-2 opacity-0 shadow-pop transition duration-150 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {tab.items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={(event) => event.currentTarget.blur()}
                      className={`block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted ${pathname === item.to ? "font-semibold text-brand" : "text-foreground"}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    to="/treatments"
                    onClick={(event) => event.currentTarget.blur()}
                    className="mt-1 block rounded-lg border-t border-border px-3 py-2 text-sm font-semibold text-brand hover:bg-muted"
                  >
                    {c("All procedures", "全部项目", "Все процедуры", "Todos los procedimientos")}
                  </Link>
                </div>
              </div>
            ))}
            <span className="h-4 w-px shrink-0 bg-border" aria-hidden="true" />
            {sectionTabs.map((tab) => (
              <Link
                key={tab.to}
                to={tab.to}
                aria-current={isActive(tab.to) ? "page" : undefined}
                className={tabClass(isActive(tab.to))}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </header>
      </div>
      {!floating && <div className="h-16 xl:h-40" aria-hidden="true" />}
    </>
  );
};

export default AsiaNavbar;

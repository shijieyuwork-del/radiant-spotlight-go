import { Link, useLocation } from "react-router-dom";
import { DollarSign, Languages, Menu, ChevronRight, ChevronDown, Phone, Mail, MessageCircle, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAsia, asiaLangLabel as langLabel, type AsiaLang as Lang } from "@/lib/asia-i18n";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import BrandLogo from "@/components/BrandLogo";
import { asiaCopy } from "@/lib/asia-copy";
import { DEMO_CHINA_DOCTORS } from "@/data/demoChinaDoctors";
import { useQuote } from "@/components/QuoteRequest";

type Props = { homeLinks?: boolean };

type MegaMenuGroup = {
  title: string;
  links: { label: string; to: string }[];
};

type MegaNavItemProps = {
  active: boolean;
  featuredDoctors?: {
    city: string;
    id: string;
    name: string;
    photo: string;
    profileLabel: string;
    sampleLabel: string;
    specialties: string[];
    title: string;
  }[];
  intro: string;
  label: string;
  groups: MegaMenuGroup[];
  to: string;
  viewAll: string;
};

const MegaNavItem = ({ active, featuredDoctors, intro, label, groups, to, viewAll }: MegaNavItemProps) => (
  <div className="group/mega flex h-16 items-center">
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] font-medium transition-all xl:px-4 xl:text-sm ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
      }`}
    >
      {label}<ChevronDown className="size-3.5 transition-transform duration-200 group-hover/mega:rotate-180" />
    </Link>

    <div className="invisible fixed inset-x-0 top-16 z-[65] translate-y-1 border-t border-border bg-card text-foreground opacity-0 shadow-[0_24px_50px_rgba(16,42,36,0.10)] transition-[opacity,transform,visibility] duration-200 group-hover/mega:visible group-hover/mega:translate-y-0 group-hover/mega:opacity-100 group-focus-within/mega:visible group-focus-within/mega:translate-y-0 group-focus-within/mega:opacity-100">
      <div className={`container grid min-h-[310px] py-8 ${featuredDoctors ? "grid-cols-[0.58fr_2.42fr]" : "grid-cols-[0.72fr_repeat(3,1fr)]"}`}>
        <div className="flex flex-col border-r border-border pr-8">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">{label}</span>
          <p className="mt-4 max-w-[15rem] font-display text-3xl font-medium leading-tight text-foreground">{intro}</p>
          <Link to={to} className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3">
            {viewAll}<ArrowRight className="size-4" />
          </Link>
        </div>
        {featuredDoctors ? (
          <div className="pl-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="text-sm font-semibold text-foreground">{label}</h3>
              <Link to={to} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-primary hover:underline">
                {viewAll}<ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {featuredDoctors.map((doctor) => (
                <Link key={doctor.id} to={`/doctors/demo/${doctor.id}`} className="group/doctor min-w-0 border border-border bg-background p-2.5 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img src={doctor.photo} alt={doctor.name} className="size-full object-cover transition-transform duration-300 group-hover/doctor:scale-[1.03]" />
                    <span className="absolute bottom-2 left-2 rounded-full bg-card/90 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-foreground backdrop-blur-sm">{doctor.sampleLabel}</span>
                  </div>
                  <h4 className="mt-3 truncate font-display text-lg font-medium text-foreground">{doctor.name}</h4>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{doctor.title}</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground/80"><MapPin className="size-3 text-primary" />{doctor.city}</p>
                  <p className="mt-2 line-clamp-1 text-[10px] font-medium leading-relaxed text-foreground/70">{doctor.specialties.slice(0, 2).join(" · ")}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                    {doctor.profileLabel}<ArrowRight className="size-3 transition-transform group-hover/doctor:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : groups.slice(0, 3).map((group) => (
          <div key={group.title} className="border-r border-border px-8 last:border-r-0">
            <h3 className="border-b border-border pb-4 text-sm font-semibold text-foreground">{group.title}</h3>
            <ul className="mt-2">
              {group.links.map((item) => (
                <li key={`${group.title}-${item.label}`} className="border-b border-border/70 last:border-0">
                  <Link to={item.to} className="group/link flex min-h-12 items-center justify-between gap-3 text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none">
                    <span>{item.label}</span><ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover/link:translate-x-0 group-hover/link:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AsiaNavbar = ({ homeLinks = true }: Props) => {
  const { t, lang, setLang, currency, setCurrency } = useAsia();
  const { open } = useQuote();
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
        { to: "/about", label: c("About", "关于我们", "О нас") },
        { to: "/provider-verification", label: c("Standards", "审核标准", "Стандарты") },
      ]
    : [
        { to: "/", label: c("Home", "首页", "Главная") },
        { to: "/cases", label: t("nav.cases") },
      ];
  const desktopLinks = homeLinks
    ? links.filter((link) => ["/", "/treatments", "/cases", "/doctors", "/travel-packages"].includes(link.to))
    : links;
  const moreLinks = homeLinks
    ? links.filter((link) => ["/cities", "/why-china", "/about", "/provider-verification"].includes(link.to))
    : [];
  const featuredDoctors = DEMO_CHINA_DOCTORS.map((doctor) => ({
    city: doctor.city,
    id: doctor.id,
    name: doctor.name,
    photo: doctor.photo,
    profileLabel: c("View profile", "查看资料", "Профиль"),
    sampleLabel: c("Sample", "示例", "Пример"),
    specialties: doctor.specialties,
    title: doctor.title,
  }));
  const megaMenus: Record<string, { featuredDoctors?: typeof featuredDoctors; intro: string; viewAll: string; groups: MegaMenuGroup[] }> = {
    "/cases": {
      intro: c("Real recovery, organized around your questions.", "按你的关注点，查看真实恢复历程。", "Реальное восстановление — по вашим вопросам."),
      viewAll: c("View all diaries", "查看全部日记", "Все дневники"),
      groups: [
        { title: c("Face & eyes", "面部与眼部", "Лицо и глаза"), links: [
          { label: c("Rhinoplasty", "鼻综合", "Ринопластика"), to: "/cases?treatment=Rhinoplasty" },
          { label: c("Blepharoplasty", "眼睑整形", "Блефаропластика"), to: "/cases?treatment=Blepharoplasty" },
          { label: c("Facelift", "面部提升", "Подтяжка лица"), to: "/cases?treatment=Facelift" },
        ] },
        { title: c("Body & breast", "身体与胸部", "Тело и грудь"), links: [
          { label: c("Liposuction", "吸脂塑形", "Липосакция"), to: "/cases?treatment=Liposuction" },
          { label: c("Tummy tuck", "腹壁整形", "Абдоминопластика"), to: "/cases?treatment=Tummy%20Tuck" },
          { label: c("Breast augmentation", "隆胸", "Увеличение груди"), to: "/cases?treatment=Breast%20Augmentation" },
        ] },
        { title: c("Browse the journey", "按历程浏览", "Этапы восстановления"), links: [
          { label: c("Consultation", "面诊阶段", "Консультация"), to: "/cases?stage=Consultation" },
          { label: c("First month", "术后首月", "Первый месяц"), to: "/cases?stage=Month%201" },
          { label: c("Final results", "最终效果", "Итоговый результат"), to: "/cases?stage=Final%20result" },
        ] },
      ],
    },
    "/doctors": {
      featuredDoctors,
      intro: c("Compare published expert information before you decide.", "决定之前，先比较公开的专家资料。", "Сравните опубликованные профили экспертов."),
      viewAll: c("View all experts", "查看全部专家", "Все эксперты"),
      groups: [
        { title: c("China", "中国", "Китай"), links: [
          { label: c("Shanghai experts", "上海专家", "Эксперты Шанхая"), to: "/doctors?city=Shanghai" },
          { label: c("Beijing experts", "北京专家", "Эксперты Пекина"), to: "/doctors?city=Beijing" },
          { label: c("Guangzhou experts", "广州专家", "Эксперты Гуанчжоу"), to: "/doctors?city=Guangzhou" },
        ] },
        { title: c("Popular specialties", "热门专长", "Популярные направления"), links: [
          { label: c("Nose specialists", "鼻部专家", "Ринопластика"), to: "/doctors?q=Rhinoplasty" },
          { label: c("Eye specialists", "眼部专家", "Пластика век"), to: "/doctors?q=Blepharoplasty" },
          { label: c("Facelift specialists", "面部提升专家", "Подтяжка лица"), to: "/doctors?q=Facelift" },
        ] },
        { title: c("Before you choose", "选择之前", "Перед выбором"), links: [
          { label: c("How profiles are reviewed", "专家资料审核方式", "Как проверяются профили"), to: "/provider-verification" },
          { label: c("Patient recovery diaries", "患者恢复日记", "Дневники пациентов"), to: "/cases" },
          { label: c("Get matching guidance", "获取匹配建议", "Помощь с подбором"), to: "/doctors" },
        ] },
      ],
    },
    "/treatments": {
      intro: c("Explore procedures by the change you are considering.", "按你想改善的方向，了解相关项目。", "Изучите процедуры по желаемому результату."),
      viewAll: c("View all procedures", "查看全部项目", "Все процедуры"),
      groups: [
        { title: c("Face & eyes", "面部与眼部", "Лицо и глаза"), links: [
          { label: c("Rhinoplasty", "鼻综合", "Ринопластика"), to: "/treatments/rhinoplasty" },
          { label: c("Double eyelid surgery", "双眼皮", "Пластика век"), to: "/treatments/double-eyelid-surgery" },
          { label: c("Facelift", "面部提升", "Подтяжка лица"), to: "/treatments/facelift" },
        ] },
        { title: c("Body & breast", "身体与胸部", "Тело и грудь"), links: [
          { label: c("Liposuction", "吸脂塑形", "Липосакция"), to: "/treatments/liposuction" },
          { label: c("Tummy tuck", "腹壁整形", "Абдоминопластика"), to: "/treatments/tummy-tuck" },
          { label: c("Breast augmentation", "隆胸", "Увеличение груди"), to: "/treatments/breast-augmentation" },
        ] },
        { title: c("Skin, hair & smile", "皮肤、毛发与牙齿", "Кожа, волосы и улыбка"), links: [
          { label: c("Skin treatments", "皮肤治疗", "Процедуры для кожи"), to: "/treatments/laser-skin-resurfacing" },
          { label: c("Hair transplant", "植发", "Пересадка волос"), to: "/treatments/fue-hair-transplant" },
          { label: c("Dental veneers", "牙齿贴面", "Виниры"), to: "/treatments/porcelain-veneers" },
        ] },
      ],
    },
    "/travel-packages": {
      intro: c("Plan the practical side of receiving care in China.", "把赴华就医中的实际安排提前规划清楚。", "Спланируйте практическую часть лечения в Китае."),
      viewAll: c("View travel support", "查看行程支持", "Поддержка поездки"),
      groups: [
        { title: c("Before departure", "出发之前", "До поездки"), links: [
          { label: c("Appointment coordination", "预约协调", "Координация записи"), to: "/travel-packages" },
          { label: c("Travel & visa planning", "行程与签证规划", "Поездка и виза"), to: "/travel-packages" },
          { label: c("Medical record translation", "病历翻译", "Перевод меддокументов"), to: "/travel-packages" },
        ] },
        { title: c("In China", "抵达中国后", "В Китае"), links: [
          { label: c("Airport pickup", "机场接送", "Трансфер из аэропорта"), to: "/travel-packages" },
          { label: c("In-clinic translation", "院内翻译", "Перевод в клинике"), to: "/travel-packages" },
          { label: c("Accommodation guidance", "住宿建议", "Подбор проживания"), to: "/travel-packages" },
        ] },
        { title: c("Plan your destination", "选择目的地", "Выберите направление"), links: [
          { label: c("Why China", "为什么选中国", "Почему Китай"), to: "/why-china" },
          { label: c("Shanghai", "上海", "Шанхай"), to: "/cities/shanghai" },
          { label: c("Beijing", "北京", "Пекин"), to: "/cities/beijing" },
        ] },
      ],
    },
  };
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
          <button
            type="button"
            onClick={() => open({ source: "navbar_top" })}
            aria-label={c("Start a consultation", "开始咨询", "Начать консультацию")}
            className="inline-flex min-h-12 shrink-0 items-center gap-1.5 rounded-full border border-white/35 bg-foreground/15 px-3 font-semibold text-white transition hover:bg-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-primary md:min-h-9"
          >
            <MessageCircle className="size-3.5" />
            <span>{c("Start a consultation", "开始咨询", "Начать консультацию")}</span>
            <ArrowRight className="hidden size-3.5 sm:block" />
          </button>
        </div>
      </div>
      <header className="border-b border-border/60 bg-background/95 shadow-[0_4px_18px_rgba(16,42,36,0.04)] backdrop-blur-xl">
      <nav className="container flex h-[3.75rem] md:h-16 items-center justify-between gap-3">
        <Link to="/" className="flex min-h-12 shrink-0 items-center gap-2">
          <BrandLogo markClassName="size-8 md:size-9" textClassName="text-lg md:text-xl" />
        </Link>
        <div className="hidden md:flex items-center gap-0.5 rounded-full bg-muted/60 p-1">
          {desktopLinks.map((l) => megaMenus[l.to] ? (
            <MegaNavItem
              key={l.to}
              active={isActive(l.to)}
              label={l.label}
              to={l.to}
              intro={megaMenus[l.to].intro}
              viewAll={megaMenus[l.to].viewAll}
              groups={megaMenus[l.to].groups}
              featuredDoctors={megaMenus[l.to].featuredDoctors}
            />
          ) : (
            <Link
              key={l.to}
              to={l.to}
              aria-current={isActive(l.to) ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] font-medium transition-all xl:px-4 xl:text-sm ${isActive(l.to) ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"}`}
            >{l.label}</Link>
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
              <button
                type="button"
                onClick={() => open({ source: "mobile_navigation" })}
                className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <MessageCircle className="size-4" />
                {c("Start a consultation", "开始咨询", "Начать консультацию")}
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

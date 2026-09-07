import { useEffect, type ReactNode } from "react";
import { BookOpenText, Building2, Compass, Home, MapPinned, Stethoscope } from "lucide-react";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor, type PluginListenerHandle } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PageMeta from "@/components/PageMeta";
import { asiaLangLabel, useAsia, type AsiaLang } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";
import { CarePlanProvider } from "./CarePlanContext";
import InstallAppButton from "./InstallAppButton";
import AppClinics from "./screens/AppClinics";
import AppDiaries from "./screens/AppDiaries";
import AppExperts from "./screens/AppExperts";
import AppHome from "./screens/AppHome";
import AppPlan from "./screens/AppPlan";
import type { AppSection } from "./types";
import { tapFeedback } from "./native";

const sectionFromPath = (pathname: string): AppSection => {
  const section = pathname.split("/")[2] as AppSection | undefined;
  return ["experts", "clinics", "diaries", "plan"].includes(section ?? "") ? section as AppSection : "home";
};

const MobileApp = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { lang, setLang } = useAsia();
  const c = <T,>(en: T, zh: T, ru: T, es?: T) => asiaCopy(lang, { en, zh, ru, es });
  const section = sectionFromPath(pathname);
  const screens: Record<AppSection, ReactNode> = {
    home: <AppHome />,
    experts: <AppExperts />,
    clinics: <AppClinics />,
    diaries: <AppDiaries />,
    plan: <AppPlan />,
  };
  const nav = [
    { id: "home" as const, icon: Home, label: c("Home", "首页", "Главная", "Inicio"), to: "/app" },
    { id: "experts" as const, icon: Stethoscope, label: c("Experts", "专家", "Эксперты", "Expertos"), to: "/app/experts" },
    { id: "clinics" as const, icon: Building2, label: c("Clinics", "诊所", "Клиники", "Clínicas"), to: "/app/clinics" },
    { id: "diaries" as const, icon: BookOpenText, label: c("Diaries", "日记", "Истории", "Diarios"), to: "/app/diaries" },
    { id: "plan" as const, icon: MapPinned, label: c("My plan", "行程", "Мой план", "Mi plan"), to: "/app/plan" },
  ];

  useEffect(() => {
    document.body.classList.add("ca-mobile-app");
    return () => document.body.classList.remove("ca-mobile-app");
  }, []);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    void (async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: "#fbfaf5" });
        await StatusBar.setOverlaysWebView({ overlay: false });
        await SplashScreen.hide();
      } catch {
        // Some status-bar controls are unavailable on newer platform versions.
      }
    })();

    let backHandle: PluginListenerHandle | undefined;
    void CapacitorApp.addListener("backButton", () => {
      if (pathname !== "/app") navigate(-1);
      else void CapacitorApp.exitApp();
    }).then((handle) => {
      backHandle = handle;
    }).catch(() => undefined);

    return () => {
      void backHandle?.remove();
    };
  }, [navigate, pathname]);

  return (
    <CarePlanProvider>
      <PageMeta title="Cosmetics Asia App" description="A mobile companion for comparing published expert information, browsing clinic directories and organizing a cosmetic care journey in Asia." path="/app" robots="noindex, follow" />
      <div className="mobile-app-stage min-h-[100dvh] bg-[hsl(150,18%,90%)] text-foreground lg:grid lg:place-items-center lg:px-6 lg:py-4">
        <div className="mx-auto lg:grid lg:h-[calc(100dvh-2rem)] lg:max-h-[920px] lg:w-full lg:max-w-5xl lg:grid-cols-[1fr_430px] lg:items-center lg:gap-12">
          <aside className="hidden lg:flex lg:h-full lg:flex-col lg:justify-between lg:py-12">
            <div>
              <Link to="/" className="inline-flex items-center gap-3 text-sm font-semibold"><span className="grid size-10 place-items-center rounded-full bg-foreground text-lg font-display text-background">CA</span>Cosmetics Asia</Link>
              <p className="mt-20 text-[11px] font-bold uppercase tracking-[.18em] text-primary">{c("Private care companion", "私人医美行程助手", "Персональный помощник", "Asistente privado")}</p>
              <h2 className="mt-4 max-w-lg font-display text-6xl leading-[.92] tracking-[-.05em]">{c("Everything you need, without the noise.", "需要的一切，清晰而从容。", "Всё нужное. Ничего лишнего.", "Todo lo que necesitas, sin ruido.")}</h2>
              <p className="mt-6 max-w-md text-base leading-7 text-foreground/65">{c("Compare published information, keep your preparation organized and stay close to your coordinator from first questions through follow-up.", "比较已发布的信息、管理准备事项，并从初次咨询到术后回访始终与协调员保持联系。", "Сравнивайте данные, готовьтесь к поездке и оставайтесь на связи с координатором.", "Compara información, organiza tu preparación y mantente en contacto con tu coordinador.")}</p>
            </div>
            <div>
              <InstallAppButton className="inline-flex min-h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background shadow-soft transition hover:-translate-y-0.5" />
              <p className="mt-4 flex items-center gap-2 text-xs text-foreground/55"><Compass className="size-4 text-primary" />{c("Installable on iPhone and Android", "可安装到 iPhone 和 Android", "Для iPhone и Android", "Instalable en iPhone y Android")}</p>
            </div>
          </aside>

          <div className="mobile-app-device relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-background lg:h-full lg:min-h-0 lg:rounded-[2.6rem] lg:border-[7px] lg:border-foreground lg:shadow-[0_45px_95px_-45px_rgba(16,44,36,.65)]">
            <header className="relative z-40 flex min-h-[4.6rem] shrink-0 items-center justify-between border-b border-border/50 bg-background/92 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
              <Link to="/app" className="flex min-h-12 items-center gap-2" aria-label={c("Cosmetics Asia app home", "Cosmetics Asia App 首页", "Главная Cosmetics Asia", "Inicio de Cosmetics Asia")}><span className="grid size-9 place-items-center rounded-full bg-foreground font-display text-sm text-background">CA</span><span><strong className="block font-display text-[1.05rem] leading-none">Cosmetics Asia</strong><span className="mt-1 block text-[8px] font-bold uppercase tracking-[.12em] text-primary">Private care</span></span></Link>
              <div className="flex items-center">
                <label className="relative"><span className="sr-only">{c("Language", "语言", "Язык", "Idioma")}</span><select value={lang} onChange={(event) => setLang(event.target.value as AsiaLang)} className="min-h-12 appearance-none rounded-full bg-transparent px-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/30">{Object.entries(asiaLangLabel).map(([value, meta]) => <option key={value} value={value}>{meta.flag} {value.toUpperCase()}</option>)}</select></label>
              </div>
            </header>

            <main className="mobile-app-scroll min-h-0 flex-1 overflow-y-visible pb-[calc(5.8rem+env(safe-area-inset-bottom))] lg:overflow-y-auto" key={section}>{screens[section]}</main>

            <nav className="mobile-app-nav inset-x-0 bottom-0 z-50 border-t border-border/70 bg-card/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl" aria-label={c("App navigation", "App 导航", "Навигация", "Navegación")}>
              <div className="grid grid-cols-5">
                {nav.map(({ id, icon: Icon, label, to }) => {
                  const active = section === id;
                  return <Link key={id} to={to} onClick={() => void tapFeedback()} aria-current={active ? "page" : undefined} className={`flex min-h-[4.8rem] flex-col items-center justify-center gap-1 rounded-2xl text-[9px] font-semibold transition active:scale-[.96] ${active ? "text-foreground" : "text-muted-foreground"}`}><span className={`grid size-8 place-items-center rounded-full transition ${active ? "bg-secondary" : ""}`}><Icon className={`size-[18px] ${active ? "text-primary" : ""}`} strokeWidth={active ? 2.5 : 2} /></span>{label}</Link>;
                })}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </CarePlanProvider>
  );
};

export default MobileApp;

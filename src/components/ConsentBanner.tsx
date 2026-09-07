import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, X } from "lucide-react";
import {
  analyticsConfigured,
  getAnalyticsConsent,
  getAnalyticsRegion,
  setAnalyticsConsent,
  type AnalyticsConsent,
  type AnalyticsRegion,
} from "@/lib/analytics";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";

const DISMISS_KEY = "ca-consent-dismissed";

const safeSessionGet = (key: string): string | null => {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSessionSet = (key: string, value: string) => {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    /* private mode */
  }
};

const ConsentBanner = () => {
  const { pathname } = useLocation();
  const { lang } = useAsia();
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState<AnalyticsRegion>(() => getAnalyticsRegion());

  const dismiss = useCallback(() => {
    safeSessionSet(DISMISS_KEY, "1");
    setOpen(false);
  }, []);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("ca:open-privacy-choices", show);
    return () => window.removeEventListener("ca:open-privacy-choices", show);
  }, []);

  useEffect(() => {
    const onRegion = (event: Event) => {
      setRegion((event as CustomEvent<AnalyticsRegion>).detail);
    };
    window.addEventListener("ca:analytics-region", onRegion);
    return () => window.removeEventListener("ca:analytics-region", onRegion);
  }, []);

  useEffect(() => {
    if (!analyticsConfigured()) return;
    if (region !== "consent-required") return;
    if (getAnalyticsConsent() !== "unset") return;
    if (safeSessionGet(DISMISS_KEY)) return;
    const id = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(id);
  }, [region]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!analyticsConfigured() || !open) return null;

  const choose = (next: Exclude<AnalyticsConsent, "unset">) => {
    setAnalyticsConsent(next);
    setOpen(false);
  };

  const body = asiaCopy(lang, {
    en: "Optional analytics help us improve the site. We never send your form answers or contact details.",
    zh: "可选的分析数据帮助我们改进网站，我们不会发送你的表单内容或联系方式。",
    ru: "Необязательная аналитика помогает нам улучшать сайт. Мы не передаём ваши ответы из форм и контактные данные.",
    es: "Los análisis opcionales nos ayudan a mejorar el sitio. Nunca enviamos tus respuestas de formularios ni tus datos de contacto.",
  });

  return (
    <div className={`fixed inset-x-0 z-[100] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-none ${pathname.startsWith("/app") ? "bottom-20" : "bottom-0"}`}>
      <aside
        className="pointer-events-auto relative mx-auto flex w-full max-w-3xl flex-col gap-3 rounded-2xl border border-border bg-card p-4 text-foreground shadow-soft sm:flex-row sm:items-center sm:gap-4"
        aria-label={asiaCopy(lang, { en: "Analytics privacy choices", zh: "分析数据隐私选项", ru: "Настройки конфиденциальности аналитики", es: "Opciones de privacidad de análisis", th: "ตัวเลือกความเป็นส่วนตัวของการวิเคราะห์", ms: "Pilihan privasi analitik" })}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label={asiaCopy(lang, { en: "Close privacy choices", zh: "关闭隐私选项", ru: "Закрыть настройки конфиденциальности", es: "Cerrar opciones de privacidad", th: "ปิดตัวเลือกความเป็นส่วนตัว", ms: "Tutup pilihan privasi" })}
          className="absolute right-2 top-2 grid size-11 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground sm:static sm:order-last sm:size-11 sm:shrink-0"
        >
          <X className="size-4" />
        </button>
        <p className="min-w-0 flex-1 pr-10 text-sm leading-relaxed text-foreground sm:pr-0">
          {body}{" "}
          <Link to="/privacy" className="font-semibold text-foreground underline decoration-primary/50 underline-offset-4">
            {asiaCopy(lang, { en: "Read privacy notice", zh: "阅读隐私声明", ru: "Политика конфиденциальности", es: "Leer el aviso de privacidad" })}
          </Link>
        </p>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => choose("granted")}
            className="cta-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold"
          >
            <BarChart3 className="size-4" /> {asiaCopy(lang, { en: "Allow analytics", zh: "允许分析", ru: "Разрешить аналитику", es: "Permitir análisis" })}
          </button>
          <button
            type="button"
            onClick={() => choose("denied")}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-foreground/25 bg-card px-5 text-sm font-semibold hover:border-foreground hover:bg-muted"
          >
            {asiaCopy(lang, { en: "Essential only", zh: "仅必要功能", ru: "Только необходимое", es: "Solo lo esencial" })}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default ConsentBanner;

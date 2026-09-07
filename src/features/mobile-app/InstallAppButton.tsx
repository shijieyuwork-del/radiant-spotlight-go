import { useEffect, useRef, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const InstallAppButton = ({ className = "" }: { className?: string }) => {
  const { lang } = useAsia();
  const c = <T,>(en: T, zh: T, ru: T, es?: T) => asiaCopy(lang, { en, zh, ru, es });
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  useEffect(() => {
    if (showHelp) closeRef.current?.focus();
  }, [showHelp]);

  const install = async () => {
    if (!promptEvent) {
      setShowHelp(true);
      return;
    }
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") setPromptEvent(null);
  };

  return (
    <>
      <button type="button" onClick={install} className={className}>
        <Download className="size-4" aria-hidden="true" />
        {c("Install app", "安装 App", "Установить", "Instalar app")}
      </button>
      {showHelp && (
        <div className="fixed inset-0 z-[120] grid place-items-end bg-foreground/45 p-3 sm:place-items-center" role="presentation" onMouseDown={() => setShowHelp(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-app-title"
            className="w-full max-w-sm rounded-[1.75rem] bg-card p-5 text-foreground shadow-pop"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="grid size-12 place-items-center rounded-2xl bg-secondary text-foreground"><Share className="size-5" /></div>
              <button ref={closeRef} type="button" onClick={() => setShowHelp(false)} className="grid min-h-12 min-w-12 place-items-center rounded-full hover:bg-muted" aria-label={c("Close", "关闭", "Закрыть", "Cerrar")}><X className="size-5" /></button>
            </div>
            <h2 id="install-app-title" className="mt-5 font-display text-3xl">{c("Keep Cosmetics Asia on your phone", "把 Cosmetics Asia 放到手机桌面", "Добавьте Cosmetics Asia на экран", "Guarda Cosmetics Asia en tu móvil")}</h2>
            <ol className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
              <li><strong className="text-foreground">iPhone：</strong>{c("Open this page in Safari, tap Share, then Add to Home Screen.", "用 Safari 打开，点击分享，再选择“添加到主屏幕”。", "Откройте в Safari, нажмите «Поделиться», затем «На экран Домой».", "Abre en Safari, toca Compartir y elige Añadir a pantalla de inicio.")}</li>
              <li><strong className="text-foreground">Android：</strong>{c("Open the browser menu and choose Install app.", "打开浏览器菜单，选择“安装应用”。", "Откройте меню браузера и выберите «Установить приложение».", "Abre el menú del navegador y elige Instalar aplicación.")}</li>
            </ol>
          </section>
        </div>
      )}
    </>
  );
};

export default InstallAppButton;

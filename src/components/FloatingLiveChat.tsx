import { ArrowRight, MessageCircle } from "lucide-react";
import { useAsia } from "@/lib/asia-i18n";
import { useLocation } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";
import { useQuote } from "@/components/QuoteRequest";

const FloatingLiveChat = () => {
  const { lang } = useAsia();
  const { pathname } = useLocation();
  const { open } = useQuote();
  const label = lang === "zh" ? "开始咨询" : lang === "ru" ? "Начать консультацию" : "Start a consultation";

  if (pathname.startsWith("/lp/") || pathname === "/privacy") return null;

  return (
<button
      type="button"
      aria-label={label}
      onClick={() => { trackEvent("select_cta", { source: "floating_consultation" }); open({ source: "floating_consultation" }); }}
      className="consult-blink group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 flex min-h-12 items-center gap-2 rounded-full border border-background/20 bg-foreground p-1.5 text-background shadow-pop transition-all hover:-translate-y-0.5 hover:bg-foreground/95 hover:border-background/30 sm:bottom-6 sm:right-6 sm:pl-1.5 sm:pr-4"
    >
      <span className="relative grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
        <MessageCircle className="size-4" />
        <span aria-hidden className="consult-blink-ring absolute inset-0 rounded-full bg-primary" />
      </span>
      <span className="hidden whitespace-nowrap text-sm font-semibold sm:inline">{label}</span>
      <ArrowRight className="hidden size-3.5 text-primary transition-transform group-hover:translate-x-0.5 sm:block" />
    </button>
  );
};

export default FloatingLiveChat;

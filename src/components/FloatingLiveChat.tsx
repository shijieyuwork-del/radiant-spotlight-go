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
      className="consult-blink group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 flex min-h-14 items-center gap-2.5 rounded-full border border-background/20 bg-foreground p-2 text-background shadow-pop transition-all hover:-translate-y-0.5 hover:border-background/30 hover:bg-foreground/95 sm:bottom-6 sm:right-6 sm:min-h-[3.75rem] sm:pl-2 sm:pr-5"
    >
      <span className="relative grid size-10 place-items-center rounded-full bg-primary text-primary-foreground sm:size-11">
        <MessageCircle className="size-[18px]" />
        <span aria-hidden className="consult-blink-ring absolute inset-0 rounded-full bg-primary" />
      </span>
      <span className="hidden whitespace-nowrap text-[15px] font-semibold sm:inline">{label}</span>
      <ArrowRight className="hidden size-4 text-primary transition-transform group-hover:translate-x-0.5 sm:block" />
    </button>
  );
};

export default FloatingLiveChat;

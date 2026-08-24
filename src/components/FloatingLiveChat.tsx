import { MessageCircle } from "lucide-react";
import { useAsia } from "@/lib/asia-i18n";
import { useLocation } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";

const WHATSAPP_URL =
  "https://wa.me/14708613825?text=Hi%20Cosmetics%20Asia%2C%20I%20would%20like%20to%20ask%20about%20your%20services.";

const FloatingLiveChat = () => {
  const { lang } = useAsia();
  const { pathname } = useLocation();
  const label = lang === "zh" ? "WhatsApp 联系" : lang === "ru" ? "Написать в WhatsApp" : "WhatsApp Us";

  if (pathname.startsWith("/lp/") || pathname === "/privacy") return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label={lang === "zh" ? "通过 WhatsApp 联系我们" : lang === "ru" ? "Связаться с нами в WhatsApp" : "Contact us on WhatsApp"}
      onClick={() => trackEvent("whatsapp_handoff", { source: "floating_chat" })}
      className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 flex items-center gap-2 rounded-full bg-foreground p-2 text-background shadow-pop transition-all hover:-translate-y-0.5 hover:shadow-glow sm:bottom-6 sm:right-6 sm:pl-2 sm:pr-5"
    >
      <span className="relative grid size-10 place-items-center rounded-full bg-primary text-foreground">
        <MessageCircle className="size-5" />
        <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-foreground" />
      </span>
      <span className="hidden whitespace-nowrap text-sm font-semibold sm:inline">{label}</span>
    </a>
  );
};

export default FloatingLiveChat;

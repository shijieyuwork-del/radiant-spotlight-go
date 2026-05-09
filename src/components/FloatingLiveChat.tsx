import { useEffect, useRef, useState } from "react";
import { Headphones, X, Send, MessageCircle, Phone, Mail, CheckCircle2 } from "lucide-react";
import { useCn } from "@/lib/cn-i18n";

type Msg = { id: string; from: "user" | "agent"; text: string; ts: number };

const STORAGE_KEY = "glowy.livechat.v1";
const AGENT_NAME_EN = "Lina · Care concierge";
const AGENT_NAME_ZH = "Lina · 客服管家";

const QUICK_REPLIES_EN = [
  "How does pricing work?",
  "Can I book a consultation?",
  "Help me pick a doctor",
];
const QUICK_REPLIES_ZH = ["套餐怎么收费？", "我想预约咨询", "帮我推荐医生"];

const autoReply = (lang: "en" | "zh"): string => {
  const replies =
    lang === "en"
      ? [
          "Got it — a real concierge will reply within a few minutes during 10:00–18:00 (GMT+8). Want me to text you on WhatsApp/WeChat too?",
          "Thanks for reaching out 💬 I've pinged a human agent. Meanwhile, feel free to share your goal procedure or city.",
        ]
      : [
          "收到啦～客服会在 10:00–18:00（北京时间）几分钟内回复您。需要同步加微信 / WhatsApp 吗？",
          "感谢联系 💬 已通知真人客服，您可以先告诉我们想了解的项目或城市哦。",
        ];
  return replies[Math.floor(Math.random() * replies.length)];
};

const FloatingLiveChat = () => {
  const { lang } = useCn();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load persisted messages
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Msg[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)));
    } catch {
      // ignore
    }
  }, [messages]);

  // Autoscroll
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, typing]);

  // Greeting on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      const greet: Msg = {
        id: `m_${Date.now()}`,
        from: "agent",
        text:
          lang === "en"
            ? "Hi 👋 I'm Lina from glowy. Ask me anything about doctors, pricing, or your trip — a human agent jumps in within minutes."
            : "您好 👋 我是 glowy 客服 Lina，关于医生 / 价格 / 行程都可以问我，真人客服几分钟内介入～",
        ts: Date.now(),
      };
      setMessages([greet]);
    }
  }, [open, messages.length, lang]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const userMsg: Msg = { id: `m_${Date.now()}`, from: "user", text: t, ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply: Msg = {
        id: `m_${Date.now() + 1}`,
        from: "agent",
        text: autoReply(lang),
        ts: Date.now(),
      };
      setMessages((m) => [...m, reply]);
      setTyping(false);
      if (!open) setUnread((u) => u + 1);
    }, 900 + Math.random() * 600);
  };

  const handleOpen = () => {
    setOpen(true);
    setUnread(0);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={handleOpen}
          aria-label={lang === "zh" ? "联系真人客服" : "Chat with a human agent"}
          className="fixed z-50 bottom-6 right-6 group flex items-center gap-2 rounded-full bg-foreground text-background pl-2 pr-5 py-2 shadow-pop hover:shadow-glow transition-all hover:-translate-y-0.5"
        >
          <span className="relative size-10 rounded-full bg-primary grid place-items-center text-foreground">
            <Headphones className="size-5" />
            <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-foreground animate-pulse" />
            {unread > 0 && (
              <span className="absolute -top-2 -left-2 min-w-[20px] h-5 px-1 rounded-full bg-rose-500 text-white text-[11px] font-bold grid place-items-center">
                {unread}
              </span>
            )}
          </span>
          <span className="text-sm font-semibold whitespace-nowrap">
            {lang === "zh" ? "真人客服" : "Live agent"}
          </span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed z-50 bottom-6 right-6 w-[min(380px,calc(100vw-2rem))] h-[min(560px,calc(100vh-6rem))] rounded-3xl bg-card shadow-pop border border-border flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-mint p-4 flex items-start gap-3">
            <div className="relative shrink-0">
              <div className="size-11 rounded-2xl bg-background grid place-items-center shadow-soft">
                <Headphones className="size-5 text-foreground" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-emerald-500 ring-2 ring-[hsl(var(--gradient-mint-end,155_60%,90%))]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold leading-tight">
                {lang === "zh" ? AGENT_NAME_ZH : AGENT_NAME_EN}
              </p>
              <p className="text-[11px] text-foreground/70 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="size-3 text-emerald-600" />
                {lang === "zh" ? "在线 · 几分钟内回复" : "Online · replies in minutes"}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="size-8 rounded-full bg-background/70 hover:bg-background grid place-items-center shrink-0"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-background">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.from === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                  <span className="size-1.5 rounded-full bg-foreground/40 animate-bounce" />
                  <span className="size-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="size-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            )}

            {/* Quick replies */}
            {messages.length <= 1 && !typing && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(lang === "zh" ? QUICK_REPLIES_ZH : QUICK_REPLIES_EN).map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-xs rounded-full px-3 py-1.5 bg-accent text-accent-foreground hover:bg-accent/70 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Channels */}
          <div className="px-4 py-2 border-t border-border bg-muted/40 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="font-semibold">{lang === "zh" ? "也可联系：" : "Also reach us:"}</span>
            <a href="https://wa.me/8618800000000" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
              <MessageCircle className="size-3" /> WhatsApp
            </a>
            <a href="tel:+8618800000000" className="inline-flex items-center gap-1 hover:text-foreground">
              <Phone className="size-3" /> {lang === "zh" ? "电话" : "Call"}
            </a>
            <a href="mailto:hello@glowy.care" className="inline-flex items-center gap-1 hover:text-foreground">
              <Mail className="size-3" /> Email
            </a>
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="p-3 border-t border-border flex items-end gap-2 bg-card"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder={lang === "zh" ? "输入消息…" : "Type a message…"}
              className="flex-1 resize-none rounded-2xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring max-h-28"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send"
              className="size-10 rounded-full bg-foreground text-background grid place-items-center disabled:opacity-40 hover:bg-foreground/90 transition-colors shrink-0"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingLiveChat;

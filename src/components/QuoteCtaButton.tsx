import { ArrowRight, MessageCircle } from "lucide-react";
import { useAsia } from "@/lib/asia-i18n";
import { useQuote, type QuoteContext } from "@/components/QuoteRequest";
import { cn } from "@/lib/utils";

/**
 * 全站统一的 “Get a free quote” CTA 按钮。
 *
 * - 文案唯一来源：asia-i18n 字典 `hero.cta`（随 en/zh/ru 自动切换）。
 *   任何页面不得再内联维护该按钮的三语文案（由 quote-cta-i18n 回归测试守护）。
 * - 样式唯一来源：本组件的 VARIANTS；页面只能通过 className 调整布局
 *   （宽度、圆角、高度等），不得覆盖配色。
 * - 行为二选一：默认跳转 WhatsApp 起始对话；传入 quoteCtx 则打开咨询弹窗。
 */

/** 默认跳转：WhatsApp 起始对话（全站唯一来源） */
export const QUOTE_WHATSAPP_URL =
  "https://wa.me/14708613825?text=Hi%20Cosmetics%20Asia%2C%20I%20would%20like%20to%20book%20a%20free%20consultation%20and%20plan%20my%20care%20journey%20to%20China.";

const VARIANTS = {
  /** 深绿药丸（默认，与首页 Hero 截图一致） */
  dark: "bg-foreground text-background shadow-pop hover:bg-foreground/90",
  /** 主色药丸（用于深色背景上的转化区） */
  primary: "bg-primary text-primary-foreground shadow-glow hover:bg-primary/90",
} as const;

const ICONS = { arrow: ArrowRight, chat: MessageCircle } as const;

export interface QuoteCtaButtonProps {
  /** 传入后点击打开咨询弹窗（携带上下文）；缺省为跳转 WhatsApp */
  quoteCtx?: QuoteContext;
  /** 自定义链接（仅在未传 quoteCtx 时生效），默认 QUOTE_WHATSAPP_URL */
  href?: string;
  variant?: keyof typeof VARIANTS;
  /** arrow：箭头在文案后（默认）；chat：对话图标在文案前 */
  icon?: keyof typeof ICONS;
  className?: string;
}

const QuoteCtaButton = ({
  quoteCtx,
  href = QUOTE_WHATSAPP_URL,
  variant = "dark",
  icon = "arrow",
  className,
}: QuoteCtaButtonProps) => {
  const { t } = useAsia();
  const { open } = useQuote();
  const Icon = ICONS[icon];
  const label = t("hero.cta");
  const cls = cn(
    "inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-7 text-sm font-semibold transition hover:-translate-y-1",
    VARIANTS[variant],
    className,
  );

  if (quoteCtx) {
    return (
      <button type="button" onClick={() => open(quoteCtx)} className={cls}>
        {icon === "chat" && <Icon className="size-4" />}
        {label}
        {icon === "arrow" && <Icon className="size-4" />}
      </button>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {label}
      <Icon className="size-4" />
    </a>
  );
};

export default QuoteCtaButton;

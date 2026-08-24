import { Info } from "lucide-react";
import { useAsia } from "@/lib/asia-i18n";
import { cn } from "@/lib/utils";

/**
 * 可复用的多语言免责声明：平台不提供医疗建议。
 * 在首页、咨询入口与关键转化页复用，文案统一来自 asia-i18n 字典
 * （disclaimer.text / disclaimer.short），三种语言（en/zh/ru）均有对应版本。
 */
export const MedicalDisclaimer = ({
  variant = "inline",
  className,
}: {
  /** inline: 小号单行文本，适合表单/卡片下方；banner: 醒目横条，适合首页与转化页 */
  variant?: "inline" | "banner";
  className?: string;
}) => {
  const { t } = useAsia();
  const text = variant === "banner" ? t("disclaimer.text") : t("disclaimer.short");

  if (variant === "banner") {
    return (
      <div
        role="note"
        data-testid="medical-disclaimer"
        className={cn(
          "flex items-start gap-2.5 rounded-2xl border border-border bg-muted/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground",
          className,
        )}
      >
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        <p>{text}</p>
      </div>
    );
  }

  return (
    <p
      role="note"
      data-testid="medical-disclaimer"
      className={cn("flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground", className)}
    >
      <Info className="mt-px size-3 shrink-0" aria-hidden />
      <span>{text}</span>
    </p>
  );
};

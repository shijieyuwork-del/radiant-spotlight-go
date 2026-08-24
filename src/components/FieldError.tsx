import { CircleAlert, Lightbulb } from "lucide-react";
import { uploadErrorAdvice } from "@/lib/media-validation";

/**
 * 字段错误展示：错误信息 + 可操作的解决建议（若能归类）。
 * 用于管理后台上传表单的字段级错误。
 */
const FieldError = ({ message, className = "" }: { message: string; className?: string }) => {
  const advice = uploadErrorAdvice(message);
  return (
    <div className={`mt-1 space-y-0.5 ${className}`} role="alert">
      <p className="text-xs text-destructive flex items-start gap-1">
        <CircleAlert className="size-3.5 shrink-0 mt-px" />
        <span>{message}</span>
      </p>
      {advice && (
        <p className="text-xs text-muted-foreground flex items-start gap-1">
          <Lightbulb className="size-3.5 shrink-0 mt-px text-amber-500" />
          <span>{advice}</span>
        </p>
      )}
    </div>
  );
};

export default FieldError;

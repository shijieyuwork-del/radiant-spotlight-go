import { CircleAlert, Lightbulb } from "lucide-react";
import { classifyUploadError, uploadErrorAdvice, type MediaRules } from "@/lib/media-validation";
import CompressionGuide from "@/components/CompressionGuide";

type Props = {
  message: string;
  className?: string;
  /** 传入后，大小超限错误会附带前置压缩/转码方案引导 */
  rules?: MediaRules;
  /** 超限文件名（填充压缩命令模板） */
  fileName?: string;
};

/**
 * 字段错误展示：错误信息 + 可操作的解决建议（若能归类）。
 * 大小超限时（且传入 rules）额外展示压缩/转码方案。
 * 用于管理后台上传表单的字段级错误。
 */
const FieldError = ({ message, className = "", rules, fileName }: Props) => {
  const advice = uploadErrorAdvice(message);
  const showGuide = rules && classifyUploadError(message) === "size";
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
      {showGuide && <CompressionGuide rules={rules} fileName={fileName} />}
    </div>
  );
};

export default FieldError;

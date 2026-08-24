import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { validateMediaFile, type MediaRules } from "@/lib/media-validation";

type Props = {
  /** 隐藏 input 的 id（关联外部 Label） */
  id: string;
  /** input accept 属性 */
  accept: string;
  /** 校验规则（类型 + 大小），拖入时预先校验 */
  rules: MediaRules;
  /** 校验通过后的回调 */
  onFile: (file: File) => void;
  /** 校验失败的回调（拖入或选择时） */
  onInvalid: (message: string) => void;
  /** 是否有错误（标红边框） */
  invalid?: boolean;
  disabled?: boolean;
  /** 已选文件名的展示 */
  fileName?: string | null;
};

/**
 * 可点击 + 可拖拽的文件上传区域。
 * 拖入文件时立即按 rules 预校验类型与大小，不合法则不进入后续流程。
 */
const FileDropZone = ({ id, accept, rules, onFile, onInvalid, invalid, disabled, fileName }: Props) => {
  const [dragOver, setDragOver] = useState(false);
  const depth = useRef(0);

  const acceptFile = (file: File | undefined | null) => {
    if (!file) return;
    const error = validateMediaFile(file, rules);
    if (error) onInvalid(error);
    else onFile(file);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-disabled={disabled}
      data-testid={`dropzone-${id}`}
      onClick={() => !disabled && document.getElementById(id)?.click()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          document.getElementById(id)?.click();
        }
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        depth.current += 1;
        if (!disabled) setDragOver(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => {
        e.preventDefault();
        depth.current = Math.max(0, depth.current - 1);
        if (depth.current === 0) setDragOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        depth.current = 0;
        setDragOver(false);
        if (disabled) return;
        acceptFile(e.dataTransfer.files?.[0]);
      }}
      className={`mt-1.5 flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors select-none
        ${dragOver ? "border-primary bg-primary/5" : invalid ? "border-destructive bg-destructive/5" : "border-border hover:border-primary/50 hover:bg-muted/50"}
        ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <UploadCloud className={`size-6 ${dragOver ? "text-primary" : "text-muted-foreground"}`} />
      <p className="text-sm font-medium">
        {dragOver ? "松开以上传文件" : fileName ? fileName : "点击选择或拖拽文件到此处"}
      </p>
      <p className="text-xs text-muted-foreground">
        {rules.formatLabel}，最大 {Math.round(rules.maxBytes / 1024 / 1024)}MB
      </p>
      <input
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled}
        aria-invalid={invalid}
        onChange={(e) => {
          acceptFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
};

export default FileDropZone;

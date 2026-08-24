import { useRef, useState } from "react";
import { FileX2, UploadCloud, X } from "lucide-react";
import { formatMB, validateMediaFiles, type MediaRules } from "@/lib/media-validation";
import FieldError from "@/components/FieldError";

type RejectedFile = { key: string; file: File; error: string };

type Props = {
  /** 隐藏 input 的 id（关联外部 Label） */
  id: string;
  /** input accept 属性 */
  accept: string;
  /** 校验规则（类型 + 大小），拖入时预先校验 */
  rules: MediaRules;
  /** 单文件模式：校验通过后的回调 */
  onFile?: (file: File) => void;
  /** 单文件模式：校验失败的回调（拖入或选择时） */
  onInvalid?: (message: string) => void;
  /** 多文件模式：一次拖入/选择多个文件 */
  multiple?: boolean;
  /** 多文件模式：所有通过预校验的文件（非法文件在组件内单独展示错误） */
  onFiles?: (files: File[]) => void;
  /** 是否有错误（标红边框） */
  invalid?: boolean;
  disabled?: boolean;
  /** 已选文件名的展示 */
  fileName?: string | null;
};

const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

/**
 * 可点击 + 可拖拽的文件上传区域。
 * 拖入文件时立即按 rules 预校验类型与大小，不合法则不进入后续流程。
 * multiple 模式：支持一次拖入/选择多个文件，合法文件经 onFiles 回调，
 * 非法文件在区域下方逐个展示错误信息、解决建议与压缩方案（可单独移除）。
 */
const FileDropZone = ({ id, accept, rules, onFile, onInvalid, multiple, onFiles, invalid, disabled, fileName }: Props) => {
  const [dragOver, setDragOver] = useState(false);
  const [rejected, setRejected] = useState<RejectedFile[]>([]);
  const depth = useRef(0);

  const acceptFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    if (multiple) {
      const verdicts = validateMediaFiles(Array.from(list), rules);
      const valid = verdicts.filter((v) => !v.error).map((v) => v.file);
      const bad = verdicts.filter((v) => v.error) as { file: File; error: string }[];
      if (bad.length > 0) {
        setRejected((prev) => {
          const seen = new Set(prev.map((r) => r.key));
          return [...prev, ...bad.filter((b) => !seen.has(fileKey(b.file))).map((b) => ({ key: fileKey(b.file), file: b.file, error: b.error }))];
        });
      }
      if (valid.length > 0) onFiles?.(valid);
      return;
    }
    const file = list[0];
    const error = validateMediaFiles([file], rules)[0].error;
    if (error) onInvalid?.(error);
    else onFile?.(file);
  };

  const dismissRejected = (key: string) => setRejected((prev) => prev.filter((r) => r.key !== key));

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-disabled={disabled}
        aria-invalid={invalid}
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
          acceptFiles(e.dataTransfer.files);
        }}
        className={`mt-1.5 flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors select-none
          ${dragOver ? "border-primary bg-primary/5" : invalid ? "border-destructive bg-destructive/5" : "border-border hover:border-primary/50 hover:bg-muted/50"}
          ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        <UploadCloud className={`size-6 ${dragOver ? "text-primary" : "text-muted-foreground"}`} />
        <p className="text-sm font-medium">
          {dragOver
            ? "松开以上传文件"
            : fileName
              ? fileName
              : multiple
                ? "点击选择或拖拽文件到此处（可多选）"
                : "点击选择或拖拽文件到此处"}
        </p>
        <p className="text-xs text-muted-foreground">
          {rules.formatLabel}，单文件最大 {Math.round(rules.maxBytes / 1024 / 1024)}MB
        </p>
        <input
          id={id}
          type="file"
          accept={accept}
          className="hidden"
          disabled={disabled}
          multiple={multiple}
          onChange={(e) => {
            acceptFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      {rejected.length > 0 && (
        <ul
          className="mt-2 space-y-2 text-left"
          data-testid={`dropzone-${id}-rejected`}
          // 阻止冒泡，避免点击错误列表时重新打开文件选择器
          onClick={(e) => e.stopPropagation()}
        >
          {rejected.map((r) => (
            <li key={r.key} className="rounded-xl border border-destructive/40 bg-destructive/5 p-2.5" data-testid={`rejected-file-${r.file.name}`}>
              <div className="flex items-start gap-2">
                <FileX2 className="size-4 shrink-0 mt-0.5 text-destructive" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate" title={r.file.name}>{r.file.name}</p>
                  <p className="text-[11px] text-muted-foreground">{formatMB(r.file.size)}MB · 未通过预校验，不会上传</p>
                  <FieldError message={r.error} rules={rules} fileName={r.file.name} />
                </div>
                <button
                  type="button"
                  aria-label={`移除 ${r.file.name} 的错误提示`}
                  onClick={() => dismissRejected(r.key)}
                  className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileDropZone;

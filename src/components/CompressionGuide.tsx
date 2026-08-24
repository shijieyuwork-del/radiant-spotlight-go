import { useState } from "react";
import { Check, ChevronDown, Copy, Wrench } from "lucide-react";
import { compressionGuideFor, type MediaRules } from "@/lib/media-validation";

type Props = {
  /** 校验规则（决定展示图片还是视频的压缩方案） */
  rules: MediaRules;
  /** 超限文件名（用于填充命令行模板） */
  fileName?: string;
};

/**
 * 前置压缩 / 转码方案引导：文件大小超限时展示。
 * 给出推荐工具、建议参数与可复制的命令行，引导用户本地处理后再上传。
 */
const CompressionGuide = ({ rules, fileName }: Props) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const guide = compressionGuideFor(rules);
  const input = fileName || "input";
  const output = input.replace(/\.[^.]+$/, "") || "output";
  const command = guide.command?.replaceAll("{input}", input).replaceAll("{output}", output);

  const copy = async () => {
    if (!command) return;
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* 剪贴板不可用（非安全上下文）时静默忽略 */
    }
  };

  return (
    <div className="mt-1.5 rounded-lg border bg-background/60" data-testid="compression-guide">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/5 rounded-lg"
      >
        <Wrench className="size-3.5 shrink-0" />
        查看压缩 / 转码方案（压缩后即可上传）
        <ChevronDown className={`size-3.5 ml-auto shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-2.5 pb-2.5 space-y-2 text-xs">
          <div>
            <p className="font-medium mb-0.5">推荐工具</p>
            <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
              {guide.tools.map((tool) => <li key={tool}>{tool}</li>)}
            </ul>
          </div>
          <div>
            <p className="font-medium mb-0.5">建议参数</p>
            <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
              {guide.params.map((param) => <li key={param}>{param}</li>)}
            </ul>
          </div>
          {command && (
            <div>
              <p className="font-medium mb-0.5">{guide.commandLabel}</p>
              <div className="flex items-center gap-1.5">
                <code className="flex-1 overflow-x-auto whitespace-nowrap rounded-md bg-muted px-2 py-1 font-mono text-[11px]">{command}</code>
                <button
                  type="button"
                  onClick={copy}
                  aria-label="复制命令"
                  className="shrink-0 rounded-md border p-1 hover:bg-muted"
                >
                  {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
                </button>
              </div>
            </div>
          )}
          <p className="text-muted-foreground">压缩完成后，把新文件重新拖入上方上传区即可。</p>
        </div>
      )}
    </div>
  );
};

export default CompressionGuide;

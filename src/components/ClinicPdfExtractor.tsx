import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { extractPdf } from "@/lib/pdf-text";
import type { MediaRules } from "@/lib/media-validation";
import FileDropZone from "@/components/FileDropZone";

export const PDF_RULES: MediaRules = {
  types: ["application/pdf"],
  exts: ["pdf"],
  maxBytes: 50 * 1024 * 1024,
  label: "PDF",
  formatLabel: "PDF",
};

export type ExtractedClinicFields = {
  nameZh: string;
  nameEn: string;
  city: string;
  areaZh: string;
  areaEn: string;
  descriptionZh: string;
  descriptionEn: string;
  websiteUrl: string;
  isPublic: boolean;
};

/**
 * 上传医院 PDF 资料，前端解析文字并渲染页面截图，交给 AI 识别 + 润色后回填表单。
 * 结果仅作草稿，管理员需人工核对后再保存。
 */
const ClinicPdfExtractor = ({
  onExtract,
  disabled,
}: {
  onExtract: (fields: ExtractedClinicFields) => void;
  disabled?: boolean;
}) => {
  const [busy, setBusy] = useState(false);
  const [notes, setNotes] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ processed: number; total: number } | null>(null);

  const run = async (file: File) => {
    setBusy(true);
    setNotes(null);
    setProgress(null);
    try {
      const { text, images, pageCount, processedPages } = await extractPdf(file, {
        maxPages: 60,
        maxRenderedPages: 8,
        onProgress: (processed, total) => setProgress({ processed, total }),
      });
      if (!text.trim() && images.length === 0) throw new Error("这份 PDF 没有可读取的内容");
      const { data, error } = await supabase.functions.invoke("extract-clinic-info", {
        body: { text, images, pageCount, processedPages },
      });
      if (error) throw error;
      const fields = data?.fields as ExtractedClinicFields | undefined;
      if (!fields) throw new Error("未能识别出内容");
      const filled = Object.entries(fields).filter(([, v]) => typeof v === "string" && v.trim()).length;
      if (filled === 0) {
        toast.error("没有从 PDF 中识别到可用信息，请手动填写");
        return;
      }
      onExtract(fields);
      setNotes(typeof data?.notes === "string" && data.notes.trim() ? data.notes.trim() : null);
      toast.success(`已读取 ${processedPages} 页并填入 ${filled} 项内容，请人工核对后再保存`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "识别失败，请稍后重试");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  return (
    <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-3 space-y-2">
      <p className="text-sm font-medium flex items-center gap-1.5">
        {busy ? <Loader2 className="size-4 animate-spin text-primary" /> : <FileText className="size-4 text-primary" />}
        {busy ? "正在读取并识别 PDF…" : "上传 PDF 自动识别并润色"}
      </p>
      <p className="text-xs text-muted-foreground">
        支持最长 60 页、最大 50MB 的医院简介、宣传册或资质文件。系统读取全文，并从整份文档抽取代表页面，整理成可修改的中英文介绍。
      </p>
      {busy && progress && (
        <div className="space-y-1" role="status" aria-live="polite">
          <div className="h-1.5 overflow-hidden rounded-full bg-primary/10">
            <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${Math.round((progress.processed / progress.total) * 100)}%` }} />
          </div>
          <p className="text-xs text-muted-foreground">正在读取第 {progress.processed} / {progress.total} 页</p>
        </div>
      )}
      <FileDropZone
        id="clinic-pdf-extract"
        accept="application/pdf"
        rules={PDF_RULES}
        disabled={disabled || busy}
        onFile={(file) => void run(file)}
        onInvalid={(message) => toast.error(message)}
      />
      {notes && <p className="text-xs text-muted-foreground">需人工核对：{notes}</p>}
    </div>
  );
};

export default ClinicPdfExtractor;

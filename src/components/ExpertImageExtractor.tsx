import { useState } from "react";
import { Loader2, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PHOTO_RULES } from "@/lib/media-validation";
import FileDropZone from "@/components/FileDropZone";

export type ExtractedExpertFields = {
  name: string; title: string; hospital: string; city: string;
  specialties: string; languages: string; bio: string; credentials: string;
};

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("图片读取失败"));
    reader.readAsDataURL(file);
  });

/**
 * 拖入名片、资质证书或简介截图，AI 自动识别专家姓名、职称、诊所等信息并回填表单。
 * 识别结果仅作草稿，管理员需人工核对后再发布。
 */
const ExpertImageExtractor = ({
  onExtract,
  disabled,
}: {
  onExtract: (fields: ExtractedExpertFields) => void;
  disabled?: boolean;
}) => {
  const [busy, setBusy] = useState(false);
  const [notes, setNotes] = useState<string | null>(null);

  const run = async (files: File[]) => {
    setBusy(true);
    setNotes(null);
    try {
      const images = await Promise.all(files.slice(0, 4).map(toDataUrl));
      const { data, error } = await supabase.functions.invoke("extract-doctor-info", { body: { images } });
      if (error) throw error;
      const fields = data?.fields as ExtractedExpertFields | undefined;
      if (!fields) throw new Error("未能识别出内容");
      const filled = Object.entries(fields).filter(([, v]) => typeof v === "string" && v.trim()).length;
      if (filled === 0) {
        toast.error("没有从图片中识别到可用信息，请手动填写");
        return;
      }
      onExtract(fields);
      setNotes(typeof data?.notes === "string" && data.notes.trim() ? data.notes.trim() : null);
      toast.success(`已识别并填入 ${filled} 项内容，请人工核对后再发布`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "识别失败，请稍后重试");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-3 space-y-2">
      <p className="text-sm font-medium flex items-center gap-1.5">
        {busy ? <Loader2 className="size-4 animate-spin text-primary" /> : <ScanLine className="size-4 text-primary" />}
        {busy ? "AI 识别中…" : "拖入图片自动识别并填表"}
      </p>
      <p className="text-xs text-muted-foreground">
        名片、资质证书、简介截图都可以，最多 4 张；识别结果会填入下方表单，可随时修改。
      </p>
      <FileDropZone
        id="expert-extract"
        accept="image/jpeg,image/png,image/webp"
        rules={PHOTO_RULES}
        multiple
        disabled={disabled || busy}
        onFiles={(files) => void run(files)}
      />
      {notes && <p className="text-xs text-muted-foreground">需人工核对：{notes}</p>}
    </div>
  );
};

export default ExpertImageExtractor;

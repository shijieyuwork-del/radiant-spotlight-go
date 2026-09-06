import { useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { translateFields, type I18nBundle } from "@/lib/i18n-content";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const LANG_TABS = [
  { key: "zh", label: "中文（润色后）" },
  { key: "en", label: "English" },
  { key: "ru", label: "Русский" },
  { key: "es", label: "Español" },

] as const;

const FIELD_LABELS: Record<string, string> = {
  name: "姓名",
  title: "标题/职称",
  hospital: "医院/机构",
  city: "城市",
  bio: "介绍",
  credentials: "资质",
  caption: "说明",
};

/**
 * 「预览翻译效果」按钮：调用与发布时完全相同的 AI 润色+翻译流程，
 * 在弹窗里并排展示中文（润色后）/英文/俄文，不写入数据库。
 */
export default function TranslationPreviewButton({
  fields,
  revise,
  disabled,
}: {
  /** 与发布时一致的中文字段（已 trim） */
  fields: Record<string, string>;
  revise: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bundle, setBundle] = useState<I18nBundle & { revised?: boolean }>({});
  const [tab, setTab] = useState<(typeof LANG_TABS)[number]["key"]>("zh");

  const preview = async () => {
    const filled = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v.trim())
    );
    if (Object.keys(filled).length === 0) {
      toast.warning("请先填写要预览的中文内容");
      return;
    }
    setLoading(true);
    try {
      const result = await translateFields(filled, { revise });
      setBundle(result);
      setTab("zh");
      setOpen(true);
      if (!result.en) toast.info("翻译服务暂不可用，仅显示中文原文");
    } finally {
      setLoading(false);
    }
  };

  const keys = Object.keys(fields).filter((k) => fields[k].trim());

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full rounded-full"
        disabled={disabled || loading}
        onClick={() => void preview()}
      >
        {loading ? <Loader2 className="animate-spin" /> : <><Eye className="size-4 mr-2" />预览翻译效果</>}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>翻译预览（未发布）</DialogTitle>
            <DialogDescription>
              这是发布前 AI {revise ? "润色并翻译" : "翻译"}的实际效果，确认无误后再点发布。
              {bundle.revised ? " 中文已由 AI 润色。" : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            {LANG_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  tab === t.key ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {keys.map((k) => (
              <div key={k} className="rounded-xl border bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">{FIELD_LABELS[k] ?? k}</p>
                <p className="text-sm whitespace-pre-wrap">
                  {bundle[tab]?.[k] || (tab !== "zh" ? "（暂无译文，发布时将重试）" : fields[k])}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

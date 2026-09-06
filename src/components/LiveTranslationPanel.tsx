import { useEffect, useState } from "react";
import { Loader2, Languages } from "lucide-react";
import { translateFields, type I18nBundle } from "@/lib/i18n-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TARGETS = [
  { key: "en", label: "English 🇺🇸" },
  { key: "ru", label: "Русский 🇷🇺" },
  { key: "es", label: "Español 🇪🇸" },
] as const;

/**
 * 编辑中文内容时，实时（防抖）显示英/俄/西译文预览。
 * 只做展示，真正保存时会重新生成一次并写入数据库。
 */
export default function LiveTranslationPanel({
  fields,
  revise,
}: {
  fields: Record<string, string | null | undefined>;
  revise: boolean;
}) {
  const [bundle, setBundle] = useState<I18nBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const signature = JSON.stringify(fields);

  useEffect(() => {
    const parsed = JSON.parse(signature) as Record<string, string>;
    const hasContent = Object.values(parsed).some((v) => typeof v === "string" && v.trim());
    if (!hasContent) {
      setBundle(null);
      return;
    }
    let active = true;
    setLoading(true);
    const timer = window.setTimeout(async () => {
      const result = await translateFields(parsed, { revise });
      if (!active) return;
      setBundle(result);
      setLoading(false);
    }, 900);
    return () => {
      active = false;
      window.clearTimeout(timer);
      setLoading(false);
    };
  }, [signature, revise]);

  return (
    <div className="rounded-2xl border bg-muted/30 p-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Languages className="size-4 text-primary" />
        多语言实时预览
        {loading && <Loader2 className="size-3.5 animate-spin text-muted-foreground" />}
      </div>
      {!bundle ? (
        <p className="mt-2 text-xs text-muted-foreground">填写中文内容后，这里会自动显示英语、俄语、西班牙语版本。</p>
      ) : (
        <Tabs defaultValue="en" className="mt-2">
          <TabsList className="h-8">
            {TARGETS.map((t) => (
              <TabsTrigger key={t.key} value={t.key} className="text-xs">{t.label}</TabsTrigger>
            ))}
          </TabsList>
          {TARGETS.map((t) => {
            const values = bundle[t.key];
            return (
              <TabsContent key={t.key} value={t.key} className="mt-2 space-y-2">
                {values && Object.keys(values).length > 0 ? (
                  Object.entries(values).map(([key, text]) => (
                    <div key={key}>
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{key}</p>
                      <p className="text-sm whitespace-pre-wrap">{text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">翻译服务暂时不可用，保存时会保留中文原文。</p>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}
      {bundle?.zh && revise && (
        <div className="mt-3 border-t pt-2">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">中文（AI 润色后）</p>
          {Object.entries(bundle.zh).map(([key, text]) => (
            <p key={key} className="text-sm whitespace-pre-wrap">{text}</p>
          ))}
        </div>
      )}
    </div>
  );
}

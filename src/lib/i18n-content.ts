import { supabase } from "@/integrations/supabase/client";

export type Lang = "en" | "zh" | "ru";
export type I18nBundle = Partial<Record<Lang, Record<string, string>>>;

/**
 * 把中文录入内容送到后台翻译，返回 { zh, en, ru } 三语字段包。
 * 翻译失败时返回仅含中文的包，保证上传流程不中断。
 */
export const translateFields = async (
  fields: Record<string, string | null | undefined>
): Promise<I18nBundle> => {
  const zh = Object.fromEntries(
    Object.entries(fields).filter(([, v]) => typeof v === "string" && v.trim()) as [string, string][]
  );
  if (Object.keys(zh).length === 0) return {};
  try {
    const { data, error } = await supabase.functions.invoke("translate-content", {
      body: { fields: zh, source: "zh" },
    });
    if (error) throw error;
    return (data?.translations ?? { zh }) as I18nBundle;
  } catch {
    return { zh };
  }
};

/** 读取某字段的当前语言版本，缺失时回落到中文原文。 */
export const localizedField = (
  i18n: unknown,
  key: string,
  lang: Lang,
  fallback: string | null | undefined
): string => {
  const bundle = (i18n ?? {}) as I18nBundle;
  return bundle?.[lang]?.[key] || bundle?.zh?.[key] || fallback || "";
};

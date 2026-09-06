import { supabase } from "@/integrations/supabase/client";

export type Lang = "en" | "zh" | "ru" | "es";
export type I18nBundle = Partial<Record<Lang, Record<string, string>>>;

/**
 * 把中文录入内容送到后台处理，返回 { zh, en, ru } 三语字段包。
 * revise=true 时 AI 会先润色中文原文，再翻译英文/俄文。
 * 失败时返回仅含中文的包，保证上传流程不中断。
 */
export const translateFields = async (
  fields: Record<string, string | null | undefined>,
  options: { revise?: boolean } = {}
): Promise<I18nBundle & { revised?: boolean }> => {
  const zh = Object.fromEntries(
    Object.entries(fields).filter(([, v]) => typeof v === "string" && v.trim()) as [string, string][]
  );
  if (Object.keys(zh).length === 0) return {};
  try {
    const { data, error } = await supabase.functions.invoke("translate-content", {
      body: { fields: zh, source: "zh", revise: options.revise === true },
    });
    if (error) throw error;
    return { ...((data?.translations ?? { zh }) as I18nBundle), revised: data?.revised === true };
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
  return bundle?.[lang]?.[key] || bundle?.en?.[key] || bundle?.zh?.[key] || fallback || "";
};

/** 专家记录按当前语言本地化（缺译文时回落中文原文）。 */
export const localizeDoctorRow = <T extends Record<string, unknown>>(row: T, lang: Lang): T => {
  const i18n = (row as { i18n?: unknown }).i18n;
  const f = (key: string) => localizedField(i18n, key, lang, row[key] as string | null);
  return { ...row, name: f("name"), title: f("title"), hospital: f("hospital"), bio: f("bio"), credentials: f("credentials") || (row.credentials ?? null) } as T;
};

/** 视频记录按当前语言本地化。 */
export const localizeVideoRow = <T extends Record<string, unknown>>(row: T, lang: Lang): T => {
  const i18n = (row as { i18n?: unknown }).i18n;
  return { ...row, title: localizedField(i18n, "title", lang, row.title as string), caption: localizedField(i18n, "caption", lang, row.caption as string | null) || (row.caption ?? null) } as T;
};

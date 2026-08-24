import fallbackPoster from "@/assets/video-cover-fallback.jpg";

/** 默认海报：当视频没有封面或封面加载失败时兜底使用 */
export const DEFAULT_VIDEO_POSTER = fallbackPoster;

export type CoverFallbackReason = "missing" | "unavailable" | null;

/**
 * 判断封面兜底原因：
 * - missing: 记录没有 cover_path（从未生成或生成失败）
 * - unavailable: 有 cover_path 但文件缺失/签名 URL 加载失败
 */
export const coverFallbackReason = (
  coverPath: string | null | undefined,
  loadFailed: boolean,
): CoverFallbackReason => {
  if (!coverPath) return "missing";
  return loadFailed ? "unavailable" : null;
};

export const COVER_FALLBACK_TEXT: Record<Exclude<CoverFallbackReason, null>, string> = {
  missing: "未生成封面，已使用默认海报",
  unavailable: "封面文件缺失或加载失败，已使用默认海报",
};

/** 探测图片 URL 是否可加载（用于检测封面文件缺失） */
export const probeImage = (url: string): Promise<boolean> =>
  new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });

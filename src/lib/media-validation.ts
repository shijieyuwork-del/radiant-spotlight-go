/**
 * 媒体文件校验 —— 管理后台上传表单专用。
 * 返回具体、可直接展示在字段下方的中文错误信息。
 */

export interface MediaRules {
  /** 允许的 MIME 类型 */
  types: readonly string[];
  /** 允许的扩展名（小写，不含点） */
  exts: readonly string[];
  /** 单文件大小上限（字节） */
  maxBytes: number;
  /** 文件类别文案：图片 / 视频 */
  label: string;
  /** 展示用的格式列表：JPG / PNG / WebP */
  formatLabel: string;
}

export const PHOTO_RULES: MediaRules = {
  types: ["image/jpeg", "image/png", "image/webp"],
  exts: ["jpg", "jpeg", "png", "webp"],
  maxBytes: 10 * 1024 * 1024,
  label: "图片",
  formatLabel: "JPG / PNG / WebP",
};

export const VIDEO_RULES: MediaRules = {
  types: ["video/mp4", "video/quicktime", "video/webm"],
  exts: ["mp4", "mov", "webm"],
  maxBytes: 100 * 1024 * 1024,
  label: "视频",
  formatLabel: "MP4 / MOV / WebM",
};

export const formatMB = (bytes: number): string => (bytes / 1024 / 1024).toFixed(1);

/**
 * 校验文件类型与大小，返回具体错误信息；合法时返回 null。
 * 类型错误会指出当前文件的实际类型/扩展名；大小错误会给出实际大小与上限。
 */
export const validateMediaFile = (file: File, rules: MediaRules): string | null => {
  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  if (!rules.types.includes(file.type) || !rules.exts.includes(ext)) {
    const actual = file.type || (ext ? `.${ext}` : "未知类型");
    return `${rules.label}类型不支持（当前文件：${actual}），请使用 ${rules.formatLabel} 格式`;
  }
  if (file.size === 0) {
    return `${rules.label}内容为空（0 字节），请重新选择文件`;
  }
  if (file.size > rules.maxBytes) {
    return `${rules.label}大小 ${formatMB(file.size)}MB 超过 ${formatMB(rules.maxBytes)}MB 上限，请压缩后重新选择`;
  }
  return null;
};

/**
 * 把服务端（upload-media 边缘函数）返回的错误信息映射回表单字段。
 * 类型/大小/限流/配额问题都归因于文件选择字段，返回 null 表示无法归类。
 */
export const fieldForUploadError = (message: string): "file" | null => {
  if (/invalid file type|file too large|rate limit|quota|已触发上传限制/i.test(message)) return "file";
  return null;
};

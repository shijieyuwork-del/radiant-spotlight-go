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

/** 上传验证失败的类别（客户端与服务端错误统一归类） */
export type UploadErrorKind = "type" | "size" | "empty" | "rate_limit" | "quota";

/**
 * 把一条错误信息（客户端校验或服务端返回）归类为验证失败类别。
 * 无法归类时返回 null。
 */
export const classifyUploadError = (message: string): UploadErrorKind | null => {
  if (/类型不支持|invalid file type/i.test(message)) return "type";
  if (/内容为空|0 字节/.test(message)) return "empty";
  if (/超过.*上限|file too large/i.test(message)) return "size";
  if (/rate limit|已触发上传限制|上传过于频繁/i.test(message)) return "rate_limit";
  if (/quota|存储空间|空间已满/i.test(message)) return "quota";
  return null;
};

/**
 * 每种验证失败对应的可操作解决建议（简短说明，展示在错误旁边）。
 */
export const UPLOAD_ERROR_ADVICE: Record<UploadErrorKind, string> = {
  type: "解决建议：用剪映 / 格式工厂等工具把文件转换为受支持的格式（视频转 MP4 H.264，图片转 JPG/PNG/WebP）后重试。",
  size: "解决建议：压缩文件后再上传——视频可用剪映导出 1080p / 30fps，图片可导出为 WebP（质量 80）以减小体积。",
  empty: "解决建议：该文件内容为空，请重新导出或换一个文件。",
  rate_limit: "解决建议：上传频率已达上限（每小时 30 次 / 每天 100 次），请稍等片刻再试，或分批上传。",
  quota: "解决建议：存储空间已满，请先在下方列表删除不再需要的旧文件，或联系平台管理员扩容。",
};

/** 返回错误信息对应的解决建议；无法归类时返回 null。 */
export const uploadErrorAdvice = (message: string): string | null => {
  const kind = classifyUploadError(message);
  return kind ? UPLOAD_ERROR_ADVICE[kind] : null;
};

/** 批量预校验结果：每个文件独立给出通过/失败与具体错误信息 */
export interface FileVerdict {
  file: File;
  error: string | null;
}

/**
 * 一次校验多个文件（多选/批量拖入场景）。
 * 返回与输入等长的结果数组，顺序一致；调用方据此分流合法与非法文件。
 */
export const validateMediaFiles = (files: readonly File[], rules: MediaRules): FileVerdict[] =>
  files.map((file) => ({ file, error: validateMediaFile(file, rules) }));

/** 大小超限时的前置压缩/转码方案（引导用户使用本地工具处理后再上传） */
export interface CompressionGuide {
  /** 推荐的本地/在线工具 */
  tools: string[];
  /** 建议参数 */
  params: string[];
  /** 可复制的命令行模板，{input}/{output} 为占位符 */
  command?: string;
  commandLabel?: string;
}

export const COMPRESSION_GUIDES: Record<"image" | "video", CompressionGuide> = {
  image: {
    tools: [
      "Squoosh（squoosh.app）：浏览器内免费压缩，无需安装",
      "美图秀秀 / Photoshop：导出时选择 WebP 格式",
    ],
    params: [
      "格式：WebP（质量 80）或 JPG（质量 82）",
      "尺寸：长边缩放到 2000px 以内",
      `目标体积：≤ ${formatMB(PHOTO_RULES.maxBytes)}MB`,
    ],
    command: 'magick "{input}" -resize "2000x2000>" -quality 80 "{output}.webp"',
    commandLabel: "ImageMagick 命令（本机安装后可用）",
  },
  video: {
    tools: [
      "剪映 / CapCut：导出时选 1080p · 30fps · 码率 8Mbps",
      "HandBrake：使用预设 “Fast 1080p30” 转码",
    ],
    params: [
      "编码：H.264（libx264），CRF 28",
      "分辨率：≤ 1080p，帧率 ≤ 30fps",
      "音频：AAC 128kbps",
      `目标体积：≤ ${formatMB(VIDEO_RULES.maxBytes)}MB`,
    ],
    command: 'ffmpeg -i "{input}" -c:v libx264 -preset slow -crf 28 -c:a aac -b:a 128k "{output}.mp4"',
    commandLabel: "FFmpeg 命令（本机安装后可用）",
  },
};

/** 按校验规则返回对应的压缩/转码方案（视频规则 → 视频方案，其余 → 图片方案） */
export const compressionGuideFor = (rules: MediaRules): CompressionGuide =>
  rules === VIDEO_RULES || rules.label === "视频" ? COMPRESSION_GUIDES.video : COMPRESSION_GUIDES.image;

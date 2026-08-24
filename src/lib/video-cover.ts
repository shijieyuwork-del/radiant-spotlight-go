/**
 * Client-side video cover (thumbnail) generation.
 * Extracts candidate frames from a video File and renders them cover-fit
 * onto a 720×1280 (9:16) canvas so every feed preview has a consistent shape.
 */

export type CoverCandidate = {
  /** seconds into the video */
  time: number;
  blob: Blob;
  /** object URL for preview <img> */
  url: string;
};

const COVER_W = 720;
const COVER_H = 1280;
/** Candidate positions as fractions of the video duration */
const FRACTIONS = [0.05, 0.25, 0.5, 0.75, 0.95];

const seekTo = (video: HTMLVideoElement, time: number) =>
  new Promise<void>((resolve, reject) => {
    const onSeeked = () => { cleanup(); resolve(); };
    const onError = () => { cleanup(); reject(new Error("视频帧提取失败")); };
    const cleanup = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
    };
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    video.currentTime = time;
  });

const drawCover = (video: HTMLVideoElement): Blob | Promise<Blob> => {
  const canvas = document.createElement("canvas");
  canvas.width = COVER_W;
  canvas.height = COVER_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("当前浏览器不支持封面生成");
  // cover-fit: fill the 9:16 canvas, cropping overflow
  const scale = Math.max(COVER_W / video.videoWidth, COVER_H / video.videoHeight);
  const w = video.videoWidth * scale;
  const h = video.videoHeight * scale;
  ctx.drawImage(video, (COVER_W - w) / 2, (COVER_H - h) / 2, w, h);
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("封面导出失败"))), "image/webp", 0.85),
  );
};

/**
 * Extract up to 5 candidate covers from a video file.
 * Caller must revoke `candidate.url` object URLs for rejected candidates.
 */
export const extractCoverCandidates = async (file: File): Promise<CoverCandidate[]> => {
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = url;
  try {
    await new Promise<void>((resolve, reject) => {
      video.addEventListener("loadedmetadata", () => resolve(), { once: true });
      video.addEventListener("error", () => reject(new Error("无法读取该视频文件")), { once: true });
    });
    const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 1;
    const candidates: CoverCandidate[] = [];
    for (const f of FRACTIONS) {
      const time = Math.min(duration * f, Math.max(duration - 0.1, 0));
      await seekTo(video, time);
      const blob = await drawCover(video);
      candidates.push({ time, blob, url: URL.createObjectURL(blob) });
    }
    return candidates;
  } finally {
    URL.revokeObjectURL(url);
  }
};

/** Convert a generated cover blob into an uploadable File. */
export const coverBlobToFile = (blob: Blob, videoFileName: string): File => {
  const base = videoFileName.replace(/\.[^.]+$/, "") || "video";
  return new File([blob], `${base}-cover.webp`, { type: "image/webp" });
};

/** Read a video file's duration in seconds (null when unreadable). */
export const readVideoDuration = (file: File): Promise<number | null> =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;
    const done = (value: number | null) => {
      URL.revokeObjectURL(url);
      resolve(value);
    };
    video.addEventListener("loadedmetadata", () =>
      done(Number.isFinite(video.duration) && video.duration > 0 ? video.duration : null), { once: true });
    video.addEventListener("error", () => done(null), { once: true });
  });

/** Format seconds as m:ss for compact preview labels. */
export const formatDuration = (seconds: number): string => {
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

// ============= 封面自动推荐打分 =============

/**
 * Score a decoded luma plane: gradient energy (sharpness) weighted by a
 * brightness penalty that favours well-lit frames over too dark/bright ones.
 * Pure function so it can be unit-tested without a DOM.
 */
export const scoreLumaPlane = (luma: ArrayLike<number>, width: number, height: number): number => {
  const total = width * height;
  if (total === 0) return 0;
  let energy = 0;
  let sum = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const v = luma[i];
      sum += v;
      if (x + 1 < width) energy += Math.abs(v - luma[i + 1]);
      if (y + 1 < height) energy += Math.abs(v - luma[i + width]);
    }
  }
  const sharpness = energy / total;
  const mean = sum / total;
  const brightnessScore = Math.max(0, 1 - Math.abs(mean - 120) / 120);
  return sharpness * (0.35 + 0.65 * brightnessScore);
};

const SCORE_W = 72;
const SCORE_H = 128;

const scoreCandidate = async (blob: Blob): Promise<number> => {
  const bitmap = await createImageBitmap(blob);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = SCORE_W;
    canvas.height = SCORE_H;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return 0;
    ctx.drawImage(bitmap, 0, 0, SCORE_W, SCORE_H);
    const { data } = ctx.getImageData(0, 0, SCORE_W, SCORE_H);
    const luma = new Float32Array(SCORE_W * SCORE_H);
    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      luma[j] = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    }
    return scoreLumaPlane(luma, SCORE_W, SCORE_H);
  } finally {
    bitmap.close();
  }
};

/**
 * Pick the index of the "best" cover candidate (sharpest, well-lit).
 * Returns -1 for an empty list. Browser-only (uses createImageBitmap).
 */
export const pickBestCoverIndex = async (candidates: CoverCandidate[]): Promise<number> => {
  if (candidates.length === 0) return -1;
  let best = 0;
  let bestScore = -Infinity;
  for (let i = 0; i < candidates.length; i++) {
    const score = await scoreCandidate(candidates[i].blob);
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  }
  return best;
};

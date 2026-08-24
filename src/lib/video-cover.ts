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

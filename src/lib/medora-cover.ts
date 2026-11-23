import { signedUrl } from "@/lib/storage-urls";

/** Extract a partner-video frame without downloading the whole video into browser memory. */
export async function createMedoraCover(storagePath: string): Promise<string> {
  const url = await signedUrl("short-videos", storagePath);
  if (!url) throw new Error("Could not access imported video");
  const video = document.createElement("video");
  video.crossOrigin = "anonymous";
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.hidden = true;
  document.body.appendChild(video);
  const wait = (event: string, start: () => void) => new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer);
      video.removeEventListener(event, ready);
      video.removeEventListener("error", failed);
    };
    const ready = () => { cleanup(); resolve(); };
    const failed = () => { cleanup(); reject(new Error("Video frame unavailable")); };
    const timer = setTimeout(failed, 20000);
    video.addEventListener(event, ready, { once: true });
    video.addEventListener("error", failed, { once: true });
    try { start(); } catch { failed(); }
  });
  try {
    await wait("loadeddata", () => { video.src = url; video.load(); });
    try {
      await wait("seeked", () => { video.currentTime = 1.5; });
    } catch {
      await wait("seeked", () => { video.currentTime = 0.5; });
    }
    if (!video.videoWidth || !video.videoHeight) throw new Error("Video has no frame");
    const canvas = document.createElement("canvas");
    canvas.width = 540;
    canvas.height = Math.round(540 * video.videoHeight / video.videoWidth);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL("image/webp", 0.8);
    if (!image.startsWith("data:image/webp;base64,")) throw new Error("WebP export unavailable");
    return image;
  } finally {
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.remove();
  }
}
/**
 * Canvas helpers for producing consistently-sized, cropped images.
 * Used by the admin console so every doctor photo has the same aspect ratio.
 */

export type CropPixels = { x: number; y: number; width: number; height: number };

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("图片加载失败"));
    img.src = src;
  });

/**
 * Crop `imageSrc` (object URL or data URL) to the given pixel region and
 * export it as a WebP file of exactly `outSize` × `outSize`.
 */
export const cropImageToFile = async (
  imageSrc: string,
  crop: CropPixels,
  fileName: string,
  outSize = 800,
): Promise<File> => {
  const img = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = outSize;
  canvas.height = outSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("当前浏览器不支持图片裁剪");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, outSize, outSize);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.9));
  if (!blob) throw new Error("裁剪导出失败，请换一张图片重试");
  const base = fileName.replace(/\.[^.]+$/, "") || "photo";
  return new File([blob], `${base}.webp`, { type: "image/webp" });
};

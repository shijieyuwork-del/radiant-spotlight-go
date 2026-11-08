const originals = import.meta.glob([
  "../assets/real-photos/**/*.webp", "../assets/clinics/*.{jpg,webp}",
  "../assets/city-*.{jpg,webp}", "../assets/journey-*.webp", "../assets/procedures/*.{jpg,webp}",
  "../assets/chinese-doctor-team-candid-v1.webp",
], { eager: true, import: "default", query: "?url" }) as Record<string, string>;

const variants = import.meta.glob([
  "../assets/real-photos/**/*.webp", "../assets/clinics/*.{jpg,webp}",
  "../assets/city-*.{jpg,webp}", "../assets/journey-*.webp", "../assets/procedures/*.{jpg,webp}",
  "../assets/chinese-doctor-team-candid-v1.webp",
], { eager: true, import: "default", query: "?w=480;800;1200&format=webp&withoutEnlargement&as=srcset" }) as Record<string, string>;

const byUrl = new Map(Object.entries(originals).map(([path, url]) => [url, variants[path]]));

/** Remote/private photos retain their authorized URL; local originals stay valid fallbacks. */
export function responsiveImageProps(src: string, sizes = "(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) 45vw, 400px") {
  const srcSet = byUrl.get(src);
  return srcSet ? { srcSet, sizes } : {};
}
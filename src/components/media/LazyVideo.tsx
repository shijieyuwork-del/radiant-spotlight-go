import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  poster?: string;
  alt: string;
  className?: string;
  /** Show native controls once mounted (click poster to start). */
  controls?: boolean;
  /** Autoplay muted loop once near the viewport (preview tiles). */
  previewLoop?: boolean;
  width?: number;
  height?: number;
};

/** Poster as lazy <img>; the <video> mounts only near the viewport or after a tap. */
export default function LazyVideo({ src, poster, alt, className = "", controls = false, previewLoop = false, width = 540, height = 960 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [pendingPlay, setPendingPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setNear(true); io.disconnect(); }
    }, { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  useEffect(() => {
    if (pendingPlay) videoRef.current?.play().catch(() => undefined);
  }, [pendingPlay]);

  const mounted = previewLoop ? near || pendingPlay : pendingPlay;

  return (
    <div ref={ref} className={`relative ${className}`}>
      {mounted ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          muted={previewLoop}
          loop={previewLoop}
          autoPlay={previewLoop}
          controls={controls}
          preload="metadata"
          className="absolute inset-0 size-full bg-muted object-cover"
        />
      ) : (
        <>
        {/* Static HTML keeps the original video element for crawlers and no-JS readers; browsers with JS never mount it. */}
        <noscript><video src={src} poster={poster} controls={controls} playsInline preload="none" className="absolute inset-0 size-full bg-muted object-cover" /></noscript>
        <button type="button" onClick={(e) => { if (controls) { e.preventDefault(); e.stopPropagation(); setPendingPlay(true); } }} className="absolute inset-0 size-full" aria-label={alt} tabIndex={controls ? 0 : -1}>
          {poster ? <img src={poster} alt={alt} loading="lazy" decoding="async" width={width} height={height} className="size-full bg-muted object-cover" /> : <span className="block size-full bg-muted" />}
        </button>
        </>
      )}
    </div>
  );
}

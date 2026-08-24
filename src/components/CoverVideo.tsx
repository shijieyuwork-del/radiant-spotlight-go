import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import {
  COVER_FALLBACK_TEXT,
  DEFAULT_VIDEO_POSTER,
  coverFallbackReason,
  probeImage,
  type CoverFallbackReason,
} from "@/lib/cover-fallback";

type CoverVideoProps = {
  src: string;
  /** 数据库里的 cover_path（用于判断“未生成”还是“文件缺失”） */
  coverPath: string | null | undefined;
  /** 封面签名 URL（可能为空或已失效） */
  coverUrl: string | null | undefined;
  className?: string;
  controls?: boolean;
  /** 是否在界面上显示兜底原因徽标（管理后台等内部页面使用） */
  showReason?: boolean;
};

/**
 * 带封面兜底逻辑的 <video>：
 * cover_path 不存在或封面加载失败时自动切换为默认海报，
 * 并可通过 showReason 在界面上提示具体原因。
 */
const CoverVideo = ({ src, coverPath, coverUrl, className, controls = true, showReason = false }: CoverVideoProps) => {
  const [poster, setPoster] = useState<string>(coverUrl || DEFAULT_VIDEO_POSTER);
  const [reason, setReason] = useState<CoverFallbackReason>(() => coverFallbackReason(coverPath, false));

  useEffect(() => {
    let cancelled = false;
    if (!coverPath) {
      setPoster(DEFAULT_VIDEO_POSTER);
      setReason("missing");
      return;
    }
    if (!coverUrl) {
      setPoster(DEFAULT_VIDEO_POSTER);
      setReason("unavailable");
      return;
    }
    setPoster(coverUrl);
    setReason(null);
    void probeImage(coverUrl).then((ok) => {
      if (cancelled || ok) return;
      setPoster(DEFAULT_VIDEO_POSTER);
      setReason("unavailable");
    });
    return () => {
      cancelled = true;
    };
  }, [coverPath, coverUrl]);

  return (
    <div className="relative">
      <video src={src} poster={poster} controls={controls} playsInline preload="metadata" className={className} />
      {showReason && reason && (
        <span
          className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-semibold text-white shadow-soft"
          title={COVER_FALLBACK_TEXT[reason]}
        >
          <ImageOff className="size-3" />
          {COVER_FALLBACK_TEXT[reason]}
        </span>
      )}
    </div>
  );
};

export default CoverVideo;

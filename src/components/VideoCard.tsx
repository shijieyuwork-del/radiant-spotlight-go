import { Heart, MessageCircle, Play, EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

interface VideoCardProps {
  src: string;
  user: string;
  caption: string;
  likes: string;
  comments: string;
  treatment: string;
  tilt?: number;
}

const VideoCard = ({ src, user, caption, likes, comments, treatment, tilt = 0 }: VideoCardProps) => {
  const { privacyMode, setPrivacyMode } = useI18n();
  const [localOverride, setLocalOverride] = useState<boolean | null>(null);
  const blurred = localOverride ?? privacyMode;

  return (
    <div
      className="group relative aspect-[9/16] w-full rounded-[2rem] overflow-hidden glow-card cursor-pointer"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <img
        src={src}
        alt={caption}
        loading="lazy"
        className={`absolute inset-0 size-full object-cover transition-all duration-700 group-hover:scale-110 ${blurred ? "blur-[14px] scale-110" : ""}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
        <span className="pill bg-background/90 backdrop-blur text-foreground">#{treatment}</span>
        {blurred && (
          <span className="pill bg-background/90 backdrop-blur text-foreground text-[10px]">
            <EyeOff className="size-3" /> Privacy mode
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const next = !blurred;
          setLocalOverride(next);
          setPrivacyMode(next);
        }}
        aria-label={blurred ? "Reveal video" : "Blur video"}
        className="absolute top-3 right-3 size-8 rounded-full bg-background/90 backdrop-blur grid place-items-center shadow-soft hover:scale-110 transition-transform"
      >
        {blurred ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
      </button>

      {!blurred && (
        <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="size-14 rounded-full bg-background/90 backdrop-blur grid place-items-center shadow-pop">
            <Play className="size-5 fill-foreground" />
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <p className="text-xs font-medium opacity-90">@{user}</p>
        <p className="text-sm font-semibold leading-tight mt-1 line-clamp-2">{caption}</p>
        <div className="flex items-center gap-3 mt-2 text-xs">
          <span className="flex items-center gap-1"><Heart className="size-3.5 fill-white" /> {likes}</span>
          <span className="flex items-center gap-1"><MessageCircle className="size-3.5" /> {comments}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;

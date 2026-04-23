import { Heart, MessageCircle, Play } from "lucide-react";

interface VideoCardProps {
  src: string;
  user: string;
  caption: string;
  likes: string;
  comments: string;
  treatment: string;
  tilt?: number;
}

const VideoCard = ({ src, user, caption, likes, comments, treatment, tilt = 0 }: VideoCardProps) => (
  <div
    className="group relative aspect-[9/16] w-full rounded-[2rem] overflow-hidden glow-card cursor-pointer"
    style={{ transform: `rotate(${tilt}deg)` }}
  >
    <img src={src} alt={caption} className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

    <div className="absolute top-3 left-3">
      <span className="pill bg-background/90 backdrop-blur text-foreground">#{treatment}</span>
    </div>

    <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="size-14 rounded-full bg-background/90 backdrop-blur grid place-items-center shadow-pop">
        <Play className="size-5 fill-foreground" />
      </div>
    </div>

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

export default VideoCard;

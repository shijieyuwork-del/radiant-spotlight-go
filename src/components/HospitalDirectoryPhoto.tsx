import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import type { RealHospitalPhoto } from "@/data/realHospitalPhotos";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";
import { HospitalPhotoCredit } from "@/components/HospitalPhotoCredit";
import { cn } from "@/lib/utils";

export function HospitalDirectoryPhoto({ photo, name, href, priority = false, className, children, reserveCreditSpace = false }: {
  photo?: RealHospitalPhoto; name: string; href?: string; priority?: boolean; className?: string;
  children?: ReactNode; reserveCreditSpace?: boolean;
}) {
  const { lang } = useAsia();
  const [failed, setFailed] = useState(false);
  const availablePhoto = failed ? undefined : photo;
  const portrait = photo?.originalHeight && photo?.originalWidth && photo.originalHeight > photo.originalWidth;

  const visual = (
      <div className={cn("relative aspect-[2/1] w-full overflow-hidden bg-muted", className)}>
        {availablePhoto ? (
          <img
            src={availablePhoto.src}
            alt={name}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="size-full outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
            style={{
              objectFit: availablePhoto.objectFit ?? (portrait ? "contain" : "cover"),
              objectPosition: availablePhoto.objectPosition ?? "50% 28%",
              // Restrained editorial grade for real exteriors: lift overcast scenes
              // and reduce distracting street noise without changing identity.
              filter: "brightness(1.08) contrast(1.04) saturate(0.92)",
            }}
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-3 bg-primary/[0.04] text-foreground">
            <Building2 className="size-9 text-foreground" aria-hidden="true" />
            <span className="text-xs">{asiaCopy(lang, {
              en: "Photo not available", zh: "暂无实拍图片", ru: "Фото пока нет", es: "Foto no disponible",
              th: "ยังไม่มีภาพถ่าย", ms: "Foto tidak tersedia",
            })}</span>
          </div>
        )}
      </div>
  );

  return (
    <>
      {href ? (
        <Link to={href} aria-label={asiaCopy(lang, { en: `View ${name}`, zh: `查看${name}`, ru: `Подробнее: ${name}`, es: `Ver ${name}`, th: `ดู ${name}`, ms: `Lihat ${name}` })}
          className="block shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-foreground">
          {visual}
        </Link>
      ) : visual}
      {children}
      {availablePhoto ? <HospitalPhotoCredit photo={availablePhoto} /> : reserveCreditSpace && <div className="min-h-[45px] shrink-0 border-t border-border/50" aria-hidden="true" />}
    </>
  );
}

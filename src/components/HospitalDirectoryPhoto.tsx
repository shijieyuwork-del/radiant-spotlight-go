import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import type { RealHospitalPhoto } from "@/data/realHospitalPhotos";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";
import { HospitalPhotoCredit } from "@/components/HospitalPhotoCredit";
import { cn } from "@/lib/utils";

export function HospitalDirectoryPhoto({ photo, name, href, priority = false, className }: {
  photo?: RealHospitalPhoto; name: string; href?: string; priority?: boolean; className?: string;
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
            className="size-full"
            style={{
              objectFit: availablePhoto.objectFit ?? (portrait ? "contain" : "cover"),
              objectPosition: availablePhoto.objectPosition ?? "50% 35%",
            }}
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-3 bg-primary/[0.04] text-muted-foreground">
            <Building2 className="size-9 text-primary/45" aria-hidden="true" />
            <span className="text-xs">{asiaCopy(lang, {
              en: "Photo not available", zh: "暂无实拍图片", ru: "Фото пока нет", es: "Foto no disponible",
            })}</span>
          </div>
        )}
      </div>
  );

  return (
    <>
      {href ? (
        <Link to={href} aria-label={asiaCopy(lang, { en: `View ${name}`, zh: `查看${name}`, ru: `Подробнее: ${name}`, es: `Ver ${name}` })}
          className="block focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-primary">
          {visual}
        </Link>
      ) : visual}
      {availablePhoto && <HospitalPhotoCredit photo={availablePhoto} />}
    </>
  );
}

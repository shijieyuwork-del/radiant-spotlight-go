import { useState } from "react";
import { Building2 } from "lucide-react";
import type { RealHospitalPhoto } from "@/data/realHospitalPhotos";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";
import { HospitalPhotoCredit } from "@/components/HospitalPhotoCredit";

export function HospitalDirectoryPhoto({ photo, name }: { photo?: RealHospitalPhoto; name: string }) {
  const { lang } = useAsia();
  const [failed, setFailed] = useState(false);
  const availablePhoto = failed ? undefined : photo;
  const portrait = photo?.originalHeight && photo?.originalWidth && photo.originalHeight > photo.originalWidth;

  return (
    <>
      <div className="relative aspect-[2/1] w-full overflow-hidden bg-muted">
        {availablePhoto ? (
          <img
            src={availablePhoto.src}
            alt={name}
            loading="lazy"
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
      {availablePhoto && <HospitalPhotoCredit photo={availablePhoto} />}
    </>
  );
}

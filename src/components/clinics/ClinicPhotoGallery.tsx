import { useState } from "react";
import { HospitalDirectoryPhoto } from "@/components/HospitalDirectoryPhoto";
import type { RealHospitalPhoto } from "@/data/realHospitalPhotos";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";

export function ClinicPhotoGallery({ photos, name }: { photos: RealHospitalPhoto[]; name: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const { lang } = useAsia();
  const active = Math.max(0, photos.findIndex((photo) => photo.src === selected));
  const photo = photos[active];
  return <div className="min-w-0 space-y-3">
    <figure className="overflow-hidden rounded-2xl border border-border/70">
      <HospitalDirectoryPhoto key={photo?.src ?? "no-photo"} photo={photo} name={name} priority className="aspect-[4/3] sm:aspect-[3/2]" />
    </figure>
    {photos.length > 1 && <>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6" role="group" aria-label={asiaCopy(lang, { en: "Hospital photos", zh: "医院相册", ru: "Фотографии клиники", es: "Fotos de la clínica" })}>
        {photos.map((item, index) => <button key={`${item.src}-${index}`} type="button" aria-pressed={index === active}
          aria-label={asiaCopy(lang, { en: `View photo ${index + 1} of ${photos.length}`, zh: `查看第 ${index + 1} 张照片，共 ${photos.length} 张`, ru: `Фото ${index + 1} из ${photos.length}`, es: `Ver foto ${index + 1} de ${photos.length}` })}
          onClick={() => setSelected(item.src)}
          className={`overflow-hidden rounded-lg border-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${index === active ? "border-foreground" : "border-transparent hover:border-primary"}`}>
          <img src={item.src} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
        </button>)}
      </div>
      <p className="text-right text-xs tabular-nums text-muted-foreground" aria-live="polite">{active + 1} / {photos.length}</p>
    </>}
  </div>;
}

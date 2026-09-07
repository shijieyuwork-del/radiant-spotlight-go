import type { RealHospitalPhoto } from "@/data/realHospitalPhotos";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";

export function HospitalPhotoCredit({ photo }: { photo: RealHospitalPhoto }) {
  const { lang } = useAsia();
  return (
    <details className="border-t border-border/50 bg-background/80 px-4 py-2 text-xs leading-5 text-muted-foreground">
      <summary className="cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        {asiaCopy(lang, {
          en: "Photo credit", zh: "图片来源", ru: "Источник фотографии", es: "Créditos de la foto",
        })}
      </summary>
      <p className="mt-2">{photo.description}</p>
      <p>
        <a href={photo.sourceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">{photo.author}</a>
        {" · "}
        <a href={photo.licenseUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">{photo.license}</a>
      </p>
      <p>{photo.modifications}</p>
    </details>
  );
}

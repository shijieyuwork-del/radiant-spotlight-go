import type { RealHospitalPhoto } from "@/data/realHospitalPhotos";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";

export function HospitalPhotoCredit({ photo }: { photo: RealHospitalPhoto }) {
  const { lang } = useAsia();
  return (
    <details className="shrink-0 border-t border-border/50 bg-background/80 px-5 text-xs leading-5 text-foreground">
      <summary className="min-h-11 cursor-pointer content-center rounded-sm py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground">
        {asiaCopy(lang, {
          en: "Photo credit", zh: "图片来源", ru: "Источник фотографии", es: "Créditos de la foto",
          th: "เครดิตภาพ", ms: "Kredit foto",
        })}
      </summary>
      <p className="break-words">{photo.description}</p>
      <p className="mt-2 break-words">
        <a href={photo.sourceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">{photo.author}</a>
        {" · "}
        <a href={photo.licenseUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">{photo.license}</a>
      </p>
      <p className="mt-2 break-words pb-4">{photo.modifications}</p>
    </details>
  );
}

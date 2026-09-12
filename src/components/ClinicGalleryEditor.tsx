import { useEffect, useRef, useState } from "react";
import { ImagePlus, ImageOff, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PHOTO_RULES, validateMediaFile } from "@/lib/media-validation";
import { MAX_CLINIC_PHOTOS, type ClinicGalleryItem } from "@/lib/clinic-gallery";

export type DraftClinicPhoto = {
  key: string;
  item: ClinicGalleryItem | null;
  url: string;
  file?: File;
};

function PhotoPreview({ photo }: { photo: DraftClinicPhoto }) {
  const [preview, setPreview] = useState(photo.url);
  useEffect(() => {
    if (!photo.file) { setPreview(photo.url); return; }
    const url = URL.createObjectURL(photo.file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo.file, photo.url]);
  return preview ? <img src={preview} alt="医院照片预览" className="aspect-[4/3] w-full object-cover" />
    : <div className="grid aspect-[4/3] place-items-center bg-muted text-sm text-muted-foreground"><ImageOff />预览暂不可用</div>;
}

export default function ClinicGalleryEditor({ photos, onChange, disabled = false }: {
  photos: DraftClinicPhoto[];
  onChange: (photos: DraftClinicPhoto[]) => void;
  disabled?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [replaceKey, setReplaceKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const choose = (key: string | null) => {
    setReplaceKey(key);
    setError("");
    if (input.current) {
      input.current.multiple = key === null;
      input.current.click();
    }
  };
  const receive = (files: File[]) => {
    if (!files.length || disabled) return;
    if (!replaceKey && photos.length + files.length > MAX_CLINIC_PHOTOS) {
      setError(`每家医院最多 6 张照片，还可以添加 ${MAX_CLINIC_PHOTOS - photos.length} 张。`);
      return;
    }
    const invalid = files.map((file) => validateMediaFile(file, PHOTO_RULES)).find(Boolean);
    if (invalid) { setError(invalid); return; }
    if (replaceKey) {
      onChange(photos.map((photo) => photo.key === replaceKey ? { key: photo.key, item: null, url: "", file: files[0] } : photo));
    } else {
      onChange([...photos, ...files.map((file) => ({ key: crypto.randomUUID(), item: null, url: "", file }))]);
    }
    setError("");
  };
  return <section className="space-y-3" aria-label="医院照片管理">
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-sm font-medium">医院照片 <span className="text-muted-foreground">{photos.length} / 6</span></h3>
      <Button type="button" size="sm" variant="outline" disabled={disabled || photos.length >= MAX_CLINIC_PHOTOS} onClick={() => choose(null)}>
        <ImagePlus className="mr-1.5 size-4" />添加照片
      </Button>
    </div>
    <p className="text-xs text-muted-foreground">第一张为封面；支持 JPG、PNG、WebP，每张不超过 10 MB。保存后才会更新网站。</p>
    <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden disabled={disabled}
      onChange={(event) => { receive(Array.from(event.target.files ?? [])); event.target.value = ""; }} />
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {!photos.length && <p className="rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">暂无照片，点击「添加照片」上传。</p>}
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {photos.map((photo, index) => <div key={photo.key} className="overflow-hidden rounded-xl border bg-card">
        <PhotoPreview photo={photo} />
        <div className="space-y-1 p-2">
          <div className="flex items-center justify-between text-xs">
            <span>{index === 0 ? "封面" : `照片 ${index + 1}`}</span>
            {photo.item?.kind === "original" && <span className="text-muted-foreground">网站原图</span>}
          </div>
          <div className="flex flex-wrap gap-1">
            <Button type="button" size="sm" variant="ghost" className="px-2" disabled={disabled} onClick={() => choose(photo.key)} aria-label={`替换照片 ${index + 1}`}>替换</Button>
            <Button type="button" size="icon" variant="ghost" className="size-9 text-destructive" disabled={disabled}
              aria-label={`删除照片 ${index + 1}`} onClick={() => { onChange(photos.filter((item) => item.key !== photo.key)); setError(""); }}><Trash2 className="size-4" /></Button>
            {index > 0 && <Button type="button" size="icon" variant="ghost" className="size-9" disabled={disabled}
              aria-label={`将照片 ${index + 1} 设为封面`} onClick={() => onChange([photo, ...photos.filter((item) => item.key !== photo.key)])}><Star className="size-4" /></Button>}
          </div>
        </div>
      </div>)}
    </div>
  </section>;
}

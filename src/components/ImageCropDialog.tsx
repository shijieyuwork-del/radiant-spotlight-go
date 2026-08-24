import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cropImageToFile, type CropPixels } from "@/lib/image-crop";

type ImageCropDialogProps = {
  /** The source image to crop; dialog opens when non-null */
  file: File | null;
  title?: string;
  onCancel: () => void;
  onConfirm: (cropped: File) => void;
};

/**
 * Square (1:1) crop dialog — every doctor photo is normalized to the same
 * 800×800 WebP so cards and profile pages render consistent previews.
 */
const ImageCropDialog = ({ file, title = "裁剪照片（1:1 正方形）", onCancel, onConfirm }: ImageCropDialogProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState<CropPixels | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!file) { setImageUrl(null); return; }
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onCropComplete = useCallback((_: unknown, croppedPixels: CropPixels) => {
    setPixels(croppedPixels);
  }, []);

  const confirm = async () => {
    if (!file || !imageUrl || !pixels) return;
    setBusy(true);
    try {
      onConfirm(await cropImageToFile(imageUrl, pixels, file.name));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "裁剪失败");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={!!file} onOpenChange={(open) => { if (!open && !busy) onCancel(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
          {imageUrl && (
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>
        <div className="flex items-center gap-3 px-1">
          <span className="text-xs text-muted-foreground shrink-0">缩放</span>
          <Slider value={[zoom]} min={1} max={3} step={0.05} onValueChange={([v]) => setZoom(v)} />
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onCancel} disabled={busy}>取消</Button>
          <Button onClick={() => void confirm()} disabled={busy || !pixels}>
            {busy ? <Loader2 className="animate-spin" /> : "确认裁剪"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropDialog;

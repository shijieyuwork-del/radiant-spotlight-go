import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, ImagePlus, Loader2, RefreshCw, Stethoscope, Trash2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { signedUrls } from "@/lib/storage-urls";
import { isUploadCancelled, replaceMedia, uploadMedia } from "@/lib/upload-media";
import { PHOTO_RULES, fieldForUploadError, validateMediaFile } from "@/lib/media-validation";
import { scrollToFirstError } from "@/lib/scroll-to-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import ImageCropDialog from "@/components/ImageCropDialog";
import FileDropZone from "@/components/FileDropZone";
import FieldError from "@/components/FieldError";

type Expert = {
  id: string; name: string; title: string; hospital: string; city: string;
  specialties: string[]; bio: string; credentials: string | null;
  photo_path: string | null; status: string; photoUrl?: string;
};

const ADMIN = "shijieyuwork@gmail.com";

type FieldKey = "photo" | "name" | "title" | "hospital" | "city" | "bio";
type FieldErrors = Partial<Record<FieldKey, string>>;

const errorInputClass = "border-destructive focus-visible:ring-destructive";

/** 已裁剪待发布的照片（多文件拖入 → 逐个裁剪 → 暂存备选） */
type StagedPhoto = { id: string; file: File; url: string };
/** 裁剪队列项：target 决定裁剪结果用于新建表单还是更换某专家照片 */
type CropQueueItem = { file: File; target: "create" | Expert };

export default function DoctorAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [experts, setDoctors] = useState<Expert[]>([]);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [hospital, setHospital] = useState("");
  const [city, setCity] = useState("上海");
  const [specialties, setSpecialties] = useState("");
  const [bio, setBio] = useState("");
  const [credentials, setCredentials] = useState("");
  const [languages, setLanguages] = useState("中文, English");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [replaceProgress, setReplaceProgress] = useState(0);
  // 多文件流程：裁剪队列（逐个弹出裁剪框）+ 已裁剪暂存照片（点击选择本次发布用哪张）
  const [cropQueue, setCropQueue] = useState<CropQueueItem[]>([]);
  const [staged, setStaged] = useState<StagedPhoto[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // 上传取消与失败重试
  const [submitRetry, setSubmitRetry] = useState<"failed" | "cancelled" | null>(null);
  const [failedReplace, setFailedReplace] = useState<{ expertId: string; file: File } | null>(null);
  const submitAbortRef = useRef<AbortController | null>(null);
  const replaceAbortRef = useRef<AbortController | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const photo = staged.find((s) => s.id === selectedId)?.file ?? null;
  const cropSource = cropQueue[0]?.file ?? null;
  const cropTarget = cropQueue[0]?.target ?? null;

  /** 多文件入口：逐个预校验（兜底，dropzone 已拦一道），合法文件进入裁剪队列 */
  const enqueuePhotos = (files: File[], target: "create" | Expert) => {
    const valid: File[] = [];
    for (const f of files) {
      const invalid = validateMediaFile(f, PHOTO_RULES);
      if (invalid) {
        if (target === "create") setErrors((prev) => ({ ...prev, photo: invalid }));
        toast.error(invalid);
      } else {
        valid.push(f);
      }
    }
    if (valid.length > 0) {
      setCropQueue((prev) => [...prev, ...valid.map((file) => ({ file, target }))]);
      if (valid.length > 1) toast.info(`已加入 ${valid.length} 张照片，将逐个打开裁剪`);
    }
  };

  const onCropped = (cropped: File) => {
    const current = cropQueue[0];
    if (current) {
      if (current.target === "create") {
        const item: StagedPhoto = { id: crypto.randomUUID(), file: cropped, url: URL.createObjectURL(cropped) };
        setStaged((prev) => [...prev, item]);
        setSelectedId(item.id);
        clearError("photo");
      } else {
        void replacePhoto(current.target, cropped);
      }
    }
    // 弹出队列下一张（若有），裁剪框会自动打开
    setCropQueue((prev) => prev.slice(1));
  };

  const removeStaged = (id: string) => {
    const target = staged.find((s) => s.id === id);
    if (target) URL.revokeObjectURL(target.url);
    const next = staged.filter((s) => s.id !== id);
    setStaged(next);
    if (selectedId === id) setSelectedId(next[0]?.id ?? null);
  };

  const clearStaged = () => {
    setStaged((prev) => { prev.forEach((s) => URL.revokeObjectURL(s.url)); return []; });
    setSelectedId(null);
  };

  const clearError = (key: FieldKey) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  const load = async () => {
    const { data, error } = await supabase.from("doctors").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else {
      const rows = (data ?? []) as Expert[];
      const urls = await signedUrls("doctor-photos", rows.map((d) => d.photo_path));
      setDoctors(rows.map((d, i) => ({ ...d, photoUrl: urls[i] })));
    }
  };

  useEffect(() => {
    if (user?.email?.toLowerCase() === ADMIN) void load();
  }, [user]);

  if (authLoading) return <div />;
  if (!user) return <Navigate to="/auth?next=/admin/doctors" replace />;
  if (user.email?.toLowerCase() !== ADMIN) return <Navigate to="/" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 逐字段校验，标出所有问题字段
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "请填写专家姓名";
    if (!title.trim()) next.title = "请填写职称（如：主任专家）";
    if (!hospital.trim()) next.hospital = "请填写医院/机构名称";
    if (!city.trim()) next.city = "请填写城市";
    if (!bio.trim()) next.bio = "请填写专家介绍";
    if (photo) {
      const photoError = validateMediaFile(photo, PHOTO_RULES);
      if (photoError) next.photo = photoError;
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error(`表单有 ${Object.keys(next).length} 处需要修正，请查看标红字段`);
      scrollToFirstError(formRef.current);
      return;
    }

    setBusy(true);
    setSubmitRetry(null);
    const abort = new AbortController();
    submitAbortRef.current = abort;
    let photoPath: string | null = null;
    try {
      if (photo) {
        setProgress(0);
        photoPath = await uploadMedia("doctor-photos", photo, {
          signal: abort.signal,
          onProgress: setProgress,
          onRetry: (a, m) => toast.info(`连接中断，自动重试中（${a}/${m}）…`),
        });
      }
      const { error } = await supabase.from("doctors").insert({
        name: name.trim(), title: title.trim(), hospital: hospital.trim(), city: city.trim(),
        specialties: specialties.split(/[,，]/).map((x) => x.trim()).filter(Boolean),
        bio: bio.trim(), credentials: credentials || null, languages: languages || null,
        photo_path: photoPath, status: "published",
      });
      if (error) throw error;
      toast.success("专家资料已发布");
      setName(""); setTitle(""); setHospital(""); setSpecialties(""); setBio(""); setCredentials("");
      clearStaged();
      setErrors({});
      await load();
    } catch (error) {
      if (photoPath) await supabase.storage.from("doctor-photos").remove([photoPath]);
      if (isUploadCancelled(error)) {
        setSubmitRetry("cancelled");
        toast.info("已取消上传，点击“重试上传”可继续");
      } else {
        const message = error instanceof Error ? error.message : "发布失败";
        // 服务端的类型/大小/限流/配额错误归因到照片字段并标红
        if (fieldForUploadError(message)) {
          setErrors((prev) => ({ ...prev, photo: message }));
          scrollToFirstError(formRef.current);
        }
        setSubmitRetry("failed");
        toast.error(message);
      }
    } finally {
      setBusy(false);
      setProgress(null);
      submitAbortRef.current = null;
    }
  };

  const remove = async (d: Expert) => {
    if (!confirm(`确定删除 ${d.name}？`)) return;
    const { error } = await supabase.from("doctors").delete().eq("id", d.id);
    if (error) return toast.error(error.message);
    if (d.photo_path) await supabase.storage.from("doctor-photos").remove([d.photo_path]);
    setDoctors((x) => x.filter((i) => i.id !== d.id));
  };

  const replacePhoto = async (d: Expert, file: File | null) => {
    if (!file) return;
    const invalid = validateMediaFile(file, PHOTO_RULES);
    if (invalid) return toast.error(invalid);
    setReplacingId(d.id);
    setFailedReplace(null);
    setReplaceProgress(0);
    const abort = new AbortController();
    replaceAbortRef.current = abort;
    try {
      await replaceMedia("doctor-photos", d.id, file, {
        signal: abort.signal,
        onProgress: setReplaceProgress,
        onRetry: (a, m) => toast.info(`连接中断，自动重试中（${a}/${m}）…`),
      });
      toast.success(`${d.name} 的照片已更换`);
      await load();
    } catch (error) {
      setFailedReplace({ expertId: d.id, file });
      if (isUploadCancelled(error)) toast.info(`已取消更换 ${d.name} 的照片，可点击“重试更换”继续`);
      else toast.error(error instanceof Error ? error.message : "更换失败");
    } finally {
      setReplacingId(null);
      setReplaceProgress(0);
      replaceAbortRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container h-16 flex items-center justify-between">
          <Link to="/upload" className="inline-flex gap-2 text-sm font-semibold"><ArrowLeft className="size-4" />视频后台</Link>
          <div className="flex items-center gap-4">
            <Link to="/admin/audit" className="text-sm text-muted-foreground hover:text-primary">审计报表</Link>
            <span className="font-semibold">专家管理</span>
          </div>
        </div>
      </header>
      <main className="container py-8 grid lg:grid-cols-[420px_1fr] gap-8">
        <section className="rounded-3xl bg-card shadow-pop p-6 h-fit">
          <div className="flex gap-3 items-center mb-6"><Stethoscope className="text-primary" /><h1 className="font-display text-2xl">添加专家资料</h1></div>
          <form onSubmit={submit} className="space-y-4" noValidate ref={formRef}>
            <div>
              <Label htmlFor="expert-photo">专家照片</Label>
              <FileDropZone
                id="expert-photo"
                accept="image/jpeg,image/png,image/webp"
                rules={PHOTO_RULES}
                multiple
                invalid={!!errors.photo}
                fileName={photo ? `已选择：${photo.name}` : null}
                onFiles={(files) => enqueuePhotos(files, "create")}
              />
              {staged.length > 0 && (
                <div className="mt-2 space-y-2 rounded-xl border bg-muted/30 p-2.5" data-testid="photo-preview-card">
                  <p className="text-xs text-muted-foreground">
                    已裁剪 {staged.length} 张（1:1，800×800 WebP），点击选择本次发布使用的照片
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {staged.map((s) => (
                      <div key={s.id} className="relative">
                        <button
                          type="button"
                          onClick={() => setSelectedId(s.id)}
                          aria-pressed={s.id === selectedId}
                          aria-label={`选择照片 ${s.file.name}`}
                          className={`block size-16 overflow-hidden rounded-xl border-2 transition-all ${s.id === selectedId ? "border-primary ring-2 ring-primary/30" : "border-transparent opacity-70 hover:opacity-100"}`}
                        >
                          <img src={s.url} alt={`候选照片 ${s.file.name}`} className="size-full object-cover" />
                        </button>
                        <button
                          type="button"
                          aria-label={`移除照片 ${s.file.name}`}
                          onClick={() => removeStaged(s.id)}
                          className="absolute -right-1.5 -top-1.5 rounded-full border bg-background p-0.5 shadow-soft text-muted-foreground hover:text-destructive"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {photo && (
                    <p className="text-[11px] text-muted-foreground truncate" title={photo.name}>
                      当前选择：{photo.name} · {(photo.size / 1024).toFixed(0)} KB，可重新拖入图片追加
                    </p>
                  )}
                </div>
              )}
              {errors.photo
                ? <FieldError message={errors.photo} rules={PHOTO_RULES} fileName={photo?.name} />
                : staged.length === 0 && <p className="text-xs text-muted-foreground mt-1">选择后可裁剪为统一正方形，支持一次多选逐个裁剪</p>}
            </div>
            <Field label="专家姓名 *" value={name} error={errors.name} set={(v) => { setName(v); clearError("name"); }} />
            <Field label="职称 *" value={title} error={errors.title} set={(v) => { setTitle(v); clearError("title"); }} />
            <Field label="医院/机构 *" value={hospital} error={errors.hospital} set={(v) => { setHospital(v); clearError("hospital"); }} />
            <Field label="城市 *" value={city} error={errors.city} set={(v) => { setCity(v); clearError("city"); }} />
            <Field label="擅长项目（逗号分隔）" value={specialties} set={setSpecialties} />
            <Field label="语言" value={languages} set={setLanguages} />
            <div>
              <Label htmlFor="expert-bio">专家介绍 *</Label>
              <Textarea
                id="expert-bio"
                value={bio}
                rows={5}
                aria-invalid={!!errors.bio}
                className={errors.bio ? errorInputClass : undefined}
                onChange={(e) => { setBio(e.target.value); clearError("bio"); }}
              />
              {errors.bio && <FieldError message={errors.bio} />}
            </div>
            <div>
              <Label htmlFor="expert-credentials">资质与认证</Label>
              <Textarea id="expert-credentials" value={credentials} onChange={(e) => setCredentials(e.target.value)} rows={3} />
            </div>
            {busy && progress !== null && (
              <div className="space-y-1.5" aria-live="polite">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">{progress < 100 ? `上传中 ${progress}%` : "服务器处理中…"}</p>
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => submitAbortRef.current?.abort()}
                  >
                    <X className="size-3.5 mr-1" />取消上传
                  </Button>
                </div>
              </div>
            )}
            {!busy && submitRetry && (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed p-2.5 text-xs text-muted-foreground" data-testid="submit-retry">
                {submitRetry === "cancelled" ? "上次上传已取消。" : "上次上传失败。"}
                <Button type="button" variant="outline" size="sm" className="h-7 rounded-full px-3 text-xs" onClick={() => formRef.current?.requestSubmit()}>
                  <RefreshCw className="size-3.5 mr-1" />重试上传
                </Button>
              </div>
            )}
            <Button disabled={busy} className="w-full rounded-full">
              {busy ? <Loader2 className="animate-spin" /> : <><UploadCloud className="size-4 mr-2" />发布专家</>}
            </Button>
          </form>
        </section>
        <section>
          <h2 className="font-display text-2xl mb-4">已添加专家（{experts.length}）</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {experts.map((d) => {
              const photoUrl = d.photoUrl ?? "";
              return (
                <article key={d.id} className="rounded-2xl bg-card p-4 flex gap-4">
                  {photoUrl ? <img src={photoUrl} className="size-20 rounded-xl object-cover" /> : <div className="size-20 rounded-xl bg-muted" />}
                  <div className="min-w-0 flex-1">
                    <Link to={`/doctors/profile/${d.id}`} className="font-semibold hover:text-primary">{d.name}</Link>
                    <p className="text-xs text-muted-foreground">{d.title} · {d.city}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <label className="inline-flex">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          disabled={replacingId === d.id}
                          onChange={(e) => { enqueuePhotos(Array.from(e.target.files ?? []), d); e.target.value = ""; }}
                        />
                        <span className={`inline-flex items-center text-sm font-medium text-primary hover:underline cursor-pointer ${replacingId === d.id ? "opacity-50 pointer-events-none" : ""}`}>
                          {replacingId === d.id ? <Loader2 className="size-4 mr-1 animate-spin" /> : <ImagePlus className="size-4 mr-1" />}更换照片
                        </span>
                      </label>
                      {replacingId === d.id && (
                        <span className="flex-1 max-w-28 space-y-1 inline-block">
                          <Progress value={replaceProgress} className="h-1.5" />
                          <span className="text-[10px] text-muted-foreground flex items-center gap-2">
                            {replaceProgress < 100 ? `${replaceProgress}%` : "处理中…"}
                            <button type="button" className="text-muted-foreground hover:text-destructive underline" onClick={() => replaceAbortRef.current?.abort()}>取消</button>
                          </span>
                        </span>
                      )}
                      {failedReplace?.expertId === d.id && replacingId !== d.id && (
                        <button
                          type="button"
                          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                          onClick={() => { const f = failedReplace; setFailedReplace(null); void replacePhoto(d, f.file); }}
                        >
                          <RefreshCw className="size-4 mr-1" />重试更换
                        </button>
                      )}
                      <Button variant="ghost" size="sm" className="text-destructive px-0" onClick={() => void remove(d)}>
                        <Trash2 className="size-4 mr-1" />删除
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <ImageCropDialog
        file={cropSource}
        title={cropQueue.length > 1 ? `裁剪照片（1:1 正方形）· 还有 ${cropQueue.length - 1} 张待裁剪` : undefined}
        onCancel={() => setCropQueue((prev) => prev.slice(1))}
        onConfirm={onCropped}
      />
    </div>
  );
}

const Field = ({ label, value, set, error }: { label: string; value: string; set: (v: string) => void; error?: string }) => (
  <div>
    <Label>{label}</Label>
    <Input
      value={value}
      aria-invalid={!!error}
      className={error ? errorInputClass : undefined}
      onChange={(e) => set(e.target.value)}
    />
    {error && <FieldError message={error} />}
  </div>
);

import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, ImagePlus, Loader2, Stethoscope, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { signedUrls } from "@/lib/storage-urls";
import { replaceMedia, uploadMedia } from "@/lib/upload-media";
import { PHOTO_RULES, fieldForUploadError, validateMediaFile } from "@/lib/media-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

type Doctor = {
  id: string; name: string; title: string; hospital: string; city: string;
  specialties: string[]; bio: string; credentials: string | null;
  photo_path: string | null; status: string; photoUrl?: string;
};

const ADMIN = "shijieyuwork@gmail.com";

type FieldKey = "photo" | "name" | "title" | "hospital" | "city" | "bio";
type FieldErrors = Partial<Record<FieldKey, string>>;

const errorInputClass = "border-destructive focus-visible:ring-destructive";

export default function DoctorAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [busy, setBusy] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
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

  const clearError = (key: FieldKey) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  const load = async () => {
    const { data, error } = await supabase.from("doctors").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else {
      const rows = (data ?? []) as Doctor[];
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
    if (!name.trim()) next.name = "请填写医生姓名";
    if (!title.trim()) next.title = "请填写职称（如：主任医师）";
    if (!hospital.trim()) next.hospital = "请填写医院/机构名称";
    if (!city.trim()) next.city = "请填写城市";
    if (!bio.trim()) next.bio = "请填写医生介绍";
    if (photo) {
      const photoError = validateMediaFile(photo, PHOTO_RULES);
      if (photoError) next.photo = photoError;
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error(`表单有 ${Object.keys(next).length} 处需要修正，请查看标红字段`);
      return;
    }

    setBusy(true);
    let photoPath: string | null = null;
    try {
      if (photo) {
        setProgress(0);
        photoPath = await uploadMedia("doctor-photos", photo, {
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
      toast.success("医生资料已发布");
      setName(""); setTitle(""); setHospital(""); setSpecialties(""); setBio(""); setCredentials(""); setPhoto(null);
      setErrors({});
      await load();
    } catch (error) {
      if (photoPath) await supabase.storage.from("doctor-photos").remove([photoPath]);
      const message = error instanceof Error ? error.message : "发布失败";
      // 服务端的类型/大小/限流/配额错误归因到照片字段并标红
      if (fieldForUploadError(message)) setErrors((prev) => ({ ...prev, photo: message }));
      toast.error(message);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const remove = async (d: Doctor) => {
    if (!confirm(`确定删除 ${d.name}？`)) return;
    const { error } = await supabase.from("doctors").delete().eq("id", d.id);
    if (error) return toast.error(error.message);
    if (d.photo_path) await supabase.storage.from("doctor-photos").remove([d.photo_path]);
    setDoctors((x) => x.filter((i) => i.id !== d.id));
  };

  const replacePhoto = async (d: Doctor, file: File | null) => {
    if (!file) return;
    const invalid = validateMediaFile(file, PHOTO_RULES);
    if (invalid) return toast.error(invalid);
    setReplacingId(d.id);
    setReplaceProgress(0);
    try {
      await replaceMedia("doctor-photos", d.id, file, {
        onProgress: setReplaceProgress,
        onRetry: (a, m) => toast.info(`连接中断，自动重试中（${a}/${m}）…`),
      });
      toast.success(`${d.name} 的照片已更换`);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "更换失败");
    } finally {
      setReplacingId(null);
      setReplaceProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container h-16 flex items-center justify-between">
          <Link to="/upload" className="inline-flex gap-2 text-sm font-semibold"><ArrowLeft className="size-4" />视频后台</Link>
          <div className="flex items-center gap-4">
            <Link to="/admin/audit" className="text-sm text-muted-foreground hover:text-primary">审计报表</Link>
            <span className="font-semibold">医生管理</span>
          </div>
        </div>
      </header>
      <main className="container py-8 grid lg:grid-cols-[420px_1fr] gap-8">
        <section className="rounded-3xl bg-card shadow-pop p-6 h-fit">
          <div className="flex gap-3 items-center mb-6"><Stethoscope className="text-primary" /><h1 className="font-display text-2xl">添加医生资料</h1></div>
          <form onSubmit={submit} className="space-y-4" noValidate>
            <div>
              <Label htmlFor="doctor-photo">医生照片</Label>
              <Input
                id="doctor-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                aria-invalid={!!errors.photo}
                className={errors.photo ? errorInputClass : undefined}
                onChange={(e) => { setPhoto(e.target.files?.[0] ?? null); clearError("photo"); }}
              />
              {errors.photo
                ? <p className="text-xs text-destructive mt-1">{errors.photo}</p>
                : <p className="text-xs text-muted-foreground mt-1">{PHOTO_RULES.formatLabel}，最大 10MB</p>}
            </div>
            <Field label="医生姓名 *" value={name} error={errors.name} set={(v) => { setName(v); clearError("name"); }} />
            <Field label="职称 *" value={title} error={errors.title} set={(v) => { setTitle(v); clearError("title"); }} />
            <Field label="医院/机构 *" value={hospital} error={errors.hospital} set={(v) => { setHospital(v); clearError("hospital"); }} />
            <Field label="城市 *" value={city} error={errors.city} set={(v) => { setCity(v); clearError("city"); }} />
            <Field label="擅长项目（逗号分隔）" value={specialties} set={setSpecialties} />
            <Field label="语言" value={languages} set={setLanguages} />
            <div>
              <Label htmlFor="doctor-bio">医生介绍 *</Label>
              <Textarea
                id="doctor-bio"
                value={bio}
                rows={5}
                aria-invalid={!!errors.bio}
                className={errors.bio ? errorInputClass : undefined}
                onChange={(e) => { setBio(e.target.value); clearError("bio"); }}
              />
              {errors.bio && <p className="text-xs text-destructive mt-1">{errors.bio}</p>}
            </div>
            <div>
              <Label htmlFor="doctor-credentials">资质与认证</Label>
              <Textarea id="doctor-credentials" value={credentials} onChange={(e) => setCredentials(e.target.value)} rows={3} />
            </div>
            {busy && progress !== null && (
              <div className="space-y-1.5">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">{progress < 100 ? `上传中 ${progress}%` : "服务器处理中…"}</p>
              </div>
            )}
            <Button disabled={busy} className="w-full rounded-full">
              {busy ? <Loader2 className="animate-spin" /> : <><UploadCloud className="size-4 mr-2" />发布医生</>}
            </Button>
          </form>
        </section>
        <section>
          <h2 className="font-display text-2xl mb-4">已添加医生（{doctors.length}）</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {doctors.map((d) => {
              const photoUrl = d.photoUrl ?? "";
              return (
                <article key={d.id} className="rounded-2xl bg-card p-4 flex gap-4">
                  {photoUrl ? <img src={photoUrl} className="size-20 rounded-xl object-cover" /> : <div className="size-20 rounded-xl bg-muted" />}
                  <div className="min-w-0 flex-1">
                    <Link to={`/doctors/profile/${d.id}`} className="font-semibold hover:text-primary">{d.name}</Link>
                    <p className="text-xs text-muted-foreground">{d.title} · {d.city}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <label className="inline-flex">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          disabled={replacingId === d.id}
                          onChange={(e) => { void replacePhoto(d, e.target.files?.[0] ?? null); e.target.value = ""; }}
                        />
                        <span className={`inline-flex items-center text-sm font-medium text-primary hover:underline cursor-pointer ${replacingId === d.id ? "opacity-50 pointer-events-none" : ""}`}>
                          {replacingId === d.id ? <Loader2 className="size-4 mr-1 animate-spin" /> : <ImagePlus className="size-4 mr-1" />}更换照片
                        </span>
                      </label>
                      {replacingId === d.id && (
                        <div className="flex-1 max-w-28 space-y-1">
                          <Progress value={replaceProgress} className="h-1.5" />
                          <p className="text-[10px] text-muted-foreground">{replaceProgress < 100 ? `${replaceProgress}%` : "处理中…"}</p>
                        </div>
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
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Film, ImageIcon, Loader2, LogOut, RefreshCw, Sparkles, Stethoscope, Trash2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { signedUrls } from "@/lib/storage-urls";
import { replaceMedia, uploadMedia } from "@/lib/upload-media";
import { VIDEO_RULES, fieldForUploadError, validateMediaFile } from "@/lib/media-validation";
import { scrollToFirstError } from "@/lib/scroll-to-error";
import { coverBlobToFile, extractCoverCandidates, formatDuration, pickBestCoverIndex, readVideoDuration, type CoverCandidate } from "@/lib/video-cover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import FileDropZone from "@/components/FileDropZone";
import FieldError from "@/components/FieldError";
import CoverVideo from "@/components/CoverVideo";

const ADMIN_EMAIL = "shijieyuwork@gmail.com";
const BUCKET = "short-videos";
const COVER_BUCKET = "video-covers";
const VIDEO_ACCEPT = "video/mp4,video/quicktime,video/webm";

type FieldKey = "file" | "title";
type FieldErrors = Partial<Record<FieldKey, string>>;

const errorInputClass = "border-destructive focus-visible:ring-destructive";

type VideoRow = {
  id: string;
  title: string;
  caption: string | null;
  city: string | null;
  procedure: string | null;
  storage_path: string;
  cover_path: string | null;
  status: string;
  created_at: string;
  doctor_id: string | null;
  url?: string;
  coverUrl?: string;
};
type DoctorOption = { id: string; name: string };

const VideoAdmin = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [city, setCity] = useState("上海");
  const [procedure, setProcedure] = useState("");
  const [status, setStatus] = useState("published");
  const [doctorId, setDoctorId] = useState("none");
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  // 封面：从视频中抽取的候选帧 + 选中的帧索引
  const [covers, setCovers] = useState<CoverCandidate[]>([]);
  const [coverIndex, setCoverIndex] = useState(2);
  const [coverBusy, setCoverBusy] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [replaceProgress, setReplaceProgress] = useState(0);
  const [replaceStage, setReplaceStage] = useState<"video" | "extract" | "cover" | null>(null);
  // 上传流程阶段：视频上传中 → 上传封面中 → 保存记录中
  const [stage, setStage] = useState<"video" | "cover" | "saving" | null>(null);
  const [recommending, setRecommending] = useState(false);
  const [recommendedIndex, setRecommendedIndex] = useState<number | null>(null);

  const clearCovers = () => {
    setCovers((prev) => { prev.forEach((c) => URL.revokeObjectURL(c.url)); return []; });
    setCoverIndex(2);
    setRecommendedIndex(null);
  };

  const clearError = (key: FieldKey) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  // 自动推荐：按清晰度/亮度综合打分，一键选出最佳候选帧
  const recommendCover = async () => {
    if (covers.length === 0 || recommending) return;
    setRecommending(true);
    try {
      const best = await pickBestCoverIndex(covers);
      if (best >= 0) {
        setCoverIndex(best);
        setRecommendedIndex(best);
        toast.success(`已自动选择第 ${best + 1} 帧作为封面（清晰度与亮度综合最优）`);
      }
    } catch {
      toast.error("自动推荐失败，请手动选择封面帧");
    } finally {
      setRecommending(false);
    }
  };

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  const loadVideos = async () => {
    setLoading(true);
    const [{ data, error }, doctorResult] = await Promise.all([
      supabase.from("videos").select("*").order("created_at", { ascending: false }),
      supabase.from("doctors").select("id,name").order("name"),
    ]);
    if (error) toast.error(error.message);
    else {
      const rows = (data ?? []) as VideoRow[];
      const [urls, coverUrls] = await Promise.all([
        signedUrls(BUCKET, rows.map((row) => row.storage_path)),
        signedUrls(COVER_BUCKET, rows.map((row) => row.cover_path)),
      ]);
      setVideos(rows.map((row, index) => ({ ...row, url: urls[index], coverUrl: coverUrls[index] })));
    }
    if (!doctorResult.error) setDoctors((doctorResult.data ?? []) as DoctorOption[]);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) void loadVideos();
  }, [isAdmin]);

  const previewUrl = useMemo(() => file ? URL.createObjectURL(file) : "", [file]);
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  if (authLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/auth?next=/admin/videos" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-muted/30 px-4">
        <div className="max-w-md rounded-3xl bg-card shadow-pop p-8 text-center">
          <h1 className="font-display text-2xl font-semibold">无管理权限</h1>
          <p className="text-sm text-muted-foreground mt-2">请使用 {ADMIN_EMAIL} 登录。</p>
          <Button className="mt-5 rounded-full" onClick={() => void signOut()}>退出并更换账号</Button>
        </div>
      </div>
    );
  }

  const handleFile = (next: File | null) => {
    clearCovers();
    setDuration(null);
    if (!next) {
      setFile(null);
      clearError("file");
      return;
    }
    const invalid = validateMediaFile(next, VIDEO_RULES);
    if (invalid) {
      setFile(null);
      setErrors((prev) => ({ ...prev, file: invalid }));
      toast.error(invalid);
      return;
    }
    clearError("file");
    setFile(next);
    if (!title) setTitle(next.name.replace(/\.[^.]+$/, ""));
    // 读取时长用于预览展示
    void readVideoDuration(next).then(setDuration);
    // 自动抽取候选封面帧（9:16，720×1280 WebP）
    setCoverBusy(true);
    extractCoverCandidates(next)
      .then((candidates) => {
        setCovers(candidates);
        setCoverIndex(Math.min(2, candidates.length - 1));
      })
      .catch(() => toast.warning("无法从该视频提取封面，可继续上传（信息流将无封面预览）"))
      .finally(() => setCoverBusy(false));
  };

  const upload = async (event: React.FormEvent) => {
    event.preventDefault();
    // 逐字段校验，标出所有问题字段
    const next: FieldErrors = {};
    if (!file) next.file = "请选择要上传的视频文件";
    else {
      const fileError = validateMediaFile(file, VIDEO_RULES);
      if (fileError) next.file = fileError;
    }
    if (!title.trim()) next.title = "请填写视频标题";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error(`表单有 ${Object.keys(next).length} 处需要修正，请查看标红字段`);
      scrollToFirstError(formRef.current);
      return;
    }
    setUploading(true);
    setProgress(0);
    setStage("video");
    let storagePath = "";
    let coverPath: string | null = null;
    try {
      storagePath = await uploadMedia(BUCKET, file, {
        onProgress: setProgress,
        onRetry: (attempt, max) => toast.info(`连接中断，自动重试中（${attempt}/${max}）…`),
      });

      // 上传选中的封面帧（若已生成）
      const selected = covers[coverIndex];
      if (selected) {
        setStage("cover");
        coverPath = await uploadMedia(COVER_BUCKET, coverBlobToFile(selected.blob, file.name));
      }
      setStage("saving");

      const { error: dbError } = await supabase.from("videos").insert({
        title: title.trim(),
        caption: caption.trim() || null,
        city,
        procedure: procedure.trim() || null,
        storage_path: storagePath,
        cover_path: coverPath,
        status,
        doctor_id: doctorId === "none" ? null : doctorId,
      });
      if (dbError) {
        await supabase.storage.from(BUCKET).remove([storagePath]);
        if (coverPath) await supabase.storage.from(COVER_BUCKET).remove([coverPath]);
        throw dbError;
      }

      toast.success(coverPath ? "短视频与封面上传成功" : "短视频上传成功（无封面，信息流将显示默认海报）");
      setFile(null); setTitle(""); setCaption(""); setProcedure(""); setStatus("published"); setDoctorId("none");
      clearCovers();
      setDuration(null);
      setErrors({});
      await loadVideos();
    } catch (error) {
      const message = error instanceof Error ? error.message : "上传失败";
      // 服务端的类型/大小/限流/配额错误归因到文件字段并标红
      if (fieldForUploadError(message)) {
        setErrors((prev) => ({ ...prev, file: message }));
        scrollToFirstError(formRef.current);
      }
      toast.error(message);
    } finally {
      setUploading(false);
      setProgress(null);
      setStage(null);
    }
  };

  const replaceVideo = async (video: VideoRow, next: File | null) => {
    if (!next) return;
    const invalid = validateMediaFile(next, VIDEO_RULES);
    if (invalid) return toast.error(invalid);
    setReplacingId(video.id);
    setReplaceProgress(0);
    setReplaceStage("video");
    try {
      await replaceMedia(BUCKET, video.id, next, {
        onProgress: setReplaceProgress,
        onRetry: (attempt, max) => toast.info(`连接中断，自动重试中（${attempt}/${max}）…`),
      });
      // 用新视频重新生成封面（取中间帧），保持信息流预览一致
      let coverNote = "";
      setReplaceStage("extract");
      try {
        const candidates = await extractCoverCandidates(next);
        setReplaceStage("cover");
        const pick = candidates[Math.min(2, candidates.length - 1)];
        const newCoverPath = await uploadMedia(COVER_BUCKET, coverBlobToFile(pick.blob, next.name));
        candidates.forEach((c) => URL.revokeObjectURL(c.url));
        const { error: coverError } = await supabase.from("videos").update({ cover_path: newCoverPath }).eq("id", video.id);
        if (coverError) throw coverError;
        if (video.cover_path) await supabase.storage.from(COVER_BUCKET).remove([video.cover_path]);
      } catch {
        coverNote = "（封面生成失败，已保留原封面或默认海报）";
      }
      toast.success(`“${video.title}”的视频已更换${coverNote}`);
      await loadVideos();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "更换失败");
    } finally {
      setReplacingId(null);
      setReplaceProgress(0);
      setReplaceStage(null);
    }
  };

  const removeVideo = async (video: VideoRow) => {
    if (!window.confirm(`确定删除“${video.title}”吗？此操作无法恢复。`)) return;
    const { error: storageError } = await supabase.storage.from(BUCKET).remove([video.storage_path]);
    if (storageError) return toast.error(storageError.message);
    if (video.cover_path) await supabase.storage.from(COVER_BUCKET).remove([video.cover_path]);
    const { error } = await supabase.from("videos").delete().eq("id", video.id);
    if (error) return toast.error(error.message);
    setVideos((current) => current.filter((item) => item.id !== video.id));
    toast.success("视频已删除");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container h-16 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold"><ArrowLeft className="size-4" /> 返回网站</Link>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Button asChild variant="outline" size="sm" className="rounded-full"><Link to="/admin/doctors"><Stethoscope className="size-4 mr-1"/>专家管理</Link></Button>
            <span className="hidden sm:inline">{user.email}</span>
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => void signOut()}><LogOut className="size-4 mr-1" />退出</Button>
          </div>
        </div>
      </header>

      <main className="container py-8 grid lg:grid-cols-[420px_1fr] gap-8">
        <section className="rounded-3xl bg-card shadow-pop p-6 h-fit">
          <div className="flex items-center gap-3 mb-6"><div className="size-10 rounded-2xl bg-primary/10 grid place-items-center"><UploadCloud className="size-5 text-primary" /></div><div><h1 className="font-display text-2xl font-semibold">上传短视频</h1><p className="text-xs text-muted-foreground">MP4 / MOV / WebM，最大 100MB</p></div></div>
          <form onSubmit={upload} className="space-y-4" ref={formRef}>
            <div>
              <Label htmlFor="video-file">视频文件 *</Label>
              <FileDropZone
                id="video-file"
                accept={VIDEO_ACCEPT}
                rules={VIDEO_RULES}
                invalid={!!errors.file}
                disabled={uploading}
                fileName={file?.name}
                onFile={(f) => handleFile(f)}
                onInvalid={(msg) => { setFile(null); setErrors((prev) => ({ ...prev, file: msg })); toast.error(msg); }}
              />
              {errors.file && <FieldError message={errors.file} />}
            </div>
            {previewUrl && file && (
              <div className="rounded-2xl border bg-muted/30 p-3 space-y-3" data-testid="video-preview-card">
                <div className="flex items-center gap-3">
                  {covers[coverIndex] ? (
                    <img src={covers[coverIndex].url} alt="当前封面预览" className="w-12 aspect-[9/16] rounded-lg object-cover border shrink-0" />
                  ) : (
                    <div className="w-12 aspect-[9/16] rounded-lg bg-muted grid place-items-center shrink-0"><Film className="size-4 text-muted-foreground" /></div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {duration !== null ? `时长 ${formatDuration(duration)} · ` : ""}{(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleFile(null)}
                    aria-label="取消选择该视频"
                  >
                    <X className="size-4 mr-1" />取消选择
                  </Button>
                </div>
                <video src={previewUrl} controls muted className="w-full aspect-[9/16] max-h-72 object-contain rounded-xl bg-black" />
              </div>
            )}
            {(coverBusy || covers.length > 0) && (
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Label className="flex items-center gap-1.5"><ImageIcon className="size-3.5" />封面（信息流预览图，9:16）</Label>
                  {!coverBusy && covers.length > 0 && (
                    <Button type="button" variant="outline" size="sm" className="h-7 rounded-full px-2.5 text-xs" disabled={recommending} onClick={() => void recommendCover()}>
                      {recommending ? <Loader2 className="size-3.5 mr-1 animate-spin" /> : <Sparkles className="size-3.5 mr-1" />}
                      {recommending ? "正在分析候选帧…" : "自动推荐最佳封面"}
                    </Button>
                  )}
                </div>
                {coverBusy ? (
                  <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-2"><Loader2 className="size-3.5 animate-spin" />生成封面中：正在提取候选帧…</p>
                ) : (
                  <div className="grid grid-cols-5 gap-2 mt-1.5">
                    {covers.map((c, i) => (
                      <button
                        key={c.time}
                        type="button"
                        onClick={() => setCoverIndex(i)}
                        aria-label={`选择第 ${i + 1} 帧作为封面`}
                        aria-pressed={i === coverIndex}
                        className={`relative aspect-[9/16] overflow-hidden rounded-lg border-2 transition-all ${i === coverIndex ? "border-primary ring-2 ring-primary/30" : "border-transparent opacity-70 hover:opacity-100"}`}
                      >
                        <img src={c.url} alt={`候选封面 ${i + 1}`} className="absolute inset-0 size-full object-cover" />
                        {i === recommendedIndex && <span className="absolute left-1 top-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold leading-none text-primary-foreground shadow-soft">推荐</span>}
                      </button>
                    ))}
                  </div>
                )}
                {!coverBusy && covers.length > 0 && <p className="text-xs text-muted-foreground mt-1">点击选择一帧作为封面，将统一裁剪为 720×1280 WebP</p>}
              </div>
            )}
            <div>
              <Label htmlFor="video-title">标题 *</Label>
              <Input
                id="video-title"
                value={title}
                aria-invalid={!!errors.title}
                onChange={(e) => { setTitle(e.target.value); clearError("title"); }}
                className={`mt-1.5 ${errors.title ? errorInputClass : ""}`}
                placeholder="例如：术后第 30 天恢复记录"
              />
              {errors.title && <FieldError message={errors.title} />}
            </div>
            <div><Label htmlFor="video-caption">说明</Label><Textarea id="video-caption" value={caption} onChange={(e) => setCaption(e.target.value)} className="mt-1.5" placeholder="视频介绍（可选）" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>城市</Label><Select value={city} onValueChange={setCity}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent>{["上海", "广州", "北京", "海南", "杭州"].map((item) => <SelectItem value={item} key={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              <div><Label htmlFor="procedure">项目</Label><Input id="procedure" value={procedure} onChange={(e) => setProcedure(e.target.value)} className="mt-1.5" placeholder="例如：鼻综合" /></div>
            </div>
            <div><Label>对应专家</Label><Select value={doctorId} onValueChange={setDoctorId}><SelectTrigger className="mt-1.5"><SelectValue placeholder="选择专家"/></SelectTrigger><SelectContent><SelectItem value="none">暂不关联</SelectItem>{doctors.map(d=><SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>状态</Label><Select value={status} onValueChange={setStatus}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="published">立即发布</SelectItem><SelectItem value="draft">保存草稿</SelectItem></SelectContent></Select></div>
            {uploading && (
              <div className="space-y-1.5" aria-live="polite">
                {stage === "video" && progress !== null && <Progress value={progress} className="h-2" />}
                <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
                  {stage !== "video" && <Loader2 className="size-3 animate-spin" />}
                  {stage === "cover"
                    ? "上传封面中…"
                    : stage === "saving"
                      ? "保存记录中…"
                      : progress !== null
                        ? progress < 100 ? `上传视频中 ${progress}%` : "服务器处理中…"
                        : "准备上传…"}
                </p>
              </div>
            )}
            <Button type="submit" disabled={uploading || !file} className="w-full rounded-full h-11">{uploading ? <><Loader2 className="size-4 mr-2 animate-spin" />{stage === "cover" ? "上传封面中…" : stage === "saving" ? "保存记录中…" : "正在上传…"}</> : <><UploadCloud className="size-4 mr-2" />上传视频</>}</Button>
          </form>
        </section>

        <section>
          <div className="flex items-end justify-between mb-4"><div><h2 className="font-display text-2xl font-semibold">视频管理</h2><p className="text-sm text-muted-foreground">共 {videos.length} 条</p></div></div>
          {loading ? <LoadingScreen compact /> : videos.length === 0 ? <div className="rounded-3xl border border-dashed bg-card p-12 text-center text-muted-foreground"><Film className="size-10 mx-auto mb-3 opacity-40" /><p>还没有上传视频</p></div> : <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">{videos.map((video) => { const url = video.url ?? ""; return <article key={video.id} className="rounded-3xl bg-card shadow-soft overflow-hidden"><video src={url} poster={video.coverUrl || undefined} controls preload="metadata" className="w-full aspect-[9/16] max-h-80 object-cover bg-black" /><div className="p-4"><div className="flex items-start justify-between gap-2"><div><h3 className="font-semibold line-clamp-2">{video.title}</h3><p className="text-xs text-muted-foreground mt-1">{video.city || "未设置城市"}{video.procedure ? ` · ${video.procedure}` : ""}</p></div><span className={`text-[10px] px-2 py-1 rounded-full ${video.status === "published" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{video.status === "published" ? "已发布" : "草稿"}</span></div><div className="flex items-center gap-3 mt-3"><label className="inline-flex"><input type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden" disabled={replacingId === video.id} onChange={(e) => { void replaceVideo(video, e.target.files?.[0] ?? null); e.target.value = ""; }} /><span className={`inline-flex items-center text-sm font-medium text-primary hover:underline cursor-pointer ${replacingId === video.id ? "opacity-50 pointer-events-none" : ""}`}>{replacingId === video.id ? <Loader2 className="size-4 mr-1 animate-spin" /> : <RefreshCw className="size-4 mr-1" />}更换视频</span></label>{replacingId === video.id && <div className="flex-1 max-w-32 space-y-1"><Progress value={replaceProgress} className="h-1.5" /><p className="text-[10px] text-muted-foreground">{replaceProgress < 100 ? `${replaceProgress}%` : "处理中…"}</p></div>}<Button variant="ghost" size="sm" className="text-destructive px-0" onClick={() => void removeVideo(video)}><Trash2 className="size-4 mr-1" />删除</Button></div></div></article>; })}</div>}
        </section>
      </main>
    </div>
  );
};

const LoadingScreen = ({ compact = false }: { compact?: boolean }) => <div className={compact ? "py-16 grid place-items-center" : "min-h-screen grid place-items-center"}><Loader2 className="size-7 animate-spin text-primary" /></div>;

export default VideoAdmin;

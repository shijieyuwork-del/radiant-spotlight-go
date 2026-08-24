import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Film, ImageIcon, Loader2, LogOut, RefreshCw, Sparkles, Stethoscope, Trash2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { signedUrls } from "@/lib/storage-urls";
import { isUploadCancelled, replaceMedia, uploadMedia } from "@/lib/upload-media";
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

/** 批量上传队列项：每个文件独立跟踪进度/状态/取消 */
type QueueStatus = "pending" | "uploading" | "cover" | "saving" | "failed" | "cancelled";
type QueueItem = {
  id: string;
  file: File;
  title: string;
  status: QueueStatus;
  progress: number;
  error?: string;
  abort?: AbortController;
};
type QueueResult = "done" | "failed" | "cancelled";

/** 队列条目共享的记录元数据（提交时快照，避免表单重置影响队列） */
type SharedMeta = {
  caption: string | null;
  city: string;
  procedure: string | null;
  status: string;
  doctorId: string | null;
};

const queueStatusText = (item: QueueItem): string => {
  switch (item.status) {
    case "pending": return "待上传";
    case "uploading": return `上传中 ${item.progress}%`;
    case "cover": return "生成并上传封面中…";
    case "saving": return "保存记录中…";
    case "failed": return "上传失败";
    case "cancelled": return "已取消";
  }
};

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
  // 批量上传队列 + 主上传/更换上传的取消与重试
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const queueRef = useRef<QueueItem[]>([]);
  const fileRef = useRef<File | null>(null);
  const mainAbortRef = useRef<AbortController | null>(null);
  const replaceAbortRef = useRef<AbortController | null>(null);
  const [submitRetry, setSubmitRetry] = useState<"failed" | "cancelled" | null>(null);
  const [failedReplace, setFailedReplace] = useState<{ videoId: string; file: File } | null>(null);

  const updateQueue = (updater: (prev: QueueItem[]) => QueueItem[]) => {
    setQueue((prev) => {
      const next = updater(prev);
      queueRef.current = next;
      return next;
    });
  };
  const patchItem = (id: string, patch: Partial<QueueItem>) =>
    updateQueue((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));

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
    fileRef.current = next;
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
      fileRef.current = null;
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

  /** 多文件入口：第一个合法文件进入主表单（可预览/选封面），其余进入批量上传队列 */
  const onDropFiles = (files: File[]) => {
    const list = [...files];
    if (!fileRef.current && list.length > 0) {
      handleFile(list.shift()!);
    }
    if (list.length > 0) {
      const items: QueueItem[] = list.map((f) => ({
        id: crypto.randomUUID(),
        file: f,
        title: f.name.replace(/\.[^.]+$/, ""),
        status: "pending",
        progress: 0,
      }));
      updateQueue((prev) => [...prev, ...items]);
      toast.success(`已加入 ${items.length} 个视频到上传队列`);
    }
  };

  /** 处理单个队列项：上传视频 → 自动生成封面 → 写入记录。 */
  const processQueueItem = async (item: QueueItem, meta: SharedMeta): Promise<QueueResult> => {
    const abort = new AbortController();
    patchItem(item.id, { status: "uploading", progress: 0, error: undefined, abort });
    let storagePath = "";
    let coverPath: string | null = null;
    try {
      storagePath = await uploadMedia(BUCKET, item.file, {
        signal: abort.signal,
        onProgress: (p) => patchItem(item.id, { progress: p }),
        onRetry: (a, m) => toast.info(`「${item.title}」连接中断，自动重试中（${a}/${m}）…`),
      });
      // 封面：队列模式自动提取中间帧（无手动选帧）
      patchItem(item.id, { status: "cover" });
      try {
        const candidates = await extractCoverCandidates(item.file);
        const pick = candidates[Math.min(2, candidates.length - 1)];
        coverPath = await uploadMedia(COVER_BUCKET, coverBlobToFile(pick.blob, item.file.name), { signal: abort.signal });
        candidates.forEach((c) => URL.revokeObjectURL(c.url));
      } catch (coverError) {
        if (isUploadCancelled(coverError)) throw coverError;
        coverPath = null; // 封面失败不阻塞上传，信息流显示默认海报
      }
      patchItem(item.id, { status: "saving" });
      const { error: dbError } = await supabase.from("videos").insert({
        title: item.title.trim() || item.file.name,
        caption: meta.caption,
        city: meta.city,
        procedure: meta.procedure,
        storage_path: storagePath,
        cover_path: coverPath,
        status: meta.status,
        doctor_id: meta.doctorId,
      });
      if (dbError) {
        await supabase.storage.from(BUCKET).remove([storagePath]);
        if (coverPath) await supabase.storage.from(COVER_BUCKET).remove([coverPath]);
        throw dbError;
      }
      updateQueue((prev) => prev.filter((q) => q.id !== item.id));
      return "done";
    } catch (error) {
      if (isUploadCancelled(error)) {
        patchItem(item.id, { status: "cancelled", progress: 0, abort: undefined });
        return "cancelled";
      }
      const message = error instanceof Error ? error.message : "上传失败";
      patchItem(item.id, { status: "failed", error: message, abort: undefined });
      return "failed";
    }
  };

  const cancelItem = (id: string) => {
    queueRef.current.find((q) => q.id === id)?.abort?.abort();
  };

  const retryItem = async (id: string) => {
    const item = queueRef.current.find((q) => q.id === id);
    if (!item || (item.status !== "failed" && item.status !== "cancelled")) return;
    const meta: SharedMeta = {
      caption: caption.trim() || null,
      city,
      procedure: procedure.trim() || null,
      status,
      doctorId: doctorId === "none" ? null : doctorId,
    };
    const result = await processQueueItem(item, meta);
    if (result === "done") {
      toast.success(`「${item.title}」上传成功`);
      await loadVideos();
    } else if (result === "failed") {
      const latest = queueRef.current.find((q) => q.id === id);
      if (latest?.error) toast.error(latest.error);
    }
  };

  const removeItem = (id: string) => {
    queueRef.current.find((q) => q.id === id)?.abort?.abort();
    updateQueue((prev) => prev.filter((q) => q.id !== id));
  };

  const upload = async (event: React.FormEvent) => {
    event.preventDefault();
    // 逐字段校验，标出所有问题字段
    const pendingCount = queueRef.current.filter((q) => q.status === "pending").length;
    const next: FieldErrors = {};
    if (!file && pendingCount === 0) next.file = "请选择要上传的视频文件";
    if (file) {
      const fileError = validateMediaFile(file, VIDEO_RULES);
      if (fileError) next.file = fileError;
      if (!title.trim()) next.title = "请填写视频标题";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error(`表单有 ${Object.keys(next).length} 处需要修正，请查看标红字段`);
      scrollToFirstError(formRef.current);
      return;
    }
    setUploading(true);
    setSubmitRetry(null);
    setProgress(0);
    setStage(file ? "video" : null);
    const abort = new AbortController();
    mainAbortRef.current = abort;
    // 快照共享元数据：主文件上传成功后表单会重置，队列仍使用提交时的值
    const meta: SharedMeta = {
      caption: caption.trim() || null,
      city,
      procedure: procedure.trim() || null,
      status,
      doctorId: doctorId === "none" ? null : doctorId,
    };
    let storagePath = "";
    let coverPath: string | null = null;
    try {
      if (file) {
        storagePath = await uploadMedia(BUCKET, file, {
          signal: abort.signal,
          onProgress: setProgress,
          onRetry: (attempt, max) => toast.info(`连接中断，自动重试中（${attempt}/${max}）…`),
        });

        // 上传选中的封面帧（若已生成）
        const selected = covers[coverIndex];
        if (selected) {
          setStage("cover");
          coverPath = await uploadMedia(COVER_BUCKET, coverBlobToFile(selected.blob, file.name), { signal: abort.signal });
        }
        setStage("saving");

        const { error: dbError } = await supabase.from("videos").insert({
          title: title.trim(),
          caption: meta.caption,
          city: meta.city,
          procedure: meta.procedure,
          storage_path: storagePath,
          cover_path: coverPath,
          status: meta.status,
          doctor_id: meta.doctorId,
        });
        if (dbError) {
          await supabase.storage.from(BUCKET).remove([storagePath]);
          if (coverPath) await supabase.storage.from(COVER_BUCKET).remove([coverPath]);
          throw dbError;
        }

        toast.success(coverPath ? "短视频与封面上传成功" : "短视频上传成功（无封面，信息流将显示默认海报）");
        setFile(null); fileRef.current = null;
        setTitle(""); setCaption(""); setProcedure(""); setStatus("published"); setDoctorId("none");
        clearCovers();
        setDuration(null);
      }

      // 依次处理批量上传队列（每个条目独立进度，可单独取消/重试）
      const ids = queueRef.current.filter((q) => q.status === "pending").map((q) => q.id);
      let ok = 0, failed = 0, cancelledCount = 0;
      for (const id of ids) {
        const item = queueRef.current.find((q) => q.id === id);
        if (!item || item.status !== "pending") continue;
        const result = await processQueueItem(item, meta);
        if (result === "done") ok += 1;
        else if (result === "cancelled") cancelledCount += 1;
        else failed += 1;
      }
      if (ids.length > 0) {
        if (failed > 0) toast.error(`队列上传完成：成功 ${ok} 个，失败 ${failed} 个，可在队列中逐个重试`);
        else if (cancelledCount > 0) toast.info(`队列上传完成：成功 ${ok} 个，已取消 ${cancelledCount} 个`);
        else toast.success(`队列 ${ok} 个视频全部上传成功`);
      }

      setErrors({});
      await loadVideos();
    } catch (error) {
      if (isUploadCancelled(error)) {
        setSubmitRetry("cancelled");
        toast.info("已取消上传，点击“重试上传”可继续");
      } else {
        const message = error instanceof Error ? error.message : "上传失败";
        // 服务端的类型/大小/限流/配额错误归因到文件字段并标红
        if (fieldForUploadError(message)) {
          setErrors((prev) => ({ ...prev, file: message }));
          scrollToFirstError(formRef.current);
        }
        setSubmitRetry("failed");
        toast.error(message);
      }
    } finally {
      setUploading(false);
      setProgress(null);
      setStage(null);
      mainAbortRef.current = null;
    }
  };

  const replaceVideo = async (video: VideoRow, next: File | null) => {
    if (!next) return;
    const invalid = validateMediaFile(next, VIDEO_RULES);
    if (invalid) return toast.error(invalid);
    setReplacingId(video.id);
    setFailedReplace(null);
    setReplaceProgress(0);
    setReplaceStage("video");
    const abort = new AbortController();
    replaceAbortRef.current = abort;
    try {
      await replaceMedia(BUCKET, video.id, next, {
        signal: abort.signal,
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
      setFailedReplace({ videoId: video.id, file: next });
      if (isUploadCancelled(error)) toast.info(`已取消更换“${video.title}”，可点击“重试更换”继续`);
      else toast.error(error instanceof Error ? error.message : "更换失败");
    } finally {
      setReplacingId(null);
      setReplaceProgress(0);
      setReplaceStage(null);
      replaceAbortRef.current = null;
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

  const pendingCount = queue.filter((q) => q.status === "pending").length;

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
          <div className="flex items-center gap-3 mb-6"><div className="size-10 rounded-2xl bg-primary/10 grid place-items-center"><UploadCloud className="size-5 text-primary" /></div><div><h1 className="font-display text-2xl font-semibold">上传短视频</h1><p className="text-xs text-muted-foreground">MP4 / MOV / WebM，单文件最大 100MB，可一次拖入多个</p></div></div>
          <form onSubmit={upload} className="space-y-4" ref={formRef}>
            <div>
              <Label htmlFor="video-file">视频文件 *</Label>
              <FileDropZone
                id="video-file"
                accept={VIDEO_ACCEPT}
                rules={VIDEO_RULES}
                multiple
                invalid={!!errors.file}
                disabled={uploading}
                fileName={file?.name}
                onFiles={onDropFiles}
              />
              {errors.file && <FieldError message={errors.file} rules={VIDEO_RULES} fileName={file?.name} />}
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
            {queue.length > 0 && (
              <div className="space-y-2" data-testid="upload-queue">
                <Label>上传队列（{queue.length}）</Label>
                <ul className="space-y-2">
                  {queue.map((item) => (
                    <li key={item.id} className="rounded-xl border bg-muted/30 p-2.5 space-y-1.5" data-testid={`queue-item-${item.title}`}>
                      <div className="flex items-center gap-2">
                        <Film className={`size-4 shrink-0 ${item.status === "failed" ? "text-destructive" : "text-muted-foreground"}`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium truncate" title={item.file.name}>{item.file.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {(item.file.size / 1024 / 1024).toFixed(1)} MB · {queueStatusText(item)}
                          </p>
                        </div>
                        {(item.status === "uploading" || item.status === "cover") && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 shrink-0 px-2 text-xs text-muted-foreground hover:text-destructive"
                            onClick={() => cancelItem(item.id)}
                            aria-label={`取消上传 ${item.file.name}`}
                          >
                            <X className="size-3.5 mr-1" />取消
                          </Button>
                        )}
                        {item.status === "saving" && <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />}
                        {(item.status === "failed" || item.status === "cancelled") && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 shrink-0 px-2 text-xs text-primary"
                            onClick={() => void retryItem(item.id)}
                            aria-label={`重试上传 ${item.file.name}`}
                          >
                            <RefreshCw className="size-3.5 mr-1" />重试
                          </Button>
                        )}
                        {(item.status === "pending" || item.status === "failed" || item.status === "cancelled") && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 shrink-0 px-2 text-xs text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                            disabled={uploading && item.status === "pending"}
                            aria-label={`从队列移除 ${item.file.name}`}
                          >
                            <X className="size-3.5" />
                          </Button>
                        )}
                      </div>
                      {item.status === "uploading" && <Progress value={item.progress} className="h-1.5" />}
                      {item.status === "failed" && item.error && <FieldError message={item.error} rules={VIDEO_RULES} fileName={item.file.name} />}
                    </li>
                  ))}
                </ul>
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
            <div><Label htmlFor="video-caption">说明</Label><Textarea id="video-caption" value={caption} onChange={(e) => setCaption(e.target.value)} className="mt-1.5" placeholder="视频介绍（可选，队列中的视频共用）" /></div>
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
                        : "处理上传队列中…"}
                </p>
                {(stage === "video" || stage === "cover") && (
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-destructive"
                      onClick={() => mainAbortRef.current?.abort()}
                    >
                      <X className="size-3.5 mr-1" />取消上传
                    </Button>
                  </div>
                )}
              </div>
            )}
            {!uploading && submitRetry && (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed p-2.5 text-xs text-muted-foreground" data-testid="submit-retry">
                {submitRetry === "cancelled" ? "上次上传已取消。" : "上次上传失败。"}
                <Button type="button" variant="outline" size="sm" className="h-7 rounded-full px-3 text-xs" onClick={() => formRef.current?.requestSubmit()}>
                  <RefreshCw className="size-3.5 mr-1" />重试上传
                </Button>
              </div>
            )}
            <Button type="submit" disabled={uploading || (!file && pendingCount === 0)} className="w-full rounded-full h-11">
              {uploading
                ? <><Loader2 className="size-4 mr-2 animate-spin" />{stage === "cover" ? "上传封面中…" : stage === "saving" ? "保存记录中…" : "正在上传…"}</>
                : <><UploadCloud className="size-4 mr-2" />{pendingCount > 0 ? `上传视频（含队列 ${pendingCount} 个）` : "上传视频"}</>}
            </Button>
          </form>
        </section>

        <section>
          <div className="flex items-end justify-between mb-4"><div><h2 className="font-display text-2xl font-semibold">视频管理</h2><p className="text-sm text-muted-foreground">共 {videos.length} 条</p></div></div>
          {loading ? <LoadingScreen compact /> : videos.length === 0 ? <div className="rounded-3xl border border-dashed bg-card p-12 text-center text-muted-foreground"><Film className="size-10 mx-auto mb-3 opacity-40" /><p>还没有上传视频</p></div> : <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">{videos.map((video) => { const url = video.url ?? ""; return <article key={video.id} className="rounded-3xl bg-card shadow-soft overflow-hidden"><CoverVideo src={url} coverPath={video.cover_path} coverUrl={video.coverUrl} showReason className="w-full aspect-[9/16] max-h-80 object-cover bg-black" /><div className="p-4"><div className="flex items-start justify-between gap-2"><div><h3 className="font-semibold line-clamp-2">{video.title}</h3><p className="text-xs text-muted-foreground mt-1">{video.city || "未设置城市"}{video.procedure ? ` · ${video.procedure}` : ""}</p></div><span className={`text-[10px] px-2 py-1 rounded-full ${video.status === "published" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{video.status === "published" ? "已发布" : "草稿"}</span></div><div className="flex items-center gap-3 mt-3 flex-wrap"><label className="inline-flex"><input type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden" disabled={replacingId === video.id} onChange={(e) => { void replaceVideo(video, e.target.files?.[0] ?? null); e.target.value = ""; }} /><span className={`inline-flex items-center text-sm font-medium text-primary hover:underline cursor-pointer ${replacingId === video.id ? "opacity-50 pointer-events-none" : ""}`}>{replacingId === video.id ? <Loader2 className="size-4 mr-1 animate-spin" /> : <RefreshCw className="size-4 mr-1" />}更换视频</span></label>{replacingId === video.id && <span className="flex-1 max-w-32 space-y-1 inline-block"><Progress value={replaceProgress} className="h-1.5" /><span className="text-[10px] text-muted-foreground flex items-center gap-2">{replaceStage === "extract" ? "生成封面中…" : replaceStage === "cover" ? "上传封面中…" : replaceProgress < 100 ? `${replaceProgress}%` : "处理中…"}{replaceStage === "video" && <button type="button" className="text-muted-foreground hover:text-destructive underline" onClick={() => replaceAbortRef.current?.abort()}>取消</button>}</span></span>}{failedReplace?.videoId === video.id && replacingId !== video.id && <button type="button" className="inline-flex items-center text-sm font-medium text-primary hover:underline" onClick={() => { const f = failedReplace; setFailedReplace(null); void replaceVideo(video, f.file); }}><RefreshCw className="size-4 mr-1" />重试更换</button>}<Button variant="ghost" size="sm" className="text-destructive px-0" onClick={() => void removeVideo(video)}><Trash2 className="size-4 mr-1" />删除</Button></div></div></article>; })}</div>}
        </section>
      </main>
    </div>
  );
};

const LoadingScreen = ({ compact = false }: { compact?: boolean }) => <div className={compact ? "py-16 grid place-items-center" : "min-h-screen grid place-items-center"}><Loader2 className="size-7 animate-spin text-primary" /></div>;

export default VideoAdmin;

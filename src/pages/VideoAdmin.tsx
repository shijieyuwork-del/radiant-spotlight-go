import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Film, Loader2, LogOut, RefreshCw, Stethoscope, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { signedUrls } from "@/lib/storage-urls";
import { replaceMedia, uploadMedia } from "@/lib/upload-media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const ADMIN_EMAIL = "shijieyuwork@gmail.com";
const BUCKET = "short-videos";
const MAX_BYTES = 100 * 1024 * 1024;
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

type VideoRow = {
  id: string;
  title: string;
  caption: string | null;
  city: string | null;
  procedure: string | null;
  storage_path: string;
  status: string;
  created_at: string;
  doctor_id: string | null;
  url?: string;
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
      const urls = await signedUrls(BUCKET, rows.map((row) => row.storage_path));
      setVideos(rows.map((row, index) => ({ ...row, url: urls[index] })));
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
    if (!next) return setFile(null);
    if (!VIDEO_TYPES.includes(next.type)) return toast.error("仅支持 MP4、MOV 或 WebM 视频");
    if (next.size > MAX_BYTES) return toast.error("视频不能超过 100MB");
    setFile(next);
    if (!title) setTitle(next.name.replace(/\.[^.]+$/, ""));
  };

  const upload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || !title.trim()) return toast.error("请选择视频并填写标题");
    setUploading(true);
    setProgress(0);
    let storagePath = "";
    try {
      storagePath = await uploadMedia(BUCKET, file, {
        onProgress: setProgress,
        onRetry: (attempt, max) => toast.info(`连接中断，自动重试中（${attempt}/${max}）…`),
      });

      const { error: dbError } = await supabase.from("videos").insert({
        title: title.trim(),
        caption: caption.trim() || null,
        city,
        procedure: procedure.trim() || null,
        storage_path: storagePath,
        status,
        doctor_id: doctorId === "none" ? null : doctorId,
      });
      if (dbError) {
        await supabase.storage.from(BUCKET).remove([storagePath]);
        throw dbError;
      }

      toast.success("短视频上传成功");
      setFile(null); setTitle(""); setCaption(""); setProcedure(""); setStatus("published"); setDoctorId("none");
      await loadVideos();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  const [replacingId, setReplacingId] = useState<string | null>(null);

  const replaceVideo = async (video: VideoRow, next: File | null) => {
    if (!next) return;
    if (!VIDEO_TYPES.includes(next.type)) return toast.error("仅支持 MP4、MOV 或 WebM 视频");
    if (next.size > MAX_BYTES) return toast.error("视频不能超过 100MB");
    setReplacingId(video.id);
    try {
      await replaceMedia(BUCKET, video.id, next);
      toast.success(`“${video.title}”的视频已更换`);
      await loadVideos();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "更换失败");
    } finally {
      setReplacingId(null);
    }
  };

  const removeVideo = async (video: VideoRow) => {
    if (!window.confirm(`确定删除“${video.title}”吗？此操作无法恢复。`)) return;
    const { error: storageError } = await supabase.storage.from(BUCKET).remove([video.storage_path]);
    if (storageError) return toast.error(storageError.message);
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
            <Button asChild variant="outline" size="sm" className="rounded-full"><Link to="/admin/doctors"><Stethoscope className="size-4 mr-1"/>医生管理</Link></Button>
            <span className="hidden sm:inline">{user.email}</span>
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => void signOut()}><LogOut className="size-4 mr-1" />退出</Button>
          </div>
        </div>
      </header>

      <main className="container py-8 grid lg:grid-cols-[420px_1fr] gap-8">
        <section className="rounded-3xl bg-card shadow-pop p-6 h-fit">
          <div className="flex items-center gap-3 mb-6"><div className="size-10 rounded-2xl bg-primary/10 grid place-items-center"><UploadCloud className="size-5 text-primary" /></div><div><h1 className="font-display text-2xl font-semibold">上传短视频</h1><p className="text-xs text-muted-foreground">MP4 / MOV / WebM，最大 100MB</p></div></div>
          <form onSubmit={upload} className="space-y-4">
            <div><Label htmlFor="video-file">视频文件</Label><Input id="video-file" type="file" accept="video/mp4,video/quicktime,video/webm" className="mt-1.5" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} /></div>
            {previewUrl && <video src={previewUrl} controls muted className="w-full aspect-[9/16] max-h-72 object-contain rounded-2xl bg-black" />}
            <div><Label htmlFor="video-title">标题</Label><Input id="video-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1.5" placeholder="例如：术后第 30 天恢复记录" /></div>
            <div><Label htmlFor="video-caption">说明</Label><Textarea id="video-caption" value={caption} onChange={(e) => setCaption(e.target.value)} className="mt-1.5" placeholder="视频介绍（可选）" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>城市</Label><Select value={city} onValueChange={setCity}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent>{["上海", "广州", "北京", "海南", "杭州"].map((item) => <SelectItem value={item} key={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              <div><Label htmlFor="procedure">项目</Label><Input id="procedure" value={procedure} onChange={(e) => setProcedure(e.target.value)} className="mt-1.5" placeholder="例如：鼻综合" /></div>
            </div>
            <div><Label>对应医生</Label><Select value={doctorId} onValueChange={setDoctorId}><SelectTrigger className="mt-1.5"><SelectValue placeholder="选择医生"/></SelectTrigger><SelectContent><SelectItem value="none">暂不关联</SelectItem>{doctors.map(d=><SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>状态</Label><Select value={status} onValueChange={setStatus}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="published">立即发布</SelectItem><SelectItem value="draft">保存草稿</SelectItem></SelectContent></Select></div>
            <Button type="submit" disabled={uploading || !file} className="w-full rounded-full h-11">{uploading ? <><Loader2 className="size-4 mr-2 animate-spin" />正在上传…</> : <><UploadCloud className="size-4 mr-2" />上传视频</>}</Button>
          </form>
        </section>

        <section>
          <div className="flex items-end justify-between mb-4"><div><h2 className="font-display text-2xl font-semibold">视频管理</h2><p className="text-sm text-muted-foreground">共 {videos.length} 条</p></div></div>
          {loading ? <LoadingScreen compact /> : videos.length === 0 ? <div className="rounded-3xl border border-dashed bg-card p-12 text-center text-muted-foreground"><Film className="size-10 mx-auto mb-3 opacity-40" /><p>还没有上传视频</p></div> : <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">{videos.map((video) => { const url = video.url ?? ""; return <article key={video.id} className="rounded-3xl bg-card shadow-soft overflow-hidden"><video src={url} controls preload="metadata" className="w-full aspect-[9/16] max-h-80 object-cover bg-black" /><div className="p-4"><div className="flex items-start justify-between gap-2"><div><h3 className="font-semibold line-clamp-2">{video.title}</h3><p className="text-xs text-muted-foreground mt-1">{video.city || "未设置城市"}{video.procedure ? ` · ${video.procedure}` : ""}</p></div><span className={`text-[10px] px-2 py-1 rounded-full ${video.status === "published" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{video.status === "published" ? "已发布" : "草稿"}</span></div><div className="flex items-center gap-3 mt-3"><label className="inline-flex"><input type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden" disabled={replacingId === video.id} onChange={(e) => { void replaceVideo(video, e.target.files?.[0] ?? null); e.target.value = ""; }} /><span className={`inline-flex items-center text-sm font-medium text-primary hover:underline cursor-pointer ${replacingId === video.id ? "opacity-50 pointer-events-none" : ""}`}>{replacingId === video.id ? <Loader2 className="size-4 mr-1 animate-spin" /> : <RefreshCw className="size-4 mr-1" />}更换视频</span></label><Button variant="ghost" size="sm" className="text-destructive px-0" onClick={() => void removeVideo(video)}><Trash2 className="size-4 mr-1" />删除</Button></div></div></article>; })}</div>}
        </section>
      </main>
    </div>
  );
};

const LoadingScreen = ({ compact = false }: { compact?: boolean }) => <div className={compact ? "py-16 grid place-items-center" : "min-h-screen grid place-items-center"}><Loader2 className="size-7 animate-spin text-primary" /></div>;

export default VideoAdmin;

import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Film, Images, Loader2, MessageSquareText, Pencil, Plus, Search, Stethoscope, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { supabase } from "@/integrations/supabase/client";
import { signedUrls } from "@/lib/storage-urls";
import { translateFields } from "@/lib/i18n-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LiveTranslationPanel from "@/components/LiveTranslationPanel";
import FileDropZone from "@/components/FileDropZone";
import { PHOTO_RULES, validateMediaFile } from "@/lib/media-validation";
import { replaceMedia } from "@/lib/upload-media";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";
import BeforeAfterAdmin from "@/components/BeforeAfterAdmin";
import ClinicAdmin from "@/components/ClinicAdmin";
import DoctorAdmin from "./DoctorAdmin";
import VideoAdmin from "./VideoAdmin";
import QuoteRequestsAdmin, { type QuoteRequestRow } from "@/components/QuoteRequestsAdmin";

type ExpertRow = {
  id: string; name: string; title: string; hospital: string; city: string;
  specialties: string[] | null; bio: string; credentials: string | null;
  languages: string | null; photo_path: string | null; status: string;
  created_at: string; photoUrl?: string;
};

type VideoRow = {
  id: string; title: string; caption: string | null; city: string | null;
  procedure: string | null; storage_path: string; cover_path: string | null;
  status: string; created_at: string; doctor_id: string | null; coverUrl?: string;
};

type StatusFilter = "all" | "published" | "draft";

export default function ContentAdmin() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [loading, setLoading] = useState(true);
  const [experts, setExperts] = useState<ExpertRow[]>([]);
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequestRow[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [editingExpert, setEditingExpert] = useState<ExpertRow | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiRevise, setAiRevise] = useState(true);
  const [stagedPhoto, setStagedPhoto] = useState<{ file: File; url: string } | null>(null);

  const stagePhoto = (file: File) => {
    setStagedPhoto((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return { file, url: URL.createObjectURL(file) };
    });
  };

  const load = async () => {
    setLoading(true);
    const [d, v, q] = await Promise.all([
      supabase.from("doctors").select("*").order("created_at", { ascending: false }),
      supabase.from("videos").select("*").order("created_at", { ascending: false }),
      supabase.from("quote_requests").select("*").order("created_at", { ascending: false }),
    ]);
    if (d.error) toast.error(d.error.message);
    if (v.error) toast.error(v.error.message);
    if (q.error) toast.error(`咨询请求加载失败：${q.error.message}`);
    const expertRows = (d.data ?? []) as ExpertRow[];
    const videoRows = (v.data ?? []) as VideoRow[];
    const [photoUrls, coverUrls] = await Promise.all([
      signedUrls("doctor-photos", expertRows.map((x) => x.photo_path)),
      signedUrls("video-covers", videoRows.map((x) => x.cover_path)),
    ]);
    setExperts(expertRows.map((x, i) => ({ ...x, photoUrl: photoUrls[i] })));
    setVideos(videoRows.map((x, i) => ({ ...x, coverUrl: coverUrls[i] })));
    setQuoteRequests((q.data ?? []) as QuoteRequestRow[]);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin]);

  // 后台任何人发布/修改内容后自动同步列表
  useRealtimeRefresh(isAdmin ? ["doctors", "videos", "quote_requests"] : [], () => { void load(); });

  const match = (row: { status: string }, text: string) =>
    (statusFilter === "all" || row.status === statusFilter) &&
    (!query.trim() || text.toLowerCase().includes(query.trim().toLowerCase()));

  const filteredExperts = useMemo(
    () => experts.filter((e) => match(e, [e.name, e.title, e.hospital, e.city].join(" "))),
    [experts, query, statusFilter]
  );
  const filteredVideos = useMemo(
    () => videos.filter((v) => match(v, [v.title, v.caption, v.city, v.procedure].filter(Boolean).join(" "))),
    [videos, query, statusFilter]
  );
  const expertName = (id: string | null) => experts.find((e) => e.id === id)?.name ?? "—";

  if (authLoading || adminLoading) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="size-7 animate-spin text-primary" /></div>;
  }
  if (!user) return <Navigate to="/auth?next=/admin/content" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const toggleStatus = async (table: "doctors" | "videos", id: string, status: string) => {
    const next = status === "published" ? "draft" : "published";
    const { error } = await supabase.from(table).update({ status: next }).eq("id", id);
    if (error) return toast.error(error.message);
    if (table === "doctors") setExperts((rows) => rows.map((r) => (r.id === id ? { ...r, status: next } : r)));
    else setVideos((rows) => rows.map((r) => (r.id === id ? { ...r, status: next } : r)));
    toast.success(next === "published" ? "已发布，访客可见" : "已下架为草稿，访客不可见");
  };

  const removeExpert = async (row: ExpertRow) => {
    if (!confirm(`确定删除专家「${row.name}」？该操作不可恢复。`)) return;
    const { error } = await supabase.from("doctors").delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    if (row.photo_path) await supabase.storage.from("doctor-photos").remove([row.photo_path]);
    setExperts((rows) => rows.filter((r) => r.id !== row.id));
    toast.success("专家已删除");
  };

  const removeVideo = async (row: VideoRow) => {
    if (!confirm(`确定删除视频「${row.title}」？该操作不可恢复。`)) return;
    const { error } = await supabase.from("videos").delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    await supabase.storage.from("short-videos").remove([row.storage_path]);
    if (row.cover_path) await supabase.storage.from("video-covers").remove([row.cover_path]);
    setVideos((rows) => rows.filter((r) => r.id !== row.id));
    toast.success("视频已删除");
  };

  const saveExpert = async () => {
    if (!editingExpert) return;
    const e = editingExpert;
    if (!e.name.trim() || !e.title.trim() || !e.bio.trim()) return toast.error("姓名、职称和介绍不能为空");
    setSaving(true);
    try {
      const { revised, ...i18n } = await translateFields(
        {
          name: e.name.trim(), title: e.title.trim(), hospital: e.hospital.trim(), city: e.city.trim(),
          specialties: (e.specialties ?? []).map((s) => s.trim()).filter(Boolean).join("，"),
          bio: e.bio.trim(), credentials: e.credentials?.trim(),
        },
        { revise: aiRevise }
      );
      const { error } = await supabase.from("doctors").update({
        name: e.name.trim(), title: e.title.trim(), hospital: e.hospital.trim(), city: e.city.trim(),
        specialties: (e.specialties ?? []).map((s) => s.trim()).filter(Boolean),
        bio: e.bio.trim(), credentials: e.credentials?.trim() || null, languages: e.languages || null,
        status: e.status, i18n,
      }).eq("id", e.id);
      if (error) throw error;
      if (stagedPhoto) {
        await replaceMedia("doctor-photos", e.id, stagedPhoto.file, {
          onRetry: (a, m) => toast.info(`照片上传中断，自动重试中（${a}/${m}）…`),
        });
        URL.revokeObjectURL(stagedPhoto.url);
        setStagedPhoto(null);
      }
      toast.success(revised ? "已保存：中文已润色，并更新多语言版本" : "已保存并更新多语言版本");
      setEditingExpert(null);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const saveVideo = async () => {
    if (!editingVideo) return;
    const v = editingVideo;
    if (!v.title.trim()) return toast.error("标题不能为空");
    setSaving(true);
    try {
      const { revised, ...i18n } = await translateFields(
        { title: v.title.trim(), caption: v.caption?.trim(), city: v.city?.trim(), procedure: v.procedure?.trim() },
        { revise: aiRevise }
      );
      const { error } = await supabase.from("videos").update({
        title: v.title.trim(), caption: v.caption?.trim() || null,
        city: v.city?.trim() || null, procedure: v.procedure?.trim() || null,
        doctor_id: v.doctor_id, status: v.status, i18n,
      }).eq("id", v.id);
      if (error) throw error;
      toast.success(revised ? "已保存：中文已润色，并更新多语言版本" : "已保存并更新多语言版本");
      setEditingVideo(null);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container h-16 flex items-center justify-between">
          <Link to="/" className="inline-flex gap-2 items-center text-sm font-semibold"><ArrowLeft className="size-4" />返回网站</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/admin/audit" className="text-muted-foreground hover:text-primary">审计报表</Link>
            <span className="font-semibold">内容管理</span>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        <div>
          <h1 className="font-display text-3xl">内容管理中心</h1>
          <p className="text-sm text-muted-foreground mt-1">在这里查看、编辑、上下架或删除所有专家与视频。</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input value={query} onChange={(ev) => setQuery(ev.target.value)} placeholder="搜索标题、姓名、城市、项目…" className="pl-9 rounded-full" />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-40 rounded-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="published">已发布</SelectItem>
              <SelectItem value="draft">草稿</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-full" onClick={() => void load()} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : "刷新"}
          </Button>
        </div>

        <Tabs defaultValue="quotes">
          <TabsList className="flex h-auto flex-wrap justify-start gap-1">
            <TabsTrigger value="quotes"><MessageSquareText className="size-4 mr-1.5" />咨询（{quoteRequests.length}）</TabsTrigger>
            <TabsTrigger value="experts"><Stethoscope className="size-4 mr-1.5" />专家（{filteredExperts.length}）</TabsTrigger>
            <TabsTrigger value="videos"><Film className="size-4 mr-1.5" />视频（{filteredVideos.length}）</TabsTrigger>
            <TabsTrigger value="before-after"><Images className="size-4 mr-1.5" />术前术后对比</TabsTrigger>
            <TabsTrigger value="clinics"><Images className="size-4 mr-1.5" />医院</TabsTrigger>
            <TabsTrigger value="new-expert"><Plus className="size-4 mr-1.5" />新增专家</TabsTrigger>
            <TabsTrigger value="new-video"><UploadCloud className="size-4 mr-1.5" />上传视频</TabsTrigger>
          </TabsList>

          <TabsContent value="quotes" className="mt-4">
            <QuoteRequestsAdmin requests={quoteRequests} />
          </TabsContent>

          <TabsContent value="before-after" className="mt-4">
            <BeforeAfterAdmin experts={experts.map((e) => ({ id: e.id, name: e.name }))} />
          </TabsContent>
          <TabsContent value="clinics" className="mt-4">
            <ClinicAdmin />
          </TabsContent>

          <TabsContent value="new-expert" className="mt-4 max-w-xl">
            <DoctorAdmin embedded />
          </TabsContent>
          <TabsContent value="new-video" className="mt-4 max-w-xl">
            <VideoAdmin embedded />
          </TabsContent>

          <TabsContent value="experts" className="mt-4 grid gap-3 sm:grid-cols-2">
            {filteredExperts.map((e) => (
              <article key={e.id} className="rounded-2xl bg-card p-4 flex gap-4 shadow-soft">
                {e.photoUrl ? <img src={e.photoUrl} alt={e.name} loading="lazy" className="size-20 rounded-xl object-cover" /> : <div className="size-20 rounded-xl bg-muted" />}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold truncate">{e.name}</p>
                    <StatusPill status={e.status} />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{e.title} · {e.hospital} · {e.city}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button size="sm" variant="outline" className="rounded-full h-8" onClick={() => { setStagedPhoto(null); setEditingExpert({ ...e }); }}><Pencil className="size-3.5 mr-1" />编辑</Button>
                    <Button size="sm" variant="ghost" className="h-8" onClick={() => void toggleStatus("doctors", e.id, e.status)}>{e.status === "published" ? "下架" : "发布"}</Button>
                    <Button size="sm" variant="ghost" className="h-8 text-destructive" onClick={() => void removeExpert(e)}><Trash2 className="size-3.5 mr-1" />删除</Button>
                  </div>
                </div>
              </article>
            ))}
            {!loading && filteredExperts.length === 0 && <p className="text-sm text-muted-foreground">没有符合条件的专家。</p>}
          </TabsContent>

          <TabsContent value="videos" className="mt-4 grid gap-3 sm:grid-cols-2">
            {filteredVideos.map((v) => (
              <article key={v.id} className="rounded-2xl bg-card p-4 flex gap-4 shadow-soft">
                {v.coverUrl ? <img src={v.coverUrl} alt={v.title} loading="lazy" className="h-24 w-16 rounded-xl object-cover" /> : <div className="h-24 w-16 rounded-xl bg-muted" />}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold truncate">{v.title}</p>
                    <StatusPill status={v.status} />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{[v.procedure, v.city].filter(Boolean).join(" · ") || "未分类"}</p>
                  <p className="text-xs text-muted-foreground truncate">专家：{expertName(v.doctor_id)}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button size="sm" variant="outline" className="rounded-full h-8" onClick={() => setEditingVideo({ ...v })}><Pencil className="size-3.5 mr-1" />编辑</Button>
                    <Button size="sm" variant="ghost" className="h-8" onClick={() => void toggleStatus("videos", v.id, v.status)}>{v.status === "published" ? "下架" : "发布"}</Button>
                    <Button size="sm" variant="ghost" className="h-8 text-destructive" onClick={() => void removeVideo(v)}><Trash2 className="size-3.5 mr-1" />删除</Button>
                  </div>
                </div>
              </article>
            ))}
            {!loading && filteredVideos.length === 0 && <p className="text-sm text-muted-foreground">没有符合条件的视频。</p>}
          </TabsContent>
        </Tabs>
      </main>

      {/* 编辑专家 */}
      <Dialog open={!!editingExpert} onOpenChange={(open) => { if (!open) { setStagedPhoto((p) => { if (p) URL.revokeObjectURL(p.url); return null; }); setEditingExpert(null); } }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>编辑专家资料</DialogTitle></DialogHeader>
          {editingExpert && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="edit-expert-photo">专家照片</Label>
                <div className="flex items-center gap-3">
                  {stagedPhoto
                    ? <img src={stagedPhoto.url} alt="新照片预览" className="size-16 rounded-xl object-cover ring-2 ring-primary/40" />
                    : editingExpert.photoUrl
                      ? <img src={editingExpert.photoUrl} alt={editingExpert.name} className="size-16 rounded-xl object-cover" />
                      : <div className="size-16 rounded-xl bg-muted grid place-items-center"><Stethoscope className="size-5 text-muted-foreground" /></div>}
                  <p className="text-xs text-muted-foreground">{stagedPhoto ? `新照片：${stagedPhoto.file.name}` : "当前照片，可在下方拖入新照片替换"}</p>
                </div>
                <FileDropZone
                  id="edit-expert-photo"
                  accept="image/jpeg,image/png,image/webp"
                  rules={PHOTO_RULES}
                  disabled={saving}
                  fileName={stagedPhoto ? `已选择：${stagedPhoto.file.name}` : null}
                  onFile={stagePhoto}
                  onInvalid={(message) => toast.error(message)}
                />
              </div>
              <TextField label="姓名 *" value={editingExpert.name} onChange={(v) => setEditingExpert({ ...editingExpert, name: v })} />
              <TextField label="职称 *" value={editingExpert.title} onChange={(v) => setEditingExpert({ ...editingExpert, title: v })} />
              <TextField label="医院/机构" value={editingExpert.hospital} onChange={(v) => setEditingExpert({ ...editingExpert, hospital: v })} />
              <TextField label="城市" value={editingExpert.city} onChange={(v) => setEditingExpert({ ...editingExpert, city: v })} />
              <TextField
                label="擅长项目（逗号分隔）"
                value={(editingExpert.specialties ?? []).join("，")}
                onChange={(v) => setEditingExpert({ ...editingExpert, specialties: v.split(/[,，]/) })}
              />
              <TextField label="语言" value={editingExpert.languages ?? ""} onChange={(v) => setEditingExpert({ ...editingExpert, languages: v })} />
              <div>
                <Label>专家介绍 *</Label>
                <Textarea rows={5} value={editingExpert.bio} onChange={(ev) => setEditingExpert({ ...editingExpert, bio: ev.target.value })} />
              </div>
              <div>
                <Label>资质与认证</Label>
                <Textarea rows={3} value={editingExpert.credentials ?? ""} onChange={(ev) => setEditingExpert({ ...editingExpert, credentials: ev.target.value })} />
              </div>
              <StatusSelect value={editingExpert.status} onChange={(v) => setEditingExpert({ ...editingExpert, status: v })} />
              <ReviseToggle checked={aiRevise} onChange={setAiRevise} />
              <LiveTranslationPanel
                revise={aiRevise}
                fields={{
                  name: editingExpert.name, title: editingExpert.title, hospital: editingExpert.hospital,
                  city: editingExpert.city, bio: editingExpert.bio, credentials: editingExpert.credentials ?? "",
                }}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingExpert(null)}>取消</Button>
            <Button onClick={() => void saveExpert()} disabled={saving}>{saving ? <Loader2 className="size-4 animate-spin" /> : "保存"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑视频 */}
      <Dialog open={!!editingVideo} onOpenChange={(open) => !open && setEditingVideo(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>编辑视频信息</DialogTitle></DialogHeader>
          {editingVideo && (
            <div className="space-y-3">
              <TextField label="标题 *" value={editingVideo.title} onChange={(v) => setEditingVideo({ ...editingVideo, title: v })} />
              <div>
                <Label>说明文案</Label>
                <Textarea rows={4} value={editingVideo.caption ?? ""} onChange={(ev) => setEditingVideo({ ...editingVideo, caption: ev.target.value })} />
              </div>
              <TextField label="城市" value={editingVideo.city ?? ""} onChange={(v) => setEditingVideo({ ...editingVideo, city: v })} />
              <TextField label="项目类型" value={editingVideo.procedure ?? ""} onChange={(v) => setEditingVideo({ ...editingVideo, procedure: v })} />
              <div>
                <Label>关联专家</Label>
                <Select
                  value={editingVideo.doctor_id ?? "none"}
                  onValueChange={(v) => setEditingVideo({ ...editingVideo, doctor_id: v === "none" ? null : v })}
                >
                  <SelectTrigger><SelectValue placeholder="选择专家" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">不关联</SelectItem>
                    {experts.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <StatusSelect value={editingVideo.status} onChange={(v) => setEditingVideo({ ...editingVideo, status: v })} />
              <ReviseToggle checked={aiRevise} onChange={setAiRevise} />
              <LiveTranslationPanel revise={aiRevise} fields={{ title: editingVideo.title, caption: editingVideo.caption ?? "" }} />
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingVideo(null)}>取消</Button>
            <Button onClick={() => void saveVideo()} disabled={saving}>{saving ? <Loader2 className="size-4 animate-spin" /> : "保存"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const StatusPill = ({ status }: { status: string }) => (
  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${status === "published" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
    {status === "published" ? "已发布" : "草稿"}
  </span>
);

const TextField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div>
    <Label>{label}</Label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const StatusSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div>
    <Label>状态</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="published">已发布（访客可见）</SelectItem>
        <SelectItem value="draft">草稿（访客不可见）</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

const ReviseToggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <label className="flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/30 p-3">
    <input type="checkbox" className="mt-1 size-4 accent-primary" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span className="text-sm">
      保存时用 AI 润色并重新翻译
      <span className="block text-xs text-muted-foreground mt-0.5">取消勾选则只重新翻译，不改动你的中文原文。</span>
    </span>
  </label>
);

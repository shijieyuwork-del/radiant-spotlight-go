import { useEffect, useState } from "react";
import { Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { signedUrls } from "@/lib/storage-urls";
import { uploadMedia } from "@/lib/upload-media";
import { PHOTO_RULES } from "@/lib/media-validation";
import { translateFields } from "@/lib/i18n-content";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import FileDropZone from "@/components/FileDropZone";
import LiveTranslationPanel from "@/components/LiveTranslationPanel";

const PHOTO_ACCEPT = "image/jpeg,image/png,image/webp";

type Row = {
  id: string;
  title: string;
  caption: string | null;
  procedure: string | null;
  city: string | null;
  before_path: string;
  after_path: string;
  months_after: number | null;
  status: string;
  doctor_id: string | null;
  created_at: string;
  beforeUrl?: string;
  afterUrl?: string;
};

type ExpertOption = { id: string; name: string };

/** 管理端：上传并管理「术前 / 术后」对比图，每组对应一位专家。 */
const BeforeAfterAdmin = ({ experts }: { experts: ExpertOption[] }) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [procedure, setProcedure] = useState("");
  const [city, setCity] = useState("");
  const [months, setMonths] = useState("");
  const [doctorId, setDoctorId] = useState<string>("none");
  const [status, setStatus] = useState("published");
  const [aiRevise, setAiRevise] = useState(true);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("before_after_cases")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    const list = (data ?? []) as Row[];
    const [b, a] = await Promise.all([
      signedUrls("before-after", list.map((r) => r.before_path)),
      signedUrls("before-after", list.map((r) => r.after_path)),
    ]);
    setRows(list.map((r, i) => ({ ...r, beforeUrl: b[i], afterUrl: a[i] })));
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);
  useRealtimeRefresh(["before_after_cases"], () => {
    void load();
  });

  const reset = () => {
    setPhotoFile(null);
    setTitle("");
    setCaption("");
    setProcedure("");
    setCity("");
    setMonths("");
    setProgress(0);
  };

  const submit = async () => {
    if (!photoFile) return toast.error("请上传一张术前术后对比图片");
    if (!title.trim()) return toast.error("标题不能为空");
    setBusy(true);
    try {
      const photoPath = await uploadMedia("before-after", photoFile, {
        onProgress: (p) => setProgress(Math.round(p)),
      });
      const beforePath = photoPath;
      const afterPath = photoPath;
      const { revised, ...i18n } = await translateFields(
        { title: title.trim(), caption: caption.trim(), procedure: procedure.trim(), city: city.trim() },
        { revise: aiRevise }
      );
      const { error } = await supabase.from("before_after_cases").insert({
        title: title.trim(),
        caption: caption.trim() || null,
        procedure: procedure.trim() || null,
        city: city.trim() || null,
        months_after: months.trim() ? Number(months) : null,
        before_path: beforePath,
        after_path: afterPath,
        doctor_id: doctorId === "none" ? null : doctorId,
        status,
        i18n,
      });
      if (error) throw error;
      toast.success(revised ? "已发布：中文已润色，并生成多语言版本" : "已发布并生成多语言版本");
      reset();
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "上传失败");
    } finally {
      setBusy(false);
    }
  };

  const toggleStatus = async (row: Row) => {
    const next = row.status === "published" ? "draft" : "published";
    const { error } = await supabase.from("before_after_cases").update({ status: next }).eq("id", row.id);
    if (error) return toast.error(error.message);
    setRows((list) => list.map((r) => (r.id === row.id ? { ...r, status: next } : r)));
    toast.success(next === "published" ? "已发布，访客可见" : "已下架为草稿");
  };

  const remove = async (row: Row) => {
    if (!confirm(`确定删除对比组「${row.title}」？该操作不可恢复。`)) return;
    const { error } = await supabase.from("before_after_cases").delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    await supabase.storage.from("before-after").remove([row.before_path, row.after_path]);
    setRows((list) => list.filter((r) => r.id !== row.id));
    toast.success("已删除");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
      {/* 上传表单 */}
      <div className="space-y-3 rounded-2xl bg-card p-5 shadow-soft">
        <h2 className="font-display text-xl">新增术前术后对比</h2>
        <div>
          <Label htmlFor="ba-photo">对比照片 *（术前术后拼好的一张图）</Label>
          <FileDropZone
            id="ba-photo"
            accept={PHOTO_ACCEPT}
            rules={PHOTO_RULES}
            disabled={busy}
            fileName={photoFile?.name ?? null}
            onFile={setPhotoFile}
            onInvalid={(m) => toast.error(m)}
          />
        </div>

        <div>
          <Label>标题 *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：双眼皮术后三个月" />
        </div>
        <div>
          <Label>说明文案</Label>
          <Textarea rows={3} value={caption} onChange={(e) => setCaption(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>项目类型</Label>
            <Input value={procedure} onChange={(e) => setProcedure(e.target.value)} placeholder="双眼皮" />
          </div>
          <div>
            <Label>城市</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="上海" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>术后月数</Label>
            <Input type="number" min={0} value={months} onChange={(e) => setMonths(e.target.value)} placeholder="3" />
          </div>
          <div>
            <Label>关联专家</Label>
            <Select value={doctorId} onValueChange={setDoctorId}>
              <SelectTrigger><SelectValue placeholder="选择专家" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">不关联</SelectItem>
                {experts.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>状态</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="published">已发布（访客可见）</SelectItem>
              <SelectItem value="draft">草稿（访客不可见）</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/30 p-3">
          <input type="checkbox" className="mt-1 size-4 accent-primary" checked={aiRevise} onChange={(e) => setAiRevise(e.target.checked)} />
          <span className="text-sm">
            保存时用 AI 润色并翻译
            <span className="block text-xs text-muted-foreground mt-0.5">取消勾选则只翻译，不改动中文原文。</span>
          </span>
        </label>

        <LiveTranslationPanel revise={aiRevise} fields={{ title, caption, procedure, city }} />

        {busy && <Progress value={progress} />}
        <Button className="w-full rounded-full" onClick={() => void submit()} disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <><UploadCloud className="size-4 mr-1.5" />上传并保存</>}
        </Button>
      </div>

      {/* 已有对比组 */}
      <div className="space-y-3">
        {loading && <Loader2 className="size-5 animate-spin text-primary" />}
        {!loading && rows.length === 0 && <p className="text-sm text-muted-foreground">还没有对比图，先在左侧上传一组。</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map((r) => (
            <article key={r.id} className="rounded-2xl bg-card p-4 shadow-soft">
              <div className="flex gap-2">
                {(r.before_path === r.after_path ? [r.beforeUrl] : [r.beforeUrl, r.afterUrl]).map((url, i) => (
                  <div key={i} className="relative flex-1">
                    {url
                      ? <img src={url} alt={`${r.title} ${i === 0 ? "before" : "after"}`} loading="lazy" className="w-full aspect-[4/5] object-cover rounded-xl" />
                      : <div className="w-full aspect-[4/5] rounded-xl bg-muted" />}
                    {r.before_path !== r.after_path && (
                      <span className="absolute top-2 left-2 rounded-full bg-background/90 px-2 py-0.5 text-[11px]">{i === 0 ? "术前" : "术后"}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <p className="font-semibold truncate">{r.title}</p>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${r.status === "published" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {r.status === "published" ? "已发布" : "草稿"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {[r.procedure, r.city, r.months_after ? `术后 ${r.months_after} 个月` : null].filter(Boolean).join(" · ") || "未分类"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                专家：{experts.find((e) => e.id === r.doctor_id)?.name ?? "—"}
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="ghost" className="h-8" onClick={() => void toggleStatus(r)}>
                  {r.status === "published" ? "下架" : "发布"}
                </Button>
                <Button size="sm" variant="ghost" className="h-8 text-destructive" onClick={() => void remove(r)}>
                  <Trash2 className="size-3.5 mr-1" />删除
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterAdmin;

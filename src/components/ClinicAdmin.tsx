import { useEffect, useMemo, useState } from "react";
import { Building2, EyeOff, Loader2, Pencil, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { signedUrls } from "@/lib/storage-urls";
import { uploadMedia } from "@/lib/upload-media";
import { PHOTO_RULES } from "@/lib/media-validation";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";
import { STATIC_CLINICS, getClinicPath } from "@/data/clinicDirectory";
import { CITIES } from "@/data/cities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import FileDropZone from "@/components/FileDropZone";

const PHOTO_ACCEPT = "image/jpeg,image/png,image/webp";

type ClinicRow = {
  id: string;
  static_slug: string | null;
  city_slug: string;
  name_en: string;
  name_zh: string;
  area_en: string | null;
  area_zh: string | null;
  description_en: string | null;
  description_zh: string | null;
  photo_path: string | null;
  is_public: boolean;
  hidden: boolean;
  status: string;
  photoUrl?: string;
};

type Entry = {
  key: string;
  staticSlug: string | null;
  row: ClinicRow | null;
  citySlug: string;
  nameEn: string;
  nameZh: string;
  areaEn: string;
  areaZh: string;
  descriptionEn: string;
  descriptionZh: string;
  isPublic: boolean;
  hidden: boolean;
  photoUrl: string;
  href: string | null;
};

type Draft = {
  id: string | null;
  staticSlug: string | null;
  citySlug: string;
  nameEn: string;
  nameZh: string;
  areaEn: string;
  areaZh: string;
  descriptionEn: string;
  descriptionZh: string;
  isPublic: boolean;
  photoPath: string | null;
  photoUrl: string;
};

const emptyDraft = (): Draft => ({
  id: null, staticSlug: null, citySlug: CITIES[0]?.slug ?? "shanghai",
  nameEn: "", nameZh: "", areaEn: "", areaZh: "", descriptionEn: "", descriptionZh: "",
  isPublic: false, photoPath: null, photoUrl: "",
});

const cityName = (slug: string) => CITIES.find((city) => city.slug === slug)?.zh ?? slug;

export default function ClinicAdmin() {
  const [rows, setRows] = useState<ClinicRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("clinics").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    const list = (data ?? []) as ClinicRow[];
    const urls = await signedUrls("clinic-photos", list.map((row) => row.photo_path));
    setRows(list.map((row, index) => ({ ...row, photoUrl: urls[index] })));
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);
  useRealtimeRefresh(["clinics"], () => { void load(); });

  const entries = useMemo<Entry[]>(() => {
    const overrides = new Map(rows.filter((row) => row.static_slug).map((row) => [row.static_slug!, row]));
    const fromStatic = STATIC_CLINICS.map((clinic) => {
      const row = overrides.get(clinic.slug) ?? null;
      return {
        key: clinic.slug,
        staticSlug: clinic.slug,
        row,
        citySlug: clinic.citySlug,
        nameEn: row?.name_en || clinic.nameEn,
        nameZh: row?.name_zh || clinic.nameZh,
        areaEn: row?.area_en || clinic.areaEn,
        areaZh: row?.area_zh || clinic.areaZh,
        descriptionEn: row?.description_en ?? "",
        descriptionZh: row?.description_zh ?? "",
        isPublic: row ? row.is_public : clinic.isPublic,
        hidden: Boolean(row?.hidden),
        photoUrl: row?.photoUrl ?? "",
        href: getClinicPath(clinic),
      } satisfies Entry;
    });
    const custom = rows.filter((row) => !row.static_slug).map((row) => ({
      key: row.id,
      staticSlug: null,
      row,
      citySlug: row.city_slug,
      nameEn: row.name_en,
      nameZh: row.name_zh,
      areaEn: row.area_en ?? "",
      areaZh: row.area_zh ?? "",
      descriptionEn: row.description_en ?? "",
      descriptionZh: row.description_zh ?? "",
      isPublic: row.is_public,
      hidden: row.hidden,
      photoUrl: row.photoUrl ?? "",
      href: null,
    } satisfies Entry));
    return [...custom, ...fromStatic];
  }, [rows]);

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return entries.filter((entry) =>
      (cityFilter === "all" || entry.citySlug === cityFilter) &&
      (!term || [entry.nameEn, entry.nameZh, entry.areaEn, entry.areaZh].join(" ").toLocaleLowerCase().includes(term)));
  }, [entries, query, cityFilter]);

  const openEditor = (entry?: Entry) => {
    setPhotoFile(null);
    setProgress(0);
    if (!entry) return setDraft(emptyDraft());
    setDraft({
      id: entry.row?.id ?? null,
      staticSlug: entry.staticSlug,
      citySlug: entry.citySlug,
      nameEn: entry.nameEn,
      nameZh: entry.nameZh,
      areaEn: entry.areaEn,
      areaZh: entry.areaZh,
      descriptionEn: entry.descriptionEn,
      descriptionZh: entry.descriptionZh,
      isPublic: entry.isPublic,
      photoPath: entry.row?.photo_path ?? null,
      photoUrl: entry.photoUrl,
    });
  };

  const save = async () => {
    if (!draft) return;
    if (!draft.nameEn.trim() && !draft.nameZh.trim()) return toast.error("请至少填写一个医院名称");
    setSaving(true);
    try {
      let photoPath = draft.photoPath;
      if (photoFile) {
        const result = await uploadMedia("clinic-photos", photoFile, { onProgress: setProgress });
        photoPath = result.path;
      }
      const payload = {
        static_slug: draft.staticSlug,
        city_slug: draft.citySlug,
        name_en: draft.nameEn.trim(),
        name_zh: draft.nameZh.trim(),
        area_en: draft.areaEn.trim() || null,
        area_zh: draft.areaZh.trim() || null,
        description_en: draft.descriptionEn.trim() || null,
        description_zh: draft.descriptionZh.trim() || null,
        is_public: draft.isPublic,
        photo_path: photoPath,
        hidden: false,
        status: "published",
      };
      const { error } = draft.id
        ? await supabase.from("clinics").update(payload).eq("id", draft.id)
        : await supabase.from("clinics").insert(payload);
      if (error) throw new Error(error.message);
      toast.success("医院资料已保存");
      setDraft(null);
      setPhotoFile(null);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存失败");
    } finally {
      setSaving(false);
      setProgress(0);
    }
  };

  const hideStatic = async (entry: Entry) => {
    if (!confirm(`确定从网站上隐藏「${entry.nameZh || entry.nameEn}」？可以随时恢复。`)) return;
    const payload = {
      static_slug: entry.staticSlug,
      city_slug: entry.citySlug,
      name_en: entry.nameEn,
      name_zh: entry.nameZh,
      is_public: entry.isPublic,
      hidden: true,
      status: "published",
    };
    const { error } = entry.row
      ? await supabase.from("clinics").update({ hidden: true }).eq("id", entry.row.id)
      : await supabase.from("clinics").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("已从网站隐藏");
    await load();
  };

  const restore = async (entry: Entry) => {
    if (!entry.row) return;
    const { error } = await supabase.from("clinics").update({ hidden: false }).eq("id", entry.row.id);
    if (error) return toast.error(error.message);
    toast.success("已恢复显示");
    await load();
  };

  const remove = async (entry: Entry) => {
    if (!entry.row) return;
    if (!confirm(`确定删除「${entry.nameZh || entry.nameEn}」？该操作不可恢复。`)) return;
    const { error } = await supabase.from("clinics").delete().eq("id", entry.row.id);
    if (error) return toast.error(error.message);
    if (entry.row.photo_path) await supabase.storage.from("clinic-photos").remove([entry.row.photo_path]);
    toast.success("已删除");
    await load();
  };

  const resetOverride = async (entry: Entry) => {
    if (!entry.row) return;
    if (!confirm("确定恢复这家医院的原始资料？自定义名称、介绍和图片会被清除。")) return;
    const { error } = await supabase.from("clinics").delete().eq("id", entry.row.id);
    if (error) return toast.error(error.message);
    if (entry.row.photo_path) await supabase.storage.from("clinic-photos").remove([entry.row.photo_path]);
    toast.success("已恢复原始资料");
    await load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索医院名称或区域…" className="rounded-full pl-9" />
        </div>
        <Select value={cityFilter} onValueChange={setCityFilter}>
          <SelectTrigger className="w-40 rounded-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部城市</SelectItem>
            {CITIES.map((city) => <SelectItem key={city.slug} value={city.slug}>{city.zh}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button className="rounded-full" onClick={() => openEditor()}><Plus className="mr-1.5 size-4" />新增医院</Button>
      </div>

      <p className="text-sm text-muted-foreground">
        共 {filtered.length} 家医院。可以修改名称、区域、介绍和照片；新增的医院会直接出现在医院目录里，隐藏的医院访客看不到。
      </p>

      {loading && <Loader2 className="size-5 animate-spin text-primary" />}

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((entry) => (
          <article key={entry.key} className="flex gap-4 rounded-2xl bg-card p-4 shadow-soft">
            {entry.photoUrl
              ? <img src={entry.photoUrl} alt={entry.nameZh || entry.nameEn} loading="lazy" className="size-20 shrink-0 rounded-xl object-cover" />
              : <div className="grid size-20 shrink-0 place-items-center rounded-xl bg-muted"><Building2 className="size-6 text-muted-foreground" /></div>}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate font-semibold">{entry.nameZh || entry.nameEn}</p>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${entry.isPublic ? "bg-secondary text-secondary-foreground" : "bg-primary/10 text-primary"}`}>
                  {entry.isPublic ? "公立" : "私立"}
                </span>
                {entry.hidden && <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] text-destructive">已隐藏</span>}
                {!entry.staticSlug && <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">后台新增</span>}
              </div>
              <p className="truncate text-xs text-muted-foreground">{entry.nameEn}</p>
              <p className="truncate text-xs text-muted-foreground">{[cityName(entry.citySlug), entry.areaZh].filter(Boolean).join(" · ")}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="h-8 rounded-full" onClick={() => openEditor(entry)}><Pencil className="mr-1 size-3.5" />编辑</Button>
                {entry.hidden
                  ? <Button size="sm" variant="ghost" className="h-8" onClick={() => void restore(entry)}><RotateCcw className="mr-1 size-3.5" />恢复显示</Button>
                  : entry.staticSlug
                    ? <Button size="sm" variant="ghost" className="h-8 text-destructive" onClick={() => void hideStatic(entry)}><EyeOff className="mr-1 size-3.5" />从网站移除</Button>
                    : <Button size="sm" variant="ghost" className="h-8 text-destructive" onClick={() => void remove(entry)}><Trash2 className="mr-1 size-3.5" />删除</Button>}
                {entry.staticSlug && entry.row && !entry.hidden && (
                  <Button size="sm" variant="ghost" className="h-8" onClick={() => void resetOverride(entry)}>恢复原始资料</Button>
                )}
              </div>
            </div>
          </article>
        ))}
        {!loading && filtered.length === 0 && <p className="text-sm text-muted-foreground">没有符合条件的医院。</p>}
      </div>

      <Dialog open={Boolean(draft)} onOpenChange={(open) => { if (!open) { setDraft(null); setPhotoFile(null); } }}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader><DialogTitle>{draft?.staticSlug ? "编辑医院资料" : draft?.id ? "编辑医院" : "新增医院"}</DialogTitle></DialogHeader>
          {draft && (
            <div className="space-y-3">
              <div>
                <Label>城市</Label>
                <Select value={draft.citySlug} onValueChange={(v) => setDraft({ ...draft, citySlug: v })} disabled={Boolean(draft.staticSlug)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CITIES.map((city) => <SelectItem key={city.slug} value={city.slug}>{city.zh}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>中文名称</Label>
                  <Input value={draft.nameZh} onChange={(e) => setDraft({ ...draft, nameZh: e.target.value })} />
                </div>
                <div>
                  <Label>英文名称</Label>
                  <Input value={draft.nameEn} onChange={(e) => setDraft({ ...draft, nameEn: e.target.value })} />
                </div>
                <div>
                  <Label>中文区域</Label>
                  <Input value={draft.areaZh} onChange={(e) => setDraft({ ...draft, areaZh: e.target.value })} placeholder="浦东新区" />
                </div>
                <div>
                  <Label>英文区域</Label>
                  <Input value={draft.areaEn} onChange={(e) => setDraft({ ...draft, areaEn: e.target.value })} placeholder="Pudong New Area" />
                </div>
              </div>
              <div>
                <Label>中文介绍</Label>
                <Textarea rows={3} value={draft.descriptionZh} onChange={(e) => setDraft({ ...draft, descriptionZh: e.target.value })} />
              </div>
              <div>
                <Label>英文介绍</Label>
                <Textarea rows={3} value={draft.descriptionEn} onChange={(e) => setDraft({ ...draft, descriptionEn: e.target.value })} />
              </div>
              <div>
                <Label>类型</Label>
                <Select value={draft.isPublic ? "public" : "private"} onValueChange={(v) => setDraft({ ...draft, isPublic: v === "public" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">私立机构</SelectItem>
                    <SelectItem value="public">公立医院</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="clinic-photo">医院照片</Label>
                {draft.photoUrl && !photoFile && <img src={draft.photoUrl} alt="" className="mb-2 aspect-[2/1] w-full rounded-xl object-cover" />}
                <FileDropZone
                  id="clinic-photo"
                  accept={PHOTO_ACCEPT}
                  rules={PHOTO_RULES}
                  disabled={saving}
                  fileName={photoFile?.name ?? null}
                  onFile={setPhotoFile}
                  onInvalid={(m) => toast.error(m)}
                />
              </div>
              {saving && progress > 0 && <Progress value={progress} />}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={() => { setDraft(null); setPhotoFile(null); }} disabled={saving}>取消</Button>
            <Button className="rounded-full" onClick={() => void save()} disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

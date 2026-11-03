import { TIKTOK_CASES } from "@/data/tiktokCases";
import { GALLERY_CASES } from "@/data/galleryCases";
import { usePublishedVideos } from "@/hooks/use-published-videos";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Images, Loader2 } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import BeforeAfterCard from "@/components/BeforeAfterCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAsia } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";
import { getPlanningMarketingCopy } from "@/lib/planning-marketing-copy";
import { usePublishedBeforeAfter } from "@/hooks/use-before-after";

const BeforeAfterGallery = () => {
  const { lang } = useAsia();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedVideo = searchParams.get("video");
  const marketing = getPlanningMarketingCopy(lang);
  const c = (en: string, zh: string, ru: string, es?: string) => asiaCopy(lang, { en, zh, ru, es });
  const { items, loading } = usePublishedBeforeAfter(lang);
  const uploadedGallery = usePublishedVideos(lang, selectedVideo ? "all" : "before-after");
  const videos = [...GALLERY_CASES, ...uploadedGallery, ...(selectedVideo ? TIKTOK_CASES : [])];
  const [videoLimit, setVideoLimit] = useState(12);
  const [q, setQ] = useState("");
  const [procedure, setProcedure] = useState<string | null>(null);

  const procedures = useMemo(
    () => [...new Set([...items.map((i) => i.procedure), ...videos.map((v) => lang === "zh" ? v.treatment.zh : v.treatment.en)].filter((p): p is string => Boolean(p)))],
    [items, videos, lang]
  );

  const filtered = useMemo(
    () =>
      items.filter((i) => {
        if (selectedVideo) return false;
        if (procedure && i.procedure !== procedure) return false;
        if (!q.trim()) return true;
        const hay = [i.title, i.caption, i.procedure, i.city, i.doctorName].filter(Boolean).join(" ").toLowerCase();
        return hay.includes(q.trim().toLowerCase());
      }),
    [items, q, procedure, selectedVideo]
  );

  const filteredVideos = videos.filter(item => {
    if (selectedVideo && item.id !== selectedVideo) return false;
    const label = lang === "zh" ? item.treatment.zh : item.treatment.en;
    if (procedure && label !== procedure) return false;
    return !q.trim() || [item.caption.en, item.caption.zh, item.treatment.en, item.treatment.zh].join(" ").toLowerCase().includes(q.trim().toLowerCase());
  });

  return (
    <>
      <PageMeta
        title={c(
          "Before & after photo results | Sino Aesthetics",
          "术前术后对比图集 | Sino Aesthetics",
          "Фото до и после | Sino Aesthetics",
          "Fotos antes y después | Sino Aesthetics"
        )}
        description={marketing.photoDescription}
        path="/before-after"
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />
        <main className="container py-10 max-w-7xl">
          <header className="mx-auto max-w-2xl text-center">
            <span className="pill bg-accent text-accent-foreground">
              <Images className="size-3.5" />
              {c("Photo results", "图片对比", "Фотографии", "Fotos")}
            </span>
            <h1 className="font-display text-4xl mt-4">
              {c("Before & after photo sets", "术前术后对比图集", "Фото до и после", "Fotos de antes y después")}
            </h1>
            <p className="text-muted-foreground mt-3">{marketing.photoDescription}</p>
            <p className="text-muted-foreground mt-3">
              {asiaCopy(lang, {
                en: "Drag the slider on each photo to compare.",
                zh: "拖动每张图片中间的滑块即可对比。",
                ru: "Перетащите ползунок на фото, чтобы сравнить.",
                es: "Arrastra el control deslizante de cada foto para comparar.",
                th: "ลากแถบเลื่อนบนแต่ละภาพเพื่อเปรียบเทียบ",
                ms: "Seret peluncur pada setiap foto untuk membandingkan.",
              })}
            </p>
          </header>

          <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-3">
            <Input
              value={q}
              onChange={(e) => { setQ(e.target.value); setVideoLimit(12); }}
              placeholder={c("Search procedure, city or expert", "搜索项目、城市或专家", "Поиск процедуры, города или эксперта", "Buscar procedimiento, ciudad o experto")}
              className="w-full max-w-xs rounded-full"
            />
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant={procedure ? "outline" : "default"} size="sm" className="rounded-full" onClick={() => { setProcedure(null); setVideoLimit(12); setSearchParams({}); }}>
                {c("All", "全部", "Все", "Todos")}
              </Button>
              {procedures.map((p) => (
                <Button
                  key={p}
                  variant={procedure === p ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => { setProcedure(p); setVideoLimit(12); setSearchParams({}); }}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>

          {loading && <Loader2 className="size-6 animate-spin text-primary mt-10" />}

          {!loading && filtered.length === 0 && filteredVideos.length === 0 && (
            <p className="text-muted-foreground mt-10">
              {c("No photo sets published yet.", "暂时还没有发布的对比图。", "Пока нет опубликованных фотографий.", "Aún no hay fotos publicadas.")}
            </p>
          )}

          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <div key={item.id} className="space-y-2">
                <BeforeAfterCard
                  single={item.before_path === item.after_path}
                  before={item.beforeUrl ?? ""}
                  after={item.afterUrl ?? ""}
                  doctor={item.doctorName || item.title}
                  city={[item.city, item.months_after ? c(`${item.months_after} months after`, `术后 ${item.months_after} 个月`, `${item.months_after} мес. после`, `${item.months_after} meses después`) : null]
                    .filter(Boolean)
                    .join(" · ")}
                  procedure={item.procedure || item.title}
                  layout="wide"
                />
                {item.caption && <p className="text-sm text-muted-foreground px-1">{item.caption}</p>}
                {item.doctor_id && (
                  <Link to={`/doctors/profile/${item.doctor_id}`} className="text-sm text-brand px-1">
                    {c("View expert profile", "查看专家资料", "Профиль эксперта", "Ver perfil del experto")}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <section id="video-cases" data-testid="before-after-videos" className="mt-10 border-t pt-8">
            <h2 className="font-display text-2xl">{lang === "zh" ? "术前术后视频案例" : "Before & after video cases"}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{lang === "zh" ? "按原视频展示对比与恢复记录，个体情况和效果存在差异。视频中的具体术式以原始说明为准。" : "Original comparison and recovery videos. Individual results vary; refer to the source description for the exact procedure."}</p>
            <p role="status" className="mt-3 text-sm">{lang === "zh" ? "当前筛选：" : "Current results: "}{filtered.length}{lang === "zh" ? " 组图片 · " : " photo sets · "}{filteredVideos.length}{lang === "zh" ? " 个视频" : " videos"}</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.slice(0, videoLimit).map(item => <article key={item.id} id={item.id} className="overflow-hidden rounded-3xl border bg-card shadow-soft">
                <video controls playsInline preload="metadata" poster={item.poster} src={item.src} aria-label={lang === "zh" ? item.caption.zh : item.caption.en} className="aspect-[4/5] max-h-[480px] w-full bg-black object-contain" />
                <div className="p-4"><p className="text-xs text-brand">{lang === "zh" ? item.treatment.zh : item.treatment.en}</p><h3 className="mt-2 text-sm font-medium">{lang === "zh" ? item.caption.zh : item.caption.en}</h3></div>
              </article>)}
            </div>
            {videoLimit < filteredVideos.length && <Button variant="outline" className="mx-auto mt-6 block rounded-full" onClick={() => setVideoLimit(n => n + 12)}>{lang === "zh" ? "加载更多视频" : "Load more videos"}</Button>}
          </section>

          <div className="mt-12">
            <MedicalDisclaimer />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BeforeAfterGallery;

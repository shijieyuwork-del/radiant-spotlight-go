import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
import { usePublishedBeforeAfter } from "@/hooks/use-before-after";

const BeforeAfterGallery = () => {
  const { lang } = useAsia();
  const c = (en: string, zh: string, ru: string, es?: string) => asiaCopy(lang, { en, zh, ru, es });
  const { items, loading } = usePublishedBeforeAfter(lang);
  const [q, setQ] = useState("");
  const [procedure, setProcedure] = useState<string | null>(null);

  const procedures = useMemo(
    () => [...new Set(items.map((i) => i.procedure).filter((p): p is string => Boolean(p)))],
    [items]
  );

  const filtered = useMemo(
    () =>
      items.filter((i) => {
        if (procedure && i.procedure !== procedure) return false;
        if (!q.trim()) return true;
        const hay = [i.title, i.caption, i.procedure, i.city, i.doctorName].filter(Boolean).join(" ").toLowerCase();
        return hay.includes(q.trim().toLowerCase());
      }),
    [items, q, procedure]
  );

  return (
    <>
      <PageMeta
        title={c(
          "Before & after photo results | CeladonChina",
          "术前术后对比图集 | CeladonChina",
          "Фото до и после | CeladonChina",
          "Fotos antes y después | CeladonChina"
        )}
        description={c(
          "Swipe through verified before and after photo sets from published experts across Asia.",
          "滑动查看平台已发布专家的术前术后真实对比照片。",
          "Смотрите проверенные фото до и после от опубликованных экспертов Азии.",
          "Desliza para ver fotos verificadas de antes y después de expertos publicados en Asia."
        )}
        path="/before-after"
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />
        <main className="container py-10 max-w-6xl">
          <header className="mx-auto max-w-2xl text-center">
            <span className="pill bg-accent text-accent-foreground">
              <Images className="size-3.5" />
              {c("Photo results", "图片对比", "Фотографии", "Fotos")}
            </span>
            <h1 className="font-display text-4xl mt-4">
              {c("Before & after photo sets", "术前术后对比图集", "Фото до и после", "Fotos de antes y después")}
            </h1>
            <p className="text-muted-foreground mt-3">
              {c(
                "Drag the slider on each photo to compare. Every set is published by the platform and linked to the expert who performed it.",
                "拖动每张图片中间的滑块即可对比，每组图片均由平台发布，并标注对应的专家。",
                "Перетащите ползунок, чтобы сравнить. Каждый набор опубликован платформой и связан с экспертом.",
                "Arrastra el control deslizante para comparar. Cada conjunto está publicado por la plataforma y vinculado al experto."
              )}
            </p>
          </header>

          <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-3">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={c("Search procedure, city or expert", "搜索项目、城市或专家", "Поиск процедуры, города или эксперта", "Buscar procedimiento, ciudad o experto")}
              className="w-full max-w-xs rounded-full"
            />
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant={procedure ? "outline" : "default"} size="sm" className="rounded-full" onClick={() => setProcedure(null)}>
                {c("All", "全部", "Все", "Todos")}
              </Button>
              {procedures.map((p) => (
                <Button
                  key={p}
                  variant={procedure === p ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setProcedure(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>

          {loading && <Loader2 className="size-6 animate-spin text-primary mt-10" />}

          {!loading && filtered.length === 0 && (
            <p className="text-muted-foreground mt-10">
              {c("No photo sets published yet.", "暂时还没有发布的对比图。", "Пока нет опубликованных фотографий.", "Aún no hay fotos publicadas.")}
            </p>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
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
                />
                {item.caption && <p className="text-sm text-muted-foreground px-1">{item.caption}</p>}
                {item.doctor_id && (
                  <Link to={`/doctors/profile/${item.doctor_id}`} className="text-sm text-primary px-1">
                    {c("View expert profile", "查看专家资料", "Профиль эксперта", "Ver perfil del experto")}
                  </Link>
                )}
              </div>
            ))}
          </div>

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

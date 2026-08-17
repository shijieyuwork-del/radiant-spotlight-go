import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Heart, MessageCircle, Share2, Volume2, VolumeX, Play,
  BadgeCheck, Building2, Calendar, ShieldCheck, Maximize2, Images, MapPin,
} from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import TikTokWall from "@/components/TikTokWall";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { DOCTORS } from "@/data/doctors";
import { DEMO_CHINA_DOCTORS } from "@/data/demoChinaDoctors";
import { useAsia } from "@/lib/asia-i18n";
import { useSavedCase } from "@/lib/saved-cases";

const CaseDetail = () => {
  const { id } = useParams();
  const { t, lang, fmt } = useAsia();
  const item = useMemo(() => TIKTOK_CASES.find((c) => c.id === id), [id]);
  const doctor = useMemo(() => DOCTORS.find(() => false), []);
  const caseDoctor = useMemo(() => {
    const treatment = item?.treatment.en.toLowerCase() ?? "";
    if (/facelift|neck lift|fat graft/.test(treatment)) return DEMO_CHINA_DOCTORS[1];
    if (/breast/.test(treatment)) return DEMO_CHINA_DOCTORS[2];
    if (/liposuction|tummy|body|bbl/.test(treatment)) return DEMO_CHINA_DOCTORS[3];
    if (/skin|non-surgical/.test(treatment)) return DEMO_CHINA_DOCTORS[4];
    return DEMO_CHINA_DOCTORS[0];
  }, [item]);
  const doctorCases = useMemo(
    () => doctor
      ? TIKTOK_CASES.filter((c) => c.id !== id && doctor.caseIds.includes(c.id))
      : [],
    [doctor, id],
  );
  const related = useMemo(
    () => TIKTOK_CASES.filter((c) => c.id !== id && !doctorCases.some((other) => other.id === c.id)).slice(0, 5),
    [doctorCases, id],
  );

  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [ended, setEnded] = useState(false);
  const { saved, toggleSaved, signedIn } = useSavedCase(id ?? "");

  if (!item) {
    return (
      <>
        <PageMeta
          title="Case Not Found"
          description="The case you're looking for doesn't exist."
          path={`/cases/${id}`}
        />
        <div className="min-h-screen bg-background">
          <AsiaNavbar homeLinks={false} />
          <div className="container py-24 text-center">
            <p className="text-muted-foreground">
              {lang === "zh" ? "案例不存在。" : "Case not found."}
            </p>
            <Link to="/cases" className="text-primary underline mt-4 inline-block">
              {lang === "zh" ? "返回案例列表" : "Back to all cases"}
            </Link>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  const currentIndex = TIKTOK_CASES.findIndex((caseItem) => caseItem.id === item.id);
  const previousItem = TIKTOK_CASES[(currentIndex - 1 + TIKTOK_CASES.length) % TIKTOK_CASES.length];
  const nextItem = TIKTOK_CASES[(currentIndex + 1) % TIKTOK_CASES.length];

  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { setEnded(false); v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const treatment = item.treatment[lang];
  const caseSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: treatment,
    description: item.caption[lang],
    image: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`,
    creator: doctor ? {
      "@type": "Person",
      name: lang === "zh" ? doctor.zh : doctor.en,
    } : undefined,
  };

  return (
    <>
      <PageMeta
        title={`${treatment} Recovery Diary Preview | Cosmetics Asia`}
        description={`View a ${treatment} recovery diary preview for China. Provider and patient verification details are published only after review.`}
        path={`/cases/${id}`}
        type="article"
        structuredData={caseSchema}
      />
      <div className="min-h-screen bg-background">
      <AsiaNavbar homeLinks={false} />

      <section className="container py-8 md:py-12">
        <Link to="/cases" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="size-4" /> {t("case.back")}
        </Link>

        <div className="grid min-w-0 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Player */}
          <div className="min-w-0 lg:col-span-5">
            <div
              className="relative mx-auto aspect-[9/16] w-full max-w-md cursor-pointer overflow-hidden rounded-3xl bg-black shadow-pop lg:max-w-none"
              onClick={togglePlay}
            >
              <video
                key={item.id}
                ref={ref}
                src={item.src}
                autoPlay
                muted={muted}
                playsInline
                onPlay={() => { setPlaying(true); setEnded(false); }}
                onPause={() => setPlaying(false)}
                onEnded={() => { setPlaying(false); setEnded(true); }}
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

              <button
                type="button"
                onClick={(event) => { event.stopPropagation(); setExpanded(true); }}
                className="absolute right-3 top-3 z-20 inline-flex min-h-11 items-center gap-2 rounded-full bg-white/90 px-4 text-xs font-bold text-foreground shadow-pop backdrop-blur transition hover:bg-white active:scale-[0.98]"
                aria-label={lang === "zh" ? "放大观看案例" : lang === "ru" ? "Открыть в большом формате" : "Enlarge case video"}
              >
                <Maximize2 className="size-4" />
                {lang === "zh" ? "放大观看" : lang === "ru" ? "Увеличить" : "Enlarge"}
              </button>

              {!playing && (
                <div className="absolute inset-0 grid place-items-center pointer-events-none">
                  <div className="size-16 rounded-full bg-white/85 grid place-items-center shadow-pop">
                    <Play className="size-7 text-foreground fill-foreground translate-x-0.5" />
                  </div>
                </div>
              )}

              {ended && (
                <div className="absolute inset-0 z-20 grid place-items-center bg-black/65 p-6 backdrop-blur-[2px]" onClick={(event) => event.stopPropagation()}>
                  <div className="max-w-xs text-center text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">{lang === "zh" ? "下一个案例" : "Up next"}</p>
                    <p className="mt-2 font-display text-2xl font-medium leading-tight">{nextItem.treatment[lang]}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-white/75">{nextItem.caption[lang]}</p>
                    <Button asChild size="lg" className="mt-5 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90">
                      <Link to={`/cases/${nextItem.id}`}>{lang === "zh" ? "播放下一个" : "Watch next case"}<ArrowRight className="ml-2 size-4" /></Link>
                    </Button>
                    <button type="button" className="mt-3 block w-full text-xs text-white/70 hover:text-white" onClick={() => { setEnded(false); ref.current?.play(); }}>
                      {lang === "zh" ? "重新播放当前视频" : "Replay this video"}
                    </button>
                  </div>
                </div>
              )}

              <div className="absolute right-3 bottom-24 flex flex-col items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSaved(); }}
                  className="size-11 rounded-full bg-black/40 backdrop-blur grid place-items-center text-white"
                  aria-label={signedIn
                    ? saved ? "Remove from saved cases" : "Save this case"
                    : "Sign up to save this case"}
                >
                  <Heart className={`size-5 ${saved ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>
                <span className="text-[11px] text-white font-semibold -mt-2">{item.likes}</span>
                <button onClick={(e) => { e.stopPropagation(); }} className="size-11 rounded-full bg-black/40 backdrop-blur grid place-items-center text-white">
                  <MessageCircle className="size-5" />
                </button>
                <span className="text-[11px] text-white font-semibold -mt-2">{item.comments}</span>
                <button onClick={(e) => { e.stopPropagation(); }} className="size-11 rounded-full bg-black/40 backdrop-blur grid place-items-center text-white">
                  <Share2 className="size-5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setMuted((m) => !m); }} className="size-11 rounded-full bg-black/40 backdrop-blur grid place-items-center text-white">
                  {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                </button>
              </div>

              <div className="absolute left-3 right-16 bottom-3 text-white">
                <p className="text-sm font-semibold">{item.user[lang]}</p>
                <p className="text-[13px] mt-1 leading-snug">{item.caption[lang]}</p>
              </div>
            </div>

            <nav className="mx-auto mt-4 grid w-full max-w-md grid-cols-2 gap-3 lg:max-w-none" aria-label={lang === "zh" ? "案例浏览" : "Browse cases"}>
              <Link to={`/cases/${previousItem.id}`} className="group rounded-2xl border border-border/70 bg-card p-3 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/30">
                <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"><ArrowLeft className="size-3.5" />{lang === "zh" ? "上一个" : "Previous"}</span>
                <span className="mt-1 block truncate text-sm font-semibold">{previousItem.treatment[lang]}</span>
              </Link>
              <Link to={`/cases/${nextItem.id}`} className="group rounded-2xl border border-primary/30 bg-primary/10 p-3 shadow-soft transition hover:-translate-y-0.5 hover:bg-primary/15">
                <span className="flex items-center justify-end gap-1 text-[11px] font-semibold uppercase tracking-wider text-primary">{lang === "zh" ? "下一个" : "Next"}<ArrowRight className="size-3.5" /></span>
                <span className="mt-1 block truncate text-right text-sm font-semibold">{nextItem.treatment[lang]}</span>
              </Link>
            </nav>
          </div>

          {/* Info */}
          <div className="min-w-0 space-y-5 lg:col-span-7">
            <div>
              <span className="pill bg-accent text-accent-foreground"><BadgeCheck className="size-3.5 text-primary" /> {item.treatment[lang]}</span>
              <h1 className="font-display text-3xl md:text-4xl font-medium tracking-tight mt-3 leading-tight">
                {item.caption[lang]}
              </h1>
              <p className="text-muted-foreground mt-2">{item.user[lang]}</p>
            </div>

            <div className="rounded-3xl bg-card shadow-soft p-5 space-y-3">
              <p className="text-sm flex items-center gap-2"><Building2 className="size-4 text-primary" /> {item.clinic[lang]}</p>
              {item.city && (
                <p className="text-sm flex items-center gap-2"><MapPin className="size-4 text-primary" /> {item.city[lang]}, China</p>
              )}
              <p className="text-sm flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> {lang === "zh" ? "日记预览 · 核验状态待更新" : "Diary preview · verification status pending"}</p>
            </div>

            <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {lang === "zh" ? "相关专科医生" : lang === "ru" ? "Врач по данному направлению" : "Doctor for this specialty"}
                </p>
                <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-accent-foreground">
                  {lang === "zh" ? "示例资料" : lang === "ru" ? "Демо-профиль" : "Sample profile"}
                </span>
              </div>
              <div className="flex items-start gap-4">
                <img src={caseDoctor.photo} alt={caseDoctor.name} className="size-24 shrink-0 rounded-2xl border-2 border-primary/15 object-cover sm:size-28" />
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-xl font-semibold leading-tight sm:text-2xl">{caseDoctor.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{caseDoctor.title}</p>
                  <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground"><Building2 className="mt-0.5 size-3.5 shrink-0 text-primary" />{caseDoctor.hospital}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3.5 shrink-0 text-primary" />{caseDoctor.city}, China</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{caseDoctor.bio}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {caseDoctor.specialties.map((specialty) => <span key={specialty} className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-foreground/80">{specialty}</span>)}
              </div>
              <div className="mt-5 grid gap-2 min-[430px]:grid-cols-2">
                <Link to="/doctors" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-primary/30 px-4 text-sm font-semibold text-primary transition hover:bg-primary/10">
                  {lang === "zh" ? "浏览医生" : lang === "ru" ? "Смотреть врачей" : "Browse doctors"}<ArrowRight className="size-4" />
                </Link>
                <a href={`https://wa.me/14708613825?text=${encodeURIComponent(`Hi Cosmetics Asia, I’d like help finding a doctor for ${item.treatment.en}.`)}`} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:bg-primary/90">
                  {lang === "zh" ? "咨询匹配医生" : lang === "ru" ? "Подобрать врача" : "Find a matching doctor"}<MessageCircle className="size-4" />
                </a>
              </div>
            </div>

            {item.priceCny > 0 && <div className="rounded-3xl bg-gradient-to-br from-[hsl(155,60%,90%)] to-[hsl(50,80%,92%)] p-5 flex items-center justify-between gap-4 shadow-soft">
              <div>
                <p className="text-xs text-foreground/60">{lang === "zh" ? "参考价格" : "Reference price"}</p>
                <p className="font-display text-3xl font-semibold mt-1">{fmt(item.priceCny)}</p>
              </div>
              <Button size="lg" className="rounded-2xl bg-foreground text-background hover:bg-foreground/90">
                {t("case.book")}
              </Button>
            </div>}

            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p>
                {lang === "zh" ? "这是日记版式预览。患者身份、接诊机构、价格和就诊凭证完成审核后，页面才会展示相应的已核验标识。" : "This is a diary-format preview. Patient identity, provider, pricing and attendance evidence are shown as verified only after review is complete."}
              </p>
            </div>

            <aside className="overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-br from-[hsl(340,82%,92%)] via-[hsl(var(--primary)/.18)] to-[hsl(50,80%,92%)] p-5 shadow-soft sm:p-7">
              <span className="pill bg-card/80 text-accent-foreground shadow-soft">
                <MessageCircle className="size-3.5 text-primary" />
                {lang === "zh" ? "免费咨询" : lang === "ru" ? "Бесплатная консультация" : "Free guidance"}
              </span>
              <h2 className="mt-4 font-display text-2xl font-medium leading-tight tracking-tight sm:text-3xl">
                {lang === "zh"
                  ? "正在考虑类似的项目？"
                  : lang === "ru"
                    ? "Рассматриваете похожую процедуру?"
                    : "Considering a similar procedure?"}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {lang === "zh"
                  ? "把这个案例发给我们，并告诉我们你的目标。我们可以协助你匹配医生、了解预估费用和恢复安排。"
                  : lang === "ru"
                    ? "Отправьте нам этот пример и расскажите о своей цели. Мы поможем подобрать врача и разобраться в стоимости и восстановлении."
                    : "Send us this case and tell us your goals. We can help you compare doctors and understand estimated pricing and recovery planning."}
              </p>
              <a
                href={`https://wa.me/14708613825?text=${encodeURIComponent(`Hi Cosmetics Asia, I’m interested in this ${item.treatment.en} case: https://cosmetics-asia.com/cases/${item.id}`)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-pop transition hover:-translate-y-0.5 hover:bg-primary/90 sm:w-auto sm:rounded-full"
              >
                {lang === "zh" ? "联系我们" : lang === "ru" ? "Связаться с нами" : "Contact us about this case"}
                <ArrowRight className="size-4" />
              </a>
            </aside>
          </div>
        </div>

        {doctor && doctorCases.length > 0 && (
          <div className="mt-16 rounded-[2rem] bg-card shadow-soft p-5 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-2">
                  <Images className="size-4" /> {lang === "zh" ? "同一位医生" : "Same surgeon"}
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight">
                  {lang === "zh"
                    ? `${doctor.zh} 的其他真实案例`
                    : `More cases by ${doctor.en}`}
                </h2>
              </div>
              <Link to={`/doctors/${doctor.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                {lang === "zh" ? "查看医生全部案例" : "See surgeon's full profile"} <ArrowRight className="size-4" />
              </Link>
            </div>
            <TikTokWall items={doctorCases} lang={lang} fmtPrice={fmt} variant="wall" />
          </div>
        )}

        <div className="mt-16">
          <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight mb-6">
            {lang === "zh" ? "你可能也感兴趣" : "You may also like"}
          </h2>
          <TikTokWall items={related} lang={lang} fmtPrice={fmt} variant="wall" />
        </div>
      </section>

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="w-[min(96vw,1100px)] max-w-none h-[92vh] border-0 bg-black p-3 sm:p-5 rounded-3xl overflow-hidden">
          <DialogTitle className="sr-only">{item.caption[lang]}</DialogTitle>
          <DialogDescription className="sr-only">
            {lang === "zh" ? "真实案例放大视频" : "Expanded real case video"}
          </DialogDescription>
          <video
            src={item.src}
            poster={item.poster}
            autoPlay
            controls
            loop
            playsInline
            className="size-full object-contain rounded-2xl"
          />
        </DialogContent>
      </Dialog>

      <Footer />
      </div>
    </>
  );
};

export default CaseDetail;

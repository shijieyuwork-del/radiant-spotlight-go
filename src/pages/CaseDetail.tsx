import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Heart, MessageCircle, Share2, Volume2, VolumeX, Play,
  BadgeCheck, Building2, Calendar, ShieldCheck, Maximize2, Images,
} from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import TikTokWall from "@/components/TikTokWall";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { DOCTORS } from "@/data/doctors";
import { useAsia } from "@/lib/asia-i18n";

const CaseDetail = () => {
  const { id } = useParams();
  const { t, lang, fmt } = useAsia();
  const item = useMemo(() => TIKTOK_CASES.find((c) => c.id === id), [id]);
  const doctor = useMemo(() => DOCTORS.find((d) => id && d.caseIds.includes(id)), [id]);
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

  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const treatment = item.treatment[lang];
  const caseSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalCase",
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
        title={`${treatment} - Real Patient Case | Before & After`}
        description={`Watch a real before-and-after ${treatment} procedure performed in Asia. Patient recovery timeline, price, surgeon info, and verified results.`}
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

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Player */}
          <div className="lg:col-span-5">
            <div
              className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-black shadow-pop cursor-pointer max-w-md mx-auto lg:max-w-none"
              onClick={togglePlay}
            >
              <video
                ref={ref}
                src={item.src}
                autoPlay
                muted={muted}
                loop
                playsInline
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

              {!playing && (
                <div className="absolute inset-0 grid place-items-center pointer-events-none">
                  <div className="size-16 rounded-full bg-white/85 grid place-items-center shadow-pop">
                    <Play className="size-7 text-foreground fill-foreground translate-x-0.5" />
                  </div>
                </div>
              )}

              <div className="absolute right-3 bottom-24 flex flex-col items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
                  className="size-11 rounded-full bg-black/40 backdrop-blur grid place-items-center text-white"
                  aria-label={lang === "zh" ? "全屏放大" : "Open large view"}
                >
                  <Maximize2 className="size-5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); }} className="size-11 rounded-full bg-black/40 backdrop-blur grid place-items-center text-white">
                  <Heart className="size-5" />
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
          </div>

          {/* Info */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <span className="pill bg-accent text-accent-foreground"><BadgeCheck className="size-3.5 text-primary" /> {item.treatment[lang]}</span>
              <h1 className="font-display text-3xl md:text-4xl font-medium tracking-tight mt-3 leading-tight">
                {item.caption[lang]}
              </h1>
              <p className="text-muted-foreground mt-2">{item.user[lang]}</p>
            </div>

            <div className="rounded-3xl bg-card shadow-soft p-5 space-y-3">
              <p className="text-sm flex items-center gap-2"><Building2 className="size-4 text-primary" /> {item.clinic[lang]}</p>
              <p className="text-sm flex items-center gap-2"><Calendar className="size-4 text-primary" /> {lang === "zh" ? "手术时间 · 近 6 个月" : "Procedure date · within 6 months"}</p>
              <p className="text-sm flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> {lang === "zh" ? "身份证 + 消费凭证已核验" : "Identity & receipt verified"}</p>
            </div>

            {doctor && (
              <div className="rounded-3xl bg-card shadow-soft p-5">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                  {lang === "zh" ? "本案例主刀医师" : "Surgeon for this case"}
                </p>
                <Link
                  to={`/doctors/${doctor.id}`}
                  className="flex items-center gap-4 hover:opacity-90 transition group"
                >
                  <img src={doctor.img} alt={lang === "zh" ? doctor.zh : doctor.en} className="size-20 rounded-2xl object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xl font-semibold leading-tight truncate">
                      {lang === "zh" ? doctor.zh : doctor.en}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {lang === "zh" ? doctor.titleZh : doctor.titleEn} · {doctor.years}{lang === "zh" ? "年经验" : " years experience"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {doctor.surgeries} {lang === "zh" ? "台案例" : "procedures"} · {doctor.rating} ★
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-primary shrink-0">
                    {lang === "zh" ? "查看医生" : "View doctor"} <ArrowRight className="size-4" />
                  </span>
                </Link>
              </div>
            )}

            <div className="rounded-3xl bg-gradient-to-br from-[hsl(155,60%,90%)] to-[hsl(50,80%,92%)] p-5 flex items-center justify-between gap-4 shadow-soft">
              <div>
                <p className="text-xs text-foreground/60">{lang === "zh" ? "参考价格" : "Reference price"}</p>
                <p className="font-display text-3xl font-semibold mt-1">{fmt(item.priceCny)}</p>
              </div>
              <Button size="lg" className="rounded-2xl bg-foreground text-background hover:bg-foreground/90">
                {t("case.book")}
              </Button>
            </div>

            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p>
                {lang === "zh" ? "本日记包含术前术后真实对比、每日恢复记录，以及主诊医师术后回访。Cosmetics Asia 已根据消费凭证与身份证核实日记真实性。" : "This patient diary documents real before/after, daily recovery photos, and a follow-up call with the attending surgeon. Cosmetics Asia verifies every diary against the patient's clinic receipt and ID."}
              </p>
            </div>
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

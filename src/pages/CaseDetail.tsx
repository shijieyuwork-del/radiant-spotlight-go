import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Heart, MessageCircle, Share2, Volume2, VolumeX, Play,
  BadgeCheck, Building2, Calendar, ShieldCheck,
} from "lucide-react";
import CnNavbar from "@/components/CnNavbar";
import Footer from "@/components/Footer";
import TikTokWall from "@/components/TikTokWall";
import { Button } from "@/components/ui/button";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { DOCTORS } from "@/data/doctors";
import { useCn } from "@/lib/cn-i18n";

const CaseDetail = () => {
  const { id } = useParams();
  const { t, lang, fmt } = useCn();
  const item = useMemo(() => TIKTOK_CASES.find((c) => c.id === id), [id]);
  const doctor = useMemo(() => DOCTORS.find((d) => id && d.caseIds.includes(id)), [id]);
  const related = useMemo(
    () => TIKTOK_CASES.filter((c) => c.id !== id).slice(0, 5),
    [id],
  );

  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <CnNavbar homeLinks={false} />
        <div className="container py-24 text-center">
          <p className="text-muted-foreground">
            {lang === "en" ? "Case not found." : "案例不存在。"}
          </p>
          <Link to="/cases" className="text-primary underline mt-4 inline-block">
            {lang === "en" ? "Back to all cases" : "返回案例列表"}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <div className="min-h-screen bg-background">
      <CnNavbar homeLinks={false} />

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
              <p className="text-sm flex items-center gap-2"><Calendar className="size-4 text-primary" /> {lang === "en" ? "Procedure date · within 6 months" : "手术时间 · 近 6 个月"}</p>
              <p className="text-sm flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> {lang === "en" ? "Identity & receipt verified" : "身份证 + 消费凭证已核验"}</p>
            </div>

            {doctor && (
              <Link
                to={`/doctors/${doctor.id}`}
                className="rounded-3xl bg-card shadow-soft p-5 flex items-center gap-4 hover:shadow-glow transition group block"
              >
                <img src={doctor.img} alt="" className="size-16 rounded-2xl object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    {lang === "en" ? "Performed by" : "主刀医师"}
                  </p>
                  <p className="font-display text-lg font-semibold leading-tight truncate mt-0.5">
                    {lang === "en" ? doctor.en : doctor.zh}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {lang === "en" ? doctor.titleEn : doctor.titleZh} · {doctor.years}{lang === "en" ? " yrs" : "年"} · {doctor.surgeries}
                  </p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition shrink-0" />
              </Link>
            )}

            <div className="rounded-3xl bg-gradient-to-br from-[hsl(155,60%,90%)] to-[hsl(50,80%,92%)] p-5 flex items-center justify-between gap-4 shadow-soft">
              <div>
                <p className="text-xs text-foreground/60">{lang === "en" ? "Reference price" : "参考价格"}</p>
                <p className="font-display text-3xl font-semibold mt-1">{fmt(item.priceCny)}</p>
              </div>
              <Button size="lg" className="rounded-2xl bg-foreground text-background hover:bg-foreground/90">
                {t("case.book")}
              </Button>
            </div>

            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p>
                {lang === "en"
                  ? "This patient diary documents real before/after, daily recovery photos, and a follow-up call with the attending surgeon. Glowy verifies every diary against the patient's clinic receipt and ID."
                  : "本日记包含术前术后真实对比、每日恢复记录，以及主诊医师术后回访。Glowy 已根据消费凭证与身份证核实日记真实性。"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight mb-6">
            {t("case.related")}
          </h2>
          <TikTokWall items={related} lang={lang} fmtPrice={fmt} variant="wall" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CaseDetail;

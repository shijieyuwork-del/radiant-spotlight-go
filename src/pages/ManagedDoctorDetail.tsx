import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  ChevronDown,
  ArrowRight,
  Languages,
  Loader2,
  MapPin,
  Stethoscope,
} from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { supabase } from "@/integrations/supabase/client";
import { localizeDoctorRow, localizeVideoRow } from "@/lib/i18n-content";
import { signedUrl, signedUrls } from "@/lib/storage-urls";
import { formatCityTime, getCityTimezone } from "@/lib/timezones";
import QuoteCtaButton from "@/components/QuoteCtaButton";
import CoverVideo from "@/components/CoverVideo";
import { useAsia } from "@/lib/asia-i18n";
import BeforeAfterCard from "@/components/BeforeAfterCard";
import { usePublishedBeforeAfter } from "@/hooks/use-before-after";

type Doctor = {
  id: string;
  name: string;
  title: string;
  city: string;
  specialties: string[];
  bio: string;
  credentials: string | null;
  languages: string | null;
  photo_path: string | null;
};
type Video = {
  id: string;
  title: string;
  caption: string | null;
  storage_path: string;
  cover_path: string | null;
  url?: string;
  coverUrl?: string;
};
const ManagedDoctorDetail = () => {
  const { lang } = useAsia();
  const { id = "" } = useParams();
  const { items: beforeAfter } = usePublishedBeforeAfter(lang, id);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState("");
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setDoctor(null);
    setVideos([]);
    setPhoto("");
    void (async () => {
      try {
        const { data, error } = await supabase
          .from("doctors")
          .select(
            "id,name,title,city,specialties,bio,credentials,languages,photo_path,i18n",
          )
          .eq("id", id)
          .eq("status", "published")
          .maybeSingle();
        if (cancelled || error || !data) return;
        const nextDoctor = localizeDoctorRow(
          data as Record<string, unknown>,
          lang,
        ) as unknown as Doctor;
        const nextPhoto = await signedUrl("doctor-photos", (data as Doctor).photo_path);
        if (cancelled) return;
        const r = await supabase
          .from("videos")
          .select("id,title,caption,storage_path,cover_path,i18n")
          .eq("doctor_id", id)
          .eq("status", "published")
          .order("created_at", { ascending: false });
        if (cancelled) return;
        const rows = (r.data ?? []) as Video[];
        const [urls, coverUrls] = await Promise.all([
          signedUrls(
            "short-videos",
            rows.map((v) => v.storage_path),
          ),
          signedUrls(
            "video-covers",
            rows.map((v) => v.cover_path),
          ),
        ]);
        if (cancelled) return;
        setDoctor(nextDoctor);
        setPhoto(nextPhoto);
        setVideos(
          rows.map(
            (v, i) =>
              localizeVideoRow(
                { ...v, url: urls[i], coverUrl: coverUrls[i] } as Record<
                  string,
                  unknown
                >,
                lang,
              ) as unknown as Video,
          ),
        );
      } catch {
        if (!cancelled) setDoctor(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, lang]);
  const c = (en: string, zh: string, ru: string, es: string) =>
    lang === "zh" ? zh : lang === "ru" ? ru : lang === "es" ? es : en;
  if (loading)
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!doctor)
    return (
      <>
        <AsiaNavbar />
        <main className="container py-24 text-center">
          {c(
            "Expert profile not found.",
            "专家资料不存在。",
            "Профиль эксперта не найден.",
            "Perfil de experto no encontrado.",
          )}
          <br />
          <Link to="/doctors" className="text-brand underline underline-offset-4">
            {c(
              "Back to experts",
              "返回专家列表",
              "Ко всем экспертам",
              "Volver a expertos",
            )}
          </Link>
        </main>
      </>
    );
  const tz = getCityTimezone(doctor.city);
  const doctorSchema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    jobTitle: doctor.title,
    ...(photo ? { image: photo } : {}),
    ...(doctor.bio ? { description: doctor.bio } : {}),
    ...(doctor.specialties?.length
      ? { medicalSpecialty: doctor.specialties }
      : {}),
    ...(doctor.languages ? { knowsLanguage: doctor.languages } : {}),
    workLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: doctor.city },
    },
  };
  const monthsLabel = (m: number) =>
    c(
      `${m} months after`,
      `术后 ${m} 个月`,
      `${m} мес. после`,
      `${m} meses después`,
    );
  return (
    <>
      <PageMeta
        title={`${doctor.name} | ${doctor.title}`}
        description={`${doctor.name}, ${doctor.title} in ${doctor.city}.`}
        path={`/doctors/profile/${doctor.id}`}
        image={photo || undefined}
        structuredData={doctorSchema}
      />
      <div className="min-h-screen bg-background">
        <AsiaNavbar />
        <main className="container py-10 max-w-6xl">
          <Link
            to="/doctors"
            className="inline-flex gap-1 text-sm text-muted-foreground"
          >
            <ArrowLeft className="size-4" />
            {c("All experts", "全部专家", "Все эксперты", "Todos los expertos")}
          </Link>
          <section className="mt-6 rounded-3xl bg-card p-5 shadow-pop sm:p-6 md:p-8">
            <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
              {photo ? (
                <img src={photo} alt={doctor.name} className="aspect-square w-full rounded-2xl object-cover" />
              ) : (
                <div className="grid aspect-square place-items-center rounded-2xl bg-muted">
                  <Stethoscope className="size-10 text-foreground" />
                </div>
              )}
              <div className="min-w-0">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <BadgeCheck className="size-3.5 shrink-0" />
                  {c("Published expert profile", "已发布专家资料", "Опубликованный профиль эксперта", "Perfil de experto publicado")}
                </p>
                <h1 className="mt-2 break-words font-display text-3xl leading-tight sm:text-4xl">{doctor.name}</h1>
                <p className="mt-2 text-sm text-foreground sm:text-base">{doctor.title}</p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-foreground">
                  <MapPin className="size-4 shrink-0" />{doctor.city}
                </p>
              </div>
            </div>

            {doctor.specialties.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-foreground">{c("Specialties", "擅长项目", "Специализации", "Especialidades")}</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {doctor.specialties.slice(0, 3).map((specialty) => <span key={specialty} className="rounded-full bg-accent px-3 py-1.5 text-sm text-foreground">{specialty}</span>)}
                </div>
                {doctor.specialties.length > 3 && (
                  <details className="group mt-3">
                    <summary className="flex min-h-11 w-fit cursor-pointer list-none items-center gap-2 rounded-lg px-1 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground [&::-webkit-details-marker]:hidden">
                      {c(`View all specialties (${doctor.specialties.length})`, `查看全部擅长项目（${doctor.specialties.length}）`, `Все специализации (${doctor.specialties.length})`, `Ver todas las especialidades (${doctor.specialties.length})`)}
                      <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {doctor.specialties.slice(3).map((specialty) => <span key={specialty} className="rounded-full bg-accent px-3 py-1.5 text-sm text-foreground">{specialty}</span>)}
                    </div>
                  </details>
                )}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <QuoteCtaButton quoteCtx={{ doctorName: doctor.name, city: doctor.city, source: "expert_profile" }} className="w-full whitespace-normal px-5 sm:w-auto" data-testid="expert-profile-consultation" />
              <a href="#expert-cases" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-foreground/25 px-5 text-sm font-semibold text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground">
                {c(`View cases (${videos.length + beforeAfter.length})`, `查看案例（${videos.length + beforeAfter.length}）`, `Смотреть случаи (${videos.length + beforeAfter.length})`, `Ver casos (${videos.length + beforeAfter.length})`)}<ArrowRight className="size-4" />
              </a>
            </div>

            <details className="group mt-5 border-t border-border pt-3">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground [&::-webkit-details-marker]:hidden">
                {c("Consultation time & languages", "咨询时间与语言", "Время консультаций и языки", "Horario e idiomas de consulta")}
                <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-foreground">
                <Clock className="mt-0.5 size-4 shrink-0" />
                {c(
                  `Local time in ${doctor.city}: ${tz.offset} (${tz.label.en}) · now about ${formatCityTime(tz, "en")} — consultation slots follow this timezone`,
                  `${doctor.city}当地时间 ${tz.offset}（${tz.label.zh}）· 现在约 ${formatCityTime(tz, "zh")} — 预约咨询时间以此时区为准`,
                  `Местное время в ${doctor.city}: ${tz.offset} (${tz.label.ru}) · сейчас около ${formatCityTime(tz, "ru")} — время консультаций указано в этом часовом поясе`,
                  `Hora local en ${doctor.city}: ${tz.offset} (${tz.label.es}) · ahora aprox. ${formatCityTime(tz, "es")} — las citas siguen esta zona horaria`,
                )}
              </p>
              {doctor.languages && <p className="mt-3 flex items-start gap-2 text-sm text-foreground"><Languages className="mt-0.5 size-4 shrink-0" />{doctor.languages}</p>}
            </details>
          </section>
          <details open className="group mt-8 max-w-[65ch] rounded-2xl border border-border bg-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-5 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground [&::-webkit-details-marker]:hidden">
              <h2 className="font-display text-2xl">{c("About this expert", "专家介绍", "Об эксперте", "Sobre este experto")}</h2>
              <ChevronDown className="size-5 shrink-0 text-foreground transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-5">
              {doctor.bio && <p className="whitespace-pre-line text-body md:text-body-lg text-foreground">{doctor.bio}</p>}
              {doctor.credentials && (
                <div className="mt-6 rounded-xl bg-muted/40 p-4">
                  <h3 className="font-semibold">{c("Credentials and certifications", "资质与认证", "Квалификация и сертификаты", "Titulaciones y certificaciones")}</h3>
                  <p className="mt-2 whitespace-pre-line text-body md:text-body-lg text-foreground">{doctor.credentials}</p>
                </div>
              )}
            </div>
          </details>
          <section id="expert-cases" className="mt-10 scroll-mt-24 xl:scroll-mt-40">
            <h2 className="font-display text-3xl">
              {c(
                `Patient diaries (${videos.length})`,
                `患者日记（${videos.length}）`,
                `Дневники пациентов (${videos.length})`,
                `Diarios de pacientes (${videos.length})`,
              )}
            </h2>
            {videos.length === 0 ? (
              <p className="text-muted-foreground mt-4">
                {c(
                  "No linked videos yet.",
                  "暂时没有关联视频。",
                  "Пока нет связанных видео.",
                  "Aún no hay videos vinculados.",
                )}
              </p>
            ) : (
              <div className="flex gap-4 overflow-x-auto mt-6 pb-3">
                {videos.map((v) => {
                  const src = v.url ?? "";
                  return (
                    <article key={v.id} className="w-48 shrink-0">
                      <CoverVideo
                        src={src}
                        coverPath={v.cover_path}
                        coverUrl={v.coverUrl}
                        className="w-full aspect-[9/16] object-cover rounded-2xl bg-black"
                      />
                      <h3 className="font-semibold mt-2">{v.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {v.caption}
                      </p>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
          <section className="mt-12">
            <h2 className="font-display text-3xl">
              {c(
                `Before & after (${beforeAfter.length})`,
                `术前术后对比（${beforeAfter.length}）`,
                `До и после (${beforeAfter.length})`,
                `Antes y después (${beforeAfter.length})`,
              )}
            </h2>
            {beforeAfter.length === 0 ? (
              <p className="text-muted-foreground mt-4">
                {c(
                  "No comparison photos yet.",
                  "暂时没有对比图。",
                  "Пока нет фотосравнений.",
                  "Aún no hay fotos comparativas.",
                )}
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
                {beforeAfter.map((b) => (
                  <BeforeAfterCard
                    key={b.id}
                    single={b.before_path === b.after_path}
                    before={b.beforeUrl ?? ""}
                    after={b.afterUrl ?? ""}
                    doctor={doctor.name}
                    city={[
                      b.city,
                      b.months_after ? monthsLabel(b.months_after) : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                    procedure={b.procedure || b.title}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};
export default ManagedDoctorDetail;

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
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
    (async () => {
      const { data } = await supabase
        .from("doctors")
        .select(
          "id,name,title,city,specialties,bio,credentials,languages,photo_path,i18n",
        )
        .eq("id", id)
        .eq("status", "published")
        .maybeSingle();
      setDoctor(
        data
          ? (localizeDoctorRow(
              data as Record<string, unknown>,
              lang,
            ) as unknown as Doctor)
          : null,
      );
      if (data) {
        setPhoto(await signedUrl("doctor-photos", (data as Doctor).photo_path));
        const r = await supabase
          .from("videos")
          .select("id,title,caption,storage_path,cover_path,i18n")
          .eq("doctor_id", id)
          .eq("status", "published")
          .order("created_at", { ascending: false });
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
      }
      setLoading(false);
    })();
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
          <Link to="/doctors" className="text-primary">
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
        <AsiaNavbar homeLinks={false} />
        <main className="container py-10 max-w-6xl">
          <Link
            to="/doctors"
            className="inline-flex gap-1 text-sm text-muted-foreground"
          >
            <ArrowLeft className="size-4" />
            {c("All experts", "全部专家", "Все эксперты", "Todos los expertos")}
          </Link>
          <section className="mt-6 rounded-3xl bg-card shadow-pop p-6 md:p-8 grid md:grid-cols-[260px_1fr] gap-8">
            {photo ? (
              <img
                src={photo}
                alt={doctor.name}
                className="w-full aspect-square rounded-3xl object-cover"
              />
            ) : (
              <div className="aspect-square rounded-3xl bg-muted grid place-items-center">
                <Stethoscope className="size-12 text-muted-foreground" />
              </div>
            )}
            <div>
              <span className="pill bg-accent text-accent-foreground">
                <BadgeCheck className="size-3.5" />
                {c(
                  "Platform expert profile",
                  "平台专家资料",
                  "Профиль эксперта платформы",
                  "Perfil de experto de la plataforma",
                )}
              </span>
              <h1 className="font-display text-4xl mt-4">{doctor.name}</h1>
              <p className="text-muted-foreground mt-1">{doctor.title}</p>
              <p className="flex gap-2 mt-4">
                <MapPin className="size-4 text-primary" />
                {doctor.city}
              </p>
              <p className="flex gap-2 mt-2 text-sm text-muted-foreground">
                <Clock className="size-4 text-primary" />
                {c(
                  `Local time in ${doctor.city}: ${tz.offset} (${tz.label.en}) · now about ${formatCityTime(tz, "en")} — consultation slots follow this timezone`,
                  `${doctor.city}当地时间 ${tz.offset}（${tz.label.zh}）· 现在约 ${formatCityTime(tz, "zh")} — 预约咨询时间以此时区为准`,
                  `Местное время в ${doctor.city}: ${tz.offset} (${tz.label.ru}) · сейчас около ${formatCityTime(tz, "ru")} — время консультаций указано в этом часовом поясе`,
                  `Hora local en ${doctor.city}: ${tz.offset} (${tz.label.es}) · ahora aprox. ${formatCityTime(tz, "es")} — las citas siguen esta zona horaria`,
                )}
              </p>
              {doctor.languages && (
                <p className="flex gap-2 mt-2">
                  <Languages className="size-4 text-primary" />
                  {doctor.languages}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-5">
                {doctor.specialties.map((s) => (
                  <span key={s} className="pill bg-accent">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </section>
          <section className="mt-10">
            <h2 className="font-display text-3xl">
              {c(
                "About this expert",
                "专家介绍",
                "Об эксперте",
                "Sobre este experto",
              )}
            </h2>
            <p className="text-muted-foreground leading-relaxed mt-4 whitespace-pre-line">
              {doctor.bio}
            </p>
            {doctor.credentials && (
              <div className="rounded-2xl bg-muted/40 p-5 mt-6">
                <h3 className="font-semibold">
                  {c(
                    "Credentials and certifications",
                    "资质与认证",
                    "Квалификация и сертификаты",
                    "Titulaciones y certificaciones",
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">
                  {doctor.credentials}
                </p>
              </div>
            )}
          </section>
          <section className="mt-12">
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

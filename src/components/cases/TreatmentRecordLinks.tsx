import { useState } from "react";
import { Link } from "react-router-dom";
import LazyVideo from "@/components/media/LazyVideo";
import { CITIES } from "@/data/cities";
import { PROCEDURE_CATALOG } from "@/data/procedureCatalog";
import { caseFacts, caseMediaUrl, caseCoverUrl, casePath, expertName, expertPath } from "@/lib/case-seo";
import { useAsia } from "@/lib/asia-i18n";
import { localizedField } from "@/lib/i18n-content";
import { useTreatmentRecords } from "@/hooks/use-treatment-records";
import { getDirectoryDoctorPortraitRetouch } from "@/data/directory-doctor-portrait-retouches";
import {
  matchesProcedure,
  procedureCases,
  procedureExperts,
  treatmentCityPath,
  type TreatmentRecords,
} from "@/lib/treatment-city-seo";

export function ProcedureRecords({
  data,
  slug,
  citySlug,
  limit = 6,
}: {
  data: TreatmentRecords;
  slug: string;
  citySlug?: string;
  limit?: number;
}) {
  const { lang } = useAsia();
  const zh = lang === "zh";
  const doctors = procedureExperts(data, slug, citySlug).slice(0, citySlug ? undefined : 6);
  const [shown, setShown] = useState(limit);
  const allVideos = procedureCases(data, slug, citySlug);
  const videos = allVideos.slice(0, shown);
  return (
    <>
      {doctors.length > 0 && (
        <section className="mt-10 border-t border-border pt-8">
          <h2 className="font-display text-2xl">{zh ? "相关合作专家" : "Related partner experts"}</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doc) => {
              // Counted from published case records only, so the number is never an estimate.
              const published = data.videos.filter(
                (v) =>
                  v.status === "published" && v.doctor_id === doc.id && matchesProcedure(caseFacts(v).procedure, slug),
              ).length;
              return (
                <li key={doc.id}>
                  <Link
                    to={expertPath(doc.id)}
                    className="flex h-full items-start gap-4 rounded-lg border border-border bg-card p-5 hover:border-primary"
                  >
                    {(getDirectoryDoctorPortraitRetouch(doc)?.photo || doc.photo) && (
                      <img
                        src={getDirectoryDoctorPortraitRetouch(doc)?.photo || doc.photo}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="size-16 shrink-0 rounded-full object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <h3 className="font-display text-xl">{expertName(doc, lang)}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {localizedField(doc.i18n, "hospital", lang, doc.hospital)}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {localizedField(doc.i18n, "city", lang, doc.city)}
                      </p>
                      {published > 0 && (
                        <p className="mt-2 text-sm font-semibold text-brand">
                          {zh
                            ? `${published} 个已发布案例视频`
                            : `${published} published case video${published === 1 ? "" : "s"}`}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
      {videos.length > 0 && (
        <section className="mt-10 border-t border-border pt-8">
          <h2 className="font-display text-2xl">{zh ? "真实案例视频" : "Real case videos"}</h2>
          <ul className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {videos.map((v) => {
              const doc = data.doctors.find((d) => d.id === v.doctor_id);
              const facts = caseFacts(v, lang);
              return (
                <li key={v.id} className="overflow-hidden rounded-lg border border-border bg-card">
                  <LazyVideo
                    controls
                    src={caseMediaUrl(v.id, "video")}
                    poster={caseCoverUrl(v)}
                    alt={`${facts.procedure} · ${facts.city}`}
                    className="aspect-[9/16] max-h-[28rem] w-full bg-muted"
                  />
                  <Link to={casePath(v, doc)} className="block p-4 text-sm font-medium underline underline-offset-4">
                    {facts.procedure} · {facts.city}
                    {doc ? ` · ${expertName(doc, lang)}` : ""}
                  </Link>
                </li>
              );
            })}
          </ul>
          {citySlug && allVideos.length > shown && (
            <button
              type="button"
              onClick={() => setShown((n) => n + 12)}
              className="mt-6 rounded-full border border-border px-5 py-2 text-sm font-medium hover:border-primary"
            >
              {zh ? "加载更多" : "Load more"}
            </button>
          )}
        </section>
      )}
    </>
  );
}
export default function TreatmentRecordLinks({
  procedureSlug,
  citySlug,
}: {
  procedureSlug?: string;
  citySlug?: string;
}) {
  const { data } = useTreatmentRecords();
  const { lang } = useAsia();
  const pages = (data?.treatmentCities ?? []).filter(
    (p) => (!procedureSlug || p.procedureSlug === procedureSlug) && (!citySlug || p.citySlug === citySlug),
  );
  if (!data) return null;
  return (
    <>
      {pages.length > 0 && (
        <section className="mt-10 border-t border-border pt-8">
          <h2 className="font-display text-2xl">
            {procedureSlug
              ? lang === "zh"
                ? "可选城市"
                : "Available in"
              : lang === "zh"
                ? "本城市项目与真实案例"
                : "Procedures and real cases in this city"}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
            {pages.map((p) => (
              <li key={treatmentCityPath(p)}>
                <Link className="text-brand underline underline-offset-4" to={treatmentCityPath(p)}>
                  {procedureSlug
                    ? CITIES.find((c) => c.slug === p.citySlug)?.[lang === "zh" ? "zh" : "en"]
                    : PROCEDURE_CATALOG.find((t) => t.slug === p.procedureSlug)?.[lang === "zh" ? "zh" : "en"]}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {procedureSlug && <ProcedureRecords data={data} slug={procedureSlug} />}
    </>
  );
}

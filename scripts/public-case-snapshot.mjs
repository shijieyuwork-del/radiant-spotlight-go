/** Public RLS-filtered reads only. A failed fetch aborts publication, never emits a partial sitemap. */
export async function loadPublicCaseSnapshot(d) {
  const { loadEnv } = await import("vite");
  const env = { ...loadEnv("production", process.cwd(), "VITE_"), ...process.env };
  const base = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) throw new Error("Public Cloud configuration is required for case prerendering.");
  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  async function rows(table, select) {
    const result = [];
    let last = "";
    while (true) {
      const params = new URLSearchParams({ select, status: "eq.published", order: "id.asc", limit: "500", ...(last ? { id: `gt.${last}` } : {}) });
      const response = await fetch(`${base}/rest/v1/${table}?${params}`, { headers, signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`Published ${table} snapshot failed (${response.status}).`);
      const batch = await response.json();
      if (!Array.isArray(batch)) throw new Error(`Invalid ${table} snapshot.`);
      result.push(...batch);
      if (batch.length < 500) break;
      last = batch[batch.length - 1].id;
    }
    return result;
  }
  const [videos, doctors, clinicRows] = await Promise.all([
    rows("videos", "id,title,caption,procedure,city,doctor_id,storage_path,cover_path,created_at,status,i18n,placement"),
    rows("doctors", "id,name,title,hospital,city,specialties,bio,credentials,languages,photo_path,created_at,status,i18n"),
    rows("clinics", "id,static_slug,city_slug,name_en,name_zh,area_en,area_zh,description_en,description_zh,is_public,hidden,status,website_url,updated_at,created_at"),
  ]);
  // Reuse the existing published-only, audited photo service. Never make a private bucket public.
  const paths = [...new Set(doctors.map((row) => row.photo_path).filter(Boolean))];
  const photos = {};
  for (let offset = 0; offset < paths.length; offset += 50) {
    const response = await fetch(`${base}/functions/v1/request-file-access`, { method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ bucket: "doctor-photos", paths: paths.slice(offset, offset + 50) }), signal: AbortSignal.timeout(30000) });
    if (response.ok) Object.assign(photos, (await response.json()).urls ?? {});
  }
  doctors.forEach((row) => { row.photo = photos[row.photo_path] || ""; });
  const records = clinicRows.map((row) => ({ id: row.id, staticSlug: row.static_slug, citySlug: row.city_slug, nameEn: row.name_en, nameZh: row.name_zh, areaEn: row.area_en || "", areaZh: row.area_zh || "", descriptionEn: row.description_en || "", descriptionZh: row.description_zh || "", isPublic: row.is_public, hidden: row.hidden, websiteUrl: row.website_url || "", photoUrl: "" }));
  const clinics = d.applyClinicRecords(d.mergeClinicDirectory(doctors), records);
  const byId = new Map(doctors.map((row) => [row.id, row]));
  videos.forEach((row) => { const doc = byId.get(row.doctor_id); row.doctors = doc ? { name: doc.name, i18n: doc.i18n, status: doc.status } : null; });
  videos.sort((a, b) => b.created_at.localeCompare(a.created_at) || b.id.localeCompare(a.id));
  const prefixes = new Set();
  for (const row of videos) {
    const prefix = row.id.slice(0, 8).toLowerCase();
    if (prefixes.has(prefix)) throw new Error("Published case IDs have an ambiguous eight-character prefix; review before publishing.");
    prefixes.add(prefix);
  }
  const treatmentCities = d.buildTreatmentCities({ videos, doctors });
  return { videos, doctors, clinics, clinicRows, treatmentCities };
}

/** Serialize only records relevant to the current page, not the entire video library in every page. */
export function scopePublicCaseData(path, data, d) {
  let videos = data.videos.slice(0, 24);
  let clinics = [];
  let doctors = [];
  if (path.startsWith("/treatments/") || path.startsWith("/cities/")) {
    const [, section, procedureOrCity, citySlug] = path.split("/");
    if (section === "treatments") {
      videos = data.videos.filter((v) => d.matchesProcedure(d.caseFacts(v).procedure, procedureOrCity));
      const related = d.procedureExperts(data, procedureOrCity, citySlug);
      doctors = [...new Map([...related, ...data.doctors.filter((doc) => videos.some((v) => v.doctor_id === doc.id))].map((doc) => [doc.id, doc])).values()];
    } else {
      videos = [];
      doctors = [];
    }
  } else if (path.startsWith("/cases/")) {
    const row = d.resolveCase(path.split("/").pop(), data.videos);
    videos = row ? [row, ...data.videos.filter((v) => v.id !== row.id && row.doctor_id && v.doctor_id === row.doctor_id).slice(0, 6), ...data.videos.filter((v) => v.id !== row.id && v.procedure === row.procedure && v.city === row.city).slice(0, 6)] : [];
    clinics = data.clinics.filter((c) => row?.doctor_id && c.doctorIds.includes(row.doctor_id));
  } else if (path.startsWith("/doctors/profile/")) {
    const id = path.split("/").pop();
    doctors = data.doctors.filter((doc) => doc.id === id);
    videos = data.videos.filter((v) => v.doctor_id === id);
    clinics = data.clinics.filter((c) => c.doctorIds.includes(id));
  } else if (path.startsWith("/clinics/")) {
    const clinic = data.clinics.find((c) => `/clinics/${c.slug}` === path);
    clinics = data.clinics.filter((c) => c.citySlug === clinic?.citySlug);
    videos = data.videos.filter((v) => clinic?.doctorIds.includes(v.doctor_id));
    doctors = data.doctors.filter((doc) => clinic?.doctorIds.includes(doc.id));
  } else if (path === "/clinics") { clinics = data.clinics; doctors = data.doctors; videos = []; }
  else if (path === "/doctors") { doctors = data.doctors; videos = []; }
  const ids = new Set(videos.map((v) => v.doctor_id));
  doctors = [...new Map([...doctors, ...data.doctors.filter((doc) => ids.has(doc.id))].map((doc) => [doc.id, doc])).values()];
  const treatmentCities = (path.startsWith("/treatments/") || path.startsWith("/cities/")) ? data.treatmentCities : undefined;
  return { videos: [...new Map(videos.map((v) => [v.id, v])).values()], doctors, clinics, treatmentCities, scopePath: path };
}

const xml = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export function generateVideoSitemap(videos, doctors, d) {
  const byId = new Map(doctors.map((doc) => [doc.id, doc]));
  const entries = videos.filter((v) => v.status === "published" && v.cover_path).map((v) => {
    const meta = d.casePageMeta(v, byId.get(v.doctor_id));
    const lastmod = d.newestRowTimestamp([v, ...(byId.has(v.doctor_id) ? [byId.get(v.doctor_id)] : [])]);
    return `  <url><loc>${xml(d.SITE_URL + meta.path)}</loc>${lastmod ? `<lastmod>${xml(lastmod)}</lastmod>` : ""}<video:video><video:thumbnail_loc>${xml(d.caseMediaUrl(v.id, "thumb"))}</video:thumbnail_loc><video:title>${xml(meta.title)}</video:title><video:description>${xml(meta.description)}</video:description><video:content_loc>${xml(d.caseMediaUrl(v.id, "video"))}</video:content_loc><video:publication_date>${xml(v.created_at)}</video:publication_date></video:video></url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n${entries.join("\n")}\n</urlset>\n`;
}

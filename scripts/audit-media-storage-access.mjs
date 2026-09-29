// Read-only public API regression check. Never uploads, updates or deletes media.
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env")) process.loadEnvFile(".env");
const client = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const samples = {};
for (const [bucket, table, column] of [
  ["doctor-photos", "doctors", "photo_path"],
  ["short-videos", "videos", "storage_path"],
  ["video-covers", "videos", "cover_path"],
  ["before-after", "before_after_cases", "before_path"],
]) {
  const { data, error } = await client.from(table).select(column).eq("status", "published").not(column, "is", null).limit(1);
  assert.equal(error, null, `${table}: published records remain readable`);
  assert.ok(data?.[0]?.[column], `${bucket}: needs a published test sample`);
  samples[bucket] = data[0][column];
}
const { data: clinics, error: clinicError } = await client.from("clinics")
  .select("photo_path,photo_gallery").eq("status", "published").eq("hidden", false);
assert.equal(clinicError, null);
samples["clinic-photos"] = clinics.flatMap((clinic) => Array.isArray(clinic.photo_gallery)
  ? clinic.photo_gallery.filter((photo) => photo.kind === "upload").map((photo) => photo.path)
  : clinic.photo_path ? [clinic.photo_path] : [])[0];
assert.ok(samples["clinic-photos"], "clinic-photos: needs a published test sample");

for (const [bucket, path] of Object.entries(samples)) {
  const listing = await client.storage.from(bucket).list();
  assert.equal(listing.error, null, `${bucket}: listing should be an empty result`);
  assert.equal(listing.data.length, 0, `${bucket}: anonymous callers must not enumerate objects`);
  const direct = await client.storage.from(bucket).createSignedUrl(path, 60);
  assert.ok(direct.error && !direct.data?.signedUrl, `${bucket}: direct client signing must be denied`);
  const unknown = `security-audit/unpublished-${crypto.randomUUID()}.jpg`;
  const access = await client.functions.invoke("request-file-access", { body: { bucket, paths: [path, unknown] } });
  assert.equal(access.error, null, `${bucket}: audited access endpoint remains available`);
  assert.ok(access.data?.urls?.[path], `${bucket}: published file is still signed`);
  assert.ok(!access.data?.urls?.[unknown], `${bucket}: unapproved path must not be signed`);
  const media = await fetch(access.data.urls[path], { method: "HEAD" });
  assert.ok(media.ok, `${bucket}: published signed media remains readable (${media.status})`);
  // Never log object names, signed URLs, credentials or medical records.
  console.log(JSON.stringify({ bucket, anonymousListEmpty: true, directSigningDenied: true,
    publishedMediaAvailable: true, unapprovedPathDenied: true }));
}

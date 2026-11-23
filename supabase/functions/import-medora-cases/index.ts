import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3'
import { caseCreatedAt, caseLabels, caseStoragePath, decodeCover, isAdminEmail, linkedDoctorName, MAX_VIDEO_BYTES } from './rules.ts'

const BodySchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('status') }),
  z.object({ action: z.literal('import'), offset: z.number().int().min(0), limit: z.number().int().min(1).max(3) }),
  z.object({ action: z.literal('set-cover'), videoId: z.string().uuid(), imageBase64: z.string().min(1).max(410000) }),
])
const ManifestSchema = z.object({ count: z.number().int().nonnegative(), cases: z.array(z.unknown()) })
const CaseSchema = z.object({ id: z.string(), doctorName: z.string(), project: z.string(), videoUrl: z.string(), size: z.number().nonnegative() })
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
const message = (error: unknown) => error instanceof Error ? error.message : String(error)

async function downloadVideo(url: string, declaredSize: number) {
  if (declaredSize > MAX_VIDEO_BYTES) throw new Error('Video exceeds 60 MB')
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(90000) })
  if (!response.ok || !response.body) throw new Error(`Video download failed (${response.status})`)
  if (Number(response.headers.get('content-length')) > MAX_VIDEO_BYTES) {
    await response.body.cancel()
    throw new Error('Video exceeds 60 MB')
  }
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.length
      if (size > MAX_VIDEO_BYTES) throw new Error('Video exceeds 60 MB')
      chunks.push(value)
    }
  } finally {
    await reader.cancel()
  }
  return new Blob(chunks)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405)
  try {
    const service = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const token = req.headers.get('Authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]
    if (!token) return json({ error: 'Forbidden' }, 403)
    const { data: caller, error: authError } = await service.auth.getUser(token)
    if (authError || !isAdminEmail(caller.user?.email)) return json({ error: 'Forbidden' }, 403)
    const parsed = BodySchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400)
    const body = parsed.data

    if (body.action === 'set-cover') {
      let image: Uint8Array
      try { image = decodeCover(body.imageBase64) } catch (error) { return json({ error: message(error) }, 400) }
      const { data: row, error } = await service.from('videos').select('storage_path').eq('id', body.videoId).single()
      if (error || !row?.storage_path?.startsWith('medora/')) return json({ error: 'Not a Medora video' }, 403)
      const caseId = row.storage_path.match(/^medora\/([a-f0-9]{32})\.(mp4|mov)$/i)?.[1]
      if (!caseId) return json({ error: 'Invalid Medora path' }, 400)
      const coverPath = `medora/${caseId}.webp`
      const { error: uploadError } = await service.storage.from('video-covers').upload(coverPath, image, { contentType: 'image/webp', upsert: true })
      if (uploadError) throw uploadError
      const { error: updateError } = await service.from('videos').update({ cover_path: coverPath }).eq('id', body.videoId)
      if (updateError) throw updateError
      return json({ ok: true, coverPath })
    }

    const response = await fetch('https://medorabeauty.com/video-cases.json', { redirect: 'error', signal: AbortSignal.timeout(30000) })
    if (!response.ok) throw new Error(`Manifest unavailable (${response.status})`)
    const manifest = ManifestSchema.parse(await response.json())
    const total = manifest.cases.length
    if (body.action === 'status') {
      const { count, error } = await service.from('videos').select('id', { count: 'exact', head: true }).like('storage_path', 'medora/%')
      if (error) throw error
      return json({ total, imported: count ?? 0 })
    }

    const results = []
    const nextOffset = Math.min(total, body.offset + body.limit)
    for (let index = body.offset; index < nextOffset; index++) {
      const candidate = CaseSchema.safeParse(manifest.cases[index])
      const raw = manifest.cases[index] as { id?: unknown } | null
      const caseId = typeof raw?.id === 'string' ? raw.id : ''
      const storagePath = candidate.success ? caseStoragePath(candidate.data.id, candidate.data.videoUrl) : null
      if (!candidate.success || !storagePath) {
        results.push({ caseId, ok: false, skipped: true, error: 'Invalid manifest case or video source' })
        continue
      }
      try {
        const item = candidate.data
        const { data: existing, error: lookupError } = await service.from('videos').select('id,cover_path').eq('storage_path', storagePath).limit(1).maybeSingle()
        if (lookupError) throw lookupError
        if (existing) {
          results.push({ caseId, ok: true, skipped: true, videoId: existing.id, storagePath, coverMissing: !existing.cover_path })
          continue
        }
        const video = await downloadVideo(item.videoUrl, item.size)
        const { error: uploadError } = await service.storage.from('short-videos').upload(storagePath, video, { upsert: false, contentType: storagePath.endsWith('.mov') ? 'video/quicktime' : 'video/mp4' })
        if (uploadError && !/already exists|duplicate/i.test(uploadError.message)) throw uploadError
        // Recheck after upload: another admin tab may have completed the same case.
        const { data: concurrent, error: concurrentError } = await service.from('videos').select('id,cover_path').eq('storage_path', storagePath).limit(1).maybeSingle()
        if (concurrentError) throw concurrentError
        if (concurrent) {
          results.push({ caseId, ok: true, skipped: true, videoId: concurrent.id, storagePath, coverMissing: !concurrent.cover_path })
          continue
        }
        const { data: doctors, error: doctorError } = await service.from('doctors').select('id,city').eq('status', 'published').eq('name', linkedDoctorName(item.doctorName)).limit(2)
        if (doctorError) throw doctorError
        const doctor = doctors?.length === 1 ? doctors[0] : null
        const labels = caseLabels(item.project)
        const { data: inserted, error: insertError } = await service.from('videos').insert({
          ...labels.en, status: 'published', placement: 'before-after', storage_path: storagePath,
          cover_path: null, i18n: labels, doctor_id: doctor?.id ?? null, city: doctor?.city ?? null,
          created_at: caseCreatedAt(index),
        }).select('id').single()
        if (insertError?.code === '23505') {
          const { data: duplicate, error: duplicateError } = await service.from('videos').select('id,cover_path').eq('storage_path', storagePath).single()
          if (duplicateError) throw duplicateError
          results.push({ caseId, ok: true, skipped: true, videoId: duplicate.id, storagePath, coverMissing: !duplicate.cover_path })
          continue
        }
        if (insertError) throw insertError
        results.push({ caseId, ok: true, videoId: inserted.id, storagePath })
      } catch (error) {
        results.push({ caseId, ok: false, storagePath, error: message(error) })
      }
    }
    return json({ items: results, nextOffset, total })
  } catch (error) {
    return json({ error: message(error) }, 500)
  }
})
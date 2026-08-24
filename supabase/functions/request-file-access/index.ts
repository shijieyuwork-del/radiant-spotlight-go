import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3'

const ADMIN_EMAIL = 'shijieyuwork@gmail.com'
const SEVEN_DAYS = 60 * 60 * 24 * 7

const BUCKET_TARGETS: Record<string, { table: string; column: string }> = {
  'doctor-photos': { table: 'doctors', column: 'photo_path' },
  'short-videos': { table: 'videos', column: 'storage_path' },
  'video-covers': { table: 'videos', column: 'cover_path' },
}

const BodySchema = z.object({
  bucket: z.enum(['doctor-photos', 'short-videos', 'video-covers']),
  paths: z
    .array(
      z
        .string()
        .min(1)
        .max(500)
        .refine((p) => !p.includes('..') && !p.startsWith('/'), 'invalid path')
    )
    .min(1)
    .max(50),
})

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405)

  try {
    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400)
    const { bucket, paths } = parsed.data
    const uniquePaths = [...new Set(paths)]

    const service = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Identify the caller (optional — anonymous users may access published files)
    let actorId: string | null = null
    let actorEmail: string | null = null
    const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '')
    if (token) {
      const { data } = await service.auth.getUser(token)
      actorId = data.user?.id ?? null
      actorEmail = data.user?.email ?? null
    }
    const isAdmin = actorEmail?.toLowerCase() === ADMIN_EMAIL

    // Decide which paths this caller may access
    let allowed: string[]
    if (isAdmin) {
      allowed = uniquePaths
    } else {
      const { table, column } = BUCKET_TARGETS[bucket]
      const { data: rows } = await service
        .from(table)
        .select(column)
        .eq('status', 'published')
        .in(column, uniquePaths)
      const published = new Set((rows ?? []).map((r) => (r as Record<string, string>)[column]))
      allowed = uniquePaths.filter((p) => published.has(p))
    }

    // Audit every attempt, including denied ones
    const allowedSet = new Set(allowed)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
    const userAgent = req.headers.get('user-agent') ?? null
    await service.from('audit_logs').insert(
      uniquePaths.map((p) => ({
        action: 'storage_read',
        actor_id: actorId,
        actor_email: actorEmail,
        bucket,
        target: p,
        ip,
        user_agent: userAgent,
        metadata: { denied: !allowedSet.has(p) },
      }))
    )

    // Sign only the allowed paths
    const urls: Record<string, string> = {}
    if (allowed.length > 0) {
      const { data: signed } = await service.storage.from(bucket).createSignedUrls(allowed, SEVEN_DAYS)
      for (const s of signed ?? []) {
        if (s.path && s.signedUrl) urls[s.path] = s.signedUrl
      }
    }

    return json({ urls })
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'internal error' }, 500)
  }
})

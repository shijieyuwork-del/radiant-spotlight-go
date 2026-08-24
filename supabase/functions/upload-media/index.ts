import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

const ADMIN_EMAIL = 'shijieyuwork@gmail.com'

const BUCKETS = {
  'doctor-photos': {
    types: ['image/jpeg', 'image/png', 'image/webp'],
    exts: ['jpg', 'jpeg', 'png', 'webp'],
    maxBytes: 10 * 1024 * 1024, // 10MB
  },
  'short-videos': {
    types: ['video/mp4', 'video/quicktime', 'video/webm'],
    exts: ['mp4', 'mov', 'webm'],
    maxBytes: 200 * 1024 * 1024, // 200MB
  },
} as const

type BucketName = keyof typeof BUCKETS

// Which table/column a bucket's media belongs to (used by replace mode)
const TABLE_FOR_BUCKET: Record<BucketName, { table: 'doctors' | 'videos'; column: 'photo_path' | 'storage_path' }> = {
  'doctor-photos': { table: 'doctors', column: 'photo_path' },
  'short-videos': { table: 'videos', column: 'storage_path' },
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// ── Abuse controls (env-overridable) ────────────────────────────────────────
// NOTE: ad-hoc DB-count based rate limiting — no standard rate-limit primitive
// exists on this backend; acceptable for a single-admin console, not bulletproof
// under extreme concurrency.
const RATE_LIMIT_PER_HOUR = Number(Deno.env.get('UPLOAD_RATE_LIMIT_PER_HOUR') ?? 30)
const RATE_LIMIT_PER_DAY = Number(Deno.env.get('UPLOAD_RATE_LIMIT_PER_DAY') ?? 100)
const STORAGE_QUOTA_BYTES = Number(Deno.env.get('STORAGE_QUOTA_BYTES') ?? 2 * 1024 * 1024 * 1024) // 2GB per bucket

const fmtMB = (bytes: number) => (bytes / 1024 / 1024).toFixed(1)

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

/** Sums the sizes of all objects in a bucket via the Storage API (paginated, up to 3 folder levels). */
const bucketUsageBytes = async (
  service: ReturnType<typeof createClient>,
  bucket: string,
  prefix = '',
  depth = 3,
): Promise<number> => {
  let total = 0
  let offset = 0
  for (;;) {
    const { data, error } = await service.storage.from(bucket).list(prefix, { limit: 1000, offset })
    if (error || !data || data.length === 0) break
    for (const entry of data) {
      const size = (entry.metadata as { size?: number } | null)?.size
      if (typeof size === 'number') {
        total += size
      } else if (depth > 0) {
        total += await bucketUsageBytes(service, bucket, prefix ? `${prefix}/${entry.name}` : entry.name, depth - 1)
      }
    }
    if (data.length < 1000) break
    offset += 1000
  }
  return total
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405)

  const service = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  const userAgent = req.headers.get('user-agent') ?? null

  // Audit helper — every upload/replace attempt (allowed or denied) is logged
  const audit = (entry: {
    action: 'storage_upload' | 'storage_replace'
    actor_id: string | null
    actor_email: string | null
    bucket: string | null
    target: string
    denied: boolean
    reason?: string
    extra?: Record<string, unknown>
  }) =>
    service.from('audit_logs').insert({
      action: entry.action,
      actor_id: entry.actor_id,
      actor_email: entry.actor_email,
      bucket: entry.bucket,
      target: entry.target,
      ip,
      user_agent: userAgent,
      metadata: { denied: entry.denied, ...(entry.reason ? { reason: entry.reason } : {}), ...(entry.extra ?? {}) },
    })

  try {
    // 1. Authentication — a valid user JWT is mandatory
    const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '')
    if (!token) {
      await audit({ action: 'storage_upload', actor_id: null, actor_email: null, bucket: null, target: '(no token)', denied: true, reason: 'missing token' })
      return json({ error: 'authentication required' }, 401)
    }
    const { data: userData } = await service.auth.getUser(token)
    const user = userData.user
    if (!user) {
      await audit({ action: 'storage_upload', actor_id: null, actor_email: null, bucket: null, target: '(bad token)', denied: true, reason: 'invalid token' })
      return json({ error: 'invalid session' }, 401)
    }

    // 2. Authorization — only the admin may upload
    const email = user.email?.toLowerCase() ?? ''
    if (email !== ADMIN_EMAIL) {
      await audit({ action: 'storage_upload', actor_id: user.id, actor_email: user.email ?? null, bucket: null, target: '(non-admin)', denied: true, reason: 'not admin' })
      return json({ error: 'forbidden: admin only' }, 403)
    }

    // 2.5 Per-admin rate limit — count successful uploads/replaces in the
    // rolling hour and day. Runs before form parsing to save bandwidth.
    const uploadCountSince = async (since: string) => {
      const { count } = await service
        .from('audit_logs')
        .select('id', { count: 'exact', head: true })
        .eq('actor_id', user.id)
        .in('action', ['storage_upload', 'storage_replace'])
        .filter('metadata->>denied', 'eq', 'false')
        .gte('created_at', since)
      return count ?? 0
    }
    const hourlyCount = await uploadCountSince(new Date(Date.now() - 3600_000).toISOString())
    if (hourlyCount >= RATE_LIMIT_PER_HOUR) {
      await audit({
        action: 'storage_upload', actor_id: user.id, actor_email: user.email ?? null,
        bucket: null, target: '(rate limited)', denied: true, reason: 'rate limited (hourly)',
        extra: { hourly_count: hourlyCount, hourly_limit: RATE_LIMIT_PER_HOUR },
      })
      return json({ error: `rate limit exceeded: max ${RATE_LIMIT_PER_HOUR} uploads per hour (used ${hourlyCount})` }, 429)
    }
    const dailyCount = await uploadCountSince(new Date(Date.now() - 86400_000).toISOString())
    if (dailyCount >= RATE_LIMIT_PER_DAY) {
      await audit({
        action: 'storage_upload', actor_id: user.id, actor_email: user.email ?? null,
        bucket: null, target: '(rate limited)', denied: true, reason: 'rate limited (daily)',
        extra: { daily_count: dailyCount, daily_limit: RATE_LIMIT_PER_DAY },
      })
      return json({ error: `rate limit exceeded: max ${RATE_LIMIT_PER_DAY} uploads per day (used ${dailyCount})` }, 429)
    }

    // 3. Input validation — bucket + file from multipart form
    const form = await req.formData()
    const bucket = form.get('bucket')
    const file = form.get('file')
    const mode = form.get('mode')
    const recordId = form.get('recordId')
    if (typeof bucket !== 'string' || !(bucket in BUCKETS)) {
      return json({ error: 'bucket must be doctor-photos or short-videos' }, 400)
    }
    if (!(file instanceof File) || file.size === 0) {
      return json({ error: 'file is required' }, 400)
    }
    const isReplace = mode === 'replace'
    if (mode !== null && !isReplace) {
      return json({ error: 'mode must be "replace" when provided' }, 400)
    }
    if (isReplace && (typeof recordId !== 'string' || !UUID_RE.test(recordId))) {
      return json({ error: 'recordId (uuid) is required for replace mode' }, 400)
    }

    const rules = BUCKETS[bucket as BucketName]
    const ext = (file.name.split('.').pop() ?? '').toLowerCase()
    const auditBase = { actor_id: user.id, actor_email: user.email ?? null, bucket }
    const action = isReplace ? 'storage_replace' as const : 'storage_upload' as const
    if (!(rules.exts as readonly string[]).includes(ext) || !(rules.types as readonly string[]).includes(file.type)) {
      await audit({ action, ...auditBase, target: file.name, denied: true, reason: `bad type ${file.type}/${ext}` })
      return json({ error: `invalid file type: allowed ${rules.exts.join(', ')}` }, 400)
    }
    if (file.size > rules.maxBytes) {
      await audit({ action, ...auditBase, target: file.name, denied: true, reason: `too large ${file.size}` })
      return json({ error: `file too large: max ${Math.round(rules.maxBytes / 1024 / 1024)}MB` }, 400)
    }

    // 3.5 Storage quota — total media size per bucket must stay under the cap
    const usedBytes = await bucketUsageBytes(service, bucket as BucketName)
    if (usedBytes + file.size > STORAGE_QUOTA_BYTES) {
      await audit({
        action, ...auditBase, target: file.name, denied: true, reason: 'quota exceeded',
        extra: { quota_used_bytes: usedBytes, quota_limit_bytes: STORAGE_QUOTA_BYTES, incoming_bytes: file.size },
      })
      return json({
        error: `storage quota exceeded: bucket limit ${fmtMB(STORAGE_QUOTA_BYTES)}MB, currently used ${fmtMB(usedBytes)}MB`,
      }, 429)
    }

    // 4a. Replace mode — verify the target record exists and capture its current path
    let oldPath: string | null = null
    let tableInfo: { table: 'doctors' | 'videos'; column: 'photo_path' | 'storage_path' } | null = null
    if (isReplace) {
      tableInfo = TABLE_FOR_BUCKET[bucket as BucketName]
      const { data: record, error: fetchError } = await service
        .from(tableInfo.table)
        .select(`id, ${tableInfo.column}`)
        .eq('id', recordId as string)
        .maybeSingle()
      if (fetchError || !record) {
        await audit({ action, ...auditBase, target: recordId as string, denied: true, reason: 'record not found' })
        return json({ error: 'record not found' }, 404)
      }
      oldPath = (record as Record<string, unknown>)[tableInfo.column] as string | null
    }

    // 4b. Upload via service role under a server-generated safe path
    const path = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await service.storage.from(bucket).upload(path, file, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    })
    if (uploadError) {
      await audit({ action, ...auditBase, target: path, denied: true, reason: uploadError.message })
      return json({ error: uploadError.message }, 500)
    }

    // 5. Replace mode — point the record at the new object, then remove the old one
    if (isReplace && tableInfo) {
      const { error: updateError } = await service
        .from(tableInfo.table)
        .update({ [tableInfo.column]: path })
        .eq('id', recordId as string)
      if (updateError) {
        // Roll back the freshly uploaded object so storage stays consistent
        await service.storage.from(bucket).remove([path])
        await audit({ action, ...auditBase, target: path, denied: true, reason: updateError.message, extra: { record_id: recordId } })
        return json({ error: updateError.message }, 500)
      }
      if (oldPath && oldPath !== path) {
        await service.storage.from(bucket).remove([oldPath])
      }
      await audit({
        action,
        ...auditBase,
        target: path,
        denied: false,
        extra: { record_id: recordId, table: tableInfo.table, replaced_path: oldPath },
      })
      return json({ path, replaced: oldPath })
    }

    await audit({ action, ...auditBase, target: path, denied: false })
    return json({ path })
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'internal error' }, 500)
  }
})

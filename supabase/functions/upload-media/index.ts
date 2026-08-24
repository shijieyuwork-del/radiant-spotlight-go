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

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405)

  const service = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  const userAgent = req.headers.get('user-agent') ?? null

  // Audit helper — every upload attempt (allowed or denied) is logged
  const audit = (entry: {
    actor_id: string | null
    actor_email: string | null
    bucket: string | null
    target: string
    denied: boolean
    reason?: string
  }) =>
    service.from('audit_logs').insert({
      action: 'storage_upload',
      actor_id: entry.actor_id,
      actor_email: entry.actor_email,
      bucket: entry.bucket,
      target: entry.target,
      ip,
      user_agent: userAgent,
      metadata: { denied: entry.denied, ...(entry.reason ? { reason: entry.reason } : {}) },
    })

  try {
    // 1. Authentication — a valid user JWT is mandatory
    const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '')
    if (!token) {
      await audit({ actor_id: null, actor_email: null, bucket: null, target: '(no token)', denied: true, reason: 'missing token' })
      return json({ error: 'authentication required' }, 401)
    }
    const { data: userData } = await service.auth.getUser(token)
    const user = userData.user
    if (!user) {
      await audit({ actor_id: null, actor_email: null, bucket: null, target: '(bad token)', denied: true, reason: 'invalid token' })
      return json({ error: 'invalid session' }, 401)
    }

    // 2. Authorization — only the admin may upload
    const email = user.email?.toLowerCase() ?? ''
    if (email !== ADMIN_EMAIL) {
      await audit({ actor_id: user.id, actor_email: user.email ?? null, bucket: null, target: '(non-admin)', denied: true, reason: 'not admin' })
      return json({ error: 'forbidden: admin only' }, 403)
    }

    // 3. Input validation — bucket + file from multipart form
    const form = await req.formData()
    const bucket = form.get('bucket')
    const file = form.get('file')
    if (typeof bucket !== 'string' || !(bucket in BUCKETS)) {
      return json({ error: 'bucket must be doctor-photos or short-videos' }, 400)
    }
    if (!(file instanceof File) || file.size === 0) {
      return json({ error: 'file is required' }, 400)
    }

    const rules = BUCKETS[bucket as BucketName]
    const ext = (file.name.split('.').pop() ?? '').toLowerCase()
    if (!(rules.exts as readonly string[]).includes(ext) || !(rules.types as readonly string[]).includes(file.type)) {
      await audit({ actor_id: user.id, actor_email: user.email ?? null, bucket, target: file.name, denied: true, reason: `bad type ${file.type}/${ext}` })
      return json({ error: `invalid file type: allowed ${rules.exts.join(', ')}` }, 400)
    }
    if (file.size > rules.maxBytes) {
      await audit({ actor_id: user.id, actor_email: user.email ?? null, bucket, target: file.name, denied: true, reason: `too large ${file.size}` })
      return json({ error: `file too large: max ${Math.round(rules.maxBytes / 1024 / 1024)}MB` }, 400)
    }

    // 4. Upload via service role under a server-generated safe path
    const path = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await service.storage.from(bucket).upload(path, file, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    })
    if (uploadError) {
      await audit({ actor_id: user.id, actor_email: user.email ?? null, bucket, target: path, denied: true, reason: uploadError.message })
      return json({ error: uploadError.message }, 500)
    }

    await audit({ actor_id: user.id, actor_email: user.email ?? null, bucket, target: path, denied: false })
    return json({ path })
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'internal error' }, 500)
  }
})

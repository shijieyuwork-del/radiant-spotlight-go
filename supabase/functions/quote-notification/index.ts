import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const ADMIN_EMAIL = 'shijieyuwork@gmail.com'
const SITE_NAME = 'CeladonChina'
const SENDER_DOMAIN = 'notify.cosmetics-asia.com'
const FROM_ADDRESS = `${SITE_NAME} <noreply@cosmetics-asia.com>`
const ADMIN_LINK = 'https://celadonchina.com/admin/content'
const MAX_AGE_MS = 15 * 60 * 1000

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const esc = (v: unknown) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let requestId: unknown
  try {
    const body = await req.json()
    requestId = body?.requestId
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  if (typeof requestId !== 'string' || !UUID_RE.test(requestId)) {
    return json({ error: 'requestId must be a UUID' }, 400)
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // Authoritative data comes from the database only — never from the caller.
  const { data: row, error: rowError } = await supabase
    .from('quote_requests')
    .select('*')
    .eq('id', requestId)
    .maybeSingle()

  if (rowError) {
    console.error('quote-notification: failed to load request', { requestId, message: rowError.message })
    return json({ error: 'Lookup failed' }, 500)
  }
  if (!row) return json({ error: 'Not found' }, 404)

  const ageMs = Date.now() - new Date(row.created_at as string).getTime()
  if (ageMs > MAX_AGE_MS) {
    console.warn('quote-notification: request too old, ignoring', { requestId, ageMs })
    return json({ error: 'Request expired' }, 410)
  }

  const messageId = `quote-${requestId}`

  // Deterministic message id → duplicate invocations never enqueue twice.
  const { data: existing } = await supabase
    .from('email_send_log')
    .select('id')
    .eq('message_id', messageId)
    .in('status', ['pending', 'sent'])
    .limit(1)
    .maybeSingle()

  if (existing) {
    return json({ success: true, duplicate: true })
  }

  const fields: Array<[string, unknown]> = [
    ['Name', row.name],
    ['Submitted', new Date(row.created_at as string).toISOString()],
    ['Email', row.email],
    ['Phone', `${row.phone_prefix ?? ''} ${row.phone ?? ''}`.trim()],
    ['Country', row.country],
    ['Procedure', row.procedure],
    ['Preferred contact', row.contact_method],
    ['Expert', row.expert_name],
    ['City', row.city],
    ['Preferred slot', row.preferred_slot],
    ['Notes', row.notes],
    ['Source', row.source],
    ['Request ID', row.id],
  ]

  const text = [
    'New consultation request',
    '',
    ...fields.map(([k, v]) => `${k}: ${v ?? '—'}`),
    '',
    `Admin: ${ADMIN_LINK}`,
  ].join('\n')

  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#1c2b2b">
<h2 style="margin:0 0 12px">New consultation request</h2>
<table cellpadding="6" style="border-collapse:collapse;font-size:14px">
${fields
  .map(
    ([k, v]) =>
      `<tr><td style="border:1px solid #e4e9e9;background:#f6f9f8"><strong>${esc(k)}</strong></td><td style="border:1px solid #e4e9e9">${esc(v ?? '—')}</td></tr>`,
  )
  .join('')}
</table>
<p style="margin-top:16px"><a href="${ADMIN_LINK}">Open the admin console</a></p>
</body></html>`

  const customerEmail = typeof row.email === 'string' && row.email.includes('@') ? row.email : null

  // The send API requires an unsubscribe token for transactional mail.
  let unsubscribeToken: string | null = null
  {
    const { data: tokenRow } = await supabase
      .from('email_unsubscribe_tokens')
      .select('token')
      .eq('email', ADMIN_EMAIL)
      .maybeSingle()
    if (tokenRow?.token) {
      unsubscribeToken = tokenRow.token as string
    } else {
      const fresh = crypto.randomUUID().replace(/-/g, '')
      const { data: inserted, error: tokenError } = await supabase
        .from('email_unsubscribe_tokens')
        .insert({ email: ADMIN_EMAIL, token: fresh })
        .select('token')
        .maybeSingle()
      if (tokenError) console.error('quote-notification: unsubscribe token failed', tokenError.message)
      unsubscribeToken = (inserted?.token as string | undefined) ?? fresh
    }
  }

  await supabase.from('email_send_log').insert({
    message_id: messageId,
    template_name: 'quote_request',
    recipient_email: ADMIN_EMAIL,
    status: 'pending',
  })

  const { error: enqueueError } = await supabase.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      message_id: messageId,
      idempotency_key: messageId,
      to: ADMIN_EMAIL,
      from: FROM_ADDRESS,
      sender_domain: SENDER_DOMAIN,
      reply_to: customerEmail,
      unsubscribe_token: unsubscribeToken,
      subject: `New consultation request — ${row.name ?? 'Unknown'}${row.procedure ? ` (${row.procedure})` : ''}`,
      html,
      text,
      purpose: 'transactional',
      label: 'quote_request',
      queued_at: new Date().toISOString(),
    },
  })

  if (enqueueError) {
    // The saved request stays intact; we only record the notification failure.
    console.error('quote-notification: enqueue failed', {
      requestId,
      code: enqueueError.code,
      message: enqueueError.message,
    })
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: 'quote_request',
      recipient_email: ADMIN_EMAIL,
      status: 'failed',
      error_message: 'Failed to enqueue quote notification',
    })
    return json({ success: false, error: 'Failed to enqueue notification' }, 500)
  }

  return json({ success: true })
})

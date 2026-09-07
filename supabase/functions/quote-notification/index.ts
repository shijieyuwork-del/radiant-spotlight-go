import { createClient } from 'npm:@supabase/supabase-js@2'
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const ADMIN_EMAIL = 'shijieyuwork@gmail.com'
const ADMIN_LINK = 'https://celadonchina.com/admin/content'
const MAX_AGE_MS = 15 * 60 * 1000

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

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

  // Deterministic message id → duplicate invocations never send twice.
  const { data: existing } = await supabase
    .from('email_send_log')
    .select('id')
    .eq('message_id', messageId)
    .in('status', ['sent', 'suppressed'])
    .limit(1)
    .maybeSingle()

  if (existing) {
    return json({ success: true, duplicate: true })
  }

  const fields: Array<[string, string]> = (
    [
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
    ] as Array<[string, unknown]>
  ).map(([label, value]) => [label, value == null || value === '' ? '—' : String(value)])

  const customerEmail = typeof row.email === 'string' && row.email.includes('@') ? row.email : undefined

  const logSend = async (status: 'sent' | 'suppressed' | 'failed', errorMessage?: string) => {
    const { error } = await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: 'quote_request',
      recipient_email: ADMIN_EMAIL,
      status,
      error_message: errorMessage ?? null,
    })
    if (error) console.error('quote-notification: send log write failed', { code: error.code, message: error.message })
  }

  try {
    const result = await sendTemplateEmail('quote-request', ADMIN_EMAIL, {
      templateData: {
        fields,
        adminLink: ADMIN_LINK,
        name: row.name ?? 'Unknown',
        procedure: row.procedure ?? '',
      },
      idempotencyKey: messageId,
      replyTo: customerEmail,
    })

    if (!result.sent) {
      await logSend('suppressed')
      return json({ success: true, suppressed: true })
    }

    await logSend('sent')
    return json({ success: true })
  } catch (error) {
    // The saved request stays intact; we only record the notification failure.
    const message = error instanceof Error ? error.message : 'Unknown send error'
    console.error('quote-notification: send failed', { requestId, message })
    await logSend('failed', message)
    return json({ success: false, error: 'Failed to send notification' }, 500)
  }
})

import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

const ADMIN_EMAIL = 'shijieyuwork@gmail.com'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

type Fields = Record<string, string>

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405)

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 只有管理员可以调用（后台上传流程使用）
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return json({ error: 'unauthorized' }, 401)
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) return json({ error: 'unauthorized' }, 401)
    if ((user.email?.toLowerCase() ?? '') !== ADMIN_EMAIL) {
      const { data: role } = await supabase
        .from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle()
      if (!role) return json({ error: 'forbidden: admin only' }, 403)
    }

    const body = await req.json() as { fields?: Fields; source?: string }
    const fields = body.fields ?? {}
    const entries = Object.entries(fields).filter(([, v]) => typeof v === 'string' && v.trim())
    if (entries.length === 0) return json({ translations: { zh: {}, en: {}, ru: {} } })

    const apiKey = Deno.env.get('LOVABLE_API_KEY')
    if (!apiKey) return json({ error: 'AI not configured' }, 500)

    const payload = Object.fromEntries(entries)
    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content:
              'You translate medical-tourism marketing copy for a Chinese aesthetics platform. ' +
              'Input is a JSON object of Chinese source fields. Return ONLY JSON of the shape ' +
              '{"en":{...},"ru":{...}} with the exact same keys, translated into natural English and Russian. ' +
              'Keep proper nouns and clinic/city names accurate. Never use the word "doctor"/"врач" in prose — use "expert"/"эксперт". ' +
              'Do not add commentary or medical advice.',
          },
          { role: 'user', content: JSON.stringify(payload) },
        ],
        response_format: { type: 'json_object' },
      }),
    })

    if (res.status === 429) return json({ error: 'rate limited, try again shortly' }, 429)
    if (res.status === 402) return json({ error: 'AI credits exhausted' }, 402)
    if (!res.ok) return json({ error: `AI error: ${await res.text()}` }, 502)

    const data = await res.json()
    const raw = data?.choices?.[0]?.message?.content ?? '{}'
    let parsed: { en?: Fields; ru?: Fields }
    try {
      parsed = JSON.parse(raw)
    } catch {
      return json({ error: 'AI returned invalid JSON' }, 502)
    }

    const pick = (obj: Fields | undefined): Fields =>
      Object.fromEntries(entries.map(([k]) => [k, String(obj?.[k] ?? payload[k])]))

    return json({
      translations: {
        zh: payload,
        en: pick(parsed.en),
        ru: pick(parsed.ru),
      },
    })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'unexpected error' }, 500)
  }
})

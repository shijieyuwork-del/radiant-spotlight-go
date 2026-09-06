import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

const ADMIN_EMAIL = 'shijieyuwork@gmail.com'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

const SYSTEM = `你是医美平台的后台录入助手。用户会提供一张或多张图片（名片、资质证书、简介截图、宣传图、诊所页面截图等）。
请从图片中识别专家信息，并输出 JSON，字段如下（全部用简体中文，找不到就留空字符串）：
{
  "name": "专家姓名",
  "title": "职称，如 主任医师 / 整形外科主任",
  "hospital": "医院或诊所名称",
  "city": "城市（只写城市名，如 上海）",
  "specialties": "擅长项目，用中文逗号分隔",
  "languages": "可服务语言，用逗号分隔",
  "bio": "2-4 句中文简介，只根据图片里的事实撰写",
  "credentials": "资质与认证，多条用换行分隔",
  "notes": "无法确认或需人工核对的地方，一句话"
}
严格规则：只输出 JSON；不要编造图片中不存在的信息；不要给出任何医疗建议或疗效承诺；描述人员时使用"专家"而非"医生"。`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405)

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return json({ error: 'unauthorized' }, 401)
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) return json({ error: 'unauthorized' }, 401)
    if ((user.email?.toLowerCase() ?? '') !== ADMIN_EMAIL) {
      const { data: role } = await supabase
        .from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle()
      if (!role) return json({ error: 'forbidden: admin only' }, 403)
    }

    const body = await req.json() as { images?: string[] }
    const images = (body.images ?? []).filter((s) => typeof s === 'string' && s.startsWith('data:image/')).slice(0, 4)
    if (images.length === 0) return json({ error: '请提供至少一张图片' }, 400)

    const apiKey = Deno.env.get('LOVABLE_API_KEY')
    if (!apiKey) return json({ error: 'LOVABLE_API_KEY missing' }, 500)

    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-3.7-flash',
        messages: [
          { role: 'system', content: SYSTEM },
          {
            role: 'user',
            content: [
              { type: 'text', text: '请识别这些图片中的专家信息，按要求输出 JSON。' },
              ...images.map((url) => ({ type: 'image_url', image_url: { url } })),
            ],
          },
        ],
        response_format: { type: 'json_object' },
      }),
    })

    if (res.status === 429) return json({ error: '请求过于频繁，请稍后再试' }, 429)
    if (res.status === 402) return json({ error: 'AI 额度已用完，请充值后再试' }, 402)
    if (!res.ok) return json({ error: `AI error: ${await res.text()}` }, 502)

    const data = await res.json()
    const raw = data?.choices?.[0]?.message?.content ?? '{}'
    let parsed: Record<string, unknown>
    try { parsed = JSON.parse(raw) } catch { return json({ error: 'AI 返回内容无法解析' }, 502) }

    const str = (k: string) => String(parsed?.[k] ?? '').trim()
    return json({
      fields: {
        name: str('name'), title: str('title'), hospital: str('hospital'), city: str('city'),
        specialties: str('specialties'), languages: str('languages'),
        bio: str('bio'), credentials: str('credentials'),
      },
      notes: str('notes'),
    })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'unexpected error' }, 500)
  }
})

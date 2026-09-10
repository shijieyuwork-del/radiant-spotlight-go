import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

const ADMIN_EMAIL = 'shijieyuwork@gmail.com'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

const SYSTEM = `你是医美信息平台的后台录入助手。用户会提供一份 PDF 的页面截图（医院简介、宣传册、资质文件、官网打印稿等），可能还附带 PDF 中提取到的纯文本。
请识别其中的医院/机构资料，润色成适合网站展示的正式文案，并输出 JSON：
{
  "nameZh": "医院中文名称",
  "nameEn": "医院英文名称（没有就按中文名规范翻译）",
  "city": "城市中文名，如 上海",
  "areaZh": "所在区域中文，如 浦东新区",
  "areaEn": "所在区域英文",
  "descriptionZh": "3-5 句中文介绍，说明机构定位、规模、特色科室与服务，语气客观",
  "descriptionEn": "与中文对应的英文介绍，地道书面英语",
  "websiteUrl": "官网地址，没有就留空",
  "isPublic": true 或 false（公立医院为 true，私立/民营机构为 false，不确定填 false）,
  "notes": "无法确认或需人工核对的地方，一句话中文"
}
严格规则：只输出 JSON；不要编造资料中不存在的事实（床位数、排名、获奖等）；不要给出任何医疗建议、疗效承诺或治愈率；描述人员时使用"专家"而非"医生"；找不到的字段填空字符串。`

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

    const body = await req.json() as { images?: string[]; text?: string }
    const images = (body.images ?? [])
      .filter((s) => typeof s === 'string' && s.startsWith('data:image/'))
      .slice(0, 6)
    const text = typeof body.text === 'string' ? body.text.slice(0, 20000).trim() : ''
    if (images.length === 0 && text.length < 20) return json({ error: '没有可识别的 PDF 内容' }, 400)

    const apiKey = Deno.env.get('LOVABLE_API_KEY')
    if (!apiKey) return json({ error: 'LOVABLE_API_KEY missing' }, 500)

    const content: Record<string, unknown>[] = [
      {
        type: 'text',
        text: text
          ? `请识别这份 PDF 的医院资料并按要求输出 JSON。以下是 PDF 中提取到的文本：\n\n${text}`
          : '请识别这份 PDF 页面截图中的医院资料，按要求输出 JSON。',
      },
      ...images.map((url) => ({ type: 'image_url', image_url: { url } })),
    ]

    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-3.7-flash',
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content },
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
        nameZh: str('nameZh'), nameEn: str('nameEn'), city: str('city'),
        areaZh: str('areaZh'), areaEn: str('areaEn'),
        descriptionZh: str('descriptionZh'), descriptionEn: str('descriptionEn'),
        websiteUrl: str('websiteUrl'),
        isPublic: parsed?.isPublic === true,
      },
      notes: str('notes'),
    })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'unexpected error' }, 500)
  }
})

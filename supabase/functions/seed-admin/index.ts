// 一次性开发种子函数：创建管理员账号（shijieyuwork@gmail.com）。
// 安全约束：仅当该邮箱尚不存在时创建；创建后本函数应立即删除。
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const ADMIN_EMAIL = 'shijieyuwork@gmail.com'

const genPassword = (): string => {
  const bytes = new Uint8Array(18)
  crypto.getRandomValues(bytes)
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let out = ''
  for (const b of bytes) out += alphabet[b % alphabet.length]
  return out
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const service = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // 幂等保护：管理员已存在则拒绝，避免被重复调用重置密码
  const { data: existing } = await service.auth.admin.listUsers({ page: 1, perPage: 1000 })
  const found = existing?.users?.find((u) => u.email?.toLowerCase() === ADMIN_EMAIL)
  if (found) {
    return new Response(
      JSON.stringify({ error: 'admin already exists', user_id: found.id, email: found.email }),
      { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }

  const password = genPassword()
  const { data, error } = await service.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password,
    email_confirm: true,
    user_metadata: { display_name: 'Admin (seed)' },
  })
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // 密码仅返回这一次，请立即保存并登录后修改
  return new Response(
    JSON.stringify({ user_id: data.user.id, email: data.user.email, password, note: 'password shown once; change after first login' }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  )
})

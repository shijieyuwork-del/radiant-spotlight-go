import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

/**
 * security-watchdog — 管理员手动触发安全漂移扫描并查看待投递告警。
 *
 * - 仅管理员（JWT email 白名单）可调用。
 * - action=run    : 立即执行 run_security_watchdog() 并返回本次发现。
 * - action=outbox : 返回待投递的告警（nightly 新增告警 / weekly 摘要）。
 * 邮件投递在项目邮件域名配置完成后激活；目前告警积压在 security_alert_outbox。
 */

const ADMIN_EMAILS = ["shijieyuwork@gmail.com"];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  // --- 管理员鉴权 ---
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "missing authorization" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey);

  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  const email = userData?.user?.email ?? "";
  if (userErr || !ADMIN_EMAILS.includes(email)) {
    return json({ error: "admin only" }, 403);
  }

  // --- 入参校验 ---
  let body: { action?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid json" }, 400);
  }
  const action = body.action;
  if (action !== "run" && action !== "outbox") {
    return json({ error: "action must be 'run' or 'outbox'" }, 400);
  }

  if (action === "run") {
    const { data: runId, error } = await admin.rpc("run_security_watchdog");
    if (error) return json({ error: error.message }, 500);
    const { data: findings } = await admin
      .from("security_watchdog_findings")
      .select("severity, check_key, object_name, detail, created_at")
      .eq("run_id", runId)
      .order("severity");
    return json({ run_id: runId, findings: findings ?? [] });
  }

  const { data: alerts, error } = await admin
    .from("security_alert_outbox")
    .select("id, kind, subject, body, finding_count, status, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return json({ error: error.message }, 500);
  return json({ pending: alerts ?? [], note: "email delivery activates once the project email domain is configured" });
});

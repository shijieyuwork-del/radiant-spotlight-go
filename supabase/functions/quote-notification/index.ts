import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

const escapeHtml = (value: string | null | undefined) => (value ?? "—")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  let requestId = "";
  try {
    const body = await req.json();
    requestId = typeof body.requestId === "string" ? body.requestId : "";
  } catch {
    return json({ error: "invalid json" }, 400);
  }
  if (!/^[0-9a-f-]{36}$/i.test(requestId)) return json({ error: "invalid request id" }, 400);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { data: quote, error } = await supabase
    .from("quote_requests")
    .select("*")
    .eq("id", requestId)
    .single();
  if (error || !quote) return json({ error: "request not found" }, 404);
  const createdAt = new Date(quote.created_at).getTime();
  if (!Number.isFinite(createdAt) || Date.now() - createdAt > 15 * 60 * 1000) {
    return json({ error: "notification window expired" }, 409);
  }

  const recipient = Deno.env.get("QUOTE_NOTIFICATION_TO") || "shijieyuwork@gmail.com";
  const sender = Deno.env.get("QUOTE_NOTIFICATION_FROM") || "CeladonChina <noreply@cosmetics-asia.com>";

  const fullPhone = `${quote.phone_prefix ?? ""} ${quote.phone}`.trim();
  const subject = `新客户咨询：${quote.name} · ${quote.procedure}`;
  const rows = [
    ["姓名", quote.name],
    ["邮箱", quote.email],
    ["电话", fullPhone],
    ["出发国家", quote.country],
    ["意向项目", quote.procedure],
    ["联系方式", quote.contact_method],
    ["意向专家", quote.expert_name],
    ["意向城市", quote.city],
    ["希望时间", quote.preferred_slot],
    ["客户留言", quote.notes],
    ["来源", quote.source],
  ];
  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#173f35;line-height:1.5"><div style="max-width:640px;margin:auto;padding:24px"><h1 style="font-size:24px">CeladonChina 新客户咨询</h1><p>网站刚刚收到一条新的咨询请求。</p><table style="width:100%;border-collapse:collapse">${rows.map(([label, value]) => `<tr><th style="padding:10px;text-align:left;border-bottom:1px solid #e5ebe8;width:120px">${label}</th><td style="padding:10px;border-bottom:1px solid #e5ebe8;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join("")}</table><p style="margin-top:20px"><a href="https://celadonchina.com/admin/content" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#173f35;color:white;text-decoration:none">打开管理员界面</a></p></div></body></html>`;
  const text = rows.map(([label, value]) => `${label}: ${value || "—"}`).join("\n");

  const messageId = `quote-${requestId}`;
  const { data: existing } = await supabase
    .from("email_send_log")
    .select("message_id, status")
    .eq("message_id", messageId)
    .in("status", ["pending", "sent"])
    .limit(1);
  if (existing?.length) return json({ sent: true, duplicate: true });

  await supabase.from("email_send_log").insert({
    message_id: messageId,
    template_name: "quote_notification",
    recipient_email: recipient,
    status: "pending",
  });
  const { error: enqueueError } = await supabase.rpc("enqueue_email", {
    queue_name: "auth_emails",
    payload: {
      run_id: requestId,
      message_id: messageId,
      to: recipient,
      from: sender,
      reply_to: quote.email || undefined,
      sender_domain: "notify.cosmetics-asia.com",
      subject,
      html,
      text,
      purpose: "transactional",
      label: "quote_notification",
      queued_at: new Date().toISOString(),
    },
  });
  if (enqueueError) {
    console.error("could not enqueue quote notification", enqueueError.message);
    await supabase.from("email_send_log").update({
      status: "failed",
      error_message: "Failed to enqueue quote notification",
    }).eq("message_id", messageId).eq("status", "pending");
    return json({ error: "could not enqueue notification" }, 502);
  }
  return json({ sent: true, queued: true });
});

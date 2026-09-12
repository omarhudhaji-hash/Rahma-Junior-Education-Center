import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const atUsername = Deno.env.get("AT_USERNAME");
  const atApiKey = Deno.env.get("AT_API_KEY");
  const atSenderId = Deno.env.get("AT_SENDER_ID");

  if (!supabaseUrl || !anonKey || !serviceKey) return json({ error: "Supabase server configuration is incomplete." }, 500);
  if (!atUsername || !atApiKey) return json({ error: "SMS provider is not configured. Add AT_USERNAME and AT_API_KEY to Edge Function secrets." }, 503);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Missing authorization." }, 401);

  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user) return json({ error: "Unauthenticated." }, 401);

  const adminClient = createClient(supabaseUrl, serviceKey);
  const { data: roles, error: roleError } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);
  if (roleError) return json({ error: roleError.message }, 500);
  const allowed = (roles ?? []).some((r) => r.role === "admin" || r.role === "headteacher");
  if (!allowed) return json({ error: "Only the school director/admin or headteacher may send SMS." }, 403);

  let payload: { recipients?: Array<{ phone: string; name?: string; userId?: string }>; message?: string; automationKey?: string };
  try { payload = await req.json(); } catch { return json({ error: "Invalid JSON body." }, 400); }

  const message = String(payload.message ?? "").trim();
  const automationKey = payload.automationKey ? String(payload.automationKey).slice(0, 80) : null;
  const recipients = Array.isArray(payload.recipients) ? payload.recipients : [];
  if (!message || message.length > 480) return json({ error: "Message must contain 1–480 characters." }, 400);
  if (!recipients.length || recipients.length > 500) return json({ error: "Provide between 1 and 500 recipients." }, 400);

  const normalized = recipients
    .map((r) => ({ ...r, phone: String(r.phone ?? "").trim() }))
    .filter((r) => r.phone.length > 0);
  if (!normalized.length) return json({ error: "No valid recipient phone numbers were supplied." }, 400);

  const params = new URLSearchParams();
  params.set("username", atUsername);
  params.set("to", normalized.map((r) => r.phone).join(","));
  params.set("message", message);
  if (atSenderId) params.set("from", atSenderId);

  const atResponse = await fetch("https://api.africastalking.com/version1/messaging", {
    method: "POST",
    headers: { "apiKey": atApiKey, "Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  const atText = await atResponse.text();
  let atData: any = {};
  try { atData = JSON.parse(atText); } catch { /* keep raw provider response */ }

  const providerRecipients = atData?.SMSMessageData?.Recipients ?? [];
  const byPhone = new Map(providerRecipients.map((r: any) => [String(r.number), r]));
  const batchId = crypto.randomUUID();
  const rows = normalized.map((r) => {
    const result = byPhone.get(r.phone) as any;
    const ok = String(result?.status ?? "").toLowerCase() === "success" || String(result?.statusCode ?? "") === "101";
    return {
      created_by: user.id,
      batch_id: batchId,
      automation_key: automationKey,
      recipient_id: r.userId ?? null,
      recipient_phone: r.phone,
      recipient_name: r.name ?? null,
      message,
      status: ok ? "sent" : "failed",
      provider_message_id: result?.messageId ?? null,
      provider_status: result?.status ?? (atResponse.ok ? "submitted" : "failed"),
      provider_cost: result?.cost ?? null,
      error_message: ok ? null : (result?.status ?? (!atResponse.ok ? atText.slice(0, 500) : "Provider did not confirm delivery")),
      sent_at: ok ? new Date().toISOString() : null,
    };
  });

  const { error: logError } = await adminClient.from("sms_messages").insert(rows);
  if (logError) return json({ error: `SMS was sent but logging failed: ${logError.message}`, provider: atData }, 500);

  return json({
    success: atResponse.ok,
    sent: rows.filter((r) => r.status === "sent").length,
    failed: rows.filter((r) => r.status === "failed").length,
    provider: atData?.SMSMessageData?.Message ?? null,
    batchId,
  }, atResponse.ok ? 200 : 502);
});

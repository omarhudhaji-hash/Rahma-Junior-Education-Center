import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const url = Deno.env.get("SUPABASE_URL");
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !service) return json({ error: "Supabase server configuration is missing." }, 500);
  const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "You must be signed in." }, 401);
  const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: caller, error: callerError } = await admin.auth.getUser(token);
  if (callerError || !caller.user) return json({ error: "Your session is invalid or expired." }, 401);
  const { data: role } = await admin.from("user_roles").select("role").eq("user_id", caller.user.id).eq("role", "admin").maybeSingle();
  if (!role) return json({ error: "Only the Admin can enable or disable parent portal accounts." }, 403);
  let payload: { userId?: string; active?: boolean };
  try { payload = await req.json(); } catch { return json({ error: "Invalid request body." }, 400); }
  const userId = String(payload.userId ?? "");
  const active = Boolean(payload.active);
  if (!userId) return json({ error: "Parent user ID is required." }, 400);
  const { data: parentRole } = await admin.from("user_roles").select("role").eq("user_id", userId).eq("role", "parent").maybeSingle();
  if (!parentRole) return json({ error: "Target account is not a parent account." }, 400);
  const { error: authError } = await admin.auth.admin.updateUserById(userId, { ban_duration: active ? "none" : "876000h" });
  if (authError) return json({ error: authError.message }, 400);
  const { error: profileError } = await admin.from("profiles").update({ is_active: active }).eq("id", userId);
  if (profileError) return json({ error: profileError.message }, 500);
  return json({ userId, active });
});

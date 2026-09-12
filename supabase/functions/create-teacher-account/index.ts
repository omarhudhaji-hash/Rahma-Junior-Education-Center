import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

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

  const { data: leadership, error: roleError } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", caller.user.id)
    .in("role", ["admin", "headteacher"])
    .maybeSingle();
  if (roleError || !leadership) return json({ error: "Only Admin or Headteacher can create teacher portal accounts." }, 403);

  let payload: {
    email?: string; password?: string; firstName?: string; lastName?: string;
    phone?: string; employeeNo?: string; subject?: string; hireDate?: string;
  };
  try { payload = await req.json(); } catch { return json({ error: "Invalid request body." }, 400); }

  const email = String(payload.email ?? "").trim().toLowerCase();
  const password = String(payload.password ?? "");
  const firstName = String(payload.firstName ?? "").trim();
  const lastName = String(payload.lastName ?? "").trim();
  const phone = String(payload.phone ?? "").trim();
  const employeeNo = String(payload.employeeNo ?? "").trim();
  const subject = String(payload.subject ?? "").trim();
  const hireDate = String(payload.hireDate ?? "").trim();

  if (!firstName || !lastName) return json({ error: "Teacher first name and last name are required." }, 400);
  if (!email || !email.includes("@")) return json({ error: "A valid teacher email is required for portal login." }, 400);
  if (password.length < 8) return json({ error: "Teacher portal password must be at least 8 characters." }, 400);
  if (!phone) return json({ error: "Teacher phone is required." }, 400);

  const { data: existingList, error: listError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listError) return json({ error: listError.message }, 500);
  const existing = existingList.users.find((u) => u.email?.toLowerCase() === email);

  let userId = existing?.id;
  if (!userId) {
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name: firstName, last_name: lastName, phone },
    });
    if (createError || !created.user) return json({ error: createError?.message ?? "Could not create teacher account." }, 400);
    userId = created.user.id;
  } else {
    const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
      user_metadata: { first_name: firstName, last_name: lastName, phone },
    });
    if (updateError) return json({ error: updateError.message }, 400);
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: userId, first_name: firstName, last_name: lastName, email, phone, is_active: true,
  });
  if (profileError) return json({ error: profileError.message }, 500);

  const { error: roleInsertError } = await admin.from("user_roles").upsert(
    { user_id: userId, role: "teacher" },
    { onConflict: "user_id,role", ignoreDuplicates: true },
  );
  if (roleInsertError) return json({ error: roleInsertError.message }, 500);

  const { error: recordError } = await admin.from("staff_records").upsert({
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    employee_no: employeeNo || null,
    subject: subject || null,
    hire_date: hireDate || null,
    status: "active",
    created_by: caller.user.id,
  }, { onConflict: "employee_no" });
  if (recordError && employeeNo) return json({ error: recordError.message }, 500);
  if (recordError && !employeeNo) {
    const { error: fallback } = await admin.from("staff_records").insert({
      first_name: firstName, last_name: lastName, email, phone,
      employee_no: null, subject: subject || null, hire_date: hireDate || null,
      status: "active", created_by: caller.user.id,
    });
    if (fallback) return json({ error: fallback.message }, 500);
  }

  return json({ userId, email, existed: Boolean(existing), role: "teacher" });
});

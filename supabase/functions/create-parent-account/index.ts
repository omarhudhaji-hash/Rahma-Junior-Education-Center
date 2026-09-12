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

  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "You must be signed in." }, 401);

  const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: caller, error: callerError } = await admin.auth.getUser(token);
  if (callerError || !caller.user) return json({ error: "Your session is invalid or expired." }, 401);

  const { data: callerRole, error: roleError } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", caller.user.id)
    .in("role", ["admin", "headteacher"])
    .maybeSingle();
  if (roleError || !callerRole) return json({ error: "Only Admin or Headteacher can create parent portal accounts." }, 403);

  let payload: { email?: string; password?: string; firstName?: string; lastName?: string; phone?: string };
  try { payload = await req.json(); } catch { return json({ error: "Invalid request body." }, 400); }

  const email = String(payload.email ?? "").trim().toLowerCase();
  const password = String(payload.password ?? "");
  const firstName = String(payload.firstName ?? "").trim();
  const lastName = String(payload.lastName ?? "").trim();
  const phone = String(payload.phone ?? "").trim();

  if (!email || !email.includes("@")) return json({ error: "A valid parent email is required for portal login." }, 400);
  if (password.length < 8) return json({ error: "Parent portal password must be at least 8 characters." }, 400);

  // Reuse an existing account rather than creating a duplicate.
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
    if (createError || !created.user) return json({ error: createError?.message ?? "Could not create parent account." }, 400);
    userId = created.user.id;
  } else {
    const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
      password,
      user_metadata: { first_name: firstName, last_name: lastName, phone },
    });
    if (updateError) return json({ error: updateError.message }, 400);
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: userId,
    first_name: firstName,
    last_name: lastName,
    email,
    phone: phone || null,
  });
  if (profileError) return json({ error: profileError.message }, 500);

  const { error: roleInsertError } = await admin.from("user_roles").upsert({ user_id: userId, role: "parent" }, { onConflict: "user_id,role", ignoreDuplicates: true });
  if (roleInsertError) return json({ error: roleInsertError.message }, 500);

  // If a family record already exists for this email/phone, connect all its children.
  let linkedChildren = 0;
  const familyFilters = [`parent_email.eq.${email}`];
  if (phone) familyFilters.push(`parent_phone.eq.${phone}`);
  const { data: families, error: familyError } = await admin
    .from("admission_families")
    .select("id,parent_email,parent_phone")
    .eq("status", "active")
    .or(familyFilters.join(","));
  if (familyError) return json({ error: familyError.message }, 500);
  for (const family of families ?? []) {
    const { data: children, error: childError } = await admin
      .from("admission_family_students")
      .select("student_id")
      .eq("family_id", family.id);
    if (childError) return json({ error: childError.message }, 500);
    for (const child of children ?? []) {
      const { error } = await admin
        .from("parent_student")
        .upsert({ parent_id: userId, student_id: child.student_id, relationship: "parent", is_primary: true }, { onConflict: "parent_id,student_id", ignoreDuplicates: true });
      if (error) return json({ error: error.message }, 500);
      linkedChildren += 1;
    }
  }
  return json({ userId, email, linkedChildren, existed: Boolean(existing) });
});

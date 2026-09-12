import { redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/lib/school";

export async function requirePortalRoles(allowed: AppRole[]) {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData.session) throw redirect({ to: "/auth" });

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", sessionData.session.user.id);

  if (error) throw error;
  const roles = (data ?? []).map((row) => row.role as AppRole);
  if (!allowed.some((role) => roles.includes(role))) {
    throw redirect({ to: "/dashboard" });
  }
  return roles;
}

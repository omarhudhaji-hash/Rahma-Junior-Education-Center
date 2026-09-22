import { n as supabase } from "./client-B2gFRfJz.mjs";
import { A as redirect } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/permissions-B1W1UZOe.js
async function requirePortalRoles(allowed) {
	const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
	if (sessionError || !sessionData.session) throw redirect({ to: "/auth" });
	const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", sessionData.session.user.id);
	if (error) throw error;
	const roles = (data ?? []).map((row) => row.role);
	if (!allowed.some((role) => roles.includes(role))) throw redirect({ to: "/dashboard" });
	return roles;
}
//#endregion
export { requirePortalRoles as t };

import { n as __toESM } from "../_runtime.mjs";
import { n as supabase, t as isSupabaseConfigured } from "./client-B2gFRfJz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-auth-BfiWx6iO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)({
	session: null,
	user: null,
	loading: true
});
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const queryClient = useQueryClient();
	(0, import_react.useEffect)(() => {
		if (!isSupabaseConfigured()) {
			setSession(null);
			setLoading(false);
			return;
		}
		let active = true;
		const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
			if (!active) return;
			setSession(next);
			if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") queryClient.invalidateQueries({ queryKey: ["me"] });
		});
		supabase.auth.getSession().then(({ data }) => {
			if (!active) return;
			setSession(data.session);
			setLoading(false);
		});
		return () => {
			active = false;
			sub.subscription.unsubscribe();
		};
	}, [queryClient]);
	const value = (0, import_react.useMemo)(() => ({
		session,
		user: session?.user ?? null,
		loading
	}), [session, loading]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	return (0, import_react.useContext)(AuthContext);
}
/** Current profile + roles. The single source of truth for portal permissions. */
function useMe() {
	const { user, loading } = useAuth();
	const userId = user?.id;
	const query = useQuery({
		queryKey: ["me", userId],
		enabled: Boolean(userId),
		staleTime: 6e4,
		queryFn: async () => {
			const [{ data: profile, error: pErr }, { data: roleRows, error: rErr }] = await Promise.all([supabase.from("profiles").select("*").eq("id", userId).maybeSingle(), supabase.from("user_roles").select("role").eq("user_id", userId)]);
			if (pErr) throw pErr;
			if (rErr) throw rErr;
			const roles = (roleRows ?? []).map((r) => r.role);
			return {
				profile: profile ?? null,
				roles
			};
		}
	});
	const roles = query.data?.roles ?? [];
	const primaryRole = [
		"admin",
		"headteacher",
		"teacher",
		"parent",
		"student"
	].find((r) => roles.includes(r)) ?? "parent";
	return {
		userId,
		user,
		profile: query.data?.profile ?? null,
		roles,
		primaryRole,
		hasRole: (r) => roles.includes(r),
		isStaff: roles.some((r) => r === "admin" || r === "headteacher" || r === "teacher"),
		isAdmin: roles.includes("admin"),
		isLeadership: roles.some((r) => r === "admin" || r === "headteacher"),
		loading: loading || query.isLoading,
		refetch: query.refetch
	};
}
//#endregion
export { useAuth as n, useMe as r, AuthProvider as t };

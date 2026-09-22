import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { a as fullName } from "./school-BBKER8cz.mjs";
import { n as getSupabaseFunctionError } from "./utils-DTw8Xhwa.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./use-auth-BfiWx6iO.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { _ as ShieldCheck, b as Search, c as UserPlus, g as ShieldOff, i as Users } from "../_libs/lucide-react.mjs";
import { f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Input } from "./input-CIJ7QuDk.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader, t as EmptyState } from "./page-header-D2pXXqT-.mjs";
import { t as Badge } from "./badge-CCuYWPBQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.parents-CGQZmkcm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ParentsPage() {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const parentDetailMatch = pathname.startsWith("/portal/parents/") && pathname !== "/portal/parents/";
	const [q, setQ] = import_react.useState("");
	const qc = useQueryClient();
	const { hasRole } = useMe();
	const parents = useQuery({
		queryKey: ["parents-directory", q],
		queryFn: async () => {
			const { data: roles, error: roleError } = await supabase.from("user_roles").select("user_id").eq("role", "parent");
			if (roleError) throw roleError;
			const ids = (roles ?? []).map((x) => x.user_id);
			const [{ data: profiles, error: profileError }, { data: links, error: linkError }, { data: families, error: familyError }] = await Promise.all([
				ids.length ? supabase.from("profiles").select("id,first_name,last_name,email,phone,is_active").in("id", ids).order("first_name") : Promise.resolve({
					data: [],
					error: null
				}),
				ids.length ? supabase.from("parent_student").select("parent_id,student_id").in("parent_id", ids) : Promise.resolve({
					data: [],
					error: null
				}),
				supabase.from("admission_families").select("id,parent_name,parent_email,parent_phone,status").eq("status", "active").order("created_at", { ascending: false })
			]);
			if (profileError) throw profileError;
			if (linkError) throw linkError;
			if (familyError) throw familyError;
			const countByParent = /* @__PURE__ */ new Map();
			for (const link of links ?? []) countByParent.set(link.parent_id, (countByParent.get(link.parent_id) ?? 0) + 1);
			const familyByParent = /* @__PURE__ */ new Map();
			for (const p of profiles ?? []) {
				const family = (families ?? []).find((f) => p.email && f.parent_email && p.email.toLowerCase() === f.parent_email.toLowerCase() || p.phone && f.parent_phone && p.phone === f.parent_phone);
				if (family) familyByParent.set(p.id, family.id);
			}
			const familyIds = (families ?? []).map((family) => family.id);
			const { data: familyLinks, error: familyLinkError } = familyIds.length ? await supabase.from("admission_family_students").select("family_id,student_id").in("family_id", familyIds) : {
				data: [],
				error: null
			};
			if (familyLinkError) throw familyLinkError;
			const studentIds = [.../* @__PURE__ */ new Set([...(links ?? []).map((x) => x.student_id), ...(familyLinks ?? []).map((x) => x.student_id)])];
			const { data: students, error: studentError } = studentIds.length ? await supabase.from("students").select("id,first_name,last_name,admission_no").in("id", studentIds) : {
				data: [],
				error: null
			};
			if (studentError) throw studentError;
			const profileRows = (profiles ?? []).map((p) => ({
				...p,
				id: p.id,
				userId: p.id,
				childCount: countByParent.get(p.id) ?? 0,
				familyId: familyByParent.get(p.id) ?? null
			}));
			const normalized = q.trim().toLowerCase();
			const familyRows = (families ?? []).filter((family) => {
				if (profileRows.find((p) => p.familyId === family.id)) return false;
				if (!normalized) return true;
				const childIds = (familyLinks ?? []).filter((link) => link.family_id === family.id).map((link) => link.student_id);
				const childText = (students ?? []).filter((student) => childIds.includes(student.id)).map((student) => `${student.first_name} ${student.last_name} ${student.admission_no}`).join(" ");
				return `${family.parent_name} ${family.parent_phone} ${family.parent_email ?? ""} ${childText}`.toLowerCase().includes(normalized);
			}).map((family) => {
				const nameParts = family.parent_name.trim().split(/\s+/);
				return {
					id: family.id,
					userId: null,
					first_name: nameParts.shift() ?? "Parent",
					last_name: nameParts.join(" "),
					email: family.parent_email,
					phone: family.parent_phone,
					is_active: true,
					childCount: (familyLinks ?? []).filter((link) => link.family_id === family.id).length,
					familyId: family.id
				};
			});
			return [...profileRows.filter((p) => {
				if (!normalized) return true;
				const own = `${p.first_name} ${p.last_name} ${p.email ?? ""} ${p.phone ?? ""}`.toLowerCase();
				const childIds = (links ?? []).filter((l) => l.parent_id === p.id).map((l) => l.student_id);
				const childText = (students ?? []).filter((s) => childIds.includes(s.id)).map((s) => `${s.first_name} ${s.last_name} ${s.admission_no}`).join(" ").toLowerCase();
				return own.includes(normalized) || childText.includes(normalized);
			}), ...familyRows];
		}
	});
	const setStatus = useMutation({
		mutationFn: async ({ userId, familyId, active }) => {
			if (!hasRole("admin")) throw new Error("Only the Admin can change portal account status.");
			if (familyId) {
				const { error } = await supabase.from("admission_families").update({ status: active ? "active" : "inactive" }).eq("id", familyId);
				if (error) throw error;
				return;
			}
			if (!userId) throw new Error("Parent account identifier is required.");
			const { data: session } = await supabase.auth.getSession();
			if (!session.session?.access_token) throw new Error("Your session has expired. Please sign in again.");
			const { error } = await supabase.functions.invoke("set-parent-account-status", {
				body: {
					userId,
					active
				},
				headers: { Authorization: `Bearer ${session.session.access_token}` }
			});
			if (error) throw error;
		},
		onSuccess: (_, vars) => {
			toast.success(vars.active ? "Parent portal account enabled." : "Parent portal account disabled.");
			qc.invalidateQueries({ queryKey: ["parents-directory"] });
		},
		onError: async (e) => toast.error(await getSupabaseFunctionError(e, "Could not update account status"))
	});
	if (parentDetailMatch) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Parents & Families",
			description: "One parent account can manage multiple children. Search by parent or child details.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/portal/admissions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "mr-2 size-4" }), "Add / Admit Child"]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search parent, phone, email, student or admission no.",
					className: "pl-9"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-sm text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }),
					parents.data?.length ?? 0,
					" parent accounts"
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-0",
			children: parents.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "p-6 text-sm text-muted-foreground",
				children: "Loading parent directory…"
			}) : parents.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Unable to load the parent directory." }) : parents.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y",
				children: parents.data.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/30",
					children: [p.userId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/portal/parents/$parentId",
						params: { parentId: p.userId },
						className: "min-w-0 flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 font-semibold text-primary",
								children: `${p.first_name?.[0] ?? ""}${p.last_name?.[0] ?? ""}`.toUpperCase()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: fullName(p)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate text-sm text-muted-foreground",
										children: [
											p.phone ?? "No phone",
											" · ",
											p.email ?? "No email"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "secondary",
											children: [
												p.childCount,
												" ",
												p.childCount === 1 ? "child" : "children"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: p.is_active ? "default" : "destructive",
											children: p.is_active ? "Active" : "Disabled"
										})]
									})
								]
							})]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0 flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 font-semibold text-primary",
								children: `${p.first_name?.[0] ?? ""}${p.last_name?.[0] ?? ""}`.toUpperCase()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: fullName(p)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate text-sm text-muted-foreground",
										children: [
											p.phone ?? "No phone",
											" · ",
											p.email ?? "No email"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "secondary",
											children: [
												p.childCount,
												" ",
												p.childCount === 1 ? "child" : "children"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											children: "Online application"
										})]
									})
								]
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/portal/parents/$parentId",
								params: { parentId: p.userId ?? p.familyId },
								children: "View family"
							})
						}), hasRole("admin") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: p.is_active ? "outline" : "default",
							size: "sm",
							disabled: setStatus.isPending,
							onClick: () => setStatus.mutate({
								userId: p.userId ?? void 0,
								familyId: p.userId ? void 0 : p.familyId ?? void 0,
								active: !p.is_active
							}),
							children: p.is_active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldOff, { className: "size-4" }), "Disable"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mr-2 size-4" }), "Enable"] })
						})]
					})]
				}, `${p.userId ?? "family"}-${p.id}`))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No parents found." })
		}) })
	] });
}
//#endregion
export { ParentsPage as component };

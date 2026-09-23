import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { a as fullName, d as roleLabels } from "./school-CK2M8GiK.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { t as Input } from "./input-BG-idtzq.mjs";
import { n as PageHeader, t as EmptyState } from "./page-header-D2pXXqT-.mjs";
import { t as Badge } from "./badge-CCuYWPBQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.staff-Bq3JEVeX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyForm = {
	first_name: "",
	last_name: "",
	email: "",
	phone: "",
	employee_no: "",
	subject: "",
	hire_date: "",
	password: ""
};
function StaffPage() {
	const [q, setQ] = import_react.useState("");
	const qc = useQueryClient();
	const [form, setForm] = import_react.useState(emptyForm);
	const data = useQuery({
		queryKey: ["staff-directory"],
		queryFn: async () => {
			const { data: r, error: re } = await supabase.from("user_roles").select("user_id,role").in("role", [
				"admin",
				"headteacher",
				"teacher"
			]);
			if (re) throw re;
			const ids = [...new Set((r ?? []).map((x) => x.user_id))];
			return (ids.length ? (await supabase.from("profiles").select("id,first_name,last_name,email,phone,is_active").in("id", ids).order("first_name")).data ?? [] : []).map((x) => ({
				...x,
				roles: (r ?? []).filter((y) => y.user_id === x.id).map((y) => y.role)
			}));
		}
	});
	const records = useQuery({
		queryKey: ["staff-records"],
		queryFn: async () => {
			const { data, error } = await supabase.from("staff_records").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const add = useMutation({
		mutationFn: async () => {
			if (!form.first_name || !form.last_name || !form.phone || !form.email || !form.password) throw new Error("First name, last name, phone, email and portal password are required.");
			if (form.password.length < 8) throw new Error("Portal password must be at least 8 characters.");
			const { data, error } = await supabase.functions.invoke("create-teacher-account", { body: {
				email: form.email,
				password: form.password,
				firstName: form.first_name,
				lastName: form.last_name,
				phone: form.phone,
				employeeNo: form.employee_no,
				subject: form.subject,
				hireDate: form.hire_date
			} });
			if (error) throw error;
			if (data?.error) throw new Error(data.error);
			return data;
		},
		onSuccess: (d) => {
			qc.invalidateQueries({ queryKey: ["staff-records"] });
			qc.invalidateQueries({ queryKey: ["staff-directory"] });
			setForm(emptyForm);
			alert(`Teacher registration successful.\n\nPortal email: ${d.email}\nPortal password: the password you entered\n\nGive these login details to the teacher. They can change the password after signing in.`);
		},
		onError: (e) => alert(e instanceof Error ? e.message : "Could not register teacher")
	});
	const rows = (data.data ?? []).filter((p) => !q || `${p.first_name} ${p.last_name} ${p.email ?? ""} ${p.phone ?? ""}`.toLowerCase().includes(q.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Staff",
			description: "Register teachers with a working portal account, then manage classes and assignments separately."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Register teacher & create portal login"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "First name",
						value: form.first_name,
						onChange: (e) => setForm({
							...form,
							first_name: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Last name",
						value: form.last_name,
						onChange: (e) => setForm({
							...form,
							last_name: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Employee number",
						value: form.employee_no,
						onChange: (e) => setForm({
							...form,
							employee_no: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Phone",
						value: form.phone,
						onChange: (e) => setForm({
							...form,
							phone: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						placeholder: "Portal email",
						value: form.email,
						onChange: (e) => setForm({
							...form,
							email: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						minLength: 8,
						placeholder: "Portal password (8+ chars)",
						value: form.password,
						onChange: (e) => setForm({
							...form,
							password: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Main subject / responsibility",
						value: form.subject,
						onChange: (e) => setForm({
							...form,
							subject: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: form.hire_date,
						onChange: (e) => setForm({
							...form,
							hire_date: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => add.mutate(),
						disabled: add.isPending,
						children: add.isPending ? "Creating account…" : "Register teacher"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: "The password is set by Admin/Headteacher during registration. The teacher uses the email and password above to enter the Teacher Portal."
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: "Search active staff accounts",
			className: "mb-4 max-w-md"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-4",
				children: rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y",
					children: rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap justify-between gap-3 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: fullName(p)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								p.email ?? "No email",
								" · ",
								p.phone ?? "No phone"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: p.roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "mr-1",
							children: roleLabels[r]
						}, r)) })]
					}, p.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No staff accounts found." })
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: "Recorded staff admissions"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-4",
			children: records.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y",
				children: records.data.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1 p-4 md:grid-cols-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
							r.first_name,
							" ",
							r.last_name
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.employee_no || "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.phone }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.subject || "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.hire_date || "—" })
					]
				}, r.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No manually entered staff records yet." })
		})] })
	] });
}
//#endregion
export { StaffPage as component };

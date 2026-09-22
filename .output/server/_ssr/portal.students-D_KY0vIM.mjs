import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { a as fullName } from "./school-BBKER8cz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./use-auth-BfiWx6iO.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { o as UserRound } from "../_libs/lucide-react.mjs";
import { f as Outlet, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Input } from "./input-CIJ7QuDk.mjs";
import { t as Textarea } from "./textarea-lY6r0rtj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader, t as EmptyState } from "./page-header-D2pXXqT-.mjs";
import { t as Badge } from "./badge-CCuYWPBQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.students-D_KY0vIM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StudentsLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentsPage, {})] });
}
function StudentsPage() {
	const { userId, isLeadership, hasRole } = useMe();
	const qc = useQueryClient();
	const family = hasRole("parent") || hasRole("student");
	const [q, setQ] = (0, import_react.useState)("");
	const students = useQuery({
		queryKey: [
			"students",
			userId,
			isLeadership,
			family
		],
		queryFn: async () => {
			let ids = [];
			if (hasRole("parent")) {
				const { data } = await supabase.from("parent_student").select("student_id").eq("parent_id", userId);
				ids = (data ?? []).map((x) => x.student_id);
			} else if (hasRole("student")) {
				const { data } = await supabase.from("students").select("id").eq("user_id", userId);
				ids = (data ?? []).map((x) => x.id);
			}
			let query = supabase.from("students").select("id,admission_no,first_name,last_name,gender,status,admission_date,current_class_id,photo_url,classes:current_class_id(name,section)").order("first_name");
			if (hasRole("parent") || hasRole("student")) {
				if (!ids.length) return [];
				query = query.in("id", ids);
			}
			const { data, error } = await query;
			if (error) throw error;
			return data ?? [];
		}
	});
	const addRemark = useMutation({
		mutationFn: async ({ studentId, remark }) => {
			const { error } = await supabase.from("student_remarks").insert({
				student_id: studentId,
				teacher_id: userId,
				remark
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Remark saved.");
			qc.invalidateQueries({ queryKey: ["remarks"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save remark")
	});
	const rows = (students.data ?? []).filter((s) => {
		const n = q.trim().toLowerCase();
		return !n || `${s.first_name} ${s.last_name} ${s.admission_no}`.toLowerCase().includes(n);
	});
	if (family) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: hasRole("parent") ? "My Children" : "My Student Record",
			description: hasRole("parent") ? "Only your linked children are shown here." : "Your own learner record."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: rows.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChildCard, { student: s }, s.id))
		}),
		!students.isLoading && !rows.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No linked student record found yet." })
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Students",
		description: "Learner register. Teachers see only students in their assigned classes."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-4 sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: "Search by name or admission number",
			className: "mb-4 max-w-sm"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overflow-x-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2",
							children: "Adm. no"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2",
							children: "Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2",
							children: "Class"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2",
							children: "Gender"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2",
							children: "Profile"
						}),
						hasRole("teacher") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2",
							children: "Teacher remark"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2 font-mono text-xs",
							children: s.admission_no
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2 font-medium",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								className: "text-primary hover:underline",
								to: "/portal/students/$studentId",
								params: { studentId: s.id },
								children: fullName(s)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "p-2",
							children: [s.classes?.name ?? "—", s.classes?.section ? ` — ${s.classes.section}` : ""]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2 capitalize",
							children: s.gender ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: s.status === "active" ? "default" : "secondary",
								children: s.status
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/portal/students/$studentId",
									params: { studentId: s.id },
									children: "View Profile"
								})
							})
						}),
						hasRole("teacher") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RemarkBox, {
								studentId: s.id,
								onSave: (remark) => addRemark.mutate({
									studentId: s.id,
									remark
								}),
								disabled: addRemark.isPending
							})
						})
					]
				}, s.id)) })]
			}), !students.isLoading && !rows.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No students found." })]
		})]
	}) })] });
}
function ChildCard({ student: s }) {
	const [photoUrl, setPhotoUrl] = (0, import_react.useState)(null);
	const remarks = useQuery({
		queryKey: ["remarks", s.id],
		queryFn: async () => {
			const { data, error } = await supabase.from("student_remarks").select("id,remark,created_at,teacher:teacher_id(first_name,last_name)").eq("student_id", s.id).order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	useQuery({
		queryKey: [
			"student-card-photo",
			s.id,
			s.photo_url
		],
		enabled: Boolean(s.photo_url),
		queryFn: async () => {
			const { data } = await supabase.storage.from("student-photos").createSignedUrl(s.photo_url, 3600);
			setPhotoUrl(data?.signedUrl ?? null);
			return data?.signedUrl ?? null;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid size-16 shrink-0 place-items-center overflow-hidden rounded-full border bg-muted",
				children: photoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: photoUrl,
					alt: `${fullName(s)} profile`,
					className: "size-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-7 text-muted-foreground" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: fullName(s) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						s.admission_no,
						" · ",
						s.classes?.name ?? "Class not assigned"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/portal/students/$studentId",
					params: { studentId: s.id },
					children: "View Profile"
				})
			})
		]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: "font-semibold",
		children: "Teacher remarks"
	}), remarks.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-3 space-y-2",
		children: remarks.data.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg bg-secondary/60 p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: r.remark
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: [
					fullName(r.teacher),
					" · ",
					new Date(r.created_at).toLocaleDateString()
				]
			})]
		}, r.id))
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-sm text-muted-foreground",
		children: "No teacher remarks yet."
	})] })] });
}
function RemarkBox({ studentId, onSave, disabled }) {
	const [remark, setRemark] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-56 space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
			value: remark,
			onChange: (e) => setRemark(e.target.value),
			rows: 2,
			placeholder: "Write a professional remark…"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "sm",
			disabled: !remark.trim() || disabled,
			onClick: () => {
				onSave(remark.trim());
				setRemark("");
			},
			children: "Save remark"
		})]
	});
}
//#endregion
export { StudentsLayout as component };

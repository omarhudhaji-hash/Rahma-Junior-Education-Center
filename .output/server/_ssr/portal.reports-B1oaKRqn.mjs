import { n as supabase } from "./client-B2gFRfJz.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-DqeHYMZd.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./use-auth-BfiWx6iO.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { $ as ChartColumn, A as Package, H as FileText, V as GraduationCap, W as Download, c as UserPlus, i as Users, n as Wallet, nt as CalendarDays, q as ClipboardCheck, w as Printer } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as PageHeader } from "./page-header-D2pXXqT-.mjs";
import { t as Badge } from "./badge-CCuYWPBQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.reports-B1oaKRqn.js
var import_jsx_runtime = require_jsx_runtime();
var reports = [
	{
		title: "Student Register",
		description: "Active learners, admission numbers and class placement.",
		icon: GraduationCap,
		href: "/portal/students"
	},
	{
		title: "Attendance Report",
		description: "Review attendance records and identify attendance concerns.",
		icon: ClipboardCheck,
		href: "/portal/attendance"
	},
	{
		title: "Finance & Balances",
		description: "Review invoices, payments and outstanding balances.",
		icon: Wallet,
		href: "/portal/finance"
	},
	{
		title: "Academic Records",
		description: "Open marks, results and academic performance records.",
		icon: ChartColumn,
		href: "/portal/academic"
	},
	{
		title: "Admissions Report",
		description: "Track admission workflow and recently admitted learners.",
		icon: UserPlus,
		href: "/portal/admissions"
	},
	{
		title: "Parent Directory",
		description: "Family records, children and portal status.",
		icon: Users,
		href: "/portal/parents"
	},
	{
		title: "Inventory Report",
		description: "Stock levels and school shop inventory.",
		icon: Package,
		href: "/portal/inventory"
	},
	{
		title: "School Calendar",
		description: "Upcoming events, examinations and important dates.",
		icon: CalendarDays,
		href: "/portal/calendar"
	}
];
function ReportsPage() {
	const { isAdmin } = useMe();
	const s = useQuery({
		queryKey: ["reports-summary"],
		queryFn: async () => {
			const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			const [students, parents, teachers, classes, present, invoices, payments, exams] = await Promise.all([
				supabase.from("students").select("id", {
					count: "exact",
					head: true
				}),
				supabase.from("admission_families").select("id", {
					count: "exact",
					head: true
				}),
				supabase.from("user_roles").select("user_id", {
					count: "exact",
					head: true
				}).eq("role", "teacher"),
				supabase.from("classes").select("id", {
					count: "exact",
					head: true
				}),
				supabase.from("attendance_records").select("id", {
					count: "exact",
					head: true
				}).eq("attendance_date", today).eq("status", "present"),
				supabase.from("invoices").select("amount,status"),
				supabase.from("payments").select("amount"),
				supabase.from("exams").select("id", {
					count: "exact",
					head: true
				}).gte("starts_on", today)
			]);
			const billed = (invoices.data ?? []).reduce((n, x) => n + Number(x.amount || 0), 0);
			const paid = (payments.data ?? []).reduce((n, x) => n + Number(x.amount || 0), 0);
			return {
				students: students.count ?? 0,
				parents: parents.count ?? 0,
				teachers: teachers.count ?? 0,
				classes: classes.count ?? 0,
				present: present.count ?? 0,
				billed,
				paid,
				balance: Math.max(0, billed - paid),
				exams: exams.count ?? 0
			};
		}
	}).data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Reports Center",
			description: "A professional reporting hub for school management. Existing modules remain the source of truth; these shortcuts bring the key reports together.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 print:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => window.print(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-2 size-4" }), "Print"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => window.print(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 size-4" }), "Export / Save PDF"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6 overflow-hidden border-primary/20 bg-primary/[0.035]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-5 text-primary" }), "Management snapshot"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Live figures from the current school records." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Students",
						value: s?.students ?? 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Families",
						value: s?.parents ?? 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Teachers",
						value: s?.teachers ?? 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Classes",
						value: s?.classes ?? 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Present today",
						value: s?.present ?? 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Upcoming exams",
						value: s?.exams ?? 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Collected",
						value: `KSh ${Math.round(s?.paid ?? 0).toLocaleString()}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Outstanding",
						value: `KSh ${Math.round(s?.balance ?? 0).toLocaleString()}`
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-bold text-navy",
				children: "Available reports"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Open a module, apply its filters, then print or export the result."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "secondary",
				children: isAdmin ? "Administrator" : "Headteacher"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
			children: reports.map((r) => {
				const Icon = r.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "group transition hover:-translate-y-0.5 hover:shadow-panel",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 grid size-10 place-items-center rounded-xl bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: r.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: r.description })
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "w-full",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: r.href,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mr-2 size-4" }), "Open report"]
						})
					}) })]
				}, r.title);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 rounded-xl border border-dashed p-4 text-sm text-muted-foreground print:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
				className: "text-foreground",
				children: "Tip:"
			}), " Use your browser's Print → Save as PDF for a clean client-ready copy of the current report page. Existing module exports remain unchanged."]
		})
	] });
}
function Metric({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border bg-background p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] font-bold uppercase tracking-brand text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-xl font-extrabold text-navy",
			children: value
		})]
	});
}
//#endregion
export { ReportsPage as component };

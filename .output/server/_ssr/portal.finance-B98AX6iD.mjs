import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { a as fullName, l as money } from "./school-CK2M8GiK.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./use-auth-BfiWx6iO.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { C as Printer, H as FilePlusCorner, K as CreditCard, S as Receipt, V as FileText, a as UsersRound, r as WalletCards, y as Search } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-BG-idtzq.mjs";
import { t as Label } from "./label-BsoyNsWq.mjs";
import { t as Textarea } from "./textarea-lY6r0rtj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader, t as EmptyState } from "./page-header-D2pXXqT-.mjs";
import { t as Badge } from "./badge-CCuYWPBQ.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-B70CjJ0u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.finance-B98AX6iD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FinancePage() {
	const { userId, isAdmin, isLeadership, hasRole } = useMe();
	const family = hasRole("parent") || hasRole("student");
	const qc = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const [section, setSection] = (0, import_react.useState)("overview");
	const children = useQuery({
		queryKey: ["finance-children", userId],
		enabled: family,
		queryFn: async () => {
			if (hasRole("parent")) {
				const { data: ps, error: pe } = await supabase.from("parent_student").select("student_id").eq("parent_id", userId);
				if (pe) throw pe;
				const ids = (ps ?? []).map((x) => x.student_id);
				if (!ids.length) return [];
				const { data, error } = await supabase.from("students").select("id,first_name,last_name,admission_no").in("id", ids);
				if (error) throw error;
				return data ?? [];
			}
			const { data, error } = await supabase.from("students").select("id,first_name,last_name,admission_no").eq("user_id", userId);
			if (error) throw error;
			return data ?? [];
		}
	});
	const schoolFinance = useQuery({
		queryKey: [
			"finance-school-v2",
			isAdmin,
			isLeadership
		],
		enabled: !family,
		queryFn: async () => {
			const [{ data: inv, error: ie }, { data: pay, error: pe }, { data: students, error: se }, { data: ps, error: pse }] = await Promise.all([
				supabase.from("invoices").select("id,student_id,invoice_no,amount,base_amount,discount_amount,discount_reason,status,due_date,created_at"),
				supabase.from("payments").select("id,student_id,amount,method,receipt_no,transaction_reference,paid_at"),
				supabase.from("students").select("id,first_name,last_name,admission_no,current_class_id"),
				supabase.from("parent_student").select("parent_id,student_id")
			]);
			if (ie || pe || se || pse) throw ie || pe || se || pse;
			const by = /* @__PURE__ */ new Map();
			(students ?? []).forEach((s) => by.set(s.id, {
				...s,
				billed: 0,
				paid: 0,
				discounts: 0
			}));
			(inv ?? []).forEach((i) => {
				const r = by.get(i.student_id);
				if (r) {
					r.billed += Number(i.amount);
					r.discounts += Number(i.discount_amount ?? 0);
				}
			});
			(pay ?? []).forEach((p) => {
				const r = by.get(p.student_id);
				if (r) r.paid += Number(p.amount);
			});
			const parentMap = /* @__PURE__ */ new Map();
			(ps ?? []).forEach((x) => parentMap.set(x.student_id, x.parent_id));
			return {
				rows: [...by.values()].map((r) => ({
					...r,
					balance: Math.max(0, r.billed - r.paid),
					parent_id: parentMap.get(r.id)
				})),
				received: (pay ?? []).reduce((x, p) => x + Number(p.amount), 0),
				billed: (inv ?? []).reduce((x, p) => x + Number(p.amount), 0),
				discounts: (inv ?? []).reduce((x, p) => x + Number(p.discount_amount ?? 0), 0),
				invoices: inv ?? [],
				payments: pay ?? []
			};
		}
	});
	const mpesaPay = useMutation({
		mutationFn: async ({ studentId, amount, phone }) => {
			const { data, error } = await supabase.functions.invoke("mpesa-stk", { body: {
				studentId,
				amount,
				phone
			} });
			if (error) throw error;
			if (data?.error) throw new Error(data.error);
			return data;
		},
		onSuccess: () => {
			toast.success("M-Pesa payment request sent. Complete it on your phone.");
			qc.invalidateQueries({ queryKey: ["finance-children"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "M-Pesa request failed")
	});
	if (family) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FamilyFinance, {
		children: children.data ?? [],
		paying: mpesaPay.isPending,
		onPay: (studentId, amount, phone) => mpesaPay.mutate({
			studentId,
			amount,
			phone
		})
	});
	const filtered = (schoolFinance.data?.rows ?? []).filter((r) => {
		const q = search.toLowerCase().trim();
		return !q || `${r.first_name} ${r.last_name} ${r.admission_no}`.toLowerCase().includes(q);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Finance",
				description: isAdmin ? "Manage fee structures, family discounts, invoices, payments and receipts." : "View outstanding school fee balances."
			}),
			isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							title: "Total billed",
							value: money(schoolFinance.data?.billed ?? 0),
							icon: WalletCards
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							title: "Collected",
							value: money(schoolFinance.data?.received ?? 0),
							icon: CreditCard
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							title: "Outstanding",
							value: money(Math.max(0, (schoolFinance.data?.billed ?? 0) - (schoolFinance.data?.received ?? 0))),
							icon: Receipt
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							title: "Discounts",
							value: money(schoolFinance.data?.discounts ?? 0),
							icon: UsersRound
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						"overview",
						"fees",
						"payments",
						"discounts"
					].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: section === x ? "default" : "outline",
						onClick: () => setSection(x),
						children: x === "overview" ? "Overview" : x === "fees" ? "Fee Structures & Invoices" : x === "payments" ? "Payments & Receipts" : "Family Discounts"
					}, x))
				}),
				section === "fees" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFees, {}),
				section === "payments" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPayments, {}),
				section === "discounts" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDiscounts, {})
			] }),
			!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: "Headteacher finance view"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Only outstanding balances are shown. Finance administration and payment recording remain restricted to the Director."
				})]
			}) }),
			(section === "overview" || !isAdmin) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" }), " Student balances"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: search,
				onChange: (e) => setSearch(e.target.value),
				placeholder: "Search student or admission number"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 space-y-3",
				children: [filtered.filter((r) => isAdmin || r.balance > 0).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: fullName(r)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: r.admission_no
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs",
							children: [
								"Billed ",
								money(r.billed),
								" · Paid ",
								money(r.paid)
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: r.balance > 0 ? "destructive" : "secondary",
						children: r.balance > 0 ? `Balance ${money(r.balance)}` : "Paid"
					})]
				}, r.id)), !filtered.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No students found." })]
			})] })] })
		]
	});
}
function AdminFees() {
	const qc = useQueryClient();
	const [classId, setClassId] = (0, import_react.useState)("");
	const [item, setItem] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [term, setTerm] = (0, import_react.useState)("Term 1");
	const [due, setDue] = (0, import_react.useState)("");
	const [studentId, setStudentId] = (0, import_react.useState)("");
	const [feeId, setFeeId] = (0, import_react.useState)("");
	const classes = useQuery({
		queryKey: ["finance-classes"],
		queryFn: async () => {
			const { data, error } = await supabase.from("classes").select("id,name,section").order("name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const fees = useQuery({
		queryKey: ["fee-structures"],
		queryFn: async () => {
			const { data, error } = await supabase.from("fee_structures").select("id,item_name,amount,term,due_date,class_id,classes(name,section)").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const students = useQuery({
		queryKey: ["finance-students"],
		queryFn: async () => {
			const { data, error } = await supabase.from("students").select("id,first_name,last_name,admission_no,current_class_id").order("first_name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const createFee = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("fee_structures").insert({
				class_id: classId || null,
				item_name: item,
				amount: Number(amount),
				term,
				due_date: due || null
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Fee structure created");
			setItem("");
			setAmount("");
			setDue("");
			qc.invalidateQueries({ queryKey: ["fee-structures"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not create fee")
	});
	const createInvoice = useMutation({
		mutationFn: async () => {
			const f = (fees.data ?? []).find((x) => x.id === feeId);
			if (!f) throw new Error("Select a fee structure");
			const gross = Number(f.amount);
			const { data: disc, error: de } = await supabase.rpc("calculate_family_discount", {
				_student_id: studentId,
				_base_amount: gross
			});
			if (de) throw de;
			const d = Array.isArray(disc) ? disc[0] : disc;
			const discount = Number(d?.discount_amount ?? 0);
			const { error } = await supabase.from("invoices").insert({
				student_id: studentId,
				fee_structure_id: feeId,
				base_amount: gross,
				discount_amount: discount,
				discount_reason: d?.discount_reason ?? null,
				amount: Math.max(0, gross - discount),
				due_date: f.due_date || null,
				status: "unpaid"
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Invoice created with applicable family discount");
			qc.invalidateQueries({ queryKey: ["finance-school-v2"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not create invoice")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 xl:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePlusCorner, { className: "size-4" }), " Create fee structure"]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: classId,
					onValueChange: setClassId,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Class (optional)" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (classes.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
						value: c.id,
						children: [c.name, c.section ? ` — ${c.section}` : ""]
					}, c.id)) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Fee item e.g. Tuition",
					value: item,
					onChange: (e) => setItem(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: term,
					onValueChange: setTerm,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
						"Term 1",
						"Term 2",
						"Term 3"
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: t,
						children: t
					}, t)) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					min: "0",
					placeholder: "Amount (KSh)",
					value: amount,
					onChange: (e) => setAmount(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "date",
					value: due,
					onChange: (e) => setDue(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					disabled: !item || Number(amount) <= 0 || createFee.isPending,
					onClick: () => createFee.mutate(),
					children: "Create fee structure"
				})
			]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Create student invoice" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Automatic family/sibling discount is calculated when the invoice is created."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: studentId,
					onValueChange: setStudentId,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select student" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (students.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
						value: s.id,
						children: [
							fullName(s),
							" · ",
							s.admission_no
						]
					}, s.id)) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: feeId,
					onValueChange: setFeeId,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select fee structure" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (fees.data ?? []).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
						value: f.id,
						children: [
							f.item_name,
							" · ",
							money(f.amount),
							" · ",
							f.term ?? "No term"
						]
					}, f.id)) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					disabled: !studentId || !feeId || createInvoice.isPending,
					onClick: () => createInvoice.mutate(),
					children: "Create invoice & apply discount"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t pt-4 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: "Existing fee structures"
					}), (fees.data ?? []).slice(0, 8).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded border p-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: f.item_name }),
							" · ",
							money(f.amount),
							" · ",
							f.term ?? "",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [f.classes?.name ?? "All classes", f.due_date ? ` · Due ${f.due_date}` : ""]
							})
						]
					}, f.id))]
				})
			]
		})] })]
	});
}
function AdminPayments() {
	const qc = useQueryClient();
	const [studentId, setStudentId] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [method, setMethod] = (0, import_react.useState)("cash");
	const [reference, setReference] = (0, import_react.useState)("");
	const students = useQuery({
		queryKey: ["finance-students-payments"],
		queryFn: async () => {
			const { data, error } = await supabase.from("students").select("id,first_name,last_name,admission_no").order("first_name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const payments = useQuery({
		queryKey: ["finance-payments"],
		queryFn: async () => {
			const { data, error } = await supabase.from("payments").select("id,student_id,amount,method,receipt_no,transaction_reference,paid_at,students(first_name,last_name,admission_no,current_class_id)").order("paid_at", { ascending: false }).limit(30);
			if (error) throw error;
			return data ?? [];
		}
	});
	const invoices = useQuery({
		queryKey: ["finance-invoices-receipts"],
		queryFn: async () => {
			const { data, error } = await supabase.from("invoices").select("id,student_id,invoice_no,amount,base_amount,discount_amount,discount_reason,status,due_date,created_at,fee_structure_id,fee_structures(item_name,term)").order("created_at", { ascending: false }).limit(100);
			if (error) throw error;
			return data ?? [];
		}
	});
	const addPayment = useMutation({
		mutationFn: async () => {
			const { data: session } = await supabase.auth.getSession();
			const { error } = await supabase.from("payments").insert({
				student_id: studentId,
				amount: Number(amount),
				method,
				transaction_reference: reference || null,
				received_by: session.session?.user.id ?? null
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Payment recorded and receipt generated");
			setAmount("");
			setReference("");
			qc.invalidateQueries({ queryKey: ["finance-payments"] });
			qc.invalidateQueries({ queryKey: ["finance-school-v2"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not record payment")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 xl:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Record payment" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: studentId,
					onValueChange: setStudentId,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select student" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (students.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
						value: s.id,
						children: [
							fullName(s),
							" · ",
							s.admission_no
						]
					}, s.id)) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					min: "1",
					placeholder: "Amount (KSh)",
					value: amount,
					onChange: (e) => setAmount(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: method,
					onValueChange: setMethod,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
						"cash",
						"mpesa",
						"bank",
						"card",
						"other"
					].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: m,
						children: m.toUpperCase()
					}, m)) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Transaction/reference number (optional)",
					value: reference,
					onChange: (e) => setReference(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full",
					disabled: !studentId || Number(amount) <= 0 || addPayment.isPending,
					onClick: () => addPayment.mutate(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "mr-2 size-4" }), "Record payment"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "A unique receipt number is generated automatically by Supabase."
				})
			]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Recent payments" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-2",
			children: [(payments.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded border p-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: fullName(p.students) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						p.receipt_no,
						" · ",
						p.method,
						" · ",
						p.transaction_reference ?? "No reference"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: money(p.amount) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: new Date(p.paid_at).toLocaleDateString()
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => printReceipt(p, invoices.data ?? []),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-2 size-4" }), "Receipt"]
					})]
				})]
			}, p.id)), !payments.data?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No payments recorded yet." })]
		})] })]
	});
}
function AdminDiscounts() {
	const qc = useQueryClient();
	const [name, setName] = (0, import_react.useState)("");
	const [minChildren, setMinChildren] = (0, import_react.useState)("2");
	const [percent, setPercent] = (0, import_react.useState)("");
	const [parentId, setParentId] = (0, import_react.useState)("");
	const [studentId, setStudentId] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("percent");
	const [value, setValue] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const parents = useQuery({
		queryKey: ["finance-parents"],
		queryFn: async () => {
			const { data: ps, error: pe } = await supabase.from("parent_student").select("parent_id");
			if (pe) throw pe;
			const ids = [...new Set((ps ?? []).map((x) => x.parent_id))];
			if (!ids.length) return [];
			const { data, error } = await supabase.from("profiles").select("id,first_name,last_name,email,phone").in("id", ids);
			if (error) throw error;
			return data ?? [];
		}
	});
	const students = useQuery({
		queryKey: ["finance-students-discounts"],
		queryFn: async () => {
			const { data, error } = await supabase.from("students").select("id,first_name,last_name,admission_no").order("first_name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const rules = useQuery({
		queryKey: ["discount-rules"],
		queryFn: async () => {
			const { data, error } = await supabase.from("family_discount_rules").select("*").order("min_children", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const discounts = useQuery({
		queryKey: ["family-discounts"],
		queryFn: async () => {
			const { data, error } = await supabase.from("family_discounts").select("*").order("created_at", { ascending: false }).limit(30);
			if (error) throw error;
			return data ?? [];
		}
	});
	const createRule = useMutation({
		mutationFn: async () => {
			const { data: session } = await supabase.auth.getSession();
			const { error } = await supabase.from("family_discount_rules").insert({
				name,
				min_children: Number(minChildren),
				discount_percent: Number(percent),
				created_by: session.session?.user.id ?? null
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Automatic family discount rule saved");
			setName("");
			setPercent("");
			qc.invalidateQueries({ queryKey: ["discount-rules"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save rule")
	});
	const createManual = useMutation({
		mutationFn: async () => {
			const { data: session } = await supabase.auth.getSession();
			const { error } = await supabase.from("family_discounts").insert({
				parent_id: parentId,
				student_id: studentId && studentId !== "all" ? studentId : null,
				discount_type: type,
				value: Number(value),
				reason,
				approved_by: session.session?.user.id ?? null
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Manual family discount saved");
			setValue("");
			setReason("");
			qc.invalidateQueries({ queryKey: ["family-discounts"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save discount")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 xl:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Automatic sibling discount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "The highest matching active rule is applied automatically when an invoice is created."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Rule name e.g. 3 children discount",
						value: name,
						onChange: (e) => setName(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: "2",
						value: minChildren,
						onChange: (e) => setMinChildren(e.target.value),
						placeholder: "Minimum active children"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: "0",
						max: "100",
						value: percent,
						onChange: (e) => setPercent(e.target.value),
						placeholder: "Discount percentage"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						disabled: !name || Number(percent) <= 0 || createRule.isPending,
						onClick: () => createRule.mutate(),
						children: "Save automatic rule"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t pt-3 space-y-2",
						children: (rules.data ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded border p-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: r.name }),
								" · ",
								r.discount_percent,
								"%",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										r.min_children,
										"+ children · ",
										r.is_active ? "Active" : "Inactive"
									]
								})
							]
						}, r.id))
					})
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Manual family/student discount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Use for scholarships, special arrangements or other approved discounts."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: parentId,
						onValueChange: setParentId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Parent / family" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (parents.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: p.id,
							children: [
								fullName(p),
								" · ",
								p.phone ?? p.email ?? ""
							]
						}, p.id)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: studentId,
						onValueChange: setStudentId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Apply to all children (or select one)" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All children"
						}), (students.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: s.id,
							children: [
								fullName(s),
								" · ",
								s.admission_no
							]
						}, s.id))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: type,
						onValueChange: setType,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "percent",
							children: "Percentage"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "fixed",
							children: "Fixed amount"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: "0",
						value,
						onChange: (e) => setValue(e.target.value),
						placeholder: type === "percent" ? "Discount %" : "Discount amount (KSh)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: reason,
						onChange: (e) => setReason(e.target.value),
						placeholder: "Reason / approval note"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						disabled: !parentId || !reason || Number(value) <= 0 || createManual.isPending,
						onClick: () => createManual.mutate(),
						children: "Save manual discount"
					})
				]
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Discount audit trail" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-2",
			children: [(discounts.data ?? []).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded border p-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: d.discount_type === "percent" ? `${d.value}%` : money(d.value) }),
					" · ",
					d.reason,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: ["Created ", new Date(d.created_at).toLocaleString()]
					})
				]
			}, d.id)), !discounts.data?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No manual discounts recorded yet." })]
		})] })]
	});
}
function FamilyFinance({ children, paying, onPay }) {
	const [amounts, setAmounts] = (0, import_react.useState)({});
	const [phone, setPhone] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)("");
	const details = useQuery({
		queryKey: ["family-finance-details-v2", children.map((c) => c.id).join(",")],
		enabled: children.length > 0,
		queryFn: async () => {
			const ids = children.map((c) => c.id);
			const [{ data: inv }, { data: pay }] = await Promise.all([supabase.from("invoices").select("student_id,invoice_no,amount,base_amount,discount_amount,discount_reason,status,due_date").in("student_id", ids), supabase.from("payments").select("student_id,receipt_no,amount,method,transaction_reference,paid_at").in("student_id", ids).order("paid_at", { ascending: false })]);
			return children.map((c) => ({
				...c,
				invoices: (inv ?? []).filter((i) => i.student_id === c.id),
				payments: (pay ?? []).filter((p) => p.student_id === c.id),
				billed: (inv ?? []).filter((i) => i.student_id === c.id).reduce((s, i) => s + Number(i.amount), 0),
				discounts: (inv ?? []).filter((i) => i.student_id === c.id).reduce((s, i) => s + Number(i.discount_amount ?? 0), 0),
				paid: (pay ?? []).filter((p) => p.student_id === c.id).reduce((s, p) => s + Number(p.amount), 0)
			}));
		}
	});
	const familyTotals = (0, import_react.useMemo)(() => {
		const rows = details.data ?? [];
		return {
			billed: rows.reduce((s, x) => s + x.billed, 0),
			paid: rows.reduce((s, x) => s + x.paid, 0),
			discounts: rows.reduce((s, x) => s + x.discounts, 0)
		};
	}, [details.data]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "My Finance",
				description: "Family fees, discounts, balances, receipts and M-Pesa payments."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-wrap items-center justify-between gap-4 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid flex-1 gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Family billed"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: money(familyTotals.billed) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Family discounts"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: money(familyTotals.discounts) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Family paid"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: money(familyTotals.paid) })] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => printFamilyStatement(details.data ?? []),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mr-2 size-4" }), "Print family statement"]
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [(details.data ?? []).map((c) => {
					const bal = Math.max(0, c.billed - c.paid);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: fullName(c) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: c.admission_no
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Due"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: money(c.billed) })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Discounts"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: money(c.discounts) })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Balance"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
										className: "text-destructive",
										children: money(bal)
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-sm",
									children: "Fee statement"
								}), c.invoices.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded border p-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: i.invoice_no }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: money(i.amount) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: () => printStatement(c, [i], c.payments),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-1 size-4" }), "Print"]
											})]
										})]
									}), Number(i.discount_amount) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											"Original ",
											money(i.base_amount),
											" · Discount ",
											money(i.discount_amount),
											i.discount_reason ? ` · ${i.discount_reason}` : ""
										]
									})]
								}, i.invoice_no))]
							}),
							bal > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 border-t pt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pay with M-Pesa" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: "1",
										max: bal,
										value: amounts[c.id] ?? "",
										onChange: (e) => setAmounts((a) => ({
											...a,
											[c.id]: e.target.value
										})),
										placeholder: `Amount up to ${money(bal)}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										inputMode: "tel",
										value: selected === c.id ? phone : "",
										onChange: (e) => {
											setSelected(c.id);
											setPhone(e.target.value);
										},
										placeholder: "M-Pesa phone e.g. 0712345678"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "w-full",
										disabled: paying || Number(amounts[c.id] ?? 0) <= 0 || Number(amounts[c.id] ?? 0) > bal,
										onClick: () => onPay(c.id, Number(amounts[c.id]), phone),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "mr-2 size-4" }), paying ? "Requesting…" : "Pay with M-Pesa"]
									})
								]
							}),
							c.payments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-sm",
									children: "Recent receipts"
								}), c.payments.slice(0, 5).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex justify-between rounded border p-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										p.receipt_no,
										" · ",
										p.method
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: money(p.amount) })]
								}, p.receipt_no))]
							})
						]
					})] }, c.id);
				}), !details.data?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No linked children found." })]
			})
		]
	});
}
function printWindow(title, body) {
	const w = window.open("", "_blank", "width=900,height=700");
	if (!w) {
		toast.error("Please allow pop-ups to print the document.");
		return;
	}
	w.document.write(`<!doctype html><html><head><title>${title}</title><style>
  body{font-family:Arial,Helvetica,sans-serif;color:#172033;margin:0;padding:32px;background:#fff} .sheet{max-width:820px;margin:auto}
  .brand{border-bottom:3px solid #172033;padding-bottom:16px;margin-bottom:24px}.brand h1{margin:0;font-size:25px}.brand p{margin:5px 0;color:#667085;font-size:12px}
  h2{margin:0 0 6px}.meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:18px 0 24px}.meta div{padding:10px;background:#f5f7fa;border-radius:6px;font-size:13px}
  table{width:100%;border-collapse:collapse;margin-top:16px}th,td{border-bottom:1px solid #dfe3e8;padding:10px 8px;text-align:left;font-size:13px}th{background:#f5f7fa}
  .num{text-align:right}.totals{margin:22px 0 0 auto;width:320px}.row{display:flex;justify-content:space-between;padding:7px 0}.grand{border-top:2px solid #172033;font-size:17px;font-weight:700;margin-top:6px;padding-top:10px}
  .note{margin-top:20px;padding:12px;background:#f8fafc;border-left:3px solid #172033;font-size:12px}.footer{margin-top:50px;display:flex;justify-content:space-between;font-size:11px;color:#667085}.sign{border-top:1px solid #555;width:220px;padding-top:7px;margin-top:45px}
  @media print{body{padding:0}.no-print{display:none!important}}
  </style></head><body><div class="sheet">${body}</div><script>window.onload=()=>{setTimeout(()=>window.print(),250)}<\/script></body></html>`);
	w.document.close();
}
function printStatement(student, invoices, payments) {
	const gross = invoices.reduce((s, i) => s + Number(i.base_amount ?? i.amount ?? 0), 0);
	const discounts = invoices.reduce((s, i) => s + Number(i.discount_amount ?? 0), 0);
	const billed = invoices.reduce((s, i) => s + Number(i.amount ?? 0), 0);
	const paid = payments.reduce((s, p) => s + Number(p.amount ?? 0), 0);
	const balance = Math.max(0, billed - paid);
	const rows = invoices.map((i) => `<tr><td>${i.invoice_no}</td><td>${i.fee_structures?.item_name ?? "School fees"}</td><td>${i.fee_structures?.term ?? ""}</td><td>${i.due_date ?? "—"}</td><td class="num">${money(i.base_amount ?? i.amount)}</td><td class="num">${money(i.discount_amount ?? 0)}</td><td class="num">${money(i.amount)}</td></tr>`).join("");
	const pays = payments.map((p) => `<tr><td>${new Date(p.paid_at).toLocaleDateString()}</td><td>${p.receipt_no}</td><td>${String(p.method).toUpperCase()}</td><td>${p.transaction_reference ?? "—"}</td><td class="num">${money(p.amount)}</td></tr>`).join("");
	printWindow("Fee Statement", `<div class="brand"><h1>${school.name.toUpperCase()}</h1><p>OFFICIAL FEE STATEMENT</p></div><h2>Fee Statement</h2><div class="meta"><div><b>Student</b><br>${fullName(student)}</div><div><b>Admission No.</b><br>${student.admission_no ?? "—"}</div><div><b>Statement Date</b><br>${(/* @__PURE__ */ new Date()).toLocaleDateString()}</div><div><b>Status</b><br>${balance > 0 ? "Outstanding balance" : "Paid in full"}</div></div><table><thead><tr><th>Invoice</th><th>Fee item</th><th>Term</th><th>Due</th><th class="num">Original</th><th class="num">Discount</th><th class="num">Charged</th></tr></thead><tbody>${rows || "<tr><td colspan=\"7\">No invoices</td></tr>"}</tbody></table><div class="totals"><div class="row"><span>Original fees</span><b>${money(gross)}</b></div><div class="row"><span>Total discounts</span><b>${money(discounts)}</b></div><div class="row"><span>Total charged</span><b>${money(billed)}</b></div><div class="row"><span>Total paid</span><b>${money(paid)}</b></div><div class="row grand"><span>Balance</span><span>${money(balance)}</span></div></div><h3 style="margin-top:34px">Payment history</h3><table><thead><tr><th>Date</th><th>Receipt</th><th>Method</th><th>Reference</th><th class="num">Amount</th></tr></thead><tbody>${pays || "<tr><td colspan=\"5\">No payments recorded</td></tr>"}</tbody></table><div class="footer"><span>Generated ${(/* @__PURE__ */ new Date()).toLocaleString()}</span><span>This statement is computer generated.</span></div>`);
}
function printFamilyStatement(families) {
	const allInvoices = families.flatMap((c) => c.invoices ?? []);
	const allPayments = families.flatMap((c) => c.payments ?? []);
	const gross = allInvoices.reduce((s, i) => s + Number(i.base_amount ?? i.amount ?? 0), 0);
	const discounts = allInvoices.reduce((s, i) => s + Number(i.discount_amount ?? 0), 0);
	const billed = allInvoices.reduce((s, i) => s + Number(i.amount ?? 0), 0);
	const paid = allPayments.reduce((s, p) => s + Number(p.amount ?? 0), 0);
	const rows = families.flatMap((c) => (c.invoices ?? []).map((i) => `<tr><td>${fullName(c)}</td><td>${i.invoice_no}</td><td>${i.fee_structures?.item_name ?? "School fees"}</td><td class="num">${money(i.amount)}</td></tr>`)).join("");
	printWindow("Family Fee Statement", `<div class="brand"><h1>${school.name.toUpperCase()}</h1><p>OFFICIAL FAMILY FEE STATEMENT</p></div><h2>Family Fee Statement</h2><div class="meta"><div><b>Children</b><br>${families.length}</div><div><b>Statement Date</b><br>${(/* @__PURE__ */ new Date()).toLocaleDateString()}</div></div><table><thead><tr><th>Student</th><th>Invoice</th><th>Fee item</th><th class="num">Charged</th></tr></thead><tbody>${rows || "<tr><td colspan=\"4\">No invoices</td></tr>"}</tbody></table><div class="totals"><div class="row"><span>Original fees</span><b>${money(gross)}</b></div><div class="row"><span>Total discounts</span><b>${money(discounts)}</b></div><div class="row"><span>Total charged</span><b>${money(billed)}</b></div><div class="row"><span>Total paid</span><b>${money(paid)}</b></div><div class="row grand"><span>Family balance</span><span>${money(Math.max(0, billed - paid))}</span></div></div><div class="footer"><span>Generated ${(/* @__PURE__ */ new Date()).toLocaleString()}</span><span>This statement is computer generated.</span></div>`);
}
function printReceipt(payment, invoices) {
	const student = payment.students ?? {};
	const related = invoices.filter((i) => i.student_id === payment.student_id);
	const billed = related.reduce((s, i) => s + Number(i.amount ?? 0), 0);
	Math.max(0, related.length ? billed : 0);
	const body = `<div class="brand"><h1>${school.name.toUpperCase()}</h1><p>OFFICIAL PAYMENT RECEIPT</p></div><div class="meta"><div><b>Receipt No.</b><br>${payment.receipt_no}</div><div><b>Payment Date</b><br>${new Date(payment.paid_at).toLocaleString()}</div><div><b>Student</b><br>${fullName(student)}</div><div><b>Admission No.</b><br>${student.admission_no ?? "—"}</div></div><table><tbody><tr><th>Payment method</th><td>${String(payment.method).toUpperCase()}</td></tr><tr><th>Transaction / Reference</th><td>${payment.transaction_reference ?? "—"}</td></tr><tr><th>Amount received</th><td class="num"><b>${money(payment.amount)}</b></td></tr></tbody></table><div class="note">Payment received and recorded in the school finance system. Please retain this receipt for your records.</div><div class="footer"><div class="sign">Authorized by</div><div>Receipt No. ${payment.receipt_no}</div></div>`;
	printWindow(`Receipt ${payment.receipt_no}`, body);
}
function Stat({ title, value, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-brand text-muted-foreground",
				children: title
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xl font-extrabold text-navy",
			children: value
		})]
	}) });
}
//#endregion
export { FinancePage as component };

import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { a as fullName } from "./school-BBKER8cz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./use-auth-BfiWx6iO.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { E as Plus, H as FileText, b as Search, w as Printer } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-CIJ7QuDk.mjs";
import { t as Label } from "./label-BsoyNsWq.mjs";
import { t as Textarea } from "./textarea-lY6r0rtj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader, t as EmptyState } from "./page-header-D2pXXqT-.mjs";
import { t as Badge } from "./badge-CCuYWPBQ.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-B70CjJ0u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.documents-Brl5RVsC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var types = [
	["official_letter", "Official Letter"],
	["admission_letter", "Admission Letter"],
	["transfer_letter", "Transfer Letter"],
	["clearance_letter", "Clearance / Exit Letter"],
	["fee_clearance", "Fee Clearance"],
	["character_reference", "Character Reference"],
	["other", "Other"]
];
function printDocument(doc, student) {
	const win = window.open("", "_blank", "noopener,noreferrer");
	if (!win) return;
	const safe = (value) => String(value ?? "").replace(/[&<>]/g, (c) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;"
	})[c] ?? c);
	win.document.write(`<!doctype html><html><head><title>${safe(doc.title)}</title><style>body{font-family:Arial,sans-serif;margin:50px;color:#172554}header{text-align:center;border-bottom:2px solid #172554;padding-bottom:18px;margin-bottom:30px}h1{margin:0;font-size:24px}h2{font-size:20px;margin-top:28px}.meta{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:20px 0;padding:16px;background:#f8fafc}.content{white-space:pre-wrap;line-height:1.7;min-height:260px}.footer{margin-top:60px;display:flex;justify-content:space-between;font-size:12px;color:#64748b}@media print{body{margin:25px}}</style></head><body><header><h1>RAHMA JUNIOR SCHOOL</h1><div>Official School Document</div></header><h2>${safe(doc.title)}</h2><div class="meta"><div><b>Document No.</b><br>${safe(doc.document_no)}</div><div><b>Issue Date</b><br>${(/* @__PURE__ */ new Date(`${doc.issue_date}T00:00:00`)).toLocaleDateString("en-KE")}</div><div><b>Student</b><br>${safe(fullName(student))}</div><div><b>Admission No.</b><br>${safe(student?.admission_no ?? "—")}</div></div><div class="content">${safe(doc.content)}</div><div class="footer"><span>Computer generated school document</span><span>${safe(doc.document_no)}</span></div><script>window.onload=()=>window.print()<\/script></body></html>`);
	win.document.close();
}
function DocumentsPage() {
	const { userId, hasRole, isLeadership } = useMe();
	const qc = useQueryClient();
	const [studentId, setStudentId] = import_react.useState("");
	const [type, setType] = import_react.useState("official_letter");
	const [title, setTitle] = import_react.useState("");
	const [issueDate, setIssueDate] = import_react.useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [content, setContent] = import_react.useState("");
	const [search, setSearch] = import_react.useState("");
	const students = useQuery({
		queryKey: [
			"document-students",
			userId,
			isLeadership,
			hasRole("parent"),
			hasRole("student")
		],
		queryFn: async () => {
			let ids = null;
			if (hasRole("parent")) {
				const { data, error } = await supabase.from("parent_student").select("student_id").eq("parent_id", userId);
				if (error) throw error;
				ids = (data ?? []).map((x) => x.student_id);
			} else if (hasRole("student")) ids = [userId];
			let q = supabase.from("students").select("id,first_name,last_name,admission_no,current_class_id,classes:current_class_id(name,section)").order("first_name");
			if (ids) {
				if (!ids.length) return [];
				q = q.in("id", ids);
			}
			const { data, error } = await q;
			if (error) throw error;
			return data ?? [];
		}
	});
	import_react.useEffect(() => {
		if (!studentId && students.data?.length) setStudentId(students.data[0].id);
	}, [students.data, studentId]);
	const documents = useQuery({
		queryKey: [
			"school-documents",
			userId,
			isLeadership,
			hasRole("parent"),
			hasRole("student")
		],
		queryFn: async () => {
			let q = supabase.from("school_documents").select("id,student_id,document_type,document_no,title,content,issue_date,status,created_at,students:student_id(id,first_name,last_name,admission_no,current_class_id,classes:current_class_id(name,section))").order("issue_date", { ascending: false }).order("created_at", { ascending: false });
			if (hasRole("parent")) {
				const { data: links, error } = await supabase.from("parent_student").select("student_id").eq("parent_id", userId);
				if (error) throw error;
				const ids = (links ?? []).map((x) => x.student_id);
				if (!ids.length) return [];
				q = q.in("student_id", ids);
			} else if (hasRole("student")) {
				const { data: me, error } = await supabase.from("students").select("id").eq("user_id", userId).maybeSingle();
				if (error) throw error;
				if (!me) return [];
				q = q.eq("student_id", me.id);
			}
			const { data, error } = await q;
			if (error) throw error;
			return data ?? [];
		}
	});
	const create = useMutation({
		mutationFn: async () => {
			if (!studentId || !title.trim() || !content.trim()) throw new Error("Student, title and document content are required.");
			const { data: session } = await supabase.auth.getSession();
			const { data: number, error: numberError } = await supabase.rpc("next_school_document_no");
			if (numberError) throw numberError;
			const { error } = await supabase.from("school_documents").insert({
				student_id: studentId,
				document_type: type,
				document_no: number,
				title: title.trim(),
				content: content.trim(),
				issue_date: issueDate,
				status: "issued",
				created_by: session.session?.user.id ?? null
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Document issued successfully");
			setTitle("");
			setContent("");
			qc.invalidateQueries({ queryKey: ["school-documents"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not issue document")
	});
	const visible = (documents.data ?? []).filter((doc) => {
		return `${doc.title} ${doc.document_no} ${fullName(doc.students)} ${doc.students?.admission_no ?? ""}`.toLowerCase().includes(search.toLowerCase());
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "School Documents",
			description: "Official student letters and printable school documents.",
			actions: isLeadership ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => document.getElementById("create-document")?.scrollIntoView({ behavior: "smooth" }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 size-4" }), "Create document"]
			}) : null
		}),
		isLeadership && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			id: "create-document",
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Issue a school document" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "grid gap-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Student" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
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
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Document type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: type,
						onValueChange: setType,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: types.map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value,
							children: label
						}, value)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "e.g. Official school letter"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Issue date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: issueDate,
						onChange: (e) => setIssueDate(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Document content" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "min-h-44",
							value: content,
							onChange: (e) => setContent(e.target.value),
							placeholder: "Write the official content of the document..."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => create.mutate(),
							disabled: create.isPending,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mr-2 size-4" }), create.isPending ? "Issuing…" : "Issue document"]
						})
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "flex flex-row items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Document register" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "pl-9",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					placeholder: "Search student, title or document no."
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: visible.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: visible.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: doc.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: doc.status === "issued" ? "default" : "outline",
							children: doc.status
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							fullName(doc.students),
							" · ",
							doc.students?.admission_no,
							" · ",
							doc.document_no
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: ["Issued ", (/* @__PURE__ */ new Date(`${doc.issue_date}T00:00:00`)).toLocaleDateString("en-KE")]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => printDocument(doc, doc.students),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-2 size-4" }), "Print"]
				})]
			}, doc.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No school documents found." }) })] })
	] });
}
//#endregion
export { DocumentsPage as component };

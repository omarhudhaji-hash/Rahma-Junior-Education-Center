import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { a as fullName } from "./school-CK2M8GiK.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./use-auth-BfiWx6iO.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { $ as CheckCheck, J as ClipboardCheck, R as History, b as Save, i as Users, it as CalendarCheck, y as Search } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-BG-idtzq.mjs";
import { t as Label } from "./label-BsoyNsWq.mjs";
import { t as Textarea } from "./textarea-lY6r0rtj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader, t as EmptyState } from "./page-header-D2pXXqT-.mjs";
import { t as Badge } from "./badge-CCuYWPBQ.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-B70CjJ0u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.attendance-C4mZ_ALS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var statuses = [
	"present",
	"absent",
	"late",
	"excused"
];
function AttendancePage() {
	const { userId, hasRole } = useMe();
	return hasRole("parent") || hasRole("student") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FamilyAttendance, { userId }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffAttendance, {
		userId,
		teacher: hasRole("teacher")
	});
}
function statusBadge(status) {
	if (!status) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		children: "Not marked"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: status === "present" ? "default" : status === "absent" ? "destructive" : "secondary",
		className: "capitalize",
		children: status
	});
}
function StaffAttendance({ userId, teacher }) {
	const qc = useQueryClient();
	const [classId, setClassId] = (0, import_react.useState)("");
	const [classSearch, setClassSearch] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [search, setSearch] = (0, import_react.useState)("");
	const [draft, setDraft] = (0, import_react.useState)({});
	const [remarks, setRemarks] = (0, import_react.useState)({});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const classes = useQuery({
		queryKey: [
			"attendance-classes",
			teacher,
			userId
		],
		queryFn: async () => {
			let q = supabase.from("classes").select("id,name,section,level_order").order("level_order");
			if (teacher) {
				const { data, error } = await supabase.from("teacher_class_assignments").select("class_id").eq("teacher_id", userId);
				if (error) throw error;
				const ids = [...new Set((data ?? []).map((x) => x.class_id))];
				if (!ids.length) return [];
				q = q.in("id", ids);
			}
			const { data, error } = await q;
			if (error) throw error;
			return data ?? [];
		}
	});
	const roster = useQuery({
		queryKey: [
			"staff-roster",
			classId,
			date
		],
		enabled: !!classId,
		queryFn: async () => {
			const [{ data: studs, error }, { data: recs, error: recError }] = await Promise.all([supabase.from("students").select("id,first_name,last_name,admission_no").eq("current_class_id", classId).order("first_name"), supabase.from("attendance_records").select("student_id,status,remarks").eq("class_id", classId).eq("attendance_date", date)]);
			if (error) throw error;
			if (recError) throw recError;
			const m = new Map((recs ?? []).map((r) => [r.student_id, r]));
			return (studs ?? []).map((s) => ({
				...s,
				attendance: m.get(s.id) ?? null
			}));
		}
	});
	const rows = (0, import_react.useMemo)(() => {
		const n = search.trim().toLowerCase();
		return (roster.data ?? []).filter((s) => !n || `${s.first_name} ${s.last_name} ${s.admission_no}`.toLowerCase().includes(n));
	}, [roster.data, search]);
	const summary = (0, import_react.useMemo)(() => {
		const counts = {
			present: 0,
			absent: 0,
			late: 0,
			excused: 0
		};
		for (const s of rows) {
			const value = draft[s.id] ?? s.attendance?.status;
			if (value) counts[value] += 1;
		}
		return {
			...counts,
			total: rows.length,
			marked: Object.values(counts).reduce((a, b) => a + b, 0)
		};
	}, [rows, draft]);
	function markAllPresent() {
		if (!rows.length) return;
		setDraft((current) => {
			const next = { ...current };
			for (const student of rows) next[student.id] = "present";
			return next;
		});
		toast.success(`Marked ${rows.length} learner${rows.length === 1 ? "" : "s"} present. Click Save attendance to record it.`);
	}
	async function save() {
		const selectedRows = rows.filter((s) => draft[s.id] || remarks[s.id] !== void 0);
		if (!selectedRows.length) {
			toast.info("Mark a learner or add a remark first.");
			return;
		}
		setSaving(true);
		for (const student of selectedRows) {
			const status = draft[student.id] ?? student.attendance?.status;
			if (!status) {
				toast.error(`Please choose an attendance status for ${fullName(student)}.`);
				setSaving(false);
				return;
			}
			const { error } = await supabase.from("attendance_records").upsert({
				student_id: student.id,
				class_id: classId,
				attendance_date: date,
				status,
				remarks: remarks[student.id] ?? student.attendance?.remarks ?? null,
				marked_by: userId ?? null
			}, { onConflict: "student_id,attendance_date" });
			if (error) {
				toast.error(error.message);
				setSaving(false);
				return;
			}
		}
		setSaving(false);
		setDraft({});
		setRemarks({});
		qc.invalidateQueries({ queryKey: [
			"staff-roster",
			classId,
			date
		] });
		toast.success("Attendance saved successfully.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Attendance",
			description: teacher ? "Mark attendance for your assigned classes and track learner attendance." : "Manage and review attendance across the school.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: markAllPresent,
					disabled: !classId || !rows.length,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "mr-2 size-4" }), "Mark all present"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: save,
					disabled: saving || !classId,
					children: saving ? "Saving…" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-2 size-4" }), "Save attendance"] })
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
					label: "Learners",
					value: summary.total,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
					label: "Present",
					value: summary.present
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
					label: "Absent",
					value: summary.absent
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
					label: "Late",
					value: summary.late
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
					label: "Excused",
					value: summary.excused
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-5 p-4 sm:p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Class" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: classSearch,
							onChange: (e) => setClassSearch(e.target.value),
							placeholder: "Search class…",
							className: "mb-2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: classId,
							onValueChange: (value) => {
								setClassId(value);
								setDraft({});
								setRemarks({});
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select class" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (classes.data ?? []).filter((c) => !classSearch || `${c.name} ${c.section ?? ""}`.toLowerCase().includes(classSearch.toLowerCase())).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
								value: c.id,
								children: [c.name, c.section ? ` — ${c.section}` : ""]
							}, c.id)) })]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: date,
						onChange: (e) => {
							setDate(e.target.value);
							setDraft({});
							setRemarks({});
						}
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Search learner" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: search,
								onChange: (e) => setSearch(e.target.value),
								placeholder: "Name or admission number",
								className: "pl-9"
							})]
						})]
					})
				]
			}), !classId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Select a class to load its attendance register." }) : roster.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Loading learners…" }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No learners found in this class." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/30 p-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: summary.marked }),
					" of ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: summary.total }),
					" learners marked"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "Select a status, add an optional remark, then save."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y rounded-md border",
				children: rows.map((s) => {
					const current = draft[s.id] ?? s.attendance?.status;
					const remark = remarks[s.id] ?? s.attendance?.remarks ?? "";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium text-navy",
								children: fullName(s)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-muted-foreground",
								children: s.admission_no
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-1",
								children: [statuses.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: current === st ? "default" : "outline",
									onClick: () => setDraft((d) => ({
										...d,
										[s.id]: st
									})),
									className: "capitalize",
									children: st
								}, st)), statusBadge(current)]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: remark,
							onChange: (e) => setRemarks((r) => ({
								...r,
								[s.id]: e.target.value
							})),
							placeholder: "Optional attendance remark…",
							rows: 2
						})]
					}, s.id);
				})
			})] })]
		}) })
	] });
}
function SummaryCard({ label, value, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "flex items-center justify-between p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-2xl font-bold",
			children: value
		})] }), icon ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "size-4 text-muted-foreground" })]
	}) });
}
function FamilyAttendance({ userId }) {
	const children = useQuery({
		queryKey: ["my-children-attendance", userId],
		queryFn: async () => {
			let ids = [];
			const { data: linked, error: linkError } = await supabase.from("parent_student").select("student_id").eq("parent_id", userId);
			if (linkError) throw linkError;
			if (linked?.length) ids = linked.map((x) => x.student_id);
			else {
				const { data: own, error } = await supabase.from("students").select("id").eq("user_id", userId);
				if (error) throw error;
				ids = (own ?? []).map((x) => x.id);
			}
			if (!ids.length) return [];
			const { data, error } = await supabase.from("students").select("id,first_name,last_name,admission_no,classes:current_class_id(name)").in("id", ids);
			if (error) throw error;
			return data ?? [];
		}
	});
	const [studentId, setStudentId] = (0, import_react.useState)("");
	const attendance = useQuery({
		queryKey: ["my-attendance", studentId],
		enabled: !!studentId,
		queryFn: async () => {
			const { data, error } = await supabase.from("attendance_records").select("attendance_date,status,remarks").eq("student_id", studentId).order("attendance_date", { ascending: false }).limit(365);
			if (error) throw error;
			return data ?? [];
		}
	});
	const stats = (0, import_react.useMemo)(() => {
		const rows = attendance.data ?? [];
		const present = rows.filter((x) => x.status === "present").length;
		const late = rows.filter((x) => x.status === "late").length;
		return {
			present,
			late,
			absent: rows.filter((x) => x.status === "absent").length,
			excused: rows.filter((x) => x.status === "excused").length,
			total: rows.length,
			percentage: rows.length ? Math.round((present + late) / rows.length * 100) : 0
		};
	}, [attendance.data]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "My Attendance",
		description: "Attendance marked by the school for your child or children."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[18rem_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: "Children"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-2",
			children: [(children.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setStudentId(c.id),
				className: `w-full rounded-lg border p-3 text-left ${studentId === c.id ? "border-primary bg-primary/10" : "hover:bg-muted"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: fullName(c)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: c.classes?.name ?? "Class not assigned"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: c.admission_no
					})
				]
			}, c.id)), !children.isLoading && !children.data?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No linked children found." })]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-6",
			children: !studentId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Select a child to view attendance." })
			}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						label: "Attendance",
						value: stats.percentage,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "size-4 text-muted-foreground" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						label: "Present",
						value: stats.present
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						label: "Absent",
						value: stats.absent
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						label: "Late",
						value: stats.late
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						label: "Excused",
						value: stats.excused
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-4" }), "Attendance history"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: attendance.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Loading attendance…" }) : attendance.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: attendance.data.map((a, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: (/* @__PURE__ */ new Date(`${a.attendance_date}T00:00:00`)).toLocaleDateString("en-KE", {
							weekday: "short",
							day: "numeric",
							month: "short",
							year: "numeric"
						})
					}), a.remarks && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: a.remarks
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: a.status === "present" ? "default" : a.status === "absent" ? "destructive" : "secondary",
						className: "capitalize",
						children: a.status
					})]
				}, `${a.attendance_date}-${index}`))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No attendance has been recorded yet." }) })] })] })
		})]
	})] });
}
//#endregion
export { AttendancePage as component };

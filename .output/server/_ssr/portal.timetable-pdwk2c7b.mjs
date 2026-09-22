import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { a as fullName, r as dayNames } from "./school-BBKER8cz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./use-auth-BfiWx6iO.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { K as Clock3, O as Pencil, d as Trash2, tt as CalendarPlus } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-CIJ7QuDk.mjs";
import { t as Label } from "./label-BsoyNsWq.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader, t as EmptyState } from "./page-header-D2pXXqT-.mjs";
import { t as Badge } from "./badge-CCuYWPBQ.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-B70CjJ0u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.timetable-pdwk2c7b.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TimetablePage() {
	const { userId, hasRole, isLeadership } = useMe();
	const family = hasRole("parent") || hasRole("student");
	const [classId, setClassId] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const qc = useQueryClient();
	const today = (/* @__PURE__ */ new Date()).getDay() === 0 ? 7 : (/* @__PURE__ */ new Date()).getDay();
	const classes = useQuery({
		queryKey: [
			"timetable-classes",
			userId,
			family
		],
		queryFn: async () => {
			if (hasRole("parent")) {
				const { data: ps } = await supabase.from("parent_student").select("student_id").eq("parent_id", userId);
				const ids = (ps ?? []).map((x) => x.student_id);
				if (!ids.length) return [];
				const { data: st } = await supabase.from("students").select("current_class_id").in("id", ids);
				const cids = [...new Set((st ?? []).map((x) => x.current_class_id).filter(Boolean))];
				if (!cids.length) return [];
				const { data, error } = await supabase.from("classes").select("id,name,section,level_order").in("id", cids).order("level_order");
				if (error) throw error;
				return data ?? [];
			}
			if (hasRole("student")) {
				const { data: st } = await supabase.from("students").select("current_class_id").eq("user_id", userId);
				const id = st?.[0]?.current_class_id;
				if (!id) return [];
				const { data, error } = await supabase.from("classes").select("id,name,section,level_order").eq("id", id);
				if (error) throw error;
				return data ?? [];
			}
			if (hasRole("teacher")) {
				const { data: a } = await supabase.from("teacher_class_assignments").select("class_id").eq("teacher_id", userId);
				const ids = (a ?? []).map((x) => x.class_id);
				if (!ids.length) return [];
				const { data, error } = await supabase.from("classes").select("id,name,section,level_order").in("id", ids).order("level_order");
				if (error) throw error;
				return data ?? [];
			}
			const { data, error } = await supabase.from("classes").select("id,name,section,level_order").order("level_order");
			if (error) throw error;
			return data ?? [];
		}
	});
	const teachers = useQuery({
		queryKey: ["timetable-teachers"],
		enabled: isLeadership,
		queryFn: async () => {
			const { data: r } = await supabase.from("user_roles").select("user_id").eq("role", "teacher");
			const ids = (r ?? []).map((x) => x.user_id);
			if (!ids.length) return [];
			const { data, error } = await supabase.from("profiles").select("id,first_name,last_name").in("id", ids);
			if (error) throw error;
			return data ?? [];
		}
	});
	const subjects = useQuery({
		queryKey: ["subjects"],
		queryFn: async () => {
			const { data, error } = await supabase.from("subjects").select("id,name").order("name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const entries = useQuery({
		queryKey: ["timetable", classId],
		enabled: !!classId,
		queryFn: async () => {
			const { data, error } = await supabase.from("timetable_entries").select("id,class_id,subject_id,subject_name,teacher_id,day_of_week,starts_at,ends_at,room,teachers:teacher_id(first_name,last_name),subjects:subject_id(name),classes:class_id(name,section)").eq("class_id", classId).order("day_of_week").order("starts_at");
			if (error) throw error;
			return data ?? [];
		}
	});
	const myEntries = useQuery({
		queryKey: ["my-timetable", userId],
		enabled: hasRole("teacher") && !!userId,
		queryFn: async () => {
			const { data, error } = await supabase.from("timetable_entries").select("id,class_id,subject_id,subject_name,teacher_id,day_of_week,starts_at,ends_at,room,subjects:subject_id(name),classes:class_id(name,section)").eq("teacher_id", userId).order("day_of_week").order("starts_at");
			if (error) throw error;
			return data ?? [];
		}
	});
	const save = useMutation({
		mutationFn: async (form) => {
			const { error } = await supabase.rpc("save_timetable_entry", {
				p_id: editing?.id ?? null,
				p_class_id: form.class_id,
				p_subject_id: form.subject_id || null,
				p_teacher_id: form.teacher_id || null,
				p_day_of_week: Number(form.day_of_week),
				p_starts_at: form.starts_at,
				p_ends_at: form.ends_at,
				p_room: form.room || null
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success(editing ? "Timetable updated." : "Timetable entry created.");
			setEditing(null);
			qc.invalidateQueries({ queryKey: ["timetable"] });
			qc.invalidateQueries({ queryKey: ["my-timetable"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save timetable")
	});
	const remove = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("timetable_entries").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Timetable entry deleted.");
			qc.invalidateQueries({ queryKey: ["timetable"] });
			qc.invalidateQueries({ queryKey: ["my-timetable"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not delete timetable")
	});
	const selectedClass = (classes.data ?? []).find((c) => c.id === classId);
	const todayEntries = hasRole("teacher") ? (myEntries.data ?? []).filter((e) => e.day_of_week === today) : (entries.data ?? []).filter((e) => e.day_of_week === today);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Timetable",
				description: family ? "View the timetable for your child only." : hasRole("teacher") ? "View your teaching schedule and assigned classes." : "Create, edit and manage the school timetable."
			}),
			hasRole("teacher") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "size-4" }), "My teaching schedule"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: todayEntries.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: todayEntries.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: e.subjects?.name ?? e.subject_name ?? "Lesson"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: "Today"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm",
							children: [
								e.starts_at.slice(0, 5),
								"–",
								e.ends_at.slice(0, 5)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								e.classes?.name ?? "Class",
								e.classes?.section ? ` — ${e.classes.section}` : "",
								e.room ? ` · ${e.room}` : ""
							]
						})
					]
				}, e.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No lessons scheduled for today."
			}) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-4 sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Class" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: classId,
					onValueChange: (v) => {
						setClassId(v);
						setEditing(null);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "mt-2 max-w-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select class" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (classes.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
						value: c.id,
						children: [c.name, c.section ? ` — ${c.section}` : ""]
					}, c.id)) })]
				})]
			}) }),
			isLeadership && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimetableForm, {
				classes: classes.data ?? [],
				teachers: teachers.data ?? [],
				subjects: subjects.data ?? [],
				classId,
				editing,
				onSave: (f) => save.mutate(f),
				onCancel: () => setEditing(null)
			}),
			classId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "text-base",
				children: [selectedClass?.name ?? "Class", " weekly schedule"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: (entries.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No timetable entries for this class yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-5",
				children: [
					1,
					2,
					3,
					4,
					5
				].map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: day === today ? "ring-2 ring-primary/30" : "",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "flex items-center justify-between text-sm",
							children: [
								dayNames[day],
								" ",
								day === today && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Today" })
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "space-y-2",
						children: (entries.data ?? []).filter((e) => e.day_of_week === day).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: e.subjects?.name ?? e.subject_name ?? "Lesson"
									}), isLeadership && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											onClick: () => setEditing(e),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											onClick: () => remove.mutate(e.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										e.starts_at.slice(0, 5),
										"–",
										e.ends_at.slice(0, 5)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [fullName(e.teachers) || "Teacher not assigned", e.room ? ` · ${e.room}` : ""]
								})
							]
						}, e.id))
					})]
				}, day))
			}) })] })
		]
	});
}
function TimetableForm({ classes, teachers, subjects, classId, editing, onSave, onCancel }) {
	const [form, setForm] = (0, import_react.useState)({
		class_id: classId,
		subject_id: "",
		teacher_id: "",
		day_of_week: "1",
		starts_at: "08:00",
		ends_at: "08:40",
		room: ""
	});
	(0, import_react.useEffect)(() => {
		setForm(editing ? {
			...editing,
			day_of_week: String(editing.day_of_week),
			starts_at: editing.starts_at.slice(0, 5),
			ends_at: editing.ends_at.slice(0, 5),
			room: editing.room ?? ""
		} : {
			class_id: classId,
			subject_id: "",
			teacher_id: "",
			day_of_week: "1",
			starts_at: "08:00",
			ends_at: "08:40",
			room: ""
		});
	}, [editing, classId]);
	const set = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
		className: "text-base flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "size-4" }), editing ? "Edit timetable entry" : "Create timetable entry"]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 md:grid-cols-3 xl:grid-cols-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: form.class_id,
				onValueChange: (v) => set("class_id", v),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Class" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: classes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
					value: c.id,
					children: [c.name, c.section ? ` — ${c.section}` : ""]
				}, c.id)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: form.subject_id,
				onValueChange: (v) => set("subject_id", v),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Subject" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: subjects.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: s.id,
					children: s.name
				}, s.id)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: form.teacher_id,
				onValueChange: (v) => set("teacher_id", v),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Teacher" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: teachers.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: t.id,
					children: fullName(t)
				}, t.id)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: String(form.day_of_week),
				onValueChange: (v) => set("day_of_week", v),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
					1,
					2,
					3,
					4,
					5
				].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: String(d),
					children: dayNames[d]
				}, d)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "time",
				value: form.starts_at,
				onChange: (e) => set("starts_at", e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "time",
				value: form.ends_at,
				onChange: (e) => set("ends_at", e.target.value)
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 flex gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: form.room ?? "",
				onChange: (e) => set("room", e.target.value),
				placeholder: "Room / venue"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => onSave(form),
				disabled: !form.class_id || !form.subject_id || !form.teacher_id,
				children: "Save"
			}),
			editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: onCancel,
				children: "Cancel"
			})
		]
	})] })] });
}
//#endregion
export { TimetablePage as component };

import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { a as fullName, n as classOptions } from "./school-CK2M8GiK.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./use-auth-BfiWx6iO.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { A as MessageSquare, B as GraduationCap, T as Plus, c as UserPlus, d as Trash2, i as Users, s as UserRoundPlus, st as BookOpenCheck, t as X, w as Power } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-BG-idtzq.mjs";
import { t as Label } from "./label-BsoyNsWq.mjs";
import { t as Textarea } from "./textarea-lY6r0rtj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader, t as EmptyState } from "./page-header-D2pXXqT-.mjs";
import { t as Badge } from "./badge-CCuYWPBQ.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-B70CjJ0u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.classes-BmcMi_iQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ClassesPage() {
	const { isLeadership, userId, hasRole } = useMe();
	const qc = useQueryClient();
	const [q, setQ] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [section, setSection] = (0, import_react.useState)("");
	const [capacity, setCapacity] = (0, import_react.useState)("");
	const [teacherByClass, setTeacherByClass] = (0, import_react.useState)({});
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	const [classRemark, setClassRemark] = (0, import_react.useState)("");
	const [subjectName, setSubjectName] = (0, import_react.useState)("");
	const [subjectCode, setSubjectCode] = (0, import_react.useState)("");
	const [subjectDescription, setSubjectDescription] = (0, import_react.useState)("");
	const [subjectAssignment, setSubjectAssignment] = (0, import_react.useState)({});
	const classes = useQuery({
		queryKey: [
			"managed-classes",
			userId,
			isLeadership
		],
		queryFn: async () => {
			const { data, error } = await supabase.from("classes").select("id,name,section,level_order,capacity,class_teacher_id").order("level_order").order("section");
			if (error) throw error;
			return data ?? [];
		}
	});
	const counts = useQuery({
		queryKey: [
			"class-counts",
			userId,
			isLeadership
		],
		queryFn: async () => {
			const { data, error } = await supabase.from("students").select("id,current_class_id");
			if (error) throw error;
			const map = /* @__PURE__ */ new Map();
			(data ?? []).forEach((s) => s.current_class_id && map.set(s.current_class_id, (map.get(s.current_class_id) ?? 0) + 1));
			return map;
		}
	});
	const teachers = useQuery({
		queryKey: ["teacher-profiles", userId],
		enabled: isLeadership,
		queryFn: async () => {
			const { data: roles, error: roleError } = await supabase.from("user_roles").select("user_id").eq("role", "teacher");
			if (roleError) throw roleError;
			const ids = [...new Set((roles ?? []).map((r) => r.user_id))];
			if (!ids.length) return [];
			const { data, error } = await supabase.from("profiles").select("id,first_name,last_name").in("id", ids).order("first_name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const subjects = useQuery({
		queryKey: ["subjects-management", userId],
		queryFn: async () => {
			const { data, error } = await supabase.from("subjects").select("id,name,code,description,is_active").order("is_active", { ascending: false }).order("name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const subjectAssignments = useQuery({
		queryKey: [
			"teacher-subject-assignments",
			userId,
			isLeadership
		],
		queryFn: async () => {
			let query = supabase.from("teacher_class_assignments").select("id,teacher_id,class_id,subject_id,created_at,class:class_id(name,section),subject:subject_id(id,name,code,is_active)").not("subject_id", "is", null).order("created_at", { ascending: false });
			if (!isLeadership) query = query.eq("teacher_id", userId);
			const { data, error } = await query;
			if (error) throw error;
			const rows = data ?? [];
			const teacherIds = [...new Set(rows.map((r) => r.teacher_id).filter(Boolean))];
			if (!teacherIds.length) return rows;
			const { data: profiles, error: profileError } = await supabase.from("profiles").select("id,first_name,last_name").in("id", teacherIds);
			if (profileError) throw profileError;
			const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
			return rows.map((r) => ({
				...r,
				teacher: byId.get(r.teacher_id) ?? null
			}));
		}
	});
	const createSubject = useMutation({
		mutationFn: async () => {
			const cleanName = subjectName.trim();
			const cleanCode = subjectCode.trim().toUpperCase();
			if (!cleanName) throw new Error("Enter a subject name.");
			const { data: existing, error: lookupError } = await supabase.from("subjects").select("id").ilike("name", cleanName).maybeSingle();
			if (lookupError) throw lookupError;
			if (existing) throw new Error("That subject already exists.");
			const { error } = await supabase.from("subjects").insert({
				name: cleanName,
				code: cleanCode || null,
				description: subjectDescription.trim() || null,
				is_active: true
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Subject created.");
			setSubjectName("");
			setSubjectCode("");
			setSubjectDescription("");
			qc.invalidateQueries({ queryKey: ["subjects-management"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not create subject")
	});
	const toggleSubject = useMutation({
		mutationFn: async ({ id, active }) => {
			const { error } = await supabase.from("subjects").update({ is_active: active }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Subject status updated.");
			qc.invalidateQueries({ queryKey: ["subjects-management"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not update subject")
	});
	const assignSubject = useMutation({
		mutationFn: async ({ classId, teacherId, subjectId }) => {
			if (!classId || !teacherId || !subjectId) throw new Error("Select a teacher and subject.");
			const { data: existing, error: lookupError } = await supabase.from("teacher_class_assignments").select("id").eq("teacher_id", teacherId).eq("class_id", classId).eq("subject_id", subjectId).maybeSingle();
			if (lookupError) throw lookupError;
			if (existing) throw new Error("That teacher is already assigned to this subject and class.");
			const { error } = await supabase.from("teacher_class_assignments").insert({
				teacher_id: teacherId,
				class_id: classId,
				subject_id: subjectId
			});
			if (error) throw error;
		},
		onSuccess: (_, vars) => {
			toast.success("Subject assigned to teacher.");
			setSubjectAssignment((m) => ({
				...m,
				[vars.classId]: {
					teacherId: "",
					subjectId: ""
				}
			}));
			qc.invalidateQueries({ queryKey: ["teacher-subject-assignments"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not assign subject")
	});
	const removeSubjectAssignment = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("teacher_class_assignments").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Subject assignment removed.");
			qc.invalidateQueries({ queryKey: ["teacher-subject-assignments"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not remove assignment")
	});
	const assignedTeacherNames = useQuery({
		queryKey: ["class-teacher-names", classes.data?.map((c) => c.class_teacher_id).filter(Boolean)],
		enabled: isLeadership && !!classes.data?.length,
		queryFn: async () => {
			const ids = [...new Set((classes.data ?? []).map((c) => c.class_teacher_id).filter(Boolean))];
			if (!ids.length) return /* @__PURE__ */ new Map();
			const { data, error } = await supabase.from("profiles").select("id,first_name,last_name").in("id", ids);
			if (error) throw error;
			return new Map((data ?? []).map((p) => [p.id, fullName(p)]));
		}
	});
	const studentsForClass = useQuery({
		queryKey: [
			"class-students",
			expanded,
			userId
		],
		enabled: !!expanded,
		queryFn: async () => {
			if (!expanded) return [];
			const { data, error } = await supabase.from("students").select("id,admission_no,first_name,last_name,status").eq("current_class_id", expanded).order("first_name").order("last_name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const create = useMutation({
		mutationFn: async () => {
			if (!name) throw new Error("Choose a grade.");
			const level = classOptions.indexOf(name) + 1;
			if (level < 1) throw new Error("Choose a valid grade.");
			const existingQuery = supabase.from("classes").select("id").eq("name", name);
			const { data: existing, error: existingError } = section.trim() ? await existingQuery.eq("section", section.trim()).maybeSingle() : await existingQuery.is("section", null).maybeSingle();
			if (existingError && existingError.code !== "PGRST116") throw existingError;
			if (existing) throw new Error("That class/stream already exists.");
			const { error } = await supabase.from("classes").insert({
				name,
				section: section.trim() || null,
				capacity: capacity ? Number(capacity) : null,
				level_order: level
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Class created.");
			setName("");
			setSection("");
			setCapacity("");
			qc.invalidateQueries({ queryKey: ["managed-classes"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not create class")
	});
	const assign = useMutation({
		mutationFn: async ({ classId, teacherId }) => {
			if (!classId || !teacherId) throw new Error("Select a class and teacher.");
			const oldClass = (classes.data ?? []).find((c) => c.id === classId);
			const { error: classError } = await supabase.from("classes").update({ class_teacher_id: teacherId }).eq("id", classId);
			if (classError) throw classError;
			if (oldClass?.class_teacher_id && oldClass.class_teacher_id !== teacherId) {
				const { error: oldAssignmentError } = await supabase.from("teacher_class_assignments").delete().eq("class_id", classId).eq("teacher_id", oldClass.class_teacher_id).is("subject_id", null);
				if (oldAssignmentError) throw oldAssignmentError;
			}
			const { data: existing, error: lookupError } = await supabase.from("teacher_class_assignments").select("id").eq("teacher_id", teacherId).eq("class_id", classId).is("subject_id", null).maybeSingle();
			if (lookupError) throw lookupError;
			if (!existing) {
				const { error } = await supabase.from("teacher_class_assignments").insert({
					teacher_id: teacherId,
					class_id: classId,
					subject_id: null
				});
				if (error) throw error;
			}
		},
		onSuccess: (_, vars) => {
			toast.success("Teacher assigned to class.");
			setTeacherByClass((m) => ({
				...m,
				[vars.classId]: ""
			}));
			qc.invalidateQueries({ queryKey: ["managed-classes"] });
			qc.invalidateQueries({ queryKey: ["class-teacher-names"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not assign teacher")
	});
	const removeTeacher = useMutation({
		mutationFn: async (classId) => {
			const c = (classes.data ?? []).find((x) => x.id === classId);
			if (!c?.class_teacher_id) throw new Error("No class teacher is assigned.");
			const { error } = await supabase.from("classes").update({ class_teacher_id: null }).eq("id", classId);
			if (error) throw error;
			const { error: deleteError } = await supabase.from("teacher_class_assignments").delete().eq("class_id", classId).eq("teacher_id", c.class_teacher_id).is("subject_id", null);
			if (deleteError) throw deleteError;
		},
		onSuccess: () => {
			toast.success("Class teacher removed.");
			qc.invalidateQueries({ queryKey: ["managed-classes"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not remove teacher")
	});
	const saveClassRemark = useMutation({
		mutationFn: async ({ classId, remark }) => {
			if (!remark.trim()) throw new Error("Write a remark first.");
			const { error } = await supabase.from("class_remarks").insert({
				class_id: classId,
				teacher_id: userId,
				remark: remark.trim()
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Class remark saved.");
			setClassRemark("");
			qc.invalidateQueries({ queryKey: ["class-remarks"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save class remark")
	});
	const classRemarks = useQuery({
		queryKey: [
			"class-remarks",
			expanded,
			userId
		],
		enabled: !!expanded,
		queryFn: async () => {
			if (!expanded) return [];
			const { data, error } = await supabase.from("class_remarks").select("id,remark,created_at,teacher:teacher_id(first_name,last_name)").eq("class_id", expanded).order("created_at", { ascending: false }).limit(10);
			if (error) throw error;
			return data ?? [];
		}
	});
	const removeClass = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("classes").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Class removed.");
			setExpanded(null);
			qc.invalidateQueries({ queryKey: ["managed-classes"] });
			qc.invalidateQueries({ queryKey: ["class-counts"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not remove class")
	});
	const rows = (0, import_react.useMemo)(() => {
		const needle = q.toLowerCase().trim();
		return (classes.data ?? []).filter((c) => !needle || `${c.name} ${c.section ?? ""} ${assignedTeacherNames.data?.get(c.class_teacher_id ?? "") ?? ""}`.toLowerCase().includes(needle));
	}, [
		classes.data,
		assignedTeacherNames.data,
		q
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Classes & Teacher Assignment",
			description: hasRole("teacher") ? "Your assigned classes, subjects, and learners." : "Create classes, assign class teachers and subjects, and manage learner placement."
		}),
		isLeadership && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpenCheck, { className: "size-4" }), "Subjects"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-[1.1fr_.7fr_1.4fr_auto]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: subjectName,
						onChange: (e) => setSubjectName(e.target.value),
						placeholder: "Subject name e.g. Mathematics"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: subjectCode,
						onChange: (e) => setSubjectCode(e.target.value),
						placeholder: "Code e.g. MAT"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: subjectDescription,
						onChange: (e) => setSubjectDescription(e.target.value),
						placeholder: "Optional description"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => createSubject.mutate(),
						disabled: !subjectName.trim() || createSubject.isPending,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 size-4" }), "Add subject"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3",
				children: subjects.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Loading subjects…"
				}) : subjects.data?.length ? subjects.data.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: s.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [s.code || "No code", s.description ? ` · ${s.description}` : ""]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: s.is_active ? "default" : "secondary",
							children: s.is_active ? "Active" : "Inactive"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-3",
						variant: "outline",
						size: "sm",
						onClick: () => toggleSubject.mutate({
							id: s.id,
							active: !s.is_active
						}),
						disabled: toggleSubject.isPending,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "mr-2 size-3" }), s.is_active ? "Deactivate" : "Activate"]
					})]
				}, s.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No subjects created yet." })
			})] })]
		}),
		hasRole("teacher") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpenCheck, { className: "size-4" }), "My subject assignments"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: subjectAssignments.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading subject assignments…"
			}) : subjectAssignments.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 md:grid-cols-2 xl:grid-cols-3",
				children: subjectAssignments.data.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: a.subject?.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [a.class?.name, a.class?.section ? ` — ${a.class.section}` : ""]
						}),
						a.subject?.code && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "mt-2",
							variant: "outline",
							children: a.subject.code
						})
					]
				}, a.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "You have no subject assignments yet." }) })]
		}),
		isLeadership && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRoundPlus, { className: "size-4" }), "Assign subjects to teachers"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "A subject assignment is specific to both a teacher and a class."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: (classes.data ?? []).map((c) => {
					const selected = subjectAssignment[c.id] ?? {
						teacherId: "",
						subjectId: ""
					};
					const assignments = (subjectAssignments.data ?? []).filter((a) => a.class_id === c.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-semibold",
									children: [c.name, c.section ? ` — ${c.section}` : ""]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									children: [
										assignments.length,
										" subject",
										assignments.length === 1 ? "" : "s"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid gap-2 md:grid-cols-[1fr_1fr_auto]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: selected.teacherId,
										onValueChange: (v) => setSubjectAssignment((m) => ({
											...m,
											[c.id]: {
												...selected,
												teacherId: v
											}
										})),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select teacher" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (teachers.data ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: t.id,
											children: fullName(t)
										}, t.id)) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: selected.subjectId,
										onValueChange: (v) => setSubjectAssignment((m) => ({
											...m,
											[c.id]: {
												...selected,
												subjectId: v
											}
										})),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select subject" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (subjects.data ?? []).filter((s) => s.is_active).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: s.id,
											children: [s.name, s.code ? ` (${s.code})` : ""]
										}, s.id)) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => assignSubject.mutate({
											classId: c.id,
											teacherId: selected.teacherId,
											subjectId: selected.subjectId
										}),
										disabled: !selected.teacherId || !selected.subjectId || assignSubject.isPending,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "mr-2 size-4" }), "Assign"]
									})
								]
							}),
							assignments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 grid gap-2 md:grid-cols-2",
								children: assignments.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3 rounded-lg bg-muted/40 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: a.subject?.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [fullName(a.teacher), a.subject?.code ? ` · ${a.subject.code}` : ""]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => removeSubjectAssignment.mutate(a.id),
										disabled: removeSubjectAssignment.isPending,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
									})]
								}, a.id))
							})
						]
					}, c.id);
				})
			}) })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 xl:grid-cols-[22rem_1fr]",
			children: [isLeadership && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "h-fit",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Create class"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Grade" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: name,
							onValueChange: setName,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select grade" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: classOptions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: c,
								children: c
							}, c)) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Section / stream" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: section,
							onChange: (e) => setSection(e.target.value),
							placeholder: "e.g. East"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Capacity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: "1",
							value: capacity,
							onChange: (e) => setCapacity(e.target.value),
							placeholder: "Optional"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "w-full",
							onClick: () => create.mutate(),
							disabled: create.isPending,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 size-4" }), "Create class"]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-4 sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 flex gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search grade, stream or teacher…"
					})
				}), classes.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-8 text-center text-sm text-muted-foreground",
					children: "Loading classes…"
				}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No classes found." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: rows.map((c) => {
						const count = counts.data?.get(c.id) ?? 0;
						const teacherName = c.class_teacher_id ? assignedTeacherNames.data?.get(c.class_teacher_id) : void 0;
						const selectedTeacher = teacherByClass[c.id] ?? "";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-semibold text-navy",
											children: [c.name, c.section ? ` — ${c.section}` : ""]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 flex flex-wrap gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "secondary",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mr-1 size-3" }),
													count,
													c.capacity ? ` / ${c.capacity}` : "",
													" learners"
												]
											}), teacherName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "mr-1 size-3" }), teacherName] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												children: "No class teacher"
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => setExpanded(expanded === c.id ? null : c.id),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mr-2 size-4" }), expanded === c.id ? "Hide class details" : "View class details"]
											}),
											hasRole("teacher") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "secondary",
												size: "sm",
												onClick: () => setExpanded(c.id),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "mr-2 size-4" }), "View remarks"]
											}),
											isLeadership && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "destructive",
												size: "sm",
												onClick: () => {
													if (confirm(`Remove ${c.name}${c.section ? ` — ${c.section}` : ""}?`)) removeClass.mutate(c.id);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 size-4" }), "Remove"]
											})
										]
									})]
								}),
								isLeadership && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-wrap items-end gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-64 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Class teacher" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: selectedTeacher,
												onValueChange: (v) => setTeacherByClass((m) => ({
													...m,
													[c.id]: v
												})),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: teacherName ?? "Assign teacher" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (teachers.data ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: t.id,
													children: fullName(t)
												}, t.id)) })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: () => assign.mutate({
												classId: c.id,
												teacherId: selectedTeacher
											}),
											disabled: !selectedTeacher || assign.isPending,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "mr-2 size-4" }), "Assign"]
										}),
										c.class_teacher_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											onClick: () => removeTeacher.mutate(c.id),
											disabled: removeTeacher.isPending,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mr-2 size-4" }), "Remove teacher"]
										})
									]
								}),
								expanded === c.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 border-t pt-4 space-y-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-2 text-sm font-semibold",
										children: "Learners in this class"
									}), studentsForClass.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Loading learners…"
									}) : studentsForClass.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid gap-2 md:grid-cols-2",
										children: studentsForClass.data.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg bg-muted/40 p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium",
												children: fullName(s)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: [
													s.admission_no,
													" · ",
													s.status
												]
											})]
										}, s.id))
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "No learners are assigned to this class yet."
									})] }), hasRole("teacher") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border bg-card p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm font-semibold",
														children: "Class remarks"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-xs text-muted-foreground",
													children: "Write and review observations, progress notes, behaviour notes, or issues about this class."
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													children: "Teacher notes"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												className: "mt-3",
												rows: 3,
												value: classRemark,
												onChange: (e) => setClassRemark(e.target.value),
												placeholder: "Write a professional class remark…"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												className: "mt-2",
												size: "sm",
												disabled: !classRemark.trim() || saveClassRemark.isPending,
												onClick: () => saveClassRemark.mutate({
													classId: c.id,
													remark: classRemark
												}),
												children: "Save class remark"
											}),
											classRemarks.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-4 text-xs text-muted-foreground",
												children: "Loading remarks…"
											}) : classRemarks.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-4 space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
													children: "Saved remarks"
												}), classRemarks.data.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-lg bg-muted/40 p-3",
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
												}, r.id))]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-4 rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground",
												children: "No class remarks have been saved yet."
											})
										]
									})]
								})
							]
						}, c.id);
					})
				})]
			}) })]
		})
	] });
}
//#endregion
export { ClassesPage as component };

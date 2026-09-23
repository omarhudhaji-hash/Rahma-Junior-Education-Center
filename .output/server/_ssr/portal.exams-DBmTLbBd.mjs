import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { a as fullName } from "./school-CK2M8GiK.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./use-auth-BfiWx6iO.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { G as Download, Y as CircleCheck, nt as CalendarPlus } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-BG-idtzq.mjs";
import { t as Label } from "./label-BsoyNsWq.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader, t as EmptyState } from "./page-header-D2pXXqT-.mjs";
import { t as Badge } from "./badge-CCuYWPBQ.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-B70CjJ0u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.exams-DBmTLbBd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function examEndTime(start, duration) {
	if (!start || !duration) return "";
	const [h, m] = start.slice(0, 5).split(":").map(Number);
	if (!Number.isFinite(h) || !Number.isFinite(m)) return "";
	const total = h * 60 + m + duration;
	const hh = Math.floor(total % 1440 / 60);
	const mm = total % 60;
	return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
function ExamsPage() {
	const { userId, isLeadership, hasRole } = useMe();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Exams",
		description: "Exam dates, applications, timetables and reports."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: isLeadership ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeadershipExams, { userId }) : hasRole("teacher") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeacherExams, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FamilyExams, {
			userId,
			student: hasRole("student")
		})
	})] });
}
function LeadershipExams({ userId }) {
	const qc = useQueryClient();
	const [name, setName] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("end_term");
	const [start, setStart] = (0, import_react.useState)("");
	const [end, setEnd] = (0, import_react.useState)("");
	const [publish, setPublish] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)("");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [classId, setClassId] = (0, import_react.useState)("");
	const [teacherId, setTeacherId] = (0, import_react.useState)("");
	const [examTime, setExamTime] = (0, import_react.useState)("");
	const [duration, setDuration] = (0, import_react.useState)("60");
	const exams = useQuery({
		queryKey: ["exams-leadership"],
		queryFn: async () => {
			const { data, error } = await supabase.from("exams").select("id,name,type,starts_on,ends_on,published").order("starts_on", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const classes = useQuery({
		queryKey: ["exam-classes"],
		queryFn: async () => {
			const { data, error } = await supabase.from("classes").select("id,name,section,level_order").order("level_order");
			if (error) throw error;
			return data ?? [];
		}
	});
	const subjects = useQuery({
		queryKey: ["exam-subjects-list"],
		queryFn: async () => {
			const { data, error } = await supabase.from("subjects").select("id,name").order("name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const teachers = useQuery({
		queryKey: ["exam-teachers"],
		queryFn: async () => {
			const { data: r, error: re } = await supabase.from("user_roles").select("user_id").eq("role", "teacher");
			if (re) throw re;
			const ids = (r ?? []).map((x) => x.user_id);
			if (!ids.length) return [];
			const { data, error } = await supabase.from("profiles").select("id,first_name,last_name").in("id", ids).order("first_name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const teacherAssignments = useQuery({
		queryKey: ["exam-teacher-subject-assignments"],
		queryFn: async () => {
			const { data, error } = await supabase.from("teacher_class_assignments").select("teacher_id,class_id,subject_id").not("subject_id", "is", null);
			if (error) throw error;
			return data ?? [];
		}
	});
	const schedule = useQuery({
		queryKey: ["exam-schedule", selected],
		enabled: !!selected,
		queryFn: async () => {
			const { data, error } = await supabase.from("exam_subjects").select("id,exam_date,start_time,duration_minutes,max_marks,class_id,subject_id,teacher_id,classes:class_id(name,section),subjects:subject_id(name)").eq("exam_id", selected).order("exam_date");
			if (error) throw error;
			return data ?? [];
		}
	});
	const registrations = useQuery({
		queryKey: ["exam-registrations", selected],
		enabled: !!selected,
		queryFn: async () => {
			const { data, error } = await supabase.from("exam_registrations").select("id,student_id,status,mercy_granted,requested_at,students:student_id(first_name,last_name,admission_no)").eq("exam_id", selected).order("requested_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const createExam = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("exams").insert({
				name,
				type,
				starts_on: start || null,
				ends_on: end || null,
				published: publish,
				created_by: userId ?? null
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Exam created.");
			setName("");
			setStart("");
			setEnd("");
			qc.invalidateQueries({ queryKey: ["exams-leadership"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not create exam")
	});
	const addSubject = useMutation({
		mutationFn: async () => {
			if (!selected || !classId || !subject || !teacherId) throw new Error("Select exam, class, subject and assigned teacher.");
			if (!(teacherAssignments.data ?? []).some((a) => a.teacher_id === teacherId && a.class_id === classId && a.subject_id === subject)) throw new Error("That teacher is not assigned to this subject and class.");
			const { error } = await supabase.from("exam_subjects").insert({
				exam_id: selected,
				class_id: classId,
				subject_id: subject,
				teacher_id: teacherId,
				exam_date: start || null,
				start_time: examTime || null,
				duration_minutes: duration ? Number(duration) : null,
				max_marks: 100
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Exam subject and teacher assigned.");
			setTeacherId("");
			setExamTime("");
			setDuration("60");
			qc.invalidateQueries({ queryKey: ["exam-schedule", selected] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not add timetable entry")
	});
	const mercy = useMutation({
		mutationFn: async ({ id, allow }) => {
			const { error } = await supabase.from("exam_registrations").update({
				mercy_granted: allow,
				status: "registered",
				approved_by: userId,
				approved_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Exam application updated.");
			qc.invalidateQueries({ queryKey: ["exam-registrations", selected] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not update application")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 xl:grid-cols-[24rem_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: "Create exam"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "Exam name"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: type,
					onValueChange: (v) => setType(v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
						"cat",
						"midterm",
						"end_term",
						"mock",
						"national"
					].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: x,
						children: x.replace("_", " ").toUpperCase()
					}, x)) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: start,
						onChange: (e) => setStart(e.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: end,
						onChange: (e) => setEnd(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: publish,
						onChange: (e) => setPublish(e.target.checked)
					}), " Publish to families"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full",
					disabled: !name || createExam.isPending,
					onClick: () => createExam.mutate(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "mr-2 size-4" }), "Create exam"]
				})
			]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: "Exam register"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-2",
			children: [(exams.data ?? []).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setSelected(e.id),
				className: `w-full rounded-lg border p-3 text-left ${selected === e.id ? "border-primary bg-primary/5" : "hover:bg-muted"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: e.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: e.published ? "Published" : "Draft" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						e.starts_on ?? "Date not set",
						" ",
						e.ends_on ? `→ ${e.ends_on}` : ""
					]
				})]
			}, e.id)), !exams.data?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No exams created yet." })]
		})] })]
	}), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
		className: "text-base",
		children: "Build exam timetable"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Set the exact date, start time and duration for each subject paper."
	})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: classId,
					onValueChange: (v) => {
						setClassId(v);
						setTeacherId("");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Class" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (classes.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
						value: c.id,
						children: [c.name, c.section ? ` — ${c.section}` : ""]
					}, c.id)) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: subject,
					onValueChange: (v) => {
						setSubject(v);
						setTeacherId("");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Subject" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (subjects.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: s.id,
						children: s.name
					}, s.id)) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: teacherId,
					onValueChange: setTeacherId,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Assign teacher" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (teachers.data ?? []).filter((t) => (teacherAssignments.data ?? []).some((a) => a.teacher_id === t.id && a.class_id === classId && a.subject_id === subject)).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: t.id,
						children: fullName(t)
					}, t.id)) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "Paper date"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-1",
					type: "date",
					value: start,
					onChange: (e) => setStart(e.target.value)
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "Start time"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-1",
					type: "time",
					value: examTime,
					onChange: (e) => setExamTime(e.target.value),
					"aria-label": "Exam start time"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "Duration (minutes)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-1",
					type: "number",
					min: "5",
					max: "600",
					step: "5",
					value: duration,
					onChange: (e) => setDuration(e.target.value),
					placeholder: "e.g. 60",
					"aria-label": "Exam duration in minutes"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					disabled: !teacherId || !start || !examTime || !duration,
					onClick: () => addSubject.mutate(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-2 size-4" }), "Assign subject & teacher"]
				})
			]
		}),
		classId && subject && !(teacherAssignments.data ?? []).some((a) => a.class_id === classId && a.subject_id === subject) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-destructive",
			children: "No teacher is currently assigned to this subject and class. Assign the teacher under Classes → Subject Assignments first."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 space-y-2",
			children: (schedule.data ?? []).map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between rounded-lg border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "block",
					children: [
						x.exam_date,
						" · ",
						x.classes?.name,
						" · ",
						x.subjects?.name
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "block text-xs text-muted-foreground",
					children: [x.start_time?.slice(0, 5) ?? "Time TBA", x.duration_minutes ? ` – ${examEndTime(x.start_time, x.duration_minutes)} (${x.duration_minutes} min)` : ""]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-right text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "block",
						children: [x.max_marks, " marks"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: fullName((teachers.data ?? []).find((t) => t.id === x.teacher_id)) || "Teacher not assigned"
					})]
				})]
			}, x.id))
		})
	] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
		className: "text-base",
		children: "Student exam applications"
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "space-y-2",
		children: [(registrations.data ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: fullName(r.students) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					r.students?.admission_no,
					" · ",
					r.requested_at.slice(0, 10)
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: r.status }),
					r.mercy_granted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: "Mercy granted"
					}),
					" ",
					!r.mercy_granted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => mercy.mutate({
							id: r.id,
							allow: true
						}),
						children: "Grant mercy & register"
					})
				]
			})]
		}, r.id)), !registrations.data?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No exam applications yet." })]
	})] })] })] });
}
function TeacherExams() {
	const { userId } = useMe();
	const qc = useQueryClient();
	const [selected, setSelected] = (0, import_react.useState)("");
	const [draftMarks, setDraftMarks] = (0, import_react.useState)({});
	const [draftRemarks, setDraftRemarks] = (0, import_react.useState)({});
	const assignments = useQuery({
		queryKey: ["teacher-subject-assignments-for-marks", userId],
		enabled: !!userId,
		queryFn: async () => {
			const { data, error } = await supabase.from("teacher_class_assignments").select("id,class_id,subject_id").eq("teacher_id", userId).not("subject_id", "is", null);
			if (error) throw error;
			return data ?? [];
		}
	});
	const examSubjects = useQuery({
		queryKey: [
			"teacher-exam-subjects-for-marks",
			userId,
			(assignments.data ?? []).map((a) => `${a.class_id}:${a.subject_id}`).join(",")
		],
		enabled: !!userId && !assignments.isLoading,
		queryFn: async () => {
			const { data, error } = await supabase.from("exam_subjects").select("id,exam_id,class_id,subject_id,teacher_id,max_marks,exam_date,start_time,duration_minutes,exam:exam_id(id,name,type,starts_on,ends_on),class:class_id(id,name,section),subject:subject_id(id,name,code)").order("exam_date", { ascending: false });
			if (error) throw error;
			const allowed = new Set((assignments.data ?? []).map((a) => `${a.class_id}:${a.subject_id}`));
			return (data ?? []).filter((x) => x.teacher_id ? x.teacher_id === userId : allowed.has(`${x.class_id}:${x.subject_id}`));
		}
	});
	const selectedRow = (examSubjects.data ?? []).find((x) => x.id === selected);
	const students = useQuery({
		queryKey: ["teacher-mark-roster", selectedRow?.class_id],
		enabled: !!selectedRow,
		queryFn: async () => {
			const { data, error } = await supabase.from("students").select("id,first_name,last_name,admission_no,status").eq("current_class_id", selectedRow.class_id).order("first_name").order("last_name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const marks = useQuery({
		queryKey: ["teacher-marks", selected],
		enabled: !!selected,
		queryFn: async () => {
			const { data, error } = await supabase.from("marks").select("id,student_id,marks,grade,teacher_remarks,entered_by").eq("exam_subject_id", selected);
			if (error) throw error;
			const map = /* @__PURE__ */ new Map();
			(data ?? []).forEach((m) => map.set(m.student_id, m));
			return map;
		}
	});
	const saveMarks = useMutation({
		mutationFn: async () => {
			if (!selectedRow) throw new Error("Select an assigned assessment first.");
			const max = Number(selectedRow.max_marks) || 100;
			const rows = (students.data ?? []).map((student) => {
				const existing = marks.data?.get(student.id);
				const raw = draftMarks[student.id] ?? (existing?.marks !== void 0 ? String(existing.marks) : "");
				if (raw.trim() === "") return null;
				const value = Number(raw);
				if (!Number.isFinite(value) || value < 0 || value > max) throw new Error(`Marks for ${fullName(student)} must be between 0 and ${max}.`);
				const pct = value / max * 100;
				const grade = pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : "E";
				return {
					exam_subject_id: selected,
					student_id: student.id,
					marks: value,
					grade,
					teacher_remarks: (draftRemarks[student.id] ?? "").trim() || null,
					entered_by: userId
				};
			}).filter(Boolean);
			if (!rows.length) throw new Error("Enter at least one student's marks.");
			const { error } = await supabase.from("marks").upsert(rows, { onConflict: "exam_subject_id,student_id" });
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Marks saved successfully.");
			qc.invalidateQueries({ queryKey: ["teacher-marks", selected] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save marks")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: "Enter marks"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Choose an exam, subject and class that has been assigned to you. Enter marks and an optional teacher comment for each learner."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: selected,
					onValueChange: (v) => {
						setSelected(v);
						setDraftMarks({});
						setDraftRemarks({});
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select an assessment" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (examSubjects.data ?? []).map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
						value: x.id,
						children: [
							x.exam?.name ?? "Exam",
							" · ",
							x.subject?.name ?? "Subject",
							" · ",
							x.class?.name ?? "Class",
							x.class?.section ? ` — ${x.class.section}` : "",
							" · Max ",
							x.max_marks
						]
					}, x.id)) })]
				}),
				!examSubjects.isLoading && !examSubjects.data?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No assessments have been assigned to you yet. Ask the Admin or Headteacher to add your subject to an exam." })
			]
		})] }), selectedRow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "text-base",
				children: [
					selectedRow.subject?.name,
					" — ",
					selectedRow.class?.name,
					selectedRow.class?.section ? ` · ${selectedRow.class.section}` : ""
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					selectedRow.exam?.name,
					" · Maximum ",
					selectedRow.max_marks,
					" marks",
					selectedRow.exam_date ? ` · ${selectedRow.exam_date}` : "",
					selectedRow.start_time ? ` · ${selectedRow.start_time.slice(0, 5)}` : "",
					selectedRow.duration_minutes ? ` – ${examEndTime(selectedRow.start_time, selectedRow.duration_minutes)} (${selectedRow.duration_minutes} min)` : ""
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "secondary",
				children: [students.data?.length ?? 0, " learners"]
			})]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "space-y-3",
			children: students.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading learners…"
			}) : students.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden rounded-lg border bg-muted/30 p-3 text-xs font-semibold md:grid md:grid-cols-[2fr_7rem_1fr] md:gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Learner" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Marks / ", selectedRow.max_marks] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Teacher remark" })
					]
				}),
				students.data.map((student) => {
					const existing = marks.data?.get(student.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 rounded-lg border p-3 md:grid-cols-[2fr_7rem_1fr] md:items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: fullName(student)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										student.admission_no,
										" · ",
										student.status
									]
								}),
								existing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: ["Saved grade: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: existing.grade ?? "—" })]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: "0",
								max: selectedRow.max_marks,
								step: "0.01",
								value: draftMarks[student.id] ?? (existing?.marks !== void 0 ? String(existing.marks) : ""),
								onChange: (e) => setDraftMarks((v) => ({
									...v,
									[student.id]: e.target.value
								})),
								placeholder: "0"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draftRemarks[student.id] ?? existing?.teacher_remarks ?? "",
								onChange: (e) => setDraftRemarks((v) => ({
									...v,
									[student.id]: e.target.value
								})),
								placeholder: "Optional teacher remark"
							})
						]
					}, student.id);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 border-t pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Grades are calculated automatically: A ≥ 80%, B ≥ 70%, C ≥ 60%, D ≥ 50%, E < 50%."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						disabled: saveMarks.isPending || marks.isLoading,
						onClick: () => saveMarks.mutate(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-2 size-4" }), saveMarks.isPending ? "Saving…" : "Save marks"]
					})]
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No learners are currently assigned to this class." })
		})] }) })]
	});
}
function FamilyExams({ userId, student }) {
	const qc = useQueryClient();
	const [examId, setExamId] = (0, import_react.useState)("");
	const kids = useQuery({
		queryKey: [
			"exam-kids",
			userId,
			student
		],
		queryFn: async () => {
			if (student) {
				const { data, error } = await supabase.from("students").select("id,first_name,last_name,admission_no").eq("user_id", userId);
				if (error) throw error;
				return data ?? [];
			}
			const { data: ps } = await supabase.from("parent_student").select("student_id").eq("parent_id", userId);
			const ids = (ps ?? []).map((x) => x.student_id);
			if (!ids.length) return [];
			const { data, error } = await supabase.from("students").select("id,first_name,last_name,admission_no").in("id", ids);
			if (error) throw error;
			return data ?? [];
		}
	});
	const exams = useQuery({
		queryKey: ["family-exams"],
		queryFn: async () => {
			const { data, error } = await supabase.from("exams").select("id,name,type,starts_on,ends_on").eq("published", true).order("starts_on", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const registrations = useQuery({
		queryKey: [
			"my-exam-registrations",
			examId,
			userId
		],
		enabled: !!examId,
		queryFn: async () => {
			const ids = (kids.data ?? []).map((k) => k.id);
			if (!ids.length) return [];
			const { data, error } = await supabase.from("exam_registrations").select("id,student_id,status,mercy_granted,students:student_id(first_name,last_name,admission_no)").eq("exam_id", examId).in("student_id", ids);
			if (error) throw error;
			return data ?? [];
		}
	});
	const schedule = useQuery({
		queryKey: ["family-exam-schedule", examId],
		enabled: !!examId,
		queryFn: async () => {
			const { data, error } = await supabase.from("exam_subjects").select("id,exam_date,start_time,duration_minutes,class_id,subjects:subject_id(name),classes:class_id(name,section)").eq("exam_id", examId).order("exam_date");
			if (error) throw error;
			return data ?? [];
		}
	});
	const register = useMutation({
		mutationFn: async (studentId) => {
			const { data, error } = await supabase.rpc("can_register_for_exam", {
				_student_id: studentId,
				_exam_id: examId
			});
			if (error) throw error;
			if (!data) throw new Error("Exam registration requires a zero balance or an Admin/Headteacher mercy approval.");
			const { error: e } = await supabase.from("exam_registrations").insert({
				exam_id: examId,
				student_id: studentId,
				status: "registered"
			});
			if (e) throw e;
		},
		onSuccess: () => {
			toast.success("Exam registration submitted.");
			qc.invalidateQueries({ queryKey: ["my-exam-registrations"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not register")
	});
	async function downloadReport(studentId) {
		const { data, error } = await supabase.from("marks").select("marks,grade,teacher_remarks,exam_subjects:exam_subject_id(exam_date,subjects:subject_id(name),exams:exam_id(name))").eq("student_id", studentId);
		if (error) {
			toast.error(error.message);
			return;
		}
		const csv = [[
			"Exam",
			"Date",
			"Subject",
			"Marks",
			"Grade",
			"Teacher remarks"
		], ...(data ?? []).map((r) => [
			r.exam_subjects?.exams?.name ?? "Exam",
			r.exam_subjects?.exam_date ?? "",
			r.exam_subjects?.subjects?.name ?? "",
			r.marks ?? "",
			r.grade ?? "",
			r.teacher_remarks ?? ""
		])].map((r) => r.map((x) => `"${String(x).replaceAll("\"", "\"\"")}"`).join(",")).join("\n");
		const a = document.createElement("a");
		a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
		a.download = `rahma-exam-report-${studentId}.csv`;
		a.click();
		URL.revokeObjectURL(a.href);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
		className: "text-base",
		children: "Exam week & registration"
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: examId,
				onValueChange: setExamId,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select published exam" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (exams.data ?? []).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
					value: e.id,
					children: [
						e.name,
						" · ",
						e.starts_on ?? "TBA"
					]
				}, e.id)) })]
			}),
			examId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: (kids.data ?? []).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fullName(k) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => register.mutate(k.id),
							disabled: register.isPending,
							children: "Register"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => downloadReport(k.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 size-4" }), "Download report"]
						})]
					})]
				}, k.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: (schedule.data ?? []).map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded border p-3 text-sm",
					children: [
						x.exam_date,
						" · ",
						x.classes?.name,
						" · ",
						x.subjects?.name,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-xs text-muted-foreground",
							children: [x.start_time?.slice(0, 5) ?? "Time TBA", x.duration_minutes ? ` – ${examEndTime(x.start_time, x.duration_minutes)} (${x.duration_minutes} min)` : ""]
						})
					]
				}, x.id))
			})
		]
	})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
		className: "text-base",
		children: "Registration status"
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: registrations.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-2",
		children: registrations.data.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between rounded-lg border p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fullName(r.students) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: r.mercy_granted ? "Registered (mercy)" : r.status })]
		}, r.id))
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No registrations for the selected exam." }) })] })] });
}
//#endregion
export { ExamsPage as component };

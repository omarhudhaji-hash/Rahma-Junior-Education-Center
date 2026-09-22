import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { a as fullName, f as school } from "./school-BBKER8cz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./use-auth-BfiWx6iO.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { V as GraduationCap, ct as Award, w as Printer } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as EmptyState } from "./page-header-D2pXXqT-.mjs";
import { t as Badge } from "./badge-CCuYWPBQ.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-B70CjJ0u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.academic-Mnd4t2MQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function gradeForPercent(percent) {
	if (percent >= 80) return "A";
	if (percent >= 70) return "B";
	if (percent >= 60) return "C";
	if (percent >= 50) return "D";
	return "E";
}
function formatDate(value) {
	if (!value) return "—";
	const date = /* @__PURE__ */ new Date(`${value}T00:00:00`);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString("en-KE", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
}
function AcademicPage() {
	const { userId, hasRole, isLeadership } = useMe();
	const family = hasRole("parent") || hasRole("student");
	const students = useQuery({
		queryKey: [
			"academic-students",
			userId,
			family,
			isLeadership,
			hasRole("teacher")
		],
		queryFn: async () => {
			let ids = [];
			if (hasRole("parent")) {
				const { data, error } = await supabase.from("parent_student").select("student_id").eq("parent_id", userId);
				if (error) throw error;
				ids = (data ?? []).map((x) => x.student_id);
			} else if (hasRole("student")) {
				const { data, error } = await supabase.from("students").select("id").eq("user_id", userId);
				if (error) throw error;
				ids = (data ?? []).map((x) => x.id);
			}
			let query = supabase.from("students").select("id,admission_no,first_name,last_name,current_class_id,classes:current_class_id(name,section)").order("first_name");
			if (family) {
				if (!ids.length) return [];
				query = query.in("id", ids);
			}
			const { data, error } = await query;
			if (error) throw error;
			return data ?? [];
		}
	});
	const [selected, setSelected] = import_react.useState("");
	const [reportExam, setReportExam] = import_react.useState("");
	import_react.useEffect(() => {
		if (!students.data?.length || selected) return;
		const requested = new URLSearchParams(window.location.search).get("studentId");
		const match = students.data.some((student) => student.id === requested);
		setSelected(match ? requested : students.data[0].id);
	}, [students.data, selected]);
	const active = selected || students.data?.[0]?.id || "";
	const marks = useQuery({
		queryKey: ["academic-record", active],
		enabled: !!active,
		queryFn: async () => {
			const { data, error } = await supabase.from("marks").select("id,marks,grade,teacher_remarks,created_at,exam_subjects:exam_subject_id(id,exam_date,max_marks,subject_id,exam_id,subjects:subject_id(name,code),exams:exam_id(name,type,starts_on,ends_on,published))").eq("student_id", active).order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const student = (students.data ?? []).find((item) => item.id === active);
	const rows = (marks.data ?? []).map((record) => {
		const examSubject = record.exam_subjects ?? {};
		const max = Number(examSubject.max_marks ?? 100);
		const mark = Number(record.marks ?? 0);
		const percent = max ? mark / max * 100 : 0;
		return {
			...record,
			examSubject,
			max,
			mark,
			percent,
			grade: record.grade ?? gradeForPercent(percent)
		};
	});
	const examGroups = /* @__PURE__ */ new Map();
	rows.forEach((row) => {
		const key = row.examSubject.exams?.name ?? "Other";
		examGroups.set(key, [...examGroups.get(key) ?? [], row]);
	});
	import_react.useEffect(() => {
		if (!reportExam && examGroups.size) setReportExam([...examGroups.keys()][0]);
		if (reportExam && !examGroups.has(reportExam)) setReportExam([...examGroups.keys()][0] ?? "");
	}, [rows.length, reportExam]);
	const average = rows.length ? rows.reduce((total, row) => total + row.percent, 0) / rows.length : 0;
	const overall = rows.length ? gradeForPercent(average) : "—";
	const reportRows = reportExam ? examGroups.get(reportExam) ?? [] : rows;
	const reportAverage = reportRows.length ? reportRows.reduce((total, row) => total + row.percent, 0) / reportRows.length : 0;
	const reportGrade = reportRows.length ? gradeForPercent(reportAverage) : "—";
	const reportExamMeta = reportRows[0]?.examSubject?.exams;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "print:hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Academic Records",
			description: "Student marks, grades, teacher remarks and professional report-card summaries."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex flex-wrap items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: active,
					onValueChange: setSelected,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-full max-w-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select student" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (students.data ?? []).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
						value: item.id,
						children: [
							fullName(item),
							" · ",
							item.admission_no
						]
					}, item.id)) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: reportExam,
					onValueChange: setReportExam,
					disabled: !examGroups.size,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-full max-w-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select report card exam" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [...examGroups.keys()].map((examName) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
						value: examName,
						children: ["Report card: ", examName]
					}, examName)) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => window.print(),
					disabled: !reportRows.length,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-2 size-4" }), "Print professional report card"]
				})
			]
		})]
	}), !active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No student academic record is available yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "print:hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex flex-row items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-5" }), fullName(student)]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						student?.admission_no,
						" · ",
						student?.classes?.name ?? "Class not assigned",
						student?.classes?.section ? ` — ${student.classes.section}` : ""
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-brand text-muted-foreground",
							children: "Overall"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold text-primary",
							children: overall
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Average ",
								average.toFixed(1),
								"%"
							]
						})
					]
				})]
			})
		}), !rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No marks have been recorded for this student yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [[...examGroups.entries()].map(([examName, group]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: examName
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2",
								children: "Subject"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2",
								children: "Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2",
								children: "Marks"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2",
								children: "%"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2",
								children: "Grade"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2",
								children: "Teacher remark"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: group.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2 font-medium",
								children: row.examSubject.subjects?.name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2",
								children: formatDate(row.examSubject.exam_date)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-2",
								children: [
									row.mark,
									" / ",
									row.max
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-2",
								children: [row.percent.toFixed(1), "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: row.grade })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2",
								children: row.teacher_remarks ?? "—"
							})
						]
					}, row.id)) })]
				})
			}) })] }, examName)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-4" }), "Performance summary"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Summary, {
						label: "Subjects recorded",
						value: String(rows.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Summary, {
						label: "Average",
						value: `${average.toFixed(1)}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Summary, {
						label: "Overall grade",
						value: overall
					})
				]
			})] })]
		})]
	}), reportRows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto hidden max-w-4xl bg-white text-slate-900 print:block print:max-w-none",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-2 border-slate-800 p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "border-b-2 border-slate-800 pb-5 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/images/logo.jpg",
								alt: "Rahma Junior logo",
								className: "h-20 w-20 rounded-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl font-extrabold uppercase tracking-wide",
									children: school.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm font-semibold uppercase tracking-[0.2em]",
									children: school.motto
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-slate-600",
									children: school.values
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-5 text-xl font-extrabold uppercase tracking-wider",
							children: "Student Academic Report Card"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm font-medium",
							children: [
								reportExam,
								" ",
								reportExamMeta?.type ? `· ${reportExamMeta.type.replace("_", " ").toUpperCase()}` : ""
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid grid-cols-2 gap-x-8 gap-y-3 border-b border-slate-300 pb-5 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Student name",
							value: fullName(student)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Admission number",
							value: student?.admission_no ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Class",
							value: `${student?.classes?.name ?? "Not assigned"}${student?.classes?.section ? ` — ${student.classes.section}` : ""}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Report date",
							value: (/* @__PURE__ */ new Date()).toLocaleDateString("en-KE")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full border-collapse text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-slate-100",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "border border-slate-400 p-2 text-left",
									children: "#"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "border border-slate-400 p-2 text-left",
									children: "Subject"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "border border-slate-400 p-2 text-center",
									children: "Marks"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "border border-slate-400 p-2 text-center",
									children: "%"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "border border-slate-400 p-2 text-center",
									children: "Grade"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "border border-slate-400 p-2 text-left",
									children: "Teacher remark"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: reportRows.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border border-slate-400 p-2 text-center",
								children: index + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border border-slate-400 p-2 font-semibold",
								children: row.examSubject.subjects?.name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "border border-slate-400 p-2 text-center",
								children: [
									row.mark,
									" / ",
									row.max
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "border border-slate-400 p-2 text-center",
								children: [row.percent.toFixed(1), "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border border-slate-400 p-2 text-center font-bold",
								children: row.grade
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border border-slate-400 p-2",
								children: row.teacher_remarks || "—"
							})
						] }, row.id)) })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportMetric, {
							label: "Subjects",
							value: String(reportRows.length)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportMetric, {
							label: "Average",
							value: `${reportAverage.toFixed(1)}%`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportMetric, {
							label: "Overall grade",
							value: reportGrade
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid grid-cols-2 gap-16 pt-8 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Signature, { label: "Class Teacher" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Signature, { label: "Headteacher" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
					className: "mt-8 border-t border-slate-300 pt-4 text-center text-xs text-slate-500",
					children: "This report card is generated from the school academic records. Keep it safely for future reference."
				})
			]
		})
	})] })] });
}
function Summary({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-secondary/60 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-brand text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xl font-bold",
			children: value
		})]
	});
}
function Info({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[10px] font-bold uppercase tracking-wider text-slate-500",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-1 font-semibold",
		children: value
	})] });
}
function ReportMetric({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-slate-400 p-3 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] font-bold uppercase tracking-wider text-slate-500",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-lg font-extrabold",
			children: value
		})]
	});
}
function Signature({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pt-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-b border-slate-800" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 font-semibold",
				children: [label, " signature"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-slate-500",
				children: "Date: __________________"
			})
		]
	});
}
//#endregion
export { AcademicPage as component };

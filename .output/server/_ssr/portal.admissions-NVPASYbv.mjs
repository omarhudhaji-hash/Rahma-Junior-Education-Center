import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { n as classOptions } from "./school-CK2M8GiK.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { Y as CircleCheck, c as UserPlus } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-BG-idtzq.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader, t as EmptyState } from "./page-header-D2pXXqT-.mjs";
import { t as Badge } from "./badge-CCuYWPBQ.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-B70CjJ0u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.admissions-NVPASYbv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function getActionErrorMessage(error, fallback) {
	if (!error) return fallback;
	const e = error;
	if (e.context && typeof e.context.json === "function") try {
		const body = await e.context.json();
		const message = body?.error ?? body?.message;
		if (message) return `${fallback}: ${message}`;
	} catch {}
	const message = e.message ?? (error instanceof Error ? error.message : "");
	const details = e.details;
	const hint = e.hint;
	const code = e.code;
	const parts = [
		message,
		details,
		hint
	].filter(Boolean).join(" — ");
	return parts ? `${fallback}: ${parts}${code ? ` (code ${code})` : ""}` : fallback;
}
function AdmissionsPage() {
	const qc = useQueryClient();
	const [q, setQ] = (0, import_react.useState)("");
	const [classId, setClassId] = (0, import_react.useState)("");
	const [approvalAdmissionNos, setApprovalAdmissionNos] = (0, import_react.useState)({});
	const [manual, setManual] = (0, import_react.useState)({
		parentFirst: "",
		parentLast: "",
		parentPhone: "",
		parentEmail: "",
		parentPassword: "",
		relationship: "parent",
		studentFirst: "",
		studentLast: "",
		admissionNo: "",
		dob: "",
		gender: "",
		fee: "",
		classId: ""
	});
	const applications = useQuery({
		queryKey: ["applications"],
		queryFn: async () => {
			const { data, error } = await supabase.from("applications").select("id,application_no,parent_name,parent_phone,parent_email,child_name,child_dob,class_applying_for,status,photo_url,created_at").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const classes = useQuery({
		queryKey: ["admission-classes"],
		queryFn: async () => {
			const { data, error } = await supabase.from("classes").select("id,name,section,level_order").order("level_order");
			if (error) throw error;
			return data ?? [];
		}
	});
	const approve = useMutation({
		mutationFn: async ({ id, admissionNo }) => {
			if (!classId) throw new Error("Select the class to assign before approving.");
			const normalizedAdmissionNo = admissionNo.trim();
			if (normalizedAdmissionNo.length < 3) throw new Error("Enter an admission number with at least 3 characters.");
			const { data, error } = await supabase.rpc("approve_admission_application", {
				_application_id: id,
				_class_id: classId,
				_admission_no: normalizedAdmissionNo
			});
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			toast.success("Application approved and learner admitted.");
			qc.invalidateQueries({ queryKey: ["applications"] });
			qc.invalidateQueries({ queryKey: ["students"] });
		},
		onError: async (e) => {
			console.error("Admission approval failed:", e);
			toast.error(await getActionErrorMessage(e, "Could not approve application"));
		}
	});
	const admit = useMutation({
		mutationFn: async () => {
			if (!manual.parentFirst || !manual.parentLast || !manual.parentPhone || !manual.parentEmail || !manual.parentPassword || !manual.studentFirst || !manual.studentLast || !manual.classId || !manual.admissionNo.trim()) throw new Error("Complete parent details, portal email/password, student and class details, and enter a required admission number.");
			const normalizedAdmissionNo = manual.admissionNo.trim();
			const { error: accountError } = await supabase.functions.invoke("create-parent-account", { body: {
				email: manual.parentEmail,
				password: manual.parentPassword,
				firstName: manual.parentFirst,
				lastName: manual.parentLast,
				phone: manual.parentPhone
			} });
			if (accountError) throw accountError;
			const { data, error } = await supabase.rpc("manual_admit_student", {
				_parent_first_name: manual.parentFirst,
				_parent_last_name: manual.parentLast,
				_parent_phone: manual.parentPhone,
				_parent_email: manual.parentEmail,
				_relationship: manual.relationship,
				_student_first_name: manual.studentFirst,
				_student_last_name: manual.studentLast,
				_date_of_birth: manual.dob || null,
				_gender: manual.gender || null,
				_class_id: manual.classId,
				_admission_no: normalizedAdmissionNo,
				_fee_amount: manual.fee ? Number(manual.fee) : 0
			});
			if (error) throw error;
			return data;
		},
		onSuccess: (d) => {
			toast.success(`Student admitted. Parent can now log in with ${manual.parentEmail}.`);
			setManual({
				parentFirst: "",
				parentLast: "",
				parentPhone: "",
				parentEmail: "",
				parentPassword: "",
				relationship: "parent",
				studentFirst: "",
				studentLast: "",
				admissionNo: "",
				dob: "",
				gender: "",
				fee: "",
				classId: ""
			});
			qc.invalidateQueries({ queryKey: ["students"] });
			qc.invalidateQueries({ queryKey: ["admission-families"] });
		},
		onError: async (e) => {
			console.error("Manual admission failed:", e);
			toast.error(await getActionErrorMessage(e, "Could not admit student"));
		}
	});
	const rows = (applications.data ?? []).filter((a) => {
		const n = q.trim().toLowerCase();
		return !n || `${a.child_name} ${a.parent_name} ${a.application_no} ${a.parent_phone}`.toLowerCase().includes(n);
	});
	const createLogin = useMutation({
		mutationFn: async () => {
			if (!manual.parentEmail || !manual.parentPassword || !manual.parentFirst || !manual.parentLast || !manual.parentPhone) throw new Error("Enter the parent name, phone, portal email and password.");
			const { data, error } = await supabase.functions.invoke("create-parent-account", { body: {
				email: manual.parentEmail,
				password: manual.parentPassword,
				firstName: manual.parentFirst,
				lastName: manual.parentLast,
				phone: manual.parentPhone
			} });
			if (error) throw error;
			if (data?.error) throw new Error(data.error);
			return data;
		},
		onSuccess: (d) => {
			toast.success(`Parent portal login is ready: ${d.email}. ${d.linkedChildren ?? 0} child record(s) linked.`);
		},
		onError: async (e) => {
			console.error("Parent login creation failed:", e);
			toast.error(await getActionErrorMessage(e, "Could not create parent login"));
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Admissions",
			description: "Approve public applications or admit students and parents directly. A family may have multiple learners."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-4 md:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					title: "Applications",
					value: applications.data?.length ?? 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					title: "Pending",
					value: applications.data?.filter((a) => a.status !== "accepted" && a.status !== "rejected").length ?? 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					title: "Accepted",
					value: applications.data?.filter((a) => a.status === "accepted").length ?? 0
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4" }), "Parent portal login"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "If you already admitted a parent/student without login details, use this section to create or reset the parent's portal account. Use the same parent email or phone used during admission so the existing children can be linked automatically."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-2 xl:grid-cols-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Parent first name",
								value: manual.parentFirst,
								onChange: (e) => setManual({
									...manual,
									parentFirst: e.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Parent last name",
								value: manual.parentLast,
								onChange: (e) => setManual({
									...manual,
									parentLast: e.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Parent phone",
								value: manual.parentPhone,
								onChange: (e) => setManual({
									...manual,
									parentPhone: e.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								placeholder: "Portal email",
								value: manual.parentEmail,
								onChange: (e) => setManual({
									...manual,
									parentEmail: e.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								minLength: 8,
								placeholder: "New password (8+ chars)",
								value: manual.parentPassword,
								onChange: (e) => setManual({
									...manual,
									parentPassword: e.target.value
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => createLogin.mutate(),
						disabled: createLogin.isPending,
						children: createLogin.isPending ? "Creating login…" : "Create / reset parent login"
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4" }), "Manual parent & student admission"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Create the family, parent portal login and learner together. The parent receives an active login immediately, the child is linked automatically, the class is assigned and the first fee invoice can be created."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 font-semibold",
						children: "Parent / guardian"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-2 xl:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "First name",
								value: manual.parentFirst,
								onChange: (e) => setManual({
									...manual,
									parentFirst: e.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Last name",
								value: manual.parentLast,
								onChange: (e) => setManual({
									...manual,
									parentLast: e.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Phone",
								value: manual.parentPhone,
								onChange: (e) => setManual({
									...manual,
									parentPhone: e.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								placeholder: "Portal email",
								value: manual.parentEmail,
								onChange: (e) => setManual({
									...manual,
									parentEmail: e.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								minLength: 8,
								placeholder: "Portal password (8+ chars)",
								value: manual.parentPassword,
								onChange: (e) => setManual({
									...manual,
									parentPassword: e.target.value
								})
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 font-semibold",
						children: "Student"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-2 xl:grid-cols-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "First name",
								value: manual.studentFirst,
								onChange: (e) => setManual({
									...manual,
									studentFirst: e.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Last name",
								value: manual.studentLast,
								onChange: (e) => setManual({
									...manual,
									studentLast: e.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								minLength: 3,
								placeholder: "Admission number",
								value: manual.admissionNo,
								onChange: (e) => setManual({
									...manual,
									admissionNo: e.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: manual.dob,
								onChange: (e) => setManual({
									...manual,
									dob: e.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: manual.gender,
								onValueChange: (v) => setManual({
									...manual,
									gender: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Gender" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "female",
										children: "Female"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "male",
										children: "Male"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "other",
										children: "Other"
									})
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: manual.classId,
								onValueChange: (v) => setManual({
									...manual,
									classId: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Assign class" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (classes.data ?? []).filter((c) => classOptions.includes(c.name)).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: c.id,
									children: [c.name, c.section ? ` — ${c.section}` : ""]
								}, c.id)) })]
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: "0",
								placeholder: "Initial fee / invoice amount (KSh)",
								value: manual.fee,
								onChange: (e) => setManual({
									...manual,
									fee: e.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: manual.relationship,
								onValueChange: (v) => setManual({
									...manual,
									relationship: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Relationship" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "parent",
										children: "Parent"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "guardian",
										children: "Guardian"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "sponsor",
										children: "Sponsor"
									})
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => admit.mutate(),
								disabled: admit.isPending,
								children: admit.isPending ? "Admitting…" : "Admit student & parent"
							})
						]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: "Public applications"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-[1fr_18rem]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search child, parent, phone or application no."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: classId,
					onValueChange: setClassId,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Class for approval" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (classes.data ?? []).filter((c) => classOptions.includes(c.name)).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
						value: c.id,
						children: [c.name, c.section ? ` — ${c.section}` : ""]
					}, c.id)) })]
				})]
			}), !rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No admission applications found." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: rows.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-navy",
									children: a.child_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground",
									children: [
										a.application_no,
										" · Applying for ",
										a.class_applying_for
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm",
									children: [
										a.photo_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mr-2 text-primary",
											children: "📷 Student photo attached"
										}),
										"Parent: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: a.parent_name }),
										" · ",
										a.parent_phone,
										a.parent_email ? ` · ${a.parent_email}` : ""
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: a.status === "accepted" ? "default" : a.status === "rejected" ? "destructive" : "secondary",
								children: a.status
							})]
						}),
						a.status !== "accepted" && a.status !== "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-full sm:max-w-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-sm font-medium",
									htmlFor: `admission-${a.id}`,
									children: "Admission number"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: `admission-${a.id}`,
									required: true,
									minLength: 3,
									placeholder: "Enter unique admission number",
									value: approvalAdmissionNos[a.id] ?? "",
									onChange: (e) => setApprovalAdmissionNos((current) => ({
										...current,
										[a.id]: e.target.value
									}))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => approve.mutate({
									id: a.id,
									admissionNo: approvalAdmissionNos[a.id] ?? ""
								}),
								disabled: approve.isPending || !classId || (approvalAdmissionNos[a.id] ?? "").trim().length < 3,
								children: approve.isPending ? "Approving…" : "Approve & admit"
							})]
						}),
						a.status === "accepted" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 flex items-center gap-2 text-sm text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" }), "Admission completed"]
						})
					]
				}, a.id))
			})]
		})] })
	] });
}
function Stat({ title, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-brand text-muted-foreground",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-2xl font-extrabold text-navy",
			children: value
		})]
	}) });
}
//#endregion
export { AdmissionsPage as component };

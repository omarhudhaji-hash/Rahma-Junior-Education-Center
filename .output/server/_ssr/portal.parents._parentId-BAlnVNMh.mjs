import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { a as fullName } from "./school-BBKER8cz.mjs";
import { n as getSupabaseFunctionError, t as cn } from "./utils-DTw8Xhwa.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./use-auth-BfiWx6iO.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { E as Plus, R as KeyRound, _ as ShieldCheck, g as ShieldOff, i as Users, o as UserRound, ut as ArrowLeft } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Input } from "./input-CIJ7QuDk.mjs";
import { t as Label } from "./label-BsoyNsWq.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader, t as EmptyState } from "./page-header-D2pXXqT-.mjs";
import { t as Badge } from "./badge-CCuYWPBQ.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CycotAhG.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-B70CjJ0u.mjs";
import { t as Route } from "./portal.parents._parentId-DL2LcNmx.mjs";
import { t as Root } from "../_libs/radix-ui__react-separator.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.parents._parentId-BAlnVNMh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Separator = import_react.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	decorative,
	orientation,
	className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
	...props
}));
Separator.displayName = Root.displayName;
function getChildLinkError(error) {
	const value = error;
	return [
		value?.message,
		value?.details,
		value?.hint
	].filter(Boolean).join(" — ") || "Could not link child.";
}
function ParentProfilePage() {
	const { parentId } = Route.useParams();
	const { hasRole } = useMe();
	const qc = useQueryClient();
	const [addOpen, setAddOpen] = import_react.useState(false);
	const [passwordOpen, setPasswordOpen] = import_react.useState(false);
	const [password, setPassword] = import_react.useState("");
	const [studentId, setStudentId] = import_react.useState("");
	const [parentPhone, setParentPhone] = import_react.useState("");
	const [relationship, setRelationship] = import_react.useState("parent");
	const [childMode, setChildMode] = import_react.useState("existing");
	const [newChild, setNewChild] = import_react.useState({
		firstName: "",
		lastName: "",
		admissionNo: "",
		dob: "",
		gender: "",
		classId: ""
	});
	const family = useQuery({
		queryKey: ["parent-family", parentId],
		queryFn: async () => {
			const { data: parent, error: parentError } = await supabase.from("profiles").select("id,first_name,last_name,email,phone,is_active,created_at").eq("id", parentId).maybeSingle();
			if (parentError) throw parentError;
			const { data: familyRecord, error: familyError } = await supabase.from("admission_families").select("id,parent_name,parent_phone,parent_email,status,approved_at,created_at").eq("id", parentId).maybeSingle();
			if (familyError) throw familyError;
			if (!parent && !familyRecord) throw new Error("Parent account or family not found.");
			const [{ data: links, error: linkError }, { data: families, error: familiesError }] = await Promise.all([parent ? supabase.from("parent_student").select("student_id,relationship,is_primary").eq("parent_id", parentId) : supabase.from("admission_family_students").select("student_id").eq("family_id", parentId), parent ? supabase.from("admission_families").select("id,parent_name,parent_phone,parent_email,status,approved_at,created_at").eq("status", "active") : Promise.resolve({
				data: [],
				error: null
			})]);
			if (linkError) throw linkError;
			if (familiesError) throw familiesError;
			const ids = (links ?? []).map((x) => x.student_id);
			const { data: students, error: studentError } = ids.length ? await supabase.from("students").select("id,admission_no,first_name,last_name,status,admission_date,current_class_id,photo_url,classes:current_class_id(name,section)").in("id", ids).order("first_name") : {
				data: [],
				error: null
			};
			if (studentError) throw studentError;
			const familyParent = familyRecord ? {
				id: familyRecord.id,
				first_name: familyRecord.parent_name.split(/\s+/)[0] ?? "Parent",
				last_name: familyRecord.parent_name.split(/\s+/).slice(1).join(" "),
				email: familyRecord.parent_email,
				phone: familyRecord.parent_phone,
				is_active: familyRecord.status === "active",
				created_at: familyRecord.created_at
			} : null;
			const profileFamily = (families ?? []).find((f) => parent?.email && f.parent_email && parent.email.toLowerCase() === f.parent_email.toLowerCase() || parent?.phone && f.parent_phone && parent.phone === f.parent_phone) ?? null;
			return {
				parent: parent ?? familyParent,
				links: links ?? [],
				students: students ?? [],
				family: profileFamily ?? familyRecord,
				isFamilyOnly: !parent
			};
		}
	});
	import_react.useEffect(() => {
		if (family.data?.parent.phone) setParentPhone(family.data.parent.phone);
	}, [family.data?.parent.phone]);
	const availableStudents = useQuery({
		queryKey: ["students-available-for-parent", parentId],
		enabled: addOpen,
		queryFn: async () => {
			const { data: links, error: linkError } = await supabase.from("parent_student").select("student_id").eq("parent_id", parentId);
			if (linkError) throw linkError;
			const excluded = new Set((links ?? []).map((x) => x.student_id));
			const { data, error } = await supabase.from("students").select("id,admission_no,first_name,last_name,status").order("first_name");
			if (error) throw error;
			return (data ?? []).filter((s) => !excluded.has(s.id));
		}
	});
	const classes = useQuery({
		queryKey: ["parent-add-child-classes"],
		enabled: addOpen && childMode === "new",
		queryFn: async () => {
			const { data, error } = await supabase.from("classes").select("id,name,section").order("level_order").order("name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const addChild = useMutation({
		mutationFn: async () => {
			if (childMode === "existing") {
				if (!studentId) throw new Error("Select a student.");
				if (!parentPhone.trim()) throw new Error("Enter the parent's phone number before linking a child.");
				const { data, error } = await supabase.rpc("attach_student_to_parent_family", {
					_parent_id: parentId,
					_student_id: studentId,
					_parent_phone: parentPhone.trim(),
					_relationship: relationship
				});
				if (error) throw error;
				return data;
			}
			if (!newChild.firstName.trim() || !newChild.lastName.trim() || !newChild.admissionNo.trim()) throw new Error("Enter the child's first and last name, and a required admission number.");
			if (!parentPhone.trim()) throw new Error("Enter the parent's phone number before linking a child.");
			const { data, error } = await supabase.rpc("create_student_for_parent_family", {
				_parent_id: parentId,
				_first_name: newChild.firstName,
				_last_name: newChild.lastName,
				_date_of_birth: newChild.dob || null,
				_gender: newChild.gender || null,
				_class_id: newChild.classId || null,
				_admission_no: newChild.admissionNo.trim(),
				_parent_phone: parentPhone.trim(),
				_relationship: relationship
			});
			if (error) throw error;
			return data;
		},
		onSuccess: (data) => {
			toast.success(childMode === "existing" ? "Child linked to the parent family." : `Child admitted with admission number ${data?.admission_no ?? "created"}.`);
			setAddOpen(false);
			setStudentId("");
			setNewChild({
				firstName: "",
				lastName: "",
				admissionNo: "",
				dob: "",
				gender: "",
				classId: ""
			});
			qc.invalidateQueries({ queryKey: ["parent-family", parentId] });
			qc.invalidateQueries({ queryKey: ["parents-directory"] });
			qc.invalidateQueries({ queryKey: ["students-available-for-parent", parentId] });
		},
		onError: (e) => toast.error(getChildLinkError(e))
	});
	const resetPassword = useMutation({
		mutationFn: async () => {
			if (!password || password.length < 8) throw new Error("Password must be at least 8 characters.");
			const { error } = await supabase.functions.invoke("create-parent-account", { body: {
				email: family.data?.parent.email,
				password,
				firstName: family.data?.parent.first_name,
				lastName: family.data?.parent.last_name,
				phone: family.data?.parent.phone
			} });
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Parent portal password reset successfully.");
			setPassword("");
			setPasswordOpen(false);
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not reset password.")
	});
	const toggleAccount = useMutation({
		mutationFn: async (active) => {
			if (!hasRole("admin")) throw new Error("Only the Admin can change portal account status.");
			if (family.data?.isFamilyOnly) {
				const { error } = await supabase.from("admission_families").update({ status: active ? "active" : "inactive" }).eq("id", parentId);
				if (error) throw error;
				return;
			}
			const { data: session } = await supabase.auth.getSession();
			if (!session.session?.access_token) throw new Error("Your session has expired. Please sign in again.");
			const { error } = await supabase.functions.invoke("set-parent-account-status", {
				body: {
					userId: parentId,
					active
				},
				headers: { Authorization: `Bearer ${session.session.access_token}` }
			});
			if (error) throw error;
		},
		onSuccess: (_, active) => {
			toast.success(active ? "Portal account enabled." : "Portal account disabled.");
			qc.invalidateQueries({ queryKey: ["parent-family", parentId] });
			qc.invalidateQueries({ queryKey: ["parents-directory"] });
		},
		onError: async (e) => toast.error(await getSupabaseFunctionError(e, "Could not change account status"))
	});
	if (family.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading parent family…"
	});
	if (family.isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: family.error instanceof Error ? family.error.message : "Unable to load parent family." });
	const { parent, students, links, family: familyRecord } = family.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			asChild: true,
			className: "mb-2 -ml-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/portal/parents",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-2 size-4" }), "Back to parents"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: fullName(parent),
			description: "Parent / guardian family profile",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => setPasswordOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "mr-2 size-4" }), "Reset password"]
				}), hasRole("admin") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: parent.is_active ? "outline" : "default",
					onClick: () => toggleAccount.mutate(!parent.is_active),
					children: parent.is_active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldOff, { className: "mr-2 size-4" }), "Disable portal"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mr-2 size-4" }), "Enable portal"] })
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					title: "Phone",
					value: parent.phone ?? "Not recorded"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					title: "Email",
					value: parent.email ?? "Not recorded"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					title: "Portal",
					value: parent.is_active ? "Active" : "Disabled"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					title: "Children",
					value: String(students.length)
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-[1fr_340px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex flex-row items-center justify-between space-y-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "flex items-center gap-2 text-base",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }), "Children"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setAddOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 size-4" }), "Add Child"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: students.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: students.map((s) => {
					const link = links.find((x) => x.student_id === s.id);
					const className = s.classes?.name ? s.classes.name + (s.classes.section ? " — " + s.classes.section : "") : "Not assigned";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentPhotoThumb, {
									path: s.photo_url,
									name: fullName(s)
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/portal/students/$studentId",
									params: { studentId: s.id },
									className: "font-semibold hover:underline",
									children: fullName(s)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Admission: ", s.admission_no] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Class: ", className] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Relationship: ", link?.relationship ?? "parent"] })
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/portal/students/$studentId",
									params: { studentId: s.id },
									children: "Student Profile"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: s.status === "active" ? "default" : "secondary",
								children: s.status
							})]
						})]
					}, s.id);
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No children are linked to this parent yet." }) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-4" }), "Parent information"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Full name",
						value: fullName(parent)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Phone",
						value: parent.phone ?? "Not recorded"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Email",
						value: parent.email ?? "Not recorded"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Portal status",
						value: parent.is_active ? "Active" : "Disabled"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Account created",
						value: new Date(parent.created_at).toLocaleDateString("en-KE")
					}),
					familyRecord && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Family status",
							value: familyRecord.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Admission approved",
							value: new Date(familyRecord.approved_at).toLocaleDateString("en-KE")
						})
					] })
				]
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: addOpen,
			onOpenChange: setAddOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add another child" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					"Add a new learner to ",
					fullName(parent),
					" or link an existing learner. The parent keeps one portal account."
				] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Parent phone number" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								type: "tel",
								value: parentPhone,
								onChange: (e) => setParentPhone(e.target.value),
								placeholder: "Enter parent phone number"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: childMode === "existing" ? "default" : "outline",
								onClick: () => setChildMode("existing"),
								children: "Existing student"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: childMode === "new" ? "default" : "outline",
								onClick: () => setChildMode("new"),
								children: "New student"
							})]
						}),
						childMode === "existing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Student" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: studentId,
									onValueChange: setStudentId,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a student" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (availableStudents.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: s.id,
										children: [
											s.first_name,
											" ",
											s.last_name,
											" — ",
											s.admission_no
										]
									}, s.id)) })]
								}),
								availableStudents.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Loading students…"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "First name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: newChild.firstName,
										onChange: (e) => setNewChild({
											...newChild,
											firstName: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Last name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: newChild.lastName,
										onChange: (e) => setNewChild({
											...newChild,
											lastName: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Admission number" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										minLength: 3,
										value: newChild.admissionNo,
										onChange: (e) => setNewChild({
											...newChild,
											admissionNo: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Date of birth" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: newChild.dob,
										onChange: (e) => setNewChild({
											...newChild,
											dob: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Gender" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: newChild.gender,
										onValueChange: (v) => setNewChild({
											...newChild,
											gender: v
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select gender" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "male",
												children: "Male"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "female",
												children: "Female"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "other",
												children: "Other"
											})
										] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Class" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: newChild.classId,
										onValueChange: (v) => setNewChild({
											...newChild,
											classId: v
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select class" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (classes.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: c.id,
											children: [c.name, c.section ? ` — ${c.section}` : ""]
										}, c.id)) })]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Relationship" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: relationship,
								onValueChange: setRelationship,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "parent",
										children: "Parent"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "guardian",
										children: "Guardian"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "mother",
										children: "Mother"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "father",
										children: "Father"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "sponsor",
										children: "Sponsor"
									})
								] })]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setAddOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => addChild.mutate(),
					disabled: addChild.isPending || !parentPhone.trim() || (childMode === "existing" ? !studentId : !newChild.firstName.trim() || !newChild.lastName.trim() || newChild.admissionNo.trim().length < 3),
					children: addChild.isPending ? "Saving…" : childMode === "existing" ? "Link child" : "Create & add child"
				})] })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: passwordOpen,
			onOpenChange: setPasswordOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Reset parent portal password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					"This updates the password for ",
					parent.email ?? "this parent",
					". Use at least 8 characters."
				] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "New password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						placeholder: "Enter a new password"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setPasswordOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => resetPassword.mutate(),
					disabled: resetPassword.isPending,
					children: resetPassword.isPending ? "Updating…" : "Reset password"
				})] })
			] })
		})
	] });
}
function StudentPhotoThumb({ path, name }) {
	const [url, setUrl] = import_react.useState(null);
	import_react.useEffect(() => {
		let cancelled = false;
		if (!path) {
			setUrl(null);
			return;
		}
		supabase.storage.from("student-photos").createSignedUrl(path, 3600).then(({ data }) => {
			if (!cancelled) setUrl(data?.signedUrl ?? null);
		});
		return () => {
			cancelled = true;
		};
	}, [path]);
	return url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: url,
		alt: `${name} profile`,
		className: "size-full object-cover"
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-6 text-muted-foreground" });
}
function Info({ title, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-brand text-muted-foreground",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 truncate font-semibold",
			children: value
		})]
	}) });
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap justify-between gap-2 border-b pb-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-right font-medium",
			children: value
		})]
	});
}
//#endregion
export { ParentProfilePage as component };

import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { a as fullName, l as money } from "./school-BBKER8cz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./use-auth-BfiWx6iO.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { G as CreditCard, H as FileText, V as GraduationCap, et as Camera, o as UserRound, rt as CalendarCheck, ut as ArrowLeft } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Input } from "./input-CIJ7QuDk.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader, t as EmptyState } from "./page-header-D2pXXqT-.mjs";
import { t as Badge } from "./badge-CCuYWPBQ.mjs";
import { t as Route } from "./portal.students._studentId-BRzHm-Ob.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.students._studentId-uHkv7cAP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StudentProfilePage() {
	const { userId, hasRole } = useMe();
	const canManagePhoto = hasRole("admin") || hasRole("headteacher") || hasRole("parent");
	const [photoUploading, setPhotoUploading] = import_react.useState(false);
	const [photoUrl, setPhotoUrl] = import_react.useState(null);
	const { studentId } = Route.useParams();
	const student = useQuery({
		queryKey: ["student-profile", studentId],
		enabled: Boolean(studentId),
		queryFn: async () => {
			const { data, error } = await supabase.from("students").select("id,admission_no,first_name,last_name,date_of_birth,gender,status,admission_date,medical_notes,emergency_contact,emergency_phone,photo_url,current_class_id,classes:current_class_id(name,section)").eq("id", studentId).maybeSingle();
			if (error) throw error;
			if (!data) throw new Error("Student record not found or you do not have permission to view it.");
			return data;
		}
	});
	const attendance = useQuery({
		queryKey: ["student-attendance-summary", studentId],
		enabled: Boolean(student.data),
		queryFn: async () => {
			const { data, error } = await supabase.from("attendance_records").select("status,attendance_date,remarks").eq("student_id", studentId).order("attendance_date", { ascending: false }).limit(20);
			if (error) throw error;
			return data ?? [];
		}
	});
	const finance = useQuery({
		queryKey: ["student-finance-summary", studentId],
		enabled: Boolean(student.data) && (hasRole("admin") || hasRole("headteacher") || hasRole("parent") || hasRole("student")),
		queryFn: async () => {
			const [{ data: invoices, error: ie }, { data: payments, error: pe }] = await Promise.all([supabase.from("invoices").select("id,amount,status,due_date").eq("student_id", studentId).order("due_date", { ascending: false }), supabase.from("payments").select("id,amount,method,transaction_reference,paid_at,receipt_no").eq("student_id", studentId).order("paid_at", { ascending: false }).limit(10)]);
			if (ie) throw ie;
			if (pe) throw pe;
			const billed = (invoices ?? []).reduce((n, x) => n + Number(x.amount ?? 0), 0);
			const paid = (payments ?? []).reduce((n, x) => n + Number(x.amount ?? 0), 0);
			return {
				invoices: invoices ?? [],
				payments: payments ?? [],
				billed,
				paid,
				balance: Math.max(0, billed - paid)
			};
		}
	});
	const parents = useQuery({
		queryKey: ["student-parents", studentId],
		enabled: Boolean(student.data),
		queryFn: async () => {
			const { data: links, error: le } = await supabase.from("parent_student").select("parent_id,relationship,is_primary").eq("student_id", studentId);
			if (le) throw le;
			const ids = (links ?? []).map((x) => x.parent_id);
			const { data: profiles, error: profileError } = ids.length ? await supabase.from("profiles").select("id,first_name,last_name,email,phone").in("id", ids) : {
				data: [],
				error: null
			};
			if (profileError) throw profileError;
			const linkedParents = (links ?? []).map((l) => ({
				...l,
				profile: (profiles ?? []).find((p) => p.id === l.parent_id)
			}));
			if (linkedParents.length) return linkedParents;
			const { data: familyStudent, error: familyError } = await supabase.from("admission_family_students").select("family_id,admission_families:family_id(parent_name,parent_phone,parent_email)").eq("student_id", studentId).maybeSingle();
			if (familyError) throw familyError;
			const family = familyStudent?.admission_families;
			if (!family) return [];
			const nameParts = String(family.parent_name ?? "Parent / guardian").trim().split(/\s+/);
			return [{
				parent_id: null,
				relationship: "parent",
				is_primary: true,
				profile: {
					first_name: nameParts.shift() ?? "Parent",
					last_name: nameParts.join(" "),
					email: family.parent_email,
					phone: family.parent_phone
				}
			}];
		}
	});
	const studentPhotoPath = student.data?.photo_url;
	import_react.useEffect(() => {
		let cancelled = false;
		const load = async () => {
			const path = studentPhotoPath;
			if (!path) {
				setPhotoUrl(null);
				return;
			}
			const { data } = await supabase.storage.from("student-photos").createSignedUrl(path, 3600);
			if (!cancelled) setPhotoUrl(data?.signedUrl ?? null);
		};
		load();
		return () => {
			cancelled = true;
		};
	}, [studentPhotoPath]);
	if (student.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading student profile…"
	});
	if (student.isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: student.error instanceof Error ? student.error.message : "Unable to load student profile." });
	const s = student.data;
	const className = s.classes?.name ? `${s.classes.name}${s.classes.section ? ` — ${s.classes.section}` : ""}` : "Not assigned";
	const present = (attendance.data ?? []).filter((x) => x.status === "present").length;
	const absent = (attendance.data ?? []).filter((x) => x.status === "absent").length;
	const uploadStudentPhoto = async (file) => {
		if (!canManagePhoto) return;
		if (hasRole("parent")) {
			const { data: link } = await supabase.from("parent_student").select("student_id").eq("parent_id", userId).eq("student_id", s.id).maybeSingle();
			if (!link) {
				toast.error("You can only update photos for your own children.");
				return;
			}
		}
		if (!file.type.startsWith("image/")) {
			toast.error("Please select an image file.");
			return;
		}
		if (file.size > 5242880) {
			toast.error("Student photo must be 5 MB or smaller.");
			return;
		}
		setPhotoUploading(true);
		try {
			const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
			const path = `${s.id}/profile-${Date.now()}.${ext}`;
			const { error: uploadError } = await supabase.storage.from("student-photos").upload(path, file, {
				upsert: true,
				contentType: file.type
			});
			if (uploadError) throw uploadError;
			if (hasRole("parent")) {
				const { error: parentPhotoError } = await supabase.rpc("set_student_photo_by_parent", {
					_student_id: s.id,
					_photo_path: path
				});
				if (parentPhotoError) throw parentPhotoError;
			} else {
				const { error: updateError } = await supabase.from("students").update({ photo_url: path }).eq("id", s.id);
				if (updateError) throw updateError;
			}
			await student.refetch();
			toast.success("Student profile picture updated.");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not upload student photo.");
		} finally {
			setPhotoUploading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			asChild: true,
			className: "mb-2 -ml-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/portal/students",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-2 size-4" }), "Back to students"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: fullName(s),
			description: `Admission ${s.admission_no} · ${className}`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-wrap items-center gap-5 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid size-28 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-primary/10 bg-muted",
					children: photoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: photoUrl,
						alt: `${fullName(s)} profile`,
						className: "size-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-12 text-muted-foreground" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-[220px] flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-brand text-muted-foreground",
							children: "Student profile picture"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Clear passport-style photo · JPG, PNG or WebP · maximum 5 MB."
						}),
						canManagePhoto && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3 inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted print:hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" }),
								photoUploading ? "Uploading…" : photoUrl ? "Change photo" : "Upload photo",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "file",
									accept: "image/jpeg,image/png,image/webp",
									className: "hidden",
									disabled: photoUploading,
									onChange: (e) => {
										const f = e.target.files?.[0];
										if (f) uploadStudentPhoto(f);
										e.currentTarget.value = "";
									}
								})
							]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 print:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/portal/academic",
					search: { studentId: s.id },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "mr-2 size-4" }), "View academic record"]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					title: "Class",
					value: className,
					icon: UserRound
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					title: "Status",
					value: s.status,
					icon: UserRound
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					title: "Attendance",
					value: `${present} present · ${absent} absent`,
					icon: CalendarCheck
				}),
				(hasRole("admin") || hasRole("headteacher") || hasRole("parent") || hasRole("student")) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					title: "Balance",
					value: money(finance.data?.balance ?? 0),
					icon: CreditCard
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "flex items-center gap-2 text-base",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-4" }), "Personal & emergency details"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Date of birth",
							value: s.date_of_birth ? (/* @__PURE__ */ new Date(`${s.date_of_birth}T00:00:00`)).toLocaleDateString("en-KE") : "Not recorded"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Gender",
							value: s.gender ?? "Not recorded"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Admission date",
							value: s.admission_date ? (/* @__PURE__ */ new Date(`${s.admission_date}T00:00:00`)).toLocaleDateString("en-KE") : "Not recorded"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Emergency contact",
							value: s.emergency_contact ?? "Not recorded"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Emergency phone",
							value: s.emergency_phone ?? "Not recorded"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Medical notes",
							value: s.medical_notes ?? "No notes recorded"
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "flex items-center gap-2 text-base",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-4" }), "Parent / guardian"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: parents.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: parents.data.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: fullName(p.profile)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [p.relationship, p.is_primary ? " · Primary" : ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm",
								children: [
									p.profile?.phone ?? "No phone",
									" · ",
									p.profile?.email ?? "No email"
								]
							})
						]
					}, p.parent_id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No linked parent or guardian record." }) })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "flex items-center gap-2 text-base",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "size-4" }), "Recent attendance"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: attendance.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: attendance.data.slice(0, 10).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-lg border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: (/* @__PURE__ */ new Date(`${a.attendance_date}T00:00:00`)).toLocaleDateString("en-KE")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: a.remarks ?? "No remark"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: a.status === "present" ? "default" : a.status === "absent" ? "destructive" : "secondary",
							children: a.status
						})]
					}, a.attendance_date))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No attendance records yet." }) })] }),
				(hasRole("admin") || hasRole("headteacher") || hasRole("parent") || hasRole("student")) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "flex items-center gap-2 text-base",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" }), "Fee summary"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Total billed",
							value: money(finance.data?.billed ?? 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Total paid",
							value: money(finance.data?.paid ?? 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Balance",
							value: money(finance.data?.balance ?? 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-sm font-semibold",
								children: "Recent payments"
							}), finance.data?.payments.length ? finance.data.payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between border-b py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									new Date(p.paid_at).toLocaleDateString("en-KE"),
									" · ",
									p.method
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: money(p.amount)
								})]
							}, p.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "No payments recorded."
							})]
						})
					]
				})] })
			]
		})
	] });
}
function Info({ title, value, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "flex items-center gap-3 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-10 place-items-center rounded-lg bg-primary/10 text-primary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-brand text-muted-foreground",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate font-semibold capitalize",
				children: value
			})]
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
			className: "font-medium text-right",
			children: value
		})]
	});
}
//#endregion
export { StudentProfilePage as component };

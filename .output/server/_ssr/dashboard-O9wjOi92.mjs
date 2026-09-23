import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { a as fullName, d as roleLabels, l as money } from "./school-CK2M8GiK.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-DqeHYMZd.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./use-auth-BfiWx6iO.mjs";
import { B as GraduationCap, J as ClipboardCheck, M as Megaphone, V as FileText, i as Users, k as Package, m as ShoppingBag, n as Wallet, o as UserRound, pt as Activity, rt as CalendarDays, tt as Camera, u as TriangleAlert } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader } from "./page-header-D2pXXqT-.mjs";
import { t as Badge } from "./badge-CCuYWPBQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-O9wjOi92.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StudentPhoto({ path, name }) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border bg-muted",
		children: url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: url,
			alt: `${name} profile`,
			className: "size-full object-cover"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-6 text-muted-foreground" })
	});
}
function StatCard({ label, value, icon: Icon, note }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "flex items-center gap-4 p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-11 place-items-center rounded-lg bg-primary/10 text-primary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-brand text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xl font-extrabold text-navy",
				children: value
			}),
			note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: note
			})
		] })]
	}) });
}
function DashboardPage() {
	const { profile, primaryRole, userId, isAdmin, isLeadership, hasRole } = useMe();
	const parent = hasRole("parent");
	const teacher = hasRole("teacher") && !isLeadership;
	const student = hasRole("student") && !isLeadership;
	const myChildren = useQuery({
		queryKey: ["dashboard-my-children", userId],
		enabled: parent && Boolean(userId),
		queryFn: async () => {
			const { data: links, error: linkError } = await supabase.from("parent_student").select("student_id").eq("parent_id", userId);
			if (linkError) throw linkError;
			const ids = (links ?? []).map((x) => x.student_id);
			if (!ids.length) return [];
			const { data, error } = await supabase.from("students").select("id,first_name,last_name,admission_no,photo_url,current_class_id,classes:current_class_id(name,section)").in("id", ids).order("first_name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const stats = useQuery({
		queryKey: [
			"professional-dashboard",
			userId,
			primaryRole
		],
		enabled: Boolean(userId),
		queryFn: async () => {
			const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			const base = {
				students: 0,
				parents: 0,
				teachers: 0,
				classes: 0,
				present: 0,
				outstanding: 0,
				lowStock: 0,
				upcomingExams: 0,
				orders: 0,
				documents: 0
			};
			if (isLeadership) {
				const [s, c, p, t, a, inv, ex, ord, docs] = await Promise.all([
					supabase.from("students").select("id", {
						count: "exact",
						head: true
					}),
					supabase.from("classes").select("id", {
						count: "exact",
						head: true
					}),
					supabase.from("admission_families").select("id", {
						count: "exact",
						head: true
					}),
					supabase.from("user_roles").select("user_id", {
						count: "exact",
						head: true
					}).eq("role", "teacher"),
					supabase.from("attendance_records").select("id", {
						count: "exact",
						head: true
					}).eq("attendance_date", today).eq("status", "present"),
					supabase.from("inventory_items").select("quantity,minimum_stock").eq("is_active", true),
					supabase.from("exams").select("id", {
						count: "exact",
						head: true
					}).gte("starts_on", today),
					supabase.from("store_orders").select("id", {
						count: "exact",
						head: true
					}).in("status", [
						"pending",
						"confirmed",
						"ready"
					]),
					supabase.from("school_documents").select("id", {
						count: "exact",
						head: true
					})
				]);
				base.students = s.count ?? 0;
				base.classes = c.count ?? 0;
				base.parents = p.count ?? 0;
				base.teachers = t.count ?? 0;
				base.present = a.count ?? 0;
				base.lowStock = (inv.data ?? []).filter((x) => Number(x.quantity) <= Number(x.minimum_stock)).length;
				base.upcomingExams = ex.count ?? 0;
				base.orders = ord.count ?? 0;
				base.documents = docs.count ?? 0;
				const { data: invoices } = await supabase.from("invoices").select("amount,status");
				base.outstanding = (invoices ?? []).filter((x) => x.status !== "paid").reduce((n, x) => n + Number(x.amount || 0), 0);
			} else if (parent) {
				const { data: links } = await supabase.from("parent_student").select("student_id").eq("parent_id", userId);
				const ids = (links ?? []).map((x) => x.student_id);
				base.students = ids.length;
				if (ids.length) {
					const [att, inv, docs] = await Promise.all([
						supabase.from("attendance_records").select("id", {
							count: "exact",
							head: true
						}).in("student_id", ids).eq("attendance_date", today).eq("status", "present"),
						supabase.from("invoices").select("amount,status").in("student_id", ids),
						supabase.from("school_documents").select("id", {
							count: "exact",
							head: true
						}).in("student_id", ids)
					]);
					base.present = att.count ?? 0;
					base.outstanding = (inv.data ?? []).filter((x) => x.status !== "paid").reduce((n, x) => n + Number(x.amount || 0), 0);
					base.documents = docs.count ?? 0;
				}
				const { count } = await supabase.from("store_orders").select("id", {
					count: "exact",
					head: true
				}).eq("parent_id", userId);
				base.orders = count ?? 0;
			} else if (teacher) {
				const [classes, att, ex] = await Promise.all([
					supabase.from("teacher_class_assignments").select("id", {
						count: "exact",
						head: true
					}).eq("teacher_id", userId),
					supabase.from("attendance_records").select("id", {
						count: "exact",
						head: true
					}).eq("attendance_date", today).eq("status", "present"),
					supabase.from("exams").select("id", {
						count: "exact",
						head: true
					}).gte("starts_on", today)
				]);
				base.classes = classes.count ?? 0;
				base.present = att.count ?? 0;
				base.upcomingExams = ex.count ?? 0;
			} else if (student) {
				const [att, inv] = await Promise.all([supabase.from("attendance_records").select("id", {
					count: "exact",
					head: true
				}).eq("student_id", userId).eq("attendance_date", today).eq("status", "present"), supabase.from("invoices").select("amount,status").eq("student_id", userId)]);
				base.present = att.count ?? 0;
				base.outstanding = (inv.data ?? []).filter((x) => x.status !== "paid").reduce((n, x) => n + Number(x.amount || 0), 0);
			}
			return base;
		}
	});
	const announcements = useQuery({
		queryKey: ["dashboard-announcements"],
		queryFn: async () => {
			const { data, error } = await supabase.from("announcements").select("id,title,body,published_at").order("published_at", { ascending: false }).limit(4);
			if (error) throw error;
			return data ?? [];
		}
	});
	const events = useQuery({
		queryKey: ["dashboard-events"],
		queryFn: async () => {
			const { data, error } = await supabase.from("calendar_events").select("id,title,starts_at,venue").gte("starts_at", (/* @__PURE__ */ new Date()).toISOString()).order("starts_at").limit(4);
			if (error) throw error;
			return data ?? [];
		}
	});
	const s = stats.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: `${isLeadership ? "Management Dashboard" : parent ? "Family Dashboard" : teacher ? "Teacher Dashboard" : student ? "Student Dashboard" : "School Dashboard"}${profile?.first_name ? `, ${profile.first_name}` : ""}`,
			description: `Signed in as ${roleLabels[primaryRole]}. ${profile ? fullName(profile) : ""}`
		}),
		parent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-4 text-primary" }), (myChildren.data?.length ?? 0) === 1 ? "My Child" : "My Children"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: (myChildren.data?.length ?? 0) === 1 ? "Your child's profile picture and quick profile access." : "Choose a child to open their student profile." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: [(myChildren.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/portal/students/$studentId",
						params: { studentId: c.id },
						className: "flex min-w-0 flex-1 items-center gap-3 transition hover:bg-muted/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentPhoto, {
							path: c.photo_url,
							name: fullName(c)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold truncate",
									children: fullName(c)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: c.admission_no
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [c.classes?.name ?? "Class not assigned", c.classes?.section ? ` — ${c.classes.section}` : ""]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border px-2 py-1.5 text-xs font-medium hover:bg-muted print:hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-3.5" }),
							" ",
							c.photo_url ? "Change photo" : "Add photo",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/jpeg,image/png,image/webp",
								className: "hidden",
								onChange: async (e) => {
									const f = e.target.files?.[0];
									e.currentTarget.value = "";
									if (!f) return;
									if (f.size > 5242880) {
										toast.error("Photo must be 5 MB or smaller.");
										return;
									}
									try {
										const ext = f.name.split(".").pop()?.toLowerCase() || "jpg";
										const path = `${c.id}/parent-${Date.now()}.${ext}`;
										const { error: ue } = await supabase.storage.from("student-photos").upload(path, f, {
											upsert: true,
											contentType: f.type
										});
										if (ue) throw ue;
										const { error: pe } = await supabase.rpc("set_student_photo_by_parent", {
											_student_id: c.id,
											_photo_path: path
										});
										if (pe) throw pe;
										await myChildren.refetch();
										toast.success(`Photo updated for ${fullName(c)}.`);
									} catch (err) {
										toast.error(err instanceof Error ? err.message : "Could not upload student photo.");
									}
								}
							})
						]
					})]
				}, c.id)), !myChildren.isLoading && !myChildren.data?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No linked children found."
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: isLeadership ? "Students" : parent ? "My children" : teacher ? "Assigned classes" : "Attendance today",
					value: String(isLeadership || parent ? s?.students ?? 0 : teacher ? s?.classes ?? 0 : s?.present ?? 0),
					icon: isLeadership || parent ? GraduationCap : teacher ? Users : ClipboardCheck
				}),
				isLeadership && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Parents",
					value: String(s?.parents ?? 0),
					icon: Users
				}),
				" ",
				isLeadership && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Teachers",
					value: String(s?.teachers ?? 0),
					icon: Users
				}),
				isLeadership && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Classes",
					value: String(s?.classes ?? 0),
					icon: CalendarDays
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: isLeadership || parent || student ? "Fees outstanding" : "Present today",
					value: isLeadership || parent || student ? money(s?.outstanding ?? 0) : String(s?.present ?? 0),
					icon: isLeadership || parent || student ? Wallet : ClipboardCheck
				}),
				isLeadership && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Low-stock items",
					value: String(s?.lowStock ?? 0),
					icon: TriangleAlert
				}),
				" ",
				isLeadership && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Shop orders",
					value: String(s?.orders ?? 0),
					icon: ShoppingBag
				}),
				parent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "School shop orders",
					value: String(s?.orders ?? 0),
					icon: ShoppingBag
				}),
				" ",
				parent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Documents",
					value: String(s?.documents ?? 0),
					icon: FileText
				}),
				(teacher || student) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Upcoming exams",
					value: String(s?.upcomingExams ?? 0),
					icon: GraduationCap
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "size-4 text-primary" }), "Latest announcements"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/portal/announcements",
				className: "text-primary hover:underline",
				children: "View all announcements"
			}) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-3",
				children: announcements.data?.length ? announcements.data.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: a.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 line-clamp-2 text-sm text-muted-foreground",
						children: a.body
					})]
				}, a.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No announcements yet."
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-4 text-primary" }), "Upcoming events"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "School calendar highlights" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-3",
				children: events.data?.length ? events.data.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: e.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							new Date(e.starts_at).toLocaleString(),
							" ",
							e.venue ? `· ${e.venue}` : ""
						]
					})]
				}, e.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No upcoming events."
				})
			})] })]
		}),
		isLeadership && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4 text-primary" }), "Management shortcuts"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/portal/finance",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "px-3 py-2",
							children: "Finance"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/portal/inventory",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "mr-1 inline size-3" }), "Inventory"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/portal/audit-logs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "px-3 py-2",
							children: "Audit Logs"
						})
					})
				]
			})]
		})
	] });
}
//#endregion
export { DashboardPage as component };

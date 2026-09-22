import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { a as fullName, c as logoUrl, d as roleLabels, f as school } from "./school-BBKER8cz.mjs";
import { t as cn } from "./utils-DTw8Xhwa.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useI18n } from "./i18n-BnVRWSRt.mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./use-auth-BfiWx6iO.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { $ as ChartColumn, A as Package, H as FileText, I as LogOut, L as LayoutDashboard, M as Menu, N as Megaphone, V as GraduationCap, _ as ShieldCheck, at as BookOpen, b as Search, c as UserPlus, ct as Award, i as Users, j as MessageSquare, l as UserCog, n as Wallet, nt as CalendarDays, o as UserRound, q as ClipboardCheck, st as Bell, v as Settings } from "../_libs/lucide-react.mjs";
import { n as SheetContent, r as SheetTrigger, t as Sheet } from "./sheet-D3Ay3w5R.mjs";
import { _ as useNavigate, f as Outlet, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CycotAhG.mjs";
import { t as ProfileAvatar } from "./profile-avatar-B7fU-LT1.mjs";
import { t as _e } from "../_libs/cmdk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-Ds_UAURA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Command$1 = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e, {
	ref,
	className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
	...props
}));
Command$1.displayName = _e.displayName;
var CommandInput = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "flex items-center border-b px-3",
	"cmdk-input-wrapper": "",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
		ref,
		className: cn("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	})]
}));
CommandInput.displayName = _e.Input.displayName;
var CommandList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.List, {
	ref,
	className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
	...props
}));
CommandList.displayName = _e.List.displayName;
var CommandEmpty = import_react.forwardRef((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
	ref,
	className: "py-6 text-center text-sm",
	...props
}));
CommandEmpty.displayName = _e.Empty.displayName;
var CommandGroup = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
	ref,
	className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
	...props
}));
CommandGroup.displayName = _e.Group.displayName;
var CommandSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Separator, {
	ref,
	className: cn("-mx-1 h-px bg-border", className),
	...props
}));
CommandSeparator.displayName = _e.Separator.displayName;
var CommandItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
	ref,
	className: cn("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className),
	...props
}));
CommandItem.displayName = _e.Item.displayName;
var CommandShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
		...props
	});
};
CommandShortcut.displayName = "CommandShortcut";
var items = [
	{
		to: "/dashboard",
		label: "Dashboard",
		key: "dashboard",
		icon: LayoutDashboard,
		show: () => true
	},
	{
		to: "/portal/admissions",
		label: "Admissions",
		icon: UserPlus,
		show: (p) => p.isLeadership
	},
	{
		to: "/portal/students",
		label: "Students",
		key: "students",
		icon: GraduationCap,
		show: (p) => p.isLeadership || p.isTeacher || p.isParent || p.isStudent
	},
	{
		to: "/portal/classes",
		label: "Classes",
		key: "classes",
		icon: BookOpen,
		show: (p) => p.isLeadership || p.isTeacher
	},
	{
		to: "/portal/classes",
		label: "My Subjects",
		icon: BookOpen,
		show: (p) => p.isTeacher && !p.isLeadership
	},
	{
		to: "/portal/staff",
		label: "Staff",
		icon: UserCog,
		show: (p) => p.isLeadership
	},
	{
		to: "/portal/parents",
		label: "Parents",
		icon: Users,
		show: (p) => p.isLeadership
	},
	{
		to: "/portal/attendance",
		label: "Attendance",
		key: "attendance",
		icon: ClipboardCheck,
		show: (p) => p.isLeadership || p.isTeacher || p.isParent || p.isStudent
	},
	{
		to: "/portal/timetable",
		label: "Timetable",
		key: "timetable",
		icon: CalendarDays,
		show: () => true
	},
	{
		to: "/portal/calendar",
		label: "School Calendar",
		icon: CalendarDays,
		show: () => true
	},
	{
		to: "/portal/exams",
		label: "Exams",
		icon: FileText,
		show: () => true
	},
	{
		to: "/portal/exams",
		label: "Marks & Results",
		icon: ClipboardCheck,
		show: (p) => p.isTeacher || p.isLeadership
	},
	{
		to: "/portal/academic",
		label: "Academic Records",
		icon: Award,
		show: () => true
	},
	{
		to: "/portal/documents",
		label: "School Documents",
		icon: FileText,
		show: (p) => p.isLeadership || p.isParent || p.isStudent
	},
	{
		to: "/portal/finance",
		label: "Finance",
		key: "finance",
		icon: Wallet,
		show: (p) => p.isAdmin || p.isLeadership || p.isParent || p.isStudent
	},
	{
		to: "/portal/inventory",
		label: "Inventory",
		icon: Package,
		show: (p) => p.isAdmin || p.isLeadership || p.isParent
	},
	{
		to: "/portal/announcements",
		label: "Announcements",
		key: "announcements",
		icon: Megaphone,
		show: () => true
	},
	{
		to: "/portal/messages",
		label: "Messages",
		key: "messages",
		icon: MessageSquare,
		show: () => true
	},
	{
		to: "/portal/profile",
		label: "Profile",
		key: "profile",
		icon: UserRound,
		show: () => true
	},
	{
		to: "/portal/settings",
		label: "School Settings",
		icon: Settings,
		show: (p) => p.isAdmin
	},
	{
		to: "/portal/reports",
		label: "Reports Center",
		icon: ChartColumn,
		show: (p) => p.isLeadership
	},
	{
		to: "/portal/audit-logs",
		label: "Security & Audit Logs",
		icon: ShieldCheck,
		show: (p) => p.isAdmin
	}
];
function PortalShell({ children }) {
	const { t } = useI18n();
	const { profile, primaryRole, isStaff, isAdmin, isLeadership, hasRole } = useMe();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const [results, setResults] = (0, import_react.useState)([]);
	const perms = {
		isStaff,
		isAdmin,
		isParent: hasRole("parent"),
		isLeadership,
		isTeacher: hasRole("teacher"),
		isStudent: hasRole("student")
	};
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setSearchOpen(true);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	(0, import_react.useEffect)(() => {
		let active = true;
		const run = async () => {
			const q = search.trim();
			if (q.length < 2) {
				setResults([]);
				return;
			}
			const pattern = `%${q.replace(/[%_,]/g, "\\$&")}%`;
			const [byFirst, byLast, byAdmission] = await Promise.all([
				supabase.from("students").select("id,first_name,last_name,admission_no").ilike("first_name", pattern).limit(8),
				supabase.from("students").select("id,first_name,last_name,admission_no").ilike("last_name", pattern).limit(8),
				supabase.from("students").select("id,first_name,last_name,admission_no").ilike("admission_no", pattern).limit(8)
			]);
			if (byFirst.error ?? byLast.error ?? byAdmission.error) {
				if (active) setResults([]);
				return;
			}
			const seen = /* @__PURE__ */ new Set();
			const data = [
				...byFirst.data ?? [],
				...byLast.data ?? [],
				...byAdmission.data ?? []
			].filter((row) => {
				if (seen.has(row.id)) return false;
				seen.add(row.id);
				return true;
			}).slice(0, 8);
			if (active) setResults((data ?? []).map((x) => ({
				...x,
				href: "/portal/students/$studentId",
				params: { studentId: x.id }
			})));
		};
		const timer = setTimeout(run, 250);
		return () => {
			active = false;
			clearTimeout(timer);
		};
	}, [search]);
	const visible = items.filter((i) => i.show(perms));
	const name = fullName(profile) || "Portal user";
	async function signOut() {
		await queryClient.cancelQueries();
		queryClient.clear();
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	}
	const nav = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-col gap-1",
		children: visible.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: item.to,
			onClick: () => setOpen(false),
			className: "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-navy-foreground/75 hover:bg-white/10 hover:text-navy-foreground",
			activeProps: { className: "bg-white/15 !text-navy-foreground" },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.key ? t(item.key) : item.label]
		}, `${item.to}-${item.label}`))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-secondary/40 lg:grid lg:grid-cols-[16rem_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden bg-navy p-4 text-navy-foreground lg:block",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-3 px-1 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: logoUrl,
						alt: `${school.name} logo`,
						className: "size-10 rounded-full object-cover ring-2 ring-accent"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-sm font-extrabold",
						children: school.shortName
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-4 h-px bg-white/15" }),
				nav
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-screen flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border/70 bg-background/95 px-4 backdrop-blur",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "hidden w-64 justify-between text-muted-foreground lg:flex",
							onClick: () => setSearchOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" }), "Search students..."]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
								className: "rounded border bg-muted px-1.5 py-0.5 text-[10px]",
								children: "Ctrl K"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "lg:hidden",
							onClick: () => setSearchOpen(true),
							"aria-label": "Search",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
							open,
							onOpenChange: setOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "icon",
									className: "lg:hidden",
									"aria-label": "Open portal navigation",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
								side: "left",
								className: "h-dvh max-h-dvh w-72 overflow-y-auto bg-navy text-navy-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-8 pb-2",
									children: nav
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex min-w-0 items-center gap-1 sm:gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									"aria-label": "Notifications",
									onClick: () => navigate({ to: "/portal/announcements" }),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden min-w-0 text-right sm:block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-navy",
										children: name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-[11px] uppercase tracking-brand text-muted-foreground",
										children: roleLabels[primaryRole]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileAvatar, {
									path: profile?.photo_url,
									name,
									size: "sm"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: signOut,
									"aria-label": t("logout"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" })
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
					open: searchOpen,
					onOpenChange: setSearchOpen,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
						className: "overflow-hidden p-0 sm:max-w-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "sr-only",
							children: "Global school search"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Command$1, {
							shouldFilter: false,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandInput, {
								autoFocus: true,
								placeholder: "Search by student name or admission number...",
								value: search,
								onValueChange: setSearch
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandEmpty, { children: search.length < 2 ? "Type at least 2 characters." : "No students found." }), results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
								heading: "Students",
								children: results.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
									value: r.id,
									onSelect: () => {
										setSearchOpen(false);
										setSearch("");
										navigate({
											to: r.href,
											params: r.params
										});
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "mr-2 size-4" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											r.first_name,
											" ",
											r.last_name
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-auto text-xs text-muted-foreground",
											children: r.admission_no
										})
									]
								}, r.id))
							})] })]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 p-4 sm:p-8",
					children
				})
			]
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
//#endregion
export { SplitComponent as component };

import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { i as fetchSchoolSettings, t as SCHOOL_SETTINGS_QUERY_KEY } from "./school-CK2M8GiK.mjs";
import { t as cn } from "./utils-DTw8Xhwa.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./use-auth-BfiWx6iO.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { B as GraduationCap, K as CreditCard, O as Palette, Q as Check, V as FileText, at as Building2, b as Save, ct as Bell, f as Smartphone, g as ShieldCheck, i as Users, rt as CalendarDays } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-BG-idtzq.mjs";
import { t as Label } from "./label-BsoyNsWq.mjs";
import { t as Textarea } from "./textarea-lY6r0rtj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader } from "./page-header-D2pXXqT-.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-B70CjJ0u.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.settings-B1HcX1mP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
var schoolSettingsColumnKeys = Object.keys({
	school_name: "",
	short_name: "",
	motto: "",
	phone: "",
	email: "",
	address: "",
	county: "",
	logo_url: "",
	website: "",
	registration_number: "",
	knec_number: "",
	principal_name: "",
	school_type: "",
	opening_time: "",
	closing_time: "",
	timezone: "",
	date_format: "",
	time_format: "",
	language: "",
	academic_year: "",
	current_term: "",
	term_start_date: "",
	term_end_date: "",
	grading_scheme: "",
	grading_scale: "",
	pass_mark: 0,
	promotion_enabled: true,
	receipt_prefix: "",
	document_prefix: "",
	admission_prefix: "",
	fee_invoice_prefix: "",
	certificate_prefix: "",
	currency: "",
	parent_portal_enabled: true,
	student_portal_enabled: true,
	online_admission_enabled: true,
	profile_photo_required: false,
	teacher_subject_assignment_enabled: true,
	teacher_remarks_enabled: true,
	attendance_alerts: true,
	automatic_absence_alerts: true,
	attendance_late_after_minutes: 0,
	announcement_notifications: true,
	exam_reminders: true,
	fee_reminders: true,
	sms_enabled: false,
	fee_payment_sms: true,
	result_sms: false,
	birthday_notifications: false,
	sms_sender_name: "",
	mpesa_paybill: "",
	mpesa_till: "",
	mpesa_account_name: "",
	report_card_signature_name: "",
	report_card_signature_title: "",
	report_card_footer: "",
	receipt_footer: "",
	primary_color: "",
	secondary_color: "",
	login_page_message: "",
	calendar_reminders_enabled: true,
	event_reminder_minutes: 0,
	login_notifications: false,
	session_timeout_minutes: 0,
	failed_login_protection: true,
	maintenance_mode: false
});
var defaults = {
	school_name: "Rahma Junior Education Center",
	short_name: "Rahma Junior",
	motto: "Foundation for Knowledge",
	phone: "",
	email: "",
	address: "",
	county: "Nairobi",
	logo_url: "",
	website: "",
	registration_number: "",
	knec_number: "",
	principal_name: "",
	school_type: "private",
	opening_time: "07:30",
	closing_time: "16:30",
	timezone: "Africa/Nairobi",
	date_format: "dd/MM/yyyy",
	time_format: "24h",
	language: "en",
	academic_year: "2026",
	current_term: "Term 1",
	term_start_date: "",
	term_end_date: "",
	grading_scheme: "standard",
	grading_scale: "standard",
	pass_mark: 50,
	promotion_enabled: true,
	receipt_prefix: "RCT",
	document_prefix: "DOC",
	admission_prefix: "RJ",
	fee_invoice_prefix: "INV",
	certificate_prefix: "CERT",
	currency: "KSh",
	parent_portal_enabled: true,
	student_portal_enabled: true,
	online_admission_enabled: true,
	profile_photo_required: false,
	teacher_subject_assignment_enabled: true,
	teacher_remarks_enabled: true,
	attendance_alerts: true,
	automatic_absence_alerts: true,
	attendance_late_after_minutes: 15,
	announcement_notifications: true,
	exam_reminders: true,
	fee_reminders: true,
	sms_enabled: false,
	fee_payment_sms: true,
	result_sms: false,
	birthday_notifications: false,
	sms_sender_name: "",
	mpesa_paybill: "",
	mpesa_till: "",
	mpesa_account_name: "",
	report_card_signature_name: "",
	report_card_signature_title: "Head Teacher",
	report_card_footer: "",
	receipt_footer: "",
	primary_color: "#0f766e",
	secondary_color: "#0f172a",
	login_page_message: "",
	calendar_reminders_enabled: true,
	event_reminder_minutes: 60,
	login_notifications: false,
	session_timeout_minutes: 60,
	failed_login_protection: true,
	maintenance_mode: false
};
var sections = [
	{
		id: "school",
		label: "School Profile",
		icon: Building2
	},
	{
		id: "academic",
		label: "Academic",
		icon: GraduationCap
	},
	{
		id: "portals",
		label: "Portals & Users",
		icon: Users
	},
	{
		id: "attendance",
		label: "Attendance",
		icon: Check
	},
	{
		id: "finance",
		label: "Finance & M-Pesa",
		icon: CreditCard
	},
	{
		id: "notifications",
		label: "Notifications & SMS",
		icon: Smartphone
	},
	{
		id: "documents",
		label: "Documents",
		icon: FileText
	},
	{
		id: "calendar",
		label: "Calendar",
		icon: CalendarDays
	},
	{
		id: "appearance",
		label: "Appearance",
		icon: Palette
	},
	{
		id: "security",
		label: "Security & System",
		icon: ShieldCheck
	}
];
function SettingsPage() {
	const { userId } = useMe();
	const qc = useQueryClient();
	const [active, setActive] = (0, import_react.useState)("school");
	const [form, setForm] = (0, import_react.useState)(defaults);
	const [savedSnapshot, setSavedSnapshot] = (0, import_react.useState)(defaults);
	const query = useQuery({
		queryKey: SCHOOL_SETTINGS_QUERY_KEY,
		queryFn: async () => {
			const settings = await fetchSchoolSettings();
			return {
				...defaults,
				...settings
			};
		}
	});
	(0, import_react.useEffect)(() => {
		if (query.data) {
			setForm(query.data);
			setSavedSnapshot(query.data);
		}
	}, [query.data]);
	const hasUnsavedChanges = (0, import_react.useMemo)(() => JSON.stringify(form) !== JSON.stringify(savedSnapshot), [form, savedSnapshot]);
	(0, import_react.useEffect)(() => {
		if (!hasUnsavedChanges) return;
		const onBeforeUnload = (event) => {
			event.preventDefault();
			event.returnValue = "";
		};
		window.addEventListener("beforeunload", onBeforeUnload);
		return () => window.removeEventListener("beforeunload", onBeforeUnload);
	}, [hasUnsavedChanges]);
	function validateSettings() {
		const passMark = Number(valueOf(form, "pass_mark"));
		const lateAfter = Number(valueOf(form, "attendance_late_after_minutes"));
		const timeout = Number(valueOf(form, "session_timeout_minutes"));
		const reminder = Number(valueOf(form, "event_reminder_minutes"));
		const start = String(valueOf(form, "term_start_date"));
		const end = String(valueOf(form, "term_end_date"));
		const opening = String(valueOf(form, "opening_time"));
		const closing = String(valueOf(form, "closing_time"));
		if (!String(valueOf(form, "school_name")).trim()) return "School name is required.";
		if (!Number.isFinite(passMark) || passMark < 0 || passMark > 100) return "Pass mark must be between 0 and 100.";
		if (!Number.isFinite(lateAfter) || lateAfter < 0) return "Late-after minutes cannot be negative.";
		if (!Number.isFinite(timeout) || timeout < 5) return "Session timeout must be at least 5 minutes.";
		if (!Number.isFinite(reminder) || reminder < 0) return "Event reminder minutes cannot be negative.";
		if (start && end && start > end) return "Term end date cannot be before the term start date.";
		if (opening && closing && opening >= closing) return "Closing time must be later than opening time.";
		const primary = String(valueOf(form, "primary_color"));
		const secondary = String(valueOf(form, "secondary_color"));
		if (!/^#[0-9a-fA-F]{6}$/.test(primary)) return "Primary color must be a valid 6-digit hex color.";
		if (!/^#[0-9a-fA-F]{6}$/.test(secondary)) return "Secondary color must be a valid 6-digit hex color.";
		return null;
	}
	const save = useMutation({
		mutationFn: async () => {
			const validationError = validateSettings();
			if (validationError) throw new Error(validationError);
			const upsertPayload = {
				...Object.fromEntries(schoolSettingsColumnKeys.map((key) => {
					const value = form[key];
					if (typeof value === "string" && value.trim() === "") return [key, null];
					return [key, value ?? null];
				})),
				id: true,
				updated_by: userId ?? null,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			};
			const { error } = await supabase.from("school_settings").upsert(upsertPayload, { onConflict: "id" });
			if (error) throw error;
		},
		onSuccess: async () => {
			setSavedSnapshot(form);
			toast.success("School settings saved successfully");
			const latest = await fetchSchoolSettings();
			qc.setQueryData(SCHOOL_SETTINGS_QUERY_KEY, {
				...defaults,
				...latest
			});
			await qc.invalidateQueries({ queryKey: SCHOOL_SETTINGS_QUERY_KEY });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save settings")
	});
	const set = (key, value) => setForm((f) => ({
		...f,
		[key]: value
	}));
	const value = (key) => form[key] ?? "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "School Control Center",
				description: "One place to control your school's identity, academics, finance, portals, notifications, documents, security and appearance.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						hasUnsavedChanges && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800",
							children: "Unsaved changes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setForm(savedSnapshot),
							disabled: !hasUnsavedChanges || save.isPending,
							children: "Reset"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							onClick: () => save.mutate(),
							disabled: save.isPending || !hasUnsavedChanges,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-2 size-4" }), save.isPending ? "Saving…" : "Save all changes"]
						})
					]
				})
			}),
			query.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: "Settings could not be loaded."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-muted-foreground",
						children: query.error instanceof Error ? query.error.message : "Please try again."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						variant: "outline",
						onClick: () => query.refetch(),
						children: "Try again"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[250px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "h-fit lg:sticky lg:top-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Settings"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "space-y-1 p-3",
						children: sections.map((s) => {
							const Icon = s.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setActive(s.id),
								className: `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${active === s.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), s.label]
							}, s.id);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						active === "school" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
							icon: Building2,
							title: "School Profile",
							description: "Identity and contact information used across the portal.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "School name",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("school_name")),
											onChange: (e) => set("school_name", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Short name",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("short_name")),
											onChange: (e) => set("short_name", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Motto",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("motto")),
											onChange: (e) => set("motto", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Principal / Headteacher",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("principal_name")),
											onChange: (e) => set("principal_name", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Phone",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("phone")),
											onChange: (e) => set("phone", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Email",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "email",
											value: String(value("email")),
											onChange: (e) => set("email", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "County",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("county")),
											onChange: (e) => set("county", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Website",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("website")),
											onChange: (e) => set("website", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Registration number",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("registration_number")),
											onChange: (e) => set("registration_number", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "KNEC / school identifier",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("knec_number")),
											onChange: (e) => set("knec_number", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "sm:col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Physical address",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: String(value("address")),
												onChange: (e) => set("address", e.target.value)
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Logo URL",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("logo_url")),
											onChange: (e) => set("logo_url", e.target.value),
											placeholder: "https://…"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "School type",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: String(value("school_type")),
											onValueChange: (v) => set("school_type", v),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "private",
													children: "Private"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "public",
													children: "Public"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "other",
													children: "Other"
												})
											] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Opening time",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "time",
											value: String(value("opening_time")),
											onChange: (e) => set("opening_time", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Closing time",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "time",
											value: String(value("closing_time")),
											onChange: (e) => set("closing_time", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Time format",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: String(value("time_format")),
											onValueChange: (v) => set("time_format", v),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "24h",
												children: "24-hour"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "12h",
												children: "12-hour"
											})] })]
										})
									})
								]
							})
						}),
						active === "academic" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
							icon: GraduationCap,
							title: "Academic & CBC Settings",
							description: "Configure the active academic period and grading behaviour.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Academic year",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("academic_year")),
											onChange: (e) => set("academic_year", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Current term",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: String(value("current_term")),
											onValueChange: (v) => set("current_term", v),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Term 1",
													children: "Term 1"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Term 2",
													children: "Term 2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Term 3",
													children: "Term 3"
												})
											] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Term start",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: String(value("term_start_date")),
											onChange: (e) => set("term_start_date", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Term end",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: String(value("term_end_date")),
											onChange: (e) => set("term_end_date", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Grading scheme",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: String(value("grading_scheme")),
											onValueChange: (v) => set("grading_scheme", v),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "standard",
												children: "Standard A–E"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "cbc",
												children: "CBC-style descriptors"
											})] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Grading scale",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: String(value("grading_scale")),
											onValueChange: (v) => set("grading_scale", v),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "standard",
													children: "Standard"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "percentage",
													children: "Percentage"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "cbc",
													children: "CBC descriptors"
												})
											] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Pass mark (%)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											min: "0",
											max: "100",
											value: String(value("pass_mark")),
											onChange: (e) => set("pass_mark", Number(e.target.value))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "sm:col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
											label: "Enable student promotion workflow",
											description: "Allow the academic workflow to promote students at the end of the academic cycle.",
											checked: Boolean(value("promotion_enabled")),
											onChange: (v) => set("promotion_enabled", v)
										})
									})
								]
							})
						}),
						active === "portals" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
							icon: Users,
							title: "Portals & User Controls",
							description: "Control which major portal and workflow features are available.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										label: "Parent portal",
										description: "Allow parent accounts to use the portal.",
										checked: Boolean(value("parent_portal_enabled")),
										onChange: (v) => set("parent_portal_enabled", v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										label: "Student portal",
										description: "Allow student accounts to use the portal.",
										checked: Boolean(value("student_portal_enabled")),
										onChange: (v) => set("student_portal_enabled", v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										label: "Online admissions",
										description: "Enable the public admission workflow.",
										checked: Boolean(value("online_admission_enabled")),
										onChange: (v) => set("online_admission_enabled", v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										label: "Require student profile photos",
										description: "Make a profile photo part of the student profile workflow.",
										checked: Boolean(value("profile_photo_required")),
										onChange: (v) => set("profile_photo_required", v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										label: "Teacher subject assignment",
										description: "Enable teacher-to-subject assignment workflows.",
										checked: Boolean(value("teacher_subject_assignment_enabled")),
										onChange: (v) => set("teacher_subject_assignment_enabled", v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										label: "Teacher remarks",
										description: "Allow teachers to enter class and student remarks.",
										checked: Boolean(value("teacher_remarks_enabled")),
										onChange: (v) => set("teacher_remarks_enabled", v)
									})
								]
							})
						}),
						active === "attendance" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
							icon: Check,
							title: "Attendance",
							description: "Attendance rules and parent alert controls.",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Late after (minutes)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: "0",
										value: String(value("attendance_late_after_minutes")),
										onChange: (e) => set("attendance_late_after_minutes", Number(e.target.value))
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
									label: "Attendance alerts",
									description: "Enable attendance notification workflows.",
									checked: Boolean(value("attendance_alerts")),
									onChange: (v) => set("attendance_alerts", v)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
									label: "Automatic absence alerts",
									description: "Send configured alerts when a student is marked absent.",
									checked: Boolean(value("automatic_absence_alerts")),
									onChange: (v) => set("automatic_absence_alerts", v)
								})]
							})]
						}),
						active === "finance" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
							icon: CreditCard,
							title: "Finance & M-Pesa",
							description: "Currency, numbering and Kenyan payment configuration.",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Currency",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: String(value("currency")),
											onValueChange: (v) => set("currency", v),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "KSh",
													children: "KSh — Kenyan Shilling"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "USD",
													children: "USD — US Dollar"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "UGX",
													children: "UGX — Ugandan Shilling"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "TZS",
													children: "TZS — Tanzanian Shilling"
												})
											] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Fee invoice prefix",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("fee_invoice_prefix")),
											onChange: (e) => set("fee_invoice_prefix", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Receipt prefix",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("receipt_prefix")),
											onChange: (e) => set("receipt_prefix", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Admission prefix",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("admission_prefix")),
											onChange: (e) => set("admission_prefix", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "M-Pesa PayBill",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("mpesa_paybill")),
											onChange: (e) => set("mpesa_paybill", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "M-Pesa Till",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("mpesa_till")),
											onChange: (e) => set("mpesa_till", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "M-Pesa account/reference name",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("mpesa_account_name")),
											onChange: (e) => set("mpesa_account_name", e.target.value)
										})
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 rounded-lg border p-4 text-sm text-muted-foreground",
								children: "M-Pesa API credentials should remain in Supabase Edge Function secrets, never in this page."
							})]
						}),
						active === "notifications" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
							icon: Bell,
							title: "Notifications & SMS",
							description: "Master switches for communication workflows.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										label: "SMS automation",
										description: "Master switch for automated SMS workflows.",
										checked: Boolean(value("sms_enabled")),
										onChange: (v) => set("sms_enabled", v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										label: "Fee payment SMS",
										description: "Notify parents after successful fee payments.",
										checked: Boolean(value("fee_payment_sms")),
										onChange: (v) => set("fee_payment_sms", v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										label: "Fee reminders",
										description: "Allow fee reminder workflows.",
										checked: Boolean(value("fee_reminders")),
										onChange: (v) => set("fee_reminders", v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										label: "Result SMS",
										description: "Allow result publication notifications by SMS.",
										checked: Boolean(value("result_sms")),
										onChange: (v) => set("result_sms", v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										label: "Exam reminders",
										description: "Allow exam reminder workflows.",
										checked: Boolean(value("exam_reminders")),
										onChange: (v) => set("exam_reminders", v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										label: "Announcements",
										description: "Notify users about published school announcements.",
										checked: Boolean(value("announcement_notifications")),
										onChange: (v) => set("announcement_notifications", v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										label: "Birthday notifications",
										description: "Enable birthday notification workflows.",
										checked: Boolean(value("birthday_notifications")),
										onChange: (v) => set("birthday_notifications", v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "SMS sender name",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("sms_sender_name")),
											onChange: (e) => set("sms_sender_name", e.target.value),
											placeholder: "RAHMA"
										})
									})
								]
							})
						}),
						active === "documents" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
							icon: FileText,
							title: "Documents & Reports",
							description: "Branding and numbering defaults for generated documents.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Document prefix",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("document_prefix")),
											onChange: (e) => set("document_prefix", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Certificate prefix",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("certificate_prefix")),
											onChange: (e) => set("certificate_prefix", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Report-card signature name",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("report_card_signature_name")),
											onChange: (e) => set("report_card_signature_name", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Signature title",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(value("report_card_signature_title")),
											onChange: (e) => set("report_card_signature_title", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "sm:col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Report-card footer",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												value: String(value("report_card_footer")),
												onChange: (e) => set("report_card_footer", e.target.value)
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "sm:col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Receipt footer",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												value: String(value("receipt_footer")),
												onChange: (e) => set("receipt_footer", e.target.value)
											})
										})
									})
								]
							})
						}),
						active === "calendar" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
							icon: CalendarDays,
							title: "School Calendar",
							description: "Calendar reminder defaults for school events.",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Default event reminder (minutes)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: "0",
										value: String(value("event_reminder_minutes")),
										onChange: (e) => set("event_reminder_minutes", Number(e.target.value))
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
									label: "Calendar reminders",
									description: "Enable reminders for school calendar events.",
									checked: Boolean(value("calendar_reminders_enabled")),
									onChange: (v) => set("calendar_reminders_enabled", v)
								})
							})]
						}),
						active === "appearance" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
							icon: Palette,
							title: "Appearance & Branding",
							description: "Control the portal's school branding defaults.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Primary color",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "text",
											value: String(value("primary_color")),
											onChange: (e) => set("primary_color", e.target.value),
											placeholder: "#0f766e"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Secondary color",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "text",
											value: String(value("secondary_color")),
											onChange: (e) => set("secondary_color", e.target.value),
											placeholder: "#0f172a"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "sm:col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Login page message",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												value: String(value("login_page_message")),
												onChange: (e) => set("login_page_message", e.target.value),
												placeholder: "Welcome to our school portal…"
											})
										})
									})
								]
							})
						}),
						active === "security" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
							icon: ShieldCheck,
							title: "Security & System",
							description: "Central defaults for account sessions and maintenance.",
							warning: true,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Session timeout (minutes)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											min: "5",
											value: String(value("session_timeout_minutes")),
											onChange: (e) => set("session_timeout_minutes", Number(e.target.value))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Timezone",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: String(value("timezone")),
											onValueChange: (v) => set("timezone", v),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Africa/Nairobi",
													children: "Africa/Nairobi (Kenya)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Africa/Kampala",
													children: "Africa/Kampala (Uganda)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Africa/Dar_es_Salaam",
													children: "Africa/Dar_es_Salaam (Tanzania)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "UTC",
													children: "UTC"
												})
											] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Date format",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: String(value("date_format")),
											onValueChange: (v) => set("date_format", v),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "dd/MM/yyyy",
													children: "DD/MM/YYYY"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "MM/dd/yyyy",
													children: "MM/DD/YYYY"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "yyyy-MM-dd",
													children: "YYYY-MM-DD"
												})
											] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Language",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: String(value("language")),
											onValueChange: (v) => set("language", v),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "en",
												children: "English"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "sw",
												children: "Kiswahili"
											})] })]
										})
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										label: "Failed-login protection",
										description: "Keep protection against repeated failed login attempts enabled.",
										checked: Boolean(value("failed_login_protection")),
										onChange: (v) => set("failed_login_protection", v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										label: "Login notifications",
										description: "Enable login notification workflows when supported.",
										checked: Boolean(value("login_notifications")),
										onChange: (v) => set("login_notifications", v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										label: "Maintenance mode",
										description: "Reserve for controlled maintenance. This does not automatically block every route until the application consumes this flag.",
										checked: Boolean(value("maintenance_mode")),
										onChange: (v) => set("maintenance_mode", v)
									})
								]
							})]
						})
					]
				})]
			})
		]
	});
}
function valueOf(settings, key) {
	return settings[key] ?? "";
}
function SectionCard({ icon: Icon, title, description, children, warning = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: warning ? "border-amber-200" : "",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
			className: "flex items-center gap-2 text-base",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5 text-primary" }), title]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: description
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children })]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
function Toggle({ label, description, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-4 rounded-lg border border-border/70 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium text-navy",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-muted-foreground",
			children: description
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked,
			onCheckedChange: onChange
		})]
	});
}
//#endregion
export { SettingsPage as component };

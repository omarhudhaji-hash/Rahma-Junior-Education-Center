import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./use-auth-BfiWx6iO.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { D as Pencil, T as Plus, d as Trash2, rt as CalendarDays } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-BG-idtzq.mjs";
import { t as Label } from "./label-BsoyNsWq.mjs";
import { t as Textarea } from "./textarea-lY6r0rtj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader, t as EmptyState } from "./page-header-D2pXXqT-.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-B70CjJ0u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.calendar-jen7qSly.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var types = [
	"school_event",
	"parent_meeting",
	"staff_meeting",
	"exam",
	"sports",
	"trip",
	"holiday",
	"other"
];
var audiences = [
	"everyone",
	"parents",
	"students",
	"teachers",
	"class"
];
var label = (v) => v.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
function CalendarPage() {
	const { isLeadership, userId } = useMe();
	const qc = useQueryClient();
	const [month, setMonth] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 7));
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const start = `${month}-01`;
	const end = new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0).toISOString().slice(0, 10);
	const events = useQuery({
		queryKey: [
			"school-events",
			month,
			userId
		],
		queryFn: async () => {
			const { data, error } = await supabase.from("school_events").select("*").gte("start_at", `${start}T00:00:00`).lte("start_at", `${end}T23:59:59`).order("start_at");
			if (error) throw error;
			return data ?? [];
		}
	});
	const classes = useQuery({
		queryKey: ["calendar-classes"],
		enabled: isLeadership,
		queryFn: async () => {
			const { data, error } = await supabase.from("classes").select("id,name,section").order("level_order");
			if (error) throw error;
			return data ?? [];
		}
	});
	const save = useMutation({
		mutationFn: async (f) => {
			const payload = {
				title: f.title,
				description: f.description || null,
				event_type: f.event_type,
				audience: f.audience,
				target_class_id: f.audience === "class" ? f.target_class_id || null : null,
				start_at: `${f.date}T${f.start_time}:00`,
				end_at: f.end_time ? `${f.date}T${f.end_time}:00` : null,
				location: f.location || null,
				reminder_minutes: Number(f.reminder_minutes || 0) || null
			};
			const { error } = await (editing ? supabase.from("school_events").update(payload).eq("id", editing.id) : supabase.from("school_events").insert(payload));
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success(editing ? "Event updated." : "Event created.");
			setEditing(null);
			setShowForm(false);
			qc.invalidateQueries({ queryKey: ["school-events"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save event")
	});
	const remove = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("school_events").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Event deleted.");
			qc.invalidateQueries({ queryKey: ["school-events"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not delete event")
	});
	const formEvent = editing ? {
		...editing,
		date: editing.start_at.slice(0, 10),
		start_time: editing.start_at.slice(11, 16),
		end_time: editing.end_at?.slice(11, 16) ?? "",
		reminder_minutes: editing.reminder_minutes ?? "",
		target_class_id: editing.target_class_id ?? ""
	} : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "School Calendar",
				description: "View school events, exams, meetings and important dates.",
				actions: isLeadership ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						setEditing(null);
						setShowForm(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 size-4" }), "Add event"]
				}) : void 0
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "flex flex-wrap items-end gap-3 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Month" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-2 w-48",
					type: "month",
					value: month,
					onChange: (e) => setMonth(e.target.value)
				})] })
			}) }),
			isLeadership && showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventForm, {
				initial: formEvent,
				classes: classes.data ?? [],
				onSave: (f) => save.mutate(f),
				onCancel: () => {
					setShowForm(false);
					setEditing(null);
				},
				saving: save.isPending
			}),
			(events.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No calendar events for this month." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
				children: (events.data ?? []).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: e.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: label(e.event_type)
						})] }), isLeadership && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: () => {
									setEditing(e);
									setShowForm(true);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: () => remove.mutate(e.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-1 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: new Date(e.start_at).toLocaleDateString(void 0, {
								weekday: "long",
								day: "numeric",
								month: "long",
								year: "numeric"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground",
							children: [new Date(e.start_at).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit"
							}), e.end_at ? ` – ${new Date(e.end_at).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit"
							})}` : ""]
						}),
						e.location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["📍 ", e.location] }),
						e.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "pt-2 text-muted-foreground",
							children: e.description
						})
					]
				})] }, e.id))
			})
		]
	});
}
function EventForm({ initial, classes, onSave, onCancel, saving }) {
	const [f, setF] = (0, import_react.useState)(initial ?? {
		title: "",
		description: "",
		event_type: "school_event",
		audience: "everyone",
		target_class_id: "",
		date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		start_time: "08:00",
		end_time: "09:00",
		location: "",
		reminder_minutes: "60"
	});
	const set = (k, v) => setF((x) => ({
		...x,
		[k]: v
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-4" }), initial ? "Edit event" : "Create event"]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-2",
						value: f.title,
						onChange: (e) => set("title", e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: f.event_type,
						onValueChange: (v) => set("event_type", v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: types.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: t,
							children: label(t)
						}, t)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Audience" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: f.audience,
						onValueChange: (v) => set("audience", v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: audiences.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: a,
							children: label(a)
						}, a)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-2",
						type: "date",
						value: f.date,
						onChange: (e) => set("date", e.target.value)
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Start time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-2",
						type: "time",
						value: f.start_time,
						onChange: (e) => set("start_time", e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "End time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-2",
						type: "time",
						value: f.end_time,
						onChange: (e) => set("end_time", e.target.value)
					})] }),
					f.audience === "class" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Class" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: f.target_class_id,
						onValueChange: (v) => set("target_class_id", v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select class" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: classes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: c.id,
							children: [c.name, c.section ? ` — ${c.section}` : ""]
						}, c.id)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reminder (minutes)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-2",
						type: "number",
						min: "0",
						value: f.reminder_minutes,
						onChange: (e) => set("reminder_minutes", e.target.value)
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				className: "mt-2",
				value: f.description,
				onChange: (e) => set("description", e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Location" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "mt-2",
				value: f.location,
				onChange: (e) => set("location", e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => onSave(f),
					disabled: !f.title || !f.date || !f.start_time || saving,
					children: "Save event"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: onCancel,
					children: "Cancel"
				})]
			})
		]
	})] });
}
//#endregion
export { CalendarPage as component };

import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { a as fullName } from "./school-CK2M8GiK.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./use-auth-BfiWx6iO.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { A as MessageSquare, R as History, V as FileText, _ as Settings, f as Smartphone, g as ShieldCheck, i as Users, v as Send } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-BG-idtzq.mjs";
import { t as Label } from "./label-BsoyNsWq.mjs";
import { t as Textarea } from "./textarea-lY6r0rtj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-B3iNh1Qb.mjs";
import { n as PageHeader, t as EmptyState } from "./page-header-D2pXXqT-.mjs";
import { t as Badge } from "./badge-CCuYWPBQ.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-B70CjJ0u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.messages-CH6Q5T1u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MessagesPage() {
	const { userId, hasRole } = useMe();
	const leadership = hasRole("admin") || hasRole("headteacher");
	const teacher = hasRole("teacher");
	const family = hasRole("parent") || hasRole("student");
	const queryClient = useQueryClient();
	const [recipient, setRecipient] = (0, import_react.useState)("");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [smsAudience, setSmsAudience] = (0, import_react.useState)("parents");
	const [smsRecipients, setSmsRecipients] = (0, import_react.useState)([]);
	const [smsMessage, setSmsMessage] = (0, import_react.useState)("");
	const [templateName, setTemplateName] = (0, import_react.useState)("");
	const [templateMessage, setTemplateMessage] = (0, import_react.useState)("");
	const [smsSettings, setSmsSettings] = (0, import_react.useState)(null);
	const people = useQuery({
		queryKey: ["message-people"],
		queryFn: async () => {
			const [{ data: profiles, error }, { data: roleRows, error: roleError }] = await Promise.all([supabase.from("profiles").select("id,first_name,last_name,phone").eq("is_active", true).order("first_name"), supabase.from("user_roles").select("user_id,role")]);
			if (error) throw error;
			if (roleError) throw roleError;
			const roles = /* @__PURE__ */ new Map();
			for (const row of roleRows ?? []) roles.set(row.user_id, [...roles.get(row.user_id) ?? [], row.role]);
			return (profiles ?? []).filter((p) => p.id !== userId).map((p) => ({
				...p,
				roles: roles.get(p.id) ?? []
			})).filter((p) => {
				if (leadership) return true;
				if (teacher) return p.roles.includes("admin") || p.roles.includes("headteacher") || p.roles.includes("parent");
				if (family) return p.roles.includes("admin") || p.roles.includes("headteacher") || p.roles.includes("teacher");
				return false;
			});
		},
		enabled: Boolean(userId)
	});
	const messages = useQuery({
		queryKey: ["messages", userId],
		enabled: Boolean(userId),
		queryFn: async () => {
			const { data, error } = await supabase.from("messages").select("id,subject,body,read_at,created_at,sender_id,recipient_id,sender:sender_id(first_name,last_name),recipient:recipient_id(first_name,last_name)").order("created_at", { ascending: false }).limit(200);
			if (error) throw error;
			return data ?? [];
		}
	});
	const smsHistory = useQuery({
		queryKey: ["sms-history"],
		enabled: leadership,
		queryFn: async () => {
			const { data, error } = await supabase.from("sms_messages").select("id,created_at,recipient_phone,recipient_name,message,status,provider_cost,error_message").order("created_at", { ascending: false }).limit(200);
			if (error) throw error;
			return data ?? [];
		}
	});
	const smsSettingsQuery = useQuery({
		queryKey: ["sms-settings"],
		enabled: leadership,
		queryFn: async () => {
			const { data, error } = await supabase.from("sms_settings").select("*").eq("id", true).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const saveSmsSettings = useMutation({
		mutationFn: async (next) => {
			const { error } = await supabase.from("sms_settings").upsert({
				...next,
				id: true,
				updated_by: userId,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("SMS settings saved");
			queryClient.invalidateQueries({ queryKey: ["sms-settings"] });
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not save SMS settings")
	});
	const templates = useQuery({
		queryKey: ["sms-templates"],
		enabled: leadership,
		queryFn: async () => {
			const { data, error } = await supabase.from("sms_templates").select("id,name,message,is_active").eq("is_active", true).order("name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const send = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("messages").insert({
				sender_id: userId,
				recipient_id: recipient,
				subject: subject.trim() || null,
				body: body.trim()
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Message sent");
			setSubject("");
			setBody("");
			setRecipient("");
			queryClient.invalidateQueries({ queryKey: ["messages"] });
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not send message")
	});
	const audiencePeople = (0, import_react.useMemo)(() => {
		const all = people.data ?? [];
		if (smsAudience === "parents") return all.filter((p) => p.roles.includes("parent") && p.phone);
		if (smsAudience === "teachers") return all.filter((p) => (p.roles.includes("teacher") || p.roles.includes("headteacher")) && p.phone);
		if (smsAudience === "staff") return all.filter((p) => (p.roles.includes("teacher") || p.roles.includes("headteacher") || p.roles.includes("admin")) && p.phone);
		return all.filter((p) => p.phone);
	}, [people.data, smsAudience]);
	const sendSms = useMutation({
		mutationFn: async () => {
			const selected = audiencePeople.filter((p) => smsRecipients.includes(p.id));
			if (!selected.length) throw new Error("Select at least one recipient.");
			if (smsSettingsQuery.data && !smsSettingsQuery.data.sms_enabled) throw new Error("SMS sending is disabled in SMS Settings.");
			if (selected.length > 1 && !window.confirm(`Send this SMS to ${selected.length} recipients? This may incur provider charges.`)) throw new Error("SMS sending cancelled.");
			if (!smsMessage.trim()) throw new Error("Enter an SMS message.");
			const { data, error } = await supabase.functions.invoke("send-sms", { body: {
				message: smsMessage.trim(),
				automationKey: "manual",
				recipients: selected.map((p) => ({
					userId: p.id,
					phone: p.phone,
					name: fullName(p)
				}))
			} });
			if (error) throw error;
			if (data?.failed && !data?.sent) throw new Error(data?.error ?? "The SMS provider rejected the message.");
			return data;
		},
		onSuccess: (data) => {
			toast.success(`${data?.sent ?? 0} SMS sent${data?.failed ? `, ${data.failed} failed` : ""}.`);
			setSmsRecipients([]);
			setSmsMessage("");
			queryClient.invalidateQueries({ queryKey: ["sms-history"] });
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not send SMS")
	});
	const saveTemplate = useMutation({
		mutationFn: async () => {
			if (!templateName.trim() || !templateMessage.trim()) throw new Error("Template name and message are required.");
			const { error } = await supabase.from("sms_templates").insert({
				created_by: userId,
				name: templateName.trim(),
				message: templateMessage.trim()
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Template saved");
			setTemplateName("");
			setTemplateMessage("");
			queryClient.invalidateQueries({ queryKey: ["sms-templates"] });
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not save template")
	});
	const all = messages.data ?? [];
	const inbox = all.filter((m) => m.recipient_id === userId);
	const sent = all.filter((m) => m.sender_id === userId);
	function renderList(rows, mode) {
		if (messages.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Loading messages…" });
		if (!rows.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: mode === "inbox" ? "Your inbox is empty." : "You have not sent any messages." });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: rows.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-navy",
							children: mode === "inbox" ? `From ${fullName(m.sender) || "School"}` : `To ${fullName(m.recipient) || "Recipient"}`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] uppercase tracking-brand text-muted-foreground",
							children: new Date(m.created_at).toLocaleString()
						})]
					}),
					m.subject && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-medium",
						children: m.subject
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 whitespace-pre-line text-sm text-foreground/80",
						children: m.body
					})
				]
			}) }, m.id))
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Messages & SMS",
		description: "Private school messages and leadership SMS communication."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		defaultValue: "messages",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
				className: "mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "messages",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "mr-2 size-4" }), "Messages"]
					}),
					leadership && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "sms",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "mr-2 size-4" }), "SMS Center"]
					}),
					leadership && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "sms-settings",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "mr-2 size-4" }), "SMS Settings"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "messages",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: leadership ? "grid gap-6 lg:grid-cols-[1fr_20rem]" : "max-w-3xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						defaultValue: teacher ? "sent" : "inbox",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [!teacher && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "inbox",
								children: [
									"Inbox (",
									inbox.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "sent",
								children: [
									"Sent (",
									sent.length,
									")"
								]
							})] }),
							!teacher && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "inbox",
								className: "mt-4",
								children: renderList(inbox, "inbox")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "sent",
								className: "mt-4",
								children: renderList(sent, "sent")
							})
						]
					}), leadership && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "h-fit",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "New message"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Recipient" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: recipient,
										onValueChange: setRecipient,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose a person" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (people.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: p.id,
											children: fullName(p) || "Unnamed"
										}, p.id)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Subject" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: subject,
										onChange: (e) => setSubject(e.target.value),
										placeholder: "Optional"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Message" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 6,
										value: body,
										onChange: (e) => setBody(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "w-full",
									disabled: !recipient || !body.trim() || send.isPending,
									onClick: () => send.mutate(),
									children: send.isPending ? "Sending…" : "Send message"
								})
							]
						})]
					})]
				})
			}),
			leadership && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "sms",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmsCenter, {
					audience: smsAudience,
					setAudience: setSmsAudience,
					recipients: smsRecipients,
					setRecipients: setSmsRecipients,
					message: smsMessage,
					setMessage: setSmsMessage,
					people: audiencePeople,
					templates: templates.data ?? [],
					history: smsHistory.data ?? [],
					onSend: () => sendSms.mutate(),
					sending: sendSms.isPending,
					templateName,
					setTemplateName,
					templateMessage,
					setTemplateMessage,
					onSaveTemplate: () => saveTemplate.mutate(),
					savingTemplate: saveTemplate.isPending
				})
			}),
			leadership && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "sms-settings",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmsSettings, {
					settings: smsSettingsQuery.data,
					onSave: (v) => saveSmsSettings.mutate(v),
					saving: saveSmsSettings.isPending
				})
			})
		]
	})] });
}
function SmsSettings({ settings, onSave, saving }) {
	const [local, setLocal] = (0, import_react.useState)(settings ?? {
		sms_enabled: false,
		fee_payment_sms: true,
		fee_reminder_sms: false,
		absence_sms: false,
		exam_reminder_sms: false,
		result_sms: false,
		announcement_sms: true,
		provider: "africas_talking",
		sender_id: ""
	});
	(0, import_react.useEffect)(() => {
		if (settings) setLocal(settings);
	}, [settings]);
	const toggle = (key) => setLocal((x) => ({
		...x,
		[key]: !x[key]
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-4xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5" }), "SMS safety & provider settings"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "API credentials are kept in Supabase Edge Function secrets, never in the browser."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center justify-between rounded-lg border p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Enable SMS sending" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Turn this on only after configuring your provider."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: !!local.sms_enabled,
						onChange: () => toggle("sms_enabled")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Provider" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: local.provider ?? "africas_talking",
						onChange: (e) => setLocal((x) => ({
							...x,
							provider: e.target.value
						}))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sender ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: local.sender_id ?? "",
						onChange: (e) => setLocal((x) => ({
							...x,
							sender_id: e.target.value
						})),
						placeholder: "Optional registered sender ID"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2",
					children: [
						["fee_payment_sms", "Fee payment confirmations"],
						["fee_reminder_sms", "Fee balance/reminder SMS"],
						["absence_sms", "Student absence alerts"],
						["exam_reminder_sms", "Exam reminders"],
						["result_sms", "Results/report-card notifications"],
						["announcement_sms", "School announcements"]
					].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center justify-between rounded-lg border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: !!local[key],
							onChange: () => toggle(key)
						})]
					}, key))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => onSave(local),
					disabled: saving,
					children: saving ? "Saving…" : "Save SMS settings"
				})
			]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Provider setup" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "text-sm text-muted-foreground space-y-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "For Kenya, the current integration is prepared for Africa's Talking. Their SMS API uses an API key and username, and production sending also requires an approved sender ID or shortcode." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Store ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "AT_USERNAME" }),
				", ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "AT_API_KEY" }),
				" and optional ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "AT_SENDER_ID" }),
				" as Supabase Edge Function secrets."
			] })]
		})] })]
	});
}
function SmsCenter(props) {
	const selected = props.recipients.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 md:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-brand text-muted-foreground",
							children: "Recipients"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl font-bold",
							children: selected
						})] })]
					})
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-brand text-muted-foreground",
							children: "History"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl font-bold",
							children: props.history.length
						})] })]
					})
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-brand text-muted-foreground",
							children: "Templates"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl font-bold",
							children: props.templates.length
						})] })]
					})
				}) })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 xl:grid-cols-[1.1fr_.9fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Compose SMS"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Audience" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: props.audience,
							onValueChange: (v) => {
								props.setAudience(v);
								props.setRecipients([]);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "parents",
									children: "Parents / guardians"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "teachers",
									children: "Teachers"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "staff",
									children: "All staff"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All contacts"
								})
							] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
							"Recipients (",
							props.people.length,
							")"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-56 space-y-1 overflow-auto rounded-lg border p-2",
							children: props.people.length ? props.people.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 hover:bg-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: props.recipients.includes(p.id),
										onChange: (e) => props.setRecipients(e.target.checked ? [...props.recipients, p.id] : props.recipients.filter((id) => id !== p.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm",
										children: fullName(p)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto text-xs text-muted-foreground",
										children: p.phone
									})
								]
							}, p.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "p-3 text-sm text-muted-foreground",
								children: "No contacts with phone numbers in this group."
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Message ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "float-right text-xs text-muted-foreground",
							children: [props.message.length, "/480"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 7,
							maxLength: 480,
							value: props.message,
							onChange: (e) => props.setMessage(e.target.value),
							placeholder: "Write a clear school message…"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full",
						disabled: !selected || !props.message.trim() || props.sending,
						onClick: props.onSend,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-2 size-4" }), props.sending ? "Sending SMS…" : `Send SMS to ${selected || 0}`]
					})
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Templates"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [
						props.templates.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => props.setMessage(t.message),
							className: "w-full rounded-lg border p-3 text-left hover:bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold",
								children: t.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 line-clamp-2 text-xs text-muted-foreground",
								children: t.message
							})]
						}, t.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: props.templateName,
								onChange: (e) => props.setTemplateName(e.target.value),
								placeholder: "Template name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								disabled: props.savingTemplate || !props.templateName.trim() || !props.templateMessage.trim(),
								onClick: props.onSaveTemplate,
								children: "Save template"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 3,
							value: props.templateMessage,
							onChange: (e) => props.setTemplateMessage(e.target.value),
							placeholder: "Template message"
						})
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "text-base flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-4" }), "Recent SMS"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [props.history.slice(0, 8).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: s.recipient_name || s.recipient_phone
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: s.status === "sent" || s.status === "delivered" ? "default" : "destructive",
									children: s.status
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 line-clamp-2 text-xs text-muted-foreground",
								children: s.message
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-[11px] text-muted-foreground",
								children: [new Date(s.created_at).toLocaleString(), s.provider_cost ? ` · ${s.provider_cost}` : ""]
							})
						]
					}, s.id)), !props.history.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "No SMS have been sent yet." })]
				})] })]
			})]
		})]
	});
}
//#endregion
export { MessagesPage as component };

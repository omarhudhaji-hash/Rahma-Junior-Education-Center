import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { f as school } from "./school-BBKER8cz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { D as Phone, F as Mail, P as MapPin } from "../_libs/lucide-react.mjs";
import { n as SiteHeader, t as SiteFooter } from "./site-header-4Y24qqgy.mjs";
import { t as Input } from "./input-CIJ7QuDk.mjs";
import { t as Label } from "./label-BsoyNsWq.mjs";
import { t as Textarea } from "./textarea-lY6r0rtj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-EOf_ICo8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Contact() {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		message: ""
	});
	function set(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
	}
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			const { error } = await supabase.from("contact_enquiries").insert({
				name: form.name,
				email: form.email || null,
				phone: form.phone || null,
				message: form.message
			});
			if (error) throw error;
			toast.success("Message sent. We will reply soon.");
			setForm({
				name: "",
				email: "",
				phone: "",
				message: ""
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not send your message");
		} finally {
			setBusy(false);
		}
	}
	const details = [
		{
			icon: Phone,
			label: "Phone",
			value: school.phone
		},
		{
			icon: Mail,
			label: "Email",
			value: school.email
		},
		{
			icon: MapPin,
			label: "Location",
			value: school.location
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-brand text-primary",
						children: "Contact"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 max-w-3xl font-display text-4xl font-extrabold text-navy",
						children: "We would love to hear from you"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-2xl text-muted-foreground",
						children: "Questions about admissions, fees or the school day? Send us a message and our office will get back to you."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-12 grid gap-8 lg:grid-cols-[.8fr_1.2fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: details.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								className: "border-border/70 shadow-panel",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "flex items-start gap-4 pt-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(d.icon, { className: "size-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-brand text-muted-foreground",
										children: d.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm font-medium break-all text-navy",
										children: d.value
									})] })]
								})
							}, d.label))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-border/70 shadow-panel",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "pt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-bold text-navy",
									children: "Send a message"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit,
									className: "mt-6 space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-4 sm:grid-cols-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "name",
													children: "Your name"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "name",
													value: form.name,
													onChange: (e) => set("name", e.target.value),
													required: true
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "cphone",
													children: "Phone"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "cphone",
													inputMode: "tel",
													value: form.phone,
													onChange: (e) => set("phone", e.target.value)
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "cemail",
												children: "Email"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "cemail",
												type: "email",
												value: form.email,
												onChange: (e) => set("email", e.target.value)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "message",
												children: "Message"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												id: "message",
												rows: 5,
												value: form.message,
												onChange: (e) => set("message", e.target.value),
												required: true
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											disabled: busy,
											className: "w-full sm:w-auto",
											children: busy ? "Sending…" : "Send message"
										})
									]
								})]
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { Contact as component };

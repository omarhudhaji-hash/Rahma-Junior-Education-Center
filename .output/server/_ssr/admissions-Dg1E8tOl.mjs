import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { f as school, n as classOptions } from "./school-BBKER8cz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { et as Camera } from "../_libs/lucide-react.mjs";
import { n as SiteHeader, t as SiteFooter } from "./site-header-4Y24qqgy.mjs";
import { t as Input } from "./input-CIJ7QuDk.mjs";
import { t as Label } from "./label-BsoyNsWq.mjs";
import { t as Textarea } from "./textarea-lY6r0rtj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admissions-Dg1E8tOl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var admissionClassOptions = classOptions;
var steps = [
	{
		title: "1. Send the form",
		body: "Share your child's details and the class you are applying for."
	},
	{
		title: "2. Meet the team",
		body: "We invite you for a short visit and a friendly readiness chat."
	},
	{
		title: "3. Confirm the place",
		body: "Complete registration and receive the term joining pack."
	}
];
function Admissions() {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [sent, setSent] = (0, import_react.useState)(false);
	const [photoBusy, setPhotoBusy] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		child_name: "",
		child_dob: "",
		class_applying_for: admissionClassOptions[0],
		parent_name: "",
		parent_phone: "",
		parent_email: "",
		notes: "",
		photo_url: ""
	});
	async function uploadAdmissionPhoto(file) {
		if (!file.type.startsWith("image/")) {
			toast.error("Please select a JPG, PNG or WebP image.");
			return;
		}
		if (file.size > 5242880) {
			toast.error("Student photo must be 5 MB or smaller.");
			return;
		}
		setPhotoBusy(true);
		try {
			const path = `admissions/${crypto.randomUUID()}.${file.name.split(".").pop()?.toLowerCase() || "jpg"}`;
			const { error } = await supabase.storage.from("student-photos").upload(path, file, {
				upsert: false,
				contentType: file.type
			});
			if (error) throw error;
			set("photo_url", path);
			toast.success("Student photo uploaded.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not upload student photo.");
		} finally {
			setPhotoBusy(false);
		}
	}
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
			const { error } = await supabase.from("applications").insert({
				child_name: form.child_name,
				child_dob: form.child_dob || null,
				class_applying_for: form.class_applying_for,
				parent_name: form.parent_name,
				parent_phone: form.parent_phone,
				parent_email: form.parent_email || null,
				notes: form.notes || null,
				photo_url: form.photo_url || null
			});
			if (error) throw error;
			setSent(true);
			toast.success("Application received. We will call you shortly.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not send the application");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-brand text-primary",
						children: "Admissions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-3 max-w-3xl font-display text-4xl font-extrabold text-navy",
						children: [
							"Join the ",
							school.shortName,
							" family"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-2xl text-muted-foreground",
						children: "We welcome learners from Playgroup through Grade 9 throughout the year. Send the form below and our admissions team will get in touch with the next steps."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 grid gap-5 md:grid-cols-3",
						children: steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-border/70 shadow-panel",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "pt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-base font-semibold text-navy",
									children: s.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: s.body
								})]
							})
						}, s.title))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-14 grid gap-8 lg:grid-cols-[1.2fr_.8fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-border/70 shadow-panel",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "pt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-bold text-navy",
									children: "Application form"
								}), sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 rounded-lg bg-secondary p-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-navy",
											children: "Thank you!"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm text-muted-foreground",
											children: "Your application has been received. Our admissions office will contact you on the phone number you provided."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											className: "mt-4",
											onClick: () => setSent(false),
											children: "Send another application"
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit,
									className: "mt-6 space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-4 sm:grid-cols-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "child",
													children: "Child's full name"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "child",
													value: form.child_name,
													onChange: (e) => set("child_name", e.target.value),
													required: true
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "dob",
													children: "Date of birth"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "dob",
													type: "date",
													value: form.child_dob,
													onChange: (e) => set("child_dob", e.target.value)
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "class",
												children: "Class applying for"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												id: "class",
												value: form.class_applying_for,
												onChange: (e) => set("class_applying_for", e.target.value),
												className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
												children: admissionClassOptions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: c,
													children: c
												}, c))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-4 sm:grid-cols-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "parent",
													children: "Parent / guardian name"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "parent",
													value: form.parent_name,
													onChange: (e) => set("parent_name", e.target.value),
													required: true
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "pphone",
													children: "Phone number"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "pphone",
													inputMode: "tel",
													value: form.parent_phone,
													onChange: (e) => set("parent_phone", e.target.value),
													required: true
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "pemail",
												children: "Email (optional)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "pemail",
												type: "email",
												value: form.parent_email,
												onChange: (e) => set("parent_email", e.target.value)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2 rounded-xl border p-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "student-photo",
												children: "Student profile photo"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-xs text-muted-foreground",
												children: "Optional · passport-style JPG, PNG or WebP · maximum 5 MB."
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														htmlFor: "student-photo",
														className: "inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" }),
															" ",
															photoBusy ? "Uploading…" : form.photo_url ? "Change photo" : "Upload photo"
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "student-photo",
														type: "file",
														accept: "image/jpeg,image/png,image/webp",
														className: "hidden",
														disabled: photoBusy,
														onChange: (e) => {
															const f = e.target.files?.[0];
															if (f) uploadAdmissionPhoto(f);
															e.currentTarget.value = "";
														}
													}),
													form.photo_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-sm text-primary",
														children: "Photo attached ✓"
													})
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "notes",
												children: "Anything we should know?"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												id: "notes",
												rows: 4,
												value: form.notes,
												onChange: (e) => set("notes", e.target.value)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											disabled: busy,
											className: "w-full sm:w-auto",
											children: busy ? "Sending…" : "Submit application"
										})
									]
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-border/70 bg-navy text-navy-foreground shadow-panel",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "pt-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-lg font-bold",
										children: "Talk to admissions"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm opacity-85",
										children: "Prefer to speak with us? Our office is happy to answer any question about fees, uniform or the school day."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
										className: "mt-6 space-y-3 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-xs uppercase tracking-brand text-accent",
												children: "Phone"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: school.phone })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-xs uppercase tracking-brand text-accent",
												children: "Email"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "break-all",
												children: school.email
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-xs uppercase tracking-brand text-accent",
												children: "Visit"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: school.location })] })
										]
									})
								]
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
export { Admissions as component };

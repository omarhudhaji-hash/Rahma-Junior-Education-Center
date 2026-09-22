import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { a as fullName, d as roleLabels } from "./school-BBKER8cz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as useMe } from "./use-auth-BfiWx6iO.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { et as Camera } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-CIJ7QuDk.mjs";
import { t as Label } from "./label-BsoyNsWq.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as PageHeader } from "./page-header-D2pXXqT-.mjs";
import { t as Badge } from "./badge-CCuYWPBQ.mjs";
import { t as ProfileAvatar } from "./profile-avatar-B7fU-LT1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.profile-BoN1jx4n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { profile, roles, userId, user } = useMe();
	const queryClient = useQueryClient();
	const [firstName, setFirstName] = (0, import_react.useState)("");
	const [lastName, setLastName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [photoUploading, setPhotoUploading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setFirstName(profile?.first_name ?? "");
		setLastName(profile?.last_name ?? "");
		setPhone(profile?.phone ?? "");
	}, [
		profile?.first_name,
		profile?.last_name,
		profile?.phone
	]);
	async function uploadProfilePhoto(file) {
		if (!userId) return;
		if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
			toast.error("Please select a JPG, PNG or WebP image.");
			return;
		}
		if (file.size > 5242880) {
			toast.error("Profile photo must be 5 MB or smaller.");
			return;
		}
		setPhotoUploading(true);
		try {
			const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
			const path = `${userId}/profile.${ext}`;
			const { error: uploadError } = await supabase.storage.from("profile-photos").upload(path, file, {
				upsert: true,
				contentType: file.type
			});
			if (uploadError) throw uploadError;
			const { error } = await supabase.from("profiles").update({ photo_url: path }).eq("id", userId);
			if (error) throw error;
			await queryClient.invalidateQueries({ queryKey: ["me", userId] });
			toast.success("Profile picture updated.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not upload profile picture.");
		} finally {
			setPhotoUploading(false);
		}
	}
	const save = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("profiles").update({
				first_name: firstName.trim(),
				last_name: lastName.trim(),
				phone: phone.trim() || null
			}).eq("id", userId);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Profile updated");
			queryClient.invalidateQueries({ queryKey: ["me"] });
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Could not save profile")
	});
	const name = fullName(profile) || "Portal user";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "My profile",
		description: "Your account details in the school portal."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[20rem_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "h-fit",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col items-center p-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileAvatar, {
							path: profile?.photo_url,
							name,
							size: "lg"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "absolute bottom-0 right-0 grid size-8 cursor-pointer place-items-center rounded-full border bg-background shadow-sm hover:bg-muted",
							title: "Upload profile picture",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/jpeg,image/png,image/webp",
								className: "hidden",
								disabled: photoUploading,
								onChange: (e) => {
									const f = e.target.files?.[0];
									if (f) uploadProfilePhoto(f);
									e.currentTarget.value = "";
								}
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 font-display text-lg font-bold text-navy",
						children: name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: profile?.email ?? user?.email ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: photoUploading ? "Uploading photo…" : "Click the camera to change your profile picture."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap justify-center gap-2",
						children: roles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							children: "No role assigned"
						}) : roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							children: roleLabels[r]
						}, r))
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: "Edit details"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "first",
							children: "First name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "first",
							value: firstName,
							onChange: (e) => setFirstName(e.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "last",
							children: "Last name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "last",
							value: lastName,
							onChange: (e) => setLastName(e.target.value)
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "phone",
						children: "Phone"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "phone",
						value: phone,
						onChange: (e) => setPhone(e.target.value),
						placeholder: "+254…"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "email",
							children: "Email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							value: profile?.email ?? user?.email ?? "",
							disabled: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Contact an administrator to change your sign-in email."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: !firstName.trim() || !lastName.trim() || save.isPending,
					onClick: () => save.mutate(),
					children: save.isPending ? "Saving…" : "Save changes"
				})
			]
		})] })]
	})] });
}
//#endregion
export { ProfilePage as component };

import { n as __toESM } from "../_runtime.mjs";
import { f as school, o as galleryPhotos } from "./school-CK2M8GiK.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as SiteHeader, t as SiteFooter } from "./site-header-QWTKYjnA.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-CycotAhG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gallery-2oVV070i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Gallery() {
	const [active, setActive] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-brand text-primary",
						children: "Gallery"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-3 max-w-3xl font-display text-4xl font-extrabold text-navy",
						children: ["Life at ", school.shortName]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-2xl text-muted-foreground",
						children: "A glimpse of the learning, friendship and celebration that fill our school days."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: galleryPhotos.map((photo, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActive(i),
							className: "group relative overflow-hidden rounded-xl shadow-panel",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: photo.url,
								alt: photo.caption,
								loading: "lazy",
								className: "aspect-4/3 w-full object-cover transition-transform duration-500 group-hover:scale-105"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 to-transparent p-4 text-left text-sm font-medium text-navy-foreground",
								children: photo.caption
							})]
						}, photo.url))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: active !== null,
				onOpenChange: (o) => !o && setActive(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-3xl overflow-hidden p-0",
					children: active !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: galleryPhotos[active].url,
						alt: galleryPhotos[active].caption,
						className: "w-full object-contain"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
						className: "p-4 text-sm text-muted-foreground",
						children: galleryPhotos[active].caption
					})] })
				})
			})
		]
	});
}
//#endregion
export { Gallery as component };

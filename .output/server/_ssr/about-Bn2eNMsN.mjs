import { f as school, o as galleryPhotos } from "./school-BBKER8cz.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { n as SiteHeader, t as SiteFooter } from "./site-header-4Y24qqgy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-Bn2eNMsN.js
var import_jsx_runtime = require_jsx_runtime();
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-brand text-primary",
						children: "About us"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 max-w-3xl font-display text-4xl font-extrabold text-navy",
						children: school.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-5 max-w-2xl text-muted-foreground",
						children: [school.shortName, " exists to give young children a secure, joyful place to build the skills and character they will carry for life. Our teachers combine the Competency Based Curriculum with close personal attention, so every learner is known, supported and stretched."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 grid gap-5 md:grid-cols-3",
						children: [
							{
								title: "Our mission",
								body: "To provide the best foundation of education for young children through skilled teaching and genuine care."
							},
							{
								title: "Our vision",
								body: "A community of confident, curious learners who lead with integrity wherever life takes them."
							},
							{
								title: "Our values",
								body: school.values
							}
						].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-border/70 shadow-panel",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "pt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-base font-semibold text-navy",
									children: c.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: c.body
								})]
							})
						}, c.title))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: galleryPhotos.slice(4, 10).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: g.url,
							alt: g.caption,
							loading: "lazy",
							className: "h-52 w-full rounded-2xl object-cover shadow-panel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
							className: "mt-2 text-xs text-muted-foreground",
							children: g.caption
						})] }, g.url))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { About as component };

import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { J as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as SiteHeader, t as SiteFooter } from "./site-header-4Y24qqgy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/academics-CLuBw5p1.js
var import_jsx_runtime = require_jsx_runtime();
var levels = [
	{
		name: "Playgroup & PP1–PP2",
		body: "Play-based literacy, numeracy and social skills."
	},
	{
		name: "Grade 1–3 (Lower primary)",
		body: "Reading fluency, number work, environmental studies."
	},
	{
		name: "Grade 4–6 (Upper primary)",
		body: "Subject depth, projects and skill pathways."
	},
	{
		name: "Grade 7–9 (Junior secondary)",
		body: "CBC junior secondary learning, projects, assessment and pathways."
	}
];
var learningAreas = [
	"Literacy & English",
	"Kiswahili",
	"Mathematics",
	"Environmental Activities",
	"Science & Technology",
	"Islamic Religious Education",
	"Creative Arts",
	"Physical & Health Education",
	"Computer Studies"
];
function Academics() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-brand text-primary",
						children: "Academics"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-4xl font-extrabold text-navy",
						children: "Competency Based Curriculum, delivered with care"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-2xl text-muted-foreground",
						children: "Learners are assessed continuously through CATs, mid-term and end-term exams. Results, teacher remarks and attendance are published to parents in the portal as soon as they are approved."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 grid gap-5 md:grid-cols-3",
						children: levels.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-border/70 shadow-panel",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "pt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-base font-semibold text-navy",
									children: l.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: l.body
								})]
							})
						}, l.name))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-16 font-display text-2xl font-bold text-navy",
						children: "Learning areas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: learningAreas.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2 rounded-xl border border-border/70 bg-card px-4 py-3 text-sm text-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-primary" }),
								" ",
								a
							]
						}, a))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { Academics as component };

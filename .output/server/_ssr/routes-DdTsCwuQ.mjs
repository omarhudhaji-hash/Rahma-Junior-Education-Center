import { n as __toESM } from "../_runtime.mjs";
import { f as school, o as galleryPhotos, s as heroPhotos } from "./school-CK2M8GiK.mjs";
import { t as cn } from "./utils-DTw8Xhwa.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as CardContent, t as Card } from "./card-DqeHYMZd.mjs";
import { n as useI18n } from "./i18n-BnVRWSRt.mjs";
import { t as Button } from "./button-CY831_gC.mjs";
import { B as GraduationCap, i as Users, ot as BookOpen, z as HeartHandshake } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as SiteHeader, t as SiteFooter } from "./site-header-QWTKYjnA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DdTsCwuQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var pillars = [
	{
		icon: BookOpen,
		title: "CBC-aligned learning",
		body: "Competency Based Curriculum delivered by trained teachers who track every learner's progress."
	},
	{
		icon: HeartHandshake,
		title: "Care and character",
		body: "Dedication, efficiency, integrity and team work shape how we teach and how our pupils grow."
	},
	{
		icon: Users,
		title: "Parents in the loop",
		body: "Attendance, exam results, fee statements and messages available any time in the parent portal."
	},
	{
		icon: GraduationCap,
		title: "Strong foundation",
		body: "From playgroup through Grade 9, learners build the knowledge, competencies and confidence to thrive at the next level."
	}
];
function Home() {
	const { t } = useI18n();
	const [slide, setSlide] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => setSlide((s) => (s + 1) % heroPhotos.length), 5200);
		return () => window.clearInterval(id);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "relative overflow-hidden bg-navy text-navy-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-0",
						children: [heroPhotos.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src,
							alt: "",
							"aria-hidden": true,
							className: cn("absolute inset-0 size-full object-cover transition-opacity duration-1000", i === slide ? "opacity-100" : "opacity-0")
						}, src)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/40" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto max-w-6xl px-4 py-24 md:py-32",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "max-w-2xl font-display text-4xl font-extrabold leading-tight md:text-6xl",
								children: t("heroTitle")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 max-w-xl text-base text-navy-foreground/85 md:text-lg",
								children: t("heroLead")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-9 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									className: "bg-accent text-accent-foreground hover:bg-accent/90",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/admissions",
										children: t("apply")
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									variant: "outline",
									className: "border-white/40 bg-transparent text-navy-foreground hover:bg-white/10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/about",
										children: t("discover")
									})
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto max-w-6xl px-4 py-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-2xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-semibold uppercase tracking-brand text-primary",
							children: ["Why ", school.shortName]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-display text-3xl font-bold text-navy md:text-4xl",
							children: "A school built around every learner"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
						children: pillars.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-border/70 shadow-panel",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "pt-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex size-11 items-center justify-center rounded-xl bg-secondary text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(p.icon, { className: "size-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-4 font-display text-base font-semibold text-navy",
										children: p.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-muted-foreground",
										children: p.body
									})
								]
							})
						}, p.title))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "bg-pearl py-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-brand text-primary",
								children: "One portal, five roles"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-3xl font-bold text-navy md:text-4xl",
								children: "Administration, teaching and parenting in one place"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm text-muted-foreground md:text-base",
								children: "Administrators manage admissions, classes, fees and inventory. Teachers mark attendance, share notes and enter exam marks. Parents and pupils follow results, statements and school announcements — securely, on any device."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								className: "mt-7",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth",
									children: t("login")
								})
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-3",
							children: galleryPhotos.slice(0, 4).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: g.url,
								alt: g.caption,
								loading: "lazy",
								className: "h-40 w-full rounded-2xl object-cover shadow-lift md:h-48"
							}, g.url))
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto max-w-6xl px-4 py-20 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-3xl font-bold text-navy md:text-4xl",
							children: [
								"Ready to join the ",
								school.shortName,
								" family?"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base",
							children: "Send an admission enquiry and our office will get back to you with the next steps."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap justify-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admissions",
									children: t("apply")
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contact",
									children: t("contact")
								})
							})]
						})
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { Home as component };

import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { f as school$1, i as fetchSchoolSettings, o as galleryPhotos, t as SCHOOL_SETTINGS_QUERY_KEY } from "./school-CK2M8GiK.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as I18nProvider } from "./i18n-BnVRWSRt.mjs";
import { n as useQuery, r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as AuthProvider } from "./use-auth-BfiWx6iO.mjs";
import { A as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as requirePortalRoles } from "./permissions-B1W1UZOe.mjs";
import { t as Route$32 } from "./portal.parents._parentId-PLZG1T7_.mjs";
import { t as Route$33 } from "./portal.students._studentId-uWqv5o3k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BDy7_IWq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-CgNYGMNu.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-primary",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$31 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				name: "author",
				content: school$1.name
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon.png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function SchoolSettingsSync() {
	useQuery({
		queryKey: SCHOOL_SETTINGS_QUERY_KEY,
		queryFn: fetchSchoolSettings,
		staleTime: 0,
		refetchOnMount: true,
		refetchOnWindowFocus: true,
		refetchOnReconnect: true
	});
	return null;
}
function RootComponent() {
	const { queryClient } = Route$31.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(I18nProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchoolSettingsSync, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
				richColors: true,
				position: "top-right"
			})
		] }) })
	});
}
var $$splitComponentImporter$28 = () => import("./routes-DdTsCwuQ.mjs");
var Route$30 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: `${school$1.name} — ${school$1.motto}` },
		{
			name: "description",
			content: `${school$1.name} offers a nurturing CBC-aligned foundation for young learners, with a parent and staff portal for results, fees and attendance.`
		},
		{
			property: "og:title",
			content: school$1.name
		},
		{
			property: "og:description",
			content: `A nurturing, CBC-aligned foundation of education for young children at ${school$1.name}.`
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./route-DP_W3ft2.mjs");
var Route$29 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./about-DqYdXhZd.mjs");
var Route$28 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: `About our school — ${school$1.name}` },
		{
			name: "description",
			content: `Learn about ${school$1.name}: our mission, values and the caring team that guides every learner's foundation.`
		},
		{
			property: "og:title",
			content: `About ${school$1.name}`
		},
		{
			property: "og:description",
			content: "Our mission, values and the team behind a strong educational foundation."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./academics-DrVohn7K.mjs");
var Route$27 = createFileRoute("/academics")({
	head: () => ({ meta: [
		{ title: `Academics & CBC — ${school.name}` },
		{
			name: "description",
			content: `Our CBC-aligned programme from playgroup through Grade 9: learning areas, assessment and how progress is shared with parents at ${school.name}.`
		},
		{
			property: "og:title",
			content: `Academics & CBC — ${school.shortName}`
		},
		{
			property: "og:description",
			content: `Learning areas, assessment and progress reporting at ${school.shortName}.`
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./admissions-DoEYIpsY.mjs");
var Route$26 = createFileRoute("/admissions")({
	head: () => ({ meta: [
		{ title: `Admissions — ${school$1.name}` },
		{
			name: "description",
			content: `Apply for a place at ${school$1.name}. Simple three-step admission for Playgroup through Grade 9.`
		},
		{
			property: "og:title",
			content: `Admissions at ${school$1.name}`
		},
		{
			property: "og:description",
			content: "Send an application online and our admissions team will contact you."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./auth-DMJq8vYb.mjs");
var Route$25 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: `Portal sign in — ${school$1.name}` },
		{
			name: "description",
			content: `Sign in to the ${school$1.name} portal for staff, parents and pupils.`
		},
		{
			property: "og:title",
			content: `Portal sign in — ${school$1.shortName}`
		},
		{
			property: "og:description",
			content: "Secure access to results, attendance, fees and school messages."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./contact-DXhurf_g.mjs");
var Route$24 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: `Contact us — ${school$1.name}` },
		{
			name: "description",
			content: `Get in touch with ${school$1.name}: phone, email and a message form for admissions and general enquiries.`
		},
		{
			property: "og:title",
			content: `Contact ${school$1.name}`
		},
		{
			property: "og:description",
			content: "Phone, email and an online message form for parents and visitors."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./gallery-2oVV070i.mjs");
var Route$23 = createFileRoute("/gallery")({
	head: () => ({ meta: [
		{ title: `Gallery — ${school$1.name}` },
		{
			name: "description",
			content: `Photos from life at ${school$1.name}: classrooms, celebrations, computer lessons and community moments.`
		},
		{
			property: "og:title",
			content: `Gallery — ${school$1.name}`
		},
		{
			property: "og:description",
			content: "See our classrooms, celebrations and everyday school life."
		},
		{
			property: "og:image",
			content: galleryPhotos[0].url
		},
		{
			name: "twitter:image",
			content: galleryPhotos[0].url
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
function getSiteUrl$1(request, env) {
	const runtimeEnv = env && typeof env === "object" ? env : {};
	const processEnv = globalThis.process?.env;
	const configuredUrl = runtimeEnv.NEXT_PUBLIC_SITE_URL ?? processEnv?.NEXT_PUBLIC_SITE_URL;
	try {
		return new URL(typeof configuredUrl === "string" ? configuredUrl : request.url).origin;
	} catch {
		return new URL(request.url).origin;
	}
}
var Route$22 = createFileRoute("/robots.txt")({ server: { handlers: { GET: ({ request, env }) => {
	const robots = `User-agent: *\nAllow: /\nDisallow: /auth\nDisallow: /dashboard\nDisallow: /portal\nSitemap: ${getSiteUrl$1(request, env)}/sitemap.xml\n`;
	return new Response(robots, { headers: {
		"Cache-Control": "public, max-age=3600, s-maxage=86400",
		"Content-Type": "text/plain; charset=utf-8"
	} });
} } } });
var publicPaths = [
	"/",
	"/about",
	"/academics",
	"/admissions",
	"/contact",
	"/gallery"
];
function getSiteUrl(request, env) {
	const runtimeEnv = env && typeof env === "object" ? env : {};
	const processEnv = globalThis.process?.env;
	const configuredUrl = runtimeEnv.NEXT_PUBLIC_SITE_URL ?? processEnv?.NEXT_PUBLIC_SITE_URL;
	try {
		return new URL(typeof configuredUrl === "string" ? configuredUrl : request.url).origin;
	} catch {
		return new URL(request.url).origin;
	}
}
function escapeXml(value) {
	return value.replace(/[<>&'"]/g, (character) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&apos;"
	})[character] ?? character);
}
var Route$21 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: ({ request, env }) => {
	const siteUrl = getSiteUrl(request, env);
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicPaths.map((path) => `  <url><loc>${escapeXml(`${siteUrl}${path}`)}</loc></url>`).join("\n")}\n</urlset>\n`;
	return new Response(sitemap, { headers: {
		"Cache-Control": "public, max-age=3600, s-maxage=86400",
		"Content-Type": "application/xml; charset=utf-8"
	} });
} } } });
var $$splitComponentImporter$20 = () => import("./dashboard-O9wjOi92.mjs");
var Route$20 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [{ title: "Portal dashboard | Rahma Junior Education Center" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./portal.academic-DS55M92o.mjs");
var Route$19 = createFileRoute("/_authenticated/portal/academic")({
	beforeLoad: async () => {
		await requirePortalRoles([
			"admin",
			"headteacher",
			"teacher",
			"parent",
			"student"
		]);
	},
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./portal.admissions-NVPASYbv.mjs");
var Route$18 = createFileRoute("/_authenticated/portal/admissions")({
	beforeLoad: async () => {
		await requirePortalRoles(["admin", "headteacher"]);
	},
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./portal.announcements-DvtZLAWP.mjs");
var Route$17 = createFileRoute("/_authenticated/portal/announcements")({
	head: () => ({ meta: [
		{ title: "Announcements | Rahma Junior portal" },
		{
			name: "description",
			content: "School announcements for staff, parents and learners."
		},
		{
			property: "og:title",
			content: "Announcements | Rahma Junior portal"
		},
		{
			property: "og:description",
			content: "School announcements for staff, parents and learners."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	beforeLoad: async () => {
		await requirePortalRoles([
			"admin",
			"headteacher",
			"teacher",
			"parent",
			"student"
		]);
	},
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./portal.attendance-C4mZ_ALS.mjs");
var Route$16 = createFileRoute("/_authenticated/portal/attendance")({
	beforeLoad: async () => {
		await requirePortalRoles([
			"admin",
			"headteacher",
			"teacher",
			"parent",
			"student"
		]);
	},
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./portal.audit-logs-DDWfyzUN.mjs");
var Route$15 = createFileRoute("/_authenticated/portal/audit-logs")({
	ssr: false,
	head: () => ({ meta: [{ title: "Audit logs | Rahma Junior portal" }, {
		name: "robots",
		content: "noindex"
	}] }),
	beforeLoad: async () => {
		await requirePortalRoles(["admin"]);
	},
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./portal.calendar-jen7qSly.mjs");
var Route$14 = createFileRoute("/_authenticated/portal/calendar")({
	beforeLoad: async () => {
		await requirePortalRoles([
			"admin",
			"headteacher",
			"teacher",
			"parent",
			"student"
		]);
	},
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./portal.classes-BmcMi_iQ.mjs");
var Route$13 = createFileRoute("/_authenticated/portal/classes")({
	beforeLoad: async () => {
		await requirePortalRoles([
			"admin",
			"headteacher",
			"teacher"
		]);
	},
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./portal.documents-BXbzz5R0.mjs");
var Route$12 = createFileRoute("/_authenticated/portal/documents")({
	beforeLoad: async () => {
		await requirePortalRoles([
			"admin",
			"headteacher",
			"parent",
			"student"
		]);
	},
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./portal.exams-DBmTLbBd.mjs");
var Route$11 = createFileRoute("/_authenticated/portal/exams")({
	beforeLoad: async () => {
		await requirePortalRoles([
			"admin",
			"headteacher",
			"teacher",
			"parent",
			"student"
		]);
	},
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./portal.finance-B98AX6iD.mjs");
var Route$10 = createFileRoute("/_authenticated/portal/finance")({
	beforeLoad: async () => {
		await requirePortalRoles([
			"admin",
			"headteacher",
			"parent",
			"student"
		]);
	},
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./portal.inventory-1FvNPELt.mjs");
var Route$9 = createFileRoute("/_authenticated/portal/inventory")({
	beforeLoad: async () => {
		await requirePortalRoles([
			"admin",
			"headteacher",
			"teacher",
			"parent"
		]);
	},
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./portal.messages-CH6Q5T1u.mjs");
var Route$8 = createFileRoute("/_authenticated/portal/messages")({
	head: () => ({ meta: [{ title: "Messages & SMS | Rahma Junior portal" }, {
		name: "robots",
		content: "noindex"
	}] }),
	beforeLoad: async () => {
		await requirePortalRoles([
			"admin",
			"headteacher",
			"teacher",
			"parent",
			"student"
		]);
	},
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./portal.parents-C_qJuibn.mjs");
var Route$7 = createFileRoute("/_authenticated/portal/parents")({
	beforeLoad: async () => {
		await requirePortalRoles(["admin", "headteacher"]);
	},
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./portal.people-B4xivrdn.mjs");
var Route$6 = createFileRoute("/_authenticated/portal/people")({
	beforeLoad: async () => {
		await requirePortalRoles(["admin", "headteacher"]);
		throw redirect({ to: "/portal/staff" });
	},
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./portal.profile-CeDxw3fx.mjs");
var Route$5 = createFileRoute("/_authenticated/portal/profile")({
	head: () => ({ meta: [
		{ title: "My profile | Rahma Junior portal" },
		{
			name: "description",
			content: "Update your contact details and portal account."
		},
		{
			property: "og:title",
			content: "My profile | Rahma Junior portal"
		},
		{
			property: "og:description",
			content: "Update your contact details and portal account."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	beforeLoad: async () => {
		await requirePortalRoles([
			"admin",
			"headteacher",
			"teacher",
			"parent",
			"student"
		]);
	},
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./portal.reports-B1oaKRqn.mjs");
var Route$4 = createFileRoute("/_authenticated/portal/reports")({
	beforeLoad: async () => {
		await requirePortalRoles(["admin", "headteacher"]);
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./portal.settings-B1HcX1mP.mjs");
var Route$3 = createFileRoute("/_authenticated/portal/settings")({
	ssr: false,
	head: () => ({ meta: [{ title: "School Control Center | Rahma Junior portal" }, {
		name: "robots",
		content: "noindex"
	}] }),
	beforeLoad: async () => {
		await requirePortalRoles(["admin"]);
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./portal.staff-Bq3JEVeX.mjs");
var Route$2 = createFileRoute("/_authenticated/portal/staff")({
	beforeLoad: async () => {
		await requirePortalRoles(["admin", "headteacher"]);
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./portal.students-DiaMbzvu.mjs");
var Route$1 = createFileRoute("/_authenticated/portal/students")({
	beforeLoad: async () => {
		await requirePortalRoles([
			"admin",
			"headteacher",
			"teacher",
			"parent",
			"student"
		]);
	},
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./portal.timetable-DvPwY_Hb.mjs");
var Route = createFileRoute("/_authenticated/portal/timetable")({
	beforeLoad: async () => {
		await requirePortalRoles([
			"admin",
			"headteacher",
			"teacher",
			"parent",
			"student"
		]);
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$30.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$31
});
var AuthenticatedRouteRoute = Route$29.update({
	id: "/_authenticated",
	getParentRoute: () => Route$31
});
var AboutRoute = Route$28.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$31
});
var AcademicsRoute = Route$27.update({
	id: "/academics",
	path: "/academics",
	getParentRoute: () => Route$31
});
var AdmissionsRoute = Route$26.update({
	id: "/admissions",
	path: "/admissions",
	getParentRoute: () => Route$31
});
var AuthRoute = Route$25.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$31
});
var ContactRoute = Route$24.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$31
});
var GalleryRoute = Route$23.update({
	id: "/gallery",
	path: "/gallery",
	getParentRoute: () => Route$31
});
var RobotsDottxtRoute = Route$22.update({
	id: "/robots.txt",
	path: "/robots.txt",
	getParentRoute: () => Route$31
});
var SitemapDotxmlRoute = Route$21.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$31
});
var AuthenticatedDashboardRoute = Route$20.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalAcademicRoute = Route$19.update({
	id: "/portal/academic",
	path: "/portal/academic",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalAdmissionsRoute = Route$18.update({
	id: "/portal/admissions",
	path: "/portal/admissions",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalAnnouncementsRoute = Route$17.update({
	id: "/portal/announcements",
	path: "/portal/announcements",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalAttendanceRoute = Route$16.update({
	id: "/portal/attendance",
	path: "/portal/attendance",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalAuditLogsRoute = Route$15.update({
	id: "/portal/audit-logs",
	path: "/portal/audit-logs",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalCalendarRoute = Route$14.update({
	id: "/portal/calendar",
	path: "/portal/calendar",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalClassesRoute = Route$13.update({
	id: "/portal/classes",
	path: "/portal/classes",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalDocumentsRoute = Route$12.update({
	id: "/portal/documents",
	path: "/portal/documents",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalExamsRoute = Route$11.update({
	id: "/portal/exams",
	path: "/portal/exams",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalFinanceRoute = Route$10.update({
	id: "/portal/finance",
	path: "/portal/finance",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalInventoryRoute = Route$9.update({
	id: "/portal/inventory",
	path: "/portal/inventory",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalMessagesRoute = Route$8.update({
	id: "/portal/messages",
	path: "/portal/messages",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalParentsRoute = Route$7.update({
	id: "/portal/parents",
	path: "/portal/parents",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalPeopleRoute = Route$6.update({
	id: "/portal/people",
	path: "/portal/people",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalProfileRoute = Route$5.update({
	id: "/portal/profile",
	path: "/portal/profile",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalReportsRoute = Route$4.update({
	id: "/portal/reports",
	path: "/portal/reports",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalSettingsRoute = Route$3.update({
	id: "/portal/settings",
	path: "/portal/settings",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalStaffRoute = Route$2.update({
	id: "/portal/staff",
	path: "/portal/staff",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalStudentsRoute = Route$1.update({
	id: "/portal/students",
	path: "/portal/students",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalTimetableRoute = Route.update({
	id: "/portal/timetable",
	path: "/portal/timetable",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPortalParentsParentIdRoute = Route$32.update({
	id: "/$parentId",
	path: "/$parentId",
	getParentRoute: () => AuthenticatedPortalParentsRoute
});
var AuthenticatedPortalStudentsStudentIdRoute = Route$33.update({
	id: "/$studentId",
	path: "/$studentId",
	getParentRoute: () => AuthenticatedPortalStudentsRoute
});
var AuthenticatedPortalParentsRouteChildren = { AuthenticatedPortalParentsParentIdRoute };
var AuthenticatedPortalParentsRouteWithChildren = AuthenticatedPortalParentsRoute._addFileChildren(AuthenticatedPortalParentsRouteChildren);
var AuthenticatedPortalStudentsRouteChildren = { AuthenticatedPortalStudentsStudentIdRoute };
var AuthenticatedRouteRouteChildren = {
	AuthenticatedDashboardRoute,
	AuthenticatedPortalAcademicRoute,
	AuthenticatedPortalAdmissionsRoute,
	AuthenticatedPortalAnnouncementsRoute,
	AuthenticatedPortalAttendanceRoute,
	AuthenticatedPortalAuditLogsRoute,
	AuthenticatedPortalCalendarRoute,
	AuthenticatedPortalClassesRoute,
	AuthenticatedPortalDocumentsRoute,
	AuthenticatedPortalExamsRoute,
	AuthenticatedPortalFinanceRoute,
	AuthenticatedPortalInventoryRoute,
	AuthenticatedPortalMessagesRoute,
	AuthenticatedPortalParentsRoute: AuthenticatedPortalParentsRouteWithChildren,
	AuthenticatedPortalPeopleRoute,
	AuthenticatedPortalProfileRoute,
	AuthenticatedPortalReportsRoute,
	AuthenticatedPortalSettingsRoute,
	AuthenticatedPortalStaffRoute,
	AuthenticatedPortalStudentsRoute: AuthenticatedPortalStudentsRoute._addFileChildren(AuthenticatedPortalStudentsRouteChildren),
	AuthenticatedPortalTimetableRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AboutRoute,
	AcademicsRoute,
	AdmissionsRoute,
	AuthRoute,
	ContactRoute,
	GalleryRoute,
	RobotsDottxtRoute,
	SitemapDotxmlRoute
};
var routeTree = Route$31._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };

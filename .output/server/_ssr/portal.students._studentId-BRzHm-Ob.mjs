import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as requirePortalRoles } from "./permissions-B1W1UZOe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.students._studentId-BRzHm-Ob.js
var $$splitComponentImporter = () => import("./portal.students._studentId-uHkv7cAP.mjs");
var Route = createFileRoute("/_authenticated/portal/students/$studentId")({
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
//#endregion
export { Route as t };

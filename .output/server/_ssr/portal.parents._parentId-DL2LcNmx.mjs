import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as requirePortalRoles } from "./permissions-B1W1UZOe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.parents._parentId-DL2LcNmx.js
var $$splitComponentImporter = () => import("./portal.parents._parentId-BAlnVNMh.mjs");
var Route = createFileRoute("/_authenticated/portal/parents/$parentId")({
	beforeLoad: async () => {
		await requirePortalRoles(["admin", "headteacher"]);
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

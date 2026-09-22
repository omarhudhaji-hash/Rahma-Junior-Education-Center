import { n as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-B2gFRfJz.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as UserRound } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-avatar-B7fU-LT1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfileAvatar({ path, name, size = "md" }) {
	const [url, setUrl] = import_react.useState(null);
	import_react.useEffect(() => {
		let cancelled = false;
		if (!path) {
			setUrl(null);
			return;
		}
		supabase.storage.from("profile-photos").createSignedUrl(path, 3600).then(({ data }) => {
			if (!cancelled) setUrl(data?.signedUrl ?? null);
		});
		return () => {
			cancelled = true;
		};
	}, [path]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `grid ${size === "lg" ? "size-20" : size === "sm" ? "size-8" : "size-10"} shrink-0 place-items-center overflow-hidden rounded-full border bg-muted`,
		children: url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: url,
			alt: `${name} profile`,
			className: "size-full object-cover"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-1/2 text-muted-foreground" })
	});
}
//#endregion
export { ProfileAvatar as t };

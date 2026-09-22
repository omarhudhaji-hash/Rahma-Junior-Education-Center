import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-DTw8Xhwa.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
async function getSupabaseFunctionError(error, fallback) {
	const value = error;
	if (value?.context && typeof value.context.json === "function") try {
		const body = await value.context.clone().json();
		if (body?.error || body?.message) return `${fallback}: ${body.error ?? body.message}`;
	} catch {}
	const detail = [
		value?.message,
		value?.details,
		value?.hint
	].filter(Boolean).join(" — ");
	return detail ? `${fallback}: ${detail}` : fallback;
}
//#endregion
export { getSupabaseFunctionError as n, cn as t };

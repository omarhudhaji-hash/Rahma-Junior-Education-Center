globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/apple-touch-icon.png": {
		"type": "image/png",
		"etag": "\"84cf-TtMyEmalg99T45OuqpoQ5X+J/Xs\"",
		"mtime": "2026-09-23T00:40:41.588Z",
		"size": 33999,
		"path": "../public/apple-touch-icon.png"
	},
	"/favicon-32.png": {
		"type": "image/png",
		"etag": "\"87f-VqSBrSt2+qhp6pGqIHdKE+/Bqgg\"",
		"mtime": "2026-09-23T00:40:41.586Z",
		"size": 2175,
		"path": "../public/favicon-32.png"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"1b2c-ztnKHEjAFhsyDo5tGFHHmi0pOKk\"",
		"mtime": "2026-09-23T00:40:41.589Z",
		"size": 6956,
		"path": "../public/favicon.ico"
	},
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"87f-VqSBrSt2+qhp6pGqIHdKE+/Bqgg\"",
		"mtime": "2026-09-23T00:40:41.587Z",
		"size": 2175,
		"path": "../public/favicon.png"
	},
	"/assets/Combination-DxYWYV_W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"554b-FVf0NFf8RGtkuZkro6oRhD+bZms\"",
		"mtime": "2026-09-23T00:40:32.276Z",
		"size": 21835,
		"path": "../public/assets/Combination-DxYWYV_W.js"
	},
	"/assets/Match-46Rh3wNE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bdd6-wWKtL5G+eM1qCuQeti+WDTNfMwU\"",
		"mtime": "2026-09-23T00:40:32.276Z",
		"size": 48598,
		"path": "../public/assets/Match-46Rh3wNE.js"
	},
	"/assets/about-DptM0acC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7d1-85bhyuQMZftVIXJvFajbKGdcVXU\"",
		"mtime": "2026-09-23T00:40:32.276Z",
		"size": 2001,
		"path": "../public/assets/about-DptM0acC.js"
	},
	"/assets/academics-AlvivEQ1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e4-21vd8Y/FNrVZvBqssew8wBQIyfE\"",
		"mtime": "2026-09-23T00:40:32.276Z",
		"size": 2276,
		"path": "../public/assets/academics-AlvivEQ1.js"
	},
	"/assets/admissions-CwctbMAv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e64-uESnhY8Fpz0U1ccVjdSL++DpQxg\"",
		"mtime": "2026-09-23T00:40:32.276Z",
		"size": 7780,
		"path": "../public/assets/admissions-CwctbMAv.js"
	},
	"/assets/arrow-left-Ba8OeLSw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-wBSk+goiNPSH24axyOHat5v2RkI\"",
		"mtime": "2026-09-23T00:40:32.276Z",
		"size": 153,
		"path": "../public/assets/arrow-left-Ba8OeLSw.js"
	},
	"/assets/auth-uY6AFLl5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11c3-reKusN4fkWZU1s/v7+Lq6EWm2b0\"",
		"mtime": "2026-09-23T00:40:32.276Z",
		"size": 4547,
		"path": "../public/assets/auth-uY6AFLl5.js"
	},
	"/assets/award-CTRxQ_Bo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"106-yCEpNRP2JCj7Si5UwFqwXSlMmfM\"",
		"mtime": "2026-09-23T00:40:32.276Z",
		"size": 262,
		"path": "../public/assets/award-CTRxQ_Bo.js"
	},
	"/assets/badge-BPGIwLYz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"300-0NuI4SmVFrw9BZnWsPOTYIUoo/w\"",
		"mtime": "2026-09-23T00:40:32.276Z",
		"size": 768,
		"path": "../public/assets/badge-BPGIwLYz.js"
	},
	"/assets/bell-B1YF21hO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"116-3BErBYrolGZq47RIuX+8mygcEB0\"",
		"mtime": "2026-09-23T00:40:32.276Z",
		"size": 278,
		"path": "../public/assets/bell-B1YF21hO.js"
	},
	"/assets/book-open-Bpt7kT69.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10b-IYXf0lmWEtbSEj5CVYDWDeYRdGE\"",
		"mtime": "2026-09-23T00:40:32.276Z",
		"size": 267,
		"path": "../public/assets/book-open-Bpt7kT69.js"
	},
	"/assets/button-DtueS81W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ffc-F3Urz42sci/mug+IrFSLIm0fZsU\"",
		"mtime": "2026-09-23T00:40:32.276Z",
		"size": 4092,
		"path": "../public/assets/button-DtueS81W.js"
	},
	"/assets/calendar-check-Dtw5VwMd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"125-HYOG1133M9WMcFU0/bitvtPV7kY\"",
		"mtime": "2026-09-23T00:40:32.276Z",
		"size": 293,
		"path": "../public/assets/calendar-check-Dtw5VwMd.js"
	},
	"/assets/calendar-days-eaT5FerI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e2-6WqpYrdDYXCvDqgGeUcygUcaFyI\"",
		"mtime": "2026-09-23T00:40:32.276Z",
		"size": 482,
		"path": "../public/assets/calendar-days-eaT5FerI.js"
	},
	"/assets/calendar-plus-CNAFviV-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15e-+OrdN32qms1Vd6hUJfB38Li7I14\"",
		"mtime": "2026-09-23T00:40:32.276Z",
		"size": 350,
		"path": "../public/assets/calendar-plus-CNAFviV-.js"
	},
	"/assets/camera-CckJrzQI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"144-vktBkXsVtETKuLAGiAIJR68+uKg\"",
		"mtime": "2026-09-23T00:40:32.276Z",
		"size": 324,
		"path": "../public/assets/camera-CckJrzQI.js"
	},
	"/assets/card-DybXzBRm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"41f-yNHFigPowqYZn3UfrIuElYyw/Fw\"",
		"mtime": "2026-09-23T00:40:32.276Z",
		"size": 1055,
		"path": "../public/assets/card-DybXzBRm.js"
	},
	"/assets/chart-column-BcCjrUvX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ef-lc3XoJyU4EQv1VJMUSpuRc2cDS0\"",
		"mtime": "2026-09-23T00:40:32.276Z",
		"size": 239,
		"path": "../public/assets/chart-column-BcCjrUvX.js"
	},
	"/assets/circle-check-DW3PUNnM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a6-fflrpvyiyujx3mXLWglBpSZr2aw\"",
		"mtime": "2026-09-23T00:40:32.277Z",
		"size": 166,
		"path": "../public/assets/circle-check-DW3PUNnM.js"
	},
	"/assets/clipboard-check-BwNKnzRY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"124-vXjX3+WE7TvXwGbe+n6yiC/Gchc\"",
		"mtime": "2026-09-23T00:40:32.277Z",
		"size": 292,
		"path": "../public/assets/clipboard-check-BwNKnzRY.js"
	},
	"/assets/contact-CP-Zbfy-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e14-eVAlbWh9oX6TFrt7iAY/rvK+EFQ\"",
		"mtime": "2026-09-23T00:40:32.278Z",
		"size": 3604,
		"path": "../public/assets/contact-CP-Zbfy-.js"
	},
	"/assets/credit-card-D5355Yyd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3-5FRPRjW+oB81SL7iZXO3hOnIfYs\"",
		"mtime": "2026-09-23T00:40:32.278Z",
		"size": 195,
		"path": "../public/assets/credit-card-D5355Yyd.js"
	},
	"/assets/dashboard-QA4voGDB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ecf-VNcFYgiaQun2TF1F5kEmjDQp7iM\"",
		"mtime": "2026-09-23T00:40:32.278Z",
		"size": 11983,
		"path": "../public/assets/dashboard-QA4voGDB.js"
	},
	"/assets/dialog-CtrsvolG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"83c-sx9vhPbpFUp8reVeusMd4OaM0+g\"",
		"mtime": "2026-09-23T00:40:32.278Z",
		"size": 2108,
		"path": "../public/assets/dialog-CtrsvolG.js"
	},
	"/assets/dist-3f-e_olZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12e4-K2snLOUpxo+zJVjsNfRXZ4NUZrQ\"",
		"mtime": "2026-09-23T00:40:32.278Z",
		"size": 4836,
		"path": "../public/assets/dist-3f-e_olZ.js"
	},
	"/assets/dist-BmhJ3TfD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d01-OGZzRtb1eWwWN5xf73zwSyXsldQ\"",
		"mtime": "2026-09-23T00:40:32.278Z",
		"size": 7425,
		"path": "../public/assets/dist-BmhJ3TfD.js"
	},
	"/assets/dist-ByBM60Rl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c9c-LLflPBgy3tMR3lZk62a4LU3wbY0\"",
		"mtime": "2026-09-23T00:40:32.278Z",
		"size": 7324,
		"path": "../public/assets/dist-ByBM60Rl.js"
	},
	"/assets/dist-DCrX14cR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c2-/lu3KONZsksfVn6H1Apv2mE7/90\"",
		"mtime": "2026-09-23T00:40:32.278Z",
		"size": 706,
		"path": "../public/assets/dist-DCrX14cR.js"
	},
	"/assets/dist-DO3aTq2U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"72b1-nsGiS7IoV6b52S8HcSPRjCcDy2U\"",
		"mtime": "2026-09-23T00:40:32.278Z",
		"size": 29361,
		"path": "../public/assets/dist-DO3aTq2U.js"
	},
	"/assets/download-CaJ4BYmq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-bF53keKFCl0pcy6xFc9w8J/1s50\"",
		"mtime": "2026-09-23T00:40:32.278Z",
		"size": 220,
		"path": "../public/assets/download-CaJ4BYmq.js"
	},
	"/assets/file-text-D6hvSlqA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"175-u7v584JrMXR9oLphJ9IlKjhOvD0\"",
		"mtime": "2026-09-23T00:40:32.279Z",
		"size": 373,
		"path": "../public/assets/file-text-D6hvSlqA.js"
	},
	"/assets/gallery-DJaD-x-h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"700-bCRWYYPhFzYfNWU5GtRYlZbRM90\"",
		"mtime": "2026-09-23T00:40:32.279Z",
		"size": 1792,
		"path": "../public/assets/gallery-DJaD-x-h.js"
	},
	"/assets/index-fXBssAI_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4b4f5-7DlCaBnLtSms/RRNs7HOhRv7/WU\"",
		"mtime": "2026-09-23T00:40:32.270Z",
		"size": 308469,
		"path": "../public/assets/index-fXBssAI_.js"
	},
	"/assets/input-BGWtbsHa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"844-8E9uVmTQOeqmUHLOwt6pFrL89EA\"",
		"mtime": "2026-09-23T00:40:32.279Z",
		"size": 2116,
		"path": "../public/assets/input-BGWtbsHa.js"
	},
	"/assets/graduation-cap-fUEwicjM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-qiLwcYCQIzh0MnuoWuEUb3S3tM0\"",
		"mtime": "2026-09-23T00:40:32.279Z",
		"size": 320,
		"path": "../public/assets/graduation-cap-fUEwicjM.js"
	},
	"/assets/label-B87bIKIO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a9-aSQFhK7WRCJOYdwHU8xc7oBATGs\"",
		"mtime": "2026-09-23T00:40:32.279Z",
		"size": 681,
		"path": "../public/assets/label-B87bIKIO.js"
	},
	"/assets/link-BhMUzwh9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b46-FiAqLIud/v1UUsrpj6fHm2z087Q\"",
		"mtime": "2026-09-23T00:40:32.279Z",
		"size": 23366,
		"path": "../public/assets/link-BhMUzwh9.js"
	},
	"/assets/history-BUd09Zu1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e1-3pFW1pgFBE37WVsdBGa6dmz5SpI\"",
		"mtime": "2026-09-23T00:40:32.279Z",
		"size": 225,
		"path": "../public/assets/history-BUd09Zu1.js"
	},
	"/assets/matchContext-CMWeFcWU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"299-0/o8GXjOu7huIItT89uxk3UJG0c\"",
		"mtime": "2026-09-23T00:40:32.281Z",
		"size": 665,
		"path": "../public/assets/matchContext-CMWeFcWU.js"
	},
	"/assets/megaphone-rJwy4y2y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14e-koO1N8eUhb56e7IdkvIXIzQ5/68\"",
		"mtime": "2026-09-23T00:40:32.281Z",
		"size": 334,
		"path": "../public/assets/megaphone-rJwy4y2y.js"
	},
	"/assets/message-square-Z7KJrEro.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dd-N7homs6/VtdwSF3qhoFlmm9WCmk\"",
		"mtime": "2026-09-23T00:40:32.281Z",
		"size": 221,
		"path": "../public/assets/message-square-Z7KJrEro.js"
	},
	"/assets/page-header-Bh5ta9MJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f5-1ARmEdNd7DfHC6wPPO3EdsqkEY4\"",
		"mtime": "2026-09-23T00:40:32.281Z",
		"size": 757,
		"path": "../public/assets/page-header-Bh5ta9MJ.js"
	},
	"/assets/pencil-B6anYOmb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"108-gChJ21JVnH7GSfWkpi0pKDmHs3w\"",
		"mtime": "2026-09-23T00:40:32.281Z",
		"size": 264,
		"path": "../public/assets/pencil-B6anYOmb.js"
	},
	"/assets/plus-CC2w7kIZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d-Y2J0/CnRBQUzyQUkNlQSmsiWMzU\"",
		"mtime": "2026-09-23T00:40:32.281Z",
		"size": 141,
		"path": "../public/assets/plus-CC2w7kIZ.js"
	},
	"/assets/portal.academic-CH6NRUH2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b1c-IgI1xAiI5FhjaWPtSNkohcBofFE\"",
		"mtime": "2026-09-23T00:40:32.281Z",
		"size": 11036,
		"path": "../public/assets/portal.academic-CH6NRUH2.js"
	},
	"/assets/portal.admissions-DDAl-Tp2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30b2-+x5X72gpExffDritNbUcZIFU6vE\"",
		"mtime": "2026-09-23T00:40:32.281Z",
		"size": 12466,
		"path": "../public/assets/portal.admissions-DDAl-Tp2.js"
	},
	"/assets/portal.announcements-B3XhfCms.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d28-KfGjVhsHBvT4o0LkxgcNqvVkhrk\"",
		"mtime": "2026-09-23T00:40:32.281Z",
		"size": 3368,
		"path": "../public/assets/portal.announcements-B3XhfCms.js"
	},
	"/assets/portal.attendance-C_Htqoch.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c00-jonocQ0i5nUhY3JPpKVnaz/As0M\"",
		"mtime": "2026-09-23T00:40:32.281Z",
		"size": 11264,
		"path": "../public/assets/portal.attendance-C_Htqoch.js"
	},
	"/assets/portal.audit-logs-UZ-jtTLd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fcb-+El0glq9LqKSQTnLzNDVJ8Km2QY\"",
		"mtime": "2026-09-23T00:40:32.281Z",
		"size": 4043,
		"path": "../public/assets/portal.audit-logs-UZ-jtTLd.js"
	},
	"/assets/portal.calendar-DPa4AgUM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e8b-ewK19mU2rRAqXT+QrCJTllMYQ4A\"",
		"mtime": "2026-09-23T00:40:32.281Z",
		"size": 7819,
		"path": "../public/assets/portal.calendar-DPa4AgUM.js"
	},
	"/assets/portal.classes-KaKbkgPf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5109-LuM/sEP04DNJYR3Ev/aSIg1+do4\"",
		"mtime": "2026-09-23T00:40:32.281Z",
		"size": 20745,
		"path": "../public/assets/portal.classes-KaKbkgPf.js"
	},
	"/assets/portal.documents-1ez5gGYz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f5a-TIVjZ+PzzxZIP/4CAsrO+ccW+Qs\"",
		"mtime": "2026-09-23T00:40:32.281Z",
		"size": 8026,
		"path": "../public/assets/portal.documents-1ez5gGYz.js"
	},
	"/assets/portal.exams-os5HsINi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"522a-R5KMBuJjaTYBfqVOV3IMBvixgMQ\"",
		"mtime": "2026-09-23T00:40:32.281Z",
		"size": 21034,
		"path": "../public/assets/portal.exams-os5HsINi.js"
	},
	"/assets/portal.finance-5NvbNhRf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7ae9-vnFmnSNVwim5+pBF58jVKAj7MUI\"",
		"mtime": "2026-09-23T00:40:32.281Z",
		"size": 31465,
		"path": "../public/assets/portal.finance-5NvbNhRf.js"
	},
	"/assets/portal.inventory-DCX8_eZJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a58-53E/d7ObEhnFDQUrLKdMnM0iqgg\"",
		"mtime": "2026-09-23T00:40:32.281Z",
		"size": 19032,
		"path": "../public/assets/portal.inventory-DCX8_eZJ.js"
	},
	"/assets/portal.messages-Bqw1D256.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"42f5-/ipzN7KVkw2tskwmBsYGD57YrOU\"",
		"mtime": "2026-09-23T00:40:32.281Z",
		"size": 17141,
		"path": "../public/assets/portal.messages-Bqw1D256.js"
	},
	"/assets/portal.parents-BlgQNoQy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1fff-HSv8NerVBa3cI31lR1FwTbaf6/M\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 8191,
		"path": "../public/assets/portal.parents-BlgQNoQy.js"
	},
	"/assets/portal.parents._parentId-BP87NuC3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4107-fiXlg0WlykrSc46jXCYLUNwejng\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 16647,
		"path": "../public/assets/portal.parents._parentId-BP87NuC3.js"
	},
	"/assets/portal.people-DJ7LAi8J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26-SoFMfAHVJ5oqB5t+mpFRoQvFIoc\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 38,
		"path": "../public/assets/portal.people-DJ7LAi8J.js"
	},
	"/assets/portal.profile-BClCPTdQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1155-VOmfpIuxuKRK+YwrmtITlp/CbH4\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 4437,
		"path": "../public/assets/portal.profile-BClCPTdQ.js"
	},
	"/assets/portal.reports-B1NmwsWm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1765-Z0UtEXKRt6S20udzeWlSYWaU5ZA\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 5989,
		"path": "../public/assets/portal.reports-B1NmwsWm.js"
	},
	"/assets/portal.settings-BcMPpbjz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"731c-x5p5culun3Q8ehMeYpFic8RoYEI\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 29468,
		"path": "../public/assets/portal.settings-BcMPpbjz.js"
	},
	"/assets/portal.staff-C5Zx5tW3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14c6-HSPovcHCNfMiB8sOKR0na5seIPc\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 5318,
		"path": "../public/assets/portal.staff-C5Zx5tW3.js"
	},
	"/assets/portal.students-DxZMcqKA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"198c-mWB7XIPZBze6g5tp2l+zgL/Upx0\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 6540,
		"path": "../public/assets/portal.students-DxZMcqKA.js"
	},
	"/assets/portal.students._studentId-H47oHKdf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2bb9-R2SBpu1TpsD3+qVCcpLL4Ejrxoc\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 11193,
		"path": "../public/assets/portal.students._studentId-H47oHKdf.js"
	},
	"/assets/portal.timetable-DS0_TQh-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26e0-dRm1jXGPGzOhp+iQYWDtRmQ88i8\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 9952,
		"path": "../public/assets/portal.timetable-DS0_TQh-.js"
	},
	"/assets/printer-zVH03hJm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"133-wprgF5tV/lIxMiHadYZXUVpTv3U\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 307,
		"path": "../public/assets/printer-zVH03hJm.js"
	},
	"/assets/profile-avatar-f0CPvDFd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2bb-mgbdjooHP1DiNLPhrLPfZl9vPzQ\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 699,
		"path": "../public/assets/profile-avatar-f0CPvDFd.js"
	},
	"/assets/react-dom-C6zic-iE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dd7-kyUDtyva143VVQU0LWIf//37mdM\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 3543,
		"path": "../public/assets/react-dom-C6zic-iE.js"
	},
	"/assets/route-BxZKRsG-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"57de-Gyqm6DBgC3PAxpj1YTbwIJyNLS0\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 22494,
		"path": "../public/assets/route-BxZKRsG-.js"
	},
	"/assets/routes-CwgyfTHn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"167d-Hv6UkcEwbRQfx39bVs9rnikY5s4\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 5757,
		"path": "../public/assets/routes-CwgyfTHn.js"
	},
	"/assets/save-XeEDMwOe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13b-lXypuvjt36T0XTkD9pEGIYHCghM\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 315,
		"path": "../public/assets/save-XeEDMwOe.js"
	},
	"/assets/search-q4tOTzpe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a2-TbyG+3touiRRXB1t8jUq3HUeXwc\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 162,
		"path": "../public/assets/search-q4tOTzpe.js"
	},
	"/assets/select-CZAW6BKe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bd78-s39KeFU5LpMP9EmXQLsC3AVQxs0\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 48504,
		"path": "../public/assets/select-CZAW6BKe.js"
	},
	"/assets/settings-DQ2W1gEt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1db-ckVrnmAWKV5raOLM3VHQAfN2XCY\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 475,
		"path": "../public/assets/settings-DQ2W1gEt.js"
	},
	"/assets/sheet-UVW9uQDY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"907-dILjlXXlHaUqh6cxT+SYFhEZ5+M\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 2311,
		"path": "../public/assets/sheet-UVW9uQDY.js"
	},
	"/assets/shield-check-Ch8n3_NX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"134-7sZiwt9H69u4ZSRjI4PAU8NQOWw\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 308,
		"path": "../public/assets/shield-check-Ch8n3_NX.js"
	},
	"/assets/shield-off-Dui6GDbT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"184-1MxV8Q1OtJgQQTzflEHoamQY8+Y\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 388,
		"path": "../public/assets/shield-off-Dui6GDbT.js"
	},
	"/assets/site-header-DT-tMoGo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15cb-ASZ95hGZXl09pIOPhgNX8x1C0LA\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 5579,
		"path": "../public/assets/site-header-DT-tMoGo.js"
	},
	"/assets/smartphone-DzZ-5aI_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b9-kL/E2n/d39D3vRKgPdbefy6JGWI\"",
		"mtime": "2026-09-23T00:40:32.282Z",
		"size": 185,
		"path": "../public/assets/smartphone-DzZ-5aI_.js"
	},
	"/assets/styles-CgNYGMNu.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"178f7-b9ES72OMTsVvWbTiYMLHi1Y+B2g\"",
		"mtime": "2026-09-23T00:40:32.283Z",
		"size": 96503,
		"path": "../public/assets/styles-CgNYGMNu.css"
	},
	"/assets/tabs-ByZzDFGe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d6a-WQa2pmVvvxpzZVzieKJ/2UFYQjA\"",
		"mtime": "2026-09-23T00:40:32.283Z",
		"size": 7530,
		"path": "../public/assets/tabs-ByZzDFGe.js"
	},
	"/assets/textarea-SFQ1k7q2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"203-A95pIVG04d5fltNi1eJm3EkG5HA\"",
		"mtime": "2026-09-23T00:40:32.283Z",
		"size": 515,
		"path": "../public/assets/textarea-SFQ1k7q2.js"
	},
	"/assets/trash-2-Cs4lANDx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13c-gTX4hHT54lnA051dtHzjM9wZtT0\"",
		"mtime": "2026-09-23T00:40:32.283Z",
		"size": 316,
		"path": "../public/assets/trash-2-Cs4lANDx.js"
	},
	"/assets/triangle-alert-BlQ5dsmz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fd-Dp4xVKnqwBRE9UvrRTfZcBIaVo8\"",
		"mtime": "2026-09-23T00:40:32.283Z",
		"size": 253,
		"path": "../public/assets/triangle-alert-BlQ5dsmz.js"
	},
	"/assets/useMutation-DQ3ztq1v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"924-fFt4pU6AXbpYwDZW113XMDHVtsE\"",
		"mtime": "2026-09-23T00:40:32.283Z",
		"size": 2340,
		"path": "../public/assets/useMutation-DQ3ztq1v.js"
	},
	"/assets/useQuery-C9Oj_gik.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3be2d-q3Nv71Rcfe32wt7D+H0Aovx8dfo\"",
		"mtime": "2026-09-23T00:40:32.283Z",
		"size": 245293,
		"path": "../public/assets/useQuery-C9Oj_gik.js"
	},
	"/assets/user-plus-DefzpwrV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12a-YDWExDOpQ+ZQ0KXQbAS9IMogycU\"",
		"mtime": "2026-09-23T00:40:32.283Z",
		"size": 298,
		"path": "../public/assets/user-plus-DefzpwrV.js"
	},
	"/assets/user-round-fRCNMNLD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"aa-AeCDaoXybV1Bt9zQp5uYQgQoO7c\"",
		"mtime": "2026-09-23T00:40:32.283Z",
		"size": 170,
		"path": "../public/assets/user-round-fRCNMNLD.js"
	},
	"/assets/users-CAbHr3ZF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"126-QRNRTcVZ7wUi2tVWsunOYjJJlfA\"",
		"mtime": "2026-09-23T00:40:32.283Z",
		"size": 294,
		"path": "../public/assets/users-CAbHr3ZF.js"
	},
	"/assets/wallet-DnFdYur0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"251-hDR8l+Nfz5+OvXv+LLZpQqPw3u4\"",
		"mtime": "2026-09-23T00:40:32.283Z",
		"size": 593,
		"path": "../public/assets/wallet-DnFdYur0.js"
	},
	"/assets/x-DEQ-E464.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e-DoXVIkvHUjiobPgexiWCrnmMigw\"",
		"mtime": "2026-09-23T00:40:32.283Z",
		"size": 142,
		"path": "../public/assets/x-DEQ-E464.js"
	},
	"/images/gallery/photo-02.jpg": {
		"type": "image/jpeg",
		"etag": "\"18f2b-oafb/hJqll5u9z06vC3w0E2Itu4\"",
		"mtime": "2026-09-23T00:40:41.549Z",
		"size": 102187,
		"path": "../public/images/gallery/photo-02.jpg"
	},
	"/images/gallery/photo-01.jpg": {
		"type": "image/jpeg",
		"etag": "\"11c4f-EEKUpRoiyDxcSHJIaxEMcXKEh/o\"",
		"mtime": "2026-09-23T00:40:41.544Z",
		"size": 72783,
		"path": "../public/images/gallery/photo-01.jpg"
	},
	"/images/logo.jpg": {
		"type": "image/jpeg",
		"etag": "\"1b532-stCcapKildJEn1iKDUHKZbvmJ1Q\"",
		"mtime": "2026-09-23T00:40:41.551Z",
		"size": 111922,
		"path": "../public/images/logo.jpg"
	},
	"/images/gallery/photo-03.jpg": {
		"type": "image/jpeg",
		"etag": "\"1f95c-Ie005jcya1lkZxaZaBspCajcU3Y\"",
		"mtime": "2026-09-23T00:40:41.551Z",
		"size": 129372,
		"path": "../public/images/gallery/photo-03.jpg"
	},
	"/images/gallery/photo-04.jpg": {
		"type": "image/jpeg",
		"etag": "\"22a60-mW4ffF4C3dlmA4qYVPf9omD7vvM\"",
		"mtime": "2026-09-23T00:40:41.553Z",
		"size": 141920,
		"path": "../public/images/gallery/photo-04.jpg"
	},
	"/images/gallery/photo-05.jpg": {
		"type": "image/jpeg",
		"etag": "\"472c2-yb37oXFgVxA+FwS5S9rGOs8vWcs\"",
		"mtime": "2026-09-23T00:40:41.556Z",
		"size": 291522,
		"path": "../public/images/gallery/photo-05.jpg"
	},
	"/images/gallery/photo-07.jpg": {
		"type": "image/jpeg",
		"etag": "\"5dbd4-iTECBKgZMXb158jG88qZXKneACQ\"",
		"mtime": "2026-09-23T00:40:41.556Z",
		"size": 383956,
		"path": "../public/images/gallery/photo-07.jpg"
	},
	"/images/gallery/photo-08.jpg": {
		"type": "image/jpeg",
		"etag": "\"2f34e-pB2DtlcsGLt2L6pvRkhbiKEOqbI\"",
		"mtime": "2026-09-23T00:40:41.561Z",
		"size": 193358,
		"path": "../public/images/gallery/photo-08.jpg"
	},
	"/images/gallery/photo-09.jpg": {
		"type": "image/jpeg",
		"etag": "\"520d5-6rV3oXkWaPB1bDmF7wALWSTD+IE\"",
		"mtime": "2026-09-23T00:40:41.556Z",
		"size": 336085,
		"path": "../public/images/gallery/photo-09.jpg"
	},
	"/images/gallery/photo-06.jpg": {
		"type": "image/jpeg",
		"etag": "\"36d6e-qXzQXAkApzLiW9Qb+cOQRWRTV3g\"",
		"mtime": "2026-09-23T00:40:41.555Z",
		"size": 224622,
		"path": "../public/images/gallery/photo-06.jpg"
	},
	"/images/gallery/photo-10.jpg": {
		"type": "image/jpeg",
		"etag": "\"3c75d-I+itsuvJQMjUFmdDkgORK+RFvdM\"",
		"mtime": "2026-09-23T00:40:41.562Z",
		"size": 247645,
		"path": "../public/images/gallery/photo-10.jpg"
	},
	"/images/login/student.jpeg": {
		"type": "image/jpeg",
		"etag": "\"194a3-K33rvhgImto60BpRbSFtpbs2tSE\"",
		"mtime": "2026-09-23T00:40:41.561Z",
		"size": 103587,
		"path": "../public/images/login/student.jpeg"
	},
	"/images/login/classofstudent.jpeg": {
		"type": "image/jpeg",
		"etag": "\"2510c-M9Rb6knG6g5FHe1tU2OjKLHzFmU\"",
		"mtime": "2026-09-23T00:40:41.552Z",
		"size": 151820,
		"path": "../public/images/login/classofstudent.jpeg"
	},
	"/images/login/studente.jpeg": {
		"type": "image/jpeg",
		"etag": "\"107bd-s3cTIOD+I9nbOSBDGAjlg+0g4Ig\"",
		"mtime": "2026-09-23T00:40:41.563Z",
		"size": 67517,
		"path": "../public/images/login/studente.jpeg"
	},
	"/images/login/studentsinclass.jpeg": {
		"type": "image/jpeg",
		"etag": "\"2e8d8-XbF4IAY7NpJQs7mwL0PbAEj/RIQ\"",
		"mtime": "2026-09-23T00:40:41.564Z",
		"size": 190680,
		"path": "../public/images/login/studentsinclass.jpeg"
	},
	"/images/school/classofstudent.jpeg": {
		"type": "image/jpeg",
		"etag": "\"2510c-M9Rb6knG6g5FHe1tU2OjKLHzFmU\"",
		"mtime": "2026-09-23T00:40:41.566Z",
		"size": 151820,
		"path": "../public/images/school/classofstudent.jpeg"
	},
	"/images/school/computerlab.jpeg": {
		"type": "image/jpeg",
		"etag": "\"22a60-mW4ffF4C3dlmA4qYVPf9omD7vvM\"",
		"mtime": "2026-09-23T00:40:41.569Z",
		"size": 141920,
		"path": "../public/images/school/computerlab.jpeg"
	},
	"/images/school/girlsgames.jpeg": {
		"type": "image/jpeg",
		"etag": "\"520d5-6rV3oXkWaPB1bDmF7wALWSTD+IE\"",
		"mtime": "2026-09-23T00:40:41.575Z",
		"size": 336085,
		"path": "../public/images/school/girlsgames.jpeg"
	},
	"/images/school/graduation.jpeg": {
		"type": "image/jpeg",
		"etag": "\"1f95c-Ie005jcya1lkZxaZaBspCajcU3Y\"",
		"mtime": "2026-09-23T00:40:41.575Z",
		"size": 129372,
		"path": "../public/images/school/graduation.jpeg"
	},
	"/images/school/student.jpeg": {
		"type": "image/jpeg",
		"etag": "\"194a3-K33rvhgImto60BpRbSFtpbs2tSE\"",
		"mtime": "2026-09-23T00:40:41.576Z",
		"size": 103587,
		"path": "../public/images/school/student.jpeg"
	},
	"/images/school/studente.jpeg": {
		"type": "image/jpeg",
		"etag": "\"107bd-s3cTIOD+I9nbOSBDGAjlg+0g4Ig\"",
		"mtime": "2026-09-23T00:40:41.571Z",
		"size": 67517,
		"path": "../public/images/school/studente.jpeg"
	},
	"/images/school/students.jpeg": {
		"type": "image/jpeg",
		"etag": "\"36d6e-qXzQXAkApzLiW9Qb+cOQRWRTV3g\"",
		"mtime": "2026-09-23T00:40:41.579Z",
		"size": 224622,
		"path": "../public/images/school/students.jpeg"
	},
	"/images/school/studentsinclas.jpeg": {
		"type": "image/jpeg",
		"etag": "\"18f2b-oafb/hJqll5u9z06vC3w0E2Itu4\"",
		"mtime": "2026-09-23T00:40:41.576Z",
		"size": 102187,
		"path": "../public/images/school/studentsinclas.jpeg"
	},
	"/images/school/studentsinclass.jpeg": {
		"type": "image/jpeg",
		"etag": "\"2e8d8-XbF4IAY7NpJQs7mwL0PbAEj/RIQ\"",
		"mtime": "2026-09-23T00:40:41.579Z",
		"size": 190680,
		"path": "../public/images/school/studentsinclass.jpeg"
	},
	"/images/school/boysgame.jpeg": {
		"type": "image/jpeg",
		"etag": "\"472c2-yb37oXFgVxA+FwS5S9rGOs8vWcs\"",
		"mtime": "2026-09-23T00:40:41.569Z",
		"size": 291522,
		"path": "../public/images/school/boysgame.jpeg"
	},
	"/images/school/Schooldirctorsermonongraduation.jpeg": {
		"type": "image/jpeg",
		"etag": "\"11c4f-EEKUpRoiyDxcSHJIaxEMcXKEh/o\"",
		"mtime": "2026-09-23T00:40:41.552Z",
		"size": 72783,
		"path": "../public/images/school/Schooldirctorsermonongraduation.jpeg"
	},
	"/images/school/teacherstrip.jpeg": {
		"type": "image/jpeg",
		"etag": "\"5dbd4-iTECBKgZMXb158jG88qZXKneACQ\"",
		"mtime": "2026-09-23T00:40:41.579Z",
		"size": 383956,
		"path": "../public/images/school/teacherstrip.jpeg"
	},
	"/images/school/theschool.jpeg": {
		"type": "image/jpeg",
		"etag": "\"3c75d-I+itsuvJQMjUFmdDkgORK+RFvdM\"",
		"mtime": "2026-09-23T00:40:41.579Z",
		"size": 247645,
		"path": "../public/images/school/theschool.jpeg"
	},
	"/images/school/tripforteachers.jpeg": {
		"type": "image/jpeg",
		"etag": "\"2f34e-pB2DtlcsGLt2L6pvRkhbiKEOqbI\"",
		"mtime": "2026-09-23T00:40:41.579Z",
		"size": 193358,
		"path": "../public/images/school/tripforteachers.jpeg"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_t0983J = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_t0983J
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };

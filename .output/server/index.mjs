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
		"mtime": "2026-09-22T23:45:36.317Z",
		"size": 33999,
		"path": "../public/apple-touch-icon.png"
	},
	"/favicon-32.png": {
		"type": "image/png",
		"etag": "\"87f-VqSBrSt2+qhp6pGqIHdKE+/Bqgg\"",
		"mtime": "2026-09-22T23:45:36.317Z",
		"size": 2175,
		"path": "../public/favicon-32.png"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"1b2c-ztnKHEjAFhsyDo5tGFHHmi0pOKk\"",
		"mtime": "2026-09-22T23:45:36.317Z",
		"size": 6956,
		"path": "../public/favicon.ico"
	},
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"87f-VqSBrSt2+qhp6pGqIHdKE+/Bqgg\"",
		"mtime": "2026-09-22T23:45:36.317Z",
		"size": 2175,
		"path": "../public/favicon.png"
	},
	"/images/logo.jpg": {
		"type": "image/jpeg",
		"etag": "\"1b532-stCcapKildJEn1iKDUHKZbvmJ1Q\"",
		"mtime": "2026-09-22T23:45:36.289Z",
		"size": 111922,
		"path": "../public/images/logo.jpg"
	},
	"/assets/Combination-CEVZTiLq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"554b-OZoKkF1HyHjnWuEgWXUslUJjjmU\"",
		"mtime": "2026-09-22T23:45:26.788Z",
		"size": 21835,
		"path": "../public/assets/Combination-CEVZTiLq.js"
	},
	"/assets/Match-46Rh3wNE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bdd6-wWKtL5G+eM1qCuQeti+WDTNfMwU\"",
		"mtime": "2026-09-22T23:45:26.788Z",
		"size": 48598,
		"path": "../public/assets/Match-46Rh3wNE.js"
	},
	"/assets/about-ChKUFOZZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7d1-R2nLNo2T8DFd8c87AtYfeKCmFZ8\"",
		"mtime": "2026-09-22T23:45:26.788Z",
		"size": 2001,
		"path": "../public/assets/about-ChKUFOZZ.js"
	},
	"/assets/academics-DXbOEUjT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e4-KuFD8N1TMhAx8zxiC/AO23RAApg\"",
		"mtime": "2026-09-22T23:45:26.788Z",
		"size": 2276,
		"path": "../public/assets/academics-DXbOEUjT.js"
	},
	"/assets/admissions-C9A-h3tD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e64-bVx88c+FJQAhNk/xVsJ8j8dps0E\"",
		"mtime": "2026-09-22T23:45:26.788Z",
		"size": 7780,
		"path": "../public/assets/admissions-C9A-h3tD.js"
	},
	"/assets/arrow-left-DoRKIm-w.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-Vzu3f1e8NXJ/bjRZ/DzDY13dmd8\"",
		"mtime": "2026-09-22T23:45:26.788Z",
		"size": 165,
		"path": "../public/assets/arrow-left-DoRKIm-w.js"
	},
	"/assets/auth-CyvmH555.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11af-1f9c/OzSBt6aVZ2RBmjj43xpweQ\"",
		"mtime": "2026-09-22T23:45:26.788Z",
		"size": 4527,
		"path": "../public/assets/auth-CyvmH555.js"
	},
	"/assets/award-C1-ewkOW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"112-dsaXN2ajP2y3vtCHOe8fRF1myWw\"",
		"mtime": "2026-09-22T23:45:26.788Z",
		"size": 274,
		"path": "../public/assets/award-C1-ewkOW.js"
	},
	"/assets/badge-xYSeKRVo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"300-wN2xK6b0IkJJFZ0oDfG6l9Emk+Y\"",
		"mtime": "2026-09-22T23:45:26.789Z",
		"size": 768,
		"path": "../public/assets/badge-xYSeKRVo.js"
	},
	"/assets/bell-1W1_ERDG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"122-Cx+lfUP9x4zuO97hmcHzmocCdbE\"",
		"mtime": "2026-09-22T23:45:26.789Z",
		"size": 290,
		"path": "../public/assets/bell-1W1_ERDG.js"
	},
	"/assets/book-open-DdhLgW4l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"117-Nkc9U6gzoKkteXFljRgogUC5HK8\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 279,
		"path": "../public/assets/book-open-DdhLgW4l.js"
	},
	"/assets/button-DxW-2HNI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ffc-641f3ipudxihL1PASHkVv/WcZ+w\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 4092,
		"path": "../public/assets/button-DxW-2HNI.js"
	},
	"/assets/calendar-check-CV3I23VR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"131-FiIuuaQT8QLsHPLmnvpXs8lINN0\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 305,
		"path": "../public/assets/calendar-check-CV3I23VR.js"
	},
	"/assets/calendar-days-Dwgrktts.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee-2vaKawMnr26NQ+JG/6cTHql6egk\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 494,
		"path": "../public/assets/calendar-days-Dwgrktts.js"
	},
	"/assets/calendar-plus-BGLgjb0N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16a-fMMLN8ipPRluMBHGJn3zT4/inDc\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 362,
		"path": "../public/assets/calendar-plus-BGLgjb0N.js"
	},
	"/assets/camera-CIi0oD_-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"150-1Ih8bBwj103DrMAVhLuZKumbs4g\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 336,
		"path": "../public/assets/camera-CIi0oD_-.js"
	},
	"/assets/card-rJeYF7OF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"41f-GTY0O3liNxmz6DtjQgYPAIrlWt8\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 1055,
		"path": "../public/assets/card-rJeYF7OF.js"
	},
	"/assets/chart-column-Aoj41vkg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb-kjc4pJ2zWKPZ/Df5U/zystqG8ek\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 251,
		"path": "../public/assets/chart-column-Aoj41vkg.js"
	},
	"/assets/circle-check-fOhJpf9s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b2-cg4EvrZMR32dpBPVoB9kIhS1/yg\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 178,
		"path": "../public/assets/circle-check-fOhJpf9s.js"
	},
	"/assets/clipboard-check-DESFA4_L.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"130-rWRBUOcOt964bSS2ceyW8/AoGOU\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 304,
		"path": "../public/assets/clipboard-check-DESFA4_L.js"
	},
	"/assets/contact-Cb5hsGCs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e14-HoaJWLHu5l+ir496M003tf3M5l8\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 3604,
		"path": "../public/assets/contact-Cb5hsGCs.js"
	},
	"/assets/createLucideIcon-DklxZ9il.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a8-gfFs6ghJ5xuTKTOYFDo/pfQxchI\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 1192,
		"path": "../public/assets/createLucideIcon-DklxZ9il.js"
	},
	"/assets/credit-card-AQ82sUHv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cf-M3CBssjbOzG/vFSK5YCFvBuHaJY\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 207,
		"path": "../public/assets/credit-card-AQ82sUHv.js"
	},
	"/assets/dashboard-BnTrNyPf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2edb-YHSP9yKwVtpEzGYiDNjDjb7IS7Y\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 11995,
		"path": "../public/assets/dashboard-BnTrNyPf.js"
	},
	"/assets/dialog-BBKWDAdf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"83c-D9t5Fye5507LriYKHSo8oDsgYow\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 2108,
		"path": "../public/assets/dialog-BBKWDAdf.js"
	},
	"/assets/dist-BARE44-8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c9c-eLLy3x7bMvGChrRMdb/7Wn+yjHI\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 7324,
		"path": "../public/assets/dist-BARE44-8.js"
	},
	"/assets/dist-BmhJ3TfD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d01-OGZzRtb1eWwWN5xf73zwSyXsldQ\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 7425,
		"path": "../public/assets/dist-BmhJ3TfD.js"
	},
	"/assets/dist-CADadlua.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6def-RIrZq1NqNUEducEbxb+iae6BbY0\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 28143,
		"path": "../public/assets/dist-CADadlua.js"
	},
	"/assets/dist-DBwm0j2s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12e4-GGFnsZ73eB3+YteSXwRenWhAwRY\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 4836,
		"path": "../public/assets/dist-DBwm0j2s.js"
	},
	"/assets/dist-yvWT4hlT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c2-/+7Y2kLOcc1+PL7cSDrc4k82xfM\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 706,
		"path": "../public/assets/dist-yvWT4hlT.js"
	},
	"/assets/download-BpbZ9ecx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-f8eyPkcr5GTWYGwv3Lt/B/mjPwo\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 232,
		"path": "../public/assets/download-BpbZ9ecx.js"
	},
	"/assets/file-text-CTHkrTZr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"181-3km9o3hbN3mrzjijzT5OtevV+k4\"",
		"mtime": "2026-09-22T23:45:26.790Z",
		"size": 385,
		"path": "../public/assets/file-text-CTHkrTZr.js"
	},
	"/assets/gallery-CsVP3cKT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"700-Hxn3U1ciD1olBtSGEUFh2gcxKfs\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 1792,
		"path": "../public/assets/gallery-CsVP3cKT.js"
	},
	"/assets/graduation-cap-CbxHueoC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14c-b6ewj9ILCsn/IAFvj1PouP+qyW8\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 332,
		"path": "../public/assets/graduation-cap-CbxHueoC.js"
	},
	"/assets/history-qyEFljFs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ed-G2JG1l9HCSPWV8bmb6c1dtC7GcY\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 237,
		"path": "../public/assets/history-qyEFljFs.js"
	},
	"/assets/index-L99n84i_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4b3bb-Z7yvd5XwTBifFyCW+A2ztyyndfs\"",
		"mtime": "2026-09-22T23:45:26.783Z",
		"size": 308155,
		"path": "../public/assets/index-L99n84i_.js"
	},
	"/assets/label-2YV3OUR1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a9-4wLs90rlRU033cwIZVTyEi4SmRs\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 681,
		"path": "../public/assets/label-2YV3OUR1.js"
	},
	"/assets/link-BhMUzwh9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b46-FiAqLIud/v1UUsrpj6fHm2z087Q\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 23366,
		"path": "../public/assets/link-BhMUzwh9.js"
	},
	"/assets/input-MIMo9sVj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"269-T5tSXJANuZEebjaCMf3z25iFrxg\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 617,
		"path": "../public/assets/input-MIMo9sVj.js"
	},
	"/assets/matchContext-CMWeFcWU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"299-0/o8GXjOu7huIItT89uxk3UJG0c\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 665,
		"path": "../public/assets/matchContext-CMWeFcWU.js"
	},
	"/assets/megaphone-UXYTLRto.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15a-ZjNsKa3z68E9WtfoZn6NaRS3wRw\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 346,
		"path": "../public/assets/megaphone-UXYTLRto.js"
	},
	"/assets/message-square-BJIzIo58.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e9-/pibxYIEkg1RfxZ/RDTC5/sN0oA\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 233,
		"path": "../public/assets/message-square-BJIzIo58.js"
	},
	"/assets/page-header-Bh5ta9MJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f5-1ARmEdNd7DfHC6wPPO3EdsqkEY4\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 757,
		"path": "../public/assets/page-header-Bh5ta9MJ.js"
	},
	"/assets/pencil-BTkjMDBH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"114-WVQkGsWFIfDrWfvbNndH/SekhMY\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 276,
		"path": "../public/assets/pencil-BTkjMDBH.js"
	},
	"/assets/plus-DeBZF7NM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-amXUmsALVjid1mzBxqTJXeJlBz4\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 153,
		"path": "../public/assets/plus-DeBZF7NM.js"
	},
	"/assets/portal.academic-Dup4uHCw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b2a-tA9tTN/wMdyEqFKyBVB6qZN5Vw8\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 11050,
		"path": "../public/assets/portal.academic-Dup4uHCw.js"
	},
	"/assets/portal.admissions-CiSAby-k.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30b2-/GaFZlZ6TLaibFsNnQMu6GuCGgU\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 12466,
		"path": "../public/assets/portal.admissions-CiSAby-k.js"
	},
	"/assets/portal.announcements-CoPxr1jr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d28-8kjCRNO/fTCMm6kVSGyX0E6y8/o\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 3368,
		"path": "../public/assets/portal.announcements-CoPxr1jr.js"
	},
	"/assets/portal.attendance-CD9sYLXf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c0c-peQsJo0sCnVJxwsFc9Yq3Rgj0TY\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 11276,
		"path": "../public/assets/portal.attendance-CD9sYLXf.js"
	},
	"/assets/portal.audit-logs-CXgSlUrn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fcb-eOF5/jjChtQHDpLANeE9GVdLDLU\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 4043,
		"path": "../public/assets/portal.audit-logs-CXgSlUrn.js"
	},
	"/assets/portal.calendar-AeiNvDLM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e8b-PpQ+3sq/tpusk3Le43zlD8axwwU\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 7819,
		"path": "../public/assets/portal.calendar-AeiNvDLM.js"
	},
	"/assets/portal.classes-BeBE1EFp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5115-0L6M0xE7RYUiFHqyIkhk+BFZWYA\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 20757,
		"path": "../public/assets/portal.classes-BeBE1EFp.js"
	},
	"/assets/portal.documents-R3eZHvsE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f5a-HkJ1TwGUzvOjQJ2UGty3Ouiw4TA\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 8026,
		"path": "../public/assets/portal.documents-R3eZHvsE.js"
	},
	"/assets/portal.exams-55SIHDnT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"522a-XXMvFGw1v7rkYGjbwfL2FP0Nt2s\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 21034,
		"path": "../public/assets/portal.exams-55SIHDnT.js"
	},
	"/assets/portal.finance-DmS5aaqy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7ada-kPXU20rvpvKOp507sIix5Tmh+Yc\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 31450,
		"path": "../public/assets/portal.finance-DmS5aaqy.js"
	},
	"/assets/portal.inventory-BlZZU1Vx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a64-4dtYGBiSnKmMoZheTR/ExSs8RSI\"",
		"mtime": "2026-09-22T23:45:26.791Z",
		"size": 19044,
		"path": "../public/assets/portal.inventory-BlZZU1Vx.js"
	},
	"/assets/portal.messages-Da0pNIcC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4301-I/77MWzWlZZFlNe+m4U78xfBUvo\"",
		"mtime": "2026-09-22T23:45:26.792Z",
		"size": 17153,
		"path": "../public/assets/portal.messages-Da0pNIcC.js"
	},
	"/assets/portal.parents-Cu91O_h0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1fff-B6Yc2CCTo7AajVLJewAIN5/Loro\"",
		"mtime": "2026-09-22T23:45:26.793Z",
		"size": 8191,
		"path": "../public/assets/portal.parents-Cu91O_h0.js"
	},
	"/assets/portal.parents._parentId-BN7VfZMP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4134-SOK4ypEqzMupZXHkTXoxkBGR2ow\"",
		"mtime": "2026-09-22T23:45:26.793Z",
		"size": 16692,
		"path": "../public/assets/portal.parents._parentId-BN7VfZMP.js"
	},
	"/assets/portal.people-DJ7LAi8J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26-SoFMfAHVJ5oqB5t+mpFRoQvFIoc\"",
		"mtime": "2026-09-22T23:45:26.793Z",
		"size": 38,
		"path": "../public/assets/portal.people-DJ7LAi8J.js"
	},
	"/assets/portal.profile-C5QmtITz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1155-DXqd8Q/6a4jrvHKecaPw9WAl8n0\"",
		"mtime": "2026-09-22T23:45:26.793Z",
		"size": 4437,
		"path": "../public/assets/portal.profile-C5QmtITz.js"
	},
	"/assets/portal.reports-BgNmsBHR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1765-Y2ABLrrEaAMoIzoT3/NyJ5YIwsk\"",
		"mtime": "2026-09-22T23:45:26.793Z",
		"size": 5989,
		"path": "../public/assets/portal.reports-BgNmsBHR.js"
	},
	"/assets/portal.settings-Bn0Zl6cF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7347-JX6YJM9tiH/XANIuCcxcBE8n7Nk\"",
		"mtime": "2026-09-22T23:45:26.793Z",
		"size": 29511,
		"path": "../public/assets/portal.settings-Bn0Zl6cF.js"
	},
	"/assets/portal.staff-BZHNd8Oz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14c6-CSvo/WnmE3fxQujNmo+xTaHErGI\"",
		"mtime": "2026-09-22T23:45:26.793Z",
		"size": 5318,
		"path": "../public/assets/portal.staff-BZHNd8Oz.js"
	},
	"/assets/portal.students-BUosHHnH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"198c-TKQuOnY8K9tfy3mHFVSqP9rLnMo\"",
		"mtime": "2026-09-22T23:45:26.793Z",
		"size": 6540,
		"path": "../public/assets/portal.students-BUosHHnH.js"
	},
	"/assets/portal.students._studentId-BIT_8GB9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2bb9-9lO+lLaH8sgmfp4ZXpDxUXKwwIE\"",
		"mtime": "2026-09-22T23:45:26.793Z",
		"size": 11193,
		"path": "../public/assets/portal.students._studentId-BIT_8GB9.js"
	},
	"/assets/printer-DHuupBcc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13f-Lb//V4B4/H4U4oGuCGxpBlXv7Lw\"",
		"mtime": "2026-09-22T23:45:26.793Z",
		"size": 319,
		"path": "../public/assets/printer-DHuupBcc.js"
	},
	"/assets/portal.timetable-DFkUPmdS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26ec-N1Ivc+DAKlR31TLUK5GkZfkCIms\"",
		"mtime": "2026-09-22T23:45:26.793Z",
		"size": 9964,
		"path": "../public/assets/portal.timetable-DFkUPmdS.js"
	},
	"/assets/profile-avatar-Cr3OxmD2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2bb-uvMB6yLrKGXNrN9Vp4861/O0axY\"",
		"mtime": "2026-09-22T23:45:26.794Z",
		"size": 699,
		"path": "../public/assets/profile-avatar-Cr3OxmD2.js"
	},
	"/assets/react-dom-C6zic-iE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dd7-kyUDtyva143VVQU0LWIf//37mdM\"",
		"mtime": "2026-09-22T23:45:26.794Z",
		"size": 3543,
		"path": "../public/assets/react-dom-C6zic-iE.js"
	},
	"/assets/routes-DyfFFrFV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1937-7OpfAoqMG+iKW9omHhHL8dxIYhM\"",
		"mtime": "2026-09-22T23:45:26.794Z",
		"size": 6455,
		"path": "../public/assets/routes-DyfFFrFV.js"
	},
	"/assets/route-B6EMKlhm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"580f-F7hqRPKwvZ5yQ6gV/vGJgGALTRM\"",
		"mtime": "2026-09-22T23:45:26.794Z",
		"size": 22543,
		"path": "../public/assets/route-B6EMKlhm.js"
	},
	"/assets/save-D-rok8ud.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"147-fjhWhqOoIyjg8qWIjuMPikwI4Lo\"",
		"mtime": "2026-09-22T23:45:26.794Z",
		"size": 327,
		"path": "../public/assets/save-D-rok8ud.js"
	},
	"/assets/search-BOoAgcSn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ae-Ddi9mxdkQS/5f9r8sXbaXS7Mdo8\"",
		"mtime": "2026-09-22T23:45:26.794Z",
		"size": 174,
		"path": "../public/assets/search-BOoAgcSn.js"
	},
	"/assets/select-DS7dhZi2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bda9-HI8LYXtwe7OOR0JH2N40StgyAFE\"",
		"mtime": "2026-09-22T23:45:26.794Z",
		"size": 48553,
		"path": "../public/assets/select-DS7dhZi2.js"
	},
	"/assets/settings-TO3TLUpc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e7-MIUjcwr+Fo+JMQYA1H69HWa8htU\"",
		"mtime": "2026-09-22T23:45:26.794Z",
		"size": 487,
		"path": "../public/assets/settings-TO3TLUpc.js"
	},
	"/assets/sheet-CnNO20Gb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"933-1DmGoNXvR7tmUj4NV5MuLWY+F/E\"",
		"mtime": "2026-09-22T23:45:26.794Z",
		"size": 2355,
		"path": "../public/assets/sheet-CnNO20Gb.js"
	},
	"/assets/shield-check-DIkkmTGs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-IsndAqx/kgVgnBCiAuZyDgG3et4\"",
		"mtime": "2026-09-22T23:45:26.794Z",
		"size": 320,
		"path": "../public/assets/shield-check-DIkkmTGs.js"
	},
	"/assets/shield-off-wlLjD2ok.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"190-Kc1otVClRT9ywVGtA129BzNYTt8\"",
		"mtime": "2026-09-22T23:45:26.794Z",
		"size": 400,
		"path": "../public/assets/shield-off-wlLjD2ok.js"
	},
	"/assets/site-header-ystQ393w.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15f7-Z00kM/26v4cwTwI9x2oY6sYeHGk\"",
		"mtime": "2026-09-22T23:45:26.794Z",
		"size": 5623,
		"path": "../public/assets/site-header-ystQ393w.js"
	},
	"/assets/smartphone-BlPq8YEt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c5-mgka0eaoewCNz2u7hyL+Igmod5Q\"",
		"mtime": "2026-09-22T23:45:26.794Z",
		"size": 197,
		"path": "../public/assets/smartphone-BlPq8YEt.js"
	},
	"/assets/styles-xUFygCYo.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"17978-mrPIVbr2IH7fdUFMQ7efl6/9Lu4\"",
		"mtime": "2026-09-22T23:45:26.795Z",
		"size": 96632,
		"path": "../public/assets/styles-xUFygCYo.css"
	},
	"/assets/tabs-B3w_9EFX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d6a-CQn9HyjaD01Lm1bu0+YyRS4e7i0\"",
		"mtime": "2026-09-22T23:45:26.795Z",
		"size": 7530,
		"path": "../public/assets/tabs-B3w_9EFX.js"
	},
	"/assets/textarea-BYwLAFgF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"203-Mk93NM104PptOeFyNAtv6nMgeHA\"",
		"mtime": "2026-09-22T23:45:26.795Z",
		"size": 515,
		"path": "../public/assets/textarea-BYwLAFgF.js"
	},
	"/assets/trash-2-CZvQ4USP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-fGP/Kb3XorVod8nCfKNJQ/aWrBw\"",
		"mtime": "2026-09-22T23:45:26.795Z",
		"size": 328,
		"path": "../public/assets/trash-2-CZvQ4USP.js"
	},
	"/assets/triangle-alert-B6_mHIad.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109-St7sX/cufNm730Gxyr22OYAcIkM\"",
		"mtime": "2026-09-22T23:45:26.795Z",
		"size": 265,
		"path": "../public/assets/triangle-alert-B6_mHIad.js"
	},
	"/assets/useMutation-Dg0mV_X3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"924-suNGL62eXW9y+VusGyasbuHX3qo\"",
		"mtime": "2026-09-22T23:45:26.795Z",
		"size": 2340,
		"path": "../public/assets/useMutation-Dg0mV_X3.js"
	},
	"/assets/useQuery-C9Oj_gik.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3be2d-q3Nv71Rcfe32wt7D+H0Aovx8dfo\"",
		"mtime": "2026-09-22T23:45:26.795Z",
		"size": 245293,
		"path": "../public/assets/useQuery-C9Oj_gik.js"
	},
	"/assets/user-plus-DzkA8ajm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"136-LdmX/tE1lDe3bsEO4LsyyJUT+EI\"",
		"mtime": "2026-09-22T23:45:26.795Z",
		"size": 310,
		"path": "../public/assets/user-plus-DzkA8ajm.js"
	},
	"/assets/user-round-BTMF39QQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b6-Zo9LMbsIbxcDn+TYWG/M+nOyD7Y\"",
		"mtime": "2026-09-22T23:45:26.795Z",
		"size": 182,
		"path": "../public/assets/user-round-BTMF39QQ.js"
	},
	"/assets/users-CmcK1_vM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-jPNOFDj9YgA508/GsVcYh2dJD8E\"",
		"mtime": "2026-09-22T23:45:26.795Z",
		"size": 306,
		"path": "../public/assets/users-CmcK1_vM.js"
	},
	"/assets/wallet-Dim5jlU2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25d-MPxmebrWLzZ6jKnJyUYnxOzalBA\"",
		"mtime": "2026-09-22T23:45:26.795Z",
		"size": 605,
		"path": "../public/assets/wallet-Dim5jlU2.js"
	},
	"/assets/x-Cs-wjJSL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-kh8mRzJEzjVhIb5uAjdNtwKcghw\"",
		"mtime": "2026-09-22T23:45:26.795Z",
		"size": 154,
		"path": "../public/assets/x-Cs-wjJSL.js"
	},
	"/images/gallery/photo-01.jpg": {
		"type": "image/jpeg",
		"etag": "\"11c4f-EEKUpRoiyDxcSHJIaxEMcXKEh/o\"",
		"mtime": "2026-09-22T23:45:36.289Z",
		"size": 72783,
		"path": "../public/images/gallery/photo-01.jpg"
	},
	"/images/gallery/photo-02.jpg": {
		"type": "image/jpeg",
		"etag": "\"18f2b-oafb/hJqll5u9z06vC3w0E2Itu4\"",
		"mtime": "2026-09-22T23:45:36.293Z",
		"size": 102187,
		"path": "../public/images/gallery/photo-02.jpg"
	},
	"/images/gallery/photo-03.jpg": {
		"type": "image/jpeg",
		"etag": "\"1f95c-Ie005jcya1lkZxaZaBspCajcU3Y\"",
		"mtime": "2026-09-22T23:45:36.292Z",
		"size": 129372,
		"path": "../public/images/gallery/photo-03.jpg"
	},
	"/images/gallery/photo-04.jpg": {
		"type": "image/jpeg",
		"etag": "\"22a60-mW4ffF4C3dlmA4qYVPf9omD7vvM\"",
		"mtime": "2026-09-22T23:45:36.293Z",
		"size": 141920,
		"path": "../public/images/gallery/photo-04.jpg"
	},
	"/images/gallery/photo-05.jpg": {
		"type": "image/jpeg",
		"etag": "\"472c2-yb37oXFgVxA+FwS5S9rGOs8vWcs\"",
		"mtime": "2026-09-22T23:45:36.294Z",
		"size": 291522,
		"path": "../public/images/gallery/photo-05.jpg"
	},
	"/images/gallery/photo-06.jpg": {
		"type": "image/jpeg",
		"etag": "\"36d6e-qXzQXAkApzLiW9Qb+cOQRWRTV3g\"",
		"mtime": "2026-09-22T23:45:36.296Z",
		"size": 224622,
		"path": "../public/images/gallery/photo-06.jpg"
	},
	"/images/gallery/photo-07.jpg": {
		"type": "image/jpeg",
		"etag": "\"5dbd4-iTECBKgZMXb158jG88qZXKneACQ\"",
		"mtime": "2026-09-22T23:45:36.299Z",
		"size": 383956,
		"path": "../public/images/gallery/photo-07.jpg"
	},
	"/images/gallery/photo-08.jpg": {
		"type": "image/jpeg",
		"etag": "\"2f34e-pB2DtlcsGLt2L6pvRkhbiKEOqbI\"",
		"mtime": "2026-09-22T23:45:36.296Z",
		"size": 193358,
		"path": "../public/images/gallery/photo-08.jpg"
	},
	"/images/gallery/photo-09.jpg": {
		"type": "image/jpeg",
		"etag": "\"520d5-6rV3oXkWaPB1bDmF7wALWSTD+IE\"",
		"mtime": "2026-09-22T23:45:36.301Z",
		"size": 336085,
		"path": "../public/images/gallery/photo-09.jpg"
	},
	"/images/gallery/photo-10.jpg": {
		"type": "image/jpeg",
		"etag": "\"3c75d-I+itsuvJQMjUFmdDkgORK+RFvdM\"",
		"mtime": "2026-09-22T23:45:36.302Z",
		"size": 247645,
		"path": "../public/images/gallery/photo-10.jpg"
	},
	"/images/login/classofstudent.jpeg": {
		"type": "image/jpeg",
		"etag": "\"2510c-M9Rb6knG6g5FHe1tU2OjKLHzFmU\"",
		"mtime": "2026-09-22T23:45:36.292Z",
		"size": 151820,
		"path": "../public/images/login/classofstudent.jpeg"
	},
	"/images/login/student.jpeg": {
		"type": "image/jpeg",
		"etag": "\"194a3-K33rvhgImto60BpRbSFtpbs2tSE\"",
		"mtime": "2026-09-22T23:45:36.300Z",
		"size": 103587,
		"path": "../public/images/login/student.jpeg"
	},
	"/images/login/studente.jpeg": {
		"type": "image/jpeg",
		"etag": "\"107bd-s3cTIOD+I9nbOSBDGAjlg+0g4Ig\"",
		"mtime": "2026-09-22T23:45:36.301Z",
		"size": 67517,
		"path": "../public/images/login/studente.jpeg"
	},
	"/images/login/studentsinclass.jpeg": {
		"type": "image/jpeg",
		"etag": "\"2e8d8-XbF4IAY7NpJQs7mwL0PbAEj/RIQ\"",
		"mtime": "2026-09-22T23:45:36.304Z",
		"size": 190680,
		"path": "../public/images/login/studentsinclass.jpeg"
	},
	"/images/school/Schooldirctorsermonongraduation.jpeg": {
		"type": "image/jpeg",
		"etag": "\"11c4f-EEKUpRoiyDxcSHJIaxEMcXKEh/o\"",
		"mtime": "2026-09-22T23:45:36.291Z",
		"size": 72783,
		"path": "../public/images/school/Schooldirctorsermonongraduation.jpeg"
	},
	"/images/school/boysgame.jpeg": {
		"type": "image/jpeg",
		"etag": "\"472c2-yb37oXFgVxA+FwS5S9rGOs8vWcs\"",
		"mtime": "2026-09-22T23:45:36.304Z",
		"size": 291522,
		"path": "../public/images/school/boysgame.jpeg"
	},
	"/images/school/classofstudent.jpeg": {
		"type": "image/jpeg",
		"etag": "\"2510c-M9Rb6knG6g5FHe1tU2OjKLHzFmU\"",
		"mtime": "2026-09-22T23:45:36.306Z",
		"size": 151820,
		"path": "../public/images/school/classofstudent.jpeg"
	},
	"/images/school/computerlab.jpeg": {
		"type": "image/jpeg",
		"etag": "\"22a60-mW4ffF4C3dlmA4qYVPf9omD7vvM\"",
		"mtime": "2026-09-22T23:45:36.306Z",
		"size": 141920,
		"path": "../public/images/school/computerlab.jpeg"
	},
	"/images/school/girlsgames.jpeg": {
		"type": "image/jpeg",
		"etag": "\"520d5-6rV3oXkWaPB1bDmF7wALWSTD+IE\"",
		"mtime": "2026-09-22T23:45:36.317Z",
		"size": 336085,
		"path": "../public/images/school/girlsgames.jpeg"
	},
	"/images/school/graduation.jpeg": {
		"type": "image/jpeg",
		"etag": "\"1f95c-Ie005jcya1lkZxaZaBspCajcU3Y\"",
		"mtime": "2026-09-22T23:45:36.306Z",
		"size": 129372,
		"path": "../public/images/school/graduation.jpeg"
	},
	"/images/school/student.jpeg": {
		"type": "image/jpeg",
		"etag": "\"194a3-K33rvhgImto60BpRbSFtpbs2tSE\"",
		"mtime": "2026-09-22T23:45:36.308Z",
		"size": 103587,
		"path": "../public/images/school/student.jpeg"
	},
	"/images/school/studente.jpeg": {
		"type": "image/jpeg",
		"etag": "\"107bd-s3cTIOD+I9nbOSBDGAjlg+0g4Ig\"",
		"mtime": "2026-09-22T23:45:36.308Z",
		"size": 67517,
		"path": "../public/images/school/studente.jpeg"
	},
	"/images/school/students.jpeg": {
		"type": "image/jpeg",
		"etag": "\"36d6e-qXzQXAkApzLiW9Qb+cOQRWRTV3g\"",
		"mtime": "2026-09-22T23:45:36.313Z",
		"size": 224622,
		"path": "../public/images/school/students.jpeg"
	},
	"/images/school/studentsinclas.jpeg": {
		"type": "image/jpeg",
		"etag": "\"18f2b-oafb/hJqll5u9z06vC3w0E2Itu4\"",
		"mtime": "2026-09-22T23:45:36.310Z",
		"size": 102187,
		"path": "../public/images/school/studentsinclas.jpeg"
	},
	"/images/school/studentsinclass.jpeg": {
		"type": "image/jpeg",
		"etag": "\"2e8d8-XbF4IAY7NpJQs7mwL0PbAEj/RIQ\"",
		"mtime": "2026-09-22T23:45:36.310Z",
		"size": 190680,
		"path": "../public/images/school/studentsinclass.jpeg"
	},
	"/images/school/teacherstrip.jpeg": {
		"type": "image/jpeg",
		"etag": "\"5dbd4-iTECBKgZMXb158jG88qZXKneACQ\"",
		"mtime": "2026-09-22T23:45:36.313Z",
		"size": 383956,
		"path": "../public/images/school/teacherstrip.jpeg"
	},
	"/images/school/theschool.jpeg": {
		"type": "image/jpeg",
		"etag": "\"3c75d-I+itsuvJQMjUFmdDkgORK+RFvdM\"",
		"mtime": "2026-09-22T23:45:36.317Z",
		"size": 247645,
		"path": "../public/images/school/theschool.jpeg"
	},
	"/images/school/tripforteachers.jpeg": {
		"type": "image/jpeg",
		"etag": "\"2f34e-pB2DtlcsGLt2L6pvRkhbiKEOqbI\"",
		"mtime": "2026-09-22T23:45:36.316Z",
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

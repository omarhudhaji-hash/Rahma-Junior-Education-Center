import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/i18n-BnVRWSRt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* English / Somali strings, carried over and extended from the original
* language.js on the Rahma site.
*/
var dictionary = {
	home: {
		en: "Home",
		so: "Bogga hore"
	},
	about: {
		en: "About",
		so: "Naga"
	},
	academics: {
		en: "Academics",
		so: "Waxbarasho"
	},
	admissions: {
		en: "Admissions",
		so: "Qoraalka"
	},
	gallery: {
		en: "Gallery",
		so: "Sawirro"
	},
	news: {
		en: "News",
		so: "Wararka"
	},
	contact: {
		en: "Contact",
		so: "Nala soo xiriir"
	},
	login: {
		en: "Login",
		so: "Gal"
	},
	logout: {
		en: "Sign out",
		so: "Ka bax"
	},
	apply: {
		en: "Apply Now",
		so: "Codso hadda"
	},
	portal: {
		en: "Portal",
		so: "Portal"
	},
	topWelcome: {
		en: "Welcome to Rahma Junior Education Center",
		so: "Ku soo dhawow Rahma Junior Education Center"
	},
	heroEyebrow: {
		en: "Foundation for knowledge",
		so: "Aasaaska aqoonta"
	},
	heroTitle: {
		en: "Providing the best foundation of education for young children.",
		so: "Bixinta aasaaska ugu fiican waxbarashada carruurta yaryar."
	},
	heroLead: {
		en: "Dedication, Efficiency, Integrity and Team Work.",
		so: "Go'aan, Hufnaan, Daacadnimo iyo Shaqo Wadajir."
	},
	discover: {
		en: "Discover our school",
		so: "Baro dugsigeenna"
	},
	dashboard: {
		en: "Dashboard",
		so: "Shaxda guud"
	},
	students: {
		en: "Students",
		so: "Ardayda"
	},
	classes: {
		en: "Classes",
		so: "Fasallada"
	},
	people: {
		en: "Staff & Parents",
		so: "Shaqaalaha & Waalidiinta"
	},
	attendance: {
		en: "Attendance",
		so: "Xaadirinta"
	},
	timetable: {
		en: "Timetable",
		so: "Jadwalka"
	},
	finance: {
		en: "Finance",
		so: "Maaliyadda"
	},
	fees: {
		en: "Fees",
		so: "Lacagta dugsiga"
	},
	inventory: {
		en: "Inventory",
		so: "Alaabta"
	},
	uniform: {
		en: "Uniform",
		so: "Dharka dugsiga"
	},
	messages: {
		en: "Messages",
		so: "Farriimaha"
	},
	sms: {
		en: "SMS Center",
		so: "Xarunta SMS"
	},
	announcements: {
		en: "Announcements",
		so: "Ogeysiisyada"
	},
	profile: {
		en: "My profile",
		so: "Xogtayda"
	},
	children: {
		en: "My children",
		so: "Carruurtayda"
	},
	results: {
		en: "Results",
		so: "Natiijada"
	},
	assignments: {
		en: "Assignments",
		so: "Hawlaha"
	},
	notes: {
		en: "Notes",
		so: "Qoraallada"
	},
	exams: {
		en: "Exams",
		so: "Imtixaannada"
	},
	save: {
		en: "Save",
		so: "Kaydi"
	},
	cancel: {
		en: "Cancel",
		so: "Jooji"
	},
	search: {
		en: "Search",
		so: "Raadi"
	},
	noRecords: {
		en: "No records found.",
		so: "Ma jiro diiwaan."
	},
	loading: {
		en: "Loading…",
		so: "Waa la soo dejinayaa…"
	},
	signInTitle: {
		en: "Sign in to your account",
		so: "Gal akoonkaaga"
	},
	signInIntro: {
		en: "Welcome back. Please enter your details.",
		so: "Ku soo dhawow. Fadlan geli xogtaada."
	},
	email: {
		en: "Email address",
		so: "Cinwaanka emailka"
	},
	password: {
		en: "Password",
		so: "Furaha sirta"
	},
	signIn: {
		en: "Sign in",
		so: "Gal"
	},
	signUp: {
		en: "Create account",
		so: "Samee akoon"
	},
	firstName: {
		en: "First name",
		so: "Magaca hore"
	},
	lastName: {
		en: "Last name",
		so: "Magaca dambe"
	},
	phone: {
		en: "Phone",
		so: "Telefoon"
	}
};
var I18nContext = (0, import_react.createContext)(null);
var STORAGE_KEY = "rahma-lang";
function I18nProvider({ children }) {
	const [lang, setLangState] = (0, import_react.useState)("en");
	(0, import_react.useEffect)(() => {
		const stored = window.localStorage.getItem(STORAGE_KEY);
		if (stored === "en" || stored === "so") setLangState(stored);
	}, []);
	const setLang = (0, import_react.useCallback)((next) => {
		setLangState(next);
		window.localStorage.setItem(STORAGE_KEY, next);
		document.documentElement.lang = next;
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		lang,
		setLang,
		toggle: () => setLang(lang === "en" ? "so" : "en"),
		t: (key) => dictionary[key]?.[lang] ?? dictionary[key]?.en ?? String(key)
	}), [lang, setLang]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nContext.Provider, {
		value,
		children
	});
}
function useI18n() {
	const ctx = (0, import_react.useContext)(I18nContext);
	if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
	return ctx;
}
//#endregion
export { useI18n as n, I18nProvider as t };

import { n as supabase } from "./client-B2gFRfJz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/school-BBKER8cz.js
var logoUrl = "/images/logo.jpg";
function setLogoUrl(nextUrl) {
	logoUrl = nextUrl && nextUrl.trim() ? nextUrl : "/images/logo.jpg";
}
var portalPhotos = [
	"/images/gallery/photo-01.jpg",
	"/images/gallery/photo-02.jpg",
	"/images/gallery/photo-04.jpg",
	"/images/gallery/photo-05.jpg"
];
var galleryPhotos = Array.from({ length: 10 }, (_, index) => {
	return {
		url: `/images/gallery/photo-${String(index + 1).padStart(2, "0")}.jpg`,
		caption: [
			"A proud moment at Rahma",
			"Focused classroom learning",
			"Graduation and milestones",
			"Building computer skills",
			"Confidence beyond the classroom",
			"Growing together as a community",
			"Support that makes a difference",
			"Community and staff experiences",
			"Teamwork, energy and confidence",
			"The Rahma experience"
		][index] ?? "Rahma school life"
	};
});
var heroPhotos = [
	"/images/gallery/photo-01.jpg",
	"/images/gallery/photo-02.jpg",
	"/images/gallery/photo-04.jpg",
	"/images/gallery/photo-05.jpg",
	"/images/gallery/photo-09.jpg",
	"/images/gallery/photo-03.jpg",
	"/images/gallery/photo-10.jpg"
];
var school = {
	name: "Rahma Junior Education Center",
	shortName: "Rahma Junior",
	motto: "Foundation for Knowledge",
	values: "Dedication, Efficiency, Integrity and Team Work.",
	phone: "+254 700 000 000",
	email: "info@rahmajunioreducation.ac.ke",
	location: "Rahma Junior Education Center"
};
var SCHOOL_SETTINGS_QUERY_KEY = ["school-settings"];
function readString(value, fallback) {
	if (typeof value === "string") return value.trim() || fallback;
	if (value == null) return fallback;
	return String(value);
}
function applySchoolSettings(row) {
	const next = {
		...school,
		name: readString(row?.school_name, school.name),
		shortName: readString(row?.short_name, school.shortName),
		motto: readString(row?.motto, school.motto),
		phone: readString(row?.phone, school.phone),
		email: readString(row?.email, school.email),
		location: readString(row?.address ?? row?.location, school.location)
	};
	Object.assign(school, next);
	setLogoUrl(row?.logo_url);
	return { ...school };
}
async function fetchSchoolSettings() {
	const fallback = { ...school };
	try {
		const { data, error } = await supabase.from("school_settings").select("*").eq("id", true).maybeSingle();
		if (error) throw error;
		return applySchoolSettings(data ?? null);
	} catch (error) {
		console.warn("[school] using static fallback settings", error);
		Object.assign(school, fallback);
		setLogoUrl(void 0);
		return { ...school };
	}
}
var roleLabels = {
	admin: "Administrator",
	headteacher: "Head Teacher",
	teacher: "Teacher",
	parent: "Parent",
	student: "Student"
};
var classOptions = [
	"Playgroup",
	"PP1",
	"PP2",
	"Grade 1",
	"Grade 2",
	"Grade 3",
	"Grade 4",
	"Grade 5",
	"Grade 6",
	"Grade 7",
	"Grade 8",
	"Grade 9"
];
var dayNames = [
	"",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday"
];
function fullName(p) {
	if (!p) return "";
	return [p.first_name, p.last_name].filter(Boolean).join(" ").trim();
}
function money(value) {
	return `KSh ${Number(value ?? 0).toLocaleString("en-KE", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	})}`;
}
//#endregion
export { fullName as a, logoUrl as c, roleLabels as d, school as f, fetchSchoolSettings as i, money as l, classOptions as n, galleryPhotos as o, dayNames as r, heroPhotos as s, SCHOOL_SETTINGS_QUERY_KEY as t, portalPhotos as u };

import { supabase } from "@/integrations/supabase/client";
import { setLogoUrl } from "@/lib/assets";

const defaultSchool = {
  name: "Rahma Junior Education Center",
  shortName: "Rahma Junior",
  motto: "Foundation for Knowledge",
  values: "Dedication, Efficiency, Integrity and Team Work.",
  phone: "+254 700 000 000",
  email: "info@rahmajunioreducation.ac.ke",
  location: "Rahma Junior Education Center",
};

export const school = { ...defaultSchool };
export const SCHOOL_SETTINGS_QUERY_KEY = ["school-settings"] as const;

function readString(value: unknown, fallback: string) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || fallback;
  }
  if (value == null) return fallback;
  return String(value);
}

export function applySchoolSettings(row?: Record<string, any> | null) {
  const next = {
    ...school,
    name: readString(row?.school_name, school.name),
    shortName: readString(row?.short_name, school.shortName),
    motto: readString(row?.motto, school.motto),
    phone: readString(row?.phone, school.phone),
    email: readString(row?.email, school.email),
    location: readString(row?.address ?? row?.location, school.location),
  };

  Object.assign(school, next);
  setLogoUrl(row?.logo_url);
  return { ...school };
}

export async function fetchSchoolSettings() {
  const fallback = { ...school };

  try {
    const { data, error } = await supabase.from("school_settings").select("*").eq("id", true).maybeSingle();
    if (error) throw error;

    const fixed = applySchoolSettings(data ?? null);
    return fixed;
  } catch (error) {
    console.warn("[school] using static fallback settings", error);
    Object.assign(school, fallback);
    setLogoUrl(undefined);
    return { ...school };
  }
}

export const APP_ROLES = ["admin", "headteacher", "teacher", "parent", "student"] as const;
export type AppRole = (typeof APP_ROLES)[number];

export const roleLabels: Record<AppRole, string> = {
  admin: "Administrator",
  headteacher: "Head Teacher",
  teacher: "Teacher",
  parent: "Parent",
  student: "Student",
};

export const classOptions = [
  "Playgroup", "PP1", "PP2",
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
  "Grade 7", "Grade 8", "Grade 9",
];

export const dayNames = [
  "",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function fullName(p?: { first_name?: string | null; last_name?: string | null } | null) {
  if (!p) return "";
  return [p.first_name, p.last_name].filter(Boolean).join(" ").trim();
}

export function money(value: number | string | null | undefined) {
  const n = Number(value ?? 0);
  return `KSh ${n.toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "?"
  );
}

export function gradeFor(marks: number, max = 100) {
  const pct = max ? (marks / max) * 100 : 0;
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  return "E";
}

import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Bell, Building2, CalendarDays, Check, CreditCard, FileText,
  GraduationCap, Palette, Save, ShieldCheck, Smartphone, Users,
} from "lucide-react";

import { requirePortalRoles } from "@/lib/permissions";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/hooks/use-auth";
import { fetchSchoolSettings, SCHOOL_SETTINGS_QUERY_KEY } from "@/lib/school";
import { PageHeader } from "@/components/portal/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/portal/settings")({
  ssr: false,
  head: () => ({ meta: [{ title: "School Control Center | Rahma Junior portal" }, { name: "robots", content: "noindex" }] }),
  beforeLoad: async () => { await requirePortalRoles(["admin"]); },
  component: SettingsPage,
});

type Settings = Record<string, string | boolean | number | null | undefined>;

const schoolSettingsColumnKeys = Object.keys({
  school_name: "",
  short_name: "",
  motto: "",
  phone: "",
  email: "",
  address: "",
  county: "",
  logo_url: "",
  website: "",
  registration_number: "",
  knec_number: "",
  principal_name: "",
  school_type: "",
  opening_time: "",
  closing_time: "",
  timezone: "",
  date_format: "",
  time_format: "",
  language: "",
  academic_year: "",
  current_term: "",
  term_start_date: "",
  term_end_date: "",
  grading_scheme: "",
  grading_scale: "",
  pass_mark: 0,
  promotion_enabled: true,
  receipt_prefix: "",
  document_prefix: "",
  admission_prefix: "",
  fee_invoice_prefix: "",
  certificate_prefix: "",
  currency: "",
  parent_portal_enabled: true,
  student_portal_enabled: true,
  online_admission_enabled: true,
  profile_photo_required: false,
  teacher_subject_assignment_enabled: true,
  teacher_remarks_enabled: true,
  attendance_alerts: true,
  automatic_absence_alerts: true,
  attendance_late_after_minutes: 0,
  announcement_notifications: true,
  exam_reminders: true,
  fee_reminders: true,
  sms_enabled: false,
  fee_payment_sms: true,
  result_sms: false,
  birthday_notifications: false,
  sms_sender_name: "",
  mpesa_paybill: "",
  mpesa_till: "",
  mpesa_account_name: "",
  report_card_signature_name: "",
  report_card_signature_title: "",
  report_card_footer: "",
  receipt_footer: "",
  primary_color: "",
  secondary_color: "",
  login_page_message: "",
  calendar_reminders_enabled: true,
  event_reminder_minutes: 0,
  login_notifications: false,
  session_timeout_minutes: 0,
  failed_login_protection: true,
  maintenance_mode: false,
} satisfies Settings) as Array<keyof Settings>;

const defaults: Settings = {
  school_name: "Rahma Junior Education Center", short_name: "Rahma Junior", motto: "Foundation for Knowledge",
  phone: "", email: "", address: "", county: "Nairobi", logo_url: "", website: "", registration_number: "", knec_number: "",
  principal_name: "", school_type: "private", opening_time: "07:30", closing_time: "16:30", timezone: "Africa/Nairobi",
  date_format: "dd/MM/yyyy", time_format: "24h", language: "en", academic_year: "2026", current_term: "Term 1",
  term_start_date: "", term_end_date: "", grading_scheme: "standard", grading_scale: "standard", pass_mark: 50, promotion_enabled: true,
  receipt_prefix: "RCT", document_prefix: "DOC", admission_prefix: "RJ", fee_invoice_prefix: "INV", certificate_prefix: "CERT", currency: "KSh",
  parent_portal_enabled: true, student_portal_enabled: true, online_admission_enabled: true, profile_photo_required: false,
  teacher_subject_assignment_enabled: true, teacher_remarks_enabled: true, attendance_alerts: true, automatic_absence_alerts: true,
  attendance_late_after_minutes: 15, announcement_notifications: true, exam_reminders: true, fee_reminders: true,
  sms_enabled: false, fee_payment_sms: true, result_sms: false, birthday_notifications: false, sms_sender_name: "",
  mpesa_paybill: "", mpesa_till: "", mpesa_account_name: "", report_card_signature_name: "", report_card_signature_title: "Head Teacher",
  report_card_footer: "", receipt_footer: "", primary_color: "#0f766e", secondary_color: "#0f172a", login_page_message: "",
  calendar_reminders_enabled: true, event_reminder_minutes: 60, login_notifications: false, session_timeout_minutes: 60,
  failed_login_protection: true, maintenance_mode: false,
};

type Section = { id: string; label: string; icon: React.ComponentType<{ className?: string }> };
const sections: Section[] = [
  { id: "school", label: "School Profile", icon: Building2 },
  { id: "academic", label: "Academic", icon: GraduationCap },
  { id: "portals", label: "Portals & Users", icon: Users },
  { id: "attendance", label: "Attendance", icon: Check },
  { id: "finance", label: "Finance & M-Pesa", icon: CreditCard },
  { id: "notifications", label: "Notifications & SMS", icon: Smartphone },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security & System", icon: ShieldCheck },
];

function SettingsPage() {
  const { userId } = useMe();
  const qc = useQueryClient();
  const [active, setActive] = useState("school");
  const [form, setForm] = useState<Settings>(defaults);
  const [savedSnapshot, setSavedSnapshot] = useState<Settings>(defaults);
  const query = useQuery({
    queryKey: SCHOOL_SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const settings = await fetchSchoolSettings();
      return { ...defaults, ...settings } as Settings;
    },
  });
  useEffect(() => {
    if (query.data) {
      setForm(query.data);
      setSavedSnapshot(query.data);
    }
  }, [query.data]);

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(savedSnapshot),
    [form, savedSnapshot],
  );

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasUnsavedChanges]);

  function validateSettings() {
    const passMark = Number(valueOf(form, "pass_mark"));
    const lateAfter = Number(valueOf(form, "attendance_late_after_minutes"));
    const timeout = Number(valueOf(form, "session_timeout_minutes"));
    const reminder = Number(valueOf(form, "event_reminder_minutes"));
    const start = String(valueOf(form, "term_start_date"));
    const end = String(valueOf(form, "term_end_date"));
    const opening = String(valueOf(form, "opening_time"));
    const closing = String(valueOf(form, "closing_time"));
    if (!String(valueOf(form, "school_name")).trim()) return "School name is required.";
    if (!Number.isFinite(passMark) || passMark < 0 || passMark > 100) return "Pass mark must be between 0 and 100.";
    if (!Number.isFinite(lateAfter) || lateAfter < 0) return "Late-after minutes cannot be negative.";
    if (!Number.isFinite(timeout) || timeout < 5) return "Session timeout must be at least 5 minutes.";
    if (!Number.isFinite(reminder) || reminder < 0) return "Event reminder minutes cannot be negative.";
    if (start && end && start > end) return "Term end date cannot be before the term start date.";
    if (opening && closing && opening >= closing) return "Closing time must be later than opening time.";
    const primary = String(valueOf(form, "primary_color"));
    const secondary = String(valueOf(form, "secondary_color"));
    if (!/^#[0-9a-fA-F]{6}$/.test(primary)) return "Primary color must be a valid 6-digit hex color.";
    if (!/^#[0-9a-fA-F]{6}$/.test(secondary)) return "Secondary color must be a valid 6-digit hex color.";
    return null;
  }

  const save = useMutation({
    mutationFn: async () => {
      const validationError = validateSettings();
      if (validationError) throw new Error(validationError);

      const payload = Object.fromEntries(
        schoolSettingsColumnKeys.map((key) => {
          const value = form[key];
          if (typeof value === "string" && value.trim() === "") return [key, null];
          return [key, value ?? null];
        }),
      ) as Record<string, string | boolean | number | null>;

      const upsertPayload = {
        ...payload,
        id: true,
        updated_by: userId ?? null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("school_settings")
        .upsert(upsertPayload, { onConflict: "id" });

      if (error) throw error;
    },
    onSuccess: async () => {
      setSavedSnapshot(form);
      toast.success("School settings saved successfully");
      const latest = await fetchSchoolSettings();
      qc.setQueryData(SCHOOL_SETTINGS_QUERY_KEY, { ...defaults, ...latest });
      await qc.invalidateQueries({ queryKey: SCHOOL_SETTINGS_QUERY_KEY });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save settings"),
  });

  const set = (key: string, value: string | boolean | number) => setForm(f => ({ ...f, [key]: value }));
  const value = (key: string) => form[key] ?? "";

  return <div className="space-y-6">
    <PageHeader title="School Control Center" description="One place to control your school's identity, academics, finance, portals, notifications, documents, security and appearance." actions={<div className="flex flex-wrap items-center gap-2">{hasUnsavedChanges && <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800">Unsaved changes</span>}<Button type="button" variant="outline" onClick={() => setForm(savedSnapshot)} disabled={!hasUnsavedChanges || save.isPending}>Reset</Button><Button size="lg" onClick={() => save.mutate()} disabled={save.isPending || !hasUnsavedChanges}><Save className="mr-2 size-4" />{save.isPending ? "Saving…" : "Save all changes"}</Button></div>} />
    {query.isError && <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm"><p className="font-semibold">Settings could not be loaded.</p><p className="mt-1 text-muted-foreground">{query.error instanceof Error ? query.error.message : "Please try again."}</p><Button className="mt-3" variant="outline" onClick={() => query.refetch()}>Try again</Button></div>}
    <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
      <Card className="h-fit lg:sticky lg:top-4"><CardHeader><CardTitle className="text-base">Settings</CardTitle></CardHeader><CardContent className="space-y-1 p-3">
        {sections.map(s => { const Icon = s.icon; return <button type="button" key={s.id} onClick={() => setActive(s.id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${active === s.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}><Icon className="size-4" />{s.label}</button>; })}
      </CardContent></Card>

      <div className="space-y-6">
        {active === "school" && <SectionCard icon={Building2} title="School Profile" description="Identity and contact information used across the portal."><div className="grid gap-4 sm:grid-cols-2">
          <Field label="School name"><Input value={String(value("school_name"))} onChange={e => set("school_name", e.target.value)} /></Field><Field label="Short name"><Input value={String(value("short_name"))} onChange={e => set("short_name", e.target.value)} /></Field>
          <Field label="Motto"><Input value={String(value("motto"))} onChange={e => set("motto", e.target.value)} /></Field><Field label="Principal / Headteacher"><Input value={String(value("principal_name"))} onChange={e => set("principal_name", e.target.value)} /></Field>
          <Field label="Phone"><Input value={String(value("phone"))} onChange={e => set("phone", e.target.value)} /></Field><Field label="Email"><Input type="email" value={String(value("email"))} onChange={e => set("email", e.target.value)} /></Field>
          <Field label="County"><Input value={String(value("county"))} onChange={e => set("county", e.target.value)} /></Field><Field label="Website"><Input value={String(value("website"))} onChange={e => set("website", e.target.value)} /></Field>
          <Field label="Registration number"><Input value={String(value("registration_number"))} onChange={e => set("registration_number", e.target.value)} /></Field><Field label="KNEC / school identifier"><Input value={String(value("knec_number"))} onChange={e => set("knec_number", e.target.value)} /></Field>
          <div className="sm:col-span-2"><Field label="Physical address"><Input value={String(value("address"))} onChange={e => set("address", e.target.value)} /></Field></div>
          <Field label="Logo URL"><Input value={String(value("logo_url"))} onChange={e => set("logo_url", e.target.value)} placeholder="https://…" /></Field>
          <Field label="School type"><Select value={String(value("school_type"))} onValueChange={v => set("school_type", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="private">Private</SelectItem><SelectItem value="public">Public</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></Field>
          <Field label="Opening time"><Input type="time" value={String(value("opening_time"))} onChange={e => set("opening_time", e.target.value)} /></Field><Field label="Closing time"><Input type="time" value={String(value("closing_time"))} onChange={e => set("closing_time", e.target.value)} /></Field>
          <Field label="Time format"><Select value={String(value("time_format"))} onValueChange={v => set("time_format", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="24h">24-hour</SelectItem><SelectItem value="12h">12-hour</SelectItem></SelectContent></Select></Field>
        </div></SectionCard>}

        {active === "academic" && <SectionCard icon={GraduationCap} title="Academic & CBC Settings" description="Configure the active academic period and grading behaviour."><div className="grid gap-4 sm:grid-cols-2">
          <Field label="Academic year"><Input value={String(value("academic_year"))} onChange={e => set("academic_year", e.target.value)} /></Field><Field label="Current term"><Select value={String(value("current_term"))} onValueChange={v => set("current_term", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Term 1">Term 1</SelectItem><SelectItem value="Term 2">Term 2</SelectItem><SelectItem value="Term 3">Term 3</SelectItem></SelectContent></Select></Field>
          <Field label="Term start"><Input type="date" value={String(value("term_start_date"))} onChange={e => set("term_start_date", e.target.value)} /></Field><Field label="Term end"><Input type="date" value={String(value("term_end_date"))} onChange={e => set("term_end_date", e.target.value)} /></Field>
          <Field label="Grading scheme"><Select value={String(value("grading_scheme"))} onValueChange={v => set("grading_scheme", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="standard">Standard A–E</SelectItem><SelectItem value="cbc">CBC-style descriptors</SelectItem></SelectContent></Select></Field>
          <Field label="Grading scale"><Select value={String(value("grading_scale"))} onValueChange={v => set("grading_scale", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="standard">Standard</SelectItem><SelectItem value="percentage">Percentage</SelectItem><SelectItem value="cbc">CBC descriptors</SelectItem></SelectContent></Select></Field>
          <Field label="Pass mark (%)"><Input type="number" min="0" max="100" value={String(value("pass_mark"))} onChange={e => set("pass_mark", Number(e.target.value))} /></Field>
          <div className="sm:col-span-2"><Toggle label="Enable student promotion workflow" description="Allow the academic workflow to promote students at the end of the academic cycle." checked={Boolean(value("promotion_enabled"))} onChange={v => set("promotion_enabled", v)} /></div>
        </div></SectionCard>}

        {active === "portals" && <SectionCard icon={Users} title="Portals & User Controls" description="Control which major portal and workflow features are available."><div className="space-y-3">
          <Toggle label="Parent portal" description="Allow parent accounts to use the portal." checked={Boolean(value("parent_portal_enabled"))} onChange={v => set("parent_portal_enabled", v)} />
          <Toggle label="Student portal" description="Allow student accounts to use the portal." checked={Boolean(value("student_portal_enabled"))} onChange={v => set("student_portal_enabled", v)} />
          <Toggle label="Online admissions" description="Enable the public admission workflow." checked={Boolean(value("online_admission_enabled"))} onChange={v => set("online_admission_enabled", v)} />
          <Toggle label="Require student profile photos" description="Make a profile photo part of the student profile workflow." checked={Boolean(value("profile_photo_required"))} onChange={v => set("profile_photo_required", v)} />
          <Toggle label="Teacher subject assignment" description="Enable teacher-to-subject assignment workflows." checked={Boolean(value("teacher_subject_assignment_enabled"))} onChange={v => set("teacher_subject_assignment_enabled", v)} />
          <Toggle label="Teacher remarks" description="Allow teachers to enter class and student remarks." checked={Boolean(value("teacher_remarks_enabled"))} onChange={v => set("teacher_remarks_enabled", v)} />
        </div></SectionCard>}

        {active === "attendance" && <SectionCard icon={Check} title="Attendance" description="Attendance rules and parent alert controls."><div className="grid gap-4 sm:grid-cols-2"><Field label="Late after (minutes)"><Input type="number" min="0" value={String(value("attendance_late_after_minutes"))} onChange={e => set("attendance_late_after_minutes", Number(e.target.value))} /></Field></div><div className="mt-4 space-y-3"><Toggle label="Attendance alerts" description="Enable attendance notification workflows." checked={Boolean(value("attendance_alerts"))} onChange={v => set("attendance_alerts", v)} /><Toggle label="Automatic absence alerts" description="Send configured alerts when a student is marked absent." checked={Boolean(value("automatic_absence_alerts"))} onChange={v => set("automatic_absence_alerts", v)} /></div></SectionCard>}

        {active === "finance" && <SectionCard icon={CreditCard} title="Finance & M-Pesa" description="Currency, numbering and Kenyan payment configuration."><div className="grid gap-4 sm:grid-cols-2">
          <Field label="Currency"><Select value={String(value("currency"))} onValueChange={v => set("currency", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="KSh">KSh — Kenyan Shilling</SelectItem><SelectItem value="USD">USD — US Dollar</SelectItem><SelectItem value="UGX">UGX — Ugandan Shilling</SelectItem><SelectItem value="TZS">TZS — Tanzanian Shilling</SelectItem></SelectContent></Select></Field>
          <Field label="Fee invoice prefix"><Input value={String(value("fee_invoice_prefix"))} onChange={e => set("fee_invoice_prefix", e.target.value)} /></Field>
          <Field label="Receipt prefix"><Input value={String(value("receipt_prefix"))} onChange={e => set("receipt_prefix", e.target.value)} /></Field><Field label="Admission prefix"><Input value={String(value("admission_prefix"))} onChange={e => set("admission_prefix", e.target.value)} /></Field>
          <Field label="M-Pesa PayBill"><Input value={String(value("mpesa_paybill"))} onChange={e => set("mpesa_paybill", e.target.value)} /></Field><Field label="M-Pesa Till"><Input value={String(value("mpesa_till"))} onChange={e => set("mpesa_till", e.target.value)} /></Field>
          <Field label="M-Pesa account/reference name"><Input value={String(value("mpesa_account_name"))} onChange={e => set("mpesa_account_name", e.target.value)} /></Field>
        </div><div className="mt-4 rounded-lg border p-4 text-sm text-muted-foreground">M-Pesa API credentials should remain in Supabase Edge Function secrets, never in this page.</div></SectionCard>}

        {active === "notifications" && <SectionCard icon={Bell} title="Notifications & SMS" description="Master switches for communication workflows."><div className="space-y-3">
          <Toggle label="SMS automation" description="Master switch for automated SMS workflows." checked={Boolean(value("sms_enabled"))} onChange={v => set("sms_enabled", v)} />
          <Toggle label="Fee payment SMS" description="Notify parents after successful fee payments." checked={Boolean(value("fee_payment_sms"))} onChange={v => set("fee_payment_sms", v)} />
          <Toggle label="Fee reminders" description="Allow fee reminder workflows." checked={Boolean(value("fee_reminders"))} onChange={v => set("fee_reminders", v)} />
          <Toggle label="Result SMS" description="Allow result publication notifications by SMS." checked={Boolean(value("result_sms"))} onChange={v => set("result_sms", v)} />
          <Toggle label="Exam reminders" description="Allow exam reminder workflows." checked={Boolean(value("exam_reminders"))} onChange={v => set("exam_reminders", v)} />
          <Toggle label="Announcements" description="Notify users about published school announcements." checked={Boolean(value("announcement_notifications"))} onChange={v => set("announcement_notifications", v)} />
          <Toggle label="Birthday notifications" description="Enable birthday notification workflows." checked={Boolean(value("birthday_notifications"))} onChange={v => set("birthday_notifications", v)} />
          <Field label="SMS sender name"><Input value={String(value("sms_sender_name"))} onChange={e => set("sms_sender_name", e.target.value)} placeholder="RAHMA" /></Field>
        </div></SectionCard>}

        {active === "documents" && <SectionCard icon={FileText} title="Documents & Reports" description="Branding and numbering defaults for generated documents."><div className="grid gap-4 sm:grid-cols-2">
          <Field label="Document prefix"><Input value={String(value("document_prefix"))} onChange={e => set("document_prefix", e.target.value)} /></Field><Field label="Certificate prefix"><Input value={String(value("certificate_prefix"))} onChange={e => set("certificate_prefix", e.target.value)} /></Field>
          <Field label="Report-card signature name"><Input value={String(value("report_card_signature_name"))} onChange={e => set("report_card_signature_name", e.target.value)} /></Field><Field label="Signature title"><Input value={String(value("report_card_signature_title"))} onChange={e => set("report_card_signature_title", e.target.value)} /></Field>
          <div className="sm:col-span-2"><Field label="Report-card footer"><Textarea value={String(value("report_card_footer"))} onChange={e => set("report_card_footer", e.target.value)} /></Field></div>
          <div className="sm:col-span-2"><Field label="Receipt footer"><Textarea value={String(value("receipt_footer"))} onChange={e => set("receipt_footer", e.target.value)} /></Field></div>
        </div></SectionCard>}

        {active === "calendar" && <SectionCard icon={CalendarDays} title="School Calendar" description="Calendar reminder defaults for school events."><div className="grid gap-4 sm:grid-cols-2"><Field label="Default event reminder (minutes)"><Input type="number" min="0" value={String(value("event_reminder_minutes"))} onChange={e => set("event_reminder_minutes", Number(e.target.value))} /></Field></div><div className="mt-4"><Toggle label="Calendar reminders" description="Enable reminders for school calendar events." checked={Boolean(value("calendar_reminders_enabled"))} onChange={v => set("calendar_reminders_enabled", v)} /></div></SectionCard>}

        {active === "appearance" && <SectionCard icon={Palette} title="Appearance & Branding" description="Control the portal's school branding defaults."><div className="grid gap-4 sm:grid-cols-2"><Field label="Primary color"><Input type="text" value={String(value("primary_color"))} onChange={e => set("primary_color", e.target.value)} placeholder="#0f766e" /></Field><Field label="Secondary color"><Input type="text" value={String(value("secondary_color"))} onChange={e => set("secondary_color", e.target.value)} placeholder="#0f172a" /></Field><div className="sm:col-span-2"><Field label="Login page message"><Textarea value={String(value("login_page_message"))} onChange={e => set("login_page_message", e.target.value)} placeholder="Welcome to our school portal…" /></Field></div></div></SectionCard>}

        {active === "security" && <SectionCard icon={ShieldCheck} title="Security & System" description="Central defaults for account sessions and maintenance." warning><div className="grid gap-4 sm:grid-cols-2"><Field label="Session timeout (minutes)"><Input type="number" min="5" value={String(value("session_timeout_minutes"))} onChange={e => set("session_timeout_minutes", Number(e.target.value))} /></Field><Field label="Timezone"><Select value={String(value("timezone"))} onValueChange={v => set("timezone", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Africa/Nairobi">Africa/Nairobi (Kenya)</SelectItem><SelectItem value="Africa/Kampala">Africa/Kampala (Uganda)</SelectItem><SelectItem value="Africa/Dar_es_Salaam">Africa/Dar_es_Salaam (Tanzania)</SelectItem><SelectItem value="UTC">UTC</SelectItem></SelectContent></Select></Field><Field label="Date format"><Select value={String(value("date_format"))} onValueChange={v => set("date_format", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem><SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem><SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem></SelectContent></Select></Field><Field label="Language"><Select value={String(value("language"))} onValueChange={v => set("language", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="sw">Kiswahili</SelectItem></SelectContent></Select></Field></div><div className="mt-4 space-y-3"><Toggle label="Failed-login protection" description="Keep protection against repeated failed login attempts enabled." checked={Boolean(value("failed_login_protection"))} onChange={v => set("failed_login_protection", v)} /><Toggle label="Login notifications" description="Enable login notification workflows when supported." checked={Boolean(value("login_notifications"))} onChange={v => set("login_notifications", v)} /><Toggle label="Maintenance mode" description="Reserve for controlled maintenance. This does not automatically block every route until the application consumes this flag." checked={Boolean(value("maintenance_mode"))} onChange={v => set("maintenance_mode", v)} /></div></SectionCard>}
      </div>
    </div>
  </div>;
}

function valueOf(settings: Settings, key: string) { return settings[key] ?? ""; }

function SectionCard({ icon: Icon, title, description, children, warning = false }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string; children: ReactNode; warning?: boolean }) {
  return <Card className={warning ? "border-amber-200" : ""}><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Icon className="size-5 text-primary" />{title}</CardTitle><p className="text-sm text-muted-foreground">{description}</p></CardHeader><CardContent>{children}</CardContent></Card>;
}
function Field({ label, children }: { label: string; children: ReactNode }) { return <div className="space-y-2"><Label>{label}</Label>{children}</div>; }
function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) { return <div className="flex items-center justify-between gap-4 rounded-lg border border-border/70 p-4"><div><p className="text-sm font-medium text-navy">{label}</p><p className="mt-1 text-xs text-muted-foreground">{description}</p></div><Switch checked={checked} onCheckedChange={onChange} /></div>; }

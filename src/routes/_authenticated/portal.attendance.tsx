import { createFileRoute } from "@tanstack/react-router";
import { requirePortalRoles } from "@/lib/permissions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { CalendarCheck, CheckCheck, ClipboardCheck, History, Save, Search, Users } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/portal/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useMe } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { fullName } from "@/lib/school";

type Status = "present" | "absent" | "late" | "excused";
const statuses: Status[] = ["present", "absent", "late", "excused"];

export const Route = createFileRoute("/_authenticated/portal/attendance")({
  beforeLoad: async () => { await requirePortalRoles(["admin", "headteacher", "teacher", "parent", "student"]); },
  component: AttendancePage,
});

function AttendancePage() {
  const { userId, hasRole } = useMe();
  const family = hasRole("parent") || hasRole("student");
  return family ? <FamilyAttendance userId={userId} /> : <StaffAttendance userId={userId} teacher={hasRole("teacher")} />;
}

function statusBadge(status: Status | undefined) {
  if (!status) return <Badge variant="outline">Not marked</Badge>;
  return <Badge variant={status === "present" ? "default" : status === "absent" ? "destructive" : "secondary"} className="capitalize">{status}</Badge>;
}

function StaffAttendance({ userId, teacher }: { userId: string | undefined; teacher: boolean }) {
  const qc = useQueryClient();
  const [classId, setClassId] = useState("");
  const [classSearch, setClassSearch] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<Record<string, Status>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const classes = useQuery({
    queryKey: ["attendance-classes", teacher, userId],
    queryFn: async () => {
      let q = supabase.from("classes").select("id,name,section,level_order").order("level_order");
      if (teacher) {
        const { data, error } = await supabase.from("teacher_class_assignments").select("class_id").eq("teacher_id", userId!);
        if (error) throw error;
        const ids = [...new Set((data ?? []).map(x => x.class_id))];
        if (!ids.length) return [];
        q = q.in("id", ids);
      }
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  const roster = useQuery({
    queryKey: ["staff-roster", classId, date],
    enabled: !!classId,
    queryFn: async () => {
      const [{ data: studs, error }, { data: recs, error: recError }] = await Promise.all([
        supabase.from("students").select("id,first_name,last_name,admission_no").eq("current_class_id", classId).order("first_name"),
        supabase.from("attendance_records").select("student_id,status,remarks").eq("class_id", classId).eq("attendance_date", date),
      ]);
      if (error) throw error;
      if (recError) throw recError;
      const m = new Map((recs ?? []).map(r => [r.student_id, r]));
      return (studs ?? []).map(s => ({ ...s, attendance: m.get(s.id) ?? null }));
    },
  });

  const rows = useMemo(() => {
    const n = search.trim().toLowerCase();
    return (roster.data ?? []).filter(s => !n || `${s.first_name} ${s.last_name} ${s.admission_no}`.toLowerCase().includes(n));
  }, [roster.data, search]);

  const summary = useMemo(() => {
    const counts: Record<Status, number> = { present: 0, absent: 0, late: 0, excused: 0 };
    for (const s of rows) {
      const value = draft[s.id] ?? s.attendance?.status;
      if (value) counts[value as Status] += 1;
    }
    return { ...counts, total: rows.length, marked: Object.values(counts).reduce((a, b) => a + b, 0) };
  }, [rows, draft]);

  function markAllPresent() {
    if (!rows.length) return;
    setDraft(current => {
      const next = { ...current };
      for (const student of rows) next[student.id] = "present";
      return next;
    });
    toast.success(`Marked ${rows.length} learner${rows.length === 1 ? "" : "s"} present. Click Save attendance to record it.`);
  }

  async function save() {
    const selectedRows = rows.filter(s => draft[s.id] || remarks[s.id] !== undefined);
    if (!selectedRows.length) {
      toast.info("Mark a learner or add a remark first.");
      return;
    }
    setSaving(true);
    for (const student of selectedRows) {
      const status = draft[student.id] ?? student.attendance?.status;
      if (!status) {
        toast.error(`Please choose an attendance status for ${fullName(student)}.`);
        setSaving(false);
        return;
      }
      const { error } = await supabase.from("attendance_records").upsert({
        student_id: student.id,
        class_id: classId,
        attendance_date: date,
        status,
        remarks: remarks[student.id] ?? student.attendance?.remarks ?? null,
        marked_by: userId ?? null,
      }, { onConflict: "student_id,attendance_date" });
      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }
    }
    setSaving(false);
    setDraft({});
    setRemarks({});
    qc.invalidateQueries({ queryKey: ["staff-roster", classId, date] });
    toast.success("Attendance saved successfully.");
  }

  return <div>
    <PageHeader
      title="Attendance"
      description={teacher ? "Mark attendance for your assigned classes and track learner attendance." : "Manage and review attendance across the school."}
      actions={<div className="flex flex-wrap gap-2"><Button variant="outline" onClick={markAllPresent} disabled={!classId || !rows.length}><CheckCheck className="mr-2 size-4" />Mark all present</Button><Button onClick={save} disabled={saving || !classId}>{saving ? "Saving…" : <><Save className="mr-2 size-4" />Save attendance</>}</Button></div>}
    />

    <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <SummaryCard label="Learners" value={summary.total} icon={<Users className="size-4" />} />
      <SummaryCard label="Present" value={summary.present} />
      <SummaryCard label="Absent" value={summary.absent} />
      <SummaryCard label="Late" value={summary.late} />
      <SummaryCard label="Excused" value={summary.excused} />
    </div>

    <Card>
      <CardContent className="space-y-5 p-4 sm:p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <Label>Class</Label>
            <Input value={classSearch} onChange={e => setClassSearch(e.target.value)} placeholder="Search class…" className="mb-2" />
            <Select value={classId} onValueChange={value => { setClassId(value); setDraft({}); setRemarks({}); }}>
              <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
              <SelectContent>{(classes.data ?? []).filter(c => !classSearch || `${c.name} ${c.section ?? ""}`.toLowerCase().includes(classSearch.toLowerCase())).map(c => <SelectItem key={c.id} value={c.id}>{c.name}{c.section ? ` — ${c.section}` : ""}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Date</Label><Input type="date" value={date} onChange={e => { setDate(e.target.value); setDraft({}); setRemarks({}); }} /></div>
          <div className="md:col-span-2"><Label>Search learner</Label><div className="relative"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Name or admission number" className="pl-9" /></div></div>
        </div>

        {!classId ? <EmptyState message="Select a class to load its attendance register." /> : roster.isLoading ? <EmptyState message="Loading learners…" /> : rows.length === 0 ? <EmptyState message="No learners found in this class." /> : <>
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/30 p-3 text-sm">
            <span><strong>{summary.marked}</strong> of <strong>{summary.total}</strong> learners marked</span>
            <span className="text-muted-foreground">Select a status, add an optional remark, then save.</span>
          </div>
          <div className="divide-y rounded-md border">
            {rows.map(s => {
              const current = draft[s.id] ?? s.attendance?.status;
              const remark = remarks[s.id] ?? s.attendance?.remarks ?? "";
              return <div key={s.id} className="space-y-3 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><p className="font-medium text-navy">{fullName(s)}</p><p className="font-mono text-xs text-muted-foreground">{s.admission_no}</p></div>
                  <div className="flex flex-wrap items-center gap-1">{statuses.map(st => <Button key={st} size="sm" variant={current === st ? "default" : "outline"} onClick={() => setDraft(d => ({ ...d, [s.id]: st }))} className="capitalize">{st}</Button>)}{statusBadge(current as Status | undefined)}</div>
                </div>
                <Textarea value={remark} onChange={e => setRemarks(r => ({ ...r, [s.id]: e.target.value }))} placeholder="Optional attendance remark…" rows={2} />
              </div>;
            })}
          </div>
        </>}
      </CardContent>
    </Card>
  </div>;
}

function SummaryCard({ label, value, icon }: { label: string; value: number; icon?: ReactNode }) {
  return <Card><CardContent className="flex items-center justify-between p-4"><div><p className="text-xs text-muted-foreground">{label}</p><p className="text-2xl font-bold">{value}</p></div>{icon ?? <ClipboardCheck className="size-4 text-muted-foreground" />}</CardContent></Card>;
}

function FamilyAttendance({ userId }: { userId: string | undefined }) {
  const children = useQuery({
    queryKey: ["my-children-attendance", userId],
    queryFn: async () => {
      let ids: string[] = [];
      const { data: linked, error: linkError } = await supabase.from("parent_student").select("student_id").eq("parent_id", userId!);
      if (linkError) throw linkError;
      if (linked?.length) ids = linked.map(x => x.student_id);
      else {
        const { data: own, error } = await supabase.from("students").select("id").eq("user_id", userId!);
        if (error) throw error;
        ids = (own ?? []).map(x => x.id);
      }
      if (!ids.length) return [];
      const { data, error } = await supabase.from("students").select("id,first_name,last_name,admission_no,classes:current_class_id(name)").in("id", ids);
      if (error) throw error;
      return data ?? [];
    },
  });
  const [studentId, setStudentId] = useState("");
  const attendance = useQuery({
    queryKey: ["my-attendance", studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const { data, error } = await supabase.from("attendance_records").select("attendance_date,status,remarks").eq("student_id", studentId).order("attendance_date", { ascending: false }).limit(365);
      if (error) throw error;
      return data ?? [];
    },
  });

  const stats = useMemo(() => {
    const rows = attendance.data ?? [];
    const present = rows.filter(x => x.status === "present").length;
    const late = rows.filter(x => x.status === "late").length;
    const absent = rows.filter(x => x.status === "absent").length;
    const excused = rows.filter(x => x.status === "excused").length;
    return { present, late, absent, excused, total: rows.length, percentage: rows.length ? Math.round(((present + late) / rows.length) * 100) : 0 };
  }, [attendance.data]);

  return <div>
    <PageHeader title="My Attendance" description="Attendance marked by the school for your child or children." />
    <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
      <Card><CardHeader><CardTitle className="text-base">Children</CardTitle></CardHeader><CardContent className="space-y-2">{(children.data ?? []).map(c => <button key={c.id} onClick={() => setStudentId(c.id)} className={`w-full rounded-lg border p-3 text-left ${studentId === c.id ? "border-primary bg-primary/10" : "hover:bg-muted"}`}><p className="font-semibold">{fullName(c)}</p><p className="text-xs text-muted-foreground">{(c.classes as any)?.name ?? "Class not assigned"}</p><p className="mt-1 text-xs text-muted-foreground">{c.admission_no}</p></button>)}{!children.isLoading && !children.data?.length && <EmptyState message="No linked children found." />}</CardContent></Card>
      <div className="space-y-6">
        {!studentId ? <Card><CardContent className="p-6"><EmptyState message="Select a child to view attendance." /></CardContent></Card> : <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <SummaryCard label="Attendance" value={stats.percentage} icon={<CalendarCheck className="size-4 text-muted-foreground" />} />
            <SummaryCard label="Present" value={stats.present} />
            <SummaryCard label="Absent" value={stats.absent} />
            <SummaryCard label="Late" value={stats.late} />
            <SummaryCard label="Excused" value={stats.excused} />
          </div>
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><History className="size-4" />Attendance history</CardTitle></CardHeader><CardContent>{attendance.isLoading ? <EmptyState message="Loading attendance…" /> : attendance.data?.length ? <div className="space-y-2">{attendance.data.map((a: any, index: number) => <div key={`${a.attendance_date}-${index}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"><div><p className="text-sm font-medium">{new Date(`${a.attendance_date}T00:00:00`).toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</p>{a.remarks && <p className="mt-1 text-xs text-muted-foreground">{a.remarks}</p>}</div><Badge variant={a.status === "present" ? "default" : a.status === "absent" ? "destructive" : "secondary"} className="capitalize">{a.status}</Badge></div>)}</div> : <EmptyState message="No attendance has been recorded yet." />}</CardContent></Card>
        </>}
      </div>
    </div>
  </div>;
}

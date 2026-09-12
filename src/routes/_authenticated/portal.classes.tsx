import { createFileRoute } from "@tanstack/react-router";
import { requirePortalRoles } from "@/lib/permissions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, UserPlus, X, Users, GraduationCap, MessageSquare, BookOpenCheck, UserRoundPlus, Power } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/portal/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { classOptions, fullName } from "@/lib/school";
import { useMe } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/portal/classes")({
  beforeLoad: async () => { await requirePortalRoles(["admin", "headteacher", "teacher"]); },
  component: ClassesPage,
});

type ClassRow = {
  id: string; name: string; section: string | null; level_order: number;
  capacity: number | null; class_teacher_id: string | null;
};

type Profile = { id: string; first_name: string | null; last_name: string | null };

function ClassesPage() {
  const { isLeadership, userId, hasRole } = useMe();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [capacity, setCapacity] = useState("");
  const [teacherByClass, setTeacherByClass] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [classRemark, setClassRemark] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectDescription, setSubjectDescription] = useState("");
  const [subjectAssignment, setSubjectAssignment] = useState<Record<string, { teacherId: string; subjectId: string }>>({});

  const classes = useQuery({
    queryKey: ["managed-classes", userId, isLeadership],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("classes")
        .select("id,name,section,level_order,capacity,class_teacher_id")
        .order("level_order").order("section");
      if (error) throw error;
      return (data ?? []) as ClassRow[];
    },
  });

  const counts = useQuery({
    queryKey: ["class-counts", userId, isLeadership],
    queryFn: async () => {
      const { data, error } = await supabase.from("students").select("id,current_class_id");
      if (error) throw error;
      const map = new Map<string, number>();
      (data ?? []).forEach((s) => s.current_class_id && map.set(s.current_class_id, (map.get(s.current_class_id) ?? 0) + 1));
      return map;
    },
  });

  const teachers = useQuery({
    queryKey: ["teacher-profiles", userId],
    enabled: isLeadership,
    queryFn: async () => {
      const { data: roles, error: roleError } = await supabase.from("user_roles").select("user_id").eq("role", "teacher");
      if (roleError) throw roleError;
      const ids = [...new Set((roles ?? []).map((r) => r.user_id))];
      if (!ids.length) return [] as Profile[];
      const { data, error } = await supabase.from("profiles").select("id,first_name,last_name").in("id", ids).order("first_name");
      if (error) throw error;
      return (data ?? []) as Profile[];
    },
  });

  const subjects = useQuery({
    queryKey: ["subjects-management", userId],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("subjects").select("id,name,code,description,is_active").order("is_active", { ascending: false }).order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const subjectAssignments = useQuery({
    queryKey: ["teacher-subject-assignments", userId, isLeadership],
    queryFn: async () => {
      let query = (supabase as any)
        .from("teacher_class_assignments")
        .select("id,teacher_id,class_id,subject_id,created_at,class:class_id(name,section),subject:subject_id(id,name,code,is_active)")
        .not("subject_id", "is", null)
        .order("created_at", { ascending: false });
      if (!isLeadership) query = query.eq("teacher_id", userId);
      const { data, error } = await query;
      if (error) throw error;
      const rows = data ?? [];
      const teacherIds = [...new Set(rows.map((r: any) => r.teacher_id).filter(Boolean))];
      if (!teacherIds.length) return rows;
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id,first_name,last_name")
        .in("id", teacherIds);
      if (profileError) throw profileError;
      const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
      return rows.map((r: any) => ({ ...r, teacher: byId.get(r.teacher_id) ?? null }));
    },
  });

  const createSubject = useMutation({
    mutationFn: async () => {
      const cleanName = subjectName.trim();
      const cleanCode = subjectCode.trim().toUpperCase();
      if (!cleanName) throw new Error("Enter a subject name.");
      const { data: existing, error: lookupError } = await (supabase as any).from("subjects").select("id").ilike("name", cleanName).maybeSingle();
      if (lookupError) throw lookupError;
      if (existing) throw new Error("That subject already exists.");
      const { error } = await (supabase as any).from("subjects").insert({ name: cleanName, code: cleanCode || null, description: subjectDescription.trim() || null, is_active: true });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Subject created."); setSubjectName(""); setSubjectCode(""); setSubjectDescription(""); qc.invalidateQueries({ queryKey: ["subjects-management"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not create subject"),
  });

  const toggleSubject = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await (supabase as any).from("subjects").update({ is_active: active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Subject status updated."); qc.invalidateQueries({ queryKey: ["subjects-management"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not update subject"),
  });

  const assignSubject = useMutation({
    mutationFn: async ({ classId, teacherId, subjectId }: { classId: string; teacherId: string; subjectId: string }) => {
      if (!classId || !teacherId || !subjectId) throw new Error("Select a teacher and subject.");
      const { data: existing, error: lookupError } = await (supabase as any)
        .from("teacher_class_assignments")
        .select("id")
        .eq("teacher_id", teacherId).eq("class_id", classId).eq("subject_id", subjectId).maybeSingle();
      if (lookupError) throw lookupError;
      if (existing) throw new Error("That teacher is already assigned to this subject and class.");
      const { error } = await (supabase as any).from("teacher_class_assignments").insert({ teacher_id: teacherId, class_id: classId, subject_id: subjectId });
      if (error) throw error;
    },
    onSuccess: (_, vars) => { toast.success("Subject assigned to teacher."); setSubjectAssignment((m) => ({ ...m, [vars.classId]: { teacherId: "", subjectId: "" } })); qc.invalidateQueries({ queryKey: ["teacher-subject-assignments"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not assign subject"),
  });

  const removeSubjectAssignment = useMutation({
    mutationFn: async (id: string) => { const { error } = await (supabase as any).from("teacher_class_assignments").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Subject assignment removed."); qc.invalidateQueries({ queryKey: ["teacher-subject-assignments"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not remove assignment"),
  });

  const assignedTeacherNames = useQuery({
    queryKey: ["class-teacher-names", classes.data?.map((c) => c.class_teacher_id).filter(Boolean)],
    enabled: isLeadership && !!classes.data?.length,
    queryFn: async () => {
      const ids = [...new Set((classes.data ?? []).map((c) => c.class_teacher_id).filter(Boolean))] as string[];
      if (!ids.length) return new Map<string, string>();
      const { data, error } = await supabase.from("profiles").select("id,first_name,last_name").in("id", ids);
      if (error) throw error;
      return new Map((data ?? []).map((p) => [p.id, fullName(p)]));
    },
  });

  const studentsForClass = useQuery({
    queryKey: ["class-students", expanded, userId],
    enabled: !!expanded,
    queryFn: async () => {
      if (!expanded) return [];
      const { data, error } = await supabase
        .from("students")
        .select("id,admission_no,first_name,last_name,status")
        .eq("current_class_id", expanded)
        .order("first_name").order("last_name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!name) throw new Error("Choose a grade.");
      const level = classOptions.indexOf(name) + 1;
      if (level < 1) throw new Error("Choose a valid grade.");
      const existingQuery = supabase.from("classes").select("id").eq("name", name);
      const { data: existing, error: existingError } = section.trim()
        ? await existingQuery.eq("section", section.trim()).maybeSingle()
        : await existingQuery.is("section", null).maybeSingle();
      if (existingError && existingError.code !== "PGRST116") throw existingError;
      if (existing) throw new Error("That class/stream already exists.");
      const { error } = await supabase.from("classes").insert({ name, section: section.trim() || null, capacity: capacity ? Number(capacity) : null, level_order: level });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Class created."); setName(""); setSection(""); setCapacity(""); qc.invalidateQueries({ queryKey: ["managed-classes"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not create class"),
  });

  const assign = useMutation({
    mutationFn: async ({ classId, teacherId }: { classId: string; teacherId: string }) => {
      if (!classId || !teacherId) throw new Error("Select a class and teacher.");
      // Keep the class-teacher field authoritative. Also maintain the assignment table
      // without relying on a UNIQUE constraint involving a nullable subject_id.
      const oldClass = (classes.data ?? []).find((c) => c.id === classId);
      const { error: classError } = await supabase.from("classes").update({ class_teacher_id: teacherId }).eq("id", classId);
      if (classError) throw classError;
      if (oldClass?.class_teacher_id && oldClass.class_teacher_id !== teacherId) {
        const { error: oldAssignmentError } = await supabase.from("teacher_class_assignments").delete().eq("class_id", classId).eq("teacher_id", oldClass.class_teacher_id).is("subject_id", null);
        if (oldAssignmentError) throw oldAssignmentError;
      }
      const { data: existing, error: lookupError } = await supabase.from("teacher_class_assignments").select("id").eq("teacher_id", teacherId).eq("class_id", classId).is("subject_id", null).maybeSingle();
      if (lookupError) throw lookupError;
      if (!existing) {
        const { error } = await supabase.from("teacher_class_assignments").insert({ teacher_id: teacherId, class_id: classId, subject_id: null });
        if (error) throw error;
      }
    },
    onSuccess: (_, vars) => {
      toast.success("Teacher assigned to class.");
      setTeacherByClass((m) => ({ ...m, [vars.classId]: "" }));
      qc.invalidateQueries({ queryKey: ["managed-classes"] });
      qc.invalidateQueries({ queryKey: ["class-teacher-names"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not assign teacher"),
  });

  const removeTeacher = useMutation({
    mutationFn: async (classId: string) => {
      const c = (classes.data ?? []).find((x) => x.id === classId);
      if (!c?.class_teacher_id) throw new Error("No class teacher is assigned.");
      const { error } = await supabase.from("classes").update({ class_teacher_id: null }).eq("id", classId);
      if (error) throw error;
      const { error: deleteError } = await supabase.from("teacher_class_assignments").delete().eq("class_id", classId).eq("teacher_id", c.class_teacher_id).is("subject_id", null);
      if (deleteError) throw deleteError;
    },
    onSuccess: () => { toast.success("Class teacher removed."); qc.invalidateQueries({ queryKey: ["managed-classes"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not remove teacher"),
  });

  const saveClassRemark = useMutation({
    mutationFn: async ({ classId, remark }: { classId: string; remark: string }) => {
      if (!remark.trim()) throw new Error("Write a remark first.");
      const { error } = await (supabase as any).from("class_remarks").insert({
        class_id: classId,
        teacher_id: userId,
        remark: remark.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Class remark saved.");
      setClassRemark("");
      qc.invalidateQueries({ queryKey: ["class-remarks"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save class remark"),
  });

  const classRemarks = useQuery({
    queryKey: ["class-remarks", expanded, userId],
    enabled: !!expanded,
    queryFn: async () => {
      if (!expanded) return [];
      const { data, error } = await (supabase as any)
        .from("class_remarks")
        .select("id,remark,created_at,teacher:teacher_id(first_name,last_name)")
        .eq("class_id", expanded)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
  });

  const removeClass = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("classes").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Class removed."); setExpanded(null); qc.invalidateQueries({ queryKey: ["managed-classes"] }); qc.invalidateQueries({ queryKey: ["class-counts"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not remove class"),
  });

  const rows = useMemo(() => {
    const needle = q.toLowerCase().trim();
    return (classes.data ?? []).filter((c) => !needle || `${c.name} ${c.section ?? ""} ${assignedTeacherNames.data?.get(c.class_teacher_id ?? "") ?? ""}`.toLowerCase().includes(needle));
  }, [classes.data, assignedTeacherNames.data, q]);

  return <div>
    <PageHeader title="Classes & Teacher Assignment" description={hasRole("teacher") ? "Your assigned classes, subjects, and learners." : "Create classes, assign class teachers and subjects, and manage learner placement."} />
    {isLeadership && <Card className="mb-6"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><BookOpenCheck className="size-4" />Subjects</CardTitle></CardHeader><CardContent><div className="grid gap-3 md:grid-cols-[1.1fr_.7fr_1.4fr_auto]"><Input value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="Subject name e.g. Mathematics" /><Input value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} placeholder="Code e.g. MAT" /><Input value={subjectDescription} onChange={(e) => setSubjectDescription(e.target.value)} placeholder="Optional description" /><Button onClick={() => createSubject.mutate()} disabled={!subjectName.trim() || createSubject.isPending}><Plus className="mr-2 size-4" />Add subject</Button></div><div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">{subjects.isLoading ? <p className="text-sm text-muted-foreground">Loading subjects…</p> : subjects.data?.length ? subjects.data.map((s: any) => <div key={s.id} className="rounded-lg border p-3"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{s.name}</p><p className="text-xs text-muted-foreground">{s.code || "No code"}{s.description ? ` · ${s.description}` : ""}</p></div><Badge variant={s.is_active ? "default" : "secondary"}>{s.is_active ? "Active" : "Inactive"}</Badge></div><Button className="mt-3" variant="outline" size="sm" onClick={() => toggleSubject.mutate({ id: s.id, active: !s.is_active })} disabled={toggleSubject.isPending}><Power className="mr-2 size-3" />{s.is_active ? "Deactivate" : "Activate"}</Button></div>) : <EmptyState message="No subjects created yet." />}</div></CardContent></Card>}
    {hasRole("teacher") && <Card className="mb-6"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><BookOpenCheck className="size-4" />My subject assignments</CardTitle></CardHeader><CardContent>{subjectAssignments.isLoading ? <p className="text-sm text-muted-foreground">Loading subject assignments…</p> : subjectAssignments.data?.length ? <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">{subjectAssignments.data.map((a: any) => <div key={a.id} className="rounded-lg border p-3"><p className="font-semibold">{a.subject?.name}</p><p className="text-sm text-muted-foreground">{a.class?.name}{a.class?.section ? ` — ${a.class.section}` : ""}</p>{a.subject?.code && <Badge className="mt-2" variant="outline">{a.subject.code}</Badge>}</div>)}</div> : <EmptyState message="You have no subject assignments yet." />}</CardContent></Card>}
    {isLeadership && <Card className="mb-6"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><UserRoundPlus className="size-4" />Assign subjects to teachers</CardTitle><p className="text-sm text-muted-foreground">A subject assignment is specific to both a teacher and a class.</p></CardHeader><CardContent><div className="space-y-3">{(classes.data ?? []).map((c) => { const selected = subjectAssignment[c.id] ?? { teacherId: "", subjectId: "" }; const assignments = (subjectAssignments.data ?? []).filter((a: any) => a.class_id === c.id); return <div key={c.id} className="rounded-xl border p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold">{c.name}{c.section ? ` — ${c.section}` : ""}</p><Badge variant="secondary">{assignments.length} subject{assignments.length === 1 ? "" : "s"}</Badge></div><div className="mt-3 grid gap-2 md:grid-cols-[1fr_1fr_auto]"><Select value={selected.teacherId} onValueChange={(v) => setSubjectAssignment((m) => ({ ...m, [c.id]: { ...selected, teacherId: v } }))}><SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger><SelectContent>{(teachers.data ?? []).map((t) => <SelectItem key={t.id} value={t.id}>{fullName(t)}</SelectItem>)}</SelectContent></Select><Select value={selected.subjectId} onValueChange={(v) => setSubjectAssignment((m) => ({ ...m, [c.id]: { ...selected, subjectId: v } }))}><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger><SelectContent>{(subjects.data ?? []).filter((s: any) => s.is_active).map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}{s.code ? ` (${s.code})` : ""}</SelectItem>)}</SelectContent></Select><Button onClick={() => assignSubject.mutate({ classId: c.id, teacherId: selected.teacherId, subjectId: selected.subjectId })} disabled={!selected.teacherId || !selected.subjectId || assignSubject.isPending}><UserPlus className="mr-2 size-4" />Assign</Button></div>{assignments.length > 0 && <div className="mt-3 grid gap-2 md:grid-cols-2">{assignments.map((a: any) => <div key={a.id} className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 p-3"><div><p className="text-sm font-medium">{a.subject?.name}</p><p className="text-xs text-muted-foreground">{fullName(a.teacher)}{a.subject?.code ? ` · ${a.subject.code}` : ""}</p></div><Button variant="ghost" size="sm" onClick={() => removeSubjectAssignment.mutate(a.id)} disabled={removeSubjectAssignment.isPending}><X className="size-4" /></Button></div>)}</div>}</div>; })}</div></CardContent></Card>}
    <div className="grid gap-6 xl:grid-cols-[22rem_1fr]">
      {isLeadership && <Card className="h-fit"><CardHeader><CardTitle className="text-base">Create class</CardTitle></CardHeader><CardContent className="space-y-4">
        <div><Label>Grade</Label><Select value={name} onValueChange={setName}><SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger><SelectContent>{classOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
        <div><Label>Section / stream</Label><Input value={section} onChange={(e) => setSection(e.target.value)} placeholder="e.g. East" /></div>
        <div><Label>Capacity</Label><Input type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="Optional" /></div>
        <Button className="w-full" onClick={() => create.mutate()} disabled={create.isPending}><Plus className="mr-2 size-4" />Create class</Button>
      </CardContent></Card>}
      <Card><CardContent className="p-4 sm:p-6">
        <div className="mb-4 flex gap-3"><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search grade, stream or teacher…" /></div>
        {classes.isLoading ? <p className="py-8 text-center text-sm text-muted-foreground">Loading classes…</p> : rows.length === 0 ? <EmptyState message="No classes found." /> : <div className="space-y-3">
          {rows.map((c) => {
            const count = counts.data?.get(c.id) ?? 0;
            const teacherName = c.class_teacher_id ? assignedTeacherNames.data?.get(c.class_teacher_id) : undefined;
            const selectedTeacher = teacherByClass[c.id] ?? "";
            return <div key={c.id} className="rounded-xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0"><p className="font-semibold text-navy">{c.name}{c.section ? ` — ${c.section}` : ""}</p><div className="mt-1 flex flex-wrap gap-2"><Badge variant="secondary"><Users className="mr-1 size-3" />{count}{c.capacity ? ` / ${c.capacity}` : ""} learners</Badge>{teacherName ? <Badge><GraduationCap className="mr-1 size-3" />{teacherName}</Badge> : <Badge variant="outline">No class teacher</Badge>}</div></div>
                <div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => setExpanded(expanded === c.id ? null : c.id)}><Users className="mr-2 size-4" />{expanded === c.id ? "Hide class details" : "View class details"}</Button>{hasRole("teacher") && <Button variant="secondary" size="sm" onClick={() => setExpanded(c.id)}><MessageSquare className="mr-2 size-4" />View remarks</Button>}{isLeadership && <Button variant="destructive" size="sm" onClick={() => { if (confirm(`Remove ${c.name}${c.section ? ` — ${c.section}` : ""}?`)) removeClass.mutate(c.id); }}><Trash2 className="mr-2 size-4" />Remove</Button>}</div>
              </div>
              {isLeadership && <div className="mt-4 flex flex-wrap items-end gap-2"><div className="min-w-64 flex-1"><Label>Class teacher</Label><Select value={selectedTeacher} onValueChange={(v) => setTeacherByClass((m) => ({ ...m, [c.id]: v }))}><SelectTrigger><SelectValue placeholder={teacherName ?? "Assign teacher"} /></SelectTrigger><SelectContent>{(teachers.data ?? []).map((t) => <SelectItem key={t.id} value={t.id}>{fullName(t)}</SelectItem>)}</SelectContent></Select></div><Button onClick={() => assign.mutate({ classId: c.id, teacherId: selectedTeacher })} disabled={!selectedTeacher || assign.isPending}><UserPlus className="mr-2 size-4" />Assign</Button>{c.class_teacher_id && <Button variant="outline" onClick={() => removeTeacher.mutate(c.id)} disabled={removeTeacher.isPending}><X className="mr-2 size-4" />Remove teacher</Button>}</div>}
              {expanded === c.id && <div className="mt-4 border-t pt-4 space-y-5"><div><p className="mb-2 text-sm font-semibold">Learners in this class</p>{studentsForClass.isLoading ? <p className="text-sm text-muted-foreground">Loading learners…</p> : studentsForClass.data?.length ? <div className="grid gap-2 md:grid-cols-2">{studentsForClass.data.map((s: any) => <div key={s.id} className="rounded-lg bg-muted/40 p-3"><p className="font-medium">{fullName(s)}</p><p className="text-xs text-muted-foreground">{s.admission_no} · {s.status}</p></div>)}</div> : <p className="text-sm text-muted-foreground">No learners are assigned to this class yet.</p>}</div>{hasRole("teacher") && <div className="rounded-xl border bg-card p-4"><div className="flex items-center justify-between gap-3"><div><div className="flex items-center gap-2"><MessageSquare className="size-4" /><p className="text-sm font-semibold">Class remarks</p></div><p className="mt-1 text-xs text-muted-foreground">Write and review observations, progress notes, behaviour notes, or issues about this class.</p></div><Badge variant="outline">Teacher notes</Badge></div><Textarea className="mt-3" rows={3} value={classRemark} onChange={(e) => setClassRemark(e.target.value)} placeholder="Write a professional class remark…"/><Button className="mt-2" size="sm" disabled={!classRemark.trim() || saveClassRemark.isPending} onClick={() => saveClassRemark.mutate({ classId: c.id, remark: classRemark })}>Save class remark</Button>{classRemarks.isLoading ? <p className="mt-4 text-xs text-muted-foreground">Loading remarks…</p> : classRemarks.data?.length ? <div className="mt-4 space-y-2"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Saved remarks</p>{classRemarks.data.map((r: any) => <div key={r.id} className="rounded-lg bg-muted/40 p-3"><p className="text-sm">{r.remark}</p><p className="mt-1 text-xs text-muted-foreground">{fullName(r.teacher)} · {new Date(r.created_at).toLocaleDateString()}</p></div>)}</div> : <p className="mt-4 rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">No class remarks have been saved yet.</p>}</div>}</div>}
            </div>;
          })}
        </div>}
      </CardContent></Card>
    </div>
  </div>;
}

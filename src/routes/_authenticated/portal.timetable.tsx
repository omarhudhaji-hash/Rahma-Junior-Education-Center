import { createFileRoute } from "@tanstack/react-router";
import { requirePortalRoles } from "@/lib/permissions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarPlus, Clock3, Pencil, Trash2 } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/portal/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useMe } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { dayNames, fullName } from "@/lib/school";

export const Route = createFileRoute("/_authenticated/portal/timetable")({
  beforeLoad: async () => { await requirePortalRoles(["admin", "headteacher", "teacher", "parent", "student"]); },
  component: TimetablePage,
});

function TimetablePage() {
  const { userId, hasRole, isLeadership } = useMe();
  const family = hasRole("parent") || hasRole("student");
  const [classId, setClassId] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const qc = useQueryClient();
  const today = new Date().getDay() === 0 ? 7 : new Date().getDay();

  const classes = useQuery({
    queryKey: ["timetable-classes", userId, family],
    queryFn: async () => {
      if (hasRole("parent")) {
        const { data: ps } = await supabase.from("parent_student").select("student_id").eq("parent_id", userId!);
        const ids = (ps ?? []).map(x => x.student_id);
        if (!ids.length) return [];
        const { data: st } = await supabase.from("students").select("current_class_id").in("id", ids);
        const cids = [...new Set((st ?? []).map(x => x.current_class_id).filter(Boolean))] as string[];
        if (!cids.length) return [];
        const { data, error } = await supabase.from("classes").select("id,name,section,level_order").in("id", cids).order("level_order");
        if (error) throw error; return data ?? [];
      }
      if (hasRole("student")) {
        const { data: st } = await supabase.from("students").select("current_class_id").eq("user_id", userId!);
        const id = st?.[0]?.current_class_id; if (!id) return [];
        const { data, error } = await supabase.from("classes").select("id,name,section,level_order").eq("id", id);
        if (error) throw error; return data ?? [];
      }
      if (hasRole("teacher")) {
        const { data: a } = await supabase.from("teacher_class_assignments").select("class_id").eq("teacher_id", userId!);
        const ids = (a ?? []).map(x => x.class_id); if (!ids.length) return [];
        const { data, error } = await supabase.from("classes").select("id,name,section,level_order").in("id", ids).order("level_order");
        if (error) throw error; return data ?? [];
      }
      const { data, error } = await supabase.from("classes").select("id,name,section,level_order").order("level_order");
      if (error) throw error; return data ?? [];
    },
  });

  const teachers = useQuery({
    queryKey: ["timetable-teachers"], enabled: isLeadership,
    queryFn: async () => {
      const { data: r } = await supabase.from("user_roles").select("user_id").eq("role", "teacher");
      const ids = (r ?? []).map(x => x.user_id); if (!ids.length) return [];
      const { data, error } = await supabase.from("profiles").select("id,first_name,last_name").in("id", ids);
      if (error) throw error; return data ?? [];
    },
  });

  const subjects = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => { const { data, error } = await supabase.from("subjects").select("id,name").order("name"); if (error) throw error; return data ?? []; },
  });

  const entries = useQuery({
    queryKey: ["timetable", classId], enabled: !!classId,
    queryFn: async () => {
      const { data, error } = await supabase.from("timetable_entries")
        .select("id,class_id,subject_id,subject_name,teacher_id,day_of_week,starts_at,ends_at,room,teachers:teacher_id(first_name,last_name),subjects:subject_id(name),classes:class_id(name,section)")
        .eq("class_id", classId).order("day_of_week").order("starts_at");
      if (error) throw error; return data ?? [];
    },
  });

  const myEntries = useQuery({
    queryKey: ["my-timetable", userId], enabled: hasRole("teacher") && !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("timetable_entries")
        .select("id,class_id,subject_id,subject_name,teacher_id,day_of_week,starts_at,ends_at,room,subjects:subject_id(name),classes:class_id(name,section)")
        .eq("teacher_id", userId!).order("day_of_week").order("starts_at");
      if (error) throw error; return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async (form: any) => {
      const { error } = await supabase.rpc("save_timetable_entry", {
        p_id: editing?.id ?? null,
        p_class_id: form.class_id,
        p_subject_id: form.subject_id || null,
        p_teacher_id: form.teacher_id || null,
        p_day_of_week: Number(form.day_of_week),
        p_starts_at: form.starts_at,
        p_ends_at: form.ends_at,
        p_room: form.room || null,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success(editing ? "Timetable updated." : "Timetable entry created."); setEditing(null); qc.invalidateQueries({ queryKey: ["timetable"] }); qc.invalidateQueries({ queryKey: ["my-timetable"] }); },
    onError: e => toast.error(e instanceof Error ? e.message : "Could not save timetable"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("timetable_entries").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Timetable entry deleted."); qc.invalidateQueries({ queryKey: ["timetable"] }); qc.invalidateQueries({ queryKey: ["my-timetable"] }); },
    onError: e => toast.error(e instanceof Error ? e.message : "Could not delete timetable"),
  });

  const selectedClass = (classes.data ?? []).find(c => c.id === classId);
  const todayEntries = hasRole("teacher") ? (myEntries.data ?? []).filter(e => e.day_of_week === today) : (entries.data ?? []).filter(e => e.day_of_week === today);

  return <div className="space-y-6">
    <PageHeader title="Timetable" description={family ? "View the timetable for your child only." : hasRole("teacher") ? "View your teaching schedule and assigned classes." : "Create, edit and manage the school timetable."} />

    {hasRole("teacher") && <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Clock3 className="size-4" />My teaching schedule</CardTitle></CardHeader><CardContent>
      {todayEntries.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{todayEntries.map(e => <div key={e.id} className="rounded-lg border p-3"><div className="flex items-center justify-between"><span className="font-semibold">{(e.subjects as any)?.name ?? e.subject_name ?? "Lesson"}</span><Badge variant="secondary">Today</Badge></div><p className="mt-1 text-sm">{e.starts_at.slice(0,5)}–{e.ends_at.slice(0,5)}</p><p className="text-xs text-muted-foreground">{(e.classes as any)?.name ?? "Class"}{(e.classes as any)?.section ? ` — ${(e.classes as any).section}` : ""}{e.room ? ` · ${e.room}` : ""}</p></div>)}</div> : <p className="text-sm text-muted-foreground">No lessons scheduled for today.</p>}
    </CardContent></Card>}

    <Card><CardContent className="p-4 sm:p-6"><Label>Class</Label><Select value={classId} onValueChange={v => { setClassId(v); setEditing(null); }}><SelectTrigger className="mt-2 max-w-sm"><SelectValue placeholder="Select class" /></SelectTrigger><SelectContent>{(classes.data ?? []).map(c => <SelectItem key={c.id} value={c.id}>{c.name}{c.section ? ` — ${c.section}` : ""}</SelectItem>)}</SelectContent></Select></CardContent></Card>

    {isLeadership && <TimetableForm classes={classes.data ?? []} teachers={teachers.data ?? []} subjects={subjects.data ?? []} classId={classId} editing={editing} onSave={f => save.mutate(f)} onCancel={() => setEditing(null)} />}

    {classId && <Card><CardHeader><CardTitle className="text-base">{selectedClass?.name ?? "Class"} weekly schedule</CardTitle></CardHeader><CardContent>{(entries.data ?? []).length === 0 ? <EmptyState message="No timetable entries for this class yet." /> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">{[1,2,3,4,5].map(day => <Card key={day} className={day === today ? "ring-2 ring-primary/30" : ""}><CardHeader className="pb-2"><CardTitle className="flex items-center justify-between text-sm">{dayNames[day]} {day === today && <Badge>Today</Badge>}</CardTitle></CardHeader><CardContent className="space-y-2">{(entries.data ?? []).filter(e => e.day_of_week === day).map(e => <div key={e.id} className="rounded-lg border p-3"><div className="flex justify-between gap-2"><p className="font-semibold">{(e.subjects as any)?.name ?? e.subject_name ?? "Lesson"}</p>{isLeadership && <div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => setEditing(e)}><Pencil className="size-4" /></Button><Button size="icon" variant="ghost" onClick={() => remove.mutate(e.id)}><Trash2 className="size-4" /></Button></div>}</div><p className="text-xs text-muted-foreground">{e.starts_at.slice(0,5)}–{e.ends_at.slice(0,5)}</p><p className="text-xs text-muted-foreground">{fullName(e.teachers as any) || "Teacher not assigned"}{e.room ? ` · ${e.room}` : ""}</p></div>)}</CardContent></Card>)}</div>}</CardContent></Card>}
  </div>;
}

function TimetableForm({classes, teachers, subjects, classId, editing, onSave, onCancel}:{classes:any[];teachers:any[];subjects:any[];classId:string;editing:any;onSave:(f:any)=>void;onCancel:()=>void}) {
  const [form, setForm] = useState<any>({class_id: classId, subject_id:"", teacher_id:"", day_of_week:"1", starts_at:"08:00", ends_at:"08:40", room:""});
  useEffect(() => { setForm(editing ? {...editing, day_of_week:String(editing.day_of_week), starts_at:editing.starts_at.slice(0,5), ends_at:editing.ends_at.slice(0,5), room:editing.room ?? ""} : {class_id:classId,subject_id:"",teacher_id:"",day_of_week:"1",starts_at:"08:00",ends_at:"08:40",room:""}); }, [editing, classId]);
  const set = (k:string,v:string) => setForm((f:any) => ({...f,[k]:v}));
  return <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><CalendarPlus className="size-4" />{editing ? "Edit timetable entry" : "Create timetable entry"}</CardTitle></CardHeader><CardContent><div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6"><Select value={form.class_id} onValueChange={v=>set("class_id",v)}><SelectTrigger><SelectValue placeholder="Class"/></SelectTrigger><SelectContent>{classes.map(c=><SelectItem key={c.id} value={c.id}>{c.name}{c.section?` — ${c.section}`:""}</SelectItem>)}</SelectContent></Select><Select value={form.subject_id} onValueChange={v=>set("subject_id",v)}><SelectTrigger><SelectValue placeholder="Subject"/></SelectTrigger><SelectContent>{subjects.map(s=><SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select><Select value={form.teacher_id} onValueChange={v=>set("teacher_id",v)}><SelectTrigger><SelectValue placeholder="Teacher"/></SelectTrigger><SelectContent>{teachers.map(t=><SelectItem key={t.id} value={t.id}>{fullName(t)}</SelectItem>)}</SelectContent></Select><Select value={String(form.day_of_week)} onValueChange={v=>set("day_of_week",v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{[1,2,3,4,5].map(d=><SelectItem key={d} value={String(d)}>{dayNames[d]}</SelectItem>)}</SelectContent></Select><Input type="time" value={form.starts_at} onChange={e=>set("starts_at",e.target.value)}/><Input type="time" value={form.ends_at} onChange={e=>set("ends_at",e.target.value)}/></div><div className="mt-3 flex gap-2"><Input value={form.room??""} onChange={e=>set("room",e.target.value)} placeholder="Room / venue"/><Button onClick={()=>onSave(form)} disabled={!form.class_id||!form.subject_id||!form.teacher_id}>Save</Button>{editing&&<Button variant="outline" onClick={onCancel}>Cancel</Button>}</div></CardContent></Card>;
}

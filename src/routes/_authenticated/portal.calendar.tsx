import { createFileRoute } from "@tanstack/react-router";
import { requirePortalRoles } from "@/lib/permissions";
import { useMe } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarDays, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/portal/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/portal/calendar")({
  beforeLoad: async () => { await requirePortalRoles(["admin", "headteacher", "teacher", "parent", "student"]); },
  component: CalendarPage,
});

const types = ["school_event", "parent_meeting", "staff_meeting", "exam", "sports", "trip", "holiday", "other"];
const audiences = ["everyone", "parents", "students", "teachers", "class"];
const label = (v: string) => v.replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase());

function CalendarPage() {
  const { isLeadership, userId } = useMe();
  const qc = useQueryClient();
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const start = `${month}-01`;
  const end = new Date(Number(month.slice(0,4)), Number(month.slice(5,7)), 0).toISOString().slice(0,10);
  const events = useQuery({ queryKey: ["school-events", month, userId], queryFn: async () => {
    const { data, error } = await supabase.from("school_events").select("*").gte("start_at", `${start}T00:00:00`).lte("start_at", `${end}T23:59:59`).order("start_at");
    if (error) throw error; return data ?? [];
  }});
  const classes = useQuery({ queryKey: ["calendar-classes"], enabled: isLeadership, queryFn: async () => { const { data, error } = await supabase.from("classes").select("id,name,section").order("level_order"); if (error) throw error; return data ?? []; }});
  const save = useMutation({ mutationFn: async (f: any) => { const payload = { title: f.title, description: f.description || null, event_type: f.event_type, audience: f.audience, target_class_id: f.audience === "class" ? f.target_class_id || null : null, start_at: `${f.date}T${f.start_time}:00`, end_at: f.end_time ? `${f.date}T${f.end_time}:00` : null, location: f.location || null, reminder_minutes: Number(f.reminder_minutes || 0) || null }; const q = editing ? supabase.from("school_events").update(payload).eq("id", editing.id) : supabase.from("school_events").insert(payload); const { error } = await q; if (error) throw error; }, onSuccess: () => { toast.success(editing ? "Event updated." : "Event created."); setEditing(null); setShowForm(false); qc.invalidateQueries({ queryKey: ["school-events"] }); }, onError: e => toast.error(e instanceof Error ? e.message : "Could not save event") });
  const remove = useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("school_events").delete().eq("id", id); if (error) throw error; }, onSuccess: () => { toast.success("Event deleted."); qc.invalidateQueries({ queryKey: ["school-events"] }); }, onError: e => toast.error(e instanceof Error ? e.message : "Could not delete event") });
  const formEvent = editing ? { ...editing, date: editing.start_at.slice(0,10), start_time: editing.start_at.slice(11,16), end_time: editing.end_at?.slice(11,16) ?? "", reminder_minutes: editing.reminder_minutes ?? "", target_class_id: editing.target_class_id ?? "" } : null;
  return <div className="space-y-6"><PageHeader title="School Calendar" description="View school events, exams, meetings and important dates." actions={isLeadership ? <Button onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="mr-2 size-4"/>Add event</Button> : undefined}/>
    <Card><CardContent className="flex flex-wrap items-end gap-3 p-4"><div><Label>Month</Label><Input className="mt-2 w-48" type="month" value={month} onChange={e => setMonth(e.target.value)}/></div></CardContent></Card>
    {isLeadership && showForm && <EventForm initial={formEvent} classes={classes.data ?? []} onSave={f => save.mutate(f)} onCancel={() => { setShowForm(false); setEditing(null); }} saving={save.isPending}/>} 
    {(events.data ?? []).length === 0 ? <EmptyState message="No calendar events for this month."/> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{(events.data ?? []).map((e: any) => <Card key={e.id}><CardHeader className="pb-2"><div className="flex items-start justify-between gap-3"><div><CardTitle className="text-base">{e.title}</CardTitle><p className="text-xs text-muted-foreground">{label(e.event_type)}</p></div>{isLeadership && <div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => { setEditing(e); setShowForm(true); }}><Pencil className="size-4"/></Button><Button size="icon" variant="ghost" onClick={() => remove.mutate(e.id)}><Trash2 className="size-4"/></Button></div>}</div></CardHeader><CardContent className="space-y-1 text-sm"><p className="font-semibold">{new Date(e.start_at).toLocaleDateString(undefined, { weekday:"long", day:"numeric", month:"long", year:"numeric" })}</p><p className="text-muted-foreground">{new Date(e.start_at).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}{e.end_at ? ` – ${new Date(e.end_at).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}` : ""}</p>{e.location && <p>📍 {e.location}</p>}{e.description && <p className="pt-2 text-muted-foreground">{e.description}</p>}</CardContent></Card>)}</div>}</div>;
}

function EventForm({ initial, classes, onSave, onCancel, saving }: { initial: any; classes: any[]; onSave: (f:any)=>void; onCancel:()=>void; saving:boolean }) {
  const [f, setF] = useState<any>(initial ?? { title:"", description:"", event_type:"school_event", audience:"everyone", target_class_id:"", date:new Date().toISOString().slice(0,10), start_time:"08:00", end_time:"09:00", location:"", reminder_minutes:"60" });
  const set = (k:string,v:string) => setF((x:any)=>({...x,[k]:v}));
  return <Card><CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="size-4"/>{initial ? "Edit event" : "Create event"}</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><div><Label>Title</Label><Input className="mt-2" value={f.title} onChange={e=>set("title",e.target.value)}/></div><div><Label>Type</Label><Select value={f.event_type} onValueChange={v=>set("event_type",v)}><SelectTrigger className="mt-2"><SelectValue/></SelectTrigger><SelectContent>{types.map(t=><SelectItem key={t} value={t}>{label(t)}</SelectItem>)}</SelectContent></Select></div><div><Label>Audience</Label><Select value={f.audience} onValueChange={v=>set("audience",v)}><SelectTrigger className="mt-2"><SelectValue/></SelectTrigger><SelectContent>{audiences.map(a=><SelectItem key={a} value={a}>{label(a)}</SelectItem>)}</SelectContent></Select></div><div><Label>Date</Label><Input className="mt-2" type="date" value={f.date} onChange={e=>set("date",e.target.value)}/></div></div><div className="grid gap-3 md:grid-cols-4"><div><Label>Start time</Label><Input className="mt-2" type="time" value={f.start_time} onChange={e=>set("start_time",e.target.value)}/></div><div><Label>End time</Label><Input className="mt-2" type="time" value={f.end_time} onChange={e=>set("end_time",e.target.value)}/></div>{f.audience === "class" && <div><Label>Class</Label><Select value={f.target_class_id} onValueChange={v=>set("target_class_id",v)}><SelectTrigger className="mt-2"><SelectValue placeholder="Select class"/></SelectTrigger><SelectContent>{classes.map(c=><SelectItem key={c.id} value={c.id}>{c.name}{c.section?` — ${c.section}`:""}</SelectItem>)}</SelectContent></Select></div>}<div><Label>Reminder (minutes)</Label><Input className="mt-2" type="number" min="0" value={f.reminder_minutes} onChange={e=>set("reminder_minutes",e.target.value)}/></div></div><div><Label>Description</Label><Textarea className="mt-2" value={f.description} onChange={e=>set("description",e.target.value)}/></div><div><Label>Location</Label><Input className="mt-2" value={f.location} onChange={e=>set("location",e.target.value)}/></div><div className="flex gap-2"><Button onClick={()=>onSave(f)} disabled={!f.title||!f.date||!f.start_time||saving}>Save event</Button><Button variant="outline" onClick={onCancel}>Cancel</Button></div></CardContent></Card>;
}

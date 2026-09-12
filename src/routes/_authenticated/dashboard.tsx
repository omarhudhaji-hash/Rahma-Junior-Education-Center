import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Activity, AlertTriangle, CalendarDays, ClipboardCheck, FileText, GraduationCap, Camera, Megaphone, Package, ShoppingBag, Users, Wallet, UserRound } from "lucide-react";
import { PageHeader } from "@/components/portal/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMe } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { fullName, money, roleLabels } from "@/lib/school";
import { ProfileAvatar } from "@/components/portal/profile-avatar";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Portal dashboard | Rahma Junior Education Center" }, { name: "robots", content: "noindex" }] }),
  component: DashboardPage,
});

function StudentPhoto({ path, name }: { path?: string | null; name: string }) {
  const [url, setUrl] = React.useState<string | null>(null);
  React.useEffect(() => { let cancelled = false; if (!path) { setUrl(null); return; } supabase.storage.from("student-photos").createSignedUrl(path, 3600).then(({ data }) => { if (!cancelled) setUrl(data?.signedUrl ?? null); }); return () => { cancelled = true; }; }, [path]);
  return <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border bg-muted">{url ? <img src={url} alt={`${name} profile`} className="size-full object-cover" /> : <UserRound className="size-6 text-muted-foreground" />}</div>;
}

function StatCard({ label, value, icon: Icon, note }: { label:string; value:string; icon:any; note?:string }) {
  return <Card><CardContent className="flex items-center gap-4 p-5"><span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5"/></span><div><p className="text-[11px] uppercase tracking-brand text-muted-foreground">{label}</p><p className="font-display text-xl font-extrabold text-navy">{value}</p>{note&&<p className="text-xs text-muted-foreground">{note}</p>}</div></CardContent></Card>;
}

function DashboardPage() {
  const { profile, primaryRole, userId, isAdmin, isLeadership, hasRole } = useMe();
  const parent = hasRole("parent"); const teacher = hasRole("teacher") && !isLeadership; const student = hasRole("student") && !isLeadership;
  const myChildren = useQuery({
    queryKey: ["dashboard-my-children", userId],
    enabled: parent && Boolean(userId),
    queryFn: async () => {
      const { data: links, error: linkError } = await supabase.from("parent_student").select("student_id").eq("parent_id", userId!);
      if (linkError) throw linkError;
      const ids = (links ?? []).map(x => x.student_id);
      if (!ids.length) return [];
      const { data, error } = await supabase.from("students").select("id,first_name,last_name,admission_no,photo_url,current_class_id,classes:current_class_id(name,section)").in("id", ids).order("first_name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const stats = useQuery({ queryKey:["professional-dashboard",userId,primaryRole], enabled:Boolean(userId), queryFn:async()=>{
    const today=new Date().toISOString().slice(0,10);
    const base:any={students:0,parents:0,teachers:0,classes:0,present:0,outstanding:0,lowStock:0,upcomingExams:0,orders:0,documents:0};
    if(isLeadership){
      const [s,c,p,t,a,inv,ex,ord,docs]=await Promise.all([
        supabase.from("students").select("id",{count:"exact",head:true}), supabase.from("classes").select("id",{count:"exact",head:true}), supabase.from("admission_families").select("id",{count:"exact",head:true}), supabase.from("user_roles").select("user_id",{count:"exact",head:true}).eq("role","teacher"), supabase.from("attendance_records").select("id",{count:"exact",head:true}).eq("attendance_date",today).eq("status","present"), (supabase as any).from("inventory_items").select("quantity,minimum_stock").eq("is_active",true), (supabase as any).from("exams").select("id",{count:"exact",head:true}).gte("starts_on",today), (supabase as any).from("store_orders").select("id",{count:"exact",head:true}).in("status",["pending","confirmed","ready"]), (supabase as any).from("school_documents").select("id",{count:"exact",head:true})
      ]);
      base.students=s.count??0;base.classes=c.count??0;base.parents=p.count??0;base.teachers=t.count??0;base.present=a.count??0;base.lowStock=(inv.data??[]).filter((x:any)=>Number(x.quantity)<=Number(x.minimum_stock)).length;base.upcomingExams=ex.count??0;base.orders=ord.count??0;base.documents=docs.count??0;
      const {data: invoices}=await supabase.from("invoices").select("amount,status"); base.outstanding=(invoices??[]).filter((x:any)=>x.status!=="paid").reduce((n:number,x:any)=>n+Number(x.amount||0),0);
    } else if(parent){
      const {data:links}=await supabase.from("parent_student").select("student_id").eq("parent_id",userId!); const ids=(links??[]).map(x=>x.student_id);
      base.students=ids.length;
      if(ids.length){ const [att,inv,docs]=await Promise.all([supabase.from("attendance_records").select("id",{count:"exact",head:true}).in("student_id",ids).eq("attendance_date",today).eq("status","present"),supabase.from("invoices").select("amount,status").in("student_id",ids), (supabase as any).from("school_documents").select("id",{count:"exact",head:true}).in("student_id",ids)]); base.present=att.count??0;base.outstanding=(inv.data??[]).filter((x:any)=>x.status!=="paid").reduce((n:number,x:any)=>n+Number(x.amount||0),0);base.documents=docs.count??0; }
      const {count}=await (supabase as any).from("store_orders").select("id",{count:"exact",head:true}).eq("parent_id",userId!); base.orders=count??0;
    } else if(teacher){
      const [classes,att,ex]=await Promise.all([supabase.from("teacher_class_assignments").select("id",{count:"exact",head:true}).eq("teacher_id",userId!),supabase.from("attendance_records").select("id",{count:"exact",head:true}).eq("attendance_date",today).eq("status","present"),(supabase as any).from("exams").select("id",{count:"exact",head:true}).gte("starts_on",today)]); base.classes=classes.count??0;base.present=att.count??0;base.upcomingExams=ex.count??0;
    } else if(student){
      const [att,inv]=await Promise.all([supabase.from("attendance_records").select("id",{count:"exact",head:true}).eq("student_id",userId!).eq("attendance_date",today).eq("status","present"),supabase.from("invoices").select("amount,status").eq("student_id",userId!)]);base.present=att.count??0;base.outstanding=(inv.data??[]).filter((x:any)=>x.status!=="paid").reduce((n:number,x:any)=>n+Number(x.amount||0),0);
    }
    return base;
  }});
  const announcements=useQuery({queryKey:["dashboard-announcements"],queryFn:async()=>{const {data,error}=await supabase.from("announcements").select("id,title,body,published_at").order("published_at",{ascending:false}).limit(4);if(error)throw error;return data??[];}});
  const events=useQuery({queryKey:["dashboard-events"],queryFn:async()=>{const {data,error}=await (supabase as any).from("calendar_events").select("id,title,starts_at,venue").gte("starts_at",new Date().toISOString()).order("starts_at").limit(4);if(error)throw error;return data??[];}});
  const s=stats.data;
  const title=isLeadership?"Management Dashboard":parent?"Family Dashboard":teacher?"Teacher Dashboard":student?"Student Dashboard":"School Dashboard";
  return <div><PageHeader title={`${title}${profile?.first_name?`, ${profile.first_name}`:""}`} description={`Signed in as ${roleLabels[primaryRole]}. ${profile?fullName(profile):""}`}/>
    {parent && <Card className="mb-6"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><GraduationCap className="size-4 text-primary"/>{(myChildren.data?.length ?? 0) === 1 ? "My Child" : "My Children"}</CardTitle><CardDescription>{(myChildren.data?.length ?? 0) === 1 ? "Your child's profile picture and quick profile access." : "Choose a child to open their student profile."}</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{(myChildren.data ?? []).map((c:any) => <div key={c.id} className="flex items-center gap-3 rounded-xl border p-3"><Link to="/portal/students/$studentId" params={{studentId:c.id}} className="flex min-w-0 flex-1 items-center gap-3 transition hover:bg-muted/50"><StudentPhoto path={c.photo_url} name={fullName(c)}/><div className="min-w-0"><p className="font-semibold truncate">{fullName(c)}</p><p className="text-xs text-muted-foreground">{c.admission_no}</p><p className="text-xs text-muted-foreground">{c.classes?.name ?? "Class not assigned"}{c.classes?.section ? ` — ${c.classes.section}` : ""}</p></div></Link><label className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border px-2 py-1.5 text-xs font-medium hover:bg-muted print:hidden"><Camera className="size-3.5"/> {c.photo_url ? "Change photo" : "Add photo"}<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={async e=>{const f=e.target.files?.[0]; e.currentTarget.value=""; if(!f) return; if(f.size>5*1024*1024){toast.error("Photo must be 5 MB or smaller.");return;} try{const ext=f.name.split(".").pop()?.toLowerCase()||"jpg"; const path=`${c.id}/parent-${Date.now()}.${ext}`; const {error:ue}=await supabase.storage.from("student-photos").upload(path,f,{upsert:true,contentType:f.type}); if(ue)throw ue; const {error:pe}=await supabase.rpc("set_student_photo_by_parent",{_student_id:c.id,_photo_path:path}); if(pe)throw pe; await myChildren.refetch(); toast.success(`Photo updated for ${fullName(c)}.`);}catch(err){toast.error(err instanceof Error?err.message:"Could not upload student photo.");}}}/></label></div>)}{!myChildren.isLoading && !(myChildren.data?.length) && <p className="text-sm text-muted-foreground">No linked children found.</p>}</CardContent></Card>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label={isLeadership?"Students":parent?"My children":teacher?"Assigned classes":"Attendance today"} value={String(isLeadership||parent?s?.students??0:teacher?s?.classes??0:s?.present??0)} icon={isLeadership||parent?GraduationCap:teacher?Users:ClipboardCheck}/>
      {isLeadership&&<StatCard label="Parents" value={String(s?.parents??0)} icon={Users}/>} {isLeadership&&<StatCard label="Teachers" value={String(s?.teachers??0)} icon={Users}/>} 
      {isLeadership&&<StatCard label="Classes" value={String(s?.classes??0)} icon={CalendarDays}/>} 
      <StatCard label={isLeadership||parent||student?"Fees outstanding":"Present today"} value={isLeadership||parent||student?money(s?.outstanding??0):String(s?.present??0)} icon={isLeadership||parent||student?Wallet:ClipboardCheck}/>
      {isLeadership&&<StatCard label="Low-stock items" value={String(s?.lowStock??0)} icon={AlertTriangle}/>} {isLeadership&&<StatCard label="Shop orders" value={String(s?.orders??0)} icon={ShoppingBag}/>} 
      {parent&&<StatCard label="School shop orders" value={String(s?.orders??0)} icon={ShoppingBag}/>} {parent&&<StatCard label="Documents" value={String(s?.documents??0)} icon={FileText}/>} 
      {(teacher||student)&&<StatCard label="Upcoming exams" value={String(s?.upcomingExams??0)} icon={GraduationCap}/>} 
    </div>
    <div className="mt-6 grid gap-4 lg:grid-cols-2"><Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Megaphone className="size-4 text-primary"/>Latest announcements</CardTitle><CardDescription><Link to="/portal/announcements" className="text-primary hover:underline">View all announcements</Link></CardDescription></CardHeader><CardContent className="space-y-3">{announcements.data?.length?announcements.data.map(a=><div key={a.id} className="rounded-md border p-3"><p className="text-sm font-semibold">{a.title}</p><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.body}</p></div>):<p className="text-sm text-muted-foreground">No announcements yet.</p>}</CardContent></Card>
    <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><CalendarDays className="size-4 text-primary"/>Upcoming events</CardTitle><CardDescription>School calendar highlights</CardDescription></CardHeader><CardContent className="space-y-3">{events.data?.length?events.data.map((e:any)=><div key={e.id} className="rounded-md border p-3"><p className="text-sm font-semibold">{e.title}</p><p className="text-xs text-muted-foreground">{new Date(e.starts_at).toLocaleString()} {e.venue?`· ${e.venue}`:""}</p></div>):<p className="text-sm text-muted-foreground">No upcoming events.</p>}</CardContent></Card></div>
    {isLeadership&&<Card className="mt-6"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Activity className="size-4 text-primary"/>Management shortcuts</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2"><Link to="/portal/finance"><Badge variant="outline" className="px-3 py-2">Finance</Badge></Link><Link to="/portal/inventory"><Badge variant="outline" className="px-3 py-2"><Package className="mr-1 inline size-3"/>Inventory</Badge></Link><Link to="/portal/audit-logs"><Badge variant="outline" className="px-3 py-2">Audit Logs</Badge></Link></CardContent></Card>}
  </div>;
}

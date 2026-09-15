import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { requirePortalRoles } from "@/lib/permissions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/portal/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { fullName } from "@/lib/school";
import { useMe } from "@/hooks/use-auth";
import { UserRound } from "lucide-react";

export const Route = createFileRoute("/_authenticated/portal/students")({
  beforeLoad: async () => { await requirePortalRoles(["admin","headteacher","teacher","parent","student"]); },
  component: StudentsLayout,
});

function StudentsLayout() {
  return <><Outlet /><StudentsPage /></>;
}

function StudentsPage() {
  const {userId, isLeadership, hasRole}=useMe(); const qc=useQueryClient(); const family=hasRole("parent")||hasRole("student"); const [q,setQ]=useState("");
  const students=useQuery({queryKey:["students",userId,isLeadership,family],queryFn:async()=>{let ids:string[]=[];if(hasRole("parent")){const {data}=await supabase.from("parent_student").select("student_id").eq("parent_id",userId!);ids=(data??[]).map(x=>x.student_id);}else if(hasRole("student")){const {data}=await supabase.from("students").select("id").eq("user_id",userId!);ids=(data??[]).map(x=>x.id);}let query=supabase.from("students").select("id,admission_no,first_name,last_name,gender,status,admission_date,current_class_id,photo_url,classes:current_class_id(name,section)").order("first_name");if(hasRole("parent")||hasRole("student")){if(!ids.length)return [];query=query.in("id",ids);}const {data,error}=await query;if(error)throw error;return data??[];}});
  const addRemark=useMutation({mutationFn:async({studentId,remark}:{studentId:string;remark:string})=>{const {error}=await (supabase as any).from("student_remarks").insert({student_id:studentId,teacher_id:userId,remark});if(error)throw error;},onSuccess:()=>{toast.success("Remark saved.");qc.invalidateQueries({queryKey:["remarks"]});},onError:e=>toast.error(e instanceof Error?e.message:"Could not save remark")});
  const rows=(students.data??[]).filter(s=>{const n=q.trim().toLowerCase();return !n||`${s.first_name} ${s.last_name} ${s.admission_no}`.toLowerCase().includes(n);});
  if(family){return <div><PageHeader title={hasRole("parent")?"My Children":"My Student Record"} description={hasRole("parent")?"Only your linked children are shown here.":"Your own learner record."}/><div className="grid gap-4 md:grid-cols-2">{rows.map(s=><ChildCard key={s.id} student={s}/>)}</div>{!students.isLoading&&!rows.length&&<EmptyState message="No linked student record found yet."/>}</div>}
  return <div><PageHeader title="Students" description="Learner register. Teachers see only students in their assigned classes."/><Card><CardContent className="p-4 sm:p-6"><Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name or admission number" className="mb-4 max-w-sm"/><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left"><th className="p-2">Adm. no</th><th className="p-2">Name</th><th className="p-2">Class</th><th className="p-2">Gender</th><th className="p-2">Status</th><th className="p-2">Profile</th>{hasRole("teacher")&&<th className="p-2">Teacher remark</th>}</tr></thead><tbody>{rows.map(s=><tr key={s.id} className="border-b"><td className="p-2 font-mono text-xs">{s.admission_no}</td><td className="p-2 font-medium"><Link className="text-primary hover:underline" to="/portal/students/$studentId" params={{studentId:s.id}}>{fullName(s)}</Link></td><td className="p-2">{(s.classes as any)?.name??"—"}{(s.classes as any)?.section?` — ${(s.classes as any).section}`:""}</td><td className="p-2 capitalize">{s.gender??"—"}</td><td className="p-2"><Badge variant={s.status==="active"?"default":"secondary"}>{s.status}</Badge></td><td className="p-2"><Button variant="outline" size="sm" asChild><Link to="/portal/students/$studentId" params={{ studentId: s.id }}>View Profile</Link></Button></td>{hasRole("teacher")&&<td className="p-2"><RemarkBox studentId={s.id} onSave={(remark)=>addRemark.mutate({studentId:s.id,remark})} disabled={addRemark.isPending}/></td>}</tr>)}</tbody></table>{!students.isLoading&&!rows.length&&<EmptyState message="No students found."/>}</div></CardContent></Card></div>;
}
function ChildCard({student:s}:{student:any}){
  const [photoUrl,setPhotoUrl]=useState<string|null>(null);
  const remarks=useQuery({queryKey:["remarks",s.id],queryFn:async()=>{const {data,error}=await (supabase as any).from("student_remarks").select("id,remark,created_at,teacher:teacher_id(first_name,last_name)").eq("student_id",s.id).order("created_at",{ascending:false});if(error)throw error;return data??[];}});
  useQuery({queryKey:["student-card-photo",s.id,s.photo_url],enabled:Boolean(s.photo_url),queryFn:async()=>{const {data}=await supabase.storage.from("student-photos").createSignedUrl(s.photo_url,3600);setPhotoUrl(data?.signedUrl??null);return data?.signedUrl??null;}});
  return <Card><CardHeader><div className="flex items-center gap-3"><div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full border bg-muted">{photoUrl?<img src={photoUrl} alt={`${fullName(s)} profile`} className="size-full object-cover"/>:<UserRound className="size-7 text-muted-foreground"/>}</div><div className="min-w-0 flex-1"><CardTitle>{fullName(s)}</CardTitle><p className="text-sm text-muted-foreground">{s.admission_no} · {(s.classes as any)?.name??"Class not assigned"}</p></div><Button variant="outline" size="sm" asChild><Link to="/portal/students/$studentId" params={{ studentId: s.id }}>View Profile</Link></Button></div></CardHeader><CardContent><h3 className="font-semibold">Teacher remarks</h3>{remarks.data?.length?<div className="mt-3 space-y-2">{remarks.data.map((r:any)=><div key={r.id} className="rounded-lg bg-secondary/60 p-3"><p className="text-sm">{r.remark}</p><p className="mt-1 text-xs text-muted-foreground">{fullName(r.teacher)} · {new Date(r.created_at).toLocaleDateString()}</p></div>)}</div>:<p className="mt-2 text-sm text-muted-foreground">No teacher remarks yet.</p>}</CardContent></Card>
}

function RemarkBox({studentId,onSave,disabled}:{studentId:string;onSave:(remark:string)=>void;disabled:boolean}){const [remark,setRemark]=useState("");return <div className="min-w-56 space-y-2"><Textarea value={remark} onChange={e=>setRemark(e.target.value)} rows={2} placeholder="Write a professional remark…"/><Button size="sm" disabled={!remark.trim()||disabled} onClick={()=>{onSave(remark.trim());setRemark("")}}>Save remark</Button></div>}

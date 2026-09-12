import { createFileRoute } from "@tanstack/react-router";
import { requirePortalRoles } from "@/lib/permissions";
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarPlus,CheckCircle2,Download,FileText } from "lucide-react";
import { PageHeader,EmptyState } from "@/components/portal/page-header";
import { Card,CardContent,CardHeader,CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useMe } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { classOptions,fullName,gradeFor,money } from "@/lib/school";

export const Route=createFileRoute("/_authenticated/portal/exams")({beforeLoad:async()=>{await requirePortalRoles(["admin","headteacher","teacher","parent","student"]);},component:ExamsPage});

function examEndTime(start:string|undefined,duration:number|undefined){
  if(!start||!duration)return "";
  const [h,m]=start.slice(0,5).split(":").map(Number);
  if(!Number.isFinite(h)||!Number.isFinite(m))return "";
  const total=h*60+m+duration; const hh=Math.floor((total%1440)/60); const mm=total%60;
  return `${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}`;
}
function ExamsPage(){const {userId,isLeadership,hasRole}=useMe();return <div><PageHeader title="Exams" description="Exam dates, applications, timetables and reports."/><div className="space-y-6">{isLeadership?<LeadershipExams userId={userId}/>:hasRole("teacher")?<TeacherExams/>:<FamilyExams userId={userId} student={hasRole("student")}/>}</div></div>}
function LeadershipExams({userId}:{userId:string|undefined}){const qc=useQueryClient();const [name,setName]=useState("");const [type,setType]=useState<"cat"|"midterm"|"end_term"|"mock"|"national">("end_term");const [start,setStart]=useState("");const [end,setEnd]=useState("");const [publish,setPublish]=useState(false);const [selected,setSelected]=useState("");const [subject,setSubject]=useState("");const [classId,setClassId]=useState("");const [teacherId,setTeacherId]=useState("");const [examTime,setExamTime]=useState("");const [duration,setDuration]=useState("60");
 const exams=useQuery({queryKey:["exams-leadership"],queryFn:async()=>{const {data,error}=await supabase.from("exams").select("id,name,type,starts_on,ends_on,published").order("starts_on",{ascending:false});if(error)throw error;return data??[];}});const classes=useQuery({queryKey:["exam-classes"],queryFn:async()=>{const {data,error}=await supabase.from("classes").select("id,name,section,level_order").order("level_order");if(error)throw error;return data??[];}});const subjects=useQuery({queryKey:["exam-subjects-list"],queryFn:async()=>{const {data,error}=await supabase.from("subjects").select("id,name").order("name");if(error)throw error;return data??[];}});const teachers=useQuery({queryKey:["exam-teachers"],queryFn:async()=>{const {data:r,error:re}=await supabase.from("user_roles").select("user_id").eq("role","teacher");if(re)throw re;const ids=(r??[]).map(x=>x.user_id);if(!ids.length)return [];const {data,error}=await supabase.from("profiles").select("id,first_name,last_name").in("id",ids).order("first_name");if(error)throw error;return data??[];}});const teacherAssignments=useQuery({queryKey:["exam-teacher-subject-assignments"],queryFn:async()=>{const {data,error}=await (supabase as any).from("teacher_class_assignments").select("teacher_id,class_id,subject_id").not("subject_id","is",null);if(error)throw error;return data??[];}});const schedule=useQuery({queryKey:["exam-schedule",selected],enabled:!!selected,queryFn:async()=>{const {data,error}=await supabase.from("exam_subjects").select("id,exam_date,start_time,duration_minutes,max_marks,class_id,subject_id,teacher_id,classes:class_id(name,section),subjects:subject_id(name)").eq("exam_id",selected).order("exam_date");if(error)throw error;return data??[];}});const registrations=useQuery({queryKey:["exam-registrations",selected],enabled:!!selected,queryFn:async()=>{const {data,error}=await (supabase as any).from("exam_registrations").select("id,student_id,status,mercy_granted,requested_at,students:student_id(first_name,last_name,admission_no)").eq("exam_id",selected).order("requested_at",{ascending:false});if(error)throw error;return data??[];}});
 const createExam=useMutation({mutationFn:async()=>{const {error}=await supabase.from("exams").insert({name,type,starts_on:start||null,ends_on:end||null,published:publish,created_by:userId??null});if(error)throw error;},onSuccess:()=>{toast.success("Exam created.");setName("");setStart("");setEnd("");qc.invalidateQueries({queryKey:["exams-leadership"]});},onError:e=>toast.error(e instanceof Error?e.message:"Could not create exam")});
 const addSubject=useMutation({mutationFn:async()=>{if(!selected||!classId||!subject||!teacherId)throw new Error("Select exam, class, subject and assigned teacher.");const allowed=(teacherAssignments.data??[]).some((a:any)=>a.teacher_id===teacherId&&a.class_id===classId&&a.subject_id===subject);if(!allowed)throw new Error("That teacher is not assigned to this subject and class.");const {error}=await (supabase as any).from("exam_subjects").insert({exam_id:selected,class_id:classId,subject_id:subject,teacher_id:teacherId,exam_date:start||null,start_time:examTime||null,duration_minutes:duration?Number(duration):null,max_marks:100});if(error)throw error;},onSuccess:()=>{toast.success("Exam subject and teacher assigned.");setTeacherId("");setExamTime("");setDuration("60");qc.invalidateQueries({queryKey:["exam-schedule",selected]});},onError:e=>toast.error(e instanceof Error?e.message:"Could not add timetable entry")});
 const mercy=useMutation({mutationFn:async({id,allow}:{id:string;allow:boolean})=>{const {error}=await (supabase as any).from("exam_registrations").update({mercy_granted:allow,status:"registered",approved_by:userId,approved_at:new Date().toISOString()}).eq("id",id);if(error)throw error;},onSuccess:()=>{toast.success("Exam application updated.");qc.invalidateQueries({queryKey:["exam-registrations",selected]});},onError:e=>toast.error(e instanceof Error?e.message:"Could not update application")});
 return <><div className="grid gap-6 xl:grid-cols-[24rem_1fr]"><Card><CardHeader><CardTitle className="text-base">Create exam</CardTitle></CardHeader><CardContent className="space-y-3"><Input value={name} onChange={e=>setName(e.target.value)} placeholder="Exam name"/><Select value={type} onValueChange={v=>setType(v as any)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{["cat","midterm","end_term","mock","national"].map(x=><SelectItem key={x} value={x}>{x.replace("_"," ").toUpperCase()}</SelectItem>)}</SelectContent></Select><div className="grid grid-cols-2 gap-2"><Input type="date" value={start} onChange={e=>setStart(e.target.value)}/><Input type="date" value={end} onChange={e=>setEnd(e.target.value)}/></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={publish} onChange={e=>setPublish(e.target.checked)}/> Publish to families</label><Button className="w-full" disabled={!name||createExam.isPending} onClick={()=>createExam.mutate()}><CalendarPlus className="mr-2 size-4"/>Create exam</Button></CardContent></Card><Card><CardHeader><CardTitle className="text-base">Exam register</CardTitle></CardHeader><CardContent className="space-y-2">{(exams.data??[]).map(e=><button key={e.id} onClick={()=>setSelected(e.id)} className={`w-full rounded-lg border p-3 text-left ${selected===e.id?"border-primary bg-primary/5":"hover:bg-muted"}`}><div className="flex justify-between"><b>{e.name}</b><Badge>{e.published?"Published":"Draft"}</Badge></div><p className="text-xs text-muted-foreground">{e.starts_on??"Date not set"} {e.ends_on?`→ ${e.ends_on}`:""}</p></button>)}{!exams.data?.length&&<EmptyState message="No exams created yet."/>}</CardContent></Card></div>{selected&&<><Card><CardHeader><CardTitle className="text-base">Build exam timetable</CardTitle><p className="text-sm text-muted-foreground">Set the exact date, start time and duration for each subject paper.</p></CardHeader><CardContent><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7"><Select value={classId} onValueChange={(v)=>{setClassId(v);setTeacherId("")}}><SelectTrigger><SelectValue placeholder="Class"/></SelectTrigger><SelectContent>{(classes.data??[]).map(c=><SelectItem key={c.id} value={c.id}>{c.name}{c.section?` — ${c.section}`:""}</SelectItem>)}</SelectContent></Select><Select value={subject} onValueChange={(v)=>{setSubject(v);setTeacherId("")}}><SelectTrigger><SelectValue placeholder="Subject"/></SelectTrigger><SelectContent>{(subjects.data??[]).map(s=><SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select><Select value={teacherId} onValueChange={setTeacherId}><SelectTrigger><SelectValue placeholder="Assign teacher"/></SelectTrigger><SelectContent>{(teachers.data??[]).filter((t:any)=>(teacherAssignments.data??[]).some((a:any)=>a.teacher_id===t.id&&a.class_id===classId&&a.subject_id===subject)).map((t:any)=><SelectItem key={t.id} value={t.id}>{fullName(t)}</SelectItem>)}</SelectContent></Select><div><Label className="text-xs">Paper date</Label><Input className="mt-1" type="date" value={start} onChange={e=>setStart(e.target.value)}/></div><div><Label className="text-xs">Start time</Label><Input className="mt-1" type="time" value={examTime} onChange={e=>setExamTime(e.target.value)} aria-label="Exam start time"/></div><div><Label className="text-xs">Duration (minutes)</Label><Input className="mt-1" type="number" min="5" max="600" step="5" value={duration} onChange={e=>setDuration(e.target.value)} placeholder="e.g. 60" aria-label="Exam duration in minutes"/></div><Button disabled={!teacherId||!start||!examTime||!duration} onClick={()=>addSubject.mutate()}><CheckCircle2 className="mr-2 size-4"/>Assign subject & teacher</Button></div>{classId&&subject&&!(teacherAssignments.data??[]).some((a:any)=>a.class_id===classId&&a.subject_id===subject)&&<p className="mt-2 text-sm text-destructive">No teacher is currently assigned to this subject and class. Assign the teacher under Classes → Subject Assignments first.</p>}<div className="mt-4 space-y-2">{(schedule.data??[]).map((x:any)=><div key={x.id} className="flex justify-between rounded-lg border p-3"><span><span className="block">{x.exam_date} · {x.classes?.name} · {x.subjects?.name}</span><span className="block text-xs text-muted-foreground">{x.start_time?.slice(0,5)??"Time TBA"}{x.duration_minutes?` – ${examEndTime(x.start_time,x.duration_minutes)} (${x.duration_minutes} min)`:""}</span></span><span className="text-right text-sm"><span className="block">{x.max_marks} marks</span><span className="text-xs text-muted-foreground">{fullName((teachers.data??[]).find((t:any)=>t.id===x.teacher_id) as any)||"Teacher not assigned"}</span></span></div>)}</div></CardContent></Card><Card><CardHeader><CardTitle className="text-base">Student exam applications</CardTitle></CardHeader><CardContent className="space-y-2">{(registrations.data??[]).map((r:any)=><div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"><div><b>{fullName(r.students)}</b><p className="text-xs text-muted-foreground">{r.students?.admission_no} · {r.requested_at.slice(0,10)}</p></div><div className="flex items-center gap-2"><Badge>{r.status}</Badge>{r.mercy_granted&&<Badge variant="secondary">Mercy granted</Badge>} {!r.mercy_granted&&<Button size="sm" onClick={()=>mercy.mutate({id:r.id,allow:true})}>Grant mercy & register</Button>}</div></div>)}{!registrations.data?.length&&<EmptyState message="No exam applications yet."/>}</CardContent></Card></>}</>}
function TeacherExams(){
 const {userId}=useMe();
 const qc=useQueryClient();
 const [selected,setSelected]=useState("");
 const [draftMarks,setDraftMarks]=useState<Record<string,string>>({});
 const [draftRemarks,setDraftRemarks]=useState<Record<string,string>>({});

 const assignments=useQuery({queryKey:["teacher-subject-assignments-for-marks",userId],enabled:!!userId,queryFn:async()=>{
   const {data,error}=await (supabase as any).from("teacher_class_assignments")
     .select("id,class_id,subject_id")
     .eq("teacher_id",userId)
     .not("subject_id","is",null);
   if(error)throw error;
   return data??[];
 }});
 const examSubjects=useQuery({queryKey:["teacher-exam-subjects-for-marks",userId,(assignments.data??[]).map((a:any)=>`${a.class_id}:${a.subject_id}`).join(",")],enabled:!!userId&&!assignments.isLoading,queryFn:async()=>{
   const {data,error}=await (supabase as any).from("exam_subjects")
     .select("id,exam_id,class_id,subject_id,teacher_id,max_marks,exam_date,start_time,duration_minutes,exam:exam_id(id,name,type,starts_on,ends_on),class:class_id(id,name,section),subject:subject_id(id,name,code)")
     .order("exam_date",{ascending:false});
   if(error)throw error;
   const allowed=new Set((assignments.data??[]).map((a:any)=>`${a.class_id}:${a.subject_id}`));
   return (data??[]).filter((x:any)=>x.teacher_id ? x.teacher_id===userId : allowed.has(`${x.class_id}:${x.subject_id}`));
 }});
 const selectedRow=(examSubjects.data??[]).find((x:any)=>x.id===selected) as any;
 const students=useQuery({queryKey:["teacher-mark-roster",selectedRow?.class_id],enabled:!!selectedRow,queryFn:async()=>{
   const {data,error}=await supabase.from("students").select("id,first_name,last_name,admission_no,status").eq("current_class_id",selectedRow.class_id).order("first_name").order("last_name");
   if(error)throw error;
   return data??[];
 }});
 const marks=useQuery({queryKey:["teacher-marks",selected],enabled:!!selected,queryFn:async()=>{
   const {data,error}=await (supabase as any).from("marks").select("id,student_id,marks,grade,teacher_remarks,entered_by").eq("exam_subject_id",selected);
   if(error)throw error;
   const map=new Map<string,any>();
   (data??[]).forEach((m:any)=>map.set(m.student_id,m));
   return map;
 }});
 const saveMarks=useMutation({mutationFn:async()=>{
   if(!selectedRow)throw new Error("Select an assigned assessment first.");
   const max=Number(selectedRow.max_marks)||100;
   const rows=(students.data??[]).map((student:any)=>{
     const existing=marks.data?.get(student.id);
     const raw=draftMarks[student.id] ?? (existing?.marks !== undefined ? String(existing.marks) : "");
     if(raw.trim()==="")return null;
     const value=Number(raw);
     if(!Number.isFinite(value)||value<0||value>max)throw new Error(`Marks for ${fullName(student)} must be between 0 and ${max}.`);
     const pct=(value/max)*100;
     const grade=pct>=80?"A":pct>=70?"B":pct>=60?"C":pct>=50?"D":"E";
     return {exam_subject_id:selected,student_id:student.id,marks:value,grade,teacher_remarks:(draftRemarks[student.id]??"").trim()||null,entered_by:userId};
   }).filter(Boolean);
   if(!rows.length)throw new Error("Enter at least one student's marks.");
   const {error}=await (supabase as any).from("marks").upsert(rows,{onConflict:"exam_subject_id,student_id"});
   if(error)throw error;
 },onSuccess:()=>{toast.success("Marks saved successfully.");qc.invalidateQueries({queryKey:["teacher-marks",selected]});},onError:e=>toast.error(e instanceof Error?e.message:"Could not save marks")});

 return <div className="space-y-6">
   <Card>
     <CardHeader><CardTitle className="text-base">Enter marks</CardTitle></CardHeader>
     <CardContent className="space-y-4">
       <p className="text-sm text-muted-foreground">Choose an exam, subject and class that has been assigned to you. Enter marks and an optional teacher comment for each learner.</p>
       <Select value={selected} onValueChange={(v)=>{setSelected(v);setDraftMarks({});setDraftRemarks({});}}>
         <SelectTrigger><SelectValue placeholder="Select an assessment"/></SelectTrigger>
         <SelectContent>
           {(examSubjects.data??[]).map((x:any)=><SelectItem key={x.id} value={x.id}>{x.exam?.name??"Exam"} · {x.subject?.name??"Subject"} · {x.class?.name??"Class"}{x.class?.section?` — ${x.class.section}`:""} · Max {x.max_marks}</SelectItem>)}
         </SelectContent>
       </Select>
       {!examSubjects.isLoading&&!examSubjects.data?.length&&<EmptyState message="No assessments have been assigned to you yet. Ask the Admin or Headteacher to add your subject to an exam."/>}
     </CardContent>
   </Card>
   {selectedRow&&<>
     <Card>
       <CardHeader><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-base">{selectedRow.subject?.name} — {selectedRow.class?.name}{selectedRow.class?.section?` · ${selectedRow.class.section}`:""}</CardTitle><p className="text-sm text-muted-foreground">{selectedRow.exam?.name} · Maximum {selectedRow.max_marks} marks{selectedRow.exam_date?` · ${selectedRow.exam_date}`:""}{selectedRow.start_time?` · ${selectedRow.start_time.slice(0,5)}`:""}{selectedRow.duration_minutes?` – ${examEndTime(selectedRow.start_time,selectedRow.duration_minutes)} (${selectedRow.duration_minutes} min)`:""}</p></div><Badge variant="secondary">{students.data?.length??0} learners</Badge></div></CardHeader>
       <CardContent className="space-y-3">
         {students.isLoading?<p className="text-sm text-muted-foreground">Loading learners…</p>:students.data?.length?(<>
           <div className="hidden rounded-lg border bg-muted/30 p-3 text-xs font-semibold md:grid md:grid-cols-[2fr_7rem_1fr] md:gap-3"><span>Learner</span><span>Marks / {selectedRow.max_marks}</span><span>Teacher remark</span></div>
           {students.data.map((student:any)=>{const existing=marks.data?.get(student.id);return <div key={student.id} className="grid gap-3 rounded-lg border p-3 md:grid-cols-[2fr_7rem_1fr] md:items-center"><div><p className="font-medium">{fullName(student)}</p><p className="text-xs text-muted-foreground">{student.admission_no} · {student.status}</p>{existing&&<p className="mt-1 text-xs text-muted-foreground">Saved grade: <b>{existing.grade??"—"}</b></p>}</div><Input type="number" min="0" max={selectedRow.max_marks} step="0.01" value={draftMarks[student.id] ?? (existing?.marks !== undefined ? String(existing.marks) : "")} onChange={e=>setDraftMarks(v=>({...v,[student.id]:e.target.value}))} placeholder="0"/><Input value={draftRemarks[student.id] ?? (existing?.teacher_remarks ?? "")} onChange={e=>setDraftRemarks(v=>({...v,[student.id]:e.target.value}))} placeholder="Optional teacher remark"/></div>})}
           <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4"><p className="text-xs text-muted-foreground">Grades are calculated automatically: A ≥ 80%, B ≥ 70%, C ≥ 60%, D ≥ 50%, E &lt; 50%.</p><Button disabled={saveMarks.isPending||marks.isLoading} onClick={()=>saveMarks.mutate()}><CheckCircle2 className="mr-2 size-4"/>{saveMarks.isPending?"Saving…":"Save marks"}</Button></div>
         </>):<EmptyState message="No learners are currently assigned to this class."/>}
       </CardContent>
     </Card>
   </>}
 </div>;
}
function FamilyExams({userId,student}:{userId:string|undefined;student:boolean}){
 const qc=useQueryClient(); const [examId,setExamId]=useState(""); const kids=useQuery({queryKey:["exam-kids",userId,student],queryFn:async()=>{if(student){const {data,error}=await supabase.from("students").select("id,first_name,last_name,admission_no").eq("user_id",userId!);if(error)throw error;return data??[];}const {data:ps}=await supabase.from("parent_student").select("student_id").eq("parent_id",userId!);const ids=(ps??[]).map(x=>x.student_id);if(!ids.length)return [];const {data,error}=await supabase.from("students").select("id,first_name,last_name,admission_no").in("id",ids);if(error)throw error;return data??[];}});
 const exams=useQuery({queryKey:["family-exams"],queryFn:async()=>{const {data,error}=await supabase.from("exams").select("id,name,type,starts_on,ends_on").eq("published",true).order("starts_on",{ascending:false});if(error)throw error;return data??[];}});
 const registrations=useQuery({queryKey:["my-exam-registrations",examId,userId],enabled:!!examId,queryFn:async()=>{const ids=(kids.data??[]).map(k=>k.id);if(!ids.length)return [];const {data,error}=await (supabase as any).from("exam_registrations").select("id,student_id,status,mercy_granted,students:student_id(first_name,last_name,admission_no)").eq("exam_id",examId).in("student_id",ids);if(error)throw error;return data??[];}});
 const schedule=useQuery({queryKey:["family-exam-schedule",examId],enabled:!!examId,queryFn:async()=>{const {data,error}=await supabase.from("exam_subjects").select("id,exam_date,start_time,duration_minutes,class_id,subjects:subject_id(name),classes:class_id(name,section)").eq("exam_id",examId).order("exam_date");if(error)throw error;return data??[];}});
 const register=useMutation({mutationFn:async(studentId:string)=>{const {data,error}=await (supabase.rpc as any)("can_register_for_exam",{_student_id:studentId,_exam_id:examId});if(error)throw error;if(!data)throw new Error("Exam registration requires a zero balance or an Admin/Headteacher mercy approval.");const {error:e}=await (supabase as any).from("exam_registrations").insert({exam_id:examId,student_id:studentId,status:"registered"});if(e)throw e;},onSuccess:()=>{toast.success("Exam registration submitted.");qc.invalidateQueries({queryKey:["my-exam-registrations"]});},onError:e=>toast.error(e instanceof Error?e.message:"Could not register")});
 async function downloadReport(studentId:string){const {data,error}=await supabase.from("marks").select("marks,grade,teacher_remarks,exam_subjects:exam_subject_id(exam_date,subjects:subject_id(name),exams:exam_id(name))").eq("student_id",studentId);if(error){toast.error(error.message);return;}const rows=(data??[]).map((r:any)=>[r.exam_subjects?.exams?.name??"Exam",r.exam_subjects?.exam_date??"",r.exam_subjects?.subjects?.name??"",r.marks??"",r.grade??"",r.teacher_remarks??""]);const csv=[["Exam","Date","Subject","Marks","Grade","Teacher remarks"],...rows].map(r=>r.map((x:any)=>`"${String(x).replaceAll('"','""')}"`).join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download=`rahma-exam-report-${studentId}.csv`;a.click();URL.revokeObjectURL(a.href);}
 return <><Card><CardHeader><CardTitle className="text-base">Exam week & registration</CardTitle></CardHeader><CardContent className="space-y-4"><Select value={examId} onValueChange={setExamId}><SelectTrigger><SelectValue placeholder="Select published exam"/></SelectTrigger><SelectContent>{(exams.data??[]).map(e=><SelectItem key={e.id} value={e.id}>{e.name} · {e.starts_on??"TBA"}</SelectItem>)}</SelectContent></Select>{examId&&<div className="space-y-2">{(kids.data??[]).map(k=><div key={k.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"><span>{fullName(k)}</span><div className="flex gap-2"><Button size="sm" onClick={()=>register.mutate(k.id)} disabled={register.isPending}>Register</Button><Button size="sm" variant="outline" onClick={()=>downloadReport(k.id)}><Download className="mr-2 size-4"/>Download report</Button></div></div>)}</div>}<div className="space-y-2">{(schedule.data??[]).map((x:any)=><div key={x.id} className="rounded border p-3 text-sm">{x.exam_date} · {x.classes?.name} · {x.subjects?.name}<span className="block text-xs text-muted-foreground">{x.start_time?.slice(0,5)??"Time TBA"}{x.duration_minutes?` – ${examEndTime(x.start_time,x.duration_minutes)} (${x.duration_minutes} min)`:""}</span></div>)}</div></CardContent></Card><Card><CardHeader><CardTitle className="text-base">Registration status</CardTitle></CardHeader><CardContent>{registrations.data?.length?<div className="space-y-2">{registrations.data.map((r:any)=><div key={r.id} className="flex justify-between rounded-lg border p-3"><span>{fullName(r.students)}</span><Badge>{r.mercy_granted?"Registered (mercy)":r.status}</Badge></div>)}</div>:<EmptyState message="No registrations for the selected exam."/>}</CardContent></Card></>;
}

import * as React from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarCheck, CreditCard, FileText, UserRound, GraduationCap, Camera } from "lucide-react";
import { requirePortalRoles } from "@/lib/permissions";
import { supabase } from "@/integrations/supabase/client";
import { fullName, money } from "@/lib/school";
import { useMe } from "@/hooks/use-auth";
import { PageHeader, EmptyState } from "@/components/portal/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/portal/students/$studentId")({
  beforeLoad: async () => { await requirePortalRoles(["admin", "headteacher", "teacher", "parent", "student"]); },
  component: StudentProfilePage,
});

function StudentProfilePage() {
  const { userId, hasRole } = useMe();
  const canManagePhoto = hasRole("admin") || hasRole("headteacher") || hasRole("parent");
  const [photoUploading, setPhotoUploading] = React.useState(false);
  const [photoUrl, setPhotoUrl] = React.useState<string | null>(null);
  const { studentId } = Route.useParams();
  const student = useQuery({
    queryKey: ["student-profile", studentId, userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("students").select("id,admission_no,first_name,last_name,date_of_birth,gender,status,admission_date,medical_notes,emergency_contact,emergency_phone,photo_url,current_class_id,classes:current_class_id(name,section)").eq("id", studentId).maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("Student record not found or you do not have permission to view it.");
      return data as any;
    },
  });
  const attendance = useQuery({
    queryKey: ["student-attendance-summary", studentId],
    enabled: Boolean(student.data),
    queryFn: async () => {
      const { data, error } = await supabase.from("attendance_records").select("status,attendance_date,remarks").eq("student_id", studentId).order("attendance_date", { ascending: false }).limit(20);
      if (error) throw error; return data ?? [];
    },
  });
  const finance = useQuery({
    queryKey: ["student-finance-summary", studentId],
    enabled: Boolean(student.data) && (hasRole("admin") || hasRole("headteacher") || hasRole("parent") || hasRole("student")),
    queryFn: async () => {
      const [{ data: invoices, error: ie }, { data: payments, error: pe }] = await Promise.all([
        supabase.from("invoices").select("id,amount,status,due_date").eq("student_id", studentId).order("due_date", { ascending: false }),
        supabase.from("payments").select("id,amount,method,transaction_reference,paid_at,receipt_no").eq("student_id", studentId).order("paid_at", { ascending: false }).limit(10),
      ]);
      if (ie) throw ie; if (pe) throw pe;
      const billed = (invoices ?? []).reduce((n, x) => n + Number(x.amount ?? 0), 0);
      const paid = (payments ?? []).reduce((n, x) => n + Number(x.amount ?? 0), 0);
      return { invoices: invoices ?? [], payments: payments ?? [], billed, paid, balance: Math.max(0, billed - paid) };
    },
  });
  const parents = useQuery({
    queryKey: ["student-parents", studentId],
    enabled: Boolean(student.data),
    queryFn: async () => {
      const { data: links, error: le } = await supabase.from("parent_student").select("parent_id,relationship,is_primary").eq("student_id", studentId);
      if (le) throw le;
      const ids = (links ?? []).map(x => x.parent_id);
      if (!ids.length) return [];
      const { data, error } = await supabase.from("profiles").select("id,first_name,last_name,email,phone").in("id", ids);
      if (error) throw error;
      return (links ?? []).map(l => ({ ...l, profile: (data ?? []).find(p => p.id === l.parent_id) }));
    },
  });
  const studentPhotoPath = (student.data as any)?.photo_url;

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const path = studentPhotoPath;
      if (!path) { setPhotoUrl(null); return; }
      const { data } = await supabase.storage.from("student-photos").createSignedUrl(path, 3600);
      if (!cancelled) setPhotoUrl(data?.signedUrl ?? null);
    };
    load();
    return () => { cancelled = true; };
  }, [studentPhotoPath]);

  if (student.isLoading) return <p className="text-sm text-muted-foreground">Loading student profile…</p>;
  if (student.isError) return <EmptyState message={student.error instanceof Error ? student.error.message : "Unable to load student profile."} />;
  const s = student.data;
  const className = s.classes?.name ? `${s.classes.name}${s.classes.section ? ` — ${s.classes.section}` : ""}` : "Not assigned";
  const present = (attendance.data ?? []).filter(x => x.status === "present").length;
  const absent = (attendance.data ?? []).filter(x => x.status === "absent").length;

  const uploadStudentPhoto = async (file: File) => {
    if (!canManagePhoto) return;
    if (hasRole("parent")) {
      const { data: link } = await supabase.from("parent_student").select("student_id").eq("parent_id", userId!).eq("student_id", s.id).maybeSingle();
      if (!link) { toast.error("You can only update photos for your own children."); return; }
    }
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Student photo must be 5 MB or smaller."); return; }
    setPhotoUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${s.id}/profile-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("student-photos").upload(path, file, { upsert: true, contentType: file.type });
      if (uploadError) throw uploadError;
      if (hasRole("parent")) {
        const { error: parentPhotoError } = await supabase.rpc("set_student_photo_by_parent", { _student_id: s.id, _photo_path: path });
        if (parentPhotoError) throw parentPhotoError;
      } else {
        const { error: updateError } = await supabase.from("students").update({ photo_url: path }).eq("id", s.id);
        if (updateError) throw updateError;
      }
      await student.refetch();
      toast.success("Student profile picture updated.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not upload student photo.");
    } finally { setPhotoUploading(false); }
  };

  return <div>
    <Button variant="ghost" asChild className="mb-2 -ml-3"><Link to="/portal/students"><ArrowLeft className="mr-2 size-4"/>Back to students</Link></Button>
    <PageHeader title={fullName(s)} description={`Admission ${s.admission_no} · ${className}`} />
    <Card className="mb-6"><CardContent className="flex flex-wrap items-center gap-5 p-5">
      <div className="grid size-28 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-primary/10 bg-muted">
        {photoUrl ? <img src={photoUrl} alt={`${fullName(s)} profile`} className="size-full object-cover" /> : <UserRound className="size-12 text-muted-foreground" />}
      </div>
      <div className="min-w-[220px] flex-1"><p className="text-xs uppercase tracking-brand text-muted-foreground">Student profile picture</p><p className="mt-1 text-sm text-muted-foreground">Clear passport-style photo · JPG, PNG or WebP · maximum 5 MB.</p>
        {canManagePhoto && <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted print:hidden"><Camera className="size-4" />{photoUploading ? "Uploading…" : photoUrl ? "Change photo" : "Upload photo"}<Input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={photoUploading} onChange={e => { const f=e.target.files?.[0]; if(f) uploadStudentPhoto(f); e.currentTarget.value=""; }} /></label>}
      </div>
    </CardContent></Card>
    <div className="mb-4 print:hidden"><Button variant="outline" asChild><Link to="/portal/academic" search={{ studentId: s.id }}><GraduationCap className="mr-2 size-4"/>View academic record</Link></Button></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Info title="Class" value={className} icon={UserRound}/>
      <Info title="Status" value={s.status} icon={UserRound}/>
      <Info title="Attendance" value={`${present} present · ${absent} absent`} icon={CalendarCheck}/>
      {(hasRole("admin") || hasRole("headteacher") || hasRole("parent") || hasRole("student")) && <Info title="Balance" value={money(finance.data?.balance ?? 0)} icon={CreditCard}/>} 
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><UserRound className="size-4"/>Personal & emergency details</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><Row label="Date of birth" value={s.date_of_birth ? new Date(`${s.date_of_birth}T00:00:00`).toLocaleDateString("en-KE") : "Not recorded"}/><Row label="Gender" value={s.gender ?? "Not recorded"}/><Row label="Admission date" value={s.admission_date ? new Date(`${s.admission_date}T00:00:00`).toLocaleDateString("en-KE") : "Not recorded"}/><Row label="Emergency contact" value={s.emergency_contact ?? "Not recorded"}/><Row label="Emergency phone" value={s.emergency_phone ?? "Not recorded"}/><Row label="Medical notes" value={s.medical_notes ?? "No notes recorded"}/></CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><UserRound className="size-4"/>Parent / guardian</CardTitle></CardHeader><CardContent>{parents.data?.length ? <div className="space-y-3">{parents.data.map((p:any)=><div key={p.parent_id} className="rounded-lg border p-3"><p className="font-semibold">{fullName(p.profile)}</p><p className="text-sm text-muted-foreground">{p.relationship}{p.is_primary ? " · Primary" : ""}</p><p className="text-sm">{p.profile?.phone ?? "No phone"} · {p.profile?.email ?? "No email"}</p></div>)}</div> : <EmptyState message="No linked parent or guardian record."/>}</CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><CalendarCheck className="size-4"/>Recent attendance</CardTitle></CardHeader><CardContent>{attendance.data?.length ? <div className="space-y-2">{attendance.data.slice(0,10).map((a:any)=><div key={a.attendance_date} className="flex items-center justify-between rounded-lg border p-3"><div><p className="text-sm font-medium">{new Date(`${a.attendance_date}T00:00:00`).toLocaleDateString("en-KE")}</p><p className="text-xs text-muted-foreground">{a.remarks ?? "No remark"}</p></div><Badge variant={a.status === "present" ? "default" : a.status === "absent" ? "destructive" : "secondary"}>{a.status}</Badge></div>)}</div> : <EmptyState message="No attendance records yet."/>}</CardContent></Card>
      {(hasRole("admin") || hasRole("headteacher") || hasRole("parent") || hasRole("student")) && <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><FileText className="size-4"/>Fee summary</CardTitle></CardHeader><CardContent className="space-y-3"><Row label="Total billed" value={money(finance.data?.billed ?? 0)}/><Row label="Total paid" value={money(finance.data?.paid ?? 0)}/><Row label="Balance" value={money(finance.data?.balance ?? 0)}/><div className="border-t pt-3"><p className="mb-2 text-sm font-semibold">Recent payments</p>{finance.data?.payments.length ? finance.data.payments.map((p:any)=><div key={p.id} className="flex justify-between border-b py-2 text-sm"><span>{new Date(p.paid_at).toLocaleDateString("en-KE")} · {p.method}</span><span className="font-semibold">{money(p.amount)}</span></div>) : <p className="text-sm text-muted-foreground">No payments recorded.</p>}</div></CardContent></Card>}
    </div>
  </div>;
}
function Info({title,value,icon:Icon}:{title:string;value:string;icon:typeof UserRound}){return <Card><CardContent className="flex items-center gap-3 p-4"><span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4"/></span><div className="min-w-0"><p className="text-xs uppercase tracking-brand text-muted-foreground">{title}</p><p className="truncate font-semibold capitalize">{value}</p></div></CardContent></Card>}
function Row({label,value}:{label:string;value:string}){return <div className="flex flex-wrap justify-between gap-2 border-b pb-2"><span className="text-muted-foreground">{label}</span><span className="font-medium text-right">{value}</span></div>}

import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, KeyRound, Plus, UserRound, Users, ShieldCheck, ShieldOff } from "lucide-react";
import { requirePortalRoles } from "@/lib/permissions";
import { supabase } from "@/integrations/supabase/client";
import { fullName } from "@/lib/school";
import { PageHeader, EmptyState } from "@/components/portal/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useMe } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/portal/parents/$parentId")({
  beforeLoad: async () => { await requirePortalRoles(["admin", "headteacher"]); },
  component: ParentProfilePage,
});

function ParentProfilePage() {
  const { parentId } = Route.useParams();
  const { hasRole } = useMe();
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = React.useState(false);
  const [passwordOpen, setPasswordOpen] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [studentId, setStudentId] = React.useState("");
  const [relationship, setRelationship] = React.useState("parent");
  const [childMode, setChildMode] = React.useState<"existing" | "new">("existing");
  const [newChild, setNewChild] = React.useState({ firstName: "", lastName: "", dob: "", gender: "", classId: "" });

  const family = useQuery({
    queryKey: ["parent-family", parentId],
    queryFn: async () => {
      const { data: parent, error: parentError } = await supabase.from("profiles").select("id,first_name,last_name,email,phone,is_active,created_at").eq("id", parentId).maybeSingle();
      if (parentError) throw parentError;
      if (!parent) throw new Error("Parent account not found.");
      const [{ data: links, error: linkError }, { data: families, error: familyError }] = await Promise.all([
        supabase.from("parent_student").select("student_id,relationship,is_primary").eq("parent_id", parentId),
        supabase.from("admission_families").select("id,parent_name,parent_phone,parent_email,status,approved_at,created_at").eq("status", "active"),
      ]);
      if (linkError) throw linkError;
      if (familyError) throw familyError;
      const ids = (links ?? []).map((x) => x.student_id);
      const { data: students, error: studentError } = ids.length ? await supabase.from("students").select("id,admission_no,first_name,last_name,status,admission_date,current_class_id,photo_url,classes:current_class_id(name,section)").in("id", ids).order("first_name") : { data: [], error: null };
      if (studentError) throw studentError;
      const profileFamily = (families ?? []).find((f) =>
        (parent.email && f.parent_email && parent.email.toLowerCase() === f.parent_email.toLowerCase()) ||
        (parent.phone && f.parent_phone && parent.phone === f.parent_phone)
      ) ?? null;
      return { parent, links: links ?? [], students: students ?? [], family: profileFamily };
    },
  });

  const availableStudents = useQuery({
    queryKey: ["students-available-for-parent", parentId],
    enabled: addOpen,
    queryFn: async () => {
      const { data: links, error: linkError } = await supabase.from("parent_student").select("student_id").eq("parent_id", parentId);
      if (linkError) throw linkError;
      const excluded = new Set((links ?? []).map((x) => x.student_id));
      const { data, error } = await supabase.from("students").select("id,admission_no,first_name,last_name,status").order("first_name");
      if (error) throw error;
      return (data ?? []).filter((s) => !excluded.has(s.id));
    },
  });

  const classes = useQuery({
    queryKey: ["parent-add-child-classes"],
    enabled: addOpen && childMode === "new",
    queryFn: async () => {
      const { data, error } = await supabase.from("classes").select("id,name,section").order("level_order").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const addChild = useMutation({
    mutationFn: async () => {
      if (childMode === "existing") {
        if (!studentId) throw new Error("Select a student.");
        const { data, error } = await (supabase.rpc as any)("attach_student_to_parent_family", { _parent_id: parentId, _student_id: studentId, _relationship: relationship });
        if (error) throw error;
        return data;
      }
      if (!newChild.firstName.trim() || !newChild.lastName.trim()) throw new Error("Enter the child's first and last name.");
      const { data, error } = await (supabase.rpc as any)("create_student_for_parent_family", { _parent_id: parentId, _first_name: newChild.firstName, _last_name: newChild.lastName, _date_of_birth: newChild.dob || null, _gender: newChild.gender || null, _class_id: newChild.classId || null, _relationship: relationship });
      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => { toast.success(childMode === "existing" ? "Child linked to the parent family." : `Child admitted with admission number ${data?.admission_no ?? "created"}.`); setAddOpen(false); setStudentId(""); setNewChild({ firstName: "", lastName: "", dob: "", gender: "", classId: "" }); qc.invalidateQueries({ queryKey: ["parent-family", parentId] }); qc.invalidateQueries({ queryKey: ["parents-directory"] }); qc.invalidateQueries({ queryKey: ["students-available-for-parent", parentId] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not link child."),
  });

  const resetPassword = useMutation({
    mutationFn: async () => {
      if (!password || password.length < 8) throw new Error("Password must be at least 8 characters.");
      const { error } = await supabase.functions.invoke("create-parent-account", { body: { email: family.data?.parent.email, password, firstName: family.data?.parent.first_name, lastName: family.data?.parent.last_name, phone: family.data?.parent.phone } });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Parent portal password reset successfully."); setPassword(""); setPasswordOpen(false); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not reset password."),
  });

  const toggleAccount = useMutation({
    mutationFn: async (active: boolean) => {
      if (!hasRole("admin")) throw new Error("Only the Admin can change portal account status.");
      const { error } = await supabase.functions.invoke("set-parent-account-status", { body: { userId: parentId, active } });
      if (error) throw error;
    },
    onSuccess: (_, active) => { toast.success(active ? "Portal account enabled." : "Portal account disabled."); qc.invalidateQueries({ queryKey: ["parent-family", parentId] }); qc.invalidateQueries({ queryKey: ["parents-directory"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not change account status."),
  });

  if (family.isLoading) return <p className="text-sm text-muted-foreground">Loading parent family…</p>;
  if (family.isError) return <EmptyState message={family.error instanceof Error ? family.error.message : "Unable to load parent family."} />;
  const { parent, students, links, family: familyRecord } = family.data;

  return <div>
    <Button variant="ghost" asChild className="mb-2 -ml-3"><Link to="/portal/parents"><ArrowLeft className="mr-2 size-4" />Back to parents</Link></Button>
    <PageHeader title={fullName(parent)} description="Parent / guardian family profile" action={<div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => setPasswordOpen(true)}><KeyRound className="mr-2 size-4" />Reset password</Button>{hasRole("admin") && <Button variant={parent.is_active ? "outline" : "default"} onClick={() => toggleAccount.mutate(!parent.is_active)}>{parent.is_active ? <><ShieldOff className="mr-2 size-4" />Disable portal</> : <><ShieldCheck className="mr-2 size-4" />Enable portal</>}</Button>}</div>} />

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Info title="Phone" value={parent.phone ?? "Not recorded"} />
      <Info title="Email" value={parent.email ?? "Not recorded"} />
      <Info title="Portal" value={parent.is_active ? "Active" : "Disabled"} />
      <Info title="Children" value={String(students.length)} />
    </div>

    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-base"><Users className="size-4" />Children</CardTitle>
          <Button onClick={() => setAddOpen(true)}><Plus className="mr-2 size-4" />Add Child</Button>
        </CardHeader>
        <CardContent>
          {students.length ? (
            <div className="space-y-3">
              {students.map((s: any) => {
                const link = links.find((x) => x.student_id === s.id);
                const className = s.classes?.name
                  ? s.classes.name + (s.classes.section ? " — " + s.classes.section : "")
                  : "Not assigned";
                return (
                  <div key={s.id} className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border bg-muted">
                        <StudentPhotoThumb path={s.photo_url} name={fullName(s)} />
                      </div>
                      <div className="min-w-0">
                        <Link to="/portal/students/$studentId" params={{ studentId: s.id }} className="font-semibold hover:underline">
                          {fullName(s)}
                        </Link>
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                          <span>Admission: {s.admission_no}</span>
                          <span>Class: {className}</span>
                          <span>Relationship: {link?.relationship ?? "parent"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/portal/students/$studentId" params={{ studentId: s.id }}>Student Profile</Link>
                      </Button>
                      <Badge variant={s.status === "active" ? "default" : "secondary"}>{s.status}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState message="No children are linked to this parent yet." />
          )}
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><UserRound className="size-4" />Parent information</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><Row label="Full name" value={fullName(parent)} /><Row label="Phone" value={parent.phone ?? "Not recorded"} /><Row label="Email" value={parent.email ?? "Not recorded"} /><Row label="Portal status" value={parent.is_active ? "Active" : "Disabled"} /><Row label="Account created" value={new Date(parent.created_at).toLocaleDateString("en-KE")} />{familyRecord && <><Separator /><Row label="Family status" value={familyRecord.status} /><Row label="Admission approved" value={new Date(familyRecord.approved_at).toLocaleDateString("en-KE")} /></>}</CardContent></Card>
    </div>

    <Dialog open={addOpen} onOpenChange={setAddOpen}><DialogContent><DialogHeader><DialogTitle>Add another child</DialogTitle><DialogDescription>Add a new learner to {fullName(parent)} or link an existing learner. The parent keeps one portal account.</DialogDescription></DialogHeader><div className="space-y-4"><div className="grid grid-cols-2 gap-2"><Button type="button" variant={childMode === "existing" ? "default" : "outline"} onClick={() => setChildMode("existing")}>Existing student</Button><Button type="button" variant={childMode === "new" ? "default" : "outline"} onClick={() => setChildMode("new")}>New student</Button></div>{childMode === "existing" ? <div className="space-y-2"><Label>Student</Label><Select value={studentId} onValueChange={setStudentId}><SelectTrigger><SelectValue placeholder="Select a student" /></SelectTrigger><SelectContent>{(availableStudents.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.first_name} {s.last_name} — {s.admission_no}</SelectItem>)}</SelectContent></Select>{availableStudents.isLoading && <p className="text-xs text-muted-foreground">Loading students…</p>}</div> : <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>First name</Label><Input value={newChild.firstName} onChange={(e) => setNewChild({ ...newChild, firstName: e.target.value })} /></div><div className="space-y-2"><Label>Last name</Label><Input value={newChild.lastName} onChange={(e) => setNewChild({ ...newChild, lastName: e.target.value })} /></div><div className="space-y-2"><Label>Date of birth</Label><Input type="date" value={newChild.dob} onChange={(e) => setNewChild({ ...newChild, dob: e.target.value })} /></div><div className="space-y-2"><Label>Gender</Label><Select value={newChild.gender} onValueChange={(v) => setNewChild({ ...newChild, gender: v })}><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div><div className="space-y-2 sm:col-span-2"><Label>Class</Label><Select value={newChild.classId} onValueChange={(v) => setNewChild({ ...newChild, classId: v })}><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger><SelectContent>{(classes.data ?? []).map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}{c.section ? ` — ${c.section}` : ""}</SelectItem>)}</SelectContent></Select></div></div>}<div className="space-y-2"><Label>Relationship</Label><Select value={relationship} onValueChange={setRelationship}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="parent">Parent</SelectItem><SelectItem value="guardian">Guardian</SelectItem><SelectItem value="mother">Mother</SelectItem><SelectItem value="father">Father</SelectItem><SelectItem value="sponsor">Sponsor</SelectItem></SelectContent></Select></div></div><DialogFooter><Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={() => addChild.mutate()} disabled={addChild.isPending || (childMode === "existing" ? !studentId : !newChild.firstName || !newChild.lastName)}>{addChild.isPending ? "Saving…" : childMode === "existing" ? "Link child" : "Create & add child"}</Button></DialogFooter></DialogContent></Dialog>
    <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}><DialogContent><DialogHeader><DialogTitle>Reset parent portal password</DialogTitle><DialogDescription>This updates the password for {parent.email ?? "this parent"}. Use at least 8 characters.</DialogDescription></DialogHeader><div className="space-y-2"><Label>New password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter a new password" /></div><DialogFooter><Button variant="outline" onClick={() => setPasswordOpen(false)}>Cancel</Button><Button onClick={() => resetPassword.mutate()} disabled={resetPassword.isPending}>{resetPassword.isPending ? "Updating…" : "Reset password"}</Button></DialogFooter></DialogContent></Dialog>
  </div>;
}
function StudentPhotoThumb({path,name}:{path?:string|null;name:string}){const [url,setUrl]=React.useState<string|null>(null);React.useEffect(()=>{let cancelled=false;if(!path){setUrl(null);return;}supabase.storage.from("student-photos").createSignedUrl(path,3600).then(({data})=>{if(!cancelled)setUrl(data?.signedUrl??null);});return()=>{cancelled=true;};},[path]);return url?<img src={url} alt={`${name} profile`} className="size-full object-cover"/>:<UserRound className="size-6 text-muted-foreground"/>}
function Info({ title, value }: { title: string; value: string }) { return <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-brand text-muted-foreground">{title}</p><p className="mt-1 truncate font-semibold">{value}</p></CardContent></Card>; }
function Row({ label, value }: { label: string; value: string }) { return <div className="flex flex-wrap justify-between gap-2 border-b pb-2"><span className="text-muted-foreground">{label}</span><span className="text-right font-medium">{value}</span></div>; }

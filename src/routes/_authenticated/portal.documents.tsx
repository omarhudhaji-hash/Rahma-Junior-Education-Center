import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Plus, Printer, Search } from "lucide-react";
import { requirePortalRoles } from "@/lib/permissions";
import { supabase } from "@/integrations/supabase/client";
import { fullName } from "@/lib/school";
import { useMe } from "@/hooks/use-auth";
import { PageHeader, EmptyState } from "@/components/portal/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/portal/documents")({
  beforeLoad: async () => {
    await requirePortalRoles(["admin", "headteacher", "parent", "student"]);
  },
  component: DocumentsPage,
});

const types = [
  ["official_letter", "Official Letter"],
  ["admission_letter", "Admission Letter"],
  ["transfer_letter", "Transfer Letter"],
  ["clearance_letter", "Clearance / Exit Letter"],
  ["fee_clearance", "Fee Clearance"],
  ["character_reference", "Character Reference"],
  ["other", "Other"],
] as const;

function printDocument(doc: any, student: any) {
  const win = window.open("", "_blank", "noopener,noreferrer");
  if (!win) return;
  const safe = (value: unknown) => String(value ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] ?? c);
  win.document.write(`<!doctype html><html><head><title>${safe(doc.title)}</title><style>body{font-family:Arial,sans-serif;margin:50px;color:#172554}header{text-align:center;border-bottom:2px solid #172554;padding-bottom:18px;margin-bottom:30px}h1{margin:0;font-size:24px}h2{font-size:20px;margin-top:28px}.meta{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:20px 0;padding:16px;background:#f8fafc}.content{white-space:pre-wrap;line-height:1.7;min-height:260px}.footer{margin-top:60px;display:flex;justify-content:space-between;font-size:12px;color:#64748b}@media print{body{margin:25px}}</style></head><body><header><h1>RAHMA JUNIOR SCHOOL</h1><div>Official School Document</div></header><h2>${safe(doc.title)}</h2><div class="meta"><div><b>Document No.</b><br>${safe(doc.document_no)}</div><div><b>Issue Date</b><br>${new Date(`${doc.issue_date}T00:00:00`).toLocaleDateString("en-KE")}</div><div><b>Student</b><br>${safe(fullName(student))}</div><div><b>Admission No.</b><br>${safe(student?.admission_no ?? "—")}</div></div><div class="content">${safe(doc.content)}</div><div class="footer"><span>Computer generated school document</span><span>${safe(doc.document_no)}</span></div><script>window.onload=()=>window.print()</script></body></html>`);
  win.document.close();
}

function DocumentsPage() {
  const { userId, hasRole, isLeadership } = useMe();
  const qc = useQueryClient();
  const [studentId, setStudentId] = React.useState("");
  const [type, setType] = React.useState("official_letter");
  const [title, setTitle] = React.useState("");
  const [issueDate, setIssueDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [content, setContent] = React.useState("");
  const [search, setSearch] = React.useState("");

  const students = useQuery({
    queryKey: ["document-students", userId, isLeadership, hasRole("parent"), hasRole("student")],
    queryFn: async () => {
      let ids: string[] | null = null;
      if (hasRole("parent")) {
        const { data, error } = await supabase.from("parent_student").select("student_id").eq("parent_id", userId!);
        if (error) throw error;
        ids = (data ?? []).map((x: any) => x.student_id);
      } else if (hasRole("student")) {
        ids = [userId!];
      }
      let q = supabase.from("students").select("id,first_name,last_name,admission_no,current_class_id,classes:current_class_id(name,section)").order("first_name");
      if (ids) {
        if (!ids.length) return [];
        q = q.in("id", ids);
      }
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  React.useEffect(() => {
    if (!studentId && students.data?.length) setStudentId(students.data[0].id);
  }, [students.data, studentId]);

  const documents = useQuery({
    queryKey: ["school-documents", userId, isLeadership, hasRole("parent"), hasRole("student")],
    queryFn: async () => {
      let q: any = supabase.from("school_documents" as any).select("id,student_id,document_type,document_no,title,content,issue_date,status,created_at,students:student_id(id,first_name,last_name,admission_no,current_class_id,classes:current_class_id(name,section))").order("issue_date", { ascending: false }).order("created_at", { ascending: false });
      if (hasRole("parent")) {
        const { data: links, error } = await supabase.from("parent_student").select("student_id").eq("parent_id", userId!);
        if (error) throw error;
        const ids = (links ?? []).map((x: any) => x.student_id);
        if (!ids.length) return [];
        q = q.in("student_id", ids);
      } else if (hasRole("student")) {
        const { data: me, error } = await supabase.from("students").select("id").eq("user_id", userId!).maybeSingle();
        if (error) throw error;
        if (!me) return [];
        q = q.eq("student_id", me.id);
      }
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!studentId || !title.trim() || !content.trim()) throw new Error("Student, title and document content are required.");
      const { data: session } = await supabase.auth.getSession();
      const { data: number, error: numberError } = await (supabase.rpc as any)("next_school_document_no");
      if (numberError) throw numberError;
      const { error } = await (supabase.from("school_documents" as any) as any).insert({ student_id: studentId, document_type: type, document_no: number, title: title.trim(), content: content.trim(), issue_date: issueDate, status: "issued", created_by: session.session?.user.id ?? null });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Document issued successfully"); setTitle(""); setContent(""); qc.invalidateQueries({ queryKey: ["school-documents"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not issue document"),
  });

  const visible = (documents.data ?? []).filter((doc: any) => {
    const text = `${doc.title} ${doc.document_no} ${fullName(doc.students)} ${doc.students?.admission_no ?? ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return <div>
    <PageHeader title="School Documents" description="Official student letters and printable school documents." actions={isLeadership ? <Button onClick={() => document.getElementById("create-document")?.scrollIntoView({ behavior: "smooth" })}><Plus className="mr-2 size-4" />Create document</Button> : null} />

    {isLeadership && <Card id="create-document" className="mb-6"><CardHeader><CardTitle>Issue a school document</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2">
      <div><Label>Student</Label><Select value={studentId} onValueChange={setStudentId}><SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger><SelectContent>{(students.data ?? []).map((s: any) => <SelectItem key={s.id} value={s.id}>{fullName(s)} · {s.admission_no}</SelectItem>)}</SelectContent></Select></div>
      <div><Label>Document type</Label><Select value={type} onValueChange={setType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{types.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div>
      <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Official school letter" /></div>
      <div><Label>Issue date</Label><Input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} /></div>
      <div className="md:col-span-2"><Label>Document content</Label><Textarea className="min-h-44" value={content} onChange={e => setContent(e.target.value)} placeholder="Write the official content of the document..." /></div>
      <div className="md:col-span-2"><Button onClick={() => create.mutate()} disabled={create.isPending}><FileText className="mr-2 size-4" />{create.isPending ? "Issuing…" : "Issue document"}</Button></div>
    </CardContent></Card>}

    <Card><CardHeader className="flex flex-row items-center justify-between gap-3"><CardTitle>Document register</CardTitle><div className="relative w-full max-w-sm"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student, title or document no." /></div></CardHeader><CardContent>{visible.length ? <div className="space-y-3">{visible.map((doc: any) => <div key={doc.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><b>{doc.title}</b><Badge variant={doc.status === "issued" ? "default" : "outline"}>{doc.status}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{fullName(doc.students)} · {doc.students?.admission_no} · {doc.document_no}</p><p className="text-xs text-muted-foreground">Issued {new Date(`${doc.issue_date}T00:00:00`).toLocaleDateString("en-KE")}</p></div><Button variant="outline" onClick={() => printDocument(doc, doc.students)}><Printer className="mr-2 size-4" />Print</Button></div>)}</div> : <EmptyState message="No school documents found." />}</CardContent></Card>
  </div>;
}

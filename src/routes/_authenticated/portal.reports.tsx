import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, ClipboardCheck, Download, FileText, GraduationCap, Package, Printer, Users, Wallet, UserPlus, CalendarDays } from "lucide-react";
import { requirePortalRoles } from "@/lib/permissions";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/portal/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMe } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/portal/reports")({
  beforeLoad: async () => { await requirePortalRoles(["admin", "headteacher"]); },
  component: ReportsPage,
});

const reports = [
  { title: "Student Register", description: "Active learners, admission numbers and class placement.", icon: GraduationCap, href: "/portal/students" },
  { title: "Attendance Report", description: "Review attendance records and identify attendance concerns.", icon: ClipboardCheck, href: "/portal/attendance" },
  { title: "Finance & Balances", description: "Review invoices, payments and outstanding balances.", icon: Wallet, href: "/portal/finance" },
  { title: "Academic Records", description: "Open marks, results and academic performance records.", icon: BarChart3, href: "/portal/academic" },
  { title: "Admissions Report", description: "Track admission workflow and recently admitted learners.", icon: UserPlus, href: "/portal/admissions" },
  { title: "Parent Directory", description: "Family records, children and portal status.", icon: Users, href: "/portal/parents" },
  { title: "Inventory Report", description: "Stock levels and school shop inventory.", icon: Package, href: "/portal/inventory" },
  { title: "School Calendar", description: "Upcoming events, examinations and important dates.", icon: CalendarDays, href: "/portal/calendar" },
];

function ReportsPage() {
  const { isAdmin } = useMe();
  const summary = useQuery({
    queryKey: ["reports-summary"],
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10);
      const [students, parents, teachers, classes, present, invoices, payments, exams] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }),
        supabase.from("admission_families").select("id", { count: "exact", head: true }),
        supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "teacher"),
        supabase.from("classes").select("id", { count: "exact", head: true }),
        supabase.from("attendance_records").select("id", { count: "exact", head: true }).eq("attendance_date", today).eq("status", "present"),
        supabase.from("invoices").select("amount,status"),
        supabase.from("payments").select("amount"),
        (supabase as any).from("exams").select("id", { count: "exact", head: true }).gte("starts_on", today),
      ]);
      const billed = (invoices.data ?? []).reduce((n, x: any) => n + Number(x.amount || 0), 0);
      const paid = (payments.data ?? []).reduce((n, x: any) => n + Number(x.amount || 0), 0);
      return { students: students.count ?? 0, parents: parents.count ?? 0, teachers: teachers.count ?? 0, classes: classes.count ?? 0, present: present.count ?? 0, billed, paid, balance: Math.max(0, billed - paid), exams: exams.count ?? 0 };
    },
  });
  const s = summary.data;
  return <div>
    <PageHeader title="Reports Center" description="A professional reporting hub for school management. Existing modules remain the source of truth; these shortcuts bring the key reports together." actions={<div className="flex gap-2 print:hidden"><Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 size-4"/>Print</Button><Button onClick={() => window.print()}><Download className="mr-2 size-4"/>Export / Save PDF</Button></div>} />
    <Card className="mb-6 overflow-hidden border-primary/20 bg-primary/[0.035]">
      <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="size-5 text-primary"/>Management snapshot</CardTitle><CardDescription>Live figures from the current school records.</CardDescription></CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Students" value={s?.students ?? 0}/><Metric label="Families" value={s?.parents ?? 0}/><Metric label="Teachers" value={s?.teachers ?? 0}/><Metric label="Classes" value={s?.classes ?? 0}/>
        <Metric label="Present today" value={s?.present ?? 0}/><Metric label="Upcoming exams" value={s?.exams ?? 0}/><Metric label="Collected" value={`KSh ${Math.round(s?.paid ?? 0).toLocaleString()}`}/><Metric label="Outstanding" value={`KSh ${Math.round(s?.balance ?? 0).toLocaleString()}`}/>
      </CardContent>
    </Card>
    <div className="mb-4 flex items-center justify-between"><div><h2 className="font-display text-lg font-bold text-navy">Available reports</h2><p className="text-sm text-muted-foreground">Open a module, apply its filters, then print or export the result.</p></div><Badge variant="secondary">{isAdmin ? "Administrator" : "Headteacher"}</Badge></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{reports.map(r => { const Icon = r.icon; return <Card key={r.title} className="group transition hover:-translate-y-0.5 hover:shadow-panel"><CardHeader><div className="mb-2 grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5"/></div><CardTitle className="text-base">{r.title}</CardTitle><CardDescription>{r.description}</CardDescription></CardHeader><CardContent><Button variant="outline" className="w-full" asChild><Link to={r.href as any}><FileText className="mr-2 size-4"/>Open report</Link></Button></CardContent></Card> })}</div>
    <div className="mt-6 rounded-xl border border-dashed p-4 text-sm text-muted-foreground print:hidden"><strong className="text-foreground">Tip:</strong> Use your browser's Print → Save as PDF for a clean client-ready copy of the current report page. Existing module exports remain unchanged.</div>
  </div>;
}
function Metric({ label, value }: { label: string; value: string | number }) { return <div className="rounded-xl border bg-background p-4"><p className="text-[11px] font-bold uppercase tracking-brand text-muted-foreground">{label}</p><p className="mt-1 font-display text-xl font-extrabold text-navy">{value}</p></div>; }

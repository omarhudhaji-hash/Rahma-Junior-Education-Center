import { createFileRoute } from "@tanstack/react-router";
import { requirePortalRoles } from "@/lib/permissions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CreditCard, FilePlus2, Receipt, Search, UsersRound, WalletCards, Printer, FileText } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/portal/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { fullName, money } from "@/lib/school";
import { useMe } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/portal/finance")({
  beforeLoad: async () => { await requirePortalRoles(["admin", "headteacher", "parent", "student"]); },
  component: FinancePage,
});

function FinancePage() {
  const { userId, isAdmin, isLeadership, hasRole } = useMe();
  const family = hasRole("parent") || hasRole("student");
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [section, setSection] = useState<"overview" | "fees" | "payments" | "discounts">("overview");

  const children = useQuery({
    queryKey: ["finance-children", userId], enabled: family,
    queryFn: async () => {
      if (hasRole("parent")) {
        const { data: ps, error: pe } = await supabase.from("parent_student").select("student_id").eq("parent_id", userId!);
        if (pe) throw pe;
        const ids = (ps ?? []).map(x => x.student_id);
        if (!ids.length) return [];
        const { data, error } = await supabase.from("students").select("id,first_name,last_name,admission_no").in("id", ids);
        if (error) throw error;
        return data ?? [];
      }
      const { data, error } = await supabase.from("students").select("id,first_name,last_name,admission_no").eq("user_id", userId!);
      if (error) throw error;
      return data ?? [];
    },
  });

  const schoolFinance = useQuery({
    queryKey: ["finance-school-v2", isAdmin, isLeadership], enabled: !family,
    queryFn: async () => {
      const [{ data: inv, error: ie }, { data: pay, error: pe }, { data: students, error: se }, { data: ps, error: pse }] = await Promise.all([
        supabase.from("invoices").select("id,student_id,invoice_no,amount,base_amount,discount_amount,discount_reason,status,due_date,created_at"),
        supabase.from("payments").select("id,student_id,amount,method,receipt_no,transaction_reference,paid_at"),
        supabase.from("students").select("id,first_name,last_name,admission_no,current_class_id"),
        supabase.from("parent_student").select("parent_id,student_id"),
      ]);
      if (ie || pe || se || pse) throw ie || pe || se || pse;
      const by = new Map<string, any>();
      (students ?? []).forEach(s => by.set(s.id, { ...s, billed: 0, paid: 0, discounts: 0 }));
      (inv ?? []).forEach(i => { const r = by.get(i.student_id); if (r) { r.billed += Number(i.amount); r.discounts += Number(i.discount_amount ?? 0); } });
      (pay ?? []).forEach(p => { const r = by.get(p.student_id); if (r) r.paid += Number(p.amount); });
      const parentMap = new Map<string, string>();
      (ps ?? []).forEach(x => parentMap.set(x.student_id, x.parent_id));
      return {
        rows: [...by.values()].map(r => ({ ...r, balance: Math.max(0, r.billed - r.paid), parent_id: parentMap.get(r.id) })),
        received: (pay ?? []).reduce((x, p) => x + Number(p.amount), 0),
        billed: (inv ?? []).reduce((x, p) => x + Number(p.amount), 0),
        discounts: (inv ?? []).reduce((x, p) => x + Number(p.discount_amount ?? 0), 0),
        invoices: inv ?? [], payments: pay ?? [],
      };
    },
  });

  const mpesaPay = useMutation({
    mutationFn: async ({ studentId, amount, phone }: { studentId: string; amount: number; phone: string }) => {
      const { data, error } = await supabase.functions.invoke("mpesa-stk", { body: { studentId, amount, phone } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => { toast.success("M-Pesa payment request sent. Complete it on your phone."); qc.invalidateQueries({ queryKey: ["finance-children"] }); },
    onError: e => toast.error(e instanceof Error ? e.message : "M-Pesa request failed"),
  });

  if (family) return <FamilyFinance children={children.data ?? []} paying={mpesaPay.isPending} onPay={(studentId, amount, phone) => mpesaPay.mutate({ studentId, amount, phone })} />;

  const filtered = (schoolFinance.data?.rows ?? []).filter((r: any) => {
    const q = search.toLowerCase().trim();
    return !q || `${r.first_name} ${r.last_name} ${r.admission_no}`.toLowerCase().includes(q);
  });

  return <div className="space-y-6">
    <PageHeader title="Finance" description={isAdmin ? "Manage fee structures, family discounts, invoices, payments and receipts." : "View outstanding school fee balances."} />
    {isAdmin && <>
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat title="Total billed" value={money(schoolFinance.data?.billed ?? 0)} icon={WalletCards} />
        <Stat title="Collected" value={money(schoolFinance.data?.received ?? 0)} icon={CreditCard} />
        <Stat title="Outstanding" value={money(Math.max(0, (schoolFinance.data?.billed ?? 0) - (schoolFinance.data?.received ?? 0)))} icon={Receipt} />
        <Stat title="Discounts" value={money(schoolFinance.data?.discounts ?? 0)} icon={UsersRound} />
      </div>
      <div className="flex flex-wrap gap-2">
        {(["overview", "fees", "payments", "discounts"] as const).map(x => <Button key={x} variant={section === x ? "default" : "outline"} onClick={() => setSection(x)}>{x === "overview" ? "Overview" : x === "fees" ? "Fee Structures & Invoices" : x === "payments" ? "Payments & Receipts" : "Family Discounts"}</Button>)}
      </div>
      {section === "fees" && <AdminFees />}
      {section === "payments" && <AdminPayments />}
      {section === "discounts" && <AdminDiscounts />}
    </>}
    {!isAdmin && <Card><CardContent className="p-5"><p className="font-semibold">Headteacher finance view</p><p className="mt-1 text-sm text-muted-foreground">Only outstanding balances are shown. Finance administration and payment recording remain restricted to the Director.</p></CardContent></Card>}
    {(section === "overview" || !isAdmin) && <Card>
      <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Search className="size-4" /> Student balances</CardTitle></CardHeader>
      <CardContent><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student or admission number" />
        <div className="mt-5 space-y-3">{filtered.filter((r: any) => isAdmin || r.balance > 0).map((r: any) => <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"><div><p className="font-semibold">{fullName(r)}</p><p className="text-xs text-muted-foreground">{r.admission_no}</p><p className="mt-1 text-xs">Billed {money(r.billed)} · Paid {money(r.paid)}</p></div><Badge variant={r.balance > 0 ? "destructive" : "secondary"}>{r.balance > 0 ? `Balance ${money(r.balance)}` : "Paid"}</Badge></div>)}{!filtered.length && <EmptyState message="No students found." />}</div>
      </CardContent>
    </Card>}
  </div>;
}

function AdminFees() {
  const qc = useQueryClient();
  const [classId, setClassId] = useState(""); const [item, setItem] = useState(""); const [amount, setAmount] = useState(""); const [term, setTerm] = useState("Term 1"); const [due, setDue] = useState("");
  const [studentId, setStudentId] = useState(""); const [feeId, setFeeId] = useState("");
  const classes = useQuery({ queryKey: ["finance-classes"], queryFn: async () => { const { data, error } = await supabase.from("classes").select("id,name,section").order("name"); if (error) throw error; return data ?? []; } });
  const fees = useQuery({ queryKey: ["fee-structures"], queryFn: async () => { const { data, error } = await supabase.from("fee_structures").select("id,item_name,amount,term,due_date,class_id,classes(name,section)").order("created_at", { ascending: false }); if (error) throw error; return data ?? []; } });
  const students = useQuery({ queryKey: ["finance-students"], queryFn: async () => { const { data, error } = await supabase.from("students").select("id,first_name,last_name,admission_no,current_class_id").order("first_name"); if (error) throw error; return data ?? []; } });
  const createFee = useMutation({ mutationFn: async () => { const { error } = await supabase.from("fee_structures").insert({ class_id: classId || null, item_name: item, amount: Number(amount), term, due_date: due || null }); if (error) throw error; }, onSuccess: () => { toast.success("Fee structure created"); setItem(""); setAmount(""); setDue(""); qc.invalidateQueries({ queryKey: ["fee-structures"] }); }, onError: e => toast.error(e instanceof Error ? e.message : "Could not create fee") });
  const createInvoice = useMutation({ mutationFn: async () => { const f: any = (fees.data ?? []).find((x: any) => x.id === feeId); if (!f) throw new Error("Select a fee structure"); const gross = Number(f.amount); const { data: disc, error: de } = await (supabase.rpc as any)("calculate_family_discount", { _student_id: studentId, _base_amount: gross }); if (de) throw de; const d = Array.isArray(disc) ? disc[0] : disc; const discount = Number(d?.discount_amount ?? 0); const { error } = await supabase.from("invoices").insert({ student_id: studentId, fee_structure_id: feeId, base_amount: gross, discount_amount: discount, discount_reason: d?.discount_reason ?? null, amount: Math.max(0, gross - discount), due_date: f.due_date || null, status: "unpaid" }); if (error) throw error; }, onSuccess: () => { toast.success("Invoice created with applicable family discount"); qc.invalidateQueries({ queryKey: ["finance-school-v2"] }); }, onError: e => toast.error(e instanceof Error ? e.message : "Could not create invoice") });
  return <div className="grid gap-6 xl:grid-cols-2"><Card><CardHeader><CardTitle className="flex items-center gap-2"><FilePlus2 className="size-4" /> Create fee structure</CardTitle></CardHeader><CardContent className="space-y-3"><Select value={classId} onValueChange={setClassId}><SelectTrigger><SelectValue placeholder="Class (optional)" /></SelectTrigger><SelectContent>{(classes.data ?? []).map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}{c.section ? ` — ${c.section}` : ""}</SelectItem>)}</SelectContent></Select><Input placeholder="Fee item e.g. Tuition" value={item} onChange={e => setItem(e.target.value)} /><Select value={term} onValueChange={setTerm}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Term 1", "Term 2", "Term 3"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select><Input type="number" min="0" placeholder="Amount (KSh)" value={amount} onChange={e => setAmount(e.target.value)} /><Input type="date" value={due} onChange={e => setDue(e.target.value)} /><Button className="w-full" disabled={!item || Number(amount) <= 0 || createFee.isPending} onClick={() => createFee.mutate()}>Create fee structure</Button></CardContent></Card>
  <Card><CardHeader><CardTitle>Create student invoice</CardTitle><p className="text-sm text-muted-foreground">Automatic family/sibling discount is calculated when the invoice is created.</p></CardHeader><CardContent className="space-y-3"><Select value={studentId} onValueChange={setStudentId}><SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger><SelectContent>{(students.data ?? []).map((s: any) => <SelectItem key={s.id} value={s.id}>{fullName(s)} · {s.admission_no}</SelectItem>)}</SelectContent></Select><Select value={feeId} onValueChange={setFeeId}><SelectTrigger><SelectValue placeholder="Select fee structure" /></SelectTrigger><SelectContent>{(fees.data ?? []).map((f: any) => <SelectItem key={f.id} value={f.id}>{f.item_name} · {money(f.amount)} · {f.term ?? "No term"}</SelectItem>)}</SelectContent></Select><Button className="w-full" disabled={!studentId || !feeId || createInvoice.isPending} onClick={() => createInvoice.mutate()}>Create invoice & apply discount</Button><div className="border-t pt-4 space-y-2"><p className="font-semibold">Existing fee structures</p>{(fees.data ?? []).slice(0, 8).map((f: any) => <div key={f.id} className="rounded border p-3 text-sm"><b>{f.item_name}</b> · {money(f.amount)} · {f.term ?? ""}<p className="text-xs text-muted-foreground">{f.classes?.name ?? "All classes"}{f.due_date ? ` · Due ${f.due_date}` : ""}</p></div>)}</div></CardContent></Card></div>;
}

function AdminPayments() {
  const qc = useQueryClient(); const [studentId, setStudentId] = useState(""); const [amount, setAmount] = useState(""); const [method, setMethod] = useState("cash"); const [reference, setReference] = useState("");
  const students = useQuery({ queryKey: ["finance-students-payments"], queryFn: async () => { const { data, error } = await supabase.from("students").select("id,first_name,last_name,admission_no").order("first_name"); if (error) throw error; return data ?? []; } });
  const payments = useQuery({ queryKey: ["finance-payments"], queryFn: async () => { const { data, error } = await supabase.from("payments").select("id,student_id,amount,method,receipt_no,transaction_reference,paid_at,students(first_name,last_name,admission_no,current_class_id)").order("paid_at", { ascending: false }).limit(30); if (error) throw error; return data ?? []; } });
  const invoices = useQuery({ queryKey: ["finance-invoices-receipts"], queryFn: async () => { const { data, error } = await supabase.from("invoices").select("id,student_id,invoice_no,amount,base_amount,discount_amount,discount_reason,status,due_date,created_at,fee_structure_id,fee_structures(item_name,term)").order("created_at", { ascending: false }).limit(100); if (error) throw error; return data ?? []; } });
  const addPayment = useMutation({ mutationFn: async () => { const { data: session } = await supabase.auth.getSession(); const { error } = await supabase.from("payments").insert({ student_id: studentId, amount: Number(amount), method, transaction_reference: reference || null, received_by: session.session?.user.id ?? null }); if (error) throw error; }, onSuccess: () => { toast.success("Payment recorded and receipt generated"); setAmount(""); setReference(""); qc.invalidateQueries({ queryKey: ["finance-payments"] }); qc.invalidateQueries({ queryKey: ["finance-school-v2"] }); }, onError: e => toast.error(e instanceof Error ? e.message : "Could not record payment") });
  return <div className="grid gap-6 xl:grid-cols-2"><Card><CardHeader><CardTitle>Record payment</CardTitle></CardHeader><CardContent className="space-y-3"><Select value={studentId} onValueChange={setStudentId}><SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger><SelectContent>{(students.data ?? []).map((s: any) => <SelectItem key={s.id} value={s.id}>{fullName(s)} · {s.admission_no}</SelectItem>)}</SelectContent></Select><Input type="number" min="1" placeholder="Amount (KSh)" value={amount} onChange={e => setAmount(e.target.value)} /><Select value={method} onValueChange={setMethod}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["cash", "mpesa", "bank", "card", "other"].map(m => <SelectItem key={m} value={m}>{m.toUpperCase()}</SelectItem>)}</SelectContent></Select><Input placeholder="Transaction/reference number (optional)" value={reference} onChange={e => setReference(e.target.value)} /><Button className="w-full" disabled={!studentId || Number(amount) <= 0 || addPayment.isPending} onClick={() => addPayment.mutate()}><Receipt className="mr-2 size-4" />Record payment</Button><p className="text-xs text-muted-foreground">A unique receipt number is generated automatically by Supabase.</p></CardContent></Card><Card><CardHeader><CardTitle>Recent payments</CardTitle></CardHeader><CardContent className="space-y-2">{(payments.data ?? []).map((p: any) => <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded border p-3 text-sm"><div><b>{fullName(p.students)}</b><p className="text-xs text-muted-foreground">{p.receipt_no} · {p.method} · {p.transaction_reference ?? "No reference"}</p></div><div className="flex items-center gap-3"><div className="text-right"><b>{money(p.amount)}</b><p className="text-xs text-muted-foreground">{new Date(p.paid_at).toLocaleDateString()}</p></div><Button variant="outline" size="sm" onClick={() => printReceipt(p, invoices.data ?? [])}><Printer className="mr-2 size-4" />Receipt</Button></div></div>)}{!payments.data?.length && <EmptyState message="No payments recorded yet." />}</CardContent></Card></div>;
}

function AdminDiscounts() {
  const qc = useQueryClient(); const [name, setName] = useState(""); const [minChildren, setMinChildren] = useState("2"); const [percent, setPercent] = useState(""); const [parentId, setParentId] = useState(""); const [studentId, setStudentId] = useState(""); const [type, setType] = useState("percent"); const [value, setValue] = useState(""); const [reason, setReason] = useState("");
  const parents = useQuery({ queryKey: ["finance-parents"], queryFn: async () => { const { data: ps, error: pe } = await supabase.from("parent_student").select("parent_id"); if (pe) throw pe; const ids = [...new Set((ps ?? []).map(x => x.parent_id))]; if (!ids.length) return []; const { data, error } = await supabase.from("profiles").select("id,first_name,last_name,email,phone").in("id", ids); if (error) throw error; return data ?? []; } });
  const students = useQuery({ queryKey: ["finance-students-discounts"], queryFn: async () => { const { data, error } = await supabase.from("students").select("id,first_name,last_name,admission_no").order("first_name"); if (error) throw error; return data ?? []; } });
  const rules = useQuery({ queryKey: ["discount-rules"], queryFn: async () => { const { data, error } = await supabase.from("family_discount_rules").select("*").order("min_children", { ascending: false }); if (error) throw error; return data ?? []; } });
  const discounts = useQuery({ queryKey: ["family-discounts"], queryFn: async () => { const { data, error } = await supabase.from("family_discounts").select("*").order("created_at", { ascending: false }).limit(30); if (error) throw error; return data ?? []; } });
  const createRule = useMutation({ mutationFn: async () => { const { data: session } = await supabase.auth.getSession(); const { error } = await supabase.from("family_discount_rules").insert({ name, min_children: Number(minChildren), discount_percent: Number(percent), created_by: session.session?.user.id ?? null }); if (error) throw error; }, onSuccess: () => { toast.success("Automatic family discount rule saved"); setName(""); setPercent(""); qc.invalidateQueries({ queryKey: ["discount-rules"] }); }, onError: e => toast.error(e instanceof Error ? e.message : "Could not save rule") });
  const createManual = useMutation({ mutationFn: async () => { const { data: session } = await supabase.auth.getSession(); const { error } = await supabase.from("family_discounts").insert({ parent_id: parentId, student_id: (studentId && studentId !== "all") ? studentId : null, discount_type: type, value: Number(value), reason, approved_by: session.session?.user.id ?? null }); if (error) throw error; }, onSuccess: () => { toast.success("Manual family discount saved"); setValue(""); setReason(""); qc.invalidateQueries({ queryKey: ["family-discounts"] }); }, onError: e => toast.error(e instanceof Error ? e.message : "Could not save discount") });
  return <div className="space-y-6"><div className="grid gap-6 xl:grid-cols-2"><Card><CardHeader><CardTitle>Automatic sibling discount</CardTitle><p className="text-sm text-muted-foreground">The highest matching active rule is applied automatically when an invoice is created.</p></CardHeader><CardContent className="space-y-3"><Input placeholder="Rule name e.g. 3 children discount" value={name} onChange={e => setName(e.target.value)} /><Input type="number" min="2" value={minChildren} onChange={e => setMinChildren(e.target.value)} placeholder="Minimum active children" /><Input type="number" min="0" max="100" value={percent} onChange={e => setPercent(e.target.value)} placeholder="Discount percentage" /><Button className="w-full" disabled={!name || Number(percent) <= 0 || createRule.isPending} onClick={() => createRule.mutate()}>Save automatic rule</Button><div className="border-t pt-3 space-y-2">{(rules.data ?? []).map((r: any) => <div key={r.id} className="rounded border p-3 text-sm"><b>{r.name}</b> · {r.discount_percent}%<p className="text-xs text-muted-foreground">{r.min_children}+ children · {r.is_active ? "Active" : "Inactive"}</p></div>)}</div></CardContent></Card>
  <Card><CardHeader><CardTitle>Manual family/student discount</CardTitle><p className="text-sm text-muted-foreground">Use for scholarships, special arrangements or other approved discounts.</p></CardHeader><CardContent className="space-y-3"><Select value={parentId} onValueChange={setParentId}><SelectTrigger><SelectValue placeholder="Parent / family" /></SelectTrigger><SelectContent>{(parents.data ?? []).map((p: any) => <SelectItem key={p.id} value={p.id}>{fullName(p)} · {p.phone ?? p.email ?? ""}</SelectItem>)}</SelectContent></Select><Select value={studentId} onValueChange={setStudentId}><SelectTrigger><SelectValue placeholder="Apply to all children (or select one)" /></SelectTrigger><SelectContent><SelectItem value="all">All children</SelectItem>{(students.data ?? []).map((s: any) => <SelectItem key={s.id} value={s.id}>{fullName(s)} · {s.admission_no}</SelectItem>)}</SelectContent></Select><Select value={type} onValueChange={setType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="percent">Percentage</SelectItem><SelectItem value="fixed">Fixed amount</SelectItem></SelectContent></Select><Input type="number" min="0" value={value} onChange={e => setValue(e.target.value)} placeholder={type === "percent" ? "Discount %" : "Discount amount (KSh)"} /><Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason / approval note" /><Button className="w-full" disabled={!parentId || !reason || Number(value) <= 0 || createManual.isPending} onClick={() => createManual.mutate()}>Save manual discount</Button></CardContent></Card></div><Card><CardHeader><CardTitle>Discount audit trail</CardTitle></CardHeader><CardContent className="space-y-2">{(discounts.data ?? []).map((d: any) => <div key={d.id} className="rounded border p-3 text-sm"><b>{d.discount_type === "percent" ? `${d.value}%` : money(d.value)}</b> · {d.reason}<p className="text-xs text-muted-foreground">Created {new Date(d.created_at).toLocaleString()}</p></div>)}{!discounts.data?.length && <EmptyState message="No manual discounts recorded yet." />}</CardContent></Card></div>;
}

function FamilyFinance({ children, paying, onPay }: { children: any[]; paying: boolean; onPay: (id: string, amount: number, phone: string) => void }) {
  const [amounts, setAmounts] = useState<Record<string, string>>({}); const [phone, setPhone] = useState(""); const [selected, setSelected] = useState("");
  const details = useQuery({ queryKey: ["family-finance-details-v2", children.map(c => c.id).join(",")], enabled: children.length > 0, queryFn: async () => { const ids = children.map(c => c.id); const [{ data: inv }, { data: pay }] = await Promise.all([supabase.from("invoices").select("student_id,invoice_no,amount,base_amount,discount_amount,discount_reason,status,due_date").in("student_id", ids), supabase.from("payments").select("student_id,receipt_no,amount,method,transaction_reference,paid_at").in("student_id", ids).order("paid_at", { ascending: false })]); return children.map(c => ({ ...c, invoices: (inv ?? []).filter(i => i.student_id === c.id), payments: (pay ?? []).filter(p => p.student_id === c.id), billed: (inv ?? []).filter(i => i.student_id === c.id).reduce((s, i) => s + Number(i.amount), 0), discounts: (inv ?? []).filter(i => i.student_id === c.id).reduce((s, i) => s + Number(i.discount_amount ?? 0), 0), paid: (pay ?? []).filter(p => p.student_id === c.id).reduce((s, p) => s + Number(p.amount), 0) })); } });
  const familyTotals = useMemo(() => { const rows = details.data ?? []; return { billed: rows.reduce((s: number, x: any) => s + x.billed, 0), paid: rows.reduce((s: number, x: any) => s + x.paid, 0), discounts: rows.reduce((s: number, x: any) => s + x.discounts, 0) }; }, [details.data]);
  return <div className="space-y-6"><PageHeader title="My Finance" description="Family fees, discounts, balances, receipts and M-Pesa payments." /><Card><CardContent className="flex flex-wrap items-center justify-between gap-4 p-5"><div className="grid flex-1 gap-4 sm:grid-cols-3"><div><p className="text-xs text-muted-foreground">Family billed</p><b>{money(familyTotals.billed)}</b></div><div><p className="text-xs text-muted-foreground">Family discounts</p><b>{money(familyTotals.discounts)}</b></div><div><p className="text-xs text-muted-foreground">Family paid</p><b>{money(familyTotals.paid)}</b></div></div><Button variant="outline" onClick={() => printFamilyStatement(details.data ?? [])}><FileText className="mr-2 size-4" />Print family statement</Button></CardContent></Card><div className="grid gap-4 md:grid-cols-2">{(details.data ?? []).map((c: any) => { const bal = Math.max(0, c.billed - c.paid); return <Card key={c.id}><CardHeader><CardTitle>{fullName(c)}</CardTitle><p className="text-sm text-muted-foreground">{c.admission_no}</p></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-3 gap-2 text-sm"><div><p className="text-xs text-muted-foreground">Due</p><b>{money(c.billed)}</b></div><div><p className="text-xs text-muted-foreground">Discounts</p><b>{money(c.discounts)}</b></div><div><p className="text-xs text-muted-foreground">Balance</p><b className="text-destructive">{money(bal)}</b></div></div><div className="space-y-2"><p className="font-semibold text-sm">Fee statement</p>{c.invoices.map((i: any) => <div key={i.invoice_no} className="rounded border p-3 text-sm"><div className="flex flex-wrap items-center justify-between gap-2"><span>{i.invoice_no}</span><div className="flex items-center gap-2"><b>{money(i.amount)}</b><Button variant="ghost" size="sm" onClick={() => printStatement(c, [i], c.payments)}><Printer className="mr-1 size-4" />Print</Button></div></div>{Number(i.discount_amount) > 0 && <p className="text-xs text-muted-foreground">Original {money(i.base_amount)} · Discount {money(i.discount_amount)}{i.discount_reason ? ` · ${i.discount_reason}` : ""}</p>}</div>)}</div>{bal > 0 && <div className="space-y-3 border-t pt-4"><Label>Pay with M-Pesa</Label><Input type="number" min="1" max={bal} value={amounts[c.id] ?? ""} onChange={e => setAmounts(a => ({ ...a, [c.id]: e.target.value }))} placeholder={`Amount up to ${money(bal)}`} /><Input inputMode="tel" value={selected === c.id ? phone : ""} onChange={e => { setSelected(c.id); setPhone(e.target.value); }} placeholder="M-Pesa phone e.g. 0712345678" /><Button className="w-full" disabled={paying || Number(amounts[c.id] ?? 0) <= 0 || Number(amounts[c.id] ?? 0) > bal} onClick={() => onPay(c.id, Number(amounts[c.id]), phone)}><CreditCard className="mr-2 size-4" />{paying ? "Requesting…" : "Pay with M-Pesa"}</Button></div>}{c.payments.length > 0 && <div className="border-t pt-4"><p className="font-semibold text-sm">Recent receipts</p>{c.payments.slice(0, 5).map((p: any) => <div key={p.receipt_no} className="mt-2 flex justify-between rounded border p-2 text-xs"><span>{p.receipt_no} · {p.method}</span><b>{money(p.amount)}</b></div>)}</div>}</CardContent></Card>; })}{!details.data?.length && <EmptyState message="No linked children found." />}</div></div>;
}


function printWindow(title: string, body: string) {
  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) { toast.error("Please allow pop-ups to print the document."); return; }
  w.document.write(`<!doctype html><html><head><title>${title}</title><style>
  body{font-family:Arial,Helvetica,sans-serif;color:#172033;margin:0;padding:32px;background:#fff} .sheet{max-width:820px;margin:auto}
  .brand{border-bottom:3px solid #172033;padding-bottom:16px;margin-bottom:24px}.brand h1{margin:0;font-size:25px}.brand p{margin:5px 0;color:#667085;font-size:12px}
  h2{margin:0 0 6px}.meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:18px 0 24px}.meta div{padding:10px;background:#f5f7fa;border-radius:6px;font-size:13px}
  table{width:100%;border-collapse:collapse;margin-top:16px}th,td{border-bottom:1px solid #dfe3e8;padding:10px 8px;text-align:left;font-size:13px}th{background:#f5f7fa}
  .num{text-align:right}.totals{margin:22px 0 0 auto;width:320px}.row{display:flex;justify-content:space-between;padding:7px 0}.grand{border-top:2px solid #172033;font-size:17px;font-weight:700;margin-top:6px;padding-top:10px}
  .note{margin-top:20px;padding:12px;background:#f8fafc;border-left:3px solid #172033;font-size:12px}.footer{margin-top:50px;display:flex;justify-content:space-between;font-size:11px;color:#667085}.sign{border-top:1px solid #555;width:220px;padding-top:7px;margin-top:45px}
  @media print{body{padding:0}.no-print{display:none!important}}
  </style></head><body><div class="sheet">${body}</div><script>window.onload=()=>{setTimeout(()=>window.print(),250)}</script></body></html>`);
  w.document.close();
}

function printStatement(student: any, invoices: any[], payments: any[]) {
  const gross = invoices.reduce((s, i) => s + Number(i.base_amount ?? i.amount ?? 0), 0);
  const discounts = invoices.reduce((s, i) => s + Number(i.discount_amount ?? 0), 0);
  const billed = invoices.reduce((s, i) => s + Number(i.amount ?? 0), 0);
  const paid = payments.reduce((s, p) => s + Number(p.amount ?? 0), 0);
  const balance = Math.max(0, billed - paid);
  const rows = invoices.map(i => `<tr><td>${i.invoice_no}</td><td>${i.fee_structures?.item_name ?? "School fees"}</td><td>${i.fee_structures?.term ?? ""}</td><td>${i.due_date ?? "—"}</td><td class="num">${money(i.base_amount ?? i.amount)}</td><td class="num">${money(i.discount_amount ?? 0)}</td><td class="num">${money(i.amount)}</td></tr>`).join("");
  const pays = payments.map(p => `<tr><td>${new Date(p.paid_at).toLocaleDateString()}</td><td>${p.receipt_no}</td><td>${String(p.method).toUpperCase()}</td><td>${p.transaction_reference ?? "—"}</td><td class="num">${money(p.amount)}</td></tr>`).join("");
  printWindow("Fee Statement", `<div class="brand"><h1>${school.name.toUpperCase()}</h1><p>OFFICIAL FEE STATEMENT</p></div><h2>Fee Statement</h2><div class="meta"><div><b>Student</b><br>${fullName(student)}</div><div><b>Admission No.</b><br>${student.admission_no ?? "—"}</div><div><b>Statement Date</b><br>${new Date().toLocaleDateString()}</div><div><b>Status</b><br>${balance > 0 ? "Outstanding balance" : "Paid in full"}</div></div><table><thead><tr><th>Invoice</th><th>Fee item</th><th>Term</th><th>Due</th><th class="num">Original</th><th class="num">Discount</th><th class="num">Charged</th></tr></thead><tbody>${rows || '<tr><td colspan="7">No invoices</td></tr>'}</tbody></table><div class="totals"><div class="row"><span>Original fees</span><b>${money(gross)}</b></div><div class="row"><span>Total discounts</span><b>${money(discounts)}</b></div><div class="row"><span>Total charged</span><b>${money(billed)}</b></div><div class="row"><span>Total paid</span><b>${money(paid)}</b></div><div class="row grand"><span>Balance</span><span>${money(balance)}</span></div></div><h3 style="margin-top:34px">Payment history</h3><table><thead><tr><th>Date</th><th>Receipt</th><th>Method</th><th>Reference</th><th class="num">Amount</th></tr></thead><tbody>${pays || '<tr><td colspan="5">No payments recorded</td></tr>'}</tbody></table><div class="footer"><span>Generated ${new Date().toLocaleString()}</span><span>This statement is computer generated.</span></div>`);
}

function printFamilyStatement(families: any[]) {
  const allInvoices = families.flatMap(c => c.invoices ?? []);
  const allPayments = families.flatMap(c => c.payments ?? []);
  const gross = allInvoices.reduce((s, i) => s + Number(i.base_amount ?? i.amount ?? 0), 0);
  const discounts = allInvoices.reduce((s, i) => s + Number(i.discount_amount ?? 0), 0);
  const billed = allInvoices.reduce((s, i) => s + Number(i.amount ?? 0), 0);
  const paid = allPayments.reduce((s, p) => s + Number(p.amount ?? 0), 0);
  const rows = families.flatMap(c => (c.invoices ?? []).map((i: any) => `<tr><td>${fullName(c)}</td><td>${i.invoice_no}</td><td>${i.fee_structures?.item_name ?? "School fees"}</td><td class="num">${money(i.amount)}</td></tr>`)).join("");
  printWindow("Family Fee Statement", `<div class="brand"><h1>${school.name.toUpperCase()}</h1><p>OFFICIAL FAMILY FEE STATEMENT</p></div><h2>Family Fee Statement</h2><div class="meta"><div><b>Children</b><br>${families.length}</div><div><b>Statement Date</b><br>${new Date().toLocaleDateString()}</div></div><table><thead><tr><th>Student</th><th>Invoice</th><th>Fee item</th><th class="num">Charged</th></tr></thead><tbody>${rows || '<tr><td colspan="4">No invoices</td></tr>'}</tbody></table><div class="totals"><div class="row"><span>Original fees</span><b>${money(gross)}</b></div><div class="row"><span>Total discounts</span><b>${money(discounts)}</b></div><div class="row"><span>Total charged</span><b>${money(billed)}</b></div><div class="row"><span>Total paid</span><b>${money(paid)}</b></div><div class="row grand"><span>Family balance</span><span>${money(Math.max(0,billed-paid))}</span></div></div><div class="footer"><span>Generated ${new Date().toLocaleString()}</span><span>This statement is computer generated.</span></div>`);
}

function printReceipt(payment: any, invoices: any[]) {
  const student = payment.students ?? {};
  const related = invoices.filter(i => i.student_id === payment.student_id);
  const billed = related.reduce((s, i) => s + Number(i.amount ?? 0), 0);
  const paidBefore = Math.max(0, related.length ? billed : 0);
  const body = `<div class="brand"><h1>${school.name.toUpperCase()}</h1><p>OFFICIAL PAYMENT RECEIPT</p></div><div class="meta"><div><b>Receipt No.</b><br>${payment.receipt_no}</div><div><b>Payment Date</b><br>${new Date(payment.paid_at).toLocaleString()}</div><div><b>Student</b><br>${fullName(student)}</div><div><b>Admission No.</b><br>${student.admission_no ?? "—"}</div></div><table><tbody><tr><th>Payment method</th><td>${String(payment.method).toUpperCase()}</td></tr><tr><th>Transaction / Reference</th><td>${payment.transaction_reference ?? "—"}</td></tr><tr><th>Amount received</th><td class="num"><b>${money(payment.amount)}</b></td></tr></tbody></table><div class="note">Payment received and recorded in the school finance system. Please retain this receipt for your records.</div><div class="footer"><div class="sign">Authorized by</div><div>Receipt No. ${payment.receipt_no}</div></div>`;
  printWindow(`Receipt ${payment.receipt_no}`, body);
}

function Stat({ title, value, icon: Icon }: { title: string; value: string; icon: any }) { return <Card><CardContent className="p-5"><div className="flex items-center gap-2"><Icon className="size-4 text-primary" /><p className="text-xs uppercase tracking-brand text-muted-foreground">{title}</p></div><p className="mt-1 text-xl font-extrabold text-navy">{value}</p></CardContent></Card>; }

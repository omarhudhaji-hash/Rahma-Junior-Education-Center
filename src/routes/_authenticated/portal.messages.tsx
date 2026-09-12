import { createFileRoute } from "@tanstack/react-router";
import { requirePortalRoles } from "@/lib/permissions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { MessageSquare, Send, Smartphone, Users, History, FileText, Settings, ShieldCheck } from "lucide-react";

import { EmptyState, PageHeader } from "@/components/portal/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMe } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { fullName } from "@/lib/school";

export const Route = createFileRoute("/_authenticated/portal/messages")({
  head: () => ({ meta: [{ title: "Messages & SMS | Rahma Junior portal" }, { name: "robots", content: "noindex" }] }),
  beforeLoad: async () => { await requirePortalRoles(['admin', 'headteacher', 'teacher', 'parent', 'student']); },
  component: MessagesPage,
});

type Person = { id: string; first_name: string; last_name: string; phone: string | null; roles: string[] };
type MessageRow = {
  id: string; subject: string | null; body: string; read_at: string | null; created_at: string;
  sender_id: string; recipient_id: string;
  sender: { first_name: string; last_name: string } | null;
  recipient: { first_name: string; last_name: string } | null;
};
type SmsRow = {
  id: string; created_at: string; recipient_phone: string; recipient_name: string | null;
  message: string; status: string; provider_cost: string | null; error_message: string | null;
};

function MessagesPage() {
  const { userId, hasRole } = useMe();
  const leadership = hasRole("admin") || hasRole("headteacher");
  const teacher = hasRole("teacher");
  const family = hasRole("parent") || hasRole("student");
  const queryClient = useQueryClient();
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [smsAudience, setSmsAudience] = useState("parents");
  const [smsRecipients, setSmsRecipients] = useState<string[]>([]);
  const [smsMessage, setSmsMessage] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateMessage, setTemplateMessage] = useState("");
  const [smsSettings, setSmsSettings] = useState<any>(null);

  const people = useQuery({
    queryKey: ["message-people"],
    queryFn: async () => {
      const [{ data: profiles, error }, { data: roleRows, error: roleError }] = await Promise.all([
        supabase.from("profiles").select("id,first_name,last_name,phone").eq("is_active", true).order("first_name"),
        supabase.from("user_roles").select("user_id,role"),
      ]);
      if (error) throw error;
      if (roleError) throw roleError;
      const roles = new Map<string, string[]>();
      for (const row of roleRows ?? []) roles.set(row.user_id, [...(roles.get(row.user_id) ?? []), row.role]);
      return (profiles ?? [])
        .filter((p) => p.id !== userId)
        .map((p) => ({ ...p, roles: roles.get(p.id) ?? [] }))
        .filter((p) => {
          if (leadership) return true;
          if (teacher) return p.roles.includes("admin") || p.roles.includes("headteacher") || p.roles.includes("parent");
          if (family) return p.roles.includes("admin") || p.roles.includes("headteacher") || p.roles.includes("teacher");
          return false;
        }) as Person[];
    },
    enabled: Boolean(userId),
  });

  const messages = useQuery({
    queryKey: ["messages", userId], enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase.from("messages").select("id,subject,body,read_at,created_at,sender_id,recipient_id,sender:sender_id(first_name,last_name),recipient:recipient_id(first_name,last_name)").order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      return (data ?? []) as unknown as MessageRow[];
    },
  });

  const smsHistory = useQuery({
    queryKey: ["sms-history"], enabled: leadership,
    queryFn: async () => {
      const { data, error } = await supabase.from("sms_messages").select("id,created_at,recipient_phone,recipient_name,message,status,provider_cost,error_message").order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      return (data ?? []) as SmsRow[];
    },
  });

  const smsSettingsQuery = useQuery({
    queryKey: ["sms-settings"], enabled: leadership,
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("sms_settings").select("*").eq("id", true).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const saveSmsSettings = useMutation({
    mutationFn: async (next: any) => {
      const { error } = await (supabase as any).from("sms_settings").upsert({ ...next, id: true, updated_by: userId, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("SMS settings saved"); queryClient.invalidateQueries({ queryKey: ["sms-settings"] }); },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not save SMS settings"),
  });

  const templates = useQuery({
    queryKey: ["sms-templates"], enabled: leadership,
    queryFn: async () => {
      const { data, error } = await supabase.from("sms_templates").select("id,name,message,is_active").eq("is_active", true).order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const send = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("messages").insert({ sender_id: userId!, recipient_id: recipient, subject: subject.trim() || null, body: body.trim() });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Message sent"); setSubject(""); setBody(""); setRecipient(""); queryClient.invalidateQueries({ queryKey: ["messages"] }); },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not send message"),
  });

  const audiencePeople = useMemo(() => {
    const all = people.data ?? [];
    if (smsAudience === "parents") return all.filter((p) => p.roles.includes("parent") && p.phone);
    if (smsAudience === "teachers") return all.filter((p) => (p.roles.includes("teacher") || p.roles.includes("headteacher")) && p.phone);
    if (smsAudience === "staff") return all.filter((p) => (p.roles.includes("teacher") || p.roles.includes("headteacher") || p.roles.includes("admin")) && p.phone);
    return all.filter((p) => p.phone);
  }, [people.data, smsAudience]);

  const sendSms = useMutation({
    mutationFn: async () => {
      const selected = audiencePeople.filter((p) => smsRecipients.includes(p.id));
      if (!selected.length) throw new Error("Select at least one recipient.");
      if (smsSettingsQuery.data && !smsSettingsQuery.data.sms_enabled) throw new Error("SMS sending is disabled in SMS Settings.");
      if (selected.length > 1 && !window.confirm(`Send this SMS to ${selected.length} recipients? This may incur provider charges.`)) throw new Error("SMS sending cancelled.");
      if (!smsMessage.trim()) throw new Error("Enter an SMS message.");
      const { data, error } = await supabase.functions.invoke("send-sms", {
        body: { message: smsMessage.trim(), automationKey: "manual", recipients: selected.map((p) => ({ userId: p.id, phone: p.phone, name: fullName(p) })) },
      });
      if (error) throw error;
      if (data?.failed && !data?.sent) throw new Error(data?.error ?? "The SMS provider rejected the message.");
      return data;
    },
    onSuccess: (data) => {
      toast.success(`${data?.sent ?? 0} SMS sent${data?.failed ? `, ${data.failed} failed` : ""}.`);
      setSmsRecipients([]); setSmsMessage("");
      queryClient.invalidateQueries({ queryKey: ["sms-history"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not send SMS"),
  });

  const saveTemplate = useMutation({
    mutationFn: async () => {
      if (!templateName.trim() || !templateMessage.trim()) throw new Error("Template name and message are required.");
      const { error } = await supabase.from("sms_templates").insert({ created_by: userId!, name: templateName.trim(), message: templateMessage.trim() });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Template saved"); setTemplateName(""); setTemplateMessage(""); queryClient.invalidateQueries({ queryKey: ["sms-templates"] }); },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not save template"),
  });

  const all = messages.data ?? [];
  const inbox = all.filter((m) => m.recipient_id === userId);
  const sent = all.filter((m) => m.sender_id === userId);

  function renderList(rows: MessageRow[], mode: "inbox" | "sent") {
    if (messages.isLoading) return <EmptyState message="Loading messages…" />;
    if (!rows.length) return <EmptyState message={mode === "inbox" ? "Your inbox is empty." : "You have not sent any messages."} />;
    return <div className="space-y-3">{rows.map((m) => <Card key={m.id}><CardContent className="p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-semibold text-navy">{mode === "inbox" ? `From ${fullName(m.sender) || "School"}` : `To ${fullName(m.recipient) || "Recipient"}`}</p><span className="text-[11px] uppercase tracking-brand text-muted-foreground">{new Date(m.created_at).toLocaleString()}</span></div>{m.subject && <p className="mt-1 text-sm font-medium">{m.subject}</p>}<p className="mt-2 whitespace-pre-line text-sm text-foreground/80">{m.body}</p></CardContent></Card>)}</div>;
  }

  return (
    <div>
      <PageHeader title="Messages & SMS" description="Private school messages and leadership SMS communication." />
      <Tabs defaultValue="messages">
        <TabsList className="mb-6"><TabsTrigger value="messages"><MessageSquare className="mr-2 size-4" />Messages</TabsTrigger>{leadership && <TabsTrigger value="sms"><Smartphone className="mr-2 size-4" />SMS Center</TabsTrigger>}{leadership && <TabsTrigger value="sms-settings"><Settings className="mr-2 size-4" />SMS Settings</TabsTrigger>}</TabsList>
        <TabsContent value="messages">
          <div className={leadership ? "grid gap-6 lg:grid-cols-[1fr_20rem]" : "max-w-3xl"}>
            <Tabs defaultValue={teacher ? "sent" : "inbox"}>
              <TabsList>{!teacher && <TabsTrigger value="inbox">Inbox ({inbox.length})</TabsTrigger>}<TabsTrigger value="sent">Sent ({sent.length})</TabsTrigger></TabsList>
              {!teacher && <TabsContent value="inbox" className="mt-4">{renderList(inbox, "inbox")}</TabsContent>}
              <TabsContent value="sent" className="mt-4">{renderList(sent, "sent")}</TabsContent>
            </Tabs>
            {leadership && <Card className="h-fit"><CardHeader><CardTitle className="text-base">New message</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label>Recipient</Label><Select value={recipient} onValueChange={setRecipient}><SelectTrigger><SelectValue placeholder="Choose a person" /></SelectTrigger><SelectContent>{(people.data ?? []).map((p) => <SelectItem key={p.id} value={p.id}>{fullName(p) || "Unnamed"}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Optional" /></div><div className="space-y-2"><Label>Message</Label><Textarea rows={6} value={body} onChange={(e) => setBody(e.target.value)} /></div><Button className="w-full" disabled={!recipient || !body.trim() || send.isPending} onClick={() => send.mutate()}>{send.isPending ? "Sending…" : "Send message"}</Button></CardContent></Card>}
          </div>
        </TabsContent>
        {leadership && <TabsContent value="sms"><SmsCenter audience={smsAudience} setAudience={setSmsAudience} recipients={smsRecipients} setRecipients={setSmsRecipients} message={smsMessage} setMessage={setSmsMessage} people={audiencePeople} templates={templates.data ?? []} history={smsHistory.data ?? []} onSend={() => sendSms.mutate()} sending={sendSms.isPending} templateName={templateName} setTemplateName={setTemplateName} templateMessage={templateMessage} setTemplateMessage={setTemplateMessage} onSaveTemplate={() => saveTemplate.mutate()} savingTemplate={saveTemplate.isPending} /></TabsContent>}
        {leadership && <TabsContent value="sms-settings"><SmsSettings settings={smsSettingsQuery.data} onSave={(v:any) => saveSmsSettings.mutate(v)} saving={saveSmsSettings.isPending} /></TabsContent>}
      </Tabs>
    </div>
  );
}

function SmsSettings({ settings, onSave, saving }: { settings: any; onSave: (v: any) => void; saving: boolean }) {
  const [local, setLocal] = useState<any>(settings ?? { sms_enabled: false, fee_payment_sms: true, fee_reminder_sms: false, absence_sms: false, exam_reminder_sms: false, result_sms: false, announcement_sms: true, provider: "africas_talking", sender_id: "" });
  useEffect(() => { if (settings) setLocal(settings); }, [settings]);
  const toggle = (key: string) => setLocal((x:any) => ({ ...x, [key]: !x[key] }));
  const items = [
    ["fee_payment_sms", "Fee payment confirmations"], ["fee_reminder_sms", "Fee balance/reminder SMS"], ["absence_sms", "Student absence alerts"],
    ["exam_reminder_sms", "Exam reminders"], ["result_sms", "Results/report-card notifications"], ["announcement_sms", "School announcements"],
  ];
  return <div className="space-y-6 max-w-4xl">
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="size-5" />SMS safety & provider settings</CardTitle><p className="text-sm text-muted-foreground">API credentials are kept in Supabase Edge Function secrets, never in the browser.</p></CardHeader><CardContent className="space-y-5">
      <label className="flex items-center justify-between rounded-lg border p-4"><div><b>Enable SMS sending</b><p className="text-xs text-muted-foreground">Turn this on only after configuring your provider.</p></div><input type="checkbox" checked={!!local.sms_enabled} onChange={() => toggle("sms_enabled")} /></label>
      <div className="grid gap-4 md:grid-cols-2"><div><Label>Provider</Label><Input value={local.provider ?? "africas_talking"} onChange={e=>setLocal((x:any)=>({...x,provider:e.target.value}))} /></div><div><Label>Sender ID</Label><Input value={local.sender_id ?? ""} onChange={e=>setLocal((x:any)=>({...x,sender_id:e.target.value}))} placeholder="Optional registered sender ID" /></div></div>
      <div className="grid gap-2">{items.map(([key,label]) => <label key={key} className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm">{label}</span><input type="checkbox" checked={!!local[key]} onChange={()=>toggle(key)} /></label>)}</div>
      <Button onClick={()=>onSave(local)} disabled={saving}>{saving ? "Saving…" : "Save SMS settings"}</Button>
    </CardContent></Card>
    <Card><CardHeader><CardTitle>Provider setup</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-2"><p>For Kenya, the current integration is prepared for Africa's Talking. Their SMS API uses an API key and username, and production sending also requires an approved sender ID or shortcode.</p><p>Store <code>AT_USERNAME</code>, <code>AT_API_KEY</code> and optional <code>AT_SENDER_ID</code> as Supabase Edge Function secrets.</p></CardContent></Card>
  </div>;
}

function SmsCenter(props: any) {
  const selected = props.recipients.length;
  return <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-3"><Card><CardContent className="p-5"><div className="flex items-center gap-3"><Users className="size-5 text-primary" /><div><p className="text-xs uppercase tracking-brand text-muted-foreground">Recipients</p><p className="text-2xl font-bold">{selected}</p></div></div></CardContent></Card><Card><CardContent className="p-5"><div className="flex items-center gap-3"><Send className="size-5 text-primary" /><div><p className="text-xs uppercase tracking-brand text-muted-foreground">History</p><p className="text-2xl font-bold">{props.history.length}</p></div></div></CardContent></Card><Card><CardContent className="p-5"><div className="flex items-center gap-3"><FileText className="size-5 text-primary" /><div><p className="text-xs uppercase tracking-brand text-muted-foreground">Templates</p><p className="text-2xl font-bold">{props.templates.length}</p></div></div></CardContent></Card></div>
    <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
      <Card><CardHeader><CardTitle className="text-base">Compose SMS</CardTitle></CardHeader><CardContent className="space-y-5"><div className="space-y-2"><Label>Audience</Label><Select value={props.audience} onValueChange={(v) => { props.setAudience(v); props.setRecipients([]); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="parents">Parents / guardians</SelectItem><SelectItem value="teachers">Teachers</SelectItem><SelectItem value="staff">All staff</SelectItem><SelectItem value="all">All contacts</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label>Recipients ({props.people.length})</Label><div className="max-h-56 space-y-1 overflow-auto rounded-lg border p-2">{props.people.length ? props.people.map((p: Person) => <label key={p.id} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 hover:bg-muted"><input type="checkbox" checked={props.recipients.includes(p.id)} onChange={(e) => props.setRecipients(e.target.checked ? [...props.recipients, p.id] : props.recipients.filter((id: string) => id !== p.id))} /><span className="text-sm">{fullName(p)}</span><span className="ml-auto text-xs text-muted-foreground">{p.phone}</span></label>) : <p className="p-3 text-sm text-muted-foreground">No contacts with phone numbers in this group.</p>}</div></div><div className="space-y-2"><Label>Message <span className="float-right text-xs text-muted-foreground">{props.message.length}/480</span></Label><Textarea rows={7} maxLength={480} value={props.message} onChange={(e) => props.setMessage(e.target.value)} placeholder="Write a clear school message…" /></div><Button className="w-full" disabled={!selected || !props.message.trim() || props.sending} onClick={props.onSend}><Send className="mr-2 size-4" />{props.sending ? "Sending SMS…" : `Send SMS to ${selected || 0}`}</Button></CardContent></Card>
      <div className="space-y-6"><Card><CardHeader><CardTitle className="text-base">Templates</CardTitle></CardHeader><CardContent className="space-y-3">{props.templates.map((t: any) => <button key={t.id} onClick={() => props.setMessage(t.message)} className="w-full rounded-lg border p-3 text-left hover:bg-muted"><p className="text-sm font-semibold">{t.name}</p><p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{t.message}</p></button>)}<div className="grid gap-2 sm:grid-cols-2"><Input value={props.templateName} onChange={(e) => props.setTemplateName(e.target.value)} placeholder="Template name" /><Button variant="outline" disabled={props.savingTemplate || !props.templateName.trim() || !props.templateMessage.trim()} onClick={props.onSaveTemplate}>Save template</Button></div><Textarea rows={3} value={props.templateMessage} onChange={(e) => props.setTemplateMessage(e.target.value)} placeholder="Template message" /></CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><History className="size-4" />Recent SMS</CardTitle></CardHeader><CardContent className="space-y-3">{props.history.slice(0, 8).map((s: SmsRow) => <div key={s.id} className="rounded-lg border p-3"><div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold">{s.recipient_name || s.recipient_phone}</p><Badge variant={s.status === "sent" || s.status === "delivered" ? "default" : "destructive"}>{s.status}</Badge></div><p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{s.message}</p><p className="mt-2 text-[11px] text-muted-foreground">{new Date(s.created_at).toLocaleString()}{s.provider_cost ? ` · ${s.provider_cost}` : ""}</p></div>)}{!props.history.length && <EmptyState message="No SMS have been sent yet." />}</CardContent></Card></div>
    </div>
  </div>;
}

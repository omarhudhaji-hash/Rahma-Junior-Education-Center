import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { History, Search, ShieldCheck } from "lucide-react";
import { requirePortalRoles } from "@/lib/permissions";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/portal/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/portal/audit-logs")({
  ssr: false,
  head: () => ({ meta: [{ title: "Audit logs | Rahma Junior portal" }, { name: "robots", content: "noindex" }] }),
  beforeLoad: async () => { await requirePortalRoles(["admin"]); },
  component: AuditLogsPage,
});

type AuditRow = {
  id: string; action: string; table_name: string | null; record_id: string | null;
  description: string; created_at: string; actor_id: string | null;
};

function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("ALL");
  const query = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("audit_logs")
        .select("id,action,table_name,record_id,description,created_at,actor_id")
        .order("created_at", { ascending: false }).limit(500);
      if (error) throw error;
      return (data ?? []) as AuditRow[];
    },
  });

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (query.data ?? []).filter(r =>
      (action === "ALL" || r.action === action) &&
      (!q || [r.description, r.table_name, r.record_id, r.actor_id].filter(Boolean).join(" ").toLowerCase().includes(q))
    );
  }, [query.data, search, action]);

  return <div className="space-y-6">
    <PageHeader title="Security & Audit Logs" description="A read-only record of important changes made in the school portal." />
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="size-5 text-primary" />Activity history</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
          <div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search action, table, record or user…" /></div>
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={action} onChange={e => setAction(e.target.value)}>
            <option value="ALL">All actions</option><option value="INSERT">Created</option><option value="UPDATE">Updated</option><option value="DELETE">Deleted</option><option value="CUSTOM">Custom</option>
          </select>
        </div>
        {query.isLoading ? <p className="py-8 text-center text-sm text-muted-foreground">Loading audit history…</p> : query.error ? <p className="py-8 text-center text-sm text-destructive">Could not load audit logs. Run the audit migration first.</p> :
          <div className="overflow-x-auto rounded-lg border"><table className="w-full text-sm"><thead><tr className="border-b bg-secondary/40 text-left"><th className="p-3">Date & time</th><th className="p-3">Action</th><th className="p-3">Area</th><th className="p-3">Description</th><th className="p-3">Actor</th></tr></thead><tbody>
            {rows.map(r => <tr key={r.id} className="border-b last:border-0"><td className="whitespace-nowrap p-3 text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td><td className="p-3"><Badge variant="outline">{r.action}</Badge></td><td className="p-3 font-medium">{r.table_name ?? "—"}</td><td className="p-3">{r.description}{r.record_id ? <span className="ml-2 text-xs text-muted-foreground">#{r.record_id.slice(0, 8)}</span> : null}</td><td className="p-3 text-xs text-muted-foreground">{r.actor_id ? r.actor_id.slice(0, 8) : "System"}</td></tr>)}
            {!rows.length && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground"><History className="mx-auto mb-2 size-6" />No matching activity.</td></tr>}
          </tbody></table></div>}
        <p className="text-xs text-muted-foreground">Audit records are read-only for administrators. Passwords, API keys and tokens are excluded from stored audit data.</p>
      </CardContent>
    </Card>
  </div>;
}

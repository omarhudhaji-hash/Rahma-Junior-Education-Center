import * as React from "react";
import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Users, UserPlus, ShieldCheck, ShieldOff } from "lucide-react";
import { requirePortalRoles } from "@/lib/permissions";
import { supabase } from "@/integrations/supabase/client";
import { fullName } from "@/lib/school";
import { PageHeader, EmptyState } from "@/components/portal/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMe } from "@/hooks/use-auth";
import { getSupabaseFunctionError } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/portal/parents")({
  beforeLoad: async () => { await requirePortalRoles(["admin", "headteacher"]); },
  component: ParentsPage,
});

type ParentRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  childCount: number;
  familyId: string | null;
};

function ParentsPage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const parentDetailMatch = pathname.startsWith("/portal/parents/") && pathname !== "/portal/parents/";

  const [q, setQ] = React.useState("");
  const qc = useQueryClient();
  const { hasRole } = useMe();

  const parents = useQuery({
    queryKey: ["parents-directory", q],
    queryFn: async (): Promise<ParentRow[]> => {
      const { data: roles, error: roleError } = await supabase.from("user_roles").select("user_id").eq("role", "parent");
      if (roleError) throw roleError;
      const ids = (roles ?? []).map((x) => x.user_id);
      if (!ids.length) return [];

      const [{ data: profiles, error: profileError }, { data: links, error: linkError }, { data: families, error: familyError }] = await Promise.all([
        supabase.from("profiles").select("id,first_name,last_name,email,phone,is_active").in("id", ids).order("first_name"),
        supabase.from("parent_student").select("parent_id,student_id").in("parent_id", ids),
        supabase.from("admission_families").select("id,parent_email,parent_phone,status").eq("status", "active"),
      ]);
      if (profileError) throw profileError;
      if (linkError) throw linkError;
      if (familyError) throw familyError;

      const countByParent = new Map<string, number>();
      for (const link of links ?? []) countByParent.set(link.parent_id, (countByParent.get(link.parent_id) ?? 0) + 1);
      const familyByParent = new Map<string, string>();
      for (const p of profiles ?? []) {
        const family = (families ?? []).find((f) =>
          (p.email && f.parent_email && p.email.toLowerCase() === f.parent_email.toLowerCase()) ||
          (p.phone && f.parent_phone && p.phone === f.parent_phone)
        );
        if (family) familyByParent.set(p.id, family.id);
      }

      const studentIds = [...new Set((links ?? []).map((x) => x.student_id))];
      const { data: students, error: studentError } = studentIds.length
        ? await supabase.from("students").select("id,first_name,last_name,admission_no").in("id", studentIds)
        : { data: [], error: null };
      if (studentError) throw studentError;

      const normalized = q.trim().toLowerCase();
      return (profiles ?? []).filter((p) => {
        if (!normalized) return true;
        const own = `${p.first_name} ${p.last_name} ${p.email ?? ""} ${p.phone ?? ""}`.toLowerCase();
        const childIds = (links ?? []).filter((l) => l.parent_id === p.id).map((l) => l.student_id);
        const childText = (students ?? []).filter((s) => childIds.includes(s.id)).map((s) => `${s.first_name} ${s.last_name} ${s.admission_no}`).join(" ").toLowerCase();
        return own.includes(normalized) || childText.includes(normalized);
      }).map((p) => ({
        ...p,
        childCount: countByParent.get(p.id) ?? 0,
        familyId: familyByParent.get(p.id) ?? null,
      }));
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ userId, active }: { userId: string; active: boolean }) => {
      if (!hasRole("admin")) throw new Error("Only the Admin can change portal account status.");
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) throw new Error("Your session has expired. Please sign in again.");
      const { error } = await supabase.functions.invoke("set-parent-account-status", {
        body: { userId, active },
        headers: { Authorization: `Bearer ${session.session.access_token}` },
      });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      toast.success(vars.active ? "Parent portal account enabled." : "Parent portal account disabled.");
      qc.invalidateQueries({ queryKey: ["parents-directory"] });
    },
    onError: async (e) => toast.error(await getSupabaseFunctionError(e, "Could not update account status")),
  });

  if (parentDetailMatch) return <Outlet />;

  return <div>
    <PageHeader
      title="Parents & Families"
      description="One parent account can manage multiple children. Search by parent or child details."
      action={<Button asChild><Link to="/portal/admissions"><UserPlus className="mr-2 size-4" />Add / Admit Child</Link></Button>}
    />
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full max-w-xl"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search parent, phone, email, student or admission no." className="pl-9" /></div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="size-4" />{parents.data?.length ?? 0} parent accounts</div>
    </div>
    <Card>
      <CardContent className="p-0">
        {parents.isLoading ? <p className="p-6 text-sm text-muted-foreground">Loading parent directory…</p> : parents.isError ? <EmptyState message="Unable to load the parent directory." /> : parents.data?.length ? <div className="divide-y">
          {parents.data.map((p) => <div key={p.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/30">
            <Link to="/portal/parents/$parentId" params={{ parentId: p.id }} className="min-w-0 flex-1">
              <div className="flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 font-semibold text-primary">{`${p.first_name?.[0] ?? ""}${p.last_name?.[0] ?? ""}`.toUpperCase()}</div>
                <div className="min-w-0"><p className="font-semibold">{fullName(p)}</p><p className="truncate text-sm text-muted-foreground">{p.phone ?? "No phone"} · {p.email ?? "No email"}</p><div className="mt-2 flex flex-wrap items-center gap-2"><Badge variant="secondary">{p.childCount} {p.childCount === 1 ? "child" : "children"}</Badge><Badge variant={p.is_active ? "default" : "destructive"}>{p.is_active ? "Active" : "Disabled"}</Badge></div></div>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild><Link to="/portal/parents/$parentId" params={{ parentId: p.id }}>View family</Link></Button>
              {hasRole("admin") && <Button variant={p.is_active ? "outline" : "default"} size="sm" disabled={setStatus.isPending} onClick={() => setStatus.mutate({ userId: p.id, active: !p.is_active })}>{p.is_active ? <><ShieldOff className="size-4" />Disable</> : <><ShieldCheck className="size-4" />Enable</>}</Button>}
            </div>
          </div>)}
        </div> : <EmptyState message="No parents found." />}
      </CardContent>
    </Card>
  </div>;
}

import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { BookOpen, CalendarDays, ClipboardCheck, FileText, GraduationCap, LayoutDashboard, LogOut, Megaphone, Menu, MessageSquare, UserRound, Users, UserCog, Wallet, UserPlus, Package, Award, Settings, ShieldCheck, BarChart3, Search, Bell } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMe } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { logoUrl } from "@/lib/assets";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { fullName, initials, roleLabels, school } from "@/lib/school";
import { ProfileAvatar } from "@/components/portal/profile-avatar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Item = { to: string; label: string; key?: TranslationKey; icon: typeof LayoutDashboard; show: (p: any) => boolean };
const items: Item[] = [
  { to: "/dashboard", label: "Dashboard", key: "dashboard", icon: LayoutDashboard, show: () => true },
  { to: "/portal/admissions", label: "Admissions", icon: UserPlus, show: p => p.isLeadership },
  { to: "/portal/students", label: "Students", key: "students", icon: GraduationCap, show: p => p.isLeadership || p.isTeacher || p.isParent || p.isStudent },
  { to: "/portal/classes", label: "Classes", key: "classes", icon: BookOpen, show: p => p.isLeadership || p.isTeacher },
  { to: "/portal/classes", label: "My Subjects", icon: BookOpen, show: p => p.isTeacher && !p.isLeadership },
  { to: "/portal/staff", label: "Staff", icon: UserCog, show: p => p.isLeadership },
  { to: "/portal/parents", label: "Parents", icon: Users, show: p => p.isLeadership },
  { to: "/portal/attendance", label: "Attendance", key: "attendance", icon: ClipboardCheck, show: p => p.isLeadership || p.isTeacher || p.isParent || p.isStudent },
  { to: "/portal/timetable", label: "Timetable", key: "timetable", icon: CalendarDays, show: () => true },
  { to: "/portal/calendar", label: "School Calendar", icon: CalendarDays, show: () => true },
  { to: "/portal/exams", label: "Exams", icon: FileText, show: () => true },
  { to: "/portal/exams", label: "Marks & Results", icon: ClipboardCheck, show: p => p.isTeacher || p.isLeadership },
  { to: "/portal/academic", label: "Academic Records", icon: Award, show: () => true },
  { to: "/portal/documents", label: "School Documents", icon: FileText, show: p => p.isLeadership || p.isParent || p.isStudent },
  { to: "/portal/finance", label: "Finance", key: "finance", icon: Wallet, show: p => p.isAdmin || p.isLeadership || p.isParent || p.isStudent },
  { to: "/portal/inventory", label: "Inventory", icon: Package, show: p => p.isAdmin || p.isLeadership || p.isParent },
  { to: "/portal/announcements", label: "Announcements", key: "announcements", icon: Megaphone, show: () => true },
  { to: "/portal/messages", label: "Messages", key: "messages", icon: MessageSquare, show: () => true },
  { to: "/portal/profile", label: "Profile", key: "profile", icon: UserRound, show: () => true },
  { to: "/portal/settings", label: "School Settings", icon: Settings, show: p => p.isAdmin },
  { to: "/portal/reports", label: "Reports Center", icon: BarChart3, show: p => p.isLeadership },
  { to: "/portal/audit-logs", label: "Security & Audit Logs", icon: ShieldCheck, show: p => p.isAdmin },
];

export function PortalShell({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const { profile, primaryRole, isStaff, isAdmin, isLeadership, hasRole } = useMe();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const perms = { isStaff, isAdmin, isParent: hasRole("parent"), isLeadership, isTeacher: hasRole("teacher"), isStudent: hasRole("student") };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    let active = true;
    const run = async () => {
      const q = search.trim();
      if (q.length < 2) { setResults([]); return; }
      const pattern = `%${q.replace(/[%_,]/g, "\\$&")}%`;
      const [byFirst, byLast, byAdmission] = await Promise.all([
        supabase.from("students").select("id,first_name,last_name,admission_no").ilike("first_name", pattern).limit(8),
        supabase.from("students").select("id,first_name,last_name,admission_no").ilike("last_name", pattern).limit(8),
        supabase.from("students").select("id,first_name,last_name,admission_no").ilike("admission_no", pattern).limit(8),
      ]);
      const firstError = byFirst.error ?? byLast.error ?? byAdmission.error;
      if (firstError) {
        if (active) setResults([]);
        return;
      }
      const seen = new Set<string>();
      const data = [...(byFirst.data ?? []), ...(byLast.data ?? []), ...(byAdmission.data ?? [])]
        .filter((row: any) => {
          if (seen.has(row.id)) return false;
          seen.add(row.id);
          return true;
        })
        .slice(0, 8);
      if (active) setResults((data ?? []).map((x: any) => ({
        ...x,
        href: "/portal/students/$studentId",
        params: { studentId: x.id },
      })));
    };
    const timer = setTimeout(run, 250);
    return () => { active = false; clearTimeout(timer); };
  }, [search]);

  const visible = items.filter(i => i.show(perms));
  const name = fullName(profile) || "Portal user";

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const nav = (
    <nav className="flex flex-col gap-1">
      {visible.map(item => (
        <Link
          key={`${item.to}-${item.label}`}
          to={item.to}
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-navy-foreground/75 hover:bg-white/10 hover:text-navy-foreground"
          activeProps={{ className: "bg-white/15 !text-navy-foreground" }}
        >
          <item.icon className="size-4" />
          {item.key ? t(item.key) : item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-secondary/40 lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="hidden bg-navy p-4 text-navy-foreground lg:block">
        <Link to="/" className="flex items-center gap-3 px-1 py-2">
          <img src={logoUrl} alt={`${school.name} logo`} className="size-10 rounded-full object-cover ring-2 ring-accent" />
          <span className="font-display text-sm font-extrabold">{school.shortName}</span>
        </Link>
        <div className="my-4 h-px bg-white/15" />
        {nav}
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border/70 bg-background/95 px-4 backdrop-blur">
          <Button variant="outline" className="hidden w-64 justify-between text-muted-foreground lg:flex" onClick={() => setSearchOpen(true)}>
            <span className="flex items-center gap-2"><Search className="size-4" />Search students...</span>
            <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px]">Ctrl K</kbd>
          </Button>

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSearchOpen(true)} aria-label="Search">
            <Search className="size-4" />
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open portal navigation"><Menu className="size-4" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="h-dvh max-h-dvh w-72 overflow-y-auto bg-navy text-navy-foreground">
              <div className="mt-8 pb-2">{nav}</div>
            </SheetContent>
          </Sheet>

          <div className="ml-auto flex min-w-0 items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifications" onClick={() => navigate({ to: "/portal/announcements" })}>
              <Bell className="size-4" />
            </Button>
            <div className="hidden min-w-0 text-right sm:block">
              <p className="text-sm font-semibold text-navy">{name}</p>
              <p className="truncate text-[11px] uppercase tracking-brand text-muted-foreground">{roleLabels[primaryRole]}</p>
            </div>
            <ProfileAvatar path={profile?.photo_url} name={name} size="sm" />
            <Button variant="ghost" size="icon" onClick={signOut} aria-label={t("logout")}>
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>

        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogContent className="overflow-hidden p-0 sm:max-w-xl">
            <DialogTitle className="sr-only">Global school search</DialogTitle>
            <Command shouldFilter={false}>
              <CommandInput autoFocus placeholder="Search by student name or admission number..." value={search} onValueChange={setSearch} />
              <CommandList>
                <CommandEmpty>{search.length < 2 ? "Type at least 2 characters." : "No students found."}</CommandEmpty>
                {results.length > 0 && (
                  <CommandGroup heading="Students">
                    {results.map(r => (
                      <CommandItem
                        key={r.id}
                        value={r.id}
                        onSelect={() => {
                          setSearchOpen(false);
                          setSearch("");
                          navigate({ to: r.href, params: r.params });
                        }}
                      >
                        <GraduationCap className="mr-2 size-4" />
                        <span>{r.first_name} {r.last_name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{r.admission_no}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </DialogContent>
        </Dialog>

        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Award, GraduationCap, Printer } from "lucide-react";
import { requirePortalRoles } from "@/lib/permissions";
import { supabase } from "@/integrations/supabase/client";
import { fullName, school } from "@/lib/school";
import { useMe } from "@/hooks/use-auth";
import { PageHeader, EmptyState } from "@/components/portal/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/portal/academic")({
  beforeLoad: async () => {
    await requirePortalRoles(["admin", "headteacher", "teacher", "parent", "student"]);
  },
  component: AcademicPage,
});

function gradeForPercent(percent: number) {
  if (percent >= 80) return "A";
  if (percent >= 70) return "B";
  if (percent >= 60) return "C";
  if (percent >= 50) return "D";
  return "E";
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function AcademicPage() {
  const { userId, hasRole, isLeadership } = useMe();
  const family = hasRole("parent") || hasRole("student");

  const students = useQuery({
    queryKey: ["academic-students", userId, family, isLeadership, hasRole("teacher")],
    queryFn: async () => {
      let ids: string[] = [];

      if (hasRole("parent")) {
        const { data, error } = await supabase
          .from("parent_student")
          .select("student_id")
          .eq("parent_id", userId!);
        if (error) throw error;
        ids = (data ?? []).map((x) => x.student_id);
      } else if (hasRole("student")) {
        const { data, error } = await supabase
          .from("students")
          .select("id")
          .eq("user_id", userId!);
        if (error) throw error;
        ids = (data ?? []).map((x) => x.id);
      }

      let query = supabase
        .from("students")
        .select(
          "id,admission_no,first_name,last_name,current_class_id,classes:current_class_id(name,section)",
        )
        .order("first_name");

      if (family) {
        if (!ids.length) return [];
        query = query.in("id", ids);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });

  const [selected, setSelected] = React.useState("");
  const [reportExam, setReportExam] = React.useState("");

  React.useEffect(() => {
    if (!students.data?.length || selected) return;
    const requested = new URLSearchParams(window.location.search).get("studentId");
    const match = students.data.some((student: any) => student.id === requested);
    setSelected(match ? requested! : students.data[0].id);
  }, [students.data, selected]);

  const active = selected || students.data?.[0]?.id || "";

  const marks = useQuery({
    queryKey: ["academic-record", active],
    enabled: !!active,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marks")
        .select(
          "id,marks,grade,teacher_remarks,created_at,exam_subjects:exam_subject_id(id,exam_date,max_marks,subject_id,exam_id,subjects:subject_id(name,code),exams:exam_id(name,type,starts_on,ends_on,published))",
        )
        .eq("student_id", active)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const student = (students.data ?? []).find((item: any) => item.id === active) as any;

  const rows = (marks.data ?? []).map((record: any) => {
    const examSubject = record.exam_subjects ?? {};
    const max = Number(examSubject.max_marks ?? 100);
    const mark = Number(record.marks ?? 0);
    const percent = max ? (mark / max) * 100 : 0;

    return {
      ...record,
      examSubject,
      max,
      mark,
      percent,
      grade: record.grade ?? gradeForPercent(percent),
    };
  });

  const examGroups = new Map<string, any[]>();
  rows.forEach((row) => {
    const key = row.examSubject.exams?.name ?? "Other";
    examGroups.set(key, [...(examGroups.get(key) ?? []), row]);
  });

  React.useEffect(() => {
    if (!reportExam && examGroups.size) setReportExam([...examGroups.keys()][0]);
    if (reportExam && !examGroups.has(reportExam)) setReportExam([...examGroups.keys()][0] ?? "");
  }, [rows.length, reportExam]); // eslint-disable-line react-hooks/exhaustive-deps

  const average = rows.length
    ? rows.reduce((total, row) => total + row.percent, 0) / rows.length
    : 0;
  const overall = rows.length ? gradeForPercent(average) : "—";
  const reportRows = reportExam ? examGroups.get(reportExam) ?? [] : rows;
  const reportAverage = reportRows.length
    ? reportRows.reduce((total, row) => total + row.percent, 0) / reportRows.length
    : 0;
  const reportGrade = reportRows.length ? gradeForPercent(reportAverage) : "—";
  const reportExamMeta = reportRows[0]?.examSubject?.exams;

  return (
    <div>
      <div className="print:hidden">
        <PageHeader
          title="Academic Records"
          description="Student marks, grades, teacher remarks and professional report-card summaries."
        />

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Select value={active} onValueChange={setSelected}>
            <SelectTrigger className="w-full max-w-sm">
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              {(students.data ?? []).map((item: any) => (
                <SelectItem key={item.id} value={item.id}>
                  {fullName(item)} · {item.admission_no}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={reportExam} onValueChange={setReportExam} disabled={!examGroups.size}>
            <SelectTrigger className="w-full max-w-sm">
              <SelectValue placeholder="Select report card exam" />
            </SelectTrigger>
            <SelectContent>
              {[...examGroups.keys()].map((examName) => (
                <SelectItem key={examName} value={examName}>
                  Report card: {examName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => window.print()} disabled={!reportRows.length}>
            <Printer className="mr-2 size-4" />
            Print professional report card
          </Button>
        </div>
      </div>

      {!active ? (
        <EmptyState message="No student academic record is available yet." />
      ) : (
        <>
          <div className="print:hidden">
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="size-5" />
                    {fullName(student)}
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {student?.admission_no} · {student?.classes?.name ?? "Class not assigned"}
                    {student?.classes?.section ? ` — ${student.classes.section}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-brand text-muted-foreground">Overall</p>
                  <p className="text-3xl font-bold text-primary">{overall}</p>
                  <p className="text-xs text-muted-foreground">Average {average.toFixed(1)}%</p>
                </div>
              </CardHeader>
            </Card>

            {!rows.length ? (
              <EmptyState message="No marks have been recorded for this student yet." />
            ) : (
              <div className="space-y-6">
                {[...examGroups.entries()].map(([examName, group]) => (
                  <Card key={examName}>
                    <CardHeader>
                      <CardTitle className="text-base">{examName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b text-left">
                              <th className="p-2">Subject</th>
                              <th className="p-2">Date</th>
                              <th className="p-2">Marks</th>
                              <th className="p-2">%</th>
                              <th className="p-2">Grade</th>
                              <th className="p-2">Teacher remark</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.map((row: any) => (
                              <tr key={row.id} className="border-b">
                                <td className="p-2 font-medium">
                                  {row.examSubject.subjects?.name ?? "—"}
                                </td>
                                <td className="p-2">{formatDate(row.examSubject.exam_date)}</td>
                                <td className="p-2">
                                  {row.mark} / {row.max}
                                </td>
                                <td className="p-2">{row.percent.toFixed(1)}%</td>
                                <td className="p-2">
                                  <Badge>{row.grade}</Badge>
                                </td>
                                <td className="p-2">{row.teacher_remarks ?? "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Award className="size-4" />
                      Performance summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-3">
                    <Summary label="Subjects recorded" value={String(rows.length)} />
                    <Summary label="Average" value={`${average.toFixed(1)}%`} />
                    <Summary label="Overall grade" value={overall} />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {reportRows.length > 0 && (
            <section className="mx-auto hidden max-w-4xl bg-white text-slate-900 print:block print:max-w-none">
              <div className="border-2 border-slate-800 p-7">
                <header className="border-b-2 border-slate-800 pb-5 text-center">
                  <div className="flex items-center justify-center gap-4">
                    <img
                      src="/images/logo.jpg"
                      alt="Rahma Junior logo"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                    <div>
                      <h1 className="text-2xl font-extrabold uppercase tracking-wide">
                        {school.name}
                      </h1>
                      <p className="mt-1 text-sm font-semibold uppercase tracking-[0.2em]">
                        {school.motto}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">{school.values}</p>
                    </div>
                  </div>
                  <h2 className="mt-5 text-xl font-extrabold uppercase tracking-wider">
                    Student Academic Report Card
                  </h2>
                  <p className="mt-1 text-sm font-medium">
                    {reportExam} {reportExamMeta?.type ? `· ${reportExamMeta.type.replace("_", " ").toUpperCase()}` : ""}
                  </p>
                </header>

                <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 border-b border-slate-300 pb-5 text-sm">
                  <Info label="Student name" value={fullName(student)} />
                  <Info label="Admission number" value={student?.admission_no ?? "—"} />
                  <Info
                    label="Class"
                    value={`${student?.classes?.name ?? "Not assigned"}${student?.classes?.section ? ` — ${student.classes.section}` : ""}`}
                  />
                  <Info label="Report date" value={new Date().toLocaleDateString("en-KE")} />
                </div>

                <div className="mt-6">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-400 p-2 text-left">#</th>
                        <th className="border border-slate-400 p-2 text-left">Subject</th>
                        <th className="border border-slate-400 p-2 text-center">Marks</th>
                        <th className="border border-slate-400 p-2 text-center">%</th>
                        <th className="border border-slate-400 p-2 text-center">Grade</th>
                        <th className="border border-slate-400 p-2 text-left">Teacher remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportRows.map((row: any, index: number) => (
                        <tr key={row.id}>
                          <td className="border border-slate-400 p-2 text-center">{index + 1}</td>
                          <td className="border border-slate-400 p-2 font-semibold">
                            {row.examSubject.subjects?.name ?? "—"}
                          </td>
                          <td className="border border-slate-400 p-2 text-center">
                            {row.mark} / {row.max}
                          </td>
                          <td className="border border-slate-400 p-2 text-center">
                            {row.percent.toFixed(1)}%
                          </td>
                          <td className="border border-slate-400 p-2 text-center font-bold">
                            {row.grade}
                          </td>
                          <td className="border border-slate-400 p-2">
                            {row.teacher_remarks || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  <ReportMetric label="Subjects" value={String(reportRows.length)} />
                  <ReportMetric label="Average" value={`${reportAverage.toFixed(1)}%`} />
                  <ReportMetric label="Overall grade" value={reportGrade} />
                </div>

                <div className="mt-8 grid grid-cols-2 gap-16 pt-8 text-sm">
                  <Signature label="Class Teacher" />
                  <Signature label="Headteacher" />
                </div>

                <footer className="mt-8 border-t border-slate-300 pt-4 text-center text-xs text-slate-500">
                  This report card is generated from the school academic records. Keep it safely for future reference.
                </footer>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/60 p-4">
      <p className="text-xs uppercase tracking-brand text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function ReportMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-slate-400 p-3 text-center">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-extrabold">{value}</p>
    </div>
  );
}

function Signature({ label }: { label: string }) {
  return (
    <div className="pt-8 text-center">
      <div className="border-b border-slate-800" />
      <p className="mt-2 font-semibold">{label} signature</p>
      <p className="mt-1 text-xs text-slate-500">Date: __________________</p>
    </div>
  );
}

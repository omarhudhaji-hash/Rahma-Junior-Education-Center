# Academic Records & Report Cards

This upgrade adds a student academic record/report-card page using the existing `marks` and `exam_subjects` tables.

## Includes
- Student academic record for Admin, Headteacher, Teacher, Parent and Student roles.
- Marks, percentages and automatic grades.
- Teacher remarks attached to each result.
- Exam grouping and overall average/grade.
- Print report card button using the browser print dialog.
- Academic Records navigation item in the portal.
- Student profile shortcut to the academic record.

## SQL
No new SQL migration is required. It reads the existing marks/exam tables and respects their current RLS policies.

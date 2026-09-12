# Exam Paper Timing

Each exam subject/paper now stores its actual school-local start time and duration in minutes.

Examples:
- 08:00 + 60 minutes = 09:00
- 09:30 + 90 minutes = 11:00

Apply the migration before using the new fields:
`supabase/migrations/20260830080000_exam_subject_timing.sql`

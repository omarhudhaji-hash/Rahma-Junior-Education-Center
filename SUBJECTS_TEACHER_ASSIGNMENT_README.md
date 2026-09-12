# Phase 1 — Subjects & Teacher Subject Assignment

This upgrade adds:
- Subject catalogue management for Admin and Headteacher.
- Active/inactive subjects.
- Teacher + class + subject assignments.
- Teacher view of their assigned subjects.
- Protection so teachers cannot create or remove assignments.
- Indexes for future marks/report-card queries.

## Supabase
Run the new migration:
`supabase/migrations/20260830050000_subject_management.sql`

No new Edge Function is required.

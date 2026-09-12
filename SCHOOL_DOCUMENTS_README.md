# School Documents & Reports

This upgrade adds a role-protected School Documents register for official student letters and printable documents.

## Supabase

Run:
`supabase/migrations/20260830220000_school_documents.sql`

No existing finance, report-card, inventory, calendar, SMS, or attendance tables are replaced.

## Access

- Admin / Headteacher: create, issue, view, and print documents.
- Parent: view and print documents belonging to linked children.
- Student: view and print their own documents.
- Teacher: no School Documents menu in this phase.

## Document types

Official Letter, Admission Letter, Transfer Letter, Clearance / Exit Letter, Fee Clearance, Character Reference, Other.

# Rahma Junior Education Center — Phase 1 Core Records

This version starts the agreed Phase 1 roadmap from the uploaded project.

## Included
- Student profile page with personal, emergency, parent/guardian, attendance and fee summary.
- Student names in the student register now open the student's profile.
- Parent/guardian links are shown on the student profile.
- Family/admission tables support one parent/family with multiple learners.
- CBC class catalogue remains extended through Grade 9.
- Teacher student access is restricted to assigned classes at the database level.
- Teacher class and assignment reads are scoped; leadership retains school-wide access.
- Leadership-only student record management is enforced.
- Existing admissions, staff, classes, inventory, exams, finance and timetable features are preserved.

## Supabase
Run this migration after the migrations already supplied with the project:

`supabase/migrations/20260830010000_phase1_core_records.sql`

Do not place service-role/secret keys in the frontend `.env`.

## Local setup

```bash
npm install
npm run dev
```

The archive intentionally excludes `node_modules`, `.output`, build caches, and the local `.env` file.

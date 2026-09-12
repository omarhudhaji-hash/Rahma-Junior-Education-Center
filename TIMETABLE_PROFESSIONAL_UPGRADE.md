# Rahma Edu Hub — Professional Timetable Upgrade

## Included
- Leadership timetable create/edit/delete.
- Conflict protection for class, teacher and room/venue overlaps.
- Clear validation that end time must be after start time.
- Teacher "My teaching schedule" with today's lessons.
- Parent/student class timetable remains scoped to their family/current class.
- Today's day is highlighted in the weekly view.
- Existing timetable data is preserved.

## Supabase
Run once:
`supabase/migrations/20260831050000_professional_timetable_conflict_checks.sql`

The application now calls `save_timetable_entry(...)` for new and edited timetable entries so conflicts are checked in the database, not only in the browser.

# Attendance Management Upgrade

This upgrade improves the existing attendance workflow without requiring a new Supabase schema.

## Included
- Teacher access limited to assigned classes.
- Admin/Headteacher school-wide class access.
- Daily class attendance register.
- Mark all learners present.
- Present, absent, late, and excused statuses.
- Optional individual attendance remarks.
- Daily attendance summary counters.
- Search by learner name/admission number.
- Parent/student attendance history.
- Attendance percentage based on present + late records.
- Up to 365 attendance records displayed for family users.

## Supabase
No new SQL migration is required. The feature uses the existing `attendance_records` table and existing role/security policies.

## Run
After extracting the ZIP:

```bash
npm install
npm run dev
```

Make sure the project's existing `.env` contains the working Supabase variables.

# Student Profile Photos + Public Admission Photo

This upgrade adds three related improvements:

1. Admin/Headteacher Students list now has an explicit **View Profile** action.
2. Parent portal child cards show the student's profile photo and a **Student Profile** button. The student profile page shows the photo.
3. Public Admissions includes an optional **Student profile photo** upload. The uploaded private storage path is saved on the application and automatically copied to `students.photo_url` when the application is approved.

## Supabase
Run this migration once:

`supabase/migrations/20260831020000_admission_student_photos.sql`

Do not rerun old migrations. The migration adds `applications.photo_url`, configures the existing private `student-photos` bucket, permits anonymous uploads only under `admissions/`, and updates admission approval to carry the photo onto the student record.

## Test
- Public page → Admissions → upload a student photo → submit.
- Admin → Admissions → approve the application.
- Admin → Students → View Profile → confirm the photo appears.
- Parent → My Children → confirm the photo and Student Profile link appear.

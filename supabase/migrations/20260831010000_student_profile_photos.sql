-- Student profile photos: private bucket with authenticated portal access.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('student-photos', 'student-photos', false, 5242880, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = 5242880, allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp'];

DROP POLICY IF EXISTS student_photos_authenticated_read ON storage.objects;
CREATE POLICY student_photos_authenticated_read
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'student-photos');

DROP POLICY IF EXISTS student_photos_leadership_insert ON storage.objects;
CREATE POLICY student_photos_leadership_insert
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'student-photos' AND public.is_leadership());

DROP POLICY IF EXISTS student_photos_leadership_update ON storage.objects;
CREATE POLICY student_photos_leadership_update
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'student-photos' AND public.is_leadership())
WITH CHECK (bucket_id = 'student-photos' AND public.is_leadership());

DROP POLICY IF EXISTS student_photos_leadership_delete ON storage.objects;
CREATE POLICY student_photos_leadership_delete
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'student-photos' AND public.is_leadership());

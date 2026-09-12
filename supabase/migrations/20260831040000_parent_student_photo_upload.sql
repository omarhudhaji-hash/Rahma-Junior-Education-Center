-- Allow parents to upload profile photos for their own linked children.
-- Photos remain in the private student-photos bucket.

DROP POLICY IF EXISTS student_photos_parent_insert ON storage.objects;
CREATE POLICY student_photos_parent_insert
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'student-photos'
  AND split_part(name, '/', 1) IN (
    SELECT ps.student_id::text
    FROM public.parent_student ps
    WHERE ps.parent_id = auth.uid()
  )
);

DROP POLICY IF EXISTS student_photos_parent_update ON storage.objects;
CREATE POLICY student_photos_parent_update
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'student-photos'
  AND split_part(name, '/', 1) IN (
    SELECT ps.student_id::text
    FROM public.parent_student ps
    WHERE ps.parent_id = auth.uid()
  )
)
WITH CHECK (
  bucket_id = 'student-photos'
  AND split_part(name, '/', 1) IN (
    SELECT ps.student_id::text
    FROM public.parent_student ps
    WHERE ps.parent_id = auth.uid()
  )
);

CREATE OR REPLACE FUNCTION public.set_student_photo_by_parent(
  _student_id UUID,
  _photo_path TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.parent_student
    WHERE parent_id = auth.uid()
      AND student_id = _student_id
  ) THEN
    RAISE EXCEPTION 'You can only update photos for your own children.';
  END IF;

  IF _photo_path IS NULL OR split_part(_photo_path, '/', 1) <> _student_id::text THEN
    RAISE EXCEPTION 'Invalid student photo path.';
  END IF;

  UPDATE public.students
  SET photo_url = _photo_path,
      updated_at = now()
  WHERE id = _student_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student not found.';
  END IF;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.set_student_photo_by_parent(UUID,TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_student_photo_by_parent(UUID,TEXT) TO authenticated;

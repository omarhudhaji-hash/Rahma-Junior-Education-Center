-- Fix teacher visibility of subject assignments.
-- teacher_class_assignments.teacher_id references auth.users, so the app
-- should not request profile columns through that foreign key.
-- This policy explicitly allows a teacher to read their own assignments.

DROP POLICY IF EXISTS "tca_scoped_read" ON public.teacher_class_assignments;
CREATE POLICY "tca_scoped_read" ON public.teacher_class_assignments
  FOR SELECT TO authenticated
  USING (public.is_leadership() OR teacher_id = auth.uid());

GRANT SELECT ON public.teacher_class_assignments TO authenticated;

-- Teachers need to resolve the subject and class labels used by their assignments.
DROP POLICY IF EXISTS "subjects_authenticated_read" ON public.subjects;
DROP POLICY IF EXISTS "subjects_read_all" ON public.subjects;
CREATE POLICY "subjects_authenticated_read" ON public.subjects
  FOR SELECT TO authenticated
  USING (TRUE);

DROP POLICY IF EXISTS "classes_authenticated_read" ON public.classes;
CREATE POLICY "classes_authenticated_read" ON public.classes
  FOR SELECT TO authenticated
  USING (public.is_leadership() OR public.can_view_class(id));

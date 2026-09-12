-- Rahma Phase 1: subject management and teacher subject assignments.
-- Leadership (admin + headteacher) manages subjects; teachers can read subjects
-- and only see their own class/subject assignments through the existing TCA policy.

DROP POLICY IF EXISTS "subjects_admin" ON public.subjects;
CREATE POLICY "subjects_leadership_manage" ON public.subjects
  FOR ALL TO authenticated
  USING (public.is_leadership())
  WITH CHECK (public.is_leadership());

-- Keep public/authenticated read access to the subject catalogue.
DROP POLICY IF EXISTS "subjects_read_all" ON public.subjects;
CREATE POLICY "subjects_read_all" ON public.subjects
  FOR SELECT TO anon, authenticated
  USING (TRUE);

-- Teachers must never be able to create/delete their own assignments; leadership only.
DROP POLICY IF EXISTS "tca_leadership_manage" ON public.teacher_class_assignments;
CREATE POLICY "tca_leadership_manage" ON public.teacher_class_assignments
  FOR ALL TO authenticated
  USING (public.is_leadership())
  WITH CHECK (public.is_leadership());

-- Helpful indexes for assignment screens and future marks/report queries.
CREATE INDEX IF NOT EXISTS idx_tca_teacher_class_subject
  ON public.teacher_class_assignments(teacher_id, class_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_tca_class_subject
  ON public.teacher_class_assignments(class_id, subject_id);

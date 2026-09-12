-- Assign the responsible teacher directly to each exam subject entry.
ALTER TABLE public.exam_subjects
  ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_exam_subjects_teacher
  ON public.exam_subjects(teacher_id);

-- Leadership can manage exam subject entries; teachers can read entries assigned to them.
DROP POLICY IF EXISTS "exam_subjects_scoped_read" ON public.exam_subjects;
CREATE POLICY "exam_subjects_scoped_read" ON public.exam_subjects
  FOR SELECT TO authenticated
  USING (public.is_leadership() OR teacher_id = auth.uid() OR public.can_view_class(class_id));

DROP POLICY IF EXISTS "exam_subjects_leadership_manage" ON public.exam_subjects;
CREATE POLICY "exam_subjects_leadership_manage" ON public.exam_subjects
  FOR ALL TO authenticated
  USING (public.is_leadership())
  WITH CHECK (public.is_leadership());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.exam_subjects TO authenticated;

-- Marks must be entered by the assigned exam-subject teacher (or leadership).
DROP POLICY IF EXISTS "marks_teacher_manage" ON public.marks;
DROP POLICY IF EXISTS "marks_teacher_update" ON public.marks;
DROP POLICY IF EXISTS "marks_teacher_insert" ON public.marks;
CREATE POLICY "marks_teacher_insert" ON public.marks
  FOR INSERT TO authenticated
  WITH CHECK (
    entered_by = auth.uid()
    AND (
      public.is_leadership()
      OR EXISTS (
        SELECT 1 FROM public.exam_subjects es
        WHERE es.id = exam_subject_id
          AND (
            es.teacher_id = auth.uid()
            OR (es.teacher_id IS NULL AND EXISTS (
              SELECT 1 FROM public.teacher_class_assignments tca
              WHERE tca.teacher_id = auth.uid()
                AND tca.class_id = es.class_id
                AND tca.subject_id = es.subject_id
            ))
          )
      )
    )
  );
CREATE POLICY "marks_teacher_update" ON public.marks
  FOR UPDATE TO authenticated
  USING (
    public.is_leadership()
    OR EXISTS (
      SELECT 1 FROM public.exam_subjects es
      WHERE es.id = exam_subject_id
        AND (
          es.teacher_id = auth.uid()
          OR (es.teacher_id IS NULL AND EXISTS (
            SELECT 1 FROM public.teacher_class_assignments tca
            WHERE tca.teacher_id = auth.uid()
              AND tca.class_id = es.class_id
              AND tca.subject_id = es.subject_id
          ))
        )
    )
  )
  WITH CHECK (entered_by = auth.uid());

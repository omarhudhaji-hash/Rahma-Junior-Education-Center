-- Teacher class-level remarks. Visible to leadership and teachers assigned to the class.
CREATE TABLE IF NOT EXISTS public.class_remarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  remark TEXT NOT NULL CHECK (length(trim(remark)) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.class_remarks ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.class_remarks TO authenticated;

DROP POLICY IF EXISTS class_remarks_read ON public.class_remarks;
CREATE POLICY class_remarks_read ON public.class_remarks FOR SELECT TO authenticated
  USING (public.is_leadership() OR EXISTS (
    SELECT 1 FROM public.teacher_class_assignments tca
    WHERE tca.teacher_id = auth.uid() AND tca.class_id = class_remarks.class_id
  ));

DROP POLICY IF EXISTS class_remarks_teacher_write ON public.class_remarks;
CREATE POLICY class_remarks_teacher_write ON public.class_remarks FOR INSERT TO authenticated
  WITH CHECK (
    teacher_id = auth.uid()
    AND public.has_role(auth.uid(),'teacher')
    AND EXISTS (
      SELECT 1 FROM public.teacher_class_assignments tca
      WHERE tca.teacher_id = auth.uid() AND tca.class_id = class_remarks.class_id
    )
  );

DROP POLICY IF EXISTS class_remarks_teacher_update ON public.class_remarks;
CREATE POLICY class_remarks_teacher_update ON public.class_remarks FOR UPDATE TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

DROP POLICY IF EXISTS class_remarks_leadership_manage ON public.class_remarks;
CREATE POLICY class_remarks_leadership_manage ON public.class_remarks FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

CREATE INDEX IF NOT EXISTS idx_class_remarks_class ON public.class_remarks(class_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_class_remarks_teacher ON public.class_remarks(teacher_id, created_at DESC);

-- Rahma Phase 1: core records hardening and student profiles.
-- Teachers may only read classes/assignments and students they are assigned to.

CREATE OR REPLACE FUNCTION public.can_view_class(_class_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_leadership()
    OR EXISTS (
      SELECT 1 FROM public.teacher_class_assignments tca
      WHERE tca.teacher_id = auth.uid() AND tca.class_id = _class_id
    )
    OR EXISTS (
      SELECT 1 FROM public.parent_student ps
      JOIN public.students s ON s.id = ps.student_id
      WHERE ps.parent_id = auth.uid() AND s.current_class_id = _class_id
    )
    OR EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.current_class_id = _class_id AND s.user_id = auth.uid()
    )
$$;

DROP POLICY IF EXISTS "classes_read_all" ON public.classes;
DROP POLICY IF EXISTS "classes_read_scoped" ON public.classes;
CREATE POLICY "classes_read_scoped" ON public.classes FOR SELECT TO authenticated
  USING (public.can_view_class(id));

DROP POLICY IF EXISTS "classes_admin" ON public.classes;
DROP POLICY IF EXISTS "classes_leadership_manage" ON public.classes;
CREATE POLICY "classes_leadership_manage" ON public.classes FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

DROP POLICY IF EXISTS "tca_staff_read" ON public.teacher_class_assignments;
DROP POLICY IF EXISTS "tca_scoped_read" ON public.teacher_class_assignments;
CREATE POLICY "tca_scoped_read" ON public.teacher_class_assignments FOR SELECT TO authenticated
  USING (
    public.is_leadership()
    OR teacher_id = auth.uid()
    OR public.can_view_class(class_id)
  );

-- Leadership manages assignments; teachers do not alter their own assignments.
DROP POLICY IF EXISTS "tca_admin" ON public.teacher_class_assignments;
DROP POLICY IF EXISTS "tca_leadership_manage" ON public.teacher_class_assignments;
CREATE POLICY "tca_leadership_manage" ON public.teacher_class_assignments FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

-- Family records: parents can see their own family and its linked children.
CREATE OR REPLACE FUNCTION public.can_view_family(_family_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_leadership()
    OR EXISTS (
      SELECT 1
      FROM public.admission_families af
      JOIN public.admission_family_students afs ON afs.family_id = af.id
      JOIN public.parent_student ps ON ps.student_id = afs.student_id
      WHERE af.id = _family_id AND ps.parent_id = auth.uid()
    )
$$;

DROP POLICY IF EXISTS admission_families_leadership ON public.admission_families;
DROP POLICY IF EXISTS admission_families_scoped ON public.admission_families;
CREATE POLICY admission_families_scoped ON public.admission_families FOR SELECT TO authenticated
  USING (public.can_view_family(id));
CREATE POLICY admission_families_leadership ON public.admission_families FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

DROP POLICY IF EXISTS admission_family_students_leadership ON public.admission_family_students;
DROP POLICY IF EXISTS admission_family_students_scoped ON public.admission_family_students;
CREATE POLICY admission_family_students_scoped ON public.admission_family_students FOR SELECT TO authenticated
  USING (
    public.is_leadership()
    OR EXISTS (
      SELECT 1 FROM public.parent_student ps
      JOIN public.admission_family_students x ON x.student_id = ps.student_id
      WHERE x.family_id = admission_family_students.family_id
        AND ps.parent_id = auth.uid()
    )
  );
CREATE POLICY admission_family_students_leadership ON public.admission_family_students FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

-- Explicitly prevent teachers from editing student records; leadership only.
DROP POLICY IF EXISTS "students_leadership_manage" ON public.students;
CREATE POLICY "students_leadership_manage" ON public.students FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

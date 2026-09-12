-- Fix student profile access for all portal roles.
-- Existing student data and modules are preserved.
-- Leadership: all students
-- Teachers: students in their assigned classes
-- Parents: their linked children
-- Students: their own record

DROP POLICY IF EXISTS "students_read_scoped" ON public.students;
CREATE POLICY "students_read_scoped" ON public.students
  FOR SELECT TO authenticated
  USING (public.can_view_student(id));

-- Keep leadership management access exactly as before.
DROP POLICY IF EXISTS "students_leadership_manage" ON public.students;
CREATE POLICY "students_leadership_manage" ON public.students
  FOR ALL TO authenticated
  USING (public.is_leadership())
  WITH CHECK (public.is_leadership());

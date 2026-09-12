-- ============================================================
-- RAHMA SCHOOL - ROLE SECURITY HARDENING
-- Separates Admin/Director from Headteacher and limits data by role.
-- ============================================================

-- Admin means School Director only. Headteacher is leadership, not admin.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

CREATE OR REPLACE FUNCTION public.is_leadership()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'headteacher')
$$;

CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'teacher')
$$;

CREATE OR REPLACE FUNCTION public.can_view_class(_class_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_leadership()
    OR EXISTS (
      SELECT 1 FROM public.teacher_class_assignments tca
      WHERE tca.teacher_id = auth.uid() AND tca.class_id = _class_id
    )
    OR EXISTS (
      SELECT 1
      FROM public.parent_student ps
      JOIN public.students s ON s.id = ps.student_id
      WHERE ps.parent_id = auth.uid() AND s.current_class_id = _class_id
    )
    OR EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.current_class_id = _class_id AND s.user_id = auth.uid()
    )
$$;

-- Correct student access: leadership sees all; teachers only assigned classes;
-- parents/students see only their own linked learner(s).
CREATE OR REPLACE FUNCTION public.can_view_student(_student_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_leadership()
    OR EXISTS (
      SELECT 1 FROM public.teacher_class_assignments tca
      JOIN public.students s ON s.current_class_id = tca.class_id
      WHERE tca.teacher_id = auth.uid() AND s.id = _student_id
    )
    OR EXISTS (
      SELECT 1 FROM public.parent_student ps
      WHERE ps.student_id = _student_id AND ps.parent_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = _student_id AND s.user_id = auth.uid()
    )
$$;

CREATE OR REPLACE FUNCTION public.can_manage_student(_student_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_leadership()
    OR EXISTS (
      SELECT 1 FROM public.teacher_class_assignments tca
      JOIN public.students s ON s.current_class_id = tca.class_id
      WHERE tca.teacher_id = auth.uid() AND s.id = _student_id
    )
$$;

CREATE OR REPLACE FUNCTION public.can_view_profile(_profile_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT _profile_id = auth.uid()
    OR public.is_leadership()
    OR EXISTS (
      SELECT 1
      FROM public.user_roles ur
      WHERE ur.user_id = _profile_id
        AND ur.role IN ('admin','headteacher','teacher')
    )
    OR EXISTS (
      SELECT 1
      FROM public.parent_student ps
      JOIN public.students s ON s.id = ps.student_id
      JOIN public.teacher_class_assignments tca ON tca.class_id = s.current_class_id
      WHERE tca.teacher_id = auth.uid() AND ps.parent_id = _profile_id
    )
$$;

CREATE OR REPLACE FUNCTION public.can_message_user(_recipient_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT _recipient_id <> auth.uid()
    AND (
      public.is_leadership()
      OR EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = _recipient_id AND ur.role IN ('admin','headteacher')
      )
      OR EXISTS (
        SELECT 1 FROM public.parent_student ps
        JOIN public.students s ON s.id = ps.student_id
        JOIN public.teacher_class_assignments tca ON tca.class_id = s.current_class_id
        WHERE tca.teacher_id = auth.uid() AND ps.parent_id = _recipient_id
      )
      OR EXISTS (
        SELECT 1 FROM public.teacher_class_assignments tca
        WHERE tca.teacher_id = _recipient_id
          AND EXISTS (
            SELECT 1 FROM public.parent_student ps
            JOIN public.students s ON s.id = ps.student_id
            WHERE ps.parent_id = auth.uid() AND s.current_class_id = tca.class_id
          )
      )
    )
$$;

CREATE OR REPLACE FUNCTION public.can_view_announcement(_audience TEXT)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT lower(COALESCE(_audience, 'all')) = 'public'
    OR lower(COALESCE(_audience, 'all')) = 'all'
    OR (lower(_audience) = 'staff' AND public.is_staff())
    OR (lower(_audience) = 'parents' AND public.has_role(auth.uid(), 'parent'))
    OR (lower(_audience) = 'students' AND public.has_role(auth.uid(), 'student'))
$$;

-- Tighten profiles and roles.
DROP POLICY IF EXISTS "profiles_select_own_or_staff" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;
DROP POLICY IF EXISTS "user_roles_select_own_or_staff" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_admin_manage" ON public.user_roles;

DROP POLICY IF EXISTS "profiles_scoped_read" ON public.profiles;
CREATE POLICY "profiles_scoped_read" ON public.profiles FOR SELECT TO authenticated
  USING (public.can_view_profile(id));
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;
CREATE POLICY "profiles_admin_all" ON public.profiles FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "user_roles_own_or_leadership_read" ON public.user_roles;
CREATE POLICY "user_roles_own_or_leadership_read" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_leadership());
DROP POLICY IF EXISTS "user_roles_admin_manage" ON public.user_roles;
CREATE POLICY "user_roles_admin_manage" ON public.user_roles FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Academic structure: leadership manages, staff/parents can only see relevant classes.
DROP POLICY IF EXISTS "years_admin" ON public.academic_years;
DROP POLICY IF EXISTS "years_leadership_manage" ON public.academic_years;
CREATE POLICY "years_leadership_manage" ON public.academic_years FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

DROP POLICY IF EXISTS "classes_admin" ON public.classes;
DROP POLICY IF EXISTS "classes_read_all" ON public.classes;
DROP POLICY IF EXISTS "classes_scoped_read" ON public.classes;
CREATE POLICY "classes_scoped_read" ON public.classes FOR SELECT TO authenticated
  USING (public.is_leadership() OR public.can_view_class(id));
DROP POLICY IF EXISTS "classes_leadership_manage" ON public.classes;
CREATE POLICY "classes_leadership_manage" ON public.classes FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());
DROP POLICY IF EXISTS "classes_public_read" ON public.classes;
CREATE POLICY "classes_public_read" ON public.classes FOR SELECT TO anon USING (TRUE);

DROP POLICY IF EXISTS "subjects_admin" ON public.subjects;
DROP POLICY IF EXISTS "subjects_authenticated_read" ON public.subjects;
CREATE POLICY "subjects_authenticated_read" ON public.subjects FOR SELECT TO authenticated USING (TRUE);
DROP POLICY IF EXISTS "subjects_leadership_manage" ON public.subjects;
CREATE POLICY "subjects_leadership_manage" ON public.subjects FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

DROP POLICY IF EXISTS "tca_staff_read" ON public.teacher_class_assignments;
DROP POLICY IF EXISTS "tca_admin" ON public.teacher_class_assignments;
DROP POLICY IF EXISTS "tca_scoped_read" ON public.teacher_class_assignments;
CREATE POLICY "tca_scoped_read" ON public.teacher_class_assignments FOR SELECT TO authenticated
  USING (public.is_leadership() OR teacher_id = auth.uid());
DROP POLICY IF EXISTS "tca_leadership_manage" ON public.teacher_class_assignments;
CREATE POLICY "tca_leadership_manage" ON public.teacher_class_assignments FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

-- Students and parent links.
DROP POLICY IF EXISTS "students_admin" ON public.students;
DROP POLICY IF EXISTS "students_leadership_manage" ON public.students;
CREATE POLICY "students_leadership_manage" ON public.students FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

DROP POLICY IF EXISTS "ps_read_scoped" ON public.parent_student;
DROP POLICY IF EXISTS "ps_admin" ON public.parent_student;
DROP POLICY IF EXISTS "ps_scoped_read" ON public.parent_student;
CREATE POLICY "ps_scoped_read" ON public.parent_student FOR SELECT TO authenticated
  USING (
    parent_id = auth.uid()
    OR public.is_leadership()
    OR EXISTS (
      SELECT 1 FROM public.teacher_class_assignments tca
      JOIN public.students s ON s.current_class_id = tca.class_id
      WHERE tca.teacher_id = auth.uid() AND s.id = student_id
    )
  );
DROP POLICY IF EXISTS "ps_leadership_manage" ON public.parent_student;
CREATE POLICY "ps_leadership_manage" ON public.parent_student FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

-- Admissions and enquiries: director + headteacher only.
DROP POLICY IF EXISTS "applications_staff_read" ON public.applications;
DROP POLICY IF EXISTS "applications_admin" ON public.applications;
DROP POLICY IF EXISTS "applications_leadership_read" ON public.applications;
CREATE POLICY "applications_leadership_read" ON public.applications FOR SELECT TO authenticated
  USING (public.is_leadership());
DROP POLICY IF EXISTS "applications_admin_manage" ON public.applications;
CREATE POLICY "applications_admin_manage" ON public.applications FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "enquiries_admin" ON public.contact_enquiries;
DROP POLICY IF EXISTS "enquiries_admin" ON public.contact_enquiries;
CREATE POLICY "enquiries_admin" ON public.contact_enquiries FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Attendance.
DROP POLICY IF EXISTS "attendance_staff_write" ON public.attendance_records;
DROP POLICY IF EXISTS "attendance_manage_scoped" ON public.attendance_records;
CREATE POLICY "attendance_manage_scoped" ON public.attendance_records FOR INSERT TO authenticated
  WITH CHECK (public.can_manage_student(student_id) AND marked_by = auth.uid());
DROP POLICY IF EXISTS "attendance_update_scoped" ON public.attendance_records;
CREATE POLICY "attendance_update_scoped" ON public.attendance_records FOR UPDATE TO authenticated
  USING (public.can_manage_student(student_id))
  WITH CHECK (public.can_manage_student(student_id) AND marked_by = auth.uid());
DROP POLICY IF EXISTS "attendance_delete_leadership" ON public.attendance_records;
CREATE POLICY "attendance_delete_leadership" ON public.attendance_records FOR DELETE TO authenticated
  USING (public.is_leadership());

-- Exams/marks: published results for families; teachers manage only assigned classes.
DROP POLICY IF EXISTS "exams_read" ON public.exams;
DROP POLICY IF EXISTS "exams_staff" ON public.exams;
DROP POLICY IF EXISTS "exams_read_scoped" ON public.exams;
CREATE POLICY "exams_read_scoped" ON public.exams FOR SELECT TO authenticated
  USING (public.is_leadership() OR published OR public.is_teacher());
DROP POLICY IF EXISTS "exams_leadership_manage" ON public.exams;
CREATE POLICY "exams_leadership_manage" ON public.exams FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

DROP POLICY IF EXISTS "exam_subjects_read" ON public.exam_subjects;
DROP POLICY IF EXISTS "exam_subjects_staff" ON public.exam_subjects;
DROP POLICY IF EXISTS "exam_subjects_scoped_read" ON public.exam_subjects;
CREATE POLICY "exam_subjects_scoped_read" ON public.exam_subjects FOR SELECT TO authenticated
  USING (public.is_leadership() OR public.can_view_class(class_id));
DROP POLICY IF EXISTS "exam_subjects_leadership_manage" ON public.exam_subjects;
CREATE POLICY "exam_subjects_leadership_manage" ON public.exam_subjects FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

DROP POLICY IF EXISTS "marks_staff" ON public.marks;
DROP POLICY IF EXISTS "marks_teacher_manage" ON public.marks;
CREATE POLICY "marks_teacher_manage" ON public.marks FOR INSERT TO authenticated
  WITH CHECK (
    (public.is_leadership() OR EXISTS (
      SELECT 1 FROM public.exam_subjects es
      WHERE es.id = exam_subject_id AND public.can_view_class(es.class_id)
    ))
    AND entered_by = auth.uid()
  );
DROP POLICY IF EXISTS "marks_teacher_update" ON public.marks;
CREATE POLICY "marks_teacher_update" ON public.marks FOR UPDATE TO authenticated
  USING (
    public.is_leadership()
    OR EXISTS (
      SELECT 1 FROM public.exam_subjects es
      WHERE es.id = exam_subject_id AND public.can_view_class(es.class_id)
    )
  )
  WITH CHECK (entered_by = auth.uid());
DROP POLICY IF EXISTS "marks_leadership_delete" ON public.marks;
CREATE POLICY "marks_leadership_delete" ON public.marks FOR DELETE TO authenticated
  USING (public.is_leadership());

-- Assignments and notes.
DROP POLICY IF EXISTS "assignments_read" ON public.assignments;
DROP POLICY IF EXISTS "assignments_staff" ON public.assignments;
DROP POLICY IF EXISTS "assignments_scoped_read" ON public.assignments;
CREATE POLICY "assignments_scoped_read" ON public.assignments FOR SELECT TO authenticated
  USING (public.can_view_class(class_id));
DROP POLICY IF EXISTS "assignments_manage" ON public.assignments;
CREATE POLICY "assignments_manage" ON public.assignments FOR ALL TO authenticated
  USING (
    public.is_leadership()
    OR (teacher_id = auth.uid() AND public.has_role(auth.uid(),'teacher') AND public.can_view_class(class_id))
  )
  WITH CHECK (
    public.is_leadership()
    OR (teacher_id = auth.uid() AND public.has_role(auth.uid(),'teacher') AND public.can_view_class(class_id))
  );

DROP POLICY IF EXISTS "notes_read" ON public.notes;
DROP POLICY IF EXISTS "notes_staff" ON public.notes;
DROP POLICY IF EXISTS "notes_scoped_read" ON public.notes;
CREATE POLICY "notes_scoped_read" ON public.notes FOR SELECT TO authenticated
  USING (public.can_view_class(class_id));
DROP POLICY IF EXISTS "notes_manage" ON public.notes;
CREATE POLICY "notes_manage" ON public.notes FOR ALL TO authenticated
  USING (
    public.is_leadership()
    OR (teacher_id = auth.uid() AND public.has_role(auth.uid(),'teacher') AND public.can_view_class(class_id))
  )
  WITH CHECK (
    public.is_leadership()
    OR (teacher_id = auth.uid() AND public.has_role(auth.uid(),'teacher') AND public.can_view_class(class_id))
  );

-- Timetable.
DROP POLICY IF EXISTS "timetable_read" ON public.timetable_entries;
DROP POLICY IF EXISTS "timetable_staff" ON public.timetable_entries;
DROP POLICY IF EXISTS "timetable_scoped_read" ON public.timetable_entries;
CREATE POLICY "timetable_scoped_read" ON public.timetable_entries FOR SELECT TO authenticated
  USING (public.can_view_class(class_id) OR teacher_id = auth.uid());
DROP POLICY IF EXISTS "timetable_leadership_manage" ON public.timetable_entries;
CREATE POLICY "timetable_leadership_manage" ON public.timetable_entries FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

-- Finance: parents/students own records, leadership has school-wide view/manage.
DROP POLICY IF EXISTS "fees_read" ON public.fee_structures;
DROP POLICY IF EXISTS "fees_admin" ON public.fee_structures;
DROP POLICY IF EXISTS "fees_scoped_read" ON public.fee_structures;
CREATE POLICY "fees_scoped_read" ON public.fee_structures FOR SELECT TO authenticated
  USING (public.is_leadership() OR class_id IS NULL OR public.can_view_class(class_id));
DROP POLICY IF EXISTS "fees_admin_manage" ON public.fee_structures;
CREATE POLICY "fees_admin_manage" ON public.fee_structures FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "invoices_admin" ON public.invoices;
DROP POLICY IF EXISTS "invoices_admin_manage" ON public.invoices;
CREATE POLICY "invoices_admin_manage" ON public.invoices FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "payments_admin" ON public.payments;
DROP POLICY IF EXISTS "payments_admin_manage" ON public.payments;
CREATE POLICY "payments_admin_manage" ON public.payments FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Uniforms and inventory.
DROP POLICY IF EXISTS "uniform_orders_own_read" ON public.uniform_orders;
DROP POLICY IF EXISTS "uniform_orders_own_insert" ON public.uniform_orders;
DROP POLICY IF EXISTS "uniform_orders_admin" ON public.uniform_orders;
DROP POLICY IF EXISTS "uniform_orders_own_read" ON public.uniform_orders;
CREATE POLICY "uniform_orders_own_read" ON public.uniform_orders FOR SELECT TO authenticated
  USING (parent_id = auth.uid() OR public.is_leadership());
DROP POLICY IF EXISTS "uniform_orders_own_insert" ON public.uniform_orders;
CREATE POLICY "uniform_orders_own_insert" ON public.uniform_orders FOR INSERT TO authenticated
  WITH CHECK (parent_id = auth.uid() AND public.has_role(auth.uid(),'parent'));
DROP POLICY IF EXISTS "uniform_orders_admin" ON public.uniform_orders;
CREATE POLICY "uniform_orders_admin" ON public.uniform_orders FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "inventory_staff_read" ON public.inventory_items;
DROP POLICY IF EXISTS "inventory_admin" ON public.inventory_items;
DROP POLICY IF EXISTS "inventory_leadership_read" ON public.inventory_items;
CREATE POLICY "inventory_leadership_read" ON public.inventory_items FOR SELECT TO authenticated
  USING (public.is_leadership());
DROP POLICY IF EXISTS "inventory_admin" ON public.inventory_items;
CREATE POLICY "inventory_admin" ON public.inventory_items FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- News: public published; leadership manages school news.
DROP POLICY IF EXISTS "news_staff_read_all" ON public.news_posts;
DROP POLICY IF EXISTS "news_staff_write" ON public.news_posts;
DROP POLICY IF EXISTS "news_leadership_read_all" ON public.news_posts;
CREATE POLICY "news_leadership_read_all" ON public.news_posts FOR SELECT TO authenticated
  USING (public.is_leadership());
DROP POLICY IF EXISTS "news_leadership_write" ON public.news_posts;
CREATE POLICY "news_leadership_write" ON public.news_posts FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

-- Announcements: audience-aware reads; leadership publishes.
DROP POLICY IF EXISTS "announcements_auth_read" ON public.announcements;
DROP POLICY IF EXISTS "announcements_staff_write" ON public.announcements;
DROP POLICY IF EXISTS "announcements_audience_read" ON public.announcements;
CREATE POLICY "announcements_audience_read" ON public.announcements FOR SELECT TO authenticated
  USING (public.can_view_announcement(audience));
DROP POLICY IF EXISTS "announcements_leadership_write" ON public.announcements;
CREATE POLICY "announcements_leadership_write" ON public.announcements FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

-- Calendar: audience-aware and class-scoped.
DROP POLICY IF EXISTS "events_auth_read" ON public.calendar_events;
DROP POLICY IF EXISTS "events_staff_write" ON public.calendar_events;
DROP POLICY IF EXISTS "events_scoped_read" ON public.calendar_events;
CREATE POLICY "events_scoped_read" ON public.calendar_events FOR SELECT TO authenticated
  USING (
    public.is_leadership()
    OR lower(audience) IN ('all','public')
    OR (lower(audience) = 'staff' AND public.is_staff())
    OR (lower(audience) = 'parents' AND public.has_role(auth.uid(),'parent'))
    OR (lower(audience) = 'students' AND public.has_role(auth.uid(),'student'))
    OR (target_class_id IS NOT NULL AND public.can_view_class(target_class_id))
  );
DROP POLICY IF EXISTS "events_leadership_write" ON public.calendar_events;
CREATE POLICY "events_leadership_write" ON public.calendar_events FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

-- Internal messages: restrict who can be messaged, and protect recipient lists.
DROP POLICY IF EXISTS "messages_send" ON public.messages;
DROP POLICY IF EXISTS "messages_send_scoped" ON public.messages;
CREATE POLICY "messages_send_scoped" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND public.can_message_user(recipient_id));

-- Revoke direct table access that is no longer needed by non-leadership for role data.
REVOKE SELECT ON public.user_roles FROM authenticated;
GRANT SELECT ON public.user_roles TO authenticated;

-- Refresh function privileges.
GRANT EXECUTE ON FUNCTION public.is_leadership() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_teacher() TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_view_class(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_manage_student(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_view_profile(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_message_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_view_announcement(TEXT) TO authenticated;

COMMENT ON FUNCTION public.is_admin() IS 'School Director/Admin only; Headteacher is not an admin.';
COMMENT ON FUNCTION public.is_leadership() IS 'School Director/Admin or Headteacher.';

-- Users need to see the role labels of contacts they are already allowed to see.
-- This does not expose unrelated accounts because can_view_profile is scoped.
DROP POLICY IF EXISTS "user_roles_own_or_leadership_read" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_scoped_read" ON public.user_roles;
CREATE POLICY "user_roles_scoped_read" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_leadership() OR public.can_view_profile(user_id));

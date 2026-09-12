-- Rahma school workflow upgrades: CBC through Grade 9, admissions, exams,
-- family/student balances and M-Pesa transaction tracking.

-- Fix the role boundary: Headteacher is leadership, but not Admin.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;
npm ru
CREATE OR REPLACE FUNCTION public.is_leadership()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'headteacher')
$$;

-- Extend the supplied class catalogue through Junior Secondary.
INSERT INTO public.classes (academic_year_id, name, level_order)
SELECT y.id, c.name, c.level_order
FROM public.academic_years y
CROSS JOIN (VALUES ('Grade 7',9),('Grade 8',10),('Grade 9',11)) AS c(name, level_order)
WHERE y.is_current = TRUE
  AND NOT EXISTS (
    SELECT 1 FROM public.classes x WHERE x.academic_year_id = y.id AND lower(x.name)=lower(c.name)
  );

-- Approved admission families allow one parent/guardian to have multiple learners.
CREATE TABLE IF NOT EXISTS public.admission_families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  parent_email TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admission_family_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.admission_families(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (family_id, student_id)
);

ALTER TABLE public.admission_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_family_students ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admission_families TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admission_family_students TO authenticated;
DROP POLICY IF EXISTS admission_families_leadership ON public.admission_families;
CREATE POLICY admission_families_leadership ON public.admission_families FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());
DROP POLICY IF EXISTS admission_family_students_leadership ON public.admission_family_students;
CREATE POLICY admission_family_students_leadership ON public.admission_family_students FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

-- Exam registration/application workflow.
CREATE TABLE IF NOT EXISTS public.exam_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('pending','registered','rejected')),
  mercy_granted BOOLEAN NOT NULL DEFAULT FALSE,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  UNIQUE (exam_id, student_id)
);

ALTER TABLE public.exam_registrations ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exam_registrations TO authenticated;
DROP POLICY IF EXISTS exam_registrations_read ON public.exam_registrations;
CREATE POLICY exam_registrations_read ON public.exam_registrations FOR SELECT TO authenticated
  USING (public.is_leadership() OR public.can_view_student(student_id));
DROP POLICY IF EXISTS exam_registrations_family_insert ON public.exam_registrations;
CREATE POLICY exam_registrations_family_insert ON public.exam_registrations FOR INSERT TO authenticated
  WITH CHECK (public.can_view_student(student_id) AND (public.has_role(auth.uid(),'parent') OR public.has_role(auth.uid(),'student')));
DROP POLICY IF EXISTS exam_registrations_leadership_manage ON public.exam_registrations;
CREATE POLICY exam_registrations_leadership_manage ON public.exam_registrations FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

CREATE OR REPLACE FUNCTION public.student_balance(_student_id UUID)
RETURNS NUMERIC LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE((SELECT SUM(amount) FROM public.invoices WHERE student_id = _student_id),0)
       - COALESCE((SELECT SUM(amount) FROM public.payments WHERE student_id = _student_id),0)
$$;

CREATE OR REPLACE FUNCTION public.can_register_for_exam(_student_id UUID, _exam_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.student_balance(_student_id) <= 0
    OR EXISTS (
      SELECT 1 FROM public.exam_registrations er
      WHERE er.student_id = _student_id AND er.exam_id = _exam_id AND er.mercy_granted = TRUE
    )
$$;
GRANT EXECUTE ON FUNCTION public.student_balance(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_register_for_exam(UUID,UUID) TO authenticated;

-- Teacher-to-student remarks, visible to the student's parent/student and leadership.
CREATE TABLE IF NOT EXISTS public.student_remarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  remark TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.student_remarks ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_remarks TO authenticated;
DROP POLICY IF EXISTS student_remarks_read ON public.student_remarks;
CREATE POLICY student_remarks_read ON public.student_remarks FOR SELECT TO authenticated
  USING (public.can_view_student(student_id));
DROP POLICY IF EXISTS student_remarks_teacher_write ON public.student_remarks;
CREATE POLICY student_remarks_teacher_write ON public.student_remarks FOR INSERT TO authenticated
  WITH CHECK (
    teacher_id = auth.uid() AND public.has_role(auth.uid(),'teacher')
    AND EXISTS (
      SELECT 1 FROM public.teacher_class_assignments tca
      JOIN public.students s ON s.current_class_id = tca.class_id
      WHERE tca.teacher_id = auth.uid() AND s.id = student_id
    )
  );
DROP POLICY IF EXISTS student_remarks_teacher_update ON public.student_remarks;
CREATE POLICY student_remarks_teacher_update ON public.student_remarks FOR UPDATE TO authenticated
  USING (teacher_id = auth.uid()) WITH CHECK (teacher_id = auth.uid());
DROP POLICY IF EXISTS student_remarks_leadership_manage ON public.student_remarks;
CREATE POLICY student_remarks_leadership_manage ON public.student_remarks FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

-- M-Pesa payment requests. The Edge Function/callback can turn a successful
-- transaction into a row in public.payments, which immediately changes balance.
CREATE TABLE IF NOT EXISTS public.mpesa_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  phone TEXT NOT NULL,
  account_reference TEXT NOT NULL,
  checkout_request_id TEXT UNIQUE,
  merchant_request_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','cancelled')),
  result_code TEXT,
  result_description TEXT,
  mpesa_receipt TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
ALTER TABLE public.mpesa_transactions ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.mpesa_transactions TO authenticated;
GRANT ALL ON public.mpesa_transactions TO service_role;
DROP POLICY IF EXISTS mpesa_transactions_read ON public.mpesa_transactions;
CREATE POLICY mpesa_transactions_read ON public.mpesa_transactions FOR SELECT TO authenticated
  USING (public.is_leadership() OR parent_id = auth.uid() OR public.can_view_student(student_id));
DROP POLICY IF EXISTS mpesa_transactions_parent_insert ON public.mpesa_transactions;
CREATE POLICY mpesa_transactions_parent_insert ON public.mpesa_transactions FOR INSERT TO authenticated
  WITH CHECK (parent_id = auth.uid() AND public.has_role(auth.uid(),'parent') AND public.can_view_student(student_id));

CREATE INDEX IF NOT EXISTS idx_admission_family_students_family ON public.admission_family_students(family_id);
CREATE INDEX IF NOT EXISTS idx_exam_registrations_exam ON public.exam_registrations(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_registrations_student ON public.exam_registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_student_remarks_student ON public.student_remarks(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mpesa_student ON public.mpesa_transactions(student_id, created_at DESC);

-- Tighten base tables that previously let any staff read/write too broadly.
DROP POLICY IF EXISTS "students_read_scoped" ON public.students;
CREATE POLICY "students_read_scoped" ON public.students FOR SELECT TO authenticated
  USING (public.can_view_student(id));
DROP POLICY IF EXISTS "students_admin" ON public.students;
DROP POLICY IF EXISTS "students_leadership_manage" ON public.students;
CREATE POLICY "students_leadership_manage" ON public.students FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

DROP POLICY IF EXISTS "attendance_staff_write" ON public.attendance_records;
DROP POLICY IF EXISTS "attendance_manage_scoped" ON public.attendance_records;
CREATE POLICY "attendance_manage_scoped" ON public.attendance_records FOR INSERT TO authenticated
  WITH CHECK (public.can_manage_student(student_id) AND marked_by = auth.uid());
DROP POLICY IF EXISTS "attendance_update_scoped" ON public.attendance_records;
CREATE POLICY "attendance_update_scoped" ON public.attendance_records FOR UPDATE TO authenticated
  USING (public.can_manage_student(student_id)) WITH CHECK (public.can_manage_student(student_id) AND marked_by = auth.uid());

-- Finance: Admin can manage; Headteacher can view school balances but cannot create/edit invoices or receipts.
DROP POLICY IF EXISTS "invoices_admin_manage" ON public.invoices;
CREATE POLICY "invoices_leadership_read" ON public.invoices FOR SELECT TO authenticated
  USING (public.is_leadership() OR public.can_view_student(student_id));
DROP POLICY IF EXISTS "invoices_admin_manage" ON public.invoices;
CREATE POLICY "invoices_admin_manage" ON public.invoices FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "payments_admin_manage" ON public.payments;
CREATE POLICY "payments_leadership_read" ON public.payments FOR SELECT TO authenticated
  USING (public.is_leadership() OR public.can_view_student(student_id));
DROP POLICY IF EXISTS "payments_admin_manage" ON public.payments;
CREATE POLICY "payments_admin_manage" ON public.payments FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Applications: Admin/headteacher can review; only Admin can finalize approval.
DROP POLICY IF EXISTS "applications_admin_manage" ON public.applications;
CREATE POLICY "applications_admin_manage" ON public.applications FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "applications_leadership_read" ON public.applications;
CREATE POLICY "applications_leadership_read" ON public.applications FOR SELECT TO authenticated
  USING (public.is_leadership());

-- Timetable/classes: leadership only manages; family/staff reads are scoped.
DROP POLICY IF EXISTS "classes_scoped_read" ON public.classes;
DROP POLICY IF EXISTS "classes_scoped_read" ON public.classes;
CREATE POLICY "classes_scoped_read" ON public.classes FOR SELECT TO authenticated
  USING (public.is_leadership() OR public.can_view_class(id));
DROP POLICY IF EXISTS "classes_leadership_manage" ON public.classes;
DROP POLICY IF EXISTS "classes_leadership_manage" ON public.classes;
CREATE POLICY "classes_leadership_manage" ON public.classes FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());
DROP POLICY IF EXISTS "timetable_scoped_read" ON public.timetable_entries;
DROP POLICY IF EXISTS "timetable_scoped_read" ON public.timetable_entries;
CREATE POLICY "timetable_scoped_read" ON public.timetable_entries FOR SELECT TO authenticated
  USING (public.can_view_class(class_id) OR teacher_id = auth.uid());
DROP POLICY IF EXISTS "timetable_leadership_manage" ON public.timetable_entries;
DROP POLICY IF EXISTS "timetable_leadership_manage" ON public.timetable_entries;
CREATE POLICY "timetable_leadership_manage" ON public.timetable_entries FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

-- Parent/student cannot see arbitrary announcements; existing helper handles audience.
DROP POLICY IF EXISTS "announcements_auth_read" ON public.announcements;
DROP POLICY IF EXISTS "announcements_audience_read" ON public.announcements;
DROP POLICY IF EXISTS "announcements_audience_read" ON public.announcements;
CREATE POLICY "announcements_audience_read" ON public.announcements FOR SELECT TO authenticated
  USING (public.can_view_announcement(audience));

COMMENT ON TABLE public.admission_families IS 'Approved parent/guardian family records; one family can have multiple students.';
COMMENT ON TABLE public.exam_registrations IS 'Exam applications/registrations with balance and mercy rules.';
COMMENT ON TABLE public.mpesa_transactions IS 'M-Pesa checkout requests; completed requests are posted to payments by the secure callback.';

-- Atomic application approval. Creates a family + learner and links an existing
-- parent Auth account when the application email matches it.
CREATE OR REPLACE FUNCTION public.approve_admission_application(_application_id UUID, _class_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  a public.applications%ROWTYPE;
  family_id UUID;
  student_id UUID;
  parent_user UUID;
  adm_no TEXT;
BEGIN
  IF NOT public.is_leadership() THEN RAISE EXCEPTION 'Only Admin or Headteacher may approve admissions.'; END IF;
  SELECT * INTO a FROM public.applications WHERE id = _application_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Application not found.'; END IF;
  IF a.status IN ('accepted') THEN RAISE EXCEPTION 'Application is already accepted.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.classes WHERE id = _class_id) THEN RAISE EXCEPTION 'Selected class does not exist.'; END IF;

  SELECT id INTO family_id FROM public.admission_families
  WHERE lower(coalesce(parent_email,'')) = lower(coalesce(a.parent_email,''))
    AND parent_phone = a.parent_phone AND status = 'active'
  ORDER BY created_at DESC LIMIT 1;

  IF family_id IS NULL THEN
    INSERT INTO public.admission_families(parent_name,parent_phone,parent_email,approved_by)
    VALUES(a.parent_name,a.parent_phone,a.parent_email,auth.uid()) RETURNING id INTO family_id;
  END IF;

  adm_no := 'RJ-' || to_char(current_date,'YYYY') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,7));
  INSERT INTO public.students(admission_no,first_name,last_name,date_of_birth,current_class_id,admission_date,status)
  VALUES(adm_no,
         split_part(trim(a.child_name),' ',1),
         nullif(trim(substr(trim(a.child_name),length(split_part(trim(a.child_name),' ',1))+1)),'') ,
         a.child_dob,_class_id,current_date,'active')
  RETURNING id INTO student_id;

  INSERT INTO public.admission_family_students(family_id,student_id) VALUES(family_id,student_id);

  IF a.parent_email IS NOT NULL THEN
    SELECT id INTO parent_user FROM auth.users WHERE lower(email)=lower(a.parent_email) LIMIT 1;
    IF parent_user IS NOT NULL THEN
      INSERT INTO public.parent_student(parent_id,student_id,relationship,is_primary)
      VALUES(parent_user,student_id,'parent',TRUE)
      ON CONFLICT (parent_id,student_id) DO NOTHING;
    END IF;
  END IF;

  UPDATE public.applications SET status='accepted',reviewed_by=auth.uid(),reviewed_at=now() WHERE id=_application_id;
  RETURN jsonb_build_object('family_id',family_id,'student_id',student_id,'admission_no',adm_no);
END; $$;
GRANT EXECUTE ON FUNCTION public.approve_admission_application(UUID,UUID) TO authenticated;

DROP POLICY IF EXISTS "applications_admin_manage" ON public.applications;
DROP POLICY IF EXISTS "applications_leadership_manage" ON public.applications;
CREATE POLICY "applications_leadership_manage" ON public.applications FOR ALL TO authenticated
  USING (public.is_leadership()) WITH CHECK (public.is_leadership());

-- Headteacher must not receive raw invoices/payments. Expose only aggregated
-- outstanding balances through a controlled function.
CREATE OR REPLACE FUNCTION public.get_outstanding_balances()
RETURNS TABLE(student_id UUID, student_name TEXT, admission_no TEXT, balance NUMERIC)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT s.id, concat_ws(' ',s.first_name,s.last_name), s.admission_no,
    public.student_balance(s.id)
  FROM public.students s
  WHERE public.has_role(auth.uid(),'admin')
     OR (public.has_role(auth.uid(),'headteacher') AND public.student_balance(s.id) > 0)
$$;
GRANT EXECUTE ON FUNCTION public.get_outstanding_balances() TO authenticated;

DROP POLICY IF EXISTS "invoices_read_scoped" ON public.invoices;
DROP POLICY IF EXISTS "invoices_leadership_read" ON public.invoices;
DROP POLICY IF EXISTS "payments_read_scoped" ON public.payments;
DROP POLICY IF EXISTS "payments_leadership_read" ON public.payments;
DROP POLICY IF EXISTS "invoices_family_read" ON public.invoices;
CREATE POLICY "invoices_family_read" ON public.invoices FOR SELECT TO authenticated
  USING ((public.has_role(auth.uid(),'parent') OR public.has_role(auth.uid(),'student')) AND public.can_view_student(student_id));
DROP POLICY IF EXISTS "invoices_admin_manage" ON public.invoices;
CREATE POLICY "invoices_admin_manage" ON public.invoices FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "payments_family_read" ON public.payments;
CREATE POLICY "payments_family_read" ON public.payments FOR SELECT TO authenticated
  USING ((public.has_role(auth.uid(),'parent') OR public.has_role(auth.uid(),'student')) AND public.can_view_student(student_id));
DROP POLICY IF EXISTS "payments_admin_manage" ON public.payments;
CREATE POLICY "payments_admin_manage" ON public.payments FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Communication permissions: only Admin/Headteacher may compose messages.
-- Teachers see only their sent messages; parents/students see only received messages.
DROP POLICY IF EXISTS "messages_read_own" ON public.messages;
DROP POLICY IF EXISTS "messages_send_scoped" ON public.messages;
DROP POLICY IF EXISTS "messages_mark_read" ON public.messages;
DROP POLICY IF EXISTS "messages_read_role_scoped" ON public.messages;
CREATE POLICY "messages_read_role_scoped" ON public.messages FOR SELECT TO authenticated
  USING (
    (public.is_leadership() AND (sender_id = auth.uid() OR recipient_id = auth.uid()))
    OR (public.has_role(auth.uid(),'teacher') AND sender_id = auth.uid())
    OR ((public.has_role(auth.uid(),'parent') OR public.has_role(auth.uid(),'student')) AND recipient_id = auth.uid())
  );
DROP POLICY IF EXISTS "messages_leadership_send" ON public.messages;
CREATE POLICY "messages_leadership_send" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (public.is_leadership() AND sender_id = auth.uid() AND public.can_message_user(recipient_id));
CREATE POLICY "messages_mark_read" ON public.messages FOR UPDATE TO authenticated
  USING (recipient_id = auth.uid() AND (public.is_leadership() OR public.has_role(auth.uid(),'parent') OR public.has_role(auth.uid(),'student')))
  WITH CHECK (recipient_id = auth.uid());

-- One-name learners are valid; keep last_name non-null for the existing schema.
CREATE OR REPLACE FUNCTION public.approve_admission_application(_application_id UUID, _class_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE a public.applications%ROWTYPE; family_id UUID; student_id UUID; parent_user UUID; adm_no TEXT; first_part TEXT; last_part TEXT;
BEGIN
  IF NOT public.is_leadership() THEN RAISE EXCEPTION 'Only Admin or Headteacher may approve admissions.'; END IF;
  SELECT * INTO a FROM public.applications WHERE id=_application_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Application not found.'; END IF;
  IF a.status='accepted' THEN RAISE EXCEPTION 'Application is already accepted.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.classes WHERE id=_class_id) THEN RAISE EXCEPTION 'Selected class does not exist.'; END IF;
  SELECT id INTO family_id FROM public.admission_families WHERE lower(coalesce(parent_email,''))=lower(coalesce(a.parent_email,'')) AND parent_phone=a.parent_phone AND status='active' ORDER BY created_at DESC LIMIT 1;
  IF family_id IS NULL THEN INSERT INTO public.admission_families(parent_name,parent_phone,parent_email,approved_by) VALUES(a.parent_name,a.parent_phone,a.parent_email,auth.uid()) RETURNING id INTO family_id; END IF;
  first_part:=split_part(trim(a.child_name),' ',1); last_part:=nullif(trim(substr(trim(a.child_name),length(first_part)+1)),'');
  adm_no:='RJ-'||to_char(current_date,'YYYY')||'-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,7));
  INSERT INTO public.students(admission_no,first_name,last_name,date_of_birth,current_class_id,admission_date,status) VALUES(adm_no,first_part,coalesce(last_part,''),a.child_dob,_class_id,current_date,'active') RETURNING id INTO student_id;
  INSERT INTO public.admission_family_students(family_id,student_id) VALUES(family_id,student_id);
  IF a.parent_email IS NOT NULL THEN SELECT id INTO parent_user FROM auth.users WHERE lower(email)=lower(a.parent_email) LIMIT 1; IF parent_user IS NOT NULL THEN INSERT INTO public.parent_student(parent_id,student_id,relationship,is_primary) VALUES(parent_user,student_id,'parent',TRUE) ON CONFLICT (parent_id,student_id) DO NOTHING; END IF; END IF;
  UPDATE public.applications SET status='accepted',reviewed_by=auth.uid(),reviewed_at=now() WHERE id=_application_id;
  RETURN jsonb_build_object('family_id',family_id,'student_id',student_id,'admission_no',adm_no);
END; $$;
GRANT EXECUTE ON FUNCTION public.approve_admission_application(UUID,UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_outstanding_parent_balances()
RETURNS TABLE(parent_id UUID, parent_name TEXT, phone TEXT, balance NUMERIC)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.id, concat_ws(' ',p.first_name,p.last_name), p.phone,
    COALESCE(SUM(public.student_balance(ps.student_id)),0)
  FROM public.profiles p
  JOIN public.parent_student ps ON ps.parent_id=p.id
  WHERE public.has_role(auth.uid(),'admin')
     OR public.has_role(auth.uid(),'headteacher')
  GROUP BY p.id,p.first_name,p.last_name,p.phone
  HAVING COALESCE(SUM(public.student_balance(ps.student_id)),0) > 0
$$;
GRANT EXECUTE ON FUNCTION public.get_outstanding_parent_balances() TO authenticated;

CREATE OR REPLACE FUNCTION public.manual_admit_student(
  _parent_first_name TEXT,
  _parent_last_name TEXT,
  _parent_phone TEXT,
  _parent_email TEXT,
  _relationship TEXT,
  _student_first_name TEXT,
  _student_last_name TEXT,
  _date_of_birth DATE,
  _gender TEXT,
  _class_id UUID,
  _admission_no TEXT,
  _fee_amount NUMERIC DEFAULT 0
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_family_id UUID;
  v_student_id UUID;
  v_parent_user UUID;
  v_adm_no TEXT;
  v_inv_id UUID;
BEGIN
  IF NOT public.is_leadership() THEN
    RAISE EXCEPTION 'Only Admin or Headteacher may admit learners.';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.classes c WHERE c.id = _class_id) THEN
    RAISE EXCEPTION 'Selected class does not exist.';
  END IF;

  IF coalesce(trim(_parent_first_name), '') = ''
     OR coalesce(trim(_parent_last_name), '') = ''
     OR coalesce(trim(_parent_phone), '') = '' THEN
    RAISE EXCEPTION 'Parent name and phone are required.';
  END IF;

  IF coalesce(trim(_student_first_name), '') = ''
     OR coalesce(trim(_student_last_name), '') = '' THEN
    RAISE EXCEPTION 'Student name is required.';
  END IF;

  v_adm_no := trim(_admission_no);
  IF v_adm_no = '' THEN
    RAISE EXCEPTION 'Admission number is required.';
  END IF;

  IF length(v_adm_no) < 3 THEN
    RAISE EXCEPTION 'Admission number must be at least 3 characters.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.students s
    WHERE lower(trim(s.admission_no)) = lower(v_adm_no)
  ) THEN
    RAISE EXCEPTION 'Admission number already exists. Enter a unique admission number.';
  END IF;

  SELECT af.id
    INTO v_family_id
  FROM public.admission_families af
  WHERE af.parent_phone = trim(_parent_phone)
    AND lower(coalesce(af.parent_email, '')) = lower(coalesce(trim(_parent_email), ''))
    AND af.status = 'active'
  ORDER BY af.created_at DESC
  LIMIT 1;

  IF v_family_id IS NULL THEN
    INSERT INTO public.admission_families(
      parent_name,
      parent_phone,
      parent_email,
      approved_by
    )
    VALUES (
      trim(_parent_first_name) || ' ' || trim(_parent_last_name),
      trim(_parent_phone),
      nullif(trim(_parent_email), ''),
      auth.uid()
    )
    RETURNING id INTO v_family_id;
  END IF;

  INSERT INTO public.students(
    admission_no,
    first_name,
    last_name,
    date_of_birth,
    gender,
    current_class_id,
    admission_date,
    status
  )
  VALUES (
    v_adm_no,
    trim(_student_first_name),
    trim(_student_last_name),
    _date_of_birth,
    nullif(trim(_gender), ''),
    _class_id,
    current_date,
    'active'
  )
  RETURNING id INTO v_student_id;

  INSERT INTO public.admission_family_students(family_id, student_id)
  VALUES (v_family_id, v_student_id);

  IF nullif(trim(_parent_email), '') IS NOT NULL THEN
    SELECT au.id
      INTO v_parent_user
    FROM auth.users au
    WHERE lower(au.email) = lower(trim(_parent_email))
    LIMIT 1;

    IF v_parent_user IS NOT NULL THEN
      INSERT INTO public.parent_student(
        parent_id,
        student_id,
        relationship,
        is_primary
      )
      VALUES (
        v_parent_user,
        v_student_id,
        coalesce(nullif(trim(_relationship), ''), 'parent'),
        TRUE
      )
      ON CONFLICT (parent_id, student_id) DO NOTHING;
    END IF;
  END IF;

  IF coalesce(_fee_amount, 0) > 0 THEN
    INSERT INTO public.invoices(student_id, amount, due_date, status)
    VALUES (v_student_id, _fee_amount, current_date, 'unpaid')
    RETURNING id INTO v_inv_id;
  END IF;

  RETURN jsonb_build_object(
    'family_id', v_family_id,
    'student_id', v_student_id,
    'admission_no', v_adm_no,
    'invoice_id', v_inv_id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.manual_admit_student(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, DATE, TEXT, UUID, TEXT, NUMERIC
) TO authenticated;

CREATE OR REPLACE FUNCTION public.create_student_for_parent_family(
  _parent_id UUID,
  _first_name TEXT,
  _last_name TEXT,
  _date_of_birth DATE DEFAULT NULL,
  _gender TEXT DEFAULT NULL,
  _class_id UUID DEFAULT NULL,
  _admission_no TEXT DEFAULT NULL,
  _relationship TEXT DEFAULT 'parent'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  family_id UUID;
  student_id UUID;
  parent_profile public.profiles%ROWTYPE;
  v_adm_no TEXT;
BEGIN
  IF NOT public.is_leadership() THEN RAISE EXCEPTION 'Only Admin or Headteacher may manage parent families.'; END IF;
  SELECT * INTO parent_profile FROM public.profiles WHERE id = _parent_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Parent profile not found.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _parent_id AND role = 'parent') THEN RAISE EXCEPTION 'Selected account is not a parent account.'; END IF;
  IF NULLIF(trim(_first_name),'') IS NULL OR NULLIF(trim(_last_name),'') IS NULL THEN RAISE EXCEPTION 'Student first and last names are required.'; END IF;
  IF _class_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.classes WHERE id = _class_id) THEN RAISE EXCEPTION 'Selected class does not exist.'; END IF;

  v_adm_no := trim(coalesce(_admission_no, ''));
  IF v_adm_no = '' THEN
    RAISE EXCEPTION 'Admission number is required.';
  END IF;

  IF length(v_adm_no) < 3 THEN
    RAISE EXCEPTION 'Admission number must be at least 3 characters.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.students s
    WHERE lower(trim(s.admission_no)) = lower(v_adm_no)
  ) THEN
    RAISE EXCEPTION 'Admission number already exists. Enter a unique admission number.';
  END IF;

  SELECT id INTO family_id
  FROM public.admission_families
  WHERE status = 'active'
    AND ((parent_email IS NOT NULL AND parent_profile.email IS NOT NULL AND lower(parent_email)=lower(parent_profile.email))
      OR (parent_phone IS NOT NULL AND parent_profile.phone IS NOT NULL AND parent_phone=parent_profile.phone))
  ORDER BY af.created_at DESC LIMIT 1;

  IF family_id IS NULL THEN
    INSERT INTO public.admission_families(parent_name,parent_phone,parent_email,approved_by)
    VALUES (concat_ws(' ', parent_profile.first_name, parent_profile.last_name), parent_profile.phone, parent_profile.email, auth.uid())
    RETURNING id INTO family_id;
  END IF;

  INSERT INTO public.students(admission_no, first_name, last_name, date_of_birth, gender, current_class_id, admission_date, status)
  VALUES (v_adm_no, trim(_first_name), trim(_last_name), _date_of_birth, NULLIF(trim(_gender),''), _class_id, current_date, 'active')
  RETURNING id INTO student_id;

  INSERT INTO public.admission_family_students(family_id, student_id) VALUES (family_id, student_id);
  INSERT INTO public.parent_student(parent_id, student_id, relationship, is_primary)
  VALUES (_parent_id, student_id, COALESCE(NULLIF(trim(_relationship),''),'parent'), TRUE)
  ON CONFLICT (parent_id, student_id) DO UPDATE SET relationship = EXCLUDED.relationship;

  RETURN jsonb_build_object('family_id',family_id,'student_id',student_id,'admission_no',v_adm_no);
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_student_for_parent_family(UUID,TEXT,TEXT,DATE,TEXT,UUID,TEXT,TEXT) TO authenticated;

CREATE UNIQUE INDEX IF NOT EXISTS students_admission_no_normalized_unique
  ON public.students (lower(trim(admission_no)));

CREATE OR REPLACE FUNCTION public.attach_student_to_parent_family(
  _parent_id UUID,
  _student_id UUID,
  _parent_phone TEXT,
  _relationship TEXT DEFAULT 'parent'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_family_id UUID;
  parent_profile public.profiles%ROWTYPE;
  normalized_phone TEXT;
BEGIN
  IF NOT public.is_leadership() THEN RAISE EXCEPTION 'Only Admin or Headteacher may manage parent families.'; END IF;
  normalized_phone := NULLIF(trim(_parent_phone), '');
  IF normalized_phone IS NULL THEN RAISE EXCEPTION 'Parent phone number is required.'; END IF;
  SELECT * INTO parent_profile FROM public.profiles WHERE id = _parent_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Parent profile not found.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _parent_id AND role = 'parent') THEN RAISE EXCEPTION 'Selected account is not a parent account.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.students WHERE id = _student_id) THEN RAISE EXCEPTION 'Student record not found.'; END IF;

  SELECT af.id INTO v_family_id
  FROM public.admission_families AS af
  WHERE af.status = 'active'
    AND ((af.parent_email IS NOT NULL AND parent_profile.email IS NOT NULL AND lower(af.parent_email) = lower(parent_profile.email))
      OR (af.parent_phone IS NOT NULL AND af.parent_phone = normalized_phone))
  ORDER BY af.created_at DESC LIMIT 1;

  IF v_family_id IS NULL THEN
    INSERT INTO public.admission_families(parent_name, parent_phone, parent_email, approved_by)
    VALUES (concat_ws(' ', parent_profile.first_name, parent_profile.last_name), normalized_phone, parent_profile.email, auth.uid())
    RETURNING id INTO v_family_id;
  END IF;

  INSERT INTO public.admission_family_students(family_id, student_id)
  VALUES (v_family_id, _student_id)
  ON CONFLICT (family_id, student_id) DO NOTHING;
  INSERT INTO public.parent_student(parent_id, student_id, relationship, is_primary)
  VALUES (_parent_id, _student_id, COALESCE(NULLIF(trim(_relationship), ''), 'parent'), TRUE)
  ON CONFLICT (parent_id, student_id) DO UPDATE SET relationship = EXCLUDED.relationship;
  RETURN jsonb_build_object('family_id', v_family_id, 'parent_id', _parent_id, 'student_id', _student_id);
END;
$$;
GRANT EXECUTE ON FUNCTION public.attach_student_to_parent_family(UUID, UUID, TEXT, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.create_student_for_parent_family(
  _parent_id UUID,
  _first_name TEXT,
  _last_name TEXT,
  _date_of_birth DATE DEFAULT NULL,
  _gender TEXT DEFAULT NULL,
  _class_id UUID DEFAULT NULL,
  _admission_no TEXT DEFAULT NULL,
  _parent_phone TEXT DEFAULT NULL,
  _relationship TEXT DEFAULT 'parent'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_family_id UUID;
  v_student_id UUID;
  parent_profile public.profiles%ROWTYPE;
  normalized_phone TEXT;
  normalized_admission_no TEXT;
BEGIN
  IF NOT public.is_leadership() THEN RAISE EXCEPTION 'Only Admin or Headteacher may manage parent families.'; END IF;
  normalized_phone := NULLIF(trim(_parent_phone), '');
  IF normalized_phone IS NULL THEN RAISE EXCEPTION 'Parent phone number is required.'; END IF;
  normalized_admission_no := NULLIF(trim(_admission_no), '');
  IF normalized_admission_no IS NULL OR length(normalized_admission_no) < 3 THEN RAISE EXCEPTION 'Admission number must be at least 3 characters.'; END IF;
  SELECT * INTO parent_profile FROM public.profiles WHERE id = _parent_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Parent profile not found.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _parent_id AND role = 'parent') THEN RAISE EXCEPTION 'Selected account is not a parent account.'; END IF;
  IF NULLIF(trim(_first_name), '') IS NULL OR NULLIF(trim(_last_name), '') IS NULL THEN RAISE EXCEPTION 'Student first and last names are required.'; END IF;
  IF _class_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.classes WHERE id = _class_id) THEN RAISE EXCEPTION 'Selected class does not exist.'; END IF;
  IF EXISTS (SELECT 1 FROM public.students WHERE lower(trim(admission_no)) = lower(normalized_admission_no)) THEN RAISE EXCEPTION 'Admission number already exists. Enter a unique admission number.'; END IF;

  SELECT af.id INTO v_family_id
  FROM public.admission_families AS af
  WHERE af.status = 'active'
    AND ((af.parent_email IS NOT NULL AND parent_profile.email IS NOT NULL AND lower(af.parent_email) = lower(parent_profile.email))
      OR (af.parent_phone IS NOT NULL AND af.parent_phone = normalized_phone))
  ORDER BY created_at DESC LIMIT 1;
  IF v_family_id IS NULL THEN
    INSERT INTO public.admission_families(parent_name, parent_phone, parent_email, approved_by)
    VALUES (concat_ws(' ', parent_profile.first_name, parent_profile.last_name), normalized_phone, parent_profile.email, auth.uid())
    RETURNING id INTO v_family_id;
  END IF;

  INSERT INTO public.students(admission_no, first_name, last_name, date_of_birth, gender, current_class_id, admission_date, status)
  VALUES (normalized_admission_no, trim(_first_name), trim(_last_name), _date_of_birth, NULLIF(trim(_gender), ''), _class_id, current_date, 'active')
  RETURNING id INTO v_student_id;
  INSERT INTO public.admission_family_students(family_id, student_id) VALUES (v_family_id, v_student_id);
  INSERT INTO public.parent_student(parent_id, student_id, relationship, is_primary)
  VALUES (_parent_id, v_student_id, COALESCE(NULLIF(trim(_relationship), ''), 'parent'), TRUE)
  ON CONFLICT (parent_id, student_id) DO UPDATE SET relationship = EXCLUDED.relationship;
  RETURN jsonb_build_object('family_id', v_family_id, 'student_id', v_student_id, 'admission_no', normalized_admission_no);
END;
$$;
GRANT EXECUTE ON FUNCTION public.create_student_for_parent_family(UUID, TEXT, TEXT, DATE, TEXT, UUID, TEXT, TEXT, TEXT) TO authenticated;

ALTER TABLE public.applications
  ALTER COLUMN status SET DEFAULT 'pending';

UPDATE public.applications
SET status = 'pending'
WHERE status = 'submitted';

DROP FUNCTION IF EXISTS public.approve_admission_application(UUID, UUID);

CREATE OR REPLACE FUNCTION public.approve_admission_application(
  _application_id UUID,
  _class_id UUID,
  _admission_no TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  application_row public.applications%ROWTYPE;
  v_family_id UUID;
  v_student_id UUID;
  v_parent_user UUID;
  normalized_admission_no TEXT;
  first_name TEXT;
  last_name TEXT;
BEGIN
  IF NOT public.is_leadership() THEN
    RAISE EXCEPTION 'Only Admin or Headteacher may approve admissions.';
  END IF;

  normalized_admission_no := NULLIF(trim(_admission_no), '');
  IF normalized_admission_no IS NULL OR length(normalized_admission_no) < 3 THEN
    RAISE EXCEPTION 'Admission number must be at least 3 characters.';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.students AS existing_student
    WHERE lower(trim(existing_student.admission_no)) = lower(normalized_admission_no)
  ) THEN
    RAISE EXCEPTION 'Admission number already exists. Enter a unique admission number.';
  END IF;

  SELECT * INTO application_row
  FROM public.applications AS app
  WHERE app.id = _application_id
  FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Application not found.'; END IF;
  IF application_row.status = 'accepted' THEN RAISE EXCEPTION 'Application is already accepted.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.classes AS school_class WHERE school_class.id = _class_id) THEN
    RAISE EXCEPTION 'Selected class does not exist.';
  END IF;
  IF NULLIF(trim(application_row.parent_phone), '') IS NULL THEN
    RAISE EXCEPTION 'The application has no parent phone number.';
  END IF;

  SELECT family.id INTO v_family_id
  FROM public.admission_families AS family
  WHERE family.status = 'active'
    AND lower(coalesce(family.parent_email, '')) = lower(coalesce(application_row.parent_email, ''))
    AND family.parent_phone = trim(application_row.parent_phone)
  ORDER BY family.created_at DESC
  LIMIT 1;

  IF v_family_id IS NULL THEN
    INSERT INTO public.admission_families(parent_name, parent_phone, parent_email, approved_by)
    VALUES (trim(application_row.parent_name), trim(application_row.parent_phone), NULLIF(trim(application_row.parent_email), ''), auth.uid())
    RETURNING id INTO v_family_id;
  END IF;

  first_name := split_part(trim(application_row.child_name), ' ', 1);
  last_name := NULLIF(trim(substr(trim(application_row.child_name), length(first_name) + 1)), '');
  INSERT INTO public.students(admission_no, first_name, last_name, date_of_birth, current_class_id, admission_date, status, photo_url)
  VALUES (normalized_admission_no, first_name, coalesce(last_name, ''), application_row.child_dob, _class_id, current_date, 'active', application_row.photo_url)
  RETURNING id INTO v_student_id;

  INSERT INTO public.admission_family_students(family_id, student_id)
  VALUES (v_family_id, v_student_id);

  IF NULLIF(trim(application_row.parent_email), '') IS NOT NULL THEN
    SELECT auth_user.id INTO v_parent_user
    FROM auth.users AS auth_user
    WHERE lower(auth_user.email) = lower(trim(application_row.parent_email))
    LIMIT 1;
    IF v_parent_user IS NOT NULL THEN
      INSERT INTO public.parent_student(parent_id, student_id, relationship, is_primary)
      VALUES (v_parent_user, v_student_id, 'parent', TRUE)
      ON CONFLICT (parent_id, student_id) DO NOTHING;
    END IF;
  END IF;

  UPDATE public.applications AS app
  SET status = 'accepted', reviewed_by = auth.uid(), reviewed_at = now()
  WHERE app.id = _application_id;

  RETURN jsonb_build_object(
    'family_id', v_family_id,
    'student_id', v_student_id,
    'admission_no', normalized_admission_no
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.approve_admission_application(UUID, UUID, TEXT) TO authenticated;

DROP POLICY IF EXISTS "applications_public_insert" ON public.applications;
CREATE POLICY "applications_public_insert" ON public.applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending');

-- Avoid recursive RLS evaluation when leadership loads family/student links.
CREATE OR REPLACE FUNCTION public.can_view_family_student_link(
  _family_id UUID,
  _student_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_leadership()
    OR EXISTS (
      SELECT 1
      FROM public.parent_student AS ps
      WHERE ps.parent_id = auth.uid()
        AND ps.student_id = _student_id
        AND EXISTS (
          SELECT 1
          FROM public.admission_family_students AS family_student
          WHERE family_student.family_id = _family_id
            AND family_student.student_id = _student_id
        )
    )
$$;

REVOKE ALL ON FUNCTION public.can_view_family_student_link(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_view_family_student_link(UUID, UUID) TO authenticated;

DROP POLICY IF EXISTS admission_family_students_scoped ON public.admission_family_students;
DROP POLICY IF EXISTS admission_family_students_leadership ON public.admission_family_students;
CREATE POLICY admission_family_students_scoped ON public.admission_family_students
  FOR SELECT TO authenticated
  USING (public.can_view_family_student_link(family_id, student_id));
CREATE POLICY admission_family_students_leadership ON public.admission_family_students
  FOR ALL TO authenticated
  USING (public.is_leadership())
  WITH CHECK (public.is_leadership());

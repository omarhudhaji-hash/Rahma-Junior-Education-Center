-- Fix manual admission: PL/pgSQL variable `student_id` conflicts with
-- the parent_student.student_id column when the function is compiled.
-- This migration replaces the function using unambiguous v_* local names.

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

  v_adm_no := 'RJ-' || to_char(current_date, 'YYYY') || '-' ||
              upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 7));

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
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, DATE, TEXT, UUID, NUMERIC
) TO authenticated;

-- Phase 1: Parent & Family Management
-- One parent account can own multiple children. Leadership can attach an
-- existing student to the parent's family without creating another account.

CREATE OR REPLACE FUNCTION public.attach_student_to_parent_family(
  _parent_id UUID,
  _student_id UUID,
  _relationship TEXT DEFAULT 'parent'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  family_id UUID;
  parent_profile public.profiles%ROWTYPE;
BEGIN
  IF NOT public.is_leadership() THEN
    RAISE EXCEPTION 'Only Admin or Headteacher may manage parent families.';
  END IF;

  SELECT * INTO parent_profile FROM public.profiles WHERE id = _parent_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Parent profile not found.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _parent_id AND role = 'parent') THEN
    RAISE EXCEPTION 'Selected account is not a parent account.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.students WHERE id = _student_id) THEN
    RAISE EXCEPTION 'Student record not found.';
  END IF;

  SELECT id INTO family_id
  FROM public.admission_families
  WHERE status = 'active'
    AND ((parent_email IS NOT NULL AND parent_profile.email IS NOT NULL AND lower(parent_email)=lower(parent_profile.email))
      OR (parent_phone IS NOT NULL AND parent_profile.phone IS NOT NULL AND parent_phone=parent_profile.phone))
  ORDER BY created_at DESC
  LIMIT 1;

  IF family_id IS NULL THEN
    INSERT INTO public.admission_families(parent_name,parent_phone,parent_email,approved_by)
    VALUES (concat_ws(' ', parent_profile.first_name, parent_profile.last_name), parent_profile.phone, parent_profile.email, auth.uid())
    RETURNING id INTO family_id;
  END IF;

  INSERT INTO public.admission_family_students(family_id, student_id)
  VALUES (family_id, _student_id)
  ON CONFLICT (family_id, student_id) DO NOTHING;

  INSERT INTO public.parent_student(parent_id, student_id, relationship, is_primary)
  VALUES (_parent_id, _student_id, COALESCE(NULLIF(trim(_relationship),''),'parent'), TRUE)
  ON CONFLICT (parent_id, student_id) DO UPDATE
    SET relationship = EXCLUDED.relationship;

  RETURN jsonb_build_object('family_id', family_id, 'parent_id', _parent_id, 'student_id', _student_id);
END;
$$;
GRANT EXECUTE ON FUNCTION public.attach_student_to_parent_family(UUID,UUID,TEXT) TO authenticated;


-- Create a brand-new learner directly from a parent family profile.
CREATE OR REPLACE FUNCTION public.create_student_for_parent_family(
  _parent_id UUID,
  _first_name TEXT,
  _last_name TEXT,
  _date_of_birth DATE DEFAULT NULL,
  _gender TEXT DEFAULT NULL,
  _class_id UUID DEFAULT NULL,
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
  adm_no TEXT;
BEGIN
  IF NOT public.is_leadership() THEN RAISE EXCEPTION 'Only Admin or Headteacher may manage parent families.'; END IF;
  SELECT * INTO parent_profile FROM public.profiles WHERE id = _parent_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Parent profile not found.'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _parent_id AND role = 'parent') THEN RAISE EXCEPTION 'Selected account is not a parent account.'; END IF;
  IF NULLIF(trim(_first_name),'') IS NULL OR NULLIF(trim(_last_name),'') IS NULL THEN RAISE EXCEPTION 'Student first and last names are required.'; END IF;
  IF _class_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.classes WHERE id = _class_id) THEN RAISE EXCEPTION 'Selected class does not exist.'; END IF;

  SELECT id INTO family_id
  FROM public.admission_families
  WHERE status = 'active'
    AND ((parent_email IS NOT NULL AND parent_profile.email IS NOT NULL AND lower(parent_email)=lower(parent_profile.email))
      OR (parent_phone IS NOT NULL AND parent_profile.phone IS NOT NULL AND parent_phone=parent_profile.phone))
  ORDER BY created_at DESC LIMIT 1;

  IF family_id IS NULL THEN
    INSERT INTO public.admission_families(parent_name,parent_phone,parent_email,approved_by)
    VALUES (concat_ws(' ', parent_profile.first_name, parent_profile.last_name), parent_profile.phone, parent_profile.email, auth.uid())
    RETURNING id INTO family_id;
  END IF;

  adm_no := 'RJ-' || to_char(current_date,'YYYY') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,7));
  INSERT INTO public.students(admission_no, first_name, last_name, date_of_birth, gender, current_class_id, admission_date, status)
  VALUES (adm_no, trim(_first_name), trim(_last_name), _date_of_birth, NULLIF(trim(_gender),''), _class_id, current_date, 'active')
  RETURNING id INTO student_id;

  INSERT INTO public.admission_family_students(family_id, student_id) VALUES (family_id, student_id);
  INSERT INTO public.parent_student(parent_id, student_id, relationship, is_primary)
  VALUES (_parent_id, student_id, COALESCE(NULLIF(trim(_relationship),''),'parent'), TRUE)
  ON CONFLICT (parent_id, student_id) DO UPDATE SET relationship = EXCLUDED.relationship;

  RETURN jsonb_build_object('family_id',family_id,'student_id',student_id,'admission_no',adm_no);
END;
$$;
GRANT EXECUTE ON FUNCTION public.create_student_for_parent_family(UUID,TEXT,TEXT,DATE,TEXT,UUID,TEXT) TO authenticated;

-- Admission photos: let public applicants upload only into the isolated admissions/ prefix.
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Ensure the existing private student photo bucket is available.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('student-photos', 'student-photos', false, 5242880, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE
SET public = false, file_size_limit = 5242880, allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp'];

DROP POLICY IF EXISTS student_photos_public_admission_insert ON storage.objects;
CREATE POLICY student_photos_public_admission_insert
ON storage.objects FOR INSERT TO anon
WITH CHECK (
  bucket_id = 'student-photos'
  AND name LIKE 'admissions/%'
);

-- Keep public applications limited to inserts; photo_url is just the private object path.
COMMENT ON COLUMN public.applications.photo_url IS 'Private student photo path uploaded during public admission; copied to students.photo_url when approved.';

-- Rebuild approval so an uploaded admission photo follows the application into the new student profile.
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
  INSERT INTO public.students(admission_no,first_name,last_name,date_of_birth,current_class_id,admission_date,status,photo_url)
  VALUES(adm_no,
         split_part(trim(a.child_name),' ',1),
         nullif(trim(substr(trim(a.child_name),length(split_part(trim(a.child_name),' ',1))+1)),''),
         a.child_dob,_class_id,current_date,'active',a.photo_url)
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
  RETURN jsonb_build_object('family_id',family_id,'student_id',student_id,'admission_no',adm_no,'photo_url',a.photo_url);
END; $$;

GRANT EXECUTE ON FUNCTION public.approve_admission_application(UUID,UUID) TO authenticated;

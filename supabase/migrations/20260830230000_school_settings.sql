-- Rahma Edu Hub: centralized school settings
CREATE TABLE IF NOT EXISTS public.school_settings (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id),
  school_name TEXT NOT NULL DEFAULT 'Rahma Junior Education Center',
  short_name TEXT NOT NULL DEFAULT 'Rahma Junior',
  motto TEXT NOT NULL DEFAULT 'Foundation for Knowledge',
  phone TEXT,
  email TEXT,
  address TEXT,
  county TEXT DEFAULT 'Nairobi',
  logo_url TEXT,
  currency TEXT NOT NULL DEFAULT 'KSh',
  receipt_prefix TEXT NOT NULL DEFAULT 'RCT',
  document_prefix TEXT NOT NULL DEFAULT 'DOC',
  admission_prefix TEXT NOT NULL DEFAULT 'RJ',
  grading_scheme TEXT NOT NULL DEFAULT 'standard',
  attendance_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  announcement_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  exam_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  fee_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  sms_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.school_settings (id) VALUES (TRUE)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.school_settings TO authenticated;

DROP POLICY IF EXISTS school_settings_read ON public.school_settings;
CREATE POLICY school_settings_read ON public.school_settings
FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS school_settings_admin_write ON public.school_settings;
CREATE POLICY school_settings_admin_write ON public.school_settings
FOR INSERT TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS school_settings_admin_update ON public.school_settings;
CREATE POLICY school_settings_admin_update ON public.school_settings
FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

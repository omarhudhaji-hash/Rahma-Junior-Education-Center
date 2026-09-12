-- SMS automation controls and audit metadata.
CREATE TABLE IF NOT EXISTS public.sms_settings (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id = TRUE),
  sms_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  fee_payment_sms BOOLEAN NOT NULL DEFAULT TRUE,
  fee_reminder_sms BOOLEAN NOT NULL DEFAULT FALSE,
  absence_sms BOOLEAN NOT NULL DEFAULT FALSE,
  exam_reminder_sms BOOLEAN NOT NULL DEFAULT FALSE,
  result_sms BOOLEAN NOT NULL DEFAULT FALSE,
  announcement_sms BOOLEAN NOT NULL DEFAULT TRUE,
  provider TEXT NOT NULL DEFAULT 'africas_talking',
  sender_id TEXT,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.sms_settings (id) VALUES (TRUE) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.sms_settings ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.sms_settings TO authenticated;
GRANT ALL ON public.sms_settings TO service_role;

DROP POLICY IF EXISTS "sms_settings_leadership" ON public.sms_settings;
CREATE POLICY "sms_settings_leadership" ON public.sms_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'headteacher'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'headteacher'));

ALTER TABLE public.sms_messages ADD COLUMN IF NOT EXISTS batch_id UUID;
ALTER TABLE public.sms_messages ADD COLUMN IF NOT EXISTS automation_key TEXT;
CREATE INDEX IF NOT EXISTS sms_messages_batch_idx ON public.sms_messages(batch_id);
CREATE INDEX IF NOT EXISTS sms_messages_automation_idx ON public.sms_messages(automation_key);

COMMENT ON TABLE public.sms_settings IS 'School-wide SMS provider and automation switches. Provider credentials remain in Edge Function secrets.';

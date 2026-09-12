-- SMS management for school leadership.
-- Provider credentials are intentionally NOT stored in the database.
-- Configure them as Supabase Edge Function secrets.

CREATE TABLE IF NOT EXISTS public.sms_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient_phone TEXT NOT NULL,
  recipient_name TEXT,
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 480),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','sent','failed','delivered')),
  provider_message_id TEXT,
  provider_status TEXT,
  provider_cost TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS sms_messages_created_at_idx ON public.sms_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS sms_messages_created_by_idx ON public.sms_messages(created_by);
CREATE INDEX IF NOT EXISTS sms_messages_recipient_id_idx ON public.sms_messages(recipient_id);

ALTER TABLE public.sms_messages ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.sms_messages TO authenticated;
GRANT ALL ON public.sms_messages TO service_role;

DROP POLICY IF EXISTS "sms_leadership_read" ON public.sms_messages;
DROP POLICY IF EXISTS "sms_leadership_insert" ON public.sms_messages;

CREATE POLICY "sms_leadership_read" ON public.sms_messages
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'headteacher'));

CREATE POLICY "sms_leadership_insert" ON public.sms_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by = auth.uid()
    AND (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'headteacher'))
  );

CREATE TABLE IF NOT EXISTS public.sms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 480),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE public.sms_templates ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sms_templates TO authenticated;
GRANT ALL ON public.sms_templates TO service_role;

DROP POLICY IF EXISTS "sms_templates_leadership" ON public.sms_templates;
CREATE POLICY "sms_templates_leadership" ON public.sms_templates
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'headteacher'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'headteacher'));

COMMENT ON TABLE public.sms_messages IS 'Audit/history of school SMS sent by admin and headteacher.';
COMMENT ON TABLE public.sms_templates IS 'Reusable SMS templates managed by school leadership.';

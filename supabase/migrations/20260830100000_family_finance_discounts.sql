-- Family finance, fee terms, discounts and audit trail
ALTER TABLE public.fee_structures
  ADD COLUMN IF NOT EXISTS term TEXT;

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS base_amount NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_reason TEXT;

UPDATE public.invoices
SET base_amount = amount
WHERE base_amount IS NULL;

ALTER TABLE public.invoices
  ALTER COLUMN base_amount SET DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.family_discount_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  min_children INTEGER NOT NULL CHECK (min_children >= 2),
  discount_percent NUMERIC(5,2) NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.family_discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent','fixed')),
  value NUMERIC(12,2) NOT NULL CHECK (value >= 0),
  reason TEXT NOT NULL,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at DATE
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_discount_rules TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_discounts TO authenticated;
ALTER TABLE public.family_discount_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_discounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "family_discount_rules_read" ON public.family_discount_rules;
DROP POLICY IF EXISTS "family_discount_rules_admin" ON public.family_discount_rules;
CREATE POLICY "family_discount_rules_read" ON public.family_discount_rules FOR SELECT TO authenticated USING (public.is_admin() OR public.is_leadership());
CREATE POLICY "family_discount_rules_admin" ON public.family_discount_rules FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "family_discounts_admin" ON public.family_discounts;
DROP POLICY IF EXISTS "family_discounts_family_read" ON public.family_discounts;
CREATE POLICY "family_discounts_admin" ON public.family_discounts FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "family_discounts_family_read" ON public.family_discounts FOR SELECT TO authenticated USING (parent_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_family_discounts_parent ON public.family_discounts(parent_id);
CREATE INDEX IF NOT EXISTS idx_family_discounts_student ON public.family_discounts(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_structures_class_term ON public.fee_structures(class_id, term);

-- Safe helper: count active linked children for a parent.
CREATE OR REPLACE FUNCTION public.get_parent_child_count(_parent_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.parent_student ps
  JOIN public.students s ON s.id = ps.student_id
  WHERE ps.parent_id = _parent_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_parent_child_count(UUID) TO authenticated;

-- Apply a family-level automatic rule or a student-specific manual discount when an invoice is created.
CREATE OR REPLACE FUNCTION public.calculate_family_discount(
  _student_id UUID,
  _base_amount NUMERIC
)
RETURNS TABLE(discount_amount NUMERIC, discount_reason TEXT)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _parent_id UUID;
  _children INTEGER;
  _rule_percent NUMERIC := 0;
  _manual_percent NUMERIC := 0;
  _manual_fixed NUMERIC := 0;
  _manual_reason TEXT;
BEGIN
  SELECT ps.parent_id INTO _parent_id
  FROM public.parent_student ps
  WHERE ps.student_id = _student_id
  LIMIT 1;

  IF _parent_id IS NULL THEN
    RETURN QUERY SELECT 0::NUMERIC, NULL::TEXT;
    RETURN;
  END IF;

  _children := public.get_parent_child_count(_parent_id);

  SELECT r.discount_percent INTO _rule_percent
  FROM public.family_discount_rules r
  WHERE r.is_active AND r.min_children <= _children
  ORDER BY r.min_children DESC, r.discount_percent DESC
  LIMIT 1;

  SELECT COALESCE(SUM(CASE WHEN fd.discount_type='percent' THEN fd.value ELSE 0 END),0),
         COALESCE(SUM(CASE WHEN fd.discount_type='fixed' THEN fd.value ELSE 0 END),0),
         string_agg(fd.reason, ', ' ORDER BY fd.created_at DESC)
  INTO _manual_percent, _manual_fixed, _manual_reason
  FROM public.family_discounts fd
  WHERE fd.parent_id = _parent_id
    AND (fd.student_id IS NULL OR fd.student_id = _student_id)
    AND (fd.expires_at IS NULL OR fd.expires_at >= CURRENT_DATE);

  RETURN QUERY SELECT
    LEAST(_base_amount, ROUND((_base_amount * ((_rule_percent + _manual_percent) / 100)) + _manual_fixed, 2)),
    concat_ws('; ', CASE WHEN _rule_percent > 0 THEN 'Family/sibling discount ' || _rule_percent || '%' END, _manual_reason);
END;
$$;

GRANT EXECUTE ON FUNCTION public.calculate_family_discount(UUID, NUMERIC) TO authenticated;

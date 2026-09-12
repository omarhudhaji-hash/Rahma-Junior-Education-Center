-- Rahma Edu Hub - School Documents & Reports
-- Adds printable student documents without changing existing finance/report-card tables.

CREATE TABLE IF NOT EXISTS public.school_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL DEFAULT 'official_letter',
  document_no TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('draft','issued','void')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_school_documents_student ON public.school_documents(student_id, issue_date DESC);
CREATE INDEX IF NOT EXISTS idx_school_documents_type ON public.school_documents(document_type);

ALTER TABLE public.school_documents ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.school_documents TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.school_documents TO authenticated;

DROP POLICY IF EXISTS school_documents_leadership_manage ON public.school_documents;
CREATE POLICY school_documents_leadership_manage
ON public.school_documents
FOR ALL TO authenticated
USING (public.is_leadership())
WITH CHECK (public.is_leadership());

DROP POLICY IF EXISTS school_documents_parent_read ON public.school_documents;
CREATE POLICY school_documents_parent_read
ON public.school_documents
FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'parent')
  AND EXISTS (
    SELECT 1 FROM public.parent_student ps
    WHERE ps.parent_id = auth.uid()
      AND ps.student_id = school_documents.student_id
  )
);

DROP POLICY IF EXISTS school_documents_student_read ON public.school_documents;
CREATE POLICY school_documents_student_read
ON public.school_documents
FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'student')
  AND EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = school_documents.student_id
      AND s.user_id = auth.uid()
  )
);

CREATE OR REPLACE FUNCTION public.school_documents_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS school_documents_updated_at ON public.school_documents;
CREATE TRIGGER school_documents_updated_at
BEFORE UPDATE ON public.school_documents
FOR EACH ROW EXECUTE FUNCTION public.school_documents_set_updated_at();

-- Generates a readable document number such as DOC-2026-0001.
CREATE OR REPLACE FUNCTION public.next_school_document_no()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_no INTEGER;
BEGIN
  SELECT COALESCE(MAX((regexp_match(document_no, '^DOC-' || EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-([0-9]+)$'))[1]::INTEGER), 0) + 1
  INTO next_no
  FROM public.school_documents;

  RETURN 'DOC-' || EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-' || LPAD(next_no::TEXT, 4, '0');
END;
$$;

GRANT EXECUTE ON FUNCTION public.next_school_document_no() TO authenticated;

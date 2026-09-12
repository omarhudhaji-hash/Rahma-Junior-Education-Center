-- Store the actual start time and duration for each exam paper.
ALTER TABLE public.exam_subjects
  ADD COLUMN IF NOT EXISTS start_time TIME,
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER;

-- Keep duration sensible when supplied.
ALTER TABLE public.exam_subjects
  DROP CONSTRAINT IF EXISTS exam_subjects_duration_minutes_check;

ALTER TABLE public.exam_subjects
  ADD CONSTRAINT exam_subjects_duration_minutes_check
  CHECK (duration_minutes IS NULL OR (duration_minutes >= 5 AND duration_minutes <= 600));

COMMENT ON COLUMN public.exam_subjects.start_time IS 'Local school time when this exam paper starts.';
COMMENT ON COLUMN public.exam_subjects.duration_minutes IS 'Duration of this exam paper in minutes.';

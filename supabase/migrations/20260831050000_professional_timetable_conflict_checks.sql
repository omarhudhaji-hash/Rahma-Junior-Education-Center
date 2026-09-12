-- Rahma Edu Hub: Professional timetable conflict protection
-- Safe to run after the existing timetable_entries table exists.

CREATE OR REPLACE FUNCTION public.save_timetable_entry(
  p_id UUID DEFAULT NULL,
  p_class_id UUID DEFAULT NULL,
  p_subject_id UUID DEFAULT NULL,
  p_teacher_id UUID DEFAULT NULL,
  p_day_of_week SMALLINT DEFAULT NULL,
  p_starts_at TIME DEFAULT NULL,
  p_ends_at TIME DEFAULT NULL,
  p_room TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_conflict RECORD;
  v_room TEXT := NULLIF(trim(coalesce(p_room, '')), '');
BEGIN
  IF NOT public.is_leadership() THEN
    RAISE EXCEPTION 'Only Admin or Headteacher may manage the timetable.';
  END IF;

  IF p_class_id IS NULL THEN
    RAISE EXCEPTION 'Please select a class.';
  END IF;

  IF p_subject_id IS NULL THEN
    RAISE EXCEPTION 'Please select a subject.';
  END IF;

  IF p_teacher_id IS NULL THEN
    RAISE EXCEPTION 'Please select a teacher.';
  END IF;

  IF p_day_of_week IS NULL OR p_day_of_week NOT BETWEEN 1 AND 7 THEN
    RAISE EXCEPTION 'Please select a valid day.';
  END IF;

  IF p_starts_at IS NULL OR p_ends_at IS NULL OR p_starts_at >= p_ends_at THEN
    RAISE EXCEPTION 'End time must be later than start time.';
  END IF;

  SELECT * INTO v_conflict
  FROM public.timetable_entries t
  WHERE t.day_of_week = p_day_of_week
    AND (p_id IS NULL OR t.id <> p_id)
    AND t.starts_at < p_ends_at
    AND t.ends_at > p_starts_at
    AND (
      t.class_id = p_class_id
      OR t.teacher_id = p_teacher_id
      OR (v_room IS NOT NULL AND NULLIF(trim(coalesce(t.room, '')), '') = v_room)
    )
  ORDER BY t.starts_at
  LIMIT 1;

  IF FOUND THEN
    IF v_conflict.class_id = p_class_id THEN
      RAISE EXCEPTION 'Class conflict: this class already has a lesson from % to %.',
        to_char(v_conflict.starts_at, 'HH24:MI'), to_char(v_conflict.ends_at, 'HH24:MI');
    ELSIF v_conflict.teacher_id = p_teacher_id THEN
      RAISE EXCEPTION 'Teacher conflict: this teacher is already teaching from % to %.',
        to_char(v_conflict.starts_at, 'HH24:MI'), to_char(v_conflict.ends_at, 'HH24:MI');
    ELSE
      RAISE EXCEPTION 'Room conflict: % is already booked from % to %.',
        v_room, to_char(v_conflict.starts_at, 'HH24:MI'), to_char(v_conflict.ends_at, 'HH24:MI');
    END IF;
  END IF;

  IF p_id IS NULL THEN
    INSERT INTO public.timetable_entries
      (class_id, subject_id, teacher_id, day_of_week, starts_at, ends_at, room, subject_name)
    VALUES
      (p_class_id, p_subject_id, p_teacher_id, p_day_of_week, p_starts_at, p_ends_at, v_room, NULL)
    RETURNING id INTO v_id;
  ELSE
    UPDATE public.timetable_entries
    SET class_id = p_class_id,
        subject_id = p_subject_id,
        teacher_id = p_teacher_id,
        day_of_week = p_day_of_week,
        starts_at = p_starts_at,
        ends_at = p_ends_at,
        room = v_room,
        subject_name = NULL
    WHERE id = p_id
    RETURNING id INTO v_id;

    IF v_id IS NULL THEN
      RAISE EXCEPTION 'Timetable entry not found.';
    END IF;
  END IF;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.save_timetable_entry(UUID,UUID,UUID,UUID,SMALLINT,TIME,TIME,TEXT)
TO authenticated;

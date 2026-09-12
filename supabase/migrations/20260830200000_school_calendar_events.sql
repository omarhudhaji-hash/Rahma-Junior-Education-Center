create table if not exists public.school_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_type text not null default 'school_event' check (event_type in ('school_event','parent_meeting','staff_meeting','exam','sports','trip','holiday','other')),
  audience text not null default 'everyone' check (audience in ('everyone','parents','students','teachers','class')),
  target_class_id uuid references public.classes(id) on delete set null,
  start_at timestamptz not null,
  end_at timestamptz,
  location text,
  reminder_minutes integer check (reminder_minutes is null or reminder_minutes >= 0),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint school_events_time_check check (end_at is null or end_at > start_at),
  constraint school_events_class_audience_check check ((audience = 'class') = (target_class_id is not null))
);

create index if not exists school_events_start_idx on public.school_events(start_at);
create index if not exists school_events_class_idx on public.school_events(target_class_id);
alter table public.school_events enable row level security;

drop policy if exists school_events_leadership_manage on public.school_events;
create policy school_events_leadership_manage on public.school_events for all to authenticated using (public.is_leadership()) with check (public.is_leadership());

drop policy if exists school_events_relevant_read on public.school_events;
create policy school_events_relevant_read on public.school_events for select to authenticated using (
  public.is_leadership()
  or audience = 'everyone'
  or (audience = 'teachers' and exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role = 'teacher'))
  or (audience = 'parents' and exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role = 'parent'))
  or (audience = 'students' and exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role = 'student'))
  or (audience = 'class' and (
    exists (select 1 from public.students s where s.user_id = auth.uid() and s.current_class_id = school_events.target_class_id)
    or exists (select 1 from public.parent_student ps join public.students s on s.id = ps.student_id where ps.parent_id = auth.uid() and s.current_class_id = school_events.target_class_id)
    or exists (select 1 from public.teacher_class_assignments tca where tca.teacher_id = auth.uid() and tca.class_id = school_events.target_class_id)
  ))
);

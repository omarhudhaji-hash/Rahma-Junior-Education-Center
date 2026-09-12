-- Rahma Edu Hub: immutable audit trail
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null check (action in ('INSERT','UPDATE','DELETE','LOGIN','LOGOUT','CUSTOM')),
  table_name text,
  record_id text,
  description text not null,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);
create index if not exists idx_audit_logs_actor on public.audit_logs(actor_id, created_at desc);
create index if not exists idx_audit_logs_table on public.audit_logs(table_name, created_at desc);

alter table public.audit_logs enable row level security;

drop policy if exists audit_logs_admin_read on public.audit_logs;
create policy audit_logs_admin_read on public.audit_logs
for select to authenticated using (public.is_admin());

-- No INSERT/UPDATE/DELETE policies are granted to authenticated users.
-- Trigger function is SECURITY DEFINER so application users cannot tamper with logs.
create or replace function public.write_audit_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old jsonb;
  v_new jsonb;
  v_id text;
  v_desc text;
begin
  if tg_op = 'DELETE' then
    v_old := to_jsonb(old);
    v_new := null;
    v_id := coalesce(v_old->>'id', v_old->>'user_id', v_old->>'student_id');
  elsif tg_op = 'INSERT' then
    v_old := null;
    v_new := to_jsonb(new);
    v_id := coalesce(v_new->>'id', v_new->>'user_id', v_new->>'student_id');
  else
    v_old := to_jsonb(old);
    v_new := to_jsonb(new);
    v_id := coalesce(v_new->>'id', v_new->>'user_id', v_new->>'student_id');
  end if;

  -- Never retain credential/secrets fields if a protected table is extended later.
  if v_old is not null then
    v_old := v_old - array['password','password_hash','api_key','secret','access_token','refresh_token'];
  end if;
  if v_new is not null then
    v_new := v_new - array['password','password_hash','api_key','secret','access_token','refresh_token'];
  end if;

  v_desc := format('%s on %s', tg_op, tg_table_name);

  insert into public.audit_logs(actor_id, action, table_name, record_id, description, old_data, new_data)
  values (auth.uid(), tg_op, tg_table_name, v_id, v_desc, v_old, v_new);

  if tg_op = 'DELETE' then return old; else return new; end if;
end;
$$;

-- Keep the high-value school operations auditable without touching auth internals.
do $$
declare
  t text;
  tables text[] := array[
    'profiles','user_roles','students','parents','parent_students','classes','subjects',
    'teacher_subject_assignments','teacher_class_assignments','student_marks','exam_results',
    'exams','exam_subjects','attendance_records','class_remarks','school_settings',
    'fee_payments','fee_invoices','fee_discounts','inventory_items','inventory_transactions',
    'school_documents','school_calendar_events','announcements'
  ];
begin
  foreach t in array tables loop
    if to_regclass('public.' || t) is not null then
      execute format('drop trigger if exists audit_%I on public.%I', t, t);
      execute format('create trigger audit_%I after insert or update or delete on public.%I for each row execute function public.write_audit_log()', t, t);
    end if;
  end loop;
end $$;

-- Audit logs themselves are deliberately not included in the audit trigger list.
revoke insert, update, delete on public.audit_logs from authenticated;
grant select on public.audit_logs to authenticated;

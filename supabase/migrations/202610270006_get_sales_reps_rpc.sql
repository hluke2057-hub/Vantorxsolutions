-- Migration 202610270006: Add get_sales_reps RPC function under security definer
-- Allows Vercel API and closer dashboards to read real user signups and registrations
-- directly from public.audit_log without exposing table RLS to anon.

create or replace function public.get_sales_reps()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_reps jsonb;
begin
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'id', al.id,
      'entity_id', al.entity_id,
      'action', al.action,
      'entity_type', al.entity_type,
      'details', al.details,
      'created_at', al.created_at
    ) order by al.created_at asc
  ), '[]'::jsonb)
  into v_reps
  from public.audit_log al
  where al.entity_type in ('sales_rep', 'lead_inquiry');

  return v_reps;
end;
$$;

grant execute on function public.get_sales_reps() to anon, authenticated;

-- Secure atomic business creation: the caller becomes the initial owner.
-- The function uses the caller's authenticated identity and never accepts a user ID.
create or replace function public.create_business_with_owner(
  business_name text,
  business_slug text default null,
  business_timezone text default 'America/New_York'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_business_id uuid;
  caller_id uuid := auth.uid();
begin
  if caller_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  if business_name is null or length(trim(business_name)) < 2 or length(trim(business_name)) > 160 then
    raise exception 'Business name must be between 2 and 160 characters' using errcode = '22023';
  end if;

  insert into public.businesses (name, slug, timezone, created_by)
  values (
    trim(business_name),
    nullif(trim(business_slug), ''),
    coalesce(nullif(trim(business_timezone), ''), 'America/New_York'),
    caller_id
  )
  returning id into new_business_id;

  insert into public.business_members (business_id, user_id, role)
  values (new_business_id, caller_id, 'owner');

  insert into public.receptionist_configs (business_id)
  values (new_business_id);

  insert into public.onboarding_drafts (business_id, updated_by)
  values (new_business_id, caller_id);

  insert into public.audit_log (business_id, actor_id, action, entity_type, entity_id)
  values (new_business_id, caller_id, 'business.created', 'business', new_business_id::text);

  return new_business_id;
end;
$$;

revoke all on function public.create_business_with_owner(text, text, text) from public, anon;
grant execute on function public.create_business_with_owner(text, text, text) to authenticated;

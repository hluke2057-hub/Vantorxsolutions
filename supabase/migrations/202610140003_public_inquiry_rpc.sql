-- Secure public inquiry capture for marketing demo requests.
-- Operates under security definer so unauthenticated site visitors can submit leads safely without exposing tables.

create or replace function public.submit_public_inquiry(
  inquiry_name text,
  inquiry_email text,
  inquiry_phone text default null,
  inquiry_business text default null,
  inquiry_type text default null,
  inquiry_interests text[] default '{}',
  inquiry_challenge text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_audit_id bigint;
begin
  if inquiry_name is null or length(trim(inquiry_name)) < 2 then
    raise exception 'Name is required' using errcode = '22023';
  end if;
  if inquiry_email is null or inquiry_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' then
    raise exception 'Valid email is required' using errcode = '22023';
  end if;

  insert into public.audit_log (
    action,
    entity_type,
    details
  )
  values (
    'inquiry.submitted',
    'lead_inquiry',
    jsonb_build_object(
      'name', trim(inquiry_name),
      'email', lower(trim(inquiry_email)),
      'phone', nullif(trim(inquiry_phone), ''),
      'business', nullif(trim(inquiry_business), ''),
      'businessType', nullif(trim(inquiry_type), ''),
      'interests', to_jsonb(inquiry_interests),
      'challenge', nullif(trim(inquiry_challenge), ''),
      'submittedAt', now()
    )
  )
  returning id into new_audit_id;

  return jsonb_build_object('ok', true, 'inquiryId', new_audit_id);
end;
$$;

grant execute on function public.submit_public_inquiry(text, text, text, text, text, text[], text) to anon, authenticated;

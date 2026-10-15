-- Secure appointment booking function for AI voice receptionist and external booking webhooks
-- Operates under security definer to book slots cleanly into public.appointments

create or replace function public.book_appointment(
  p_business_id uuid,
  p_customer_name text,
  p_customer_phone text default null,
  p_customer_email text default null,
  p_starts_at timestamptz default now(),
  p_ends_at timestamptz default null,
  p_service text default 'Consultation',
  p_source text default 'AI Receptionist Ava'
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_appt_id uuid;
  v_lead_id uuid;
  v_end timestamptz;
begin
  if p_customer_name is null or length(trim(p_customer_name)) < 2 then
    raise exception 'Customer name is required' using errcode = '22023';
  end if;

  v_end := coalesce(p_ends_at, p_starts_at + interval '30 minutes');

  -- 1. Insert appointment
  insert into public.appointments (
    business_id,
    customer_name,
    customer_phone,
    customer_email,
    starts_at,
    ends_at,
    status,
    notes,
    source
  )
  values (
    p_business_id,
    trim(p_customer_name),
    nullif(trim(p_customer_phone), ''),
    nullif(trim(p_customer_email), ''),
    coalesce(p_starts_at, now()),
    v_end,
    'confirmed',
    coalesce(p_service, 'Consultation'),
    coalesce(p_source, 'AI Receptionist Ava')
  )
  returning id into v_appt_id;

  -- 2. Automatically link/insert lead if phone exists
  if p_customer_phone is not null and length(trim(p_customer_phone)) > 3 then
    insert into public.leads (
      business_id,
      name,
      phone,
      email,
      source,
      status,
      notes
    )
    values (
      p_business_id,
      trim(p_customer_name),
      trim(p_customer_phone),
      nullif(trim(p_customer_email), ''),
      coalesce(p_source, 'AI Receptionist Ava'),
      'scheduled',
      'Appointment booked for ' || to_char(coalesce(p_starts_at, now()), 'Mon DD at HH12:MI AM')
    )
    returning id into v_lead_id;
  end if;

  return jsonb_build_object(
    'ok', true,
    'appointmentId', v_appt_id,
    'leadId', v_lead_id
  );
end;
$$;

grant execute on function public.book_appointment(uuid, text, text, text, timestamptz, timestamptz, text, text) to anon, authenticated;

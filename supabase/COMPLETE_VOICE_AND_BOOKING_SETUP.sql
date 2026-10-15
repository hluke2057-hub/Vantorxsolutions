-- ============================================================================
-- VantorX Complete Voice & Appointment Setup for Supabase
-- Run this ONCE in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/rjbcqamvxrtikgkfbtzi/sql
-- ============================================================================

-- 1. Voice Call Webhook Handler (For Vapi.ai / AI Receptionist Ava)
create or replace function public.record_voice_call(
  p_business_id uuid,
  p_provider_call_id text,
  p_caller_name text default 'Inbound Caller',
  p_caller_phone text default null,
  p_direction text default 'inbound',
  p_status text default 'completed',
  p_started_at timestamptz default now(),
  p_ended_at timestamptz default now(),
  p_duration_seconds integer default 0,
  p_summary text default null,
  p_transcript text default null,
  p_recording_url text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_call_id uuid;
  v_lead_id uuid;
begin
  insert into public.calls (
    business_id, provider_call_id, caller_name, caller_phone,
    direction, status, started_at, ended_at, duration_seconds,
    summary, transcript, recording_url, metadata
  )
  values (
    p_business_id, p_provider_call_id, p_caller_name, p_caller_phone,
    coalesce(p_direction, 'inbound'), coalesce(p_status, 'completed'),
    coalesce(p_started_at, now()), coalesce(p_ended_at, now()),
    greatest(0, coalesce(p_duration_seconds, 0)),
    p_summary, p_transcript, p_recording_url, coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_call_id;

  if p_caller_phone is not null and length(trim(p_caller_phone)) > 3 then
    insert into public.leads (business_id, name, phone, source, status, notes)
    values (
      p_business_id, coalesce(nullif(trim(p_caller_name), ''), 'Inbound Phone Lead'),
      trim(p_caller_phone), 'AI Receptionist Ava', 'contacted',
      coalesce(p_summary, 'Auto-captured from AI voice call.')
    )
    returning id into v_lead_id;
  end if;

  return jsonb_build_object('ok', true, 'callId', v_call_id, 'leadId', v_lead_id);
end;
$$;

grant execute on function public.record_voice_call(uuid, text, text, text, text, text, timestamptz, timestamptz, integer, text, text, text, jsonb) to anon, authenticated;

-- 2. Voice & Webhook Appointment Booking Handler
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

  insert into public.appointments (
    business_id, customer_name, customer_phone, customer_email,
    starts_at, ends_at, status, notes, source
  )
  values (
    p_business_id, trim(p_customer_name),
    nullif(trim(p_customer_phone), ''), nullif(trim(p_customer_email), ''),
    coalesce(p_starts_at, now()), v_end, 'confirmed',
    coalesce(p_service, 'Consultation'), coalesce(p_source, 'AI Receptionist Ava')
  )
  returning id into v_appt_id;

  if p_customer_phone is not null and length(trim(p_customer_phone)) > 3 then
    insert into public.leads (business_id, name, phone, email, source, status, notes)
    values (
      p_business_id, trim(p_customer_name), trim(p_customer_phone),
      nullif(trim(p_customer_email), ''), coalesce(p_source, 'AI Receptionist Ava'),
      'scheduled', 'Appointment booked for ' || to_char(coalesce(p_starts_at, now()), 'Mon DD at HH12:MI AM')
    )
    returning id into v_lead_id;
  end if;

  return jsonb_build_object('ok', true, 'appointmentId', v_appt_id, 'leadId', v_lead_id);
end;
$$;

grant execute on function public.book_appointment(uuid, text, text, text, timestamptz, timestamptz, text, text) to anon, authenticated;

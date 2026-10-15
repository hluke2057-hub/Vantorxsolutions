-- Record voice calls from Vapi/telecom provider securely under security definer
-- Allows incoming call webhooks to log calls and auto-create leads without violating RLS.

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
  -- 1. Insert into public.calls
  insert into public.calls (
    business_id,
    provider_call_id,
    caller_name,
    caller_phone,
    direction,
    status,
    started_at,
    ended_at,
    duration_seconds,
    summary,
    transcript,
    recording_url,
    metadata
  )
  values (
    p_business_id,
    p_provider_call_id,
    p_caller_name,
    p_caller_phone,
    coalesce(p_direction, 'inbound'),
    coalesce(p_status, 'completed'),
    coalesce(p_started_at, now()),
    coalesce(p_ended_at, now()),
    greatest(0, coalesce(p_duration_seconds, 0)),
    p_summary,
    p_transcript,
    p_recording_url,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_call_id;

  -- 2. If caller phone is provided, create/link lead automatically
  if p_caller_phone is not null and length(trim(p_caller_phone)) > 3 then
    insert into public.leads (
      business_id,
      name,
      phone,
      source,
      status,
      notes
    )
    values (
      p_business_id,
      coalesce(nullif(trim(p_caller_name), ''), 'Inbound Phone Lead'),
      trim(p_caller_phone),
      'AI Receptionist Ava',
      'contacted',
      coalesce(p_summary, 'Auto-captured from AI voice call.')
    )
    returning id into v_lead_id;
  end if;

  return jsonb_build_object(
    'ok', true,
    'callId', v_call_id,
    'leadId', v_lead_id
  );
end;
$$;

grant execute on function public.record_voice_call(uuid, text, text, text, text, text, timestamptz, timestamptz, integer, text, text, text, jsonb) to anon, authenticated;

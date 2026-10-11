-- VantorX shared platform schema.
-- Apply through Supabase SQL Editor or Supabase CLI after reviewing.
-- No secrets belong in this file.

create extension if not exists pgcrypto;

create type public.platform_role as enum ('owner', 'admin', 'staff');
create type public.appointment_status as enum ('requested', 'confirmed', 'completed', 'cancelled', 'no_show');
create type public.change_request_status as enum ('open', 'in_review', 'approved', 'rejected', 'completed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  platform_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  timezone text not null default 'America/New_York',
  phone text,
  email text,
  website text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.business_members (
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.platform_role not null default 'staff',
  created_at timestamptz not null default now(),
  primary key (business_id, user_id)
);

create table public.receptionist_configs (
  business_id uuid primary key references public.businesses(id) on delete cascade,
  enabled boolean not null default false,
  agent_name text,
  greeting text,
  instructions text,
  voice text,
  transfer_number text,
  settings jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  description text,
  duration_minutes integer not null default 30 check (duration_minutes between 5 and 1440),
  price numeric(12,2) check (price is null or price >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.business_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  is_open boolean not null default true,
  open_time time,
  close_time time,
  unique (business_id, weekday),
  check (not is_open or (open_time is not null and close_time is not null and open_time < close_time))
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  service_id uuid references public.services(id) on delete set null,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.appointment_status not null default 'requested',
  notes text,
  source text not null default 'manual',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.calls (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  provider_call_id text,
  caller_name text,
  caller_phone text,
  direction text not null default 'inbound' check (direction in ('inbound','outbound')),
  status text not null default 'received',
  started_at timestamptz,
  ended_at timestamptz,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  summary text,
  transcript text,
  recording_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  source text,
  status text not null default 'new',
  value numeric(12,2) check (value is null or value >= 0),
  notes text,
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.change_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  requested_by uuid references auth.users(id) on delete set null,
  title text not null,
  description text not null,
  status public.change_request_status not null default 'open',
  admin_notes text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  body text,
  category text not null default 'general',
  read_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (business_id is not null or user_id is not null)
);

create table public.onboarding_drafts (
  business_id uuid primary key references public.businesses(id) on delete cascade,
  updated_by uuid references auth.users(id) on delete set null,
  step text not null default 'business',
  data jsonb not null default '{}'::jsonb,
  validated_at timestamptz,
  launched_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  business_id uuid references public.businesses(id) on delete set null,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index business_members_user_idx on public.business_members(user_id);
create index appointments_business_start_idx on public.appointments(business_id, starts_at);
create index calls_business_created_idx on public.calls(business_id, created_at desc);
create index leads_business_status_idx on public.leads(business_id, status);
create index change_requests_business_status_idx on public.change_requests(business_id, status);
create index notifications_user_read_idx on public.notifications(user_id, read_at, created_at desc);
create index notifications_business_read_idx on public.notifications(business_id, read_at, created_at desc);

create or replace function public.is_business_member(target_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.business_members bm
    where bm.business_id = target_business_id
      and bm.user_id = (select auth.uid())
  );
$$;

create or replace function public.can_manage_business(target_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.business_members bm
    where bm.business_id = target_business_id
      and bm.user_id = (select auth.uid())
      and bm.role in ('owner', 'admin')
  );
$$;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.platform_admin = true
  );
$$;

-- Create a profile for each newly registered auth user. Admin status is never copied from user metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.profiles.full_name, excluded.full_name);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute procedure public.set_updated_at();
create trigger businesses_updated_at before update on public.businesses
for each row execute procedure public.set_updated_at();
create trigger receptionist_configs_updated_at before update on public.receptionist_configs
for each row execute procedure public.set_updated_at();
create trigger services_updated_at before update on public.services
for each row execute procedure public.set_updated_at();
create trigger appointments_updated_at before update on public.appointments
for each row execute procedure public.set_updated_at();
create trigger leads_updated_at before update on public.leads
for each row execute procedure public.set_updated_at();
create trigger change_requests_updated_at before update on public.change_requests
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.business_members enable row level security;
alter table public.receptionist_configs enable row level security;
alter table public.services enable row level security;
alter table public.business_hours enable row level security;
alter table public.appointments enable row level security;
alter table public.calls enable row level security;
alter table public.leads enable row level security;
alter table public.change_requests enable row level security;
alter table public.notifications enable row level security;
alter table public.onboarding_drafts enable row level security;
alter table public.audit_log enable row level security;

create policy "profiles_select_self_or_platform_admin" on public.profiles
for select to authenticated using (id = (select auth.uid()) or public.is_platform_admin());
create policy "profiles_update_self_basic" on public.profiles
for update to authenticated using (id = (select auth.uid()))
with check (id = (select auth.uid()) and platform_admin = false);
create policy "platform_admins_read_profiles" on public.profiles
for select to authenticated using (public.is_platform_admin());

create policy "business_members_read_business" on public.businesses
for select to authenticated using (public.is_business_member(id) or public.is_platform_admin());
create policy "business_create_authenticated" on public.businesses
for insert to authenticated with check (created_by = (select auth.uid()));
create policy "business_update_managers" on public.businesses
for update to authenticated using (public.can_manage_business(id) or public.is_platform_admin())
with check (public.can_manage_business(id) or public.is_platform_admin());
create policy "business_delete_platform_admin" on public.businesses
for delete to authenticated using (public.is_platform_admin());

create policy "members_read_same_business" on public.business_members
for select to authenticated using (user_id = (select auth.uid()) or public.is_business_member(business_id) or public.is_platform_admin());
create policy "members_manage_business" on public.business_members
for all to authenticated using (public.can_manage_business(business_id) or public.is_platform_admin())
with check (public.can_manage_business(business_id) or public.is_platform_admin());

create policy "receptionist_config_read" on public.receptionist_configs
for select to authenticated using (public.is_business_member(business_id) or public.is_platform_admin());
create policy "receptionist_config_manage" on public.receptionist_configs
for all to authenticated using (public.can_manage_business(business_id) or public.is_platform_admin())
with check (public.can_manage_business(business_id) or public.is_platform_admin());

create policy "services_read" on public.services
for select to authenticated using (public.is_business_member(business_id) or public.is_platform_admin());
create policy "services_manage" on public.services
for all to authenticated using (public.can_manage_business(business_id) or public.is_platform_admin())
with check (public.can_manage_business(business_id) or public.is_platform_admin());

create policy "hours_read" on public.business_hours
for select to authenticated using (public.is_business_member(business_id) or public.is_platform_admin());
create policy "hours_manage" on public.business_hours
for all to authenticated using (public.can_manage_business(business_id) or public.is_platform_admin())
with check (public.can_manage_business(business_id) or public.is_platform_admin());

create policy "appointments_read" on public.appointments
for select to authenticated using (public.is_business_member(business_id) or public.is_platform_admin());
create policy "appointments_insert" on public.appointments
for insert to authenticated with check (public.is_business_member(business_id) or public.is_platform_admin());
create policy "appointments_update" on public.appointments
for update to authenticated using (public.is_business_member(business_id) or public.is_platform_admin())
with check (public.is_business_member(business_id) or public.is_platform_admin());
create policy "appointments_delete_managers" on public.appointments
for delete to authenticated using (public.can_manage_business(business_id) or public.is_platform_admin());

create policy "calls_read" on public.calls
for select to authenticated using (public.is_business_member(business_id) or public.is_platform_admin());
create policy "calls_manage" on public.calls
for all to authenticated using (public.can_manage_business(business_id) or public.is_platform_admin())
with check (public.can_manage_business(business_id) or public.is_platform_admin());

create policy "leads_read" on public.leads
for select to authenticated using (public.is_business_member(business_id) or public.is_platform_admin());
create policy "leads_insert" on public.leads
for insert to authenticated with check (public.is_business_member(business_id) or public.is_platform_admin());
create policy "leads_update" on public.leads
for update to authenticated using (public.is_business_member(business_id) or public.is_platform_admin())
with check (public.is_business_member(business_id) or public.is_platform_admin());
create policy "leads_delete_managers" on public.leads
for delete to authenticated using (public.can_manage_business(business_id) or public.is_platform_admin());

create policy "change_requests_read" on public.change_requests
for select to authenticated using (public.is_business_member(business_id) or public.is_platform_admin());
create policy "change_requests_create" on public.change_requests
for insert to authenticated with check (
  (public.is_business_member(business_id) and requested_by = (select auth.uid()))
  or public.is_platform_admin()
);
create policy "change_requests_manager_update" on public.change_requests
for update to authenticated using (public.can_manage_business(business_id) or public.is_platform_admin())
with check (public.can_manage_business(business_id) or public.is_platform_admin());

create policy "notifications_read_own_or_business" on public.notifications
for select to authenticated using (
  user_id = (select auth.uid())
  or (business_id is not null and public.is_business_member(business_id))
  or public.is_platform_admin()
);
create policy "notifications_update_own" on public.notifications
for update to authenticated using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));
create policy "notifications_admin_insert" on public.notifications
for insert to authenticated with check (public.is_platform_admin());

create policy "onboarding_read" on public.onboarding_drafts
for select to authenticated using (public.is_business_member(business_id) or public.is_platform_admin());
create policy "onboarding_manage" on public.onboarding_drafts
for all to authenticated using (public.can_manage_business(business_id) or public.is_platform_admin())
with check (public.can_manage_business(business_id) or public.is_platform_admin());

create policy "audit_read_admins" on public.audit_log
for select to authenticated using (public.is_platform_admin() or (business_id is not null and public.can_manage_business(business_id)));
create policy "audit_insert_actor" on public.audit_log
for insert to authenticated with check (
  actor_id = (select auth.uid())
  and (business_id is null or public.is_business_member(business_id) or public.is_platform_admin())
);

grant usage on schema public to authenticated;
grant select, insert, update, delete on
  public.businesses, public.business_members, public.receptionist_configs,
  public.services, public.business_hours, public.appointments, public.calls,
  public.leads, public.change_requests, public.notifications, public.onboarding_drafts,
  public.audit_log to authenticated;
grant select, update on public.profiles to authenticated;
grant usage, select on sequence public.audit_log_id_seq to authenticated;

-- Important onboarding note:
-- New business creation does not automatically grant membership. A trusted server-side
-- workflow must create the business and its first owner membership atomically.
-- Never expose a Supabase service-role key in browser code.

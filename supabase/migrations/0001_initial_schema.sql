create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.jwt_device_id()
returns uuid
language sql
stable
as $$
  select nullif(auth.jwt() ->> 'device_id', '')::uuid
$$;

create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  admin_id uuid references auth.users(id) on delete set null,
  "action" text not null,
  target_device_id uuid nullable,
  metadata jsonb not null default '{}'::jsonb
);

create table public.devices (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  hostname text not null,
  os text not null,
  agent_version text not null,
  status text not null default 'OFF' check (status in ('OFF','ON','STREAMING','STOPPED')),
  approved boolean not null default false,
  pairing_code text nullable,
  last_seen_at timestamptz,
  capabilities jsonb not null default '{}'::jsonb,
  selected_screen text nullable,
  selected_camera text nullable,
  selected_microphone text nullable,
  selected_audio_output text nullable
);

create trigger devices_set_updated_at
before update on public.devices
for each row execute function public.set_updated_at();

create table public.device_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  device_id uuid not null references public.devices(id) on delete cascade,
  level text not null default 'info',
  message text not null,
  metadata jsonb not null default '{}'::jsonb
);

create table public.commands (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  device_id uuid not null references public.devices(id) on delete cascade,
  command text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'queued' check (status in ('queued','running','completed','failed')),
  result jsonb not null default '{}'::jsonb,
  completed_at timestamptz nullable
);

create table public.screenshots (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  device_id uuid not null references public.devices(id) on delete cascade,
  screen_id text not null,
  storage_path text not null,
  width int not null,
  height int not null
);

create table public.webrtc_signals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  device_id uuid not null references public.devices(id) on delete cascade,
  session_id text not null,
  sender text not null check (sender in ('dashboard','agent')),
  receiver text not null check (receiver in ('dashboard','agent')),
  type text not null check (type in ('offer','answer','ice')),
  payload jsonb not null
);

create index devices_last_seen_idx on public.devices(last_seen_at desc);
create index device_logs_device_created_idx on public.device_logs(device_id, created_at desc);
create index commands_device_status_idx on public.commands(device_id, status, created_at asc);
create index webrtc_signals_session_idx on public.webrtc_signals(device_id, session_id, created_at asc);

alter table public.admin_audit_logs enable row level security;
alter table public.devices enable row level security;
alter table public.device_logs enable row level security;
alter table public.commands enable row level security;
alter table public.screenshots enable row level security;
alter table public.webrtc_signals enable row level security;

create policy "agent reads own device" on public.devices
for select to authenticated using (id = public.jwt_device_id());

create policy "agent heartbeats own device" on public.devices
for update to authenticated using (id = public.jwt_device_id())
with check (id = public.jwt_device_id());

create policy "agent writes own logs" on public.device_logs
for insert to authenticated with check (device_id = public.jwt_device_id());

create policy "agent reads own queued commands" on public.commands
for select to authenticated using (device_id = public.jwt_device_id());

create policy "agent updates own command status" on public.commands
for update to authenticated using (device_id = public.jwt_device_id())
with check (device_id = public.jwt_device_id());

create policy "agent writes own screenshots" on public.screenshots
for insert to authenticated with check (device_id = public.jwt_device_id());

create policy "agent reads own signals" on public.webrtc_signals
for select to authenticated using (device_id = public.jwt_device_id());

create policy "agent writes own signals" on public.webrtc_signals
for insert to authenticated with check (device_id = public.jwt_device_id() and sender = 'agent');

insert into storage.buckets (id, name, public)
values ('screenshots', 'screenshots', false)
on conflict (id) do nothing;

create policy "agents upload own screenshot objects" on storage.objects
for insert to authenticated with check (
  bucket_id = 'screenshots'
  and public.jwt_device_id() is not null
  and name like (public.jwt_device_id()::text || '/%')
);

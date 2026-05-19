-- 023_utm_visits.sql
-- UTM visit tracking for content marketing attribution

create table if not exists public.utm_visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  session_id text not null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  landing_page text,
  referrer text,
  event text not null,
  event_metadata jsonb
);

create index idx_utm_visits_source_event on public.utm_visits (utm_source, event);
create index idx_utm_visits_campaign on public.utm_visits (utm_campaign);
create index idx_utm_visits_created on public.utm_visits (created_at);

alter table public.utm_visits enable row level security;
-- No RLS policies defined intentionally. Only the service_role key (used by
-- /api/track-utm) can insert/read. If an admin dashboard needs to query this
-- table, add a policy for the authenticated role with admin check.

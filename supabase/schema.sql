-- VV Work (job-platform) schema.
--
-- This Supabase project is shared across several portfolio projects living
-- in one database (see portfolio/task-manager for the sibling project), so
-- every table here is prefixed `job_platform_` to avoid clashing with
-- another project's tables (e.g. `task_manager_*`).
--
-- Safe to re-run: uses `if not exists` / `drop policy if exists` throughout.
-- Paste this whole file into the Supabase SQL Editor for the shared project.
--
-- NOTE: if you already ran an earlier version of this file (plain `text`
-- columns for name/summary/title/description/location instead of jsonb +
-- location_code), the `if not exists` guards below will NOT migrate those
-- columns automatically. Drop the 3 tables first:
--   drop table if exists public.job_platform_jobs cascade;
--   drop table if exists public.job_platform_partners cascade;
--   drop table if exists public.job_platform_contact_submissions cascade;
-- then re-run this file and supabase/seed.sql.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- job_platform_partners
-- ---------------------------------------------------------------------------
create table if not exists public.job_platform_partners (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  logo_url text,
  location_code text not null, -- код міста; лейбл — messages/*.json ("locations")
  categories text[] not null default '{}',
  name jsonb not null,    -- { "uk": "...", "en": "...", "pl": "..." }
  summary jsonb not null, -- { "uk": "...", "en": "...", "pl": "..." }
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- job_platform_jobs
-- ---------------------------------------------------------------------------
create table if not exists public.job_platform_jobs (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.job_platform_partners (id) on delete cascade,
  category text not null check (category in
    ('construction', 'manufacturing', 'logistics', 'hospitality', 'it', 'drivers', 'other')),
  location_code text not null, -- код міста; лейбл — messages/*.json ("locations")
  employment_type text not null check (employment_type in ('full-time', 'part-time', 'seasonal')),
  salary_from int,
  salary_to int,
  currency text check (currency in ('UAH', 'EUR', 'PLN')),
  title jsonb not null,       -- { "uk": "...", "en": "...", "pl": "..." }
  description jsonb not null, -- { "uk": "...", "en": "...", "pl": "..." }
  posted_at timestamptz not null default now()
);

create index if not exists job_platform_jobs_partner_id_idx on public.job_platform_jobs (partner_id);
create index if not exists job_platform_jobs_category_idx on public.job_platform_jobs (category);

-- ---------------------------------------------------------------------------
-- job_platform_contact_submissions
-- ---------------------------------------------------------------------------
-- Не перекладається: це вхідні дані від користувача (заявка), а не контент,
-- який показуємо різними мовами.
create table if not exists public.job_platform_contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  message text default '',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.job_platform_partners enable row level security;
alter table public.job_platform_jobs enable row level security;
alter table public.job_platform_contact_submissions enable row level security;

drop policy if exists "public read partners" on public.job_platform_partners;
create policy "public read partners" on public.job_platform_partners
  for select using (true);

drop policy if exists "public read jobs" on public.job_platform_jobs;
create policy "public read jobs" on public.job_platform_jobs
  for select using (true);

-- Anyone (anon key) can submit the contact/application form, but nobody can
-- read submissions back through the API — no select policy is defined, so
-- with RLS enabled that action is denied by default. Submissions are meant
-- to be reviewed in the Supabase Dashboard (or with the service_role key).
drop policy if exists "public insert contact submissions" on public.job_platform_contact_submissions;
create policy "public insert contact submissions" on public.job_platform_contact_submissions
  for insert with check (true);

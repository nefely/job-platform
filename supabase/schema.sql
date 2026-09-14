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
-- NOTE: if you already ran a version of this file predating jsonb content
-- (plain `text` columns for name/summary/title/description/location instead
-- of jsonb + location_code), the `if not exists` guards below will NOT
-- migrate those columns automatically. Drop the 3 tables first:
--   drop table if exists public.job_platform_jobs cascade;
--   drop table if exists public.job_platform_partners cascade;
--   drop table if exists public.job_platform_contact_submissions cascade;
-- then re-run this file and supabase/seed.sql.
--
-- If you already have the jsonb-based schema and are only picking up the
-- job filter fields added later (work_format/experience_level/
-- required_languages, employment_type gaining 'project'), no drop is
-- needed — just re-run this file, then:
--   delete from public.job_platform_jobs;
-- and re-run the updated supabase/seed.sql (partners are untouched, only
-- jobs are replaced since the job dataset grew substantially).

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
-- job_platform_employers
-- ---------------------------------------------------------------------------
-- Не всі роботодавці — партнери: партнер (job_platform_partners) — агенція
-- чи компанія зі спеціальними стосунками з платформою (своя сторінка,
-- categories, summary), а employer — легка сутність для прямого
-- роботодавця, що просто розмістив вакансію(ї) без жодного зв'язку з
-- партнерами. Без власної сторінки — лише те, що показати на картці/у
-- деталях вакансії.
create table if not exists public.job_platform_employers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  location_code text not null, -- код міста; лейбл — messages/*.json ("locations")
  name text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- job_platform_jobs
-- ---------------------------------------------------------------------------
create table if not exists public.job_platform_jobs (
  id uuid primary key default gen_random_uuid(),
  -- Взаємовиключні (див. job_platform_jobs_org_check нижче): вакансія
  -- належить АБО партнеру, АБО прямому роботодавцю, ніколи обом і ніколи
  -- жодному.
  partner_id uuid references public.job_platform_partners (id) on delete cascade,
  employer_id uuid references public.job_platform_employers (id) on delete cascade,
  category text not null check (category in
    ('construction', 'manufacturing', 'logistics', 'hospitality', 'it', 'drivers', 'other')),
  location_code text not null, -- код міста; лейбл — messages/*.json ("locations")
  employment_type text not null check (employment_type in ('full-time', 'part-time', 'seasonal', 'project')),
  work_format text not null default 'onsite' check (work_format in ('onsite', 'remote', 'hybrid')),
  experience_level text not null default '0-1' check (experience_level in ('0-1', '1-3', '3-5', '5+')),
  required_languages text[] not null default '{}', -- коди мов, messages/*.json ("languages")
  salary_from int,
  salary_to int,
  currency text check (currency in ('UAH', 'EUR', 'PLN')),
  title jsonb not null,       -- { "uk": "...", "en": "...", "pl": "..." }
  description jsonb not null, -- { "uk": "...", "en": "...", "pl": "..." }
  posted_at timestamptz not null default now()
);

-- Міграція для вже існуючої таблиці job_platform_jobs (безпечно
-- перезапускати, нічого не видаляє). `default` у `add column` потрібен
-- лише щоб ALTER не впав на вже заповненій таблиці — реальні значення для
-- кожного рядка все одно приходять із seed.sql.
alter table public.job_platform_jobs
  add column if not exists work_format text not null default 'onsite',
  add column if not exists experience_level text not null default '0-1',
  add column if not exists required_languages text[] not null default '{}',
  add column if not exists employer_id uuid references public.job_platform_employers (id) on delete cascade;

-- partner_id був not null, поки кожна вакансія обов'язково належала
-- партнеру — тепер вакансія може належати прямому роботодавцю замість
-- партнера, тож обмеження переїхало у job_platform_jobs_org_check нижче.
alter table public.job_platform_jobs alter column partner_id drop not null;

alter table public.job_platform_jobs drop constraint if exists job_platform_jobs_employment_type_check;
alter table public.job_platform_jobs add constraint job_platform_jobs_employment_type_check
  check (employment_type in ('full-time', 'part-time', 'seasonal', 'project'));

alter table public.job_platform_jobs drop constraint if exists job_platform_jobs_work_format_check;
alter table public.job_platform_jobs add constraint job_platform_jobs_work_format_check
  check (work_format in ('onsite', 'remote', 'hybrid'));

alter table public.job_platform_jobs drop constraint if exists job_platform_jobs_experience_level_check;
alter table public.job_platform_jobs add constraint job_platform_jobs_experience_level_check
  check (experience_level in ('0-1', '1-3', '3-5', '5+'));

-- Рівно одне з partner_id/employer_id має бути заповнене — вакансія або
-- партнерська, або від прямого роботодавця, ніколи обидва й ніколи жодне.
alter table public.job_platform_jobs drop constraint if exists job_platform_jobs_org_check;
alter table public.job_platform_jobs add constraint job_platform_jobs_org_check
  check (
    (partner_id is not null and employer_id is null) or
    (partner_id is null and employer_id is not null)
  );

create index if not exists job_platform_jobs_partner_id_idx on public.job_platform_jobs (partner_id);
create index if not exists job_platform_jobs_employer_id_idx on public.job_platform_jobs (employer_id);
create index if not exists job_platform_jobs_category_idx on public.job_platform_jobs (category);

-- ---------------------------------------------------------------------------
-- job_platform_candidates
-- ---------------------------------------------------------------------------
-- На відміну від partners/jobs, name/headline/about НЕ jsonb: це текст,
-- який кандидат один раз пише про себе своєю мовою (як справжнє резюме),
-- а не маркетинговий контент, перекладений на 3 мови. profile_locale
-- фіксує, якою мовою написано профіль.
create table if not exists public.job_platform_candidates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  avatar_url text,
  categories text[] not null default '{}',
  headline text not null,
  profile_locale text not null check (profile_locale in ('uk', 'en', 'pl')),
  location_code text not null, -- код міста; лейбл — messages/*.json ("locations")
  desired_employment_types text[] not null default '{}',
  desired_work_formats text[] not null default '{}',
  experience_level text not null default '0-1' check (experience_level in ('0-1', '1-3', '3-5', '5+')),
  languages jsonb not null default '[]', -- [{ "code": "uk", "level": "native" }, ...]
  skills text[] not null default '{}',
  about text,
  salary_expectation_from int,
  currency text check (currency in ('UAH', 'EUR', 'PLN')),
  available_from date,
  updated_at timestamptz not null default now()
);

create index if not exists job_platform_candidates_categories_idx
  on public.job_platform_candidates using gin (categories);

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
alter table public.job_platform_employers enable row level security;
alter table public.job_platform_jobs enable row level security;
alter table public.job_platform_candidates enable row level security;
alter table public.job_platform_contact_submissions enable row level security;

drop policy if exists "public read partners" on public.job_platform_partners;
create policy "public read partners" on public.job_platform_partners
  for select using (true);

drop policy if exists "public read employers" on public.job_platform_employers;
create policy "public read employers" on public.job_platform_employers
  for select using (true);

drop policy if exists "public read jobs" on public.job_platform_jobs;
create policy "public read jobs" on public.job_platform_jobs
  for select using (true);

-- Кандидати поки без реєстрації/акаунтів (див. заплановану фічу
-- accounts+applications) — це демо-каталог профілів для сторінки пошуку
-- працівників, тому лише публічне читання, без insert-політики.
drop policy if exists "public read candidates" on public.job_platform_candidates;
create policy "public read candidates" on public.job_platform_candidates
  for select using (true);

-- Anyone (anon key) can submit the contact/application form, but nobody can
-- read submissions back through the API — no select policy is defined, so
-- with RLS enabled that action is denied by default. Submissions are meant
-- to be reviewed in the Supabase Dashboard (or with the service_role key).
drop policy if exists "public insert contact submissions" on public.job_platform_contact_submissions;
create policy "public insert contact submissions" on public.job_platform_contact_submissions
  for insert with check (true);

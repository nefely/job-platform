// Рендерить supabase/seed.sql із supabase/seed-data.mjs і
// supabase/candidates-seed-data.mjs.
// Запуск: node supabase/generate-seed.mjs
//
// Навіщо: ~60 вакансій × 3 мови (+ ~100 профілів кандидатів) вручну
// вписаних у сирий SQL — це багато місць, де легко забути екранувати
// одинарну лапку в апострофі (уже траплялось: кур'єр, комір'я тощо). Тут
// це робиться в одному місці.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { partners, jobs } from "./seed-data.mjs";
import { candidates } from "./candidates-seed-data.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlLocalizedJsonb(text) {
  return `jsonb_build_object('uk', ${sqlString(text.uk)}, 'en', ${sqlString(text.en)}, 'pl', ${sqlString(text.pl)})`;
}

function sqlTextArray(values) {
  if (values.length === 0) return "array[]::text[]";
  return `array[${values.map(sqlString).join(", ")}]`;
}

function sqlNullable(value, renderer) {
  return value == null ? "null" : renderer(value);
}

function sqlLanguagesJsonb(languages) {
  if (languages.length === 0) return "'[]'::jsonb";
  const items = languages.map(
    (l) => `jsonb_build_object('code', ${sqlString(l.code)}, 'level', ${sqlString(l.level)})`,
  );
  return `jsonb_build_array(${items.join(", ")})`;
}

function renderPartnersInsert() {
  const rows = partners.map(
    (p) => `  (
    ${sqlString(p.slug)},
    ${sqlString(p.locationCode)},
    ${sqlTextArray(p.categories)},
    ${sqlLocalizedJsonb(p.name)},
    ${sqlLocalizedJsonb(p.summary)}
  )`,
  );

  return `insert into public.job_platform_partners (slug, location_code, categories, name, summary)
values
${rows.join(",\n")}
on conflict (slug) do nothing;`;
}

function renderJobsInsert() {
  const rows = jobs.map((j) => {
    const values = [
      sqlString(j.partnerSlug),
      sqlString(j.category),
      sqlString(j.locationCode),
      sqlString(j.employmentType),
      sqlString(j.workFormat),
      sqlString(j.experienceLevel),
      sqlTextArray(j.requiredLanguages),
      String(j.salaryFrom),
      String(j.salaryTo),
      sqlString(j.currency),
      sqlString(j.title.uk),
      sqlString(j.title.en),
      sqlString(j.title.pl),
      sqlString(j.description.uk),
      sqlString(j.description.en),
      sqlString(j.description.pl),
    ];
    return `  (${values.join(", ")})`;
  });

  return `insert into public.job_platform_jobs
  (partner_id, category, location_code, employment_type, work_format, experience_level,
   required_languages, salary_from, salary_to, currency, title, description)
select
  p.id, v.category, v.location_code, v.employment_type, v.work_format, v.experience_level,
  v.required_languages, v.salary_from, v.salary_to, v.currency,
  jsonb_build_object('uk', v.title_uk, 'en', v.title_en, 'pl', v.title_pl),
  jsonb_build_object('uk', v.description_uk, 'en', v.description_en, 'pl', v.description_pl)
from (
  values
${rows.join(",\n")}
) as v(
  partner_slug, category, location_code, employment_type, work_format, experience_level,
  required_languages, salary_from, salary_to, currency,
  title_uk, title_en, title_pl, description_uk, description_en, description_pl
)
join public.job_platform_partners p on p.slug = v.partner_slug
where not exists (
  select 1 from public.job_platform_jobs j
  where j.partner_id = p.id and j.title ->> 'en' = v.title_en
);`;
}

function renderCandidatesInsert() {
  const rows = candidates.map((c) => {
    const values = [
      sqlString(c.slug),
      sqlString(c.name),
      sqlTextArray(c.categories),
      sqlString(c.headline),
      sqlString(c.profileLocale),
      sqlString(c.locationCode),
      sqlTextArray(c.desiredEmploymentTypes),
      sqlTextArray(c.desiredWorkFormats),
      sqlString(c.experienceLevel),
      sqlLanguagesJsonb(c.languages),
      sqlTextArray(c.skills),
      sqlNullable(c.about, sqlString),
      sqlNullable(c.salaryExpectationFrom, String),
      sqlNullable(c.currency, sqlString),
      sqlNullable(c.availableFrom, sqlString),
    ];
    return `  (${values.join(", ")})`;
  });

  return `insert into public.job_platform_candidates
  (slug, name, categories, headline, profile_locale, location_code, desired_employment_types,
   desired_work_formats, experience_level, languages, skills, about, salary_expectation_from,
   currency, available_from)
values
${rows.join(",\n")}
on conflict (slug) do nothing;`;
}

const output = `-- VV Work (job-platform) demo data.
-- GENERATED FILE — do not edit by hand. Source of truth is
-- supabase/seed-data.mjs; regenerate with \`node supabase/generate-seed.mjs\`.
--
-- Idempotent: safe to re-run (partners via \`on conflict (slug) do nothing\`,
-- jobs via \`where not exists\` keyed on partner + English title).
-- Run this AFTER schema.sql, in the Supabase SQL Editor.
--
-- If you're picking up the job-filters update (work_format/experience_level/
-- required_languages, more jobs) on a database that already has the older
-- 20-job dataset, run this first:
--   delete from public.job_platform_jobs;
-- (partners are untouched — this file only adds them via on-conflict-do-nothing)

-- ---------------------------------------------------------------------------
-- Partners
-- ---------------------------------------------------------------------------
${renderPartnersInsert()}

-- ---------------------------------------------------------------------------
-- Jobs (${jobs.length})
-- ---------------------------------------------------------------------------
${renderJobsInsert()}

-- ---------------------------------------------------------------------------
-- Candidates (${candidates.length})
-- ---------------------------------------------------------------------------
${renderCandidatesInsert()}
`;

const outPath = join(__dirname, "seed.sql");
writeFileSync(outPath, output, "utf8");
console.log(
  `Wrote ${jobs.length} jobs, ${partners.length} partners and ${candidates.length} candidates to ${outPath}`,
);

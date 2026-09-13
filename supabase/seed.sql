-- VV Work (job-platform) demo data.
-- Idempotent: safe to re-run (partners via `on conflict (slug) do nothing`,
-- jobs via `where not exists` keyed on partner + title).
-- Run this AFTER schema.sql, in the Supabase SQL Editor.

-- ---------------------------------------------------------------------------
-- Partners
-- ---------------------------------------------------------------------------
insert into public.job_platform_partners (slug, name, location, summary, categories)
values
  (
    'euro-logistics',
    'EuroLogistics Group',
    'Варшава, Польща',
    'Кадрове агентство повного циклу: підбираємо персонал для логістики, виробництва, будівництва, готельно-ресторанної сфери та IT по всій Європі.',
    array['logistics', 'drivers', 'manufacturing', 'construction', 'hospitality', 'it', 'other']
  ),
  (
    'buildpro-europe',
    'BuildPro Europe',
    'Гданськ, Польща',
    'Будівельна компанія повного циклу — житлові та комерційні об''єкти в Польщі й Німеччині.',
    array['construction']
  ),
  (
    'hotel-alpina',
    'Hotel Alpina Group',
    'Мюнхен, Німеччина',
    'Мережа готелів у Баварії — від рецепції до кухні, стабільна зайнятість цілий рік.',
    array['hospitality']
  ),
  (
    'technova-solutions',
    'TechNova Solutions',
    'Берлін, Німеччина',
    'IT-аутсорсинг та продуктова розробка — remote-friendly команди для проєктів у Європі.',
    array['it']
  ),
  (
    'primefoods-manufacturing',
    'PrimeFoods Manufacturing',
    'Краків, Польща',
    'Харчове виробництво повного циклу, сучасні лінії, офіційне працевлаштування.',
    array['manufacturing']
  ),
  (
    'allroles-staffing',
    'AllRoles Staffing',
    'Прага, Чехія',
    'Гнучкі підробітки та постійні вакансії без вимог до досвіду — від кур''єра до вантажника.',
    array['other', 'logistics']
  )
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Jobs
-- ---------------------------------------------------------------------------
insert into public.job_platform_jobs
  (partner_id, title, category, location, employment_type, salary_from, salary_to, currency, description)
select p.id, v.title, v.category, v.location, v.employment_type, v.salary_from, v.salary_to, v.currency, v.description
from (
  values
    -- EuroLogistics Group — по одній-дві вакансії на кожну категорію
    ('euro-logistics', 'Водій категорії CE (міжнародні рейси)', 'drivers', 'Варшава, Польща', 'full-time', 1800, 2400, 'EUR', 'Регулярні міжнародні рейси по ЄС, власний тягач компанії, оплата палива й проживання.'),
    ('euro-logistics', 'Водій-експедитор категорії B', 'drivers', 'Познань, Польща', 'full-time', 1400, 1700, 'EUR', 'Розвізка товару в межах міста та області, службовий автомобіль.'),
    ('euro-logistics', 'Комплектувальник складу', 'logistics', 'Варшава, Польща', 'full-time', 1300, 1500, 'EUR', 'Прийом і комплектація замовлень на сучасному складі, навчання на місці.'),
    ('euro-logistics', 'Диспетчер логістики', 'logistics', 'Варшава, Польща', 'full-time', 1600, 2000, 'EUR', 'Координація маршрутів і водіїв, англійська на рівні B1.'),
    ('euro-logistics', 'Різноробочий на будівництво', 'construction', 'Гданськ, Польща', 'seasonal', 1200, 1500, 'EUR', 'Загальнобудівельні роботи, сезонний контракт із можливістю продовження.'),
    ('euro-logistics', 'Оператор виробничої лінії', 'manufacturing', 'Краків, Польща', 'full-time', 1350, 1600, 'EUR', 'Робота на автоматизованій лінії, позмінний графік.'),
    ('euro-logistics', 'Офіціант/-ка в готель', 'hospitality', 'Мюнхен, Німеччина', 'part-time', 1100, 1400, 'EUR', 'Обслуговування гостей ресторану при готелі, гнучкий графік.'),
    ('euro-logistics', 'Frontend-розробник (Junior)', 'it', 'Берлін, Німеччина', 'full-time', 2200, 2800, 'EUR', 'React/TypeScript, віддалена робота, англомовна команда.'),
    ('euro-logistics', 'Різноробочий (склад, логістика)', 'other', 'Вроцлав, Польща', 'seasonal', 1100, 1300, 'EUR', 'Допоміжні роботи на складі, без досвіду, навчання на місці.'),
    ('euro-logistics', 'Кухар', 'hospitality', 'Мюнхен, Німеччина', 'full-time', 1500, 1900, 'EUR', 'Кухня європейської мережі готелів, офіційне працевлаштування.'),

    -- BuildPro Europe
    ('buildpro-europe', 'Муляр', 'construction', 'Гданськ, Польща', 'full-time', 1600, 2000, 'EUR', 'Мурування, монолітні роботи, досвід від 1 року.'),
    ('buildpro-europe', 'Бригадир будівельної бригади', 'construction', 'Варшава, Польща', 'full-time', 2000, 2600, 'EUR', 'Керівництво бригадою 5–8 осіб, досвід від 3 років.'),

    -- Hotel Alpina Group
    ('hotel-alpina', 'Покоївка', 'hospitality', 'Мюнхен, Німеччина', 'full-time', 1300, 1500, 'EUR', 'Прибирання номерів, графік 5/2, проживання надається.'),
    ('hotel-alpina', 'Адміністратор готелю', 'hospitality', 'Зальцбург, Австрія', 'full-time', 1600, 1900, 'EUR', 'Рецепція, англійська/німецька розмовна, робота позмінно.'),

    -- TechNova Solutions
    ('technova-solutions', 'QA-інженер', 'it', 'Берлін, Німеччина', 'full-time', 2400, 3000, 'EUR', 'Мануальне й автоматизоване тестування веб-застосунків, remote.'),
    ('technova-solutions', 'DevOps-інженер', 'it', 'Берлін, Німеччина', 'full-time', 3000, 3800, 'EUR', 'CI/CD, Docker/Kubernetes, remote-friendly.'),

    -- PrimeFoods Manufacturing
    ('primefoods-manufacturing', 'Пакувальник на виробництві', 'manufacturing', 'Краків, Польща', 'full-time', 1250, 1450, 'EUR', 'Пакування готової продукції, позмінний графік.'),
    ('primefoods-manufacturing', 'Технолог харчового виробництва', 'manufacturing', 'Краків, Польща', 'full-time', 1800, 2200, 'EUR', 'Контроль якості й техпроцесу, профільна освіта.'),

    -- AllRoles Staffing
    ('allroles-staffing', 'Кур''єр', 'other', 'Прага, Чехія', 'part-time', 1000, 1300, 'EUR', 'Доставка замовлень по місту, власний транспорт вітається.'),
    ('allroles-staffing', 'Вантажник', 'logistics', 'Прага, Чехія', 'full-time', 1200, 1400, 'EUR', 'Навантаження/розвантаження на складі, змінний графік.')
) as v(partner_slug, title, category, location, employment_type, salary_from, salary_to, currency, description)
join public.job_platform_partners p on p.slug = v.partner_slug
where not exists (
  select 1 from public.job_platform_jobs j
  where j.partner_id = p.id and j.title = v.title
);

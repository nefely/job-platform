-- VV Work (job-platform) demo data.
-- Idempotent: safe to re-run (partners via `on conflict (slug) do nothing`,
-- jobs via `where not exists` keyed on partner + English title).
-- Run this AFTER schema.sql, in the Supabase SQL Editor.
--
-- If you ran an earlier (pre-localization) version of this file, drop the
-- tables first and re-run schema.sql — see the note at the top of that file.

-- ---------------------------------------------------------------------------
-- Partners
-- ---------------------------------------------------------------------------
insert into public.job_platform_partners (slug, location_code, categories, name, summary)
values
  (
    'euro-logistics',
    'warsaw',
    array['logistics', 'drivers', 'manufacturing', 'construction', 'hospitality', 'it', 'other'],
    jsonb_build_object('uk', 'EuroLogistics Group', 'en', 'EuroLogistics Group', 'pl', 'EuroLogistics Group'),
    jsonb_build_object(
      'uk', 'Кадрове агентство повного циклу: підбираємо персонал для логістики, виробництва, будівництва, готельно-ресторанної сфери та IT по всій Європі.',
      'en', 'Full-cycle staffing agency: we recruit for logistics, manufacturing, construction, hospitality and IT across Europe.',
      'pl', 'Agencja rekrutacyjna pełnego cyklu: rekrutujemy do logistyki, produkcji, budownictwa, hotelarstwa i IT w całej Europie.'
    )
  ),
  (
    'buildpro-europe',
    'gdansk',
    array['construction'],
    jsonb_build_object('uk', 'BuildPro Europe', 'en', 'BuildPro Europe', 'pl', 'BuildPro Europe'),
    jsonb_build_object(
      'uk', 'Будівельна компанія повного циклу — житлові та комерційні об''єкти в Польщі й Німеччині.',
      'en', 'Full-cycle construction company — residential and commercial projects in Poland and Germany.',
      'pl', 'Firma budowlana pełnego cyklu — obiekty mieszkalne i komercyjne w Polsce i Niemczech.'
    )
  ),
  (
    'hotel-alpina',
    'munich',
    array['hospitality'],
    jsonb_build_object('uk', 'Hotel Alpina Group', 'en', 'Hotel Alpina Group', 'pl', 'Hotel Alpina Group'),
    jsonb_build_object(
      'uk', 'Мережа готелів у Баварії — від рецепції до кухні, стабільна зайнятість цілий рік.',
      'en', 'A hotel chain in Bavaria — from reception to kitchen, stable year-round employment.',
      'pl', 'Sieć hoteli w Bawarii — od recepcji po kuchnię, stabilne zatrudnienie przez cały rok.'
    )
  ),
  (
    'technova-solutions',
    'berlin',
    array['it'],
    jsonb_build_object('uk', 'TechNova Solutions', 'en', 'TechNova Solutions', 'pl', 'TechNova Solutions'),
    jsonb_build_object(
      'uk', 'IT-аутсорсинг та продуктова розробка — remote-friendly команди для проєктів у Європі.',
      'en', 'IT outsourcing and product development — remote-friendly teams for projects across Europe.',
      'pl', 'Outsourcing IT i rozwój produktów — zespoły przyjazne pracy zdalnej dla projektów w Europie.'
    )
  ),
  (
    'primefoods-manufacturing',
    'krakow',
    array['manufacturing'],
    jsonb_build_object('uk', 'PrimeFoods Manufacturing', 'en', 'PrimeFoods Manufacturing', 'pl', 'PrimeFoods Manufacturing'),
    jsonb_build_object(
      'uk', 'Харчове виробництво повного циклу, сучасні лінії, офіційне працевлаштування.',
      'en', 'Full-cycle food manufacturing, modern production lines, official employment.',
      'pl', 'Produkcja spożywcza pełnego cyklu, nowoczesne linie produkcyjne, legalne zatrudnienie.'
    )
  ),
  (
    'allroles-staffing',
    'prague',
    array['other', 'logistics'],
    jsonb_build_object('uk', 'AllRoles Staffing', 'en', 'AllRoles Staffing', 'pl', 'AllRoles Staffing'),
    jsonb_build_object(
      'uk', 'Гнучкі підробітки та постійні вакансії без вимог до досвіду — від кур''єра до вантажника.',
      'en', 'Flexible side jobs and permanent vacancies with no experience required — from courier to warehouse loader.',
      'pl', 'Elastyczne dorywcze prace i stałe oferty bez wymaganego doświadczenia — od kuriera po magazyniera.'
    )
  )
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Jobs
-- ---------------------------------------------------------------------------
insert into public.job_platform_jobs
  (partner_id, category, location_code, employment_type, salary_from, salary_to, currency, title, description)
select
  p.id,
  v.category,
  v.location_code,
  v.employment_type,
  v.salary_from,
  v.salary_to,
  v.currency,
  jsonb_build_object('uk', v.title_uk, 'en', v.title_en, 'pl', v.title_pl),
  jsonb_build_object('uk', v.description_uk, 'en', v.description_en, 'pl', v.description_pl)
from (
  values
    -- EuroLogistics Group — по одній-дві вакансії на кожну категорію
    (
      'euro-logistics', 'drivers', 'warsaw', 'full-time', 1800, 2400, 'EUR',
      'Водій категорії CE (міжнародні рейси)', 'CE category driver (international routes)', 'Kierowca kat. CE (trasy międzynarodowe)',
      'Регулярні міжнародні рейси по ЄС, власний тягач компанії, оплата палива й проживання.',
      'Regular international routes across the EU, company-owned truck, fuel and accommodation covered.',
      'Regularne trasy międzynarodowe po UE, ciągnik firmowy, opłacone paliwo i zakwaterowanie.'
    ),
    (
      'euro-logistics', 'drivers', 'poznan', 'full-time', 1400, 1700, 'EUR',
      'Водій-експедитор категорії B', 'Category B delivery driver', 'Kierowca-spedytor kat. B',
      'Розвізка товару в межах міста та області, службовий автомобіль.',
      'Local and regional deliveries, company vehicle provided.',
      'Dostawy towaru w mieście i okolicy, samochód służbowy.'
    ),
    (
      'euro-logistics', 'logistics', 'warsaw', 'full-time', 1300, 1500, 'EUR',
      'Комплектувальник складу', 'Warehouse picker', 'Kompletator magazynowy',
      'Прийом і комплектація замовлень на сучасному складі, навчання на місці.',
      'Order receiving and picking at a modern warehouse, on-the-job training.',
      'Przyjmowanie i kompletacja zamówień w nowoczesnym magazynie, szkolenie na miejscu.'
    ),
    (
      'euro-logistics', 'logistics', 'warsaw', 'full-time', 1600, 2000, 'EUR',
      'Диспетчер логістики', 'Logistics dispatcher', 'Dyspozytor logistyki',
      'Координація маршрутів і водіїв, англійська на рівні B1.',
      'Coordinating routes and drivers, English at B1 level.',
      'Koordynacja tras i kierowców, angielski na poziomie B1.'
    ),
    (
      'euro-logistics', 'construction', 'gdansk', 'seasonal', 1200, 1500, 'EUR',
      'Різноробочий на будівництво', 'General construction laborer', 'Pracownik ogólnobudowlany',
      'Загальнобудівельні роботи, сезонний контракт із можливістю продовження.',
      'General construction work, seasonal contract with a chance of extension.',
      'Prace ogólnobudowlane, kontrakt sezonowy z możliwością przedłużenia.'
    ),
    (
      'euro-logistics', 'manufacturing', 'krakow', 'full-time', 1350, 1600, 'EUR',
      'Оператор виробничої лінії', 'Production line operator', 'Operator linii produkcyjnej',
      'Робота на автоматизованій лінії, позмінний графік.',
      'Work on an automated line, shift schedule.',
      'Praca przy zautomatyzowanej linii, harmonogram zmianowy.'
    ),
    (
      'euro-logistics', 'hospitality', 'munich', 'part-time', 1100, 1400, 'EUR',
      'Офіціант/-ка в готель', 'Hotel waiter/waitress', 'Kelner/-ka w hotelu',
      'Обслуговування гостей ресторану при готелі, гнучкий графік.',
      'Serving guests at the hotel restaurant, flexible schedule.',
      'Obsługa gości restauracji hotelowej, elastyczny grafik.'
    ),
    (
      'euro-logistics', 'it', 'berlin', 'full-time', 2200, 2800, 'EUR',
      'Frontend-розробник (Junior)', 'Frontend Developer (Junior)', 'Programista Frontend (Junior)',
      'React/TypeScript, віддалена робота, англомовна команда.',
      'React/TypeScript, remote work, English-speaking team.',
      'React/TypeScript, praca zdalna, zespół anglojęzyczny.'
    ),
    (
      'euro-logistics', 'other', 'wroclaw', 'seasonal', 1100, 1300, 'EUR',
      'Різноробочий (склад, логістика)', 'General worker (warehouse, logistics)', 'Pracownik ogólny (magazyn, logistyka)',
      'Допоміжні роботи на складі, без досвіду, навчання на місці.',
      'Auxiliary warehouse work, no experience required, on-the-job training.',
      'Prace pomocnicze w magazynie, bez doświadczenia, szkolenie na miejscu.'
    ),
    (
      'euro-logistics', 'hospitality', 'munich', 'full-time', 1500, 1900, 'EUR',
      'Кухар', 'Cook', 'Kucharz/-rka',
      'Кухня європейської мережі готелів, офіційне працевлаштування.',
      'Kitchen of a European hotel chain, official employment.',
      'Kuchnia europejskiej sieci hotelowej, legalne zatrudnienie.'
    ),

    -- BuildPro Europe
    (
      'buildpro-europe', 'construction', 'gdansk', 'full-time', 1600, 2000, 'EUR',
      'Муляр', 'Bricklayer', 'Murarz',
      'Мурування, монолітні роботи, досвід від 1 року.',
      'Bricklaying, cast-in-place concrete work, 1+ year of experience.',
      'Murowanie, prace żelbetowe, min. rok doświadczenia.'
    ),
    (
      'buildpro-europe', 'construction', 'warsaw', 'full-time', 2000, 2600, 'EUR',
      'Бригадир будівельної бригади', 'Construction crew foreman', 'Brygadzista budowlany',
      'Керівництво бригадою 5-8 осіб, досвід від 3 років.',
      'Leading a crew of 5-8 people, 3+ years of experience.',
      'Kierowanie brygadą 5-8 osób, min. 3 lata doświadczenia.'
    ),

    -- Hotel Alpina Group
    (
      'hotel-alpina', 'hospitality', 'munich', 'full-time', 1300, 1500, 'EUR',
      'Покоївка', 'Housekeeper', 'Pokojówka',
      'Прибирання номерів, графік 5/2, проживання надається.',
      'Room cleaning, 5/2 schedule, accommodation provided.',
      'Sprzątanie pokoi, grafik 5/2, zapewnione zakwaterowanie.'
    ),
    (
      'hotel-alpina', 'hospitality', 'salzburg', 'full-time', 1600, 1900, 'EUR',
      'Адміністратор готелю', 'Hotel receptionist', 'Recepcjonista/-ka hotelowy/-a',
      'Рецепція, англійська/німецька розмовна, робота позмінно.',
      'Front desk, conversational English/German, shift work.',
      'Recepcja, komunikatywny angielski/niemiecki, praca zmianowa.'
    ),

    -- TechNova Solutions
    (
      'technova-solutions', 'it', 'berlin', 'full-time', 2400, 3000, 'EUR',
      'QA-інженер', 'QA Engineer', 'Inżynier QA',
      'Мануальне й автоматизоване тестування веб-застосунків, remote.',
      'Manual and automated testing of web applications, remote.',
      'Testowanie manualne i automatyczne aplikacji webowych, zdalnie.'
    ),
    (
      'technova-solutions', 'it', 'berlin', 'full-time', 3000, 3800, 'EUR',
      'DevOps-інженер', 'DevOps Engineer', 'Inżynier DevOps',
      'CI/CD, Docker/Kubernetes, remote-friendly.',
      'CI/CD, Docker/Kubernetes, remote-friendly.',
      'CI/CD, Docker/Kubernetes, przyjazne pracy zdalnej.'
    ),

    -- PrimeFoods Manufacturing
    (
      'primefoods-manufacturing', 'manufacturing', 'krakow', 'full-time', 1250, 1450, 'EUR',
      'Пакувальник на виробництві', 'Production packer', 'Pakowacz na produkcji',
      'Пакування готової продукції, позмінний графік.',
      'Packing finished products, shift schedule.',
      'Pakowanie gotowych produktów, grafik zmianowy.'
    ),
    (
      'primefoods-manufacturing', 'manufacturing', 'krakow', 'full-time', 1800, 2200, 'EUR',
      'Технолог харчового виробництва', 'Food production technologist', 'Technolog produkcji spożywczej',
      'Контроль якості й техпроцесу, профільна освіта.',
      'Quality and process control, relevant education required.',
      'Kontrola jakości i procesu technologicznego, wykształcenie kierunkowe.'
    ),

    -- AllRoles Staffing
    (
      'allroles-staffing', 'other', 'prague', 'part-time', 1000, 1300, 'EUR',
      'Кур''єр', 'Courier', 'Kurier',
      'Доставка замовлень по місту, власний транспорт вітається.',
      'Delivering orders around the city, own transport is a plus.',
      'Dostawa zamówień po mieście, mile widziany własny transport.'
    ),
    (
      'allroles-staffing', 'logistics', 'prague', 'full-time', 1200, 1400, 'EUR',
      'Вантажник', 'Warehouse loader', 'Magazynier',
      'Навантаження/розвантаження на складі, змінний графік.',
      'Loading/unloading at the warehouse, shift schedule.',
      'Załadunek/rozładunek w magazynie, grafik zmianowy.'
    )
) as v(
  partner_slug, category, location_code, employment_type, salary_from, salary_to, currency,
  title_uk, title_en, title_pl, description_uk, description_en, description_pl
)
join public.job_platform_partners p on p.slug = v.partner_slug
where not exists (
  select 1 from public.job_platform_jobs j
  where j.partner_id = p.id and j.title ->> 'en' = v.title_en
);

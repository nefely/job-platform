// Джерело правди для supabase/seed.sql. Редагувати треба ЦЕЙ файл, а тоді
// перегенерувати SQL: `node supabase/generate-seed.mjs`.
//
// Структуровані дані замість руки-писаного SQL — менше ризику помилок
// екранування лапок у ~60 багатомовних записах; generate-seed.mjs сам
// коректно екранує апострофи при рендері INSERT-виразів.

export const partners = [
  {
    slug: "euro-logistics",
    locationCode: "warsaw",
    categories: ["logistics", "drivers", "manufacturing", "construction", "hospitality", "it", "other"],
    name: { uk: "EuroLogistics Group", en: "EuroLogistics Group", pl: "EuroLogistics Group" },
    summary: {
      uk: "Кадрове агентство повного циклу: підбираємо персонал для логістики, виробництва, будівництва, готельно-ресторанної сфери та IT по всій Європі.",
      en: "Full-cycle staffing agency: we recruit for logistics, manufacturing, construction, hospitality and IT across Europe.",
      pl: "Agencja rekrutacyjna pełnego cyklu: rekrutujemy do logistyki, produkcji, budownictwa, hotelarstwa i IT w całej Europie.",
    },
  },
  {
    slug: "buildpro-europe",
    locationCode: "gdansk",
    categories: ["construction"],
    name: { uk: "BuildPro Europe", en: "BuildPro Europe", pl: "BuildPro Europe" },
    summary: {
      uk: "Будівельна компанія повного циклу — житлові та комерційні об'єкти в Польщі й Німеччині.",
      en: "Full-cycle construction company — residential and commercial projects in Poland and Germany.",
      pl: "Firma budowlana pełnego cyklu — obiekty mieszkalne i komercyjne w Polsce i Niemczech.",
    },
  },
  {
    slug: "hotel-alpina",
    locationCode: "munich",
    categories: ["hospitality"],
    name: { uk: "Hotel Alpina Group", en: "Hotel Alpina Group", pl: "Hotel Alpina Group" },
    summary: {
      uk: "Мережа готелів у Баварії — від рецепції до кухні, стабільна зайнятість цілий рік.",
      en: "A hotel chain in Bavaria — from reception to kitchen, stable year-round employment.",
      pl: "Sieć hoteli w Bawarii — od recepcji po kuchnię, stabilne zatrudnienie przez cały rok.",
    },
  },
  {
    slug: "technova-solutions",
    locationCode: "berlin",
    categories: ["it"],
    name: { uk: "TechNova Solutions", en: "TechNova Solutions", pl: "TechNova Solutions" },
    summary: {
      uk: "IT-аутсорсинг та продуктова розробка — remote-friendly команди для проєктів у Європі.",
      en: "IT outsourcing and product development — remote-friendly teams for projects across Europe.",
      pl: "Outsourcing IT i rozwój produktów — zespoły przyjazne pracy zdalnej dla projektów w Europie.",
    },
  },
  {
    slug: "primefoods-manufacturing",
    locationCode: "krakow",
    categories: ["manufacturing"],
    name: { uk: "PrimeFoods Manufacturing", en: "PrimeFoods Manufacturing", pl: "PrimeFoods Manufacturing" },
    summary: {
      uk: "Харчове виробництво повного циклу, сучасні лінії, офіційне працевлаштування.",
      en: "Full-cycle food manufacturing, modern production lines, official employment.",
      pl: "Produkcja spożywcza pełnego cyklu, nowoczesne linie produkcyjne, legalne zatrudnienie.",
    },
  },
  {
    slug: "allroles-staffing",
    locationCode: "prague",
    categories: ["other", "logistics"],
    name: { uk: "AllRoles Staffing", en: "AllRoles Staffing", pl: "AllRoles Staffing" },
    summary: {
      uk: "Гнучкі підробітки та постійні вакансії без вимог до досвіду — від кур'єра до вантажника.",
      en: "Flexible side jobs and permanent vacancies with no experience required — from courier to warehouse loader.",
      pl: "Elastyczne dorywcze prace i stałe oferty bez wymaganego doświadczenia — od kuriera po magazyniera.",
    },
  },
];

// ---------------------------------------------------------------------------
// Jobs — ~60, розподілені по 6 партнерах (15 у EuroLogistics, по 9 в решти).
// employmentType: full-time | part-time | seasonal | project
// workFormat: onsite | remote | hybrid
// experienceLevel: 0-1 | 1-3 | 3-5 | 5+
// requiredLanguages: коди мов (uk/en/de/pl), може бути []
// ---------------------------------------------------------------------------
export const jobs = [
  // --- EuroLogistics Group (15) ---
  {
    partnerSlug: "euro-logistics", category: "drivers", locationCode: "warsaw",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "3-5", requiredLanguages: ["en"],
    salaryFrom: 1800, salaryTo: 2400, currency: "EUR",
    title: { uk: "Водій категорії CE (міжнародні рейси)", en: "CE category driver (international routes)", pl: "Kierowca kat. CE (trasy międzynarodowe)" },
    description: {
      uk: "Регулярні міжнародні рейси по маршрутах ЄС на сучасному тягачі компанії. Оплачуємо паливо, проживання та добові, надаємо GPS-навігацію і цілодобову диспетчерську підтримку. Очікуємо чинну категорію CE, картку водія та досвід міжнародних перевезень від 3 років.",
      en: "Regular international routes across the EU on a modern company-owned truck. We cover fuel, accommodation and per diems, and provide GPS navigation with round-the-clock dispatcher support. Requires a valid category CE licence, a driver card, and at least 3 years of international hauling experience.",
      pl: "Regularne trasy międzynarodowe po UE nowoczesnym ciągnikiem firmowym. Pokrywamy paliwo, nocleg i diety, zapewniamy nawigację GPS oraz całodobowe wsparcie dyspozytora. Wymagane aktualne prawo jazdy kat. CE, karta kierowcy i min. 3 lata doświadczenia w transporcie międzynarodowym.",
    },
  },
  {
    partnerSlug: "euro-logistics", category: "drivers", locationCode: "poznan",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "1-3", requiredLanguages: ["pl"],
    salaryFrom: 1400, salaryTo: 1700, currency: "EUR",
    title: { uk: "Водій-експедитор категорії B", en: "Category B delivery driver", pl: "Kierowca-spedytor kat. B" },
    description: {
      uk: "Розвезення товару по місту та області на службовому авто категорії B. Графік 5/2, паливна картка компанії, підтримка логіста при плануванні маршруту. Потрібне посвідчення категорії B від 2 років і базове знання польської для спілкування з клієнтами.",
      en: "City and regional deliveries in a category B company vehicle. 5/2 schedule, company fuel card, route planning support from our logistics team. Requires a category B licence held for 2+ years and basic Polish for talking to clients.",
      pl: "Rozwożenie towaru po mieście i okolicy samochodem służbowym kat. B. Grafik 5/2, karta paliwowa firmy, wsparcie logistyka przy planowaniu trasy. Wymagane prawo jazdy kat. B od 2 lat i podstawowa znajomość polskiego do kontaktu z klientami.",
    },
  },
  {
    partnerSlug: "euro-logistics", category: "logistics", locationCode: "warsaw",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: [],
    salaryFrom: 1300, salaryTo: 1500, currency: "EUR",
    title: { uk: "Комплектувальник складу", en: "Warehouse picker", pl: "Kompletator magazynowy" },
    description: {
      uk: "Прийом, сортування та комплектація замовлень на сучасному автоматизованому складі. Навчання проводимо на місці протягом першого тижня, фізичне навантаження помірне (термінал збору даних, візок). Досвід не обов'язковий — головне уважність і готовність працювати позмінно.",
      en: "Receiving, sorting and picking orders at a modern automated warehouse. On-the-job training during the first week, moderate physical workload (handheld scanner, trolley). No experience required — attentiveness and willingness to work shifts matter most.",
      pl: "Przyjmowanie, sortowanie i kompletacja zamówień w nowoczesnym, zautomatyzowanym magazynie. Szkolenie na miejscu w pierwszym tygodniu, umiarkowany wysiłek fizyczny (skaner, wózek). Doświadczenie niewymagane — liczy się uważność i gotowość do pracy zmianowej.",
    },
  },
  {
    partnerSlug: "euro-logistics", category: "logistics", locationCode: "warsaw",
    employmentType: "full-time", workFormat: "hybrid", experienceLevel: "3-5", requiredLanguages: ["en"],
    salaryFrom: 1600, salaryTo: 2000, currency: "EUR",
    title: { uk: "Диспетчер логістики", en: "Logistics dispatcher", pl: "Dyspozytor logistyki" },
    description: {
      uk: "Координація маршрутів і графіків 15-20 водіїв, оперативне вирішення форс-мажорів у дорозі, ведення звітності в TMS-системі. 2 дні на тиждень можна працювати віддалено. Потрібна впевнена англійська (рівень B1+) для спілкування із закордонними партнерами.",
      en: "Coordinating routes and schedules for 15-20 drivers, resolving on-road issues in real time, keeping records in the TMS system. Two days a week can be worked remotely. Confident English (B1+) is needed for talking to partners abroad.",
      pl: "Koordynacja tras i grafików dla 15-20 kierowców, bieżące rozwiązywanie problemów w trasie, prowadzenie ewidencji w systemie TMS. Dwa dni w tygodniu pracy zdalnej. Wymagany pewny angielski (B1+) do kontaktu z partnerami zagranicznymi.",
    },
  },
  {
    partnerSlug: "euro-logistics", category: "construction", locationCode: "gdansk",
    employmentType: "seasonal", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: [],
    salaryFrom: 1200, salaryTo: 1500, currency: "EUR",
    title: { uk: "Різноробочий на будівництво", en: "General construction laborer", pl: "Pracownik ogólnobudowlany" },
    description: {
      uk: "Загальнобудівельні роботи на об'єктах компанії-партнера: підготовка матеріалів, прибирання майданчика, допомога кваліфікованим робітникам. Сезонний контракт (квітень-жовтень) із реальною можливістю продовження на постійну зайнятість. Спецодяг і інструктаж з техніки безпеки надаються.",
      en: "General construction work on partner sites: preparing materials, keeping the site tidy, assisting skilled workers. Seasonal contract (April-October) with a real chance of moving to permanent employment. Workwear and safety briefing provided.",
      pl: "Prace ogólnobudowlane na obiektach firmy partnerskiej: przygotowanie materiałów, porządkowanie placu budowy, pomoc wykwalifikowanym pracownikom. Kontrakt sezonowy (kwiecień-październik) z realną szansą na stałe zatrudnienie. Odzież robocza i szkolenie BHP zapewnione.",
    },
  },
  {
    partnerSlug: "euro-logistics", category: "manufacturing", locationCode: "krakow",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: [],
    salaryFrom: 1350, salaryTo: 1600, currency: "EUR",
    title: { uk: "Оператор виробничої лінії", en: "Production line operator", pl: "Operator linii produkcyjnej" },
    description: {
      uk: "Обслуговування автоматизованої виробничої лінії: завантаження сировини, контроль якості на виході, усунення дрібних несправностей за інструкцією. Позмінний графік (день/ніч через тиждень), доплата за нічні зміни. Навчання на робочому місці.",
      en: "Operating an automated production line: loading raw materials, checking output quality, clearing minor faults per the instructions. Shift schedule (day/night alternating weekly), night-shift bonus. On-the-job training provided.",
      pl: "Obsługa zautomatyzowanej linii produkcyjnej: załadunek surowca, kontrola jakości na wyjściu, usuwanie drobnych usterek wg instrukcji. Grafik zmianowy (dzień/noc na przemian), dodatek za zmiany nocne. Szkolenie na stanowisku.",
    },
  },
  {
    partnerSlug: "euro-logistics", category: "hospitality", locationCode: "munich",
    employmentType: "part-time", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: ["de"],
    salaryFrom: 1100, salaryTo: 1400, currency: "EUR",
    title: { uk: "Офіціант/-ка в готель", en: "Hotel waiter/waitress", pl: "Kelner/-ka w hotelu" },
    description: {
      uk: "Обслуговування гостей ресторану при готелі: сервірування, прийом замовлень, розрахунок. Гнучкий графік — підходить для суміщення з навчанням. Базова німецька (A2+) потрібна для спілкування з гостями та колегами.",
      en: "Serving guests at the hotel restaurant: table setting, taking orders, billing. Flexible schedule — works well alongside studies. Basic German (A2+) needed to talk with guests and colleagues.",
      pl: "Obsługa gości restauracji hotelowej: nakrywanie do stołu, przyjmowanie zamówień, rozliczenia. Elastyczny grafik — dobrze łączy się z nauką. Wymagany podstawowy niemiecki (A2+) do kontaktu z gośćmi i zespołem.",
    },
  },
  {
    partnerSlug: "euro-logistics", category: "it", locationCode: "berlin",
    employmentType: "full-time", workFormat: "remote", experienceLevel: "0-1", requiredLanguages: ["en"],
    salaryFrom: 2200, salaryTo: 2800, currency: "EUR",
    title: { uk: "Frontend-розробник (Junior)", en: "Frontend Developer (Junior)", pl: "Programista Frontend (Junior)" },
    description: {
      uk: "Розробка й підтримка інтерфейсів на React/TypeScript у складі невеликої продуктової команди. Код-рев'ю, парне програмування з мідлами, поступове занурення в продакшн-код. Повністю віддалена робота, англомовна команда.",
      en: "Building and maintaining interfaces in React/TypeScript within a small product team. Code reviews, pair programming with mid-level engineers, gradual ramp-up into the production codebase. Fully remote, English-speaking team.",
      pl: "Tworzenie i utrzymanie interfejsów w React/TypeScript w małym zespole produktowym. Code review, programowanie w parach z inżynierami mid-level, stopniowe wdrażanie się w kod produkcyjny. Praca w pełni zdalna, zespół anglojęzyczny.",
    },
  },
  {
    partnerSlug: "euro-logistics", category: "other", locationCode: "wroclaw",
    employmentType: "seasonal", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: [],
    salaryFrom: 1100, salaryTo: 1300, currency: "EUR",
    title: { uk: "Різноробочий (склад, логістика)", en: "General worker (warehouse, logistics)", pl: "Pracownik ogólny (magazyn, logistyka)" },
    description: {
      uk: "Допоміжні роботи на складі: розвантаження фур, пакування, маркування товару. Без досвіду, повне навчання на місці, графік погоджується заздалегідь. Гарний варіант для першого досвіду роботи в логістиці.",
      en: "Auxiliary warehouse work: unloading trucks, packing, labelling goods. No experience needed, full on-the-job training, schedule agreed in advance. A good first step into logistics work.",
      pl: "Prace pomocnicze w magazynie: rozładunek ciężarówek, pakowanie, etykietowanie towaru. Bez doświadczenia, pełne szkolenie na miejscu, grafik ustalany z wyprzedzeniem. Dobry start w pracy w logistyce.",
    },
  },
  {
    partnerSlug: "euro-logistics", category: "hospitality", locationCode: "munich",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "1-3", requiredLanguages: ["de"],
    salaryFrom: 1500, salaryTo: 1900, currency: "EUR",
    title: { uk: "Кухар", en: "Cook", pl: "Kucharz/-rka" },
    description: {
      uk: "Приготування страв європейської кухні на кухні мережевого готелю: підготовка інгредієнтів, контроль якості подачі, дотримання санітарних норм HACCP. Потрібен досвід роботи на кухні від 1 року та базова німецька для роботи в команді.",
      en: "Preparing European cuisine dishes in a chain hotel's kitchen: prepping ingredients, checking plating quality, following HACCP hygiene standards. Requires 1+ year of kitchen experience and basic German to work with the team.",
      pl: "Przygotowywanie dań kuchni europejskiej w kuchni hotelu sieciowego: przygotowanie składników, kontrola jakości podania, przestrzeganie norm HACCP. Wymagany min. rok doświadczenia w kuchni i podstawowy niemiecki do pracy w zespole.",
    },
  },
  {
    partnerSlug: "euro-logistics", category: "logistics", locationCode: "poznan",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "1-3", requiredLanguages: ["pl"],
    salaryFrom: 1400, salaryTo: 1650, currency: "EUR",
    title: { uk: "Комірник", en: "Warehouse keeper", pl: "Magazynier-ewidencjoner" },
    description: {
      uk: "Ведення обліку товару на складі, приймання й видача продукції з WMS-системою, інвентаризація раз на місяць. Потрібен досвід роботи комірником від 1 року й впевнене користування комп'ютером.",
      en: "Tracking warehouse stock, receiving and issuing goods through a WMS system, monthly stocktaking. Requires 1+ year of experience as a warehouse keeper and confident computer skills.",
      pl: "Prowadzenie ewidencji towaru w magazynie, przyjmowanie i wydawanie towaru w systemie WMS, inwentaryzacja raz w miesiącu. Wymagany min. rok doświadczenia na stanowisku magazyniera i pewna obsługa komputera.",
    },
  },
  {
    partnerSlug: "euro-logistics", category: "other", locationCode: "warsaw",
    employmentType: "full-time", workFormat: "hybrid", experienceLevel: "1-3", requiredLanguages: ["en", "pl"],
    salaryFrom: 1900, salaryTo: 2400, currency: "EUR",
    title: { uk: "HR-спеціаліст із підбору персоналу", en: "HR Recruiter", pl: "Specjalista ds. rekrutacji" },
    description: {
      uk: "Повний цикл підбору персоналу для клієнтів агентства: складання вакансій, скринінг резюме, співбесіди, супровід кандидата до виходу на роботу. 2-3 дні в офісі, решта — віддалено. Потрібна англійська В1+ і польська для спілкування з роботодавцями.",
      en: "Full-cycle recruitment for agency clients: writing job ads, screening CVs, interviewing, supporting candidates through onboarding. 2-3 office days, the rest remote. Requires English B1+ and Polish to talk with employers.",
      pl: "Pełny cykl rekrutacji dla klientów agencji: tworzenie ogłoszeń, screening CV, rozmowy kwalifikacyjne, wsparcie kandydata do momentu zatrudnienia. 2-3 dni w biurze, reszta zdalnie. Wymagany angielski B1+ i polski do kontaktu z pracodawcami.",
    },
  },
  {
    partnerSlug: "euro-logistics", category: "logistics", locationCode: "wroclaw",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "1-3", requiredLanguages: [],
    salaryFrom: 1450, salaryTo: 1700, currency: "EUR",
    title: { uk: "Водій навантажувача", en: "Forklift driver", pl: "Kierowca wózka widłowego" },
    description: {
      uk: "Робота на електронавантажувачі на складі: переміщення палет, завантаження й розвантаження транспорту. Потрібне чинне посвідчення водія навантажувача й досвід від 1 року.",
      en: "Operating an electric forklift in a warehouse: moving pallets, loading and unloading trucks. Requires a valid forklift licence and 1+ year of experience.",
      pl: "Praca na wózku widłowym elektrycznym w magazynie: przemieszczanie palet, załadunek i rozładunek transportu. Wymagane aktualne uprawnienia na wózki widłowe i min. rok doświadczenia.",
    },
  },
  {
    partnerSlug: "euro-logistics", category: "construction", locationCode: "berlin",
    employmentType: "project", workFormat: "hybrid", experienceLevel: "5+", requiredLanguages: ["en", "de"],
    salaryFrom: 2600, salaryTo: 3200, currency: "EUR",
    title: { uk: "Проєктний менеджер (будівництво, тимчасовий проєкт)", en: "Construction Project Manager (temporary project)", pl: "Kierownik projektu budowlanego (projekt tymczasowy)" },
    description: {
      uk: "Керівництво тимчасовим будівельним проєктом тривалістю 8 місяців: планування етапів, координація підрядників, звітність перед замовником. Контракт на строк проєкту з можливістю продовження на новий об'єкт. Потрібні англійська й німецька на робочому рівні.",
      en: "Leading an 8-month temporary construction project: phase planning, coordinating contractors, reporting to the client. Contract for the project's duration with a chance to move to the next site. Working-level English and German required.",
      pl: "Kierowanie tymczasowym projektem budowlanym trwającym 8 miesięcy: planowanie etapów, koordynacja podwykonawców, raportowanie do klienta. Kontrakt na czas projektu z możliwością przejścia na kolejny obiekt. Wymagany angielski i niemiecki na poziomie roboczym.",
    },
  },
  {
    partnerSlug: "euro-logistics", category: "logistics", locationCode: "warsaw",
    employmentType: "project", workFormat: "remote", experienceLevel: "0-1", requiredLanguages: ["en"],
    salaryFrom: 1300, salaryTo: 1600, currency: "EUR",
    title: { uk: "Аналітик з логістики (проєктна зайнятість)", en: "Logistics Analyst (project-based)", pl: "Analityk logistyki (zatrudnienie projektowe)" },
    description: {
      uk: "Аналіз маршрутів і витрат на перевезення, побудова звітів у Excel/Power BI, пропозиції з оптимізації логістичних витрат. Проєктна зайнятість на 3 місяці, повністю віддалено, гнучкий графік — підходить студентам.",
      en: "Analysing routes and shipping costs, building reports in Excel/Power BI, proposing ways to optimise logistics spend. 3-month project engagement, fully remote, flexible schedule — suitable for students.",
      pl: "Analiza tras i kosztów transportu, tworzenie raportów w Excel/Power BI, propozycje optymalizacji kosztów logistycznych. Zaangażowanie projektowe na 3 miesiące, w pełni zdalnie, elastyczny grafik — odpowiednie dla studentów.",
    },
  },

  // --- BuildPro Europe (9) ---
  {
    partnerSlug: "buildpro-europe", category: "construction", locationCode: "gdansk",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "1-3", requiredLanguages: [],
    salaryFrom: 1600, salaryTo: 2000, currency: "EUR",
    title: { uk: "Муляр", en: "Bricklayer", pl: "Murarz" },
    description: {
      uk: "Мурування стін і перегородок, монолітні роботи на житлових об'єктах. Працюємо за кресленнями, у команді з 4-6 осіб. Потрібен досвід від 1 року та власний ручний інструмент.",
      en: "Bricklaying walls and partitions, cast-in-place concrete work on residential sites. We work from blueprints, in teams of 4-6. Requires 1+ year of experience and your own hand tools.",
      pl: "Murowanie ścian i przegród, prace żelbetowe na obiektach mieszkalnych. Pracujemy według rysunków, w zespołach 4-6 osób. Wymagany min. rok doświadczenia i własne narzędzia ręczne.",
    },
  },
  {
    partnerSlug: "buildpro-europe", category: "construction", locationCode: "warsaw",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "3-5", requiredLanguages: ["pl"],
    salaryFrom: 2000, salaryTo: 2600, currency: "EUR",
    title: { uk: "Бригадир будівельної бригади", en: "Construction crew foreman", pl: "Brygadzista budowlany" },
    description: {
      uk: "Керівництво бригадою 5-8 осіб на об'єкті: розподіл завдань, контроль якості й термінів, взаємодія з прорабом. Потрібен досвід керівництва бригадою від 3 років і польська на розмовному рівні.",
      en: "Leading a crew of 5-8 people on site: assigning tasks, controlling quality and deadlines, liaising with the site manager. Requires 3+ years leading a crew and conversational Polish.",
      pl: "Kierowanie brygadą 5-8 osób na budowie: przydzielanie zadań, kontrola jakości i terminów, kontakt z kierownikiem budowy. Wymagane min. 3 lata doświadczenia w kierowaniu brygadą i komunikatywny polski.",
    },
  },
  {
    partnerSlug: "buildpro-europe", category: "construction", locationCode: "gdansk",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "1-3", requiredLanguages: [],
    salaryFrom: 1700, salaryTo: 2100, currency: "EUR",
    title: { uk: "Електрик на будівництві", en: "Construction electrician", pl: "Elektryk budowlany" },
    description: {
      uk: "Монтаж та підключення електропроводки на об'єктах житлового будівництва, читання електросхем, тестування мереж. Потрібна кваліфікація електрика й досвід від 1 року.",
      en: "Installing and connecting wiring on residential construction sites, reading electrical schematics, testing networks. Requires an electrician qualification and 1+ year of experience.",
      pl: "Montaż i podłączanie instalacji elektrycznej na obiektach mieszkaniowych, czytanie schematów elektrycznych, testowanie sieci. Wymagane uprawnienia elektryka i min. rok doświadczenia.",
    },
  },
  {
    partnerSlug: "buildpro-europe", category: "construction", locationCode: "warsaw",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "1-3", requiredLanguages: [],
    salaryFrom: 1650, salaryTo: 2000, currency: "EUR",
    title: { uk: "Сантехнік", en: "Plumber", pl: "Hydraulik" },
    description: {
      uk: "Монтаж систем опалення, водопостачання й каналізації на нових об'єктах. Робота за проєктною документацією, командою з досвідченим майстром. Досвід від 1 року вітається.",
      en: "Installing heating, water supply and sewage systems on new sites. Work follows project documentation, alongside an experienced foreman. 1+ year of experience is a plus.",
      pl: "Montaż instalacji grzewczych, wodociągowych i kanalizacyjnych na nowych obiektach. Praca według dokumentacji projektowej, w zespole z doświadczonym majstrem. Mile widziany min. rok doświadczenia.",
    },
  },
  {
    partnerSlug: "buildpro-europe", category: "construction", locationCode: "wroclaw",
    employmentType: "project", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: [],
    salaryFrom: 1250, salaryTo: 1500, currency: "EUR",
    title: { uk: "Різноробочий (внутрішні роботи)", en: "General laborer (interior finishing)", pl: "Pracownik ogólny (wykończenia wnętrz)" },
    description: {
      uk: "Допоміжні роботи на етапі внутрішнього оздоблення: підготовка поверхонь, прибирання, підноска матеріалів. Проєктна зайнятість на конкретний об'єкт (~4 місяці), без досвіду.",
      en: "Auxiliary work at the interior-finishing stage: surface prep, cleanup, carrying materials. Project-based work for a specific site (~4 months), no experience required.",
      pl: "Prace pomocnicze na etapie wykończenia wnętrz: przygotowanie powierzchni, sprzątanie, przenoszenie materiałów. Zatrudnienie projektowe na konkretny obiekt (~4 miesiące), bez doświadczenia.",
    },
  },
  {
    partnerSlug: "buildpro-europe", category: "construction", locationCode: "gdansk",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "3-5", requiredLanguages: [],
    salaryFrom: 2100, salaryTo: 2600, currency: "EUR",
    title: { uk: "Кранівник (баштовий кран)", en: "Tower crane operator", pl: "Operator żurawia wieżowego" },
    description: {
      uk: "Робота на баштовому крані на будівельному майданчику: підйом і переміщення вантажів за вказівками стропальника, щоденний огляд механізмів. Потрібне чинне посвідчення кранівника й досвід від 3 років.",
      en: "Operating a tower crane on the construction site: lifting and moving loads per the rigger's signals, daily equipment checks. Requires a valid crane operator licence and 3+ years of experience.",
      pl: "Praca na żurawiu wieżowym na placu budowy: podnoszenie i przenoszenie ładunków wg wskazówek hakowego, codzienny przegląd urządzeń. Wymagane aktualne uprawnienia operatora żurawia i min. 3 lata doświadczenia.",
    },
  },
  {
    partnerSlug: "buildpro-europe", category: "construction", locationCode: "warsaw",
    employmentType: "full-time", workFormat: "hybrid", experienceLevel: "3-5", requiredLanguages: ["pl", "en"],
    salaryFrom: 2300, salaryTo: 2900, currency: "EUR",
    title: { uk: "Кошторисник (будівництво)", en: "Construction cost estimator", pl: "Kosztorysant budowlany" },
    description: {
      uk: "Складання кошторисної документації за проєктами, аналіз тендерної документації, взаємодія з постачальниками матеріалів. 3 дні в офісі, 2 — віддалено. Потрібен досвід кошторисника від 2 років.",
      en: "Preparing cost estimates for projects, analysing tender documentation, liaising with material suppliers. 3 office days, 2 remote. Requires 2+ years as a cost estimator.",
      pl: "Sporządzanie kosztorysów dla projektów, analiza dokumentacji przetargowej, kontakt z dostawcami materiałów. 3 dni w biurze, 2 zdalnie. Wymagane min. 2 lata doświadczenia jako kosztorysant.",
    },
  },
  {
    partnerSlug: "buildpro-europe", category: "construction", locationCode: "wroclaw",
    employmentType: "part-time", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: [],
    salaryFrom: 1150, salaryTo: 1400, currency: "EUR",
    title: { uk: "Опоряджувальник (малярні роботи)", en: "Painter/finisher", pl: "Malarz-wykończeniowiec" },
    description: {
      uk: "Фарбування стін і стель, шпаклювання дрібних дефектів на об'єктах, що здаються в оренду. Гнучкий графік, оплата за виконаний обсяг або погодинно на вибір.",
      en: "Painting walls and ceilings, patching minor defects on properties being prepared for rent. Flexible schedule, paid per completed scope or hourly, your choice.",
      pl: "Malowanie ścian i sufitów, szpachlowanie drobnych ubytków na obiektach przygotowywanych pod wynajem. Elastyczny grafik, płatność za wykonany zakres lub godzinowo do wyboru.",
    },
  },
  {
    partnerSlug: "buildpro-europe", category: "construction", locationCode: "gdansk",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "3-5", requiredLanguages: ["pl"],
    salaryFrom: 2000, salaryTo: 2500, currency: "EUR",
    title: { uk: "Інженер з охорони праці (будівництво)", en: "Construction safety engineer", pl: "Inżynier BHP (budownictwo)" },
    description: {
      uk: "Контроль дотримання норм безпеки на будмайданчику, проведення інструктажів, розслідування інцидентів. Потрібен сертифікат з охорони праці й досвід у будівництві від 2 років.",
      en: "Monitoring safety compliance on the construction site, running briefings, investigating incidents. Requires an occupational safety certificate and 2+ years in construction.",
      pl: "Kontrola przestrzegania zasad BHP na budowie, prowadzenie szkoleń, badanie zdarzeń. Wymagany certyfikat BHP i min. 2 lata doświadczenia w budownictwie.",
    },
  },

  // --- Hotel Alpina Group (9) ---
  {
    partnerSlug: "hotel-alpina", category: "hospitality", locationCode: "munich",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: [],
    salaryFrom: 1300, salaryTo: 1500, currency: "EUR",
    title: { uk: "Покоївка", en: "Housekeeper", pl: "Pokojówka" },
    description: {
      uk: "Прибирання та підготовка номерів до заїзду гостей, заміна білизни, поповнення міні-бару. Графік 5/2, змінний. Проживання надається за потреби, без досвіду.",
      en: "Cleaning and preparing rooms for guest check-in, changing linens, restocking the minibar. 5/2 rotating schedule. Accommodation provided if needed, no experience required.",
      pl: "Sprzątanie i przygotowanie pokoi na przyjazd gości, wymiana pościeli, uzupełnianie minibaru. Grafik 5/2, zmianowy. Zakwaterowanie w razie potrzeby, bez doświadczenia.",
    },
  },
  {
    partnerSlug: "hotel-alpina", category: "hospitality", locationCode: "salzburg",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "1-3", requiredLanguages: ["en", "de"],
    salaryFrom: 1600, salaryTo: 1900, currency: "EUR",
    title: { uk: "Адміністратор готелю", en: "Hotel receptionist", pl: "Recepcjonista/-ka hotelowy/-a" },
    description: {
      uk: "Заселення й виселення гостей, обробка бронювань, вирішення питань під час перебування. Робота позмінно, включно з вихідними. Потрібна англійська й німецька на розмовному рівні.",
      en: "Checking guests in and out, handling bookings, resolving issues during their stay. Shift work, including weekends. Requires conversational English and German.",
      pl: "Zameldowanie i wymeldowanie gości, obsługa rezerwacji, rozwiązywanie spraw w trakcie pobytu. Praca zmianowa, w tym w weekendy. Wymagany komunikatywny angielski i niemiecki.",
    },
  },
  {
    partnerSlug: "hotel-alpina", category: "hospitality", locationCode: "munich",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "1-3", requiredLanguages: ["de"],
    salaryFrom: 1500, salaryTo: 1900, currency: "EUR",
    title: { uk: "Кухар", en: "Cook", pl: "Kucharz/-rka" },
    description: {
      uk: "Приготування страв для ресторану готелю за затвердженим меню, контроль термінів придатності продуктів. Потрібен досвід роботи на кухні від 1 року.",
      en: "Preparing dishes for the hotel restaurant per the approved menu, tracking product shelf life. Requires 1+ year of kitchen experience.",
      pl: "Przygotowywanie dań do restauracji hotelowej według zatwierdzonego menu, kontrola terminów przydatności produktów. Wymagany min. rok doświadczenia w kuchni.",
    },
  },
  {
    partnerSlug: "hotel-alpina", category: "hospitality", locationCode: "munich",
    employmentType: "part-time", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: ["de"],
    salaryFrom: 1100, salaryTo: 1350, currency: "EUR",
    title: { uk: "Офіціант/-ка", en: "Waiter/waitress", pl: "Kelner/-ka" },
    description: {
      uk: "Обслуговування гостей у ресторані готелю під час сніданків і вечері, сервірування столів. Часткова зайнятість, зручно для студентів. Базова німецька потрібна.",
      en: "Serving guests at the hotel restaurant during breakfast and dinner, setting tables. Part-time, convenient for students. Basic German required.",
      pl: "Obsługa gości w restauracji hotelowej podczas śniadań i kolacji, nakrywanie stołów. Praca w niepełnym wymiarze, wygodna dla studentów. Wymagany podstawowy niemiecki.",
    },
  },
  {
    partnerSlug: "hotel-alpina", category: "hospitality", locationCode: "munich",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "1-3", requiredLanguages: ["de"],
    salaryFrom: 1550, salaryTo: 1850, currency: "EUR",
    title: { uk: "Портьє (нічна зміна)", en: "Night porter", pl: "Portier (zmiana nocna)" },
    description: {
      uk: "Прийом гостей у нічну зміну, обробка пізніх заїздів, контроль безпеки будівлі. Доплата за нічні години. Потрібен досвід на рецепції від 1 року.",
      en: "Welcoming guests on the night shift, handling late check-ins, monitoring building security. Night-shift bonus paid. Requires 1+ year of front-desk experience.",
      pl: "Przyjmowanie gości na nocnej zmianie, obsługa późnych zameldowań, dbanie o bezpieczeństwo budynku. Dodatek za godziny nocne. Wymagany min. rok doświadczenia na recepcji.",
    },
  },
  {
    partnerSlug: "hotel-alpina", category: "hospitality", locationCode: "salzburg",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "3-5", requiredLanguages: ["de"],
    salaryFrom: 2000, salaryTo: 2400, currency: "EUR",
    title: { uk: "Керівник служби покоївок", en: "Head housekeeper", pl: "Kierownik służby pięter" },
    description: {
      uk: "Організація роботи команди покоївок (8-10 осіб), контроль якості прибирання, розподіл змін. Потрібен досвід керівництва командою від 2 років і німецька на робочому рівні.",
      en: "Organising the housekeeping team's work (8-10 people), quality control of cleaning, shift scheduling. Requires 2+ years of team leadership and working-level German.",
      pl: "Organizacja pracy zespołu pokojówek (8-10 osób), kontrola jakości sprzątania, układanie grafiku zmian. Wymagane min. 2 lata doświadczenia w kierowaniu zespołem i niemiecki na poziomie roboczym.",
    },
  },
  {
    partnerSlug: "hotel-alpina", category: "hospitality", locationCode: "munich",
    employmentType: "part-time", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: ["de"],
    salaryFrom: 1150, salaryTo: 1400, currency: "EUR",
    title: { uk: "Бармен/-ка", en: "Bartender", pl: "Barman/-ka" },
    description: {
      uk: "Приготування напоїв у готельному барі, обслуговування гостей увечері та на заходах. Гнучкий графік, навчання рецептурі на місці.",
      en: "Preparing drinks at the hotel bar, serving guests in the evenings and at events. Flexible schedule, recipe training provided on the job.",
      pl: "Przygotowywanie napojów w barze hotelowym, obsługa gości wieczorami i na wydarzeniach. Elastyczny grafik, szkolenie z receptur na miejscu.",
    },
  },
  {
    partnerSlug: "hotel-alpina", category: "hospitality", locationCode: "munich",
    employmentType: "full-time", workFormat: "remote", experienceLevel: "1-3", requiredLanguages: ["de", "en"],
    salaryFrom: 1500, salaryTo: 1800, currency: "EUR",
    title: { uk: "Спеціаліст з бронювання (кол-центр)", en: "Reservations specialist (call centre)", pl: "Specjalista ds. rezerwacji (call center)" },
    description: {
      uk: "Обробка запитів на бронювання номерів телефоном і поштою, консультування щодо тарифів і послуг. Повністю віддалена робота. Потрібні німецька й англійська на розмовному рівні.",
      en: "Handling room-booking enquiries by phone and email, advising on rates and services. Fully remote. Requires conversational German and English.",
      pl: "Obsługa zapytań o rezerwacje pokoi telefonicznie i mailowo, doradztwo w zakresie cen i usług. Praca w pełni zdalna. Wymagany komunikatywny niemiecki i angielski.",
    },
  },
  {
    partnerSlug: "hotel-alpina", category: "hospitality", locationCode: "salzburg",
    employmentType: "seasonal", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: [],
    salaryFrom: 1200, salaryTo: 1450, currency: "EUR",
    title: { uk: "Садівник/доглядач території", en: "Groundskeeper", pl: "Ogrodnik terenów zielonych" },
    description: {
      uk: "Догляд за прилеглою територією готелю: газони, клумби, доріжки. Сезонна робота (березень-жовтень), інструмент надається.",
      en: "Maintaining the hotel grounds: lawns, flower beds, footpaths. Seasonal work (March-October), tools provided.",
      pl: "Dbanie o teren wokół hotelu: trawniki, klomby, alejki. Praca sezonowa (marzec-październik), narzędzia zapewnione.",
    },
  },

  // --- TechNova Solutions (9) ---
  {
    partnerSlug: "technova-solutions", category: "it", locationCode: "berlin",
    employmentType: "full-time", workFormat: "remote", experienceLevel: "1-3", requiredLanguages: ["en"],
    salaryFrom: 2400, salaryTo: 3000, currency: "EUR",
    title: { uk: "QA-інженер", en: "QA Engineer", pl: "Inżynier QA" },
    description: {
      uk: "Мануальне й автоматизоване тестування вебзастосунків, написання тест-кейсів, взаємодія з розробниками при виправленні багів. Повністю віддалено. Потрібен досвід у QA від 1 року й англійська B1+.",
      en: "Manual and automated testing of web applications, writing test cases, working with developers on bug fixes. Fully remote. Requires 1+ year in QA and English B1+.",
      pl: "Testowanie manualne i automatyczne aplikacji webowych, pisanie przypadków testowych, współpraca z programistami przy naprawie błędów. Praca w pełni zdalna. Wymagany min. rok doświadczenia w QA i angielski B1+.",
    },
  },
  {
    partnerSlug: "technova-solutions", category: "it", locationCode: "berlin",
    employmentType: "full-time", workFormat: "remote", experienceLevel: "3-5", requiredLanguages: ["en"],
    salaryFrom: 3000, salaryTo: 3800, currency: "EUR",
    title: { uk: "DevOps-інженер", en: "DevOps Engineer", pl: "Inżynier DevOps" },
    description: {
      uk: "Підтримка CI/CD-пайплайнів, адміністрування Docker/Kubernetes-кластерів, моніторинг продакшн-середовища. Досвід від 3 років, впевнена англійська для роботи в розподіленій команді.",
      en: "Maintaining CI/CD pipelines, administering Docker/Kubernetes clusters, monitoring production. 3+ years of experience, confident English for a distributed team.",
      pl: "Utrzymanie pipeline'ów CI/CD, administrowanie klastrami Docker/Kubernetes, monitorowanie środowiska produkcyjnego. Min. 3 lata doświadczenia, pewny angielski do pracy w zespole rozproszonym.",
    },
  },
  {
    partnerSlug: "technova-solutions", category: "it", locationCode: "berlin",
    employmentType: "full-time", workFormat: "remote", experienceLevel: "1-3", requiredLanguages: ["en"],
    salaryFrom: 2600, salaryTo: 3200, currency: "EUR",
    title: { uk: "Backend-розробник (Node.js)", en: "Backend Developer (Node.js)", pl: "Programista Backend (Node.js)" },
    description: {
      uk: "Розробка REST/GraphQL API на Node.js/TypeScript, проєктування схем бази даних, код-рев'ю. Продуктова команда з 6 розробників, повністю віддалено.",
      en: "Building REST/GraphQL APIs in Node.js/TypeScript, designing database schemas, code reviews. Product team of 6 engineers, fully remote.",
      pl: "Tworzenie API REST/GraphQL w Node.js/TypeScript, projektowanie schematów bazy danych, code review. Zespół produktowy liczący 6 inżynierów, w pełni zdalnie.",
    },
  },
  {
    partnerSlug: "technova-solutions", category: "it", locationCode: "berlin",
    employmentType: "full-time", workFormat: "hybrid", experienceLevel: "3-5", requiredLanguages: ["en", "de"],
    salaryFrom: 3200, salaryTo: 4000, currency: "EUR",
    title: { uk: "Product Manager (SaaS-продукт)", en: "Product Manager (SaaS product)", pl: "Product Manager (produkt SaaS)" },
    description: {
      uk: "Формування бекложу продукту, пріоритизація фіч на основі метрик і фідбеку клієнтів, взаємодія з дизайном і розробкою. 2 дні в офісі в Берліні. Потрібен досвід продакт-менеджменту від 3 років.",
      en: "Shaping the product backlog, prioritising features based on metrics and customer feedback, working with design and engineering. 2 office days in Berlin. Requires 3+ years of product management experience.",
      pl: "Kształtowanie backlogu produktu, priorytetyzacja funkcji na podstawie metryk i opinii klientów, współpraca z designem i inżynierią. 2 dni w biurze w Berlinie. Wymagane min. 3 lata doświadczenia w product management.",
    },
  },
  {
    partnerSlug: "technova-solutions", category: "it", locationCode: "berlin",
    employmentType: "full-time", workFormat: "remote", experienceLevel: "1-3", requiredLanguages: ["en"],
    salaryFrom: 2200, salaryTo: 2700, currency: "EUR",
    title: { uk: "UI/UX-дизайнер", en: "UI/UX Designer", pl: "Projektant UI/UX" },
    description: {
      uk: "Проєктування інтерфейсів SaaS-продукту у Figma, проведення юзабіліті-тестів, підтримка дизайн-системи. Портфоліо обов'язкове. Повністю віддалено.",
      en: "Designing SaaS product interfaces in Figma, running usability tests, maintaining the design system. Portfolio required. Fully remote.",
      pl: "Projektowanie interfejsów produktu SaaS w Figmie, przeprowadzanie testów użyteczności, utrzymanie systemu projektowego. Wymagane portfolio. Praca w pełni zdalna.",
    },
  },
  {
    partnerSlug: "technova-solutions", category: "it", locationCode: "berlin",
    employmentType: "full-time", workFormat: "hybrid", experienceLevel: "0-1", requiredLanguages: ["en"],
    salaryFrom: 1900, salaryTo: 2300, currency: "EUR",
    title: { uk: "Junior Data Analyst", en: "Junior Data Analyst", pl: "Junior Data Analyst" },
    description: {
      uk: "Аналіз продуктових метрик у SQL/Python, побудова дашбордів, підготовка щотижневих звітів для команди. Наставник на перші 3 місяці. 1 день в офісі.",
      en: "Analysing product metrics in SQL/Python, building dashboards, preparing weekly reports for the team. Mentor assigned for the first 3 months. 1 office day.",
      pl: "Analiza metryk produktowych w SQL/Python, tworzenie dashboardów, przygotowywanie cotygodniowych raportów dla zespołu. Mentor przez pierwsze 3 miesiące. 1 dzień w biurze.",
    },
  },
  {
    partnerSlug: "technova-solutions", category: "it", locationCode: "berlin",
    employmentType: "part-time", workFormat: "remote", experienceLevel: "1-3", requiredLanguages: ["en"],
    salaryFrom: 1800, salaryTo: 2200, currency: "EUR",
    title: { uk: "Технічний письменник", en: "Technical Writer", pl: "Technical Writer" },
    description: {
      uk: "Написання й підтримка технічної документації для API та SDK, співпраця з розробниками для перевірки точності. Часткова зайнятість, повністю віддалено.",
      en: "Writing and maintaining technical documentation for APIs and SDKs, working with engineers to verify accuracy. Part-time, fully remote.",
      pl: "Pisanie i utrzymanie dokumentacji technicznej dla API i SDK, współpraca z inżynierami w celu weryfikacji poprawności. Praca w niepełnym wymiarze, w pełni zdalna.",
    },
  },
  {
    partnerSlug: "technova-solutions", category: "it", locationCode: "berlin",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: ["en", "de"],
    salaryFrom: 1900, salaryTo: 2200, currency: "EUR",
    title: { uk: "IT Support Engineer (Level 1)", en: "IT Support Engineer (Level 1)", pl: "IT Support Engineer (Level 1)" },
    description: {
      uk: "Технічна підтримка співробітників офісу: налаштування робочих станцій, вирішення заявок у service desk, базове адміністрування Windows/macOS. Потрібна англійська й німецька на базовому рівні.",
      en: "Technical support for office staff: setting up workstations, resolving service desk tickets, basic Windows/macOS administration. Requires basic English and German.",
      pl: "Wsparcie techniczne pracowników biura: konfiguracja stacji roboczych, obsługa zgłoszeń w service desk, podstawowa administracja Windows/macOS. Wymagany podstawowy angielski i niemiecki.",
    },
  },
  {
    partnerSlug: "technova-solutions", category: "it", locationCode: "berlin",
    employmentType: "project", workFormat: "remote", experienceLevel: "0-1", requiredLanguages: ["en"],
    salaryFrom: 1200, salaryTo: 1500, currency: "EUR",
    title: { uk: "Software Engineering Intern (стажування)", en: "Software Engineering Intern", pl: "Stażysta Software Engineering" },
    description: {
      uk: "3-місячне оплачуване стажування в команді розробки: робота над реальними задачами під керівництвом ментора, щотижневий фідбек. Підходить студентам технічних спеціальностей.",
      en: "A 3-month paid internship on the engineering team: working on real tasks under a mentor's guidance, weekly feedback. Suitable for students in technical fields.",
      pl: "3-miesięczny płatny staż w zespole inżynierskim: praca nad realnymi zadaniami pod okiem mentora, cotygodniowy feedback. Odpowiedni dla studentów kierunków technicznych.",
    },
  },

  // --- PrimeFoods Manufacturing (9) ---
  {
    partnerSlug: "primefoods-manufacturing", category: "manufacturing", locationCode: "krakow",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: [],
    salaryFrom: 1250, salaryTo: 1450, currency: "EUR",
    title: { uk: "Пакувальник на виробництві", en: "Production packer", pl: "Pakowacz na produkcji" },
    description: {
      uk: "Пакування готової продукції на автоматизованій лінії, контроль ваги й маркування упаковки. Позмінний графік, без досвіду, навчання на місці.",
      en: "Packing finished products on an automated line, checking pack weight and labelling. Shift schedule, no experience needed, on-the-job training.",
      pl: "Pakowanie gotowych produktów na zautomatyzowanej linii, kontrola wagi i etykietowanie opakowań. Grafik zmianowy, bez doświadczenia, szkolenie na miejscu.",
    },
  },
  {
    partnerSlug: "primefoods-manufacturing", category: "manufacturing", locationCode: "krakow",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "3-5", requiredLanguages: ["pl"],
    salaryFrom: 1800, salaryTo: 2200, currency: "EUR",
    title: { uk: "Технолог харчового виробництва", en: "Food production technologist", pl: "Technolog produkcji spożywczej" },
    description: {
      uk: "Контроль дотримання технологічного процесу і якості на всіх етапах виробництва, розробка й коригування рецептур. Профільна освіта обов'язкова, досвід від 2 років.",
      en: "Ensuring the process and quality standards are followed at every production stage, developing and adjusting recipes. Relevant education required, 2+ years of experience.",
      pl: "Kontrola przestrzegania procesu technologicznego i jakości na każdym etapie produkcji, opracowywanie i korygowanie receptur. Wymagane wykształcenie kierunkowe, min. 2 lata doświadczenia.",
    },
  },
  {
    partnerSlug: "primefoods-manufacturing", category: "manufacturing", locationCode: "krakow",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: [],
    salaryFrom: 1300, salaryTo: 1550, currency: "EUR",
    title: { uk: "Оператор лінії розливу", en: "Bottling line operator", pl: "Operator linii rozlewniczej" },
    description: {
      uk: "Обслуговування лінії розливу напоїв: налаштування обладнання, контроль якості тари, усунення дрібних несправностей. Навчання на робочому місці.",
      en: "Operating a beverage bottling line: setting up equipment, checking container quality, clearing minor faults. On-the-job training.",
      pl: "Obsługa linii rozlewniczej napojów: ustawianie sprzętu, kontrola jakości opakowań, usuwanie drobnych usterek. Szkolenie na stanowisku pracy.",
    },
  },
  {
    partnerSlug: "primefoods-manufacturing", category: "manufacturing", locationCode: "krakow",
    employmentType: "part-time", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: [],
    salaryFrom: 1050, salaryTo: 1250, currency: "EUR",
    title: { uk: "Санітар виробничих приміщень", en: "Production facility cleaner", pl: "Pracownik sanitarny hali produkcyjnej" },
    description: {
      uk: "Прибирання й дезінфекція виробничих і складських приміщень відповідно до стандартів харчової безпеки. Часткова зайнятість, гнучкий графік.",
      en: "Cleaning and disinfecting production and storage areas per food-safety standards. Part-time, flexible schedule.",
      pl: "Sprzątanie i dezynfekcja pomieszczeń produkcyjnych i magazynowych zgodnie ze standardami bezpieczeństwa żywności. Praca w niepełnym wymiarze, elastyczny grafik.",
    },
  },
  {
    partnerSlug: "primefoods-manufacturing", category: "manufacturing", locationCode: "krakow",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "1-3", requiredLanguages: [],
    salaryFrom: 1700, salaryTo: 2100, currency: "EUR",
    title: { uk: "Механік з обслуговування обладнання", en: "Equipment maintenance mechanic", pl: "Mechanik utrzymania ruchu" },
    description: {
      uk: "Плановий і аварійний ремонт виробничого обладнання, ведення журналу обслуговування. Потрібна технічна освіта й досвід від 1 року.",
      en: "Scheduled and emergency repair of production equipment, keeping a maintenance log. Requires technical education and 1+ year of experience.",
      pl: "Planowe i awaryjne naprawy sprzętu produkcyjnego, prowadzenie dziennika serwisowego. Wymagane wykształcenie techniczne i min. rok doświadczenia.",
    },
  },
  {
    partnerSlug: "primefoods-manufacturing", category: "manufacturing", locationCode: "krakow",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "1-3", requiredLanguages: ["pl"],
    salaryFrom: 1600, salaryTo: 1950, currency: "EUR",
    title: { uk: "Контролер якості (ВТК)", en: "Quality control inspector", pl: "Kontroler jakości" },
    description: {
      uk: "Перевірка сировини та готової продукції на відповідність стандартам якості, оформлення протоколів невідповідностей. Потрібна увага до деталей і базова польська.",
      en: "Checking raw materials and finished products against quality standards, documenting non-conformance reports. Requires attention to detail and basic Polish.",
      pl: "Kontrola surowców i gotowych produktów pod kątem zgodności ze standardami jakości, dokumentowanie niezgodności. Wymagana skrupulatność i podstawowy polski.",
    },
  },
  {
    partnerSlug: "primefoods-manufacturing", category: "manufacturing", locationCode: "krakow",
    employmentType: "full-time", workFormat: "hybrid", experienceLevel: "1-3", requiredLanguages: ["pl"],
    salaryFrom: 1750, salaryTo: 2100, currency: "EUR",
    title: { uk: "Логіст складу готової продукції", en: "Finished-goods warehouse logistician", pl: "Logistyk magazynu wyrobów gotowych" },
    description: {
      uk: "Планування відвантажень готової продукції, взаємодія з перевізниками, ведення складського обліку. 1 день на тиждень можна працювати з дому.",
      en: "Planning finished-goods shipments, liaising with carriers, keeping warehouse records. One day a week can be worked from home.",
      pl: "Planowanie wysyłek gotowych produktów, kontakt z przewoźnikami, prowadzenie ewidencji magazynowej. Jeden dzień w tygodniu pracy z domu.",
    },
  },
  {
    partnerSlug: "primefoods-manufacturing", category: "manufacturing", locationCode: "krakow",
    employmentType: "project", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: [],
    salaryFrom: 1100, salaryTo: 1350, currency: "EUR",
    title: { uk: "Стажист-технолог (виробнича практика)", en: "Technologist intern (production placement)", pl: "Stażysta-technolog (praktyka produkcyjna)" },
    description: {
      uk: "3-місячна практика у виробничому відділі: участь у контролі якості, документування процесів під керівництвом технолога. Підходить студентам харчових спеціальностей.",
      en: "A 3-month placement in the production department: assisting with quality control, documenting processes under a technologist's guidance. Suitable for food-science students.",
      pl: "3-miesięczna praktyka w dziale produkcji: udział w kontroli jakości, dokumentowanie procesów pod okiem technologa. Odpowiednia dla studentów kierunków spożywczych.",
    },
  },
  {
    partnerSlug: "primefoods-manufacturing", category: "manufacturing", locationCode: "krakow",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "1-3", requiredLanguages: [],
    salaryFrom: 1450, salaryTo: 1700, currency: "EUR",
    title: { uk: "Оператор автонавантажувача (виробництво)", en: "Forklift operator (production)", pl: "Operator wózka widłowego (produkcja)" },
    description: {
      uk: "Переміщення сировини й готової продукції складом на електронавантажувачі. Потрібне чинне посвідчення й досвід від 1 року.",
      en: "Moving raw materials and finished goods around the warehouse on an electric forklift. Requires a valid licence and 1+ year of experience.",
      pl: "Przemieszczanie surowców i gotowych produktów po magazynie wózkiem widłowym elektrycznym. Wymagane aktualne uprawnienia i min. rok doświadczenia.",
    },
  },

  // --- AllRoles Staffing (9) ---
  {
    partnerSlug: "allroles-staffing", category: "other", locationCode: "prague",
    employmentType: "part-time", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: [],
    salaryFrom: 1000, salaryTo: 1300, currency: "EUR",
    title: { uk: "Кур'єр", en: "Courier", pl: "Kurier" },
    description: {
      uk: "Доставка замовлень по місту на власному або наданому транспорті, підтвердження отримання через застосунок. Гнучкий графік, оплата за доставку плюс бонуси.",
      en: "Delivering orders around the city on your own or provided transport, confirming delivery via the app. Flexible schedule, paid per delivery plus bonuses.",
      pl: "Dostawa zamówień po mieście własnym lub udostępnionym transportem, potwierdzanie dostawy w aplikacji. Elastyczny grafik, płatność za dostawę plus premie.",
    },
  },
  {
    partnerSlug: "allroles-staffing", category: "logistics", locationCode: "prague",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: [],
    salaryFrom: 1200, salaryTo: 1400, currency: "EUR",
    title: { uk: "Вантажник", en: "Warehouse loader", pl: "Magazynier" },
    description: {
      uk: "Навантаження й розвантаження товару на складі та в торгових точках, переміщення важких предметів (до 25 кг). Змінний графік.",
      en: "Loading and unloading goods at the warehouse and retail locations, moving heavy items (up to 25 kg). Shift schedule.",
      pl: "Załadunek i rozładunek towaru w magazynie i punktach sprzedaży, przenoszenie ciężkich przedmiotów (do 25 kg). Grafik zmianowy.",
    },
  },
  {
    partnerSlug: "allroles-staffing", category: "other", locationCode: "prague",
    employmentType: "part-time", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: [],
    salaryFrom: 900, salaryTo: 1150, currency: "EUR",
    title: { uk: "Прибиральник/-ця офісних приміщень", en: "Office cleaner", pl: "Sprzątacz/-ka biur" },
    description: {
      uk: "Прибирання офісних приміщень у вечірні години після закінчення робочого дня орендарів. Гнучкий графік, підходить для суміщення.",
      en: "Cleaning office premises in the evening after tenants finish their working day. Flexible schedule, suits a side job.",
      pl: "Sprzątanie pomieszczeń biurowych wieczorem po zakończeniu dnia pracy najemców. Elastyczny grafik, odpowiedni jako praca dodatkowa.",
    },
  },
  {
    partnerSlug: "allroles-staffing", category: "other", locationCode: "prague",
    employmentType: "part-time", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: [],
    salaryFrom: 950, salaryTo: 1200, currency: "EUR",
    title: { uk: "Промоутер (розповсюдження рекламних матеріалів)", en: "Promoter (flyer distribution)", pl: "Promotor (dystrybucja materiałów reklamowych)" },
    description: {
      uk: "Розповсюдження рекламних матеріалів у людних місцях міста, консультування перехожих про акції клієнта. Погодинна оплата, гнучкий графік.",
      en: "Distributing promotional materials in busy city spots, telling passers-by about the client's offers. Hourly pay, flexible schedule.",
      pl: "Rozdawanie materiałów promocyjnych w ruchliwych miejscach miasta, informowanie przechodniów o ofertach klienta. Wynagrodzenie godzinowe, elastyczny grafik.",
    },
  },
  {
    partnerSlug: "allroles-staffing", category: "logistics", locationCode: "prague",
    employmentType: "full-time", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: [],
    salaryFrom: 1150, salaryTo: 1350, currency: "EUR",
    title: { uk: "Комплектувальник замовлень (dark store)", en: "Order picker (dark store)", pl: "Kompletator zamówień (dark store)" },
    description: {
      uk: "Комплектація онлайн-замовлень у міні-складі (dark store) для швидкої доставки, робота з термінала збору даних. Позмінний графік.",
      en: "Picking online orders at a dark store for fast delivery, working with a handheld scanner. Shift schedule.",
      pl: "Kompletacja zamówień online w mini-magazynie (dark store) do szybkiej dostawy, praca ze skanerem. Grafik zmianowy.",
    },
  },
  {
    partnerSlug: "allroles-staffing", category: "other", locationCode: "prague",
    employmentType: "project", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: [],
    salaryFrom: 1000, salaryTo: 1300, currency: "EUR",
    title: { uk: "Різноробочий на подієві заходи", en: "Event support worker", pl: "Pracownik obsługi wydarzeń" },
    description: {
      uk: "Допомога в організації подій: монтаж і демонтаж обладнання, розстановка меблів, підтримка гостей. Проєктна зайнятість під конкретні заходи, оплата за захід.",
      en: "Helping organise events: setting up and dismantling equipment, arranging furniture, assisting guests. Project-based per event, paid per event.",
      pl: "Pomoc w organizacji wydarzeń: montaż i demontaż sprzętu, ustawianie mebli, wsparcie gości. Zatrudnienie projektowe pod konkretne wydarzenia, płatność za wydarzenie.",
    },
  },
  {
    partnerSlug: "allroles-staffing", category: "other", locationCode: "prague",
    employmentType: "full-time", workFormat: "remote", experienceLevel: "0-1", requiredLanguages: ["en"],
    salaryFrom: 1150, salaryTo: 1400, currency: "EUR",
    title: { uk: "Оператор кол-центру (підтримка клієнтів)", en: "Call centre operator (customer support)", pl: "Operator call center (obsługa klienta)" },
    description: {
      uk: "Обробка вхідних звернень клієнтів телефоном і чатом, фіксація заявок у CRM. Повністю віддалено, потрібна базова англійська.",
      en: "Handling inbound customer enquiries by phone and chat, logging tickets in the CRM. Fully remote, basic English required.",
      pl: "Obsługa przychodzących zapytań klientów telefonicznie i na czacie, rejestrowanie zgłoszeń w CRM. Praca w pełni zdalna, wymagany podstawowy angielski.",
    },
  },
  {
    partnerSlug: "allroles-staffing", category: "logistics", locationCode: "prague",
    employmentType: "seasonal", workFormat: "onsite", experienceLevel: "0-1", requiredLanguages: [],
    salaryFrom: 1100, salaryTo: 1300, currency: "EUR",
    title: { uk: "Різноробочий на склад (сезонний пік)", en: "Seasonal warehouse worker (peak season)", pl: "Pracownik magazynu (szczyt sezonowy)" },
    description: {
      uk: "Додаткові руки на складі під час сезонного піку замовлень (листопад-грудень): пакування, сортування, комплектація. Короткостроковий контракт.",
      en: "Extra hands at the warehouse during the seasonal order peak (November-December): packing, sorting, picking. Short-term contract.",
      pl: "Dodatkowe wsparcie w magazynie podczas sezonowego szczytu zamówień (listopad-grudzień): pakowanie, sortowanie, kompletacja. Krótkoterminowy kontrakt.",
    },
  },
  {
    partnerSlug: "allroles-staffing", category: "logistics", locationCode: "prague",
    employmentType: "part-time", workFormat: "onsite", experienceLevel: "1-3", requiredLanguages: [],
    salaryFrom: 1200, salaryTo: 1500, currency: "EUR",
    title: { uk: "Водій-кур'єр на власному авто", en: "Courier driver (own car)", pl: "Kierowca-kurier (własny samochód)" },
    description: {
      uk: "Доставка замовлень власним автомобілем у межах міста, компенсація пального за пройдені кілометри. Потрібне посвідчення категорії B від 1 року.",
      en: "Delivering orders in your own car within the city, fuel compensated per kilometre driven. Requires a category B licence held for 1+ year.",
      pl: "Dostawa zamówień własnym samochodem na terenie miasta, zwrot kosztów paliwa za przejechane kilometry. Wymagane prawo jazdy kat. B od roku.",
    },
  },
];

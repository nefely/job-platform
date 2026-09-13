# VV Work

Тестове завдання — Frontend Developer. Платформа для пошуку роботи та
працівників у Європі: Головна, агрегований пошук вакансій, індекс
партнерів → сторінка окремого партнера з вакансіями (пошук + фільтр за
категорією), сторінка контактів із формою заявки.

## Стек

- **Next.js 16 (App Router)** + React 19 + TypeScript (strict, без `any`)
- **Tailwind CSS v4**
- **Supabase** (Postgres + PostgREST) як бекенд даних
- **next-intl** — локалізація (uk / en / pl)
- **framer-motion** — виключно анімації (fade/stagger при появі, плавне
  відкриття/закриття панелей); це не UI-кіт — жодного готового компонента
  (інпута, селекта, чіпа, картки) звідти не використано, усі вони
  hand-rolled
- **Vitest + React Testing Library** — unit-тести
- Без Redux/Zustand, без UI-кітів, без React Query/SWR — увесь стан,
  асинхронність і UI-примітиви (селект, чіпи, фільтри) написані вручну

> ⚠️ Це свідоме відхилення від брифу — детально пояснено в розділі
> [«Відхилення від брифу»](#відхилення-від-брифу).

## Запуск проєкту

### 1. Залежності

```bash
npm install
```

### 2. Supabase

Дані вакансій і партнерів живуть у Supabase (спільний проєкт з іншим
застосунком команди — таблиці цього проєкту мають префікс `job_platform_`,
щоб не конфліктувати з таблицями сусіднього застосунку в тій самій БД).

1. Скопіюйте `.env.example` → `.env.local` і заповніть:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
   (Project Settings → API у Supabase Dashboard.)
2. У Supabase SQL Editor цього проєкту виконайте **по черзі**:
   - [`supabase/schema.sql`](supabase/schema.sql) — таблиці `job_platform_partners`,
     `job_platform_jobs`, `job_platform_contact_submissions` + RLS-політики
     (публічний `select` на partners/jobs, публічний `insert`-без-`select`
     на заявки). Ідемпотентний, можна перезапускати (безпечно і для вже
     заповненої бази — нові колонки/constraint'и додаються через `alter
     table ... add column if not exists` / `drop constraint if exists`).
   - Якщо база вже має старіший набір вакансій (без `work_format`/
     `experience_level`/`required_languages`): `delete from
     public.job_platform_jobs;` — партнерів це не чіпає.
   - [`supabase/seed.sql`](supabase/seed.sql) — 6 демо-партнерів, **60
     вакансій**, кожен текстовий запис — jsonb `{ uk, en, pl }`. Ідемпотентний
     (`on conflict do nothing` / `where not exists`). Це **згенерований**
     файл — джерело правди [`supabase/seed-data.mjs`](supabase/seed-data.mjs)
     (структуровані дані), перегенерувати: `npm run seed:generate`.

Без цього кроку `/jobs`, `/partners`, сторінка партнера й блок партнерів
на Головній коректно покажуть **retry-блок** ("не вдалося завантажити") —
це очікувана поведінка асинхронного шару, а не помилка коду.

### 3. Розробка

```bash
npm run dev          # http://localhost:3000
npm run test          # vitest run
npm run test:coverage  # vitest run --coverage
npm run lint
npm run build && npm run start   # прод-білд
```

## Архітектура

```
app/[locale]/                 # усі сторінки під локаллю (uk за замовч., en, pl)
  layout.tsx                   # <html lang>, NextIntlClientProvider, Header/Footer
  error.tsx                    # error boundary для всього дерева [locale] (RetryBlock + "На головну")
  not-found.tsx                # generic 404
  page.tsx                     # Home
  jobs/page.tsx                 # /jobs — усі вакансії всіх партнерів (той самий шлях у всіх локалях)
  jobs/[id]/page.tsx             # сторінка однієї вакансії (деталі + форма заявки)
  partners/page.tsx             # /partners — індекс партнерів (+ фільтр за категорією)
  partners/[slug]/page.tsx     # сторінка одного партнера (динамічна)
  contact/page.tsx             # /contact (той самий шлях у всіх локалях)
app/global-error.tsx          # крайній фолбек (падіння самого layout.tsx) — без next-intl/Tailwind

components/
  layout/     Header, Footer, LocaleSwitcher, MobileNav
  theme/      ThemeProvider, ThemeToggle
  home/       Hero, DotBackground, GlowDots, CategoryGrid, FeaturedPartnersSection(+Skeleton),
              EmployerCtaSection
  motion/     FadeIn, Stagger (StaggerContainer/StaggerItem) — hand-rolled framer-motion обгортки
  partners/   PartnerCard, PartnerHeader, PartnersIndexBoard, AllJobsBoard,
              PartnerJobsBoard, JobSearchInput, JobFiltersPanel, FilterChipGroup,
              CategoryFilter, JobList, JobCard, JobListSkeleton, JobDetailView
  contact/    ContactForm
  shared/     Skeleton, RetryBlock, Select (generic стилізований <select>)

lib/
  supabase/       client.ts (браузер) / server.ts (Server Components)
  mockApi/        simulateRequest.ts + partners.ts / jobs.ts / contact.ts
  resolveErrorMessage.ts — мапить стабільні (не локалізовані) маркери
                   помилок simulateRequest/useAsync у переклад під поточну локаль
  filterJobs.ts    чиста функція пошук+категорія+додаткові фільтри (для вакансій)
  filterPartners.ts чиста функція фільтр партнерів за категорією
  validation/      contactForm.ts — чисті валідатори
  i18n/            pickLocalized.ts
  partners/        resolvePartnerBySlug.ts (server-side lookup для notFound())
  jobs/            resolveJobById.ts (server-side lookup для notFound())

hooks/       useDebouncedValue.ts, useAsync.ts, useMounted.ts
data/        categories.ts, locations.ts, employmentTypes.ts, workFormats.ts,
             experienceLevels.ts, languages.ts (фіксовані таксономії),
             categoryColors.ts (кольори категорій, спільні для бейджів і чіпів),
             categoryIcons.tsx (inline SVG-іконки категорій, без бібліотеки іконок)
types/       category, location, job, partner, contact, i18n, language
i18n/        routing.ts, navigation.ts, request.ts (next-intl)
messages/    uk.json, en.json, pl.json
supabase/    schema.sql, seed-data.mjs (джерело), generate-seed.mjs → seed.sql (згенеровано)
proxy.ts     next-intl middleware (Next.js 16 перейменував middleware → proxy)
```

**Server/Client межа:** усе, що не тримає стан (Header, Footer, Hero,
CategoryGrid, PartnerHeader, сторінки) — Server Component. Інтерактивне
(пошук, фільтр, форма, перемикач мови/теми) — `'use client'`. Це мінімізує
клієнтський JS-бандл.

**Світла/темна тема** (`components/theme/ThemeProvider.tsx` + `ThemeToggle.tsx`)
— ручна реалізація без бібліотек (за тим самим патерном, що вже
використовується в іншому проєкті команди): light/dark/system,
`localStorage`, `@custom-variant dark (&:where(.dark, .dark *))` у
`globals.css` (щоб наявні `dark:`-класи реагували на клас `.dark`, не лише
на системну тему), блокуючий inline-скрипт через `useServerInsertedHTML`
проти флешу неправильної теми при завантаженні.

**Дані:** реальні Supabase-запити (не локальні seed-масиви), обгорнуті
`simulateRequest` — додає 300–800мс затримки й ~20% випадкову помилку
поверх справжнього запиту. Це навмисно: реальний Supabase зазвичай
відповідає за <150мс і майже ніколи не падає, тож без штучного шару
skeleton/retry (окремий пункт оцінки) просто не було б видно під час рев'ю.
Реальна помилка Supabase теж мапиться в той самий `ApiError` і йде тим
самим шляхом retry.

**Список вакансій без зайвих ре-рендерів:** вакансії (усі — на `/jobs` через
`AllJobsBoard`, або одного партнера — на `/partners/[slug]` через
`PartnerJobsBoard`) завантажуються один раз (`useAsync`), пошук і категорія
фільтрують виключно на клієнті. Сирий стан кожного натискання клавіші живе
всередині `JobSearchInput` (не в батьківському board-компоненті) —
`onDebouncedChange` стабільний (`useCallback`), тож `memo(JobSearchInput)`
не ре-рендериться через активність батька; ре-рендер від символу лишається
в цьому листовому компоненті й не каскадує далі. `filterJobs`/
`filterPartnersByCategory` використовують лише `Array.prototype.filter`
(без map/clone) — об'єкти, що пройшли фільтр, зберігають referential
identity, тож `React.memo(JobCard)`/`React.memo(PartnerCard)` не
перерендеряться, якщо конкретний елемент не змінився.

**Вакансії vs партнери:** «Знайти роботу» (`/jobs`) — це первинний
кандидатський сценарій: усі вакансії всіх партнерів разом, з пошуком і
фільтром за категорією (кожна картка показує, від якого партнера вакансія,
з посиланням на його сторінку). «Партнери» (`/partners`) — окремий індекс
компаній-роботодавців (теж фільтрується за категорією), корисний як
"каталог працевлаштування", а заглиблення в конкретного партнера
(`/partners/[slug]`) показує вже тільки його вакансії — той самий
пошук+фільтр, але в межах одного партнера, як і вимагає бриф. Клік по
назві вакансії (з будь-якого списку) веде на `/jobs/[id]` — повний опис,
дані про роботодавця з посиланням на його сторінку, і форма заявки одразу
на місці (той самий `ContactForm`, що й на `/contact`) — не треба переходити
на іншу сторінку, щоб відгукнутися.

**Фільтри вакансій** (`JobFiltersPanel` + `FilterChipGroup`, використовується
і на `/jobs`, і на `/partners/[slug]`): пошук за назвою завжди на видноті;
іконка-кнопка «Фільтри» (з бейджем кількості активних фільтрів) розкриває
панель, де **категорія, тип зайнятості, формат роботи, досвід і знання
мови — усі мультиселект-чіпи** (можна обрати кілька значень одночасно, напр.
"англійська АБО польська"), плюс поле мінімальної зарплати. Кнопка «Скинути
все» зникає, якщо жодного фільтра не активовано. `filterJobs(jobs, query,
locale, filters: JobFilters)` — один об'єкт фільтрів із масивами замість
розкиданих параметрів; порожній масив/undefined на вимір = без обмежень.
Категорійні бейджі (на картках вакансій і партнерів) і чіпи категорій у
фільтрі використовують одну спільну кольорову мапу (`data/categoryColors.ts`)
— один колір скрізь означає одну категорію.

**Категорії на Головній** (`CategoryGrid`) — картка з іконкою (inline SVG,
`data/categoryIcons.tsx`, без бібліотеки іконок) у кольоровому бейджі,
заголовком і коротким описом напрямку (`categoryDescriptions` у
`messages/*.json`), а не просто кольоровий прямокутник із текстом.

**Анімації** (`components/motion/`, framer-motion) — `FadeIn` (поява
знизу-вгору при скролі у в'юпорт, один раз) на Hero; `StaggerContainer`/
`StaggerItem` (діти з'являються по черзі) на сітках категорій/партнерів.
Важливий нюанс: `StaggerContainer` за замовчуванням прив'язаний до скролу
(`whileInView` + `once: true`) — це підходить лише для статичних секцій,
що не змінюють вміст. Для списку партнерів (`PartnersIndexBoard`), який
фільтрується інтерактивно, це були б завжди-невидимі картки, що
з'являються в DOM після першого спрацювання анімації (`once`) — тому там
явно передається `viewportTriggered={false}` (анімація завжди програється
наново). Список вакансій (`JobList`) анімується інакше:
`AnimatePresence` + `motion.div` на кожній картці — реагує на кожну зміну
пошуку/фільтрів, а не лише на перший рендер, тож картки плавно
з'являються/зникають під час фільтрації. Мобільне меню й панель фільтрів
вакансій розкриваються через `AnimatePresence` (фейд+зсув) замість
миттєвого показу/приховання.

**Фон Hero** (`DotBackground` + `GlowDots`) — статична сітка крапок
(CSS `radial-gradient`) плюс друга, яскравіша копія того самого патерну,
яка проявляється лише в колі, що само повільно "гуляє" випадковими
точками (CSS `mask-image`, координати оновлює легкий `requestAnimationFrame`-
цикл, без відстеження миші — попередня версія з canvas+pointermove
ламала висоту/клікабельність секції, тому свідомо спрощено). Той самий
фон перевикористаний і в блоці "Потрібні співробітники?"
(`EmployerCtaSection`) — картка тепер у звичайних кольорах теми замість
інвертованих (був чорний блок на світлій темі й навпаки).

**Помилки поза async-шаром** (`app/[locale]/error.tsx`,
`app/global-error.tsx`) — стандартний Next.js error boundary: ловить
будь-яку необроблену помилку в дереві сторінок (напр. якби
`resolveJobById`/`resolvePartnerBySlug` реально впали, а не повернули
`null`), показує той самий `RetryBlock`, що й на списках. `global-error.tsx`
— крайній фолбек на випадок падіння самого `layout.tsx` (немає окремого
кореневого layout — `[locale]/layout.tsx` сам визначає `<html>`), тому
навмисно без next-intl/Tailwind.

## Unit-тести

`npm run test:coverage` — 57 тестів, **~96% покриття** логіки, яку оцінює
бриф (debounce, комбінація фільтрів, валідація форми, retry/abort-guard):

- `lib/mockApi/simulateRequest.test.ts` — затримка 300–800мс, ~20% помилка, `ApiError`
- `lib/mockApi/resolveErrorMessage.test.ts` — маркери simulateRequest/useAsync
  перекладаються під поточну локаль, сира помилка (напр. від Supabase)
  проходить без змін
- `lib/filterJobs.test.ts` — пошук за локалізованою назвою + кожен мультиселект-
  вимір (категорія/тип зайнятості/формат/досвід/мова/мінімальна зарплата)
  окремо, з кількома значеннями одночасно, і в комбінації; `countActiveJobFilters`
- `lib/filterPartners.test.ts` — фільтр партнерів за категорією
- `hooks/useDebouncedValue.test.ts` — не оновлюється до завершення delay, проміжні значення не просочуються
- `hooks/useAsync.test.ts` — loading→success/error, `retry()`, застарілий (aborted) виклик не перезаписує новіший стан
- `lib/validation/contactForm.test.ts` — межі імені/телефону/telegram/довжини повідомлення
- `components/contact/ContactForm.test.tsx` — інлайн-помилки без мережевого виклику й без `alert()`; optimistic UI + rollback при помилці
- `components/partners/JobSearchInput.test.tsx` — `onDebouncedChange` викликається раз, не на кожен символ
- `components/shared/RetryBlock.test.tsx` — рендер + клік → `onRetry`

Покриття свідомо не рахується для презентаційних Server Components
(Header/Footer/Hero тощо) — там немає логіки, лише розмітка.

## Lighthouse

`npm run build && npm run start`, далі Chrome DevTools → Lighthouse на `/uk`
(потрібні застосовані `supabase/schema.sql` + `seed.sql`, інакше Головна
покаже retry-стан замість реального контенту партнерів).

> Скріншот буде додано після деплою на Vercel — саме там і локально
> запускається аудит продакшн-білду; додайте його сюди перед відправкою
> завдання (`docs/lighthouse.png` або посилання).

## Мої рішення

1. **Структура Головної** — Hero одразу пояснює цінність, далі категорії
   (найшвидший шлях до релевантних вакансій), потім соціальний доказ
   (партнери), і лише тоді блок для роботодавців — кандидатів (основна
   аудиторія) не змушуємо скролити повз "продаж" роботодавцям.
2. **Швидший пошук вакансії** — категорійні чіпи на Головній ведуть одразу
   на `/jobs?category=...` (агрегований список усіх вакансій, попередньо
   відфільтрований), а не на порожній список, який ще треба фільтрувати
   вручну. Спершу ці чіпи вели на одного фіксованого партнера — виявилось
   нелогічно, щойно в БД зʼявилось декілька різних партнерів (клік по "IT"
   мав би показувати IT-вакансії всіх компаній, а не однієї конкретної) —
   виправлено на окрему сторінку `/jobs` понад усіма партнерами.
3. **Стейт-менеджмент без Redux/Zustand** — увесь стан локальний (`useState`
   у місці використання) + один universal `useAsync`-хук для
   loading/error/retry. Для 3 сторінок і однієї async-фічі глобальний стор
   був би зайвою складністю без переваг.
4. **Зайві ре-рендери списку вакансій** — вирішено композицією компонентів,
   не мемоізацією "про всяк випадок": сирий inputvalue ізольований у
   `JobSearchInput` (не піднятий у батька), `filterJobs` зберігає
   referential identity об'єктів, `JobCard`/`JobList`/`CategoryFilter` —
   `React.memo`. Ре-рендер від клавіші ніколи не йде далі листового
   компонента.
5. **Що змінено в брифі і чому** — див. нижче.

## Відхилення від брифу

- **Next.js замість Vite + React Router.** Репозиторій уже був
  ініціалізований як Next.js 16 (App Router) до отримання брифу; App Router
  повністю замінює React Router (файловий роутинг, `<Link>`, `useRouter`).
  Решта вимог (TS strict, Tailwind, без Redux/Zustand/UI-кітів, ручний
  debounce, мокова fetch-обгортка з retry) виконано так само, як і на Vite.
- **Дані з Supabase, а не з локальних seed-масивів.** У команди вже є
  спільний Supabase-проєкт (використовується іншим внутрішнім застосунком),
  тож дані вакансій/партнерів зберігаються там (таблиці з префіксом
  `job_platform_`), а не хардкодяться в коді. Мокова затримка/помилка з
  брифу (300–800мс, ~1/5) реалізована як шар поверх реальних запитів (див.
  розділ «Архітектура»), а не замінена ним.
- **Локалізація (uk / en / pl) — фіча понад бриф.** Не вимагалась завданням,
  додана як ініціатива: next-intl, переклад контенту вакансій/партнерів у
  самій БД (jsonb-поля `{uk, en, pl}`), а не лише інтерфейсу. Бриф буквально
  просить шлях `/контакти` — спершу так і було зроблено (локалізовані
  pathnames: `/контакти` для uk, `/contact`/`/kontakt` для en/pl). Від цього
  свідомо відмовились: кирилиця в URL завжди percent-encode'иться браузером
  при копіюванні/поширенні лінка чи в логах (`%D0%BA%D0%BE...`) — це
  властивість кирилиці в URL, не помилка реалізації, але й не найзручніший
  досвід. Тепер шлях `/contact` однаковий у всіх трьох локалях — простіше й
  передбачуваніше, ніж коректність буквальної відповідності брифу щодо
  самого рядка шляху.
- **Агрегований `/jobs` і індекс `/partners` — понад бриф.** Бриф описує
  єдиний шаблон динамічної сторінки партнера з вакансіями (без індексу
  партнерів). Спочатку "Знайти роботу" й категорійні чіпи вели на один
  зафіксований партнер — з появою кількох реальних партнерів у Supabase це
  виявилось нелогічним UX (кандидат мав би шукати роботу за посадою, не за
  компанією). Тому додано `/jobs` (усі вакансії всіх партнерів, той самий
  пошук+фільтр) як основний кандидатський сценарій і `/partners` (індекс
  компаній) як окремий каталог роботодавців — `/partners/[slug]` лишається
  сторінкою одного партнера з вакансіями саме в межах брифу.
- **Розширені фільтри вакансій і сторінка окремої вакансії — понад бриф.**
  Бриф вимагає лише пошук+категорію. Додано: тип зайнятості (+ проєктна
  робота), формат роботи (на місці/віддалено/гібридно), досвід у роках,
  знання мови, мінімальна зарплата — і `/jobs/[id]` зі сторінкою деталей
  та формою заявки прямо на місці. ~60 вакансій у seed згенеровано з
  структурованих даних (`supabase/seed-data.mjs` → `npm run seed:generate`)
  замість руки-писаного SQL — менше ризику помилок екранування лапок у
  такому обсязі багатомовного контенту.

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
- **Vitest + React Testing Library** — unit-тести
- Без Redux/Zustand, без UI-кітів, без React Query/SWR — увесь стан і
  асинхронність написані вручну

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
     на заявки). Ідемпотентний, можна перезапускати.
   - [`supabase/seed.sql`](supabase/seed.sql) — 6 демо-партнерів (усі 7
     категорій), ~20 вакансій, кожен текстовий запис — jsonb `{ uk, en, pl }`.
     Теж ідемпотентний (`on conflict do nothing` / `where not exists`).

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
  page.tsx                     # Home
  jobs/page.tsx                 # /jobs — усі вакансії всіх партнерів (той самий шлях у всіх локалях)
  partners/page.tsx             # /partners — індекс партнерів (+ фільтр за категорією)
  partners/[slug]/page.tsx     # сторінка одного партнера (динамічна)
  contact/page.tsx             # /contact (той самий шлях у всіх локалях)

components/
  layout/     Header, Footer, LocaleSwitcher, MobileNav
  home/       Hero, CategoryGrid, FeaturedPartnersSection(+Skeleton), EmployerCtaSection
  partners/   PartnerCard, PartnerHeader, PartnersIndexBoard, AllJobsBoard,
              PartnerJobsBoard, JobSearchInput, CategoryFilter, JobList,
              JobCard, JobListSkeleton
  contact/    ContactForm
  shared/     Skeleton, RetryBlock

lib/
  supabase/       client.ts (браузер) / server.ts (Server Components)
  mockApi/        simulateRequest.ts + partners.ts / jobs.ts / contact.ts
  filterJobs.ts    чиста функція пошук+категорія (для вакансій)
  filterPartners.ts чиста функція фільтр партнерів за категорією
  validation/      contactForm.ts — чисті валідатори
  i18n/            pickLocalized.ts
  partners/        resolvePartnerBySlug.ts (server-side lookup для notFound())

hooks/       useDebouncedValue.ts, useAsync.ts
data/        categories.ts, locations.ts (фіксовані таксономії)
types/       category, location, job, partner, contact, i18n
i18n/        routing.ts, navigation.ts, request.ts (next-intl)
messages/    uk.json, en.json, pl.json
supabase/    schema.sql, seed.sql
proxy.ts     next-intl middleware (Next.js 16 перейменував middleware → proxy)
```

**Server/Client межа:** усе, що не тримає стан (Header, Footer, Hero,
CategoryGrid, PartnerHeader, сторінки) — Server Component. Інтерактивне
(пошук, фільтр, форма, перемикач мови) — `'use client'`. Це мінімізує
клієнтський JS-бандл.

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
пошук+фільтр, але в межах одного партнера, як і вимагає бриф.

## Unit-тести

`npm run test:coverage` — 41 тест, **~97% покриття** логіки, яку оцінює
бриф (debounce, комбінація фільтрів, валідація форми, retry/abort-guard):

- `lib/mockApi/simulateRequest.test.ts` — затримка 300–800мс, ~20% помилка, `ApiError`
- `lib/filterJobs.test.ts` — пошук за локалізованою назвою + категорія, разом і окремо
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

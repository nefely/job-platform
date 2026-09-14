import type { CategoryId } from "./category";
import type { LocalizedText } from "./i18n";
import type { LanguageCode } from "./language";
import type { LocationCode } from "./location";

export type EmploymentType = "full-time" | "part-time" | "seasonal" | "project";

export type WorkFormat = "onsite" | "remote" | "hybrid";

export type ExperienceLevel = "0-1" | "1-3" | "3-5" | "5+";

export type Currency = "UAH" | "EUR" | "PLN";

export interface Job {
  id: string;
  // Взаємовиключні: вакансія належить АБО партнеру (агенції/компанії зі
  // спеціальними стосунками з платформою), АБО прямому роботодавцю без
  // жодного зв'язку з партнерами (не всі роботодавці — партнери). Рівно
  // одне з двох завжди заповнене — див. CHECK-constraint у schema.sql.
  partnerId?: string;
  employerId?: string;
  category: CategoryId;
  locationCode: LocationCode;
  employmentType: EmploymentType;
  workFormat: WorkFormat;
  experienceLevel: ExperienceLevel;
  requiredLanguages: LanguageCode[];
  salaryFrom?: number;
  salaryTo?: number;
  currency?: Currency;
  title: LocalizedText;
  description: LocalizedText;
  postedAt: string;
  // Заповнюються лише для агрегованого списку вакансій ("Знайти роботу" —
  // fetchAllJobs) і сторінки однієї вакансії, де потрібно показати, від
  // кого вакансія. На сторінці одного партнера (fetchJobsByPartnerId)
  // лишаються undefined — партнер там і так один, показувати нема сенсу.
  partnerSlug?: string;
  partnerName?: LocalizedText;
  employerSlug?: string;
  employerName?: string;
}

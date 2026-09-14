import type { CategoryId } from "./category";
import type { Currency, EmploymentType, ExperienceLevel, WorkFormat } from "./job";
import type { AppLocale } from "./i18n";
import type { LanguageCode } from "./language";
import type { LocationCode } from "./location";

export type LanguageLevel = "basic" | "intermediate" | "fluent" | "native";

export interface CandidateLanguage {
  code: LanguageCode;
  level: LanguageLevel;
}

// На відміну від Job/Partner, name/headline/about НЕ LocalizedText: це
// текст, який реальна людина один раз пише про себе своєю мовою (як
// справжнє резюме), а не маркетинговий контент, який свідомо перекладають
// на 3 мови. `profileLocale` фіксує, якою мовою написаний профіль — UI
// показує ці поля як є, незалежно від поточної локалі сайту.
export interface Candidate {
  id: string;
  slug: string;
  name: string;
  avatarUrl?: string;
  categories: CategoryId[];
  headline: string;
  profileLocale: AppLocale;
  locationCode: LocationCode;
  desiredEmploymentTypes: EmploymentType[];
  desiredWorkFormats: WorkFormat[];
  experienceLevel: ExperienceLevel;
  languages: CandidateLanguage[];
  skills: string[];
  about?: string;
  salaryExpectationFrom?: number;
  currency?: Currency;
  availableFrom?: string;
  updatedAt: string;
}

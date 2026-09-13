import type { CategoryId } from "./category";
import type { LocalizedText } from "./i18n";
import type { LocationCode } from "./location";

export type EmploymentType = "full-time" | "part-time" | "seasonal";

export type Currency = "UAH" | "EUR" | "PLN";

export interface Job {
  id: string;
  partnerId: string;
  category: CategoryId;
  locationCode: LocationCode;
  employmentType: EmploymentType;
  salaryFrom?: number;
  salaryTo?: number;
  currency?: Currency;
  title: LocalizedText;
  description: LocalizedText;
  postedAt: string;
}

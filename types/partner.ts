import type { CategoryId } from "./category";
import type { LocalizedText } from "./i18n";
import type { LocationCode } from "./location";

export interface Partner {
  id: string;
  slug: string;
  logoUrl?: string;
  locationCode: LocationCode;
  categories: CategoryId[];
  name: LocalizedText;
  summary: LocalizedText;
}

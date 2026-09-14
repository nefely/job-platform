import type { LocationCode } from "./location";

// Легка сутність — на відміну від Partner, це компанія, яка не має
// жодних формальних стосунків із платформою (не агенція, не "партнер"),
// а просто прямий роботодавець, що розмістив вакансію(ї). Без власної
// сторінки, без categories/summary — лише те, що потрібно показати на
// картці вакансії. Job.partnerId і Job.employerId взаємовиключні: вакансія
// належить АБО партнеру, АБО прямому роботодавцю, ніколи обом і ніколи
// жодному (див. CHECK-constraint у schema.sql).
export interface Employer {
  id: string;
  slug: string;
  name: string;
  locationCode: LocationCode;
}

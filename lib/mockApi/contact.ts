import { createClient } from "@/lib/supabase/client";
import type { ContactFormValues } from "@/types/contact";
import { ApiError, simulateRequest, type SimulateRequestOptions } from "./simulateRequest";

export interface ContactSubmissionResult {
  success: true;
}

// No `.select()` after the insert on purpose: the RLS policy on
// job_platform_contact_submissions grants `insert` only (see
// supabase/schema.sql) so that nobody can read other people's submissions
// back through the anon key — including the just-inserted row, since
// Postgres evaluates the SELECT policy for RETURNING too. We only need to
// know whether the write succeeded, not the row it created.
export function submitContactForm(
  values: ContactFormValues,
  options: SimulateRequestOptions = {},
): Promise<ContactSubmissionResult> {
  return simulateRequest(async () => {
    const { error } = await createClient().from("job_platform_contact_submissions").insert({
      name: values.name.trim(),
      contact: values.contact.trim(),
      message: values.message.trim(),
    });

    if (error) {
      throw new ApiError(error.message);
    }

    return { success: true };
  }, options);
}

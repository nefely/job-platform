export interface ContactFormValues {
  name: string;
  contact: string;
  message: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

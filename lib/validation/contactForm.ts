import type { ContactFormErrors, ContactFormValues } from "@/types/contact";

const PHONE_PATTERN = /^\+?[0-9][0-9\s\-()]{7,14}$/;
const TELEGRAM_PATTERN = /^@[A-Za-z0-9_]{5,32}$/;

export type ContactFormErrorKey = "nameTooShort" | "contactInvalid" | "messageTooLong";

export function validateName(name: string): ContactFormErrorKey | undefined {
  return name.trim().length < 2 ? "nameTooShort" : undefined;
}

export function validateContact(contact: string): ContactFormErrorKey | undefined {
  const trimmed = contact.trim();
  const isValid = PHONE_PATTERN.test(trimmed) || TELEGRAM_PATTERN.test(trimmed);
  return isValid ? undefined : "contactInvalid";
}

export function validateMessage(message: string): ContactFormErrorKey | undefined {
  return message.length > 500 ? "messageTooLong" : undefined;
}

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};

  const nameError = validateName(values.name);
  if (nameError) errors.name = nameError;

  const contactError = validateContact(values.contact);
  if (contactError) errors.contact = contactError;

  const messageError = validateMessage(values.message);
  if (messageError) errors.message = messageError;

  return errors;
}

export function hasErrors(errors: ContactFormErrors): boolean {
  return Object.values(errors).some(Boolean);
}

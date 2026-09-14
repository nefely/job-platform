"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { submitContactForm } from "@/lib/mockApi/contact";
import {
  hasErrors,
  validateContactForm,
  type ContactFormErrorKey,
} from "@/lib/validation/contactForm";
import type { ContactFormErrors, ContactFormValues } from "@/types/contact";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const EMPTY_VALUES: ContactFormValues = { name: "", contact: "", message: "" };

export function ContactForm() {
  const t = useTranslations("contact");

  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormValues, boolean>>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const errorMessages: Record<ContactFormErrorKey, string> = {
    nameTooShort: t("errors.nameTooShort"),
    contactInvalid: t("errors.contactInvalid"),
    messageTooLong: t("errors.messageTooLong"),
  };

  function updateField(field: keyof ContactFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function markTouched(field: keyof ContactFormValues) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateContactForm(values);
    setErrors(validationErrors);
    setTouched({ name: true, contact: true, message: true });

    if (hasErrors(validationErrors)) {
      return;
    }

    // Оптимістичний UI: одразу показуємо успіх і чистимо форму, знімок
    // значень зберігаємо для запиту й можливого rollback.
    const snapshot = values;
    setStatus("success");
    setValues(EMPTY_VALUES);
    setTouched({});

    try {
      await submitContactForm(snapshot);
    } catch {
      setStatus("error");
      setValues(snapshot);
    }
  }

  async function handleRetry() {
    setStatus("submitting");
    try {
      await submitContactForm(values);
      setStatus("success");
      setValues(EMPTY_VALUES);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-green-200 bg-green-50 p-6 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-100"
      >
        <p className="font-semibold">{t("successTitle")}</p>
        <p className="mt-1 text-sm">{t("successText")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="contact-name" className="text-sm font-medium">
          {t("nameLabel")}
        </label>
        <input
          id="contact-name"
          type="text"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          onBlur={() => markTouched("name")}
          placeholder={t("namePlaceholder")}
          aria-invalid={touched.name && errors.name ? "true" : undefined}
          aria-describedby={touched.name && errors.name ? "contact-name-error" : undefined}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:focus:border-gray-100"
        />
        {touched.name && errors.name && (
          <p id="contact-name-error" className="text-sm text-red-600 dark:text-red-400">
            {errorMessages[errors.name as ContactFormErrorKey]}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="contact-contact" className="text-sm font-medium">
          {t("contactLabel")}
        </label>
        <input
          id="contact-contact"
          type="text"
          value={values.contact}
          onChange={(event) => updateField("contact", event.target.value)}
          onBlur={() => markTouched("contact")}
          placeholder={t("contactPlaceholder")}
          aria-invalid={touched.contact && errors.contact ? "true" : undefined}
          aria-describedby={touched.contact && errors.contact ? "contact-contact-error" : undefined}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:focus:border-gray-100"
        />
        {touched.contact && errors.contact && (
          <p id="contact-contact-error" className="text-sm text-red-600 dark:text-red-400">
            {errorMessages[errors.contact as ContactFormErrorKey]}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="contact-message" className="text-sm font-medium">
          {t("messageLabel")}{" "}
          <span className="font-normal text-gray-500 dark:text-gray-400">
            ({t("messageOptionalHint")})
          </span>
        </label>
        <textarea
          id="contact-message"
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          onBlur={() => markTouched("message")}
          rows={4}
          aria-invalid={touched.message && errors.message ? "true" : undefined}
          aria-describedby={touched.message && errors.message ? "contact-message-error" : undefined}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:focus:border-gray-100"
        />
        {touched.message && errors.message && (
          <p id="contact-message-error" className="text-sm text-red-600 dark:text-red-400">
            {errorMessages[errors.message as ContactFormErrorKey]}
          </p>
        )}
      </div>

      {status === "error" && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100"
        >
          <p>{t("errorBanner")}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-2 rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-900"
          >
            {t("submit")}
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}

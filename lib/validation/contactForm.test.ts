import { describe, expect, it } from "vitest";
import {
  hasErrors,
  validateContact,
  validateContactForm,
  validateMessage,
  validateName,
} from "./contactForm";

describe("validateName", () => {
  it("rejects names shorter than 2 characters (after trim)", () => {
    expect(validateName("")).toBe("nameTooShort");
    expect(validateName("A")).toBe("nameTooShort");
    expect(validateName("  A  ")).toBe("nameTooShort");
  });

  it("accepts names of exactly 2 characters", () => {
    expect(validateName("Al")).toBeUndefined();
  });

  it("accepts longer names", () => {
    expect(validateName("Олена")).toBeUndefined();
  });
});

describe("validateContact", () => {
  it("accepts valid phone numbers", () => {
    expect(validateContact("+380991234567")).toBeUndefined();
    expect(validateContact("0991234567")).toBeUndefined();
    expect(validateContact("+48 123 456 789")).toBeUndefined();
  });

  it("accepts valid Telegram handles", () => {
    expect(validateContact("@username")).toBeUndefined();
    expect(validateContact("@user_name_123")).toBeUndefined();
  });

  it("rejects invalid phone numbers", () => {
    expect(validateContact("12345")).toBe("contactInvalid");
    expect(validateContact("not a phone")).toBe("contactInvalid");
  });

  it("rejects invalid Telegram handles (too short)", () => {
    expect(validateContact("@abc")).toBe("contactInvalid");
  });

  it("rejects an empty value", () => {
    expect(validateContact("")).toBe("contactInvalid");
  });
});

describe("validateMessage", () => {
  it("accepts an empty message (optional field)", () => {
    expect(validateMessage("")).toBeUndefined();
  });

  it("accepts a message at exactly the 500 character limit", () => {
    expect(validateMessage("a".repeat(500))).toBeUndefined();
  });

  it("rejects a message over 500 characters", () => {
    expect(validateMessage("a".repeat(501))).toBe("messageTooLong");
  });
});

describe("validateContactForm / hasErrors", () => {
  it("returns no errors for a fully valid submission", () => {
    const errors = validateContactForm({
      name: "Олена",
      contact: "+380991234567",
      message: "Привіт!",
    });
    expect(hasErrors(errors)).toBe(false);
  });

  it("aggregates errors from all three fields", () => {
    const errors = validateContactForm({
      name: "A",
      contact: "invalid",
      message: "a".repeat(501),
    });
    expect(errors).toEqual({
      name: "nameTooShort",
      contact: "contactInvalid",
      message: "messageTooLong",
    });
    expect(hasErrors(errors)).toBe(true);
  });
});

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Vitest (unlike Jest) doesn't auto-register Testing Library's DOM cleanup,
// so without this, components rendered in one test stay mounted for the
// next one in the same file.
afterEach(() => {
  cleanup();
});

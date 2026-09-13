import { describe, expect, it } from "vitest";
import { resolveErrorMessage } from "./resolveErrorMessage";
import { SIMULATED_FAILURE_MESSAGE, UNKNOWN_ERROR_MESSAGE } from "./simulateRequest";

const tCommon = (key: string) =>
  key === "simulatedErrorMessage" ? "Simulated (translated)" : "Unknown (translated)";

describe("resolveErrorMessage", () => {
  it("translates the simulated-failure marker", () => {
    expect(resolveErrorMessage(SIMULATED_FAILURE_MESSAGE, tCommon)).toBe("Simulated (translated)");
  });

  it("translates the unknown-error marker", () => {
    expect(resolveErrorMessage(UNKNOWN_ERROR_MESSAGE, tCommon)).toBe("Unknown (translated)");
  });

  it("passes a real (e.g. Supabase) error message through unchanged", () => {
    const raw = "column job_platform_jobs.work_format does not exist";
    expect(resolveErrorMessage(raw, tCommon)).toBe(raw);
  });
});

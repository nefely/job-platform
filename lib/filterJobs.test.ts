import { describe, expect, it } from "vitest";
import { filterJobs } from "./filterJobs";
import type { Job } from "@/types/job";

function makeJob(overrides: Partial<Job>): Job {
  return {
    id: "1",
    partnerId: "p1",
    category: "it",
    locationCode: "berlin",
    employmentType: "full-time",
    title: { uk: "Frontend-розробник", en: "Frontend developer", pl: "Programista frontend" },
    description: { uk: "", en: "", pl: "" },
    postedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("filterJobs", () => {
  const driverJob = makeJob({
    id: "driver",
    category: "drivers",
    title: { uk: "Водій категорії CE", en: "CE category driver", pl: "Kierowca kat. CE" },
  });
  const itJob = makeJob({
    id: "it",
    category: "it",
    title: { uk: "Frontend-розробник", en: "Frontend developer", pl: "Programista frontend" },
  });
  const jobs = [driverJob, itJob];

  it("returns all jobs when query is empty and category is 'all'", () => {
    expect(filterJobs(jobs, "", "all", "uk")).toEqual(jobs);
  });

  it("filters by category only", () => {
    expect(filterJobs(jobs, "", "drivers", "uk")).toEqual([driverJob]);
  });

  it("filters by localized title substring, case-insensitively", () => {
    expect(filterJobs(jobs, "frontend", "all", "en")).toEqual([itJob]);
    expect(filterJobs(jobs, "FRONTEND", "all", "en")).toEqual([itJob]);
  });

  it("searches the title in the requested locale, not other locales", () => {
    // "Kierowca" only matches the Polish title, not the Ukrainian one.
    expect(filterJobs(jobs, "Kierowca", "all", "pl")).toEqual([driverJob]);
    expect(filterJobs(jobs, "Kierowca", "all", "uk")).toEqual([]);
  });

  it("combines category and query filters", () => {
    expect(filterJobs(jobs, "розробник", "it", "uk")).toEqual([itJob]);
    expect(filterJobs(jobs, "розробник", "drivers", "uk")).toEqual([]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterJobs(jobs, "no such job", "all", "uk")).toEqual([]);
  });

  it("preserves referential identity of unfiltered job objects", () => {
    const [result] = filterJobs(jobs, "", "drivers", "uk");
    expect(result).toBe(driverJob);
  });
});

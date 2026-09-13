import { describe, expect, it } from "vitest";
import { countActiveJobFilters, filterJobs } from "./filterJobs";
import type { Job } from "@/types/job";

function makeJob(overrides: Partial<Job>): Job {
  return {
    id: "1",
    partnerId: "p1",
    category: "it",
    locationCode: "berlin",
    employmentType: "full-time",
    workFormat: "onsite",
    experienceLevel: "0-1",
    requiredLanguages: [],
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

  it("returns all jobs when query is empty and no filters are set", () => {
    expect(filterJobs(jobs, "", "uk")).toEqual(jobs);
  });

  it("filters by category (multiselect)", () => {
    expect(filterJobs(jobs, "", "uk", { categories: ["drivers"] })).toEqual([driverJob]);
  });

  it("matches any of several selected categories", () => {
    expect(filterJobs(jobs, "", "uk", { categories: ["drivers", "it"] })).toEqual(jobs);
  });

  it("filters by localized title substring, case-insensitively", () => {
    expect(filterJobs(jobs, "frontend", "en")).toEqual([itJob]);
    expect(filterJobs(jobs, "FRONTEND", "en")).toEqual([itJob]);
  });

  it("searches the title in the requested locale, not other locales", () => {
    // "Kierowca" only matches the Polish title, not the Ukrainian one.
    expect(filterJobs(jobs, "Kierowca", "pl")).toEqual([driverJob]);
    expect(filterJobs(jobs, "Kierowca", "uk")).toEqual([]);
  });

  it("combines category and query filters", () => {
    expect(filterJobs(jobs, "розробник", "uk", { categories: ["it"] })).toEqual([itJob]);
    expect(filterJobs(jobs, "розробник", "uk", { categories: ["drivers"] })).toEqual([]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterJobs(jobs, "no such job", "uk")).toEqual([]);
  });

  it("preserves referential identity of unfiltered job objects", () => {
    const [result] = filterJobs(jobs, "", "uk", { categories: ["drivers"] });
    expect(result).toBe(driverJob);
  });

  describe("advanced filters", () => {
    const fullTimeOnsite = makeJob({
      id: "a",
      employmentType: "full-time",
      workFormat: "onsite",
      experienceLevel: "0-1",
      requiredLanguages: [],
      salaryFrom: 1200,
    });
    const projectRemote = makeJob({
      id: "b",
      employmentType: "project",
      workFormat: "remote",
      experienceLevel: "3-5",
      requiredLanguages: ["en", "de"],
      salaryFrom: 2500,
    });
    const noSalarySpecified = makeJob({
      id: "c",
      employmentType: "part-time",
      workFormat: "hybrid",
      experienceLevel: "1-3",
      requiredLanguages: ["pl"],
      salaryFrom: undefined,
      salaryTo: undefined,
    });
    const advancedJobs = [fullTimeOnsite, projectRemote, noSalarySpecified];

    it("defaults to no extra filtering when filters are omitted", () => {
      expect(filterJobs(advancedJobs, "", "uk")).toEqual(advancedJobs);
    });

    it("filters by employmentTypes", () => {
      expect(filterJobs(advancedJobs, "", "uk", { employmentTypes: ["project"] })).toEqual([
        projectRemote,
      ]);
    });

    it("matches any of several selected employment types", () => {
      expect(
        filterJobs(advancedJobs, "", "uk", { employmentTypes: ["project", "part-time"] }),
      ).toEqual([projectRemote, noSalarySpecified]);
    });

    it("filters by workFormats", () => {
      expect(filterJobs(advancedJobs, "", "uk", { workFormats: ["remote"] })).toEqual([
        projectRemote,
      ]);
    });

    it("filters by experienceLevels", () => {
      expect(filterJobs(advancedJobs, "", "uk", { experienceLevels: ["3-5"] })).toEqual([
        projectRemote,
      ]);
    });

    it("filters by selected languages (job matches if it requires any of them)", () => {
      expect(filterJobs(advancedJobs, "", "uk", { languages: ["de"] })).toEqual([projectRemote]);
      expect(filterJobs(advancedJobs, "", "uk", { languages: ["pl"] })).toEqual([
        noSalarySpecified,
      ]);
      expect(filterJobs(advancedJobs, "", "uk", { languages: ["de", "pl"] })).toEqual([
        projectRemote,
        noSalarySpecified,
      ]);
    });

    it("filters by minSalary, excluding jobs with no salary specified", () => {
      expect(filterJobs(advancedJobs, "", "uk", { minSalary: 2000 })).toEqual([projectRemote]);
      expect(filterJobs(advancedJobs, "", "uk", { minSalary: 1000 })).toEqual([
        fullTimeOnsite,
        projectRemote,
      ]);
    });

    it("combines multiple filter dimensions at once", () => {
      expect(
        filterJobs(advancedJobs, "", "uk", {
          workFormats: ["remote"],
          experienceLevels: ["3-5"],
          minSalary: 2000,
        }),
      ).toEqual([projectRemote]);

      expect(
        filterJobs(advancedJobs, "", "uk", {
          workFormats: ["remote"],
          experienceLevels: ["0-1"],
        }),
      ).toEqual([]);
    });
  });
});

describe("countActiveJobFilters", () => {
  it("returns 0 for empty filters", () => {
    expect(countActiveJobFilters({})).toBe(0);
  });

  it("counts each selected value across every dimension", () => {
    expect(
      countActiveJobFilters({
        categories: ["it", "drivers"],
        employmentTypes: ["full-time"],
        languages: ["en", "de", "pl"],
      }),
    ).toBe(6);
  });

  it("counts minSalary as exactly one active filter when set", () => {
    expect(countActiveJobFilters({ minSalary: 1500 })).toBe(1);
    expect(countActiveJobFilters({ minSalary: null })).toBe(0);
  });
});

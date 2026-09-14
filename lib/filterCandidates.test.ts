import { describe, expect, it } from "vitest";
import { countActiveCandidateFilters, filterCandidates } from "./filterCandidates";
import type { Candidate } from "@/types/candidate";

function makeCandidate(overrides: Partial<Candidate>): Candidate {
  return {
    id: "1",
    slug: "candidate-1",
    name: "Andriy Kovalchuk",
    categories: ["it"],
    headline: "Frontend Developer",
    profileLocale: "en",
    locationCode: "berlin",
    desiredEmploymentTypes: ["full-time"],
    desiredWorkFormats: ["remote"],
    experienceLevel: "1-3",
    languages: [{ code: "en", level: "native" }],
    skills: [],
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("filterCandidates", () => {
  const driver = makeCandidate({
    id: "driver",
    name: "Vitalii Kuzmenko",
    headline: "Category CE Driver",
    categories: ["drivers"],
    locationCode: "warsaw",
    desiredWorkFormats: ["onsite"],
    languages: [{ code: "uk", level: "native" }],
  });
  const developer = makeCandidate({
    id: "dev",
    name: "Andriy Kovalchuk",
    headline: "Frontend Developer",
    categories: ["it"],
    locationCode: "berlin",
    languages: [
      { code: "en", level: "native" },
      { code: "uk", level: "fluent" },
    ],
  });
  const candidates = [driver, developer];

  it("returns all candidates when query is empty and no filters are set", () => {
    expect(filterCandidates(candidates, "")).toEqual(candidates);
  });

  it("filters by category (multiselect)", () => {
    expect(filterCandidates(candidates, "", { categories: ["drivers"] })).toEqual([driver]);
  });

  it("matches any of several selected categories", () => {
    expect(filterCandidates(candidates, "", { categories: ["drivers", "it"] })).toEqual(candidates);
  });

  it("filters by name substring, case-insensitively", () => {
    expect(filterCandidates(candidates, "andriy")).toEqual([developer]);
    expect(filterCandidates(candidates, "ANDRIY")).toEqual([developer]);
  });

  it("filters by headline substring", () => {
    expect(filterCandidates(candidates, "driver")).toEqual([driver]);
  });

  it("combines category and query filters", () => {
    expect(filterCandidates(candidates, "developer", { categories: ["it"] })).toEqual([developer]);
    expect(filterCandidates(candidates, "developer", { categories: ["drivers"] })).toEqual([]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterCandidates(candidates, "no such candidate")).toEqual([]);
  });

  it("preserves referential identity of unfiltered candidate objects", () => {
    const [result] = filterCandidates(candidates, "", { categories: ["drivers"] });
    expect(result).toBe(driver);
  });

  it("filters by locationCodes", () => {
    expect(filterCandidates(candidates, "", { locationCodes: ["warsaw"] })).toEqual([driver]);
  });

  it("filters by desired employment types (matches if candidate wants any of them)", () => {
    const seasonal = makeCandidate({ id: "seasonal", desiredEmploymentTypes: ["seasonal"] });
    const list = [driver, seasonal];
    expect(filterCandidates(list, "", { employmentTypes: ["seasonal"] })).toEqual([seasonal]);
  });

  it("filters by desired work formats", () => {
    expect(filterCandidates(candidates, "", { workFormats: ["remote"] })).toEqual([developer]);
  });

  it("filters by experienceLevels", () => {
    const senior = makeCandidate({ id: "senior", experienceLevel: "5+" });
    const list = [driver, senior];
    expect(filterCandidates(list, "", { experienceLevels: ["5+"] })).toEqual([senior]);
  });

  it("filters by selected languages (candidate matches if they speak any of them)", () => {
    expect(filterCandidates(candidates, "", { languages: ["uk"] })).toEqual(candidates);
    expect(filterCandidates(candidates, "", { languages: ["en"] })).toEqual([developer]);
  });

  describe("maxSalary filter", () => {
    const affordable = makeCandidate({ id: "affordable", salaryExpectationFrom: 1500 });
    const expensive = makeCandidate({ id: "expensive", salaryExpectationFrom: 4000 });
    const unspecified = makeCandidate({ id: "unspecified", salaryExpectationFrom: undefined });
    const list = [affordable, expensive, unspecified];

    it("returns all candidates when maxSalary is omitted or null", () => {
      expect(filterCandidates(list, "", {})).toEqual(list);
      expect(filterCandidates(list, "", { maxSalary: null })).toEqual(list);
    });

    it("excludes candidates above the budget and those with no expectation specified", () => {
      expect(filterCandidates(list, "", { maxSalary: 2000 })).toEqual([affordable]);
    });
  });

  describe("availableWithinDays filter", () => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const availableNow = makeCandidate({
      id: "now",
      availableFrom: new Date(now).toISOString().slice(0, 10),
    });
    const availableInAMonth = makeCandidate({
      id: "month",
      availableFrom: new Date(now + 30 * day).toISOString().slice(0, 10),
    });
    const noDate = makeCandidate({ id: "no-date", availableFrom: undefined });
    const list = [availableNow, availableInAMonth, noDate];

    it("returns all candidates when omitted or null", () => {
      expect(filterCandidates(list, "", {})).toEqual(list);
      expect(filterCandidates(list, "", { availableWithinDays: null })).toEqual(list);
    });

    it("filters to candidates available within N days, excluding those with no date", () => {
      expect(filterCandidates(list, "", { availableWithinDays: 7 })).toEqual([availableNow]);
    });
  });
});

describe("countActiveCandidateFilters", () => {
  it("returns 0 for empty filters", () => {
    expect(countActiveCandidateFilters({})).toBe(0);
  });

  it("counts each selected value across every dimension", () => {
    expect(
      countActiveCandidateFilters({
        categories: ["it", "drivers"],
        employmentTypes: ["full-time"],
        languages: ["en", "uk", "pl"],
      }),
    ).toBe(6);
  });

  it("counts maxSalary as exactly one active filter when set", () => {
    expect(countActiveCandidateFilters({ maxSalary: 2000 })).toBe(1);
    expect(countActiveCandidateFilters({ maxSalary: null })).toBe(0);
  });

  it("counts availableWithinDays as exactly one active filter when set", () => {
    expect(countActiveCandidateFilters({ availableWithinDays: 14 })).toBe(1);
    expect(countActiveCandidateFilters({ availableWithinDays: null })).toBe(0);
  });
});

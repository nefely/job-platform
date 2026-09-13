import { describe, expect, it } from "vitest";
import { filterPartnersByCategory } from "./filterPartners";
import type { Partner } from "@/types/partner";

function makePartner(overrides: Partial<Partner>): Partner {
  return {
    id: "1",
    slug: "acme",
    locationCode: "warsaw",
    categories: ["it"],
    name: { uk: "Acme", en: "Acme", pl: "Acme" },
    summary: { uk: "", en: "", pl: "" },
    ...overrides,
  };
}

describe("filterPartnersByCategory", () => {
  const itPartner = makePartner({ id: "it", categories: ["it"] });
  const multiCategoryPartner = makePartner({ id: "multi", categories: ["logistics", "drivers"] });
  const partners = [itPartner, multiCategoryPartner];

  it("returns all partners for 'all'", () => {
    expect(filterPartnersByCategory(partners, "all")).toEqual(partners);
  });

  it("returns only partners whose categories include the requested one", () => {
    expect(filterPartnersByCategory(partners, "it")).toEqual([itPartner]);
    expect(filterPartnersByCategory(partners, "drivers")).toEqual([multiCategoryPartner]);
  });

  it("returns an empty array when no partner matches", () => {
    expect(filterPartnersByCategory(partners, "construction")).toEqual([]);
  });

  it("preserves referential identity of matched partners", () => {
    const [result] = filterPartnersByCategory(partners, "it");
    expect(result).toBe(itPartner);
  });
});

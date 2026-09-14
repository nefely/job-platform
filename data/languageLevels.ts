import type { LanguageLevel } from "@/types/candidate";

// Фіксована таксономія рівнів володіння мовою. Лейбли — в messages/*.json
// (namespace "languageLevels").
export const LANGUAGE_LEVELS: LanguageLevel[] = ["basic", "intermediate", "fluent", "native"];

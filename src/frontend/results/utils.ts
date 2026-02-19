import { DRIVERS, TEAMS } from "@/lib/f1-presets"

export interface RaceResult {
  Category: string
  Position: string
  Actual: string
  Predicted: string
  Points: string
  Team: string
  Details: string
}

// Fuzzy driver name lookup — handles last-name-only, accents, full names
export function findDriver(csvName: string): string | null {
  if (!csvName?.trim()) return null
  const needle = csvName.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  return Object.keys(DRIVERS).find(k => {
    const haystack = DRIVERS[k].name.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    return haystack === needle || haystack.includes(needle) || needle.includes(haystack.split(" ").pop()!)
  }) ?? null
}

// Fuzzy team lookup
export function findTeam(csvName: string): string | null {
  if (!csvName?.trim()) return null
  const needle = csvName.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  return Object.keys(TEAMS).find(k => {
      const haystack = TEAMS[k].name.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      return haystack === needle || haystack.includes(needle)
  }) ?? null
}

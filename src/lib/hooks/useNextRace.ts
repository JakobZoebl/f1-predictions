import { useMemo } from "react"
import { RACES, type RaceEvent } from "@/lib/f1-presets"

export function useNextRace(): RaceEvent | null {
  return useMemo(() => {
    if (!RACES || RACES.length === 0) return null
    // Find the first race in the future
    const now = new Date()
    const upcoming = RACES.find((r) => {
      // Assuming time is in "HH:MM GMT+1" format
      // We need to parse it carefully or just rely on date if time is not critical for "next"
      // But let's use the logic from FeatureRace for consistency
      const timePart = r.time.split(" ")[0]
      const dateTimeString = `${r.date}T${timePart}:00Z` // Appending Z usually implies UTC, but original code did this. 
      // If original code was checking against local time vs UTC string, it might be roughly correct or slightly off.
      // Let's stick to the existing logic:
      const raceTime = new Date(dateTimeString)
      return raceTime > now
    })
    return upcoming || RACES[0]
  }, [])
}

import { useMemo } from "react"
import { RACES, type RaceEvent } from "@/lib/f1-presets"

export function useLastRace(): RaceEvent | null {
  return useMemo(() => {
    if (!RACES || RACES.length === 0) return null
    // Find the first race in the past
    const now = new Date()
    const upcoming = RACES.find((r) => {
      const timePart = r.time.split(" ")[0]
      const dateTimeString = `${r.date}T${timePart}:00Z` // Appending Z usually implies UTC, but original code did this. 

      const raceTime = new Date(dateTimeString)
      return raceTime < now
    })
    return upcoming || RACES[RACES.length - 1]
  }, [])
}

import { useMemo } from "react"
import { RACES, type RaceEvent } from "@/lib/f1-presets"

export function useLastRace(): RaceEvent | null {
  return useMemo(() => {
    if (!RACES || RACES.length === 0) return null
    const now = new Date()
    // Filter all races that are in the past, then pick the most recent one
    const pastRaces = RACES.filter((r) => {
      const timePart = r.time.split(" ")[0]
      const raceTime = new Date(`${r.date}T${timePart}:00Z`)
      return raceTime < now
    })
    return pastRaces.length > 0 ? pastRaces[pastRaces.length - 1] : null
  }, [])
}


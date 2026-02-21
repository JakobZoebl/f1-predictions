import { useMemo } from "react"
import { RACES, type RaceEvent } from "@/lib/f1-presets"

export function useNextRace(): RaceEvent | null {
  return useMemo(() => {
    if (!RACES || RACES.length === 0) return null
    // Find the first race in the future
    const now = new Date()
    const upcoming = RACES.find((r) => {
      const resultsDay = new Date(r.date)
      resultsDay.setUTCDate(resultsDay.getUTCDate() + 1)
      resultsDay.setUTCHours(0, 0, 0, 0)

      return resultsDay > now
    })
    return upcoming || RACES[RACES.length - 1]
  }, [])
}

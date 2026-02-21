import { useMemo } from "react"
import { SPRINTS, type RaceEvent } from "@/lib/f1-presets"

export function useNextSprint(): RaceEvent | null {
  return useMemo(() => {
    if (!SPRINTS || SPRINTS.length === 0) return null
    // Find the first race in the future
    const now = new Date()
    const upcoming = SPRINTS.find((r) => {
      const timePart = r.time.split(" ")[0]
      const dateTimeString = `${r.date}T${timePart}:00Z` // Appending Z usually implies UTC, but original code did this. 

      const raceTime = new Date(dateTimeString)
      return raceTime > now
    })
    return upcoming || SPRINTS[0]
  }, [])
}

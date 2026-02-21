import { useMemo } from "react"
import { SPRINTS, type RaceEvent } from "@/lib/f1-presets"

export function useNextSprint(): RaceEvent | null {
  return useMemo(() => {
    if (!SPRINTS || SPRINTS.length === 0) return null
    // Find the first race in the future
    const now = new Date()
    const upcoming = SPRINTS.find((r) => {
      const resultsDay = new Date(r.date)
      resultsDay.setUTCDate(resultsDay.getUTCDate() + 1)
      resultsDay.setUTCHours(0, 0, 0, 0)

      return resultsDay > now
    })
    return upcoming || SPRINTS[SPRINTS.length - 1]
  }, [])
}

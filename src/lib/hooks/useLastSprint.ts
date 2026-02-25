import { useMemo } from "react"
import { SPRINTS, type RaceEvent } from "@/lib/f1-presets"

export function useLastSprint(): RaceEvent | null {
  return useMemo(() => {
    if (!SPRINTS || SPRINTS.length === 0) return null
    const now = new Date()
    // Filter all sprints that are in the past, then pick the most recent one
    const pastSprints = SPRINTS.filter((r) => {
      const timePart = r.time.split(" ")[0]
      const raceTime = new Date(`${r.date}T${timePart}:00Z`)
      return raceTime < now
    })
    return pastSprints.length > 0 ? pastSprints[pastSprints.length - 1] : null
  }, [])
}


import { RACES, type RaceEvent } from "./f1-presets"

export interface EventStatus {
  isOpen: boolean
  isLocked: boolean
  unlocksAt: Date | null
  cutoffDate: Date | null
}

export function getEventStatus(event: RaceEvent | null | undefined): EventStatus {
  if (!event) {
    return {
      isOpen: false,
      isLocked: false,
      unlocksAt: null,
      cutoffDate: null,
    }
  }

  const now = new Date()
  
  // 1. Calculate Cutoff Date
  let cutoffDate: Date
  try {
    if (event.cutoff) {
      cutoffDate = new Date(event.cutoff.replace(' ', 'T') + ':00Z')
    } else {
      const timePart = event.time.split(' ')[0]
      const timeWithSeconds = timePart.length === 5 ? `${timePart}:00` : timePart
      cutoffDate = new Date(`${event.date}T${timeWithSeconds}Z`)
    }
  } catch (e) {
    console.error("Date parsing error", e)
    cutoffDate = new Date()
  }

  // 2. Calculate Unlock Date (Previous race + 1 day)
  let unlocksAt: Date | null = null
  if (event.round > 1) {
    const prevRace = RACES.find(r => r.round === event.round - 1)
    if (prevRace) {
      unlocksAt = new Date(prevRace.date)
      unlocksAt.setUTCDate(unlocksAt.getUTCDate() + 1)
      unlocksAt.setUTCHours(0, 0, 0, 0)
    }
  } else {
    // For Round 1, assume it's open unless we are before season start (unspecified, but let's assume always open for Round 1 for now)
    unlocksAt = new Date("2024-01-01T00:00:00Z") // Long ago
  }

  const isLocked = now >= cutoffDate
  const isOpen = !isLocked && (unlocksAt === null || now >= unlocksAt)

  return {
    isOpen,
    isLocked,
    unlocksAt,
    cutoffDate,
  }
}

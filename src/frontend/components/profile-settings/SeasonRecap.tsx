"use client"

import React, { useMemo } from "react"
import { RACES, SPRINTS, type RaceEvent } from "@/lib/f1-presets"
import { FeatureRace } from "@/frontend/components/FeatureRace"
import "@/frontend/styles/ProfileSettings.css"

export function SeasonRecap() {
  const allEvents = useMemo(() => {
    const events: RaceEvent[] = [...RACES, ...SPRINTS]
    
    // Sort by date then time
    return events.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time.split(' ')[0]}:00Z`)
      const dateB = new Date(`${b.date}T${b.time.split(' ')[0]}:00Z`)
      return dateA.getTime() - dateB.getTime()
    })
  }, [])

  return (
    <div className="season-recap-container">
      <h2 className="season-recap-title">Season Recap</h2>
      <div className="flex flex-col gap-4">
        {allEvents.map((race) => (
          <FeatureRace 
            key={race.id} 
            race={race}
            className="w-full"
          />
        ))}
      </div>
    </div>
  )
}

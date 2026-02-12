import { useMemo } from "react"
import { RACES, SPRINTS } from "@/lib/f1-presets"
import { F1Header } from "@/frontend/components/f1-header"
import { F1Background } from "@/frontend/components/blank-background"
import { FeatureRace } from "@/frontend/components/FeatureRace"
import { Button } from "@/frontend/components/button"
import { Link } from "react-router-dom"
import "@/frontend/styles/SeasonOverview.css"

export default function SeasonOverview() {
  const allRaces = useMemo(() => {
    const combined = [...RACES, ...SPRINTS]
    return combined.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time.split(' ')[0]}:00Z`)
      const dateB = new Date(`${b.date}T${b.time.split(' ')[0]}:00Z`)
      return dateA.getTime() - dateB.getTime()
    })
  }, [])

  return (
    <div className="season-overview-container">
      <F1Background>
      <F1Header variant="Home" activeNav="Season" />
      
      <main className="season-overview-main">
        <h1 className="season-overview-title">
          2026 Season Overview
        </h1>
        
        <div className="season-overview-races-container">
          {(() => {
             const now = new Date()
             // Find the index of the next upcoming race once
             const nextRaceIndex = allRaces.findIndex(r => {
                const rDate = new Date(`${r.date}T${r.time.split(' ')[0]}:00Z`)
                return rDate > now
             })

             return allRaces.map((race, index) => {
                const isNext = index === nextRaceIndex
                const isFinished = nextRaceIndex === -1 ? true : index < nextRaceIndex
                const isLocked = nextRaceIndex === -1 ? false : index > nextRaceIndex

            return (
              <FeatureRace 
                key={race.id} 
                race={race}
                className="season-overview-feature-race"
                renderActions={(raceColors) => (
                  <div className="season-overview-actions">
                    {isNext && (
                      <Link to="/race-predictions">
                        <Button 
                          className="season-overview-btn-predict"
                          style={{ 
                            backgroundColor: raceColors.primary,
                            boxShadow: `0 10px 25px -5px ${raceColors.primary}40`
                          }}
                        >
                          Make your predictions
                        </Button>
                      </Link>
                    )}
                    {isFinished && (
                      <Button 
                        disabled 
                        className="season-overview-btn-finished"
                        style={{ 
                          borderColor: raceColors.primary,
                          color: raceColors.primary,
                          opacity: 0.6
                        }}
                      >
                        {race.name.includes("Sprint") ? "Sprint Finished" : "Race Finished"}
                      </Button>
                    )}
                    {isLocked && (
                      <Button 
                        disabled 
                        className="season-overview-btn-locked"
                        style={{ 
                          borderColor: raceColors.primary,
                          color: raceColors.primary,
                          opacity: 0.4
                        }}
                      >
                        Locked
                      </Button>
                    )}
                  </div>
                )}
              />
            )
          })
          })()}
        </div>
      </main>
      </F1Background>
    </div>
  )
}

import { useMemo } from "react"
import { RACES, SPRINTS } from "@/lib/f1-presets"
import { F1Header } from "@/frontend/components/f1-header"
import { F1Background } from "@/frontend/components/blank-background"
import { FeatureRace } from "@/frontend/components/FeatureRace"
import { Button } from "@/frontend/components/button"
import { Link } from "react-router-dom"

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
    <div className="min-h-screen w-full relative overflow-x-hidden">
      <F1Background>
      <F1Header variant="Home" activeNav="Season" />
      
      <main className="relative z-10 pt-24 pb-12 px-4 md:px-8 container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center uppercase tracking-wider">
          2026 Season Overview
        </h1>
        
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
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
                className="w-full transform transition-transform hover:scale-[1.01]"
                renderActions={(raceColors) => (
                  <div className="mt-4 flex justify-start">
                    {isNext && (
                      <Link to="/race-predictions">
                        <Button 
                          className="font-bold uppercase tracking-wider text-white border-none px-8 shadow-lg"
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
                        className="font-bold uppercase tracking-wider bg-transparent px-8 cursor-default hover:bg-transparent"
                        style={{ 
                          borderColor: raceColors.primary,
                          borderWidth: '2px',
                          borderStyle: 'solid',
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
                        className="font-bold uppercase tracking-wider bg-transparent px-8 cursor-default hover:bg-transparent"
                        style={{ 
                          borderColor: raceColors.primary,
                          borderWidth: '2px',
                          borderStyle: 'solid',
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

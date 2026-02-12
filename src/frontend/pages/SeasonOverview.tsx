import { useMemo } from "react"
import { RACES, SPRINTS } from "@/lib/f1-presets"
import { F1Header } from "@/frontend/components/f1-header"
import { F1Background } from "@/frontend/components/blank-background"
import { FeatureRace } from "@/frontend/components/FeatureRace"

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
      <F1Header activeNav="Season" />
      
      <main className="relative z-10 pt-24 pb-12 px-4 md:px-8 container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center uppercase tracking-wider">
          2026 Season Overview
        </h1>
        
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          {allRaces.map((race) => (
            <FeatureRace 
              key={race.id} 
              race={race}
              className="w-full transform transition-transform hover:scale-[1.01]"
            />
          ))}
        </div>
      </main>
      </F1Background>
    </div>
  )
}

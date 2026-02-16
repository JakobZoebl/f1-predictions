"use client"

import { useState, useCallback, useMemo } from "react"
import { F1Header } from "@/frontend/components/f1-header"
import { F1Footer } from "@/frontend/components/f1-footer"
import { F1Background } from "@/frontend/components/blank-background"
import { DriverDragDrop } from "@/frontend/predictions/DriverDragDrop"
import { ConstructorDragDrop } from "@/frontend/predictions/ConstructorDragDrop"
import { SeasonBonusPredictions, type SeasonBonusValues } from "@/frontend/predictions/SeasonBonusPredictions"
import { PredictionSummary } from "@/frontend/predictions/PredictionSummary"
import { RACES, DRIVERS, TEAMS } from "@/lib/f1-presets"
import "@/frontend/styles/SeasonPredictions.css"

const SEASON_DRIVER_POINTS = [
  250, 180, 150, 120, 100, 80, 60, 40, 20, 10, // Top 10
  10, 10, 10, 10, 10, 10, 10, 10, 10, 10,      // 11-20
  10, 10                                      // 21-22
]

const SEASON_CONSTRUCTOR_POINTS = [
  250, 180, 150, 120, 100, // Top 5
  10, 10, 10, 10, 10, 10   // 6-11
]

const INITIAL_BONUS: SeasonBonusValues = {
  most_poles: "",
  most_fastest_laps: "",
  most_retirements: "",
}

export default function SeasonPredictions() {
  const [selectedDrivers, setSelectedDrivers] = useState<(string | null)[]>(Array(22).fill(null))
  const [selectedConstructors, setSelectedConstructors] = useState<(string | null)[]>(Array(11).fill(null))
  const [bonusValues, setBonusValues] = useState<SeasonBonusValues>(INITIAL_BONUS)

  const firstRace = RACES.find(r => r.round === 1)
  const isLocked = useMemo(() => {
    if (!firstRace) return false
    const firstRaceDate = new Date(`${firstRace.date}T${firstRace.time.split(' ')[0]}:00Z`)
    return new Date() >= firstRaceDate
  }, [firstRace])

  const handleDriversChange = useCallback((drivers: (string | null)[]) => {
    if (!isLocked) setSelectedDrivers(drivers)
  }, [isLocked])

  const handleConstructorsChange = useCallback((constructors: (string | null)[]) => {
    if (!isLocked) setSelectedConstructors(constructors)
  }, [isLocked])

  const handleBonusChange = useCallback((values: SeasonBonusValues) => {
    if (!isLocked) setBonusValues(values)
  }, [isLocked])

  // Validation
  const filledDriversCount = selectedDrivers.filter(Boolean).length
  const filledConstructorsCount = selectedConstructors.filter(Boolean).length
  const bonusFilledCount = Object.values(bonusValues).filter(Boolean).length
  
  const handleSubmit = () => {
    console.log("Submitting Season Predictions:", {
      drivers: selectedDrivers,
      constructors: selectedConstructors,
      bonus: bonusValues
    })
    // TODOS: Implement Supabase submission
  }

  // Auto-fill for testing/convenience (Optional, maybe remove later)
  const handleAutoFill = () => {
    if (isLocked) return
    const drivers = Object.keys(DRIVERS)
    setSelectedDrivers(drivers)
    setSelectedConstructors(Object.keys(TEAMS))
    
    // Randomly select bonus values
    const randomDriver = () => drivers[Math.floor(Math.random() * drivers.length)]
    setBonusValues({
      most_poles: randomDriver(),
      most_fastest_laps: randomDriver(),
      most_retirements: randomDriver(),
    })
  }

  return (
    <F1Background>
      <F1Header variant="Home" activeNav="Season Preds" isAuthenticated={true} username="max_verstappen" />

      <main className="container mx-auto px-4 py-8 space-y-8 flex-1">
        <div className="prediction-header-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="relative z-10">
             <h1 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-wide text-white mb-3 text-shadow-lg">
               2026 Season Predictions
             </h1>
             <p className="text-white/70 text-base md:text-lg max-w-2xl font-light">
               Predict the final standings for the 2026 Season.
               {firstRace && (
                 <span className="text-red-400 font-medium mt-2 flex items-center gap-2">
                   <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
                   Locks before {firstRace.name} ({new Date(firstRace.date).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })})
                 </span>
               )}
             </p>
          </div>
          
          {isLocked && (
            <div className="relative z-10 bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-3 rounded-xl font-display font-bold uppercase tracking-wider shadow-lg shadow-red-500/10">
              Predictions Locked
            </div>
          )}
        </div>

        {/* Drivers Championship */}
        <section className="prediction-section">
          <div className="prediction-section-title">
            <h2>Drivers Championship</h2>
            <span className="max-pts">max 1720 pts</span>
          </div>
          <DriverDragDrop
            selected={selectedDrivers}
            onChange={handleDriversChange}
            slotCount={22}
            points={SEASON_DRIVER_POINTS}
            poolLabel="Remaining Drivers: {count}"
            twoColumns={true}
          />
        </section>

        {/* Constructors Championship */}
        <section className="prediction-section">
          <div className="prediction-section-title">
            <h2>Constructors Championship</h2>
            <span className="max-pts">max 910 pts</span>
          </div>
          <ConstructorDragDrop
            selected={selectedConstructors}
            onChange={handleConstructorsChange}
            slotCount={11}
            points={SEASON_CONSTRUCTOR_POINTS}
            poolLabel="Remaining Constructors: {count}"
          />
        </section>

        {/* Season Statistics */}
        <section className="prediction-section">
          <div className="prediction-section-title">
            <h2>Season Statistics</h2>
            <span className="max-pts">max 300 pts</span>
          </div>
          <SeasonBonusPredictions
            values={bonusValues}
            onChange={handleBonusChange}
          />
        </section>

        {/* Summary & Submit */}
        <PredictionSummary
          driverCount={filledDriversCount}
          constructorCount={filledConstructorsCount}
          bonusCount={bonusFilledCount}
          totalBonusFields={3}
          totalDrivers={22}
          totalConstructors={11}
          maxPoints={{
            drivers: 1720,
            constructors: 910,
            bonus: 300
          }}
          labels={{
            drivers: "Drivers Championship",
            constructors: "Constructors Championship",
            bonus: "Season Statistics"
          }}
          onAutoFill={!isLocked ? handleAutoFill : undefined}
          onSubmit={handleSubmit}
        />

      </main>

      <F1Footer />
    </F1Background>
  )
}

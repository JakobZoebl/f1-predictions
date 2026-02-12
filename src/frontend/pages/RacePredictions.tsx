"use client"

import { useState, useCallback } from "react"
import { F1Header } from "@/frontend/components/f1-header"
import { F1Footer } from "@/frontend/components/f1-footer"
import { F1Background } from "@/frontend/components/blank-background"
import { FeatureRace } from "@/frontend/components/FeatureRace"
import { DriverDragDrop } from "@/frontend/predictions/DriverDragDrop"
import { ConstructorDragDrop } from "@/frontend/predictions/ConstructorDragDrop"
import { BonusPredictions, type BonusValues } from "@/frontend/predictions/BonusPredictions"
import { PredictionSummary } from "@/frontend/predictions/PredictionSummary"
import { useNextRace } from "@/lib/hooks/useNextRace"
import "@/frontend/styles/RacePredictions.css"

const INITIAL_BONUS: BonusValues = {
  pole_position: "",
  fastest_lap: "",
  first_retirement: "",
  safety_car: false,
  red_flag: false,
}

export default function RacePredictions() {
  const [selectedDrivers, setSelectedDrivers] = useState<(string | null)[]>(Array(10).fill(null))
  const [selectedConstructors, setSelectedConstructors] = useState<(string | null)[]>(Array(5).fill(null))
  const [bonusValues, setBonusValues] = useState<BonusValues>(INITIAL_BONUS)

  const nextRace = useNextRace()
  const primaryColor = nextRace?.colors?.primary

  const handleDriversChange = useCallback((drivers: (string | null)[]) => {
    setSelectedDrivers(drivers)
  }, [])

  const handleConstructorsChange = useCallback((constructors: (string | null)[]) => {
    setSelectedConstructors(constructors)
  }, [])

  const handleBonusChange = useCallback((values: BonusValues) => {
    setBonusValues(values)
  }, [])

  // Count filled bonus fields
  const bonusFilledCount = [
    bonusValues.pole_position,
    bonusValues.fastest_lap,
    bonusValues.first_retirement,
  ].filter(Boolean).length

  // Filter out nulls for counts
  const filledDriversCount = selectedDrivers.filter(Boolean).length
  const filledConstructorsCount = selectedConstructors.filter(Boolean).length

  return (
    <F1Background primaryColor={primaryColor}>
      <F1Header variant="dashboard" activeNav="Predictions" primaryColor={primaryColor} />

      <main className="container mx-auto px-4 py-8 space-y-8 flex-1">
        {/* Race Info Banner */}
        <FeatureRace />

        {/* Top 10 Drivers */}
        <section className="prediction-section">
          <div className="prediction-section-title">
            <h2>Top 10 Drivers</h2>
            <span className="max-pts">max 152 pts</span>
          </div>
          <DriverDragDrop
            selected={selectedDrivers}
            onChange={handleDriversChange}
          />
        </section>

        {/* Top 5 Constructors */}
        <section className="prediction-section">
          <div className="prediction-section-title">
            <h2>Top 5 Constructors</h2>
            <span className="max-pts">max 70 pts</span>
          </div>
          <ConstructorDragDrop
            selected={selectedConstructors}
            onChange={handleConstructorsChange}
          />
        </section>

        {/* Bonus Predictions */}
        <section className="prediction-section">
          <div className="prediction-section-title">
            <h2>Bonus Predictions</h2>
            <span className="max-pts">max 41 pts</span>
          </div>
          <BonusPredictions
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
        />
      </main>

      <F1Footer primaryColor={primaryColor} />
    </F1Background>
  )
}

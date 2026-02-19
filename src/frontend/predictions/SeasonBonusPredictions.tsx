"use client"

import { DRIVERS } from "@/lib/f1-presets"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select"

export interface SeasonBonusValues {
  most_poles: string
  most_fastest_laps: string
  most_retirements: string
}

interface SeasonBonusPredictionsProps {
  values: SeasonBonusValues
  onChange: (values: SeasonBonusValues) => void
}

export function SeasonBonusPredictions({ values, onChange }: SeasonBonusPredictionsProps) {
  const allDrivers = Object.entries(DRIVERS).map(([key, d]) => ({
    key,
    name: d.name,
  }))

  const updateField = <K extends keyof SeasonBonusValues>(
    field: K,
    value: SeasonBonusValues[K]
  ) => {
    onChange({ ...values, [field]: value })
  }

  return (
    <div className="bonus-grid">
      {/* Most Pole Positions */}
      <div className="bonus-item">
        <div className="bonus-item-header">
          <span className="bonus-item-label">Most Pole Positions</span>
          <span className="bonus-item-pts">100 pts</span>
        </div>
        <Select
          value={values.most_poles}
          onValueChange={(val) => updateField("most_poles", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a driver..." />
          </SelectTrigger>
          <SelectContent>
            {allDrivers.map((d) => (
              <SelectItem key={d.key} value={d.key}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Most Fastest Laps */}
      <div className="bonus-item">
        <div className="bonus-item-header">
          <span className="bonus-item-label">Most Fastest Laps</span>
          <span className="bonus-item-pts">100 pts</span>
        </div>
        <Select
          value={values.most_fastest_laps}
          onValueChange={(val) => updateField("most_fastest_laps", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a driver..." />
          </SelectTrigger>
          <SelectContent>
            {allDrivers.map((d) => (
              <SelectItem key={d.key} value={d.key}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Most Retirements */}
      <div className="bonus-item">
        <div className="bonus-item-header">
          <span className="bonus-item-label">Most Retirements</span>
          <span className="bonus-item-pts">100 pts</span>
        </div>
        <Select
          value={values.most_retirements}
          onValueChange={(val) => updateField("most_retirements", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a driver..." />
          </SelectTrigger>
          <SelectContent>
            {allDrivers.map((d) => (
              <SelectItem key={d.key} value={d.key}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

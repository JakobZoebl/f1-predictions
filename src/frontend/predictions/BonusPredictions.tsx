"use client"

import { DRIVERS } from "@/lib/f1-presets"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select"

export interface BonusValues {
  pole_position: string
  fastest_lap: string
  first_retirement: string
  safety_car: boolean
  red_flag: boolean
}

interface BonusPredictionsProps {
  values: BonusValues
  onChange: (values: BonusValues) => void
}

function ToggleSwitch({
  label,
  value,
  onChange,
  pointsLabel,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
  pointsLabel: string
}) {
  return (
    <div className="bonus-item">
      <div className="bonus-item-header">
        <span className="bonus-item-label">{label}</span>
        <span className="bonus-item-pts">{pointsLabel}</span>
      </div>
      <div className="toggle-container">
        <div className="toggle-labels">
          <span className={`toggle-label-no ${!value ? "active" : ""}`}>
            No
          </span>
          <button
            type="button"
            className={`toggle-switch ${value ? "active" : ""}`}
            onClick={() => onChange(!value)}
            role="switch"
            aria-checked={value}
            aria-label={label}
          >
            <div className="toggle-knob" />
          </button>
          <span className={`toggle-label-yes ${value ? "active" : ""}`}>
            Yes
          </span>
        </div>
      </div>
    </div>
  )
}

export function BonusPredictions({ values, onChange }: BonusPredictionsProps) {
  const allDrivers = Object.entries(DRIVERS).map(([key, d]) => ({
    key,
    name: d.name,
  }))

  const updateField = <K extends keyof BonusValues>(
    field: K,
    value: BonusValues[K]
  ) => {
    onChange({ ...values, [field]: value })
  }

  return (
    <div className="bonus-grid">
      {/* Pole Position */}
      <div className="bonus-item">
        <div className="bonus-item-header">
          <span className="bonus-item-label">🏁 Pole Position</span>
          <span className="bonus-item-pts">10 pts</span>
        </div>
        <Select
          value={values.pole_position}
          onValueChange={(val) => updateField("pole_position", val)}
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

      {/* Fastest Lap */}
      <div className="bonus-item">
        <div className="bonus-item-header">
          <span className="bonus-item-label">⚡ Fastest Lap</span>
          <span className="bonus-item-pts">10 pts</span>
        </div>
        <Select
          value={values.fastest_lap}
          onValueChange={(val) => updateField("fastest_lap", val)}
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

      {/* First Retirement */}
      <div className="bonus-item">
        <div className="bonus-item-header">
          <span className="bonus-item-label">❌ First Retirement</span>
          <span className="bonus-item-pts">10 pts</span>
        </div>
        <Select
          value={values.first_retirement}
          onValueChange={(val) => updateField("first_retirement", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a driver..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no_retirement">No retirements</SelectItem>
            {allDrivers.map((d) => (
              <SelectItem key={d.key} value={d.key}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Safety Car */}
      <ToggleSwitch
        label="🚗 Safety Car"
        value={values.safety_car}
        onChange={(v) => updateField("safety_car", v)}
        pointsLabel="5 pts"
      />

      {/* Red Flag */}
      <ToggleSwitch
        label="🚨 Red Flag"
        value={values.red_flag}
        onChange={(v) => updateField("red_flag", v)}
        pointsLabel="1pt No / 5pts Yes"
      />
    </div>
  )
}

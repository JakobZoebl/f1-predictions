"use client"

import { useState, useCallback } from "react"
import { DRIVERS, TEAMS } from "@/lib/f1-presets"

const POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]

interface DriverDragDropProps {
  selected: (string | null)[]
  onChange: (selected: (string | null)[]) => void
}

export function DriverDragDrop({ selected, onChange }: DriverDragDropProps) {
  const [draggedDriver, setDraggedDriver] = useState<string | null>(null)
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null)

  const allDriverKeys = Object.keys(DRIVERS)
  const poolDrivers = allDriverKeys.filter((key) => !selected.includes(key))

  const handleDragStart = useCallback((driverKey: string) => {
    setDraggedDriver(driverKey)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedDriver(null)
    setDragOverSlot(null)
  }, [])

  const handleSlotDrop = useCallback(
    (targetIndex: number) => {
      if (!draggedDriver) return

      const newSelected = [...selected]
      const oldIndex = newSelected.indexOf(draggedDriver)
      const targetDriver = newSelected[targetIndex]

      // Place dragged driver in target slot
      newSelected[targetIndex] = draggedDriver

      // If dragged from another slot, swap by placing the target driver in the old slot
      if (oldIndex !== -1) {
        newSelected[oldIndex] = targetDriver
      }
      
      // If dragged from pool (oldIndex === -1), the target driver is overwritten 
      // and effectively removed from the board (returned to pool).

      onChange(newSelected)
      setDraggedDriver(null)
      setDragOverSlot(null)
    },
    [draggedDriver, selected, onChange]
  )

  const handleRemoveFromSlot = useCallback(
    (driverKey: string) => {
      const newSelected = [...selected]
      const index = newSelected.indexOf(driverKey)
      if (index !== -1) {
        newSelected[index] = null
        onChange(newSelected)
      }
    },
    [selected, onChange]
  )

  return (
    <div>
      {/* Top 10 Slots */}
      <div className="dnd-slots-container">
        {Array.from({ length: 10 }, (_, i) => {
          const driverKey = selected[i]
          const driver = driverKey ? DRIVERS[driverKey] : null
          const team = driver ? TEAMS[driver.team] : null

          return (
            <div
              key={i}
              className={`dnd-slot ${dragOverSlot === i ? "drag-over" : ""} ${driver ? "cursor-grab" : ""}`}
              draggable={!!driver}
              onDragStart={() => {
                if (driverKey) handleDragStart(driverKey)
              }}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOverSlot(i)
              }}
              onDragLeave={() => setDragOverSlot(null)}
              onDrop={(e) => {
                e.preventDefault()
                handleSlotDrop(i)
              }}
            >
              <span className="dnd-slot-position">P{i + 1}</span>

              {driver && team ? (
                <div className="dnd-slot-driver">
                  <div
                    className="team-accent"
                    style={{ backgroundColor: driver.colors.primary }}
                  />
                  <div className="driver-info">
                    <span className="driver-name">{driver.name}</span>
                    <span className="driver-team">{team.name}</span>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation() // prevent drag start on remove click
                      if (driverKey) {
                        handleRemoveFromSlot(driverKey)
                      }
                    }}
                    onMouseDown={(e) => e.stopPropagation()} 
                    aria-label={`Remove ${driver.name}`}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <span className="dnd-slot-empty">
                  Drag a driver here
                </span>
              )}

              <span className="dnd-slot-points">{POINTS[i]} pts</span>
            </div>
          )
        })}
      </div>

      {/* Remaining Drivers Pool */}
      {poolDrivers.length > 0 && (
        <>
          <p className="dnd-pool-label">
            Remaining Drivers ({poolDrivers.length}) — 2 pts each if in top 10
          </p>
          <div className="dnd-pool">
            {poolDrivers.map((key) => {
              const driver = DRIVERS[key]
              return (
                <div
                  key={key}
                  className={`dnd-pool-item ${draggedDriver === key ? "dragging" : ""}`}
                  draggable
                  onDragStart={() => handleDragStart(key)}
                  onDragEnd={handleDragEnd}
                >
                  <div
                    className="team-accent"
                    style={{ backgroundColor: driver.colors.primary }}
                  />
                  <span className="driver-number">#{driver.number}</span>
                  <span className="driver-name">{driver.name}</span>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
